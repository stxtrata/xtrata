var ty = Object.defineProperty;
var ey = (t, e, n) => e in t ? ty(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var ps = (t, e, n) => ey(t, typeof e != "symbol" ? e + "" : e, n);
var Vt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function wh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function lo(t) {
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
      typeof Vt < "u" && Vt || {}, r = {
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
        ], o = ArrayBuffer.isView || function(b) {
          return b && i.indexOf(Object.prototype.toString.call(b)) > -1;
        };
      function a(b) {
        if (typeof b != "string" && (b = String(b)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(b) || b === "")
          throw new TypeError('Invalid character in header field name: "' + b + '"');
        return b.toLowerCase();
      }
      function c(b) {
        return typeof b != "string" && (b = String(b)), b;
      }
      function l(b) {
        var v = {
          next: function() {
            var T = b.shift();
            return { done: T === void 0, value: T };
          }
        };
        return r.iterable && (v[Symbol.iterator] = function() {
          return v;
        }), v;
      }
      function f(b) {
        this.map = {}, b instanceof f ? b.forEach(function(v, T) {
          this.append(T, v);
        }, this) : Array.isArray(b) ? b.forEach(function(v) {
          if (v.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + v.length);
          this.append(v[0], v[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(v) {
          this.append(v, b[v]);
        }, this);
      }
      f.prototype.append = function(b, v) {
        b = a(b), v = c(v);
        var T = this.map[b];
        this.map[b] = T ? T + ", " + v : v;
      }, f.prototype.delete = function(b) {
        delete this.map[a(b)];
      }, f.prototype.get = function(b) {
        return b = a(b), this.has(b) ? this.map[b] : null;
      }, f.prototype.has = function(b) {
        return this.map.hasOwnProperty(a(b));
      }, f.prototype.set = function(b, v) {
        this.map[a(b)] = c(v);
      }, f.prototype.forEach = function(b, v) {
        for (var T in this.map)
          this.map.hasOwnProperty(T) && b.call(v, this.map[T], T, this);
      }, f.prototype.keys = function() {
        var b = [];
        return this.forEach(function(v, T) {
          b.push(T);
        }), l(b);
      }, f.prototype.values = function() {
        var b = [];
        return this.forEach(function(v) {
          b.push(v);
        }), l(b);
      }, f.prototype.entries = function() {
        var b = [];
        return this.forEach(function(v, T) {
          b.push([T, v]);
        }), l(b);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function u(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function p(b) {
        return new Promise(function(v, T) {
          b.onload = function() {
            v(b.result);
          }, b.onerror = function() {
            T(b.error);
          };
        });
      }
      function h(b) {
        var v = new FileReader(), T = p(v);
        return v.readAsArrayBuffer(b), T;
      }
      function w(b) {
        var v = new FileReader(), T = p(v), g = /charset=([A-Za-z0-9_-]+)/.exec(b.type), C = g ? g[1] : "utf-8";
        return v.readAsText(b, C), T;
      }
      function x(b) {
        for (var v = new Uint8Array(b), T = new Array(v.length), g = 0; g < v.length; g++)
          T[g] = String.fromCharCode(v[g]);
        return T.join("");
      }
      function A(b) {
        if (b.slice)
          return b.slice(0);
        var v = new Uint8Array(b.byteLength);
        return v.set(new Uint8Array(b)), v.buffer;
      }
      function _() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = A(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || o(b)) ? this._bodyArrayBuffer = A(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
              return this.blob().then(h);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var b = u(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return w(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(E);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function y(b) {
        var v = b.toUpperCase();
        return U.indexOf(v) > -1 ? v : b;
      }
      function L(b, v) {
        if (!(this instanceof L))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        v = v || {};
        var T = v.body;
        if (b instanceof L) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, v.headers || (this.headers = new f(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !T && b._bodyInit != null && (T = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = v.credentials || this.credentials || "same-origin", (v.headers || !this.headers) && (this.headers = new f(v.headers)), this.method = y(v.method || this.method || "GET"), this.mode = v.mode || this.mode || null, this.signal = v.signal || this.signal || function() {
          if ("AbortController" in n) {
            var $ = new AbortController();
            return $.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && T)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(T), (this.method === "GET" || this.method === "HEAD") && (v.cache === "no-store" || v.cache === "no-cache")) {
          var g = /([?&])_=[^&]*/;
          if (g.test(this.url))
            this.url = this.url.replace(g, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var C = /\?/;
            this.url += (C.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function E(b) {
        var v = new FormData();
        return b.trim().split("&").forEach(function(T) {
          if (T) {
            var g = T.split("="), C = g.shift().replace(/\+/g, " "), $ = g.join("=").replace(/\+/g, " ");
            v.append(decodeURIComponent(C), decodeURIComponent($));
          }
        }), v;
      }
      function H(b) {
        var v = new f(), T = b.replace(/\r?\n[\t ]+/g, " ");
        return T.split("\r").map(function(g) {
          return g.indexOf(`
`) === 0 ? g.substr(1, g.length) : g;
        }).forEach(function(g) {
          var C = g.split(":"), $ = C.shift().trim();
          if ($) {
            var q = C.join(":").trim();
            try {
              v.append($, q);
            } catch (xt) {
              console.warn("Response " + xt.message);
            }
          }
        }), v;
      }
      _.call(L.prototype);
      function j(b, v) {
        if (!(this instanceof j))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (v || (v = {}), this.type = "default", this.status = v.status === void 0 ? 200 : v.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = v.statusText === void 0 ? "" : "" + v.statusText, this.headers = new f(v.headers), this.url = v.url || "", this._initBody(b);
      }
      _.call(j.prototype), j.prototype.clone = function() {
        return new j(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, j.error = function() {
        var b = new j(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var O = [301, 302, 303, 307, 308];
      j.redirect = function(b, v) {
        if (O.indexOf(v) === -1)
          throw new RangeError("Invalid status code");
        return new j(null, { status: v, headers: { location: b } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(v, T) {
          this.message = v, this.name = T;
          var g = Error(v);
          this.stack = g.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function P(b, v) {
        return new Promise(function(T, g) {
          var C = new L(b, v);
          if (C.signal && C.signal.aborted)
            return g(new e.DOMException("Aborted", "AbortError"));
          var $ = new XMLHttpRequest();
          function q() {
            $.abort();
          }
          $.onload = function() {
            var m = {
              statusText: $.statusText,
              headers: H($.getAllResponseHeaders() || "")
            };
            C.url.indexOf("file://") === 0 && ($.status < 200 || $.status > 599) ? m.status = 200 : m.status = $.status, m.url = "responseURL" in $ ? $.responseURL : m.headers.get("X-Request-URL");
            var M = "response" in $ ? $.response : $.responseText;
            setTimeout(function() {
              T(new j(M, m));
            }, 0);
          }, $.onerror = function() {
            setTimeout(function() {
              g(new TypeError("Network request failed"));
            }, 0);
          }, $.ontimeout = function() {
            setTimeout(function() {
              g(new TypeError("Network request timed out"));
            }, 0);
          }, $.onabort = function() {
            setTimeout(function() {
              g(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function xt(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if ($.open(C.method, xt(C.url), !0), C.credentials === "include" ? $.withCredentials = !0 : C.credentials === "omit" && ($.withCredentials = !1), "responseType" in $ && (r.blob ? $.responseType = "blob" : r.arrayBuffer && ($.responseType = "arraybuffer")), v && typeof v.headers == "object" && !(v.headers instanceof f || n.Headers && v.headers instanceof n.Headers)) {
            var rt = [];
            Object.getOwnPropertyNames(v.headers).forEach(function(m) {
              rt.push(a(m)), $.setRequestHeader(m, c(v.headers[m]));
            }), C.headers.forEach(function(m, M) {
              rt.indexOf(M) === -1 && $.setRequestHeader(M, m);
            });
          } else
            C.headers.forEach(function(m, M) {
              $.setRequestHeader(M, m);
            });
          C.signal && (C.signal.addEventListener("abort", q), $.onreadystatechange = function() {
            $.readyState === 4 && C.signal.removeEventListener("abort", q);
          }), $.send(typeof C._bodyInit > "u" ? null : C._bodyInit);
        });
      }
      return P.polyfill = !0, n.fetch || (n.fetch = P, n.Headers = f, n.Request = L, n.Response = j), e.Headers = f, e.Request = L, e.Response = j, e.fetch = P, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Vt);
})();
const ny = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ry(t, e) {
  const n = {};
  return Object.assign(n, ny, e), await fetch(t, n);
}
function sy(t) {
  let e = ry, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function iy(...t) {
  const { fetchLib: e, middlewares: n } = sy(t);
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
var Dr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Dr || (Dr = {}));
var Zn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Zn || (Zn = {}));
var Zl;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zl || (Zl = {}));
const oy = "https://api.mainnet.hiro.so", ay = "https://api.testnet.hiro.so", cy = "http://localhost:3999", ly = ["mainnet", "testnet", "devnet", "mocknet"];
let Or = class {
  constructor(e) {
    this.version = Zn.Mainnet, this.chainId = Dr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Zn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? iy();
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
Or.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new bh();
    case "testnet":
      return new uy();
    case "devnet":
      return new fy();
    case "mocknet":
      return new xh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${ly.join(", ")}`);
  }
};
Or.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Or.fromName(t);
let bh = class extends Or {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? oy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Zn.Mainnet, this.chainId = Dr.Mainnet;
  }
}, uy = class extends Or {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ay,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Zn.Testnet, this.chainId = Dr.Testnet;
  }
}, xh = class extends Or {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Zn.Testnet, this.chainId = Dr.Testnet;
  }
};
const fy = xh, mh = "xtrata.wallet.bridge.v1", hy = (t) => typeof t == "object" && t !== null && t.protocol === mh, dy = (t) => hy(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", py = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class gs extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Ql = 12e4;
class gy {
  constructor(e) {
    ps(this, "pending", /* @__PURE__ */ new Map());
    ps(this, "listenTarget");
    ps(this, "closed", !1);
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
    ps(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !dy(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new gs("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new gs("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new gs("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = py(), i = { protocol: mh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new gs(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Ql}ms.`
          )
        );
      }, this.options.timeoutMs ?? Ql);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new gs("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const yy = ["SP", "SM"], wy = ["ST", "SN"], by = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return yy.includes(n) ? "mainnet" : wy.includes(n) ? "testnet" : null;
}, xy = () => {
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
}, my = () => typeof window > "u" || !window.localStorage ? xy() : window.localStorage, Xo = "xtrata.v15.1.wallet.session", Jl = "mainnet", Pi = { isConnected: !1 }, Sy = (t) => t.address ? by(t.address) ?? t.network : t.network, Sh = (t) => !t.isConnected || !t.address ? { ...Pi } : Sy(t) !== Jl ? { ...Pi } : {
  isConnected: !0,
  address: t.address,
  network: Jl,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Ey = (t) => {
  if (!t)
    return { ...Pi };
  try {
    const e = JSON.parse(t);
    return Sh(e);
  } catch {
    return { ...Pi };
  }
}, Ay = (t) => {
  const e = Sh(t);
  return JSON.stringify(e);
}, $y = (t) => {
  const e = my();
  return {
    load: () => Ey(e.getItem(Xo)),
    save: (n) => {
      e.setItem(Xo, Ay(n));
    },
    clear: () => {
      e.removeItem(Xo);
    }
  };
}, Iy = "https://browser.blockstack.org/auth", vy = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Eh = ["store_write"], Ly = "blockstack-session", Cy = {
  logLevel: "debug"
}, dr = {
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
Object.freeze(dr);
class rs extends Error {
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
class By extends rs {
  constructor(e, n = "") {
    super({ code: dr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class tu extends rs {
  constructor(e = "") {
    super({ code: dr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ti extends rs {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: dr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class eu extends rs {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: dr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Sa extends rs {
  constructor(e) {
    super({ code: dr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Ah extends rs {
  constructor(e) {
    super({ code: dr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const nu = ["debug", "info", "warn", "error", "none"], Ea = {};
for (let t = 0; t < nu.length; t++) {
  const e = nu[t];
  Ea[e] = t;
}
class kr {
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
    return Ea[Cy.logLevel] <= Ea[e];
  }
}
function My() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function _y() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Zo(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function ky() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Uy() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Ty(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function vc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Uy(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    kr.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Ty(s, t.toString(), n);
    throw kr.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Tn(t, e) {
  return Lc(jt(t), e);
}
function jt(t) {
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
  if (Zt(t, Uint8Array))
    return BigInt(`0x${V(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Hy(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function ru(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Fs(t, e = 8) {
  return (typeof t == "bigint" ? t : jt(t)).toString(16).padStart(e * 2, "0");
}
function uo(t) {
  return parseInt(t, 16);
}
function Lc(t, e = 16) {
  const n = Fs(t, e);
  return ft(n);
}
function Ny(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Py(t, e) {
  return t & BigInt(1) << e;
}
function Aa(t) {
  return Dy(BigInt(`0x${V(t)}`), BigInt(t.byteLength * 8));
}
function Dy(t, e) {
  return Py(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Oy = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function V(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Oy[n];
  return e;
}
function ft(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Hy(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function pr(t) {
  return new TextEncoder().encode(t);
}
function zs(t) {
  return new TextDecoder().decode(t);
}
function jy(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Fy(t) {
  return String.fromCharCode.apply(null, t);
}
function zy(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function su(t) {
  if (t.some(zy))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Te(...t) {
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
function Ut(t) {
  return Te(...t.map((e) => typeof e == "number" ? su([e]) : e instanceof Array ? su(e) : e));
}
function Zt(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const $h = "https://api.mainnet.hiro.so", Ih = "https://api.testnet.hiro.so", vh = "http://localhost:3999", Ry = "https://hub.blockstack.org", Gy = 33, Qo = 32;
function Vy(t) {
  if (t.length < Qo * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Qo * 2), r = t.slice(2 + Qo * 2);
  return {
    recoveryId: uo(e),
    r: n,
    s: r
  };
}
function Cc(t) {
  const e = typeof t == "string" ? ft(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Ky(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function qy(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Wy(t, e) {
  return t[e];
}
function Yy(t, e, n = 0) {
  return t[n] = e, t;
}
function Xy(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Qn(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Zy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Qy(t, e) {
  const n = {};
  return Object.assign(n, Zy, e), await fetch(t, n);
}
function Jy(t) {
  let e = Qy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function t1(...t) {
  const { fetchLib: e, middlewares: n } = Jy(t);
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
class Lh {
  constructor(e = Eh.slice(), n = ((a) => (a = vc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Iy) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function $a(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function e1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ch(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function n1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  $a(t.outputLen), $a(t.blockLen);
}
function r1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function s1(t, e) {
  Ch(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zn = {
  number: $a,
  bool: e1,
  bytes: Ch,
  hash: n1,
  exists: r1,
  output: s1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), $e = (t, e) => t << 32 - e | t >>> e, i1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!i1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function o1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bc(t) {
  if (typeof t == "string" && (t = o1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Bh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function gr(t) {
  const e = (r) => t().update(Bc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Mh = class extends Bh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, zn.hash(e);
    const r = Bc(n);
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
    return zn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    zn.exists(this), zn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const fo = (t, e, n) => new Mh(t, e).update(n).digest();
fo.create = (t, e) => new Mh(t, e);
function a1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Mc = class extends Bh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Jo(this.buffer);
  }
  update(e) {
    zn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Bc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Jo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    zn.exists(this), zn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    a1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Jo(e), c = this.outputLen;
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
const c1 = (t, e, n) => t & e ^ ~t & n, l1 = (t, e, n) => t & e ^ t & n ^ e & n, u1 = new Uint32Array([
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
]), nn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), rn = new Uint32Array(64);
let _h = class extends Mc {
  constructor() {
    super(64, 32, 8, !1), this.A = nn[0] | 0, this.B = nn[1] | 0, this.C = nn[2] | 0, this.D = nn[3] | 0, this.E = nn[4] | 0, this.F = nn[5] | 0, this.G = nn[6] | 0, this.H = nn[7] | 0;
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
      rn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = rn[u - 15], h = rn[u - 2], w = $e(p, 7) ^ $e(p, 18) ^ p >>> 3, x = $e(h, 17) ^ $e(h, 19) ^ h >>> 10;
      rn[u] = x + rn[u - 7] + w + rn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = $e(a, 6) ^ $e(a, 11) ^ $e(a, 25), h = f + p + c1(a, c, l) + u1[u] + rn[u] | 0, x = ($e(r, 2) ^ $e(r, 13) ^ $e(r, 22)) + l1(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    rn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, f1 = class extends _h {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const jr = gr(() => new _h());
gr(() => new f1());
const h1 = {}, kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: h1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const ut = BigInt(0), At = BigInt(1), Mn = BigInt(2), Ss = BigInt(3), iu = BigInt(8), yt = Object.freeze({
  a: ut,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: At,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), ou = (t, e) => (t + e / Mn) / e, ei = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = yt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -At * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = ou(i * t, e), c = ou(-r * t, e);
    let l = N(t - a * n - c * s, e), f = N(-a * r - c * i, e);
    const u = l > o, p = f > o;
    if (u && (l = e - l), p && (f = e - f), l > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: u, k1: l, k2neg: p, k2: f };
  }
}, me = 32, Jn = 32, Uh = 32, Di = me + 1, Oi = 2 * me + 1;
function au(t) {
  const { a: e, b: n } = yt, r = N(t * t), s = N(r * t);
  return N(s + e * t + n);
}
const ni = yt.a === ut;
class _c extends Error {
  constructor(e) {
    super(e);
  }
}
function cu(t) {
  if (!(t instanceof pt))
    throw new TypeError("JacobianPoint expected");
}
class pt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof it))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(it.ZERO) ? pt.ZERO : new pt(e.x, e.y, At);
  }
  static toAffineBatch(e) {
    const n = w1(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return pt.toAffineBatch(e).map(pt.fromAffine);
  }
  equals(e) {
    cu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = N(s * s), l = N(a * a), f = N(n * l), u = N(i * c), p = N(N(r * a) * l), h = N(N(o * s) * c);
    return f === u && p === h;
  }
  negate() {
    return new pt(this.x, N(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = N(e * e), i = N(n * n), o = N(i * i), a = e + i, c = N(Mn * (N(a * a) - s - o)), l = N(Ss * s), f = N(l * l), u = N(f - Mn * c), p = N(l * (c - u) - iu * o), h = N(Mn * n * r);
    return new pt(u, p, h);
  }
  add(e) {
    cu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === ut || o === ut)
      return this;
    if (n === ut || r === ut)
      return e;
    const c = N(s * s), l = N(a * a), f = N(n * l), u = N(i * c), p = N(N(r * a) * l), h = N(N(o * s) * c), w = N(u - f), x = N(h - p);
    if (w === ut)
      return x === ut ? this.double() : pt.ZERO;
    const A = N(w * w), _ = N(w * A), U = N(f * A), y = N(x * x - _ - Mn * U), L = N(x * (U - y) - p * _), E = N(s * a * w);
    return new pt(y, L, E);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = pt.ZERO;
    if (typeof e == "bigint" && e === ut)
      return n;
    let r = fu(e);
    if (r === At)
      return this;
    if (!ni) {
      let u = n, p = this;
      for (; r > ut; )
        r & At && (u = u.add(p)), p = p.double(), r >>= At;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = ei.splitScalar(r), c = n, l = n, f = this;
    for (; i > ut || a > ut; )
      i & At && (c = c.add(f)), a & At && (l = l.add(f)), f = f.double(), i >>= At, a >>= At;
    return s && (c = c.negate()), o && (l = l.negate()), l = new pt(N(l.x * ei.beta), l.y, l.z), c.add(l);
  }
  precomputeWindow(e) {
    const n = ni ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(pt.BASE) && (n = it.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ia.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = pt.normalizeZ(s), Ia.set(n, s)));
    let i = pt.ZERO, o = pt.BASE;
    const a = 1 + (ni ? 128 / r : 256 / r), c = 2 ** (r - 1), l = BigInt(2 ** r - 1), f = 2 ** r, u = BigInt(r);
    for (let p = 0; p < a; p++) {
      const h = p * c;
      let w = Number(e & l);
      e >>= u, w > c && (w -= f, e += At);
      const x = h, A = h + Math.abs(w) - 1, _ = p % 2 !== 0, U = w < 0;
      w === 0 ? o = o.add(ri(_, s[x])) : i = i.add(ri(U, s[A]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = fu(e), s, i;
    if (ni) {
      const { k1neg: o, k1: a, k2neg: c, k2: l } = ei.splitScalar(r);
      let { p: f, f: u } = this.wNAF(a, n), { p, f: h } = this.wNAF(l, n);
      f = ri(o, f), p = ri(c, p), p = new pt(N(p.x * ei.beta), p.y, p.z), s = f.add(p), i = u.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return pt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(pt.ZERO);
    e == null && (e = i ? iu : ss(s));
    const o = e, a = N(o * o), c = N(a * o), l = N(n * a), f = N(r * c), u = N(s * o);
    if (i)
      return it.ZERO;
    if (u !== At)
      throw new Error("invZ was invalid");
    return new it(l, f);
  }
}
pt.BASE = new pt(yt.Gx, yt.Gy, At);
pt.ZERO = new pt(ut, At, ut);
function ri(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ia = /* @__PURE__ */ new WeakMap();
class it {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ia.delete(this);
  }
  hasEvenY() {
    return this.y % Mn === ut;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = se(n ? e : e.subarray(1));
    if (!Ci(r))
      throw new Error("Point is not on curve");
    const s = au(r);
    let i = y1(s);
    const o = (i & At) === At;
    n ? o && (i = N(-i)) : (e[0] & 1) === 1 !== o && (i = N(-i));
    const a = new it(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = se(e.subarray(1, me + 1)), r = se(e.subarray(me + 1, me * 2 + 1)), s = new it(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = He(e), r = n.length, s = n[0];
    if (r === me)
      return this.fromCompressedHex(n);
    if (r === Di && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Oi && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Di} compressed bytes or ${Oi} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return it.BASE.multiply(tr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Nh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = kc(He(e)), { n: a } = yt, c = r === 2 || r === 3 ? s + a : s, l = ss(c, a), f = N(-o * l, a), u = N(i * l, a), p = r & 1 ? "03" : "02", h = it.fromHex(p + _n(c)), w = it.BASE.multiplyAndAddUnsafe(h, f, u);
    if (!w)
      throw new Error("Cannot recover signature: point at infinify");
    return w.assertValidity(), w;
  }
  toRawBytes(e = !1) {
    return kn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = _n(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${_n(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Ci(n) || !Ci(r))
      throw new Error(e);
    const s = N(r * r), i = au(n);
    if (N(s - i) !== ut)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new it(this.x, N(-this.y));
  }
  double() {
    return pt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return pt.fromAffine(this).add(pt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return pt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = pt.fromAffine(this), i = n === ut || n === At || this !== it.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = pt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(pt.ZERO) ? void 0 : a.toAffine();
  }
}
it.BASE = new it(yt.Gx, yt.Gy);
it.ZERO = new it(ut, ut);
function lu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function uu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Fr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: se(n), left: t.subarray(e + 2) };
}
function d1(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Fr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = uu(t.subarray(2)), { data: r, left: s } = uu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Fr(s)}`);
  return { r: e, s: r };
}
class re {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Fr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new re(ji(s.slice(0, 64)), ji(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = d1(n ? e : kn(e));
    return new re(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Rr(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Rr(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = yt.n >> At;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new re(this.r, N(-this.s, yt.n)) : this;
  }
  toDERRawBytes() {
    return kn(this.toDERHex());
  }
  toDERHex() {
    const e = lu(ys(this.s)), n = lu(ys(this.r)), r = e.length / 2, s = n.length / 2, i = ys(r), o = ys(s);
    return `30${ys(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return kn(this.toCompactHex());
  }
  toCompactHex() {
    return _n(this.r) + _n(this.s);
  }
}
function Cn(...t) {
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
const p1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Fr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += p1[t[n]];
  return e;
}
const g1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function _n(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(ut <= t && t < g1))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function zr(t) {
  const e = kn(_n(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ys(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ji(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function kn(t) {
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
function se(t) {
  return ji(Fr(t));
}
function He(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : kn(t);
}
function fu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Rr(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function N(t, e = yt.P) {
  const n = t % e;
  return n >= ut ? n : e + n;
}
function ce(t, e) {
  const { P: n } = yt;
  let r = t;
  for (; e-- > ut; )
    r *= r, r %= n;
  return r;
}
function y1(t) {
  const { P: e } = yt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, l = c * c * t % e, f = ce(l, Ss) * l % e, u = ce(f, Ss) * l % e, p = ce(u, Mn) * c % e, h = ce(p, r) * p % e, w = ce(h, s) * h % e, x = ce(w, o) * w % e, A = ce(x, a) * x % e, _ = ce(A, o) * w % e, U = ce(_, Ss) * l % e, y = ce(U, i) * h % e, L = ce(y, n) * c % e, E = ce(L, Mn);
  if (E * E % e !== t)
    throw new Error("Cannot find square root");
  return E;
}
function ss(t, e = yt.P) {
  if (t === ut || e <= ut)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = N(t, e), r = e, s = ut, i = At;
  for (; n !== ut; ) {
    const a = r / n, c = r % n, l = s - i * a;
    r = n, n = c, s = i, i = l;
  }
  if (r !== At)
    throw new Error("invert: does not exist");
  return N(s, e);
}
function w1(t, e = yt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === ut ? i : (n[a] = i, N(i * o, e)), At), s = ss(r, e);
  return t.reduceRight((i, o, a) => o === ut ? i : (n[a] = N(i * n[a], e), N(i * o, e)), s), n;
}
function b1(t) {
  const e = t.length * 8 - Jn * 8, n = se(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function kc(t, e = !1) {
  const n = b1(t);
  if (e)
    return n;
  const { n: r } = yt;
  return n >= r ? n - r : n;
}
let Pr, Es;
class Th {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Bt.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Es(this.k, ...e);
  }
  checkSync() {
    if (typeof Es != "function")
      throw new _c("hmacSha256Sync needs to be set");
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
    return Cn(...n);
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
    return Cn(...n);
  }
}
function Rr(t) {
  return ut < t && t < yt.n;
}
function Ci(t) {
  return ut < t && t < yt.P;
}
function Hh(t, e, n, r = !0) {
  const { n: s } = yt, i = kc(t, !0);
  if (!Rr(i))
    return;
  const o = ss(i, s), a = it.BASE.multiply(i), c = N(a.x, s);
  if (c === ut)
    return;
  const l = N(o * N(e + n * c, s), s);
  if (l === ut)
    return;
  let f = new re(c, l), u = (a.x === f.r ? 0 : 2) | Number(a.y & At);
  return r && f.hasHighS() && (f = f.normalizeS(), u ^= 1), { sig: f, recovery: u };
}
function tr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Jn)
      throw new Error("Expected 32 bytes of private key");
    e = ji(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Jn)
      throw new Error("Expected 32 bytes of private key");
    e = se(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Rr(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Uc(t) {
  return t instanceof it ? (t.assertValidity(), t) : it.fromHex(t);
}
function Nh(t) {
  if (t instanceof re)
    return t.assertValidity(), t;
  try {
    return re.fromDER(t);
  } catch {
    return re.fromCompact(t);
  }
}
function Rs(t, e = !1) {
  return it.fromPrivateKey(t).toRawBytes(e);
}
function x1(t, e, n, r = !1) {
  return it.fromSignature(t, e, n).toRawBytes(r);
}
function hu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Di || r === Oi : n ? r === Di * 2 || r === Oi * 2 : t instanceof it;
}
function Tc(t, e, n = !1) {
  if (hu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!hu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Uc(e);
  return r.assertValidity(), r.multiply(tr(t)).toRawBytes(n);
}
function Ph(t) {
  const e = t.length > me ? t.slice(0, me) : t;
  return se(e);
}
function m1(t) {
  const e = Ph(t), n = N(e, yt.n);
  return Dh(n < ut ? e : n);
}
function Dh(t) {
  return zr(t);
}
function Oh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = He(t), s = tr(e), i = [Dh(s), m1(r)];
  if (n != null) {
    n === !0 && (n = Bt.randomBytes(me));
    const c = He(n);
    if (c.length !== me)
      throw new Error(`sign: Expected ${me} bytes of extra data`);
    i.push(c);
  }
  const o = Cn(...i), a = Ph(r);
  return { seed: o, m: a, d: s };
}
function jh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function S1(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Oh(t, e, n.extraEntropy), o = new Th(Uh, Jn);
  await o.reseed(r);
  let a;
  for (; !(a = Hh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return jh(a, n);
}
function ho(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Oh(t, e, n.extraEntropy), o = new Th(Uh, Jn);
  o.reseedSync(r);
  let a;
  for (; !(a = Hh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return jh(a, n);
}
const E1 = { strict: !0 };
function A1(t, e, n, r = E1) {
  let s;
  try {
    s = Nh(t), e = He(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = kc(e);
  let c;
  try {
    c = Uc(n);
  } catch {
    return !1;
  }
  const { n: l } = yt, f = ss(o, l), u = N(a * f, l), p = N(i * f, l), h = it.BASE.multiplyAndAddUnsafe(c, u, p);
  return h ? N(h.x, l) === i : !1;
}
function Fi(t) {
  return N(se(t), yt.n);
}
class Gr {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = He(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = se(n.subarray(0, 32)), s = se(n.subarray(32, 64));
    return new Gr(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ci(e) || !Rr(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return _n(this.r) + _n(this.s);
  }
  toRawBytes() {
    return kn(this.toHex());
  }
}
function $1(t) {
  return it.fromPrivateKey(t).toRawX();
}
class Fh {
  constructor(e, n, r = Bt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = He(e);
    const { x: s, scalar: i } = this.getScalar(tr(n));
    if (this.px = s, this.d = i, this.rand = He(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = it.fromPrivateKey(e), r = n.hasEvenY() ? e : yt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return zr(e ^ se(n));
  }
  finalizeNonce(e) {
    const n = N(se(e), yt.n);
    if (n === ut)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Gr(e.x, N(n + r * s, yt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Bt.taggedHash, o = this.initNonce(n, await i(Ln.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(await i(Ln.nonce, o, r, e)), f = Fi(await i(Ln.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return await Gh(u, e, r) || this.error(), u;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Bt.taggedHashSync, o = this.initNonce(n, i(Ln.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(i(Ln.nonce, o, r, e)), f = Fi(i(Ln.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return Vh(u, e, r) || this.error(), u;
  }
}
async function I1(t, e, n) {
  return new Fh(t, e, n).calc();
}
function v1(t, e, n) {
  return new Fh(t, e, n).calcSync();
}
function zh(t, e, n) {
  const r = t instanceof Gr, s = r ? t : Gr.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: He(e),
    P: Uc(n)
  };
}
function Rh(t, e, n, r) {
  const s = it.BASE.multiplyAndAddUnsafe(e, tr(n), N(-r, yt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Gh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = zh(t, e, n), a = Fi(await Bt.taggedHash(Ln.challenge, zr(r), o.toRawX(), i));
    return Rh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Vh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = zh(t, e, n), a = Fi(Bt.taggedHashSync(Ln.challenge, zr(r), o.toRawX(), i));
    return Rh(r, o, s, a);
  } catch (r) {
    if (r instanceof _c)
      throw r;
    return !1;
  }
}
const L1 = {
  Signature: Gr,
  getPublicKey: $1,
  sign: I1,
  verify: Gh,
  signSync: v1,
  verifySync: Vh
};
it.BASE._setWindowSize(8);
const Qt = {
  node: kh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ln = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, si = {}, Bt = {
  bytesToHex: Fr,
  hexToBytes: kn,
  concatBytes: Cn,
  mod: N,
  invert: ss,
  isValidPrivateKey(t) {
    try {
      return tr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: zr,
  _normalizePrivateKey: tr,
  hashToPrivateKey: (t) => {
    t = He(t);
    const e = Jn + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = N(se(t), yt.n - At) + At;
    return zr(n);
  },
  randomBytes: (t = 32) => {
    if (Qt.web)
      return Qt.web.getRandomValues(new Uint8Array(t));
    if (Qt.node) {
      const { randomBytes: e } = Qt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Bt.hashToPrivateKey(Bt.randomBytes(Jn + 8)),
  precompute(t = 8, e = it.BASE) {
    const n = e === it.BASE ? e : new it(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ss), n;
  },
  sha256: async (...t) => {
    if (Qt.web) {
      const e = await Qt.web.subtle.digest("SHA-256", Cn(...t));
      return new Uint8Array(e);
    } else if (Qt.node) {
      const { createHash: e } = Qt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Qt.web) {
      const n = await Qt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Cn(...e), s = await Qt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Qt.node) {
      const { createHmac: n } = Qt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = si[t];
    if (n === void 0) {
      const r = await Bt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Cn(r, r), si[t] = n;
    }
    return Bt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Pr != "function")
      throw new _c("sha256Sync is undefined, you need to set it");
    let n = si[t];
    if (n === void 0) {
      const r = Pr(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Cn(r, r), si[t] = n;
    }
    return Pr(n, ...e);
  },
  _JacobianPoint: pt
};
Object.defineProperties(Bt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Pr;
    },
    set(t) {
      Pr || (Pr = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Es;
    },
    set(t) {
      Es || (Es = t);
    }
  }
});
const C1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: yt,
  Point: it,
  Signature: re,
  getPublicKey: Rs,
  getSharedSecret: Tc,
  recoverPublicKey: x1,
  schnorr: L1,
  sign: S1,
  signSync: ho,
  utils: Bt,
  verify: A1
}, Symbol.toStringTag, { value: "Module" }));
var Gs = {};
Gs.byteLength = U1;
var B1 = Gs.toByteArray = H1, M1 = Gs.fromByteArray = D1, Be = [], ue = [], _1 = typeof Uint8Array < "u" ? Uint8Array : Array, ta = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Cr = 0, k1 = ta.length; Cr < k1; ++Cr)
  Be[Cr] = ta[Cr], ue[ta.charCodeAt(Cr)] = Cr;
ue[45] = 62;
ue[95] = 63;
function Kh(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function U1(t) {
  var e = Kh(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function T1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function H1(t) {
  var e, n = Kh(t), r = n[0], s = n[1], i = new _1(T1(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = ue[t.charCodeAt(c)] << 18 | ue[t.charCodeAt(c + 1)] << 12 | ue[t.charCodeAt(c + 2)] << 6 | ue[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ue[t.charCodeAt(c)] << 2 | ue[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ue[t.charCodeAt(c)] << 10 | ue[t.charCodeAt(c + 1)] << 4 | ue[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function N1(t) {
  return Be[t >> 18 & 63] + Be[t >> 12 & 63] + Be[t >> 6 & 63] + Be[t & 63];
}
function P1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(N1(r));
  return s.join("");
}
function D1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(P1(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Be[e >> 2] + Be[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Be[e >> 10] + Be[e >> 4 & 63] + Be[e << 2 & 63] + "="
  )), s.join("");
}
function O1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const j1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function F1() {
  if (O1())
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
    throw new Error(j1);
  }
}
class z1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Te(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Te(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class R1 {
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
async function qh() {
  const t = await F1();
  return t.name === "subtleCrypto" ? new R1(t.lib) : new z1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function G1(t) {
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
    for (var w = 0, x = 0, A = 0, _ = h.length; A !== _ && h[A] === 0; )
      A++, w++;
    for (var U = (_ - A) * l + 1 >>> 0, y = new Uint8Array(U); A !== _; ) {
      for (var L = h[A], E = 0, H = U - 1; (L !== 0 || E < x) && H !== -1; H--, E++)
        L += 256 * y[H] >>> 0, y[H] = L % o >>> 0, L = L / o >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      x = E, A++;
    }
    for (var j = U - x; j !== U && y[j] === 0; )
      j++;
    for (var O = a.repeat(w); j < U; ++j)
      O += t.charAt(y[j]);
    return O;
  }
  function u(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var w = 0, x = 0, A = 0; h[w] === a; )
      x++, w++;
    for (var _ = (h.length - w) * c + 1 >>> 0, U = new Uint8Array(_); h[w]; ) {
      var y = h.charCodeAt(w);
      if (y > 255)
        return;
      var L = e[y];
      if (L === 255)
        return;
      for (var E = 0, H = _ - 1; (L !== 0 || E < A) && H !== -1; H--, E++)
        L += o * U[H] >>> 0, U[H] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      A = E, w++;
    }
    for (var j = _ - A; j !== _ && U[j] === 0; )
      j++;
    for (var O = new Uint8Array(x + (_ - j)), P = x; j !== _; )
      O[P++] = U[j++];
    return O;
  }
  function p(h) {
    var w = u(h);
    if (w)
      return w;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: u,
    decode: p
  };
}
var Wh = G1;
const V1 = Wh, K1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var q1 = V1(K1);
const W1 = /* @__PURE__ */ wh(q1), Y1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Yh = Uint8Array.from({ length: 16 }, (t, e) => e), X1 = Yh.map((t) => (9 * t + 5) % 16);
let Hc = [Yh], Nc = [X1];
for (let t = 0; t < 4; t++)
  for (let e of [Hc, Nc])
    e.push(e[t].map((n) => Y1[n]));
const Xh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Z1 = Hc.map((t, e) => t.map((n) => Xh[e][n])), Q1 = Nc.map((t, e) => t.map((n) => Xh[e][n])), J1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), tw = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ii = (t, e) => t << e | t >>> 32 - e;
function du(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oi = new Uint32Array(16);
let ew = class extends Mc {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, x = J1[h], A = tw[h], _ = Hc[h], U = Nc[h], y = Z1[h], L = Q1[h];
      for (let E = 0; E < 16; E++) {
        const H = ii(r + du(h, i, a, l) + oi[_[E]] + x, y[E]) + u | 0;
        r = u, u = l, l = ii(a, 10) | 0, a = i, i = H;
      }
      for (let E = 0; E < 16; E++) {
        const H = ii(s + du(w, o, c, f) + oi[U[E]] + A, L[E]) + p | 0;
        s = p, p = f, f = ii(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    oi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const nw = gr(() => new ew());
function rw(t) {
  return nw(t);
}
const ai = BigInt(2 ** 32 - 1), va = BigInt(32);
function Zh(t, e = !1) {
  return e ? { h: Number(t & ai), l: Number(t >> va & ai) } : { h: Number(t >> va & ai) | 0, l: Number(t & ai) | 0 };
}
function sw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Zh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const iw = (t, e) => BigInt(t >>> 0) << va | BigInt(e >>> 0), ow = (t, e, n) => t >>> n, aw = (t, e, n) => t << 32 - n | e >>> n, cw = (t, e, n) => t >>> n | e << 32 - n, lw = (t, e, n) => t << 32 - n | e >>> n, uw = (t, e, n) => t << 64 - n | e >>> n - 32, fw = (t, e, n) => t >>> n - 32 | e << 64 - n, hw = (t, e) => e, dw = (t, e) => t, pw = (t, e, n) => t << n | e >>> 32 - n, gw = (t, e, n) => e << n | t >>> 32 - n, yw = (t, e, n) => e << n - 32 | t >>> 64 - n, ww = (t, e, n) => t << n - 32 | e >>> 64 - n;
function bw(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const xw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), mw = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Sw = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Ew = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Aw = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), $w = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Q = {
  fromBig: Zh,
  split: sw,
  toBig: iw,
  shrSH: ow,
  shrSL: aw,
  rotrSH: cw,
  rotrSL: lw,
  rotrBH: uw,
  rotrBL: fw,
  rotr32H: hw,
  rotr32L: dw,
  rotlSH: pw,
  rotlSL: gw,
  rotlBH: yw,
  rotlBL: ww,
  add: bw,
  add3L: xw,
  add3H: mw,
  add4L: Sw,
  add4H: Ew,
  add5H: $w,
  add5L: Aw
}, [Iw, vw] = Q.split([
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
].map((t) => BigInt(t))), sn = new Uint32Array(80), on = new Uint32Array(80);
let po = class extends Mc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: w, Hh: x, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, w, x, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, w, x, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = x | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      sn[y] = e.getUint32(n), on[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const L = sn[y - 15] | 0, E = on[y - 15] | 0, H = Q.rotrSH(L, E, 1) ^ Q.rotrSH(L, E, 8) ^ Q.shrSH(L, E, 7), j = Q.rotrSL(L, E, 1) ^ Q.rotrSL(L, E, 8) ^ Q.shrSL(L, E, 7), O = sn[y - 2] | 0, P = on[y - 2] | 0, b = Q.rotrSH(O, P, 19) ^ Q.rotrBH(O, P, 61) ^ Q.shrSH(O, P, 6), v = Q.rotrSL(O, P, 19) ^ Q.rotrBL(O, P, 61) ^ Q.shrSL(O, P, 6), T = Q.add4L(j, v, on[y - 7], on[y - 16]), g = Q.add4H(T, H, b, sn[y - 7], sn[y - 16]);
      sn[y] = g | 0, on[y] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: w, Gh: x, Gl: A, Hh: _, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const L = Q.rotrSH(u, p, 14) ^ Q.rotrSH(u, p, 18) ^ Q.rotrBH(u, p, 41), E = Q.rotrSL(u, p, 14) ^ Q.rotrSL(u, p, 18) ^ Q.rotrBL(u, p, 41), H = u & h ^ ~u & x, j = p & w ^ ~p & A, O = Q.add5L(U, E, j, vw[y], on[y]), P = Q.add5H(O, _, L, H, Iw[y], sn[y]), b = O | 0, v = Q.rotrSH(r, s, 28) ^ Q.rotrBH(r, s, 34) ^ Q.rotrBH(r, s, 39), T = Q.rotrSL(r, s, 28) ^ Q.rotrBL(r, s, 34) ^ Q.rotrBL(r, s, 39), g = r & i ^ r & a ^ i & a, C = s & o ^ s & c ^ o & c;
      _ = x | 0, U = A | 0, x = h | 0, A = w | 0, h = u | 0, w = p | 0, { h: u, l: p } = Q.add(l | 0, f | 0, P | 0, b | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const $ = Q.add3L(b, T, C);
      r = Q.add3H($, P, v, g), s = $ | 0;
    }
    ({ h: r, l: s } = Q.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Q.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = Q.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = Q.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: w } = Q.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: x, l: A } = Q.add(this.Gh | 0, this.Gl | 0, x | 0, A | 0), { h: _, l: U } = Q.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, w, x, A, _, U);
  }
  roundClean() {
    sn.fill(0), on.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Lw = class extends po {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Cw = class extends po {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Bw = class extends po {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Mw = gr(() => new po());
gr(() => new Lw());
gr(() => new Cw());
gr(() => new Bw());
function Qh(t) {
  return jr(t);
}
function _w(t) {
  return Mw(t);
}
const kw = 0;
Bt.hmacSha256Sync = (t, ...e) => {
  const n = fo.create(jr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Uw() {
  return V(Bt.randomPrivateKey());
}
function Tw(t) {
  const e = jr(jr(t));
  return W1.encode(Te(t, e).slice(0, t.length + 4));
}
function Hw(t, e) {
  return Tw(Te(new Uint8Array([t]), e.slice(0, 20)));
}
function Jh(t, e = kw) {
  const n = typeof t == "string" ? ft(t) : t, r = rw(Qh(n));
  return Hw(e, r);
}
function td(t) {
  const e = Cc(t);
  return V(Rs(e.slice(0, 32), !0));
}
Bt.hmacSha256Sync = (t, ...e) => {
  const n = fo.create(jr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var zi;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(zi || (zi = {}));
async function Nw(t, e, n) {
  return await (await qh()).encrypt("aes-256-cbc", e, t, n);
}
async function Pw(t, e, n) {
  return await (await qh()).decrypt("aes-256-cbc", e, t, n);
}
function ed(t, e) {
  return fo(jr, t, e);
}
function Dw(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function nd(t) {
  const e = _w(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Ow(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function jw(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: zi.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: zi.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Ow(t))
    return e;
  try {
    return it.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Fw(t, e, n, r) {
  const s = jw(t);
  if (!s.result)
    throw s;
  const i = Bt.randomPrivateKey(), o = Rs(i, !0);
  let a = Tc(i, t, !0);
  a = a.slice(1);
  const c = nd(a), l = Bt.randomBytes(16), f = await Nw(l, c.encryptionKey, e), u = Te(l, o, f), p = ed(c.hmacKey, u);
  let h;
  if (!r || r === "hex")
    h = V(f);
  else if (r === "base64")
    h = M1(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const w = {
    iv: V(l),
    ephemeralPK: V(o),
    cipherText: h,
    mac: V(p),
    wasString: n
  };
  return r && r !== "hex" && (w.cipherTextEncoding = r), w;
}
async function rd(t, e) {
  if (!e.ephemeralPK)
    throw new eu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Tc(t, n, !0);
  r = r.slice(1);
  const s = nd(r), i = ft(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = ft(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = B1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Te(i, ft(n), o), c = ed(s.hmacKey, a), l = ft(e.mac);
  if (!Dw(l, c))
    throw new eu("Decryption failed: failure in MAC check");
  const f = await Pw(i, s.encryptionKey, o);
  return e.wasString ? zs(f) : f;
}
function zw(t, e) {
  const n = typeof e == "string" ? pr(e) : e, r = td(t), s = Qh(n), i = ho(s, t);
  return {
    signature: V(i),
    publicKey: r
  };
}
async function Rw(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = td(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? pr(t) : t, o = await Fw(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = zw(r, a), l = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(l);
  }
  return a;
}
function Gw(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return rd(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Dt = {}, Vr = {}, Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.decode = Rt.encode = Rt.unescape = Rt.escape = Rt.pad = void 0;
const sd = Gs;
function Pc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Rt.pad = Pc;
function id(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Rt.escape = id;
function od(t) {
  return Pc(t).replace(/-/g, "+").replace(/_/g, "/");
}
Rt.unescape = od;
function Vw(t) {
  return id((0, sd.fromByteArray)(new TextEncoder().encode(t)));
}
Rt.encode = Vw;
function Kw(t) {
  return new TextDecoder().decode((0, sd.toByteArray)(Pc(od(t))));
}
Rt.decode = Kw;
var go = {}, yo = {}, ad = {}, cd = {}, wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
wo.crypto = void 0;
wo.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = l, t.clean = f, t.createView = u, t.rotr = p, t.rotl = h, t.byteSwap = w, t.byteSwap32 = x, t.bytesToHex = U, t.hexToBytes = E, t.asyncLoop = j, t.utf8ToBytes = O, t.bytesToUtf8 = P, t.toBytes = b, t.kdfInputToBytes = v, t.concatBytes = T, t.checkOpts = g, t.createHasher = $, t.createOptHasher = q, t.createXOFer = xt, t.randomBytes = rt;
  const e = wo;
  function n(m) {
    return m instanceof Uint8Array || ArrayBuffer.isView(m) && m.constructor.name === "Uint8Array";
  }
  function r(m) {
    if (!Number.isSafeInteger(m) || m < 0)
      throw new Error("positive integer expected, got " + m);
  }
  function s(m, ...M) {
    if (!n(m))
      throw new Error("Uint8Array expected");
    if (M.length > 0 && !M.includes(m.length))
      throw new Error("Uint8Array expected of length " + M + ", got length=" + m.length);
  }
  function i(m) {
    if (typeof m != "function" || typeof m.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(m.outputLen), r(m.blockLen);
  }
  function o(m, M = !0) {
    if (m.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (M && m.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(m, M) {
    s(m);
    const lt = M.outputLen;
    if (m.length < lt)
      throw new Error("digestInto() expects output buffer of length at least " + lt);
  }
  function c(m) {
    return new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
  }
  function l(m) {
    return new Uint32Array(m.buffer, m.byteOffset, Math.floor(m.byteLength / 4));
  }
  function f(...m) {
    for (let M = 0; M < m.length; M++)
      m[M].fill(0);
  }
  function u(m) {
    return new DataView(m.buffer, m.byteOffset, m.byteLength);
  }
  function p(m, M) {
    return m << 32 - M | m >>> M;
  }
  function h(m, M) {
    return m << M | m >>> 32 - M >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function w(m) {
    return m << 24 & 4278190080 | m << 8 & 16711680 | m >>> 8 & 65280 | m >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (m) => m : (m) => w(m), t.byteSwapIfBE = t.swap8IfBE;
  function x(m) {
    for (let M = 0; M < m.length; M++)
      m[M] = w(m[M]);
    return m;
  }
  t.swap32IfBE = t.isLE ? (m) => m : x;
  const A = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", _ = /* @__PURE__ */ Array.from({ length: 256 }, (m, M) => M.toString(16).padStart(2, "0"));
  function U(m) {
    if (s(m), A)
      return m.toHex();
    let M = "";
    for (let lt = 0; lt < m.length; lt++)
      M += _[m[lt]];
    return M;
  }
  const y = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function L(m) {
    if (m >= y._0 && m <= y._9)
      return m - y._0;
    if (m >= y.A && m <= y.F)
      return m - (y.A - 10);
    if (m >= y.a && m <= y.f)
      return m - (y.a - 10);
  }
  function E(m) {
    if (typeof m != "string")
      throw new Error("hex string expected, got " + typeof m);
    if (A)
      return Uint8Array.fromHex(m);
    const M = m.length, lt = M / 2;
    if (M % 2)
      throw new Error("hex string expected, got unpadded hex of length " + M);
    const W = new Uint8Array(lt);
    for (let at = 0, ht = 0; at < lt; at++, ht += 2) {
      const Y = L(m.charCodeAt(ht)), St = L(m.charCodeAt(ht + 1));
      if (Y === void 0 || St === void 0) {
        const Oe = m[ht] + m[ht + 1];
        throw new Error('hex string expected, got non-hex character "' + Oe + '" at index ' + ht);
      }
      W[at] = Y * 16 + St;
    }
    return W;
  }
  const H = async () => {
  };
  t.nextTick = H;
  async function j(m, M, lt) {
    let W = Date.now();
    for (let at = 0; at < m; at++) {
      lt(at);
      const ht = Date.now() - W;
      ht >= 0 && ht < M || (await (0, t.nextTick)(), W += ht);
    }
  }
  function O(m) {
    if (typeof m != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(m));
  }
  function P(m) {
    return new TextDecoder().decode(m);
  }
  function b(m) {
    return typeof m == "string" && (m = O(m)), s(m), m;
  }
  function v(m) {
    return typeof m == "string" && (m = O(m)), s(m), m;
  }
  function T(...m) {
    let M = 0;
    for (let W = 0; W < m.length; W++) {
      const at = m[W];
      s(at), M += at.length;
    }
    const lt = new Uint8Array(M);
    for (let W = 0, at = 0; W < m.length; W++) {
      const ht = m[W];
      lt.set(ht, at), at += ht.length;
    }
    return lt;
  }
  function g(m, M) {
    if (M !== void 0 && {}.toString.call(M) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, M);
  }
  class C {
  }
  t.Hash = C;
  function $(m) {
    const M = (W) => m().update(b(W)).digest(), lt = m();
    return M.outputLen = lt.outputLen, M.blockLen = lt.blockLen, M.create = () => m(), M;
  }
  function q(m) {
    const M = (W, at) => m(at).update(b(W)).digest(), lt = m({});
    return M.outputLen = lt.outputLen, M.blockLen = lt.blockLen, M.create = (W) => m(W), M;
  }
  function xt(m) {
    const M = (W, at) => m(at).update(b(W)).digest(), lt = m({});
    return M.outputLen = lt.outputLen, M.blockLen = lt.blockLen, M.create = (W) => m(W), M;
  }
  t.wrapConstructor = $, t.wrapConstructorWithOpts = q, t.wrapXOFConstructorWithOpts = xt;
  function rt(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(cd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = cd;
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
})(ad);
const Br = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function ld(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function La(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function yr(t, ...e) {
  if (!ld(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function qw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  La(t.outputLen), La(t.blockLen);
}
function Ca(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ud(t, e) {
  yr(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Ww(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Yw(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ri(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Bi(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function ge(t, e) {
  return t << 32 - e | t >>> e;
}
function Xw(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Dc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Oc(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const fd = Dc ? (t) => t : (t) => Oc(t), Zw = fd;
function hd(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Oc(t[e]);
  return t;
}
const Qw = Dc ? (t) => t : hd, dd = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Jw = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tb(t) {
  if (yr(t), dd)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Jw[t[n]];
  return e;
}
const Ge = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function pu(t) {
  if (t >= Ge._0 && t <= Ge._9)
    return t - Ge._0;
  if (t >= Ge.A && t <= Ge.F)
    return t - (Ge.A - 10);
  if (t >= Ge.a && t <= Ge.f)
    return t - (Ge.a - 10);
}
function eb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (dd)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = pu(t.charCodeAt(i)), a = pu(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const pd = async () => {
};
async function nb(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await pd(), r += i);
  }
}
function jc(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function rb(t) {
  return new TextDecoder().decode(t);
}
function Vs(t) {
  return typeof t == "string" && (t = jc(t)), yr(t), t;
}
function sb(t) {
  return typeof t == "string" && (t = jc(t)), yr(t), t;
}
function ib(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    yr(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function ob(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let gd = class {
};
function bo(t) {
  const e = (r) => t().update(Vs(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function yd(t) {
  const e = (r, s) => t(s).update(Vs(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function wd(t) {
  const e = (r, s) => t(s).update(Vs(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const ab = bo, cb = yd, lb = wd;
function ub(t = 32) {
  if (Br && typeof Br.getRandomValues == "function")
    return Br.getRandomValues(new Uint8Array(t));
  if (Br && typeof Br.randomBytes == "function")
    return Uint8Array.from(Br.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const fb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: gd,
  abytes: yr,
  aexists: Ca,
  ahash: qw,
  anumber: La,
  aoutput: ud,
  asyncLoop: nb,
  byteSwap: Oc,
  byteSwap32: hd,
  byteSwapIfBE: Zw,
  bytesToHex: tb,
  bytesToUtf8: rb,
  checkOpts: ob,
  clean: Ri,
  concatBytes: ib,
  createHasher: bo,
  createOptHasher: yd,
  createView: Bi,
  createXOFer: wd,
  hexToBytes: eb,
  isBytes: ld,
  isLE: Dc,
  kdfInputToBytes: sb,
  nextTick: pd,
  randomBytes: ub,
  rotl: Xw,
  rotr: ge,
  swap32IfBE: Qw,
  swap8IfBE: fd,
  toBytes: Vs,
  u32: Yw,
  u8: Ww,
  utf8ToBytes: jc,
  wrapConstructor: ab,
  wrapConstructorWithOpts: cb,
  wrapXOFConstructorWithOpts: lb
}, Symbol.toStringTag, { value: "Module" }));
function hb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
function db(t, e, n) {
  return t & e ^ ~t & n;
}
function pb(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class gb extends gd {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Bi(this.buffer);
  }
  update(e) {
    Ca(this), e = Vs(e), yr(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Bi(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ca(this), ud(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Ri(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    hb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Bi(e), c = this.outputLen;
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
const an = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), cn = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), yb = /* @__PURE__ */ Uint32Array.from([
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
]), ln = /* @__PURE__ */ new Uint32Array(64);
let Fc = class extends gb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = an[0] | 0, this.B = an[1] | 0, this.C = an[2] | 0, this.D = an[3] | 0, this.E = an[4] | 0, this.F = an[5] | 0, this.G = an[6] | 0, this.H = an[7] | 0;
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
      ln[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = ln[u - 15], h = ln[u - 2], w = ge(p, 7) ^ ge(p, 18) ^ p >>> 3, x = ge(h, 17) ^ ge(h, 19) ^ h >>> 10;
      ln[u] = x + ln[u - 7] + w + ln[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = ge(a, 6) ^ ge(a, 11) ^ ge(a, 25), h = f + p + db(a, c, l) + yb[u] + ln[u] | 0, x = (ge(r, 2) ^ ge(r, 13) ^ ge(r, 22)) + pb(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Ri(ln);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ri(this.buffer);
  }
}, bd = class extends Fc {
  constructor() {
    super(28), this.A = cn[0] | 0, this.B = cn[1] | 0, this.C = cn[2] | 0, this.D = cn[3] | 0, this.E = cn[4] | 0, this.F = cn[5] | 0, this.G = cn[6] | 0, this.H = cn[7] | 0;
  }
};
const wb = /* @__PURE__ */ bo(() => new Fc()), bb = /* @__PURE__ */ bo(() => new bd()), xb = Fc, mb = wb, Sb = bd, Eb = bb, Ab = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Sb,
  SHA256: xb,
  sha224: Eb,
  sha256: mb
}, Symbol.toStringTag, { value: "Module" })), xo = /* @__PURE__ */ lo(Ab), $b = /* @__PURE__ */ lo(C1);
var Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.joseToDer = Kr.derToJose = void 0;
const xd = Gs, md = Rt;
function ea(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Ib = {
  ES256: ea(256),
  ES384: ea(384),
  ES512: ea(521)
};
function Sd(t) {
  const e = Ib[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Gi = 128, Ed = 0, vb = 32, Lb = 16, Cb = 2, Ad = Lb | vb | Ed << 6, Vi = Cb | Ed << 6;
function $d(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, xd.toByteArray)((0, md.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Bb(t, e) {
  const n = $d(t), r = Sd(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Ad)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Gi | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Vi)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const l = o;
  if (o += c, n[o++] !== Vi)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const u = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const p = r - c, h = r - f, w = new Uint8Array(p + c + h + f);
  for (o = 0; o < p; ++o)
    w[o] = 0;
  w.set(n.subarray(l + Math.max(-p, 0), l + c), o), o = r;
  for (const x = o; o < x + h; ++o)
    w[o] = 0;
  return w.set(n.subarray(u + Math.max(-h, 0), u + f), o), (0, md.escape)((0, xd.fromByteArray)(w));
}
Kr.derToJose = Bb;
function gu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Gi && --r, r;
}
function Mb(t, e) {
  t = $d(t);
  const n = Sd(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = gu(t, 0, n), i = gu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, l = c < Gi, f = new Uint8Array((l ? 2 : 3) + c);
  let u = 0;
  return f[u++] = Ad, l ? f[u++] = c : (f[u++] = Gi | 1, f[u++] = c & 255), f[u++] = Vi, f[u++] = o, s < 0 ? (f[u++] = 0, f.set(t.subarray(0, n), u), u += n) : (f.set(t.subarray(s, n), u), u += n - s), f[u++] = Vi, f[u++] = a, i < 0 ? (f[u++] = 0, f.set(t.subarray(n), u)) : f.set(t.subarray(n + i), u), f;
}
Kr.joseToDer = Mb;
var Ze = {};
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.InvalidTokenError = Ze.MissingParametersError = void 0;
class _b extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Ze.MissingParametersError = _b;
class kb extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Ze.InvalidTokenError = kb;
const Ks = /* @__PURE__ */ lo(fb);
Object.defineProperty(yo, "__esModule", { value: !0 });
yo.SECP256K1Client = void 0;
const Ub = ad, Tb = xo, Mi = $b, yu = Kr, wu = Ze, bu = Ks;
Mi.utils.hmacSha256Sync = (t, ...e) => {
  const n = Ub.hmac.create(Tb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Id {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, bu.bytesToHex)(Mi.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new wu.MissingParametersError("a signing input hash and private key are all required");
    const s = Mi.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, bu.bytesToHex)(s);
    if (r === "jose")
      return (0, yu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, yu.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new wu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Mi.verify(n, e, r, { strict: !1 });
  }
}
yo.SECP256K1Client = Id;
Id.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = yo;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(go);
var er = {};
const Hb = /* @__PURE__ */ lo(kh);
var Nb = Vt && Vt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(er, "__esModule", { value: !0 });
er.hashSha256Async = er.hashSha256 = void 0;
const Pb = xo;
function vd(t) {
  return (0, Pb.sha256)(t);
}
er.hashSha256 = vd;
function Db(t) {
  return Nb(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Hb;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(vd(t));
    }
  });
}
er.hashSha256Async = Db;
var Ob = Vt && Vt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.TokenSigner = Vr.createUnsecuredToken = void 0;
const Ba = Rt, xu = go, jb = Ze, mu = er;
function Ma(t, e) {
  const n = [], r = Ba.encode(JSON.stringify(e));
  n.push(r);
  const s = Ba.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Fb(t) {
  return Ma(t, { typ: "JWT", alg: "none" }) + ".";
}
Vr.createUnsecuredToken = Fb;
class zb {
  constructor(e, n) {
    if (!(e && n))
      throw new jb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !xu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = xu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Ma(e, s), o = (0, mu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Ob(this, void 0, void 0, function* () {
      const s = this.header(r), i = Ma(e, s), o = yield (0, mu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Ba.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Vr.TokenSigner = zb;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
mo.TokenVerifier = void 0;
const Rb = Rt, Su = go, Gb = Ze, ci = er;
class Vb {
  constructor(e, n) {
    if (!(e && n))
      throw new Gb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Su.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Su.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, ci.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, ci.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Rb.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, ci.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, ci.hashSha256)(r);
      return i(o);
    }
  }
}
mo.TokenVerifier = Vb;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
So.decodeToken = void 0;
const li = Rt;
function Kb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(li.decode(e[0])), r = JSON.parse(li.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = li.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(li.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
So.decodeToken = Kb;
(function(t) {
  var e = Vt && Vt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Vt && Vt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Vr, t), n(mo, t), n(So, t), n(Ze, t), n(go, t);
})(Dt);
function qb(t) {
  return `did:btc-addr:${t}`;
}
function Wb(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new tu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new tu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Ld(t) {
  if (t)
    return Wb(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Yb = "1.4.0";
function Xb() {
  return Uw();
}
function Zb(t, e, n, r = Eh.slice(), s, i = My().getTime(), o = {}) {
  const a = (h) => {
    const w = vc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return w == null ? void 0 : w.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: ky(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Yb,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), l = Dt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [l];
  const f = Jh(l);
  return c.iss = qb(f), new Dt.TokenSigner("ES256k", t).sign(c);
}
async function Eu(t, e) {
  const n = zs(ft(e)), r = JSON.parse(n), s = await rd(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Qb(t) {
  const e = Dt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Dt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Jb(t) {
  const e = Dt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Ld(e.iss);
  if (n.length === 1) {
    if (Jh(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function t2(t) {
  const e = Dt.decodeToken(t).payload;
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
  const e = Dt.decodeToken(t).payload;
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
    Qb(t),
    Jb(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Au = "1.0.0";
class Un {
  constructor(e) {
    this.version = Au, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Au)
      throw new Sa(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Un(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Cd {
  constructor(e) {
    if (e) {
      const n = new Un(e);
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
class $u extends Cd {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Un({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Ah("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Un({})), !0;
  }
}
class Iu extends Cd {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Ly, !localStorage.getItem(this.key)) {
      const r = new Un({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Ah("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Un.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Un({})), !0;
  }
}
var Ms;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ms || (Ms = {}));
var Ki;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ki || (Ki = {}));
Ms.Mainnet;
var Ye;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ye || (Ye = {}));
var _e;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(_e || (_e = {}));
Ye.Mainnet;
const Bd = {
  chainId: Ms.Mainnet,
  transactionVersion: Ye.Mainnet,
  peerNetworkId: Ki.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: _e.MainnetSingleSig,
    multiSig: _e.MainnetMultiSig
  },
  client: { baseUrl: $h }
}, _a = {
  chainId: Ms.Testnet,
  transactionVersion: Ye.Testnet,
  peerNetworkId: Ki.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: _e.TestnetSingleSig,
    multiSig: _e.TestnetMultiSig
  },
  client: { baseUrl: Ih }
}, _i = {
  ..._a,
  addressVersion: { ..._a.addressVersion },
  magicBytes: "id",
  client: { baseUrl: vh }
}, r2 = {
  ..._i,
  addressVersion: { ..._i.addressVersion },
  client: { ..._i.client }
};
function s2(t) {
  switch (t) {
    case "mainnet":
      return Bd;
    case "testnet":
      return _a;
    case "devnet":
      return _i;
    case "mocknet":
      return r2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Md(t) {
  return typeof t == "string" ? s2(t) : t;
}
var vu;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(vu || (vu = {}));
var Lu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Lu || (Lu = {}));
var ye;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ye || (ye = {}));
const na = ["onChainOnly", "offChainOnly", "any"];
na[0] + "", ye.OnChainOnly, na[1] + "", ye.OffChainOnly, na[2] + "", ye.Any, ye.OnChainOnly + "", ye.OnChainOnly, ye.OffChainOnly + "", ye.OffChainOnly, ye.Any + "", ye.Any;
var Cu;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Cu || (Cu = {}));
var Bu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Bu || (Bu = {}));
var Mu;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Mu || (Mu = {}));
var qe;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(qe || (qe = {}));
var _u;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(_u || (_u = {}));
var ku;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ku || (ku = {}));
var Uu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Uu || (Uu = {}));
var Tu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Tu || (Tu = {}));
var Hu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Hu || (Hu = {}));
var Nu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Nu || (Nu = {}));
var Pu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Pu || (Pu = {}));
var Du;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Du || (Du = {}));
var Ou;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ou || (Ou = {}));
function ka(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function i2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function _d(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function o2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ka(t.outputLen), ka(t.blockLen);
}
function a2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function c2(t, e) {
  _d(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Rn = {
  number: ka,
  bool: i2,
  bytes: _d,
  hash: o2,
  exists: a2,
  output: c2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ra = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ie = (t, e) => t << 32 - e | t >>> e, l2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!l2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function u2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function zc(t) {
  if (typeof t == "string" && (t = u2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let kd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wr(t) {
  const e = (r) => t().update(zc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Ud = class extends kd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Rn.hash(e);
    const r = zc(n);
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
    return Rn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Rn.exists(this), Rn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Td = (t, e, n) => new Ud(t, e).update(n).digest();
Td.create = (t, e) => new Ud(t, e);
function f2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Rc = class extends kd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ra(this.buffer);
  }
  update(e) {
    Rn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = zc(e);
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
    Rn.exists(this), Rn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    f2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const h2 = (t, e, n) => t & e ^ ~t & n, d2 = (t, e, n) => t & e ^ t & n ^ e & n, p2 = new Uint32Array([
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
]), un = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fn = new Uint32Array(64);
let Hd = class extends Rc {
  constructor() {
    super(64, 32, 8, !1), this.A = un[0] | 0, this.B = un[1] | 0, this.C = un[2] | 0, this.D = un[3] | 0, this.E = un[4] | 0, this.F = un[5] | 0, this.G = un[6] | 0, this.H = un[7] | 0;
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
      const p = fn[u - 15], h = fn[u - 2], w = Ie(p, 7) ^ Ie(p, 18) ^ p >>> 3, x = Ie(h, 17) ^ Ie(h, 19) ^ h >>> 10;
      fn[u] = x + fn[u - 7] + w + fn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = Ie(a, 6) ^ Ie(a, 11) ^ Ie(a, 25), h = f + p + h2(a, c, l) + p2[u] + fn[u] | 0, x = (Ie(r, 2) ^ Ie(r, 13) ^ Ie(r, 22)) + d2(r, s, i) | 0;
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
}, g2 = class extends Hd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Nd = wr(() => new Hd());
wr(() => new g2());
var br = {}, Gc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Ks;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], l = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (l < 4) {
        const w = n.indexOf(o[h]) >> l;
        let x = 0;
        h !== 0 && (x = n.indexOf(o[h - 1]));
        const A = 1 + l, _ = x % (1 << A) << 5 - A, U = t.c32[w + _];
        l = A, c.unshift(U);
      } else
        l = 0;
    let f = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      f++;
    c = c.slice(f);
    const u = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), p = u ? u[0].length : 0;
    for (let h = 0; h < p; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let w = 0; w < h; w++)
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
    let f = [], u = 0, p = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      p === 4 && (f.unshift(n[u]), p = 0, u = 0);
      const _ = (t.c32.indexOf(o[x]) << p) + u, U = n[_ % 16];
      if (p += 1, u = _ >> 4, u > 1 << p)
        throw new Error("Panic error in decoding.");
      f.unshift(U);
    }
    f.unshift(n[u]), f.length % 2 === 1 && f.unshift("0");
    let h = 0;
    for (let x = 0; x < f.length && f[x] === "0"; x++)
      h++;
    f = f.slice(h - h % 2);
    let w = f.join("");
    for (let x = 0; x < l; x++)
      w = `00${w}`;
    if (a) {
      const x = a * 2 - w.length;
      for (let A = 0; A < x; A += 2)
        w = `00${w}`;
    }
    return w;
  }
  t.c32decode = i;
})(Gc);
var nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.c32checkDecode = nr.c32checkEncode = void 0;
const ju = xo, Fu = Ks, As = Gc;
function Pd(t) {
  const e = (0, ju.sha256)((0, ju.sha256)((0, Fu.hexToBytes)(t)));
  return (0, Fu.bytesToHex)(e.slice(0, 4));
}
function y2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Pd(`${n}${e}`), s = (0, As.c32encode)(`${e}${r}`);
  return `${As.c32[t]}${s}`;
}
nr.c32checkEncode = y2;
function w2(t) {
  t = (0, As.c32normalize)(t);
  const e = (0, As.c32decode)(t.slice(1)), n = t[0], r = As.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Pd(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
nr.c32checkDecode = w2;
var Dd = {}, qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.decode = qr.encode = void 0;
const qi = xo, zu = Ks, Od = Wh, jd = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function b2(t, e = "00") {
  const n = typeof t == "string" ? (0, zu.hexToBytes)(t) : t, r = typeof e == "string" ? (0, zu.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, qi.sha256)((0, qi.sha256)(new Uint8Array([...r, ...n])));
  return Od(jd).encode([...r, ...n, ...s.slice(0, 4)]);
}
qr.encode = b2;
function x2(t) {
  const e = Od(jd).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, qi.sha256)((0, qi.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
qr.decode = x2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = nr, n = qr, r = Ks;
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
    const p = n.decode(f), h = (0, r.bytesToHex)(p.data), w = parseInt((0, r.bytesToHex)(p.prefix), 16);
    let x;
    return u < 0 ? (x = w, s[w] !== void 0 && (x = s[w])) : x = u, o(x, h);
  }
  t.b58ToC32 = c;
  function l(f, u = -1) {
    const p = a(f), h = p[0], w = p[1];
    let x;
    u < 0 ? (x = h, i[h] !== void 0 && (x = i[h])) : x = u;
    let A = x.toString(16);
    return A.length === 1 && (A = `0${A}`), n.encode(w, A);
  }
  t.c32ToB58 = l;
})(Dd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Gc;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = nr;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Dd;
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
})(br);
function m2(t, e) {
  switch (e = Md(e ?? Bd), t) {
    case qe.P2PKH:
      switch (e.transactionVersion) {
        case Ye.Mainnet:
          return _e.MainnetSingleSig;
        case Ye.Testnet:
          return _e.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case qe.P2SH:
    case qe.P2SHNonSequential:
    case qe.P2WPKH:
    case qe.P2WSH:
    case qe.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Ye.Mainnet:
          return _e.MainnetMultiSig;
        case Ye.Testnet:
          return _e.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const S2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fd = Uint8Array.from({ length: 16 }, (t, e) => e), E2 = Fd.map((t) => (9 * t + 5) % 16);
let Vc = [Fd], Kc = [E2];
for (let t = 0; t < 4; t++)
  for (let e of [Vc, Kc])
    e.push(e[t].map((n) => S2[n]));
const zd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), A2 = Vc.map((t, e) => t.map((n) => zd[e][n])), $2 = Kc.map((t, e) => t.map((n) => zd[e][n])), I2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), v2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ui = (t, e) => t << e | t >>> 32 - e;
function Ru(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fi = new Uint32Array(16);
let L2 = class extends Rc {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, x = I2[h], A = v2[h], _ = Vc[h], U = Kc[h], y = A2[h], L = $2[h];
      for (let E = 0; E < 16; E++) {
        const H = ui(r + Ru(h, i, a, l) + fi[_[E]] + x, y[E]) + u | 0;
        r = u, u = l, l = ui(a, 10) | 0, a = i, i = H;
      }
      for (let E = 0; E < 16; E++) {
        const H = ui(s + Ru(w, o, c, f) + fi[U[E]] + A, L[E]) + p | 0;
        s = p, p = f, f = ui(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    fi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const C2 = wr(() => new L2()), hi = BigInt(2 ** 32 - 1), Ua = BigInt(32);
function Rd(t, e = !1) {
  return e ? { h: Number(t & hi), l: Number(t >> Ua & hi) } : { h: Number(t >> Ua & hi) | 0, l: Number(t & hi) | 0 };
}
function B2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Rd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const M2 = (t, e) => BigInt(t >>> 0) << Ua | BigInt(e >>> 0), _2 = (t, e, n) => t >>> n, k2 = (t, e, n) => t << 32 - n | e >>> n, U2 = (t, e, n) => t >>> n | e << 32 - n, T2 = (t, e, n) => t << 32 - n | e >>> n, H2 = (t, e, n) => t << 64 - n | e >>> n - 32, N2 = (t, e, n) => t >>> n - 32 | e << 64 - n, P2 = (t, e) => e, D2 = (t, e) => t, O2 = (t, e, n) => t << n | e >>> 32 - n, j2 = (t, e, n) => e << n | t >>> 32 - n, F2 = (t, e, n) => e << n - 32 | t >>> 64 - n, z2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function R2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const G2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), V2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, K2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), q2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, W2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Y2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, J = {
  fromBig: Rd,
  split: B2,
  toBig: M2,
  shrSH: _2,
  shrSL: k2,
  rotrSH: U2,
  rotrSL: T2,
  rotrBH: H2,
  rotrBL: N2,
  rotr32H: P2,
  rotr32L: D2,
  rotlSH: O2,
  rotlSL: j2,
  rotlBH: F2,
  rotlBL: z2,
  add: R2,
  add3L: G2,
  add3H: V2,
  add4L: K2,
  add4H: q2,
  add5H: Y2,
  add5L: W2
}, [X2, Z2] = J.split([
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
let Eo = class extends Rc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: w, Hh: x, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, w, x, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, w, x, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = x | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      hn[y] = e.getUint32(n), dn[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const L = hn[y - 15] | 0, E = dn[y - 15] | 0, H = J.rotrSH(L, E, 1) ^ J.rotrSH(L, E, 8) ^ J.shrSH(L, E, 7), j = J.rotrSL(L, E, 1) ^ J.rotrSL(L, E, 8) ^ J.shrSL(L, E, 7), O = hn[y - 2] | 0, P = dn[y - 2] | 0, b = J.rotrSH(O, P, 19) ^ J.rotrBH(O, P, 61) ^ J.shrSH(O, P, 6), v = J.rotrSL(O, P, 19) ^ J.rotrBL(O, P, 61) ^ J.shrSL(O, P, 6), T = J.add4L(j, v, dn[y - 7], dn[y - 16]), g = J.add4H(T, H, b, hn[y - 7], hn[y - 16]);
      hn[y] = g | 0, dn[y] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: w, Gh: x, Gl: A, Hh: _, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const L = J.rotrSH(u, p, 14) ^ J.rotrSH(u, p, 18) ^ J.rotrBH(u, p, 41), E = J.rotrSL(u, p, 14) ^ J.rotrSL(u, p, 18) ^ J.rotrBL(u, p, 41), H = u & h ^ ~u & x, j = p & w ^ ~p & A, O = J.add5L(U, E, j, Z2[y], dn[y]), P = J.add5H(O, _, L, H, X2[y], hn[y]), b = O | 0, v = J.rotrSH(r, s, 28) ^ J.rotrBH(r, s, 34) ^ J.rotrBH(r, s, 39), T = J.rotrSL(r, s, 28) ^ J.rotrBL(r, s, 34) ^ J.rotrBL(r, s, 39), g = r & i ^ r & a ^ i & a, C = s & o ^ s & c ^ o & c;
      _ = x | 0, U = A | 0, x = h | 0, A = w | 0, h = u | 0, w = p | 0, { h: u, l: p } = J.add(l | 0, f | 0, P | 0, b | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const $ = J.add3L(b, T, C);
      r = J.add3H($, P, v, g), s = $ | 0;
    }
    ({ h: r, l: s } = J.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = J.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = J.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = J.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = J.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: w } = J.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: x, l: A } = J.add(this.Gh | 0, this.Gl | 0, x | 0, A | 0), { h: _, l: U } = J.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, w, x, A, _, U);
  }
  roundClean() {
    hn.fill(0), dn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Q2 = class extends Eo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, J2 = class extends Eo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, tx = class extends Eo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
wr(() => new Eo());
wr(() => new Q2());
wr(() => new J2());
wr(() => new tx());
var Wi = { exports: {} };
Wi.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", l = "[object Error]", f = "[object Function]", u = "[object GeneratorFunction]", p = "[object Map]", h = "[object Number]", w = "[object Object]", x = "[object Promise]", A = "[object RegExp]", _ = "[object Set]", U = "[object String]", y = "[object Symbol]", L = "[object WeakMap]", E = "[object ArrayBuffer]", H = "[object DataView]", j = "[object Float32Array]", O = "[object Float64Array]", P = "[object Int8Array]", b = "[object Int16Array]", v = "[object Int32Array]", T = "[object Uint8Array]", g = "[object Uint8ClampedArray]", C = "[object Uint16Array]", $ = "[object Uint32Array]", q = /[\\^$.*+?()[\]{}|]/g, xt = /\w*$/, rt = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, M = {};
  M[i] = M[o] = M[E] = M[H] = M[a] = M[c] = M[j] = M[O] = M[P] = M[b] = M[v] = M[p] = M[h] = M[w] = M[A] = M[_] = M[U] = M[y] = M[T] = M[g] = M[C] = M[$] = !0, M[l] = M[f] = M[L] = !1;
  var lt = typeof Vt == "object" && Vt && Vt.Object === Object && Vt, W = typeof self == "object" && self && self.Object === Object && self, at = lt || W || Function("return this")(), ht = e && !e.nodeType && e, Y = ht && !0 && t && !t.nodeType && t, St = Y && Y.exports === ht;
  function Oe(d, S) {
    return d.set(S[0], S[1]), d;
  }
  function us(d, S) {
    return d.add(S), d;
  }
  function fs(d, S) {
    for (var B = -1, z = d ? d.length : 0; ++B < z && S(d[B], B, d) !== !1; )
      ;
    return d;
  }
  function pe(d, S) {
    for (var B = -1, z = S.length, Pt = d.length; ++B < z; )
      d[Pt + B] = S[B];
    return d;
  }
  function tn(d, S, B, z) {
    for (var Pt = -1, qt = d ? d.length : 0; ++Pt < qt; )
      B = S(B, d[Pt], Pt, d);
    return B;
  }
  function Ar(d, S) {
    for (var B = -1, z = Array(d); ++B < d; )
      z[B] = S(B);
    return z;
  }
  function en(d, S) {
    return d == null ? void 0 : d[S];
  }
  function je(d) {
    var S = !1;
    if (d != null && typeof d.toString != "function")
      try {
        S = !!(d + "");
      } catch {
      }
    return S;
  }
  function X(d) {
    var S = -1, B = Array(d.size);
    return d.forEach(function(z, Pt) {
      B[++S] = [Pt, z];
    }), B;
  }
  function Mt(d, S) {
    return function(B) {
      return d(S(B));
    };
  }
  function Ae(d) {
    var S = -1, B = Array(d.size);
    return d.forEach(function(z) {
      B[++S] = z;
    }), B;
  }
  var Oo = Array.prototype, jo = Function.prototype, I = Object.prototype, F = at["__core-js_shared__"], K = function() {
    var d = /[^.]+$/.exec(F && F.keys && F.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), G = jo.toString, dt = I.hasOwnProperty, _t = I.toString, Ft = RegExp(
    "^" + G.call(dt).replace(q, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), oe = St ? at.Buffer : void 0, Fe = at.Symbol, ae = at.Uint8Array, Kp = Mt(Object.getPrototypeOf, Object), qp = Object.create, Wp = I.propertyIsEnumerable, Yp = Oo.splice, Pl = Object.getOwnPropertySymbols, Xp = oe ? oe.isBuffer : void 0, Zp = Mt(Object.keys, Object), Fo = vr(at, "DataView"), hs = vr(at, "Map"), zo = vr(at, "Promise"), Ro = vr(at, "Set"), Go = vr(at, "WeakMap"), ds = vr(Object, "create"), Qp = On(Fo), Jp = On(hs), tg = On(zo), eg = On(Ro), ng = On(Go), Dl = Fe ? Fe.prototype : void 0, Ol = Dl ? Dl.valueOf : void 0;
  function Pn(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var z = d[S];
      this.set(z[0], z[1]);
    }
  }
  function rg() {
    this.__data__ = ds ? ds(null) : {};
  }
  function sg(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function ig(d) {
    var S = this.__data__;
    if (ds) {
      var B = S[d];
      return B === r ? void 0 : B;
    }
    return dt.call(S, d) ? S[d] : void 0;
  }
  function og(d) {
    var S = this.__data__;
    return ds ? S[d] !== void 0 : dt.call(S, d);
  }
  function ag(d, S) {
    var B = this.__data__;
    return B[d] = ds && S === void 0 ? r : S, this;
  }
  Pn.prototype.clear = rg, Pn.prototype.delete = sg, Pn.prototype.get = ig, Pn.prototype.has = og, Pn.prototype.set = ag;
  function ze(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var z = d[S];
      this.set(z[0], z[1]);
    }
  }
  function cg() {
    this.__data__ = [];
  }
  function lg(d) {
    var S = this.__data__, B = Xs(S, d);
    if (B < 0)
      return !1;
    var z = S.length - 1;
    return B == z ? S.pop() : Yp.call(S, B, 1), !0;
  }
  function ug(d) {
    var S = this.__data__, B = Xs(S, d);
    return B < 0 ? void 0 : S[B][1];
  }
  function fg(d) {
    return Xs(this.__data__, d) > -1;
  }
  function hg(d, S) {
    var B = this.__data__, z = Xs(B, d);
    return z < 0 ? B.push([d, S]) : B[z][1] = S, this;
  }
  ze.prototype.clear = cg, ze.prototype.delete = lg, ze.prototype.get = ug, ze.prototype.has = fg, ze.prototype.set = hg;
  function $r(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var z = d[S];
      this.set(z[0], z[1]);
    }
  }
  function dg() {
    this.__data__ = {
      hash: new Pn(),
      map: new (hs || ze)(),
      string: new Pn()
    };
  }
  function pg(d) {
    return Zs(this, d).delete(d);
  }
  function gg(d) {
    return Zs(this, d).get(d);
  }
  function yg(d) {
    return Zs(this, d).has(d);
  }
  function wg(d, S) {
    return Zs(this, d).set(d, S), this;
  }
  $r.prototype.clear = dg, $r.prototype.delete = pg, $r.prototype.get = gg, $r.prototype.has = yg, $r.prototype.set = wg;
  function Ir(d) {
    this.__data__ = new ze(d);
  }
  function bg() {
    this.__data__ = new ze();
  }
  function xg(d) {
    return this.__data__.delete(d);
  }
  function mg(d) {
    return this.__data__.get(d);
  }
  function Sg(d) {
    return this.__data__.has(d);
  }
  function Eg(d, S) {
    var B = this.__data__;
    if (B instanceof ze) {
      var z = B.__data__;
      if (!hs || z.length < n - 1)
        return z.push([d, S]), this;
      B = this.__data__ = new $r(z);
    }
    return B.set(d, S), this;
  }
  Ir.prototype.clear = bg, Ir.prototype.delete = xg, Ir.prototype.get = mg, Ir.prototype.has = Sg, Ir.prototype.set = Eg;
  function Ag(d, S) {
    var B = qo(d) || qg(d) ? Ar(d.length, String) : [], z = B.length, Pt = !!z;
    for (var qt in d)
      dt.call(d, qt) && !(Pt && (qt == "length" || Rg(qt, z))) && B.push(qt);
    return B;
  }
  function jl(d, S, B) {
    var z = d[S];
    (!(dt.call(d, S) && Gl(z, B)) || B === void 0 && !(S in d)) && (d[S] = B);
  }
  function Xs(d, S) {
    for (var B = d.length; B--; )
      if (Gl(d[B][0], S))
        return B;
    return -1;
  }
  function $g(d, S) {
    return d && Fl(S, Wo(S), d);
  }
  function Vo(d, S, B, z, Pt, qt, Re) {
    var Wt;
    if (z && (Wt = qt ? z(d, Pt, qt, Re) : z(d)), Wt !== void 0)
      return Wt;
    if (!Qs(d))
      return d;
    var ql = qo(d);
    if (ql) {
      if (Wt = jg(d), !S)
        return Pg(d, Wt);
    } else {
      var Lr = Dn(d), Wl = Lr == f || Lr == u;
      if (Yg(d))
        return Mg(d, S);
      if (Lr == w || Lr == i || Wl && !qt) {
        if (je(d))
          return qt ? d : {};
        if (Wt = Fg(Wl ? {} : d), !S)
          return Dg(d, $g(Wt, d));
      } else {
        if (!M[Lr])
          return qt ? d : {};
        Wt = zg(d, Lr, Vo, S);
      }
    }
    Re || (Re = new Ir());
    var Yl = Re.get(d);
    if (Yl)
      return Yl;
    if (Re.set(d, Wt), !ql)
      var Xl = B ? Og(d) : Wo(d);
    return fs(Xl || d, function(Yo, Js) {
      Xl && (Js = Yo, Yo = d[Js]), jl(Wt, Js, Vo(Yo, S, B, z, Js, d, Re));
    }), Wt;
  }
  function Ig(d) {
    return Qs(d) ? qp(d) : {};
  }
  function vg(d, S, B) {
    var z = S(d);
    return qo(d) ? z : pe(z, B(d));
  }
  function Lg(d) {
    return _t.call(d);
  }
  function Cg(d) {
    if (!Qs(d) || Vg(d))
      return !1;
    var S = Kl(d) || je(d) ? Ft : rt;
    return S.test(On(d));
  }
  function Bg(d) {
    if (!Rl(d))
      return Zp(d);
    var S = [];
    for (var B in Object(d))
      dt.call(d, B) && B != "constructor" && S.push(B);
    return S;
  }
  function Mg(d, S) {
    if (S)
      return d.slice();
    var B = new d.constructor(d.length);
    return d.copy(B), B;
  }
  function Ko(d) {
    var S = new d.constructor(d.byteLength);
    return new ae(S).set(new ae(d)), S;
  }
  function _g(d, S) {
    var B = S ? Ko(d.buffer) : d.buffer;
    return new d.constructor(B, d.byteOffset, d.byteLength);
  }
  function kg(d, S, B) {
    var z = S ? B(X(d), !0) : X(d);
    return tn(z, Oe, new d.constructor());
  }
  function Ug(d) {
    var S = new d.constructor(d.source, xt.exec(d));
    return S.lastIndex = d.lastIndex, S;
  }
  function Tg(d, S, B) {
    var z = S ? B(Ae(d), !0) : Ae(d);
    return tn(z, us, new d.constructor());
  }
  function Hg(d) {
    return Ol ? Object(Ol.call(d)) : {};
  }
  function Ng(d, S) {
    var B = S ? Ko(d.buffer) : d.buffer;
    return new d.constructor(B, d.byteOffset, d.length);
  }
  function Pg(d, S) {
    var B = -1, z = d.length;
    for (S || (S = Array(z)); ++B < z; )
      S[B] = d[B];
    return S;
  }
  function Fl(d, S, B, z) {
    B || (B = {});
    for (var Pt = -1, qt = S.length; ++Pt < qt; ) {
      var Re = S[Pt], Wt = void 0;
      jl(B, Re, Wt === void 0 ? d[Re] : Wt);
    }
    return B;
  }
  function Dg(d, S) {
    return Fl(d, zl(d), S);
  }
  function Og(d) {
    return vg(d, Wo, zl);
  }
  function Zs(d, S) {
    var B = d.__data__;
    return Gg(S) ? B[typeof S == "string" ? "string" : "hash"] : B.map;
  }
  function vr(d, S) {
    var B = en(d, S);
    return Cg(B) ? B : void 0;
  }
  var zl = Pl ? Mt(Pl, Object) : Qg, Dn = Lg;
  (Fo && Dn(new Fo(new ArrayBuffer(1))) != H || hs && Dn(new hs()) != p || zo && Dn(zo.resolve()) != x || Ro && Dn(new Ro()) != _ || Go && Dn(new Go()) != L) && (Dn = function(d) {
    var S = _t.call(d), B = S == w ? d.constructor : void 0, z = B ? On(B) : void 0;
    if (z)
      switch (z) {
        case Qp:
          return H;
        case Jp:
          return p;
        case tg:
          return x;
        case eg:
          return _;
        case ng:
          return L;
      }
    return S;
  });
  function jg(d) {
    var S = d.length, B = d.constructor(S);
    return S && typeof d[0] == "string" && dt.call(d, "index") && (B.index = d.index, B.input = d.input), B;
  }
  function Fg(d) {
    return typeof d.constructor == "function" && !Rl(d) ? Ig(Kp(d)) : {};
  }
  function zg(d, S, B, z) {
    var Pt = d.constructor;
    switch (S) {
      case E:
        return Ko(d);
      case a:
      case c:
        return new Pt(+d);
      case H:
        return _g(d, z);
      case j:
      case O:
      case P:
      case b:
      case v:
      case T:
      case g:
      case C:
      case $:
        return Ng(d, z);
      case p:
        return kg(d, z, B);
      case h:
      case U:
        return new Pt(d);
      case A:
        return Ug(d);
      case _:
        return Tg(d, z, B);
      case y:
        return Hg(d);
    }
  }
  function Rg(d, S) {
    return S = S ?? s, !!S && (typeof d == "number" || m.test(d)) && d > -1 && d % 1 == 0 && d < S;
  }
  function Gg(d) {
    var S = typeof d;
    return S == "string" || S == "number" || S == "symbol" || S == "boolean" ? d !== "__proto__" : d === null;
  }
  function Vg(d) {
    return !!K && K in d;
  }
  function Rl(d) {
    var S = d && d.constructor, B = typeof S == "function" && S.prototype || I;
    return d === B;
  }
  function On(d) {
    if (d != null) {
      try {
        return G.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function Kg(d) {
    return Vo(d, !0, !0);
  }
  function Gl(d, S) {
    return d === S || d !== d && S !== S;
  }
  function qg(d) {
    return Wg(d) && dt.call(d, "callee") && (!Wp.call(d, "callee") || _t.call(d) == i);
  }
  var qo = Array.isArray;
  function Vl(d) {
    return d != null && Xg(d.length) && !Kl(d);
  }
  function Wg(d) {
    return Zg(d) && Vl(d);
  }
  var Yg = Xp || Jg;
  function Kl(d) {
    var S = Qs(d) ? _t.call(d) : "";
    return S == f || S == u;
  }
  function Xg(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function Qs(d) {
    var S = typeof d;
    return !!d && (S == "object" || S == "function");
  }
  function Zg(d) {
    return !!d && typeof d == "object";
  }
  function Wo(d) {
    return Vl(d) ? Ag(d) : Bg(d);
  }
  function Qg() {
    return [];
  }
  function Jg() {
    return !1;
  }
  t.exports = Kg;
})(Wi, Wi.exports);
var ex = Wi.exports;
const Gd = /* @__PURE__ */ wh(ex);
var Ta;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ta || (Ta = {}));
function nx(t, e) {
  return { type: Ta.Address, version: t, hash160: e };
}
function rx(t) {
  return br.c32address(t.version, t.hash160);
}
const sx = (t) => C2(Nd(t)), ix = (t) => V(sx(t));
Bt.hmacSha256Sync = (t, ...e) => {
  const n = Td.create(Nd, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ox(t, e = "mainnet") {
  e = Md(e), t = typeof t == "string" ? ft(t) : t;
  const n = m2(qe.P2PKH, e), r = nx(n, ix(t));
  return rx(r);
}
function ax(t, e) {
  const n = Dt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = ox(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Dt.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function cx(t, e = null) {
  let n;
  e ? n = ax(t, e) : n = Dt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Gu = "_blockstackDidCheckEchoReply", lx = "echoReply", ux = "authContinuation";
function fx(t) {
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
  const e = t[Gu];
  if (typeof e == "boolean")
    return e;
  const n = fx(t.location.search), r = n[lx];
  if (r) {
    t[Gu] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[ux];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Ha {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Lh();
    else
      throw new By("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Iu(e.sessionOptions) : this.store = new Iu() : e ? this.store = new $u(e.sessionOptions) : this.store = new $u();
  }
  makeAuthRequestToken(e, n, r, s, i, o = _y().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Sa("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Zb(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Xb();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = vc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (hx())
        return kr.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      kr.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = t1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ti("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Dt.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await n2(e))
      throw new ti("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Zo(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Eu(s, i.private_key);
          } catch {
            if (kr.warn("Failed decryption of appPrivateKey, will try to use as given"), !Bt.isValidPrivateKey(i.private_key))
              throw new ti("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Eu(s, c);
          } catch {
            kr.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ti("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let l = Ry, f;
    Zo(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (l = i.hubUrl), Zo(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const u = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Ld(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: l,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, p = i.profile_url;
    if (!u.profile && p) {
      const h = await n(p);
      if (!h.ok)
        u.profile = Object.assign({}, vy);
      else {
        const w = await h.text(), x = JSON.parse(w);
        u.profile = cx(x[0].token);
      }
    } else
      u.profile = i.profile;
    return r.userData = u, this.store.setSessionData(r), u;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Sa("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Rw(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Gw(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Ha.prototype.makeAuthRequest = Ha.prototype.makeAuthRequestToken;
const dx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], px = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = dx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Ao(r.id));
  return e.concat(n);
}, Ao = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Vd = "STX_PROVIDER", rr = () => typeof window > "u" ? null : window.localStorage.getItem(Vd), gx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Vd, t);
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
function xx(...t) {
  const { fetchLib: e, middlewares: n } = bx(t);
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
var Wr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Wr || (Wr = {}));
var sr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(sr || (sr = {}));
var Vu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Vu || (Vu = {}));
const mx = "https://api.mainnet.hiro.so", Sx = "https://api.testnet.hiro.so", Ex = "http://localhost:3999", Ax = ["mainnet", "testnet", "devnet", "mocknet"];
class ir {
  constructor(e) {
    this.version = sr.Mainnet, this.chainId = Wr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === sr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
ir.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Na();
    case "testnet":
      return new Pa();
    case "devnet":
      return new $x();
    case "mocknet":
      return new Kd();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ax.join(", ")}`);
  }
};
ir.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ir.fromName(t);
class Na extends ir {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? mx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = sr.Mainnet, this.chainId = Wr.Mainnet;
  }
}
class Pa extends ir {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = sr.Testnet, this.chainId = Wr.Testnet;
  }
}
class Kd extends ir {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ex,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = sr.Testnet, this.chainId = Wr.Testnet;
  }
}
const $x = Kd;
var or;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(or || (or = {}));
var Yi;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Yi || (Yi = {}));
or.Mainnet;
var ar;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ar || (ar = {}));
var cr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(cr || (cr = {}));
ar.Mainnet;
const Ix = {
  chainId: or.Mainnet,
  transactionVersion: ar.Mainnet,
  peerNetworkId: Yi.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: cr.MainnetSingleSig,
    multiSig: cr.MainnetMultiSig
  },
  client: { baseUrl: $h }
}, Da = {
  chainId: or.Testnet,
  transactionVersion: ar.Testnet,
  peerNetworkId: Yi.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: cr.TestnetSingleSig,
    multiSig: cr.TestnetMultiSig
  },
  client: { baseUrl: Ih }
}, ki = {
  ...Da,
  addressVersion: { ...Da.addressVersion },
  magicBytes: "id",
  client: { baseUrl: vh }
}, vx = {
  ...ki,
  addressVersion: { ...ki.addressVersion },
  client: { ...ki.client }
};
function Lx(t) {
  switch (t) {
    case "mainnet":
      return Ix;
    case "testnet":
      return Da;
    case "devnet":
      return ki;
    case "mocknet":
      return vx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Cx(t) {
  return typeof t == "string" ? Lx(t) : t;
}
function Bx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ku = /* @__PURE__ */ new Map();
function qd(t, e) {
  const n = Ku.get(t);
  if (n !== void 0)
    return n(e);
  const r = Bx(t);
  return Ku.set(t, r), qd(t, e);
}
let mt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? ft(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Xy(this.readBytes(4), 0);
  }
  readUInt8() {
    return Wy(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Ky(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = V(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = V(n);
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
    if (qd(e, r))
      return r;
    throw n(r);
  }
};
const Mx = 128, _x = 128, Wd = 16, Wn = 32, Oa = 80, $o = 65, kx = 32, Ux = 64, Xi = 34, Tx = 1 + 16 * 1024 * 1024, Hx = 165, Nx = 16, Px = 16, Dx = 20, Ox = Px + 2 + Dx, jx = Ox + 4, Fx = Tx + (Hx + Nx * jx);
var gt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(gt || (gt = {}));
var ja;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ja || (ja = {}));
var Jt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Jt || (Jt = {}));
const sa = ["onChainOnly", "offChainOnly", "any"];
sa[0] + "", Jt.OnChainOnly, sa[1] + "", Jt.OffChainOnly, sa[2] + "", Jt.Any, Jt.OnChainOnly + "", Jt.OnChainOnly, Jt.OffChainOnly + "", Jt.OffChainOnly, Jt.Any + "", Jt.Any;
var Zi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Zi || (Zi = {}));
var Et;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Et || (Et = {}));
var Lt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Lt || (Lt = {}));
var wt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(wt || (wt = {}));
var It;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(It || (It = {}));
var $s;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})($s || ($s = {}));
var Fa;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Fa || (Fa = {}));
var za;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(za || (za = {}));
var Gt;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Gt || (Gt = {}));
var qu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qu || (qu = {}));
var Ra;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ra || (Ra = {}));
var be;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(be || (be = {}));
var Wu;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Wu || (Wu = {}));
let Io = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ur = class extends Io {
  constructor(e) {
    super(e);
  }
}, zt = class extends Io {
  constructor(e) {
    super(e);
  }
}, Qi = class extends Io {
  constructor(e) {
    super(e);
  }
}, Gn = class extends Io {
  constructor(e) {
    super(e);
  }
};
function Ga(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function zx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Yd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Rx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ga(t.outputLen), Ga(t.blockLen);
}
function Gx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Vx(t, e) {
  Yd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Vn = {
  number: Ga,
  bool: zx,
  bytes: Yd,
  hash: Rx,
  exists: Gx,
  output: Vx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ia = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ve = (t, e) => t << 32 - e | t >>> e, Kx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Kx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function qx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function qc(t) {
  if (typeof t == "string" && (t = qx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Xd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function xr(t) {
  const e = (r) => t().update(qc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Zd = class extends Xd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Vn.hash(e);
    const r = qc(n);
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
    return Vn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Vn.exists(this), Vn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Qd = (t, e, n) => new Zd(t, e).update(n).digest();
Qd.create = (t, e) => new Zd(t, e);
function Wx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Wc = class extends Xd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ia(this.buffer);
  }
  update(e) {
    Vn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = qc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ia(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Vn.exists(this), Vn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Wx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ia(e), c = this.outputLen;
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
const Yx = (t, e, n) => t & e ^ ~t & n, Xx = (t, e, n) => t & e ^ t & n ^ e & n, Zx = new Uint32Array([
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
let Jd = class extends Wc {
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
      const p = gn[u - 15], h = gn[u - 2], w = ve(p, 7) ^ ve(p, 18) ^ p >>> 3, x = ve(h, 17) ^ ve(h, 19) ^ h >>> 10;
      gn[u] = x + gn[u - 7] + w + gn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = ve(a, 6) ^ ve(a, 11) ^ ve(a, 25), h = f + p + Yx(a, c, l) + Zx[u] + gn[u] | 0, x = (ve(r, 2) ^ ve(r, 13) ^ ve(r, 22)) + Xx(r, s, i) | 0;
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
}, Qx = class extends Jd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Yc = xr(() => new Jd());
xr(() => new Qx());
const Jx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), t0 = Uint8Array.from({ length: 16 }, (t, e) => e), tm = t0.map((t) => (9 * t + 5) % 16);
let Xc = [t0], Zc = [tm];
for (let t = 0; t < 4; t++)
  for (let e of [Xc, Zc])
    e.push(e[t].map((n) => Jx[n]));
const e0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), em = Xc.map((t, e) => t.map((n) => e0[e][n])), nm = Zc.map((t, e) => t.map((n) => e0[e][n])), rm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), sm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), di = (t, e) => t << e | t >>> 32 - e;
function Yu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const pi = new Uint32Array(16);
let im = class extends Wc {
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
      pi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, x = rm[h], A = sm[h], _ = Xc[h], U = Zc[h], y = em[h], L = nm[h];
      for (let E = 0; E < 16; E++) {
        const H = di(r + Yu(h, i, a, l) + pi[_[E]] + x, y[E]) + u | 0;
        r = u, u = l, l = di(a, 10) | 0, a = i, i = H;
      }
      for (let E = 0; E < 16; E++) {
        const H = di(s + Yu(w, o, c, f) + pi[U[E]] + A, L[E]) + p | 0;
        s = p, p = f, f = di(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    pi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const om = xr(() => new im()), gi = BigInt(2 ** 32 - 1), Va = BigInt(32);
function n0(t, e = !1) {
  return e ? { h: Number(t & gi), l: Number(t >> Va & gi) } : { h: Number(t >> Va & gi) | 0, l: Number(t & gi) | 0 };
}
function am(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = n0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const cm = (t, e) => BigInt(t >>> 0) << Va | BigInt(e >>> 0), lm = (t, e, n) => t >>> n, um = (t, e, n) => t << 32 - n | e >>> n, fm = (t, e, n) => t >>> n | e << 32 - n, hm = (t, e, n) => t << 32 - n | e >>> n, dm = (t, e, n) => t << 64 - n | e >>> n - 32, pm = (t, e, n) => t >>> n - 32 | e << 64 - n, gm = (t, e) => e, ym = (t, e) => t, wm = (t, e, n) => t << n | e >>> 32 - n, bm = (t, e, n) => e << n | t >>> 32 - n, xm = (t, e, n) => e << n - 32 | t >>> 64 - n, mm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Sm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Em = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Am = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, $m = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Im = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, vm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Lm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, tt = {
  fromBig: n0,
  split: am,
  toBig: cm,
  shrSH: lm,
  shrSL: um,
  rotrSH: fm,
  rotrSL: hm,
  rotrBH: dm,
  rotrBL: pm,
  rotr32H: gm,
  rotr32L: ym,
  rotlSH: wm,
  rotlSL: bm,
  rotlBH: xm,
  rotlBL: mm,
  add: Sm,
  add3L: Em,
  add3H: Am,
  add4L: $m,
  add4H: Im,
  add5H: Lm,
  add5L: vm
}, [Cm, Bm] = tt.split([
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
let vo = class extends Wc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: w, Hh: x, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, w, x, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, w, x, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = x | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      yn[y] = e.getUint32(n), wn[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const L = yn[y - 15] | 0, E = wn[y - 15] | 0, H = tt.rotrSH(L, E, 1) ^ tt.rotrSH(L, E, 8) ^ tt.shrSH(L, E, 7), j = tt.rotrSL(L, E, 1) ^ tt.rotrSL(L, E, 8) ^ tt.shrSL(L, E, 7), O = yn[y - 2] | 0, P = wn[y - 2] | 0, b = tt.rotrSH(O, P, 19) ^ tt.rotrBH(O, P, 61) ^ tt.shrSH(O, P, 6), v = tt.rotrSL(O, P, 19) ^ tt.rotrBL(O, P, 61) ^ tt.shrSL(O, P, 6), T = tt.add4L(j, v, wn[y - 7], wn[y - 16]), g = tt.add4H(T, H, b, yn[y - 7], yn[y - 16]);
      yn[y] = g | 0, wn[y] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: w, Gh: x, Gl: A, Hh: _, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const L = tt.rotrSH(u, p, 14) ^ tt.rotrSH(u, p, 18) ^ tt.rotrBH(u, p, 41), E = tt.rotrSL(u, p, 14) ^ tt.rotrSL(u, p, 18) ^ tt.rotrBL(u, p, 41), H = u & h ^ ~u & x, j = p & w ^ ~p & A, O = tt.add5L(U, E, j, Bm[y], wn[y]), P = tt.add5H(O, _, L, H, Cm[y], yn[y]), b = O | 0, v = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), T = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), g = r & i ^ r & a ^ i & a, C = s & o ^ s & c ^ o & c;
      _ = x | 0, U = A | 0, x = h | 0, A = w | 0, h = u | 0, w = p | 0, { h: u, l: p } = tt.add(l | 0, f | 0, P | 0, b | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const $ = tt.add3L(b, T, C);
      r = tt.add3H($, P, v, g), s = $ | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = tt.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = tt.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: w } = tt.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: x, l: A } = tt.add(this.Gh | 0, this.Gl | 0, x | 0, A | 0), { h: _, l: U } = tt.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, w, x, A, _, U);
  }
  roundClean() {
    yn.fill(0), wn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Mm = class extends vo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, _m = class extends vo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, km = class extends vo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
xr(() => new vo());
xr(() => new Mm());
const Um = xr(() => new _m());
xr(() => new km());
var ct;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(ct || (ct = {}));
var Ht;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ht || (Ht = {}));
function Qc(t) {
  return Ht[t];
}
const Tm = () => ({ type: ct.BoolTrue }), Hm = () => ({ type: ct.BoolFalse }), Nm = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ct.Buffer, value: V(t) };
}, Xu = BigInt("0xffffffffffffffffffffffffffffffff"), Pm = BigInt(0), Zu = BigInt("0x7fffffffffffffffffffffffffffffff"), Qu = BigInt("-170141183460469231731687303715884105728"), Dm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Aa(ft(t))), Zt(t, Uint8Array) && (t = Aa(t));
  const e = jt(t);
  if (e > Zu)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Zu}`);
  if (e < Qu)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Qu}`);
  return { type: ct.Int, value: e };
}, Om = (t) => {
  const e = jt(t);
  if (e < Pm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Xu)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Xu}`);
  return { type: ct.UInt, value: e };
};
function jm(t) {
  return { type: ct.List, value: t };
}
function r0() {
  return { type: ct.OptionalNone };
}
function s0(t) {
  return { type: ct.OptionalSome, value: t };
}
var D;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(D || (D = {}));
function Fm() {
  return {
    type: D.Address,
    version: cr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Ju(t) {
  if (t && d0(t, Xi))
    throw new Error(`Memo exceeds maximum length of ${Xi} bytes`);
  return { type: D.MemoString, content: t };
}
function Jc(t, e) {
  return {
    type: D.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ka(t) {
  if (ft(t).byteLength != $o)
    throw Error("Invalid signature");
  return {
    type: D.MessageSignature,
    data: t
  };
}
function zm(t, e, n) {
  return typeof t == "string" && (t = sS(t)), typeof n == "string" && (n = Ju(n)), {
    type: D.Payload,
    payloadType: gt.TokenTransfer,
    recipient: t,
    amount: jt(e),
    memo: n ?? Ju("")
  };
}
function Rm(t, e, n, r) {
  return typeof e == "string" && (e = Se(e)), typeof n == "string" && (n = Se(n)), {
    type: D.Payload,
    payloadType: gt.ContractCall,
    contractAddress: typeof t == "string" ? Nn(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Gm(t) {
  return Se(t, 4, 1e5);
}
function tf(t, e, n) {
  return typeof t == "string" && (t = Se(t)), typeof e == "string" && (e = Gm(e)), typeof n == "number" ? {
    type: D.Payload,
    payloadType: gt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: D.Payload,
    payloadType: gt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Vm() {
  return { type: D.Payload, payloadType: gt.PoisonMicroblock };
}
function ef(t, e) {
  if (t.byteLength != Wn)
    throw Error(`Coinbase buffer size must be ${Wn} bytes`);
  return e != null ? {
    type: D.Payload,
    payloadType: gt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: D.Payload,
    payloadType: gt.Coinbase,
    coinbaseBytes: t
  };
}
function Km(t, e, n) {
  if (t.byteLength != Wn)
    throw Error(`Coinbase buffer size must be ${Wn} bytes`);
  if (n.byteLength != Oa)
    throw Error(`VRF proof buffer size must be ${Oa} bytes`);
  return {
    type: D.Payload,
    payloadType: gt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === ct.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function qm(t, e, n, r, s, i, o) {
  return {
    type: D.Payload,
    payloadType: gt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Se(t, e, n) {
  const r = e || 1, s = n || Mx;
  if (d0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: D.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Wm(t, e, n) {
  return {
    type: D.Asset,
    address: Nn(t),
    contractName: Se(e),
    assetName: Se(n)
  };
}
function Nn(t) {
  const e = br.c32addressDecode(t);
  return {
    type: D.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Ym(t, e) {
  const n = Nn(t), r = Se(e);
  return {
    type: D.Principal,
    prefix: Gt.Contract,
    address: n,
    contractName: r
  };
}
function Xm(t) {
  const e = Nn(t);
  return {
    type: D.Principal,
    prefix: Gt.Standard,
    address: e
  };
}
function Tr(t, e) {
  return {
    pubKeyEncoding: t,
    type: D.TransactionAuthField,
    contents: e
  };
}
function Ve(t) {
  switch (t.type) {
    case D.Address:
      return qs(t);
    case D.Principal:
      return i0(t);
    case D.LengthPrefixedString:
      return Xr(t);
    case D.MemoString:
      return Qm(t);
    case D.Asset:
      return a0(t);
    case D.PostCondition:
      return l0(t);
    case D.PublicKey:
      return Ya(t);
    case D.LengthPrefixedList:
      return tl(t);
    case D.Payload:
      return u0(t);
    case D.TransactionAuthField:
      return rS(t);
    case D.MessageSignature:
      return el(t);
  }
}
function qs(t) {
  const e = [];
  return e.push(ft(Fs(t.version, 1))), e.push(ft(t.hash160)), Ut(e);
}
function Yr(t) {
  const e = Zt(t, mt) ? t : new mt(t), n = uo(V(e.readBytes(1))), r = V(e.readBytes(20));
  return { type: D.Address, version: n, hash160: r };
}
function i0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Gt.Standard || t.prefix === Gt.Contract) && e.push(qs(t.address)), t.prefix === Gt.Contract && e.push(Xr(t.contractName)), Ut(e);
}
function Zm(t) {
  const e = Zt(t, mt) ? t : new mt(t), n = e.readUInt8Enum(Gt, (i) => {
    throw new zt(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Gt.Origin)
    return { type: D.Principal, prefix: n };
  const r = Yr(e);
  if (n === Gt.Standard)
    return { type: D.Principal, prefix: n, address: r };
  const s = fe(e);
  return {
    type: D.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Xr(t) {
  const e = [], n = pr(t.content), r = n.byteLength;
  return e.push(ft(Fs(r, t.lengthPrefixBytes))), e.push(n), Ut(e);
}
function fe(t, e, n) {
  e = e || 1;
  const r = Zt(t, mt) ? t : new mt(t), s = uo(V(r.readBytes(e))), i = zs(r.readBytes(s));
  return Se(i, e, n ?? 128);
}
function Qm(t) {
  const e = [], n = pr(t.content), r = vS(V(n), Xi * 2);
  return e.push(ft(r)), Ut(e);
}
function o0(t) {
  const e = Zt(t, mt) ? t : new mt(t);
  let n = zs(e.readBytes(Xi));
  return n = n.replace(/\u0000*$/, ""), { type: D.MemoString, content: n };
}
function a0(t) {
  const e = [];
  return e.push(qs(t.address)), e.push(Xr(t.contractName)), e.push(Xr(t.assetName)), Ut(e);
}
function qa(t) {
  const e = Zt(t, mt) ? t : new mt(t);
  return {
    type: D.Asset,
    address: Yr(e),
    contractName: fe(e),
    assetName: fe(e)
  };
}
function tl(t) {
  const e = t.values, n = [];
  n.push(ft(Fs(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ve(r));
  return Ut(n);
}
function c0(t, e, n) {
  const r = Zt(t, mt) ? t : new mt(t), s = uo(V(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case D.Address:
        i.push(Yr(r));
        break;
      case D.LengthPrefixedString:
        i.push(fe(r));
        break;
      case D.MemoString:
        i.push(o0(r));
        break;
      case D.Asset:
        i.push(qa(r));
        break;
      case D.PostCondition:
        i.push(tS(r));
        break;
      case D.PublicKey:
        i.push(Xa(r));
        break;
      case D.TransactionAuthField:
        i.push(nS(r));
        break;
    }
  return Jc(i, n);
}
function Jm(t) {
  return V(l0(t));
}
function l0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(i0(t.principal)), (t.conditionType === Et.Fungible || t.conditionType === Et.NonFungible) && e.push(a0(t.asset)), t.conditionType === Et.NonFungible && e.push(ke(t.assetName)), e.push(t.conditionCode), t.conditionType === Et.STX || t.conditionType === Et.Fungible || t.conditionType === Et.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ur("The post-condition amount may not be larger than 8 bytes");
    e.push(Tn(t.amount, 8));
  }
  return Ut(e);
}
function tS(t) {
  const e = Zt(t, mt) ? t : new mt(t), n = e.readUInt8Enum(Et, (a) => {
    throw new zt(`Could not read ${a} as PostConditionType`);
  }), r = Zm(e);
  let s, i, o;
  switch (n) {
    case Et.STX:
      return s = e.readUInt8Enum($s, (c) => {
        throw new zt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${V(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: Et.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Et.Fungible:
      return i = qa(e), s = e.readUInt8Enum($s, (c) => {
        throw new zt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${V(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: Et.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Et.NonFungible:
      i = qa(e);
      const a = Me(e);
      return s = e.readUInt8Enum(Fa, (c) => {
        throw new zt(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: D.PostCondition,
        conditionType: Et.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Et.Staking:
      return s = e.readUInt8Enum($s, (c) => {
        throw new zt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${V(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: Et.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Et.PoX: {
      const c = e.readUInt8Enum(za, (l) => {
        throw new zt(`Could not read ${l} as PoxConditionCode`);
      });
      return {
        type: D.PostCondition,
        conditionType: Et.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function u0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case gt.TokenTransfer:
      e.push(ke(t.recipient)), e.push(Tn(t.amount, 8)), e.push(Ve(t.memo));
      break;
    case gt.ContractCall:
      e.push(Ve(t.contractAddress)), e.push(Ve(t.contractName)), e.push(Ve(t.functionName));
      const n = new Uint8Array(4);
      Qn(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(ke(r));
      });
      break;
    case gt.SmartContract:
      e.push(Ve(t.contractName)), e.push(Ve(t.codeBody));
      break;
    case gt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ve(t.contractName)), e.push(Ve(t.codeBody));
      break;
    case gt.PoisonMicroblock:
      break;
    case gt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case gt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(ke(t.recipient));
      break;
    case gt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(ke(t.recipient ? s0(t.recipient) : r0())), e.push(t.vrfProof);
      break;
    case gt.TenureChange:
      e.push(ft(t.tenureHash)), e.push(ft(t.previousTenureHash)), e.push(ft(t.burnViewHash)), e.push(ft(t.previousTenureEnd)), e.push(Qn(new Uint8Array(4), t.previousTenureBlocks)), e.push(Yy(new Uint8Array(1), t.cause)), e.push(ft(t.publicKeyHash));
      break;
  }
  return Ut(e);
}
function eS(t) {
  const e = Zt(t, mt) ? t : new mt(t);
  switch (e.readUInt8Enum(gt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case gt.TokenTransfer:
      const r = Me(e), s = jt(e.readBytes(8)), i = o0(e);
      return zm(r, s, i);
    case gt.ContractCall:
      const o = Yr(e), a = fe(e), c = fe(e), l = [], f = e.readUInt32BE();
      for (let L = 0; L < f; L++) {
        const E = Me(e);
        l.push(E);
      }
      return Rm(o, a, c, l);
    case gt.SmartContract:
      const u = fe(e), p = fe(e, 4, 1e5);
      return tf(u, p);
    case gt.VersionedSmartContract: {
      const L = e.readUInt8Enum(ja, (j) => {
        throw new Error(`Cannot recognize ClarityVersion: ${j}`);
      }), E = fe(e), H = fe(e, 4, Fx);
      return tf(E, H, L);
    }
    case gt.PoisonMicroblock:
      return Vm();
    case gt.Coinbase: {
      const L = e.readBytes(Wn);
      return ef(L);
    }
    case gt.CoinbaseToAltRecipient: {
      const L = e.readBytes(Wn), E = Me(e);
      return ef(L, E);
    }
    case gt.NakamotoCoinbase: {
      const L = e.readBytes(Wn), E = Me(e), H = e.readBytes(Oa);
      return Km(L, E, H);
    }
    case gt.TenureChange:
      const h = V(e.readBytes(20)), w = V(e.readBytes(20)), x = V(e.readBytes(20)), A = V(e.readBytes(32)), _ = e.readUInt32BE(), U = e.readUInt8Enum(Ra, (L) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${L}`);
      }), y = V(e.readBytes(20));
      return qm(h, w, x, A, _, U, y);
  }
}
function Wa(t) {
  const e = Zt(t, mt) ? t : new mt(t);
  return Ka(V(e.readBytes($o)));
}
function nS(t) {
  const e = Zt(t, mt) ? t : new mt(t), n = e.readUInt8Enum(be, (r) => {
    throw new zt(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case be.PublicKeyCompressed:
      return Tr(It.Compressed, Xa(e));
    case be.PublicKeyUncompressed:
      return Tr(It.Uncompressed, is(PS(Xa(e).data)));
    case be.SignatureCompressed:
      return Tr(It.Compressed, Wa(e));
    case be.SignatureUncompressed:
      return Tr(It.Uncompressed, Wa(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function el(t) {
  return ft(t.data);
}
function rS(t) {
  const e = [];
  switch (t.contents.type) {
    case D.PublicKey:
      e.push(t.pubKeyEncoding === It.Compressed ? be.PublicKeyCompressed : be.PublicKeyUncompressed), e.push(ft(NS(t.contents.data)));
      break;
    case D.MessageSignature:
      e.push(t.pubKeyEncoding === It.Compressed ? be.SignatureCompressed : be.SignatureUncompressed), e.push(el(t.contents));
      break;
  }
  return Ut(e);
}
function Ya(t) {
  return t.data.slice();
}
function Xa(t) {
  const e = Zt(t, mt) ? t : new mt(t), n = e.readUInt8(), r = n === 4 ? Ux : kx;
  return is(Ut([n, e.readBytes(r)]));
}
function nl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === wt.P2PKH || e === wt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === wt.P2WPKH || e === wt.P2WSH || e === wt.P2WSHNonSequential) && !r.map((s) => s.data).every(os))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case wt.P2PKH:
      return yi(t, LS(r[0].data));
    case wt.P2WPKH:
      return yi(t, CS(r[0].data));
    case wt.P2SH:
    case wt.P2SHNonSequential:
      return yi(t, BS(n, r.map(Ya)));
    case wt.P2WSH:
    case wt.P2WSHNonSequential:
      return yi(t, MS(n, r.map(Ya)));
  }
}
function yi(t, e) {
  return { type: D.Address, version: t, hash160: e };
}
function rl(t) {
  return br.c32address(t.version, t.hash160);
}
function nf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return Wm(e, n, r);
}
function ws(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Ym(e, n);
  } else
    return Xm(t);
}
function sS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return aS(e, n);
  } else
    return iS(t);
}
function iS(t) {
  const e = Nn(t);
  return { type: ct.PrincipalStandard, value: rl(e) };
}
function oS(t) {
  return { type: ct.PrincipalStandard, value: rl(t) };
}
function aS(t, e) {
  const n = Nn(t), r = Se(e);
  return f0(n, r);
}
function f0(t, e) {
  if (pr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: ct.PrincipalContract,
    value: `${rl(t)}.${e.content}`
  };
}
function cS(t) {
  return { type: ct.ResponseErr, value: t };
}
function lS(t) {
  return { type: ct.ResponseOk, value: t };
}
const uS = (t) => ({ type: ct.StringASCII, value: t }), fS = (t) => ({ type: ct.StringUTF8, value: t });
function hS(t) {
  for (const e in t)
    if (!_S(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: ct.Tuple, value: t };
}
function Me(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new mt(ft(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new mt(t) : e = t;
  switch (e.readUInt8Enum(Ht, (r) => {
    throw new zt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ht.int:
      return Dm(Aa(e.readBytes(16)));
    case Ht.uint:
      return Om(e.readBytes(16));
    case Ht.buffer:
      const r = e.readUInt32BE();
      return Nm(e.readBytes(r));
    case Ht.true:
      return Tm();
    case Ht.false:
      return Hm();
    case Ht.address:
      const s = Yr(e);
      return oS(s);
    case Ht.contract:
      const i = Yr(e), o = fe(e);
      return f0(i, o);
    case Ht.ok:
      return lS(Me(e));
    case Ht.err:
      return cS(Me(e));
    case Ht.none:
      return r0();
    case Ht.some:
      return s0(Me(e));
    case Ht.list:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Me(e));
      return jm(c);
    case Ht.tuple:
      const l = e.readUInt32BE(), f = {};
      for (let x = 0; x < l; x++) {
        const A = fe(e).content;
        if (A === void 0)
          throw new zt('"content" is undefined');
        f[A] = Me(e);
      }
      return hS(f);
    case Ht.ascii:
      const u = e.readUInt32BE(), p = Fy(e.readBytes(u));
      return uS(p);
    case Ht.utf8:
      const h = e.readUInt32BE(), w = zs(e.readBytes(h));
      return fS(w);
    default:
      throw new zt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Ne(t, e) {
  return Ut([Qc(t), e]);
}
function dS(t) {
  return new Uint8Array([Qc(t.type)]);
}
function pS(t) {
  return t.type === ct.OptionalNone ? new Uint8Array([Qc(t.type)]) : Ne(t.type, ke(t.value));
}
function gS(t) {
  const e = new Uint8Array(4);
  return Qn(e, Math.ceil(t.value.length / 2), 0), Ne(t.type, Te(e, ft(t.value)));
}
function yS(t) {
  const e = Lc(Ny(BigInt(t.value), BigInt(_x)), Wd);
  return Ne(t.type, e);
}
function wS(t) {
  const e = Lc(BigInt(t.value), Wd);
  return Ne(t.type, e);
}
function bS(t) {
  return Ne(t.type, qs(Nn(t.value)));
}
function xS(t) {
  const [e, n] = kS(t.value);
  return Ne(t.type, Te(qs(Nn(e)), Xr(Se(n))));
}
function mS(t) {
  return Ne(t.type, ke(t.value));
}
function SS(t) {
  const e = [], n = new Uint8Array(4);
  Qn(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = ke(r);
    e.push(s);
  }
  return Ne(t.type, Ut(e));
}
function ES(t) {
  const e = [], n = new Uint8Array(4);
  Qn(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Se(s);
    e.push(Xr(i));
    const o = ke(t.value[s]);
    e.push(o);
  }
  return Ne(t.type, Ut(e));
}
function h0(t, e) {
  const n = [], r = e == "ascii" ? jy(t.value) : pr(t.value), s = new Uint8Array(4);
  return Qn(s, r.length, 0), n.push(s), n.push(r), Ne(t.type, Ut(n));
}
function AS(t) {
  return h0(t, "ascii");
}
function $S(t) {
  return h0(t, "utf8");
}
function rf(t) {
  return V(ke(t));
}
function ke(t) {
  switch (t.type) {
    case ct.BoolTrue:
    case ct.BoolFalse:
      return dS(t);
    case ct.OptionalNone:
    case ct.OptionalSome:
      return pS(t);
    case ct.Buffer:
      return gS(t);
    case ct.UInt:
      return wS(t);
    case ct.Int:
      return yS(t);
    case ct.PrincipalStandard:
      return bS(t);
    case ct.PrincipalContract:
      return xS(t);
    case ct.ResponseOk:
    case ct.ResponseErr:
      return mS(t);
    case ct.List:
      return SS(t);
    case ct.Tuple:
      return ES(t);
    case ct.StringASCII:
      return AS(t);
    case ct.StringUTF8:
      return $S(t);
    default:
      throw new Ur("Unable to serialize. Invalid Clarity Value.");
  }
}
const IS = (t) => t.length % 2 ? `0${t}` : t, vS = (t, e) => t.padEnd(e, "0"), d0 = (t, e) => t ? pr(t).length > e : !1;
function Za(t) {
  return Gd(t);
}
const _s = (t) => om(Yc(t)), sl = (t) => V(Um(t)), LS = (t) => V(_s(t)), CS = (t) => {
  const e = _s(t), n = Te(new Uint8Array([0]), new Uint8Array([e.length]), e), r = _s(n);
  return V(r);
}, BS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ut(n), s = _s(r);
  return V(s);
}, MS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ut(n), s = Yc(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ut(i), a = _s(o);
  return V(a);
};
function _S(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function kS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Bt.hmacSha256Sync = (t, ...e) => {
  const n = Qd.create(Yc, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function is(t) {
  return t = typeof t == "string" ? ft(t) : t, {
    type: D.PublicKey,
    data: t
  };
}
function US(t, e, n = It.Compressed) {
  const r = Vy(e), s = new re(ru(r.r), ru(r.s)), i = it.fromSignature(t, s, r.recoveryId), o = n === It.Compressed;
  return i.toHex(o);
}
function TS(t) {
  return typeof t == "string" ? t : V(t);
}
const il = TS;
function p0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Gy;
}
function os(t) {
  return !il(t).startsWith("04");
}
function HS(t) {
  t = Cc(t);
  const e = p0(t);
  return V(Rs(t.slice(0, 32), e));
}
function NS(t) {
  return it.fromHex(il(t)).toHex(!0);
}
function PS(t) {
  return it.fromHex(il(t)).toHex(!1);
}
function DS(t, e) {
  t = Cc(t);
  const [n, r] = ho(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Fs(r, 1) + re.fromHex(n).toCompactHex();
}
function ol() {
  return {
    type: D.MessageSignature,
    data: V(new Uint8Array($o))
  };
}
function g0(t, e, n, r) {
  const s = nl(0, t, 1, [is(e)]).hash160, i = os(e) ? It.Compressed : It.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: jt(n),
    fee: jt(r),
    keyEncoding: i,
    signature: ol()
  };
}
function ks(t) {
  return "signature" in t;
}
function sf(t) {
  return t === wt.P2SH || t === wt.P2WSH;
}
function OS(t) {
  return t === wt.P2SHNonSequential || t === wt.P2WSHNonSequential;
}
function of(t) {
  const e = Za(t);
  return e.nonce = 0, e.fee = 0, ks(e) ? e.signature = ol() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function jS(t) {
  const e = [
    t.hashMode,
    ft(t.signer),
    Tn(t.nonce, 8),
    Tn(t.fee, 8),
    t.keyEncoding,
    el(t.signature)
  ];
  return Ut(e);
}
function FS(t) {
  const e = [
    t.hashMode,
    ft(t.signer),
    Tn(t.nonce, 8),
    Tn(t.fee, 8)
  ], n = Jc(t.fields);
  e.push(tl(n));
  const r = new Uint8Array(2);
  return qy(r, t.signaturesRequired, 0), e.push(r), Ut(e);
}
function zS(t, e) {
  const n = V(e.readBytes(20)), r = BigInt(`0x${V(e.readBytes(8))}`), s = BigInt(`0x${V(e.readBytes(8))}`), i = e.readUInt8Enum(It, (a) => {
    throw new zt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === wt.P2WPKH && i != It.Compressed)
    throw new zt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Wa(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function RS(t, e) {
  const n = V(e.readBytes(20)), r = BigInt("0x" + V(e.readBytes(8))), s = BigInt("0x" + V(e.readBytes(8))), i = c0(e, D.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case D.PublicKey:
        os(l.contents.data) || (o = !0);
        break;
      case D.MessageSignature:
        if (l.pubKeyEncoding === It.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Gn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === wt.P2WSH || t === wt.P2WSHNonSequential))
    throw new Gn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function oa(t) {
  return ks(t) ? jS(t) : FS(t);
}
function aa(t) {
  const e = t.readUInt8Enum(wt, (n) => {
    throw new zt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === wt.P2PKH || e === wt.P2WPKH ? zS(e, t) : RS(e, t);
}
function y0(t, e, n, r) {
  const i = t + V(new Uint8Array([e])) + V(Tn(n, 8)) + V(Tn(r, 8));
  if (ft(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return sl(ft(i));
}
function w0(t, e, n) {
  const r = 33 + $o, s = os(e.data) ? It.Compressed : It.Uncompressed, i = t + IS(s.toString(16)) + n, o = ft(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return sl(o);
}
function GS(t, e, n, r, s) {
  const i = y0(t, e, n, r), o = DS(s, i), a = is(HS(s)), c = w0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function b0(t, e, n, r, s, i) {
  const o = y0(t, e, n, r), a = is(US(o, i, s)), c = w0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function VS() {
  const t = g0(wt.P2PKH, "", 0, 0);
  return t.signer = Fm().hash160, t.keyEncoding = It.Compressed, t.signature = ol(), t;
}
function af(t, e, n) {
  return ks(t) ? KS(t, e, n) : qS(t, e, n);
}
function KS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = b0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = nl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Gn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function qS(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case D.PublicKey:
        os(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case D.MessageSignature:
        c.pubKeyEncoding === It.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = b0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (sf(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new Gn("Too many signatures");
        break;
    }
  if (sf(t.hashMode) && o !== t.signaturesRequired || OS(t.hashMode) && o < t.signaturesRequired)
    throw new Gn("Incorrect number of signatures");
  if (i && (t.hashMode === wt.P2WSH || t.hashMode === wt.P2WSHNonSequential))
    throw new Gn("Uncompressed keys are not allowed in this hash mode");
  const a = nl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Gn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function x0(t) {
  return {
    authType: Lt.Standard,
    spendingCondition: t
  };
}
function m0(t, e) {
  return {
    authType: Lt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || g0(wt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function cf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Lt.Standard:
        return x0(of(t.spendingCondition));
      case Lt.Sponsored:
        return m0(of(t.spendingCondition), VS());
      default:
        throw new Qi("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function WS(t, e) {
  switch (t.authType) {
    case Lt.Standard:
      return af(t.spendingCondition, e, Lt.Standard);
    case Lt.Sponsored:
      return af(t.spendingCondition, e, Lt.Standard);
    default:
      throw new Qi("Invalid origin auth type");
  }
}
function YS(t, e) {
  switch (t.authType) {
    case Lt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: jt(e)
      };
      return { ...t, spendingCondition: n };
    case Lt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: jt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function XS(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: jt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function ZS(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: jt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function QS(t, e) {
  const n = {
    ...e,
    nonce: jt(e.nonce),
    fee: jt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function JS(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Lt.Standard:
      e.push(oa(t.spendingCondition));
      break;
    case Lt.Sponsored:
      e.push(oa(t.spendingCondition)), e.push(oa(t.sponsorSpendingCondition));
      break;
  }
  return Ut(e);
}
function t3(t) {
  const e = t.readUInt8Enum(Lt, (r) => {
    throw new zt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Lt.Standard:
      return n = aa(t), x0(n);
    case Lt.Sponsored:
      n = aa(t);
      const r = aa(t);
      return m0(n, r);
  }
}
class e3 {
  constructor({ auth: e, payload: n, postConditions: r = Jc([]), postConditionMode: s = Zi.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Cx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: jt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Jt.Any;
  }
  signBegin() {
    const e = Za(this);
    return e.auth = cf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Za(this);
    return e.auth = cf(e.auth), e.txid();
  }
  verifyOrigin() {
    return WS(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Lt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Lt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Lt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : is(e), r = this.auth.spendingCondition;
    if (r && !ks(r)) {
      const s = os(n.data);
      r.fields.push(Tr(s ? It.Compressed : It.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = GS(n, r, e.fee, e.nonce, s);
    if (ks(e))
      e.signature = Ka(i);
    else {
      const a = p0(s);
      e.fields.push(Tr(a ? It.Compressed : It.Uncompressed, Ka(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return sl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Lt.Sponsored)
      throw new Qi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = QS(this.auth, e);
  }
  setFee(e) {
    this.auth = YS(this.auth, e);
  }
  setNonce(e) {
    this.auth = XS(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Lt.Sponsored)
      throw new Qi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = ZS(this.auth, e);
  }
  serialize() {
    return V(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ur('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ur('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ur('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ur('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Qn(n, this.chainId, 0), e.push(n), e.push(JS(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(tl(this.postConditions)), e.push(u0(this.payload)), Ut(e);
  }
}
function n3(t) {
  const e = Zt(t, mt) ? t : new mt(t), n = e.readUInt8Enum(ar, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = t3(e), i = e.readUInt8Enum(Jt, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(Zi, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = c0(e, D.PostCondition), c = eS(e), l = new e3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return l.anchorMode = i, l;
}
const lf = BigInt("18446744073709551615");
function ca(t) {
  const e = jt(t);
  if (e < 0n || e > lf)
    throw new RangeError(`Post-condition amount must be between 0 and ${lf} (u64 max), received: ${e}`);
  return e;
}
var Qa;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Qa || (Qa = {}));
var Ja;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Ja || (Ja = {}));
function r3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: D.PostCondition,
        conditionType: Et.STX,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Gt.Origin } : ws(t.address),
        conditionCode: wi(t.condition),
        amount: ca(t.amount)
      };
    case "ft-postcondition":
      return {
        type: D.PostCondition,
        conditionType: Et.Fungible,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Gt.Origin } : ws(t.address),
        conditionCode: wi(t.condition),
        amount: ca(t.amount),
        asset: nf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: D.PostCondition,
        conditionType: Et.NonFungible,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Gt.Origin } : ws(t.address),
        conditionCode: wi(t.condition),
        asset: nf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: D.PostCondition,
        conditionType: Et.Staking,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Gt.Origin } : ws(t.address),
        conditionCode: wi(t.condition),
        amount: ca(t.amount)
      };
    case "pox-postcondition":
      return {
        type: D.PostCondition,
        conditionType: Et.PoX,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Gt.Origin } : ws(t.address),
        conditionCode: s3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function wi(t) {
  return Qa[t];
}
function s3(t) {
  return Ja[t];
}
function S0(t) {
  const e = r3(t);
  return Jm(e);
}
function i3(t, e, n) {
  return cl(E0(t), n);
}
function E0(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Us(r);
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
    return BigInt(`0x${c3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function al(t, e = 8) {
  return (typeof t == "bigint" ? t : E0(t)).toString(16).padStart(e * 2, "0");
}
function cl(t, e = 16) {
  const n = al(t, e);
  return Us(n);
}
function o3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const a3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function c3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += a3[n];
  return e;
}
function Us(t) {
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
function ll(t) {
  return new TextEncoder().encode(t);
}
function l3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function u3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function uf(t) {
  if (t.some(u3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ul(...t) {
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
function Je(t) {
  return ul(...t.map((e) => typeof e == "number" ? uf([e]) : e instanceof Array ? uf(e) : e));
}
function Lo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var tc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(tc || (tc = {}));
tc.Mainnet;
const f3 = 128, h3 = 128, A0 = 16;
var ec;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ec || (ec = {}));
var ff;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ff || (ff = {}));
var hf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(hf || (hf = {}));
var we;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(we || (we = {}));
const la = ["onChainOnly", "offChainOnly", "any"];
la[0] + "", we.OnChainOnly, la[1] + "", we.OffChainOnly, la[2] + "", we.Any, we.OnChainOnly + "", we.OnChainOnly, we.OffChainOnly + "", we.OffChainOnly, we.Any + "", we.Any;
var nc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(nc || (nc = {}));
nc.Mainnet;
var df;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(df || (df = {}));
var jn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(jn || (jn = {}));
var pf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(pf || (pf = {}));
var gf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(gf || (gf = {}));
var yf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(yf || (yf = {}));
var wf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(wf || (wf = {}));
var bf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(bf || (bf = {}));
var xf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(xf || (xf = {}));
var rc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(rc || (rc = {}));
var mf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(mf || (mf = {}));
var Sf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Sf || (Sf = {}));
function sc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function d3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function $0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function p3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  sc(t.outputLen), sc(t.blockLen);
}
function g3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function y3(t, e) {
  $0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ua = {
  number: sc,
  bool: d3,
  bytes: $0,
  hash: p3,
  exists: g3,
  output: y3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const fa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Le = (t, e) => t << 32 - e | t >>> e, w3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!w3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function b3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function I0(t) {
  if (typeof t == "string" && (t = b3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let x3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function mr(t) {
  const e = (r) => t().update(I0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function m3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let fl = class extends x3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = fa(this.buffer);
  }
  update(e) {
    ua.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = I0(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = fa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ua.exists(this), ua.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    m3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = fa(e), c = this.outputLen;
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
const S3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), v0 = Uint8Array.from({ length: 16 }, (t, e) => e), E3 = v0.map((t) => (9 * t + 5) % 16);
let hl = [v0], dl = [E3];
for (let t = 0; t < 4; t++)
  for (let e of [hl, dl])
    e.push(e[t].map((n) => S3[n]));
const L0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), A3 = hl.map((t, e) => t.map((n) => L0[e][n])), $3 = dl.map((t, e) => t.map((n) => L0[e][n])), I3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), v3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), bi = (t, e) => t << e | t >>> 32 - e;
function Ef(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const xi = new Uint32Array(16);
let L3 = class extends fl {
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
      xi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, x = I3[h], A = v3[h], _ = hl[h], U = dl[h], y = A3[h], L = $3[h];
      for (let E = 0; E < 16; E++) {
        const H = bi(r + Ef(h, i, a, l) + xi[_[E]] + x, y[E]) + u | 0;
        r = u, u = l, l = bi(a, 10) | 0, a = i, i = H;
      }
      for (let E = 0; E < 16; E++) {
        const H = bi(s + Ef(w, o, c, f) + xi[U[E]] + A, L[E]) + p | 0;
        s = p, p = f, f = bi(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    xi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
mr(() => new L3());
const C3 = (t, e, n) => t & e ^ ~t & n, B3 = (t, e, n) => t & e ^ t & n ^ e & n, M3 = new Uint32Array([
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
]), bn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xn = new Uint32Array(64);
let C0 = class extends fl {
  constructor() {
    super(64, 32, 8, !1), this.A = bn[0] | 0, this.B = bn[1] | 0, this.C = bn[2] | 0, this.D = bn[3] | 0, this.E = bn[4] | 0, this.F = bn[5] | 0, this.G = bn[6] | 0, this.H = bn[7] | 0;
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
      xn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = xn[u - 15], h = xn[u - 2], w = Le(p, 7) ^ Le(p, 18) ^ p >>> 3, x = Le(h, 17) ^ Le(h, 19) ^ h >>> 10;
      xn[u] = x + xn[u - 7] + w + xn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = Le(a, 6) ^ Le(a, 11) ^ Le(a, 25), h = f + p + C3(a, c, l) + M3[u] + xn[u] | 0, x = (Le(r, 2) ^ Le(r, 13) ^ Le(r, 22)) + B3(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    xn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, _3 = class extends C0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
mr(() => new C0());
mr(() => new _3());
const mi = BigInt(2 ** 32 - 1), ic = BigInt(32);
function B0(t, e = !1) {
  return e ? { h: Number(t & mi), l: Number(t >> ic & mi) } : { h: Number(t >> ic & mi) | 0, l: Number(t & mi) | 0 };
}
function k3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = B0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const U3 = (t, e) => BigInt(t >>> 0) << ic | BigInt(e >>> 0), T3 = (t, e, n) => t >>> n, H3 = (t, e, n) => t << 32 - n | e >>> n, N3 = (t, e, n) => t >>> n | e << 32 - n, P3 = (t, e, n) => t << 32 - n | e >>> n, D3 = (t, e, n) => t << 64 - n | e >>> n - 32, O3 = (t, e, n) => t >>> n - 32 | e << 64 - n, j3 = (t, e) => e, F3 = (t, e) => t, z3 = (t, e, n) => t << n | e >>> 32 - n, R3 = (t, e, n) => e << n | t >>> 32 - n, G3 = (t, e, n) => e << n - 32 | t >>> 64 - n, V3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function K3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const q3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), W3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Y3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), X3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Z3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Q3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, et = {
  fromBig: B0,
  split: k3,
  toBig: U3,
  shrSH: T3,
  shrSL: H3,
  rotrSH: N3,
  rotrSL: P3,
  rotrBH: D3,
  rotrBL: O3,
  rotr32H: j3,
  rotr32L: F3,
  rotlSH: z3,
  rotlSL: R3,
  rotlBH: G3,
  rotlBL: V3,
  add: K3,
  add3L: q3,
  add3H: W3,
  add4L: Y3,
  add4H: X3,
  add5H: Q3,
  add5L: Z3
}, [J3, t4] = et.split([
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
].map((t) => BigInt(t))), mn = new Uint32Array(80), Sn = new Uint32Array(80);
let Co = class extends fl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: w, Hh: x, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, w, x, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, w, x, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = x | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      mn[y] = e.getUint32(n), Sn[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const L = mn[y - 15] | 0, E = Sn[y - 15] | 0, H = et.rotrSH(L, E, 1) ^ et.rotrSH(L, E, 8) ^ et.shrSH(L, E, 7), j = et.rotrSL(L, E, 1) ^ et.rotrSL(L, E, 8) ^ et.shrSL(L, E, 7), O = mn[y - 2] | 0, P = Sn[y - 2] | 0, b = et.rotrSH(O, P, 19) ^ et.rotrBH(O, P, 61) ^ et.shrSH(O, P, 6), v = et.rotrSL(O, P, 19) ^ et.rotrBL(O, P, 61) ^ et.shrSL(O, P, 6), T = et.add4L(j, v, Sn[y - 7], Sn[y - 16]), g = et.add4H(T, H, b, mn[y - 7], mn[y - 16]);
      mn[y] = g | 0, Sn[y] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: w, Gh: x, Gl: A, Hh: _, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const L = et.rotrSH(u, p, 14) ^ et.rotrSH(u, p, 18) ^ et.rotrBH(u, p, 41), E = et.rotrSL(u, p, 14) ^ et.rotrSL(u, p, 18) ^ et.rotrBL(u, p, 41), H = u & h ^ ~u & x, j = p & w ^ ~p & A, O = et.add5L(U, E, j, t4[y], Sn[y]), P = et.add5H(O, _, L, H, J3[y], mn[y]), b = O | 0, v = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), T = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), g = r & i ^ r & a ^ i & a, C = s & o ^ s & c ^ o & c;
      _ = x | 0, U = A | 0, x = h | 0, A = w | 0, h = u | 0, w = p | 0, { h: u, l: p } = et.add(l | 0, f | 0, P | 0, b | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const $ = et.add3L(b, T, C);
      r = et.add3H($, P, v, g), s = $ | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = et.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = et.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: w } = et.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: x, l: A } = et.add(this.Gh | 0, this.Gl | 0, x | 0, A | 0), { h: _, l: U } = et.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, w, x, A, _, U);
  }
  roundClean() {
    mn.fill(0), Sn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, e4 = class extends Co {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, n4 = class extends Co {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, r4 = class extends Co {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
mr(() => new Co());
mr(() => new e4());
mr(() => new n4());
mr(() => new r4());
function s4(t, e, n) {
  const s = f3;
  if (m4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ec.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Nt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Nt || (Nt = {}));
let i4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, M0 = class extends i4 {
  constructor(e) {
    super(e);
  }
};
function Bo(t) {
  const e = [];
  return e.push(Us(al(t.version, 1))), e.push(Us(t.hash160)), Je(e);
}
function o4(t) {
  const e = [];
  return e.push(t.prefix), e.push(Bo(t.address)), t.prefix === rc.Contract && e.push(Ts(t.contractName)), Je(e);
}
function Ts(t) {
  const e = [], n = ll(t.content), r = n.byteLength;
  return e.push(Us(al(r, t.lengthPrefixBytes))), e.push(n), Je(e);
}
function a4(t) {
  const e = [];
  return e.push(Bo(t.address)), e.push(Ts(t.contractName)), e.push(Ts(t.assetName)), Je(e);
}
function _0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(o4(t.principal)), (t.conditionType === jn.Fungible || t.conditionType === jn.NonFungible) && e.push(a4(t.assetInfo)), t.conditionType === jn.NonFungible && e.push(lr(t.assetName)), e.push(t.conditionCode), t.conditionType === jn.STX || t.conditionType === jn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new M0("The post-condition amount may not be larger than 8 bytes");
    e.push(i3(t.amount, !1, 8));
  }
  return Je(e);
}
function Pe(t, e) {
  return Je([t, e]);
}
function c4(t) {
  return new Uint8Array([t.type]);
}
function l4(t) {
  return t.type === Nt.OptionalNone ? new Uint8Array([t.type]) : Pe(t.type, lr(t.value));
}
function u4(t) {
  const e = new Uint8Array(4);
  return Lo(e, t.buffer.length, 0), Pe(t.type, ul(e, t.buffer));
}
function f4(t) {
  const e = cl(o3(t.value, BigInt(h3)), A0);
  return Pe(t.type, e);
}
function h4(t) {
  const e = cl(t.value, A0);
  return Pe(t.type, e);
}
function d4(t) {
  return Pe(t.type, Bo(t.address));
}
function p4(t) {
  return Pe(t.type, ul(Bo(t.address), Ts(t.contractName)));
}
function g4(t) {
  return Pe(t.type, lr(t.value));
}
function y4(t) {
  const e = [], n = new Uint8Array(4);
  Lo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = lr(r);
    e.push(s);
  }
  return Pe(t.type, Je(e));
}
function w4(t) {
  const e = [], n = new Uint8Array(4);
  Lo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = s4(s);
    e.push(Ts(i));
    const o = lr(t.data[s]);
    e.push(o);
  }
  return Pe(t.type, Je(e));
}
function k0(t, e) {
  const n = [], r = e == "ascii" ? l3(t.data) : ll(t.data), s = new Uint8Array(4);
  return Lo(s, r.length, 0), n.push(s), n.push(r), Pe(t.type, Je(n));
}
function b4(t) {
  return k0(t, "ascii");
}
function x4(t) {
  return k0(t, "utf8");
}
function lr(t) {
  switch (t.type) {
    case Nt.BoolTrue:
    case Nt.BoolFalse:
      return c4(t);
    case Nt.OptionalNone:
    case Nt.OptionalSome:
      return l4(t);
    case Nt.Buffer:
      return u4(t);
    case Nt.UInt:
      return h4(t);
    case Nt.Int:
      return f4(t);
    case Nt.PrincipalStandard:
      return d4(t);
    case Nt.PrincipalContract:
      return p4(t);
    case Nt.ResponseOk:
    case Nt.ResponseErr:
      return g4(t);
    case Nt.List:
      return y4(t);
    case Nt.Tuple:
      return w4(t);
    case Nt.StringASCII:
      return b4(t);
    case Nt.StringUTF8:
      return x4(t);
    default:
      throw new M0("Unable to serialize. Invalid Clarity Value.");
  }
}
const m4 = (t, e) => t ? ll(t).length > e : !1, S4 = "connect-ui";
let Ui, U0, te = !1, oc = !1;
const Qe = (t, e = "") => () => {
}, E4 = (t, e) => () => {
}, A4 = "{visibility:hidden}.hydrated{visibility:inherit}", Af = {}, $4 = "http://www.w3.org/2000/svg", I4 = "http://www.w3.org/1999/xhtml", v4 = (t) => t != null, pl = (t) => (t = typeof t, t === "object" || t === "function");
function T0(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Z = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (l) => {
    for (let f = 0; f < l.length; f++)
      r = l[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !pl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? ac(null, r) : r), i = s);
  };
  if (a(n), e) {
    const l = e.className || e.class;
    l && (e.class = typeof l != "object" ? l : Object.keys(l).filter((f) => l[f]).join(" "));
  }
  const c = ac(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, ac = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, L4 = {}, C4 = (t) => t && t.$tag$ === L4, B4 = (t, e) => t != null && !pl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, M4 = (t) => as(t).$hostElement$, _4 = (t, e, n) => {
  const r = Ot.ce(e, n);
  return t.dispatchEvent(r), r;
}, $f = /* @__PURE__ */ new WeakMap(), k4 = (t, e, n) => {
  let r = Ji.get(t);
  Q4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ji.set(t, r);
}, U4 = (t, e, n, r) => {
  var s;
  let i = H0(e);
  const o = Ji.get(i);
  if (t = t.nodeType === 11 ? t : Ue, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = $f.get(t), c;
      if (a || $f.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Ue.createElement("style"), c.innerHTML = o;
          const l = (s = Ot.$nonce$) !== null && s !== void 0 ? s : T0(Ue);
          l != null && c.setAttribute("nonce", l), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, T4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Qe("attachStyles", e.$tagName$), i = U4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, H0 = (t, e) => "sc-" + t.$tagName$, If = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Lf(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, l = vf(n), f = vf(r);
      c.remove(...l.filter((u) => u && !f.includes(u))), c.add(...f.filter((u) => u && !l.includes(u)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Lf(Mo, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Ot.rel(t, e, n, !1), r && Ot.ael(t, e, r, !1);
    else {
      const c = pl(r);
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
}, H4 = /\s/, vf = (t) => t ? t.split(H4) : [], N0 = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Af, o = e.$attrs$ || Af;
  for (r in i)
    r in o || If(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    If(s, r, i[r], o[r], n, e.$flags$);
}, gl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Ue.createTextNode(s.$text$);
  else {
    if (te || (te = s.$tag$ === "svg"), o = s.$elm$ = Ue.createElementNS(te ? $4 : I4, s.$tag$), te && s.$tag$ === "foreignObject" && (te = !1), N0(null, s, te), v4(Ui) && o["s-si"] !== Ui && o.classList.add(o["s-si"] = Ui), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = gl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? te = !1 : o.tagName === "foreignObject" && (te = !0);
  }
  return o;
}, P0 = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === U0 && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = gl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, D0 = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, N4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], l = r.length - 1, f = r[0], u = r[l], p;
  for (; s <= o && i <= l; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : u == null ? u = r[--l] : Si(a, f) ? (xs(a, f), a = e[++s], f = r[++i]) : Si(c, u) ? (xs(c, u), c = e[--o], u = r[--l]) : Si(a, u) ? (xs(a, u), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], u = r[--l]) : Si(c, f) ? (xs(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (p = gl(e && e[i], n, i), f = r[++i], p && a.$elm$.parentNode.insertBefore(p, a.$elm$));
  s > o ? P0(t, r[l + 1] == null ? null : r[l + 1].$elm$, n, r, i, l) : i > l && D0(e, s, o);
}, Si = (t, e) => t.$tag$ === e.$tag$, xs = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (te = i === "svg" ? !0 : i === "foreignObject" ? !1 : te, N0(t, e, te), r !== null && s !== null ? N4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), P0(n, null, e, s, 0, s.length - 1)) : r !== null && D0(r, 0, r.length - 1), te && i === "svg" && (te = !1)) : t.$text$ !== o && (n.data = o);
}, P4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ac(null, null), s = C4(e) ? e : Z(null, null, e);
  U0 = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Ui = n["s-sc"], xs(r, s);
}, O0 = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, yl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return O0(t, t.$ancestorComponent$), tE(() => D4(t, e));
}, D4 = (t, e) => {
  const n = Qe("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), z4(s, () => O4(t, r, e));
}, O4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Qe("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && T4(t);
  const o = Qe("render", t.$cmpMeta$.$tagName$);
  j4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => F4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, j4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, P4(t, e);
  } catch (r) {
    Hs(r, t.$hostElement$);
  }
  return null;
}, F4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Qe("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, F0(n), r(), t.$onReadyResolve$(n), s || j0()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && bl(() => yl(t, !1)), t.$flags$ &= -517;
}, j0 = (t) => {
  F0(Ue.documentElement), bl(() => _4(Mo, "appload", { detail: { namespace: S4 } }));
}, z4 = (t, e) => t && t.then ? t.then(e) : e(), F0 = (t) => t.classList.add("hydrated"), R4 = (t, e) => as(t).$instanceValues$.get(e), G4 = (t, e, n, r) => {
  const s = as(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = B4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), l = n !== i && !c;
  (!(o & 8) || i === void 0) && l && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && yl(s, !1));
}, z0 = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return R4(this, i);
        },
        set(a) {
          G4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Ot.jmp(() => {
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
}, V4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = Z4(n), s.then) {
        const c = E4();
        s = await s, c();
      }
      s.isProxied || (z0(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Qe("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Hs(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = H0(n);
      if (!Ji.has(c)) {
        const l = Qe("registerStyles", n.$tagName$);
        k4(c, a, !!(n.$flags$ & 1)), l();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => yl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, K4 = (t) => {
  if (!(Ot.$flags$ & 1)) {
    const e = as(t), n = e.$cmpMeta$, r = Qe("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            O0(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), V4(t, e, n);
    }
    r();
  }
}, q4 = (t) => {
  Ot.$flags$ & 1 || as(t);
}, W4 = (t, e = {}) => {
  var n;
  const r = Qe(), s = [], i = e.exclude || [], o = Mo.customElements, a = Ue.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), l = /* @__PURE__ */ Ue.createElement("style"), f = [];
  let u, p = !0;
  Object.assign(Ot, e), Ot.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Ue.baseURI).href, t.map((h) => {
    h[1].map((w) => {
      const x = {
        $flags$: w[0],
        $tagName$: w[1],
        $members$: w[2],
        $listeners$: w[3]
      };
      x.$members$ = w[2];
      const A = x.$tagName$, _ = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, X4(U, x), x.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), p ? f.push(this) : Ot.jmp(() => K4(this));
        }
        disconnectedCallback() {
          Ot.jmp(() => q4(this));
        }
        componentOnReady() {
          return as(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = h[0], !i.includes(A) && !o.get(A) && (s.push(A), o.define(A, z0(
        _,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    l.innerHTML = s + A4, l.setAttribute("data-styles", "");
    const h = (n = Ot.$nonce$) !== null && n !== void 0 ? n : T0(Ue);
    h != null && l.setAttribute("nonce", h), a.insertBefore(l, c ? c.nextSibling : a.firstChild);
  }
  p = !1, f.length ? f.map((h) => h.connectedCallback()) : Ot.jmp(() => u = setTimeout(j0, 30)), r();
}, wl = /* @__PURE__ */ new WeakMap(), as = (t) => wl.get(t), Y4 = (t, e) => wl.set(e.$lazyInstance$ = t, e), X4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], wl.set(t, n);
}, Lf = (t, e) => e in t, Hs = (t, e) => (0, console.error)(t, e), ha = /* @__PURE__ */ new Map(), Z4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = ha.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (ha.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => N5).then(o, Hs);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (ha.set(s, o), o[r]), Hs);
}, Ji = /* @__PURE__ */ new Map(), Mo = typeof window < "u" ? window : {}, Ue = Mo.document || { head: {} }, Ot = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, R0 = (t) => Promise.resolve(t), Q4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Cf = [], G0 = [], J4 = (t, e) => (n) => {
  t.push(n), oc || (oc = !0, Ot.$flags$ & 4 ? bl(cc) : Ot.raf(cc));
}, Bf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Hs(n);
    }
  t.length = 0;
}, cc = () => {
  Bf(Cf), Bf(G0), (oc = Cf.length > 0) && Ot.raf(cc);
}, bl = (t) => R0().then(t), tE = /* @__PURE__ */ J4(G0), eE = () => R0(), nE = (t, e) => typeof window > "u" ? Promise.resolve() : eE().then(() => W4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var rE = Object.defineProperty, sE = Object.defineProperties, iE = Object.getOwnPropertyDescriptors, to = Object.getOwnPropertySymbols, V0 = Object.prototype.hasOwnProperty, K0 = Object.prototype.propertyIsEnumerable, Mf = (t, e, n) => e in t ? rE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, ie = (t, e) => {
  for (var n in e || (e = {})) V0.call(e, n) && Mf(t, n, e[n]);
  if (to) for (var n of to(e)) K0.call(e, n) && Mf(t, n, e[n]);
  return t;
}, Ee = (t, e) => sE(t, iE(e)), q0 = (t, e) => {
  var n = {};
  for (var r in t) V0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && to) for (var r of to(t)) e.indexOf(r) < 0 && K0.call(t, r) && (n[r] = t[r]);
  return n;
};
function W0() {
  return Ao(rr()) || window.StacksProvider || window.BlockstackProvider;
}
function _o(t) {
  return t ? typeof t == "string" ? ir.fromName(t) : "version" in t ? t : "url" in t ? new Na({ url: t.url }) : t.transactionVersion === ar.Mainnet ? new Na({ url: t.client.baseUrl }) : new Pa({ url: t.client.baseUrl }) : new Pa();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var oE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(oE || {}), aE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(aE || {}), xl = (t) => {
  let e = t;
  if (!e) {
    let n = new Lh(["store_write"], document.location.href);
    e = new Ha({ appConfig: n });
  }
  return e;
};
function Y0(t) {
  try {
    return xl(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var X0 = (t) => {
  let e = xl(t).loadUserData().appPrivateKey, n = Dt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function cE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [or.Mainnet]: "mainnet", [or.Testnet]: "testnet" }, a = _o(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function lE(t) {
  let e = _o(t.network), n = xl(t.userSession), r = Ee(ie({}, t), { network: e, userSession: n });
  return ie({ stxAddress: cE(r) }, r);
}
async function uE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(S0) : n = n.map((r) => V(_0(r)))), new Dt.TokenSigner("ES256k", e).signAsync(Ee(ie({}, t), { postConditions: n }));
}
function fE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(S0) : e = e.map((n) => V(_0(n)))), Dt.createUnsecuredToken(Ee(ie({}, t), { postConditions: e }));
}
var hE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = ft(a.replace(/^0x/, "")), l = n3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Ee(ie({}, o), { stacksTransaction: l }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Ee(ie({}, o), { stacksTransaction: l }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, dE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = q0(e, ["amount", "appDetails", "userSession"]);
  if (Y0(s)) {
    let { privateKey: a, publicKey: c } = X0(s), l = Ee(ie({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (l.appDetails = r), uE(l, a);
  }
  let o = Ee(ie({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), fE(o);
};
async function pE(t, e, n) {
  let r = await e(Ee(ie(ie({}, lE(t)), t), { network: _o(t.network) }));
  return hE({ token: r, options: t }, n);
}
function gE(t, e = W0()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return pE(t, dE, e);
}
function Z0(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Ee(ie({}, t), { message: rf(e), domain: rf(n) }) : Ee(ie({}, t), { message: V(lr(e)), domain: V(lr(n)) });
}
async function yE(t, e) {
  return new Dt.TokenSigner("ES256k", e).signAsync(Z0(t));
}
async function wE(t) {
  let e = t, { userSession: n } = e, r = q0(e, ["userSession"]);
  if (Y0(n)) {
    let { privateKey: s, publicKey: i } = X0(n), o = Ee(ie({}, r), { publicKey: i });
    return yE(o, s);
  }
  return Dt.createUnsecuredToken(Z0(t));
}
var bE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(bE || {}), Q0 = "asigna-stx", _f = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Q0 && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(mE(t, e), "*");
}), xE = { authenticationRequest: async (t) => _f(t, "authenticationRequest"), transactionRequest: async (t) => _f(t, "transactionRequest") }, mE = (t, e) => ({ source: Q0, [e]: t }), SE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = xE);
};
SE();
var EE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function AE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = rr(), o = W0();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    nE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : EE, c = px(a), l = document.createElement("connect-modal");
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
    let p = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", p), l.remove());
    };
    document.addEventListener("keydown", p);
  };
}
var Ei = AE(gE);
function Hn(t, e, n) {
  return ml(Kt(t, e), n);
}
function Kt(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = $t(r);
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
      const r = vE(BigInt(`0x${ot(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ot(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function kf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ws(t, e = 8) {
  return (typeof t == "bigint" ? t : Kt(t, !1)).toString(16).padStart(e * 2, "0");
}
function ko(t) {
  return parseInt(t, 16);
}
function ml(t, e = 16) {
  const n = Ws(t, e);
  return $t(n);
}
function $E(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function IE(t, e) {
  return t & BigInt(1) << e;
}
function vE(t, e) {
  return IE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const LE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ot(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += LE[n];
  return e;
}
function $t(t) {
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
function cs(t) {
  return new TextEncoder().encode(t);
}
function Sl(t) {
  return new TextDecoder().decode(t);
}
function J0(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function CE(t) {
  return String.fromCharCode.apply(null, t);
}
function BE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Uf(t) {
  if (t.some(BE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Uo(...t) {
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
function Tt(t) {
  return Uo(...t.map((e) => typeof e == "number" ? Uf([e]) : e instanceof Array ? Uf(e) : e));
}
var Tf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Tf || (Tf = {}));
var Hf;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Hf || (Hf = {}));
var Nf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Nf || (Nf = {}));
const tp = 33, da = 32;
function ME(t) {
  if (t.length < da * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + da * 2), r = t.slice(2 + da * 2);
  return {
    recoveryId: ko(e),
    r: n,
    s: r
  };
}
function _E(t) {
  const e = typeof t == "string" ? $t(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function kE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function UE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function TE(t, e) {
  return t[e];
}
function HE(t, e, n = 0) {
  return t[n] = e, t;
}
function NE(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ur(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var lc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(lc || (lc = {}));
const PE = lc.Mainnet, DE = 128, OE = 128, ep = 16, Yn = 32, uc = 80, To = 65, jE = 32, FE = 64, eo = 34;
var R;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(R || (R = {}));
var st;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(st || (st = {}));
var fc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(fc || (fc = {}));
var Yt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Yt || (Yt = {}));
const Ti = ["onChainOnly", "offChainOnly", "any"], Pf = {
  [Ti[0]]: Yt.OnChainOnly,
  [Ti[1]]: Yt.OffChainOnly,
  [Ti[2]]: Yt.Any,
  [Yt.OnChainOnly]: Yt.OnChainOnly,
  [Yt.OffChainOnly]: Yt.OffChainOnly,
  [Yt.Any]: Yt.Any
};
function zE(t) {
  if (t in Pf)
    return Pf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Ti.join(", ")}`);
}
var no;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(no || (no = {}));
no.Mainnet;
var Zr;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Zr || (Zr = {}));
var Xt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Xt || (Xt = {}));
var Ct;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ct || (Ct = {}));
var bt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(bt || (bt = {}));
var ro;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ro || (ro = {}));
var vt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(vt || (vt = {}));
var Ns;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ns || (Ns = {}));
var hc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(hc || (hc = {}));
var Ps;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ps || (Ps = {}));
var Df;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Df || (Df = {}));
var Of;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Of || (Of = {}));
function dc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function RE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function np(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function GE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  dc(t.outputLen), dc(t.blockLen);
}
function VE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function KE(t, e) {
  np(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Kn = {
  number: dc,
  bool: RE,
  bytes: np,
  hash: GE,
  exists: VE,
  output: KE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const pa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ce = (t, e) => t << 32 - e | t >>> e, qE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!qE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function WE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function El(t) {
  if (typeof t == "string" && (t = WE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class rp {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Sr(t) {
  const e = (r) => t().update(El(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function YE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
class Al extends rp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = pa(this.buffer);
  }
  update(e) {
    Kn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = El(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = pa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Kn.exists(this), Kn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    YE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = pa(e), c = this.outputLen;
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
const XE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), sp = Uint8Array.from({ length: 16 }, (t, e) => e), ZE = sp.map((t) => (9 * t + 5) % 16);
let $l = [sp], Il = [ZE];
for (let t = 0; t < 4; t++)
  for (let e of [$l, Il])
    e.push(e[t].map((n) => XE[n]));
const ip = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), QE = $l.map((t, e) => t.map((n) => ip[e][n])), JE = Il.map((t, e) => t.map((n) => ip[e][n])), t8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), e8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ai = (t, e) => t << e | t >>> 32 - e;
function jf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const $i = new Uint32Array(16);
class n8 extends Al {
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
      $i[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, x = t8[h], A = e8[h], _ = $l[h], U = Il[h], y = QE[h], L = JE[h];
      for (let E = 0; E < 16; E++) {
        const H = Ai(r + jf(h, i, a, l) + $i[_[E]] + x, y[E]) + u | 0;
        r = u, u = l, l = Ai(a, 10) | 0, a = i, i = H;
      }
      for (let E = 0; E < 16; E++) {
        const H = Ai(s + jf(w, o, c, f) + $i[U[E]] + A, L[E]) + p | 0;
        s = p, p = f, f = Ai(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    $i.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const r8 = Sr(() => new n8()), s8 = (t, e, n) => t & e ^ ~t & n, i8 = (t, e, n) => t & e ^ t & n ^ e & n, o8 = new Uint32Array([
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
]), En = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), An = new Uint32Array(64);
class op extends Al {
  constructor() {
    super(64, 32, 8, !1), this.A = En[0] | 0, this.B = En[1] | 0, this.C = En[2] | 0, this.D = En[3] | 0, this.E = En[4] | 0, this.F = En[5] | 0, this.G = En[6] | 0, this.H = En[7] | 0;
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
      An[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = An[u - 15], h = An[u - 2], w = Ce(p, 7) ^ Ce(p, 18) ^ p >>> 3, x = Ce(h, 17) ^ Ce(h, 19) ^ h >>> 10;
      An[u] = x + An[u - 7] + w + An[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = Ce(a, 6) ^ Ce(a, 11) ^ Ce(a, 25), h = f + p + s8(a, c, l) + o8[u] + An[u] | 0, x = (Ce(r, 2) ^ Ce(r, 13) ^ Ce(r, 22)) + i8(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    An.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class a8 extends op {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const vl = Sr(() => new op());
Sr(() => new a8());
const Ii = BigInt(2 ** 32 - 1), pc = BigInt(32);
function ap(t, e = !1) {
  return e ? { h: Number(t & Ii), l: Number(t >> pc & Ii) } : { h: Number(t >> pc & Ii) | 0, l: Number(t & Ii) | 0 };
}
function c8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ap(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const l8 = (t, e) => BigInt(t >>> 0) << pc | BigInt(e >>> 0), u8 = (t, e, n) => t >>> n, f8 = (t, e, n) => t << 32 - n | e >>> n, h8 = (t, e, n) => t >>> n | e << 32 - n, d8 = (t, e, n) => t << 32 - n | e >>> n, p8 = (t, e, n) => t << 64 - n | e >>> n - 32, g8 = (t, e, n) => t >>> n - 32 | e << 64 - n, y8 = (t, e) => e, w8 = (t, e) => t, b8 = (t, e, n) => t << n | e >>> 32 - n, x8 = (t, e, n) => e << n | t >>> 32 - n, m8 = (t, e, n) => e << n - 32 | t >>> 64 - n, S8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function E8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const A8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), $8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, I8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), v8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, L8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), C8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, nt = {
  fromBig: ap,
  split: c8,
  toBig: l8,
  shrSH: u8,
  shrSL: f8,
  rotrSH: h8,
  rotrSL: d8,
  rotrBH: p8,
  rotrBL: g8,
  rotr32H: y8,
  rotr32L: w8,
  rotlSH: b8,
  rotlSL: x8,
  rotlBH: m8,
  rotlBL: S8,
  add: E8,
  add3L: A8,
  add3H: $8,
  add4L: I8,
  add4H: v8,
  add5H: C8,
  add5L: L8
}, [B8, M8] = nt.split([
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
].map((t) => BigInt(t))), $n = new Uint32Array(80), In = new Uint32Array(80);
class Ho extends Al {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: w, Hh: x, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, w, x, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, w, x, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = x | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      $n[y] = e.getUint32(n), In[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const L = $n[y - 15] | 0, E = In[y - 15] | 0, H = nt.rotrSH(L, E, 1) ^ nt.rotrSH(L, E, 8) ^ nt.shrSH(L, E, 7), j = nt.rotrSL(L, E, 1) ^ nt.rotrSL(L, E, 8) ^ nt.shrSL(L, E, 7), O = $n[y - 2] | 0, P = In[y - 2] | 0, b = nt.rotrSH(O, P, 19) ^ nt.rotrBH(O, P, 61) ^ nt.shrSH(O, P, 6), v = nt.rotrSL(O, P, 19) ^ nt.rotrBL(O, P, 61) ^ nt.shrSL(O, P, 6), T = nt.add4L(j, v, In[y - 7], In[y - 16]), g = nt.add4H(T, H, b, $n[y - 7], $n[y - 16]);
      $n[y] = g | 0, In[y] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: w, Gh: x, Gl: A, Hh: _, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const L = nt.rotrSH(u, p, 14) ^ nt.rotrSH(u, p, 18) ^ nt.rotrBH(u, p, 41), E = nt.rotrSL(u, p, 14) ^ nt.rotrSL(u, p, 18) ^ nt.rotrBL(u, p, 41), H = u & h ^ ~u & x, j = p & w ^ ~p & A, O = nt.add5L(U, E, j, M8[y], In[y]), P = nt.add5H(O, _, L, H, B8[y], $n[y]), b = O | 0, v = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), T = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), g = r & i ^ r & a ^ i & a, C = s & o ^ s & c ^ o & c;
      _ = x | 0, U = A | 0, x = h | 0, A = w | 0, h = u | 0, w = p | 0, { h: u, l: p } = nt.add(l | 0, f | 0, P | 0, b | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const $ = nt.add3L(b, T, C);
      r = nt.add3H($, P, v, g), s = $ | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = nt.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = nt.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: w } = nt.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: x, l: A } = nt.add(this.Gh | 0, this.Gl | 0, x | 0, A | 0), { h: _, l: U } = nt.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, w, x, A, _, U);
  }
  roundClean() {
    $n.fill(0), In.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class _8 extends Ho {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class k8 extends Ho {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class U8 extends Ho {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Sr(() => new Ho());
Sr(() => new _8());
const T8 = Sr(() => new k8());
Sr(() => new U8());
function cp(t) {
  if ($t(t).byteLength != To)
    throw Error("Invalid signature");
  return {
    type: R.MessageSignature,
    data: t
  };
}
function ms(t, e) {
  return { type: R.Address, version: t, hash160: e };
}
function Hr(t) {
  return br.c32address(t.version, t.hash160);
}
function fr(t, e, n) {
  const r = e || 1, s = n || DE;
  if (Ip(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: R.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ll(t) {
  const e = br.c32addressDecode(t);
  return {
    type: R.Address,
    version: e[0],
    hash160: e[1]
  };
}
var k;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(k || (k = {}));
function H8(t) {
  if (t.type === k.PrincipalStandard)
    return Hr(t.address);
  if (t.type === k.PrincipalContract)
    return `${Hr(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function lp(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return D8(e, n);
  } else
    return N8(t);
}
function N8(t) {
  const e = Ll(t);
  return { type: k.PrincipalStandard, address: e };
}
function P8(t) {
  return { type: k.PrincipalStandard, address: t };
}
function D8(t, e) {
  const n = Ll(t), r = fr(e);
  return up(n, r);
}
function up(t, e) {
  if (cs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: k.PrincipalContract, address: t, contractName: e };
}
function ga(t, e = !1) {
  switch (t.type) {
    case k.BoolTrue:
      return !0;
    case k.BoolFalse:
      return !1;
    case k.Int:
    case k.UInt:
      return e ? t.value.toString() : t.value;
    case k.Buffer:
      return `0x${ot(t.buffer)}`;
    case k.OptionalNone:
      return null;
    case k.OptionalSome:
      return We(t.value);
    case k.ResponseErr:
      return We(t.value);
    case k.ResponseOk:
      return We(t.value);
    case k.PrincipalStandard:
    case k.PrincipalContract:
      return H8(t);
    case k.List:
      return t.list.map((r) => We(r));
    case k.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = We(t.data[r]);
      }), n;
    case k.StringASCII:
      return t.data;
    case k.StringUTF8:
      return t.data;
  }
}
function We(t) {
  switch (t.type) {
    case k.ResponseErr:
      return { type: Bn(t), value: ga(t, !0), success: !1 };
    case k.ResponseOk:
      return { type: Bn(t), value: ga(t, !0), success: !0 };
    default:
      return { type: Bn(t), value: ga(t, !0) };
  }
}
function Bn(t) {
  switch (t.type) {
    case k.BoolTrue:
    case k.BoolFalse:
      return "bool";
    case k.Int:
      return "int";
    case k.UInt:
      return "uint";
    case k.Buffer:
      return `(buff ${t.buffer.length})`;
    case k.OptionalNone:
      return "(optional none)";
    case k.OptionalSome:
      return `(optional ${Bn(t.value)})`;
    case k.ResponseErr:
      return `(response UnknownType ${Bn(t.value)})`;
    case k.ResponseOk:
      return `(response ${Bn(t.value)} UnknownType)`;
    case k.PrincipalStandard:
    case k.PrincipalContract:
      return "principal";
    case k.List:
      return `(list ${t.list.length} ${t.list.length ? Bn(t.list[0]) : "UnknownType"})`;
    case k.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Bn(t.data[e])})`).join(" ")})`;
    case k.StringASCII:
      return `(string-ascii ${J0(t.data).length})`;
    case k.StringUTF8:
      return `(string-utf8 ${cs(t.data).length})`;
  }
}
const fp = () => ({ type: k.BoolTrue }), hp = () => ({ type: k.BoolFalse }), O8 = (t) => t ? fp() : hp(), Ff = BigInt("0xffffffffffffffffffffffffffffffff"), j8 = BigInt(0), zf = BigInt("0x7fffffffffffffffffffffffffffffff"), Rf = BigInt("-170141183460469231731687303715884105728"), F8 = (t) => {
  const e = Kt(t, !0);
  if (e > zf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${zf}`);
  if (e < Rf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Rf}`);
  return { type: k.Int, value: e };
}, so = (t) => {
  const e = Kt(t, !1);
  if (e < j8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Ff)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ff}`);
  return { type: k.UInt, value: e };
}, dp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: k.Buffer, buffer: t };
};
function pp() {
  return { type: k.OptionalNone };
}
function gp(t) {
  return { type: k.OptionalSome, value: t };
}
function z8(t) {
  return { type: k.ResponseErr, value: t };
}
function R8(t) {
  return { type: k.ResponseOk, value: t };
}
function G8(t) {
  return { type: k.List, list: t };
}
function gc(t) {
  for (const e in t)
    if (!UA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: k.Tuple, data: t };
}
const _r = (t) => ({ type: k.StringASCII, data: t }), V8 = (t) => ({ type: k.StringUTF8, data: t });
class yp extends rp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Kn.hash(e);
    const r = El(n);
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
    return Kn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Kn.exists(this), Kn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const wp = (t, e, n) => new yp(t, e).update(n).digest();
wp.create = (t, e) => new yp(t, e);
Bt.hmacSha256Sync = (t, ...e) => {
  const n = wp.create(vl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Qr(t) {
  return {
    type: R.PublicKey,
    data: $t(t)
  };
}
function K8(t, e, n = vt.Compressed) {
  const r = ME(e.data), s = new re(kf(r.r), kf(r.s)), i = it.fromSignature(t, s, r.recoveryId), o = n === vt.Compressed;
  return i.toHex(o);
}
function q8(t) {
  return { type: R.PublicKey, data: t };
}
function ls(t) {
  return !ot(t.data).startsWith("04");
}
function io(t) {
  return t.data.slice();
}
function W8(t) {
  const e = Z8(t), n = Rs(e.data.slice(0, 32), e.compressed);
  return Qr(ot(n));
}
function Y8(t) {
  const e = typeof t == "string" ? t : ot(t), n = it.fromHex(e).toHex(!0);
  return Qr(n);
}
function X8(t) {
  const e = typeof t == "string" ? t : ot(t), n = it.fromHex(e).toHex(!1);
  return Qr(n);
}
function yc(t) {
  const e = t.readUInt8(), n = e === 4 ? FE : jE;
  return q8(Tt([e, t.readBytes(n)]));
}
function Z8(t) {
  const e = _E(t), n = e.length == tp;
  return { data: e, compressed: n };
}
function Q8(t, e) {
  const [n, r] = ho(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Ws(r, 1) + re.fromHex(n).toCompactHex();
  return cp(i);
}
function J8(t) {
  return W8(t.data);
}
function tA(t, e, n) {
  return typeof t == "string" && (t = lp(t)), typeof n == "string" && (n = Kf(n)), {
    type: R.Payload,
    payloadType: st.TokenTransfer,
    recipient: t,
    amount: Kt(e, !1),
    memo: n ?? Kf("")
  };
}
function eA(t, e, n, r) {
  return typeof t == "string" && (t = Ll(t)), typeof e == "string" && (e = fr(e)), typeof n == "string" && (n = fr(n)), {
    type: R.Payload,
    payloadType: st.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Gf(t, e, n) {
  return typeof t == "string" && (t = fr(t)), typeof e == "string" && (e = uA(e)), typeof n == "number" ? {
    type: R.Payload,
    payloadType: st.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: R.Payload,
    payloadType: st.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function nA() {
  return { type: R.Payload, payloadType: st.PoisonMicroblock };
}
function Vf(t, e) {
  if (t.byteLength != Yn)
    throw Error(`Coinbase buffer size must be ${Yn} bytes`);
  return e != null ? {
    type: R.Payload,
    payloadType: st.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: R.Payload,
    payloadType: st.Coinbase,
    coinbaseBytes: t
  };
}
function rA(t, e, n) {
  if (t.byteLength != Yn)
    throw Error(`Coinbase buffer size must be ${Yn} bytes`);
  if (n.byteLength != uc)
    throw Error(`VRF proof buffer size must be ${uc} bytes`);
  return {
    type: R.Payload,
    payloadType: st.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === k.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var wc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(wc || (wc = {}));
function sA(t, e, n, r, s, i, o) {
  return {
    type: R.Payload,
    payloadType: st.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function bp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case st.TokenTransfer:
      e.push(kt(t.recipient)), e.push(Hn(t.amount, !1, 8)), e.push(Ke(t.memo));
      break;
    case st.ContractCall:
      e.push(Ke(t.contractAddress)), e.push(Ke(t.contractName)), e.push(Ke(t.functionName));
      const n = new Uint8Array(4);
      ur(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(kt(r));
      });
      break;
    case st.SmartContract:
      e.push(Ke(t.contractName)), e.push(Ke(t.codeBody));
      break;
    case st.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ke(t.contractName)), e.push(Ke(t.codeBody));
      break;
    case st.PoisonMicroblock:
      break;
    case st.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case st.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(kt(t.recipient));
      break;
    case st.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(kt(t.recipient ? gp(t.recipient) : pp())), e.push(t.vrfProof);
      break;
    case st.TenureChange:
      e.push($t(t.tenureHash)), e.push($t(t.previousTenureHash)), e.push($t(t.burnViewHash)), e.push($t(t.previousTenureEnd)), e.push(ur(new Uint8Array(4), t.previousTenureBlocks)), e.push(HE(new Uint8Array(1), t.cause)), e.push($t(t.publicKeyHash));
      break;
  }
  return Tt(e);
}
function iA(t) {
  switch (t.readUInt8Enum(st, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case st.TokenTransfer:
      const n = de(t), r = Kt(t.readBytes(8), !1), s = mp(t);
      return tA(n, r, s);
    case st.ContractCall:
      const i = Jr(t), o = he(t), a = he(t), c = [], l = t.readUInt32BE();
      for (let y = 0; y < l; y++) {
        const L = de(t);
        c.push(L);
      }
      return eA(i, o, a, c);
    case st.SmartContract:
      const f = he(t), u = he(t, 4, 1e5);
      return Gf(f, u);
    case st.VersionedSmartContract: {
      const y = t.readUInt8Enum(fc, (H) => {
        throw new Error(`Cannot recognize ClarityVersion: ${H}`);
      }), L = he(t), E = he(t, 4, 1e5);
      return Gf(L, E, y);
    }
    case st.PoisonMicroblock:
      return nA();
    case st.Coinbase: {
      const y = t.readBytes(Yn);
      return Vf(y);
    }
    case st.CoinbaseToAltRecipient: {
      const y = t.readBytes(Yn), L = de(t);
      return Vf(y, L);
    }
    case st.NakamotoCoinbase: {
      const y = t.readBytes(Yn), L = de(t), E = t.readBytes(uc);
      return rA(y, L, E);
    }
    case st.TenureChange:
      const p = ot(t.readBytes(20)), h = ot(t.readBytes(20)), w = ot(t.readBytes(20)), x = ot(t.readBytes(32)), A = t.readUInt32BE(), _ = t.readUInt8Enum(wc, (y) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${y}`);
      }), U = ot(t.readBytes(20));
      return sA(p, h, w, x, A, _, U);
  }
}
class No extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Fn extends No {
  constructor(e) {
    super(e);
  }
}
class ne extends No {
  constructor(e) {
    super(e);
  }
}
class oo extends No {
  constructor(e) {
    super(e);
  }
}
class qn extends No {
  constructor(e) {
    super(e);
  }
}
var xe;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(xe || (xe = {}));
function bc(t) {
  return cp(ot(t.readBytes(To)));
}
function Nr(t, e) {
  return {
    pubKeyEncoding: t,
    type: R.TransactionAuthField,
    contents: e
  };
}
function oA(t) {
  const e = t.readUInt8Enum(xe, (n) => {
    throw new ne(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case xe.PublicKeyCompressed:
      return Nr(vt.Compressed, yc(t));
    case xe.PublicKeyUncompressed:
      return Nr(vt.Uncompressed, X8(yc(t).data));
    case xe.SignatureCompressed:
      return Nr(vt.Compressed, bc(t));
    case xe.SignatureUncompressed:
      return Nr(vt.Uncompressed, bc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Cl(t) {
  return $t(t.data);
}
function aA(t) {
  const e = [];
  switch (t.contents.type) {
    case R.PublicKey:
      e.push(t.pubKeyEncoding === vt.Compressed ? xe.PublicKeyCompressed : xe.PublicKeyUncompressed), e.push(io(Y8(t.contents.data)));
      break;
    case R.MessageSignature:
      e.push(t.pubKeyEncoding === vt.Compressed ? xe.SignatureCompressed : xe.SignatureUncompressed), e.push(Cl(t.contents));
      break;
  }
  return Tt(e);
}
function Ke(t) {
  switch (t.type) {
    case R.Address:
      return Ys(t);
    case R.Principal:
      return xp(t);
    case R.LengthPrefixedString:
      return ts(t);
    case R.MemoString:
      return fA(t);
    case R.AssetInfo:
      return Sp(t);
    case R.PostCondition:
      return hA(t);
    case R.PublicKey:
      return io(t);
    case R.LengthPrefixedList:
      return _l(t);
    case R.Payload:
      return bp(t);
    case R.TransactionAuthField:
      return aA(t);
    case R.MessageSignature:
      return Cl(t);
  }
}
function cA() {
  return {
    type: R.Address,
    version: ro.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Bl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === bt.SerializeP2PKH || e === bt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === bt.SerializeP2WPKH || e === bt.SerializeP2WSH || e === bt.SerializeP2WSHNonSequential) && !r.every(ls))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case bt.SerializeP2PKH:
      return ms(t, BA(r[0].data));
    case bt.SerializeP2WPKH:
      return ms(t, MA(r[0].data));
    case bt.SerializeP2SH:
    case bt.SerializeP2SHNonSequential:
      return ms(t, _A(n, r.map(io)));
    case bt.SerializeP2WSH:
    case bt.SerializeP2WSHNonSequential:
      return ms(t, kA(n, r.map(io)));
  }
}
function Ys(t) {
  const e = [];
  return e.push($t(Ws(t.version, 1))), e.push($t(t.hash160)), Tt(e);
}
function Jr(t) {
  const e = ko(ot(t.readBytes(1))), n = ot(t.readBytes(20));
  return { type: R.Address, version: e, hash160: n };
}
function xp(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ys(t.address)), t.prefix === Ps.Contract && e.push(ts(t.contractName)), Tt(e);
}
function lA(t) {
  const e = t.readUInt8Enum(Ps, (s) => {
    throw new ne(`Unexpected Principal payload type: ${s}`);
  }), n = Jr(t);
  if (e === Ps.Standard)
    return { type: R.Principal, prefix: e, address: n };
  const r = he(t);
  return {
    type: R.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function ts(t) {
  const e = [], n = cs(t.content), r = n.byteLength;
  return e.push($t(Ws(r, t.lengthPrefixBytes))), e.push(n), Tt(e);
}
function he(t, e, n) {
  e = e || 1;
  const r = ko(ot(t.readBytes(e))), s = Sl(t.readBytes(r));
  return fr(s, e, n ?? 128);
}
function uA(t) {
  return fr(t, 4, 1e5);
}
function Kf(t) {
  if (t && Ip(t, eo))
    throw new Error(`Memo exceeds maximum length of ${eo} bytes`);
  return { type: R.MemoString, content: t };
}
function fA(t) {
  const e = [], n = cs(t.content), r = CA(ot(n), eo * 2);
  return e.push($t(r)), Tt(e);
}
function mp(t) {
  let e = Sl(t.readBytes(eo));
  return e = e.replace(/\u0000*$/, ""), { type: R.MemoString, content: e };
}
function Sp(t) {
  const e = [];
  return e.push(Ys(t.address)), e.push(ts(t.contractName)), e.push(ts(t.assetName)), Tt(e);
}
function xc(t) {
  return {
    type: R.AssetInfo,
    address: Jr(t),
    contractName: he(t),
    assetName: he(t)
  };
}
function Ml(t, e) {
  return {
    type: R.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function _l(t) {
  const e = t.values, n = [];
  n.push($t(Ws(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ke(r));
  return Tt(n);
}
function Ep(t, e, n) {
  const r = ko(ot(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case R.Address:
        s.push(Jr(t));
        break;
      case R.LengthPrefixedString:
        s.push(he(t));
        break;
      case R.MemoString:
        s.push(mp(t));
        break;
      case R.AssetInfo:
        s.push(xc(t));
        break;
      case R.PostCondition:
        s.push(dA(t));
        break;
      case R.PublicKey:
        s.push(yc(t));
        break;
      case R.TransactionAuthField:
        s.push(oA(t));
        break;
    }
  return Ml(s, n);
}
function hA(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(xp(t.principal)), (t.conditionType === Xt.Fungible || t.conditionType === Xt.NonFungible) && e.push(Sp(t.assetInfo)), t.conditionType === Xt.NonFungible && e.push(kt(t.assetName)), e.push(t.conditionCode), t.conditionType === Xt.STX || t.conditionType === Xt.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Fn("The post-condition amount may not be larger than 8 bytes");
    e.push(Hn(t.amount, !1, 8));
  }
  return Tt(e);
}
function dA(t) {
  const e = t.readUInt8Enum(Xt, (o) => {
    throw new ne(`Could not read ${o} as PostConditionType`);
  }), n = lA(t);
  let r, s, i;
  switch (e) {
    case Xt.STX:
      return r = t.readUInt8Enum(Ns, (a) => {
        throw new ne(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ot(t.readBytes(8))}`), {
        type: R.PostCondition,
        conditionType: Xt.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Xt.Fungible:
      return s = xc(t), r = t.readUInt8Enum(Ns, (a) => {
        throw new ne(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ot(t.readBytes(8))}`), {
        type: R.PostCondition,
        conditionType: Xt.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Xt.NonFungible:
      s = xc(t);
      const o = de(t);
      return r = t.readUInt8Enum(hc, (a) => {
        throw new ne(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: R.PostCondition,
        conditionType: Xt.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function De(t, e) {
  return Tt([t, e]);
}
function pA(t) {
  return new Uint8Array([t.type]);
}
function gA(t) {
  return t.type === k.OptionalNone ? new Uint8Array([t.type]) : De(t.type, kt(t.value));
}
function yA(t) {
  const e = new Uint8Array(4);
  return ur(e, t.buffer.length, 0), De(t.type, Uo(e, t.buffer));
}
function wA(t) {
  const e = ml($E(t.value, BigInt(OE)), ep);
  return De(t.type, e);
}
function bA(t) {
  const e = ml(t.value, ep);
  return De(t.type, e);
}
function xA(t) {
  return De(t.type, Ys(t.address));
}
function mA(t) {
  return De(t.type, Uo(Ys(t.address), ts(t.contractName)));
}
function SA(t) {
  return De(t.type, kt(t.value));
}
function EA(t) {
  const e = [], n = new Uint8Array(4);
  ur(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = kt(r);
    e.push(s);
  }
  return De(t.type, Tt(e));
}
function AA(t) {
  const e = [], n = new Uint8Array(4);
  ur(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = fr(s);
    e.push(ts(i));
    const o = kt(t.data[s]);
    e.push(o);
  }
  return De(t.type, Tt(e));
}
function Ap(t, e) {
  const n = [], r = e == "ascii" ? J0(t.data) : cs(t.data), s = new Uint8Array(4);
  return ur(s, r.length, 0), n.push(s), n.push(r), De(t.type, Tt(n));
}
function $A(t) {
  return Ap(t, "ascii");
}
function IA(t) {
  return Ap(t, "utf8");
}
function kt(t) {
  switch (t.type) {
    case k.BoolTrue:
    case k.BoolFalse:
      return pA(t);
    case k.OptionalNone:
    case k.OptionalSome:
      return gA(t);
    case k.Buffer:
      return yA(t);
    case k.UInt:
      return bA(t);
    case k.Int:
      return wA(t);
    case k.PrincipalStandard:
      return xA(t);
    case k.PrincipalContract:
      return mA(t);
    case k.ResponseOk:
    case k.ResponseErr:
      return SA(t);
    case k.List:
      return EA(t);
    case k.Tuple:
      return AA(t);
    case k.StringASCII:
      return $A(t);
    case k.StringUTF8:
      return IA(t);
    default:
      throw new Fn("Unable to serialize. Invalid Clarity Value.");
  }
}
function vA(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const qf = /* @__PURE__ */ new Map();
function $p(t, e) {
  const n = qf.get(t);
  if (n !== void 0)
    return n(e);
  const r = vA(t);
  return qf.set(t, r), $p(t, e);
}
class Is {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return NE(this.readBytes(4), 0);
  }
  readUInt8() {
    return TE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return kE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ot(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ot(n);
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
    if ($p(e, r))
      return r;
    throw n(r);
  }
}
function de(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Is($t(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Is(t) : e = t;
  switch (e.readUInt8Enum(k, (r) => {
    throw new ne(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case k.Int:
      return F8(e.readBytes(16));
    case k.UInt:
      return so(e.readBytes(16));
    case k.Buffer:
      const r = e.readUInt32BE();
      return dp(e.readBytes(r));
    case k.BoolTrue:
      return fp();
    case k.BoolFalse:
      return hp();
    case k.PrincipalStandard:
      const s = Jr(e);
      return P8(s);
    case k.PrincipalContract:
      const i = Jr(e), o = he(e);
      return up(i, o);
    case k.ResponseOk:
      return R8(de(e));
    case k.ResponseErr:
      return z8(de(e));
    case k.OptionalNone:
      return pp();
    case k.OptionalSome:
      return gp(de(e));
    case k.List:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(de(e));
      return G8(c);
    case k.Tuple:
      const l = e.readUInt32BE(), f = {};
      for (let x = 0; x < l; x++) {
        const A = he(e).content;
        if (A === void 0)
          throw new ne('"content" is undefined');
        f[A] = de(e);
      }
      return gc(f);
    case k.StringASCII:
      const u = e.readUInt32BE(), p = CE(e.readBytes(u));
      return _r(p);
    case k.StringUTF8:
      const h = e.readUInt32BE(), w = Sl(e.readBytes(h));
      return V8(w);
    default:
      throw new ne("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const LA = (t) => t.length % 2 == 0 ? t : `0${t}`, CA = (t, e) => t.padEnd(e, "0"), Ip = (t, e) => t ? cs(t).length > e : !1;
function mc(t) {
  return Gd(t);
}
const Ds = (t) => r8(vl(t)), kl = (t) => ot(T8(t)), BA = (t) => ot(Ds(t)), MA = (t) => {
  const e = Ds(t), n = Uo(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ds(n);
  return ot(r);
}, _A = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Tt(n), s = Ds(r);
  return ot(s);
}, kA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Tt(n), s = vl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Tt(i), a = Ds(o);
  return ot(a);
};
function UA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function vp(t) {
  const e = kt(t);
  return `0x${ot(e)}`;
}
function TA(t) {
  return de(t);
}
const vs = (t) => {
  try {
    return br.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Ul() {
  return {
    type: R.MessageSignature,
    data: ot(new Uint8Array(To))
  };
}
function Lp(t, e, n, r) {
  const s = Bl(0, t, 1, [Qr(e)]).hash160, i = ls(Qr(e)) ? vt.Compressed : vt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Kt(n, !1),
    fee: Kt(r, !1),
    keyEncoding: i,
    signature: Ul()
  };
}
function Os(t) {
  return "signature" in t;
}
function Wf(t) {
  return t === bt.SerializeP2SH || t === bt.SerializeP2WSH;
}
function HA(t) {
  return t === bt.SerializeP2SHNonSequential || t === bt.SerializeP2WSHNonSequential;
}
function Yf(t) {
  const e = mc(t);
  return e.nonce = 0, e.fee = 0, Os(e) ? e.signature = Ul() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function NA(t) {
  const e = [
    t.hashMode,
    $t(t.signer),
    Hn(t.nonce, !1, 8),
    Hn(t.fee, !1, 8),
    t.keyEncoding,
    Cl(t.signature)
  ];
  return Tt(e);
}
function PA(t) {
  const e = [
    t.hashMode,
    $t(t.signer),
    Hn(t.nonce, !1, 8),
    Hn(t.fee, !1, 8)
  ], n = Ml(t.fields);
  e.push(_l(n));
  const r = new Uint8Array(2);
  return UE(r, t.signaturesRequired, 0), e.push(r), Tt(e);
}
function DA(t, e) {
  const n = ot(e.readBytes(20)), r = BigInt(`0x${ot(e.readBytes(8))}`), s = BigInt(`0x${ot(e.readBytes(8))}`), i = e.readUInt8Enum(vt, (a) => {
    throw new ne(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === bt.SerializeP2WPKH && i != vt.Compressed)
    throw new ne("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = bc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function OA(t, e) {
  const n = ot(e.readBytes(20)), r = BigInt("0x" + ot(e.readBytes(8))), s = BigInt("0x" + ot(e.readBytes(8))), i = Ep(e, R.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case R.PublicKey:
        ls(l.contents) || (o = !0);
        break;
      case R.MessageSignature:
        if (l.pubKeyEncoding === vt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new qn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === bt.SerializeP2WSH || t === bt.SerializeP2WSHNonSequential))
    throw new qn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ya(t) {
  return Os(t) ? NA(t) : PA(t);
}
function wa(t) {
  const e = t.readUInt8Enum(bt, (n) => {
    throw new ne(`Could not parse ${n} as AddressHashMode`);
  });
  return e === bt.SerializeP2PKH || e === bt.SerializeP2WPKH ? DA(e, t) : OA(e, t);
}
function Cp(t, e, n, r) {
  const i = t + ot(new Uint8Array([e])) + ot(Hn(n, !1, 8)) + ot(Hn(r, !1, 8));
  if ($t(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return kl($t(i));
}
function Bp(t, e, n) {
  const r = 33 + To, s = ls(e) ? vt.Compressed : vt.Uncompressed, i = t + LA(s.toString(16)) + n.data, o = $t(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return kl(o);
}
function jA(t, e, n, r, s) {
  const i = Cp(t, e, n, r), o = Q8(s, i), a = J8(s), c = Bp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Mp(t, e, n, r, s, i) {
  const o = Cp(t, e, n, r), a = Qr(K8(o, i, s)), c = Bp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function FA() {
  const t = Lp(bt.SerializeP2PKH, "", 0, 0);
  return t.signer = cA().hash160, t.keyEncoding = vt.Compressed, t.signature = Ul(), t;
}
function Xf(t, e, n) {
  return Os(t) ? zA(t, e, n) : RA(t, e, n);
}
function zA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Mp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Bl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new qn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function RA(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case R.PublicKey:
        ls(c.contents) || (i = !0), r.push(c.contents);
        break;
      case R.MessageSignature:
        c.pubKeyEncoding === vt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = Mp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Wf(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new qn("Too many signatures");
        break;
    }
  if (Wf(t.hashMode) && o !== t.signaturesRequired || HA(t.hashMode) && o < t.signaturesRequired)
    throw new qn("Incorrect number of signatures");
  if (i && (t.hashMode === bt.SerializeP2WSH || t.hashMode === bt.SerializeP2WSHNonSequential))
    throw new qn("Uncompressed keys are not allowed in this hash mode");
  const a = Bl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new qn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function _p(t) {
  return {
    authType: Ct.Standard,
    spendingCondition: t
  };
}
function kp(t, e) {
  return {
    authType: Ct.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Lp(bt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Zf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ct.Standard:
        return _p(Yf(t.spendingCondition));
      case Ct.Sponsored:
        return kp(Yf(t.spendingCondition), FA());
      default:
        throw new oo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function GA(t, e) {
  switch (t.authType) {
    case Ct.Standard:
      return Xf(t.spendingCondition, e, Ct.Standard);
    case Ct.Sponsored:
      return Xf(t.spendingCondition, e, Ct.Standard);
    default:
      throw new oo("Invalid origin auth type");
  }
}
function VA(t, e) {
  switch (t.authType) {
    case Ct.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Kt(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Ct.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Kt(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function KA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Kt(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function qA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Kt(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function WA(t, e) {
  const n = {
    ...e,
    nonce: Kt(e.nonce, !1),
    fee: Kt(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function YA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ct.Standard:
      e.push(ya(t.spendingCondition));
      break;
    case Ct.Sponsored:
      e.push(ya(t.spendingCondition)), e.push(ya(t.sponsorSpendingCondition));
      break;
  }
  return Tt(e);
}
function XA(t) {
  const e = t.readUInt8Enum(Ct, (r) => {
    throw new ne(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ct.Standard:
      return n = wa(t), _p(n);
    case Ct.Sponsored:
      n = wa(t);
      const r = wa(t);
      return kp(n, r);
  }
}
class ZA {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Kt(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? PE, this.postConditionMode = i ?? Zr.Deny, this.postConditions = s ?? Ml([]), o)
      this.anchorMode = zE(o);
    else
      switch (r.payloadType) {
        case st.Coinbase:
        case st.CoinbaseToAltRecipient:
        case st.NakamotoCoinbase:
        case st.PoisonMicroblock:
        case st.TenureChange:
          this.anchorMode = Yt.OnChainOnly;
          break;
        case st.ContractCall:
        case st.SmartContract:
        case st.VersionedSmartContract:
        case st.TokenTransfer:
          this.anchorMode = Yt.Any;
          break;
      }
  }
  signBegin() {
    const e = mc(this);
    return e.auth = Zf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = mc(this);
    return e.auth = Zf(e.auth), e.txid();
  }
  verifyOrigin() {
    return GA(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ct.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ct.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ct.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Os(n)) {
      const r = ls(e);
      n.fields.push(Nr(r ? vt.Compressed : vt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = jA(n, r, e.fee, e.nonce, s);
    return Os(e) ? e.signature = i : e.fields.push(Nr(s.data.byteLength === tp ? vt.Compressed : vt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return kl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ct.Sponsored)
      throw new oo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = WA(this.auth, e);
  }
  setFee(e) {
    this.auth = VA(this.auth, e);
  }
  setNonce(e) {
    this.auth = KA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ct.Sponsored)
      throw new oo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = qA(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Fn('"version" is undefined');
    if (this.chainId === void 0)
      throw new Fn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Fn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Fn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Fn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return ur(n, this.chainId, 0), e.push(n), e.push(YA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(_l(this.postConditions)), e.push(bp(this.payload)), Tt(e);
  }
}
function Tl(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Is($t(t.slice(2))) : e = new Is($t(t)) : t instanceof Uint8Array ? e = new Is(t) : e = t;
  const n = e.readUInt8Enum(no, (l) => {
    throw new Error(`Could not parse ${l} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = XA(e), i = e.readUInt8Enum(Yt, (l) => {
    throw new Error(`Could not parse ${l} as AnchorMode`);
  }), o = e.readUInt8Enum(Zr, (l) => {
    throw new Error(`Could not parse ${l} as PostConditionMode`);
  }), a = Ep(e, R.PostCondition), c = iA(e);
  return new ZA(n, s, c, a, o, i, r);
}
const QA = O8, Ls = so, JA = dp;
const t6 = /* @__PURE__ */ new Set([4001, -31001]), e6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], n6 = ["result", "data", "payload", "response", "params"], Qf = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Po = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Er = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Xe = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, r6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Up = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => r6(i, r)) === s
  );
}, Tp = (t) => t ? Up(Er()).some(
  (e) => {
    var n;
    return e.id === t && (Po(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Hp = () => {
  if (typeof window > "u")
    return;
  const t = Er(), e = Up(t).filter(
    (n) => {
      var r;
      return Po(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Xe(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of e6) {
    const r = Xe(t, n) ?? (t === window ? void 0 : Xe(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, s6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Er(), n = Xe(e, t) ?? (e === window ? void 0 : Xe(window, t)) ?? Ao(t);
  if (n)
    return n;
  if (Po(t) || Tp(t))
    return Hp();
}, vi = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, i6 = ["blockstack-session", "blockstack"], o6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of i6) {
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
o6();
const Np = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, ee = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, a6 = (t) => {
  const e = ee(t);
  if (!e)
    return null;
  const n = Np(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, c6 = (t) => {
  const e = ee(t);
  if (!e)
    return null;
  const n = Np(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Sc = (t, e = "mainnet") => {
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
      return Sc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Sc(r, e);
  }
  return e;
}, Xn = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, js = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return vs(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = js(s, e + 1);
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
    const i = js(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && vs(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && vs(n.testnet) ? n.testnet.trim() : null;
}, Jf = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Pp = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && t6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, hr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = ee(n == null ? void 0 : n.message) ?? ee(e.message) ?? ee(e.error) ?? ee(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, es = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw hr(e);
    if (e.status === "error")
      throw hr(e.result ?? e);
  }
  return t;
}, th = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return es(r);
  } catch (r) {
    throw hr(r);
  }
}, Dp = () => Hp(), Hl = () => {
  if (typeof window > "u")
    return;
  const t = Er();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Xe(t, e) ?? (t === window ? void 0 : Xe(window, e));
    if (n)
      return n;
  }
}, eh = () => {
  if (typeof window > "u")
    return;
  const t = Hl();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Er();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Xe(e, n) ?? (e === window ? void 0 : Xe(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Hi = (t) => {
  var r, s;
  const e = rr();
  if (Po(e) || Tp(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Er() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Dp();
}, ba = (t) => {
  const e = c6(t);
  if (!e)
    return null;
  try {
    const n = Tl(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, ao = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = ba(t), r = a6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? ee(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = ao(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Qf)
    if (ba(s[a])) {
      i = ee(s[a]);
      break;
    }
  const o = ee(s.txId) || ee(s.txid) || ee(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? ee(s.txRaw) ?? void 0
    };
  for (const a of Qf) {
    const c = ba(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: ee(s[a]) ?? void 0
      };
  }
  for (const a of n6) {
    const c = s[a], l = ao(c, e + 1);
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
}, xa = (t) => {
  const e = ao(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, l6 = (t) => {
  const e = ao(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, u6 = (t) => ({
  ...t,
  fee: Xn(t.fee),
  nonce: Xn(t.nonce),
  sponsored: t.sponsored === !0
}), nh = (t) => ({
  recipient: t.recipient,
  amount: Xn(t.amount) ?? "0",
  memo: t.memo,
  network: Sc(t.network),
  address: t.stxAddress,
  fee: Xn(t.fee),
  nonce: Xn(t.nonce),
  sponsored: t.sponsored ?? !1
}), Op = "WALLET_ADDRESS_MISMATCH", f6 = 45e3;
let Cs = null;
const Ec = (t) => {
  t && (Cs = { address: t, at: Date.now() });
}, h6 = () => {
  Cs = null;
}, d6 = () => Cs && Date.now() - Cs.at <= f6 ? Cs.address : null, p6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, g6 = async (t) => {
  h6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = es(await t.request("wallet_connect")), n = js(e);
  return Ec(n), n;
}, y6 = async (t, e, n, r) => {
  try {
    return es(await t.request(e, n));
  } catch (s) {
    const i = hr(s);
    if (!p6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await g6(t);
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
        { code: o ? Op : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return es(await t.request(e, n));
    } catch (a) {
      throw hr(a);
    }
  }
};
let rh = 3e4;
const w6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${rh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, rh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, b6 = async (t, e, n) => {
  const r = (c, l) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${l}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Op }
      );
    return c;
  }, s = d6();
  if (s)
    return vi(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  vi(n, "account-read");
  try {
    const c = es(
      await w6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = js(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Pp(c))
      throw hr(c);
    vi(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Ec(i), r(i, "wallet_getAccount");
  let o;
  vi(n, "account-reconnect");
  try {
    o = es(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), hr(c);
  }
  const a = js(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Ec(a), r(a, "wallet_connect");
}, x6 = async (t, e) => {
  if (!Hi(t)) {
    const i = await th(
      t,
      "stx_transferStx",
      nh(e)
    );
    return xa(i);
  }
  const n = Hl();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await th(
      n,
      "stx_transferStx",
      nh(e)
    );
    return xa(i);
  }
  const r = Dp();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await b6(r, e.stxAddress);
  const s = await y6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Xn(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Xn(e.fee) } : {}
    },
    e.stxAddress
  );
  return xa(s);
}, m6 = () => rr(), jp = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = rr(), e = t ? s6(t) : void 0;
  if (e)
    return e;
  const n = Er() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, S6 = (t, e) => {
  const n = jp(), r = u6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, l6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Ei(r, e);
  if (Hi(n) && !Hl()) {
    const s = eh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: rr(),
        route: "legacy-transaction-request"
      }), Ei(r, s);
  }
  return void x6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Jf(s) && Hi(n)) {
      const a = eh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: rr(),
          route: "legacy-transaction-request"
        }), Ei(r, a);
        return;
      }
    }
    if (Jf(s) && !Hi(n)) {
      Ei(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Pp(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, sh = (t) => vp(t).replace(/^0x/, ""), ih = "This wallet cannot sign messages. Try Xverse or Leather.", oh = (t) => typeof (t == null ? void 0 : t.request) == "function", ah = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", E6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, A6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function $6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: sh(e.message),
    domain: sh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function I6(t, e) {
  const n = await wE({
    domain: e.domain,
    message: e.message,
    network: _o(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function v6(t) {
  var s, i;
  const e = m6() || "", n = /xverse/i.test(e);
  let r = jp();
  if (n && !ah(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (ah(r))
    try {
      return await I6(r, t);
    } catch (o) {
      if (n || !oh(r) || !A6(o)) throw o;
    }
  if (!n && oh(r))
    try {
      return await $6(r, t);
    } catch (o) {
      throw E6(o) ? new Error(ih) : o;
    }
  throw new Error(ih);
}
const ch = 1000000n, Bs = 1000000n, Ac = 50n, co = 3000n, Nl = 300n, L6 = 3000n, C6 = 50000n, Do = (t) => t + Ac;
function vn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / ch}.${(n % ch).toString().padStart(6, "0")}`;
}
function B6(t, e = Nl) {
  return t <= co ? 0 : Number((t - co) / Do(e));
}
function lh(t, e = 0n) {
  const n = Bs - t - e;
  return n > 0n ? n : 0n;
}
function M6(t, e = Nl) {
  return t > Bs ? "over" : t < co + Do(e) ? "empty" : t < C6 ? "low" : "ok";
}
const _6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", k6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", U6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function T6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || U6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== _6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Fp = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", ma = 3, H6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [$c, zp] = Fp.split("."), le = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Ic(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function N6(t) {
  return le(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function ns(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Rp(t, e = []) {
  const n = await ns(`/v2/contracts/call-read/${$c}/${zp}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: $c, arguments: e.map((r) => "0x" + le(kt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return We(de(n.result));
}
async function P6() {
  const t = await ns(`/v2/contracts/source/${$c}/${zp}?proof=0`);
  if (typeof t.source != "string" || await N6(t.source) !== k6) throw Error("Deployed source does not match the tested helper.");
  if (T6(await Rp("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Gp(t) {
  return t.startsWith("SP") && vs(t) && !t.includes(".");
}
async function D6(t) {
  var r;
  if (!Gp(t)) throw Error("Invalid mainnet wallet address.");
  const e = await ns(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await ns(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function O6(t) {
  const e = await ns(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function j6(t, e) {
  var s, i;
  const n = await Rp("get-owner", [Ls(t), Ls(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Gp(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function F6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Ic(t), signal: AbortSignal.timeout(15e3) });
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
async function z6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function R6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Tl(Ic(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Hr(ms(ro.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Hr(r.contractAddress) + "." + r.contractName.content !== Fp || r.functionName.content !== "play" || r.functionArgs.length !== 3 || le(kt(r.functionArgs[0])) !== le(kt(Ls(t.core))) || le(kt(r.functionArgs[1])) !== le(kt(Ls(t.song))) || le(kt(r.functionArgs[2])) !== le(kt(JA(Ic(t.id)))) || t.amount !== "50" || e.postConditionMode !== Zr.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Ns.Equal || i.principal.prefix !== 2 || Hr(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Hr(r.contractAddress) + "." + r.contractName.content !== H6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || le(kt(r.functionArgs[0])) !== le(kt(Ls(t.song))) || typeof t.liked != "boolean" || le(kt(r.functionArgs[1])) !== le(kt(QA(t.liked))) || t.amount !== "0" || e.postConditionMode !== Zr.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || We(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const G6 = "xtrata.xyz/radio/listening-wallet", V6 = "Link a temporary listening wallet for pay-per-play; no spending permission", K6 = (t) => ({
  domain: gc({ name: _r(G6), version: _r("1"), "chain-id": so(1) }),
  message: gc({
    purpose: _r(V6),
    main: _r(t.main),
    listening: _r(t.listening),
    issued: so(t.issued)
  })
}), q6 = ["prepared", "signed", "unknown", "pending"], W6 = 30 * 6e4, bs = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, uh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function Y6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, l = !1, f = !1, u = !1, p = "", h = "", w, x = null, A, _ = [], U, y = -1 / 0;
  const L = /* @__PURE__ */ new Set();
  let E = !1, H = !1, j = !1, O = !1, P = 0, b = null, v = Promise.resolve();
  const T = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Nl.toString()), g = (I, F) => `xtrata.ppp.v1.${I}:${F}`, C = (I = i == null ? void 0 : i.address) => {
    if (!I) return [];
    try {
      const F = JSON.parse(t.store.get(g("entries", I)) || "[]");
      return Array.isArray(F) ? F : [];
    } catch {
      return [];
    }
  }, $ = (I) => {
    const F = [I, ...C(I.address).filter((K) => !(K.txid === I.txid && K.kind === I.kind))].slice(0, 200);
    t.store.set(g("entries", I.address), JSON.stringify(F));
  }, q = (I = i == null ? void 0 : i.address) => !!I && t.store.get(g("on", I)) !== "0", xt = (I) => {
    i != null && i.address && t.store.set(g("on", i.address), I ? "1" : "0");
  }, rt = () => C().filter((I) => q6.includes(I.status)), m = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(g("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, M = (I) => {
    i != null && i.address && t.store.set(g("deposit", i.address), JSON.stringify(I));
  }, lt = () => rt().filter((I) => t.now() - I.created > W6 && L.has(I.txid));
  function W() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const I = t.main();
    return I ? e.allowed ? i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : i.linked !== I ? "link" : o === void 0 ? "loading" : o > Bs ? "over" : o < co + Do(T()) ? "fund" : "ready" : "loading" : "not-invited" : "connect";
  }
  const at = () => {
    var I, F;
    return {
      step: W(),
      busy: c,
      message: p,
      error: h,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : M6(o, T()),
      playsLeft: o === void 0 ? 0 : B6(o, T()),
      allowance: o === void 0 ? Bs : lh(o, BigInt(((I = m()) == null ? void 0 : I.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: q(),
      entries: C(),
      depositTxid: ((F = m()) == null ? void 0 : F.txid) ?? w,
      depositPending: !!m(),
      linkedListening: U && U === t.main() ? _.map((K) => K.listening) : [],
      serverLinked: !!x && A === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: lt().length,
      armed: j
    };
  }, ht = (I, F = "") => {
    p = I, h = F, t.changed();
  };
  async function Y(I, F) {
    if (!c) {
      c = I, h = "", t.changed();
      try {
        await F();
      } catch (K) {
        const G = K instanceof Error ? K.message : String(K);
        h = /Cancelled in the listening wallet/.test(G) ? "" : G, h || (p = "Cancelled. Nothing was signed.", O = !0);
      } finally {
        c = null, await pe(!0);
      }
    }
  }
  async function St() {
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function Oe(I = !1) {
    i != null && i.address && (!I && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function us(I) {
    if ((U !== I || t.now() - y >= 6e4) && (_ = await t.links(I), U = I, y = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === I) return;
    const F = `${I}:${i.address}`;
    A === F && x || (x = _.find((K) => K.listening === i.address) ?? null, A = F);
  }
  async function fs() {
    const I = i == null ? void 0 : i.address;
    if (!I) return;
    let F;
    for (const G of rt())
      try {
        const dt = await t.chain.transaction(G.txid);
        if (!dt) {
          if (L.add(G.txid), t.now() - G.created > 15 * 6e4 && (F ?? (F = await t.chain.confirmedNonce(I))), F !== void 0 && F > BigInt(G.nonce)) {
            $({ ...G, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((G.status === "unknown" || G.status === "signed") && G.raw)
            try {
              await t.chain.broadcast(G.raw, G.txid), $({ ...G, status: "pending" });
            } catch (Ft) {
              bs(Ft) && $({ ...G, status: "failed", note: Ft.message, raw: void 0 });
            }
          continue;
        }
        L.delete(G.txid);
        const _t = String(dt.tx_status);
        _t === "success" && dt.canonical !== !1 && dt.is_unanchored === !1 ? ($({ ...G, status: "confirmed", confirmedAt: t.now(), actualFee: String(dt.fee_rate ?? G.fee), raw: void 0 }), G.kind === "like" && (u = !0)) : _t.startsWith("abort_") || _t.startsWith("dropped_") ? $({ ...G, status: "failed", note: _t, raw: void 0 }) : G.status !== "pending" && $({ ...G, status: "pending" });
      } catch {
      }
    const K = m();
    if (K)
      try {
        const G = await t.chain.transaction(K.txid), dt = String((G == null ? void 0 : G.tx_status) ?? "");
        (dt === "success" && G.is_unanchored === !1 || dt.startsWith("abort_") || dt.startsWith("dropped_") || !G && t.now() - K.at > 2 * 36e5) && (M(null), a = -1 / 0);
      } catch {
      }
  }
  async function pe(I = !1) {
    var F;
    try {
      const K = t.main();
      if ((I || !e || r !== K || t.now() - n > 3e5) && (e = await t.config(K), n = t.now(), r = K), !e.enabled || !e.here || !K || !e.allowed) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), j && en(), t.changed();
        return;
      }
      await St(), i = await s.request("listening.status"), await us(K), await Oe(I), await fs();
    } catch (K) {
      h = K instanceof Error ? K.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (W() === "locked" ? Ar() : j && en(), u) {
      u = !1;
      try {
        (F = t.likesChanged) == null || F.call(t);
      } catch {
      }
    }
    t.changed();
  }
  async function tn(I, F) {
    const K = !(i != null && i.address) || q(i.address);
    await I.request("listening.unlock", { mode: "unlock", terms: K ? je() : void 0, anyPasskey: F }), i = await I.request("listening.status"), K && (q(i.address) ? await X() : await I.request("listening.stop")), ht(K ? "Unlocked. Each song you listen to for 30 seconds pays its holder." : "Unlocked. Paying is switched off.");
  }
  function Ar() {
    j || c || O || P >= 3 || !s || !(i != null && i.address) || !q(i.address) || (j = !0, v = (async () => {
      try {
        await tn(s, !1), P = 0;
      } catch (I) {
        const F = I instanceof Error ? I.message : String(I);
        /Cancelled in the listening wallet/.test(F) ? b || (O = !0, ht("Cancelled. Nothing was signed.")) : /did not answer/.test(F) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (P++, h = F);
      } finally {
        j = !1;
        const I = b;
        b = null, I ? await I() : await pe(!0);
      }
    })());
  }
  async function en(I) {
    j && (b = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await v), I && await I(), t.changed();
  }
  const je = () => ({
    fee: T().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Bs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function X() {
    if (!(i != null && i.address)) return !1;
    if (H || (H = await t.tabLock(i.address)), !H)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const Mt = {
    forceRefresh: () => pe(!0),
    create: () => Y("Waiting for your passkey in the listening wallet…", async () => {
      const I = await St();
      await I.request("listening.unlock", { mode: "create", terms: je() }), i = await I.request("listening.status"), xt(!0), ht("Listening wallet created and paying is switched on. Next, link it to your main wallet."), await X();
    }),
    unlock: (I = !1) => {
      const F = () => Y("Waiting for your passkey in the listening wallet…", async () => tn(await St(), I));
      return j ? I ? en(async () => {
        (W() === "locked" || W() === "intro") && await F();
      }) : v : F();
    },
    link: () => Y("Waiting for your main wallet to sign…", async () => {
      const I = t.main();
      if (!I || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const F = (await t.links(I)).find((K) => K.listening === i.address);
      if (F)
        await s.request("listening.link", { main: I, issued: F.issued, mainSignature: F.mainSignature });
      else {
        const K = { main: I, listening: i.address, issued: t.now() }, G = await t.signWithMain(I, K6(K)), dt = await s.request("listening.link", { main: I, issued: K.issued, mainSignature: G });
        await t.saveLink({ ...K, mainSignature: G, listeningSignature: dt.listeningSignature }), y = -1 / 0;
      }
      ht("Linked. Returns from the listening wallet can only go to your main wallet.");
    }),
    deposit: () => Y("Waiting for your main wallet to approve the deposit…", async () => {
      const I = t.main();
      if (!I || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (m()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Oe(!0);
      const F = lh(o ?? 0n);
      if (F <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      w = await t.deposit(I, i.address, F), w && M({ txid: w, amount: F.toString(), at: t.now() }), ht("Deposit sent. It usually confirms within a few minutes; this page checks automatically.");
    }),
    switchOn: () => Y("Confirm in the listening wallet…", async () => {
      await X(), await s.request("listening.approveSession", je()), xt(!0), ht("Switched on. Each song you listen to for 30 seconds pays its holder until you switch it off or the wallet runs out.");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Y("Clearing…", async () => {
      for (const I of lt())
        await t.chain.transaction(I.txid) || $({ ...I, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ht("Cleared. If one of those still confirms later, it will simply show in your wallet history on the explorer.");
    }),
    switchOff: () => Y("Switching off…", async () => {
      await (s == null ? void 0 : s.request("listening.stop")), xt(!1), ht("Switched off. Music plays free until you switch it back on.");
    }),
    lock: () => Y("Locking…", async () => {
      await (s == null ? void 0 : s.request("listening.lock")), o = void 0, ht("Locked. The listening key has been forgotten.");
    }),
    returnFunds: (I) => Y("Review the return in the listening wallet…", async () => {
      if (!(i != null && i.address) || !i.linked) throw new Error("Link your main wallet first.");
      if (rt().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: F, nonce: K } = await t.chain.account(i.address);
      o = F;
      const G = await s.request("listening.prepareReturn", { mode: I, balance: F.toString(), nonce: K.toString(), fee: L6.toString() });
      if (G.recipient !== i.linked) throw new Error("Return destination does not match your linked main wallet. Nothing was sent.");
      const dt = Tl(G.raw);
      if (We(dt.payload.recipient).value !== i.linked || String(dt.payload.amount) !== G.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const _t = {
        id: uh(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: G.recipient,
        amount: G.amount,
        fee: G.fee,
        nonce: K.toString(),
        created: t.now(),
        status: "signed",
        raw: G.raw,
        txid: G.txid
      };
      t.validate(_t), $(_t);
      try {
        await t.chain.broadcast(G.raw, G.txid), $({ ..._t, status: "pending" });
      } catch (Ft) {
        throw $({ ..._t, status: "unknown", note: Ft.message }), Ft;
      }
      I === "all" && xt(!1), ht(I === "all" ? "Return sent to your main wallet. Paying is switched off; switch it back on after adding funds." : "Excess sent to your main wallet. Switch paying back on to continue.");
    })
  };
  async function Ae(I) {
    if (!(l || c || f)) {
      l = !0;
      try {
        if (await pe(), W() !== "ready" || !q() || !(i != null && i.session) || i.session.playsLeft < 1 || !H || rt().length) return;
        E || (await t.chain.verify(), E = !0);
        const K = i.address, { balance: G, nonce: dt } = await t.chain.account(K);
        o = G, a = t.now();
        const _t = await t.chain.owner(ma, I.song);
        if (_t === K || _t === t.main()) return;
        const Ft = await s.request("listening.signPlay", {
          core: ma,
          song: I.song,
          receipt: I.id,
          fee: T().toString(),
          nonce: dt.toString(),
          balance: G.toString()
        }), oe = {
          id: I.id,
          address: K,
          kind: "play",
          core: ma,
          song: I.song,
          recipient: _t,
          amount: "50",
          fee: T().toString(),
          nonce: dt.toString(),
          created: t.now(),
          status: "signed",
          raw: Ft.raw,
          txid: Ft.txid,
          // Display only: the radio's title and artist for this song, kept with the public history.
          ...I.title ? { title: String(I.title).slice(0, 120) } : {},
          ...I.artist ? { artist: String(I.artist).slice(0, 120) } : {}
        };
        t.validate(oe), $(oe);
        const Fe = I.title ? `“${I.title}”${I.artist ? ` by ${I.artist}` : ""}` : `song #${I.song}`;
        try {
          await t.chain.broadcast(Ft.raw, Ft.txid), $({ ...oe, status: "pending" }), p = `Paid play sent for ${Fe}.`, h = "";
        } catch (ae) {
          $({ ...oe, status: bs(ae) ? "failed" : "unknown", note: ae.message, ...bs(ae) ? { raw: void 0 } : {} }), h = ae.message;
        }
        i = await s.request("listening.status");
      } catch (F) {
        p = "This song played free: " + (F instanceof Error ? F.message : "payment unavailable");
      } finally {
        l = !1, t.changed();
      }
    }
  }
  function Oo(I) {
    const F = t.main();
    if (W() !== "ready" || !q() || !(i != null && i.session) || !H || !F || i.linked !== F) return !1;
    const K = I.likedBy ?? [];
    return I.liked ? K.length === 0 : K.includes(i.address) && !K.includes(F);
  }
  async function jo(I) {
    if (f) {
      ht("Still sending your last like. Try again in a moment.");
      return;
    }
    f = !0;
    const F = I.title ? `“${I.title}”${I.artist ? ` by ${I.artist}` : ""}` : `song #${I.song}`, K = t.wait ?? ((G) => new Promise((dt) => setTimeout(dt, G)));
    try {
      ht(`Sending your ${I.liked ? "like" : "unlike"} for ${F} from the listening wallet…`);
      const G = t.now() + 12e4;
      for (; l || rt().length; ) {
        if (t.now() > G) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await pe(!0);
      }
      if (W() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const dt = i.address, { balance: _t, nonce: Ft } = await t.chain.account(dt);
      o = _t, a = t.now();
      const oe = await s.request("listening.signLike", {
        song: I.song,
        liked: I.liked,
        fee: T().toString(),
        nonce: Ft.toString(),
        balance: _t.toString()
      }), Fe = {
        id: uh(),
        address: dt,
        kind: "like",
        core: 0,
        song: I.song,
        liked: I.liked,
        recipient: "",
        amount: "0",
        fee: T().toString(),
        nonce: Ft.toString(),
        created: t.now(),
        status: "signed",
        raw: oe.raw,
        txid: oe.txid,
        ...I.title ? { title: String(I.title).slice(0, 120) } : {},
        ...I.artist ? { artist: String(I.artist).slice(0, 120) } : {}
      };
      t.validate(Fe), $(Fe);
      try {
        await t.chain.broadcast(oe.raw, oe.txid), $({ ...Fe, status: "pending" }), p = `${I.liked ? "Liked" : "Unliked"} ${F} from your listening wallet, for your main wallet. The heart updates once it confirms.`, h = "";
      } catch (ae) {
        $({ ...Fe, status: bs(ae) ? "failed" : "unknown", note: ae.message, ...bs(ae) ? { raw: void 0 } : {} }), h = ae.message;
      }
      i = await s.request("listening.status");
    } catch (G) {
      h = "Like not sent: " + (G instanceof Error ? G.message : "the listening wallet is unavailable");
    } finally {
      f = !1, t.changed();
    }
  }
  return { snapshot: at, refresh: pe, onListened: Ae, canLike: Oo, like: jo, ...Mt };
}
const Ni = ["Radio address", "Connect wallet", "Access", "Passkey wallet", "Link", "Add funds", "Switch on", "First paid play"];
function X6(t) {
  const e = Ni.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Stage ${r + 1} of ${e} · ${s}` });
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
const Z6 = {}, Q6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, J6 = (t) => {
  const e = Z6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, t5 = (t) => `/hiro/${t}`, e5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, n5 = (t) => {
  const e = J6(t);
  if (e)
    return [e5(e)];
  const n = Q6[t];
  return typeof window < "u" ? [`${window.location.origin}${t5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, r5 = {}, fh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, s5 = "xtrata.log.enabled", i5 = "xtrata.log.level", o5 = "xtrata.log.tags", a5 = "xtrata.log.dedupe", Li = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, c5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, l5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, u5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, f5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, h5 = () => {
  const t = r5 ?? {}, e = Li(s5) ?? t.VITE_LOG_ENABLED, n = Li(i5) ?? t.VITE_LOG_LEVEL, r = Li(o5) ?? t.VITE_LOG_TAGS, s = Li(a5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: c5(e),
    level: l5(n) ?? "warn",
    tags: f5(r),
    dedupe: u5(s)
  };
}, d5 = (t, e, n) => !t.enabled || fh[n] < fh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), p5 = (t, e, n, r) => {
  const s = h5();
  if (!d5(s, e, t) || y5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, g5 = /* @__PURE__ */ new Set();
let hh = null;
const y5 = (t, e, n, r, s) => (hh !== t && (g5.clear(), hh = t), !1), w5 = (t, e, n) => p5("debug", t, e, n), b5 = {}, x5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, m5 = (t) => {
  const e = b5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : x5[t];
}, S5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, E5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return S5.test(n) ? n : null;
}, A5 = (t) => t.replace(/\/+$/, ""), $5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), dh = (t) => {
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
}, Mr = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, I5 = (t) => {
  var c, l;
  let e;
  try {
    e = We(TA(t));
  } catch {
    return null;
  }
  const n = Mr(e);
  if (!n || n.success === !1)
    return null;
  const r = Mr(n.value), s = Mr(r == null ? void 0 : r.value), i = Mr(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = dh((c = Mr(i.name)) == null ? void 0 : c.value), a = dh((l = Mr(i.namespace)) == null ? void 0 : l.value);
  return !o || !a ? null : E5(`${o}.${a}`);
}, v5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${A5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [vp(lp(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : I5(i.result);
}, L5 = async (t) => {
  const e = t.address.trim();
  if (!vs(e))
    return null;
  const n = m5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of n5(t.network))
    try {
      return await v5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return w5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: $5(r)
  }), null;
}, ph = Object.freeze({
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
function C5(t, e = "") {
  return Object.hasOwn(ph, String(t)) ? ph[String(t)] : e;
}
const gh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function B5(t, e = "") {
  return Object.hasOwn(gh, String(t)) ? gh[String(t)] : e;
}
const yh = document.getElementById("ppp");
yh && M5(yh);
function M5(t) {
  const e = $y(), n = (g) => t.querySelector(g), r = n(".ppp-frame");
  let s = null;
  const i = async (g, C) => {
    const $ = await fetch(g, { cache: "no-store", ...C, signal: AbortSignal.timeout(15e3) }), q = await $.json().catch(() => ({}));
    if (!$.ok) throw new Error((q == null ? void 0 : q.error) || `Request failed (${$.status}).`);
    return q;
  }, o = Y6({
    now: Date.now,
    main: () => {
      const g = e.load();
      return g.isConnected && g.network === "mainnet" ? g.address : void 0;
    },
    config: (g) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(g || "")),
    links: async (g) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(g))).links ?? [],
    saveLink: async (g) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(g) });
    },
    bridge: async (g) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${g}; publickey-credentials-create ${g}`), s.referrerPolicy = "no-referrer";
      const C = new Promise((rt, m) => {
        s.addEventListener("load", () => rt(), { once: !0 }), setTimeout(() => m(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = g + "/", r.replaceChildren(s), await C;
      const $ = new gy({ walletOrigin: g, frame: s, timeoutMs: 30 * 6e4 }), q = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), xt = (rt, m) => q.has(rt) ? $.request(rt, m) : Promise.race([
        $.request(rt, m),
        new Promise((M, lt) => setTimeout(() => lt(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await xt("listening.status"), { request: xt };
    },
    chain: {
      verify: P6,
      balance: O6,
      account: D6,
      owner: j6,
      broadcast: F6,
      transaction: z6,
      confirmedNonce: async (g) => {
        const C = await ns(`/v2/accounts/${g}?proof=0`);
        if (!Number.isSafeInteger(C == null ? void 0 : C.nonce) || C.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(C.nonce);
      }
    },
    signWithMain: (g, C) => v6({ ...C, network: "mainnet", stxAddress: g }),
    deposit: (g, C, $) => new Promise((q, xt) => S6({
      recipient: C,
      amount: $.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: g,
      network: new bh(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (rt) => q(rt.txId || ""),
      onCancel: () => xt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: xt
    })),
    validate: R6,
    tabLock: (g) => new Promise((C) => {
      const $ = navigator.locks;
      if (!($ != null && $.request)) {
        C(!0);
        return;
      }
      $.request("xtrata-ppp:" + g, { ifAvailable: !0 }, async (q) => {
        C(!!q), q && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (g) => {
        try {
          return localStorage.getItem(g);
        } catch {
          return null;
        }
      },
      set: (g, C) => {
        try {
          localStorage.setItem(g, C);
        } catch {
        }
      }
    },
    changed: () => b(o.snapshot()),
    likesChanged: () => {
      var g, C;
      (C = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || C.call(g);
    }
  });
  window.XtrataRadioLikeHandler = (g) => {
    if (!g || !Number.isSafeInteger(g.song) || g.song < 0 || typeof g.liked != "boolean" || !o.canLike({ liked: g.liked, likedBy: Array.isArray(g.likedBy) ? g.likedBy : [] })) return !1;
    const C = L(g.song, { title: g.title, artist: g.artist });
    return o.like({ song: g.song, liked: g.liked, title: C.title || void 0, artist: C.artist || void 0 }), !0;
  };
  const a = (g) => g ? g.slice(0, 6) + "…" + g.slice(-4) : "", c = (g) => `https://explorer.hiro.so/txid/${g}?chain=mainnet`, l = (g, C = "", $ = "") => {
    const q = document.createElement(g);
    return C && (q.textContent = C), $ && (q.className = $), q;
  }, f = (g, C, $ = "") => {
    const q = l("button", g, $);
    return q.type = "button", q.onclick = C, q;
  }, u = (g, C) => {
    const $ = l("a", g);
    return $.href = C, $.target = "_blank", $.rel = "noopener", $;
  };
  let p = null;
  const h = /* @__PURE__ */ new Map(), w = (g) => g ? (h.has(g) || (h.set(g, null), L5({ address: g, network: "mainnet" }).then((C) => {
    C && (h.set(g, C), b(o.snapshot()));
  }).catch(() => {
  })), h.get(g) ?? null) : null, x = (g) => {
    const C = w(g);
    return C ? `${C} · ${a(g)}` : a(g);
  }, A = /* @__PURE__ */ new Map();
  let _ = !1;
  const U = (g) => !g || /^(?:Inscription )?#\d+$/.test(g.trim()), y = () => {
    _ || (_ = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((g) => g.ok ? g.json() : null).then((g) => {
      for (const C of Array.isArray(g == null ? void 0 : g.tracks) ? g.tracks : []) {
        const $ = Number(C == null ? void 0 : C.id);
        Number.isSafeInteger($) && A.set($, { title: typeof C.title == "string" ? C.title : void 0, artist: typeof C.artist == "string" ? C.artist : void 0 });
      }
      b(o.snapshot());
    }).catch(() => {
      _ = !1;
    }));
  }, L = (g, C) => {
    const $ = A.get(g), q = B5(g, [$ == null ? void 0 : $.title, C == null ? void 0 : C.title].find((rt) => !U(rt)) || ""), xt = C5(g, ($ == null ? void 0 : $.artist) || (C == null ? void 0 : C.artist) || "");
    return { title: q, artist: xt };
  }, E = (g) => {
    const { title: C, artist: $ } = L(g.song, g);
    return C ? `“${C}”${$ ? ` — ${$}` : ""}` : `Song #${g.song}${$ ? ` — ${$}` : ""}`;
  }, H = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, j = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function O(g) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(g.step) ? ["", ""] : g.step === "over" ? ["OVER 1 STX", "bad"] : g.step === "locked" ? ["LOCKED", "mute"] : g.step === "intro" || g.step === "link" ? ["", ""] : g.step === "fund" ? g.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : g.payingOn && g.session && g.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function P(g, C, $ = "", q) {
    const xt = l("dt", g), rt = l("dd", C, $);
    return q && rt.append(" ", q), [xt, rt];
  }
  function b(g) {
    var tn, Ar, en, je;
    if (t.hidden = g.step === "off", t.hidden) return;
    const [C, $] = O(g), q = n(".ppp-state");
    q.textContent = C, q.className = "ppp-state" + ($ ? " ppp-state--" + $ : ""), q.hidden = !C;
    const xt = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(g.step);
    r.hidden = !xt, n(".ppp-frame-label").hidden = !xt, r.classList.toggle("ppp-frame--active", !!g.busy), t.classList.toggle("ppp--armed", g.armed);
    const rt = X6(g) ?? p;
    p = rt, n(".ppp-badge").hidden = !rt || rt.at >= Ni.length;
    const m = n(".ppp-steps"), M = n(".ppp-stage");
    m.hidden = M.hidden = !rt, rt && (m.replaceChildren(...Ni.map((X, Mt) => {
      const Ae = l("li", "", Mt < rt.at ? "done" : Mt === rt.at ? rt.blocked ? "now blocked" : "now" : "");
      return Ae.append(l("span", Mt < rt.at ? "✓" : String(Mt + 1), "n"), X), Mt === rt.at && Ae.setAttribute("aria-current", "step"), Ae;
    })), M.textContent = rt.caption, M.className = "ppp-stage " + (rt.at >= Ni.length ? "ppp-ok" : rt.blocked ? "ppp-bad" : "ppp-cyan"));
    const lt = n(".ppp-facts"), W = [];
    if (g.main && ((tn = g.gate) != null && tn.here) && W.push(...P("Your wallet", x(g.main), "ppp-addr-short")), g.listening) {
      const X = f("Copy", () => {
        var Mt;
        return void ((Mt = navigator.clipboard) == null ? void 0 : Mt.writeText(g.listening || ""));
      }, "tiny");
      W.push(...P("Listening wallet", a(g.listening), "ppp-addr-short", X));
    }
    if (g.listening && g.step !== "intro" && W.push(...g.linked ? P("Linked to", `${x(g.linked)} · returns go here`, g.linked === g.main ? "ppp-ok" : "ppp-warn") : P("Linked to", "not linked yet", "ppp-warn")), g.linkedListening.length && ((Ar = g.gate) != null && Ar.here)) {
      const X = g.linkedListening.map((Mt) => a(Mt) + (Mt === g.listening ? " (this one)" : "")).join(", ");
      W.push(...P(g.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", X, "ppp-addr-short"));
    }
    if (g.balance !== void 0 && ["fund", "ready", "over"].includes(g.step)) {
      const X = g.balanceState === "ok" ? "ppp-ok" : g.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      W.push(...P("Balance", `${vn(g.balance)} STX · about ${g.playsLeft.toLocaleString()} plays`, X));
    }
    const at = g.entries.find((X) => X.kind === "play");
    at && y(), at && W.push(...P("Last paid song", `${E(at)} → ${a(at.recipient)}`, H[at.status] || "")), lt.replaceChildren(...W), lt.hidden = !W.length;
    const ht = n(".ppp-body"), Y = [], St = [], Oe = Do(BigInt(((en = g.gate) == null ? void 0 : en.limits.playFee) ?? "300")), us = `Each song you listen to for 30 seconds sends ${vn(Ac)} STX to whoever holds it, plus a ${vn(Oe - Ac)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, fs = !!g.busy;
    switch (g.step) {
      case "elsewhere": {
        if (Y.push(l("p", "Pay artists a tiny amount for each song you listen to for 30 seconds, recorded on-chain. Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet.")), (je = g.gate) != null && je.radioUrl) {
          const X = l("p");
          X.append(u("Open the pay-per-play radio →", g.gate.radioUrl)), Y.push(X);
        }
        break;
      }
      case "connect":
        Y.push(l("p", "Pay artists a tiny amount for each song you listen to for 30 seconds, recorded on-chain. Connect your wallet above to turn it on. Listening is always free."));
        break;
      case "not-invited":
        Y.push(l("p", "Pay-per-play is in a small test right now. Listening is free for everyone, and it will open up soon.", "ppp-mute"));
        break;
      case "unsupported":
        Y.push(l("p", "This browser cannot create the passkey pay-per-play needs. Listening is free. Try Chrome or Safari on a current phone or computer.", "ppp-warn"));
        break;
      case "intro":
        Y.push(l("p", us)), Y.push(l("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Y.push(l("p", "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), St.push(f("Turn on pay-per-play", () => void o.create(), "primary")), St.push(f("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        g.armed ? Y.push(l("p", "Tap “Unlock and keep paying” in the listening wallet box. It goes straight to your passkey.", "ppp-cyan")) : (Y.push(l("p", g.payingOn ? "Unlock it with your passkey to keep paying as you listen." : "Paying is switched off. Unlock to manage your wallet.", g.payingOn ? "" : "ppp-mute")), St.push(f(g.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), St.push(f("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        Y.push(l("p", g.serverLinked ? `This listening wallet was linked to ${x(g.main)} on another device. Confirm it in the listening wallet below.` : `Link the listening wallet to your main wallet ${x(g.main)}. This is one signature, not a transaction: no fee, no spending permission. Afterwards, returns can only go back to this main wallet.`)), Y.push(l("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), St.push(f(g.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        Y.push(l("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (g.entries.length ? Y.push(l("p", "Out of funds: songs play free until you top up. Paying carries on automatically once the top-up confirms.", "ppp-bad")) : g.payingOn && Y.push(l("p", "Paying is switched on. Add funds and it starts with the next song you listen to for 30 seconds.", "ppp-ok")), Y.push(l("p", `Add up to ${vn(g.allowance)} STX. 1 STX covers about ${Math.floor(Number(1000000n / Oe)).toLocaleString()} paid plays.`)), Y.push(l("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), g.depositPending && g.depositTxid) {
          const X = l("p", "Deposit sent, waiting for it to confirm. This page checks automatically. ", "ppp-warn");
          X.append(u("View", c(g.depositTxid))), Y.push(X);
        } else g.allowance > 0n && St.push(f(`Deposit ${vn(g.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        Y.push(l("p", `This wallet holds more than the recommended 1 STX, so paid plays are paused. Return the excess or everything to your main wallet ${a(g.linked)}.`, "ppp-bad")), St.push(f("Return excess", () => void o.returnFunds("excess"), "primary"), f("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (g.payingOn && g.session && g.session.playsLeft > 0) {
          const X = Math.min(g.session.playsLeft, g.playsLeft);
          Y.push(l("p", `Paying as you listen · up to ${X.toLocaleString()} more plays remaining`, "ppp-ok")), Y.push(l("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free.", "ppp-mute")), St.push(f("Switch off", () => void o.switchOff()));
        } else
          Y.push(l("p", "Paying is switched off. Music plays free.", "ppp-mute")), St.push(f("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        g.balanceState === "low" && Y.push(l("p", "Running low. Top up to keep paying artists.", "ppp-warn")), g.depositPending ? Y.push(l("p", "Top-up sent, waiting for it to confirm.", "ppp-warn")) : g.allowance > 0n && g.balanceState !== "ok" && St.push(f(`Top up ${vn(g.allowance)} STX`, () => void o.deposit()));
        break;
    }
    g.stuck && (Y.push(l("p", g.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${g.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), St.push(f("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(g.step) && g.linked && (g.balance ?? 0n) > 0n && St.push(f("Return all to my wallet", () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(g.step) && St.push(f("Lock", () => void o.lock(), "quiet")), St.forEach((X) => X.disabled = fs), ht.replaceChildren(...Y), n(".ppp-actions").replaceChildren(...St), n(".ppp-msg").textContent = g.busy || g.message, n(".ppp-err").textContent = g.error;
    const pe = n(".ppp-history");
    pe.hidden = !g.entries.length, g.entries.length && y(), pe.replaceChildren(l("summary", `Payments, likes and returns (${g.entries.length})`), ...g.entries.slice(0, 20).map((X) => {
      const Mt = l("div", "", "ppp-row"), Ae = X.kind === "play" ? [l("span", E(X), "ppp-song"), l("span", ` · ${vn(BigInt(X.amount))} STX to ${a(X.recipient)}`, "ppp-mute")] : X.kind === "like" ? [l("span", `${X.liked ? "♥ Liked" : "Unliked"} ${E(X)}`, "ppp-song"), l("span", ` · for ${x(g.linked)}`, "ppp-mute")] : [l("span", `Returned ${vn(BigInt(X.amount))} STX`, "ppp-song"), l("span", ` to ${a(X.recipient)}`, "ppp-mute")];
      return Mt.append(
        l("span", j[X.status] || X.status, "ppp-status " + (H[X.status] || "")),
        ...Ae,
        l("span", ` · ${new Date(X.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), X.txid && Mt.append(u("tx ↗", c(X.txid))), Mt;
    }));
  }
  const v = /* @__PURE__ */ new Map(), T = () => {
    const g = window.XtrataRadio;
    return g != null && g.subscribe ? (g.subscribe((C) => {
      const $ = C == null ? void 0 : C.nowPlaying;
      $ && Number.isSafeInteger(Number($.tokenId)) && v.set(Number($.tokenId), { title: $.title || void 0, artist: $.artist || void 0 });
    }), !0) : !1;
  };
  if (!T()) {
    const g = setInterval(() => {
      T() && clearInterval(g);
    }, 500);
    setTimeout(() => clearInterval(g), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (g) => {
    const C = g.detail;
    if (C && Number.isSafeInteger(C.song) && typeof C.id == "string" && /^[0-9a-f]{32}$/.test(C.id)) {
      y();
      const $ = L(C.song, v.get(C.song));
      o.onListened({ song: C.song, id: C.id, title: $.title || void 0, artist: $.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const _5 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", k5 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, U5 = () => k5() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, T5 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, H5 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Vp = class {
  constructor(t) {
    Y4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && gx(t), this.callback(Ao(t));
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
    var r, s, i, o, a, c, l, f, u, p;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (l = t.googlePlayStoreUrl) !== null && l !== void 0 ? l : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (p = (u = this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl) !== null && p !== void 0 ? p : this.getMobileUrl(t);
  }
  render() {
    const t = U5(), e = T5(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Z("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Z("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Z("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Z("div", { class: "flex flex-col space-y-[10px]" }, Z("div", { class: "flex items-center" }, Z("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Z("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Z("span", { class: "sr-only" }, "Close popup"), Z("img", { src: _5 }))), r ? Z("p", null, "Select the wallet you want to connect to.") : Z("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Z("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Z("div", { class: "mt-6" }, Z("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Z("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Z("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Z("div", { class: "aspect-square basis-9 overflow-hidden" }, Z("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Z("div", { class: "flex-1" }, Z("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Z("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Z("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Z("div", { class: "mt-6" }, r ? Z("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Z("div", { class: "mb-5 flex justify-between" }, Z("p", { class: "text-sm font-medium" }, "Recommended wallets"), Z("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Z("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Z("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Z("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Z("p", null, "What is a wallet? ", Z("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Z("ul", { class: "space-y-3" }, n.map((i) => Z("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Z("div", { class: "aspect-square basis-9 overflow-hidden" }, Z("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Z("div", { class: "flex-1" }, Z("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Z("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Z("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return M4(this);
  }
};
Vp.style = H5;
const N5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Vp
}, Symbol.toStringTag, { value: "Module" }));
