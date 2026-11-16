var Ib = Object.defineProperty;
var Lb = (e, t, n) => t in e ? Ib(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ea = (e, t, n) => Lb(e, typeof t != "symbol" ? t + "" : t, n);
var Cn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ug(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function wl(e) {
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
      typeof Cn < "u" && Cn || {}, r = {
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
      function u(b) {
        var $ = {
          next: function() {
            var N = b.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && ($[Symbol.iterator] = function() {
          return $;
        }), $;
      }
      function h(b) {
        this.map = {}, b instanceof h ? b.forEach(function($, N) {
          this.append(N, $);
        }, this) : Array.isArray(b) ? b.forEach(function($) {
          if ($.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + $.length);
          this.append($[0], $[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function($) {
          this.append($, b[$]);
        }, this);
      }
      h.prototype.append = function(b, $) {
        b = a(b), $ = c($);
        var N = this.map[b];
        this.map[b] = N ? N + ", " + $ : $;
      }, h.prototype.delete = function(b) {
        delete this.map[a(b)];
      }, h.prototype.get = function(b) {
        return b = a(b), this.has(b) ? this.map[b] : null;
      }, h.prototype.has = function(b) {
        return this.map.hasOwnProperty(a(b));
      }, h.prototype.set = function(b, $) {
        this.map[a(b)] = c($);
      }, h.prototype.forEach = function(b, $) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && b.call($, this.map[N], N, this);
      }, h.prototype.keys = function() {
        var b = [];
        return this.forEach(function($, N) {
          b.push(N);
        }), u(b);
      }, h.prototype.values = function() {
        var b = [];
        return this.forEach(function($) {
          b.push($);
        }), u(b);
      }, h.prototype.entries = function() {
        var b = [];
        return this.forEach(function($, N) {
          b.push([N, $]);
        }), u(b);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function d(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function m(b) {
        return new Promise(function($, N) {
          b.onload = function() {
            $(b.result);
          }, b.onerror = function() {
            N(b.error);
          };
        });
      }
      function w(b) {
        var $ = new FileReader(), N = m($);
        return $.readAsArrayBuffer(b), N;
      }
      function v(b) {
        var $ = new FileReader(), N = m($), _ = /charset=([A-Za-z0-9_-]+)/.exec(b.type), q = _ ? _[1] : "utf-8";
        return $.readAsText(b, q), N;
      }
      function A(b) {
        for (var $ = new Uint8Array(b), N = new Array($.length), _ = 0; _ < $.length; _++)
          N[_] = String.fromCharCode($[_]);
        return N.join("");
      }
      function L(b) {
        if (b.slice)
          return b.slice(0);
        var $ = new Uint8Array(b.byteLength);
        return $.set(new Uint8Array(b)), $.buffer;
      }
      function P() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = L(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || i(b)) ? this._bodyArrayBuffer = L(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var b = d(this);
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
            var b = d(this);
            return b || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(w);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var b = d(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return v(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(A(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(U);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var O = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function E(b) {
        var $ = b.toUpperCase();
        return O.indexOf($) > -1 ? $ : b;
      }
      function M(b, $) {
        if (!(this instanceof M))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        $ = $ || {};
        var N = $.body;
        if (b instanceof M) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, $.headers || (this.headers = new h(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !N && b._bodyInit != null && (N = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = $.credentials || this.credentials || "same-origin", ($.headers || !this.headers) && (this.headers = new h($.headers)), this.method = E($.method || this.method || "GET"), this.mode = $.mode || this.mode || null, this.signal = $.signal || this.signal || function() {
          if ("AbortController" in n) {
            var R = new AbortController();
            return R.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && ($.cache === "no-store" || $.cache === "no-cache")) {
          var _ = /([?&])_=[^&]*/;
          if (_.test(this.url))
            this.url = this.url.replace(_, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var q = /\?/;
            this.url += (q.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      M.prototype.clone = function() {
        return new M(this, { body: this._bodyInit });
      };
      function U(b) {
        var $ = new FormData();
        return b.trim().split("&").forEach(function(N) {
          if (N) {
            var _ = N.split("="), q = _.shift().replace(/\+/g, " "), R = _.join("=").replace(/\+/g, " ");
            $.append(decodeURIComponent(q), decodeURIComponent(R));
          }
        }), $;
      }
      function V(b) {
        var $ = new h(), N = b.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(_) {
          return _.indexOf(`
`) === 0 ? _.substr(1, _.length) : _;
        }).forEach(function(_) {
          var q = _.split(":"), R = q.shift().trim();
          if (R) {
            var le = q.join(":").trim();
            try {
              $.append(R, le);
            } catch (ue) {
              console.warn("Response " + ue.message);
            }
          }
        }), $;
      }
      P.call(M.prototype);
      function ce(b, $) {
        if (!(this instanceof ce))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if ($ || ($ = {}), this.type = "default", this.status = $.status === void 0 ? 200 : $.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = $.statusText === void 0 ? "" : "" + $.statusText, this.headers = new h($.headers), this.url = $.url || "", this._initBody(b);
      }
      P.call(ce.prototype), ce.prototype.clone = function() {
        return new ce(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, ce.error = function() {
        var b = new ce(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var te = [301, 302, 303, 307, 308];
      ce.redirect = function(b, $) {
        if (te.indexOf($) === -1)
          throw new RangeError("Invalid status code");
        return new ce(null, { status: $, headers: { location: b } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function($, N) {
          this.message = $, this.name = N;
          var _ = Error($);
          this.stack = _.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function Y(b, $) {
        return new Promise(function(N, _) {
          var q = new M(b, $);
          if (q.signal && q.signal.aborted)
            return _(new t.DOMException("Aborted", "AbortError"));
          var R = new XMLHttpRequest();
          function le() {
            R.abort();
          }
          R.onload = function() {
            var I = {
              statusText: R.statusText,
              headers: V(R.getAllResponseHeaders() || "")
            };
            q.url.indexOf("file://") === 0 && (R.status < 200 || R.status > 599) ? I.status = 200 : I.status = R.status, I.url = "responseURL" in R ? R.responseURL : I.headers.get("X-Request-URL");
            var F = "response" in R ? R.response : R.responseText;
            setTimeout(function() {
              N(new ce(F, I));
            }, 0);
          }, R.onerror = function() {
            setTimeout(function() {
              _(new TypeError("Network request failed"));
            }, 0);
          }, R.ontimeout = function() {
            setTimeout(function() {
              _(new TypeError("Network request timed out"));
            }, 0);
          }, R.onabort = function() {
            setTimeout(function() {
              _(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ue(I) {
            try {
              return I === "" && n.location.href ? n.location.href : I;
            } catch {
              return I;
            }
          }
          if (R.open(q.method, ue(q.url), !0), q.credentials === "include" ? R.withCredentials = !0 : q.credentials === "omit" && (R.withCredentials = !1), "responseType" in R && (r.blob ? R.responseType = "blob" : r.arrayBuffer && (R.responseType = "arraybuffer")), $ && typeof $.headers == "object" && !($.headers instanceof h || n.Headers && $.headers instanceof n.Headers)) {
            var De = [];
            Object.getOwnPropertyNames($.headers).forEach(function(I) {
              De.push(a(I)), R.setRequestHeader(I, c($.headers[I]));
            }), q.headers.forEach(function(I, F) {
              De.indexOf(F) === -1 && R.setRequestHeader(F, I);
            });
          } else
            q.headers.forEach(function(I, F) {
              R.setRequestHeader(F, I);
            });
          q.signal && (q.signal.addEventListener("abort", le), R.onreadystatechange = function() {
            R.readyState === 4 && q.signal.removeEventListener("abort", le);
          }), R.send(typeof q._bodyInit > "u" ? null : q._bodyInit);
        });
      }
      return Y.polyfill = !0, n.fetch || (n.fetch = Y, n.Headers = h, n.Request = M, n.Response = ce), t.Headers = h, t.Request = M, t.Response = ce, t.fetch = Y, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Cn);
})();
const Cb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Tb(e, t) {
  const n = {};
  return Object.assign(n, Cb, t), await fetch(e, n);
}
function Bb(e) {
  let t = Tb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Mb(...e) {
  const { fetchLib: t, middlewares: n } = Bb(e);
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
var ki;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ki || (ki = {}));
var Co;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Co || (Co = {}));
var jh;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(jh || (jh = {}));
const Nb = "https://api.mainnet.hiro.so", _b = "https://api.testnet.hiro.so", Pb = "http://localhost:3999", Ub = ["mainnet", "testnet", "devnet", "mocknet"];
let $i = class {
  constructor(t) {
    this.version = Co.Mainnet, this.chainId = ki.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Co.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Mb();
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
$i.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Fu();
    case "testnet":
      return new Ob();
    case "devnet":
      return new Hb();
    case "mocknet":
      return new Og();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ub.join(", ")}`);
  }
};
$i.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : $i.fromName(e);
let Fu = class extends $i {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Nb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Co.Mainnet, this.chainId = ki.Mainnet;
  }
}, Ob = class extends $i {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? _b,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Co.Testnet, this.chainId = ki.Testnet;
  }
}, Og = class extends $i {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Pb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Co.Testnet, this.chainId = ki.Testnet;
  }
};
const Hb = Og, Hg = "xtrata.wallet.bridge.v1", Db = (e) => typeof e == "object" && e !== null && e.protocol === Hg, Fb = (e) => Db(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", jb = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class ta extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const Rh = 12e4;
class Rb {
  constructor(t) {
    ea(this, "pending", /* @__PURE__ */ new Map());
    ea(this, "listenTarget");
    ea(this, "closed", !1);
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
    ea(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !Fb(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new ta("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new ta("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ta("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = jb(), o = { protocol: Hg, kind: "request", id: s, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ta(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? Rh}ms.`
          )
        );
      }, this.options.timeoutMs ?? Rh);
      this.pending.set(s, { resolve: i, reject: a, timer: c }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new ta("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const zb = ["SP", "SM"], Gb = ["ST", "SN"], Kb = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return zb.includes(n) ? "mainnet" : Gb.includes(n) ? "testnet" : null;
}, Vb = () => {
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
}, Xb = () => typeof window > "u" || !window.localStorage ? Vb() : window.localStorage, tu = "xtrata.v15.1.wallet.session", zh = "mainnet", Dc = { isConnected: !1 }, Yb = (e) => e.address ? Kb(e.address) ?? e.network : e.network, Dg = (e) => !e.isConnected || !e.address ? { ...Dc } : Yb(e) !== zh ? { ...Dc } : {
  isConnected: !0,
  address: e.address,
  network: zh,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, qb = (e) => {
  if (!e)
    return { ...Dc };
  try {
    const t = JSON.parse(e);
    return Dg(t);
  } catch {
    return { ...Dc };
  }
}, Wb = (e) => {
  const t = Dg(e);
  return JSON.stringify(t);
}, Zb = (e) => {
  const t = Xb();
  return {
    load: () => qb(t.getItem(tu)),
    save: (n) => {
      t.setItem(tu, Wb(n));
    },
    clear: () => {
      t.removeItem(tu);
    }
  };
}, Jb = "https://browser.blockstack.org/auth", Qb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Fg = ["store_write"], e1 = "blockstack-session", t1 = {
  logLevel: "debug"
}, Ko = {
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
Object.freeze(Ko);
class zi extends Error {
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
class n1 extends zi {
  constructor(t, n = "") {
    super({ code: Ko.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class Gh extends zi {
  constructor(t = "") {
    super({ code: Ko.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Xa extends zi {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: Ko.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Kh extends zi {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: Ko.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class ju extends zi {
  constructor(t) {
    super({ code: Ko.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class jg extends zi {
  constructor(t) {
    super({ code: Ko.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const Vh = ["debug", "info", "warn", "error", "none"], Ru = {};
for (let e = 0; e < Vh.length; e++) {
  const t = Vh[e];
  Ru[t] = e;
}
class wi {
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
    return Ru[t1.logLevel] <= Ru[t];
  }
}
function r1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function s1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function nu(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((s) => parseInt(s, 10)), r = t.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function o1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function i1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function a1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function qd(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = i1(), s) {
      const o = s[e];
      if (o)
        return o;
    }
  } catch (o) {
    wi.error(`Error getting object '${e}' from global scope '${s}': ${o}`);
  }
  if (t) {
    const o = a1(s, e.toString(), n);
    throw wi.error(o), new Error(o);
  }
  if (r)
    return {};
}
function no(e, t) {
  return Wd(An(e), t);
}
function An(e) {
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
  if (jn(e, Uint8Array))
    return BigInt(`0x${Ne(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function c1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Xh(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Na(e, t = 8) {
  return (typeof e == "bigint" ? e : An(e)).toString(16).padStart(t * 2, "0");
}
function ml(e) {
  return parseInt(e, 16);
}
function Wd(e, t = 16) {
  const n = Na(e, t);
  return ct(n);
}
function l1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function u1(e, t) {
  return e & BigInt(1) << t;
}
function zu(e) {
  return d1(BigInt(`0x${Ne(e)}`), BigInt(e.byteLength * 8));
}
function d1(e, t) {
  return u1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const f1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Ne(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += f1[n];
  return t;
}
function ct(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = c1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function Vo(e) {
  return new TextEncoder().encode(e);
}
function _a(e) {
  return new TextDecoder().decode(e);
}
function h1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function p1(e) {
  return String.fromCharCode.apply(null, e);
}
function g1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Yh(e) {
  if (e.some(g1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Xr(...e) {
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
function Wt(e) {
  return Xr(...e.map((t) => typeof t == "number" ? Yh([t]) : t instanceof Array ? Yh(t) : t));
}
function jn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const Rg = "https://api.mainnet.hiro.so", zg = "https://api.testnet.hiro.so", Gg = "http://localhost:3999", y1 = "https://hub.blockstack.org", w1 = 33, ru = 32;
function m1(e) {
  if (e.length < ru * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + ru * 2), r = e.slice(2 + ru * 2);
  return {
    recoveryId: ml(t),
    r: n,
    s: r
  };
}
function Zd(e) {
  const t = typeof e == "string" ? ct(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function b1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function x1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function S1(e, t) {
  return e[t];
}
function v1(e, t, n = 0) {
  return e[n] = t, e;
}
function A1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function To(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const E1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function k1(e, t) {
  const n = {};
  return Object.assign(n, E1, t), await fetch(e, n);
}
function $1(e) {
  let t = k1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function I1(...e) {
  const { fetchLib: t, middlewares: n } = $1(e);
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
class Kg {
  constructor(t = Fg.slice(), n = ((a) => (a = qd("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = Jb) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Gu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function L1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Vg(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function C1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Gu(e.outputLen), Gu(e.blockLen);
}
function T1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function B1(e, t) {
  Vg(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const bo = {
  number: Gu,
  bool: L1,
  bytes: Vg,
  hash: C1,
  exists: T1,
  output: B1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const su = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Ur = (e, t) => e << 32 - t | e >>> t, M1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!M1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function N1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Jd(e) {
  if (typeof e == "string" && (e = N1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Xg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Xo(e) {
  const t = (r) => e().update(Jd(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Yg = class extends Xg {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, bo.hash(t);
    const r = Jd(n);
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
    return bo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    bo.exists(this), bo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const bl = (e, t, n) => new Yg(e, t).update(n).digest();
bl.create = (e, t) => new Yg(e, t);
function _1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Qd = class extends Xg {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = su(this.buffer);
  }
  update(t) {
    bo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Jd(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = su(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    bo.exists(this), bo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    _1(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = su(t), c = this.outputLen;
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
const P1 = (e, t, n) => e & t ^ ~e & n, U1 = (e, t, n) => e & t ^ e & n ^ t & n, O1 = new Uint32Array([
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
]), Es = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ks = new Uint32Array(64);
let qg = class extends Qd {
  constructor() {
    super(64, 32, 8, !1), this.A = Es[0] | 0, this.B = Es[1] | 0, this.C = Es[2] | 0, this.D = Es[3] | 0, this.E = Es[4] | 0, this.F = Es[5] | 0, this.G = Es[6] | 0, this.H = Es[7] | 0;
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
      ks[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = ks[d - 15], w = ks[d - 2], v = Ur(m, 7) ^ Ur(m, 18) ^ m >>> 3, A = Ur(w, 17) ^ Ur(w, 19) ^ w >>> 10;
      ks[d] = A + ks[d - 7] + v + ks[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Ur(a, 6) ^ Ur(a, 11) ^ Ur(a, 25), w = h + m + P1(a, c, u) + O1[d] + ks[d] | 0, A = (Ur(r, 2) ^ Ur(r, 13) ^ Ur(r, 22)) + U1(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    ks.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, H1 = class extends qg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ii = Xo(() => new qg());
Xo(() => new H1());
const D1 = {}, Wg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: D1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const it = BigInt(0), _t = BigInt(1), Zs = BigInt(2), ha = BigInt(3), qh = BigInt(8), vt = Object.freeze({
  a: it,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: _t,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Wh = (e, t) => (e + t / Zs) / t, Ya = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = vt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -_t * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = Wh(o * e, t), c = Wh(-r * e, t);
    let u = ge(e - a * n - c * s, t), h = ge(-a * r - c * o, t);
    const d = u > i, m = h > i;
    if (d && (u = t - u), m && (h = t - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: m, k2: h };
  }
}, Lr = 32, Bo = 32, Zg = 32, Fc = Lr + 1, jc = 2 * Lr + 1;
function Zh(e) {
  const { a: t, b: n } = vt, r = ge(e * e), s = ge(r * e);
  return ge(s + t * e + n);
}
const qa = vt.a === it;
class ef extends Error {
  constructor(t) {
    super(t);
  }
}
function Jh(e) {
  if (!(e instanceof ft))
    throw new TypeError("JacobianPoint expected");
}
class ft {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof Ze))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(Ze.ZERO) ? ft.ZERO : new ft(t.x, t.y, _t);
  }
  static toAffineBatch(t) {
    const n = G1(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return ft.toAffineBatch(t).map(ft.fromAffine);
  }
  equals(t) {
    Jh(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t, c = ge(s * s), u = ge(a * a), h = ge(n * u), d = ge(o * c), m = ge(ge(r * a) * u), w = ge(ge(i * s) * c);
    return h === d && m === w;
  }
  negate() {
    return new ft(this.x, ge(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = ge(t * t), o = ge(n * n), i = ge(o * o), a = t + o, c = ge(Zs * (ge(a * a) - s - i)), u = ge(ha * s), h = ge(u * u), d = ge(h - Zs * c), m = ge(u * (c - d) - qh * i), w = ge(Zs * n * r);
    return new ft(d, m, w);
  }
  add(t) {
    Jh(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t;
    if (o === it || i === it)
      return this;
    if (n === it || r === it)
      return t;
    const c = ge(s * s), u = ge(a * a), h = ge(n * u), d = ge(o * c), m = ge(ge(r * a) * u), w = ge(ge(i * s) * c), v = ge(d - h), A = ge(w - m);
    if (v === it)
      return A === it ? this.double() : ft.ZERO;
    const L = ge(v * v), P = ge(v * L), O = ge(h * L), E = ge(A * A - P - Zs * O), M = ge(A * (O - E) - m * P), U = ge(s * a * v);
    return new ft(E, M, U);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = ft.ZERO;
    if (typeof t == "bigint" && t === it)
      return n;
    let r = tp(t);
    if (r === _t)
      return this;
    if (!qa) {
      let d = n, m = this;
      for (; r > it; )
        r & _t && (d = d.add(m)), m = m.double(), r >>= _t;
      return d;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = Ya.splitScalar(r), c = n, u = n, h = this;
    for (; o > it || a > it; )
      o & _t && (c = c.add(h)), a & _t && (u = u.add(h)), h = h.double(), o >>= _t, a >>= _t;
    return s && (c = c.negate()), i && (u = u.negate()), u = new ft(ge(u.x * Ya.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(t) {
    const n = qa ? 128 / t + 1 : 256 / t + 1, r = [];
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
    !n && this.equals(ft.BASE) && (n = Ze.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ku.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ft.normalizeZ(s), Ku.set(n, s)));
    let o = ft.ZERO, i = ft.BASE;
    const a = 1 + (qa ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let m = 0; m < a; m++) {
      const w = m * c;
      let v = Number(t & u);
      t >>= d, v > c && (v -= h, t += _t);
      const A = w, L = w + Math.abs(v) - 1, P = m % 2 !== 0, O = v < 0;
      v === 0 ? i = i.add(Wa(P, s[A])) : o = o.add(Wa(O, s[L]));
    }
    return { p: o, f: i };
  }
  multiply(t, n) {
    let r = tp(t), s, o;
    if (qa) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = Ya.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: m, f: w } = this.wNAF(u, n);
      h = Wa(i, h), m = Wa(c, m), m = new ft(ge(m.x * Ya.beta), m.y, m.z), s = h.add(m), o = d.add(w);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return ft.normalizeZ([s, o])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, o = this.equals(ft.ZERO);
    t == null && (t = o ? qh : Gi(s));
    const i = t, a = ge(i * i), c = ge(a * i), u = ge(n * a), h = ge(r * c), d = ge(s * i);
    if (o)
      return Ze.ZERO;
    if (d !== _t)
      throw new Error("invZ was invalid");
    return new Ze(u, h);
  }
}
ft.BASE = new ft(vt.Gx, vt.Gy, _t);
ft.ZERO = new ft(it, _t, it);
function Wa(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Ku = /* @__PURE__ */ new WeakMap();
class Ze {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Ku.delete(this);
  }
  hasEvenY() {
    return this.y % Zs === it;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = tr(n ? t : t.subarray(1));
    if (!Lc(r))
      throw new Error("Point is not on curve");
    const s = Zh(r);
    let o = z1(s);
    const i = (o & _t) === _t;
    n ? i && (o = ge(-o)) : (t[0] & 1) === 1 !== i && (o = ge(-o));
    const a = new Ze(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = tr(t.subarray(1, Lr + 1)), r = tr(t.subarray(Lr + 1, Lr * 2 + 1)), s = new Ze(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = Yr(t), r = n.length, s = n[0];
    if (r === Lr)
      return this.fromCompressedHex(n);
    if (r === Fc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === jc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Fc} compressed bytes or ${jc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return Ze.BASE.multiply(Mo(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: o } = ey(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = tf(Yr(t)), { n: a } = vt, c = r === 2 || r === 3 ? s + a : s, u = Gi(c, a), h = ge(-i * u, a), d = ge(o * u, a), m = r & 1 ? "03" : "02", w = Ze.fromHex(m + Js(c)), v = Ze.BASE.multiplyAndAddUnsafe(w, h, d);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return Qs(this.toHex(t));
  }
  toHex(t = !1) {
    const n = Js(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Js(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Lc(n) || !Lc(r))
      throw new Error(t);
    const s = ge(r * r), o = Zh(n);
    if (ge(s - o) !== it)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new Ze(this.x, ge(-this.y));
  }
  double() {
    return ft.fromAffine(this).double().toAffine();
  }
  add(t) {
    return ft.fromAffine(this).add(ft.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return ft.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = ft.fromAffine(this), o = n === it || n === _t || this !== Ze.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = ft.fromAffine(t).multiplyUnsafe(r), a = o.add(i);
    return a.equals(ft.ZERO) ? void 0 : a.toAffine();
  }
}
Ze.BASE = new Ze(vt.Gx, vt.Gy);
Ze.ZERO = new Ze(it, it);
function Qh(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function ep(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Li(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: tr(n), left: e.subarray(t + 2) };
}
function F1(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Li(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = ep(e.subarray(2)), { data: r, left: s } = ep(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Li(s)}`);
  return { r: t, s: r };
}
class er {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Li(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new er(Rc(s.slice(0, 64)), Rc(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = F1(n ? t : Qs(t));
    return new er(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Ti(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ti(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = vt.n >> _t;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new er(this.r, ge(-this.s, vt.n)) : this;
  }
  toDERRawBytes() {
    return Qs(this.toDERHex());
  }
  toDERHex() {
    const t = Qh(na(this.s)), n = Qh(na(this.r)), r = t.length / 2, s = n.length / 2, o = na(r), i = na(s);
    return `30${na(s + r + 4)}02${i}${n}02${o}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Qs(this.toCompactHex());
  }
  toCompactHex() {
    return Js(this.r) + Js(this.s);
  }
}
function qs(...e) {
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
const j1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Li(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += j1[e[n]];
  return t;
}
const R1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Js(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(it <= e && e < R1))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Ci(e) {
  const t = Qs(Js(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function na(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function Rc(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function Qs(e) {
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
function tr(e) {
  return Rc(Li(e));
}
function Yr(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Qs(e);
}
function tp(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Ti(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ge(e, t = vt.P) {
  const n = e % t;
  return n >= it ? n : t + n;
}
function cr(e, t) {
  const { P: n } = vt;
  let r = e;
  for (; t-- > it; )
    r *= r, r %= n;
  return r;
}
function z1(e) {
  const { P: t } = vt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, h = cr(u, ha) * u % t, d = cr(h, ha) * u % t, m = cr(d, Zs) * c % t, w = cr(m, r) * m % t, v = cr(w, s) * w % t, A = cr(v, i) * v % t, L = cr(A, a) * A % t, P = cr(L, i) * v % t, O = cr(P, ha) * u % t, E = cr(O, o) * w % t, M = cr(E, n) * c % t, U = cr(M, Zs);
  if (U * U % t !== e)
    throw new Error("Cannot find square root");
  return U;
}
function Gi(e, t = vt.P) {
  if (e === it || t <= it)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = ge(e, t), r = t, s = it, o = _t;
  for (; n !== it; ) {
    const a = r / n, c = r % n, u = s - o * a;
    r = n, n = c, s = o, o = u;
  }
  if (r !== _t)
    throw new Error("invert: does not exist");
  return ge(s, t);
}
function G1(e, t = vt.P) {
  const n = new Array(e.length), r = e.reduce((o, i, a) => i === it ? o : (n[a] = o, ge(o * i, t)), _t), s = Gi(r, t);
  return e.reduceRight((o, i, a) => i === it ? o : (n[a] = ge(o * n[a], t), ge(o * i, t)), s), n;
}
function K1(e) {
  const t = e.length * 8 - Bo * 8, n = tr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function tf(e, t = !1) {
  const n = K1(e);
  if (t)
    return n;
  const { n: r } = vt;
  return n >= r ? n - r : n;
}
let Ai, pa;
class Jg {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return Gt.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return pa(this.k, ...t);
  }
  checkSync() {
    if (typeof pa != "function")
      throw new ef("hmacSha256Sync needs to be set");
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
    return qs(...n);
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
    return qs(...n);
  }
}
function Ti(e) {
  return it < e && e < vt.n;
}
function Lc(e) {
  return it < e && e < vt.P;
}
function Qg(e, t, n, r = !0) {
  const { n: s } = vt, o = tf(e, !0);
  if (!Ti(o))
    return;
  const i = Gi(o, s), a = Ze.BASE.multiply(o), c = ge(a.x, s);
  if (c === it)
    return;
  const u = ge(i * ge(t + n * c, s), s);
  if (u === it)
    return;
  let h = new er(c, u), d = (a.x === h.r ? 0 : 2) | Number(a.y & _t);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function Mo(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Bo)
      throw new Error("Expected 32 bytes of private key");
    t = Rc(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Bo)
      throw new Error("Expected 32 bytes of private key");
    t = tr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ti(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function nf(e) {
  return e instanceof Ze ? (e.assertValidity(), e) : Ze.fromHex(e);
}
function ey(e) {
  if (e instanceof er)
    return e.assertValidity(), e;
  try {
    return er.fromDER(e);
  } catch {
    return er.fromCompact(e);
  }
}
function Pa(e, t = !1) {
  return Ze.fromPrivateKey(e).toRawBytes(t);
}
function V1(e, t, n, r = !1) {
  return Ze.fromSignature(e, t, n).toRawBytes(r);
}
function np(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === Fc || r === jc : n ? r === Fc * 2 || r === jc * 2 : e instanceof Ze;
}
function rf(e, t, n = !1) {
  if (np(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!np(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = nf(t);
  return r.assertValidity(), r.multiply(Mo(e)).toRawBytes(n);
}
function ty(e) {
  const t = e.length > Lr ? e.slice(0, Lr) : e;
  return tr(t);
}
function X1(e) {
  const t = ty(e), n = ge(t, vt.n);
  return ny(n < it ? t : n);
}
function ny(e) {
  return Ci(e);
}
function ry(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = Yr(e), s = Mo(t), o = [ny(s), X1(r)];
  if (n != null) {
    n === !0 && (n = Gt.randomBytes(Lr));
    const c = Yr(n);
    if (c.length !== Lr)
      throw new Error(`sign: Expected ${Lr} bytes of extra data`);
    o.push(c);
  }
  const i = qs(...o), a = ty(r);
  return { seed: i, m: a, d: s };
}
function sy(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, t), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function Y1(e, t, n = {}) {
  const { seed: r, m: s, d: o } = ry(e, t, n.extraEntropy), i = new Jg(Zg, Bo);
  await i.reseed(r);
  let a;
  for (; !(a = Qg(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return sy(a, n);
}
function xl(e, t, n = {}) {
  const { seed: r, m: s, d: o } = ry(e, t, n.extraEntropy), i = new Jg(Zg, Bo);
  i.reseedSync(r);
  let a;
  for (; !(a = Qg(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return sy(a, n);
}
const q1 = { strict: !0 };
function W1(e, t, n, r = q1) {
  let s;
  try {
    s = ey(e), t = Yr(t);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = tf(t);
  let c;
  try {
    c = nf(n);
  } catch {
    return !1;
  }
  const { n: u } = vt, h = Gi(i, u), d = ge(a * h, u), m = ge(o * h, u), w = Ze.BASE.multiplyAndAddUnsafe(c, d, m);
  return w ? ge(w.x, u) === o : !1;
}
function zc(e) {
  return ge(tr(e), vt.n);
}
class Bi {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = Yr(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = tr(n.subarray(0, 32)), s = tr(n.subarray(32, 64));
    return new Bi(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Lc(t) || !Ti(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Js(this.r) + Js(this.s);
  }
  toRawBytes() {
    return Qs(this.toHex());
  }
}
function Z1(e) {
  return Ze.fromPrivateKey(e).toRawX();
}
class oy {
  constructor(t, n, r = Gt.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = Yr(t);
    const { x: s, scalar: o } = this.getScalar(Mo(n));
    if (this.px = s, this.d = o, this.rand = Yr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = Ze.fromPrivateKey(t), r = n.hasEvenY() ? t : vt.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Ci(t ^ tr(n));
  }
  finalizeNonce(t) {
    const n = ge(tr(t), vt.n);
    if (n === it)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(t, n, r, s) {
    return new Bi(t.x, ge(n + r * s, vt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, o = Gt.taggedHash, i = this.initNonce(n, await o(Ys.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await o(Ys.nonce, i, r, t)), h = zc(await o(Ys.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return await cy(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, o = Gt.taggedHashSync, i = this.initNonce(n, o(Ys.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(o(Ys.nonce, i, r, t)), h = zc(o(Ys.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return ly(d, t, r) || this.error(), d;
  }
}
async function J1(e, t, n) {
  return new oy(e, t, n).calc();
}
function Q1(e, t, n) {
  return new oy(e, t, n).calcSync();
}
function iy(e, t, n) {
  const r = e instanceof Bi, s = r ? e : Bi.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: Yr(t),
    P: nf(n)
  };
}
function ay(e, t, n, r) {
  const s = Ze.BASE.multiplyAndAddUnsafe(t, Mo(n), ge(-r, vt.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function cy(e, t, n) {
  try {
    const { r, s, m: o, P: i } = iy(e, t, n), a = zc(await Gt.taggedHash(Ys.challenge, Ci(r), i.toRawX(), o));
    return ay(r, i, s, a);
  } catch {
    return !1;
  }
}
function ly(e, t, n) {
  try {
    const { r, s, m: o, P: i } = iy(e, t, n), a = zc(Gt.taggedHashSync(Ys.challenge, Ci(r), i.toRawX(), o));
    return ay(r, i, s, a);
  } catch (r) {
    if (r instanceof ef)
      throw r;
    return !1;
  }
}
const e2 = {
  Signature: Bi,
  getPublicKey: Z1,
  sign: J1,
  verify: cy,
  signSync: Q1,
  verifySync: ly
};
Ze.BASE._setWindowSize(8);
const Xn = {
  node: Wg,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ys = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Za = {}, Gt = {
  bytesToHex: Li,
  hexToBytes: Qs,
  concatBytes: qs,
  mod: ge,
  invert: Gi,
  isValidPrivateKey(e) {
    try {
      return Mo(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ci,
  _normalizePrivateKey: Mo,
  hashToPrivateKey: (e) => {
    e = Yr(e);
    const t = Bo + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ge(tr(e), vt.n - _t) + _t;
    return Ci(n);
  },
  randomBytes: (e = 32) => {
    if (Xn.web)
      return Xn.web.getRandomValues(new Uint8Array(e));
    if (Xn.node) {
      const { randomBytes: t } = Xn.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Gt.hashToPrivateKey(Gt.randomBytes(Bo + 8)),
  precompute(e = 8, t = Ze.BASE) {
    const n = t === Ze.BASE ? t : new Ze(t.x, t.y);
    return n._setWindowSize(e), n.multiply(ha), n;
  },
  sha256: async (...e) => {
    if (Xn.web) {
      const t = await Xn.web.subtle.digest("SHA-256", qs(...e));
      return new Uint8Array(t);
    } else if (Xn.node) {
      const { createHash: t } = Xn.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (Xn.web) {
      const n = await Xn.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = qs(...t), s = await Xn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Xn.node) {
      const { createHmac: n } = Xn.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = Za[e];
    if (n === void 0) {
      const r = await Gt.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = qs(r, r), Za[e] = n;
    }
    return Gt.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Ai != "function")
      throw new ef("sha256Sync is undefined, you need to set it");
    let n = Za[e];
    if (n === void 0) {
      const r = Ai(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = qs(r, r), Za[e] = n;
    }
    return Ai(n, ...t);
  },
  _JacobianPoint: ft
};
Object.defineProperties(Gt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ai;
    },
    set(e) {
      Ai || (Ai = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return pa;
    },
    set(e) {
      pa || (pa = e);
    }
  }
});
const t2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: vt,
  Point: Ze,
  Signature: er,
  getPublicKey: Pa,
  getSharedSecret: rf,
  recoverPublicKey: V1,
  schnorr: e2,
  sign: Y1,
  signSync: xl,
  utils: Gt,
  verify: W1
}, Symbol.toStringTag, { value: "Module" }));
var Ua = {};
Ua.byteLength = i2;
var n2 = Ua.toByteArray = c2, r2 = Ua.fromByteArray = d2, jr = [], dr = [], s2 = typeof Uint8Array < "u" ? Uint8Array : Array, ou = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var li = 0, o2 = ou.length; li < o2; ++li)
  jr[li] = ou[li], dr[ou.charCodeAt(li)] = li;
dr[45] = 62;
dr[95] = 63;
function uy(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function i2(e) {
  var t = uy(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function a2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function c2(e) {
  var t, n = uy(e), r = n[0], s = n[1], o = new s2(a2(e, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = dr[e.charCodeAt(c)] << 18 | dr[e.charCodeAt(c + 1)] << 12 | dr[e.charCodeAt(c + 2)] << 6 | dr[e.charCodeAt(c + 3)], o[i++] = t >> 16 & 255, o[i++] = t >> 8 & 255, o[i++] = t & 255;
  return s === 2 && (t = dr[e.charCodeAt(c)] << 2 | dr[e.charCodeAt(c + 1)] >> 4, o[i++] = t & 255), s === 1 && (t = dr[e.charCodeAt(c)] << 10 | dr[e.charCodeAt(c + 1)] << 4 | dr[e.charCodeAt(c + 2)] >> 2, o[i++] = t >> 8 & 255, o[i++] = t & 255), o;
}
function l2(e) {
  return jr[e >> 18 & 63] + jr[e >> 12 & 63] + jr[e >> 6 & 63] + jr[e & 63];
}
function u2(e, t, n) {
  for (var r, s = [], o = t; o < n; o += 3)
    r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), s.push(l2(r));
  return s.join("");
}
function d2(e) {
  for (var t, n = e.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(u2(e, i, i + o > a ? a : i + o));
  return r === 1 ? (t = e[n - 1], s.push(
    jr[t >> 2] + jr[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    jr[t >> 10] + jr[t >> 4 & 63] + jr[t << 2 & 63] + "="
  )), s.join("");
}
function f2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const h2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function p2() {
  if (f2())
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
    throw new Error(h2);
  }
}
class g2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createCipher(t, n, r), i = new Uint8Array(Xr(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createDecipher(t, n, r), i = new Uint8Array(Xr(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class y2 {
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
async function dy() {
  const e = await p2();
  return e.name === "subtleCrypto" ? new y2(e.lib) : new g2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function w2(e) {
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
  function h(w) {
    if (w instanceof Uint8Array || (ArrayBuffer.isView(w) ? w = new Uint8Array(w.buffer, w.byteOffset, w.byteLength) : Array.isArray(w) && (w = Uint8Array.from(w))), !(w instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (w.length === 0)
      return "";
    for (var v = 0, A = 0, L = 0, P = w.length; L !== P && w[L] === 0; )
      L++, v++;
    for (var O = (P - L) * u + 1 >>> 0, E = new Uint8Array(O); L !== P; ) {
      for (var M = w[L], U = 0, V = O - 1; (M !== 0 || U < A) && V !== -1; V--, U++)
        M += 256 * E[V] >>> 0, E[V] = M % i >>> 0, M = M / i >>> 0;
      if (M !== 0)
        throw new Error("Non-zero carry");
      A = U, L++;
    }
    for (var ce = O - A; ce !== O && E[ce] === 0; )
      ce++;
    for (var te = a.repeat(v); ce < O; ++ce)
      te += e.charAt(E[ce]);
    return te;
  }
  function d(w) {
    if (typeof w != "string")
      throw new TypeError("Expected String");
    if (w.length === 0)
      return new Uint8Array();
    for (var v = 0, A = 0, L = 0; w[v] === a; )
      A++, v++;
    for (var P = (w.length - v) * c + 1 >>> 0, O = new Uint8Array(P); w[v]; ) {
      var E = w.charCodeAt(v);
      if (E > 255)
        return;
      var M = t[E];
      if (M === 255)
        return;
      for (var U = 0, V = P - 1; (M !== 0 || U < L) && V !== -1; V--, U++)
        M += i * O[V] >>> 0, O[V] = M % 256 >>> 0, M = M / 256 >>> 0;
      if (M !== 0)
        throw new Error("Non-zero carry");
      L = U, v++;
    }
    for (var ce = P - L; ce !== P && O[ce] === 0; )
      ce++;
    for (var te = new Uint8Array(A + (P - ce)), Y = A; ce !== P; )
      te[Y++] = O[ce++];
    return te;
  }
  function m(w) {
    var v = d(w);
    if (v)
      return v;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: d,
    decode: m
  };
}
var fy = w2;
const m2 = fy, b2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var x2 = m2(b2);
const S2 = /* @__PURE__ */ Ug(x2), v2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), hy = Uint8Array.from({ length: 16 }, (e, t) => t), A2 = hy.map((e) => (9 * e + 5) % 16);
let sf = [hy], of = [A2];
for (let e = 0; e < 4; e++)
  for (let t of [sf, of])
    t.push(t[e].map((n) => v2[n]));
const py = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), E2 = sf.map((e, t) => e.map((n) => py[t][n])), k2 = of.map((e, t) => e.map((n) => py[t][n])), $2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), I2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ja = (e, t) => e << t | e >>> 32 - t;
function rp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Qa = new Uint32Array(16);
let L2 = class extends Qd {
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
    for (let w = 0; w < 16; w++, n += 4)
      Qa[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, A = $2[w], L = I2[w], P = sf[w], O = of[w], E = E2[w], M = k2[w];
      for (let U = 0; U < 16; U++) {
        const V = Ja(r + rp(w, o, a, u) + Qa[P[U]] + A, E[U]) + d | 0;
        r = d, d = u, u = Ja(a, 10) | 0, a = o, o = V;
      }
      for (let U = 0; U < 16; U++) {
        const V = Ja(s + rp(v, i, c, h) + Qa[O[U]] + L, M[U]) + m | 0;
        s = m, m = h, h = Ja(c, 10) | 0, c = i, i = V;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Qa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const C2 = Xo(() => new L2());
function T2(e) {
  return C2(e);
}
const ec = BigInt(2 ** 32 - 1), Vu = BigInt(32);
function gy(e, t = !1) {
  return t ? { h: Number(e & ec), l: Number(e >> Vu & ec) } : { h: Number(e >> Vu & ec) | 0, l: Number(e & ec) | 0 };
}
function B2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = gy(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const M2 = (e, t) => BigInt(e >>> 0) << Vu | BigInt(t >>> 0), N2 = (e, t, n) => e >>> n, _2 = (e, t, n) => e << 32 - n | t >>> n, P2 = (e, t, n) => e >>> n | t << 32 - n, U2 = (e, t, n) => e << 32 - n | t >>> n, O2 = (e, t, n) => e << 64 - n | t >>> n - 32, H2 = (e, t, n) => e >>> n - 32 | t << 64 - n, D2 = (e, t) => t, F2 = (e, t) => e, j2 = (e, t, n) => e << n | t >>> 32 - n, R2 = (e, t, n) => t << n | e >>> 32 - n, z2 = (e, t, n) => t << n - 32 | e >>> 64 - n, G2 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function K2(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const V2 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), X2 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Y2 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), q2 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, W2 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Z2 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Ke = {
  fromBig: gy,
  split: B2,
  toBig: M2,
  shrSH: N2,
  shrSL: _2,
  rotrSH: P2,
  rotrSL: U2,
  rotrBH: O2,
  rotrBL: H2,
  rotr32H: D2,
  rotr32L: F2,
  rotlSH: j2,
  rotlSL: R2,
  rotlBH: z2,
  rotlBL: G2,
  add: K2,
  add3L: V2,
  add3H: X2,
  add4L: Y2,
  add4H: q2,
  add5H: Z2,
  add5L: W2
}, [J2, Q2] = Ke.split([
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
].map((e) => BigInt(e))), $s = new Uint32Array(80), Is = new Uint32Array(80);
let Sl = class extends Qd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: A, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, m, w, v, A, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, m, w, v, A, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = A | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      $s[E] = t.getUint32(n), Is[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const M = $s[E - 15] | 0, U = Is[E - 15] | 0, V = Ke.rotrSH(M, U, 1) ^ Ke.rotrSH(M, U, 8) ^ Ke.shrSH(M, U, 7), ce = Ke.rotrSL(M, U, 1) ^ Ke.rotrSL(M, U, 8) ^ Ke.shrSL(M, U, 7), te = $s[E - 2] | 0, Y = Is[E - 2] | 0, b = Ke.rotrSH(te, Y, 19) ^ Ke.rotrBH(te, Y, 61) ^ Ke.shrSH(te, Y, 6), $ = Ke.rotrSL(te, Y, 19) ^ Ke.rotrBL(te, Y, 61) ^ Ke.shrSL(te, Y, 6), N = Ke.add4L(ce, $, Is[E - 7], Is[E - 16]), _ = Ke.add4H(N, V, b, $s[E - 7], $s[E - 16]);
      $s[E] = _ | 0, Is[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: A, Gl: L, Hh: P, Hl: O } = this;
    for (let E = 0; E < 80; E++) {
      const M = Ke.rotrSH(d, m, 14) ^ Ke.rotrSH(d, m, 18) ^ Ke.rotrBH(d, m, 41), U = Ke.rotrSL(d, m, 14) ^ Ke.rotrSL(d, m, 18) ^ Ke.rotrBL(d, m, 41), V = d & w ^ ~d & A, ce = m & v ^ ~m & L, te = Ke.add5L(O, U, ce, Q2[E], Is[E]), Y = Ke.add5H(te, P, M, V, J2[E], $s[E]), b = te | 0, $ = Ke.rotrSH(r, s, 28) ^ Ke.rotrBH(r, s, 34) ^ Ke.rotrBH(r, s, 39), N = Ke.rotrSL(r, s, 28) ^ Ke.rotrBL(r, s, 34) ^ Ke.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, q = s & i ^ s & c ^ i & c;
      P = A | 0, O = L | 0, A = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Ke.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const R = Ke.add3L(b, N, q);
      r = Ke.add3H(R, Y, $, _), s = R | 0;
    }
    ({ h: r, l: s } = Ke.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ke.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ke.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Ke.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Ke.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Ke.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: A, l: L } = Ke.add(this.Gh | 0, this.Gl | 0, A | 0, L | 0), { h: P, l: O } = Ke.add(this.Hh | 0, this.Hl | 0, P | 0, O | 0), this.set(r, s, o, i, a, c, u, h, d, m, w, v, A, L, P, O);
  }
  roundClean() {
    $s.fill(0), Is.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ex = class extends Sl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, tx = class extends Sl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, nx = class extends Sl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const rx = Xo(() => new Sl());
Xo(() => new ex());
Xo(() => new tx());
Xo(() => new nx());
function yy(e) {
  return Ii(e);
}
function sx(e) {
  return rx(e);
}
const ox = 0;
Gt.hmacSha256Sync = (e, ...t) => {
  const n = bl.create(Ii, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ix() {
  return Ne(Gt.randomPrivateKey());
}
function ax(e) {
  const t = Ii(Ii(e));
  return S2.encode(Xr(e, t).slice(0, e.length + 4));
}
function cx(e, t) {
  return ax(Xr(new Uint8Array([e]), t.slice(0, 20)));
}
function wy(e, t = ox) {
  const n = typeof e == "string" ? ct(e) : e, r = T2(yy(n));
  return cx(t, r);
}
function my(e) {
  const t = Zd(e);
  return Ne(Pa(t.slice(0, 32), !0));
}
Gt.hmacSha256Sync = (e, ...t) => {
  const n = bl.create(Ii, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var Gc;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(Gc || (Gc = {}));
async function lx(e, t, n) {
  return await (await dy()).encrypt("aes-256-cbc", t, e, n);
}
async function ux(e, t, n) {
  return await (await dy()).decrypt("aes-256-cbc", t, e, n);
}
function by(e, t) {
  return bl(Ii, e, t);
}
function dx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function xy(e) {
  const t = sx(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function fx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function hx(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Gc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Gc.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !fx(e))
    return t;
  try {
    return Ze.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function px(e, t, n, r) {
  const s = hx(e);
  if (!s.result)
    throw s;
  const o = Gt.randomPrivateKey(), i = Pa(o, !0);
  let a = rf(o, e, !0);
  a = a.slice(1);
  const c = xy(a), u = Gt.randomBytes(16), h = await lx(u, c.encryptionKey, t), d = Xr(u, i, h), m = by(c.hmacKey, d);
  let w;
  if (!r || r === "hex")
    w = Ne(h);
  else if (r === "base64")
    w = r2(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const v = {
    iv: Ne(u),
    ephemeralPK: Ne(i),
    cipherText: w,
    mac: Ne(m),
    wasString: n
  };
  return r && r !== "hex" && (v.cipherTextEncoding = r), v;
}
async function Sy(e, t) {
  if (!t.ephemeralPK)
    throw new Kh("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = rf(e, n, !0);
  r = r.slice(1);
  const s = xy(r), o = ct(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = ct(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = n2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = Xr(o, ct(n), i), c = by(s.hmacKey, a), u = ct(t.mac);
  if (!dx(u, c))
    throw new Kh("Decryption failed: failure in MAC check");
  const h = await ux(o, s.encryptionKey, i);
  return t.wasString ? _a(h) : h;
}
function gx(e, t) {
  const n = typeof t == "string" ? Vo(t) : t, r = my(e), s = yy(n), o = xl(s, e);
  return {
    signature: Ne(o),
    publicKey: r
  };
}
async function yx(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = my(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", o = typeof e == "string" ? Vo(e) : e, i = await px(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = gx(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function wx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return Sy(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var gn = {}, Mi = {}, In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
In.decode = In.encode = In.unescape = In.escape = In.pad = void 0;
const vy = Ua;
function af(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
In.pad = af;
function Ay(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
In.escape = Ay;
function Ey(e) {
  return af(e).replace(/-/g, "+").replace(/_/g, "/");
}
In.unescape = Ey;
function mx(e) {
  return Ay((0, vy.fromByteArray)(new TextEncoder().encode(e)));
}
In.encode = mx;
function bx(e) {
  return new TextDecoder().decode((0, vy.toByteArray)(af(Ey(e))));
}
In.decode = bx;
var vl = {}, Al = {}, ky = {}, $y = {}, El = {};
Object.defineProperty(El, "__esModule", { value: !0 });
El.crypto = void 0;
El.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = o, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = u, e.clean = h, e.createView = d, e.rotr = m, e.rotl = w, e.byteSwap = v, e.byteSwap32 = A, e.bytesToHex = O, e.hexToBytes = U, e.asyncLoop = ce, e.utf8ToBytes = te, e.bytesToUtf8 = Y, e.toBytes = b, e.kdfInputToBytes = $, e.concatBytes = N, e.checkOpts = _, e.createHasher = R, e.createOptHasher = le, e.createXOFer = ue, e.randomBytes = De;
  const t = El;
  function n(I) {
    return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
  }
  function r(I) {
    if (!Number.isSafeInteger(I) || I < 0)
      throw new Error("positive integer expected, got " + I);
  }
  function s(I, ...F) {
    if (!n(I))
      throw new Error("Uint8Array expected");
    if (F.length > 0 && !F.includes(I.length))
      throw new Error("Uint8Array expected of length " + F + ", got length=" + I.length);
  }
  function o(I) {
    if (typeof I != "function" || typeof I.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(I.outputLen), r(I.blockLen);
  }
  function i(I, F = !0) {
    if (I.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (F && I.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(I, F) {
    s(I);
    const de = F.outputLen;
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
    for (let F = 0; F < I.length; F++)
      I[F].fill(0);
  }
  function d(I) {
    return new DataView(I.buffer, I.byteOffset, I.byteLength);
  }
  function m(I, F) {
    return I << 32 - F | I >>> F;
  }
  function w(I, F) {
    return I << F | I >>> 32 - F >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v(I) {
    return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (I) => I : (I) => v(I), e.byteSwapIfBE = e.swap8IfBE;
  function A(I) {
    for (let F = 0; F < I.length; F++)
      I[F] = v(I[F]);
    return I;
  }
  e.swap32IfBE = e.isLE ? (I) => I : A;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", P = /* @__PURE__ */ Array.from({ length: 256 }, (I, F) => F.toString(16).padStart(2, "0"));
  function O(I) {
    if (s(I), L)
      return I.toHex();
    let F = "";
    for (let de = 0; de < I.length; de++)
      F += P[I[de]];
    return F;
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
  function U(I) {
    if (typeof I != "string")
      throw new Error("hex string expected, got " + typeof I);
    if (L)
      return Uint8Array.fromHex(I);
    const F = I.length, de = F / 2;
    if (F % 2)
      throw new Error("hex string expected, got unpadded hex of length " + F);
    const ye = new Uint8Array(de);
    for (let Ce = 0, Te = 0; Ce < de; Ce++, Te += 2) {
      const Ct = M(I.charCodeAt(Te)), He = M(I.charCodeAt(Te + 1));
      if (Ct === void 0 || He === void 0) {
        const Be = I[Te] + I[Te + 1];
        throw new Error('hex string expected, got non-hex character "' + Be + '" at index ' + Te);
      }
      ye[Ce] = Ct * 16 + He;
    }
    return ye;
  }
  const V = async () => {
  };
  e.nextTick = V;
  async function ce(I, F, de) {
    let ye = Date.now();
    for (let Ce = 0; Ce < I; Ce++) {
      de(Ce);
      const Te = Date.now() - ye;
      Te >= 0 && Te < F || (await (0, e.nextTick)(), ye += Te);
    }
  }
  function te(I) {
    if (typeof I != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(I));
  }
  function Y(I) {
    return new TextDecoder().decode(I);
  }
  function b(I) {
    return typeof I == "string" && (I = te(I)), s(I), I;
  }
  function $(I) {
    return typeof I == "string" && (I = te(I)), s(I), I;
  }
  function N(...I) {
    let F = 0;
    for (let ye = 0; ye < I.length; ye++) {
      const Ce = I[ye];
      s(Ce), F += Ce.length;
    }
    const de = new Uint8Array(F);
    for (let ye = 0, Ce = 0; ye < I.length; ye++) {
      const Te = I[ye];
      de.set(Te, Ce), Ce += Te.length;
    }
    return de;
  }
  function _(I, F) {
    if (F !== void 0 && {}.toString.call(F) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(I, F);
  }
  class q {
  }
  e.Hash = q;
  function R(I) {
    const F = (ye) => I().update(b(ye)).digest(), de = I();
    return F.outputLen = de.outputLen, F.blockLen = de.blockLen, F.create = () => I(), F;
  }
  function le(I) {
    const F = (ye, Ce) => I(Ce).update(b(ye)).digest(), de = I({});
    return F.outputLen = de.outputLen, F.blockLen = de.blockLen, F.create = (ye) => I(ye), F;
  }
  function ue(I) {
    const F = (ye, Ce) => I(Ce).update(b(ye)).digest(), de = I({});
    return F.outputLen = de.outputLen, F.blockLen = de.blockLen, F.create = (ye) => I(ye), F;
  }
  e.wrapConstructor = R, e.wrapConstructorWithOpts = le, e.wrapXOFConstructorWithOpts = ue;
  function De(I = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(I));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(I));
    throw new Error("crypto.getRandomValues must be defined");
  }
})($y);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = $y;
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
})(ky);
const ui = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Iy(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Xu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Yo(e, ...t) {
  if (!Iy(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function xx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Xu(e.outputLen), Xu(e.blockLen);
}
function Yu(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ly(e, t) {
  Yo(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Sx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function vx(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Kc(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Cc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function xr(e, t) {
  return e << 32 - t | e >>> t;
}
function Ax(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const cf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function lf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const Cy = cf ? (e) => e : (e) => lf(e), Ex = Cy;
function Ty(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = lf(e[t]);
  return e;
}
const kx = cf ? (e) => e : Ty, By = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", $x = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function uf(e) {
  if (Yo(e), By)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += $x[e[n]];
  return t;
}
const ss = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function sp(e) {
  if (e >= ss._0 && e <= ss._9)
    return e - ss._0;
  if (e >= ss.A && e <= ss.F)
    return e - (ss.A - 10);
  if (e >= ss.a && e <= ss.f)
    return e - (ss.a - 10);
}
function Ix(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (By)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = sp(e.charCodeAt(o)), a = sp(e.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const My = async () => {
};
async function Lx(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < t || (await My(), r += o);
  }
}
function df(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function Cx(e) {
  return new TextDecoder().decode(e);
}
function Oa(e) {
  return typeof e == "string" && (e = df(e)), Yo(e), e;
}
function Tx(e) {
  return typeof e == "string" && (e = df(e)), Yo(e), e;
}
function Bx(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    Yo(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Mx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let Ny = class {
};
function kl(e) {
  const t = (r) => e().update(Oa(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function _y(e) {
  const t = (r, s) => e(s).update(Oa(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function Py(e) {
  const t = (r, s) => e(s).update(Oa(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const Nx = kl, _x = _y, Px = Py;
function Ux(e = 32) {
  if (ui && typeof ui.getRandomValues == "function")
    return ui.getRandomValues(new Uint8Array(e));
  if (ui && typeof ui.randomBytes == "function")
    return Uint8Array.from(ui.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const Ox = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Ny,
  abytes: Yo,
  aexists: Yu,
  ahash: xx,
  anumber: Xu,
  aoutput: Ly,
  asyncLoop: Lx,
  byteSwap: lf,
  byteSwap32: Ty,
  byteSwapIfBE: Ex,
  bytesToHex: uf,
  bytesToUtf8: Cx,
  checkOpts: Mx,
  clean: Kc,
  concatBytes: Bx,
  createHasher: kl,
  createOptHasher: _y,
  createView: Cc,
  createXOFer: Py,
  hexToBytes: Ix,
  isBytes: Iy,
  isLE: cf,
  kdfInputToBytes: Tx,
  nextTick: My,
  randomBytes: Ux,
  rotl: Ax,
  rotr: xr,
  swap32IfBE: kx,
  swap8IfBE: Cy,
  toBytes: Oa,
  u32: vx,
  u8: Sx,
  utf8ToBytes: df,
  wrapConstructor: Nx,
  wrapConstructorWithOpts: _x,
  wrapXOFConstructorWithOpts: Px
}, Symbol.toStringTag, { value: "Module" }));
function Hx(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function Dx(e, t, n) {
  return e & t ^ ~e & n;
}
function Fx(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class jx extends Ny {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Cc(this.buffer);
  }
  update(t) {
    Yu(this), t = Oa(t), Yo(t);
    const { view: n, buffer: r, blockLen: s } = this, o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Cc(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Yu(this), Ly(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, Kc(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    Hx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Cc(t), c = this.outputLen;
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
const Ls = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Cs = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Rx = /* @__PURE__ */ Uint32Array.from([
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
]), Ts = /* @__PURE__ */ new Uint32Array(64);
let ff = class extends jx {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = Ls[0] | 0, this.B = Ls[1] | 0, this.C = Ls[2] | 0, this.D = Ls[3] | 0, this.E = Ls[4] | 0, this.F = Ls[5] | 0, this.G = Ls[6] | 0, this.H = Ls[7] | 0;
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
      Ts[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Ts[d - 15], w = Ts[d - 2], v = xr(m, 7) ^ xr(m, 18) ^ m >>> 3, A = xr(w, 17) ^ xr(w, 19) ^ w >>> 10;
      Ts[d] = A + Ts[d - 7] + v + Ts[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = xr(a, 6) ^ xr(a, 11) ^ xr(a, 25), w = h + m + Dx(a, c, u) + Rx[d] + Ts[d] | 0, A = (xr(r, 2) ^ xr(r, 13) ^ xr(r, 22)) + Fx(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Kc(Ts);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Kc(this.buffer);
  }
}, Uy = class extends ff {
  constructor() {
    super(28), this.A = Cs[0] | 0, this.B = Cs[1] | 0, this.C = Cs[2] | 0, this.D = Cs[3] | 0, this.E = Cs[4] | 0, this.F = Cs[5] | 0, this.G = Cs[6] | 0, this.H = Cs[7] | 0;
  }
};
const zx = /* @__PURE__ */ kl(() => new ff()), Gx = /* @__PURE__ */ kl(() => new Uy()), Kx = ff, hf = zx, Vx = Uy, Xx = Gx, Yx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Vx,
  SHA256: Kx,
  sha224: Xx,
  sha256: hf
}, Symbol.toStringTag, { value: "Module" })), $l = /* @__PURE__ */ wl(Yx), qx = /* @__PURE__ */ wl(t2);
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.joseToDer = Ni.derToJose = void 0;
const Oy = Ua, Hy = In;
function iu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const Wx = {
  ES256: iu(256),
  ES384: iu(384),
  ES512: iu(521)
};
function Dy(e) {
  const t = Wx[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const Vc = 128, Fy = 0, Zx = 32, Jx = 16, Qx = 2, jy = Jx | Zx | Fy << 6, Xc = Qx | Fy << 6;
function Ry(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, Oy.toByteArray)((0, Hy.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function eS(e, t) {
  const n = Ry(e), r = Dy(t), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== jy)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (Vc | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== Xc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = i;
  if (i += c, n[i++] !== Xc)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (o - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${o - i}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const d = i;
  if (i += h, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const m = r - c, w = r - h, v = new Uint8Array(m + c + w + h);
  for (i = 0; i < m; ++i)
    v[i] = 0;
  v.set(n.subarray(u + Math.max(-m, 0), u + c), i), i = r;
  for (const A = i; i < A + w; ++i)
    v[i] = 0;
  return v.set(n.subarray(d + Math.max(-w, 0), d + h), i), (0, Hy.escape)((0, Oy.fromByteArray)(v));
}
Ni.derToJose = eS;
function op(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= Vc && --r, r;
}
function tS(e, t) {
  e = Ry(e);
  const n = Dy(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = op(e, 0, n), o = op(e, n, e.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, u = c < Vc, h = new Uint8Array((u ? 2 : 3) + c);
  let d = 0;
  return h[d++] = jy, u ? h[d++] = c : (h[d++] = Vc | 1, h[d++] = c & 255), h[d++] = Xc, h[d++] = i, s < 0 ? (h[d++] = 0, h.set(e.subarray(0, n), d), d += n) : (h.set(e.subarray(s, n), d), d += n - s), h[d++] = Xc, h[d++] = a, o < 0 ? (h[d++] = 0, h.set(e.subarray(n), d)) : h.set(e.subarray(n + o), d), h;
}
Ni.joseToDer = tS;
var hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
hs.InvalidTokenError = hs.MissingParametersError = void 0;
class nS extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
hs.MissingParametersError = nS;
class rS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
hs.InvalidTokenError = rS;
const Ha = /* @__PURE__ */ wl(Ox);
Object.defineProperty(Al, "__esModule", { value: !0 });
Al.SECP256K1Client = void 0;
const sS = ky, oS = $l, Tc = qx, ip = Ni, ap = hs, cp = Ha;
Tc.utils.hmacSha256Sync = (e, ...t) => {
  const n = sS.hmac.create(oS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class zy {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, cp.bytesToHex)(Tc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new ap.MissingParametersError("a signing input hash and private key are all required");
    const s = Tc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, cp.bytesToHex)(s);
    if (r === "jose")
      return (0, ip.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, ip.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new ap.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Tc.verify(n, t, r, { strict: !1 });
  }
}
Al.SECP256K1Client = zy;
zy.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = Al;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(vl);
var No = {};
const iS = /* @__PURE__ */ wl(Wg);
var aS = Cn && Cn.__awaiter || function(e, t, n, r) {
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
Object.defineProperty(No, "__esModule", { value: !0 });
No.hashSha256Async = No.hashSha256 = void 0;
const cS = $l;
function Gy(e) {
  return (0, cS.sha256)(e);
}
No.hashSha256 = Gy;
function lS(e) {
  return aS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = iS;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Gy(e));
    }
  });
}
No.hashSha256Async = lS;
var uS = Cn && Cn.__awaiter || function(e, t, n, r) {
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
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.TokenSigner = Mi.createUnsecuredToken = void 0;
const qu = In, lp = vl, dS = hs, up = No;
function Wu(e, t) {
  const n = [], r = qu.encode(JSON.stringify(t));
  n.push(r);
  const s = qu.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function fS(e) {
  return Wu(e, { typ: "JWT", alg: "none" }) + ".";
}
Mi.createUnsecuredToken = fS;
class hS {
  constructor(t, n) {
    if (!(t && n))
      throw new dS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !lp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = lp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), o = Wu(t, s), i = (0, up.hashSha256)(o);
    return this.createWithSignedHash(t, n, s, o, i);
  }
  signAsync(t, n = !1, r = {}) {
    return uS(this, void 0, void 0, function* () {
      const s = this.header(r), o = Wu(t, s), i = yield (0, up.hashSha256Async)(o);
      return this.createWithSignedHash(t, n, s, o, i);
    });
  }
  createWithSignedHash(t, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [qu.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [s, i].join(".");
  }
}
Mi.TokenSigner = hS;
var Il = {};
Object.defineProperty(Il, "__esModule", { value: !0 });
Il.TokenVerifier = void 0;
const pS = In, dp = vl, gS = hs, tc = No;
class yS {
  constructor(t, n) {
    if (!(t && n))
      throw new gS.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !dp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = dp.cryptoClients[t], this.rawPublicKey = n;
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
      return (0, tc.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, tc.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), pS.encode(t.payload)].join(".");
    let s = !0;
    const o = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, tc.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, tc.hashSha256)(r);
      return o(i);
    }
  }
}
Il.TokenVerifier = yS;
var Ll = {};
Object.defineProperty(Ll, "__esModule", { value: !0 });
Ll.decodeToken = void 0;
const nc = In;
function wS(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(nc.decode(t[0])), r = JSON.parse(nc.decode(t[1])), s = t[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = nc.decode(t));
    const n = [];
    return e.header.map((r) => {
      const s = JSON.parse(nc.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
Ll.decodeToken = wS;
(function(e) {
  var t = Cn && Cn.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = Cn && Cn.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && t(s, r, o);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Mi, e), n(Il, e), n(Ll, e), n(hs, e), n(vl, e);
})(gn);
function mS(e) {
  return `did:btc-addr:${e}`;
}
function bS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new Gh("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new Gh('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function Ky(e) {
  if (e)
    return bS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const xS = "1.4.0";
function SS() {
  return ix();
}
function vS(e, t, n, r = Fg.slice(), s, o = r1().getTime(), i = {}) {
  const a = (w) => {
    const v = qd("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${w}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: o1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: xS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = gn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [u];
  const h = wy(u);
  return c.iss = mS(h), new gn.TokenSigner("ES256k", e).sign(c);
}
async function fp(e, t) {
  const n = _a(ct(t)), r = JSON.parse(n), s = await Sy(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function AS(e) {
  const t = gn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new gn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function ES(e) {
  const t = gn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = Ky(t.iss);
  if (n.length === 1) {
    if (wy(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function kS(e) {
  const t = gn.decodeToken(e).payload;
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
function $S(e) {
  const t = gn.decodeToken(e).payload;
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
function IS(e) {
  const t = [
    $S(e),
    kS(e),
    AS(e),
    ES(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const hp = "1.0.0";
class eo {
  constructor(t) {
    this.version = hp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== hp)
      throw new ju(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new eo(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Vy {
  constructor(t) {
    if (t) {
      const n = new eo(t);
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
class pp extends Vy {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new eo({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new jg("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new eo({})), !0;
  }
}
class gp extends Vy {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = e1, !localStorage.getItem(this.key)) {
      const r = new eo({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new jg("No session data was found in localStorage");
    const n = JSON.parse(t);
    return eo.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new eo({})), !0;
  }
}
var Sa;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Sa || (Sa = {}));
var Yc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Yc || (Yc = {}));
Sa.Mainnet;
var us;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(us || (us = {}));
var Gr;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Gr || (Gr = {}));
us.Mainnet;
const Xy = {
  chainId: Sa.Mainnet,
  transactionVersion: us.Mainnet,
  peerNetworkId: Yc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Gr.MainnetSingleSig,
    multiSig: Gr.MainnetMultiSig
  },
  client: { baseUrl: Rg }
}, Zu = {
  chainId: Sa.Testnet,
  transactionVersion: us.Testnet,
  peerNetworkId: Yc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Gr.TestnetSingleSig,
    multiSig: Gr.TestnetMultiSig
  },
  client: { baseUrl: zg }
}, Bc = {
  ...Zu,
  addressVersion: { ...Zu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Gg }
}, LS = {
  ...Bc,
  addressVersion: { ...Bc.addressVersion },
  client: { ...Bc.client }
};
function CS(e) {
  switch (e) {
    case "mainnet":
      return Xy;
    case "testnet":
      return Zu;
    case "devnet":
      return Bc;
    case "mocknet":
      return LS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Yy(e) {
  return typeof e == "string" ? CS(e) : e;
}
var yp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(yp || (yp = {}));
var wp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(wp || (wp = {}));
var vr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(vr || (vr = {}));
const au = ["onChainOnly", "offChainOnly", "any"];
au[0] + "", vr.OnChainOnly, au[1] + "", vr.OffChainOnly, au[2] + "", vr.Any, vr.OnChainOnly + "", vr.OnChainOnly, vr.OffChainOnly + "", vr.OffChainOnly, vr.Any + "", vr.Any;
var mp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(mp || (mp = {}));
var bp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(bp || (bp = {}));
var xp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(xp || (xp = {}));
var cs;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(cs || (cs = {}));
var Sp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Sp || (Sp = {}));
var vp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(vp || (vp = {}));
var Ap;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Ap || (Ap = {}));
var Ep;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Ep || (Ep = {}));
var kp;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(kp || (kp = {}));
var $p;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})($p || ($p = {}));
var Ip;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ip || (Ip = {}));
var Lp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Lp || (Lp = {}));
var Cp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Cp || (Cp = {}));
function Ju(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function TS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function qy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function BS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ju(e.outputLen), Ju(e.blockLen);
}
function MS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function NS(e, t) {
  qy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const xo = {
  number: Ju,
  bool: TS,
  bytes: qy,
  hash: BS,
  exists: MS,
  output: NS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const cu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Or = (e, t) => e << 32 - t | e >>> t, _S = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_S)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function PS(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function pf(e) {
  if (typeof e == "string" && (e = PS(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Wy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function qo(e) {
  const t = (r) => e().update(pf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Zy = class extends Wy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, xo.hash(t);
    const r = pf(n);
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
    return xo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    xo.exists(this), xo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const Jy = (e, t, n) => new Zy(e, t).update(n).digest();
Jy.create = (e, t) => new Zy(e, t);
function US(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let gf = class extends Wy {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = cu(this.buffer);
  }
  update(t) {
    xo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = pf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = cu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    xo.exists(this), xo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    US(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = cu(t), c = this.outputLen;
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
const OS = (e, t, n) => e & t ^ ~e & n, HS = (e, t, n) => e & t ^ e & n ^ t & n, DS = new Uint32Array([
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
]), Bs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ms = new Uint32Array(64);
let Qy = class extends gf {
  constructor() {
    super(64, 32, 8, !1), this.A = Bs[0] | 0, this.B = Bs[1] | 0, this.C = Bs[2] | 0, this.D = Bs[3] | 0, this.E = Bs[4] | 0, this.F = Bs[5] | 0, this.G = Bs[6] | 0, this.H = Bs[7] | 0;
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
      Ms[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Ms[d - 15], w = Ms[d - 2], v = Or(m, 7) ^ Or(m, 18) ^ m >>> 3, A = Or(w, 17) ^ Or(w, 19) ^ w >>> 10;
      Ms[d] = A + Ms[d - 7] + v + Ms[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Or(a, 6) ^ Or(a, 11) ^ Or(a, 25), w = h + m + OS(a, c, u) + DS[d] + Ms[d] | 0, A = (Or(r, 2) ^ Or(r, 13) ^ Or(r, 22)) + HS(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Ms.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, FS = class extends Qy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ew = qo(() => new Qy());
qo(() => new FS());
var Wo = {}, yf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = Ha;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], u = 0;
    for (let w = i.length - 1; w >= 0; w--)
      if (u < 4) {
        const v = n.indexOf(i[w]) >> u;
        let A = 0;
        w !== 0 && (A = n.indexOf(i[w - 1]));
        const L = 1 + u, P = A % (1 << L) << 5 - L, O = e.c32[v + P];
        u = L, c.unshift(O);
      } else
        u = 0;
    let h = 0;
    for (let w = 0; w < c.length && c[w] === "0"; w++)
      h++;
    c = c.slice(h);
    const d = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), m = d ? d[0].length : 0;
    for (let w = 0; w < m; w++)
      c.unshift(e.c32[0]);
    if (a) {
      const w = a - c.length;
      for (let v = 0; v < w; v++)
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
    let h = [], d = 0, m = 0;
    for (let A = i.length - 1; A >= 0; A--) {
      m === 4 && (h.unshift(n[d]), m = 0, d = 0);
      const P = (e.c32.indexOf(i[A]) << m) + d, O = n[P % 16];
      if (m += 1, d = P >> 4, d > 1 << m)
        throw new Error("Panic error in decoding.");
      h.unshift(O);
    }
    h.unshift(n[d]), h.length % 2 === 1 && h.unshift("0");
    let w = 0;
    for (let A = 0; A < h.length && h[A] === "0"; A++)
      w++;
    h = h.slice(w - w % 2);
    let v = h.join("");
    for (let A = 0; A < u; A++)
      v = `00${v}`;
    if (a) {
      const A = a * 2 - v.length;
      for (let L = 0; L < A; L += 2)
        v = `00${v}`;
    }
    return v;
  }
  e.c32decode = o;
})(yf);
var _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
_o.c32checkDecode = _o.c32checkEncode = void 0;
const Tp = $l, Bp = Ha, ga = yf;
function tw(e) {
  const t = (0, Tp.sha256)((0, Tp.sha256)((0, Bp.hexToBytes)(e)));
  return (0, Bp.bytesToHex)(t.slice(0, 4));
}
function jS(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = tw(`${n}${t}`), s = (0, ga.c32encode)(`${t}${r}`);
  return `${ga.c32[e]}${s}`;
}
_o.c32checkEncode = jS;
function RS(e) {
  e = (0, ga.c32normalize)(e);
  const t = (0, ga.c32decode)(e.slice(1)), n = e[0], r = ga.c32.indexOf(n), s = t.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), tw(`${o}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
_o.c32checkDecode = RS;
var nw = {}, _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.decode = _i.encode = void 0;
const qc = $l, Mp = Ha, rw = fy, sw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function zS(e, t = "00") {
  const n = typeof e == "string" ? (0, Mp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, Mp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, qc.sha256)((0, qc.sha256)(new Uint8Array([...r, ...n])));
  return rw(sw).encode([...r, ...n, ...s.slice(0, 4)]);
}
_i.encode = zS;
function GS(e) {
  const t = rw(sw).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, qc.sha256)((0, qc.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
_i.decode = GS;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = _o, n = _i, r = Ha;
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
    const m = n.decode(h), w = (0, r.bytesToHex)(m.data), v = parseInt((0, r.bytesToHex)(m.prefix), 16);
    let A;
    return d < 0 ? (A = v, s[v] !== void 0 && (A = s[v])) : A = d, i(A, w);
  }
  e.b58ToC32 = c;
  function u(h, d = -1) {
    const m = a(h), w = m[0], v = m[1];
    let A;
    d < 0 ? (A = w, o[w] !== void 0 && (A = o[w])) : A = d;
    let L = A.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(v, L);
  }
  e.c32ToB58 = u;
})(nw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = yf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = _o;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = nw;
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
})(Wo);
function KS(e, t) {
  switch (t = Yy(t ?? Xy), e) {
    case cs.P2PKH:
      switch (t.transactionVersion) {
        case us.Mainnet:
          return Gr.MainnetSingleSig;
        case us.Testnet:
          return Gr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case cs.P2SH:
    case cs.P2SHNonSequential:
    case cs.P2WPKH:
    case cs.P2WSH:
    case cs.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case us.Mainnet:
          return Gr.MainnetMultiSig;
        case us.Testnet:
          return Gr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const VS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ow = Uint8Array.from({ length: 16 }, (e, t) => t), XS = ow.map((e) => (9 * e + 5) % 16);
let wf = [ow], mf = [XS];
for (let e = 0; e < 4; e++)
  for (let t of [wf, mf])
    t.push(t[e].map((n) => VS[n]));
const iw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), YS = wf.map((e, t) => e.map((n) => iw[t][n])), qS = mf.map((e, t) => e.map((n) => iw[t][n])), WS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ZS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), rc = (e, t) => e << t | e >>> 32 - t;
function Np(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const sc = new Uint32Array(16);
let JS = class extends gf {
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
    for (let w = 0; w < 16; w++, n += 4)
      sc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, A = WS[w], L = ZS[w], P = wf[w], O = mf[w], E = YS[w], M = qS[w];
      for (let U = 0; U < 16; U++) {
        const V = rc(r + Np(w, o, a, u) + sc[P[U]] + A, E[U]) + d | 0;
        r = d, d = u, u = rc(a, 10) | 0, a = o, o = V;
      }
      for (let U = 0; U < 16; U++) {
        const V = rc(s + Np(v, i, c, h) + sc[O[U]] + L, M[U]) + m | 0;
        s = m, m = h, h = rc(c, 10) | 0, c = i, i = V;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    sc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const QS = qo(() => new JS()), oc = BigInt(2 ** 32 - 1), Qu = BigInt(32);
function aw(e, t = !1) {
  return t ? { h: Number(e & oc), l: Number(e >> Qu & oc) } : { h: Number(e >> Qu & oc) | 0, l: Number(e & oc) | 0 };
}
function ev(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = aw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const tv = (e, t) => BigInt(e >>> 0) << Qu | BigInt(t >>> 0), nv = (e, t, n) => e >>> n, rv = (e, t, n) => e << 32 - n | t >>> n, sv = (e, t, n) => e >>> n | t << 32 - n, ov = (e, t, n) => e << 32 - n | t >>> n, iv = (e, t, n) => e << 64 - n | t >>> n - 32, av = (e, t, n) => e >>> n - 32 | t << 64 - n, cv = (e, t) => t, lv = (e, t) => e, uv = (e, t, n) => e << n | t >>> 32 - n, dv = (e, t, n) => t << n | e >>> 32 - n, fv = (e, t, n) => t << n - 32 | e >>> 64 - n, hv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function pv(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const gv = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), yv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, wv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), mv = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, bv = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), xv = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Ve = {
  fromBig: aw,
  split: ev,
  toBig: tv,
  shrSH: nv,
  shrSL: rv,
  rotrSH: sv,
  rotrSL: ov,
  rotrBH: iv,
  rotrBL: av,
  rotr32H: cv,
  rotr32L: lv,
  rotlSH: uv,
  rotlSL: dv,
  rotlBH: fv,
  rotlBL: hv,
  add: pv,
  add3L: gv,
  add3H: yv,
  add4L: wv,
  add4H: mv,
  add5H: xv,
  add5L: bv
}, [Sv, vv] = Ve.split([
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
].map((e) => BigInt(e))), Ns = new Uint32Array(80), _s = new Uint32Array(80);
let Cl = class extends gf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: A, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, m, w, v, A, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, m, w, v, A, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = A | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Ns[E] = t.getUint32(n), _s[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const M = Ns[E - 15] | 0, U = _s[E - 15] | 0, V = Ve.rotrSH(M, U, 1) ^ Ve.rotrSH(M, U, 8) ^ Ve.shrSH(M, U, 7), ce = Ve.rotrSL(M, U, 1) ^ Ve.rotrSL(M, U, 8) ^ Ve.shrSL(M, U, 7), te = Ns[E - 2] | 0, Y = _s[E - 2] | 0, b = Ve.rotrSH(te, Y, 19) ^ Ve.rotrBH(te, Y, 61) ^ Ve.shrSH(te, Y, 6), $ = Ve.rotrSL(te, Y, 19) ^ Ve.rotrBL(te, Y, 61) ^ Ve.shrSL(te, Y, 6), N = Ve.add4L(ce, $, _s[E - 7], _s[E - 16]), _ = Ve.add4H(N, V, b, Ns[E - 7], Ns[E - 16]);
      Ns[E] = _ | 0, _s[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: A, Gl: L, Hh: P, Hl: O } = this;
    for (let E = 0; E < 80; E++) {
      const M = Ve.rotrSH(d, m, 14) ^ Ve.rotrSH(d, m, 18) ^ Ve.rotrBH(d, m, 41), U = Ve.rotrSL(d, m, 14) ^ Ve.rotrSL(d, m, 18) ^ Ve.rotrBL(d, m, 41), V = d & w ^ ~d & A, ce = m & v ^ ~m & L, te = Ve.add5L(O, U, ce, vv[E], _s[E]), Y = Ve.add5H(te, P, M, V, Sv[E], Ns[E]), b = te | 0, $ = Ve.rotrSH(r, s, 28) ^ Ve.rotrBH(r, s, 34) ^ Ve.rotrBH(r, s, 39), N = Ve.rotrSL(r, s, 28) ^ Ve.rotrBL(r, s, 34) ^ Ve.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, q = s & i ^ s & c ^ i & c;
      P = A | 0, O = L | 0, A = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Ve.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const R = Ve.add3L(b, N, q);
      r = Ve.add3H(R, Y, $, _), s = R | 0;
    }
    ({ h: r, l: s } = Ve.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ve.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ve.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Ve.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Ve.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Ve.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: A, l: L } = Ve.add(this.Gh | 0, this.Gl | 0, A | 0, L | 0), { h: P, l: O } = Ve.add(this.Hh | 0, this.Hl | 0, P | 0, O | 0), this.set(r, s, o, i, a, c, u, h, d, m, w, v, A, L, P, O);
  }
  roundClean() {
    Ns.fill(0), _s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Av = class extends Cl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ev = class extends Cl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, kv = class extends Cl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
qo(() => new Cl());
qo(() => new Av());
qo(() => new Ev());
qo(() => new kv());
var Wc = { exports: {} };
Wc.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", m = "[object Map]", w = "[object Number]", v = "[object Object]", A = "[object Promise]", L = "[object RegExp]", P = "[object Set]", O = "[object String]", E = "[object Symbol]", M = "[object WeakMap]", U = "[object ArrayBuffer]", V = "[object DataView]", ce = "[object Float32Array]", te = "[object Float64Array]", Y = "[object Int8Array]", b = "[object Int16Array]", $ = "[object Int32Array]", N = "[object Uint8Array]", _ = "[object Uint8ClampedArray]", q = "[object Uint16Array]", R = "[object Uint32Array]", le = /[\\^$.*+?()[\]{}|]/g, ue = /\w*$/, De = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, F = {};
  F[o] = F[i] = F[U] = F[V] = F[a] = F[c] = F[ce] = F[te] = F[Y] = F[b] = F[$] = F[m] = F[w] = F[v] = F[L] = F[P] = F[O] = F[E] = F[N] = F[_] = F[q] = F[R] = !0, F[u] = F[h] = F[M] = !1;
  var de = typeof Cn == "object" && Cn && Cn.Object === Object && Cn, ye = typeof self == "object" && self && self.Object === Object && self, Ce = de || ye || Function("return this")(), Te = t && !t.nodeType && t, Ct = Te && !0 && e && !e.nodeType && e, He = Ct && Ct.exports === Te;
  function Be(S, B) {
    return S.set(B[0], B[1]), S;
  }
  function _e(S, B) {
    return S.add(B), S;
  }
  function en(S, B) {
    for (var D = -1, Z = S ? S.length : 0; ++D < Z && B(S[D], D, S) !== !1; )
      ;
    return S;
  }
  function Kt(S, B) {
    for (var D = -1, Z = B.length, xe = S.length; ++D < Z; )
      S[xe + D] = B[D];
    return S;
  }
  function Qe(S, B, D, Z) {
    for (var xe = -1, je = S ? S.length : 0; ++xe < je; )
      D = B(D, S[xe], xe, S);
    return D;
  }
  function Jt(S, B) {
    for (var D = -1, Z = Array(S); ++D < S; )
      Z[D] = B(D);
    return Z;
  }
  function yt(S, B) {
    return S == null ? void 0 : S[B];
  }
  function G(S) {
    var B = !1;
    if (S != null && typeof S.toString != "function")
      try {
        B = !!(S + "");
      } catch {
      }
    return B;
  }
  function H(S) {
    var B = -1, D = Array(S.size);
    return S.forEach(function(Z, xe) {
      D[++B] = [xe, Z];
    }), D;
  }
  function Q(S, B) {
    return function(D) {
      return S(B(D));
    };
  }
  function J(S) {
    var B = -1, D = Array(S.size);
    return S.forEach(function(Z) {
      D[++B] = Z;
    }), D;
  }
  var fe = Array.prototype, lt = Function.prototype, Ie = Object.prototype, Ue = Ce["__core-js_shared__"], ht = function() {
    var S = /[^.]+$/.exec(Ue && Ue.keys && Ue.keys.IE_PROTO || "");
    return S ? "Symbol(src)_1." + S : "";
  }(), Pe = lt.toString, Ae = Ie.hasOwnProperty, ze = Ie.toString, Fe = RegExp(
    "^" + Pe.call(Ae).replace(le, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ve = He ? Ce.Buffer : void 0, Tt = Ce.Symbol, yn = Ce.Uint8Array, En = Q(Object.getPrototypeOf, Object), wt = Object.create, tn = Ie.propertyIsEnumerable, Bn = fe.splice, sr = Object.getOwnPropertySymbols, Nr = ve ? ve.isBuffer : void 0, or = Q(Object.keys, Object), Rn = $t(Ce, "DataView"), Ut = $t(Ce, "Map"), nn = $t(Ce, "Promise"), ut = $t(Ce, "Set"), Qt = $t(Ce, "WeakMap"), Mn = $t(Object, "create"), Jr = Un(Rn), Nn = Un(Ut), y = Un(nn), C = Un(ut), j = Un(Qt), z = Tt ? Tt.prototype : void 0, ae = z ? z.valueOf : void 0;
  function re(S) {
    var B = -1, D = S ? S.length : 0;
    for (this.clear(); ++B < D; ) {
      var Z = S[B];
      this.set(Z[0], Z[1]);
    }
  }
  function Le() {
    this.__data__ = Mn ? Mn(null) : {};
  }
  function Se(S) {
    return this.has(S) && delete this.__data__[S];
  }
  function Me(S) {
    var B = this.__data__;
    if (Mn) {
      var D = B[S];
      return D === r ? void 0 : D;
    }
    return Ae.call(B, S) ? B[S] : void 0;
  }
  function mt(S) {
    var B = this.__data__;
    return Mn ? B[S] !== void 0 : Ae.call(B, S);
  }
  function be(S, B) {
    var D = this.__data__;
    return D[S] = Mn && B === void 0 ? r : B, this;
  }
  re.prototype.clear = Le, re.prototype.delete = Se, re.prototype.get = Me, re.prototype.has = mt, re.prototype.set = be;
  function et(S) {
    var B = -1, D = S ? S.length : 0;
    for (this.clear(); ++B < D; ) {
      var Z = S[B];
      this.set(Z[0], Z[1]);
    }
  }
  function st() {
    this.__data__ = [];
  }
  function tt(S) {
    var B = this.__data__, D = rn(B, S);
    if (D < 0)
      return !1;
    var Z = B.length - 1;
    return D == Z ? B.pop() : Bn.call(B, D, 1), !0;
  }
  function Ft(S) {
    var B = this.__data__, D = rn(B, S);
    return D < 0 ? void 0 : B[D][1];
  }
  function Bt(S) {
    return rn(this.__data__, S) > -1;
  }
  function gt(S, B) {
    var D = this.__data__, Z = rn(D, S);
    return Z < 0 ? D.push([S, B]) : D[Z][1] = B, this;
  }
  et.prototype.clear = st, et.prototype.delete = tt, et.prototype.get = Ft, et.prototype.has = Bt, et.prototype.set = gt;
  function kt(S) {
    var B = -1, D = S ? S.length : 0;
    for (this.clear(); ++B < D; ) {
      var Z = S[B];
      this.set(Z[0], Z[1]);
    }
  }
  function _r() {
    this.__data__ = {
      hash: new re(),
      map: new (Ut || et)(),
      string: new re()
    };
  }
  function Ge(S) {
    return es(this, S).delete(S);
  }
  function Vt(S) {
    return es(this, S).get(S);
  }
  function _n(S) {
    return es(this, S).has(S);
  }
  function Pn(S, B) {
    return es(this, S).set(S, B), this;
  }
  kt.prototype.clear = _r, kt.prototype.delete = Ge, kt.prototype.get = Vt, kt.prototype.has = _n, kt.prototype.set = Pn;
  function zn(S) {
    this.__data__ = new et(S);
  }
  function wn() {
    this.__data__ = new et();
  }
  function kn(S) {
    return this.__data__.delete(S);
  }
  function ln(S) {
    return this.__data__.get(S);
  }
  function ys(S) {
    return this.__data__.has(S);
  }
  function gr(S, B) {
    var D = this.__data__;
    if (D instanceof et) {
      var Z = D.__data__;
      if (!Ut || Z.length < n - 1)
        return Z.push([S, B]), this;
      D = this.__data__ = new kt(Z);
    }
    return D.set(S, B), this;
  }
  zn.prototype.clear = wn, zn.prototype.delete = kn, zn.prototype.get = ln, zn.prototype.has = ys, zn.prototype.set = gr;
  function ti(S, B) {
    var D = K(S) || k(S) ? Jt(S.length, String) : [], Z = D.length, xe = !!Z;
    for (var je in S)
      Ae.call(S, je) && !(xe && (je == "length" || ar(je, Z))) && D.push(je);
    return D;
  }
  function ni(S, B, D) {
    var Z = S[B];
    (!(Ae.call(S, B) && x(Z, D)) || D === void 0 && !(B in S)) && (S[B] = D);
  }
  function rn(S, B) {
    for (var D = S.length; D--; )
      if (x(S[D][0], B))
        return D;
    return -1;
  }
  function oo(S, B) {
    return S && xs(B, ne(B), S);
  }
  function io(S, B, D, Z, xe, je, Mt) {
    var bt;
    if (Z && (bt = je ? Z(S, xe, je, Mt) : Z(S)), bt !== void 0)
      return bt;
    if (!T(S))
      return S;
    var mr = K(S);
    if (mr) {
      if (bt = Ss(S), !B)
        return bs(S, bt);
    } else {
      var mn = yr(S), Pr = mn == h || mn == d;
      if (p(S))
        return lo(S, B);
      if (mn == v || mn == o || Pr && !je) {
        if (G(S))
          return je ? S : {};
        if (bt = po(Pr ? {} : S), !B)
          return Zi(S, oo(bt, S));
      } else {
        if (!F[mn])
          return je ? S : {};
        bt = wr(S, mn, io, B);
      }
    }
    Mt || (Mt = new zn());
    var On = Mt.get(S);
    if (On)
      return On;
    if (Mt.set(S, bt), !mr)
      var Ji = D ? nt(S) : ne(S);
    return en(Ji || S, function(ns, $e) {
      Ji && ($e = ns, ns = S[$e]), ni(bt, $e, io(ns, B, D, Z, $e, S, Mt));
    }), bt;
  }
  function Gn(S) {
    return T(S) ? wt(S) : {};
  }
  function Wi(S, B, D) {
    var Z = B(S);
    return K(S) ? Z : Kt(Z, D(S));
  }
  function ws(S) {
    return ze.call(S);
  }
  function ao(S) {
    if (!T(S) || ts(S))
      return !1;
    var B = g(S) || G(S) ? Fe : De;
    return B.test(Un(S));
  }
  function co(S) {
    if (!go(S))
      return or(S);
    var B = [];
    for (var D in Object(S))
      Ae.call(S, D) && D != "constructor" && B.push(D);
    return B;
  }
  function lo(S, B) {
    if (B)
      return S.slice();
    var D = new S.constructor(S.length);
    return S.copy(D), D;
  }
  function ir(S) {
    var B = new S.constructor(S.byteLength);
    return new yn(B).set(new yn(S)), B;
  }
  function uo(S, B) {
    var D = B ? ir(S.buffer) : S.buffer;
    return new S.constructor(D, S.byteOffset, S.byteLength);
  }
  function fo(S, B, D) {
    var Z = B ? D(H(S), !0) : H(S);
    return Qe(Z, Be, new S.constructor());
  }
  function ms(S) {
    var B = new S.constructor(S.source, ue.exec(S));
    return B.lastIndex = S.lastIndex, B;
  }
  function ri(S, B, D) {
    var Z = B ? D(J(S), !0) : J(S);
    return Qe(Z, _e, new S.constructor());
  }
  function Qr(S) {
    return ae ? Object(ae.call(S)) : {};
  }
  function ho(S, B) {
    var D = B ? ir(S.buffer) : S.buffer;
    return new S.constructor(D, S.byteOffset, S.length);
  }
  function bs(S, B) {
    var D = -1, Z = S.length;
    for (B || (B = Array(Z)); ++D < Z; )
      B[D] = S[D];
    return B;
  }
  function xs(S, B, D, Z) {
    D || (D = {});
    for (var xe = -1, je = B.length; ++xe < je; ) {
      var Mt = B[xe], bt = void 0;
      ni(D, Mt, bt === void 0 ? S[Mt] : bt);
    }
    return D;
  }
  function Zi(S, B) {
    return xs(S, si(S), B);
  }
  function nt(S) {
    return Wi(S, ne, si);
  }
  function es(S, B) {
    var D = S.__data__;
    return vs(B) ? D[typeof B == "string" ? "string" : "hash"] : D.map;
  }
  function $t(S, B) {
    var D = yt(S, B);
    return ao(D) ? D : void 0;
  }
  var si = sr ? Q(sr, Object) : se, yr = ws;
  (Rn && yr(new Rn(new ArrayBuffer(1))) != V || Ut && yr(new Ut()) != m || nn && yr(nn.resolve()) != A || ut && yr(new ut()) != P || Qt && yr(new Qt()) != M) && (yr = function(S) {
    var B = ze.call(S), D = B == v ? S.constructor : void 0, Z = D ? Un(D) : void 0;
    if (Z)
      switch (Z) {
        case Jr:
          return V;
        case Nn:
          return m;
        case y:
          return A;
        case C:
          return P;
        case j:
          return M;
      }
    return B;
  });
  function Ss(S) {
    var B = S.length, D = S.constructor(B);
    return B && typeof S[0] == "string" && Ae.call(S, "index") && (D.index = S.index, D.input = S.input), D;
  }
  function po(S) {
    return typeof S.constructor == "function" && !go(S) ? Gn(En(S)) : {};
  }
  function wr(S, B, D, Z) {
    var xe = S.constructor;
    switch (B) {
      case U:
        return ir(S);
      case a:
      case c:
        return new xe(+S);
      case V:
        return uo(S, Z);
      case ce:
      case te:
      case Y:
      case b:
      case $:
      case N:
      case _:
      case q:
      case R:
        return ho(S, Z);
      case m:
        return fo(S, Z, D);
      case w:
      case O:
        return new xe(S);
      case L:
        return ms(S);
      case P:
        return ri(S, Z, D);
      case E:
        return Qr(S);
    }
  }
  function ar(S, B) {
    return B = B ?? s, !!B && (typeof S == "number" || I.test(S)) && S > -1 && S % 1 == 0 && S < B;
  }
  function vs(S) {
    var B = typeof S;
    return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? S !== "__proto__" : S === null;
  }
  function ts(S) {
    return !!ht && ht in S;
  }
  function go(S) {
    var B = S && S.constructor, D = typeof B == "function" && B.prototype || Ie;
    return S === D;
  }
  function Un(S) {
    if (S != null) {
      try {
        return Pe.call(S);
      } catch {
      }
      try {
        return S + "";
      } catch {
      }
    }
    return "";
  }
  function oi(S) {
    return io(S, !0, !0);
  }
  function x(S, B) {
    return S === B || S !== S && B !== B;
  }
  function k(S) {
    return l(S) && Ae.call(S, "callee") && (!tn.call(S, "callee") || ze.call(S) == o);
  }
  var K = Array.isArray;
  function ee(S) {
    return S != null && f(S.length) && !g(S);
  }
  function l(S) {
    return X(S) && ee(S);
  }
  var p = Nr || Ee;
  function g(S) {
    var B = T(S) ? ze.call(S) : "";
    return B == h || B == d;
  }
  function f(S) {
    return typeof S == "number" && S > -1 && S % 1 == 0 && S <= s;
  }
  function T(S) {
    var B = typeof S;
    return !!S && (B == "object" || B == "function");
  }
  function X(S) {
    return !!S && typeof S == "object";
  }
  function ne(S) {
    return ee(S) ? ti(S) : co(S);
  }
  function se() {
    return [];
  }
  function Ee() {
    return !1;
  }
  e.exports = oi;
})(Wc, Wc.exports);
var $v = Wc.exports;
const cw = /* @__PURE__ */ Ug($v);
var ed;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ed || (ed = {}));
function Iv(e, t) {
  return { type: ed.Address, version: e, hash160: t };
}
function Lv(e) {
  return Wo.c32address(e.version, e.hash160);
}
const Cv = (e) => QS(ew(e)), Tv = (e) => Ne(Cv(e));
Gt.hmacSha256Sync = (e, ...t) => {
  const n = Jy.create(ew, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Bv(e, t = "mainnet") {
  t = Yy(t), e = typeof e == "string" ? ct(e) : e;
  const n = KS(cs.P2PKH, t), r = Iv(n, Tv(e));
  return Lv(r);
}
function Mv(e, t) {
  const n = gn.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, o = Bv(s);
  if (t !== s) {
    if (t !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new gn.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function Nv(e, t = null) {
  let n;
  t ? n = Mv(e, t) : n = gn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const _p = "_blockstackDidCheckEchoReply", _v = "echoReply", Pv = "authContinuation";
function Uv(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Ov() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[_p];
  if (typeof t == "boolean")
    return t;
  const n = Uv(e.location.search), r = n[_v];
  if (r) {
    e[_p] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const o = n[Pv];
      e.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class td {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new Kg();
    else
      throw new n1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new gp(t.sessionOptions) : this.store = new gp() : t ? this.store = new pp(t.sessionOptions) : this.store = new pp();
  }
  makeAuthRequestToken(t, n, r, s, o, i = s1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ju("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, vS(t, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = SS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = qd("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Ov())
        return wi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      wi.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = I1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Xa("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = gn.decodeToken(t).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await IS(t))
      throw new Xa("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (nu(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await fp(s, o.private_key);
          } catch {
            if (wi.warn("Failed decryption of appPrivateKey, will try to use as given"), !Gt.isValidPrivateKey(o.private_key))
              throw new Xa("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await fp(s, c);
          } catch {
            wi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Xa("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = y1, h;
    nu(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), nu(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const d = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Ky(o.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, m = o.profile_url;
    if (!d.profile && m) {
      const w = await n(m);
      if (!w.ok)
        d.profile = Object.assign({}, Qb);
      else {
        const v = await w.text(), A = JSON.parse(v);
        d.profile = Nv(A[0].token);
      }
    } else
      d.profile = o.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new ju("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), yx(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), wx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
td.prototype.makeAuthRequest = td.prototype.makeAuthRequestToken;
const Hv = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Dv = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = Hv(), n = e.filter((r) => t.find((o) => o.id === r.id) ? !1 : !!Tl(r.id));
  return t.concat(n);
}, Tl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), lw = "STX_PROVIDER", Po = () => typeof window > "u" ? null : window.localStorage.getItem(lw), Fv = (e) => {
  typeof window < "u" && window.localStorage.setItem(lw, e);
}, jv = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Rv(e, t) {
  const n = {};
  return Object.assign(n, jv, t), await fetch(e, n);
}
function zv(e) {
  let t = Rv, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Gv(...e) {
  const { fetchLib: t, middlewares: n } = zv(e);
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
var Pi;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Pi || (Pi = {}));
var Uo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Uo || (Uo = {}));
var Pp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Pp || (Pp = {}));
const Kv = "https://api.mainnet.hiro.so", Vv = "https://api.testnet.hiro.so", Xv = "http://localhost:3999", Yv = ["mainnet", "testnet", "devnet", "mocknet"];
class Oo {
  constructor(t) {
    this.version = Uo.Mainnet, this.chainId = Pi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Uo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Gv();
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
Oo.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new nd();
    case "testnet":
      return new rd();
    case "devnet":
      return new qv();
    case "mocknet":
      return new uw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Yv.join(", ")}`);
  }
};
Oo.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Oo.fromName(e);
class nd extends Oo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Kv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Uo.Mainnet, this.chainId = Pi.Mainnet;
  }
}
class rd extends Oo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Vv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Uo.Testnet, this.chainId = Pi.Testnet;
  }
}
class uw extends Oo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Xv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Uo.Testnet, this.chainId = Pi.Testnet;
  }
}
const qv = uw;
var Ho;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Ho || (Ho = {}));
var Zc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Zc || (Zc = {}));
Ho.Mainnet;
var Do;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Do || (Do = {}));
var Fo;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Fo || (Fo = {}));
Do.Mainnet;
const Wv = {
  chainId: Ho.Mainnet,
  transactionVersion: Do.Mainnet,
  peerNetworkId: Zc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Fo.MainnetSingleSig,
    multiSig: Fo.MainnetMultiSig
  },
  client: { baseUrl: Rg }
}, sd = {
  chainId: Ho.Testnet,
  transactionVersion: Do.Testnet,
  peerNetworkId: Zc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Fo.TestnetSingleSig,
    multiSig: Fo.TestnetMultiSig
  },
  client: { baseUrl: zg }
}, Mc = {
  ...sd,
  addressVersion: { ...sd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Gg }
}, Zv = {
  ...Mc,
  addressVersion: { ...Mc.addressVersion },
  client: { ...Mc.client }
};
function Jv(e) {
  switch (e) {
    case "mainnet":
      return Wv;
    case "testnet":
      return sd;
    case "devnet":
      return Mc;
    case "mocknet":
      return Zv;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Qv(e) {
  return typeof e == "string" ? Jv(e) : e;
}
function eA(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const Up = /* @__PURE__ */ new Map();
function dw(e, t) {
  const n = Up.get(e);
  if (n !== void 0)
    return n(t);
  const r = eA(e);
  return Up.set(e, r), dw(e, t);
}
let Lt = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? ct(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return A1(this.readBytes(4), 0);
  }
  readUInt8() {
    return S1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return b1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Ne(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Ne(n);
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
    if (dw(t, r))
      return r;
    throw n(r);
  }
};
const tA = 128, nA = 128, fw = 16, $o = 32, od = 80, Bl = 65, rA = 32, sA = 64, Jc = 34, oA = 1 + 16 * 1024 * 1024, iA = 165, aA = 16, cA = 16, lA = 20, uA = cA + 2 + lA, dA = uA + 4, fA = oA + (iA + aA * dA);
var pt;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(pt || (pt = {}));
var id;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(id || (id = {}));
var qn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(qn || (qn = {}));
const lu = ["onChainOnly", "offChainOnly", "any"];
lu[0] + "", qn.OnChainOnly, lu[1] + "", qn.OffChainOnly, lu[2] + "", qn.Any, qn.OnChainOnly + "", qn.OnChainOnly, qn.OffChainOnly + "", qn.OffChainOnly, qn.Any + "", qn.Any;
var Qc;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Qc || (Qc = {}));
var Nt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Nt || (Nt = {}));
var Rt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Rt || (Rt = {}));
var At;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(At || (At = {}));
var Ht;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Ht || (Ht = {}));
var ya;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(ya || (ya = {}));
var ad;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(ad || (ad = {}));
var cd;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(cd || (cd = {}));
var Ln;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Ln || (Ln = {}));
var Op;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Op || (Op = {}));
var ld;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ld || (ld = {}));
var kr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(kr || (kr = {}));
var Hp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Hp || (Hp = {}));
let Ml = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, mi = class extends Ml {
  constructor(t) {
    super(t);
  }
}, $n = class extends Ml {
  constructor(t) {
    super(t);
  }
}, el = class extends Ml {
  constructor(t) {
    super(t);
  }
}, So = class extends Ml {
  constructor(t) {
    super(t);
  }
};
function ud(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function hA(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function hw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function pA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ud(e.outputLen), ud(e.blockLen);
}
function gA(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function yA(e, t) {
  hw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const vo = {
  number: ud,
  bool: hA,
  bytes: hw,
  hash: pA,
  exists: gA,
  output: yA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Hr = (e, t) => e << 32 - t | e >>> t, wA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!wA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function mA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function bf(e) {
  if (typeof e == "string" && (e = mA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let pw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Zo(e) {
  const t = (r) => e().update(bf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let gw = class extends pw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, vo.hash(t);
    const r = bf(n);
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
    return vo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    vo.exists(this), vo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const yw = (e, t, n) => new gw(e, t).update(n).digest();
yw.create = (e, t) => new gw(e, t);
function bA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let xf = class extends pw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = uu(this.buffer);
  }
  update(t) {
    vo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = bf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = uu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    vo.exists(this), vo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    bA(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = uu(t), c = this.outputLen;
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
const xA = (e, t, n) => e & t ^ ~e & n, SA = (e, t, n) => e & t ^ e & n ^ t & n, vA = new Uint32Array([
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
]), Ps = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Us = new Uint32Array(64);
let ww = class extends xf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ps[0] | 0, this.B = Ps[1] | 0, this.C = Ps[2] | 0, this.D = Ps[3] | 0, this.E = Ps[4] | 0, this.F = Ps[5] | 0, this.G = Ps[6] | 0, this.H = Ps[7] | 0;
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
      Us[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Us[d - 15], w = Us[d - 2], v = Hr(m, 7) ^ Hr(m, 18) ^ m >>> 3, A = Hr(w, 17) ^ Hr(w, 19) ^ w >>> 10;
      Us[d] = A + Us[d - 7] + v + Us[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Hr(a, 6) ^ Hr(a, 11) ^ Hr(a, 25), w = h + m + xA(a, c, u) + vA[d] + Us[d] | 0, A = (Hr(r, 2) ^ Hr(r, 13) ^ Hr(r, 22)) + SA(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Us.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, AA = class extends ww {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Sf = Zo(() => new ww());
Zo(() => new AA());
const EA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), mw = Uint8Array.from({ length: 16 }, (e, t) => t), kA = mw.map((e) => (9 * e + 5) % 16);
let vf = [mw], Af = [kA];
for (let e = 0; e < 4; e++)
  for (let t of [vf, Af])
    t.push(t[e].map((n) => EA[n]));
const bw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), $A = vf.map((e, t) => e.map((n) => bw[t][n])), IA = Af.map((e, t) => e.map((n) => bw[t][n])), LA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), CA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ic = (e, t) => e << t | e >>> 32 - t;
function Dp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const ac = new Uint32Array(16);
let TA = class extends xf {
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
    for (let w = 0; w < 16; w++, n += 4)
      ac[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, A = LA[w], L = CA[w], P = vf[w], O = Af[w], E = $A[w], M = IA[w];
      for (let U = 0; U < 16; U++) {
        const V = ic(r + Dp(w, o, a, u) + ac[P[U]] + A, E[U]) + d | 0;
        r = d, d = u, u = ic(a, 10) | 0, a = o, o = V;
      }
      for (let U = 0; U < 16; U++) {
        const V = ic(s + Dp(v, i, c, h) + ac[O[U]] + L, M[U]) + m | 0;
        s = m, m = h, h = ic(c, 10) | 0, c = i, i = V;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    ac.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const BA = Zo(() => new TA()), cc = BigInt(2 ** 32 - 1), dd = BigInt(32);
function xw(e, t = !1) {
  return t ? { h: Number(e & cc), l: Number(e >> dd & cc) } : { h: Number(e >> dd & cc) | 0, l: Number(e & cc) | 0 };
}
function MA(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = xw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const NA = (e, t) => BigInt(e >>> 0) << dd | BigInt(t >>> 0), _A = (e, t, n) => e >>> n, PA = (e, t, n) => e << 32 - n | t >>> n, UA = (e, t, n) => e >>> n | t << 32 - n, OA = (e, t, n) => e << 32 - n | t >>> n, HA = (e, t, n) => e << 64 - n | t >>> n - 32, DA = (e, t, n) => e >>> n - 32 | t << 64 - n, FA = (e, t) => t, jA = (e, t) => e, RA = (e, t, n) => e << n | t >>> 32 - n, zA = (e, t, n) => t << n | e >>> 32 - n, GA = (e, t, n) => t << n - 32 | e >>> 64 - n, KA = (e, t, n) => e << n - 32 | t >>> 64 - n;
function VA(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const XA = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), YA = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, qA = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), WA = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, ZA = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), JA = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Xe = {
  fromBig: xw,
  split: MA,
  toBig: NA,
  shrSH: _A,
  shrSL: PA,
  rotrSH: UA,
  rotrSL: OA,
  rotrBH: HA,
  rotrBL: DA,
  rotr32H: FA,
  rotr32L: jA,
  rotlSH: RA,
  rotlSL: zA,
  rotlBH: GA,
  rotlBL: KA,
  add: VA,
  add3L: XA,
  add3H: YA,
  add4L: qA,
  add4H: WA,
  add5H: JA,
  add5L: ZA
}, [QA, eE] = Xe.split([
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
].map((e) => BigInt(e))), Os = new Uint32Array(80), Hs = new Uint32Array(80);
let Nl = class extends xf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: A, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, m, w, v, A, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, m, w, v, A, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = A | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Os[E] = t.getUint32(n), Hs[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const M = Os[E - 15] | 0, U = Hs[E - 15] | 0, V = Xe.rotrSH(M, U, 1) ^ Xe.rotrSH(M, U, 8) ^ Xe.shrSH(M, U, 7), ce = Xe.rotrSL(M, U, 1) ^ Xe.rotrSL(M, U, 8) ^ Xe.shrSL(M, U, 7), te = Os[E - 2] | 0, Y = Hs[E - 2] | 0, b = Xe.rotrSH(te, Y, 19) ^ Xe.rotrBH(te, Y, 61) ^ Xe.shrSH(te, Y, 6), $ = Xe.rotrSL(te, Y, 19) ^ Xe.rotrBL(te, Y, 61) ^ Xe.shrSL(te, Y, 6), N = Xe.add4L(ce, $, Hs[E - 7], Hs[E - 16]), _ = Xe.add4H(N, V, b, Os[E - 7], Os[E - 16]);
      Os[E] = _ | 0, Hs[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: A, Gl: L, Hh: P, Hl: O } = this;
    for (let E = 0; E < 80; E++) {
      const M = Xe.rotrSH(d, m, 14) ^ Xe.rotrSH(d, m, 18) ^ Xe.rotrBH(d, m, 41), U = Xe.rotrSL(d, m, 14) ^ Xe.rotrSL(d, m, 18) ^ Xe.rotrBL(d, m, 41), V = d & w ^ ~d & A, ce = m & v ^ ~m & L, te = Xe.add5L(O, U, ce, eE[E], Hs[E]), Y = Xe.add5H(te, P, M, V, QA[E], Os[E]), b = te | 0, $ = Xe.rotrSH(r, s, 28) ^ Xe.rotrBH(r, s, 34) ^ Xe.rotrBH(r, s, 39), N = Xe.rotrSL(r, s, 28) ^ Xe.rotrBL(r, s, 34) ^ Xe.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, q = s & i ^ s & c ^ i & c;
      P = A | 0, O = L | 0, A = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Xe.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const R = Xe.add3L(b, N, q);
      r = Xe.add3H(R, Y, $, _), s = R | 0;
    }
    ({ h: r, l: s } = Xe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Xe.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Xe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Xe.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Xe.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Xe.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: A, l: L } = Xe.add(this.Gh | 0, this.Gl | 0, A | 0, L | 0), { h: P, l: O } = Xe.add(this.Hh | 0, this.Hl | 0, P | 0, O | 0), this.set(r, s, o, i, a, c, u, h, d, m, w, v, A, L, P, O);
  }
  roundClean() {
    Os.fill(0), Hs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, tE = class extends Nl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, nE = class extends Nl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, rE = class extends Nl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Zo(() => new Nl());
Zo(() => new tE());
const sE = Zo(() => new nE());
Zo(() => new rE());
var rt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(rt || (rt = {}));
var sn;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(sn || (sn = {}));
function Ef(e) {
  return sn[e];
}
const oE = () => ({ type: rt.BoolTrue }), iE = () => ({ type: rt.BoolFalse }), aE = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: rt.Buffer, value: Ne(e) };
}, Fp = BigInt("0xffffffffffffffffffffffffffffffff"), cE = BigInt(0), jp = BigInt("0x7fffffffffffffffffffffffffffffff"), Rp = BigInt("-170141183460469231731687303715884105728"), lE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = zu(ct(e))), jn(e, Uint8Array) && (e = zu(e));
  const t = An(e);
  if (t > jp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${jp}`);
  if (t < Rp)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Rp}`);
  return { type: rt.Int, value: t };
}, uE = (e) => {
  const t = An(e);
  if (t < cE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Fp)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Fp}`);
  return { type: rt.UInt, value: t };
};
function dE(e) {
  return { type: rt.List, value: e };
}
function Sw() {
  return { type: rt.OptionalNone };
}
function vw(e) {
  return { type: rt.OptionalSome, value: e };
}
var we;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(we || (we = {}));
function fE() {
  return {
    type: we.Address,
    version: Fo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function zp(e) {
  if (e && Bw(e, Jc))
    throw new Error(`Memo exceeds maximum length of ${Jc} bytes`);
  return { type: we.MemoString, content: e };
}
function kf(e, t) {
  return {
    type: we.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function fd(e) {
  if (ct(e).byteLength != Bl)
    throw Error("Invalid signature");
  return {
    type: we.MessageSignature,
    data: e
  };
}
function hE(e, t, n) {
  return typeof e == "string" && (e = CE(e)), typeof n == "string" && (n = zp(n)), {
    type: we.Payload,
    payloadType: pt.TokenTransfer,
    recipient: e,
    amount: An(t),
    memo: n ?? zp("")
  };
}
function pE(e, t, n, r) {
  return typeof t == "string" && (t = Tr(t)), typeof n == "string" && (n = Tr(n)), {
    type: we.Payload,
    payloadType: pt.ContractCall,
    contractAddress: typeof e == "string" ? so(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function gE(e) {
  return Tr(e, 4, 1e5);
}
function Gp(e, t, n) {
  return typeof e == "string" && (e = Tr(e)), typeof t == "string" && (t = gE(t)), typeof n == "number" ? {
    type: we.Payload,
    payloadType: pt.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: we.Payload,
    payloadType: pt.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function yE() {
  return { type: we.Payload, payloadType: pt.PoisonMicroblock };
}
function Kp(e, t) {
  if (e.byteLength != $o)
    throw Error(`Coinbase buffer size must be ${$o} bytes`);
  return t != null ? {
    type: we.Payload,
    payloadType: pt.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: we.Payload,
    payloadType: pt.Coinbase,
    coinbaseBytes: e
  };
}
function wE(e, t, n) {
  if (e.byteLength != $o)
    throw Error(`Coinbase buffer size must be ${$o} bytes`);
  if (n.byteLength != od)
    throw Error(`VRF proof buffer size must be ${od} bytes`);
  return {
    type: we.Payload,
    payloadType: pt.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === rt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function mE(e, t, n, r, s, o, i) {
  return {
    type: we.Payload,
    payloadType: pt.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function Tr(e, t, n) {
  const r = t || 1, s = n || tA;
  if (Bw(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: we.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function bE(e, t, n) {
  return {
    type: we.Asset,
    address: so(e),
    contractName: Tr(t),
    assetName: Tr(n)
  };
}
function so(e) {
  const t = Wo.c32addressDecode(e);
  return {
    type: we.Address,
    version: t[0],
    hash160: t[1]
  };
}
function xE(e, t) {
  const n = so(e), r = Tr(t);
  return {
    type: we.Principal,
    prefix: Ln.Contract,
    address: n,
    contractName: r
  };
}
function SE(e) {
  const t = so(e);
  return {
    type: we.Principal,
    prefix: Ln.Standard,
    address: t
  };
}
function bi(e, t) {
  return {
    pubKeyEncoding: e,
    type: we.TransactionAuthField,
    contents: t
  };
}
function is(e) {
  switch (e.type) {
    case we.Address:
      return Da(e);
    case we.Principal:
      return Aw(e);
    case we.LengthPrefixedString:
      return Oi(e);
    case we.MemoString:
      return AE(e);
    case we.Asset:
      return kw(e);
    case we.PostCondition:
      return Iw(e);
    case we.PublicKey:
      return gd(e);
    case we.LengthPrefixedList:
      return $f(e);
    case we.Payload:
      return Lw(e);
    case we.TransactionAuthField:
      return LE(e);
    case we.MessageSignature:
      return If(e);
  }
}
function Da(e) {
  const t = [];
  return t.push(ct(Na(e.version, 1))), t.push(ct(e.hash160)), Wt(t);
}
function Ui(e) {
  const t = jn(e, Lt) ? e : new Lt(e), n = ml(Ne(t.readBytes(1))), r = Ne(t.readBytes(20));
  return { type: we.Address, version: n, hash160: r };
}
function Aw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === Ln.Standard || e.prefix === Ln.Contract) && t.push(Da(e.address)), e.prefix === Ln.Contract && t.push(Oi(e.contractName)), Wt(t);
}
function vE(e) {
  const t = jn(e, Lt) ? e : new Lt(e), n = t.readUInt8Enum(Ln, (o) => {
    throw new $n(`Unexpected Principal payload type: ${o}`);
  });
  if (n === Ln.Origin)
    return { type: we.Principal, prefix: n };
  const r = Ui(t);
  if (n === Ln.Standard)
    return { type: we.Principal, prefix: n, address: r };
  const s = fr(t);
  return {
    type: we.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Oi(e) {
  const t = [], n = Vo(e.content), r = n.byteLength;
  return t.push(ct(Na(r, e.lengthPrefixBytes))), t.push(n), Wt(t);
}
function fr(e, t, n) {
  t = t || 1;
  const r = jn(e, Lt) ? e : new Lt(e), s = ml(Ne(r.readBytes(t))), o = _a(r.readBytes(s));
  return Tr(o, t, n ?? 128);
}
function AE(e) {
  const t = [], n = Vo(e.content), r = ZE(Ne(n), Jc * 2);
  return t.push(ct(r)), Wt(t);
}
function Ew(e) {
  const t = jn(e, Lt) ? e : new Lt(e);
  let n = _a(t.readBytes(Jc));
  return n = n.replace(/\u0000*$/, ""), { type: we.MemoString, content: n };
}
function kw(e) {
  const t = [];
  return t.push(Da(e.address)), t.push(Oi(e.contractName)), t.push(Oi(e.assetName)), Wt(t);
}
function hd(e) {
  const t = jn(e, Lt) ? e : new Lt(e);
  return {
    type: we.Asset,
    address: Ui(t),
    contractName: fr(t),
    assetName: fr(t)
  };
}
function $f(e) {
  const t = e.values, n = [];
  n.push(ct(Na(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(is(r));
  return Wt(n);
}
function $w(e, t, n) {
  const r = jn(e, Lt) ? e : new Lt(e), s = ml(Ne(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (t) {
      case we.Address:
        o.push(Ui(r));
        break;
      case we.LengthPrefixedString:
        o.push(fr(r));
        break;
      case we.MemoString:
        o.push(Ew(r));
        break;
      case we.Asset:
        o.push(hd(r));
        break;
      case we.PostCondition:
        o.push(kE(r));
        break;
      case we.PublicKey:
        o.push(yd(r));
        break;
      case we.TransactionAuthField:
        o.push(IE(r));
        break;
    }
  return kf(o, n);
}
function EE(e) {
  return Ne(Iw(e));
}
function Iw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Aw(e.principal)), (e.conditionType === Nt.Fungible || e.conditionType === Nt.NonFungible) && t.push(kw(e.asset)), e.conditionType === Nt.NonFungible && t.push(Kr(e.assetName)), t.push(e.conditionCode), e.conditionType === Nt.STX || e.conditionType === Nt.Fungible || e.conditionType === Nt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new mi("The post-condition amount may not be larger than 8 bytes");
    t.push(no(e.amount, 8));
  }
  return Wt(t);
}
function kE(e) {
  const t = jn(e, Lt) ? e : new Lt(e), n = t.readUInt8Enum(Nt, (a) => {
    throw new $n(`Could not read ${a} as PostConditionType`);
  }), r = vE(t);
  let s, o, i;
  switch (n) {
    case Nt.STX:
      return s = t.readUInt8Enum(ya, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ne(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: Nt.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Nt.Fungible:
      return o = hd(t), s = t.readUInt8Enum(ya, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ne(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: Nt.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case Nt.NonFungible:
      o = hd(t);
      const a = Rr(t);
      return s = t.readUInt8Enum(ad, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: we.PostCondition,
        conditionType: Nt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: a
      };
    case Nt.Staking:
      return s = t.readUInt8Enum(ya, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ne(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: Nt.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Nt.PoX: {
      const c = t.readUInt8Enum(cd, (u) => {
        throw new $n(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: we.PostCondition,
        conditionType: Nt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Lw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case pt.TokenTransfer:
      t.push(Kr(e.recipient)), t.push(no(e.amount, 8)), t.push(is(e.memo));
      break;
    case pt.ContractCall:
      t.push(is(e.contractAddress)), t.push(is(e.contractName)), t.push(is(e.functionName));
      const n = new Uint8Array(4);
      To(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Kr(r));
      });
      break;
    case pt.SmartContract:
      t.push(is(e.contractName)), t.push(is(e.codeBody));
      break;
    case pt.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(is(e.contractName)), t.push(is(e.codeBody));
      break;
    case pt.PoisonMicroblock:
      break;
    case pt.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case pt.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Kr(e.recipient));
      break;
    case pt.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Kr(e.recipient ? vw(e.recipient) : Sw())), t.push(e.vrfProof);
      break;
    case pt.TenureChange:
      t.push(ct(e.tenureHash)), t.push(ct(e.previousTenureHash)), t.push(ct(e.burnViewHash)), t.push(ct(e.previousTenureEnd)), t.push(To(new Uint8Array(4), e.previousTenureBlocks)), t.push(v1(new Uint8Array(1), e.cause)), t.push(ct(e.publicKeyHash));
      break;
  }
  return Wt(t);
}
function $E(e) {
  const t = jn(e, Lt) ? e : new Lt(e);
  switch (t.readUInt8Enum(pt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case pt.TokenTransfer:
      const r = Rr(t), s = An(t.readBytes(8)), o = Ew(t);
      return hE(r, s, o);
    case pt.ContractCall:
      const i = Ui(t), a = fr(t), c = fr(t), u = [], h = t.readUInt32BE();
      for (let M = 0; M < h; M++) {
        const U = Rr(t);
        u.push(U);
      }
      return pE(i, a, c, u);
    case pt.SmartContract:
      const d = fr(t), m = fr(t, 4, 1e5);
      return Gp(d, m);
    case pt.VersionedSmartContract: {
      const M = t.readUInt8Enum(id, (ce) => {
        throw new Error(`Cannot recognize ClarityVersion: ${ce}`);
      }), U = fr(t), V = fr(t, 4, fA);
      return Gp(U, V, M);
    }
    case pt.PoisonMicroblock:
      return yE();
    case pt.Coinbase: {
      const M = t.readBytes($o);
      return Kp(M);
    }
    case pt.CoinbaseToAltRecipient: {
      const M = t.readBytes($o), U = Rr(t);
      return Kp(M, U);
    }
    case pt.NakamotoCoinbase: {
      const M = t.readBytes($o), U = Rr(t), V = t.readBytes(od);
      return wE(M, U, V);
    }
    case pt.TenureChange:
      const w = Ne(t.readBytes(20)), v = Ne(t.readBytes(20)), A = Ne(t.readBytes(20)), L = Ne(t.readBytes(32)), P = t.readUInt32BE(), O = t.readUInt8Enum(ld, (M) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${M}`);
      }), E = Ne(t.readBytes(20));
      return mE(w, v, A, L, P, O, E);
  }
}
function pd(e) {
  const t = jn(e, Lt) ? e : new Lt(e);
  return fd(Ne(t.readBytes(Bl)));
}
function IE(e) {
  const t = jn(e, Lt) ? e : new Lt(e), n = t.readUInt8Enum(kr, (r) => {
    throw new $n(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case kr.PublicKeyCompressed:
      return bi(Ht.Compressed, yd(t));
    case kr.PublicKeyUncompressed:
      return bi(Ht.Uncompressed, Ki(ck(yd(t).data)));
    case kr.SignatureCompressed:
      return bi(Ht.Compressed, pd(t));
    case kr.SignatureUncompressed:
      return bi(Ht.Uncompressed, pd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function If(e) {
  return ct(e.data);
}
function LE(e) {
  const t = [];
  switch (e.contents.type) {
    case we.PublicKey:
      t.push(e.pubKeyEncoding === Ht.Compressed ? kr.PublicKeyCompressed : kr.PublicKeyUncompressed), t.push(ct(ak(e.contents.data)));
      break;
    case we.MessageSignature:
      t.push(e.pubKeyEncoding === Ht.Compressed ? kr.SignatureCompressed : kr.SignatureUncompressed), t.push(If(e.contents));
      break;
  }
  return Wt(t);
}
function gd(e) {
  return e.data.slice();
}
function yd(e) {
  const t = jn(e, Lt) ? e : new Lt(e), n = t.readUInt8(), r = n === 4 ? sA : rA;
  return Ki(Wt([n, t.readBytes(r)]));
}
function Lf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === At.P2PKH || t === At.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === At.P2WPKH || t === At.P2WSH || t === At.P2WSHNonSequential) && !r.map((s) => s.data).every(Vi))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case At.P2PKH:
      return lc(e, JE(r[0].data));
    case At.P2WPKH:
      return lc(e, QE(r[0].data));
    case At.P2SH:
    case At.P2SHNonSequential:
      return lc(e, ek(n, r.map(gd)));
    case At.P2WSH:
    case At.P2WSHNonSequential:
      return lc(e, tk(n, r.map(gd)));
  }
}
function lc(e, t) {
  return { type: we.Address, version: e, hash160: t };
}
function Cf(e) {
  return Wo.c32address(e.version, e.hash160);
}
function Vp(e) {
  const [t, n, r] = e.split(/\.|::/);
  return bE(t, n, r);
}
function ra(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return xE(t, n);
  } else
    return SE(e);
}
function CE(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return ME(t, n);
  } else
    return TE(e);
}
function TE(e) {
  const t = so(e);
  return { type: rt.PrincipalStandard, value: Cf(t) };
}
function BE(e) {
  return { type: rt.PrincipalStandard, value: Cf(e) };
}
function ME(e, t) {
  const n = so(e), r = Tr(t);
  return Cw(n, r);
}
function Cw(e, t) {
  if (Vo(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: rt.PrincipalContract,
    value: `${Cf(e)}.${t.content}`
  };
}
function NE(e) {
  return { type: rt.ResponseErr, value: e };
}
function _E(e) {
  return { type: rt.ResponseOk, value: e };
}
const PE = (e) => ({ type: rt.StringASCII, value: e }), UE = (e) => ({ type: rt.StringUTF8, value: e });
function OE(e) {
  for (const t in e)
    if (!nk(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: rt.Tuple, value: e };
}
function Rr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Lt(ct(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Lt(e) : t = e;
  switch (t.readUInt8Enum(sn, (r) => {
    throw new $n(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case sn.int:
      return lE(zu(t.readBytes(16)));
    case sn.uint:
      return uE(t.readBytes(16));
    case sn.buffer:
      const r = t.readUInt32BE();
      return aE(t.readBytes(r));
    case sn.true:
      return oE();
    case sn.false:
      return iE();
    case sn.address:
      const s = Ui(t);
      return BE(s);
    case sn.contract:
      const o = Ui(t), i = fr(t);
      return Cw(o, i);
    case sn.ok:
      return _E(Rr(t));
    case sn.err:
      return NE(Rr(t));
    case sn.none:
      return Sw();
    case sn.some:
      return vw(Rr(t));
    case sn.list:
      const a = t.readUInt32BE(), c = [];
      for (let A = 0; A < a; A++)
        c.push(Rr(t));
      return dE(c);
    case sn.tuple:
      const u = t.readUInt32BE(), h = {};
      for (let A = 0; A < u; A++) {
        const L = fr(t).content;
        if (L === void 0)
          throw new $n('"content" is undefined');
        h[L] = Rr(t);
      }
      return OE(h);
    case sn.ascii:
      const d = t.readUInt32BE(), m = p1(t.readBytes(d));
      return PE(m);
    case sn.utf8:
      const w = t.readUInt32BE(), v = _a(t.readBytes(w));
      return UE(v);
    default:
      throw new $n("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function qr(e, t) {
  return Wt([Ef(e), t]);
}
function HE(e) {
  return new Uint8Array([Ef(e.type)]);
}
function DE(e) {
  return e.type === rt.OptionalNone ? new Uint8Array([Ef(e.type)]) : qr(e.type, Kr(e.value));
}
function FE(e) {
  const t = new Uint8Array(4);
  return To(t, Math.ceil(e.value.length / 2), 0), qr(e.type, Xr(t, ct(e.value)));
}
function jE(e) {
  const t = Wd(l1(BigInt(e.value), BigInt(nA)), fw);
  return qr(e.type, t);
}
function RE(e) {
  const t = Wd(BigInt(e.value), fw);
  return qr(e.type, t);
}
function zE(e) {
  return qr(e.type, Da(so(e.value)));
}
function GE(e) {
  const [t, n] = rk(e.value);
  return qr(e.type, Xr(Da(so(t)), Oi(Tr(n))));
}
function KE(e) {
  return qr(e.type, Kr(e.value));
}
function VE(e) {
  const t = [], n = new Uint8Array(4);
  To(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = Kr(r);
    t.push(s);
  }
  return qr(e.type, Wt(t));
}
function XE(e) {
  const t = [], n = new Uint8Array(4);
  To(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Tr(s);
    t.push(Oi(o));
    const i = Kr(e.value[s]);
    t.push(i);
  }
  return qr(e.type, Wt(t));
}
function Tw(e, t) {
  const n = [], r = t == "ascii" ? h1(e.value) : Vo(e.value), s = new Uint8Array(4);
  return To(s, r.length, 0), n.push(s), n.push(r), qr(e.type, Wt(n));
}
function YE(e) {
  return Tw(e, "ascii");
}
function qE(e) {
  return Tw(e, "utf8");
}
function Xp(e) {
  return Ne(Kr(e));
}
function Kr(e) {
  switch (e.type) {
    case rt.BoolTrue:
    case rt.BoolFalse:
      return HE(e);
    case rt.OptionalNone:
    case rt.OptionalSome:
      return DE(e);
    case rt.Buffer:
      return FE(e);
    case rt.UInt:
      return RE(e);
    case rt.Int:
      return jE(e);
    case rt.PrincipalStandard:
      return zE(e);
    case rt.PrincipalContract:
      return GE(e);
    case rt.ResponseOk:
    case rt.ResponseErr:
      return KE(e);
    case rt.List:
      return VE(e);
    case rt.Tuple:
      return XE(e);
    case rt.StringASCII:
      return YE(e);
    case rt.StringUTF8:
      return qE(e);
    default:
      throw new mi("Unable to serialize. Invalid Clarity Value.");
  }
}
const WE = (e) => e.length % 2 ? `0${e}` : e, ZE = (e, t) => e.padEnd(t, "0"), Bw = (e, t) => e ? Vo(e).length > t : !1;
function wd(e) {
  return cw(e);
}
const va = (e) => BA(Sf(e)), Tf = (e) => Ne(sE(e)), JE = (e) => Ne(va(e)), QE = (e) => {
  const t = va(e), n = Xr(new Uint8Array([0]), new Uint8Array([t.length]), t), r = va(n);
  return Ne(r);
}, ek = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = Wt(n), s = va(r);
  return Ne(s);
}, tk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = Wt(n), s = Sf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = Wt(o), a = va(i);
  return Ne(a);
};
function nk(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function rk(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
Gt.hmacSha256Sync = (e, ...t) => {
  const n = yw.create(Sf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Ki(e) {
  return e = typeof e == "string" ? ct(e) : e, {
    type: we.PublicKey,
    data: e
  };
}
function sk(e, t, n = Ht.Compressed) {
  const r = m1(t), s = new er(Xh(r.r), Xh(r.s)), o = Ze.fromSignature(e, s, r.recoveryId), i = n === Ht.Compressed;
  return o.toHex(i);
}
function ok(e) {
  return typeof e == "string" ? e : Ne(e);
}
const Bf = ok;
function Mw(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === w1;
}
function Vi(e) {
  return !Bf(e).startsWith("04");
}
function ik(e) {
  e = Zd(e);
  const t = Mw(e);
  return Ne(Pa(e.slice(0, 32), t));
}
function ak(e) {
  return Ze.fromHex(Bf(e)).toHex(!0);
}
function ck(e) {
  return Ze.fromHex(Bf(e)).toHex(!1);
}
function lk(e, t) {
  e = Zd(e);
  const [n, r] = xl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Na(r, 1) + er.fromHex(n).toCompactHex();
}
function Mf() {
  return {
    type: we.MessageSignature,
    data: Ne(new Uint8Array(Bl))
  };
}
function Nw(e, t, n, r) {
  const s = Lf(0, e, 1, [Ki(t)]).hash160, o = Vi(t) ? Ht.Compressed : Ht.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: An(n),
    fee: An(r),
    keyEncoding: o,
    signature: Mf()
  };
}
function Aa(e) {
  return "signature" in e;
}
function Yp(e) {
  return e === At.P2SH || e === At.P2WSH;
}
function uk(e) {
  return e === At.P2SHNonSequential || e === At.P2WSHNonSequential;
}
function qp(e) {
  const t = wd(e);
  return t.nonce = 0, t.fee = 0, Aa(t) ? t.signature = Mf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function dk(e) {
  const t = [
    e.hashMode,
    ct(e.signer),
    no(e.nonce, 8),
    no(e.fee, 8),
    e.keyEncoding,
    If(e.signature)
  ];
  return Wt(t);
}
function fk(e) {
  const t = [
    e.hashMode,
    ct(e.signer),
    no(e.nonce, 8),
    no(e.fee, 8)
  ], n = kf(e.fields);
  t.push($f(n));
  const r = new Uint8Array(2);
  return x1(r, e.signaturesRequired, 0), t.push(r), Wt(t);
}
function hk(e, t) {
  const n = Ne(t.readBytes(20)), r = BigInt(`0x${Ne(t.readBytes(8))}`), s = BigInt(`0x${Ne(t.readBytes(8))}`), o = t.readUInt8Enum(Ht, (a) => {
    throw new $n(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === At.P2WPKH && o != Ht.Compressed)
    throw new $n("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = pd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function pk(e, t) {
  const n = Ne(t.readBytes(20)), r = BigInt("0x" + Ne(t.readBytes(8))), s = BigInt("0x" + Ne(t.readBytes(8))), o = $w(t, we.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case we.PublicKey:
        Vi(u.contents.data) || (i = !0);
        break;
      case we.MessageSignature:
        if (u.pubKeyEncoding === Ht.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new So("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === At.P2WSH || e === At.P2WSHNonSequential))
    throw new So("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function du(e) {
  return Aa(e) ? dk(e) : fk(e);
}
function fu(e) {
  const t = e.readUInt8Enum(At, (n) => {
    throw new $n(`Could not parse ${n} as AddressHashMode`);
  });
  return t === At.P2PKH || t === At.P2WPKH ? hk(t, e) : pk(t, e);
}
function _w(e, t, n, r) {
  const o = e + Ne(new Uint8Array([t])) + Ne(no(n, 8)) + Ne(no(r, 8));
  if (ct(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Tf(ct(o));
}
function Pw(e, t, n) {
  const r = 33 + Bl, s = Vi(t.data) ? Ht.Compressed : Ht.Uncompressed, o = e + WE(s.toString(16)) + n, i = ct(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Tf(i);
}
function gk(e, t, n, r, s) {
  const o = _w(e, t, n, r), i = lk(s, o), a = Ki(ik(s)), c = Pw(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function Uw(e, t, n, r, s, o) {
  const i = _w(e, t, n, r), a = Ki(sk(i, o, s)), c = Pw(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function yk() {
  const e = Nw(At.P2PKH, "", 0, 0);
  return e.signer = fE().hash160, e.keyEncoding = Ht.Compressed, e.signature = Mf(), e;
}
function Wp(e, t, n) {
  return Aa(e) ? wk(e, t, n) : mk(e, t, n);
}
function wk(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Uw(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), o = Lf(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new So(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function mk(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case we.PublicKey:
        Vi(c.contents.data) || (o = !0), r.push(c.contents);
        break;
      case we.MessageSignature:
        c.pubKeyEncoding === Ht.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = Uw(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (Yp(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new So("Too many signatures");
        break;
    }
  if (Yp(e.hashMode) && i !== e.signaturesRequired || uk(e.hashMode) && i < e.signaturesRequired)
    throw new So("Incorrect number of signatures");
  if (o && (e.hashMode === At.P2WSH || e.hashMode === At.P2WSHNonSequential))
    throw new So("Uncompressed keys are not allowed in this hash mode");
  const a = Lf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new So(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Ow(e) {
  return {
    authType: Rt.Standard,
    spendingCondition: e
  };
}
function Hw(e, t) {
  return {
    authType: Rt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Nw(At.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Zp(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Rt.Standard:
        return Ow(qp(e.spendingCondition));
      case Rt.Sponsored:
        return Hw(qp(e.spendingCondition), yk());
      default:
        throw new el("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function bk(e, t) {
  switch (e.authType) {
    case Rt.Standard:
      return Wp(e.spendingCondition, t, Rt.Standard);
    case Rt.Sponsored:
      return Wp(e.spendingCondition, t, Rt.Standard);
    default:
      throw new el("Invalid origin auth type");
  }
}
function xk(e, t) {
  switch (e.authType) {
    case Rt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: An(t)
      };
      return { ...e, spendingCondition: n };
    case Rt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: An(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Sk(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: An(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function vk(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: An(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Ak(e, t) {
  const n = {
    ...t,
    nonce: An(t.nonce),
    fee: An(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Ek(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Rt.Standard:
      t.push(du(e.spendingCondition));
      break;
    case Rt.Sponsored:
      t.push(du(e.spendingCondition)), t.push(du(e.sponsorSpendingCondition));
      break;
  }
  return Wt(t);
}
function kk(e) {
  const t = e.readUInt8Enum(Rt, (r) => {
    throw new $n(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Rt.Standard:
      return n = fu(e), Ow(n);
    case Rt.Sponsored:
      n = fu(e);
      const r = fu(e);
      return Hw(n, r);
  }
}
class $k {
  constructor({ auth: t, payload: n, postConditions: r = kf([]), postConditionMode: s = Qc.Deny, transactionVersion: o, chainId: i, network: a = "mainnet" }) {
    a = Qv(a), this.transactionVersion = o ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: An(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = qn.Any;
  }
  signBegin() {
    const t = wd(this);
    return t.auth = Zp(t.auth), t.txid();
  }
  verifyBegin() {
    const t = wd(this);
    return t.auth = Zp(t.auth), t.txid();
  }
  verifyOrigin() {
    return bk(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Rt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Rt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Rt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : Ki(t), r = this.auth.spendingCondition;
    if (r && !Aa(r)) {
      const s = Vi(n.data);
      r.fields.push(bi(s ? Ht.Compressed : Ht.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = gk(n, r, t.fee, t.nonce, s);
    if (Aa(t))
      t.signature = fd(o);
    else {
      const a = Mw(s);
      t.fields.push(bi(a ? Ht.Compressed : Ht.Uncompressed, fd(o)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return Tf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Rt.Sponsored)
      throw new el("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Ak(this.auth, t);
  }
  setFee(t) {
    this.auth = xk(this.auth, t);
  }
  setNonce(t) {
    this.auth = Sk(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Rt.Sponsored)
      throw new el("Cannot sponsor sign a non-sponsored transaction");
    this.auth = vk(this.auth, t);
  }
  serialize() {
    return Ne(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new mi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new mi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new mi('"auth" is undefined');
    if (this.payload === void 0)
      throw new mi('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return To(n, this.chainId, 0), t.push(n), t.push(Ek(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push($f(this.postConditions)), t.push(Lw(this.payload)), Wt(t);
  }
}
function Ik(e) {
  const t = jn(e, Lt) ? e : new Lt(e), n = t.readUInt8Enum(Do, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = kk(t), o = t.readUInt8Enum(qn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = t.readUInt8Enum(Qc, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = $w(t, we.PostCondition), c = $E(t), u = new $k({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return u.anchorMode = o, u;
}
const Jp = BigInt("18446744073709551615");
function hu(e) {
  const t = An(e);
  if (t < 0n || t > Jp)
    throw new RangeError(`Post-condition amount must be between 0 and ${Jp} (u64 max), received: ${t}`);
  return t;
}
var md;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(md || (md = {}));
var bd;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(bd || (bd = {}));
function Lk(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Nt.STX,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Ln.Origin } : ra(e.address),
        conditionCode: uc(e.condition),
        amount: hu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Nt.Fungible,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Ln.Origin } : ra(e.address),
        conditionCode: uc(e.condition),
        amount: hu(e.amount),
        asset: Vp(e.asset)
      };
    case "nft-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Nt.NonFungible,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Ln.Origin } : ra(e.address),
        conditionCode: uc(e.condition),
        asset: Vp(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Nt.Staking,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Ln.Origin } : ra(e.address),
        conditionCode: uc(e.condition),
        amount: hu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Nt.PoX,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Ln.Origin } : ra(e.address),
        conditionCode: Ck(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function uc(e) {
  return md[e];
}
function Ck(e) {
  return bd[e];
}
function Dw(e) {
  const t = Lk(e);
  return EE(t);
}
function Tk(e, t, n) {
  return _f(Fw(e), n);
}
function Fw(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ea(r);
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
    return BigInt(`0x${Nk(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Nf(e, t = 8) {
  return (typeof e == "bigint" ? e : Fw(e)).toString(16).padStart(t * 2, "0");
}
function _f(e, t = 16) {
  const n = Nf(e, t);
  return Ea(n);
}
function Bk(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const Mk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Nk(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Mk[n];
  return t;
}
function Ea(e) {
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
function Pf(e) {
  return new TextEncoder().encode(e);
}
function _k(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Pk(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Qp(e) {
  if (e.some(Pk))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Uf(...e) {
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
function gs(e) {
  return Uf(...e.map((t) => typeof t == "number" ? Qp([t]) : t instanceof Array ? Qp(t) : t));
}
function _l(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var xd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(xd || (xd = {}));
xd.Mainnet;
const Uk = 128, Ok = 128, jw = 16;
var Sd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Sd || (Sd = {}));
var e0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(e0 || (e0 = {}));
var t0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(t0 || (t0 = {}));
var Ar;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Ar || (Ar = {}));
const pu = ["onChainOnly", "offChainOnly", "any"];
pu[0] + "", Ar.OnChainOnly, pu[1] + "", Ar.OffChainOnly, pu[2] + "", Ar.Any, Ar.OnChainOnly + "", Ar.OnChainOnly, Ar.OffChainOnly + "", Ar.OffChainOnly, Ar.Any + "", Ar.Any;
var vd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(vd || (vd = {}));
vd.Mainnet;
var n0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(n0 || (n0 = {}));
var wo;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(wo || (wo = {}));
var r0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(r0 || (r0 = {}));
var s0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(s0 || (s0 = {}));
var o0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(o0 || (o0 = {}));
var i0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(i0 || (i0 = {}));
var a0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(a0 || (a0 = {}));
var c0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(c0 || (c0 = {}));
var Ad;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Ad || (Ad = {}));
var l0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(l0 || (l0 = {}));
var u0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(u0 || (u0 = {}));
function Ed(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Hk(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Rw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Dk(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ed(e.outputLen), Ed(e.blockLen);
}
function Fk(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function jk(e, t) {
  Rw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const gu = {
  number: Ed,
  bool: Hk,
  bytes: Rw,
  hash: Dk,
  exists: Fk,
  output: jk
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const yu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Dr = (e, t) => e << 32 - t | e >>> t, Rk = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Rk)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function zk(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function zw(e) {
  if (typeof e == "string" && (e = zk(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Gk = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Jo(e) {
  const t = (r) => e().update(zw(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Kk(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Of = class extends Gk {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = yu(this.buffer);
  }
  update(t) {
    gu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = zw(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = yu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    gu.exists(this), gu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    Kk(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = yu(t), c = this.outputLen;
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
const Vk = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Gw = Uint8Array.from({ length: 16 }, (e, t) => t), Xk = Gw.map((e) => (9 * e + 5) % 16);
let Hf = [Gw], Df = [Xk];
for (let e = 0; e < 4; e++)
  for (let t of [Hf, Df])
    t.push(t[e].map((n) => Vk[n]));
const Kw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), Yk = Hf.map((e, t) => e.map((n) => Kw[t][n])), qk = Df.map((e, t) => e.map((n) => Kw[t][n])), Wk = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Zk = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), dc = (e, t) => e << t | e >>> 32 - t;
function d0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const fc = new Uint32Array(16);
let Jk = class extends Of {
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
    for (let w = 0; w < 16; w++, n += 4)
      fc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, A = Wk[w], L = Zk[w], P = Hf[w], O = Df[w], E = Yk[w], M = qk[w];
      for (let U = 0; U < 16; U++) {
        const V = dc(r + d0(w, o, a, u) + fc[P[U]] + A, E[U]) + d | 0;
        r = d, d = u, u = dc(a, 10) | 0, a = o, o = V;
      }
      for (let U = 0; U < 16; U++) {
        const V = dc(s + d0(v, i, c, h) + fc[O[U]] + L, M[U]) + m | 0;
        s = m, m = h, h = dc(c, 10) | 0, c = i, i = V;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    fc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Jo(() => new Jk());
const Qk = (e, t, n) => e & t ^ ~e & n, e3 = (e, t, n) => e & t ^ e & n ^ t & n, t3 = new Uint32Array([
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
]), Ds = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Fs = new Uint32Array(64);
let Vw = class extends Of {
  constructor() {
    super(64, 32, 8, !1), this.A = Ds[0] | 0, this.B = Ds[1] | 0, this.C = Ds[2] | 0, this.D = Ds[3] | 0, this.E = Ds[4] | 0, this.F = Ds[5] | 0, this.G = Ds[6] | 0, this.H = Ds[7] | 0;
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
      Fs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Fs[d - 15], w = Fs[d - 2], v = Dr(m, 7) ^ Dr(m, 18) ^ m >>> 3, A = Dr(w, 17) ^ Dr(w, 19) ^ w >>> 10;
      Fs[d] = A + Fs[d - 7] + v + Fs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Dr(a, 6) ^ Dr(a, 11) ^ Dr(a, 25), w = h + m + Qk(a, c, u) + t3[d] + Fs[d] | 0, A = (Dr(r, 2) ^ Dr(r, 13) ^ Dr(r, 22)) + e3(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Fs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, n3 = class extends Vw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Jo(() => new Vw());
Jo(() => new n3());
const hc = BigInt(2 ** 32 - 1), kd = BigInt(32);
function Xw(e, t = !1) {
  return t ? { h: Number(e & hc), l: Number(e >> kd & hc) } : { h: Number(e >> kd & hc) | 0, l: Number(e & hc) | 0 };
}
function r3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Xw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const s3 = (e, t) => BigInt(e >>> 0) << kd | BigInt(t >>> 0), o3 = (e, t, n) => e >>> n, i3 = (e, t, n) => e << 32 - n | t >>> n, a3 = (e, t, n) => e >>> n | t << 32 - n, c3 = (e, t, n) => e << 32 - n | t >>> n, l3 = (e, t, n) => e << 64 - n | t >>> n - 32, u3 = (e, t, n) => e >>> n - 32 | t << 64 - n, d3 = (e, t) => t, f3 = (e, t) => e, h3 = (e, t, n) => e << n | t >>> 32 - n, p3 = (e, t, n) => t << n | e >>> 32 - n, g3 = (e, t, n) => t << n - 32 | e >>> 64 - n, y3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function w3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const m3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), b3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, x3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), S3 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, v3 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), A3 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Ye = {
  fromBig: Xw,
  split: r3,
  toBig: s3,
  shrSH: o3,
  shrSL: i3,
  rotrSH: a3,
  rotrSL: c3,
  rotrBH: l3,
  rotrBL: u3,
  rotr32H: d3,
  rotr32L: f3,
  rotlSH: h3,
  rotlSL: p3,
  rotlBH: g3,
  rotlBL: y3,
  add: w3,
  add3L: m3,
  add3H: b3,
  add4L: x3,
  add4H: S3,
  add5H: A3,
  add5L: v3
}, [E3, k3] = Ye.split([
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
].map((e) => BigInt(e))), js = new Uint32Array(80), Rs = new Uint32Array(80);
let Pl = class extends Of {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: A, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, m, w, v, A, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, m, w, v, A, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = A | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      js[E] = t.getUint32(n), Rs[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const M = js[E - 15] | 0, U = Rs[E - 15] | 0, V = Ye.rotrSH(M, U, 1) ^ Ye.rotrSH(M, U, 8) ^ Ye.shrSH(M, U, 7), ce = Ye.rotrSL(M, U, 1) ^ Ye.rotrSL(M, U, 8) ^ Ye.shrSL(M, U, 7), te = js[E - 2] | 0, Y = Rs[E - 2] | 0, b = Ye.rotrSH(te, Y, 19) ^ Ye.rotrBH(te, Y, 61) ^ Ye.shrSH(te, Y, 6), $ = Ye.rotrSL(te, Y, 19) ^ Ye.rotrBL(te, Y, 61) ^ Ye.shrSL(te, Y, 6), N = Ye.add4L(ce, $, Rs[E - 7], Rs[E - 16]), _ = Ye.add4H(N, V, b, js[E - 7], js[E - 16]);
      js[E] = _ | 0, Rs[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: A, Gl: L, Hh: P, Hl: O } = this;
    for (let E = 0; E < 80; E++) {
      const M = Ye.rotrSH(d, m, 14) ^ Ye.rotrSH(d, m, 18) ^ Ye.rotrBH(d, m, 41), U = Ye.rotrSL(d, m, 14) ^ Ye.rotrSL(d, m, 18) ^ Ye.rotrBL(d, m, 41), V = d & w ^ ~d & A, ce = m & v ^ ~m & L, te = Ye.add5L(O, U, ce, k3[E], Rs[E]), Y = Ye.add5H(te, P, M, V, E3[E], js[E]), b = te | 0, $ = Ye.rotrSH(r, s, 28) ^ Ye.rotrBH(r, s, 34) ^ Ye.rotrBH(r, s, 39), N = Ye.rotrSL(r, s, 28) ^ Ye.rotrBL(r, s, 34) ^ Ye.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, q = s & i ^ s & c ^ i & c;
      P = A | 0, O = L | 0, A = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Ye.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const R = Ye.add3L(b, N, q);
      r = Ye.add3H(R, Y, $, _), s = R | 0;
    }
    ({ h: r, l: s } = Ye.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ye.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ye.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Ye.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Ye.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Ye.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: A, l: L } = Ye.add(this.Gh | 0, this.Gl | 0, A | 0, L | 0), { h: P, l: O } = Ye.add(this.Hh | 0, this.Hl | 0, P | 0, O | 0), this.set(r, s, o, i, a, c, u, h, d, m, w, v, A, L, P, O);
  }
  roundClean() {
    js.fill(0), Rs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, $3 = class extends Pl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, I3 = class extends Pl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, L3 = class extends Pl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Jo(() => new Pl());
Jo(() => new $3());
Jo(() => new I3());
Jo(() => new L3());
function C3(e, t, n) {
  const s = Uk;
  if (K3(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Sd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var on;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(on || (on = {}));
let T3 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Yw = class extends T3 {
  constructor(t) {
    super(t);
  }
};
function Ul(e) {
  const t = [];
  return t.push(Ea(Nf(e.version, 1))), t.push(Ea(e.hash160)), gs(t);
}
function B3(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ul(e.address)), e.prefix === Ad.Contract && t.push(ka(e.contractName)), gs(t);
}
function ka(e) {
  const t = [], n = Pf(e.content), r = n.byteLength;
  return t.push(Ea(Nf(r, e.lengthPrefixBytes))), t.push(n), gs(t);
}
function M3(e) {
  const t = [];
  return t.push(Ul(e.address)), t.push(ka(e.contractName)), t.push(ka(e.assetName)), gs(t);
}
function qw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(B3(e.principal)), (e.conditionType === wo.Fungible || e.conditionType === wo.NonFungible) && t.push(M3(e.assetInfo)), e.conditionType === wo.NonFungible && t.push(jo(e.assetName)), t.push(e.conditionCode), e.conditionType === wo.STX || e.conditionType === wo.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Yw("The post-condition amount may not be larger than 8 bytes");
    t.push(Tk(e.amount, !1, 8));
  }
  return gs(t);
}
function Wr(e, t) {
  return gs([e, t]);
}
function N3(e) {
  return new Uint8Array([e.type]);
}
function _3(e) {
  return e.type === on.OptionalNone ? new Uint8Array([e.type]) : Wr(e.type, jo(e.value));
}
function P3(e) {
  const t = new Uint8Array(4);
  return _l(t, e.buffer.length, 0), Wr(e.type, Uf(t, e.buffer));
}
function U3(e) {
  const t = _f(Bk(e.value, BigInt(Ok)), jw);
  return Wr(e.type, t);
}
function O3(e) {
  const t = _f(e.value, jw);
  return Wr(e.type, t);
}
function H3(e) {
  return Wr(e.type, Ul(e.address));
}
function D3(e) {
  return Wr(e.type, Uf(Ul(e.address), ka(e.contractName)));
}
function F3(e) {
  return Wr(e.type, jo(e.value));
}
function j3(e) {
  const t = [], n = new Uint8Array(4);
  _l(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = jo(r);
    t.push(s);
  }
  return Wr(e.type, gs(t));
}
function R3(e) {
  const t = [], n = new Uint8Array(4);
  _l(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = C3(s);
    t.push(ka(o));
    const i = jo(e.data[s]);
    t.push(i);
  }
  return Wr(e.type, gs(t));
}
function Ww(e, t) {
  const n = [], r = t == "ascii" ? _k(e.data) : Pf(e.data), s = new Uint8Array(4);
  return _l(s, r.length, 0), n.push(s), n.push(r), Wr(e.type, gs(n));
}
function z3(e) {
  return Ww(e, "ascii");
}
function G3(e) {
  return Ww(e, "utf8");
}
function jo(e) {
  switch (e.type) {
    case on.BoolTrue:
    case on.BoolFalse:
      return N3(e);
    case on.OptionalNone:
    case on.OptionalSome:
      return _3(e);
    case on.Buffer:
      return P3(e);
    case on.UInt:
      return O3(e);
    case on.Int:
      return U3(e);
    case on.PrincipalStandard:
      return H3(e);
    case on.PrincipalContract:
      return D3(e);
    case on.ResponseOk:
    case on.ResponseErr:
      return F3(e);
    case on.List:
      return j3(e);
    case on.Tuple:
      return R3(e);
    case on.StringASCII:
      return z3(e);
    case on.StringUTF8:
      return G3(e);
    default:
      throw new Yw("Unable to serialize. Invalid Clarity Value.");
  }
}
const K3 = (e, t) => e ? Pf(e).length > t : !1, V3 = "connect-ui";
let Nc, Zw, Wn = !1, $d = !1;
const ps = (e, t = "") => () => {
}, X3 = (e, t) => () => {
}, Y3 = "{visibility:hidden}.hydrated{visibility:inherit}", f0 = {}, q3 = "http://www.w3.org/2000/svg", W3 = "http://www.w3.org/1999/xhtml", Z3 = (e) => e != null, Ff = (e) => (e = typeof e, e === "object" || e === "function");
function Jw(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Re = (e, t, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !Ff(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? Id(null, r) : r), o = s);
  };
  if (a(n), t) {
    const u = t.className || t.class;
    u && (t.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = Id(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, Id = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, J3 = {}, Q3 = (e) => e && e.$tag$ === J3, e4 = (e, t) => e != null && !Ff(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, t4 = (e) => Xi(e).$hostElement$, n4 = (e, t, n) => {
  const r = Sn.ce(t, n);
  return e.dispatchEvent(r), r;
}, h0 = /* @__PURE__ */ new WeakMap(), r4 = (e, t, n) => {
  let r = tl.get(e);
  A4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, tl.set(e, r);
}, s4 = (e, t, n, r) => {
  var s;
  let o = Qw(t);
  const i = tl.get(o);
  if (e = e.nodeType === 11 ? e : Vr, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = h0.get(e), c;
      if (a || h0.set(e, a = /* @__PURE__ */ new Set()), !a.has(o)) {
        {
          c = Vr.createElement("style"), c.innerHTML = i;
          const u = (s = Sn.$nonce$) !== null && s !== void 0 ? s : Jw(Vr);
          u != null && c.setAttribute("nonce", u), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(o);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return o;
}, o4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = ps("attachStyles", t.$tagName$), o = s4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, Qw = (e, t) => "sc-" + e.$tagName$, p0 = (e, t, n, r, s, o) => {
  if (n !== r) {
    let i = y0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, u = g0(n), h = g0(r);
      c.remove(...u.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : y0(Ol, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && Sn.rel(e, t, n, !1), r && Sn.ael(e, t, r, !1);
    else {
      const c = Ff(r);
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
}, i4 = /\s/, g0 = (e) => e ? e.split(i4) : [], em = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, o = e && e.$attrs$ || f0, i = t.$attrs$ || f0;
  for (r in o)
    r in i || p0(s, r, o[r], void 0, n, t.$flags$);
  for (r in i)
    p0(s, r, o[r], i[r], n, t.$flags$);
}, jf = (e, t, n, r) => {
  const s = t.$children$[n];
  let o = 0, i, a;
  if (s.$text$ !== null)
    i = s.$elm$ = Vr.createTextNode(s.$text$);
  else {
    if (Wn || (Wn = s.$tag$ === "svg"), i = s.$elm$ = Vr.createElementNS(Wn ? q3 : W3, s.$tag$), Wn && s.$tag$ === "foreignObject" && (Wn = !1), em(null, s, Wn), Z3(Nc) && i["s-si"] !== Nc && i.classList.add(i["s-si"] = Nc), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        a = jf(e, s, o), a && i.appendChild(a);
    s.$tag$ === "svg" ? Wn = !1 : i.tagName === "foreignObject" && (Wn = !0);
  }
  return i;
}, tm = (e, t, n, r, s, o) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === Zw && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (a = jf(null, n, s), a && (r[s].$elm$ = a, i.insertBefore(a, t)));
}, nm = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, a4 = (e, t, n, r) => {
  let s = 0, o = 0, i = t.length - 1, a = t[0], c = t[i], u = r.length - 1, h = r[0], d = r[u], m;
  for (; s <= i && o <= u; )
    a == null ? a = t[++s] : c == null ? c = t[--i] : h == null ? h = r[++o] : d == null ? d = r[--u] : pc(a, h) ? (ua(a, h), a = t[++s], h = r[++o]) : pc(c, d) ? (ua(c, d), c = t[--i], d = r[--u]) : pc(a, d) ? (ua(a, d), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], d = r[--u]) : pc(c, h) ? (ua(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], h = r[++o]) : (m = jf(t && t[o], n, o), h = r[++o], m && a.$elm$.parentNode.insertBefore(m, a.$elm$));
  s > i ? tm(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, o, u) : o > u && nm(t, s, i);
}, pc = (e, t) => e.$tag$ === t.$tag$, ua = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, o = t.$tag$, i = t.$text$;
  i === null ? (Wn = o === "svg" ? !0 : o === "foreignObject" ? !1 : Wn, em(e, t, Wn), r !== null && s !== null ? a4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), tm(n, null, t, s, 0, s.length - 1)) : r !== null && nm(r, 0, r.length - 1), Wn && o === "svg" && (Wn = !1)) : e.$text$ !== i && (n.data = i);
}, c4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || Id(null, null), s = Q3(t) ? t : Re(null, null, t);
  Zw = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Nc = n["s-sc"], ua(r, s);
}, rm = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, Rf = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return rm(e, e.$ancestorComponent$), k4(() => l4(e, t));
}, l4 = (e, t) => {
  const n = ps("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), h4(s, () => u4(e, r, t));
}, u4 = async (e, t, n) => {
  const r = e.$hostElement$, s = ps("update", e.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && o4(e);
  const i = ps("render", e.$cmpMeta$.$tagName$);
  d4(e, t), o && (o.map((a) => a()), r["s-rc"] = void 0), i(), s();
  {
    const a = r["s-p"], c = () => f4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, d4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, c4(e, t);
  } catch (r) {
    $a(r, e.$hostElement$);
  }
  return null;
}, f4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = ps("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, om(n), r(), e.$onReadyResolve$(n), s || sm()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && Gf(() => Rf(e, !1)), e.$flags$ &= -517;
}, sm = (e) => {
  om(Vr.documentElement), Gf(() => n4(Ol, "appload", { detail: { namespace: V3 } }));
}, h4 = (e, t) => e && e.then ? e.then(t) : t(), om = (e) => e.classList.add("hydrated"), p4 = (e, t) => Xi(e).$instanceValues$.get(t), g4 = (e, t, n, r) => {
  const s = Xi(e), o = s.$instanceValues$.get(t), i = s.$flags$, a = s.$lazyInstance$;
  n = e4(n, r.$members$[t][0]);
  const c = Number.isNaN(o) && Number.isNaN(n), u = n !== o && !c;
  (!(i & 8) || o === void 0) && u && (s.$instanceValues$.set(t, n), a && (i & 18) === 2 && Rf(s, !1));
}, im = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return p4(this, o);
        },
        set(a) {
          g4(this, o, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, a, c) {
        Sn.jmp(() => {
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
}, y4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = v4(n), s.then) {
        const c = X3();
        s = await s, c();
      }
      s.isProxied || (im(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = ps("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (c) {
        $a(c);
      }
      t.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Qw(n);
      if (!tl.has(c)) {
        const u = ps("registerStyles", n.$tagName$);
        r4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const o = t.$ancestorComponent$, i = () => Rf(t, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, w4 = (e) => {
  if (!(Sn.$flags$ & 1)) {
    const t = Xi(e), n = t.$cmpMeta$, r = ps("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            rm(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && e.hasOwnProperty(s)) {
          const i = e[s];
          delete e[s], e[s] = i;
        }
      }), y4(e, t, n);
    }
    r();
  }
}, m4 = (e) => {
  Sn.$flags$ & 1 || Xi(e);
}, b4 = (e, t = {}) => {
  var n;
  const r = ps(), s = [], o = t.exclude || [], i = Ol.customElements, a = Vr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Vr.createElement("style"), h = [];
  let d, m = !0;
  Object.assign(Sn, t), Sn.$resourcesUrl$ = new URL(t.resourcesUrl || "./", Vr.baseURI).href, e.map((w) => {
    w[1].map((v) => {
      const A = {
        $flags$: v[0],
        $tagName$: v[1],
        $members$: v[2],
        $listeners$: v[3]
      };
      A.$members$ = v[2];
      const L = A.$tagName$, P = class extends HTMLElement {
        // StencilLazyHost
        constructor(O) {
          super(O), O = this, S4(O, A), A.$flags$ & 1 && O.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), m ? h.push(this) : Sn.jmp(() => w4(this));
        }
        disconnectedCallback() {
          Sn.jmp(() => m4(this));
        }
        componentOnReady() {
          return Xi(this).$onReadyPromise$;
        }
      };
      A.$lazyBundleId$ = w[0], !o.includes(L) && !i.get(L) && (s.push(L), i.define(L, im(
        P,
        A,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + Y3, u.setAttribute("data-styles", "");
    const w = (n = Sn.$nonce$) !== null && n !== void 0 ? n : Jw(Vr);
    w != null && u.setAttribute("nonce", w), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  m = !1, h.length ? h.map((w) => w.connectedCallback()) : Sn.jmp(() => d = setTimeout(sm, 30)), r();
}, zf = /* @__PURE__ */ new WeakMap(), Xi = (e) => zf.get(e), x4 = (e, t) => zf.set(t.$lazyInstance$ = e, t), S4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], zf.set(e, n);
}, y0 = (e, t) => t in e, $a = (e, t) => (0, console.error)(e, t), wu = /* @__PURE__ */ new Map(), v4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, o = wu.get(s);
  if (o)
    return o[r];
  {
    const i = (a) => (wu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => oC).then(i, $a);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (wu.set(s, i), i[r]), $a);
}, tl = /* @__PURE__ */ new Map(), Ol = typeof window < "u" ? window : {}, Vr = Ol.document || { head: {} }, Sn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, am = (e) => Promise.resolve(e), A4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), w0 = [], cm = [], E4 = (e, t) => (n) => {
  e.push(n), $d || ($d = !0, Sn.$flags$ & 4 ? Gf(Ld) : Sn.raf(Ld));
}, m0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      $a(n);
    }
  e.length = 0;
}, Ld = () => {
  m0(w0), m0(cm), ($d = w0.length > 0) && Sn.raf(Ld);
}, Gf = (e) => am().then(e), k4 = /* @__PURE__ */ E4(cm), $4 = () => am(), I4 = (e, t) => typeof window > "u" ? Promise.resolve() : $4().then(() => b4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var L4 = Object.defineProperty, C4 = Object.defineProperties, T4 = Object.getOwnPropertyDescriptors, nl = Object.getOwnPropertySymbols, lm = Object.prototype.hasOwnProperty, um = Object.prototype.propertyIsEnumerable, b0 = (e, t, n) => t in e ? L4(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, nr = (e, t) => {
  for (var n in t || (t = {})) lm.call(t, n) && b0(e, n, t[n]);
  if (nl) for (var n of nl(t)) um.call(t, n) && b0(e, n, t[n]);
  return e;
}, Br = (e, t) => C4(e, T4(t)), dm = (e, t) => {
  var n = {};
  for (var r in e) lm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && nl) for (var r of nl(e)) t.indexOf(r) < 0 && um.call(e, r) && (n[r] = e[r]);
  return n;
};
function fm() {
  return Tl(Po()) || window.StacksProvider || window.BlockstackProvider;
}
function Hl(e) {
  return e ? typeof e == "string" ? Oo.fromName(e) : "version" in e ? e : "url" in e ? new nd({ url: e.url }) : e.transactionVersion === Do.Mainnet ? new nd({ url: e.client.baseUrl }) : new rd({ url: e.client.baseUrl }) : new rd();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var B4 = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(B4 || {}), M4 = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(M4 || {}), Kf = (e) => {
  let t = e;
  if (!t) {
    let n = new Kg(["store_write"], document.location.href);
    t = new td({ appConfig: n });
  }
  return t;
};
function hm(e) {
  try {
    return Kf(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var pm = (e) => {
  let t = Kf(e).loadUserData().appPrivateKey, n = gn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function N4(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let o = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [Ho.Mainnet]: "mainnet", [Ho.Testnet]: "testnet" }, a = Hl(s);
  return o == null ? void 0 : o[i[a.chainId]];
}
function _4(e) {
  let t = Hl(e.network), n = Kf(e.userSession), r = Br(nr({}, e), { network: t, userSession: n });
  return nr({ stxAddress: N4(r) }, r);
}
async function P4(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Dw) : n = n.map((r) => Ne(qw(r)))), new gn.TokenSigner("ES256k", t).signAsync(Br(nr({}, e), { postConditions: n }));
}
function U4(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(Dw) : t = t.map((n) => Ne(qw(n)))), gn.createUnsecuredToken(Br(nr({}, e), { postConditions: t }));
}
var O4 = async ({ token: e, options: t }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = ct(a.replace(/^0x/, "")), u = Ik(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Br(nr({}, i), { stacksTransaction: u }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, Br(nr({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = t.onCancel) == null || o.call(t);
  }
}, H4 = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, o = dm(t, ["amount", "appDetails", "userSession"]);
  if (hm(s)) {
    let { privateKey: a, publicKey: c } = pm(s), u = Br(nr({}, o), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), P4(u, a);
  }
  let i = Br(nr({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), U4(i);
};
async function D4(e, t, n) {
  let r = await t(Br(nr(nr({}, _4(e)), e), { network: Hl(e.network) }));
  return O4({ token: r, options: e }, n);
}
function F4(e, t = fm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return D4(e, H4, t);
}
function gm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Br(nr({}, e), { message: Xp(t), domain: Xp(n) }) : Br(nr({}, e), { message: Ne(jo(t)), domain: Ne(jo(n)) });
}
async function j4(e, t) {
  return new gn.TokenSigner("ES256k", t).signAsync(gm(e));
}
async function R4(e) {
  let t = e, { userSession: n } = t, r = dm(t, ["userSession"]);
  if (hm(n)) {
    let { privateKey: s, publicKey: o } = pm(n), i = Br(nr({}, r), { publicKey: o });
    return j4(i, s);
  }
  return gn.createUnsecuredToken(gm(e));
}
var z4 = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(z4 || {}), ym = "asigna-stx", x0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === ym && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(K4(e, t), "*");
}), G4 = { authenticationRequest: async (e) => x0(e, "authenticationRequest"), transactionRequest: async (e) => x0(e, "transactionRequest") }, K4 = (e, t) => ({ source: ym, [t]: e }), V4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = G4);
};
V4();
var X4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function Y4(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let o = Po(), i = fm();
    if (o && i) return e(n, i);
    if (typeof window > "u") return;
    I4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : X4, c = Dv(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = t;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      u.remove(), document.body.style.overflow = h;
    };
    u.callback = (w) => {
      d(), e(n, w);
    }, u.cancelCallback = () => {
      var w;
      d(), (w = n.onCancel) == null || w.call(n);
    }, document.body.appendChild(u);
    let m = (w) => {
      w.key === "Escape" && (document.removeEventListener("keydown", m), u.remove());
    };
    document.addEventListener("keydown", m);
  };
}
var gc = Y4(F4);
function ro(e, t, n) {
  return Vf(Tn(e, t), n);
}
function Tn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Pt(r);
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
      const r = Z4(BigInt(`0x${Je(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Je(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function S0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Fa(e, t = 8) {
  return (typeof e == "bigint" ? e : Tn(e, !1)).toString(16).padStart(t * 2, "0");
}
function Dl(e) {
  return parseInt(e, 16);
}
function Vf(e, t = 16) {
  const n = Fa(e, t);
  return Pt(n);
}
function q4(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function W4(e, t) {
  return e & BigInt(1) << t;
}
function Z4(e, t) {
  return W4(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const J4 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Je(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += J4[n];
  return t;
}
function Pt(e) {
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
function Yi(e) {
  return new TextEncoder().encode(e);
}
function Xf(e) {
  return new TextDecoder().decode(e);
}
function wm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Q4(e) {
  return String.fromCharCode.apply(null, e);
}
function e$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function v0(e) {
  if (e.some(e$))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Fl(...e) {
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
function Zt(e) {
  return Fl(...e.map((t) => typeof t == "number" ? v0([t]) : t instanceof Array ? v0(t) : t));
}
var A0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(A0 || (A0 = {}));
var E0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(E0 || (E0 = {}));
var k0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(k0 || (k0 = {}));
const mm = 33, mu = 32;
function t$(e) {
  if (e.length < mu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + mu * 2), r = e.slice(2 + mu * 2);
  return {
    recoveryId: Dl(t),
    r: n,
    s: r
  };
}
function n$(e) {
  const t = typeof e == "string" ? Pt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function r$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function s$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function o$(e, t) {
  return e[t];
}
function i$(e, t, n = 0) {
  return e[n] = t, e;
}
function a$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Ro(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Cd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Cd || (Cd = {}));
const c$ = Cd.Mainnet, l$ = 128, u$ = 128, bm = 16, Io = 32, Td = 80, jl = 65, d$ = 32, f$ = 64, rl = 34;
var ke;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ke || (ke = {}));
var We;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(We || (We = {}));
var Bd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Bd || (Bd = {}));
var Dn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Dn || (Dn = {}));
const _c = ["onChainOnly", "offChainOnly", "any"], $0 = {
  [_c[0]]: Dn.OnChainOnly,
  [_c[1]]: Dn.OffChainOnly,
  [_c[2]]: Dn.Any,
  [Dn.OnChainOnly]: Dn.OnChainOnly,
  [Dn.OffChainOnly]: Dn.OffChainOnly,
  [Dn.Any]: Dn.Any
};
function h$(e) {
  if (e in $0)
    return $0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${_c.join(", ")}`);
}
var sl;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(sl || (sl = {}));
sl.Mainnet;
var Hi;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Hi || (Hi = {}));
var Fn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Fn || (Fn = {}));
var zt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(zt || (zt = {}));
var Et;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Et || (Et = {}));
var ol;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ol || (ol = {}));
var Dt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Dt || (Dt = {}));
var Ia;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Ia || (Ia = {}));
var Md;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Md || (Md = {}));
var La;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(La || (La = {}));
var I0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(I0 || (I0 = {}));
var L0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(L0 || (L0 = {}));
function Nd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function p$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function xm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function g$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Nd(e.outputLen), Nd(e.blockLen);
}
function y$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function w$(e, t) {
  xm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ao = {
  number: Nd,
  bool: p$,
  bytes: xm,
  hash: g$,
  exists: y$,
  output: w$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const bu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Fr = (e, t) => e << 32 - t | e >>> t, m$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!m$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function b$(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Yf(e) {
  if (typeof e == "string" && (e = b$(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class Sm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Qo(e) {
  const t = (r) => e().update(Yf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function x$(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
class qf extends Sm {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = bu(this.buffer);
  }
  update(t) {
    Ao.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Yf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = bu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Ao.exists(this), Ao.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    x$(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = bu(t), c = this.outputLen;
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
const S$ = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), vm = Uint8Array.from({ length: 16 }, (e, t) => t), v$ = vm.map((e) => (9 * e + 5) % 16);
let Wf = [vm], Zf = [v$];
for (let e = 0; e < 4; e++)
  for (let t of [Wf, Zf])
    t.push(t[e].map((n) => S$[n]));
const Am = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), A$ = Wf.map((e, t) => e.map((n) => Am[t][n])), E$ = Zf.map((e, t) => e.map((n) => Am[t][n])), k$ = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), $$ = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), yc = (e, t) => e << t | e >>> 32 - t;
function C0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const wc = new Uint32Array(16);
class I$ extends qf {
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
    for (let w = 0; w < 16; w++, n += 4)
      wc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, A = k$[w], L = $$[w], P = Wf[w], O = Zf[w], E = A$[w], M = E$[w];
      for (let U = 0; U < 16; U++) {
        const V = yc(r + C0(w, o, a, u) + wc[P[U]] + A, E[U]) + d | 0;
        r = d, d = u, u = yc(a, 10) | 0, a = o, o = V;
      }
      for (let U = 0; U < 16; U++) {
        const V = yc(s + C0(v, i, c, h) + wc[O[U]] + L, M[U]) + m | 0;
        s = m, m = h, h = yc(c, 10) | 0, c = i, i = V;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    wc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const L$ = Qo(() => new I$()), C$ = (e, t, n) => e & t ^ ~e & n, T$ = (e, t, n) => e & t ^ e & n ^ t & n, B$ = new Uint32Array([
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
]), zs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Gs = new Uint32Array(64);
class Em extends qf {
  constructor() {
    super(64, 32, 8, !1), this.A = zs[0] | 0, this.B = zs[1] | 0, this.C = zs[2] | 0, this.D = zs[3] | 0, this.E = zs[4] | 0, this.F = zs[5] | 0, this.G = zs[6] | 0, this.H = zs[7] | 0;
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
      Gs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Gs[d - 15], w = Gs[d - 2], v = Fr(m, 7) ^ Fr(m, 18) ^ m >>> 3, A = Fr(w, 17) ^ Fr(w, 19) ^ w >>> 10;
      Gs[d] = A + Gs[d - 7] + v + Gs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Fr(a, 6) ^ Fr(a, 11) ^ Fr(a, 25), w = h + m + C$(a, c, u) + B$[d] + Gs[d] | 0, A = (Fr(r, 2) ^ Fr(r, 13) ^ Fr(r, 22)) + T$(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Gs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class M$ extends Em {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Jf = Qo(() => new Em());
Qo(() => new M$());
const mc = BigInt(2 ** 32 - 1), _d = BigInt(32);
function km(e, t = !1) {
  return t ? { h: Number(e & mc), l: Number(e >> _d & mc) } : { h: Number(e >> _d & mc) | 0, l: Number(e & mc) | 0 };
}
function N$(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = km(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const _$ = (e, t) => BigInt(e >>> 0) << _d | BigInt(t >>> 0), P$ = (e, t, n) => e >>> n, U$ = (e, t, n) => e << 32 - n | t >>> n, O$ = (e, t, n) => e >>> n | t << 32 - n, H$ = (e, t, n) => e << 32 - n | t >>> n, D$ = (e, t, n) => e << 64 - n | t >>> n - 32, F$ = (e, t, n) => e >>> n - 32 | t << 64 - n, j$ = (e, t) => t, R$ = (e, t) => e, z$ = (e, t, n) => e << n | t >>> 32 - n, G$ = (e, t, n) => t << n | e >>> 32 - n, K$ = (e, t, n) => t << n - 32 | e >>> 64 - n, V$ = (e, t, n) => e << n - 32 | t >>> 64 - n;
function X$(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Y$ = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), q$ = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, W$ = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Z$ = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, J$ = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Q$ = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, qe = {
  fromBig: km,
  split: N$,
  toBig: _$,
  shrSH: P$,
  shrSL: U$,
  rotrSH: O$,
  rotrSL: H$,
  rotrBH: D$,
  rotrBL: F$,
  rotr32H: j$,
  rotr32L: R$,
  rotlSH: z$,
  rotlSL: G$,
  rotlBH: K$,
  rotlBL: V$,
  add: X$,
  add3L: Y$,
  add3H: q$,
  add4L: W$,
  add4H: Z$,
  add5H: Q$,
  add5L: J$
}, [e8, t8] = qe.split([
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
].map((e) => BigInt(e))), Ks = new Uint32Array(80), Vs = new Uint32Array(80);
class Rl extends qf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: A, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, m, w, v, A, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, m, w, v, A, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = A | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Ks[E] = t.getUint32(n), Vs[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const M = Ks[E - 15] | 0, U = Vs[E - 15] | 0, V = qe.rotrSH(M, U, 1) ^ qe.rotrSH(M, U, 8) ^ qe.shrSH(M, U, 7), ce = qe.rotrSL(M, U, 1) ^ qe.rotrSL(M, U, 8) ^ qe.shrSL(M, U, 7), te = Ks[E - 2] | 0, Y = Vs[E - 2] | 0, b = qe.rotrSH(te, Y, 19) ^ qe.rotrBH(te, Y, 61) ^ qe.shrSH(te, Y, 6), $ = qe.rotrSL(te, Y, 19) ^ qe.rotrBL(te, Y, 61) ^ qe.shrSL(te, Y, 6), N = qe.add4L(ce, $, Vs[E - 7], Vs[E - 16]), _ = qe.add4H(N, V, b, Ks[E - 7], Ks[E - 16]);
      Ks[E] = _ | 0, Vs[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: A, Gl: L, Hh: P, Hl: O } = this;
    for (let E = 0; E < 80; E++) {
      const M = qe.rotrSH(d, m, 14) ^ qe.rotrSH(d, m, 18) ^ qe.rotrBH(d, m, 41), U = qe.rotrSL(d, m, 14) ^ qe.rotrSL(d, m, 18) ^ qe.rotrBL(d, m, 41), V = d & w ^ ~d & A, ce = m & v ^ ~m & L, te = qe.add5L(O, U, ce, t8[E], Vs[E]), Y = qe.add5H(te, P, M, V, e8[E], Ks[E]), b = te | 0, $ = qe.rotrSH(r, s, 28) ^ qe.rotrBH(r, s, 34) ^ qe.rotrBH(r, s, 39), N = qe.rotrSL(r, s, 28) ^ qe.rotrBL(r, s, 34) ^ qe.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, q = s & i ^ s & c ^ i & c;
      P = A | 0, O = L | 0, A = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = qe.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const R = qe.add3L(b, N, q);
      r = qe.add3H(R, Y, $, _), s = R | 0;
    }
    ({ h: r, l: s } = qe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = qe.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = qe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = qe.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = qe.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = qe.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: A, l: L } = qe.add(this.Gh | 0, this.Gl | 0, A | 0, L | 0), { h: P, l: O } = qe.add(this.Hh | 0, this.Hl | 0, P | 0, O | 0), this.set(r, s, o, i, a, c, u, h, d, m, w, v, A, L, P, O);
  }
  roundClean() {
    Ks.fill(0), Vs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class n8 extends Rl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class r8 extends Rl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class s8 extends Rl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Qo(() => new Rl());
Qo(() => new n8());
const o8 = Qo(() => new r8());
Qo(() => new s8());
function $m(e) {
  if (Pt(e).byteLength != jl)
    throw Error("Invalid signature");
  return {
    type: ke.MessageSignature,
    data: e
  };
}
function da(e, t) {
  return { type: ke.Address, version: e, hash160: t };
}
function xi(e) {
  return Wo.c32address(e.version, e.hash160);
}
function zo(e, t, n) {
  const r = t || 1, s = n || l$;
  if (zm(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ke.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Qf(e) {
  const t = Wo.c32addressDecode(e);
  return {
    type: ke.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ie;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ie || (ie = {}));
function i8(e) {
  if (e.type === ie.PrincipalStandard)
    return xi(e.address);
  if (e.type === ie.PrincipalContract)
    return `${xi(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Im(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return l8(t, n);
  } else
    return a8(e);
}
function a8(e) {
  const t = Qf(e);
  return { type: ie.PrincipalStandard, address: t };
}
function c8(e) {
  return { type: ie.PrincipalStandard, address: e };
}
function l8(e, t) {
  const n = Qf(e), r = zo(t);
  return Lm(n, r);
}
function Lm(e, t) {
  if (Yi(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ie.PrincipalContract, address: e, contractName: t };
}
function xu(e, t = !1) {
  switch (e.type) {
    case ie.BoolTrue:
      return !0;
    case ie.BoolFalse:
      return !1;
    case ie.Int:
    case ie.UInt:
      return t ? e.value.toString() : e.value;
    case ie.Buffer:
      return `0x${Je(e.buffer)}`;
    case ie.OptionalNone:
      return null;
    case ie.OptionalSome:
      return $r(e.value);
    case ie.ResponseErr:
      return $r(e.value);
    case ie.ResponseOk:
      return $r(e.value);
    case ie.PrincipalStandard:
    case ie.PrincipalContract:
      return i8(e);
    case ie.List:
      return e.list.map((r) => $r(r));
    case ie.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = $r(e.data[r]);
      }), n;
    case ie.StringASCII:
      return e.data;
    case ie.StringUTF8:
      return e.data;
  }
}
function $r(e) {
  switch (e.type) {
    case ie.ResponseErr:
      return { type: Ws(e), value: xu(e, !0), success: !1 };
    case ie.ResponseOk:
      return { type: Ws(e), value: xu(e, !0), success: !0 };
    default:
      return { type: Ws(e), value: xu(e, !0) };
  }
}
function Ws(e) {
  switch (e.type) {
    case ie.BoolTrue:
    case ie.BoolFalse:
      return "bool";
    case ie.Int:
      return "int";
    case ie.UInt:
      return "uint";
    case ie.Buffer:
      return `(buff ${e.buffer.length})`;
    case ie.OptionalNone:
      return "(optional none)";
    case ie.OptionalSome:
      return `(optional ${Ws(e.value)})`;
    case ie.ResponseErr:
      return `(response UnknownType ${Ws(e.value)})`;
    case ie.ResponseOk:
      return `(response ${Ws(e.value)} UnknownType)`;
    case ie.PrincipalStandard:
    case ie.PrincipalContract:
      return "principal";
    case ie.List:
      return `(list ${e.list.length} ${e.list.length ? Ws(e.list[0]) : "UnknownType"})`;
    case ie.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${Ws(e.data[t])})`).join(" ")})`;
    case ie.StringASCII:
      return `(string-ascii ${wm(e.data).length})`;
    case ie.StringUTF8:
      return `(string-utf8 ${Yi(e.data).length})`;
  }
}
const Cm = () => ({ type: ie.BoolTrue }), Tm = () => ({ type: ie.BoolFalse }), u8 = (e) => e ? Cm() : Tm(), T0 = BigInt("0xffffffffffffffffffffffffffffffff"), d8 = BigInt(0), B0 = BigInt("0x7fffffffffffffffffffffffffffffff"), M0 = BigInt("-170141183460469231731687303715884105728"), f8 = (e) => {
  const t = Tn(e, !0);
  if (t > B0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${B0}`);
  if (t < M0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${M0}`);
  return { type: ie.Int, value: t };
}, cn = (e) => {
  const t = Tn(e, !1);
  if (t < d8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > T0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${T0}`);
  return { type: ie.UInt, value: t };
}, Bm = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ie.Buffer, buffer: e };
};
function Mm() {
  return { type: ie.OptionalNone };
}
function Nm(e) {
  return { type: ie.OptionalSome, value: e };
}
function h8(e) {
  return { type: ie.ResponseErr, value: e };
}
function p8(e) {
  return { type: ie.ResponseOk, value: e };
}
function g8(e) {
  return { type: ie.List, list: e };
}
function rr(e) {
  for (const t in e)
    if (!s6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ie.Tuple, data: e };
}
const dt = (e) => ({ type: ie.StringASCII, data: e }), y8 = (e) => ({ type: ie.StringUTF8, data: e });
class _m extends Sm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Ao.hash(t);
    const r = Yf(n);
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
    return Ao.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Ao.exists(this), Ao.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const Pm = (e, t, n) => new _m(e, t).update(n).digest();
Pm.create = (e, t) => new _m(e, t);
Gt.hmacSha256Sync = (e, ...t) => {
  const n = Pm.create(Jf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Di(e) {
  return {
    type: ke.PublicKey,
    data: Pt(e)
  };
}
function w8(e, t, n = Dt.Compressed) {
  const r = t$(t.data), s = new er(S0(r.r), S0(r.s)), o = Ze.fromSignature(e, s, r.recoveryId), i = n === Dt.Compressed;
  return o.toHex(i);
}
function m8(e) {
  return { type: ke.PublicKey, data: e };
}
function qi(e) {
  return !Je(e.data).startsWith("04");
}
function il(e) {
  return e.data.slice();
}
function b8(e) {
  const t = v8(e), n = Pa(t.data.slice(0, 32), t.compressed);
  return Di(Je(n));
}
function x8(e) {
  const t = typeof e == "string" ? e : Je(e), n = Ze.fromHex(t).toHex(!0);
  return Di(n);
}
function S8(e) {
  const t = typeof e == "string" ? e : Je(e), n = Ze.fromHex(t).toHex(!1);
  return Di(n);
}
function Pd(e) {
  const t = e.readUInt8(), n = t === 4 ? f$ : d$;
  return m8(Zt([t, e.readBytes(n)]));
}
function v8(e) {
  const t = n$(e), n = t.length == mm;
  return { data: t, compressed: n };
}
function A8(e, t) {
  const [n, r] = xl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = Fa(r, 1) + er.fromHex(n).toCompactHex();
  return $m(o);
}
function E8(e) {
  return b8(e.data);
}
function k8(e, t, n) {
  return typeof e == "string" && (e = Im(e)), typeof n == "string" && (n = P0(n)), {
    type: ke.Payload,
    payloadType: We.TokenTransfer,
    recipient: e,
    amount: Tn(t, !1),
    memo: n ?? P0("")
  };
}
function $8(e, t, n, r) {
  return typeof e == "string" && (e = Qf(e)), typeof t == "string" && (t = zo(t)), typeof n == "string" && (n = zo(n)), {
    type: ke.Payload,
    payloadType: We.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function N0(e, t, n) {
  return typeof e == "string" && (e = zo(e)), typeof t == "string" && (t = P8(t)), typeof n == "number" ? {
    type: ke.Payload,
    payloadType: We.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ke.Payload,
    payloadType: We.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function I8() {
  return { type: ke.Payload, payloadType: We.PoisonMicroblock };
}
function _0(e, t) {
  if (e.byteLength != Io)
    throw Error(`Coinbase buffer size must be ${Io} bytes`);
  return t != null ? {
    type: ke.Payload,
    payloadType: We.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ke.Payload,
    payloadType: We.Coinbase,
    coinbaseBytes: e
  };
}
function L8(e, t, n) {
  if (e.byteLength != Io)
    throw Error(`Coinbase buffer size must be ${Io} bytes`);
  if (n.byteLength != Td)
    throw Error(`VRF proof buffer size must be ${Td} bytes`);
  return {
    type: ke.Payload,
    payloadType: We.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ie.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var Ud;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Ud || (Ud = {}));
function C8(e, t, n, r, s, o, i) {
  return {
    type: ke.Payload,
    payloadType: We.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function Um(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case We.TokenTransfer:
      t.push(Yt(e.recipient)), t.push(ro(e.amount, !1, 8)), t.push(as(e.memo));
      break;
    case We.ContractCall:
      t.push(as(e.contractAddress)), t.push(as(e.contractName)), t.push(as(e.functionName));
      const n = new Uint8Array(4);
      Ro(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Yt(r));
      });
      break;
    case We.SmartContract:
      t.push(as(e.contractName)), t.push(as(e.codeBody));
      break;
    case We.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(as(e.contractName)), t.push(as(e.codeBody));
      break;
    case We.PoisonMicroblock:
      break;
    case We.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case We.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Yt(e.recipient));
      break;
    case We.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Yt(e.recipient ? Nm(e.recipient) : Mm())), t.push(e.vrfProof);
      break;
    case We.TenureChange:
      t.push(Pt(e.tenureHash)), t.push(Pt(e.previousTenureHash)), t.push(Pt(e.burnViewHash)), t.push(Pt(e.previousTenureEnd)), t.push(Ro(new Uint8Array(4), e.previousTenureBlocks)), t.push(i$(new Uint8Array(1), e.cause)), t.push(Pt(e.publicKeyHash));
      break;
  }
  return Zt(t);
}
function T8(e) {
  switch (e.readUInt8Enum(We, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case We.TokenTransfer:
      const n = pr(e), r = Tn(e.readBytes(8), !1), s = Hm(e);
      return k8(n, r, s);
    case We.ContractCall:
      const o = Fi(e), i = hr(e), a = hr(e), c = [], u = e.readUInt32BE();
      for (let E = 0; E < u; E++) {
        const M = pr(e);
        c.push(M);
      }
      return $8(o, i, a, c);
    case We.SmartContract:
      const h = hr(e), d = hr(e, 4, 1e5);
      return N0(h, d);
    case We.VersionedSmartContract: {
      const E = e.readUInt8Enum(Bd, (V) => {
        throw new Error(`Cannot recognize ClarityVersion: ${V}`);
      }), M = hr(e), U = hr(e, 4, 1e5);
      return N0(M, U, E);
    }
    case We.PoisonMicroblock:
      return I8();
    case We.Coinbase: {
      const E = e.readBytes(Io);
      return _0(E);
    }
    case We.CoinbaseToAltRecipient: {
      const E = e.readBytes(Io), M = pr(e);
      return _0(E, M);
    }
    case We.NakamotoCoinbase: {
      const E = e.readBytes(Io), M = pr(e), U = e.readBytes(Td);
      return L8(E, M, U);
    }
    case We.TenureChange:
      const m = Je(e.readBytes(20)), w = Je(e.readBytes(20)), v = Je(e.readBytes(20)), A = Je(e.readBytes(32)), L = e.readUInt32BE(), P = e.readUInt8Enum(Ud, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), O = Je(e.readBytes(20));
      return C8(m, w, v, A, L, P, O);
  }
}
class zl extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class mo extends zl {
  constructor(t) {
    super(t);
  }
}
class Qn extends zl {
  constructor(t) {
    super(t);
  }
}
class al extends zl {
  constructor(t) {
    super(t);
  }
}
class Eo extends zl {
  constructor(t) {
    super(t);
  }
}
var Ir;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ir || (Ir = {}));
function Od(e) {
  return $m(Je(e.readBytes(jl)));
}
function Si(e, t) {
  return {
    pubKeyEncoding: e,
    type: ke.TransactionAuthField,
    contents: t
  };
}
function B8(e) {
  const t = e.readUInt8Enum(Ir, (n) => {
    throw new Qn(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Ir.PublicKeyCompressed:
      return Si(Dt.Compressed, Pd(e));
    case Ir.PublicKeyUncompressed:
      return Si(Dt.Uncompressed, S8(Pd(e).data));
    case Ir.SignatureCompressed:
      return Si(Dt.Compressed, Od(e));
    case Ir.SignatureUncompressed:
      return Si(Dt.Uncompressed, Od(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function eh(e) {
  return Pt(e.data);
}
function M8(e) {
  const t = [];
  switch (e.contents.type) {
    case ke.PublicKey:
      t.push(e.pubKeyEncoding === Dt.Compressed ? Ir.PublicKeyCompressed : Ir.PublicKeyUncompressed), t.push(il(x8(e.contents.data)));
      break;
    case ke.MessageSignature:
      t.push(e.pubKeyEncoding === Dt.Compressed ? Ir.SignatureCompressed : Ir.SignatureUncompressed), t.push(eh(e.contents));
      break;
  }
  return Zt(t);
}
function as(e) {
  switch (e.type) {
    case ke.Address:
      return ja(e);
    case ke.Principal:
      return Om(e);
    case ke.LengthPrefixedString:
      return ji(e);
    case ke.MemoString:
      return U8(e);
    case ke.AssetInfo:
      return Dm(e);
    case ke.PostCondition:
      return O8(e);
    case ke.PublicKey:
      return il(e);
    case ke.LengthPrefixedList:
      return rh(e);
    case ke.Payload:
      return Um(e);
    case ke.TransactionAuthField:
      return M8(e);
    case ke.MessageSignature:
      return eh(e);
  }
}
function N8() {
  return {
    type: ke.Address,
    version: ol.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function th(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Et.SerializeP2PKH || t === Et.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Et.SerializeP2WPKH || t === Et.SerializeP2WSH || t === Et.SerializeP2WSHNonSequential) && !r.every(qi))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Et.SerializeP2PKH:
      return da(e, e6(r[0].data));
    case Et.SerializeP2WPKH:
      return da(e, t6(r[0].data));
    case Et.SerializeP2SH:
    case Et.SerializeP2SHNonSequential:
      return da(e, n6(n, r.map(il)));
    case Et.SerializeP2WSH:
    case Et.SerializeP2WSHNonSequential:
      return da(e, r6(n, r.map(il)));
  }
}
function ja(e) {
  const t = [];
  return t.push(Pt(Fa(e.version, 1))), t.push(Pt(e.hash160)), Zt(t);
}
function Fi(e) {
  const t = Dl(Je(e.readBytes(1))), n = Je(e.readBytes(20));
  return { type: ke.Address, version: t, hash160: n };
}
function Om(e) {
  const t = [];
  return t.push(e.prefix), t.push(ja(e.address)), e.prefix === La.Contract && t.push(ji(e.contractName)), Zt(t);
}
function _8(e) {
  const t = e.readUInt8Enum(La, (s) => {
    throw new Qn(`Unexpected Principal payload type: ${s}`);
  }), n = Fi(e);
  if (t === La.Standard)
    return { type: ke.Principal, prefix: t, address: n };
  const r = hr(e);
  return {
    type: ke.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function ji(e) {
  const t = [], n = Yi(e.content), r = n.byteLength;
  return t.push(Pt(Fa(r, e.lengthPrefixBytes))), t.push(n), Zt(t);
}
function hr(e, t, n) {
  t = t || 1;
  const r = Dl(Je(e.readBytes(t))), s = Xf(e.readBytes(r));
  return zo(s, t, n ?? 128);
}
function P8(e) {
  return zo(e, 4, 1e5);
}
function P0(e) {
  if (e && zm(e, rl))
    throw new Error(`Memo exceeds maximum length of ${rl} bytes`);
  return { type: ke.MemoString, content: e };
}
function U8(e) {
  const t = [], n = Yi(e.content), r = Q8(Je(n), rl * 2);
  return t.push(Pt(r)), Zt(t);
}
function Hm(e) {
  let t = Xf(e.readBytes(rl));
  return t = t.replace(/\u0000*$/, ""), { type: ke.MemoString, content: t };
}
function Dm(e) {
  const t = [];
  return t.push(ja(e.address)), t.push(ji(e.contractName)), t.push(ji(e.assetName)), Zt(t);
}
function Hd(e) {
  return {
    type: ke.AssetInfo,
    address: Fi(e),
    contractName: hr(e),
    assetName: hr(e)
  };
}
function nh(e, t) {
  return {
    type: ke.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function rh(e) {
  const t = e.values, n = [];
  n.push(Pt(Fa(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(as(r));
  return Zt(n);
}
function Fm(e, t, n) {
  const r = Dl(Je(e.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (t) {
      case ke.Address:
        s.push(Fi(e));
        break;
      case ke.LengthPrefixedString:
        s.push(hr(e));
        break;
      case ke.MemoString:
        s.push(Hm(e));
        break;
      case ke.AssetInfo:
        s.push(Hd(e));
        break;
      case ke.PostCondition:
        s.push(H8(e));
        break;
      case ke.PublicKey:
        s.push(Pd(e));
        break;
      case ke.TransactionAuthField:
        s.push(B8(e));
        break;
    }
  return nh(s, n);
}
function O8(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Om(e.principal)), (e.conditionType === Fn.Fungible || e.conditionType === Fn.NonFungible) && t.push(Dm(e.assetInfo)), e.conditionType === Fn.NonFungible && t.push(Yt(e.assetName)), t.push(e.conditionCode), e.conditionType === Fn.STX || e.conditionType === Fn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new mo("The post-condition amount may not be larger than 8 bytes");
    t.push(ro(e.amount, !1, 8));
  }
  return Zt(t);
}
function H8(e) {
  const t = e.readUInt8Enum(Fn, (i) => {
    throw new Qn(`Could not read ${i} as PostConditionType`);
  }), n = _8(e);
  let r, s, o;
  switch (t) {
    case Fn.STX:
      return r = e.readUInt8Enum(Ia, (a) => {
        throw new Qn(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${Je(e.readBytes(8))}`), {
        type: ke.PostCondition,
        conditionType: Fn.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case Fn.Fungible:
      return s = Hd(e), r = e.readUInt8Enum(Ia, (a) => {
        throw new Qn(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${Je(e.readBytes(8))}`), {
        type: ke.PostCondition,
        conditionType: Fn.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case Fn.NonFungible:
      s = Hd(e);
      const i = pr(e);
      return r = e.readUInt8Enum(Md, (a) => {
        throw new Qn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ke.PostCondition,
        conditionType: Fn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: i
      };
  }
}
function Zr(e, t) {
  return Zt([e, t]);
}
function D8(e) {
  return new Uint8Array([e.type]);
}
function F8(e) {
  return e.type === ie.OptionalNone ? new Uint8Array([e.type]) : Zr(e.type, Yt(e.value));
}
function j8(e) {
  const t = new Uint8Array(4);
  return Ro(t, e.buffer.length, 0), Zr(e.type, Fl(t, e.buffer));
}
function R8(e) {
  const t = Vf(q4(e.value, BigInt(u$)), bm);
  return Zr(e.type, t);
}
function z8(e) {
  const t = Vf(e.value, bm);
  return Zr(e.type, t);
}
function G8(e) {
  return Zr(e.type, ja(e.address));
}
function K8(e) {
  return Zr(e.type, Fl(ja(e.address), ji(e.contractName)));
}
function V8(e) {
  return Zr(e.type, Yt(e.value));
}
function X8(e) {
  const t = [], n = new Uint8Array(4);
  Ro(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Yt(r);
    t.push(s);
  }
  return Zr(e.type, Zt(t));
}
function Y8(e) {
  const t = [], n = new Uint8Array(4);
  Ro(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = zo(s);
    t.push(ji(o));
    const i = Yt(e.data[s]);
    t.push(i);
  }
  return Zr(e.type, Zt(t));
}
function jm(e, t) {
  const n = [], r = t == "ascii" ? wm(e.data) : Yi(e.data), s = new Uint8Array(4);
  return Ro(s, r.length, 0), n.push(s), n.push(r), Zr(e.type, Zt(n));
}
function q8(e) {
  return jm(e, "ascii");
}
function W8(e) {
  return jm(e, "utf8");
}
function Yt(e) {
  switch (e.type) {
    case ie.BoolTrue:
    case ie.BoolFalse:
      return D8(e);
    case ie.OptionalNone:
    case ie.OptionalSome:
      return F8(e);
    case ie.Buffer:
      return j8(e);
    case ie.UInt:
      return z8(e);
    case ie.Int:
      return R8(e);
    case ie.PrincipalStandard:
      return G8(e);
    case ie.PrincipalContract:
      return K8(e);
    case ie.ResponseOk:
    case ie.ResponseErr:
      return V8(e);
    case ie.List:
      return X8(e);
    case ie.Tuple:
      return Y8(e);
    case ie.StringASCII:
      return q8(e);
    case ie.StringUTF8:
      return W8(e);
    default:
      throw new mo("Unable to serialize. Invalid Clarity Value.");
  }
}
function Z8(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const U0 = /* @__PURE__ */ new Map();
function Rm(e, t) {
  const n = U0.get(e);
  if (n !== void 0)
    return n(t);
  const r = Z8(e);
  return U0.set(e, r), Rm(e, t);
}
class wa {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return a$(this.readBytes(4), 0);
  }
  readUInt8() {
    return o$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return r$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Je(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Je(n);
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
    if (Rm(t, r))
      return r;
    throw n(r);
  }
}
function pr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new wa(Pt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new wa(e) : t = e;
  switch (t.readUInt8Enum(ie, (r) => {
    throw new Qn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ie.Int:
      return f8(t.readBytes(16));
    case ie.UInt:
      return cn(t.readBytes(16));
    case ie.Buffer:
      const r = t.readUInt32BE();
      return Bm(t.readBytes(r));
    case ie.BoolTrue:
      return Cm();
    case ie.BoolFalse:
      return Tm();
    case ie.PrincipalStandard:
      const s = Fi(t);
      return c8(s);
    case ie.PrincipalContract:
      const o = Fi(t), i = hr(t);
      return Lm(o, i);
    case ie.ResponseOk:
      return p8(pr(t));
    case ie.ResponseErr:
      return h8(pr(t));
    case ie.OptionalNone:
      return Mm();
    case ie.OptionalSome:
      return Nm(pr(t));
    case ie.List:
      const a = t.readUInt32BE(), c = [];
      for (let A = 0; A < a; A++)
        c.push(pr(t));
      return g8(c);
    case ie.Tuple:
      const u = t.readUInt32BE(), h = {};
      for (let A = 0; A < u; A++) {
        const L = hr(t).content;
        if (L === void 0)
          throw new Qn('"content" is undefined');
        h[L] = pr(t);
      }
      return rr(h);
    case ie.StringASCII:
      const d = t.readUInt32BE(), m = Q4(t.readBytes(d));
      return dt(m);
    case ie.StringUTF8:
      const w = t.readUInt32BE(), v = Xf(t.readBytes(w));
      return y8(v);
    default:
      throw new Qn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const J8 = (e) => e.length % 2 == 0 ? e : `0${e}`, Q8 = (e, t) => e.padEnd(t, "0"), zm = (e, t) => e ? Yi(e).length > t : !1;
function Dd(e) {
  return cw(e);
}
const Ca = (e) => L$(Jf(e)), sh = (e) => Je(o8(e)), e6 = (e) => Je(Ca(e)), t6 = (e) => {
  const t = Ca(e), n = Fl(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ca(n);
  return Je(r);
}, n6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = Zt(n), s = Ca(r);
  return Je(s);
}, r6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = Zt(n), s = Jf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = Zt(o), a = Ca(i);
  return Je(a);
};
function s6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Gm(e) {
  const t = Yt(e);
  return `0x${Je(t)}`;
}
function o6(e) {
  return pr(e);
}
const Ei = (e) => {
  try {
    return Wo.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function oh() {
  return {
    type: ke.MessageSignature,
    data: Je(new Uint8Array(jl))
  };
}
function Km(e, t, n, r) {
  const s = th(0, e, 1, [Di(t)]).hash160, o = qi(Di(t)) ? Dt.Compressed : Dt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Tn(n, !1),
    fee: Tn(r, !1),
    keyEncoding: o,
    signature: oh()
  };
}
function Ta(e) {
  return "signature" in e;
}
function O0(e) {
  return e === Et.SerializeP2SH || e === Et.SerializeP2WSH;
}
function i6(e) {
  return e === Et.SerializeP2SHNonSequential || e === Et.SerializeP2WSHNonSequential;
}
function H0(e) {
  const t = Dd(e);
  return t.nonce = 0, t.fee = 0, Ta(t) ? t.signature = oh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function a6(e) {
  const t = [
    e.hashMode,
    Pt(e.signer),
    ro(e.nonce, !1, 8),
    ro(e.fee, !1, 8),
    e.keyEncoding,
    eh(e.signature)
  ];
  return Zt(t);
}
function c6(e) {
  const t = [
    e.hashMode,
    Pt(e.signer),
    ro(e.nonce, !1, 8),
    ro(e.fee, !1, 8)
  ], n = nh(e.fields);
  t.push(rh(n));
  const r = new Uint8Array(2);
  return s$(r, e.signaturesRequired, 0), t.push(r), Zt(t);
}
function l6(e, t) {
  const n = Je(t.readBytes(20)), r = BigInt(`0x${Je(t.readBytes(8))}`), s = BigInt(`0x${Je(t.readBytes(8))}`), o = t.readUInt8Enum(Dt, (a) => {
    throw new Qn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Et.SerializeP2WPKH && o != Dt.Compressed)
    throw new Qn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Od(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function u6(e, t) {
  const n = Je(t.readBytes(20)), r = BigInt("0x" + Je(t.readBytes(8))), s = BigInt("0x" + Je(t.readBytes(8))), o = Fm(t, ke.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case ke.PublicKey:
        qi(u.contents) || (i = !0);
        break;
      case ke.MessageSignature:
        if (u.pubKeyEncoding === Dt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Eo("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Et.SerializeP2WSH || e === Et.SerializeP2WSHNonSequential))
    throw new Eo("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function Su(e) {
  return Ta(e) ? a6(e) : c6(e);
}
function vu(e) {
  const t = e.readUInt8Enum(Et, (n) => {
    throw new Qn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Et.SerializeP2PKH || t === Et.SerializeP2WPKH ? l6(t, e) : u6(t, e);
}
function Vm(e, t, n, r) {
  const o = e + Je(new Uint8Array([t])) + Je(ro(n, !1, 8)) + Je(ro(r, !1, 8));
  if (Pt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return sh(Pt(o));
}
function Xm(e, t, n) {
  const r = 33 + jl, s = qi(t) ? Dt.Compressed : Dt.Uncompressed, o = e + J8(s.toString(16)) + n.data, i = Pt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return sh(i);
}
function d6(e, t, n, r, s) {
  const o = Vm(e, t, n, r), i = A8(s, o), a = E8(s), c = Xm(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function Ym(e, t, n, r, s, o) {
  const i = Vm(e, t, n, r), a = Di(w8(i, o, s)), c = Xm(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function f6() {
  const e = Km(Et.SerializeP2PKH, "", 0, 0);
  return e.signer = N8().hash160, e.keyEncoding = Dt.Compressed, e.signature = oh(), e;
}
function D0(e, t, n) {
  return Ta(e) ? h6(e, t, n) : p6(e, t, n);
}
function h6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Ym(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), o = th(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new Eo(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function p6(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case ke.PublicKey:
        qi(c.contents) || (o = !0), r.push(c.contents);
        break;
      case ke.MessageSignature:
        c.pubKeyEncoding === Dt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = Ym(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (O0(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new Eo("Too many signatures");
        break;
    }
  if (O0(e.hashMode) && i !== e.signaturesRequired || i6(e.hashMode) && i < e.signaturesRequired)
    throw new Eo("Incorrect number of signatures");
  if (o && (e.hashMode === Et.SerializeP2WSH || e.hashMode === Et.SerializeP2WSHNonSequential))
    throw new Eo("Uncompressed keys are not allowed in this hash mode");
  const a = th(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Eo(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function qm(e) {
  return {
    authType: zt.Standard,
    spendingCondition: e
  };
}
function Wm(e, t) {
  return {
    authType: zt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Km(Et.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function F0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case zt.Standard:
        return qm(H0(e.spendingCondition));
      case zt.Sponsored:
        return Wm(H0(e.spendingCondition), f6());
      default:
        throw new al("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function g6(e, t) {
  switch (e.authType) {
    case zt.Standard:
      return D0(e.spendingCondition, t, zt.Standard);
    case zt.Sponsored:
      return D0(e.spendingCondition, t, zt.Standard);
    default:
      throw new al("Invalid origin auth type");
  }
}
function y6(e, t) {
  switch (e.authType) {
    case zt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Tn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case zt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Tn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function w6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Tn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function m6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Tn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function b6(e, t) {
  const n = {
    ...t,
    nonce: Tn(t.nonce, !1),
    fee: Tn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function x6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case zt.Standard:
      t.push(Su(e.spendingCondition));
      break;
    case zt.Sponsored:
      t.push(Su(e.spendingCondition)), t.push(Su(e.sponsorSpendingCondition));
      break;
  }
  return Zt(t);
}
function S6(e) {
  const t = e.readUInt8Enum(zt, (r) => {
    throw new Qn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case zt.Standard:
      return n = vu(e), qm(n);
    case zt.Sponsored:
      n = vu(e);
      const r = vu(e);
      return Wm(n, r);
  }
}
class v6 {
  constructor(t, n, r, s, o, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Tn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? c$, this.postConditionMode = o ?? Hi.Deny, this.postConditions = s ?? nh([]), i)
      this.anchorMode = h$(i);
    else
      switch (r.payloadType) {
        case We.Coinbase:
        case We.CoinbaseToAltRecipient:
        case We.NakamotoCoinbase:
        case We.PoisonMicroblock:
        case We.TenureChange:
          this.anchorMode = Dn.OnChainOnly;
          break;
        case We.ContractCall:
        case We.SmartContract:
        case We.VersionedSmartContract:
        case We.TokenTransfer:
          this.anchorMode = Dn.Any;
          break;
      }
  }
  signBegin() {
    const t = Dd(this);
    return t.auth = F0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Dd(this);
    return t.auth = F0(t.auth), t.txid();
  }
  verifyOrigin() {
    return g6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, zt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === zt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, zt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !Ta(n)) {
      const r = qi(t);
      n.fields.push(Si(r ? Dt.Compressed : Dt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = d6(n, r, t.fee, t.nonce, s);
    return Ta(t) ? t.signature = o : t.fields.push(Si(s.data.byteLength === mm ? Dt.Compressed : Dt.Uncompressed, o)), i;
  }
  txid() {
    const t = this.serialize();
    return sh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != zt.Sponsored)
      throw new al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = b6(this.auth, t);
  }
  setFee(t) {
    this.auth = y6(this.auth, t);
  }
  setNonce(t) {
    this.auth = w6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != zt.Sponsored)
      throw new al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = m6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new mo('"version" is undefined');
    if (this.chainId === void 0)
      throw new mo('"chainId" is undefined');
    if (this.auth === void 0)
      throw new mo('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new mo('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new mo('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return Ro(n, this.chainId, 0), t.push(n), t.push(x6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(rh(this.postConditions)), t.push(Um(this.payload)), Zt(t);
  }
}
function vi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new wa(Pt(e.slice(2))) : t = new wa(Pt(e)) : e instanceof Uint8Array ? t = new wa(e) : t = e;
  const n = t.readUInt8Enum(sl, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = S6(t), o = t.readUInt8Enum(Dn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(Hi, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Fm(t, ke.PostCondition), c = T8(t);
  return new v6(n, s, c, a, i, o, r);
}
const A6 = u8, ma = cn, E6 = Bm;
const k6 = /* @__PURE__ */ new Set([4001, -31001]), $6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], I6 = ["result", "data", "payload", "response", "params"], j0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Gl = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), ei = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, fs = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, L6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Zm = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => L6(o, r)) === s
  );
}, Jm = (e) => e ? Zm(ei()).some(
  (t) => {
    var n;
    return t.id === e && (Gl(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Qm = () => {
  if (typeof window > "u")
    return;
  const e = ei(), t = Zm(e).filter(
    (n) => {
      var r;
      return Gl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = fs(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of $6) {
    const r = fs(e, n) ?? (e === window ? void 0 : fs(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, C6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = ei(), n = fs(t, e) ?? (t === window ? void 0 : fs(window, e)) ?? Tl(e);
  if (n)
    return n;
  if (Gl(e) || Jm(e))
    return Qm();
}, bc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, T6 = ["blockstack-session", "blockstack"], B6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of T6) {
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
B6();
const eb = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, Zn = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, M6 = (e) => {
  const t = Zn(e);
  if (!t)
    return null;
  const n = eb(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, N6 = (e) => {
  const t = Zn(e);
  if (!t)
    return null;
  const n = eb(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Fd = (e, t = "mainnet") => {
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
      return Fd(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Fd(r, t);
  }
  return t;
}, Lo = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, Ba = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return Ei(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const o = Ba(s, t + 1);
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
    const o = Ba(n[s], t + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && Ei(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ei(n.testnet) ? n.testnet.trim() : null;
}, R0 = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, tb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && k6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Go = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = Zn(n == null ? void 0 : n.message) ?? Zn(t.message) ?? Zn(t.error) ?? Zn(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, Ri = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw Go(t);
    if (t.status === "error")
      throw Go(t.result ?? t);
  }
  return e;
}, z0 = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return Ri(r);
  } catch (r) {
    throw Go(r);
  }
}, nb = () => Qm(), ih = () => {
  if (typeof window > "u")
    return;
  const e = ei();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = fs(e, t) ?? (e === window ? void 0 : fs(window, t));
    if (n)
      return n;
  }
}, G0 = () => {
  if (typeof window > "u")
    return;
  const e = ih();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = ei();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = fs(t, n) ?? (t === window ? void 0 : fs(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Pc = (e) => {
  var r, s;
  const t = Po();
  if (Gl(t) || Jm(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ei() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === nb();
}, Au = (e) => {
  const t = N6(e);
  if (!t)
    return null;
  try {
    const n = vi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, cl = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = Au(e), r = M6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Zn(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = cl(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const s = e;
  let o = null;
  for (const a of j0)
    if (Au(s[a])) {
      o = Zn(s[a]);
      break;
    }
  const i = Zn(s.txId) || Zn(s.txid) || Zn(s.transactionId);
  if (i)
    return {
      ...s,
      txId: i,
      txid: i,
      txRaw: o ?? Zn(s.txRaw) ?? void 0
    };
  for (const a of j0) {
    const c = Au(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Zn(s[a]) ?? void 0
      };
  }
  for (const a of I6) {
    const c = s[a], u = cl(c, t + 1);
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
}, Eu = (e) => {
  const t = cl(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, _6 = (e) => {
  const t = cl(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, P6 = (e) => ({
  ...e,
  fee: Lo(e.fee),
  nonce: Lo(e.nonce),
  sponsored: e.sponsored === !0
}), K0 = (e) => ({
  recipient: e.recipient,
  amount: Lo(e.amount) ?? "0",
  memo: e.memo,
  network: Fd(e.network),
  address: e.stxAddress,
  fee: Lo(e.fee),
  nonce: Lo(e.nonce),
  sponsored: e.sponsored ?? !1
}), rb = "WALLET_ADDRESS_MISMATCH", U6 = 45e3;
let ba = null;
const jd = (e) => {
  e && (ba = { address: e, at: Date.now() });
}, O6 = () => {
  ba = null;
}, H6 = () => ba && Date.now() - ba.at <= U6 ? ba.address : null, D6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, F6 = async (e) => {
  O6();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = Ri(await e.request("wallet_connect")), n = Ba(t);
  return jd(n), n;
}, j6 = async (e, t, n, r) => {
  try {
    return Ri(await e.request(t, n));
  } catch (s) {
    const o = Go(s);
    if (!D6(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: o.message
    });
    let i = null;
    try {
      i = await F6(e);
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
        { code: i ? rb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return Ri(await e.request(t, n));
    } catch (a) {
      throw Go(a);
    }
  }
};
let V0 = 3e4;
const R6 = (e, t) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${V0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, V0);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, z6 = async (e, t, n) => {
  const r = (c, u) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: rb }
      );
    return c;
  }, s = H6();
  if (s)
    return bc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  bc(n, "account-read");
  try {
    const c = Ri(
      await R6(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = Ba(c), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (c) {
    if (tb(c))
      throw Go(c);
    bc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (o)
    return jd(o), r(o, "wallet_getAccount");
  let i;
  bc(n, "account-reconnect");
  try {
    i = Ri(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Go(c);
  }
  const a = Ba(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return jd(a), r(a, "wallet_connect");
}, G6 = async (e, t) => {
  if (!Pc(e)) {
    const o = await z0(
      e,
      "stx_transferStx",
      K0(t)
    );
    return Eu(o);
  }
  const n = ih();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await z0(
      n,
      "stx_transferStx",
      K0(t)
    );
    return Eu(o);
  }
  const r = nb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await z6(r, t.stxAddress);
  const s = await j6(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Lo(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Lo(t.fee) } : {}
    },
    t.stxAddress
  );
  return Eu(s);
}, K6 = () => Po(), sb = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = Po(), t = e ? C6(e) : void 0;
  if (t)
    return t;
  const n = ei() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, X0 = (e, t) => {
  const n = sb(), r = P6({
    ...e,
    onFinish: (s) => {
      var o;
      (o = e.onFinish) == null || o.call(e, _6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return gc(r, t);
  if (Pc(n) && !ih()) {
    const s = G0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Po(),
        route: "legacy-transaction-request"
      }), gc(r, s);
  }
  return void G6(n, e).then((s) => {
    var o;
    (o = e.onFinish) == null || o.call(e, s);
  }).catch((s) => {
    var o, i;
    if (R0(s) && Pc(n)) {
      const a = G0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Po(),
          route: "legacy-transaction-request"
        }), gc(r, a);
        return;
      }
    }
    if (R0(s) && !Pc(n)) {
      gc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), tb(s)) {
      (o = e.onCancel) == null || o.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, V6 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), Y0 = (e) => Gm(e).replace(/^0x/, ""), q0 = "This wallet cannot sign messages. Try Xverse or Leather.", W0 = (e) => typeof (e == null ? void 0 : e.request) == "function", Z0 = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", X6 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, Y6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function q6(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: Y0(t.message),
    domain: Y0(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function W6(e, t) {
  const n = await R4({
    domain: t.domain,
    message: t.message,
    network: Hl(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? V6()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function ku(e) {
  var s, o;
  const t = K6() || "", n = /xverse/i.test(t);
  let r = sb();
  if (n && !Z0(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (Z0(r))
    try {
      return await W6(r, e);
    } catch (i) {
      if (n || !W0(r) || !Y6(i)) throw i;
    }
  if (!n && W0(r))
    try {
      return await q6(r, e);
    } catch (i) {
      throw X6(i) ? new Error(q0) : i;
    }
  throw new Error(q0);
}
const J0 = 1000000n, ls = 1000000n, ll = 50n, qt = 3000n, Mr = 300n, sa = 3000n, Z6 = 50000n, $u = 200n, Kl = 15000n, vn = (e) => e + ll;
function Er(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / J0}.${(n % J0).toString().padStart(6, "0")}`;
}
function Q0(e, t = Mr) {
  return e <= qt ? 0 : Number((e - qt) / vn(t));
}
function Iu(e, t = 0n) {
  const n = ls - e - t;
  return n > 0n ? n : 0n;
}
function J6(e, t = Mr) {
  return e > ls ? "over" : e < qt + vn(t) ? "empty" : e < Z6 ? "low" : "ok";
}
const Q6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", e5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", t5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function n5(e) {
  var n, r, s, o;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = t["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || t5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== Q6 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const ob = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Lu = 3, r5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", s5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", eg = 1, [Rd, ib] = ob.split("."), ur = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function zd(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function o5(e) {
  return ur(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function to(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function ab(e, t = []) {
  const n = await to(`/v2/contracts/call-read/${Rd}/${ib}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Rd, arguments: t.map((r) => "0x" + ur(Yt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return $r(pr(n.result));
}
async function i5() {
  const e = await to(`/v2/contracts/source/${Rd}/${ib}?proof=0`);
  if (typeof e.source != "string" || await o5(e.source) !== e5) throw Error("Deployed source does not match the tested helper.");
  if (n5(await ab("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function cb(e) {
  return e.startsWith("SP") && Ei(e) && !e.includes(".");
}
async function a5(e) {
  var r;
  if (!cb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await to(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await to(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function c5(e) {
  const t = await to(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function l5(e, t) {
  var s, o;
  const n = await ab("get-owner", [ma(e), ma(t)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !cb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function u5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: zd(e), signal: AbortSignal.timeout(15e3) });
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
async function d5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function f5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = vi(zd(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || xi(da(ol.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const o = t.postConditions.values[0];
    if (r.payloadType !== 2 || xi(r.contractAddress) + "." + r.contractName.content !== ob || r.functionName.content !== "play" || r.functionArgs.length !== 3 || ur(Yt(r.functionArgs[0])) !== ur(Yt(ma(e.core))) || ur(Yt(r.functionArgs[1])) !== ur(Yt(ma(e.song))) || ur(Yt(r.functionArgs[2])) !== ur(Yt(E6(zd(e.id)))) || e.amount !== "50" || t.postConditionMode !== Hi.Deny || t.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== Ia.Equal || o.principal.prefix !== 2 || xi(o.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || xi(r.contractAddress) + "." + r.contractName.content !== r5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || ur(Yt(r.functionArgs[0])) !== ur(Yt(ma(e.song))) || typeof e.liked != "boolean" || ur(Yt(r.functionArgs[1])) !== ur(Yt(A6(e.liked))) || e.amount !== "0" || t.postConditionMode !== Hi.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || $r(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const h5 = "xtrata.xyz/radio/listening-wallet", p5 = "Link a temporary listening wallet for pay-per-play; no spending permission", zr = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && Ei(e), g5 = (e) => ({
  domain: rr({ name: dt(h5), version: dt("1"), "chain-id": cn(1) }),
  message: rr({
    purpose: dt(p5),
    main: dt(e.main),
    listening: dt(e.listening),
    issued: cn(e.issued)
  })
}), lb = 100000n, y5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function w5(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !zr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= lb).sort(y5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const xc = 50;
function ul(e) {
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
async function m5(e, t, n = 4) {
  if (!zr(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${xc}&offset=${i}`, s = ul(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - xc);
    for (let i = 0; i < n; i++) {
      const a = o === 0 && s.total <= xc ? s : ul(await t(r(o)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = w5(a.transfers, e);
      if (c.ok && c.funder) return o > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (o === 0) return c;
      o = Math.max(0, o - xc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const os = 50, b5 = 6, x5 = 20, tg = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function ng(e, t) {
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
async function S5(e, t, n) {
  if (!zr(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = ul(await t(`/extended/v1/address/${e}/stx_inbound?limit=${os}&offset=0`));
    if (!s || s.total > b5 * os) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = os; i < s.total; i += os) {
      const a = ul(await t(`/extended/v1/address/${e}/stx_inbound?limit=${os}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${os}&offset=${u}`, a = ng(await t(i(0)), e);
      if (!a || a.total > x5 * os) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) o.set(u.txId, u);
      for (let u = os; u < a.total; u += os) {
        const h = ng(await t(i(u)), e);
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
function v5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(tg).map((d, m) => {
    const w = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: w, kind: "gift", to: r.payer, at: m } : zr(d.sender) && w >= lb ? { sender: d.sender, left: w, kind: "deposit", to: d.sender, at: m } : { sender: d.sender, left: w, kind: "dust", to: null, at: m };
  }), o = s.reduce((d, m) => d + m.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && zr(d.recipient) && d.amount > 0n).sort(tg), a = i.reduce((d, m) => d + m.amount, 0n), c = o - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (d, m) => {
    let w = m;
    for (const v of d) {
      if (w <= 0n) break;
      const A = v.left < w ? v.left : w;
      v.left -= A, w -= A;
    }
    return w;
  };
  for (const d of i) {
    const m = u(s.filter((w) => w.to === d.recipient), d.amount);
    m > 0n && u(s, m);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((d, m) => d + m.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const d of s) {
    if (d.left <= 0n) continue;
    const m = `${d.kind}:${d.to ?? ""}`, w = h.get(m);
    w ? (w.amount += d.left, w.newest = Math.max(w.newest, d.at)) : h.set(m, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((d, m) => d.newest - m.newest),
    hasTopUp: s.some((d) => d.kind === "deposit")
  };
}
function A5(e, t) {
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
function rg(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const Sc = 1500n, Uc = [100, 250, 500], E5 = (e, t) => BigInt(e) * vn(t), oa = ["prepared", "signed", "unknown", "pending"], k5 = 30 * 6e4, dl = 6e4, di = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, $5 = 3e3, fl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Cu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function I5(e) {
  let t = null, n = -1 / 0, r, s = null, o = null, i, a = -1 / 0, c = null, u = null, h = !1, d = !1, m = !1, w = null, v = !1, A = "", L = "", P = 0, O, E = null, M, U = [], V, ce = -1 / 0;
  const te = /* @__PURE__ */ new Set();
  let Y = null, b = !1, $ = 0, N = null, _ = null, q = !1, R = null, le = !1, ue = null, De = !1, I = !1, F = !1, de = !1, ye = !1, Ce = 0, Te = null, Ct = Promise.resolve();
  const He = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Mr.toString()), Be = (x) => !!o && !(o.features ?? []).includes(x), _e = (x, k) => `xtrata.ppp.v1.${x}:${k}`, en = "xtrata.ppp.v1.as-main", Kt = () => {
    if (e.main()) return;
    const x = e.store.get(en);
    return x && zr(x) ? x : void 0;
  }, Qe = () => e.main() ?? Kt(), Jt = (x = o == null ? void 0 : o.address) => {
    if (!x) return [];
    try {
      const k = JSON.parse(e.store.get(_e("entries", x)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, yt = (x) => {
    const k = [x, ...Jt(x.address).filter((K) => !(K.txid === x.txid && K.kind === x.kind))].slice(0, 200);
    e.store.set(_e("entries", x.address), JSON.stringify(k));
  }, G = (x = o == null ? void 0 : o.address) => !!x && e.store.get(_e("on", x)) !== "0", H = (x) => {
    o != null && o.address && e.store.set(_e("on", o.address), x ? "1" : "0");
  }, Q = () => Jt().filter((x) => oa.includes(x.status)), J = () => Fe() ? [...Q(), ...Jt(ze()).filter((x) => oa.includes(x.status))] : Q(), fe = () => lt(o == null ? void 0 : o.address), lt = (x) => {
    if (!x) return null;
    try {
      return JSON.parse(e.store.get(_e("deposit", x)) || "null");
    } catch {
      return null;
    }
  }, Ie = (x, k = o == null ? void 0 : o.address) => {
    k && e.store.set(_e("deposit", k), JSON.stringify(x));
  };
  let Ue = null;
  const ht = (x = dl) => {
    const k = e.now();
    Ue = { since: Ue && k < Ue.until ? Ue.since : k, until: Math.max((Ue == null ? void 0 : Ue.until) ?? 0, k + x) };
  }, Pe = () => !!Ue && e.now() < Ue.until && (i === void 0 || i < qt + vn(He())), Ae = () => !!fe() || Pe(), ze = () => Be("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), Fe = () => !!(o != null && o.address) && ze() !== o.address, ve = () => Fe() ? c && c.for === ze() ? c.value : void 0 : i, Tt = (x) => x !== void 0 && x < qt + $u, yn = () => Q().filter((x) => e.now() - x.created > k5 && te.has(x.txid)), En = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!Qe() || r === Qe() && !t.allowed), wt = () => En() && !(o != null && o.linked), tn = () => {
    const x = Qe();
    return !wt() && !!x && !!(o != null && o.linked) && o.linked !== x;
  }, Bn = (x) => _e("return-to", x), sr = (x = o == null ? void 0 : o.address) => {
    if (!x) return;
    const k = e.store.get(Bn(x));
    return k && zr(k) && k !== x ? k : void 0;
  }, Nr = (x = o == null ? void 0 : o.address) => Y && Y.for === x ? Y.res : null;
  function or() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const x = sr();
    if (x) return { to: x, kind: "chosen" };
    const k = Nr();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const Rn = (x) => _e("gift", x);
  function Ut() {
    const x = o == null ? void 0 : o.address;
    if (!x) return null;
    if ((R == null ? void 0 : R.for) === x) return R.info;
    try {
      const k = JSON.parse(e.store.get(Rn(x)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  const nn = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let ut = null, Qt = null, Mn = !1;
  const Jr = (x) => _e("award-claim", x), Nn = (x) => _e("award-send", x), y = (x) => {
    try {
      const k = JSON.parse(e.store.get(Nn(x)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  }, C = (x) => {
    try {
      const k = JSON.parse(e.store.get(Jr(x)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  };
  async function j(x = !1) {
    const k = nn();
    if (!k || !e.awardStatus || Mn) return;
    const K = (ut == null ? void 0 : ut.for) === k ? ut : null, ee = K == null ? void 0 : K.view.state, l = K ? ee === "off" || ee === "not-a-player" ? 30 * 6e4 : C(k) || y(k) ? 2e4 : ee === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(K && !x && e.now() - K.at < l)) {
      Mn = !0;
      try {
        const p = await e.awardStatus(k);
        if (ut = { for: k, view: p, at: e.now() }, p.state === "claimed" && e.store.set(Jr(k), ""), p.state === "claimed" && p.holds === !1 && e.store.set(Nn(k), ""), p.state === "ready" && e.awardName && (Qt == null ? void 0 : Qt.for) !== k)
          try {
            Qt = { for: k, name: await e.awardName(k), at: e.now() };
          } catch {
            Qt = { for: k, name: void 0, at: e.now() };
          }
      } catch {
        ut = { for: k, view: K && K.view.state !== "off" && K.view.state !== "not-a-player" ? { ...K.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        Mn = !1;
      }
    }
  }
  function z() {
    const x = nn();
    if (!x || (ut == null ? void 0 : ut.for) !== x) return null;
    const k = ut.view;
    if (k.state === "off" || k.state === "not-a-player") return null;
    const K = k.state === "claimed" ? null : C(x), ee = k.state === "claimed" && k.holds !== !1 ? y(x) : null;
    return { ...k, ...(Qt == null ? void 0 : Qt.for) === x ? { name: Qt.name } : {}, ...K ? { claimTx: K.txid } : {}, ...ee ? { sendTx: ee.txid } : {} };
  }
  async function ae() {
    var l;
    const x = o == null ? void 0 : o.address;
    if (!x || !e.giftInfo || !((l = t == null ? void 0 : t.gifts) != null && l.enabled) || le) return;
    const k = (R == null ? void 0 : R.for) === x ? R : null, K = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && e.now() - k.at < K) return;
    le = !0;
    const ee = Ut();
    try {
      const p = await e.giftInfo(x);
      R = { for: x, info: p, ok: !0, at: e.now() }, e.store.set(Rn(x), JSON.stringify(p));
    } catch {
      R = { for: x, info: ee, ok: !1, at: e.now() };
    } finally {
      le = !1;
    }
  }
  const re = () => Jt().reduce((x, k) => oa.includes(k.status) ? x + BigInt(k.amount || "0") + BigInt(k.fee || "0") : x, 0n);
  function Le() {
    if (i === void 0) return 0;
    const x = i - re() - BigInt($t.length) * vn(He());
    return x > 0n ? Q0(x, He()) : 0;
  }
  const Se = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Me = "EMPTY — ADD STX TO PLAY";
  function mt() {
    if (!(t != null && t.here)) return null;
    const x = (k, K) => ({ reason: k, text: K });
    switch (gt()) {
      case "connect":
      case "wrong-wallet":
        return x("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return x("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return x("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return x("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return x("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return x("locked", "UNLOCK TO LISTEN");
      case "link":
        return x("link", "FINISH SETUP TO LISTEN");
      case "over":
        return x("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Ae() ? x("arriving", "YOUR PLAYS ARE ARRIVING") : x("out", Fe() ? Se : Me);
      case "ready":
        return !G() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= e.now() ? x("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : F ? Le() < 1 ? x("out", Fe() ? Se : Me) : null : x("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const be = () => {
    var x;
    return !!(o != null && o.address) && Fe() && !!((x = Ut()) != null && x.player);
  };
  function et() {
    return be() ? { locked: !0, known: !0 } : null;
  }
  const st = 3 * 6e4, tt = () => !!Ut() && !!e.history && !(o != null && o.linked);
  async function Ft() {
    const x = o.address, k = Ut(), { balance: K, nonce: ee } = await e.chain.account(x), l = await e.history(x, !0);
    if (!l.ok) return null;
    const p = v5({ self: x, balance: K, inbound: l.inbound, outgoing: l.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!p.ok) return null;
    const g = A5(p.parts, sa);
    return { balance: K, nonce: ee, parts: p.parts, steps: g.steps, tooSmall: g.tooSmall.length };
  }
  const Bt = () => De ? { state: "unavailable" } : !ue || e.now() - ue.at > st || i !== void 0 && i !== ue.balance ? { state: "none" } : ue.plan;
  function gt() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const x = Qe();
    if (!wt()) {
      if (!x) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : tn() ? "wrong-wallet" : o.state === "known" ? "locked" : !wt() && o.linked !== x ? "link" : i === void 0 ? "loading" : i > ls && !o.backedUp ? "over" : i < qt + vn(He()) ? "fund" : "ready" : "loading";
  }
  const kt = () => {
    var x, k, K, ee, l;
    return {
      step: gt(),
      busy: u,
      message: A,
      error: L,
      notice: _r(),
      gate: t,
      main: Qe(),
      mainConnected: !!e.main(),
      standIn: Kt(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: z(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.phrase),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((p) => p === "over" && (o != null && o.backedUp) ? "ok" : p)(J6(i, He())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > ls && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : Q0(i, He()),
      allowance: i === void 0 ? ls : Iu(i, BigInt(((x = fe()) == null ? void 0 : x.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: G(),
      entries: Jt(),
      depositTxid: ((k = fe()) == null ? void 0 : k.txid) ?? O,
      depositPending: Ae(),
      arrival: Ae() ? { since: ((K = fe()) == null ? void 0 : K.at) ?? (Ue == null ? void 0 : Ue.since) ?? e.now(), graceMs: dl } : null,
      walletOutdated: Be("like"),
      canAnother: !!o && !Be("another"),
      canForget: !!o && !Be("forget"),
      passkeyName: o == null ? void 0 : o.passkeyName,
      hadGift: o != null && o.address && (R == null ? void 0 : R.for) === o.address && R.ok ? !!R.info : null,
      linkedListening: V && V === Qe() ? U.map((p) => p.listening) : [],
      serverLinked: !!E && M === `${Qe()}:${o == null ? void 0 : o.address}`,
      stuck: yn().length,
      armed: de,
      queued: $t.length,
      solo: wt(),
      returnTo: (ee = or()) == null ? void 0 : ee.to,
      returnToKind: (l = or()) == null ? void 0 : l.kind,
      funderState: (() => {
        const p = Nr();
        return p ? p.ok ? p.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const p = Nr();
        return !!p && p.ok && p.distinct > 1;
      })(),
      walletCannotSolo: wt() && Be("standalone"),
      walletCannotMulti: Be("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((p) => p !== Qe() && p !== (o == null ? void 0 : o.linked)),
      creditedTo: wt() && (o != null && o.address) && (N == null ? void 0 : N.for) === o.address && N.main ? N.main : void 0,
      createdHere: !!(o != null && o.address) && e.store.get(_e("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (_ == null ? void 0 : _.for) === o.address && _.unused,
      gift: (() => {
        const p = Ut();
        return p ? { player: p.player, from: p.from, source: p.source, amount: p.amount, ...p.drop !== void 0 ? { drop: p.drop } : {} } : null;
      })(),
      giftPlays: Ut() ? Le() : 0,
      playCost: vn(He()),
      giftStop: mt(),
      albumLock: et(),
      returnPlan: Bt(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: Be("slots"),
      likeFunds: (() => {
        var f;
        const p = ze();
        if (!p || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const g = ve();
        return { address: p, balance: g, low: Tt(g), album: Fe(), pending: !!lt(p), txid: (f = lt(p)) == null ? void 0 : f.txid, main: Qe() };
      })()
    };
  }, _r = () => P ? P < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Ge = (x, k = "") => {
    A = x, L = k, e.changed();
  };
  async function Vt(x, k) {
    if (!u) {
      u = x, L = "", e.changed();
      try {
        await k();
      } catch (K) {
        const ee = K instanceof Error ? K.message : String(K);
        L = /Cancelled in the listening wallet/.test(ee) ? "" : ee, L || (A = "Not now. Nothing was signed.", ye = !0);
      } finally {
        u = null, await Gn(!0);
      }
    }
  }
  const _n = () => !!(t != null && t.enabled) && t.here && (wt() || !!Qe() && t.allowed), Pn = () => _n() && !tn(), zn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", wn = () => {
    if (tn()) throw new Error(zn());
  };
  async function kn() {
    if (!_n()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const ln = (x) => {
    const k = Qe();
    return x.request("listening.status", k ? { main: k } : void 0);
  };
  async function ys(x = !1) {
    o != null && o.address && (!x && e.now() - a < 3e4 || (i = await e.chain.balance(o.address), a = e.now(), await gr(x)));
  }
  async function gr(x = !1) {
    const k = ze();
    if (!(!Fe() || !k || (o == null ? void 0 : o.state) !== "unlocked") && !(!x && (c == null ? void 0 : c.for) === k && e.now() - c.at < 3e4))
      try {
        c = { for: k, value: await e.chain.balance(k), at: e.now() };
      } catch {
      }
  }
  async function ti(x) {
    if ((V !== x || e.now() - ce >= 6e4) && (U = await e.links(x), V = x, ce = e.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === x) return;
    const k = `${x}:${o.address}`;
    M === k && E || (E = U.find((K) => K.listening === o.address) ?? null, M = k);
  }
  async function ni() {
    const x = o == null ? void 0 : o.address;
    if (!wt() || !x || o != null && o.linked || !e.funder || b || !i || i <= 0n) return;
    const k = Nr(x);
    if (k != null && k.ok && k.funder) return;
    const K = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, $ - 1), 30 * 6e4);
    if (!(Y && Y.for === x && e.now() - Y.at < K)) {
      b = !0;
      try {
        Y = { for: x, res: await e.funder(x), at: e.now() };
      } catch {
        Y = { for: x, res: { ok: !1 }, at: e.now() };
      } finally {
        b = !1;
      }
      $ = Y.res.ok ? 0 : $ + 1;
    }
  }
  async function rn() {
    const x = o == null ? void 0 : o.address;
    if (!(!wt() || !x || o != null && o.linked || !e.mainOf || q) && !(N && N.for === x && (N.ok || e.now() - N.at < 6e4))) {
      q = !0;
      try {
        N = { for: x, main: await e.mainOf(x), ok: !0, at: e.now() };
      } catch {
        N = { for: x, main: null, ok: !1, at: e.now() };
      } finally {
        q = !1;
      }
    }
  }
  async function oo() {
    const x = o == null ? void 0 : o.address;
    if (!(!x || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (_ == null ? void 0 : _.for) === x) && e.store.get(_e("created", x)) !== "1")
      try {
        _ = { for: x, unused: await e.chain.confirmedNonce(x) === 0n };
      } catch {
      }
  }
  async function io() {
    var l;
    const x = o == null ? void 0 : o.address;
    if (!x) return !1;
    let k, K = !1;
    const ee = /* @__PURE__ */ new Map();
    for (const p of J())
      try {
        const g = await e.chain.transaction(p.txid);
        if (!g) {
          if (te.add(p.txid), e.now() - p.created > 15 * 6e4 && !ee.has(p.address) && ee.set(p.address, await e.chain.confirmedNonce(p.address)), k = ee.get(p.address), k !== void 0 && k > BigInt(p.nonce)) {
            yt({ ...p, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((p.status === "unknown" || p.status === "signed") && p.raw)
            try {
              await e.chain.broadcast(p.raw, p.txid), yt({ ...p, status: "pending" });
            } catch (T) {
              di(T) && yt({ ...p, status: "failed", note: T.message, raw: void 0 });
            }
          continue;
        }
        te.delete(p.txid);
        const f = String(g.tx_status);
        if (f === "success" && g.canonical !== !1 && g.is_unanchored === !1) {
          if (yt({ ...p, status: "confirmed", confirmedAt: e.now(), actualFee: String(g.fee_rate ?? p.fee), raw: void 0 }), K = !0, p.kind === "like" && (v = !0, p.status !== "confirmed" && typeof p.liked == "boolean"))
            try {
              (l = e.likeConfirmed) == null || l.call(e, p.song, p.liked);
            } catch {
            }
        } else f.startsWith("abort_") || f.startsWith("dropped_") ? yt({ ...p, status: "failed", note: f, raw: void 0 }) : p.status !== "pending" && yt({ ...p, status: "pending" });
      } catch {
      }
    for (const p of Fe() ? [x, ze()] : [x]) {
      const g = lt(p);
      if (g)
        try {
          const f = await e.chain.transaction(g.txid), T = String((f == null ? void 0 : f.tx_status) ?? "");
          (T === "success" && f.is_unanchored === !1 || T.startsWith("abort_") || T.startsWith("dropped_") || !f && e.now() - g.at > 2 * 36e5) && (Ie(null, p), T === "success" && ht(2e4), a = -1 / 0, c = null, /on its way/i.test(A) && (A = ""));
        } catch {
        }
    }
    return K;
  }
  async function Gn(x = !1) {
    var k;
    try {
      const K = Qe();
      if ((x || !t || r !== K || e.now() - n > 3e5) && (t = await e.config(K), n = e.now(), r = K), !t.enabled || !t.here || !wt() && (!K || !t.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), de && co(), e.changed();
        return;
      }
      await kn(), o = await ln(s), tn() && o.state === "unlocked" && (wr(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await ln(s)), K && t.allowed && await ti(K), await ys(x), await ni(), await rn(), await oo(), await ae(), await j(), await io() && await ys(!0), await gr(), await xs(), P = 0;
    } catch {
      P++;
    }
    if (gt() === "locked" ? ao() : de && co(), v) {
      v = !1;
      try {
        (k = e.likesChanged) == null || k.call(e);
      } catch {
      }
    }
    e.changed(), $t.length && !Ss && vs();
  }
  async function Wi(x) {
    const k = o == null ? void 0 : o.root;
    if (!k || o != null && o.slot || !(o != null && o.address) || Be("slots")) return;
    const K = Number(e.store.get(_e("slot", k)));
    if (!(!Number.isSafeInteger(K) || K < 1))
      try {
        const { balance: ee } = await e.chain.account(o.address);
        if (ee >= qt + vn(He())) return;
        await x.request("listening.openSlot", { slot: K }), o = await ln(x), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function ws(x, k) {
    var p;
    wn();
    const K = !(o != null && o.address) || G(o.address), ee = o != null && o.linked ? (p = e.nameOf) == null ? void 0 : p.call(e, o.linked) : void 0;
    await x.request("listening.unlock", { mode: "unlock", terms: K ? lo() : void 0, anyPasskey: k, ...Qe() ? { main: Qe() } : {}, ...ee ? { label: ee } : {} }), o = await ln(x), K && (G(o.address) ? await ir() : await x.request("listening.stop")), await Wi(x), Ge(K ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const l = w;
    w = null, l && e.now() - l.at < 12e4 && setTimeout(() => void Gn(!0).then(() => Un(l)), 0);
  }
  function ao() {
    de || u || ye || Ce >= 3 || !s || !(o != null && o.address) || (de = !0, Ct = (async () => {
      try {
        await ws(s, !1), Ce = 0;
      } catch (x) {
        const k = x instanceof Error ? x.message : String(x);
        /Cancelled in the listening wallet/.test(k) ? Te || (ye = !0, Ge("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Ce++, L = k);
      } finally {
        de = !1;
        const x = Te;
        Te = null, x ? await x() : await Gn(!0);
      }
    })());
  }
  async function co(x) {
    de && (Te = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Ct), x && await x(), e.changed();
  }
  const lo = () => ({
    fee: He().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: ls.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function ir() {
    if (!(o != null && o.address)) return !1;
    if (F || (F = await e.tabLock(o.address)), !F)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function uo(x, k) {
    const K = o.address, { balance: ee, nonce: l } = k ?? await e.chain.account(K);
    i = ee;
    const p = await s.request("listening.prepareReturn", {
      mode: x.mode,
      balance: ee.toString(),
      nonce: l.toString(),
      fee: sa.toString(),
      ...x.amount !== void 0 ? { amount: x.amount.toString() } : {},
      ...x.linked ? {} : { destination: x.to }
    });
    if (p.recipient !== x.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const g = x.mode === "amount" ? x.amount : x.mode === "all" ? ee - sa : ee - ls - sa, f = vi(p.raw);
    if ($r(f.payload.recipient).value !== x.to || String(f.payload.amount) !== p.amount || g !== void 0 && p.amount !== g.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const T = {
      id: Cu(),
      address: K,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: p.recipient,
      amount: p.amount,
      fee: p.fee,
      nonce: l.toString(),
      created: e.now(),
      status: "signed",
      raw: p.raw,
      txid: p.txid
    };
    e.validate(T), yt(T);
    try {
      await e.chain.broadcast(p.raw, p.txid), yt({ ...T, status: "pending" });
    } catch (X) {
      throw yt({ ...T, status: "unknown", note: X.message }), X;
    }
    return p;
  }
  const fo = Kl, ms = sa;
  async function ri(x, k, K) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (Be("slots") || Be("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const ee = o.slot ?? 0;
    if (x === k || ![x, k].includes(ee) || ![x, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const l = o.root ?? o.address, p = x === 0 ? l : o.address, g = k === 0 ? l : o.address, { balance: f, nonce: T } = await e.chain.account(p);
    if (f < K + ms + qt) throw new Error(x === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const X = await s.request("listening.signMove", { from: x, to: k, amount: K.toString(), fee: ms.toString(), nonce: T.toString(), balance: f.toString() }), ne = vi(X.raw);
    if (X.from !== p || X.to !== g || X.amount !== K.toString() || $r(ne.payload.recipient).value !== g || String(ne.payload.amount) !== K.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const se = {
      id: Cu(),
      address: p,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: g,
      amount: X.amount,
      fee: X.fee,
      nonce: T.toString(),
      created: e.now(),
      status: "signed",
      raw: X.raw,
      txid: X.txid
    };
    e.validate(se), yt(se);
    try {
      await e.chain.broadcast(X.raw, X.txid), yt({ ...se, status: "pending" });
    } catch (Ee) {
      throw yt({ ...se, status: "unknown", note: Ee.message }), Ee;
    }
    return Ie({ txid: X.txid, amount: X.amount, at: e.now() }, g), g === l && l !== o.address ? c = null : a = -1 / 0, X;
  }
  let Qr = !1;
  const ho = /* @__PURE__ */ new Map(), bs = (x) => _e("float", x);
  async function xs() {
    if (Qr || (o == null ? void 0 : o.state) !== "unlocked" || !Fe() || Be("move") || Be("rootLike") || !o.address) return;
    const x = o.address;
    if (e.store.get(bs(x)) === "1") return;
    const k = Ut();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const K = ve();
    if (K === void 0 || i === void 0) return;
    if (!Tt(K)) {
      e.store.set(bs(x), "1");
      return;
    }
    if (lt(ze()) || po() || J().length || i < fo * 4n + qt + ms) return;
    const ee = ho.get(x);
    if (!(ee && (ee.n >= 3 || e.now() - ee.at < 5 * 6e4))) {
      Qr = !0, ho.set(x, { n: ((ee == null ? void 0 : ee.n) ?? 0) + 1, at: e.now() });
      try {
        await ri(o.slot ?? 0, 0, fo), e.store.set(bs(x), "1");
      } catch (l) {
        console.warn("[radio] likes float not sent yet", l);
      } finally {
        Qr = !1;
      }
    }
  }
  async function Zi(x) {
    if (Q().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Be("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await Ft().catch(() => null);
    if (!k)
      throw ue = null, De = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    De = !1, i = k.balance;
    const K = { balance: k.balance, nonce: k.nonce };
    if (x === "excess") {
      const f = rg(k.parts) ?? sr();
      if (!f) throw new Error("Choose where to send the excess first.");
      await uo({ mode: "excess", to: f, linked: !1 }, K), ue = null, Ge("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const ee = k.steps;
    if (!ee.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ue && ue.balance === k.balance && e.now() - ue.at <= st && ue.steps.length === ee.length && ue.steps.every((f, T) => f.to === ee[T].to && f.mode === ee[T].mode && f.send === ee[T].send))) {
      ue = {
        at: e.now(),
        balance: k.balance,
        steps: ee,
        parts: k.parts,
        plan: { state: "ready", steps: ee.map((f) => ({ to: f.to, kind: f.kind, send: f.send.toString() })), kept: k.tooSmall, excess: rg(k.parts) }
      }, Ge(ee.length > 1 ? `This goes back in ${ee.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const p = ee[0], g = p.to ?? sr();
    if (!g) throw new Error("Choose where to send the rest first.");
    if (p.mode === "amount" && Be("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await uo({ mode: p.mode, to: g, linked: !1, ...p.mode === "amount" ? { amount: p.send } : {} }, K), ue = null, ee.length === 1 ? (H(!1), Ge("Returned ✓ Paying is off.")) : Ge(`Returned ✓ ${ee.length - 1} more ${ee.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function nt() {
    if (!(o != null && o.unproven)) return;
    const x = await kn();
    await x.request("listening.prove"), o = await ln(x);
  }
  const es = {
    forceRefresh: () => Gn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (x) => {
      if (!e.main() && !(x !== null && !zr(x))) {
        if (x === Kt()) return Gn(!0);
        e.store.set(en, x ?? ""), L = "", A = "", i = void 0, a = -1 / 0, c = null, await Gn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => Vt("Check the listening wallet…", async () => {
      const x = await kn();
      if (Be("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((o == null ? void 0 : o.state) !== "unlocked" || (o.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (Q().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      wr(), await x.request("listening.forget"), i = void 0, o = await ln(x), H(!1), Ge("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (x) => Vt("Waiting for your passkey…", async () => {
      const k = await kn(), K = !!(x != null && x.another) && !e.main() && !Be("another");
      K && (o == null ? void 0 : o.state) === "unlocked" && await k.request("listening.lock"), await k.request("listening.unlock", { mode: "create", terms: lo(), ...e.main() ? { main: e.main() } : {}, ...x != null && x.quick && !e.main() ? { quick: !0 } : {}, ...K ? { another: !0 } : {} }), o = await ln(k), o.address && e.store.set(_e("created", o.address), "1"), H(!0), Ge(wt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await ir();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (x) => {
      x ? ht() : Ue = null, e.changed();
    },
    giftSent: (x, k) => {
      !(o != null && o.address) || fe() || (Ie({ txid: x, amount: k.toString(), at: e.now() }), a = -1 / 0, R = null, Ge("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (x) => {
      if (wn(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Be("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await kn()).request("listening.bindSlot", { slot: x, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (x, k, K, ee) => {
      Ie({ txid: K, amount: ee.toString(), at: e.now() }, k), R = null, await es.openAlbum(x), Ge("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (x) => Vt("Opening…", async () => {
      if (wn(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Be("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || m) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === x) return;
      wr(), await s.request("listening.openSlot", { slot: x }), o = await ln(s), i = void 0, a = -1 / 0, ue = null, De = !1;
      const k = o.root;
      k && x > 0 && e.store.set(_e("slot", k), String(x)), Ge(x === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (x = !1) => {
      const k = () => Vt("Waiting for your passkey…", async () => ws(await kn(), x));
      return de ? x ? Be("cancel") ? (Ge("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : co(async () => {
        (gt() === "locked" || gt() === "intro") && await k();
      }) : Ct : k();
    },
    link: () => Vt("Sign in your wallet…", async () => {
      wn();
      const x = e.main();
      if (!x || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const k = (await e.links(x)).find((K) => K.listening === o.address);
      if (k)
        await s.request("listening.link", { main: x, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const K = { main: x, listening: o.address, issued: e.now() }, ee = await e.signWithMain(x, g5(K)), l = await s.request("listening.link", { main: x, issued: K.issued, mainSignature: ee });
        await e.saveLink({ ...K, mainSignature: ee, listeningSignature: l.listeningSignature }), ce = -1 / 0;
      }
      Ge("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await Vt("One more passkey check…", nt), !(o != null && o.unproven)) : !0,
    deposit: () => Vt("Approve the deposit in your wallet…", async () => {
      wn(), await nt();
      const x = e.main();
      if (!x || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if (fe()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Pe()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await ys(!0);
      const k = Iu(i ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      O = await e.deposit(x, o.address, k), O && Ie({ txid: O, amount: k.toString(), at: e.now() }), Ge("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Vt("Approve the top-up in your wallet…", async () => {
      wn(), await nt();
      const x = e.main(), k = ze();
      if (!x || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (lt(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const K = await e.chain.balance(k);
      Fe() ? c = { for: k, value: K, at: e.now() } : (i = K, a = e.now());
      const ee = Iu(K);
      if (ee <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const l = await e.deposit(x, k, ee);
      l && Ie({ txid: l, amount: ee.toString(), at: e.now() }, k), Ge("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (x) => Vt("Adding plays…", async () => {
      if (wn(), !Fe()) throw new Error("Open the album you want to add plays to first.");
      if (!Uc.includes(x)) throw new Error("Choose one of the amounts offered.");
      const k = E5(x, He());
      if (h || d || m) throw new Error("Still sending a payment. Try again in a moment.");
      if (J().length || fe()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await ri(0, o.slot ?? 0, k), Ge("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Vt("Confirm in the listening wallet…", async () => {
      if (!Pn()) throw new Error("Connect your wallet first.");
      await ir(), await s.request("listening.approveSession", lo()), H(!0), Ge("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Vt("Clearing…", async () => {
      for (const x of yn())
        await e.chain.transaction(x.txid) || yt({ ...x, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Ge("Cleared ✓");
    }),
    switchOff: () => Vt("Switching off…", async () => {
      wr(), await (s == null ? void 0 : s.request("listening.stop")), H(!1), Ge("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Vt("Showing your backup words in the box…", async () => {
      if (!(o != null && o.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const x = await kn();
      await x.request("listening.backup"), o = await ln(x), Ge("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (x, k) => {
      if ((o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Be("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await kn()).request("listening.signShelf", { action: x, ...k ? { release: k } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      Qt = null, await j(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (x) => Vt("Confirm in the listening wallet…", async () => {
      var T, X, ne, se;
      const k = nn();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Be("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (C(k)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || m || J().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await ir();
      const K = await e.awardNote(k, x), { balance: ee, nonce: l } = await e.chain.account(k);
      if (ee < Sc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const g = await (await kn()).request("listening.signAward", {
        cls: K.cls,
        number: K.number,
        plays: K.plays,
        record: K.record,
        signature: K.signature,
        fee: Sc.toString(),
        nonce: l.toString(),
        balance: ee.toString()
      }), f = vi(g.raw);
      if (g.hero !== k || g.number !== K.number || ((X = (T = f.payload) == null ? void 0 : T.functionName) == null ? void 0 : X.content) !== "claim" || ((se = (ne = f.payload) == null ? void 0 : ne.contractName) == null ? void 0 : se.content) !== s5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(g.raw, g.txid), e.store.set(Jr(k), JSON.stringify({ txid: g.txid, at: e.now() })), a = -1 / 0, ut && (ut = { ...ut, at: -1 / 0 }), Ge("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (x) => Vt("Confirm in the listening wallet…", async () => {
      var X, ne, se;
      const k = nn(), K = z();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if ((K == null ? void 0 : K.state) !== "claimed" || K.inscription === void 0) throw new Error("There is no record to send yet.");
      if (K.holds === !1) throw new Error("This record has already been sent.");
      if (K.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (y(k)) throw new Error("Your record is already on its way.");
      const ee = x.trim();
      if (!zr(ee)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (ee === k) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Be("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || m || J().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await ir();
      const { balance: l, nonce: p } = await e.chain.account(k);
      if (l < Sc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const f = await (await kn()).request("listening.signSendRecord", { inscription: K.inscription, recipient: ee, fee: Sc.toString(), nonce: p.toString(), balance: l.toString() }), T = vi(f.raw);
      if (f.from !== k || f.recipient !== ee || f.inscription !== K.inscription || ((ne = (X = T.payload) == null ? void 0 : X.functionName) == null ? void 0 : ne.content) !== "transfer" || $r((se = T.payload.functionArgs) == null ? void 0 : se[2]).value !== ee)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(f.raw, f.txid), e.store.set(Nn(k), JSON.stringify({ txid: f.txid, at: e.now() })), a = -1 / 0, ut && (ut = { ...ut, at: -1 / 0 }), Ge("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Vt("Locking…", async () => {
      wr(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, Ge("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (x) => {
      const k = String(x ?? "").trim();
      if (!(o != null && o.address)) return Ge("", "Unlock the listening wallet first.");
      if (!zr(k)) return Ge("", "Enter a standard mainnet address (it starts with SP).");
      if (k === o.address) return Ge("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(Bn(o.address), k), Ge("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && e.store.set(Bn(o.address), ""), e.changed();
    },
    returnFunds: (x) => Vt("Check the return in the listening wallet…", async () => {
      if (!Pn()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (tt()) return Zi(x);
      const k = or();
      if (!k) throw new Error(wt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Be("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Q().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await uo({ mode: x, to: k.to, linked: k.kind === "linked" }), x === "all" && H(!1), Ge(x === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, $t = [], si = 10, yr = 30 * 6e4;
  let Ss = !1;
  const po = () => h || !!u || d || m, wr = () => {
    $t.length && ($t.length = 0, e.changed());
  };
  async function ar(x) {
    if (!$t.some((k) => k.id === x.id) && !Jt().some((k) => k.id === x.id) && ($t.push({ ...x, at: e.now() }), $t.length > si && $t.shift()), po() || Q().length) {
      const k = $t.length;
      A = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await vs();
  }
  async function vs() {
    if (!Ss) {
      Ss = !0;
      try {
        for (; $t.length; ) {
          for (; $t.length && e.now() - $t[0].at > yr; ) $t.shift();
          if (!$t.length || po() || await ts($t[0]) === "wait") return;
          $t.shift();
        }
      } finally {
        Ss = !1, e.changed();
      }
    }
  }
  async function ts(x) {
    var k;
    h = !0;
    try {
      await Gn();
      const K = gt();
      if (K === "loading") return "wait";
      if (K !== "ready" || !G() || !(o != null && o.session) || o.session.playsLeft < 1 || !F) return "done";
      if (Q().length) return "wait";
      I || (await e.chain.verify(), I = !0);
      const ee = o.address, { balance: l, nonce: p } = await e.chain.account(ee);
      i = l, a = e.now();
      const g = await e.chain.owner(Lu, x.song);
      if (g === ee || g === Qe()) return "done";
      const f = await s.request("listening.signPlay", {
        core: Lu,
        song: x.song,
        receipt: x.id,
        fee: He().toString(),
        nonce: p.toString(),
        balance: l.toString()
      }), T = {
        id: x.id,
        address: ee,
        kind: "play",
        core: Lu,
        song: x.song,
        recipient: g,
        amount: "50",
        fee: He().toString(),
        nonce: p.toString(),
        created: e.now(),
        status: "signed",
        raw: f.raw,
        txid: f.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      e.validate(T), yt(T);
      const X = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`;
      try {
        await e.chain.broadcast(f.raw, f.txid), yt({ ...T, status: "pending" }), A = `♪ Paid ${X}`, L = "";
      } catch (ne) {
        yt({ ...T, status: di(ne) ? "failed" : "unknown", note: ne.message, ...di(ne) ? { raw: void 0 } : {} }), L = ne.message;
      }
      return o = await ln(s), "done";
    } catch (K) {
      const ee = K instanceof Error ? K.message : "payment unavailable";
      return (k = Ut()) != null && k.player ? (A = "Payment is taking a moment: " + ee, "wait") : (A = "This song played free: " + ee, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function go(x) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(gt()) || Be("like") ? !1 : (Un(x), !0);
  }
  async function Un(x) {
    const k = x.title ? `“${x.title}”` : `song #${x.song}`, K = (S) => {
      var B;
      L = S, A = "";
      try {
        (B = e.likeFailed) == null || B.call(e, x.song);
      } catch {
      }
      e.changed();
    }, ee = Fe(), l = gt(), p = Qe(), g = ee && (l === "fund" || l === "over") ? "ready" : l, f = wt() ? ze() : p;
    if (g === "locked") {
      w = { ...x, at: e.now() }, Ge(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (g === "wrong-wallet") return K(zn());
    if (g === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (wt() && Be("standalone")) return K("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (g === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (g === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (ee) {
      await gr(!0);
      const S = ve();
      if (Tt(S))
        return e.changed(), K(fl);
    }
    if (g !== "ready" || !f) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!F) return K("Pay-per-play is running in another tab. Like from that tab.");
    const T = Jt(ze()).find((S) => S.kind === "like" && S.song === x.song);
    if (T && oa.includes(T.status))
      return K(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (d) return K("One like at a time: your last one is still being sent.");
    if ((T == null ? void 0 : T.status) === "confirmed" && e.now() - (T.confirmedAt ?? 0) < $5)
      return K(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let X;
    m = !0;
    try {
      X = e.likeState ? (await e.likeState(f, x.song)).by : x.likedBy ?? [];
    } catch {
      X = x.likedBy;
    } finally {
      m = !1;
    }
    if (!X) return K(`Could not check ${k} right now. Try the heart again.`);
    const ne = ze(), Ee = ((T == null ? void 0 : T.status) === "confirmed" && typeof T.liked == "boolean" && e.now() - (T.confirmedAt ?? T.created) < 5 * 6e4 ? T.liked : void 0) ?? X.includes(ne);
    if (!Ee && X.some((S) => S !== ne)) return K(wt() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${X.includes(p) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await oi({ song: x.song, liked: !Ee, title: x.title, artist: x.artist });
  }
  async function oi(x) {
    var ee, l, p;
    if (d) {
      Ge("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const k = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`, K = e.wait ?? ((g) => new Promise((f) => setTimeout(f, g)));
    try {
      Ge(`${x.liked ? "Liking" : "Unliking"} ${k}…`);
      const g = e.now() + 12e4;
      for (; h || (Fe() ? Jt(ze()).some((Ee) => oa.includes(Ee.status)) : Q().length); ) {
        if (e.now() > g) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await Gn(!0);
      }
      if (!Fe() && gt() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const f = ze(), { balance: T, nonce: X } = await e.chain.account(f);
      if (Fe() ? c = { for: f, value: T, at: e.now() } : (i = T, a = e.now()), Tt(T)) throw new Error(fl);
      const ne = await s.request("listening.signLike", {
        song: x.song,
        liked: x.liked,
        fee: $u.toString(),
        nonce: X.toString(),
        balance: T.toString()
      }), se = {
        id: Cu(),
        address: f,
        kind: "like",
        core: 0,
        song: x.song,
        liked: x.liked,
        recipient: "",
        amount: "0",
        fee: $u.toString(),
        nonce: X.toString(),
        created: e.now(),
        status: "signed",
        raw: ne.raw,
        txid: ne.txid,
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      e.validate(se), yt(se);
      try {
        await e.chain.broadcast(ne.raw, ne.txid), yt({ ...se, status: "pending" }), A = `${x.liked ? "♥ Liked" : "Unliked"} ${k}`, L = "";
        try {
          (ee = e.likeSent) == null || ee.call(e, x.song, x.liked);
        } catch {
        }
      } catch (Ee) {
        if (yt({ ...se, status: di(Ee) ? "failed" : "unknown", note: Ee.message, ...di(Ee) ? { raw: void 0 } : {} }), L = Ee.message, di(Ee)) try {
          (l = e.likeFailed) == null || l.call(e, x.song);
        } catch {
        }
      }
      o = await ln(s);
    } catch (g) {
      L = "Like not sent: " + (g instanceof Error ? g.message : "the listening wallet is unavailable");
      try {
        (p = e.likeFailed) == null || p.call(e, x.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), vs();
    }
  }
  return { snapshot: kt, refresh: Gn, onListened: ar, heart: go, toggleLike: Un, ...es };
}
const ub = ["Connect", "Passkey", "Link & fund", "Listen"], db = ["Passkey", "Add 1 STX", "Listen"], Gd = (e) => e ? db : ub;
function L5(e) {
  if (e.solo) return C5(e);
  const t = ub.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function C5(e) {
  const t = db.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function T5(e, t) {
  return !t || t.at >= Gd(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const B5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function M5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !B5(r.id)));
}
const N5 = {}, _5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, P5 = (e) => {
  const t = N5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, U5 = (e) => `/hiro/${e}`, O5 = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, H5 = (e) => {
  const t = P5(e);
  if (t)
    return [O5(t)];
  const n = _5[e];
  return typeof window < "u" ? [`${window.location.origin}${U5(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, D5 = {}, sg = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, F5 = "xtrata.log.enabled", j5 = "xtrata.log.level", R5 = "xtrata.log.tags", z5 = "xtrata.log.dedupe", vc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, G5 = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, K5 = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, V5 = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, X5 = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, Y5 = () => {
  const e = D5 ?? {}, t = vc(F5) ?? e.VITE_LOG_ENABLED, n = vc(j5) ?? e.VITE_LOG_LEVEL, r = vc(R5) ?? e.VITE_LOG_TAGS, s = vc(z5) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: G5(t),
    level: K5(n) ?? "warn",
    tags: X5(r),
    dedupe: V5(s)
  };
}, q5 = (e, t, n) => !e.enabled || sg[n] < sg[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), W5 = (e, t, n, r) => {
  const s = Y5();
  if (!q5(s, t, e) || J5(s.dedupe))
    return;
  const o = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, Z5 = /* @__PURE__ */ new Set();
let og = null;
const J5 = (e, t, n, r, s) => (og !== e && (Z5.clear(), og = e), !1), Q5 = (e, t, n) => W5("debug", e, t, n), eI = {}, tI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, nI = (e) => {
  const t = eI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : tI[e];
}, rI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, sI = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return rI.test(n) ? n : null;
}, oI = (e) => e.replace(/\/+$/, ""), iI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), ig = (e) => {
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
}, fi = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, aI = (e) => {
  var c, u;
  let t;
  try {
    t = $r(o6(e));
  } catch {
    return null;
  }
  const n = fi(t);
  if (!n || n.success === !1)
    return null;
  const r = fi(n.value), s = fi(r == null ? void 0 : r.value), o = fi(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = ig((c = fi(o.name)) == null ? void 0 : c.value), a = ig((u = fi(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : sI(`${i}.${a}`);
}, cI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${oI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [Gm(Im(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : aI(o.result);
}, lI = async (e) => {
  const t = e.address.trim();
  if (!Ei(t))
    return null;
  const n = nI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of H5(e.network))
    try {
      return await cI({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (o) {
      r = o;
    }
  return Q5("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: iI(r)
  }), null;
};
function uI(e, t, n = {}) {
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
const ag = Object.freeze({
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
}), cg = Object.freeze({ 139: "melophonic" });
function lg(e, t = "") {
  const n = String(e);
  return Object.hasOwn(ag, n) ? ag[n] : Object.hasOwn(cg, n) ? cg[n] : t;
}
const ug = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function dg(e, t = "") {
  return Object.hasOwn(ug, String(e)) ? ug[String(e)] : t;
}
const fb = 10000n, ah = 1000000n, hl = 3000n, dI = (e, t) => `${e}#gift=${t}`, fI = 100, ia = (e, t = Mr) => e <= qt ? 0 : Number((e - qt) / vn(t)), fg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), ch = "xtrata.xyz/radio/gifts", fa = fI, hI = "Create a prefunded Xtrata radio gift batch", pI = (e) => ({
  domain: rr({ name: dt(ch), version: dt("1"), "chain-id": cn(1) }),
  message: rr({
    purpose: dt(hI),
    creator: dt(e.creator),
    count: cn(e.count),
    amount: cn(BigInt(e.amount)),
    label: dt(e.label),
    issued: cn(e.issued),
    ...e.player ? { player: dt(e.player) } : {}
  })
}), hb = (e, t, n = Mr) => qt + BigInt(e) * vn(n) + (t ? Kl : 0n), gI = (e, t = Mr) => Number((ah - qt - (e ? Kl : 0n)) / vn(t)), pb = (e, t) => BigInt(e) * (t + hl);
function yI(e, t, n, r = Mr) {
  const s = n ? Kl : 0n, o = t > qt + s ? t - qt - s : 0n, i = Number(o / vn(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * ll,
    fees: BigInt(i) * r,
    reserve: qt,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: hl,
    perCopy: t + hl,
    total: pb(e, t)
  };
}
const wI = (e) => e >= fb && e <= ah, mI = 90, hg = [30, 90], bI = "Extend my prefunded Xtrata radio gift batches; no spending permission", xI = (e) => ({
  domain: rr({ name: dt(ch), version: dt("1"), "chain-id": cn(1) }),
  message: rr({ purpose: dt(bI), creator: dt(e.creator), batch: dt(e.batch), days: cn(e.days), issued: cn(e.issued) })
}), pg = 40, SI = "Create an Xtrata radio gift player", Kd = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), vI = /^[^\u0000-\u001f\u007f<>]+$/u;
function gg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && vI.test(e) : !n;
}
function gb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!gg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!gg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > pg) throw new Error(`A player holds 1 to ${pg} songs.`);
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
const yb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return uf(hf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, AI = (e) => ({
  domain: rr({ name: dt(ch), version: dt("1"), "chain-id": cn(1) }),
  message: rr({
    purpose: dt(SI),
    admin: dt(e.admin),
    player: dt(e.hash),
    issued: cn(e.issued)
  })
}), Cr = (e) => e.tracks.filter((t) => !t.hidden), EI = (e) => e.tracks.find((t) => t.hidden) ?? null, Tu = [300, 500, 1e3], xa = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Ac = (e) => typeof e == "string" && xa.some((t) => t.id === e), ko = (e) => xa.find((t) => t.id === e), kI = (e) => xa.find((t) => e >= t.min) ?? xa[xa.length - 1];
function $I(e, t = Mr) {
  return kI(e <= qt ? 0 : Number((e - qt) / vn(t)));
}
const wb = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], II = "1000 Players";
function lh(e = fa) {
  const t = [];
  for (const n of wb) {
    const r = hb(n.plays, !1);
    for (let s = n.count; s > 0; s -= e) {
      const o = Math.min(s, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: o, label: `${II} ${String(i).padStart(2, "0")}`, amount: r, deposit: pb(o, r) });
    }
  }
  return t;
}
const uh = (e = lh()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: wb.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), LI = 23 * 36e5, yg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function CI(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < LI ? "unpaid" : "todo";
}
function TI(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: CI(c, n) })).filter((c) => c.state !== "todo").sort((c, u) => yg(u.state) - yg(c.state) || u.b.at - c.b.at), s = r[0];
  if (!s) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const o = (a = s.b.view) == null ? void 0 : a.copies, i = s.state === "live" ? `live · all ${e.count} waiting to be claimed` : s.state === "touched" ? `live, but only ${(o == null ? void 0 : o.waiting) ?? 0} of ${e.count} still waiting (${(o == null ? void 0 : o.claimed) ?? 0} claimed)` : s.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: s.state, batch: s.b, extras: r.length - 1, detail: s.b.error ? `${i} (${s.b.error})` : i };
}
function wg(e, t, n = lh()) {
  var u;
  const r = n.map((h) => TI(h, e, t)), s = [];
  for (const h of r)
    h.extras && s.push(`Batch ${h.step.n} was made more than once. The extra ${h.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${h.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), h.state === "touched" && s.push(`Batch ${h.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const o = r.every((h) => h.state === "live"), i = o ? r.flatMap((h) => h.batch.codes) : [], a = uh(n).players;
  o && new Set(i).size !== a && s.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = o && new Set(i).size === a;
  return { steps: r, next: ((u = r.find((h) => h.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((h) => h.state === "live").length, ready: c, codes: c ? i : [], problems: s };
}
function BI(e, t = lh()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = uh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const s = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), o = r.tiers.map((u) => {
    var d;
    const h = (d = n.tiers) == null ? void 0 : d.find((m) => m.plays === u.plays);
    return { ...u, got: (h == null ? void 0 : h.total) ?? 0 };
  }), i = o.map((u) => `${u.got} ${ko(u.id).name}`).join(", "), a = (n.tiers ?? []).filter((u) => !r.tiers.some((h) => h.plays === u.plays)), c = n.total === r.players && s === 0 && !!n.tiers && o.every((u) => u.got === u.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((u, h) => u + h.total, 0)} of another size` : ""})` : ""}${s ? `, ${s} no longer available` : ""}.` };
}
const mg = 1800, Bu = /* @__PURE__ */ new Map();
async function MI(e) {
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
function NI(e, t, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = e, (() => {
    const a = Bu.get(e), c = !!a && a.until > Date.now();
    o.textContent = c ? a.label : t, o.classList.toggle("is-done", c && a.ok), o.classList.toggle("is-failed", c && !a.ok);
  })(), o.onclick = async () => {
    const a = await n();
    if (a) {
      Bu.set(e, { ...a, until: Date.now() + mg });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Bu.delete(e), s();
      }, mg + 50);
    }
  }, o;
}
const Jn = (e, t, n, r, s) => NI(e, t, async () => await MI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), yo = "xtrata.radio.gift.incoming.v1", bg = (e) => "xtrata.radio.gift.mine.v1:" + e, xg = (e) => "xtrata.radio.gift.batches.v1:" + e, pe = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Xt = (e, t, n = "") => {
  const r = pe("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, aa = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Hn = (e) => Er(e).replace(/\.?0+$/, "");
function _I(e) {
  let t = null;
  const n = (y) => [5e3, 1e4, 2e4, 3e4][y] ?? 6e4, r = (() => {
    try {
      const y = new URL(location.href), C = new URLSearchParams(y.hash.slice(1)).get("gift") ?? y.searchParams.get("gift");
      return C !== null && (y.searchParams.delete("gift"), history.replaceState(null, "", y.pathname + (y.search || ""))), fg(C) ? C : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const y = JSON.parse(e.store.get(yo) || "null");
      return fg(y == null ? void 0 : y.code) ? y.code : null;
    } catch {
      return null;
    }
  })(), o = r ?? s;
  if (o) {
    t = { code: o }, e.store.set(yo, JSON.stringify({ code: o, at: e.now() }));
    let y = 0;
    const C = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: o }), signal: AbortSignal.timeout(15e3) }).then(async (j) => {
      const z = await j.json().catch(() => ({}));
      if (j.status === 404) {
        e.store.set(yo, null), t = { ...t, error: (z == null ? void 0 : z.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!j.ok) throw new Error("busy");
      const ae = z;
      t = { ...t, view: ae, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ae.status) && e.store.set(yo, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void C(), n(y++)));
    });
    C();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const y = t == null ? void 0 : t.view;
    return !(y != null && y.player) || !i() ? null : { player: y.player, from: d(y), plays: ia(BigInt(y.amount)) };
  }, c = () => {
    const y = t == null ? void 0 : t.view;
    return !y || y.player || !i() ? null : { plays: ia(BigInt(y.amount)), from: y.from ? e.who(y.from) : null };
  }, u = () => {
    const y = t == null ? void 0 : t.code;
    if (!y) return [];
    const C = `${location.origin}${location.pathname}#gift=${y}`;
    return [Jn("gift-pass-on", "Copy the link to pass on", () => C, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(yo, null), e.changed();
  }, d = (y) => y.from ? e.who(y.from) : y.label ? `Xtrata Radio · ${y.label}` : "Xtrata Radio";
  let m = {};
  const w = (y) => {
    if (m.box) return m.box;
    const C = pe("div", "", "ppp-gift-check");
    m.box = C;
    const j = () => {
      const z = window.turnstile;
      !z || m.rendered || (m.rendered = !0, z.render(C, { sitekey: y, callback: (ae) => {
        m.token = ae, e.changed();
      }, "expired-callback": () => {
        m.token = void 0;
      } }));
    };
    if (window.turnstile) j();
    else {
      const z = document.createElement("script");
      z.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", z.async = !0, z.onload = j, document.head.append(z);
    }
    return C;
  }, v = (y) => {
    queueMicrotask(() => void y());
  };
  let A;
  async function L(y) {
    var z, ae, re, Le, Se, Me, mt, be, et;
    if (!t || t.claiming || !y.listening) return;
    const C = !!((z = t.view) != null && z.player);
    if (C && !y.root) return;
    t.claiming = !0, t.error = void 0, (ae = e.claiming) == null || ae.call(e, !0), e.changed();
    const j = async (st) => {
      const tt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: m.token, ...st })
      });
      return { res: tt, r: await tt.json().catch(() => ({})) };
    };
    try {
      let st = 0, tt = y.listening, Ft;
      if (C) {
        const kt = Number((re = await e.json("/radio/gift/slots?root=" + encodeURIComponent(y.root))) == null ? void 0 : re.next);
        if (!Number.isSafeInteger(kt) || kt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        st = kt;
        for (let _r = 0; ; _r++) {
          const Ge = await e.album.bind(st);
          if (tt = Ge.address, Ft = await j({ wallet: tt, binding: Ge }), Ft.res.status === 409 && /just taken/.test(((Le = Ft.r) == null ? void 0 : Le.error) || "") && _r < 5) {
            st += 1;
            continue;
          }
          break;
        }
      } else Ft = await j({ wallet: tt });
      const { res: Bt, r: gt } = Ft;
      if (Bt.status === 503 && /sending another gift/.test((gt == null ? void 0 : gt.error) || "")) {
        t.waiting = !0, (Se = e.claiming) == null || Se.call(e, !0), clearTimeout(A), A = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!Bt.ok) {
        const kt = String((gt == null ? void 0 : gt.error) || "");
        if (Bt.status === 404 || Bt.status === 410 || Bt.status === 409 && /already had a gift|brand-new|already have this album/.test(kt))
          throw e.store.set(yo, null), new Error(kt || "This gift cannot be opened.");
        if (Bt.status === 429 || Bt.status === 403 || Bt.status === 400 && !/wallet number/i.test(kt)) throw new Error(kt || `Could not open the gift (${Bt.status}).`);
        const Ge = /topping up/.test(kt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(kt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(kt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Ge), { retry: !0, slow: /topping up|not paid for yet/.test(kt) });
      }
      t.done = !0, e.store.set(yo, null), C ? await e.album.arrived(st, tt, gt.txid, BigInt(gt.amount)) : e.giftSent(gt.txid, BigInt(gt.amount));
    } catch (st) {
      const tt = st, Ft = tt.name === "TypeError" || tt.name === "AbortError" || tt.name === "TimeoutError" || /wallet number/i.test(tt.message);
      if (tt.retry || Ft) {
        const Bt = t.tries ?? 0;
        t.tries = Bt + 1, t.retry = { text: tt.retry ? tt.message : "Still sending your gift… the network is slow, trying again." }, (Me = e.claiming) == null || Me.call(e, !0), clearTimeout(A), A = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, tt.slow ? 6e4 : n(Bt));
      } else
        t.error = tt.message, (mt = e.claiming) == null || mt.call(e, !1);
      m.token = void 0;
      try {
        (et = (be = window.turnstile) == null ? void 0 : be.reset) == null || et.call(be, m.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let P = null;
  function O(y) {
    if (!y.listening || !y.depositPending || y.step !== "fund")
      return P = null, [];
    if (!P || P.wallet !== y.listening || e.now() - P.at > 3e4) {
      const j = y.listening;
      P = { ...(P == null ? void 0 : P.wallet) === j ? P : {}, wallet: j, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(j)).then((z) => {
        var ae, re;
        (P == null ? void 0 : P.wallet) === j && (P.state = (ae = z == null ? void 0 : z.gift) == null ? void 0 : ae.state, P.problem = ((re = z == null ? void 0 : z.gift) == null ? void 0 : re.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(P.state === "sending" && P.problem)) return [];
    const C = pe("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return C.title = `Network reply: ${P.problem}`, [C];
  }
  function E(y, C, j = !1) {
    var Me, mt;
    const z = C.player, ae = BigInt(C.amount), re = j ? [] : [pe("p", `🎁 ${d(C)} sent you “${z.title}”${z.subtitle ? ` by ${z.subtitle}` : ""}: ${Cr(z).length} ${Cr(z).length === 1 ? "song" : "songs"} and ${ia(ae).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!y.root && ["fund", "ready", "over", "link"].includes(y.step))) {
      if (j) return re;
      if (re.push(pe("p", y.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : y.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), y.step === "intro") {
        const be = document.createElement("details");
        be.className = "ppp-how";
        const et = document.createElement("summary");
        et.textContent = "How does this work?", be.append(et, pe("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), re.push(be);
      }
      return re;
    }
    if (y.walletCannotAlbums)
      return re.push(pe("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), re;
    const Se = (mt = (Me = y.gate) == null ? void 0 : Me.gifts) == null ? void 0 : mt.turnstileSiteKey;
    return Se && !m.token ? re.push(pe("p", "One quick check and it is yours:", "ppp-mute"), w(Se)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(y)), re.push(...M(y, "Sending your album…")), re;
  }
  function M(y, C) {
    const j = [];
    return t.claiming || t.waiting ? j.push(pe("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : C, "ppp-cyan")) : t.retry && j.push(pe("p", t.retry.text, "ppp-warn"), Xt("Try now", () => {
      clearTimeout(A), t.retry = void 0, L(y);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? j.push(pe("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), Xt("Forget this gift link here", h, "quiet")) : t.error && j.push(pe("p", t.error, "ppp-bad"), Xt("Try again", () => {
      t.error = void 0, L(y);
    })), j;
  }
  const U = (y) => {
    var C;
    return !!t && !t.done && !t.error && i() && !!y.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !y.linked && !y.creditedTo && (y.createdHere || y.brandNew || !!((C = t.view) != null && C.player)) && (y.balance ?? 0n) === 0n && !y.entries.length);
  };
  function V(y, C = {}) {
    var tt, Ft, Bt, gt;
    const j = O(y);
    if (!t || ["off", "elsewhere"].includes(y.step)) return j;
    const z = t.view;
    if (t.error && !z) return [pe("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!z) return [pe("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return j;
    if (z.status === "claimed" || z.status === "claiming") return [pe("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(z.status)) return [pe("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (z.status === "pending-deposit") return [pe("p", `🎁 ${d(z)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (z.player) return [...E(y, z, !!C.bare), ...j];
    const ae = !!y.listening && (!(y.createdHere || y.brandNew) || !!y.linked || !!y.creditedTo || (y.balance ?? 0n) > 0n || y.entries.length > 0), re = ae ? ((tt = e.claimNew) == null ? void 0 : tt.call(e, y)) ?? null : null, Le = re ? ((Ft = e.replaceOld) == null ? void 0 : Ft.call(e, y)) ?? null : null;
    if (re && Le)
      return [
        pe("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        Xt("Replace my old player", Le, "primary"),
        Xt("Keep both players", re, "quiet"),
        Xt("Not now", h, "quiet")
      ];
    if (re)
      return [
        pe("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        Xt("Claim it as a new player", re, "primary"),
        Xt("Not now", h, "quiet")
      ];
    if (ae)
      return [pe("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Xt("Forget this gift link here", h, "quiet")];
    const Se = BigInt(z.amount), Me = ia(Se).toLocaleString(), mt = pe(
      "p",
      `🎁 ${d(z)} sent you ${Hn(Se)} STX of on-chain music: about ${Me} paid plays.`,
      "ppp-gift"
    ), be = C.bare ? [] : [mt], et = !!y.listening && (y.createdHere || y.brandNew) && !y.linked && !y.creditedTo && y.step === "fund" && (y.balance ?? 1n) === 0n && !y.depositPending && !y.entries.length, st = (gt = (Bt = y.gate) == null ? void 0 : Bt.gifts) == null ? void 0 : gt.turnstileSiteKey;
    return et ? (st && !m.token ? be.push(pe("p", "One quick check and it is yours:", "ppp-mute"), w(st)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(y)), be.push(...M(y, "Sending your gift…"))) : y.step === "intro" ? C.bare || be.push(pe("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : y.listening && y.linked ? be.push(pe("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Xt("Forget this gift link here", h, "quiet")) : y.listening && (y.balance ?? 0n) > 0n && be.push(pe("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Xt("Forget this gift link here", h, "quiet")), be;
  }
  async function ce(y, C, j) {
    var z;
    try {
      const ae = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(y));
      if ((z = ae == null ? void 0 : ae.gift) != null && z.returnTo) return { ok: !0, funder: ae.gift.returnTo, txId: ae.gift.txid ?? void 0, amount: ae.gift.amount, distinct: 1 };
    } catch {
      if (j) return { ok: !1 };
    }
    return C();
  }
  const te = pe("div", "", "ppp-gift-fold");
  let Y = 250000n, b = "", $ = "";
  const N = (y) => {
    try {
      const C = JSON.parse(e.store.get(bg(y)) || "[]");
      return Array.isArray(C) ? C : [];
    } catch {
      return [];
    }
  }, _ = (y, C) => e.store.set(bg(y), JSON.stringify(C.slice(0, 50)));
  async function q(y) {
    const C = N(y);
    for (const j of C)
      if (!(j.view && ["claimed", "refunded", "expired"].includes(j.view.status)))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: j.id, ...j.txid ? { txid: j.txid } : {} }) }) : await e.json("/radio/gift?id=" + j.id), j.error = void 0;
        } catch (z) {
          j.error = z.message;
        }
    _(y, C), e.changed();
  }
  async function R(y) {
    if (b) return;
    b = "Starting your gift…", $ = "", e.changed();
    let C = null;
    try {
      C = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: y, amount: Y.toString() }) });
      const j = N(y);
      j.unshift({ id: C.id, code: C.code, amount: Y.toString(), at: e.now() }), _(y, j), b = "Approve the gift in your wallet…", e.changed();
      const z = await e.pay(y, C.depositTo, BigInt(C.deposit), C.memo), ae = N(y), re = ae.find((Le) => Le.id === C.id);
      re && (re.txid = z, re.view = { status: "pending-deposit", amount: Y.toString(), source: "friend", from: y, label: "", expires: 0 }), _(y, ae), $ = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", q(y);
    } catch (j) {
      $ = j.message || "Not sent.";
    } finally {
      b = "", e.changed();
    }
  }
  const le = (y) => "xtrata.radio.gift.players.v1:" + y, ue = (y) => {
    try {
      const C = JSON.parse(e.store.get(le(y)) || "[]");
      return Array.isArray(C) ? C.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id)) : [];
    } catch {
      return [];
    }
  };
  async function De(y, C) {
    var j;
    if (!b) {
      b = "Checking the player…", $ = "", e.changed();
      try {
        const z = C.tracks.split(/[\s,]+/).filter(Boolean).map((be) => Number(be.replace(/^#/, ""))), ae = (C.explicit ?? "").split(/[\s,]+/).map((be) => be.replace(/^#/, "")).filter(Boolean).map(Number), re = gb({ title: C.title.trim(), subtitle: C.subtitle.trim(), tracks: z, cover: (j = C.cover) != null && j.trim() ? Number(C.cover.trim().replace(/^#/, "")) : null, ...ae.length ? { explicit: ae } : {} });
        b = "Sign in your wallet…", e.changed();
        const Le = { admin: y, hash: yb(re), issued: e.now() }, Se = await e.sign(y, AI(Le));
        b = "Making the player…", e.changed();
        const Me = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: re, request: Le, signature: Se }) }), mt = ue(y).filter((be) => be.id !== Me.id);
        mt.unshift({ id: Me.id, title: Me.title, tracks: Me.tracks }), e.store.set(le(y), JSON.stringify(mt.slice(0, 30))), $ = `${Me.existing ? "That player already exists" : "Player made"} ✓ “${Me.title}” · ${Me.tracks} songs. Pick it below for a batch.`;
      } catch (z) {
        $ = z.message || "Not made.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const I = (y, C) => dI(y || location.origin + "/radio.html", C), F = (y) => {
    try {
      const C = JSON.parse(e.store.get(xg(y)) || "[]");
      return Array.isArray(C) ? C.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id) && Array.isArray(j.codes)) : [];
    } catch {
      return [];
    }
  }, de = (y, C) => e.store.set(xg(y), JSON.stringify([...C.filter((j) => j.codes.length), ...C.filter((j) => !j.codes.length)].slice(0, 80))), ye = (y) => !!y.view && y.view.status === "live" && y.view.copies.waiting + y.view.copies.claiming + y.view.copies.refunding === 0, Ce = (y, C) => e.json(y, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(C) });
  let Te = 0;
  async function Ct(y) {
    const C = F(y);
    for (const j of C)
      if (!ye(j))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await Ce("/radio/gift/batch/confirm", { id: j.id, ...j.txid ? { txid: j.txid } : {} }) : await e.json("/radio/gift/batch?id=" + j.id), j.error = void 0;
        } catch (z) {
          j.error = z.message;
        }
    try {
      const j = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(y));
      for (const z of (j == null ? void 0 : j.batches) ?? []) {
        const ae = C.find((re) => re.id === z.id);
        if (ae) {
          ae.error || (ae.view = z);
          continue;
        }
        C.push({ id: z.id, codes: [], count: z.count, amount: z.amount, label: z.label, player: z.player, depositTo: "", deposit: z.deposit, memo: z.memo, at: 0, view: z });
      }
    } catch {
    }
    de(y, C), e.changed();
  }
  async function He(y, C) {
    const j = F(y).find((z) => z.id === C);
    if (!(!j || !j.depositTo || b)) {
      b = "Approve the payment in your wallet…", $ = "", e.changed();
      try {
        const z = await e.pay(y, j.depositTo, BigInt(j.deposit), j.memo), ae = F(y), re = ae.find((Le) => Le.id === C);
        re && (re.txid = z), de(y, ae), $ = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", b = "", Ct(y);
      } catch (z) {
        $ = `${/cancel/i.test(z.message) ? "Payment cancelled." : z.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        b = "", e.changed();
      }
    }
  }
  async function Be(y, C, j, z) {
    if (b) return;
    if (!C.ok) {
      $ = C.reason, e.changed();
      return;
    }
    b = "Sign in your wallet…", $ = "", e.changed();
    let ae = null;
    try {
      const re = { creator: y, count: C.count, amount: C.amount.toString(), label: j, issued: e.now(), ...z ? { player: z } : {} }, Le = await e.sign(y, pI(re));
      b = "Making your links…", e.changed(), ae = await Ce("/radio/gift/batch", { request: re, signature: Le });
      const Se = F(y);
      Se.unshift({ id: ae.id, codes: ae.codes, count: C.count, amount: ae.amount, label: j, player: z ?? null, depositTo: ae.depositTo, deposit: ae.deposit, memo: ae.memo, at: e.now() }), de(y, Se);
    } catch (re) {
      $ = re.message || "Not made.", b = "", e.changed();
      return;
    }
    b = "", e.changed(), await He(y, ae.id);
  }
  async function _e(y, C, j) {
    if (!b) {
      b = "Sign in your wallet (nothing is spent)…", $ = "", e.changed();
      try {
        const z = { creator: y, batch: C, days: j, issued: e.now() }, ae = await e.sign(y, xI(z));
        b = "Extending…", e.changed();
        const re = await Ce("/radio/gift/batch/extend", { request: z, signature: ae }), Le = F(y);
        for (const Se of (re == null ? void 0 : re.batches) ?? []) {
          const Me = Le.find((mt) => mt.id === Se.id);
          Me && (Me.view = Se, Me.error = void 0);
        }
        de(y, Le), $ = re != null && re.extended ? `Extended ✓ ${re.extended === 1 ? "That batch has" : `${re.extended} batches have`} ${j} more days.` : "There was nothing live to extend.";
      } catch (z) {
        $ = /cancel/i.test(z.message || "") ? "Cancelled. Nothing changed." : z.message || "Not extended.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const en = (y) => Math.max(0, Math.ceil((y - e.now()) / 864e5));
  function Kt(y, C) {
    const j = C.filter((re) => {
      var Le;
      return ((Le = re.view) == null ? void 0 : Le.status) === "live" && re.view.copies.waiting > 0;
    });
    if (!j.length) return null;
    const z = Math.min(...j.map((re) => re.view.expires)), ae = pe("p", "", "ppp-batch-extend");
    ae.append(pe("span", `${j.length} live ${j.length === 1 ? "batch" : "batches"} · the first runs out in ${en(z)} days. Extend ${j.length === 1 ? "it" : "them all"}: `));
    for (const re of hg) {
      const Le = Xt(`+${re} days`, () => void _e(y, "all", re), "tiny");
      Le.disabled = !!b, ae.append(Le);
    }
    return ae;
  }
  const Qe = () => Jt(!!Fe.value, ve.value, Tt.value);
  function Jt(y, C, j) {
    const z = C === "max" ? gI(y) : Number(C), ae = hb(z, y), re = Number(j);
    return !Number.isInteger(re) || re < 1 || re > fa ? { ok: !1, reason: `Make 1 to ${fa} copies at a time.`, album: y, plays: z, amount: ae, count: re } : wI(ae) ? { ok: !0, reason: "", album: y, plays: z, amount: ae, count: re, bill: yI(re, ae, y) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: y, plays: z, amount: ae, count: re };
  }
  const yt = () => {
    var y;
    return ((y = e.batchDays) == null ? void 0 : y.call(e)) ?? mI;
  }, G = (y = Qe()) => {
    if (!y.ok) return y.reason;
    const C = y.bill;
    return `Each copy: ${y.plays.toLocaleString()} paid plays (${Hn(C.holders)} to song holders, ${Hn(C.fees)} network fees)${y.album ? `, ${Hn(C.float)} for the album’s likes` : ""}, ${Hn(C.reserve)} kept so a listener can return what is left, + ${Hn(C.sendFee)} to send it = ${Hn(C.perCopy)} STX. ${y.count} copies = ${Hn(C.total)} STX, paid now in one payment. Copies nobody claims within ${yt()} days come back to you, and you can extend that at any time.`;
  }, H = (y, C) => C.codes.map((j) => I(y, j)), Q = pe("input");
  Q.type = "range", Q.min = String(fb), Q.max = String(ah), Q.step = "10000", Q.value = String(Y), Q.setAttribute("aria-label", "Gift amount");
  const J = pe("p", "", "ppp-gift-amount"), fe = Xt("", () => {
    const y = e.main();
    y && R(y);
  }, "primary"), lt = () => {
    J.textContent = Ie(), fe.textContent = `Gift ${Hn(Y)} STX`;
  };
  Q.oninput = () => {
    Y = BigInt(Q.value), lt();
  };
  const Ie = () => `${Hn(Y)} STX · about ${ia(Y).toLocaleString()} paid plays · you pay ${Hn(Y + hl)} STX with the network fee`;
  lt();
  const Ue = pe("input");
  Ue.maxLength = 60, Ue.placeholder = "Title, e.g. Proof of Sound", Ue.setAttribute("aria-label", "Player title");
  const ht = pe("input");
  ht.maxLength = 80, ht.placeholder = "Artist (optional)", ht.setAttribute("aria-label", "Player subtitle");
  const Pe = pe("textarea");
  Pe.rows = 3, Pe.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Pe.setAttribute("aria-label", "Songs");
  const Ae = pe("input");
  Ae.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ae.setAttribute("aria-label", "Explicit songs");
  const ze = pe("input");
  ze.inputMode = "numeric", ze.placeholder = "Cover inscription number (optional), shown when the album loads", ze.setAttribute("aria-label", "Cover inscription");
  const Fe = pe("select");
  Fe.setAttribute("aria-label", "Batch album");
  const ve = pe("select");
  ve.setAttribute("aria-label", "Plays per copy");
  for (const y of [.../* @__PURE__ */ new Set([50, 100, 250, ...Tu])].sort((C, j) => C - j)) ve.append(aa(`${y.toLocaleString()} plays`, String(y)));
  ve.append(aa("Max (1 STX)", "max")), ve.value = String(Tu[0]);
  const Tt = pe("input");
  Tt.type = "number", Tt.min = "1", Tt.max = String(fa), Tt.value = "10", Tt.setAttribute("aria-label", "Copies");
  const yn = pe("input");
  yn.maxLength = 40, yn.placeholder = "Label, e.g. Opera launch", yn.setAttribute("aria-label", "Batch label");
  const En = pe("p", "", "ppp-mute"), wt = () => {
    En.textContent = G();
  };
  for (const y of [Fe, ve, Tt])
    y.oninput = wt, y.onchange = wt;
  wt();
  let tn = null, Bn = 0;
  async function sr() {
    Bn = e.now();
    try {
      tn = BI(await e.json("/radio/giveaway/players"));
    } catch {
      tn = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const Nr = (y, C) => {
    var z;
    if (((z = wg(F(y), e.now()).next) == null ? void 0 : z.n) !== C.n) {
      $ = "That batch is already made. Check again.", e.changed();
      return;
    }
    Be(y, Jt(!1, String(C.plays), String(C.count)), C.label);
  };
  function or(y) {
    var Le;
    const C = wg(F(y), e.now()), j = uh(), z = pe("div", "", "ppp-drop");
    z.append(
      pe("p", `The ${j.players.toLocaleString("en-GB")} players (admin) · ${C.done} of ${j.batches} batches live`, "ppp-cyan"),
      pe("p", `${j.tiers.map((Se) => `${Se.count} ${ko(Se.id).name}`).join(", ")}. ${j.batches} batches, ${Hn(j.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const ae = pe("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const Se of C.steps) {
      const Me = pe("li"), mt = Se.state === "live" ? "✓" : Se.state === "touched" ? "!" : Se.state === "todo" ? "○" : "…";
      if (Me.append(pe("span", `${mt} ${Se.step.n}. ${ko(Se.step.tier).name} · ${Se.step.count} × ${Se.step.plays.toLocaleString("en-GB")} plays · ${Hn(Se.step.deposit)} STX`, "t"), pe("span", Se.detail, Se.state === "live" ? "ppp-ok" : Se.state === "touched" ? "ppp-warn" : "ppp-mute")), Se.state === "todo" && ((Le = C.next) == null ? void 0 : Le.n) === Se.step.n) {
        const be = Xt("Sign and pay", () => Nr(y, Se.step), "tiny");
        be.disabled = !!b, Me.append(be);
      }
      if (Se.state === "unpaid" && Se.batch) {
        const be = Xt("Pay now", () => void He(y, Se.batch.id), "tiny");
        be.disabled = !!b, Me.append(be);
      }
      ae.append(Me);
    }
    z.append(ae);
    for (const Se of C.problems) z.append(pe("p", Se, "ppp-warn"));
    C.ready ? z.append(
      pe("p", `All ${j.batches} batches are live: ${C.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      Jn("drop-copy", `Copy the ${C.codes.length.toLocaleString("en-GB")} links`, () => C.codes.join(`
`), "tiny", e.changed)
    ) : z.append(pe("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - Bn > 6e4 && sr(), tn && z.append(pe("p", tn.text, tn.ok ? "ppp-ok" : "ppp-mute"));
    const re = Xt("Check again", () => {
      Te = e.now(), Ct(y), sr();
    }, "tiny");
    return re.disabled = !!b, z.append(re), z;
  }
  function Rn(y, C, j) {
    const z = C.view, ae = z == null ? void 0 : z.copies, re = C.error ? C.error : !z || z.status === "pending-deposit" ? C.txid ? "payment confirming…" : "waiting for your payment" : `${ae.claimed} of ${z.count} claimed${ae.refunding + ae.refunded ? ` · ${ae.refunded} refunded${ae.refunding ? `, ${ae.refunding} on their way` : ""}` : ""}`, Le = pe("li");
    if (Le.append(pe("span", `${C.label || "Batch"} · ${C.count} × ${Hn(BigInt(C.amount))} STX`, "t"), pe("span", re, "ppp-mute")), !C.txid && C.depositTo && (!z || z.status === "pending-deposit") && Le.append(Xt("Pay now", () => void He(y, C.id), "tiny")), (z == null ? void 0 : z.status) === "live" && ae.waiting > 0) {
      Le.append(pe("span", `${en(z.expires)} days left`, "ppp-mute"));
      for (const Se of hg) {
        const Me = Xt(`+${Se}`, () => void _e(y, C.id, Se), "tiny");
        Me.title = `Extend this batch by ${Se} days (a signature, no payment)`, Me.setAttribute("aria-label", `Extend ${C.label || "this batch"} by ${Se} days`), Me.disabled = !!b, Le.append(Me);
      }
    }
    if (C.codes.length && (z == null ? void 0 : z.status) === "live") {
      const Se = H(j, C);
      Le.append(
        Jn("batch-copy:" + C.id, "Copy all links", () => Se.join(`
`), "tiny", e.changed),
        Jn("batch-csv:" + C.id, "Copy as CSV", () => ["copy,link", ...Se.map((Me, mt) => `${mt + 1},${Me}`)].join(`
`), "tiny", e.changed)
      );
    } else C.codes.length || Le.append(pe("span", "links were made on another device", "ppp-mute"));
    return Le;
  }
  const Ut = pe("select");
  Ut.setAttribute("aria-label", "Plays in each copy");
  for (const y of [.../* @__PURE__ */ new Set([50, 100, 250, ...Tu])].sort((C, j) => C - j)) Ut.append(aa(`${y.toLocaleString()} plays`, String(y)));
  Ut.value = "50";
  const nn = pe("input");
  nn.type = "number", nn.min = "1", nn.max = String(fa), nn.value = "10", nn.setAttribute("aria-label", "How many copies");
  const ut = pe("input");
  ut.maxLength = 40, ut.placeholder = "A note recipients see, e.g. Launch week (optional)", ut.setAttribute("aria-label", "Note for recipients");
  const Qt = pe("p", "", "ppp-mute");
  function Mn(y, C, j) {
    const z = () => Jt(!0, Ut.value, nn.value), ae = () => {
      Qt.textContent = G(z());
    };
    for (const et of [Ut, nn])
      et.oninput = ae, et.onchange = ae;
    ae();
    const re = () => (ut.value.trim() || C.title).replace(/[^ -~]/g, "").slice(0, 40), Le = Xt("Sign, pay and make links", () => {
      Be(y, z(), re(), C.id);
    }, "primary");
    Le.disabled = !!b;
    const Se = (et, st) => {
      const tt = pe("label", et);
      return tt.append(st), tt;
    }, Me = [
      pe("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      Se("Plays in each ", Ut),
      Se("Copies ", nn),
      ut,
      Qt,
      Le
    ];
    e.now() - Te > 3e4 && (Te = e.now(), Ct(y));
    const mt = F(y).filter((et) => et.player === C.id);
    if (mt.length) {
      const et = pe("ul", "", "ppp-gift-list");
      for (const st of mt.slice(0, 10)) et.append(Rn(y, st, j));
      Me.push(et);
    }
    const be = Kt(y, F(y));
    return be && Me.push(be), b && Me.push(pe("p", b, "ppp-cyan")), $ && Me.push(pe("p", $, /✓/.test($) ? "ppp-ok" : "ppp-warn")), Me;
  }
  function Jr(y) {
    var ae, re;
    const C = (ae = y.gate) == null ? void 0 : ae.gifts;
    if (!(C != null && C.enabled) || !C.admin || ["off", "elsewhere", "unsupported"].includes(y.step)) return null;
    const j = e.main(), z = [pe("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!j)
      z.push(pe("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (C.admin) {
      const Le = pe("div", "", "ppp-gift-admin"), Se = (st, tt) => {
        const Ft = pe("label", st);
        return Ft.append(tt), Ft;
      }, Me = ue(j);
      Le.append(
        pe("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Ue,
        ht,
        Pe,
        ze,
        Ae,
        Xt("Sign and make player", () => void De(j, { title: Ue.value, subtitle: ht.value, tracks: Pe.value, cover: ze.value, explicit: Ae.value }))
      );
      const mt = Xt("Sign, pay and make links", () => {
        Be(j, Qe(), yn.value.trim(), Fe.value || void 0);
      });
      mt.disabled = !!b;
      const be = Fe.value;
      Fe.replaceChildren(aa("No album (starter copies)", ""), ...Me.map((st) => aa(`${st.title} · ${st.tracks} songs`, st.id))), Me.some((st) => st.id === be) && (Fe.value = be), wt(), Le.append(
        pe("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${yt()} days unless you extend`, "ppp-cyan"),
        Se("Album ", Fe),
        Se("Plays each ", ve),
        Se("Copies ", Tt),
        yn,
        En,
        mt
      ), e.now() - Te > 3e4 && (Te = e.now(), Ct(j));
      const et = F(j);
      if (et.length) {
        const st = pe("ul", "", "ppp-gift-list");
        for (const Ft of et.slice(0, 20)) st.append(Rn(j, Ft, ((re = y.gate) == null ? void 0 : re.radioUrl) ?? null));
        Le.append(st);
        const tt = Kt(j, et);
        tt && Le.append(tt);
      }
      Le.append(or(j)), z.push(Le);
    }
    return b && z.push(pe("p", b, "ppp-cyan")), $ && z.push(pe("p", $, /✓/.test($) ? "ppp-ok" : "ppp-warn")), te.replaceChildren(...z), te;
  }
  return { banner: V, funder: ce, renderFold: Jr, copies: Mn, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: U };
}
const PI = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function UI(e) {
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
const OI = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function HI(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((o) => (!t.pinnedOnly || t.pins.has(o.slot)) && (() => {
    const i = OI(o);
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
function DI(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Vd = /* @__PURE__ */ new Set(), dh = (e) => (Vd.add(e), () => {
  Vd.delete(e);
}), pl = () => {
  for (const e of [...Vd])
    try {
      e();
    } catch {
    }
}, Sg = "xtrata:al-thumb:v1:", fh = "-", ca = 96, FI = 24 * 1024 * 1024, an = /* @__PURE__ */ new Map(), vg = /* @__PURE__ */ new Set(), Xd = [];
let Mu = !1, Nu;
const Ma = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(Sg + e);
    window.localStorage.setItem(Sg + e, t);
  } catch {
  }
  return null;
};
function hh(e) {
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
          r.width = r.height = ca, s.fillStyle = "#143a40", s.fillRect(0, 0, ca, ca), s.drawImage(o, (o.naturalWidth - a) / 2, (o.naturalHeight - a) / 2, a, a, 0, 0, ca, ca), t(r.toDataURL("image/jpeg", 0.82));
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
async function jI(e) {
  var c, u, h, d, m;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = t.body) == null ? void 0 : u.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((h = t.body) == null ? void 0 : h.cancel()), "";
  let r = "", s = 0;
  const o = (w) => {
    let v = 0;
    for (; ; ) {
      const A = r.slice(v).search(/<img\b/i);
      if (A < 0)
        return r = w ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const L = v + A, P = r.indexOf(">", L);
      if (P < 0)
        return r = r.slice(L), null;
      const O = r.slice(L, P + 1), E = O.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (E) return E[1].replace(/&amp;/g, "&");
      const M = O.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (M) return "/inscription/" + M[1];
      v = P + 1;
    }
  }, i = (m = (d = t.body) == null ? void 0 : d.getReader) == null ? void 0 : m.call(d);
  if (!i)
    return r = await t.text(), o(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: w, value: v } = await i.read();
    if (w) break;
    s += v.byteLength, r += a.decode(v, { stream: !0 });
    const A = o(!1);
    if (A)
      return await i.cancel(), A;
    if (s > FI)
      return await i.cancel(), null;
  }
  return r += a.decode(), o(!0) ?? "";
}
async function RI() {
  if (!Mu) {
    Mu = !0;
    try {
      for (; Xd.length; ) {
        const e = Xd.shift();
        if (!an.has(e))
          try {
            const t = await jI(e);
            if (t === null) continue;
            if (!t) {
              an.set(e, ""), Ma(e, fh), pl();
              continue;
            }
            const n = await hh(t);
            an.set(e, n), n.startsWith("data:image/jpeg") && Ma(e, n), pl();
          } catch {
          }
      }
    } finally {
      Mu = !1;
    }
  }
}
function ph(e, t) {
  if (t && !an.get(e) ? (an.set(e, t), hh(t).then((r) => {
    r !== t && (an.set(e, r), r.startsWith("data:image/jpeg") && Ma(e, r), pl());
  })) : t === "" && !an.has(e) && an.set(e, ""), an.has(e)) return an.get(e);
  const n = Ma(e);
  if (n != null) {
    const r = n === fh ? "" : n;
    return an.set(e, r), r;
  }
  return vg.has(e) || (vg.add(e), Xd.push(e), Nu || (Nu = setTimeout(() => {
    Nu = void 0, RI();
  }, 1200))), "";
}
function Ag(e) {
  if (an.has(e)) return an.get(e);
  const t = Ma(e);
  if (t == null) return null;
  const n = t === fh ? "" : t;
  return an.set(e, n), n;
}
const _u = /* @__PURE__ */ new Map(), Pu = /* @__PURE__ */ new Set();
function Oc(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : _u.has(e) ? _u.get(e) : (Pu.has(e) || (Pu.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, s, o, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = t.body) == null ? void 0 : s.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((o = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : o[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    _u.set(e, t), pl();
  }).catch(() => {
    Pu.delete(e);
  })), "");
}
const hi = 12, zI = 5e3, xn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, pi = (e, t, n = "") => {
  const r = xn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function GI(e) {
  let t, n = [], r = 0, s = !1, o = !1, i = -1 / 0, a = "", c = "recent", u = !1, h = hi;
  const d = xn("div", "", "ppp-shelf-box");
  dh(() => e.changed());
  const m = (N) => "xtrata.radio.shelf.pins.v1:" + N, w = (N) => "xtrata.radio.shelf.recent.v1:" + N, v = (N, _) => {
    try {
      return JSON.parse(e.store.get(N) || "null") ?? _;
    } catch {
      return _;
    }
  }, A = (N) => new Set(v(m(N), []).filter((_) => Number.isSafeInteger(_))), L = (N) => {
    const _ = v(w(N), {}), q = {};
    for (const [R, le] of Object.entries(_)) Number.isSafeInteger(Number(R)) && typeof le == "number" && (q[Number(R)] = le);
    return q;
  };
  async function P(N) {
    if (!s) {
      s = !0, o = !1;
      try {
        const _ = [];
        let q = 0, R = 0;
        for (let le = 0; le < zI / 100 + 1; le++) {
          const ue = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${q}&limit=100`);
          if (_.push(...UI(ue == null ? void 0 : ue.shelf)), R = Number(ue == null ? void 0 : ue.total) || _.length, !(ue != null && ue.next) || !Number.isSafeInteger(ue.next)) break;
          q = ue.next;
        }
        N === t && (n = _, r = R, i = e.now());
      } catch {
        o = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const O = () => {
    i = -1 / 0;
  }, E = xn("input");
  E.type = "search", E.placeholder = "Search title, artist or #", E.setAttribute("aria-label", "Search your albums"), E.oninput = () => {
    a = E.value, h = hi, e.changed();
  };
  const M = xn("select");
  M.setAttribute("aria-label", "Sort albums");
  for (const N of PI) {
    const _ = document.createElement("option");
    _.value = N.value, _.textContent = N.label, M.append(_);
  }
  M.onchange = () => {
    c = M.value, h = hi, e.changed();
  };
  const U = pi("", () => {
    u = !u, h = hi, e.changed();
  }, "tiny"), V = xn("div", "", "ppp-shelf-tools");
  V.append(E, M, U);
  const ce = xn("div"), te = xn("div");
  function Y(N) {
    const _ = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (_ !== t && (t = _, n = [], r = 0, i = -1 / 0, h = hi), !_ || N.walletCannotAlbums) return null;
    if (!s && e.now() - i > 5 * 6e4 && P(_), !n.length)
      return o ? (te.replaceChildren(xn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), pi("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(te), d) : null;
    const q = A(_), R = L(_), le = HI(n, { query: a, sort: c, pinnedOnly: u, pins: q, recents: R });
    E.value !== a && (E.value = a), M.value = c, U.textContent = u ? "★ Pinned only" : "☆ Pinned only", U.setAttribute("aria-pressed", String(u));
    const ue = [];
    if (N.slot > 0 && ue.push(pi("← My player", () => e.open(0), "quiet")), !le.length) ue.push(xn("p", "No album matches that.", "ppp-mute"));
    else {
      const De = xn("ul", "", "ppp-shelf-list");
      for (const I of le.slice(0, h)) {
        const F = xn("li", "", I.slot === N.slot ? "now" : ""), de = q.has(I.slot), ye = pi(de ? "★" : "☆", () => {
          const Qe = new Set(q);
          de ? Qe.delete(I.slot) : Qe.add(I.slot), e.store.set(m(_), JSON.stringify([...Qe])), e.changed();
        }, "tiny");
        ye.setAttribute("aria-label", de ? `Unpin ${I.player.title}` : `Pin ${I.player.title}`);
        const Ce = [I.player.subtitle, `${Cr(I.player).length} ${Cr(I.player).length === 1 ? "song" : "songs"}`, I.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Te = I.slot === N.slot, Ct = pi(Te ? "Playing" : "Select", () => {
          e.store.set(w(_), JSON.stringify(DI({ ...R, [I.slot]: e.now() }))), e.open(I.slot);
        }, Te ? "tiny ppp-pick" : "tiny primary ppp-pick");
        Ct.disabled = Te;
        const He = Cr(I.player)[0], Be = I.player.cover ?? (He == null ? void 0 : He.id), _e = Be ? ph(String(Be)) : "", en = xn("span", "", "ppp-shelf-art");
        if (_e) {
          const Qe = document.createElement("img");
          Qe.src = _e, Qe.alt = "", Qe.decoding = "async", en.append(Qe);
        } else en.textContent = "💿";
        const Kt = xn("span", "", "ppp-shelf-txt");
        Kt.append(xn("span", I.player.title, "t"), xn("span", Ce, "ppp-mute")), F.append(ye, en, Kt, Ct), De.append(F);
      }
      ue.push(De), le.length > h && ue.push(pi(`Show more (${le.length - h} left)`, () => {
        h += hi, e.changed();
      }, "quiet"));
    }
    return o && ue.push(xn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), ce.replaceChildren(...ue), d.firstChild !== V && d.replaceChildren(V, ce), d;
  }
  return { render: Y, invalidate: O, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const N = L(t), _ = [...n].filter((q) => q.player).sort((q, R) => (N[R.slot] ?? 0) - (N[q.slot] ?? 0) || R.slot - q.slot)[0];
    return _ ? { slot: _.slot, title: _.player.title } : null;
  } };
}
const Eg = "http://www.w3.org/2000/svg", KI = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function gl(e = "", t = !1) {
  const n = document.createElementNS(Eg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of KI) {
    const o = document.createElementNS(Eg, "path");
    o.setAttribute("fill-rule", "evenodd"), o.setAttribute("fill", t ? "currentColor" : r), o.setAttribute("d", s), n.append(o);
  }
  return n;
}
const ot = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Yn = (e, t, n, r = !1) => {
  const s = ot("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, mb = (e) => e.toLocaleString(), kg = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, VI = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function yl(e, t) {
  const n = ot("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const o = ot("li", s < t ? "is-done" : s === t ? "is-now" : "");
    o.append(ot("i", "", s < t ? "✓" : String(s + 1)), ot("span", "", r)), n.append(o);
  }), n;
}
function XI() {
  const e = ot("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(ot("span", "tier-disc__mark", "?")), e;
}
const YI = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], Sr = {
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
  arriving: { title: "Your player is made", body: "Your plays are on their way to it. This usually takes about a minute: keep this page open and it carries on by itself." },
  landed: { title: "You’re in", primary: "Start listening" },
  empty: { title: "Your player is ready", body: "It has no plays yet. Add some and every song you hear pays its artist.", primary: "Add plays", full: "Look around the radio" },
  checking: "One moment…",
  asking: "Continue in the box below."
}, qI = (e, t, n = !1) => n ? `${t || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${t || "Xtrata Music"} has covered ${e ? `${mb(e)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, WI = (e) => e ? `Your player holds ${mb(e)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", ZI = (e) => e ? `You got a ${e.name} player` : Sr.landed.title;
function JI(e, t = !0) {
  const n = ot("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(ot("span", "tier-disc__mark", e.mark)), n;
}
function QI(e) {
  const t = document.documentElement;
  let n = !1;
  const r = () => {
    const s = ot("ul", "al-welcome-points");
    for (const [o, i, a] of YI) {
      const c = ot("li");
      c.title = i;
      const u = ot("em", "", a);
      u.setAttribute("aria-hidden", "true"), c.append(u, ot("b", "", o), ot("span", "", i)), s.append(c);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, o = !1) {
      var d;
      if (!s) {
        n && !o && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = s.mode, s.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const i = ot("header", "al-top"), a = ot("a", "al-brand");
      a.href = "/radio", a.append(gl("al-logo"), ot("span", "", "Xtrata "), ot("b", "", "Music")), i.append(a);
      const c = ot("div", "al-body al-body--welcome"), u = ot("div", "al-welcome"), h = s.mode;
      if (h === "checking")
        u.append(ot("p", "al-welcome-wait", Sr.checking));
      else {
        const m = VI(h);
        if (m >= 0 && u.append(yl(h === "new" ? kg.fresh : kg.gift, m)), s.tier && (h === "landed" || h === "back" || h === "empty") ? u.append(JI(s.tier)) : h === "gift" || h === "arriving" ? u.append(XI()) : h === "new" && u.append(gl("al-hero-mark")), u.append(ot("h1", "", h === "landed" ? ZI(s.tier) : h === "back" && s.tier ? `Your ${s.tier.name} player` : Sr[h].title)), u.append(ot("p", "", h === "gift" ? qI(s.plays, s.from, s.mystery) : h === "landed" ? WI(s.plays) : Sr[h].body)), (h === "landed" || h === "gift") && u.append(r()), s.status.length) {
          const w = ot("div", "al-status");
          w.setAttribute("role", "status"), w.append(...s.status), u.append(w);
        }
        if (s.asking) u.append(ot("p", "al-hint al-hint--ask", Sr.asking));
        else if (h === "back" && s.claimNew) {
          const w = Sr.backClaim;
          u.append(ot("p", "al-hint", w.body)), s.canStart && s.replaceOld ? u.append(Yn("al-primary", w.replace, s.replaceOld, s.busy), ot("p", "al-hint", w.replaceHint), Yn("al-link", w.both, s.claimNew, s.busy), Yn("al-link", w.unlock, s.unlock, s.busy)) : s.canStart && u.append(Yn("al-primary", w.primary, s.claimNew, s.busy), ot("p", "al-hint", w.hint), Yn("al-link", w.unlock, s.unlock, s.busy)), u.append(Yn("al-link", Sr.back.full, s.full));
        } else if (h === "gift" || h === "new" || h === "back") {
          const w = Sr[h];
          s.canStart && u.append(Yn("al-primary", w.primary, h === "back" ? s.unlock : s.start, s.busy), ot("p", "al-hint", w.hint)), s.canStart && u.append(Yn("al-link", w.returning, s.returning, s.busy)), u.append(Yn("al-link", w.full, s.full));
        } else if (h === "landed") {
          if (u.append(Yn("al-primary", Sr.landed.primary, s.full)), (d = s.albums) != null && d.length) {
            u.append(ot("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const w of s.albums) {
              const v = Yn("al-album", "", w.run);
              if (w.cover) {
                const L = ot("img", "al-album__art");
                L.src = w.cover, L.alt = "", v.classList.add("al-album--art"), v.append(L);
              }
              const A = ot("span", "al-album__t");
              A.append(ot("b", "", w.title), ot("span", "", w.by)), v.append(A), u.append(v);
            }
          }
        } else h === "empty" && u.append(Yn("al-primary", Sr.empty.primary, s.restock), Yn("al-link", Sr.empty.full, s.full));
      }
      c.append(u), e.hidden = !1, e.replaceChildren(i, c);
    }
  };
}
const eL = 20, tL = ["Album", "Passkey", "Listen"], dn = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, jt = {
  grid: dn('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: dn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: dn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: dn('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: dn('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: dn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: dn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: dn('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: dn('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: dn('<path d="M6 9l6 6 6-6"/>', 18),
  right: dn('<path d="M9 6l6 6-6 6"/>', 16),
  close: dn('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: dn('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: dn('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: dn('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: dn('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: dn('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function oe(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, o] of Object.entries(t))
    o == null || o === !1 || (s === "class" ? r.className = String(o) : s === "html" ? r.innerHTML = String(o) : s.startsWith("on") && typeof o == "function" ? r[s.toLowerCase()] = o : s === "disabled" ? r.disabled = !!o : r.setAttribute(s, o === !0 ? "" : String(o)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const bn = (e, ...t) => oe("button", { type: "button", ...e }, ...t), Ec = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, la = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, nL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, rL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function $g(e, t, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const a = document.documentElement;
  function c(b) {
    var N, _, q;
    if (!b || !Number.isSafeInteger(b)) return "";
    const $ = (q = (_ = (N = t.radio()) == null ? void 0 : N.getState) == null ? void 0 : _.call(N)) == null ? void 0 : q.albumCover;
    return $ != null && $.url && Number($.tokenId) === b ? $.url : Oc(b);
  }
  dh(() => Y());
  function u(b) {
    var N;
    o = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const $ = document.querySelector(".side");
    if (b && b !== "more") {
      for (const R of rL[b]) {
        const le = $ == null ? void 0 : $.querySelector(R);
        le && (le.open = !0);
      }
      const _ = document.getElementById("sheetTitle");
      _ && (_.textContent = nL[b]);
      const q = document.getElementById("sheetExtra");
      q && q.replaceChildren(...b === "music" ? [d()] : []), (N = $ == null ? void 0 : $.scrollTo) == null || N.call($, { top: 0 });
    }
    Y();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => u("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && o && a.dataset.view === "album" && u("");
  });
  const d = () => bn(
    { class: "al-row", onClick: () => {
      u(""), t.openPlayer();
    } },
    oe("span", { class: "al-row-i", html: jt.radio }),
    oe("span", { class: "al-row-t" }, oe("b", {}, "Xtrata Radio"), oe("small", {}, "Every song on-chain · FM, liked, all")),
    oe("span", { class: "al-row-go", html: jt.right })
  );
  let m = null, w = !1;
  const v = () => {
    var $;
    const b = t.radio();
    w || !(b != null && b.subscribe) || (w = !0, b.subscribe((N) => {
      m = N, (s == null ? void 0 : s.mode) === "open" && Y();
    }), m = (($ = b.getState) == null ? void 0 : $.call(b)) ?? null);
  };
  r || setInterval(() => {
    var _, q;
    if ((s == null ? void 0 : s.mode) !== "open" || !(m != null && m.playing)) return;
    const b = (q = (_ = t.radio()) == null ? void 0 : _.getPosition) == null ? void 0 : q.call(_), $ = e.querySelector(".al-bar > i"), N = e.querySelectorAll(".al-times span");
    !b || !$ || ($.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", N.length === 2 && (N[0].textContent = Ec(b.current || 0), N[1].textContent = b.duration ? Ec(b.duration) : "–:––"));
  }, 500);
  let A = "", L = null;
  function P(b, $, N = {}) {
    const _ = N.song || c(b.cover), R = [_ ? oe("img", { src: _, alt: N.song ? "Song artwork" : `${b.title} cover` }) : oe("div", { class: "al-cover-fallback" }, oe("b", {}, b.title), b.subtitle ? oe("span", {}, b.subtitle) : null), N.paused ? oe("span", { class: "al-paused" }, oe("i", { html: jt.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], le = "al-cover" + ($ ? "" : " al-cover--small") + (N.paused ? " is-paused" : "");
    return N.flip ? (R.push(oe("span", { class: "al-flip", "aria-hidden": "true", html: jt.flip })), bn({ class: le + " is-flippable", "aria-label": N.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: N.flip }, ...R)) : oe("div", { class: le }, ...R);
  }
  function O(b) {
    return b.plays === null || b.plays === void 0 ? oe("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? oe("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : oe("span", { class: "al-chip" + (b.plays <= eL ? " al-chip--low" : "") }, `${la(b.plays, "play", "plays")} left`);
  }
  function E(b) {
    const $ = b.player, N = $.tracks.filter((q) => !q.hidden), _ = [];
    return b.step !== void 0 && _.push(yl(tL, b.step)), b.mode === "arrive" && b.from && _.push(oe("p", { class: "al-from" }, oe("span", { html: jt.gift }), oe("span", {}, oe("b", {}, b.from), " sent you an album"))), _.push(P($, !0)), _.push(oe(
      "div",
      { class: "al-intro" },
      oe("h1", {}, $.title),
      $.subtitle ? oe("p", { class: "al-artist" }, $.subtitle) : null,
      N.length ? oe("p", { class: "al-songline" }, N.map((q) => q.title || `#${q.id}`).join(" · ")) : null,
      oe("span", { class: "al-chip" }, [la(N.length, "song", "songs"), b.offered ? la(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && _.push(oe("div", { class: "al-status", role: "status" }, ...b.status)), _.push(oe("div", { class: "al-grow" })), b.asking ? _.push(oe("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && _.push(bn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, oe("span", { html: jt.playSmall }), b.primary.label)), b.hint && !b.asking && _.push(oe("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && _.push(bn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), _;
  }
  function M(b, $) {
    const { songs: N, current: _, started: q, own: R, out: le, waiting: ue } = $, De = b.player, I = t.radio(), F = [];
    F.push(oe("div", { class: "al-listhead" }, oe("span", {}, oe("b", {}, De.title), ` · ${la(N.length, "song", "songs")}`), O(b)));
    const de = c(De.cover), ye = "album:" + De.cover;
    de && !an.has(ye) && (an.set(ye, de), hh(de).then((Te) => {
      Te !== de && (an.set(ye, Te), Y());
    }));
    const Ce = de ? an.get(ye) || de : "";
    return F.push(oe("ol", { class: "al-tracks" }, ...N.map((Te, Ct) => {
      const He = String(Te.id) === _, Be = ph(String(Te.id), He && q ? R : void 0);
      return oe("li", {}, bn(
        { class: "al-track" + (He ? " is-on" : ""), "aria-label": `Play ${Te.title || "#" + Te.id}`, "aria-current": He ? "true" : void 0, disabled: le || ue, onClick: () => {
          var _e;
          return (_e = I == null ? void 0 : I.playToken) == null ? void 0 : _e.call(I, Te.id);
        } },
        oe(
          "span",
          { class: "al-th" + (Be ? "" : " is-blank") },
          Be ? oe("img", { src: Be, alt: "", decoding: "async" }) : Ce ? oe("img", { src: Ce, alt: "", decoding: "async" }) : null,
          Be ? null : oe("span", { class: "al-n" }, String(Ct + 1)),
          He ? oe("span", { class: "al-eq", html: jt.eq }) : null
        ),
        oe("span", { class: "al-tt" }, Te.title || `#${Te.id}`, Te.explicit ? oe("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), F;
  }
  function U(b) {
    var Be;
    const $ = b.player, N = $.tracks.filter((_e) => !_e.hidden), _ = t.radio(), q = m == null ? void 0 : m.nowPlaying, R = q && $.tracks.some((_e) => String(_e.id) === String(q.tokenId)) ? String(q.tokenId) : null, le = R ? $.tracks.find((_e) => String(_e.id) === R) : null, ue = b.plays === 0 && !b.playsComing, De = !!b.playsComing && !b.plays, I = !!(m != null && m.playing) && !!R, F = m == null ? void 0 : m.heart, de = R ? (Be = _ == null ? void 0 : _.getPosition) == null ? void 0 : Be.call(_) : null;
    R && (I || ((de == null ? void 0 : de.current) ?? 0) > 0.5) && (A = $.id);
    const ye = !!R && A === $.id;
    L && L !== R && (L = null);
    const Ce = ye ? String((q == null ? void 0 : q.cover) || "") : "", Te = !!Ce && L === R, He = [P($, !ue, { song: Te ? "" : Ce, paused: ye && !I, flip: Ce ? () => {
      L = L === R ? null : R, Y();
    } : void 0, flipped: Te })];
    if (He.push(oe(
      "div",
      { class: "al-now" },
      oe(
        "div",
        { class: "al-now-t" },
        oe("div", { class: "al-song" }, le ? le.title || (q == null ? void 0 : q.title) || `#${le.id}` : $.title),
        oe("div", { class: "al-artist" }, le ? le.artist || (q == null ? void 0 : q.artist) || $.subtitle : $.subtitle || "Press play")
      ),
      R ? bn({ class: "al-icon" + (F != null && F.liked ? " is-on" : ""), "aria-label": F != null && F.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(F != null && F.liked)), disabled: !!(F != null && F.pending) || !!(F != null && F.locked) || De, onClick: () => {
        var _e;
        return (_e = _ == null ? void 0 : _.toggleLike) == null ? void 0 : _e.call(_);
      }, html: F != null && F.liked ? jt.heartOn : jt.heart }) : null
    )), ue)
      He.push(oe(
        "div",
        { class: "al-out" },
        oe("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        oe("p", { class: "al-out-t" }, "You've played this album out"),
        oe("p", { class: "al-out-s" }, "Add plays to keep listening."),
        V(b, !0)
      ));
    else {
      const _e = de != null && de.duration ? Math.min(100, de.current / de.duration * 100) : 0;
      He.push(oe(
        "div",
        { class: "al-prog" },
        oe("div", { class: "al-bar" }, oe("i", { style: `width: ${_e}%` })),
        oe("div", { class: "al-times" }, oe("span", {}, Ec((de == null ? void 0 : de.current) || 0)), oe("span", {}, de != null && de.duration ? Ec(de.duration) : "–:––"))
      ));
    }
    return He.push(oe(
      "div",
      { class: "al-ctl" + (ue || De ? " is-off" : "") },
      bn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ue || De, onClick: () => {
        var _e;
        return (_e = _ == null ? void 0 : _.prev) == null ? void 0 : _e.call(_);
      }, html: jt.prev }),
      bn({ class: "al-play", "aria-label": I ? "Pause" : "Play", disabled: ue || De, onClick: () => {
        var _e;
        return (_e = _ == null ? void 0 : _.playPause) == null ? void 0 : _e.call(_);
      }, html: I ? jt.pause : jt.play }),
      bn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ue || De, onClick: () => {
        var _e;
        return (_e = _ == null ? void 0 : _.next) == null ? void 0 : _e.call(_);
      }, html: jt.next })
    )), b.status.length && He.push(oe("div", { class: "al-status", role: "status" }, ...b.status)), He.push(...M(b, { songs: N, current: R, started: ye, own: Ce, out: ue, waiting: De })), He.push(oe("div", { class: "al-grow" })), He.push(bn(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => u(o === "more" ? "" : "more") },
      oe("span", {}, "More ", oe("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      oe("span", { html: jt.down })
    )), He;
  }
  function V(b, $) {
    const N = oe("div", { class: "al-topups" + ($ ? " al-topups--primary" : "") }), _ = $ ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const q of _) {
      const R = b.myPlays !== void 0 && b.myPlays >= q && !b.playsComing && !b.busy;
      N.append(bn({ class: "al-topup", disabled: !R, onClick: () => t.topUp(q) }, $ ? `Add ${q.toLocaleString()} plays` : `+${q.toLocaleString()}`));
    }
    return $ && N.append(bn({ class: "al-link", onClick: () => u("more") }, "Other amounts")), N;
  }
  function ce(b) {
    const $ = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), N = oe(
      "div",
      { class: "al-card" },
      oe("div", { class: "al-card-h" }, oe("b", {}, `Add plays to ${b.player.title}`), oe("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      V(b, !1),
      oe("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : $ ? `Moved from My player · ${la(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !$ && !b.playsComing && b.myPlays !== void 0 ? bn({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), _ = (R, le, ue, De) => bn(
      { class: "al-row", onClick: De },
      oe("span", { class: "al-row-i", html: R }),
      oe("span", { class: "al-row-t" }, oe("b", {}, le), oe("small", {}, ue)),
      oe("span", { class: "al-row-go", html: jt.right })
    ), q = oe(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      _(jt.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, Y();
      }),
      i ? oe("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return oe(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      oe("div", { class: "al-sheet-h" }, oe("b", {}, "More"), bn({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: jt.close })),
      b.mode === "open" ? N : null,
      oe(
        "div",
        { class: "al-rows" },
        _(jt.grid, "My music", "Your albums and the radio", () => u("music")),
        _(jt.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), t.openPlayer();
        }),
        b.canMake ? _(jt.gift, "Albums (admin)", "Make an album and fund copies", () => u("gifts")) : null,
        _(jt.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        q
      )
    );
  }
  function te(b) {
    var ue, De;
    const $ = b.player, N = m == null ? void 0 : m.nowPlaying, _ = N && $.tracks.some((I) => String(I.id) === String(N.tokenId)) ? String(N.tokenId) : null, q = !!(m != null && m.playing) && !!_, R = _ ? (De = (ue = t.radio()) == null ? void 0 : ue.getPosition) == null ? void 0 : De.call(ue) : null;
    _ && (q || ((R == null ? void 0 : R.current) ?? 0) > 0.5) && (A = $.id);
    const le = !!_ && A === $.id;
    return M(b, {
      songs: $.tracks.filter((I) => !I.hidden),
      current: _,
      started: le,
      own: le ? String((N == null ? void 0 : N.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function Y() {
    const b = s;
    if (r) {
      if (!b || b.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      v(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...te(b));
      return;
    }
    if (!b) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    v(), e.hidden = !1;
    const $ = oe(
      "header",
      { class: "al-top" },
      oe("a", { class: "al-brand", href: "/radio" }, gl("al-logo"), "Xtrata ", oe("b", {}, "Music")),
      b.mode === "open" ? bn({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: jt.grid }) : null
    ), N = oe("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? U(b) : E(b));
    e.replaceChildren($, N, ...o === "more" ? [oe("div", { class: "al-scrim", onClick: () => u("") }), ce(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, Y();
        return;
      }
      const $ = !!s;
      s = b, !b && ($ || o) && (o = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, Y();
    },
    sheet: () => o,
    setSheet: u
  };
}
const sL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", oL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${sL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, iL = (e) => oL("source|audio", e), aL = 48 * 1024 * 1024;
function cL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function lL(e) {
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
  async function c(h, d, m = 0) {
    var E, M, U;
    const w = "/inscription/" + h, v = await t(w, { signal: d }), A = (v.headers.get("content-type") || "").toLowerCase();
    if (!v.ok)
      throw await ((E = v.body) == null ? void 0 : E.cancel()), new Error("not found");
    if (A.startsWith("audio/"))
      return await ((M = v.body) == null ? void 0 : M.cancel()), w;
    if (!A.includes("text/html"))
      throw await ((U = v.body) == null ? void 0 : U.cancel()), new Error("not a song");
    const L = await v.text();
    if (L.length > aL) throw new Error("too large");
    const P = L.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (P) return cL(P[1].replace(/&amp;/g, "&"));
    const O = m === 0 ? iL(L) : null;
    if (O) return c(Number(O), d, 1);
    throw new Error("no audio");
  }
  async function u(h) {
    var m;
    a();
    const d = o = new AbortController();
    i({ id: h, state: "loading" });
    try {
      const w = await c(h, d.signal);
      if (d.signal.aborted) {
        w.startsWith("blob:") && URL.revokeObjectURL(w);
        return;
      }
      if (s = w, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (a(), i(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const v = n.id;
          a(), i({ id: v, state: "error" });
        }
      })), (m = e.quiet) == null || m.call(e), r.src = w, await r.play(), d.signal.aborted) return;
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
const uL = ["Earned", "Claim", "Yours"], dL = ["Connect", "Link", "Name"], St = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, hn = (e, t, n, r = !1) => {
  const s = St("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Ig = (e, t, n, r = !1) => {
  const s = hn("al-album", "", n, r), o = St("span", "al-album__t");
  return o.append(St("b", "", e), St("span", "", t)), s.append(o), s;
}, fL = (e) => `No. ${String(e).padStart(4, "0")}`, hL = (e) => e.main ? e.linked ? 2 : 1 : 0;
function pL(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const o = (i) => {
    if (s && r === i.art) return s;
    r = i.art, s = St("div", "aw-art");
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
      const c = St("header", "al-top"), u = St("a", "al-brand");
      u.href = "/radio", u.append(gl("al-logo"), St("span", "", "Xtrata "), St("b", "", "Music")), c.append(u);
      const h = St("div", "al-welcome"), d = i.screen, m = i.tier.name, w = typeof i.name == "string" && i.name ? i.name : null;
      if (h.append(d === "have" ? yl(dL, hL(i)) : yl(uL, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const O = St("div", "tier-disc tier-disc--mid");
        O.dataset.tier = i.tier.id, O.append(St("span", "tier-disc__mark", i.tier.mark)), h.append(O);
      } else if (d !== "have" && d !== "get") {
        const O = o(i);
        O.classList.toggle("aw-art--small", d === "name"), h.append(O);
      }
      const v = d === "ready" ? `Your ${m} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      h.append(St("h1", "", v));
      const A = (O, E = "") => h.append(St("p", E, O)), L = [];
      if (d === "ready")
        A(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), L.push(hn("al-primary", `Claim my ${m} record`, () => i.go("name"), i.busy), St("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), hn("al-link", "Later", i.later));
      else if (d === "name")
        w ? (A(`Your record will carry ${w} beside your player’s address.`), L.push(hn("al-primary", `Claim with ${w}`, () => i.claim("auto"), i.busy), hn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (A("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), L.push(
          Ig("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          Ig("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          hn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (A("Could not check for a .btc name just now.", "ppp-warn"), L.push(hn("al-primary", "Check again", i.refresh, i.busy), hn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), L.push(St("p", "al-hint", "What is on the plaque cannot be changed afterwards."));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (A(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), L.push(hn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? w ? (A(`Found it: ${w}. It goes on your plaque beside your player’s address.`), L.push(hn("al-primary", `Claim with ${w}`, () => i.claim("auto"), i.busy))) : (A(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), L.push(hn("al-primary", "Check again", i.refresh, i.busy))) : (A(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), L.push(hn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (A("Connect the Leather or Xverse wallet that holds your .btc name."), L.push(hn("al-primary", "Connect my wallet", i.connect, i.busy))), L.push(hn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const O = St("ol", "aw-steps"), E = St("li");
        E.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const M = St("a", "", "Open BNS One ↗");
        M.href = "https://bns.one", M.target = "_blank", M.rel = "noopener", E.append(M);
        const U = St("li");
        U.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", St("span", "ppp-addr-full", i.player), i.copyAddress());
        const V = St("li", "", "Check again, and your name shows on the preview before you claim.");
        O.append(E, U, V), h.append(O), L.push(hn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), hn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (A("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const O = St("p", "al-hint"), E = St("a", "", "See the claim on-chain ↗");
          E.href = i.claimLink, E.target = "_blank", E.rel = "noopener", O.append(E), h.append(O);
        }
      } else if (A(`${m} record ${fL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), L.push(hn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const O = St("a", "al-link", "Open it full screen ↗");
        O.href = `/i/${i.inscription}`, O.target = "_blank", O.rel = "noopener", L.push(O);
      }
      if (i.status.length) {
        const O = St("div", "al-status");
        O.setAttribute("role", "status"), O.append(...i.status), h.append(O);
      }
      i.asking ? h.append(St("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...L);
      const P = St("div", "al-body al-body--welcome");
      P.append(h), e.hidden = !1, e.replaceChildren(c, P);
    }
  };
}
const bb = "xtrata.xyz/music/release", gL = "Release music on Xtrata Music; no spending permission", yL = (e) => ({
  domain: rr({ name: dt(bb), version: dt("1"), "chain-id": cn(1) }),
  message: rr({ purpose: dt(gL), artist: dt(e.artist), release: dt(e.hash), issued: cn(e.issued) })
}), wL = "Set the price of my release on Xtrata Music; no spending permission", mL = 100000n, bL = 1000000000n, xL = (e) => e === 0n || e >= mL && e <= bL, SL = (e) => ({
  domain: rr({ name: dt(bb), version: dt("1"), "chain-id": cn(1) }),
  message: rr({ purpose: dt(wL), artist: dt(e.artist), release: dt(e.release), price: cn(BigInt(e.price)), issued: cn(e.issued) })
}), gi = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, vL = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, me = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, fn = (e, t, n = "") => {
  const r = me("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, kc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), Lg = (e) => {
  const t = Cr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function $c(e, t, n = "", r = "") {
  const s = me("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), o = e || n;
  if (o) {
    const i = document.createElement("img");
    i.src = o, i.alt = "", i.decoding = "async", s.append(i);
  }
  return e || s.append(me("span", t)), s;
}
const Uu = (e) => !!e && Kd(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function AL(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, s = "", o = "";
  const i = (() => {
    try {
      const G = new URLSearchParams(location.search).get("release");
      return Kd(G) ? G : null;
    } catch {
      return null;
    }
  })();
  let a = i ? { id: i } : null;
  const c = (G) => "xtrata.radio.releases.shelf.v1:" + G;
  let u = null, h = !1, d = -1 / 0;
  const m = (G, H, Q) => {
    const J = Array.isArray(H) ? H.filter(Uu).map((fe) => ({ ...fe, hidden: !!fe.hidden })) : [];
    u = { for: G, albums: J, fresh: Q }, Q && e.store.set(c(G), JSON.stringify(J));
  }, w = (G) => {
    try {
      m(G, JSON.parse(e.store.get(c(G)) || "[]"), !1);
    } catch {
      m(G, [], !1);
    }
  }, v = () => {
    const G = e.player().address;
    return G && (u == null ? void 0 : u.for) === G ? u.albums : [];
  };
  async function A(G, H = "") {
    const Q = e.player();
    if (!Q.address || !Q.unlocked)
      return o = "Unlock your player first.", e.changed(), !1;
    if (h) return !1;
    h = !0, o = "", e.changed();
    try {
      const J = await e.signShelf(G, H), fe = await e.json("/radio/release/shelf", kc(J));
      return m(Q.address, fe == null ? void 0 : fe.albums, !0), P(fe == null ? void 0 : fe.pay) ? E(Q.address, fe.pay) : G === "add" && E(Q.address, null, H), !0;
    } catch (J) {
      return G !== "list" && (o = J.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const L = (G) => "xtrata.radio.releases.orders.v1:" + G, P = (G) => !!G && /^[0-9a-f]{16}$/.test(G.order) && Kd(G.release) && typeof G.to == "string" && /^\d{1,12}$/.test(G.amount) && typeof G.memo == "string", O = (G) => {
    if (!G) return {};
    try {
      const H = JSON.parse(e.store.get(L(G)) || "{}");
      return H && typeof H == "object" ? Object.fromEntries(Object.entries(H).filter(([, Q]) => P(Q))) : {};
    } catch {
      return {};
    }
  };
  function E(G, H, Q = (H == null ? void 0 : H.release) ?? "") {
    var fe;
    const J = O(G);
    H ? J[H.release] = { ...((fe = J[H.release]) == null ? void 0 : fe.order) === H.order ? J[H.release] : {}, ...H } : delete J[Q], e.store.set(L(G), Object.keys(J).length ? JSON.stringify(J) : null);
  }
  const M = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Map();
  async function V(G, H, Q = !1) {
    var J;
    if (!M.has(H.order)) {
      M.add(H.order), U.set(H.order, e.now()), Q && (o = "", e.changed());
      try {
        const fe = await e.json("/radio/release/paid", kc({ order: H.order, ...H.txid ? { txid: H.txid } : {} }));
        (fe == null ? void 0 : fe.status) === "paid" ? (E(G, null, H.release), ((J = a == null ? void 0 : a.view) == null ? void 0 : J.id) === H.release && (a.view = { ...a.view, added: a.view.added + 1 }), o = "", M.delete(H.order), (u == null ? void 0 : u.for) === G && (u.fresh = !1), e.player().unlocked && await A("list")) : (P(fe) && E(G, { ...H, ...fe }), Q && (fe == null ? void 0 : fe.status) === "pending" && (o = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (fe) {
        /did not go through|does not pay this order/.test(fe.message || "") && E(G, { ...H, txid: void 0, status: "pending" }), (Q || H.txid) && (o = fe.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        M.delete(H.order), e.changed();
      }
    }
  }
  async function ce(G, H, Q) {
    if (!s) {
      s = "Approve the payment in your wallet…", o = "", e.changed();
      try {
        const J = await e.pay(G, Q.to, BigInt(Q.amount), Q.memo), fe = { ...Q, txid: J || void 0, status: "confirming" };
        E(H, fe), s = "", V(H, fe);
      } catch (J) {
        o = /cancel/i.test(J.message || "") ? "Payment cancelled. Nothing was sent." : J.message || "Not paid. Nothing was sent.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  async function te(G) {
    const H = e.player();
    if (!await A("add", G.id) || !H.address) return;
    const Q = O(H.address)[G.id], J = e.main();
    Q && J && await ce(J, H.address, Q);
  }
  function Y() {
    if (r || (r = !0, e.json("/radio/release/config").then((H) => {
      t = (H == null ? void 0 : H.enabled) === !0, n = { copies: t && (H == null ? void 0 : H.copies) === !0, sales: t && (H == null ? void 0 : H.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (a && !a.view && !a.error) {
      const H = a;
      H.error = "", e.json("/radio/release/view?id=" + H.id).then(
        (Q) => {
          Uu(Q) ? (H.view = Q, delete H.error) : H.error = "This release could not be read.";
        },
        (Q) => {
          H.error = Q.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const G = e.player();
    if (G.address) {
      (u == null ? void 0 : u.for) !== G.address && w(G.address), G.unlocked && !(u != null && u.fresh) && !h && e.now() - d > 6e4 && (d = e.now(), A("list"));
      for (const H of Object.values(O(G.address)))
        if ((H.txid || H.status === "confirming") && !M.has(H.order) && e.now() - (U.get(H.order) ?? -1 / 0) > 2e4) {
          const Q = G.address;
          V(Q, H).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const b = () => t ? v().filter((G) => !G.hidden) : [];
  function $(G, H) {
    const Q = me("ol", "", "ppp-rel-songs");
    return G.forEach((J, fe) => {
      const lt = me("li");
      lt.append($c(e.art.song(J.id, !0) || "", String(fe + 1), H), me("span", J.title)), Q.append(lt);
    }), Q;
  }
  function N() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [me("p", `♫ ${a.error}`, "ppp-warn")] : [me("p", "♫ Opening this release…", "ppp-mute")];
    const G = a.view, H = me("div", "", "ppp-release-in"), Q = me("p", "", "ppp-release-in__h"), J = BigInt(/^\d{1,12}$/.test(G.price ?? "") ? G.price : "0");
    Q.append(me("b", G.title), me("span", `${G.subtitle || e.who(G.artist)} · ${Lg(G)}${J > 0n ? ` · ${gi(J)} STX` : ""}`));
    const fe = Cr(G), lt = e.art.cover(G.cover) || (G.cover ? "" : fe[0] && e.art.song(fe[0].id, !0) || ""), Ie = me("div", "", "ppp-rel-top");
    Ie.append($c(lt, "💿", "", "is-cover"), Q), H.append(Ie, $(fe.map((Ae) => ({ id: Ae.id, title: Ae.title || `#${Ae.id}` })), e.art.cover(G.cover))), H.append(me("p", `Released by ${e.who(G.artist)}. ${G.added === 1 ? "1 player has" : `${G.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const Ue = e.player(), ht = v().find((Ae) => Ae.id === G.id), Pe = me("div", "", "ppp-award__row");
    if (ht)
      H.append(me("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), Pe.append(fn("Play it", () => e.open(G), "primary"));
    else if (!Ue.address) H.append(me("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!Ue.unlocked) H.append(me("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (J > 0n) {
      const Ae = O(Ue.address)[G.id], ze = e.main(), Fe = `${gi((Ae == null ? void 0 : Ae.amount) ?? J)} STX`;
      if (Ae != null && Ae.txid || (Ae == null ? void 0 : Ae.status) === "confirming") {
        H.append(me("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const ve = fn("Check now", () => void V(Ue.address, Ae, !0));
        ve.disabled = M.has(Ae.order), Pe.append(ve);
      } else if (H.append(me("p", `This album costs ${Fe}. You pay ${e.who(G.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Ae) H.append(me("p", "Buying is paused right now.", "ppp-warn"));
      else if (Ae) {
        if (ze) {
          const En = fn(`Pay ${Fe} from my wallet`, () => void ce(ze, Ue.address, Ae), "primary");
          En.disabled = !!s, Pe.append(En);
        } else H.append(me("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const ve = me("div", "", "ppp-rel-pay"), Tt = (En, wt, tn) => {
          const Bn = me("p");
          return Bn.append(me("span", En), me("code", wt), Jn(`order-${tn}:${Ae.order}`, "Copy", () => wt, "tiny", e.changed)), Bn;
        };
        ve.append(Tt("Send", gi(Ae.amount) + " STX", "amount"), Tt("To", Ae.to, "to"), Tt("Memo", Ae.memo, "memo")), H.append(ve, me("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const yn = fn("I have paid: check", () => void V(Ue.address, Ae, !0));
        yn.disabled = M.has(Ae.order), Pe.append(yn);
      } else {
        const ve = fn(`Buy · ${Fe}`, () => void te(G), "primary");
        ve.disabled = h || !!s, Pe.append(ve);
      }
    } else {
      H.append(me("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Ae = fn("Add to my player", () => {
        A("add", G.id).then((ze) => {
          ze && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      Ae.disabled = h, Pe.append(Ae);
    }
    return Pe.append(fn("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), H.append(Pe), s && H.append(me("p", s, "ppp-cyan")), o && H.append(me("p", o, "ppp-warn")), [H];
  }
  let _ = !1;
  function q() {
    const G = t ? v() : [];
    if (!G.length) return null;
    const H = me("details", "", "ppp-release-manage");
    H.open = _, H.ontoggle = () => {
      _ = H.open;
    };
    const Q = G.filter((fe) => fe.hidden).length;
    H.append(me("summary", `Albums I added (${G.length}${Q ? `, ${Q} hidden` : ""})`));
    const J = e.player().unlocked;
    J || H.append(me("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const fe of G) {
      const lt = me("div", "", "ppp-release-row" + (fe.hidden ? " is-hidden" : "")), Ie = me("span", "", "ppp-release-row__t");
      Ie.append(me("b", fe.title), me("span", `${fe.subtitle || e.who(fe.artist)}${fe.hidden ? " · hidden" : ""}`));
      const Ue = fn(fe.hidden ? "Show" : "Hide", () => void A(fe.hidden ? "show" : "hide", fe.id), "tiny"), ht = fn("Remove", () => void A("remove", fe.id), "tiny");
      Ue.disabled = ht.disabled = !J || h, lt.append(Ie, Ue, ht), H.append(lt);
    }
    return H.append(me("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), o && !a && H.append(me("p", o, "ppp-warn")), H;
  }
  let R = null, le = [], ue = null;
  const De = me("input");
  De.maxLength = 60, De.placeholder = "Title of the single, EP or album", De.setAttribute("aria-label", "Release title");
  const I = me("input");
  I.maxLength = 80, I.placeholder = "Artist name shown under the title", I.setAttribute("aria-label", "Artist name");
  const F = me("input");
  F.inputMode = "numeric", F.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", F.setAttribute("aria-label", "Cover inscription number");
  const de = me("input");
  de.inputMode = "decimal", de.placeholder = "Price in STX, e.g. 2 (0 makes it free)", de.setAttribute("aria-label", "Price in STX");
  let ye = null;
  const Ce = (G, H, Q = "") => {
    ye = (ye == null ? void 0 : ye.id) === G && ye.what === H ? null : { id: G, what: H }, (ye == null ? void 0 : ye.what) === "price" && (de.value = Q), o = "", e.changed();
  };
  async function Te(G, H) {
    if (s) return;
    const Q = vL(de.value);
    if (Q === null || !xL(Q)) {
      o = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", o = "", e.changed();
    try {
      const J = { artist: G, release: H.id, price: Q.toString(), issued: e.now() }, fe = await e.sign(G, SL(J));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", kc({ request: J, signature: fe })), o = Q > 0n ? `Price set ✓ “${H.title}” now costs ${gi(Q)} STX, paid straight to this wallet.` : `“${H.title}” is free again ✓`, ye = null, Be(G, !0);
    } catch (J) {
      o = J.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const Ct = (G) => `${location.origin}${location.pathname}?release=${G}`;
  function He(G) {
    R = { for: G, loading: !0 }, le = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(G)).then(
      (H) => {
        const Q = Array.isArray(H == null ? void 0 : H.songs) ? H.songs.filter((J) => Number.isSafeInteger(J == null ? void 0 : J.id) && typeof J.title == "string") : null;
        R = Q ? { for: G, songs: Q, more: !!H.more } : { for: G, error: "Your songs could not be read right now." };
      },
      (H) => {
        R = { for: G, error: H.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Be(G, H = !1) {
    !H && (ue == null ? void 0 : ue.for) === G && e.now() - ue.at < 6e4 || (ue = { for: G, list: (ue == null ? void 0 : ue.for) === G ? ue.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(G)).then((Q) => {
      Array.isArray(Q == null ? void 0 : Q.releases) && (ue = { for: G, list: Q.releases.filter(Uu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function _e(G) {
    if (!s) {
      s = "Checking your release…", o = "", e.changed();
      try {
        const H = F.value.trim().replace(/^#/, ""), Q = gb({ title: De.value.trim(), subtitle: I.value.trim(), tracks: [...le], cover: H ? Number(H) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const J = { artist: G, hash: yb(Q), issued: e.now() }, fe = await e.sign(G, yL(J));
        s = "Releasing…", e.changed();
        const lt = await e.json("/radio/release/create", kc({ definition: Q, request: J, signature: fe }));
        o = `${lt.existing ? "Already released" : "Released"} ✓ “${lt.title}”. Its link is below.`, le = [], De.value = "", F.value = "", e.audition.stop(), Be(G, !0);
      } catch (H) {
        o = H.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const en = () => {
    queueMicrotask(() => e.audition.stop());
  }, Kt = /* @__PURE__ */ new Set();
  function Qe(G) {
    const H = le.map((ve) => G.find((Tt) => Tt.id === ve)).filter((ve) => !!ve), Q = F.value.trim().replace(/^#/, ""), J = /^\d{1,9}$/.test(Q) ? Number(Q) : null, fe = e.art.cover(J), lt = H[0] ? e.art.song(H[0].id, !0) : null, Ie = me("div", "", "ppp-release-preview");
    Ie.append(me("p", "How it will look", "ppp-featured__h"));
    const Ue = me("p", "", "ppp-release-in__h"), ht = me("b", De.value.trim() || "Untitled"), Pe = me("span", `${I.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`);
    Ue.append(ht, Pe);
    const Ae = me("div", "", "ppp-rel-top");
    Ae.append($c(J ? fe : lt || "", "💿", "", "is-cover"), Ue), Ie.append(Ae, $(H.map((ve) => ({ id: ve.id, title: ve.title })), fe));
    const ze = H.filter((ve) => e.art.song(ve.id, !0) === null).length, Fe = [];
    J && !fe && Fe.push(`Looking for an image in #${J}… If none appears, that inscription is not a picture.`), ze && Fe.push(`Finding artwork for ${ze} ${ze === 1 ? "song" : "songs"}…`), !ze && H.some((ve) => e.art.song(ve.id, !1) === "") && Fe.push(`A numbered square is a song with no artwork of its own${fe ? ": it shows the cover, dimmed" : ""}.`);
    for (const ve of Fe) Ie.append(me("p", ve, "ppp-mute"));
    return De.oninput = () => {
      ht.textContent = De.value.trim() || "Untitled";
    }, I.oninput = () => {
      Pe.textContent = `${I.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`;
    }, F.onchange = () => e.changed(), Ie;
  }
  function Jt() {
    var Q;
    const G = e.main();
    if (!t || !G)
      return R && (R = null, le = [], en()), null;
    const H = [me("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (R && R.for !== G && (R = null, le = [], Kt.clear(), en()), !R) H.push(fn("Show the songs in my wallet", () => He(G), "primary"));
    else if (R.loading) H.push(me("p", "Reading your wallet…", "ppp-cyan"));
    else if (R.error) H.push(me("p", R.error, "ppp-warn"), fn("Try again", () => He(G)));
    else if (!R.songs.length) H.push(me("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      H.push(me("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const J = me("div", "", "ppp-release-songs");
      for (const Ie of R.songs) {
        const Ue = le.indexOf(Ie.id), ht = me("div", "", "ppp-release-song" + (Ue >= 0 ? " is-on" : "")), Pe = e.audition.state(Ie.id);
        Pe !== "idle" && Kt.add(Ie.id);
        const Ae = fn(Pe === "playing" ? "❚❚" : Pe === "loading" ? "…" : "▶", () => e.audition.toggle(Ie.id), "ppp-release-hear" + (Pe === "playing" ? " is-on" : ""));
        Ae.setAttribute("aria-label", Pe === "playing" ? `Stop ${Ie.title}` : `Listen to ${Ie.title}`), Ae.title = Pe === "error" ? "This song could not be played just now" : Pe === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const ze = e.art.song(Ie.id, Ue >= 0 || Kt.has(Ie.id)), Fe = fn("", () => {
          le = Ue >= 0 ? le.filter((ve) => ve !== Ie.id) : [...le, Ie.id], e.changed();
        }, "ppp-release-pick");
        Fe.setAttribute("aria-pressed", String(Ue >= 0)), Fe.append(me("i", Ue >= 0 ? String(Ue + 1) : "+"), me("b", Ie.title), me("span", Pe === "error" ? "could not play" : `${Ie.artist ? Ie.artist + " · " : ""}#${Ie.id}`, Pe === "error" ? "ppp-warn" : "")), ht.append(Ae, $c(ze || "", ze === "" ? "♪" : "", ""), Fe), J.append(ht);
      }
      H.push(J), R.more && H.push(me("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !I.value && le.length && (I.value = ((Q = R.songs.find((Ie) => Ie.id === le[0])) == null ? void 0 : Q.artist) || "");
      const fe = le.length === 0 ? "release" : le.length === 1 ? "single" : le.length <= 6 ? "EP" : "album", lt = fn(le.length ? `Sign and release this ${fe} · ${le.length} ${le.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void _e(G), "primary");
      lt.disabled = !le.length || !!s, H.push(De, I, F), le.length && H.push(Qe(R.songs)), H.push(lt);
    }
    if (s && H.push(me("p", s, "ppp-cyan")), o && !a && H.push(me("p", o, /✓/.test(o) ? "ppp-ok" : "ppp-warn")), Be(G), (ue == null ? void 0 : ue.for) === G && ue.list.length) {
      H.push(me("p", "Your releases", "ppp-featured__h"));
      for (const J of ue.list) {
        const fe = me("div", "", "ppp-release-row"), lt = me("span", "", "ppp-release-row__t"), Ie = BigInt(/^\d{1,12}$/.test(J.price ?? "") ? J.price : "0"), Ue = Ie > 0n ? ` · ${gi(Ie)} STX · ${(J.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (lt.append(me("b", J.title), me("span", `${Lg(J)} · added by ${J.added.toLocaleString()} ${J.added === 1 ? "player" : "players"}${Ue}`)), fe.append(lt, Jn("release-link:" + J.id, "Copy link", () => Ct(J.id), "tiny", e.changed)), n.sales) {
          const Pe = fn("Price", () => Ce(J.id, "price", Ie > 0n ? gi(Ie) : ""), "tiny");
          Pe.setAttribute("aria-expanded", String((ye == null ? void 0 : ye.id) === J.id && ye.what === "price")), fe.append(Pe);
        }
        if (n.copies && e.copies) {
          const Pe = fn("Send copies", () => Ce(J.id, "copies"), "tiny");
          Pe.setAttribute("aria-expanded", String((ye == null ? void 0 : ye.id) === J.id && ye.what === "copies")), fe.append(Pe);
        }
        if (H.push(fe), (ye == null ? void 0 : ye.id) !== J.id) continue;
        const ht = me("div", "", "ppp-release-way");
        if (ye.what === "price" && n.sales) {
          const Pe = fn("Sign this price", () => void Te(G, J), "primary");
          Pe.disabled = !!s, ht.append(
            me("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            de,
            Pe
          );
        } else ye.what === "copies" && n.copies && e.copies && ht.append(...e.copies(G, { id: J.id, title: J.title }));
        ht.childNodes.length && H.push(ht);
      }
    }
    return H;
  }
  return { sync: Y, albums: b, banner: N, manage: q, fold: Jt, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(R != null && R.songs) && !!e.main()), enabled: () => t === !0 };
}
const Ou = "xtrata.radio.replace.v1", pn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Xs = (e, t, n = "") => {
  const r = pn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Cg = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function EL(e) {
  let n = (() => {
    try {
      const v = JSON.parse(e.store.get(Ou) || "null");
      return v && typeof v.old == "string" ? v : null;
    } catch {
      return null;
    }
  })();
  const r = (v) => {
    n = v, e.store.set(Ou, v ? JSON.stringify(v) : null), e.changed();
  };
  let s = null, o = !1, i = "", a = !1;
  function c(v) {
    o || (s == null ? void 0 : s.for) === v && (s.n !== null || Date.now() - s.at < 3e4) || (o = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(v) + "&limit=1").then(
      (A) => {
        s = { for: v, n: Number.isSafeInteger(A == null ? void 0 : A.total) ? A.total : null, at: Date.now() };
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
  const m = () => {
    i = "", r(null);
  };
  function w(v) {
    var U;
    if (!n) return null;
    n.removed && v.listening === n.old && (n = { old: n.old }, e.store.set(Ou, JSON.stringify(n)));
    const A = [], L = (V, ce) => A.push(pn("p", `Replacing your old player · step ${V} of 3 · ${ce}`, "ppp-cyan")), P = () => Xs("Stop · keep my old player", m, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return m(), null;
      A.push(pn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? A.push(pn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), Xs("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && A.push(pn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const V = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return A.push(pn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${V}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), A.push(Xs("Done", m, "quiet")), A;
    }
    if (!v.listening || n.removed)
      return n.removed ? (L(3, "claim your new player"), A.push(pn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), A.push(Xs("Hide this", m, "quiet")), A) : null;
    if (c(n.old), v.step === "locked" || v.step === "intro")
      return L(1, "empty it"), A.push(pn("p", "Unlock your old player so it can be emptied."), Xs("Unlock my old player", e.unlock, "primary"), P()), A;
    const O = e.keepBoth(v), E = (V) => (L(1, "empty it"), A.push(pn("p", V, "ppp-warn")), O && A.push(Xs("Keep both players instead", () => {
      m(), O();
    }, "primary")), A.push(P()), A);
    if (v.slot !== 0) return E("An album is open. Go back to your own player first.");
    if ((s == null ? void 0 : s.for) !== n.old)
      return L(1, "empty it"), A.push(pn("p", "Checking what this player has…", "ppp-mute"), P()), A;
    if (s.n === null) return E("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (s.n > 0) return E(`This player has ${s.n === 1 ? "an album" : `${s.n} albums`} of its own. Replacing it would leave ${s.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((U = v.award) == null ? void 0 : U.state) === "claimed" && v.award.holds !== !1) return E("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((V) => ["prepared", "signed", "unknown", "pending"].includes(String(V.status))))
      return L(1, "empty it"), A.push(pn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), P()), A;
    if (v.balance === void 0)
      return L(1, "empty it"), A.push(pn("p", "Checking what it holds…", "ppp-mute"), P()), A;
    if (v.balance > e.dust(v))
      return L(1, "empty it"), A.push(pn("p", `It holds ${Cg(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? A.push(Xs("Send everything back", e.returnAll, "primary")) : A.push(pn("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), A.push(P()), A;
    L(2, "remove it from this device"), A.push(pn("p", v.balance > 0n ? `Empty ✓ (the ${Cg(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), A.push(pn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const M = Xs(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (V) => {
        i = /cancel/i.test((V == null ? void 0 : V.message) || "") ? "" : (V == null ? void 0 : V.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return M.disabled = a || !!v.busy, A.push(M, P()), i && A.push(pn("p", i, "ppp-warn")), A;
  }
  return { active: u, claiming: h, start: d, stop: m, lines: w };
}
const kL = [
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
function $L(e) {
  for (const [t, n] of kL) if (n.test(e)) return t;
  return null;
}
const xb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), Sb = (e) => /Android/.test(e);
function IL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : xb(t) ? "x-safari-" + n.href : Sb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const LL = (e) => xb(e) ? "Safari" : Sb(e) ? "Chrome" : "your browser", yi = "Xtrata Music Wallet", CL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Tg(e, t = (n) => n) {
  var o, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((o = e.gate) == null ? void 0 : o.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: yi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = e.standIn === c && CL.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${yi} · ${t(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: yi, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: yi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: yi, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: yi, detail: "Open on this device." });
    }
  return r;
}
const Hu = "xtrata.radio.novice", vb = "xtrata.radio.novice.previewed.v1", Bg = 6 * 6e4;
function TL(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(Hu, r), n = r;
    else {
      if (r === "0")
        return t.set(Hu, null), { on: !1, preview: !1 };
      n = t.get(Hu);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const BL = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Mg = (e) => BL.test(e ?? ""), ML = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, NL = {
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
}, _L = (e, t) => NL[e] ?? t;
function PL(e, t) {
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
const UL = "Make your player once, with Face ID or your fingerprint, and the music starts.", OL = "Checking your player…", Yd = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Ab(e) {
  try {
    const t = JSON.parse(e.get(vb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function HL(e, t) {
  const n = Ab(e).filter((r) => r !== t);
  n.push(t), e.set(vb, JSON.stringify(n.slice(-50)));
}
function Du(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...Yd(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : Yd();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > Bg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > Bg ? { ...e, phase: "done" } : e;
  }
}
const Ic = (e) => e.phase === "open" || e.phase === "playing";
function DL(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const FL = [100, 250, 500, 1e3], jL = (e, t = Mr) => BigInt(e) * vn(t);
function RL(e, t = Mr, n = 0n) {
  const r = ls - e - n;
  return r > 0n ? Number(r / vn(t)) : 0;
}
function zL(e, t = Mr, n = 0n) {
  const r = e === void 0 ? 0 : RL(e, t, n);
  return FL.map((s) => ({ plays: s, stx: jL(s, t), fits: e !== void 0 && s <= r }));
}
const GL = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, KL = (e) => GL[e.unit](e.amount), Ot = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Hc = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function VL(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${Hc(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${Hc(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${Hc(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function XL(e) {
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
    var w;
    if (!t) return;
    const i = e.input();
    if (!i) {
      t.close();
      return;
    }
    const a = zL(i.balance, i.fee, i.incoming);
    s(a);
    const c = DL(i.switches);
    (w = c.find((v) => v.id === r)) != null && w.on || (r = "stx");
    const u = [], h = Ot("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Ot("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${Hc(i.playsLeft, "play", "plays")} left.`));
    const d = VL(i.done);
    if (d && u.push(Ot("p", "ppp-restock__done", d)), i.arriving)
      u.push(Ot("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      u.push(Ot("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((v) => v.fits))
      u.push(Ot("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const v = Ot("div", "ppp-restock__packs");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How many plays");
      for (const P of a) {
        const O = Ot("button", "ppp-restock__pack" + (P.plays === n ? " is-on" : ""));
        O.type = "button", O.disabled = !P.fits, O.setAttribute("aria-pressed", String(P.plays === n)), O.append(Ot("b", "", P.plays.toLocaleString()), Ot("span", "", "plays")), O.onclick = () => {
          n = P.plays, o();
        }, v.append(O);
      }
      u.push(v);
      const A = Ot("div", "ppp-restock__ways");
      A.setAttribute("role", "group"), A.setAttribute("aria-label", "How to pay");
      for (const P of c) {
        const O = Ot("button", "ppp-restock__way" + (P.id === r ? " is-on" : ""));
        O.type = "button", O.disabled = !P.on, O.setAttribute("aria-pressed", String(P.id === r)), O.append(Ot("b", "", P.label), Ot("span", "", P.on ? P.blurb : "Soon")), O.onclick = () => {
          r = P.id, o();
        }, A.append(O);
      }
      u.push(A);
      const L = a.find((P) => P.plays === n);
      if (L && r === "stx") {
        const P = Ot("div", "ppp-restock__pay"), O = KL({ unit: "microSTX", amount: L.stx }), E = Ot("p", "ppp-restock__amount");
        E.append("Send ", Ot("b", "", O), " to your player:"), P.append(E, Ot("p", "ppp-addr-full ppp-restock__addr", i.address));
        const M = Ot("div", "ppp-restock__row");
        M.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => Er(L.stx), "")), P.append(M), P.append(Ot("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(P);
      }
    }
    u.push(Ot("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const m = Ot("button", "quiet ppp-connect__cancel", "Close");
    m.type = "button", m.onclick = () => t == null ? void 0 : t.close(), u.push(m), t.replaceChildren(...u);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Ot("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
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
const ds = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), YL = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function qL(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = t(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: YL(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function WL(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = ds(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function ZL(e, t, n = "", r = 60) {
  const s = ds(t).split(/\s+/).filter(Boolean), o = ds(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = ds(a.artist), u = ds(a.title), h = String(a.id);
    if (o && c !== o) continue;
    let d = 0, m = !0;
    for (const w of s) {
      const v = w.replace(/^#/, "");
      if (u.includes(w)) d += u.startsWith(w) ? 0 : 1;
      else if (/^\d+$/.test(v) && h === v) d += 0;
      else if (c.includes(w)) d += 2;
      else if (/^\d+$/.test(v) && h.startsWith(v)) d += 3;
      else {
        m = !1;
        break;
      }
    }
    m && i.push({ s: a, rank: d });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const lr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Ng = 12;
function JL(e, t) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const a = lr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = lr("div", "hint"), u = lr("div", "find-artists"), h = lr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = lr("div", "likesTools");
  d.append(a), e.replaceChildren(d, c, u, h), a.oninput = () => {
    s = a.value, w();
  };
  function m() {
    r === "loading" || r === "ready" || (r = "loading", w(), t.load().then((v) => {
      n = v, r = "ready", w();
    }, () => {
      r = "failed", w();
    }));
  }
  function w() {
    const v = t.locked();
    if (a.disabled = v, v) {
      c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", u.replaceChildren(), h.replaceChildren();
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
      const M = lr("button", "", "Try again");
      M.type = "button", M.onclick = () => {
        r = "idle", m();
      }, c.append(M), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const A = WL(n), L = i ? A : A.slice(0, Ng), P = (M, U, V, ce = "") => {
      const te = lr("button", "find-chip" + (U ? " is-on" : ""), M);
      return te.type = "button", te.setAttribute("aria-pressed", String(U)), ce && (te.title = ce), te.onclick = V, te;
    };
    u.replaceChildren(
      ...L.map((M) => P(`${M.name} · ${M.songs}`, ds(M.name) === ds(o), () => {
        o = ds(M.name) === ds(o) ? "" : M.name, w();
      }, `Show ${M.name}’s ${M.songs === 1 ? "song" : `${M.songs} songs`}`)),
      ...A.length > Ng ? [P(i ? "Fewer artists" : `All ${A.length} artists`, !1, () => {
        i = !i, w();
      })] : []
    );
    const O = ZL(n, s, o), E = t.current();
    h.replaceChildren(...O.songs.map((M) => {
      var ce, te;
      const U = lr("li", "lrow" + (M.id === E ? " now" : "")), V = lr("button", "lt", M.title);
      if (V.type = "button", V.title = `Play “${M.title}”${M.artist ? ` by ${M.artist}` : ""}`, V.onclick = () => t.play(M.id), (ce = t.explicit) != null && ce.call(t, M.id)) {
        const Y = lr("span", "exp", "E");
        Y.title = "Explicit lyrics: only plays when you choose it", V.append(" ", Y);
      }
      if ((te = t.liked) != null && te.call(t, M.id)) {
        const Y = lr("span", "find-liked", "♥");
        Y.title = "You like this song", Y.setAttribute("role", "img"), Y.setAttribute("aria-label", "Liked"), U.append(V, Y);
      } else U.append(V);
      return U.append(lr("span", "find-by", `${M.artist ? M.artist + " · " : ""}#${M.id}`)), U;
    })), c.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${A.length.toLocaleString()} artists. Search, or pick an artist.` : O.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : O.total > O.songs.length ? `Showing ${O.songs.length} of ${O.total.toLocaleString()}. Type more to narrow it down.` : `${O.total} ${O.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: m, refresh: w };
}
const _g = (e, t, n) => uf(hf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), Pg = document.getElementById("ppp");
Pg && QL(Pg);
function QL(e) {
  var ee;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Zb(), s = (l) => e.querySelector(l), o = s(".ppp-frame");
  let i = null;
  const a = async (l, p) => {
    const g = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${g.status}).`);
    return f;
  }, c = I5({
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
      const p = new Promise((X, ne) => {
        i.addEventListener("load", () => X(), { once: !0 }), setTimeout(() => ne(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", o.replaceChildren(i), await p;
      const g = new Rb({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), T = (X, ne) => f.has(X) ? g.request(X, ne) : Promise.race([
        g.request(X, ne),
        new Promise((se, Ee) => setTimeout(() => Ee(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await T("listening.status"), { request: T };
    },
    chain: {
      verify: i5,
      balance: c5,
      account: a5,
      owner: l5,
      broadcast: u5,
      transaction: d5,
      confirmedNonce: async (l) => {
        const p = await to(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => ku({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, g) => new Promise((f, T) => X0({
      recipient: p,
      amount: g.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new Fu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (X) => f(X.txId || ""),
      onCancel: () => T(new Error("Deposit cancelled. Nothing was sent.")),
      onError: T
    })),
    validate: f5,
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
    changed: () => nt(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var p, g;
      return v.funder(l, () => m5(l, to), !!((g = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && g.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const p = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), g = p == null ? void 0 : p.gift;
      if (!g) return null;
      if (typeof g.returnTo != "string" || typeof g.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: g.returnTo, from: typeof g.from == "string" ? g.from : null, source: String(g.source ?? ""), amount: String(g.amount ?? "0"), treasury: g.treasury, state: g.state === "sending" ? "sending" : "arrived", player: g.player ?? null };
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
    history: (l, p) => S5(l, (g) => to(g), p),
    likesChanged: () => {
      var l, p;
      (p = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || p.call(l);
    },
    likeState: async (l, p) => {
      const g = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(p) })), f = Array.isArray(g == null ? void 0 : g.rows) ? g.rows.find((T) => (T == null ? void 0 : T.id) === p) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((T) => typeof T == "string") : f.liked ? [l] : [] };
    },
    likeSent: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: p } })),
    nameOf: (l) => Se(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), u = (l, p, g, f, T, X) => new Promise((ne, se) => X0({
    recipient: f,
    amount: T.toString(),
    memo: X,
    stxAddress: g,
    network: new Fu(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Ee) => ne(Ee.txId || ""),
    onCancel: () => se(new Error(p)),
    onError: se
  })), h = (l) => v.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, d = (l) => h(l) && l.canForget ? () => {
    m.start(l), nt(c.snapshot());
  } : null, m = EL({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => be(l),
    changed: () => nt(c.snapshot()),
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
  }), w = () => ({ quick: !!v.incomingStarter(), ...m.claiming() ? { another: !0 } : {} }), v = _I({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, p, g, f) => u("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, p, g, f),
    sign: (l, p) => ku({ ...p, network: "mainnet", stxAddress: l }),
    giftSent: (l, p) => c.giftSent(l, p),
    claiming: (l) => c.giftClaiming(l),
    batchDays: () => {
      var l, p;
      return (p = (l = c.snapshot().gate) == null ? void 0 : l.gifts) == null ? void 0 : p.batchDays;
    },
    claimNew: (l) => h(l),
    replaceOld: (l) => d(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, p, g, f) => {
      A.invalidate(), await c.albumArriving(l, p, g, f);
    } },
    who: (l) => be(l),
    changed: () => nt(c.snapshot()),
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
  }), A = GI({
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
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => nt(c.snapshot())
  }), L = {
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
  }, P = TL(location.search, L);
  P.on && (document.documentElement.dataset.novice = P.preview ? "preview" : "1");
  const O = (l) => P.on && l.solo, E = P.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), M = E ? document.getElementById("album") : null, U = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, V = M ? $g(M, U) : null, ce = AL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, p) => ku({ ...p, network: "mainnet", stxAddress: l }),
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
    open: (l) => Fe(l, !0),
    who: (l) => be(l),
    art: { song: (l, p) => p && ph(String(l)) || Ag(String(l)), cover: (l) => Oc(l) },
    audition: lL({
      changed: () => nt(c.snapshot()),
      quiet: () => {
        var p;
        const l = window.XtrataRadio;
        try {
          (p = l == null ? void 0 : l.getState) != null && p.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => nt(c.snapshot()),
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
  }), te = () => {
    const l = new Set(Ie.map((p) => p.id));
    return [...Ie, ...ce.albums().filter((p) => !l.has(p.id))];
  }, Y = M ? pL(M) : null, b = "xtrata.radio.award.later.v1";
  let $ = "ready", N = !1, _ = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(b) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), q = !1;
  const R = "xtrata.radio.tier.v1";
  let le = (() => {
    const l = L.get(R);
    return Ac(l) ? ko(l) : null;
  })();
  const ue = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function De(l) {
    var T;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let X = null;
      try {
        X = l.gift && !l.gift.player && l.gift.drop === "players" ? $I(BigInt(l.gift.amount)) : null;
      } catch {
        X = null;
      }
      ((T = l.award) == null ? void 0 : T.state) === "claimed" && l.award.holds === !1 && (X = null), ((X == null ? void 0 : X.id) ?? null) !== ((le == null ? void 0 : le.id) ?? null) && (le = X, L.set(R, X ? X.id : null));
    }
    const p = document.documentElement;
    le ? p.dataset.tier = le.id : delete p.dataset.tier;
    const g = document.querySelector("#ppp .ppp-head h3");
    if (!g) return;
    let f = g.querySelector(".ppp-tier");
    if (!le) {
      f == null || f.remove();
      return;
    }
    f || (f = y("span", "", "ppp-tier"), g.append(f)), f.dataset.tier = le.id, f.textContent = `${le.mark} ${le.name.toUpperCase()} PLAYER`, f.title = `A ${le.name} player from the Xtrata Music giveaway`;
  }
  const I = P.on && M ? QI(M) : null, F = Date.now();
  let de = !1, ye = null, Ce = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const Te = () => {
    Ce = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    nt(c.snapshot());
  }, Ct = (l, p) => {
    var T;
    if (!I || p || Ce) return null;
    if (!l.gate || l.step === "loading" || (de = !0), !de) return Date.now() - F < 1e4 ? "checking" : null;
    if (!O(l) || m.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((T = l.gift) != null && T.player) && !l.entries.some((X) => X.kind === "play");
    return l.step === "fund" && f ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (ye === "arriving" || ye === "landed") ? "landed" : l.step === "loading" && ye !== "checking" ? ye : null;
  };
  let He = !1;
  function Be(l, p, g = [], f) {
    if (!I) return;
    const T = f !== void 0 ? f : Ct(l, p);
    if (ye = T, delete document.documentElement.dataset.noviceBoot, !T) {
      I.render(null, p);
      return;
    }
    const X = [...g];
    T === "arriving" && l.arrival && X.push(Qr(l.arrival)), l.step === "unsupported" ? X.push(y("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && X.push(y("p", l.error, "ppp-warn"));
    const ne = T === "gift" ? v.incomingStarter() : null;
    ne && !He && l.step === "intro" && !l.busy && !l.armed && !l.error && !Me && (He = !0, c.create({ quick: !0, ...m.claiming() ? { another: !0 } : {} })), I.render({
      mode: T,
      status: X,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !Me,
      plays: ne ? ne.plays : T === "landed" ? l.playsLeft : null,
      from: (ne == null ? void 0 : ne.from) ?? null,
      tier: le,
      mystery: ue,
      albums: T === "landed" ? Ie.map((se) => ({ title: se.title, by: se.subtitle, cover: Oc(se.cover), run: () => {
        Te(), Fe(se, !0);
      } })) : [],
      claimNew: T === "back" ? h(l) : null,
      replaceOld: T === "back" ? d(l) : null,
      start: () => void c.create(w()),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Kt(),
      full: () => {
        var S, B, D;
        const se = window.XtrataRadio, Ee = T === "landed" && !((B = (S = se == null ? void 0 : se.getState) == null ? void 0 : S.call(se)) != null && B.playing);
        Te(), Ee && ((D = se == null ? void 0 : se.playPause) == null || D.call(se));
      }
    });
  }
  I && setTimeout(() => {
    de || nt(c.snapshot());
  }, 10100), dh(() => {
    (I != null && I.showing() || document.documentElement.dataset.asking || ce.wantsArt()) && nt(c.snapshot());
  });
  const en = XL({
    input: () => {
      var T, X, ne, se;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (T = l.likeFunds) == null ? void 0 : T.balance };
      if (!p.address) return null;
      const g = l.slot === 0 ? l.entries : [], f = g.filter((Ee) => Ee.kind === "play" && Ee.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : Qt(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((X = l.gate) == null ? void 0 : X.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((ne = l.gate) == null ? void 0 : ne.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Ee) => Ee.recipient)).size, likes: g.filter((Ee) => Ee.kind === "like" && Ee.status === "confirmed" && Ee.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((se = l.likeFunds) != null && se.pending)
      };
    },
    copyButton: (l, p, g, f) => Jn(l, p, g, f, () => {
      nt(c.snapshot());
    })
  }), Kt = () => {
    if (!c.snapshot().unproven) {
      en.open();
      return;
    }
    c.prove().then((l) => {
      l && en.open();
    });
  }, Qe = document.getElementById("albumList"), Jt = Qe ? $g(Qe, U, { list: !0 }) : null, yt = "xtrata.radio.album.last.v1", G = () => {
    try {
      const l = JSON.parse(localStorage.getItem(yt) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let H = "";
  const Q = (l) => {
    const p = JSON.stringify(l);
    if (p !== H) {
      H = p;
      try {
        localStorage.setItem(yt, p);
      } catch {
      }
    }
  };
  let J = null;
  window.XtrataRadioLikeHandler = (l) => {
    var g;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (g = c.snapshot().likeFunds) != null && g.album && (or = !0), Bt();
    const p = gt(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let fe;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const lt = (l) => {
    var g, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== fe && (fe = p, (f = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || f.call(g));
  };
  let Ie = [], Ue = 0, ht = !1, Pe = null;
  const Ae = (l) => {
    var p, g;
    ht || !((g = (p = l.gate) == null ? void 0 : p.gifts) != null && g.enabled) || Date.now() - Ue < 6e4 || (Ue = Date.now(), a("/radio/gift/featured").then((f) => {
      Ie = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((T) => T && typeof T.id == "string" && typeof T.title == "string" && Array.isArray(T.tracks) && T.tracks.length > 0).slice(0, 6), ht = !0, Ie.length && nt(c.snapshot());
    }).catch(() => {
    }));
  }, ze = (l) => {
    var p;
    return Pe && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? Pe : null;
  }, Fe = (l, p = !1) => {
    var f, T;
    Pe = l, nt(c.snapshot());
    const g = l && p ? Cr(l)[0] : null;
    g && ((T = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || T.call(f, g.id));
  };
  let ve = Yd(), Tt = null;
  const yn = (l) => {
    const p = P.preview && !Me && l.step === "intro" ? v.incomingAlbum() : null;
    return p ? (ve = Du(ve, { kind: "offer", album: p.player.id, already: Ab(L).includes(p.player.id) }), Ic(ve) ? p.player : null) : (ve = Du(ve, { kind: "withdraw" }), null);
  }, En = (l) => {
    const p = ve.phase;
    ve = Du(ve, l), ve.phase !== p && (ve.album && (ve.phase === "playing" || ve.phase === "done") && HL(L, ve.album), nt(c.snapshot()));
  };
  setInterval(() => {
    ve.phase === "playing" && En({ kind: "tick", at: Date.now() });
  }, 5e3);
  let wt = "", tn, Bn = !1, sr = !1;
  const Nr = (l, p) => {
    var D, Z, xe, je, Mt, bt, mr, mn;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((D = l.giftStop) == null ? void 0 : D.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, T = Tt, X = f ? O(l) ? _L(f.reason, f.text) : f.text : null, ne = T ? null : X ?? (t && (!((Z = l.gate) != null && Z.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    ne && ne !== tn && (g.setGiftStop(ne), tn = ne);
    const se = l.step === "off" || l.step === "elsewhere" ? null : ((xe = l.gift) == null ? void 0 : xe.player) ?? T ?? ze(l) ?? null, Ee = se ? se.id + ":" + se.cover + ":" + se.tracks.map((Pr) => Pr.id).join(",") : "";
    Ee !== wt && (g.setGiftPlayer(se ? { id: se.id, title: se.title, subtitle: se.subtitle, tracks: Cr(se).map((Pr) => Pr.id), hidden: ((je = EI(se)) == null ? void 0 : je.id) ?? null, cover: se.cover } : null), wt = Ee), ne !== tn && (g.setGiftStop(ne), tn = ne);
    const S = (f == null ? void 0 : f.reason) === "arriving";
    S !== sr && ((Mt = g.setGiftWait) == null || Mt.call(g, S), sr = S);
    const B = !!se && (!!T || !!((bt = l.albumLock) != null && bt.locked));
    B !== Bn && ((mr = g.setGiftLock) == null || mr.call(g, B), Bn = B), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((mn = g.forgetWallets) == null || mn.call(g));
  };
  let or = !1;
  const Rn = /* @__PURE__ */ new Map(), Ut = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let g = Rn.get(l.listening);
    return g === void 0 && (g = Date.now(), Rn.set(l.listening, g)), Date.now() - g < dl ? g : null;
  }, nn = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && Rn.has(l.listening), ut = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", Qt = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > qt ? Number((l - qt) / p) : 0;
  }, Mn = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), Jr = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, Nn = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, y = (l, p = "", g = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), g && (f.className = g), f;
  }, C = (l, p, g = "") => {
    const f = y("button", l, g);
    return f.type = "button", f.onclick = p, f;
  }, j = (l, p) => {
    const g = y("a", l);
    return g.href = p, g.target = "_blank", g.rel = "noopener", g;
  };
  let z = null, ae = location.hash === "#give";
  ae && history.replaceState(null, "", location.pathname + location.search);
  let re = !1;
  const Le = uI((l) => lI({ address: l, network: "mainnet" }), () => nt(c.snapshot())), Se = (l) => Le.get(l), Me = $L(navigator.userAgent), mt = (l, p) => {
    const g = navigator.userAgent, f = LL(g), T = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, X = [y("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${P.on ? "player" : "listening wallet"}${p ? P.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], ne = y("div", "", "ppp-open-row"), se = IL(T, g);
    if (se) {
      const Ee = y("a", `Open in ${f}`, "primary ppp-open-in");
      Ee.href = se, Ee.dataset.homeAction = "radio:open-in-browser", ne.append(Ee);
    }
    return ne.append(Jn("copy-page-link", "Copy link", () => T, se ? "" : "primary", () => nt(c.snapshot()))), X.push(ne, y("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), X;
  }, be = (l) => Se(l) ?? ut(l), et = (l) => l.slice(0, 2).map(be).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), st = /* @__PURE__ */ new Map();
  let tt = !1;
  const Ft = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), Bt = () => {
    tt || (tt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const g = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(g) && st.set(g, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      nt(c.snapshot());
    }).catch(() => {
      tt = !1;
    }));
  }, gt = (l, p) => {
    const g = st.get(l), f = dg(l, [g == null ? void 0 : g.title, p == null ? void 0 : p.title].find((X) => !Ft(X)) || ""), T = lg(l, (g == null ? void 0 : g.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: T };
  }, kt = (l) => {
    const { title: p, artist: g } = gt(l.song, l);
    return p ? `“${p}”${g ? ` — ${g}` : ""}` : `Song #${l.song}${g ? ` — ${g}` : ""}`;
  }, _r = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Ge = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Vt(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function _n(l, p, g = "", f) {
    const T = y("dt", l), X = y("dd", p, g);
    return f && X.append(" ", f), [T, X];
  }
  const Pn = document.getElementById("ppp-top"), zn = () => {
    (o.hidden || o.classList.contains("ppp-frame--rest") ? e : o).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, wn = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, kn = () => {
    var p, g;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      wn();
      return;
    }
    if (l.step === "elsewhere" && ((p = l.gate) != null && p.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((g = l.giftStop) == null ? void 0 : g.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      Kt();
      return;
    }
    zn();
  };
  Pn && (Pn.onclick = kn);
  const ln = (l, p, g, f = "") => l.standIn && !l.mainConnected ? C(`Connect ${be(l.standIn)} to add STX`, wn, f) : C(p, g, f), ys = (l) => {
    c.useLinked(l).then(() => zn());
  };
  let gr = null;
  const ti = () => {
    const l = Tg(c.snapshot(), be);
    return l.length ? gr || (gr = new Promise((p) => {
      var B;
      const g = y("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const T = (D) => {
        f = D, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), gr = null, p(f);
      }), g.addEventListener("click", (D) => {
        D.target === g && T(null);
      });
      const X = (D, Z, xe, je, Mt = !1) => {
        const bt = y("button", "", "ppp-connect__opt " + xe);
        return bt.type = "button", bt.disabled = Mt, bt.onclick = je, bt.append(y("b", D), y("span", Z)), bt;
      }, ne = y("h2", "Connect", "ppp-connect__title");
      ne.id = "ppp-connect-title";
      const se = l.map((D) => X(D.label, D.detail, "is-music", () => {
        if (T("music"), D.action === "linked" && D.main) {
          ys(D.main);
          return;
        }
        const Z = Tg(c.snapshot(), be).find((xe) => xe.action !== "linked");
        (Z == null ? void 0 : Z.action) === "create" ? c.create() : (Z == null ? void 0 : Z.action) === "unlock" && c.unlock(), zn();
      }, !!D.disabled)), Ee = X("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => T("stacks")), S = C("Cancel", () => T(null), "quiet ppp-connect__cancel");
      g.append(ne, ...se, Ee, S), document.body.appendChild(g), g.showModal(), (B = se.find((D) => !D.disabled)) == null || B.focus();
    }), gr) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = ti;
  function ni(l) {
    if (!Pn) return;
    const p = (f, T, X) => {
      Pn.hidden = !1, Pn.className = "ppp-top" + (T ? " is-" + T : ""), Pn.replaceChildren(y("span", "", "dot"), document.createTextNode(f)), Pn.title = X;
    }, g = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Pn.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Pn.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${be(l.linked)}`, "warn", `This device's listening wallet belongs to ${be(l.linked)}. Connect that wallet to pay artists or like songs.`);
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
  const rn = document.getElementById("pppNudge"), oo = document.getElementById("onair");
  (ee = rn == null ? void 0 : rn.querySelector("button")) == null || ee.addEventListener("click", () => kn());
  const io = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Gn = {
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
  function Wi(l) {
    if (l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, T = l.step === "elsewhere" && !t, X = g || f || T ? "" : io[l.step] ?? "", ne = g ? "on" : T ? "free" : X ? "off" : "";
    ne ? document.documentElement.dataset.ppp = ne : delete document.documentElement.dataset.ppp, oo && (oo.hidden = !ne || ne === "free", oo.querySelector(".onair-sub").textContent = g ? `${p.toLocaleString()} plays left` : "Plays off"), rn && (rn.hidden = ne !== "off" && ne !== "free", rn.classList.toggle("is-free", ne === "free"), ne === "free" ? (rn.querySelector(".nudge-t").textContent = "You’re on the free player", rn.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", rn.querySelector("button").textContent = "Get a player") : ne === "off" && (rn.querySelector(".nudge-t").textContent = X, rn.querySelector(".nudge-s").textContent = O(l) ? l.step === "intro" ? UL : "" : "This radio requires a funded listening wallet with music support on.", rn.querySelector("button").textContent = Gn[l.step] ?? "Start"));
  }
  let ws = "";
  function ao(l) {
    const p = y("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append(y("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append(y("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = y("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = ws, g.oninput = () => {
      ws = g.value;
    };
    const f = C(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(g.value), ws = "";
    }, "tiny");
    return p.append(g, " ", f), l.returnToKind === "chosen" && p.append(" ", C("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const co = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function lo() {
    const l = y("p", co + " ", "ppp-mute");
    return l.append(j("Xverse", "https://www.xverse.app/download"), " · ", j("Leather", "https://leather.io/install-extension")), l;
  }
  let ir = "";
  const uo = (l) => {
    const p = document.documentElement, g = l.solo && !l.main ? l.listening ? ut(l.listening) : "new" : "", f = M5() ? "1" : "", T = l.standIn && !l.mainConnected ? be(l.standIn) : "";
    `${g}|${f}|${T}` !== ir && (ir = `${g}|${f}|${T}`, g ? p.dataset.pppSolo = g : delete p.dataset.pppSolo, T ? p.dataset.pppAs = T : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => nt(c.snapshot()), l);
  function fo(l, p = "") {
    const g = y("div", "", "ppp-topup"), f = ms(l);
    g.append(y("span", "Add plays from My player: ", "ppp-mute"));
    for (const T of Uc) {
      const X = C(`+${T.toLocaleString()}`, () => void c.topUpAlbum(T), p);
      X.disabled = f === void 0 || f < T || l.depositPending || !!l.busy, g.append(X);
    }
    return f !== void 0 && f < Uc[0] && g.append(y("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const ms = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const g = p - qt - 6000n;
    return g > 0n ? Number(g / l.playCost) : 0;
  };
  function ri(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (or = !1), p.low && !or) return [];
    const g = y("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const T = y("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && T.append(j("View", Nn(p.txid))), g.append(T), [g];
    }
    g.append(y("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append(y("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append(y("p", p.address, "ppp-addr-full"));
    const f = y("div", "", "ppp-open-row");
    if (f.append(Jn("copy-likes-address", "Copy address", () => p.address, "primary", () => nt(c.snapshot()))), p.main && !l.solo) {
      const T = ls - (p.balance ?? 0n);
      T > 0n && f.append(ln(l, `Pay ${Er(T)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return g.append(f), g.append(y("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const Qr = (l) => {
    const p = y("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const g = y("p", "", "ppp-wait-t"), f = y("div", "", "ppp-wait-track");
    return f.append(y("div", "", "ppp-wait-fill")), p.append(g, f), ho(p), p;
  };
  function ho(l) {
    const p = Number(l.dataset.since), g = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), T = l.querySelector(".ppp-wait-fill"), X = l.querySelector(".ppp-wait-t");
    if (f < g) {
      const ne = Math.ceil((g - f) / 1e3);
      T.style.width = Math.max(4, Math.min(95, f / g * 100)).toFixed(0) + "%", X.textContent = `Your plays are arriving… usually about a minute · ${ne}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / g * 100)));
    } else
      T.style.width = "", X.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let bs = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      bs = 0;
      return;
    }
    l.forEach(ho), ++bs % 10 === 0 && nt(c.snapshot());
  }, 1e3);
  let xs = null;
  function Zi(l) {
    if (l.step === "loading" && xs !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    g !== xs && (xs = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function nt(l) {
    var vh, Ah, Eh, kh, $h, Ih, Lh, Ch, Th, Bh, Mh, Nh, _h, Ph, Uh, Oh, Hh, Dh;
    if (ce.sync(), J && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const W = J;
      J = null, l.root === W.root && l.slot !== W.slot && c.openAlbum(W.slot);
    }
    const p = v.inProgress(l), g = Ut(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : g !== null ? { ...l, depositPending: !0, arrival: { since: g, graceMs: dl } } : l, T = f.error === fl;
    if (lt(), Ae(l), De(l), Tt = yn(l), Nr(l, f), Zi(f), uo(f), !p && v.inProgress(l)) return;
    if (ni(f), Wi(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? P.on ? OL : "Checking your listening wallet…" : P.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      Be(f, !1);
      return;
    }
    const [X, ne] = Vt(f), se = s(".ppp-state");
    se.textContent = X, se.className = "ppp-state" + (ne ? " ppp-state--" + ne : ""), se.hidden = !X;
    const Ee = !!f.busy || f.armed, S = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Ee || !["intro", "loading"].includes(f.step));
    o.hidden = !S, o.classList.toggle("ppp-frame--rest", !Ee && !re);
    const B = s(".ppp-frame-label");
    B.hidden = !0;
    const D = L5(f) ?? z;
    z = D;
    const Z = "xtrata.radio.ppp.heard.v1", xe = (() => {
      try {
        return localStorage.getItem(Z) === "1";
      } catch {
        return !1;
      }
    })();
    if (!xe && f.entries.some((W) => W.kind === "play"))
      try {
        localStorage.setItem(Z, "1");
      } catch {
      }
    const je = xe || f.slot > 0 && ((((vh = f.likeFunds) == null ? void 0 : vh.balance) ?? 0n) > 0n || A.count() > 1), Mt = O(f), bt = !Mt && T5({ ...f, heard: je }, D);
    s(".ppp-badge").hidden = !bt;
    const mr = s(".ppp-steps"), mn = s(".ppp-stage");
    mr.hidden = mn.hidden = !bt, D && bt && (mr.replaceChildren(...Gd(f.solo).map((W, he) => {
      const Oe = y("li", "", he < D.at ? "done" : he === D.at ? D.blocked ? "now blocked" : "now" : "");
      return Oe.append(y("span", he < D.at ? "✓" : String(he + 1), "n"), W), he === D.at && Oe.setAttribute("aria-current", "step"), Oe;
    })), mn.textContent = D.caption, mn.className = "ppp-stage " + (D.at >= Gd(f.solo).length ? "ppp-ok" : D.blocked ? "ppp-bad" : "ppp-cyan"));
    const Pr = s(".ppp-facts"), On = [];
    f.main && ((Ah = f.gate) != null && Ah.here) && !f.solo && On.push(..._n("Your wallet", be(f.main), "ppp-addr-short"));
    const Ji = () => {
      if (!f.listening) return;
      const W = Jn("copy-listening", "Copy", () => f.listening || "", "tiny", () => nt(c.snapshot()));
      On.push(..._n(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", ut(f.listening), "ppp-addr-short", W));
    };
    if (f.linked || Ji(), f.listening && f.step !== "intro")
      if (f.linked)
        On.push(..._n("Credited to", `${be(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Ji();
      else if (f.solo) {
        f.creditedTo && On.push(..._n("Credited to", `${be(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const W = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${be(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        On.push(..._n("Returns go to", f.gift ? W : f.returnTo && !Se(f.returnTo) ? W.replace(ut(f.returnTo), f.returnTo) : W, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else On.push(..._n("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Eh = f.gate) != null && Eh.here)) {
      const W = f.linkedListening.map((he) => ut(he) + (he === f.listening ? " (this one)" : "")).join(", ");
      On.push(..._n(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", W, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const W = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      On.push(..._n("Balance", `${Er(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, W));
    }
    const ns = f.entries.find((W) => W.kind === "play");
    ns && Bt(), ns && On.push(..._n("Last paid song", `${kt(ns)} → ${be(ns.recipient)}`, _r[ns.status] || "")), Pr.replaceChildren(...On), Pr.hidden = !On.length;
    const $e = [], xt = [], It = [], Kn = [], gh = vn(BigInt(((kh = f.gate) == null ? void 0 : kh.limits.playFee) ?? "300")), yh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${Er(ll)} STX to the song holder, plus a ${Er(gh - ll)} STX network fee.`, wh = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if ($e.push(y("p", "Pay artists as you listen.")), ($h = f.gate) != null && $h.radioUrl) {
          const he = y("p");
          he.append(j("Open the pay-per-play radio →", f.gate.radioUrl)), $e.push(he);
        }
        xt.push(y("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const he = [f.linked, ...f.others];
          $e.push(y("p", he.length > 1 ? `This device has listening wallets for ${et(he)}.` : `This device has a listening wallet for ${be(f.linked)}.`)), xt.push(y("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), he.slice(0, 3).forEach((Oe, at) => It.push(C(`Open ${be(Oe)}`, () => ys(Oe), at === 0 ? "primary" : "")));
        } else
          $e.push(y("p", "Connect your wallet to pay artists as you listen.")), xt.push(y("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        $e.push(y("p", `This device's listening wallet belongs to ${be(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), xt.push(y("p", `You are connected as ${be(f.main)}. Switch to the linked wallet to continue listening.`)), xt.push(y("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), It.push(C("Switch wallet", wn, "primary"));
        break;
      case "not-invited":
        $e.push(y("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        $e.push(y("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        $e.push(y("p", "Every play counts for the song’s owner, on-chain.")), xt.push(y("p", yh)), xt.push(y("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), xt.push(y("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? ($e.push(y("p", `This device already has a listening wallet for ${et(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), xt.push(y("p", `Otherwise, set up a new listening wallet for ${be(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && xt.push(y("p", `This is the listening wallet for ${be(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && xt.push(y("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const W = v.liveGift();
        It.push(C(W ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${be(f.main)}` : "Start listening", () => void c.create(m.claiming() ? { another: !0 } : void 0), "primary")), !W && !f.solo && f.main && f.others.length && It.push(C("Switch wallet", wn)), !W && f.solo && It.push(C("I have a Stacks wallet", wn)), It.push(C("I already have a listening wallet", () => void c.unlock(!0))), W && It.push(C("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || ($e.push(y("p", "Locked.", "ppp-mute")), It.push(C("Unlock", () => void c.unlock(), "primary"))), f.standIn ? Kn.push(C("Use a different listening wallet", () => void ti().then((he) => {
          he === "stacks" && wn();
        }), "quiet")) : Kn.push(C("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        $e.push(y("p", `Link to ${be(f.main)} · free`)), xt.push(y("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), xt.push(y("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), It.push(C(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        $e.push(y("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && $e.push(Qr(f.arrival)) : nn(f) ? $e.push(y("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Ih = f.gift) != null && Ih.player ? $e.push(y("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? $e.push(y("p", "No plays left · add plays to keep counting", "ppp-bad")) : $e.push(y("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / gh)).toLocaleString()} plays`)), f.entries.length && xt.push(y("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && xt.push(y("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? xt.push(y("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? xt.push(y("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (xt.push(y("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), xt.push(y("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && It.push(Jn("copy-address", "Copy my address", () => f.listening || "", "primary", () => nt(c.snapshot())))) : xt.push(y("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const he = y("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          he.append(j("View", Nn(f.depositTxid))), $e.push(he);
        } else f.allowance > 0n && !f.solo && !f.depositPending && It.push(ln(f, `Deposit ${Er(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        $e.push(y("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && ($e.push(y("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), It.push(C("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && ($e.push(y("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), $e.push(ao(f))), (!f.solo || f.returnTo) && It.push(C("Return excess", () => void c.returnFunds("excess"), "primary"), C("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((Lh = f.giftStop) == null ? void 0 : Lh.reason) !== "off") {
          const he = Math.min(f.session.playsLeft, f.playsLeft);
          $e.push(y("p", `${he.toLocaleString()} plays left`, "ppp-ok")), xt.push(y("p", yh + " The heart likes or unlikes from this wallet for 0.0002 STX.")), It.push(C("Switch off", () => void c.switchOff()));
        } else
          $e.push(y("p", "Switch on music support to listen.", "ppp-mute")), It.push(C("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && $e.push(y("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && $e.push(y("p", "Running low on plays", "ppp-warn")), f.aboveTarget && $e.push(y("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? $e.push(y("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && It.push(ln(f, `Top up ${Er(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const W = f.step === "fund", he = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      W ? It.unshift(C("Add plays", () => Kt(), "primary")) : he ? It.push(C("Add plays", () => Kt(), "primary")) : f.step === "ready" && Kn.push(C("Add plays", () => Kt(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && xt.push(y("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && xt.push(ao(f)), xt.push(lo()), f.slot === 0 && f.step === "ready" && f.entries.some((W) => W.kind === "play" && W.status === "confirmed"))) {
      const W = y("p", "New to Stacks? ", "ppp-mute");
      W.append(j("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), $e.push(W);
    }
    if (f.walletOutdated && xt.push(y("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && ($e.push(y("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), It.push(C("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && Kn.push(C(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${be(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((Ch = f.gift) != null && Ch.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && Kn.push(fo(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && Kn.push(C(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && Kn.push(C("Lock", () => void c.lock(), "quiet")), S && !Ee && Kn.push(C(re ? "Hide listening wallet box" : "Show listening wallet box", () => {
      re = !re, nt(c.snapshot());
    }, "quiet")), [...It, ...Kn].forEach((W) => W.disabled = wh), wh && (It.length = 0), !Mt && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((Th = f.gift) != null && Th.player)) {
      const W = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", he = $e.at(0);
      f.step === "ready" && he ? he.append(y("span", ` · ${Mn(f.balance)} STX`, W)) : $e.push(y("p", `Balance ${Mn(f.balance)} STX`, W));
    }
    if (Mt) {
      for (const Oe of [...It, ...Kn]) {
        const at = ML[Oe.textContent ?? ""];
        at && (Oe.textContent = at);
      }
      for (let Oe = $e.length - 1; Oe >= 0; Oe--) Mg($e[Oe].textContent) && xt.unshift(...$e.splice(Oe, 1));
      for (let Oe = It.length - 1; Oe >= 0; Oe--) Mg(It[Oe].textContent) && Kn.unshift(...It.splice(Oe, 1));
      const W = f.entries.some((Oe) => Oe.kind === "play"), he = PL(f.step, { played: W, arriving: f.depositPending });
      he.length && $e.length && he.shift(), $e.push(...he.map((Oe) => y("p", Oe, "ppp-mute")));
    }
    if ((Bh = f.gift) != null && Bh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const W = y("p", "", "ppp-gift");
      W.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && W.append(" · ", f.gift.player.subtitle);
      const he = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? y("span", " · plays on their way", "ppp-warn") : y("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      he && W.append(he);
      const Oe = (Mh = $e.at(0)) == null ? void 0 : Mh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Oe && /STX/.test(Oe.textContent ?? "") && Oe.remove(), $e.unshift(W), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          $e.splice(1, 0, y("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), fo(f, "primary"));
        else {
          const at = y("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          at.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), at.append(j("Xverse", "https://www.xverse.app/download"), " and ", j("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), $e.splice(1, 0, at);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const W = f.returnPlan, he = y("div", "", "ppp-pick");
      he.append(y("p", W.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Oe = y("ul", "", "ppp-gift-list");
      W.steps.forEach((at, br) => {
        const Vn = at.kind === "gift" ? "the unused gift" : at.kind === "deposit" ? "what was added to it" : "the rest", un = y("li");
        un.append(y("span", `${br + 1}. ${Er(BigInt(at.send))} STX · ${Vn}`, "t"), y("span", at.to ? ` → ${be(at.to)}` : " → choose an address below", at.to ? "ppp-mute" : "ppp-warn")), Oe.append(un);
      }), he.append(Oe), W.kept && he.append(y("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), W.steps.some((at) => !at.to) && he.append(ao(f)), he.append(C(W.steps.length > 1 ? `Confirm part 1 of ${W.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), $e.push(he);
    }
    const As = es(f), rs = E ? As : null, ii = Ct(f, !!rs), kb = ii === "gift" || ii === "arriving" || ii === "new", Vl = rs ? null : m.lines(l), Xl = Vl && !m.claiming() ? Vl : [...Vl ?? [], ...v.banner(l, { bare: !!rs || ii === "gift" || ii === "arriving" })], Ra = Me && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? mt(Me, v.pendingCode()) : [];
    rs || ($e.unshift(...Xl), $e.push(...ri(f)), $e.unshift(...Ra)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && $e.unshift(y("p", `This is ${be(f.creditedTo)}'s listening wallet. Plays and likes count for ${be(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...$e);
    const Yl = document.querySelector(".ppp-switch");
    if (Yl) {
      const W = A.latest(), he = f.slot > 0, Oe = ["fund", "ready", "over"].includes(f.step) && (he || !!W);
      if (Yl.hidden = !Oe, Oe) {
        const at = (un, Ka, Va, eu) => {
          const ci = C("", eu, "ppp-tab");
          return ci.setAttribute("aria-pressed", String(Va)), ci.append(y("span", un, "tt"), y("span", Ka === void 0 ? "…" : `${Qt(Ka).toLocaleString()} plays`, "ts")), ci.disabled = !!f.busy, ci;
        }, br = he ? ((_h = (Nh = f.gift) == null ? void 0 : Nh.player) == null ? void 0 : _h.title) ?? "Album" : W.title, Vn = C("View all albums" + (A.count() > 1 ? ` (${A.count()})` : ""), () => {
          const un = document.querySelector(".ppp-shelf");
          un && (un.hidden = !1, un.open = !un.open, Vn.setAttribute("aria-expanded", String(un.open)), un.open && requestAnimationFrame(() => un.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Vn.setAttribute("aria-expanded", String(!!((Ph = document.querySelector(".ppp-shelf")) != null && Ph.open))), Yl.replaceChildren(
          at("🎧 My player", he ? (Uh = f.likeFunds) == null ? void 0 : Uh.balance : f.balance, !he, () => {
            he && c.openAlbum(0);
          }),
          at("💿 " + br, he ? f.balance : void 0, he, () => {
            !he && W && c.openAlbum(W.slot);
          }),
          Vn
        );
      }
    }
    const za = A.render(f), Ga = document.querySelector(".ppp-shelf");
    if (Ga) {
      Ga.hidden = !za;
      const W = Ga.querySelector("summary");
      W && (W.textContent = A.count() > 0 ? `♪ My albums (${A.count()})` : "♪ My albums");
      const he = Ga.querySelector(".ppp-shelf-body");
      za && he && !he.contains(za) && he.replaceChildren(za);
    }
    const Qi = v.renderFold(l);
    if (s(".ppp-gifts").hidden = !Qi, Qi && !s(".ppp-gift-body").contains(Qi) && s(".ppp-gift-body").replaceChildren(Qi), Qi && ae) {
      ae = !1;
      const W = s(".ppp-gifts");
      W.open = !0, requestAnimationFrame(() => W.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const ql = document.querySelector("#ppp .ppp-featured");
    if (ql) {
      const W = te(), he = ce.manage(), Oe = (W.length > 0 || !!he) && f.slot === 0 && !((Oh = f.gift) != null && Oh.player) && f.step === "ready";
      ql.hidden = !Oe, Oe && ql.replaceChildren(...W.length ? [y("p", "Albums in your player", "ppp-featured__h")] : [], ...W.map((at) => {
        const br = (Pe == null ? void 0 : Pe.id) === at.id, Vn = C("", () => Fe(br ? null : at, !br), "ppp-featured__a" + (br ? " is-on" : "")), un = Cr(at).length;
        return Vn.append(y("b", at.title), y("span", br ? "Playing now · tap to go back to the radio" : `${at.subtitle ? at.subtitle + " · " : ""}${un} ${un === 1 ? "song" : "songs"}`)), Vn.setAttribute("aria-pressed", String(br)), Vn.disabled = !!f.busy, Vn;
      }), ...he ? [he] : []);
    }
    const Wl = document.querySelector("#ppp .ppp-release-in-slot");
    if (Wl) {
      const W = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : ce.banner();
      Wl.hidden = !W.length, Wl.replaceChildren(...W);
    }
    const ai = document.querySelector("#ppp .ppp-release");
    if (ai) {
      const W = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : ce.fold();
      if (ai.hidden = !W, W) {
        const he = document.activeElement instanceof HTMLElement && ai.contains(document.activeElement) ? document.activeElement : null, Oe = ((Hh = ai.querySelector(".ppp-release-songs")) == null ? void 0 : Hh.scrollTop) ?? 0;
        (Dh = ai.querySelector(".ppp-release-body")) == null || Dh.replaceChildren(...W);
        const at = ai.querySelector(".ppp-release-songs");
        at && Oe && (at.scrollTop = Oe), he && he.isConnected && document.activeElement !== he && he.focus({ preventScroll: !0 });
      }
    }
    Ss(f);
    const Zl = document.querySelector("#ppp .ppp-yours");
    if (Zl) {
      const W = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      Zl.hidden = !W;
      const he = Zl.querySelector(".ppp-yours-body");
      if (W && he && he.getAttribute("data-for") !== f.listening) {
        he.setAttribute("data-for", f.listening);
        const Oe = (eu, ...ci) => {
          const Fh = y("details", "", "ppp-yours-item");
          return Fh.append(y("summary", eu), ...ci), Fh;
        }, at = y("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        at.append(y("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const br = y("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), Vn = y("p");
        Vn.append(j("Find a name at BNS One →", "https://bns.one"));
        const un = y("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ka = y("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Va = y("p");
        Va.append(j("See the giveaway →", "https://xtrata.xyz/giveaway")), he.replaceChildren(
          Oe("Give your player a name", at, br, y("p", f.listening, "ppp-addr-full"), Jn("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => nt(c.snapshot())), Vn),
          Oe("Link it to a wallet you already have", un),
          Oe("Bring a friend in", Ka, Va)
        );
      }
    }
    s(".ppp-body").replaceChildren(...xt), s(".ppp-actions").replaceChildren(...It), s(".ppp-actions2").replaceChildren(...Kn);
    const Jl = f.busy || f.message || "", mh = s(".ppp-msg"), Ql = Jl && $e.some((W) => (W.textContent ?? "").startsWith(Jl.replace(/[.✓\s]+$/, ""))) ? "" : Jl, bh = !Ql && !f.error ? f.notice : T && !Ql ? f.error : "";
    mh.textContent = Ql || bh, mh.classList.toggle("is-warn", !!bh), s(".ppp-err").textContent = T ? "" : f.error;
    const $b = f.entries.filter((W) => W.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...$b.slice(0, 5).map((W) => {
      const he = y("li"), Oe = W.status === "confirmed" ? "ok" : W.status === "failed" ? "bad" : "warn";
      return he.append(y("span", "", "d " + Oe), y("span", kt(W), "t"), y("span", Jr(W.created), "ppp-mute")), W.txid && he.append(j("tx", Nn(W.txid))), he;
    })), s(".ppp-wallets").hidden = !(Pr.childElementCount || Kn.length), s(".ppp-more").hidden = !xt.length;
    const xh = s(".ppp-history");
    xh.hidden = !f.entries.length, f.entries.length && Bt(), xh.replaceChildren(y("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((W) => {
      const he = y("div", "", "ppp-row"), Oe = W.kind === "play" ? [y("span", kt(W), "ppp-song"), y("span", ` · ${Er(BigInt(W.amount))} STX to ${be(W.recipient)}`, "ppp-mute")] : W.kind === "like" ? [y("span", `${W.liked ? "♥ Liked" : "Unliked"} ${kt(W)}`, "ppp-song"), y("span", ` · for ${f.linked ? be(f.linked) : "this listening wallet"}`, "ppp-mute")] : [y("span", `Returned ${Er(BigInt(W.amount))} STX`, "ppp-song"), y("span", ` to ${be(W.recipient)}`, "ppp-mute")];
      return he.append(
        y("span", Ge[W.status] || W.status, "ppp-status " + (_r[W.status] || "")),
        ...Oe,
        y("span", ` · ${new Date(W.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), W.txid && he.append(j("tx ↗", Nn(W.txid))), he;
    })), V == null || V.render(rs ? wr(f, rs, [...Ra, ...Xl]) : null), Be(f, !!rs, kb ? [...Ra, ...Xl] : Ra, ii), yr(f, !!rs || !!(I != null && I.showing())), po(f, rs), en.isOpen() && en.refresh(), oi();
    const Sh = (As == null ? void 0 : As.mode) === "open" ? null : ze(f);
    Jt == null || Jt.render((As == null ? void 0 : As.mode) === "open" ? wr(f, As, []) : Sh ? { ...wr(f, { mode: "open", player: Sh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function es(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && Q({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = v.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const g = G();
    return g && (l.step === "locked" || J && l.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const $t = (l, p, g, f, T) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: g, ...T ? { b: T } : {}, p: String(f), s: _g(eg, p, g) })}`;
  function si(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? N ? "making" : null : p.state === "claimed" ? N && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || _ || l.step === "link" && $ !== "have" ? null : $ === "making" || $ === "yours" ? "ready" : $;
  }
  function yr(l, p) {
    if (!Y) return;
    const g = l.award, f = g != null && g.cls && Ac(g.cls) ? ko(g.cls) : null, T = l.slot === 0 ? l.listening : l.root, X = p || !g || !f || !T || g.number === void 0 ? null : si(l);
    if (!X || !g || !f || !T) {
      Y.render(null, p);
      return;
    }
    X === "have" && l.linked && !q && (q = !0, c.awardRefresh());
    const ne = typeof g.name == "string" && g.name ? g.name : null, se = [];
    l.error && se.push(y("p", l.error, "ppp-warn"));
    const Ee = (S) => {
      $ = S, S === "name" && (N = !0), nt(c.snapshot());
    };
    Y.render({
      screen: X,
      tier: f,
      number: g.number,
      need: g.need ?? 0,
      player: T,
      name: g.name,
      inscription: g.inscription,
      art: X === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : $t(f, g.number, T, g.need ?? 0, ne),
      claimLink: g.claimTx ? Nn(g.claimTx) : void 0,
      status: se,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? be(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => Jn("award-player-address", "Copy my player’s address", () => T, "tiny", () => nt(c.snapshot())),
      go: Ee,
      claim: (S) => {
        N = !0, c.claimAward(S);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var S;
        return (S = document.getElementById("radio-wallet-connect")) == null ? void 0 : S.click();
      },
      link: () => void c.link(),
      later: () => {
        _ = !0;
        try {
          localStorage.setItem(b, String(Date.now()));
        } catch {
        }
        nt(c.snapshot());
      },
      done: () => {
        N = !1, $ = "ready", nt(c.snapshot());
      }
    }, p);
  }
  function Ss(l) {
    var D;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const g = l.award, f = l.slot === 0 ? l.listening : l.root, T = g != null && g.cls && Ac(g.cls) ? ko(g.cls) : null, X = !!g && !!T && !!f && ["ready", "fund", "over"].includes(l.step) && !(g.state === "unavailable" && g.number === void 0);
    if (p.hidden = !X, !X || !g || !T || !f) {
      p.replaceChildren();
      return;
    }
    const ne = JSON.stringify([g, f, !!l.busy]);
    if (p.getAttribute("data-sig") === ne) return;
    p.setAttribute("data-sig", ne);
    const se = (Z) => {
      const xe = y("p", "", "ppp-award__h");
      return xe.append(y("b", `${T.mark} Music Hero award`), y("span", Z)), xe;
    }, Ee = `No. ${String(g.number ?? 0).padStart(4, "0")}`, S = (Z) => {
      const xe = y("div", "", "ppp-award__art"), je = document.createElement("iframe");
      return je.src = Z, je.title = `${T.name} record`, je.setAttribute("sandbox", "allow-scripts"), je.setAttribute("loading", "lazy"), xe.append(je), xe;
    }, B = [];
    if (g.state === "claimed") {
      if (B.push(se(`${T.name} record · ${Ee}`)), g.inscription !== void 0 && B.push(S(`/i/${g.inscription}`)), B.push(y("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${T.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const Z = y("p");
        Z.append(j("Open it full screen ↗", `/i/${g.inscription}`)), B.push(Z);
      }
      if (g.sendTx) {
        const Z = y("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        Z.append(j("View", Nn(g.sendTx))), B.push(Z);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const Z = y("details", "", "ppp-award__send"), xe = document.createElement("input");
        xe.type = "text", xe.placeholder = "SP… address to send it to", xe.autocomplete = "off", xe.spellcheck = !1, xe.setAttribute("aria-label", "Address to send your record to");
        const je = C("Send my record…", () => void c.sendAward(xe.value), "");
        je.disabled = !!l.busy, Z.append(
          y("summary", "Send this record to someone"),
          y("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          xe,
          je
        ), B.push(Z);
      }
    } else if (g.claimTx) {
      B.push(se(`${T.name} record · ${Ee}`));
      const Z = y("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      Z.append(j("View", Nn(g.claimTx))), B.push(Z);
    } else if (g.state === "ready") {
      B.push(se(`${T.name} record · ${Ee}`));
      const Z = typeof g.name == "string" && g.name ? g.name : null, xe = new URLSearchParams({ n: String(g.number), a: f, ...Z ? { b: Z } : {}, p: String(g.need), s: _g(eg, g.number, f) });
      B.push(S(`/awards/${T.id}#${xe}`)), B.push(y("p", `Your ${T.name} record is ready. You have paid artists for ${(D = g.need) == null ? void 0 : D.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const je = y("div", "", "ppp-award__row");
      Z ? (B.push(y("p", `Its plaque will carry ${Z} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), je.append(C("Claim my record", () => {
        N = !0, c.claimAward("auto");
      }, "primary"), C("Use my address only", () => {
        N = !0, c.claimAward("none");
      }, "quiet"))) : g.name === null ? (B.push(y("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), je.append(C("Claim my record", () => {
        N = !0, c.claimAward("none");
      }, "primary"), C("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (B.push(y("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), je.append(C("Check for a name again", () => void c.awardRefresh(), "primary"), C("Claim with my address only", () => void c.claimAward("none"), "quiet"))), je.querySelectorAll("button").forEach((Mt) => {
        Mt.disabled = !!l.busy;
      }), B.push(je, y("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      B.push(se(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const Z = y("div", "", "ppp-award__bar"), xe = document.createElement("i");
      xe.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, Z.append(xe);
      const je = g.need - g.have;
      B.push(Z, y("p", `${je.toLocaleString()} more ${je === 1 ? "play" : "plays"} and your ${T.name} record is yours to claim.`, "ppp-mute"));
    } else
      B.push(se(`${T.name} record · ${Ee}`)), B.push(y("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...B);
  }
  function po(l, p) {
    var se;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!p && (Y != null && Y.showing()) && ((se = l.award) != null && se.cls) && Ac(l.award.cls) && (l.busy || l.armed)) {
      const Ee = ko(l.award.cls), S = y("span", "", "ppp-skin__t");
      S.append(y("b", `${Ee.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), y("span", "Xtrata Music Hero")), g.hidden = !1, g.replaceChildren(y("span", Ee.mark, "ppp-skin__art ppp-skin__art--none"), S);
      return;
    }
    const f = !!p && (!!l.busy || l.armed);
    if (g.hidden = !f, !f || !p) {
      g.replaceChildren();
      return;
    }
    const T = Oc(p.player.cover), X = T ? y("img", "", "ppp-skin__art") : y("span", "♪", "ppp-skin__art ppp-skin__art--none");
    T && (X.src = T, X.alt = "");
    const ne = y("span", "", "ppp-skin__t");
    ne.append(y("b", p.player.title), y("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), g.replaceChildren(X, ne);
  }
  function wr(l, p, g) {
    var Ee, S, B, D, Z;
    const f = !!l.busy || l.armed, T = [...g];
    l.depositPending && l.arrival && T.push(Qr(l.arrival)), l.error ? T.push(y("p", l.error, l.error === fl ? "ppp-warn" : "ppp-bad")) : l.message && !f ? T.push(y("p", l.message, "ppp-cyan")) : l.notice && T.push(y("p", l.notice, "ppp-warn")), p.mode === "open" && or && ((Ee = l.likeFunds) != null && Ee.album) && l.likeFunds.low && !l.likeFunds.pending && T.push(y("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let X = "Kept on this device with Face ID or your passkey. No app or account needed.", ne = null, se = null;
    if (p.mode === "locked")
      ne = { label: "Continue listening", run: () => {
        J = G(), c.unlock();
      } }, se = { label: "Use a different passkey", run: () => {
        J = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && Ic(ve) && ve.album === p.player.id) {
        const xe = window.XtrataRadio, je = Cr(p.player)[0], Mt = ve.phase === "playing";
        ne = { label: Mt && !!((B = (S = xe == null ? void 0 : xe.getState) == null ? void 0 : S.call(xe)) != null && B.playing) ? "Pause" : Mt ? "Carry on" : "Play the first song", run: () => {
          var mr, mn;
          Mt ? (mr = xe == null ? void 0 : xe.playPause) == null || mr.call(xe) : je && ((mn = xe == null ? void 0 : xe.playToken) == null || mn.call(xe, je.id));
        } }, se = { label: "Make my player and hear it all", run: () => void c.create() }, X = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const xe = ve.phase === "done" && ve.album === p.player.id;
        xe && !T.length && T.push(y("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), ne = { label: xe ? "Keep listening" : "Open album", run: () => void c.create() }, se = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (ne = { label: "Open album", run: () => void c.unlock() }, se = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? T.push(y("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : T.length || T.push(y("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: p.mode,
      player: p.player,
      from: p.from,
      offered: p.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: p.mode === "arrive" && l.step === "intro" ? 1 : void 0,
      plays: p.mode === "open" ? l.balance === void 0 ? null : l.giftPlays : void 0,
      playsComing: l.depositPending,
      status: T,
      primary: ne,
      secondary: se,
      hint: ne ? X : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: ms(l),
      topUps: Uc,
      canMake: !!((Z = (D = l.gate) == null ? void 0 : D.gifts) != null && Z.admin)
    };
  }
  const ar = document.getElementById("findBox"), vs = document.getElementById("findBody"), ts = ar && vs ? JL(vs, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => qL(l == null ? void 0 : l.tracks, (p, g) => ({ title: dg(p, Ft(g.title) ? "" : g.title), artist: lg(p, g.artist || "") }))),
    play: (l) => {
      var p, g;
      (g = (p = window.XtrataRadio) == null ? void 0 : p.playToken) == null || g.call(p, l);
    },
    current: () => {
      var p, g, f, T;
      const l = Number((T = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.nowPlaying) == null ? void 0 : T.tokenId);
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
    liked: (l) => Un().has(l)
  }) : null;
  ar == null || ar.addEventListener("toggle", () => {
    ar.open && (ts == null || ts.load());
  });
  let go = "";
  const Un = () => {
    var p, g, f;
    const l = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((T) => Number(T == null ? void 0 : T.tokenId)).filter(Number.isSafeInteger) : []);
  }, oi = () => {
    var p, g, f, T, X;
    if (!ts || !(ar != null && ar.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((X = (T = (f = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : f.call(g)) == null ? void 0 : T.nowPlaying) == null ? void 0 : X.tokenId) ?? ""}|${[...Un()].sort((ne, se) => ne - se).join(",")}`;
    l !== go && (go = l, ts.refresh());
  }, x = /* @__PURE__ */ new Map();
  let k = !1;
  const K = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const g = p == null ? void 0 : p.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && x.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), oi(), Ic(ve)) {
        const f = !!(p != null && p.playing);
        En({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: f, at: Date.now() }), f !== k && (k = f, nt(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!K()) {
    const l = setInterval(() => {
      K() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const p = l.detail;
    if (Ic(ve) && En({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      Bt();
      const g = gt(p.song, x.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const eC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", tC = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), o = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return o ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, nC = () => tC() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, rC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, sC = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Eb = class {
  constructor(e) {
    x4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && Fv(e), this.callback(Tl(e));
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
    var r, s, o, i, a, c, u, h, d, m;
    return n === "IOS" ? (s = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && s !== void 0 ? s : e.webUrl : t === "Chrome" ? (i = (o = e.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (h = (u = e.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl : (m = (d = this.getBrowserUrl(e)) !== null && d !== void 0 ? d : e.webUrl) !== null && m !== void 0 ? m : this.getMobileUrl(e);
  }
  render() {
    const e = nC(), t = rC(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Re("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Re("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Re("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Re("div", { class: "flex flex-col space-y-[10px]" }, Re("div", { class: "flex items-center" }, Re("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Re("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Re("span", { class: "sr-only" }, "Close popup"), Re("img", { src: eC }))), r ? Re("p", null, "Select the wallet you want to connect to.") : Re("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && Re("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Re("div", { class: "mt-6" }, Re("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Re("ul", { class: "space-y-3" }, this.installedProviders.map((o) => Re("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Re("div", { class: "aspect-square basis-9 overflow-hidden" }, Re("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Re("div", { class: "flex-1" }, Re("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Re("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), Re("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && Re("div", { class: "mt-6" }, r ? Re("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Re("div", { class: "mb-5 flex justify-between" }, Re("p", { class: "text-sm font-medium" }, "Recommended wallets"), Re("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Re("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Re("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Re("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Re("p", null, "What is a wallet? ", Re("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Re("ul", { class: "space-y-3" }, n.map((o) => Re("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Re("div", { class: "aspect-square basis-9 overflow-hidden" }, Re("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Re("div", { class: "flex-1" }, Re("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Re("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, e, t) && Re("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, e, t), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return t4(this);
  }
};
Eb.style = sC;
const oC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Eb
}, Symbol.toStringTag, { value: "Module" }));
