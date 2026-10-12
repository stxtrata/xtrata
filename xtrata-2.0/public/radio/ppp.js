var zg = Object.defineProperty;
var Rg = (t, e, n) => e in t ? zg(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Jr = (t, e, n) => Rg(t, typeof e != "symbol" ? e + "" : e, n);
var Dt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function oh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Yi(t) {
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
      typeof Dt < "u" && Dt || {}, r = {
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
      function s(w) {
        return w && DataView.prototype.isPrototypeOf(w);
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
        ], o = ArrayBuffer.isView || function(w) {
          return w && i.indexOf(Object.prototype.toString.call(w)) > -1;
        };
      function a(w) {
        if (typeof w != "string" && (w = String(w)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(w) || w === "")
          throw new TypeError('Invalid character in header field name: "' + w + '"');
        return w.toLowerCase();
      }
      function c(w) {
        return typeof w != "string" && (w = String(w)), w;
      }
      function l(w) {
        var $ = {
          next: function() {
            var T = w.shift();
            return { done: T === void 0, value: T };
          }
        };
        return r.iterable && ($[Symbol.iterator] = function() {
          return $;
        }), $;
      }
      function f(w) {
        this.map = {}, w instanceof f ? w.forEach(function($, T) {
          this.append(T, $);
        }, this) : Array.isArray(w) ? w.forEach(function($) {
          if ($.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + $.length);
          this.append($[0], $[1]);
        }, this) : w && Object.getOwnPropertyNames(w).forEach(function($) {
          this.append($, w[$]);
        }, this);
      }
      f.prototype.append = function(w, $) {
        w = a(w), $ = c($);
        var T = this.map[w];
        this.map[w] = T ? T + ", " + $ : $;
      }, f.prototype.delete = function(w) {
        delete this.map[a(w)];
      }, f.prototype.get = function(w) {
        return w = a(w), this.has(w) ? this.map[w] : null;
      }, f.prototype.has = function(w) {
        return this.map.hasOwnProperty(a(w));
      }, f.prototype.set = function(w, $) {
        this.map[a(w)] = c($);
      }, f.prototype.forEach = function(w, $) {
        for (var T in this.map)
          this.map.hasOwnProperty(T) && w.call($, this.map[T], T, this);
      }, f.prototype.keys = function() {
        var w = [];
        return this.forEach(function($, T) {
          w.push(T);
        }), l(w);
      }, f.prototype.values = function() {
        var w = [];
        return this.forEach(function($) {
          w.push($);
        }), l(w);
      }, f.prototype.entries = function() {
        var w = [];
        return this.forEach(function($, T) {
          w.push([T, $]);
        }), l(w);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function u(w) {
        if (!w._noBody) {
          if (w.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          w.bodyUsed = !0;
        }
      }
      function p(w) {
        return new Promise(function($, T) {
          w.onload = function() {
            $(w.result);
          }, w.onerror = function() {
            T(w.error);
          };
        });
      }
      function h(w) {
        var $ = new FileReader(), T = p($);
        return $.readAsArrayBuffer(w), T;
      }
      function b(w) {
        var $ = new FileReader(), T = p($), j = /charset=([A-Za-z0-9_-]+)/.exec(w.type), G = j ? j[1] : "utf-8";
        return $.readAsText(w, G), T;
      }
      function x(w) {
        for (var $ = new Uint8Array(w), T = new Array($.length), j = 0; j < $.length; j++)
          T[j] = String.fromCharCode($[j]);
        return T.join("");
      }
      function g(w) {
        if (w.slice)
          return w.slice(0);
        var $ = new Uint8Array(w.byteLength);
        return $.set(new Uint8Array(w)), $.buffer;
      }
      function I() {
        return this.bodyUsed = !1, this._initBody = function(w) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = w, w ? typeof w == "string" ? this._bodyText = w : r.blob && Blob.prototype.isPrototypeOf(w) ? this._bodyBlob = w : r.formData && FormData.prototype.isPrototypeOf(w) ? this._bodyFormData = w : r.searchParams && URLSearchParams.prototype.isPrototypeOf(w) ? this._bodyText = w.toString() : r.arrayBuffer && r.blob && s(w) ? (this._bodyArrayBuffer = g(w.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(w) || o(w)) ? this._bodyArrayBuffer = g(w) : this._bodyText = w = Object.prototype.toString.call(w) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof w == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(w) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var w = u(this);
          if (w)
            return w;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var w = u(this);
            return w || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var w = u(this);
          if (w)
            return w;
          if (this._bodyBlob)
            return b(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(m);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var L = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function y(w) {
        var $ = w.toUpperCase();
        return L.indexOf($) > -1 ? $ : w;
      }
      function A(w, $) {
        if (!(this instanceof A))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        $ = $ || {};
        var T = $.body;
        if (w instanceof A) {
          if (w.bodyUsed)
            throw new TypeError("Already read");
          this.url = w.url, this.credentials = w.credentials, $.headers || (this.headers = new f(w.headers)), this.method = w.method, this.mode = w.mode, this.signal = w.signal, !T && w._bodyInit != null && (T = w._bodyInit, w.bodyUsed = !0);
        } else
          this.url = String(w);
        if (this.credentials = $.credentials || this.credentials || "same-origin", ($.headers || !this.headers) && (this.headers = new f($.headers)), this.method = y($.method || this.method || "GET"), this.mode = $.mode || this.mode || null, this.signal = $.signal || this.signal || function() {
          if ("AbortController" in n) {
            var M = new AbortController();
            return M.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && T)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(T), (this.method === "GET" || this.method === "HEAD") && ($.cache === "no-store" || $.cache === "no-cache")) {
          var j = /([?&])_=[^&]*/;
          if (j.test(this.url))
            this.url = this.url.replace(j, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var G = /\?/;
            this.url += (G.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      A.prototype.clone = function() {
        return new A(this, { body: this._bodyInit });
      };
      function m(w) {
        var $ = new FormData();
        return w.trim().split("&").forEach(function(T) {
          if (T) {
            var j = T.split("="), G = j.shift().replace(/\+/g, " "), M = j.join("=").replace(/\+/g, " ");
            $.append(decodeURIComponent(G), decodeURIComponent(M));
          }
        }), $;
      }
      function B(w) {
        var $ = new f(), T = w.replace(/\r?\n[\t ]+/g, " ");
        return T.split("\r").map(function(j) {
          return j.indexOf(`
`) === 0 ? j.substr(1, j.length) : j;
        }).forEach(function(j) {
          var G = j.split(":"), M = G.shift().trim();
          if (M) {
            var pt = G.join(":").trim();
            try {
              $.append(M, pt);
            } catch (Kt) {
              console.warn("Response " + Kt.message);
            }
          }
        }), $;
      }
      I.call(A.prototype);
      function D(w, $) {
        if (!(this instanceof D))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if ($ || ($ = {}), this.type = "default", this.status = $.status === void 0 ? 200 : $.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = $.statusText === void 0 ? "" : "" + $.statusText, this.headers = new f($.headers), this.url = $.url || "", this._initBody(w);
      }
      I.call(D.prototype), D.prototype.clone = function() {
        return new D(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, D.error = function() {
        var w = new D(null, { status: 200, statusText: "" });
        return w.ok = !1, w.status = 0, w.type = "error", w;
      };
      var _ = [301, 302, 303, 307, 308];
      D.redirect = function(w, $) {
        if (_.indexOf($) === -1)
          throw new RangeError("Invalid status code");
        return new D(null, { status: $, headers: { location: w } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function($, T) {
          this.message = $, this.name = T;
          var j = Error($);
          this.stack = j.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function k(w, $) {
        return new Promise(function(T, j) {
          var G = new A(w, $);
          if (G.signal && G.signal.aborted)
            return j(new e.DOMException("Aborted", "AbortError"));
          var M = new XMLHttpRequest();
          function pt() {
            M.abort();
          }
          M.onload = function() {
            var S = {
              statusText: M.statusText,
              headers: B(M.getAllResponseHeaders() || "")
            };
            G.url.indexOf("file://") === 0 && (M.status < 200 || M.status > 599) ? S.status = 200 : S.status = M.status, S.url = "responseURL" in M ? M.responseURL : S.headers.get("X-Request-URL");
            var C = "response" in M ? M.response : M.responseText;
            setTimeout(function() {
              T(new D(C, S));
            }, 0);
          }, M.onerror = function() {
            setTimeout(function() {
              j(new TypeError("Network request failed"));
            }, 0);
          }, M.ontimeout = function() {
            setTimeout(function() {
              j(new TypeError("Network request timed out"));
            }, 0);
          }, M.onabort = function() {
            setTimeout(function() {
              j(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Kt(S) {
            try {
              return S === "" && n.location.href ? n.location.href : S;
            } catch {
              return S;
            }
          }
          if (M.open(G.method, Kt(G.url), !0), G.credentials === "include" ? M.withCredentials = !0 : G.credentials === "omit" && (M.withCredentials = !1), "responseType" in M && (r.blob ? M.responseType = "blob" : r.arrayBuffer && (M.responseType = "arraybuffer")), $ && typeof $.headers == "object" && !($.headers instanceof f || n.Headers && $.headers instanceof n.Headers)) {
            var Fe = [];
            Object.getOwnPropertyNames($.headers).forEach(function(S) {
              Fe.push(a(S)), M.setRequestHeader(S, c($.headers[S]));
            }), G.headers.forEach(function(S, C) {
              Fe.indexOf(C) === -1 && M.setRequestHeader(C, S);
            });
          } else
            G.headers.forEach(function(S, C) {
              M.setRequestHeader(C, S);
            });
          G.signal && (G.signal.addEventListener("abort", pt), M.onreadystatechange = function() {
            M.readyState === 4 && G.signal.removeEventListener("abort", pt);
          }), M.send(typeof G._bodyInit > "u" ? null : G._bodyInit);
        });
      }
      return k.polyfill = !0, n.fetch || (n.fetch = k, n.Headers = f, n.Request = A, n.Response = D), e.Headers = f, e.Request = A, e.Response = D, e.fetch = k, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Dt);
})();
const Gg = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Kg(t, e) {
  const n = {};
  return Object.assign(n, Gg, e), await fetch(t, n);
}
function Vg(t) {
  let e = Kg, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function qg(...t) {
  const { fetchLib: e, middlewares: n } = Vg(t);
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
var vr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(vr || (vr = {}));
var On;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(On || (On = {}));
var Vu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Vu || (Vu = {}));
const Wg = "https://api.mainnet.hiro.so", Yg = "https://api.testnet.hiro.so", Xg = "http://localhost:3999", Zg = ["mainnet", "testnet", "devnet", "mocknet"];
let Lr = class {
  constructor(e) {
    this.version = On.Mainnet, this.chainId = vr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === On.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? qg();
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
Lr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ah();
    case "testnet":
      return new Qg();
    case "devnet":
      return new Jg();
    case "mocknet":
      return new ch();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Zg.join(", ")}`);
  }
};
Lr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Lr.fromName(t);
let ah = class extends Lr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Wg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = On.Mainnet, this.chainId = vr.Mainnet;
  }
}, Qg = class extends Lr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Yg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = On.Testnet, this.chainId = vr.Testnet;
  }
}, ch = class extends Lr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Xg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = On.Testnet, this.chainId = vr.Testnet;
  }
};
const Jg = ch, uh = "xtrata.wallet.bridge.v1", t1 = (t) => typeof t == "object" && t !== null && t.protocol === uh, e1 = (t) => t1(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", n1 = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class ts extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const qu = 12e4;
class r1 {
  constructor(e) {
    Jr(this, "pending", /* @__PURE__ */ new Map());
    Jr(this, "listenTarget");
    Jr(this, "closed", !1);
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
    Jr(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !e1(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new ts("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new ts("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ts("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = n1(), i = { protocol: uh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ts(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? qu}ms.`
          )
        );
      }, this.options.timeoutMs ?? qu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new ts("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const s1 = ["SP", "SM"], i1 = ["ST", "SN"], o1 = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return s1.includes(n) ? "mainnet" : i1.includes(n) ? "testnet" : null;
}, a1 = () => {
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
}, c1 = () => typeof window > "u" || !window.localStorage ? a1() : window.localStorage, No = "xtrata.v15.1.wallet.session", Wu = "mainnet", Ai = { isConnected: !1 }, u1 = (t) => t.address ? o1(t.address) ?? t.network : t.network, lh = (t) => !t.isConnected || !t.address ? { ...Ai } : u1(t) !== Wu ? { ...Ai } : {
  isConnected: !0,
  address: t.address,
  network: Wu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, l1 = (t) => {
  if (!t)
    return { ...Ai };
  try {
    const e = JSON.parse(t);
    return lh(e);
  } catch {
    return { ...Ai };
  }
}, f1 = (t) => {
  const e = lh(t);
  return JSON.stringify(e);
}, h1 = (t) => {
  const e = c1();
  return {
    load: () => l1(e.getItem(No)),
    save: (n) => {
      e.setItem(No, f1(n));
    },
    clear: () => {
      e.removeItem(No);
    }
  };
}, d1 = "https://browser.blockstack.org/auth", p1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, fh = ["store_write"], g1 = "blockstack-session", y1 = {
  logLevel: "debug"
}, er = {
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
Object.freeze(er);
class Gr extends Error {
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
class b1 extends Gr {
  constructor(e, n = "") {
    super({ code: er.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Yu extends Gr {
  constructor(e = "") {
    super({ code: er.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Fs extends Gr {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: er.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Xu extends Gr {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: er.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class ca extends Gr {
  constructor(e) {
    super({ code: er.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class hh extends Gr {
  constructor(e) {
    super({ code: er.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Zu = ["debug", "info", "warn", "error", "none"], ua = {};
for (let t = 0; t < Zu.length; t++) {
  const e = Zu[t];
  ua[e] = t;
}
class mr {
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
    return ua[y1.logLevel] <= ua[e];
  }
}
function w1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function x1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Po(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function m1() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function S1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function E1(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function dc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = S1(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    mr.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = E1(s, t.toString(), n);
    throw mr.error(i), new Error(i);
  }
  if (r)
    return {};
}
function En(t, e) {
  return pc(Tt(t), e);
}
function Tt(t) {
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
  if (Gt(t, Uint8Array))
    return BigInt(`0x${K(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function A1(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Qu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function vs(t, e = 8) {
  return (typeof t == "bigint" ? t : Tt(t)).toString(16).padStart(e * 2, "0");
}
function Xi(t) {
  return parseInt(t, 16);
}
function pc(t, e = 16) {
  const n = vs(t, e);
  return st(n);
}
function $1(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function I1(t, e) {
  return t & BigInt(1) << e;
}
function la(t) {
  return v1(BigInt(`0x${K(t)}`), BigInt(t.byteLength * 8));
}
function v1(t, e) {
  return I1(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const L1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function K(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += L1[n];
  return e;
}
function st(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = A1(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function nr(t) {
  return new TextEncoder().encode(t);
}
function Ls(t) {
  return new TextDecoder().decode(t);
}
function B1(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function C1(t) {
  return String.fromCharCode.apply(null, t);
}
function M1(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ju(t) {
  if (t.some(M1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function $e(...t) {
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
function $t(t) {
  return $e(...t.map((e) => typeof e == "number" ? Ju([e]) : e instanceof Array ? Ju(e) : e));
}
function Gt(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const dh = "https://api.mainnet.hiro.so", ph = "https://api.testnet.hiro.so", gh = "http://localhost:3999", H1 = "https://hub.blockstack.org", U1 = 33, ko = 32;
function _1(t) {
  if (t.length < ko * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ko * 2), r = t.slice(2 + ko * 2);
  return {
    recoveryId: Xi(e),
    r: n,
    s: r
  };
}
function gc(t) {
  const e = typeof t == "string" ? st(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function T1(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function N1(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function P1(t, e) {
  return t[e];
}
function k1(t, e, n = 0) {
  return t[n] = e, t;
}
function D1(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function jn(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const O1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function j1(t, e) {
  const n = {};
  return Object.assign(n, O1, e), await fetch(t, n);
}
function F1(t) {
  let e = j1, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function z1(...t) {
  const { fetchLib: e, middlewares: n } = F1(t);
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
class yh {
  constructor(e = fh.slice(), n = ((a) => (a = dc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = d1) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function fa(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function R1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function bh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function G1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fa(t.outputLen), fa(t.blockLen);
}
function K1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function V1(t, e) {
  bh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Mn = {
  number: fa,
  bool: R1,
  bytes: bh,
  hash: G1,
  exists: K1,
  output: V1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Do = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pe = (t, e) => t << 32 - e | t >>> e, q1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!q1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function W1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function yc(t) {
  if (typeof t == "string" && (t = W1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let wh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function rr(t) {
  const e = (r) => t().update(yc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let xh = class extends wh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Mn.hash(e);
    const r = yc(n);
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
    return Mn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Mn.exists(this), Mn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Zi = (t, e, n) => new xh(t, e).update(n).digest();
Zi.create = (t, e) => new xh(t, e);
function Y1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let bc = class extends wh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Do(this.buffer);
  }
  update(e) {
    Mn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = yc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Do(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Mn.exists(this), Mn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Y1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Do(e), c = this.outputLen;
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
const X1 = (t, e, n) => t & e ^ ~t & n, Z1 = (t, e, n) => t & e ^ t & n ^ e & n, Q1 = new Uint32Array([
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
]), Re = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ge = new Uint32Array(64);
let mh = class extends bc {
  constructor() {
    super(64, 32, 8, !1), this.A = Re[0] | 0, this.B = Re[1] | 0, this.C = Re[2] | 0, this.D = Re[3] | 0, this.E = Re[4] | 0, this.F = Re[5] | 0, this.G = Re[6] | 0, this.H = Re[7] | 0;
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
      Ge[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = Ge[u - 15], h = Ge[u - 2], b = pe(p, 7) ^ pe(p, 18) ^ p >>> 3, x = pe(h, 17) ^ pe(h, 19) ^ h >>> 10;
      Ge[u] = x + Ge[u - 7] + b + Ge[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = pe(a, 6) ^ pe(a, 11) ^ pe(a, 25), h = f + p + X1(a, c, l) + Q1[u] + Ge[u] | 0, x = (pe(r, 2) ^ pe(r, 13) ^ pe(r, 22)) + Z1(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Ge.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, J1 = class extends mh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Br = rr(() => new mh());
rr(() => new J1());
const ty = {}, Sh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ty
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const rt = BigInt(0), yt = BigInt(1), wn = BigInt(2), is = BigInt(3), tl = BigInt(8), lt = Object.freeze({
  a: rt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: yt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), el = (t, e) => (t + e / wn) / e, zs = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = lt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -yt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = el(i * t, e), c = el(-r * t, e);
    let l = N(t - a * n - c * s, e), f = N(-a * r - c * i, e);
    const u = l > o, p = f > o;
    if (u && (l = e - l), p && (f = e - f), l > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: u, k1: l, k2neg: p, k2: f };
  }
}, fe = 32, Fn = 32, Eh = 32, $i = fe + 1, Ii = 2 * fe + 1;
function nl(t) {
  const { a: e, b: n } = lt, r = N(t * t), s = N(r * t);
  return N(s + e * t + n);
}
const Rs = lt.a === rt;
class wc extends Error {
  constructor(e) {
    super(e);
  }
}
function rl(t) {
  if (!(t instanceof it))
    throw new TypeError("JacobianPoint expected");
}
class it {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof J))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(J.ZERO) ? it.ZERO : new it(e.x, e.y, yt);
  }
  static toAffineBatch(e) {
    const n = iy(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return it.toAffineBatch(e).map(it.fromAffine);
  }
  equals(e) {
    rl(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = N(s * s), l = N(a * a), f = N(n * l), u = N(i * c), p = N(N(r * a) * l), h = N(N(o * s) * c);
    return f === u && p === h;
  }
  negate() {
    return new it(this.x, N(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = N(e * e), i = N(n * n), o = N(i * i), a = e + i, c = N(wn * (N(a * a) - s - o)), l = N(is * s), f = N(l * l), u = N(f - wn * c), p = N(l * (c - u) - tl * o), h = N(wn * n * r);
    return new it(u, p, h);
  }
  add(e) {
    rl(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === rt || o === rt)
      return this;
    if (n === rt || r === rt)
      return e;
    const c = N(s * s), l = N(a * a), f = N(n * l), u = N(i * c), p = N(N(r * a) * l), h = N(N(o * s) * c), b = N(u - f), x = N(h - p);
    if (b === rt)
      return x === rt ? this.double() : it.ZERO;
    const g = N(b * b), I = N(b * g), L = N(f * g), y = N(x * x - I - wn * L), A = N(x * (L - y) - p * I), m = N(s * a * b);
    return new it(y, A, m);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = it.ZERO;
    if (typeof e == "bigint" && e === rt)
      return n;
    let r = ol(e);
    if (r === yt)
      return this;
    if (!Rs) {
      let u = n, p = this;
      for (; r > rt; )
        r & yt && (u = u.add(p)), p = p.double(), r >>= yt;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = zs.splitScalar(r), c = n, l = n, f = this;
    for (; i > rt || a > rt; )
      i & yt && (c = c.add(f)), a & yt && (l = l.add(f)), f = f.double(), i >>= yt, a >>= yt;
    return s && (c = c.negate()), o && (l = l.negate()), l = new it(N(l.x * zs.beta), l.y, l.z), c.add(l);
  }
  precomputeWindow(e) {
    const n = Rs ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(it.BASE) && (n = J.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && ha.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = it.normalizeZ(s), ha.set(n, s)));
    let i = it.ZERO, o = it.BASE;
    const a = 1 + (Rs ? 128 / r : 256 / r), c = 2 ** (r - 1), l = BigInt(2 ** r - 1), f = 2 ** r, u = BigInt(r);
    for (let p = 0; p < a; p++) {
      const h = p * c;
      let b = Number(e & l);
      e >>= u, b > c && (b -= f, e += yt);
      const x = h, g = h + Math.abs(b) - 1, I = p % 2 !== 0, L = b < 0;
      b === 0 ? o = o.add(Gs(I, s[x])) : i = i.add(Gs(L, s[g]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = ol(e), s, i;
    if (Rs) {
      const { k1neg: o, k1: a, k2neg: c, k2: l } = zs.splitScalar(r);
      let { p: f, f: u } = this.wNAF(a, n), { p, f: h } = this.wNAF(l, n);
      f = Gs(o, f), p = Gs(c, p), p = new it(N(p.x * zs.beta), p.y, p.z), s = f.add(p), i = u.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return it.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(it.ZERO);
    e == null && (e = i ? tl : Kr(s));
    const o = e, a = N(o * o), c = N(a * o), l = N(n * a), f = N(r * c), u = N(s * o);
    if (i)
      return J.ZERO;
    if (u !== yt)
      throw new Error("invZ was invalid");
    return new J(l, f);
  }
}
it.BASE = new it(lt.Gx, lt.Gy, yt);
it.ZERO = new it(rt, yt, rt);
function Gs(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const ha = /* @__PURE__ */ new WeakMap();
class J {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, ha.delete(this);
  }
  hasEvenY() {
    return this.y % wn === rt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Jt(n ? e : e.subarray(1));
    if (!pi(r))
      throw new Error("Point is not on curve");
    const s = nl(r);
    let i = sy(s);
    const o = (i & yt) === yt;
    n ? o && (i = N(-i)) : (e[0] & 1) === 1 !== o && (i = N(-i));
    const a = new J(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Jt(e.subarray(1, fe + 1)), r = Jt(e.subarray(fe + 1, fe * 2 + 1)), s = new J(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ie(e), r = n.length, s = n[0];
    if (r === fe)
      return this.fromCompressedHex(n);
    if (r === $i && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Ii && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${$i} compressed bytes or ${Ii} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return J.BASE.multiply(zn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Ih(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = xc(Ie(e)), { n: a } = lt, c = r === 2 || r === 3 ? s + a : s, l = Kr(c, a), f = N(-o * l, a), u = N(i * l, a), p = r & 1 ? "03" : "02", h = J.fromHex(p + xn(c)), b = J.BASE.multiplyAndAddUnsafe(h, f, u);
    if (!b)
      throw new Error("Cannot recover signature: point at infinify");
    return b.assertValidity(), b;
  }
  toRawBytes(e = !1) {
    return mn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = xn(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${xn(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!pi(n) || !pi(r))
      throw new Error(e);
    const s = N(r * r), i = nl(n);
    if (N(s - i) !== rt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new J(this.x, N(-this.y));
  }
  double() {
    return it.fromAffine(this).double().toAffine();
  }
  add(e) {
    return it.fromAffine(this).add(it.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return it.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = it.fromAffine(this), i = n === rt || n === yt || this !== J.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = it.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(it.ZERO) ? void 0 : a.toAffine();
  }
}
J.BASE = new J(lt.Gx, lt.Gy);
J.ZERO = new J(rt, rt);
function sl(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function il(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Cr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Jt(n), left: t.subarray(e + 2) };
}
function ey(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Cr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = il(t.subarray(2)), { data: r, left: s } = il(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Cr(s)}`);
  return { r: e, s: r };
}
class Qt {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Cr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Qt(vi(s.slice(0, 64)), vi(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = ey(n ? e : mn(e));
    return new Qt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Hr(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Hr(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = lt.n >> yt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Qt(this.r, N(-this.s, lt.n)) : this;
  }
  toDERRawBytes() {
    return mn(this.toDERHex());
  }
  toDERHex() {
    const e = sl(es(this.s)), n = sl(es(this.r)), r = e.length / 2, s = n.length / 2, i = es(r), o = es(s);
    return `30${es(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return mn(this.toCompactHex());
  }
  toCompactHex() {
    return xn(this.r) + xn(this.s);
  }
}
function gn(...t) {
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
const ny = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Cr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ny[t[n]];
  return e;
}
const ry = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function xn(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(rt <= t && t < ry))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Mr(t) {
  const e = mn(xn(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function es(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function vi(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function mn(t) {
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
function Jt(t) {
  return vi(Cr(t));
}
function Ie(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : mn(t);
}
function ol(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Hr(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function N(t, e = lt.P) {
  const n = t % e;
  return n >= rt ? n : e + n;
}
function ee(t, e) {
  const { P: n } = lt;
  let r = t;
  for (; e-- > rt; )
    r *= r, r %= n;
  return r;
}
function sy(t) {
  const { P: e } = lt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, l = c * c * t % e, f = ee(l, is) * l % e, u = ee(f, is) * l % e, p = ee(u, wn) * c % e, h = ee(p, r) * p % e, b = ee(h, s) * h % e, x = ee(b, o) * b % e, g = ee(x, a) * x % e, I = ee(g, o) * b % e, L = ee(I, is) * l % e, y = ee(L, i) * h % e, A = ee(y, n) * c % e, m = ee(A, wn);
  if (m * m % e !== t)
    throw new Error("Cannot find square root");
  return m;
}
function Kr(t, e = lt.P) {
  if (t === rt || e <= rt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = N(t, e), r = e, s = rt, i = yt;
  for (; n !== rt; ) {
    const a = r / n, c = r % n, l = s - i * a;
    r = n, n = c, s = i, i = l;
  }
  if (r !== yt)
    throw new Error("invert: does not exist");
  return N(s, e);
}
function iy(t, e = lt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === rt ? i : (n[a] = i, N(i * o, e)), yt), s = Kr(r, e);
  return t.reduceRight((i, o, a) => o === rt ? i : (n[a] = N(i * n[a], e), N(i * o, e)), s), n;
}
function oy(t) {
  const e = t.length * 8 - Fn * 8, n = Jt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function xc(t, e = !1) {
  const n = oy(t);
  if (e)
    return n;
  const { n: r } = lt;
  return n >= r ? n - r : n;
}
let Ir, os;
class Ah {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return At.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return os(this.k, ...e);
  }
  checkSync() {
    if (typeof os != "function")
      throw new wc("hmacSha256Sync needs to be set");
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
    return gn(...n);
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
    return gn(...n);
  }
}
function Hr(t) {
  return rt < t && t < lt.n;
}
function pi(t) {
  return rt < t && t < lt.P;
}
function $h(t, e, n, r = !0) {
  const { n: s } = lt, i = xc(t, !0);
  if (!Hr(i))
    return;
  const o = Kr(i, s), a = J.BASE.multiply(i), c = N(a.x, s);
  if (c === rt)
    return;
  const l = N(o * N(e + n * c, s), s);
  if (l === rt)
    return;
  let f = new Qt(c, l), u = (a.x === f.r ? 0 : 2) | Number(a.y & yt);
  return r && f.hasHighS() && (f = f.normalizeS(), u ^= 1), { sig: f, recovery: u };
}
function zn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Fn)
      throw new Error("Expected 32 bytes of private key");
    e = vi(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Fn)
      throw new Error("Expected 32 bytes of private key");
    e = Jt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Hr(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function mc(t) {
  return t instanceof J ? (t.assertValidity(), t) : J.fromHex(t);
}
function Ih(t) {
  if (t instanceof Qt)
    return t.assertValidity(), t;
  try {
    return Qt.fromDER(t);
  } catch {
    return Qt.fromCompact(t);
  }
}
function Bs(t, e = !1) {
  return J.fromPrivateKey(t).toRawBytes(e);
}
function ay(t, e, n, r = !1) {
  return J.fromSignature(t, e, n).toRawBytes(r);
}
function al(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === $i || r === Ii : n ? r === $i * 2 || r === Ii * 2 : t instanceof J;
}
function Sc(t, e, n = !1) {
  if (al(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!al(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = mc(e);
  return r.assertValidity(), r.multiply(zn(t)).toRawBytes(n);
}
function vh(t) {
  const e = t.length > fe ? t.slice(0, fe) : t;
  return Jt(e);
}
function cy(t) {
  const e = vh(t), n = N(e, lt.n);
  return Lh(n < rt ? e : n);
}
function Lh(t) {
  return Mr(t);
}
function Bh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ie(t), s = zn(e), i = [Lh(s), cy(r)];
  if (n != null) {
    n === !0 && (n = At.randomBytes(fe));
    const c = Ie(n);
    if (c.length !== fe)
      throw new Error(`sign: Expected ${fe} bytes of extra data`);
    i.push(c);
  }
  const o = gn(...i), a = vh(r);
  return { seed: o, m: a, d: s };
}
function Ch(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function uy(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Bh(t, e, n.extraEntropy), o = new Ah(Eh, Fn);
  await o.reseed(r);
  let a;
  for (; !(a = $h(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Ch(a, n);
}
function Qi(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Bh(t, e, n.extraEntropy), o = new Ah(Eh, Fn);
  o.reseedSync(r);
  let a;
  for (; !(a = $h(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Ch(a, n);
}
const ly = { strict: !0 };
function fy(t, e, n, r = ly) {
  let s;
  try {
    s = Ih(t), e = Ie(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = xc(e);
  let c;
  try {
    c = mc(n);
  } catch {
    return !1;
  }
  const { n: l } = lt, f = Kr(o, l), u = N(a * f, l), p = N(i * f, l), h = J.BASE.multiplyAndAddUnsafe(c, u, p);
  return h ? N(h.x, l) === i : !1;
}
function Li(t) {
  return N(Jt(t), lt.n);
}
class Ur {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ie(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Jt(n.subarray(0, 32)), s = Jt(n.subarray(32, 64));
    return new Ur(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!pi(e) || !Hr(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return xn(this.r) + xn(this.s);
  }
  toRawBytes() {
    return mn(this.toHex());
  }
}
function hy(t) {
  return J.fromPrivateKey(t).toRawX();
}
class Mh {
  constructor(e, n, r = At.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ie(e);
    const { x: s, scalar: i } = this.getScalar(zn(n));
    if (this.px = s, this.d = i, this.rand = Ie(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = J.fromPrivateKey(e), r = n.hasEvenY() ? e : lt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Mr(e ^ Jt(n));
  }
  finalizeNonce(e) {
    const n = N(Jt(e), lt.n);
    if (n === rt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Ur(e.x, N(n + r * s, lt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = At.taggedHash, o = this.initNonce(n, await i(dn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(await i(dn.nonce, o, r, e)), f = Li(await i(dn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return await _h(u, e, r) || this.error(), u;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = At.taggedHashSync, o = this.initNonce(n, i(dn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(i(dn.nonce, o, r, e)), f = Li(i(dn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return Th(u, e, r) || this.error(), u;
  }
}
async function dy(t, e, n) {
  return new Mh(t, e, n).calc();
}
function py(t, e, n) {
  return new Mh(t, e, n).calcSync();
}
function Hh(t, e, n) {
  const r = t instanceof Ur, s = r ? t : Ur.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ie(e),
    P: mc(n)
  };
}
function Uh(t, e, n, r) {
  const s = J.BASE.multiplyAndAddUnsafe(e, zn(n), N(-r, lt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function _h(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Hh(t, e, n), a = Li(await At.taggedHash(dn.challenge, Mr(r), o.toRawX(), i));
    return Uh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Th(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Hh(t, e, n), a = Li(At.taggedHashSync(dn.challenge, Mr(r), o.toRawX(), i));
    return Uh(r, o, s, a);
  } catch (r) {
    if (r instanceof wc)
      throw r;
    return !1;
  }
}
const gy = {
  Signature: Ur,
  getPublicKey: hy,
  sign: dy,
  verify: _h,
  signSync: py,
  verifySync: Th
};
J.BASE._setWindowSize(8);
const qt = {
  node: Sh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, dn = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ks = {}, At = {
  bytesToHex: Cr,
  hexToBytes: mn,
  concatBytes: gn,
  mod: N,
  invert: Kr,
  isValidPrivateKey(t) {
    try {
      return zn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Mr,
  _normalizePrivateKey: zn,
  hashToPrivateKey: (t) => {
    t = Ie(t);
    const e = Fn + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = N(Jt(t), lt.n - yt) + yt;
    return Mr(n);
  },
  randomBytes: (t = 32) => {
    if (qt.web)
      return qt.web.getRandomValues(new Uint8Array(t));
    if (qt.node) {
      const { randomBytes: e } = qt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => At.hashToPrivateKey(At.randomBytes(Fn + 8)),
  precompute(t = 8, e = J.BASE) {
    const n = e === J.BASE ? e : new J(e.x, e.y);
    return n._setWindowSize(t), n.multiply(is), n;
  },
  sha256: async (...t) => {
    if (qt.web) {
      const e = await qt.web.subtle.digest("SHA-256", gn(...t));
      return new Uint8Array(e);
    } else if (qt.node) {
      const { createHash: e } = qt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (qt.web) {
      const n = await qt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = gn(...e), s = await qt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (qt.node) {
      const { createHmac: n } = qt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ks[t];
    if (n === void 0) {
      const r = await At.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = gn(r, r), Ks[t] = n;
    }
    return At.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Ir != "function")
      throw new wc("sha256Sync is undefined, you need to set it");
    let n = Ks[t];
    if (n === void 0) {
      const r = Ir(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = gn(r, r), Ks[t] = n;
    }
    return Ir(n, ...e);
  },
  _JacobianPoint: it
};
Object.defineProperties(At, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ir;
    },
    set(t) {
      Ir || (Ir = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return os;
    },
    set(t) {
      os || (os = t);
    }
  }
});
const yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: lt,
  Point: J,
  Signature: Qt,
  getPublicKey: Bs,
  getSharedSecret: Sc,
  recoverPublicKey: ay,
  schnorr: gy,
  sign: uy,
  signSync: Qi,
  utils: At,
  verify: fy
}, Symbol.toStringTag, { value: "Module" }));
var Cs = {};
Cs.byteLength = Sy;
var by = Cs.toByteArray = Ay, wy = Cs.fromByteArray = vy, xe = [], ne = [], xy = typeof Uint8Array < "u" ? Uint8Array : Array, Oo = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var br = 0, my = Oo.length; br < my; ++br)
  xe[br] = Oo[br], ne[Oo.charCodeAt(br)] = br;
ne[45] = 62;
ne[95] = 63;
function Nh(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Sy(t) {
  var e = Nh(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Ey(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Ay(t) {
  var e, n = Nh(t), r = n[0], s = n[1], i = new xy(Ey(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = ne[t.charCodeAt(c)] << 18 | ne[t.charCodeAt(c + 1)] << 12 | ne[t.charCodeAt(c + 2)] << 6 | ne[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ne[t.charCodeAt(c)] << 2 | ne[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ne[t.charCodeAt(c)] << 10 | ne[t.charCodeAt(c + 1)] << 4 | ne[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function $y(t) {
  return xe[t >> 18 & 63] + xe[t >> 12 & 63] + xe[t >> 6 & 63] + xe[t & 63];
}
function Iy(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push($y(r));
  return s.join("");
}
function vy(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Iy(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    xe[e >> 2] + xe[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    xe[e >> 10] + xe[e >> 4 & 63] + xe[e << 2 & 63] + "="
  )), s.join("");
}
function Ly() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const By = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Cy() {
  if (Ly())
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
    throw new Error(By);
  }
}
class My {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array($e(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array($e(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Hy {
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
async function Ph() {
  const t = await Cy();
  return t.name === "subtleCrypto" ? new Hy(t.lib) : new My(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Uy(t) {
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
    for (var b = 0, x = 0, g = 0, I = h.length; g !== I && h[g] === 0; )
      g++, b++;
    for (var L = (I - g) * l + 1 >>> 0, y = new Uint8Array(L); g !== I; ) {
      for (var A = h[g], m = 0, B = L - 1; (A !== 0 || m < x) && B !== -1; B--, m++)
        A += 256 * y[B] >>> 0, y[B] = A % o >>> 0, A = A / o >>> 0;
      if (A !== 0)
        throw new Error("Non-zero carry");
      x = m, g++;
    }
    for (var D = L - x; D !== L && y[D] === 0; )
      D++;
    for (var _ = a.repeat(b); D < L; ++D)
      _ += t.charAt(y[D]);
    return _;
  }
  function u(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var b = 0, x = 0, g = 0; h[b] === a; )
      x++, b++;
    for (var I = (h.length - b) * c + 1 >>> 0, L = new Uint8Array(I); h[b]; ) {
      var y = h.charCodeAt(b);
      if (y > 255)
        return;
      var A = e[y];
      if (A === 255)
        return;
      for (var m = 0, B = I - 1; (A !== 0 || m < g) && B !== -1; B--, m++)
        A += o * L[B] >>> 0, L[B] = A % 256 >>> 0, A = A / 256 >>> 0;
      if (A !== 0)
        throw new Error("Non-zero carry");
      g = m, b++;
    }
    for (var D = I - g; D !== I && L[D] === 0; )
      D++;
    for (var _ = new Uint8Array(x + (I - D)), k = x; D !== I; )
      _[k++] = L[D++];
    return _;
  }
  function p(h) {
    var b = u(h);
    if (b)
      return b;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: u,
    decode: p
  };
}
var kh = Uy;
const _y = kh, Ty = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Ny = _y(Ty);
const Py = /* @__PURE__ */ oh(Ny), ky = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Dh = Uint8Array.from({ length: 16 }, (t, e) => e), Dy = Dh.map((t) => (9 * t + 5) % 16);
let Ec = [Dh], Ac = [Dy];
for (let t = 0; t < 4; t++)
  for (let e of [Ec, Ac])
    e.push(e[t].map((n) => ky[n]));
const Oh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Oy = Ec.map((t, e) => t.map((n) => Oh[e][n])), jy = Ac.map((t, e) => t.map((n) => Oh[e][n])), Fy = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zy = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vs = (t, e) => t << e | t >>> 32 - e;
function cl(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qs = new Uint32Array(16);
let Ry = class extends bc {
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
      qs[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, x = Fy[h], g = zy[h], I = Ec[h], L = Ac[h], y = Oy[h], A = jy[h];
      for (let m = 0; m < 16; m++) {
        const B = Vs(r + cl(h, i, a, l) + qs[I[m]] + x, y[m]) + u | 0;
        r = u, u = l, l = Vs(a, 10) | 0, a = i, i = B;
      }
      for (let m = 0; m < 16; m++) {
        const B = Vs(s + cl(b, o, c, f) + qs[L[m]] + g, A[m]) + p | 0;
        s = p, p = f, f = Vs(c, 10) | 0, c = o, o = B;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    qs.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Gy = rr(() => new Ry());
function Ky(t) {
  return Gy(t);
}
const Ws = BigInt(2 ** 32 - 1), da = BigInt(32);
function jh(t, e = !1) {
  return e ? { h: Number(t & Ws), l: Number(t >> da & Ws) } : { h: Number(t >> da & Ws) | 0, l: Number(t & Ws) | 0 };
}
function Vy(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = jh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const qy = (t, e) => BigInt(t >>> 0) << da | BigInt(e >>> 0), Wy = (t, e, n) => t >>> n, Yy = (t, e, n) => t << 32 - n | e >>> n, Xy = (t, e, n) => t >>> n | e << 32 - n, Zy = (t, e, n) => t << 32 - n | e >>> n, Qy = (t, e, n) => t << 64 - n | e >>> n - 32, Jy = (t, e, n) => t >>> n - 32 | e << 64 - n, tb = (t, e) => e, eb = (t, e) => t, nb = (t, e, n) => t << n | e >>> 32 - n, rb = (t, e, n) => e << n | t >>> 32 - n, sb = (t, e, n) => e << n - 32 | t >>> 64 - n, ib = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ob(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ab = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), cb = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ub = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), lb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, fb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), hb = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, q = {
  fromBig: jh,
  split: Vy,
  toBig: qy,
  shrSH: Wy,
  shrSL: Yy,
  rotrSH: Xy,
  rotrSL: Zy,
  rotrBH: Qy,
  rotrBL: Jy,
  rotr32H: tb,
  rotr32L: eb,
  rotlSH: nb,
  rotlSL: rb,
  rotlBH: sb,
  rotlBL: ib,
  add: ob,
  add3L: ab,
  add3H: cb,
  add4L: ub,
  add4H: lb,
  add5H: hb,
  add5L: fb
}, [db, pb] = q.split([
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
].map((t) => BigInt(t))), Ke = new Uint32Array(80), Ve = new Uint32Array(80);
let Ji = class extends bc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: b, Hh: x, Hl: g } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, b, x, g];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, b, x, g) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = x | 0, this.Hl = g | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Ke[y] = e.getUint32(n), Ve[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const A = Ke[y - 15] | 0, m = Ve[y - 15] | 0, B = q.rotrSH(A, m, 1) ^ q.rotrSH(A, m, 8) ^ q.shrSH(A, m, 7), D = q.rotrSL(A, m, 1) ^ q.rotrSL(A, m, 8) ^ q.shrSL(A, m, 7), _ = Ke[y - 2] | 0, k = Ve[y - 2] | 0, w = q.rotrSH(_, k, 19) ^ q.rotrBH(_, k, 61) ^ q.shrSH(_, k, 6), $ = q.rotrSL(_, k, 19) ^ q.rotrBL(_, k, 61) ^ q.shrSL(_, k, 6), T = q.add4L(D, $, Ve[y - 7], Ve[y - 16]), j = q.add4H(T, B, w, Ke[y - 7], Ke[y - 16]);
      Ke[y] = j | 0, Ve[y] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: b, Gh: x, Gl: g, Hh: I, Hl: L } = this;
    for (let y = 0; y < 80; y++) {
      const A = q.rotrSH(u, p, 14) ^ q.rotrSH(u, p, 18) ^ q.rotrBH(u, p, 41), m = q.rotrSL(u, p, 14) ^ q.rotrSL(u, p, 18) ^ q.rotrBL(u, p, 41), B = u & h ^ ~u & x, D = p & b ^ ~p & g, _ = q.add5L(L, m, D, pb[y], Ve[y]), k = q.add5H(_, I, A, B, db[y], Ke[y]), w = _ | 0, $ = q.rotrSH(r, s, 28) ^ q.rotrBH(r, s, 34) ^ q.rotrBH(r, s, 39), T = q.rotrSL(r, s, 28) ^ q.rotrBL(r, s, 34) ^ q.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      I = x | 0, L = g | 0, x = h | 0, g = b | 0, h = u | 0, b = p | 0, { h: u, l: p } = q.add(l | 0, f | 0, k | 0, w | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const M = q.add3L(w, T, G);
      r = q.add3H(M, k, $, j), s = M | 0;
    }
    ({ h: r, l: s } = q.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = q.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = q.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = q.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: b } = q.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: x, l: g } = q.add(this.Gh | 0, this.Gl | 0, x | 0, g | 0), { h: I, l: L } = q.add(this.Hh | 0, this.Hl | 0, I | 0, L | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, b, x, g, I, L);
  }
  roundClean() {
    Ke.fill(0), Ve.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, gb = class extends Ji {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, yb = class extends Ji {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, bb = class extends Ji {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const wb = rr(() => new Ji());
rr(() => new gb());
rr(() => new yb());
rr(() => new bb());
function Fh(t) {
  return Br(t);
}
function xb(t) {
  return wb(t);
}
const mb = 0;
At.hmacSha256Sync = (t, ...e) => {
  const n = Zi.create(Br, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Sb() {
  return K(At.randomPrivateKey());
}
function Eb(t) {
  const e = Br(Br(t));
  return Py.encode($e(t, e).slice(0, t.length + 4));
}
function Ab(t, e) {
  return Eb($e(new Uint8Array([t]), e.slice(0, 20)));
}
function zh(t, e = mb) {
  const n = typeof t == "string" ? st(t) : t, r = Ky(Fh(n));
  return Ab(e, r);
}
function Rh(t) {
  const e = gc(t);
  return K(Bs(e.slice(0, 32), !0));
}
At.hmacSha256Sync = (t, ...e) => {
  const n = Zi.create(Br, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Bi;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Bi || (Bi = {}));
async function $b(t, e, n) {
  return await (await Ph()).encrypt("aes-256-cbc", e, t, n);
}
async function Ib(t, e, n) {
  return await (await Ph()).decrypt("aes-256-cbc", e, t, n);
}
function Gh(t, e) {
  return Zi(Br, t, e);
}
function vb(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Kh(t) {
  const e = xb(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Lb(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Bb(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Bi.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Bi.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Lb(t))
    return e;
  try {
    return J.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Cb(t, e, n, r) {
  const s = Bb(t);
  if (!s.result)
    throw s;
  const i = At.randomPrivateKey(), o = Bs(i, !0);
  let a = Sc(i, t, !0);
  a = a.slice(1);
  const c = Kh(a), l = At.randomBytes(16), f = await $b(l, c.encryptionKey, e), u = $e(l, o, f), p = Gh(c.hmacKey, u);
  let h;
  if (!r || r === "hex")
    h = K(f);
  else if (r === "base64")
    h = wy(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const b = {
    iv: K(l),
    ephemeralPK: K(o),
    cipherText: h,
    mac: K(p),
    wasString: n
  };
  return r && r !== "hex" && (b.cipherTextEncoding = r), b;
}
async function Vh(t, e) {
  if (!e.ephemeralPK)
    throw new Xu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Sc(t, n, !0);
  r = r.slice(1);
  const s = Kh(r), i = st(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = st(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = by(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = $e(i, st(n), o), c = Gh(s.hmacKey, a), l = st(e.mac);
  if (!vb(l, c))
    throw new Xu("Decryption failed: failure in MAC check");
  const f = await Ib(i, s.encryptionKey, o);
  return e.wasString ? Ls(f) : f;
}
function Mb(t, e) {
  const n = typeof e == "string" ? nr(e) : e, r = Rh(t), s = Fh(n), i = Qi(s, t);
  return {
    signature: K(i),
    publicKey: r
  };
}
async function Hb(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Rh(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? nr(t) : t, o = await Cb(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Mb(r, a), l = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(l);
  }
  return a;
}
function Ub(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Vh(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Ut = {}, _r = {}, Pt = {};
Object.defineProperty(Pt, "__esModule", { value: !0 });
Pt.decode = Pt.encode = Pt.unescape = Pt.escape = Pt.pad = void 0;
const qh = Cs;
function $c(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Pt.pad = $c;
function Wh(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Pt.escape = Wh;
function Yh(t) {
  return $c(t).replace(/-/g, "+").replace(/_/g, "/");
}
Pt.unescape = Yh;
function _b(t) {
  return Wh((0, qh.fromByteArray)(new TextEncoder().encode(t)));
}
Pt.encode = _b;
function Tb(t) {
  return new TextDecoder().decode((0, qh.toByteArray)($c(Yh(t))));
}
Pt.decode = Tb;
var to = {}, eo = {}, Xh = {}, Zh = {}, no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
no.crypto = void 0;
no.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = l, t.clean = f, t.createView = u, t.rotr = p, t.rotl = h, t.byteSwap = b, t.byteSwap32 = x, t.bytesToHex = L, t.hexToBytes = m, t.asyncLoop = D, t.utf8ToBytes = _, t.bytesToUtf8 = k, t.toBytes = w, t.kdfInputToBytes = $, t.concatBytes = T, t.checkOpts = j, t.createHasher = M, t.createOptHasher = pt, t.createXOFer = Kt, t.randomBytes = Fe;
  const e = no;
  function n(S) {
    return S instanceof Uint8Array || ArrayBuffer.isView(S) && S.constructor.name === "Uint8Array";
  }
  function r(S) {
    if (!Number.isSafeInteger(S) || S < 0)
      throw new Error("positive integer expected, got " + S);
  }
  function s(S, ...C) {
    if (!n(S))
      throw new Error("Uint8Array expected");
    if (C.length > 0 && !C.includes(S.length))
      throw new Error("Uint8Array expected of length " + C + ", got length=" + S.length);
  }
  function i(S) {
    if (typeof S != "function" || typeof S.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(S.outputLen), r(S.blockLen);
  }
  function o(S, C = !0) {
    if (S.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (C && S.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(S, C) {
    s(S);
    const ot = C.outputLen;
    if (S.length < ot)
      throw new Error("digestInto() expects output buffer of length at least " + ot);
  }
  function c(S) {
    return new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
  }
  function l(S) {
    return new Uint32Array(S.buffer, S.byteOffset, Math.floor(S.byteLength / 4));
  }
  function f(...S) {
    for (let C = 0; C < S.length; C++)
      S[C].fill(0);
  }
  function u(S) {
    return new DataView(S.buffer, S.byteOffset, S.byteLength);
  }
  function p(S, C) {
    return S << 32 - C | S >>> C;
  }
  function h(S, C) {
    return S << C | S >>> 32 - C >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function b(S) {
    return S << 24 & 4278190080 | S << 8 & 16711680 | S >>> 8 & 65280 | S >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (S) => S : (S) => b(S), t.byteSwapIfBE = t.swap8IfBE;
  function x(S) {
    for (let C = 0; C < S.length; C++)
      S[C] = b(S[C]);
    return S;
  }
  t.swap32IfBE = t.isLE ? (S) => S : x;
  const g = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", I = /* @__PURE__ */ Array.from({ length: 256 }, (S, C) => C.toString(16).padStart(2, "0"));
  function L(S) {
    if (s(S), g)
      return S.toHex();
    let C = "";
    for (let ot = 0; ot < S.length; ot++)
      C += I[S[ot]];
    return C;
  }
  const y = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function A(S) {
    if (S >= y._0 && S <= y._9)
      return S - y._0;
    if (S >= y.A && S <= y.F)
      return S - (y.A - 10);
    if (S >= y.a && S <= y.f)
      return S - (y.a - 10);
  }
  function m(S) {
    if (typeof S != "string")
      throw new Error("hex string expected, got " + typeof S);
    if (g)
      return Uint8Array.fromHex(S);
    const C = S.length, ot = C / 2;
    if (C % 2)
      throw new Error("hex string expected, got unpadded hex of length " + C);
    const ct = new Uint8Array(ot);
    for (let ut = 0, Lt = 0; ut < ot; ut++, Lt += 2) {
      const U = A(S.charCodeAt(Lt)), R = A(S.charCodeAt(Lt + 1));
      if (U === void 0 || R === void 0) {
        const et = S[Lt] + S[Lt + 1];
        throw new Error('hex string expected, got non-hex character "' + et + '" at index ' + Lt);
      }
      ct[ut] = U * 16 + R;
    }
    return ct;
  }
  const B = async () => {
  };
  t.nextTick = B;
  async function D(S, C, ot) {
    let ct = Date.now();
    for (let ut = 0; ut < S; ut++) {
      ot(ut);
      const Lt = Date.now() - ct;
      Lt >= 0 && Lt < C || (await (0, t.nextTick)(), ct += Lt);
    }
  }
  function _(S) {
    if (typeof S != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(S));
  }
  function k(S) {
    return new TextDecoder().decode(S);
  }
  function w(S) {
    return typeof S == "string" && (S = _(S)), s(S), S;
  }
  function $(S) {
    return typeof S == "string" && (S = _(S)), s(S), S;
  }
  function T(...S) {
    let C = 0;
    for (let ct = 0; ct < S.length; ct++) {
      const ut = S[ct];
      s(ut), C += ut.length;
    }
    const ot = new Uint8Array(C);
    for (let ct = 0, ut = 0; ct < S.length; ct++) {
      const Lt = S[ct];
      ot.set(Lt, ut), ut += Lt.length;
    }
    return ot;
  }
  function j(S, C) {
    if (C !== void 0 && {}.toString.call(C) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(S, C);
  }
  class G {
  }
  t.Hash = G;
  function M(S) {
    const C = (ct) => S().update(w(ct)).digest(), ot = S();
    return C.outputLen = ot.outputLen, C.blockLen = ot.blockLen, C.create = () => S(), C;
  }
  function pt(S) {
    const C = (ct, ut) => S(ut).update(w(ct)).digest(), ot = S({});
    return C.outputLen = ot.outputLen, C.blockLen = ot.blockLen, C.create = (ct) => S(ct), C;
  }
  function Kt(S) {
    const C = (ct, ut) => S(ut).update(w(ct)).digest(), ot = S({});
    return C.outputLen = ot.outputLen, C.blockLen = ot.blockLen, C.create = (ct) => S(ct), C;
  }
  t.wrapConstructor = M, t.wrapConstructorWithOpts = pt, t.wrapXOFConstructorWithOpts = Kt;
  function Fe(S = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(S));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(S));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Zh);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Zh;
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
})(Xh);
const wr = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Qh(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function pa(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function sr(t, ...e) {
  if (!Qh(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Nb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  pa(t.outputLen), pa(t.blockLen);
}
function ga(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Jh(t, e) {
  sr(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Pb(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function kb(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ci(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function gi(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function ie(t, e) {
  return t << 32 - e | t >>> e;
}
function Db(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Ic = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function vc(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const t0 = Ic ? (t) => t : (t) => vc(t), Ob = t0;
function e0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = vc(t[e]);
  return t;
}
const jb = Ic ? (t) => t : e0, n0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Fb = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zb(t) {
  if (sr(t), n0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Fb[t[n]];
  return e;
}
const He = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function ul(t) {
  if (t >= He._0 && t <= He._9)
    return t - He._0;
  if (t >= He.A && t <= He.F)
    return t - (He.A - 10);
  if (t >= He.a && t <= He.f)
    return t - (He.a - 10);
}
function Rb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (n0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = ul(t.charCodeAt(i)), a = ul(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const r0 = async () => {
};
async function Gb(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await r0(), r += i);
  }
}
function Lc(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Kb(t) {
  return new TextDecoder().decode(t);
}
function Ms(t) {
  return typeof t == "string" && (t = Lc(t)), sr(t), t;
}
function Vb(t) {
  return typeof t == "string" && (t = Lc(t)), sr(t), t;
}
function qb(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    sr(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Wb(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let s0 = class {
};
function ro(t) {
  const e = (r) => t().update(Ms(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function i0(t) {
  const e = (r, s) => t(s).update(Ms(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function o0(t) {
  const e = (r, s) => t(s).update(Ms(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Yb = ro, Xb = i0, Zb = o0;
function Qb(t = 32) {
  if (wr && typeof wr.getRandomValues == "function")
    return wr.getRandomValues(new Uint8Array(t));
  if (wr && typeof wr.randomBytes == "function")
    return Uint8Array.from(wr.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Jb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: s0,
  abytes: sr,
  aexists: ga,
  ahash: Nb,
  anumber: pa,
  aoutput: Jh,
  asyncLoop: Gb,
  byteSwap: vc,
  byteSwap32: e0,
  byteSwapIfBE: Ob,
  bytesToHex: zb,
  bytesToUtf8: Kb,
  checkOpts: Wb,
  clean: Ci,
  concatBytes: qb,
  createHasher: ro,
  createOptHasher: i0,
  createView: gi,
  createXOFer: o0,
  hexToBytes: Rb,
  isBytes: Qh,
  isLE: Ic,
  kdfInputToBytes: Vb,
  nextTick: r0,
  randomBytes: Qb,
  rotl: Db,
  rotr: ie,
  swap32IfBE: jb,
  swap8IfBE: t0,
  toBytes: Ms,
  u32: kb,
  u8: Pb,
  utf8ToBytes: Lc,
  wrapConstructor: Yb,
  wrapConstructorWithOpts: Xb,
  wrapXOFConstructorWithOpts: Zb
}, Symbol.toStringTag, { value: "Module" }));
function tw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
function ew(t, e, n) {
  return t & e ^ ~t & n;
}
function nw(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class rw extends s0 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = gi(this.buffer);
  }
  update(e) {
    ga(this), e = Ms(e), sr(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = gi(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ga(this), Jh(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Ci(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    tw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = gi(e), c = this.outputLen;
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
const qe = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), We = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), sw = /* @__PURE__ */ Uint32Array.from([
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
]), Ye = /* @__PURE__ */ new Uint32Array(64);
let Bc = class extends rw {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = qe[0] | 0, this.B = qe[1] | 0, this.C = qe[2] | 0, this.D = qe[3] | 0, this.E = qe[4] | 0, this.F = qe[5] | 0, this.G = qe[6] | 0, this.H = qe[7] | 0;
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
      Ye[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = Ye[u - 15], h = Ye[u - 2], b = ie(p, 7) ^ ie(p, 18) ^ p >>> 3, x = ie(h, 17) ^ ie(h, 19) ^ h >>> 10;
      Ye[u] = x + Ye[u - 7] + b + Ye[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = ie(a, 6) ^ ie(a, 11) ^ ie(a, 25), h = f + p + ew(a, c, l) + sw[u] + Ye[u] | 0, x = (ie(r, 2) ^ ie(r, 13) ^ ie(r, 22)) + nw(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Ci(Ye);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ci(this.buffer);
  }
}, a0 = class extends Bc {
  constructor() {
    super(28), this.A = We[0] | 0, this.B = We[1] | 0, this.C = We[2] | 0, this.D = We[3] | 0, this.E = We[4] | 0, this.F = We[5] | 0, this.G = We[6] | 0, this.H = We[7] | 0;
  }
};
const iw = /* @__PURE__ */ ro(() => new Bc()), ow = /* @__PURE__ */ ro(() => new a0()), aw = Bc, cw = iw, uw = a0, lw = ow, fw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: uw,
  SHA256: aw,
  sha224: lw,
  sha256: cw
}, Symbol.toStringTag, { value: "Module" })), so = /* @__PURE__ */ Yi(fw), hw = /* @__PURE__ */ Yi(yy);
var Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.joseToDer = Tr.derToJose = void 0;
const c0 = Cs, u0 = Pt;
function jo(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const dw = {
  ES256: jo(256),
  ES384: jo(384),
  ES512: jo(521)
};
function l0(t) {
  const e = dw[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Mi = 128, f0 = 0, pw = 32, gw = 16, yw = 2, h0 = gw | pw | f0 << 6, Hi = yw | f0 << 6;
function d0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, c0.toByteArray)((0, u0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function bw(t, e) {
  const n = d0(t), r = l0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== h0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Mi | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Hi)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const l = o;
  if (o += c, n[o++] !== Hi)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const u = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const p = r - c, h = r - f, b = new Uint8Array(p + c + h + f);
  for (o = 0; o < p; ++o)
    b[o] = 0;
  b.set(n.subarray(l + Math.max(-p, 0), l + c), o), o = r;
  for (const x = o; o < x + h; ++o)
    b[o] = 0;
  return b.set(n.subarray(u + Math.max(-h, 0), u + f), o), (0, u0.escape)((0, c0.fromByteArray)(b));
}
Tr.derToJose = bw;
function ll(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Mi && --r, r;
}
function ww(t, e) {
  t = d0(t);
  const n = l0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = ll(t, 0, n), i = ll(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, l = c < Mi, f = new Uint8Array((l ? 2 : 3) + c);
  let u = 0;
  return f[u++] = h0, l ? f[u++] = c : (f[u++] = Mi | 1, f[u++] = c & 255), f[u++] = Hi, f[u++] = o, s < 0 ? (f[u++] = 0, f.set(t.subarray(0, n), u), u += n) : (f.set(t.subarray(s, n), u), u += n - s), f[u++] = Hi, f[u++] = a, i < 0 ? (f[u++] = 0, f.set(t.subarray(n), u)) : f.set(t.subarray(n + i), u), f;
}
Tr.joseToDer = ww;
var De = {};
Object.defineProperty(De, "__esModule", { value: !0 });
De.InvalidTokenError = De.MissingParametersError = void 0;
class xw extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
De.MissingParametersError = xw;
class mw extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
De.InvalidTokenError = mw;
const Hs = /* @__PURE__ */ Yi(Jb);
Object.defineProperty(eo, "__esModule", { value: !0 });
eo.SECP256K1Client = void 0;
const Sw = Xh, Ew = so, yi = hw, fl = Tr, hl = De, dl = Hs;
yi.utils.hmacSha256Sync = (t, ...e) => {
  const n = Sw.hmac.create(Ew.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class p0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, dl.bytesToHex)(yi.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new hl.MissingParametersError("a signing input hash and private key are all required");
    const s = yi.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, dl.bytesToHex)(s);
    if (r === "jose")
      return (0, fl.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, fl.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new hl.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return yi.verify(n, e, r, { strict: !1 });
  }
}
eo.SECP256K1Client = p0;
p0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = eo;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(to);
var Rn = {};
const Aw = /* @__PURE__ */ Yi(Sh);
var $w = Dt && Dt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.hashSha256Async = Rn.hashSha256 = void 0;
const Iw = so;
function g0(t) {
  return (0, Iw.sha256)(t);
}
Rn.hashSha256 = g0;
function vw(t) {
  return $w(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Aw;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(g0(t));
    }
  });
}
Rn.hashSha256Async = vw;
var Lw = Dt && Dt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.TokenSigner = _r.createUnsecuredToken = void 0;
const ya = Pt, pl = to, Bw = De, gl = Rn;
function ba(t, e) {
  const n = [], r = ya.encode(JSON.stringify(e));
  n.push(r);
  const s = ya.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Cw(t) {
  return ba(t, { typ: "JWT", alg: "none" }) + ".";
}
_r.createUnsecuredToken = Cw;
class Mw {
  constructor(e, n) {
    if (!(e && n))
      throw new Bw.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !pl.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = pl.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = ba(e, s), o = (0, gl.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Lw(this, void 0, void 0, function* () {
      const s = this.header(r), i = ba(e, s), o = yield (0, gl.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [ya.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
_r.TokenSigner = Mw;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
io.TokenVerifier = void 0;
const Hw = Pt, yl = to, Uw = De, Ys = Rn;
class _w {
  constructor(e, n) {
    if (!(e && n))
      throw new Uw.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !yl.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = yl.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Ys.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Ys.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Hw.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ys.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Ys.hashSha256)(r);
      return i(o);
    }
  }
}
io.TokenVerifier = _w;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
oo.decodeToken = void 0;
const Xs = Pt;
function Tw(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Xs.decode(e[0])), r = JSON.parse(Xs.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Xs.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Xs.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
oo.decodeToken = Tw;
(function(t) {
  var e = Dt && Dt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Dt && Dt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(_r, t), n(io, t), n(oo, t), n(De, t), n(to, t);
})(Ut);
function Nw(t) {
  return `did:btc-addr:${t}`;
}
function Pw(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Yu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Yu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function y0(t) {
  if (t)
    return Pw(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const kw = "1.4.0";
function Dw() {
  return Sb();
}
function Ow(t, e, n, r = fh.slice(), s, i = w1().getTime(), o = {}) {
  const a = (h) => {
    const b = dc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return b == null ? void 0 : b.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: m1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: kw,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), l = Ut.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [l];
  const f = zh(l);
  return c.iss = Nw(f), new Ut.TokenSigner("ES256k", t).sign(c);
}
async function bl(t, e) {
  const n = Ls(st(e)), r = JSON.parse(n), s = await Vh(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function jw(t) {
  const e = Ut.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Ut.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Fw(t) {
  const e = Ut.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = y0(e.iss);
  if (n.length === 1) {
    if (zh(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function zw(t) {
  const e = Ut.decodeToken(t).payload;
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
function Rw(t) {
  const e = Ut.decodeToken(t).payload;
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
function Gw(t) {
  const e = [
    Rw(t),
    zw(t),
    jw(t),
    Fw(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const wl = "1.0.0";
class Sn {
  constructor(e) {
    this.version = wl, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== wl)
      throw new ca(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Sn(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class b0 {
  constructor(e) {
    if (e) {
      const n = new Sn(e);
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
class xl extends b0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Sn({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new hh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Sn({})), !0;
  }
}
class ml extends b0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = g1, !localStorage.getItem(this.key)) {
      const r = new Sn({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new hh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Sn.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Sn({})), !0;
  }
}
var hs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(hs || (hs = {}));
var Ui;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ui || (Ui = {}));
hs.Mainnet;
var Pe;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pe || (Pe = {}));
var Se;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Se || (Se = {}));
Pe.Mainnet;
const w0 = {
  chainId: hs.Mainnet,
  transactionVersion: Pe.Mainnet,
  peerNetworkId: Ui.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Se.MainnetSingleSig,
    multiSig: Se.MainnetMultiSig
  },
  client: { baseUrl: dh }
}, wa = {
  chainId: hs.Testnet,
  transactionVersion: Pe.Testnet,
  peerNetworkId: Ui.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Se.TestnetSingleSig,
    multiSig: Se.TestnetMultiSig
  },
  client: { baseUrl: ph }
}, bi = {
  ...wa,
  addressVersion: { ...wa.addressVersion },
  magicBytes: "id",
  client: { baseUrl: gh }
}, Kw = {
  ...bi,
  addressVersion: { ...bi.addressVersion },
  client: { ...bi.client }
};
function Vw(t) {
  switch (t) {
    case "mainnet":
      return w0;
    case "testnet":
      return wa;
    case "devnet":
      return bi;
    case "mocknet":
      return Kw;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function x0(t) {
  return typeof t == "string" ? Vw(t) : t;
}
var Sl;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Sl || (Sl = {}));
var El;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(El || (El = {}));
var oe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(oe || (oe = {}));
const Fo = ["onChainOnly", "offChainOnly", "any"];
Fo[0] + "", oe.OnChainOnly, Fo[1] + "", oe.OffChainOnly, Fo[2] + "", oe.Any, oe.OnChainOnly + "", oe.OnChainOnly, oe.OffChainOnly + "", oe.OffChainOnly, oe.Any + "", oe.Any;
var Al;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Al || (Al = {}));
var $l;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})($l || ($l = {}));
var Il;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Il || (Il = {}));
var Ne;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ne || (Ne = {}));
var vl;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(vl || (vl = {}));
var Ll;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ll || (Ll = {}));
var Bl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Bl || (Bl = {}));
var Cl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Cl || (Cl = {}));
var Ml;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ml || (Ml = {}));
var Hl;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Hl || (Hl = {}));
var Ul;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ul || (Ul = {}));
var _l;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(_l || (_l = {}));
var Tl;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Tl || (Tl = {}));
function xa(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function qw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function m0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ww(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  xa(t.outputLen), xa(t.blockLen);
}
function Yw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xw(t, e) {
  m0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Hn = {
  number: xa,
  bool: qw,
  bytes: m0,
  hash: Ww,
  exists: Yw,
  output: Xw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const zo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ge = (t, e) => t << 32 - e | t >>> e, Zw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Zw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Cc(t) {
  if (typeof t == "string" && (t = Qw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let S0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ir(t) {
  const e = (r) => t().update(Cc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let E0 = class extends S0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Hn.hash(e);
    const r = Cc(n);
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
    return Hn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Hn.exists(this), Hn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const A0 = (t, e, n) => new E0(t, e).update(n).digest();
A0.create = (t, e) => new E0(t, e);
function Jw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Mc = class extends S0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = zo(this.buffer);
  }
  update(e) {
    Hn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Cc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = zo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Hn.exists(this), Hn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Jw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = zo(e), c = this.outputLen;
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
const t2 = (t, e, n) => t & e ^ ~t & n, e2 = (t, e, n) => t & e ^ t & n ^ e & n, n2 = new Uint32Array([
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
]), Xe = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ze = new Uint32Array(64);
let $0 = class extends Mc {
  constructor() {
    super(64, 32, 8, !1), this.A = Xe[0] | 0, this.B = Xe[1] | 0, this.C = Xe[2] | 0, this.D = Xe[3] | 0, this.E = Xe[4] | 0, this.F = Xe[5] | 0, this.G = Xe[6] | 0, this.H = Xe[7] | 0;
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
      Ze[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = Ze[u - 15], h = Ze[u - 2], b = ge(p, 7) ^ ge(p, 18) ^ p >>> 3, x = ge(h, 17) ^ ge(h, 19) ^ h >>> 10;
      Ze[u] = x + Ze[u - 7] + b + Ze[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = ge(a, 6) ^ ge(a, 11) ^ ge(a, 25), h = f + p + t2(a, c, l) + n2[u] + Ze[u] | 0, x = (ge(r, 2) ^ ge(r, 13) ^ ge(r, 22)) + e2(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Ze.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, r2 = class extends $0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const I0 = ir(() => new $0());
ir(() => new r2());
var or = {}, Hc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Hs;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], l = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (l < 4) {
        const b = n.indexOf(o[h]) >> l;
        let x = 0;
        h !== 0 && (x = n.indexOf(o[h - 1]));
        const g = 1 + l, I = x % (1 << g) << 5 - g, L = t.c32[b + I];
        l = g, c.unshift(L);
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
    const c = o.match(`^${t.c32[0]}*`), l = c ? c[0].length : 0;
    let f = [], u = 0, p = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      p === 4 && (f.unshift(n[u]), p = 0, u = 0);
      const I = (t.c32.indexOf(o[x]) << p) + u, L = n[I % 16];
      if (p += 1, u = I >> 4, u > 1 << p)
        throw new Error("Panic error in decoding.");
      f.unshift(L);
    }
    f.unshift(n[u]), f.length % 2 === 1 && f.unshift("0");
    let h = 0;
    for (let x = 0; x < f.length && f[x] === "0"; x++)
      h++;
    f = f.slice(h - h % 2);
    let b = f.join("");
    for (let x = 0; x < l; x++)
      b = `00${b}`;
    if (a) {
      const x = a * 2 - b.length;
      for (let g = 0; g < x; g += 2)
        b = `00${b}`;
    }
    return b;
  }
  t.c32decode = i;
})(Hc);
var Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.c32checkDecode = Gn.c32checkEncode = void 0;
const Nl = so, Pl = Hs, as = Hc;
function v0(t) {
  const e = (0, Nl.sha256)((0, Nl.sha256)((0, Pl.hexToBytes)(t)));
  return (0, Pl.bytesToHex)(e.slice(0, 4));
}
function s2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = v0(`${n}${e}`), s = (0, as.c32encode)(`${e}${r}`);
  return `${as.c32[t]}${s}`;
}
Gn.c32checkEncode = s2;
function i2(t) {
  t = (0, as.c32normalize)(t);
  const e = (0, as.c32decode)(t.slice(1)), n = t[0], r = as.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), v0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Gn.c32checkDecode = i2;
var L0 = {}, Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.decode = Nr.encode = void 0;
const _i = so, kl = Hs, B0 = kh, C0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function o2(t, e = "00") {
  const n = typeof t == "string" ? (0, kl.hexToBytes)(t) : t, r = typeof e == "string" ? (0, kl.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, _i.sha256)((0, _i.sha256)(new Uint8Array([...r, ...n])));
  return B0(C0).encode([...r, ...n, ...s.slice(0, 4)]);
}
Nr.encode = o2;
function a2(t) {
  const e = B0(C0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, _i.sha256)((0, _i.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Nr.decode = a2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Gn, n = Nr, r = Hs;
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
    const p = n.decode(f), h = (0, r.bytesToHex)(p.data), b = parseInt((0, r.bytesToHex)(p.prefix), 16);
    let x;
    return u < 0 ? (x = b, s[b] !== void 0 && (x = s[b])) : x = u, o(x, h);
  }
  t.b58ToC32 = c;
  function l(f, u = -1) {
    const p = a(f), h = p[0], b = p[1];
    let x;
    u < 0 ? (x = h, i[h] !== void 0 && (x = i[h])) : x = u;
    let g = x.toString(16);
    return g.length === 1 && (g = `0${g}`), n.encode(b, g);
  }
  t.c32ToB58 = l;
})(L0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Hc;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Gn;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = L0;
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
})(or);
function c2(t, e) {
  switch (e = x0(e ?? w0), t) {
    case Ne.P2PKH:
      switch (e.transactionVersion) {
        case Pe.Mainnet:
          return Se.MainnetSingleSig;
        case Pe.Testnet:
          return Se.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Ne.P2SH:
    case Ne.P2SHNonSequential:
    case Ne.P2WPKH:
    case Ne.P2WSH:
    case Ne.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Pe.Mainnet:
          return Se.MainnetMultiSig;
        case Pe.Testnet:
          return Se.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const u2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), M0 = Uint8Array.from({ length: 16 }, (t, e) => e), l2 = M0.map((t) => (9 * t + 5) % 16);
let Uc = [M0], _c = [l2];
for (let t = 0; t < 4; t++)
  for (let e of [Uc, _c])
    e.push(e[t].map((n) => u2[n]));
const H0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), f2 = Uc.map((t, e) => t.map((n) => H0[e][n])), h2 = _c.map((t, e) => t.map((n) => H0[e][n])), d2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), p2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zs = (t, e) => t << e | t >>> 32 - e;
function Dl(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qs = new Uint32Array(16);
let g2 = class extends Mc {
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
      Qs[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, x = d2[h], g = p2[h], I = Uc[h], L = _c[h], y = f2[h], A = h2[h];
      for (let m = 0; m < 16; m++) {
        const B = Zs(r + Dl(h, i, a, l) + Qs[I[m]] + x, y[m]) + u | 0;
        r = u, u = l, l = Zs(a, 10) | 0, a = i, i = B;
      }
      for (let m = 0; m < 16; m++) {
        const B = Zs(s + Dl(b, o, c, f) + Qs[L[m]] + g, A[m]) + p | 0;
        s = p, p = f, f = Zs(c, 10) | 0, c = o, o = B;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Qs.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const y2 = ir(() => new g2()), Js = BigInt(2 ** 32 - 1), ma = BigInt(32);
function U0(t, e = !1) {
  return e ? { h: Number(t & Js), l: Number(t >> ma & Js) } : { h: Number(t >> ma & Js) | 0, l: Number(t & Js) | 0 };
}
function b2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = U0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const w2 = (t, e) => BigInt(t >>> 0) << ma | BigInt(e >>> 0), x2 = (t, e, n) => t >>> n, m2 = (t, e, n) => t << 32 - n | e >>> n, S2 = (t, e, n) => t >>> n | e << 32 - n, E2 = (t, e, n) => t << 32 - n | e >>> n, A2 = (t, e, n) => t << 64 - n | e >>> n - 32, $2 = (t, e, n) => t >>> n - 32 | e << 64 - n, I2 = (t, e) => e, v2 = (t, e) => t, L2 = (t, e, n) => t << n | e >>> 32 - n, B2 = (t, e, n) => e << n | t >>> 32 - n, C2 = (t, e, n) => e << n - 32 | t >>> 64 - n, M2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function H2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const U2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, T2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), N2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, P2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), k2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, W = {
  fromBig: U0,
  split: b2,
  toBig: w2,
  shrSH: x2,
  shrSL: m2,
  rotrSH: S2,
  rotrSL: E2,
  rotrBH: A2,
  rotrBL: $2,
  rotr32H: I2,
  rotr32L: v2,
  rotlSH: L2,
  rotlSL: B2,
  rotlBH: C2,
  rotlBL: M2,
  add: H2,
  add3L: U2,
  add3H: _2,
  add4L: T2,
  add4H: N2,
  add5H: k2,
  add5L: P2
}, [D2, O2] = W.split([
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
].map((t) => BigInt(t))), Qe = new Uint32Array(80), Je = new Uint32Array(80);
let ao = class extends Mc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: b, Hh: x, Hl: g } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, b, x, g];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, b, x, g) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = x | 0, this.Hl = g | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Qe[y] = e.getUint32(n), Je[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const A = Qe[y - 15] | 0, m = Je[y - 15] | 0, B = W.rotrSH(A, m, 1) ^ W.rotrSH(A, m, 8) ^ W.shrSH(A, m, 7), D = W.rotrSL(A, m, 1) ^ W.rotrSL(A, m, 8) ^ W.shrSL(A, m, 7), _ = Qe[y - 2] | 0, k = Je[y - 2] | 0, w = W.rotrSH(_, k, 19) ^ W.rotrBH(_, k, 61) ^ W.shrSH(_, k, 6), $ = W.rotrSL(_, k, 19) ^ W.rotrBL(_, k, 61) ^ W.shrSL(_, k, 6), T = W.add4L(D, $, Je[y - 7], Je[y - 16]), j = W.add4H(T, B, w, Qe[y - 7], Qe[y - 16]);
      Qe[y] = j | 0, Je[y] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: b, Gh: x, Gl: g, Hh: I, Hl: L } = this;
    for (let y = 0; y < 80; y++) {
      const A = W.rotrSH(u, p, 14) ^ W.rotrSH(u, p, 18) ^ W.rotrBH(u, p, 41), m = W.rotrSL(u, p, 14) ^ W.rotrSL(u, p, 18) ^ W.rotrBL(u, p, 41), B = u & h ^ ~u & x, D = p & b ^ ~p & g, _ = W.add5L(L, m, D, O2[y], Je[y]), k = W.add5H(_, I, A, B, D2[y], Qe[y]), w = _ | 0, $ = W.rotrSH(r, s, 28) ^ W.rotrBH(r, s, 34) ^ W.rotrBH(r, s, 39), T = W.rotrSL(r, s, 28) ^ W.rotrBL(r, s, 34) ^ W.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      I = x | 0, L = g | 0, x = h | 0, g = b | 0, h = u | 0, b = p | 0, { h: u, l: p } = W.add(l | 0, f | 0, k | 0, w | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const M = W.add3L(w, T, G);
      r = W.add3H(M, k, $, j), s = M | 0;
    }
    ({ h: r, l: s } = W.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = W.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = W.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = W.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = W.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: b } = W.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: x, l: g } = W.add(this.Gh | 0, this.Gl | 0, x | 0, g | 0), { h: I, l: L } = W.add(this.Hh | 0, this.Hl | 0, I | 0, L | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, b, x, g, I, L);
  }
  roundClean() {
    Qe.fill(0), Je.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, j2 = class extends ao {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, F2 = class extends ao {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, z2 = class extends ao {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ir(() => new ao());
ir(() => new j2());
ir(() => new F2());
ir(() => new z2());
var Ti = { exports: {} };
Ti.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", l = "[object Error]", f = "[object Function]", u = "[object GeneratorFunction]", p = "[object Map]", h = "[object Number]", b = "[object Object]", x = "[object Promise]", g = "[object RegExp]", I = "[object Set]", L = "[object String]", y = "[object Symbol]", A = "[object WeakMap]", m = "[object ArrayBuffer]", B = "[object DataView]", D = "[object Float32Array]", _ = "[object Float64Array]", k = "[object Int8Array]", w = "[object Int16Array]", $ = "[object Int32Array]", T = "[object Uint8Array]", j = "[object Uint8ClampedArray]", G = "[object Uint16Array]", M = "[object Uint32Array]", pt = /[\\^$.*+?()[\]{}|]/g, Kt = /\w*$/, Fe = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, C = {};
  C[i] = C[o] = C[m] = C[B] = C[a] = C[c] = C[D] = C[_] = C[k] = C[w] = C[$] = C[p] = C[h] = C[b] = C[g] = C[I] = C[L] = C[y] = C[T] = C[j] = C[G] = C[M] = !0, C[l] = C[f] = C[A] = !1;
  var ot = typeof Dt == "object" && Dt && Dt.Object === Object && Dt, ct = typeof self == "object" && self && self.Object === Object && self, ut = ot || ct || Function("return this")(), Lt = e && !e.nodeType && e, U = Lt && !0 && t && !t.nodeType && t, R = U && U.exports === Lt;
  function et(d, E) {
    return d.set(E[0], E[1]), d;
  }
  function F(d, E) {
    return d.add(E), d;
  }
  function mt(d, E) {
    for (var v = -1, O = d ? d.length : 0; ++v < O && E(d[v], v, d) !== !1; )
      ;
    return d;
  }
  function Bt(d, E) {
    for (var v = -1, O = E.length, Mt = d.length; ++v < O; )
      d[Mt + v] = E[v];
    return d;
  }
  function Vt(d, E, v, O) {
    for (var Mt = -1, jt = d ? d.length : 0; ++Mt < jt; )
      v = E(v, d[Mt], Mt, d);
    return v;
  }
  function fr(d, E) {
    for (var v = -1, O = Array(d); ++v < d; )
      O[v] = E(v);
    return O;
  }
  function hr(d, E) {
    return d == null ? void 0 : d[E];
  }
  function $u(d) {
    var E = !1;
    if (d != null && typeof d.toString != "function")
      try {
        E = !!(d + "");
      } catch {
      }
    return E;
  }
  function Iu(d) {
    var E = -1, v = Array(d.size);
    return d.forEach(function(O, Mt) {
      v[++E] = [Mt, O];
    }), v;
  }
  function $o(d, E) {
    return function(v) {
      return d(E(v));
    };
  }
  function vu(d) {
    var E = -1, v = Array(d.size);
    return d.forEach(function(O) {
      v[++E] = O;
    }), v;
  }
  var Hp = Array.prototype, Up = Function.prototype, Ns = Object.prototype, Io = ut["__core-js_shared__"], Lu = function() {
    var d = /[^.]+$/.exec(Io && Io.keys && Io.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Bu = Up.toString, ze = Ns.hasOwnProperty, Ps = Ns.toString, _p = RegExp(
    "^" + Bu.call(ze).replace(pt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Cu = R ? ut.Buffer : void 0, Mu = ut.Symbol, Hu = ut.Uint8Array, Tp = $o(Object.getPrototypeOf, Object), Np = Object.create, Pp = Ns.propertyIsEnumerable, kp = Hp.splice, Uu = Object.getOwnPropertySymbols, Dp = Cu ? Cu.isBuffer : void 0, Op = $o(Object.keys, Object), vo = gr(ut, "DataView"), Zr = gr(ut, "Map"), Lo = gr(ut, "Promise"), Bo = gr(ut, "Set"), Co = gr(ut, "WeakMap"), Qr = gr(Object, "create"), jp = Ln(vo), Fp = Ln(Zr), zp = Ln(Lo), Rp = Ln(Bo), Gp = Ln(Co), _u = Mu ? Mu.prototype : void 0, Tu = _u ? _u.valueOf : void 0;
  function In(d) {
    var E = -1, v = d ? d.length : 0;
    for (this.clear(); ++E < v; ) {
      var O = d[E];
      this.set(O[0], O[1]);
    }
  }
  function Kp() {
    this.__data__ = Qr ? Qr(null) : {};
  }
  function Vp(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function qp(d) {
    var E = this.__data__;
    if (Qr) {
      var v = E[d];
      return v === r ? void 0 : v;
    }
    return ze.call(E, d) ? E[d] : void 0;
  }
  function Wp(d) {
    var E = this.__data__;
    return Qr ? E[d] !== void 0 : ze.call(E, d);
  }
  function Yp(d, E) {
    var v = this.__data__;
    return v[d] = Qr && E === void 0 ? r : E, this;
  }
  In.prototype.clear = Kp, In.prototype.delete = Vp, In.prototype.get = qp, In.prototype.has = Wp, In.prototype.set = Yp;
  function Ce(d) {
    var E = -1, v = d ? d.length : 0;
    for (this.clear(); ++E < v; ) {
      var O = d[E];
      this.set(O[0], O[1]);
    }
  }
  function Xp() {
    this.__data__ = [];
  }
  function Zp(d) {
    var E = this.__data__, v = ks(E, d);
    if (v < 0)
      return !1;
    var O = E.length - 1;
    return v == O ? E.pop() : kp.call(E, v, 1), !0;
  }
  function Qp(d) {
    var E = this.__data__, v = ks(E, d);
    return v < 0 ? void 0 : E[v][1];
  }
  function Jp(d) {
    return ks(this.__data__, d) > -1;
  }
  function tg(d, E) {
    var v = this.__data__, O = ks(v, d);
    return O < 0 ? v.push([d, E]) : v[O][1] = E, this;
  }
  Ce.prototype.clear = Xp, Ce.prototype.delete = Zp, Ce.prototype.get = Qp, Ce.prototype.has = Jp, Ce.prototype.set = tg;
  function dr(d) {
    var E = -1, v = d ? d.length : 0;
    for (this.clear(); ++E < v; ) {
      var O = d[E];
      this.set(O[0], O[1]);
    }
  }
  function eg() {
    this.__data__ = {
      hash: new In(),
      map: new (Zr || Ce)(),
      string: new In()
    };
  }
  function ng(d) {
    return Ds(this, d).delete(d);
  }
  function rg(d) {
    return Ds(this, d).get(d);
  }
  function sg(d) {
    return Ds(this, d).has(d);
  }
  function ig(d, E) {
    return Ds(this, d).set(d, E), this;
  }
  dr.prototype.clear = eg, dr.prototype.delete = ng, dr.prototype.get = rg, dr.prototype.has = sg, dr.prototype.set = ig;
  function pr(d) {
    this.__data__ = new Ce(d);
  }
  function og() {
    this.__data__ = new Ce();
  }
  function ag(d) {
    return this.__data__.delete(d);
  }
  function cg(d) {
    return this.__data__.get(d);
  }
  function ug(d) {
    return this.__data__.has(d);
  }
  function lg(d, E) {
    var v = this.__data__;
    if (v instanceof Ce) {
      var O = v.__data__;
      if (!Zr || O.length < n - 1)
        return O.push([d, E]), this;
      v = this.__data__ = new dr(O);
    }
    return v.set(d, E), this;
  }
  pr.prototype.clear = og, pr.prototype.delete = ag, pr.prototype.get = cg, pr.prototype.has = ug, pr.prototype.set = lg;
  function fg(d, E) {
    var v = Uo(d) || Ng(d) ? fr(d.length, String) : [], O = v.length, Mt = !!O;
    for (var jt in d)
      ze.call(d, jt) && !(Mt && (jt == "length" || Hg(jt, O))) && v.push(jt);
    return v;
  }
  function Nu(d, E, v) {
    var O = d[E];
    (!(ze.call(d, E) && Ou(O, v)) || v === void 0 && !(E in d)) && (d[E] = v);
  }
  function ks(d, E) {
    for (var v = d.length; v--; )
      if (Ou(d[v][0], E))
        return v;
    return -1;
  }
  function hg(d, E) {
    return d && Pu(E, _o(E), d);
  }
  function Mo(d, E, v, O, Mt, jt, Me) {
    var Ft;
    if (O && (Ft = jt ? O(d, Mt, jt, Me) : O(d)), Ft !== void 0)
      return Ft;
    if (!Os(d))
      return d;
    var zu = Uo(d);
    if (zu) {
      if (Ft = Bg(d), !E)
        return Ig(d, Ft);
    } else {
      var yr = vn(d), Ru = yr == f || yr == u;
      if (kg(d))
        return wg(d, E);
      if (yr == b || yr == i || Ru && !jt) {
        if ($u(d))
          return jt ? d : {};
        if (Ft = Cg(Ru ? {} : d), !E)
          return vg(d, hg(Ft, d));
      } else {
        if (!C[yr])
          return jt ? d : {};
        Ft = Mg(d, yr, Mo, E);
      }
    }
    Me || (Me = new pr());
    var Gu = Me.get(d);
    if (Gu)
      return Gu;
    if (Me.set(d, Ft), !zu)
      var Ku = v ? Lg(d) : _o(d);
    return mt(Ku || d, function(To, js) {
      Ku && (js = To, To = d[js]), Nu(Ft, js, Mo(To, E, v, O, js, d, Me));
    }), Ft;
  }
  function dg(d) {
    return Os(d) ? Np(d) : {};
  }
  function pg(d, E, v) {
    var O = E(d);
    return Uo(d) ? O : Bt(O, v(d));
  }
  function gg(d) {
    return Ps.call(d);
  }
  function yg(d) {
    if (!Os(d) || _g(d))
      return !1;
    var E = Fu(d) || $u(d) ? _p : Fe;
    return E.test(Ln(d));
  }
  function bg(d) {
    if (!Du(d))
      return Op(d);
    var E = [];
    for (var v in Object(d))
      ze.call(d, v) && v != "constructor" && E.push(v);
    return E;
  }
  function wg(d, E) {
    if (E)
      return d.slice();
    var v = new d.constructor(d.length);
    return d.copy(v), v;
  }
  function Ho(d) {
    var E = new d.constructor(d.byteLength);
    return new Hu(E).set(new Hu(d)), E;
  }
  function xg(d, E) {
    var v = E ? Ho(d.buffer) : d.buffer;
    return new d.constructor(v, d.byteOffset, d.byteLength);
  }
  function mg(d, E, v) {
    var O = E ? v(Iu(d), !0) : Iu(d);
    return Vt(O, et, new d.constructor());
  }
  function Sg(d) {
    var E = new d.constructor(d.source, Kt.exec(d));
    return E.lastIndex = d.lastIndex, E;
  }
  function Eg(d, E, v) {
    var O = E ? v(vu(d), !0) : vu(d);
    return Vt(O, F, new d.constructor());
  }
  function Ag(d) {
    return Tu ? Object(Tu.call(d)) : {};
  }
  function $g(d, E) {
    var v = E ? Ho(d.buffer) : d.buffer;
    return new d.constructor(v, d.byteOffset, d.length);
  }
  function Ig(d, E) {
    var v = -1, O = d.length;
    for (E || (E = Array(O)); ++v < O; )
      E[v] = d[v];
    return E;
  }
  function Pu(d, E, v, O) {
    v || (v = {});
    for (var Mt = -1, jt = E.length; ++Mt < jt; ) {
      var Me = E[Mt], Ft = void 0;
      Nu(v, Me, Ft === void 0 ? d[Me] : Ft);
    }
    return v;
  }
  function vg(d, E) {
    return Pu(d, ku(d), E);
  }
  function Lg(d) {
    return pg(d, _o, ku);
  }
  function Ds(d, E) {
    var v = d.__data__;
    return Ug(E) ? v[typeof E == "string" ? "string" : "hash"] : v.map;
  }
  function gr(d, E) {
    var v = hr(d, E);
    return yg(v) ? v : void 0;
  }
  var ku = Uu ? $o(Uu, Object) : jg, vn = gg;
  (vo && vn(new vo(new ArrayBuffer(1))) != B || Zr && vn(new Zr()) != p || Lo && vn(Lo.resolve()) != x || Bo && vn(new Bo()) != I || Co && vn(new Co()) != A) && (vn = function(d) {
    var E = Ps.call(d), v = E == b ? d.constructor : void 0, O = v ? Ln(v) : void 0;
    if (O)
      switch (O) {
        case jp:
          return B;
        case Fp:
          return p;
        case zp:
          return x;
        case Rp:
          return I;
        case Gp:
          return A;
      }
    return E;
  });
  function Bg(d) {
    var E = d.length, v = d.constructor(E);
    return E && typeof d[0] == "string" && ze.call(d, "index") && (v.index = d.index, v.input = d.input), v;
  }
  function Cg(d) {
    return typeof d.constructor == "function" && !Du(d) ? dg(Tp(d)) : {};
  }
  function Mg(d, E, v, O) {
    var Mt = d.constructor;
    switch (E) {
      case m:
        return Ho(d);
      case a:
      case c:
        return new Mt(+d);
      case B:
        return xg(d, O);
      case D:
      case _:
      case k:
      case w:
      case $:
      case T:
      case j:
      case G:
      case M:
        return $g(d, O);
      case p:
        return mg(d, O, v);
      case h:
      case L:
        return new Mt(d);
      case g:
        return Sg(d);
      case I:
        return Eg(d, O, v);
      case y:
        return Ag(d);
    }
  }
  function Hg(d, E) {
    return E = E ?? s, !!E && (typeof d == "number" || S.test(d)) && d > -1 && d % 1 == 0 && d < E;
  }
  function Ug(d) {
    var E = typeof d;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? d !== "__proto__" : d === null;
  }
  function _g(d) {
    return !!Lu && Lu in d;
  }
  function Du(d) {
    var E = d && d.constructor, v = typeof E == "function" && E.prototype || Ns;
    return d === v;
  }
  function Ln(d) {
    if (d != null) {
      try {
        return Bu.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function Tg(d) {
    return Mo(d, !0, !0);
  }
  function Ou(d, E) {
    return d === E || d !== d && E !== E;
  }
  function Ng(d) {
    return Pg(d) && ze.call(d, "callee") && (!Pp.call(d, "callee") || Ps.call(d) == i);
  }
  var Uo = Array.isArray;
  function ju(d) {
    return d != null && Dg(d.length) && !Fu(d);
  }
  function Pg(d) {
    return Og(d) && ju(d);
  }
  var kg = Dp || Fg;
  function Fu(d) {
    var E = Os(d) ? Ps.call(d) : "";
    return E == f || E == u;
  }
  function Dg(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function Os(d) {
    var E = typeof d;
    return !!d && (E == "object" || E == "function");
  }
  function Og(d) {
    return !!d && typeof d == "object";
  }
  function _o(d) {
    return ju(d) ? fg(d) : bg(d);
  }
  function jg() {
    return [];
  }
  function Fg() {
    return !1;
  }
  t.exports = Tg;
})(Ti, Ti.exports);
var R2 = Ti.exports;
const _0 = /* @__PURE__ */ oh(R2);
var Sa;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Sa || (Sa = {}));
function G2(t, e) {
  return { type: Sa.Address, version: t, hash160: e };
}
function K2(t) {
  return or.c32address(t.version, t.hash160);
}
const V2 = (t) => y2(I0(t)), q2 = (t) => K(V2(t));
At.hmacSha256Sync = (t, ...e) => {
  const n = A0.create(I0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function W2(t, e = "mainnet") {
  e = x0(e), t = typeof t == "string" ? st(t) : t;
  const n = c2(Ne.P2PKH, e), r = G2(n, q2(t));
  return K2(r);
}
function Y2(t, e) {
  const n = Ut.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = W2(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Ut.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function X2(t, e = null) {
  let n;
  e ? n = Y2(t, e) : n = Ut.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Ol = "_blockstackDidCheckEchoReply", Z2 = "echoReply", Q2 = "authContinuation";
function J2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function tx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Ol];
  if (typeof e == "boolean")
    return e;
  const n = J2(t.location.search), r = n[Z2];
  if (r) {
    t[Ol] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Q2];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Ea {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new yh();
    else
      throw new b1("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new ml(e.sessionOptions) : this.store = new ml() : e ? this.store = new xl(e.sessionOptions) : this.store = new xl();
  }
  makeAuthRequestToken(e, n, r, s, i, o = x1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ca("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Ow(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Dw();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = dc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (tx())
        return mr.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      mr.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = z1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Fs("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Ut.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Gw(e))
      throw new Fs("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Po(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await bl(s, i.private_key);
          } catch {
            if (mr.warn("Failed decryption of appPrivateKey, will try to use as given"), !At.isValidPrivateKey(i.private_key))
              throw new Fs("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await bl(s, c);
          } catch {
            mr.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Fs("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let l = H1, f;
    Po(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (l = i.hubUrl), Po(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const u = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: y0(i.iss),
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
        u.profile = Object.assign({}, p1);
      else {
        const b = await h.text(), x = JSON.parse(b);
        u.profile = X2(x[0].token);
      }
    } else
      u.profile = i.profile;
    return r.userData = u, this.store.setSessionData(r), u;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new ca("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Hb(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Ub(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Ea.prototype.makeAuthRequest = Ea.prototype.makeAuthRequestToken;
const ex = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], nx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = ex(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!co(r.id));
  return e.concat(n);
}, co = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), T0 = "STX_PROVIDER", Kn = () => typeof window > "u" ? null : window.localStorage.getItem(T0), rx = (t) => {
  typeof window < "u" && window.localStorage.setItem(T0, t);
}, sx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ix(t, e) {
  const n = {};
  return Object.assign(n, sx, e), await fetch(t, n);
}
function ox(t) {
  let e = ix, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ax(...t) {
  const { fetchLib: e, middlewares: n } = ox(t);
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
var Pr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Pr || (Pr = {}));
var Vn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vn || (Vn = {}));
var jl;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(jl || (jl = {}));
const cx = "https://api.mainnet.hiro.so", ux = "https://api.testnet.hiro.so", lx = "http://localhost:3999", fx = ["mainnet", "testnet", "devnet", "mocknet"];
class qn {
  constructor(e) {
    this.version = Vn.Mainnet, this.chainId = Pr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Vn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ax();
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
qn.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Aa();
    case "testnet":
      return new $a();
    case "devnet":
      return new hx();
    case "mocknet":
      return new N0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${fx.join(", ")}`);
  }
};
qn.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : qn.fromName(t);
class Aa extends qn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Vn.Mainnet, this.chainId = Pr.Mainnet;
  }
}
class $a extends qn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ux,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Vn.Testnet, this.chainId = Pr.Testnet;
  }
}
class N0 extends qn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Vn.Testnet, this.chainId = Pr.Testnet;
  }
}
const hx = N0;
var Wn;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Wn || (Wn = {}));
var Ni;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ni || (Ni = {}));
Wn.Mainnet;
var Yn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Yn || (Yn = {}));
var Xn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Xn || (Xn = {}));
Yn.Mainnet;
const dx = {
  chainId: Wn.Mainnet,
  transactionVersion: Yn.Mainnet,
  peerNetworkId: Ni.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Xn.MainnetSingleSig,
    multiSig: Xn.MainnetMultiSig
  },
  client: { baseUrl: dh }
}, Ia = {
  chainId: Wn.Testnet,
  transactionVersion: Yn.Testnet,
  peerNetworkId: Ni.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Xn.TestnetSingleSig,
    multiSig: Xn.TestnetMultiSig
  },
  client: { baseUrl: ph }
}, wi = {
  ...Ia,
  addressVersion: { ...Ia.addressVersion },
  magicBytes: "id",
  client: { baseUrl: gh }
}, px = {
  ...wi,
  addressVersion: { ...wi.addressVersion },
  client: { ...wi.client }
};
function gx(t) {
  switch (t) {
    case "mainnet":
      return dx;
    case "testnet":
      return Ia;
    case "devnet":
      return wi;
    case "mocknet":
      return px;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function yx(t) {
  return typeof t == "string" ? gx(t) : t;
}
function bx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Fl = /* @__PURE__ */ new Map();
function P0(t, e) {
  const n = Fl.get(t);
  if (n !== void 0)
    return n(e);
  const r = bx(t);
  return Fl.set(t, r), P0(t, e);
}
let dt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? st(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return D1(this.readBytes(4), 0);
  }
  readUInt8() {
    return P1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return T1(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = K(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = K(n);
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
    if (P0(e, r))
      return r;
    throw n(r);
  }
};
const wx = 128, xx = 128, k0 = 16, Pn = 32, va = 80, uo = 65, mx = 32, Sx = 64, Pi = 34, Ex = 1 + 16 * 1024 * 1024, Ax = 165, $x = 16, Ix = 16, vx = 20, Lx = Ix + 2 + vx, Bx = Lx + 4, Cx = Ex + (Ax + $x * Bx);
var at;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(at || (at = {}));
var La;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(La || (La = {}));
var Wt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Wt || (Wt = {}));
const Ro = ["onChainOnly", "offChainOnly", "any"];
Ro[0] + "", Wt.OnChainOnly, Ro[1] + "", Wt.OffChainOnly, Ro[2] + "", Wt.Any, Wt.OnChainOnly + "", Wt.OnChainOnly, Wt.OffChainOnly + "", Wt.OffChainOnly, Wt.Any + "", Wt.Any;
var ki;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ki || (ki = {}));
var gt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(gt || (gt = {}));
var St;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(St || (St = {}));
var ft;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ft || (ft = {}));
var wt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(wt || (wt = {}));
var cs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(cs || (cs = {}));
var Ba;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ba || (Ba = {}));
var Ca;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ca || (Ca = {}));
var kt;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(kt || (kt = {}));
var zl;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(zl || (zl = {}));
var Ma;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ma || (Ma = {}));
var ce;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ce || (ce = {}));
var Rl;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Rl || (Rl = {}));
let lo = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Sr = class extends lo {
  constructor(e) {
    super(e);
  }
}, Nt = class extends lo {
  constructor(e) {
    super(e);
  }
}, Di = class extends lo {
  constructor(e) {
    super(e);
  }
}, Un = class extends lo {
  constructor(e) {
    super(e);
  }
};
function Ha(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Mx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function D0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Hx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ha(t.outputLen), Ha(t.blockLen);
}
function Ux(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _x(t, e) {
  D0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const _n = {
  number: Ha,
  bool: Mx,
  bytes: D0,
  hash: Hx,
  exists: Ux,
  output: _x
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Go = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ye = (t, e) => t << 32 - e | t >>> e, Tx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Tx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Nx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Tc(t) {
  if (typeof t == "string" && (t = Nx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let O0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ar(t) {
  const e = (r) => t().update(Tc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let j0 = class extends O0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, _n.hash(e);
    const r = Tc(n);
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
    return _n.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    _n.exists(this), _n.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const F0 = (t, e, n) => new j0(t, e).update(n).digest();
F0.create = (t, e) => new j0(t, e);
function Px(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Nc = class extends O0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Go(this.buffer);
  }
  update(e) {
    _n.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Tc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Go(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    _n.exists(this), _n.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Px(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Go(e), c = this.outputLen;
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
const kx = (t, e, n) => t & e ^ ~t & n, Dx = (t, e, n) => t & e ^ t & n ^ e & n, Ox = new Uint32Array([
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
]), tn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), en = new Uint32Array(64);
let z0 = class extends Nc {
  constructor() {
    super(64, 32, 8, !1), this.A = tn[0] | 0, this.B = tn[1] | 0, this.C = tn[2] | 0, this.D = tn[3] | 0, this.E = tn[4] | 0, this.F = tn[5] | 0, this.G = tn[6] | 0, this.H = tn[7] | 0;
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
      en[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = en[u - 15], h = en[u - 2], b = ye(p, 7) ^ ye(p, 18) ^ p >>> 3, x = ye(h, 17) ^ ye(h, 19) ^ h >>> 10;
      en[u] = x + en[u - 7] + b + en[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = ye(a, 6) ^ ye(a, 11) ^ ye(a, 25), h = f + p + kx(a, c, l) + Ox[u] + en[u] | 0, x = (ye(r, 2) ^ ye(r, 13) ^ ye(r, 22)) + Dx(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    en.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, jx = class extends z0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Pc = ar(() => new z0());
ar(() => new jx());
const Fx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), R0 = Uint8Array.from({ length: 16 }, (t, e) => e), zx = R0.map((t) => (9 * t + 5) % 16);
let kc = [R0], Dc = [zx];
for (let t = 0; t < 4; t++)
  for (let e of [kc, Dc])
    e.push(e[t].map((n) => Fx[n]));
const G0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Rx = kc.map((t, e) => t.map((n) => G0[e][n])), Gx = Dc.map((t, e) => t.map((n) => G0[e][n])), Kx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Vx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ti = (t, e) => t << e | t >>> 32 - e;
function Gl(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ei = new Uint32Array(16);
let qx = class extends Nc {
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
      ei[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, x = Kx[h], g = Vx[h], I = kc[h], L = Dc[h], y = Rx[h], A = Gx[h];
      for (let m = 0; m < 16; m++) {
        const B = ti(r + Gl(h, i, a, l) + ei[I[m]] + x, y[m]) + u | 0;
        r = u, u = l, l = ti(a, 10) | 0, a = i, i = B;
      }
      for (let m = 0; m < 16; m++) {
        const B = ti(s + Gl(b, o, c, f) + ei[L[m]] + g, A[m]) + p | 0;
        s = p, p = f, f = ti(c, 10) | 0, c = o, o = B;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ei.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Wx = ar(() => new qx()), ni = BigInt(2 ** 32 - 1), Ua = BigInt(32);
function K0(t, e = !1) {
  return e ? { h: Number(t & ni), l: Number(t >> Ua & ni) } : { h: Number(t >> Ua & ni) | 0, l: Number(t & ni) | 0 };
}
function Yx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = K0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Xx = (t, e) => BigInt(t >>> 0) << Ua | BigInt(e >>> 0), Zx = (t, e, n) => t >>> n, Qx = (t, e, n) => t << 32 - n | e >>> n, Jx = (t, e, n) => t >>> n | e << 32 - n, tm = (t, e, n) => t << 32 - n | e >>> n, em = (t, e, n) => t << 64 - n | e >>> n - 32, nm = (t, e, n) => t >>> n - 32 | e << 64 - n, rm = (t, e) => e, sm = (t, e) => t, im = (t, e, n) => t << n | e >>> 32 - n, om = (t, e, n) => e << n | t >>> 32 - n, am = (t, e, n) => e << n - 32 | t >>> 64 - n, cm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function um(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const lm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), fm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, hm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), dm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, pm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), gm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Y = {
  fromBig: K0,
  split: Yx,
  toBig: Xx,
  shrSH: Zx,
  shrSL: Qx,
  rotrSH: Jx,
  rotrSL: tm,
  rotrBH: em,
  rotrBL: nm,
  rotr32H: rm,
  rotr32L: sm,
  rotlSH: im,
  rotlSL: om,
  rotlBH: am,
  rotlBL: cm,
  add: um,
  add3L: lm,
  add3H: fm,
  add4L: hm,
  add4H: dm,
  add5H: gm,
  add5L: pm
}, [ym, bm] = Y.split([
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
].map((t) => BigInt(t))), nn = new Uint32Array(80), rn = new Uint32Array(80);
let fo = class extends Nc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: b, Hh: x, Hl: g } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, b, x, g];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, b, x, g) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = x | 0, this.Hl = g | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      nn[y] = e.getUint32(n), rn[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const A = nn[y - 15] | 0, m = rn[y - 15] | 0, B = Y.rotrSH(A, m, 1) ^ Y.rotrSH(A, m, 8) ^ Y.shrSH(A, m, 7), D = Y.rotrSL(A, m, 1) ^ Y.rotrSL(A, m, 8) ^ Y.shrSL(A, m, 7), _ = nn[y - 2] | 0, k = rn[y - 2] | 0, w = Y.rotrSH(_, k, 19) ^ Y.rotrBH(_, k, 61) ^ Y.shrSH(_, k, 6), $ = Y.rotrSL(_, k, 19) ^ Y.rotrBL(_, k, 61) ^ Y.shrSL(_, k, 6), T = Y.add4L(D, $, rn[y - 7], rn[y - 16]), j = Y.add4H(T, B, w, nn[y - 7], nn[y - 16]);
      nn[y] = j | 0, rn[y] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: b, Gh: x, Gl: g, Hh: I, Hl: L } = this;
    for (let y = 0; y < 80; y++) {
      const A = Y.rotrSH(u, p, 14) ^ Y.rotrSH(u, p, 18) ^ Y.rotrBH(u, p, 41), m = Y.rotrSL(u, p, 14) ^ Y.rotrSL(u, p, 18) ^ Y.rotrBL(u, p, 41), B = u & h ^ ~u & x, D = p & b ^ ~p & g, _ = Y.add5L(L, m, D, bm[y], rn[y]), k = Y.add5H(_, I, A, B, ym[y], nn[y]), w = _ | 0, $ = Y.rotrSH(r, s, 28) ^ Y.rotrBH(r, s, 34) ^ Y.rotrBH(r, s, 39), T = Y.rotrSL(r, s, 28) ^ Y.rotrBL(r, s, 34) ^ Y.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      I = x | 0, L = g | 0, x = h | 0, g = b | 0, h = u | 0, b = p | 0, { h: u, l: p } = Y.add(l | 0, f | 0, k | 0, w | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const M = Y.add3L(w, T, G);
      r = Y.add3H(M, k, $, j), s = M | 0;
    }
    ({ h: r, l: s } = Y.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Y.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Y.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = Y.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = Y.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: b } = Y.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: x, l: g } = Y.add(this.Gh | 0, this.Gl | 0, x | 0, g | 0), { h: I, l: L } = Y.add(this.Hh | 0, this.Hl | 0, I | 0, L | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, b, x, g, I, L);
  }
  roundClean() {
    nn.fill(0), rn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, wm = class extends fo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, xm = class extends fo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, mm = class extends fo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ar(() => new fo());
ar(() => new wm());
const Sm = ar(() => new xm());
ar(() => new mm());
var nt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(nt || (nt = {}));
var vt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(vt || (vt = {}));
function Oc(t) {
  return vt[t];
}
const Em = () => ({ type: nt.BoolTrue }), Am = () => ({ type: nt.BoolFalse }), $m = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: nt.Buffer, value: K(t) };
}, Kl = BigInt("0xffffffffffffffffffffffffffffffff"), Im = BigInt(0), Vl = BigInt("0x7fffffffffffffffffffffffffffffff"), ql = BigInt("-170141183460469231731687303715884105728"), vm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = la(st(t))), Gt(t, Uint8Array) && (t = la(t));
  const e = Tt(t);
  if (e > Vl)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Vl}`);
  if (e < ql)
    throw new RangeError(`Cannot construct clarity integer form value less than ${ql}`);
  return { type: nt.Int, value: e };
}, Lm = (t) => {
  const e = Tt(t);
  if (e < Im)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Kl)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Kl}`);
  return { type: nt.UInt, value: e };
};
function Bm(t) {
  return { type: nt.List, value: t };
}
function V0() {
  return { type: nt.OptionalNone };
}
function q0(t) {
  return { type: nt.OptionalSome, value: t };
}
var P;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(P || (P = {}));
function Cm() {
  return {
    type: P.Address,
    version: Xn.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Wl(t) {
  if (t && nd(t, Pi))
    throw new Error(`Memo exceeds maximum length of ${Pi} bytes`);
  return { type: P.MemoString, content: t };
}
function jc(t, e) {
  return {
    type: P.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function _a(t) {
  if (st(t).byteLength != uo)
    throw Error("Invalid signature");
  return {
    type: P.MessageSignature,
    data: t
  };
}
function Mm(t, e, n) {
  return typeof t == "string" && (t = Vm(t)), typeof n == "string" && (n = Wl(n)), {
    type: P.Payload,
    payloadType: at.TokenTransfer,
    recipient: t,
    amount: Tt(e),
    memo: n ?? Wl("")
  };
}
function Hm(t, e, n, r) {
  return typeof e == "string" && (e = he(e)), typeof n == "string" && (n = he(n)), {
    type: P.Payload,
    payloadType: at.ContractCall,
    contractAddress: typeof t == "string" ? $n(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Um(t) {
  return he(t, 4, 1e5);
}
function Yl(t, e, n) {
  return typeof t == "string" && (t = he(t)), typeof e == "string" && (e = Um(e)), typeof n == "number" ? {
    type: P.Payload,
    payloadType: at.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: P.Payload,
    payloadType: at.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function _m() {
  return { type: P.Payload, payloadType: at.PoisonMicroblock };
}
function Xl(t, e) {
  if (t.byteLength != Pn)
    throw Error(`Coinbase buffer size must be ${Pn} bytes`);
  return e != null ? {
    type: P.Payload,
    payloadType: at.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: P.Payload,
    payloadType: at.Coinbase,
    coinbaseBytes: t
  };
}
function Tm(t, e, n) {
  if (t.byteLength != Pn)
    throw Error(`Coinbase buffer size must be ${Pn} bytes`);
  if (n.byteLength != va)
    throw Error(`VRF proof buffer size must be ${va} bytes`);
  return {
    type: P.Payload,
    payloadType: at.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === nt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function Nm(t, e, n, r, s, i, o) {
  return {
    type: P.Payload,
    payloadType: at.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function he(t, e, n) {
  const r = e || 1, s = n || wx;
  if (nd(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: P.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Pm(t, e, n) {
  return {
    type: P.Asset,
    address: $n(t),
    contractName: he(e),
    assetName: he(n)
  };
}
function $n(t) {
  const e = or.c32addressDecode(t);
  return {
    type: P.Address,
    version: e[0],
    hash160: e[1]
  };
}
function km(t, e) {
  const n = $n(t), r = he(e);
  return {
    type: P.Principal,
    prefix: kt.Contract,
    address: n,
    contractName: r
  };
}
function Dm(t) {
  const e = $n(t);
  return {
    type: P.Principal,
    prefix: kt.Standard,
    address: e
  };
}
function Er(t, e) {
  return {
    pubKeyEncoding: t,
    type: P.TransactionAuthField,
    contents: e
  };
}
function _e(t) {
  switch (t.type) {
    case P.Address:
      return Us(t);
    case P.Principal:
      return W0(t);
    case P.LengthPrefixedString:
      return Dr(t);
    case P.MemoString:
      return jm(t);
    case P.Asset:
      return X0(t);
    case P.PostCondition:
      return Q0(t);
    case P.PublicKey:
      return Pa(t);
    case P.LengthPrefixedList:
      return Fc(t);
    case P.Payload:
      return J0(t);
    case P.TransactionAuthField:
      return Km(t);
    case P.MessageSignature:
      return zc(t);
  }
}
function Us(t) {
  const e = [];
  return e.push(st(vs(t.version, 1))), e.push(st(t.hash160)), $t(e);
}
function kr(t) {
  const e = Gt(t, dt) ? t : new dt(t), n = Xi(K(e.readBytes(1))), r = K(e.readBytes(20));
  return { type: P.Address, version: n, hash160: r };
}
function W0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === kt.Standard || t.prefix === kt.Contract) && e.push(Us(t.address)), t.prefix === kt.Contract && e.push(Dr(t.contractName)), $t(e);
}
function Om(t) {
  const e = Gt(t, dt) ? t : new dt(t), n = e.readUInt8Enum(kt, (i) => {
    throw new Nt(`Unexpected Principal payload type: ${i}`);
  });
  if (n === kt.Origin)
    return { type: P.Principal, prefix: n };
  const r = kr(e);
  if (n === kt.Standard)
    return { type: P.Principal, prefix: n, address: r };
  const s = re(e);
  return {
    type: P.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Dr(t) {
  const e = [], n = nr(t.content), r = n.byteLength;
  return e.push(st(vs(r, t.lengthPrefixBytes))), e.push(n), $t(e);
}
function re(t, e, n) {
  e = e || 1;
  const r = Gt(t, dt) ? t : new dt(t), s = Xi(K(r.readBytes(e))), i = Ls(r.readBytes(s));
  return he(i, e, n ?? 128);
}
function jm(t) {
  const e = [], n = nr(t.content), r = pS(K(n), Pi * 2);
  return e.push(st(r)), $t(e);
}
function Y0(t) {
  const e = Gt(t, dt) ? t : new dt(t);
  let n = Ls(e.readBytes(Pi));
  return n = n.replace(/\u0000*$/, ""), { type: P.MemoString, content: n };
}
function X0(t) {
  const e = [];
  return e.push(Us(t.address)), e.push(Dr(t.contractName)), e.push(Dr(t.assetName)), $t(e);
}
function Ta(t) {
  const e = Gt(t, dt) ? t : new dt(t);
  return {
    type: P.Asset,
    address: kr(e),
    contractName: re(e),
    assetName: re(e)
  };
}
function Fc(t) {
  const e = t.values, n = [];
  n.push(st(vs(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(_e(r));
  return $t(n);
}
function Z0(t, e, n) {
  const r = Gt(t, dt) ? t : new dt(t), s = Xi(K(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case P.Address:
        i.push(kr(r));
        break;
      case P.LengthPrefixedString:
        i.push(re(r));
        break;
      case P.MemoString:
        i.push(Y0(r));
        break;
      case P.Asset:
        i.push(Ta(r));
        break;
      case P.PostCondition:
        i.push(zm(r));
        break;
      case P.PublicKey:
        i.push(ka(r));
        break;
      case P.TransactionAuthField:
        i.push(Gm(r));
        break;
    }
  return jc(i, n);
}
function Fm(t) {
  return K(Q0(t));
}
function Q0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(W0(t.principal)), (t.conditionType === gt.Fungible || t.conditionType === gt.NonFungible) && e.push(X0(t.asset)), t.conditionType === gt.NonFungible && e.push(Ee(t.assetName)), e.push(t.conditionCode), t.conditionType === gt.STX || t.conditionType === gt.Fungible || t.conditionType === gt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Sr("The post-condition amount may not be larger than 8 bytes");
    e.push(En(t.amount, 8));
  }
  return $t(e);
}
function zm(t) {
  const e = Gt(t, dt) ? t : new dt(t), n = e.readUInt8Enum(gt, (a) => {
    throw new Nt(`Could not read ${a} as PostConditionType`);
  }), r = Om(e);
  let s, i, o;
  switch (n) {
    case gt.STX:
      return s = e.readUInt8Enum(cs, (c) => {
        throw new Nt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${K(e.readBytes(8))}`), {
        type: P.PostCondition,
        conditionType: gt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case gt.Fungible:
      return i = Ta(e), s = e.readUInt8Enum(cs, (c) => {
        throw new Nt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${K(e.readBytes(8))}`), {
        type: P.PostCondition,
        conditionType: gt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case gt.NonFungible:
      i = Ta(e);
      const a = me(e);
      return s = e.readUInt8Enum(Ba, (c) => {
        throw new Nt(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: P.PostCondition,
        conditionType: gt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case gt.Staking:
      return s = e.readUInt8Enum(cs, (c) => {
        throw new Nt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${K(e.readBytes(8))}`), {
        type: P.PostCondition,
        conditionType: gt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case gt.PoX: {
      const c = e.readUInt8Enum(Ca, (l) => {
        throw new Nt(`Could not read ${l} as PoxConditionCode`);
      });
      return {
        type: P.PostCondition,
        conditionType: gt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function J0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case at.TokenTransfer:
      e.push(Ee(t.recipient)), e.push(En(t.amount, 8)), e.push(_e(t.memo));
      break;
    case at.ContractCall:
      e.push(_e(t.contractAddress)), e.push(_e(t.contractName)), e.push(_e(t.functionName));
      const n = new Uint8Array(4);
      jn(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ee(r));
      });
      break;
    case at.SmartContract:
      e.push(_e(t.contractName)), e.push(_e(t.codeBody));
      break;
    case at.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(_e(t.contractName)), e.push(_e(t.codeBody));
      break;
    case at.PoisonMicroblock:
      break;
    case at.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case at.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ee(t.recipient));
      break;
    case at.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ee(t.recipient ? q0(t.recipient) : V0())), e.push(t.vrfProof);
      break;
    case at.TenureChange:
      e.push(st(t.tenureHash)), e.push(st(t.previousTenureHash)), e.push(st(t.burnViewHash)), e.push(st(t.previousTenureEnd)), e.push(jn(new Uint8Array(4), t.previousTenureBlocks)), e.push(k1(new Uint8Array(1), t.cause)), e.push(st(t.publicKeyHash));
      break;
  }
  return $t(e);
}
function Rm(t) {
  const e = Gt(t, dt) ? t : new dt(t);
  switch (e.readUInt8Enum(at, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case at.TokenTransfer:
      const r = me(e), s = Tt(e.readBytes(8)), i = Y0(e);
      return Mm(r, s, i);
    case at.ContractCall:
      const o = kr(e), a = re(e), c = re(e), l = [], f = e.readUInt32BE();
      for (let A = 0; A < f; A++) {
        const m = me(e);
        l.push(m);
      }
      return Hm(o, a, c, l);
    case at.SmartContract:
      const u = re(e), p = re(e, 4, 1e5);
      return Yl(u, p);
    case at.VersionedSmartContract: {
      const A = e.readUInt8Enum(La, (D) => {
        throw new Error(`Cannot recognize ClarityVersion: ${D}`);
      }), m = re(e), B = re(e, 4, Cx);
      return Yl(m, B, A);
    }
    case at.PoisonMicroblock:
      return _m();
    case at.Coinbase: {
      const A = e.readBytes(Pn);
      return Xl(A);
    }
    case at.CoinbaseToAltRecipient: {
      const A = e.readBytes(Pn), m = me(e);
      return Xl(A, m);
    }
    case at.NakamotoCoinbase: {
      const A = e.readBytes(Pn), m = me(e), B = e.readBytes(va);
      return Tm(A, m, B);
    }
    case at.TenureChange:
      const h = K(e.readBytes(20)), b = K(e.readBytes(20)), x = K(e.readBytes(20)), g = K(e.readBytes(32)), I = e.readUInt32BE(), L = e.readUInt8Enum(Ma, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), y = K(e.readBytes(20));
      return Nm(h, b, x, g, I, L, y);
  }
}
function Na(t) {
  const e = Gt(t, dt) ? t : new dt(t);
  return _a(K(e.readBytes(uo)));
}
function Gm(t) {
  const e = Gt(t, dt) ? t : new dt(t), n = e.readUInt8Enum(ce, (r) => {
    throw new Nt(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case ce.PublicKeyCompressed:
      return Er(wt.Compressed, ka(e));
    case ce.PublicKeyUncompressed:
      return Er(wt.Uncompressed, Vr(IS(ka(e).data)));
    case ce.SignatureCompressed:
      return Er(wt.Compressed, Na(e));
    case ce.SignatureUncompressed:
      return Er(wt.Uncompressed, Na(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function zc(t) {
  return st(t.data);
}
function Km(t) {
  const e = [];
  switch (t.contents.type) {
    case P.PublicKey:
      e.push(t.pubKeyEncoding === wt.Compressed ? ce.PublicKeyCompressed : ce.PublicKeyUncompressed), e.push(st($S(t.contents.data)));
      break;
    case P.MessageSignature:
      e.push(t.pubKeyEncoding === wt.Compressed ? ce.SignatureCompressed : ce.SignatureUncompressed), e.push(zc(t.contents));
      break;
  }
  return $t(e);
}
function Pa(t) {
  return t.data.slice();
}
function ka(t) {
  const e = Gt(t, dt) ? t : new dt(t), n = e.readUInt8(), r = n === 4 ? Sx : mx;
  return Vr($t([n, e.readBytes(r)]));
}
function Rc(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ft.P2PKH || e === ft.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ft.P2WPKH || e === ft.P2WSH || e === ft.P2WSHNonSequential) && !r.map((s) => s.data).every(qr))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ft.P2PKH:
      return ri(t, gS(r[0].data));
    case ft.P2WPKH:
      return ri(t, yS(r[0].data));
    case ft.P2SH:
    case ft.P2SHNonSequential:
      return ri(t, bS(n, r.map(Pa)));
    case ft.P2WSH:
    case ft.P2WSHNonSequential:
      return ri(t, wS(n, r.map(Pa)));
  }
}
function ri(t, e) {
  return { type: P.Address, version: t, hash160: e };
}
function Gc(t) {
  return or.c32address(t.version, t.hash160);
}
function Zl(t) {
  const [e, n, r] = t.split(/\.|::/);
  return Pm(e, n, r);
}
function ns(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return km(e, n);
  } else
    return Dm(t);
}
function Vm(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Ym(e, n);
  } else
    return qm(t);
}
function qm(t) {
  const e = $n(t);
  return { type: nt.PrincipalStandard, value: Gc(e) };
}
function Wm(t) {
  return { type: nt.PrincipalStandard, value: Gc(t) };
}
function Ym(t, e) {
  const n = $n(t), r = he(e);
  return td(n, r);
}
function td(t, e) {
  if (nr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: nt.PrincipalContract,
    value: `${Gc(t)}.${e.content}`
  };
}
function Xm(t) {
  return { type: nt.ResponseErr, value: t };
}
function Zm(t) {
  return { type: nt.ResponseOk, value: t };
}
const Qm = (t) => ({ type: nt.StringASCII, value: t }), Jm = (t) => ({ type: nt.StringUTF8, value: t });
function tS(t) {
  for (const e in t)
    if (!xS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: nt.Tuple, value: t };
}
function me(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new dt(st(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new dt(t) : e = t;
  switch (e.readUInt8Enum(vt, (r) => {
    throw new Nt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case vt.int:
      return vm(la(e.readBytes(16)));
    case vt.uint:
      return Lm(e.readBytes(16));
    case vt.buffer:
      const r = e.readUInt32BE();
      return $m(e.readBytes(r));
    case vt.true:
      return Em();
    case vt.false:
      return Am();
    case vt.address:
      const s = kr(e);
      return Wm(s);
    case vt.contract:
      const i = kr(e), o = re(e);
      return td(i, o);
    case vt.ok:
      return Zm(me(e));
    case vt.err:
      return Xm(me(e));
    case vt.none:
      return V0();
    case vt.some:
      return q0(me(e));
    case vt.list:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(me(e));
      return Bm(c);
    case vt.tuple:
      const l = e.readUInt32BE(), f = {};
      for (let x = 0; x < l; x++) {
        const g = re(e).content;
        if (g === void 0)
          throw new Nt('"content" is undefined');
        f[g] = me(e);
      }
      return tS(f);
    case vt.ascii:
      const u = e.readUInt32BE(), p = C1(e.readBytes(u));
      return Qm(p);
    case vt.utf8:
      const h = e.readUInt32BE(), b = Ls(e.readBytes(h));
      return Jm(b);
    default:
      throw new Nt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function ve(t, e) {
  return $t([Oc(t), e]);
}
function eS(t) {
  return new Uint8Array([Oc(t.type)]);
}
function nS(t) {
  return t.type === nt.OptionalNone ? new Uint8Array([Oc(t.type)]) : ve(t.type, Ee(t.value));
}
function rS(t) {
  const e = new Uint8Array(4);
  return jn(e, Math.ceil(t.value.length / 2), 0), ve(t.type, $e(e, st(t.value)));
}
function sS(t) {
  const e = pc($1(BigInt(t.value), BigInt(xx)), k0);
  return ve(t.type, e);
}
function iS(t) {
  const e = pc(BigInt(t.value), k0);
  return ve(t.type, e);
}
function oS(t) {
  return ve(t.type, Us($n(t.value)));
}
function aS(t) {
  const [e, n] = mS(t.value);
  return ve(t.type, $e(Us($n(e)), Dr(he(n))));
}
function cS(t) {
  return ve(t.type, Ee(t.value));
}
function uS(t) {
  const e = [], n = new Uint8Array(4);
  jn(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Ee(r);
    e.push(s);
  }
  return ve(t.type, $t(e));
}
function lS(t) {
  const e = [], n = new Uint8Array(4);
  jn(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = he(s);
    e.push(Dr(i));
    const o = Ee(t.value[s]);
    e.push(o);
  }
  return ve(t.type, $t(e));
}
function ed(t, e) {
  const n = [], r = e == "ascii" ? B1(t.value) : nr(t.value), s = new Uint8Array(4);
  return jn(s, r.length, 0), n.push(s), n.push(r), ve(t.type, $t(n));
}
function fS(t) {
  return ed(t, "ascii");
}
function hS(t) {
  return ed(t, "utf8");
}
function Ql(t) {
  return K(Ee(t));
}
function Ee(t) {
  switch (t.type) {
    case nt.BoolTrue:
    case nt.BoolFalse:
      return eS(t);
    case nt.OptionalNone:
    case nt.OptionalSome:
      return nS(t);
    case nt.Buffer:
      return rS(t);
    case nt.UInt:
      return iS(t);
    case nt.Int:
      return sS(t);
    case nt.PrincipalStandard:
      return oS(t);
    case nt.PrincipalContract:
      return aS(t);
    case nt.ResponseOk:
    case nt.ResponseErr:
      return cS(t);
    case nt.List:
      return uS(t);
    case nt.Tuple:
      return lS(t);
    case nt.StringASCII:
      return fS(t);
    case nt.StringUTF8:
      return hS(t);
    default:
      throw new Sr("Unable to serialize. Invalid Clarity Value.");
  }
}
const dS = (t) => t.length % 2 ? `0${t}` : t, pS = (t, e) => t.padEnd(e, "0"), nd = (t, e) => t ? nr(t).length > e : !1;
function Da(t) {
  return _0(t);
}
const ds = (t) => Wx(Pc(t)), Kc = (t) => K(Sm(t)), gS = (t) => K(ds(t)), yS = (t) => {
  const e = ds(t), n = $e(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ds(n);
  return K(r);
}, bS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = $t(n), s = ds(r);
  return K(s);
}, wS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = $t(n), s = Pc(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = $t(i), a = ds(o);
  return K(a);
};
function xS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function mS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
At.hmacSha256Sync = (t, ...e) => {
  const n = F0.create(Pc, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Vr(t) {
  return t = typeof t == "string" ? st(t) : t, {
    type: P.PublicKey,
    data: t
  };
}
function SS(t, e, n = wt.Compressed) {
  const r = _1(e), s = new Qt(Qu(r.r), Qu(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === wt.Compressed;
  return i.toHex(o);
}
function ES(t) {
  return typeof t == "string" ? t : K(t);
}
const Vc = ES;
function rd(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === U1;
}
function qr(t) {
  return !Vc(t).startsWith("04");
}
function AS(t) {
  t = gc(t);
  const e = rd(t);
  return K(Bs(t.slice(0, 32), e));
}
function $S(t) {
  return J.fromHex(Vc(t)).toHex(!0);
}
function IS(t) {
  return J.fromHex(Vc(t)).toHex(!1);
}
function vS(t, e) {
  t = gc(t);
  const [n, r] = Qi(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return vs(r, 1) + Qt.fromHex(n).toCompactHex();
}
function qc() {
  return {
    type: P.MessageSignature,
    data: K(new Uint8Array(uo))
  };
}
function sd(t, e, n, r) {
  const s = Rc(0, t, 1, [Vr(e)]).hash160, i = qr(e) ? wt.Compressed : wt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Tt(n),
    fee: Tt(r),
    keyEncoding: i,
    signature: qc()
  };
}
function ps(t) {
  return "signature" in t;
}
function Jl(t) {
  return t === ft.P2SH || t === ft.P2WSH;
}
function LS(t) {
  return t === ft.P2SHNonSequential || t === ft.P2WSHNonSequential;
}
function tf(t) {
  const e = Da(t);
  return e.nonce = 0, e.fee = 0, ps(e) ? e.signature = qc() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function BS(t) {
  const e = [
    t.hashMode,
    st(t.signer),
    En(t.nonce, 8),
    En(t.fee, 8),
    t.keyEncoding,
    zc(t.signature)
  ];
  return $t(e);
}
function CS(t) {
  const e = [
    t.hashMode,
    st(t.signer),
    En(t.nonce, 8),
    En(t.fee, 8)
  ], n = jc(t.fields);
  e.push(Fc(n));
  const r = new Uint8Array(2);
  return N1(r, t.signaturesRequired, 0), e.push(r), $t(e);
}
function MS(t, e) {
  const n = K(e.readBytes(20)), r = BigInt(`0x${K(e.readBytes(8))}`), s = BigInt(`0x${K(e.readBytes(8))}`), i = e.readUInt8Enum(wt, (a) => {
    throw new Nt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ft.P2WPKH && i != wt.Compressed)
    throw new Nt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Na(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function HS(t, e) {
  const n = K(e.readBytes(20)), r = BigInt("0x" + K(e.readBytes(8))), s = BigInt("0x" + K(e.readBytes(8))), i = Z0(e, P.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case P.PublicKey:
        qr(l.contents.data) || (o = !0);
        break;
      case P.MessageSignature:
        if (l.pubKeyEncoding === wt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Un("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ft.P2WSH || t === ft.P2WSHNonSequential))
    throw new Un("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ko(t) {
  return ps(t) ? BS(t) : CS(t);
}
function Vo(t) {
  const e = t.readUInt8Enum(ft, (n) => {
    throw new Nt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ft.P2PKH || e === ft.P2WPKH ? MS(e, t) : HS(e, t);
}
function id(t, e, n, r) {
  const i = t + K(new Uint8Array([e])) + K(En(n, 8)) + K(En(r, 8));
  if (st(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Kc(st(i));
}
function od(t, e, n) {
  const r = 33 + uo, s = qr(e.data) ? wt.Compressed : wt.Uncompressed, i = t + dS(s.toString(16)) + n, o = st(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Kc(o);
}
function US(t, e, n, r, s) {
  const i = id(t, e, n, r), o = vS(s, i), a = Vr(AS(s)), c = od(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function ad(t, e, n, r, s, i) {
  const o = id(t, e, n, r), a = Vr(SS(o, i, s)), c = od(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function _S() {
  const t = sd(ft.P2PKH, "", 0, 0);
  return t.signer = Cm().hash160, t.keyEncoding = wt.Compressed, t.signature = qc(), t;
}
function ef(t, e, n) {
  return ps(t) ? TS(t, e, n) : NS(t, e, n);
}
function TS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = ad(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Rc(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Un(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function NS(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case P.PublicKey:
        qr(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case P.MessageSignature:
        c.pubKeyEncoding === wt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = ad(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Jl(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new Un("Too many signatures");
        break;
    }
  if (Jl(t.hashMode) && o !== t.signaturesRequired || LS(t.hashMode) && o < t.signaturesRequired)
    throw new Un("Incorrect number of signatures");
  if (i && (t.hashMode === ft.P2WSH || t.hashMode === ft.P2WSHNonSequential))
    throw new Un("Uncompressed keys are not allowed in this hash mode");
  const a = Rc(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Un(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function cd(t) {
  return {
    authType: St.Standard,
    spendingCondition: t
  };
}
function ud(t, e) {
  return {
    authType: St.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || sd(ft.P2PKH, "0".repeat(66), 0, 0)
  };
}
function nf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case St.Standard:
        return cd(tf(t.spendingCondition));
      case St.Sponsored:
        return ud(tf(t.spendingCondition), _S());
      default:
        throw new Di("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function PS(t, e) {
  switch (t.authType) {
    case St.Standard:
      return ef(t.spendingCondition, e, St.Standard);
    case St.Sponsored:
      return ef(t.spendingCondition, e, St.Standard);
    default:
      throw new Di("Invalid origin auth type");
  }
}
function kS(t, e) {
  switch (t.authType) {
    case St.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Tt(e)
      };
      return { ...t, spendingCondition: n };
    case St.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Tt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function DS(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Tt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function OS(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Tt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function jS(t, e) {
  const n = {
    ...e,
    nonce: Tt(e.nonce),
    fee: Tt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function FS(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case St.Standard:
      e.push(Ko(t.spendingCondition));
      break;
    case St.Sponsored:
      e.push(Ko(t.spendingCondition)), e.push(Ko(t.sponsorSpendingCondition));
      break;
  }
  return $t(e);
}
function zS(t) {
  const e = t.readUInt8Enum(St, (r) => {
    throw new Nt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case St.Standard:
      return n = Vo(t), cd(n);
    case St.Sponsored:
      n = Vo(t);
      const r = Vo(t);
      return ud(n, r);
  }
}
class RS {
  constructor({ auth: e, payload: n, postConditions: r = jc([]), postConditionMode: s = ki.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = yx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Tt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Wt.Any;
  }
  signBegin() {
    const e = Da(this);
    return e.auth = nf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Da(this);
    return e.auth = nf(e.auth), e.txid();
  }
  verifyOrigin() {
    return PS(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, St.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === St.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, St.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Vr(e), r = this.auth.spendingCondition;
    if (r && !ps(r)) {
      const s = qr(n.data);
      r.fields.push(Er(s ? wt.Compressed : wt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = US(n, r, e.fee, e.nonce, s);
    if (ps(e))
      e.signature = _a(i);
    else {
      const a = rd(s);
      e.fields.push(Er(a ? wt.Compressed : wt.Uncompressed, _a(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Kc(e);
  }
  setSponsor(e) {
    if (this.auth.authType != St.Sponsored)
      throw new Di("Cannot sponsor sign a non-sponsored transaction");
    this.auth = jS(this.auth, e);
  }
  setFee(e) {
    this.auth = kS(this.auth, e);
  }
  setNonce(e) {
    this.auth = DS(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != St.Sponsored)
      throw new Di("Cannot sponsor sign a non-sponsored transaction");
    this.auth = OS(this.auth, e);
  }
  serialize() {
    return K(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Sr('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Sr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Sr('"auth" is undefined');
    if (this.payload === void 0)
      throw new Sr('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return jn(n, this.chainId, 0), e.push(n), e.push(FS(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Fc(this.postConditions)), e.push(J0(this.payload)), $t(e);
  }
}
function GS(t) {
  const e = Gt(t, dt) ? t : new dt(t), n = e.readUInt8Enum(Yn, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = zS(e), i = e.readUInt8Enum(Wt, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(ki, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Z0(e, P.PostCondition), c = Rm(e), l = new RS({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return l.anchorMode = i, l;
}
const rf = BigInt("18446744073709551615");
function qo(t) {
  const e = Tt(t);
  if (e < 0n || e > rf)
    throw new RangeError(`Post-condition amount must be between 0 and ${rf} (u64 max), received: ${e}`);
  return e;
}
var Oa;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Oa || (Oa = {}));
var ja;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(ja || (ja = {}));
function KS(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: P.PostCondition,
        conditionType: gt.STX,
        principal: t.address === "origin" ? { type: P.Principal, prefix: kt.Origin } : ns(t.address),
        conditionCode: si(t.condition),
        amount: qo(t.amount)
      };
    case "ft-postcondition":
      return {
        type: P.PostCondition,
        conditionType: gt.Fungible,
        principal: t.address === "origin" ? { type: P.Principal, prefix: kt.Origin } : ns(t.address),
        conditionCode: si(t.condition),
        amount: qo(t.amount),
        asset: Zl(t.asset)
      };
    case "nft-postcondition":
      return {
        type: P.PostCondition,
        conditionType: gt.NonFungible,
        principal: t.address === "origin" ? { type: P.Principal, prefix: kt.Origin } : ns(t.address),
        conditionCode: si(t.condition),
        asset: Zl(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: P.PostCondition,
        conditionType: gt.Staking,
        principal: t.address === "origin" ? { type: P.Principal, prefix: kt.Origin } : ns(t.address),
        conditionCode: si(t.condition),
        amount: qo(t.amount)
      };
    case "pox-postcondition":
      return {
        type: P.PostCondition,
        conditionType: gt.PoX,
        principal: t.address === "origin" ? { type: P.Principal, prefix: kt.Origin } : ns(t.address),
        conditionCode: VS(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function si(t) {
  return Oa[t];
}
function VS(t) {
  return ja[t];
}
function ld(t) {
  const e = KS(t);
  return Fm(e);
}
function qS(t, e, n) {
  return Yc(fd(t), n);
}
function fd(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = gs(r);
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
    return BigInt(`0x${XS(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Wc(t, e = 8) {
  return (typeof t == "bigint" ? t : fd(t)).toString(16).padStart(e * 2, "0");
}
function Yc(t, e = 16) {
  const n = Wc(t, e);
  return gs(n);
}
function WS(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const YS = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function XS(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += YS[n];
  return e;
}
function gs(t) {
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
function Xc(t) {
  return new TextEncoder().encode(t);
}
function ZS(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function QS(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function sf(t) {
  if (t.some(QS))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Zc(...t) {
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
  return Zc(...t.map((e) => typeof e == "number" ? sf([e]) : e instanceof Array ? sf(e) : e));
}
function ho(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Fa;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Fa || (Fa = {}));
Fa.Mainnet;
const JS = 128, t3 = 128, hd = 16;
var za;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(za || (za = {}));
var of;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(of || (of = {}));
var af;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(af || (af = {}));
var ae;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ae || (ae = {}));
const Wo = ["onChainOnly", "offChainOnly", "any"];
Wo[0] + "", ae.OnChainOnly, Wo[1] + "", ae.OffChainOnly, Wo[2] + "", ae.Any, ae.OnChainOnly + "", ae.OnChainOnly, ae.OffChainOnly + "", ae.OffChainOnly, ae.Any + "", ae.Any;
var Ra;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ra || (Ra = {}));
Ra.Mainnet;
var cf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(cf || (cf = {}));
var Bn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Bn || (Bn = {}));
var uf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(uf || (uf = {}));
var lf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(lf || (lf = {}));
var ff;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ff || (ff = {}));
var hf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(hf || (hf = {}));
var df;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(df || (df = {}));
var pf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(pf || (pf = {}));
var Ga;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ga || (Ga = {}));
var gf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(gf || (gf = {}));
var yf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(yf || (yf = {}));
function Ka(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function e3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function dd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function n3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ka(t.outputLen), Ka(t.blockLen);
}
function r3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function s3(t, e) {
  dd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Yo = {
  number: Ka,
  bool: e3,
  bytes: dd,
  hash: n3,
  exists: r3,
  output: s3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), be = (t, e) => t << 32 - e | t >>> e, i3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!i3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function o3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function pd(t) {
  if (typeof t == "string" && (t = o3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let a3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function cr(t) {
  const e = (r) => t().update(pd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function c3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Qc = class extends a3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Xo(this.buffer);
  }
  update(e) {
    Yo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = pd(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Xo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Yo.exists(this), Yo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    c3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Xo(e), c = this.outputLen;
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
const u3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gd = Uint8Array.from({ length: 16 }, (t, e) => e), l3 = gd.map((t) => (9 * t + 5) % 16);
let Jc = [gd], tu = [l3];
for (let t = 0; t < 4; t++)
  for (let e of [Jc, tu])
    e.push(e[t].map((n) => u3[n]));
const yd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), f3 = Jc.map((t, e) => t.map((n) => yd[e][n])), h3 = tu.map((t, e) => t.map((n) => yd[e][n])), d3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), p3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ii = (t, e) => t << e | t >>> 32 - e;
function bf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oi = new Uint32Array(16);
let g3 = class extends Qc {
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
      const b = 4 - h, x = d3[h], g = p3[h], I = Jc[h], L = tu[h], y = f3[h], A = h3[h];
      for (let m = 0; m < 16; m++) {
        const B = ii(r + bf(h, i, a, l) + oi[I[m]] + x, y[m]) + u | 0;
        r = u, u = l, l = ii(a, 10) | 0, a = i, i = B;
      }
      for (let m = 0; m < 16; m++) {
        const B = ii(s + bf(b, o, c, f) + oi[L[m]] + g, A[m]) + p | 0;
        s = p, p = f, f = ii(c, 10) | 0, c = o, o = B;
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
cr(() => new g3());
const y3 = (t, e, n) => t & e ^ ~t & n, b3 = (t, e, n) => t & e ^ t & n ^ e & n, w3 = new Uint32Array([
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
]), sn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), on = new Uint32Array(64);
let bd = class extends Qc {
  constructor() {
    super(64, 32, 8, !1), this.A = sn[0] | 0, this.B = sn[1] | 0, this.C = sn[2] | 0, this.D = sn[3] | 0, this.E = sn[4] | 0, this.F = sn[5] | 0, this.G = sn[6] | 0, this.H = sn[7] | 0;
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
      on[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = on[u - 15], h = on[u - 2], b = be(p, 7) ^ be(p, 18) ^ p >>> 3, x = be(h, 17) ^ be(h, 19) ^ h >>> 10;
      on[u] = x + on[u - 7] + b + on[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = be(a, 6) ^ be(a, 11) ^ be(a, 25), h = f + p + y3(a, c, l) + w3[u] + on[u] | 0, x = (be(r, 2) ^ be(r, 13) ^ be(r, 22)) + b3(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    on.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, x3 = class extends bd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
cr(() => new bd());
cr(() => new x3());
const ai = BigInt(2 ** 32 - 1), Va = BigInt(32);
function wd(t, e = !1) {
  return e ? { h: Number(t & ai), l: Number(t >> Va & ai) } : { h: Number(t >> Va & ai) | 0, l: Number(t & ai) | 0 };
}
function m3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = wd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const S3 = (t, e) => BigInt(t >>> 0) << Va | BigInt(e >>> 0), E3 = (t, e, n) => t >>> n, A3 = (t, e, n) => t << 32 - n | e >>> n, $3 = (t, e, n) => t >>> n | e << 32 - n, I3 = (t, e, n) => t << 32 - n | e >>> n, v3 = (t, e, n) => t << 64 - n | e >>> n - 32, L3 = (t, e, n) => t >>> n - 32 | e << 64 - n, B3 = (t, e) => e, C3 = (t, e) => t, M3 = (t, e, n) => t << n | e >>> 32 - n, H3 = (t, e, n) => e << n | t >>> 32 - n, U3 = (t, e, n) => e << n - 32 | t >>> 64 - n, _3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function T3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const N3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), P3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, k3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), D3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, O3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), j3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, X = {
  fromBig: wd,
  split: m3,
  toBig: S3,
  shrSH: E3,
  shrSL: A3,
  rotrSH: $3,
  rotrSL: I3,
  rotrBH: v3,
  rotrBL: L3,
  rotr32H: B3,
  rotr32L: C3,
  rotlSH: M3,
  rotlSL: H3,
  rotlBH: U3,
  rotlBL: _3,
  add: T3,
  add3L: N3,
  add3H: P3,
  add4L: k3,
  add4H: D3,
  add5H: j3,
  add5L: O3
}, [F3, z3] = X.split([
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
].map((t) => BigInt(t))), an = new Uint32Array(80), cn = new Uint32Array(80);
let po = class extends Qc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: b, Hh: x, Hl: g } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, b, x, g];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, b, x, g) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = x | 0, this.Hl = g | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      an[y] = e.getUint32(n), cn[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const A = an[y - 15] | 0, m = cn[y - 15] | 0, B = X.rotrSH(A, m, 1) ^ X.rotrSH(A, m, 8) ^ X.shrSH(A, m, 7), D = X.rotrSL(A, m, 1) ^ X.rotrSL(A, m, 8) ^ X.shrSL(A, m, 7), _ = an[y - 2] | 0, k = cn[y - 2] | 0, w = X.rotrSH(_, k, 19) ^ X.rotrBH(_, k, 61) ^ X.shrSH(_, k, 6), $ = X.rotrSL(_, k, 19) ^ X.rotrBL(_, k, 61) ^ X.shrSL(_, k, 6), T = X.add4L(D, $, cn[y - 7], cn[y - 16]), j = X.add4H(T, B, w, an[y - 7], an[y - 16]);
      an[y] = j | 0, cn[y] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: b, Gh: x, Gl: g, Hh: I, Hl: L } = this;
    for (let y = 0; y < 80; y++) {
      const A = X.rotrSH(u, p, 14) ^ X.rotrSH(u, p, 18) ^ X.rotrBH(u, p, 41), m = X.rotrSL(u, p, 14) ^ X.rotrSL(u, p, 18) ^ X.rotrBL(u, p, 41), B = u & h ^ ~u & x, D = p & b ^ ~p & g, _ = X.add5L(L, m, D, z3[y], cn[y]), k = X.add5H(_, I, A, B, F3[y], an[y]), w = _ | 0, $ = X.rotrSH(r, s, 28) ^ X.rotrBH(r, s, 34) ^ X.rotrBH(r, s, 39), T = X.rotrSL(r, s, 28) ^ X.rotrBL(r, s, 34) ^ X.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      I = x | 0, L = g | 0, x = h | 0, g = b | 0, h = u | 0, b = p | 0, { h: u, l: p } = X.add(l | 0, f | 0, k | 0, w | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const M = X.add3L(w, T, G);
      r = X.add3H(M, k, $, j), s = M | 0;
    }
    ({ h: r, l: s } = X.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = X.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = X.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = X.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = X.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: b } = X.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: x, l: g } = X.add(this.Gh | 0, this.Gl | 0, x | 0, g | 0), { h: I, l: L } = X.add(this.Hh | 0, this.Hl | 0, I | 0, L | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, b, x, g, I, L);
  }
  roundClean() {
    an.fill(0), cn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, R3 = class extends po {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, G3 = class extends po {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, K3 = class extends po {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
cr(() => new po());
cr(() => new R3());
cr(() => new G3());
cr(() => new K3());
function V3(t, e, n) {
  const s = JS;
  if (c4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: za.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ct;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ct || (Ct = {}));
let q3 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, xd = class extends q3 {
  constructor(e) {
    super(e);
  }
};
function go(t) {
  const e = [];
  return e.push(gs(Wc(t.version, 1))), e.push(gs(t.hash160)), je(e);
}
function W3(t) {
  const e = [];
  return e.push(t.prefix), e.push(go(t.address)), t.prefix === Ga.Contract && e.push(ys(t.contractName)), je(e);
}
function ys(t) {
  const e = [], n = Xc(t.content), r = n.byteLength;
  return e.push(gs(Wc(r, t.lengthPrefixBytes))), e.push(n), je(e);
}
function Y3(t) {
  const e = [];
  return e.push(go(t.address)), e.push(ys(t.contractName)), e.push(ys(t.assetName)), je(e);
}
function md(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(W3(t.principal)), (t.conditionType === Bn.Fungible || t.conditionType === Bn.NonFungible) && e.push(Y3(t.assetInfo)), t.conditionType === Bn.NonFungible && e.push(Zn(t.assetName)), e.push(t.conditionCode), t.conditionType === Bn.STX || t.conditionType === Bn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new xd("The post-condition amount may not be larger than 8 bytes");
    e.push(qS(t.amount, !1, 8));
  }
  return je(e);
}
function Le(t, e) {
  return je([t, e]);
}
function X3(t) {
  return new Uint8Array([t.type]);
}
function Z3(t) {
  return t.type === Ct.OptionalNone ? new Uint8Array([t.type]) : Le(t.type, Zn(t.value));
}
function Q3(t) {
  const e = new Uint8Array(4);
  return ho(e, t.buffer.length, 0), Le(t.type, Zc(e, t.buffer));
}
function J3(t) {
  const e = Yc(WS(t.value, BigInt(t3)), hd);
  return Le(t.type, e);
}
function t4(t) {
  const e = Yc(t.value, hd);
  return Le(t.type, e);
}
function e4(t) {
  return Le(t.type, go(t.address));
}
function n4(t) {
  return Le(t.type, Zc(go(t.address), ys(t.contractName)));
}
function r4(t) {
  return Le(t.type, Zn(t.value));
}
function s4(t) {
  const e = [], n = new Uint8Array(4);
  ho(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Zn(r);
    e.push(s);
  }
  return Le(t.type, je(e));
}
function i4(t) {
  const e = [], n = new Uint8Array(4);
  ho(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = V3(s);
    e.push(ys(i));
    const o = Zn(t.data[s]);
    e.push(o);
  }
  return Le(t.type, je(e));
}
function Sd(t, e) {
  const n = [], r = e == "ascii" ? ZS(t.data) : Xc(t.data), s = new Uint8Array(4);
  return ho(s, r.length, 0), n.push(s), n.push(r), Le(t.type, je(n));
}
function o4(t) {
  return Sd(t, "ascii");
}
function a4(t) {
  return Sd(t, "utf8");
}
function Zn(t) {
  switch (t.type) {
    case Ct.BoolTrue:
    case Ct.BoolFalse:
      return X3(t);
    case Ct.OptionalNone:
    case Ct.OptionalSome:
      return Z3(t);
    case Ct.Buffer:
      return Q3(t);
    case Ct.UInt:
      return t4(t);
    case Ct.Int:
      return J3(t);
    case Ct.PrincipalStandard:
      return e4(t);
    case Ct.PrincipalContract:
      return n4(t);
    case Ct.ResponseOk:
    case Ct.ResponseErr:
      return r4(t);
    case Ct.List:
      return s4(t);
    case Ct.Tuple:
      return i4(t);
    case Ct.StringASCII:
      return o4(t);
    case Ct.StringUTF8:
      return a4(t);
    default:
      throw new xd("Unable to serialize. Invalid Clarity Value.");
  }
}
const c4 = (t, e) => t ? Xc(t).length > e : !1, u4 = "connect-ui";
let xi, Ed, Yt = !1, qa = !1;
const Oe = (t, e = "") => () => {
}, l4 = (t, e) => () => {
}, f4 = "{visibility:hidden}.hydrated{visibility:inherit}", wf = {}, h4 = "http://www.w3.org/2000/svg", d4 = "http://www.w3.org/1999/xhtml", p4 = (t) => t != null, eu = (t) => (t = typeof t, t === "object" || t === "function");
function Ad(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const V = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (l) => {
    for (let f = 0; f < l.length; f++)
      r = l[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !eu(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Wa(null, r) : r), i = s);
  };
  if (a(n), e) {
    const l = e.className || e.class;
    l && (e.class = typeof l != "object" ? l : Object.keys(l).filter((f) => l[f]).join(" "));
  }
  const c = Wa(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Wa = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, g4 = {}, y4 = (t) => t && t.$tag$ === g4, b4 = (t, e) => t != null && !eu(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, w4 = (t) => Wr(t).$hostElement$, x4 = (t, e, n) => {
  const r = _t.ce(e, n);
  return t.dispatchEvent(r), r;
}, xf = /* @__PURE__ */ new WeakMap(), m4 = (t, e, n) => {
  let r = Oi.get(t);
  j4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Oi.set(t, r);
}, S4 = (t, e, n, r) => {
  var s;
  let i = $d(e);
  const o = Oi.get(i);
  if (t = t.nodeType === 11 ? t : Ae, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = xf.get(t), c;
      if (a || xf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Ae.createElement("style"), c.innerHTML = o;
          const l = (s = _t.$nonce$) !== null && s !== void 0 ? s : Ad(Ae);
          l != null && c.setAttribute("nonce", l), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, E4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Oe("attachStyles", e.$tagName$), i = S4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, $d = (t, e) => "sc-" + t.$tagName$, mf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Ef(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, l = Sf(n), f = Sf(r);
      c.remove(...l.filter((u) => u && !f.includes(u))), c.add(...f.filter((u) => u && !l.includes(u)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Ef(yo, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && _t.rel(t, e, n, !1), r && _t.ael(t, e, r, !1);
    else {
      const c = eu(r);
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
}, A4 = /\s/, Sf = (t) => t ? t.split(A4) : [], Id = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || wf, o = e.$attrs$ || wf;
  for (r in i)
    r in o || mf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    mf(s, r, i[r], o[r], n, e.$flags$);
}, nu = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Ae.createTextNode(s.$text$);
  else {
    if (Yt || (Yt = s.$tag$ === "svg"), o = s.$elm$ = Ae.createElementNS(Yt ? h4 : d4, s.$tag$), Yt && s.$tag$ === "foreignObject" && (Yt = !1), Id(null, s, Yt), p4(xi) && o["s-si"] !== xi && o.classList.add(o["s-si"] = xi), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = nu(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Yt = !1 : o.tagName === "foreignObject" && (Yt = !0);
  }
  return o;
}, vd = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Ed && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = nu(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Ld = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, $4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], l = r.length - 1, f = r[0], u = r[l], p;
  for (; s <= o && i <= l; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : u == null ? u = r[--l] : ci(a, f) ? (rs(a, f), a = e[++s], f = r[++i]) : ci(c, u) ? (rs(c, u), c = e[--o], u = r[--l]) : ci(a, u) ? (rs(a, u), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], u = r[--l]) : ci(c, f) ? (rs(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (p = nu(e && e[i], n, i), f = r[++i], p && a.$elm$.parentNode.insertBefore(p, a.$elm$));
  s > o ? vd(t, r[l + 1] == null ? null : r[l + 1].$elm$, n, r, i, l) : i > l && Ld(e, s, o);
}, ci = (t, e) => t.$tag$ === e.$tag$, rs = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Yt = i === "svg" ? !0 : i === "foreignObject" ? !1 : Yt, Id(t, e, Yt), r !== null && s !== null ? $4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), vd(n, null, e, s, 0, s.length - 1)) : r !== null && Ld(r, 0, r.length - 1), Yt && i === "svg" && (Yt = !1)) : t.$text$ !== o && (n.data = o);
}, I4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Wa(null, null), s = y4(e) ? e : V(null, null, e);
  Ed = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, xi = n["s-sc"], rs(r, s);
}, Bd = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, ru = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Bd(t, t.$ancestorComponent$), z4(() => v4(t, e));
}, v4 = (t, e) => {
  const n = Oe("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), M4(s, () => L4(t, r, e));
}, L4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Oe("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && E4(t);
  const o = Oe("render", t.$cmpMeta$.$tagName$);
  B4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => C4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, B4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, I4(t, e);
  } catch (r) {
    bs(r, t.$hostElement$);
  }
  return null;
}, C4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Oe("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Md(n), r(), t.$onReadyResolve$(n), s || Cd()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && iu(() => ru(t, !1)), t.$flags$ &= -517;
}, Cd = (t) => {
  Md(Ae.documentElement), iu(() => x4(yo, "appload", { detail: { namespace: u4 } }));
}, M4 = (t, e) => t && t.then ? t.then(e) : e(), Md = (t) => t.classList.add("hydrated"), H4 = (t, e) => Wr(t).$instanceValues$.get(e), U4 = (t, e, n, r) => {
  const s = Wr(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = b4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), l = n !== i && !c;
  (!(o & 8) || i === void 0) && l && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && ru(s, !1));
}, Hd = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return H4(this, i);
        },
        set(a) {
          U4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        _t.jmp(() => {
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
}, _4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = O4(n), s.then) {
        const c = l4();
        s = await s, c();
      }
      s.isProxied || (Hd(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Oe("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        bs(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = $d(n);
      if (!Oi.has(c)) {
        const l = Oe("registerStyles", n.$tagName$);
        m4(c, a, !!(n.$flags$ & 1)), l();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => ru(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, T4 = (t) => {
  if (!(_t.$flags$ & 1)) {
    const e = Wr(t), n = e.$cmpMeta$, r = Oe("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Bd(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), _4(t, e, n);
    }
    r();
  }
}, N4 = (t) => {
  _t.$flags$ & 1 || Wr(t);
}, P4 = (t, e = {}) => {
  var n;
  const r = Oe(), s = [], i = e.exclude || [], o = yo.customElements, a = Ae.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), l = /* @__PURE__ */ Ae.createElement("style"), f = [];
  let u, p = !0;
  Object.assign(_t, e), _t.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Ae.baseURI).href, t.map((h) => {
    h[1].map((b) => {
      const x = {
        $flags$: b[0],
        $tagName$: b[1],
        $members$: b[2],
        $listeners$: b[3]
      };
      x.$members$ = b[2];
      const g = x.$tagName$, I = class extends HTMLElement {
        // StencilLazyHost
        constructor(L) {
          super(L), L = this, D4(L, x), x.$flags$ & 1 && L.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), p ? f.push(this) : _t.jmp(() => T4(this));
        }
        disconnectedCallback() {
          _t.jmp(() => N4(this));
        }
        componentOnReady() {
          return Wr(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = h[0], !i.includes(g) && !o.get(g) && (s.push(g), o.define(g, Hd(
        I,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    l.innerHTML = s + f4, l.setAttribute("data-styles", "");
    const h = (n = _t.$nonce$) !== null && n !== void 0 ? n : Ad(Ae);
    h != null && l.setAttribute("nonce", h), a.insertBefore(l, c ? c.nextSibling : a.firstChild);
  }
  p = !1, f.length ? f.map((h) => h.connectedCallback()) : _t.jmp(() => u = setTimeout(Cd, 30)), r();
}, su = /* @__PURE__ */ new WeakMap(), Wr = (t) => su.get(t), k4 = (t, e) => su.set(e.$lazyInstance$ = t, e), D4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], su.set(t, n);
}, Ef = (t, e) => e in t, bs = (t, e) => (0, console.error)(t, e), Zo = /* @__PURE__ */ new Map(), O4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Zo.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Zo.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => G6).then(o, bs);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Zo.set(s, o), o[r]), bs);
}, Oi = /* @__PURE__ */ new Map(), yo = typeof window < "u" ? window : {}, Ae = yo.document || { head: {} }, _t = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Ud = (t) => Promise.resolve(t), j4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Af = [], _d = [], F4 = (t, e) => (n) => {
  t.push(n), qa || (qa = !0, _t.$flags$ & 4 ? iu(Ya) : _t.raf(Ya));
}, $f = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      bs(n);
    }
  t.length = 0;
}, Ya = () => {
  $f(Af), $f(_d), (qa = Af.length > 0) && _t.raf(Ya);
}, iu = (t) => Ud().then(t), z4 = /* @__PURE__ */ F4(_d), R4 = () => Ud(), G4 = (t, e) => typeof window > "u" ? Promise.resolve() : R4().then(() => P4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var K4 = Object.defineProperty, V4 = Object.defineProperties, q4 = Object.getOwnPropertyDescriptors, ji = Object.getOwnPropertySymbols, Td = Object.prototype.hasOwnProperty, Nd = Object.prototype.propertyIsEnumerable, If = (t, e, n) => e in t ? K4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, te = (t, e) => {
  for (var n in e || (e = {})) Td.call(e, n) && If(t, n, e[n]);
  if (ji) for (var n of ji(e)) Nd.call(e, n) && If(t, n, e[n]);
  return t;
}, de = (t, e) => V4(t, q4(e)), Pd = (t, e) => {
  var n = {};
  for (var r in t) Td.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ji) for (var r of ji(t)) e.indexOf(r) < 0 && Nd.call(t, r) && (n[r] = t[r]);
  return n;
};
function kd() {
  return co(Kn()) || window.StacksProvider || window.BlockstackProvider;
}
function bo(t) {
  return t ? typeof t == "string" ? qn.fromName(t) : "version" in t ? t : "url" in t ? new Aa({ url: t.url }) : t.transactionVersion === Yn.Mainnet ? new Aa({ url: t.client.baseUrl }) : new $a({ url: t.client.baseUrl }) : new $a();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var W4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(W4 || {}), Y4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Y4 || {}), ou = (t) => {
  let e = t;
  if (!e) {
    let n = new yh(["store_write"], document.location.href);
    e = new Ea({ appConfig: n });
  }
  return e;
};
function Dd(t) {
  try {
    return ou(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Od = (t) => {
  let e = ou(t).loadUserData().appPrivateKey, n = Ut.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function X4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Wn.Mainnet]: "mainnet", [Wn.Testnet]: "testnet" }, a = bo(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function Z4(t) {
  let e = bo(t.network), n = ou(t.userSession), r = de(te({}, t), { network: e, userSession: n });
  return te({ stxAddress: X4(r) }, r);
}
async function Q4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(ld) : n = n.map((r) => K(md(r)))), new Ut.TokenSigner("ES256k", e).signAsync(de(te({}, t), { postConditions: n }));
}
function J4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(ld) : e = e.map((n) => K(md(n)))), Ut.createUnsecuredToken(de(te({}, t), { postConditions: e }));
}
var tE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = st(a.replace(/^0x/, "")), l = GS(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, de(te({}, o), { stacksTransaction: l }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, de(te({}, o), { stacksTransaction: l }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, eE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Pd(e, ["amount", "appDetails", "userSession"]);
  if (Dd(s)) {
    let { privateKey: a, publicKey: c } = Od(s), l = de(te({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (l.appDetails = r), Q4(l, a);
  }
  let o = de(te({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), J4(o);
};
async function nE(t, e, n) {
  let r = await e(de(te(te({}, Z4(t)), t), { network: bo(t.network) }));
  return tE({ token: r, options: t }, n);
}
function rE(t, e = kd()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return nE(t, eE, e);
}
function jd(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? de(te({}, t), { message: Ql(e), domain: Ql(n) }) : de(te({}, t), { message: K(Zn(e)), domain: K(Zn(n)) });
}
async function sE(t, e) {
  return new Ut.TokenSigner("ES256k", e).signAsync(jd(t));
}
async function iE(t) {
  let e = t, { userSession: n } = e, r = Pd(e, ["userSession"]);
  if (Dd(n)) {
    let { privateKey: s, publicKey: i } = Od(n), o = de(te({}, r), { publicKey: i });
    return sE(o, s);
  }
  return Ut.createUnsecuredToken(jd(t));
}
var oE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(oE || {}), Fd = "asigna-stx", vf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Fd && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(cE(t, e), "*");
}), aE = { authenticationRequest: async (t) => vf(t, "authenticationRequest"), transactionRequest: async (t) => vf(t, "transactionRequest") }, cE = (t, e) => ({ source: Fd, [e]: t }), uE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = aE);
};
uE();
var lE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function fE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Kn(), o = kd();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    G4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : lE, c = nx(a), l = document.createElement("connect-modal");
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
var ui = fE(rE);
function An(t, e, n) {
  return au(Ot(t, e), n);
}
function Ot(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = bt(r);
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
      const r = pE(BigInt(`0x${tt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${tt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Lf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function _s(t, e = 8) {
  return (typeof t == "bigint" ? t : Ot(t, !1)).toString(16).padStart(e * 2, "0");
}
function wo(t) {
  return parseInt(t, 16);
}
function au(t, e = 16) {
  const n = _s(t, e);
  return bt(n);
}
function hE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function dE(t, e) {
  return t & BigInt(1) << e;
}
function pE(t, e) {
  return dE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const gE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += gE[n];
  return e;
}
function bt(t) {
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
function Yr(t) {
  return new TextEncoder().encode(t);
}
function cu(t) {
  return new TextDecoder().decode(t);
}
function zd(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function yE(t) {
  return String.fromCharCode.apply(null, t);
}
function bE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Bf(t) {
  if (t.some(bE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function xo(...t) {
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
function It(t) {
  return xo(...t.map((e) => typeof e == "number" ? Bf([e]) : e instanceof Array ? Bf(e) : e));
}
var Cf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Cf || (Cf = {}));
var Mf;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Mf || (Mf = {}));
var Hf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Hf || (Hf = {}));
const Rd = 33, Qo = 32;
function wE(t) {
  if (t.length < Qo * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Qo * 2), r = t.slice(2 + Qo * 2);
  return {
    recoveryId: wo(e),
    r: n,
    s: r
  };
}
function xE(t) {
  const e = typeof t == "string" ? bt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function mE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function SE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function EE(t, e) {
  return t[e];
}
function AE(t, e, n = 0) {
  return t[n] = e, t;
}
function $E(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Qn(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Xa;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Xa || (Xa = {}));
const IE = Xa.Mainnet, vE = 128, LE = 128, Gd = 16, kn = 32, Za = 80, mo = 65, BE = 32, CE = 64, Fi = 34;
var z;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(z || (z = {}));
var Q;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Q || (Q = {}));
var Qa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Qa || (Qa = {}));
var zt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(zt || (zt = {}));
const mi = ["onChainOnly", "offChainOnly", "any"], Uf = {
  [mi[0]]: zt.OnChainOnly,
  [mi[1]]: zt.OffChainOnly,
  [mi[2]]: zt.Any,
  [zt.OnChainOnly]: zt.OnChainOnly,
  [zt.OffChainOnly]: zt.OffChainOnly,
  [zt.Any]: zt.Any
};
function ME(t) {
  if (t in Uf)
    return Uf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${mi.join(", ")}`);
}
var zi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zi || (zi = {}));
zi.Mainnet;
var ws;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ws || (ws = {}));
var Rt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Rt || (Rt = {}));
var Et;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Et || (Et = {}));
var ht;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ht || (ht = {}));
var Ri;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ri || (Ri = {}));
var xt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(xt || (xt = {}));
var xs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(xs || (xs = {}));
var Ja;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Ja || (Ja = {}));
var ms;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ms || (ms = {}));
var _f;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(_f || (_f = {}));
var Tf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Tf || (Tf = {}));
function tc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function HE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Kd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function UE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  tc(t.outputLen), tc(t.blockLen);
}
function _E(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function TE(t, e) {
  Kd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Tn = {
  number: tc,
  bool: HE,
  bytes: Kd,
  hash: UE,
  exists: _E,
  output: TE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), we = (t, e) => t << 32 - e | t >>> e, NE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!NE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function PE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function uu(t) {
  if (typeof t == "string" && (t = PE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Vd {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ur(t) {
  const e = (r) => t().update(uu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function kE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
class lu extends Vd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Jo(this.buffer);
  }
  update(e) {
    Tn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = uu(e);
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
    Tn.exists(this), Tn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    kE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
}
const DE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), qd = Uint8Array.from({ length: 16 }, (t, e) => e), OE = qd.map((t) => (9 * t + 5) % 16);
let fu = [qd], hu = [OE];
for (let t = 0; t < 4; t++)
  for (let e of [fu, hu])
    e.push(e[t].map((n) => DE[n]));
const Wd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), jE = fu.map((t, e) => t.map((n) => Wd[e][n])), FE = hu.map((t, e) => t.map((n) => Wd[e][n])), zE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), RE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), li = (t, e) => t << e | t >>> 32 - e;
function Nf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fi = new Uint32Array(16);
class GE extends lu {
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
      const b = 4 - h, x = zE[h], g = RE[h], I = fu[h], L = hu[h], y = jE[h], A = FE[h];
      for (let m = 0; m < 16; m++) {
        const B = li(r + Nf(h, i, a, l) + fi[I[m]] + x, y[m]) + u | 0;
        r = u, u = l, l = li(a, 10) | 0, a = i, i = B;
      }
      for (let m = 0; m < 16; m++) {
        const B = li(s + Nf(b, o, c, f) + fi[L[m]] + g, A[m]) + p | 0;
        s = p, p = f, f = li(c, 10) | 0, c = o, o = B;
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
}
const KE = ur(() => new GE()), VE = (t, e, n) => t & e ^ ~t & n, qE = (t, e, n) => t & e ^ t & n ^ e & n, WE = new Uint32Array([
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
]), ln = new Uint32Array(64);
class Yd extends lu {
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
      ln[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = ln[u - 15], h = ln[u - 2], b = we(p, 7) ^ we(p, 18) ^ p >>> 3, x = we(h, 17) ^ we(h, 19) ^ h >>> 10;
      ln[u] = x + ln[u - 7] + b + ln[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = we(a, 6) ^ we(a, 11) ^ we(a, 25), h = f + p + VE(a, c, l) + WE[u] + ln[u] | 0, x = (we(r, 2) ^ we(r, 13) ^ we(r, 22)) + qE(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    ln.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class YE extends Yd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const du = ur(() => new Yd());
ur(() => new YE());
const hi = BigInt(2 ** 32 - 1), ec = BigInt(32);
function Xd(t, e = !1) {
  return e ? { h: Number(t & hi), l: Number(t >> ec & hi) } : { h: Number(t >> ec & hi) | 0, l: Number(t & hi) | 0 };
}
function XE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Xd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const ZE = (t, e) => BigInt(t >>> 0) << ec | BigInt(e >>> 0), QE = (t, e, n) => t >>> n, JE = (t, e, n) => t << 32 - n | e >>> n, t8 = (t, e, n) => t >>> n | e << 32 - n, e8 = (t, e, n) => t << 32 - n | e >>> n, n8 = (t, e, n) => t << 64 - n | e >>> n - 32, r8 = (t, e, n) => t >>> n - 32 | e << 64 - n, s8 = (t, e) => e, i8 = (t, e) => t, o8 = (t, e, n) => t << n | e >>> 32 - n, a8 = (t, e, n) => e << n | t >>> 32 - n, c8 = (t, e, n) => e << n - 32 | t >>> 64 - n, u8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function l8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const f8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), h8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, d8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), p8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, g8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), y8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Z = {
  fromBig: Xd,
  split: XE,
  toBig: ZE,
  shrSH: QE,
  shrSL: JE,
  rotrSH: t8,
  rotrSL: e8,
  rotrBH: n8,
  rotrBL: r8,
  rotr32H: s8,
  rotr32L: i8,
  rotlSH: o8,
  rotlSL: a8,
  rotlBH: c8,
  rotlBL: u8,
  add: l8,
  add3L: f8,
  add3H: h8,
  add4L: d8,
  add4H: p8,
  add5H: y8,
  add5L: g8
}, [b8, w8] = Z.split([
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
].map((t) => BigInt(t))), fn = new Uint32Array(80), hn = new Uint32Array(80);
class So extends lu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: b, Hh: x, Hl: g } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, b, x, g];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, b, x, g) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = x | 0, this.Hl = g | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      fn[y] = e.getUint32(n), hn[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const A = fn[y - 15] | 0, m = hn[y - 15] | 0, B = Z.rotrSH(A, m, 1) ^ Z.rotrSH(A, m, 8) ^ Z.shrSH(A, m, 7), D = Z.rotrSL(A, m, 1) ^ Z.rotrSL(A, m, 8) ^ Z.shrSL(A, m, 7), _ = fn[y - 2] | 0, k = hn[y - 2] | 0, w = Z.rotrSH(_, k, 19) ^ Z.rotrBH(_, k, 61) ^ Z.shrSH(_, k, 6), $ = Z.rotrSL(_, k, 19) ^ Z.rotrBL(_, k, 61) ^ Z.shrSL(_, k, 6), T = Z.add4L(D, $, hn[y - 7], hn[y - 16]), j = Z.add4H(T, B, w, fn[y - 7], fn[y - 16]);
      fn[y] = j | 0, hn[y] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: b, Gh: x, Gl: g, Hh: I, Hl: L } = this;
    for (let y = 0; y < 80; y++) {
      const A = Z.rotrSH(u, p, 14) ^ Z.rotrSH(u, p, 18) ^ Z.rotrBH(u, p, 41), m = Z.rotrSL(u, p, 14) ^ Z.rotrSL(u, p, 18) ^ Z.rotrBL(u, p, 41), B = u & h ^ ~u & x, D = p & b ^ ~p & g, _ = Z.add5L(L, m, D, w8[y], hn[y]), k = Z.add5H(_, I, A, B, b8[y], fn[y]), w = _ | 0, $ = Z.rotrSH(r, s, 28) ^ Z.rotrBH(r, s, 34) ^ Z.rotrBH(r, s, 39), T = Z.rotrSL(r, s, 28) ^ Z.rotrBL(r, s, 34) ^ Z.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, G = s & o ^ s & c ^ o & c;
      I = x | 0, L = g | 0, x = h | 0, g = b | 0, h = u | 0, b = p | 0, { h: u, l: p } = Z.add(l | 0, f | 0, k | 0, w | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const M = Z.add3L(w, T, G);
      r = Z.add3H(M, k, $, j), s = M | 0;
    }
    ({ h: r, l: s } = Z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Z.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Z.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = Z.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = Z.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: b } = Z.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: x, l: g } = Z.add(this.Gh | 0, this.Gl | 0, x | 0, g | 0), { h: I, l: L } = Z.add(this.Hh | 0, this.Hl | 0, I | 0, L | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, b, x, g, I, L);
  }
  roundClean() {
    fn.fill(0), hn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class x8 extends So {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class m8 extends So {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class S8 extends So {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ur(() => new So());
ur(() => new x8());
const E8 = ur(() => new m8());
ur(() => new S8());
function Zd(t) {
  if (bt(t).byteLength != mo)
    throw Error("Invalid signature");
  return {
    type: z.MessageSignature,
    data: t
  };
}
function ss(t, e) {
  return { type: z.Address, version: t, hash160: e };
}
function us(t) {
  return or.c32address(t.version, t.hash160);
}
function Jn(t, e, n) {
  const r = e || 1, s = n || vE;
  if (fp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: z.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function pu(t) {
  const e = or.c32addressDecode(t);
  return {
    type: z.Address,
    version: e[0],
    hash160: e[1]
  };
}
var H;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(H || (H = {}));
function A8(t) {
  if (t.type === H.PrincipalStandard)
    return us(t.address);
  if (t.type === H.PrincipalContract)
    return `${us(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function $8(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return L8(e, n);
  } else
    return I8(t);
}
function I8(t) {
  const e = pu(t);
  return { type: H.PrincipalStandard, address: e };
}
function v8(t) {
  return { type: H.PrincipalStandard, address: t };
}
function L8(t, e) {
  const n = pu(t), r = Jn(e);
  return Qd(n, r);
}
function Qd(t, e) {
  if (Yr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: H.PrincipalContract, address: t, contractName: e };
}
function ta(t, e = !1) {
  switch (t.type) {
    case H.BoolTrue:
      return !0;
    case H.BoolFalse:
      return !1;
    case H.Int:
    case H.UInt:
      return e ? t.value.toString() : t.value;
    case H.Buffer:
      return `0x${tt(t.buffer)}`;
    case H.OptionalNone:
      return null;
    case H.OptionalSome:
      return yn(t.value);
    case H.ResponseErr:
      return yn(t.value);
    case H.ResponseOk:
      return yn(t.value);
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return A8(t);
    case H.List:
      return t.list.map((r) => yn(r));
    case H.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = yn(t.data[r]);
      }), n;
    case H.StringASCII:
      return t.data;
    case H.StringUTF8:
      return t.data;
  }
}
function yn(t) {
  switch (t.type) {
    case H.ResponseErr:
      return { type: bn(t), value: ta(t, !0), success: !1 };
    case H.ResponseOk:
      return { type: bn(t), value: ta(t, !0), success: !0 };
    default:
      return { type: bn(t), value: ta(t, !0) };
  }
}
function bn(t) {
  switch (t.type) {
    case H.BoolTrue:
    case H.BoolFalse:
      return "bool";
    case H.Int:
      return "int";
    case H.UInt:
      return "uint";
    case H.Buffer:
      return `(buff ${t.buffer.length})`;
    case H.OptionalNone:
      return "(optional none)";
    case H.OptionalSome:
      return `(optional ${bn(t.value)})`;
    case H.ResponseErr:
      return `(response UnknownType ${bn(t.value)})`;
    case H.ResponseOk:
      return `(response ${bn(t.value)} UnknownType)`;
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return "principal";
    case H.List:
      return `(list ${t.list.length} ${t.list.length ? bn(t.list[0]) : "UnknownType"})`;
    case H.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${bn(t.data[e])})`).join(" ")})`;
    case H.StringASCII:
      return `(string-ascii ${zd(t.data).length})`;
    case H.StringUTF8:
      return `(string-utf8 ${Yr(t.data).length})`;
  }
}
const B8 = () => ({ type: H.BoolTrue }), C8 = () => ({ type: H.BoolFalse }), Pf = BigInt("0xffffffffffffffffffffffffffffffff"), M8 = BigInt(0), kf = BigInt("0x7fffffffffffffffffffffffffffffff"), Df = BigInt("-170141183460469231731687303715884105728"), H8 = (t) => {
  const e = Ot(t, !0);
  if (e > kf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${kf}`);
  if (e < Df)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Df}`);
  return { type: H.Int, value: e };
}, Gi = (t) => {
  const e = Ot(t, !1);
  if (e < M8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Pf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Pf}`);
  return { type: H.UInt, value: e };
}, Jd = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: H.Buffer, buffer: t };
};
function tp() {
  return { type: H.OptionalNone };
}
function ep(t) {
  return { type: H.OptionalSome, value: t };
}
function U8(t) {
  return { type: H.ResponseErr, value: t };
}
function _8(t) {
  return { type: H.ResponseOk, value: t };
}
function T8(t) {
  return { type: H.List, list: t };
}
function nc(t) {
  for (const e in t)
    if (!AA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: H.Tuple, data: t };
}
const xr = (t) => ({ type: H.StringASCII, data: t }), N8 = (t) => ({ type: H.StringUTF8, data: t });
class np extends Vd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Tn.hash(e);
    const r = uu(n);
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
    return Tn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Tn.exists(this), Tn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const rp = (t, e, n) => new np(t, e).update(n).digest();
rp.create = (t, e) => new np(t, e);
At.hmacSha256Sync = (t, ...e) => {
  const n = rp.create(du, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Or(t) {
  return {
    type: z.PublicKey,
    data: bt(t)
  };
}
function P8(t, e, n = xt.Compressed) {
  const r = wE(e.data), s = new Qt(Lf(r.r), Lf(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === xt.Compressed;
  return i.toHex(o);
}
function k8(t) {
  return { type: z.PublicKey, data: t };
}
function Xr(t) {
  return !tt(t.data).startsWith("04");
}
function Ki(t) {
  return t.data.slice();
}
function D8(t) {
  const e = F8(t), n = Bs(e.data.slice(0, 32), e.compressed);
  return Or(tt(n));
}
function O8(t) {
  const e = typeof t == "string" ? t : tt(t), n = J.fromHex(e).toHex(!0);
  return Or(n);
}
function j8(t) {
  const e = typeof t == "string" ? t : tt(t), n = J.fromHex(e).toHex(!1);
  return Or(n);
}
function rc(t) {
  const e = t.readUInt8(), n = e === 4 ? CE : BE;
  return k8(It([e, t.readBytes(n)]));
}
function F8(t) {
  const e = xE(t), n = e.length == Rd;
  return { data: e, compressed: n };
}
function z8(t, e) {
  const [n, r] = Qi(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = _s(r, 1) + Qt.fromHex(n).toCompactHex();
  return Zd(i);
}
function R8(t) {
  return D8(t.data);
}
function G8(t, e, n) {
  return typeof t == "string" && (t = $8(t)), typeof n == "string" && (n = Ff(n)), {
    type: z.Payload,
    payloadType: Q.TokenTransfer,
    recipient: t,
    amount: Ot(e, !1),
    memo: n ?? Ff("")
  };
}
function K8(t, e, n, r) {
  return typeof t == "string" && (t = pu(t)), typeof e == "string" && (e = Jn(e)), typeof n == "string" && (n = Jn(n)), {
    type: z.Payload,
    payloadType: Q.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Of(t, e, n) {
  return typeof t == "string" && (t = Jn(t)), typeof e == "string" && (e = tA(e)), typeof n == "number" ? {
    type: z.Payload,
    payloadType: Q.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: z.Payload,
    payloadType: Q.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function V8() {
  return { type: z.Payload, payloadType: Q.PoisonMicroblock };
}
function jf(t, e) {
  if (t.byteLength != kn)
    throw Error(`Coinbase buffer size must be ${kn} bytes`);
  return e != null ? {
    type: z.Payload,
    payloadType: Q.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: z.Payload,
    payloadType: Q.Coinbase,
    coinbaseBytes: t
  };
}
function q8(t, e, n) {
  if (t.byteLength != kn)
    throw Error(`Coinbase buffer size must be ${kn} bytes`);
  if (n.byteLength != Za)
    throw Error(`VRF proof buffer size must be ${Za} bytes`);
  return {
    type: z.Payload,
    payloadType: Q.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === H.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var sc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(sc || (sc = {}));
function W8(t, e, n, r, s, i, o) {
  return {
    type: z.Payload,
    payloadType: Q.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function sp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Q.TokenTransfer:
      e.push(Ht(t.recipient)), e.push(An(t.amount, !1, 8)), e.push(Te(t.memo));
      break;
    case Q.ContractCall:
      e.push(Te(t.contractAddress)), e.push(Te(t.contractName)), e.push(Te(t.functionName));
      const n = new Uint8Array(4);
      Qn(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ht(r));
      });
      break;
    case Q.SmartContract:
      e.push(Te(t.contractName)), e.push(Te(t.codeBody));
      break;
    case Q.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Te(t.contractName)), e.push(Te(t.codeBody));
      break;
    case Q.PoisonMicroblock:
      break;
    case Q.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Q.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ht(t.recipient));
      break;
    case Q.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ht(t.recipient ? ep(t.recipient) : tp())), e.push(t.vrfProof);
      break;
    case Q.TenureChange:
      e.push(bt(t.tenureHash)), e.push(bt(t.previousTenureHash)), e.push(bt(t.burnViewHash)), e.push(bt(t.previousTenureEnd)), e.push(Qn(new Uint8Array(4), t.previousTenureBlocks)), e.push(AE(new Uint8Array(1), t.cause)), e.push(bt(t.publicKeyHash));
      break;
  }
  return It(e);
}
function Y8(t) {
  switch (t.readUInt8Enum(Q, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Q.TokenTransfer:
      const n = le(t), r = Ot(t.readBytes(8), !1), s = op(t);
      return G8(n, r, s);
    case Q.ContractCall:
      const i = jr(t), o = se(t), a = se(t), c = [], l = t.readUInt32BE();
      for (let y = 0; y < l; y++) {
        const A = le(t);
        c.push(A);
      }
      return K8(i, o, a, c);
    case Q.SmartContract:
      const f = se(t), u = se(t, 4, 1e5);
      return Of(f, u);
    case Q.VersionedSmartContract: {
      const y = t.readUInt8Enum(Qa, (B) => {
        throw new Error(`Cannot recognize ClarityVersion: ${B}`);
      }), A = se(t), m = se(t, 4, 1e5);
      return Of(A, m, y);
    }
    case Q.PoisonMicroblock:
      return V8();
    case Q.Coinbase: {
      const y = t.readBytes(kn);
      return jf(y);
    }
    case Q.CoinbaseToAltRecipient: {
      const y = t.readBytes(kn), A = le(t);
      return jf(y, A);
    }
    case Q.NakamotoCoinbase: {
      const y = t.readBytes(kn), A = le(t), m = t.readBytes(Za);
      return q8(y, A, m);
    }
    case Q.TenureChange:
      const p = tt(t.readBytes(20)), h = tt(t.readBytes(20)), b = tt(t.readBytes(20)), x = tt(t.readBytes(32)), g = t.readUInt32BE(), I = t.readUInt8Enum(sc, (y) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${y}`);
      }), L = tt(t.readBytes(20));
      return W8(p, h, b, x, g, I, L);
  }
}
class Eo extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Cn extends Eo {
  constructor(e) {
    super(e);
  }
}
class Zt extends Eo {
  constructor(e) {
    super(e);
  }
}
class Vi extends Eo {
  constructor(e) {
    super(e);
  }
}
class Nn extends Eo {
  constructor(e) {
    super(e);
  }
}
var ue;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ue || (ue = {}));
function ic(t) {
  return Zd(tt(t.readBytes(mo)));
}
function Ar(t, e) {
  return {
    pubKeyEncoding: t,
    type: z.TransactionAuthField,
    contents: e
  };
}
function X8(t) {
  const e = t.readUInt8Enum(ue, (n) => {
    throw new Zt(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case ue.PublicKeyCompressed:
      return Ar(xt.Compressed, rc(t));
    case ue.PublicKeyUncompressed:
      return Ar(xt.Uncompressed, j8(rc(t).data));
    case ue.SignatureCompressed:
      return Ar(xt.Compressed, ic(t));
    case ue.SignatureUncompressed:
      return Ar(xt.Uncompressed, ic(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function gu(t) {
  return bt(t.data);
}
function Z8(t) {
  const e = [];
  switch (t.contents.type) {
    case z.PublicKey:
      e.push(t.pubKeyEncoding === xt.Compressed ? ue.PublicKeyCompressed : ue.PublicKeyUncompressed), e.push(Ki(O8(t.contents.data)));
      break;
    case z.MessageSignature:
      e.push(t.pubKeyEncoding === xt.Compressed ? ue.SignatureCompressed : ue.SignatureUncompressed), e.push(gu(t.contents));
      break;
  }
  return It(e);
}
function Te(t) {
  switch (t.type) {
    case z.Address:
      return Ts(t);
    case z.Principal:
      return ip(t);
    case z.LengthPrefixedString:
      return Fr(t);
    case z.MemoString:
      return eA(t);
    case z.AssetInfo:
      return ap(t);
    case z.PostCondition:
      return nA(t);
    case z.PublicKey:
      return Ki(t);
    case z.LengthPrefixedList:
      return wu(t);
    case z.Payload:
      return sp(t);
    case z.TransactionAuthField:
      return Z8(t);
    case z.MessageSignature:
      return gu(t);
  }
}
function Q8() {
  return {
    type: z.Address,
    version: Ri.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function yu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ht.SerializeP2PKH || e === ht.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ht.SerializeP2WPKH || e === ht.SerializeP2WSH || e === ht.SerializeP2WSHNonSequential) && !r.every(Xr))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ht.SerializeP2PKH:
      return ss(t, xA(r[0].data));
    case ht.SerializeP2WPKH:
      return ss(t, mA(r[0].data));
    case ht.SerializeP2SH:
    case ht.SerializeP2SHNonSequential:
      return ss(t, SA(n, r.map(Ki)));
    case ht.SerializeP2WSH:
    case ht.SerializeP2WSHNonSequential:
      return ss(t, EA(n, r.map(Ki)));
  }
}
function Ts(t) {
  const e = [];
  return e.push(bt(_s(t.version, 1))), e.push(bt(t.hash160)), It(e);
}
function jr(t) {
  const e = wo(tt(t.readBytes(1))), n = tt(t.readBytes(20));
  return { type: z.Address, version: e, hash160: n };
}
function ip(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ts(t.address)), t.prefix === ms.Contract && e.push(Fr(t.contractName)), It(e);
}
function J8(t) {
  const e = t.readUInt8Enum(ms, (s) => {
    throw new Zt(`Unexpected Principal payload type: ${s}`);
  }), n = jr(t);
  if (e === ms.Standard)
    return { type: z.Principal, prefix: e, address: n };
  const r = se(t);
  return {
    type: z.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Fr(t) {
  const e = [], n = Yr(t.content), r = n.byteLength;
  return e.push(bt(_s(r, t.lengthPrefixBytes))), e.push(n), It(e);
}
function se(t, e, n) {
  e = e || 1;
  const r = wo(tt(t.readBytes(e))), s = cu(t.readBytes(r));
  return Jn(s, e, n ?? 128);
}
function tA(t) {
  return Jn(t, 4, 1e5);
}
function Ff(t) {
  if (t && fp(t, Fi))
    throw new Error(`Memo exceeds maximum length of ${Fi} bytes`);
  return { type: z.MemoString, content: t };
}
function eA(t) {
  const e = [], n = Yr(t.content), r = wA(tt(n), Fi * 2);
  return e.push(bt(r)), It(e);
}
function op(t) {
  let e = cu(t.readBytes(Fi));
  return e = e.replace(/\u0000*$/, ""), { type: z.MemoString, content: e };
}
function ap(t) {
  const e = [];
  return e.push(Ts(t.address)), e.push(Fr(t.contractName)), e.push(Fr(t.assetName)), It(e);
}
function oc(t) {
  return {
    type: z.AssetInfo,
    address: jr(t),
    contractName: se(t),
    assetName: se(t)
  };
}
function bu(t, e) {
  return {
    type: z.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function wu(t) {
  const e = t.values, n = [];
  n.push(bt(_s(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Te(r));
  return It(n);
}
function cp(t, e, n) {
  const r = wo(tt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case z.Address:
        s.push(jr(t));
        break;
      case z.LengthPrefixedString:
        s.push(se(t));
        break;
      case z.MemoString:
        s.push(op(t));
        break;
      case z.AssetInfo:
        s.push(oc(t));
        break;
      case z.PostCondition:
        s.push(rA(t));
        break;
      case z.PublicKey:
        s.push(rc(t));
        break;
      case z.TransactionAuthField:
        s.push(X8(t));
        break;
    }
  return bu(s, n);
}
function nA(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ip(t.principal)), (t.conditionType === Rt.Fungible || t.conditionType === Rt.NonFungible) && e.push(ap(t.assetInfo)), t.conditionType === Rt.NonFungible && e.push(Ht(t.assetName)), e.push(t.conditionCode), t.conditionType === Rt.STX || t.conditionType === Rt.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Cn("The post-condition amount may not be larger than 8 bytes");
    e.push(An(t.amount, !1, 8));
  }
  return It(e);
}
function rA(t) {
  const e = t.readUInt8Enum(Rt, (o) => {
    throw new Zt(`Could not read ${o} as PostConditionType`);
  }), n = J8(t);
  let r, s, i;
  switch (e) {
    case Rt.STX:
      return r = t.readUInt8Enum(xs, (a) => {
        throw new Zt(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${tt(t.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Rt.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Rt.Fungible:
      return s = oc(t), r = t.readUInt8Enum(xs, (a) => {
        throw new Zt(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${tt(t.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Rt.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Rt.NonFungible:
      s = oc(t);
      const o = le(t);
      return r = t.readUInt8Enum(Ja, (a) => {
        throw new Zt(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: z.PostCondition,
        conditionType: Rt.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Be(t, e) {
  return It([t, e]);
}
function sA(t) {
  return new Uint8Array([t.type]);
}
function iA(t) {
  return t.type === H.OptionalNone ? new Uint8Array([t.type]) : Be(t.type, Ht(t.value));
}
function oA(t) {
  const e = new Uint8Array(4);
  return Qn(e, t.buffer.length, 0), Be(t.type, xo(e, t.buffer));
}
function aA(t) {
  const e = au(hE(t.value, BigInt(LE)), Gd);
  return Be(t.type, e);
}
function cA(t) {
  const e = au(t.value, Gd);
  return Be(t.type, e);
}
function uA(t) {
  return Be(t.type, Ts(t.address));
}
function lA(t) {
  return Be(t.type, xo(Ts(t.address), Fr(t.contractName)));
}
function fA(t) {
  return Be(t.type, Ht(t.value));
}
function hA(t) {
  const e = [], n = new Uint8Array(4);
  Qn(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ht(r);
    e.push(s);
  }
  return Be(t.type, It(e));
}
function dA(t) {
  const e = [], n = new Uint8Array(4);
  Qn(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Jn(s);
    e.push(Fr(i));
    const o = Ht(t.data[s]);
    e.push(o);
  }
  return Be(t.type, It(e));
}
function up(t, e) {
  const n = [], r = e == "ascii" ? zd(t.data) : Yr(t.data), s = new Uint8Array(4);
  return Qn(s, r.length, 0), n.push(s), n.push(r), Be(t.type, It(n));
}
function pA(t) {
  return up(t, "ascii");
}
function gA(t) {
  return up(t, "utf8");
}
function Ht(t) {
  switch (t.type) {
    case H.BoolTrue:
    case H.BoolFalse:
      return sA(t);
    case H.OptionalNone:
    case H.OptionalSome:
      return iA(t);
    case H.Buffer:
      return oA(t);
    case H.UInt:
      return cA(t);
    case H.Int:
      return aA(t);
    case H.PrincipalStandard:
      return uA(t);
    case H.PrincipalContract:
      return lA(t);
    case H.ResponseOk:
    case H.ResponseErr:
      return fA(t);
    case H.List:
      return hA(t);
    case H.Tuple:
      return dA(t);
    case H.StringASCII:
      return pA(t);
    case H.StringUTF8:
      return gA(t);
    default:
      throw new Cn("Unable to serialize. Invalid Clarity Value.");
  }
}
function yA(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const zf = /* @__PURE__ */ new Map();
function lp(t, e) {
  const n = zf.get(t);
  if (n !== void 0)
    return n(e);
  const r = yA(t);
  return zf.set(t, r), lp(t, e);
}
class ls {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return $E(this.readBytes(4), 0);
  }
  readUInt8() {
    return EE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return mE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = tt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = tt(n);
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
    if (lp(e, r))
      return r;
    throw n(r);
  }
}
function le(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ls(bt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ls(t) : e = t;
  switch (e.readUInt8Enum(H, (r) => {
    throw new Zt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case H.Int:
      return H8(e.readBytes(16));
    case H.UInt:
      return Gi(e.readBytes(16));
    case H.Buffer:
      const r = e.readUInt32BE();
      return Jd(e.readBytes(r));
    case H.BoolTrue:
      return B8();
    case H.BoolFalse:
      return C8();
    case H.PrincipalStandard:
      const s = jr(e);
      return v8(s);
    case H.PrincipalContract:
      const i = jr(e), o = se(e);
      return Qd(i, o);
    case H.ResponseOk:
      return _8(le(e));
    case H.ResponseErr:
      return U8(le(e));
    case H.OptionalNone:
      return tp();
    case H.OptionalSome:
      return ep(le(e));
    case H.List:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(le(e));
      return T8(c);
    case H.Tuple:
      const l = e.readUInt32BE(), f = {};
      for (let x = 0; x < l; x++) {
        const g = se(e).content;
        if (g === void 0)
          throw new Zt('"content" is undefined');
        f[g] = le(e);
      }
      return nc(f);
    case H.StringASCII:
      const u = e.readUInt32BE(), p = yE(e.readBytes(u));
      return xr(p);
    case H.StringUTF8:
      const h = e.readUInt32BE(), b = cu(e.readBytes(h));
      return N8(b);
    default:
      throw new Zt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const bA = (t) => t.length % 2 == 0 ? t : `0${t}`, wA = (t, e) => t.padEnd(e, "0"), fp = (t, e) => t ? Yr(t).length > e : !1;
function ac(t) {
  return _0(t);
}
const Ss = (t) => KE(du(t)), xu = (t) => tt(E8(t)), xA = (t) => tt(Ss(t)), mA = (t) => {
  const e = Ss(t), n = xo(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ss(n);
  return tt(r);
}, SA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = It(n), s = Ss(r);
  return tt(s);
}, EA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = It(n), s = du(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = It(i), a = Ss(o);
  return tt(a);
};
function AA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function $A(t) {
  const e = Ht(t);
  return `0x${tt(e)}`;
}
const Si = (t) => {
  try {
    return or.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function mu() {
  return {
    type: z.MessageSignature,
    data: tt(new Uint8Array(mo))
  };
}
function hp(t, e, n, r) {
  const s = yu(0, t, 1, [Or(e)]).hash160, i = Xr(Or(e)) ? xt.Compressed : xt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ot(n, !1),
    fee: Ot(r, !1),
    keyEncoding: i,
    signature: mu()
  };
}
function Es(t) {
  return "signature" in t;
}
function Rf(t) {
  return t === ht.SerializeP2SH || t === ht.SerializeP2WSH;
}
function IA(t) {
  return t === ht.SerializeP2SHNonSequential || t === ht.SerializeP2WSHNonSequential;
}
function Gf(t) {
  const e = ac(t);
  return e.nonce = 0, e.fee = 0, Es(e) ? e.signature = mu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function vA(t) {
  const e = [
    t.hashMode,
    bt(t.signer),
    An(t.nonce, !1, 8),
    An(t.fee, !1, 8),
    t.keyEncoding,
    gu(t.signature)
  ];
  return It(e);
}
function LA(t) {
  const e = [
    t.hashMode,
    bt(t.signer),
    An(t.nonce, !1, 8),
    An(t.fee, !1, 8)
  ], n = bu(t.fields);
  e.push(wu(n));
  const r = new Uint8Array(2);
  return SE(r, t.signaturesRequired, 0), e.push(r), It(e);
}
function BA(t, e) {
  const n = tt(e.readBytes(20)), r = BigInt(`0x${tt(e.readBytes(8))}`), s = BigInt(`0x${tt(e.readBytes(8))}`), i = e.readUInt8Enum(xt, (a) => {
    throw new Zt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ht.SerializeP2WPKH && i != xt.Compressed)
    throw new Zt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = ic(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function CA(t, e) {
  const n = tt(e.readBytes(20)), r = BigInt("0x" + tt(e.readBytes(8))), s = BigInt("0x" + tt(e.readBytes(8))), i = cp(e, z.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case z.PublicKey:
        Xr(l.contents) || (o = !0);
        break;
      case z.MessageSignature:
        if (l.pubKeyEncoding === xt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Nn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ht.SerializeP2WSH || t === ht.SerializeP2WSHNonSequential))
    throw new Nn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ea(t) {
  return Es(t) ? vA(t) : LA(t);
}
function na(t) {
  const e = t.readUInt8Enum(ht, (n) => {
    throw new Zt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ht.SerializeP2PKH || e === ht.SerializeP2WPKH ? BA(e, t) : CA(e, t);
}
function dp(t, e, n, r) {
  const i = t + tt(new Uint8Array([e])) + tt(An(n, !1, 8)) + tt(An(r, !1, 8));
  if (bt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return xu(bt(i));
}
function pp(t, e, n) {
  const r = 33 + mo, s = Xr(e) ? xt.Compressed : xt.Uncompressed, i = t + bA(s.toString(16)) + n.data, o = bt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return xu(o);
}
function MA(t, e, n, r, s) {
  const i = dp(t, e, n, r), o = z8(s, i), a = R8(s), c = pp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function gp(t, e, n, r, s, i) {
  const o = dp(t, e, n, r), a = Or(P8(o, i, s)), c = pp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function HA() {
  const t = hp(ht.SerializeP2PKH, "", 0, 0);
  return t.signer = Q8().hash160, t.keyEncoding = xt.Compressed, t.signature = mu(), t;
}
function Kf(t, e, n) {
  return Es(t) ? UA(t, e, n) : _A(t, e, n);
}
function UA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = gp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = yu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Nn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function _A(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case z.PublicKey:
        Xr(c.contents) || (i = !0), r.push(c.contents);
        break;
      case z.MessageSignature:
        c.pubKeyEncoding === xt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = gp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Rf(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new Nn("Too many signatures");
        break;
    }
  if (Rf(t.hashMode) && o !== t.signaturesRequired || IA(t.hashMode) && o < t.signaturesRequired)
    throw new Nn("Incorrect number of signatures");
  if (i && (t.hashMode === ht.SerializeP2WSH || t.hashMode === ht.SerializeP2WSHNonSequential))
    throw new Nn("Uncompressed keys are not allowed in this hash mode");
  const a = yu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Nn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function yp(t) {
  return {
    authType: Et.Standard,
    spendingCondition: t
  };
}
function bp(t, e) {
  return {
    authType: Et.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || hp(ht.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Vf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Et.Standard:
        return yp(Gf(t.spendingCondition));
      case Et.Sponsored:
        return bp(Gf(t.spendingCondition), HA());
      default:
        throw new Vi("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function TA(t, e) {
  switch (t.authType) {
    case Et.Standard:
      return Kf(t.spendingCondition, e, Et.Standard);
    case Et.Sponsored:
      return Kf(t.spendingCondition, e, Et.Standard);
    default:
      throw new Vi("Invalid origin auth type");
  }
}
function NA(t, e) {
  switch (t.authType) {
    case Et.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ot(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Et.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ot(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function PA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ot(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function kA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ot(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function DA(t, e) {
  const n = {
    ...e,
    nonce: Ot(e.nonce, !1),
    fee: Ot(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function OA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Et.Standard:
      e.push(ea(t.spendingCondition));
      break;
    case Et.Sponsored:
      e.push(ea(t.spendingCondition)), e.push(ea(t.sponsorSpendingCondition));
      break;
  }
  return It(e);
}
function jA(t) {
  const e = t.readUInt8Enum(Et, (r) => {
    throw new Zt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Et.Standard:
      return n = na(t), yp(n);
    case Et.Sponsored:
      n = na(t);
      const r = na(t);
      return bp(n, r);
  }
}
class FA {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ot(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? IE, this.postConditionMode = i ?? ws.Deny, this.postConditions = s ?? bu([]), o)
      this.anchorMode = ME(o);
    else
      switch (r.payloadType) {
        case Q.Coinbase:
        case Q.CoinbaseToAltRecipient:
        case Q.NakamotoCoinbase:
        case Q.PoisonMicroblock:
        case Q.TenureChange:
          this.anchorMode = zt.OnChainOnly;
          break;
        case Q.ContractCall:
        case Q.SmartContract:
        case Q.VersionedSmartContract:
        case Q.TokenTransfer:
          this.anchorMode = zt.Any;
          break;
      }
  }
  signBegin() {
    const e = ac(this);
    return e.auth = Vf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = ac(this);
    return e.auth = Vf(e.auth), e.txid();
  }
  verifyOrigin() {
    return TA(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Et.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Et.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Et.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Es(n)) {
      const r = Xr(e);
      n.fields.push(Ar(r ? xt.Compressed : xt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = MA(n, r, e.fee, e.nonce, s);
    return Es(e) ? e.signature = i : e.fields.push(Ar(s.data.byteLength === Rd ? xt.Compressed : xt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return xu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Et.Sponsored)
      throw new Vi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = DA(this.auth, e);
  }
  setFee(e) {
    this.auth = NA(this.auth, e);
  }
  setNonce(e) {
    this.auth = PA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Et.Sponsored)
      throw new Vi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = kA(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Cn('"version" is undefined');
    if (this.chainId === void 0)
      throw new Cn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Cn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Cn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Cn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Qn(n, this.chainId, 0), e.push(n), e.push(OA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(wu(this.postConditions)), e.push(sp(this.payload)), It(e);
  }
}
function Su(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ls(bt(t.slice(2))) : e = new ls(bt(t)) : t instanceof Uint8Array ? e = new ls(t) : e = t;
  const n = e.readUInt8Enum(zi, (l) => {
    throw new Error(`Could not parse ${l} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = jA(e), i = e.readUInt8Enum(zt, (l) => {
    throw new Error(`Could not parse ${l} as AnchorMode`);
  }), o = e.readUInt8Enum(ws, (l) => {
    throw new Error(`Could not parse ${l} as PostConditionMode`);
  }), a = cp(e, z.PostCondition), c = Y8(e);
  return new FA(n, s, c, a, o, i, r);
}
const qi = Gi, zA = Jd;
const RA = /* @__PURE__ */ new Set([4001, -31001]), GA = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], KA = ["result", "data", "payload", "response", "params"], qf = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Ao = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), lr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, ke = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, VA = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), wp = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => VA(i, r)) === s
  );
}, xp = (t) => t ? wp(lr()).some(
  (e) => {
    var n;
    return e.id === t && (Ao(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, mp = () => {
  if (typeof window > "u")
    return;
  const t = lr(), e = wp(t).filter(
    (n) => {
      var r;
      return Ao(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = ke(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of GA) {
    const r = ke(t, n) ?? (t === window ? void 0 : ke(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, qA = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = lr(), n = ke(e, t) ?? (e === window ? void 0 : ke(window, t)) ?? co(t);
  if (n)
    return n;
  if (Ao(t) || xp(t))
    return mp();
}, di = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, WA = ["blockstack-session", "blockstack"], YA = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of WA) {
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
YA();
const Sp = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Xt = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, XA = (t) => {
  const e = Xt(t);
  if (!e)
    return null;
  const n = Sp(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, ZA = (t) => {
  const e = Xt(t);
  if (!e)
    return null;
  const n = Sp(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, cc = (t, e = "mainnet") => {
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
      return cc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return cc(r, e);
  }
  return e;
}, Dn = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, As = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Si(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = As(s, e + 1);
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
    const i = As(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Si(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Si(n.testnet) ? n.testnet.trim() : null;
}, Wf = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Ep = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && RA.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, tr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Xt(n == null ? void 0 : n.message) ?? Xt(e.message) ?? Xt(e.error) ?? Xt(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, zr = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw tr(e);
    if (e.status === "error")
      throw tr(e.result ?? e);
  }
  return t;
}, Yf = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return zr(r);
  } catch (r) {
    throw tr(r);
  }
}, Ap = () => mp(), Eu = () => {
  if (typeof window > "u")
    return;
  const t = lr();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = ke(t, e) ?? (t === window ? void 0 : ke(window, e));
    if (n)
      return n;
  }
}, Xf = () => {
  if (typeof window > "u")
    return;
  const t = Eu();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = lr();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = ke(e, n) ?? (e === window ? void 0 : ke(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Ei = (t) => {
  var r, s;
  const e = Kn();
  if (Ao(e) || xp(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = lr() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Ap();
}, ra = (t) => {
  const e = ZA(t);
  if (!e)
    return null;
  try {
    const n = Su(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Wi = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = ra(t), r = XA(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Xt(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Wi(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of qf)
    if (ra(s[a])) {
      i = Xt(s[a]);
      break;
    }
  const o = Xt(s.txId) || Xt(s.txid) || Xt(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Xt(s.txRaw) ?? void 0
    };
  for (const a of qf) {
    const c = ra(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Xt(s[a]) ?? void 0
      };
  }
  for (const a of KA) {
    const c = s[a], l = Wi(c, e + 1);
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
}, sa = (t) => {
  const e = Wi(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, QA = (t) => {
  const e = Wi(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, JA = (t) => ({
  ...t,
  fee: Dn(t.fee),
  nonce: Dn(t.nonce),
  sponsored: t.sponsored === !0
}), Zf = (t) => ({
  recipient: t.recipient,
  amount: Dn(t.amount) ?? "0",
  memo: t.memo,
  network: cc(t.network),
  address: t.stxAddress,
  fee: Dn(t.fee),
  nonce: Dn(t.nonce),
  sponsored: t.sponsored ?? !1
}), $p = "WALLET_ADDRESS_MISMATCH", t6 = 45e3;
let fs = null;
const uc = (t) => {
  t && (fs = { address: t, at: Date.now() });
}, e6 = () => {
  fs = null;
}, n6 = () => fs && Date.now() - fs.at <= t6 ? fs.address : null, r6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, s6 = async (t) => {
  e6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = zr(await t.request("wallet_connect")), n = As(e);
  return uc(n), n;
}, i6 = async (t, e, n, r) => {
  try {
    return zr(await t.request(e, n));
  } catch (s) {
    const i = tr(s);
    if (!r6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await s6(t);
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
        { code: o ? $p : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return zr(await t.request(e, n));
    } catch (a) {
      throw tr(a);
    }
  }
};
let Qf = 3e4;
const o6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Qf / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Qf);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, a6 = async (t, e, n) => {
  const r = (c, l) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${l}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: $p }
      );
    return c;
  }, s = n6();
  if (s)
    return di(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  di(n, "account-read");
  try {
    const c = zr(
      await o6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = As(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Ep(c))
      throw tr(c);
    di(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return uc(i), r(i, "wallet_getAccount");
  let o;
  di(n, "account-reconnect");
  try {
    o = zr(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), tr(c);
  }
  const a = As(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return uc(a), r(a, "wallet_connect");
}, c6 = async (t, e) => {
  if (!Ei(t)) {
    const i = await Yf(
      t,
      "stx_transferStx",
      Zf(e)
    );
    return sa(i);
  }
  const n = Eu();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Yf(
      n,
      "stx_transferStx",
      Zf(e)
    );
    return sa(i);
  }
  const r = Ap();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await a6(r, e.stxAddress);
  const s = await i6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Dn(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Dn(e.fee) } : {}
    },
    e.stxAddress
  );
  return sa(s);
}, u6 = () => Kn(), Ip = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Kn(), e = t ? qA(t) : void 0;
  if (e)
    return e;
  const n = lr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, l6 = (t, e) => {
  const n = Ip(), r = JA({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, QA(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ui(r, e);
  if (Ei(n) && !Eu()) {
    const s = Xf();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Kn(),
        route: "legacy-transaction-request"
      }), ui(r, s);
  }
  return void c6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Wf(s) && Ei(n)) {
      const a = Xf();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Kn(),
          route: "legacy-transaction-request"
        }), ui(r, a);
        return;
      }
    }
    if (Wf(s) && !Ei(n)) {
      ui(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Ep(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Jf = (t) => $A(t).replace(/^0x/, ""), th = "This wallet cannot sign messages. Try Xverse or Leather.", eh = (t) => typeof (t == null ? void 0 : t.request) == "function", nh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", f6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, h6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function d6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Jf(e.message),
    domain: Jf(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function p6(t, e) {
  const n = await iE({
    domain: e.domain,
    message: e.message,
    network: bo(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function g6(t) {
  var s, i;
  const e = u6() || "", n = /xverse/i.test(e);
  let r = Ip();
  if (n && !nh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (nh(r))
    try {
      return await p6(r, t);
    } catch (o) {
      if (n || !eh(r) || !h6(o)) throw o;
    }
  if (!n && eh(r))
    try {
      return await d6(r, t);
    } catch (o) {
      throw f6(o) ? new Error(th) : o;
    }
  throw new Error(th);
}
const rh = 1000000n, $r = 1000000n, lc = 50n, $s = 3000n, Au = 300n, y6 = 3000n, b6 = 50000n, Is = (t) => t + lc;
function Ue(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / rh}.${(n % rh).toString().padStart(6, "0")}`;
}
function w6(t, e = Au) {
  return t <= $s ? 0 : Number((t - $s) / Is(e));
}
function sh(t, e = 0n) {
  const n = $r - t - e;
  return n > 0n ? n : 0n;
}
function ia(t, e = Au) {
  return t > $r ? "over" : t < $s + Is(e) ? "empty" : t < b6 ? "low" : "ok";
}
const x6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", m6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", S6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function E6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || S6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== x6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const vp = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", [fc, Lp] = vp.split("."), pn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function hc(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function A6(t) {
  return pn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Rr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Bp(t, e = []) {
  const n = await Rr(`/v2/contracts/call-read/${fc}/${Lp}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: fc, arguments: e.map((r) => "0x" + pn(Ht(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return yn(le(n.result));
}
async function $6() {
  const t = await Rr(`/v2/contracts/source/${fc}/${Lp}?proof=0`);
  if (typeof t.source != "string" || await A6(t.source) !== m6) throw Error("Deployed source does not match the tested helper.");
  if (E6(await Bp("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Cp(t) {
  return t.startsWith("SP") && Si(t) && !t.includes(".");
}
async function I6(t) {
  var r;
  if (!Cp(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Rr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Rr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function v6(t) {
  const e = await Rr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function L6(t, e) {
  var s, i;
  const n = await Bp("get-owner", [qi(t), qi(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Cp(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function B6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: hc(t), signal: AbortSignal.timeout(15e3) });
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
async function C6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function M6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Su(hc(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || us(ss(Ri.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || us(r.contractAddress) + "." + r.contractName.content !== vp || r.functionName.content !== "play" || r.functionArgs.length !== 3 || pn(Ht(r.functionArgs[0])) !== pn(Ht(qi(t.core))) || pn(Ht(r.functionArgs[1])) !== pn(Ht(qi(t.song))) || pn(Ht(r.functionArgs[2])) !== pn(Ht(zA(hc(t.id)))) || t.amount !== "50" || e.postConditionMode !== ws.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== xs.Equal || i.principal.prefix !== 2 || us(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (r.payloadType !== 0 || yn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const H6 = "xtrata.xyz/radio/listening-wallet", U6 = "Link a temporary listening wallet for pay-per-play; no spending permission", _6 = (t) => ({
  domain: nc({ name: xr(H6), version: xr("1"), "chain-id": Gi(1) }),
  message: nc({
    purpose: xr(U6),
    main: xr(t.main),
    listening: xr(t.listening),
    issued: Gi(t.issued)
  })
}), oa = 3, T6 = ["prepared", "signed", "unknown", "pending"], N6 = 30 * 6e4, aa = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, P6 = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function k6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, l = !1, f = "", u = "", p, h = null, b, x = -1 / 0;
  const g = /* @__PURE__ */ new Set();
  let I = !1, L = !1;
  const y = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Au.toString()), A = (U, R) => `xtrata.ppp.v1.${U}:${R}`, m = (U = i == null ? void 0 : i.address) => {
    if (!U) return [];
    try {
      const R = JSON.parse(t.store.get(A("entries", U)) || "[]");
      return Array.isArray(R) ? R : [];
    } catch {
      return [];
    }
  }, B = (U) => {
    const R = [U, ...m(U.address).filter((et) => !(et.txid === U.txid && et.kind === U.kind))].slice(0, 200);
    t.store.set(A("entries", U.address), JSON.stringify(R));
  }, D = (U = i == null ? void 0 : i.address) => !!U && t.store.get(A("canary", U)) !== null, _ = () => m().filter((U) => T6.includes(U.status)), k = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(A("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, w = (U) => {
    i != null && i.address && t.store.set(A("deposit", i.address), JSON.stringify(U));
  }, $ = () => _().filter((U) => t.now() - U.created > N6 && g.has(U.txid));
  function T() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const U = t.main();
    return U ? e.allowed ? i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : i.linked !== U ? "link" : o === void 0 ? "loading" : o > $r ? "over" : _().length && !D() ? "paying" : o < $s + Is(y()) ? "fund" : D() ? "ready" : "first-play" : "loading" : "not-invited" : "connect";
  }
  const j = () => {
    var U, R;
    return {
      step: T(),
      busy: c,
      message: f,
      error: u,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : ia(o, y()),
      playsLeft: o === void 0 ? 0 : w6(o, y()),
      allowance: o === void 0 ? $r : sh(o, BigInt(((U = k()) == null ? void 0 : U.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      canaryPassed: D(),
      entries: m(),
      depositTxid: ((R = k()) == null ? void 0 : R.txid) ?? p,
      depositPending: !!k(),
      serverLinked: !!h && b === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: $().length
    };
  }, G = (U, R = "") => {
    f = U, u = R, t.changed();
  };
  async function M(U, R) {
    if (!c) {
      c = U, u = "", t.changed();
      try {
        await R();
      } catch (et) {
        const F = et instanceof Error ? et.message : String(et);
        u = /Cancelled in the listening wallet/.test(F) ? "" : F, u || (f = "Cancelled. Nothing was signed.");
      } finally {
        c = null, await C(!0);
      }
    }
  }
  async function pt() {
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function Kt(U = !1) {
    i != null && i.address && (!U && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function Fe(U) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || i.linked === U) return;
    const R = `${U}:${i.address}`;
    b === R && (h || t.now() - x < 6e4) || (h = (await t.links(U)).find((et) => et.listening === i.address) ?? null, b = R, x = t.now());
  }
  async function S() {
    const U = i == null ? void 0 : i.address;
    if (!U) return;
    let R;
    for (const F of _())
      try {
        const mt = await t.chain.transaction(F.txid);
        if (!mt) {
          if (g.add(F.txid), t.now() - F.created > 15 * 6e4 && (R ?? (R = await t.chain.confirmedNonce(U))), R !== void 0 && R > BigInt(F.nonce)) {
            B({ ...F, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((F.status === "unknown" || F.status === "signed") && F.raw)
            try {
              await t.chain.broadcast(F.raw, F.txid), B({ ...F, status: "pending" });
            } catch (Vt) {
              aa(Vt) && B({ ...F, status: "failed", note: Vt.message, raw: void 0 });
            }
          continue;
        }
        g.delete(F.txid);
        const Bt = String(mt.tx_status);
        Bt === "success" && mt.canonical !== !1 && mt.is_unanchored === !1 ? (B({ ...F, status: "confirmed", confirmedAt: t.now(), actualFee: String(mt.fee_rate ?? F.fee), raw: void 0 }), F.kind === "play" && !D(F.address) && (t.store.set(A("canary", F.address), F.txid), G("First paid play confirmed on-chain. Pay-per-play is ready."))) : Bt.startsWith("abort_") || Bt.startsWith("dropped_") ? B({ ...F, status: "failed", note: Bt, raw: void 0 }) : F.status !== "pending" && B({ ...F, status: "pending" });
      } catch {
      }
    const et = k();
    if (et)
      try {
        const F = await t.chain.transaction(et.txid), mt = String((F == null ? void 0 : F.tx_status) ?? "");
        (mt === "success" && F.is_unanchored === !1 || mt.startsWith("abort_") || mt.startsWith("dropped_") || !F && t.now() - et.at > 2 * 36e5) && (w(null), a = -1 / 0);
      } catch {
      }
  }
  async function C(U = !1) {
    try {
      const R = t.main();
      if ((U || !e || r !== R || t.now() - n > 3e5) && (e = await t.config(R), n = t.now(), r = R), !e.enabled || !e.here || !R || !e.allowed) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), t.changed();
        return;
      }
      await pt(), i = await s.request("listening.status"), await Fe(R), await Kt(U), await S();
    } catch (R) {
      u = R instanceof Error ? R.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    t.changed();
  }
  const ot = (U, R) => {
    const et = Is(y()), F = (o ?? 0n) - $s, mt = Math.max(1, Math.min(U, Number(F / et))), Bt = BigInt(mt) * et;
    return { fee: y().toString(), maxPlays: mt, budget: (Bt > $r ? $r : Bt).toString(), expires: t.now() + R * 36e5 };
  };
  async function ct() {
    if (!(i != null && i.address)) return !1;
    if (L || (L = await t.tabLock(i.address)), !L)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const ut = {
    forceRefresh: () => C(!0),
    create: () => M("Waiting for your passkey in the listening wallet…", async () => {
      await (await pt()).request("listening.unlock", { mode: "create" }), G("Listening wallet created. Next, link it to your main wallet.");
    }),
    unlock: (U = !1) => M("Waiting for your passkey in the listening wallet…", async () => {
      const R = await pt(), et = D(i == null ? void 0 : i.address);
      et && await Kt(!0);
      const F = et && o !== void 0 && ia(o, y()) !== "over" && ia(o, y()) !== "empty" ? ot(e.limits.maxSessionPlays, e.limits.sessionHours) : void 0;
      await R.request("listening.unlock", { mode: "unlock", terms: F, anyPasskey: U }), F && await ct(), G(F ? "Unlocked. New songs you hear will pay their holders." : "Unlocked.");
    }),
    link: () => M("Waiting for your main wallet to sign…", async () => {
      const U = t.main();
      if (!U || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const R = (await t.links(U)).find((et) => et.listening === i.address);
      if (R)
        await s.request("listening.link", { main: U, issued: R.issued, mainSignature: R.mainSignature });
      else {
        const et = { main: U, listening: i.address, issued: t.now() }, F = await t.signWithMain(U, _6(et)), mt = await s.request("listening.link", { main: U, issued: et.issued, mainSignature: F });
        await t.saveLink({ ...et, mainSignature: F, listeningSignature: mt.listeningSignature });
      }
      x = -1 / 0, G("Linked. Returns from the listening wallet can only go to your main wallet.");
    }),
    deposit: () => M("Waiting for your main wallet to approve the deposit…", async () => {
      const U = t.main();
      if (!U || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (k()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Kt(!0);
      const R = sh(o ?? 0n);
      if (R <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      p = await t.deposit(U, i.address, R), p && w({ txid: p, amount: R.toString(), at: t.now() }), G("Deposit sent. It usually confirms within a few minutes; this page checks automatically.");
    }),
    approveFirstPlay: () => M("Approve your first paid play in the listening wallet…", async () => {
      await ct(), await s.request("listening.approveSession", ot(e.limits.firstSessionPlays, 0.5)), G("Approved. The next new song you hear will pay its holder. Play or skip to a song to send it.");
    }),
    payAutomatically: () => M("Approve paying as you listen in the listening wallet…", async () => {
      await ct(), await Kt(!0), await s.request("listening.approveSession", ot(e.limits.maxSessionPlays, e.limits.sessionHours)), G("On. Each new song you hear pays its holder until you stop or the session ends.");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => M("Clearing…", async () => {
      for (const U of $())
        await t.chain.transaction(U.txid) || B({ ...U, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      G("Cleared. If one of those still confirms later, it will simply show in your wallet history on the explorer.");
    }),
    stop: () => M("Stopping…", async () => {
      await (s == null ? void 0 : s.request("listening.stop")), G("Stopped. Music plays free.");
    }),
    lock: () => M("Locking…", async () => {
      await (s == null ? void 0 : s.request("listening.lock")), o = void 0, G("Locked. The listening key has been forgotten.");
    }),
    returnFunds: (U) => M("Review the return in the listening wallet…", async () => {
      if (!(i != null && i.address) || !i.linked) throw new Error("Link your main wallet first.");
      if (_().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: R, nonce: et } = await t.chain.account(i.address);
      o = R;
      const F = await s.request("listening.prepareReturn", { mode: U, balance: R.toString(), nonce: et.toString(), fee: y6.toString() });
      if (F.recipient !== i.linked) throw new Error("Return destination does not match your linked main wallet. Nothing was sent.");
      const mt = Su(F.raw);
      if (yn(mt.payload.recipient).value !== i.linked || String(mt.payload.amount) !== F.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const Bt = {
        id: P6(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: F.recipient,
        amount: F.amount,
        fee: F.fee,
        nonce: et.toString(),
        created: t.now(),
        status: "signed",
        raw: F.raw,
        txid: F.txid
      };
      t.validate(Bt), B(Bt);
      try {
        await t.chain.broadcast(F.raw, F.txid), B({ ...Bt, status: "pending" });
      } catch (Vt) {
        throw B({ ...Bt, status: "unknown", note: Vt.message }), Vt;
      }
      G(`Return sent to your main wallet. Pay-per-play is paused${U === "all" ? " until you add funds and turn it on again" : ""}.`);
    })
  };
  async function Lt(U) {
    if (!(l || c)) {
      l = !0;
      try {
        await C();
        const R = T();
        if (R !== "ready" && R !== "first-play" || !(i != null && i.session) || i.session.playsLeft < 1 || !L || _().length) return;
        I || (await t.chain.verify(), I = !0);
        const et = i.address, { balance: F, nonce: mt } = await t.chain.account(et);
        o = F, a = t.now();
        const Bt = await t.chain.owner(oa, U.song);
        if (Bt === et || Bt === t.main()) return;
        const Vt = await s.request("listening.signPlay", {
          core: oa,
          song: U.song,
          receipt: U.id,
          fee: y().toString(),
          nonce: mt.toString(),
          balance: F.toString()
        }), fr = {
          id: U.id,
          address: et,
          kind: "play",
          core: oa,
          song: U.song,
          recipient: Bt,
          amount: "50",
          fee: y().toString(),
          nonce: mt.toString(),
          created: t.now(),
          status: "signed",
          raw: Vt.raw,
          txid: Vt.txid
        };
        t.validate(fr), B(fr);
        try {
          await t.chain.broadcast(Vt.raw, Vt.txid), B({ ...fr, status: "pending" }), f = `Paid play sent for song #${U.song}.`, u = "";
        } catch (hr) {
          B({ ...fr, status: aa(hr) ? "failed" : "unknown", note: hr.message, ...aa(hr) ? { raw: void 0 } : {} }), u = hr.message;
        }
        i = await s.request("listening.status");
      } catch (R) {
        f = "This song played free: " + (R instanceof Error ? R.message : "payment unavailable");
      } finally {
        l = !1, t.changed();
      }
    }
  }
  return { snapshot: j, refresh: C, onAudibleStart: Lt, ...ut };
}
const ih = document.getElementById("ppp");
ih && D6(ih);
function D6(t) {
  const e = h1(), n = (g) => t.querySelector(g), r = n(".ppp-frame");
  let s = null;
  const i = async (g, I) => {
    const L = await fetch(g, { cache: "no-store", ...I, signal: AbortSignal.timeout(15e3) }), y = await L.json().catch(() => ({}));
    if (!L.ok) throw new Error((y == null ? void 0 : y.error) || `Request failed (${L.status}).`);
    return y;
  }, o = k6({
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
      const I = new Promise((m, B) => {
        s.addEventListener("load", () => m(), { once: !0 }), setTimeout(() => B(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = g + "/", r.replaceChildren(s), await I;
      const L = new r1({ walletOrigin: g, frame: s, timeoutMs: 30 * 6e4 }), y = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), A = (m, B) => y.has(m) ? L.request(m, B) : Promise.race([
        L.request(m, B),
        new Promise((D, _) => setTimeout(() => _(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await A("listening.status"), { request: A };
    },
    chain: {
      verify: $6,
      balance: v6,
      account: I6,
      owner: L6,
      broadcast: B6,
      transaction: C6,
      confirmedNonce: async (g) => {
        const I = await Rr(`/v2/accounts/${g}?proof=0`);
        if (!Number.isSafeInteger(I == null ? void 0 : I.nonce) || I.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(I.nonce);
      }
    },
    signWithMain: (g, I) => g6({ ...I, network: "mainnet", stxAddress: g }),
    deposit: (g, I, L) => new Promise((y, A) => l6({
      recipient: I,
      amount: L.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: g,
      network: new ah(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (m) => y(m.txId || ""),
      onCancel: () => A(new Error("Deposit cancelled. Nothing was sent.")),
      onError: A
    })),
    validate: M6,
    tabLock: (g) => new Promise((I) => {
      const L = navigator.locks;
      if (!(L != null && L.request)) {
        I(!0);
        return;
      }
      L.request("xtrata-ppp:" + g, { ifAvailable: !0 }, async (y) => {
        I(!!y), y && await new Promise(() => {
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
      set: (g, I) => {
        try {
          localStorage.setItem(g, I);
        } catch {
        }
      }
    },
    changed: () => x(o.snapshot())
  }), a = (g) => g ? g.slice(0, 6) + "…" + g.slice(-4) : "", c = (g) => new Date(g).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), l = (g) => `https://explorer.hiro.so/txid/${g}?chain=mainnet`, f = (g, I = "", L = "") => {
    const y = document.createElement(g);
    return I && (y.textContent = I), L && (y.className = L), y;
  }, u = (g, I, L = "") => {
    const y = f("button", g, L);
    return y.type = "button", y.onclick = I, y;
  }, p = (g, I) => {
    const L = f("a", g);
    return L.href = I, L.target = "_blank", L.rel = "noopener", L;
  }, h = ["Create wallet", "Link", "Deposit", "First paid play"], b = { intro: 0, locked: 0, link: 1, fund: 2, "first-play": 3, paying: 3, ready: 4, over: 4, loading: 2 };
  function x(g) {
    var $, T, j, G;
    if (t.hidden = g.step === "off", t.hidden) return;
    n(".ppp-badge").hidden = !(($ = g.gate) != null && $.canary);
    const I = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(g.step);
    r.hidden = !I, r.classList.toggle("ppp-frame--active", !!g.busy);
    const L = n(".ppp-steps"), y = b[g.step];
    L.hidden = y === void 0 || g.canaryPassed, L.replaceChildren(...h.map((M, pt) => f("li", M, y !== void 0 && pt < y ? "done" : pt === y ? "now" : "")));
    const A = n(".ppp-body"), m = [], B = [], D = Is(BigInt(((T = g.gate) == null ? void 0 : T.limits.playFee) ?? "300")), _ = `Each new song you hear sends ${Ue(lc)} STX to whoever holds it, plus a ${Ue(D - lc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, k = !!g.busy;
    switch (g.step) {
      case "elsewhere": {
        if (m.push(f("p", "Pay artists a tiny amount each time a new song starts, recorded on-chain. Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet.")), (j = g.gate) != null && j.radioUrl) {
          const M = f("p");
          M.append(p("Open the pay-per-play radio →", g.gate.radioUrl)), m.push(M);
        }
        break;
      }
      case "connect":
        m.push(f("p", "Pay artists a tiny amount each time a new song starts, recorded on-chain. Connect your wallet above to turn it on. Listening is always free."));
        break;
      case "not-invited":
        m.push(f("p", "Pay-per-play is in a small test right now. Listening is free for everyone, and it will open up soon."));
        break;
      case "unsupported":
        m.push(f("p", "This browser cannot create the passkey pay-per-play needs. Listening is free. Try Chrome or Safari on a current phone or computer."));
        break;
      case "intro":
        m.push(f("p", _)), m.push(f("p", "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), B.push(u("Turn on pay-per-play", () => void o.create(), "primary")), B.push(u("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        m.push(f("p", `Your listening wallet ${a(g.listening)} is locked.`)), B.push(u(g.canaryPassed ? "Unlock and pay as you listen" : "Unlock", () => void o.unlock(), "primary")), B.push(u("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        m.push(f("p", g.serverLinked ? `This listening wallet was linked to ${a(g.main)} on another device. Confirm it in the listening wallet below.` : `Link the listening wallet to your main wallet ${a(g.main)}. This is one signature, not a transaction: no fee, no spending permission. Afterwards, returns can only go back to this main wallet.`)), m.push(f("p", "The listening wallet will show the full address. Check it is yours before confirming.")), B.push(u(g.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        m.push(f("p", "Checking the listening wallet balance…"));
        break;
      case "fund": {
        m.push(f("p", `Add up to ${Ue(g.allowance)} STX. 1 STX covers about ${Math.floor(Number(1000000n / D)).toLocaleString()} paid plays.`));
        const M = f("p", "", "ppp-addr");
        if (M.append(f("span", "Or send from an exchange to "), f("code", g.listening || ""), u("Copy", () => {
          var pt;
          return void ((pt = navigator.clipboard) == null ? void 0 : pt.writeText(g.listening || ""));
        })), m.push(M), g.depositPending && g.depositTxid) {
          const pt = f("p", "Deposit sent, waiting for it to confirm. This page checks automatically. ");
          pt.append(p("View", l(g.depositTxid))), m.push(pt);
        } else g.allowance > 0n && B.push(u(`Deposit ${Ue(g.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "first-play":
        m.push(f("p", _)), (G = g.session) != null && G.playsLeft ? m.push(f("p", "Approved. Now play or skip to a new song: once you can hear it, it sends your first payment.", "ppp-ok")) : B.push(u("Approve my first paid play", () => void o.approveFirstPlay(), "primary"));
        break;
      case "paying":
        m.push(f("p", "Your first payment is on its way. It usually confirms within a few minutes."));
        break;
    }
    switch (g.stuck && (m.push(f("p", g.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${g.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), B.push(u("Clear stuck payments", () => void o.clearStuck()))), g.step) {
      case "over":
        m.push(f("p", `This wallet holds ${Ue(g.balance ?? 0n)} STX, more than the recommended 1 STX. Paid plays are paused. Return the excess or everything to your main wallet ${a(g.linked)}.`, "ppp-warn")), B.push(u("Return excess", () => void o.returnFunds("excess"), "primary"), u("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        m.push(f("p", `Balance ${Ue(g.balance ?? 0n)} STX · about ${g.playsLeft.toLocaleString()} plays.`)), (g.balanceState === "low" || g.balanceState === "empty") && m.push(f("p", g.balanceState === "empty" ? "Out of funds: songs play free until you top up." : "Running low. Top up to keep paying artists.", "ppp-warn")), g.session && g.session.playsLeft > 0 ? (m.push(f("p", `Paying as you listen · up to ${g.session.playsLeft} more plays until ${c(g.session.expires)}.`, "ppp-ok")), B.push(u("Stop paying", () => void o.stop()))) : g.balanceState !== "empty" && B.push(u("Pay automatically for each new song", () => void o.payAutomatically(), "primary")), g.depositPending ? m.push(f("p", "Top-up sent, waiting for it to confirm.")) : g.allowance > 0n && g.balanceState !== "ok" && B.push(u(`Top up ${Ue(g.allowance)} STX`, () => void o.deposit()));
        break;
    }
    ["ready", "fund", "first-play", "paying"].includes(g.step) && g.linked && (g.balance ?? 0n) > 0n && B.push(u("Return all to my wallet", () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "first-play", "link", "over", "paying"].includes(g.step) && B.push(u("Lock", () => void o.lock(), "quiet")), B.forEach((M) => M.disabled = k), A.replaceChildren(...m), n(".ppp-actions").replaceChildren(...B), n(".ppp-msg").textContent = g.busy || g.message, n(".ppp-err").textContent = g.error;
    const w = n(".ppp-history");
    w.hidden = !g.entries.length, w.replaceChildren(f("summary", `Payments and returns (${g.entries.length})`), ...g.entries.slice(0, 20).map((M) => {
      const pt = f("div", `${new Date(M.created).toLocaleString()} · ${M.kind === "play" ? `song #${M.song} · ${Ue(BigInt(M.amount))} STX + fee` : `returned ${Ue(BigInt(M.amount))} STX`} · ${M.status} `);
      return M.txid && pt.append(p("tx", l(M.txid))), pt;
    }));
  }
  window.addEventListener("xtrata:radio-audible-start", (g) => {
    const I = g.detail;
    I && Number.isSafeInteger(I.song) && typeof I.id == "string" && o.onAudibleStart(I);
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const O6 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", j6 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, F6 = () => j6() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, z6 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, R6 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Mp = class {
  constructor(t) {
    k4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && rx(t), this.callback(co(t));
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
    const t = F6(), e = z6(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return V("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, V("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), V("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, V("div", { class: "flex flex-col space-y-[10px]" }, V("div", { class: "flex items-center" }, V("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), V("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, V("span", { class: "sr-only" }, "Close popup"), V("img", { src: O6 }))), r ? V("p", null, "Select the wallet you want to connect to.") : V("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && V("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && V("div", { class: "mt-6" }, V("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), V("ul", { class: "space-y-3" }, this.installedProviders.map((i) => V("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, V("div", { class: "aspect-square basis-9 overflow-hidden" }, V("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), V("div", { class: "flex-1" }, V("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && V("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), V("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && V("div", { class: "mt-6" }, r ? V("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : V("div", { class: "mb-5 flex justify-between" }, V("p", { class: "text-sm font-medium" }, "Recommended wallets"), V("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, V("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, V("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), V("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), V("p", null, "What is a wallet? ", V("span", { class: "align-text-bottom text-[9px]" }, "↗")))), V("ul", { class: "space-y-3" }, n.map((i) => V("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, V("div", { class: "aspect-square basis-9 overflow-hidden" }, V("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), V("div", { class: "flex-1" }, V("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && V("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && V("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return w4(this);
  }
};
Mp.style = R6;
const G6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Mp
}, Symbol.toStringTag, { value: "Module" }));
