var Tb = Object.defineProperty;
var Bb = (t, e, n) => e in t ? Tb(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ho = (t, e, n) => Bb(t, typeof e != "symbol" ? e + "" : e, n);
var xn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function R0(t) {
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
      typeof xn < "u" && xn || {}, r = {
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
      function d(y) {
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
          var y = d(this);
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
            var y = d(this);
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
          var y = d(this);
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
      var j = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function k(y) {
        var $ = y.toUpperCase();
        return j.indexOf($) > -1 ? $ : y;
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
      function Y(y) {
        var $ = new h(), M = y.replace(/\r?\n[\t ]+/g, " ");
        return M.split("\r").map(function(T) {
          return T.indexOf(`
`) === 0 ? T.substr(1, T.length) : T;
        }).forEach(function(T) {
          var K = T.split(":"), z = K.shift().trim();
          if (z) {
            var bt = K.join(":").trim();
            try {
              $.append(z, bt);
            } catch (at) {
              console.warn("Response " + at.message);
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
      var Z = [301, 302, 303, 307, 308];
      st.redirect = function(y, $) {
        if (Z.indexOf($) === -1)
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
      function q(y, $) {
        return new Promise(function(M, T) {
          var K = new B(y, $);
          if (K.signal && K.signal.aborted)
            return T(new e.DOMException("Aborted", "AbortError"));
          var z = new XMLHttpRequest();
          function bt() {
            z.abort();
          }
          z.onload = function() {
            var L = {
              statusText: z.statusText,
              headers: Y(z.getAllResponseHeaders() || "")
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
          function at(L) {
            try {
              return L === "" && n.location.href ? n.location.href : L;
            } catch {
              return L;
            }
          }
          if (z.open(K.method, at(K.url), !0), K.credentials === "include" ? z.withCredentials = !0 : K.credentials === "omit" && (z.withCredentials = !1), "responseType" in z && (r.blob ? z.responseType = "blob" : r.arrayBuffer && (z.responseType = "arraybuffer")), $ && typeof $.headers == "object" && !($.headers instanceof h || n.Headers && $.headers instanceof n.Headers)) {
            var Gt = [];
            Object.getOwnPropertyNames($.headers).forEach(function(L) {
              Gt.push(a(L)), z.setRequestHeader(L, c($.headers[L]));
            }), K.headers.forEach(function(L, H) {
              Gt.indexOf(H) === -1 && z.setRequestHeader(H, L);
            });
          } else
            K.headers.forEach(function(L, H) {
              z.setRequestHeader(H, L);
            });
          K.signal && (K.signal.addEventListener("abort", bt), z.onreadystatechange = function() {
            z.readyState === 4 && K.signal.removeEventListener("abort", bt);
          }), z.send(typeof K._bodyInit > "u" ? null : K._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = h, n.Request = B, n.Response = st), e.Headers = h, e.Request = B, e.Response = st, e.fetch = q, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : xn);
})();
const Mb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Nb(t, e) {
  const n = {};
  return Object.assign(n, Mb, e), await fetch(t, n);
}
function _b(t) {
  let e = Nb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Pb(...t) {
  const { fetchLib: e, middlewares: n } = _b(t);
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
var lo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(lo || (lo = {}));
var ui;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ui || (ui = {}));
var Zf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zf || (Zf = {}));
const Ub = "https://api.mainnet.hiro.so", Hb = "https://api.testnet.hiro.so", Ob = "http://localhost:3999", Db = ["mainnet", "testnet", "devnet", "mocknet"];
let uo = class {
  constructor(e) {
    this.version = ui.Mainnet, this.chainId = lo.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ui.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Pb();
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
uo.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new iu();
    case "testnet":
      return new Fb();
    case "devnet":
      return new jb();
    case "mocknet":
      return new z0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Db.join(", ")}`);
  }
};
uo.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : uo.fromName(t);
let iu = class extends uo {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ub,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ui.Mainnet, this.chainId = lo.Mainnet;
  }
}, Fb = class extends uo {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Hb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ui.Testnet, this.chainId = lo.Testnet;
  }
}, z0 = class extends uo {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ob,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ui.Testnet, this.chainId = lo.Testnet;
  }
};
const jb = z0, G0 = "xtrata.wallet.bridge.v1", Rb = (t) => typeof t == "object" && t !== null && t.protocol === G0, zb = (t) => Rb(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Gb = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Oo extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Qf = 12e4;
class Kb {
  constructor(e) {
    Ho(this, "pending", /* @__PURE__ */ new Map());
    Ho(this, "listenTarget");
    Ho(this, "closed", !1);
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
    Ho(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !zb(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Oo("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Oo("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Oo("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Gb(), i = { protocol: G0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Oo(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Qf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Qf);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Oo("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Vb = ["SP", "SM"], qb = ["ST", "SN"], Yb = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Vb.includes(n) ? "mainnet" : qb.includes(n) ? "testnet" : null;
}, Xb = () => {
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
}, Wb = () => typeof window > "u" || !window.localStorage ? Xb() : window.localStorage, Al = "xtrata.v15.1.wallet.session", Jf = "mainnet", hc = { isConnected: !1 }, Zb = (t) => t.address ? Yb(t.address) ?? t.network : t.network, K0 = (t) => !t.isConnected || !t.address ? { ...hc } : Zb(t) !== Jf ? { ...hc } : {
  isConnected: !0,
  address: t.address,
  network: Jf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Qb = (t) => {
  if (!t)
    return { ...hc };
  try {
    const e = JSON.parse(t);
    return K0(e);
  } catch {
    return { ...hc };
  }
}, Jb = (t) => {
  const e = K0(t);
  return JSON.stringify(e);
}, tm = (t) => {
  const e = Wb();
  return {
    load: () => Qb(e.getItem(Al)),
    save: (n) => {
      e.setItem(Al, Jb(n));
    },
    clear: () => {
      e.removeItem(Al);
    }
  };
}, em = "https://browser.blockstack.org/auth", nm = {
  "@type": "Person",
  "@context": "http://schema.org"
}, V0 = ["store_write"], rm = "blockstack-session", sm = {
  logLevel: "debug"
}, Ii = {
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
Object.freeze(Ii);
class Lo extends Error {
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
class im extends Lo {
  constructor(e, n = "") {
    super({ code: Ii.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class th extends Lo {
  constructor(e = "") {
    super({ code: Ii.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ka extends Lo {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ii.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class eh extends Lo {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ii.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class ou extends Lo {
  constructor(e) {
    super({ code: Ii.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class q0 extends Lo {
  constructor(e) {
    super({ code: Ii.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const nh = ["debug", "info", "warn", "error", "none"], au = {};
for (let t = 0; t < nh.length; t++) {
  const e = nh[t];
  au[e] = t;
}
class no {
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
    return au[sm.logLevel] <= au[e];
  }
}
function om() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function am() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function vl(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function cm() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function lm() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function um(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function gd(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = lm(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    no.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = um(s, t.toString(), n);
    throw no.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Hs(t, e) {
  return yd(dn(t), e);
}
function dn(t) {
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
  if (In(t, Uint8Array))
    return BigInt(`0x${mt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function dm(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function rh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function pa(t, e = 8) {
  return (typeof t == "bigint" ? t : dn(t)).toString(16).padStart(e * 2, "0");
}
function Kc(t) {
  return parseInt(t, 16);
}
function yd(t, e = 16) {
  const n = pa(t, e);
  return Wt(n);
}
function fm(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function hm(t, e) {
  return t & BigInt(1) << e;
}
function cu(t) {
  return pm(BigInt(`0x${mt(t)}`), BigInt(t.byteLength * 8));
}
function pm(t, e) {
  return hm(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const gm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function mt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += gm[n];
  return e;
}
function Wt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = dm(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Li(t) {
  return new TextEncoder().encode(t);
}
function ga(t) {
  return new TextDecoder().decode(t);
}
function ym(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function wm(t) {
  return String.fromCharCode.apply(null, t);
}
function bm(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function sh(t) {
  if (t.some(bm))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function vr(...t) {
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
function Fe(t) {
  return vr(...t.map((e) => typeof e == "number" ? sh([e]) : e instanceof Array ? sh(e) : e));
}
function In(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Y0 = "https://api.mainnet.hiro.so", X0 = "https://api.testnet.hiro.so", W0 = "http://localhost:3999", mm = "https://hub.blockstack.org", xm = 33, kl = 32;
function Sm(t) {
  if (t.length < kl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + kl * 2), r = t.slice(2 + kl * 2);
  return {
    recoveryId: Kc(e),
    r: n,
    s: r
  };
}
function wd(t) {
  const e = typeof t == "string" ? Wt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Em(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Am(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function vm(t, e) {
  return t[e];
}
function km(t, e, n = 0) {
  return t[n] = e, t;
}
function $m(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function di(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Im = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Lm(t, e) {
  const n = {};
  return Object.assign(n, Im, e), await fetch(t, n);
}
function Cm(t) {
  let e = Lm, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Tm(...t) {
  const { fetchLib: e, middlewares: n } = Cm(t);
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
class Z0 {
  constructor(e = V0.slice(), n = ((a) => (a = gd("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = em) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function lu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Bm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Q0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Mm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  lu(t.outputLen), lu(t.blockLen);
}
function Nm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _m(t, e) {
  Q0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ei = {
  number: lu,
  bool: Bm,
  bytes: Q0,
  hash: Mm,
  exists: Nm,
  output: _m
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $l = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), dr = (t, e) => t << 32 - e | t >>> e, Pm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Pm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Um(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function bd(t) {
  if (typeof t == "string" && (t = Um(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let J0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ci(t) {
  const e = (r) => t().update(bd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let tg = class extends J0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ei.hash(e);
    const r = bd(n);
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
    return ei.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ei.exists(this), ei.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Vc = (t, e, n) => new tg(t, e).update(n).digest();
Vc.create = (t, e) => new tg(t, e);
function Hm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let md = class extends J0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = $l(this.buffer);
  }
  update(e) {
    ei.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = bd(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = $l(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ei.exists(this), ei.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let d = o; d < s; d++)
      n[d] = 0;
    Hm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = $l(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < l; d++)
      a.setUint32(4 * d, h[d], i);
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
const Om = (t, e, n) => t & e ^ ~t & n, Dm = (t, e, n) => t & e ^ t & n ^ e & n, Fm = new Uint32Array([
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
]), os = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), as = new Uint32Array(64);
let eg = class extends md {
  constructor() {
    super(64, 32, 8, !1), this.A = os[0] | 0, this.B = os[1] | 0, this.C = os[2] | 0, this.D = os[3] | 0, this.E = os[4] | 0, this.F = os[5] | 0, this.G = os[6] | 0, this.H = os[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      as[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = as[d - 15], g = as[d - 2], A = dr(w, 7) ^ dr(w, 18) ^ w >>> 3, v = dr(g, 17) ^ dr(g, 19) ^ g >>> 10;
      as[d] = v + as[d - 7] + A + as[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = dr(a, 6) ^ dr(a, 11) ^ dr(a, 25), g = h + w + Om(a, c, l) + Fm[d] + as[d] | 0, v = (dr(r, 2) ^ dr(r, 13) ^ dr(r, 22)) + Dm(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    as.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, jm = class extends eg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const fo = Ci(() => new eg());
Ci(() => new jm());
const Rm = {}, ng = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Rm
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Yt = BigInt(0), Se = BigInt(1), Ms = BigInt(2), Yo = BigInt(3), ih = BigInt(8), le = Object.freeze({
  a: Yt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Se,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), oh = (t, e) => (t + e / Ms) / e, $a = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = le, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Se * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = oh(i * t, e), c = oh(-r * t, e);
    let l = rt(t - a * n - c * s, e), h = rt(-a * r - c * i, e);
    const d = l > o, w = h > o;
    if (d && (l = e - l), w && (h = e - h), l > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: d, k1: l, k2neg: w, k2: h };
  }
}, or = 32, fi = 32, rg = 32, pc = or + 1, gc = 2 * or + 1;
function ah(t) {
  const { a: e, b: n } = le, r = rt(t * t), s = rt(r * t);
  return rt(s + e * t + n);
}
const Ia = le.a === Yt;
class xd extends Error {
  constructor(e) {
    super(e);
  }
}
function ch(t) {
  if (!(t instanceof ee))
    throw new TypeError("JacobianPoint expected");
}
class ee {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Dt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Dt.ZERO) ? ee.ZERO : new ee(e.x, e.y, Se);
  }
  static toAffineBatch(e) {
    const n = qm(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return ee.toAffineBatch(e).map(ee.fromAffine);
  }
  equals(e) {
    ch(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = rt(s * s), l = rt(a * a), h = rt(n * l), d = rt(i * c), w = rt(rt(r * a) * l), g = rt(rt(o * s) * c);
    return h === d && w === g;
  }
  negate() {
    return new ee(this.x, rt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = rt(e * e), i = rt(n * n), o = rt(i * i), a = e + i, c = rt(Ms * (rt(a * a) - s - o)), l = rt(Yo * s), h = rt(l * l), d = rt(h - Ms * c), w = rt(l * (c - d) - ih * o), g = rt(Ms * n * r);
    return new ee(d, w, g);
  }
  add(e) {
    ch(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Yt || o === Yt)
      return this;
    if (n === Yt || r === Yt)
      return e;
    const c = rt(s * s), l = rt(a * a), h = rt(n * l), d = rt(i * c), w = rt(rt(r * a) * l), g = rt(rt(o * s) * c), A = rt(d - h), v = rt(g - w);
    if (A === Yt)
      return v === Yt ? this.double() : ee.ZERO;
    const C = rt(A * A), U = rt(A * C), j = rt(h * C), k = rt(v * v - U - Ms * j), B = rt(v * (j - k) - w * U), P = rt(s * a * A);
    return new ee(k, B, P);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = ee.ZERO;
    if (typeof e == "bigint" && e === Yt)
      return n;
    let r = dh(e);
    if (r === Se)
      return this;
    if (!Ia) {
      let d = n, w = this;
      for (; r > Yt; )
        r & Se && (d = d.add(w)), w = w.double(), r >>= Se;
      return d;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = $a.splitScalar(r), c = n, l = n, h = this;
    for (; i > Yt || a > Yt; )
      i & Se && (c = c.add(h)), a & Se && (l = l.add(h)), h = h.double(), i >>= Se, a >>= Se;
    return s && (c = c.negate()), o && (l = l.negate()), l = new ee(rt(l.x * $a.beta), l.y, l.z), c.add(l);
  }
  precomputeWindow(e) {
    const n = Ia ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(ee.BASE) && (n = Dt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && uu.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ee.normalizeZ(s), uu.set(n, s)));
    let i = ee.ZERO, o = ee.BASE;
    const a = 1 + (Ia ? 128 / r : 256 / r), c = 2 ** (r - 1), l = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let w = 0; w < a; w++) {
      const g = w * c;
      let A = Number(e & l);
      e >>= d, A > c && (A -= h, e += Se);
      const v = g, C = g + Math.abs(A) - 1, U = w % 2 !== 0, j = A < 0;
      A === 0 ? o = o.add(La(U, s[v])) : i = i.add(La(j, s[C]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = dh(e), s, i;
    if (Ia) {
      const { k1neg: o, k1: a, k2neg: c, k2: l } = $a.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: w, f: g } = this.wNAF(l, n);
      h = La(o, h), w = La(c, w), w = new ee(rt(w.x * $a.beta), w.y, w.z), s = h.add(w), i = d.add(g);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ee.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(ee.ZERO);
    e == null && (e = i ? ih : Co(s));
    const o = e, a = rt(o * o), c = rt(a * o), l = rt(n * a), h = rt(r * c), d = rt(s * o);
    if (i)
      return Dt.ZERO;
    if (d !== Se)
      throw new Error("invZ was invalid");
    return new Dt(l, h);
  }
}
ee.BASE = new ee(le.Gx, le.Gy, Se);
ee.ZERO = new ee(Yt, Se, Yt);
function La(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const uu = /* @__PURE__ */ new WeakMap();
class Dt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, uu.delete(this);
  }
  hasEvenY() {
    return this.y % Ms === Yt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Fn(n ? e : e.subarray(1));
    if (!rc(r))
      throw new Error("Point is not on curve");
    const s = ah(r);
    let i = Vm(s);
    const o = (i & Se) === Se;
    n ? o && (i = rt(-i)) : (e[0] & 1) === 1 !== o && (i = rt(-i));
    const a = new Dt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Fn(e.subarray(1, or + 1)), r = Fn(e.subarray(or + 1, or * 2 + 1)), s = new Dt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = kr(e), r = n.length, s = n[0];
    if (r === or)
      return this.fromCompressedHex(n);
    if (r === pc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === gc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${pc} compressed bytes or ${gc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Dt.BASE.multiply(hi(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = og(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Sd(kr(e)), { n: a } = le, c = r === 2 || r === 3 ? s + a : s, l = Co(c, a), h = rt(-o * l, a), d = rt(i * l, a), w = r & 1 ? "03" : "02", g = Dt.fromHex(w + Ns(c)), A = Dt.BASE.multiplyAndAddUnsafe(g, h, d);
    if (!A)
      throw new Error("Cannot recover signature: point at infinify");
    return A.assertValidity(), A;
  }
  toRawBytes(e = !1) {
    return _s(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ns(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ns(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!rc(n) || !rc(r))
      throw new Error(e);
    const s = rt(r * r), i = ah(n);
    if (rt(s - i) !== Yt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Dt(this.x, rt(-this.y));
  }
  double() {
    return ee.fromAffine(this).double().toAffine();
  }
  add(e) {
    return ee.fromAffine(this).add(ee.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return ee.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = ee.fromAffine(this), i = n === Yt || n === Se || this !== Dt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ee.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ee.ZERO) ? void 0 : a.toAffine();
  }
}
Dt.BASE = new Dt(le.Gx, le.Gy);
Dt.ZERO = new Dt(Yt, Yt);
function lh(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function uh(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${ho(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Fn(n), left: t.subarray(e + 2) };
}
function zm(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${ho(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = uh(t.subarray(2)), { data: r, left: s } = uh(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${ho(s)}`);
  return { r: e, s: r };
}
class Dn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? ho(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Dn(yc(s.slice(0, 64)), yc(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = zm(n ? e : _s(e));
    return new Dn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!go(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!go(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = le.n >> Se;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Dn(this.r, rt(-this.s, le.n)) : this;
  }
  toDERRawBytes() {
    return _s(this.toDERHex());
  }
  toDERHex() {
    const e = lh(Do(this.s)), n = lh(Do(this.r)), r = e.length / 2, s = n.length / 2, i = Do(r), o = Do(s);
    return `30${Do(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return _s(this.toCompactHex());
  }
  toCompactHex() {
    return Ns(this.r) + Ns(this.s);
  }
}
function Ts(...t) {
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
const Gm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ho(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Gm[t[n]];
  return e;
}
const Km = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ns(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Yt <= t && t < Km))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function po(t) {
  const e = _s(Ns(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Do(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function yc(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function _s(t) {
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
function Fn(t) {
  return yc(ho(t));
}
function kr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : _s(t);
}
function dh(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && go(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function rt(t, e = le.P) {
  const n = t % e;
  return n >= Yt ? n : e + n;
}
function zn(t, e) {
  const { P: n } = le;
  let r = t;
  for (; e-- > Yt; )
    r *= r, r %= n;
  return r;
}
function Vm(t) {
  const { P: e } = le, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, l = c * c * t % e, h = zn(l, Yo) * l % e, d = zn(h, Yo) * l % e, w = zn(d, Ms) * c % e, g = zn(w, r) * w % e, A = zn(g, s) * g % e, v = zn(A, o) * A % e, C = zn(v, a) * v % e, U = zn(C, o) * A % e, j = zn(U, Yo) * l % e, k = zn(j, i) * g % e, B = zn(k, n) * c % e, P = zn(B, Ms);
  if (P * P % e !== t)
    throw new Error("Cannot find square root");
  return P;
}
function Co(t, e = le.P) {
  if (t === Yt || e <= Yt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = rt(t, e), r = e, s = Yt, i = Se;
  for (; n !== Yt; ) {
    const a = r / n, c = r % n, l = s - i * a;
    r = n, n = c, s = i, i = l;
  }
  if (r !== Se)
    throw new Error("invert: does not exist");
  return rt(s, e);
}
function qm(t, e = le.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Yt ? i : (n[a] = i, rt(i * o, e)), Se), s = Co(r, e);
  return t.reduceRight((i, o, a) => o === Yt ? i : (n[a] = rt(i * n[a], e), rt(i * o, e)), s), n;
}
function Ym(t) {
  const e = t.length * 8 - fi * 8, n = Fn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Sd(t, e = !1) {
  const n = Ym(t);
  if (e)
    return n;
  const { n: r } = le;
  return n >= r ? n - r : n;
}
let ao, Xo;
class sg {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return _e.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Xo(this.k, ...e);
  }
  checkSync() {
    if (typeof Xo != "function")
      throw new xd("hmacSha256Sync needs to be set");
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
    return Ts(...n);
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
    return Ts(...n);
  }
}
function go(t) {
  return Yt < t && t < le.n;
}
function rc(t) {
  return Yt < t && t < le.P;
}
function ig(t, e, n, r = !0) {
  const { n: s } = le, i = Sd(t, !0);
  if (!go(i))
    return;
  const o = Co(i, s), a = Dt.BASE.multiply(i), c = rt(a.x, s);
  if (c === Yt)
    return;
  const l = rt(o * rt(e + n * c, s), s);
  if (l === Yt)
    return;
  let h = new Dn(c, l), d = (a.x === h.r ? 0 : 2) | Number(a.y & Se);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function hi(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * fi)
      throw new Error("Expected 32 bytes of private key");
    e = yc(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== fi)
      throw new Error("Expected 32 bytes of private key");
    e = Fn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!go(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Ed(t) {
  return t instanceof Dt ? (t.assertValidity(), t) : Dt.fromHex(t);
}
function og(t) {
  if (t instanceof Dn)
    return t.assertValidity(), t;
  try {
    return Dn.fromDER(t);
  } catch {
    return Dn.fromCompact(t);
  }
}
function ya(t, e = !1) {
  return Dt.fromPrivateKey(t).toRawBytes(e);
}
function Xm(t, e, n, r = !1) {
  return Dt.fromSignature(t, e, n).toRawBytes(r);
}
function fh(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === pc || r === gc : n ? r === pc * 2 || r === gc * 2 : t instanceof Dt;
}
function Ad(t, e, n = !1) {
  if (fh(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!fh(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Ed(e);
  return r.assertValidity(), r.multiply(hi(t)).toRawBytes(n);
}
function ag(t) {
  const e = t.length > or ? t.slice(0, or) : t;
  return Fn(e);
}
function Wm(t) {
  const e = ag(t), n = rt(e, le.n);
  return cg(n < Yt ? e : n);
}
function cg(t) {
  return po(t);
}
function lg(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = kr(t), s = hi(e), i = [cg(s), Wm(r)];
  if (n != null) {
    n === !0 && (n = _e.randomBytes(or));
    const c = kr(n);
    if (c.length !== or)
      throw new Error(`sign: Expected ${or} bytes of extra data`);
    i.push(c);
  }
  const o = Ts(...i), a = ag(r);
  return { seed: o, m: a, d: s };
}
function ug(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Zm(t, e, n = {}) {
  const { seed: r, m: s, d: i } = lg(t, e, n.extraEntropy), o = new sg(rg, fi);
  await o.reseed(r);
  let a;
  for (; !(a = ig(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return ug(a, n);
}
function qc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = lg(t, e, n.extraEntropy), o = new sg(rg, fi);
  o.reseedSync(r);
  let a;
  for (; !(a = ig(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return ug(a, n);
}
const Qm = { strict: !0 };
function Jm(t, e, n, r = Qm) {
  let s;
  try {
    s = og(t), e = kr(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Sd(e);
  let c;
  try {
    c = Ed(n);
  } catch {
    return !1;
  }
  const { n: l } = le, h = Co(o, l), d = rt(a * h, l), w = rt(i * h, l), g = Dt.BASE.multiplyAndAddUnsafe(c, d, w);
  return g ? rt(g.x, l) === i : !1;
}
function wc(t) {
  return rt(Fn(t), le.n);
}
class yo {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = kr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Fn(n.subarray(0, 32)), s = Fn(n.subarray(32, 64));
    return new yo(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!rc(e) || !go(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ns(this.r) + Ns(this.s);
  }
  toRawBytes() {
    return _s(this.toHex());
  }
}
function t1(t) {
  return Dt.fromPrivateKey(t).toRawX();
}
class dg {
  constructor(e, n, r = _e.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = kr(e);
    const { x: s, scalar: i } = this.getScalar(hi(n));
    if (this.px = s, this.d = i, this.rand = kr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Dt.fromPrivateKey(e), r = n.hasEvenY() ? e : le.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return po(e ^ Fn(n));
  }
  finalizeNonce(e) {
    const n = rt(Fn(e), le.n);
    if (n === Yt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new yo(e.x, rt(n + r * s, le.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = _e.taggedHash, o = this.initNonce(n, await i(Cs.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(await i(Cs.nonce, o, r, e)), h = wc(await i(Cs.challenge, c, r, e)), d = this.finalizeSig(a, l, h, n);
    return await pg(d, e, r) || this.error(), d;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = _e.taggedHashSync, o = this.initNonce(n, i(Cs.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(i(Cs.nonce, o, r, e)), h = wc(i(Cs.challenge, c, r, e)), d = this.finalizeSig(a, l, h, n);
    return gg(d, e, r) || this.error(), d;
  }
}
async function e1(t, e, n) {
  return new dg(t, e, n).calc();
}
function n1(t, e, n) {
  return new dg(t, e, n).calcSync();
}
function fg(t, e, n) {
  const r = t instanceof yo, s = r ? t : yo.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: kr(e),
    P: Ed(n)
  };
}
function hg(t, e, n, r) {
  const s = Dt.BASE.multiplyAndAddUnsafe(e, hi(n), rt(-r, le.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function pg(t, e, n) {
  try {
    const { r, s, m: i, P: o } = fg(t, e, n), a = wc(await _e.taggedHash(Cs.challenge, po(r), o.toRawX(), i));
    return hg(r, o, s, a);
  } catch {
    return !1;
  }
}
function gg(t, e, n) {
  try {
    const { r, s, m: i, P: o } = fg(t, e, n), a = wc(_e.taggedHashSync(Cs.challenge, po(r), o.toRawX(), i));
    return hg(r, o, s, a);
  } catch (r) {
    if (r instanceof xd)
      throw r;
    return !1;
  }
}
const r1 = {
  Signature: yo,
  getPublicKey: t1,
  sign: e1,
  verify: pg,
  signSync: n1,
  verifySync: gg
};
Dt.BASE._setWindowSize(8);
const _n = {
  node: ng,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Cs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ca = {}, _e = {
  bytesToHex: ho,
  hexToBytes: _s,
  concatBytes: Ts,
  mod: rt,
  invert: Co,
  isValidPrivateKey(t) {
    try {
      return hi(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: po,
  _normalizePrivateKey: hi,
  hashToPrivateKey: (t) => {
    t = kr(t);
    const e = fi + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = rt(Fn(t), le.n - Se) + Se;
    return po(n);
  },
  randomBytes: (t = 32) => {
    if (_n.web)
      return _n.web.getRandomValues(new Uint8Array(t));
    if (_n.node) {
      const { randomBytes: e } = _n.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => _e.hashToPrivateKey(_e.randomBytes(fi + 8)),
  precompute(t = 8, e = Dt.BASE) {
    const n = e === Dt.BASE ? e : new Dt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Yo), n;
  },
  sha256: async (...t) => {
    if (_n.web) {
      const e = await _n.web.subtle.digest("SHA-256", Ts(...t));
      return new Uint8Array(e);
    } else if (_n.node) {
      const { createHash: e } = _n.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (_n.web) {
      const n = await _n.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ts(...e), s = await _n.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (_n.node) {
      const { createHmac: n } = _n.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ca[t];
    if (n === void 0) {
      const r = await _e.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ts(r, r), Ca[t] = n;
    }
    return _e.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ao != "function")
      throw new xd("sha256Sync is undefined, you need to set it");
    let n = Ca[t];
    if (n === void 0) {
      const r = ao(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ts(r, r), Ca[t] = n;
    }
    return ao(n, ...e);
  },
  _JacobianPoint: ee
};
Object.defineProperties(_e, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ao;
    },
    set(t) {
      ao || (ao = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Xo;
    },
    set(t) {
      Xo || (Xo = t);
    }
  }
});
const s1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: le,
  Point: Dt,
  Signature: Dn,
  getPublicKey: ya,
  getSharedSecret: Ad,
  recoverPublicKey: Xm,
  schnorr: r1,
  sign: Zm,
  signSync: qc,
  utils: _e,
  verify: Jm
}, Symbol.toStringTag, { value: "Module" }));
var wa = {};
wa.byteLength = l1;
var i1 = wa.toByteArray = d1, o1 = wa.fromByteArray = p1, wr = [], Vn = [], a1 = typeof Uint8Array < "u" ? Uint8Array : Array, Il = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Xi = 0, c1 = Il.length; Xi < c1; ++Xi)
  wr[Xi] = Il[Xi], Vn[Il.charCodeAt(Xi)] = Xi;
Vn[45] = 62;
Vn[95] = 63;
function yg(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function l1(t) {
  var e = yg(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function u1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function d1(t) {
  var e, n = yg(t), r = n[0], s = n[1], i = new a1(u1(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Vn[t.charCodeAt(c)] << 18 | Vn[t.charCodeAt(c + 1)] << 12 | Vn[t.charCodeAt(c + 2)] << 6 | Vn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Vn[t.charCodeAt(c)] << 2 | Vn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Vn[t.charCodeAt(c)] << 10 | Vn[t.charCodeAt(c + 1)] << 4 | Vn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function f1(t) {
  return wr[t >> 18 & 63] + wr[t >> 12 & 63] + wr[t >> 6 & 63] + wr[t & 63];
}
function h1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(f1(r));
  return s.join("");
}
function p1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(h1(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    wr[e >> 2] + wr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    wr[e >> 10] + wr[e >> 4 & 63] + wr[e << 2 & 63] + "="
  )), s.join("");
}
function g1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const y1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function w1() {
  if (g1())
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
    throw new Error(y1);
  }
}
class b1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(vr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(vr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class m1 {
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
async function wg() {
  const t = await w1();
  return t.name === "subtleCrypto" ? new m1(t.lib) : new b1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function x1(t) {
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
    for (var j = (U - C) * l + 1 >>> 0, k = new Uint8Array(j); C !== U; ) {
      for (var B = g[C], P = 0, Y = j - 1; (B !== 0 || P < v) && Y !== -1; Y--, P++)
        B += 256 * k[Y] >>> 0, k[Y] = B % o >>> 0, B = B / o >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      v = P, C++;
    }
    for (var st = j - v; st !== j && k[st] === 0; )
      st++;
    for (var Z = a.repeat(A); st < j; ++st)
      Z += t.charAt(k[st]);
    return Z;
  }
  function d(g) {
    if (typeof g != "string")
      throw new TypeError("Expected String");
    if (g.length === 0)
      return new Uint8Array();
    for (var A = 0, v = 0, C = 0; g[A] === a; )
      v++, A++;
    for (var U = (g.length - A) * c + 1 >>> 0, j = new Uint8Array(U); g[A]; ) {
      var k = g.charCodeAt(A);
      if (k > 255)
        return;
      var B = e[k];
      if (B === 255)
        return;
      for (var P = 0, Y = U - 1; (B !== 0 || P < C) && Y !== -1; Y--, P++)
        B += o * j[Y] >>> 0, j[Y] = B % 256 >>> 0, B = B / 256 >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      C = P, A++;
    }
    for (var st = U - C; st !== U && j[st] === 0; )
      st++;
    for (var Z = new Uint8Array(v + (U - st)), q = v; st !== U; )
      Z[q++] = j[st++];
    return Z;
  }
  function w(g) {
    var A = d(g);
    if (A)
      return A;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: h,
    decodeUnsafe: d,
    decode: w
  };
}
var bg = x1;
const S1 = bg, E1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var A1 = S1(E1);
const v1 = /* @__PURE__ */ R0(A1), k1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), mg = Uint8Array.from({ length: 16 }, (t, e) => e), $1 = mg.map((t) => (9 * t + 5) % 16);
let vd = [mg], kd = [$1];
for (let t = 0; t < 4; t++)
  for (let e of [vd, kd])
    e.push(e[t].map((n) => k1[n]));
const xg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), I1 = vd.map((t, e) => t.map((n) => xg[e][n])), L1 = kd.map((t, e) => t.map((n) => xg[e][n])), C1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), T1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ta = (t, e) => t << e | t >>> 32 - e;
function hh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ba = new Uint32Array(16);
let B1 = class extends md {
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
      Ba[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, h = l, d = this.h4 | 0, w = d;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, v = C1[g], C = T1[g], U = vd[g], j = kd[g], k = I1[g], B = L1[g];
      for (let P = 0; P < 16; P++) {
        const Y = Ta(r + hh(g, i, a, l) + Ba[U[P]] + v, k[P]) + d | 0;
        r = d, d = l, l = Ta(a, 10) | 0, a = i, i = Y;
      }
      for (let P = 0; P < 16; P++) {
        const Y = Ta(s + hh(A, o, c, h) + Ba[j[P]] + C, B[P]) + w | 0;
        s = w, w = h, h = Ta(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + l + w | 0, this.h3 + d + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ba.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const M1 = Ci(() => new B1());
function N1(t) {
  return M1(t);
}
const Ma = BigInt(2 ** 32 - 1), du = BigInt(32);
function Sg(t, e = !1) {
  return e ? { h: Number(t & Ma), l: Number(t >> du & Ma) } : { h: Number(t >> du & Ma) | 0, l: Number(t & Ma) | 0 };
}
function _1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Sg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const P1 = (t, e) => BigInt(t >>> 0) << du | BigInt(e >>> 0), U1 = (t, e, n) => t >>> n, H1 = (t, e, n) => t << 32 - n | e >>> n, O1 = (t, e, n) => t >>> n | e << 32 - n, D1 = (t, e, n) => t << 32 - n | e >>> n, F1 = (t, e, n) => t << 64 - n | e >>> n - 32, j1 = (t, e, n) => t >>> n - 32 | e << 64 - n, R1 = (t, e) => e, z1 = (t, e) => t, G1 = (t, e, n) => t << n | e >>> 32 - n, K1 = (t, e, n) => e << n | t >>> 32 - n, V1 = (t, e, n) => e << n - 32 | t >>> 64 - n, q1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Y1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const X1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), W1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Z1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Q1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, J1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), t2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: Sg,
  split: _1,
  toBig: P1,
  shrSH: U1,
  shrSL: H1,
  rotrSH: O1,
  rotrSL: D1,
  rotrBH: F1,
  rotrBL: j1,
  rotr32H: R1,
  rotr32L: z1,
  rotlSH: G1,
  rotlSL: K1,
  rotlBH: V1,
  rotlBL: q1,
  add: Y1,
  add3L: X1,
  add3H: W1,
  add4L: Z1,
  add4H: Q1,
  add5H: t2,
  add5L: J1
}, [e2, n2] = Tt.split([
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
].map((t) => BigInt(t))), cs = new Uint32Array(80), ls = new Uint32Array(80);
let Yc = class extends md {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: h, Fh: d, Fl: w, Gh: g, Gl: A, Hh: v, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, l, h, d, w, g, A, v, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, h, d, w, g, A, v, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      cs[k] = e.getUint32(n), ls[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const B = cs[k - 15] | 0, P = ls[k - 15] | 0, Y = Tt.rotrSH(B, P, 1) ^ Tt.rotrSH(B, P, 8) ^ Tt.shrSH(B, P, 7), st = Tt.rotrSL(B, P, 1) ^ Tt.rotrSL(B, P, 8) ^ Tt.shrSL(B, P, 7), Z = cs[k - 2] | 0, q = ls[k - 2] | 0, y = Tt.rotrSH(Z, q, 19) ^ Tt.rotrBH(Z, q, 61) ^ Tt.shrSH(Z, q, 6), $ = Tt.rotrSL(Z, q, 19) ^ Tt.rotrBL(Z, q, 61) ^ Tt.shrSL(Z, q, 6), M = Tt.add4L(st, $, ls[k - 7], ls[k - 16]), T = Tt.add4H(M, Y, y, cs[k - 7], cs[k - 16]);
      cs[k] = T | 0, ls[k] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: h, Eh: d, El: w, Fh: g, Fl: A, Gh: v, Gl: C, Hh: U, Hl: j } = this;
    for (let k = 0; k < 80; k++) {
      const B = Tt.rotrSH(d, w, 14) ^ Tt.rotrSH(d, w, 18) ^ Tt.rotrBH(d, w, 41), P = Tt.rotrSL(d, w, 14) ^ Tt.rotrSL(d, w, 18) ^ Tt.rotrBL(d, w, 41), Y = d & g ^ ~d & v, st = w & A ^ ~w & C, Z = Tt.add5L(j, P, st, n2[k], ls[k]), q = Tt.add5H(Z, U, B, Y, e2[k], cs[k]), y = Z | 0, $ = Tt.rotrSH(r, s, 28) ^ Tt.rotrBH(r, s, 34) ^ Tt.rotrBH(r, s, 39), M = Tt.rotrSL(r, s, 28) ^ Tt.rotrBL(r, s, 34) ^ Tt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, j = C | 0, v = g | 0, C = A | 0, g = d | 0, A = w | 0, { h: d, l: w } = Tt.add(l | 0, h | 0, q | 0, y | 0), l = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = Tt.add3L(y, M, K);
      r = Tt.add3H(z, q, $, T), s = z | 0;
    }
    ({ h: r, l: s } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: h } = Tt.add(this.Dh | 0, this.Dl | 0, l | 0, h | 0), { h: d, l: w } = Tt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: g, l: A } = Tt.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: v, l: C } = Tt.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: U, l: j } = Tt.add(this.Hh | 0, this.Hl | 0, U | 0, j | 0), this.set(r, s, i, o, a, c, l, h, d, w, g, A, v, C, U, j);
  }
  roundClean() {
    cs.fill(0), ls.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, r2 = class extends Yc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, s2 = class extends Yc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, i2 = class extends Yc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const o2 = Ci(() => new Yc());
Ci(() => new r2());
Ci(() => new s2());
Ci(() => new i2());
function Eg(t) {
  return fo(t);
}
function a2(t) {
  return o2(t);
}
const c2 = 0;
_e.hmacSha256Sync = (t, ...e) => {
  const n = Vc.create(fo, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function l2() {
  return mt(_e.randomPrivateKey());
}
function u2(t) {
  const e = fo(fo(t));
  return v1.encode(vr(t, e).slice(0, t.length + 4));
}
function d2(t, e) {
  return u2(vr(new Uint8Array([t]), e.slice(0, 20)));
}
function Ag(t, e = c2) {
  const n = typeof t == "string" ? Wt(t) : t, r = N1(Eg(n));
  return d2(e, r);
}
function vg(t) {
  const e = wd(t);
  return mt(ya(e.slice(0, 32), !0));
}
_e.hmacSha256Sync = (t, ...e) => {
  const n = Vc.create(fo, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var bc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(bc || (bc = {}));
async function f2(t, e, n) {
  return await (await wg()).encrypt("aes-256-cbc", e, t, n);
}
async function h2(t, e, n) {
  return await (await wg()).decrypt("aes-256-cbc", e, t, n);
}
function kg(t, e) {
  return Vc(fo, t, e);
}
function p2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function $g(t) {
  const e = a2(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function g2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function y2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: bc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: bc.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !g2(t))
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
async function w2(t, e, n, r) {
  const s = y2(t);
  if (!s.result)
    throw s;
  const i = _e.randomPrivateKey(), o = ya(i, !0);
  let a = Ad(i, t, !0);
  a = a.slice(1);
  const c = $g(a), l = _e.randomBytes(16), h = await f2(l, c.encryptionKey, e), d = vr(l, o, h), w = kg(c.hmacKey, d);
  let g;
  if (!r || r === "hex")
    g = mt(h);
  else if (r === "base64")
    g = o1(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const A = {
    iv: mt(l),
    ephemeralPK: mt(o),
    cipherText: g,
    mac: mt(w),
    wasString: n
  };
  return r && r !== "hex" && (A.cipherTextEncoding = r), A;
}
async function Ig(t, e) {
  if (!e.ephemeralPK)
    throw new eh("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Ad(t, n, !0);
  r = r.slice(1);
  const s = $g(r), i = Wt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Wt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = i1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = vr(i, Wt(n), o), c = kg(s.hmacKey, a), l = Wt(e.mac);
  if (!p2(l, c))
    throw new eh("Decryption failed: failure in MAC check");
  const h = await h2(i, s.encryptionKey, o);
  return e.wasString ? ga(h) : h;
}
function b2(t, e) {
  const n = typeof e == "string" ? Li(e) : e, r = vg(t), s = Eg(n), i = qc(s, t);
  return {
    signature: mt(i),
    publicKey: r
  };
}
async function m2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = vg(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Li(t) : t, o = await w2(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = b2(r, a), l = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(l);
  }
  return a;
}
function x2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Ig(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var en = {}, wo = {}, bn = {};
Object.defineProperty(bn, "__esModule", { value: !0 });
bn.decode = bn.encode = bn.unescape = bn.escape = bn.pad = void 0;
const Lg = wa;
function $d(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
bn.pad = $d;
function Cg(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
bn.escape = Cg;
function Tg(t) {
  return $d(t).replace(/-/g, "+").replace(/_/g, "/");
}
bn.unescape = Tg;
function S2(t) {
  return Cg((0, Lg.fromByteArray)(new TextEncoder().encode(t)));
}
bn.encode = S2;
function E2(t) {
  return new TextDecoder().decode((0, Lg.toByteArray)($d(Tg(t))));
}
bn.decode = E2;
var Xc = {}, Wc = {}, Bg = {}, Mg = {}, Zc = {};
Object.defineProperty(Zc, "__esModule", { value: !0 });
Zc.crypto = void 0;
Zc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = l, t.clean = h, t.createView = d, t.rotr = w, t.rotl = g, t.byteSwap = A, t.byteSwap32 = v, t.bytesToHex = j, t.hexToBytes = P, t.asyncLoop = st, t.utf8ToBytes = Z, t.bytesToUtf8 = q, t.toBytes = y, t.kdfInputToBytes = $, t.concatBytes = M, t.checkOpts = T, t.createHasher = z, t.createOptHasher = bt, t.createXOFer = at, t.randomBytes = Gt;
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
  function d(L) {
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
  function j(L) {
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
    const vt = new Uint8Array(ot);
    for (let kt = 0, xt = 0; kt < ot; kt++, xt += 2) {
      const Pe = B(L.charCodeAt(xt)), Lt = B(L.charCodeAt(xt + 1));
      if (Pe === void 0 || Lt === void 0) {
        const It = L[xt] + L[xt + 1];
        throw new Error('hex string expected, got non-hex character "' + It + '" at index ' + xt);
      }
      vt[kt] = Pe * 16 + Lt;
    }
    return vt;
  }
  const Y = async () => {
  };
  t.nextTick = Y;
  async function st(L, H, ot) {
    let vt = Date.now();
    for (let kt = 0; kt < L; kt++) {
      ot(kt);
      const xt = Date.now() - vt;
      xt >= 0 && xt < H || (await (0, t.nextTick)(), vt += xt);
    }
  }
  function Z(L) {
    if (typeof L != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(L));
  }
  function q(L) {
    return new TextDecoder().decode(L);
  }
  function y(L) {
    return typeof L == "string" && (L = Z(L)), s(L), L;
  }
  function $(L) {
    return typeof L == "string" && (L = Z(L)), s(L), L;
  }
  function M(...L) {
    let H = 0;
    for (let vt = 0; vt < L.length; vt++) {
      const kt = L[vt];
      s(kt), H += kt.length;
    }
    const ot = new Uint8Array(H);
    for (let vt = 0, kt = 0; vt < L.length; vt++) {
      const xt = L[vt];
      ot.set(xt, kt), kt += xt.length;
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
    const H = (vt) => L().update(y(vt)).digest(), ot = L();
    return H.outputLen = ot.outputLen, H.blockLen = ot.blockLen, H.create = () => L(), H;
  }
  function bt(L) {
    const H = (vt, kt) => L(kt).update(y(vt)).digest(), ot = L({});
    return H.outputLen = ot.outputLen, H.blockLen = ot.blockLen, H.create = (vt) => L(vt), H;
  }
  function at(L) {
    const H = (vt, kt) => L(kt).update(y(vt)).digest(), ot = L({});
    return H.outputLen = ot.outputLen, H.blockLen = ot.blockLen, H.create = (vt) => L(vt), H;
  }
  t.wrapConstructor = z, t.wrapConstructorWithOpts = bt, t.wrapXOFConstructorWithOpts = at;
  function Gt(L = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(L));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(L));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Mg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Mg;
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
      const { oHash: o, iHash: a, finished: c, destroyed: l, blockLen: h, outputLen: d } = this;
      return i = i, i.finished = c, i.destroyed = l, i.blockLen = h, i.outputLen = d, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(Bg);
const Wi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Ng(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function fu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ti(t, ...e) {
  if (!Ng(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function A2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  fu(t.outputLen), fu(t.blockLen);
}
function hu(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _g(t, e) {
  Ti(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function v2(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function k2(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function mc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function sc(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function tr(t, e) {
  return t << 32 - e | t >>> e;
}
function $2(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Id = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ld(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Pg = Id ? (t) => t : (t) => Ld(t), I2 = Pg;
function Ug(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Ld(t[e]);
  return t;
}
const L2 = Id ? (t) => t : Ug, Hg = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", C2 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Cd(t) {
  if (Ti(t), Hg)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += C2[t[n]];
  return e;
}
const Nr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function ph(t) {
  if (t >= Nr._0 && t <= Nr._9)
    return t - Nr._0;
  if (t >= Nr.A && t <= Nr.F)
    return t - (Nr.A - 10);
  if (t >= Nr.a && t <= Nr.f)
    return t - (Nr.a - 10);
}
function T2(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Hg)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = ph(t.charCodeAt(i)), a = ph(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Og = async () => {
};
async function B2(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Og(), r += i);
  }
}
function Td(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function M2(t) {
  return new TextDecoder().decode(t);
}
function ba(t) {
  return typeof t == "string" && (t = Td(t)), Ti(t), t;
}
function N2(t) {
  return typeof t == "string" && (t = Td(t)), Ti(t), t;
}
function _2(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ti(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function P2(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Dg = class {
};
function Qc(t) {
  const e = (r) => t().update(ba(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Fg(t) {
  const e = (r, s) => t(s).update(ba(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function jg(t) {
  const e = (r, s) => t(s).update(ba(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const U2 = Qc, H2 = Fg, O2 = jg;
function D2(t = 32) {
  if (Wi && typeof Wi.getRandomValues == "function")
    return Wi.getRandomValues(new Uint8Array(t));
  if (Wi && typeof Wi.randomBytes == "function")
    return Uint8Array.from(Wi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const F2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Dg,
  abytes: Ti,
  aexists: hu,
  ahash: A2,
  anumber: fu,
  aoutput: _g,
  asyncLoop: B2,
  byteSwap: Ld,
  byteSwap32: Ug,
  byteSwapIfBE: I2,
  bytesToHex: Cd,
  bytesToUtf8: M2,
  checkOpts: P2,
  clean: mc,
  concatBytes: _2,
  createHasher: Qc,
  createOptHasher: Fg,
  createView: sc,
  createXOFer: jg,
  hexToBytes: T2,
  isBytes: Ng,
  isLE: Id,
  kdfInputToBytes: N2,
  nextTick: Og,
  randomBytes: D2,
  rotl: $2,
  rotr: tr,
  swap32IfBE: L2,
  swap8IfBE: Pg,
  toBytes: ba,
  u32: k2,
  u8: v2,
  utf8ToBytes: Td,
  wrapConstructor: U2,
  wrapConstructorWithOpts: H2,
  wrapXOFConstructorWithOpts: O2
}, Symbol.toStringTag, { value: "Module" }));
function j2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
function R2(t, e, n) {
  return t & e ^ ~t & n;
}
function z2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class G2 extends Dg {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = sc(this.buffer);
  }
  update(e) {
    hu(this), e = ba(e), Ti(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = sc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    hu(this), _g(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, mc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let d = o; d < s; d++)
      n[d] = 0;
    j2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = sc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < l; d++)
      a.setUint32(4 * d, h[d], i);
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
const us = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ds = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), K2 = /* @__PURE__ */ Uint32Array.from([
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
]), fs = /* @__PURE__ */ new Uint32Array(64);
let Bd = class extends G2 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = us[0] | 0, this.B = us[1] | 0, this.C = us[2] | 0, this.D = us[3] | 0, this.E = us[4] | 0, this.F = us[5] | 0, this.G = us[6] | 0, this.H = us[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      fs[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = fs[d - 15], g = fs[d - 2], A = tr(w, 7) ^ tr(w, 18) ^ w >>> 3, v = tr(g, 17) ^ tr(g, 19) ^ g >>> 10;
      fs[d] = v + fs[d - 7] + A + fs[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = tr(a, 6) ^ tr(a, 11) ^ tr(a, 25), g = h + w + R2(a, c, l) + K2[d] + fs[d] | 0, v = (tr(r, 2) ^ tr(r, 13) ^ tr(r, 22)) + z2(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    mc(fs);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), mc(this.buffer);
  }
}, Rg = class extends Bd {
  constructor() {
    super(28), this.A = ds[0] | 0, this.B = ds[1] | 0, this.C = ds[2] | 0, this.D = ds[3] | 0, this.E = ds[4] | 0, this.F = ds[5] | 0, this.G = ds[6] | 0, this.H = ds[7] | 0;
  }
};
const V2 = /* @__PURE__ */ Qc(() => new Bd()), q2 = /* @__PURE__ */ Qc(() => new Rg()), Y2 = Bd, Md = V2, X2 = Rg, W2 = q2, Z2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: X2,
  SHA256: Y2,
  sha224: W2,
  sha256: Md
}, Symbol.toStringTag, { value: "Module" })), Jc = /* @__PURE__ */ Gc(Z2), Q2 = /* @__PURE__ */ Gc(s1);
var bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
bo.joseToDer = bo.derToJose = void 0;
const zg = wa, Gg = bn;
function Ll(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const J2 = {
  ES256: Ll(256),
  ES384: Ll(384),
  ES512: Ll(521)
};
function Kg(t) {
  const e = J2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const xc = 128, Vg = 0, tx = 32, ex = 16, nx = 2, qg = ex | tx | Vg << 6, Sc = nx | Vg << 6;
function Yg(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, zg.toByteArray)((0, Gg.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function rx(t, e) {
  const n = Yg(t), r = Kg(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== qg)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (xc | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Sc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const l = o;
  if (o += c, n[o++] !== Sc)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[o++];
  if (i - o !== h)
    throw new Error(`"s" specified length of "${h}", expected "${i - o}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const d = o;
  if (o += h, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const w = r - c, g = r - h, A = new Uint8Array(w + c + g + h);
  for (o = 0; o < w; ++o)
    A[o] = 0;
  A.set(n.subarray(l + Math.max(-w, 0), l + c), o), o = r;
  for (const v = o; o < v + g; ++o)
    A[o] = 0;
  return A.set(n.subarray(d + Math.max(-g, 0), d + h), o), (0, Gg.escape)((0, zg.fromByteArray)(A));
}
bo.derToJose = rx;
function gh(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= xc && --r, r;
}
function sx(t, e) {
  t = Yg(t);
  const n = Kg(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = gh(t, 0, n), i = gh(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, l = c < xc, h = new Uint8Array((l ? 2 : 3) + c);
  let d = 0;
  return h[d++] = qg, l ? h[d++] = c : (h[d++] = xc | 1, h[d++] = c & 255), h[d++] = Sc, h[d++] = o, s < 0 ? (h[d++] = 0, h.set(t.subarray(0, n), d), d += n) : (h.set(t.subarray(s, n), d), d += n - s), h[d++] = Sc, h[d++] = a, i < 0 ? (h[d++] = 0, h.set(t.subarray(n), d)) : h.set(t.subarray(n + i), d), h;
}
bo.joseToDer = sx;
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.InvalidTokenError = Vr.MissingParametersError = void 0;
class ix extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Vr.MissingParametersError = ix;
class ox extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Vr.InvalidTokenError = ox;
const ma = /* @__PURE__ */ Gc(F2);
Object.defineProperty(Wc, "__esModule", { value: !0 });
Wc.SECP256K1Client = void 0;
const ax = Bg, cx = Jc, ic = Q2, yh = bo, wh = Vr, bh = ma;
ic.utils.hmacSha256Sync = (t, ...e) => {
  const n = ax.hmac.create(cx.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Xg {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, bh.bytesToHex)(ic.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new wh.MissingParametersError("a signing input hash and private key are all required");
    const s = ic.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, bh.bytesToHex)(s);
    if (r === "jose")
      return (0, yh.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, yh.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new wh.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ic.verify(n, e, r, { strict: !1 });
  }
}
Wc.SECP256K1Client = Xg;
Xg.algorithmName = "ES256K";
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
var pi = {};
const lx = /* @__PURE__ */ Gc(ng);
var ux = xn && xn.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        l(r.next(h));
      } catch (d) {
        o(d);
      }
    }
    function c(h) {
      try {
        l(r.throw(h));
      } catch (d) {
        o(d);
      }
    }
    function l(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.hashSha256Async = pi.hashSha256 = void 0;
const dx = Jc;
function Wg(t) {
  return (0, dx.sha256)(t);
}
pi.hashSha256 = Wg;
function fx(t) {
  return ux(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = lx;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Wg(t));
    }
  });
}
pi.hashSha256Async = fx;
var hx = xn && xn.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        l(r.next(h));
      } catch (d) {
        o(d);
      }
    }
    function c(h) {
      try {
        l(r.throw(h));
      } catch (d) {
        o(d);
      }
    }
    function l(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(wo, "__esModule", { value: !0 });
wo.TokenSigner = wo.createUnsecuredToken = void 0;
const pu = bn, mh = Xc, px = Vr, xh = pi;
function gu(t, e) {
  const n = [], r = pu.encode(JSON.stringify(e));
  n.push(r);
  const s = pu.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function gx(t) {
  return gu(t, { typ: "JWT", alg: "none" }) + ".";
}
wo.createUnsecuredToken = gx;
class yx {
  constructor(e, n) {
    if (!(e && n))
      throw new px.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !mh.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = mh.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = gu(e, s), o = (0, xh.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return hx(this, void 0, void 0, function* () {
      const s = this.header(r), i = gu(e, s), o = yield (0, xh.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [pu.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
wo.TokenSigner = yx;
var tl = {};
Object.defineProperty(tl, "__esModule", { value: !0 });
tl.TokenVerifier = void 0;
const wx = bn, Sh = Xc, bx = Vr, Na = pi;
class mx {
  constructor(e, n) {
    if (!(e && n))
      throw new bx.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Sh.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Sh.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Na.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Na.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), wx.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Na.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Na.hashSha256)(r);
      return i(o);
    }
  }
}
tl.TokenVerifier = mx;
var el = {};
Object.defineProperty(el, "__esModule", { value: !0 });
el.decodeToken = void 0;
const _a = bn;
function xx(t) {
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
el.decodeToken = xx;
(function(t) {
  var e = xn && xn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = xn && xn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(wo, t), n(tl, t), n(el, t), n(Vr, t), n(Xc, t);
})(en);
function Sx(t) {
  return `did:btc-addr:${t}`;
}
function Ex(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new th("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new th('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Zg(t) {
  if (t)
    return Ex(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Ax = "1.4.0";
function vx() {
  return l2();
}
function kx(t, e, n, r = V0.slice(), s, i = om().getTime(), o = {}) {
  const a = (g) => {
    const A = gd("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${g}=undefined])`
    });
    return A == null ? void 0 : A.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: cm(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Ax,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), l = en.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [l];
  const h = Ag(l);
  return c.iss = Sx(h), new en.TokenSigner("ES256k", t).sign(c);
}
async function Eh(t, e) {
  const n = ga(Wt(e)), r = JSON.parse(n), s = await Ig(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function $x(t) {
  const e = en.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new en.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Ix(t) {
  const e = en.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Zg(e.iss);
  if (n.length === 1) {
    if (Ag(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Lx(t) {
  const e = en.decodeToken(t).payload;
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
function Cx(t) {
  const e = en.decodeToken(t).payload;
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
function Tx(t) {
  const e = [
    Cx(t),
    Lx(t),
    $x(t),
    Ix(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Ah = "1.0.0";
class Ps {
  constructor(e) {
    this.version = Ah, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Ah)
      throw new ou(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Ps(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Qg {
  constructor(e) {
    if (e) {
      const n = new Ps(e);
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
class vh extends Qg {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Ps({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new q0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ps({})), !0;
  }
}
class kh extends Qg {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = rm, !localStorage.getItem(this.key)) {
      const r = new Ps({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new q0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Ps.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ps({})), !0;
  }
}
var ra;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ra || (ra = {}));
var Ec;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ec || (Ec = {}));
ra.Mainnet;
var jr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(jr || (jr = {}));
var xr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(xr || (xr = {}));
jr.Mainnet;
const Jg = {
  chainId: ra.Mainnet,
  transactionVersion: jr.Mainnet,
  peerNetworkId: Ec.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: xr.MainnetSingleSig,
    multiSig: xr.MainnetMultiSig
  },
  client: { baseUrl: Y0 }
}, yu = {
  chainId: ra.Testnet,
  transactionVersion: jr.Testnet,
  peerNetworkId: Ec.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: xr.TestnetSingleSig,
    multiSig: xr.TestnetMultiSig
  },
  client: { baseUrl: X0 }
}, oc = {
  ...yu,
  addressVersion: { ...yu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: W0 }
}, Bx = {
  ...oc,
  addressVersion: { ...oc.addressVersion },
  client: { ...oc.client }
};
function Mx(t) {
  switch (t) {
    case "mainnet":
      return Jg;
    case "testnet":
      return yu;
    case "devnet":
      return oc;
    case "mocknet":
      return Bx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function ty(t) {
  return typeof t == "string" ? Mx(t) : t;
}
var $h;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})($h || ($h = {}));
var Ih;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ih || (Ih = {}));
var er;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(er || (er = {}));
const Cl = ["onChainOnly", "offChainOnly", "any"];
Cl[0] + "", er.OnChainOnly, Cl[1] + "", er.OffChainOnly, Cl[2] + "", er.Any, er.OnChainOnly + "", er.OnChainOnly, er.OffChainOnly + "", er.OffChainOnly, er.Any + "", er.Any;
var Lh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Lh || (Lh = {}));
var Ch;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Ch || (Ch = {}));
var Th;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Th || (Th = {}));
var Or;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Or || (Or = {}));
var Bh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Bh || (Bh = {}));
var Mh;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Mh || (Mh = {}));
var Nh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Nh || (Nh = {}));
var _h;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(_h || (_h = {}));
var Ph;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ph || (Ph = {}));
var Uh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Uh || (Uh = {}));
var Hh;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Hh || (Hh = {}));
var Oh;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Oh || (Oh = {}));
var Dh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Dh || (Dh = {}));
function wu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Nx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ey(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function _x(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wu(t.outputLen), wu(t.blockLen);
}
function Px(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ux(t, e) {
  ey(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ni = {
  number: wu,
  bool: Nx,
  bytes: ey,
  hash: _x,
  exists: Px,
  output: Ux
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Tl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), fr = (t, e) => t << 32 - e | t >>> e, Hx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Hx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ox(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Nd(t) {
  if (typeof t == "string" && (t = Ox(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ny = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Bi(t) {
  const e = (r) => t().update(Nd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let ry = class extends ny {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ni.hash(e);
    const r = Nd(n);
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
const sy = (t, e, n) => new ry(t, e).update(n).digest();
sy.create = (t, e) => new ry(t, e);
function Dx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let _d = class extends ny {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Tl(this.buffer);
  }
  update(e) {
    ni.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Nd(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Tl(e);
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
    for (let d = o; d < s; d++)
      n[d] = 0;
    Dx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Tl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < l; d++)
      a.setUint32(4 * d, h[d], i);
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
const Fx = (t, e, n) => t & e ^ ~t & n, jx = (t, e, n) => t & e ^ t & n ^ e & n, Rx = new Uint32Array([
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
let iy = class extends _d {
  constructor() {
    super(64, 32, 8, !1), this.A = hs[0] | 0, this.B = hs[1] | 0, this.C = hs[2] | 0, this.D = hs[3] | 0, this.E = hs[4] | 0, this.F = hs[5] | 0, this.G = hs[6] | 0, this.H = hs[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      ps[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = ps[d - 15], g = ps[d - 2], A = fr(w, 7) ^ fr(w, 18) ^ w >>> 3, v = fr(g, 17) ^ fr(g, 19) ^ g >>> 10;
      ps[d] = v + ps[d - 7] + A + ps[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = fr(a, 6) ^ fr(a, 11) ^ fr(a, 25), g = h + w + Fx(a, c, l) + Rx[d] + ps[d] | 0, v = (fr(r, 2) ^ fr(r, 13) ^ fr(r, 22)) + jx(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    ps.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, zx = class extends iy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const oy = Bi(() => new iy());
Bi(() => new zx());
var Mi = {}, Pd = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ma;
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
        const C = 1 + l, U = v % (1 << C) << 5 - C, j = t.c32[A + U];
        l = C, c.unshift(j);
      } else
        l = 0;
    let h = 0;
    for (let g = 0; g < c.length && c[g] === "0"; g++)
      h++;
    c = c.slice(h);
    const d = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), w = d ? d[0].length : 0;
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
    let h = [], d = 0, w = 0;
    for (let v = o.length - 1; v >= 0; v--) {
      w === 4 && (h.unshift(n[d]), w = 0, d = 0);
      const U = (t.c32.indexOf(o[v]) << w) + d, j = n[U % 16];
      if (w += 1, d = U >> 4, d > 1 << w)
        throw new Error("Panic error in decoding.");
      h.unshift(j);
    }
    h.unshift(n[d]), h.length % 2 === 1 && h.unshift("0");
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
})(Pd);
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.c32checkDecode = gi.c32checkEncode = void 0;
const Fh = Jc, jh = ma, Wo = Pd;
function ay(t) {
  const e = (0, Fh.sha256)((0, Fh.sha256)((0, jh.hexToBytes)(t)));
  return (0, jh.bytesToHex)(e.slice(0, 4));
}
function Gx(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = ay(`${n}${e}`), s = (0, Wo.c32encode)(`${e}${r}`);
  return `${Wo.c32[t]}${s}`;
}
gi.c32checkEncode = Gx;
function Kx(t) {
  t = (0, Wo.c32normalize)(t);
  const e = (0, Wo.c32decode)(t.slice(1)), n = t[0], r = Wo.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), ay(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
gi.c32checkDecode = Kx;
var cy = {}, mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
mo.decode = mo.encode = void 0;
const Ac = Jc, Rh = ma, ly = bg, uy = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Vx(t, e = "00") {
  const n = typeof t == "string" ? (0, Rh.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Rh.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ac.sha256)((0, Ac.sha256)(new Uint8Array([...r, ...n])));
  return ly(uy).encode([...r, ...n, ...s.slice(0, 4)]);
}
mo.encode = Vx;
function qx(t) {
  const e = ly(uy).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ac.sha256)((0, Ac.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
mo.decode = qx;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = gi, n = mo, r = ma;
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
  function o(h, d) {
    if (!d.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(h, d)}`;
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
  function c(h, d = -1) {
    const w = n.decode(h), g = (0, r.bytesToHex)(w.data), A = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let v;
    return d < 0 ? (v = A, s[A] !== void 0 && (v = s[A])) : v = d, o(v, g);
  }
  t.b58ToC32 = c;
  function l(h, d = -1) {
    const w = a(h), g = w[0], A = w[1];
    let v;
    d < 0 ? (v = g, i[g] !== void 0 && (v = i[g])) : v = d;
    let C = v.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(A, C);
  }
  t.c32ToB58 = l;
})(cy);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Pd;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = gi;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = cy;
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
})(Mi);
function Yx(t, e) {
  switch (e = ty(e ?? Jg), t) {
    case Or.P2PKH:
      switch (e.transactionVersion) {
        case jr.Mainnet:
          return xr.MainnetSingleSig;
        case jr.Testnet:
          return xr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Or.P2SH:
    case Or.P2SHNonSequential:
    case Or.P2WPKH:
    case Or.P2WSH:
    case Or.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case jr.Mainnet:
          return xr.MainnetMultiSig;
        case jr.Testnet:
          return xr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Xx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), dy = Uint8Array.from({ length: 16 }, (t, e) => e), Wx = dy.map((t) => (9 * t + 5) % 16);
let Ud = [dy], Hd = [Wx];
for (let t = 0; t < 4; t++)
  for (let e of [Ud, Hd])
    e.push(e[t].map((n) => Xx[n]));
const fy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Zx = Ud.map((t, e) => t.map((n) => fy[e][n])), Qx = Hd.map((t, e) => t.map((n) => fy[e][n])), Jx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), tS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Pa = (t, e) => t << e | t >>> 32 - e;
function zh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ua = new Uint32Array(16);
let eS = class extends _d {
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
      Ua[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, h = l, d = this.h4 | 0, w = d;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, v = Jx[g], C = tS[g], U = Ud[g], j = Hd[g], k = Zx[g], B = Qx[g];
      for (let P = 0; P < 16; P++) {
        const Y = Pa(r + zh(g, i, a, l) + Ua[U[P]] + v, k[P]) + d | 0;
        r = d, d = l, l = Pa(a, 10) | 0, a = i, i = Y;
      }
      for (let P = 0; P < 16; P++) {
        const Y = Pa(s + zh(A, o, c, h) + Ua[j[P]] + C, B[P]) + w | 0;
        s = w, w = h, h = Pa(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + l + w | 0, this.h3 + d + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ua.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const nS = Bi(() => new eS()), Ha = BigInt(2 ** 32 - 1), bu = BigInt(32);
function hy(t, e = !1) {
  return e ? { h: Number(t & Ha), l: Number(t >> bu & Ha) } : { h: Number(t >> bu & Ha) | 0, l: Number(t & Ha) | 0 };
}
function rS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = hy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const sS = (t, e) => BigInt(t >>> 0) << bu | BigInt(e >>> 0), iS = (t, e, n) => t >>> n, oS = (t, e, n) => t << 32 - n | e >>> n, aS = (t, e, n) => t >>> n | e << 32 - n, cS = (t, e, n) => t << 32 - n | e >>> n, lS = (t, e, n) => t << 64 - n | e >>> n - 32, uS = (t, e, n) => t >>> n - 32 | e << 64 - n, dS = (t, e) => e, fS = (t, e) => t, hS = (t, e, n) => t << n | e >>> 32 - n, pS = (t, e, n) => e << n | t >>> 32 - n, gS = (t, e, n) => e << n - 32 | t >>> 64 - n, yS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function wS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const bS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), mS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, xS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), SS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ES = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), AS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: hy,
  split: rS,
  toBig: sS,
  shrSH: iS,
  shrSL: oS,
  rotrSH: aS,
  rotrSL: cS,
  rotrBH: lS,
  rotrBL: uS,
  rotr32H: dS,
  rotr32L: fS,
  rotlSH: hS,
  rotlSL: pS,
  rotlBH: gS,
  rotlBL: yS,
  add: wS,
  add3L: bS,
  add3H: mS,
  add4L: xS,
  add4H: SS,
  add5H: AS,
  add5L: ES
}, [vS, kS] = Bt.split([
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
].map((t) => BigInt(t))), gs = new Uint32Array(80), ys = new Uint32Array(80);
let nl = class extends _d {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: h, Fh: d, Fl: w, Gh: g, Gl: A, Hh: v, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, l, h, d, w, g, A, v, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, h, d, w, g, A, v, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      gs[k] = e.getUint32(n), ys[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const B = gs[k - 15] | 0, P = ys[k - 15] | 0, Y = Bt.rotrSH(B, P, 1) ^ Bt.rotrSH(B, P, 8) ^ Bt.shrSH(B, P, 7), st = Bt.rotrSL(B, P, 1) ^ Bt.rotrSL(B, P, 8) ^ Bt.shrSL(B, P, 7), Z = gs[k - 2] | 0, q = ys[k - 2] | 0, y = Bt.rotrSH(Z, q, 19) ^ Bt.rotrBH(Z, q, 61) ^ Bt.shrSH(Z, q, 6), $ = Bt.rotrSL(Z, q, 19) ^ Bt.rotrBL(Z, q, 61) ^ Bt.shrSL(Z, q, 6), M = Bt.add4L(st, $, ys[k - 7], ys[k - 16]), T = Bt.add4H(M, Y, y, gs[k - 7], gs[k - 16]);
      gs[k] = T | 0, ys[k] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: h, Eh: d, El: w, Fh: g, Fl: A, Gh: v, Gl: C, Hh: U, Hl: j } = this;
    for (let k = 0; k < 80; k++) {
      const B = Bt.rotrSH(d, w, 14) ^ Bt.rotrSH(d, w, 18) ^ Bt.rotrBH(d, w, 41), P = Bt.rotrSL(d, w, 14) ^ Bt.rotrSL(d, w, 18) ^ Bt.rotrBL(d, w, 41), Y = d & g ^ ~d & v, st = w & A ^ ~w & C, Z = Bt.add5L(j, P, st, kS[k], ys[k]), q = Bt.add5H(Z, U, B, Y, vS[k], gs[k]), y = Z | 0, $ = Bt.rotrSH(r, s, 28) ^ Bt.rotrBH(r, s, 34) ^ Bt.rotrBH(r, s, 39), M = Bt.rotrSL(r, s, 28) ^ Bt.rotrBL(r, s, 34) ^ Bt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, j = C | 0, v = g | 0, C = A | 0, g = d | 0, A = w | 0, { h: d, l: w } = Bt.add(l | 0, h | 0, q | 0, y | 0), l = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = Bt.add3L(y, M, K);
      r = Bt.add3H(z, q, $, T), s = z | 0;
    }
    ({ h: r, l: s } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: h } = Bt.add(this.Dh | 0, this.Dl | 0, l | 0, h | 0), { h: d, l: w } = Bt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: g, l: A } = Bt.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: v, l: C } = Bt.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: U, l: j } = Bt.add(this.Hh | 0, this.Hl | 0, U | 0, j | 0), this.set(r, s, i, o, a, c, l, h, d, w, g, A, v, C, U, j);
  }
  roundClean() {
    gs.fill(0), ys.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, $S = class extends nl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, IS = class extends nl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, LS = class extends nl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Bi(() => new nl());
Bi(() => new $S());
Bi(() => new IS());
Bi(() => new LS());
var vc = { exports: {} };
vc.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", l = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", w = "[object Map]", g = "[object Number]", A = "[object Object]", v = "[object Promise]", C = "[object RegExp]", U = "[object Set]", j = "[object String]", k = "[object Symbol]", B = "[object WeakMap]", P = "[object ArrayBuffer]", Y = "[object DataView]", st = "[object Float32Array]", Z = "[object Float64Array]", q = "[object Int8Array]", y = "[object Int16Array]", $ = "[object Int32Array]", M = "[object Uint8Array]", T = "[object Uint8ClampedArray]", K = "[object Uint16Array]", z = "[object Uint32Array]", bt = /[\\^$.*+?()[\]{}|]/g, at = /\w*$/, Gt = /^\[object .+?Constructor\]$/, L = /^(?:0|[1-9]\d*)$/, H = {};
  H[i] = H[o] = H[P] = H[Y] = H[a] = H[c] = H[st] = H[Z] = H[q] = H[y] = H[$] = H[w] = H[g] = H[A] = H[C] = H[U] = H[j] = H[k] = H[M] = H[T] = H[K] = H[z] = !0, H[l] = H[h] = H[B] = !1;
  var ot = typeof xn == "object" && xn && xn.Object === Object && xn, vt = typeof self == "object" && self && self.Object === Object && self, kt = ot || vt || Function("return this")(), xt = e && !e.nodeType && e, Pe = xt && !0 && t && !t.nodeType && t, Lt = Pe && Pe.exports === xt;
  function It(x, _) {
    return x.set(_[0], _[1]), x;
  }
  function St(x, _) {
    return x.add(_), x;
  }
  function Ln(x, _) {
    for (var R = -1, ft = x ? x.length : 0; ++R < ft && _(x[R], R, x) !== !1; )
      ;
    return x;
  }
  function Ze(x, _) {
    for (var R = -1, ft = _.length, ye = x.length; ++R < ft; )
      x[ye + R] = _[R];
    return x;
  }
  function Pt(x, _, R, ft) {
    for (var ye = -1, Te = x ? x.length : 0; ++ye < Te; )
      R = _(R, x[ye], ye, x);
    return R;
  }
  function fn(x, _) {
    for (var R = -1, ft = Array(x); ++R < x; )
      ft[R] = _(R);
    return ft;
  }
  function he(x, _) {
    return x == null ? void 0 : x[_];
  }
  function Xt(x) {
    var _ = !1;
    if (x != null && typeof x.toString != "function")
      try {
        _ = !!(x + "");
      } catch {
      }
    return _;
  }
  function Cn(x) {
    var _ = -1, R = Array(x.size);
    return x.forEach(function(ft, ye) {
      R[++_] = [ye, ft];
    }), R;
  }
  function Re(x, _) {
    return function(R) {
      return x(_(R));
    };
  }
  function Qe(x) {
    var _ = -1, R = Array(x.size);
    return x.forEach(function(ft) {
      R[++_] = ft;
    }), R;
  }
  var Ve = Array.prototype, qe = Function.prototype, ze = Object.prototype, ie = kt["__core-js_shared__"], nn = function() {
    var x = /[^.]+$/.exec(ie && ie.keys && ie.keys.IE_PROTO || "");
    return x ? "Symbol(src)_1." + x : "";
  }(), Ge = qe.toString, Le = ze.hasOwnProperty, Ae = ze.toString, me = RegExp(
    "^" + Ge.call(Le).replace(bt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), En = Lt ? kt.Buffer : void 0, Wn = kt.Symbol, I = kt.Uint8Array, G = Re(Object.getPrototypeOf, Object), F = Object.create, S = ze.propertyIsEnumerable, W = Ve.splice, ht = Object.getOwnPropertySymbols, oe = En ? En.isBuffer : void 0, pe = Re(Object.keys, Object), Kt = b(kt, "DataView"), ne = b(kt, "Map"), Zt = b(kt, "Promise"), Vt = b(kt, "Set"), Ut = b(kt, "WeakMap"), tt = b(Object, "create"), Qt = p(Kt), ae = p(ne), Ue = p(Zt), be = p(Vt), hn = p(Ut), pn = Wn ? Wn.prototype : void 0, Rn = pn ? pn.valueOf : void 0;
  function Tn(x) {
    var _ = -1, R = x ? x.length : 0;
    for (this.clear(); ++_ < R; ) {
      var ft = x[_];
      this.set(ft[0], ft[1]);
    }
  }
  function Hi() {
    this.__data__ = tt ? tt(null) : {};
  }
  function Po(x) {
    return this.has(x) && delete this.__data__[x];
  }
  function Bn(x) {
    var _ = this.__data__;
    if (tt) {
      var R = _[x];
      return R === r ? void 0 : R;
    }
    return Le.call(_, x) ? _[x] : void 0;
  }
  function Mn(x) {
    var _ = this.__data__;
    return tt ? _[x] !== void 0 : Le.call(_, x);
  }
  function Xr(x, _) {
    var R = this.__data__;
    return R[x] = tt && _ === void 0 ? r : _, this;
  }
  Tn.prototype.clear = Hi, Tn.prototype.delete = Po, Tn.prototype.get = Bn, Tn.prototype.has = Mn, Tn.prototype.set = Xr;
  function Ye(x) {
    var _ = -1, R = x ? x.length : 0;
    for (this.clear(); ++_ < R; ) {
      var ft = x[_];
      this.set(ft[0], ft[1]);
    }
  }
  function Oi() {
    this.__data__ = [];
  }
  function Fs(x) {
    var _ = this.__data__, R = Zr(_, x);
    if (R < 0)
      return !1;
    var ft = _.length - 1;
    return R == ft ? _.pop() : W.call(_, R, 1), !0;
  }
  function An(x) {
    var _ = this.__data__, R = Zr(_, x);
    return R < 0 ? void 0 : _[R][1];
  }
  function Cr(x) {
    return Zr(this.__data__, x) > -1;
  }
  function Di(x, _) {
    var R = this.__data__, ft = Zr(R, x);
    return ft < 0 ? R.push([x, _]) : R[ft][1] = _, this;
  }
  Ye.prototype.clear = Oi, Ye.prototype.delete = Fs, Ye.prototype.get = An, Ye.prototype.has = Cr, Ye.prototype.set = Di;
  function Ft(x) {
    var _ = -1, R = x ? x.length : 0;
    for (this.clear(); ++_ < R; ) {
      var ft = x[_];
      this.set(ft[0], ft[1]);
    }
  }
  function re() {
    this.__data__ = {
      hash: new Tn(),
      map: new (ne || Ye)(),
      string: new Tn()
    };
  }
  function Wr(x) {
    return u(this, x).delete(x);
  }
  function Fi(x) {
    return u(this, x).get(x);
  }
  function ji(x) {
    return u(this, x).has(x);
  }
  function Zn(x, _) {
    return u(this, x).set(x, _), this;
  }
  Ft.prototype.clear = re, Ft.prototype.delete = Wr, Ft.prototype.get = Fi, Ft.prototype.has = ji, Ft.prototype.set = Zn;
  function Xe(x) {
    this.__data__ = new Ye(x);
  }
  function rn() {
    this.__data__ = new Ye();
  }
  function js(x) {
    return this.__data__.delete(x);
  }
  function Rs(x) {
    return this.__data__.get(x);
  }
  function Ri(x) {
    return this.__data__.has(x);
  }
  function Uo(x, _) {
    var R = this.__data__;
    if (R instanceof Ye) {
      var ft = R.__data__;
      if (!ne || ft.length < n - 1)
        return ft.push([x, _]), this;
      R = this.__data__ = new Ft(ft);
    }
    return R.set(x, _), this;
  }
  Xe.prototype.clear = rn, Xe.prototype.delete = js, Xe.prototype.get = Rs, Xe.prototype.has = Ri, Xe.prototype.set = Uo;
  function zi(x, _) {
    var R = ut(x) || V(x) ? fn(x.length, String) : [], ft = R.length, ye = !!ft;
    for (var Te in x)
      Le.call(x, Te) && !(ye && (Te == "length" || pt(Te, ft))) && R.push(Te);
    return R;
  }
  function zs(x, _, R) {
    var ft = x[_];
    (!(Le.call(x, _) && N(ft, R)) || R === void 0 && !(_ in x)) && (x[_] = R);
  }
  function Zr(x, _) {
    for (var R = x.length; R--; )
      if (N(x[R][0], _))
        return R;
    return -1;
  }
  function gn(x, _) {
    return x && Br(_, ct(_), x);
  }
  function Qr(x, _, R, ft, ye, Te, sn) {
    var on;
    if (ft && (on = Te ? ft(x, ye, Te, sn) : ft(x)), on !== void 0)
      return on;
    if (!ge(x))
      return x;
    var Vi = ut(x);
    if (Vi) {
      if (on = O(x), !_)
        return Ki(x, on);
    } else {
      var Qn = f(x), qi = Qn == h || Qn == d;
      if (gt(x))
        return qs(x, _);
      if (Qn == A || Qn == i || qi && !Te) {
        if (Xt(x))
          return Te ? x : {};
        if (on = et(qi ? {} : x), !_)
          return Ys(x, gn(on, x));
      } else {
        if (!H[Qn])
          return Te ? x : {};
        on = lt(x, Qn, Qr, _);
      }
    }
    sn || (sn = new Xe());
    var Xs = sn.get(x);
    if (Xs)
      return Xs;
    if (sn.set(x, on), !Vi)
      var Ws = R ? Ce(x) : ct(x);
    return Ln(Ws || x, function(Mr, rs) {
      Ws && (rs = Mr, Mr = x[rs]), zs(on, rs, Qr(Mr, _, R, ft, rs, x, sn));
    }), on;
  }
  function Gs(x) {
    return ge(x) ? F(x) : {};
  }
  function Ks(x, _, R) {
    var ft = _(x);
    return ut(x) ? ft : Ze(ft, R(x));
  }
  function Vs(x) {
    return Ae.call(x);
  }
  function ue(x) {
    if (!ge(x) || ve(x))
      return !1;
    var _ = yt(x) || Xt(x) ? me : Gt;
    return _.test(p(x));
  }
  function Jr(x) {
    if (!jt(x))
      return pe(x);
    var _ = [];
    for (var R in Object(x))
      Le.call(x, R) && R != "constructor" && _.push(R);
    return _;
  }
  function qs(x, _) {
    if (_)
      return x.slice();
    var R = new x.constructor(x.length);
    return x.copy(R), R;
  }
  function ts(x) {
    var _ = new x.constructor(x.byteLength);
    return new I(_).set(new I(x)), _;
  }
  function Tr(x, _) {
    var R = _ ? ts(x.buffer) : x.buffer;
    return new x.constructor(R, x.byteOffset, x.byteLength);
  }
  function Nn(x, _, R) {
    var ft = _ ? R(Cn(x), !0) : Cn(x);
    return Pt(ft, It, new x.constructor());
  }
  function es(x) {
    var _ = new x.constructor(x.source, at.exec(x));
    return _.lastIndex = x.lastIndex, _;
  }
  function ur(x, _, R) {
    var ft = _ ? R(Qe(x), !0) : Qe(x);
    return Pt(ft, St, new x.constructor());
  }
  function ns(x) {
    return Rn ? Object(Rn.call(x)) : {};
  }
  function Gi(x, _) {
    var R = _ ? ts(x.buffer) : x.buffer;
    return new x.constructor(R, x.byteOffset, x.length);
  }
  function Ki(x, _) {
    var R = -1, ft = x.length;
    for (_ || (_ = Array(ft)); ++R < ft; )
      _[R] = x[R];
    return _;
  }
  function Br(x, _, R, ft) {
    R || (R = {});
    for (var ye = -1, Te = _.length; ++ye < Te; ) {
      var sn = _[ye], on = void 0;
      zs(R, sn, on === void 0 ? x[sn] : on);
    }
    return R;
  }
  function Ys(x, _) {
    return Br(x, m(x), _);
  }
  function Ce(x) {
    return Ks(x, ct, m);
  }
  function u(x, _) {
    var R = x.__data__;
    return zt(_) ? R[typeof _ == "string" ? "string" : "hash"] : R.map;
  }
  function b(x, _) {
    var R = he(x, _);
    return ue(R) ? R : void 0;
  }
  var m = ht ? Re(ht, Object) : Ht, f = Vs;
  (Kt && f(new Kt(new ArrayBuffer(1))) != Y || ne && f(new ne()) != w || Zt && f(Zt.resolve()) != v || Vt && f(new Vt()) != U || Ut && f(new Ut()) != B) && (f = function(x) {
    var _ = Ae.call(x), R = _ == A ? x.constructor : void 0, ft = R ? p(R) : void 0;
    if (ft)
      switch (ft) {
        case Qt:
          return Y;
        case ae:
          return w;
        case Ue:
          return v;
        case be:
          return U;
        case hn:
          return B;
      }
    return _;
  });
  function O(x) {
    var _ = x.length, R = x.constructor(_);
    return _ && typeof x[0] == "string" && Le.call(x, "index") && (R.index = x.index, R.input = x.input), R;
  }
  function et(x) {
    return typeof x.constructor == "function" && !jt(x) ? Gs(G(x)) : {};
  }
  function lt(x, _, R, ft) {
    var ye = x.constructor;
    switch (_) {
      case P:
        return ts(x);
      case a:
      case c:
        return new ye(+x);
      case Y:
        return Tr(x, ft);
      case st:
      case Z:
      case q:
      case y:
      case $:
      case M:
      case T:
      case K:
      case z:
        return Gi(x, ft);
      case w:
        return Nn(x, ft, R);
      case g:
      case j:
        return new ye(x);
      case C:
        return es(x);
      case U:
        return ur(x, ft, R);
      case k:
        return ns(x);
    }
  }
  function pt(x, _) {
    return _ = _ ?? s, !!_ && (typeof x == "number" || L.test(x)) && x > -1 && x % 1 == 0 && x < _;
  }
  function zt(x) {
    var _ = typeof x;
    return _ == "string" || _ == "number" || _ == "symbol" || _ == "boolean" ? x !== "__proto__" : x === null;
  }
  function ve(x) {
    return !!nn && nn in x;
  }
  function jt(x) {
    var _ = x && x.constructor, R = typeof _ == "function" && _.prototype || ze;
    return x === R;
  }
  function p(x) {
    if (x != null) {
      try {
        return Ge.call(x);
      } catch {
      }
      try {
        return x + "";
      } catch {
      }
    }
    return "";
  }
  function E(x) {
    return Qr(x, !0, !0);
  }
  function N(x, _) {
    return x === _ || x !== x && _ !== _;
  }
  function V(x) {
    return dt(x) && Le.call(x, "callee") && (!S.call(x, "callee") || Ae.call(x) == i);
  }
  var ut = Array.isArray;
  function D(x) {
    return x != null && $t(x.length) && !yt(x);
  }
  function dt(x) {
    return He(x) && D(x);
  }
  var gt = oe || Jt;
  function yt(x) {
    var _ = ge(x) ? Ae.call(x) : "";
    return _ == h || _ == d;
  }
  function $t(x) {
    return typeof x == "number" && x > -1 && x % 1 == 0 && x <= s;
  }
  function ge(x) {
    var _ = typeof x;
    return !!x && (_ == "object" || _ == "function");
  }
  function He(x) {
    return !!x && typeof x == "object";
  }
  function ct(x) {
    return D(x) ? zi(x) : Jr(x);
  }
  function Ht() {
    return [];
  }
  function Jt() {
    return !1;
  }
  t.exports = E;
})(vc, vc.exports);
var CS = vc.exports;
const py = /* @__PURE__ */ R0(CS);
var mu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(mu || (mu = {}));
function TS(t, e) {
  return { type: mu.Address, version: t, hash160: e };
}
function BS(t) {
  return Mi.c32address(t.version, t.hash160);
}
const MS = (t) => nS(oy(t)), NS = (t) => mt(MS(t));
_e.hmacSha256Sync = (t, ...e) => {
  const n = sy.create(oy, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function _S(t, e = "mainnet") {
  e = ty(e), t = typeof t == "string" ? Wt(t) : t;
  const n = Yx(Or.P2PKH, e), r = TS(n, NS(t));
  return BS(r);
}
function PS(t, e) {
  const n = en.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = _S(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new en.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function US(t, e = null) {
  let n;
  e ? n = PS(t, e) : n = en.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Gh = "_blockstackDidCheckEchoReply", HS = "echoReply", OS = "authContinuation";
function DS(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function FS() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Gh];
  if (typeof e == "boolean")
    return e;
  const n = DS(t.location.search), r = n[HS];
  if (r) {
    t[Gh] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[OS];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class xu {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Z0();
    else
      throw new im("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new kh(e.sessionOptions) : this.store = new kh() : e ? this.store = new vh(e.sessionOptions) : this.store = new vh();
  }
  makeAuthRequestToken(e, n, r, s, i, o = am().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ou("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, kx(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = vx();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = gd("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (FS())
        return no.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      no.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Tm()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ka("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = en.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Tx(e))
      throw new ka("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (vl(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Eh(s, i.private_key);
          } catch {
            if (no.warn("Failed decryption of appPrivateKey, will try to use as given"), !_e.isValidPrivateKey(i.private_key))
              throw new ka("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Eh(s, c);
          } catch {
            no.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ka("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let l = mm, h;
    vl(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (l = i.hubUrl), vl(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const d = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Zg(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: l,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, w = i.profile_url;
    if (!d.profile && w) {
      const g = await n(w);
      if (!g.ok)
        d.profile = Object.assign({}, nm);
      else {
        const A = await g.text(), v = JSON.parse(A);
        d.profile = US(v[0].token);
      }
    } else
      d.profile = i.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new ou("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), m2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), x2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
xu.prototype.makeAuthRequest = xu.prototype.makeAuthRequestToken;
const jS = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], RS = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = jS(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!rl(r.id));
  return e.concat(n);
}, rl = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), gy = "STX_PROVIDER", yi = () => typeof window > "u" ? null : window.localStorage.getItem(gy), zS = (t) => {
  typeof window < "u" && window.localStorage.setItem(gy, t);
}, GS = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function KS(t, e) {
  const n = {};
  return Object.assign(n, GS, e), await fetch(t, n);
}
function VS(t) {
  let e = KS, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function qS(...t) {
  const { fetchLib: e, middlewares: n } = VS(t);
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
var xo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(xo || (xo = {}));
var wi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(wi || (wi = {}));
var Kh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Kh || (Kh = {}));
const YS = "https://api.mainnet.hiro.so", XS = "https://api.testnet.hiro.so", WS = "http://localhost:3999", ZS = ["mainnet", "testnet", "devnet", "mocknet"];
class bi {
  constructor(e) {
    this.version = wi.Mainnet, this.chainId = xo.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === wi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? qS();
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
bi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Su();
    case "testnet":
      return new Eu();
    case "devnet":
      return new QS();
    case "mocknet":
      return new yy();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${ZS.join(", ")}`);
  }
};
bi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : bi.fromName(t);
class Su extends bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? YS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = wi.Mainnet, this.chainId = xo.Mainnet;
  }
}
class Eu extends bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? XS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = wi.Testnet, this.chainId = xo.Testnet;
  }
}
class yy extends bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? WS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = wi.Testnet, this.chainId = xo.Testnet;
  }
}
const QS = yy;
var mi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(mi || (mi = {}));
var kc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(kc || (kc = {}));
mi.Mainnet;
var xi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(xi || (xi = {}));
var Si;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Si || (Si = {}));
xi.Mainnet;
const JS = {
  chainId: mi.Mainnet,
  transactionVersion: xi.Mainnet,
  peerNetworkId: kc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Si.MainnetSingleSig,
    multiSig: Si.MainnetMultiSig
  },
  client: { baseUrl: Y0 }
}, Au = {
  chainId: mi.Testnet,
  transactionVersion: xi.Testnet,
  peerNetworkId: kc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Si.TestnetSingleSig,
    multiSig: Si.TestnetMultiSig
  },
  client: { baseUrl: X0 }
}, ac = {
  ...Au,
  addressVersion: { ...Au.addressVersion },
  magicBytes: "id",
  client: { baseUrl: W0 }
}, t3 = {
  ...ac,
  addressVersion: { ...ac.addressVersion },
  client: { ...ac.client }
};
function e3(t) {
  switch (t) {
    case "mainnet":
      return JS;
    case "testnet":
      return Au;
    case "devnet":
      return ac;
    case "mocknet":
      return t3;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function n3(t) {
  return typeof t == "string" ? e3(t) : t;
}
function r3(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Vh = /* @__PURE__ */ new Map();
function wy(t, e) {
  const n = Vh.get(t);
  if (n !== void 0)
    return n(e);
  const r = r3(t);
  return Vh.set(t, r), wy(t, e);
}
let we = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Wt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return $m(this.readBytes(4), 0);
  }
  readUInt8() {
    return vm(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Em(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = mt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = mt(n);
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
    if (wy(e, r))
      return r;
    throw n(r);
  }
};
const s3 = 128, i3 = 128, by = 16, ai = 32, vu = 80, sl = 65, o3 = 32, a3 = 64, $c = 34, c3 = 1 + 16 * 1024 * 1024, l3 = 165, u3 = 16, d3 = 16, f3 = 20, h3 = d3 + 2 + f3, p3 = h3 + 4, g3 = c3 + (l3 + u3 * p3);
var se;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(se || (se = {}));
var ku;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ku || (ku = {}));
var Pn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Pn || (Pn = {}));
const Bl = ["onChainOnly", "offChainOnly", "any"];
Bl[0] + "", Pn.OnChainOnly, Bl[1] + "", Pn.OffChainOnly, Bl[2] + "", Pn.Any, Pn.OnChainOnly + "", Pn.OnChainOnly, Pn.OffChainOnly + "", Pn.OffChainOnly, Pn.Any + "", Pn.Any;
var Ic;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ic || (Ic = {}));
var xe;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(xe || (xe = {}));
var Me;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Me || (Me = {}));
var de;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(de || (de = {}));
var $e;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})($e || ($e = {}));
var Zo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Zo || (Zo = {}));
var $u;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})($u || ($u = {}));
var Iu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Iu || (Iu = {}));
var mn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(mn || (mn = {}));
var qh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qh || (qh = {}));
var Lu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Lu || (Lu = {}));
var sr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(sr || (sr = {}));
var Yh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Yh || (Yh = {}));
let il = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ro = class extends il {
  constructor(e) {
    super(e);
  }
}, wn = class extends il {
  constructor(e) {
    super(e);
  }
}, Lc = class extends il {
  constructor(e) {
    super(e);
  }
}, ri = class extends il {
  constructor(e) {
    super(e);
  }
};
function Cu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function y3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function my(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function w3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Cu(t.outputLen), Cu(t.blockLen);
}
function b3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function m3(t, e) {
  my(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const si = {
  number: Cu,
  bool: y3,
  bytes: my,
  hash: w3,
  exists: b3,
  output: m3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ml = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, x3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!x3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function S3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Od(t) {
  if (typeof t == "string" && (t = S3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let xy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ni(t) {
  const e = (r) => t().update(Od(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Sy = class extends xy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, si.hash(e);
    const r = Od(n);
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
    return si.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    si.exists(this), si.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ey = (t, e, n) => new Sy(t, e).update(n).digest();
Ey.create = (t, e) => new Sy(t, e);
function E3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Dd = class extends xy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ml(this.buffer);
  }
  update(e) {
    si.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Od(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ml(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    si.exists(this), si.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let d = o; d < s; d++)
      n[d] = 0;
    E3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ml(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < l; d++)
      a.setUint32(4 * d, h[d], i);
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
const A3 = (t, e, n) => t & e ^ ~t & n, v3 = (t, e, n) => t & e ^ t & n ^ e & n, k3 = new Uint32Array([
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
]), ws = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), bs = new Uint32Array(64);
let Ay = class extends Dd {
  constructor() {
    super(64, 32, 8, !1), this.A = ws[0] | 0, this.B = ws[1] | 0, this.C = ws[2] | 0, this.D = ws[3] | 0, this.E = ws[4] | 0, this.F = ws[5] | 0, this.G = ws[6] | 0, this.H = ws[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      bs[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = bs[d - 15], g = bs[d - 2], A = hr(w, 7) ^ hr(w, 18) ^ w >>> 3, v = hr(g, 17) ^ hr(g, 19) ^ g >>> 10;
      bs[d] = v + bs[d - 7] + A + bs[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), g = h + w + A3(a, c, l) + k3[d] + bs[d] | 0, v = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + v3(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    bs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, $3 = class extends Ay {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Fd = Ni(() => new Ay());
Ni(() => new $3());
const I3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), vy = Uint8Array.from({ length: 16 }, (t, e) => e), L3 = vy.map((t) => (9 * t + 5) % 16);
let jd = [vy], Rd = [L3];
for (let t = 0; t < 4; t++)
  for (let e of [jd, Rd])
    e.push(e[t].map((n) => I3[n]));
const ky = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), C3 = jd.map((t, e) => t.map((n) => ky[e][n])), T3 = Rd.map((t, e) => t.map((n) => ky[e][n])), B3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), M3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Oa = (t, e) => t << e | t >>> 32 - e;
function Xh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Da = new Uint32Array(16);
let N3 = class extends Dd {
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
      Da[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, h = l, d = this.h4 | 0, w = d;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, v = B3[g], C = M3[g], U = jd[g], j = Rd[g], k = C3[g], B = T3[g];
      for (let P = 0; P < 16; P++) {
        const Y = Oa(r + Xh(g, i, a, l) + Da[U[P]] + v, k[P]) + d | 0;
        r = d, d = l, l = Oa(a, 10) | 0, a = i, i = Y;
      }
      for (let P = 0; P < 16; P++) {
        const Y = Oa(s + Xh(A, o, c, h) + Da[j[P]] + C, B[P]) + w | 0;
        s = w, w = h, h = Oa(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + l + w | 0, this.h3 + d + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Da.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const _3 = Ni(() => new N3()), Fa = BigInt(2 ** 32 - 1), Tu = BigInt(32);
function $y(t, e = !1) {
  return e ? { h: Number(t & Fa), l: Number(t >> Tu & Fa) } : { h: Number(t >> Tu & Fa) | 0, l: Number(t & Fa) | 0 };
}
function P3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = $y(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const U3 = (t, e) => BigInt(t >>> 0) << Tu | BigInt(e >>> 0), H3 = (t, e, n) => t >>> n, O3 = (t, e, n) => t << 32 - n | e >>> n, D3 = (t, e, n) => t >>> n | e << 32 - n, F3 = (t, e, n) => t << 32 - n | e >>> n, j3 = (t, e, n) => t << 64 - n | e >>> n - 32, R3 = (t, e, n) => t >>> n - 32 | e << 64 - n, z3 = (t, e) => e, G3 = (t, e) => t, K3 = (t, e, n) => t << n | e >>> 32 - n, V3 = (t, e, n) => e << n | t >>> 32 - n, q3 = (t, e, n) => e << n - 32 | t >>> 64 - n, Y3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function X3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const W3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Z3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Q3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), J3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, tE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), eE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Mt = {
  fromBig: $y,
  split: P3,
  toBig: U3,
  shrSH: H3,
  shrSL: O3,
  rotrSH: D3,
  rotrSL: F3,
  rotrBH: j3,
  rotrBL: R3,
  rotr32H: z3,
  rotr32L: G3,
  rotlSH: K3,
  rotlSL: V3,
  rotlBH: q3,
  rotlBL: Y3,
  add: X3,
  add3L: W3,
  add3H: Z3,
  add4L: Q3,
  add4H: J3,
  add5H: eE,
  add5L: tE
}, [nE, rE] = Mt.split([
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
].map((t) => BigInt(t))), ms = new Uint32Array(80), xs = new Uint32Array(80);
let ol = class extends Dd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: h, Fh: d, Fl: w, Gh: g, Gl: A, Hh: v, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, l, h, d, w, g, A, v, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, h, d, w, g, A, v, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      ms[k] = e.getUint32(n), xs[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const B = ms[k - 15] | 0, P = xs[k - 15] | 0, Y = Mt.rotrSH(B, P, 1) ^ Mt.rotrSH(B, P, 8) ^ Mt.shrSH(B, P, 7), st = Mt.rotrSL(B, P, 1) ^ Mt.rotrSL(B, P, 8) ^ Mt.shrSL(B, P, 7), Z = ms[k - 2] | 0, q = xs[k - 2] | 0, y = Mt.rotrSH(Z, q, 19) ^ Mt.rotrBH(Z, q, 61) ^ Mt.shrSH(Z, q, 6), $ = Mt.rotrSL(Z, q, 19) ^ Mt.rotrBL(Z, q, 61) ^ Mt.shrSL(Z, q, 6), M = Mt.add4L(st, $, xs[k - 7], xs[k - 16]), T = Mt.add4H(M, Y, y, ms[k - 7], ms[k - 16]);
      ms[k] = T | 0, xs[k] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: h, Eh: d, El: w, Fh: g, Fl: A, Gh: v, Gl: C, Hh: U, Hl: j } = this;
    for (let k = 0; k < 80; k++) {
      const B = Mt.rotrSH(d, w, 14) ^ Mt.rotrSH(d, w, 18) ^ Mt.rotrBH(d, w, 41), P = Mt.rotrSL(d, w, 14) ^ Mt.rotrSL(d, w, 18) ^ Mt.rotrBL(d, w, 41), Y = d & g ^ ~d & v, st = w & A ^ ~w & C, Z = Mt.add5L(j, P, st, rE[k], xs[k]), q = Mt.add5H(Z, U, B, Y, nE[k], ms[k]), y = Z | 0, $ = Mt.rotrSH(r, s, 28) ^ Mt.rotrBH(r, s, 34) ^ Mt.rotrBH(r, s, 39), M = Mt.rotrSL(r, s, 28) ^ Mt.rotrBL(r, s, 34) ^ Mt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, j = C | 0, v = g | 0, C = A | 0, g = d | 0, A = w | 0, { h: d, l: w } = Mt.add(l | 0, h | 0, q | 0, y | 0), l = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = Mt.add3L(y, M, K);
      r = Mt.add3H(z, q, $, T), s = z | 0;
    }
    ({ h: r, l: s } = Mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: h } = Mt.add(this.Dh | 0, this.Dl | 0, l | 0, h | 0), { h: d, l: w } = Mt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: g, l: A } = Mt.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: v, l: C } = Mt.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: U, l: j } = Mt.add(this.Hh | 0, this.Hl | 0, U | 0, j | 0), this.set(r, s, i, o, a, c, l, h, d, w, g, A, v, C, U, j);
  }
  roundClean() {
    ms.fill(0), xs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, sE = class extends ol {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, iE = class extends ol {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, oE = class extends ol {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ni(() => new ol());
Ni(() => new sE());
const aE = Ni(() => new iE());
Ni(() => new oE());
var qt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(qt || (qt = {}));
var Ke;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ke || (Ke = {}));
function zd(t) {
  return Ke[t];
}
const cE = () => ({ type: qt.BoolTrue }), lE = () => ({ type: qt.BoolFalse }), uE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: qt.Buffer, value: mt(t) };
}, Wh = BigInt("0xffffffffffffffffffffffffffffffff"), dE = BigInt(0), Zh = BigInt("0x7fffffffffffffffffffffffffffffff"), Qh = BigInt("-170141183460469231731687303715884105728"), fE = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = cu(Wt(t))), In(t, Uint8Array) && (t = cu(t));
  const e = dn(t);
  if (e > Zh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Zh}`);
  if (e < Qh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Qh}`);
  return { type: qt.Int, value: e };
}, hE = (t) => {
  const e = dn(t);
  if (e < dE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Wh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Wh}`);
  return { type: qt.UInt, value: e };
};
function pE(t) {
  return { type: qt.List, value: t };
}
function Iy() {
  return { type: qt.OptionalNone };
}
function Ly(t) {
  return { type: qt.OptionalSome, value: t };
}
var it;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(it || (it = {}));
function gE() {
  return {
    type: it.Address,
    version: Si.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Jh(t) {
  if (t && Hy(t, $c))
    throw new Error(`Memo exceeds maximum length of ${$c} bytes`);
  return { type: it.MemoString, content: t };
}
function Gd(t, e) {
  return {
    type: it.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Bu(t) {
  if (Wt(t).byteLength != sl)
    throw Error("Invalid signature");
  return {
    type: it.MessageSignature,
    data: t
  };
}
function yE(t, e, n) {
  return typeof t == "string" && (t = ME(t)), typeof n == "string" && (n = Jh(n)), {
    type: it.Payload,
    payloadType: se.TokenTransfer,
    recipient: t,
    amount: dn(e),
    memo: n ?? Jh("")
  };
}
function wE(t, e, n, r) {
  return typeof e == "string" && (e = ar(e)), typeof n == "string" && (n = ar(n)), {
    type: it.Payload,
    payloadType: se.ContractCall,
    contractAddress: typeof t == "string" ? Ds(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function bE(t) {
  return ar(t, 4, 1e5);
}
function tp(t, e, n) {
  return typeof t == "string" && (t = ar(t)), typeof e == "string" && (e = bE(e)), typeof n == "number" ? {
    type: it.Payload,
    payloadType: se.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: it.Payload,
    payloadType: se.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function mE() {
  return { type: it.Payload, payloadType: se.PoisonMicroblock };
}
function ep(t, e) {
  if (t.byteLength != ai)
    throw Error(`Coinbase buffer size must be ${ai} bytes`);
  return e != null ? {
    type: it.Payload,
    payloadType: se.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: it.Payload,
    payloadType: se.Coinbase,
    coinbaseBytes: t
  };
}
function xE(t, e, n) {
  if (t.byteLength != ai)
    throw Error(`Coinbase buffer size must be ${ai} bytes`);
  if (n.byteLength != vu)
    throw Error(`VRF proof buffer size must be ${vu} bytes`);
  return {
    type: it.Payload,
    payloadType: se.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === qt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function SE(t, e, n, r, s, i, o) {
  return {
    type: it.Payload,
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
function ar(t, e, n) {
  const r = e || 1, s = n || s3;
  if (Hy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: it.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function EE(t, e, n) {
  return {
    type: it.Asset,
    address: Ds(t),
    contractName: ar(e),
    assetName: ar(n)
  };
}
function Ds(t) {
  const e = Mi.c32addressDecode(t);
  return {
    type: it.Address,
    version: e[0],
    hash160: e[1]
  };
}
function AE(t, e) {
  const n = Ds(t), r = ar(e);
  return {
    type: it.Principal,
    prefix: mn.Contract,
    address: n,
    contractName: r
  };
}
function vE(t) {
  const e = Ds(t);
  return {
    type: it.Principal,
    prefix: mn.Standard,
    address: e
  };
}
function so(t, e) {
  return {
    pubKeyEncoding: t,
    type: it.TransactionAuthField,
    contents: e
  };
}
function Pr(t) {
  switch (t.type) {
    case it.Address:
      return xa(t);
    case it.Principal:
      return Cy(t);
    case it.LengthPrefixedString:
      return Eo(t);
    case it.MemoString:
      return $E(t);
    case it.Asset:
      return By(t);
    case it.PostCondition:
      return Ny(t);
    case it.PublicKey:
      return _u(t);
    case it.LengthPrefixedList:
      return Kd(t);
    case it.Payload:
      return _y(t);
    case it.TransactionAuthField:
      return BE(t);
    case it.MessageSignature:
      return Vd(t);
  }
}
function xa(t) {
  const e = [];
  return e.push(Wt(pa(t.version, 1))), e.push(Wt(t.hash160)), Fe(e);
}
function So(t) {
  const e = In(t, we) ? t : new we(t), n = Kc(mt(e.readBytes(1))), r = mt(e.readBytes(20));
  return { type: it.Address, version: n, hash160: r };
}
function Cy(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === mn.Standard || t.prefix === mn.Contract) && e.push(xa(t.address)), t.prefix === mn.Contract && e.push(Eo(t.contractName)), Fe(e);
}
function kE(t) {
  const e = In(t, we) ? t : new we(t), n = e.readUInt8Enum(mn, (i) => {
    throw new wn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === mn.Origin)
    return { type: it.Principal, prefix: n };
  const r = So(e);
  if (n === mn.Standard)
    return { type: it.Principal, prefix: n, address: r };
  const s = qn(e);
  return {
    type: it.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Eo(t) {
  const e = [], n = Li(t.content), r = n.byteLength;
  return e.push(Wt(pa(r, t.lengthPrefixBytes))), e.push(n), Fe(e);
}
function qn(t, e, n) {
  e = e || 1;
  const r = In(t, we) ? t : new we(t), s = Kc(mt(r.readBytes(e))), i = ga(r.readBytes(s));
  return ar(i, e, n ?? 128);
}
function $E(t) {
  const e = [], n = Li(t.content), r = tA(mt(n), $c * 2);
  return e.push(Wt(r)), Fe(e);
}
function Ty(t) {
  const e = In(t, we) ? t : new we(t);
  let n = ga(e.readBytes($c));
  return n = n.replace(/\u0000*$/, ""), { type: it.MemoString, content: n };
}
function By(t) {
  const e = [];
  return e.push(xa(t.address)), e.push(Eo(t.contractName)), e.push(Eo(t.assetName)), Fe(e);
}
function Mu(t) {
  const e = In(t, we) ? t : new we(t);
  return {
    type: it.Asset,
    address: So(e),
    contractName: qn(e),
    assetName: qn(e)
  };
}
function Kd(t) {
  const e = t.values, n = [];
  n.push(Wt(pa(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Pr(r));
  return Fe(n);
}
function My(t, e, n) {
  const r = In(t, we) ? t : new we(t), s = Kc(mt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case it.Address:
        i.push(So(r));
        break;
      case it.LengthPrefixedString:
        i.push(qn(r));
        break;
      case it.MemoString:
        i.push(Ty(r));
        break;
      case it.Asset:
        i.push(Mu(r));
        break;
      case it.PostCondition:
        i.push(LE(r));
        break;
      case it.PublicKey:
        i.push(Pu(r));
        break;
      case it.TransactionAuthField:
        i.push(TE(r));
        break;
    }
  return Gd(i, n);
}
function IE(t) {
  return mt(Ny(t));
}
function Ny(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Cy(t.principal)), (t.conditionType === xe.Fungible || t.conditionType === xe.NonFungible) && e.push(By(t.asset)), t.conditionType === xe.NonFungible && e.push(Sr(t.assetName)), e.push(t.conditionCode), t.conditionType === xe.STX || t.conditionType === xe.Fungible || t.conditionType === xe.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ro("The post-condition amount may not be larger than 8 bytes");
    e.push(Hs(t.amount, 8));
  }
  return Fe(e);
}
function LE(t) {
  const e = In(t, we) ? t : new we(t), n = e.readUInt8Enum(xe, (a) => {
    throw new wn(`Could not read ${a} as PostConditionType`);
  }), r = kE(e);
  let s, i, o;
  switch (n) {
    case xe.STX:
      return s = e.readUInt8Enum(Zo, (c) => {
        throw new wn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${mt(e.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: xe.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case xe.Fungible:
      return i = Mu(e), s = e.readUInt8Enum(Zo, (c) => {
        throw new wn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${mt(e.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: xe.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case xe.NonFungible:
      i = Mu(e);
      const a = br(e);
      return s = e.readUInt8Enum($u, (c) => {
        throw new wn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: it.PostCondition,
        conditionType: xe.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case xe.Staking:
      return s = e.readUInt8Enum(Zo, (c) => {
        throw new wn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${mt(e.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: xe.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case xe.PoX: {
      const c = e.readUInt8Enum(Iu, (l) => {
        throw new wn(`Could not read ${l} as PoxConditionCode`);
      });
      return {
        type: it.PostCondition,
        conditionType: xe.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function _y(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case se.TokenTransfer:
      e.push(Sr(t.recipient)), e.push(Hs(t.amount, 8)), e.push(Pr(t.memo));
      break;
    case se.ContractCall:
      e.push(Pr(t.contractAddress)), e.push(Pr(t.contractName)), e.push(Pr(t.functionName));
      const n = new Uint8Array(4);
      di(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Sr(r));
      });
      break;
    case se.SmartContract:
      e.push(Pr(t.contractName)), e.push(Pr(t.codeBody));
      break;
    case se.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Pr(t.contractName)), e.push(Pr(t.codeBody));
      break;
    case se.PoisonMicroblock:
      break;
    case se.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case se.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Sr(t.recipient));
      break;
    case se.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Sr(t.recipient ? Ly(t.recipient) : Iy())), e.push(t.vrfProof);
      break;
    case se.TenureChange:
      e.push(Wt(t.tenureHash)), e.push(Wt(t.previousTenureHash)), e.push(Wt(t.burnViewHash)), e.push(Wt(t.previousTenureEnd)), e.push(di(new Uint8Array(4), t.previousTenureBlocks)), e.push(km(new Uint8Array(1), t.cause)), e.push(Wt(t.publicKeyHash));
      break;
  }
  return Fe(e);
}
function CE(t) {
  const e = In(t, we) ? t : new we(t);
  switch (e.readUInt8Enum(se, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case se.TokenTransfer:
      const r = br(e), s = dn(e.readBytes(8)), i = Ty(e);
      return yE(r, s, i);
    case se.ContractCall:
      const o = So(e), a = qn(e), c = qn(e), l = [], h = e.readUInt32BE();
      for (let B = 0; B < h; B++) {
        const P = br(e);
        l.push(P);
      }
      return wE(o, a, c, l);
    case se.SmartContract:
      const d = qn(e), w = qn(e, 4, 1e5);
      return tp(d, w);
    case se.VersionedSmartContract: {
      const B = e.readUInt8Enum(ku, (st) => {
        throw new Error(`Cannot recognize ClarityVersion: ${st}`);
      }), P = qn(e), Y = qn(e, 4, g3);
      return tp(P, Y, B);
    }
    case se.PoisonMicroblock:
      return mE();
    case se.Coinbase: {
      const B = e.readBytes(ai);
      return ep(B);
    }
    case se.CoinbaseToAltRecipient: {
      const B = e.readBytes(ai), P = br(e);
      return ep(B, P);
    }
    case se.NakamotoCoinbase: {
      const B = e.readBytes(ai), P = br(e), Y = e.readBytes(vu);
      return xE(B, P, Y);
    }
    case se.TenureChange:
      const g = mt(e.readBytes(20)), A = mt(e.readBytes(20)), v = mt(e.readBytes(20)), C = mt(e.readBytes(32)), U = e.readUInt32BE(), j = e.readUInt8Enum(Lu, (B) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${B}`);
      }), k = mt(e.readBytes(20));
      return SE(g, A, v, C, U, j, k);
  }
}
function Nu(t) {
  const e = In(t, we) ? t : new we(t);
  return Bu(mt(e.readBytes(sl)));
}
function TE(t) {
  const e = In(t, we) ? t : new we(t), n = e.readUInt8Enum(sr, (r) => {
    throw new wn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case sr.PublicKeyCompressed:
      return so($e.Compressed, Pu(e));
    case sr.PublicKeyUncompressed:
      return so($e.Uncompressed, To(dA(Pu(e).data)));
    case sr.SignatureCompressed:
      return so($e.Compressed, Nu(e));
    case sr.SignatureUncompressed:
      return so($e.Uncompressed, Nu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Vd(t) {
  return Wt(t.data);
}
function BE(t) {
  const e = [];
  switch (t.contents.type) {
    case it.PublicKey:
      e.push(t.pubKeyEncoding === $e.Compressed ? sr.PublicKeyCompressed : sr.PublicKeyUncompressed), e.push(Wt(uA(t.contents.data)));
      break;
    case it.MessageSignature:
      e.push(t.pubKeyEncoding === $e.Compressed ? sr.SignatureCompressed : sr.SignatureUncompressed), e.push(Vd(t.contents));
      break;
  }
  return Fe(e);
}
function _u(t) {
  return t.data.slice();
}
function Pu(t) {
  const e = In(t, we) ? t : new we(t), n = e.readUInt8(), r = n === 4 ? a3 : o3;
  return To(Fe([n, e.readBytes(r)]));
}
function qd(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === de.P2PKH || e === de.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === de.P2WPKH || e === de.P2WSH || e === de.P2WSHNonSequential) && !r.map((s) => s.data).every(Bo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case de.P2PKH:
      return ja(t, eA(r[0].data));
    case de.P2WPKH:
      return ja(t, nA(r[0].data));
    case de.P2SH:
    case de.P2SHNonSequential:
      return ja(t, rA(n, r.map(_u)));
    case de.P2WSH:
    case de.P2WSHNonSequential:
      return ja(t, sA(n, r.map(_u)));
  }
}
function ja(t, e) {
  return { type: it.Address, version: t, hash160: e };
}
function Yd(t) {
  return Mi.c32address(t.version, t.hash160);
}
function np(t) {
  const [e, n, r] = t.split(/\.|::/);
  return EE(e, n, r);
}
function Fo(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return AE(e, n);
  } else
    return vE(t);
}
function ME(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return PE(e, n);
  } else
    return NE(t);
}
function NE(t) {
  const e = Ds(t);
  return { type: qt.PrincipalStandard, value: Yd(e) };
}
function _E(t) {
  return { type: qt.PrincipalStandard, value: Yd(t) };
}
function PE(t, e) {
  const n = Ds(t), r = ar(e);
  return Py(n, r);
}
function Py(t, e) {
  if (Li(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: qt.PrincipalContract,
    value: `${Yd(t)}.${e.content}`
  };
}
function UE(t) {
  return { type: qt.ResponseErr, value: t };
}
function HE(t) {
  return { type: qt.ResponseOk, value: t };
}
const OE = (t) => ({ type: qt.StringASCII, value: t }), DE = (t) => ({ type: qt.StringUTF8, value: t });
function FE(t) {
  for (const e in t)
    if (!iA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: qt.Tuple, value: t };
}
function br(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new we(Wt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new we(t) : e = t;
  switch (e.readUInt8Enum(Ke, (r) => {
    throw new wn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ke.int:
      return fE(cu(e.readBytes(16)));
    case Ke.uint:
      return hE(e.readBytes(16));
    case Ke.buffer:
      const r = e.readUInt32BE();
      return uE(e.readBytes(r));
    case Ke.true:
      return cE();
    case Ke.false:
      return lE();
    case Ke.address:
      const s = So(e);
      return _E(s);
    case Ke.contract:
      const i = So(e), o = qn(e);
      return Py(i, o);
    case Ke.ok:
      return HE(br(e));
    case Ke.err:
      return UE(br(e));
    case Ke.none:
      return Iy();
    case Ke.some:
      return Ly(br(e));
    case Ke.list:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(br(e));
      return pE(c);
    case Ke.tuple:
      const l = e.readUInt32BE(), h = {};
      for (let v = 0; v < l; v++) {
        const C = qn(e).content;
        if (C === void 0)
          throw new wn('"content" is undefined');
        h[C] = br(e);
      }
      return FE(h);
    case Ke.ascii:
      const d = e.readUInt32BE(), w = wm(e.readBytes(d));
      return OE(w);
    case Ke.utf8:
      const g = e.readUInt32BE(), A = ga(e.readBytes(g));
      return DE(A);
    default:
      throw new wn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function $r(t, e) {
  return Fe([zd(t), e]);
}
function jE(t) {
  return new Uint8Array([zd(t.type)]);
}
function RE(t) {
  return t.type === qt.OptionalNone ? new Uint8Array([zd(t.type)]) : $r(t.type, Sr(t.value));
}
function zE(t) {
  const e = new Uint8Array(4);
  return di(e, Math.ceil(t.value.length / 2), 0), $r(t.type, vr(e, Wt(t.value)));
}
function GE(t) {
  const e = yd(fm(BigInt(t.value), BigInt(i3)), by);
  return $r(t.type, e);
}
function KE(t) {
  const e = yd(BigInt(t.value), by);
  return $r(t.type, e);
}
function VE(t) {
  return $r(t.type, xa(Ds(t.value)));
}
function qE(t) {
  const [e, n] = oA(t.value);
  return $r(t.type, vr(xa(Ds(e)), Eo(ar(n))));
}
function YE(t) {
  return $r(t.type, Sr(t.value));
}
function XE(t) {
  const e = [], n = new Uint8Array(4);
  di(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Sr(r);
    e.push(s);
  }
  return $r(t.type, Fe(e));
}
function WE(t) {
  const e = [], n = new Uint8Array(4);
  di(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ar(s);
    e.push(Eo(i));
    const o = Sr(t.value[s]);
    e.push(o);
  }
  return $r(t.type, Fe(e));
}
function Uy(t, e) {
  const n = [], r = e == "ascii" ? ym(t.value) : Li(t.value), s = new Uint8Array(4);
  return di(s, r.length, 0), n.push(s), n.push(r), $r(t.type, Fe(n));
}
function ZE(t) {
  return Uy(t, "ascii");
}
function QE(t) {
  return Uy(t, "utf8");
}
function rp(t) {
  return mt(Sr(t));
}
function Sr(t) {
  switch (t.type) {
    case qt.BoolTrue:
    case qt.BoolFalse:
      return jE(t);
    case qt.OptionalNone:
    case qt.OptionalSome:
      return RE(t);
    case qt.Buffer:
      return zE(t);
    case qt.UInt:
      return KE(t);
    case qt.Int:
      return GE(t);
    case qt.PrincipalStandard:
      return VE(t);
    case qt.PrincipalContract:
      return qE(t);
    case qt.ResponseOk:
    case qt.ResponseErr:
      return YE(t);
    case qt.List:
      return XE(t);
    case qt.Tuple:
      return WE(t);
    case qt.StringASCII:
      return ZE(t);
    case qt.StringUTF8:
      return QE(t);
    default:
      throw new ro("Unable to serialize. Invalid Clarity Value.");
  }
}
const JE = (t) => t.length % 2 ? `0${t}` : t, tA = (t, e) => t.padEnd(e, "0"), Hy = (t, e) => t ? Li(t).length > e : !1;
function Uu(t) {
  return py(t);
}
const sa = (t) => _3(Fd(t)), Xd = (t) => mt(aE(t)), eA = (t) => mt(sa(t)), nA = (t) => {
  const e = sa(t), n = vr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = sa(n);
  return mt(r);
}, rA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Fe(n), s = sa(r);
  return mt(s);
}, sA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Fe(n), s = Fd(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Fe(i), a = sa(o);
  return mt(a);
};
function iA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function oA(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
_e.hmacSha256Sync = (t, ...e) => {
  const n = Ey.create(Fd, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function To(t) {
  return t = typeof t == "string" ? Wt(t) : t, {
    type: it.PublicKey,
    data: t
  };
}
function aA(t, e, n = $e.Compressed) {
  const r = Sm(e), s = new Dn(rh(r.r), rh(r.s)), i = Dt.fromSignature(t, s, r.recoveryId), o = n === $e.Compressed;
  return i.toHex(o);
}
function cA(t) {
  return typeof t == "string" ? t : mt(t);
}
const Wd = cA;
function Oy(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === xm;
}
function Bo(t) {
  return !Wd(t).startsWith("04");
}
function lA(t) {
  t = wd(t);
  const e = Oy(t);
  return mt(ya(t.slice(0, 32), e));
}
function uA(t) {
  return Dt.fromHex(Wd(t)).toHex(!0);
}
function dA(t) {
  return Dt.fromHex(Wd(t)).toHex(!1);
}
function fA(t, e) {
  t = wd(t);
  const [n, r] = qc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return pa(r, 1) + Dn.fromHex(n).toCompactHex();
}
function Zd() {
  return {
    type: it.MessageSignature,
    data: mt(new Uint8Array(sl))
  };
}
function Dy(t, e, n, r) {
  const s = qd(0, t, 1, [To(e)]).hash160, i = Bo(e) ? $e.Compressed : $e.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: dn(n),
    fee: dn(r),
    keyEncoding: i,
    signature: Zd()
  };
}
function ia(t) {
  return "signature" in t;
}
function sp(t) {
  return t === de.P2SH || t === de.P2WSH;
}
function hA(t) {
  return t === de.P2SHNonSequential || t === de.P2WSHNonSequential;
}
function ip(t) {
  const e = Uu(t);
  return e.nonce = 0, e.fee = 0, ia(e) ? e.signature = Zd() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function pA(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    Hs(t.nonce, 8),
    Hs(t.fee, 8),
    t.keyEncoding,
    Vd(t.signature)
  ];
  return Fe(e);
}
function gA(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    Hs(t.nonce, 8),
    Hs(t.fee, 8)
  ], n = Gd(t.fields);
  e.push(Kd(n));
  const r = new Uint8Array(2);
  return Am(r, t.signaturesRequired, 0), e.push(r), Fe(e);
}
function yA(t, e) {
  const n = mt(e.readBytes(20)), r = BigInt(`0x${mt(e.readBytes(8))}`), s = BigInt(`0x${mt(e.readBytes(8))}`), i = e.readUInt8Enum($e, (a) => {
    throw new wn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === de.P2WPKH && i != $e.Compressed)
    throw new wn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Nu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function wA(t, e) {
  const n = mt(e.readBytes(20)), r = BigInt("0x" + mt(e.readBytes(8))), s = BigInt("0x" + mt(e.readBytes(8))), i = My(e, it.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case it.PublicKey:
        Bo(l.contents.data) || (o = !0);
        break;
      case it.MessageSignature:
        if (l.pubKeyEncoding === $e.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ri("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === de.P2WSH || t === de.P2WSHNonSequential))
    throw new ri("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Nl(t) {
  return ia(t) ? pA(t) : gA(t);
}
function _l(t) {
  const e = t.readUInt8Enum(de, (n) => {
    throw new wn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === de.P2PKH || e === de.P2WPKH ? yA(e, t) : wA(e, t);
}
function Fy(t, e, n, r) {
  const i = t + mt(new Uint8Array([e])) + mt(Hs(n, 8)) + mt(Hs(r, 8));
  if (Wt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Xd(Wt(i));
}
function jy(t, e, n) {
  const r = 33 + sl, s = Bo(e.data) ? $e.Compressed : $e.Uncompressed, i = t + JE(s.toString(16)) + n, o = Wt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Xd(o);
}
function bA(t, e, n, r, s) {
  const i = Fy(t, e, n, r), o = fA(s, i), a = To(lA(s)), c = jy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ry(t, e, n, r, s, i) {
  const o = Fy(t, e, n, r), a = To(aA(o, i, s)), c = jy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function mA() {
  const t = Dy(de.P2PKH, "", 0, 0);
  return t.signer = gE().hash160, t.keyEncoding = $e.Compressed, t.signature = Zd(), t;
}
function op(t, e, n) {
  return ia(t) ? xA(t, e, n) : SA(t, e, n);
}
function xA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Ry(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = qd(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ri(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function SA(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case it.PublicKey:
        Bo(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case it.MessageSignature:
        c.pubKeyEncoding === $e.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: h } = Ry(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (sp(t.hashMode) && (s = h), r.push(l), o += 1, o === 65536)
          throw new ri("Too many signatures");
        break;
    }
  if (sp(t.hashMode) && o !== t.signaturesRequired || hA(t.hashMode) && o < t.signaturesRequired)
    throw new ri("Incorrect number of signatures");
  if (i && (t.hashMode === de.P2WSH || t.hashMode === de.P2WSHNonSequential))
    throw new ri("Uncompressed keys are not allowed in this hash mode");
  const a = qd(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ri(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function zy(t) {
  return {
    authType: Me.Standard,
    spendingCondition: t
  };
}
function Gy(t, e) {
  return {
    authType: Me.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Dy(de.P2PKH, "0".repeat(66), 0, 0)
  };
}
function ap(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Me.Standard:
        return zy(ip(t.spendingCondition));
      case Me.Sponsored:
        return Gy(ip(t.spendingCondition), mA());
      default:
        throw new Lc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function EA(t, e) {
  switch (t.authType) {
    case Me.Standard:
      return op(t.spendingCondition, e, Me.Standard);
    case Me.Sponsored:
      return op(t.spendingCondition, e, Me.Standard);
    default:
      throw new Lc("Invalid origin auth type");
  }
}
function AA(t, e) {
  switch (t.authType) {
    case Me.Standard:
      const n = {
        ...t.spendingCondition,
        fee: dn(e)
      };
      return { ...t, spendingCondition: n };
    case Me.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: dn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function vA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: dn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function kA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: dn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function $A(t, e) {
  const n = {
    ...e,
    nonce: dn(e.nonce),
    fee: dn(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function IA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Me.Standard:
      e.push(Nl(t.spendingCondition));
      break;
    case Me.Sponsored:
      e.push(Nl(t.spendingCondition)), e.push(Nl(t.sponsorSpendingCondition));
      break;
  }
  return Fe(e);
}
function LA(t) {
  const e = t.readUInt8Enum(Me, (r) => {
    throw new wn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Me.Standard:
      return n = _l(t), zy(n);
    case Me.Sponsored:
      n = _l(t);
      const r = _l(t);
      return Gy(n, r);
  }
}
class CA {
  constructor({ auth: e, payload: n, postConditions: r = Gd([]), postConditionMode: s = Ic.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = n3(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: dn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Pn.Any;
  }
  signBegin() {
    const e = Uu(this);
    return e.auth = ap(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Uu(this);
    return e.auth = ap(e.auth), e.txid();
  }
  verifyOrigin() {
    return EA(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Me.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Me.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Me.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : To(e), r = this.auth.spendingCondition;
    if (r && !ia(r)) {
      const s = Bo(n.data);
      r.fields.push(so(s ? $e.Compressed : $e.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = bA(n, r, e.fee, e.nonce, s);
    if (ia(e))
      e.signature = Bu(i);
    else {
      const a = Oy(s);
      e.fields.push(so(a ? $e.Compressed : $e.Uncompressed, Bu(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Xd(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Me.Sponsored)
      throw new Lc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = $A(this.auth, e);
  }
  setFee(e) {
    this.auth = AA(this.auth, e);
  }
  setNonce(e) {
    this.auth = vA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Me.Sponsored)
      throw new Lc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = kA(this.auth, e);
  }
  serialize() {
    return mt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new ro('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new ro('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ro('"auth" is undefined');
    if (this.payload === void 0)
      throw new ro('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return di(n, this.chainId, 0), e.push(n), e.push(IA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Kd(this.postConditions)), e.push(_y(this.payload)), Fe(e);
  }
}
function TA(t) {
  const e = In(t, we) ? t : new we(t), n = e.readUInt8Enum(xi, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = LA(e), i = e.readUInt8Enum(Pn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum(Ic, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = My(e, it.PostCondition), c = CE(e), l = new CA({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return l.anchorMode = i, l;
}
const cp = BigInt("18446744073709551615");
function Pl(t) {
  const e = dn(t);
  if (e < 0n || e > cp)
    throw new RangeError(`Post-condition amount must be between 0 and ${cp} (u64 max), received: ${e}`);
  return e;
}
var Hu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Hu || (Hu = {}));
var Ou;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Ou || (Ou = {}));
function BA(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: it.PostCondition,
        conditionType: xe.STX,
        principal: t.address === "origin" ? { type: it.Principal, prefix: mn.Origin } : Fo(t.address),
        conditionCode: Ra(t.condition),
        amount: Pl(t.amount)
      };
    case "ft-postcondition":
      return {
        type: it.PostCondition,
        conditionType: xe.Fungible,
        principal: t.address === "origin" ? { type: it.Principal, prefix: mn.Origin } : Fo(t.address),
        conditionCode: Ra(t.condition),
        amount: Pl(t.amount),
        asset: np(t.asset)
      };
    case "nft-postcondition":
      return {
        type: it.PostCondition,
        conditionType: xe.NonFungible,
        principal: t.address === "origin" ? { type: it.Principal, prefix: mn.Origin } : Fo(t.address),
        conditionCode: Ra(t.condition),
        asset: np(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: it.PostCondition,
        conditionType: xe.Staking,
        principal: t.address === "origin" ? { type: it.Principal, prefix: mn.Origin } : Fo(t.address),
        conditionCode: Ra(t.condition),
        amount: Pl(t.amount)
      };
    case "pox-postcondition":
      return {
        type: it.PostCondition,
        conditionType: xe.PoX,
        principal: t.address === "origin" ? { type: it.Principal, prefix: mn.Origin } : Fo(t.address),
        conditionCode: MA(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Ra(t) {
  return Hu[t];
}
function MA(t) {
  return Ou[t];
}
function Ky(t) {
  const e = BA(t);
  return IE(e);
}
function NA(t, e, n) {
  return Jd(Vy(t), n);
}
function Vy(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = oa(r);
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
    return BigInt(`0x${UA(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Qd(t, e = 8) {
  return (typeof t == "bigint" ? t : Vy(t)).toString(16).padStart(e * 2, "0");
}
function Jd(t, e = 16) {
  const n = Qd(t, e);
  return oa(n);
}
function _A(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const PA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function UA(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += PA[n];
  return e;
}
function oa(t) {
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
function tf(t) {
  return new TextEncoder().encode(t);
}
function HA(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function OA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function lp(t) {
  if (t.some(OA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ef(...t) {
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
function Yr(t) {
  return ef(...t.map((e) => typeof e == "number" ? lp([e]) : e instanceof Array ? lp(e) : e));
}
function al(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Du;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Du || (Du = {}));
Du.Mainnet;
const DA = 128, FA = 128, qy = 16;
var Fu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Fu || (Fu = {}));
var up;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(up || (up = {}));
var dp;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(dp || (dp = {}));
var nr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(nr || (nr = {}));
const Ul = ["onChainOnly", "offChainOnly", "any"];
Ul[0] + "", nr.OnChainOnly, Ul[1] + "", nr.OffChainOnly, Ul[2] + "", nr.Any, nr.OnChainOnly + "", nr.OnChainOnly, nr.OffChainOnly + "", nr.OffChainOnly, nr.Any + "", nr.Any;
var ju;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ju || (ju = {}));
ju.Mainnet;
var fp;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(fp || (fp = {}));
var Js;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Js || (Js = {}));
var hp;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(hp || (hp = {}));
var pp;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(pp || (pp = {}));
var gp;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(gp || (gp = {}));
var yp;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(yp || (yp = {}));
var wp;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(wp || (wp = {}));
var bp;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(bp || (bp = {}));
var Ru;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ru || (Ru = {}));
var mp;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(mp || (mp = {}));
var xp;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(xp || (xp = {}));
function zu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function jA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Yy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function RA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  zu(t.outputLen), zu(t.blockLen);
}
function zA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function GA(t, e) {
  Yy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Hl = {
  number: zu,
  bool: jA,
  bytes: Yy,
  hash: RA,
  exists: zA,
  output: GA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ol = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, KA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!KA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function VA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Xy(t) {
  if (typeof t == "string" && (t = VA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let qA = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function _i(t) {
  const e = (r) => t().update(Xy(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function YA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let nf = class extends qA {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ol(this.buffer);
  }
  update(e) {
    Hl.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Xy(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ol(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Hl.exists(this), Hl.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let d = o; d < s; d++)
      n[d] = 0;
    YA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ol(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < l; d++)
      a.setUint32(4 * d, h[d], i);
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
const XA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Wy = Uint8Array.from({ length: 16 }, (t, e) => e), WA = Wy.map((t) => (9 * t + 5) % 16);
let rf = [Wy], sf = [WA];
for (let t = 0; t < 4; t++)
  for (let e of [rf, sf])
    e.push(e[t].map((n) => XA[n]));
const Zy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), ZA = rf.map((t, e) => t.map((n) => Zy[e][n])), QA = sf.map((t, e) => t.map((n) => Zy[e][n])), JA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), t4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), za = (t, e) => t << e | t >>> 32 - e;
function Sp(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ga = new Uint32Array(16);
let e4 = class extends nf {
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
      Ga[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, h = l, d = this.h4 | 0, w = d;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, v = JA[g], C = t4[g], U = rf[g], j = sf[g], k = ZA[g], B = QA[g];
      for (let P = 0; P < 16; P++) {
        const Y = za(r + Sp(g, i, a, l) + Ga[U[P]] + v, k[P]) + d | 0;
        r = d, d = l, l = za(a, 10) | 0, a = i, i = Y;
      }
      for (let P = 0; P < 16; P++) {
        const Y = za(s + Sp(A, o, c, h) + Ga[j[P]] + C, B[P]) + w | 0;
        s = w, w = h, h = za(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + l + w | 0, this.h3 + d + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ga.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
_i(() => new e4());
const n4 = (t, e, n) => t & e ^ ~t & n, r4 = (t, e, n) => t & e ^ t & n ^ e & n, s4 = new Uint32Array([
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
]), Ss = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Es = new Uint32Array(64);
let Qy = class extends nf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ss[0] | 0, this.B = Ss[1] | 0, this.C = Ss[2] | 0, this.D = Ss[3] | 0, this.E = Ss[4] | 0, this.F = Ss[5] | 0, this.G = Ss[6] | 0, this.H = Ss[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      Es[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Es[d - 15], g = Es[d - 2], A = pr(w, 7) ^ pr(w, 18) ^ w >>> 3, v = pr(g, 17) ^ pr(g, 19) ^ g >>> 10;
      Es[d] = v + Es[d - 7] + A + Es[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), g = h + w + n4(a, c, l) + s4[d] + Es[d] | 0, v = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + r4(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    Es.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, i4 = class extends Qy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
_i(() => new Qy());
_i(() => new i4());
const Ka = BigInt(2 ** 32 - 1), Gu = BigInt(32);
function Jy(t, e = !1) {
  return e ? { h: Number(t & Ka), l: Number(t >> Gu & Ka) } : { h: Number(t >> Gu & Ka) | 0, l: Number(t & Ka) | 0 };
}
function o4(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Jy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const a4 = (t, e) => BigInt(t >>> 0) << Gu | BigInt(e >>> 0), c4 = (t, e, n) => t >>> n, l4 = (t, e, n) => t << 32 - n | e >>> n, u4 = (t, e, n) => t >>> n | e << 32 - n, d4 = (t, e, n) => t << 32 - n | e >>> n, f4 = (t, e, n) => t << 64 - n | e >>> n - 32, h4 = (t, e, n) => t >>> n - 32 | e << 64 - n, p4 = (t, e) => e, g4 = (t, e) => t, y4 = (t, e, n) => t << n | e >>> 32 - n, w4 = (t, e, n) => e << n | t >>> 32 - n, b4 = (t, e, n) => e << n - 32 | t >>> 64 - n, m4 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function x4(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const S4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), E4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, A4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), v4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, k4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), $4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: Jy,
  split: o4,
  toBig: a4,
  shrSH: c4,
  shrSL: l4,
  rotrSH: u4,
  rotrSL: d4,
  rotrBH: f4,
  rotrBL: h4,
  rotr32H: p4,
  rotr32L: g4,
  rotlSH: y4,
  rotlSL: w4,
  rotlBH: b4,
  rotlBL: m4,
  add: x4,
  add3L: S4,
  add3H: E4,
  add4L: A4,
  add4H: v4,
  add5H: $4,
  add5L: k4
}, [I4, L4] = Nt.split([
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
].map((t) => BigInt(t))), As = new Uint32Array(80), vs = new Uint32Array(80);
let cl = class extends nf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: h, Fh: d, Fl: w, Gh: g, Gl: A, Hh: v, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, l, h, d, w, g, A, v, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, h, d, w, g, A, v, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      As[k] = e.getUint32(n), vs[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const B = As[k - 15] | 0, P = vs[k - 15] | 0, Y = Nt.rotrSH(B, P, 1) ^ Nt.rotrSH(B, P, 8) ^ Nt.shrSH(B, P, 7), st = Nt.rotrSL(B, P, 1) ^ Nt.rotrSL(B, P, 8) ^ Nt.shrSL(B, P, 7), Z = As[k - 2] | 0, q = vs[k - 2] | 0, y = Nt.rotrSH(Z, q, 19) ^ Nt.rotrBH(Z, q, 61) ^ Nt.shrSH(Z, q, 6), $ = Nt.rotrSL(Z, q, 19) ^ Nt.rotrBL(Z, q, 61) ^ Nt.shrSL(Z, q, 6), M = Nt.add4L(st, $, vs[k - 7], vs[k - 16]), T = Nt.add4H(M, Y, y, As[k - 7], As[k - 16]);
      As[k] = T | 0, vs[k] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: h, Eh: d, El: w, Fh: g, Fl: A, Gh: v, Gl: C, Hh: U, Hl: j } = this;
    for (let k = 0; k < 80; k++) {
      const B = Nt.rotrSH(d, w, 14) ^ Nt.rotrSH(d, w, 18) ^ Nt.rotrBH(d, w, 41), P = Nt.rotrSL(d, w, 14) ^ Nt.rotrSL(d, w, 18) ^ Nt.rotrBL(d, w, 41), Y = d & g ^ ~d & v, st = w & A ^ ~w & C, Z = Nt.add5L(j, P, st, L4[k], vs[k]), q = Nt.add5H(Z, U, B, Y, I4[k], As[k]), y = Z | 0, $ = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), M = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, j = C | 0, v = g | 0, C = A | 0, g = d | 0, A = w | 0, { h: d, l: w } = Nt.add(l | 0, h | 0, q | 0, y | 0), l = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = Nt.add3L(y, M, K);
      r = Nt.add3H(z, q, $, T), s = z | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: h } = Nt.add(this.Dh | 0, this.Dl | 0, l | 0, h | 0), { h: d, l: w } = Nt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: g, l: A } = Nt.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: v, l: C } = Nt.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: U, l: j } = Nt.add(this.Hh | 0, this.Hl | 0, U | 0, j | 0), this.set(r, s, i, o, a, c, l, h, d, w, g, A, v, C, U, j);
  }
  roundClean() {
    As.fill(0), vs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, C4 = class extends cl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, T4 = class extends cl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, B4 = class extends cl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
_i(() => new cl());
_i(() => new C4());
_i(() => new T4());
_i(() => new B4());
function M4(t, e, n) {
  const s = DA;
  if (Y4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Fu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var We;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(We || (We = {}));
let N4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, tw = class extends N4 {
  constructor(e) {
    super(e);
  }
};
function ll(t) {
  const e = [];
  return e.push(oa(Qd(t.version, 1))), e.push(oa(t.hash160)), Yr(e);
}
function _4(t) {
  const e = [];
  return e.push(t.prefix), e.push(ll(t.address)), t.prefix === Ru.Contract && e.push(aa(t.contractName)), Yr(e);
}
function aa(t) {
  const e = [], n = tf(t.content), r = n.byteLength;
  return e.push(oa(Qd(r, t.lengthPrefixBytes))), e.push(n), Yr(e);
}
function P4(t) {
  const e = [];
  return e.push(ll(t.address)), e.push(aa(t.contractName)), e.push(aa(t.assetName)), Yr(e);
}
function ew(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(_4(t.principal)), (t.conditionType === Js.Fungible || t.conditionType === Js.NonFungible) && e.push(P4(t.assetInfo)), t.conditionType === Js.NonFungible && e.push(Ei(t.assetName)), e.push(t.conditionCode), t.conditionType === Js.STX || t.conditionType === Js.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new tw("The post-condition amount may not be larger than 8 bytes");
    e.push(NA(t.amount, !1, 8));
  }
  return Yr(e);
}
function Ir(t, e) {
  return Yr([t, e]);
}
function U4(t) {
  return new Uint8Array([t.type]);
}
function H4(t) {
  return t.type === We.OptionalNone ? new Uint8Array([t.type]) : Ir(t.type, Ei(t.value));
}
function O4(t) {
  const e = new Uint8Array(4);
  return al(e, t.buffer.length, 0), Ir(t.type, ef(e, t.buffer));
}
function D4(t) {
  const e = Jd(_A(t.value, BigInt(FA)), qy);
  return Ir(t.type, e);
}
function F4(t) {
  const e = Jd(t.value, qy);
  return Ir(t.type, e);
}
function j4(t) {
  return Ir(t.type, ll(t.address));
}
function R4(t) {
  return Ir(t.type, ef(ll(t.address), aa(t.contractName)));
}
function z4(t) {
  return Ir(t.type, Ei(t.value));
}
function G4(t) {
  const e = [], n = new Uint8Array(4);
  al(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ei(r);
    e.push(s);
  }
  return Ir(t.type, Yr(e));
}
function K4(t) {
  const e = [], n = new Uint8Array(4);
  al(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = M4(s);
    e.push(aa(i));
    const o = Ei(t.data[s]);
    e.push(o);
  }
  return Ir(t.type, Yr(e));
}
function nw(t, e) {
  const n = [], r = e == "ascii" ? HA(t.data) : tf(t.data), s = new Uint8Array(4);
  return al(s, r.length, 0), n.push(s), n.push(r), Ir(t.type, Yr(n));
}
function V4(t) {
  return nw(t, "ascii");
}
function q4(t) {
  return nw(t, "utf8");
}
function Ei(t) {
  switch (t.type) {
    case We.BoolTrue:
    case We.BoolFalse:
      return U4(t);
    case We.OptionalNone:
    case We.OptionalSome:
      return H4(t);
    case We.Buffer:
      return O4(t);
    case We.UInt:
      return F4(t);
    case We.Int:
      return D4(t);
    case We.PrincipalStandard:
      return j4(t);
    case We.PrincipalContract:
      return R4(t);
    case We.ResponseOk:
    case We.ResponseErr:
      return z4(t);
    case We.List:
      return G4(t);
    case We.Tuple:
      return K4(t);
    case We.StringASCII:
      return V4(t);
    case We.StringUTF8:
      return q4(t);
    default:
      throw new tw("Unable to serialize. Invalid Clarity Value.");
  }
}
const Y4 = (t, e) => t ? tf(t).length > e : !1, X4 = "connect-ui";
let cc, rw, Un = !1, Ku = !1;
const qr = (t, e = "") => () => {
}, W4 = (t, e) => () => {
}, Z4 = "{visibility:hidden}.hydrated{visibility:inherit}", Ep = {}, Q4 = "http://www.w3.org/2000/svg", J4 = "http://www.w3.org/1999/xhtml", tv = (t) => t != null, of = (t) => (t = typeof t, t === "object" || t === "function");
function sw(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Ct = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (l) => {
    for (let h = 0; h < l.length; h++)
      r = l[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !of(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Vu(null, r) : r), i = s);
  };
  if (a(n), e) {
    const l = e.className || e.class;
    l && (e.class = typeof l != "object" ? l : Object.keys(l).filter((h) => l[h]).join(" "));
  }
  const c = Vu(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Vu = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, ev = {}, nv = (t) => t && t.$tag$ === ev, rv = (t, e) => t != null && !of(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, sv = (t) => Mo(t).$hostElement$, iv = (t, e, n) => {
  const r = ln.ce(e, n);
  return t.dispatchEvent(r), r;
}, Ap = /* @__PURE__ */ new WeakMap(), ov = (t, e, n) => {
  let r = Cc.get(t);
  $v && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Cc.set(t, r);
}, av = (t, e, n, r) => {
  var s;
  let i = iw(e);
  const o = Cc.get(i);
  if (t = t.nodeType === 11 ? t : Er, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Ap.get(t), c;
      if (a || Ap.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Er.createElement("style"), c.innerHTML = o;
          const l = (s = ln.$nonce$) !== null && s !== void 0 ? s : sw(Er);
          l != null && c.setAttribute("nonce", l), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, cv = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = qr("attachStyles", e.$tagName$), i = av(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, iw = (t, e) => "sc-" + t.$tagName$, vp = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = $p(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, l = kp(n), h = kp(r);
      c.remove(...l.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !l.includes(d)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : $p(ul, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && ln.rel(t, e, n, !1), r && ln.ael(t, e, r, !1);
    else {
      const c = of(r);
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
}, lv = /\s/, kp = (t) => t ? t.split(lv) : [], ow = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Ep, o = e.$attrs$ || Ep;
  for (r in i)
    r in o || vp(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    vp(s, r, i[r], o[r], n, e.$flags$);
}, af = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Er.createTextNode(s.$text$);
  else {
    if (Un || (Un = s.$tag$ === "svg"), o = s.$elm$ = Er.createElementNS(Un ? Q4 : J4, s.$tag$), Un && s.$tag$ === "foreignObject" && (Un = !1), ow(null, s, Un), tv(cc) && o["s-si"] !== cc && o.classList.add(o["s-si"] = cc), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = af(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Un = !1 : o.tagName === "foreignObject" && (Un = !0);
  }
  return o;
}, aw = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === rw && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = af(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, cw = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, uv = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], l = r.length - 1, h = r[0], d = r[l], w;
  for (; s <= o && i <= l; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : h == null ? h = r[++i] : d == null ? d = r[--l] : Va(a, h) ? (Vo(a, h), a = e[++s], h = r[++i]) : Va(c, d) ? (Vo(c, d), c = e[--o], d = r[--l]) : Va(a, d) ? (Vo(a, d), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], d = r[--l]) : Va(c, h) ? (Vo(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++i]) : (w = af(e && e[i], n, i), h = r[++i], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > o ? aw(t, r[l + 1] == null ? null : r[l + 1].$elm$, n, r, i, l) : i > l && cw(e, s, o);
}, Va = (t, e) => t.$tag$ === e.$tag$, Vo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Un = i === "svg" ? !0 : i === "foreignObject" ? !1 : Un, ow(t, e, Un), r !== null && s !== null ? uv(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), aw(n, null, e, s, 0, s.length - 1)) : r !== null && cw(r, 0, r.length - 1), Un && i === "svg" && (Un = !1)) : t.$text$ !== o && (n.data = o);
}, dv = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Vu(null, null), s = nv(e) ? e : Ct(null, null, e);
  rw = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, cc = n["s-sc"], Vo(r, s);
}, lw = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, cf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return lw(t, t.$ancestorComponent$), Lv(() => fv(t, e));
}, fv = (t, e) => {
  const n = qr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), yv(s, () => hv(t, r, e));
}, hv = async (t, e, n) => {
  const r = t.$hostElement$, s = qr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && cv(t);
  const o = qr("render", t.$cmpMeta$.$tagName$);
  pv(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => gv(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, pv = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, dv(t, e);
  } catch (r) {
    ca(r, t.$hostElement$);
  }
  return null;
}, gv = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = qr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, dw(n), r(), t.$onReadyResolve$(n), s || uw()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && uf(() => cf(t, !1)), t.$flags$ &= -517;
}, uw = (t) => {
  dw(Er.documentElement), uf(() => iv(ul, "appload", { detail: { namespace: X4 } }));
}, yv = (t, e) => t && t.then ? t.then(e) : e(), dw = (t) => t.classList.add("hydrated"), wv = (t, e) => Mo(t).$instanceValues$.get(e), bv = (t, e, n, r) => {
  const s = Mo(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = rv(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), l = n !== i && !c;
  (!(o & 8) || i === void 0) && l && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && cf(s, !1));
}, fw = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return wv(this, i);
        },
        set(a) {
          bv(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        ln.jmp(() => {
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
}, mv = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = kv(n), s.then) {
        const c = W4();
        s = await s, c();
      }
      s.isProxied || (fw(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = qr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        ca(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = iw(n);
      if (!Cc.has(c)) {
        const l = qr("registerStyles", n.$tagName$);
        ov(c, a, !!(n.$flags$ & 1)), l();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => cf(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, xv = (t) => {
  if (!(ln.$flags$ & 1)) {
    const e = Mo(t), n = e.$cmpMeta$, r = qr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            lw(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), mv(t, e, n);
    }
    r();
  }
}, Sv = (t) => {
  ln.$flags$ & 1 || Mo(t);
}, Ev = (t, e = {}) => {
  var n;
  const r = qr(), s = [], i = e.exclude || [], o = ul.customElements, a = Er.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), l = /* @__PURE__ */ Er.createElement("style"), h = [];
  let d, w = !0;
  Object.assign(ln, e), ln.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Er.baseURI).href, t.map((g) => {
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
        constructor(j) {
          super(j), j = this, vv(j, v), v.$flags$ & 1 && j.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), w ? h.push(this) : ln.jmp(() => xv(this));
        }
        disconnectedCallback() {
          ln.jmp(() => Sv(this));
        }
        componentOnReady() {
          return Mo(this).$onReadyPromise$;
        }
      };
      v.$lazyBundleId$ = g[0], !i.includes(C) && !o.get(C) && (s.push(C), o.define(C, fw(
        U,
        v,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    l.innerHTML = s + Z4, l.setAttribute("data-styles", "");
    const g = (n = ln.$nonce$) !== null && n !== void 0 ? n : sw(Er);
    g != null && l.setAttribute("nonce", g), a.insertBefore(l, c ? c.nextSibling : a.firstChild);
  }
  w = !1, h.length ? h.map((g) => g.connectedCallback()) : ln.jmp(() => d = setTimeout(uw, 30)), r();
}, lf = /* @__PURE__ */ new WeakMap(), Mo = (t) => lf.get(t), Av = (t, e) => lf.set(e.$lazyInstance$ = t, e), vv = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], lf.set(t, n);
}, $p = (t, e) => e in t, ca = (t, e) => (0, console.error)(t, e), Dl = /* @__PURE__ */ new Map(), kv = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Dl.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Dl.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => DI).then(o, ca);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Dl.set(s, o), o[r]), ca);
}, Cc = /* @__PURE__ */ new Map(), ul = typeof window < "u" ? window : {}, Er = ul.document || { head: {} }, ln = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, hw = (t) => Promise.resolve(t), $v = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Ip = [], pw = [], Iv = (t, e) => (n) => {
  t.push(n), Ku || (Ku = !0, ln.$flags$ & 4 ? uf(qu) : ln.raf(qu));
}, Lp = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      ca(n);
    }
  t.length = 0;
}, qu = () => {
  Lp(Ip), Lp(pw), (Ku = Ip.length > 0) && ln.raf(qu);
}, uf = (t) => hw().then(t), Lv = /* @__PURE__ */ Iv(pw), Cv = () => hw(), Tv = (t, e) => typeof window > "u" ? Promise.resolve() : Cv().then(() => Ev([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Bv = Object.defineProperty, Mv = Object.defineProperties, Nv = Object.getOwnPropertyDescriptors, Tc = Object.getOwnPropertySymbols, gw = Object.prototype.hasOwnProperty, yw = Object.prototype.propertyIsEnumerable, Cp = (t, e, n) => e in t ? Bv(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, jn = (t, e) => {
  for (var n in e || (e = {})) gw.call(e, n) && Cp(t, n, e[n]);
  if (Tc) for (var n of Tc(e)) yw.call(e, n) && Cp(t, n, e[n]);
  return t;
}, cr = (t, e) => Mv(t, Nv(e)), ww = (t, e) => {
  var n = {};
  for (var r in t) gw.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Tc) for (var r of Tc(t)) e.indexOf(r) < 0 && yw.call(t, r) && (n[r] = t[r]);
  return n;
};
function bw() {
  return rl(yi()) || window.StacksProvider || window.BlockstackProvider;
}
function dl(t) {
  return t ? typeof t == "string" ? bi.fromName(t) : "version" in t ? t : "url" in t ? new Su({ url: t.url }) : t.transactionVersion === xi.Mainnet ? new Su({ url: t.client.baseUrl }) : new Eu({ url: t.client.baseUrl }) : new Eu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var _v = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(_v || {}), Pv = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Pv || {}), df = (t) => {
  let e = t;
  if (!e) {
    let n = new Z0(["store_write"], document.location.href);
    e = new xu({ appConfig: n });
  }
  return e;
};
function mw(t) {
  try {
    return df(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var xw = (t) => {
  let e = df(t).loadUserData().appPrivateKey, n = en.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Uv(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [mi.Mainnet]: "mainnet", [mi.Testnet]: "testnet" }, a = dl(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function Hv(t) {
  let e = dl(t.network), n = df(t.userSession), r = cr(jn({}, t), { network: e, userSession: n });
  return jn({ stxAddress: Uv(r) }, r);
}
async function Ov(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Ky) : n = n.map((r) => mt(ew(r)))), new en.TokenSigner("ES256k", e).signAsync(cr(jn({}, t), { postConditions: n }));
}
function Dv(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Ky) : e = e.map((n) => mt(ew(n)))), en.createUnsecuredToken(cr(jn({}, t), { postConditions: e }));
}
var Fv = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Wt(a.replace(/^0x/, "")), l = TA(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, cr(jn({}, o), { stacksTransaction: l }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, cr(jn({}, o), { stacksTransaction: l }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, jv = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = ww(e, ["amount", "appDetails", "userSession"]);
  if (mw(s)) {
    let { privateKey: a, publicKey: c } = xw(s), l = cr(jn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (l.appDetails = r), Ov(l, a);
  }
  let o = cr(jn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), Dv(o);
};
async function Rv(t, e, n) {
  let r = await e(cr(jn(jn({}, Hv(t)), t), { network: dl(t.network) }));
  return Fv({ token: r, options: t }, n);
}
function zv(t, e = bw()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return Rv(t, jv, e);
}
function Sw(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? cr(jn({}, t), { message: rp(e), domain: rp(n) }) : cr(jn({}, t), { message: mt(Ei(e)), domain: mt(Ei(n)) });
}
async function Gv(t, e) {
  return new en.TokenSigner("ES256k", e).signAsync(Sw(t));
}
async function Kv(t) {
  let e = t, { userSession: n } = e, r = ww(e, ["userSession"]);
  if (mw(n)) {
    let { privateKey: s, publicKey: i } = xw(n), o = cr(jn({}, r), { publicKey: i });
    return Gv(o, s);
  }
  return en.createUnsecuredToken(Sw(t));
}
var Vv = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Vv || {}), Ew = "asigna-stx", Tp = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Ew && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Yv(t, e), "*");
}), qv = { authenticationRequest: async (t) => Tp(t, "authenticationRequest"), transactionRequest: async (t) => Tp(t, "transactionRequest") }, Yv = (t, e) => ({ source: Ew, [e]: t }), Xv = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = qv);
};
Xv();
var Wv = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function Zv(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = yi(), o = bw();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    Tv();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : Wv, c = RS(a), l = document.createElement("connect-modal");
    l.defaultProviders = a, l.installedProviders = c, l.persistSelection = e;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      l.remove(), document.body.style.overflow = h;
    };
    l.callback = (g) => {
      d(), t(n, g);
    }, l.cancelCallback = () => {
      var g;
      d(), (g = n.onCancel) == null || g.call(n);
    }, document.body.appendChild(l);
    let w = (g) => {
      g.key === "Escape" && (document.removeEventListener("keydown", w), l.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var qa = Zv(zv);
function Os(t, e, n) {
  return ff(Sn(t, e), n);
}
function Sn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ee(r);
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
      const r = tk(BigInt(`0x${Rt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Rt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Bp(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Sa(t, e = 8) {
  return (typeof t == "bigint" ? t : Sn(t, !1)).toString(16).padStart(e * 2, "0");
}
function fl(t) {
  return parseInt(t, 16);
}
function ff(t, e = 16) {
  const n = Sa(t, e);
  return Ee(n);
}
function Qv(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Jv(t, e) {
  return t & BigInt(1) << e;
}
function tk(t, e) {
  return Jv(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const ek = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Rt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += ek[n];
  return e;
}
function Ee(t) {
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
function No(t) {
  return new TextEncoder().encode(t);
}
function hf(t) {
  return new TextDecoder().decode(t);
}
function Aw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function nk(t) {
  return String.fromCharCode.apply(null, t);
}
function rk(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Mp(t) {
  if (t.some(rk))
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
function je(t) {
  return hl(...t.map((e) => typeof e == "number" ? Mp([e]) : e instanceof Array ? Mp(e) : e));
}
var Np;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Np || (Np = {}));
var _p;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(_p || (_p = {}));
var Pp;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Pp || (Pp = {}));
const vw = 33, Fl = 32;
function sk(t) {
  if (t.length < Fl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Fl * 2), r = t.slice(2 + Fl * 2);
  return {
    recoveryId: fl(e),
    r: n,
    s: r
  };
}
function ik(t) {
  const e = typeof t == "string" ? Ee(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function ok(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function ak(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function ck(t, e) {
  return t[e];
}
function lk(t, e, n = 0) {
  return t[n] = e, t;
}
function uk(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ai(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Yu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Yu || (Yu = {}));
const dk = Yu.Mainnet, fk = 128, hk = 128, kw = 16, ci = 32, Xu = 80, pl = 65, pk = 32, gk = 64, Bc = 34;
var wt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(wt || (wt = {}));
var Ot;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ot || (Ot = {}));
var Wu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Wu || (Wu = {}));
var kn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(kn || (kn = {}));
const lc = ["onChainOnly", "offChainOnly", "any"], Up = {
  [lc[0]]: kn.OnChainOnly,
  [lc[1]]: kn.OffChainOnly,
  [lc[2]]: kn.Any,
  [kn.OnChainOnly]: kn.OnChainOnly,
  [kn.OffChainOnly]: kn.OffChainOnly,
  [kn.Any]: kn.Any
};
function yk(t) {
  if (t in Up)
    return Up[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${lc.join(", ")}`);
}
var Mc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Mc || (Mc = {}));
Mc.Mainnet;
var Ao;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ao || (Ao = {}));
var $n;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})($n || ($n = {}));
var Ne;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ne || (Ne = {}));
var fe;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(fe || (fe = {}));
var Nc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Nc || (Nc = {}));
var Ie;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ie || (Ie = {}));
var la;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(la || (la = {}));
var Zu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Zu || (Zu = {}));
var ua;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ua || (ua = {}));
var Hp;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Hp || (Hp = {}));
var Op;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Op || (Op = {}));
function Qu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function wk(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function $w(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function bk(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Qu(t.outputLen), Qu(t.blockLen);
}
function mk(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function xk(t, e) {
  $w(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ii = {
  number: Qu,
  bool: wk,
  bytes: $w,
  hash: bk,
  exists: mk,
  output: xk
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const jl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), gr = (t, e) => t << 32 - e | t >>> e, Sk = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Sk)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ek(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function pf(t) {
  if (typeof t == "string" && (t = Ek(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Iw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Pi(t) {
  const e = (r) => t().update(pf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Ak(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
class gf extends Iw {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jl(this.buffer);
  }
  update(e) {
    ii.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = pf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = jl(e);
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
    for (let d = o; d < s; d++)
      n[d] = 0;
    Ak(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = jl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < l; d++)
      a.setUint32(4 * d, h[d], i);
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
const vk = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Lw = Uint8Array.from({ length: 16 }, (t, e) => e), kk = Lw.map((t) => (9 * t + 5) % 16);
let yf = [Lw], wf = [kk];
for (let t = 0; t < 4; t++)
  for (let e of [yf, wf])
    e.push(e[t].map((n) => vk[n]));
const Cw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), $k = yf.map((t, e) => t.map((n) => Cw[e][n])), Ik = wf.map((t, e) => t.map((n) => Cw[e][n])), Lk = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ck = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ya = (t, e) => t << e | t >>> 32 - e;
function Dp(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xa = new Uint32Array(16);
class Tk extends gf {
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
      Xa[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, h = l, d = this.h4 | 0, w = d;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, v = Lk[g], C = Ck[g], U = yf[g], j = wf[g], k = $k[g], B = Ik[g];
      for (let P = 0; P < 16; P++) {
        const Y = Ya(r + Dp(g, i, a, l) + Xa[U[P]] + v, k[P]) + d | 0;
        r = d, d = l, l = Ya(a, 10) | 0, a = i, i = Y;
      }
      for (let P = 0; P < 16; P++) {
        const Y = Ya(s + Dp(A, o, c, h) + Xa[j[P]] + C, B[P]) + w | 0;
        s = w, w = h, h = Ya(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + l + w | 0, this.h3 + d + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Xa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const Bk = Pi(() => new Tk()), Mk = (t, e, n) => t & e ^ ~t & n, Nk = (t, e, n) => t & e ^ t & n ^ e & n, _k = new Uint32Array([
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
]), ks = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), $s = new Uint32Array(64);
class Tw extends gf {
  constructor() {
    super(64, 32, 8, !1), this.A = ks[0] | 0, this.B = ks[1] | 0, this.C = ks[2] | 0, this.D = ks[3] | 0, this.E = ks[4] | 0, this.F = ks[5] | 0, this.G = ks[6] | 0, this.H = ks[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      $s[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = $s[d - 15], g = $s[d - 2], A = gr(w, 7) ^ gr(w, 18) ^ w >>> 3, v = gr(g, 17) ^ gr(g, 19) ^ g >>> 10;
      $s[d] = v + $s[d - 7] + A + $s[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), g = h + w + Mk(a, c, l) + _k[d] + $s[d] | 0, v = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + Nk(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    $s.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Pk extends Tw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const bf = Pi(() => new Tw());
Pi(() => new Pk());
const Wa = BigInt(2 ** 32 - 1), Ju = BigInt(32);
function Bw(t, e = !1) {
  return e ? { h: Number(t & Wa), l: Number(t >> Ju & Wa) } : { h: Number(t >> Ju & Wa) | 0, l: Number(t & Wa) | 0 };
}
function Uk(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Bw(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Hk = (t, e) => BigInt(t >>> 0) << Ju | BigInt(e >>> 0), Ok = (t, e, n) => t >>> n, Dk = (t, e, n) => t << 32 - n | e >>> n, Fk = (t, e, n) => t >>> n | e << 32 - n, jk = (t, e, n) => t << 32 - n | e >>> n, Rk = (t, e, n) => t << 64 - n | e >>> n - 32, zk = (t, e, n) => t >>> n - 32 | e << 64 - n, Gk = (t, e) => e, Kk = (t, e) => t, Vk = (t, e, n) => t << n | e >>> 32 - n, qk = (t, e, n) => e << n | t >>> 32 - n, Yk = (t, e, n) => e << n - 32 | t >>> 64 - n, Xk = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Wk(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Zk = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Qk = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Jk = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), t8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, e8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), n8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: Bw,
  split: Uk,
  toBig: Hk,
  shrSH: Ok,
  shrSL: Dk,
  rotrSH: Fk,
  rotrSL: jk,
  rotrBH: Rk,
  rotrBL: zk,
  rotr32H: Gk,
  rotr32L: Kk,
  rotlSH: Vk,
  rotlSL: qk,
  rotlBH: Yk,
  rotlBL: Xk,
  add: Wk,
  add3L: Zk,
  add3H: Qk,
  add4L: Jk,
  add4H: t8,
  add5H: n8,
  add5L: e8
}, [r8, s8] = _t.split([
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
].map((t) => BigInt(t))), Is = new Uint32Array(80), Ls = new Uint32Array(80);
class gl extends gf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: h, Fh: d, Fl: w, Gh: g, Gl: A, Hh: v, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, l, h, d, w, g, A, v, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, h, d, w, g, A, v, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      Is[k] = e.getUint32(n), Ls[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const B = Is[k - 15] | 0, P = Ls[k - 15] | 0, Y = _t.rotrSH(B, P, 1) ^ _t.rotrSH(B, P, 8) ^ _t.shrSH(B, P, 7), st = _t.rotrSL(B, P, 1) ^ _t.rotrSL(B, P, 8) ^ _t.shrSL(B, P, 7), Z = Is[k - 2] | 0, q = Ls[k - 2] | 0, y = _t.rotrSH(Z, q, 19) ^ _t.rotrBH(Z, q, 61) ^ _t.shrSH(Z, q, 6), $ = _t.rotrSL(Z, q, 19) ^ _t.rotrBL(Z, q, 61) ^ _t.shrSL(Z, q, 6), M = _t.add4L(st, $, Ls[k - 7], Ls[k - 16]), T = _t.add4H(M, Y, y, Is[k - 7], Is[k - 16]);
      Is[k] = T | 0, Ls[k] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: h, Eh: d, El: w, Fh: g, Fl: A, Gh: v, Gl: C, Hh: U, Hl: j } = this;
    for (let k = 0; k < 80; k++) {
      const B = _t.rotrSH(d, w, 14) ^ _t.rotrSH(d, w, 18) ^ _t.rotrBH(d, w, 41), P = _t.rotrSL(d, w, 14) ^ _t.rotrSL(d, w, 18) ^ _t.rotrBL(d, w, 41), Y = d & g ^ ~d & v, st = w & A ^ ~w & C, Z = _t.add5L(j, P, st, s8[k], Ls[k]), q = _t.add5H(Z, U, B, Y, r8[k], Is[k]), y = Z | 0, $ = _t.rotrSH(r, s, 28) ^ _t.rotrBH(r, s, 34) ^ _t.rotrBH(r, s, 39), M = _t.rotrSL(r, s, 28) ^ _t.rotrBL(r, s, 34) ^ _t.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, j = C | 0, v = g | 0, C = A | 0, g = d | 0, A = w | 0, { h: d, l: w } = _t.add(l | 0, h | 0, q | 0, y | 0), l = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = _t.add3L(y, M, K);
      r = _t.add3H(z, q, $, T), s = z | 0;
    }
    ({ h: r, l: s } = _t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = _t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = _t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: h } = _t.add(this.Dh | 0, this.Dl | 0, l | 0, h | 0), { h: d, l: w } = _t.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: g, l: A } = _t.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: v, l: C } = _t.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: U, l: j } = _t.add(this.Hh | 0, this.Hl | 0, U | 0, j | 0), this.set(r, s, i, o, a, c, l, h, d, w, g, A, v, C, U, j);
  }
  roundClean() {
    Is.fill(0), Ls.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class i8 extends gl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class o8 extends gl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class a8 extends gl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Pi(() => new gl());
Pi(() => new i8());
const c8 = Pi(() => new o8());
Pi(() => new a8());
function Mw(t) {
  if (Ee(t).byteLength != pl)
    throw Error("Invalid signature");
  return {
    type: wt.MessageSignature,
    data: t
  };
}
function qo(t, e) {
  return { type: wt.Address, version: t, hash160: e };
}
function io(t) {
  return Mi.c32address(t.version, t.hash160);
}
function vi(t, e, n) {
  const r = e || 1, s = n || fk;
  if (Xw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: wt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function mf(t) {
  const e = Mi.c32addressDecode(t);
  return {
    type: wt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var J;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(J || (J = {}));
function l8(t) {
  if (t.type === J.PrincipalStandard)
    return io(t.address);
  if (t.type === J.PrincipalContract)
    return `${io(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Nw(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return f8(e, n);
  } else
    return u8(t);
}
function u8(t) {
  const e = mf(t);
  return { type: J.PrincipalStandard, address: e };
}
function d8(t) {
  return { type: J.PrincipalStandard, address: t };
}
function f8(t, e) {
  const n = mf(t), r = vi(e);
  return _w(n, r);
}
function _w(t, e) {
  if (No(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: J.PrincipalContract, address: t, contractName: e };
}
function Rl(t, e = !1) {
  switch (t.type) {
    case J.BoolTrue:
      return !0;
    case J.BoolFalse:
      return !1;
    case J.Int:
    case J.UInt:
      return e ? t.value.toString() : t.value;
    case J.Buffer:
      return `0x${Rt(t.buffer)}`;
    case J.OptionalNone:
      return null;
    case J.OptionalSome:
      return mr(t.value);
    case J.ResponseErr:
      return mr(t.value);
    case J.ResponseOk:
      return mr(t.value);
    case J.PrincipalStandard:
    case J.PrincipalContract:
      return l8(t);
    case J.List:
      return t.list.map((r) => mr(r));
    case J.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = mr(t.data[r]);
      }), n;
    case J.StringASCII:
      return t.data;
    case J.StringUTF8:
      return t.data;
  }
}
function mr(t) {
  switch (t.type) {
    case J.ResponseErr:
      return { type: Bs(t), value: Rl(t, !0), success: !1 };
    case J.ResponseOk:
      return { type: Bs(t), value: Rl(t, !0), success: !0 };
    default:
      return { type: Bs(t), value: Rl(t, !0) };
  }
}
function Bs(t) {
  switch (t.type) {
    case J.BoolTrue:
    case J.BoolFalse:
      return "bool";
    case J.Int:
      return "int";
    case J.UInt:
      return "uint";
    case J.Buffer:
      return `(buff ${t.buffer.length})`;
    case J.OptionalNone:
      return "(optional none)";
    case J.OptionalSome:
      return `(optional ${Bs(t.value)})`;
    case J.ResponseErr:
      return `(response UnknownType ${Bs(t.value)})`;
    case J.ResponseOk:
      return `(response ${Bs(t.value)} UnknownType)`;
    case J.PrincipalStandard:
    case J.PrincipalContract:
      return "principal";
    case J.List:
      return `(list ${t.list.length} ${t.list.length ? Bs(t.list[0]) : "UnknownType"})`;
    case J.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Bs(t.data[e])})`).join(" ")})`;
    case J.StringASCII:
      return `(string-ascii ${Aw(t.data).length})`;
    case J.StringUTF8:
      return `(string-utf8 ${No(t.data).length})`;
  }
}
const Pw = () => ({ type: J.BoolTrue }), Uw = () => ({ type: J.BoolFalse }), h8 = (t) => t ? Pw() : Uw(), Fp = BigInt("0xffffffffffffffffffffffffffffffff"), p8 = BigInt(0), jp = BigInt("0x7fffffffffffffffffffffffffffffff"), Rp = BigInt("-170141183460469231731687303715884105728"), g8 = (t) => {
  const e = Sn(t, !0);
  if (e > jp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${jp}`);
  if (e < Rp)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Rp}`);
  return { type: J.Int, value: e };
}, Ar = (t) => {
  const e = Sn(t, !1);
  if (e < p8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Fp)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Fp}`);
  return { type: J.UInt, value: e };
}, Hw = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: J.Buffer, buffer: t };
};
function Ow() {
  return { type: J.OptionalNone };
}
function Dw(t) {
  return { type: J.OptionalSome, value: t };
}
function y8(t) {
  return { type: J.ResponseErr, value: t };
}
function w8(t) {
  return { type: J.ResponseOk, value: t };
}
function b8(t) {
  return { type: J.List, list: t };
}
function ki(t) {
  for (const e in t)
    if (!a6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: J.Tuple, data: t };
}
const tn = (t) => ({ type: J.StringASCII, data: t }), m8 = (t) => ({ type: J.StringUTF8, data: t });
class Fw extends Iw {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ii.hash(e);
    const r = pf(n);
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
}
const jw = (t, e, n) => new Fw(t, e).update(n).digest();
jw.create = (t, e) => new Fw(t, e);
_e.hmacSha256Sync = (t, ...e) => {
  const n = jw.create(bf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function vo(t) {
  return {
    type: wt.PublicKey,
    data: Ee(t)
  };
}
function x8(t, e, n = Ie.Compressed) {
  const r = sk(e.data), s = new Dn(Bp(r.r), Bp(r.s)), i = Dt.fromSignature(t, s, r.recoveryId), o = n === Ie.Compressed;
  return i.toHex(o);
}
function S8(t) {
  return { type: wt.PublicKey, data: t };
}
function _o(t) {
  return !Rt(t.data).startsWith("04");
}
function _c(t) {
  return t.data.slice();
}
function E8(t) {
  const e = k8(t), n = ya(e.data.slice(0, 32), e.compressed);
  return vo(Rt(n));
}
function A8(t) {
  const e = typeof t == "string" ? t : Rt(t), n = Dt.fromHex(e).toHex(!0);
  return vo(n);
}
function v8(t) {
  const e = typeof t == "string" ? t : Rt(t), n = Dt.fromHex(e).toHex(!1);
  return vo(n);
}
function td(t) {
  const e = t.readUInt8(), n = e === 4 ? gk : pk;
  return S8(je([e, t.readBytes(n)]));
}
function k8(t) {
  const e = ik(t), n = e.length == vw;
  return { data: e, compressed: n };
}
function $8(t, e) {
  const [n, r] = qc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Sa(r, 1) + Dn.fromHex(n).toCompactHex();
  return Mw(i);
}
function I8(t) {
  return E8(t.data);
}
function L8(t, e, n) {
  return typeof t == "string" && (t = Nw(t)), typeof n == "string" && (n = Kp(n)), {
    type: wt.Payload,
    payloadType: Ot.TokenTransfer,
    recipient: t,
    amount: Sn(e, !1),
    memo: n ?? Kp("")
  };
}
function C8(t, e, n, r) {
  return typeof t == "string" && (t = mf(t)), typeof e == "string" && (e = vi(e)), typeof n == "string" && (n = vi(n)), {
    type: wt.Payload,
    payloadType: Ot.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function zp(t, e, n) {
  return typeof t == "string" && (t = vi(t)), typeof e == "string" && (e = O8(e)), typeof n == "number" ? {
    type: wt.Payload,
    payloadType: Ot.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: wt.Payload,
    payloadType: Ot.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function T8() {
  return { type: wt.Payload, payloadType: Ot.PoisonMicroblock };
}
function Gp(t, e) {
  if (t.byteLength != ci)
    throw Error(`Coinbase buffer size must be ${ci} bytes`);
  return e != null ? {
    type: wt.Payload,
    payloadType: Ot.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: wt.Payload,
    payloadType: Ot.Coinbase,
    coinbaseBytes: t
  };
}
function B8(t, e, n) {
  if (t.byteLength != ci)
    throw Error(`Coinbase buffer size must be ${ci} bytes`);
  if (n.byteLength != Xu)
    throw Error(`VRF proof buffer size must be ${Xu} bytes`);
  return {
    type: wt.Payload,
    payloadType: Ot.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === J.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var ed;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(ed || (ed = {}));
function M8(t, e, n, r, s, i, o) {
  return {
    type: wt.Payload,
    payloadType: Ot.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Rw(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ot.TokenTransfer:
      e.push(Oe(t.recipient)), e.push(Os(t.amount, !1, 8)), e.push(Ur(t.memo));
      break;
    case Ot.ContractCall:
      e.push(Ur(t.contractAddress)), e.push(Ur(t.contractName)), e.push(Ur(t.functionName));
      const n = new Uint8Array(4);
      Ai(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Oe(r));
      });
      break;
    case Ot.SmartContract:
      e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case Ot.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case Ot.PoisonMicroblock:
      break;
    case Ot.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ot.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Oe(t.recipient));
      break;
    case Ot.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Oe(t.recipient ? Dw(t.recipient) : Ow())), e.push(t.vrfProof);
      break;
    case Ot.TenureChange:
      e.push(Ee(t.tenureHash)), e.push(Ee(t.previousTenureHash)), e.push(Ee(t.burnViewHash)), e.push(Ee(t.previousTenureEnd)), e.push(Ai(new Uint8Array(4), t.previousTenureBlocks)), e.push(lk(new Uint8Array(1), t.cause)), e.push(Ee(t.publicKeyHash));
      break;
  }
  return je(e);
}
function N8(t) {
  switch (t.readUInt8Enum(Ot, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ot.TokenTransfer:
      const n = Xn(t), r = Sn(t.readBytes(8), !1), s = Gw(t);
      return L8(n, r, s);
    case Ot.ContractCall:
      const i = ko(t), o = Yn(t), a = Yn(t), c = [], l = t.readUInt32BE();
      for (let k = 0; k < l; k++) {
        const B = Xn(t);
        c.push(B);
      }
      return C8(i, o, a, c);
    case Ot.SmartContract:
      const h = Yn(t), d = Yn(t, 4, 1e5);
      return zp(h, d);
    case Ot.VersionedSmartContract: {
      const k = t.readUInt8Enum(Wu, (Y) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Y}`);
      }), B = Yn(t), P = Yn(t, 4, 1e5);
      return zp(B, P, k);
    }
    case Ot.PoisonMicroblock:
      return T8();
    case Ot.Coinbase: {
      const k = t.readBytes(ci);
      return Gp(k);
    }
    case Ot.CoinbaseToAltRecipient: {
      const k = t.readBytes(ci), B = Xn(t);
      return Gp(k, B);
    }
    case Ot.NakamotoCoinbase: {
      const k = t.readBytes(ci), B = Xn(t), P = t.readBytes(Xu);
      return B8(k, B, P);
    }
    case Ot.TenureChange:
      const w = Rt(t.readBytes(20)), g = Rt(t.readBytes(20)), A = Rt(t.readBytes(20)), v = Rt(t.readBytes(32)), C = t.readUInt32BE(), U = t.readUInt8Enum(ed, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), j = Rt(t.readBytes(20));
      return M8(w, g, A, v, C, U, j);
  }
}
class yl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ti extends yl {
  constructor(e) {
    super(e);
  }
}
class On extends yl {
  constructor(e) {
    super(e);
  }
}
class Pc extends yl {
  constructor(e) {
    super(e);
  }
}
class oi extends yl {
  constructor(e) {
    super(e);
  }
}
var ir;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ir || (ir = {}));
function nd(t) {
  return Mw(Rt(t.readBytes(pl)));
}
function oo(t, e) {
  return {
    pubKeyEncoding: t,
    type: wt.TransactionAuthField,
    contents: e
  };
}
function _8(t) {
  const e = t.readUInt8Enum(ir, (n) => {
    throw new On(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case ir.PublicKeyCompressed:
      return oo(Ie.Compressed, td(t));
    case ir.PublicKeyUncompressed:
      return oo(Ie.Uncompressed, v8(td(t).data));
    case ir.SignatureCompressed:
      return oo(Ie.Compressed, nd(t));
    case ir.SignatureUncompressed:
      return oo(Ie.Uncompressed, nd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function xf(t) {
  return Ee(t.data);
}
function P8(t) {
  const e = [];
  switch (t.contents.type) {
    case wt.PublicKey:
      e.push(t.pubKeyEncoding === Ie.Compressed ? ir.PublicKeyCompressed : ir.PublicKeyUncompressed), e.push(_c(A8(t.contents.data)));
      break;
    case wt.MessageSignature:
      e.push(t.pubKeyEncoding === Ie.Compressed ? ir.SignatureCompressed : ir.SignatureUncompressed), e.push(xf(t.contents));
      break;
  }
  return je(e);
}
function Ur(t) {
  switch (t.type) {
    case wt.Address:
      return Ea(t);
    case wt.Principal:
      return zw(t);
    case wt.LengthPrefixedString:
      return $o(t);
    case wt.MemoString:
      return D8(t);
    case wt.AssetInfo:
      return Kw(t);
    case wt.PostCondition:
      return F8(t);
    case wt.PublicKey:
      return _c(t);
    case wt.LengthPrefixedList:
      return Af(t);
    case wt.Payload:
      return Rw(t);
    case wt.TransactionAuthField:
      return P8(t);
    case wt.MessageSignature:
      return xf(t);
  }
}
function U8() {
  return {
    type: wt.Address,
    version: Nc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Sf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === fe.SerializeP2PKH || e === fe.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === fe.SerializeP2WPKH || e === fe.SerializeP2WSH || e === fe.SerializeP2WSHNonSequential) && !r.every(_o))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case fe.SerializeP2PKH:
      return qo(t, r6(r[0].data));
    case fe.SerializeP2WPKH:
      return qo(t, s6(r[0].data));
    case fe.SerializeP2SH:
    case fe.SerializeP2SHNonSequential:
      return qo(t, i6(n, r.map(_c)));
    case fe.SerializeP2WSH:
    case fe.SerializeP2WSHNonSequential:
      return qo(t, o6(n, r.map(_c)));
  }
}
function Ea(t) {
  const e = [];
  return e.push(Ee(Sa(t.version, 1))), e.push(Ee(t.hash160)), je(e);
}
function ko(t) {
  const e = fl(Rt(t.readBytes(1))), n = Rt(t.readBytes(20));
  return { type: wt.Address, version: e, hash160: n };
}
function zw(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ea(t.address)), t.prefix === ua.Contract && e.push($o(t.contractName)), je(e);
}
function H8(t) {
  const e = t.readUInt8Enum(ua, (s) => {
    throw new On(`Unexpected Principal payload type: ${s}`);
  }), n = ko(t);
  if (e === ua.Standard)
    return { type: wt.Principal, prefix: e, address: n };
  const r = Yn(t);
  return {
    type: wt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function $o(t) {
  const e = [], n = No(t.content), r = n.byteLength;
  return e.push(Ee(Sa(r, t.lengthPrefixBytes))), e.push(n), je(e);
}
function Yn(t, e, n) {
  e = e || 1;
  const r = fl(Rt(t.readBytes(e))), s = hf(t.readBytes(r));
  return vi(s, e, n ?? 128);
}
function O8(t) {
  return vi(t, 4, 1e5);
}
function Kp(t) {
  if (t && Xw(t, Bc))
    throw new Error(`Memo exceeds maximum length of ${Bc} bytes`);
  return { type: wt.MemoString, content: t };
}
function D8(t) {
  const e = [], n = No(t.content), r = n6(Rt(n), Bc * 2);
  return e.push(Ee(r)), je(e);
}
function Gw(t) {
  let e = hf(t.readBytes(Bc));
  return e = e.replace(/\u0000*$/, ""), { type: wt.MemoString, content: e };
}
function Kw(t) {
  const e = [];
  return e.push(Ea(t.address)), e.push($o(t.contractName)), e.push($o(t.assetName)), je(e);
}
function rd(t) {
  return {
    type: wt.AssetInfo,
    address: ko(t),
    contractName: Yn(t),
    assetName: Yn(t)
  };
}
function Ef(t, e) {
  return {
    type: wt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Af(t) {
  const e = t.values, n = [];
  n.push(Ee(Sa(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ur(r));
  return je(n);
}
function Vw(t, e, n) {
  const r = fl(Rt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case wt.Address:
        s.push(ko(t));
        break;
      case wt.LengthPrefixedString:
        s.push(Yn(t));
        break;
      case wt.MemoString:
        s.push(Gw(t));
        break;
      case wt.AssetInfo:
        s.push(rd(t));
        break;
      case wt.PostCondition:
        s.push(j8(t));
        break;
      case wt.PublicKey:
        s.push(td(t));
        break;
      case wt.TransactionAuthField:
        s.push(_8(t));
        break;
    }
  return Ef(s, n);
}
function F8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(zw(t.principal)), (t.conditionType === $n.Fungible || t.conditionType === $n.NonFungible) && e.push(Kw(t.assetInfo)), t.conditionType === $n.NonFungible && e.push(Oe(t.assetName)), e.push(t.conditionCode), t.conditionType === $n.STX || t.conditionType === $n.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ti("The post-condition amount may not be larger than 8 bytes");
    e.push(Os(t.amount, !1, 8));
  }
  return je(e);
}
function j8(t) {
  const e = t.readUInt8Enum($n, (o) => {
    throw new On(`Could not read ${o} as PostConditionType`);
  }), n = H8(t);
  let r, s, i;
  switch (e) {
    case $n.STX:
      return r = t.readUInt8Enum(la, (a) => {
        throw new On(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Rt(t.readBytes(8))}`), {
        type: wt.PostCondition,
        conditionType: $n.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case $n.Fungible:
      return s = rd(t), r = t.readUInt8Enum(la, (a) => {
        throw new On(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Rt(t.readBytes(8))}`), {
        type: wt.PostCondition,
        conditionType: $n.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case $n.NonFungible:
      s = rd(t);
      const o = Xn(t);
      return r = t.readUInt8Enum(Zu, (a) => {
        throw new On(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: wt.PostCondition,
        conditionType: $n.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Lr(t, e) {
  return je([t, e]);
}
function R8(t) {
  return new Uint8Array([t.type]);
}
function z8(t) {
  return t.type === J.OptionalNone ? new Uint8Array([t.type]) : Lr(t.type, Oe(t.value));
}
function G8(t) {
  const e = new Uint8Array(4);
  return Ai(e, t.buffer.length, 0), Lr(t.type, hl(e, t.buffer));
}
function K8(t) {
  const e = ff(Qv(t.value, BigInt(hk)), kw);
  return Lr(t.type, e);
}
function V8(t) {
  const e = ff(t.value, kw);
  return Lr(t.type, e);
}
function q8(t) {
  return Lr(t.type, Ea(t.address));
}
function Y8(t) {
  return Lr(t.type, hl(Ea(t.address), $o(t.contractName)));
}
function X8(t) {
  return Lr(t.type, Oe(t.value));
}
function W8(t) {
  const e = [], n = new Uint8Array(4);
  Ai(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Oe(r);
    e.push(s);
  }
  return Lr(t.type, je(e));
}
function Z8(t) {
  const e = [], n = new Uint8Array(4);
  Ai(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = vi(s);
    e.push($o(i));
    const o = Oe(t.data[s]);
    e.push(o);
  }
  return Lr(t.type, je(e));
}
function qw(t, e) {
  const n = [], r = e == "ascii" ? Aw(t.data) : No(t.data), s = new Uint8Array(4);
  return Ai(s, r.length, 0), n.push(s), n.push(r), Lr(t.type, je(n));
}
function Q8(t) {
  return qw(t, "ascii");
}
function J8(t) {
  return qw(t, "utf8");
}
function Oe(t) {
  switch (t.type) {
    case J.BoolTrue:
    case J.BoolFalse:
      return R8(t);
    case J.OptionalNone:
    case J.OptionalSome:
      return z8(t);
    case J.Buffer:
      return G8(t);
    case J.UInt:
      return V8(t);
    case J.Int:
      return K8(t);
    case J.PrincipalStandard:
      return q8(t);
    case J.PrincipalContract:
      return Y8(t);
    case J.ResponseOk:
    case J.ResponseErr:
      return X8(t);
    case J.List:
      return W8(t);
    case J.Tuple:
      return Z8(t);
    case J.StringASCII:
      return Q8(t);
    case J.StringUTF8:
      return J8(t);
    default:
      throw new ti("Unable to serialize. Invalid Clarity Value.");
  }
}
function t6(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Vp = /* @__PURE__ */ new Map();
function Yw(t, e) {
  const n = Vp.get(t);
  if (n !== void 0)
    return n(e);
  const r = t6(t);
  return Vp.set(t, r), Yw(t, e);
}
class Qo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return uk(this.readBytes(4), 0);
  }
  readUInt8() {
    return ck(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return ok(this.readBytes(2), 0);
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
    if (Yw(e, r))
      return r;
    throw n(r);
  }
}
function Xn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Qo(Ee(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Qo(t) : e = t;
  switch (e.readUInt8Enum(J, (r) => {
    throw new On(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case J.Int:
      return g8(e.readBytes(16));
    case J.UInt:
      return Ar(e.readBytes(16));
    case J.Buffer:
      const r = e.readUInt32BE();
      return Hw(e.readBytes(r));
    case J.BoolTrue:
      return Pw();
    case J.BoolFalse:
      return Uw();
    case J.PrincipalStandard:
      const s = ko(e);
      return d8(s);
    case J.PrincipalContract:
      const i = ko(e), o = Yn(e);
      return _w(i, o);
    case J.ResponseOk:
      return w8(Xn(e));
    case J.ResponseErr:
      return y8(Xn(e));
    case J.OptionalNone:
      return Ow();
    case J.OptionalSome:
      return Dw(Xn(e));
    case J.List:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(Xn(e));
      return b8(c);
    case J.Tuple:
      const l = e.readUInt32BE(), h = {};
      for (let v = 0; v < l; v++) {
        const C = Yn(e).content;
        if (C === void 0)
          throw new On('"content" is undefined');
        h[C] = Xn(e);
      }
      return ki(h);
    case J.StringASCII:
      const d = e.readUInt32BE(), w = nk(e.readBytes(d));
      return tn(w);
    case J.StringUTF8:
      const g = e.readUInt32BE(), A = hf(e.readBytes(g));
      return m8(A);
    default:
      throw new On("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const e6 = (t) => t.length % 2 == 0 ? t : `0${t}`, n6 = (t, e) => t.padEnd(e, "0"), Xw = (t, e) => t ? No(t).length > e : !1;
function sd(t) {
  return py(t);
}
const da = (t) => Bk(bf(t)), vf = (t) => Rt(c8(t)), r6 = (t) => Rt(da(t)), s6 = (t) => {
  const e = da(t), n = hl(new Uint8Array([0]), new Uint8Array([e.length]), e), r = da(n);
  return Rt(r);
}, i6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = je(n), s = da(r);
  return Rt(s);
}, o6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = je(n), s = bf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = je(i), a = da(o);
  return Rt(a);
};
function a6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Ww(t) {
  const e = Oe(t);
  return `0x${Rt(e)}`;
}
function c6(t) {
  return Xn(t);
}
const co = (t) => {
  try {
    return Mi.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function kf() {
  return {
    type: wt.MessageSignature,
    data: Rt(new Uint8Array(pl))
  };
}
function Zw(t, e, n, r) {
  const s = Sf(0, t, 1, [vo(e)]).hash160, i = _o(vo(e)) ? Ie.Compressed : Ie.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Sn(n, !1),
    fee: Sn(r, !1),
    keyEncoding: i,
    signature: kf()
  };
}
function fa(t) {
  return "signature" in t;
}
function qp(t) {
  return t === fe.SerializeP2SH || t === fe.SerializeP2WSH;
}
function l6(t) {
  return t === fe.SerializeP2SHNonSequential || t === fe.SerializeP2WSHNonSequential;
}
function Yp(t) {
  const e = sd(t);
  return e.nonce = 0, e.fee = 0, fa(e) ? e.signature = kf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function u6(t) {
  const e = [
    t.hashMode,
    Ee(t.signer),
    Os(t.nonce, !1, 8),
    Os(t.fee, !1, 8),
    t.keyEncoding,
    xf(t.signature)
  ];
  return je(e);
}
function d6(t) {
  const e = [
    t.hashMode,
    Ee(t.signer),
    Os(t.nonce, !1, 8),
    Os(t.fee, !1, 8)
  ], n = Ef(t.fields);
  e.push(Af(n));
  const r = new Uint8Array(2);
  return ak(r, t.signaturesRequired, 0), e.push(r), je(e);
}
function f6(t, e) {
  const n = Rt(e.readBytes(20)), r = BigInt(`0x${Rt(e.readBytes(8))}`), s = BigInt(`0x${Rt(e.readBytes(8))}`), i = e.readUInt8Enum(Ie, (a) => {
    throw new On(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === fe.SerializeP2WPKH && i != Ie.Compressed)
    throw new On("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = nd(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function h6(t, e) {
  const n = Rt(e.readBytes(20)), r = BigInt("0x" + Rt(e.readBytes(8))), s = BigInt("0x" + Rt(e.readBytes(8))), i = Vw(e, wt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case wt.PublicKey:
        _o(l.contents) || (o = !0);
        break;
      case wt.MessageSignature:
        if (l.pubKeyEncoding === Ie.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new oi("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === fe.SerializeP2WSH || t === fe.SerializeP2WSHNonSequential))
    throw new oi("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function zl(t) {
  return fa(t) ? u6(t) : d6(t);
}
function Gl(t) {
  const e = t.readUInt8Enum(fe, (n) => {
    throw new On(`Could not parse ${n} as AddressHashMode`);
  });
  return e === fe.SerializeP2PKH || e === fe.SerializeP2WPKH ? f6(e, t) : h6(e, t);
}
function Qw(t, e, n, r) {
  const i = t + Rt(new Uint8Array([e])) + Rt(Os(n, !1, 8)) + Rt(Os(r, !1, 8));
  if (Ee(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return vf(Ee(i));
}
function Jw(t, e, n) {
  const r = 33 + pl, s = _o(e) ? Ie.Compressed : Ie.Uncompressed, i = t + e6(s.toString(16)) + n.data, o = Ee(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return vf(o);
}
function p6(t, e, n, r, s) {
  const i = Qw(t, e, n, r), o = $8(s, i), a = I8(s), c = Jw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function tb(t, e, n, r, s, i) {
  const o = Qw(t, e, n, r), a = vo(x8(o, i, s)), c = Jw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function g6() {
  const t = Zw(fe.SerializeP2PKH, "", 0, 0);
  return t.signer = U8().hash160, t.keyEncoding = Ie.Compressed, t.signature = kf(), t;
}
function Xp(t, e, n) {
  return fa(t) ? y6(t, e, n) : w6(t, e, n);
}
function y6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = tb(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Sf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new oi(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function w6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case wt.PublicKey:
        _o(c.contents) || (i = !0), r.push(c.contents);
        break;
      case wt.MessageSignature:
        c.pubKeyEncoding === Ie.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: h } = tb(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (qp(t.hashMode) && (s = h), r.push(l), o += 1, o === 65536)
          throw new oi("Too many signatures");
        break;
    }
  if (qp(t.hashMode) && o !== t.signaturesRequired || l6(t.hashMode) && o < t.signaturesRequired)
    throw new oi("Incorrect number of signatures");
  if (i && (t.hashMode === fe.SerializeP2WSH || t.hashMode === fe.SerializeP2WSHNonSequential))
    throw new oi("Uncompressed keys are not allowed in this hash mode");
  const a = Sf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new oi(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function eb(t) {
  return {
    authType: Ne.Standard,
    spendingCondition: t
  };
}
function nb(t, e) {
  return {
    authType: Ne.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Zw(fe.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Wp(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ne.Standard:
        return eb(Yp(t.spendingCondition));
      case Ne.Sponsored:
        return nb(Yp(t.spendingCondition), g6());
      default:
        throw new Pc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function b6(t, e) {
  switch (t.authType) {
    case Ne.Standard:
      return Xp(t.spendingCondition, e, Ne.Standard);
    case Ne.Sponsored:
      return Xp(t.spendingCondition, e, Ne.Standard);
    default:
      throw new Pc("Invalid origin auth type");
  }
}
function m6(t, e) {
  switch (t.authType) {
    case Ne.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Sn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Ne.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Sn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function x6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Sn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function S6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Sn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function E6(t, e) {
  const n = {
    ...e,
    nonce: Sn(e.nonce, !1),
    fee: Sn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function A6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ne.Standard:
      e.push(zl(t.spendingCondition));
      break;
    case Ne.Sponsored:
      e.push(zl(t.spendingCondition)), e.push(zl(t.sponsorSpendingCondition));
      break;
  }
  return je(e);
}
function v6(t) {
  const e = t.readUInt8Enum(Ne, (r) => {
    throw new On(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ne.Standard:
      return n = Gl(t), eb(n);
    case Ne.Sponsored:
      n = Gl(t);
      const r = Gl(t);
      return nb(n, r);
  }
}
class k6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Sn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? dk, this.postConditionMode = i ?? Ao.Deny, this.postConditions = s ?? Ef([]), o)
      this.anchorMode = yk(o);
    else
      switch (r.payloadType) {
        case Ot.Coinbase:
        case Ot.CoinbaseToAltRecipient:
        case Ot.NakamotoCoinbase:
        case Ot.PoisonMicroblock:
        case Ot.TenureChange:
          this.anchorMode = kn.OnChainOnly;
          break;
        case Ot.ContractCall:
        case Ot.SmartContract:
        case Ot.VersionedSmartContract:
        case Ot.TokenTransfer:
          this.anchorMode = kn.Any;
          break;
      }
  }
  signBegin() {
    const e = sd(this);
    return e.auth = Wp(e.auth), e.txid();
  }
  verifyBegin() {
    const e = sd(this);
    return e.auth = Wp(e.auth), e.txid();
  }
  verifyOrigin() {
    return b6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ne.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ne.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ne.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !fa(n)) {
      const r = _o(e);
      n.fields.push(oo(r ? Ie.Compressed : Ie.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = p6(n, r, e.fee, e.nonce, s);
    return fa(e) ? e.signature = i : e.fields.push(oo(s.data.byteLength === vw ? Ie.Compressed : Ie.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return vf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ne.Sponsored)
      throw new Pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = E6(this.auth, e);
  }
  setFee(e) {
    this.auth = m6(this.auth, e);
  }
  setNonce(e) {
    this.auth = x6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ne.Sponsored)
      throw new Pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = S6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ti('"version" is undefined');
    if (this.chainId === void 0)
      throw new ti('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ti('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ti('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ti('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Ai(n, this.chainId, 0), e.push(n), e.push(A6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Af(this.postConditions)), e.push(Rw(this.payload)), je(e);
  }
}
function Jo(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Qo(Ee(t.slice(2))) : e = new Qo(Ee(t)) : t instanceof Uint8Array ? e = new Qo(t) : e = t;
  const n = e.readUInt8Enum(Mc, (l) => {
    throw new Error(`Could not parse ${l} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = v6(e), i = e.readUInt8Enum(kn, (l) => {
    throw new Error(`Could not parse ${l} as AnchorMode`);
  }), o = e.readUInt8Enum(Ao, (l) => {
    throw new Error(`Could not parse ${l} as PostConditionMode`);
  }), a = Vw(e, wt.PostCondition), c = N8(e);
  return new k6(n, s, c, a, o, i, r);
}
const $6 = h8, ta = Ar, I6 = Hw;
const L6 = /* @__PURE__ */ new Set([4001, -31001]), C6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], T6 = ["result", "data", "payload", "response", "params"], Zp = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], wl = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ui = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Kr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, B6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), rb = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => B6(i, r)) === s
  );
}, sb = (t) => t ? rb(Ui()).some(
  (e) => {
    var n;
    return e.id === t && (wl(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, ib = () => {
  if (typeof window > "u")
    return;
  const t = Ui(), e = rb(t).filter(
    (n) => {
      var r;
      return wl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Kr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of C6) {
    const r = Kr(t, n) ?? (t === window ? void 0 : Kr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, M6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ui(), n = Kr(e, t) ?? (e === window ? void 0 : Kr(window, t)) ?? rl(t);
  if (n)
    return n;
  if (wl(t) || sb(t))
    return ib();
}, Za = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, N6 = ["blockstack-session", "blockstack"], _6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of N6) {
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
_6();
const ob = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Hn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, P6 = (t) => {
  const e = Hn(t);
  if (!e)
    return null;
  const n = ob(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, U6 = (t) => {
  const e = Hn(t);
  if (!e)
    return null;
  const n = ob(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, id = (t, e = "mainnet") => {
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
      return id(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return id(r, e);
  }
  return e;
}, li = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, ha = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return co(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = ha(s, e + 1);
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
    const i = ha(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && co(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && co(n.testnet) ? n.testnet.trim() : null;
}, Qp = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, ab = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && L6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, $i = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Hn(n == null ? void 0 : n.message) ?? Hn(e.message) ?? Hn(e.error) ?? Hn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Io = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw $i(e);
    if (e.status === "error")
      throw $i(e.result ?? e);
  }
  return t;
}, Jp = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Io(r);
  } catch (r) {
    throw $i(r);
  }
}, cb = () => ib(), $f = () => {
  if (typeof window > "u")
    return;
  const t = Ui();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Kr(t, e) ?? (t === window ? void 0 : Kr(window, e));
    if (n)
      return n;
  }
}, t0 = () => {
  if (typeof window > "u")
    return;
  const t = $f();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Ui();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Kr(e, n) ?? (e === window ? void 0 : Kr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, uc = (t) => {
  var r, s;
  const e = yi();
  if (wl(e) || sb(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ui() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === cb();
}, Kl = (t) => {
  const e = U6(t);
  if (!e)
    return null;
  try {
    const n = Jo(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Uc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Kl(t), r = P6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Hn(t) ?? void 0 : void 0
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
  for (const a of Zp)
    if (Kl(s[a])) {
      i = Hn(s[a]);
      break;
    }
  const o = Hn(s.txId) || Hn(s.txid) || Hn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Hn(s.txRaw) ?? void 0
    };
  for (const a of Zp) {
    const c = Kl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Hn(s[a]) ?? void 0
      };
  }
  for (const a of T6) {
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
}, Vl = (t) => {
  const e = Uc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, H6 = (t) => {
  const e = Uc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, O6 = (t) => ({
  ...t,
  fee: li(t.fee),
  nonce: li(t.nonce),
  sponsored: t.sponsored === !0
}), e0 = (t) => ({
  recipient: t.recipient,
  amount: li(t.amount) ?? "0",
  memo: t.memo,
  network: id(t.network),
  address: t.stxAddress,
  fee: li(t.fee),
  nonce: li(t.nonce),
  sponsored: t.sponsored ?? !1
}), lb = "WALLET_ADDRESS_MISMATCH", D6 = 45e3;
let ea = null;
const od = (t) => {
  t && (ea = { address: t, at: Date.now() });
}, F6 = () => {
  ea = null;
}, j6 = () => ea && Date.now() - ea.at <= D6 ? ea.address : null, R6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, z6 = async (t) => {
  F6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Io(await t.request("wallet_connect")), n = ha(e);
  return od(n), n;
}, G6 = async (t, e, n, r) => {
  try {
    return Io(await t.request(e, n));
  } catch (s) {
    const i = $i(s);
    if (!R6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await z6(t);
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
        { code: o ? lb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Io(await t.request(e, n));
    } catch (a) {
      throw $i(a);
    }
  }
};
let n0 = 3e4;
const K6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${n0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, n0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, V6 = async (t, e, n) => {
  const r = (c, l) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${l}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: lb }
      );
    return c;
  }, s = j6();
  if (s)
    return Za(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Za(n, "account-read");
  try {
    const c = Io(
      await K6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = ha(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (ab(c))
      throw $i(c);
    Za(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return od(i), r(i, "wallet_getAccount");
  let o;
  Za(n, "account-reconnect");
  try {
    o = Io(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), $i(c);
  }
  const a = ha(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return od(a), r(a, "wallet_connect");
}, q6 = async (t, e) => {
  if (!uc(t)) {
    const i = await Jp(
      t,
      "stx_transferStx",
      e0(e)
    );
    return Vl(i);
  }
  const n = $f();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Jp(
      n,
      "stx_transferStx",
      e0(e)
    );
    return Vl(i);
  }
  const r = cb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await V6(r, e.stxAddress);
  const s = await G6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: li(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: li(e.fee) } : {}
    },
    e.stxAddress
  );
  return Vl(s);
}, Y6 = () => yi(), ub = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = yi(), e = t ? M6(t) : void 0;
  if (e)
    return e;
  const n = Ui() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, r0 = (t, e) => {
  const n = ub(), r = O6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, H6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return qa(r, e);
  if (uc(n) && !$f()) {
    const s = t0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: yi(),
        route: "legacy-transaction-request"
      }), qa(r, s);
  }
  return void q6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Qp(s) && uc(n)) {
      const a = t0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: yi(),
          route: "legacy-transaction-request"
        }), qa(r, a);
        return;
      }
    }
    if (Qp(s) && !uc(n)) {
      qa(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), ab(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, X6 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), s0 = (t) => Ww(t).replace(/^0x/, ""), i0 = "This wallet cannot sign messages. Try Xverse or Leather.", o0 = (t) => typeof (t == null ? void 0 : t.request) == "function", a0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", W6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, Z6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function Q6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: s0(e.message),
    domain: s0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function J6(t, e) {
  const n = await Kv({
    domain: e.domain,
    message: e.message,
    network: dl(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? X6()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function c0(t) {
  var s, i;
  const e = Y6() || "", n = /xverse/i.test(e);
  let r = ub();
  if (n && !a0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (a0(r))
    try {
      return await J6(r, t);
    } catch (o) {
      if (n || !o0(r) || !Z6(o)) throw o;
    }
  if (!n && o0(r))
    try {
      return await Q6(r, t);
    } catch (o) {
      throw W6(o) ? new Error(i0) : o;
    }
  throw new Error(i0);
}
const l0 = 1000000n, Fr = 1000000n, Hc = 50n, De = 3000n, lr = 300n, jo = 3000n, t5 = 50000n, ql = 200n, bl = 15000n, un = (t) => t + Hc;
function rr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / l0}.${(n % l0).toString().padStart(6, "0")}`;
}
function u0(t, e = lr) {
  return t <= De ? 0 : Number((t - De) / un(e));
}
function Yl(t, e = 0n) {
  const n = Fr - t - e;
  return n > 0n ? n : 0n;
}
function e5(t, e = lr) {
  return t > Fr ? "over" : t < De + un(e) ? "empty" : t < t5 ? "low" : "ok";
}
const n5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", r5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", s5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function i5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || s5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== n5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const db = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Xl = 3, o5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", a5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", c5 = 1, [ad, fb] = db.split("."), Kn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function cd(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function l5(t) {
  return Kn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Us(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function hb(t, e = []) {
  const n = await Us(`/v2/contracts/call-read/${ad}/${fb}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: ad, arguments: e.map((r) => "0x" + Kn(Oe(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return mr(Xn(n.result));
}
async function u5() {
  const t = await Us(`/v2/contracts/source/${ad}/${fb}?proof=0`);
  if (typeof t.source != "string" || await l5(t.source) !== r5) throw Error("Deployed source does not match the tested helper.");
  if (i5(await hb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function pb(t) {
  return t.startsWith("SP") && co(t) && !t.includes(".");
}
async function d5(t) {
  var r;
  if (!pb(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Us(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Us(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function f5(t) {
  const e = await Us(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function h5(t, e) {
  var s, i;
  const n = await hb("get-owner", [ta(t), ta(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !pb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function p5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: cd(t), signal: AbortSignal.timeout(15e3) });
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
async function g5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function y5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Jo(cd(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || io(qo(Nc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || io(r.contractAddress) + "." + r.contractName.content !== db || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Kn(Oe(r.functionArgs[0])) !== Kn(Oe(ta(t.core))) || Kn(Oe(r.functionArgs[1])) !== Kn(Oe(ta(t.song))) || Kn(Oe(r.functionArgs[2])) !== Kn(Oe(I6(cd(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ao.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== la.Equal || i.principal.prefix !== 2 || io(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || io(r.contractAddress) + "." + r.contractName.content !== o5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Kn(Oe(r.functionArgs[0])) !== Kn(Oe(ta(t.song))) || typeof t.liked != "boolean" || Kn(Oe(r.functionArgs[1])) !== Kn(Oe($6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ao.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || mr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const w5 = "xtrata.xyz/radio/listening-wallet", b5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Rr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && co(t), m5 = (t) => ({
  domain: ki({ name: tn(w5), version: tn("1"), "chain-id": Ar(1) }),
  message: ki({
    purpose: tn(b5),
    main: tn(t.main),
    listening: tn(t.listening),
    issued: Ar(t.issued)
  })
}), gb = 100000n, x5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function S5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Rr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= gb).sort(x5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Qa = 50;
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
async function E5(t, e, n = 4) {
  if (!Rr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Qa}&offset=${o}`, s = Oc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Qa);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Qa ? s : Oc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = S5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Qa);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const _r = 50, A5 = 6, v5 = 20, d0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function f0(t, e) {
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
async function k5(t, e, n) {
  if (!Rr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Oc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${_r}&offset=0`));
    if (!s || s.total > A5 * _r) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = _r; o < s.total; o += _r) {
      const a = Oc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${_r}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (l) => `/extended/v1/address/${t}/transactions?limit=${_r}&offset=${l}`, a = f0(await e(o(0)), t);
      if (!a || a.total > v5 * _r) return { ok: !1 };
      const c = new Set(a.rows);
      for (const l of a.sent) i.set(l.txId, l);
      for (let l = _r; l < a.total; l += _r) {
        const h = f0(await e(o(l)), t);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const d of h.rows) c.add(d);
        for (const d of h.sent) i.set(d.txId, d);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...i.values()] };
  } catch {
    return { ok: !1 };
  }
}
function $5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== e && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(d0).map((d, w) => {
    const g = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: g, kind: "gift", to: r.payer, at: w } : Rr(d.sender) && g >= gb ? { sender: d.sender, left: g, kind: "deposit", to: d.sender, at: w } : { sender: d.sender, left: g, kind: "dust", to: null, at: w };
  }), i = s.reduce((d, w) => d + w.left, 0n), o = [...t.outgoing].filter((d) => d && d.recipient !== e && Rr(d.recipient) && d.amount > 0n).sort(d0), a = o.reduce((d, w) => d + w.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const l = (d, w) => {
    let g = w;
    for (const A of d) {
      if (g <= 0n) break;
      const v = A.left < g ? A.left : g;
      A.left -= v, g -= v;
    }
    return g;
  };
  for (const d of o) {
    const w = l(s.filter((g) => g.to === d.recipient), d.amount);
    w > 0n && l(s, w);
  }
  if (l(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((d, w) => d + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const d of s) {
    if (d.left <= 0n) continue;
    const w = `${d.kind}:${d.to ?? ""}`, g = h.get(w);
    g ? (g.amount += d.left, g.newest = Math.max(g.newest, d.at)) : h.set(w, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((d, w) => d.newest - w.newest),
    hasTopUp: s.some((d) => d.kind === "deposit")
  };
}
function I5(t, e) {
  const n = t.filter((l) => l.kind === "deposit").sort((l, h) => l.newest - h.newest), r = t.find((l) => l.kind === "gift"), s = t.filter((l) => l.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((l, h) => l + h.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((l, h) => {
    if (l.amount <= e) {
      a.push(l);
      return;
    }
    const d = h === n.length - 1 && !c;
    o.push({ to: l.to, kind: "deposit", mode: d ? "all" : "amount", send: l.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function h0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const p0 = 1500n, dc = [100, 250, 500], L5 = (t, e) => BigInt(t) * un(e), Ro = ["prepared", "signed", "unknown", "pending"], C5 = 30 * 6e4, Dc = 6e4, Zi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, T5 = 3e3, Fc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Wl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function B5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, l = null, h = !1, d = !1, w = !1, g = null, A = !1, v = "", C = "", U = 0, j, k = null, B, P = [], Y, st = -1 / 0;
  const Z = /* @__PURE__ */ new Set();
  let q = null, y = !1, $ = 0, M = null, T = null, K = !1, z = null, bt = !1, at = null, Gt = !1, L = !1, H = !1, ot = !1, vt = !1, kt = 0, xt = null, Pe = Promise.resolve();
  const Lt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? lr.toString()), It = (p) => !!i && !(i.features ?? []).includes(p), St = (p, E) => `xtrata.ppp.v1.${p}:${E}`, Ln = "xtrata.ppp.v1.as-main", Ze = () => {
    if (t.main()) return;
    const p = t.store.get(Ln);
    return p && Rr(p) ? p : void 0;
  }, Pt = () => t.main() ?? Ze(), fn = (p = i == null ? void 0 : i.address) => {
    if (!p) return [];
    try {
      const E = JSON.parse(t.store.get(St("entries", p)) || "[]");
      return Array.isArray(E) ? E : [];
    } catch {
      return [];
    }
  }, he = (p) => {
    const E = [p, ...fn(p.address).filter((N) => !(N.txid === p.txid && N.kind === p.kind))].slice(0, 200);
    t.store.set(St("entries", p.address), JSON.stringify(E));
  }, Xt = (p = i == null ? void 0 : i.address) => !!p && t.store.get(St("on", p)) !== "0", Cn = (p) => {
    i != null && i.address && t.store.set(St("on", i.address), p ? "1" : "0");
  }, Re = () => fn().filter((p) => Ro.includes(p.status)), Qe = () => me() ? [...Re(), ...fn(Ae()).filter((p) => Ro.includes(p.status))] : Re(), Ve = () => qe(i == null ? void 0 : i.address), qe = (p) => {
    if (!p) return null;
    try {
      return JSON.parse(t.store.get(St("deposit", p)) || "null");
    } catch {
      return null;
    }
  }, ze = (p, E = i == null ? void 0 : i.address) => {
    E && t.store.set(St("deposit", E), JSON.stringify(p));
  };
  let ie = null;
  const nn = (p = Dc) => {
    const E = t.now();
    ie = { since: ie && E < ie.until ? ie.since : E, until: Math.max((ie == null ? void 0 : ie.until) ?? 0, E + p) };
  }, Ge = () => !!ie && t.now() < ie.until && (o === void 0 || o < De + un(Lt())), Le = () => !!Ve() || Ge(), Ae = () => It("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), me = () => !!(i != null && i.address) && Ae() !== i.address, En = () => me() ? c && c.for === Ae() ? c.value : void 0 : o, Wn = (p) => p !== void 0 && p < De + ql, I = () => Re().filter((p) => t.now() - p.created > C5 && Z.has(p.txid)), G = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Pt() || r === Pt() && !e.allowed), F = () => G() && !(i != null && i.linked), S = () => {
    const p = Pt();
    return !F() && !!p && !!(i != null && i.linked) && i.linked !== p;
  }, W = (p) => St("return-to", p), ht = (p = i == null ? void 0 : i.address) => {
    if (!p) return;
    const E = t.store.get(W(p));
    return E && Rr(E) && E !== p ? E : void 0;
  }, oe = (p = i == null ? void 0 : i.address) => q && q.for === p ? q.res : null;
  function pe() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const p = ht();
    if (p) return { to: p, kind: "chosen" };
    const E = oe();
    if (E != null && E.ok && E.funder) return { to: E.funder, kind: "funder" };
  }
  const Kt = (p) => St("gift", p);
  function ne() {
    const p = i == null ? void 0 : i.address;
    if (!p) return null;
    if ((z == null ? void 0 : z.for) === p) return z.info;
    try {
      const E = JSON.parse(t.store.get(Kt(p)) || "null");
      return E && typeof E.returnTo == "string" && typeof E.treasury == "string" ? E : null;
    } catch {
      return null;
    }
  }
  const Zt = () => (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : ((i == null ? void 0 : i.slot) ?? 0) === 0 ? i == null ? void 0 : i.address : void 0;
  let Vt = null, Ut = null, tt = !1;
  const Qt = (p) => St("award-claim", p), ae = (p) => {
    try {
      const E = JSON.parse(t.store.get(Qt(p)) || "null");
      return E && typeof E.txid == "string" && t.now() - E.at < 2 * 36e5 ? E : null;
    } catch {
      return null;
    }
  };
  async function Ue(p = !1) {
    const E = Zt();
    if (!E || !t.awardStatus || tt) return;
    const N = (Vt == null ? void 0 : Vt.for) === E ? Vt : null, V = N == null ? void 0 : N.view.state, ut = N ? V === "off" || V === "not-a-player" ? 30 * 6e4 : ae(E) ? 2e4 : V === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(N && !p && t.now() - N.at < ut)) {
      tt = !0;
      try {
        const D = await t.awardStatus(E);
        if (Vt = { for: E, view: D, at: t.now() }, D.state === "claimed" && t.store.set(Qt(E), ""), D.state === "ready" && t.awardName && (Ut == null ? void 0 : Ut.for) !== E)
          try {
            Ut = { for: E, name: await t.awardName(E), at: t.now() };
          } catch {
            Ut = { for: E, name: void 0, at: t.now() };
          }
      } catch {
        Vt = { for: E, view: N && N.view.state !== "off" && N.view.state !== "not-a-player" ? { ...N.view, state: "unavailable" } : { state: "unavailable" }, at: t.now() };
      } finally {
        tt = !1;
      }
    }
  }
  function be() {
    const p = Zt();
    if (!p || (Vt == null ? void 0 : Vt.for) !== p) return null;
    const E = Vt.view;
    if (E.state === "off" || E.state === "not-a-player") return null;
    const N = E.state === "claimed" ? null : ae(p);
    return { ...E, ...(Ut == null ? void 0 : Ut.for) === p ? { name: Ut.name } : {}, ...N ? { claimTx: N.txid } : {} };
  }
  async function hn() {
    var ut;
    const p = i == null ? void 0 : i.address;
    if (!p || !t.giftInfo || !((ut = e == null ? void 0 : e.gifts) != null && ut.enabled) || bt) return;
    const E = (z == null ? void 0 : z.for) === p ? z : null, N = E ? E.ok ? E.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (E && t.now() - E.at < N) return;
    bt = !0;
    const V = ne();
    try {
      const D = await t.giftInfo(p);
      z = { for: p, info: D, ok: !0, at: t.now() }, t.store.set(Kt(p), JSON.stringify(D));
    } catch {
      z = { for: p, info: V, ok: !1, at: t.now() };
    } finally {
      bt = !1;
    }
  }
  const pn = () => fn().reduce((p, E) => Ro.includes(E.status) ? p + BigInt(E.amount || "0") + BigInt(E.fee || "0") : p, 0n);
  function Rn() {
    if (o === void 0) return 0;
    const p = o - pn() - BigInt(Ce.length) * un(Lt());
    return p > 0n ? u0(p, Lt()) : 0;
  }
  const Tn = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Hi = "EMPTY — ADD STX TO PLAY";
  function Po() {
    if (!(e != null && e.here)) return null;
    const p = (E, N) => ({ reason: E, text: N });
    switch (An()) {
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
        return Le() ? p("arriving", "YOUR PLAYS ARE ARRIVING") : p("out", me() ? Tn : Hi);
      case "ready":
        return !Xt() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? p("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : H ? Rn() < 1 ? p("out", me() ? Tn : Hi) : null : p("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Bn = () => {
    var p;
    return !!(i != null && i.address) && me() && !!((p = ne()) != null && p.player);
  };
  function Mn() {
    return Bn() ? { locked: !0, known: !0 } : null;
  }
  const Xr = 3 * 6e4, Ye = () => !!ne() && !!t.history && !(i != null && i.linked);
  async function Oi() {
    const p = i.address, E = ne(), { balance: N, nonce: V } = await t.chain.account(p), ut = await t.history(p, !0);
    if (!ut.ok) return null;
    const D = $5({ self: p, balance: N, inbound: ut.inbound, outgoing: ut.outgoing, gift: { sender: E.treasury, payer: E.returnTo } });
    if (!D.ok) return null;
    const dt = I5(D.parts, jo);
    return { balance: N, nonce: V, parts: D.parts, steps: dt.steps, tooSmall: dt.tooSmall.length };
  }
  const Fs = () => Gt ? { state: "unavailable" } : !at || t.now() - at.at > Xr || o !== void 0 && o !== at.balance ? { state: "none" } : at.plan;
  function An() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const p = Pt();
    if (!F()) {
      if (!p) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : S() ? "wrong-wallet" : i.state === "known" ? "locked" : !F() && i.linked !== p ? "link" : o === void 0 ? "loading" : o > Fr && !i.backedUp ? "over" : o < De + un(Lt()) ? "fund" : "ready" : "loading";
  }
  const Cr = () => {
    var p, E, N, V, ut;
    return {
      step: An(),
      busy: l,
      message: v,
      error: C,
      notice: Di(),
      gate: e,
      main: Pt(),
      mainConnected: !!t.main(),
      standIn: Ze(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      award: be(),
      unproven: !!(i != null && i.unproven),
      phrase: !!(i != null && i.phrase),
      backedUp: !!(i != null && i.backedUp),
      balance: o,
      balanceState: o === void 0 ? void 0 : ((D) => D === "over" && (i != null && i.backedUp) ? "ok" : D)(e5(o, Lt())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: o !== void 0 && o > Fr && !!(i != null && i.backedUp),
      playsLeft: o === void 0 ? 0 : u0(o, Lt()),
      allowance: o === void 0 ? Fr : Yl(o, BigInt(((p = Ve()) == null ? void 0 : p.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: Xt(),
      entries: fn(),
      depositTxid: ((E = Ve()) == null ? void 0 : E.txid) ?? j,
      depositPending: Le(),
      arrival: Le() ? { since: ((N = Ve()) == null ? void 0 : N.at) ?? (ie == null ? void 0 : ie.since) ?? t.now(), graceMs: Dc } : null,
      walletOutdated: It("like"),
      linkedListening: Y && Y === Pt() ? P.map((D) => D.listening) : [],
      serverLinked: !!k && B === `${Pt()}:${i == null ? void 0 : i.address}`,
      stuck: I().length,
      armed: ot,
      queued: Ce.length,
      solo: F(),
      returnTo: (V = pe()) == null ? void 0 : V.to,
      returnToKind: (ut = pe()) == null ? void 0 : ut.kind,
      funderState: (() => {
        const D = oe();
        return D ? D.ok ? D.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const D = oe();
        return !!D && D.ok && D.distinct > 1;
      })(),
      walletCannotSolo: F() && It("standalone"),
      walletCannotMulti: It("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((D) => D !== Pt() && D !== (i == null ? void 0 : i.linked)),
      creditedTo: F() && (i != null && i.address) && (M == null ? void 0 : M.for) === i.address && M.main ? M.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(St("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (T == null ? void 0 : T.for) === i.address && T.unused,
      gift: (() => {
        const D = ne();
        return D ? { player: D.player, from: D.from, source: D.source, amount: D.amount, ...D.drop !== void 0 ? { drop: D.drop } : {} } : null;
      })(),
      giftPlays: ne() ? Rn() : 0,
      playCost: un(Lt()),
      giftStop: Po(),
      albumLock: Mn(),
      returnPlan: Fs(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: It("slots"),
      likeFunds: (() => {
        var gt;
        const D = Ae();
        if (!D || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const dt = En();
        return { address: D, balance: dt, low: Wn(dt), album: me(), pending: !!qe(D), txid: (gt = qe(D)) == null ? void 0 : gt.txid, main: Pt() };
      })()
    };
  }, Di = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Ft = (p, E = "") => {
    v = p, C = E, t.changed();
  };
  async function re(p, E) {
    if (!l) {
      l = p, C = "", t.changed();
      try {
        await E();
      } catch (N) {
        const V = N instanceof Error ? N.message : String(N);
        C = /Cancelled in the listening wallet/.test(V) ? "" : V, C || (v = "Not now. Nothing was signed.", vt = !0);
      } finally {
        l = null, await gn(!0);
      }
    }
  }
  const Wr = () => !!(e != null && e.enabled) && e.here && (F() || !!Pt() && e.allowed), Fi = () => Wr() && !S(), ji = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Zn = () => {
    if (S()) throw new Error(ji());
  };
  async function Xe() {
    if (!Wr()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const rn = (p) => {
    const E = Pt();
    return p.request("listening.status", E ? { main: E } : void 0);
  };
  async function js(p = !1) {
    i != null && i.address && (!p && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Rs(p)));
  }
  async function Rs(p = !1) {
    const E = Ae();
    if (!(!me() || !E || (i == null ? void 0 : i.state) !== "unlocked") && !(!p && (c == null ? void 0 : c.for) === E && t.now() - c.at < 3e4))
      try {
        c = { for: E, value: await t.chain.balance(E), at: t.now() };
      } catch {
      }
  }
  async function Ri(p) {
    if ((Y !== p || t.now() - st >= 6e4) && (P = await t.links(p), Y = p, st = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === p) return;
    const E = `${p}:${i.address}`;
    B === E && k || (k = P.find((N) => N.listening === i.address) ?? null, B = E);
  }
  async function Uo() {
    const p = i == null ? void 0 : i.address;
    if (!F() || !p || i != null && i.linked || !t.funder || y || !o || o <= 0n) return;
    const E = oe(p);
    if (E != null && E.ok && E.funder) return;
    const N = E != null && E.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, $ - 1), 30 * 6e4);
    if (!(q && q.for === p && t.now() - q.at < N)) {
      y = !0;
      try {
        q = { for: p, res: await t.funder(p), at: t.now() };
      } catch {
        q = { for: p, res: { ok: !1 }, at: t.now() };
      } finally {
        y = !1;
      }
      $ = q.res.ok ? 0 : $ + 1;
    }
  }
  async function zi() {
    const p = i == null ? void 0 : i.address;
    if (!(!F() || !p || i != null && i.linked || !t.mainOf || K) && !(M && M.for === p && (M.ok || t.now() - M.at < 6e4))) {
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
  async function zs() {
    const p = i == null ? void 0 : i.address;
    if (!(!p || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (T == null ? void 0 : T.for) === p) && t.store.get(St("created", p)) !== "1")
      try {
        T = { for: p, unused: await t.chain.confirmedNonce(p) === 0n };
      } catch {
      }
  }
  async function Zr() {
    var ut;
    const p = i == null ? void 0 : i.address;
    if (!p) return !1;
    let E, N = !1;
    const V = /* @__PURE__ */ new Map();
    for (const D of Qe())
      try {
        const dt = await t.chain.transaction(D.txid);
        if (!dt) {
          if (Z.add(D.txid), t.now() - D.created > 15 * 6e4 && !V.has(D.address) && V.set(D.address, await t.chain.confirmedNonce(D.address)), E = V.get(D.address), E !== void 0 && E > BigInt(D.nonce)) {
            he({ ...D, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((D.status === "unknown" || D.status === "signed") && D.raw)
            try {
              await t.chain.broadcast(D.raw, D.txid), he({ ...D, status: "pending" });
            } catch (yt) {
              Zi(yt) && he({ ...D, status: "failed", note: yt.message, raw: void 0 });
            }
          continue;
        }
        Z.delete(D.txid);
        const gt = String(dt.tx_status);
        if (gt === "success" && dt.canonical !== !1 && dt.is_unanchored === !1) {
          if (he({ ...D, status: "confirmed", confirmedAt: t.now(), actualFee: String(dt.fee_rate ?? D.fee), raw: void 0 }), N = !0, D.kind === "like" && (A = !0, D.status !== "confirmed" && typeof D.liked == "boolean"))
            try {
              (ut = t.likeConfirmed) == null || ut.call(t, D.song, D.liked);
            } catch {
            }
        } else gt.startsWith("abort_") || gt.startsWith("dropped_") ? he({ ...D, status: "failed", note: gt, raw: void 0 }) : D.status !== "pending" && he({ ...D, status: "pending" });
      } catch {
      }
    for (const D of me() ? [p, Ae()] : [p]) {
      const dt = qe(D);
      if (dt)
        try {
          const gt = await t.chain.transaction(dt.txid), yt = String((gt == null ? void 0 : gt.tx_status) ?? "");
          (yt === "success" && gt.is_unanchored === !1 || yt.startsWith("abort_") || yt.startsWith("dropped_") || !gt && t.now() - dt.at > 2 * 36e5) && (ze(null, D), yt === "success" && nn(2e4), a = -1 / 0, c = null, /on its way/i.test(v) && (v = ""));
        } catch {
        }
    }
    return N;
  }
  async function gn(p = !1) {
    var E;
    try {
      const N = Pt();
      if ((p || !e || r !== N || t.now() - n > 3e5) && (e = await t.config(N), n = t.now(), r = N), !e.enabled || !e.here || !F() && (!N || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), ot && Vs(), t.changed();
        return;
      }
      await Xe(), i = await rn(s), S() && i.state === "unlocked" && (O(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await rn(s)), N && e.allowed && await Ri(N), await js(p), await Uo(), await zi(), await zs(), await hn(), await Ue(), await Zr() && await js(!0), await Rs(), await Gi(), U = 0;
    } catch {
      U++;
    }
    if (An() === "locked" ? Ks() : ot && Vs(), A) {
      A = !1;
      try {
        (E = t.likesChanged) == null || E.call(t);
      } catch {
      }
    }
    t.changed(), Ce.length && !m && lt();
  }
  async function Qr(p) {
    const E = i == null ? void 0 : i.root;
    if (!E || i != null && i.slot || !(i != null && i.address) || It("slots")) return;
    const N = Number(t.store.get(St("slot", E)));
    if (!(!Number.isSafeInteger(N) || N < 1))
      try {
        const { balance: V } = await t.chain.account(i.address);
        if (V >= De + un(Lt())) return;
        await p.request("listening.openSlot", { slot: N }), i = await rn(p), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Gs(p, E) {
    var D;
    Zn();
    const N = !(i != null && i.address) || Xt(i.address), V = i != null && i.linked ? (D = t.nameOf) == null ? void 0 : D.call(t, i.linked) : void 0;
    await p.request("listening.unlock", { mode: "unlock", terms: N ? ue() : void 0, anyPasskey: E, ...Pt() ? { main: Pt() } : {}, ...V ? { label: V } : {} }), i = await rn(p), N && (Xt(i.address) ? await Jr() : await p.request("listening.stop")), await Qr(p), Ft(N ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const ut = g;
    g = null, ut && t.now() - ut.at < 12e4 && setTimeout(() => void gn(!0).then(() => ve(ut)), 0);
  }
  function Ks() {
    ot || l || vt || kt >= 3 || !s || !(i != null && i.address) || (ot = !0, Pe = (async () => {
      try {
        await Gs(s, !1), kt = 0;
      } catch (p) {
        const E = p instanceof Error ? p.message : String(p);
        /Cancelled in the listening wallet/.test(E) ? xt || (vt = !0, Ft("Not now. Nothing was signed.")) : /did not answer/.test(E) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (kt++, C = E);
      } finally {
        ot = !1;
        const p = xt;
        xt = null, p ? await p() : await gn(!0);
      }
    })());
  }
  async function Vs(p) {
    ot && (xt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Pe), p && await p(), t.changed();
  }
  const ue = () => ({
    fee: Lt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Fr.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Jr() {
    if (!(i != null && i.address)) return !1;
    if (H || (H = await t.tabLock(i.address)), !H)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function qs(p, E) {
    const N = i.address, { balance: V, nonce: ut } = E ?? await t.chain.account(N);
    o = V;
    const D = await s.request("listening.prepareReturn", {
      mode: p.mode,
      balance: V.toString(),
      nonce: ut.toString(),
      fee: jo.toString(),
      ...p.amount !== void 0 ? { amount: p.amount.toString() } : {},
      ...p.linked ? {} : { destination: p.to }
    });
    if (D.recipient !== p.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const dt = p.mode === "amount" ? p.amount : p.mode === "all" ? V - jo : V - Fr - jo, gt = Jo(D.raw);
    if (mr(gt.payload.recipient).value !== p.to || String(gt.payload.amount) !== D.amount || dt !== void 0 && D.amount !== dt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const yt = {
      id: Wl(),
      address: N,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: D.recipient,
      amount: D.amount,
      fee: D.fee,
      nonce: ut.toString(),
      created: t.now(),
      status: "signed",
      raw: D.raw,
      txid: D.txid
    };
    t.validate(yt), he(yt);
    try {
      await t.chain.broadcast(D.raw, D.txid), he({ ...yt, status: "pending" });
    } catch ($t) {
      throw he({ ...yt, status: "unknown", note: $t.message }), $t;
    }
    return D;
  }
  const ts = bl, Tr = jo;
  async function Nn(p, E, N) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (It("slots") || It("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const V = i.slot ?? 0;
    if (p === E || ![p, E].includes(V) || ![p, E].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const ut = i.root ?? i.address, D = p === 0 ? ut : i.address, dt = E === 0 ? ut : i.address, { balance: gt, nonce: yt } = await t.chain.account(D);
    if (gt < N + Tr + De) throw new Error(p === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const $t = await s.request("listening.signMove", { from: p, to: E, amount: N.toString(), fee: Tr.toString(), nonce: yt.toString(), balance: gt.toString() }), ge = Jo($t.raw);
    if ($t.from !== D || $t.to !== dt || $t.amount !== N.toString() || mr(ge.payload.recipient).value !== dt || String(ge.payload.amount) !== N.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const He = {
      id: Wl(),
      address: D,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: dt,
      amount: $t.amount,
      fee: $t.fee,
      nonce: yt.toString(),
      created: t.now(),
      status: "signed",
      raw: $t.raw,
      txid: $t.txid
    };
    t.validate(He), he(He);
    try {
      await t.chain.broadcast($t.raw, $t.txid), he({ ...He, status: "pending" });
    } catch (ct) {
      throw he({ ...He, status: "unknown", note: ct.message }), ct;
    }
    return ze({ txid: $t.txid, amount: $t.amount, at: t.now() }, dt), dt === ut && ut !== i.address ? c = null : a = -1 / 0, $t;
  }
  let es = !1;
  const ur = /* @__PURE__ */ new Map(), ns = (p) => St("float", p);
  async function Gi() {
    if (es || (i == null ? void 0 : i.state) !== "unlocked" || !me() || It("move") || It("rootLike") || !i.address) return;
    const p = i.address;
    if (t.store.get(ns(p)) === "1") return;
    const E = ne();
    if (!(E != null && E.player) || E.state !== "arrived") return;
    const N = En();
    if (N === void 0 || o === void 0) return;
    if (!Wn(N)) {
      t.store.set(ns(p), "1");
      return;
    }
    if (qe(Ae()) || f() || Qe().length || o < ts * 4n + De + Tr) return;
    const V = ur.get(p);
    if (!(V && (V.n >= 3 || t.now() - V.at < 5 * 6e4))) {
      es = !0, ur.set(p, { n: ((V == null ? void 0 : V.n) ?? 0) + 1, at: t.now() });
      try {
        await Nn(i.slot ?? 0, 0, ts), t.store.set(ns(p), "1");
      } catch (ut) {
        console.warn("[radio] likes float not sent yet", ut);
      } finally {
        es = !1;
      }
    }
  }
  async function Ki(p) {
    if (Re().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (It("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const E = await Oi().catch(() => null);
    if (!E)
      throw at = null, Gt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Gt = !1, o = E.balance;
    const N = { balance: E.balance, nonce: E.nonce };
    if (p === "excess") {
      const gt = h0(E.parts) ?? ht();
      if (!gt) throw new Error("Choose where to send the excess first.");
      await qs({ mode: "excess", to: gt, linked: !1 }, N), at = null, Ft("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const V = E.steps;
    if (!V.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!at && at.balance === E.balance && t.now() - at.at <= Xr && at.steps.length === V.length && at.steps.every((gt, yt) => gt.to === V[yt].to && gt.mode === V[yt].mode && gt.send === V[yt].send))) {
      at = {
        at: t.now(),
        balance: E.balance,
        steps: V,
        parts: E.parts,
        plan: { state: "ready", steps: V.map((gt) => ({ to: gt.to, kind: gt.kind, send: gt.send.toString() })), kept: E.tooSmall, excess: h0(E.parts) }
      }, Ft(V.length > 1 ? `This goes back in ${V.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const D = V[0], dt = D.to ?? ht();
    if (!dt) throw new Error("Choose where to send the rest first.");
    if (D.mode === "amount" && It("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await qs({ mode: D.mode, to: dt, linked: !1, ...D.mode === "amount" ? { amount: D.send } : {} }, N), at = null, V.length === 1 ? (Cn(!1), Ft("Returned ✓ Paying is off.")) : Ft(`Returned ✓ ${V.length - 1} more ${V.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Br() {
    if (!(i != null && i.unproven)) return;
    const p = await Xe();
    await p.request("listening.prove"), i = await rn(p);
  }
  const Ys = {
    forceRefresh: () => gn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (p) => {
      if (!t.main() && !(p !== null && !Rr(p))) {
        if (p === Ze()) return gn(!0);
        t.store.set(Ln, p ?? ""), C = "", v = "", o = void 0, a = -1 / 0, c = null, await gn(!0);
      }
    },
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (p) => re("Waiting for your passkey…", async () => {
      const E = await Xe();
      await E.request("listening.unlock", { mode: "create", terms: ue(), ...t.main() ? { main: t.main() } : {}, ...p != null && p.quick && !t.main() ? { quick: !0 } : {} }), i = await rn(E), i.address && t.store.set(St("created", i.address), "1"), Cn(!0), Ft(F() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Jr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (p) => {
      p ? nn() : ie = null, t.changed();
    },
    giftSent: (p, E) => {
      !(i != null && i.address) || Ve() || (ze({ txid: p, amount: E.toString(), at: t.now() }), a = -1 / 0, z = null, Ft("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (p) => {
      if (Zn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (It("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Xe()).request("listening.bindSlot", { slot: p, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (p, E, N, V) => {
      ze({ txid: N, amount: V.toString(), at: t.now() }, E), z = null, await Ys.openAlbum(p), Ft("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (p) => re("Opening…", async () => {
      if (Zn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (It("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === p) return;
      O(), await s.request("listening.openSlot", { slot: p }), i = await rn(s), o = void 0, a = -1 / 0, at = null, Gt = !1;
      const E = i.root;
      E && p > 0 && t.store.set(St("slot", E), String(p)), Ft(p === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (p = !1) => {
      const E = () => re("Waiting for your passkey…", async () => Gs(await Xe(), p));
      return ot ? p ? It("cancel") ? (Ft("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Vs(async () => {
        (An() === "locked" || An() === "intro") && await E();
      }) : Pe : E();
    },
    link: () => re("Sign in your wallet…", async () => {
      Zn();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const E = (await t.links(p)).find((N) => N.listening === i.address);
      if (E)
        await s.request("listening.link", { main: p, issued: E.issued, mainSignature: E.mainSignature });
      else {
        const N = { main: p, listening: i.address, issued: t.now() }, V = await t.signWithMain(p, m5(N)), ut = await s.request("listening.link", { main: p, issued: N.issued, mainSignature: V });
        await t.saveLink({ ...N, mainSignature: V, listeningSignature: ut.listeningSignature }), st = -1 / 0;
      }
      Ft("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => i != null && i.unproven ? (await re("One more passkey check…", Br), !(i != null && i.unproven)) : !0,
    deposit: () => re("Approve the deposit in your wallet…", async () => {
      Zn(), await Br();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Ve()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Ge()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await js(!0);
      const E = Yl(o ?? 0n);
      if (E <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      j = await t.deposit(p, i.address, E), j && ze({ txid: j, amount: E.toString(), at: t.now() }), Ft("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => re("Approve the top-up in your wallet…", async () => {
      Zn(), await Br();
      const p = t.main(), E = Ae();
      if (!p || !E) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (qe(E)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const N = await t.chain.balance(E);
      me() ? c = { for: E, value: N, at: t.now() } : (o = N, a = t.now());
      const V = Yl(N);
      if (V <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const ut = await t.deposit(p, E, V);
      ut && ze({ txid: ut, amount: V.toString(), at: t.now() }, E), Ft("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (p) => re("Adding plays…", async () => {
      if (Zn(), !me()) throw new Error("Open the album you want to add plays to first.");
      if (!dc.includes(p)) throw new Error("Choose one of the amounts offered.");
      const E = L5(p, Lt());
      if (h || d || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (Qe().length || Ve()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Nn(0, i.slot ?? 0, E), Ft("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => re("Confirm in the listening wallet…", async () => {
      if (!Fi()) throw new Error("Connect your wallet first.");
      await Jr(), await s.request("listening.approveSession", ue()), Cn(!0), Ft("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => re("Clearing…", async () => {
      for (const p of I())
        await t.chain.transaction(p.txid) || he({ ...p, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Ft("Cleared ✓");
    }),
    switchOff: () => re("Switching off…", async () => {
      O(), await (s == null ? void 0 : s.request("listening.stop")), Cn(!1), Ft("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => re("Showing your backup words in the box…", async () => {
      if (!(i != null && i.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const p = await Xe();
      await p.request("listening.backup"), i = await rn(p), Ft("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      Ut = null, await Ue(!0), t.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (p) => re("Confirm in the listening wallet…", async () => {
      var yt, $t, ge, He;
      const E = Zt();
      if ((i == null ? void 0 : i.state) !== "unlocked" || !E) throw new Error("Unlock your player first.");
      if (!t.awardNote) throw new Error("Awards are not available here.");
      if (It("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (ae(E)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || w || Qe().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await Jr();
      const N = await t.awardNote(E, p), { balance: V, nonce: ut } = await t.chain.account(E);
      if (V < p0) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const dt = await (await Xe()).request("listening.signAward", {
        cls: N.cls,
        number: N.number,
        plays: N.plays,
        record: N.record,
        signature: N.signature,
        fee: p0.toString(),
        nonce: ut.toString(),
        balance: V.toString()
      }), gt = Jo(dt.raw);
      if (dt.hero !== E || dt.number !== N.number || (($t = (yt = gt.payload) == null ? void 0 : yt.functionName) == null ? void 0 : $t.content) !== "claim" || ((He = (ge = gt.payload) == null ? void 0 : ge.contractName) == null ? void 0 : He.content) !== a5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await t.chain.broadcast(dt.raw, dt.txid), t.store.set(Qt(E), JSON.stringify({ txid: dt.txid, at: t.now() })), a = -1 / 0, Vt && (Vt = { ...Vt, at: -1 / 0 }), Ft("Record claimed ✓ It is being made now: about a minute.");
    }),
    lock: () => re("Locking…", async () => {
      O(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Ft("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (p) => {
      const E = String(p ?? "").trim();
      if (!(i != null && i.address)) return Ft("", "Unlock the listening wallet first.");
      if (!Rr(E)) return Ft("", "Enter a standard mainnet address (it starts with SP).");
      if (E === i.address) return Ft("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(W(i.address), E), Ft("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(W(i.address), ""), t.changed();
    },
    returnFunds: (p) => re("Check the return in the listening wallet…", async () => {
      if (!Fi()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Ye()) return Ki(p);
      const E = pe();
      if (!E) throw new Error(F() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (E.kind !== "linked" && It("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Re().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await qs({ mode: p, to: E.to, linked: E.kind === "linked" }), p === "all" && Cn(!1), Ft(p === "all" ? E.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Ce = [], u = 10, b = 30 * 6e4;
  let m = !1;
  const f = () => h || !!l || d || w, O = () => {
    Ce.length && (Ce.length = 0, t.changed());
  };
  async function et(p) {
    if (!Ce.some((E) => E.id === p.id) && !fn().some((E) => E.id === p.id) && (Ce.push({ ...p, at: t.now() }), Ce.length > u && Ce.shift()), f() || Re().length) {
      const E = Ce.length;
      v = `Queued ${E === 1 ? "this song" : E + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await lt();
  }
  async function lt() {
    if (!m) {
      m = !0;
      try {
        for (; Ce.length; ) {
          for (; Ce.length && t.now() - Ce[0].at > b; ) Ce.shift();
          if (!Ce.length || f() || await pt(Ce[0]) === "wait") return;
          Ce.shift();
        }
      } finally {
        m = !1, t.changed();
      }
    }
  }
  async function pt(p) {
    var E;
    h = !0;
    try {
      await gn();
      const N = An();
      if (N === "loading") return "wait";
      if (N !== "ready" || !Xt() || !(i != null && i.session) || i.session.playsLeft < 1 || !H) return "done";
      if (Re().length) return "wait";
      L || (await t.chain.verify(), L = !0);
      const V = i.address, { balance: ut, nonce: D } = await t.chain.account(V);
      o = ut, a = t.now();
      const dt = await t.chain.owner(Xl, p.song);
      if (dt === V || dt === Pt()) return "done";
      const gt = await s.request("listening.signPlay", {
        core: Xl,
        song: p.song,
        receipt: p.id,
        fee: Lt().toString(),
        nonce: D.toString(),
        balance: ut.toString()
      }), yt = {
        id: p.id,
        address: V,
        kind: "play",
        core: Xl,
        song: p.song,
        recipient: dt,
        amount: "50",
        fee: Lt().toString(),
        nonce: D.toString(),
        created: t.now(),
        status: "signed",
        raw: gt.raw,
        txid: gt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(yt), he(yt);
      const $t = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`;
      try {
        await t.chain.broadcast(gt.raw, gt.txid), he({ ...yt, status: "pending" }), v = `♪ Paid ${$t}`, C = "";
      } catch (ge) {
        he({ ...yt, status: Zi(ge) ? "failed" : "unknown", note: ge.message, ...Zi(ge) ? { raw: void 0 } : {} }), C = ge.message;
      }
      return i = await rn(s), "done";
    } catch (N) {
      const V = N instanceof Error ? N.message : "payment unavailable";
      return (E = ne()) != null && E.player ? (v = "Payment is taking a moment: " + V, "wait") : (v = "This song played free: " + V, "done");
    } finally {
      h = !1, t.changed();
    }
  }
  function zt(p) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(An()) || It("like") ? !1 : (ve(p), !0);
  }
  async function ve(p) {
    const E = p.title ? `“${p.title}”` : `song #${p.song}`, N = (Ht) => {
      var Jt;
      C = Ht, v = "";
      try {
        (Jt = t.likeFailed) == null || Jt.call(t, p.song);
      } catch {
      }
      t.changed();
    }, V = me(), ut = An(), D = Pt(), dt = V && (ut === "fund" || ut === "over") ? "ready" : ut, gt = F() ? Ae() : D;
    if (dt === "locked") {
      g = { ...p, at: t.now() }, Ft(`Unlock to like ${E}. It sends straight after.`);
      return;
    }
    if (dt === "wrong-wallet") return N(ji());
    if (dt === "link") return N("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (F() && It("standalone")) return N("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (dt === "fund") return N("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (dt === "over") return N("Return the excess first: the listening wallet holds more than 1 STX.");
    if (V) {
      await Rs(!0);
      const Ht = En();
      if (Wn(Ht))
        return t.changed(), N(Fc);
    }
    if (dt !== "ready" || !gt) return N("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return N("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!H) return N("Pay-per-play is running in another tab. Like from that tab.");
    const yt = fn(Ae()).find((Ht) => Ht.kind === "like" && Ht.song === p.song);
    if (yt && Ro.includes(yt.status))
      return N(`Your last like for ${E} is still on its way. It can change again once it confirms.`);
    if (d) return N("One like at a time: your last one is still being sent.");
    if ((yt == null ? void 0 : yt.status) === "confirmed" && t.now() - (yt.confirmedAt ?? 0) < T5)
      return N(`Your like for ${E} has only just confirmed. Try again in a moment.`);
    let $t;
    w = !0;
    try {
      $t = t.likeState ? (await t.likeState(gt, p.song)).by : p.likedBy ?? [];
    } catch {
      $t = p.likedBy;
    } finally {
      w = !1;
    }
    if (!$t) return N(`Could not check ${E} right now. Try the heart again.`);
    const ge = Ae(), ct = ((yt == null ? void 0 : yt.status) === "confirmed" && typeof yt.liked == "boolean" && t.now() - (yt.confirmedAt ?? yt.created) < 5 * 6e4 ? yt.liked : void 0) ?? $t.includes(ge);
    if (!ct && $t.some((Ht) => Ht !== ge)) return N(F() ? `${E} was liked from another wallet of yours. Unlike it there.` : `${E} was liked from your main wallet${$t.includes(D) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await jt({ song: p.song, liked: !ct, title: p.title, artist: p.artist });
  }
  async function jt(p) {
    var V, ut, D;
    if (d) {
      Ft("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const E = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`, N = t.wait ?? ((dt) => new Promise((gt) => setTimeout(gt, dt)));
    try {
      Ft(`${p.liked ? "Liking" : "Unliking"} ${E}…`);
      const dt = t.now() + 12e4;
      for (; h || (me() ? fn(Ae()).some((ct) => Ro.includes(ct.status)) : Re().length); ) {
        if (t.now() > dt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await N(5e3), await gn(!0);
      }
      if (!me() && An() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const gt = Ae(), { balance: yt, nonce: $t } = await t.chain.account(gt);
      if (me() ? c = { for: gt, value: yt, at: t.now() } : (o = yt, a = t.now()), Wn(yt)) throw new Error(Fc);
      const ge = await s.request("listening.signLike", {
        song: p.song,
        liked: p.liked,
        fee: ql.toString(),
        nonce: $t.toString(),
        balance: yt.toString()
      }), He = {
        id: Wl(),
        address: gt,
        kind: "like",
        core: 0,
        song: p.song,
        liked: p.liked,
        recipient: "",
        amount: "0",
        fee: ql.toString(),
        nonce: $t.toString(),
        created: t.now(),
        status: "signed",
        raw: ge.raw,
        txid: ge.txid,
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(He), he(He);
      try {
        await t.chain.broadcast(ge.raw, ge.txid), he({ ...He, status: "pending" }), v = `${p.liked ? "♥ Liked" : "Unliked"} ${E}`, C = "";
        try {
          (V = t.likeSent) == null || V.call(t, p.song, p.liked);
        } catch {
        }
      } catch (ct) {
        if (he({ ...He, status: Zi(ct) ? "failed" : "unknown", note: ct.message, ...Zi(ct) ? { raw: void 0 } : {} }), C = ct.message, Zi(ct)) try {
          (ut = t.likeFailed) == null || ut.call(t, p.song);
        } catch {
        }
      }
      i = await rn(s);
    } catch (dt) {
      C = "Like not sent: " + (dt instanceof Error ? dt.message : "the listening wallet is unavailable");
      try {
        (D = t.likeFailed) == null || D.call(t, p.song);
      } catch {
      }
    } finally {
      d = !1, t.changed(), lt();
    }
  }
  return { snapshot: Cr, refresh: gn, onListened: et, heart: zt, toggleLike: ve, ...Ys };
}
const yb = ["Connect", "Passkey", "Link & fund", "Listen"], wb = ["Passkey", "Add 1 STX", "Listen"], ld = (t) => t ? wb : yb;
function M5(t) {
  if (t.solo) return N5(t);
  const e = yb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function N5(t) {
  const e = wb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function _5(t, e) {
  return !e || e.at >= ld(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const P5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function U5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !P5(r.id)));
}
const H5 = {}, O5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, D5 = (t) => {
  const e = H5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, F5 = (t) => `/hiro/${t}`, j5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, R5 = (t) => {
  const e = D5(t);
  if (e)
    return [j5(e)];
  const n = O5[t];
  return typeof window < "u" ? [`${window.location.origin}${F5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, z5 = {}, g0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, G5 = "xtrata.log.enabled", K5 = "xtrata.log.level", V5 = "xtrata.log.tags", q5 = "xtrata.log.dedupe", Ja = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, Y5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, X5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, W5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, Z5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, Q5 = () => {
  const t = z5 ?? {}, e = Ja(G5) ?? t.VITE_LOG_ENABLED, n = Ja(K5) ?? t.VITE_LOG_LEVEL, r = Ja(V5) ?? t.VITE_LOG_TAGS, s = Ja(q5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: Y5(e),
    level: X5(n) ?? "warn",
    tags: Z5(r),
    dedupe: W5(s)
  };
}, J5 = (t, e, n) => !t.enabled || g0[n] < g0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), t$ = (t, e, n, r) => {
  const s = Q5();
  if (!J5(s, e, t) || n$(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, e$ = /* @__PURE__ */ new Set();
let y0 = null;
const n$ = (t, e, n, r, s) => (y0 !== t && (e$.clear(), y0 = t), !1), r$ = (t, e, n) => t$("debug", t, e, n), s$ = {}, i$ = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, o$ = (t) => {
  const e = s$, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : i$[t];
}, a$ = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, c$ = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return a$.test(n) ? n : null;
}, l$ = (t) => t.replace(/\/+$/, ""), u$ = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), w0 = (t) => {
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
}, Qi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, d$ = (t) => {
  var c, l;
  let e;
  try {
    e = mr(c6(t));
  } catch {
    return null;
  }
  const n = Qi(e);
  if (!n || n.success === !1)
    return null;
  const r = Qi(n.value), s = Qi(r == null ? void 0 : r.value), i = Qi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = w0((c = Qi(i.name)) == null ? void 0 : c.value), a = w0((l = Qi(i.namespace)) == null ? void 0 : l.value);
  return !o || !a ? null : c$(`${o}.${a}`);
}, f$ = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${l$(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Ww(Nw(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : d$(i.result);
}, h$ = async (t) => {
  const e = t.address.trim();
  if (!co(e))
    return null;
  const n = o$(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of R5(t.network))
    try {
      return await f$({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return r$("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: u$(r)
  }), null;
};
function p$(t, e, n = {}) {
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
const b0 = Object.freeze({
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
}), m0 = Object.freeze({ 139: "melophonic" });
function x0(t, e = "") {
  const n = String(t);
  return Object.hasOwn(b0, n) ? b0[n] : Object.hasOwn(m0, n) ? m0[n] : e;
}
const S0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function E0(t, e = "") {
  return Object.hasOwn(S0, String(t)) ? S0[String(t)] : e;
}
const bb = 10000n, If = 1000000n, jc = 3000n, g$ = (t, e) => `${t}#gift=${e}`, y$ = 100, zo = (t, e = lr) => t <= De ? 0 : Number((t - De) / un(e)), A0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), mb = "xtrata.xyz/radio/gifts", Zl = y$, w$ = "Create a prefunded Xtrata radio gift batch", b$ = (t) => ({
  domain: ki({ name: tn(mb), version: tn("1"), "chain-id": Ar(1) }),
  message: ki({
    purpose: tn(w$),
    creator: tn(t.creator),
    count: Ar(t.count),
    amount: Ar(BigInt(t.amount)),
    label: tn(t.label),
    issued: Ar(t.issued),
    ...t.player ? { player: tn(t.player) } : {}
  })
}), m$ = (t, e, n = lr) => De + BigInt(t) * un(n) + (e ? bl : 0n), x$ = (t, e = lr) => Number((If - De - (t ? bl : 0n)) / un(e)), S$ = (t, e) => BigInt(t) * (e + jc);
function E$(t, e, n, r = lr) {
  const s = n ? bl : 0n, i = e > De + s ? e - De - s : 0n, o = Number(i / un(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Hc,
    fees: BigInt(o) * r,
    reserve: De,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: jc,
    perCopy: e + jc,
    total: S$(t, e)
  };
}
const A$ = (t) => t >= bb && t <= If, v0 = 40, v$ = "Create an Xtrata radio gift player", k$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function k0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && k$.test(t) : !n;
}
function $$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!k0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!k0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > v0) throw new Error(`A player holds 1 to ${v0} songs.`);
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
const I$ = (t) => {
  const e = [...new Set(t.explicit ?? [])].sort((n, r) => n - r);
  return Cd(Md(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null, ...e.length ? { explicit: e } : {} }))));
}, L$ = (t) => ({
  domain: ki({ name: tn(mb), version: tn("1"), "chain-id": Ar(1) }),
  message: ki({
    purpose: tn(v$),
    admin: tn(t.admin),
    player: tn(t.hash),
    issued: Ar(t.issued)
  })
}), zr = (t) => t.tracks.filter((e) => !e.hidden), C$ = (t) => t.tracks.find((e) => e.hidden) ?? null, $0 = [300, 500, 1e3], I0 = 1800, Ql = /* @__PURE__ */ new Map();
async function T$(t) {
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
function B$(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Ql.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Ql.set(t, { ...a, until: Date.now() + I0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Ql.delete(t), s();
      }, I0 + 50);
    }
  }, i;
}
const Dr = (t, e, n, r, s) => B$(t, e, async () => await T$(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Zs = "xtrata.radio.gift.incoming.v1", L0 = (t) => "xtrata.radio.gift.mine.v1:" + t, C0 = (t) => "xtrata.radio.gift.batches.v1:" + t, Et = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, yr = (t, e, n = "") => {
  const r = Et("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, tc = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Gn = (t) => rr(t).replace(/\.?0+$/, "");
function M$(t) {
  let e = null;
  const n = (I) => [5e3, 1e4, 2e4, 3e4][I] ?? 6e4, r = (() => {
    try {
      const I = new URL(location.href), G = new URLSearchParams(I.hash.slice(1)).get("gift") ?? I.searchParams.get("gift");
      return G !== null && (I.searchParams.delete("gift"), history.replaceState(null, "", I.pathname + (I.search || ""))), A0(G) ? G : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const I = JSON.parse(t.store.get(Zs) || "null");
      return A0(I == null ? void 0 : I.code) ? I.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(Zs, JSON.stringify({ code: i, at: t.now() }));
    let I = 0;
    const G = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (F) => {
      const S = await F.json().catch(() => ({}));
      if (F.status === 404) {
        t.store.set(Zs, null), e = { ...e, error: (S == null ? void 0 : S.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!F.ok) throw new Error("busy");
      const W = S;
      e = { ...e, view: W, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(W.status) && t.store.set(Zs, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void G(), n(I++)));
    });
    G();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const I = e == null ? void 0 : e.view;
    return !(I != null && I.player) || !o() ? null : { player: I.player, from: d(I), plays: zo(BigInt(I.amount)) };
  }, c = () => {
    const I = e == null ? void 0 : e.view;
    return !I || I.player || !o() ? null : { plays: zo(BigInt(I.amount)), from: I.from ? t.who(I.from) : null };
  }, l = () => {
    const I = e == null ? void 0 : e.code;
    if (!I) return [];
    const G = `${location.origin}${location.pathname}#gift=${I}`;
    return [Dr("gift-pass-on", "Copy the link to pass on", () => G, "primary", t.changed)];
  }, h = () => {
    e = null, t.store.set(Zs, null), t.changed();
  }, d = (I) => I.from ? t.who(I.from) : I.label ? `Xtrata Radio · ${I.label}` : "Xtrata Radio";
  let w = {};
  const g = (I) => {
    if (w.box) return w.box;
    const G = Et("div", "", "ppp-gift-check");
    w.box = G;
    const F = () => {
      const S = window.turnstile;
      !S || w.rendered || (w.rendered = !0, S.render(G, { sitekey: I, callback: (W) => {
        w.token = W, t.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) F();
    else {
      const S = document.createElement("script");
      S.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", S.async = !0, S.onload = F, document.head.append(S);
    }
    return G;
  }, A = (I) => {
    queueMicrotask(() => void I());
  };
  let v;
  async function C(I) {
    var S, W, ht, oe, pe, Kt, ne, Zt, Vt;
    if (!e || e.claiming || !I.listening) return;
    const G = !!((S = e.view) != null && S.player);
    if (G && !I.root) return;
    e.claiming = !0, e.error = void 0, (W = t.claiming) == null || W.call(t, !0), t.changed();
    const F = async (Ut) => {
      const tt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: w.token, ...Ut })
      });
      return { res: tt, r: await tt.json().catch(() => ({})) };
    };
    try {
      let Ut = 0, tt = I.listening, Qt;
      if (G) {
        const be = Number((ht = await t.json("/radio/gift/slots?root=" + encodeURIComponent(I.root))) == null ? void 0 : ht.next);
        if (!Number.isSafeInteger(be) || be < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Ut = be;
        for (let hn = 0; ; hn++) {
          const pn = await t.album.bind(Ut);
          if (tt = pn.address, Qt = await F({ wallet: tt, binding: pn }), Qt.res.status === 409 && /just taken/.test(((oe = Qt.r) == null ? void 0 : oe.error) || "") && hn < 5) {
            Ut += 1;
            continue;
          }
          break;
        }
      } else Qt = await F({ wallet: tt });
      const { res: ae, r: Ue } = Qt;
      if (ae.status === 503 && /sending another gift/.test((Ue == null ? void 0 : Ue.error) || "")) {
        e.waiting = !0, (pe = t.claiming) == null || pe.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!ae.ok) {
        const be = String((Ue == null ? void 0 : Ue.error) || "");
        if (ae.status === 404 || ae.status === 410 || ae.status === 409 && /already had a gift|brand-new|already have this album/.test(be))
          throw t.store.set(Zs, null), new Error(be || "This gift cannot be opened.");
        if (ae.status === 429 || ae.status === 403 || ae.status === 400 && !/wallet number/i.test(be)) throw new Error(be || `Could not open the gift (${ae.status}).`);
        const pn = /topping up/.test(be) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(be) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(be) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(pn), { retry: !0, slow: /topping up|not paid for yet/.test(be) });
      }
      e.done = !0, t.store.set(Zs, null), G ? await t.album.arrived(Ut, tt, Ue.txid, BigInt(Ue.amount)) : t.giftSent(Ue.txid, BigInt(Ue.amount));
    } catch (Ut) {
      const tt = Ut, Qt = tt.name === "TypeError" || tt.name === "AbortError" || tt.name === "TimeoutError" || /wallet number/i.test(tt.message);
      if (tt.retry || Qt) {
        const ae = e.tries ?? 0;
        e.tries = ae + 1, e.retry = { text: tt.retry ? tt.message : "Still sending your gift… the network is slow, trying again." }, (Kt = t.claiming) == null || Kt.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, tt.slow ? 6e4 : n(ae));
      } else
        e.error = tt.message, (ne = t.claiming) == null || ne.call(t, !1);
      w.token = void 0;
      try {
        (Vt = (Zt = window.turnstile) == null ? void 0 : Zt.reset) == null || Vt.call(Zt, w.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let U = null;
  function j(I) {
    if (!I.listening || !I.depositPending || I.step !== "fund")
      return U = null, [];
    if (!U || U.wallet !== I.listening || t.now() - U.at > 3e4) {
      const F = I.listening;
      U = { ...(U == null ? void 0 : U.wallet) === F ? U : {}, wallet: F, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(F)).then((S) => {
        var W, ht;
        (U == null ? void 0 : U.wallet) === F && (U.state = (W = S == null ? void 0 : S.gift) == null ? void 0 : W.state, U.problem = ((ht = S == null ? void 0 : S.gift) == null ? void 0 : ht.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const G = Et("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return G.title = `Network reply: ${U.problem}`, [G];
  }
  function k(I, G, F = !1) {
    var Kt, ne;
    const S = G.player, W = BigInt(G.amount), ht = F ? [] : [Et("p", `🎁 ${d(G)} sent you “${S.title}”${S.subtitle ? ` by ${S.subtitle}` : ""}: ${zr(S).length} ${zr(S).length === 1 ? "song" : "songs"} and ${zo(W).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!I.root && ["fund", "ready", "over", "link"].includes(I.step))) {
      if (F) return ht;
      if (ht.push(Et("p", I.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : I.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), I.step === "intro") {
        const Zt = document.createElement("details");
        Zt.className = "ppp-how";
        const Vt = document.createElement("summary");
        Vt.textContent = "How does this work?", Zt.append(Vt, Et("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), ht.push(Zt);
      }
      return ht;
    }
    if (I.walletCannotAlbums)
      return ht.push(Et("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), ht;
    const pe = (ne = (Kt = I.gate) == null ? void 0 : Kt.gifts) == null ? void 0 : ne.turnstileSiteKey;
    return pe && !w.token ? ht.push(Et("p", "One quick check and it is yours:", "ppp-mute"), g(pe)) : !e.claiming && !e.error && !e.waiting && !e.retry && A(() => C(I)), ht.push(...B(I, "Sending your album…")), ht;
  }
  function B(I, G) {
    const F = [];
    return e.claiming || e.waiting ? F.push(Et("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : G, "ppp-cyan")) : e.retry && F.push(Et("p", e.retry.text, "ppp-warn"), yr("Try now", () => {
      clearTimeout(v), e.retry = void 0, C(I);
    }, "quiet")), e.error && /already have this album/i.test(e.error) ? F.push(Et("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...l(), yr("Forget this gift link here", h, "quiet")) : e.error && F.push(Et("p", e.error, "ppp-bad"), yr("Try again", () => {
      e.error = void 0, C(I);
    })), F;
  }
  const P = (I) => {
    var G;
    return !!e && !e.done && !e.error && o() && !!I.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !I.linked && !I.creditedTo && (I.createdHere || I.brandNew || !!((G = e.view) != null && G.player)) && (I.balance ?? 0n) === 0n && !I.entries.length);
  };
  function Y(I, G = {}) {
    var Vt, Ut;
    const F = j(I);
    if (!e || ["off", "elsewhere"].includes(I.step)) return F;
    const S = e.view;
    if (e.error && !S) return [Et("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!S) return [Et("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return F;
    if (S.status === "claimed" || S.status === "claiming") return [Et("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(S.status)) return [Et("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (S.status === "pending-deposit") return [Et("p", `🎁 ${d(S)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (S.player) return [...k(I, S, !!G.bare), ...F];
    if (!!I.listening && (!(I.createdHere || I.brandNew) || !!I.linked || !!I.creditedTo || (I.balance ?? 0n) > 0n || I.entries.length > 0))
      return [Et("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...l(), yr("Forget this gift link here", h, "quiet")];
    const ht = BigInt(S.amount), oe = zo(ht).toLocaleString(), pe = Et(
      "p",
      `🎁 ${d(S)} sent you ${Gn(ht)} STX of on-chain music: about ${oe} paid plays.`,
      "ppp-gift"
    ), Kt = G.bare ? [] : [pe], ne = !!I.listening && (I.createdHere || I.brandNew) && !I.linked && !I.creditedTo && I.step === "fund" && (I.balance ?? 1n) === 0n && !I.depositPending && !I.entries.length, Zt = (Ut = (Vt = I.gate) == null ? void 0 : Vt.gifts) == null ? void 0 : Ut.turnstileSiteKey;
    return ne ? (Zt && !w.token ? Kt.push(Et("p", "One quick check and it is yours:", "ppp-mute"), g(Zt)) : !e.claiming && !e.error && !e.waiting && !e.retry && A(() => C(I)), Kt.push(...B(I, "Sending your gift…"))) : I.step === "intro" ? G.bare || Kt.push(Et("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : I.listening && I.linked ? Kt.push(Et("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...l(), yr("Forget this gift link here", h, "quiet")) : I.listening && (I.balance ?? 0n) > 0n && Kt.push(Et("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...l(), yr("Forget this gift link here", h, "quiet")), Kt;
  }
  async function st(I, G, F) {
    var S;
    try {
      const W = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(I));
      if ((S = W == null ? void 0 : W.gift) != null && S.returnTo) return { ok: !0, funder: W.gift.returnTo, txId: W.gift.txid ?? void 0, amount: W.gift.amount, distinct: 1 };
    } catch {
      if (F) return { ok: !1 };
    }
    return G();
  }
  const Z = Et("div", "", "ppp-gift-fold");
  let q = 250000n, y = "", $ = "";
  const M = (I) => {
    try {
      const G = JSON.parse(t.store.get(L0(I)) || "[]");
      return Array.isArray(G) ? G : [];
    } catch {
      return [];
    }
  }, T = (I, G) => t.store.set(L0(I), JSON.stringify(G.slice(0, 50)));
  async function K(I) {
    const G = M(I);
    for (const F of G)
      if (!(F.view && ["claimed", "refunded", "expired"].includes(F.view.status)))
        try {
          F.view = !F.view || F.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: F.id, ...F.txid ? { txid: F.txid } : {} }) }) : await t.json("/radio/gift?id=" + F.id), F.error = void 0;
        } catch (S) {
          F.error = S.message;
        }
    T(I, G), t.changed();
  }
  async function z(I) {
    if (y) return;
    y = "Starting your gift…", $ = "", t.changed();
    let G = null;
    try {
      G = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: I, amount: q.toString() }) });
      const F = M(I);
      F.unshift({ id: G.id, code: G.code, amount: q.toString(), at: t.now() }), T(I, F), y = "Approve the gift in your wallet…", t.changed();
      const S = await t.pay(I, G.depositTo, BigInt(G.deposit), G.memo), W = M(I), ht = W.find((oe) => oe.id === G.id);
      ht && (ht.txid = S, ht.view = { status: "pending-deposit", amount: q.toString(), source: "friend", from: I, label: "", expires: 0 }), T(I, W), $ = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", K(I);
    } catch (F) {
      $ = F.message || "Not sent.";
    } finally {
      y = "", t.changed();
    }
  }
  const bt = (I) => "xtrata.radio.gift.players.v1:" + I, at = (I) => {
    try {
      const G = JSON.parse(t.store.get(bt(I)) || "[]");
      return Array.isArray(G) ? G.filter((F) => F && /^[0-9a-f]{16}$/.test(F.id)) : [];
    } catch {
      return [];
    }
  };
  async function Gt(I, G) {
    var F;
    if (!y) {
      y = "Checking the player…", $ = "", t.changed();
      try {
        const S = G.tracks.split(/[\s,]+/).filter(Boolean).map((Zt) => Number(Zt.replace(/^#/, ""))), W = (G.explicit ?? "").split(/[\s,]+/).map((Zt) => Zt.replace(/^#/, "")).filter(Boolean).map(Number), ht = $$({ title: G.title.trim(), subtitle: G.subtitle.trim(), tracks: S, cover: (F = G.cover) != null && F.trim() ? Number(G.cover.trim().replace(/^#/, "")) : null, ...W.length ? { explicit: W } : {} });
        y = "Sign in your wallet…", t.changed();
        const oe = { admin: I, hash: I$(ht), issued: t.now() }, pe = await t.sign(I, L$(oe));
        y = "Making the player…", t.changed();
        const Kt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ht, request: oe, signature: pe }) }), ne = at(I).filter((Zt) => Zt.id !== Kt.id);
        ne.unshift({ id: Kt.id, title: Kt.title, tracks: Kt.tracks }), t.store.set(bt(I), JSON.stringify(ne.slice(0, 30))), $ = `${Kt.existing ? "That player already exists" : "Player made"} ✓ “${Kt.title}” · ${Kt.tracks} songs. Pick it below for a batch.`;
      } catch (S) {
        $ = S.message || "Not made.";
      } finally {
        y = "", t.changed();
      }
    }
  }
  const L = (I, G) => g$(I || location.origin + "/radio.html", G), H = (I) => {
    try {
      const G = JSON.parse(t.store.get(C0(I)) || "[]");
      return Array.isArray(G) ? G.filter((F) => F && /^[0-9a-f]{16}$/.test(F.id) && Array.isArray(F.codes)) : [];
    } catch {
      return [];
    }
  }, ot = (I, G) => t.store.set(C0(I), JSON.stringify(G.slice(0, 20))), vt = (I) => !!I.view && I.view.status === "live" && I.view.copies.waiting + I.view.copies.claiming + I.view.copies.refunding === 0, kt = (I, G) => t.json(I, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(G) });
  let xt = 0;
  async function Pe(I) {
    const G = H(I);
    for (const F of G)
      if (!vt(F))
        try {
          F.view = !F.view || F.view.status === "pending-deposit" ? await kt("/radio/gift/batch/confirm", { id: F.id, ...F.txid ? { txid: F.txid } : {} }) : await t.json("/radio/gift/batch?id=" + F.id), F.error = void 0;
        } catch (S) {
          F.error = S.message;
        }
    try {
      const F = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(I));
      for (const S of (F == null ? void 0 : F.batches) ?? []) {
        const W = G.find((ht) => ht.id === S.id);
        if (W) {
          W.error || (W.view = S);
          continue;
        }
        G.push({ id: S.id, codes: [], count: S.count, amount: S.amount, label: S.label, player: S.player, depositTo: "", deposit: S.deposit, memo: S.memo, at: 0, view: S });
      }
    } catch {
    }
    ot(I, G), t.changed();
  }
  async function Lt(I, G) {
    const F = H(I).find((S) => S.id === G);
    if (!(!F || !F.depositTo || y)) {
      y = "Approve the payment in your wallet…", $ = "", t.changed();
      try {
        const S = await t.pay(I, F.depositTo, BigInt(F.deposit), F.memo), W = H(I), ht = W.find((oe) => oe.id === G);
        ht && (ht.txid = S), ot(I, W), $ = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", y = "", Pe(I);
      } catch (S) {
        $ = `${/cancel/i.test(S.message) ? "Payment cancelled." : S.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        y = "", t.changed();
      }
    }
  }
  async function It(I, G, F, S) {
    if (y) return;
    if (!G.ok) {
      $ = G.reason, t.changed();
      return;
    }
    y = "Sign in your wallet…", $ = "", t.changed();
    let W = null;
    try {
      const ht = { creator: I, count: G.count, amount: G.amount.toString(), label: F, issued: t.now(), ...S ? { player: S } : {} }, oe = await t.sign(I, b$(ht));
      y = "Making your links…", t.changed(), W = await kt("/radio/gift/batch", { request: ht, signature: oe });
      const pe = H(I);
      pe.unshift({ id: W.id, codes: W.codes, count: G.count, amount: W.amount, label: F, player: S ?? null, depositTo: W.depositTo, deposit: W.deposit, memo: W.memo, at: t.now() }), ot(I, pe);
    } catch (ht) {
      $ = ht.message || "Not made.", y = "", t.changed();
      return;
    }
    y = "", t.changed(), await Lt(I, W.id);
  }
  function St() {
    const I = !!ie.value, G = nn.value === "max" ? x$(I) : Number(nn.value), F = m$(G, I), S = Number(Ge.value);
    return !Number.isInteger(S) || S < 1 || S > Zl ? { ok: !1, reason: `Make 1 to ${Zl} copies at a time.`, album: I, plays: G, amount: F, count: S } : A$(F) ? { ok: !0, reason: "", album: I, plays: G, amount: F, count: S, bill: E$(S, F, I) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: I, plays: G, amount: F, count: S };
  }
  const Ln = () => {
    const I = St();
    if (!I.ok) return I.reason;
    const G = I.bill;
    return `Each copy: ${I.plays.toLocaleString()} paid plays (${Gn(G.holders)} to song holders, ${Gn(G.fees)} network fees)${I.album ? `, ${Gn(G.float)} for the album’s likes` : ""}, ${Gn(G.reserve)} kept so a listener can return what is left, + ${Gn(G.sendFee)} to send it = ${Gn(G.perCopy)} STX. ${I.count} copies = ${Gn(G.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Ze = (I, G) => G.codes.map((F) => L(I, F)), Pt = Et("input");
  Pt.type = "range", Pt.min = String(bb), Pt.max = String(If), Pt.step = "10000", Pt.value = String(q), Pt.setAttribute("aria-label", "Gift amount");
  const fn = Et("p", "", "ppp-gift-amount"), he = yr("", () => {
    const I = t.main();
    I && z(I);
  }, "primary"), Xt = () => {
    fn.textContent = Cn(), he.textContent = `Gift ${Gn(q)} STX`;
  };
  Pt.oninput = () => {
    q = BigInt(Pt.value), Xt();
  };
  const Cn = () => `${Gn(q)} STX · about ${zo(q).toLocaleString()} paid plays · you pay ${Gn(q + jc)} STX with the network fee`;
  Xt();
  const Re = Et("input");
  Re.maxLength = 60, Re.placeholder = "Title, e.g. Proof of Sound", Re.setAttribute("aria-label", "Player title");
  const Qe = Et("input");
  Qe.maxLength = 80, Qe.placeholder = "Artist (optional)", Qe.setAttribute("aria-label", "Player subtitle");
  const Ve = Et("textarea");
  Ve.rows = 3, Ve.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ve.setAttribute("aria-label", "Songs");
  const qe = Et("input");
  qe.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", qe.setAttribute("aria-label", "Explicit songs");
  const ze = Et("input");
  ze.inputMode = "numeric", ze.placeholder = "Cover inscription number (optional), shown when the album loads", ze.setAttribute("aria-label", "Cover inscription");
  const ie = Et("select");
  ie.setAttribute("aria-label", "Batch album");
  const nn = Et("select");
  nn.setAttribute("aria-label", "Plays per copy");
  for (const I of [.../* @__PURE__ */ new Set([50, 100, 250, ...$0])].sort((G, F) => G - F)) nn.append(tc(`${I.toLocaleString()} plays`, String(I)));
  nn.append(tc("Max (1 STX)", "max")), nn.value = String($0[0]);
  const Ge = Et("input");
  Ge.type = "number", Ge.min = "1", Ge.max = String(Zl), Ge.value = "10", Ge.setAttribute("aria-label", "Copies");
  const Le = Et("input");
  Le.maxLength = 40, Le.placeholder = "Label, e.g. Opera launch", Le.setAttribute("aria-label", "Batch label");
  const Ae = Et("p", "", "ppp-mute"), me = () => {
    Ae.textContent = Ln();
  };
  for (const I of [ie, nn, Ge])
    I.oninput = me, I.onchange = me;
  me();
  function En(I) {
    var W, ht;
    const G = (W = I.gate) == null ? void 0 : W.gifts;
    if (!(G != null && G.enabled) || !G.admin || ["off", "elsewhere", "unsupported"].includes(I.step)) return null;
    const F = t.main(), S = [Et("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!F)
      S.push(Et("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (G.admin) {
      const oe = Et("div", "", "ppp-gift-admin"), pe = (Ut, tt) => {
        const Qt = Et("label", Ut);
        return Qt.append(tt), Qt;
      }, Kt = at(F);
      oe.append(
        Et("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Re,
        Qe,
        Ve,
        ze,
        qe,
        yr("Sign and make player", () => void Gt(F, { title: Re.value, subtitle: Qe.value, tracks: Ve.value, cover: ze.value, explicit: qe.value }))
      );
      const ne = yr("Sign, pay and make links", () => {
        It(F, St(), Le.value.trim(), ie.value || void 0);
      });
      ne.disabled = !!y;
      const Zt = ie.value;
      ie.replaceChildren(tc("No album (starter copies)", ""), ...Kt.map((Ut) => tc(`${Ut.title} · ${Ut.tracks} songs`, Ut.id))), Kt.some((Ut) => Ut.id === Zt) && (ie.value = Zt), me(), oe.append(
        Et("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        pe("Album ", ie),
        pe("Plays each ", nn),
        pe("Copies ", Ge),
        Le,
        Ae,
        ne
      ), t.now() - xt > 3e4 && (xt = t.now(), Pe(F));
      const Vt = H(F);
      if (Vt.length) {
        const Ut = Et("ul", "", "ppp-gift-list");
        for (const tt of Vt.slice(0, 10)) {
          const Qt = tt.view, ae = Qt == null ? void 0 : Qt.copies, Ue = tt.error ? tt.error : !Qt || Qt.status === "pending-deposit" ? tt.txid ? "payment confirming…" : "waiting for your payment" : `${ae.claimed} of ${Qt.count} claimed${ae.refunding + ae.refunded ? ` · ${ae.refunded} refunded${ae.refunding ? `, ${ae.refunding} on their way` : ""}` : ""}`, be = Et("li");
          if (be.append(Et("span", `${tt.label || "Batch"} · ${tt.count} × ${Gn(BigInt(tt.amount))} STX`, "t"), Et("span", Ue, "ppp-mute")), !tt.txid && tt.depositTo && (!Qt || Qt.status === "pending-deposit") && be.append(yr("Pay now", () => void Lt(F, tt.id), "tiny")), tt.codes.length && (Qt == null ? void 0 : Qt.status) === "live") {
            const hn = Ze(((ht = I.gate) == null ? void 0 : ht.radioUrl) ?? null, tt);
            be.append(
              Dr("batch-copy:" + tt.id, "Copy all links", () => hn.join(`
`), "tiny", t.changed),
              Dr("batch-csv:" + tt.id, "Copy as CSV", () => ["copy,link", ...hn.map((pn, Rn) => `${Rn + 1},${pn}`)].join(`
`), "tiny", t.changed)
            );
          } else tt.codes.length || be.append(Et("span", "links were made on another device", "ppp-mute"));
          Ut.append(be);
        }
        oe.append(Ut);
      }
      S.push(oe);
    }
    return y && S.push(Et("p", y, "ppp-cyan")), $ && S.push(Et("p", $, /✓/.test($) ? "ppp-ok" : "ppp-warn")), Z.replaceChildren(...S), Z;
  }
  return { banner: Y, funder: st, renderFold: En, liveGift: o, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: P };
}
const N$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function _$(t) {
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
const P$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function U$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = P$(i);
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
function H$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const ud = /* @__PURE__ */ new Set(), Lf = (t) => (ud.add(t), () => {
  ud.delete(t);
}), Rc = () => {
  for (const t of [...ud])
    try {
      t();
    } catch {
    }
}, T0 = "xtrata:al-thumb:v1:", xb = "-", Go = 96, O$ = 24 * 1024 * 1024, yn = /* @__PURE__ */ new Map(), B0 = /* @__PURE__ */ new Set(), dd = [];
let Jl = !1, tu;
const zc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(T0 + t);
    window.localStorage.setItem(T0 + t, e);
  } catch {
  }
  return null;
};
function Cf(t) {
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
          r.width = r.height = Go, s.fillStyle = "#143a40", s.fillRect(0, 0, Go, Go), s.drawImage(i, (i.naturalWidth - a) / 2, (i.naturalHeight - a) / 2, a, a, 0, 0, Go, Go), e(r.toDataURL("image/jpeg", 0.82));
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
async function D$(t) {
  var c, l, h, d, w;
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
      const j = r.slice(C, U + 1), k = j.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (k) return k[1].replace(/&amp;/g, "&");
      const B = j.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (B) return "/inscription/" + B[1];
      A = U + 1;
    }
  }, o = (w = (d = e.body) == null ? void 0 : d.getReader) == null ? void 0 : w.call(d);
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
    if (s > O$)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function F$() {
  if (!Jl) {
    Jl = !0;
    try {
      for (; dd.length; ) {
        const t = dd.shift();
        if (!yn.has(t))
          try {
            const e = await D$(t);
            if (e === null) continue;
            if (!e) {
              yn.set(t, ""), zc(t, xb), Rc();
              continue;
            }
            const n = await Cf(e);
            yn.set(t, n), n.startsWith("data:image/jpeg") && zc(t, n), Rc();
          } catch {
          }
      }
    } finally {
      Jl = !1;
    }
  }
}
function Sb(t, e) {
  if (e && !yn.get(t) ? (yn.set(t, e), Cf(e).then((r) => {
    r !== e && (yn.set(t, r), r.startsWith("data:image/jpeg") && zc(t, r), Rc());
  })) : e === "" && !yn.has(t) && yn.set(t, ""), yn.has(t)) return yn.get(t);
  const n = zc(t);
  if (n != null) {
    const r = n === xb ? "" : n;
    return yn.set(t, r), r;
  }
  return B0.has(t) || (B0.add(t), dd.push(t), tu || (tu = setTimeout(() => {
    tu = void 0, F$();
  }, 1200))), "";
}
const eu = /* @__PURE__ */ new Map(), nu = /* @__PURE__ */ new Set();
function fd(t) {
  return !t || !Number.isSafeInteger(t) || t < 0 ? "" : eu.has(t) ? eu.get(t) : (nu.has(t) || (nu.add(t), fetch("/inscription/" + t, { signal: AbortSignal.timeout(2e4) }).then(async (e) => {
    var r, s, i, o;
    const n = (e.headers.get("content-type") || "").toLowerCase();
    if (!e.ok)
      throw await ((r = e.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = e.body) == null ? void 0 : s.cancel()), "/inscription/" + t) : n.includes("text/html") ? (((i = (await e.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : i[1]) ?? "").replace(/&amp;/g, "&") : (await ((o = e.body) == null ? void 0 : o.cancel()), "");
  }).then((e) => {
    eu.set(t, e), Rc();
  }).catch(() => {
    nu.delete(t);
  })), "");
}
const Ji = 12, j$ = 5e3, cn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, to = (t, e, n = "") => {
  const r = cn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function R$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", l = !1, h = Ji;
  const d = cn("div", "", "ppp-shelf-box");
  Lf(() => t.changed());
  const w = (M) => "xtrata.radio.shelf.pins.v1:" + M, g = (M) => "xtrata.radio.shelf.recent.v1:" + M, A = (M, T) => {
    try {
      return JSON.parse(t.store.get(M) || "null") ?? T;
    } catch {
      return T;
    }
  }, v = (M) => new Set(A(w(M), []).filter((T) => Number.isSafeInteger(T))), C = (M) => {
    const T = A(g(M), {}), K = {};
    for (const [z, bt] of Object.entries(T)) Number.isSafeInteger(Number(z)) && typeof bt == "number" && (K[Number(z)] = bt);
    return K;
  };
  async function U(M) {
    if (!s) {
      s = !0, i = !1;
      try {
        const T = [];
        let K = 0, z = 0;
        for (let bt = 0; bt < j$ / 100 + 1; bt++) {
          const at = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(M)}&after=${K}&limit=100`);
          if (T.push(..._$(at == null ? void 0 : at.shelf)), z = Number(at == null ? void 0 : at.total) || T.length, !(at != null && at.next) || !Number.isSafeInteger(at.next)) break;
          K = at.next;
        }
        M === e && (n = T, r = z, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const j = () => {
    o = -1 / 0;
  }, k = cn("input");
  k.type = "search", k.placeholder = "Search title, artist or #", k.setAttribute("aria-label", "Search your albums"), k.oninput = () => {
    a = k.value, h = Ji, t.changed();
  };
  const B = cn("select");
  B.setAttribute("aria-label", "Sort albums");
  for (const M of N$) {
    const T = document.createElement("option");
    T.value = M.value, T.textContent = M.label, B.append(T);
  }
  B.onchange = () => {
    c = B.value, h = Ji, t.changed();
  };
  const P = to("", () => {
    l = !l, h = Ji, t.changed();
  }, "tiny"), Y = cn("div", "", "ppp-shelf-tools");
  Y.append(k, B, P);
  const st = cn("div"), Z = cn("div");
  function q(M) {
    const T = M.step === "off" || M.step === "elsewhere" ? void 0 : M.root;
    if (T !== e && (e = T, n = [], r = 0, o = -1 / 0, h = Ji), !T || M.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && U(T), !n.length)
      return i ? (Z.replaceChildren(cn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), to("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), d.replaceChildren(Z), d) : null;
    const K = v(T), z = C(T), bt = U$(n, { query: a, sort: c, pinnedOnly: l, pins: K, recents: z });
    k.value !== a && (k.value = a), B.value = c, P.textContent = l ? "★ Pinned only" : "☆ Pinned only", P.setAttribute("aria-pressed", String(l));
    const at = [];
    if (M.slot > 0 && at.push(to("← My player", () => t.open(0), "quiet")), !bt.length) at.push(cn("p", "No album matches that.", "ppp-mute"));
    else {
      const Gt = cn("ul", "", "ppp-shelf-list");
      for (const L of bt.slice(0, h)) {
        const H = cn("li", "", L.slot === M.slot ? "now" : ""), ot = K.has(L.slot), vt = to(ot ? "★" : "☆", () => {
          const Pt = new Set(K);
          ot ? Pt.delete(L.slot) : Pt.add(L.slot), t.store.set(w(T), JSON.stringify([...Pt])), t.changed();
        }, "tiny");
        vt.setAttribute("aria-label", ot ? `Unpin ${L.player.title}` : `Pin ${L.player.title}`);
        const kt = [L.player.subtitle, `${zr(L.player).length} ${zr(L.player).length === 1 ? "song" : "songs"}`, L.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), xt = L.slot === M.slot, Pe = to(xt ? "Playing" : "Select", () => {
          t.store.set(g(T), JSON.stringify(H$({ ...z, [L.slot]: t.now() }))), t.open(L.slot);
        }, xt ? "tiny ppp-pick" : "tiny primary ppp-pick");
        Pe.disabled = xt;
        const Lt = zr(L.player)[0], It = L.player.cover ?? (Lt == null ? void 0 : Lt.id), St = It ? Sb(String(It)) : "", Ln = cn("span", "", "ppp-shelf-art");
        if (St) {
          const Pt = document.createElement("img");
          Pt.src = St, Pt.alt = "", Pt.decoding = "async", Ln.append(Pt);
        } else Ln.textContent = "💿";
        const Ze = cn("span", "", "ppp-shelf-txt");
        Ze.append(cn("span", L.player.title, "t"), cn("span", kt, "ppp-mute")), H.append(vt, Ln, Ze, Pe), Gt.append(H);
      }
      at.push(Gt), bt.length > h && at.push(to(`Show more (${bt.length - h} left)`, () => {
        h += Ji, t.changed();
      }, "quiet"));
    }
    return i && at.push(cn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), st.replaceChildren(...at), d.firstChild !== Y && d.replaceChildren(Y, st), d;
  }
  return { render: q, invalidate: j, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const M = C(e), T = [...n].filter((K) => K.player).sort((K, z) => (M[z.slot] ?? 0) - (M[K.slot] ?? 0) || z.slot - K.slot)[0];
    return T ? { slot: T.slot, title: T.player.title } : null;
  } };
}
const M0 = "http://www.w3.org/2000/svg", z$ = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function hd(t = "", e = !1) {
  const n = document.createElementNS(M0, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), t && n.setAttribute("class", t);
  for (const [r, s] of z$) {
    const i = document.createElementNS(M0, "path");
    i.setAttribute("fill-rule", "evenodd"), i.setAttribute("fill", e ? "currentColor" : r), i.setAttribute("d", s), n.append(i);
  }
  return n;
}
const te = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Qs = (t, e, n, r = !1) => {
  const s = te("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Eb = (t) => t.toLocaleString(), N0 = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, G$ = (t) => t === "gift" || t === "new" ? 1 : t === "arriving" ? 2 : t === "landed" ? 3 : -1;
function Ab(t, e) {
  const n = te("ol", "al-steps");
  return n.setAttribute("aria-label", e >= t.length ? "All steps done" : `Step ${e + 1} of ${t.length}: ${t[e]}`), t.forEach((r, s) => {
    const i = te("li", s < e ? "is-done" : s === e ? "is-now" : "");
    i.append(te("i", "", s < e ? "✓" : String(s + 1)), te("span", "", r)), n.append(i);
  }), n;
}
function K$() {
  const t = te("div", "tier-disc tier-disc--mid");
  return t.dataset.tier = "mystery", t.setAttribute("role", "img"), t.setAttribute("aria-label", "A player waiting to be opened"), t.append(te("span", "tier-disc__mark", "?")), t;
}
const V$ = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], Hr = {
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
}, q$ = (t, e, n = !1) => n ? `${e || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${e || "Xtrata Music"} has covered ${t ? `${Eb(t)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, Y$ = (t) => t ? `Your player holds ${Eb(t)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", X$ = (t) => t ? `You got a ${t.name} player` : Hr.landed.title;
function W$(t, e = !0) {
  const n = te("div", "tier-disc" + (e ? " tier-disc--big" : ""));
  return n.dataset.tier = t.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${t.name} player`), n.append(te("span", "tier-disc__mark", t.mark)), n;
}
function Z$(t) {
  const e = document.documentElement;
  let n = !1;
  const r = () => {
    const s = te("ul", "al-welcome-points");
    for (const [i, o, a] of V$) {
      const c = te("li");
      c.title = o;
      const l = te("em", "", a);
      l.setAttribute("aria-hidden", "true"), c.append(l, te("b", "", i), te("span", "", o)), s.append(c);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, i = !1) {
      var d;
      if (!s) {
        n && !i && (t.hidden = !0, t.replaceChildren(), delete e.dataset.view, delete e.dataset.asking), n = !1, delete e.dataset.welcome;
        return;
      }
      n = !0, e.dataset.view = "album", e.dataset.welcome = s.mode, s.asking ? e.dataset.asking = "1" : delete e.dataset.asking;
      const o = te("header", "al-top"), a = te("a", "al-brand");
      a.href = "/radio", a.append(hd("al-logo"), te("span", "", "Xtrata "), te("b", "", "Music")), o.append(a);
      const c = te("div", "al-body al-body--welcome"), l = te("div", "al-welcome"), h = s.mode;
      if (h === "checking")
        l.append(te("p", "al-welcome-wait", Hr.checking));
      else {
        const w = G$(h);
        if (w >= 0 && l.append(Ab(h === "new" ? N0.fresh : N0.gift, w)), s.tier && (h === "landed" || h === "back" || h === "empty") ? l.append(W$(s.tier)) : h === "gift" || h === "arriving" ? l.append(K$()) : h === "new" && l.append(hd("al-hero-mark")), l.append(te("h1", "", h === "landed" ? X$(s.tier) : h === "back" && s.tier ? `Your ${s.tier.name} player` : Hr[h].title)), l.append(te("p", "", h === "gift" ? q$(s.plays, s.from, s.mystery) : h === "landed" ? Y$(s.plays) : Hr[h].body)), (h === "landed" || h === "gift") && l.append(r()), s.status.length) {
          const g = te("div", "al-status");
          g.setAttribute("role", "status"), g.append(...s.status), l.append(g);
        }
        if (s.asking) l.append(te("p", "al-hint al-hint--ask", Hr.asking));
        else if (h === "gift" || h === "new" || h === "back") {
          const g = Hr[h];
          s.canStart && l.append(Qs("al-primary", g.primary, h === "back" ? s.unlock : s.start, s.busy), te("p", "al-hint", g.hint)), s.canStart && l.append(Qs("al-link", g.returning, s.returning, s.busy)), l.append(Qs("al-link", g.full, s.full));
        } else if (h === "landed") {
          if (l.append(Qs("al-primary", Hr.landed.primary, s.full)), (d = s.albums) != null && d.length) {
            l.append(te("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const g of s.albums) {
              const A = Qs("al-album", "", g.run);
              if (g.cover) {
                const C = te("img", "al-album__art");
                C.src = g.cover, C.alt = "", A.classList.add("al-album--art"), A.append(C);
              }
              const v = te("span", "al-album__t");
              v.append(te("b", "", g.title), te("span", "", g.by)), A.append(v), l.append(A);
            }
          }
        } else h === "empty" && l.append(Qs("al-primary", Hr.empty.primary, s.restock), Qs("al-link", Hr.empty.full, s.full));
      }
      c.append(l), t.hidden = !1, t.replaceChildren(o, c);
    }
  };
}
const Q$ = 20, J$ = ["Album", "Passkey", "Listen"], Je = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Be = {
  grid: Je('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Je('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Je('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Je('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Je('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Je('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Je('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Je('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Je('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Je('<path d="M6 9l6 6 6-6"/>', 18),
  right: Je('<path d="M9 6l6 6-6 6"/>', 16),
  close: Je('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Je('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Je('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Je('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Je('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Je('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const an = (t, ...e) => Q("button", { type: "button", ...t }, ...e), ec = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Ko = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, tI = { music: "My music", device: "This device", gifts: "Albums (admin)" }, eI = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function _0(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement;
  function c(y) {
    var M, T, K;
    if (!y || !Number.isSafeInteger(y)) return "";
    const $ = (K = (T = (M = e.radio()) == null ? void 0 : M.getState) == null ? void 0 : T.call(M)) == null ? void 0 : K.albumCover;
    return $ != null && $.url && Number($.tokenId) === y ? $.url : fd(y);
  }
  Lf(() => q());
  function l(y) {
    var M;
    i = y, y ? a.dataset.sheet = y : delete a.dataset.sheet;
    const $ = document.querySelector(".side");
    if (y && y !== "more") {
      for (const z of eI[y]) {
        const bt = $ == null ? void 0 : $.querySelector(z);
        bt && (bt.open = !0);
      }
      const T = document.getElementById("sheetTitle");
      T && (T.textContent = tI[y]);
      const K = document.getElementById("sheetExtra");
      K && K.replaceChildren(...y === "music" ? [d()] : []), (M = $ == null ? void 0 : $.scrollTo) == null || M.call($, { top: 0 });
    }
    q();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => l("")), r || document.addEventListener("keydown", (y) => {
    y.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const d = () => an(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: Be.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: Be.right })
  );
  let w = null, g = !1;
  const A = () => {
    var $;
    const y = e.radio();
    g || !(y != null && y.subscribe) || (g = !0, y.subscribe((M) => {
      w = M, (s == null ? void 0 : s.mode) === "open" && q();
    }), w = (($ = y.getState) == null ? void 0 : $.call(y)) ?? null);
  };
  r || setInterval(() => {
    var T, K;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const y = (K = (T = e.radio()) == null ? void 0 : T.getPosition) == null ? void 0 : K.call(T), $ = t.querySelector(".al-bar > i"), M = t.querySelectorAll(".al-times span");
    !y || !$ || ($.style.width = y.duration ? `${Math.min(100, y.current / y.duration * 100)}%` : "0%", M.length === 2 && (M[0].textContent = ec(y.current || 0), M[1].textContent = y.duration ? ec(y.duration) : "–:––"));
  }, 500);
  let v = "", C = null;
  function U(y, $, M = {}) {
    const T = M.song || c(y.cover), z = [T ? Q("img", { src: T, alt: M.song ? "Song artwork" : `${y.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, y.title), y.subtitle ? Q("span", {}, y.subtitle) : null), M.paused ? Q("span", { class: "al-paused" }, Q("i", { html: Be.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], bt = "al-cover" + ($ ? "" : " al-cover--small") + (M.paused ? " is-paused" : "");
    return M.flip ? (z.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: Be.flip })), an({ class: bt + " is-flippable", "aria-label": M.flipped ? "Show this song’s artwork" : `Show the ${y.title} cover`, onClick: M.flip }, ...z)) : Q("div", { class: bt }, ...z);
  }
  function j(y) {
    return y.plays === null || y.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, y.playsComing ? "Plays on their way…" : "…") : y.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, y.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (y.plays <= Q$ ? " al-chip--low" : "") }, `${Ko(y.plays, "play", "plays")} left`);
  }
  function k(y) {
    const $ = y.player, M = $.tracks.filter((K) => !K.hidden), T = [];
    return y.step !== void 0 && T.push(Ab(J$, y.step)), y.mode === "arrive" && y.from && T.push(Q("p", { class: "al-from" }, Q("span", { html: Be.gift }), Q("span", {}, Q("b", {}, y.from), " sent you an album"))), T.push(U($, !0)), T.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, $.title),
      $.subtitle ? Q("p", { class: "al-artist" }, $.subtitle) : null,
      M.length ? Q("p", { class: "al-songline" }, M.map((K) => K.title || `#${K.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [Ko(M.length, "song", "songs"), y.offered ? Ko(y.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), y.status.length && T.push(Q("div", { class: "al-status", role: "status" }, ...y.status)), T.push(Q("div", { class: "al-grow" })), y.asking ? T.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : y.primary && T.push(an({ class: "al-primary", onClick: y.primary.run, disabled: y.busy }, Q("span", { html: Be.playSmall }), y.primary.label)), y.hint && !y.asking && T.push(Q("p", { class: "al-hint" }, y.hint)), y.secondary && !y.asking && T.push(an({ class: "al-link", onClick: y.secondary.run, disabled: y.busy }, y.secondary.label)), T;
  }
  function B(y, $) {
    const { songs: M, current: T, started: K, own: z, out: bt, waiting: at } = $, Gt = y.player, L = e.radio(), H = [];
    H.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, Gt.title), ` · ${Ko(M.length, "song", "songs")}`), j(y)));
    const ot = c(Gt.cover), vt = "album:" + Gt.cover;
    ot && !yn.has(vt) && (yn.set(vt, ot), Cf(ot).then((xt) => {
      xt !== ot && (yn.set(vt, xt), q());
    }));
    const kt = ot ? yn.get(vt) || ot : "";
    return H.push(Q("ol", { class: "al-tracks" }, ...M.map((xt, Pe) => {
      const Lt = String(xt.id) === T, It = Sb(String(xt.id), Lt && K ? z : void 0);
      return Q("li", {}, an(
        { class: "al-track" + (Lt ? " is-on" : ""), "aria-label": `Play ${xt.title || "#" + xt.id}`, "aria-current": Lt ? "true" : void 0, disabled: bt || at, onClick: () => {
          var St;
          return (St = L == null ? void 0 : L.playToken) == null ? void 0 : St.call(L, xt.id);
        } },
        Q(
          "span",
          { class: "al-th" + (It ? "" : " is-blank") },
          It ? Q("img", { src: It, alt: "", decoding: "async" }) : kt ? Q("img", { src: kt, alt: "", decoding: "async" }) : null,
          It ? null : Q("span", { class: "al-n" }, String(Pe + 1)),
          Lt ? Q("span", { class: "al-eq", html: Be.eq }) : null
        ),
        Q("span", { class: "al-tt" }, xt.title || `#${xt.id}`, xt.explicit ? Q("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), H;
  }
  function P(y) {
    var It;
    const $ = y.player, M = $.tracks.filter((St) => !St.hidden), T = e.radio(), K = w == null ? void 0 : w.nowPlaying, z = K && $.tracks.some((St) => String(St.id) === String(K.tokenId)) ? String(K.tokenId) : null, bt = z ? $.tracks.find((St) => String(St.id) === z) : null, at = y.plays === 0 && !y.playsComing, Gt = !!y.playsComing && !y.plays, L = !!(w != null && w.playing) && !!z, H = w == null ? void 0 : w.heart, ot = z ? (It = T == null ? void 0 : T.getPosition) == null ? void 0 : It.call(T) : null;
    z && (L || ((ot == null ? void 0 : ot.current) ?? 0) > 0.5) && (v = $.id);
    const vt = !!z && v === $.id;
    C && C !== z && (C = null);
    const kt = vt ? String((K == null ? void 0 : K.cover) || "") : "", xt = !!kt && C === z, Lt = [U($, !at, { song: xt ? "" : kt, paused: vt && !L, flip: kt ? () => {
      C = C === z ? null : z, q();
    } : void 0, flipped: xt })];
    if (Lt.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, bt ? bt.title || (K == null ? void 0 : K.title) || `#${bt.id}` : $.title),
        Q("div", { class: "al-artist" }, bt ? bt.artist || (K == null ? void 0 : K.artist) || $.subtitle : $.subtitle || "Press play")
      ),
      z ? an({ class: "al-icon" + (H != null && H.liked ? " is-on" : ""), "aria-label": H != null && H.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(H != null && H.liked)), disabled: !!(H != null && H.pending) || !!(H != null && H.locked) || Gt, onClick: () => {
        var St;
        return (St = T == null ? void 0 : T.toggleLike) == null ? void 0 : St.call(T);
      }, html: H != null && H.liked ? Be.heartOn : Be.heart }) : null
    )), at)
      Lt.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        Y(y, !0)
      ));
    else {
      const St = ot != null && ot.duration ? Math.min(100, ot.current / ot.duration * 100) : 0;
      Lt.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${St}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, ec((ot == null ? void 0 : ot.current) || 0)), Q("span", {}, ot != null && ot.duration ? ec(ot.duration) : "–:––"))
      ));
    }
    return Lt.push(Q(
      "div",
      { class: "al-ctl" + (at || Gt ? " is-off" : "") },
      an({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: at || Gt, onClick: () => {
        var St;
        return (St = T == null ? void 0 : T.prev) == null ? void 0 : St.call(T);
      }, html: Be.prev }),
      an({ class: "al-play", "aria-label": L ? "Pause" : "Play", disabled: at || Gt, onClick: () => {
        var St;
        return (St = T == null ? void 0 : T.playPause) == null ? void 0 : St.call(T);
      }, html: L ? Be.pause : Be.play }),
      an({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: at || Gt, onClick: () => {
        var St;
        return (St = T == null ? void 0 : T.next) == null ? void 0 : St.call(T);
      }, html: Be.next })
    )), y.status.length && Lt.push(Q("div", { class: "al-status", role: "status" }, ...y.status)), Lt.push(...B(y, { songs: M, current: z, started: vt, own: kt, out: at, waiting: Gt })), Lt.push(Q("div", { class: "al-grow" })), Lt.push(an(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: Be.down })
    )), Lt;
  }
  function Y(y, $) {
    const M = Q("div", { class: "al-topups" + ($ ? " al-topups--primary" : "") }), T = $ ? [y.topUps[1] ?? y.topUps[0]] : [...y.topUps];
    for (const K of T) {
      const z = y.myPlays !== void 0 && y.myPlays >= K && !y.playsComing && !y.busy;
      M.append(an({ class: "al-topup", disabled: !z, onClick: () => e.topUp(K) }, $ ? `Add ${K.toLocaleString()} plays` : `+${K.toLocaleString()}`));
    }
    return $ && M.append(an({ class: "al-link", onClick: () => l("more") }, "Other amounts")), M;
  }
  function st(y) {
    const $ = y.myPlays !== void 0 && y.myPlays >= (y.topUps[0] ?? 0), M = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${y.player.title}`), Q("span", { class: "al-mono" }, y.plays === null || y.plays === void 0 ? "" : `${y.plays.toLocaleString()} left`)),
      Y(y, !1),
      Q("p", { class: "al-mute al-small" }, y.playsComing ? "Plays are on their way. Add more once they arrive." : y.myPlays === void 0 ? "Checking My player…" : $ ? `Moved from My player · ${Ko(y.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !$ && !y.playsComing && y.myPlays !== void 0 ? an({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), T = (z, bt, at, Gt) => an(
      { class: "al-row", onClick: Gt },
      Q("span", { class: "al-row-i", html: z }),
      Q("span", { class: "al-row-t" }, Q("b", {}, bt), Q("small", {}, at)),
      Q("span", { class: "al-row-go", html: Be.right })
    ), K = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      T(Be.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, q();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), an({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: Be.close })),
      y.mode === "open" ? M : null,
      Q(
        "div",
        { class: "al-rows" },
        T(Be.grid, "My music", "Your albums and the radio", () => l("music")),
        T(Be.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        y.canMake ? T(Be.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        T(Be.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        K
      )
    );
  }
  function Z(y) {
    var at, Gt;
    const $ = y.player, M = w == null ? void 0 : w.nowPlaying, T = M && $.tracks.some((L) => String(L.id) === String(M.tokenId)) ? String(M.tokenId) : null, K = !!(w != null && w.playing) && !!T, z = T ? (Gt = (at = e.radio()) == null ? void 0 : at.getPosition) == null ? void 0 : Gt.call(at) : null;
    T && (K || ((z == null ? void 0 : z.current) ?? 0) > 0.5) && (v = $.id);
    const bt = !!T && v === $.id;
    return B(y, {
      songs: $.tracks.filter((L) => !L.hidden),
      current: T,
      started: bt,
      own: bt ? String((M == null ? void 0 : M.cover) || "") : "",
      out: y.plays === 0 && !y.playsComing,
      waiting: !!y.playsComing && !y.plays
    });
  }
  function q() {
    const y = s;
    if (r) {
      if (!y || y.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      A(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...Z(y));
      return;
    }
    if (!y) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    A(), t.hidden = !1;
    const $ = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, hd("al-logo"), "Xtrata ", Q("b", {}, "Music")),
      y.mode === "open" ? an({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: Be.grid }) : null
    ), M = Q("div", { class: "al-body al-body--" + y.mode }, ...y.mode === "open" ? P(y) : k(y));
    t.replaceChildren($, M, ...i === "more" ? [Q("div", { class: "al-scrim", onClick: () => l("") }), st(y)] : []);
  }
  return {
    render(y) {
      if (r) {
        s = y, q();
        return;
      }
      const $ = !!s;
      s = y, !y && ($ || i) && (i = "", delete a.dataset.sheet), y ? a.dataset.view = "album" : delete a.dataset.view, y != null && y.asking ? a.dataset.asking = "1" : delete a.dataset.asking, q();
    },
    sheet: () => i,
    setSheet: l
  };
}
const nI = [
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
function rI(t) {
  for (const [e, n] of nI) if (n.test(t)) return e;
  return null;
}
const vb = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), kb = (t) => /Android/.test(t);
function sI(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : vb(e) ? "x-safari-" + n.href : kb(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const iI = (t) => vb(t) ? "Safari" : kb(t) ? "Chrome" : "your browser", eo = "Xtrata Music Wallet", oI = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function P0(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: eo, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const l = t.standIn === c && oI.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${eo} · ${e(c)}`,
      detail: l ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: eo, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: eo, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: eo, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: eo, detail: "Open on this device." });
    }
  return r;
}
const ru = "xtrata.radio.novice", $b = "xtrata.radio.novice.previewed.v1", U0 = 6 * 6e4;
function aI(t, e) {
  let n = null;
  try {
    const r = new URLSearchParams(t).get("novice");
    if (r === "1" || r === "preview")
      e.set(ru, r), n = r;
    else {
      if (r === "0")
        return e.set(ru, null), { on: !1, preview: !1 };
      n = e.get(ru);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const cI = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, H0 = (t) => cI.test(t ?? ""), lI = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, uI = {
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
}, dI = (t, e) => uI[t] ?? e;
function fI(t, e) {
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
const hI = "Make your player once, with Face ID or your fingerprint, and the music starts.", pI = "Checking your player…", pd = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Ib(t) {
  try {
    const e = JSON.parse(t.get($b) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function gI(t, e) {
  const n = Ib(t).filter((r) => r !== e);
  n.push(e), t.set($b, JSON.stringify(n.slice(-50)));
}
function su(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...pd(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : pd();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > U0 ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > U0 ? { ...t, phase: "done" } : t;
  }
}
const nc = (t) => t.phase === "open" || t.phase === "playing";
function yI(t = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: t.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: t.sbtc === !0 }
  ];
}
const wI = [100, 250, 500, 1e3], bI = (t, e = lr) => BigInt(t) * un(e);
function mI(t, e = lr, n = 0n) {
  const r = Fr - t - n;
  return r > 0n ? Number(r / un(e)) : 0;
}
function xI(t, e = lr, n = 0n) {
  const r = t === void 0 ? 0 : mI(t, e, n);
  return wI.map((s) => ({ plays: s, stx: bI(s, e), fits: t !== void 0 && s <= r }));
}
const SI = {
  microSTX: (t) => `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (t) => `${t.toLocaleString("en-GB")} sats`,
  pence: (t) => `£${t / 100n}.${(t % 100n).toString().padStart(2, "0")}`
}, EI = (t) => SI[t.unit](t.amount), ke = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, fc = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`;
function AI(t) {
  if (!t || t.plays < 1) return "";
  const e = [`paid for ${fc(t.plays, "play", "plays")}${t.artists > 0 ? ` to ${fc(t.artists, "artist", "artists")}` : ""}`];
  return t.likes > 0 && e.push(`saved ${fc(t.likes, "like", "likes")}`), `So far your player has ${e.join(" and ")}, all on the public record.`;
}
function vI(t) {
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
    const a = xI(o.balance, o.fee, o.incoming);
    s(a);
    const c = yI(o.switches);
    (g = c.find((A) => A.id === r)) != null && g.on || (r = "stx");
    const l = [], h = ke("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", l.push(h), l.push(ke("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${fc(o.playsLeft, "play", "plays")} left.`));
    const d = AI(o.done);
    if (d && l.push(ke("p", "ppp-restock__done", d)), o.arriving)
      l.push(ke("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      l.push(ke("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((A) => A.fits))
      l.push(ke("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const A = ke("div", "ppp-restock__packs");
      A.setAttribute("role", "group"), A.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const j = ke("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        j.type = "button", j.disabled = !U.fits, j.setAttribute("aria-pressed", String(U.plays === n)), j.append(ke("b", "", U.plays.toLocaleString()), ke("span", "", "plays")), j.onclick = () => {
          n = U.plays, i();
        }, A.append(j);
      }
      l.push(A);
      const v = ke("div", "ppp-restock__ways");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const j = ke("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        j.type = "button", j.disabled = !U.on, j.setAttribute("aria-pressed", String(U.id === r)), j.append(ke("b", "", U.label), ke("span", "", U.on ? U.blurb : "Soon")), j.onclick = () => {
          r = U.id, i();
        }, v.append(j);
      }
      l.push(v);
      const C = a.find((U) => U.plays === n);
      if (C && r === "stx") {
        const U = ke("div", "ppp-restock__pay"), j = EI({ unit: "microSTX", amount: C.stx }), k = ke("p", "ppp-restock__amount");
        k.append("Send ", ke("b", "", j), " to your player:"), U.append(k, ke("p", "ppp-addr-full ppp-restock__addr", o.address));
        const B = ke("div", "ppp-restock__row");
        B.append(t.copyButton("restock-address", "Copy address", () => o.address, "primary"), t.copyButton("restock-amount", "Copy amount", () => rr(C.stx), "")), U.append(B), U.append(ke("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${o.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), l.push(U);
      }
    }
    l.push(ke("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = ke("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => e == null ? void 0 : e.close(), l.push(w), e.replaceChildren(...l);
  }
  return {
    isOpen: () => !!e,
    open() {
      if (e || !t.input()) return;
      e = ke("dialog", "ppp-connect ppp-restock"), e.setAttribute("aria-labelledby", "ppp-restock-title");
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
const Gr = (t) => t.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), kI = (t) => !t || /^(?:Inscription )?#\d+$/.test(t.trim());
function $I(t, e) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(t) ? t : []) {
    const i = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(i) || i < 0 || n.has(i)) continue;
    n.add(i);
    const o = e(i, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: i, title: kI(o.title) ? `#${i}` : o.title.trim(), artist: (o.artist || "").trim() });
  }
  return r.sort((s, i) => s.id - i.id);
}
function II(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n.artist) continue;
    const r = Gr(n.artist), s = e.get(r);
    s ? s.songs++ : e.set(r, { name: n.artist, songs: 1 });
  }
  return [...e.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function LI(t, e, n = "", r = 60) {
  const s = Gr(e).split(/\s+/).filter(Boolean), i = Gr(n);
  if (!s.length && !i) return { songs: [], total: 0 };
  const o = [];
  for (const a of t) {
    const c = Gr(a.artist), l = Gr(a.title), h = String(a.id);
    if (i && c !== i) continue;
    let d = 0, w = !0;
    for (const g of s) {
      const A = g.replace(/^#/, "");
      if (l.includes(g)) d += l.startsWith(g) ? 0 : 1;
      else if (/^\d+$/.test(A) && h === A) d += 0;
      else if (c.includes(g)) d += 2;
      else if (/^\d+$/.test(A) && h.startsWith(A)) d += 3;
      else {
        w = !1;
        break;
      }
    }
    w && o.push({ s: a, rank: d });
  }
  return o.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: o.slice(0, r).map((a) => a.s), total: o.length };
}
const Jn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, O0 = 12;
function CI(t, e) {
  let n = null, r = "idle", s = "", i = "", o = !1;
  const a = Jn("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = Jn("div", "hint"), l = Jn("div", "find-artists"), h = Jn("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = Jn("div", "likesTools");
  d.append(a), t.replaceChildren(d, c, l, h), a.oninput = () => {
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
    const v = II(n), C = o ? v : v.slice(0, O0), U = (B, P, Y, st = "") => {
      const Z = Jn("button", "find-chip" + (P ? " is-on" : ""), B);
      return Z.type = "button", Z.setAttribute("aria-pressed", String(P)), st && (Z.title = st), Z.onclick = Y, Z;
    };
    l.replaceChildren(
      ...C.map((B) => U(`${B.name} · ${B.songs}`, Gr(B.name) === Gr(i), () => {
        i = Gr(B.name) === Gr(i) ? "" : B.name, g();
      }, `Show ${B.name}’s ${B.songs === 1 ? "song" : `${B.songs} songs`}`)),
      ...v.length > O0 ? [U(o ? "Fewer artists" : `All ${v.length} artists`, !1, () => {
        o = !o, g();
      })] : []
    );
    const j = LI(n, s, i), k = e.current();
    h.replaceChildren(...j.songs.map((B) => {
      var st;
      const P = Jn("li", "lrow" + (B.id === k ? " now" : "")), Y = Jn("button", "lt", B.title);
      if (Y.type = "button", Y.title = `Play “${B.title}”${B.artist ? ` by ${B.artist}` : ""}`, Y.onclick = () => e.play(B.id), (st = e.explicit) != null && st.call(e, B.id)) {
        const Z = Jn("span", "exp", "E");
        Z.title = "Explicit lyrics: only plays when you choose it", Y.append(" ", Z);
      }
      return P.append(Y, Jn("span", "find-by", `${B.artist ? B.artist + " · " : ""}#${B.id}`)), P;
    })), c.textContent = !s.trim() && !i ? `${n.length.toLocaleString()} songs by ${v.length.toLocaleString()} artists. Search, or pick an artist.` : j.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : j.total > j.songs.length ? `Showing ${j.songs.length} of ${j.total.toLocaleString()}. Type more to narrow it down.` : `${j.total} ${j.total === 1 ? "song" : "songs"}${i ? ` by ${i}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: g };
}
const na = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], D0 = (t) => typeof t == "string" && na.some((e) => e.id === t), F0 = (t) => na.find((e) => e.id === t), TI = (t) => na.find((e) => t >= e.min) ?? na[na.length - 1];
function BI(t, e = lr) {
  return TI(t <= De ? 0 : Number((t - De) / un(e)));
}
const MI = (t, e, n) => Cd(Md(new TextEncoder().encode(`xtrata-music-hero:${t}:${e}:${n}`))).slice(0, 8), j0 = document.getElementById("ppp");
j0 && NI(j0);
function NI(t) {
  var Ce;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = tm(), s = (u) => t.querySelector(u), i = s(".ppp-frame");
  let o = null;
  const a = async (u, b) => {
    const m = await fetch(u, { cache: "no-store", ...b, signal: AbortSignal.timeout(15e3) }), f = await m.json().catch(() => ({}));
    if (!m.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${m.status}).`);
    return f;
  }, c = B5({
    now: Date.now,
    main: () => {
      const u = r.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    config: (u) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(u || "")),
    links: async (u) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(u))).links ?? [],
    mainOf: async (u) => {
      var m;
      const b = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(u))).links;
      return ((m = b == null ? void 0 : b.find((f) => f.listening === u)) == null ? void 0 : m.main) ?? null;
    },
    saveLink: async (u) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(u) });
    },
    bridge: async (u) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${u}; publickey-credentials-create ${u}`), o.referrerPolicy = "no-referrer";
      const b = new Promise((et, lt) => {
        o.addEventListener("load", () => et(), { once: !0 }), setTimeout(() => lt(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = u + "/", i.replaceChildren(o), await b;
      const m = new Kb({ walletOrigin: u, frame: o, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), O = (et, lt) => f.has(et) ? m.request(et, lt) : Promise.race([
        m.request(et, lt),
        new Promise((pt, zt) => setTimeout(() => zt(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await O("listening.status"), { request: O };
    },
    chain: {
      verify: u5,
      balance: f5,
      account: d5,
      owner: h5,
      broadcast: p5,
      transaction: g5,
      confirmedNonce: async (u) => {
        const b = await Us(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(b == null ? void 0 : b.nonce) || b.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(b.nonce);
      }
    },
    signWithMain: (u, b) => c0({ ...b, network: "mainnet", stxAddress: u }),
    deposit: (u, b, m) => new Promise((f, O) => r0({
      recipient: b,
      amount: m.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new iu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (et) => f(et.txId || ""),
      onCancel: () => O(new Error("Deposit cancelled. Nothing was sent.")),
      onError: O
    })),
    validate: y5,
    tabLock: (u) => new Promise((b) => {
      const m = navigator.locks;
      if (!(m != null && m.request)) {
        b(!0);
        return;
      }
      m.request("xtrata-ppp:" + u, { ifAvailable: !0 }, async (f) => {
        b(!!f), f && await new Promise(() => {
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
      set: (u, b) => {
        try {
          localStorage.setItem(u, b);
        } catch {
        }
      }
    },
    changed: () => ue(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var b, m;
      return l.funder(u, () => E5(u, Us), !!((m = (b = c.snapshot().gate) == null ? void 0 : b.gifts) != null && m.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (u) => {
      const b = await a("/radio/gift/for?wallet=" + encodeURIComponent(u)), m = b == null ? void 0 : b.gift;
      if (!m) return null;
      if (typeof m.returnTo != "string" || typeof m.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: m.returnTo, from: typeof m.from == "string" ? m.from : null, source: String(m.source ?? ""), amount: String(m.amount ?? "0"), treasury: m.treasury, state: m.state === "sending" ? "sending" : "arrived", player: m.player ?? null };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (u) => {
      const b = await a("/radio/awards/status?address=" + encodeURIComponent(u));
      if (typeof (b == null ? void 0 : b.state) != "string") throw new Error("Unreadable award status.");
      return b;
    },
    awardName: async (u) => {
      const b = await a("/radio/awards/name?address=" + encodeURIComponent(u));
      if ((b == null ? void 0 : b.name) !== null && typeof (b == null ? void 0 : b.name) != "string") throw new Error("Unreadable name.");
      return b.name;
    },
    awardNote: async (u, b) => {
      const m = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: u, name: b }) });
      if (typeof (m == null ? void 0 : m.record) != "string" || typeof (m == null ? void 0 : m.signature) != "string" || !Number.isSafeInteger(m == null ? void 0 : m.cls) || !Number.isSafeInteger(m == null ? void 0 : m.number) || !Number.isSafeInteger(m == null ? void 0 : m.plays)) throw new Error("Unreadable award note.");
      return { cls: m.cls, number: m.number, plays: m.plays, record: m.record, signature: m.signature, name: typeof m.name == "string" ? m.name : null };
    },
    history: (u, b) => k5(u, (m) => Us(m), b),
    likesChanged: () => {
      var u, b;
      (b = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || b.call(u);
    },
    likeState: async (u, b) => {
      const m = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: u, ids: String(b) })), f = Array.isArray(m == null ? void 0 : m.rows) ? m.rows.find((O) => (O == null ? void 0 : O.id) === b) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((O) => typeof O == "string") : f.liked ? [u] : [] };
    },
    likeSent: (u, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: u, liked: b } })),
    nameOf: (u) => Zt(u) ?? void 0,
    likeConfirmed: (u, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: u, liked: b } })),
    likeFailed: (u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: u } }))
  }), l = M$({
    json: a,
    main: () => {
      const u = r.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, b, m, f) => new Promise((O, et) => r0({
      recipient: b,
      amount: m.toString(),
      memo: f,
      stxAddress: u,
      network: new iu(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (lt) => O(lt.txId || ""),
      onCancel: () => et(new Error("Gift cancelled. Nothing was sent.")),
      onError: et
    })),
    sign: (u, b) => c0({ ...b, network: "mainnet", stxAddress: u }),
    giftSent: (u, b) => c.giftSent(u, b),
    claiming: (u) => c.giftClaiming(u),
    album: { bind: (u) => c.bindAlbum(u), arrived: async (u, b, m, f) => {
      h.invalidate(), await c.albumArriving(u, b, m, f);
    } },
    who: (u) => tt(u),
    changed: () => ue(c.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, b) => {
        try {
          b === null ? localStorage.removeItem(u) : localStorage.setItem(u, b);
        } catch {
        }
      }
    },
    now: Date.now
  }), h = R$({
    json: a,
    open: (u) => {
      c.openAlbum(u);
    },
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, b) => {
        try {
          b === null ? localStorage.removeItem(u) : localStorage.setItem(u, b);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => ue(c.snapshot())
  }), d = {
    get: (u) => {
      try {
        return localStorage.getItem(u);
      } catch {
        return null;
      }
    },
    set: (u, b) => {
      try {
        b === null ? localStorage.removeItem(u) : localStorage.setItem(u, b);
      } catch {
      }
    }
  }, w = aI(location.search, d);
  w.on && (document.documentElement.dataset.novice = w.preview ? "preview" : "1");
  const g = (u) => w.on && u.solo, A = w.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), v = A ? document.getElementById("album") : null, C = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (u) => void c.topUpAlbum(u),
    openPlayer: () => void c.openAlbum(0)
  }, U = v ? _0(v, C) : null, j = "xtrata.radio.tier.v1";
  let k = (() => {
    const u = d.get(j);
    return D0(u) ? F0(u) : null;
  })();
  const B = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function P(u) {
    var O;
    if (u.listening && u.slot === 0 && ["fund", "ready", "over"].includes(u.step) && !(u.gift && u.gift.drop === void 0)) {
      let et = null;
      try {
        et = u.gift && !u.gift.player && u.gift.drop === "players" ? BI(BigInt(u.gift.amount)) : null;
      } catch {
        et = null;
      }
      ((O = u.award) == null ? void 0 : O.state) === "claimed" && u.award.holds === !1 && (et = null), ((et == null ? void 0 : et.id) ?? null) !== ((k == null ? void 0 : k.id) ?? null) && (k = et, d.set(j, et ? et.id : null));
    }
    const b = document.documentElement;
    k ? b.dataset.tier = k.id : delete b.dataset.tier;
    const m = document.querySelector("#ppp .ppp-head h3");
    if (!m) return;
    let f = m.querySelector(".ppp-tier");
    if (!k) {
      f == null || f.remove();
      return;
    }
    f || (f = S("span", "", "ppp-tier"), m.append(f)), f.dataset.tier = k.id, f.textContent = `${k.mark} ${k.name.toUpperCase()} PLAYER`, f.title = `A ${k.name} player from the Xtrata Music giveaway`;
  }
  const Y = w.on && v ? Z$(v) : null, st = Date.now();
  let Z = !1, q = null, y = (() => {
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
    ue(c.snapshot());
  }, M = (u, b) => {
    var O;
    if (!Y || b || y) return null;
    if (!u.gate || u.step === "loading" || (Z = !0), !Z) return Date.now() - st < 1e4 ? "checking" : null;
    if (!g(u)) return null;
    if (u.step === "intro" || u.step === "unsupported") return l.incomingStarter() ? "gift" : "new";
    if (u.step === "locked") return "back";
    const f = u.slot === 0 && !((O = u.gift) != null && O.player) && !u.entries.some((et) => et.kind === "play");
    return u.step === "fund" && f ? u.depositPending ? "arriving" : "empty" : u.step === "ready" && f && (q === "arriving" || q === "landed") ? "landed" : u.step === "loading" && q !== "checking" ? q : null;
  };
  let T = !1;
  function K(u, b, m = [], f) {
    if (!Y) return;
    const O = f !== void 0 ? f : M(u, b);
    if (q = O, delete document.documentElement.dataset.noviceBoot, !O) {
      Y.render(null, b);
      return;
    }
    const et = [...m];
    O === "arriving" && u.arrival && et.push(gn(u.arrival)), u.step === "unsupported" ? et.push(S("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : u.error && et.push(S("p", u.error, "ppp-warn"));
    const lt = O === "gift" ? l.incomingStarter() : null;
    lt && !T && u.step === "intro" && !u.busy && !u.armed && !u.error && !Vt && (T = !0, c.create({ quick: !0 })), Y.render({
      mode: O,
      status: et,
      asking: !!u.busy || u.armed,
      busy: !!u.busy,
      canStart: (u.step === "intro" || u.step === "locked") && !Vt,
      plays: lt ? lt.plays : O === "landed" ? u.playsLeft : null,
      from: (lt == null ? void 0 : lt.from) ?? null,
      tier: k,
      mystery: B,
      albums: O === "landed" ? It.map((pt) => ({ title: pt.title, by: pt.subtitle, cover: fd(pt.cover), run: () => {
        $(), he(pt, !0);
      } })) : [],
      start: () => void c.create({ quick: !!l.incomingStarter() }),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => at(),
      full: () => {
        var ve, jt, p;
        const pt = window.XtrataRadio, zt = O === "landed" && !((jt = (ve = pt == null ? void 0 : pt.getState) == null ? void 0 : ve.call(pt)) != null && jt.playing);
        $(), zt && ((p = pt == null ? void 0 : pt.playPause) == null || p.call(pt));
      }
    });
  }
  Y && setTimeout(() => {
    Z || ue(c.snapshot());
  }, 10100), Lf(() => {
    (Y != null && Y.showing() || document.documentElement.dataset.asking) && ue(c.snapshot());
  });
  const bt = vI({
    input: () => {
      var O, et, lt, pt;
      const u = c.snapshot();
      if (!["fund", "ready", "over"].includes(u.step)) return null;
      const b = u.slot === 0 ? { address: u.listening, balance: u.balance } : { address: u.root, balance: (O = u.likeFunds) == null ? void 0 : O.balance };
      if (!b.address) return null;
      const m = u.slot === 0 ? u.entries : [], f = m.filter((zt) => zt.kind === "play" && zt.status === "confirmed");
      return {
        playsLeft: b.balance === void 0 ? null : Wn(b.balance),
        balance: b.balance,
        incoming: 0n,
        fee: BigInt(((et = u.gate) == null ? void 0 : et.limits.playFee) ?? "300"),
        address: b.address,
        switches: ((lt = u.gate) == null ? void 0 : lt.restock) ?? {},
        backedUp: u.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((zt) => zt.recipient)).size, likes: m.filter((zt) => zt.kind === "like" && zt.status === "confirmed" && zt.liked).length } : null,
        arriving: u.slot === 0 ? u.depositPending : !!((pt = u.likeFunds) != null && pt.pending)
      };
    },
    copyButton: (u, b, m, f) => Dr(u, b, m, f, () => {
      ue(c.snapshot());
    })
  }), at = () => {
    if (!c.snapshot().unproven) {
      bt.open();
      return;
    }
    c.prove().then((u) => {
      u && bt.open();
    });
  }, Gt = document.getElementById("albumList"), L = Gt ? _0(Gt, C, { list: !0 }) : null, H = "xtrata.radio.album.last.v1", ot = () => {
    try {
      const u = JSON.parse(localStorage.getItem(H) || "null");
      return u && typeof u.root == "string" && Number.isSafeInteger(u.slot) && u.slot > 0 && u.player && Array.isArray(u.player.tracks) ? u : null;
    } catch {
      return null;
    }
  };
  let vt = "";
  const kt = (u) => {
    const b = JSON.stringify(u);
    if (b !== vt) {
      vt = b;
      try {
        localStorage.setItem(H, b);
      } catch {
      }
    }
  };
  let xt = null;
  window.XtrataRadioLikeHandler = (u) => {
    var m;
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    (m = c.snapshot().likeFunds) != null && m.album && (Ge = !0), hn();
    const b = pn(u.song, { title: u.title, artist: u.artist });
    return c.heart({ song: u.song, title: b.title || void 0, artist: b.artist || void 0, likedBy: Array.isArray(u.likedBy) ? u.likedBy : void 0 });
  };
  let Pe;
  window.XtrataRadioListeningIdentity = () => {
    const u = c.snapshot();
    return u.solo && u.step !== "off" && u.step !== "elsewhere" ? u.listening : void 0;
  };
  const Lt = (u) => {
    var m, f;
    const b = window.XtrataRadioListeningIdentity();
    b !== Pe && (Pe = b, (f = (m = window.XtrataRadio) == null ? void 0 : m.refreshLikes) == null || f.call(m));
  };
  let It = [], St = 0, Ln = !1, Ze = null;
  const Pt = (u) => {
    var b, m;
    Ln || !((m = (b = u.gate) == null ? void 0 : b.gifts) != null && m.enabled) || Date.now() - St < 6e4 || (St = Date.now(), a("/radio/gift/featured").then((f) => {
      It = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((O) => O && typeof O.id == "string" && typeof O.title == "string" && Array.isArray(O.tracks) && O.tracks.length > 0).slice(0, 6), Ln = !0, It.length && ue(c.snapshot());
    }).catch(() => {
    }));
  }, fn = (u) => {
    var b;
    return Ze && u.slot === 0 && !((b = u.gift) != null && b.player) && ["ready", "fund", "loading"].includes(u.step) ? Ze : null;
  }, he = (u, b = !1) => {
    var f, O;
    Ze = u, ue(c.snapshot());
    const m = u && b ? zr(u)[0] : null;
    m && ((O = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || O.call(f, m.id));
  };
  let Xt = pd(), Cn = null;
  const Re = (u) => {
    const b = w.preview && !Vt && u.step === "intro" ? l.incomingAlbum() : null;
    return b ? (Xt = su(Xt, { kind: "offer", album: b.player.id, already: Ib(d).includes(b.player.id) }), nc(Xt) ? b.player : null) : (Xt = su(Xt, { kind: "withdraw" }), null);
  }, Qe = (u) => {
    const b = Xt.phase;
    Xt = su(Xt, u), Xt.phase !== b && (Xt.album && (Xt.phase === "playing" || Xt.phase === "done") && gI(d, Xt.album), ue(c.snapshot()));
  };
  setInterval(() => {
    Xt.phase === "playing" && Qe({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Ve = "", qe, ze = !1, ie = !1;
  const nn = (u, b) => {
    var p, E, N, V, ut, D, dt, gt;
    const m = window.XtrataRadio;
    if (!(m != null && m.setGiftPlayer) || !(m != null && m.setGiftStop)) return;
    const f = b.depositPending && u.step === "fund" && ((p = u.giftStop) == null ? void 0 : p.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : u.giftStop, O = Cn, et = f ? g(u) ? dI(f.reason, f.text) : f.text : null, lt = O ? null : et ?? (e && (!((E = u.gate) != null && E.here) || u.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    lt && lt !== qe && (m.setGiftStop(lt), qe = lt);
    const pt = u.step === "off" || u.step === "elsewhere" ? null : ((N = u.gift) == null ? void 0 : N.player) ?? O ?? fn(u) ?? null, zt = pt ? pt.id + ":" + pt.cover + ":" + pt.tracks.map((yt) => yt.id).join(",") : "";
    zt !== Ve && (m.setGiftPlayer(pt ? { id: pt.id, title: pt.title, subtitle: pt.subtitle, tracks: zr(pt).map((yt) => yt.id), hidden: ((V = C$(pt)) == null ? void 0 : V.id) ?? null, cover: pt.cover } : null), Ve = zt), lt !== qe && (m.setGiftStop(lt), qe = lt);
    const ve = (f == null ? void 0 : f.reason) === "arriving";
    ve !== ie && ((ut = m.setGiftWait) == null || ut.call(m, ve), ie = ve);
    const jt = !!pt && (!!O || !!((D = u.albumLock) != null && D.locked));
    jt !== ze && ((dt = m.setGiftLock) == null || dt.call(m, jt), ze = jt), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(u.step) && ((gt = m.forgetWallets) == null || gt.call(m));
  };
  let Ge = !1;
  const Le = /* @__PURE__ */ new Map(), Ae = (u) => {
    if (!(u.step === "fund" && !u.depositPending && !!u.gift && !!u.listening && u.balance === 0n && !u.entries.some((f) => f.kind === "play") && (u.brandNew || u.createdHere))) return null;
    let m = Le.get(u.listening);
    return m === void 0 && (m = Date.now(), Le.set(u.listening, m)), Date.now() - m < Dc ? m : null;
  }, me = (u) => u.step === "fund" && !u.depositPending && !!u.gift && u.balance === 0n && !u.entries.some((b) => b.kind === "play") && !!u.listening && Le.has(u.listening), En = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", Wn = (u) => {
    const b = c.snapshot().playCost || 350n;
    return u > De ? Number((u - De) / b) : 0;
  }, I = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), G = (u) => {
    const b = Math.round((Date.now() - u) / 6e4);
    return b < 1 ? "now" : b < 60 ? `${b}m` : b < 1440 ? `${Math.round(b / 60)}h` : `${Math.round(b / 1440)}d`;
  }, F = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, S = (u, b = "", m = "") => {
    const f = document.createElement(u);
    return b && (f.textContent = b), m && (f.className = m), f;
  }, W = (u, b, m = "") => {
    const f = S("button", u, m);
    return f.type = "button", f.onclick = b, f;
  }, ht = (u, b) => {
    const m = S("a", u);
    return m.href = b, m.target = "_blank", m.rel = "noopener", m;
  };
  let oe = null, pe = location.hash === "#give";
  pe && history.replaceState(null, "", location.pathname + location.search);
  let Kt = !1;
  const ne = p$((u) => h$({ address: u, network: "mainnet" }), () => ue(c.snapshot())), Zt = (u) => ne.get(u), Vt = rI(navigator.userAgent), Ut = (u, b) => {
    const m = navigator.userAgent, f = iI(m), O = `${location.origin}${location.pathname}${b ? `#gift=${b}` : ""}`, et = [S("p", `You are in ${u}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${w.on ? "player" : "listening wallet"}${b ? w.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], lt = S("div", "", "ppp-open-row"), pt = sI(O, m);
    if (pt) {
      const zt = S("a", `Open in ${f}`, "primary ppp-open-in");
      zt.href = pt, zt.dataset.homeAction = "radio:open-in-browser", lt.append(zt);
    }
    return lt.append(Dr("copy-page-link", "Copy link", () => O, pt ? "" : "primary", () => ue(c.snapshot()))), et.push(lt, S("p", `If that does not open ${f}, use ${u}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), et;
  }, tt = (u) => Zt(u) ?? En(u), Qt = (u) => u.slice(0, 2).map(tt).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), ae = /* @__PURE__ */ new Map();
  let Ue = !1;
  const be = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), hn = () => {
    Ue || (Ue = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const b of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const m = Number(b == null ? void 0 : b.id);
        Number.isSafeInteger(m) && ae.set(m, { title: typeof b.title == "string" ? b.title : void 0, artist: typeof b.artist == "string" ? b.artist : void 0 });
      }
      ue(c.snapshot());
    }).catch(() => {
      Ue = !1;
    }));
  }, pn = (u, b) => {
    const m = ae.get(u), f = E0(u, [m == null ? void 0 : m.title, b == null ? void 0 : b.title].find((et) => !be(et)) || ""), O = x0(u, (m == null ? void 0 : m.artist) || (b == null ? void 0 : b.artist) || "");
    return { title: f, artist: O };
  }, Rn = (u) => {
    const { title: b, artist: m } = pn(u.song, u);
    return b ? `“${b}”${m ? ` — ${m}` : ""}` : `Song #${u.song}${m ? ` — ${m}` : ""}`;
  }, Tn = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Hi = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Po(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["TOO MUCH", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Bn(u, b, m = "", f) {
    const O = S("dt", u), et = S("dd", b, m);
    return f && et.append(" ", f), [O, et];
  }
  const Mn = document.getElementById("ppp-top"), Xr = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Ye = () => {
    var b;
    const u = window.XtrataRadioConnectStacks;
    u ? u() : (b = document.getElementById("radio-wallet-connect")) == null || b.click();
  }, Oi = () => {
    var b, m;
    const u = c.snapshot();
    if (u.step === "connect" || u.step === "wrong-wallet") {
      Ye();
      return;
    }
    if (u.step === "elsewhere" && ((b = u.gate) != null && b.radioUrl)) {
      location.href = u.gate.radioUrl;
      return;
    }
    if (u.step === "locked" && !u.armed && !u.busy && c.unlock(), u.step === "ready" && ((m = u.giftStop) == null ? void 0 : m.reason) === "off" && !u.busy && c.switchOn(), u.step === "fund" && u.solo && !u.depositPending && !u.busy) {
      at();
      return;
    }
    Xr();
  };
  Mn && (Mn.onclick = Oi);
  const Fs = (u, b, m, f = "") => u.standIn && !u.mainConnected ? W(`Connect ${tt(u.standIn)} to add STX`, Ye, f) : W(b, m, f), An = (u) => {
    c.useLinked(u).then(() => Xr());
  };
  let Cr = null;
  const Di = () => {
    const u = P0(c.snapshot(), tt);
    return u.length ? Cr || (Cr = new Promise((b) => {
      var jt;
      const m = S("dialog", "", "ppp-connect");
      m.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const O = (p) => {
        f = p, m.close();
      };
      m.addEventListener("close", () => {
        m.remove(), Cr = null, b(f);
      }), m.addEventListener("click", (p) => {
        p.target === m && O(null);
      });
      const et = (p, E, N, V, ut = !1) => {
        const D = S("button", "", "ppp-connect__opt " + N);
        return D.type = "button", D.disabled = ut, D.onclick = V, D.append(S("b", p), S("span", E)), D;
      }, lt = S("h2", "Connect", "ppp-connect__title");
      lt.id = "ppp-connect-title";
      const pt = u.map((p) => et(p.label, p.detail, "is-music", () => {
        if (O("music"), p.action === "linked" && p.main) {
          An(p.main);
          return;
        }
        const E = P0(c.snapshot(), tt).find((N) => N.action !== "linked");
        (E == null ? void 0 : E.action) === "create" ? c.create() : (E == null ? void 0 : E.action) === "unlock" && c.unlock(), Xr();
      }, !!p.disabled)), zt = et("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => O("stacks")), ve = W("Cancel", () => O(null), "quiet ppp-connect__cancel");
      m.append(lt, ...pt, zt, ve), document.body.appendChild(m), m.showModal(), (jt = pt.find((p) => !p.disabled)) == null || jt.focus();
    }), Cr) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Di;
  function Ft(u) {
    if (!Mn) return;
    const b = (f, O, et) => {
      Mn.hidden = !1, Mn.className = "ppp-top" + (O ? " is-" + O : ""), Mn.replaceChildren(S("span", "", "dot"), document.createTextNode(f)), Mn.title = et;
    }, m = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Mn.hidden = !0;
        return;
      case "elsewhere":
        return b("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Mn.hidden = !0;
        return;
      case "intro":
        return b("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return b(`Connect ${tt(u.linked)}`, "warn", `This device's listening wallet belongs to ${tt(u.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return b("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return b("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return u.depositPending ? b("Plays on their way", "quiet", "Plays start by themselves when they land") : b(u.entries.some((f) => f.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return b("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return b("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return u.payingOn && m > 0 && !u.giftStop ? b(`${m.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : b("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const re = document.getElementById("pppNudge"), Wr = document.getElementById("onair");
  (Ce = re == null ? void 0 : re.querySelector("button")) == null || Ce.addEventListener("click", () => Oi());
  const Fi = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, ji = {
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
  function Zn(u) {
    if (u.step === "loading") return;
    const b = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, m = u.step === "ready" && u.payingOn && b > 0 && !u.giftStop, f = u.step === "fund" && u.depositPending, O = u.step === "elsewhere" && !e, et = m || f || O ? "" : Fi[u.step] ?? "", lt = m ? "on" : O ? "free" : et ? "off" : "";
    lt ? document.documentElement.dataset.ppp = lt : delete document.documentElement.dataset.ppp, Wr && (Wr.hidden = !lt || lt === "free", Wr.querySelector(".onair-sub").textContent = m ? `${b.toLocaleString()} plays left` : "Plays off"), re && (re.hidden = lt !== "off" && lt !== "free", re.classList.toggle("is-free", lt === "free"), lt === "free" ? (re.querySelector(".nudge-t").textContent = "You’re on the free player", re.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", re.querySelector("button").textContent = "Get a player") : lt === "off" && (re.querySelector(".nudge-t").textContent = et, re.querySelector(".nudge-s").textContent = g(u) ? u.step === "intro" ? hI : "" : "This radio requires a funded listening wallet with music support on.", re.querySelector("button").textContent = ji[u.step] ?? "Start"));
  }
  let Xe = "";
  function rn(u) {
    const b = S("div", "", "ppp-pick");
    u.funderMultiple && u.returnToKind === "funder" && b.append(S("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), u.returnToKind === "funder" && b.append(S("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const m = S("input");
    m.type = "text", m.placeholder = "SP… address to send returns to", m.autocomplete = "off", m.spellcheck = !1, m.setAttribute("aria-label", "Address to return funds to"), m.value = Xe, m.oninput = () => {
      Xe = m.value;
    };
    const f = W(u.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(m.value), Xe = "";
    }, "tiny");
    return b.append(m, " ", f), u.returnToKind === "chosen" && b.append(" ", W("Back to the funder", () => c.clearReturnAddress(), "tiny")), b;
  }
  const js = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Rs() {
    const u = S("p", js + " ", "ppp-mute");
    return u.append(ht("Xverse", "https://www.xverse.app/download"), " · ", ht("Leather", "https://leather.io/install-extension")), u;
  }
  let Ri = "";
  const Uo = (u) => {
    const b = document.documentElement, m = u.solo && !u.main ? u.listening ? En(u.listening) : "new" : "", f = U5() ? "1" : "", O = u.standIn && !u.mainConnected ? tt(u.standIn) : "";
    `${m}|${f}|${O}` !== Ri && (Ri = `${m}|${f}|${O}`, m ? b.dataset.pppSolo = m : delete b.dataset.pppSolo, O ? b.dataset.pppAs = O : delete b.dataset.pppAs, f ? b.dataset.pppWalletInstalled = f : delete b.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => ue(c.snapshot()), u);
  function zi(u, b = "") {
    const m = S("div", "", "ppp-topup"), f = zs(u);
    m.append(S("span", "Add plays from My player: ", "ppp-mute"));
    for (const O of dc) {
      const et = W(`+${O.toLocaleString()}`, () => void c.topUpAlbum(O), b);
      et.disabled = f === void 0 || f < O || u.depositPending || !!u.busy, m.append(et);
    }
    return f !== void 0 && f < dc[0] && m.append(S("p", "My player needs plays first (switch to My player above).", "ppp-mute")), m;
  }
  const zs = (u) => {
    var f;
    const b = (f = u.likeFunds) == null ? void 0 : f.balance;
    if (b === void 0 || !u.playCost) return;
    const m = b - De - 6000n;
    return m > 0n ? Number(m / u.playCost) : 0;
  };
  function Zr(u) {
    const b = u.likeFunds;
    if (!b || !b.album || !b.low && !b.pending) return [];
    if (b.low || (Ge = !1), b.low && !Ge) return [];
    const m = S("div", "", "ppp-pick ppp-lowbox");
    if (!b.low) {
      if (!b.txid) return [];
      const O = S("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return b.txid && O.append(ht("View", F(b.txid))), m.append(O), [m];
    }
    m.append(S("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), m.append(S("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), m.append(S("p", b.address, "ppp-addr-full"));
    const f = S("div", "", "ppp-open-row");
    if (f.append(Dr("copy-likes-address", "Copy address", () => b.address, "primary", () => ue(c.snapshot()))), b.main && !u.solo) {
      const O = Fr - (b.balance ?? 0n);
      O > 0n && f.append(Fs(u, `Pay ${rr(O)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return m.append(f), m.append(S("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [m];
  }
  const gn = (u) => {
    const b = S("div", "", "ppp-wait");
    b.dataset.since = String(u.since), b.dataset.grace = String(u.graceMs), b.setAttribute("role", "progressbar"), b.setAttribute("aria-label", "Your plays are arriving");
    const m = S("p", "", "ppp-wait-t"), f = S("div", "", "ppp-wait-track");
    return f.append(S("div", "", "ppp-wait-fill")), b.append(m, f), Qr(b), b;
  };
  function Qr(u) {
    const b = Number(u.dataset.since), m = Number(u.dataset.grace) || 6e4, f = Math.max(0, Date.now() - b), O = u.querySelector(".ppp-wait-fill"), et = u.querySelector(".ppp-wait-t");
    if (f < m) {
      const lt = Math.ceil((m - f) / 1e3);
      O.style.width = Math.max(4, Math.min(95, f / m * 100)).toFixed(0) + "%", et.textContent = `Your plays are arriving… usually about a minute · ${lt}s`, u.classList.remove("is-long"), u.setAttribute("aria-valuenow", String(Math.round(f / m * 100)));
    } else
      O.style.width = "", et.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", u.classList.add("is-long"), u.removeAttribute("aria-valuenow");
  }
  let Gs = 0;
  setInterval(() => {
    const u = document.querySelectorAll(".ppp-wait");
    if (!u.length) {
      Gs = 0;
      return;
    }
    u.forEach(Qr), ++Gs % 10 === 0 && ue(c.snapshot());
  }, 1e3);
  let Ks = null;
  function Vs(u) {
    if (u.step === "loading" && Ks !== null) return;
    const m = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(u.step) || !!u.busy || u.armed || !!l.pendingCode() && !["ready", "fund", "over"].includes(u.step);
    m !== Ks && (Ks = m, m ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function ue(u) {
    var _f, Pf, Uf, Hf, Of, Df, Ff, jf, Rf, zf, Gf, Kf, Vf, qf, Yf, Xf;
    if (xt && ["ready", "fund", "over"].includes(u.step) && !u.busy) {
      const X = xt;
      xt = null, u.root === X.root && u.slot !== X.slot && c.openAlbum(X.slot);
    }
    const b = l.inProgress(u), m = Ae(u), f = b && u.step === "fund" ? { ...u, depositPending: !0 } : m !== null ? { ...u, depositPending: !0, arrival: { since: m, graceMs: Dc } } : u, O = f.error === Fc;
    if (Lt(), Pt(u), P(u), Cn = Re(u), nn(u, f), Vs(f), Uo(f), !b && l.inProgress(u)) return;
    if (Ft(f), Zn(f), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? w.on ? pI : "Checking your listening wallet…" : w.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = f.step === "off", t.hidden) {
      K(f, !1);
      return;
    }
    const [et, lt] = Po(f), pt = s(".ppp-state");
    pt.textContent = et, pt.className = "ppp-state" + (lt ? " ppp-state--" + lt : ""), pt.hidden = !et;
    const zt = !!f.busy || f.armed, ve = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (zt || !["intro", "loading"].includes(f.step));
    i.hidden = !ve, i.classList.toggle("ppp-frame--rest", !zt && !Kt);
    const jt = s(".ppp-frame-label");
    jt.hidden = !0;
    const p = M5(f) ?? oe;
    oe = p;
    const E = "xtrata.radio.ppp.heard.v1", N = (() => {
      try {
        return localStorage.getItem(E) === "1";
      } catch {
        return !1;
      }
    })();
    if (!N && f.entries.some((X) => X.kind === "play"))
      try {
        localStorage.setItem(E, "1");
      } catch {
      }
    const V = N || f.slot > 0 && ((((_f = f.likeFunds) == null ? void 0 : _f.balance) ?? 0n) > 0n || h.count() > 1), ut = g(f), D = !ut && _5({ ...f, heard: V }, p);
    s(".ppp-badge").hidden = !D;
    const dt = s(".ppp-steps"), gt = s(".ppp-stage");
    dt.hidden = gt.hidden = !D, p && D && (dt.replaceChildren(...ld(f.solo).map((X, nt) => {
      const At = S("li", "", nt < p.at ? "done" : nt === p.at ? p.blocked ? "now blocked" : "now" : "");
      return At.append(S("span", nt < p.at ? "✓" : String(nt + 1), "n"), X), nt === p.at && At.setAttribute("aria-current", "step"), At;
    })), gt.textContent = p.caption, gt.className = "ppp-stage " + (p.at >= ld(f.solo).length ? "ppp-ok" : p.blocked ? "ppp-bad" : "ppp-cyan"));
    const yt = s(".ppp-facts"), $t = [];
    f.main && ((Pf = f.gate) != null && Pf.here) && !f.solo && $t.push(...Bn("Your wallet", tt(f.main), "ppp-addr-short"));
    const ge = () => {
      if (!f.listening) return;
      const X = Dr("copy-listening", "Copy", () => f.listening || "", "tiny", () => ue(c.snapshot()));
      $t.push(...Bn(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", En(f.listening), "ppp-addr-short", X));
    };
    if (f.linked || ge(), f.listening && f.step !== "intro")
      if (f.linked)
        $t.push(...Bn("Credited to", `${tt(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), ge();
      else if (f.solo) {
        f.creditedTo && $t.push(...Bn("Credited to", `${tt(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const X = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${tt(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        $t.push(...Bn("Returns go to", f.gift ? X : f.returnTo && !Zt(f.returnTo) ? X.replace(En(f.returnTo), f.returnTo) : X, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else $t.push(...Bn("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Uf = f.gate) != null && Uf.here)) {
      const X = f.linkedListening.map((nt) => En(nt) + (nt === f.listening ? " (this one)" : "")).join(", ");
      $t.push(...Bn(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", X, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const X = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      $t.push(...Bn("Balance", `${rr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, X));
    }
    const He = f.entries.find((X) => X.kind === "play");
    He && hn(), He && $t.push(...Bn("Last paid song", `${Rn(He)} → ${tt(He.recipient)}`, Tn[He.status] || "")), yt.replaceChildren(...$t), yt.hidden = !$t.length;
    const ct = [], Ht = [], Jt = [], x = [], _ = un(BigInt(((Hf = f.gate) == null ? void 0 : Hf.limits.playFee) ?? "300")), R = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${rr(Hc)} STX to the song holder, plus a ${rr(_ - Hc)} STX network fee.`, ft = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (ct.push(S("p", "Pay artists as you listen.")), (Of = f.gate) != null && Of.radioUrl) {
          const nt = S("p");
          nt.append(ht("Open the pay-per-play radio →", f.gate.radioUrl)), ct.push(nt);
        }
        Ht.push(S("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const nt = [f.linked, ...f.others];
          ct.push(S("p", nt.length > 1 ? `This device has listening wallets for ${Qt(nt)}.` : `This device has a listening wallet for ${tt(f.linked)}.`)), Ht.push(S("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), nt.slice(0, 3).forEach((At, ce) => Jt.push(W(`Open ${tt(At)}`, () => An(At), ce === 0 ? "primary" : "")));
        } else
          ct.push(S("p", "Connect your wallet to pay artists as you listen.")), Ht.push(S("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        ct.push(S("p", `This device's listening wallet belongs to ${tt(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Ht.push(S("p", `You are connected as ${tt(f.main)}. Switch to the linked wallet to continue listening.`)), Ht.push(S("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Jt.push(W("Switch wallet", Ye, "primary"));
        break;
      case "not-invited":
        ct.push(S("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        ct.push(S("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ct.push(S("p", "Every play counts for the song’s owner, on-chain.")), Ht.push(S("p", R)), Ht.push(S("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Ht.push(S("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (ct.push(S("p", `This device already has a listening wallet for ${Qt(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Ht.push(S("p", `Otherwise, set up a new listening wallet for ${tt(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Ht.push(S("p", `This is the listening wallet for ${tt(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Ht.push(S("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const X = l.liveGift();
        Jt.push(W(X ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${tt(f.main)}` : "Start listening", () => void c.create(), "primary")), !X && !f.solo && f.main && f.others.length && Jt.push(W("Switch wallet", Ye)), !X && f.solo && Jt.push(W("I have a Stacks wallet", Ye)), Jt.push(W("I already have a listening wallet", () => void c.unlock(!0))), X && Jt.push(W("Not now", () => l.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (ct.push(S("p", "Locked.", "ppp-mute")), Jt.push(W("Unlock", () => void c.unlock(), "primary"))), f.standIn ? x.push(W("Use a different listening wallet", () => void Di().then((nt) => {
          nt === "stacks" && Ye();
        }), "quiet")) : x.push(W("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        ct.push(S("p", `Link to ${tt(f.main)} · free`)), Ht.push(S("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Ht.push(S("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Jt.push(W(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        ct.push(S("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && ct.push(gn(f.arrival)) : me(f) ? ct.push(S("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Df = f.gift) != null && Df.player ? ct.push(S("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? ct.push(S("p", "No plays left · add plays to keep counting", "ppp-bad")) : ct.push(S("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / _)).toLocaleString()} plays`)), f.entries.length && Ht.push(S("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && Ht.push(S("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), b ? Ht.push(S("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? Ht.push(S("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (Ht.push(S("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Ht.push(S("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Jt.push(Dr("copy-address", "Copy my address", () => f.listening || "", "primary", () => ue(c.snapshot())))) : Ht.push(S("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const nt = S("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          nt.append(ht("View", F(f.depositTxid))), ct.push(nt);
        } else f.allowance > 0n && !f.solo && !f.depositPending && Jt.push(Fs(f, `Deposit ${rr(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        ct.push(S("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (ct.push(S("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), Jt.push(W("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (ct.push(S("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ct.push(rn(f))), (!f.solo || f.returnTo) && Jt.push(W("Return excess", () => void c.returnFunds("excess"), "primary"), W("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((Ff = f.giftStop) == null ? void 0 : Ff.reason) !== "off") {
          const nt = Math.min(f.session.playsLeft, f.playsLeft);
          ct.push(S("p", `${nt.toLocaleString()} plays left`, "ppp-ok")), Ht.push(S("p", R + " The heart likes or unlikes from this wallet for 0.0002 STX.")), Jt.push(W("Switch off", () => void c.switchOff()));
        } else
          ct.push(S("p", "Switch on music support to listen.", "ppp-mute")), Jt.push(W("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && ct.push(S("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && ct.push(S("p", "Running low on plays", "ppp-warn")), f.aboveTarget && ct.push(S("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? ct.push(S("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Jt.push(Fs(f, `Top up ${rr(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const X = f.step === "fund", nt = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      X ? Jt.unshift(W("Add plays", () => at(), "primary")) : nt ? Jt.push(W("Add plays", () => at(), "primary")) : f.step === "ready" && x.push(W("Add plays", () => at(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && Ht.push(S("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && Ht.push(rn(f)), Ht.push(Rs()), f.slot === 0 && f.step === "ready" && f.entries.some((X) => X.kind === "play" && X.status === "confirmed"))) {
      const X = S("p", "New to Stacks? ", "ppp-mute");
      X.append(ht("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ct.push(X);
    }
    if (f.walletOutdated && Ht.push(S("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (ct.push(S("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Jt.push(W("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && x.push(W(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${tt(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((jf = f.gift) != null && jf.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && x.push(zi(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && x.push(W(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && x.push(W("Lock", () => void c.lock(), "quiet")), ve && !zt && x.push(W(Kt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Kt = !Kt, ue(c.snapshot());
    }, "quiet")), [...Jt, ...x].forEach((X) => X.disabled = ft), ft && (Jt.length = 0), !ut && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((Rf = f.gift) != null && Rf.player)) {
      const X = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", nt = ct.at(0);
      f.step === "ready" && nt ? nt.append(S("span", ` · ${I(f.balance)} STX`, X)) : ct.push(S("p", `Balance ${I(f.balance)} STX`, X));
    }
    if (ut) {
      for (const At of [...Jt, ...x]) {
        const ce = lI[At.textContent ?? ""];
        ce && (At.textContent = ce);
      }
      for (let At = ct.length - 1; At >= 0; At--) H0(ct[At].textContent) && Ht.unshift(...ct.splice(At, 1));
      for (let At = Jt.length - 1; At >= 0; At--) H0(Jt[At].textContent) && x.unshift(...Jt.splice(At, 1));
      const X = f.entries.some((At) => At.kind === "play"), nt = fI(f.step, { played: X, arriving: f.depositPending });
      nt.length && ct.length && nt.shift(), ct.push(...nt.map((At) => S("p", At, "ppp-mute")));
    }
    if ((zf = f.gift) != null && zf.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const X = S("p", "", "ppp-gift");
      X.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && X.append(" · ", f.gift.player.subtitle);
      const nt = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? S("span", " · plays on their way", "ppp-warn") : S("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      nt && X.append(nt);
      const At = (Gf = ct.at(0)) == null ? void 0 : Gf.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && At && /STX/.test(At.textContent ?? "") && At.remove(), ct.unshift(X), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          ct.splice(1, 0, S("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), zi(f, "primary"));
        else {
          const ce = S("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ce.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ce.append(ht("Xverse", "https://www.xverse.app/download"), " and ", ht("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ct.splice(1, 0, ce);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const X = f.returnPlan, nt = S("div", "", "ppp-pick");
      nt.append(S("p", X.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const At = S("ul", "", "ppp-gift-list");
      X.steps.forEach((ce, ss) => {
        const is = ce.kind === "gift" ? "the unused gift" : ce.kind === "deposit" ? "what was added to it" : "the rest", vn = S("li");
        vn.append(S("span", `${ss + 1}. ${rr(BigInt(ce.send))} STX · ${is}`, "t"), S("span", ce.to ? ` → ${tt(ce.to)}` : " → choose an address below", ce.to ? "ppp-mute" : "ppp-warn")), At.append(vn);
      }), nt.append(At), X.kept && nt.append(S("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), X.steps.some((ce) => !ce.to) && nt.append(rn(f)), nt.append(W(X.steps.length > 1 ? `Confirm part 1 of ${X.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), ct.push(nt);
    }
    const ye = Jr(f), Te = A ? ye : null, sn = M(f, !!Te), on = sn === "gift" || sn === "arriving" || sn === "new", Vi = l.banner(u, { bare: !!Te || sn === "gift" || sn === "arriving" }), Qn = Vt && (l.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? Ut(Vt, l.pendingCode()) : [];
    Te || (ct.unshift(...Vi), ct.push(...Zr(f)), ct.unshift(...Qn)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && ct.unshift(S("p", `This is ${tt(f.creditedTo)}'s listening wallet. Plays and likes count for ${tt(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...ct);
    const qi = document.querySelector(".ppp-switch");
    if (qi) {
      const X = h.latest(), nt = f.slot > 0, At = ["fund", "ready", "over"].includes(f.step) && (nt || !!X);
      if (qi.hidden = !At, At) {
        const ce = (vn, Aa, va, El) => {
          const Yi = W("", El, "ppp-tab");
          return Yi.setAttribute("aria-pressed", String(va)), Yi.append(S("span", vn, "tt"), S("span", Aa === void 0 ? "…" : `${Wn(Aa).toLocaleString()} plays`, "ts")), Yi.disabled = !!f.busy, Yi;
        }, ss = nt ? ((Vf = (Kf = f.gift) == null ? void 0 : Kf.player) == null ? void 0 : Vf.title) ?? "Album" : X.title, is = W("View all albums" + (h.count() > 1 ? ` (${h.count()})` : ""), () => {
          const vn = document.querySelector(".ppp-shelf");
          vn && (vn.hidden = !1, vn.open = !vn.open, is.setAttribute("aria-expanded", String(vn.open)), vn.open && requestAnimationFrame(() => vn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        is.setAttribute("aria-expanded", String(!!((qf = document.querySelector(".ppp-shelf")) != null && qf.open))), qi.replaceChildren(
          ce("🎧 My player", nt ? (Yf = f.likeFunds) == null ? void 0 : Yf.balance : f.balance, !nt, () => {
            nt && c.openAlbum(0);
          }),
          ce("💿 " + ss, nt ? f.balance : void 0, nt, () => {
            !nt && X && c.openAlbum(X.slot);
          }),
          is
        );
      }
    }
    const Xs = h.render(f), Ws = document.querySelector(".ppp-shelf");
    if (Ws) {
      Ws.hidden = !Xs;
      const X = Ws.querySelector("summary");
      X && (X.textContent = h.count() > 0 ? `♪ My albums (${h.count()})` : "♪ My albums");
      const nt = Ws.querySelector(".ppp-shelf-body");
      Xs && nt && !nt.contains(Xs) && nt.replaceChildren(Xs);
    }
    const Mr = l.renderFold(u);
    if (s(".ppp-gifts").hidden = !Mr, Mr && !s(".ppp-gift-body").contains(Mr) && s(".ppp-gift-body").replaceChildren(Mr), Mr && pe) {
      pe = !1;
      const X = s(".ppp-gifts");
      X.open = !0, requestAnimationFrame(() => X.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const rs = document.querySelector("#ppp .ppp-featured");
    if (rs) {
      const X = It.length > 0 && f.slot === 0 && !((Xf = f.gift) != null && Xf.player) && f.step === "ready";
      rs.hidden = !X, X && rs.replaceChildren(S("p", "Albums in your player", "ppp-featured__h"), ...It.map((nt) => {
        const At = (Ze == null ? void 0 : Ze.id) === nt.id, ce = W("", () => he(At ? null : nt, !At), "ppp-featured__a" + (At ? " is-on" : "")), ss = zr(nt).length;
        return ce.append(S("b", nt.title), S("span", At ? "Playing now · tap to go back to the radio" : `${nt.subtitle ? nt.subtitle + " · " : ""}${ss} ${ss === 1 ? "song" : "songs"}`)), ce.setAttribute("aria-pressed", String(At)), ce.disabled = !!f.busy, ce;
      }));
    }
    qs(f);
    const ml = document.querySelector("#ppp .ppp-yours");
    if (ml) {
      const X = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      ml.hidden = !X;
      const nt = ml.querySelector(".ppp-yours-body");
      if (X && nt && nt.getAttribute("data-for") !== f.listening) {
        nt.setAttribute("data-for", f.listening);
        const At = (El, ...Yi) => {
          const Wf = S("details", "", "ppp-yours-item");
          return Wf.append(S("summary", El), ...Yi), Wf;
        }, ce = S("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        ce.append(S("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const ss = S("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), is = S("p");
        is.append(ht("Find a name at BNS One →", "https://bns.one"));
        const vn = S("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Aa = S("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), va = S("p");
        va.append(ht("See the giveaway →", "https://xtrata.xyz/giveaway")), nt.replaceChildren(
          At("Give your player a name", ce, ss, S("p", f.listening, "ppp-addr-full"), Dr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => ue(c.snapshot())), is),
          At("Link it to a wallet you already have", vn),
          At("Bring a friend in", Aa, va)
        );
      }
    }
    s(".ppp-body").replaceChildren(...Ht), s(".ppp-actions").replaceChildren(...Jt), s(".ppp-actions2").replaceChildren(...x);
    const xl = f.busy || f.message || "", Tf = s(".ppp-msg"), Sl = xl && ct.some((X) => (X.textContent ?? "").startsWith(xl.replace(/[.✓\s]+$/, ""))) ? "" : xl, Bf = !Sl && !f.error ? f.notice : O && !Sl ? f.error : "";
    Tf.textContent = Sl || Bf, Tf.classList.toggle("is-warn", !!Bf), s(".ppp-err").textContent = O ? "" : f.error;
    const Cb = f.entries.filter((X) => X.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...Cb.slice(0, 5).map((X) => {
      const nt = S("li"), At = X.status === "confirmed" ? "ok" : X.status === "failed" ? "bad" : "warn";
      return nt.append(S("span", "", "d " + At), S("span", Rn(X), "t"), S("span", G(X.created), "ppp-mute")), X.txid && nt.append(ht("tx", F(X.txid))), nt;
    })), s(".ppp-wallets").hidden = !(yt.childElementCount || x.length), s(".ppp-more").hidden = !Ht.length;
    const Mf = s(".ppp-history");
    Mf.hidden = !f.entries.length, f.entries.length && hn(), Mf.replaceChildren(S("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((X) => {
      const nt = S("div", "", "ppp-row"), At = X.kind === "play" ? [S("span", Rn(X), "ppp-song"), S("span", ` · ${rr(BigInt(X.amount))} STX to ${tt(X.recipient)}`, "ppp-mute")] : X.kind === "like" ? [S("span", `${X.liked ? "♥ Liked" : "Unliked"} ${Rn(X)}`, "ppp-song"), S("span", ` · for ${f.linked ? tt(f.linked) : "this listening wallet"}`, "ppp-mute")] : [S("span", `Returned ${rr(BigInt(X.amount))} STX`, "ppp-song"), S("span", ` to ${tt(X.recipient)}`, "ppp-mute")];
      return nt.append(
        S("span", Hi[X.status] || X.status, "ppp-status " + (Tn[X.status] || "")),
        ...At,
        S("span", ` · ${new Date(X.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), X.txid && nt.append(ht("tx ↗", F(X.txid))), nt;
    })), U == null || U.render(Te ? Tr(f, Te, [...Qn, ...Vi]) : null), ts(f, Te), K(f, !!Te, on ? [...Qn, ...Vi] : Qn, sn), bt.isOpen() && bt.refresh(), Gi();
    const Nf = (ye == null ? void 0 : ye.mode) === "open" ? null : fn(f);
    L == null || L.render((ye == null ? void 0 : ye.mode) === "open" ? Tr(f, ye, []) : Nf ? { ...Tr(f, { mode: "open", player: Nf }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function Jr(u) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(u.step)) return null;
    if (u.slot > 0 && ((f = u.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(u.step))
      return u.root && kt({ root: u.root, slot: u.slot, player: u.gift.player }), { mode: "open", player: u.gift.player };
    const b = l.incomingAlbum();
    if (b) return { mode: "arrive", player: b.player, from: b.from, offered: b.plays };
    const m = ot();
    return m && (u.step === "locked" || xt && u.step === "loading") ? { mode: "locked", player: m.player } : null;
  }
  function qs(u) {
    var p;
    const b = document.querySelector("#ppp .ppp-award");
    if (!b) return;
    const m = u.award, f = u.slot === 0 ? u.listening : u.root, O = m != null && m.cls && D0(m.cls) ? F0(m.cls) : null, et = !!m && !!O && !!f && ["ready", "fund", "over"].includes(u.step) && !(m.state === "unavailable" && m.number === void 0);
    if (b.hidden = !et, !et || !m || !O || !f) {
      b.replaceChildren();
      return;
    }
    const lt = JSON.stringify([m, f, !!u.busy]);
    if (b.getAttribute("data-sig") === lt) return;
    b.setAttribute("data-sig", lt);
    const pt = (E) => {
      const N = S("p", "", "ppp-award__h");
      return N.append(S("b", `${O.mark} Music Hero award`), S("span", E)), N;
    }, zt = `No. ${String(m.number ?? 0).padStart(4, "0")}`, ve = (E) => {
      const N = S("div", "", "ppp-award__art"), V = document.createElement("iframe");
      return V.src = E, V.title = `${O.name} record`, V.setAttribute("sandbox", "allow-scripts"), V.setAttribute("loading", "lazy"), N.append(V), N;
    }, jt = [];
    if (m.state === "claimed") {
      if (jt.push(pt(`${O.name} record · ${zt}`)), m.inscription !== void 0 && jt.push(ve(`/i/${m.inscription}`)), jt.push(S("p", m.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : m.holds === null || m.holds === void 0 ? `Yours: Xtrata inscription #${m.inscription}.` : `Yours for good: Xtrata inscription #${m.inscription}. It gives your player its ${O.name} colours.`, m.holds === !1 ? "ppp-mute" : "ppp-ok")), m.inscription !== void 0) {
        const E = S("p");
        E.append(ht("Open it full screen ↗", `/i/${m.inscription}`)), jt.push(E);
      }
    } else if (m.claimTx) {
      jt.push(pt(`${O.name} record · ${zt}`));
      const E = S("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      E.append(ht("View", F(m.claimTx))), jt.push(E);
    } else if (m.state === "ready") {
      jt.push(pt(`${O.name} record · ${zt}`));
      const E = typeof m.name == "string" && m.name ? m.name : null, N = new URLSearchParams({ n: String(m.number), a: f, ...E ? { b: E } : {}, p: String(m.need), s: MI(c5, m.number, f) });
      jt.push(ve(`/awards/${O.id}#${N}`)), jt.push(S("p", `Your ${O.name} record is ready. You have paid artists for ${(p = m.need) == null ? void 0 : p.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const V = S("div", "", "ppp-award__row");
      E ? (jt.push(S("p", `Its plaque will carry ${E} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), V.append(W("Claim my record", () => void c.claimAward("auto"), "primary"), W("Use my address only", () => void c.claimAward("none"), "quiet"))) : m.name === null ? (jt.push(S("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), V.append(W("Claim my record", () => void c.claimAward("none"), "primary"), W("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (jt.push(S("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), V.append(W("Check for a name again", () => void c.awardRefresh(), "primary"), W("Claim with my address only", () => void c.claimAward("none"), "quiet"))), V.querySelectorAll("button").forEach((ut) => {
        ut.disabled = !!u.busy;
      }), jt.push(V, S("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (m.state === "earning" && m.have !== void 0 && m.need) {
      jt.push(pt(`${m.have.toLocaleString()} of ${m.need.toLocaleString()} paid plays`));
      const E = S("div", "", "ppp-award__bar"), N = document.createElement("i");
      N.style.width = `${Math.min(100, Math.round(m.have / m.need * 100))}%`, E.append(N);
      const V = m.need - m.have;
      jt.push(E, S("p", `${V.toLocaleString()} more ${V === 1 ? "play" : "plays"} and your ${O.name} record is yours to claim.`, "ppp-mute"));
    } else
      jt.push(pt(`${O.name} record · ${zt}`)), jt.push(S("p", m.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : m.state === "class-full" || m.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    b.replaceChildren(...jt);
  }
  function ts(u, b) {
    const m = document.querySelector(".ppp-skin");
    if (!m) return;
    const f = !!b && (!!u.busy || u.armed);
    if (m.hidden = !f, !f || !b) {
      m.replaceChildren();
      return;
    }
    const O = fd(b.player.cover), et = O ? S("img", "ppp-skin__art") : S("span", "ppp-skin__art ppp-skin__art--none", "♪");
    O && (et.src = O, et.alt = "");
    const lt = S("span", "ppp-skin__t");
    lt.append(S("b", "", b.player.title), S("span", "", b.mode === "arrive" && b.from ? `A gift from ${b.from}` : b.player.subtitle || "Your album")), m.replaceChildren(et, lt);
  }
  function Tr(u, b, m) {
    var zt, ve, jt, p, E;
    const f = !!u.busy || u.armed, O = [...m];
    u.depositPending && u.arrival && O.push(gn(u.arrival)), u.error ? O.push(S("p", u.error, u.error === Fc ? "ppp-warn" : "ppp-bad")) : u.message && !f ? O.push(S("p", u.message, "ppp-cyan")) : u.notice && O.push(S("p", u.notice, "ppp-warn")), b.mode === "open" && Ge && ((zt = u.likeFunds) != null && zt.album) && u.likeFunds.low && !u.likeFunds.pending && O.push(S("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let et = "Kept on this device with Face ID or your passkey. No app or account needed.", lt = null, pt = null;
    if (b.mode === "locked")
      lt = { label: "Continue listening", run: () => {
        xt = ot(), c.unlock();
      } }, pt = { label: "Use a different passkey", run: () => {
        xt = null, c.unlock(!0);
      } };
    else if (b.mode === "arrive")
      if (u.step === "intro" && nc(Xt) && Xt.album === b.player.id) {
        const N = window.XtrataRadio, V = zr(b.player)[0], ut = Xt.phase === "playing";
        lt = { label: ut && !!((jt = (ve = N == null ? void 0 : N.getState) == null ? void 0 : ve.call(N)) != null && jt.playing) ? "Pause" : ut ? "Carry on" : "Play the first song", run: () => {
          var dt, gt;
          ut ? (dt = N == null ? void 0 : N.playPause) == null || dt.call(N) : V && ((gt = N == null ? void 0 : N.playToken) == null || gt.call(N, V.id));
        } }, pt = { label: "Make my player and hear it all", run: () => void c.create() }, et = "The first song is free. Nothing to set up yet.";
      } else if (u.step === "intro") {
        const N = Xt.phase === "done" && Xt.album === b.player.id;
        N && !O.length && O.push(S("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), lt = { label: N ? "Keep listening" : "Open album", run: () => void c.create() }, pt = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else u.step === "locked" ? (lt = { label: "Open album", run: () => void c.unlock() }, pt = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : u.step === "unsupported" ? O.push(S("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : O.length || O.push(S("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: b.mode,
      player: b.player,
      from: b.from,
      offered: b.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: b.mode === "arrive" && u.step === "intro" ? 1 : void 0,
      plays: b.mode === "open" ? u.balance === void 0 ? null : u.giftPlays : void 0,
      playsComing: u.depositPending,
      status: O,
      primary: lt,
      secondary: pt,
      hint: lt ? et : void 0,
      asking: f,
      busy: !!u.busy,
      myPlays: zs(u),
      topUps: dc,
      canMake: !!((E = (p = u.gate) == null ? void 0 : p.gifts) != null && E.admin)
    };
  }
  const Nn = document.getElementById("findBox"), es = document.getElementById("findBody"), ur = Nn && es ? CI(es, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : Promise.reject(new Error("catalogue unavailable"))).then((u) => $I(u == null ? void 0 : u.tracks, (b, m) => ({ title: E0(b, be(m.title) ? "" : m.title), artist: x0(b, m.artist || "") }))),
    play: (u) => {
      var b, m;
      (m = (b = window.XtrataRadio) == null ? void 0 : b.playToken) == null || m.call(b, u);
    },
    current: () => {
      var b, m, f, O;
      const u = Number((O = (f = (m = (b = window.XtrataRadio) == null ? void 0 : b.getState) == null ? void 0 : m.call(b)) == null ? void 0 : f.nowPlaying) == null ? void 0 : O.tokenId);
      return Number.isSafeInteger(u) ? u : null;
    },
    locked: () => {
      var u;
      return !!((u = c.snapshot().albumLock) != null && u.locked);
    },
    explicit: (u) => {
      var b, m;
      return !!((m = (b = window.XtrataRadio) == null ? void 0 : b.isExplicit) != null && m.call(b, u));
    }
  }) : null;
  Nn == null || Nn.addEventListener("toggle", () => {
    Nn.open && (ur == null || ur.load());
  });
  let ns = "";
  const Gi = () => {
    var b, m, f, O, et;
    if (!ur || !(Nn != null && Nn.open)) return;
    const u = `${!!((b = c.snapshot().albumLock) != null && b.locked)}|${((et = (O = (f = (m = window.XtrataRadio) == null ? void 0 : m.getState) == null ? void 0 : f.call(m)) == null ? void 0 : O.nowPlaying) == null ? void 0 : et.tokenId) ?? ""}`;
    u !== ns && (ns = u, ur.refresh());
  }, Ki = /* @__PURE__ */ new Map();
  let Br = !1;
  const Ys = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((b) => {
      const m = b == null ? void 0 : b.nowPlaying;
      if (m && Number.isSafeInteger(Number(m.tokenId)) && Ki.set(Number(m.tokenId), { title: m.title || void 0, artist: m.artist || void 0 }), Gi(), nc(Xt)) {
        const f = !!(b != null && b.playing);
        Qe({ kind: "now", track: m && m.tokenId != null ? String(m.tokenId) : null, playing: f, at: Date.now() }), f !== Br && (Br = f, ue(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Ys()) {
    const u = setInterval(() => {
      Ys() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const b = u.detail;
    if (nc(Xt) && Qe({ kind: "listened", at: Date.now() }), b && Number.isSafeInteger(b.song) && typeof b.id == "string" && /^[0-9a-f]{32}$/.test(b.id)) {
      hn();
      const m = pn(b.song, Ki.get(b.song));
      c.onListened({ song: b.song, id: b.id, title: m.title || void 0, artist: m.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const _I = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", PI = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, UI = () => PI() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, HI = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, OI = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Lb = class {
  constructor(t) {
    Av(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && zS(t), this.callback(rl(t));
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
    var r, s, i, o, a, c, l, h, d, w;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (h = (l = t.googlePlayStoreUrl) !== null && l !== void 0 ? l : this.getBrowserUrl(t)) !== null && h !== void 0 ? h : t.webUrl : (w = (d = this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(t);
  }
  render() {
    const t = UI(), e = HI(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Ct("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Ct("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Ct("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Ct("div", { class: "flex flex-col space-y-[10px]" }, Ct("div", { class: "flex items-center" }, Ct("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Ct("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Ct("span", { class: "sr-only" }, "Close popup"), Ct("img", { src: _I }))), r ? Ct("p", null, "Select the wallet you want to connect to.") : Ct("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Ct("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Ct("div", { class: "mt-6" }, Ct("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Ct("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Ct("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ct("div", { class: "aspect-square basis-9 overflow-hidden" }, Ct("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ct("div", { class: "flex-1" }, Ct("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Ct("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Ct("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Ct("div", { class: "mt-6" }, r ? Ct("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Ct("div", { class: "mb-5 flex justify-between" }, Ct("p", { class: "text-sm font-medium" }, "Recommended wallets"), Ct("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Ct("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Ct("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Ct("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Ct("p", null, "What is a wallet? ", Ct("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Ct("ul", { class: "space-y-3" }, n.map((i) => Ct("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ct("div", { class: "aspect-square basis-9 overflow-hidden" }, Ct("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ct("div", { class: "flex-1" }, Ct("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Ct("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Ct("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return sv(this);
  }
};
Lb.style = OI;
const DI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Lb
}, Symbol.toStringTag, { value: "Module" }));
