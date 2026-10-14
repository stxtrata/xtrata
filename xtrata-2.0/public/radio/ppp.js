var Dy = Object.defineProperty;
var Fy = (t, e, n) => e in t ? Dy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var bi = (t, e, n) => Fy(t, typeof e != "symbol" ? e + "" : e, n);
var Ie = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Bh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function ha(t) {
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
      typeof Ie < "u" && Ie || {}, r = {
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
      function s(x) {
        return x && DataView.prototype.isPrototypeOf(x);
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
        ], o = ArrayBuffer.isView || function(x) {
          return x && i.indexOf(Object.prototype.toString.call(x)) > -1;
        };
      function a(x) {
        if (typeof x != "string" && (x = String(x)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(x) || x === "")
          throw new TypeError('Invalid character in header field name: "' + x + '"');
        return x.toLowerCase();
      }
      function c(x) {
        return typeof x != "string" && (x = String(x)), x;
      }
      function f(x) {
        var $ = {
          next: function() {
            var O = x.shift();
            return { done: O === void 0, value: O };
          }
        };
        return r.iterable && ($[Symbol.iterator] = function() {
          return $;
        }), $;
      }
      function d(x) {
        this.map = {}, x instanceof d ? x.forEach(function($, O) {
          this.append(O, $);
        }, this) : Array.isArray(x) ? x.forEach(function($) {
          if ($.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + $.length);
          this.append($[0], $[1]);
        }, this) : x && Object.getOwnPropertyNames(x).forEach(function($) {
          this.append($, x[$]);
        }, this);
      }
      d.prototype.append = function(x, $) {
        x = a(x), $ = c($);
        var O = this.map[x];
        this.map[x] = O ? O + ", " + $ : $;
      }, d.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, d.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, d.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, d.prototype.set = function(x, $) {
        this.map[a(x)] = c($);
      }, d.prototype.forEach = function(x, $) {
        for (var O in this.map)
          this.map.hasOwnProperty(O) && x.call($, this.map[O], O, this);
      }, d.prototype.keys = function() {
        var x = [];
        return this.forEach(function($, O) {
          x.push(O);
        }), f(x);
      }, d.prototype.values = function() {
        var x = [];
        return this.forEach(function($) {
          x.push($);
        }), f(x);
      }, d.prototype.entries = function() {
        var x = [];
        return this.forEach(function($, O) {
          x.push([O, $]);
        }), f(x);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(x) {
        if (!x._noBody) {
          if (x.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          x.bodyUsed = !0;
        }
      }
      function g(x) {
        return new Promise(function($, O) {
          x.onload = function() {
            $(x.result);
          }, x.onerror = function() {
            O(x.error);
          };
        });
      }
      function h(x) {
        var $ = new FileReader(), O = g($);
        return $.readAsArrayBuffer(x), O;
      }
      function b(x) {
        var $ = new FileReader(), O = g($), X = /charset=([A-Za-z0-9_-]+)/.exec(x.type), st = X ? X[1] : "utf-8";
        return $.readAsText(x, st), O;
      }
      function m(x) {
        for (var $ = new Uint8Array(x), O = new Array($.length), X = 0; X < $.length; X++)
          O[X] = String.fromCharCode($[X]);
        return O.join("");
      }
      function L(x) {
        if (x.slice)
          return x.slice(0);
        var $ = new Uint8Array(x.byteLength);
        return $.set(new Uint8Array(x)), $.buffer;
      }
      function S() {
        return this.bodyUsed = !1, this._initBody = function(x) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = x, x ? typeof x == "string" ? this._bodyText = x : r.blob && Blob.prototype.isPrototypeOf(x) ? this._bodyBlob = x : r.formData && FormData.prototype.isPrototypeOf(x) ? this._bodyFormData = x : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) ? this._bodyText = x.toString() : r.arrayBuffer && r.blob && s(x) ? (this._bodyArrayBuffer = L(x.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(x) || o(x)) ? this._bodyArrayBuffer = L(x) : this._bodyText = x = Object.prototype.toString.call(x) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof x == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var x = l(this);
            return x || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return b(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(m(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(I);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var T = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function w(x) {
        var $ = x.toUpperCase();
        return T.indexOf($) > -1 ? $ : x;
      }
      function B(x, $) {
        if (!(this instanceof B))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        $ = $ || {};
        var O = $.body;
        if (x instanceof B) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, $.headers || (this.headers = new d(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !O && x._bodyInit != null && (O = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = $.credentials || this.credentials || "same-origin", ($.headers || !this.headers) && (this.headers = new d($.headers)), this.method = w($.method || this.method || "GET"), this.mode = $.mode || this.mode || null, this.signal = $.signal || this.signal || function() {
          if ("AbortController" in n) {
            var z = new AbortController();
            return z.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && O)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(O), (this.method === "GET" || this.method === "HEAD") && ($.cache === "no-store" || $.cache === "no-cache")) {
          var X = /([?&])_=[^&]*/;
          if (X.test(this.url))
            this.url = this.url.replace(X, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var st = /\?/;
            this.url += (st.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      B.prototype.clone = function() {
        return new B(this, { body: this._bodyInit });
      };
      function I(x) {
        var $ = new FormData();
        return x.trim().split("&").forEach(function(O) {
          if (O) {
            var X = O.split("="), st = X.shift().replace(/\+/g, " "), z = X.join("=").replace(/\+/g, " ");
            $.append(decodeURIComponent(st), decodeURIComponent(z));
          }
        }), $;
      }
      function H(x) {
        var $ = new d(), O = x.replace(/\r?\n[\t ]+/g, " ");
        return O.split("\r").map(function(X) {
          return X.indexOf(`
`) === 0 ? X.substr(1, X.length) : X;
        }).forEach(function(X) {
          var st = X.split(":"), z = st.shift().trim();
          if (z) {
            var Nt = st.join(":").trim();
            try {
              $.append(z, Nt);
            } catch (ae) {
              console.warn("Response " + ae.message);
            }
          }
        }), $;
      }
      S.call(B.prototype);
      function Z(x, $) {
        if (!(this instanceof Z))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if ($ || ($ = {}), this.type = "default", this.status = $.status === void 0 ? 200 : $.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = $.statusText === void 0 ? "" : "" + $.statusText, this.headers = new d($.headers), this.url = $.url || "", this._initBody(x);
      }
      S.call(Z.prototype), Z.prototype.clone = function() {
        return new Z(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, Z.error = function() {
        var x = new Z(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var F = [301, 302, 303, 307, 308];
      Z.redirect = function(x, $) {
        if (F.indexOf($) === -1)
          throw new RangeError("Invalid status code");
        return new Z(null, { status: $, headers: { location: x } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function($, O) {
          this.message = $, this.name = O;
          var X = Error($);
          this.stack = X.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function q(x, $) {
        return new Promise(function(O, X) {
          var st = new B(x, $);
          if (st.signal && st.signal.aborted)
            return X(new e.DOMException("Aborted", "AbortError"));
          var z = new XMLHttpRequest();
          function Nt() {
            z.abort();
          }
          z.onload = function() {
            var A = {
              statusText: z.statusText,
              headers: H(z.getAllResponseHeaders() || "")
            };
            st.url.indexOf("file://") === 0 && (z.status < 200 || z.status > 599) ? A.status = 200 : A.status = z.status, A.url = "responseURL" in z ? z.responseURL : A.headers.get("X-Request-URL");
            var N = "response" in z ? z.response : z.responseText;
            setTimeout(function() {
              O(new Z(N, A));
            }, 0);
          }, z.onerror = function() {
            setTimeout(function() {
              X(new TypeError("Network request failed"));
            }, 0);
          }, z.ontimeout = function() {
            setTimeout(function() {
              X(new TypeError("Network request timed out"));
            }, 0);
          }, z.onabort = function() {
            setTimeout(function() {
              X(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ae(A) {
            try {
              return A === "" && n.location.href ? n.location.href : A;
            } catch {
              return A;
            }
          }
          if (z.open(st.method, ae(st.url), !0), st.credentials === "include" ? z.withCredentials = !0 : st.credentials === "omit" && (z.withCredentials = !1), "responseType" in z && (r.blob ? z.responseType = "blob" : r.arrayBuffer && (z.responseType = "arraybuffer")), $ && typeof $.headers == "object" && !($.headers instanceof d || n.Headers && $.headers instanceof n.Headers)) {
            var ne = [];
            Object.getOwnPropertyNames($.headers).forEach(function(A) {
              ne.push(a(A)), z.setRequestHeader(A, c($.headers[A]));
            }), st.headers.forEach(function(A, N) {
              ne.indexOf(N) === -1 && z.setRequestHeader(N, A);
            });
          } else
            st.headers.forEach(function(A, N) {
              z.setRequestHeader(N, A);
            });
          st.signal && (st.signal.addEventListener("abort", Nt), z.onreadystatechange = function() {
            z.readyState === 4 && st.signal.removeEventListener("abort", Nt);
          }), z.send(typeof st._bodyInit > "u" ? null : st._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = d, n.Request = B, n.Response = Z), e.Headers = d, e.Request = B, e.Response = Z, e.fetch = q, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Ie);
})();
const jy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function zy(t, e) {
  const n = {};
  return Object.assign(n, jy, e), await fetch(t, n);
}
function Ry(t) {
  let e = zy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Gy(...t) {
  const { fetchLib: e, middlewares: n } = Ry(t);
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
var Ks;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ks || (Ks = {}));
var Qr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Qr || (Qr = {}));
var qu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(qu || (qu = {}));
const Ky = "https://api.mainnet.hiro.so", Vy = "https://api.testnet.hiro.so", Wy = "http://localhost:3999", qy = ["mainnet", "testnet", "devnet", "mocknet"];
let Vs = class {
  constructor(e) {
    this.version = Qr.Mainnet, this.chainId = Ks.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Qr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Gy();
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
Vs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Ec();
    case "testnet":
      return new Xy();
    case "devnet":
      return new Yy();
    case "mocknet":
      return new Th();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${qy.join(", ")}`);
  }
};
Vs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Vs.fromName(t);
let Ec = class extends Vs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ky,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Qr.Mainnet, this.chainId = Ks.Mainnet;
  }
}, Xy = class extends Vs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Vy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Qr.Testnet, this.chainId = Ks.Testnet;
  }
}, Th = class extends Vs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Wy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Qr.Testnet, this.chainId = Ks.Testnet;
  }
};
const Yy = Th, Mh = "xtrata.wallet.bridge.v1", Zy = (t) => typeof t == "object" && t !== null && t.protocol === Mh, Qy = (t) => Zy(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Jy = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class mi extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Xu = 12e4;
class tw {
  constructor(e) {
    bi(this, "pending", /* @__PURE__ */ new Map());
    bi(this, "listenTarget");
    bi(this, "closed", !1);
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
    bi(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Qy(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new mi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new mi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new mi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Jy(), i = { protocol: Mh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new mi(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Xu}ms.`
          )
        );
      }, this.options.timeoutMs ?? Xu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new mi("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const ew = ["SP", "SM"], nw = ["ST", "SN"], rw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return ew.includes(n) ? "mainnet" : nw.includes(n) ? "testnet" : null;
}, sw = () => {
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
}, iw = () => typeof window > "u" || !window.localStorage ? sw() : window.localStorage, Xa = "xtrata.v15.1.wallet.session", Yu = "mainnet", zo = { isConnected: !1 }, ow = (t) => t.address ? rw(t.address) ?? t.network : t.network, _h = (t) => !t.isConnected || !t.address ? { ...zo } : ow(t) !== Yu ? { ...zo } : {
  isConnected: !0,
  address: t.address,
  network: Yu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, aw = (t) => {
  if (!t)
    return { ...zo };
  try {
    const e = JSON.parse(t);
    return _h(e);
  } catch {
    return { ...zo };
  }
}, cw = (t) => {
  const e = _h(t);
  return JSON.stringify(e);
}, lw = (t) => {
  const e = iw();
  return {
    load: () => aw(e.getItem(Xa)),
    save: (n) => {
      e.setItem(Xa, cw(n));
    },
    clear: () => {
      e.removeItem(Xa);
    }
  };
}, uw = "https://browser.blockstack.org/auth", fw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Nh = ["store_write"], dw = "blockstack-session", hw = {
  logLevel: "debug"
}, ws = {
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
Object.freeze(ws);
class li extends Error {
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
class pw extends li {
  constructor(e, n = "") {
    super({ code: ws.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Zu extends li {
  constructor(e = "") {
    super({ code: ws.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ro extends li {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: ws.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Qu extends li {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: ws.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ac extends li {
  constructor(e) {
    super({ code: ws.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Uh extends li {
  constructor(e) {
    super({ code: ws.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Ju = ["debug", "info", "warn", "error", "none"], $c = {};
for (let t = 0; t < Ju.length; t++) {
  const e = Ju[t];
  $c[e] = t;
}
class Hs {
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
    return $c[hw.logLevel] <= $c[e];
  }
}
function gw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function yw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Ya(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function ww() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function bw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function mw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Ll(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = bw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Hs.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = mw(s, t.toString(), n);
    throw Hs.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Br(t, e) {
  return Cl(xe(t), e);
}
function xe(t) {
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
  if (Ue(t, Uint8Array))
    return BigInt(`0x${nt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function xw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function tf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Gi(t, e = 8) {
  return (typeof t == "bigint" ? t : xe(t)).toString(16).padStart(e * 2, "0");
}
function pa(t) {
  return parseInt(t, 16);
}
function Cl(t, e = 16) {
  const n = Gi(t, e);
  return Ct(n);
}
function Sw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Ew(t, e) {
  return t & BigInt(1) << e;
}
function vc(t) {
  return Aw(BigInt(`0x${nt(t)}`), BigInt(t.byteLength * 8));
}
function Aw(t, e) {
  return Ew(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const $w = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += $w[n];
  return e;
}
function Ct(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = xw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function bs(t) {
  return new TextEncoder().encode(t);
}
function Ki(t) {
  return new TextDecoder().decode(t);
}
function vw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Iw(t) {
  return String.fromCharCode.apply(null, t);
}
function kw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ef(t) {
  if (t.some(kw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ln(...t) {
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
function se(t) {
  return Ln(...t.map((e) => typeof e == "number" ? ef([e]) : e instanceof Array ? ef(e) : e));
}
function Ue(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Ph = "https://api.mainnet.hiro.so", Hh = "https://api.testnet.hiro.so", Oh = "http://localhost:3999", Lw = "https://hub.blockstack.org", Cw = 33, Za = 32;
function Bw(t) {
  if (t.length < Za * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Za * 2), r = t.slice(2 + Za * 2);
  return {
    recoveryId: pa(e),
    r: n,
    s: r
  };
}
function Bl(t) {
  const e = typeof t == "string" ? Ct(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Tw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Mw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function _w(t, e) {
  return t[e];
}
function Nw(t, e, n = 0) {
  return t[n] = e, t;
}
function Uw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Jr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Pw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Hw(t, e) {
  const n = {};
  return Object.assign(n, Pw, e), await fetch(t, n);
}
function Ow(t) {
  let e = Hw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Dw(...t) {
  const { fetchLib: e, middlewares: n } = Ow(t);
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
class Dh {
  constructor(e = Nh.slice(), n = ((a) => (a = Ll("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = uw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Ic(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Fw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Fh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function jw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ic(t.outputLen), Ic(t.blockLen);
}
function zw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Rw(t, e) {
  Fh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Rr = {
  number: Ic,
  bool: Fw,
  bytes: Fh,
  hash: jw,
  exists: zw,
  output: Rw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Qa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), yn = (t, e) => t << 32 - e | t >>> e, Gw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Gw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Kw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Tl(t) {
  if (typeof t == "string" && (t = Kw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let jh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ms(t) {
  const e = (r) => t().update(Tl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let zh = class extends jh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Rr.hash(e);
    const r = Tl(n);
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
    return Rr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Rr.exists(this), Rr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ga = (t, e, n) => new zh(t, e).update(n).digest();
ga.create = (t, e) => new zh(t, e);
function Vw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Ml = class extends jh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Qa(this.buffer);
  }
  update(e) {
    Rr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Tl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Qa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Rr.exists(this), Rr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Vw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Qa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const Ww = (t, e, n) => t & e ^ ~t & n, qw = (t, e, n) => t & e ^ t & n ^ e & n, Xw = new Uint32Array([
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
]), Jn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), tr = new Uint32Array(64);
let Rh = class extends Ml {
  constructor() {
    super(64, 32, 8, !1), this.A = Jn[0] | 0, this.B = Jn[1] | 0, this.C = Jn[2] | 0, this.D = Jn[3] | 0, this.E = Jn[4] | 0, this.F = Jn[5] | 0, this.G = Jn[6] | 0, this.H = Jn[7] | 0;
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
      tr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = tr[l - 15], h = tr[l - 2], b = yn(g, 7) ^ yn(g, 18) ^ g >>> 3, m = yn(h, 17) ^ yn(h, 19) ^ h >>> 10;
      tr[l] = m + tr[l - 7] + b + tr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = yn(a, 6) ^ yn(a, 11) ^ yn(a, 25), h = d + g + Ww(a, c, f) + Xw[l] + tr[l] | 0, m = (yn(r, 2) ^ yn(r, 13) ^ yn(r, 22)) + qw(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    tr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Yw = class extends Rh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ws = ms(() => new Rh());
ms(() => new Yw());
const Zw = {}, Gh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Zw
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const kt = BigInt(0), Xt = BigInt(1), vr = BigInt(2), vi = BigInt(3), nf = BigInt(8), Ht = Object.freeze({
  a: kt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Xt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), rf = (t, e) => (t + e / vr) / e, so = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Ht, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Xt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = rf(i * t, e), c = rf(-r * t, e);
    let f = K(t - a * n - c * s, e), d = K(-a * r - c * i, e);
    const l = f > o, g = d > o;
    if (l && (f = e - f), g && (d = e - d), f > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: d };
  }
}, ln = 32, ts = 32, Kh = 32, Ro = ln + 1, Go = 2 * ln + 1;
function sf(t) {
  const { a: e, b: n } = Ht, r = K(t * t), s = K(r * t);
  return K(s + e * t + n);
}
const io = Ht.a === kt;
class _l extends Error {
  constructor(e) {
    super(e);
  }
}
function of(t) {
  if (!(t instanceof Tt))
    throw new TypeError("JacobianPoint expected");
}
class Tt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Et))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Et.ZERO) ? Tt.ZERO : new Tt(e.x, e.y, Xt);
  }
  static toAffineBatch(e) {
    const n = nb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Tt.toAffineBatch(e).map(Tt.fromAffine);
  }
  equals(e) {
    of(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = K(s * s), f = K(a * a), d = K(n * f), l = K(i * c), g = K(K(r * a) * f), h = K(K(o * s) * c);
    return d === l && g === h;
  }
  negate() {
    return new Tt(this.x, K(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = K(e * e), i = K(n * n), o = K(i * i), a = e + i, c = K(vr * (K(a * a) - s - o)), f = K(vi * s), d = K(f * f), l = K(d - vr * c), g = K(f * (c - l) - nf * o), h = K(vr * n * r);
    return new Tt(l, g, h);
  }
  add(e) {
    of(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === kt || o === kt)
      return this;
    if (n === kt || r === kt)
      return e;
    const c = K(s * s), f = K(a * a), d = K(n * f), l = K(i * c), g = K(K(r * a) * f), h = K(K(o * s) * c), b = K(l - d), m = K(h - g);
    if (b === kt)
      return m === kt ? this.double() : Tt.ZERO;
    const L = K(b * b), S = K(b * L), T = K(d * L), w = K(m * m - S - vr * T), B = K(m * (T - w) - g * S), I = K(s * a * b);
    return new Tt(w, B, I);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Tt.ZERO;
    if (typeof e == "bigint" && e === kt)
      return n;
    let r = lf(e);
    if (r === Xt)
      return this;
    if (!io) {
      let l = n, g = this;
      for (; r > kt; )
        r & Xt && (l = l.add(g)), g = g.double(), r >>= Xt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = so.splitScalar(r), c = n, f = n, d = this;
    for (; i > kt || a > kt; )
      i & Xt && (c = c.add(d)), a & Xt && (f = f.add(d)), d = d.double(), i >>= Xt, a >>= Xt;
    return s && (c = c.negate()), o && (f = f.negate()), f = new Tt(K(f.x * so.beta), f.y, f.z), c.add(f);
  }
  precomputeWindow(e) {
    const n = io ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Tt.BASE) && (n = Et.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && kc.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Tt.normalizeZ(s), kc.set(n, s)));
    let i = Tt.ZERO, o = Tt.BASE;
    const a = 1 + (io ? 128 / r : 256 / r), c = 2 ** (r - 1), f = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let b = Number(e & f);
      e >>= l, b > c && (b -= d, e += Xt);
      const m = h, L = h + Math.abs(b) - 1, S = g % 2 !== 0, T = b < 0;
      b === 0 ? o = o.add(oo(S, s[m])) : i = i.add(oo(T, s[L]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = lf(e), s, i;
    if (io) {
      const { k1neg: o, k1: a, k2neg: c, k2: f } = so.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(f, n);
      d = oo(o, d), g = oo(c, g), g = new Tt(K(g.x * so.beta), g.y, g.z), s = d.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Tt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Tt.ZERO);
    e == null && (e = i ? nf : ui(s));
    const o = e, a = K(o * o), c = K(a * o), f = K(n * a), d = K(r * c), l = K(s * o);
    if (i)
      return Et.ZERO;
    if (l !== Xt)
      throw new Error("invZ was invalid");
    return new Et(f, d);
  }
}
Tt.BASE = new Tt(Ht.Gx, Ht.Gy, Xt);
Tt.ZERO = new Tt(kt, Xt, kt);
function oo(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const kc = /* @__PURE__ */ new WeakMap();
class Et {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, kc.delete(this);
  }
  hasEvenY() {
    return this.y % vr === kt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Ve(n ? e : e.subarray(1));
    if (!No(r))
      throw new Error("Point is not on curve");
    const s = sf(r);
    let i = eb(s);
    const o = (i & Xt) === Xt;
    n ? o && (i = K(-i)) : (e[0] & 1) === 1 !== o && (i = K(-i));
    const a = new Et(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Ve(e.subarray(1, ln + 1)), r = Ve(e.subarray(ln + 1, ln * 2 + 1)), s = new Et(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Cn(e), r = n.length, s = n[0];
    if (r === ln)
      return this.fromCompressedHex(n);
    if (r === Ro && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Go && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ro} compressed bytes or ${Go} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Et.BASE.multiply(es(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = qh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Nl(Cn(e)), { n: a } = Ht, c = r === 2 || r === 3 ? s + a : s, f = ui(c, a), d = K(-o * f, a), l = K(i * f, a), g = r & 1 ? "03" : "02", h = Et.fromHex(g + Ir(c)), b = Et.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!b)
      throw new Error("Cannot recover signature: point at infinify");
    return b.assertValidity(), b;
  }
  toRawBytes(e = !1) {
    return kr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ir(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ir(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!No(n) || !No(r))
      throw new Error(e);
    const s = K(r * r), i = sf(n);
    if (K(s - i) !== kt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Et(this.x, K(-this.y));
  }
  double() {
    return Tt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Tt.fromAffine(this).add(Tt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Tt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Tt.fromAffine(this), i = n === kt || n === Xt || this !== Et.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Tt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Tt.ZERO) ? void 0 : a.toAffine();
  }
}
Et.BASE = new Et(Ht.Gx, Ht.Gy);
Et.ZERO = new Et(kt, kt);
function af(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function cf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${qs(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Ve(n), left: t.subarray(e + 2) };
}
function Qw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${qs(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = cf(t.subarray(2)), { data: r, left: s } = cf(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${qs(s)}`);
  return { r: e, s: r };
}
class Ke {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? qs(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Ke(Ko(s.slice(0, 64)), Ko(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Qw(n ? e : kr(e));
    return new Ke(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ys(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ys(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Ht.n >> Xt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Ke(this.r, K(-this.s, Ht.n)) : this;
  }
  toDERRawBytes() {
    return kr(this.toDERHex());
  }
  toDERHex() {
    const e = af(xi(this.s)), n = af(xi(this.r)), r = e.length / 2, s = n.length / 2, i = xi(r), o = xi(s);
    return `30${xi(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return kr(this.toCompactHex());
  }
  toCompactHex() {
    return Ir(this.r) + Ir(this.s);
  }
}
function Ar(...t) {
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
const Jw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function qs(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Jw[t[n]];
  return e;
}
const tb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ir(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(kt <= t && t < tb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Xs(t) {
  const e = kr(Ir(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function xi(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ko(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function kr(t) {
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
function Ve(t) {
  return Ko(qs(t));
}
function Cn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : kr(t);
}
function lf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ys(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function K(t, e = Ht.P) {
  const n = t % e;
  return n >= kt ? n : e + n;
}
function qe(t, e) {
  const { P: n } = Ht;
  let r = t;
  for (; e-- > kt; )
    r *= r, r %= n;
  return r;
}
function eb(t) {
  const { P: e } = Ht, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, f = c * c * t % e, d = qe(f, vi) * f % e, l = qe(d, vi) * f % e, g = qe(l, vr) * c % e, h = qe(g, r) * g % e, b = qe(h, s) * h % e, m = qe(b, o) * b % e, L = qe(m, a) * m % e, S = qe(L, o) * b % e, T = qe(S, vi) * f % e, w = qe(T, i) * h % e, B = qe(w, n) * c % e, I = qe(B, vr);
  if (I * I % e !== t)
    throw new Error("Cannot find square root");
  return I;
}
function ui(t, e = Ht.P) {
  if (t === kt || e <= kt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = K(t, e), r = e, s = kt, i = Xt;
  for (; n !== kt; ) {
    const a = r / n, c = r % n, f = s - i * a;
    r = n, n = c, s = i, i = f;
  }
  if (r !== Xt)
    throw new Error("invert: does not exist");
  return K(s, e);
}
function nb(t, e = Ht.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === kt ? i : (n[a] = i, K(i * o, e)), Xt), s = ui(r, e);
  return t.reduceRight((i, o, a) => o === kt ? i : (n[a] = K(i * n[a], e), K(i * o, e)), s), n;
}
function rb(t) {
  const e = t.length * 8 - ts * 8, n = Ve(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Nl(t, e = !1) {
  const n = rb(t);
  if (e)
    return n;
  const { n: r } = Ht;
  return n >= r ? n - r : n;
}
let Rs, Ii;
class Vh {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return ee.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Ii(this.k, ...e);
  }
  checkSync() {
    if (typeof Ii != "function")
      throw new _l("hmacSha256Sync needs to be set");
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
    return Ar(...n);
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
    return Ar(...n);
  }
}
function Ys(t) {
  return kt < t && t < Ht.n;
}
function No(t) {
  return kt < t && t < Ht.P;
}
function Wh(t, e, n, r = !0) {
  const { n: s } = Ht, i = Nl(t, !0);
  if (!Ys(i))
    return;
  const o = ui(i, s), a = Et.BASE.multiply(i), c = K(a.x, s);
  if (c === kt)
    return;
  const f = K(o * K(e + n * c, s), s);
  if (f === kt)
    return;
  let d = new Ke(c, f), l = (a.x === d.r ? 0 : 2) | Number(a.y & Xt);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function es(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * ts)
      throw new Error("Expected 32 bytes of private key");
    e = Ko(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ts)
      throw new Error("Expected 32 bytes of private key");
    e = Ve(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ys(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Ul(t) {
  return t instanceof Et ? (t.assertValidity(), t) : Et.fromHex(t);
}
function qh(t) {
  if (t instanceof Ke)
    return t.assertValidity(), t;
  try {
    return Ke.fromDER(t);
  } catch {
    return Ke.fromCompact(t);
  }
}
function Vi(t, e = !1) {
  return Et.fromPrivateKey(t).toRawBytes(e);
}
function sb(t, e, n, r = !1) {
  return Et.fromSignature(t, e, n).toRawBytes(r);
}
function uf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ro || r === Go : n ? r === Ro * 2 || r === Go * 2 : t instanceof Et;
}
function Pl(t, e, n = !1) {
  if (uf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!uf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Ul(e);
  return r.assertValidity(), r.multiply(es(t)).toRawBytes(n);
}
function Xh(t) {
  const e = t.length > ln ? t.slice(0, ln) : t;
  return Ve(e);
}
function ib(t) {
  const e = Xh(t), n = K(e, Ht.n);
  return Yh(n < kt ? e : n);
}
function Yh(t) {
  return Xs(t);
}
function Zh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Cn(t), s = es(e), i = [Yh(s), ib(r)];
  if (n != null) {
    n === !0 && (n = ee.randomBytes(ln));
    const c = Cn(n);
    if (c.length !== ln)
      throw new Error(`sign: Expected ${ln} bytes of extra data`);
    i.push(c);
  }
  const o = Ar(...i), a = Xh(r);
  return { seed: o, m: a, d: s };
}
function Qh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function ob(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Zh(t, e, n.extraEntropy), o = new Vh(Kh, ts);
  await o.reseed(r);
  let a;
  for (; !(a = Wh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Qh(a, n);
}
function ya(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Zh(t, e, n.extraEntropy), o = new Vh(Kh, ts);
  o.reseedSync(r);
  let a;
  for (; !(a = Wh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Qh(a, n);
}
const ab = { strict: !0 };
function cb(t, e, n, r = ab) {
  let s;
  try {
    s = qh(t), e = Cn(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Nl(e);
  let c;
  try {
    c = Ul(n);
  } catch {
    return !1;
  }
  const { n: f } = Ht, d = ui(o, f), l = K(a * d, f), g = K(i * d, f), h = Et.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? K(h.x, f) === i : !1;
}
function Vo(t) {
  return K(Ve(t), Ht.n);
}
class Zs {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Cn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Ve(n.subarray(0, 32)), s = Ve(n.subarray(32, 64));
    return new Zs(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!No(e) || !Ys(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ir(this.r) + Ir(this.s);
  }
  toRawBytes() {
    return kr(this.toHex());
  }
}
function lb(t) {
  return Et.fromPrivateKey(t).toRawX();
}
class Jh {
  constructor(e, n, r = ee.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Cn(e);
    const { x: s, scalar: i } = this.getScalar(es(n));
    if (this.px = s, this.d = i, this.rand = Cn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Et.fromPrivateKey(e), r = n.hasEvenY() ? e : Ht.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Xs(e ^ Ve(n));
  }
  finalizeNonce(e) {
    const n = K(Ve(e), Ht.n);
    if (n === kt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Zs(e.x, K(n + r * s, Ht.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = ee.taggedHash, o = this.initNonce(n, await i(Er.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(await i(Er.nonce, o, r, e)), d = Vo(await i(Er.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return await n0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = ee.taggedHashSync, o = this.initNonce(n, i(Er.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(i(Er.nonce, o, r, e)), d = Vo(i(Er.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return r0(l, e, r) || this.error(), l;
  }
}
async function ub(t, e, n) {
  return new Jh(t, e, n).calc();
}
function fb(t, e, n) {
  return new Jh(t, e, n).calcSync();
}
function t0(t, e, n) {
  const r = t instanceof Zs, s = r ? t : Zs.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Cn(e),
    P: Ul(n)
  };
}
function e0(t, e, n, r) {
  const s = Et.BASE.multiplyAndAddUnsafe(e, es(n), K(-r, Ht.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function n0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = t0(t, e, n), a = Vo(await ee.taggedHash(Er.challenge, Xs(r), o.toRawX(), i));
    return e0(r, o, s, a);
  } catch {
    return !1;
  }
}
function r0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = t0(t, e, n), a = Vo(ee.taggedHashSync(Er.challenge, Xs(r), o.toRawX(), i));
    return e0(r, o, s, a);
  } catch (r) {
    if (r instanceof _l)
      throw r;
    return !1;
  }
}
const db = {
  Signature: Zs,
  getPublicKey: lb,
  sign: ub,
  verify: n0,
  signSync: fb,
  verifySync: r0
};
Et.BASE._setWindowSize(8);
const Fe = {
  node: Gh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Er = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ao = {}, ee = {
  bytesToHex: qs,
  hexToBytes: kr,
  concatBytes: Ar,
  mod: K,
  invert: ui,
  isValidPrivateKey(t) {
    try {
      return es(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Xs,
  _normalizePrivateKey: es,
  hashToPrivateKey: (t) => {
    t = Cn(t);
    const e = ts + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = K(Ve(t), Ht.n - Xt) + Xt;
    return Xs(n);
  },
  randomBytes: (t = 32) => {
    if (Fe.web)
      return Fe.web.getRandomValues(new Uint8Array(t));
    if (Fe.node) {
      const { randomBytes: e } = Fe.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => ee.hashToPrivateKey(ee.randomBytes(ts + 8)),
  precompute(t = 8, e = Et.BASE) {
    const n = e === Et.BASE ? e : new Et(e.x, e.y);
    return n._setWindowSize(t), n.multiply(vi), n;
  },
  sha256: async (...t) => {
    if (Fe.web) {
      const e = await Fe.web.subtle.digest("SHA-256", Ar(...t));
      return new Uint8Array(e);
    } else if (Fe.node) {
      const { createHash: e } = Fe.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Fe.web) {
      const n = await Fe.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ar(...e), s = await Fe.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Fe.node) {
      const { createHmac: n } = Fe.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = ao[t];
    if (n === void 0) {
      const r = await ee.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ar(r, r), ao[t] = n;
    }
    return ee.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Rs != "function")
      throw new _l("sha256Sync is undefined, you need to set it");
    let n = ao[t];
    if (n === void 0) {
      const r = Rs(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ar(r, r), ao[t] = n;
    }
    return Rs(n, ...e);
  },
  _JacobianPoint: Tt
};
Object.defineProperties(ee, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Rs;
    },
    set(t) {
      Rs || (Rs = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ii;
    },
    set(t) {
      Ii || (Ii = t);
    }
  }
});
const hb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Ht,
  Point: Et,
  Signature: Ke,
  getPublicKey: Vi,
  getSharedSecret: Pl,
  recoverPublicKey: sb,
  schnorr: db,
  sign: ob,
  signSync: ya,
  utils: ee,
  verify: cb
}, Symbol.toStringTag, { value: "Module" }));
var Wi = {};
Wi.byteLength = bb;
var pb = Wi.toByteArray = xb, gb = Wi.fromByteArray = Ab, En = [], Ye = [], yb = typeof Uint8Array < "u" ? Uint8Array : Array, Ja = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ms = 0, wb = Ja.length; Ms < wb; ++Ms)
  En[Ms] = Ja[Ms], Ye[Ja.charCodeAt(Ms)] = Ms;
Ye[45] = 62;
Ye[95] = 63;
function s0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function bb(t) {
  var e = s0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function mb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function xb(t) {
  var e, n = s0(t), r = n[0], s = n[1], i = new yb(mb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Ye[t.charCodeAt(c)] << 18 | Ye[t.charCodeAt(c + 1)] << 12 | Ye[t.charCodeAt(c + 2)] << 6 | Ye[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Ye[t.charCodeAt(c)] << 2 | Ye[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Ye[t.charCodeAt(c)] << 10 | Ye[t.charCodeAt(c + 1)] << 4 | Ye[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Sb(t) {
  return En[t >> 18 & 63] + En[t >> 12 & 63] + En[t >> 6 & 63] + En[t & 63];
}
function Eb(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Sb(r));
  return s.join("");
}
function Ab(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Eb(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    En[e >> 2] + En[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    En[e >> 10] + En[e >> 4 & 63] + En[e << 2 & 63] + "="
  )), s.join("");
}
function $b() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const vb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Ib() {
  if ($b())
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
    throw new Error(vb);
  }
}
class kb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Ln(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Ln(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Lb {
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
async function i0() {
  const t = await Ib();
  return t.name === "subtleCrypto" ? new Lb(t.lib) : new kb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Cb(t) {
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), f = Math.log(256) / Math.log(o);
  function d(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var b = 0, m = 0, L = 0, S = h.length; L !== S && h[L] === 0; )
      L++, b++;
    for (var T = (S - L) * f + 1 >>> 0, w = new Uint8Array(T); L !== S; ) {
      for (var B = h[L], I = 0, H = T - 1; (B !== 0 || I < m) && H !== -1; H--, I++)
        B += 256 * w[H] >>> 0, w[H] = B % o >>> 0, B = B / o >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      m = I, L++;
    }
    for (var Z = T - m; Z !== T && w[Z] === 0; )
      Z++;
    for (var F = a.repeat(b); Z < T; ++Z)
      F += t.charAt(w[Z]);
    return F;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var b = 0, m = 0, L = 0; h[b] === a; )
      m++, b++;
    for (var S = (h.length - b) * c + 1 >>> 0, T = new Uint8Array(S); h[b]; ) {
      var w = h.charCodeAt(b);
      if (w > 255)
        return;
      var B = e[w];
      if (B === 255)
        return;
      for (var I = 0, H = S - 1; (B !== 0 || I < L) && H !== -1; H--, I++)
        B += o * T[H] >>> 0, T[H] = B % 256 >>> 0, B = B / 256 >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      L = I, b++;
    }
    for (var Z = S - L; Z !== S && T[Z] === 0; )
      Z++;
    for (var F = new Uint8Array(m + (S - Z)), q = m; Z !== S; )
      F[q++] = T[Z++];
    return F;
  }
  function g(h) {
    var b = l(h);
    if (b)
      return b;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var o0 = Cb;
const Bb = o0, Tb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Mb = Bb(Tb);
const _b = /* @__PURE__ */ Bh(Mb), Nb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), a0 = Uint8Array.from({ length: 16 }, (t, e) => e), Ub = a0.map((t) => (9 * t + 5) % 16);
let Hl = [a0], Ol = [Ub];
for (let t = 0; t < 4; t++)
  for (let e of [Hl, Ol])
    e.push(e[t].map((n) => Nb[n]));
const c0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Pb = Hl.map((t, e) => t.map((n) => c0[e][n])), Hb = Ol.map((t, e) => t.map((n) => c0[e][n])), Ob = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Db = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), co = (t, e) => t << e | t >>> 32 - e;
function ff(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const lo = new Uint32Array(16);
let Fb = class extends Ml {
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
      lo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, m = Ob[h], L = Db[h], S = Hl[h], T = Ol[h], w = Pb[h], B = Hb[h];
      for (let I = 0; I < 16; I++) {
        const H = co(r + ff(h, i, a, f) + lo[S[I]] + m, w[I]) + l | 0;
        r = l, l = f, f = co(a, 10) | 0, a = i, i = H;
      }
      for (let I = 0; I < 16; I++) {
        const H = co(s + ff(b, o, c, d) + lo[T[I]] + L, B[I]) + g | 0;
        s = g, g = d, d = co(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    lo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const jb = ms(() => new Fb());
function zb(t) {
  return jb(t);
}
const uo = BigInt(2 ** 32 - 1), Lc = BigInt(32);
function l0(t, e = !1) {
  return e ? { h: Number(t & uo), l: Number(t >> Lc & uo) } : { h: Number(t >> Lc & uo) | 0, l: Number(t & uo) | 0 };
}
function Rb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = l0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Gb = (t, e) => BigInt(t >>> 0) << Lc | BigInt(e >>> 0), Kb = (t, e, n) => t >>> n, Vb = (t, e, n) => t << 32 - n | e >>> n, Wb = (t, e, n) => t >>> n | e << 32 - n, qb = (t, e, n) => t << 32 - n | e >>> n, Xb = (t, e, n) => t << 64 - n | e >>> n - 32, Yb = (t, e, n) => t >>> n - 32 | e << 64 - n, Zb = (t, e) => e, Qb = (t, e) => t, Jb = (t, e, n) => t << n | e >>> 32 - n, t1 = (t, e, n) => e << n | t >>> 32 - n, e1 = (t, e, n) => e << n - 32 | t >>> 64 - n, n1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function r1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const s1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), i1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, o1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), a1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, c1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), l1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, yt = {
  fromBig: l0,
  split: Rb,
  toBig: Gb,
  shrSH: Kb,
  shrSL: Vb,
  rotrSH: Wb,
  rotrSL: qb,
  rotrBH: Xb,
  rotrBL: Yb,
  rotr32H: Zb,
  rotr32L: Qb,
  rotlSH: Jb,
  rotlSL: t1,
  rotlBH: e1,
  rotlBL: n1,
  add: r1,
  add3L: s1,
  add3H: i1,
  add4L: o1,
  add4H: a1,
  add5H: l1,
  add5L: c1
}, [u1, f1] = yt.split([
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
].map((t) => BigInt(t))), er = new Uint32Array(80), nr = new Uint32Array(80);
let wa = class extends Ml {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      er[w] = e.getUint32(n), nr[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const B = er[w - 15] | 0, I = nr[w - 15] | 0, H = yt.rotrSH(B, I, 1) ^ yt.rotrSH(B, I, 8) ^ yt.shrSH(B, I, 7), Z = yt.rotrSL(B, I, 1) ^ yt.rotrSL(B, I, 8) ^ yt.shrSL(B, I, 7), F = er[w - 2] | 0, q = nr[w - 2] | 0, x = yt.rotrSH(F, q, 19) ^ yt.rotrBH(F, q, 61) ^ yt.shrSH(F, q, 6), $ = yt.rotrSL(F, q, 19) ^ yt.rotrBL(F, q, 61) ^ yt.shrSL(F, q, 6), O = yt.add4L(Z, $, nr[w - 7], nr[w - 16]), X = yt.add4H(O, H, x, er[w - 7], er[w - 16]);
      er[w] = X | 0, nr[w] = O | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: m, Gl: L, Hh: S, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const B = yt.rotrSH(l, g, 14) ^ yt.rotrSH(l, g, 18) ^ yt.rotrBH(l, g, 41), I = yt.rotrSL(l, g, 14) ^ yt.rotrSL(l, g, 18) ^ yt.rotrBL(l, g, 41), H = l & h ^ ~l & m, Z = g & b ^ ~g & L, F = yt.add5L(T, I, Z, f1[w], nr[w]), q = yt.add5H(F, S, B, H, u1[w], er[w]), x = F | 0, $ = yt.rotrSH(r, s, 28) ^ yt.rotrBH(r, s, 34) ^ yt.rotrBH(r, s, 39), O = yt.rotrSL(r, s, 28) ^ yt.rotrBL(r, s, 34) ^ yt.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, st = s & o ^ s & c ^ o & c;
      S = m | 0, T = L | 0, m = h | 0, L = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = yt.add(f | 0, d | 0, q | 0, x | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = yt.add3L(x, O, st);
      r = yt.add3H(z, q, $, X), s = z | 0;
    }
    ({ h: r, l: s } = yt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = yt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = yt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = yt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = yt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = yt.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: m, l: L } = yt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: S, l: T } = yt.add(this.Hh | 0, this.Hl | 0, S | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, b, m, L, S, T);
  }
  roundClean() {
    er.fill(0), nr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, d1 = class extends wa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, h1 = class extends wa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, p1 = class extends wa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const g1 = ms(() => new wa());
ms(() => new d1());
ms(() => new h1());
ms(() => new p1());
function u0(t) {
  return Ws(t);
}
function y1(t) {
  return g1(t);
}
const w1 = 0;
ee.hmacSha256Sync = (t, ...e) => {
  const n = ga.create(Ws, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function b1() {
  return nt(ee.randomPrivateKey());
}
function m1(t) {
  const e = Ws(Ws(t));
  return _b.encode(Ln(t, e).slice(0, t.length + 4));
}
function x1(t, e) {
  return m1(Ln(new Uint8Array([t]), e.slice(0, 20)));
}
function f0(t, e = w1) {
  const n = typeof t == "string" ? Ct(t) : t, r = zb(u0(n));
  return x1(e, r);
}
function d0(t) {
  const e = Bl(t);
  return nt(Vi(e.slice(0, 32), !0));
}
ee.hmacSha256Sync = (t, ...e) => {
  const n = ga.create(Ws, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Wo;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Wo || (Wo = {}));
async function S1(t, e, n) {
  return await (await i0()).encrypt("aes-256-cbc", e, t, n);
}
async function E1(t, e, n) {
  return await (await i0()).decrypt("aes-256-cbc", e, t, n);
}
function h0(t, e) {
  return ga(Ws, t, e);
}
function A1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function p0(t) {
  const e = y1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function $1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function v1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Wo.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Wo.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !$1(t))
    return e;
  try {
    return Et.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function I1(t, e, n, r) {
  const s = v1(t);
  if (!s.result)
    throw s;
  const i = ee.randomPrivateKey(), o = Vi(i, !0);
  let a = Pl(i, t, !0);
  a = a.slice(1);
  const c = p0(a), f = ee.randomBytes(16), d = await S1(f, c.encryptionKey, e), l = Ln(f, o, d), g = h0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = nt(d);
  else if (r === "base64")
    h = gb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const b = {
    iv: nt(f),
    ephemeralPK: nt(o),
    cipherText: h,
    mac: nt(g),
    wasString: n
  };
  return r && r !== "hex" && (b.cipherTextEncoding = r), b;
}
async function g0(t, e) {
  if (!e.ephemeralPK)
    throw new Qu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Pl(t, n, !0);
  r = r.slice(1);
  const s = p0(r), i = Ct(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Ct(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = pb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Ln(i, Ct(n), o), c = h0(s.hmacKey, a), f = Ct(e.mac);
  if (!A1(f, c))
    throw new Qu("Decryption failed: failure in MAC check");
  const d = await E1(i, s.encryptionKey, o);
  return e.wasString ? Ki(d) : d;
}
function k1(t, e) {
  const n = typeof e == "string" ? bs(e) : e, r = d0(t), s = u0(n), i = ya(s, t);
  return {
    signature: nt(i),
    publicKey: r
  };
}
async function L1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = d0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? bs(t) : t, o = await I1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = k1(r, a), f = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(f);
  }
  return a;
}
function C1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return g0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var ye = {}, Qs = {}, $e = {};
Object.defineProperty($e, "__esModule", { value: !0 });
$e.decode = $e.encode = $e.unescape = $e.escape = $e.pad = void 0;
const y0 = Wi;
function Dl(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
$e.pad = Dl;
function w0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
$e.escape = w0;
function b0(t) {
  return Dl(t).replace(/-/g, "+").replace(/_/g, "/");
}
$e.unescape = b0;
function B1(t) {
  return w0((0, y0.fromByteArray)(new TextEncoder().encode(t)));
}
$e.encode = B1;
function T1(t) {
  return new TextDecoder().decode((0, y0.toByteArray)(Dl(b0(t))));
}
$e.decode = T1;
var ba = {}, ma = {}, m0 = {}, x0 = {}, xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
xa.crypto = void 0;
xa.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = f, t.clean = d, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = b, t.byteSwap32 = m, t.bytesToHex = T, t.hexToBytes = I, t.asyncLoop = Z, t.utf8ToBytes = F, t.bytesToUtf8 = q, t.toBytes = x, t.kdfInputToBytes = $, t.concatBytes = O, t.checkOpts = X, t.createHasher = z, t.createOptHasher = Nt, t.createXOFer = ae, t.randomBytes = ne;
  const e = xa;
  function n(A) {
    return A instanceof Uint8Array || ArrayBuffer.isView(A) && A.constructor.name === "Uint8Array";
  }
  function r(A) {
    if (!Number.isSafeInteger(A) || A < 0)
      throw new Error("positive integer expected, got " + A);
  }
  function s(A, ...N) {
    if (!n(A))
      throw new Error("Uint8Array expected");
    if (N.length > 0 && !N.includes(A.length))
      throw new Error("Uint8Array expected of length " + N + ", got length=" + A.length);
  }
  function i(A) {
    if (typeof A != "function" || typeof A.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(A.outputLen), r(A.blockLen);
  }
  function o(A, N = !0) {
    if (A.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (N && A.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(A, N) {
    s(A);
    const pt = N.outputLen;
    if (A.length < pt)
      throw new Error("digestInto() expects output buffer of length at least " + pt);
  }
  function c(A) {
    return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
  }
  function f(A) {
    return new Uint32Array(A.buffer, A.byteOffset, Math.floor(A.byteLength / 4));
  }
  function d(...A) {
    for (let N = 0; N < A.length; N++)
      A[N].fill(0);
  }
  function l(A) {
    return new DataView(A.buffer, A.byteOffset, A.byteLength);
  }
  function g(A, N) {
    return A << 32 - N | A >>> N;
  }
  function h(A, N) {
    return A << N | A >>> 32 - N >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function b(A) {
    return A << 24 & 4278190080 | A << 8 & 16711680 | A >>> 8 & 65280 | A >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (A) => A : (A) => b(A), t.byteSwapIfBE = t.swap8IfBE;
  function m(A) {
    for (let N = 0; N < A.length; N++)
      A[N] = b(A[N]);
    return A;
  }
  t.swap32IfBE = t.isLE ? (A) => A : m;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", S = /* @__PURE__ */ Array.from({ length: 256 }, (A, N) => N.toString(16).padStart(2, "0"));
  function T(A) {
    if (s(A), L)
      return A.toHex();
    let N = "";
    for (let pt = 0; pt < A.length; pt++)
      N += S[A[pt]];
    return N;
  }
  const w = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function B(A) {
    if (A >= w._0 && A <= w._9)
      return A - w._0;
    if (A >= w.A && A <= w.F)
      return A - (w.A - 10);
    if (A >= w.a && A <= w.f)
      return A - (w.a - 10);
  }
  function I(A) {
    if (typeof A != "string")
      throw new Error("hex string expected, got " + typeof A);
    if (L)
      return Uint8Array.fromHex(A);
    const N = A.length, pt = N / 2;
    if (N % 2)
      throw new Error("hex string expected, got unpadded hex of length " + N);
    const rt = new Uint8Array(pt);
    for (let ct = 0, Lt = 0; ct < pt; ct++, Lt += 2) {
      const Wt = B(A.charCodeAt(Lt)), Gt = B(A.charCodeAt(Lt + 1));
      if (Wt === void 0 || Gt === void 0) {
        const Ot = A[Lt] + A[Lt + 1];
        throw new Error('hex string expected, got non-hex character "' + Ot + '" at index ' + Lt);
      }
      rt[ct] = Wt * 16 + Gt;
    }
    return rt;
  }
  const H = async () => {
  };
  t.nextTick = H;
  async function Z(A, N, pt) {
    let rt = Date.now();
    for (let ct = 0; ct < A; ct++) {
      pt(ct);
      const Lt = Date.now() - rt;
      Lt >= 0 && Lt < N || (await (0, t.nextTick)(), rt += Lt);
    }
  }
  function F(A) {
    if (typeof A != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(A));
  }
  function q(A) {
    return new TextDecoder().decode(A);
  }
  function x(A) {
    return typeof A == "string" && (A = F(A)), s(A), A;
  }
  function $(A) {
    return typeof A == "string" && (A = F(A)), s(A), A;
  }
  function O(...A) {
    let N = 0;
    for (let rt = 0; rt < A.length; rt++) {
      const ct = A[rt];
      s(ct), N += ct.length;
    }
    const pt = new Uint8Array(N);
    for (let rt = 0, ct = 0; rt < A.length; rt++) {
      const Lt = A[rt];
      pt.set(Lt, ct), ct += Lt.length;
    }
    return pt;
  }
  function X(A, N) {
    if (N !== void 0 && {}.toString.call(N) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(A, N);
  }
  class st {
  }
  t.Hash = st;
  function z(A) {
    const N = (rt) => A().update(x(rt)).digest(), pt = A();
    return N.outputLen = pt.outputLen, N.blockLen = pt.blockLen, N.create = () => A(), N;
  }
  function Nt(A) {
    const N = (rt, ct) => A(ct).update(x(rt)).digest(), pt = A({});
    return N.outputLen = pt.outputLen, N.blockLen = pt.blockLen, N.create = (rt) => A(rt), N;
  }
  function ae(A) {
    const N = (rt, ct) => A(ct).update(x(rt)).digest(), pt = A({});
    return N.outputLen = pt.outputLen, N.blockLen = pt.blockLen, N.create = (rt) => A(rt), N;
  }
  t.wrapConstructor = z, t.wrapConstructorWithOpts = Nt, t.wrapXOFConstructorWithOpts = ae;
  function ne(A = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(A));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(A));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(x0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = x0;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, f = new Uint8Array(c);
      f.set(a.length > c ? i.create().update(a).digest() : a);
      for (let d = 0; d < f.length; d++)
        f[d] ^= 54;
      this.iHash.update(f), this.oHash = i.create();
      for (let d = 0; d < f.length; d++)
        f[d] ^= 106;
      this.oHash.update(f), (0, e.clean)(f);
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
      const { oHash: o, iHash: a, finished: c, destroyed: f, blockLen: d, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = f, i.blockLen = d, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(m0);
const _s = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function S0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Cc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function xs(t, ...e) {
  if (!S0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function M1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Cc(t.outputLen), Cc(t.blockLen);
}
function Bc(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function E0(t, e) {
  xs(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function _1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function N1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function qo(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Uo(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function rn(t, e) {
  return t << 32 - e | t >>> e;
}
function U1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Fl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function jl(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const A0 = Fl ? (t) => t : (t) => jl(t), P1 = A0;
function $0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = jl(t[e]);
  return t;
}
const H1 = Fl ? (t) => t : $0, v0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", O1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function I0(t) {
  if (xs(t), v0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += O1[t[n]];
  return e;
}
const Un = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function df(t) {
  if (t >= Un._0 && t <= Un._9)
    return t - Un._0;
  if (t >= Un.A && t <= Un.F)
    return t - (Un.A - 10);
  if (t >= Un.a && t <= Un.f)
    return t - (Un.a - 10);
}
function D1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (v0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = df(t.charCodeAt(i)), a = df(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const k0 = async () => {
};
async function F1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await k0(), r += i);
  }
}
function zl(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function j1(t) {
  return new TextDecoder().decode(t);
}
function qi(t) {
  return typeof t == "string" && (t = zl(t)), xs(t), t;
}
function z1(t) {
  return typeof t == "string" && (t = zl(t)), xs(t), t;
}
function R1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    xs(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function G1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let L0 = class {
};
function Sa(t) {
  const e = (r) => t().update(qi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function C0(t) {
  const e = (r, s) => t(s).update(qi(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function B0(t) {
  const e = (r, s) => t(s).update(qi(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const K1 = Sa, V1 = C0, W1 = B0;
function q1(t = 32) {
  if (_s && typeof _s.getRandomValues == "function")
    return _s.getRandomValues(new Uint8Array(t));
  if (_s && typeof _s.randomBytes == "function")
    return Uint8Array.from(_s.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const X1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: L0,
  abytes: xs,
  aexists: Bc,
  ahash: M1,
  anumber: Cc,
  aoutput: E0,
  asyncLoop: F1,
  byteSwap: jl,
  byteSwap32: $0,
  byteSwapIfBE: P1,
  bytesToHex: I0,
  bytesToUtf8: j1,
  checkOpts: G1,
  clean: qo,
  concatBytes: R1,
  createHasher: Sa,
  createOptHasher: C0,
  createView: Uo,
  createXOFer: B0,
  hexToBytes: D1,
  isBytes: S0,
  isLE: Fl,
  kdfInputToBytes: z1,
  nextTick: k0,
  randomBytes: q1,
  rotl: U1,
  rotr: rn,
  swap32IfBE: H1,
  swap8IfBE: A0,
  toBytes: qi,
  u32: N1,
  u8: _1,
  utf8ToBytes: zl,
  wrapConstructor: K1,
  wrapConstructorWithOpts: V1,
  wrapXOFConstructorWithOpts: W1
}, Symbol.toStringTag, { value: "Module" }));
function Y1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
function Z1(t, e, n) {
  return t & e ^ ~t & n;
}
function Q1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class J1 extends L0 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Uo(this.buffer);
  }
  update(e) {
    Bc(this), e = qi(e), xs(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Uo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Bc(this), E0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, qo(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Y1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Uo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const rr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), sr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), tm = /* @__PURE__ */ Uint32Array.from([
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
]), ir = /* @__PURE__ */ new Uint32Array(64);
let Rl = class extends J1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = rr[0] | 0, this.B = rr[1] | 0, this.C = rr[2] | 0, this.D = rr[3] | 0, this.E = rr[4] | 0, this.F = rr[5] | 0, this.G = rr[6] | 0, this.H = rr[7] | 0;
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
      ir[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ir[l - 15], h = ir[l - 2], b = rn(g, 7) ^ rn(g, 18) ^ g >>> 3, m = rn(h, 17) ^ rn(h, 19) ^ h >>> 10;
      ir[l] = m + ir[l - 7] + b + ir[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = rn(a, 6) ^ rn(a, 11) ^ rn(a, 25), h = d + g + Z1(a, c, f) + tm[l] + ir[l] | 0, m = (rn(r, 2) ^ rn(r, 13) ^ rn(r, 22)) + Q1(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    qo(ir);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), qo(this.buffer);
  }
}, T0 = class extends Rl {
  constructor() {
    super(28), this.A = sr[0] | 0, this.B = sr[1] | 0, this.C = sr[2] | 0, this.D = sr[3] | 0, this.E = sr[4] | 0, this.F = sr[5] | 0, this.G = sr[6] | 0, this.H = sr[7] | 0;
  }
};
const em = /* @__PURE__ */ Sa(() => new Rl()), nm = /* @__PURE__ */ Sa(() => new T0()), rm = Rl, M0 = em, sm = T0, im = nm, om = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: sm,
  SHA256: rm,
  sha224: im,
  sha256: M0
}, Symbol.toStringTag, { value: "Module" })), Ea = /* @__PURE__ */ ha(om), am = /* @__PURE__ */ ha(hb);
var Js = {};
Object.defineProperty(Js, "__esModule", { value: !0 });
Js.joseToDer = Js.derToJose = void 0;
const _0 = Wi, N0 = $e;
function tc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const cm = {
  ES256: tc(256),
  ES384: tc(384),
  ES512: tc(521)
};
function U0(t) {
  const e = cm[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Xo = 128, P0 = 0, lm = 32, um = 16, fm = 2, H0 = um | lm | P0 << 6, Yo = fm | P0 << 6;
function O0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, _0.toByteArray)((0, N0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function dm(t, e) {
  const n = O0(t), r = U0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== H0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Xo | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Yo)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const f = o;
  if (o += c, n[o++] !== Yo)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, h = r - d, b = new Uint8Array(g + c + h + d);
  for (o = 0; o < g; ++o)
    b[o] = 0;
  b.set(n.subarray(f + Math.max(-g, 0), f + c), o), o = r;
  for (const m = o; o < m + h; ++o)
    b[o] = 0;
  return b.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, N0.escape)((0, _0.fromByteArray)(b));
}
Js.derToJose = dm;
function hf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Xo && --r, r;
}
function hm(t, e) {
  t = O0(t);
  const n = U0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = hf(t, 0, n), i = hf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, f = c < Xo, d = new Uint8Array((f ? 2 : 3) + c);
  let l = 0;
  return d[l++] = H0, f ? d[l++] = c : (d[l++] = Xo | 1, d[l++] = c & 255), d[l++] = Yo, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = Yo, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
Js.joseToDer = hm;
var Rn = {};
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.InvalidTokenError = Rn.MissingParametersError = void 0;
class pm extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Rn.MissingParametersError = pm;
class gm extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Rn.InvalidTokenError = gm;
const Xi = /* @__PURE__ */ ha(X1);
Object.defineProperty(ma, "__esModule", { value: !0 });
ma.SECP256K1Client = void 0;
const ym = m0, wm = Ea, Po = am, pf = Js, gf = Rn, yf = Xi;
Po.utils.hmacSha256Sync = (t, ...e) => {
  const n = ym.hmac.create(wm.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class D0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, yf.bytesToHex)(Po.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new gf.MissingParametersError("a signing input hash and private key are all required");
    const s = Po.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, yf.bytesToHex)(s);
    if (r === "jose")
      return (0, pf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, pf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new gf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Po.verify(n, e, r, { strict: !1 });
  }
}
ma.SECP256K1Client = D0;
D0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = ma;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ba);
var ns = {};
const bm = /* @__PURE__ */ ha(Gh);
var mm = Ie && Ie.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(d) {
      try {
        f(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        f(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function f(d) {
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(ns, "__esModule", { value: !0 });
ns.hashSha256Async = ns.hashSha256 = void 0;
const xm = Ea;
function F0(t) {
  return (0, xm.sha256)(t);
}
ns.hashSha256 = F0;
function Sm(t) {
  return mm(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = bm;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(F0(t));
    }
  });
}
ns.hashSha256Async = Sm;
var Em = Ie && Ie.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(d) {
      try {
        f(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        f(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function f(d) {
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Qs, "__esModule", { value: !0 });
Qs.TokenSigner = Qs.createUnsecuredToken = void 0;
const Tc = $e, wf = ba, Am = Rn, bf = ns;
function Mc(t, e) {
  const n = [], r = Tc.encode(JSON.stringify(e));
  n.push(r);
  const s = Tc.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function $m(t) {
  return Mc(t, { typ: "JWT", alg: "none" }) + ".";
}
Qs.createUnsecuredToken = $m;
class vm {
  constructor(e, n) {
    if (!(e && n))
      throw new Am.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !wf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = wf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Mc(e, s), o = (0, bf.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Em(this, void 0, void 0, function* () {
      const s = this.header(r), i = Mc(e, s), o = yield (0, bf.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Tc.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Qs.TokenSigner = vm;
var Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
Aa.TokenVerifier = void 0;
const Im = $e, mf = ba, km = Rn, fo = ns;
class Lm {
  constructor(e, n) {
    if (!(e && n))
      throw new km.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !mf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = mf.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, fo.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, fo.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Im.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, fo.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, fo.hashSha256)(r);
      return i(o);
    }
  }
}
Aa.TokenVerifier = Lm;
var $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
$a.decodeToken = void 0;
const ho = $e;
function Cm(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ho.decode(e[0])), r = JSON.parse(ho.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ho.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(ho.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
$a.decodeToken = Cm;
(function(t) {
  var e = Ie && Ie.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Ie && Ie.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Qs, t), n(Aa, t), n($a, t), n(Rn, t), n(ba, t);
})(ye);
function Bm(t) {
  return `did:btc-addr:${t}`;
}
function Tm(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Zu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Zu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function j0(t) {
  if (t)
    return Tm(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Mm = "1.4.0";
function _m() {
  return b1();
}
function Nm(t, e, n, r = Nh.slice(), s, i = gw().getTime(), o = {}) {
  const a = (h) => {
    const b = Ll("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return b == null ? void 0 : b.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: ww(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Mm,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = ye.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [f];
  const d = f0(f);
  return c.iss = Bm(d), new ye.TokenSigner("ES256k", t).sign(c);
}
async function xf(t, e) {
  const n = Ki(Ct(e)), r = JSON.parse(n), s = await g0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Um(t) {
  const e = ye.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new ye.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Pm(t) {
  const e = ye.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = j0(e.iss);
  if (n.length === 1) {
    if (f0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Hm(t) {
  const e = ye.decodeToken(t).payload;
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
function Om(t) {
  const e = ye.decodeToken(t).payload;
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
function Dm(t) {
  const e = [
    Om(t),
    Hm(t),
    Um(t),
    Pm(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Sf = "1.0.0";
class Lr {
  constructor(e) {
    this.version = Sf, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Sf)
      throw new Ac(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Lr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class z0 {
  constructor(e) {
    if (e) {
      const n = new Lr(e);
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
class Ef extends z0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Lr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Uh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Lr({})), !0;
  }
}
class Af extends z0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = dw, !localStorage.getItem(this.key)) {
      const r = new Lr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Uh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Lr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Lr({})), !0;
  }
}
var _i;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(_i || (_i = {}));
var Zo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zo || (Zo = {}));
_i.Mainnet;
var jn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(jn || (jn = {}));
var $n;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})($n || ($n = {}));
jn.Mainnet;
const R0 = {
  chainId: _i.Mainnet,
  transactionVersion: jn.Mainnet,
  peerNetworkId: Zo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: $n.MainnetSingleSig,
    multiSig: $n.MainnetMultiSig
  },
  client: { baseUrl: Ph }
}, _c = {
  chainId: _i.Testnet,
  transactionVersion: jn.Testnet,
  peerNetworkId: Zo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: $n.TestnetSingleSig,
    multiSig: $n.TestnetMultiSig
  },
  client: { baseUrl: Hh }
}, Ho = {
  ..._c,
  addressVersion: { ..._c.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Oh }
}, Fm = {
  ...Ho,
  addressVersion: { ...Ho.addressVersion },
  client: { ...Ho.client }
};
function jm(t) {
  switch (t) {
    case "mainnet":
      return R0;
    case "testnet":
      return _c;
    case "devnet":
      return Ho;
    case "mocknet":
      return Fm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function G0(t) {
  return typeof t == "string" ? jm(t) : t;
}
var $f;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})($f || ($f = {}));
var vf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(vf || (vf = {}));
var sn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(sn || (sn = {}));
const ec = ["onChainOnly", "offChainOnly", "any"];
ec[0] + "", sn.OnChainOnly, ec[1] + "", sn.OffChainOnly, ec[2] + "", sn.Any, sn.OnChainOnly + "", sn.OnChainOnly, sn.OffChainOnly + "", sn.OffChainOnly, sn.Any + "", sn.Any;
var If;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(If || (If = {}));
var kf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(kf || (kf = {}));
var Lf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Lf || (Lf = {}));
var Dn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Dn || (Dn = {}));
var Cf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Cf || (Cf = {}));
var Bf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Bf || (Bf = {}));
var Tf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Tf || (Tf = {}));
var Mf;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Mf || (Mf = {}));
var _f;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(_f || (_f = {}));
var Nf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Nf || (Nf = {}));
var Uf;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Uf || (Uf = {}));
var Pf;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Pf || (Pf = {}));
var Hf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Hf || (Hf = {}));
function Nc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function zm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function K0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Rm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Nc(t.outputLen), Nc(t.blockLen);
}
function Gm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Km(t, e) {
  K0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Gr = {
  number: Nc,
  bool: zm,
  bytes: K0,
  hash: Rm,
  exists: Gm,
  output: Km
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const nc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), wn = (t, e) => t << 32 - e | t >>> e, Vm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Vm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Wm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Gl(t) {
  if (typeof t == "string" && (t = Wm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let V0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ss(t) {
  const e = (r) => t().update(Gl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let W0 = class extends V0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Gr.hash(e);
    const r = Gl(n);
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
    return Gr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Gr.exists(this), Gr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const q0 = (t, e, n) => new W0(t, e).update(n).digest();
q0.create = (t, e) => new W0(t, e);
function qm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Kl = class extends V0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = nc(this.buffer);
  }
  update(e) {
    Gr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Gl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = nc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Gr.exists(this), Gr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    qm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = nc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const Xm = (t, e, n) => t & e ^ ~t & n, Ym = (t, e, n) => t & e ^ t & n ^ e & n, Zm = new Uint32Array([
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
]), or = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ar = new Uint32Array(64);
let X0 = class extends Kl {
  constructor() {
    super(64, 32, 8, !1), this.A = or[0] | 0, this.B = or[1] | 0, this.C = or[2] | 0, this.D = or[3] | 0, this.E = or[4] | 0, this.F = or[5] | 0, this.G = or[6] | 0, this.H = or[7] | 0;
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
      ar[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ar[l - 15], h = ar[l - 2], b = wn(g, 7) ^ wn(g, 18) ^ g >>> 3, m = wn(h, 17) ^ wn(h, 19) ^ h >>> 10;
      ar[l] = m + ar[l - 7] + b + ar[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = wn(a, 6) ^ wn(a, 11) ^ wn(a, 25), h = d + g + Xm(a, c, f) + Zm[l] + ar[l] | 0, m = (wn(r, 2) ^ wn(r, 13) ^ wn(r, 22)) + Ym(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    ar.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Qm = class extends X0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Y0 = Ss(() => new X0());
Ss(() => new Qm());
var Es = {}, Vl = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Xi;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], f = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (f < 4) {
        const b = n.indexOf(o[h]) >> f;
        let m = 0;
        h !== 0 && (m = n.indexOf(o[h - 1]));
        const L = 1 + f, S = m % (1 << L) << 5 - L, T = t.c32[b + S];
        f = L, c.unshift(T);
      } else
        f = 0;
    let d = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let h = 0; h < g; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let b = 0; b < h; b++)
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
    const c = o.match(`^${t.c32[0]}*`), f = c ? c[0].length : 0;
    let d = [], l = 0, g = 0;
    for (let m = o.length - 1; m >= 0; m--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const S = (t.c32.indexOf(o[m]) << g) + l, T = n[S % 16];
      if (g += 1, l = S >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(T);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let m = 0; m < d.length && d[m] === "0"; m++)
      h++;
    d = d.slice(h - h % 2);
    let b = d.join("");
    for (let m = 0; m < f; m++)
      b = `00${b}`;
    if (a) {
      const m = a * 2 - b.length;
      for (let L = 0; L < m; L += 2)
        b = `00${b}`;
    }
    return b;
  }
  t.c32decode = i;
})(Vl);
var rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
rs.c32checkDecode = rs.c32checkEncode = void 0;
const Of = Ea, Df = Xi, ki = Vl;
function Z0(t) {
  const e = (0, Of.sha256)((0, Of.sha256)((0, Df.hexToBytes)(t)));
  return (0, Df.bytesToHex)(e.slice(0, 4));
}
function Jm(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Z0(`${n}${e}`), s = (0, ki.c32encode)(`${e}${r}`);
  return `${ki.c32[t]}${s}`;
}
rs.c32checkEncode = Jm;
function t2(t) {
  t = (0, ki.c32normalize)(t);
  const e = (0, ki.c32decode)(t.slice(1)), n = t[0], r = ki.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Z0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
rs.c32checkDecode = t2;
var Q0 = {}, ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
ti.decode = ti.encode = void 0;
const Qo = Ea, Ff = Xi, J0 = o0, tp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function e2(t, e = "00") {
  const n = typeof t == "string" ? (0, Ff.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ff.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Qo.sha256)((0, Qo.sha256)(new Uint8Array([...r, ...n])));
  return J0(tp).encode([...r, ...n, ...s.slice(0, 4)]);
}
ti.encode = e2;
function n2(t) {
  const e = J0(tp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Qo.sha256)((0, Qo.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ti.decode = n2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = rs, n = ti, r = Xi;
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
    const g = n.decode(d), h = (0, r.bytesToHex)(g.data), b = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let m;
    return l < 0 ? (m = b, s[b] !== void 0 && (m = s[b])) : m = l, o(m, h);
  }
  t.b58ToC32 = c;
  function f(d, l = -1) {
    const g = a(d), h = g[0], b = g[1];
    let m;
    l < 0 ? (m = h, i[h] !== void 0 && (m = i[h])) : m = l;
    let L = m.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(b, L);
  }
  t.c32ToB58 = f;
})(Q0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Vl;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = rs;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Q0;
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
})(Es);
function r2(t, e) {
  switch (e = G0(e ?? R0), t) {
    case Dn.P2PKH:
      switch (e.transactionVersion) {
        case jn.Mainnet:
          return $n.MainnetSingleSig;
        case jn.Testnet:
          return $n.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Dn.P2SH:
    case Dn.P2SHNonSequential:
    case Dn.P2WPKH:
    case Dn.P2WSH:
    case Dn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case jn.Mainnet:
          return $n.MainnetMultiSig;
        case jn.Testnet:
          return $n.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const s2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ep = Uint8Array.from({ length: 16 }, (t, e) => e), i2 = ep.map((t) => (9 * t + 5) % 16);
let Wl = [ep], ql = [i2];
for (let t = 0; t < 4; t++)
  for (let e of [Wl, ql])
    e.push(e[t].map((n) => s2[n]));
const np = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), o2 = Wl.map((t, e) => t.map((n) => np[e][n])), a2 = ql.map((t, e) => t.map((n) => np[e][n])), c2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), l2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), po = (t, e) => t << e | t >>> 32 - e;
function jf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const go = new Uint32Array(16);
let u2 = class extends Kl {
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
      go[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, m = c2[h], L = l2[h], S = Wl[h], T = ql[h], w = o2[h], B = a2[h];
      for (let I = 0; I < 16; I++) {
        const H = po(r + jf(h, i, a, f) + go[S[I]] + m, w[I]) + l | 0;
        r = l, l = f, f = po(a, 10) | 0, a = i, i = H;
      }
      for (let I = 0; I < 16; I++) {
        const H = po(s + jf(b, o, c, d) + go[T[I]] + L, B[I]) + g | 0;
        s = g, g = d, d = po(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    go.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const f2 = Ss(() => new u2()), yo = BigInt(2 ** 32 - 1), Uc = BigInt(32);
function rp(t, e = !1) {
  return e ? { h: Number(t & yo), l: Number(t >> Uc & yo) } : { h: Number(t >> Uc & yo) | 0, l: Number(t & yo) | 0 };
}
function d2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = rp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const h2 = (t, e) => BigInt(t >>> 0) << Uc | BigInt(e >>> 0), p2 = (t, e, n) => t >>> n, g2 = (t, e, n) => t << 32 - n | e >>> n, y2 = (t, e, n) => t >>> n | e << 32 - n, w2 = (t, e, n) => t << 32 - n | e >>> n, b2 = (t, e, n) => t << 64 - n | e >>> n - 32, m2 = (t, e, n) => t >>> n - 32 | e << 64 - n, x2 = (t, e) => e, S2 = (t, e) => t, E2 = (t, e, n) => t << n | e >>> 32 - n, A2 = (t, e, n) => e << n | t >>> 32 - n, $2 = (t, e, n) => e << n - 32 | t >>> 64 - n, v2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function I2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const k2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), L2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, C2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), B2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, T2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), M2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, wt = {
  fromBig: rp,
  split: d2,
  toBig: h2,
  shrSH: p2,
  shrSL: g2,
  rotrSH: y2,
  rotrSL: w2,
  rotrBH: b2,
  rotrBL: m2,
  rotr32H: x2,
  rotr32L: S2,
  rotlSH: E2,
  rotlSL: A2,
  rotlBH: $2,
  rotlBL: v2,
  add: I2,
  add3L: k2,
  add3H: L2,
  add4L: C2,
  add4H: B2,
  add5H: M2,
  add5L: T2
}, [_2, N2] = wt.split([
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
].map((t) => BigInt(t))), cr = new Uint32Array(80), lr = new Uint32Array(80);
let va = class extends Kl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      cr[w] = e.getUint32(n), lr[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const B = cr[w - 15] | 0, I = lr[w - 15] | 0, H = wt.rotrSH(B, I, 1) ^ wt.rotrSH(B, I, 8) ^ wt.shrSH(B, I, 7), Z = wt.rotrSL(B, I, 1) ^ wt.rotrSL(B, I, 8) ^ wt.shrSL(B, I, 7), F = cr[w - 2] | 0, q = lr[w - 2] | 0, x = wt.rotrSH(F, q, 19) ^ wt.rotrBH(F, q, 61) ^ wt.shrSH(F, q, 6), $ = wt.rotrSL(F, q, 19) ^ wt.rotrBL(F, q, 61) ^ wt.shrSL(F, q, 6), O = wt.add4L(Z, $, lr[w - 7], lr[w - 16]), X = wt.add4H(O, H, x, cr[w - 7], cr[w - 16]);
      cr[w] = X | 0, lr[w] = O | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: m, Gl: L, Hh: S, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const B = wt.rotrSH(l, g, 14) ^ wt.rotrSH(l, g, 18) ^ wt.rotrBH(l, g, 41), I = wt.rotrSL(l, g, 14) ^ wt.rotrSL(l, g, 18) ^ wt.rotrBL(l, g, 41), H = l & h ^ ~l & m, Z = g & b ^ ~g & L, F = wt.add5L(T, I, Z, N2[w], lr[w]), q = wt.add5H(F, S, B, H, _2[w], cr[w]), x = F | 0, $ = wt.rotrSH(r, s, 28) ^ wt.rotrBH(r, s, 34) ^ wt.rotrBH(r, s, 39), O = wt.rotrSL(r, s, 28) ^ wt.rotrBL(r, s, 34) ^ wt.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, st = s & o ^ s & c ^ o & c;
      S = m | 0, T = L | 0, m = h | 0, L = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = wt.add(f | 0, d | 0, q | 0, x | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = wt.add3L(x, O, st);
      r = wt.add3H(z, q, $, X), s = z | 0;
    }
    ({ h: r, l: s } = wt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = wt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = wt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = wt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = wt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = wt.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: m, l: L } = wt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: S, l: T } = wt.add(this.Hh | 0, this.Hl | 0, S | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, b, m, L, S, T);
  }
  roundClean() {
    cr.fill(0), lr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, U2 = class extends va {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, P2 = class extends va {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, H2 = class extends va {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ss(() => new va());
Ss(() => new U2());
Ss(() => new P2());
Ss(() => new H2());
var Jo = { exports: {} };
Jo.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", f = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", b = "[object Object]", m = "[object Promise]", L = "[object RegExp]", S = "[object Set]", T = "[object String]", w = "[object Symbol]", B = "[object WeakMap]", I = "[object ArrayBuffer]", H = "[object DataView]", Z = "[object Float32Array]", F = "[object Float64Array]", q = "[object Int8Array]", x = "[object Int16Array]", $ = "[object Int32Array]", O = "[object Uint8Array]", X = "[object Uint8ClampedArray]", st = "[object Uint16Array]", z = "[object Uint32Array]", Nt = /[\\^$.*+?()[\]{}|]/g, ae = /\w*$/, ne = /^\[object .+?Constructor\]$/, A = /^(?:0|[1-9]\d*)$/, N = {};
  N[i] = N[o] = N[I] = N[H] = N[a] = N[c] = N[Z] = N[F] = N[q] = N[x] = N[$] = N[g] = N[h] = N[b] = N[L] = N[S] = N[T] = N[w] = N[O] = N[X] = N[st] = N[z] = !0, N[f] = N[d] = N[B] = !1;
  var pt = typeof Ie == "object" && Ie && Ie.Object === Object && Ie, rt = typeof self == "object" && self && self.Object === Object && self, ct = pt || rt || Function("return this")(), Lt = e && !e.nodeType && e, Wt = Lt && !0 && t && !t.nodeType && t, Gt = Wt && Wt.exports === Lt;
  function Ot(p, v) {
    return p.set(v[0], v[1]), p;
  }
  function Ut(p, v) {
    return p.add(v), p;
  }
  function tn(p, v) {
    for (var _ = -1, tt = p ? p.length : 0; ++_ < tt && v(p[_], _, p) !== !1; )
      ;
    return p;
  }
  function dn(p, v) {
    for (var _ = -1, tt = v.length, pe = p.length; ++_ < tt; )
      p[pe + _] = v[_];
    return p;
  }
  function M(p, v, _, tt) {
    for (var pe = -1, Te = p ? p.length : 0; ++pe < Te; )
      _ = v(_, p[pe], pe, p);
    return _;
  }
  function R(p, v) {
    for (var _ = -1, tt = Array(p); ++_ < p; )
      tt[_] = v(_);
    return tt;
  }
  function D(p, v) {
    return p == null ? void 0 : p[v];
  }
  function it(p) {
    var v = !1;
    if (p != null && typeof p.toString != "function")
      try {
        v = !!(p + "");
      } catch {
      }
    return v;
  }
  function lt(p) {
    var v = -1, _ = Array(p.size);
    return p.forEach(function(tt, pe) {
      _[++v] = [pe, tt];
    }), _;
  }
  function gt(p, v) {
    return function(_) {
      return p(v(_));
    };
  }
  function Kt(p) {
    var v = -1, _ = Array(p.size);
    return p.forEach(function(tt) {
      _[++v] = tt;
    }), _;
  }
  var Bt = Array.prototype, de = Function.prototype, ce = Object.prototype, le = ct["__core-js_shared__"], u = function() {
    var p = /[^.]+$/.exec(le && le.keys && le.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), E = de.toString, k = ce.hasOwnProperty, P = ce.toString, J = RegExp(
    "^" + E.call(k).replace(Nt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ft = Gt ? ct.Buffer : void 0, Dt = ct.Symbol, _t = ct.Uint8Array, Pe = gt(Object.getPrototypeOf, Object), ks = Object.create, Nr = ce.propertyIsEnumerable, Se = Bt.splice, we = Object.getOwnPropertySymbols, Pt = ft ? ft.isBuffer : void 0, he = gt(Object.keys, Object), ut = Bs(ct, "DataView"), vt = Bs(ct, "Map"), Vt = Bs(ct, "Promise"), Ee = Bs(ct, "Set"), en = Bs(ct, "WeakMap"), Le = Bs(Object, "create"), Vn = Or(ut), _n = Or(vt), Ur = Or(Vt), yi = Or(Ee), Ls = Or(en), Pr = Dt ? Dt.prototype : void 0, He = Pr ? Pr.valueOf : void 0;
  function Oe(p) {
    var v = -1, _ = p ? p.length : 0;
    for (this.clear(); ++v < _; ) {
      var tt = p[v];
      this.set(tt[0], tt[1]);
    }
  }
  function Cs() {
    this.__data__ = Le ? Le(null) : {};
  }
  function Wn(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function qn(p) {
    var v = this.__data__;
    if (Le) {
      var _ = v[p];
      return _ === r ? void 0 : _;
    }
    return k.call(v, p) ? v[p] : void 0;
  }
  function Xn(p) {
    var v = this.__data__;
    return Le ? v[p] !== void 0 : k.call(v, p);
  }
  function Yn(p, v) {
    var _ = this.__data__;
    return _[p] = Le && v === void 0 ? r : v, this;
  }
  Oe.prototype.clear = Cs, Oe.prototype.delete = Wn, Oe.prototype.get = qn, Oe.prototype.has = Xn, Oe.prototype.set = Yn;
  function Ce(p) {
    var v = -1, _ = p ? p.length : 0;
    for (this.clear(); ++v < _; ) {
      var tt = p[v];
      this.set(tt[0], tt[1]);
    }
  }
  function j() {
    this.__data__ = [];
  }
  function Y(p) {
    var v = this.__data__, _ = at(v, p);
    if (_ < 0)
      return !1;
    var tt = v.length - 1;
    return _ == tt ? v.pop() : Se.call(v, _, 1), !0;
  }
  function ue(p) {
    var v = this.__data__, _ = at(v, p);
    return _ < 0 ? void 0 : v[_][1];
  }
  function be(p) {
    return at(this.__data__, p) > -1;
  }
  function Zn(p, v) {
    var _ = this.__data__, tt = at(_, p);
    return tt < 0 ? _.push([p, v]) : _[tt][1] = v, this;
  }
  Ce.prototype.clear = j, Ce.prototype.delete = Y, Ce.prototype.get = ue, Ce.prototype.has = be, Ce.prototype.set = Zn;
  function nn(p) {
    var v = -1, _ = p ? p.length : 0;
    for (this.clear(); ++v < _; ) {
      var tt = p[v];
      this.set(tt[0], tt[1]);
    }
  }
  function Qn() {
    this.__data__ = {
      hash: new Oe(),
      map: new (vt || Ce)(),
      string: new Oe()
    };
  }
  function ja(p) {
    return to(this, p).delete(p);
  }
  function wi(p) {
    return to(this, p).get(p);
  }
  function za(p) {
    return to(this, p).has(p);
  }
  function Ra(p, v) {
    return to(this, p).set(p, v), this;
  }
  nn.prototype.clear = Qn, nn.prototype.delete = ja, nn.prototype.get = wi, nn.prototype.has = za, nn.prototype.set = Ra;
  function hn(p) {
    this.__data__ = new Ce(p);
  }
  function Ga() {
    this.__data__ = new Ce();
  }
  function y(p) {
    return this.__data__.delete(p);
  }
  function C(p) {
    return this.__data__.get(p);
  }
  function G(p) {
    return this.__data__.has(p);
  }
  function Q(p, v) {
    var _ = this.__data__;
    if (_ instanceof Ce) {
      var tt = _.__data__;
      if (!vt || tt.length < n - 1)
        return tt.push([p, v]), this;
      _ = this.__data__ = new nn(tt);
    }
    return _.set(p, v), this;
  }
  hn.prototype.clear = Ga, hn.prototype.delete = y, hn.prototype.get = C, hn.prototype.has = G, hn.prototype.set = Q;
  function ot(p, v) {
    var _ = Va(p) || My(p) ? R(p.length, String) : [], tt = _.length, pe = !!tt;
    for (var Te in p)
      k.call(p, Te) && !(pe && (Te == "length" || Ly(Te, tt))) && _.push(Te);
    return _;
  }
  function W(p, v, _) {
    var tt = p[v];
    (!(k.call(p, v) && ju(tt, _)) || _ === void 0 && !(v in p)) && (p[v] = _);
  }
  function at(p, v) {
    for (var _ = p.length; _--; )
      if (ju(p[_][0], v))
        return _;
    return -1;
  }
  function $t(p, v) {
    return p && Ou(v, Wa(v), p);
  }
  function zt(p, v, _, tt, pe, Te, Nn) {
    var Me;
    if (tt && (Me = Te ? tt(p, pe, Te, Nn) : tt(p)), Me !== void 0)
      return Me;
    if (!eo(p))
      return p;
    var Gu = Va(p);
    if (Gu) {
      if (Me = vy(p), !v)
        return Ey(p, Me);
    } else {
      var Ts = Hr(p), Ku = Ts == d || Ts == l;
      if (Ny(p))
        return gy(p, v);
      if (Ts == b || Ts == i || Ku && !Te) {
        if (it(p))
          return Te ? p : {};
        if (Me = Iy(Ku ? {} : p), !v)
          return Ay(p, $t(Me, p));
      } else {
        if (!N[Ts])
          return Te ? p : {};
        Me = ky(p, Ts, zt, v);
      }
    }
    Nn || (Nn = new hn());
    var Vu = Nn.get(p);
    if (Vu)
      return Vu;
    if (Nn.set(p, Me), !Gu)
      var Wu = _ ? $y(p) : Wa(p);
    return tn(Wu || p, function(qa, no) {
      Wu && (no = qa, qa = p[no]), W(Me, no, zt(qa, v, _, tt, no, p, Nn));
    }), Me;
  }
  function pn(p) {
    return eo(p) ? ks(p) : {};
  }
  function Be(p, v, _) {
    var tt = v(p);
    return Va(p) ? tt : dn(tt, _(p));
  }
  function De(p) {
    return P.call(p);
  }
  function gn(p) {
    if (!eo(p) || By(p))
      return !1;
    var v = Ru(p) || it(p) ? J : ne;
    return v.test(Or(p));
  }
  function py(p) {
    if (!Fu(p))
      return he(p);
    var v = [];
    for (var _ in Object(p))
      k.call(p, _) && _ != "constructor" && v.push(_);
    return v;
  }
  function gy(p, v) {
    if (v)
      return p.slice();
    var _ = new p.constructor(p.length);
    return p.copy(_), _;
  }
  function Ka(p) {
    var v = new p.constructor(p.byteLength);
    return new _t(v).set(new _t(p)), v;
  }
  function yy(p, v) {
    var _ = v ? Ka(p.buffer) : p.buffer;
    return new p.constructor(_, p.byteOffset, p.byteLength);
  }
  function wy(p, v, _) {
    var tt = v ? _(lt(p), !0) : lt(p);
    return M(tt, Ot, new p.constructor());
  }
  function by(p) {
    var v = new p.constructor(p.source, ae.exec(p));
    return v.lastIndex = p.lastIndex, v;
  }
  function my(p, v, _) {
    var tt = v ? _(Kt(p), !0) : Kt(p);
    return M(tt, Ut, new p.constructor());
  }
  function xy(p) {
    return He ? Object(He.call(p)) : {};
  }
  function Sy(p, v) {
    var _ = v ? Ka(p.buffer) : p.buffer;
    return new p.constructor(_, p.byteOffset, p.length);
  }
  function Ey(p, v) {
    var _ = -1, tt = p.length;
    for (v || (v = Array(tt)); ++_ < tt; )
      v[_] = p[_];
    return v;
  }
  function Ou(p, v, _, tt) {
    _ || (_ = {});
    for (var pe = -1, Te = v.length; ++pe < Te; ) {
      var Nn = v[pe], Me = void 0;
      W(_, Nn, Me === void 0 ? p[Nn] : Me);
    }
    return _;
  }
  function Ay(p, v) {
    return Ou(p, Du(p), v);
  }
  function $y(p) {
    return Be(p, Wa, Du);
  }
  function to(p, v) {
    var _ = p.__data__;
    return Cy(v) ? _[typeof v == "string" ? "string" : "hash"] : _.map;
  }
  function Bs(p, v) {
    var _ = D(p, v);
    return gn(_) ? _ : void 0;
  }
  var Du = we ? gt(we, Object) : Hy, Hr = De;
  (ut && Hr(new ut(new ArrayBuffer(1))) != H || vt && Hr(new vt()) != g || Vt && Hr(Vt.resolve()) != m || Ee && Hr(new Ee()) != S || en && Hr(new en()) != B) && (Hr = function(p) {
    var v = P.call(p), _ = v == b ? p.constructor : void 0, tt = _ ? Or(_) : void 0;
    if (tt)
      switch (tt) {
        case Vn:
          return H;
        case _n:
          return g;
        case Ur:
          return m;
        case yi:
          return S;
        case Ls:
          return B;
      }
    return v;
  });
  function vy(p) {
    var v = p.length, _ = p.constructor(v);
    return v && typeof p[0] == "string" && k.call(p, "index") && (_.index = p.index, _.input = p.input), _;
  }
  function Iy(p) {
    return typeof p.constructor == "function" && !Fu(p) ? pn(Pe(p)) : {};
  }
  function ky(p, v, _, tt) {
    var pe = p.constructor;
    switch (v) {
      case I:
        return Ka(p);
      case a:
      case c:
        return new pe(+p);
      case H:
        return yy(p, tt);
      case Z:
      case F:
      case q:
      case x:
      case $:
      case O:
      case X:
      case st:
      case z:
        return Sy(p, tt);
      case g:
        return wy(p, tt, _);
      case h:
      case T:
        return new pe(p);
      case L:
        return by(p);
      case S:
        return my(p, tt, _);
      case w:
        return xy(p);
    }
  }
  function Ly(p, v) {
    return v = v ?? s, !!v && (typeof p == "number" || A.test(p)) && p > -1 && p % 1 == 0 && p < v;
  }
  function Cy(p) {
    var v = typeof p;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? p !== "__proto__" : p === null;
  }
  function By(p) {
    return !!u && u in p;
  }
  function Fu(p) {
    var v = p && p.constructor, _ = typeof v == "function" && v.prototype || ce;
    return p === _;
  }
  function Or(p) {
    if (p != null) {
      try {
        return E.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function Ty(p) {
    return zt(p, !0, !0);
  }
  function ju(p, v) {
    return p === v || p !== p && v !== v;
  }
  function My(p) {
    return _y(p) && k.call(p, "callee") && (!Nr.call(p, "callee") || P.call(p) == i);
  }
  var Va = Array.isArray;
  function zu(p) {
    return p != null && Uy(p.length) && !Ru(p);
  }
  function _y(p) {
    return Py(p) && zu(p);
  }
  var Ny = Pt || Oy;
  function Ru(p) {
    var v = eo(p) ? P.call(p) : "";
    return v == d || v == l;
  }
  function Uy(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function eo(p) {
    var v = typeof p;
    return !!p && (v == "object" || v == "function");
  }
  function Py(p) {
    return !!p && typeof p == "object";
  }
  function Wa(p) {
    return zu(p) ? ot(p) : py(p);
  }
  function Hy() {
    return [];
  }
  function Oy() {
    return !1;
  }
  t.exports = Ty;
})(Jo, Jo.exports);
var O2 = Jo.exports;
const sp = /* @__PURE__ */ Bh(O2);
var Pc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Pc || (Pc = {}));
function D2(t, e) {
  return { type: Pc.Address, version: t, hash160: e };
}
function F2(t) {
  return Es.c32address(t.version, t.hash160);
}
const j2 = (t) => f2(Y0(t)), z2 = (t) => nt(j2(t));
ee.hmacSha256Sync = (t, ...e) => {
  const n = q0.create(Y0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function R2(t, e = "mainnet") {
  e = G0(e), t = typeof t == "string" ? Ct(t) : t;
  const n = r2(Dn.P2PKH, e), r = D2(n, z2(t));
  return F2(r);
}
function G2(t, e) {
  const n = ye.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = R2(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new ye.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function K2(t, e = null) {
  let n;
  e ? n = G2(t, e) : n = ye.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const zf = "_blockstackDidCheckEchoReply", V2 = "echoReply", W2 = "authContinuation";
function q2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function X2() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[zf];
  if (typeof e == "boolean")
    return e;
  const n = q2(t.location.search), r = n[V2];
  if (r) {
    t[zf] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[W2];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Hc {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Dh();
    else
      throw new pw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Af(e.sessionOptions) : this.store = new Af() : e ? this.store = new Ef(e.sessionOptions) : this.store = new Ef();
  }
  makeAuthRequestToken(e, n, r, s, i, o = yw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Ac("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Nm(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = _m();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Ll("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (X2())
        return Hs.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Hs.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Dw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ro("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = ye.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Dm(e))
      throw new ro("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Ya(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await xf(s, i.private_key);
          } catch {
            if (Hs.warn("Failed decryption of appPrivateKey, will try to use as given"), !ee.isValidPrivateKey(i.private_key))
              throw new ro("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await xf(s, c);
          } catch {
            Hs.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ro("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = Lw, d;
    Ya(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (f = i.hubUrl), Ya(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: j0(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = i.profile_url;
    if (!l.profile && g) {
      const h = await n(g);
      if (!h.ok)
        l.profile = Object.assign({}, fw);
      else {
        const b = await h.text(), m = JSON.parse(b);
        l.profile = K2(m[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Ac("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), L1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), C1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Hc.prototype.makeAuthRequest = Hc.prototype.makeAuthRequestToken;
const Y2 = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Z2 = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Y2(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Ia(r.id));
  return e.concat(n);
}, Ia = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), ip = "STX_PROVIDER", ss = () => typeof window > "u" ? null : window.localStorage.getItem(ip), Q2 = (t) => {
  typeof window < "u" && window.localStorage.setItem(ip, t);
}, J2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function tx(t, e) {
  const n = {};
  return Object.assign(n, J2, e), await fetch(t, n);
}
function ex(t) {
  let e = tx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function nx(...t) {
  const { fetchLib: e, middlewares: n } = ex(t);
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
var ei;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ei || (ei = {}));
var is;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(is || (is = {}));
var Rf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Rf || (Rf = {}));
const rx = "https://api.mainnet.hiro.so", sx = "https://api.testnet.hiro.so", ix = "http://localhost:3999", ox = ["mainnet", "testnet", "devnet", "mocknet"];
class os {
  constructor(e) {
    this.version = is.Mainnet, this.chainId = ei.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === is.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? nx();
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
os.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Oc();
    case "testnet":
      return new Dc();
    case "devnet":
      return new ax();
    case "mocknet":
      return new op();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${ox.join(", ")}`);
  }
};
os.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : os.fromName(t);
class Oc extends os {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? rx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = is.Mainnet, this.chainId = ei.Mainnet;
  }
}
class Dc extends os {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? sx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = is.Testnet, this.chainId = ei.Testnet;
  }
}
class op extends os {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ix,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = is.Testnet, this.chainId = ei.Testnet;
  }
}
const ax = op;
var as;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(as || (as = {}));
var ta;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ta || (ta = {}));
as.Mainnet;
var cs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(cs || (cs = {}));
var ls;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ls || (ls = {}));
cs.Mainnet;
const cx = {
  chainId: as.Mainnet,
  transactionVersion: cs.Mainnet,
  peerNetworkId: ta.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ls.MainnetSingleSig,
    multiSig: ls.MainnetMultiSig
  },
  client: { baseUrl: Ph }
}, Fc = {
  chainId: as.Testnet,
  transactionVersion: cs.Testnet,
  peerNetworkId: ta.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ls.TestnetSingleSig,
    multiSig: ls.TestnetMultiSig
  },
  client: { baseUrl: Hh }
}, Oo = {
  ...Fc,
  addressVersion: { ...Fc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Oh }
}, lx = {
  ...Oo,
  addressVersion: { ...Oo.addressVersion },
  client: { ...Oo.client }
};
function ux(t) {
  switch (t) {
    case "mainnet":
      return cx;
    case "testnet":
      return Fc;
    case "devnet":
      return Oo;
    case "mocknet":
      return lx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function fx(t) {
  return typeof t == "string" ? ux(t) : t;
}
function dx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Gf = /* @__PURE__ */ new Map();
function ap(t, e) {
  const n = Gf.get(t);
  if (n !== void 0)
    return n(e);
  const r = dx(t);
  return Gf.set(t, r), ap(t, e);
}
let Rt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Ct(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Uw(this.readBytes(4), 0);
  }
  readUInt8() {
    return _w(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Tw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = nt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = nt(n);
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
    if (ap(e, r))
      return r;
    throw n(r);
  }
};
const hx = 128, px = 128, cp = 16, Xr = 32, jc = 80, ka = 65, gx = 32, yx = 64, ea = 34, wx = 1 + 16 * 1024 * 1024, bx = 165, mx = 16, xx = 16, Sx = 20, Ex = xx + 2 + Sx, Ax = Ex + 4, $x = wx + (bx + mx * Ax);
var Mt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Mt || (Mt = {}));
var zc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(zc || (zc = {}));
var je;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(je || (je = {}));
const rc = ["onChainOnly", "offChainOnly", "any"];
rc[0] + "", je.OnChainOnly, rc[1] + "", je.OffChainOnly, rc[2] + "", je.Any, je.OnChainOnly + "", je.OnChainOnly, je.OffChainOnly + "", je.OffChainOnly, je.Any + "", je.Any;
var na;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(na || (na = {}));
var qt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(qt || (qt = {}));
var Jt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Jt || (Jt = {}));
var Ft;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ft || (Ft = {}));
var Zt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Zt || (Zt = {}));
var Li;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Li || (Li = {}));
var Rc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Rc || (Rc = {}));
var Gc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Gc || (Gc = {}));
var ve;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ve || (ve = {}));
var Kf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Kf || (Kf = {}));
var Kc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Kc || (Kc = {}));
var an;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(an || (an = {}));
var Vf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Vf || (Vf = {}));
let La = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Os = class extends La {
  constructor(e) {
    super(e);
  }
}, Ae = class extends La {
  constructor(e) {
    super(e);
  }
}, ra = class extends La {
  constructor(e) {
    super(e);
  }
}, Kr = class extends La {
  constructor(e) {
    super(e);
  }
};
function Vc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function vx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function lp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ix(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vc(t.outputLen), Vc(t.blockLen);
}
function kx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Lx(t, e) {
  lp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Vr = {
  number: Vc,
  bool: vx,
  bytes: lp,
  hash: Ix,
  exists: kx,
  output: Lx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const sc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), bn = (t, e) => t << 32 - e | t >>> e, Cx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Cx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Bx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Xl(t) {
  if (typeof t == "string" && (t = Bx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let up = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function As(t) {
  const e = (r) => t().update(Xl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let fp = class extends up {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Vr.hash(e);
    const r = Xl(n);
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
    return Vr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Vr.exists(this), Vr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const dp = (t, e, n) => new fp(t, e).update(n).digest();
dp.create = (t, e) => new fp(t, e);
function Tx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Yl = class extends up {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = sc(this.buffer);
  }
  update(e) {
    Vr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Xl(e);
    const i = e.length;
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
    Vr.exists(this), Vr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Tx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = sc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const Mx = (t, e, n) => t & e ^ ~t & n, _x = (t, e, n) => t & e ^ t & n ^ e & n, Nx = new Uint32Array([
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
]), ur = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fr = new Uint32Array(64);
let hp = class extends Yl {
  constructor() {
    super(64, 32, 8, !1), this.A = ur[0] | 0, this.B = ur[1] | 0, this.C = ur[2] | 0, this.D = ur[3] | 0, this.E = ur[4] | 0, this.F = ur[5] | 0, this.G = ur[6] | 0, this.H = ur[7] | 0;
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
      fr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = fr[l - 15], h = fr[l - 2], b = bn(g, 7) ^ bn(g, 18) ^ g >>> 3, m = bn(h, 17) ^ bn(h, 19) ^ h >>> 10;
      fr[l] = m + fr[l - 7] + b + fr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = bn(a, 6) ^ bn(a, 11) ^ bn(a, 25), h = d + g + Mx(a, c, f) + Nx[l] + fr[l] | 0, m = (bn(r, 2) ^ bn(r, 13) ^ bn(r, 22)) + _x(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    fr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Ux = class extends hp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Zl = As(() => new hp());
As(() => new Ux());
const Px = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), pp = Uint8Array.from({ length: 16 }, (t, e) => e), Hx = pp.map((t) => (9 * t + 5) % 16);
let Ql = [pp], Jl = [Hx];
for (let t = 0; t < 4; t++)
  for (let e of [Ql, Jl])
    e.push(e[t].map((n) => Px[n]));
const gp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ox = Ql.map((t, e) => t.map((n) => gp[e][n])), Dx = Jl.map((t, e) => t.map((n) => gp[e][n])), Fx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), jx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), wo = (t, e) => t << e | t >>> 32 - e;
function Wf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const bo = new Uint32Array(16);
let zx = class extends Yl {
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
      bo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, m = Fx[h], L = jx[h], S = Ql[h], T = Jl[h], w = Ox[h], B = Dx[h];
      for (let I = 0; I < 16; I++) {
        const H = wo(r + Wf(h, i, a, f) + bo[S[I]] + m, w[I]) + l | 0;
        r = l, l = f, f = wo(a, 10) | 0, a = i, i = H;
      }
      for (let I = 0; I < 16; I++) {
        const H = wo(s + Wf(b, o, c, d) + bo[T[I]] + L, B[I]) + g | 0;
        s = g, g = d, d = wo(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    bo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Rx = As(() => new zx()), mo = BigInt(2 ** 32 - 1), Wc = BigInt(32);
function yp(t, e = !1) {
  return e ? { h: Number(t & mo), l: Number(t >> Wc & mo) } : { h: Number(t >> Wc & mo) | 0, l: Number(t & mo) | 0 };
}
function Gx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = yp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Kx = (t, e) => BigInt(t >>> 0) << Wc | BigInt(e >>> 0), Vx = (t, e, n) => t >>> n, Wx = (t, e, n) => t << 32 - n | e >>> n, qx = (t, e, n) => t >>> n | e << 32 - n, Xx = (t, e, n) => t << 32 - n | e >>> n, Yx = (t, e, n) => t << 64 - n | e >>> n - 32, Zx = (t, e, n) => t >>> n - 32 | e << 64 - n, Qx = (t, e) => e, Jx = (t, e) => t, tS = (t, e, n) => t << n | e >>> 32 - n, eS = (t, e, n) => e << n | t >>> 32 - n, nS = (t, e, n) => e << n - 32 | t >>> 64 - n, rS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function sS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const iS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), oS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, aS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), cS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, lS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), uS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, bt = {
  fromBig: yp,
  split: Gx,
  toBig: Kx,
  shrSH: Vx,
  shrSL: Wx,
  rotrSH: qx,
  rotrSL: Xx,
  rotrBH: Yx,
  rotrBL: Zx,
  rotr32H: Qx,
  rotr32L: Jx,
  rotlSH: tS,
  rotlSL: eS,
  rotlBH: nS,
  rotlBL: rS,
  add: sS,
  add3L: iS,
  add3H: oS,
  add4L: aS,
  add4H: cS,
  add5H: uS,
  add5L: lS
}, [fS, dS] = bt.split([
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
].map((t) => BigInt(t))), dr = new Uint32Array(80), hr = new Uint32Array(80);
let Ca = class extends Yl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      dr[w] = e.getUint32(n), hr[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const B = dr[w - 15] | 0, I = hr[w - 15] | 0, H = bt.rotrSH(B, I, 1) ^ bt.rotrSH(B, I, 8) ^ bt.shrSH(B, I, 7), Z = bt.rotrSL(B, I, 1) ^ bt.rotrSL(B, I, 8) ^ bt.shrSL(B, I, 7), F = dr[w - 2] | 0, q = hr[w - 2] | 0, x = bt.rotrSH(F, q, 19) ^ bt.rotrBH(F, q, 61) ^ bt.shrSH(F, q, 6), $ = bt.rotrSL(F, q, 19) ^ bt.rotrBL(F, q, 61) ^ bt.shrSL(F, q, 6), O = bt.add4L(Z, $, hr[w - 7], hr[w - 16]), X = bt.add4H(O, H, x, dr[w - 7], dr[w - 16]);
      dr[w] = X | 0, hr[w] = O | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: m, Gl: L, Hh: S, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const B = bt.rotrSH(l, g, 14) ^ bt.rotrSH(l, g, 18) ^ bt.rotrBH(l, g, 41), I = bt.rotrSL(l, g, 14) ^ bt.rotrSL(l, g, 18) ^ bt.rotrBL(l, g, 41), H = l & h ^ ~l & m, Z = g & b ^ ~g & L, F = bt.add5L(T, I, Z, dS[w], hr[w]), q = bt.add5H(F, S, B, H, fS[w], dr[w]), x = F | 0, $ = bt.rotrSH(r, s, 28) ^ bt.rotrBH(r, s, 34) ^ bt.rotrBH(r, s, 39), O = bt.rotrSL(r, s, 28) ^ bt.rotrBL(r, s, 34) ^ bt.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, st = s & o ^ s & c ^ o & c;
      S = m | 0, T = L | 0, m = h | 0, L = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = bt.add(f | 0, d | 0, q | 0, x | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = bt.add3L(x, O, st);
      r = bt.add3H(z, q, $, X), s = z | 0;
    }
    ({ h: r, l: s } = bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = bt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = bt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = bt.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: m, l: L } = bt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: S, l: T } = bt.add(this.Hh | 0, this.Hl | 0, S | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, b, m, L, S, T);
  }
  roundClean() {
    dr.fill(0), hr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, hS = class extends Ca {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, pS = class extends Ca {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, gS = class extends Ca {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
As(() => new Ca());
As(() => new hS());
const yS = As(() => new pS());
As(() => new gS());
var It;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(It || (It = {}));
var oe;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(oe || (oe = {}));
function tu(t) {
  return oe[t];
}
const wS = () => ({ type: It.BoolTrue }), bS = () => ({ type: It.BoolFalse }), mS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: It.Buffer, value: nt(t) };
}, qf = BigInt("0xffffffffffffffffffffffffffffffff"), xS = BigInt(0), Xf = BigInt("0x7fffffffffffffffffffffffffffffff"), Yf = BigInt("-170141183460469231731687303715884105728"), SS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = vc(Ct(t))), Ue(t, Uint8Array) && (t = vc(t));
  const e = xe(t);
  if (e > Xf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Xf}`);
  if (e < Yf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Yf}`);
  return { type: It.Int, value: e };
}, ES = (t) => {
  const e = xe(t);
  if (e < xS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > qf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${qf}`);
  return { type: It.UInt, value: e };
};
function AS(t) {
  return { type: It.List, value: t };
}
function wp() {
  return { type: It.OptionalNone };
}
function bp(t) {
  return { type: It.OptionalSome, value: t };
}
var V;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(V || (V = {}));
function $S() {
  return {
    type: V.Address,
    version: ls.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Zf(t) {
  if (t && kp(t, ea))
    throw new Error(`Memo exceeds maximum length of ${ea} bytes`);
  return { type: V.MemoString, content: t };
}
function eu(t, e) {
  return {
    type: V.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function qc(t) {
  if (Ct(t).byteLength != ka)
    throw Error("Invalid signature");
  return {
    type: V.MessageSignature,
    data: t
  };
}
function vS(t, e, n) {
  return typeof t == "string" && (t = jS(t)), typeof n == "string" && (n = Zf(n)), {
    type: V.Payload,
    payloadType: Mt.TokenTransfer,
    recipient: t,
    amount: xe(e),
    memo: n ?? Zf("")
  };
}
function IS(t, e, n, r) {
  return typeof e == "string" && (e = un(e)), typeof n == "string" && (n = un(n)), {
    type: V.Payload,
    payloadType: Mt.ContractCall,
    contractAddress: typeof t == "string" ? _r(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function kS(t) {
  return un(t, 4, 1e5);
}
function Qf(t, e, n) {
  return typeof t == "string" && (t = un(t)), typeof e == "string" && (e = kS(e)), typeof n == "number" ? {
    type: V.Payload,
    payloadType: Mt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: V.Payload,
    payloadType: Mt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function LS() {
  return { type: V.Payload, payloadType: Mt.PoisonMicroblock };
}
function Jf(t, e) {
  if (t.byteLength != Xr)
    throw Error(`Coinbase buffer size must be ${Xr} bytes`);
  return e != null ? {
    type: V.Payload,
    payloadType: Mt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: V.Payload,
    payloadType: Mt.Coinbase,
    coinbaseBytes: t
  };
}
function CS(t, e, n) {
  if (t.byteLength != Xr)
    throw Error(`Coinbase buffer size must be ${Xr} bytes`);
  if (n.byteLength != jc)
    throw Error(`VRF proof buffer size must be ${jc} bytes`);
  return {
    type: V.Payload,
    payloadType: Mt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === It.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function BS(t, e, n, r, s, i, o) {
  return {
    type: V.Payload,
    payloadType: Mt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function un(t, e, n) {
  const r = e || 1, s = n || hx;
  if (kp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: V.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function TS(t, e, n) {
  return {
    type: V.Asset,
    address: _r(t),
    contractName: un(e),
    assetName: un(n)
  };
}
function _r(t) {
  const e = Es.c32addressDecode(t);
  return {
    type: V.Address,
    version: e[0],
    hash160: e[1]
  };
}
function MS(t, e) {
  const n = _r(t), r = un(e);
  return {
    type: V.Principal,
    prefix: ve.Contract,
    address: n,
    contractName: r
  };
}
function _S(t) {
  const e = _r(t);
  return {
    type: V.Principal,
    prefix: ve.Standard,
    address: e
  };
}
function Ds(t, e) {
  return {
    pubKeyEncoding: t,
    type: V.TransactionAuthField,
    contents: e
  };
}
function Hn(t) {
  switch (t.type) {
    case V.Address:
      return Yi(t);
    case V.Principal:
      return mp(t);
    case V.LengthPrefixedString:
      return ri(t);
    case V.MemoString:
      return US(t);
    case V.Asset:
      return Sp(t);
    case V.PostCondition:
      return Ap(t);
    case V.PublicKey:
      return Zc(t);
    case V.LengthPrefixedList:
      return nu(t);
    case V.Payload:
      return $p(t);
    case V.TransactionAuthField:
      return FS(t);
    case V.MessageSignature:
      return ru(t);
  }
}
function Yi(t) {
  const e = [];
  return e.push(Ct(Gi(t.version, 1))), e.push(Ct(t.hash160)), se(e);
}
function ni(t) {
  const e = Ue(t, Rt) ? t : new Rt(t), n = pa(nt(e.readBytes(1))), r = nt(e.readBytes(20));
  return { type: V.Address, version: n, hash160: r };
}
function mp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === ve.Standard || t.prefix === ve.Contract) && e.push(Yi(t.address)), t.prefix === ve.Contract && e.push(ri(t.contractName)), se(e);
}
function NS(t) {
  const e = Ue(t, Rt) ? t : new Rt(t), n = e.readUInt8Enum(ve, (i) => {
    throw new Ae(`Unexpected Principal payload type: ${i}`);
  });
  if (n === ve.Origin)
    return { type: V.Principal, prefix: n };
  const r = ni(e);
  if (n === ve.Standard)
    return { type: V.Principal, prefix: n, address: r };
  const s = Ze(e);
  return {
    type: V.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function ri(t) {
  const e = [], n = bs(t.content), r = n.byteLength;
  return e.push(Ct(Gi(r, t.lengthPrefixBytes))), e.push(n), se(e);
}
function Ze(t, e, n) {
  e = e || 1;
  const r = Ue(t, Rt) ? t : new Rt(t), s = pa(nt(r.readBytes(e))), i = Ki(r.readBytes(s));
  return un(i, e, n ?? 128);
}
function US(t) {
  const e = [], n = bs(t.content), r = l3(nt(n), ea * 2);
  return e.push(Ct(r)), se(e);
}
function xp(t) {
  const e = Ue(t, Rt) ? t : new Rt(t);
  let n = Ki(e.readBytes(ea));
  return n = n.replace(/\u0000*$/, ""), { type: V.MemoString, content: n };
}
function Sp(t) {
  const e = [];
  return e.push(Yi(t.address)), e.push(ri(t.contractName)), e.push(ri(t.assetName)), se(e);
}
function Xc(t) {
  const e = Ue(t, Rt) ? t : new Rt(t);
  return {
    type: V.Asset,
    address: ni(e),
    contractName: Ze(e),
    assetName: Ze(e)
  };
}
function nu(t) {
  const e = t.values, n = [];
  n.push(Ct(Gi(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Hn(r));
  return se(n);
}
function Ep(t, e, n) {
  const r = Ue(t, Rt) ? t : new Rt(t), s = pa(nt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case V.Address:
        i.push(ni(r));
        break;
      case V.LengthPrefixedString:
        i.push(Ze(r));
        break;
      case V.MemoString:
        i.push(xp(r));
        break;
      case V.Asset:
        i.push(Xc(r));
        break;
      case V.PostCondition:
        i.push(HS(r));
        break;
      case V.PublicKey:
        i.push(Qc(r));
        break;
      case V.TransactionAuthField:
        i.push(DS(r));
        break;
    }
  return eu(i, n);
}
function PS(t) {
  return nt(Ap(t));
}
function Ap(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(mp(t.principal)), (t.conditionType === qt.Fungible || t.conditionType === qt.NonFungible) && e.push(Sp(t.asset)), t.conditionType === qt.NonFungible && e.push(vn(t.assetName)), e.push(t.conditionCode), t.conditionType === qt.STX || t.conditionType === qt.Fungible || t.conditionType === qt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Os("The post-condition amount may not be larger than 8 bytes");
    e.push(Br(t.amount, 8));
  }
  return se(e);
}
function HS(t) {
  const e = Ue(t, Rt) ? t : new Rt(t), n = e.readUInt8Enum(qt, (a) => {
    throw new Ae(`Could not read ${a} as PostConditionType`);
  }), r = NS(e);
  let s, i, o;
  switch (n) {
    case qt.STX:
      return s = e.readUInt8Enum(Li, (c) => {
        throw new Ae(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${nt(e.readBytes(8))}`), {
        type: V.PostCondition,
        conditionType: qt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case qt.Fungible:
      return i = Xc(e), s = e.readUInt8Enum(Li, (c) => {
        throw new Ae(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${nt(e.readBytes(8))}`), {
        type: V.PostCondition,
        conditionType: qt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case qt.NonFungible:
      i = Xc(e);
      const a = An(e);
      return s = e.readUInt8Enum(Rc, (c) => {
        throw new Ae(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: V.PostCondition,
        conditionType: qt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case qt.Staking:
      return s = e.readUInt8Enum(Li, (c) => {
        throw new Ae(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${nt(e.readBytes(8))}`), {
        type: V.PostCondition,
        conditionType: qt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case qt.PoX: {
      const c = e.readUInt8Enum(Gc, (f) => {
        throw new Ae(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: V.PostCondition,
        conditionType: qt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function $p(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Mt.TokenTransfer:
      e.push(vn(t.recipient)), e.push(Br(t.amount, 8)), e.push(Hn(t.memo));
      break;
    case Mt.ContractCall:
      e.push(Hn(t.contractAddress)), e.push(Hn(t.contractName)), e.push(Hn(t.functionName));
      const n = new Uint8Array(4);
      Jr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(vn(r));
      });
      break;
    case Mt.SmartContract:
      e.push(Hn(t.contractName)), e.push(Hn(t.codeBody));
      break;
    case Mt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Hn(t.contractName)), e.push(Hn(t.codeBody));
      break;
    case Mt.PoisonMicroblock:
      break;
    case Mt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Mt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(vn(t.recipient));
      break;
    case Mt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(vn(t.recipient ? bp(t.recipient) : wp())), e.push(t.vrfProof);
      break;
    case Mt.TenureChange:
      e.push(Ct(t.tenureHash)), e.push(Ct(t.previousTenureHash)), e.push(Ct(t.burnViewHash)), e.push(Ct(t.previousTenureEnd)), e.push(Jr(new Uint8Array(4), t.previousTenureBlocks)), e.push(Nw(new Uint8Array(1), t.cause)), e.push(Ct(t.publicKeyHash));
      break;
  }
  return se(e);
}
function OS(t) {
  const e = Ue(t, Rt) ? t : new Rt(t);
  switch (e.readUInt8Enum(Mt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Mt.TokenTransfer:
      const r = An(e), s = xe(e.readBytes(8)), i = xp(e);
      return vS(r, s, i);
    case Mt.ContractCall:
      const o = ni(e), a = Ze(e), c = Ze(e), f = [], d = e.readUInt32BE();
      for (let B = 0; B < d; B++) {
        const I = An(e);
        f.push(I);
      }
      return IS(o, a, c, f);
    case Mt.SmartContract:
      const l = Ze(e), g = Ze(e, 4, 1e5);
      return Qf(l, g);
    case Mt.VersionedSmartContract: {
      const B = e.readUInt8Enum(zc, (Z) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Z}`);
      }), I = Ze(e), H = Ze(e, 4, $x);
      return Qf(I, H, B);
    }
    case Mt.PoisonMicroblock:
      return LS();
    case Mt.Coinbase: {
      const B = e.readBytes(Xr);
      return Jf(B);
    }
    case Mt.CoinbaseToAltRecipient: {
      const B = e.readBytes(Xr), I = An(e);
      return Jf(B, I);
    }
    case Mt.NakamotoCoinbase: {
      const B = e.readBytes(Xr), I = An(e), H = e.readBytes(jc);
      return CS(B, I, H);
    }
    case Mt.TenureChange:
      const h = nt(e.readBytes(20)), b = nt(e.readBytes(20)), m = nt(e.readBytes(20)), L = nt(e.readBytes(32)), S = e.readUInt32BE(), T = e.readUInt8Enum(Kc, (B) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${B}`);
      }), w = nt(e.readBytes(20));
      return BS(h, b, m, L, S, T, w);
  }
}
function Yc(t) {
  const e = Ue(t, Rt) ? t : new Rt(t);
  return qc(nt(e.readBytes(ka)));
}
function DS(t) {
  const e = Ue(t, Rt) ? t : new Rt(t), n = e.readUInt8Enum(an, (r) => {
    throw new Ae(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case an.PublicKeyCompressed:
      return Ds(Zt.Compressed, Qc(e));
    case an.PublicKeyUncompressed:
      return Ds(Zt.Uncompressed, fi(x3(Qc(e).data)));
    case an.SignatureCompressed:
      return Ds(Zt.Compressed, Yc(e));
    case an.SignatureUncompressed:
      return Ds(Zt.Uncompressed, Yc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function ru(t) {
  return Ct(t.data);
}
function FS(t) {
  const e = [];
  switch (t.contents.type) {
    case V.PublicKey:
      e.push(t.pubKeyEncoding === Zt.Compressed ? an.PublicKeyCompressed : an.PublicKeyUncompressed), e.push(Ct(m3(t.contents.data)));
      break;
    case V.MessageSignature:
      e.push(t.pubKeyEncoding === Zt.Compressed ? an.SignatureCompressed : an.SignatureUncompressed), e.push(ru(t.contents));
      break;
  }
  return se(e);
}
function Zc(t) {
  return t.data.slice();
}
function Qc(t) {
  const e = Ue(t, Rt) ? t : new Rt(t), n = e.readUInt8(), r = n === 4 ? yx : gx;
  return fi(se([n, e.readBytes(r)]));
}
function su(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Ft.P2PKH || e === Ft.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Ft.P2WPKH || e === Ft.P2WSH || e === Ft.P2WSHNonSequential) && !r.map((s) => s.data).every(di))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Ft.P2PKH:
      return xo(t, u3(r[0].data));
    case Ft.P2WPKH:
      return xo(t, f3(r[0].data));
    case Ft.P2SH:
    case Ft.P2SHNonSequential:
      return xo(t, d3(n, r.map(Zc)));
    case Ft.P2WSH:
    case Ft.P2WSHNonSequential:
      return xo(t, h3(n, r.map(Zc)));
  }
}
function xo(t, e) {
  return { type: V.Address, version: t, hash160: e };
}
function iu(t) {
  return Es.c32address(t.version, t.hash160);
}
function td(t) {
  const [e, n, r] = t.split(/\.|::/);
  return TS(e, n, r);
}
function Si(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return MS(e, n);
  } else
    return _S(t);
}
function jS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return GS(e, n);
  } else
    return zS(t);
}
function zS(t) {
  const e = _r(t);
  return { type: It.PrincipalStandard, value: iu(e) };
}
function RS(t) {
  return { type: It.PrincipalStandard, value: iu(t) };
}
function GS(t, e) {
  const n = _r(t), r = un(e);
  return vp(n, r);
}
function vp(t, e) {
  if (bs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: It.PrincipalContract,
    value: `${iu(t)}.${e.content}`
  };
}
function KS(t) {
  return { type: It.ResponseErr, value: t };
}
function VS(t) {
  return { type: It.ResponseOk, value: t };
}
const WS = (t) => ({ type: It.StringASCII, value: t }), qS = (t) => ({ type: It.StringUTF8, value: t });
function XS(t) {
  for (const e in t)
    if (!p3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: It.Tuple, value: t };
}
function An(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Rt(Ct(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Rt(t) : e = t;
  switch (e.readUInt8Enum(oe, (r) => {
    throw new Ae(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case oe.int:
      return SS(vc(e.readBytes(16)));
    case oe.uint:
      return ES(e.readBytes(16));
    case oe.buffer:
      const r = e.readUInt32BE();
      return mS(e.readBytes(r));
    case oe.true:
      return wS();
    case oe.false:
      return bS();
    case oe.address:
      const s = ni(e);
      return RS(s);
    case oe.contract:
      const i = ni(e), o = Ze(e);
      return vp(i, o);
    case oe.ok:
      return VS(An(e));
    case oe.err:
      return KS(An(e));
    case oe.none:
      return wp();
    case oe.some:
      return bp(An(e));
    case oe.list:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(An(e));
      return AS(c);
    case oe.tuple:
      const f = e.readUInt32BE(), d = {};
      for (let m = 0; m < f; m++) {
        const L = Ze(e).content;
        if (L === void 0)
          throw new Ae('"content" is undefined');
        d[L] = An(e);
      }
      return XS(d);
    case oe.ascii:
      const l = e.readUInt32BE(), g = Iw(e.readBytes(l));
      return WS(g);
    case oe.utf8:
      const h = e.readUInt32BE(), b = Ki(e.readBytes(h));
      return qS(b);
    default:
      throw new Ae("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Bn(t, e) {
  return se([tu(t), e]);
}
function YS(t) {
  return new Uint8Array([tu(t.type)]);
}
function ZS(t) {
  return t.type === It.OptionalNone ? new Uint8Array([tu(t.type)]) : Bn(t.type, vn(t.value));
}
function QS(t) {
  const e = new Uint8Array(4);
  return Jr(e, Math.ceil(t.value.length / 2), 0), Bn(t.type, Ln(e, Ct(t.value)));
}
function JS(t) {
  const e = Cl(Sw(BigInt(t.value), BigInt(px)), cp);
  return Bn(t.type, e);
}
function t3(t) {
  const e = Cl(BigInt(t.value), cp);
  return Bn(t.type, e);
}
function e3(t) {
  return Bn(t.type, Yi(_r(t.value)));
}
function n3(t) {
  const [e, n] = g3(t.value);
  return Bn(t.type, Ln(Yi(_r(e)), ri(un(n))));
}
function r3(t) {
  return Bn(t.type, vn(t.value));
}
function s3(t) {
  const e = [], n = new Uint8Array(4);
  Jr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = vn(r);
    e.push(s);
  }
  return Bn(t.type, se(e));
}
function i3(t) {
  const e = [], n = new Uint8Array(4);
  Jr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = un(s);
    e.push(ri(i));
    const o = vn(t.value[s]);
    e.push(o);
  }
  return Bn(t.type, se(e));
}
function Ip(t, e) {
  const n = [], r = e == "ascii" ? vw(t.value) : bs(t.value), s = new Uint8Array(4);
  return Jr(s, r.length, 0), n.push(s), n.push(r), Bn(t.type, se(n));
}
function o3(t) {
  return Ip(t, "ascii");
}
function a3(t) {
  return Ip(t, "utf8");
}
function ed(t) {
  return nt(vn(t));
}
function vn(t) {
  switch (t.type) {
    case It.BoolTrue:
    case It.BoolFalse:
      return YS(t);
    case It.OptionalNone:
    case It.OptionalSome:
      return ZS(t);
    case It.Buffer:
      return QS(t);
    case It.UInt:
      return t3(t);
    case It.Int:
      return JS(t);
    case It.PrincipalStandard:
      return e3(t);
    case It.PrincipalContract:
      return n3(t);
    case It.ResponseOk:
    case It.ResponseErr:
      return r3(t);
    case It.List:
      return s3(t);
    case It.Tuple:
      return i3(t);
    case It.StringASCII:
      return o3(t);
    case It.StringUTF8:
      return a3(t);
    default:
      throw new Os("Unable to serialize. Invalid Clarity Value.");
  }
}
const c3 = (t) => t.length % 2 ? `0${t}` : t, l3 = (t, e) => t.padEnd(e, "0"), kp = (t, e) => t ? bs(t).length > e : !1;
function Jc(t) {
  return sp(t);
}
const Ni = (t) => Rx(Zl(t)), ou = (t) => nt(yS(t)), u3 = (t) => nt(Ni(t)), f3 = (t) => {
  const e = Ni(t), n = Ln(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ni(n);
  return nt(r);
}, d3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = se(n), s = Ni(r);
  return nt(s);
}, h3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = se(n), s = Zl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = se(i), a = Ni(o);
  return nt(a);
};
function p3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function g3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
ee.hmacSha256Sync = (t, ...e) => {
  const n = dp.create(Zl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function fi(t) {
  return t = typeof t == "string" ? Ct(t) : t, {
    type: V.PublicKey,
    data: t
  };
}
function y3(t, e, n = Zt.Compressed) {
  const r = Bw(e), s = new Ke(tf(r.r), tf(r.s)), i = Et.fromSignature(t, s, r.recoveryId), o = n === Zt.Compressed;
  return i.toHex(o);
}
function w3(t) {
  return typeof t == "string" ? t : nt(t);
}
const au = w3;
function Lp(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Cw;
}
function di(t) {
  return !au(t).startsWith("04");
}
function b3(t) {
  t = Bl(t);
  const e = Lp(t);
  return nt(Vi(t.slice(0, 32), e));
}
function m3(t) {
  return Et.fromHex(au(t)).toHex(!0);
}
function x3(t) {
  return Et.fromHex(au(t)).toHex(!1);
}
function S3(t, e) {
  t = Bl(t);
  const [n, r] = ya(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Gi(r, 1) + Ke.fromHex(n).toCompactHex();
}
function cu() {
  return {
    type: V.MessageSignature,
    data: nt(new Uint8Array(ka))
  };
}
function Cp(t, e, n, r) {
  const s = su(0, t, 1, [fi(e)]).hash160, i = di(e) ? Zt.Compressed : Zt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: xe(n),
    fee: xe(r),
    keyEncoding: i,
    signature: cu()
  };
}
function Ui(t) {
  return "signature" in t;
}
function nd(t) {
  return t === Ft.P2SH || t === Ft.P2WSH;
}
function E3(t) {
  return t === Ft.P2SHNonSequential || t === Ft.P2WSHNonSequential;
}
function rd(t) {
  const e = Jc(t);
  return e.nonce = 0, e.fee = 0, Ui(e) ? e.signature = cu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function A3(t) {
  const e = [
    t.hashMode,
    Ct(t.signer),
    Br(t.nonce, 8),
    Br(t.fee, 8),
    t.keyEncoding,
    ru(t.signature)
  ];
  return se(e);
}
function $3(t) {
  const e = [
    t.hashMode,
    Ct(t.signer),
    Br(t.nonce, 8),
    Br(t.fee, 8)
  ], n = eu(t.fields);
  e.push(nu(n));
  const r = new Uint8Array(2);
  return Mw(r, t.signaturesRequired, 0), e.push(r), se(e);
}
function v3(t, e) {
  const n = nt(e.readBytes(20)), r = BigInt(`0x${nt(e.readBytes(8))}`), s = BigInt(`0x${nt(e.readBytes(8))}`), i = e.readUInt8Enum(Zt, (a) => {
    throw new Ae(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Ft.P2WPKH && i != Zt.Compressed)
    throw new Ae("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Yc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function I3(t, e) {
  const n = nt(e.readBytes(20)), r = BigInt("0x" + nt(e.readBytes(8))), s = BigInt("0x" + nt(e.readBytes(8))), i = Ep(e, V.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case V.PublicKey:
        di(f.contents.data) || (o = !0);
        break;
      case V.MessageSignature:
        if (f.pubKeyEncoding === Zt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Kr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Ft.P2WSH || t === Ft.P2WSHNonSequential))
    throw new Kr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ic(t) {
  return Ui(t) ? A3(t) : $3(t);
}
function oc(t) {
  const e = t.readUInt8Enum(Ft, (n) => {
    throw new Ae(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Ft.P2PKH || e === Ft.P2WPKH ? v3(e, t) : I3(e, t);
}
function Bp(t, e, n, r) {
  const i = t + nt(new Uint8Array([e])) + nt(Br(n, 8)) + nt(Br(r, 8));
  if (Ct(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ou(Ct(i));
}
function Tp(t, e, n) {
  const r = 33 + ka, s = di(e.data) ? Zt.Compressed : Zt.Uncompressed, i = t + c3(s.toString(16)) + n, o = Ct(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return ou(o);
}
function k3(t, e, n, r, s) {
  const i = Bp(t, e, n, r), o = S3(s, i), a = fi(b3(s)), c = Tp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Mp(t, e, n, r, s, i) {
  const o = Bp(t, e, n, r), a = fi(y3(o, i, s)), c = Tp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function L3() {
  const t = Cp(Ft.P2PKH, "", 0, 0);
  return t.signer = $S().hash160, t.keyEncoding = Zt.Compressed, t.signature = cu(), t;
}
function sd(t, e, n) {
  return Ui(t) ? C3(t, e, n) : B3(t, e, n);
}
function C3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Mp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = su(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Kr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function B3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case V.PublicKey:
        di(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case V.MessageSignature:
        c.pubKeyEncoding === Zt.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = Mp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (nd(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new Kr("Too many signatures");
        break;
    }
  if (nd(t.hashMode) && o !== t.signaturesRequired || E3(t.hashMode) && o < t.signaturesRequired)
    throw new Kr("Incorrect number of signatures");
  if (i && (t.hashMode === Ft.P2WSH || t.hashMode === Ft.P2WSHNonSequential))
    throw new Kr("Uncompressed keys are not allowed in this hash mode");
  const a = su(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Kr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function _p(t) {
  return {
    authType: Jt.Standard,
    spendingCondition: t
  };
}
function Np(t, e) {
  return {
    authType: Jt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Cp(Ft.P2PKH, "0".repeat(66), 0, 0)
  };
}
function id(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Jt.Standard:
        return _p(rd(t.spendingCondition));
      case Jt.Sponsored:
        return Np(rd(t.spendingCondition), L3());
      default:
        throw new ra("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function T3(t, e) {
  switch (t.authType) {
    case Jt.Standard:
      return sd(t.spendingCondition, e, Jt.Standard);
    case Jt.Sponsored:
      return sd(t.spendingCondition, e, Jt.Standard);
    default:
      throw new ra("Invalid origin auth type");
  }
}
function M3(t, e) {
  switch (t.authType) {
    case Jt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: xe(e)
      };
      return { ...t, spendingCondition: n };
    case Jt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: xe(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function _3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: xe(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function N3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: xe(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function U3(t, e) {
  const n = {
    ...e,
    nonce: xe(e.nonce),
    fee: xe(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function P3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Jt.Standard:
      e.push(ic(t.spendingCondition));
      break;
    case Jt.Sponsored:
      e.push(ic(t.spendingCondition)), e.push(ic(t.sponsorSpendingCondition));
      break;
  }
  return se(e);
}
function H3(t) {
  const e = t.readUInt8Enum(Jt, (r) => {
    throw new Ae(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Jt.Standard:
      return n = oc(t), _p(n);
    case Jt.Sponsored:
      n = oc(t);
      const r = oc(t);
      return Np(n, r);
  }
}
class O3 {
  constructor({ auth: e, payload: n, postConditions: r = eu([]), postConditionMode: s = na.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = fx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: xe(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = je.Any;
  }
  signBegin() {
    const e = Jc(this);
    return e.auth = id(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Jc(this);
    return e.auth = id(e.auth), e.txid();
  }
  verifyOrigin() {
    return T3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Jt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Jt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Jt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : fi(e), r = this.auth.spendingCondition;
    if (r && !Ui(r)) {
      const s = di(n.data);
      r.fields.push(Ds(s ? Zt.Compressed : Zt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = k3(n, r, e.fee, e.nonce, s);
    if (Ui(e))
      e.signature = qc(i);
    else {
      const a = Lp(s);
      e.fields.push(Ds(a ? Zt.Compressed : Zt.Uncompressed, qc(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return ou(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Jt.Sponsored)
      throw new ra("Cannot sponsor sign a non-sponsored transaction");
    this.auth = U3(this.auth, e);
  }
  setFee(e) {
    this.auth = M3(this.auth, e);
  }
  setNonce(e) {
    this.auth = _3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Jt.Sponsored)
      throw new ra("Cannot sponsor sign a non-sponsored transaction");
    this.auth = N3(this.auth, e);
  }
  serialize() {
    return nt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Os('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Os('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Os('"auth" is undefined');
    if (this.payload === void 0)
      throw new Os('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Jr(n, this.chainId, 0), e.push(n), e.push(P3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(nu(this.postConditions)), e.push($p(this.payload)), se(e);
  }
}
function D3(t) {
  const e = Ue(t, Rt) ? t : new Rt(t), n = e.readUInt8Enum(cs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = H3(e), i = e.readUInt8Enum(je, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(na, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Ep(e, V.PostCondition), c = OS(e), f = new O3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return f.anchorMode = i, f;
}
const od = BigInt("18446744073709551615");
function ac(t) {
  const e = xe(t);
  if (e < 0n || e > od)
    throw new RangeError(`Post-condition amount must be between 0 and ${od} (u64 max), received: ${e}`);
  return e;
}
var tl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(tl || (tl = {}));
var el;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(el || (el = {}));
function F3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: V.PostCondition,
        conditionType: qt.STX,
        principal: t.address === "origin" ? { type: V.Principal, prefix: ve.Origin } : Si(t.address),
        conditionCode: So(t.condition),
        amount: ac(t.amount)
      };
    case "ft-postcondition":
      return {
        type: V.PostCondition,
        conditionType: qt.Fungible,
        principal: t.address === "origin" ? { type: V.Principal, prefix: ve.Origin } : Si(t.address),
        conditionCode: So(t.condition),
        amount: ac(t.amount),
        asset: td(t.asset)
      };
    case "nft-postcondition":
      return {
        type: V.PostCondition,
        conditionType: qt.NonFungible,
        principal: t.address === "origin" ? { type: V.Principal, prefix: ve.Origin } : Si(t.address),
        conditionCode: So(t.condition),
        asset: td(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: V.PostCondition,
        conditionType: qt.Staking,
        principal: t.address === "origin" ? { type: V.Principal, prefix: ve.Origin } : Si(t.address),
        conditionCode: So(t.condition),
        amount: ac(t.amount)
      };
    case "pox-postcondition":
      return {
        type: V.PostCondition,
        conditionType: qt.PoX,
        principal: t.address === "origin" ? { type: V.Principal, prefix: ve.Origin } : Si(t.address),
        conditionCode: j3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function So(t) {
  return tl[t];
}
function j3(t) {
  return el[t];
}
function Up(t) {
  const e = F3(t);
  return PS(e);
}
function z3(t, e, n) {
  return uu(Pp(t), n);
}
function Pp(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Pi(r);
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
    return BigInt(`0x${K3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function lu(t, e = 8) {
  return (typeof t == "bigint" ? t : Pp(t)).toString(16).padStart(e * 2, "0");
}
function uu(t, e = 16) {
  const n = lu(t, e);
  return Pi(n);
}
function R3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const G3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function K3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += G3[n];
  return e;
}
function Pi(t) {
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
function fu(t) {
  return new TextEncoder().encode(t);
}
function V3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function W3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ad(t) {
  if (t.some(W3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function du(...t) {
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
function Kn(t) {
  return du(...t.map((e) => typeof e == "number" ? ad([e]) : e instanceof Array ? ad(e) : e));
}
function Ba(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var nl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(nl || (nl = {}));
nl.Mainnet;
const q3 = 128, X3 = 128, Hp = 16;
var rl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(rl || (rl = {}));
var cd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(cd || (cd = {}));
var ld;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ld || (ld = {}));
var on;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(on || (on = {}));
const cc = ["onChainOnly", "offChainOnly", "any"];
cc[0] + "", on.OnChainOnly, cc[1] + "", on.OffChainOnly, cc[2] + "", on.Any, on.OnChainOnly + "", on.OnChainOnly, on.OffChainOnly + "", on.OffChainOnly, on.Any + "", on.Any;
var sl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(sl || (sl = {}));
sl.Mainnet;
var ud;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ud || (ud = {}));
var jr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(jr || (jr = {}));
var fd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(fd || (fd = {}));
var dd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(gd || (gd = {}));
var yd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(yd || (yd = {}));
var il;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(il || (il = {}));
var wd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wd || (wd = {}));
var bd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(bd || (bd = {}));
function ol(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Y3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Op(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Z3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ol(t.outputLen), ol(t.blockLen);
}
function Q3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function J3(t, e) {
  Op(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const lc = {
  number: ol,
  bool: Y3,
  bytes: Op,
  hash: Z3,
  exists: Q3,
  output: J3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), mn = (t, e) => t << 32 - e | t >>> e, tE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!tE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function eE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Dp(t) {
  if (typeof t == "string" && (t = eE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let nE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function $s(t) {
  const e = (r) => t().update(Dp(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function rE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let hu = class extends nE {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = uc(this.buffer);
  }
  update(e) {
    lc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Dp(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = uc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    lc.exists(this), lc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    rE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = uc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const sE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fp = Uint8Array.from({ length: 16 }, (t, e) => e), iE = Fp.map((t) => (9 * t + 5) % 16);
let pu = [Fp], gu = [iE];
for (let t = 0; t < 4; t++)
  for (let e of [pu, gu])
    e.push(e[t].map((n) => sE[n]));
const jp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), oE = pu.map((t, e) => t.map((n) => jp[e][n])), aE = gu.map((t, e) => t.map((n) => jp[e][n])), cE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), lE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Eo = (t, e) => t << e | t >>> 32 - e;
function md(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ao = new Uint32Array(16);
let uE = class extends hu {
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
      Ao[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, m = cE[h], L = lE[h], S = pu[h], T = gu[h], w = oE[h], B = aE[h];
      for (let I = 0; I < 16; I++) {
        const H = Eo(r + md(h, i, a, f) + Ao[S[I]] + m, w[I]) + l | 0;
        r = l, l = f, f = Eo(a, 10) | 0, a = i, i = H;
      }
      for (let I = 0; I < 16; I++) {
        const H = Eo(s + md(b, o, c, d) + Ao[T[I]] + L, B[I]) + g | 0;
        s = g, g = d, d = Eo(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ao.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
$s(() => new uE());
const fE = (t, e, n) => t & e ^ ~t & n, dE = (t, e, n) => t & e ^ t & n ^ e & n, hE = new Uint32Array([
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
]), pr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), gr = new Uint32Array(64);
let zp = class extends hu {
  constructor() {
    super(64, 32, 8, !1), this.A = pr[0] | 0, this.B = pr[1] | 0, this.C = pr[2] | 0, this.D = pr[3] | 0, this.E = pr[4] | 0, this.F = pr[5] | 0, this.G = pr[6] | 0, this.H = pr[7] | 0;
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
      gr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = gr[l - 15], h = gr[l - 2], b = mn(g, 7) ^ mn(g, 18) ^ g >>> 3, m = mn(h, 17) ^ mn(h, 19) ^ h >>> 10;
      gr[l] = m + gr[l - 7] + b + gr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = mn(a, 6) ^ mn(a, 11) ^ mn(a, 25), h = d + g + fE(a, c, f) + hE[l] + gr[l] | 0, m = (mn(r, 2) ^ mn(r, 13) ^ mn(r, 22)) + dE(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    gr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, pE = class extends zp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
$s(() => new zp());
$s(() => new pE());
const $o = BigInt(2 ** 32 - 1), al = BigInt(32);
function Rp(t, e = !1) {
  return e ? { h: Number(t & $o), l: Number(t >> al & $o) } : { h: Number(t >> al & $o) | 0, l: Number(t & $o) | 0 };
}
function gE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Rp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const yE = (t, e) => BigInt(t >>> 0) << al | BigInt(e >>> 0), wE = (t, e, n) => t >>> n, bE = (t, e, n) => t << 32 - n | e >>> n, mE = (t, e, n) => t >>> n | e << 32 - n, xE = (t, e, n) => t << 32 - n | e >>> n, SE = (t, e, n) => t << 64 - n | e >>> n - 32, EE = (t, e, n) => t >>> n - 32 | e << 64 - n, AE = (t, e) => e, $E = (t, e) => t, vE = (t, e, n) => t << n | e >>> 32 - n, IE = (t, e, n) => e << n | t >>> 32 - n, kE = (t, e, n) => e << n - 32 | t >>> 64 - n, LE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function CE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const BE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), TE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ME = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _E = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, NE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), UE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, mt = {
  fromBig: Rp,
  split: gE,
  toBig: yE,
  shrSH: wE,
  shrSL: bE,
  rotrSH: mE,
  rotrSL: xE,
  rotrBH: SE,
  rotrBL: EE,
  rotr32H: AE,
  rotr32L: $E,
  rotlSH: vE,
  rotlSL: IE,
  rotlBH: kE,
  rotlBL: LE,
  add: CE,
  add3L: BE,
  add3H: TE,
  add4L: ME,
  add4H: _E,
  add5H: UE,
  add5L: NE
}, [PE, HE] = mt.split([
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
].map((t) => BigInt(t))), yr = new Uint32Array(80), wr = new Uint32Array(80);
let Ta = class extends hu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      yr[w] = e.getUint32(n), wr[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const B = yr[w - 15] | 0, I = wr[w - 15] | 0, H = mt.rotrSH(B, I, 1) ^ mt.rotrSH(B, I, 8) ^ mt.shrSH(B, I, 7), Z = mt.rotrSL(B, I, 1) ^ mt.rotrSL(B, I, 8) ^ mt.shrSL(B, I, 7), F = yr[w - 2] | 0, q = wr[w - 2] | 0, x = mt.rotrSH(F, q, 19) ^ mt.rotrBH(F, q, 61) ^ mt.shrSH(F, q, 6), $ = mt.rotrSL(F, q, 19) ^ mt.rotrBL(F, q, 61) ^ mt.shrSL(F, q, 6), O = mt.add4L(Z, $, wr[w - 7], wr[w - 16]), X = mt.add4H(O, H, x, yr[w - 7], yr[w - 16]);
      yr[w] = X | 0, wr[w] = O | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: m, Gl: L, Hh: S, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const B = mt.rotrSH(l, g, 14) ^ mt.rotrSH(l, g, 18) ^ mt.rotrBH(l, g, 41), I = mt.rotrSL(l, g, 14) ^ mt.rotrSL(l, g, 18) ^ mt.rotrBL(l, g, 41), H = l & h ^ ~l & m, Z = g & b ^ ~g & L, F = mt.add5L(T, I, Z, HE[w], wr[w]), q = mt.add5H(F, S, B, H, PE[w], yr[w]), x = F | 0, $ = mt.rotrSH(r, s, 28) ^ mt.rotrBH(r, s, 34) ^ mt.rotrBH(r, s, 39), O = mt.rotrSL(r, s, 28) ^ mt.rotrBL(r, s, 34) ^ mt.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, st = s & o ^ s & c ^ o & c;
      S = m | 0, T = L | 0, m = h | 0, L = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = mt.add(f | 0, d | 0, q | 0, x | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = mt.add3L(x, O, st);
      r = mt.add3H(z, q, $, X), s = z | 0;
    }
    ({ h: r, l: s } = mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = mt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = mt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = mt.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: m, l: L } = mt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: S, l: T } = mt.add(this.Hh | 0, this.Hl | 0, S | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, b, m, L, S, T);
  }
  roundClean() {
    yr.fill(0), wr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, OE = class extends Ta {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, DE = class extends Ta {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, FE = class extends Ta {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
$s(() => new Ta());
$s(() => new OE());
$s(() => new DE());
$s(() => new FE());
function jE(t, e, n) {
  const s = q3;
  if (r4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: rl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var fe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(fe || (fe = {}));
let zE = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Gp = class extends zE {
  constructor(e) {
    super(e);
  }
};
function Ma(t) {
  const e = [];
  return e.push(Pi(lu(t.version, 1))), e.push(Pi(t.hash160)), Kn(e);
}
function RE(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ma(t.address)), t.prefix === il.Contract && e.push(Hi(t.contractName)), Kn(e);
}
function Hi(t) {
  const e = [], n = fu(t.content), r = n.byteLength;
  return e.push(Pi(lu(r, t.lengthPrefixBytes))), e.push(n), Kn(e);
}
function GE(t) {
  const e = [];
  return e.push(Ma(t.address)), e.push(Hi(t.contractName)), e.push(Hi(t.assetName)), Kn(e);
}
function Kp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(RE(t.principal)), (t.conditionType === jr.Fungible || t.conditionType === jr.NonFungible) && e.push(GE(t.assetInfo)), t.conditionType === jr.NonFungible && e.push(us(t.assetName)), e.push(t.conditionCode), t.conditionType === jr.STX || t.conditionType === jr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Gp("The post-condition amount may not be larger than 8 bytes");
    e.push(z3(t.amount, !1, 8));
  }
  return Kn(e);
}
function Tn(t, e) {
  return Kn([t, e]);
}
function KE(t) {
  return new Uint8Array([t.type]);
}
function VE(t) {
  return t.type === fe.OptionalNone ? new Uint8Array([t.type]) : Tn(t.type, us(t.value));
}
function WE(t) {
  const e = new Uint8Array(4);
  return Ba(e, t.buffer.length, 0), Tn(t.type, du(e, t.buffer));
}
function qE(t) {
  const e = uu(R3(t.value, BigInt(X3)), Hp);
  return Tn(t.type, e);
}
function XE(t) {
  const e = uu(t.value, Hp);
  return Tn(t.type, e);
}
function YE(t) {
  return Tn(t.type, Ma(t.address));
}
function ZE(t) {
  return Tn(t.type, du(Ma(t.address), Hi(t.contractName)));
}
function QE(t) {
  return Tn(t.type, us(t.value));
}
function JE(t) {
  const e = [], n = new Uint8Array(4);
  Ba(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = us(r);
    e.push(s);
  }
  return Tn(t.type, Kn(e));
}
function t4(t) {
  const e = [], n = new Uint8Array(4);
  Ba(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = jE(s);
    e.push(Hi(i));
    const o = us(t.data[s]);
    e.push(o);
  }
  return Tn(t.type, Kn(e));
}
function Vp(t, e) {
  const n = [], r = e == "ascii" ? V3(t.data) : fu(t.data), s = new Uint8Array(4);
  return Ba(s, r.length, 0), n.push(s), n.push(r), Tn(t.type, Kn(n));
}
function e4(t) {
  return Vp(t, "ascii");
}
function n4(t) {
  return Vp(t, "utf8");
}
function us(t) {
  switch (t.type) {
    case fe.BoolTrue:
    case fe.BoolFalse:
      return KE(t);
    case fe.OptionalNone:
    case fe.OptionalSome:
      return VE(t);
    case fe.Buffer:
      return WE(t);
    case fe.UInt:
      return XE(t);
    case fe.Int:
      return qE(t);
    case fe.PrincipalStandard:
      return YE(t);
    case fe.PrincipalContract:
      return ZE(t);
    case fe.ResponseOk:
    case fe.ResponseErr:
      return QE(t);
    case fe.List:
      return JE(t);
    case fe.Tuple:
      return t4(t);
    case fe.StringASCII:
      return e4(t);
    case fe.StringUTF8:
      return n4(t);
    default:
      throw new Gp("Unable to serialize. Invalid Clarity Value.");
  }
}
const r4 = (t, e) => t ? fu(t).length > e : !1, s4 = "connect-ui";
let Do, Wp, ze = !1, cl = !1;
const Gn = (t, e = "") => () => {
}, i4 = (t, e) => () => {
}, o4 = "{visibility:hidden}.hydrated{visibility:inherit}", xd = {}, a4 = "http://www.w3.org/2000/svg", c4 = "http://www.w3.org/1999/xhtml", l4 = (t) => t != null, yu = (t) => (t = typeof t, t === "object" || t === "function");
function qp(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const dt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (f) => {
    for (let d = 0; d < f.length; d++)
      r = f[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !yu(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? ll(null, r) : r), i = s);
  };
  if (a(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((d) => f[d]).join(" "));
  }
  const c = ll(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, ll = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, u4 = {}, f4 = (t) => t && t.$tag$ === u4, d4 = (t, e) => t != null && !yu(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, h4 = (t) => hi(t).$hostElement$, p4 = (t, e, n) => {
  const r = me.ce(e, n);
  return t.dispatchEvent(r), r;
}, Sd = /* @__PURE__ */ new WeakMap(), g4 = (t, e, n) => {
  let r = sa.get(t);
  U4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, sa.set(t, r);
}, y4 = (t, e, n, r) => {
  var s;
  let i = Xp(e);
  const o = sa.get(i);
  if (t = t.nodeType === 11 ? t : In, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Sd.get(t), c;
      if (a || Sd.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = In.createElement("style"), c.innerHTML = o;
          const f = (s = me.$nonce$) !== null && s !== void 0 ? s : qp(In);
          f != null && c.setAttribute("nonce", f), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, w4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Gn("attachStyles", e.$tagName$), i = y4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Xp = (t, e) => "sc-" + t.$tagName$, Ed = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = $d(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, f = Ad(n), d = Ad(r);
      c.remove(...f.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : $d(_a, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && me.rel(t, e, n, !1), r && me.ael(t, e, r, !1);
    else {
      const c = yu(r);
      if ((o || c && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const f = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != f) && (t[e] = f);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || i & 4 || s) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, b4 = /\s/, Ad = (t) => t ? t.split(b4) : [], Yp = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || xd, o = e.$attrs$ || xd;
  for (r in i)
    r in o || Ed(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Ed(s, r, i[r], o[r], n, e.$flags$);
}, wu = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = In.createTextNode(s.$text$);
  else {
    if (ze || (ze = s.$tag$ === "svg"), o = s.$elm$ = In.createElementNS(ze ? a4 : c4, s.$tag$), ze && s.$tag$ === "foreignObject" && (ze = !1), Yp(null, s, ze), l4(Do) && o["s-si"] !== Do && o.classList.add(o["s-si"] = Do), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = wu(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? ze = !1 : o.tagName === "foreignObject" && (ze = !0);
  }
  return o;
}, Zp = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Wp && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = wu(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Qp = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, m4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], f = r.length - 1, d = r[0], l = r[f], g;
  for (; s <= o && i <= f; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--f] : vo(a, d) ? (Ai(a, d), a = e[++s], d = r[++i]) : vo(c, l) ? (Ai(c, l), c = e[--o], l = r[--f]) : vo(a, l) ? (Ai(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--f]) : vo(c, d) ? (Ai(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = wu(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? Zp(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, i, f) : i > f && Qp(e, s, o);
}, vo = (t, e) => t.$tag$ === e.$tag$, Ai = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (ze = i === "svg" ? !0 : i === "foreignObject" ? !1 : ze, Yp(t, e, ze), r !== null && s !== null ? m4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Zp(n, null, e, s, 0, s.length - 1)) : r !== null && Qp(r, 0, r.length - 1), ze && i === "svg" && (ze = !1)) : t.$text$ !== o && (n.data = o);
}, x4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ll(null, null), s = f4(e) ? e : dt(null, null, e);
  Wp = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Do = n["s-sc"], Ai(r, s);
}, Jp = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, bu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Jp(t, t.$ancestorComponent$), H4(() => S4(t, e));
}, S4 = (t, e) => {
  const n = Gn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), v4(s, () => E4(t, r, e));
}, E4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Gn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && w4(t);
  const o = Gn("render", t.$cmpMeta$.$tagName$);
  A4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => $4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, A4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, x4(t, e);
  } catch (r) {
    Oi(r, t.$hostElement$);
  }
  return null;
}, $4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Gn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, eg(n), r(), t.$onReadyResolve$(n), s || tg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && xu(() => bu(t, !1)), t.$flags$ &= -517;
}, tg = (t) => {
  eg(In.documentElement), xu(() => p4(_a, "appload", { detail: { namespace: s4 } }));
}, v4 = (t, e) => t && t.then ? t.then(e) : e(), eg = (t) => t.classList.add("hydrated"), I4 = (t, e) => hi(t).$instanceValues$.get(e), k4 = (t, e, n, r) => {
  const s = hi(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = d4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), f = n !== i && !c;
  (!(o & 8) || i === void 0) && f && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && bu(s, !1));
}, ng = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return I4(this, i);
        },
        set(a) {
          k4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        me.jmp(() => {
          const f = i.get(o);
          if (this.hasOwnProperty(f))
            c = this[f], delete this[f];
          else if (s.hasOwnProperty(f) && typeof this[f] == "number" && this[f] == c)
            return;
          this[f] = c === null && typeof this[f] == "boolean" ? !1 : c;
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
}, L4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = N4(n), s.then) {
        const c = i4();
        s = await s, c();
      }
      s.isProxied || (ng(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Gn("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Oi(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Xp(n);
      if (!sa.has(c)) {
        const f = Gn("registerStyles", n.$tagName$);
        g4(c, a, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => bu(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, C4 = (t) => {
  if (!(me.$flags$ & 1)) {
    const e = hi(t), n = e.$cmpMeta$, r = Gn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Jp(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), L4(t, e, n);
    }
    r();
  }
}, B4 = (t) => {
  me.$flags$ & 1 || hi(t);
}, T4 = (t, e = {}) => {
  var n;
  const r = Gn(), s = [], i = e.exclude || [], o = _a.customElements, a = In.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), f = /* @__PURE__ */ In.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(me, e), me.$resourcesUrl$ = new URL(e.resourcesUrl || "./", In.baseURI).href, t.map((h) => {
    h[1].map((b) => {
      const m = {
        $flags$: b[0],
        $tagName$: b[1],
        $members$: b[2],
        $listeners$: b[3]
      };
      m.$members$ = b[2];
      const L = m.$tagName$, S = class extends HTMLElement {
        // StencilLazyHost
        constructor(T) {
          super(T), T = this, _4(T, m), m.$flags$ & 1 && T.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : me.jmp(() => C4(this));
        }
        disconnectedCallback() {
          me.jmp(() => B4(this));
        }
        componentOnReady() {
          return hi(this).$onReadyPromise$;
        }
      };
      m.$lazyBundleId$ = h[0], !i.includes(L) && !o.get(L) && (s.push(L), o.define(L, ng(
        S,
        m,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + o4, f.setAttribute("data-styles", "");
    const h = (n = me.$nonce$) !== null && n !== void 0 ? n : qp(In);
    h != null && f.setAttribute("nonce", h), a.insertBefore(f, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((h) => h.connectedCallback()) : me.jmp(() => l = setTimeout(tg, 30)), r();
}, mu = /* @__PURE__ */ new WeakMap(), hi = (t) => mu.get(t), M4 = (t, e) => mu.set(e.$lazyInstance$ = t, e), _4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], mu.set(t, n);
}, $d = (t, e) => e in t, Oi = (t, e) => (0, console.error)(t, e), fc = /* @__PURE__ */ new Map(), N4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = fc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (fc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => K$).then(o, Oi);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (fc.set(s, o), o[r]), Oi);
}, sa = /* @__PURE__ */ new Map(), _a = typeof window < "u" ? window : {}, In = _a.document || { head: {} }, me = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, rg = (t) => Promise.resolve(t), U4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), vd = [], sg = [], P4 = (t, e) => (n) => {
  t.push(n), cl || (cl = !0, me.$flags$ & 4 ? xu(ul) : me.raf(ul));
}, Id = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Oi(n);
    }
  t.length = 0;
}, ul = () => {
  Id(vd), Id(sg), (cl = vd.length > 0) && me.raf(ul);
}, xu = (t) => rg().then(t), H4 = /* @__PURE__ */ P4(sg), O4 = () => rg(), D4 = (t, e) => typeof window > "u" ? Promise.resolve() : O4().then(() => T4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var F4 = Object.defineProperty, j4 = Object.defineProperties, z4 = Object.getOwnPropertyDescriptors, ia = Object.getOwnPropertySymbols, ig = Object.prototype.hasOwnProperty, og = Object.prototype.propertyIsEnumerable, kd = (t, e, n) => e in t ? F4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, We = (t, e) => {
  for (var n in e || (e = {})) ig.call(e, n) && kd(t, n, e[n]);
  if (ia) for (var n of ia(e)) og.call(e, n) && kd(t, n, e[n]);
  return t;
}, fn = (t, e) => j4(t, z4(e)), ag = (t, e) => {
  var n = {};
  for (var r in t) ig.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ia) for (var r of ia(t)) e.indexOf(r) < 0 && og.call(t, r) && (n[r] = t[r]);
  return n;
};
function cg() {
  return Ia(ss()) || window.StacksProvider || window.BlockstackProvider;
}
function Na(t) {
  return t ? typeof t == "string" ? os.fromName(t) : "version" in t ? t : "url" in t ? new Oc({ url: t.url }) : t.transactionVersion === cs.Mainnet ? new Oc({ url: t.client.baseUrl }) : new Dc({ url: t.client.baseUrl }) : new Dc();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var R4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(R4 || {}), G4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(G4 || {}), Su = (t) => {
  let e = t;
  if (!e) {
    let n = new Dh(["store_write"], document.location.href);
    e = new Hc({ appConfig: n });
  }
  return e;
};
function lg(t) {
  try {
    return Su(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var ug = (t) => {
  let e = Su(t).loadUserData().appPrivateKey, n = ye.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function K4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [as.Mainnet]: "mainnet", [as.Testnet]: "testnet" }, a = Na(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function V4(t) {
  let e = Na(t.network), n = Su(t.userSession), r = fn(We({}, t), { network: e, userSession: n });
  return We({ stxAddress: K4(r) }, r);
}
async function W4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Up) : n = n.map((r) => nt(Kp(r)))), new ye.TokenSigner("ES256k", e).signAsync(fn(We({}, t), { postConditions: n }));
}
function q4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Up) : e = e.map((n) => nt(Kp(n)))), ye.createUnsecuredToken(fn(We({}, t), { postConditions: e }));
}
var X4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Ct(a.replace(/^0x/, "")), f = D3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, fn(We({}, o), { stacksTransaction: f }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, fn(We({}, o), { stacksTransaction: f }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, Y4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = ag(e, ["amount", "appDetails", "userSession"]);
  if (lg(s)) {
    let { privateKey: a, publicKey: c } = ug(s), f = fn(We({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (f.appDetails = r), W4(f, a);
  }
  let o = fn(We({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), q4(o);
};
async function Z4(t, e, n) {
  let r = await e(fn(We(We({}, V4(t)), t), { network: Na(t.network) }));
  return X4({ token: r, options: t }, n);
}
function Q4(t, e = cg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return Z4(t, Y4, e);
}
function fg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? fn(We({}, t), { message: ed(e), domain: ed(n) }) : fn(We({}, t), { message: nt(us(e)), domain: nt(us(n)) });
}
async function J4(t, e) {
  return new ye.TokenSigner("ES256k", e).signAsync(fg(t));
}
async function tA(t) {
  let e = t, { userSession: n } = e, r = ag(e, ["userSession"]);
  if (lg(n)) {
    let { privateKey: s, publicKey: i } = ug(n), o = fn(We({}, r), { publicKey: i });
    return J4(o, s);
  }
  return ye.createUnsecuredToken(fg(t));
}
var eA = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(eA || {}), dg = "asigna-stx", Ld = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === dg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(rA(t, e), "*");
}), nA = { authenticationRequest: async (t) => Ld(t, "authenticationRequest"), transactionRequest: async (t) => Ld(t, "transactionRequest") }, rA = (t, e) => ({ source: dg, [e]: t }), sA = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = nA);
};
sA();
var iA = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function oA(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = ss(), o = cg();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    D4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : iA, c = Z2(a), f = document.createElement("connect-modal");
    f.defaultProviders = a, f.installedProviders = c, f.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      f.remove(), document.body.style.overflow = d;
    };
    f.callback = (h) => {
      l(), t(n, h);
    }, f.cancelCallback = () => {
      var h;
      l(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(f);
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), f.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var Io = oA(Q4);
function Tr(t, e, n) {
  return Eu(ke(t, e), n);
}
function ke(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Yt(r);
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
      const r = lA(BigInt(`0x${At(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${At(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Cd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Zi(t, e = 8) {
  return (typeof t == "bigint" ? t : ke(t, !1)).toString(16).padStart(e * 2, "0");
}
function Ua(t) {
  return parseInt(t, 16);
}
function Eu(t, e = 16) {
  const n = Zi(t, e);
  return Yt(n);
}
function aA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function cA(t, e) {
  return t & BigInt(1) << e;
}
function lA(t, e) {
  return cA(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const uA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function At(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += uA[n];
  return e;
}
function Yt(t) {
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
function pi(t) {
  return new TextEncoder().encode(t);
}
function Au(t) {
  return new TextDecoder().decode(t);
}
function hg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function fA(t) {
  return String.fromCharCode.apply(null, t);
}
function dA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Bd(t) {
  if (t.some(dA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Pa(...t) {
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
function ie(t) {
  return Pa(...t.map((e) => typeof e == "number" ? Bd([e]) : e instanceof Array ? Bd(e) : e));
}
var Td;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Td || (Td = {}));
var Md;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Md || (Md = {}));
var _d;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(_d || (_d = {}));
const pg = 33, dc = 32;
function hA(t) {
  if (t.length < dc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + dc * 2), r = t.slice(2 + dc * 2);
  return {
    recoveryId: Ua(e),
    r: n,
    s: r
  };
}
function pA(t) {
  const e = typeof t == "string" ? Yt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function gA(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function yA(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function wA(t, e) {
  return t[e];
}
function bA(t, e, n = 0) {
  return t[n] = e, t;
}
function mA(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function fs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var fl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(fl || (fl = {}));
const xA = fl.Mainnet, SA = 128, EA = 128, gg = 16, Yr = 32, dl = 80, Ha = 65, AA = 32, $A = 64, oa = 34;
var et;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(et || (et = {}));
var St;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(St || (St = {}));
var hl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(hl || (hl = {}));
var _e;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(_e || (_e = {}));
const Fo = ["onChainOnly", "offChainOnly", "any"], Nd = {
  [Fo[0]]: _e.OnChainOnly,
  [Fo[1]]: _e.OffChainOnly,
  [Fo[2]]: _e.Any,
  [_e.OnChainOnly]: _e.OnChainOnly,
  [_e.OffChainOnly]: _e.OffChainOnly,
  [_e.Any]: _e.Any
};
function vA(t) {
  if (t in Nd)
    return Nd[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Fo.join(", ")}`);
}
var aa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(aa || (aa = {}));
aa.Mainnet;
var si;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(si || (si = {}));
var Ne;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ne || (Ne = {}));
var te;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(te || (te = {}));
var jt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(jt || (jt = {}));
var ca;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ca || (ca = {}));
var Qt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Qt || (Qt = {}));
var Di;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Di || (Di = {}));
var pl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(pl || (pl = {}));
var Fi;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Fi || (Fi = {}));
var Ud;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ud || (Ud = {}));
var Pd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Pd || (Pd = {}));
function gl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function IA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function yg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function kA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  gl(t.outputLen), gl(t.blockLen);
}
function LA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function CA(t, e) {
  yg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Wr = {
  number: gl,
  bool: IA,
  bytes: yg,
  hash: kA,
  exists: LA,
  output: CA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const hc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), xn = (t, e) => t << 32 - e | t >>> e, BA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!BA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function TA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function $u(t) {
  if (typeof t == "string" && (t = TA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class wg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function vs(t) {
  const e = (r) => t().update($u(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function MA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
class vu extends wg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = hc(this.buffer);
  }
  update(e) {
    Wr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = $u(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = hc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Wr.exists(this), Wr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    MA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = hc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const _A = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), bg = Uint8Array.from({ length: 16 }, (t, e) => e), NA = bg.map((t) => (9 * t + 5) % 16);
let Iu = [bg], ku = [NA];
for (let t = 0; t < 4; t++)
  for (let e of [Iu, ku])
    e.push(e[t].map((n) => _A[n]));
const mg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), UA = Iu.map((t, e) => t.map((n) => mg[e][n])), PA = ku.map((t, e) => t.map((n) => mg[e][n])), HA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), OA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ko = (t, e) => t << e | t >>> 32 - e;
function Hd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Lo = new Uint32Array(16);
class DA extends vu {
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
      Lo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, m = HA[h], L = OA[h], S = Iu[h], T = ku[h], w = UA[h], B = PA[h];
      for (let I = 0; I < 16; I++) {
        const H = ko(r + Hd(h, i, a, f) + Lo[S[I]] + m, w[I]) + l | 0;
        r = l, l = f, f = ko(a, 10) | 0, a = i, i = H;
      }
      for (let I = 0; I < 16; I++) {
        const H = ko(s + Hd(b, o, c, d) + Lo[T[I]] + L, B[I]) + g | 0;
        s = g, g = d, d = ko(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Lo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const FA = vs(() => new DA()), jA = (t, e, n) => t & e ^ ~t & n, zA = (t, e, n) => t & e ^ t & n ^ e & n, RA = new Uint32Array([
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
]), br = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), mr = new Uint32Array(64);
class xg extends vu {
  constructor() {
    super(64, 32, 8, !1), this.A = br[0] | 0, this.B = br[1] | 0, this.C = br[2] | 0, this.D = br[3] | 0, this.E = br[4] | 0, this.F = br[5] | 0, this.G = br[6] | 0, this.H = br[7] | 0;
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
      mr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = mr[l - 15], h = mr[l - 2], b = xn(g, 7) ^ xn(g, 18) ^ g >>> 3, m = xn(h, 17) ^ xn(h, 19) ^ h >>> 10;
      mr[l] = m + mr[l - 7] + b + mr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = xn(a, 6) ^ xn(a, 11) ^ xn(a, 25), h = d + g + jA(a, c, f) + RA[l] + mr[l] | 0, m = (xn(r, 2) ^ xn(r, 13) ^ xn(r, 22)) + zA(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    mr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class GA extends xg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Lu = vs(() => new xg());
vs(() => new GA());
const Co = BigInt(2 ** 32 - 1), yl = BigInt(32);
function Sg(t, e = !1) {
  return e ? { h: Number(t & Co), l: Number(t >> yl & Co) } : { h: Number(t >> yl & Co) | 0, l: Number(t & Co) | 0 };
}
function KA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Sg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const VA = (t, e) => BigInt(t >>> 0) << yl | BigInt(e >>> 0), WA = (t, e, n) => t >>> n, qA = (t, e, n) => t << 32 - n | e >>> n, XA = (t, e, n) => t >>> n | e << 32 - n, YA = (t, e, n) => t << 32 - n | e >>> n, ZA = (t, e, n) => t << 64 - n | e >>> n - 32, QA = (t, e, n) => t >>> n - 32 | e << 64 - n, JA = (t, e) => e, t8 = (t, e) => t, e8 = (t, e, n) => t << n | e >>> 32 - n, n8 = (t, e, n) => e << n | t >>> 32 - n, r8 = (t, e, n) => e << n - 32 | t >>> 64 - n, s8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function i8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const o8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), a8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, c8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), l8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, u8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), f8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, xt = {
  fromBig: Sg,
  split: KA,
  toBig: VA,
  shrSH: WA,
  shrSL: qA,
  rotrSH: XA,
  rotrSL: YA,
  rotrBH: ZA,
  rotrBL: QA,
  rotr32H: JA,
  rotr32L: t8,
  rotlSH: e8,
  rotlSL: n8,
  rotlBH: r8,
  rotlBL: s8,
  add: i8,
  add3L: o8,
  add3H: a8,
  add4L: c8,
  add4H: l8,
  add5H: f8,
  add5L: u8
}, [d8, h8] = xt.split([
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
].map((t) => BigInt(t))), xr = new Uint32Array(80), Sr = new Uint32Array(80);
class Oa extends vu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      xr[w] = e.getUint32(n), Sr[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const B = xr[w - 15] | 0, I = Sr[w - 15] | 0, H = xt.rotrSH(B, I, 1) ^ xt.rotrSH(B, I, 8) ^ xt.shrSH(B, I, 7), Z = xt.rotrSL(B, I, 1) ^ xt.rotrSL(B, I, 8) ^ xt.shrSL(B, I, 7), F = xr[w - 2] | 0, q = Sr[w - 2] | 0, x = xt.rotrSH(F, q, 19) ^ xt.rotrBH(F, q, 61) ^ xt.shrSH(F, q, 6), $ = xt.rotrSL(F, q, 19) ^ xt.rotrBL(F, q, 61) ^ xt.shrSL(F, q, 6), O = xt.add4L(Z, $, Sr[w - 7], Sr[w - 16]), X = xt.add4H(O, H, x, xr[w - 7], xr[w - 16]);
      xr[w] = X | 0, Sr[w] = O | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: m, Gl: L, Hh: S, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const B = xt.rotrSH(l, g, 14) ^ xt.rotrSH(l, g, 18) ^ xt.rotrBH(l, g, 41), I = xt.rotrSL(l, g, 14) ^ xt.rotrSL(l, g, 18) ^ xt.rotrBL(l, g, 41), H = l & h ^ ~l & m, Z = g & b ^ ~g & L, F = xt.add5L(T, I, Z, h8[w], Sr[w]), q = xt.add5H(F, S, B, H, d8[w], xr[w]), x = F | 0, $ = xt.rotrSH(r, s, 28) ^ xt.rotrBH(r, s, 34) ^ xt.rotrBH(r, s, 39), O = xt.rotrSL(r, s, 28) ^ xt.rotrBL(r, s, 34) ^ xt.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, st = s & o ^ s & c ^ o & c;
      S = m | 0, T = L | 0, m = h | 0, L = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = xt.add(f | 0, d | 0, q | 0, x | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = xt.add3L(x, O, st);
      r = xt.add3H(z, q, $, X), s = z | 0;
    }
    ({ h: r, l: s } = xt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = xt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = xt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = xt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = xt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = xt.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: m, l: L } = xt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: S, l: T } = xt.add(this.Hh | 0, this.Hl | 0, S | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, b, m, L, S, T);
  }
  roundClean() {
    xr.fill(0), Sr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class p8 extends Oa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class g8 extends Oa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class y8 extends Oa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
vs(() => new Oa());
vs(() => new p8());
const w8 = vs(() => new g8());
vs(() => new y8());
function Eg(t) {
  if (Yt(t).byteLength != Ha)
    throw Error("Invalid signature");
  return {
    type: et.MessageSignature,
    data: t
  };
}
function $i(t, e) {
  return { type: et.Address, version: t, hash160: e };
}
function Fs(t) {
  return Es.c32address(t.version, t.hash160);
}
function ds(t, e, n) {
  const r = e || 1, s = n || SA;
  if (Dg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: et.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Cu(t) {
  const e = Es.c32addressDecode(t);
  return {
    type: et.Address,
    version: e[0],
    hash160: e[1]
  };
}
var U;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(U || (U = {}));
function b8(t) {
  if (t.type === U.PrincipalStandard)
    return Fs(t.address);
  if (t.type === U.PrincipalContract)
    return `${Fs(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Ag(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return S8(e, n);
  } else
    return m8(t);
}
function m8(t) {
  const e = Cu(t);
  return { type: U.PrincipalStandard, address: e };
}
function x8(t) {
  return { type: U.PrincipalStandard, address: t };
}
function S8(t, e) {
  const n = Cu(t), r = ds(e);
  return $g(n, r);
}
function $g(t, e) {
  if (pi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: U.PrincipalContract, address: t, contractName: e };
}
function pc(t, e = !1) {
  switch (t.type) {
    case U.BoolTrue:
      return !0;
    case U.BoolFalse:
      return !1;
    case U.Int:
    case U.UInt:
      return e ? t.value.toString() : t.value;
    case U.Buffer:
      return `0x${At(t.buffer)}`;
    case U.OptionalNone:
      return null;
    case U.OptionalSome:
      return Fn(t.value);
    case U.ResponseErr:
      return Fn(t.value);
    case U.ResponseOk:
      return Fn(t.value);
    case U.PrincipalStandard:
    case U.PrincipalContract:
      return b8(t);
    case U.List:
      return t.list.map((r) => Fn(r));
    case U.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Fn(t.data[r]);
      }), n;
    case U.StringASCII:
      return t.data;
    case U.StringUTF8:
      return t.data;
  }
}
function Fn(t) {
  switch (t.type) {
    case U.ResponseErr:
      return { type: $r(t), value: pc(t, !0), success: !1 };
    case U.ResponseOk:
      return { type: $r(t), value: pc(t, !0), success: !0 };
    default:
      return { type: $r(t), value: pc(t, !0) };
  }
}
function $r(t) {
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
      return `(optional ${$r(t.value)})`;
    case U.ResponseErr:
      return `(response UnknownType ${$r(t.value)})`;
    case U.ResponseOk:
      return `(response ${$r(t.value)} UnknownType)`;
    case U.PrincipalStandard:
    case U.PrincipalContract:
      return "principal";
    case U.List:
      return `(list ${t.list.length} ${t.list.length ? $r(t.list[0]) : "UnknownType"})`;
    case U.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${$r(t.data[e])})`).join(" ")})`;
    case U.StringASCII:
      return `(string-ascii ${hg(t.data).length})`;
    case U.StringUTF8:
      return `(string-utf8 ${pi(t.data).length})`;
  }
}
const vg = () => ({ type: U.BoolTrue }), Ig = () => ({ type: U.BoolFalse }), E8 = (t) => t ? vg() : Ig(), Od = BigInt("0xffffffffffffffffffffffffffffffff"), A8 = BigInt(0), Dd = BigInt("0x7fffffffffffffffffffffffffffffff"), Fd = BigInt("-170141183460469231731687303715884105728"), $8 = (t) => {
  const e = ke(t, !0);
  if (e > Dd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Dd}`);
  if (e < Fd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Fd}`);
  return { type: U.Int, value: e };
}, kn = (t) => {
  const e = ke(t, !1);
  if (e < A8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Od)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Od}`);
  return { type: U.UInt, value: e };
}, kg = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: U.Buffer, buffer: t };
};
function Lg() {
  return { type: U.OptionalNone };
}
function Cg(t) {
  return { type: U.OptionalSome, value: t };
}
function v8(t) {
  return { type: U.ResponseErr, value: t };
}
function I8(t) {
  return { type: U.ResponseOk, value: t };
}
function k8(t) {
  return { type: U.List, list: t };
}
function hs(t) {
  for (const e in t)
    if (!y6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: U.Tuple, data: t };
}
const ge = (t) => ({ type: U.StringASCII, data: t }), L8 = (t) => ({ type: U.StringUTF8, data: t });
class Bg extends wg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Wr.hash(e);
    const r = $u(n);
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
    return Wr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Wr.exists(this), Wr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Tg = (t, e, n) => new Bg(t, e).update(n).digest();
Tg.create = (t, e) => new Bg(t, e);
ee.hmacSha256Sync = (t, ...e) => {
  const n = Tg.create(Lu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ii(t) {
  return {
    type: et.PublicKey,
    data: Yt(t)
  };
}
function C8(t, e, n = Qt.Compressed) {
  const r = hA(e.data), s = new Ke(Cd(r.r), Cd(r.s)), i = Et.fromSignature(t, s, r.recoveryId), o = n === Qt.Compressed;
  return i.toHex(o);
}
function B8(t) {
  return { type: et.PublicKey, data: t };
}
function gi(t) {
  return !At(t.data).startsWith("04");
}
function la(t) {
  return t.data.slice();
}
function T8(t) {
  const e = N8(t), n = Vi(e.data.slice(0, 32), e.compressed);
  return ii(At(n));
}
function M8(t) {
  const e = typeof t == "string" ? t : At(t), n = Et.fromHex(e).toHex(!0);
  return ii(n);
}
function _8(t) {
  const e = typeof t == "string" ? t : At(t), n = Et.fromHex(e).toHex(!1);
  return ii(n);
}
function wl(t) {
  const e = t.readUInt8(), n = e === 4 ? $A : AA;
  return B8(ie([e, t.readBytes(n)]));
}
function N8(t) {
  const e = pA(t), n = e.length == pg;
  return { data: e, compressed: n };
}
function U8(t, e) {
  const [n, r] = ya(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Zi(r, 1) + Ke.fromHex(n).toCompactHex();
  return Eg(i);
}
function P8(t) {
  return T8(t.data);
}
function H8(t, e, n) {
  return typeof t == "string" && (t = Ag(t)), typeof n == "string" && (n = Rd(n)), {
    type: et.Payload,
    payloadType: St.TokenTransfer,
    recipient: t,
    amount: ke(e, !1),
    memo: n ?? Rd("")
  };
}
function O8(t, e, n, r) {
  return typeof t == "string" && (t = Cu(t)), typeof e == "string" && (e = ds(e)), typeof n == "string" && (n = ds(n)), {
    type: et.Payload,
    payloadType: St.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function jd(t, e, n) {
  return typeof t == "string" && (t = ds(t)), typeof e == "string" && (e = W8(e)), typeof n == "number" ? {
    type: et.Payload,
    payloadType: St.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: et.Payload,
    payloadType: St.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function D8() {
  return { type: et.Payload, payloadType: St.PoisonMicroblock };
}
function zd(t, e) {
  if (t.byteLength != Yr)
    throw Error(`Coinbase buffer size must be ${Yr} bytes`);
  return e != null ? {
    type: et.Payload,
    payloadType: St.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: et.Payload,
    payloadType: St.Coinbase,
    coinbaseBytes: t
  };
}
function F8(t, e, n) {
  if (t.byteLength != Yr)
    throw Error(`Coinbase buffer size must be ${Yr} bytes`);
  if (n.byteLength != dl)
    throw Error(`VRF proof buffer size must be ${dl} bytes`);
  return {
    type: et.Payload,
    payloadType: St.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === U.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var bl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(bl || (bl = {}));
function j8(t, e, n, r, s, i, o) {
  return {
    type: et.Payload,
    payloadType: St.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Mg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case St.TokenTransfer:
      e.push(re(t.recipient)), e.push(Tr(t.amount, !1, 8)), e.push(On(t.memo));
      break;
    case St.ContractCall:
      e.push(On(t.contractAddress)), e.push(On(t.contractName)), e.push(On(t.functionName));
      const n = new Uint8Array(4);
      fs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(re(r));
      });
      break;
    case St.SmartContract:
      e.push(On(t.contractName)), e.push(On(t.codeBody));
      break;
    case St.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(On(t.contractName)), e.push(On(t.codeBody));
      break;
    case St.PoisonMicroblock:
      break;
    case St.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case St.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(re(t.recipient));
      break;
    case St.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(re(t.recipient ? Cg(t.recipient) : Lg())), e.push(t.vrfProof);
      break;
    case St.TenureChange:
      e.push(Yt(t.tenureHash)), e.push(Yt(t.previousTenureHash)), e.push(Yt(t.burnViewHash)), e.push(Yt(t.previousTenureEnd)), e.push(fs(new Uint8Array(4), t.previousTenureBlocks)), e.push(bA(new Uint8Array(1), t.cause)), e.push(Yt(t.publicKeyHash));
      break;
  }
  return ie(e);
}
function z8(t) {
  switch (t.readUInt8Enum(St, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case St.TokenTransfer:
      const n = Je(t), r = ke(t.readBytes(8), !1), s = Ng(t);
      return H8(n, r, s);
    case St.ContractCall:
      const i = oi(t), o = Qe(t), a = Qe(t), c = [], f = t.readUInt32BE();
      for (let w = 0; w < f; w++) {
        const B = Je(t);
        c.push(B);
      }
      return O8(i, o, a, c);
    case St.SmartContract:
      const d = Qe(t), l = Qe(t, 4, 1e5);
      return jd(d, l);
    case St.VersionedSmartContract: {
      const w = t.readUInt8Enum(hl, (H) => {
        throw new Error(`Cannot recognize ClarityVersion: ${H}`);
      }), B = Qe(t), I = Qe(t, 4, 1e5);
      return jd(B, I, w);
    }
    case St.PoisonMicroblock:
      return D8();
    case St.Coinbase: {
      const w = t.readBytes(Yr);
      return zd(w);
    }
    case St.CoinbaseToAltRecipient: {
      const w = t.readBytes(Yr), B = Je(t);
      return zd(w, B);
    }
    case St.NakamotoCoinbase: {
      const w = t.readBytes(Yr), B = Je(t), I = t.readBytes(dl);
      return F8(w, B, I);
    }
    case St.TenureChange:
      const g = At(t.readBytes(20)), h = At(t.readBytes(20)), b = At(t.readBytes(20)), m = At(t.readBytes(32)), L = t.readUInt32BE(), S = t.readUInt8Enum(bl, (w) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${w}`);
      }), T = At(t.readBytes(20));
      return j8(g, h, b, m, L, S, T);
  }
}
class Da extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class zr extends Da {
  constructor(e) {
    super(e);
  }
}
class Ge extends Da {
  constructor(e) {
    super(e);
  }
}
class ua extends Da {
  constructor(e) {
    super(e);
  }
}
class qr extends Da {
  constructor(e) {
    super(e);
  }
}
var cn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(cn || (cn = {}));
function ml(t) {
  return Eg(At(t.readBytes(Ha)));
}
function js(t, e) {
  return {
    pubKeyEncoding: t,
    type: et.TransactionAuthField,
    contents: e
  };
}
function R8(t) {
  const e = t.readUInt8Enum(cn, (n) => {
    throw new Ge(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case cn.PublicKeyCompressed:
      return js(Qt.Compressed, wl(t));
    case cn.PublicKeyUncompressed:
      return js(Qt.Uncompressed, _8(wl(t).data));
    case cn.SignatureCompressed:
      return js(Qt.Compressed, ml(t));
    case cn.SignatureUncompressed:
      return js(Qt.Uncompressed, ml(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Bu(t) {
  return Yt(t.data);
}
function G8(t) {
  const e = [];
  switch (t.contents.type) {
    case et.PublicKey:
      e.push(t.pubKeyEncoding === Qt.Compressed ? cn.PublicKeyCompressed : cn.PublicKeyUncompressed), e.push(la(M8(t.contents.data)));
      break;
    case et.MessageSignature:
      e.push(t.pubKeyEncoding === Qt.Compressed ? cn.SignatureCompressed : cn.SignatureUncompressed), e.push(Bu(t.contents));
      break;
  }
  return ie(e);
}
function On(t) {
  switch (t.type) {
    case et.Address:
      return Qi(t);
    case et.Principal:
      return _g(t);
    case et.LengthPrefixedString:
      return ai(t);
    case et.MemoString:
      return q8(t);
    case et.AssetInfo:
      return Ug(t);
    case et.PostCondition:
      return X8(t);
    case et.PublicKey:
      return la(t);
    case et.LengthPrefixedList:
      return _u(t);
    case et.Payload:
      return Mg(t);
    case et.TransactionAuthField:
      return G8(t);
    case et.MessageSignature:
      return Bu(t);
  }
}
function K8() {
  return {
    type: et.Address,
    version: ca.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Tu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === jt.SerializeP2PKH || e === jt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === jt.SerializeP2WPKH || e === jt.SerializeP2WSH || e === jt.SerializeP2WSHNonSequential) && !r.every(gi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case jt.SerializeP2PKH:
      return $i(t, d6(r[0].data));
    case jt.SerializeP2WPKH:
      return $i(t, h6(r[0].data));
    case jt.SerializeP2SH:
    case jt.SerializeP2SHNonSequential:
      return $i(t, p6(n, r.map(la)));
    case jt.SerializeP2WSH:
    case jt.SerializeP2WSHNonSequential:
      return $i(t, g6(n, r.map(la)));
  }
}
function Qi(t) {
  const e = [];
  return e.push(Yt(Zi(t.version, 1))), e.push(Yt(t.hash160)), ie(e);
}
function oi(t) {
  const e = Ua(At(t.readBytes(1))), n = At(t.readBytes(20));
  return { type: et.Address, version: e, hash160: n };
}
function _g(t) {
  const e = [];
  return e.push(t.prefix), e.push(Qi(t.address)), t.prefix === Fi.Contract && e.push(ai(t.contractName)), ie(e);
}
function V8(t) {
  const e = t.readUInt8Enum(Fi, (s) => {
    throw new Ge(`Unexpected Principal payload type: ${s}`);
  }), n = oi(t);
  if (e === Fi.Standard)
    return { type: et.Principal, prefix: e, address: n };
  const r = Qe(t);
  return {
    type: et.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function ai(t) {
  const e = [], n = pi(t.content), r = n.byteLength;
  return e.push(Yt(Zi(r, t.lengthPrefixBytes))), e.push(n), ie(e);
}
function Qe(t, e, n) {
  e = e || 1;
  const r = Ua(At(t.readBytes(e))), s = Au(t.readBytes(r));
  return ds(s, e, n ?? 128);
}
function W8(t) {
  return ds(t, 4, 1e5);
}
function Rd(t) {
  if (t && Dg(t, oa))
    throw new Error(`Memo exceeds maximum length of ${oa} bytes`);
  return { type: et.MemoString, content: t };
}
function q8(t) {
  const e = [], n = pi(t.content), r = f6(At(n), oa * 2);
  return e.push(Yt(r)), ie(e);
}
function Ng(t) {
  let e = Au(t.readBytes(oa));
  return e = e.replace(/\u0000*$/, ""), { type: et.MemoString, content: e };
}
function Ug(t) {
  const e = [];
  return e.push(Qi(t.address)), e.push(ai(t.contractName)), e.push(ai(t.assetName)), ie(e);
}
function xl(t) {
  return {
    type: et.AssetInfo,
    address: oi(t),
    contractName: Qe(t),
    assetName: Qe(t)
  };
}
function Mu(t, e) {
  return {
    type: et.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function _u(t) {
  const e = t.values, n = [];
  n.push(Yt(Zi(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(On(r));
  return ie(n);
}
function Pg(t, e, n) {
  const r = Ua(At(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case et.Address:
        s.push(oi(t));
        break;
      case et.LengthPrefixedString:
        s.push(Qe(t));
        break;
      case et.MemoString:
        s.push(Ng(t));
        break;
      case et.AssetInfo:
        s.push(xl(t));
        break;
      case et.PostCondition:
        s.push(Y8(t));
        break;
      case et.PublicKey:
        s.push(wl(t));
        break;
      case et.TransactionAuthField:
        s.push(R8(t));
        break;
    }
  return Mu(s, n);
}
function X8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(_g(t.principal)), (t.conditionType === Ne.Fungible || t.conditionType === Ne.NonFungible) && e.push(Ug(t.assetInfo)), t.conditionType === Ne.NonFungible && e.push(re(t.assetName)), e.push(t.conditionCode), t.conditionType === Ne.STX || t.conditionType === Ne.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new zr("The post-condition amount may not be larger than 8 bytes");
    e.push(Tr(t.amount, !1, 8));
  }
  return ie(e);
}
function Y8(t) {
  const e = t.readUInt8Enum(Ne, (o) => {
    throw new Ge(`Could not read ${o} as PostConditionType`);
  }), n = V8(t);
  let r, s, i;
  switch (e) {
    case Ne.STX:
      return r = t.readUInt8Enum(Di, (a) => {
        throw new Ge(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${At(t.readBytes(8))}`), {
        type: et.PostCondition,
        conditionType: Ne.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Ne.Fungible:
      return s = xl(t), r = t.readUInt8Enum(Di, (a) => {
        throw new Ge(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${At(t.readBytes(8))}`), {
        type: et.PostCondition,
        conditionType: Ne.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Ne.NonFungible:
      s = xl(t);
      const o = Je(t);
      return r = t.readUInt8Enum(pl, (a) => {
        throw new Ge(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: et.PostCondition,
        conditionType: Ne.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Mn(t, e) {
  return ie([t, e]);
}
function Z8(t) {
  return new Uint8Array([t.type]);
}
function Q8(t) {
  return t.type === U.OptionalNone ? new Uint8Array([t.type]) : Mn(t.type, re(t.value));
}
function J8(t) {
  const e = new Uint8Array(4);
  return fs(e, t.buffer.length, 0), Mn(t.type, Pa(e, t.buffer));
}
function t6(t) {
  const e = Eu(aA(t.value, BigInt(EA)), gg);
  return Mn(t.type, e);
}
function e6(t) {
  const e = Eu(t.value, gg);
  return Mn(t.type, e);
}
function n6(t) {
  return Mn(t.type, Qi(t.address));
}
function r6(t) {
  return Mn(t.type, Pa(Qi(t.address), ai(t.contractName)));
}
function s6(t) {
  return Mn(t.type, re(t.value));
}
function i6(t) {
  const e = [], n = new Uint8Array(4);
  fs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = re(r);
    e.push(s);
  }
  return Mn(t.type, ie(e));
}
function o6(t) {
  const e = [], n = new Uint8Array(4);
  fs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ds(s);
    e.push(ai(i));
    const o = re(t.data[s]);
    e.push(o);
  }
  return Mn(t.type, ie(e));
}
function Hg(t, e) {
  const n = [], r = e == "ascii" ? hg(t.data) : pi(t.data), s = new Uint8Array(4);
  return fs(s, r.length, 0), n.push(s), n.push(r), Mn(t.type, ie(n));
}
function a6(t) {
  return Hg(t, "ascii");
}
function c6(t) {
  return Hg(t, "utf8");
}
function re(t) {
  switch (t.type) {
    case U.BoolTrue:
    case U.BoolFalse:
      return Z8(t);
    case U.OptionalNone:
    case U.OptionalSome:
      return Q8(t);
    case U.Buffer:
      return J8(t);
    case U.UInt:
      return e6(t);
    case U.Int:
      return t6(t);
    case U.PrincipalStandard:
      return n6(t);
    case U.PrincipalContract:
      return r6(t);
    case U.ResponseOk:
    case U.ResponseErr:
      return s6(t);
    case U.List:
      return i6(t);
    case U.Tuple:
      return o6(t);
    case U.StringASCII:
      return a6(t);
    case U.StringUTF8:
      return c6(t);
    default:
      throw new zr("Unable to serialize. Invalid Clarity Value.");
  }
}
function l6(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Gd = /* @__PURE__ */ new Map();
function Og(t, e) {
  const n = Gd.get(t);
  if (n !== void 0)
    return n(e);
  const r = l6(t);
  return Gd.set(t, r), Og(t, e);
}
class Ci {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return mA(this.readBytes(4), 0);
  }
  readUInt8() {
    return wA(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return gA(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = At(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = At(n);
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
    if (Og(e, r))
      return r;
    throw n(r);
  }
}
function Je(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Ci(Yt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Ci(t) : e = t;
  switch (e.readUInt8Enum(U, (r) => {
    throw new Ge(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case U.Int:
      return $8(e.readBytes(16));
    case U.UInt:
      return kn(e.readBytes(16));
    case U.Buffer:
      const r = e.readUInt32BE();
      return kg(e.readBytes(r));
    case U.BoolTrue:
      return vg();
    case U.BoolFalse:
      return Ig();
    case U.PrincipalStandard:
      const s = oi(e);
      return x8(s);
    case U.PrincipalContract:
      const i = oi(e), o = Qe(e);
      return $g(i, o);
    case U.ResponseOk:
      return I8(Je(e));
    case U.ResponseErr:
      return v8(Je(e));
    case U.OptionalNone:
      return Lg();
    case U.OptionalSome:
      return Cg(Je(e));
    case U.List:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(Je(e));
      return k8(c);
    case U.Tuple:
      const f = e.readUInt32BE(), d = {};
      for (let m = 0; m < f; m++) {
        const L = Qe(e).content;
        if (L === void 0)
          throw new Ge('"content" is undefined');
        d[L] = Je(e);
      }
      return hs(d);
    case U.StringASCII:
      const l = e.readUInt32BE(), g = fA(e.readBytes(l));
      return ge(g);
    case U.StringUTF8:
      const h = e.readUInt32BE(), b = Au(e.readBytes(h));
      return L8(b);
    default:
      throw new Ge("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const u6 = (t) => t.length % 2 == 0 ? t : `0${t}`, f6 = (t, e) => t.padEnd(e, "0"), Dg = (t, e) => t ? pi(t).length > e : !1;
function Sl(t) {
  return sp(t);
}
const ji = (t) => FA(Lu(t)), Nu = (t) => At(w8(t)), d6 = (t) => At(ji(t)), h6 = (t) => {
  const e = ji(t), n = Pa(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ji(n);
  return At(r);
}, p6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = ie(n), s = ji(r);
  return At(s);
}, g6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = ie(n), s = Lu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = ie(i), a = ji(o);
  return At(a);
};
function y6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Fg(t) {
  const e = re(t);
  return `0x${At(e)}`;
}
function w6(t) {
  return Je(t);
}
const Gs = (t) => {
  try {
    return Es.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Uu() {
  return {
    type: et.MessageSignature,
    data: At(new Uint8Array(Ha))
  };
}
function jg(t, e, n, r) {
  const s = Tu(0, t, 1, [ii(e)]).hash160, i = gi(ii(e)) ? Qt.Compressed : Qt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: ke(n, !1),
    fee: ke(r, !1),
    keyEncoding: i,
    signature: Uu()
  };
}
function zi(t) {
  return "signature" in t;
}
function Kd(t) {
  return t === jt.SerializeP2SH || t === jt.SerializeP2WSH;
}
function b6(t) {
  return t === jt.SerializeP2SHNonSequential || t === jt.SerializeP2WSHNonSequential;
}
function Vd(t) {
  const e = Sl(t);
  return e.nonce = 0, e.fee = 0, zi(e) ? e.signature = Uu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function m6(t) {
  const e = [
    t.hashMode,
    Yt(t.signer),
    Tr(t.nonce, !1, 8),
    Tr(t.fee, !1, 8),
    t.keyEncoding,
    Bu(t.signature)
  ];
  return ie(e);
}
function x6(t) {
  const e = [
    t.hashMode,
    Yt(t.signer),
    Tr(t.nonce, !1, 8),
    Tr(t.fee, !1, 8)
  ], n = Mu(t.fields);
  e.push(_u(n));
  const r = new Uint8Array(2);
  return yA(r, t.signaturesRequired, 0), e.push(r), ie(e);
}
function S6(t, e) {
  const n = At(e.readBytes(20)), r = BigInt(`0x${At(e.readBytes(8))}`), s = BigInt(`0x${At(e.readBytes(8))}`), i = e.readUInt8Enum(Qt, (a) => {
    throw new Ge(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === jt.SerializeP2WPKH && i != Qt.Compressed)
    throw new Ge("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = ml(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function E6(t, e) {
  const n = At(e.readBytes(20)), r = BigInt("0x" + At(e.readBytes(8))), s = BigInt("0x" + At(e.readBytes(8))), i = Pg(e, et.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case et.PublicKey:
        gi(f.contents) || (o = !0);
        break;
      case et.MessageSignature:
        if (f.pubKeyEncoding === Qt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new qr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === jt.SerializeP2WSH || t === jt.SerializeP2WSHNonSequential))
    throw new qr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function gc(t) {
  return zi(t) ? m6(t) : x6(t);
}
function yc(t) {
  const e = t.readUInt8Enum(jt, (n) => {
    throw new Ge(`Could not parse ${n} as AddressHashMode`);
  });
  return e === jt.SerializeP2PKH || e === jt.SerializeP2WPKH ? S6(e, t) : E6(e, t);
}
function zg(t, e, n, r) {
  const i = t + At(new Uint8Array([e])) + At(Tr(n, !1, 8)) + At(Tr(r, !1, 8));
  if (Yt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Nu(Yt(i));
}
function Rg(t, e, n) {
  const r = 33 + Ha, s = gi(e) ? Qt.Compressed : Qt.Uncompressed, i = t + u6(s.toString(16)) + n.data, o = Yt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Nu(o);
}
function A6(t, e, n, r, s) {
  const i = zg(t, e, n, r), o = U8(s, i), a = P8(s), c = Rg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Gg(t, e, n, r, s, i) {
  const o = zg(t, e, n, r), a = ii(C8(o, i, s)), c = Rg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function $6() {
  const t = jg(jt.SerializeP2PKH, "", 0, 0);
  return t.signer = K8().hash160, t.keyEncoding = Qt.Compressed, t.signature = Uu(), t;
}
function Wd(t, e, n) {
  return zi(t) ? v6(t, e, n) : I6(t, e, n);
}
function v6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Gg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Tu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new qr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function I6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case et.PublicKey:
        gi(c.contents) || (i = !0), r.push(c.contents);
        break;
      case et.MessageSignature:
        c.pubKeyEncoding === Qt.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = Gg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Kd(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new qr("Too many signatures");
        break;
    }
  if (Kd(t.hashMode) && o !== t.signaturesRequired || b6(t.hashMode) && o < t.signaturesRequired)
    throw new qr("Incorrect number of signatures");
  if (i && (t.hashMode === jt.SerializeP2WSH || t.hashMode === jt.SerializeP2WSHNonSequential))
    throw new qr("Uncompressed keys are not allowed in this hash mode");
  const a = Tu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new qr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Kg(t) {
  return {
    authType: te.Standard,
    spendingCondition: t
  };
}
function Vg(t, e) {
  return {
    authType: te.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || jg(jt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function qd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case te.Standard:
        return Kg(Vd(t.spendingCondition));
      case te.Sponsored:
        return Vg(Vd(t.spendingCondition), $6());
      default:
        throw new ua("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function k6(t, e) {
  switch (t.authType) {
    case te.Standard:
      return Wd(t.spendingCondition, e, te.Standard);
    case te.Sponsored:
      return Wd(t.spendingCondition, e, te.Standard);
    default:
      throw new ua("Invalid origin auth type");
  }
}
function L6(t, e) {
  switch (t.authType) {
    case te.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ke(e, !1)
      };
      return { ...t, spendingCondition: n };
    case te.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: ke(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function C6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: ke(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function B6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ke(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function T6(t, e) {
  const n = {
    ...e,
    nonce: ke(e.nonce, !1),
    fee: ke(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function M6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case te.Standard:
      e.push(gc(t.spendingCondition));
      break;
    case te.Sponsored:
      e.push(gc(t.spendingCondition)), e.push(gc(t.sponsorSpendingCondition));
      break;
  }
  return ie(e);
}
function _6(t) {
  const e = t.readUInt8Enum(te, (r) => {
    throw new Ge(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case te.Standard:
      return n = yc(t), Kg(n);
    case te.Sponsored:
      n = yc(t);
      const r = yc(t);
      return Vg(n, r);
  }
}
class N6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: ke(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? xA, this.postConditionMode = i ?? si.Deny, this.postConditions = s ?? Mu([]), o)
      this.anchorMode = vA(o);
    else
      switch (r.payloadType) {
        case St.Coinbase:
        case St.CoinbaseToAltRecipient:
        case St.NakamotoCoinbase:
        case St.PoisonMicroblock:
        case St.TenureChange:
          this.anchorMode = _e.OnChainOnly;
          break;
        case St.ContractCall:
        case St.SmartContract:
        case St.VersionedSmartContract:
        case St.TokenTransfer:
          this.anchorMode = _e.Any;
          break;
      }
  }
  signBegin() {
    const e = Sl(this);
    return e.auth = qd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Sl(this);
    return e.auth = qd(e.auth), e.txid();
  }
  verifyOrigin() {
    return k6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, te.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === te.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, te.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !zi(n)) {
      const r = gi(e);
      n.fields.push(js(r ? Qt.Compressed : Qt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = A6(n, r, e.fee, e.nonce, s);
    return zi(e) ? e.signature = i : e.fields.push(js(s.data.byteLength === pg ? Qt.Compressed : Qt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Nu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != te.Sponsored)
      throw new ua("Cannot sponsor sign a non-sponsored transaction");
    this.auth = T6(this.auth, e);
  }
  setFee(e) {
    this.auth = L6(this.auth, e);
  }
  setNonce(e) {
    this.auth = C6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != te.Sponsored)
      throw new ua("Cannot sponsor sign a non-sponsored transaction");
    this.auth = B6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new zr('"version" is undefined');
    if (this.chainId === void 0)
      throw new zr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new zr('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new zr('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new zr('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return fs(n, this.chainId, 0), e.push(n), e.push(M6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(_u(this.postConditions)), e.push(Mg(this.payload)), ie(e);
  }
}
function Pu(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Ci(Yt(t.slice(2))) : e = new Ci(Yt(t)) : t instanceof Uint8Array ? e = new Ci(t) : e = t;
  const n = e.readUInt8Enum(aa, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = _6(e), i = e.readUInt8Enum(_e, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(si, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Pg(e, et.PostCondition), c = z8(e);
  return new N6(n, s, c, a, o, i, r);
}
const U6 = E8, Bi = kn, P6 = kg;
const H6 = /* @__PURE__ */ new Set([4001, -31001]), O6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], D6 = ["result", "data", "payload", "response", "params"], Xd = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Fa = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Is = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, zn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, F6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Wg = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => F6(i, r)) === s
  );
}, qg = (t) => t ? Wg(Is()).some(
  (e) => {
    var n;
    return e.id === t && (Fa(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Xg = () => {
  if (typeof window > "u")
    return;
  const t = Is(), e = Wg(t).filter(
    (n) => {
      var r;
      return Fa(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = zn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of O6) {
    const r = zn(t, n) ?? (t === window ? void 0 : zn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, j6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Is(), n = zn(e, t) ?? (e === window ? void 0 : zn(window, t)) ?? Ia(t);
  if (n)
    return n;
  if (Fa(t) || qg(t))
    return Xg();
}, Bo = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, z6 = ["blockstack-session", "blockstack"], R6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of z6) {
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
R6();
const Yg = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Re = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, G6 = (t) => {
  const e = Re(t);
  if (!e)
    return null;
  const n = Yg(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, K6 = (t) => {
  const e = Re(t);
  if (!e)
    return null;
  const n = Yg(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, El = (t, e = "mainnet") => {
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
      return El(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return El(r, e);
  }
  return e;
}, Zr = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Ri = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Gs(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Ri(s, e + 1);
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
    const i = Ri(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Gs(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Gs(n.testnet) ? n.testnet.trim() : null;
}, Yd = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Zg = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && H6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ps = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Re(n == null ? void 0 : n.message) ?? Re(e.message) ?? Re(e.error) ?? Re(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, ci = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw ps(e);
    if (e.status === "error")
      throw ps(e.result ?? e);
  }
  return t;
}, Zd = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return ci(r);
  } catch (r) {
    throw ps(r);
  }
}, Qg = () => Xg(), Hu = () => {
  if (typeof window > "u")
    return;
  const t = Is();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = zn(t, e) ?? (t === window ? void 0 : zn(window, e));
    if (n)
      return n;
  }
}, Qd = () => {
  if (typeof window > "u")
    return;
  const t = Hu();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Is();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = zn(e, n) ?? (e === window ? void 0 : zn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, jo = (t) => {
  var r, s;
  const e = ss();
  if (Fa(e) || qg(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Is() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Qg();
}, wc = (t) => {
  const e = K6(t);
  if (!e)
    return null;
  try {
    const n = Pu(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, fa = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = wc(t), r = G6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Re(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = fa(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Xd)
    if (wc(s[a])) {
      i = Re(s[a]);
      break;
    }
  const o = Re(s.txId) || Re(s.txid) || Re(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Re(s.txRaw) ?? void 0
    };
  for (const a of Xd) {
    const c = wc(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Re(s[a]) ?? void 0
      };
  }
  for (const a of D6) {
    const c = s[a], f = fa(c, e + 1);
    if (f)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...f,
        txId: f.txId,
        txid: f.txid ?? f.txId
      };
  }
  return null;
}, bc = (t) => {
  const e = fa(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, V6 = (t) => {
  const e = fa(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, W6 = (t) => ({
  ...t,
  fee: Zr(t.fee),
  nonce: Zr(t.nonce),
  sponsored: t.sponsored === !0
}), Jd = (t) => ({
  recipient: t.recipient,
  amount: Zr(t.amount) ?? "0",
  memo: t.memo,
  network: El(t.network),
  address: t.stxAddress,
  fee: Zr(t.fee),
  nonce: Zr(t.nonce),
  sponsored: t.sponsored ?? !1
}), Jg = "WALLET_ADDRESS_MISMATCH", q6 = 45e3;
let Ti = null;
const Al = (t) => {
  t && (Ti = { address: t, at: Date.now() });
}, X6 = () => {
  Ti = null;
}, Y6 = () => Ti && Date.now() - Ti.at <= q6 ? Ti.address : null, Z6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, Q6 = async (t) => {
  X6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = ci(await t.request("wallet_connect")), n = Ri(e);
  return Al(n), n;
}, J6 = async (t, e, n, r) => {
  try {
    return ci(await t.request(e, n));
  } catch (s) {
    const i = ps(s);
    if (!Z6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await Q6(t);
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
        { code: o ? Jg : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return ci(await t.request(e, n));
    } catch (a) {
      throw ps(a);
    }
  }
};
let th = 3e4;
const t5 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${th / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, th);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, e5 = async (t, e, n) => {
  const r = (c, f) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${f}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Jg }
      );
    return c;
  }, s = Y6();
  if (s)
    return Bo(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Bo(n, "account-read");
  try {
    const c = ci(
      await t5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Ri(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Zg(c))
      throw ps(c);
    Bo(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Al(i), r(i, "wallet_getAccount");
  let o;
  Bo(n, "account-reconnect");
  try {
    o = ci(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ps(c);
  }
  const a = Ri(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Al(a), r(a, "wallet_connect");
}, n5 = async (t, e) => {
  if (!jo(t)) {
    const i = await Zd(
      t,
      "stx_transferStx",
      Jd(e)
    );
    return bc(i);
  }
  const n = Hu();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Zd(
      n,
      "stx_transferStx",
      Jd(e)
    );
    return bc(i);
  }
  const r = Qg();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await e5(r, e.stxAddress);
  const s = await J6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Zr(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Zr(e.fee) } : {}
    },
    e.stxAddress
  );
  return bc(s);
}, r5 = () => ss(), ty = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ss(), e = t ? j6(t) : void 0;
  if (e)
    return e;
  const n = Is() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, eh = (t, e) => {
  const n = ty(), r = W6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, V6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Io(r, e);
  if (jo(n) && !Hu()) {
    const s = Qd();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ss(),
        route: "legacy-transaction-request"
      }), Io(r, s);
  }
  return void n5(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Yd(s) && jo(n)) {
      const a = Qd();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ss(),
          route: "legacy-transaction-request"
        }), Io(r, a);
        return;
      }
    }
    if (Yd(s) && !jo(n)) {
      Io(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Zg(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, nh = (t) => Fg(t).replace(/^0x/, ""), rh = "This wallet cannot sign messages. Try Xverse or Leather.", sh = (t) => typeof (t == null ? void 0 : t.request) == "function", ih = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", s5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, i5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function o5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: nh(e.message),
    domain: nh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function a5(t, e) {
  const n = await tA({
    domain: e.domain,
    message: e.message,
    network: Na(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function oh(t) {
  var s, i;
  const e = r5() || "", n = /xverse/i.test(e);
  let r = ty();
  if (n && !ih(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (ih(r))
    try {
      return await a5(r, t);
    } catch (o) {
      if (n || !sh(r) || !i5(o)) throw o;
    }
  if (!n && sh(r))
    try {
      return await o5(r, t);
    } catch (o) {
      throw s5(o) ? new Error(rh) : o;
    }
  throw new Error(rh);
}
const ah = 1000000n, zs = 1000000n, $l = 50n, gs = 3000n, Ji = 300n, To = 3000n, c5 = 50000n, ch = 200n, Mr = (t) => t + $l;
function Sn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / ah}.${(n % ah).toString().padStart(6, "0")}`;
}
function lh(t, e = Ji) {
  return t <= gs ? 0 : Number((t - gs) / Mr(e));
}
function uh(t, e = 0n) {
  const n = zs - t - e;
  return n > 0n ? n : 0n;
}
function l5(t, e = Ji) {
  return t > zs ? "over" : t < gs + Mr(e) ? "empty" : t < c5 ? "low" : "ok";
}
const u5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", f5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", d5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function h5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || d5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== u5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const ey = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", mc = 3, p5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [vl, ny] = ey.split("."), Xe = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Il(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function g5(t) {
  return Xe(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Cr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function ry(t, e = []) {
  const n = await Cr(`/v2/contracts/call-read/${vl}/${ny}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: vl, arguments: e.map((r) => "0x" + Xe(re(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Fn(Je(n.result));
}
async function y5() {
  const t = await Cr(`/v2/contracts/source/${vl}/${ny}?proof=0`);
  if (typeof t.source != "string" || await g5(t.source) !== f5) throw Error("Deployed source does not match the tested helper.");
  if (h5(await ry("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function sy(t) {
  return t.startsWith("SP") && Gs(t) && !t.includes(".");
}
async function w5(t) {
  var r;
  if (!sy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Cr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Cr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function b5(t) {
  const e = await Cr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function m5(t, e) {
  var s, i;
  const n = await ry("get-owner", [Bi(t), Bi(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !sy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function x5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Il(t), signal: AbortSignal.timeout(15e3) });
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
async function S5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function E5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Pu(Il(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Fs($i(ca.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Fs(r.contractAddress) + "." + r.contractName.content !== ey || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Xe(re(r.functionArgs[0])) !== Xe(re(Bi(t.core))) || Xe(re(r.functionArgs[1])) !== Xe(re(Bi(t.song))) || Xe(re(r.functionArgs[2])) !== Xe(re(P6(Il(t.id)))) || t.amount !== "50" || e.postConditionMode !== si.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Di.Equal || i.principal.prefix !== 2 || Fs(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Fs(r.contractAddress) + "." + r.contractName.content !== p5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Xe(re(r.functionArgs[0])) !== Xe(re(Bi(t.song))) || typeof t.liked != "boolean" || Xe(re(r.functionArgs[1])) !== Xe(re(U6(t.liked))) || t.amount !== "0" || e.postConditionMode !== si.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Fn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const A5 = "xtrata.xyz/radio/listening-wallet", $5 = "Link a temporary listening wallet for pay-per-play; no spending permission", ys = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Gs(t), v5 = (t) => ({
  domain: hs({ name: ge(A5), version: ge("1"), "chain-id": kn(1) }),
  message: hs({
    purpose: ge($5),
    main: ge(t.main),
    listening: ge(t.listening),
    issued: kn(t.issued)
  })
}), iy = 100000n, I5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function k5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !ys(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= iy).sort(I5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Mo = 50;
function da(t) {
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
async function L5(t, e, n = 4) {
  if (!ys(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Mo}&offset=${o}`, s = da(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Mo);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Mo ? s : da(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = k5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Mo);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Pn = 50, C5 = 6, B5 = 20, fh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function dh(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const i of n.results) {
    const o = i && typeof i == "object" && i.tx && typeof i.tx == "object" ? i.tx : i;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (s.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), f = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(f)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: f });
  }
  return { total: n.total, sent: r, rows: s };
}
async function T5(t, e, n) {
  if (!ys(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = da(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Pn}&offset=0`));
    if (!s || s.total > C5 * Pn) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Pn; o < s.total; o += Pn) {
      const a = da(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Pn}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (f) => `/extended/v1/address/${t}/transactions?limit=${Pn}&offset=${f}`, a = dh(await e(o(0)), t);
      if (!a || a.total > B5 * Pn) return { ok: !1 };
      const c = new Set(a.rows);
      for (const f of a.sent) i.set(f.txId, f);
      for (let f = Pn; f < a.total; f += Pn) {
        const d = dh(await e(o(f)), t);
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
function M5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(fh).map((l, g) => {
    const h = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: h, kind: "gift", to: r.payer, at: g } : ys(l.sender) && h >= iy ? { sender: l.sender, left: h, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: h, kind: "dust", to: null, at: g };
  }), i = s.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && ys(l.recipient) && l.amount > 0n).sort(fh), a = o.reduce((l, g) => l + g.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const f = (l, g) => {
    let h = g;
    for (const b of l) {
      if (h <= 0n) break;
      const m = b.left < h ? b.left : h;
      b.left -= m, h -= m;
    }
    return h;
  };
  for (const l of o) {
    const g = f(s.filter((h) => h.to === l.recipient), l.amount);
    g > 0n && f(s, g);
  }
  if (f(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
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
function _5(t, e) {
  const n = t.filter((f) => f.kind === "deposit").sort((f, d) => f.newest - d.newest), r = t.find((f) => f.kind === "gift"), s = t.filter((f) => f.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((f, d) => f + d.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((f, d) => {
    if (f.amount <= e) {
      a.push(f);
      return;
    }
    const l = d === n.length - 1 && !c;
    o.push({ to: f.to, kind: "deposit", mode: l ? "all" : "amount", send: f.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function hh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const xc = ["prepared", "signed", "unknown", "pending"], N5 = 30 * 6e4, Ns = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, U5 = 3e3, ph = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function P5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, f = !1, d = !1, l = !1, g = null, h = !1, b = "", m = "", L, S = null, T, w = [], B, I = -1 / 0;
  const H = /* @__PURE__ */ new Set();
  let Z = null, F = !1, q = 0, x = null, $ = null, O = !1, X = null, st = !1, z = null, Nt = !1, ae = !1, ne = !1, A = !1, N = !1, pt = 0, rt = null, ct = Promise.resolve();
  const Lt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Ji.toString()), Wt = (y) => !!i && !(i.features ?? []).includes(y), Gt = (y, C) => `xtrata.ppp.v1.${y}:${C}`, Ot = (y = i == null ? void 0 : i.address) => {
    if (!y) return [];
    try {
      const C = JSON.parse(t.store.get(Gt("entries", y)) || "[]");
      return Array.isArray(C) ? C : [];
    } catch {
      return [];
    }
  }, Ut = (y) => {
    const C = [y, ...Ot(y.address).filter((G) => !(G.txid === y.txid && G.kind === y.kind))].slice(0, 200);
    t.store.set(Gt("entries", y.address), JSON.stringify(C));
  }, tn = (y = i == null ? void 0 : i.address) => !!y && t.store.get(Gt("on", y)) !== "0", dn = (y) => {
    i != null && i.address && t.store.set(Gt("on", i.address), y ? "1" : "0");
  }, M = () => Ot().filter((y) => xc.includes(y.status)), R = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(Gt("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, D = (y) => {
    i != null && i.address && t.store.set(Gt("deposit", i.address), JSON.stringify(y));
  }, it = () => M().filter((y) => t.now() - y.created > N5 && H.has(y.txid)), lt = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), gt = () => lt() && !(i != null && i.linked), Kt = () => {
    const y = t.main();
    return !gt() && !!y && !!(i != null && i.linked) && i.linked !== y;
  }, Bt = (y) => Gt("return-to", y), de = (y = i == null ? void 0 : i.address) => {
    if (!y) return;
    const C = t.store.get(Bt(y));
    return C && ys(C) && C !== y ? C : void 0;
  }, ce = (y = i == null ? void 0 : i.address) => Z && Z.for === y ? Z.res : null;
  function le() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const y = de();
    if (y) return { to: y, kind: "chosen" };
    const C = ce();
    if (C != null && C.ok && C.funder) return { to: C.funder, kind: "funder" };
  }
  const u = (y) => Gt("gift", y);
  function E() {
    const y = i == null ? void 0 : i.address;
    if (!y) return null;
    if ((X == null ? void 0 : X.for) === y) return X.info;
    try {
      const C = JSON.parse(t.store.get(u(y)) || "null");
      return C && typeof C.returnTo == "string" && typeof C.treasury == "string" ? C : null;
    } catch {
      return null;
    }
  }
  async function k() {
    var ot;
    const y = i == null ? void 0 : i.address;
    if (!y || !t.giftInfo || !((ot = e == null ? void 0 : e.gifts) != null && ot.enabled) || st) return;
    const C = (X == null ? void 0 : X.for) === y ? X : null, G = C ? C.ok ? C.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (C && t.now() - C.at < G) return;
    st = !0;
    const Q = E();
    try {
      const W = await t.giftInfo(y);
      X = { for: y, info: W, ok: !0, at: t.now() }, t.store.set(u(y), JSON.stringify(W));
    } catch {
      X = { for: y, info: Q, ok: !1, at: t.now() };
    } finally {
      st = !1;
    }
  }
  const P = () => Ot().reduce((y, C) => xc.includes(C.status) ? y + BigInt(C.amount || "0") + BigInt(C.fee || "0") : y, 0n);
  function J() {
    if (o === void 0) return 0;
    const y = o - P() - BigInt(Y.length) * Mr(Lt());
    return y > 0n ? lh(y, Lt()) : 0;
  }
  const ft = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING";
  function Dt() {
    var C;
    if (!((C = E()) != null && C.player)) return null;
    const y = (G, Q) => ({ reason: G, text: Q });
    switch (Se()) {
      case "connect":
      case "wrong-wallet":
        return y("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return y("locked", "UNLOCK TO LISTEN");
      case "link":
        return y("link", "FINISH SETUP TO LISTEN");
      case "over":
        return y("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return R() ? y("arriving", "YOUR PLAYS ARE ARRIVING") : y("out", ft);
      case "ready":
        return !tn() || !(i != null && i.session) || i.session.playsLeft < 1 ? y("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : ne ? J() < 1 ? y("out", ft) : null : y("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const _t = 3 * 6e4, Pe = () => !!E() && !!t.history && !(i != null && i.linked);
  async function ks() {
    const y = i.address, C = E(), { balance: G, nonce: Q } = await t.chain.account(y), ot = await t.history(y, !0);
    if (!ot.ok) return null;
    const W = M5({ self: y, balance: G, inbound: ot.inbound, outgoing: ot.outgoing, gift: { sender: C.treasury, payer: C.returnTo } });
    if (!W.ok) return null;
    const at = _5(W.parts, To);
    return { balance: G, nonce: Q, parts: W.parts, steps: at.steps, tooSmall: at.tooSmall.length };
  }
  const Nr = () => Nt ? { state: "unavailable" } : !z || t.now() - z.at > _t || o !== void 0 && o !== z.balance ? { state: "none" } : z.plan;
  function Se() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const y = t.main();
    if (!gt()) {
      if (!y) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : Kt() ? "wrong-wallet" : i.state === "known" ? "locked" : !gt() && i.linked !== y ? "link" : o === void 0 ? "loading" : o > zs ? "over" : o < gs + Mr(Lt()) ? "fund" : "ready" : "loading";
  }
  const we = () => {
    var y, C, G, Q;
    return {
      step: Se(),
      busy: c,
      message: b,
      error: m,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : l5(o, Lt()),
      playsLeft: o === void 0 ? 0 : lh(o, Lt()),
      allowance: o === void 0 ? zs : uh(o, BigInt(((y = R()) == null ? void 0 : y.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: tn(),
      entries: Ot(),
      depositTxid: ((C = R()) == null ? void 0 : C.txid) ?? L,
      depositPending: !!R(),
      walletOutdated: Wt("like"),
      linkedListening: B && B === t.main() ? w.map((ot) => ot.listening) : [],
      serverLinked: !!S && T === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: it().length,
      armed: A,
      queued: Y.length,
      solo: gt(),
      returnTo: (G = le()) == null ? void 0 : G.to,
      returnToKind: (Q = le()) == null ? void 0 : Q.kind,
      funderState: (() => {
        const ot = ce();
        return ot ? ot.ok ? ot.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const ot = ce();
        return !!ot && ot.ok && ot.distinct > 1;
      })(),
      walletCannotSolo: gt() && Wt("standalone"),
      walletCannotMulti: Wt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((ot) => ot !== t.main() && ot !== (i == null ? void 0 : i.linked)),
      creditedTo: gt() && (i != null && i.address) && (x == null ? void 0 : x.for) === i.address && x.main ? x.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Gt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && ($ == null ? void 0 : $.for) === i.address && $.unused,
      gift: (() => {
        const ot = E();
        return ot ? { player: ot.player, from: ot.from, source: ot.source, amount: ot.amount } : null;
      })(),
      giftPlays: E() ? J() : 0,
      giftStop: Dt(),
      returnPlan: Nr()
    };
  }, Pt = (y, C = "") => {
    b = y, m = C, t.changed();
  };
  async function he(y, C) {
    if (!c) {
      c = y, m = "", t.changed();
      try {
        await C();
      } catch (G) {
        const Q = G instanceof Error ? G.message : String(G);
        m = /Cancelled in the listening wallet/.test(Q) ? "" : Q, m || (b = "Not now. Nothing was signed.", N = !0);
      } finally {
        c = null, await He(!0);
      }
    }
  }
  const ut = () => !!(e != null && e.enabled) && e.here && (gt() || !!t.main() && e.allowed), vt = () => ut() && !Kt(), Vt = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Ee = () => {
    if (Kt()) throw new Error(Vt());
  };
  async function en() {
    if (!ut()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Le = (y) => {
    const C = t.main();
    return y.request("listening.status", C ? { main: C } : void 0);
  };
  async function Vn(y = !1) {
    i != null && i.address && (!y && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function _n(y) {
    if ((B !== y || t.now() - I >= 6e4) && (w = await t.links(y), B = y, I = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === y) return;
    const C = `${y}:${i.address}`;
    T === C && S || (S = w.find((G) => G.listening === i.address) ?? null, T = C);
  }
  async function Ur() {
    const y = i == null ? void 0 : i.address;
    if (!gt() || !y || i != null && i.linked || !t.funder || F || !o || o <= 0n) return;
    const C = ce(y);
    if (C != null && C.ok && C.funder) return;
    const G = C != null && C.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, q - 1), 30 * 6e4);
    if (!(Z && Z.for === y && t.now() - Z.at < G)) {
      F = !0;
      try {
        Z = { for: y, res: await t.funder(y), at: t.now() };
      } catch {
        Z = { for: y, res: { ok: !1 }, at: t.now() };
      } finally {
        F = !1;
      }
      q = Z.res.ok ? 0 : q + 1;
    }
  }
  async function yi() {
    const y = i == null ? void 0 : i.address;
    if (!(!gt() || !y || i != null && i.linked || !t.mainOf || O) && !(x && x.for === y && (x.ok || t.now() - x.at < 6e4))) {
      O = !0;
      try {
        x = { for: y, main: await t.mainOf(y), ok: !0, at: t.now() };
      } catch {
        x = { for: y, main: null, ok: !1, at: t.now() };
      } finally {
        O = !1;
      }
    }
  }
  async function Ls() {
    const y = i == null ? void 0 : i.address;
    if (!(!y || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || ($ == null ? void 0 : $.for) === y) && t.store.get(Gt("created", y)) !== "1")
      try {
        $ = { for: y, unused: await t.chain.confirmedNonce(y) === 0n };
      } catch {
      }
  }
  async function Pr() {
    var ot;
    const y = i == null ? void 0 : i.address;
    if (!y) return !1;
    let C, G = !1;
    for (const W of M())
      try {
        const at = await t.chain.transaction(W.txid);
        if (!at) {
          if (H.add(W.txid), t.now() - W.created > 15 * 6e4 && (C ?? (C = await t.chain.confirmedNonce(y))), C !== void 0 && C > BigInt(W.nonce)) {
            Ut({ ...W, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((W.status === "unknown" || W.status === "signed") && W.raw)
            try {
              await t.chain.broadcast(W.raw, W.txid), Ut({ ...W, status: "pending" });
            } catch (zt) {
              Ns(zt) && Ut({ ...W, status: "failed", note: zt.message, raw: void 0 });
            }
          continue;
        }
        H.delete(W.txid);
        const $t = String(at.tx_status);
        if ($t === "success" && at.canonical !== !1 && at.is_unanchored === !1) {
          if (Ut({ ...W, status: "confirmed", confirmedAt: t.now(), actualFee: String(at.fee_rate ?? W.fee), raw: void 0 }), G = !0, W.kind === "like" && (h = !0, W.status !== "confirmed" && typeof W.liked == "boolean"))
            try {
              (ot = t.likeConfirmed) == null || ot.call(t, W.song, W.liked);
            } catch {
            }
        } else $t.startsWith("abort_") || $t.startsWith("dropped_") ? Ut({ ...W, status: "failed", note: $t, raw: void 0 }) : W.status !== "pending" && Ut({ ...W, status: "pending" });
      } catch {
      }
    const Q = R();
    if (Q)
      try {
        const W = await t.chain.transaction(Q.txid), at = String((W == null ? void 0 : W.tx_status) ?? "");
        (at === "success" && W.is_unanchored === !1 || at.startsWith("abort_") || at.startsWith("dropped_") || !W && t.now() - Q.at > 2 * 36e5) && (D(null), a = -1 / 0, /on its way/i.test(b) && (b = ""));
      } catch {
      }
    return G;
  }
  async function He(y = !1) {
    var C;
    try {
      const G = t.main();
      if ((y || !e || r !== G || t.now() - n > 3e5) && (e = await t.config(G), n = t.now(), r = G), !e.enabled || !e.here || !gt() && (!G || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), A && Wn(), t.changed();
        return;
      }
      await en(), i = await Le(s), Kt() && i.state === "unlocked" && (Qn(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Le(s)), G && e.allowed && await _n(G), await Vn(y), await Ur(), await yi(), await Ls(), await k(), await Pr() && await Vn(!0);
    } catch (G) {
      m = G instanceof Error ? G.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (Se() === "locked" ? Cs() : A && Wn(), h) {
      h = !1;
      try {
        (C = t.likesChanged) == null || C.call(t);
      } catch {
      }
    }
    t.changed(), Y.length && !Zn && wi();
  }
  async function Oe(y, C) {
    var W;
    Ee();
    const G = !(i != null && i.address) || tn(i.address), Q = i != null && i.linked ? (W = t.nameOf) == null ? void 0 : W.call(t, i.linked) : void 0;
    await y.request("listening.unlock", { mode: "unlock", terms: G ? qn() : void 0, anyPasskey: C, ...t.main() ? { main: t.main() } : {}, ...Q ? { label: Q } : {} }), i = await Le(y), G && (tn(i.address) ? await Xn() : await y.request("listening.stop")), Pt(G ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const ot = g;
    g = null, ot && t.now() - ot.at < 12e4 && setTimeout(() => void He(!0).then(() => hn(ot)), 0);
  }
  function Cs() {
    A || c || N || pt >= 3 || !s || !(i != null && i.address) || (A = !0, ct = (async () => {
      try {
        await Oe(s, !1), pt = 0;
      } catch (y) {
        const C = y instanceof Error ? y.message : String(y);
        /Cancelled in the listening wallet/.test(C) ? rt || (N = !0, Pt("Not now. Nothing was signed.")) : /did not answer/.test(C) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (pt++, m = C);
      } finally {
        A = !1;
        const y = rt;
        rt = null, y ? await y() : await He(!0);
      }
    })());
  }
  async function Wn(y) {
    A && (rt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ct), y && await y(), t.changed();
  }
  const qn = () => ({
    fee: Lt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: zs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Xn() {
    if (!(i != null && i.address)) return !1;
    if (ne || (ne = await t.tabLock(i.address)), !ne)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Yn(y, C) {
    const G = i.address, { balance: Q, nonce: ot } = C ?? await t.chain.account(G);
    o = Q;
    const W = await s.request("listening.prepareReturn", {
      mode: y.mode,
      balance: Q.toString(),
      nonce: ot.toString(),
      fee: To.toString(),
      ...y.amount !== void 0 ? { amount: y.amount.toString() } : {},
      ...y.linked ? {} : { destination: y.to }
    });
    if (W.recipient !== y.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const at = y.mode === "amount" ? y.amount : y.mode === "all" ? Q - To : Q - zs - To, $t = Pu(W.raw);
    if (Fn($t.payload.recipient).value !== y.to || String($t.payload.amount) !== W.amount || at !== void 0 && W.amount !== at.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const zt = {
      id: ph(),
      address: G,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: W.recipient,
      amount: W.amount,
      fee: W.fee,
      nonce: ot.toString(),
      created: t.now(),
      status: "signed",
      raw: W.raw,
      txid: W.txid
    };
    t.validate(zt), Ut(zt);
    try {
      await t.chain.broadcast(W.raw, W.txid), Ut({ ...zt, status: "pending" });
    } catch (pn) {
      throw Ut({ ...zt, status: "unknown", note: pn.message }), pn;
    }
    return W;
  }
  async function Ce(y) {
    if (M().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Wt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const C = await ks().catch(() => null);
    if (!C)
      throw z = null, Nt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Nt = !1, o = C.balance;
    const G = { balance: C.balance, nonce: C.nonce };
    if (y === "excess") {
      const $t = hh(C.parts) ?? de();
      if (!$t) throw new Error("Choose where to send the excess first.");
      await Yn({ mode: "excess", to: $t, linked: !1 }, G), z = null, Pt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Q = C.steps;
    if (!Q.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!z && z.balance === C.balance && t.now() - z.at <= _t && z.steps.length === Q.length && z.steps.every(($t, zt) => $t.to === Q[zt].to && $t.mode === Q[zt].mode && $t.send === Q[zt].send))) {
      z = {
        at: t.now(),
        balance: C.balance,
        steps: Q,
        parts: C.parts,
        plan: { state: "ready", steps: Q.map(($t) => ({ to: $t.to, kind: $t.kind, send: $t.send.toString() })), kept: C.tooSmall, excess: hh(C.parts) }
      }, Pt(Q.length > 1 ? `This goes back in ${Q.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const W = Q[0], at = W.to ?? de();
    if (!at) throw new Error("Choose where to send the rest first.");
    if (W.mode === "amount" && Wt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Yn({ mode: W.mode, to: at, linked: !1, ...W.mode === "amount" ? { amount: W.send } : {} }, G), z = null, Q.length === 1 ? (dn(!1), Pt("Returned ✓ Paying is off.")) : Pt(`Returned ✓ ${Q.length - 1} more ${Q.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const j = {
    forceRefresh: () => He(!0),
    create: () => he("Waiting for your passkey…", async () => {
      const y = await en();
      await y.request("listening.unlock", { mode: "create", terms: qn(), ...t.main() ? { main: t.main() } : {} }), i = await Le(y), i.address && t.store.set(Gt("created", i.address), "1"), dn(!0), Pt(gt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Xn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (y, C) => {
      !(i != null && i.address) || R() || (D({ txid: y, amount: C.toString(), at: t.now() }), a = -1 / 0, X = null, Pt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    unlock: (y = !1) => {
      const C = () => he("Waiting for your passkey…", async () => Oe(await en(), y));
      return A ? y ? Wt("cancel") ? (Pt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Wn(async () => {
        (Se() === "locked" || Se() === "intro") && await C();
      }) : ct : C();
    },
    link: () => he("Sign in your wallet…", async () => {
      Ee();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const C = (await t.links(y)).find((G) => G.listening === i.address);
      if (C)
        await s.request("listening.link", { main: y, issued: C.issued, mainSignature: C.mainSignature });
      else {
        const G = { main: y, listening: i.address, issued: t.now() }, Q = await t.signWithMain(y, v5(G)), ot = await s.request("listening.link", { main: y, issued: G.issued, mainSignature: Q });
        await t.saveLink({ ...G, mainSignature: Q, listeningSignature: ot.listeningSignature }), I = -1 / 0;
      }
      Pt("Linked ✓");
    }),
    deposit: () => he("Approve the deposit in your wallet…", async () => {
      Ee();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (R()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Vn(!0);
      const C = uh(o ?? 0n);
      if (C <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      L = await t.deposit(y, i.address, C), L && D({ txid: L, amount: C.toString(), at: t.now() }), Pt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => he("Confirm in the listening wallet…", async () => {
      if (!vt()) throw new Error("Connect your wallet first.");
      await Xn(), await s.request("listening.approveSession", qn()), dn(!0), Pt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => he("Clearing…", async () => {
      for (const y of it())
        await t.chain.transaction(y.txid) || Ut({ ...y, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Pt("Cleared ✓");
    }),
    switchOff: () => he("Switching off…", async () => {
      Qn(), await (s == null ? void 0 : s.request("listening.stop")), dn(!1), Pt("Paying is off. Music stays free.");
    }),
    lock: () => he("Locking…", async () => {
      Qn(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Pt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (y) => {
      const C = String(y ?? "").trim();
      if (!(i != null && i.address)) return Pt("", "Unlock the listening wallet first.");
      if (!ys(C)) return Pt("", "Enter a standard mainnet address (it starts with SP).");
      if (C === i.address) return Pt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Bt(i.address), C), Pt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(Bt(i.address), ""), t.changed();
    },
    returnFunds: (y) => he("Check the return in the listening wallet…", async () => {
      if (!vt()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Pe()) return Ce(y);
      const C = le();
      if (!C) throw new Error(gt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (C.kind !== "linked" && Wt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (M().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Yn({ mode: y, to: C.to, linked: C.kind === "linked" }), y === "all" && dn(!1), Pt(y === "all" ? C.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Y = [], ue = 10, be = 30 * 6e4;
  let Zn = !1;
  const nn = () => f || !!c || d || l, Qn = () => {
    Y.length && (Y.length = 0, t.changed());
  };
  async function ja(y) {
    if (!Y.some((C) => C.id === y.id) && !Ot().some((C) => C.id === y.id) && (Y.push({ ...y, at: t.now() }), Y.length > ue && Y.shift()), nn() || M().length) {
      const C = Y.length;
      b = `Queued ${C === 1 ? "this song" : C + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await wi();
  }
  async function wi() {
    if (!Zn) {
      Zn = !0;
      try {
        for (; Y.length; ) {
          for (; Y.length && t.now() - Y[0].at > be; ) Y.shift();
          if (!Y.length || nn() || await za(Y[0]) === "wait") return;
          Y.shift();
        }
      } finally {
        Zn = !1, t.changed();
      }
    }
  }
  async function za(y) {
    var C;
    f = !0;
    try {
      await He();
      const G = Se();
      if (G === "loading") return "wait";
      if (G !== "ready" || !tn() || !(i != null && i.session) || i.session.playsLeft < 1 || !ne) return "done";
      if (M().length) return "wait";
      ae || (await t.chain.verify(), ae = !0);
      const Q = i.address, { balance: ot, nonce: W } = await t.chain.account(Q);
      o = ot, a = t.now();
      const at = await t.chain.owner(mc, y.song);
      if (at === Q || at === t.main()) return "done";
      const $t = await s.request("listening.signPlay", {
        core: mc,
        song: y.song,
        receipt: y.id,
        fee: Lt().toString(),
        nonce: W.toString(),
        balance: ot.toString()
      }), zt = {
        id: y.id,
        address: Q,
        kind: "play",
        core: mc,
        song: y.song,
        recipient: at,
        amount: "50",
        fee: Lt().toString(),
        nonce: W.toString(),
        created: t.now(),
        status: "signed",
        raw: $t.raw,
        txid: $t.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(zt), Ut(zt);
      const pn = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`;
      try {
        await t.chain.broadcast($t.raw, $t.txid), Ut({ ...zt, status: "pending" }), b = `♪ Paid ${pn}`, m = "";
      } catch (Be) {
        Ut({ ...zt, status: Ns(Be) ? "failed" : "unknown", note: Be.message, ...Ns(Be) ? { raw: void 0 } : {} }), m = Be.message;
      }
      return i = await Le(s), "done";
    } catch (G) {
      const Q = G instanceof Error ? G.message : "payment unavailable";
      return (C = E()) != null && C.player ? (b = "Payment is taking a moment: " + Q, "wait") : (b = "This song played free: " + Q, "done");
    } finally {
      f = !1, t.changed();
    }
  }
  function Ra(y) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Se()) || Wt("like") ? !1 : (hn(y), !0);
  }
  async function hn(y) {
    const C = y.title ? `“${y.title}”` : `song #${y.song}`, G = (De) => {
      var gn;
      m = De, b = "";
      try {
        (gn = t.likeFailed) == null || gn.call(t, y.song);
      } catch {
      }
      t.changed();
    }, Q = Se(), ot = t.main(), W = gt() ? i == null ? void 0 : i.address : ot;
    if (Q === "locked") {
      g = { ...y, at: t.now() }, Pt(`Unlock to like ${C}. It sends straight after.`);
      return;
    }
    if (Q === "wrong-wallet") return G(Vt());
    if (Q === "link") return G("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (gt() && Wt("standalone")) return G("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (Q === "fund") return G("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (Q === "over") return G("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Q !== "ready" || !W) return G("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return G("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!ne) return G("Pay-per-play is running in another tab. Like from that tab.");
    const at = Ot().find((De) => De.kind === "like" && De.song === y.song);
    if (at && xc.includes(at.status))
      return G(`Your last like for ${C} is still on its way. It can change again once it confirms.`);
    if (d) return G("One like at a time: your last one is still being sent.");
    if ((at == null ? void 0 : at.status) === "confirmed" && t.now() - (at.confirmedAt ?? 0) < U5)
      return G(`Your like for ${C} has only just confirmed. Try again in a moment.`);
    let $t;
    l = !0;
    try {
      $t = t.likeState ? (await t.likeState(W, y.song)).by : y.likedBy ?? [];
    } catch {
      $t = y.likedBy;
    } finally {
      l = !1;
    }
    if (!$t) return G(`Could not check ${C} right now. Try the heart again.`);
    const zt = i.address, Be = ((at == null ? void 0 : at.status) === "confirmed" && typeof at.liked == "boolean" && t.now() - (at.confirmedAt ?? at.created) < 5 * 6e4 ? at.liked : void 0) ?? $t.includes(zt);
    if (!Be && $t.some((De) => De !== zt)) return G(gt() ? `${C} was liked from another wallet of yours. Unlike it there.` : `${C} was liked from your main wallet${$t.includes(ot) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Ga({ song: y.song, liked: !Be, title: y.title, artist: y.artist });
  }
  async function Ga(y) {
    var Q, ot, W;
    if (d) {
      Pt("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const C = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`, G = t.wait ?? ((at) => new Promise(($t) => setTimeout($t, at)));
    try {
      Pt(`${y.liked ? "Liking" : "Unliking"} ${C}…`);
      const at = t.now() + 12e4;
      for (; f || M().length; ) {
        if (t.now() > at) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await G(5e3), await He(!0);
      }
      if (Se() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const $t = i.address, { balance: zt, nonce: pn } = await t.chain.account($t);
      o = zt, a = t.now();
      const Be = await s.request("listening.signLike", {
        song: y.song,
        liked: y.liked,
        fee: ch.toString(),
        nonce: pn.toString(),
        balance: zt.toString()
      }), De = {
        id: ph(),
        address: $t,
        kind: "like",
        core: 0,
        song: y.song,
        liked: y.liked,
        recipient: "",
        amount: "0",
        fee: ch.toString(),
        nonce: pn.toString(),
        created: t.now(),
        status: "signed",
        raw: Be.raw,
        txid: Be.txid,
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(De), Ut(De);
      try {
        await t.chain.broadcast(Be.raw, Be.txid), Ut({ ...De, status: "pending" }), b = `${y.liked ? "♥ Liked" : "Unliked"} ${C}`, m = "";
        try {
          (Q = t.likeSent) == null || Q.call(t, y.song, y.liked);
        } catch {
        }
      } catch (gn) {
        if (Ut({ ...De, status: Ns(gn) ? "failed" : "unknown", note: gn.message, ...Ns(gn) ? { raw: void 0 } : {} }), m = gn.message, Ns(gn)) try {
          (ot = t.likeFailed) == null || ot.call(t, y.song);
        } catch {
        }
      }
      i = await Le(s);
    } catch (at) {
      m = "Like not sent: " + (at instanceof Error ? at.message : "the listening wallet is unavailable");
      try {
        (W = t.likeFailed) == null || W.call(t, y.song);
      } catch {
      }
    } finally {
      d = !1, t.changed(), wi();
    }
  }
  return { snapshot: we, refresh: He, onListened: ja, heart: Ra, toggleLike: hn, ...j };
}
const oy = ["Connect", "Passkey", "Link & fund", "Listen"], ay = ["Passkey", "Add 1 STX", "Listen"], kl = (t) => t ? ay : oy;
function H5(t) {
  if (t.solo) return O5(t);
  const e = oy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function O5(t) {
  const e = ay.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function D5(t, e) {
  return !e || e.at >= kl(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const F5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function j5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !F5(r.id)));
}
const z5 = {}, R5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, G5 = (t) => {
  const e = z5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, K5 = (t) => `/hiro/${t}`, V5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, W5 = (t) => {
  const e = G5(t);
  if (e)
    return [V5(e)];
  const n = R5[t];
  return typeof window < "u" ? [`${window.location.origin}${K5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, q5 = {}, gh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, X5 = "xtrata.log.enabled", Y5 = "xtrata.log.level", Z5 = "xtrata.log.tags", Q5 = "xtrata.log.dedupe", _o = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, J5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, t$ = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, e$ = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, n$ = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, r$ = () => {
  const t = q5 ?? {}, e = _o(X5) ?? t.VITE_LOG_ENABLED, n = _o(Y5) ?? t.VITE_LOG_LEVEL, r = _o(Z5) ?? t.VITE_LOG_TAGS, s = _o(Q5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: J5(e),
    level: t$(n) ?? "warn",
    tags: n$(r),
    dedupe: e$(s)
  };
}, s$ = (t, e, n) => !t.enabled || gh[n] < gh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), i$ = (t, e, n, r) => {
  const s = r$();
  if (!s$(s, e, t) || a$(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, o$ = /* @__PURE__ */ new Set();
let yh = null;
const a$ = (t, e, n, r, s) => (yh !== t && (o$.clear(), yh = t), !1), c$ = (t, e, n) => i$("debug", t, e, n), l$ = {}, u$ = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, f$ = (t) => {
  const e = l$, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : u$[t];
}, d$ = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, h$ = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return d$.test(n) ? n : null;
}, p$ = (t) => t.replace(/\/+$/, ""), g$ = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), wh = (t) => {
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
}, Us = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, y$ = (t) => {
  var c, f;
  let e;
  try {
    e = Fn(w6(t));
  } catch {
    return null;
  }
  const n = Us(e);
  if (!n || n.success === !1)
    return null;
  const r = Us(n.value), s = Us(r == null ? void 0 : r.value), i = Us(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = wh((c = Us(i.name)) == null ? void 0 : c.value), a = wh((f = Us(i.namespace)) == null ? void 0 : f.value);
  return !o || !a ? null : h$(`${o}.${a}`);
}, w$ = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${p$(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Fg(Ag(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : y$(i.result);
}, b$ = async (t) => {
  const e = t.address.trim();
  if (!Gs(e))
    return null;
  const n = f$(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of W5(t.network))
    try {
      return await w$({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return c$("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: g$(r)
  }), null;
};
function m$(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, i = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((f) => {
      c.pending = !1, f && (c.name = f, e());
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
const bh = Object.freeze({
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
function x$(t, e = "") {
  return Object.hasOwn(bh, String(t)) ? bh[String(t)] : e;
}
const mh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function S$(t, e = "") {
  return Object.hasOwn(mh, String(t)) ? mh[String(t)] : e;
}
const E$ = 100000n, xh = 1000000n, A$ = 3000n, $$ = (t, e) => `${t}#gift=${e}`, v$ = 100, Sh = (t, e = Ji) => t <= gs ? 0 : Number((t - gs) / Mr(e)), Eh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), cy = "xtrata.xyz/radio/gifts", I$ = "Create Xtrata radio gift links paid from the gift treasury", k$ = (t) => ({
  domain: hs({ name: ge(cy), version: ge("1"), "chain-id": kn(1) }),
  message: hs({
    purpose: ge(I$),
    admin: ge(t.admin),
    count: kn(t.count),
    amount: kn(BigInt(t.amount)),
    label: ge(t.label),
    issued: kn(t.issued),
    ...t.player ? { player: ge(t.player) } : {}
  })
}), Ah = 40, L$ = "Create an Xtrata radio gift player", C$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function $h(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && C$.test(t) : !n;
}
function B$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!$h(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!$h(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > Ah) throw new Error(`A player holds 1 to ${Ah} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: null };
}
const T$ = (t) => I0(M0(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), M$ = (t) => ({
  domain: hs({ name: ge(cy), version: ge("1"), "chain-id": kn(1) }),
  message: hs({
    purpose: ge(L$),
    admin: ge(t.admin),
    player: ge(t.hash),
    issued: kn(t.issued)
  })
}), vh = (t, e = Ji) => gs + BigInt(t) * Mr(e), Ih = [300, 500, 1e3], kh = 1800, Sc = /* @__PURE__ */ new Map();
async function ly(t) {
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
async function _$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await ly(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function uy(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Sc.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Sc.set(t, { ...a, until: Date.now() + kh });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Sc.delete(t), s();
      }, kh + 50);
    }
  }, i;
}
const Mi = (t, e, n, r, s) => uy(t, e, async () => await ly(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Dr = "xtrata.radio.gift.incoming.v1", Lh = (t) => "xtrata.radio.gift.mine.v1:" + t, ht = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Fr = (t, e, n = "") => {
  const r = ht("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ei = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Ps = (t) => Sn(t).replace(/\.?0+$/, "");
function N$(t) {
  let e = null;
  const n = (() => {
    try {
      const M = new URL(location.href), R = new URLSearchParams(M.hash.slice(1)).get("gift") ?? M.searchParams.get("gift");
      return R !== null && (M.searchParams.delete("gift"), history.replaceState(null, "", M.pathname + (M.search || ""))), Eh(R) ? R : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const M = JSON.parse(t.store.get(Dr) || "null");
      return Eh(M == null ? void 0 : M.code) ? M.code : null;
    } catch {
      return null;
    }
  })(), s = n ?? r;
  s && (e = { code: s }, t.store.set(Dr, JSON.stringify({ code: s, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (M) => {
    const R = await M.json().catch(() => ({}));
    if (!M.ok)
      throw M.status === 404 && t.store.set(Dr, null), new Error((R == null ? void 0 : R.error) || "Could not check your gift right now. Reload to try again.");
    const D = R;
    e = { ...e, view: D }, ["claimed", "expired", "refunding", "refunded"].includes(D.status) && t.store.set(Dr, null), t.changed();
  }).catch((M) => {
    e = { ...e, error: M.message }, t.changed();
  }));
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = () => {
    e = null, t.store.set(Dr, null), t.changed();
  }, a = (M) => M.from ? t.who(M.from) : M.label ? `Xtrata Radio · ${M.label}` : "Xtrata Radio";
  let c = {};
  const f = (M) => {
    if (c.box) return c.box;
    const R = ht("div", "", "ppp-gift-check");
    c.box = R;
    const D = () => {
      const it = window.turnstile;
      !it || c.rendered || (c.rendered = !0, it.render(R, { sitekey: M, callback: (lt) => {
        c.token = lt, t.changed();
      }, "expired-callback": () => {
        c.token = void 0;
      } }));
    };
    if (window.turnstile) D();
    else {
      const it = document.createElement("script");
      it.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", it.async = !0, it.onload = D, document.head.append(it);
    }
    return R;
  };
  let d;
  async function l(M) {
    var R, D;
    if (!(!e || e.claiming || !M.listening)) {
      e.claiming = !0, e.error = void 0, t.changed();
      try {
        const it = await fetch("/radio/gift/claim", {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(3e4),
          body: JSON.stringify({ code: e.code, wallet: M.listening, turnstile: c.token })
        }), lt = await it.json().catch(() => ({}));
        if (it.status === 503 && /sending another gift/.test((lt == null ? void 0 : lt.error) || "")) {
          e.waiting = !0, clearTimeout(d), d = setTimeout(() => {
            e && (e.waiting = !1, t.changed());
          }, 12e3);
          return;
        }
        if (!it.ok)
          throw (it.status === 404 || it.status === 410 || it.status === 409 && /already had a gift|brand-new/.test((lt == null ? void 0 : lt.error) || "")) && t.store.set(Dr, null), new Error((lt == null ? void 0 : lt.error) || `Could not claim the gift (${it.status}).`);
        e.done = !0, t.store.set(Dr, null), t.giftSent(lt.txid, BigInt(lt.amount));
      } catch (it) {
        e.error = it.message, c.token = void 0;
        try {
          (D = (R = window.turnstile) == null ? void 0 : R.reset) == null || D.call(R, c.box);
        } catch {
        }
      } finally {
        e.claiming = !1, t.changed();
      }
    }
  }
  let g = null;
  function h(M) {
    if (!M.listening || !M.depositPending || M.step !== "fund")
      return g = null, [];
    if (!g || g.wallet !== M.listening || t.now() - g.at > 3e4) {
      const R = M.listening;
      g = { ...(g == null ? void 0 : g.wallet) === R ? g : {}, wallet: R, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(R)).then((D) => {
        var it, lt;
        (g == null ? void 0 : g.wallet) === R && (g.state = (it = D == null ? void 0 : D.gift) == null ? void 0 : it.state, g.problem = ((lt = D == null ? void 0 : D.gift) == null ? void 0 : lt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    return g.state === "sending" && g.problem ? [ht("p", `🎁 Your gift is waiting to go out (${g.problem}). It is retried automatically.`, "ppp-warn")] : [];
  }
  function b(M) {
    var le, u;
    const R = h(M);
    if (!e || ["off", "elsewhere"].includes(M.step)) return R;
    const D = e.view;
    if (e.error && !D) return [ht("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!D) return [ht("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return R;
    if (D.status === "claimed" || D.status === "claiming") return [ht("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [ht("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [ht("p", `🎁 ${a(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (!!M.listening && (!(M.createdHere || M.brandNew) || !!M.linked || !!M.creditedTo || (M.balance ?? 0n) > 0n || M.entries.length > 0))
      return [ht("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Fr("Forget this gift link here", o, "quiet")];
    const lt = BigInt(D.amount), gt = Sh(lt).toLocaleString(), Bt = [ht("p", D.player ? `🎁 ${a(D)} sent you “${D.player.title}”${D.player.subtitle ? ` by ${D.player.subtitle}` : ""}: ${D.player.tracks.length} ${D.player.tracks.length === 1 ? "song" : "songs"} and ${gt} plays of on-chain music.` : `🎁 ${a(D)} sent you ${Ps(lt)} STX of on-chain music: about ${gt} paid plays.`, "ppp-gift")], de = !!M.listening && (M.createdHere || M.brandNew) && !M.linked && !M.creditedTo && M.step === "fund" && (M.balance ?? 1n) === 0n && !M.depositPending && !M.entries.length, ce = (u = (le = M.gate) == null ? void 0 : le.gifts) == null ? void 0 : u.turnstileSiteKey;
    return de ? (ce && !c.token ? Bt.push(ht("p", "One quick check and it is yours:", "ppp-mute"), f(ce)) : !e.claiming && !e.error && !e.waiting && l(M), (e.claiming || e.waiting) && Bt.push(ht("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && Bt.push(ht("p", e.error, "ppp-bad"), Fr("Try again", () => {
      e.error = void 0, l(M);
    }))) : M.step === "intro" ? Bt.push(ht("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : M.listening && M.linked ? Bt.push(ht("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Fr("Forget this gift link here", o, "quiet")) : M.listening && (M.balance ?? 0n) > 0n && Bt.push(ht("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Fr("Forget this gift link here", o, "quiet")), Bt;
  }
  async function m(M, R, D) {
    var it;
    try {
      const lt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(M));
      if ((it = lt == null ? void 0 : lt.gift) != null && it.returnTo) return { ok: !0, funder: lt.gift.returnTo, txId: lt.gift.txid ?? void 0, amount: lt.gift.amount, distinct: 1 };
    } catch {
      if (D) return { ok: !1 };
    }
    return R();
  }
  const L = ht("div", "", "ppp-gift-fold");
  let S = 250000n, T = "", w = "", B = null;
  const I = (M) => {
    try {
      const R = JSON.parse(t.store.get(Lh(M)) || "[]");
      return Array.isArray(R) ? R : [];
    } catch {
      return [];
    }
  }, H = (M, R) => t.store.set(Lh(M), JSON.stringify(R.slice(0, 50)));
  let Z = 0;
  async function F(M) {
    const R = I(M);
    for (const D of R)
      if (!(D.view && ["claimed", "refunded", "expired"].includes(D.view.status)))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: D.id, ...D.txid ? { txid: D.txid } : {} }) }) : await t.json("/radio/gift?id=" + D.id), D.error = void 0;
        } catch (it) {
          D.error = it.message;
        }
    H(M, R), t.changed();
  }
  async function q(M) {
    if (T) return;
    T = "Starting your gift…", w = "", t.changed();
    let R = null;
    try {
      R = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: M, amount: S.toString() }) });
      const D = I(M);
      D.unshift({ id: R.id, code: R.code, amount: S.toString(), at: t.now() }), H(M, D), T = "Approve the gift in your wallet…", t.changed();
      const it = await t.pay(M, R.depositTo, BigInt(R.deposit), R.memo), lt = I(M), gt = lt.find((Kt) => Kt.id === R.id);
      gt && (gt.txid = it, gt.view = { status: "pending-deposit", amount: S.toString(), source: "friend", from: M, label: "", expires: 0 }), H(M, lt), w = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", F(M);
    } catch (D) {
      w = D.message || "Not sent.";
    } finally {
      T = "", t.changed();
    }
  }
  const x = (M) => "xtrata.radio.gift.players.v1:" + M, $ = (M) => {
    try {
      const R = JSON.parse(t.store.get(x(M)) || "[]");
      return Array.isArray(R) ? R.filter((D) => D && /^[0-9a-f]{16}$/.test(D.id)) : [];
    } catch {
      return [];
    }
  };
  async function O(M, R) {
    if (!T) {
      T = "Checking the player…", w = "", t.changed();
      try {
        const D = R.tracks.split(/[\s,]+/).filter(Boolean).map((de) => Number(de.replace(/^#/, ""))), it = B$({ title: R.title.trim(), subtitle: R.subtitle.trim(), tracks: D, cover: null });
        T = "Sign in your wallet…", t.changed();
        const lt = { admin: M, hash: T$(it), issued: t.now() }, gt = await t.sign(M, M$(lt));
        T = "Making the player…", t.changed();
        const Kt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: it, request: lt, signature: gt }) }), Bt = $(M).filter((de) => de.id !== Kt.id);
        Bt.unshift({ id: Kt.id, title: Kt.title, tracks: Kt.tracks }), t.store.set(x(M), JSON.stringify(Bt.slice(0, 30))), w = `${Kt.existing ? "That player already exists" : "Player made"} ✓ “${Kt.title}” · ${Kt.tracks} songs. Pick it below for a campaign.`;
      } catch (D) {
        w = D.message || "Not made.";
      } finally {
        T = "", t.changed();
      }
    }
  }
  async function X(M, R, D, it, lt) {
    if (!T) {
      T = "Sign in your wallet…", w = "", B = null, t.changed();
      try {
        const gt = { admin: M, count: R, amount: D.toString(), label: it, issued: t.now(), ...lt ? { player: lt } : {} }, Kt = await t.sign(M, k$(gt));
        T = "Making links…", t.changed();
        const Bt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: gt, signature: Kt }) });
        B = { codes: Bt.codes, amount: Bt.amount };
      } catch (gt) {
        w = gt.message || "Not made.";
      } finally {
        T = "", t.changed();
      }
    }
  }
  const st = (M, R) => $$(M || location.origin + "/radio.html", R), z = (M) => _$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: M }), Nt = ht("input");
  Nt.type = "range", Nt.min = String(E$), Nt.max = String(xh), Nt.step = "50000", Nt.value = String(S), Nt.setAttribute("aria-label", "Gift amount");
  const ae = ht("p", "", "ppp-gift-amount"), ne = Fr("", () => {
    const M = t.main();
    M && q(M);
  }, "primary"), A = () => {
    ae.textContent = N(), ne.textContent = `Gift ${Ps(S)} STX`;
  };
  Nt.oninput = () => {
    S = BigInt(Nt.value), A();
  };
  const N = () => `${Ps(S)} STX · about ${Sh(S).toLocaleString()} paid plays · you pay ${Ps(S + A$)} STX with the network fee`;
  A();
  const pt = ht("input");
  pt.type = "number", pt.min = "1", pt.max = String(v$), pt.value = "10", pt.setAttribute("aria-label", "How many links");
  const rt = ht("input");
  rt.type = "number", rt.min = "0.1", rt.max = "1", rt.step = "0.05", rt.value = String(Number(vh(Ih[0])) / 1e6), rt.setAttribute("aria-label", "STX per link");
  const ct = ht("input");
  ct.maxLength = 60, ct.placeholder = "Title, e.g. Proof of Sound", ct.setAttribute("aria-label", "Player title");
  const Lt = ht("input");
  Lt.maxLength = 80, Lt.placeholder = "Artist (optional)", Lt.setAttribute("aria-label", "Player subtitle");
  const Wt = ht("textarea");
  Wt.rows = 3, Wt.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Wt.setAttribute("aria-label", "Songs");
  const Gt = ht("select");
  Gt.setAttribute("aria-label", "Gift player");
  const Ot = ht("select");
  Ot.setAttribute("aria-label", "Plays per link");
  for (const M of Ih) Ot.append(Ei(`${M.toLocaleString()} plays`, String(vh(M))));
  Ot.append(Ei("Max (1 STX)", String(xh)), Ei("Custom STX", "")), Ot.onchange = () => {
    Ot.value && (rt.value = String(Number(Ot.value) / 1e6));
  };
  const Ut = ht("input");
  Ut.maxLength = 40, Ut.placeholder = "Label, e.g. Launch week", Ut.setAttribute("aria-label", "Campaign label");
  function tn(M) {
    var lt, gt, Kt, Bt, de;
    const R = (lt = M.gate) == null ? void 0 : lt.gifts;
    if (!(R != null && R.enabled) || ["off", "elsewhere", "unsupported"].includes(M.step)) return null;
    const D = t.main(), it = [ht("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!D)
      it.push(ht("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      ne.disabled = !!T, it.push(Nt, ae, ne), t.now() - Z > 3e4 && (Z = t.now(), F(D));
      const ce = I(D);
      if (ce.length) {
        const le = ht("ul", "", "ppp-gift-list");
        for (const u of ce.slice(0, 10)) {
          const E = (gt = u.view) == null ? void 0 : gt.status, k = u.error ? u.error : !E || E === "pending-deposit" ? u.txid ? "payment confirming…" : "waiting for your payment" : E === "live" ? "ready to share" : E === "claiming" || E === "claimed" ? "claimed ✓" : E === "refunding" ? "expired · refund on its way" : E === "refunded" ? "expired · refunded to you" : E, P = ht("li");
          if (P.append(ht("span", `${Ps(BigInt(u.amount))} STX`, "t"), ht("span", k, ((Kt = u.view) == null ? void 0 : Kt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Bt = u.view) == null ? void 0 : Bt.status) === "live") {
            const J = st(((de = M.gate) == null ? void 0 : de.radioUrl) ?? null, u.code);
            P.append(Mi("gift-copy:" + u.id, "Copy link", () => J, "tiny", t.changed), uy("gift-share:" + u.id, "Share", () => z(J), "tiny", t.changed));
          }
          le.append(P);
        }
        it.push(le);
      }
      if (R.admin) {
        const le = Fr("Sign and make links", () => {
          const J = BigInt(Math.round(Number(rt.value) * 1e6));
          X(D, Number(pt.value), J, Ut.value.trim(), Gt.value || void 0);
        }), u = ht("div", "", "ppp-gift-admin"), E = (J, ft) => {
          const Dt = ht("label", J);
          return Dt.append(ft), Dt;
        }, k = $(D), P = Gt.value;
        if (Gt.replaceChildren(Ei("No player (plain gift)", ""), ...k.map((J) => Ei(`${J.title} · ${J.tracks} songs`, J.id))), k.some((J) => J.id === P) && (Gt.value = P), u.append(
          ht("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          ct,
          Lt,
          Wt,
          Fr("Sign and make player", () => void O(D, { title: ct.value, subtitle: Lt.value, tracks: Wt.value })),
          ht("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"),
          E("Player ", Gt),
          E("Plays each ", Ot),
          E("Links ", pt),
          E("STX each ", rt),
          Ut,
          le
        ), B) {
          const J = B.codes.map((Dt) => {
            var _t;
            return st(((_t = M.gate) == null ? void 0 : _t.radioUrl) ?? null, Dt);
          }).join(`
`), ft = ht("textarea");
          ft.readOnly = !0, ft.value = J, ft.rows = Math.min(8, B.codes.length), u.append(ht("p", `${B.codes.length} links, ${Ps(BigInt(B.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), ft, Mi("campaign-copy", "Copy all", () => J, "tiny", t.changed));
        }
        it.push(u);
      }
    }
    return T && it.push(ht("p", T, "ppp-cyan")), w && it.push(ht("p", w, /✓/.test(w) ? "ppp-ok" : "ppp-warn")), L.replaceChildren(...it), L;
  }
  return { banner: b, funder: m, renderFold: tn, liveGift: i, setAside: o, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null };
}
const U$ = [
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
function P$(t) {
  for (const [e, n] of U$) if (n.test(t)) return e;
  return null;
}
const fy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), dy = (t) => /Android/.test(t);
function H$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : fy(e) ? "x-safari-" + n.href : dy(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const O$ = (t) => fy(t) ? "Safari" : dy(t) ? "Chrome" : "your browser", Ch = document.getElementById("ppp");
Ch && D$(Ch);
function D$(t) {
  var le;
  const e = lw(), n = (u) => t.querySelector(u), r = n(".ppp-frame");
  let s = null;
  const i = async (u, E) => {
    const k = await fetch(u, { cache: "no-store", ...E, signal: AbortSignal.timeout(15e3) }), P = await k.json().catch(() => ({}));
    if (!k.ok) throw new Error((P == null ? void 0 : P.error) || `Request failed (${k.status}).`);
    return P;
  }, o = P5({
    now: Date.now,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    config: (u) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(u || "")),
    links: async (u) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(u))).links ?? [],
    mainOf: async (u) => {
      var k;
      const E = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(u))).links;
      return ((k = E == null ? void 0 : E.find((P) => P.listening === u)) == null ? void 0 : k.main) ?? null;
    },
    saveLink: async (u) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(u) });
    },
    bridge: async (u) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${u}; publickey-credentials-create ${u}`), s.referrerPolicy = "no-referrer";
      const E = new Promise((ft, Dt) => {
        s.addEventListener("load", () => ft(), { once: !0 }), setTimeout(() => Dt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = u + "/", r.replaceChildren(s), await E;
      const k = new tw({ walletOrigin: u, frame: s, timeoutMs: 30 * 6e4 }), P = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), J = (ft, Dt) => P.has(ft) ? k.request(ft, Dt) : Promise.race([
        k.request(ft, Dt),
        new Promise((_t, Pe) => setTimeout(() => Pe(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await J("listening.status"), { request: J };
    },
    chain: {
      verify: y5,
      balance: b5,
      account: w5,
      owner: m5,
      broadcast: x5,
      transaction: S5,
      confirmedNonce: async (u) => {
        const E = await Cr(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(E == null ? void 0 : E.nonce) || E.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(E.nonce);
      }
    },
    signWithMain: (u, E) => oh({ ...E, network: "mainnet", stxAddress: u }),
    deposit: (u, E, k) => new Promise((P, J) => eh({
      recipient: E,
      amount: k.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new Ec(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ft) => P(ft.txId || ""),
      onCancel: () => J(new Error("Deposit cancelled. Nothing was sent.")),
      onError: J
    })),
    validate: E5,
    tabLock: (u) => new Promise((E) => {
      const k = navigator.locks;
      if (!(k != null && k.request)) {
        E(!0);
        return;
      }
      k.request("xtrata-ppp:" + u, { ifAvailable: !0 }, async (P) => {
        E(!!P), P && await new Promise(() => {
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
      set: (u, E) => {
        try {
          localStorage.setItem(u, E);
        } catch {
        }
      }
    },
    changed: () => Bt(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var E, k;
      return a.funder(u, () => L5(u, Cr), !!((k = (E = o.snapshot().gate) == null ? void 0 : E.gifts) != null && k.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (u) => {
      const E = await i("/radio/gift/for?wallet=" + encodeURIComponent(u)), k = E == null ? void 0 : E.gift;
      if (!k) return null;
      if (typeof k.returnTo != "string" || typeof k.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: k.returnTo, from: typeof k.from == "string" ? k.from : null, source: String(k.source ?? ""), amount: String(k.amount ?? "0"), treasury: k.treasury, state: k.state === "sending" ? "sending" : "arrived", player: k.player ?? null };
    },
    history: (u, E) => T5(u, (k) => Cr(k), E),
    likesChanged: () => {
      var u, E;
      (E = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || E.call(u);
    },
    likeState: async (u, E) => {
      const k = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: u, ids: String(E) })), P = Array.isArray(k == null ? void 0 : k.rows) ? k.rows.find((J) => (J == null ? void 0 : J.id) === E) : null;
      if (!P || typeof P.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: P.liked, by: Array.isArray(P.by) ? P.by.filter((J) => typeof J == "string") : P.liked ? [u] : [] };
    },
    likeSent: (u, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: u, liked: E } })),
    nameOf: (u) => F(u) ?? void 0,
    likeConfirmed: (u, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: u, liked: E } })),
    likeFailed: (u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: u } }))
  }), a = N$({
    json: i,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, E, k, P) => new Promise((J, ft) => eh({
      recipient: E,
      amount: k.toString(),
      memo: P,
      stxAddress: u,
      network: new Ec(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (Dt) => J(Dt.txId || ""),
      onCancel: () => ft(new Error("Gift cancelled. Nothing was sent.")),
      onError: ft
    })),
    sign: (u, E) => oh({ ...E, network: "mainnet", stxAddress: u }),
    giftSent: (u, E) => o.giftSent(u, E),
    who: (u) => $(u),
    changed: () => Bt(o.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, E) => {
        try {
          E === null ? localStorage.removeItem(u) : localStorage.setItem(u, E);
        } catch {
        }
      }
    },
    now: Date.now
  });
  window.XtrataRadioLikeHandler = (u) => {
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    Nt();
    const E = ae(u.song, { title: u.title, artist: u.artist });
    return o.heart({ song: u.song, title: E.title || void 0, artist: E.artist || void 0, likedBy: Array.isArray(u.likedBy) ? u.likedBy : void 0 });
  };
  let c;
  window.XtrataRadioListeningIdentity = () => {
    const u = o.snapshot();
    return u.solo && u.step !== "off" && u.step !== "elsewhere" ? u.listening : void 0;
  };
  const f = (u) => {
    var k, P;
    const E = window.XtrataRadioListeningIdentity();
    E !== c && (c = E, (P = (k = window.XtrataRadio) == null ? void 0 : k.refreshLikes) == null || P.call(k));
  };
  let d = "", l = null;
  const g = (u) => {
    var ft, Dt;
    const E = window.XtrataRadio;
    if (!(E != null && E.setGiftPlayer) || !(E != null && E.setGiftStop)) return;
    const k = u.step === "off" || u.step === "elsewhere" ? null : ((ft = u.gift) == null ? void 0 : ft.player) ?? null, P = k ? k.id + ":" + k.tracks.map((_t) => _t.id).join(",") : "";
    P !== d && (E.setGiftPlayer(k ? { id: k.id, title: k.title, subtitle: k.subtitle, tracks: k.tracks.map((_t) => _t.id) } : null), d = P);
    const J = k ? ((Dt = u.giftStop) == null ? void 0 : Dt.text) ?? null : null;
    J !== l && (E.setGiftStop(J), l = J);
  }, h = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", b = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), m = (u) => {
    const E = Math.round((Date.now() - u) / 6e4);
    return E < 1 ? "now" : E < 60 ? `${E}m` : E < 1440 ? `${Math.round(E / 60)}h` : `${Math.round(E / 1440)}d`;
  }, L = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, S = (u, E = "", k = "") => {
    const P = document.createElement(u);
    return E && (P.textContent = E), k && (P.className = k), P;
  }, T = (u, E, k = "") => {
    const P = S("button", u, k);
    return P.type = "button", P.onclick = E, P;
  }, w = (u, E) => {
    const k = S("a", u);
    return k.href = E, k.target = "_blank", k.rel = "noopener", k;
  };
  let B = null, I = location.hash === "#give";
  I && history.replaceState(null, "", location.pathname + location.search);
  let H = !1;
  const Z = m$((u) => b$({ address: u, network: "mainnet" }), () => Bt(o.snapshot())), F = (u) => Z.get(u), q = P$(navigator.userAgent), x = (u, E) => {
    const k = navigator.userAgent, P = O$(k), J = `${location.origin}${location.pathname}${E ? `#gift=${E}` : ""}`, ft = [S("p", `You are in ${u}'s built-in browser, where passkeys often do not work. Open this page in ${P} to make your listening wallet${E ? " and claim your gift" : ""}.`, "ppp-warn")], Dt = S("div", "", "ppp-open-row"), _t = H$(J, k);
    if (_t) {
      const Pe = S("a", `Open in ${P}`, "primary ppp-open-in");
      Pe.href = _t, Pe.dataset.homeAction = "radio:open-in-browser", Dt.append(Pe);
    }
    return Dt.append(Mi("copy-page-link", "Copy link", () => J, _t ? "" : "primary", () => Bt(o.snapshot()))), ft.push(Dt, S("p", `If that does not open ${P}, use ${u}'s menu (••• or ⋮) and choose "Open in ${P === "your browser" ? "browser" : P}", or paste the copied link there.`, "ppp-mute")), ft;
  }, $ = (u) => F(u) ?? h(u), O = (u) => u.slice(0, 2).map($).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), X = /* @__PURE__ */ new Map();
  let st = !1;
  const z = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), Nt = () => {
    st || (st = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const E of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const k = Number(E == null ? void 0 : E.id);
        Number.isSafeInteger(k) && X.set(k, { title: typeof E.title == "string" ? E.title : void 0, artist: typeof E.artist == "string" ? E.artist : void 0 });
      }
      Bt(o.snapshot());
    }).catch(() => {
      st = !1;
    }));
  }, ae = (u, E) => {
    const k = X.get(u), P = S$(u, [k == null ? void 0 : k.title, E == null ? void 0 : E.title].find((ft) => !z(ft)) || ""), J = x$(u, (k == null ? void 0 : k.artist) || (E == null ? void 0 : E.artist) || "");
    return { title: P, artist: J };
  }, ne = (u) => {
    const { title: E, artist: k } = ae(u.song, u);
    return E ? `“${E}”${k ? ` — ${k}` : ""}` : `Song #${u.song}${k ? ` — ${k}` : ""}`;
  }, A = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, N = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function pt(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["OVER 1 STX", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function rt(u, E, k = "", P) {
    const J = S("dt", u), ft = S("dd", E, k);
    return P && ft.append(" ", P), [J, ft];
  }
  const ct = document.getElementById("ppp-top"), Lt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Wt = () => {
    var E, k;
    const u = o.snapshot();
    if (u.step === "connect" || u.step === "wrong-wallet") {
      (E = document.getElementById("radio-wallet-connect")) == null || E.click();
      return;
    }
    if (u.step === "elsewhere" && ((k = u.gate) != null && k.radioUrl)) {
      location.href = u.gate.radioUrl;
      return;
    }
    u.step === "locked" && !u.armed && !u.busy && o.unlock(), u.step === "ready" && !u.payingOn && !u.busy && o.switchOn(), Lt();
  };
  ct && (ct.onclick = Wt);
  function Gt(u) {
    if (!ct) return;
    const E = (P, J, ft) => {
      ct.hidden = !1, ct.className = "ppp-top" + (J ? " is-" + J : ""), ct.replaceChildren(S("span", "", "dot"), document.createTextNode(P)), ct.title = ft;
    }, k = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        ct.hidden = !0;
        return;
      case "elsewhere":
        return E("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        ct.hidden = !0;
        return;
      case "intro":
        return E("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return E(`Connect ${$(u.linked)}`, "warn", `This device's listening wallet belongs to ${$(u.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return E(u.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return E("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return u.depositPending ? E("Funds on their way", "quiet", "Paying starts by itself when they land") : E(u.entries.some((P) => P.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return E("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return E("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return u.payingOn && k > 0 ? E(`On · ${k.toLocaleString()} plays left`, "on", "Paying artists as you listen") : E("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const Ot = document.getElementById("pppNudge"), Ut = document.getElementById("onair");
  (le = Ot == null ? void 0 : Ot.querySelector("button")) == null || le.addEventListener("click", () => Wt());
  const tn = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, dn = {
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
  function M(u) {
    var ft;
    if (u.step === "loading") return;
    const E = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, k = u.step === "ready" && u.payingOn && E > 0, P = k ? "" : tn[u.step] ?? "", J = k ? "on" : P ? "off" : "";
    if (J ? document.documentElement.dataset.ppp = J : delete document.documentElement.dataset.ppp, Ut && (Ut.hidden = !J, Ut.querySelector(".onair-sub").textContent = k ? `Paying artists · ${E.toLocaleString()} plays left` : "Not paying"), Ot && (Ot.hidden = J !== "off" || u.step === "fund" && u.depositPending, J === "off")) {
      const Dt = Math.floor(Number(1000000n / Mr(BigInt(((ft = u.gate) == null ? void 0 : ft.limits.playFee) ?? "300"))));
      Ot.querySelector(".nudge-t").textContent = "⚠ " + P, Ot.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${Dt.toLocaleString()} plays, on-chain, straight to the artists.`, Ot.querySelector("button").textContent = dn[u.step] ?? "Start paying";
    }
  }
  let R = "";
  function D(u) {
    const E = S("div", "", "ppp-pick");
    u.funderMultiple && u.returnToKind === "funder" && E.append(S("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), u.returnToKind === "funder" && E.append(S("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const k = S("input");
    k.type = "text", k.placeholder = "SP… address to send returns to", k.autocomplete = "off", k.spellcheck = !1, k.setAttribute("aria-label", "Address to return funds to"), k.value = R, k.oninput = () => {
      R = k.value;
    };
    const P = T(u.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(k.value), R = "";
    }, "tiny");
    return E.append(k, " ", P), u.returnToKind === "chosen" && E.append(" ", T("Back to the funder", () => o.clearReturnAddress(), "tiny")), E;
  }
  const it = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function lt() {
    const u = S("p", it + " ", "ppp-mute");
    return u.append(w("Xverse", "https://www.xverse.app/download"), " · ", w("Leather", "https://leather.io/install-extension")), u;
  }
  let gt = "";
  const Kt = (u) => {
    const E = document.documentElement, k = u.solo && !u.main ? u.listening ? h(u.listening) : "new" : "", P = j5() ? "1" : "";
    `${k}|${P}` !== gt && (gt = `${k}|${P}`, k ? E.dataset.pppSolo = k : delete E.dataset.pppSolo, P ? E.dataset.pppWalletInstalled = P : delete E.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => Bt(o.snapshot()), u);
  function Bt(u) {
    var Pr, He, Oe, Cs, Wn, qn, Xn, Yn, Ce;
    if (f(), g(u), Kt(u), Gt(u), M(u), t.hidden = u.step === "off", t.hidden) return;
    const [E, k] = pt(u), P = n(".ppp-state");
    P.textContent = E, P.className = "ppp-state" + (k ? " ppp-state--" + k : ""), P.hidden = !E;
    const J = !!u.busy || u.armed, ft = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(u.step) && (J || !["intro", "loading"].includes(u.step));
    r.hidden = !ft, r.classList.toggle("ppp-frame--rest", !J && !H);
    const Dt = n(".ppp-frame-label");
    Dt.hidden = !0;
    const _t = H5(u) ?? B;
    B = _t;
    const Pe = D5(u, _t);
    n(".ppp-badge").hidden = !Pe;
    const ks = n(".ppp-steps"), Nr = n(".ppp-stage");
    ks.hidden = Nr.hidden = !Pe, _t && Pe && (ks.replaceChildren(...kl(u.solo).map((j, Y) => {
      const ue = S("li", "", Y < _t.at ? "done" : Y === _t.at ? _t.blocked ? "now blocked" : "now" : "");
      return ue.append(S("span", Y < _t.at ? "✓" : String(Y + 1), "n"), j), Y === _t.at && ue.setAttribute("aria-current", "step"), ue;
    })), Nr.textContent = _t.caption, Nr.className = "ppp-stage " + (_t.at >= kl(u.solo).length ? "ppp-ok" : _t.blocked ? "ppp-bad" : "ppp-cyan"));
    const Se = n(".ppp-facts"), we = [];
    u.main && ((Pr = u.gate) != null && Pr.here) && !u.solo && we.push(...rt("Your wallet", $(u.main), "ppp-addr-short"));
    const Pt = () => {
      if (!u.listening) return;
      const j = Mi("copy-listening", "Copy", () => u.listening || "", "tiny", () => Bt(o.snapshot()));
      we.push(...rt(u.linked ? "Listening wallet (technical)" : "Listening wallet", h(u.listening), "ppp-addr-short", j));
    };
    if (u.linked || Pt(), u.listening && u.step !== "intro")
      if (u.linked)
        we.push(...rt("Credited to", `${$(u.linked)} · plays, likes and returns`, u.linked === u.main || u.solo ? "ppp-ok" : "ppp-warn")), Pt();
      else if (u.solo) {
        u.creditedTo && we.push(...rt("Credited to", `${$(u.creditedTo)} · plays and likes`, "ppp-ok"));
        const j = u.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : u.returnTo ? `${$(u.returnTo)} · ${u.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : u.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        we.push(...rt("Returns go to", u.gift ? j : u.returnTo && !F(u.returnTo) ? j.replace(h(u.returnTo), u.returnTo) : j, u.returnTo && !u.gift ? "ppp-addr-full" : "ppp-mute"));
      } else we.push(...rt("Linked to", "not linked yet", "ppp-warn"));
    if (u.linkedListening.length && ((He = u.gate) != null && He.here)) {
      const j = u.linkedListening.map((Y) => h(Y) + (Y === u.listening ? " (this one)" : "")).join(", ");
      we.push(...rt(u.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", j, "ppp-addr-short"));
    }
    if (u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step)) {
      const j = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      we.push(...rt("Balance", `${Sn(u.balance)} STX · about ${u.playsLeft.toLocaleString()} plays`, j));
    }
    const he = u.entries.find((j) => j.kind === "play");
    he && Nt(), he && we.push(...rt("Last paid song", `${ne(he)} → ${$(he.recipient)}`, A[he.status] || "")), Se.replaceChildren(...we), Se.hidden = !we.length;
    const ut = [], vt = [], Vt = [], Ee = [], en = Mr(BigInt(((Oe = u.gate) == null ? void 0 : Oe.limits.playFee) ?? "300")), Le = `Each song you listen to for 30 seconds sends ${Sn($l)} STX to whoever holds it, plus a ${Sn(en - $l)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Vn = !!u.busy;
    switch (u.step) {
      case "elsewhere": {
        if (ut.push(S("p", "Pay artists as you listen.")), (Cs = u.gate) != null && Cs.radioUrl) {
          const Y = S("p");
          Y.append(w("Open the pay-per-play radio →", u.gate.radioUrl)), ut.push(Y);
        }
        vt.push(S("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (u.linked) {
          const Y = [u.linked, ...u.others];
          ut.push(S("p", Y.length > 1 ? `This device has listening wallets for ${O(Y)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${$(u.linked)}. Connect that wallet to keep paying artists.`)), vt.push(S("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          ut.push(S("p", "Connect your wallet to pay artists as you listen.")), vt.push(S("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        ut.push(S("p", `This device's listening wallet belongs to ${$(u.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), vt.push(S("p", `You are connected as ${$(u.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), vt.push(S("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Vt.push(T("Switch wallet", () => {
          var Y;
          return (Y = document.getElementById("radio-wallet-connect")) == null ? void 0 : Y.click();
        }, "primary"));
        break;
      case "not-invited":
        ut.push(S("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ut.push(S("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ut.push(S("p", `Pay artists ${Sn(en)} STX a song as you listen.`)), vt.push(S("p", Le)), vt.push(S("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), vt.push(S("p", u.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !u.solo && u.main && u.others.length ? (ut.push(S("p", `This device already has a listening wallet for ${O(u.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), vt.push(S("p", `Otherwise, set up a new listening wallet for ${$(u.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !u.solo && u.main && vt.push(S("p", `This is the listening wallet for ${$(u.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), u.solo && vt.push(S("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const j = a.liveGift();
        Vt.push(T(j ? "Claim my gift · no wallet needed" : u.solo ? "Turn on pay-per-play · no wallet needed" : u.others.length && u.main ? `Set up for ${$(u.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !j && !u.solo && u.main && u.others.length && Vt.push(T("Switch wallet", () => {
          var Y;
          return (Y = document.getElementById("radio-wallet-connect")) == null ? void 0 : Y.click();
        })), !j && u.solo && Vt.push(T("I have a Stacks wallet", () => {
          var Y;
          return (Y = document.getElementById("radio-wallet-connect")) == null ? void 0 : Y.click();
        })), Vt.push(T("I already have a listening wallet", () => void o.unlock(!0))), j && Vt.push(T("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        u.armed || (ut.push(S("p", "Locked.", "ppp-mute")), Vt.push(T(u.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), Ee.push(T("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ut.push(S("p", `Link to ${$(u.main)} · free`)), vt.push(S("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), vt.push(S("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Vt.push(T(u.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ut.push(S("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (u.depositPending || ((Wn = u.gift) != null && Wn.player ? ut.push(S("p", "Out of plays · add more to keep listening", "ppp-bad")) : u.entries.length ? ut.push(S("p", "Out of funds · top up to keep paying", "ppp-bad")) : ut.push(S("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / en)).toLocaleString()} songs`))), (qn = u.gift) != null && qn.player ? vt.push(S("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : u.entries.length && vt.push(S("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), u.payingOn && !u.entries.length && vt.push(S("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), u.solo ? (vt.push(S("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), vt.push(S("p", u.listening || "", "ppp-addr-full")), u.listening && !u.depositPending && Vt.push(Mi("copy-address", "Copy my address", () => u.listening || "", "primary", () => Bt(o.snapshot())))) : vt.push(S("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), u.depositPending && u.depositTxid) {
          const Y = S("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          Y.append(w("View", L(u.depositTxid))), ut.push(Y);
        } else u.allowance > 0n && !u.solo && Vt.push(T(`Deposit ${Sn(u.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ut.push(S("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), u.solo && !u.returnTo && (ut.push(S("p", u.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ut.push(D(u))), (!u.solo || u.returnTo) && Vt.push(T("Return excess", () => void o.returnFunds("excess"), "primary"), T("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (u.payingOn && u.session && u.session.playsLeft > 0) {
          const Y = Math.min(u.session.playsLeft, u.playsLeft);
          ut.push(S("p", `Paying as you listen · up to ${Y.toLocaleString()} plays left`, "ppp-ok")), vt.push(S("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Vt.push(T("Switch off", () => void o.switchOff()));
        } else
          ut.push(S("p", "Paying is off. Music stays free.", "ppp-mute")), Vt.push(T("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        u.queued && ut.push(S("p", u.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${u.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), u.balanceState === "low" && ut.push(S("p", "Running low · top up", "ppp-warn")), u.depositPending ? ut.push(S("p", "Top-up on its way…", "ppp-warn")) : u.allowance > 0n && u.balanceState !== "ok" && !u.solo && Vt.push(T(`Top up ${Sn(u.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (u.solo && u.walletCannotSolo && vt.push(S("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), u.solo && ["fund", "ready"].includes(u.step) && ((u.balance ?? 0n) > 0n && vt.push(D(u)), vt.push(lt()), u.step === "ready" && u.entries.some((j) => j.kind === "play" && j.status === "confirmed"))) {
      const j = S("p", "New to Stacks? ", "ppp-mute");
      j.append(w("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ut.push(j);
    }
    if (u.walletOutdated && vt.push(S("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), u.stuck && (ut.push(S("p", u.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${u.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Vt.push(T("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(u.step) && (u.returnTo || u.gift) && (u.balance ?? 0n) > 0n && Ee.push(T(u.linked ? "Return all to my wallet" : u.gift ? "Return what is left…" : `Return all to ${$(u.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(u.step) && Ee.push(T("Lock", () => void o.lock(), "quiet")), ft && !J && Ee.push(T(H ? "Hide listening wallet box" : "Show listening wallet box", () => {
      H = !H, Bt(o.snapshot());
    }, "quiet")), [...Vt, ...Ee].forEach((j) => j.disabled = Vn), Vn && (Vt.length = 0), u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step) && !(u.step === "fund" && u.depositPending && u.balance === 0n) && !((Xn = u.gift) != null && Xn.player)) {
      const j = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad", Y = ut.at(0);
      u.step === "ready" && Y ? Y.append(S("span", ` · ${b(u.balance)} STX`, j)) : ut.push(S("p", `Balance ${b(u.balance)} STX`, j));
    }
    if ((Yn = u.gift) != null && Yn.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(u.step)) {
      const j = S("p", "", "ppp-gift");
      j.append(`🎁 Gift Edition · ${u.gift.player.title}`), u.gift.player.subtitle && j.append(" · ", u.gift.player.subtitle);
      const Y = ["ready", "fund", "over"].includes(u.step) && u.balance !== void 0 ? S("span", u.giftPlays === 0 ? " · no plays left" : ` · ${u.giftPlays.toLocaleString()} ${u.giftPlays === 1 ? "play" : "plays"} left`, u.giftPlays === 0 ? "ppp-bad" : u.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      Y && j.append(Y);
      const ue = (Ce = ut.at(0)) == null ? void 0 : Ce.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (u.step === "ready" && ue && /STX/.test(ue.textContent ?? "") && ue.remove(), ut.unshift(j), u.giftPlays <= 20 && ["ready", "fund"].includes(u.step) && !u.depositPending) {
        const be = S("p", u.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
        be.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), be.append(w("Xverse", "https://www.xverse.app/download"), " and ", w("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ut.splice(1, 0, be);
      }
    }
    if (u.gift && !u.linked && ["fund", "ready", "over"].includes(u.step) && u.returnPlan.state === "ready") {
      const j = u.returnPlan, Y = S("div", "", "ppp-pick");
      Y.append(S("p", j.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ue = S("ul", "", "ppp-gift-list");
      j.steps.forEach((be, Zn) => {
        const nn = be.kind === "gift" ? "the unused gift" : be.kind === "deposit" ? "what was added to it" : "the rest", Qn = S("li");
        Qn.append(S("span", `${Zn + 1}. ${Sn(BigInt(be.send))} STX · ${nn}`, "t"), S("span", be.to ? ` → ${$(be.to)}` : " → choose an address below", be.to ? "ppp-mute" : "ppp-warn")), ue.append(Qn);
      }), Y.append(ue), j.kept && Y.append(S("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), j.steps.some((be) => !be.to) && Y.append(D(u)), Y.append(T(j.steps.length > 1 ? `Confirm part 1 of ${j.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), ut.push(Y);
    }
    ut.unshift(...a.banner(u)), q && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(u.step)) && ut.unshift(...x(q, a.pendingCode())), u.solo && u.creditedTo && u.listening && !["intro", "off", "elsewhere", "loading"].includes(u.step) && ut.unshift(S("p", `This is ${$(u.creditedTo)}'s listening wallet. Plays and likes count for ${$(u.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...ut);
    const _n = a.renderFold(u);
    if (n(".ppp-gifts").hidden = !_n, _n && !n(".ppp-gift-body").contains(_n) && n(".ppp-gift-body").replaceChildren(_n), _n && I) {
      I = !1;
      const j = n(".ppp-gifts");
      j.open = !0, requestAnimationFrame(() => j.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...vt), n(".ppp-actions").replaceChildren(...Vt), n(".ppp-actions2").replaceChildren(...Ee);
    const Ur = u.busy || u.message || "";
    n(".ppp-msg").textContent = Ur && ut.some((j) => (j.textContent ?? "").startsWith(Ur.replace(/[.✓\s]+$/, ""))) ? "" : Ur, n(".ppp-err").textContent = u.error;
    const yi = u.entries.filter((j) => j.kind === "play");
    n(".ppp-recent").hidden = !u.entries.length, n(".ppp-recent-list").replaceChildren(...yi.slice(0, 5).map((j) => {
      const Y = S("li"), ue = j.status === "confirmed" ? "ok" : j.status === "failed" ? "bad" : "warn";
      return Y.append(S("span", "", "d " + ue), S("span", ne(j), "t"), S("span", m(j.created), "ppp-mute")), j.txid && Y.append(w("tx", L(j.txid))), Y;
    })), n(".ppp-wallets").hidden = !(Se.childElementCount || Ee.length), n(".ppp-more").hidden = !vt.length;
    const Ls = n(".ppp-history");
    Ls.hidden = !u.entries.length, u.entries.length && Nt(), Ls.replaceChildren(S("summary", `All activity (${u.entries.length})`), ...u.entries.slice(0, 20).map((j) => {
      const Y = S("div", "", "ppp-row"), ue = j.kind === "play" ? [S("span", ne(j), "ppp-song"), S("span", ` · ${Sn(BigInt(j.amount))} STX to ${$(j.recipient)}`, "ppp-mute")] : j.kind === "like" ? [S("span", `${j.liked ? "♥ Liked" : "Unliked"} ${ne(j)}`, "ppp-song"), S("span", ` · for ${u.linked ? $(u.linked) : "this listening wallet"}`, "ppp-mute")] : [S("span", `Returned ${Sn(BigInt(j.amount))} STX`, "ppp-song"), S("span", ` to ${$(j.recipient)}`, "ppp-mute")];
      return Y.append(
        S("span", N[j.status] || j.status, "ppp-status " + (A[j.status] || "")),
        ...ue,
        S("span", ` · ${new Date(j.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), j.txid && Y.append(w("tx ↗", L(j.txid))), Y;
    }));
  }
  const de = /* @__PURE__ */ new Map(), ce = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((E) => {
      const k = E == null ? void 0 : E.nowPlaying;
      k && Number.isSafeInteger(Number(k.tokenId)) && de.set(Number(k.tokenId), { title: k.title || void 0, artist: k.artist || void 0 });
    }), !0) : !1;
  };
  if (!ce()) {
    const u = setInterval(() => {
      ce() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const E = u.detail;
    if (E && Number.isSafeInteger(E.song) && typeof E.id == "string" && /^[0-9a-f]{32}$/.test(E.id)) {
      Nt();
      const k = ae(E.song, de.get(E.song));
      o.onListened({ song: E.song, id: E.id, title: k.title || void 0, artist: k.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const F$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", j$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, z$ = () => j$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, R$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, G$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', hy = class {
  constructor(t) {
    M4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Q2(t), this.callback(Ia(t));
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
    var r, s, i, o, a, c, f, d, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = z$(), e = R$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return dt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, dt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), dt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, dt("div", { class: "flex flex-col space-y-[10px]" }, dt("div", { class: "flex items-center" }, dt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), dt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, dt("span", { class: "sr-only" }, "Close popup"), dt("img", { src: F$ }))), r ? dt("p", null, "Select the wallet you want to connect to.") : dt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && dt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && dt("div", { class: "mt-6" }, dt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), dt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => dt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, dt("div", { class: "aspect-square basis-9 overflow-hidden" }, dt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), dt("div", { class: "flex-1" }, dt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && dt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), dt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && dt("div", { class: "mt-6" }, r ? dt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : dt("div", { class: "mb-5 flex justify-between" }, dt("p", { class: "text-sm font-medium" }, "Recommended wallets"), dt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, dt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, dt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), dt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), dt("p", null, "What is a wallet? ", dt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), dt("ul", { class: "space-y-3" }, n.map((i) => dt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, dt("div", { class: "aspect-square basis-9 overflow-hidden" }, dt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), dt("div", { class: "flex-1" }, dt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && dt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && dt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return h4(this);
  }
};
hy.style = G$;
const K$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: hy
}, Symbol.toStringTag, { value: "Module" }));
