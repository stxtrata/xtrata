var $b = Object.defineProperty;
var Ib = (e, t, n) => t in e ? $b(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ea = (e, t, n) => Ib(e, typeof t != "symbol" ? t + "" : t, n);
var Cn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Pg(e) {
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
      function E(b) {
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
            return Promise.resolve(E(this._bodyArrayBuffer));
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
      function A(b) {
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
        if (this.credentials = $.credentials || this.credentials || "same-origin", ($.headers || !this.headers) && (this.headers = new h($.headers)), this.method = A($.method || this.method || "GET"), this.mode = $.mode || this.mode || null, this.signal = $.signal || this.signal || function() {
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
      function X(b) {
        var $ = new h(), N = b.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(_) {
          return _.indexOf(`
`) === 0 ? _.substr(1, _.length) : _;
        }).forEach(function(_) {
          var q = _.split(":"), R = q.shift().trim();
          if (R) {
            var ce = q.join(":").trim();
            try {
              $.append(R, ce);
            } catch (le) {
              console.warn("Response " + le.message);
            }
          }
        }), $;
      }
      P.call(M.prototype);
      function ae(b, $) {
        if (!(this instanceof ae))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if ($ || ($ = {}), this.type = "default", this.status = $.status === void 0 ? 200 : $.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = $.statusText === void 0 ? "" : "" + $.statusText, this.headers = new h($.headers), this.url = $.url || "", this._initBody(b);
      }
      P.call(ae.prototype), ae.prototype.clone = function() {
        return new ae(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, ae.error = function() {
        var b = new ae(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var se = [301, 302, 303, 307, 308];
      ae.redirect = function(b, $) {
        if (se.indexOf($) === -1)
          throw new RangeError("Invalid status code");
        return new ae(null, { status: $, headers: { location: b } });
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
          function ce() {
            R.abort();
          }
          R.onload = function() {
            var I = {
              statusText: R.statusText,
              headers: X(R.getAllResponseHeaders() || "")
            };
            q.url.indexOf("file://") === 0 && (R.status < 200 || R.status > 599) ? I.status = 200 : I.status = R.status, I.url = "responseURL" in R ? R.responseURL : I.headers.get("X-Request-URL");
            var j = "response" in R ? R.response : R.responseText;
            setTimeout(function() {
              N(new ae(j, I));
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
          function le(I) {
            try {
              return I === "" && n.location.href ? n.location.href : I;
            } catch {
              return I;
            }
          }
          if (R.open(q.method, le(q.url), !0), q.credentials === "include" ? R.withCredentials = !0 : q.credentials === "omit" && (R.withCredentials = !1), "responseType" in R && (r.blob ? R.responseType = "blob" : r.arrayBuffer && (R.responseType = "arraybuffer")), $ && typeof $.headers == "object" && !($.headers instanceof h || n.Headers && $.headers instanceof n.Headers)) {
            var He = [];
            Object.getOwnPropertyNames($.headers).forEach(function(I) {
              He.push(a(I)), R.setRequestHeader(I, c($.headers[I]));
            }), q.headers.forEach(function(I, j) {
              He.indexOf(j) === -1 && R.setRequestHeader(j, I);
            });
          } else
            q.headers.forEach(function(I, j) {
              R.setRequestHeader(j, I);
            });
          q.signal && (q.signal.addEventListener("abort", ce), R.onreadystatechange = function() {
            R.readyState === 4 && q.signal.removeEventListener("abort", ce);
          }), R.send(typeof q._bodyInit > "u" ? null : q._bodyInit);
        });
      }
      return Y.polyfill = !0, n.fetch || (n.fetch = Y, n.Headers = h, n.Request = M, n.Response = ae), t.Headers = h, t.Request = M, t.Response = ae, t.fetch = Y, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Cn);
})();
const Lb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Cb(e, t) {
  const n = {};
  return Object.assign(n, Lb, t), await fetch(e, n);
}
function Tb(e) {
  let t = Cb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Bb(...e) {
  const { fetchLib: t, middlewares: n } = Tb(e);
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
var Ei;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ei || (Ei = {}));
var To;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(To || (To = {}));
var Fh;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Fh || (Fh = {}));
const Mb = "https://api.mainnet.hiro.so", Nb = "https://api.testnet.hiro.so", _b = "http://localhost:3999", Pb = ["mainnet", "testnet", "devnet", "mocknet"];
let Ai = class {
  constructor(t) {
    this.version = To.Mainnet, this.chainId = Ei.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === To.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Bb();
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
Ai.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Du();
    case "testnet":
      return new Ub();
    case "devnet":
      return new Ob();
    case "mocknet":
      return new Ug();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Pb.join(", ")}`);
  }
};
Ai.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Ai.fromName(e);
let Du = class extends Ai {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Mb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = To.Mainnet, this.chainId = Ei.Mainnet;
  }
}, Ub = class extends Ai {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Nb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = To.Testnet, this.chainId = Ei.Testnet;
  }
}, Ug = class extends Ai {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? _b,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = To.Testnet, this.chainId = Ei.Testnet;
  }
};
const Ob = Ug, Og = "xtrata.wallet.bridge.v1", Hb = (e) => typeof e == "object" && e !== null && e.protocol === Og, Db = (e) => Hb(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", Fb = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class ta extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const jh = 12e4;
class jb {
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
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !Db(t.data)) return;
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
    const s = Fb(), o = { protocol: Og, kind: "request", id: s, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ta(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? jh}ms.`
          )
        );
      }, this.options.timeoutMs ?? jh);
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
const Rb = ["SP", "SM"], zb = ["ST", "SN"], Gb = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return Rb.includes(n) ? "mainnet" : zb.includes(n) ? "testnet" : null;
}, Kb = () => {
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
}, Vb = () => typeof window > "u" || !window.localStorage ? Kb() : window.localStorage, tu = "xtrata.v15.1.wallet.session", Rh = "mainnet", Dc = { isConnected: !1 }, Xb = (e) => e.address ? Gb(e.address) ?? e.network : e.network, Hg = (e) => !e.isConnected || !e.address ? { ...Dc } : Xb(e) !== Rh ? { ...Dc } : {
  isConnected: !0,
  address: e.address,
  network: Rh,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, Yb = (e) => {
  if (!e)
    return { ...Dc };
  try {
    const t = JSON.parse(e);
    return Hg(t);
  } catch {
    return { ...Dc };
  }
}, qb = (e) => {
  const t = Hg(e);
  return JSON.stringify(t);
}, Wb = (e) => {
  const t = Vb();
  return {
    load: () => Yb(t.getItem(tu)),
    save: (n) => {
      t.setItem(tu, qb(n));
    },
    clear: () => {
      t.removeItem(tu);
    }
  };
}, Zb = "https://browser.blockstack.org/auth", Jb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Dg = ["store_write"], Qb = "blockstack-session", e1 = {
  logLevel: "debug"
}, Vo = {
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
Object.freeze(Vo);
class ji extends Error {
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
class t1 extends ji {
  constructor(t, n = "") {
    super({ code: Vo.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class zh extends ji {
  constructor(t = "") {
    super({ code: Vo.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Xa extends ji {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: Vo.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Gh extends ji {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: Vo.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class Fu extends ji {
  constructor(t) {
    super({ code: Vo.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class Fg extends ji {
  constructor(t) {
    super({ code: Vo.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const Kh = ["debug", "info", "warn", "error", "none"], ju = {};
for (let e = 0; e < Kh.length; e++) {
  const t = Kh[e];
  ju[t] = e;
}
class gi {
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
    return ju[e1.logLevel] <= ju[t];
  }
}
function n1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function r1() {
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
function s1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function o1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function i1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function Yd(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = o1(), s) {
      const o = s[e];
      if (o)
        return o;
    }
  } catch (o) {
    gi.error(`Error getting object '${e}' from global scope '${s}': ${o}`);
  }
  if (t) {
    const o = i1(s, e.toString(), n);
    throw gi.error(o), new Error(o);
  }
  if (r)
    return {};
}
function so(e, t) {
  return qd(An(e), t);
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
  if (Dn(e, Uint8Array))
    return BigInt(`0x${Me(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function a1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Vh(e) {
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
function qd(e, t = 16) {
  const n = Na(e, t);
  return ct(n);
}
function c1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function l1(e, t) {
  return e & BigInt(1) << t;
}
function Ru(e) {
  return u1(BigInt(`0x${Me(e)}`), BigInt(e.byteLength * 8));
}
function u1(e, t) {
  return l1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const d1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Me(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += d1[n];
  return t;
}
function ct(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = a1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function Xo(e) {
  return new TextEncoder().encode(e);
}
function _a(e) {
  return new TextDecoder().decode(e);
}
function f1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function h1(e) {
  return String.fromCharCode.apply(null, e);
}
function p1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Xh(e) {
  if (e.some(p1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function qr(...e) {
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
  return qr(...e.map((t) => typeof t == "number" ? Xh([t]) : t instanceof Array ? Xh(t) : t));
}
function Dn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const jg = "https://api.mainnet.hiro.so", Rg = "https://api.testnet.hiro.so", zg = "http://localhost:3999", g1 = "https://hub.blockstack.org", y1 = 33, ru = 32;
function w1(e) {
  if (e.length < ru * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + ru * 2), r = e.slice(2 + ru * 2);
  return {
    recoveryId: ml(t),
    r: n,
    s: r
  };
}
function Wd(e) {
  const t = typeof e == "string" ? ct(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function m1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function b1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function x1(e, t) {
  return e[t];
}
function S1(e, t, n = 0) {
  return e[n] = t, e;
}
function v1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Bo(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const E1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function A1(e, t) {
  const n = {};
  return Object.assign(n, E1, t), await fetch(e, n);
}
function k1(e) {
  let t = A1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function $1(...e) {
  const { fetchLib: t, middlewares: n } = k1(e);
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
class Gg {
  constructor(t = Dg.slice(), n = ((a) => (a = Yd("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = Zb) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function zu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function I1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Kg(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function L1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  zu(e.outputLen), zu(e.blockLen);
}
function C1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function T1(e, t) {
  Kg(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const xo = {
  number: zu,
  bool: I1,
  bytes: Kg,
  hash: L1,
  exists: C1,
  output: T1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const su = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Hr = (e, t) => e << 32 - t | e >>> t, B1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!B1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function M1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Zd(e) {
  if (typeof e == "string" && (e = M1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Vg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Yo(e) {
  const t = (r) => e().update(Zd(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Xg = class extends Vg {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, xo.hash(t);
    const r = Zd(n);
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
const bl = (e, t, n) => new Xg(e, t).update(n).digest();
bl.create = (e, t) => new Xg(e, t);
function N1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Jd = class extends Vg {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = su(this.buffer);
  }
  update(t) {
    xo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Zd(t);
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
    xo.exists(this), xo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    N1(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const _1 = (e, t, n) => e & t ^ ~e & n, P1 = (e, t, n) => e & t ^ e & n ^ t & n, U1 = new Uint32Array([
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
]), $s = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Is = new Uint32Array(64);
let Yg = class extends Jd {
  constructor() {
    super(64, 32, 8, !1), this.A = $s[0] | 0, this.B = $s[1] | 0, this.C = $s[2] | 0, this.D = $s[3] | 0, this.E = $s[4] | 0, this.F = $s[5] | 0, this.G = $s[6] | 0, this.H = $s[7] | 0;
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
      Is[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Is[d - 15], w = Is[d - 2], v = Hr(m, 7) ^ Hr(m, 18) ^ m >>> 3, E = Hr(w, 17) ^ Hr(w, 19) ^ w >>> 10;
      Is[d] = E + Is[d - 7] + v + Is[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Hr(a, 6) ^ Hr(a, 11) ^ Hr(a, 25), w = h + m + _1(a, c, u) + U1[d] + Is[d] | 0, E = (Hr(r, 2) ^ Hr(r, 13) ^ Hr(r, 22)) + P1(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Is.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, O1 = class extends Yg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ki = Yo(() => new Yg());
Yo(() => new O1());
const H1 = {}, qg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: H1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const st = BigInt(0), Mt = BigInt(1), Qs = BigInt(2), ha = BigInt(3), Yh = BigInt(8), St = Object.freeze({
  a: st,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Mt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), qh = (e, t) => (e + t / Qs) / t, Ya = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = St, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Mt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = qh(o * e, t), c = qh(-r * e, t);
    let u = pe(e - a * n - c * s, t), h = pe(-a * r - c * o, t);
    const d = u > i, m = h > i;
    if (d && (u = t - u), m && (h = t - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: m, k2: h };
  }
}, Ir = 32, Mo = 32, Wg = 32, Fc = Ir + 1, jc = 2 * Ir + 1;
function Wh(e) {
  const { a: t, b: n } = St, r = pe(e * e), s = pe(r * e);
  return pe(s + t * e + n);
}
const qa = St.a === st;
class Qd extends Error {
  constructor(t) {
    super(t);
  }
}
function Zh(e) {
  if (!(e instanceof dt))
    throw new TypeError("JacobianPoint expected");
}
class dt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof qe))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(qe.ZERO) ? dt.ZERO : new dt(t.x, t.y, Mt);
  }
  static toAffineBatch(t) {
    const n = z1(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return dt.toAffineBatch(t).map(dt.fromAffine);
  }
  equals(t) {
    Zh(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t, c = pe(s * s), u = pe(a * a), h = pe(n * u), d = pe(o * c), m = pe(pe(r * a) * u), w = pe(pe(i * s) * c);
    return h === d && m === w;
  }
  negate() {
    return new dt(this.x, pe(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = pe(t * t), o = pe(n * n), i = pe(o * o), a = t + o, c = pe(Qs * (pe(a * a) - s - i)), u = pe(ha * s), h = pe(u * u), d = pe(h - Qs * c), m = pe(u * (c - d) - Yh * i), w = pe(Qs * n * r);
    return new dt(d, m, w);
  }
  add(t) {
    Zh(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t;
    if (o === st || i === st)
      return this;
    if (n === st || r === st)
      return t;
    const c = pe(s * s), u = pe(a * a), h = pe(n * u), d = pe(o * c), m = pe(pe(r * a) * u), w = pe(pe(i * s) * c), v = pe(d - h), E = pe(w - m);
    if (v === st)
      return E === st ? this.double() : dt.ZERO;
    const L = pe(v * v), P = pe(v * L), O = pe(h * L), A = pe(E * E - P - Qs * O), M = pe(E * (O - A) - m * P), U = pe(s * a * v);
    return new dt(A, M, U);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = dt.ZERO;
    if (typeof t == "bigint" && t === st)
      return n;
    let r = ep(t);
    if (r === Mt)
      return this;
    if (!qa) {
      let d = n, m = this;
      for (; r > st; )
        r & Mt && (d = d.add(m)), m = m.double(), r >>= Mt;
      return d;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = Ya.splitScalar(r), c = n, u = n, h = this;
    for (; o > st || a > st; )
      o & Mt && (c = c.add(h)), a & Mt && (u = u.add(h)), h = h.double(), o >>= Mt, a >>= Mt;
    return s && (c = c.negate()), i && (u = u.negate()), u = new dt(pe(u.x * Ya.beta), u.y, u.z), c.add(u);
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
    !n && this.equals(dt.BASE) && (n = qe.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Gu.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = dt.normalizeZ(s), Gu.set(n, s)));
    let o = dt.ZERO, i = dt.BASE;
    const a = 1 + (qa ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let m = 0; m < a; m++) {
      const w = m * c;
      let v = Number(t & u);
      t >>= d, v > c && (v -= h, t += Mt);
      const E = w, L = w + Math.abs(v) - 1, P = m % 2 !== 0, O = v < 0;
      v === 0 ? i = i.add(Wa(P, s[E])) : o = o.add(Wa(O, s[L]));
    }
    return { p: o, f: i };
  }
  multiply(t, n) {
    let r = ep(t), s, o;
    if (qa) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = Ya.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: m, f: w } = this.wNAF(u, n);
      h = Wa(i, h), m = Wa(c, m), m = new dt(pe(m.x * Ya.beta), m.y, m.z), s = h.add(m), o = d.add(w);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return dt.normalizeZ([s, o])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, o = this.equals(dt.ZERO);
    t == null && (t = o ? Yh : Ri(s));
    const i = t, a = pe(i * i), c = pe(a * i), u = pe(n * a), h = pe(r * c), d = pe(s * i);
    if (o)
      return qe.ZERO;
    if (d !== Mt)
      throw new Error("invZ was invalid");
    return new qe(u, h);
  }
}
dt.BASE = new dt(St.Gx, St.Gy, Mt);
dt.ZERO = new dt(st, Mt, st);
function Wa(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Gu = /* @__PURE__ */ new WeakMap();
class qe {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Gu.delete(this);
  }
  hasEvenY() {
    return this.y % Qs === st;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = Qn(n ? t : t.subarray(1));
    if (!Lc(r))
      throw new Error("Point is not on curve");
    const s = Wh(r);
    let o = R1(s);
    const i = (o & Mt) === Mt;
    n ? i && (o = pe(-o)) : (t[0] & 1) === 1 !== i && (o = pe(-o));
    const a = new qe(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = Qn(t.subarray(1, Ir + 1)), r = Qn(t.subarray(Ir + 1, Ir * 2 + 1)), s = new qe(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = Wr(t), r = n.length, s = n[0];
    if (r === Ir)
      return this.fromCompressedHex(n);
    if (r === Fc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === jc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Fc} compressed bytes or ${jc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return qe.BASE.multiply(No(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: o } = Qg(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = ef(Wr(t)), { n: a } = St, c = r === 2 || r === 3 ? s + a : s, u = Ri(c, a), h = pe(-i * u, a), d = pe(o * u, a), m = r & 1 ? "03" : "02", w = qe.fromHex(m + eo(c)), v = qe.BASE.multiplyAndAddUnsafe(w, h, d);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return to(this.toHex(t));
  }
  toHex(t = !1) {
    const n = eo(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${eo(this.y)}`;
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
    const s = pe(r * r), o = Wh(n);
    if (pe(s - o) !== st)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new qe(this.x, pe(-this.y));
  }
  double() {
    return dt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return dt.fromAffine(this).add(dt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return dt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = dt.fromAffine(this), o = n === st || n === Mt || this !== qe.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = dt.fromAffine(t).multiplyUnsafe(r), a = o.add(i);
    return a.equals(dt.ZERO) ? void 0 : a.toAffine();
  }
}
qe.BASE = new qe(St.Gx, St.Gy);
qe.ZERO = new qe(st, st);
function Jh(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Qh(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${$i(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Qn(n), left: e.subarray(t + 2) };
}
function D1(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${$i(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Qh(e.subarray(2)), { data: r, left: s } = Qh(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${$i(s)}`);
  return { r: t, s: r };
}
class Jn {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? $i(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Jn(Rc(s.slice(0, 64)), Rc(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = D1(n ? t : to(t));
    return new Jn(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Li(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Li(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = St.n >> Mt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new Jn(this.r, pe(-this.s, St.n)) : this;
  }
  toDERRawBytes() {
    return to(this.toDERHex());
  }
  toDERHex() {
    const t = Jh(na(this.s)), n = Jh(na(this.r)), r = t.length / 2, s = n.length / 2, o = na(r), i = na(s);
    return `30${na(s + r + 4)}02${i}${n}02${o}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return to(this.toCompactHex());
  }
  toCompactHex() {
    return eo(this.r) + eo(this.s);
  }
}
function Zs(...e) {
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
const F1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function $i(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += F1[e[n]];
  return t;
}
const j1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function eo(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(st <= e && e < j1))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Ii(e) {
  const t = to(eo(e));
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
function to(e) {
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
function Qn(e) {
  return Rc($i(e));
}
function Wr(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : to(e);
}
function ep(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Li(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function pe(e, t = St.P) {
  const n = e % t;
  return n >= st ? n : t + n;
}
function or(e, t) {
  const { P: n } = St;
  let r = e;
  for (; t-- > st; )
    r *= r, r %= n;
  return r;
}
function R1(e) {
  const { P: t } = St, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, h = or(u, ha) * u % t, d = or(h, ha) * u % t, m = or(d, Qs) * c % t, w = or(m, r) * m % t, v = or(w, s) * w % t, E = or(v, i) * v % t, L = or(E, a) * E % t, P = or(L, i) * v % t, O = or(P, ha) * u % t, A = or(O, o) * w % t, M = or(A, n) * c % t, U = or(M, Qs);
  if (U * U % t !== e)
    throw new Error("Cannot find square root");
  return U;
}
function Ri(e, t = St.P) {
  if (e === st || t <= st)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = pe(e, t), r = t, s = st, o = Mt;
  for (; n !== st; ) {
    const a = r / n, c = r % n, u = s - o * a;
    r = n, n = c, s = o, o = u;
  }
  if (r !== Mt)
    throw new Error("invert: does not exist");
  return pe(s, t);
}
function z1(e, t = St.P) {
  const n = new Array(e.length), r = e.reduce((o, i, a) => i === st ? o : (n[a] = o, pe(o * i, t)), Mt), s = Ri(r, t);
  return e.reduceRight((o, i, a) => i === st ? o : (n[a] = pe(o * n[a], t), pe(o * i, t)), s), n;
}
function G1(e) {
  const t = e.length * 8 - Mo * 8, n = Qn(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function ef(e, t = !1) {
  const n = G1(e);
  if (t)
    return n;
  const { n: r } = St;
  return n >= r ? n - r : n;
}
let Si, pa;
class Zg {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return zt.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return pa(this.k, ...t);
  }
  checkSync() {
    if (typeof pa != "function")
      throw new Qd("hmacSha256Sync needs to be set");
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
    return Zs(...n);
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
    return Zs(...n);
  }
}
function Li(e) {
  return st < e && e < St.n;
}
function Lc(e) {
  return st < e && e < St.P;
}
function Jg(e, t, n, r = !0) {
  const { n: s } = St, o = ef(e, !0);
  if (!Li(o))
    return;
  const i = Ri(o, s), a = qe.BASE.multiply(o), c = pe(a.x, s);
  if (c === st)
    return;
  const u = pe(i * pe(t + n * c, s), s);
  if (u === st)
    return;
  let h = new Jn(c, u), d = (a.x === h.r ? 0 : 2) | Number(a.y & Mt);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function No(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Mo)
      throw new Error("Expected 32 bytes of private key");
    t = Rc(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Mo)
      throw new Error("Expected 32 bytes of private key");
    t = Qn(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Li(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function tf(e) {
  return e instanceof qe ? (e.assertValidity(), e) : qe.fromHex(e);
}
function Qg(e) {
  if (e instanceof Jn)
    return e.assertValidity(), e;
  try {
    return Jn.fromDER(e);
  } catch {
    return Jn.fromCompact(e);
  }
}
function Pa(e, t = !1) {
  return qe.fromPrivateKey(e).toRawBytes(t);
}
function K1(e, t, n, r = !1) {
  return qe.fromSignature(e, t, n).toRawBytes(r);
}
function tp(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === Fc || r === jc : n ? r === Fc * 2 || r === jc * 2 : e instanceof qe;
}
function nf(e, t, n = !1) {
  if (tp(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!tp(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = tf(t);
  return r.assertValidity(), r.multiply(No(e)).toRawBytes(n);
}
function ey(e) {
  const t = e.length > Ir ? e.slice(0, Ir) : e;
  return Qn(t);
}
function V1(e) {
  const t = ey(e), n = pe(t, St.n);
  return ty(n < st ? t : n);
}
function ty(e) {
  return Ii(e);
}
function ny(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = Wr(e), s = No(t), o = [ty(s), V1(r)];
  if (n != null) {
    n === !0 && (n = zt.randomBytes(Ir));
    const c = Wr(n);
    if (c.length !== Ir)
      throw new Error(`sign: Expected ${Ir} bytes of extra data`);
    o.push(c);
  }
  const i = Zs(...o), a = ey(r);
  return { seed: i, m: a, d: s };
}
function ry(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, t), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function X1(e, t, n = {}) {
  const { seed: r, m: s, d: o } = ny(e, t, n.extraEntropy), i = new Zg(Wg, Mo);
  await i.reseed(r);
  let a;
  for (; !(a = Jg(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return ry(a, n);
}
function xl(e, t, n = {}) {
  const { seed: r, m: s, d: o } = ny(e, t, n.extraEntropy), i = new Zg(Wg, Mo);
  i.reseedSync(r);
  let a;
  for (; !(a = Jg(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return ry(a, n);
}
const Y1 = { strict: !0 };
function q1(e, t, n, r = Y1) {
  let s;
  try {
    s = Qg(e), t = Wr(t);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = ef(t);
  let c;
  try {
    c = tf(n);
  } catch {
    return !1;
  }
  const { n: u } = St, h = Ri(i, u), d = pe(a * h, u), m = pe(o * h, u), w = qe.BASE.multiplyAndAddUnsafe(c, d, m);
  return w ? pe(w.x, u) === o : !1;
}
function zc(e) {
  return pe(Qn(e), St.n);
}
class Ci {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = Wr(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Qn(n.subarray(0, 32)), s = Qn(n.subarray(32, 64));
    return new Ci(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Lc(t) || !Li(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return eo(this.r) + eo(this.s);
  }
  toRawBytes() {
    return to(this.toHex());
  }
}
function W1(e) {
  return qe.fromPrivateKey(e).toRawX();
}
class sy {
  constructor(t, n, r = zt.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = Wr(t);
    const { x: s, scalar: o } = this.getScalar(No(n));
    if (this.px = s, this.d = o, this.rand = Wr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = qe.fromPrivateKey(t), r = n.hasEvenY() ? t : St.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Ii(t ^ Qn(n));
  }
  finalizeNonce(t) {
    const n = pe(Qn(t), St.n);
    if (n === st)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(t, n, r, s) {
    return new Ci(t.x, pe(n + r * s, St.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, o = zt.taggedHash, i = this.initNonce(n, await o(Ws.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await o(Ws.nonce, i, r, t)), h = zc(await o(Ws.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return await ay(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, o = zt.taggedHashSync, i = this.initNonce(n, o(Ws.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(o(Ws.nonce, i, r, t)), h = zc(o(Ws.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return cy(d, t, r) || this.error(), d;
  }
}
async function Z1(e, t, n) {
  return new sy(e, t, n).calc();
}
function J1(e, t, n) {
  return new sy(e, t, n).calcSync();
}
function oy(e, t, n) {
  const r = e instanceof Ci, s = r ? e : Ci.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: Wr(t),
    P: tf(n)
  };
}
function iy(e, t, n, r) {
  const s = qe.BASE.multiplyAndAddUnsafe(t, No(n), pe(-r, St.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function ay(e, t, n) {
  try {
    const { r, s, m: o, P: i } = oy(e, t, n), a = zc(await zt.taggedHash(Ws.challenge, Ii(r), i.toRawX(), o));
    return iy(r, i, s, a);
  } catch {
    return !1;
  }
}
function cy(e, t, n) {
  try {
    const { r, s, m: o, P: i } = oy(e, t, n), a = zc(zt.taggedHashSync(Ws.challenge, Ii(r), i.toRawX(), o));
    return iy(r, i, s, a);
  } catch (r) {
    if (r instanceof Qd)
      throw r;
    return !1;
  }
}
const Q1 = {
  Signature: Ci,
  getPublicKey: W1,
  sign: Z1,
  verify: ay,
  signSync: J1,
  verifySync: cy
};
qe.BASE._setWindowSize(8);
const Kn = {
  node: qg,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ws = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Za = {}, zt = {
  bytesToHex: $i,
  hexToBytes: to,
  concatBytes: Zs,
  mod: pe,
  invert: Ri,
  isValidPrivateKey(e) {
    try {
      return No(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ii,
  _normalizePrivateKey: No,
  hashToPrivateKey: (e) => {
    e = Wr(e);
    const t = Mo + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = pe(Qn(e), St.n - Mt) + Mt;
    return Ii(n);
  },
  randomBytes: (e = 32) => {
    if (Kn.web)
      return Kn.web.getRandomValues(new Uint8Array(e));
    if (Kn.node) {
      const { randomBytes: t } = Kn.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => zt.hashToPrivateKey(zt.randomBytes(Mo + 8)),
  precompute(e = 8, t = qe.BASE) {
    const n = t === qe.BASE ? t : new qe(t.x, t.y);
    return n._setWindowSize(e), n.multiply(ha), n;
  },
  sha256: async (...e) => {
    if (Kn.web) {
      const t = await Kn.web.subtle.digest("SHA-256", Zs(...e));
      return new Uint8Array(t);
    } else if (Kn.node) {
      const { createHash: t } = Kn.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (Kn.web) {
      const n = await Kn.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Zs(...t), s = await Kn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Kn.node) {
      const { createHmac: n } = Kn.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = Za[e];
    if (n === void 0) {
      const r = await zt.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Zs(r, r), Za[e] = n;
    }
    return zt.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Si != "function")
      throw new Qd("sha256Sync is undefined, you need to set it");
    let n = Za[e];
    if (n === void 0) {
      const r = Si(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Zs(r, r), Za[e] = n;
    }
    return Si(n, ...t);
  },
  _JacobianPoint: dt
};
Object.defineProperties(zt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Si;
    },
    set(e) {
      Si || (Si = e);
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
const e2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: St,
  Point: qe,
  Signature: Jn,
  getPublicKey: Pa,
  getSharedSecret: nf,
  recoverPublicKey: K1,
  schnorr: Q1,
  sign: X1,
  signSync: xl,
  utils: zt,
  verify: q1
}, Symbol.toStringTag, { value: "Module" }));
var Ua = {};
Ua.byteLength = o2;
var t2 = Ua.toByteArray = a2, n2 = Ua.fromByteArray = u2, zr = [], cr = [], r2 = typeof Uint8Array < "u" ? Uint8Array : Array, ou = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ai = 0, s2 = ou.length; ai < s2; ++ai)
  zr[ai] = ou[ai], cr[ou.charCodeAt(ai)] = ai;
cr[45] = 62;
cr[95] = 63;
function ly(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function o2(e) {
  var t = ly(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function i2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function a2(e) {
  var t, n = ly(e), r = n[0], s = n[1], o = new r2(i2(e, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = cr[e.charCodeAt(c)] << 18 | cr[e.charCodeAt(c + 1)] << 12 | cr[e.charCodeAt(c + 2)] << 6 | cr[e.charCodeAt(c + 3)], o[i++] = t >> 16 & 255, o[i++] = t >> 8 & 255, o[i++] = t & 255;
  return s === 2 && (t = cr[e.charCodeAt(c)] << 2 | cr[e.charCodeAt(c + 1)] >> 4, o[i++] = t & 255), s === 1 && (t = cr[e.charCodeAt(c)] << 10 | cr[e.charCodeAt(c + 1)] << 4 | cr[e.charCodeAt(c + 2)] >> 2, o[i++] = t >> 8 & 255, o[i++] = t & 255), o;
}
function c2(e) {
  return zr[e >> 18 & 63] + zr[e >> 12 & 63] + zr[e >> 6 & 63] + zr[e & 63];
}
function l2(e, t, n) {
  for (var r, s = [], o = t; o < n; o += 3)
    r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), s.push(c2(r));
  return s.join("");
}
function u2(e) {
  for (var t, n = e.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(l2(e, i, i + o > a ? a : i + o));
  return r === 1 ? (t = e[n - 1], s.push(
    zr[t >> 2] + zr[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    zr[t >> 10] + zr[t >> 4 & 63] + zr[t << 2 & 63] + "="
  )), s.join("");
}
function d2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const f2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function h2() {
  if (d2())
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
    throw new Error(f2);
  }
}
class p2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createCipher(t, n, r), i = new Uint8Array(qr(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createDecipher(t, n, r), i = new Uint8Array(qr(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class g2 {
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
async function uy() {
  const e = await h2();
  return e.name === "subtleCrypto" ? new g2(e.lib) : new p2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function y2(e) {
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
    for (var v = 0, E = 0, L = 0, P = w.length; L !== P && w[L] === 0; )
      L++, v++;
    for (var O = (P - L) * u + 1 >>> 0, A = new Uint8Array(O); L !== P; ) {
      for (var M = w[L], U = 0, X = O - 1; (M !== 0 || U < E) && X !== -1; X--, U++)
        M += 256 * A[X] >>> 0, A[X] = M % i >>> 0, M = M / i >>> 0;
      if (M !== 0)
        throw new Error("Non-zero carry");
      E = U, L++;
    }
    for (var ae = O - E; ae !== O && A[ae] === 0; )
      ae++;
    for (var se = a.repeat(v); ae < O; ++ae)
      se += e.charAt(A[ae]);
    return se;
  }
  function d(w) {
    if (typeof w != "string")
      throw new TypeError("Expected String");
    if (w.length === 0)
      return new Uint8Array();
    for (var v = 0, E = 0, L = 0; w[v] === a; )
      E++, v++;
    for (var P = (w.length - v) * c + 1 >>> 0, O = new Uint8Array(P); w[v]; ) {
      var A = w.charCodeAt(v);
      if (A > 255)
        return;
      var M = t[A];
      if (M === 255)
        return;
      for (var U = 0, X = P - 1; (M !== 0 || U < L) && X !== -1; X--, U++)
        M += i * O[X] >>> 0, O[X] = M % 256 >>> 0, M = M / 256 >>> 0;
      if (M !== 0)
        throw new Error("Non-zero carry");
      L = U, v++;
    }
    for (var ae = P - L; ae !== P && O[ae] === 0; )
      ae++;
    for (var se = new Uint8Array(E + (P - ae)), Y = E; ae !== P; )
      se[Y++] = O[ae++];
    return se;
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
var dy = y2;
const w2 = dy, m2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var b2 = w2(m2);
const x2 = /* @__PURE__ */ Pg(b2), S2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fy = Uint8Array.from({ length: 16 }, (e, t) => t), v2 = fy.map((e) => (9 * e + 5) % 16);
let rf = [fy], sf = [v2];
for (let e = 0; e < 4; e++)
  for (let t of [rf, sf])
    t.push(t[e].map((n) => S2[n]));
const hy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), E2 = rf.map((e, t) => e.map((n) => hy[t][n])), A2 = sf.map((e, t) => e.map((n) => hy[t][n])), k2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), $2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ja = (e, t) => e << t | e >>> 32 - t;
function np(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Qa = new Uint32Array(16);
let I2 = class extends Jd {
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
      const v = 4 - w, E = k2[w], L = $2[w], P = rf[w], O = sf[w], A = E2[w], M = A2[w];
      for (let U = 0; U < 16; U++) {
        const X = Ja(r + np(w, o, a, u) + Qa[P[U]] + E, A[U]) + d | 0;
        r = d, d = u, u = Ja(a, 10) | 0, a = o, o = X;
      }
      for (let U = 0; U < 16; U++) {
        const X = Ja(s + np(v, i, c, h) + Qa[O[U]] + L, M[U]) + m | 0;
        s = m, m = h, h = Ja(c, 10) | 0, c = i, i = X;
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
const L2 = Yo(() => new I2());
function C2(e) {
  return L2(e);
}
const ec = BigInt(2 ** 32 - 1), Ku = BigInt(32);
function py(e, t = !1) {
  return t ? { h: Number(e & ec), l: Number(e >> Ku & ec) } : { h: Number(e >> Ku & ec) | 0, l: Number(e & ec) | 0 };
}
function T2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = py(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const B2 = (e, t) => BigInt(e >>> 0) << Ku | BigInt(t >>> 0), M2 = (e, t, n) => e >>> n, N2 = (e, t, n) => e << 32 - n | t >>> n, _2 = (e, t, n) => e >>> n | t << 32 - n, P2 = (e, t, n) => e << 32 - n | t >>> n, U2 = (e, t, n) => e << 64 - n | t >>> n - 32, O2 = (e, t, n) => e >>> n - 32 | t << 64 - n, H2 = (e, t) => t, D2 = (e, t) => e, F2 = (e, t, n) => e << n | t >>> 32 - n, j2 = (e, t, n) => t << n | e >>> 32 - n, R2 = (e, t, n) => t << n - 32 | e >>> 64 - n, z2 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function G2(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const K2 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), V2 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, X2 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Y2 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, q2 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), W2 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, ze = {
  fromBig: py,
  split: T2,
  toBig: B2,
  shrSH: M2,
  shrSL: N2,
  rotrSH: _2,
  rotrSL: P2,
  rotrBH: U2,
  rotrBL: O2,
  rotr32H: H2,
  rotr32L: D2,
  rotlSH: F2,
  rotlSL: j2,
  rotlBH: R2,
  rotlBL: z2,
  add: G2,
  add3L: K2,
  add3H: V2,
  add4L: X2,
  add4H: Y2,
  add5H: W2,
  add5L: q2
}, [Z2, J2] = ze.split([
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
].map((e) => BigInt(e))), Ls = new Uint32Array(80), Cs = new Uint32Array(80);
let Sl = class extends Jd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: E, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, m, w, v, E, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, m, w, v, E, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = E | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ls[A] = t.getUint32(n), Cs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const M = Ls[A - 15] | 0, U = Cs[A - 15] | 0, X = ze.rotrSH(M, U, 1) ^ ze.rotrSH(M, U, 8) ^ ze.shrSH(M, U, 7), ae = ze.rotrSL(M, U, 1) ^ ze.rotrSL(M, U, 8) ^ ze.shrSL(M, U, 7), se = Ls[A - 2] | 0, Y = Cs[A - 2] | 0, b = ze.rotrSH(se, Y, 19) ^ ze.rotrBH(se, Y, 61) ^ ze.shrSH(se, Y, 6), $ = ze.rotrSL(se, Y, 19) ^ ze.rotrBL(se, Y, 61) ^ ze.shrSL(se, Y, 6), N = ze.add4L(ae, $, Cs[A - 7], Cs[A - 16]), _ = ze.add4H(N, X, b, Ls[A - 7], Ls[A - 16]);
      Ls[A] = _ | 0, Cs[A] = N | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: E, Gl: L, Hh: P, Hl: O } = this;
    for (let A = 0; A < 80; A++) {
      const M = ze.rotrSH(d, m, 14) ^ ze.rotrSH(d, m, 18) ^ ze.rotrBH(d, m, 41), U = ze.rotrSL(d, m, 14) ^ ze.rotrSL(d, m, 18) ^ ze.rotrBL(d, m, 41), X = d & w ^ ~d & E, ae = m & v ^ ~m & L, se = ze.add5L(O, U, ae, J2[A], Cs[A]), Y = ze.add5H(se, P, M, X, Z2[A], Ls[A]), b = se | 0, $ = ze.rotrSH(r, s, 28) ^ ze.rotrBH(r, s, 34) ^ ze.rotrBH(r, s, 39), N = ze.rotrSL(r, s, 28) ^ ze.rotrBL(r, s, 34) ^ ze.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, q = s & i ^ s & c ^ i & c;
      P = E | 0, O = L | 0, E = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = ze.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const R = ze.add3L(b, N, q);
      r = ze.add3H(R, Y, $, _), s = R | 0;
    }
    ({ h: r, l: s } = ze.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = ze.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = ze.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = ze.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = ze.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = ze.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: E, l: L } = ze.add(this.Gh | 0, this.Gl | 0, E | 0, L | 0), { h: P, l: O } = ze.add(this.Hh | 0, this.Hl | 0, P | 0, O | 0), this.set(r, s, o, i, a, c, u, h, d, m, w, v, E, L, P, O);
  }
  roundClean() {
    Ls.fill(0), Cs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Q2 = class extends Sl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ex = class extends Sl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, tx = class extends Sl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const nx = Yo(() => new Sl());
Yo(() => new Q2());
Yo(() => new ex());
Yo(() => new tx());
function gy(e) {
  return ki(e);
}
function rx(e) {
  return nx(e);
}
const sx = 0;
zt.hmacSha256Sync = (e, ...t) => {
  const n = bl.create(ki, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ox() {
  return Me(zt.randomPrivateKey());
}
function ix(e) {
  const t = ki(ki(e));
  return x2.encode(qr(e, t).slice(0, e.length + 4));
}
function ax(e, t) {
  return ix(qr(new Uint8Array([e]), t.slice(0, 20)));
}
function yy(e, t = sx) {
  const n = typeof e == "string" ? ct(e) : e, r = C2(gy(n));
  return ax(t, r);
}
function wy(e) {
  const t = Wd(e);
  return Me(Pa(t.slice(0, 32), !0));
}
zt.hmacSha256Sync = (e, ...t) => {
  const n = bl.create(ki, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var Gc;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(Gc || (Gc = {}));
async function cx(e, t, n) {
  return await (await uy()).encrypt("aes-256-cbc", t, e, n);
}
async function lx(e, t, n) {
  return await (await uy()).decrypt("aes-256-cbc", t, e, n);
}
function my(e, t) {
  return bl(ki, e, t);
}
function ux(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function by(e) {
  const t = rx(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function dx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function fx(e) {
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
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !dx(e))
    return t;
  try {
    return qe.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function hx(e, t, n, r) {
  const s = fx(e);
  if (!s.result)
    throw s;
  const o = zt.randomPrivateKey(), i = Pa(o, !0);
  let a = nf(o, e, !0);
  a = a.slice(1);
  const c = by(a), u = zt.randomBytes(16), h = await cx(u, c.encryptionKey, t), d = qr(u, i, h), m = my(c.hmacKey, d);
  let w;
  if (!r || r === "hex")
    w = Me(h);
  else if (r === "base64")
    w = n2(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const v = {
    iv: Me(u),
    ephemeralPK: Me(i),
    cipherText: w,
    mac: Me(m),
    wasString: n
  };
  return r && r !== "hex" && (v.cipherTextEncoding = r), v;
}
async function xy(e, t) {
  if (!t.ephemeralPK)
    throw new Gh("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = nf(e, n, !0);
  r = r.slice(1);
  const s = by(r), o = ct(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = ct(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = t2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = qr(o, ct(n), i), c = my(s.hmacKey, a), u = ct(t.mac);
  if (!ux(u, c))
    throw new Gh("Decryption failed: failure in MAC check");
  const h = await lx(o, s.encryptionKey, i);
  return t.wasString ? _a(h) : h;
}
function px(e, t) {
  const n = typeof t == "string" ? Xo(t) : t, r = wy(e), s = gy(n), o = xl(s, e);
  return {
    signature: Me(o),
    publicKey: r
  };
}
async function gx(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = wy(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", o = typeof e == "string" ? Xo(e) : e, i = await hx(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = px(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function yx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return xy(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var pn = {}, Ti = {}, In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
In.decode = In.encode = In.unescape = In.escape = In.pad = void 0;
const Sy = Ua;
function of(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
In.pad = of;
function vy(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
In.escape = vy;
function Ey(e) {
  return of(e).replace(/-/g, "+").replace(/_/g, "/");
}
In.unescape = Ey;
function wx(e) {
  return vy((0, Sy.fromByteArray)(new TextEncoder().encode(e)));
}
In.encode = wx;
function mx(e) {
  return new TextDecoder().decode((0, Sy.toByteArray)(of(Ey(e))));
}
In.decode = mx;
var vl = {}, El = {}, Ay = {}, ky = {}, Al = {};
Object.defineProperty(Al, "__esModule", { value: !0 });
Al.crypto = void 0;
Al.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = o, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = u, e.clean = h, e.createView = d, e.rotr = m, e.rotl = w, e.byteSwap = v, e.byteSwap32 = E, e.bytesToHex = O, e.hexToBytes = U, e.asyncLoop = ae, e.utf8ToBytes = se, e.bytesToUtf8 = Y, e.toBytes = b, e.kdfInputToBytes = $, e.concatBytes = N, e.checkOpts = _, e.createHasher = R, e.createOptHasher = ce, e.createXOFer = le, e.randomBytes = He;
  const t = Al;
  function n(I) {
    return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
  }
  function r(I) {
    if (!Number.isSafeInteger(I) || I < 0)
      throw new Error("positive integer expected, got " + I);
  }
  function s(I, ...j) {
    if (!n(I))
      throw new Error("Uint8Array expected");
    if (j.length > 0 && !j.includes(I.length))
      throw new Error("Uint8Array expected of length " + j + ", got length=" + I.length);
  }
  function o(I) {
    if (typeof I != "function" || typeof I.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(I.outputLen), r(I.blockLen);
  }
  function i(I, j = !0) {
    if (I.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (j && I.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(I, j) {
    s(I);
    const ue = j.outputLen;
    if (I.length < ue)
      throw new Error("digestInto() expects output buffer of length at least " + ue);
  }
  function c(I) {
    return new Uint8Array(I.buffer, I.byteOffset, I.byteLength);
  }
  function u(I) {
    return new Uint32Array(I.buffer, I.byteOffset, Math.floor(I.byteLength / 4));
  }
  function h(...I) {
    for (let j = 0; j < I.length; j++)
      I[j].fill(0);
  }
  function d(I) {
    return new DataView(I.buffer, I.byteOffset, I.byteLength);
  }
  function m(I, j) {
    return I << 32 - j | I >>> j;
  }
  function w(I, j) {
    return I << j | I >>> 32 - j >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v(I) {
    return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (I) => I : (I) => v(I), e.byteSwapIfBE = e.swap8IfBE;
  function E(I) {
    for (let j = 0; j < I.length; j++)
      I[j] = v(I[j]);
    return I;
  }
  e.swap32IfBE = e.isLE ? (I) => I : E;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", P = /* @__PURE__ */ Array.from({ length: 256 }, (I, j) => j.toString(16).padStart(2, "0"));
  function O(I) {
    if (s(I), L)
      return I.toHex();
    let j = "";
    for (let ue = 0; ue < I.length; ue++)
      j += P[I[ue]];
    return j;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function M(I) {
    if (I >= A._0 && I <= A._9)
      return I - A._0;
    if (I >= A.A && I <= A.F)
      return I - (A.A - 10);
    if (I >= A.a && I <= A.f)
      return I - (A.a - 10);
  }
  function U(I) {
    if (typeof I != "string")
      throw new Error("hex string expected, got " + typeof I);
    if (L)
      return Uint8Array.fromHex(I);
    const j = I.length, ue = j / 2;
    if (j % 2)
      throw new Error("hex string expected, got unpadded hex of length " + j);
    const ge = new Uint8Array(ue);
    for (let Ce = 0, Te = 0; Ce < ue; Ce++, Te += 2) {
      const It = M(I.charCodeAt(Te)), Oe = M(I.charCodeAt(Te + 1));
      if (It === void 0 || Oe === void 0) {
        const Ie = I[Te] + I[Te + 1];
        throw new Error('hex string expected, got non-hex character "' + Ie + '" at index ' + Te);
      }
      ge[Ce] = It * 16 + Oe;
    }
    return ge;
  }
  const X = async () => {
  };
  e.nextTick = X;
  async function ae(I, j, ue) {
    let ge = Date.now();
    for (let Ce = 0; Ce < I; Ce++) {
      ue(Ce);
      const Te = Date.now() - ge;
      Te >= 0 && Te < j || (await (0, e.nextTick)(), ge += Te);
    }
  }
  function se(I) {
    if (typeof I != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(I));
  }
  function Y(I) {
    return new TextDecoder().decode(I);
  }
  function b(I) {
    return typeof I == "string" && (I = se(I)), s(I), I;
  }
  function $(I) {
    return typeof I == "string" && (I = se(I)), s(I), I;
  }
  function N(...I) {
    let j = 0;
    for (let ge = 0; ge < I.length; ge++) {
      const Ce = I[ge];
      s(Ce), j += Ce.length;
    }
    const ue = new Uint8Array(j);
    for (let ge = 0, Ce = 0; ge < I.length; ge++) {
      const Te = I[ge];
      ue.set(Te, Ce), Ce += Te.length;
    }
    return ue;
  }
  function _(I, j) {
    if (j !== void 0 && {}.toString.call(j) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(I, j);
  }
  class q {
  }
  e.Hash = q;
  function R(I) {
    const j = (ge) => I().update(b(ge)).digest(), ue = I();
    return j.outputLen = ue.outputLen, j.blockLen = ue.blockLen, j.create = () => I(), j;
  }
  function ce(I) {
    const j = (ge, Ce) => I(Ce).update(b(ge)).digest(), ue = I({});
    return j.outputLen = ue.outputLen, j.blockLen = ue.blockLen, j.create = (ge) => I(ge), j;
  }
  function le(I) {
    const j = (ge, Ce) => I(Ce).update(b(ge)).digest(), ue = I({});
    return j.outputLen = ue.outputLen, j.blockLen = ue.blockLen, j.create = (ge) => I(ge), j;
  }
  e.wrapConstructor = R, e.wrapConstructorWithOpts = ce, e.wrapXOFConstructorWithOpts = le;
  function He(I = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(I));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(I));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(ky);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = ky;
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
})(Ay);
const ci = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function $y(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Vu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function qo(e, ...t) {
  if (!$y(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function bx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Vu(e.outputLen), Vu(e.blockLen);
}
function Xu(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Iy(e, t) {
  qo(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function xx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function Sx(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Kc(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Cc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function br(e, t) {
  return e << 32 - t | e >>> t;
}
function vx(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const af = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function cf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const Ly = af ? (e) => e : (e) => cf(e), Ex = Ly;
function Cy(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = cf(e[t]);
  return e;
}
const Ax = af ? (e) => e : Cy, Ty = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", kx = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function lf(e) {
  if (qo(e), Ty)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += kx[e[n]];
  return t;
}
const is = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function rp(e) {
  if (e >= is._0 && e <= is._9)
    return e - is._0;
  if (e >= is.A && e <= is.F)
    return e - (is.A - 10);
  if (e >= is.a && e <= is.f)
    return e - (is.a - 10);
}
function $x(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (Ty)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = rp(e.charCodeAt(o)), a = rp(e.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const By = async () => {
};
async function Ix(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < t || (await By(), r += o);
  }
}
function uf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function Lx(e) {
  return new TextDecoder().decode(e);
}
function Oa(e) {
  return typeof e == "string" && (e = uf(e)), qo(e), e;
}
function Cx(e) {
  return typeof e == "string" && (e = uf(e)), qo(e), e;
}
function Tx(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    qo(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Bx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let My = class {
};
function kl(e) {
  const t = (r) => e().update(Oa(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Ny(e) {
  const t = (r, s) => e(s).update(Oa(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function _y(e) {
  const t = (r, s) => e(s).update(Oa(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const Mx = kl, Nx = Ny, _x = _y;
function Px(e = 32) {
  if (ci && typeof ci.getRandomValues == "function")
    return ci.getRandomValues(new Uint8Array(e));
  if (ci && typeof ci.randomBytes == "function")
    return Uint8Array.from(ci.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const Ux = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: My,
  abytes: qo,
  aexists: Xu,
  ahash: bx,
  anumber: Vu,
  aoutput: Iy,
  asyncLoop: Ix,
  byteSwap: cf,
  byteSwap32: Cy,
  byteSwapIfBE: Ex,
  bytesToHex: lf,
  bytesToUtf8: Lx,
  checkOpts: Bx,
  clean: Kc,
  concatBytes: Tx,
  createHasher: kl,
  createOptHasher: Ny,
  createView: Cc,
  createXOFer: _y,
  hexToBytes: $x,
  isBytes: $y,
  isLE: af,
  kdfInputToBytes: Cx,
  nextTick: By,
  randomBytes: Px,
  rotl: vx,
  rotr: br,
  swap32IfBE: Ax,
  swap8IfBE: Ly,
  toBytes: Oa,
  u32: Sx,
  u8: xx,
  utf8ToBytes: uf,
  wrapConstructor: Mx,
  wrapConstructorWithOpts: Nx,
  wrapXOFConstructorWithOpts: _x
}, Symbol.toStringTag, { value: "Module" }));
function Ox(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function Hx(e, t, n) {
  return e & t ^ ~e & n;
}
function Dx(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class Fx extends My {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Cc(this.buffer);
  }
  update(t) {
    Xu(this), t = Oa(t), qo(t);
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
    Xu(this), Iy(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, Kc(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    Ox(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const Ts = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Bs = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), jx = /* @__PURE__ */ Uint32Array.from([
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
]), Ms = /* @__PURE__ */ new Uint32Array(64);
let df = class extends Fx {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = Ts[0] | 0, this.B = Ts[1] | 0, this.C = Ts[2] | 0, this.D = Ts[3] | 0, this.E = Ts[4] | 0, this.F = Ts[5] | 0, this.G = Ts[6] | 0, this.H = Ts[7] | 0;
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
      const m = Ms[d - 15], w = Ms[d - 2], v = br(m, 7) ^ br(m, 18) ^ m >>> 3, E = br(w, 17) ^ br(w, 19) ^ w >>> 10;
      Ms[d] = E + Ms[d - 7] + v + Ms[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = br(a, 6) ^ br(a, 11) ^ br(a, 25), w = h + m + Hx(a, c, u) + jx[d] + Ms[d] | 0, E = (br(r, 2) ^ br(r, 13) ^ br(r, 22)) + Dx(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Kc(Ms);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Kc(this.buffer);
  }
}, Py = class extends df {
  constructor() {
    super(28), this.A = Bs[0] | 0, this.B = Bs[1] | 0, this.C = Bs[2] | 0, this.D = Bs[3] | 0, this.E = Bs[4] | 0, this.F = Bs[5] | 0, this.G = Bs[6] | 0, this.H = Bs[7] | 0;
  }
};
const Rx = /* @__PURE__ */ kl(() => new df()), zx = /* @__PURE__ */ kl(() => new Py()), Gx = df, ff = Rx, Kx = Py, Vx = zx, Xx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Kx,
  SHA256: Gx,
  sha224: Vx,
  sha256: ff
}, Symbol.toStringTag, { value: "Module" })), $l = /* @__PURE__ */ wl(Xx), Yx = /* @__PURE__ */ wl(e2);
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.joseToDer = Bi.derToJose = void 0;
const Uy = Ua, Oy = In;
function iu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const qx = {
  ES256: iu(256),
  ES384: iu(384),
  ES512: iu(521)
};
function Hy(e) {
  const t = qx[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const Vc = 128, Dy = 0, Wx = 32, Zx = 16, Jx = 2, Fy = Zx | Wx | Dy << 6, Xc = Jx | Dy << 6;
function jy(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, Uy.toByteArray)((0, Oy.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Qx(e, t) {
  const n = jy(e), r = Hy(t), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== Fy)
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
  for (const E = i; i < E + w; ++i)
    v[i] = 0;
  return v.set(n.subarray(d + Math.max(-w, 0), d + h), i), (0, Oy.escape)((0, Uy.fromByteArray)(v));
}
Bi.derToJose = Qx;
function sp(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= Vc && --r, r;
}
function eS(e, t) {
  e = jy(e);
  const n = Hy(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = sp(e, 0, n), o = sp(e, n, e.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, u = c < Vc, h = new Uint8Array((u ? 2 : 3) + c);
  let d = 0;
  return h[d++] = Fy, u ? h[d++] = c : (h[d++] = Vc | 1, h[d++] = c & 255), h[d++] = Xc, h[d++] = i, s < 0 ? (h[d++] = 0, h.set(e.subarray(0, n), d), d += n) : (h.set(e.subarray(s, n), d), d += n - s), h[d++] = Xc, h[d++] = a, o < 0 ? (h[d++] = 0, h.set(e.subarray(n), d)) : h.set(e.subarray(n + o), d), h;
}
Bi.joseToDer = eS;
var gs = {};
Object.defineProperty(gs, "__esModule", { value: !0 });
gs.InvalidTokenError = gs.MissingParametersError = void 0;
class tS extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
gs.MissingParametersError = tS;
class nS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
gs.InvalidTokenError = nS;
const Ha = /* @__PURE__ */ wl(Ux);
Object.defineProperty(El, "__esModule", { value: !0 });
El.SECP256K1Client = void 0;
const rS = Ay, sS = $l, Tc = Yx, op = Bi, ip = gs, ap = Ha;
Tc.utils.hmacSha256Sync = (e, ...t) => {
  const n = rS.hmac.create(sS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class Ry {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, ap.bytesToHex)(Tc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new ip.MissingParametersError("a signing input hash and private key are all required");
    const s = Tc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, ap.bytesToHex)(s);
    if (r === "jose")
      return (0, op.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, op.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new ip.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Tc.verify(n, t, r, { strict: !1 });
  }
}
El.SECP256K1Client = Ry;
Ry.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = El;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(vl);
var _o = {};
const oS = /* @__PURE__ */ wl(qg);
var iS = Cn && Cn.__awaiter || function(e, t, n, r) {
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
Object.defineProperty(_o, "__esModule", { value: !0 });
_o.hashSha256Async = _o.hashSha256 = void 0;
const aS = $l;
function zy(e) {
  return (0, aS.sha256)(e);
}
_o.hashSha256 = zy;
function cS(e) {
  return iS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = oS;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(zy(e));
    }
  });
}
_o.hashSha256Async = cS;
var lS = Cn && Cn.__awaiter || function(e, t, n, r) {
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
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.TokenSigner = Ti.createUnsecuredToken = void 0;
const Yu = In, cp = vl, uS = gs, lp = _o;
function qu(e, t) {
  const n = [], r = Yu.encode(JSON.stringify(t));
  n.push(r);
  const s = Yu.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function dS(e) {
  return qu(e, { typ: "JWT", alg: "none" }) + ".";
}
Ti.createUnsecuredToken = dS;
class fS {
  constructor(t, n) {
    if (!(t && n))
      throw new uS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !cp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = cp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), o = qu(t, s), i = (0, lp.hashSha256)(o);
    return this.createWithSignedHash(t, n, s, o, i);
  }
  signAsync(t, n = !1, r = {}) {
    return lS(this, void 0, void 0, function* () {
      const s = this.header(r), o = qu(t, s), i = yield (0, lp.hashSha256Async)(o);
      return this.createWithSignedHash(t, n, s, o, i);
    });
  }
  createWithSignedHash(t, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Yu.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [s, i].join(".");
  }
}
Ti.TokenSigner = fS;
var Il = {};
Object.defineProperty(Il, "__esModule", { value: !0 });
Il.TokenVerifier = void 0;
const hS = In, up = vl, pS = gs, tc = _o;
class gS {
  constructor(t, n) {
    if (!(t && n))
      throw new pS.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !up.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = up.cryptoClients[t], this.rawPublicKey = n;
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
    const r = [t.header.join("."), hS.encode(t.payload)].join(".");
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
Il.TokenVerifier = gS;
var Ll = {};
Object.defineProperty(Ll, "__esModule", { value: !0 });
Ll.decodeToken = void 0;
const nc = In;
function yS(e) {
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
Ll.decodeToken = yS;
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
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Ti, e), n(Il, e), n(Ll, e), n(gs, e), n(vl, e);
})(pn);
function wS(e) {
  return `did:btc-addr:${e}`;
}
function mS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new zh("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new zh('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function Gy(e) {
  if (e)
    return mS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const bS = "1.4.0";
function xS() {
  return ox();
}
function SS(e, t, n, r = Dg.slice(), s, o = n1().getTime(), i = {}) {
  const a = (w) => {
    const v = Yd("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${w}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: s1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: bS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = pn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [u];
  const h = yy(u);
  return c.iss = wS(h), new pn.TokenSigner("ES256k", e).sign(c);
}
async function dp(e, t) {
  const n = _a(ct(t)), r = JSON.parse(n), s = await xy(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function vS(e) {
  const t = pn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new pn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function ES(e) {
  const t = pn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = Gy(t.iss);
  if (n.length === 1) {
    if (yy(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function AS(e) {
  const t = pn.decodeToken(e).payload;
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
function kS(e) {
  const t = pn.decodeToken(e).payload;
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
function $S(e) {
  const t = [
    kS(e),
    AS(e),
    vS(e),
    ES(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const fp = "1.0.0";
class no {
  constructor(t) {
    this.version = fp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== fp)
      throw new Fu(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new no(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Ky {
  constructor(t) {
    if (t) {
      const n = new no(t);
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
class hp extends Ky {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new no({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Fg("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new no({})), !0;
  }
}
class pp extends Ky {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = Qb, !localStorage.getItem(this.key)) {
      const r = new no({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new Fg("No session data was found in localStorage");
    const n = JSON.parse(t);
    return no.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new no({})), !0;
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
var fs;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(fs || (fs = {}));
var Vr;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Vr || (Vr = {}));
fs.Mainnet;
const Vy = {
  chainId: Sa.Mainnet,
  transactionVersion: fs.Mainnet,
  peerNetworkId: Yc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Vr.MainnetSingleSig,
    multiSig: Vr.MainnetMultiSig
  },
  client: { baseUrl: jg }
}, Wu = {
  chainId: Sa.Testnet,
  transactionVersion: fs.Testnet,
  peerNetworkId: Yc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Vr.TestnetSingleSig,
    multiSig: Vr.TestnetMultiSig
  },
  client: { baseUrl: Rg }
}, Bc = {
  ...Wu,
  addressVersion: { ...Wu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: zg }
}, IS = {
  ...Bc,
  addressVersion: { ...Bc.addressVersion },
  client: { ...Bc.client }
};
function LS(e) {
  switch (e) {
    case "mainnet":
      return Vy;
    case "testnet":
      return Wu;
    case "devnet":
      return Bc;
    case "mocknet":
      return IS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Xy(e) {
  return typeof e == "string" ? LS(e) : e;
}
var gp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(gp || (gp = {}));
var yp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(yp || (yp = {}));
var Sr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Sr || (Sr = {}));
const au = ["onChainOnly", "offChainOnly", "any"];
au[0] + "", Sr.OnChainOnly, au[1] + "", Sr.OffChainOnly, au[2] + "", Sr.Any, Sr.OnChainOnly + "", Sr.OnChainOnly, Sr.OffChainOnly + "", Sr.OffChainOnly, Sr.Any + "", Sr.Any;
var wp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(wp || (wp = {}));
var mp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(mp || (mp = {}));
var bp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(bp || (bp = {}));
var us;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(us || (us = {}));
var xp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(xp || (xp = {}));
var Sp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Sp || (Sp = {}));
var vp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(vp || (vp = {}));
var Ep;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Ep || (Ep = {}));
var Ap;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Ap || (Ap = {}));
var kp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(kp || (kp = {}));
var $p;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})($p || ($p = {}));
var Ip;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ip || (Ip = {}));
var Lp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Lp || (Lp = {}));
function Zu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function CS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Yy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function TS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zu(e.outputLen), Zu(e.blockLen);
}
function BS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function MS(e, t) {
  Yy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const So = {
  number: Zu,
  bool: CS,
  bytes: Yy,
  hash: TS,
  exists: BS,
  output: MS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const cu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Dr = (e, t) => e << 32 - t | e >>> t, NS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!NS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function _S(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function hf(e) {
  if (typeof e == "string" && (e = _S(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let qy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Wo(e) {
  const t = (r) => e().update(hf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Wy = class extends qy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, So.hash(t);
    const r = hf(n);
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
    return So.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    So.exists(this), So.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const Zy = (e, t, n) => new Wy(e, t).update(n).digest();
Zy.create = (e, t) => new Wy(e, t);
function PS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let pf = class extends qy {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = cu(this.buffer);
  }
  update(t) {
    So.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = hf(t);
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
    So.exists(this), So.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    PS(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const US = (e, t, n) => e & t ^ ~e & n, OS = (e, t, n) => e & t ^ e & n ^ t & n, HS = new Uint32Array([
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
]), Ns = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), _s = new Uint32Array(64);
let Jy = class extends pf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ns[0] | 0, this.B = Ns[1] | 0, this.C = Ns[2] | 0, this.D = Ns[3] | 0, this.E = Ns[4] | 0, this.F = Ns[5] | 0, this.G = Ns[6] | 0, this.H = Ns[7] | 0;
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
      _s[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = _s[d - 15], w = _s[d - 2], v = Dr(m, 7) ^ Dr(m, 18) ^ m >>> 3, E = Dr(w, 17) ^ Dr(w, 19) ^ w >>> 10;
      _s[d] = E + _s[d - 7] + v + _s[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Dr(a, 6) ^ Dr(a, 11) ^ Dr(a, 25), w = h + m + US(a, c, u) + HS[d] + _s[d] | 0, E = (Dr(r, 2) ^ Dr(r, 13) ^ Dr(r, 22)) + OS(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    _s.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, DS = class extends Jy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Qy = Wo(() => new Jy());
Wo(() => new DS());
var Zo = {}, gf = {};
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
        let E = 0;
        w !== 0 && (E = n.indexOf(i[w - 1]));
        const L = 1 + u, P = E % (1 << L) << 5 - L, O = e.c32[v + P];
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
    for (let E = i.length - 1; E >= 0; E--) {
      m === 4 && (h.unshift(n[d]), m = 0, d = 0);
      const P = (e.c32.indexOf(i[E]) << m) + d, O = n[P % 16];
      if (m += 1, d = P >> 4, d > 1 << m)
        throw new Error("Panic error in decoding.");
      h.unshift(O);
    }
    h.unshift(n[d]), h.length % 2 === 1 && h.unshift("0");
    let w = 0;
    for (let E = 0; E < h.length && h[E] === "0"; E++)
      w++;
    h = h.slice(w - w % 2);
    let v = h.join("");
    for (let E = 0; E < u; E++)
      v = `00${v}`;
    if (a) {
      const E = a * 2 - v.length;
      for (let L = 0; L < E; L += 2)
        v = `00${v}`;
    }
    return v;
  }
  e.c32decode = o;
})(gf);
var Po = {};
Object.defineProperty(Po, "__esModule", { value: !0 });
Po.c32checkDecode = Po.c32checkEncode = void 0;
const Cp = $l, Tp = Ha, ga = gf;
function ew(e) {
  const t = (0, Cp.sha256)((0, Cp.sha256)((0, Tp.hexToBytes)(e)));
  return (0, Tp.bytesToHex)(t.slice(0, 4));
}
function FS(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = ew(`${n}${t}`), s = (0, ga.c32encode)(`${t}${r}`);
  return `${ga.c32[e]}${s}`;
}
Po.c32checkEncode = FS;
function jS(e) {
  e = (0, ga.c32normalize)(e);
  const t = (0, ga.c32decode)(e.slice(1)), n = e[0], r = ga.c32.indexOf(n), s = t.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), ew(`${o}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
Po.c32checkDecode = jS;
var tw = {}, Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.decode = Mi.encode = void 0;
const qc = $l, Bp = Ha, nw = dy, rw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function RS(e, t = "00") {
  const n = typeof e == "string" ? (0, Bp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, Bp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, qc.sha256)((0, qc.sha256)(new Uint8Array([...r, ...n])));
  return nw(rw).encode([...r, ...n, ...s.slice(0, 4)]);
}
Mi.encode = RS;
function zS(e) {
  const t = nw(rw).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, qc.sha256)((0, qc.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Mi.decode = zS;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = Po, n = Mi, r = Ha;
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
    let E;
    return d < 0 ? (E = v, s[v] !== void 0 && (E = s[v])) : E = d, i(E, w);
  }
  e.b58ToC32 = c;
  function u(h, d = -1) {
    const m = a(h), w = m[0], v = m[1];
    let E;
    d < 0 ? (E = w, o[w] !== void 0 && (E = o[w])) : E = d;
    let L = E.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(v, L);
  }
  e.c32ToB58 = u;
})(tw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = gf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = Po;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = tw;
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
})(Zo);
function GS(e, t) {
  switch (t = Xy(t ?? Vy), e) {
    case us.P2PKH:
      switch (t.transactionVersion) {
        case fs.Mainnet:
          return Vr.MainnetSingleSig;
        case fs.Testnet:
          return Vr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case us.P2SH:
    case us.P2SHNonSequential:
    case us.P2WPKH:
    case us.P2WSH:
    case us.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case fs.Mainnet:
          return Vr.MainnetMultiSig;
        case fs.Testnet:
          return Vr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const KS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), sw = Uint8Array.from({ length: 16 }, (e, t) => t), VS = sw.map((e) => (9 * e + 5) % 16);
let yf = [sw], wf = [VS];
for (let e = 0; e < 4; e++)
  for (let t of [yf, wf])
    t.push(t[e].map((n) => KS[n]));
const ow = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), XS = yf.map((e, t) => e.map((n) => ow[t][n])), YS = wf.map((e, t) => e.map((n) => ow[t][n])), qS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), WS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), rc = (e, t) => e << t | e >>> 32 - t;
function Mp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const sc = new Uint32Array(16);
let ZS = class extends pf {
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
      const v = 4 - w, E = qS[w], L = WS[w], P = yf[w], O = wf[w], A = XS[w], M = YS[w];
      for (let U = 0; U < 16; U++) {
        const X = rc(r + Mp(w, o, a, u) + sc[P[U]] + E, A[U]) + d | 0;
        r = d, d = u, u = rc(a, 10) | 0, a = o, o = X;
      }
      for (let U = 0; U < 16; U++) {
        const X = rc(s + Mp(v, i, c, h) + sc[O[U]] + L, M[U]) + m | 0;
        s = m, m = h, h = rc(c, 10) | 0, c = i, i = X;
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
const JS = Wo(() => new ZS()), oc = BigInt(2 ** 32 - 1), Ju = BigInt(32);
function iw(e, t = !1) {
  return t ? { h: Number(e & oc), l: Number(e >> Ju & oc) } : { h: Number(e >> Ju & oc) | 0, l: Number(e & oc) | 0 };
}
function QS(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = iw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const ev = (e, t) => BigInt(e >>> 0) << Ju | BigInt(t >>> 0), tv = (e, t, n) => e >>> n, nv = (e, t, n) => e << 32 - n | t >>> n, rv = (e, t, n) => e >>> n | t << 32 - n, sv = (e, t, n) => e << 32 - n | t >>> n, ov = (e, t, n) => e << 64 - n | t >>> n - 32, iv = (e, t, n) => e >>> n - 32 | t << 64 - n, av = (e, t) => t, cv = (e, t) => e, lv = (e, t, n) => e << n | t >>> 32 - n, uv = (e, t, n) => t << n | e >>> 32 - n, dv = (e, t, n) => t << n - 32 | e >>> 64 - n, fv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function hv(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const pv = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), gv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, yv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), wv = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, mv = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), bv = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Ge = {
  fromBig: iw,
  split: QS,
  toBig: ev,
  shrSH: tv,
  shrSL: nv,
  rotrSH: rv,
  rotrSL: sv,
  rotrBH: ov,
  rotrBL: iv,
  rotr32H: av,
  rotr32L: cv,
  rotlSH: lv,
  rotlSL: uv,
  rotlBH: dv,
  rotlBL: fv,
  add: hv,
  add3L: pv,
  add3H: gv,
  add4L: yv,
  add4H: wv,
  add5H: bv,
  add5L: mv
}, [xv, Sv] = Ge.split([
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
].map((e) => BigInt(e))), Ps = new Uint32Array(80), Us = new Uint32Array(80);
let Cl = class extends pf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: E, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, m, w, v, E, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, m, w, v, E, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = E | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ps[A] = t.getUint32(n), Us[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const M = Ps[A - 15] | 0, U = Us[A - 15] | 0, X = Ge.rotrSH(M, U, 1) ^ Ge.rotrSH(M, U, 8) ^ Ge.shrSH(M, U, 7), ae = Ge.rotrSL(M, U, 1) ^ Ge.rotrSL(M, U, 8) ^ Ge.shrSL(M, U, 7), se = Ps[A - 2] | 0, Y = Us[A - 2] | 0, b = Ge.rotrSH(se, Y, 19) ^ Ge.rotrBH(se, Y, 61) ^ Ge.shrSH(se, Y, 6), $ = Ge.rotrSL(se, Y, 19) ^ Ge.rotrBL(se, Y, 61) ^ Ge.shrSL(se, Y, 6), N = Ge.add4L(ae, $, Us[A - 7], Us[A - 16]), _ = Ge.add4H(N, X, b, Ps[A - 7], Ps[A - 16]);
      Ps[A] = _ | 0, Us[A] = N | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: E, Gl: L, Hh: P, Hl: O } = this;
    for (let A = 0; A < 80; A++) {
      const M = Ge.rotrSH(d, m, 14) ^ Ge.rotrSH(d, m, 18) ^ Ge.rotrBH(d, m, 41), U = Ge.rotrSL(d, m, 14) ^ Ge.rotrSL(d, m, 18) ^ Ge.rotrBL(d, m, 41), X = d & w ^ ~d & E, ae = m & v ^ ~m & L, se = Ge.add5L(O, U, ae, Sv[A], Us[A]), Y = Ge.add5H(se, P, M, X, xv[A], Ps[A]), b = se | 0, $ = Ge.rotrSH(r, s, 28) ^ Ge.rotrBH(r, s, 34) ^ Ge.rotrBH(r, s, 39), N = Ge.rotrSL(r, s, 28) ^ Ge.rotrBL(r, s, 34) ^ Ge.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, q = s & i ^ s & c ^ i & c;
      P = E | 0, O = L | 0, E = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Ge.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const R = Ge.add3L(b, N, q);
      r = Ge.add3H(R, Y, $, _), s = R | 0;
    }
    ({ h: r, l: s } = Ge.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ge.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ge.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Ge.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Ge.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Ge.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: E, l: L } = Ge.add(this.Gh | 0, this.Gl | 0, E | 0, L | 0), { h: P, l: O } = Ge.add(this.Hh | 0, this.Hl | 0, P | 0, O | 0), this.set(r, s, o, i, a, c, u, h, d, m, w, v, E, L, P, O);
  }
  roundClean() {
    Ps.fill(0), Us.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, vv = class extends Cl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ev = class extends Cl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Av = class extends Cl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Wo(() => new Cl());
Wo(() => new vv());
Wo(() => new Ev());
Wo(() => new Av());
var Wc = { exports: {} };
Wc.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", m = "[object Map]", w = "[object Number]", v = "[object Object]", E = "[object Promise]", L = "[object RegExp]", P = "[object Set]", O = "[object String]", A = "[object Symbol]", M = "[object WeakMap]", U = "[object ArrayBuffer]", X = "[object DataView]", ae = "[object Float32Array]", se = "[object Float64Array]", Y = "[object Int8Array]", b = "[object Int16Array]", $ = "[object Int32Array]", N = "[object Uint8Array]", _ = "[object Uint8ClampedArray]", q = "[object Uint16Array]", R = "[object Uint32Array]", ce = /[\\^$.*+?()[\]{}|]/g, le = /\w*$/, He = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, j = {};
  j[o] = j[i] = j[U] = j[X] = j[a] = j[c] = j[ae] = j[se] = j[Y] = j[b] = j[$] = j[m] = j[w] = j[v] = j[L] = j[P] = j[O] = j[A] = j[N] = j[_] = j[q] = j[R] = !0, j[u] = j[h] = j[M] = !1;
  var ue = typeof Cn == "object" && Cn && Cn.Object === Object && Cn, ge = typeof self == "object" && self && self.Object === Object && self, Ce = ue || ge || Function("return this")(), Te = t && !t.nodeType && t, It = Te && !0 && e && !e.nodeType && e, Oe = It && It.exports === Te;
  function Ie(S, B) {
    return S.set(B[0], B[1]), S;
  }
  function Ne(S, B) {
    return S.add(B), S;
  }
  function en(S, B) {
    for (var F = -1, Q = S ? S.length : 0; ++F < Q && B(S[F], F, S) !== !1; )
      ;
    return S;
  }
  function Gt(S, B) {
    for (var F = -1, Q = B.length, be = S.length; ++F < Q; )
      S[be + F] = B[F];
    return S;
  }
  function Je(S, B, F, Q) {
    for (var be = -1, Fe = S ? S.length : 0; ++be < Fe; )
      F = B(F, S[be], be, S);
    return F;
  }
  function Jt(S, B) {
    for (var F = -1, Q = Array(S); ++F < S; )
      Q[F] = B(F);
    return Q;
  }
  function wt(S, B) {
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
    var B = -1, F = Array(S.size);
    return S.forEach(function(Q, be) {
      F[++B] = [be, Q];
    }), F;
  }
  function te(S, B) {
    return function(F) {
      return S(B(F));
    };
  }
  function ee(S) {
    var B = -1, F = Array(S.size);
    return S.forEach(function(Q) {
      F[++B] = Q;
    }), F;
  }
  var de = Array.prototype, lt = Function.prototype, Le = Object.prototype, Pe = Ce["__core-js_shared__"], ft = function() {
    var S = /[^.]+$/.exec(Pe && Pe.keys && Pe.keys.IE_PROTO || "");
    return S ? "Symbol(src)_1." + S : "";
  }(), _e = lt.toString, Ee = Le.hasOwnProperty, Re = Le.toString, De = RegExp(
    "^" + _e.call(Ee).replace(ce, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Se = Oe ? Ce.Buffer : void 0, Lt = Ce.Symbol, rn = Ce.Uint8Array, gn = te(Object.getPrototypeOf, Object), Bn = Object.create, ht = Le.propertyIsEnumerable, kn = de.splice, nr = Object.getOwnPropertySymbols, es = Se ? Se.isBuffer : void 0, Fn = te(Object.keys, Object), Mn = pr(Ce, "DataView"), ln = pr(Ce, "Map"), _t = pr(Ce, "Promise"), Qt = pr(Ce, "Set"), At = pr(Ce, "WeakMap"), Kt = pr(Object, "create"), ts = sr(Mn), Nn = sr(ln), y = sr(_t), C = sr(Qt), z = sr(At), D = Lt ? Lt.prototype : void 0, J = D ? D.valueOf : void 0;
  function ne(S) {
    var B = -1, F = S ? S.length : 0;
    for (this.clear(); ++B < F; ) {
      var Q = S[B];
      this.set(Q[0], Q[1]);
    }
  }
  function ke() {
    this.__data__ = Kt ? Kt(null) : {};
  }
  function xe(S) {
    return this.has(S) && delete this.__data__[S];
  }
  function Be(S) {
    var B = this.__data__;
    if (Kt) {
      var F = B[S];
      return F === r ? void 0 : F;
    }
    return Ee.call(B, S) ? B[S] : void 0;
  }
  function gt(S) {
    var B = this.__data__;
    return Kt ? B[S] !== void 0 : Ee.call(B, S);
  }
  function me(S, B) {
    var F = this.__data__;
    return F[S] = Kt && B === void 0 ? r : B, this;
  }
  ne.prototype.clear = ke, ne.prototype.delete = xe, ne.prototype.get = Be, ne.prototype.has = gt, ne.prototype.set = me;
  function Qe(S) {
    var B = -1, F = S ? S.length : 0;
    for (this.clear(); ++B < F; ) {
      var Q = S[B];
      this.set(Q[0], Q[1]);
    }
  }
  function ot() {
    this.__data__ = [];
  }
  function Ze(S) {
    var B = this.__data__, F = tn(B, S);
    if (F < 0)
      return !1;
    var Q = B.length - 1;
    return F == Q ? B.pop() : kn.call(B, F, 1), !0;
  }
  function Ht(S) {
    var B = this.__data__, F = tn(B, S);
    return F < 0 ? void 0 : B[F][1];
  }
  function Ct(S) {
    return tn(this.__data__, S) > -1;
  }
  function Vt(S, B) {
    var F = this.__data__, Q = tn(F, S);
    return Q < 0 ? F.push([S, B]) : F[Q][1] = B, this;
  }
  Qe.prototype.clear = ot, Qe.prototype.delete = Ze, Qe.prototype.get = Ht, Qe.prototype.has = Ct, Qe.prototype.set = Vt;
  function nt(S) {
    var B = -1, F = S ? S.length : 0;
    for (this.clear(); ++B < F; ) {
      var Q = S[B];
      this.set(Q[0], Q[1]);
    }
  }
  function Mr() {
    this.__data__ = {
      hash: new ne(),
      map: new (ln || Qe)(),
      string: new ne()
    };
  }
  function Nr(S) {
    return Ur(this, S).delete(S);
  }
  function et(S) {
    return Ur(this, S).get(S);
  }
  function yt(S) {
    return Ur(this, S).has(S);
  }
  function _n(S, B) {
    return Ur(this, S).set(S, B), this;
  }
  nt.prototype.clear = Mr, nt.prototype.delete = Nr, nt.prototype.get = et, nt.prototype.has = yt, nt.prototype.set = _n;
  function jn(S) {
    this.__data__ = new Qe(S);
  }
  function fr() {
    this.__data__ = new Qe();
  }
  function rr(S) {
    return this.__data__.delete(S);
  }
  function yn(S) {
    return this.__data__.get(S);
  }
  function wn(S) {
    return this.__data__.has(S);
  }
  function hr(S, B) {
    var F = this.__data__;
    if (F instanceof Qe) {
      var Q = F.__data__;
      if (!ln || Q.length < n - 1)
        return Q.push([S, B]), this;
      F = this.__data__ = new nt(Q);
    }
    return F.set(S, B), this;
  }
  jn.prototype.clear = fr, jn.prototype.delete = rr, jn.prototype.get = yn, jn.prototype.has = wn, jn.prototype.set = hr;
  function ms(S, B) {
    var F = k(S) || x(S) ? Jt(S.length, String) : [], Q = F.length, be = !!Q;
    for (var Fe in S)
      Ee.call(S, Fe) && !(be && (Fe == "length" || mn(Fe, Q))) && F.push(Fe);
    return F;
  }
  function ni(S, B, F) {
    var Q = S[B];
    (!(Ee.call(S, B) && yo(Q, F)) || F === void 0 && !(B in S)) && (S[B] = F);
  }
  function tn(S, B) {
    for (var F = S.length; F--; )
      if (yo(S[F][0], B))
        return F;
    return -1;
  }
  function ao(S, B) {
    return S && Pr(B, Z(B), S);
  }
  function co(S, B, F, Q, be, Fe, Tt) {
    var mt;
    if (Q && (mt = Fe ? Q(S, be, Fe, Tt) : Q(S)), mt !== void 0)
      return mt;
    if (!T(S))
      return S;
    var wr = k(S);
    if (wr) {
      if (mt = Zi(S), !B)
        return po(S, mt);
    } else {
      var bn = gr(S), Or = bn == h || bn == d;
      if (g(S))
        return uo(S, B);
      if (bn == v || bn == o || Or && !Fe) {
        if (G(S))
          return Fe ? S : {};
        if (mt = Es(Or ? {} : S), !B)
          return Wi(S, ao(mt, S));
      } else {
        if (!j[bn])
          return Fe ? S : {};
        mt = rs(S, bn, co, B);
      }
    }
    Tt || (Tt = new jn());
    var Pn = Tt.get(S);
    if (Pn)
      return Pn;
    if (Tt.set(S, mt), !wr)
      var Ji = F ? it(S) : Z(S);
    return en(Ji || S, function(ss, $e) {
      Ji && ($e = ss, ss = S[$e]), ni(mt, $e, co(ss, B, F, Q, $e, S, Tt));
    }), mt;
  }
  function Yi(S) {
    return T(S) ? Bn(S) : {};
  }
  function Rn(S, B, F) {
    var Q = B(S);
    return k(S) ? Q : Gt(Q, F(S));
  }
  function lo(S) {
    return Re.call(S);
  }
  function bs(S) {
    if (!T(S) || yr(S))
      return !1;
    var B = p(S) || G(S) ? De : He;
    return B.test(sr(S));
  }
  function qi(S) {
    if (!go(S))
      return Fn(S);
    var B = [];
    for (var F in Object(S))
      Ee.call(S, F) && F != "constructor" && B.push(F);
    return B;
  }
  function uo(S, B) {
    if (B)
      return S.slice();
    var F = new S.constructor(S.length);
    return S.copy(F), F;
  }
  function _r(S) {
    var B = new S.constructor(S.byteLength);
    return new rn(B).set(new rn(S)), B;
  }
  function ns(S, B) {
    var F = B ? _r(S.buffer) : S.buffer;
    return new S.constructor(F, S.byteOffset, S.byteLength);
  }
  function xs(S, B, F) {
    var Q = B ? F(H(S), !0) : H(S);
    return Je(Q, Ie, new S.constructor());
  }
  function fo(S) {
    var B = new S.constructor(S.source, le.exec(S));
    return B.lastIndex = S.lastIndex, B;
  }
  function ho(S, B, F) {
    var Q = B ? F(ee(S), !0) : ee(S);
    return Je(Q, Ne, new S.constructor());
  }
  function Ss(S) {
    return J ? Object(J.call(S)) : {};
  }
  function vs(S, B) {
    var F = B ? _r(S.buffer) : S.buffer;
    return new S.constructor(F, S.byteOffset, S.length);
  }
  function po(S, B) {
    var F = -1, Q = S.length;
    for (B || (B = Array(Q)); ++F < Q; )
      B[F] = S[F];
    return B;
  }
  function Pr(S, B, F, Q) {
    F || (F = {});
    for (var be = -1, Fe = B.length; ++be < Fe; ) {
      var Tt = B[be], mt = void 0;
      ni(F, Tt, mt === void 0 ? S[Tt] : mt);
    }
    return F;
  }
  function Wi(S, B) {
    return Pr(S, Dt(S), B);
  }
  function it(S) {
    return Rn(S, Z, Dt);
  }
  function Ur(S, B) {
    var F = S.__data__;
    return ri(B) ? F[typeof B == "string" ? "string" : "hash"] : F.map;
  }
  function pr(S, B) {
    var F = wt(S, B);
    return bs(F) ? F : void 0;
  }
  var Dt = nr ? te(nr, Object) : re, gr = lo;
  (Mn && gr(new Mn(new ArrayBuffer(1))) != X || ln && gr(new ln()) != m || _t && gr(_t.resolve()) != E || Qt && gr(new Qt()) != P || At && gr(new At()) != M) && (gr = function(S) {
    var B = Re.call(S), F = B == v ? S.constructor : void 0, Q = F ? sr(F) : void 0;
    if (Q)
      switch (Q) {
        case ts:
          return X;
        case Nn:
          return m;
        case y:
          return E;
        case C:
          return P;
        case z:
          return M;
      }
    return B;
  });
  function Zi(S) {
    var B = S.length, F = S.constructor(B);
    return B && typeof S[0] == "string" && Ee.call(S, "index") && (F.index = S.index, F.input = S.input), F;
  }
  function Es(S) {
    return typeof S.constructor == "function" && !go(S) ? Yi(gn(S)) : {};
  }
  function rs(S, B, F, Q) {
    var be = S.constructor;
    switch (B) {
      case U:
        return _r(S);
      case a:
      case c:
        return new be(+S);
      case X:
        return ns(S, Q);
      case ae:
      case se:
      case Y:
      case b:
      case $:
      case N:
      case _:
      case q:
      case R:
        return vs(S, Q);
      case m:
        return xs(S, Q, F);
      case w:
      case O:
        return new be(S);
      case L:
        return fo(S);
      case P:
        return ho(S, Q, F);
      case A:
        return Ss(S);
    }
  }
  function mn(S, B) {
    return B = B ?? s, !!B && (typeof S == "number" || I.test(S)) && S > -1 && S % 1 == 0 && S < B;
  }
  function ri(S) {
    var B = typeof S;
    return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? S !== "__proto__" : S === null;
  }
  function yr(S) {
    return !!ft && ft in S;
  }
  function go(S) {
    var B = S && S.constructor, F = typeof B == "function" && B.prototype || Le;
    return S === F;
  }
  function sr(S) {
    if (S != null) {
      try {
        return _e.call(S);
      } catch {
      }
      try {
        return S + "";
      } catch {
      }
    }
    return "";
  }
  function As(S) {
    return co(S, !0, !0);
  }
  function yo(S, B) {
    return S === B || S !== S && B !== B;
  }
  function x(S) {
    return l(S) && Ee.call(S, "callee") && (!ht.call(S, "callee") || Re.call(S) == o);
  }
  var k = Array.isArray;
  function K(S) {
    return S != null && f(S.length) && !p(S);
  }
  function l(S) {
    return V(S) && K(S);
  }
  var g = es || ve;
  function p(S) {
    var B = T(S) ? Re.call(S) : "";
    return B == h || B == d;
  }
  function f(S) {
    return typeof S == "number" && S > -1 && S % 1 == 0 && S <= s;
  }
  function T(S) {
    var B = typeof S;
    return !!S && (B == "object" || B == "function");
  }
  function V(S) {
    return !!S && typeof S == "object";
  }
  function Z(S) {
    return K(S) ? ms(S) : qi(S);
  }
  function re() {
    return [];
  }
  function ve() {
    return !1;
  }
  e.exports = As;
})(Wc, Wc.exports);
var kv = Wc.exports;
const aw = /* @__PURE__ */ Pg(kv);
var Qu;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Qu || (Qu = {}));
function $v(e, t) {
  return { type: Qu.Address, version: e, hash160: t };
}
function Iv(e) {
  return Zo.c32address(e.version, e.hash160);
}
const Lv = (e) => JS(Qy(e)), Cv = (e) => Me(Lv(e));
zt.hmacSha256Sync = (e, ...t) => {
  const n = Zy.create(Qy, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Tv(e, t = "mainnet") {
  t = Xy(t), e = typeof e == "string" ? ct(e) : e;
  const n = GS(us.P2PKH, t), r = $v(n, Cv(e));
  return Iv(r);
}
function Bv(e, t) {
  const n = pn.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, o = Tv(s);
  if (t !== s) {
    if (t !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new pn.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function Mv(e, t = null) {
  let n;
  t ? n = Bv(e, t) : n = pn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Np = "_blockstackDidCheckEchoReply", Nv = "echoReply", _v = "authContinuation";
function Pv(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Uv() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[Np];
  if (typeof t == "boolean")
    return t;
  const n = Pv(e.location.search), r = n[Nv];
  if (r) {
    e[Np] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const o = n[_v];
      e.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class ed {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new Gg();
    else
      throw new t1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new pp(t.sessionOptions) : this.store = new pp() : t ? this.store = new hp(t.sessionOptions) : this.store = new hp();
  }
  makeAuthRequestToken(t, n, r, s, o, i = r1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Fu("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, SS(t, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = xS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = Yd("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Uv())
        return gi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      gi.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = $1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Xa("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = pn.decodeToken(t).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await $S(t))
      throw new Xa("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (nu(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await dp(s, o.private_key);
          } catch {
            if (gi.warn("Failed decryption of appPrivateKey, will try to use as given"), !zt.isValidPrivateKey(o.private_key))
              throw new Xa("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await dp(s, c);
          } catch {
            gi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Xa("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = g1, h;
    nu(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), nu(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const d = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Gy(o.iss),
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
        d.profile = Object.assign({}, Jb);
      else {
        const v = await w.text(), E = JSON.parse(v);
        d.profile = Mv(E[0].token);
      }
    } else
      d.profile = o.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new Fu("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), gx(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), yx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
ed.prototype.makeAuthRequest = ed.prototype.makeAuthRequestToken;
const Ov = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Hv = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = Ov(), n = e.filter((r) => t.find((o) => o.id === r.id) ? !1 : !!Tl(r.id));
  return t.concat(n);
}, Tl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), cw = "STX_PROVIDER", Uo = () => typeof window > "u" ? null : window.localStorage.getItem(cw), Dv = (e) => {
  typeof window < "u" && window.localStorage.setItem(cw, e);
}, Fv = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function jv(e, t) {
  const n = {};
  return Object.assign(n, Fv, t), await fetch(e, n);
}
function Rv(e) {
  let t = jv, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function zv(...e) {
  const { fetchLib: t, middlewares: n } = Rv(e);
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
var Ni;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ni || (Ni = {}));
var Oo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Oo || (Oo = {}));
var _p;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(_p || (_p = {}));
const Gv = "https://api.mainnet.hiro.so", Kv = "https://api.testnet.hiro.so", Vv = "http://localhost:3999", Xv = ["mainnet", "testnet", "devnet", "mocknet"];
class Ho {
  constructor(t) {
    this.version = Oo.Mainnet, this.chainId = Ni.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Oo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? zv();
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
Ho.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new td();
    case "testnet":
      return new nd();
    case "devnet":
      return new Yv();
    case "mocknet":
      return new lw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Xv.join(", ")}`);
  }
};
Ho.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Ho.fromName(e);
class td extends Ho {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Gv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Oo.Mainnet, this.chainId = Ni.Mainnet;
  }
}
class nd extends Ho {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Kv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Oo.Testnet, this.chainId = Ni.Testnet;
  }
}
class lw extends Ho {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Vv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Oo.Testnet, this.chainId = Ni.Testnet;
  }
}
const Yv = lw;
var Do;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Do || (Do = {}));
var Zc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Zc || (Zc = {}));
Do.Mainnet;
var Fo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Fo || (Fo = {}));
var jo;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(jo || (jo = {}));
Fo.Mainnet;
const qv = {
  chainId: Do.Mainnet,
  transactionVersion: Fo.Mainnet,
  peerNetworkId: Zc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: jo.MainnetSingleSig,
    multiSig: jo.MainnetMultiSig
  },
  client: { baseUrl: jg }
}, rd = {
  chainId: Do.Testnet,
  transactionVersion: Fo.Testnet,
  peerNetworkId: Zc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: jo.TestnetSingleSig,
    multiSig: jo.TestnetMultiSig
  },
  client: { baseUrl: Rg }
}, Mc = {
  ...rd,
  addressVersion: { ...rd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: zg }
}, Wv = {
  ...Mc,
  addressVersion: { ...Mc.addressVersion },
  client: { ...Mc.client }
};
function Zv(e) {
  switch (e) {
    case "mainnet":
      return qv;
    case "testnet":
      return rd;
    case "devnet":
      return Mc;
    case "mocknet":
      return Wv;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Jv(e) {
  return typeof e == "string" ? Zv(e) : e;
}
function Qv(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const Pp = /* @__PURE__ */ new Map();
function uw(e, t) {
  const n = Pp.get(e);
  if (n !== void 0)
    return n(t);
  const r = Qv(e);
  return Pp.set(e, r), uw(e, t);
}
let $t = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? ct(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return v1(this.readBytes(4), 0);
  }
  readUInt8() {
    return x1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return m1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Me(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Me(n);
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
    if (uw(t, r))
      return r;
    throw n(r);
  }
};
const eE = 128, tE = 128, dw = 16, Io = 32, sd = 80, Bl = 65, nE = 32, rE = 64, Jc = 34, sE = 1 + 16 * 1024 * 1024, oE = 165, iE = 16, aE = 16, cE = 20, lE = aE + 2 + cE, uE = lE + 4, dE = sE + (oE + iE * uE);
var pt;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(pt || (pt = {}));
var od;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(od || (od = {}));
var Xn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Xn || (Xn = {}));
const lu = ["onChainOnly", "offChainOnly", "any"];
lu[0] + "", Xn.OnChainOnly, lu[1] + "", Xn.OffChainOnly, lu[2] + "", Xn.Any, Xn.OnChainOnly + "", Xn.OnChainOnly, Xn.OffChainOnly + "", Xn.OffChainOnly, Xn.Any + "", Xn.Any;
var Qc;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Qc || (Qc = {}));
var Bt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Bt || (Bt = {}));
var jt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(jt || (jt = {}));
var vt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(vt || (vt = {}));
var Ut;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Ut || (Ut = {}));
var ya;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(ya || (ya = {}));
var id;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(id || (id = {}));
var ad;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(ad || (ad = {}));
var Ln;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Ln || (Ln = {}));
var Up;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Up || (Up = {}));
var cd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(cd || (cd = {}));
var Ar;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ar || (Ar = {}));
var Op;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Op || (Op = {}));
let Ml = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, yi = class extends Ml {
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
}, vo = class extends Ml {
  constructor(t) {
    super(t);
  }
};
function ld(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function fE(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function fw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function hE(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ld(e.outputLen), ld(e.blockLen);
}
function pE(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function gE(e, t) {
  fw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Eo = {
  number: ld,
  bool: fE,
  bytes: fw,
  hash: hE,
  exists: pE,
  output: gE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Fr = (e, t) => e << 32 - t | e >>> t, yE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function wE(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function mf(e) {
  if (typeof e == "string" && (e = wE(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let hw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Jo(e) {
  const t = (r) => e().update(mf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let pw = class extends hw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Eo.hash(t);
    const r = mf(n);
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
    return Eo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Eo.exists(this), Eo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const gw = (e, t, n) => new pw(e, t).update(n).digest();
gw.create = (e, t) => new pw(e, t);
function mE(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let bf = class extends hw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = uu(this.buffer);
  }
  update(t) {
    Eo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = mf(t);
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
    Eo.exists(this), Eo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    mE(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const bE = (e, t, n) => e & t ^ ~e & n, xE = (e, t, n) => e & t ^ e & n ^ t & n, SE = new Uint32Array([
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
]), Os = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Hs = new Uint32Array(64);
let yw = class extends bf {
  constructor() {
    super(64, 32, 8, !1), this.A = Os[0] | 0, this.B = Os[1] | 0, this.C = Os[2] | 0, this.D = Os[3] | 0, this.E = Os[4] | 0, this.F = Os[5] | 0, this.G = Os[6] | 0, this.H = Os[7] | 0;
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
      Hs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Hs[d - 15], w = Hs[d - 2], v = Fr(m, 7) ^ Fr(m, 18) ^ m >>> 3, E = Fr(w, 17) ^ Fr(w, 19) ^ w >>> 10;
      Hs[d] = E + Hs[d - 7] + v + Hs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Fr(a, 6) ^ Fr(a, 11) ^ Fr(a, 25), w = h + m + bE(a, c, u) + SE[d] + Hs[d] | 0, E = (Fr(r, 2) ^ Fr(r, 13) ^ Fr(r, 22)) + xE(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Hs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, vE = class extends yw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const xf = Jo(() => new yw());
Jo(() => new vE());
const EE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ww = Uint8Array.from({ length: 16 }, (e, t) => t), AE = ww.map((e) => (9 * e + 5) % 16);
let Sf = [ww], vf = [AE];
for (let e = 0; e < 4; e++)
  for (let t of [Sf, vf])
    t.push(t[e].map((n) => EE[n]));
const mw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), kE = Sf.map((e, t) => e.map((n) => mw[t][n])), $E = vf.map((e, t) => e.map((n) => mw[t][n])), IE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), LE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ic = (e, t) => e << t | e >>> 32 - t;
function Hp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const ac = new Uint32Array(16);
let CE = class extends bf {
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
      const v = 4 - w, E = IE[w], L = LE[w], P = Sf[w], O = vf[w], A = kE[w], M = $E[w];
      for (let U = 0; U < 16; U++) {
        const X = ic(r + Hp(w, o, a, u) + ac[P[U]] + E, A[U]) + d | 0;
        r = d, d = u, u = ic(a, 10) | 0, a = o, o = X;
      }
      for (let U = 0; U < 16; U++) {
        const X = ic(s + Hp(v, i, c, h) + ac[O[U]] + L, M[U]) + m | 0;
        s = m, m = h, h = ic(c, 10) | 0, c = i, i = X;
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
const TE = Jo(() => new CE()), cc = BigInt(2 ** 32 - 1), ud = BigInt(32);
function bw(e, t = !1) {
  return t ? { h: Number(e & cc), l: Number(e >> ud & cc) } : { h: Number(e >> ud & cc) | 0, l: Number(e & cc) | 0 };
}
function BE(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = bw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const ME = (e, t) => BigInt(e >>> 0) << ud | BigInt(t >>> 0), NE = (e, t, n) => e >>> n, _E = (e, t, n) => e << 32 - n | t >>> n, PE = (e, t, n) => e >>> n | t << 32 - n, UE = (e, t, n) => e << 32 - n | t >>> n, OE = (e, t, n) => e << 64 - n | t >>> n - 32, HE = (e, t, n) => e >>> n - 32 | t << 64 - n, DE = (e, t) => t, FE = (e, t) => e, jE = (e, t, n) => e << n | t >>> 32 - n, RE = (e, t, n) => t << n | e >>> 32 - n, zE = (e, t, n) => t << n - 32 | e >>> 64 - n, GE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function KE(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const VE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), XE = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, YE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), qE = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, WE = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ZE = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Ke = {
  fromBig: bw,
  split: BE,
  toBig: ME,
  shrSH: NE,
  shrSL: _E,
  rotrSH: PE,
  rotrSL: UE,
  rotrBH: OE,
  rotrBL: HE,
  rotr32H: DE,
  rotr32L: FE,
  rotlSH: jE,
  rotlSL: RE,
  rotlBH: zE,
  rotlBL: GE,
  add: KE,
  add3L: VE,
  add3H: XE,
  add4L: YE,
  add4H: qE,
  add5H: ZE,
  add5L: WE
}, [JE, QE] = Ke.split([
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
].map((e) => BigInt(e))), Ds = new Uint32Array(80), Fs = new Uint32Array(80);
let Nl = class extends bf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: E, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, m, w, v, E, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, m, w, v, E, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = E | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ds[A] = t.getUint32(n), Fs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const M = Ds[A - 15] | 0, U = Fs[A - 15] | 0, X = Ke.rotrSH(M, U, 1) ^ Ke.rotrSH(M, U, 8) ^ Ke.shrSH(M, U, 7), ae = Ke.rotrSL(M, U, 1) ^ Ke.rotrSL(M, U, 8) ^ Ke.shrSL(M, U, 7), se = Ds[A - 2] | 0, Y = Fs[A - 2] | 0, b = Ke.rotrSH(se, Y, 19) ^ Ke.rotrBH(se, Y, 61) ^ Ke.shrSH(se, Y, 6), $ = Ke.rotrSL(se, Y, 19) ^ Ke.rotrBL(se, Y, 61) ^ Ke.shrSL(se, Y, 6), N = Ke.add4L(ae, $, Fs[A - 7], Fs[A - 16]), _ = Ke.add4H(N, X, b, Ds[A - 7], Ds[A - 16]);
      Ds[A] = _ | 0, Fs[A] = N | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: E, Gl: L, Hh: P, Hl: O } = this;
    for (let A = 0; A < 80; A++) {
      const M = Ke.rotrSH(d, m, 14) ^ Ke.rotrSH(d, m, 18) ^ Ke.rotrBH(d, m, 41), U = Ke.rotrSL(d, m, 14) ^ Ke.rotrSL(d, m, 18) ^ Ke.rotrBL(d, m, 41), X = d & w ^ ~d & E, ae = m & v ^ ~m & L, se = Ke.add5L(O, U, ae, QE[A], Fs[A]), Y = Ke.add5H(se, P, M, X, JE[A], Ds[A]), b = se | 0, $ = Ke.rotrSH(r, s, 28) ^ Ke.rotrBH(r, s, 34) ^ Ke.rotrBH(r, s, 39), N = Ke.rotrSL(r, s, 28) ^ Ke.rotrBL(r, s, 34) ^ Ke.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, q = s & i ^ s & c ^ i & c;
      P = E | 0, O = L | 0, E = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Ke.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const R = Ke.add3L(b, N, q);
      r = Ke.add3H(R, Y, $, _), s = R | 0;
    }
    ({ h: r, l: s } = Ke.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ke.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ke.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Ke.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Ke.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Ke.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: E, l: L } = Ke.add(this.Gh | 0, this.Gl | 0, E | 0, L | 0), { h: P, l: O } = Ke.add(this.Hh | 0, this.Hl | 0, P | 0, O | 0), this.set(r, s, o, i, a, c, u, h, d, m, w, v, E, L, P, O);
  }
  roundClean() {
    Ds.fill(0), Fs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, eA = class extends Nl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, tA = class extends Nl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, nA = class extends Nl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Jo(() => new Nl());
Jo(() => new eA());
const rA = Jo(() => new tA());
Jo(() => new nA());
var tt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(tt || (tt = {}));
var nn;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(nn || (nn = {}));
function Ef(e) {
  return nn[e];
}
const sA = () => ({ type: tt.BoolTrue }), oA = () => ({ type: tt.BoolFalse }), iA = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: tt.Buffer, value: Me(e) };
}, Dp = BigInt("0xffffffffffffffffffffffffffffffff"), aA = BigInt(0), Fp = BigInt("0x7fffffffffffffffffffffffffffffff"), jp = BigInt("-170141183460469231731687303715884105728"), cA = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = Ru(ct(e))), Dn(e, Uint8Array) && (e = Ru(e));
  const t = An(e);
  if (t > Fp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Fp}`);
  if (t < jp)
    throw new RangeError(`Cannot construct clarity integer form value less than ${jp}`);
  return { type: tt.Int, value: t };
}, lA = (e) => {
  const t = An(e);
  if (t < aA)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Dp)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Dp}`);
  return { type: tt.UInt, value: t };
};
function uA(e) {
  return { type: tt.List, value: e };
}
function xw() {
  return { type: tt.OptionalNone };
}
function Sw(e) {
  return { type: tt.OptionalSome, value: e };
}
var ye;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ye || (ye = {}));
function dA() {
  return {
    type: ye.Address,
    version: jo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Rp(e) {
  if (e && Tw(e, Jc))
    throw new Error(`Memo exceeds maximum length of ${Jc} bytes`);
  return { type: ye.MemoString, content: e };
}
function Af(e, t) {
  return {
    type: ye.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function dd(e) {
  if (ct(e).byteLength != Bl)
    throw Error("Invalid signature");
  return {
    type: ye.MessageSignature,
    data: e
  };
}
function fA(e, t, n) {
  return typeof e == "string" && (e = LA(e)), typeof n == "string" && (n = Rp(n)), {
    type: ye.Payload,
    payloadType: pt.TokenTransfer,
    recipient: e,
    amount: An(t),
    memo: n ?? Rp("")
  };
}
function hA(e, t, n, r) {
  return typeof t == "string" && (t = Cr(t)), typeof n == "string" && (n = Cr(n)), {
    type: ye.Payload,
    payloadType: pt.ContractCall,
    contractAddress: typeof e == "string" ? io(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function pA(e) {
  return Cr(e, 4, 1e5);
}
function zp(e, t, n) {
  return typeof e == "string" && (e = Cr(e)), typeof t == "string" && (t = pA(t)), typeof n == "number" ? {
    type: ye.Payload,
    payloadType: pt.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ye.Payload,
    payloadType: pt.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function gA() {
  return { type: ye.Payload, payloadType: pt.PoisonMicroblock };
}
function Gp(e, t) {
  if (e.byteLength != Io)
    throw Error(`Coinbase buffer size must be ${Io} bytes`);
  return t != null ? {
    type: ye.Payload,
    payloadType: pt.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ye.Payload,
    payloadType: pt.Coinbase,
    coinbaseBytes: e
  };
}
function yA(e, t, n) {
  if (e.byteLength != Io)
    throw Error(`Coinbase buffer size must be ${Io} bytes`);
  if (n.byteLength != sd)
    throw Error(`VRF proof buffer size must be ${sd} bytes`);
  return {
    type: ye.Payload,
    payloadType: pt.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === tt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function wA(e, t, n, r, s, o, i) {
  return {
    type: ye.Payload,
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
function Cr(e, t, n) {
  const r = t || 1, s = n || eE;
  if (Tw(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ye.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function mA(e, t, n) {
  return {
    type: ye.Asset,
    address: io(e),
    contractName: Cr(t),
    assetName: Cr(n)
  };
}
function io(e) {
  const t = Zo.c32addressDecode(e);
  return {
    type: ye.Address,
    version: t[0],
    hash160: t[1]
  };
}
function bA(e, t) {
  const n = io(e), r = Cr(t);
  return {
    type: ye.Principal,
    prefix: Ln.Contract,
    address: n,
    contractName: r
  };
}
function xA(e) {
  const t = io(e);
  return {
    type: ye.Principal,
    prefix: Ln.Standard,
    address: t
  };
}
function wi(e, t) {
  return {
    pubKeyEncoding: e,
    type: ye.TransactionAuthField,
    contents: t
  };
}
function cs(e) {
  switch (e.type) {
    case ye.Address:
      return Da(e);
    case ye.Principal:
      return vw(e);
    case ye.LengthPrefixedString:
      return Pi(e);
    case ye.MemoString:
      return vA(e);
    case ye.Asset:
      return Aw(e);
    case ye.PostCondition:
      return $w(e);
    case ye.PublicKey:
      return pd(e);
    case ye.LengthPrefixedList:
      return kf(e);
    case ye.Payload:
      return Iw(e);
    case ye.TransactionAuthField:
      return IA(e);
    case ye.MessageSignature:
      return $f(e);
  }
}
function Da(e) {
  const t = [];
  return t.push(ct(Na(e.version, 1))), t.push(ct(e.hash160)), Wt(t);
}
function _i(e) {
  const t = Dn(e, $t) ? e : new $t(e), n = ml(Me(t.readBytes(1))), r = Me(t.readBytes(20));
  return { type: ye.Address, version: n, hash160: r };
}
function vw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === Ln.Standard || e.prefix === Ln.Contract) && t.push(Da(e.address)), e.prefix === Ln.Contract && t.push(Pi(e.contractName)), Wt(t);
}
function SA(e) {
  const t = Dn(e, $t) ? e : new $t(e), n = t.readUInt8Enum(Ln, (o) => {
    throw new $n(`Unexpected Principal payload type: ${o}`);
  });
  if (n === Ln.Origin)
    return { type: ye.Principal, prefix: n };
  const r = _i(t);
  if (n === Ln.Standard)
    return { type: ye.Principal, prefix: n, address: r };
  const s = lr(t);
  return {
    type: ye.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Pi(e) {
  const t = [], n = Xo(e.content), r = n.byteLength;
  return t.push(ct(Na(r, e.lengthPrefixBytes))), t.push(n), Wt(t);
}
function lr(e, t, n) {
  t = t || 1;
  const r = Dn(e, $t) ? e : new $t(e), s = ml(Me(r.readBytes(t))), o = _a(r.readBytes(s));
  return Cr(o, t, n ?? 128);
}
function vA(e) {
  const t = [], n = Xo(e.content), r = WA(Me(n), Jc * 2);
  return t.push(ct(r)), Wt(t);
}
function Ew(e) {
  const t = Dn(e, $t) ? e : new $t(e);
  let n = _a(t.readBytes(Jc));
  return n = n.replace(/\u0000*$/, ""), { type: ye.MemoString, content: n };
}
function Aw(e) {
  const t = [];
  return t.push(Da(e.address)), t.push(Pi(e.contractName)), t.push(Pi(e.assetName)), Wt(t);
}
function fd(e) {
  const t = Dn(e, $t) ? e : new $t(e);
  return {
    type: ye.Asset,
    address: _i(t),
    contractName: lr(t),
    assetName: lr(t)
  };
}
function kf(e) {
  const t = e.values, n = [];
  n.push(ct(Na(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(cs(r));
  return Wt(n);
}
function kw(e, t, n) {
  const r = Dn(e, $t) ? e : new $t(e), s = ml(Me(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (t) {
      case ye.Address:
        o.push(_i(r));
        break;
      case ye.LengthPrefixedString:
        o.push(lr(r));
        break;
      case ye.MemoString:
        o.push(Ew(r));
        break;
      case ye.Asset:
        o.push(fd(r));
        break;
      case ye.PostCondition:
        o.push(AA(r));
        break;
      case ye.PublicKey:
        o.push(gd(r));
        break;
      case ye.TransactionAuthField:
        o.push($A(r));
        break;
    }
  return Af(o, n);
}
function EA(e) {
  return Me($w(e));
}
function $w(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(vw(e.principal)), (e.conditionType === Bt.Fungible || e.conditionType === Bt.NonFungible) && t.push(Aw(e.asset)), e.conditionType === Bt.NonFungible && t.push(Xr(e.assetName)), t.push(e.conditionCode), e.conditionType === Bt.STX || e.conditionType === Bt.Fungible || e.conditionType === Bt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new yi("The post-condition amount may not be larger than 8 bytes");
    t.push(so(e.amount, 8));
  }
  return Wt(t);
}
function AA(e) {
  const t = Dn(e, $t) ? e : new $t(e), n = t.readUInt8Enum(Bt, (a) => {
    throw new $n(`Could not read ${a} as PostConditionType`);
  }), r = SA(t);
  let s, o, i;
  switch (n) {
    case Bt.STX:
      return s = t.readUInt8Enum(ya, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Me(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Bt.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Bt.Fungible:
      return o = fd(t), s = t.readUInt8Enum(ya, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Me(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Bt.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case Bt.NonFungible:
      o = fd(t);
      const a = Gr(t);
      return s = t.readUInt8Enum(id, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ye.PostCondition,
        conditionType: Bt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: a
      };
    case Bt.Staking:
      return s = t.readUInt8Enum(ya, (c) => {
        throw new $n(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Me(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Bt.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Bt.PoX: {
      const c = t.readUInt8Enum(ad, (u) => {
        throw new $n(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ye.PostCondition,
        conditionType: Bt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Iw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case pt.TokenTransfer:
      t.push(Xr(e.recipient)), t.push(so(e.amount, 8)), t.push(cs(e.memo));
      break;
    case pt.ContractCall:
      t.push(cs(e.contractAddress)), t.push(cs(e.contractName)), t.push(cs(e.functionName));
      const n = new Uint8Array(4);
      Bo(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Xr(r));
      });
      break;
    case pt.SmartContract:
      t.push(cs(e.contractName)), t.push(cs(e.codeBody));
      break;
    case pt.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(cs(e.contractName)), t.push(cs(e.codeBody));
      break;
    case pt.PoisonMicroblock:
      break;
    case pt.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case pt.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Xr(e.recipient));
      break;
    case pt.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Xr(e.recipient ? Sw(e.recipient) : xw())), t.push(e.vrfProof);
      break;
    case pt.TenureChange:
      t.push(ct(e.tenureHash)), t.push(ct(e.previousTenureHash)), t.push(ct(e.burnViewHash)), t.push(ct(e.previousTenureEnd)), t.push(Bo(new Uint8Array(4), e.previousTenureBlocks)), t.push(S1(new Uint8Array(1), e.cause)), t.push(ct(e.publicKeyHash));
      break;
  }
  return Wt(t);
}
function kA(e) {
  const t = Dn(e, $t) ? e : new $t(e);
  switch (t.readUInt8Enum(pt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case pt.TokenTransfer:
      const r = Gr(t), s = An(t.readBytes(8)), o = Ew(t);
      return fA(r, s, o);
    case pt.ContractCall:
      const i = _i(t), a = lr(t), c = lr(t), u = [], h = t.readUInt32BE();
      for (let M = 0; M < h; M++) {
        const U = Gr(t);
        u.push(U);
      }
      return hA(i, a, c, u);
    case pt.SmartContract:
      const d = lr(t), m = lr(t, 4, 1e5);
      return zp(d, m);
    case pt.VersionedSmartContract: {
      const M = t.readUInt8Enum(od, (ae) => {
        throw new Error(`Cannot recognize ClarityVersion: ${ae}`);
      }), U = lr(t), X = lr(t, 4, dE);
      return zp(U, X, M);
    }
    case pt.PoisonMicroblock:
      return gA();
    case pt.Coinbase: {
      const M = t.readBytes(Io);
      return Gp(M);
    }
    case pt.CoinbaseToAltRecipient: {
      const M = t.readBytes(Io), U = Gr(t);
      return Gp(M, U);
    }
    case pt.NakamotoCoinbase: {
      const M = t.readBytes(Io), U = Gr(t), X = t.readBytes(sd);
      return yA(M, U, X);
    }
    case pt.TenureChange:
      const w = Me(t.readBytes(20)), v = Me(t.readBytes(20)), E = Me(t.readBytes(20)), L = Me(t.readBytes(32)), P = t.readUInt32BE(), O = t.readUInt8Enum(cd, (M) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${M}`);
      }), A = Me(t.readBytes(20));
      return wA(w, v, E, L, P, O, A);
  }
}
function hd(e) {
  const t = Dn(e, $t) ? e : new $t(e);
  return dd(Me(t.readBytes(Bl)));
}
function $A(e) {
  const t = Dn(e, $t) ? e : new $t(e), n = t.readUInt8Enum(Ar, (r) => {
    throw new $n(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Ar.PublicKeyCompressed:
      return wi(Ut.Compressed, gd(t));
    case Ar.PublicKeyUncompressed:
      return wi(Ut.Uncompressed, zi(ak(gd(t).data)));
    case Ar.SignatureCompressed:
      return wi(Ut.Compressed, hd(t));
    case Ar.SignatureUncompressed:
      return wi(Ut.Uncompressed, hd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function $f(e) {
  return ct(e.data);
}
function IA(e) {
  const t = [];
  switch (e.contents.type) {
    case ye.PublicKey:
      t.push(e.pubKeyEncoding === Ut.Compressed ? Ar.PublicKeyCompressed : Ar.PublicKeyUncompressed), t.push(ct(ik(e.contents.data)));
      break;
    case ye.MessageSignature:
      t.push(e.pubKeyEncoding === Ut.Compressed ? Ar.SignatureCompressed : Ar.SignatureUncompressed), t.push($f(e.contents));
      break;
  }
  return Wt(t);
}
function pd(e) {
  return e.data.slice();
}
function gd(e) {
  const t = Dn(e, $t) ? e : new $t(e), n = t.readUInt8(), r = n === 4 ? rE : nE;
  return zi(Wt([n, t.readBytes(r)]));
}
function If(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === vt.P2PKH || t === vt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === vt.P2WPKH || t === vt.P2WSH || t === vt.P2WSHNonSequential) && !r.map((s) => s.data).every(Gi))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case vt.P2PKH:
      return lc(e, ZA(r[0].data));
    case vt.P2WPKH:
      return lc(e, JA(r[0].data));
    case vt.P2SH:
    case vt.P2SHNonSequential:
      return lc(e, QA(n, r.map(pd)));
    case vt.P2WSH:
    case vt.P2WSHNonSequential:
      return lc(e, ek(n, r.map(pd)));
  }
}
function lc(e, t) {
  return { type: ye.Address, version: e, hash160: t };
}
function Lf(e) {
  return Zo.c32address(e.version, e.hash160);
}
function Kp(e) {
  const [t, n, r] = e.split(/\.|::/);
  return mA(t, n, r);
}
function ra(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return bA(t, n);
  } else
    return xA(e);
}
function LA(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return BA(t, n);
  } else
    return CA(e);
}
function CA(e) {
  const t = io(e);
  return { type: tt.PrincipalStandard, value: Lf(t) };
}
function TA(e) {
  return { type: tt.PrincipalStandard, value: Lf(e) };
}
function BA(e, t) {
  const n = io(e), r = Cr(t);
  return Lw(n, r);
}
function Lw(e, t) {
  if (Xo(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: tt.PrincipalContract,
    value: `${Lf(e)}.${t.content}`
  };
}
function MA(e) {
  return { type: tt.ResponseErr, value: e };
}
function NA(e) {
  return { type: tt.ResponseOk, value: e };
}
const _A = (e) => ({ type: tt.StringASCII, value: e }), PA = (e) => ({ type: tt.StringUTF8, value: e });
function UA(e) {
  for (const t in e)
    if (!tk(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: tt.Tuple, value: e };
}
function Gr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new $t(ct(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new $t(e) : t = e;
  switch (t.readUInt8Enum(nn, (r) => {
    throw new $n(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case nn.int:
      return cA(Ru(t.readBytes(16)));
    case nn.uint:
      return lA(t.readBytes(16));
    case nn.buffer:
      const r = t.readUInt32BE();
      return iA(t.readBytes(r));
    case nn.true:
      return sA();
    case nn.false:
      return oA();
    case nn.address:
      const s = _i(t);
      return TA(s);
    case nn.contract:
      const o = _i(t), i = lr(t);
      return Lw(o, i);
    case nn.ok:
      return NA(Gr(t));
    case nn.err:
      return MA(Gr(t));
    case nn.none:
      return xw();
    case nn.some:
      return Sw(Gr(t));
    case nn.list:
      const a = t.readUInt32BE(), c = [];
      for (let E = 0; E < a; E++)
        c.push(Gr(t));
      return uA(c);
    case nn.tuple:
      const u = t.readUInt32BE(), h = {};
      for (let E = 0; E < u; E++) {
        const L = lr(t).content;
        if (L === void 0)
          throw new $n('"content" is undefined');
        h[L] = Gr(t);
      }
      return UA(h);
    case nn.ascii:
      const d = t.readUInt32BE(), m = h1(t.readBytes(d));
      return _A(m);
    case nn.utf8:
      const w = t.readUInt32BE(), v = _a(t.readBytes(w));
      return PA(v);
    default:
      throw new $n("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Zr(e, t) {
  return Wt([Ef(e), t]);
}
function OA(e) {
  return new Uint8Array([Ef(e.type)]);
}
function HA(e) {
  return e.type === tt.OptionalNone ? new Uint8Array([Ef(e.type)]) : Zr(e.type, Xr(e.value));
}
function DA(e) {
  const t = new Uint8Array(4);
  return Bo(t, Math.ceil(e.value.length / 2), 0), Zr(e.type, qr(t, ct(e.value)));
}
function FA(e) {
  const t = qd(c1(BigInt(e.value), BigInt(tE)), dw);
  return Zr(e.type, t);
}
function jA(e) {
  const t = qd(BigInt(e.value), dw);
  return Zr(e.type, t);
}
function RA(e) {
  return Zr(e.type, Da(io(e.value)));
}
function zA(e) {
  const [t, n] = nk(e.value);
  return Zr(e.type, qr(Da(io(t)), Pi(Cr(n))));
}
function GA(e) {
  return Zr(e.type, Xr(e.value));
}
function KA(e) {
  const t = [], n = new Uint8Array(4);
  Bo(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = Xr(r);
    t.push(s);
  }
  return Zr(e.type, Wt(t));
}
function VA(e) {
  const t = [], n = new Uint8Array(4);
  Bo(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Cr(s);
    t.push(Pi(o));
    const i = Xr(e.value[s]);
    t.push(i);
  }
  return Zr(e.type, Wt(t));
}
function Cw(e, t) {
  const n = [], r = t == "ascii" ? f1(e.value) : Xo(e.value), s = new Uint8Array(4);
  return Bo(s, r.length, 0), n.push(s), n.push(r), Zr(e.type, Wt(n));
}
function XA(e) {
  return Cw(e, "ascii");
}
function YA(e) {
  return Cw(e, "utf8");
}
function Vp(e) {
  return Me(Xr(e));
}
function Xr(e) {
  switch (e.type) {
    case tt.BoolTrue:
    case tt.BoolFalse:
      return OA(e);
    case tt.OptionalNone:
    case tt.OptionalSome:
      return HA(e);
    case tt.Buffer:
      return DA(e);
    case tt.UInt:
      return jA(e);
    case tt.Int:
      return FA(e);
    case tt.PrincipalStandard:
      return RA(e);
    case tt.PrincipalContract:
      return zA(e);
    case tt.ResponseOk:
    case tt.ResponseErr:
      return GA(e);
    case tt.List:
      return KA(e);
    case tt.Tuple:
      return VA(e);
    case tt.StringASCII:
      return XA(e);
    case tt.StringUTF8:
      return YA(e);
    default:
      throw new yi("Unable to serialize. Invalid Clarity Value.");
  }
}
const qA = (e) => e.length % 2 ? `0${e}` : e, WA = (e, t) => e.padEnd(t, "0"), Tw = (e, t) => e ? Xo(e).length > t : !1;
function yd(e) {
  return aw(e);
}
const va = (e) => TE(xf(e)), Cf = (e) => Me(rA(e)), ZA = (e) => Me(va(e)), JA = (e) => {
  const t = va(e), n = qr(new Uint8Array([0]), new Uint8Array([t.length]), t), r = va(n);
  return Me(r);
}, QA = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = Wt(n), s = va(r);
  return Me(s);
}, ek = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = Wt(n), s = xf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = Wt(o), a = va(i);
  return Me(a);
};
function tk(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function nk(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
zt.hmacSha256Sync = (e, ...t) => {
  const n = gw.create(xf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function zi(e) {
  return e = typeof e == "string" ? ct(e) : e, {
    type: ye.PublicKey,
    data: e
  };
}
function rk(e, t, n = Ut.Compressed) {
  const r = w1(t), s = new Jn(Vh(r.r), Vh(r.s)), o = qe.fromSignature(e, s, r.recoveryId), i = n === Ut.Compressed;
  return o.toHex(i);
}
function sk(e) {
  return typeof e == "string" ? e : Me(e);
}
const Tf = sk;
function Bw(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === y1;
}
function Gi(e) {
  return !Tf(e).startsWith("04");
}
function ok(e) {
  e = Wd(e);
  const t = Bw(e);
  return Me(Pa(e.slice(0, 32), t));
}
function ik(e) {
  return qe.fromHex(Tf(e)).toHex(!0);
}
function ak(e) {
  return qe.fromHex(Tf(e)).toHex(!1);
}
function ck(e, t) {
  e = Wd(e);
  const [n, r] = xl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Na(r, 1) + Jn.fromHex(n).toCompactHex();
}
function Bf() {
  return {
    type: ye.MessageSignature,
    data: Me(new Uint8Array(Bl))
  };
}
function Mw(e, t, n, r) {
  const s = If(0, e, 1, [zi(t)]).hash160, o = Gi(t) ? Ut.Compressed : Ut.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: An(n),
    fee: An(r),
    keyEncoding: o,
    signature: Bf()
  };
}
function Ea(e) {
  return "signature" in e;
}
function Xp(e) {
  return e === vt.P2SH || e === vt.P2WSH;
}
function lk(e) {
  return e === vt.P2SHNonSequential || e === vt.P2WSHNonSequential;
}
function Yp(e) {
  const t = yd(e);
  return t.nonce = 0, t.fee = 0, Ea(t) ? t.signature = Bf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function uk(e) {
  const t = [
    e.hashMode,
    ct(e.signer),
    so(e.nonce, 8),
    so(e.fee, 8),
    e.keyEncoding,
    $f(e.signature)
  ];
  return Wt(t);
}
function dk(e) {
  const t = [
    e.hashMode,
    ct(e.signer),
    so(e.nonce, 8),
    so(e.fee, 8)
  ], n = Af(e.fields);
  t.push(kf(n));
  const r = new Uint8Array(2);
  return b1(r, e.signaturesRequired, 0), t.push(r), Wt(t);
}
function fk(e, t) {
  const n = Me(t.readBytes(20)), r = BigInt(`0x${Me(t.readBytes(8))}`), s = BigInt(`0x${Me(t.readBytes(8))}`), o = t.readUInt8Enum(Ut, (a) => {
    throw new $n(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === vt.P2WPKH && o != Ut.Compressed)
    throw new $n("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = hd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function hk(e, t) {
  const n = Me(t.readBytes(20)), r = BigInt("0x" + Me(t.readBytes(8))), s = BigInt("0x" + Me(t.readBytes(8))), o = kw(t, ye.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case ye.PublicKey:
        Gi(u.contents.data) || (i = !0);
        break;
      case ye.MessageSignature:
        if (u.pubKeyEncoding === Ut.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new vo("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === vt.P2WSH || e === vt.P2WSHNonSequential))
    throw new vo("Uncompressed keys are not allowed in this hash mode");
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
  return Ea(e) ? uk(e) : dk(e);
}
function fu(e) {
  const t = e.readUInt8Enum(vt, (n) => {
    throw new $n(`Could not parse ${n} as AddressHashMode`);
  });
  return t === vt.P2PKH || t === vt.P2WPKH ? fk(t, e) : hk(t, e);
}
function Nw(e, t, n, r) {
  const o = e + Me(new Uint8Array([t])) + Me(so(n, 8)) + Me(so(r, 8));
  if (ct(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Cf(ct(o));
}
function _w(e, t, n) {
  const r = 33 + Bl, s = Gi(t.data) ? Ut.Compressed : Ut.Uncompressed, o = e + qA(s.toString(16)) + n, i = ct(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Cf(i);
}
function pk(e, t, n, r, s) {
  const o = Nw(e, t, n, r), i = ck(s, o), a = zi(ok(s)), c = _w(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function Pw(e, t, n, r, s, o) {
  const i = Nw(e, t, n, r), a = zi(rk(i, o, s)), c = _w(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function gk() {
  const e = Mw(vt.P2PKH, "", 0, 0);
  return e.signer = dA().hash160, e.keyEncoding = Ut.Compressed, e.signature = Bf(), e;
}
function qp(e, t, n) {
  return Ea(e) ? yk(e, t, n) : wk(e, t, n);
}
function yk(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Pw(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), o = If(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new vo(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function wk(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case ye.PublicKey:
        Gi(c.contents.data) || (o = !0), r.push(c.contents);
        break;
      case ye.MessageSignature:
        c.pubKeyEncoding === Ut.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = Pw(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (Xp(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new vo("Too many signatures");
        break;
    }
  if (Xp(e.hashMode) && i !== e.signaturesRequired || lk(e.hashMode) && i < e.signaturesRequired)
    throw new vo("Incorrect number of signatures");
  if (o && (e.hashMode === vt.P2WSH || e.hashMode === vt.P2WSHNonSequential))
    throw new vo("Uncompressed keys are not allowed in this hash mode");
  const a = If(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new vo(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Uw(e) {
  return {
    authType: jt.Standard,
    spendingCondition: e
  };
}
function Ow(e, t) {
  return {
    authType: jt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Mw(vt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Wp(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case jt.Standard:
        return Uw(Yp(e.spendingCondition));
      case jt.Sponsored:
        return Ow(Yp(e.spendingCondition), gk());
      default:
        throw new el("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function mk(e, t) {
  switch (e.authType) {
    case jt.Standard:
      return qp(e.spendingCondition, t, jt.Standard);
    case jt.Sponsored:
      return qp(e.spendingCondition, t, jt.Standard);
    default:
      throw new el("Invalid origin auth type");
  }
}
function bk(e, t) {
  switch (e.authType) {
    case jt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: An(t)
      };
      return { ...e, spendingCondition: n };
    case jt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: An(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function xk(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: An(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function Sk(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: An(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function vk(e, t) {
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
    case jt.Standard:
      t.push(du(e.spendingCondition));
      break;
    case jt.Sponsored:
      t.push(du(e.spendingCondition)), t.push(du(e.sponsorSpendingCondition));
      break;
  }
  return Wt(t);
}
function Ak(e) {
  const t = e.readUInt8Enum(jt, (r) => {
    throw new $n(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case jt.Standard:
      return n = fu(e), Uw(n);
    case jt.Sponsored:
      n = fu(e);
      const r = fu(e);
      return Ow(n, r);
  }
}
class kk {
  constructor({ auth: t, payload: n, postConditions: r = Af([]), postConditionMode: s = Qc.Deny, transactionVersion: o, chainId: i, network: a = "mainnet" }) {
    a = Jv(a), this.transactionVersion = o ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: An(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Xn.Any;
  }
  signBegin() {
    const t = yd(this);
    return t.auth = Wp(t.auth), t.txid();
  }
  verifyBegin() {
    const t = yd(this);
    return t.auth = Wp(t.auth), t.txid();
  }
  verifyOrigin() {
    return mk(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, jt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === jt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, jt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : zi(t), r = this.auth.spendingCondition;
    if (r && !Ea(r)) {
      const s = Gi(n.data);
      r.fields.push(wi(s ? Ut.Compressed : Ut.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = pk(n, r, t.fee, t.nonce, s);
    if (Ea(t))
      t.signature = dd(o);
    else {
      const a = Bw(s);
      t.fields.push(wi(a ? Ut.Compressed : Ut.Uncompressed, dd(o)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return Cf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != jt.Sponsored)
      throw new el("Cannot sponsor sign a non-sponsored transaction");
    this.auth = vk(this.auth, t);
  }
  setFee(t) {
    this.auth = bk(this.auth, t);
  }
  setNonce(t) {
    this.auth = xk(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != jt.Sponsored)
      throw new el("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Sk(this.auth, t);
  }
  serialize() {
    return Me(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new yi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new yi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new yi('"auth" is undefined');
    if (this.payload === void 0)
      throw new yi('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Bo(n, this.chainId, 0), t.push(n), t.push(Ek(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(kf(this.postConditions)), t.push(Iw(this.payload)), Wt(t);
  }
}
function $k(e) {
  const t = Dn(e, $t) ? e : new $t(e), n = t.readUInt8Enum(Fo, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = Ak(t), o = t.readUInt8Enum(Xn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = t.readUInt8Enum(Qc, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = kw(t, ye.PostCondition), c = kA(t), u = new kk({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return u.anchorMode = o, u;
}
const Zp = BigInt("18446744073709551615");
function hu(e) {
  const t = An(e);
  if (t < 0n || t > Zp)
    throw new RangeError(`Post-condition amount must be between 0 and ${Zp} (u64 max), received: ${t}`);
  return t;
}
var wd;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(wd || (wd = {}));
var md;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(md || (md = {}));
function Ik(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Bt.STX,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Ln.Origin } : ra(e.address),
        conditionCode: uc(e.condition),
        amount: hu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Bt.Fungible,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Ln.Origin } : ra(e.address),
        conditionCode: uc(e.condition),
        amount: hu(e.amount),
        asset: Kp(e.asset)
      };
    case "nft-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Bt.NonFungible,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Ln.Origin } : ra(e.address),
        conditionCode: uc(e.condition),
        asset: Kp(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Bt.Staking,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Ln.Origin } : ra(e.address),
        conditionCode: uc(e.condition),
        amount: hu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Bt.PoX,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Ln.Origin } : ra(e.address),
        conditionCode: Lk(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function uc(e) {
  return wd[e];
}
function Lk(e) {
  return md[e];
}
function Hw(e) {
  const t = Ik(e);
  return EA(t);
}
function Ck(e, t, n) {
  return Nf(Dw(e), n);
}
function Dw(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Aa(r);
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
    return BigInt(`0x${Mk(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Mf(e, t = 8) {
  return (typeof e == "bigint" ? e : Dw(e)).toString(16).padStart(t * 2, "0");
}
function Nf(e, t = 16) {
  const n = Mf(e, t);
  return Aa(n);
}
function Tk(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const Bk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Mk(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Bk[n];
  return t;
}
function Aa(e) {
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
function _f(e) {
  return new TextEncoder().encode(e);
}
function Nk(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function _k(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Jp(e) {
  if (e.some(_k))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Pf(...e) {
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
function ws(e) {
  return Pf(...e.map((t) => typeof t == "number" ? Jp([t]) : t instanceof Array ? Jp(t) : t));
}
function _l(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var bd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(bd || (bd = {}));
bd.Mainnet;
const Pk = 128, Uk = 128, Fw = 16;
var xd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(xd || (xd = {}));
var Qp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Qp || (Qp = {}));
var e0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(e0 || (e0 = {}));
var vr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(vr || (vr = {}));
const pu = ["onChainOnly", "offChainOnly", "any"];
pu[0] + "", vr.OnChainOnly, pu[1] + "", vr.OffChainOnly, pu[2] + "", vr.Any, vr.OnChainOnly + "", vr.OnChainOnly, vr.OffChainOnly + "", vr.OffChainOnly, vr.Any + "", vr.Any;
var Sd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Sd || (Sd = {}));
Sd.Mainnet;
var t0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(t0 || (t0 = {}));
var mo;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(mo || (mo = {}));
var n0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(n0 || (n0 = {}));
var r0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(r0 || (r0 = {}));
var s0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(s0 || (s0 = {}));
var o0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(o0 || (o0 = {}));
var i0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(i0 || (i0 = {}));
var a0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(a0 || (a0 = {}));
var vd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(vd || (vd = {}));
var c0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(c0 || (c0 = {}));
var l0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(l0 || (l0 = {}));
function Ed(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Ok(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function jw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Hk(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ed(e.outputLen), Ed(e.blockLen);
}
function Dk(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Fk(e, t) {
  jw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const gu = {
  number: Ed,
  bool: Ok,
  bytes: jw,
  hash: Hk,
  exists: Dk,
  output: Fk
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const yu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), jr = (e, t) => e << 32 - t | e >>> t, jk = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!jk)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Rk(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Rw(e) {
  if (typeof e == "string" && (e = Rk(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let zk = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Qo(e) {
  const t = (r) => e().update(Rw(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Gk(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Uf = class extends zk {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = yu(this.buffer);
  }
  update(t) {
    gu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Rw(t);
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
    Gk(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const Kk = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), zw = Uint8Array.from({ length: 16 }, (e, t) => t), Vk = zw.map((e) => (9 * e + 5) % 16);
let Of = [zw], Hf = [Vk];
for (let e = 0; e < 4; e++)
  for (let t of [Of, Hf])
    t.push(t[e].map((n) => Kk[n]));
const Gw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), Xk = Of.map((e, t) => e.map((n) => Gw[t][n])), Yk = Hf.map((e, t) => e.map((n) => Gw[t][n])), qk = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Wk = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), dc = (e, t) => e << t | e >>> 32 - t;
function u0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const fc = new Uint32Array(16);
let Zk = class extends Uf {
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
      const v = 4 - w, E = qk[w], L = Wk[w], P = Of[w], O = Hf[w], A = Xk[w], M = Yk[w];
      for (let U = 0; U < 16; U++) {
        const X = dc(r + u0(w, o, a, u) + fc[P[U]] + E, A[U]) + d | 0;
        r = d, d = u, u = dc(a, 10) | 0, a = o, o = X;
      }
      for (let U = 0; U < 16; U++) {
        const X = dc(s + u0(v, i, c, h) + fc[O[U]] + L, M[U]) + m | 0;
        s = m, m = h, h = dc(c, 10) | 0, c = i, i = X;
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
Qo(() => new Zk());
const Jk = (e, t, n) => e & t ^ ~e & n, Qk = (e, t, n) => e & t ^ e & n ^ t & n, e3 = new Uint32Array([
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
]), js = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Rs = new Uint32Array(64);
let Kw = class extends Uf {
  constructor() {
    super(64, 32, 8, !1), this.A = js[0] | 0, this.B = js[1] | 0, this.C = js[2] | 0, this.D = js[3] | 0, this.E = js[4] | 0, this.F = js[5] | 0, this.G = js[6] | 0, this.H = js[7] | 0;
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
      Rs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Rs[d - 15], w = Rs[d - 2], v = jr(m, 7) ^ jr(m, 18) ^ m >>> 3, E = jr(w, 17) ^ jr(w, 19) ^ w >>> 10;
      Rs[d] = E + Rs[d - 7] + v + Rs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = jr(a, 6) ^ jr(a, 11) ^ jr(a, 25), w = h + m + Jk(a, c, u) + e3[d] + Rs[d] | 0, E = (jr(r, 2) ^ jr(r, 13) ^ jr(r, 22)) + Qk(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, t3 = class extends Kw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Qo(() => new Kw());
Qo(() => new t3());
const hc = BigInt(2 ** 32 - 1), Ad = BigInt(32);
function Vw(e, t = !1) {
  return t ? { h: Number(e & hc), l: Number(e >> Ad & hc) } : { h: Number(e >> Ad & hc) | 0, l: Number(e & hc) | 0 };
}
function n3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Vw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const r3 = (e, t) => BigInt(e >>> 0) << Ad | BigInt(t >>> 0), s3 = (e, t, n) => e >>> n, o3 = (e, t, n) => e << 32 - n | t >>> n, i3 = (e, t, n) => e >>> n | t << 32 - n, a3 = (e, t, n) => e << 32 - n | t >>> n, c3 = (e, t, n) => e << 64 - n | t >>> n - 32, l3 = (e, t, n) => e >>> n - 32 | t << 64 - n, u3 = (e, t) => t, d3 = (e, t) => e, f3 = (e, t, n) => e << n | t >>> 32 - n, h3 = (e, t, n) => t << n | e >>> 32 - n, p3 = (e, t, n) => t << n - 32 | e >>> 64 - n, g3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function y3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const w3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), m3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, b3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), x3 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, S3 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), v3 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Ve = {
  fromBig: Vw,
  split: n3,
  toBig: r3,
  shrSH: s3,
  shrSL: o3,
  rotrSH: i3,
  rotrSL: a3,
  rotrBH: c3,
  rotrBL: l3,
  rotr32H: u3,
  rotr32L: d3,
  rotlSH: f3,
  rotlSL: h3,
  rotlBH: p3,
  rotlBL: g3,
  add: y3,
  add3L: w3,
  add3H: m3,
  add4L: b3,
  add4H: x3,
  add5H: v3,
  add5L: S3
}, [E3, A3] = Ve.split([
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
].map((e) => BigInt(e))), zs = new Uint32Array(80), Gs = new Uint32Array(80);
let Pl = class extends Uf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: E, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, m, w, v, E, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, m, w, v, E, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = E | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      zs[A] = t.getUint32(n), Gs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const M = zs[A - 15] | 0, U = Gs[A - 15] | 0, X = Ve.rotrSH(M, U, 1) ^ Ve.rotrSH(M, U, 8) ^ Ve.shrSH(M, U, 7), ae = Ve.rotrSL(M, U, 1) ^ Ve.rotrSL(M, U, 8) ^ Ve.shrSL(M, U, 7), se = zs[A - 2] | 0, Y = Gs[A - 2] | 0, b = Ve.rotrSH(se, Y, 19) ^ Ve.rotrBH(se, Y, 61) ^ Ve.shrSH(se, Y, 6), $ = Ve.rotrSL(se, Y, 19) ^ Ve.rotrBL(se, Y, 61) ^ Ve.shrSL(se, Y, 6), N = Ve.add4L(ae, $, Gs[A - 7], Gs[A - 16]), _ = Ve.add4H(N, X, b, zs[A - 7], zs[A - 16]);
      zs[A] = _ | 0, Gs[A] = N | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: E, Gl: L, Hh: P, Hl: O } = this;
    for (let A = 0; A < 80; A++) {
      const M = Ve.rotrSH(d, m, 14) ^ Ve.rotrSH(d, m, 18) ^ Ve.rotrBH(d, m, 41), U = Ve.rotrSL(d, m, 14) ^ Ve.rotrSL(d, m, 18) ^ Ve.rotrBL(d, m, 41), X = d & w ^ ~d & E, ae = m & v ^ ~m & L, se = Ve.add5L(O, U, ae, A3[A], Gs[A]), Y = Ve.add5H(se, P, M, X, E3[A], zs[A]), b = se | 0, $ = Ve.rotrSH(r, s, 28) ^ Ve.rotrBH(r, s, 34) ^ Ve.rotrBH(r, s, 39), N = Ve.rotrSL(r, s, 28) ^ Ve.rotrBL(r, s, 34) ^ Ve.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, q = s & i ^ s & c ^ i & c;
      P = E | 0, O = L | 0, E = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Ve.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const R = Ve.add3L(b, N, q);
      r = Ve.add3H(R, Y, $, _), s = R | 0;
    }
    ({ h: r, l: s } = Ve.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ve.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ve.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Ve.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Ve.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Ve.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: E, l: L } = Ve.add(this.Gh | 0, this.Gl | 0, E | 0, L | 0), { h: P, l: O } = Ve.add(this.Hh | 0, this.Hl | 0, P | 0, O | 0), this.set(r, s, o, i, a, c, u, h, d, m, w, v, E, L, P, O);
  }
  roundClean() {
    zs.fill(0), Gs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, k3 = class extends Pl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, $3 = class extends Pl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, I3 = class extends Pl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Qo(() => new Pl());
Qo(() => new k3());
Qo(() => new $3());
Qo(() => new I3());
function L3(e, t, n) {
  const s = Pk;
  if (G3(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: xd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var on;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(on || (on = {}));
let C3 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Xw = class extends C3 {
  constructor(t) {
    super(t);
  }
};
function Ul(e) {
  const t = [];
  return t.push(Aa(Mf(e.version, 1))), t.push(Aa(e.hash160)), ws(t);
}
function T3(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ul(e.address)), e.prefix === vd.Contract && t.push(ka(e.contractName)), ws(t);
}
function ka(e) {
  const t = [], n = _f(e.content), r = n.byteLength;
  return t.push(Aa(Mf(r, e.lengthPrefixBytes))), t.push(n), ws(t);
}
function B3(e) {
  const t = [];
  return t.push(Ul(e.address)), t.push(ka(e.contractName)), t.push(ka(e.assetName)), ws(t);
}
function Yw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(T3(e.principal)), (e.conditionType === mo.Fungible || e.conditionType === mo.NonFungible) && t.push(B3(e.assetInfo)), e.conditionType === mo.NonFungible && t.push(Ro(e.assetName)), t.push(e.conditionCode), e.conditionType === mo.STX || e.conditionType === mo.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Xw("The post-condition amount may not be larger than 8 bytes");
    t.push(Ck(e.amount, !1, 8));
  }
  return ws(t);
}
function Jr(e, t) {
  return ws([e, t]);
}
function M3(e) {
  return new Uint8Array([e.type]);
}
function N3(e) {
  return e.type === on.OptionalNone ? new Uint8Array([e.type]) : Jr(e.type, Ro(e.value));
}
function _3(e) {
  const t = new Uint8Array(4);
  return _l(t, e.buffer.length, 0), Jr(e.type, Pf(t, e.buffer));
}
function P3(e) {
  const t = Nf(Tk(e.value, BigInt(Uk)), Fw);
  return Jr(e.type, t);
}
function U3(e) {
  const t = Nf(e.value, Fw);
  return Jr(e.type, t);
}
function O3(e) {
  return Jr(e.type, Ul(e.address));
}
function H3(e) {
  return Jr(e.type, Pf(Ul(e.address), ka(e.contractName)));
}
function D3(e) {
  return Jr(e.type, Ro(e.value));
}
function F3(e) {
  const t = [], n = new Uint8Array(4);
  _l(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Ro(r);
    t.push(s);
  }
  return Jr(e.type, ws(t));
}
function j3(e) {
  const t = [], n = new Uint8Array(4);
  _l(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = L3(s);
    t.push(ka(o));
    const i = Ro(e.data[s]);
    t.push(i);
  }
  return Jr(e.type, ws(t));
}
function qw(e, t) {
  const n = [], r = t == "ascii" ? Nk(e.data) : _f(e.data), s = new Uint8Array(4);
  return _l(s, r.length, 0), n.push(s), n.push(r), Jr(e.type, ws(n));
}
function R3(e) {
  return qw(e, "ascii");
}
function z3(e) {
  return qw(e, "utf8");
}
function Ro(e) {
  switch (e.type) {
    case on.BoolTrue:
    case on.BoolFalse:
      return M3(e);
    case on.OptionalNone:
    case on.OptionalSome:
      return N3(e);
    case on.Buffer:
      return _3(e);
    case on.UInt:
      return U3(e);
    case on.Int:
      return P3(e);
    case on.PrincipalStandard:
      return O3(e);
    case on.PrincipalContract:
      return H3(e);
    case on.ResponseOk:
    case on.ResponseErr:
      return D3(e);
    case on.List:
      return F3(e);
    case on.Tuple:
      return j3(e);
    case on.StringASCII:
      return R3(e);
    case on.StringUTF8:
      return z3(e);
    default:
      throw new Xw("Unable to serialize. Invalid Clarity Value.");
  }
}
const G3 = (e, t) => e ? _f(e).length > t : !1, K3 = "connect-ui";
let Nc, Ww, Yn = !1, kd = !1;
const ys = (e, t = "") => () => {
}, V3 = (e, t) => () => {
}, X3 = "{visibility:hidden}.hydrated{visibility:inherit}", d0 = {}, Y3 = "http://www.w3.org/2000/svg", q3 = "http://www.w3.org/1999/xhtml", W3 = (e) => e != null, Df = (e) => (e = typeof e, e === "object" || e === "function");
function Zw(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const je = (e, t, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !Df(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? $d(null, r) : r), o = s);
  };
  if (a(n), t) {
    const u = t.className || t.class;
    u && (t.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = $d(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, $d = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, Z3 = {}, J3 = (e) => e && e.$tag$ === Z3, Q3 = (e, t) => e != null && !Df(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, e4 = (e) => Ki(e).$hostElement$, t4 = (e, t, n) => {
  const r = vn.ce(t, n);
  return e.dispatchEvent(r), r;
}, f0 = /* @__PURE__ */ new WeakMap(), n4 = (e, t, n) => {
  let r = tl.get(e);
  v4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, tl.set(e, r);
}, r4 = (e, t, n, r) => {
  var s;
  let o = Jw(t);
  const i = tl.get(o);
  if (e = e.nodeType === 11 ? e : Yr, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = f0.get(e), c;
      if (a || f0.set(e, a = /* @__PURE__ */ new Set()), !a.has(o)) {
        {
          c = Yr.createElement("style"), c.innerHTML = i;
          const u = (s = vn.$nonce$) !== null && s !== void 0 ? s : Zw(Yr);
          u != null && c.setAttribute("nonce", u), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(o);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return o;
}, s4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = ys("attachStyles", t.$tagName$), o = r4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, Jw = (e, t) => "sc-" + e.$tagName$, h0 = (e, t, n, r, s, o) => {
  if (n !== r) {
    let i = g0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, u = p0(n), h = p0(r);
      c.remove(...u.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : g0(Ol, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && vn.rel(e, t, n, !1), r && vn.ael(e, t, r, !1);
    else {
      const c = Df(r);
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
}, o4 = /\s/, p0 = (e) => e ? e.split(o4) : [], Qw = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, o = e && e.$attrs$ || d0, i = t.$attrs$ || d0;
  for (r in o)
    r in i || h0(s, r, o[r], void 0, n, t.$flags$);
  for (r in i)
    h0(s, r, o[r], i[r], n, t.$flags$);
}, Ff = (e, t, n, r) => {
  const s = t.$children$[n];
  let o = 0, i, a;
  if (s.$text$ !== null)
    i = s.$elm$ = Yr.createTextNode(s.$text$);
  else {
    if (Yn || (Yn = s.$tag$ === "svg"), i = s.$elm$ = Yr.createElementNS(Yn ? Y3 : q3, s.$tag$), Yn && s.$tag$ === "foreignObject" && (Yn = !1), Qw(null, s, Yn), W3(Nc) && i["s-si"] !== Nc && i.classList.add(i["s-si"] = Nc), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        a = Ff(e, s, o), a && i.appendChild(a);
    s.$tag$ === "svg" ? Yn = !1 : i.tagName === "foreignObject" && (Yn = !0);
  }
  return i;
}, em = (e, t, n, r, s, o) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === Ww && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (a = Ff(null, n, s), a && (r[s].$elm$ = a, i.insertBefore(a, t)));
}, tm = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, i4 = (e, t, n, r) => {
  let s = 0, o = 0, i = t.length - 1, a = t[0], c = t[i], u = r.length - 1, h = r[0], d = r[u], m;
  for (; s <= i && o <= u; )
    a == null ? a = t[++s] : c == null ? c = t[--i] : h == null ? h = r[++o] : d == null ? d = r[--u] : pc(a, h) ? (ua(a, h), a = t[++s], h = r[++o]) : pc(c, d) ? (ua(c, d), c = t[--i], d = r[--u]) : pc(a, d) ? (ua(a, d), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], d = r[--u]) : pc(c, h) ? (ua(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], h = r[++o]) : (m = Ff(t && t[o], n, o), h = r[++o], m && a.$elm$.parentNode.insertBefore(m, a.$elm$));
  s > i ? em(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, o, u) : o > u && tm(t, s, i);
}, pc = (e, t) => e.$tag$ === t.$tag$, ua = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, o = t.$tag$, i = t.$text$;
  i === null ? (Yn = o === "svg" ? !0 : o === "foreignObject" ? !1 : Yn, Qw(e, t, Yn), r !== null && s !== null ? i4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), em(n, null, t, s, 0, s.length - 1)) : r !== null && tm(r, 0, r.length - 1), Yn && o === "svg" && (Yn = !1)) : e.$text$ !== i && (n.data = i);
}, a4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || $d(null, null), s = J3(t) ? t : je(null, null, t);
  Ww = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Nc = n["s-sc"], ua(r, s);
}, nm = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, jf = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return nm(e, e.$ancestorComponent$), A4(() => c4(e, t));
}, c4 = (e, t) => {
  const n = ys("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), f4(s, () => l4(e, r, t));
}, l4 = async (e, t, n) => {
  const r = e.$hostElement$, s = ys("update", e.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && s4(e);
  const i = ys("render", e.$cmpMeta$.$tagName$);
  u4(e, t), o && (o.map((a) => a()), r["s-rc"] = void 0), i(), s();
  {
    const a = r["s-p"], c = () => d4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, u4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, a4(e, t);
  } catch (r) {
    $a(r, e.$hostElement$);
  }
  return null;
}, d4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = ys("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, sm(n), r(), e.$onReadyResolve$(n), s || rm()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && zf(() => jf(e, !1)), e.$flags$ &= -517;
}, rm = (e) => {
  sm(Yr.documentElement), zf(() => t4(Ol, "appload", { detail: { namespace: K3 } }));
}, f4 = (e, t) => e && e.then ? e.then(t) : t(), sm = (e) => e.classList.add("hydrated"), h4 = (e, t) => Ki(e).$instanceValues$.get(t), p4 = (e, t, n, r) => {
  const s = Ki(e), o = s.$instanceValues$.get(t), i = s.$flags$, a = s.$lazyInstance$;
  n = Q3(n, r.$members$[t][0]);
  const c = Number.isNaN(o) && Number.isNaN(n), u = n !== o && !c;
  (!(i & 8) || o === void 0) && u && (s.$instanceValues$.set(t, n), a && (i & 18) === 2 && jf(s, !1));
}, om = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return h4(this, o);
        },
        set(a) {
          p4(this, o, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, a, c) {
        vn.jmp(() => {
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
}, g4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = S4(n), s.then) {
        const c = V3();
        s = await s, c();
      }
      s.isProxied || (om(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = ys("createInstance", n.$tagName$);
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
      const c = Jw(n);
      if (!tl.has(c)) {
        const u = ys("registerStyles", n.$tagName$);
        n4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const o = t.$ancestorComponent$, i = () => jf(t, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, y4 = (e) => {
  if (!(vn.$flags$ & 1)) {
    const t = Ki(e), n = t.$cmpMeta$, r = ys("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            nm(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && e.hasOwnProperty(s)) {
          const i = e[s];
          delete e[s], e[s] = i;
        }
      }), g4(e, t, n);
    }
    r();
  }
}, w4 = (e) => {
  vn.$flags$ & 1 || Ki(e);
}, m4 = (e, t = {}) => {
  var n;
  const r = ys(), s = [], o = t.exclude || [], i = Ol.customElements, a = Yr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Yr.createElement("style"), h = [];
  let d, m = !0;
  Object.assign(vn, t), vn.$resourcesUrl$ = new URL(t.resourcesUrl || "./", Yr.baseURI).href, e.map((w) => {
    w[1].map((v) => {
      const E = {
        $flags$: v[0],
        $tagName$: v[1],
        $members$: v[2],
        $listeners$: v[3]
      };
      E.$members$ = v[2];
      const L = E.$tagName$, P = class extends HTMLElement {
        // StencilLazyHost
        constructor(O) {
          super(O), O = this, x4(O, E), E.$flags$ & 1 && O.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), m ? h.push(this) : vn.jmp(() => y4(this));
        }
        disconnectedCallback() {
          vn.jmp(() => w4(this));
        }
        componentOnReady() {
          return Ki(this).$onReadyPromise$;
        }
      };
      E.$lazyBundleId$ = w[0], !o.includes(L) && !i.get(L) && (s.push(L), i.define(L, om(
        P,
        E,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + X3, u.setAttribute("data-styles", "");
    const w = (n = vn.$nonce$) !== null && n !== void 0 ? n : Zw(Yr);
    w != null && u.setAttribute("nonce", w), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  m = !1, h.length ? h.map((w) => w.connectedCallback()) : vn.jmp(() => d = setTimeout(rm, 30)), r();
}, Rf = /* @__PURE__ */ new WeakMap(), Ki = (e) => Rf.get(e), b4 = (e, t) => Rf.set(t.$lazyInstance$ = e, t), x4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], Rf.set(e, n);
}, g0 = (e, t) => t in e, $a = (e, t) => (0, console.error)(e, t), wu = /* @__PURE__ */ new Map(), S4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, o = wu.get(s);
  if (o)
    return o[r];
  {
    const i = (a) => (wu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => iC).then(i, $a);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (wu.set(s, i), i[r]), $a);
}, tl = /* @__PURE__ */ new Map(), Ol = typeof window < "u" ? window : {}, Yr = Ol.document || { head: {} }, vn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, im = (e) => Promise.resolve(e), v4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), y0 = [], am = [], E4 = (e, t) => (n) => {
  e.push(n), kd || (kd = !0, vn.$flags$ & 4 ? zf(Id) : vn.raf(Id));
}, w0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      $a(n);
    }
  e.length = 0;
}, Id = () => {
  w0(y0), w0(am), (kd = y0.length > 0) && vn.raf(Id);
}, zf = (e) => im().then(e), A4 = /* @__PURE__ */ E4(am), k4 = () => im(), $4 = (e, t) => typeof window > "u" ? Promise.resolve() : k4().then(() => m4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var I4 = Object.defineProperty, L4 = Object.defineProperties, C4 = Object.getOwnPropertyDescriptors, nl = Object.getOwnPropertySymbols, cm = Object.prototype.hasOwnProperty, lm = Object.prototype.propertyIsEnumerable, m0 = (e, t, n) => t in e ? I4(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, er = (e, t) => {
  for (var n in t || (t = {})) cm.call(t, n) && m0(e, n, t[n]);
  if (nl) for (var n of nl(t)) lm.call(t, n) && m0(e, n, t[n]);
  return e;
}, Tr = (e, t) => L4(e, C4(t)), um = (e, t) => {
  var n = {};
  for (var r in e) cm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && nl) for (var r of nl(e)) t.indexOf(r) < 0 && lm.call(e, r) && (n[r] = e[r]);
  return n;
};
function dm() {
  return Tl(Uo()) || window.StacksProvider || window.BlockstackProvider;
}
function Hl(e) {
  return e ? typeof e == "string" ? Ho.fromName(e) : "version" in e ? e : "url" in e ? new td({ url: e.url }) : e.transactionVersion === Fo.Mainnet ? new td({ url: e.client.baseUrl }) : new nd({ url: e.client.baseUrl }) : new nd();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var T4 = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(T4 || {}), B4 = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(B4 || {}), Gf = (e) => {
  let t = e;
  if (!t) {
    let n = new Gg(["store_write"], document.location.href);
    t = new ed({ appConfig: n });
  }
  return t;
};
function fm(e) {
  try {
    return Gf(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var hm = (e) => {
  let t = Gf(e).loadUserData().appPrivateKey, n = pn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function M4(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let o = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [Do.Mainnet]: "mainnet", [Do.Testnet]: "testnet" }, a = Hl(s);
  return o == null ? void 0 : o[i[a.chainId]];
}
function N4(e) {
  let t = Hl(e.network), n = Gf(e.userSession), r = Tr(er({}, e), { network: t, userSession: n });
  return er({ stxAddress: M4(r) }, r);
}
async function _4(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Hw) : n = n.map((r) => Me(Yw(r)))), new pn.TokenSigner("ES256k", t).signAsync(Tr(er({}, e), { postConditions: n }));
}
function P4(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(Hw) : t = t.map((n) => Me(Yw(n)))), pn.createUnsecuredToken(Tr(er({}, e), { postConditions: t }));
}
var U4 = async ({ token: e, options: t }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = ct(a.replace(/^0x/, "")), u = $k(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Tr(er({}, i), { stacksTransaction: u }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, Tr(er({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = t.onCancel) == null || o.call(t);
  }
}, O4 = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, o = um(t, ["amount", "appDetails", "userSession"]);
  if (fm(s)) {
    let { privateKey: a, publicKey: c } = hm(s), u = Tr(er({}, o), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), _4(u, a);
  }
  let i = Tr(er({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), P4(i);
};
async function H4(e, t, n) {
  let r = await t(Tr(er(er({}, N4(e)), e), { network: Hl(e.network) }));
  return U4({ token: r, options: e }, n);
}
function D4(e, t = dm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return H4(e, O4, t);
}
function pm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Tr(er({}, e), { message: Vp(t), domain: Vp(n) }) : Tr(er({}, e), { message: Me(Ro(t)), domain: Me(Ro(n)) });
}
async function F4(e, t) {
  return new pn.TokenSigner("ES256k", t).signAsync(pm(e));
}
async function j4(e) {
  let t = e, { userSession: n } = t, r = um(t, ["userSession"]);
  if (fm(n)) {
    let { privateKey: s, publicKey: o } = hm(n), i = Tr(er({}, r), { publicKey: o });
    return F4(i, s);
  }
  return pn.createUnsecuredToken(pm(e));
}
var R4 = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(R4 || {}), gm = "asigna-stx", b0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === gm && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(G4(e, t), "*");
}), z4 = { authenticationRequest: async (e) => b0(e, "authenticationRequest"), transactionRequest: async (e) => b0(e, "transactionRequest") }, G4 = (e, t) => ({ source: gm, [t]: e }), K4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = z4);
};
K4();
var V4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function X4(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let o = Uo(), i = dm();
    if (o && i) return e(n, i);
    if (typeof window > "u") return;
    $4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : V4, c = Hv(a), u = document.createElement("connect-modal");
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
var gc = X4(D4);
function oo(e, t, n) {
  return Kf(Tn(e, t), n);
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Nt(r);
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
      const r = W4(BigInt(`0x${We(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${We(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function x0(e) {
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
function Kf(e, t = 16) {
  const n = Fa(e, t);
  return Nt(n);
}
function Y4(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function q4(e, t) {
  return e & BigInt(1) << t;
}
function W4(e, t) {
  return q4(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const Z4 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function We(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Z4[n];
  return t;
}
function Nt(e) {
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
function Vi(e) {
  return new TextEncoder().encode(e);
}
function Vf(e) {
  return new TextDecoder().decode(e);
}
function ym(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function J4(e) {
  return String.fromCharCode.apply(null, e);
}
function Q4(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function S0(e) {
  if (e.some(Q4))
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
  return Fl(...e.map((t) => typeof t == "number" ? S0([t]) : t instanceof Array ? S0(t) : t));
}
var v0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(v0 || (v0 = {}));
var E0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(E0 || (E0 = {}));
var A0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(A0 || (A0 = {}));
const wm = 33, mu = 32;
function e$(e) {
  if (e.length < mu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + mu * 2), r = e.slice(2 + mu * 2);
  return {
    recoveryId: Dl(t),
    r: n,
    s: r
  };
}
function t$(e) {
  const t = typeof e == "string" ? Nt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function n$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function r$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function s$(e, t) {
  return e[t];
}
function o$(e, t, n = 0) {
  return e[n] = t, e;
}
function i$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function zo(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Ld;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ld || (Ld = {}));
const a$ = Ld.Mainnet, c$ = 128, l$ = 128, mm = 16, Lo = 32, Cd = 80, jl = 65, u$ = 32, d$ = 64, rl = 34;
var Ae;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Ae || (Ae = {}));
var Ye;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ye || (Ye = {}));
var Td;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Td || (Td = {}));
var On;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(On || (On = {}));
const _c = ["onChainOnly", "offChainOnly", "any"], k0 = {
  [_c[0]]: On.OnChainOnly,
  [_c[1]]: On.OffChainOnly,
  [_c[2]]: On.Any,
  [On.OnChainOnly]: On.OnChainOnly,
  [On.OffChainOnly]: On.OffChainOnly,
  [On.Any]: On.Any
};
function f$(e) {
  if (e in k0)
    return k0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${_c.join(", ")}`);
}
var sl;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(sl || (sl = {}));
sl.Mainnet;
var Ui;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Ui || (Ui = {}));
var Hn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Hn || (Hn = {}));
var Rt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Rt || (Rt = {}));
var Et;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Et || (Et = {}));
var ol;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ol || (ol = {}));
var Ot;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Ot || (Ot = {}));
var Ia;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Ia || (Ia = {}));
var Bd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Bd || (Bd = {}));
var La;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(La || (La = {}));
var $0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})($0 || ($0 = {}));
var I0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(I0 || (I0 = {}));
function Md(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function h$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function bm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function p$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Md(e.outputLen), Md(e.blockLen);
}
function g$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function y$(e, t) {
  bm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ao = {
  number: Md,
  bool: h$,
  bytes: bm,
  hash: p$,
  exists: g$,
  output: y$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const bu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Rr = (e, t) => e << 32 - t | e >>> t, w$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!w$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function m$(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Xf(e) {
  if (typeof e == "string" && (e = m$(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class xm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ei(e) {
  const t = (r) => e().update(Xf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function b$(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
class Yf extends xm {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = bu(this.buffer);
  }
  update(t) {
    Ao.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Xf(t);
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
    b$(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const x$ = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Sm = Uint8Array.from({ length: 16 }, (e, t) => t), S$ = Sm.map((e) => (9 * e + 5) % 16);
let qf = [Sm], Wf = [S$];
for (let e = 0; e < 4; e++)
  for (let t of [qf, Wf])
    t.push(t[e].map((n) => x$[n]));
const vm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), v$ = qf.map((e, t) => e.map((n) => vm[t][n])), E$ = Wf.map((e, t) => e.map((n) => vm[t][n])), A$ = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), k$ = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), yc = (e, t) => e << t | e >>> 32 - t;
function L0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const wc = new Uint32Array(16);
class $$ extends Yf {
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
      const v = 4 - w, E = A$[w], L = k$[w], P = qf[w], O = Wf[w], A = v$[w], M = E$[w];
      for (let U = 0; U < 16; U++) {
        const X = yc(r + L0(w, o, a, u) + wc[P[U]] + E, A[U]) + d | 0;
        r = d, d = u, u = yc(a, 10) | 0, a = o, o = X;
      }
      for (let U = 0; U < 16; U++) {
        const X = yc(s + L0(v, i, c, h) + wc[O[U]] + L, M[U]) + m | 0;
        s = m, m = h, h = yc(c, 10) | 0, c = i, i = X;
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
const I$ = ei(() => new $$()), L$ = (e, t, n) => e & t ^ ~e & n, C$ = (e, t, n) => e & t ^ e & n ^ t & n, T$ = new Uint32Array([
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
]), Ks = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Vs = new Uint32Array(64);
class Em extends Yf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ks[0] | 0, this.B = Ks[1] | 0, this.C = Ks[2] | 0, this.D = Ks[3] | 0, this.E = Ks[4] | 0, this.F = Ks[5] | 0, this.G = Ks[6] | 0, this.H = Ks[7] | 0;
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
      Vs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Vs[d - 15], w = Vs[d - 2], v = Rr(m, 7) ^ Rr(m, 18) ^ m >>> 3, E = Rr(w, 17) ^ Rr(w, 19) ^ w >>> 10;
      Vs[d] = E + Vs[d - 7] + v + Vs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Rr(a, 6) ^ Rr(a, 11) ^ Rr(a, 25), w = h + m + L$(a, c, u) + T$[d] + Vs[d] | 0, E = (Rr(r, 2) ^ Rr(r, 13) ^ Rr(r, 22)) + C$(r, s, o) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = o, o = s, s = r, r = w + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Vs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class B$ extends Em {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Zf = ei(() => new Em());
ei(() => new B$());
const mc = BigInt(2 ** 32 - 1), Nd = BigInt(32);
function Am(e, t = !1) {
  return t ? { h: Number(e & mc), l: Number(e >> Nd & mc) } : { h: Number(e >> Nd & mc) | 0, l: Number(e & mc) | 0 };
}
function M$(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Am(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const N$ = (e, t) => BigInt(e >>> 0) << Nd | BigInt(t >>> 0), _$ = (e, t, n) => e >>> n, P$ = (e, t, n) => e << 32 - n | t >>> n, U$ = (e, t, n) => e >>> n | t << 32 - n, O$ = (e, t, n) => e << 32 - n | t >>> n, H$ = (e, t, n) => e << 64 - n | t >>> n - 32, D$ = (e, t, n) => e >>> n - 32 | t << 64 - n, F$ = (e, t) => t, j$ = (e, t) => e, R$ = (e, t, n) => e << n | t >>> 32 - n, z$ = (e, t, n) => t << n | e >>> 32 - n, G$ = (e, t, n) => t << n - 32 | e >>> 64 - n, K$ = (e, t, n) => e << n - 32 | t >>> 64 - n;
function V$(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const X$ = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Y$ = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, q$ = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), W$ = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Z$ = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), J$ = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Xe = {
  fromBig: Am,
  split: M$,
  toBig: N$,
  shrSH: _$,
  shrSL: P$,
  rotrSH: U$,
  rotrSL: O$,
  rotrBH: H$,
  rotrBL: D$,
  rotr32H: F$,
  rotr32L: j$,
  rotlSH: R$,
  rotlSL: z$,
  rotlBH: G$,
  rotlBL: K$,
  add: V$,
  add3L: X$,
  add3H: Y$,
  add4L: q$,
  add4H: W$,
  add5H: J$,
  add5L: Z$
}, [Q$, e8] = Xe.split([
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
].map((e) => BigInt(e))), Xs = new Uint32Array(80), Ys = new Uint32Array(80);
class Rl extends Yf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: E, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, m, w, v, E, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, m, w, v, E, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = E | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Xs[A] = t.getUint32(n), Ys[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const M = Xs[A - 15] | 0, U = Ys[A - 15] | 0, X = Xe.rotrSH(M, U, 1) ^ Xe.rotrSH(M, U, 8) ^ Xe.shrSH(M, U, 7), ae = Xe.rotrSL(M, U, 1) ^ Xe.rotrSL(M, U, 8) ^ Xe.shrSL(M, U, 7), se = Xs[A - 2] | 0, Y = Ys[A - 2] | 0, b = Xe.rotrSH(se, Y, 19) ^ Xe.rotrBH(se, Y, 61) ^ Xe.shrSH(se, Y, 6), $ = Xe.rotrSL(se, Y, 19) ^ Xe.rotrBL(se, Y, 61) ^ Xe.shrSL(se, Y, 6), N = Xe.add4L(ae, $, Ys[A - 7], Ys[A - 16]), _ = Xe.add4H(N, X, b, Xs[A - 7], Xs[A - 16]);
      Xs[A] = _ | 0, Ys[A] = N | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: E, Gl: L, Hh: P, Hl: O } = this;
    for (let A = 0; A < 80; A++) {
      const M = Xe.rotrSH(d, m, 14) ^ Xe.rotrSH(d, m, 18) ^ Xe.rotrBH(d, m, 41), U = Xe.rotrSL(d, m, 14) ^ Xe.rotrSL(d, m, 18) ^ Xe.rotrBL(d, m, 41), X = d & w ^ ~d & E, ae = m & v ^ ~m & L, se = Xe.add5L(O, U, ae, e8[A], Ys[A]), Y = Xe.add5H(se, P, M, X, Q$[A], Xs[A]), b = se | 0, $ = Xe.rotrSH(r, s, 28) ^ Xe.rotrBH(r, s, 34) ^ Xe.rotrBH(r, s, 39), N = Xe.rotrSL(r, s, 28) ^ Xe.rotrBL(r, s, 34) ^ Xe.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, q = s & i ^ s & c ^ i & c;
      P = E | 0, O = L | 0, E = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Xe.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const R = Xe.add3L(b, N, q);
      r = Xe.add3H(R, Y, $, _), s = R | 0;
    }
    ({ h: r, l: s } = Xe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Xe.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Xe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Xe.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Xe.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Xe.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: E, l: L } = Xe.add(this.Gh | 0, this.Gl | 0, E | 0, L | 0), { h: P, l: O } = Xe.add(this.Hh | 0, this.Hl | 0, P | 0, O | 0), this.set(r, s, o, i, a, c, u, h, d, m, w, v, E, L, P, O);
  }
  roundClean() {
    Xs.fill(0), Ys.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class t8 extends Rl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class n8 extends Rl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class r8 extends Rl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ei(() => new Rl());
ei(() => new t8());
const s8 = ei(() => new n8());
ei(() => new r8());
function km(e) {
  if (Nt(e).byteLength != jl)
    throw Error("Invalid signature");
  return {
    type: Ae.MessageSignature,
    data: e
  };
}
function da(e, t) {
  return { type: Ae.Address, version: e, hash160: t };
}
function mi(e) {
  return Zo.c32address(e.version, e.hash160);
}
function Go(e, t, n) {
  const r = t || 1, s = n || c$;
  if (Rm(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ae.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Jf(e) {
  const t = Zo.c32addressDecode(e);
  return {
    type: Ae.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ie;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ie || (ie = {}));
function o8(e) {
  if (e.type === ie.PrincipalStandard)
    return mi(e.address);
  if (e.type === ie.PrincipalContract)
    return `${mi(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function $m(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return c8(t, n);
  } else
    return i8(e);
}
function i8(e) {
  const t = Jf(e);
  return { type: ie.PrincipalStandard, address: t };
}
function a8(e) {
  return { type: ie.PrincipalStandard, address: e };
}
function c8(e, t) {
  const n = Jf(e), r = Go(t);
  return Im(n, r);
}
function Im(e, t) {
  if (Vi(t.content).byteLength >= 128)
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
      return `0x${We(e.buffer)}`;
    case ie.OptionalNone:
      return null;
    case ie.OptionalSome:
      return kr(e.value);
    case ie.ResponseErr:
      return kr(e.value);
    case ie.ResponseOk:
      return kr(e.value);
    case ie.PrincipalStandard:
    case ie.PrincipalContract:
      return o8(e);
    case ie.List:
      return e.list.map((r) => kr(r));
    case ie.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = kr(e.data[r]);
      }), n;
    case ie.StringASCII:
      return e.data;
    case ie.StringUTF8:
      return e.data;
  }
}
function kr(e) {
  switch (e.type) {
    case ie.ResponseErr:
      return { type: Js(e), value: xu(e, !0), success: !1 };
    case ie.ResponseOk:
      return { type: Js(e), value: xu(e, !0), success: !0 };
    default:
      return { type: Js(e), value: xu(e, !0) };
  }
}
function Js(e) {
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
      return `(optional ${Js(e.value)})`;
    case ie.ResponseErr:
      return `(response UnknownType ${Js(e.value)})`;
    case ie.ResponseOk:
      return `(response ${Js(e.value)} UnknownType)`;
    case ie.PrincipalStandard:
    case ie.PrincipalContract:
      return "principal";
    case ie.List:
      return `(list ${e.list.length} ${e.list.length ? Js(e.list[0]) : "UnknownType"})`;
    case ie.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${Js(e.data[t])})`).join(" ")})`;
    case ie.StringASCII:
      return `(string-ascii ${ym(e.data).length})`;
    case ie.StringUTF8:
      return `(string-utf8 ${Vi(e.data).length})`;
  }
}
const Lm = () => ({ type: ie.BoolTrue }), Cm = () => ({ type: ie.BoolFalse }), l8 = (e) => e ? Lm() : Cm(), C0 = BigInt("0xffffffffffffffffffffffffffffffff"), u8 = BigInt(0), T0 = BigInt("0x7fffffffffffffffffffffffffffffff"), B0 = BigInt("-170141183460469231731687303715884105728"), d8 = (e) => {
  const t = Tn(e, !0);
  if (t > T0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${T0}`);
  if (t < B0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${B0}`);
  return { type: ie.Int, value: t };
}, cn = (e) => {
  const t = Tn(e, !1);
  if (t < u8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > C0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${C0}`);
  return { type: ie.UInt, value: t };
}, Tm = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ie.Buffer, buffer: e };
};
function Bm() {
  return { type: ie.OptionalNone };
}
function Mm(e) {
  return { type: ie.OptionalSome, value: e };
}
function f8(e) {
  return { type: ie.ResponseErr, value: e };
}
function h8(e) {
  return { type: ie.ResponseOk, value: e };
}
function p8(e) {
  return { type: ie.List, list: e };
}
function tr(e) {
  for (const t in e)
    if (!r6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ie.Tuple, data: e };
}
const ut = (e) => ({ type: ie.StringASCII, data: e }), g8 = (e) => ({ type: ie.StringUTF8, data: e });
class Nm extends xm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Ao.hash(t);
    const r = Xf(n);
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
const _m = (e, t, n) => new Nm(e, t).update(n).digest();
_m.create = (e, t) => new Nm(e, t);
zt.hmacSha256Sync = (e, ...t) => {
  const n = _m.create(Zf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Oi(e) {
  return {
    type: Ae.PublicKey,
    data: Nt(e)
  };
}
function y8(e, t, n = Ot.Compressed) {
  const r = e$(t.data), s = new Jn(x0(r.r), x0(r.s)), o = qe.fromSignature(e, s, r.recoveryId), i = n === Ot.Compressed;
  return o.toHex(i);
}
function w8(e) {
  return { type: Ae.PublicKey, data: e };
}
function Xi(e) {
  return !We(e.data).startsWith("04");
}
function il(e) {
  return e.data.slice();
}
function m8(e) {
  const t = S8(e), n = Pa(t.data.slice(0, 32), t.compressed);
  return Oi(We(n));
}
function b8(e) {
  const t = typeof e == "string" ? e : We(e), n = qe.fromHex(t).toHex(!0);
  return Oi(n);
}
function x8(e) {
  const t = typeof e == "string" ? e : We(e), n = qe.fromHex(t).toHex(!1);
  return Oi(n);
}
function _d(e) {
  const t = e.readUInt8(), n = t === 4 ? d$ : u$;
  return w8(Zt([t, e.readBytes(n)]));
}
function S8(e) {
  const t = t$(e), n = t.length == wm;
  return { data: t, compressed: n };
}
function v8(e, t) {
  const [n, r] = xl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = Fa(r, 1) + Jn.fromHex(n).toCompactHex();
  return km(o);
}
function E8(e) {
  return m8(e.data);
}
function A8(e, t, n) {
  return typeof e == "string" && (e = $m(e)), typeof n == "string" && (n = _0(n)), {
    type: Ae.Payload,
    payloadType: Ye.TokenTransfer,
    recipient: e,
    amount: Tn(t, !1),
    memo: n ?? _0("")
  };
}
function k8(e, t, n, r) {
  return typeof e == "string" && (e = Jf(e)), typeof t == "string" && (t = Go(t)), typeof n == "string" && (n = Go(n)), {
    type: Ae.Payload,
    payloadType: Ye.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function M0(e, t, n) {
  return typeof e == "string" && (e = Go(e)), typeof t == "string" && (t = _8(t)), typeof n == "number" ? {
    type: Ae.Payload,
    payloadType: Ye.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Ae.Payload,
    payloadType: Ye.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function $8() {
  return { type: Ae.Payload, payloadType: Ye.PoisonMicroblock };
}
function N0(e, t) {
  if (e.byteLength != Lo)
    throw Error(`Coinbase buffer size must be ${Lo} bytes`);
  return t != null ? {
    type: Ae.Payload,
    payloadType: Ye.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Ae.Payload,
    payloadType: Ye.Coinbase,
    coinbaseBytes: e
  };
}
function I8(e, t, n) {
  if (e.byteLength != Lo)
    throw Error(`Coinbase buffer size must be ${Lo} bytes`);
  if (n.byteLength != Cd)
    throw Error(`VRF proof buffer size must be ${Cd} bytes`);
  return {
    type: Ae.Payload,
    payloadType: Ye.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ie.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var Pd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Pd || (Pd = {}));
function L8(e, t, n, r, s, o, i) {
  return {
    type: Ae.Payload,
    payloadType: Ye.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function Pm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case Ye.TokenTransfer:
      t.push(Yt(e.recipient)), t.push(oo(e.amount, !1, 8)), t.push(ls(e.memo));
      break;
    case Ye.ContractCall:
      t.push(ls(e.contractAddress)), t.push(ls(e.contractName)), t.push(ls(e.functionName));
      const n = new Uint8Array(4);
      zo(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Yt(r));
      });
      break;
    case Ye.SmartContract:
      t.push(ls(e.contractName)), t.push(ls(e.codeBody));
      break;
    case Ye.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(ls(e.contractName)), t.push(ls(e.codeBody));
      break;
    case Ye.PoisonMicroblock:
      break;
    case Ye.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case Ye.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Yt(e.recipient));
      break;
    case Ye.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Yt(e.recipient ? Mm(e.recipient) : Bm())), t.push(e.vrfProof);
      break;
    case Ye.TenureChange:
      t.push(Nt(e.tenureHash)), t.push(Nt(e.previousTenureHash)), t.push(Nt(e.burnViewHash)), t.push(Nt(e.previousTenureEnd)), t.push(zo(new Uint8Array(4), e.previousTenureBlocks)), t.push(o$(new Uint8Array(1), e.cause)), t.push(Nt(e.publicKeyHash));
      break;
  }
  return Zt(t);
}
function C8(e) {
  switch (e.readUInt8Enum(Ye, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ye.TokenTransfer:
      const n = dr(e), r = Tn(e.readBytes(8), !1), s = Om(e);
      return A8(n, r, s);
    case Ye.ContractCall:
      const o = Hi(e), i = ur(e), a = ur(e), c = [], u = e.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const M = dr(e);
        c.push(M);
      }
      return k8(o, i, a, c);
    case Ye.SmartContract:
      const h = ur(e), d = ur(e, 4, 1e5);
      return M0(h, d);
    case Ye.VersionedSmartContract: {
      const A = e.readUInt8Enum(Td, (X) => {
        throw new Error(`Cannot recognize ClarityVersion: ${X}`);
      }), M = ur(e), U = ur(e, 4, 1e5);
      return M0(M, U, A);
    }
    case Ye.PoisonMicroblock:
      return $8();
    case Ye.Coinbase: {
      const A = e.readBytes(Lo);
      return N0(A);
    }
    case Ye.CoinbaseToAltRecipient: {
      const A = e.readBytes(Lo), M = dr(e);
      return N0(A, M);
    }
    case Ye.NakamotoCoinbase: {
      const A = e.readBytes(Lo), M = dr(e), U = e.readBytes(Cd);
      return I8(A, M, U);
    }
    case Ye.TenureChange:
      const m = We(e.readBytes(20)), w = We(e.readBytes(20)), v = We(e.readBytes(20)), E = We(e.readBytes(32)), L = e.readUInt32BE(), P = e.readUInt8Enum(Pd, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), O = We(e.readBytes(20));
      return L8(m, w, v, E, L, P, O);
  }
}
class zl extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class bo extends zl {
  constructor(t) {
    super(t);
  }
}
class Zn extends zl {
  constructor(t) {
    super(t);
  }
}
class al extends zl {
  constructor(t) {
    super(t);
  }
}
class ko extends zl {
  constructor(t) {
    super(t);
  }
}
var $r;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})($r || ($r = {}));
function Ud(e) {
  return km(We(e.readBytes(jl)));
}
function bi(e, t) {
  return {
    pubKeyEncoding: e,
    type: Ae.TransactionAuthField,
    contents: t
  };
}
function T8(e) {
  const t = e.readUInt8Enum($r, (n) => {
    throw new Zn(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case $r.PublicKeyCompressed:
      return bi(Ot.Compressed, _d(e));
    case $r.PublicKeyUncompressed:
      return bi(Ot.Uncompressed, x8(_d(e).data));
    case $r.SignatureCompressed:
      return bi(Ot.Compressed, Ud(e));
    case $r.SignatureUncompressed:
      return bi(Ot.Uncompressed, Ud(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function Qf(e) {
  return Nt(e.data);
}
function B8(e) {
  const t = [];
  switch (e.contents.type) {
    case Ae.PublicKey:
      t.push(e.pubKeyEncoding === Ot.Compressed ? $r.PublicKeyCompressed : $r.PublicKeyUncompressed), t.push(il(b8(e.contents.data)));
      break;
    case Ae.MessageSignature:
      t.push(e.pubKeyEncoding === Ot.Compressed ? $r.SignatureCompressed : $r.SignatureUncompressed), t.push(Qf(e.contents));
      break;
  }
  return Zt(t);
}
function ls(e) {
  switch (e.type) {
    case Ae.Address:
      return ja(e);
    case Ae.Principal:
      return Um(e);
    case Ae.LengthPrefixedString:
      return Di(e);
    case Ae.MemoString:
      return P8(e);
    case Ae.AssetInfo:
      return Hm(e);
    case Ae.PostCondition:
      return U8(e);
    case Ae.PublicKey:
      return il(e);
    case Ae.LengthPrefixedList:
      return nh(e);
    case Ae.Payload:
      return Pm(e);
    case Ae.TransactionAuthField:
      return B8(e);
    case Ae.MessageSignature:
      return Qf(e);
  }
}
function M8() {
  return {
    type: Ae.Address,
    version: ol.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function eh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Et.SerializeP2PKH || t === Et.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Et.SerializeP2WPKH || t === Et.SerializeP2WSH || t === Et.SerializeP2WSHNonSequential) && !r.every(Xi))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Et.SerializeP2PKH:
      return da(e, Q8(r[0].data));
    case Et.SerializeP2WPKH:
      return da(e, e6(r[0].data));
    case Et.SerializeP2SH:
    case Et.SerializeP2SHNonSequential:
      return da(e, t6(n, r.map(il)));
    case Et.SerializeP2WSH:
    case Et.SerializeP2WSHNonSequential:
      return da(e, n6(n, r.map(il)));
  }
}
function ja(e) {
  const t = [];
  return t.push(Nt(Fa(e.version, 1))), t.push(Nt(e.hash160)), Zt(t);
}
function Hi(e) {
  const t = Dl(We(e.readBytes(1))), n = We(e.readBytes(20));
  return { type: Ae.Address, version: t, hash160: n };
}
function Um(e) {
  const t = [];
  return t.push(e.prefix), t.push(ja(e.address)), e.prefix === La.Contract && t.push(Di(e.contractName)), Zt(t);
}
function N8(e) {
  const t = e.readUInt8Enum(La, (s) => {
    throw new Zn(`Unexpected Principal payload type: ${s}`);
  }), n = Hi(e);
  if (t === La.Standard)
    return { type: Ae.Principal, prefix: t, address: n };
  const r = ur(e);
  return {
    type: Ae.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function Di(e) {
  const t = [], n = Vi(e.content), r = n.byteLength;
  return t.push(Nt(Fa(r, e.lengthPrefixBytes))), t.push(n), Zt(t);
}
function ur(e, t, n) {
  t = t || 1;
  const r = Dl(We(e.readBytes(t))), s = Vf(e.readBytes(r));
  return Go(s, t, n ?? 128);
}
function _8(e) {
  return Go(e, 4, 1e5);
}
function _0(e) {
  if (e && Rm(e, rl))
    throw new Error(`Memo exceeds maximum length of ${rl} bytes`);
  return { type: Ae.MemoString, content: e };
}
function P8(e) {
  const t = [], n = Vi(e.content), r = J8(We(n), rl * 2);
  return t.push(Nt(r)), Zt(t);
}
function Om(e) {
  let t = Vf(e.readBytes(rl));
  return t = t.replace(/\u0000*$/, ""), { type: Ae.MemoString, content: t };
}
function Hm(e) {
  const t = [];
  return t.push(ja(e.address)), t.push(Di(e.contractName)), t.push(Di(e.assetName)), Zt(t);
}
function Od(e) {
  return {
    type: Ae.AssetInfo,
    address: Hi(e),
    contractName: ur(e),
    assetName: ur(e)
  };
}
function th(e, t) {
  return {
    type: Ae.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function nh(e) {
  const t = e.values, n = [];
  n.push(Nt(Fa(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(ls(r));
  return Zt(n);
}
function Dm(e, t, n) {
  const r = Dl(We(e.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (t) {
      case Ae.Address:
        s.push(Hi(e));
        break;
      case Ae.LengthPrefixedString:
        s.push(ur(e));
        break;
      case Ae.MemoString:
        s.push(Om(e));
        break;
      case Ae.AssetInfo:
        s.push(Od(e));
        break;
      case Ae.PostCondition:
        s.push(O8(e));
        break;
      case Ae.PublicKey:
        s.push(_d(e));
        break;
      case Ae.TransactionAuthField:
        s.push(T8(e));
        break;
    }
  return th(s, n);
}
function U8(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Um(e.principal)), (e.conditionType === Hn.Fungible || e.conditionType === Hn.NonFungible) && t.push(Hm(e.assetInfo)), e.conditionType === Hn.NonFungible && t.push(Yt(e.assetName)), t.push(e.conditionCode), e.conditionType === Hn.STX || e.conditionType === Hn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new bo("The post-condition amount may not be larger than 8 bytes");
    t.push(oo(e.amount, !1, 8));
  }
  return Zt(t);
}
function O8(e) {
  const t = e.readUInt8Enum(Hn, (i) => {
    throw new Zn(`Could not read ${i} as PostConditionType`);
  }), n = N8(e);
  let r, s, o;
  switch (t) {
    case Hn.STX:
      return r = e.readUInt8Enum(Ia, (a) => {
        throw new Zn(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${We(e.readBytes(8))}`), {
        type: Ae.PostCondition,
        conditionType: Hn.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case Hn.Fungible:
      return s = Od(e), r = e.readUInt8Enum(Ia, (a) => {
        throw new Zn(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${We(e.readBytes(8))}`), {
        type: Ae.PostCondition,
        conditionType: Hn.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case Hn.NonFungible:
      s = Od(e);
      const i = dr(e);
      return r = e.readUInt8Enum(Bd, (a) => {
        throw new Zn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Ae.PostCondition,
        conditionType: Hn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: i
      };
  }
}
function Qr(e, t) {
  return Zt([e, t]);
}
function H8(e) {
  return new Uint8Array([e.type]);
}
function D8(e) {
  return e.type === ie.OptionalNone ? new Uint8Array([e.type]) : Qr(e.type, Yt(e.value));
}
function F8(e) {
  const t = new Uint8Array(4);
  return zo(t, e.buffer.length, 0), Qr(e.type, Fl(t, e.buffer));
}
function j8(e) {
  const t = Kf(Y4(e.value, BigInt(l$)), mm);
  return Qr(e.type, t);
}
function R8(e) {
  const t = Kf(e.value, mm);
  return Qr(e.type, t);
}
function z8(e) {
  return Qr(e.type, ja(e.address));
}
function G8(e) {
  return Qr(e.type, Fl(ja(e.address), Di(e.contractName)));
}
function K8(e) {
  return Qr(e.type, Yt(e.value));
}
function V8(e) {
  const t = [], n = new Uint8Array(4);
  zo(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Yt(r);
    t.push(s);
  }
  return Qr(e.type, Zt(t));
}
function X8(e) {
  const t = [], n = new Uint8Array(4);
  zo(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Go(s);
    t.push(Di(o));
    const i = Yt(e.data[s]);
    t.push(i);
  }
  return Qr(e.type, Zt(t));
}
function Fm(e, t) {
  const n = [], r = t == "ascii" ? ym(e.data) : Vi(e.data), s = new Uint8Array(4);
  return zo(s, r.length, 0), n.push(s), n.push(r), Qr(e.type, Zt(n));
}
function Y8(e) {
  return Fm(e, "ascii");
}
function q8(e) {
  return Fm(e, "utf8");
}
function Yt(e) {
  switch (e.type) {
    case ie.BoolTrue:
    case ie.BoolFalse:
      return H8(e);
    case ie.OptionalNone:
    case ie.OptionalSome:
      return D8(e);
    case ie.Buffer:
      return F8(e);
    case ie.UInt:
      return R8(e);
    case ie.Int:
      return j8(e);
    case ie.PrincipalStandard:
      return z8(e);
    case ie.PrincipalContract:
      return G8(e);
    case ie.ResponseOk:
    case ie.ResponseErr:
      return K8(e);
    case ie.List:
      return V8(e);
    case ie.Tuple:
      return X8(e);
    case ie.StringASCII:
      return Y8(e);
    case ie.StringUTF8:
      return q8(e);
    default:
      throw new bo("Unable to serialize. Invalid Clarity Value.");
  }
}
function W8(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const P0 = /* @__PURE__ */ new Map();
function jm(e, t) {
  const n = P0.get(e);
  if (n !== void 0)
    return n(t);
  const r = W8(e);
  return P0.set(e, r), jm(e, t);
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
    return i$(this.readBytes(4), 0);
  }
  readUInt8() {
    return s$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return n$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = We(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = We(n);
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
    if (jm(t, r))
      return r;
    throw n(r);
  }
}
function dr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new wa(Nt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new wa(e) : t = e;
  switch (t.readUInt8Enum(ie, (r) => {
    throw new Zn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ie.Int:
      return d8(t.readBytes(16));
    case ie.UInt:
      return cn(t.readBytes(16));
    case ie.Buffer:
      const r = t.readUInt32BE();
      return Tm(t.readBytes(r));
    case ie.BoolTrue:
      return Lm();
    case ie.BoolFalse:
      return Cm();
    case ie.PrincipalStandard:
      const s = Hi(t);
      return a8(s);
    case ie.PrincipalContract:
      const o = Hi(t), i = ur(t);
      return Im(o, i);
    case ie.ResponseOk:
      return h8(dr(t));
    case ie.ResponseErr:
      return f8(dr(t));
    case ie.OptionalNone:
      return Bm();
    case ie.OptionalSome:
      return Mm(dr(t));
    case ie.List:
      const a = t.readUInt32BE(), c = [];
      for (let E = 0; E < a; E++)
        c.push(dr(t));
      return p8(c);
    case ie.Tuple:
      const u = t.readUInt32BE(), h = {};
      for (let E = 0; E < u; E++) {
        const L = ur(t).content;
        if (L === void 0)
          throw new Zn('"content" is undefined');
        h[L] = dr(t);
      }
      return tr(h);
    case ie.StringASCII:
      const d = t.readUInt32BE(), m = J4(t.readBytes(d));
      return ut(m);
    case ie.StringUTF8:
      const w = t.readUInt32BE(), v = Vf(t.readBytes(w));
      return g8(v);
    default:
      throw new Zn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Z8 = (e) => e.length % 2 == 0 ? e : `0${e}`, J8 = (e, t) => e.padEnd(t, "0"), Rm = (e, t) => e ? Vi(e).length > t : !1;
function Hd(e) {
  return aw(e);
}
const Ca = (e) => I$(Zf(e)), rh = (e) => We(s8(e)), Q8 = (e) => We(Ca(e)), e6 = (e) => {
  const t = Ca(e), n = Fl(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ca(n);
  return We(r);
}, t6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = Zt(n), s = Ca(r);
  return We(s);
}, n6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = Zt(n), s = Zf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = Zt(o), a = Ca(i);
  return We(a);
};
function r6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function zm(e) {
  const t = Yt(e);
  return `0x${We(t)}`;
}
function s6(e) {
  return dr(e);
}
const vi = (e) => {
  try {
    return Zo.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function sh() {
  return {
    type: Ae.MessageSignature,
    data: We(new Uint8Array(jl))
  };
}
function Gm(e, t, n, r) {
  const s = eh(0, e, 1, [Oi(t)]).hash160, o = Xi(Oi(t)) ? Ot.Compressed : Ot.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Tn(n, !1),
    fee: Tn(r, !1),
    keyEncoding: o,
    signature: sh()
  };
}
function Ta(e) {
  return "signature" in e;
}
function U0(e) {
  return e === Et.SerializeP2SH || e === Et.SerializeP2WSH;
}
function o6(e) {
  return e === Et.SerializeP2SHNonSequential || e === Et.SerializeP2WSHNonSequential;
}
function O0(e) {
  const t = Hd(e);
  return t.nonce = 0, t.fee = 0, Ta(t) ? t.signature = sh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function i6(e) {
  const t = [
    e.hashMode,
    Nt(e.signer),
    oo(e.nonce, !1, 8),
    oo(e.fee, !1, 8),
    e.keyEncoding,
    Qf(e.signature)
  ];
  return Zt(t);
}
function a6(e) {
  const t = [
    e.hashMode,
    Nt(e.signer),
    oo(e.nonce, !1, 8),
    oo(e.fee, !1, 8)
  ], n = th(e.fields);
  t.push(nh(n));
  const r = new Uint8Array(2);
  return r$(r, e.signaturesRequired, 0), t.push(r), Zt(t);
}
function c6(e, t) {
  const n = We(t.readBytes(20)), r = BigInt(`0x${We(t.readBytes(8))}`), s = BigInt(`0x${We(t.readBytes(8))}`), o = t.readUInt8Enum(Ot, (a) => {
    throw new Zn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Et.SerializeP2WPKH && o != Ot.Compressed)
    throw new Zn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Ud(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function l6(e, t) {
  const n = We(t.readBytes(20)), r = BigInt("0x" + We(t.readBytes(8))), s = BigInt("0x" + We(t.readBytes(8))), o = Dm(t, Ae.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case Ae.PublicKey:
        Xi(u.contents) || (i = !0);
        break;
      case Ae.MessageSignature:
        if (u.pubKeyEncoding === Ot.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new ko("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Et.SerializeP2WSH || e === Et.SerializeP2WSHNonSequential))
    throw new ko("Uncompressed keys are not allowed in this hash mode");
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
  return Ta(e) ? i6(e) : a6(e);
}
function vu(e) {
  const t = e.readUInt8Enum(Et, (n) => {
    throw new Zn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Et.SerializeP2PKH || t === Et.SerializeP2WPKH ? c6(t, e) : l6(t, e);
}
function Km(e, t, n, r) {
  const o = e + We(new Uint8Array([t])) + We(oo(n, !1, 8)) + We(oo(r, !1, 8));
  if (Nt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return rh(Nt(o));
}
function Vm(e, t, n) {
  const r = 33 + jl, s = Xi(t) ? Ot.Compressed : Ot.Uncompressed, o = e + Z8(s.toString(16)) + n.data, i = Nt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return rh(i);
}
function u6(e, t, n, r, s) {
  const o = Km(e, t, n, r), i = v8(s, o), a = E8(s), c = Vm(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function Xm(e, t, n, r, s, o) {
  const i = Km(e, t, n, r), a = Oi(y8(i, o, s)), c = Vm(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function d6() {
  const e = Gm(Et.SerializeP2PKH, "", 0, 0);
  return e.signer = M8().hash160, e.keyEncoding = Ot.Compressed, e.signature = sh(), e;
}
function H0(e, t, n) {
  return Ta(e) ? f6(e, t, n) : h6(e, t, n);
}
function f6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Xm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), o = eh(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new ko(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function h6(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Ae.PublicKey:
        Xi(c.contents) || (o = !0), r.push(c.contents);
        break;
      case Ae.MessageSignature:
        c.pubKeyEncoding === Ot.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = Xm(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (U0(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new ko("Too many signatures");
        break;
    }
  if (U0(e.hashMode) && i !== e.signaturesRequired || o6(e.hashMode) && i < e.signaturesRequired)
    throw new ko("Incorrect number of signatures");
  if (o && (e.hashMode === Et.SerializeP2WSH || e.hashMode === Et.SerializeP2WSHNonSequential))
    throw new ko("Uncompressed keys are not allowed in this hash mode");
  const a = eh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new ko(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Ym(e) {
  return {
    authType: Rt.Standard,
    spendingCondition: e
  };
}
function qm(e, t) {
  return {
    authType: Rt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Gm(Et.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function D0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Rt.Standard:
        return Ym(O0(e.spendingCondition));
      case Rt.Sponsored:
        return qm(O0(e.spendingCondition), d6());
      default:
        throw new al("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function p6(e, t) {
  switch (e.authType) {
    case Rt.Standard:
      return H0(e.spendingCondition, t, Rt.Standard);
    case Rt.Sponsored:
      return H0(e.spendingCondition, t, Rt.Standard);
    default:
      throw new al("Invalid origin auth type");
  }
}
function g6(e, t) {
  switch (e.authType) {
    case Rt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Tn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case Rt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Tn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function y6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Tn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function w6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Tn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function m6(e, t) {
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
function b6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Rt.Standard:
      t.push(Su(e.spendingCondition));
      break;
    case Rt.Sponsored:
      t.push(Su(e.spendingCondition)), t.push(Su(e.sponsorSpendingCondition));
      break;
  }
  return Zt(t);
}
function x6(e) {
  const t = e.readUInt8Enum(Rt, (r) => {
    throw new Zn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Rt.Standard:
      return n = vu(e), Ym(n);
    case Rt.Sponsored:
      n = vu(e);
      const r = vu(e);
      return qm(n, r);
  }
}
class S6 {
  constructor(t, n, r, s, o, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Tn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? a$, this.postConditionMode = o ?? Ui.Deny, this.postConditions = s ?? th([]), i)
      this.anchorMode = f$(i);
    else
      switch (r.payloadType) {
        case Ye.Coinbase:
        case Ye.CoinbaseToAltRecipient:
        case Ye.NakamotoCoinbase:
        case Ye.PoisonMicroblock:
        case Ye.TenureChange:
          this.anchorMode = On.OnChainOnly;
          break;
        case Ye.ContractCall:
        case Ye.SmartContract:
        case Ye.VersionedSmartContract:
        case Ye.TokenTransfer:
          this.anchorMode = On.Any;
          break;
      }
  }
  signBegin() {
    const t = Hd(this);
    return t.auth = D0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Hd(this);
    return t.auth = D0(t.auth), t.txid();
  }
  verifyOrigin() {
    return p6(this.auth, this.verifyBegin());
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
    const n = this.auth.spendingCondition;
    if (n && !Ta(n)) {
      const r = Xi(t);
      n.fields.push(bi(r ? Ot.Compressed : Ot.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = u6(n, r, t.fee, t.nonce, s);
    return Ta(t) ? t.signature = o : t.fields.push(bi(s.data.byteLength === wm ? Ot.Compressed : Ot.Uncompressed, o)), i;
  }
  txid() {
    const t = this.serialize();
    return rh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Rt.Sponsored)
      throw new al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = m6(this.auth, t);
  }
  setFee(t) {
    this.auth = g6(this.auth, t);
  }
  setNonce(t) {
    this.auth = y6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Rt.Sponsored)
      throw new al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = w6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new bo('"version" is undefined');
    if (this.chainId === void 0)
      throw new bo('"chainId" is undefined');
    if (this.auth === void 0)
      throw new bo('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new bo('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new bo('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return zo(n, this.chainId, 0), t.push(n), t.push(b6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(nh(this.postConditions)), t.push(Pm(this.payload)), Zt(t);
  }
}
function xi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new wa(Nt(e.slice(2))) : t = new wa(Nt(e)) : e instanceof Uint8Array ? t = new wa(e) : t = e;
  const n = t.readUInt8Enum(sl, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = x6(t), o = t.readUInt8Enum(On, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(Ui, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Dm(t, Ae.PostCondition), c = C8(t);
  return new S6(n, s, c, a, i, o, r);
}
const v6 = l8, ma = cn, E6 = Tm;
const A6 = /* @__PURE__ */ new Set([4001, -31001]), k6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], $6 = ["result", "data", "payload", "response", "params"], F0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Gl = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), ti = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, ps = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, I6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Wm = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => I6(o, r)) === s
  );
}, Zm = (e) => e ? Wm(ti()).some(
  (t) => {
    var n;
    return t.id === e && (Gl(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Jm = () => {
  if (typeof window > "u")
    return;
  const e = ti(), t = Wm(e).filter(
    (n) => {
      var r;
      return Gl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = ps(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of k6) {
    const r = ps(e, n) ?? (e === window ? void 0 : ps(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, L6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = ti(), n = ps(t, e) ?? (t === window ? void 0 : ps(window, e)) ?? Tl(e);
  if (n)
    return n;
  if (Gl(e) || Zm(e))
    return Jm();
}, bc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, C6 = ["blockstack-session", "blockstack"], T6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of C6) {
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
T6();
const Qm = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, qn = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, B6 = (e) => {
  const t = qn(e);
  if (!t)
    return null;
  const n = Qm(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, M6 = (e) => {
  const t = qn(e);
  if (!t)
    return null;
  const n = Qm(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Dd = (e, t = "mainnet") => {
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
      return Dd(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Dd(r, t);
  }
  return t;
}, Co = (e) => {
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
    return vi(s) ? s : null;
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
  return typeof n.mainnet == "string" && vi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && vi(n.testnet) ? n.testnet.trim() : null;
}, j0 = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, eb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && A6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Ko = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = qn(n == null ? void 0 : n.message) ?? qn(t.message) ?? qn(t.error) ?? qn(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, Fi = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw Ko(t);
    if (t.status === "error")
      throw Ko(t.result ?? t);
  }
  return e;
}, R0 = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return Fi(r);
  } catch (r) {
    throw Ko(r);
  }
}, tb = () => Jm(), oh = () => {
  if (typeof window > "u")
    return;
  const e = ti();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = ps(e, t) ?? (e === window ? void 0 : ps(window, t));
    if (n)
      return n;
  }
}, z0 = () => {
  if (typeof window > "u")
    return;
  const e = oh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = ti();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = ps(t, n) ?? (t === window ? void 0 : ps(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Pc = (e) => {
  var r, s;
  const t = Uo();
  if (Gl(t) || Zm(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ti() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === tb();
}, Eu = (e) => {
  const t = M6(e);
  if (!t)
    return null;
  try {
    const n = xi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, cl = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = Eu(e), r = B6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? qn(e) ?? void 0 : void 0
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
  for (const a of F0)
    if (Eu(s[a])) {
      o = qn(s[a]);
      break;
    }
  const i = qn(s.txId) || qn(s.txid) || qn(s.transactionId);
  if (i)
    return {
      ...s,
      txId: i,
      txid: i,
      txRaw: o ?? qn(s.txRaw) ?? void 0
    };
  for (const a of F0) {
    const c = Eu(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: qn(s[a]) ?? void 0
      };
  }
  for (const a of $6) {
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
}, Au = (e) => {
  const t = cl(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, N6 = (e) => {
  const t = cl(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, _6 = (e) => ({
  ...e,
  fee: Co(e.fee),
  nonce: Co(e.nonce),
  sponsored: e.sponsored === !0
}), G0 = (e) => ({
  recipient: e.recipient,
  amount: Co(e.amount) ?? "0",
  memo: e.memo,
  network: Dd(e.network),
  address: e.stxAddress,
  fee: Co(e.fee),
  nonce: Co(e.nonce),
  sponsored: e.sponsored ?? !1
}), nb = "WALLET_ADDRESS_MISMATCH", P6 = 45e3;
let ba = null;
const Fd = (e) => {
  e && (ba = { address: e, at: Date.now() });
}, U6 = () => {
  ba = null;
}, O6 = () => ba && Date.now() - ba.at <= P6 ? ba.address : null, H6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, D6 = async (e) => {
  U6();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = Fi(await e.request("wallet_connect")), n = Ba(t);
  return Fd(n), n;
}, F6 = async (e, t, n, r) => {
  try {
    return Fi(await e.request(t, n));
  } catch (s) {
    const o = Ko(s);
    if (!H6(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: o.message
    });
    let i = null;
    try {
      i = await D6(e);
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
        { code: i ? nb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return Fi(await e.request(t, n));
    } catch (a) {
      throw Ko(a);
    }
  }
};
let K0 = 3e4;
const j6 = (e, t) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${K0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, K0);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, R6 = async (e, t, n) => {
  const r = (c, u) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: nb }
      );
    return c;
  }, s = O6();
  if (s)
    return bc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  bc(n, "account-read");
  try {
    const c = Fi(
      await j6(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = Ba(c), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (c) {
    if (eb(c))
      throw Ko(c);
    bc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (o)
    return Fd(o), r(o, "wallet_getAccount");
  let i;
  bc(n, "account-reconnect");
  try {
    i = Fi(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Ko(c);
  }
  const a = Ba(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Fd(a), r(a, "wallet_connect");
}, z6 = async (e, t) => {
  if (!Pc(e)) {
    const o = await R0(
      e,
      "stx_transferStx",
      G0(t)
    );
    return Au(o);
  }
  const n = oh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await R0(
      n,
      "stx_transferStx",
      G0(t)
    );
    return Au(o);
  }
  const r = tb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await R6(r, t.stxAddress);
  const s = await F6(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Co(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Co(t.fee) } : {}
    },
    t.stxAddress
  );
  return Au(s);
}, G6 = () => Uo(), rb = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = Uo(), t = e ? L6(e) : void 0;
  if (t)
    return t;
  const n = ti() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, V0 = (e, t) => {
  const n = rb(), r = _6({
    ...e,
    onFinish: (s) => {
      var o;
      (o = e.onFinish) == null || o.call(e, N6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return gc(r, t);
  if (Pc(n) && !oh()) {
    const s = z0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Uo(),
        route: "legacy-transaction-request"
      }), gc(r, s);
  }
  return void z6(n, e).then((s) => {
    var o;
    (o = e.onFinish) == null || o.call(e, s);
  }).catch((s) => {
    var o, i;
    if (j0(s) && Pc(n)) {
      const a = z0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Uo(),
          route: "legacy-transaction-request"
        }), gc(r, a);
        return;
      }
    }
    if (j0(s) && !Pc(n)) {
      gc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), eb(s)) {
      (o = e.onCancel) == null || o.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, K6 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), X0 = (e) => zm(e).replace(/^0x/, ""), Y0 = "This wallet cannot sign messages. Try Xverse or Leather.", q0 = (e) => typeof (e == null ? void 0 : e.request) == "function", W0 = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", V6 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, X6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function Y6(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: X0(t.message),
    domain: X0(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function q6(e, t) {
  const n = await j4({
    domain: t.domain,
    message: t.message,
    network: Hl(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? K6()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function ku(e) {
  var s, o;
  const t = G6() || "", n = /xverse/i.test(t);
  let r = rb();
  if (n && !W0(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (W0(r))
    try {
      return await q6(r, e);
    } catch (i) {
      if (n || !q0(r) || !X6(i)) throw i;
    }
  if (!n && q0(r))
    try {
      return await Y6(r, e);
    } catch (i) {
      throw V6(i) ? new Error(Y0) : i;
    }
  throw new Error(Y0);
}
const Z0 = 1000000n, ds = 1000000n, ll = 50n, qt = 3000n, Br = 300n, sa = 3000n, W6 = 50000n, Z6 = 300n, J6 = 200n, Kl = 15000n, En = (e) => e + ll;
function Er(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / Z0}.${(n % Z0).toString().padStart(6, "0")}`;
}
function J0(e, t = Br) {
  return e <= qt ? 0 : Number((e - qt) / En(t));
}
function $u(e, t = 0n) {
  const n = ds - e - t;
  return n > 0n ? n : 0n;
}
function Q6(e, t = Br) {
  return e > ds ? "over" : e < qt + En(t) ? "empty" : e < W6 ? "low" : "ok";
}
const e5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", t5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", n5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function r5(e) {
  var n, r, s, o;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = t["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || n5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== e5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const sb = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Iu = 3, s5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", o5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", Q0 = 1, [jd, ob] = sb.split("."), ar = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function Rd(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function i5(e) {
  return ar(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function ro(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function ib(e, t = []) {
  const n = await ro(`/v2/contracts/call-read/${jd}/${ob}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: jd, arguments: t.map((r) => "0x" + ar(Yt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return kr(dr(n.result));
}
async function a5() {
  const e = await ro(`/v2/contracts/source/${jd}/${ob}?proof=0`);
  if (typeof e.source != "string" || await i5(e.source) !== t5) throw Error("Deployed source does not match the tested helper.");
  if (r5(await ib("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function ab(e) {
  return e.startsWith("SP") && vi(e) && !e.includes(".");
}
async function c5(e) {
  var r;
  if (!ab(e)) throw Error("Invalid mainnet wallet address.");
  const t = await ro(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await ro(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function l5(e) {
  const t = await ro(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function u5(e, t) {
  var s, o;
  const n = await ib("get-owner", [ma(e), ma(t)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !ab(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function d5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Rd(e), signal: AbortSignal.timeout(15e3) });
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
async function f5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function h5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = xi(Rd(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || mi(da(ol.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const o = t.postConditions.values[0];
    if (r.payloadType !== 2 || mi(r.contractAddress) + "." + r.contractName.content !== sb || r.functionName.content !== "play" || r.functionArgs.length !== 3 || ar(Yt(r.functionArgs[0])) !== ar(Yt(ma(e.core))) || ar(Yt(r.functionArgs[1])) !== ar(Yt(ma(e.song))) || ar(Yt(r.functionArgs[2])) !== ar(Yt(E6(Rd(e.id)))) || e.amount !== "50" || t.postConditionMode !== Ui.Deny || t.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== Ia.Equal || o.principal.prefix !== 2 || mi(o.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || mi(r.contractAddress) + "." + r.contractName.content !== s5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || ar(Yt(r.functionArgs[0])) !== ar(Yt(ma(e.song))) || typeof e.liked != "boolean" || ar(Yt(r.functionArgs[1])) !== ar(Yt(v6(e.liked))) || e.amount !== "0" || t.postConditionMode !== Ui.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || kr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const p5 = "xtrata.xyz/radio/listening-wallet", g5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Kr = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && vi(e), y5 = (e) => ({
  domain: tr({ name: ut(p5), version: ut("1"), "chain-id": cn(1) }),
  message: tr({
    purpose: ut(g5),
    main: ut(e.main),
    listening: ut(e.listening),
    issued: cn(e.issued)
  })
}), cb = 100000n, w5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function m5(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !Kr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= cb).sort(w5);
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
async function b5(e, t, n = 4) {
  if (!Kr(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${xc}&offset=${i}`, s = ul(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - xc);
    for (let i = 0; i < n; i++) {
      const a = o === 0 && s.total <= xc ? s : ul(await t(r(o)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = m5(a.transfers, e);
      if (c.ok && c.funder) return o > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (o === 0) return c;
      o = Math.max(0, o - xc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const as = 50, x5 = 6, S5 = 20, eg = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function tg(e, t) {
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
async function v5(e, t, n) {
  if (!Kr(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = ul(await t(`/extended/v1/address/${e}/stx_inbound?limit=${as}&offset=0`));
    if (!s || s.total > x5 * as) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = as; i < s.total; i += as) {
      const a = ul(await t(`/extended/v1/address/${e}/stx_inbound?limit=${as}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${as}&offset=${u}`, a = tg(await t(i(0)), e);
      if (!a || a.total > S5 * as) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) o.set(u.txId, u);
      for (let u = as; u < a.total; u += as) {
        const h = tg(await t(i(u)), e);
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
function E5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(eg).map((d, m) => {
    const w = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: w, kind: "gift", to: r.payer, at: m } : Kr(d.sender) && w >= cb ? { sender: d.sender, left: w, kind: "deposit", to: d.sender, at: m } : { sender: d.sender, left: w, kind: "dust", to: null, at: m };
  }), o = s.reduce((d, m) => d + m.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && Kr(d.recipient) && d.amount > 0n).sort(eg), a = i.reduce((d, m) => d + m.amount, 0n), c = o - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (d, m) => {
    let w = m;
    for (const v of d) {
      if (w <= 0n) break;
      const E = v.left < w ? v.left : w;
      v.left -= E, w -= E;
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
function ng(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const Sc = 1500n, Uc = [100, 250, 500], k5 = (e, t) => BigInt(e) * En(t), oa = ["prepared", "signed", "unknown", "pending"], $5 = 30 * 6e4, dl = 6e4, li = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, I5 = 3e3, fl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Lu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function L5(e) {
  let t = null, n = -1 / 0, r, s = null, o = null, i, a = -1 / 0, c = null, u = null, h = !1, d = !1, m = !1, w = null, v = !1, E = "", L = "", P = 0, O, A = null, M, U = [], X, ae = -1 / 0;
  const se = /* @__PURE__ */ new Set();
  let Y = null, b = !1, $ = 0, N = null, _ = null, q = !1, R = null, ce = !1, le = null, He = !1, I = !1, j = !1, ue = !1, ge = !1, Ce = 0, Te = null, It = Promise.resolve();
  const Oe = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Br.toString()), Ie = (x) => !!o && !(o.features ?? []).includes(x), Ne = (x, k) => `xtrata.ppp.v1.${x}:${k}`, en = "xtrata.ppp.v1.as-main", Gt = () => {
    if (e.main()) return;
    const x = e.store.get(en);
    return x && Kr(x) ? x : void 0;
  }, Je = () => e.main() ?? Gt(), Jt = (x = o == null ? void 0 : o.address) => {
    if (!x) return [];
    try {
      const k = JSON.parse(e.store.get(Ne("entries", x)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, wt = (x) => {
    const k = [x, ...Jt(x.address).filter((K) => !(K.txid === x.txid && K.kind === x.kind))].slice(0, 200);
    e.store.set(Ne("entries", x.address), JSON.stringify(k));
  }, G = (x = o == null ? void 0 : o.address) => !!x && e.store.get(Ne("on", x)) !== "0", H = (x) => {
    o != null && o.address && e.store.set(Ne("on", o.address), x ? "1" : "0");
  }, te = () => Jt().filter((x) => oa.includes(x.status)), ee = () => De() ? [...te(), ...Jt(Re()).filter((x) => oa.includes(x.status))] : te(), de = () => lt(o == null ? void 0 : o.address), lt = (x) => {
    if (!x) return null;
    try {
      return JSON.parse(e.store.get(Ne("deposit", x)) || "null");
    } catch {
      return null;
    }
  }, Le = (x, k = o == null ? void 0 : o.address) => {
    k && e.store.set(Ne("deposit", k), JSON.stringify(x));
  };
  let Pe = null;
  const ft = (x = dl) => {
    const k = e.now();
    Pe = { since: Pe && k < Pe.until ? Pe.since : k, until: Math.max((Pe == null ? void 0 : Pe.until) ?? 0, k + x) };
  }, _e = () => !!Pe && e.now() < Pe.until && (i === void 0 || i < qt + En(Oe())), Ee = () => !!de() || _e(), Re = () => Ie("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), De = () => !!(o != null && o.address) && Re() !== o.address, Se = () => De() ? c && c.for === Re() ? c.value : void 0 : i, Lt = () => Ie("likeFee") ? J6 : Z6, rn = (x) => x !== void 0 && x < qt + Lt(), gn = () => te().filter((x) => e.now() - x.created > $5 && se.has(x.txid)), Bn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!Je() || r === Je() && !t.allowed), ht = () => Bn() && !(o != null && o.linked), kn = () => {
    const x = Je();
    return !ht() && !!x && !!(o != null && o.linked) && o.linked !== x;
  }, nr = (x) => Ne("return-to", x), es = (x = o == null ? void 0 : o.address) => {
    if (!x) return;
    const k = e.store.get(nr(x));
    return k && Kr(k) && k !== x ? k : void 0;
  }, Fn = (x = o == null ? void 0 : o.address) => Y && Y.for === x ? Y.res : null;
  function Mn() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const x = es();
    if (x) return { to: x, kind: "chosen" };
    const k = Fn();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const ln = (x) => Ne("gift", x);
  function _t() {
    const x = o == null ? void 0 : o.address;
    if (!x) return null;
    if ((R == null ? void 0 : R.for) === x) return R.info;
    try {
      const k = JSON.parse(e.store.get(ln(x)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  const Qt = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let At = null, Kt = null, ts = !1;
  const Nn = (x) => Ne("award-claim", x), y = (x) => Ne("award-send", x), C = (x) => {
    try {
      const k = JSON.parse(e.store.get(y(x)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  }, z = (x) => {
    try {
      const k = JSON.parse(e.store.get(Nn(x)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  };
  async function D(x = !1) {
    const k = Qt();
    if (!k || !e.awardStatus || ts) return;
    const K = (At == null ? void 0 : At.for) === k ? At : null, l = K == null ? void 0 : K.view.state, g = K ? l === "off" || l === "not-a-player" ? 30 * 6e4 : z(k) || C(k) ? 2e4 : l === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(K && !x && e.now() - K.at < g)) {
      ts = !0;
      try {
        const p = await e.awardStatus(k);
        if (At = { for: k, view: p, at: e.now() }, p.state === "claimed" && e.store.set(Nn(k), ""), p.state === "claimed" && p.holds === !1 && e.store.set(y(k), ""), p.state === "ready" && e.awardName && (Kt == null ? void 0 : Kt.for) !== k)
          try {
            Kt = { for: k, name: await e.awardName(k), at: e.now() };
          } catch {
            Kt = { for: k, name: void 0, at: e.now() };
          }
      } catch {
        At = { for: k, view: K && K.view.state !== "off" && K.view.state !== "not-a-player" ? { ...K.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        ts = !1;
      }
    }
  }
  function J() {
    const x = Qt();
    if (!x || (At == null ? void 0 : At.for) !== x) return null;
    const k = At.view;
    if (k.state === "off" || k.state === "not-a-player") return null;
    const K = k.state === "claimed" ? null : z(x), l = k.state === "claimed" && k.holds !== !1 ? C(x) : null;
    return { ...k, ...(Kt == null ? void 0 : Kt.for) === x ? { name: Kt.name } : {}, ...K ? { claimTx: K.txid } : {}, ...l ? { sendTx: l.txid } : {} };
  }
  async function ne() {
    var g;
    const x = o == null ? void 0 : o.address;
    if (!x || !e.giftInfo || !((g = t == null ? void 0 : t.gifts) != null && g.enabled) || ce) return;
    const k = (R == null ? void 0 : R.for) === x ? R : null, K = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && e.now() - k.at < K) return;
    ce = !0;
    const l = _t();
    try {
      const p = await e.giftInfo(x);
      R = { for: x, info: p, ok: !0, at: e.now() }, e.store.set(ln(x), JSON.stringify(p));
    } catch {
      R = { for: x, info: l, ok: !1, at: e.now() };
    } finally {
      ce = !1;
    }
  }
  const ke = () => Jt().reduce((x, k) => oa.includes(k.status) ? x + BigInt(k.amount || "0") + BigInt(k.fee || "0") : x, 0n);
  function xe() {
    if (i === void 0) return 0;
    const x = i - ke() - BigInt(Dt.length) * En(Oe());
    return x > 0n ? J0(x, Oe()) : 0;
  }
  const Be = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", gt = "EMPTY — ADD STX TO PLAY";
  function me() {
    if (!(t != null && t.here)) return null;
    const x = (k, K) => ({ reason: k, text: K });
    switch (nt()) {
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
        return Ee() ? x("arriving", "YOUR PLAYS ARE ARRIVING") : x("out", De() ? Be : gt);
      case "ready":
        return !G() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= e.now() ? x("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : j ? xe() < 1 ? x("out", De() ? Be : gt) : null : x("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Qe = () => {
    var x;
    return !!(o != null && o.address) && De() && !!((x = _t()) != null && x.player);
  };
  function ot() {
    return Qe() ? { locked: !0, known: !0 } : null;
  }
  const Ze = 3 * 6e4, Ht = () => !!_t() && !!e.history && !(o != null && o.linked);
  async function Ct() {
    const x = o.address, k = _t(), { balance: K, nonce: l } = await e.chain.account(x), g = await e.history(x, !0);
    if (!g.ok) return null;
    const p = E5({ self: x, balance: K, inbound: g.inbound, outgoing: g.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!p.ok) return null;
    const f = A5(p.parts, sa);
    return { balance: K, nonce: l, parts: p.parts, steps: f.steps, tooSmall: f.tooSmall.length };
  }
  const Vt = () => He ? { state: "unavailable" } : !le || e.now() - le.at > Ze || i !== void 0 && i !== le.balance ? { state: "none" } : le.plan;
  function nt() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const x = Je();
    if (!ht()) {
      if (!x) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : kn() ? "wrong-wallet" : o.state === "known" ? "locked" : !ht() && o.linked !== x ? "link" : i === void 0 ? "loading" : i > ds && !o.backedUp ? "over" : i < qt + En(Oe()) ? "fund" : "ready" : "loading";
  }
  const Mr = () => {
    var x, k, K, l, g;
    return {
      step: nt(),
      busy: u,
      message: E,
      error: L,
      notice: Nr(),
      gate: t,
      main: Je(),
      mainConnected: !!e.main(),
      standIn: Gt(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: J(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.phrase),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((p) => p === "over" && (o != null && o.backedUp) ? "ok" : p)(Q6(i, Oe())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > ds && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : J0(i, Oe()),
      allowance: i === void 0 ? ds : $u(i, BigInt(((x = de()) == null ? void 0 : x.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: G(),
      entries: Jt(),
      depositTxid: ((k = de()) == null ? void 0 : k.txid) ?? O,
      depositPending: Ee(),
      arrival: Ee() ? { since: ((K = de()) == null ? void 0 : K.at) ?? (Pe == null ? void 0 : Pe.since) ?? e.now(), graceMs: dl } : null,
      walletOutdated: Ie("like"),
      canAnother: !!o && !Ie("another"),
      canForget: !!o && !Ie("forget"),
      passkeyName: o == null ? void 0 : o.passkeyName,
      hadGift: o != null && o.address && (R == null ? void 0 : R.for) === o.address && R.ok ? !!R.info : null,
      linkedListening: X && X === Je() ? U.map((p) => p.listening) : [],
      serverLinked: !!A && M === `${Je()}:${o == null ? void 0 : o.address}`,
      stuck: gn().length,
      armed: ue,
      queued: Dt.length,
      solo: ht(),
      returnTo: (l = Mn()) == null ? void 0 : l.to,
      returnToKind: (g = Mn()) == null ? void 0 : g.kind,
      funderState: (() => {
        const p = Fn();
        return p ? p.ok ? p.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const p = Fn();
        return !!p && p.ok && p.distinct > 1;
      })(),
      walletCannotSolo: ht() && Ie("standalone"),
      walletCannotMulti: Ie("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((p) => p !== Je() && p !== (o == null ? void 0 : o.linked)),
      creditedTo: ht() && (o != null && o.address) && (N == null ? void 0 : N.for) === o.address && N.main ? N.main : void 0,
      createdHere: !!(o != null && o.address) && e.store.get(Ne("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (_ == null ? void 0 : _.for) === o.address && _.unused,
      gift: (() => {
        const p = _t();
        return p ? { player: p.player, from: p.from, source: p.source, amount: p.amount, ...p.drop !== void 0 ? { drop: p.drop } : {} } : null;
      })(),
      giftPlays: _t() ? xe() : 0,
      playCost: En(Oe()),
      giftStop: me(),
      albumLock: ot(),
      returnPlan: Vt(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: Ie("slots"),
      likeFunds: (() => {
        var T;
        const p = Re();
        if (!p || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const f = Se();
        return { address: p, balance: f, low: rn(f), album: De(), pending: !!lt(p), txid: (T = lt(p)) == null ? void 0 : T.txid, main: Je() };
      })()
    };
  }, Nr = () => P ? P < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", et = (x, k = "") => {
    E = x, L = k, e.changed();
  };
  async function yt(x, k) {
    if (!u) {
      u = x, L = "", e.changed();
      try {
        await k();
      } catch (K) {
        const l = K instanceof Error ? K.message : String(K);
        L = /Cancelled in the listening wallet/.test(l) ? "" : l, L || (E = "Not now. Nothing was signed.", ge = !0);
      } finally {
        u = null, await Rn(!0);
      }
    }
  }
  const _n = () => !!(t != null && t.enabled) && t.here && (ht() || !!Je() && t.allowed), jn = () => _n() && !kn(), fr = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", rr = () => {
    if (kn()) throw new Error(fr());
  };
  async function yn() {
    if (!_n()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const wn = (x) => {
    const k = Je();
    return x.request("listening.status", k ? { main: k } : void 0);
  };
  async function hr(x = !1) {
    o != null && o.address && (!x && e.now() - a < 3e4 || (i = await e.chain.balance(o.address), a = e.now(), await ms(x)));
  }
  async function ms(x = !1) {
    const k = Re();
    if (!(!De() || !k || (o == null ? void 0 : o.state) !== "unlocked") && !(!x && (c == null ? void 0 : c.for) === k && e.now() - c.at < 3e4))
      try {
        c = { for: k, value: await e.chain.balance(k), at: e.now() };
      } catch {
      }
  }
  async function ni(x) {
    if ((X !== x || e.now() - ae >= 6e4) && (U = await e.links(x), X = x, ae = e.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === x) return;
    const k = `${x}:${o.address}`;
    M === k && A || (A = U.find((K) => K.listening === o.address) ?? null, M = k);
  }
  async function tn() {
    const x = o == null ? void 0 : o.address;
    if (!ht() || !x || o != null && o.linked || !e.funder || b || !i || i <= 0n) return;
    const k = Fn(x);
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
  async function ao() {
    const x = o == null ? void 0 : o.address;
    if (!(!ht() || !x || o != null && o.linked || !e.mainOf || q) && !(N && N.for === x && (N.ok || e.now() - N.at < 6e4))) {
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
  async function co() {
    const x = o == null ? void 0 : o.address;
    if (!(!x || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (_ == null ? void 0 : _.for) === x) && e.store.get(Ne("created", x)) !== "1")
      try {
        _ = { for: x, unused: await e.chain.confirmedNonce(x) === 0n };
      } catch {
      }
  }
  async function Yi() {
    var g;
    const x = o == null ? void 0 : o.address;
    if (!x) return !1;
    let k, K = !1;
    const l = /* @__PURE__ */ new Map();
    for (const p of ee())
      try {
        const f = await e.chain.transaction(p.txid);
        if (!f) {
          if (se.add(p.txid), e.now() - p.created > 15 * 6e4 && !l.has(p.address) && l.set(p.address, await e.chain.confirmedNonce(p.address)), k = l.get(p.address), k !== void 0 && k > BigInt(p.nonce)) {
            wt({ ...p, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((p.status === "unknown" || p.status === "signed") && p.raw)
            try {
              await e.chain.broadcast(p.raw, p.txid), wt({ ...p, status: "pending" });
            } catch (V) {
              li(V) && wt({ ...p, status: "failed", note: V.message, raw: void 0 });
            }
          continue;
        }
        se.delete(p.txid);
        const T = String(f.tx_status);
        if (T === "success" && f.canonical !== !1 && f.is_unanchored === !1) {
          if (wt({ ...p, status: "confirmed", confirmedAt: e.now(), actualFee: String(f.fee_rate ?? p.fee), raw: void 0 }), K = !0, p.kind === "like" && (v = !0, p.status !== "confirmed" && typeof p.liked == "boolean"))
            try {
              (g = e.likeConfirmed) == null || g.call(e, p.song, p.liked);
            } catch {
            }
        } else T.startsWith("abort_") || T.startsWith("dropped_") ? wt({ ...p, status: "failed", note: T, raw: void 0 }) : p.status !== "pending" && wt({ ...p, status: "pending" });
      } catch {
      }
    for (const p of De() ? [x, Re()] : [x]) {
      const f = lt(p);
      if (f)
        try {
          const T = await e.chain.transaction(f.txid), V = String((T == null ? void 0 : T.tx_status) ?? "");
          (V === "success" && T.is_unanchored === !1 || V.startsWith("abort_") || V.startsWith("dropped_") || !T && e.now() - f.at > 2 * 36e5) && (Le(null, p), V === "success" && ft(2e4), a = -1 / 0, c = null, /on its way/i.test(E) && (E = ""));
        } catch {
        }
    }
    return K;
  }
  async function Rn(x = !1) {
    var k;
    try {
      const K = Je();
      if ((x || !t || r !== K || e.now() - n > 3e5) && (t = await e.config(K), n = e.now(), r = K), !t.enabled || !t.here || !ht() && (!K || !t.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), ue && uo(), e.changed();
        return;
      }
      await yn(), o = await wn(s), kn() && o.state === "unlocked" && (mn(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await wn(s)), K && t.allowed && await ni(K), await hr(x), await tn(), await ao(), await co(), await ne(), await D(), await Yi() && await hr(!0), await ms(), await Wi(), P = 0;
    } catch {
      P++;
    }
    if (nt() === "locked" ? qi() : ue && uo(), v) {
      v = !1;
      try {
        (k = e.likesChanged) == null || k.call(e);
      } catch {
      }
    }
    e.changed(), Dt.length && !Es && yr();
  }
  async function lo(x) {
    const k = o == null ? void 0 : o.root;
    if (!k || o != null && o.slot || !(o != null && o.address) || Ie("slots")) return;
    const K = Number(e.store.get(Ne("slot", k)));
    if (!(!Number.isSafeInteger(K) || K < 1))
      try {
        const { balance: l } = await e.chain.account(o.address);
        if (l >= qt + En(Oe())) return;
        await x.request("listening.openSlot", { slot: K }), o = await wn(x), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function bs(x, k) {
    var p;
    rr();
    const K = !(o != null && o.address) || G(o.address), l = o != null && o.linked ? (p = e.nameOf) == null ? void 0 : p.call(e, o.linked) : void 0;
    await x.request("listening.unlock", { mode: "unlock", terms: K ? _r() : void 0, anyPasskey: k, ...Je() ? { main: Je() } : {}, ...l ? { label: l } : {} }), o = await wn(x), K && (G(o.address) ? await ns() : await x.request("listening.stop")), await lo(x), et(K ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const g = w;
    w = null, g && e.now() - g.at < 12e4 && setTimeout(() => void Rn(!0).then(() => As(g)), 0);
  }
  function qi() {
    ue || u || ge || Ce >= 3 || !s || !(o != null && o.address) || (ue = !0, It = (async () => {
      try {
        await bs(s, !1), Ce = 0;
      } catch (x) {
        const k = x instanceof Error ? x.message : String(x);
        /Cancelled in the listening wallet/.test(k) ? Te || (ge = !0, et("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Ce++, L = k);
      } finally {
        ue = !1;
        const x = Te;
        Te = null, x ? await x() : await Rn(!0);
      }
    })());
  }
  async function uo(x) {
    ue && (Te = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await It), x && await x(), e.changed();
  }
  const _r = () => ({
    fee: Oe().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: ds.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function ns() {
    if (!(o != null && o.address)) return !1;
    if (j || (j = await e.tabLock(o.address)), !j)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function xs(x, k) {
    const K = o.address, { balance: l, nonce: g } = k ?? await e.chain.account(K);
    i = l;
    const p = await s.request("listening.prepareReturn", {
      mode: x.mode,
      balance: l.toString(),
      nonce: g.toString(),
      fee: sa.toString(),
      ...x.amount !== void 0 ? { amount: x.amount.toString() } : {},
      ...x.linked ? {} : { destination: x.to }
    });
    if (p.recipient !== x.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const f = x.mode === "amount" ? x.amount : x.mode === "all" ? l - sa : l - ds - sa, T = xi(p.raw);
    if (kr(T.payload.recipient).value !== x.to || String(T.payload.amount) !== p.amount || f !== void 0 && p.amount !== f.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const V = {
      id: Lu(),
      address: K,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: p.recipient,
      amount: p.amount,
      fee: p.fee,
      nonce: g.toString(),
      created: e.now(),
      status: "signed",
      raw: p.raw,
      txid: p.txid
    };
    e.validate(V), wt(V);
    try {
      await e.chain.broadcast(p.raw, p.txid), wt({ ...V, status: "pending" });
    } catch (Z) {
      throw wt({ ...V, status: "unknown", note: Z.message }), Z;
    }
    return p;
  }
  const fo = Kl, ho = sa;
  async function Ss(x, k, K) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (Ie("slots") || Ie("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const l = o.slot ?? 0;
    if (x === k || ![x, k].includes(l) || ![x, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const g = o.root ?? o.address, p = x === 0 ? g : o.address, f = k === 0 ? g : o.address, { balance: T, nonce: V } = await e.chain.account(p);
    if (T < K + ho + qt) throw new Error(x === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Z = await s.request("listening.signMove", { from: x, to: k, amount: K.toString(), fee: ho.toString(), nonce: V.toString(), balance: T.toString() }), re = xi(Z.raw);
    if (Z.from !== p || Z.to !== f || Z.amount !== K.toString() || kr(re.payload.recipient).value !== f || String(re.payload.amount) !== K.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const ve = {
      id: Lu(),
      address: p,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: f,
      amount: Z.amount,
      fee: Z.fee,
      nonce: V.toString(),
      created: e.now(),
      status: "signed",
      raw: Z.raw,
      txid: Z.txid
    };
    e.validate(ve), wt(ve);
    try {
      await e.chain.broadcast(Z.raw, Z.txid), wt({ ...ve, status: "pending" });
    } catch (S) {
      throw wt({ ...ve, status: "unknown", note: S.message }), S;
    }
    return Le({ txid: Z.txid, amount: Z.amount, at: e.now() }, f), f === g && g !== o.address ? c = null : a = -1 / 0, Z;
  }
  let vs = !1;
  const po = /* @__PURE__ */ new Map(), Pr = (x) => Ne("float", x);
  async function Wi() {
    if (vs || (o == null ? void 0 : o.state) !== "unlocked" || !De() || Ie("move") || Ie("rootLike") || !o.address) return;
    const x = o.address;
    if (e.store.get(Pr(x)) === "1") return;
    const k = _t();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const K = Se();
    if (K === void 0 || i === void 0) return;
    if (!rn(K)) {
      e.store.set(Pr(x), "1");
      return;
    }
    if (lt(Re()) || rs() || ee().length || i < fo * 4n + qt + ho) return;
    const l = po.get(x);
    if (!(l && (l.n >= 3 || e.now() - l.at < 5 * 6e4))) {
      vs = !0, po.set(x, { n: ((l == null ? void 0 : l.n) ?? 0) + 1, at: e.now() });
      try {
        await Ss(o.slot ?? 0, 0, fo), e.store.set(Pr(x), "1");
      } catch (g) {
        console.warn("[radio] likes float not sent yet", g);
      } finally {
        vs = !1;
      }
    }
  }
  async function it(x) {
    if (te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Ie("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await Ct().catch(() => null);
    if (!k)
      throw le = null, He = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    He = !1, i = k.balance;
    const K = { balance: k.balance, nonce: k.nonce };
    if (x === "excess") {
      const T = ng(k.parts) ?? es();
      if (!T) throw new Error("Choose where to send the excess first.");
      await xs({ mode: "excess", to: T, linked: !1 }, K), le = null, et("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const l = k.steps;
    if (!l.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!le && le.balance === k.balance && e.now() - le.at <= Ze && le.steps.length === l.length && le.steps.every((T, V) => T.to === l[V].to && T.mode === l[V].mode && T.send === l[V].send))) {
      le = {
        at: e.now(),
        balance: k.balance,
        steps: l,
        parts: k.parts,
        plan: { state: "ready", steps: l.map((T) => ({ to: T.to, kind: T.kind, send: T.send.toString() })), kept: k.tooSmall, excess: ng(k.parts) }
      }, et(l.length > 1 ? `This goes back in ${l.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const p = l[0], f = p.to ?? es();
    if (!f) throw new Error("Choose where to send the rest first.");
    if (p.mode === "amount" && Ie("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await xs({ mode: p.mode, to: f, linked: !1, ...p.mode === "amount" ? { amount: p.send } : {} }, K), le = null, l.length === 1 ? (H(!1), et("Returned ✓ Paying is off.")) : et(`Returned ✓ ${l.length - 1} more ${l.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Ur() {
    if (!(o != null && o.unproven)) return;
    const x = await yn();
    await x.request("listening.prove"), o = await wn(x);
  }
  const pr = {
    forceRefresh: () => Rn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (x) => {
      if (!e.main() && !(x !== null && !Kr(x))) {
        if (x === Gt()) return Rn(!0);
        e.store.set(en, x ?? ""), L = "", E = "", i = void 0, a = -1 / 0, c = null, await Rn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => yt("Check the listening wallet…", async () => {
      const x = await yn();
      if (Ie("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((o == null ? void 0 : o.state) !== "unlocked" || (o.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (te().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      mn(), await x.request("listening.forget"), i = void 0, o = await wn(x), H(!1), et("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (x) => yt("Waiting for your passkey…", async () => {
      const k = await yn(), K = !!(x != null && x.another) && !e.main() && !Ie("another");
      K && (o == null ? void 0 : o.state) === "unlocked" && await k.request("listening.lock"), await k.request("listening.unlock", { mode: "create", terms: _r(), ...e.main() ? { main: e.main() } : {}, ...x != null && x.quick && !e.main() ? { quick: !0 } : {}, ...K ? { another: !0 } : {} }), o = await wn(k), o.address && e.store.set(Ne("created", o.address), "1"), H(!0), et(ht() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await ns();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (x) => {
      x ? ft() : Pe = null, e.changed();
    },
    giftSent: (x, k) => {
      !(o != null && o.address) || de() || (Le({ txid: x, amount: k.toString(), at: e.now() }), a = -1 / 0, R = null, et("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (x) => {
      if (rr(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ie("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await yn()).request("listening.bindSlot", { slot: x, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (x, k, K, l) => {
      Le({ txid: K, amount: l.toString(), at: e.now() }, k), R = null, await pr.openAlbum(x), et("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (x) => yt("Opening…", async () => {
      if (rr(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ie("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || m) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === x) return;
      mn(), await s.request("listening.openSlot", { slot: x }), o = await wn(s), i = void 0, a = -1 / 0, le = null, He = !1;
      const k = o.root;
      k && x > 0 && e.store.set(Ne("slot", k), String(x)), et(x === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (x = !1) => {
      const k = () => yt("Waiting for your passkey…", async () => bs(await yn(), x));
      return ue ? x ? Ie("cancel") ? (et("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : uo(async () => {
        (nt() === "locked" || nt() === "intro") && await k();
      }) : It : k();
    },
    link: () => yt("Sign in your wallet…", async () => {
      rr();
      const x = e.main();
      if (!x || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const k = (await e.links(x)).find((K) => K.listening === o.address);
      if (k)
        await s.request("listening.link", { main: x, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const K = { main: x, listening: o.address, issued: e.now() }, l = await e.signWithMain(x, y5(K)), g = await s.request("listening.link", { main: x, issued: K.issued, mainSignature: l });
        await e.saveLink({ ...K, mainSignature: l, listeningSignature: g.listeningSignature }), ae = -1 / 0;
      }
      et("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await yt("One more passkey check…", Ur), !(o != null && o.unproven)) : !0,
    deposit: () => yt("Approve the deposit in your wallet…", async () => {
      rr(), await Ur();
      const x = e.main();
      if (!x || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if (de()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (_e()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await hr(!0);
      const k = $u(i ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      O = await e.deposit(x, o.address, k), O && Le({ txid: O, amount: k.toString(), at: e.now() }), et("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => yt("Approve the top-up in your wallet…", async () => {
      rr(), await Ur();
      const x = e.main(), k = Re();
      if (!x || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (lt(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const K = await e.chain.balance(k);
      De() ? c = { for: k, value: K, at: e.now() } : (i = K, a = e.now());
      const l = $u(K);
      if (l <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const g = await e.deposit(x, k, l);
      g && Le({ txid: g, amount: l.toString(), at: e.now() }, k), et("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (x) => yt("Adding plays…", async () => {
      if (rr(), !De()) throw new Error("Open the album you want to add plays to first.");
      if (!Uc.includes(x)) throw new Error("Choose one of the amounts offered.");
      const k = k5(x, Oe());
      if (h || d || m) throw new Error("Still sending a payment. Try again in a moment.");
      if (ee().length || de()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Ss(0, o.slot ?? 0, k), et("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => yt("Confirm in the listening wallet…", async () => {
      if (!jn()) throw new Error("Connect your wallet first.");
      await ns(), await s.request("listening.approveSession", _r()), H(!0), et("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => yt("Clearing…", async () => {
      for (const x of gn())
        await e.chain.transaction(x.txid) || wt({ ...x, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      et("Cleared ✓");
    }),
    switchOff: () => yt("Switching off…", async () => {
      mn(), await (s == null ? void 0 : s.request("listening.stop")), H(!1), et("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => yt("Showing your backup words in the box…", async () => {
      if (!(o != null && o.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const x = await yn();
      await x.request("listening.backup"), o = await wn(x), et("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (x, k) => {
      if ((o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Ie("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await yn()).request("listening.signShelf", { action: x, ...k ? { release: k } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      Kt = null, await D(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (x) => yt("Confirm in the listening wallet…", async () => {
      var V, Z, re, ve;
      const k = Qt();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Ie("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (z(k)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || m || ee().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await ns();
      const K = await e.awardNote(k, x), { balance: l, nonce: g } = await e.chain.account(k);
      if (l < Sc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const f = await (await yn()).request("listening.signAward", {
        cls: K.cls,
        number: K.number,
        plays: K.plays,
        record: K.record,
        signature: K.signature,
        fee: Sc.toString(),
        nonce: g.toString(),
        balance: l.toString()
      }), T = xi(f.raw);
      if (f.hero !== k || f.number !== K.number || ((Z = (V = T.payload) == null ? void 0 : V.functionName) == null ? void 0 : Z.content) !== "claim" || ((ve = (re = T.payload) == null ? void 0 : re.contractName) == null ? void 0 : ve.content) !== o5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(f.raw, f.txid), e.store.set(Nn(k), JSON.stringify({ txid: f.txid, at: e.now() })), a = -1 / 0, At && (At = { ...At, at: -1 / 0 }), et("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (x) => yt("Confirm in the listening wallet…", async () => {
      var Z, re, ve;
      const k = Qt(), K = J();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if ((K == null ? void 0 : K.state) !== "claimed" || K.inscription === void 0) throw new Error("There is no record to send yet.");
      if (K.holds === !1) throw new Error("This record has already been sent.");
      if (K.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (C(k)) throw new Error("Your record is already on its way.");
      const l = x.trim();
      if (!Kr(l)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (l === k) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Ie("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || m || ee().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await ns();
      const { balance: g, nonce: p } = await e.chain.account(k);
      if (g < Sc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const T = await (await yn()).request("listening.signSendRecord", { inscription: K.inscription, recipient: l, fee: Sc.toString(), nonce: p.toString(), balance: g.toString() }), V = xi(T.raw);
      if (T.from !== k || T.recipient !== l || T.inscription !== K.inscription || ((re = (Z = V.payload) == null ? void 0 : Z.functionName) == null ? void 0 : re.content) !== "transfer" || kr((ve = V.payload.functionArgs) == null ? void 0 : ve[2]).value !== l)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(T.raw, T.txid), e.store.set(y(k), JSON.stringify({ txid: T.txid, at: e.now() })), a = -1 / 0, At && (At = { ...At, at: -1 / 0 }), et("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => yt("Locking…", async () => {
      mn(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, et("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (x) => {
      const k = String(x ?? "").trim();
      if (!(o != null && o.address)) return et("", "Unlock the listening wallet first.");
      if (!Kr(k)) return et("", "Enter a standard mainnet address (it starts with SP).");
      if (k === o.address) return et("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(nr(o.address), k), et("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && e.store.set(nr(o.address), ""), e.changed();
    },
    returnFunds: (x) => yt("Check the return in the listening wallet…", async () => {
      if (!jn()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (Ht()) return it(x);
      const k = Mn();
      if (!k) throw new Error(ht() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Ie("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await xs({ mode: x, to: k.to, linked: k.kind === "linked" }), x === "all" && H(!1), et(x === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Dt = [], gr = 10, Zi = 30 * 6e4;
  let Es = !1;
  const rs = () => h || !!u || d || m, mn = () => {
    Dt.length && (Dt.length = 0, e.changed());
  };
  async function ri(x) {
    if (!Dt.some((k) => k.id === x.id) && !Jt().some((k) => k.id === x.id) && (Dt.push({ ...x, at: e.now() }), Dt.length > gr && Dt.shift()), rs() || te().length) {
      const k = Dt.length;
      E = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await yr();
  }
  async function yr() {
    if (!Es) {
      Es = !0;
      try {
        for (; Dt.length; ) {
          for (; Dt.length && e.now() - Dt[0].at > Zi; ) Dt.shift();
          if (!Dt.length || rs() || await go(Dt[0]) === "wait") return;
          Dt.shift();
        }
      } finally {
        Es = !1, e.changed();
      }
    }
  }
  async function go(x) {
    var k;
    h = !0;
    try {
      await Rn();
      const K = nt();
      if (K === "loading") return "wait";
      if (K !== "ready" || !G() || !(o != null && o.session) || o.session.playsLeft < 1 || !j) return "done";
      if (te().length) return "wait";
      I || (await e.chain.verify(), I = !0);
      const l = o.address, { balance: g, nonce: p } = await e.chain.account(l);
      i = g, a = e.now();
      const f = await e.chain.owner(Iu, x.song);
      if (f === l || f === Je()) return "done";
      const T = await s.request("listening.signPlay", {
        core: Iu,
        song: x.song,
        receipt: x.id,
        fee: Oe().toString(),
        nonce: p.toString(),
        balance: g.toString()
      }), V = {
        id: x.id,
        address: l,
        kind: "play",
        core: Iu,
        song: x.song,
        recipient: f,
        amount: "50",
        fee: Oe().toString(),
        nonce: p.toString(),
        created: e.now(),
        status: "signed",
        raw: T.raw,
        txid: T.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      e.validate(V), wt(V);
      const Z = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`;
      try {
        await e.chain.broadcast(T.raw, T.txid), wt({ ...V, status: "pending" }), E = `♪ Paid ${Z}`, L = "";
      } catch (re) {
        wt({ ...V, status: li(re) ? "failed" : "unknown", note: re.message, ...li(re) ? { raw: void 0 } : {} }), L = re.message;
      }
      return o = await wn(s), "done";
    } catch (K) {
      const l = K instanceof Error ? K.message : "payment unavailable";
      return (k = _t()) != null && k.player ? (E = "Payment is taking a moment: " + l, "wait") : (E = "This song played free: " + l, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function sr(x) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(nt()) || Ie("like") ? !1 : (As(x), !0);
  }
  async function As(x) {
    const k = x.title ? `“${x.title}”` : `song #${x.song}`, K = (B) => {
      var F;
      L = B, E = "";
      try {
        (F = e.likeFailed) == null || F.call(e, x.song);
      } catch {
      }
      e.changed();
    }, l = De(), g = nt(), p = Je(), f = l && (g === "fund" || g === "over") ? "ready" : g, T = ht() ? Re() : p;
    if (f === "locked") {
      w = { ...x, at: e.now() }, et(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (f === "wrong-wallet") return K(fr());
    if (f === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (ht() && Ie("standalone")) return K("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (f === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if (f === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (l) {
      await ms(!0);
      const B = Se();
      if (rn(B))
        return e.changed(), K(fl);
    }
    if (f !== "ready" || !T) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!j) return K("Pay-per-play is running in another tab. Like from that tab.");
    const V = Jt(Re()).find((B) => B.kind === "like" && B.song === x.song);
    if (V && oa.includes(V.status))
      return K(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (d) return K("One like at a time: your last one is still being sent.");
    if ((V == null ? void 0 : V.status) === "confirmed" && e.now() - (V.confirmedAt ?? 0) < I5)
      return K(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let Z;
    m = !0;
    try {
      Z = e.likeState ? (await e.likeState(T, x.song)).by : x.likedBy ?? [];
    } catch {
      Z = x.likedBy;
    } finally {
      m = !1;
    }
    if (!Z) return K(`Could not check ${k} right now. Try the heart again.`);
    const re = Re(), S = ((V == null ? void 0 : V.status) === "confirmed" && typeof V.liked == "boolean" && e.now() - (V.confirmedAt ?? V.created) < 5 * 6e4 ? V.liked : void 0) ?? Z.includes(re);
    if (!S && Z.some((B) => B !== re)) return K(ht() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${Z.includes(p) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await yo({ song: x.song, liked: !S, title: x.title, artist: x.artist });
  }
  async function yo(x) {
    var l, g, p;
    if (d) {
      et("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const k = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`, K = e.wait ?? ((f) => new Promise((T) => setTimeout(T, f)));
    try {
      et(`${x.liked ? "Liking" : "Unliking"} ${k}…`);
      const f = e.now() + 12e4;
      for (; h || (De() ? Jt(Re()).some((S) => oa.includes(S.status)) : te().length); ) {
        if (e.now() > f) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await Rn(!0);
      }
      if (!De() && nt() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const T = Re(), { balance: V, nonce: Z } = await e.chain.account(T);
      if (De() ? c = { for: T, value: V, at: e.now() } : (i = V, a = e.now()), rn(V)) throw new Error(fl);
      const re = await s.request("listening.signLike", {
        song: x.song,
        liked: x.liked,
        fee: Lt().toString(),
        nonce: Z.toString(),
        balance: V.toString()
      }), ve = {
        id: Lu(),
        address: T,
        kind: "like",
        core: 0,
        song: x.song,
        liked: x.liked,
        recipient: "",
        amount: "0",
        fee: Lt().toString(),
        nonce: Z.toString(),
        created: e.now(),
        status: "signed",
        raw: re.raw,
        txid: re.txid,
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      e.validate(ve), wt(ve);
      try {
        await e.chain.broadcast(re.raw, re.txid), wt({ ...ve, status: "pending" }), E = `${x.liked ? "♥ Liked" : "Unliked"} ${k}`, L = "";
        try {
          (l = e.likeSent) == null || l.call(e, x.song, x.liked);
        } catch {
        }
      } catch (S) {
        if (wt({ ...ve, status: li(S) ? "failed" : "unknown", note: S.message, ...li(S) ? { raw: void 0 } : {} }), L = S.message, li(S)) try {
          (g = e.likeFailed) == null || g.call(e, x.song);
        } catch {
        }
      }
      o = await wn(s);
    } catch (f) {
      L = "Like not sent: " + (f instanceof Error ? f.message : "the listening wallet is unavailable");
      try {
        (p = e.likeFailed) == null || p.call(e, x.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), yr();
    }
  }
  return { snapshot: Mr, refresh: Rn, onListened: ri, heart: sr, toggleLike: As, ...pr };
}
const lb = ["Connect", "Passkey", "Link & fund", "Listen"], ub = ["Passkey", "Add 1 STX", "Listen"], zd = (e) => e ? ub : lb;
function C5(e) {
  if (e.solo) return T5(e);
  const t = lb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function T5(e) {
  const t = ub.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function B5(e, t) {
  return !t || t.at >= zd(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const M5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function N5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !M5(r.id)));
}
const _5 = {}, P5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, U5 = (e) => {
  const t = _5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, O5 = (e) => `/hiro/${e}`, H5 = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, D5 = (e) => {
  const t = U5(e);
  if (t)
    return [H5(t)];
  const n = P5[e];
  return typeof window < "u" ? [`${window.location.origin}${O5(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, F5 = {}, rg = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, j5 = "xtrata.log.enabled", R5 = "xtrata.log.level", z5 = "xtrata.log.tags", G5 = "xtrata.log.dedupe", vc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, K5 = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, V5 = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, X5 = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, Y5 = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, q5 = () => {
  const e = F5 ?? {}, t = vc(j5) ?? e.VITE_LOG_ENABLED, n = vc(R5) ?? e.VITE_LOG_LEVEL, r = vc(z5) ?? e.VITE_LOG_TAGS, s = vc(G5) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: K5(t),
    level: V5(n) ?? "warn",
    tags: Y5(r),
    dedupe: X5(s)
  };
}, W5 = (e, t, n) => !e.enabled || rg[n] < rg[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), Z5 = (e, t, n, r) => {
  const s = q5();
  if (!W5(s, t, e) || Q5(s.dedupe))
    return;
  const o = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, J5 = /* @__PURE__ */ new Set();
let sg = null;
const Q5 = (e, t, n, r, s) => (sg !== e && (J5.clear(), sg = e), !1), eI = (e, t, n) => Z5("debug", e, t, n), tI = {}, nI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, rI = (e) => {
  const t = tI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : nI[e];
}, sI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, oI = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return sI.test(n) ? n : null;
}, iI = (e) => e.replace(/\/+$/, ""), aI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), og = (e) => {
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
}, ui = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, cI = (e) => {
  var c, u;
  let t;
  try {
    t = kr(s6(e));
  } catch {
    return null;
  }
  const n = ui(t);
  if (!n || n.success === !1)
    return null;
  const r = ui(n.value), s = ui(r == null ? void 0 : r.value), o = ui(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = og((c = ui(o.name)) == null ? void 0 : c.value), a = og((u = ui(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : oI(`${i}.${a}`);
}, lI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${iI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [zm($m(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : cI(o.result);
}, uI = async (e) => {
  const t = e.address.trim();
  if (!vi(t))
    return null;
  const n = rI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of D5(e.network))
    try {
      return await lI({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (o) {
      r = o;
    }
  return eI("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: aI(r)
  }), null;
};
function dI(e, t, n = {}) {
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
const ig = Object.freeze({
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
}), ag = Object.freeze({ 139: "melophonic" });
function cg(e, t = "") {
  const n = String(e);
  return Object.hasOwn(ig, n) ? ig[n] : Object.hasOwn(ag, n) ? ag[n] : t;
}
const lg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function ug(e, t = "") {
  return Object.hasOwn(lg, String(e)) ? lg[String(e)] : t;
}
const db = 10000n, ih = 1000000n, hl = 3000n, fI = (e, t) => `${e}#gift=${t}`, hI = 100, ia = (e, t = Br) => e <= qt ? 0 : Number((e - qt) / En(t)), dg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), ah = "xtrata.xyz/radio/gifts", fa = hI, pI = "Create a prefunded Xtrata radio gift batch", gI = (e) => ({
  domain: tr({ name: ut(ah), version: ut("1"), "chain-id": cn(1) }),
  message: tr({
    purpose: ut(pI),
    creator: ut(e.creator),
    count: cn(e.count),
    amount: cn(BigInt(e.amount)),
    label: ut(e.label),
    issued: cn(e.issued),
    ...e.player ? { player: ut(e.player) } : {}
  })
}), fb = (e, t, n = Br) => qt + BigInt(e) * En(n) + (t ? Kl : 0n), yI = (e, t = Br) => Number((ih - qt - (e ? Kl : 0n)) / En(t)), hb = (e, t) => BigInt(e) * (t + hl);
function wI(e, t, n, r = Br) {
  const s = n ? Kl : 0n, o = t > qt + s ? t - qt - s : 0n, i = Number(o / En(r));
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
    total: hb(e, t)
  };
}
const mI = (e) => e >= db && e <= ih, bI = 90, fg = [30, 90], xI = "Extend my prefunded Xtrata radio gift batches; no spending permission", SI = (e) => ({
  domain: tr({ name: ut(ah), version: ut("1"), "chain-id": cn(1) }),
  message: tr({ purpose: ut(xI), creator: ut(e.creator), batch: ut(e.batch), days: cn(e.days), issued: cn(e.issued) })
}), hg = 40, vI = "Create an Xtrata radio gift player", Gd = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), EI = /^[^\u0000-\u001f\u007f<>]+$/u;
function pg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && EI.test(e) : !n;
}
function pb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!pg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!pg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > hg) throw new Error(`A player holds 1 to ${hg} songs.`);
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
const gb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return lf(ff(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, AI = (e) => ({
  domain: tr({ name: ut(ah), version: ut("1"), "chain-id": cn(1) }),
  message: tr({
    purpose: ut(vI),
    admin: ut(e.admin),
    player: ut(e.hash),
    issued: cn(e.issued)
  })
}), Lr = (e) => e.tracks.filter((t) => !t.hidden), kI = (e) => e.tracks.find((t) => t.hidden) ?? null, Cu = [300, 500, 1e3], xa = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Ec = (e) => typeof e == "string" && xa.some((t) => t.id === e), $o = (e) => xa.find((t) => t.id === e), $I = (e) => xa.find((t) => e >= t.min) ?? xa[xa.length - 1];
function II(e, t = Br) {
  return $I(e <= qt ? 0 : Number((e - qt) / En(t)));
}
const yb = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], LI = "1000 Players";
function ch(e = fa) {
  const t = [];
  for (const n of yb) {
    const r = fb(n.plays, !1);
    for (let s = n.count; s > 0; s -= e) {
      const o = Math.min(s, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: o, label: `${LI} ${String(i).padStart(2, "0")}`, amount: r, deposit: hb(o, r) });
    }
  }
  return t;
}
const lh = (e = ch()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: yb.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), CI = 23 * 36e5, gg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function TI(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < CI ? "unpaid" : "todo";
}
function BI(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: TI(c, n) })).filter((c) => c.state !== "todo").sort((c, u) => gg(u.state) - gg(c.state) || u.b.at - c.b.at), s = r[0];
  if (!s) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const o = (a = s.b.view) == null ? void 0 : a.copies, i = s.state === "live" ? `live · all ${e.count} waiting to be claimed` : s.state === "touched" ? `live, but only ${(o == null ? void 0 : o.waiting) ?? 0} of ${e.count} still waiting (${(o == null ? void 0 : o.claimed) ?? 0} claimed)` : s.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: s.state, batch: s.b, extras: r.length - 1, detail: s.b.error ? `${i} (${s.b.error})` : i };
}
function yg(e, t, n = ch()) {
  var u;
  const r = n.map((h) => BI(h, e, t)), s = [];
  for (const h of r)
    h.extras && s.push(`Batch ${h.step.n} was made more than once. The extra ${h.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${h.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), h.state === "touched" && s.push(`Batch ${h.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const o = r.every((h) => h.state === "live"), i = o ? r.flatMap((h) => h.batch.codes) : [], a = lh(n).players;
  o && new Set(i).size !== a && s.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = o && new Set(i).size === a;
  return { steps: r, next: ((u = r.find((h) => h.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((h) => h.state === "live").length, ready: c, codes: c ? i : [], problems: s };
}
function MI(e, t = ch()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = lh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const s = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), o = r.tiers.map((u) => {
    var d;
    const h = (d = n.tiers) == null ? void 0 : d.find((m) => m.plays === u.plays);
    return { ...u, got: (h == null ? void 0 : h.total) ?? 0 };
  }), i = o.map((u) => `${u.got} ${$o(u.id).name}`).join(", "), a = (n.tiers ?? []).filter((u) => !r.tiers.some((h) => h.plays === u.plays)), c = n.total === r.players && s === 0 && !!n.tiers && o.every((u) => u.got === u.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((u, h) => u + h.total, 0)} of another size` : ""})` : ""}${s ? `, ${s} no longer available` : ""}.` };
}
const wg = 1800, Tu = /* @__PURE__ */ new Map();
async function NI(e) {
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
function _I(e, t, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = e, (() => {
    const a = Tu.get(e), c = !!a && a.until > Date.now();
    o.textContent = c ? a.label : t, o.classList.toggle("is-done", c && a.ok), o.classList.toggle("is-failed", c && !a.ok);
  })(), o.onclick = async () => {
    const a = await n();
    if (a) {
      Tu.set(e, { ...a, until: Date.now() + wg });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Tu.delete(e), s();
      }, wg + 50);
    }
  }, o;
}
const Wn = (e, t, n, r, s) => _I(e, t, async () => await NI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), wo = "xtrata.radio.gift.incoming.v1", mg = (e) => "xtrata.radio.gift.mine.v1:" + e, bg = (e) => "xtrata.radio.gift.batches.v1:" + e, he = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Xt = (e, t, n = "") => {
  const r = he("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, aa = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Un = (e) => Er(e).replace(/\.?0+$/, "");
function PI(e) {
  let t = null;
  const n = (y) => [5e3, 1e4, 2e4, 3e4][y] ?? 6e4, r = (() => {
    try {
      const y = new URL(location.href), C = new URLSearchParams(y.hash.slice(1)).get("gift") ?? y.searchParams.get("gift");
      return C !== null && (y.searchParams.delete("gift"), history.replaceState(null, "", y.pathname + (y.search || ""))), dg(C) ? C : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const y = JSON.parse(e.store.get(wo) || "null");
      return dg(y == null ? void 0 : y.code) ? y.code : null;
    } catch {
      return null;
    }
  })(), o = r ?? s;
  if (o) {
    t = { code: o }, e.store.set(wo, JSON.stringify({ code: o, at: e.now() }));
    let y = 0;
    const C = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: o }), signal: AbortSignal.timeout(15e3) }).then(async (z) => {
      const D = await z.json().catch(() => ({}));
      if (z.status === 404) {
        e.store.set(wo, null), t = { ...t, error: (D == null ? void 0 : D.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!z.ok) throw new Error("busy");
      const J = D;
      t = { ...t, view: J, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(J.status) && e.store.set(wo, null), e.changed();
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
    return [Wn("gift-pass-on", "Copy the link to pass on", () => C, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(wo, null), e.changed();
  }, d = (y) => y.from ? e.who(y.from) : y.label ? `Xtrata Radio · ${y.label}` : "Xtrata Radio";
  let m = {};
  const w = (y) => {
    if (m.box) return m.box;
    const C = he("div", "", "ppp-gift-check");
    m.box = C;
    const z = () => {
      const D = window.turnstile;
      !D || m.rendered || (m.rendered = !0, D.render(C, { sitekey: y, callback: (J) => {
        m.token = J, e.changed();
      }, "expired-callback": () => {
        m.token = void 0;
      } }));
    };
    if (window.turnstile) z();
    else {
      const D = document.createElement("script");
      D.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", D.async = !0, D.onload = z, document.head.append(D);
    }
    return C;
  }, v = (y) => {
    queueMicrotask(() => void y());
  };
  let E;
  async function L(y) {
    var D, J, ne, ke, xe, Be, gt, me, Qe;
    if (!t || t.claiming || !y.listening) return;
    const C = !!((D = t.view) != null && D.player);
    if (C && !y.root) return;
    t.claiming = !0, t.error = void 0, (J = e.claiming) == null || J.call(e, !0), e.changed();
    const z = async (ot) => {
      const Ze = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: m.token, ...ot })
      });
      return { res: Ze, r: await Ze.json().catch(() => ({})) };
    };
    try {
      let ot = 0, Ze = y.listening, Ht;
      if (C) {
        const nt = Number((ne = await e.json("/radio/gift/slots?root=" + encodeURIComponent(y.root))) == null ? void 0 : ne.next);
        if (!Number.isSafeInteger(nt) || nt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        ot = nt;
        for (let Mr = 0; ; Mr++) {
          const Nr = await e.album.bind(ot);
          if (Ze = Nr.address, Ht = await z({ wallet: Ze, binding: Nr }), Ht.res.status === 409 && /just taken/.test(((ke = Ht.r) == null ? void 0 : ke.error) || "") && Mr < 5) {
            ot += 1;
            continue;
          }
          break;
        }
      } else Ht = await z({ wallet: Ze });
      const { res: Ct, r: Vt } = Ht;
      if (Ct.status === 503 && /sending another gift/.test((Vt == null ? void 0 : Vt.error) || "")) {
        t.waiting = !0, (xe = e.claiming) == null || xe.call(e, !0), clearTimeout(E), E = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!Ct.ok) {
        const nt = String((Vt == null ? void 0 : Vt.error) || "");
        if (Ct.status === 404 || Ct.status === 410 || Ct.status === 409 && /already had a gift|brand-new|already have this album/.test(nt))
          throw e.store.set(wo, null), new Error(nt || "This gift cannot be opened.");
        if (Ct.status === 429 || Ct.status === 403 || Ct.status === 400 && !/wallet number/i.test(nt)) throw new Error(nt || `Could not open the gift (${Ct.status}).`);
        const Nr = /topping up/.test(nt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(nt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(nt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Nr), { retry: !0, slow: /topping up|not paid for yet/.test(nt) });
      }
      t.done = !0, e.store.set(wo, null), C ? await e.album.arrived(ot, Ze, Vt.txid, BigInt(Vt.amount)) : e.giftSent(Vt.txid, BigInt(Vt.amount));
    } catch (ot) {
      const Ze = ot, Ht = Ze.name === "TypeError" || Ze.name === "AbortError" || Ze.name === "TimeoutError" || /wallet number/i.test(Ze.message);
      if (Ze.retry || Ht) {
        const Ct = t.tries ?? 0;
        t.tries = Ct + 1, t.retry = { text: Ze.retry ? Ze.message : "Still sending your gift… the network is slow, trying again." }, (Be = e.claiming) == null || Be.call(e, !0), clearTimeout(E), E = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, Ze.slow ? 6e4 : n(Ct));
      } else
        t.error = Ze.message, (gt = e.claiming) == null || gt.call(e, !1);
      m.token = void 0;
      try {
        (Qe = (me = window.turnstile) == null ? void 0 : me.reset) == null || Qe.call(me, m.box);
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
      const z = y.listening;
      P = { ...(P == null ? void 0 : P.wallet) === z ? P : {}, wallet: z, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(z)).then((D) => {
        var J, ne;
        (P == null ? void 0 : P.wallet) === z && (P.state = (J = D == null ? void 0 : D.gift) == null ? void 0 : J.state, P.problem = ((ne = D == null ? void 0 : D.gift) == null ? void 0 : ne.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(P.state === "sending" && P.problem)) return [];
    const C = he("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return C.title = `Network reply: ${P.problem}`, [C];
  }
  function A(y, C, z = !1) {
    var Be, gt;
    const D = C.player, J = BigInt(C.amount), ne = z ? [] : [he("p", `🎁 ${d(C)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${Lr(D).length} ${Lr(D).length === 1 ? "song" : "songs"} and ${ia(J).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!y.root && ["fund", "ready", "over", "link"].includes(y.step))) {
      if (z) return ne;
      if (ne.push(he("p", y.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : y.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), y.step === "intro") {
        const me = document.createElement("details");
        me.className = "ppp-how";
        const Qe = document.createElement("summary");
        Qe.textContent = "How does this work?", me.append(Qe, he("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), ne.push(me);
      }
      return ne;
    }
    if (y.walletCannotAlbums)
      return ne.push(he("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), ne;
    const xe = (gt = (Be = y.gate) == null ? void 0 : Be.gifts) == null ? void 0 : gt.turnstileSiteKey;
    return xe && !m.token ? ne.push(he("p", "One quick check and it is yours:", "ppp-mute"), w(xe)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(y)), ne.push(...M(y, "Sending your album…")), ne;
  }
  function M(y, C) {
    const z = [];
    return t.claiming || t.waiting ? z.push(he("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : C, "ppp-cyan")) : t.retry && z.push(he("p", t.retry.text, "ppp-warn"), Xt("Try now", () => {
      clearTimeout(E), t.retry = void 0, L(y);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? z.push(he("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), Xt("Forget this gift link here", h, "quiet")) : t.error && z.push(he("p", t.error, "ppp-bad"), Xt("Try again", () => {
      t.error = void 0, L(y);
    })), z;
  }
  const U = (y) => {
    var C;
    return !!t && !t.done && !t.error && i() && !!y.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !y.linked && !y.creditedTo && (y.createdHere || y.brandNew || !!((C = t.view) != null && C.player)) && (y.balance ?? 0n) === 0n && !y.entries.length);
  };
  function X(y, C = {}) {
    var Ze, Ht, Ct, Vt;
    const z = O(y);
    if (!t || ["off", "elsewhere"].includes(y.step)) return z;
    const D = t.view;
    if (t.error && !D) return [he("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!D) return [he("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return z;
    if (D.status === "claimed" || D.status === "claiming") return [he("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [he("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [he("p", `🎁 ${d(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (D.player) return [...A(y, D, !!C.bare), ...z];
    const J = !!y.listening && (!(y.createdHere || y.brandNew) || !!y.linked || !!y.creditedTo || (y.balance ?? 0n) > 0n || y.entries.length > 0), ne = J ? ((Ze = e.claimNew) == null ? void 0 : Ze.call(e, y)) ?? null : null, ke = ne ? ((Ht = e.replaceOld) == null ? void 0 : Ht.call(e, y)) ?? null : null;
    if (ne && ke)
      return [
        he("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        Xt("Replace my old player", ke, "primary"),
        Xt("Keep both players", ne, "quiet"),
        Xt("Not now", h, "quiet")
      ];
    if (ne)
      return [
        he("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        Xt("Claim it as a new player", ne, "primary"),
        Xt("Not now", h, "quiet")
      ];
    if (J)
      return [he("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Xt("Forget this gift link here", h, "quiet")];
    const xe = BigInt(D.amount), Be = ia(xe).toLocaleString(), gt = he(
      "p",
      `🎁 ${d(D)} sent you ${Un(xe)} STX of on-chain music: about ${Be} paid plays.`,
      "ppp-gift"
    ), me = C.bare ? [] : [gt], Qe = !!y.listening && (y.createdHere || y.brandNew) && !y.linked && !y.creditedTo && y.step === "fund" && (y.balance ?? 1n) === 0n && !y.depositPending && !y.entries.length, ot = (Vt = (Ct = y.gate) == null ? void 0 : Ct.gifts) == null ? void 0 : Vt.turnstileSiteKey;
    return Qe ? (ot && !m.token ? me.push(he("p", "One quick check and it is yours:", "ppp-mute"), w(ot)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(y)), me.push(...M(y, "Sending your gift…"))) : y.step === "intro" ? C.bare || me.push(he("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : y.listening && y.linked ? me.push(he("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Xt("Forget this gift link here", h, "quiet")) : y.listening && (y.balance ?? 0n) > 0n && me.push(he("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Xt("Forget this gift link here", h, "quiet")), me;
  }
  async function ae(y, C, z) {
    var D;
    try {
      const J = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(y));
      if ((D = J == null ? void 0 : J.gift) != null && D.returnTo) return { ok: !0, funder: J.gift.returnTo, txId: J.gift.txid ?? void 0, amount: J.gift.amount, distinct: 1 };
    } catch {
      if (z) return { ok: !1 };
    }
    return C();
  }
  const se = he("div", "", "ppp-gift-fold");
  let Y = 250000n, b = "", $ = "";
  const N = (y) => {
    try {
      const C = JSON.parse(e.store.get(mg(y)) || "[]");
      return Array.isArray(C) ? C : [];
    } catch {
      return [];
    }
  }, _ = (y, C) => e.store.set(mg(y), JSON.stringify(C.slice(0, 50)));
  async function q(y) {
    const C = N(y);
    for (const z of C)
      if (!(z.view && ["claimed", "refunded", "expired"].includes(z.view.status)))
        try {
          z.view = !z.view || z.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: z.id, ...z.txid ? { txid: z.txid } : {} }) }) : await e.json("/radio/gift?id=" + z.id), z.error = void 0;
        } catch (D) {
          z.error = D.message;
        }
    _(y, C), e.changed();
  }
  async function R(y) {
    if (b) return;
    b = "Starting your gift…", $ = "", e.changed();
    let C = null;
    try {
      C = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: y, amount: Y.toString() }) });
      const z = N(y);
      z.unshift({ id: C.id, code: C.code, amount: Y.toString(), at: e.now() }), _(y, z), b = "Approve the gift in your wallet…", e.changed();
      const D = await e.pay(y, C.depositTo, BigInt(C.deposit), C.memo), J = N(y), ne = J.find((ke) => ke.id === C.id);
      ne && (ne.txid = D, ne.view = { status: "pending-deposit", amount: Y.toString(), source: "friend", from: y, label: "", expires: 0 }), _(y, J), $ = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", q(y);
    } catch (z) {
      $ = z.message || "Not sent.";
    } finally {
      b = "", e.changed();
    }
  }
  const ce = (y) => "xtrata.radio.gift.players.v1:" + y, le = (y) => {
    try {
      const C = JSON.parse(e.store.get(ce(y)) || "[]");
      return Array.isArray(C) ? C.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id)) : [];
    } catch {
      return [];
    }
  };
  async function He(y, C) {
    var z;
    if (!b) {
      b = "Checking the player…", $ = "", e.changed();
      try {
        const D = C.tracks.split(/[\s,]+/).filter(Boolean).map((me) => Number(me.replace(/^#/, ""))), J = (C.explicit ?? "").split(/[\s,]+/).map((me) => me.replace(/^#/, "")).filter(Boolean).map(Number), ne = pb({ title: C.title.trim(), subtitle: C.subtitle.trim(), tracks: D, cover: (z = C.cover) != null && z.trim() ? Number(C.cover.trim().replace(/^#/, "")) : null, ...J.length ? { explicit: J } : {} });
        b = "Sign in your wallet…", e.changed();
        const ke = { admin: y, hash: gb(ne), issued: e.now() }, xe = await e.sign(y, AI(ke));
        b = "Making the player…", e.changed();
        const Be = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ne, request: ke, signature: xe }) }), gt = le(y).filter((me) => me.id !== Be.id);
        gt.unshift({ id: Be.id, title: Be.title, tracks: Be.tracks }), e.store.set(ce(y), JSON.stringify(gt.slice(0, 30))), $ = `${Be.existing ? "That player already exists" : "Player made"} ✓ “${Be.title}” · ${Be.tracks} songs. Pick it below for a batch.`;
      } catch (D) {
        $ = D.message || "Not made.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const I = (y, C) => fI(y || location.origin + "/radio.html", C), j = (y) => {
    try {
      const C = JSON.parse(e.store.get(bg(y)) || "[]");
      return Array.isArray(C) ? C.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id) && Array.isArray(z.codes)) : [];
    } catch {
      return [];
    }
  }, ue = (y, C) => e.store.set(bg(y), JSON.stringify([...C.filter((z) => z.codes.length), ...C.filter((z) => !z.codes.length)].slice(0, 80))), ge = (y) => !!y.view && y.view.status === "live" && y.view.copies.waiting + y.view.copies.claiming + y.view.copies.refunding === 0, Ce = (y, C) => e.json(y, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(C) });
  let Te = 0;
  async function It(y) {
    const C = j(y);
    for (const D of C)
      if (!ge(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await Ce("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await e.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (J) {
          D.error = J.message;
        }
    try {
      const D = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(y));
      for (const J of (D == null ? void 0 : D.batches) ?? []) {
        const ne = C.find((ke) => ke.id === J.id);
        if (ne) {
          ne.error || (ne.view = J);
          continue;
        }
        C.push({ id: J.id, codes: [], count: J.count, amount: J.amount, label: J.label, player: J.player, depositTo: "", deposit: J.deposit, memo: J.memo, at: 0, view: J });
      }
    } catch {
    }
    const z = /* @__PURE__ */ new Map();
    for (const D of j(y)) (!z.has(D.id) || D.codes.length > z.get(D.id).codes.length) && z.set(D.id, D);
    for (const D of C) {
      const J = z.get(D.id);
      J ? z.set(D.id, { ...J, view: D.view ?? J.view, error: D.error, txid: J.txid ?? D.txid, codes: J.codes.length >= D.codes.length ? J.codes : D.codes, depositTo: J.depositTo || D.depositTo }) : z.set(D.id, D);
    }
    ue(y, [...z.values()]), e.changed();
  }
  async function Oe(y, C) {
    const z = j(y).find((D) => D.id === C);
    if (!(!z || !z.depositTo || b)) {
      b = "Approve the payment in your wallet…", $ = "", e.changed();
      try {
        const D = await e.pay(y, z.depositTo, BigInt(z.deposit), z.memo), J = j(y), ne = J.find((ke) => ke.id === C);
        ne && (ne.txid = D), ue(y, J), $ = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", b = "", It(y);
      } catch (D) {
        $ = `${/cancel/i.test(D.message) ? "Payment cancelled." : D.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        b = "", e.changed();
      }
    }
  }
  async function Ie(y, C, z, D) {
    if (b) return;
    if (!C.ok) {
      $ = C.reason, e.changed();
      return;
    }
    b = "Sign in your wallet…", $ = "", e.changed();
    let J = null;
    try {
      const ne = { creator: y, count: C.count, amount: C.amount.toString(), label: z, issued: e.now(), ...D ? { player: D } : {} }, ke = await e.sign(y, gI(ne));
      b = "Making your links…", e.changed(), J = await Ce("/radio/gift/batch", { request: ne, signature: ke });
      const xe = j(y);
      xe.unshift({ id: J.id, codes: J.codes, count: C.count, amount: J.amount, label: z, player: D ?? null, depositTo: J.depositTo, deposit: J.deposit, memo: J.memo, at: e.now() }), ue(y, xe);
    } catch (ne) {
      $ = ne.message || "Not made.", b = "", e.changed();
      return;
    }
    b = "", e.changed(), await Oe(y, J.id);
  }
  async function Ne(y, C, z) {
    if (!b) {
      b = "Sign in your wallet (nothing is spent)…", $ = "", e.changed();
      try {
        const D = { creator: y, batch: C, days: z, issued: e.now() }, J = await e.sign(y, SI(D));
        b = "Extending…", e.changed();
        const ne = await Ce("/radio/gift/batch/extend", { request: D, signature: J }), ke = j(y);
        for (const xe of (ne == null ? void 0 : ne.batches) ?? []) {
          const Be = ke.find((gt) => gt.id === xe.id);
          Be && (Be.view = xe, Be.error = void 0);
        }
        ue(y, ke), $ = ne != null && ne.extended ? `Extended ✓ ${ne.extended === 1 ? "That batch has" : `${ne.extended} batches have`} ${z} more days.` : "There was nothing live to extend.";
      } catch (D) {
        $ = /cancel/i.test(D.message || "") ? "Cancelled. Nothing changed." : D.message || "Not extended.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const en = (y) => Math.max(0, Math.ceil((y - e.now()) / 864e5));
  function Gt(y, C) {
    const z = C.filter((ne) => {
      var ke;
      return ((ke = ne.view) == null ? void 0 : ke.status) === "live" && ne.view.copies.waiting > 0;
    });
    if (!z.length) return null;
    const D = Math.min(...z.map((ne) => ne.view.expires)), J = he("p", "", "ppp-batch-extend");
    J.append(he("span", `${z.length} live ${z.length === 1 ? "batch" : "batches"} · the first runs out in ${en(D)} days. Extend ${z.length === 1 ? "it" : "them all"}: `));
    for (const ne of fg) {
      const ke = Xt(`+${ne} days`, () => void Ne(y, "all", ne), "tiny");
      ke.disabled = !!b, J.append(ke);
    }
    return J;
  }
  const Je = () => Jt(!!De.value, Se.value, Lt.value);
  function Jt(y, C, z) {
    const D = C === "max" ? yI(y) : Number(C), J = fb(D, y), ne = Number(z);
    return !Number.isInteger(ne) || ne < 1 || ne > fa ? { ok: !1, reason: `Make 1 to ${fa} copies at a time.`, album: y, plays: D, amount: J, count: ne } : mI(J) ? { ok: !0, reason: "", album: y, plays: D, amount: J, count: ne, bill: wI(ne, J, y) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: y, plays: D, amount: J, count: ne };
  }
  const wt = () => {
    var y;
    return ((y = e.batchDays) == null ? void 0 : y.call(e)) ?? bI;
  }, G = (y = Je()) => {
    if (!y.ok) return y.reason;
    const C = y.bill;
    return `Each copy: ${y.plays.toLocaleString()} paid plays (${Un(C.holders)} to song holders, ${Un(C.fees)} network fees)${y.album ? `, ${Un(C.float)} for the album’s likes` : ""}, ${Un(C.reserve)} kept so a listener can return what is left, + ${Un(C.sendFee)} to send it = ${Un(C.perCopy)} STX. ${y.count} copies = ${Un(C.total)} STX, paid now in one payment. Copies nobody claims within ${wt()} days come back to you, and you can extend that at any time.`;
  }, H = (y, C) => C.codes.map((z) => I(y, z)), te = he("input");
  te.type = "range", te.min = String(db), te.max = String(ih), te.step = "10000", te.value = String(Y), te.setAttribute("aria-label", "Gift amount");
  const ee = he("p", "", "ppp-gift-amount"), de = Xt("", () => {
    const y = e.main();
    y && R(y);
  }, "primary"), lt = () => {
    ee.textContent = Le(), de.textContent = `Gift ${Un(Y)} STX`;
  };
  te.oninput = () => {
    Y = BigInt(te.value), lt();
  };
  const Le = () => `${Un(Y)} STX · about ${ia(Y).toLocaleString()} paid plays · you pay ${Un(Y + hl)} STX with the network fee`;
  lt();
  const Pe = he("input");
  Pe.maxLength = 60, Pe.placeholder = "Title, e.g. Proof of Sound", Pe.setAttribute("aria-label", "Player title");
  const ft = he("input");
  ft.maxLength = 80, ft.placeholder = "Artist (optional)", ft.setAttribute("aria-label", "Player subtitle");
  const _e = he("textarea");
  _e.rows = 3, _e.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", _e.setAttribute("aria-label", "Songs");
  const Ee = he("input");
  Ee.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ee.setAttribute("aria-label", "Explicit songs");
  const Re = he("input");
  Re.inputMode = "numeric", Re.placeholder = "Cover inscription number (optional), shown when the album loads", Re.setAttribute("aria-label", "Cover inscription");
  const De = he("select");
  De.setAttribute("aria-label", "Batch album");
  const Se = he("select");
  Se.setAttribute("aria-label", "Plays per copy");
  for (const y of [.../* @__PURE__ */ new Set([50, 100, 250, ...Cu])].sort((C, z) => C - z)) Se.append(aa(`${y.toLocaleString()} plays`, String(y)));
  Se.append(aa("Max (1 STX)", "max")), Se.value = String(Cu[0]);
  const Lt = he("input");
  Lt.type = "number", Lt.min = "1", Lt.max = String(fa), Lt.value = "10", Lt.setAttribute("aria-label", "Copies");
  const rn = he("input");
  rn.maxLength = 40, rn.placeholder = "Label, e.g. Opera launch", rn.setAttribute("aria-label", "Batch label");
  const gn = he("p", "", "ppp-mute"), Bn = () => {
    gn.textContent = G();
  };
  for (const y of [De, Se, Lt])
    y.oninput = Bn, y.onchange = Bn;
  Bn();
  let ht = null, kn = 0;
  async function nr() {
    kn = e.now();
    try {
      ht = MI(await e.json("/radio/giveaway/players"));
    } catch {
      ht = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const es = (y, C) => {
    var D;
    if (((D = yg(j(y), e.now()).next) == null ? void 0 : D.n) !== C.n) {
      $ = "That batch is already made. Check again.", e.changed();
      return;
    }
    Ie(y, Jt(!1, String(C.plays), String(C.count)), C.label);
  };
  function Fn(y) {
    var ke;
    const C = yg(j(y), e.now()), z = lh(), D = he("div", "", "ppp-drop");
    D.append(
      he("p", `The ${z.players.toLocaleString("en-GB")} players (admin) · ${C.done} of ${z.batches} batches live`, "ppp-cyan"),
      he("p", `${z.tiers.map((xe) => `${xe.count} ${$o(xe.id).name}`).join(", ")}. ${z.batches} batches, ${Un(z.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const J = he("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const xe of C.steps) {
      const Be = he("li"), gt = xe.state === "live" ? "✓" : xe.state === "touched" ? "!" : xe.state === "todo" ? "○" : "…";
      if (Be.append(he("span", `${gt} ${xe.step.n}. ${$o(xe.step.tier).name} · ${xe.step.count} × ${xe.step.plays.toLocaleString("en-GB")} plays · ${Un(xe.step.deposit)} STX`, "t"), he("span", xe.detail, xe.state === "live" ? "ppp-ok" : xe.state === "touched" ? "ppp-warn" : "ppp-mute")), xe.state === "todo" && ((ke = C.next) == null ? void 0 : ke.n) === xe.step.n) {
        const me = Xt("Sign and pay", () => es(y, xe.step), "tiny");
        me.disabled = !!b, Be.append(me);
      }
      if (xe.state === "unpaid" && xe.batch) {
        const me = Xt("Pay now", () => void Oe(y, xe.batch.id), "tiny");
        me.disabled = !!b, Be.append(me);
      }
      J.append(Be);
    }
    D.append(J);
    for (const xe of C.problems) D.append(he("p", xe, "ppp-warn"));
    C.ready ? D.append(
      he("p", `All ${z.batches} batches are live: ${C.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      Wn("drop-copy", `Copy the ${C.codes.length.toLocaleString("en-GB")} links`, () => C.codes.join(`
`), "tiny", e.changed)
    ) : D.append(he("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - kn > 6e4 && nr(), ht && D.append(he("p", ht.text, ht.ok ? "ppp-ok" : "ppp-mute"));
    const ne = Xt("Check again", () => {
      Te = e.now(), It(y), nr();
    }, "tiny");
    return ne.disabled = !!b, D.append(ne), D;
  }
  function Mn(y, C, z) {
    const D = C.view, J = D == null ? void 0 : D.copies, ne = C.error ? C.error : !D || D.status === "pending-deposit" ? C.txid ? "payment confirming…" : "waiting for your payment" : `${J.claimed} of ${D.count} claimed${J.refunding + J.refunded ? ` · ${J.refunded} refunded${J.refunding ? `, ${J.refunding} on their way` : ""}` : ""}`, ke = he("li");
    if (ke.append(he("span", `${C.label || "Batch"} · ${C.count} × ${Un(BigInt(C.amount))} STX`, "t"), he("span", ne, "ppp-mute")), !C.txid && C.depositTo && (!D || D.status === "pending-deposit") && ke.append(Xt("Pay now", () => void Oe(y, C.id), "tiny")), (D == null ? void 0 : D.status) === "live" && J.waiting > 0) {
      ke.append(he("span", `${en(D.expires)} days left`, "ppp-mute"));
      for (const xe of fg) {
        const Be = Xt(`+${xe}`, () => void Ne(y, C.id, xe), "tiny");
        Be.title = `Extend this batch by ${xe} days (a signature, no payment)`, Be.setAttribute("aria-label", `Extend ${C.label || "this batch"} by ${xe} days`), Be.disabled = !!b, ke.append(Be);
      }
    }
    if (C.codes.length && (D == null ? void 0 : D.status) === "live") {
      const xe = H(z, C);
      ke.append(
        Wn("batch-copy:" + C.id, "Copy all links", () => xe.join(`
`), "tiny", e.changed),
        Wn("batch-csv:" + C.id, "Copy as CSV", () => ["copy,link", ...xe.map((Be, gt) => `${gt + 1},${Be}`)].join(`
`), "tiny", e.changed)
      );
    } else C.codes.length || ke.append(he("span", "links were made on another device", "ppp-mute"));
    return ke;
  }
  const ln = he("select");
  ln.setAttribute("aria-label", "Plays in each copy");
  for (const y of [.../* @__PURE__ */ new Set([50, 100, 250, ...Cu])].sort((C, z) => C - z)) ln.append(aa(`${y.toLocaleString()} plays`, String(y)));
  ln.value = "50";
  const _t = he("input");
  _t.type = "number", _t.min = "1", _t.max = String(fa), _t.value = "10", _t.setAttribute("aria-label", "How many copies");
  const Qt = he("input");
  Qt.maxLength = 40, Qt.placeholder = "A note recipients see, e.g. Launch week (optional)", Qt.setAttribute("aria-label", "Note for recipients");
  const At = he("p", "", "ppp-mute");
  function Kt(y, C, z) {
    const D = () => Jt(!0, ln.value, _t.value), J = () => {
      At.textContent = G(D());
    };
    for (const Qe of [ln, _t])
      Qe.oninput = J, Qe.onchange = J;
    J();
    const ne = () => (Qt.value.trim() || C.title).replace(/[^ -~]/g, "").slice(0, 40), ke = Xt("Sign, pay and make links", () => {
      Ie(y, D(), ne(), C.id);
    }, "primary");
    ke.disabled = !!b;
    const xe = (Qe, ot) => {
      const Ze = he("label", Qe);
      return Ze.append(ot), Ze;
    }, Be = [
      he("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      xe("Plays in each ", ln),
      xe("Copies ", _t),
      Qt,
      At,
      ke
    ];
    e.now() - Te > 3e4 && (Te = e.now(), It(y));
    const gt = j(y).filter((Qe) => Qe.player === C.id);
    if (gt.length) {
      const Qe = he("ul", "", "ppp-gift-list");
      for (const ot of gt.slice(0, 10)) Qe.append(Mn(y, ot, z));
      Be.push(Qe);
    }
    const me = Gt(y, j(y));
    return me && Be.push(me), b && Be.push(he("p", b, "ppp-cyan")), $ && Be.push(he("p", $, /✓/.test($) ? "ppp-ok" : "ppp-warn")), Be;
  }
  function ts(y) {
    var J, ne;
    const C = (J = y.gate) == null ? void 0 : J.gifts;
    if (!(C != null && C.enabled) || !C.admin || ["off", "elsewhere", "unsupported"].includes(y.step)) return null;
    const z = e.main(), D = [he("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!z)
      D.push(he("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (C.admin) {
      const ke = he("div", "", "ppp-gift-admin"), xe = (ot, Ze) => {
        const Ht = he("label", ot);
        return Ht.append(Ze), Ht;
      }, Be = le(z);
      ke.append(
        he("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Pe,
        ft,
        _e,
        Re,
        Ee,
        Xt("Sign and make player", () => void He(z, { title: Pe.value, subtitle: ft.value, tracks: _e.value, cover: Re.value, explicit: Ee.value }))
      );
      const gt = Xt("Sign, pay and make links", () => {
        Ie(z, Je(), rn.value.trim(), De.value || void 0);
      });
      gt.disabled = !!b;
      const me = De.value;
      De.replaceChildren(aa("No album (starter copies)", ""), ...Be.map((ot) => aa(`${ot.title} · ${ot.tracks} songs`, ot.id))), Be.some((ot) => ot.id === me) && (De.value = me), Bn(), ke.append(
        he("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${wt()} days unless you extend`, "ppp-cyan"),
        xe("Album ", De),
        xe("Plays each ", Se),
        xe("Copies ", Lt),
        rn,
        gn,
        gt
      ), e.now() - Te > 3e4 && (Te = e.now(), It(z));
      const Qe = j(z);
      if (Qe.length) {
        const ot = he("ul", "", "ppp-gift-list");
        for (const Ht of Qe.slice(0, 20)) ot.append(Mn(z, Ht, ((ne = y.gate) == null ? void 0 : ne.radioUrl) ?? null));
        ke.append(ot);
        const Ze = Gt(z, Qe);
        Ze && ke.append(Ze);
      }
      ke.append(Fn(z)), D.push(ke);
    }
    return b && D.push(he("p", b, "ppp-cyan")), $ && D.push(he("p", $, /✓/.test($) ? "ppp-ok" : "ppp-warn")), se.replaceChildren(...D), se;
  }
  return { banner: X, funder: ae, renderFold: ts, copies: Kt, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: U };
}
const UI = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function OI(e) {
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
const HI = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function DI(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((o) => (!t.pinnedOnly || t.pins.has(o.slot)) && (() => {
    const i = HI(o);
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
function FI(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Kd = /* @__PURE__ */ new Set(), uh = (e) => (Kd.add(e), () => {
  Kd.delete(e);
}), pl = () => {
  for (const e of [...Kd])
    try {
      e();
    } catch {
    }
}, xg = "xtrata:al-thumb:v1:", dh = "-", ca = 96, jI = 24 * 1024 * 1024, an = /* @__PURE__ */ new Map(), Sg = /* @__PURE__ */ new Set(), Vd = [];
let Bu = !1, Mu;
const Ma = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(xg + e);
    window.localStorage.setItem(xg + e, t);
  } catch {
  }
  return null;
};
function fh(e) {
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
async function RI(e) {
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
      const E = r.slice(v).search(/<img\b/i);
      if (E < 0)
        return r = w ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const L = v + E, P = r.indexOf(">", L);
      if (P < 0)
        return r = r.slice(L), null;
      const O = r.slice(L, P + 1), A = O.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
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
    const E = o(!1);
    if (E)
      return await i.cancel(), E;
    if (s > jI)
      return await i.cancel(), null;
  }
  return r += a.decode(), o(!0) ?? "";
}
async function zI() {
  if (!Bu) {
    Bu = !0;
    try {
      for (; Vd.length; ) {
        const e = Vd.shift();
        if (!an.has(e))
          try {
            const t = await RI(e);
            if (t === null) continue;
            if (!t) {
              an.set(e, ""), Ma(e, dh), pl();
              continue;
            }
            const n = await fh(t);
            an.set(e, n), n.startsWith("data:image/jpeg") && Ma(e, n), pl();
          } catch {
          }
      }
    } finally {
      Bu = !1;
    }
  }
}
function hh(e, t) {
  if (t && !an.get(e) ? (an.set(e, t), fh(t).then((r) => {
    r !== t && (an.set(e, r), r.startsWith("data:image/jpeg") && Ma(e, r), pl());
  })) : t === "" && !an.has(e) && an.set(e, ""), an.has(e)) return an.get(e);
  const n = Ma(e);
  if (n != null) {
    const r = n === dh ? "" : n;
    return an.set(e, r), r;
  }
  return Sg.has(e) || (Sg.add(e), Vd.push(e), Mu || (Mu = setTimeout(() => {
    Mu = void 0, zI();
  }, 1200))), "";
}
function vg(e) {
  if (an.has(e)) return an.get(e);
  const t = Ma(e);
  if (t == null) return null;
  const n = t === dh ? "" : t;
  return an.set(e, n), n;
}
const Nu = /* @__PURE__ */ new Map(), _u = /* @__PURE__ */ new Set();
function Oc(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : Nu.has(e) ? Nu.get(e) : (_u.has(e) || (_u.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, s, o, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = t.body) == null ? void 0 : s.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((o = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : o[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    Nu.set(e, t), pl();
  }).catch(() => {
    _u.delete(e);
  })), "");
}
const di = 12, GI = 5e3, Sn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, fi = (e, t, n = "") => {
  const r = Sn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function KI(e) {
  let t, n = [], r = 0, s = !1, o = !1, i = -1 / 0, a = "", c = "recent", u = !1, h = di;
  const d = Sn("div", "", "ppp-shelf-box");
  uh(() => e.changed());
  const m = (N) => "xtrata.radio.shelf.pins.v1:" + N, w = (N) => "xtrata.radio.shelf.recent.v1:" + N, v = (N, _) => {
    try {
      return JSON.parse(e.store.get(N) || "null") ?? _;
    } catch {
      return _;
    }
  }, E = (N) => new Set(v(m(N), []).filter((_) => Number.isSafeInteger(_))), L = (N) => {
    const _ = v(w(N), {}), q = {};
    for (const [R, ce] of Object.entries(_)) Number.isSafeInteger(Number(R)) && typeof ce == "number" && (q[Number(R)] = ce);
    return q;
  };
  async function P(N) {
    if (!s) {
      s = !0, o = !1;
      try {
        const _ = [];
        let q = 0, R = 0;
        for (let ce = 0; ce < GI / 100 + 1; ce++) {
          const le = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${q}&limit=100`);
          if (_.push(...OI(le == null ? void 0 : le.shelf)), R = Number(le == null ? void 0 : le.total) || _.length, !(le != null && le.next) || !Number.isSafeInteger(le.next)) break;
          q = le.next;
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
  }, A = Sn("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, h = di, e.changed();
  };
  const M = Sn("select");
  M.setAttribute("aria-label", "Sort albums");
  for (const N of UI) {
    const _ = document.createElement("option");
    _.value = N.value, _.textContent = N.label, M.append(_);
  }
  M.onchange = () => {
    c = M.value, h = di, e.changed();
  };
  const U = fi("", () => {
    u = !u, h = di, e.changed();
  }, "tiny"), X = Sn("div", "", "ppp-shelf-tools");
  X.append(A, M, U);
  const ae = Sn("div"), se = Sn("div");
  function Y(N) {
    const _ = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (_ !== t && (t = _, n = [], r = 0, i = -1 / 0, h = di), !_ || N.walletCannotAlbums) return null;
    if (!s && e.now() - i > 5 * 6e4 && P(_), !n.length)
      return o ? (se.replaceChildren(Sn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), fi("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(se), d) : null;
    const q = E(_), R = L(_), ce = DI(n, { query: a, sort: c, pinnedOnly: u, pins: q, recents: R });
    A.value !== a && (A.value = a), M.value = c, U.textContent = u ? "★ Pinned only" : "☆ Pinned only", U.setAttribute("aria-pressed", String(u));
    const le = [];
    if (N.slot > 0 && le.push(fi("← My player", () => e.open(0), "quiet")), !ce.length) le.push(Sn("p", "No album matches that.", "ppp-mute"));
    else {
      const He = Sn("ul", "", "ppp-shelf-list");
      for (const I of ce.slice(0, h)) {
        const j = Sn("li", "", I.slot === N.slot ? "now" : ""), ue = q.has(I.slot), ge = fi(ue ? "★" : "☆", () => {
          const Je = new Set(q);
          ue ? Je.delete(I.slot) : Je.add(I.slot), e.store.set(m(_), JSON.stringify([...Je])), e.changed();
        }, "tiny");
        ge.setAttribute("aria-label", ue ? `Unpin ${I.player.title}` : `Pin ${I.player.title}`);
        const Ce = [I.player.subtitle, `${Lr(I.player).length} ${Lr(I.player).length === 1 ? "song" : "songs"}`, I.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Te = I.slot === N.slot, It = fi(Te ? "Playing" : "Select", () => {
          e.store.set(w(_), JSON.stringify(FI({ ...R, [I.slot]: e.now() }))), e.open(I.slot);
        }, Te ? "tiny ppp-pick" : "tiny primary ppp-pick");
        It.disabled = Te;
        const Oe = Lr(I.player)[0], Ie = I.player.cover ?? (Oe == null ? void 0 : Oe.id), Ne = Ie ? hh(String(Ie)) : "", en = Sn("span", "", "ppp-shelf-art");
        if (Ne) {
          const Je = document.createElement("img");
          Je.src = Ne, Je.alt = "", Je.decoding = "async", en.append(Je);
        } else en.textContent = "💿";
        const Gt = Sn("span", "", "ppp-shelf-txt");
        Gt.append(Sn("span", I.player.title, "t"), Sn("span", Ce, "ppp-mute")), j.append(ge, en, Gt, It), He.append(j);
      }
      le.push(He), ce.length > h && le.push(fi(`Show more (${ce.length - h} left)`, () => {
        h += di, e.changed();
      }, "quiet"));
    }
    return o && le.push(Sn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), ae.replaceChildren(...le), d.firstChild !== X && d.replaceChildren(X, ae), d;
  }
  return { render: Y, invalidate: O, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const N = L(t), _ = [...n].filter((q) => q.player).sort((q, R) => (N[R.slot] ?? 0) - (N[q.slot] ?? 0) || R.slot - q.slot)[0];
    return _ ? { slot: _.slot, title: _.player.title } : null;
  } };
}
const Eg = "http://www.w3.org/2000/svg", VI = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function gl(e = "", t = !1) {
  const n = document.createElementNS(Eg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of VI) {
    const o = document.createElementNS(Eg, "path");
    o.setAttribute("fill-rule", "evenodd"), o.setAttribute("fill", t ? "currentColor" : r), o.setAttribute("d", s), n.append(o);
  }
  return n;
}
const rt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Vn = (e, t, n, r = !1) => {
  const s = rt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, wb = (e) => e.toLocaleString(), Ag = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, XI = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function yl(e, t) {
  const n = rt("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const o = rt("li", s < t ? "is-done" : s === t ? "is-now" : "");
    o.append(rt("i", "", s < t ? "✓" : String(s + 1)), rt("span", "", r)), n.append(o);
  }), n;
}
function YI() {
  const e = rt("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(rt("span", "tier-disc__mark", "?")), e;
}
const qI = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], xr = {
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
}, WI = (e, t, n = !1) => n ? `${t || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${t || "Xtrata Music"} has covered ${e ? `${wb(e)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, ZI = (e) => e ? `Your player holds ${wb(e)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", JI = (e) => e ? `You got a ${e.name} player` : xr.landed.title;
function QI(e, t = !0) {
  const n = rt("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(rt("span", "tier-disc__mark", e.mark)), n;
}
function eL(e) {
  const t = document.documentElement;
  let n = !1;
  const r = () => {
    const s = rt("ul", "al-welcome-points");
    for (const [o, i, a] of qI) {
      const c = rt("li");
      c.title = i;
      const u = rt("em", "", a);
      u.setAttribute("aria-hidden", "true"), c.append(u, rt("b", "", o), rt("span", "", i)), s.append(c);
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
      const i = rt("header", "al-top"), a = rt("a", "al-brand");
      a.href = "/radio", a.append(gl("al-logo"), rt("span", "", "Xtrata "), rt("b", "", "Music")), i.append(a);
      const c = rt("div", "al-body al-body--welcome"), u = rt("div", "al-welcome"), h = s.mode;
      if (h === "checking")
        u.append(rt("p", "al-welcome-wait", xr.checking));
      else {
        const m = XI(h);
        if (m >= 0 && u.append(yl(h === "new" ? Ag.fresh : Ag.gift, m)), s.tier && (h === "landed" || h === "back" || h === "empty") ? u.append(QI(s.tier)) : h === "gift" || h === "arriving" ? u.append(YI()) : h === "new" && u.append(gl("al-hero-mark")), u.append(rt("h1", "", h === "landed" ? JI(s.tier) : h === "back" && s.tier ? `Your ${s.tier.name} player` : xr[h].title)), u.append(rt("p", "", h === "gift" ? WI(s.plays, s.from, s.mystery) : h === "landed" ? ZI(s.plays) : xr[h].body)), (h === "landed" || h === "gift") && u.append(r()), s.status.length) {
          const w = rt("div", "al-status");
          w.setAttribute("role", "status"), w.append(...s.status), u.append(w);
        }
        if (s.asking) u.append(rt("p", "al-hint al-hint--ask", xr.asking));
        else if (h === "back" && s.claimNew) {
          const w = xr.backClaim;
          u.append(rt("p", "al-hint", w.body)), s.canStart && s.replaceOld ? u.append(Vn("al-primary", w.replace, s.replaceOld, s.busy), rt("p", "al-hint", w.replaceHint), Vn("al-link", w.both, s.claimNew, s.busy), Vn("al-link", w.unlock, s.unlock, s.busy)) : s.canStart && u.append(Vn("al-primary", w.primary, s.claimNew, s.busy), rt("p", "al-hint", w.hint), Vn("al-link", w.unlock, s.unlock, s.busy)), u.append(Vn("al-link", xr.back.full, s.full));
        } else if (h === "gift" || h === "new" || h === "back") {
          const w = xr[h];
          s.canStart && u.append(Vn("al-primary", w.primary, h === "back" ? s.unlock : s.start, s.busy), rt("p", "al-hint", w.hint)), s.canStart && u.append(Vn("al-link", w.returning, s.returning, s.busy)), u.append(Vn("al-link", w.full, s.full));
        } else if (h === "landed") {
          if (u.append(Vn("al-primary", xr.landed.primary, s.full)), (d = s.albums) != null && d.length) {
            u.append(rt("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const w of s.albums) {
              const v = Vn("al-album", "", w.run);
              if (w.cover) {
                const L = rt("img", "al-album__art");
                L.src = w.cover, L.alt = "", v.classList.add("al-album--art"), v.append(L);
              }
              const E = rt("span", "al-album__t");
              E.append(rt("b", "", w.title), rt("span", "", w.by)), v.append(E), u.append(v);
            }
          }
        } else h === "empty" && u.append(Vn("al-primary", xr.empty.primary, s.restock), Vn("al-link", xr.empty.full, s.full));
      }
      c.append(u), e.hidden = !1, e.replaceChildren(i, c);
    }
  };
}
const tL = 20, nL = ["Album", "Passkey", "Listen"], dn = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Ft = {
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
const xn = (e, ...t) => oe("button", { type: "button", ...e }, ...t), Ac = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, la = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, rL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, sL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function kg(e, t, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const a = document.documentElement;
  function c(b) {
    var N, _, q;
    if (!b || !Number.isSafeInteger(b)) return "";
    const $ = (q = (_ = (N = t.radio()) == null ? void 0 : N.getState) == null ? void 0 : _.call(N)) == null ? void 0 : q.albumCover;
    return $ != null && $.url && Number($.tokenId) === b ? $.url : Oc(b);
  }
  uh(() => Y());
  function u(b) {
    var N;
    o = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const $ = document.querySelector(".side");
    if (b && b !== "more") {
      for (const R of sL[b]) {
        const ce = $ == null ? void 0 : $.querySelector(R);
        ce && (ce.open = !0);
      }
      const _ = document.getElementById("sheetTitle");
      _ && (_.textContent = rL[b]);
      const q = document.getElementById("sheetExtra");
      q && q.replaceChildren(...b === "music" ? [d()] : []), (N = $ == null ? void 0 : $.scrollTo) == null || N.call($, { top: 0 });
    }
    Y();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => u("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && o && a.dataset.view === "album" && u("");
  });
  const d = () => xn(
    { class: "al-row", onClick: () => {
      u(""), t.openPlayer();
    } },
    oe("span", { class: "al-row-i", html: Ft.radio }),
    oe("span", { class: "al-row-t" }, oe("b", {}, "Xtrata Radio"), oe("small", {}, "Every song on-chain · FM, liked, all")),
    oe("span", { class: "al-row-go", html: Ft.right })
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
    !b || !$ || ($.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", N.length === 2 && (N[0].textContent = Ac(b.current || 0), N[1].textContent = b.duration ? Ac(b.duration) : "–:––"));
  }, 500);
  let E = "", L = null;
  function P(b, $, N = {}) {
    const _ = N.song || c(b.cover), R = [_ ? oe("img", { src: _, alt: N.song ? "Song artwork" : `${b.title} cover` }) : oe("div", { class: "al-cover-fallback" }, oe("b", {}, b.title), b.subtitle ? oe("span", {}, b.subtitle) : null), N.paused ? oe("span", { class: "al-paused" }, oe("i", { html: Ft.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], ce = "al-cover" + ($ ? "" : " al-cover--small") + (N.paused ? " is-paused" : "");
    return N.flip ? (R.push(oe("span", { class: "al-flip", "aria-hidden": "true", html: Ft.flip })), xn({ class: ce + " is-flippable", "aria-label": N.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: N.flip }, ...R)) : oe("div", { class: ce }, ...R);
  }
  function O(b) {
    return b.plays === null || b.plays === void 0 ? oe("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? oe("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : oe("span", { class: "al-chip" + (b.plays <= tL ? " al-chip--low" : "") }, `${la(b.plays, "play", "plays")} left`);
  }
  function A(b) {
    const $ = b.player, N = $.tracks.filter((q) => !q.hidden), _ = [];
    return b.step !== void 0 && _.push(yl(nL, b.step)), b.mode === "arrive" && b.from && _.push(oe("p", { class: "al-from" }, oe("span", { html: Ft.gift }), oe("span", {}, oe("b", {}, b.from), " sent you an album"))), _.push(P($, !0)), _.push(oe(
      "div",
      { class: "al-intro" },
      oe("h1", {}, $.title),
      $.subtitle ? oe("p", { class: "al-artist" }, $.subtitle) : null,
      N.length ? oe("p", { class: "al-songline" }, N.map((q) => q.title || `#${q.id}`).join(" · ")) : null,
      oe("span", { class: "al-chip" }, [la(N.length, "song", "songs"), b.offered ? la(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && _.push(oe("div", { class: "al-status", role: "status" }, ...b.status)), _.push(oe("div", { class: "al-grow" })), b.asking ? _.push(oe("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && _.push(xn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, oe("span", { html: Ft.playSmall }), b.primary.label)), b.hint && !b.asking && _.push(oe("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && _.push(xn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), _;
  }
  function M(b, $) {
    const { songs: N, current: _, started: q, own: R, out: ce, waiting: le } = $, He = b.player, I = t.radio(), j = [];
    j.push(oe("div", { class: "al-listhead" }, oe("span", {}, oe("b", {}, He.title), ` · ${la(N.length, "song", "songs")}`), O(b)));
    const ue = c(He.cover), ge = "album:" + He.cover;
    ue && !an.has(ge) && (an.set(ge, ue), fh(ue).then((Te) => {
      Te !== ue && (an.set(ge, Te), Y());
    }));
    const Ce = ue ? an.get(ge) || ue : "";
    return j.push(oe("ol", { class: "al-tracks" }, ...N.map((Te, It) => {
      const Oe = String(Te.id) === _, Ie = hh(String(Te.id), Oe && q ? R : void 0);
      return oe("li", {}, xn(
        { class: "al-track" + (Oe ? " is-on" : ""), "aria-label": `Play ${Te.title || "#" + Te.id}`, "aria-current": Oe ? "true" : void 0, disabled: ce || le, onClick: () => {
          var Ne;
          return (Ne = I == null ? void 0 : I.playToken) == null ? void 0 : Ne.call(I, Te.id);
        } },
        oe(
          "span",
          { class: "al-th" + (Ie ? "" : " is-blank") },
          Ie ? oe("img", { src: Ie, alt: "", decoding: "async" }) : Ce ? oe("img", { src: Ce, alt: "", decoding: "async" }) : null,
          Ie ? null : oe("span", { class: "al-n" }, String(It + 1)),
          Oe ? oe("span", { class: "al-eq", html: Ft.eq }) : null
        ),
        oe("span", { class: "al-tt" }, Te.title || `#${Te.id}`, Te.explicit ? oe("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), j;
  }
  function U(b) {
    var Ie;
    const $ = b.player, N = $.tracks.filter((Ne) => !Ne.hidden), _ = t.radio(), q = m == null ? void 0 : m.nowPlaying, R = q && $.tracks.some((Ne) => String(Ne.id) === String(q.tokenId)) ? String(q.tokenId) : null, ce = R ? $.tracks.find((Ne) => String(Ne.id) === R) : null, le = b.plays === 0 && !b.playsComing, He = !!b.playsComing && !b.plays, I = !!(m != null && m.playing) && !!R, j = m == null ? void 0 : m.heart, ue = R ? (Ie = _ == null ? void 0 : _.getPosition) == null ? void 0 : Ie.call(_) : null;
    R && (I || ((ue == null ? void 0 : ue.current) ?? 0) > 0.5) && (E = $.id);
    const ge = !!R && E === $.id;
    L && L !== R && (L = null);
    const Ce = ge ? String((q == null ? void 0 : q.cover) || "") : "", Te = !!Ce && L === R, Oe = [P($, !le, { song: Te ? "" : Ce, paused: ge && !I, flip: Ce ? () => {
      L = L === R ? null : R, Y();
    } : void 0, flipped: Te })];
    if (Oe.push(oe(
      "div",
      { class: "al-now" },
      oe(
        "div",
        { class: "al-now-t" },
        oe("div", { class: "al-song" }, ce ? ce.title || (q == null ? void 0 : q.title) || `#${ce.id}` : $.title),
        oe("div", { class: "al-artist" }, ce ? ce.artist || (q == null ? void 0 : q.artist) || $.subtitle : $.subtitle || "Press play")
      ),
      R ? xn({ class: "al-icon" + (j != null && j.liked ? " is-on" : ""), "aria-label": j != null && j.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(j != null && j.liked)), disabled: !!(j != null && j.pending) || !!(j != null && j.locked) || He, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.toggleLike) == null ? void 0 : Ne.call(_);
      }, html: j != null && j.liked ? Ft.heartOn : Ft.heart }) : null
    )), le)
      Oe.push(oe(
        "div",
        { class: "al-out" },
        oe("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        oe("p", { class: "al-out-t" }, "You've played this album out"),
        oe("p", { class: "al-out-s" }, "Add plays to keep listening."),
        X(b, !0)
      ));
    else {
      const Ne = ue != null && ue.duration ? Math.min(100, ue.current / ue.duration * 100) : 0;
      Oe.push(oe(
        "div",
        { class: "al-prog" },
        oe("div", { class: "al-bar" }, oe("i", { style: `width: ${Ne}%` })),
        oe("div", { class: "al-times" }, oe("span", {}, Ac((ue == null ? void 0 : ue.current) || 0)), oe("span", {}, ue != null && ue.duration ? Ac(ue.duration) : "–:––"))
      ));
    }
    return Oe.push(oe(
      "div",
      { class: "al-ctl" + (le || He ? " is-off" : "") },
      xn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: le || He, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.prev) == null ? void 0 : Ne.call(_);
      }, html: Ft.prev }),
      xn({ class: "al-play", "aria-label": I ? "Pause" : "Play", disabled: le || He, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.playPause) == null ? void 0 : Ne.call(_);
      }, html: I ? Ft.pause : Ft.play }),
      xn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: le || He, onClick: () => {
        var Ne;
        return (Ne = _ == null ? void 0 : _.next) == null ? void 0 : Ne.call(_);
      }, html: Ft.next })
    )), b.status.length && Oe.push(oe("div", { class: "al-status", role: "status" }, ...b.status)), Oe.push(...M(b, { songs: N, current: R, started: ge, own: Ce, out: le, waiting: He })), Oe.push(oe("div", { class: "al-grow" })), Oe.push(xn(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => u(o === "more" ? "" : "more") },
      oe("span", {}, "More ", oe("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      oe("span", { html: Ft.down })
    )), Oe;
  }
  function X(b, $) {
    const N = oe("div", { class: "al-topups" + ($ ? " al-topups--primary" : "") }), _ = $ ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const q of _) {
      const R = b.myPlays !== void 0 && b.myPlays >= q && !b.playsComing && !b.busy;
      N.append(xn({ class: "al-topup", disabled: !R, onClick: () => t.topUp(q) }, $ ? `Add ${q.toLocaleString()} plays` : `+${q.toLocaleString()}`));
    }
    return $ && N.append(xn({ class: "al-link", onClick: () => u("more") }, "Other amounts")), N;
  }
  function ae(b) {
    const $ = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), N = oe(
      "div",
      { class: "al-card" },
      oe("div", { class: "al-card-h" }, oe("b", {}, `Add plays to ${b.player.title}`), oe("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      X(b, !1),
      oe("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : $ ? `Moved from My player · ${la(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !$ && !b.playsComing && b.myPlays !== void 0 ? xn({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), _ = (R, ce, le, He) => xn(
      { class: "al-row", onClick: He },
      oe("span", { class: "al-row-i", html: R }),
      oe("span", { class: "al-row-t" }, oe("b", {}, ce), oe("small", {}, le)),
      oe("span", { class: "al-row-go", html: Ft.right })
    ), q = oe(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      _(Ft.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, Y();
      }),
      i ? oe("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return oe(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      oe("div", { class: "al-sheet-h" }, oe("b", {}, "More"), xn({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: Ft.close })),
      b.mode === "open" ? N : null,
      oe(
        "div",
        { class: "al-rows" },
        _(Ft.grid, "My music", "Your albums and the radio", () => u("music")),
        _(Ft.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), t.openPlayer();
        }),
        b.canMake ? _(Ft.gift, "Albums (admin)", "Make an album and fund copies", () => u("gifts")) : null,
        _(Ft.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        q
      )
    );
  }
  function se(b) {
    var le, He;
    const $ = b.player, N = m == null ? void 0 : m.nowPlaying, _ = N && $.tracks.some((I) => String(I.id) === String(N.tokenId)) ? String(N.tokenId) : null, q = !!(m != null && m.playing) && !!_, R = _ ? (He = (le = t.radio()) == null ? void 0 : le.getPosition) == null ? void 0 : He.call(le) : null;
    _ && (q || ((R == null ? void 0 : R.current) ?? 0) > 0.5) && (E = $.id);
    const ce = !!_ && E === $.id;
    return M(b, {
      songs: $.tracks.filter((I) => !I.hidden),
      current: _,
      started: ce,
      own: ce ? String((N == null ? void 0 : N.cover) || "") : "",
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
      v(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...se(b));
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
      b.mode === "open" ? xn({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: Ft.grid }) : null
    ), N = oe("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? U(b) : A(b));
    e.replaceChildren($, N, ...o === "more" ? [oe("div", { class: "al-scrim", onClick: () => u("") }), ae(b)] : []);
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
const oL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", iL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${oL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, aL = (e) => iL("source|audio", e), cL = 48 * 1024 * 1024;
function lL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function uL(e) {
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
    var A, M, U;
    const w = "/inscription/" + h, v = await t(w, { signal: d }), E = (v.headers.get("content-type") || "").toLowerCase();
    if (!v.ok)
      throw await ((A = v.body) == null ? void 0 : A.cancel()), new Error("not found");
    if (E.startsWith("audio/"))
      return await ((M = v.body) == null ? void 0 : M.cancel()), w;
    if (!E.includes("text/html"))
      throw await ((U = v.body) == null ? void 0 : U.cancel()), new Error("not a song");
    const L = await v.text();
    if (L.length > cL) throw new Error("too large");
    const P = L.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (P) return lL(P[1].replace(/&amp;/g, "&"));
    const O = m === 0 ? aL(L) : null;
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
const dL = ["Earned", "Claim", "Yours"], fL = ["Connect", "Link", "Name"], xt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, sn = (e, t, n, r = !1) => {
  const s = xt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, $g = (e, t, n, r = !1) => {
  const s = sn("al-album", "", n, r), o = xt("span", "al-album__t");
  return o.append(xt("b", "", e), xt("span", "", t)), s.append(o), s;
}, hL = (e) => `No. ${String(e).padStart(4, "0")}`, pL = (e) => e.main ? e.linked ? 2 : 1 : 0;
function gL(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const o = (i) => {
    if (s && r === i.art) return s;
    r = i.art, s = xt("div", "aw-art");
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
      const c = xt("header", "al-top"), u = xt("a", "al-brand");
      u.href = "/radio", u.append(gl("al-logo"), xt("span", "", "Xtrata "), xt("b", "", "Music")), c.append(u);
      const h = xt("div", "al-welcome"), d = i.screen, m = i.tier.name, w = typeof i.name == "string" && i.name ? i.name : null;
      if (h.append(d === "have" ? yl(fL, pL(i)) : yl(dL, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const O = xt("div", "tier-disc tier-disc--mid");
        O.dataset.tier = i.tier.id, O.append(xt("span", "tier-disc__mark", i.tier.mark)), h.append(O);
      } else if (d !== "have" && d !== "get") {
        const O = o(i);
        O.classList.toggle("aw-art--small", d === "name"), h.append(O);
      }
      const v = d === "ready" ? `Your ${m} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      h.append(xt("h1", "", v));
      const E = (O, A = "") => h.append(xt("p", A, O)), L = [];
      if (d === "ready")
        E(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), L.push(sn("al-primary", `Claim my ${m} record`, () => i.go("name"), i.busy), xt("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), sn("al-link", "Later", i.later));
      else if (d === "name")
        w ? (E(`Your record will carry ${w} beside your player’s address.`), L.push(sn("al-primary", `Claim with ${w}`, () => i.claim("auto"), i.busy), sn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (E("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), L.push(
          $g("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          $g("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          sn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (E("Could not check for a .btc name just now.", "ppp-warn"), L.push(sn("al-primary", "Check again", i.refresh, i.busy), sn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), L.push(xt("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), L.push(sn("al-link", "Later", i.later));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (E(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), L.push(sn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? w ? (E(`Found it: ${w}. It goes on your plaque beside your player’s address.`), L.push(sn("al-primary", `Claim with ${w}`, () => i.claim("auto"), i.busy))) : (E(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), L.push(sn("al-primary", "Check again", i.refresh, i.busy))) : (E(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), L.push(sn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (E("Connect the Leather or Xverse wallet that holds your .btc name."), L.push(sn("al-primary", "Connect my wallet", i.connect, i.busy))), L.push(sn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const O = xt("ol", "aw-steps"), A = xt("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const M = xt("a", "", "Open BNS One ↗");
        M.href = "https://bns.one", M.target = "_blank", M.rel = "noopener", A.append(M);
        const U = xt("li");
        U.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", xt("span", "ppp-addr-full", i.player), i.copyAddress());
        const X = xt("li", "", "Check again, and your name shows on the preview before you claim.");
        O.append(A, U, X), h.append(O), L.push(sn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), sn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (E("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const O = xt("p", "al-hint"), A = xt("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", O.append(A), h.append(O);
        }
      } else if (E(`${m} record ${hL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), L.push(sn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const O = xt("a", "al-link", "Open it full screen ↗");
        O.href = `/i/${i.inscription}`, O.target = "_blank", O.rel = "noopener", L.push(O);
      }
      if (i.status.length) {
        const O = xt("div", "al-status");
        O.setAttribute("role", "status"), O.append(...i.status), h.append(O);
      }
      i.asking ? h.append(xt("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...L);
      const P = xt("div", "al-body al-body--welcome");
      P.append(h), e.hidden = !1, e.replaceChildren(c, P);
    }
  };
}
const mb = "xtrata.xyz/music/release", yL = "Release music on Xtrata Music; no spending permission", wL = (e) => ({
  domain: tr({ name: ut(mb), version: ut("1"), "chain-id": cn(1) }),
  message: tr({ purpose: ut(yL), artist: ut(e.artist), release: ut(e.hash), issued: cn(e.issued) })
}), mL = "Set the price of my release on Xtrata Music; no spending permission", bL = 100000n, xL = 1000000000n, SL = (e) => e === 0n || e >= bL && e <= xL, vL = (e) => ({
  domain: tr({ name: ut(mb), version: ut("1"), "chain-id": cn(1) }),
  message: tr({ purpose: ut(mL), artist: ut(e.artist), release: ut(e.release), price: cn(BigInt(e.price)), issued: cn(e.issued) })
}), hi = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, EL = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, we = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, fn = (e, t, n = "") => {
  const r = we("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, kc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), Ig = (e) => {
  const t = Lr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function $c(e, t, n = "", r = "") {
  const s = we("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), o = e || n;
  if (o) {
    const i = document.createElement("img");
    i.src = o, i.alt = "", i.decoding = "async", s.append(i);
  }
  return e || s.append(we("span", t)), s;
}
const Pu = (e) => !!e && Gd(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function AL(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, s = "", o = "";
  const i = (() => {
    try {
      const G = new URLSearchParams(location.search).get("release");
      return Gd(G) ? G : null;
    } catch {
      return null;
    }
  })();
  let a = i ? { id: i } : null;
  const c = (G) => "xtrata.radio.releases.shelf.v1:" + G;
  let u = null, h = !1, d = -1 / 0;
  const m = (G, H, te) => {
    const ee = Array.isArray(H) ? H.filter(Pu).map((de) => ({ ...de, hidden: !!de.hidden })) : [];
    u = { for: G, albums: ee, fresh: te }, te && e.store.set(c(G), JSON.stringify(ee));
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
  async function E(G, H = "") {
    const te = e.player();
    if (!te.address || !te.unlocked)
      return o = "Unlock your player first.", e.changed(), !1;
    if (h) return !1;
    h = !0, o = "", e.changed();
    try {
      const ee = await e.signShelf(G, H), de = await e.json("/radio/release/shelf", kc(ee));
      return m(te.address, de == null ? void 0 : de.albums, !0), P(de == null ? void 0 : de.pay) ? A(te.address, de.pay) : G === "add" && A(te.address, null, H), !0;
    } catch (ee) {
      return G !== "list" && (o = ee.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const L = (G) => "xtrata.radio.releases.orders.v1:" + G, P = (G) => !!G && /^[0-9a-f]{16}$/.test(G.order) && Gd(G.release) && typeof G.to == "string" && /^\d{1,12}$/.test(G.amount) && typeof G.memo == "string", O = (G) => {
    if (!G) return {};
    try {
      const H = JSON.parse(e.store.get(L(G)) || "{}");
      return H && typeof H == "object" ? Object.fromEntries(Object.entries(H).filter(([, te]) => P(te))) : {};
    } catch {
      return {};
    }
  };
  function A(G, H, te = (H == null ? void 0 : H.release) ?? "") {
    var de;
    const ee = O(G);
    H ? ee[H.release] = { ...((de = ee[H.release]) == null ? void 0 : de.order) === H.order ? ee[H.release] : {}, ...H } : delete ee[te], e.store.set(L(G), Object.keys(ee).length ? JSON.stringify(ee) : null);
  }
  const M = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Map();
  async function X(G, H, te = !1) {
    var ee;
    if (!M.has(H.order)) {
      M.add(H.order), U.set(H.order, e.now()), te && (o = "", e.changed());
      try {
        const de = await e.json("/radio/release/paid", kc({ order: H.order, ...H.txid ? { txid: H.txid } : {} }));
        (de == null ? void 0 : de.status) === "paid" ? (A(G, null, H.release), ((ee = a == null ? void 0 : a.view) == null ? void 0 : ee.id) === H.release && (a.view = { ...a.view, added: a.view.added + 1 }), o = "", M.delete(H.order), (u == null ? void 0 : u.for) === G && (u.fresh = !1), e.player().unlocked && await E("list")) : (P(de) && A(G, { ...H, ...de }), te && (de == null ? void 0 : de.status) === "pending" && (o = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (de) {
        /did not go through|does not pay this order/.test(de.message || "") && A(G, { ...H, txid: void 0, status: "pending" }), (te || H.txid) && (o = de.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        M.delete(H.order), e.changed();
      }
    }
  }
  async function ae(G, H, te) {
    if (!s) {
      s = "Approve the payment in your wallet…", o = "", e.changed();
      try {
        const ee = await e.pay(G, te.to, BigInt(te.amount), te.memo), de = { ...te, txid: ee || void 0, status: "confirming" };
        A(H, de), s = "", X(H, de);
      } catch (ee) {
        o = /cancel/i.test(ee.message || "") ? "Payment cancelled. Nothing was sent." : ee.message || "Not paid. Nothing was sent.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  async function se(G) {
    const H = e.player();
    if (!await E("add", G.id) || !H.address) return;
    const te = O(H.address)[G.id], ee = e.main();
    te && ee && await ae(ee, H.address, te);
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
        (te) => {
          Pu(te) ? (H.view = te, delete H.error) : H.error = "This release could not be read.";
        },
        (te) => {
          H.error = te.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const G = e.player();
    if (G.address) {
      (u == null ? void 0 : u.for) !== G.address && w(G.address), G.unlocked && !(u != null && u.fresh) && !h && e.now() - d > 6e4 && (d = e.now(), E("list"));
      for (const H of Object.values(O(G.address)))
        if ((H.txid || H.status === "confirming") && !M.has(H.order) && e.now() - (U.get(H.order) ?? -1 / 0) > 2e4) {
          const te = G.address;
          X(te, H).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const b = () => t ? v().filter((G) => !G.hidden) : [];
  function $(G, H) {
    const te = we("ol", "", "ppp-rel-songs");
    return G.forEach((ee, de) => {
      const lt = we("li");
      lt.append($c(e.art.song(ee.id, !0) || "", String(de + 1), H), we("span", ee.title)), te.append(lt);
    }), te;
  }
  function N() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [we("p", `♫ ${a.error}`, "ppp-warn")] : [we("p", "♫ Opening this release…", "ppp-mute")];
    const G = a.view, H = we("div", "", "ppp-release-in"), te = we("p", "", "ppp-release-in__h"), ee = BigInt(/^\d{1,12}$/.test(G.price ?? "") ? G.price : "0");
    te.append(we("b", G.title), we("span", `${G.subtitle || e.who(G.artist)} · ${Ig(G)}${ee > 0n ? ` · ${hi(ee)} STX` : ""}`));
    const de = Lr(G), lt = e.art.cover(G.cover) || (G.cover ? "" : de[0] && e.art.song(de[0].id, !0) || ""), Le = we("div", "", "ppp-rel-top");
    Le.append($c(lt, "💿", "", "is-cover"), te), H.append(Le, $(de.map((Ee) => ({ id: Ee.id, title: Ee.title || `#${Ee.id}` })), e.art.cover(G.cover))), H.append(we("p", `Released by ${e.who(G.artist)}. ${G.added === 1 ? "1 player has" : `${G.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const Pe = e.player(), ft = v().find((Ee) => Ee.id === G.id), _e = we("div", "", "ppp-award__row");
    if (ft)
      H.append(we("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), _e.append(fn("Play it", () => e.open(G), "primary"));
    else if (!Pe.address) H.append(we("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!Pe.unlocked) H.append(we("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (ee > 0n) {
      const Ee = O(Pe.address)[G.id], Re = e.main(), De = `${hi((Ee == null ? void 0 : Ee.amount) ?? ee)} STX`;
      if (Ee != null && Ee.txid || (Ee == null ? void 0 : Ee.status) === "confirming") {
        H.append(we("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Se = fn("Check now", () => void X(Pe.address, Ee, !0));
        Se.disabled = M.has(Ee.order), _e.append(Se);
      } else if (H.append(we("p", `This album costs ${De}. You pay ${e.who(G.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Ee) H.append(we("p", "Buying is paused right now.", "ppp-warn"));
      else if (Ee) {
        if (Re) {
          const gn = fn(`Pay ${De} from my wallet`, () => void ae(Re, Pe.address, Ee), "primary");
          gn.disabled = !!s, _e.append(gn);
        } else H.append(we("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const Se = we("div", "", "ppp-rel-pay"), Lt = (gn, Bn, ht) => {
          const kn = we("p");
          return kn.append(we("span", gn), we("code", Bn), Wn(`order-${ht}:${Ee.order}`, "Copy", () => Bn, "tiny", e.changed)), kn;
        };
        Se.append(Lt("Send", hi(Ee.amount) + " STX", "amount"), Lt("To", Ee.to, "to"), Lt("Memo", Ee.memo, "memo")), H.append(Se, we("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const rn = fn("I have paid: check", () => void X(Pe.address, Ee, !0));
        rn.disabled = M.has(Ee.order), _e.append(rn);
      } else {
        const Se = fn(`Buy · ${De}`, () => void se(G), "primary");
        Se.disabled = h || !!s, _e.append(Se);
      }
    } else {
      H.append(we("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Ee = fn("Add to my player", () => {
        E("add", G.id).then((Re) => {
          Re && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      Ee.disabled = h, _e.append(Ee);
    }
    return _e.append(fn("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), H.append(_e), s && H.append(we("p", s, "ppp-cyan")), o && H.append(we("p", o, "ppp-warn")), [H];
  }
  let _ = !1;
  function q() {
    const G = t ? v() : [];
    if (!G.length) return null;
    const H = we("details", "", "ppp-release-manage");
    H.open = _, H.ontoggle = () => {
      _ = H.open;
    };
    const te = G.filter((de) => de.hidden).length;
    H.append(we("summary", `Albums I added (${G.length}${te ? `, ${te} hidden` : ""})`));
    const ee = e.player().unlocked;
    ee || H.append(we("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const de of G) {
      const lt = we("div", "", "ppp-release-row" + (de.hidden ? " is-hidden" : "")), Le = we("span", "", "ppp-release-row__t");
      Le.append(we("b", de.title), we("span", `${de.subtitle || e.who(de.artist)}${de.hidden ? " · hidden" : ""}`));
      const Pe = fn(de.hidden ? "Show" : "Hide", () => void E(de.hidden ? "show" : "hide", de.id), "tiny"), ft = fn("Remove", () => void E("remove", de.id), "tiny");
      Pe.disabled = ft.disabled = !ee || h, lt.append(Le, Pe, ft), H.append(lt);
    }
    return H.append(we("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), o && !a && H.append(we("p", o, "ppp-warn")), H;
  }
  let R = null, ce = [], le = null;
  const He = we("input");
  He.maxLength = 60, He.placeholder = "Title of the single, EP or album", He.setAttribute("aria-label", "Release title");
  const I = we("input");
  I.maxLength = 80, I.placeholder = "Artist name shown under the title", I.setAttribute("aria-label", "Artist name");
  const j = we("input");
  j.inputMode = "numeric", j.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", j.setAttribute("aria-label", "Cover inscription number");
  const ue = we("input");
  ue.inputMode = "decimal", ue.placeholder = "Price in STX, e.g. 2 (0 makes it free)", ue.setAttribute("aria-label", "Price in STX");
  let ge = null;
  const Ce = (G, H, te = "") => {
    ge = (ge == null ? void 0 : ge.id) === G && ge.what === H ? null : { id: G, what: H }, (ge == null ? void 0 : ge.what) === "price" && (ue.value = te), o = "", e.changed();
  };
  async function Te(G, H) {
    if (s) return;
    const te = EL(ue.value);
    if (te === null || !SL(te)) {
      o = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", o = "", e.changed();
    try {
      const ee = { artist: G, release: H.id, price: te.toString(), issued: e.now() }, de = await e.sign(G, vL(ee));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", kc({ request: ee, signature: de })), o = te > 0n ? `Price set ✓ “${H.title}” now costs ${hi(te)} STX, paid straight to this wallet.` : `“${H.title}” is free again ✓`, ge = null, Ie(G, !0);
    } catch (ee) {
      o = ee.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const It = (G) => `${location.origin}${location.pathname}?release=${G}`;
  function Oe(G) {
    R = { for: G, loading: !0 }, ce = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(G)).then(
      (H) => {
        const te = Array.isArray(H == null ? void 0 : H.songs) ? H.songs.filter((ee) => Number.isSafeInteger(ee == null ? void 0 : ee.id) && typeof ee.title == "string") : null;
        R = te ? { for: G, songs: te, more: !!H.more } : { for: G, error: "Your songs could not be read right now." };
      },
      (H) => {
        R = { for: G, error: H.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Ie(G, H = !1) {
    !H && (le == null ? void 0 : le.for) === G && e.now() - le.at < 6e4 || (le = { for: G, list: (le == null ? void 0 : le.for) === G ? le.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(G)).then((te) => {
      Array.isArray(te == null ? void 0 : te.releases) && (le = { for: G, list: te.releases.filter(Pu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Ne(G) {
    if (!s) {
      s = "Checking your release…", o = "", e.changed();
      try {
        const H = j.value.trim().replace(/^#/, ""), te = pb({ title: He.value.trim(), subtitle: I.value.trim(), tracks: [...ce], cover: H ? Number(H) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const ee = { artist: G, hash: gb(te), issued: e.now() }, de = await e.sign(G, wL(ee));
        s = "Releasing…", e.changed();
        const lt = await e.json("/radio/release/create", kc({ definition: te, request: ee, signature: de }));
        o = `${lt.existing ? "Already released" : "Released"} ✓ “${lt.title}”. Its link is below.`, ce = [], He.value = "", j.value = "", e.audition.stop(), Ie(G, !0);
      } catch (H) {
        o = H.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const en = () => {
    queueMicrotask(() => e.audition.stop());
  }, Gt = /* @__PURE__ */ new Set();
  function Je(G) {
    const H = ce.map((Se) => G.find((Lt) => Lt.id === Se)).filter((Se) => !!Se), te = j.value.trim().replace(/^#/, ""), ee = /^\d{1,9}$/.test(te) ? Number(te) : null, de = e.art.cover(ee), lt = H[0] ? e.art.song(H[0].id, !0) : null, Le = we("div", "", "ppp-release-preview");
    Le.append(we("p", "How it will look", "ppp-featured__h"));
    const Pe = we("p", "", "ppp-release-in__h"), ft = we("b", He.value.trim() || "Untitled"), _e = we("span", `${I.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`);
    Pe.append(ft, _e);
    const Ee = we("div", "", "ppp-rel-top");
    Ee.append($c(ee ? de : lt || "", "💿", "", "is-cover"), Pe), Le.append(Ee, $(H.map((Se) => ({ id: Se.id, title: Se.title })), de));
    const Re = H.filter((Se) => e.art.song(Se.id, !0) === null).length, De = [];
    ee && !de && De.push(`Looking for an image in #${ee}… If none appears, that inscription is not a picture.`), Re && De.push(`Finding artwork for ${Re} ${Re === 1 ? "song" : "songs"}…`), !Re && H.some((Se) => e.art.song(Se.id, !1) === "") && De.push(`A numbered square is a song with no artwork of its own${de ? ": it shows the cover, dimmed" : ""}.`);
    for (const Se of De) Le.append(we("p", Se, "ppp-mute"));
    return He.oninput = () => {
      ft.textContent = He.value.trim() || "Untitled";
    }, I.oninput = () => {
      _e.textContent = `${I.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`;
    }, j.onchange = () => e.changed(), Le;
  }
  function Jt() {
    var te;
    const G = e.main();
    if (!t || !G)
      return R && (R = null, ce = [], en()), null;
    const H = [we("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (R && R.for !== G && (R = null, ce = [], Gt.clear(), en()), !R) H.push(fn("Show the songs in my wallet", () => Oe(G), "primary"));
    else if (R.loading) H.push(we("p", "Reading your wallet…", "ppp-cyan"));
    else if (R.error) H.push(we("p", R.error, "ppp-warn"), fn("Try again", () => Oe(G)));
    else if (!R.songs.length) H.push(we("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      H.push(we("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const ee = we("div", "", "ppp-release-songs");
      for (const Le of R.songs) {
        const Pe = ce.indexOf(Le.id), ft = we("div", "", "ppp-release-song" + (Pe >= 0 ? " is-on" : "")), _e = e.audition.state(Le.id);
        _e !== "idle" && Gt.add(Le.id);
        const Ee = fn(_e === "playing" ? "❚❚" : _e === "loading" ? "…" : "▶", () => e.audition.toggle(Le.id), "ppp-release-hear" + (_e === "playing" ? " is-on" : ""));
        Ee.setAttribute("aria-label", _e === "playing" ? `Stop ${Le.title}` : `Listen to ${Le.title}`), Ee.title = _e === "error" ? "This song could not be played just now" : _e === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const Re = e.art.song(Le.id, Pe >= 0 || Gt.has(Le.id)), De = fn("", () => {
          ce = Pe >= 0 ? ce.filter((Se) => Se !== Le.id) : [...ce, Le.id], e.changed();
        }, "ppp-release-pick");
        De.setAttribute("aria-pressed", String(Pe >= 0)), De.append(we("i", Pe >= 0 ? String(Pe + 1) : "+"), we("b", Le.title), we("span", _e === "error" ? "could not play" : `${Le.artist ? Le.artist + " · " : ""}#${Le.id}`, _e === "error" ? "ppp-warn" : "")), ft.append(Ee, $c(Re || "", Re === "" ? "♪" : "", ""), De), ee.append(ft);
      }
      H.push(ee), R.more && H.push(we("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !I.value && ce.length && (I.value = ((te = R.songs.find((Le) => Le.id === ce[0])) == null ? void 0 : te.artist) || "");
      const de = ce.length === 0 ? "release" : ce.length === 1 ? "single" : ce.length <= 6 ? "EP" : "album", lt = fn(ce.length ? `Sign and release this ${de} · ${ce.length} ${ce.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Ne(G), "primary");
      lt.disabled = !ce.length || !!s, H.push(He, I, j), ce.length && H.push(Je(R.songs)), H.push(lt);
    }
    if (s && H.push(we("p", s, "ppp-cyan")), o && !a && H.push(we("p", o, /✓/.test(o) ? "ppp-ok" : "ppp-warn")), Ie(G), (le == null ? void 0 : le.for) === G && le.list.length) {
      H.push(we("p", "Your releases", "ppp-featured__h"));
      for (const ee of le.list) {
        const de = we("div", "", "ppp-release-row"), lt = we("span", "", "ppp-release-row__t"), Le = BigInt(/^\d{1,12}$/.test(ee.price ?? "") ? ee.price : "0"), Pe = Le > 0n ? ` · ${hi(Le)} STX · ${(ee.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (lt.append(we("b", ee.title), we("span", `${Ig(ee)} · added by ${ee.added.toLocaleString()} ${ee.added === 1 ? "player" : "players"}${Pe}`)), de.append(lt, Wn("release-link:" + ee.id, "Copy link", () => It(ee.id), "tiny", e.changed)), n.sales) {
          const _e = fn("Price", () => Ce(ee.id, "price", Le > 0n ? hi(Le) : ""), "tiny");
          _e.setAttribute("aria-expanded", String((ge == null ? void 0 : ge.id) === ee.id && ge.what === "price")), de.append(_e);
        }
        if (n.copies && e.copies) {
          const _e = fn("Send copies", () => Ce(ee.id, "copies"), "tiny");
          _e.setAttribute("aria-expanded", String((ge == null ? void 0 : ge.id) === ee.id && ge.what === "copies")), de.append(_e);
        }
        if (H.push(de), (ge == null ? void 0 : ge.id) !== ee.id) continue;
        const ft = we("div", "", "ppp-release-way");
        if (ge.what === "price" && n.sales) {
          const _e = fn("Sign this price", () => void Te(G, ee), "primary");
          _e.disabled = !!s, ft.append(
            we("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            ue,
            _e
          );
        } else ge.what === "copies" && n.copies && e.copies && ft.append(...e.copies(G, { id: ee.id, title: ee.title }));
        ft.childNodes.length && H.push(ft);
      }
    }
    return H;
  }
  return { sync: Y, albums: b, banner: N, manage: q, fold: Jt, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(R != null && R.songs) && !!e.main()), enabled: () => t === !0 };
}
const Uu = "xtrata.radio.replace.v1", hn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, qs = (e, t, n = "") => {
  const r = hn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Lg = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function kL(e) {
  let n = (() => {
    try {
      const v = JSON.parse(e.store.get(Uu) || "null");
      return v && typeof v.old == "string" ? v : null;
    } catch {
      return null;
    }
  })();
  const r = (v) => {
    n = v, e.store.set(Uu, v ? JSON.stringify(v) : null), e.changed();
  };
  let s = null, o = !1, i = "", a = !1;
  function c(v) {
    o || (s == null ? void 0 : s.for) === v && (s.n !== null || Date.now() - s.at < 3e4) || (o = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(v) + "&limit=1").then(
      (E) => {
        s = { for: v, n: Number.isSafeInteger(E == null ? void 0 : E.total) ? E.total : null, at: Date.now() };
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
    n.removed && v.listening === n.old && (n = { old: n.old }, e.store.set(Uu, JSON.stringify(n)));
    const E = [], L = (X, ae) => E.push(hn("p", `Replacing your old player · step ${X} of 3 · ${ae}`, "ppp-cyan")), P = () => qs("Stop · keep my old player", m, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return m(), null;
      E.push(hn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? E.push(hn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), qs("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && E.push(hn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const X = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return E.push(hn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${X}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), E.push(qs("Done", m, "quiet")), E;
    }
    if (!v.listening || n.removed)
      return n.removed ? (L(3, "claim your new player"), E.push(hn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), E.push(qs("Hide this", m, "quiet")), E) : null;
    if (c(n.old), v.step === "locked" || v.step === "intro")
      return L(1, "empty it"), E.push(hn("p", "Unlock your old player so it can be emptied."), qs("Unlock my old player", e.unlock, "primary"), P()), E;
    const O = e.keepBoth(v), A = (X) => (L(1, "empty it"), E.push(hn("p", X, "ppp-warn")), O && E.push(qs("Keep both players instead", () => {
      m(), O();
    }, "primary")), E.push(P()), E);
    if (v.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((s == null ? void 0 : s.for) !== n.old)
      return L(1, "empty it"), E.push(hn("p", "Checking what this player has…", "ppp-mute"), P()), E;
    if (s.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (s.n > 0) return A(`This player has ${s.n === 1 ? "an album" : `${s.n} albums`} of its own. Replacing it would leave ${s.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((U = v.award) == null ? void 0 : U.state) === "claimed" && v.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((X) => ["prepared", "signed", "unknown", "pending"].includes(String(X.status))))
      return L(1, "empty it"), E.push(hn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), P()), E;
    if (v.balance === void 0)
      return L(1, "empty it"), E.push(hn("p", "Checking what it holds…", "ppp-mute"), P()), E;
    if (v.balance > e.dust(v))
      return L(1, "empty it"), E.push(hn("p", `It holds ${Lg(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? E.push(qs("Send everything back", e.returnAll, "primary")) : E.push(hn("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), E.push(P()), E;
    L(2, "remove it from this device"), E.push(hn("p", v.balance > 0n ? `Empty ✓ (the ${Lg(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), E.push(hn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const M = qs(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (X) => {
        i = /cancel/i.test((X == null ? void 0 : X.message) || "") ? "" : (X == null ? void 0 : X.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return M.disabled = a || !!v.busy, E.push(M, P()), i && E.push(hn("p", i, "ppp-warn")), E;
  }
  return { active: u, claiming: h, start: d, stop: m, lines: w };
}
const $L = [
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
function IL(e) {
  for (const [t, n] of $L) if (n.test(e)) return t;
  return null;
}
const bb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), xb = (e) => /Android/.test(e);
function LL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : bb(t) ? "x-safari-" + n.href : xb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const CL = (e) => bb(e) ? "Safari" : xb(e) ? "Chrome" : "your browser", pi = "Xtrata Music Wallet", TL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Cg(e, t = (n) => n) {
  var o, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((o = e.gate) == null ? void 0 : o.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: pi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = e.standIn === c && TL.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${pi} · ${t(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: pi, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: pi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: pi, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: pi, detail: "Open on this device." });
    }
  return r;
}
const Ou = "xtrata.radio.novice", Sb = "xtrata.radio.novice.previewed.v1", Tg = 6 * 6e4;
function BL(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(Ou, r), n = r;
    else {
      if (r === "0")
        return t.set(Ou, null), { on: !1, preview: !1 };
      n = t.get(Ou);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const ML = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Bg = (e) => ML.test(e ?? ""), NL = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, _L = {
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
}, PL = (e, t) => _L[e] ?? t;
function UL(e, t) {
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
const OL = "Make your player once, with Face ID or your fingerprint, and the music starts.", HL = "Checking your player…", Xd = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function vb(e) {
  try {
    const t = JSON.parse(e.get(Sb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function DL(e, t) {
  const n = vb(e).filter((r) => r !== t);
  n.push(t), e.set(Sb, JSON.stringify(n.slice(-50)));
}
function Hu(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...Xd(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : Xd();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > Tg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > Tg ? { ...e, phase: "done" } : e;
  }
}
const Ic = (e) => e.phase === "open" || e.phase === "playing";
function FL(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const jL = [100, 250, 500, 1e3], RL = (e, t = Br) => BigInt(e) * En(t);
function zL(e, t = Br, n = 0n) {
  const r = ds - e - n;
  return r > 0n ? Number(r / En(t)) : 0;
}
function GL(e, t = Br, n = 0n) {
  const r = e === void 0 ? 0 : zL(e, t, n);
  return jL.map((s) => ({ plays: s, stx: RL(s, t), fits: e !== void 0 && s <= r }));
}
const KL = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, VL = (e) => KL[e.unit](e.amount), Pt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Hc = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function XL(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${Hc(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${Hc(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${Hc(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function YL(e) {
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
    const a = GL(i.balance, i.fee, i.incoming);
    s(a);
    const c = FL(i.switches);
    (w = c.find((v) => v.id === r)) != null && w.on || (r = "stx");
    const u = [], h = Pt("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Pt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${Hc(i.playsLeft, "play", "plays")} left.`));
    const d = XL(i.done);
    if (d && u.push(Pt("p", "ppp-restock__done", d)), i.arriving)
      u.push(Pt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      u.push(Pt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((v) => v.fits))
      u.push(Pt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const v = Pt("div", "ppp-restock__packs");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How many plays");
      for (const P of a) {
        const O = Pt("button", "ppp-restock__pack" + (P.plays === n ? " is-on" : ""));
        O.type = "button", O.disabled = !P.fits, O.setAttribute("aria-pressed", String(P.plays === n)), O.append(Pt("b", "", P.plays.toLocaleString()), Pt("span", "", "plays")), O.onclick = () => {
          n = P.plays, o();
        }, v.append(O);
      }
      u.push(v);
      const E = Pt("div", "ppp-restock__ways");
      E.setAttribute("role", "group"), E.setAttribute("aria-label", "How to pay");
      for (const P of c) {
        const O = Pt("button", "ppp-restock__way" + (P.id === r ? " is-on" : ""));
        O.type = "button", O.disabled = !P.on, O.setAttribute("aria-pressed", String(P.id === r)), O.append(Pt("b", "", P.label), Pt("span", "", P.on ? P.blurb : "Soon")), O.onclick = () => {
          r = P.id, o();
        }, E.append(O);
      }
      u.push(E);
      const L = a.find((P) => P.plays === n);
      if (L && r === "stx") {
        const P = Pt("div", "ppp-restock__pay"), O = VL({ unit: "microSTX", amount: L.stx }), A = Pt("p", "ppp-restock__amount");
        A.append("Send ", Pt("b", "", O), " to your player:"), P.append(A, Pt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const M = Pt("div", "ppp-restock__row");
        M.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => Er(L.stx), "")), P.append(M), P.append(Pt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(P);
      }
    }
    u.push(Pt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const m = Pt("button", "quiet ppp-connect__cancel", "Close");
    m.type = "button", m.onclick = () => t == null ? void 0 : t.close(), u.push(m), t.replaceChildren(...u);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Pt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
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
const hs = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), qL = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function WL(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = t(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: qL(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function ZL(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = hs(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function JL(e, t, n = "", r = 60) {
  const s = hs(t).split(/\s+/).filter(Boolean), o = hs(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = hs(a.artist), u = hs(a.title), h = String(a.id);
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
const ir = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Mg = 12;
function QL(e, t) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const a = ir("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = ir("div", "hint"), u = ir("div", "find-artists"), h = ir("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = ir("div", "likesTools");
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
      const M = ir("button", "", "Try again");
      M.type = "button", M.onclick = () => {
        r = "idle", m();
      }, c.append(M), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const E = ZL(n), L = i ? E : E.slice(0, Mg), P = (M, U, X, ae = "") => {
      const se = ir("button", "find-chip" + (U ? " is-on" : ""), M);
      return se.type = "button", se.setAttribute("aria-pressed", String(U)), ae && (se.title = ae), se.onclick = X, se;
    };
    u.replaceChildren(
      ...L.map((M) => P(`${M.name} · ${M.songs}`, hs(M.name) === hs(o), () => {
        o = hs(M.name) === hs(o) ? "" : M.name, w();
      }, `Show ${M.name}’s ${M.songs === 1 ? "song" : `${M.songs} songs`}`)),
      ...E.length > Mg ? [P(i ? "Fewer artists" : `All ${E.length} artists`, !1, () => {
        i = !i, w();
      })] : []
    );
    const O = JL(n, s, o), A = t.current();
    h.replaceChildren(...O.songs.map((M) => {
      var ae, se;
      const U = ir("li", "lrow" + (M.id === A ? " now" : "")), X = ir("button", "lt", M.title);
      if (X.type = "button", X.title = `Play “${M.title}”${M.artist ? ` by ${M.artist}` : ""}`, X.onclick = () => t.play(M.id), (ae = t.explicit) != null && ae.call(t, M.id)) {
        const Y = ir("span", "exp", "E");
        Y.title = "Explicit lyrics: only plays when you choose it", X.append(" ", Y);
      }
      if ((se = t.liked) != null && se.call(t, M.id)) {
        const Y = ir("span", "find-liked", "♥");
        Y.title = "You like this song", Y.setAttribute("role", "img"), Y.setAttribute("aria-label", "Liked"), U.append(X, Y);
      } else U.append(X);
      return U.append(ir("span", "find-by", `${M.artist ? M.artist + " · " : ""}#${M.id}`)), U;
    })), c.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${E.length.toLocaleString()} artists. Search, or pick an artist.` : O.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : O.total > O.songs.length ? `Showing ${O.songs.length} of ${O.total.toLocaleString()}. Type more to narrow it down.` : `${O.total} ${O.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: m, refresh: w };
}
const Ng = (e, t, n) => lf(ff(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), _g = document.getElementById("ppp");
_g && eC(_g);
function eC(e) {
  var K;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Wb(), s = (l) => e.querySelector(l), o = s(".ppp-frame");
  let i = null;
  const a = async (l, g) => {
    const p = await fetch(l, { cache: "no-store", ...g, signal: AbortSignal.timeout(15e3) }), f = await p.json().catch(() => ({}));
    if (!p.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${p.status}).`);
    return f;
  }, c = L5({
    now: Date.now,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    config: (l) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(l || "")),
    links: async (l) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(l))).links ?? [],
    mainOf: async (l) => {
      var p;
      const g = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(l))).links;
      return ((p = g == null ? void 0 : g.find((f) => f.listening === l)) == null ? void 0 : p.main) ?? null;
    },
    saveLink: async (l) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(l) });
    },
    bridge: async (l) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${l}; publickey-credentials-create ${l}`), i.referrerPolicy = "no-referrer";
      const g = new Promise((V, Z) => {
        i.addEventListener("load", () => V(), { once: !0 }), setTimeout(() => Z(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", o.replaceChildren(i), await g;
      const p = new jb({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), T = (V, Z) => f.has(V) ? p.request(V, Z) : Promise.race([
        p.request(V, Z),
        new Promise((re, ve) => setTimeout(() => ve(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await T("listening.status"), { request: T };
    },
    chain: {
      verify: a5,
      balance: l5,
      account: c5,
      owner: u5,
      broadcast: d5,
      transaction: f5,
      confirmedNonce: async (l) => {
        const g = await ro(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(g == null ? void 0 : g.nonce) || g.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(g.nonce);
      }
    },
    signWithMain: (l, g) => ku({ ...g, network: "mainnet", stxAddress: l }),
    deposit: (l, g, p) => new Promise((f, T) => V0({
      recipient: g,
      amount: p.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new Du(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (V) => f(V.txId || ""),
      onCancel: () => T(new Error("Deposit cancelled. Nothing was sent.")),
      onError: T
    })),
    validate: h5,
    tabLock: (l) => new Promise((g) => {
      const p = navigator.locks;
      if (!(p != null && p.request)) {
        g(!0);
        return;
      }
      p.request("xtrata-ppp:" + l, { ifAvailable: !0 }, async (f) => {
        g(!!f), f && await new Promise(() => {
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
      set: (l, g) => {
        try {
          localStorage.setItem(l, g);
        } catch {
        }
      }
    },
    changed: () => it(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var g, p;
      return v.funder(l, () => b5(l, ro), !!((p = (g = c.snapshot().gate) == null ? void 0 : g.gifts) != null && p.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const g = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), p = g == null ? void 0 : g.gift;
      if (!p) return null;
      if (typeof p.returnTo != "string" || typeof p.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: p.returnTo, from: typeof p.from == "string" ? p.from : null, source: String(p.source ?? ""), amount: String(p.amount ?? "0"), treasury: p.treasury, state: p.state === "sending" ? "sending" : "arrived", player: p.player ?? null };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (l) => {
      const g = await a("/radio/awards/status?address=" + encodeURIComponent(l));
      if (typeof (g == null ? void 0 : g.state) != "string") throw new Error("Unreadable award status.");
      return g;
    },
    awardName: async (l) => {
      const g = await a("/radio/awards/name?address=" + encodeURIComponent(l));
      if ((g == null ? void 0 : g.name) !== null && typeof (g == null ? void 0 : g.name) != "string") throw new Error("Unreadable name.");
      return g.name;
    },
    awardNote: async (l, g) => {
      const p = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: l, name: g }) });
      if (typeof (p == null ? void 0 : p.record) != "string" || typeof (p == null ? void 0 : p.signature) != "string" || !Number.isSafeInteger(p == null ? void 0 : p.cls) || !Number.isSafeInteger(p == null ? void 0 : p.number) || !Number.isSafeInteger(p == null ? void 0 : p.plays)) throw new Error("Unreadable award note.");
      return { cls: p.cls, number: p.number, plays: p.plays, record: p.record, signature: p.signature, name: typeof p.name == "string" ? p.name : null };
    },
    history: (l, g) => v5(l, (p) => ro(p), g),
    likesChanged: () => {
      var l, g;
      (g = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || g.call(l);
    },
    likeState: async (l, g) => {
      const p = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(g) })), f = Array.isArray(p == null ? void 0 : p.rows) ? p.rows.find((T) => (T == null ? void 0 : T.id) === g) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((T) => typeof T == "string") : f.liked ? [l] : [] };
    },
    likeSent: (l, g) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: g } })),
    nameOf: (l) => xe(l) ?? void 0,
    likeConfirmed: (l, g) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: g } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), u = (l, g, p, f, T, V) => new Promise((Z, re) => V0({
    recipient: f,
    amount: T.toString(),
    memo: V,
    stxAddress: p,
    network: new Du(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (ve) => Z(ve.txId || ""),
    onCancel: () => re(new Error(g)),
    onError: re
  })), h = (l) => v.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, d = (l) => h(l) && l.canForget ? () => {
    m.start(l), it(c.snapshot());
  } : null, m = kL({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => me(l),
    changed: () => it(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, g) => {
        try {
          g === null ? localStorage.removeItem(l) : localStorage.setItem(l, g);
        } catch {
        }
      }
    },
    dust: (l) => {
      var g;
      return BigInt(((g = l.gate) == null ? void 0 : g.limits.returnFee) ?? "3000");
    }
  }), w = () => ({ quick: !!v.incomingStarter(), ...m.claiming() ? { another: !0 } : {} }), v = PI({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, g, p, f) => u("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, g, p, f),
    sign: (l, g) => ku({ ...g, network: "mainnet", stxAddress: l }),
    giftSent: (l, g) => c.giftSent(l, g),
    claiming: (l) => c.giftClaiming(l),
    batchDays: () => {
      var l, g;
      return (g = (l = c.snapshot().gate) == null ? void 0 : l.gifts) == null ? void 0 : g.batchDays;
    },
    claimNew: (l) => h(l),
    replaceOld: (l) => d(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, g, p, f) => {
      E.invalidate(), await c.albumArriving(l, g, p, f);
    } },
    who: (l) => me(l),
    changed: () => it(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, g) => {
        try {
          g === null ? localStorage.removeItem(l) : localStorage.setItem(l, g);
        } catch {
        }
      }
    },
    now: Date.now
  }), E = KI({
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
      set: (l, g) => {
        try {
          g === null ? localStorage.removeItem(l) : localStorage.setItem(l, g);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => it(c.snapshot())
  }), L = {
    get: (l) => {
      try {
        return localStorage.getItem(l);
      } catch {
        return null;
      }
    },
    set: (l, g) => {
      try {
        g === null ? localStorage.removeItem(l) : localStorage.setItem(l, g);
      } catch {
      }
    }
  }, P = BL(location.search, L);
  P.on && (document.documentElement.dataset.novice = P.preview ? "preview" : "1");
  const O = (l) => P.on && l.solo, A = P.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), M = A ? document.getElementById("album") : null, U = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, X = M ? kg(M, U) : null, ae = AL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, g) => ku({ ...g, network: "mainnet", stxAddress: l }),
    signShelf: (l, g) => c.signShelf(l, g),
    pay: (l, g, p, f) => u("Xtrata Music · album", "Payment cancelled. Nothing was sent.", l, g, p, f),
    copies: (l, g) => {
      var p;
      return v.copies(l, g, ((p = c.snapshot().gate) == null ? void 0 : p.radioUrl) ?? null);
    },
    player: () => {
      const l = c.snapshot(), g = l.slot === 0 ? l.listening : l.root;
      return { address: g, unlocked: !!g && ["ready", "fund", "over", "link"].includes(l.step) };
    },
    open: (l) => De(l, !0),
    who: (l) => me(l),
    art: { song: (l, g) => g && hh(String(l)) || vg(String(l)), cover: (l) => Oc(l) },
    audition: uL({
      changed: () => it(c.snapshot()),
      quiet: () => {
        var g;
        const l = window.XtrataRadio;
        try {
          (g = l == null ? void 0 : l.getState) != null && g.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => it(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, g) => {
        try {
          g === null ? localStorage.removeItem(l) : localStorage.setItem(l, g);
        } catch {
        }
      }
    },
    now: () => Date.now()
  }), se = () => {
    const l = new Set(Le.map((g) => g.id));
    return [...Le, ...ae.albums().filter((g) => !l.has(g.id))];
  }, Y = M ? gL(M) : null, b = "xtrata.radio.award.later.v1";
  let $ = "ready", N = !1, _ = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(b) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), q = !1;
  const R = "xtrata.radio.tier.v1";
  let ce = (() => {
    const l = L.get(R);
    return Ec(l) ? $o(l) : null;
  })();
  const le = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function He(l) {
    var T;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let V = null;
      try {
        V = l.gift && !l.gift.player && l.gift.drop === "players" ? II(BigInt(l.gift.amount)) : null;
      } catch {
        V = null;
      }
      ((T = l.award) == null ? void 0 : T.state) === "claimed" && l.award.holds === !1 && (V = null), ((V == null ? void 0 : V.id) ?? null) !== ((ce == null ? void 0 : ce.id) ?? null) && (ce = V, L.set(R, V ? V.id : null));
    }
    const g = document.documentElement;
    ce ? g.dataset.tier = ce.id : delete g.dataset.tier;
    const p = document.querySelector("#ppp .ppp-head h3");
    if (!p) return;
    let f = p.querySelector(".ppp-tier");
    if (!ce) {
      f == null || f.remove();
      return;
    }
    f || (f = y("span", "", "ppp-tier"), p.append(f)), f.dataset.tier = ce.id, f.textContent = `${ce.mark} ${ce.name.toUpperCase()} PLAYER`, f.title = `A ${ce.name} player from the Xtrata Music giveaway`;
  }
  const I = P.on && M ? eL(M) : null, j = Date.now();
  let ue = !1, ge = null, Ce = (() => {
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
    it(c.snapshot());
  }, It = (l, g) => {
    var T;
    if (!I || g || Ce) return null;
    if (!l.gate || l.step === "loading" || (ue = !0), !ue) return Date.now() - j < 1e4 ? "checking" : null;
    if (!O(l) || m.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((T = l.gift) != null && T.player) && !l.entries.some((V) => V.kind === "play");
    return l.step === "fund" && f ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (ge === "arriving" || ge === "landed") ? "landed" : l.step === "loading" && ge !== "checking" ? ge : null;
  };
  let Oe = !1;
  function Ie(l, g, p = [], f) {
    if (!I) return;
    const T = f !== void 0 ? f : It(l, g);
    if (ge = T, delete document.documentElement.dataset.noviceBoot, !T) {
      I.render(null, g);
      return;
    }
    const V = [...p];
    T === "arriving" && l.arrival && V.push(Ss(l.arrival)), l.step === "unsupported" ? V.push(y("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && V.push(y("p", l.error, "ppp-warn"));
    const Z = T === "gift" ? v.incomingStarter() : null;
    Z && !Oe && l.step === "intro" && !l.busy && !l.armed && !l.error && !Be && (Oe = !0, c.create({ quick: !0, ...m.claiming() ? { another: !0 } : {} })), I.render({
      mode: T,
      status: V,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !Be,
      plays: Z ? Z.plays : T === "landed" ? l.playsLeft : null,
      from: (Z == null ? void 0 : Z.from) ?? null,
      tier: ce,
      mystery: le,
      albums: T === "landed" ? Le.map((re) => ({ title: re.title, by: re.subtitle, cover: Oc(re.cover), run: () => {
        Te(), De(re, !0);
      } })) : [],
      claimNew: T === "back" ? h(l) : null,
      replaceOld: T === "back" ? d(l) : null,
      start: () => void c.create(w()),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Gt(),
      full: () => {
        var S, B, F;
        const re = window.XtrataRadio, ve = T === "landed" && !((B = (S = re == null ? void 0 : re.getState) == null ? void 0 : S.call(re)) != null && B.playing);
        Te(), ve && ((F = re == null ? void 0 : re.playPause) == null || F.call(re));
      }
    });
  }
  I && setTimeout(() => {
    ue || it(c.snapshot());
  }, 10100), uh(() => {
    (I != null && I.showing() || document.documentElement.dataset.asking || ae.wantsArt()) && it(c.snapshot());
  });
  const en = YL({
    input: () => {
      var T, V, Z, re;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const g = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (T = l.likeFunds) == null ? void 0 : T.balance };
      if (!g.address) return null;
      const p = l.slot === 0 ? l.entries : [], f = p.filter((ve) => ve.kind === "play" && ve.status === "confirmed");
      return {
        playsLeft: g.balance === void 0 ? null : At(g.balance),
        balance: g.balance,
        incoming: 0n,
        fee: BigInt(((V = l.gate) == null ? void 0 : V.limits.playFee) ?? "300"),
        address: g.address,
        switches: ((Z = l.gate) == null ? void 0 : Z.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((ve) => ve.recipient)).size, likes: p.filter((ve) => ve.kind === "like" && ve.status === "confirmed" && ve.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((re = l.likeFunds) != null && re.pending)
      };
    },
    copyButton: (l, g, p, f) => Wn(l, g, p, f, () => {
      it(c.snapshot());
    })
  }), Gt = () => {
    if (!c.snapshot().unproven) {
      en.open();
      return;
    }
    c.prove().then((l) => {
      l && en.open();
    });
  }, Je = document.getElementById("albumList"), Jt = Je ? kg(Je, U, { list: !0 }) : null, wt = "xtrata.radio.album.last.v1", G = () => {
    try {
      const l = JSON.parse(localStorage.getItem(wt) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let H = "";
  const te = (l) => {
    const g = JSON.stringify(l);
    if (g !== H) {
      H = g;
      try {
        localStorage.setItem(wt, g);
      } catch {
      }
    }
  };
  let ee = null;
  window.XtrataRadioLikeHandler = (l) => {
    var p;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (p = c.snapshot().likeFunds) != null && p.album && (Fn = !0), Ct();
    const g = Vt(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: g.title || void 0, artist: g.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let de;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const lt = (l) => {
    var p, f;
    const g = window.XtrataRadioListeningIdentity();
    g !== de && (de = g, (f = (p = window.XtrataRadio) == null ? void 0 : p.refreshLikes) == null || f.call(p));
  };
  let Le = [], Pe = 0, ft = !1, _e = null;
  const Ee = (l) => {
    var g, p;
    ft || !((p = (g = l.gate) == null ? void 0 : g.gifts) != null && p.enabled) || Date.now() - Pe < 6e4 || (Pe = Date.now(), a("/radio/gift/featured").then((f) => {
      Le = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((T) => T && typeof T.id == "string" && typeof T.title == "string" && Array.isArray(T.tracks) && T.tracks.length > 0).slice(0, 6), ft = !0, Le.length && it(c.snapshot());
    }).catch(() => {
    }));
  }, Re = (l) => {
    var g;
    return _e && l.slot === 0 && !((g = l.gift) != null && g.player) && ["ready", "fund", "loading"].includes(l.step) ? _e : null;
  }, De = (l, g = !1) => {
    var f, T;
    _e = l, it(c.snapshot());
    const p = l && g ? Lr(l)[0] : null;
    p && ((T = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || T.call(f, p.id));
  };
  let Se = Xd(), Lt = null;
  const rn = (l) => {
    const g = P.preview && !Be && l.step === "intro" ? v.incomingAlbum() : null;
    return g ? (Se = Hu(Se, { kind: "offer", album: g.player.id, already: vb(L).includes(g.player.id) }), Ic(Se) ? g.player : null) : (Se = Hu(Se, { kind: "withdraw" }), null);
  }, gn = (l) => {
    const g = Se.phase;
    Se = Hu(Se, l), Se.phase !== g && (Se.album && (Se.phase === "playing" || Se.phase === "done") && DL(L, Se.album), it(c.snapshot()));
  };
  setInterval(() => {
    Se.phase === "playing" && gn({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Bn = "", ht, kn = !1, nr = !1;
  const es = (l, g) => {
    var F, Q, be, Fe, Tt, mt, wr, bn;
    const p = window.XtrataRadio;
    if (!(p != null && p.setGiftPlayer) || !(p != null && p.setGiftStop)) return;
    const f = g.depositPending && l.step === "fund" && ((F = l.giftStop) == null ? void 0 : F.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, T = Lt, V = f ? O(l) ? PL(f.reason, f.text) : f.text : null, Z = T ? null : V ?? (t && (!((Q = l.gate) != null && Q.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    Z && Z !== ht && (p.setGiftStop(Z), ht = Z);
    const re = l.step === "off" || l.step === "elsewhere" ? null : ((be = l.gift) == null ? void 0 : be.player) ?? T ?? Re(l) ?? null, ve = re ? re.id + ":" + re.cover + ":" + re.tracks.map((Or) => Or.id).join(",") : "";
    ve !== Bn && (p.setGiftPlayer(re ? { id: re.id, title: re.title, subtitle: re.subtitle, tracks: Lr(re).map((Or) => Or.id), hidden: ((Fe = kI(re)) == null ? void 0 : Fe.id) ?? null, cover: re.cover } : null), Bn = ve), Z !== ht && (p.setGiftStop(Z), ht = Z);
    const S = (f == null ? void 0 : f.reason) === "arriving";
    S !== nr && ((Tt = p.setGiftWait) == null || Tt.call(p, S), nr = S);
    const B = !!re && (!!T || !!((mt = l.albumLock) != null && mt.locked));
    B !== kn && ((wr = p.setGiftLock) == null || wr.call(p, B), kn = B), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((bn = p.forgetWallets) == null || bn.call(p));
  };
  let Fn = !1;
  const Mn = /* @__PURE__ */ new Map(), ln = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let p = Mn.get(l.listening);
    return p === void 0 && (p = Date.now(), Mn.set(l.listening, p)), Date.now() - p < dl ? p : null;
  }, _t = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((g) => g.kind === "play") && !!l.listening && Mn.has(l.listening), Qt = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", At = (l) => {
    const g = c.snapshot().playCost || 350n;
    return l > qt ? Number((l - qt) / g) : 0;
  }, Kt = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), ts = (l) => {
    const g = Math.round((Date.now() - l) / 6e4);
    return g < 1 ? "now" : g < 60 ? `${g}m` : g < 1440 ? `${Math.round(g / 60)}h` : `${Math.round(g / 1440)}d`;
  }, Nn = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, y = (l, g = "", p = "") => {
    const f = document.createElement(l);
    return g && (f.textContent = g), p && (f.className = p), f;
  }, C = (l, g, p = "") => {
    const f = y("button", l, p);
    return f.type = "button", f.onclick = g, f;
  }, z = (l, g) => {
    const p = y("a", l);
    return p.href = g, p.target = "_blank", p.rel = "noopener", p;
  };
  let D = null, J = location.hash === "#give";
  J && history.replaceState(null, "", location.pathname + location.search);
  let ne = !1;
  const ke = dI((l) => uI({ address: l, network: "mainnet" }), () => it(c.snapshot())), xe = (l) => ke.get(l), Be = IL(navigator.userAgent), gt = (l, g) => {
    const p = navigator.userAgent, f = CL(p), T = `${location.origin}${location.pathname}${g ? `#gift=${g}` : ""}`, V = [y("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${P.on ? "player" : "listening wallet"}${g ? P.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], Z = y("div", "", "ppp-open-row"), re = LL(T, p);
    if (re) {
      const ve = y("a", `Open in ${f}`, "primary ppp-open-in");
      ve.href = re, ve.dataset.homeAction = "radio:open-in-browser", Z.append(ve);
    }
    return Z.append(Wn("copy-page-link", "Copy link", () => T, re ? "" : "primary", () => it(c.snapshot()))), V.push(Z, y("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), V;
  }, me = (l) => xe(l) ?? Qt(l), Qe = (l) => l.slice(0, 2).map(me).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), ot = /* @__PURE__ */ new Map();
  let Ze = !1;
  const Ht = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), Ct = () => {
    Ze || (Ze = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const g of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const p = Number(g == null ? void 0 : g.id);
        Number.isSafeInteger(p) && ot.set(p, { title: typeof g.title == "string" ? g.title : void 0, artist: typeof g.artist == "string" ? g.artist : void 0 });
      }
      it(c.snapshot());
    }).catch(() => {
      Ze = !1;
    }));
  }, Vt = (l, g) => {
    const p = ot.get(l), f = ug(l, [p == null ? void 0 : p.title, g == null ? void 0 : g.title].find((V) => !Ht(V)) || ""), T = cg(l, (p == null ? void 0 : p.artist) || (g == null ? void 0 : g.artist) || "");
    return { title: f, artist: T };
  }, nt = (l) => {
    const { title: g, artist: p } = Vt(l.song, l);
    return g ? `“${g}”${p ? ` — ${p}` : ""}` : `Song #${l.song}${p ? ` — ${p}` : ""}`;
  }, Mr = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Nr = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function et(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function yt(l, g, p = "", f) {
    const T = y("dt", l), V = y("dd", g, p);
    return f && V.append(" ", f), [T, V];
  }
  const _n = document.getElementById("ppp-top"), jn = () => {
    (o.hidden || o.classList.contains("ppp-frame--rest") ? e : o).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, fr = () => {
    var g;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (g = document.getElementById("radio-wallet-connect")) == null || g.click();
  }, rr = () => {
    var g, p;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      fr();
      return;
    }
    if (l.step === "elsewhere" && ((g = l.gate) != null && g.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((p = l.giftStop) == null ? void 0 : p.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      Gt();
      return;
    }
    jn();
  };
  _n && (_n.onclick = rr);
  const yn = (l, g, p, f = "") => l.standIn && !l.mainConnected ? C(`Connect ${me(l.standIn)} to add STX`, fr, f) : C(g, p, f), wn = (l) => {
    c.useLinked(l).then(() => jn());
  };
  let hr = null;
  const ms = () => {
    const l = Cg(c.snapshot(), me);
    return l.length ? hr || (hr = new Promise((g) => {
      var B;
      const p = y("dialog", "", "ppp-connect");
      p.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const T = (F) => {
        f = F, p.close();
      };
      p.addEventListener("close", () => {
        p.remove(), hr = null, g(f);
      }), p.addEventListener("click", (F) => {
        F.target === p && T(null);
      });
      const V = (F, Q, be, Fe, Tt = !1) => {
        const mt = y("button", "", "ppp-connect__opt " + be);
        return mt.type = "button", mt.disabled = Tt, mt.onclick = Fe, mt.append(y("b", F), y("span", Q)), mt;
      }, Z = y("h2", "Connect", "ppp-connect__title");
      Z.id = "ppp-connect-title";
      const re = l.map((F) => V(F.label, F.detail, "is-music", () => {
        if (T("music"), F.action === "linked" && F.main) {
          wn(F.main);
          return;
        }
        const Q = Cg(c.snapshot(), me).find((be) => be.action !== "linked");
        (Q == null ? void 0 : Q.action) === "create" ? c.create() : (Q == null ? void 0 : Q.action) === "unlock" && c.unlock(), jn();
      }, !!F.disabled)), ve = V("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => T("stacks")), S = C("Cancel", () => T(null), "quiet ppp-connect__cancel");
      p.append(Z, ...re, ve, S), document.body.appendChild(p), p.showModal(), (B = re.find((F) => !F.disabled)) == null || B.focus();
    }), hr) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = ms;
  function ni(l) {
    if (!_n) return;
    const g = (f, T, V) => {
      _n.hidden = !1, _n.className = "ppp-top" + (T ? " is-" + T : ""), _n.replaceChildren(y("span", "", "dot"), document.createTextNode(f)), _n.title = V;
    }, p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        _n.hidden = !0;
        return;
      case "elsewhere":
        return g("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        _n.hidden = !0;
        return;
      case "intro":
        return g("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return g(`Connect ${me(l.linked)}`, "warn", `This device's listening wallet belongs to ${me(l.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return g("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return g("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return l.depositPending ? g("Plays on their way", "quiet", "Plays start by themselves when they land") : g(l.entries.some((f) => f.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return g("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return g("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return l.payingOn && p > 0 && !l.giftStop ? g(`${p.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : g("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const tn = document.getElementById("pppNudge"), ao = document.getElementById("onair");
  (K = tn == null ? void 0 : tn.querySelector("button")) == null || K.addEventListener("click", () => rr());
  const co = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Yi = {
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
  function Rn(l) {
    if (l.step === "loading") return;
    const g = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, p = l.step === "ready" && l.payingOn && g > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, T = l.step === "elsewhere" && !t, V = p || f || T ? "" : co[l.step] ?? "", Z = p ? "on" : T ? "free" : V ? "off" : "";
    Z ? document.documentElement.dataset.ppp = Z : delete document.documentElement.dataset.ppp, ao && (ao.hidden = !Z || Z === "free", ao.querySelector(".onair-sub").textContent = p ? `${g.toLocaleString()} plays left` : "Plays off"), tn && (tn.hidden = Z !== "off" && Z !== "free", tn.classList.toggle("is-free", Z === "free"), Z === "free" ? (tn.querySelector(".nudge-t").textContent = "You’re on the free player", tn.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", tn.querySelector("button").textContent = "Get a player") : Z === "off" && (tn.querySelector(".nudge-t").textContent = V, tn.querySelector(".nudge-s").textContent = O(l) ? l.step === "intro" ? OL : "" : "This radio requires a funded listening wallet with music support on.", tn.querySelector("button").textContent = Yi[l.step] ?? "Start"));
  }
  let lo = "";
  function bs(l) {
    const g = y("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && g.append(y("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && g.append(y("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const p = y("input");
    p.type = "text", p.placeholder = "SP… address to send returns to", p.autocomplete = "off", p.spellcheck = !1, p.setAttribute("aria-label", "Address to return funds to"), p.value = lo, p.oninput = () => {
      lo = p.value;
    };
    const f = C(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(p.value), lo = "";
    }, "tiny");
    return g.append(p, " ", f), l.returnToKind === "chosen" && g.append(" ", C("Back to the funder", () => c.clearReturnAddress(), "tiny")), g;
  }
  const qi = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function uo() {
    const l = y("p", qi + " ", "ppp-mute");
    return l.append(z("Xverse", "https://www.xverse.app/download"), " · ", z("Leather", "https://leather.io/install-extension")), l;
  }
  let _r = "";
  const ns = (l) => {
    const g = document.documentElement, p = l.solo && !l.main ? l.listening ? Qt(l.listening) : "new" : "", f = N5() ? "1" : "", T = l.standIn && !l.mainConnected ? me(l.standIn) : "";
    `${p}|${f}|${T}` !== _r && (_r = `${p}|${f}|${T}`, p ? g.dataset.pppSolo = p : delete g.dataset.pppSolo, T ? g.dataset.pppAs = T : delete g.dataset.pppAs, f ? g.dataset.pppWalletInstalled = f : delete g.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => it(c.snapshot()), l);
  function xs(l, g = "") {
    const p = y("div", "", "ppp-topup"), f = fo(l);
    p.append(y("span", "Add plays from My player: ", "ppp-mute"));
    for (const T of Uc) {
      const V = C(`+${T.toLocaleString()}`, () => void c.topUpAlbum(T), g);
      V.disabled = f === void 0 || f < T || l.depositPending || !!l.busy, p.append(V);
    }
    return f !== void 0 && f < Uc[0] && p.append(y("p", "My player needs plays first (switch to My player above).", "ppp-mute")), p;
  }
  const fo = (l) => {
    var f;
    const g = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (g === void 0 || !l.playCost) return;
    const p = g - qt - 6000n;
    return p > 0n ? Number(p / l.playCost) : 0;
  };
  function ho(l) {
    const g = l.likeFunds;
    if (!g || !g.album || !g.low && !g.pending) return [];
    if (g.low || (Fn = !1), g.low && !Fn) return [];
    const p = y("div", "", "ppp-pick ppp-lowbox");
    if (!g.low) {
      if (!g.txid) return [];
      const T = y("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return g.txid && T.append(z("View", Nn(g.txid))), p.append(T), [p];
    }
    p.append(y("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), p.append(y("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), p.append(y("p", g.address, "ppp-addr-full"));
    const f = y("div", "", "ppp-open-row");
    if (f.append(Wn("copy-likes-address", "Copy address", () => g.address, "primary", () => it(c.snapshot()))), g.main && !l.solo) {
      const T = ds - (g.balance ?? 0n);
      T > 0n && f.append(yn(l, `Pay ${Er(T)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return p.append(f), p.append(y("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [p];
  }
  const Ss = (l) => {
    const g = y("div", "", "ppp-wait");
    g.dataset.since = String(l.since), g.dataset.grace = String(l.graceMs), g.setAttribute("role", "progressbar"), g.setAttribute("aria-label", "Your plays are arriving");
    const p = y("p", "", "ppp-wait-t"), f = y("div", "", "ppp-wait-track");
    return f.append(y("div", "", "ppp-wait-fill")), g.append(p, f), vs(g), g;
  };
  function vs(l) {
    const g = Number(l.dataset.since), p = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - g), T = l.querySelector(".ppp-wait-fill"), V = l.querySelector(".ppp-wait-t");
    if (f < p) {
      const Z = Math.ceil((p - f) / 1e3);
      T.style.width = Math.max(4, Math.min(95, f / p * 100)).toFixed(0) + "%", V.textContent = `Your plays are arriving… usually about a minute · ${Z}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / p * 100)));
    } else
      T.style.width = "", V.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let po = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      po = 0;
      return;
    }
    l.forEach(vs), ++po % 10 === 0 && it(c.snapshot());
  }, 1e3);
  let Pr = null;
  function Wi(l) {
    if (l.step === "loading" && Pr !== null) return;
    const p = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    p !== Pr && (Pr = p, p ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function it(l) {
    var Sh, vh, Eh, Ah, kh, $h, Ih, Lh, Ch, Th, Bh, Mh, Nh, _h, Ph, Uh, Oh, Hh;
    if (ae.sync(), ee && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const W = ee;
      ee = null, l.root === W.root && l.slot !== W.slot && c.openAlbum(W.slot);
    }
    const g = v.inProgress(l), p = ln(l), f = g && l.step === "fund" ? { ...l, depositPending: !0 } : p !== null ? { ...l, depositPending: !0, arrival: { since: p, graceMs: dl } } : l, T = f.error === fl;
    if (lt(), Ee(l), He(l), Lt = rn(l), es(l, f), Wi(f), ns(f), !g && v.inProgress(l)) return;
    if (ni(f), Rn(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? P.on ? HL : "Checking your listening wallet…" : P.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      Ie(f, !1);
      return;
    }
    const [V, Z] = et(f), re = s(".ppp-state");
    re.textContent = V, re.className = "ppp-state" + (Z ? " ppp-state--" + Z : ""), re.hidden = !V;
    const ve = !!f.busy || f.armed, S = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (ve || !["intro", "loading"].includes(f.step));
    o.hidden = !S, o.classList.toggle("ppp-frame--rest", !ve && !ne);
    const B = s(".ppp-frame-label");
    B.hidden = !0;
    const F = C5(f) ?? D;
    D = F;
    const Q = "xtrata.radio.ppp.heard.v1", be = (() => {
      try {
        return localStorage.getItem(Q) === "1";
      } catch {
        return !1;
      }
    })();
    if (!be && f.entries.some((W) => W.kind === "play"))
      try {
        localStorage.setItem(Q, "1");
      } catch {
      }
    const Fe = be || f.slot > 0 && ((((Sh = f.likeFunds) == null ? void 0 : Sh.balance) ?? 0n) > 0n || E.count() > 1), Tt = O(f), mt = !Tt && B5({ ...f, heard: Fe }, F);
    s(".ppp-badge").hidden = !mt;
    const wr = s(".ppp-steps"), bn = s(".ppp-stage");
    wr.hidden = bn.hidden = !mt, F && mt && (wr.replaceChildren(...zd(f.solo).map((W, fe) => {
      const Ue = y("li", "", fe < F.at ? "done" : fe === F.at ? F.blocked ? "now blocked" : "now" : "");
      return Ue.append(y("span", fe < F.at ? "✓" : String(fe + 1), "n"), W), fe === F.at && Ue.setAttribute("aria-current", "step"), Ue;
    })), bn.textContent = F.caption, bn.className = "ppp-stage " + (F.at >= zd(f.solo).length ? "ppp-ok" : F.blocked ? "ppp-bad" : "ppp-cyan"));
    const Or = s(".ppp-facts"), Pn = [];
    f.main && ((vh = f.gate) != null && vh.here) && !f.solo && Pn.push(...yt("Your wallet", me(f.main), "ppp-addr-short"));
    const Ji = () => {
      if (!f.listening) return;
      const W = Wn("copy-listening", "Copy", () => f.listening || "", "tiny", () => it(c.snapshot()));
      Pn.push(...yt(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", Qt(f.listening), "ppp-addr-short", W));
    };
    if (f.linked || Ji(), f.listening && f.step !== "intro")
      if (f.linked)
        Pn.push(...yt("Credited to", `${me(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Ji();
      else if (f.solo) {
        f.creditedTo && Pn.push(...yt("Credited to", `${me(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const W = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${me(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Pn.push(...yt("Returns go to", f.gift ? W : f.returnTo && !xe(f.returnTo) ? W.replace(Qt(f.returnTo), f.returnTo) : W, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Pn.push(...yt("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Eh = f.gate) != null && Eh.here)) {
      const W = f.linkedListening.map((fe) => Qt(fe) + (fe === f.listening ? " (this one)" : "")).join(", ");
      Pn.push(...yt(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", W, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const W = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Pn.push(...yt("Balance", `${Er(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, W));
    }
    const ss = f.entries.find((W) => W.kind === "play");
    ss && Ct(), ss && Pn.push(...yt("Last paid song", `${nt(ss)} → ${me(ss.recipient)}`, Mr[ss.status] || "")), Or.replaceChildren(...Pn), Or.hidden = !Pn.length;
    const $e = [], bt = [], kt = [], zn = [], ph = En(BigInt(((Ah = f.gate) == null ? void 0 : Ah.limits.playFee) ?? "300")), gh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${Er(ll)} STX to the song holder, plus a ${Er(ph - ll)} STX network fee.`, yh = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if ($e.push(y("p", "Pay artists as you listen.")), (kh = f.gate) != null && kh.radioUrl) {
          const fe = y("p");
          fe.append(z("Open the pay-per-play radio →", f.gate.radioUrl)), $e.push(fe);
        }
        bt.push(y("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const fe = [f.linked, ...f.others];
          $e.push(y("p", fe.length > 1 ? `This device has listening wallets for ${Qe(fe)}.` : `This device has a listening wallet for ${me(f.linked)}.`)), bt.push(y("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), fe.slice(0, 3).forEach((Ue, at) => kt.push(C(`Open ${me(Ue)}`, () => wn(Ue), at === 0 ? "primary" : "")));
        } else
          $e.push(y("p", "Connect your wallet to pay artists as you listen.")), bt.push(y("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        $e.push(y("p", `This device's listening wallet belongs to ${me(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), bt.push(y("p", `You are connected as ${me(f.main)}. Switch to the linked wallet to continue listening.`)), bt.push(y("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), kt.push(C("Switch wallet", fr, "primary"));
        break;
      case "not-invited":
        $e.push(y("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        $e.push(y("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        $e.push(y("p", "Every play counts for the song’s owner, on-chain.")), bt.push(y("p", gh)), bt.push(y("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), bt.push(y("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? ($e.push(y("p", `This device already has a listening wallet for ${Qe(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), bt.push(y("p", `Otherwise, set up a new listening wallet for ${me(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && bt.push(y("p", `This is the listening wallet for ${me(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && bt.push(y("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const W = v.liveGift();
        kt.push(C(W ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${me(f.main)}` : "Start listening", () => void c.create(m.claiming() ? { another: !0 } : void 0), "primary")), !W && !f.solo && f.main && f.others.length && kt.push(C("Switch wallet", fr)), !W && f.solo && kt.push(C("I have a Stacks wallet", fr)), kt.push(C("I already have a listening wallet", () => void c.unlock(!0))), W && kt.push(C("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || ($e.push(y("p", "Locked.", "ppp-mute")), kt.push(C("Unlock", () => void c.unlock(), "primary"))), f.standIn ? zn.push(C("Use a different listening wallet", () => void ms().then((fe) => {
          fe === "stacks" && fr();
        }), "quiet")) : zn.push(C("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        $e.push(y("p", `Link to ${me(f.main)} · free`)), bt.push(y("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), bt.push(y("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), kt.push(C(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        $e.push(y("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && $e.push(Ss(f.arrival)) : _t(f) ? $e.push(y("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : ($h = f.gift) != null && $h.player ? $e.push(y("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? $e.push(y("p", "No plays left · add plays to keep counting", "ppp-bad")) : $e.push(y("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / ph)).toLocaleString()} plays`)), f.entries.length && bt.push(y("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && bt.push(y("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), g ? bt.push(y("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? bt.push(y("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (bt.push(y("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), bt.push(y("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && kt.push(Wn("copy-address", "Copy my address", () => f.listening || "", "primary", () => it(c.snapshot())))) : bt.push(y("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const fe = y("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          fe.append(z("View", Nn(f.depositTxid))), $e.push(fe);
        } else f.allowance > 0n && !f.solo && !f.depositPending && kt.push(yn(f, `Deposit ${Er(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        $e.push(y("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && ($e.push(y("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), kt.push(C("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && ($e.push(y("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), $e.push(bs(f))), (!f.solo || f.returnTo) && kt.push(C("Return excess", () => void c.returnFunds("excess"), "primary"), C("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((Ih = f.giftStop) == null ? void 0 : Ih.reason) !== "off") {
          const fe = Math.min(f.session.playsLeft, f.playsLeft);
          $e.push(y("p", `${fe.toLocaleString()} plays left`, "ppp-ok")), bt.push(y("p", gh + " The heart likes or unlikes from this wallet for 0.0003 STX.")), kt.push(C("Switch off", () => void c.switchOff()));
        } else
          $e.push(y("p", "Switch on music support to listen.", "ppp-mute")), kt.push(C("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && $e.push(y("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && $e.push(y("p", "Running low on plays", "ppp-warn")), f.aboveTarget && $e.push(y("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? $e.push(y("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && kt.push(yn(f, `Top up ${Er(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const W = f.step === "fund", fe = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      W ? kt.unshift(C("Add plays", () => Gt(), "primary")) : fe ? kt.push(C("Add plays", () => Gt(), "primary")) : f.step === "ready" && zn.push(C("Add plays", () => Gt(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && bt.push(y("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && bt.push(bs(f)), bt.push(uo()), f.slot === 0 && f.step === "ready" && f.entries.some((W) => W.kind === "play" && W.status === "confirmed"))) {
      const W = y("p", "New to Stacks? ", "ppp-mute");
      W.append(z("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), $e.push(W);
    }
    if (f.walletOutdated && bt.push(y("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && ($e.push(y("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), kt.push(C("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && zn.push(C(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${me(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((Lh = f.gift) != null && Lh.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && zn.push(xs(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && zn.push(C(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && zn.push(C("Lock", () => void c.lock(), "quiet")), S && !ve && zn.push(C(ne ? "Hide listening wallet box" : "Show listening wallet box", () => {
      ne = !ne, it(c.snapshot());
    }, "quiet")), [...kt, ...zn].forEach((W) => W.disabled = yh), yh && (kt.length = 0), !Tt && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((Ch = f.gift) != null && Ch.player)) {
      const W = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", fe = $e.at(0);
      f.step === "ready" && fe ? fe.append(y("span", ` · ${Kt(f.balance)} STX`, W)) : $e.push(y("p", `Balance ${Kt(f.balance)} STX`, W));
    }
    if (Tt) {
      for (const Ue of [...kt, ...zn]) {
        const at = NL[Ue.textContent ?? ""];
        at && (Ue.textContent = at);
      }
      for (let Ue = $e.length - 1; Ue >= 0; Ue--) Bg($e[Ue].textContent) && bt.unshift(...$e.splice(Ue, 1));
      for (let Ue = kt.length - 1; Ue >= 0; Ue--) Bg(kt[Ue].textContent) && zn.unshift(...kt.splice(Ue, 1));
      const W = f.entries.some((Ue) => Ue.kind === "play"), fe = UL(f.step, { played: W, arriving: f.depositPending });
      fe.length && $e.length && fe.shift(), $e.push(...fe.map((Ue) => y("p", Ue, "ppp-mute")));
    }
    if ((Th = f.gift) != null && Th.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const W = y("p", "", "ppp-gift");
      W.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && W.append(" · ", f.gift.player.subtitle);
      const fe = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? y("span", " · plays on their way", "ppp-warn") : y("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      fe && W.append(fe);
      const Ue = (Bh = $e.at(0)) == null ? void 0 : Bh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Ue && /STX/.test(Ue.textContent ?? "") && Ue.remove(), $e.unshift(W), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          $e.splice(1, 0, y("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), xs(f, "primary"));
        else {
          const at = y("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          at.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), at.append(z("Xverse", "https://www.xverse.app/download"), " and ", z("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), $e.splice(1, 0, at);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const W = f.returnPlan, fe = y("div", "", "ppp-pick");
      fe.append(y("p", W.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Ue = y("ul", "", "ppp-gift-list");
      W.steps.forEach((at, mr) => {
        const Gn = at.kind === "gift" ? "the unused gift" : at.kind === "deposit" ? "what was added to it" : "the rest", un = y("li");
        un.append(y("span", `${mr + 1}. ${Er(BigInt(at.send))} STX · ${Gn}`, "t"), y("span", at.to ? ` → ${me(at.to)}` : " → choose an address below", at.to ? "ppp-mute" : "ppp-warn")), Ue.append(un);
      }), fe.append(Ue), W.kept && fe.append(y("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), W.steps.some((at) => !at.to) && fe.append(bs(f)), fe.append(C(W.steps.length > 1 ? `Confirm part 1 of ${W.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), $e.push(fe);
    }
    const ks = Ur(f), os = A ? ks : null, si = It(f, !!os), Ab = si === "gift" || si === "arriving" || si === "new", Vl = os ? null : m.lines(l), Xl = Vl && !m.claiming() ? Vl : [...Vl ?? [], ...v.banner(l, { bare: !!os || si === "gift" || si === "arriving" })], Ra = Be && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? gt(Be, v.pendingCode()) : [];
    os || ($e.unshift(...Xl), $e.push(...ho(f)), $e.unshift(...Ra)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && $e.unshift(y("p", `This is ${me(f.creditedTo)}'s listening wallet. Plays and likes count for ${me(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...$e);
    const Yl = document.querySelector(".ppp-switch");
    if (Yl) {
      const W = E.latest(), fe = f.slot > 0, Ue = ["fund", "ready", "over"].includes(f.step) && (fe || !!W);
      if (Yl.hidden = !Ue, Ue) {
        const at = (un, Ka, Va, eu) => {
          const ii = C("", eu, "ppp-tab");
          return ii.setAttribute("aria-pressed", String(Va)), ii.append(y("span", un, "tt"), y("span", Ka === void 0 ? "…" : `${At(Ka).toLocaleString()} plays`, "ts")), ii.disabled = !!f.busy, ii;
        }, mr = fe ? ((Nh = (Mh = f.gift) == null ? void 0 : Mh.player) == null ? void 0 : Nh.title) ?? "Album" : W.title, Gn = C("View all albums" + (E.count() > 1 ? ` (${E.count()})` : ""), () => {
          const un = document.querySelector(".ppp-shelf");
          un && (un.hidden = !1, un.open = !un.open, Gn.setAttribute("aria-expanded", String(un.open)), un.open && requestAnimationFrame(() => un.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Gn.setAttribute("aria-expanded", String(!!((_h = document.querySelector(".ppp-shelf")) != null && _h.open))), Yl.replaceChildren(
          at("🎧 My player", fe ? (Ph = f.likeFunds) == null ? void 0 : Ph.balance : f.balance, !fe, () => {
            fe && c.openAlbum(0);
          }),
          at("💿 " + mr, fe ? f.balance : void 0, fe, () => {
            !fe && W && c.openAlbum(W.slot);
          }),
          Gn
        );
      }
    }
    const za = E.render(f), Ga = document.querySelector(".ppp-shelf");
    if (Ga) {
      Ga.hidden = !za;
      const W = Ga.querySelector("summary");
      W && (W.textContent = E.count() > 0 ? `♪ My albums (${E.count()})` : "♪ My albums");
      const fe = Ga.querySelector(".ppp-shelf-body");
      za && fe && !fe.contains(za) && fe.replaceChildren(za);
    }
    const Qi = v.renderFold(l);
    if (s(".ppp-gifts").hidden = !Qi, Qi && !s(".ppp-gift-body").contains(Qi) && s(".ppp-gift-body").replaceChildren(Qi), Qi && J) {
      J = !1;
      const W = s(".ppp-gifts");
      W.open = !0, requestAnimationFrame(() => W.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const ql = document.querySelector("#ppp .ppp-featured");
    if (ql) {
      const W = se(), fe = ae.manage(), Ue = (W.length > 0 || !!fe) && f.slot === 0 && !((Uh = f.gift) != null && Uh.player) && f.step === "ready";
      ql.hidden = !Ue, Ue && ql.replaceChildren(...W.length ? [y("p", "Albums in your player", "ppp-featured__h")] : [], ...W.map((at) => {
        const mr = (_e == null ? void 0 : _e.id) === at.id, Gn = C("", () => De(mr ? null : at, !mr), "ppp-featured__a" + (mr ? " is-on" : "")), un = Lr(at).length;
        return Gn.append(y("b", at.title), y("span", mr ? "Playing now · tap to go back to the radio" : `${at.subtitle ? at.subtitle + " · " : ""}${un} ${un === 1 ? "song" : "songs"}`)), Gn.setAttribute("aria-pressed", String(mr)), Gn.disabled = !!f.busy, Gn;
      }), ...fe ? [fe] : []);
    }
    const Wl = document.querySelector("#ppp .ppp-release-in-slot");
    if (Wl) {
      const W = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : ae.banner();
      Wl.hidden = !W.length, Wl.replaceChildren(...W);
    }
    const oi = document.querySelector("#ppp .ppp-release");
    if (oi) {
      const W = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : ae.fold();
      if (oi.hidden = !W, W) {
        const fe = document.activeElement instanceof HTMLElement && oi.contains(document.activeElement) ? document.activeElement : null, Ue = ((Oh = oi.querySelector(".ppp-release-songs")) == null ? void 0 : Oh.scrollTop) ?? 0;
        (Hh = oi.querySelector(".ppp-release-body")) == null || Hh.replaceChildren(...W);
        const at = oi.querySelector(".ppp-release-songs");
        at && Ue && (at.scrollTop = Ue), fe && fe.isConnected && document.activeElement !== fe && fe.focus({ preventScroll: !0 });
      }
    }
    Zi(f);
    const Zl = document.querySelector("#ppp .ppp-yours");
    if (Zl) {
      const W = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      Zl.hidden = !W;
      const fe = Zl.querySelector(".ppp-yours-body");
      if (W && fe && fe.getAttribute("data-for") !== f.listening) {
        fe.setAttribute("data-for", f.listening);
        const Ue = (eu, ...ii) => {
          const Dh = y("details", "", "ppp-yours-item");
          return Dh.append(y("summary", eu), ...ii), Dh;
        }, at = y("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        at.append(y("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const mr = y("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), Gn = y("p");
        Gn.append(z("Find a name at BNS One →", "https://bns.one"));
        const un = y("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ka = y("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Va = y("p");
        Va.append(z("See the giveaway →", "https://xtrata.xyz/giveaway")), fe.replaceChildren(
          Ue("Give your player a name", at, mr, y("p", f.listening, "ppp-addr-full"), Wn("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => it(c.snapshot())), Gn),
          Ue("Link it to a wallet you already have", un),
          Ue("Bring a friend in", Ka, Va)
        );
      }
    }
    s(".ppp-body").replaceChildren(...bt), s(".ppp-actions").replaceChildren(...kt), s(".ppp-actions2").replaceChildren(...zn);
    const Jl = f.busy || f.message || "", wh = s(".ppp-msg"), Ql = Jl && $e.some((W) => (W.textContent ?? "").startsWith(Jl.replace(/[.✓\s]+$/, ""))) ? "" : Jl, mh = !Ql && !f.error ? f.notice : T && !Ql ? f.error : "";
    wh.textContent = Ql || mh, wh.classList.toggle("is-warn", !!mh), s(".ppp-err").textContent = T ? "" : f.error;
    const kb = f.entries.filter((W) => W.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...kb.slice(0, 5).map((W) => {
      const fe = y("li"), Ue = W.status === "confirmed" ? "ok" : W.status === "failed" ? "bad" : "warn";
      return fe.append(y("span", "", "d " + Ue), y("span", nt(W), "t"), y("span", ts(W.created), "ppp-mute")), W.txid && fe.append(z("tx", Nn(W.txid))), fe;
    })), s(".ppp-wallets").hidden = !(Or.childElementCount || zn.length), s(".ppp-more").hidden = !bt.length;
    const bh = s(".ppp-history");
    bh.hidden = !f.entries.length, f.entries.length && Ct(), bh.replaceChildren(y("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((W) => {
      const fe = y("div", "", "ppp-row"), Ue = W.kind === "play" ? [y("span", nt(W), "ppp-song"), y("span", ` · ${Er(BigInt(W.amount))} STX to ${me(W.recipient)}`, "ppp-mute")] : W.kind === "like" ? [y("span", `${W.liked ? "♥ Liked" : "Unliked"} ${nt(W)}`, "ppp-song"), y("span", ` · for ${f.linked ? me(f.linked) : "this listening wallet"}`, "ppp-mute")] : [y("span", `Returned ${Er(BigInt(W.amount))} STX`, "ppp-song"), y("span", ` to ${me(W.recipient)}`, "ppp-mute")];
      return fe.append(
        y("span", Nr[W.status] || W.status, "ppp-status " + (Mr[W.status] || "")),
        ...Ue,
        y("span", ` · ${new Date(W.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), W.txid && fe.append(z("tx ↗", Nn(W.txid))), fe;
    })), X == null || X.render(os ? rs(f, os, [...Ra, ...Xl]) : null), Ie(f, !!os, Ab ? [...Ra, ...Xl] : Ra, si), gr(f, !!os || !!(I != null && I.showing())), Es(f, os), en.isOpen() && en.refresh(), As();
    const xh = (ks == null ? void 0 : ks.mode) === "open" ? null : Re(f);
    Jt == null || Jt.render((ks == null ? void 0 : ks.mode) === "open" ? rs(f, ks, []) : xh ? { ...rs(f, { mode: "open", player: xh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function Ur(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && te({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const g = v.incomingAlbum();
    if (g) return { mode: "arrive", player: g.player, from: g.from, offered: g.plays };
    const p = G();
    return p && (l.step === "locked" || ee && l.step === "loading") ? { mode: "locked", player: p.player } : null;
  }
  const pr = (l, g, p, f, T) => `/awards/${l.id}#${new URLSearchParams({ n: String(g), a: p, ...T ? { b: T } : {}, p: String(f), s: Ng(Q0, g, p) })}`;
  function Dt(l) {
    const g = l.award;
    return !g || !["ready", "fund", "over", "link"].includes(l.step) ? null : g.claimTx ? N ? "making" : null : g.state === "claimed" ? N && g.inscription !== void 0 ? "yours" : null : g.state !== "ready" || _ || l.step === "link" && $ !== "have" ? null : $ === "making" || $ === "yours" ? "ready" : $;
  }
  function gr(l, g) {
    if (!Y) return;
    const p = l.award, f = p != null && p.cls && Ec(p.cls) ? $o(p.cls) : null, T = l.slot === 0 ? l.listening : l.root, V = g || !p || !f || !T || p.number === void 0 ? null : Dt(l);
    if (!V || !p || !f || !T) {
      Y.render(null, g);
      return;
    }
    V === "have" && l.linked && !q && (q = !0, c.awardRefresh());
    const Z = typeof p.name == "string" && p.name ? p.name : null, re = [];
    l.error && re.push(y("p", l.error, "ppp-warn"));
    const ve = (S) => {
      $ = S, S === "name" && (N = !0), it(c.snapshot());
    };
    Y.render({
      screen: V,
      tier: f,
      number: p.number,
      need: p.need ?? 0,
      player: T,
      name: p.name,
      inscription: p.inscription,
      art: V === "yours" && p.inscription !== void 0 ? `/i/${p.inscription}` : pr(f, p.number, T, p.need ?? 0, Z),
      claimLink: p.claimTx ? Nn(p.claimTx) : void 0,
      status: re,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? me(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => Wn("award-player-address", "Copy my player’s address", () => T, "tiny", () => it(c.snapshot())),
      go: ve,
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
        it(c.snapshot());
      },
      done: () => {
        N = !1, $ = "ready", it(c.snapshot());
      }
    }, g);
  }
  function Zi(l) {
    var F;
    const g = document.querySelector("#ppp .ppp-award");
    if (!g) return;
    const p = l.award, f = l.slot === 0 ? l.listening : l.root, T = p != null && p.cls && Ec(p.cls) ? $o(p.cls) : null, V = !!p && !!T && !!f && ["ready", "fund", "over"].includes(l.step) && !(p.state === "unavailable" && p.number === void 0);
    if (g.hidden = !V, !V || !p || !T || !f) {
      g.replaceChildren();
      return;
    }
    const Z = JSON.stringify([p, f, !!l.busy]);
    if (g.getAttribute("data-sig") === Z) return;
    g.setAttribute("data-sig", Z);
    const re = (Q) => {
      const be = y("p", "", "ppp-award__h");
      return be.append(y("b", `${T.mark} Music Hero award`), y("span", Q)), be;
    }, ve = `No. ${String(p.number ?? 0).padStart(4, "0")}`, S = (Q) => {
      const be = y("div", "", "ppp-award__art"), Fe = document.createElement("iframe");
      return Fe.src = Q, Fe.title = `${T.name} record`, Fe.setAttribute("sandbox", "allow-scripts"), Fe.setAttribute("loading", "lazy"), be.append(Fe), be;
    }, B = [];
    if (p.state === "claimed") {
      if (B.push(re(`${T.name} record · ${ve}`)), p.inscription !== void 0 && B.push(S(`/i/${p.inscription}`)), B.push(y("p", p.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : p.holds === null || p.holds === void 0 ? `Yours: Xtrata inscription #${p.inscription}.` : `Yours for good: Xtrata inscription #${p.inscription}. It gives your player its ${T.name} colours.`, p.holds === !1 ? "ppp-mute" : "ppp-ok")), p.inscription !== void 0) {
        const Q = y("p");
        Q.append(z("Open it full screen ↗", `/i/${p.inscription}`)), B.push(Q);
      }
      if (p.sendTx) {
        const Q = y("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        Q.append(z("View", Nn(p.sendTx))), B.push(Q);
      } else if (p.holds === !0 && p.inscription !== void 0) {
        const Q = y("details", "", "ppp-award__send"), be = document.createElement("input");
        be.type = "text", be.placeholder = "SP… address to send it to", be.autocomplete = "off", be.spellcheck = !1, be.setAttribute("aria-label", "Address to send your record to");
        const Fe = C("Send my record…", () => void c.sendAward(be.value), "");
        Fe.disabled = !!l.busy, Q.append(
          y("summary", "Send this record to someone"),
          y("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          be,
          Fe
        ), B.push(Q);
      }
    } else if (p.claimTx) {
      B.push(re(`${T.name} record · ${ve}`));
      const Q = y("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      Q.append(z("View", Nn(p.claimTx))), B.push(Q);
    } else if (p.state === "ready") {
      B.push(re(`${T.name} record · ${ve}`));
      const Q = typeof p.name == "string" && p.name ? p.name : null, be = new URLSearchParams({ n: String(p.number), a: f, ...Q ? { b: Q } : {}, p: String(p.need), s: Ng(Q0, p.number, f) });
      B.push(S(`/awards/${T.id}#${be}`)), B.push(y("p", `Your ${T.name} record is ready. You have paid artists for ${(F = p.need) == null ? void 0 : F.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const Fe = y("div", "", "ppp-award__row");
      Q ? (B.push(y("p", `Its plaque will carry ${Q} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), Fe.append(C("Claim my record", () => {
        N = !0, c.claimAward("auto");
      }, "primary"), C("Use my address only", () => {
        N = !0, c.claimAward("none");
      }, "quiet"))) : p.name === null ? (B.push(y("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), Fe.append(C("Claim my record", () => {
        N = !0, c.claimAward("none");
      }, "primary"), C("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (B.push(y("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), Fe.append(C("Check for a name again", () => void c.awardRefresh(), "primary"), C("Claim with my address only", () => void c.claimAward("none"), "quiet"))), Fe.querySelectorAll("button").forEach((Tt) => {
        Tt.disabled = !!l.busy;
      }), B.push(Fe, y("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (p.state === "earning" && p.have !== void 0 && p.need) {
      B.push(re(`${p.have.toLocaleString()} of ${p.need.toLocaleString()} paid plays`));
      const Q = y("div", "", "ppp-award__bar"), be = document.createElement("i");
      be.style.width = `${Math.min(100, Math.round(p.have / p.need * 100))}%`, Q.append(be);
      const Fe = p.need - p.have;
      B.push(Q, y("p", `${Fe.toLocaleString()} more ${Fe === 1 ? "play" : "plays"} and your ${T.name} record is yours to claim.`, "ppp-mute"));
    } else
      B.push(re(`${T.name} record · ${ve}`)), B.push(y("p", p.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : p.state === "class-full" || p.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    g.replaceChildren(...B);
  }
  function Es(l, g) {
    var re;
    const p = document.querySelector(".ppp-skin");
    if (!p) return;
    if (!g && (Y != null && Y.showing()) && ((re = l.award) != null && re.cls) && Ec(l.award.cls) && (l.busy || l.armed)) {
      const ve = $o(l.award.cls), S = y("span", "", "ppp-skin__t");
      S.append(y("b", `${ve.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), y("span", "Xtrata Music Hero")), p.hidden = !1, p.replaceChildren(y("span", ve.mark, "ppp-skin__art ppp-skin__art--none"), S);
      return;
    }
    const f = !!g && (!!l.busy || l.armed);
    if (p.hidden = !f, !f || !g) {
      p.replaceChildren();
      return;
    }
    const T = Oc(g.player.cover), V = T ? y("img", "", "ppp-skin__art") : y("span", "♪", "ppp-skin__art ppp-skin__art--none");
    T && (V.src = T, V.alt = "");
    const Z = y("span", "", "ppp-skin__t");
    Z.append(y("b", g.player.title), y("span", g.mode === "arrive" && g.from ? `A gift from ${g.from}` : g.player.subtitle || "Your album")), p.replaceChildren(V, Z);
  }
  function rs(l, g, p) {
    var ve, S, B, F, Q;
    const f = !!l.busy || l.armed, T = [...p];
    l.depositPending && l.arrival && T.push(Ss(l.arrival)), l.error ? T.push(y("p", l.error, l.error === fl ? "ppp-warn" : "ppp-bad")) : l.message && !f ? T.push(y("p", l.message, "ppp-cyan")) : l.notice && T.push(y("p", l.notice, "ppp-warn")), g.mode === "open" && Fn && ((ve = l.likeFunds) != null && ve.album) && l.likeFunds.low && !l.likeFunds.pending && T.push(y("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let V = "Kept on this device with Face ID or your passkey. No app or account needed.", Z = null, re = null;
    if (g.mode === "locked")
      Z = { label: "Continue listening", run: () => {
        ee = G(), c.unlock();
      } }, re = { label: "Use a different passkey", run: () => {
        ee = null, c.unlock(!0);
      } };
    else if (g.mode === "arrive")
      if (l.step === "intro" && Ic(Se) && Se.album === g.player.id) {
        const be = window.XtrataRadio, Fe = Lr(g.player)[0], Tt = Se.phase === "playing";
        Z = { label: Tt && !!((B = (S = be == null ? void 0 : be.getState) == null ? void 0 : S.call(be)) != null && B.playing) ? "Pause" : Tt ? "Carry on" : "Play the first song", run: () => {
          var wr, bn;
          Tt ? (wr = be == null ? void 0 : be.playPause) == null || wr.call(be) : Fe && ((bn = be == null ? void 0 : be.playToken) == null || bn.call(be, Fe.id));
        } }, re = { label: "Make my player and hear it all", run: () => void c.create() }, V = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const be = Se.phase === "done" && Se.album === g.player.id;
        be && !T.length && T.push(y("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), Z = { label: be ? "Keep listening" : "Open album", run: () => void c.create() }, re = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (Z = { label: "Open album", run: () => void c.unlock() }, re = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? T.push(y("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : T.length || T.push(y("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: g.mode,
      player: g.player,
      from: g.from,
      offered: g.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: g.mode === "arrive" && l.step === "intro" ? 1 : void 0,
      plays: g.mode === "open" ? l.balance === void 0 ? null : l.giftPlays : void 0,
      playsComing: l.depositPending,
      status: T,
      primary: Z,
      secondary: re,
      hint: Z ? V : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: fo(l),
      topUps: Uc,
      canMake: !!((Q = (F = l.gate) == null ? void 0 : F.gifts) != null && Q.admin)
    };
  }
  const mn = document.getElementById("findBox"), ri = document.getElementById("findBody"), yr = mn && ri ? QL(ri, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => WL(l == null ? void 0 : l.tracks, (g, p) => ({ title: ug(g, Ht(p.title) ? "" : p.title), artist: cg(g, p.artist || "") }))),
    play: (l) => {
      var g, p;
      (p = (g = window.XtrataRadio) == null ? void 0 : g.playToken) == null || p.call(g, l);
    },
    current: () => {
      var g, p, f, T;
      const l = Number((T = (f = (p = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : p.call(g)) == null ? void 0 : f.nowPlaying) == null ? void 0 : T.tokenId);
      return Number.isSafeInteger(l) ? l : null;
    },
    locked: () => {
      var l;
      return !!((l = c.snapshot().albumLock) != null && l.locked);
    },
    explicit: (l) => {
      var g, p;
      return !!((p = (g = window.XtrataRadio) == null ? void 0 : g.isExplicit) != null && p.call(g, l));
    },
    liked: (l) => sr().has(l)
  }) : null;
  mn == null || mn.addEventListener("toggle", () => {
    mn.open && (yr == null || yr.load());
  });
  let go = "";
  const sr = () => {
    var g, p, f;
    const l = (f = (p = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : p.call(g)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((T) => Number(T == null ? void 0 : T.tokenId)).filter(Number.isSafeInteger) : []);
  }, As = () => {
    var g, p, f, T, V;
    if (!yr || !(mn != null && mn.open)) return;
    const l = `${!!((g = c.snapshot().albumLock) != null && g.locked)}|${((V = (T = (f = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : f.call(p)) == null ? void 0 : T.nowPlaying) == null ? void 0 : V.tokenId) ?? ""}|${[...sr()].sort((Z, re) => Z - re).join(",")}`;
    l !== go && (go = l, yr.refresh());
  }, yo = /* @__PURE__ */ new Map();
  let x = !1;
  const k = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((g) => {
      const p = g == null ? void 0 : g.nowPlaying;
      if (p && Number.isSafeInteger(Number(p.tokenId)) && yo.set(Number(p.tokenId), { title: p.title || void 0, artist: p.artist || void 0 }), As(), Ic(Se)) {
        const f = !!(g != null && g.playing);
        gn({ kind: "now", track: p && p.tokenId != null ? String(p.tokenId) : null, playing: f, at: Date.now() }), f !== x && (x = f, it(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!k()) {
    const l = setInterval(() => {
      k() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const g = l.detail;
    if (Ic(Se) && gn({ kind: "listened", at: Date.now() }), g && Number.isSafeInteger(g.song) && typeof g.id == "string" && /^[0-9a-f]{32}$/.test(g.id)) {
      Ct();
      const p = Vt(g.song, yo.get(g.song));
      c.onListened({ song: g.song, id: g.id, title: p.title || void 0, artist: p.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const tC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", nC = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), o = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return o ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, rC = () => nC() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, sC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, oC = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Eb = class {
  constructor(e) {
    b4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && Dv(e), this.callback(Tl(e));
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
    const e = rC(), t = sC(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return je("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, je("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), je("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, je("div", { class: "flex flex-col space-y-[10px]" }, je("div", { class: "flex items-center" }, je("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), je("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, je("span", { class: "sr-only" }, "Close popup"), je("img", { src: tC }))), r ? je("p", null, "Select the wallet you want to connect to.") : je("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && je("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && je("div", { class: "mt-6" }, je("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), je("ul", { class: "space-y-3" }, this.installedProviders.map((o) => je("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, je("div", { class: "aspect-square basis-9 overflow-hidden" }, je("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), je("div", { class: "flex-1" }, je("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && je("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), je("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && je("div", { class: "mt-6" }, r ? je("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : je("div", { class: "mb-5 flex justify-between" }, je("p", { class: "text-sm font-medium" }, "Recommended wallets"), je("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, je("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, je("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), je("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), je("p", null, "What is a wallet? ", je("span", { class: "align-text-bottom text-[9px]" }, "↗")))), je("ul", { class: "space-y-3" }, n.map((o) => je("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, je("div", { class: "aspect-square basis-9 overflow-hidden" }, je("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), je("div", { class: "flex-1" }, je("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && je("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, e, t) && je("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, e, t), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return e4(this);
  }
};
Eb.style = oC;
const iC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Eb
}, Symbol.toStringTag, { value: "Module" }));
