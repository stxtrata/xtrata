var ub = Object.defineProperty;
var db = (e, t, n) => t in e ? ub(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Yo = (e, t, n) => db(e, typeof t != "symbol" ? t + "" : t, n);
var An = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Sg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function fl(e) {
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
      typeof An < "u" && An || {}, r = {
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
      function c(b) {
        if (typeof b != "string" && (b = String(b)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(b) || b === "")
          throw new TypeError('Invalid character in header field name: "' + b + '"');
        return b.toLowerCase();
      }
      function l(b) {
        return typeof b != "string" && (b = String(b)), b;
      }
      function h(b) {
        var k = {
          next: function() {
            var M = b.shift();
            return { done: M === void 0, value: M };
          }
        };
        return r.iterable && (k[Symbol.iterator] = function() {
          return k;
        }), k;
      }
      function p(b) {
        this.map = {}, b instanceof p ? b.forEach(function(k, M) {
          this.append(M, k);
        }, this) : Array.isArray(b) ? b.forEach(function(k) {
          if (k.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + k.length);
          this.append(k[0], k[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(k) {
          this.append(k, b[k]);
        }, this);
      }
      p.prototype.append = function(b, k) {
        b = c(b), k = l(k);
        var M = this.map[b];
        this.map[b] = M ? M + ", " + k : k;
      }, p.prototype.delete = function(b) {
        delete this.map[c(b)];
      }, p.prototype.get = function(b) {
        return b = c(b), this.has(b) ? this.map[b] : null;
      }, p.prototype.has = function(b) {
        return this.map.hasOwnProperty(c(b));
      }, p.prototype.set = function(b, k) {
        this.map[c(b)] = l(k);
      }, p.prototype.forEach = function(b, k) {
        for (var M in this.map)
          this.map.hasOwnProperty(M) && b.call(k, this.map[M], M, this);
      }, p.prototype.keys = function() {
        var b = [];
        return this.forEach(function(k, M) {
          b.push(M);
        }), h(b);
      }, p.prototype.values = function() {
        var b = [];
        return this.forEach(function(k) {
          b.push(k);
        }), h(b);
      }, p.prototype.entries = function() {
        var b = [];
        return this.forEach(function(k, M) {
          b.push([M, k]);
        }), h(b);
      }, r.iterable && (p.prototype[Symbol.iterator] = p.prototype.entries);
      function d(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function m(b) {
        return new Promise(function(k, M) {
          b.onload = function() {
            k(b.result);
          }, b.onerror = function() {
            M(b.error);
          };
        });
      }
      function y(b) {
        var k = new FileReader(), M = m(k);
        return k.readAsArrayBuffer(b), M;
      }
      function S(b) {
        var k = new FileReader(), M = m(k), N = /charset=([A-Za-z0-9_-]+)/.exec(b.type), Y = N ? N[1] : "utf-8";
        return k.readAsText(b, Y), M;
      }
      function x(b) {
        for (var k = new Uint8Array(b), M = new Array(k.length), N = 0; N < k.length; N++)
          M[N] = String.fromCharCode(k[N]);
        return M.join("");
      }
      function I(b) {
        if (b.slice)
          return b.slice(0);
        var k = new Uint8Array(b.byteLength);
        return k.set(new Uint8Array(b)), k.buffer;
      }
      function H() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = I(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || o(b)) ? this._bodyArrayBuffer = I(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
              return this.blob().then(y);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var b = d(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return S(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(_);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(b) {
        var k = b.toUpperCase();
        return U.indexOf(k) > -1 ? k : b;
      }
      function B(b, k) {
        if (!(this instanceof B))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        k = k || {};
        var M = k.body;
        if (b instanceof B) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, k.headers || (this.headers = new p(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !M && b._bodyInit != null && (M = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = k.credentials || this.credentials || "same-origin", (k.headers || !this.headers) && (this.headers = new p(k.headers)), this.method = A(k.method || this.method || "GET"), this.mode = k.mode || this.mode || null, this.signal = k.signal || this.signal || function() {
          if ("AbortController" in n) {
            var O = new AbortController();
            return O.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && M)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(M), (this.method === "GET" || this.method === "HEAD") && (k.cache === "no-store" || k.cache === "no-cache")) {
          var N = /([?&])_=[^&]*/;
          if (N.test(this.url))
            this.url = this.url.replace(N, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Y = /\?/;
            this.url += (Y.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      B.prototype.clone = function() {
        return new B(this, { body: this._bodyInit });
      };
      function _(b) {
        var k = new FormData();
        return b.trim().split("&").forEach(function(M) {
          if (M) {
            var N = M.split("="), Y = N.shift().replace(/\+/g, " "), O = N.join("=").replace(/\+/g, " ");
            k.append(decodeURIComponent(Y), decodeURIComponent(O));
          }
        }), k;
      }
      function W(b) {
        var k = new p(), M = b.replace(/\r?\n[\t ]+/g, " ");
        return M.split("\r").map(function(N) {
          return N.indexOf(`
`) === 0 ? N.substr(1, N.length) : N;
        }).forEach(function(N) {
          var Y = N.split(":"), O = Y.shift().trim();
          if (O) {
            var pe = Y.join(":").trim();
            try {
              k.append(O, pe);
            } catch (se) {
              console.warn("Response " + se.message);
            }
          }
        }), k;
      }
      H.call(B.prototype);
      function ae(b, k) {
        if (!(this instanceof ae))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (k || (k = {}), this.type = "default", this.status = k.status === void 0 ? 200 : k.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = k.statusText === void 0 ? "" : "" + k.statusText, this.headers = new p(k.headers), this.url = k.url || "", this._initBody(b);
      }
      H.call(ae.prototype), ae.prototype.clone = function() {
        return new ae(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new p(this.headers),
          url: this.url
        });
      }, ae.error = function() {
        var b = new ae(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var Z = [301, 302, 303, 307, 308];
      ae.redirect = function(b, k) {
        if (Z.indexOf(k) === -1)
          throw new RangeError("Invalid status code");
        return new ae(null, { status: k, headers: { location: b } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(k, M) {
          this.message = k, this.name = M;
          var N = Error(k);
          this.stack = N.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function X(b, k) {
        return new Promise(function(M, N) {
          var Y = new B(b, k);
          if (Y.signal && Y.signal.aborted)
            return N(new t.DOMException("Aborted", "AbortError"));
          var O = new XMLHttpRequest();
          function pe() {
            O.abort();
          }
          O.onload = function() {
            var $ = {
              statusText: O.statusText,
              headers: W(O.getAllResponseHeaders() || "")
            };
            Y.url.indexOf("file://") === 0 && (O.status < 200 || O.status > 599) ? $.status = 200 : $.status = O.status, $.url = "responseURL" in O ? O.responseURL : $.headers.get("X-Request-URL");
            var D = "response" in O ? O.response : O.responseText;
            setTimeout(function() {
              M(new ae(D, $));
            }, 0);
          }, O.onerror = function() {
            setTimeout(function() {
              N(new TypeError("Network request failed"));
            }, 0);
          }, O.ontimeout = function() {
            setTimeout(function() {
              N(new TypeError("Network request timed out"));
            }, 0);
          }, O.onabort = function() {
            setTimeout(function() {
              N(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function se($) {
            try {
              return $ === "" && n.location.href ? n.location.href : $;
            } catch {
              return $;
            }
          }
          if (O.open(Y.method, se(Y.url), !0), Y.credentials === "include" ? O.withCredentials = !0 : Y.credentials === "omit" && (O.withCredentials = !1), "responseType" in O && (r.blob ? O.responseType = "blob" : r.arrayBuffer && (O.responseType = "arraybuffer")), k && typeof k.headers == "object" && !(k.headers instanceof p || n.Headers && k.headers instanceof n.Headers)) {
            var Ce = [];
            Object.getOwnPropertyNames(k.headers).forEach(function($) {
              Ce.push(c($)), O.setRequestHeader($, l(k.headers[$]));
            }), Y.headers.forEach(function($, D) {
              Ce.indexOf(D) === -1 && O.setRequestHeader(D, $);
            });
          } else
            Y.headers.forEach(function($, D) {
              O.setRequestHeader(D, $);
            });
          Y.signal && (Y.signal.addEventListener("abort", pe), O.onreadystatechange = function() {
            O.readyState === 4 && Y.signal.removeEventListener("abort", pe);
          }), O.send(typeof Y._bodyInit > "u" ? null : Y._bodyInit);
        });
      }
      return X.polyfill = !0, n.fetch || (n.fetch = X, n.Headers = p, n.Request = B, n.Response = ae), t.Headers = p, t.Request = B, t.Response = ae, t.fetch = X, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : An);
})();
const fb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function hb(e, t) {
  const n = {};
  return Object.assign(n, fb, t), await fetch(e, n);
}
function pb(e) {
  let t = hb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function gb(...e) {
  const { fetchLib: t, middlewares: n } = pb(e);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (o = await Promise.resolve(l.pre({
        fetch: t,
        ...o
      })) ?? o);
    let c = await t(o.url, o.init);
    for (const l of n)
      typeof l.post == "function" && (c = await Promise.resolve(l.post({
        fetch: t,
        url: o.url,
        init: o.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var yo;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(yo || (yo = {}));
var mi;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(mi || (mi = {}));
var Th;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Th || (Th = {}));
const yb = "https://api.mainnet.hiro.so", wb = "https://api.testnet.hiro.so", mb = "http://localhost:3999", bb = ["mainnet", "testnet", "devnet", "mocknet"];
let wo = class {
  constructor(t) {
    this.version = mi.Mainnet, this.chainId = yo.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === mi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? gb();
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
wo.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Nu();
    case "testnet":
      return new xb();
    case "devnet":
      return new Sb();
    case "mocknet":
      return new vg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${bb.join(", ")}`);
  }
};
wo.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : wo.fromName(e);
let Nu = class extends wo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? yb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = mi.Mainnet, this.chainId = yo.Mainnet;
  }
}, xb = class extends wo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? wb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = mi.Testnet, this.chainId = yo.Testnet;
  }
}, vg = class extends wo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? mb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = mi.Testnet, this.chainId = yo.Testnet;
  }
};
const Sb = vg, Ag = "xtrata.wallet.bridge.v1", vb = (e) => typeof e == "object" && e !== null && e.protocol === Ag, Ab = (e) => vb(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", Eb = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class qo extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const Bh = 12e4;
class kb {
  constructor(t) {
    Yo(this, "pending", /* @__PURE__ */ new Map());
    Yo(this, "listenTarget");
    Yo(this, "closed", !1);
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
    Yo(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !Ab(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new qo("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new qo("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new qo("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Eb(), i = { protocol: Ag, kind: "request", id: s, method: t, params: n };
    return new Promise((o, c) => {
      const l = setTimeout(() => {
        this.pending.delete(s), c(
          new qo(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? Bh}ms.`
          )
        );
      }, this.options.timeoutMs ?? Bh);
      this.pending.set(s, { resolve: o, reject: c, timer: l }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new qo("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const $b = ["SP", "SM"], Ib = ["ST", "SN"], Lb = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return $b.includes(n) ? "mainnet" : Ib.includes(n) ? "testnet" : null;
}, Cb = () => {
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
}, Tb = () => typeof window > "u" || !window.localStorage ? Cb() : window.localStorage, ql = "xtrata.v15.1.wallet.session", Mh = "mainnet", _c = { isConnected: !1 }, Bb = (e) => e.address ? Lb(e.address) ?? e.network : e.network, Eg = (e) => !e.isConnected || !e.address ? { ..._c } : Bb(e) !== Mh ? { ..._c } : {
  isConnected: !0,
  address: e.address,
  network: Mh,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, Mb = (e) => {
  if (!e)
    return { ..._c };
  try {
    const t = JSON.parse(e);
    return Eg(t);
  } catch {
    return { ..._c };
  }
}, Nb = (e) => {
  const t = Eg(e);
  return JSON.stringify(t);
}, _b = (e) => {
  const t = Tb();
  return {
    load: () => Mb(t.getItem(ql)),
    save: (n) => {
      t.setItem(ql, Nb(n));
    },
    clear: () => {
      t.removeItem(ql);
    }
  };
}, Pb = "https://browser.blockstack.org/auth", Ub = {
  "@type": "Person",
  "@context": "http://schema.org"
}, kg = ["store_write"], Hb = "blockstack-session", Ob = {
  logLevel: "debug"
}, _i = {
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
Object.freeze(_i);
class _o extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, s = this.stack;
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

${r}`, this.message = n, this.code = t.code, this.parameter = t.parameter ? t.parameter : void 0;
  }
  toString() {
    return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : "n/a"}`;
  }
}
class Db extends _o {
  constructor(t, n = "") {
    super({ code: _i.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class Nh extends _o {
  constructor(t = "") {
    super({ code: _i.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Fa extends _o {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: _i.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class _h extends _o {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: _i.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class _u extends _o {
  constructor(t) {
    super({ code: _i.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class $g extends _o {
  constructor(t) {
    super({ code: _i.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const Ph = ["debug", "info", "warn", "error", "none"], Pu = {};
for (let e = 0; e < Ph.length; e++) {
  const t = Ph[e];
  Pu[t] = e;
}
class ao {
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
    return Pu[Ob.logLevel] <= Pu[t];
  }
}
function Fb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function jb() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Wl(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((s) => parseInt(s, 10)), r = t.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Rb() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function zb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Gb(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function Rd(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = zb(), s) {
      const i = s[e];
      if (i)
        return i;
    }
  } catch (i) {
    ao.error(`Error getting object '${e}' from global scope '${s}': ${i}`);
  }
  if (t) {
    const i = Gb(s, e.toString(), n);
    throw ao.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Xs(e, t) {
  return zd(mn(e), t);
}
function mn(e) {
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
  if (Mn(e, Uint8Array))
    return BigInt(`0x${Ie(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Kb(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Uh(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function $a(e, t = 8) {
  return (typeof e == "bigint" ? e : mn(e)).toString(16).padStart(t * 2, "0");
}
function hl(e) {
  return parseInt(e, 16);
}
function zd(e, t = 16) {
  const n = $a(e, t);
  return it(n);
}
function Vb(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function Xb(e, t) {
  return e & BigInt(1) << t;
}
function Uu(e) {
  return Yb(BigInt(`0x${Ie(e)}`), BigInt(e.byteLength * 8));
}
function Yb(e, t) {
  return Xb(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const qb = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Ie(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += qb[n];
  return t;
}
function it(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = Kb(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    t[n] = i;
  }
  return t;
}
function Pi(e) {
  return new TextEncoder().encode(e);
}
function Ia(e) {
  return new TextDecoder().decode(e);
}
function Wb(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Zb(e) {
  return String.fromCharCode.apply(null, e);
}
function Jb(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Hh(e) {
  if (e.some(Jb))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Nr(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Gt(e) {
  return Nr(...e.map((t) => typeof t == "number" ? Hh([t]) : t instanceof Array ? Hh(t) : t));
}
function Mn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const Ig = "https://api.mainnet.hiro.so", Lg = "https://api.testnet.hiro.so", Cg = "http://localhost:3999", Qb = "https://hub.blockstack.org", e1 = 33, Zl = 32;
function t1(e) {
  if (e.length < Zl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Zl * 2), r = e.slice(2 + Zl * 2);
  return {
    recoveryId: hl(t),
    r: n,
    s: r
  };
}
function Gd(e) {
  const t = typeof e == "string" ? it(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function n1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function r1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function s1(e, t) {
  return e[t];
}
function i1(e, t, n = 0) {
  return e[n] = t, e;
}
function o1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function bi(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const a1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function c1(e, t) {
  const n = {};
  return Object.assign(n, a1, t), await fetch(e, n);
}
function l1(e) {
  let t = c1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function u1(...e) {
  const { fetchLib: t, middlewares: n } = l1(e);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (o = await Promise.resolve(l.pre({
        fetch: t,
        ...o
      })) ?? o);
    let c = await t(o.url, o.init);
    for (const l of n)
      typeof l.post == "function" && (c = await Promise.resolve(l.post({
        fetch: t,
        url: o.url,
        init: o.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
class Tg {
  constructor(t = kg.slice(), n = ((c) => (c = Rd("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", i = void 0, o = Pb) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Hu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function d1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Bg(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function f1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Hu(e.outputLen), Hu(e.blockLen);
}
function h1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function p1(e, t) {
  Bg(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const li = {
  number: Hu,
  bool: d1,
  bytes: Bg,
  hash: f1,
  exists: h1,
  output: p1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jl = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), vr = (e, t) => e << 32 - t | e >>> t, g1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!g1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function y1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Kd(e) {
  if (typeof e == "string" && (e = y1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Mg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ui(e) {
  const t = (r) => e().update(Kd(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Ng = class extends Mg {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, li.hash(t);
    const r = Kd(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return li.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    li.exists(this), li.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: c } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const pl = (e, t, n) => new Ng(e, t).update(n).digest();
pl.create = (e, t) => new Ng(e, t);
function w1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + h, c, r);
}
let Vd = class extends Mg {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Jl(this.buffer);
  }
  update(t) {
    li.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Kd(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const l = Jl(t);
        for (; s <= i - o; o += s)
          this.process(l, o);
        continue;
      }
      r.set(t.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    li.exists(this), li.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let d = o; d < s; d++)
      n[d] = 0;
    w1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Jl(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = l / 4, p = this.get();
    if (h > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < h; d++)
      c.setUint32(4 * d, p[d], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return t.length = s, t.pos = c, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const m1 = (e, t, n) => e & t ^ ~e & n, b1 = (e, t, n) => e & t ^ e & n ^ t & n, x1 = new Uint32Array([
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
]), ys = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ws = new Uint32Array(64);
let _g = class extends Vd {
  constructor() {
    super(64, 32, 8, !1), this.A = ys[0] | 0, this.B = ys[1] | 0, this.C = ys[2] | 0, this.D = ys[3] | 0, this.E = ys[4] | 0, this.F = ys[5] | 0, this.G = ys[6] | 0, this.H = ys[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: c, H: l } = this;
    return [t, n, r, s, i, o, c, l];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ws[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = ws[d - 15], y = ws[d - 2], S = vr(m, 7) ^ vr(m, 18) ^ m >>> 3, x = vr(y, 17) ^ vr(y, 19) ^ y >>> 10;
      ws[d] = x + ws[d - 7] + S + ws[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: h, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const m = vr(c, 6) ^ vr(c, 11) ^ vr(c, 25), y = p + m + m1(c, l, h) + x1[d] + ws[d] | 0, x = (vr(r, 2) ^ vr(r, 13) ^ vr(r, 22)) + b1(r, s, i) | 0;
      p = h, h = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, h = h + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, h, p);
  }
  roundClean() {
    ws.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, S1 = class extends _g {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const mo = Ui(() => new _g());
Ui(() => new S1());
const v1 = {}, Pg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: v1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const rt = BigInt(0), Ct = BigInt(1), Rs = BigInt(2), oa = BigInt(3), Oh = BigInt(8), wt = Object.freeze({
  a: rt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Ct,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Dh = (e, t) => (e + t / Rs) / t, ja = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = wt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Ct * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), c = Dh(i * e, t), l = Dh(-r * e, t);
    let h = ue(e - c * n - l * s, t), p = ue(-c * r - l * i, t);
    const d = h > o, m = p > o;
    if (d && (h = t - h), m && (p = t - p), h > o || p > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: h, k2neg: m, k2: p };
  }
}, gr = 32, xi = 32, Ug = 32, Pc = gr + 1, Uc = 2 * gr + 1;
function Fh(e) {
  const { a: t, b: n } = wt, r = ue(e * e), s = ue(r * e);
  return ue(s + t * e + n);
}
const Ra = wt.a === rt;
class Xd extends Error {
  constructor(t) {
    super(t);
  }
}
function jh(e) {
  if (!(e instanceof dt))
    throw new TypeError("JacobianPoint expected");
}
class dt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof Ye))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(Ye.ZERO) ? dt.ZERO : new dt(t.x, t.y, Ct);
  }
  static toAffineBatch(t) {
    const n = I1(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return dt.toAffineBatch(t).map(dt.fromAffine);
  }
  equals(t) {
    jh(t);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = t, l = ue(s * s), h = ue(c * c), p = ue(n * h), d = ue(i * l), m = ue(ue(r * c) * h), y = ue(ue(o * s) * l);
    return p === d && m === y;
  }
  negate() {
    return new dt(this.x, ue(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = ue(t * t), i = ue(n * n), o = ue(i * i), c = t + i, l = ue(Rs * (ue(c * c) - s - o)), h = ue(oa * s), p = ue(h * h), d = ue(p - Rs * l), m = ue(h * (l - d) - Oh * o), y = ue(Rs * n * r);
    return new dt(d, m, y);
  }
  add(t) {
    jh(t);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = t;
    if (i === rt || o === rt)
      return this;
    if (n === rt || r === rt)
      return t;
    const l = ue(s * s), h = ue(c * c), p = ue(n * h), d = ue(i * l), m = ue(ue(r * c) * h), y = ue(ue(o * s) * l), S = ue(d - p), x = ue(y - m);
    if (S === rt)
      return x === rt ? this.double() : dt.ZERO;
    const I = ue(S * S), H = ue(S * I), U = ue(p * I), A = ue(x * x - H - Rs * U), B = ue(x * (U - A) - m * H), _ = ue(s * c * S);
    return new dt(A, B, _);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = dt.ZERO;
    if (typeof t == "bigint" && t === rt)
      return n;
    let r = Gh(t);
    if (r === Ct)
      return this;
    if (!Ra) {
      let d = n, m = this;
      for (; r > rt; )
        r & Ct && (d = d.add(m)), m = m.double(), r >>= Ct;
      return d;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: c } = ja.splitScalar(r), l = n, h = n, p = this;
    for (; i > rt || c > rt; )
      i & Ct && (l = l.add(p)), c & Ct && (h = h.add(p)), p = p.double(), i >>= Ct, c >>= Ct;
    return s && (l = l.negate()), o && (h = h.negate()), h = new dt(ue(h.x * ja.beta), h.y, h.z), l.add(h);
  }
  precomputeWindow(t) {
    const n = Ra ? 128 / t + 1 : 256 / t + 1, r = [];
    let s = this, i = s;
    for (let o = 0; o < n; o++) {
      i = s, r.push(i);
      for (let c = 1; c < 2 ** (t - 1); c++)
        i = i.add(s), r.push(i);
      s = i.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(dt.BASE) && (n = Ye.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ou.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = dt.normalizeZ(s), Ou.set(n, s)));
    let i = dt.ZERO, o = dt.BASE;
    const c = 1 + (Ra ? 128 / r : 256 / r), l = 2 ** (r - 1), h = BigInt(2 ** r - 1), p = 2 ** r, d = BigInt(r);
    for (let m = 0; m < c; m++) {
      const y = m * l;
      let S = Number(t & h);
      t >>= d, S > l && (S -= p, t += Ct);
      const x = y, I = y + Math.abs(S) - 1, H = m % 2 !== 0, U = S < 0;
      S === 0 ? o = o.add(za(H, s[x])) : i = i.add(za(U, s[I]));
    }
    return { p: i, f: o };
  }
  multiply(t, n) {
    let r = Gh(t), s, i;
    if (Ra) {
      const { k1neg: o, k1: c, k2neg: l, k2: h } = ja.splitScalar(r);
      let { p, f: d } = this.wNAF(c, n), { p: m, f: y } = this.wNAF(h, n);
      p = za(o, p), m = za(l, m), m = new dt(ue(m.x * ja.beta), m.y, m.z), s = p.add(m), i = d.add(y);
    } else {
      const { p: o, f: c } = this.wNAF(r, n);
      s = o, i = c;
    }
    return dt.normalizeZ([s, i])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, i = this.equals(dt.ZERO);
    t == null && (t = i ? Oh : Po(s));
    const o = t, c = ue(o * o), l = ue(c * o), h = ue(n * c), p = ue(r * l), d = ue(s * o);
    if (i)
      return Ye.ZERO;
    if (d !== Ct)
      throw new Error("invZ was invalid");
    return new Ye(h, p);
  }
}
dt.BASE = new dt(wt.Gx, wt.Gy, Ct);
dt.ZERO = new dt(rt, Ct, rt);
function za(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Ou = /* @__PURE__ */ new WeakMap();
class Ye {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Ou.delete(this);
  }
  hasEvenY() {
    return this.y % Rs === rt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = zn(n ? t : t.subarray(1));
    if (!Ac(r))
      throw new Error("Point is not on curve");
    const s = Fh(r);
    let i = $1(s);
    const o = (i & Ct) === Ct;
    n ? o && (i = ue(-i)) : (t[0] & 1) === 1 !== o && (i = ue(-i));
    const c = new Ye(r, i);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(t) {
    const n = zn(t.subarray(1, gr + 1)), r = zn(t.subarray(gr + 1, gr * 2 + 1)), s = new Ye(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = _r(t), r = n.length, s = n[0];
    if (r === gr)
      return this.fromCompressedHex(n);
    if (r === Pc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Uc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Pc} compressed bytes or ${Uc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return Ye.BASE.multiply(Si(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: i } = Dg(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Yd(_r(t)), { n: c } = wt, l = r === 2 || r === 3 ? s + c : s, h = Po(l, c), p = ue(-o * h, c), d = ue(i * h, c), m = r & 1 ? "03" : "02", y = Ye.fromHex(m + zs(l)), S = Ye.BASE.multiplyAndAddUnsafe(y, p, d);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(t = !1) {
    return Gs(this.toHex(t));
  }
  toHex(t = !1) {
    const n = zs(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${zs(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Ac(n) || !Ac(r))
      throw new Error(t);
    const s = ue(r * r), i = Fh(n);
    if (ue(s - i) !== rt)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new Ye(this.x, ue(-this.y));
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
    const s = dt.fromAffine(this), i = n === rt || n === Ct || this !== Ye.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = dt.fromAffine(t).multiplyUnsafe(r), c = i.add(o);
    return c.equals(dt.ZERO) ? void 0 : c.toAffine();
  }
}
Ye.BASE = new Ye(wt.Gx, wt.Gy);
Ye.ZERO = new Ye(rt, rt);
function Rh(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function zh(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${bo(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: zn(n), left: e.subarray(t + 2) };
}
function A1(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${bo(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = zh(e.subarray(2)), { data: r, left: s } = zh(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${bo(s)}`);
  return { r: t, s: r };
}
class Rn {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? bo(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Rn(Hc(s.slice(0, 64)), Hc(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = A1(n ? t : Gs(t));
    return new Rn(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!So(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!So(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = wt.n >> Ct;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new Rn(this.r, ue(-this.s, wt.n)) : this;
  }
  toDERRawBytes() {
    return Gs(this.toDERHex());
  }
  toDERHex() {
    const t = Rh(Wo(this.s)), n = Rh(Wo(this.r)), r = t.length / 2, s = n.length / 2, i = Wo(r), o = Wo(s);
    return `30${Wo(s + r + 4)}02${o}${n}02${i}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Gs(this.toCompactHex());
  }
  toCompactHex() {
    return zs(this.r) + zs(this.s);
  }
}
function Fs(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
const E1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function bo(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += E1[e[n]];
  return t;
}
const k1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function zs(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(rt <= e && e < k1))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function xo(e) {
  const t = Gs(zs(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function Wo(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function Hc(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function Gs(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    t[n] = i;
  }
  return t;
}
function zn(e) {
  return Hc(bo(e));
}
function _r(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Gs(e);
}
function Gh(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && So(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ue(e, t = wt.P) {
  const n = e % t;
  return n >= rt ? n : t + n;
}
function Xn(e, t) {
  const { P: n } = wt;
  let r = e;
  for (; t-- > rt; )
    r *= r, r %= n;
  return r;
}
function $1(e) {
  const { P: t } = wt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), c = BigInt(88), l = e * e * e % t, h = l * l * e % t, p = Xn(h, oa) * h % t, d = Xn(p, oa) * h % t, m = Xn(d, Rs) * l % t, y = Xn(m, r) * m % t, S = Xn(y, s) * y % t, x = Xn(S, o) * S % t, I = Xn(x, c) * x % t, H = Xn(I, o) * S % t, U = Xn(H, oa) * h % t, A = Xn(U, i) * y % t, B = Xn(A, n) * l % t, _ = Xn(B, Rs);
  if (_ * _ % t !== e)
    throw new Error("Cannot find square root");
  return _;
}
function Po(e, t = wt.P) {
  if (e === rt || t <= rt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = ue(e, t), r = t, s = rt, i = Ct;
  for (; n !== rt; ) {
    const c = r / n, l = r % n, h = s - i * c;
    r = n, n = l, s = i, i = h;
  }
  if (r !== Ct)
    throw new Error("invert: does not exist");
  return ue(s, t);
}
function I1(e, t = wt.P) {
  const n = new Array(e.length), r = e.reduce((i, o, c) => o === rt ? i : (n[c] = i, ue(i * o, t)), Ct), s = Po(r, t);
  return e.reduceRight((i, o, c) => o === rt ? i : (n[c] = ue(i * n[c], t), ue(i * o, t)), s), n;
}
function L1(e) {
  const t = e.length * 8 - xi * 8, n = zn(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function Yd(e, t = !1) {
  const n = L1(e);
  if (t)
    return n;
  const { n: r } = wt;
  return n >= r ? n - r : n;
}
let po, aa;
class Hg {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return Ft.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return aa(this.k, ...t);
  }
  checkSync() {
    if (typeof aa != "function")
      throw new Xd("hmacSha256Sync needs to be set");
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
    return Fs(...n);
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
    return Fs(...n);
  }
}
function So(e) {
  return rt < e && e < wt.n;
}
function Ac(e) {
  return rt < e && e < wt.P;
}
function Og(e, t, n, r = !0) {
  const { n: s } = wt, i = Yd(e, !0);
  if (!So(i))
    return;
  const o = Po(i, s), c = Ye.BASE.multiply(i), l = ue(c.x, s);
  if (l === rt)
    return;
  const h = ue(o * ue(t + n * l, s), s);
  if (h === rt)
    return;
  let p = new Rn(l, h), d = (c.x === p.r ? 0 : 2) | Number(c.y & Ct);
  return r && p.hasHighS() && (p = p.normalizeS(), d ^= 1), { sig: p, recovery: d };
}
function Si(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * xi)
      throw new Error("Expected 32 bytes of private key");
    t = Hc(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== xi)
      throw new Error("Expected 32 bytes of private key");
    t = zn(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!So(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function qd(e) {
  return e instanceof Ye ? (e.assertValidity(), e) : Ye.fromHex(e);
}
function Dg(e) {
  if (e instanceof Rn)
    return e.assertValidity(), e;
  try {
    return Rn.fromDER(e);
  } catch {
    return Rn.fromCompact(e);
  }
}
function La(e, t = !1) {
  return Ye.fromPrivateKey(e).toRawBytes(t);
}
function C1(e, t, n, r = !1) {
  return Ye.fromSignature(e, t, n).toRawBytes(r);
}
function Kh(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === Pc || r === Uc : n ? r === Pc * 2 || r === Uc * 2 : e instanceof Ye;
}
function Wd(e, t, n = !1) {
  if (Kh(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Kh(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = qd(t);
  return r.assertValidity(), r.multiply(Si(e)).toRawBytes(n);
}
function Fg(e) {
  const t = e.length > gr ? e.slice(0, gr) : e;
  return zn(t);
}
function T1(e) {
  const t = Fg(e), n = ue(t, wt.n);
  return jg(n < rt ? t : n);
}
function jg(e) {
  return xo(e);
}
function Rg(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = _r(e), s = Si(t), i = [jg(s), T1(r)];
  if (n != null) {
    n === !0 && (n = Ft.randomBytes(gr));
    const l = _r(n);
    if (l.length !== gr)
      throw new Error(`sign: Expected ${gr} bytes of extra data`);
    i.push(l);
  }
  const o = Fs(...i), c = Fg(r);
  return { seed: o, m: c, d: s };
}
function zg(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, t), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function B1(e, t, n = {}) {
  const { seed: r, m: s, d: i } = Rg(e, t, n.extraEntropy), o = new Hg(Ug, xi);
  await o.reseed(r);
  let c;
  for (; !(c = Og(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return zg(c, n);
}
function gl(e, t, n = {}) {
  const { seed: r, m: s, d: i } = Rg(e, t, n.extraEntropy), o = new Hg(Ug, xi);
  o.reseedSync(r);
  let c;
  for (; !(c = Og(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return zg(c, n);
}
const M1 = { strict: !0 };
function N1(e, t, n, r = M1) {
  let s;
  try {
    s = Dg(e), t = _r(t);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = Yd(t);
  let l;
  try {
    l = qd(n);
  } catch {
    return !1;
  }
  const { n: h } = wt, p = Po(o, h), d = ue(c * p, h), m = ue(i * p, h), y = Ye.BASE.multiplyAndAddUnsafe(l, d, m);
  return y ? ue(y.x, h) === i : !1;
}
function Oc(e) {
  return ue(zn(e), wt.n);
}
class vo {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = _r(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = zn(n.subarray(0, 32)), s = zn(n.subarray(32, 64));
    return new vo(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Ac(t) || !So(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return zs(this.r) + zs(this.s);
  }
  toRawBytes() {
    return Gs(this.toHex());
  }
}
function _1(e) {
  return Ye.fromPrivateKey(e).toRawX();
}
class Gg {
  constructor(t, n, r = Ft.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = _r(t);
    const { x: s, scalar: i } = this.getScalar(Si(n));
    if (this.px = s, this.d = i, this.rand = _r(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = Ye.fromPrivateKey(t), r = n.hasEvenY() ? t : wt.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return xo(t ^ zn(n));
  }
  finalizeNonce(t) {
    const n = ue(zn(t), wt.n);
    if (n === rt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(t, n, r, s) {
    return new vo(t.x, ue(n + r * s, wt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, i = Ft.taggedHash, o = this.initNonce(n, await i(Ds.aux, s)), { R: c, rx: l, k: h } = this.finalizeNonce(await i(Ds.nonce, o, r, t)), p = Oc(await i(Ds.challenge, l, r, t)), d = this.finalizeSig(c, h, p, n);
    return await Xg(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, i = Ft.taggedHashSync, o = this.initNonce(n, i(Ds.aux, s)), { R: c, rx: l, k: h } = this.finalizeNonce(i(Ds.nonce, o, r, t)), p = Oc(i(Ds.challenge, l, r, t)), d = this.finalizeSig(c, h, p, n);
    return Yg(d, t, r) || this.error(), d;
  }
}
async function P1(e, t, n) {
  return new Gg(e, t, n).calc();
}
function U1(e, t, n) {
  return new Gg(e, t, n).calcSync();
}
function Kg(e, t, n) {
  const r = e instanceof vo, s = r ? e : vo.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: _r(t),
    P: qd(n)
  };
}
function Vg(e, t, n, r) {
  const s = Ye.BASE.multiplyAndAddUnsafe(t, Si(n), ue(-r, wt.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function Xg(e, t, n) {
  try {
    const { r, s, m: i, P: o } = Kg(e, t, n), c = Oc(await Ft.taggedHash(Ds.challenge, xo(r), o.toRawX(), i));
    return Vg(r, o, s, c);
  } catch {
    return !1;
  }
}
function Yg(e, t, n) {
  try {
    const { r, s, m: i, P: o } = Kg(e, t, n), c = Oc(Ft.taggedHashSync(Ds.challenge, xo(r), o.toRawX(), i));
    return Vg(r, o, s, c);
  } catch (r) {
    if (r instanceof Xd)
      throw r;
    return !1;
  }
}
const H1 = {
  Signature: vo,
  getPublicKey: _1,
  sign: P1,
  verify: Xg,
  signSync: U1,
  verifySync: Yg
};
Ye.BASE._setWindowSize(8);
const Hn = {
  node: Pg,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ds = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ga = {}, Ft = {
  bytesToHex: bo,
  hexToBytes: Gs,
  concatBytes: Fs,
  mod: ue,
  invert: Po,
  isValidPrivateKey(e) {
    try {
      return Si(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: xo,
  _normalizePrivateKey: Si,
  hashToPrivateKey: (e) => {
    e = _r(e);
    const t = xi + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ue(zn(e), wt.n - Ct) + Ct;
    return xo(n);
  },
  randomBytes: (e = 32) => {
    if (Hn.web)
      return Hn.web.getRandomValues(new Uint8Array(e));
    if (Hn.node) {
      const { randomBytes: t } = Hn.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ft.hashToPrivateKey(Ft.randomBytes(xi + 8)),
  precompute(e = 8, t = Ye.BASE) {
    const n = t === Ye.BASE ? t : new Ye(t.x, t.y);
    return n._setWindowSize(e), n.multiply(oa), n;
  },
  sha256: async (...e) => {
    if (Hn.web) {
      const t = await Hn.web.subtle.digest("SHA-256", Fs(...e));
      return new Uint8Array(t);
    } else if (Hn.node) {
      const { createHash: t } = Hn.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (Hn.web) {
      const n = await Hn.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Fs(...t), s = await Hn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Hn.node) {
      const { createHmac: n } = Hn.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = Ga[e];
    if (n === void 0) {
      const r = await Ft.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Fs(r, r), Ga[e] = n;
    }
    return Ft.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof po != "function")
      throw new Xd("sha256Sync is undefined, you need to set it");
    let n = Ga[e];
    if (n === void 0) {
      const r = po(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Fs(r, r), Ga[e] = n;
    }
    return po(n, ...t);
  },
  _JacobianPoint: dt
};
Object.defineProperties(Ft, {
  sha256Sync: {
    configurable: !1,
    get() {
      return po;
    },
    set(e) {
      po || (po = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return aa;
    },
    set(e) {
      aa || (aa = e);
    }
  }
});
const O1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: wt,
  Point: Ye,
  Signature: Rn,
  getPublicKey: La,
  getSharedSecret: Wd,
  recoverPublicKey: C1,
  schnorr: H1,
  sign: B1,
  signSync: gl,
  utils: Ft,
  verify: N1
}, Symbol.toStringTag, { value: "Module" }));
var Ca = {};
Ca.byteLength = z1;
var D1 = Ca.toByteArray = K1, F1 = Ca.fromByteArray = Y1, Ir = [], Zn = [], j1 = typeof Uint8Array < "u" ? Uint8Array : Array, Ql = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Qi = 0, R1 = Ql.length; Qi < R1; ++Qi)
  Ir[Qi] = Ql[Qi], Zn[Ql.charCodeAt(Qi)] = Qi;
Zn[45] = 62;
Zn[95] = 63;
function qg(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function z1(e) {
  var t = qg(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function G1(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function K1(e) {
  var t, n = qg(e), r = n[0], s = n[1], i = new j1(G1(e, r, s)), o = 0, c = s > 0 ? r - 4 : r, l;
  for (l = 0; l < c; l += 4)
    t = Zn[e.charCodeAt(l)] << 18 | Zn[e.charCodeAt(l + 1)] << 12 | Zn[e.charCodeAt(l + 2)] << 6 | Zn[e.charCodeAt(l + 3)], i[o++] = t >> 16 & 255, i[o++] = t >> 8 & 255, i[o++] = t & 255;
  return s === 2 && (t = Zn[e.charCodeAt(l)] << 2 | Zn[e.charCodeAt(l + 1)] >> 4, i[o++] = t & 255), s === 1 && (t = Zn[e.charCodeAt(l)] << 10 | Zn[e.charCodeAt(l + 1)] << 4 | Zn[e.charCodeAt(l + 2)] >> 2, i[o++] = t >> 8 & 255, i[o++] = t & 255), i;
}
function V1(e) {
  return Ir[e >> 18 & 63] + Ir[e >> 12 & 63] + Ir[e >> 6 & 63] + Ir[e & 63];
}
function X1(e, t, n) {
  for (var r, s = [], i = t; i < n; i += 3)
    r = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (e[i + 2] & 255), s.push(V1(r));
  return s.join("");
}
function Y1(e) {
  for (var t, n = e.length, r = n % 3, s = [], i = 16383, o = 0, c = n - r; o < c; o += i)
    s.push(X1(e, o, o + i > c ? c : o + i));
  return r === 1 ? (t = e[n - 1], s.push(
    Ir[t >> 2] + Ir[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    Ir[t >> 10] + Ir[t >> 4 & 63] + Ir[t << 2 & 63] + "="
  )), s.join("");
}
function q1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const W1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Z1() {
  if (q1())
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
    throw new Error(W1);
  }
}
class J1 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const i = this.createCipher(t, n, r), o = new Uint8Array(Nr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const i = this.createDecipher(t, n, r), o = new Uint8Array(Nr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Q1 {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, s) {
    let i, o;
    if (t === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (t === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["encrypt"]), l = await this.subtleCrypto.encrypt({ name: i, iv: r }, c, s);
    return new Uint8Array(l);
  }
  async decrypt(t, n, r, s) {
    let i, o;
    if (t === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (t === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["decrypt"]), l = await this.subtleCrypto.decrypt({ name: i, iv: r }, c, s);
    return new Uint8Array(l);
  }
}
async function Wg() {
  const e = await Z1();
  return e.name === "subtleCrypto" ? new Q1(e.lib) : new J1(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function e2(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var s = e.charAt(r), i = s.charCodeAt(0);
    if (t[i] !== 255)
      throw new TypeError(s + " is ambiguous");
    t[i] = r;
  }
  var o = e.length, c = e.charAt(0), l = Math.log(o) / Math.log(256), h = Math.log(256) / Math.log(o);
  function p(y) {
    if (y instanceof Uint8Array || (ArrayBuffer.isView(y) ? y = new Uint8Array(y.buffer, y.byteOffset, y.byteLength) : Array.isArray(y) && (y = Uint8Array.from(y))), !(y instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (y.length === 0)
      return "";
    for (var S = 0, x = 0, I = 0, H = y.length; I !== H && y[I] === 0; )
      I++, S++;
    for (var U = (H - I) * h + 1 >>> 0, A = new Uint8Array(U); I !== H; ) {
      for (var B = y[I], _ = 0, W = U - 1; (B !== 0 || _ < x) && W !== -1; W--, _++)
        B += 256 * A[W] >>> 0, A[W] = B % o >>> 0, B = B / o >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      x = _, I++;
    }
    for (var ae = U - x; ae !== U && A[ae] === 0; )
      ae++;
    for (var Z = c.repeat(S); ae < U; ++ae)
      Z += e.charAt(A[ae]);
    return Z;
  }
  function d(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var S = 0, x = 0, I = 0; y[S] === c; )
      x++, S++;
    for (var H = (y.length - S) * l + 1 >>> 0, U = new Uint8Array(H); y[S]; ) {
      var A = y.charCodeAt(S);
      if (A > 255)
        return;
      var B = t[A];
      if (B === 255)
        return;
      for (var _ = 0, W = H - 1; (B !== 0 || _ < I) && W !== -1; W--, _++)
        B += o * U[W] >>> 0, U[W] = B % 256 >>> 0, B = B / 256 >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      I = _, S++;
    }
    for (var ae = H - I; ae !== H && U[ae] === 0; )
      ae++;
    for (var Z = new Uint8Array(x + (H - ae)), X = x; ae !== H; )
      Z[X++] = U[ae++];
    return Z;
  }
  function m(y) {
    var S = d(y);
    if (S)
      return S;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: p,
    decodeUnsafe: d,
    decode: m
  };
}
var Zg = e2;
const t2 = Zg, n2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var r2 = t2(n2);
const s2 = /* @__PURE__ */ Sg(r2), i2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Jg = Uint8Array.from({ length: 16 }, (e, t) => t), o2 = Jg.map((e) => (9 * e + 5) % 16);
let Zd = [Jg], Jd = [o2];
for (let e = 0; e < 4; e++)
  for (let t of [Zd, Jd])
    t.push(t[e].map((n) => i2[n]));
const Qg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), a2 = Zd.map((e, t) => e.map((n) => Qg[t][n])), c2 = Jd.map((e, t) => e.map((n) => Qg[t][n])), l2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), u2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ka = (e, t) => e << t | e >>> 32 - t;
function Vh(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Va = new Uint32Array(16);
let d2 = class extends Vd {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Va[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, l = c, h = this.h3 | 0, p = h, d = this.h4 | 0, m = d;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = l2[y], I = u2[y], H = Zd[y], U = Jd[y], A = a2[y], B = c2[y];
      for (let _ = 0; _ < 16; _++) {
        const W = Ka(r + Vh(y, i, c, h) + Va[H[_]] + x, A[_]) + d | 0;
        r = d, d = h, h = Ka(c, 10) | 0, c = i, i = W;
      }
      for (let _ = 0; _ < 16; _++) {
        const W = Ka(s + Vh(S, o, l, p) + Va[U[_]] + I, B[_]) + m | 0;
        s = m, m = p, p = Ka(l, 10) | 0, l = o, o = W;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + h + m | 0, this.h3 + d + s | 0, this.h4 + r + o | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    Va.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const f2 = Ui(() => new d2());
function h2(e) {
  return f2(e);
}
const Xa = BigInt(2 ** 32 - 1), Du = BigInt(32);
function ey(e, t = !1) {
  return t ? { h: Number(e & Xa), l: Number(e >> Du & Xa) } : { h: Number(e >> Du & Xa) | 0, l: Number(e & Xa) | 0 };
}
function p2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = ey(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const g2 = (e, t) => BigInt(e >>> 0) << Du | BigInt(t >>> 0), y2 = (e, t, n) => e >>> n, w2 = (e, t, n) => e << 32 - n | t >>> n, m2 = (e, t, n) => e >>> n | t << 32 - n, b2 = (e, t, n) => e << 32 - n | t >>> n, x2 = (e, t, n) => e << 64 - n | t >>> n - 32, S2 = (e, t, n) => e >>> n - 32 | t << 64 - n, v2 = (e, t) => t, A2 = (e, t) => e, E2 = (e, t, n) => e << n | t >>> 32 - n, k2 = (e, t, n) => t << n | e >>> 32 - n, $2 = (e, t, n) => t << n - 32 | e >>> 64 - n, I2 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function L2(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const C2 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), T2 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, B2 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), M2 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, N2 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), _2 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Fe = {
  fromBig: ey,
  split: p2,
  toBig: g2,
  shrSH: y2,
  shrSL: w2,
  rotrSH: m2,
  rotrSL: b2,
  rotrBH: x2,
  rotrBL: S2,
  rotr32H: v2,
  rotr32L: A2,
  rotlSH: E2,
  rotlSL: k2,
  rotlBH: $2,
  rotlBL: I2,
  add: L2,
  add3L: C2,
  add3H: T2,
  add4L: B2,
  add4H: M2,
  add5H: _2,
  add5L: N2
}, [P2, U2] = Fe.split([
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
].map((e) => BigInt(e))), ms = new Uint32Array(80), bs = new Uint32Array(80);
let yl = class extends Vd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: l, Eh: h, El: p, Fh: d, Fl: m, Gh: y, Gl: S, Hh: x, Hl: I } = this;
    return [t, n, r, s, i, o, c, l, h, p, d, m, y, S, x, I];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l, h, p, d, m, y, S, x, I) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = h | 0, this.El = p | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = I | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      ms[A] = t.getUint32(n), bs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const B = ms[A - 15] | 0, _ = bs[A - 15] | 0, W = Fe.rotrSH(B, _, 1) ^ Fe.rotrSH(B, _, 8) ^ Fe.shrSH(B, _, 7), ae = Fe.rotrSL(B, _, 1) ^ Fe.rotrSL(B, _, 8) ^ Fe.shrSL(B, _, 7), Z = ms[A - 2] | 0, X = bs[A - 2] | 0, b = Fe.rotrSH(Z, X, 19) ^ Fe.rotrBH(Z, X, 61) ^ Fe.shrSH(Z, X, 6), k = Fe.rotrSL(Z, X, 19) ^ Fe.rotrBL(Z, X, 61) ^ Fe.shrSL(Z, X, 6), M = Fe.add4L(ae, k, bs[A - 7], bs[A - 16]), N = Fe.add4H(M, W, b, ms[A - 7], ms[A - 16]);
      ms[A] = N | 0, bs[A] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: l, Dh: h, Dl: p, Eh: d, El: m, Fh: y, Fl: S, Gh: x, Gl: I, Hh: H, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const B = Fe.rotrSH(d, m, 14) ^ Fe.rotrSH(d, m, 18) ^ Fe.rotrBH(d, m, 41), _ = Fe.rotrSL(d, m, 14) ^ Fe.rotrSL(d, m, 18) ^ Fe.rotrBL(d, m, 41), W = d & y ^ ~d & x, ae = m & S ^ ~m & I, Z = Fe.add5L(U, _, ae, U2[A], bs[A]), X = Fe.add5H(Z, H, B, W, P2[A], ms[A]), b = Z | 0, k = Fe.rotrSH(r, s, 28) ^ Fe.rotrBH(r, s, 34) ^ Fe.rotrBH(r, s, 39), M = Fe.rotrSL(r, s, 28) ^ Fe.rotrBL(r, s, 34) ^ Fe.rotrBL(r, s, 39), N = r & i ^ r & c ^ i & c, Y = s & o ^ s & l ^ o & l;
      H = x | 0, U = I | 0, x = y | 0, I = S | 0, y = d | 0, S = m | 0, { h: d, l: m } = Fe.add(h | 0, p | 0, X | 0, b | 0), h = c | 0, p = l | 0, c = i | 0, l = o | 0, i = r | 0, o = s | 0;
      const O = Fe.add3L(b, M, Y);
      r = Fe.add3H(O, X, k, N), s = O | 0;
    }
    ({ h: r, l: s } = Fe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Fe.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l } = Fe.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h, l: p } = Fe.add(this.Dh | 0, this.Dl | 0, h | 0, p | 0), { h: d, l: m } = Fe.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: y, l: S } = Fe.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: I } = Fe.add(this.Gh | 0, this.Gl | 0, x | 0, I | 0), { h: H, l: U } = Fe.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, i, o, c, l, h, p, d, m, y, S, x, I, H, U);
  }
  roundClean() {
    ms.fill(0), bs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, H2 = class extends yl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, O2 = class extends yl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, D2 = class extends yl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const F2 = Ui(() => new yl());
Ui(() => new H2());
Ui(() => new O2());
Ui(() => new D2());
function ty(e) {
  return mo(e);
}
function j2(e) {
  return F2(e);
}
const R2 = 0;
Ft.hmacSha256Sync = (e, ...t) => {
  const n = pl.create(mo, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function z2() {
  return Ie(Ft.randomPrivateKey());
}
function G2(e) {
  const t = mo(mo(e));
  return s2.encode(Nr(e, t).slice(0, e.length + 4));
}
function K2(e, t) {
  return G2(Nr(new Uint8Array([e]), t.slice(0, 20)));
}
function ny(e, t = R2) {
  const n = typeof e == "string" ? it(e) : e, r = h2(ty(n));
  return K2(t, r);
}
function ry(e) {
  const t = Gd(e);
  return Ie(La(t.slice(0, 32), !0));
}
Ft.hmacSha256Sync = (e, ...t) => {
  const n = pl.create(mo, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var Dc;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(Dc || (Dc = {}));
async function V2(e, t, n) {
  return await (await Wg()).encrypt("aes-256-cbc", t, e, n);
}
async function X2(e, t, n) {
  return await (await Wg()).decrypt("aes-256-cbc", t, e, n);
}
function sy(e, t) {
  return pl(mo, e, t);
}
function Y2(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function iy(e) {
  const t = j2(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function q2(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function W2(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Dc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Dc.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !q2(e))
    return t;
  try {
    return Ye.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Z2(e, t, n, r) {
  const s = W2(e);
  if (!s.result)
    throw s;
  const i = Ft.randomPrivateKey(), o = La(i, !0);
  let c = Wd(i, e, !0);
  c = c.slice(1);
  const l = iy(c), h = Ft.randomBytes(16), p = await V2(h, l.encryptionKey, t), d = Nr(h, o, p), m = sy(l.hmacKey, d);
  let y;
  if (!r || r === "hex")
    y = Ie(p);
  else if (r === "base64")
    y = F1(p);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: Ie(h),
    ephemeralPK: Ie(o),
    cipherText: y,
    mac: Ie(m),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function oy(e, t) {
  if (!t.ephemeralPK)
    throw new _h("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = Wd(e, n, !0);
  r = r.slice(1);
  const s = iy(r), i = it(t.iv);
  let o;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    o = it(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    o = D1(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const c = Nr(i, it(n), o), l = sy(s.hmacKey, c), h = it(t.mac);
  if (!Y2(h, l))
    throw new _h("Decryption failed: failure in MAC check");
  const p = await X2(i, s.encryptionKey, o);
  return t.wasString ? Ia(p) : p;
}
function J2(e, t) {
  const n = typeof t == "string" ? Pi(t) : t, r = ry(e), s = ty(n), i = gl(s, e);
  return {
    signature: Ie(i),
    publicKey: r
  };
}
async function Q2(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = ry(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", i = typeof e == "string" ? Pi(e) : e, o = await Z2(n.publicKey, i, s, n.cipherTextEncoding);
  let c = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const l = J2(r, c), h = {
      signature: l.signature,
      publicKey: l.publicKey,
      cipherText: c
    };
    c = JSON.stringify(h);
  }
  return c;
}
function ex(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return oy(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var dn = {}, Ao = {}, Sn = {};
Object.defineProperty(Sn, "__esModule", { value: !0 });
Sn.decode = Sn.encode = Sn.unescape = Sn.escape = Sn.pad = void 0;
const ay = Ca;
function Qd(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Sn.pad = Qd;
function cy(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Sn.escape = cy;
function ly(e) {
  return Qd(e).replace(/-/g, "+").replace(/_/g, "/");
}
Sn.unescape = ly;
function tx(e) {
  return cy((0, ay.fromByteArray)(new TextEncoder().encode(e)));
}
Sn.encode = tx;
function nx(e) {
  return new TextDecoder().decode((0, ay.toByteArray)(Qd(ly(e))));
}
Sn.decode = nx;
var wl = {}, ml = {}, uy = {}, dy = {}, bl = {};
Object.defineProperty(bl, "__esModule", { value: !0 });
bl.crypto = void 0;
bl.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = i, e.aexists = o, e.aoutput = c, e.u8 = l, e.u32 = h, e.clean = p, e.createView = d, e.rotr = m, e.rotl = y, e.byteSwap = S, e.byteSwap32 = x, e.bytesToHex = U, e.hexToBytes = _, e.asyncLoop = ae, e.utf8ToBytes = Z, e.bytesToUtf8 = X, e.toBytes = b, e.kdfInputToBytes = k, e.concatBytes = M, e.checkOpts = N, e.createHasher = O, e.createOptHasher = pe, e.createXOFer = se, e.randomBytes = Ce;
  const t = bl;
  function n($) {
    return $ instanceof Uint8Array || ArrayBuffer.isView($) && $.constructor.name === "Uint8Array";
  }
  function r($) {
    if (!Number.isSafeInteger($) || $ < 0)
      throw new Error("positive integer expected, got " + $);
  }
  function s($, ...D) {
    if (!n($))
      throw new Error("Uint8Array expected");
    if (D.length > 0 && !D.includes($.length))
      throw new Error("Uint8Array expected of length " + D + ", got length=" + $.length);
  }
  function i($) {
    if (typeof $ != "function" || typeof $.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r($.outputLen), r($.blockLen);
  }
  function o($, D = !0) {
    if ($.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (D && $.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function c($, D) {
    s($);
    const ce = D.outputLen;
    if ($.length < ce)
      throw new Error("digestInto() expects output buffer of length at least " + ce);
  }
  function l($) {
    return new Uint8Array($.buffer, $.byteOffset, $.byteLength);
  }
  function h($) {
    return new Uint32Array($.buffer, $.byteOffset, Math.floor($.byteLength / 4));
  }
  function p(...$) {
    for (let D = 0; D < $.length; D++)
      $[D].fill(0);
  }
  function d($) {
    return new DataView($.buffer, $.byteOffset, $.byteLength);
  }
  function m($, D) {
    return $ << 32 - D | $ >>> D;
  }
  function y($, D) {
    return $ << D | $ >>> 32 - D >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function S($) {
    return $ << 24 & 4278190080 | $ << 8 & 16711680 | $ >>> 8 & 65280 | $ >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? ($) => $ : ($) => S($), e.byteSwapIfBE = e.swap8IfBE;
  function x($) {
    for (let D = 0; D < $.length; D++)
      $[D] = S($[D]);
    return $;
  }
  e.swap32IfBE = e.isLE ? ($) => $ : x;
  const I = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", H = /* @__PURE__ */ Array.from({ length: 256 }, ($, D) => D.toString(16).padStart(2, "0"));
  function U($) {
    if (s($), I)
      return $.toHex();
    let D = "";
    for (let ce = 0; ce < $.length; ce++)
      D += H[$[ce]];
    return D;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function B($) {
    if ($ >= A._0 && $ <= A._9)
      return $ - A._0;
    if ($ >= A.A && $ <= A.F)
      return $ - (A.A - 10);
    if ($ >= A.a && $ <= A.f)
      return $ - (A.a - 10);
  }
  function _($) {
    if (typeof $ != "string")
      throw new Error("hex string expected, got " + typeof $);
    if (I)
      return Uint8Array.fromHex($);
    const D = $.length, ce = D / 2;
    if (D % 2)
      throw new Error("hex string expected, got unpadded hex of length " + D);
    const ge = new Uint8Array(ce);
    for (let Le = 0, Te = 0; Le < ce; Le++, Te += 2) {
      const St = B($.charCodeAt(Te)), Be = B($.charCodeAt(Te + 1));
      if (St === void 0 || Be === void 0) {
        const Pe = $[Te] + $[Te + 1];
        throw new Error('hex string expected, got non-hex character "' + Pe + '" at index ' + Te);
      }
      ge[Le] = St * 16 + Be;
    }
    return ge;
  }
  const W = async () => {
  };
  e.nextTick = W;
  async function ae($, D, ce) {
    let ge = Date.now();
    for (let Le = 0; Le < $; Le++) {
      ce(Le);
      const Te = Date.now() - ge;
      Te >= 0 && Te < D || (await (0, e.nextTick)(), ge += Te);
    }
  }
  function Z($) {
    if (typeof $ != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode($));
  }
  function X($) {
    return new TextDecoder().decode($);
  }
  function b($) {
    return typeof $ == "string" && ($ = Z($)), s($), $;
  }
  function k($) {
    return typeof $ == "string" && ($ = Z($)), s($), $;
  }
  function M(...$) {
    let D = 0;
    for (let ge = 0; ge < $.length; ge++) {
      const Le = $[ge];
      s(Le), D += Le.length;
    }
    const ce = new Uint8Array(D);
    for (let ge = 0, Le = 0; ge < $.length; ge++) {
      const Te = $[ge];
      ce.set(Te, Le), Le += Te.length;
    }
    return ce;
  }
  function N($, D) {
    if (D !== void 0 && {}.toString.call(D) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign($, D);
  }
  class Y {
  }
  e.Hash = Y;
  function O($) {
    const D = (ge) => $().update(b(ge)).digest(), ce = $();
    return D.outputLen = ce.outputLen, D.blockLen = ce.blockLen, D.create = () => $(), D;
  }
  function pe($) {
    const D = (ge, Le) => $(Le).update(b(ge)).digest(), ce = $({});
    return D.outputLen = ce.outputLen, D.blockLen = ce.blockLen, D.create = (ge) => $(ge), D;
  }
  function se($) {
    const D = (ge, Le) => $(Le).update(b(ge)).digest(), ce = $({});
    return D.outputLen = ce.outputLen, D.blockLen = ce.blockLen, D.create = (ge) => $(ge), D;
  }
  e.wrapConstructor = O, e.wrapConstructorWithOpts = pe, e.wrapXOFConstructorWithOpts = se;
  function Ce($ = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array($));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes($));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(dy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = dy;
  class n extends t.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(i);
      const c = (0, t.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const l = this.blockLen, h = new Uint8Array(l);
      h.set(c.length > l ? i.create().update(c).digest() : c);
      for (let p = 0; p < h.length; p++)
        h[p] ^= 54;
      this.iHash.update(h), this.oHash = i.create();
      for (let p = 0; p < h.length; p++)
        h[p] ^= 106;
      this.oHash.update(h), (0, t.clean)(h);
    }
    update(i) {
      return (0, t.aexists)(this), this.iHash.update(i), this;
    }
    digestInto(i) {
      (0, t.aexists)(this), (0, t.abytes)(i, this.outputLen), this.finished = !0, this.iHash.digestInto(i), this.oHash.update(i), this.oHash.digestInto(i), this.destroy();
    }
    digest() {
      const i = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(i), i;
    }
    _cloneInto(i) {
      i || (i = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: o, iHash: c, finished: l, destroyed: h, blockLen: p, outputLen: d } = this;
      return i = i, i.finished = l, i.destroyed = h, i.blockLen = p, i.outputLen = d, i.oHash = o._cloneInto(i.oHash), i.iHash = c._cloneInto(i.iHash), i;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (s, i, o) => new n(s, i).update(o).digest();
  e.hmac = r, e.hmac.create = (s, i) => new n(s, i);
})(uy);
const eo = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function fy(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Fu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Hi(e, ...t) {
  if (!fy(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function rx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Fu(e.outputLen), Fu(e.blockLen);
}
function ju(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function hy(e, t) {
  Hi(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function sx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function ix(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Fc(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Ec(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function cr(e, t) {
  return e << 32 - t | e >>> t;
}
function ox(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const ef = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function tf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const py = ef ? (e) => e : (e) => tf(e), ax = py;
function gy(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = tf(e[t]);
  return e;
}
const cx = ef ? (e) => e : gy, yy = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", lx = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function nf(e) {
  if (Hi(e), yy)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += lx[e[n]];
  return t;
}
const Kr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Xh(e) {
  if (e >= Kr._0 && e <= Kr._9)
    return e - Kr._0;
  if (e >= Kr.A && e <= Kr.F)
    return e - (Kr.A - 10);
  if (e >= Kr.a && e <= Kr.f)
    return e - (Kr.a - 10);
}
function ux(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (yy)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Xh(e.charCodeAt(i)), c = Xh(e.charCodeAt(i + 1));
    if (o === void 0 || c === void 0) {
      const l = e[i] + e[i + 1];
      throw new Error('hex string expected, got non-hex character "' + l + '" at index ' + i);
    }
    r[s] = o * 16 + c;
  }
  return r;
}
const wy = async () => {
};
async function dx(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < t || (await wy(), r += i);
  }
}
function rf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function fx(e) {
  return new TextDecoder().decode(e);
}
function Ta(e) {
  return typeof e == "string" && (e = rf(e)), Hi(e), e;
}
function hx(e) {
  return typeof e == "string" && (e = rf(e)), Hi(e), e;
}
function px(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    Hi(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function gx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let my = class {
};
function xl(e) {
  const t = (r) => e().update(Ta(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function by(e) {
  const t = (r, s) => e(s).update(Ta(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function xy(e) {
  const t = (r, s) => e(s).update(Ta(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const yx = xl, wx = by, mx = xy;
function bx(e = 32) {
  if (eo && typeof eo.getRandomValues == "function")
    return eo.getRandomValues(new Uint8Array(e));
  if (eo && typeof eo.randomBytes == "function")
    return Uint8Array.from(eo.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const xx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: my,
  abytes: Hi,
  aexists: ju,
  ahash: rx,
  anumber: Fu,
  aoutput: hy,
  asyncLoop: dx,
  byteSwap: tf,
  byteSwap32: gy,
  byteSwapIfBE: ax,
  bytesToHex: nf,
  bytesToUtf8: fx,
  checkOpts: gx,
  clean: Fc,
  concatBytes: px,
  createHasher: xl,
  createOptHasher: by,
  createView: Ec,
  createXOFer: xy,
  hexToBytes: ux,
  isBytes: fy,
  isLE: ef,
  kdfInputToBytes: hx,
  nextTick: wy,
  randomBytes: bx,
  rotl: ox,
  rotr: cr,
  swap32IfBE: cx,
  swap8IfBE: py,
  toBytes: Ta,
  u32: ix,
  u8: sx,
  utf8ToBytes: rf,
  wrapConstructor: yx,
  wrapConstructorWithOpts: wx,
  wrapXOFConstructorWithOpts: mx
}, Symbol.toStringTag, { value: "Module" }));
function Sx(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + h, c, r);
}
function vx(e, t, n) {
  return e & t ^ ~e & n;
}
function Ax(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class Ex extends my {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Ec(this.buffer);
  }
  update(t) {
    ju(this), t = Ta(t), Hi(t);
    const { view: n, buffer: r, blockLen: s } = this, i = t.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const l = Ec(t);
        for (; s <= i - o; o += s)
          this.process(l, o);
        continue;
      }
      r.set(t.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    ju(this), hy(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Fc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let d = o; d < s; d++)
      n[d] = 0;
    Sx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Ec(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = l / 4, p = this.get();
    if (h > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < h; d++)
      c.setUint32(4 * d, p[d], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return t.destroyed = o, t.finished = i, t.length = s, t.pos = c, s % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const xs = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ss = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), kx = /* @__PURE__ */ Uint32Array.from([
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
]), vs = /* @__PURE__ */ new Uint32Array(64);
let sf = class extends Ex {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = xs[0] | 0, this.B = xs[1] | 0, this.C = xs[2] | 0, this.D = xs[3] | 0, this.E = xs[4] | 0, this.F = xs[5] | 0, this.G = xs[6] | 0, this.H = xs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: c, H: l } = this;
    return [t, n, r, s, i, o, c, l];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      vs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = vs[d - 15], y = vs[d - 2], S = cr(m, 7) ^ cr(m, 18) ^ m >>> 3, x = cr(y, 17) ^ cr(y, 19) ^ y >>> 10;
      vs[d] = x + vs[d - 7] + S + vs[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: h, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const m = cr(c, 6) ^ cr(c, 11) ^ cr(c, 25), y = p + m + vx(c, l, h) + kx[d] + vs[d] | 0, x = (cr(r, 2) ^ cr(r, 13) ^ cr(r, 22)) + Ax(r, s, i) | 0;
      p = h, h = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, h = h + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, h, p);
  }
  roundClean() {
    Fc(vs);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Fc(this.buffer);
  }
}, Sy = class extends sf {
  constructor() {
    super(28), this.A = Ss[0] | 0, this.B = Ss[1] | 0, this.C = Ss[2] | 0, this.D = Ss[3] | 0, this.E = Ss[4] | 0, this.F = Ss[5] | 0, this.G = Ss[6] | 0, this.H = Ss[7] | 0;
  }
};
const $x = /* @__PURE__ */ xl(() => new sf()), Ix = /* @__PURE__ */ xl(() => new Sy()), Lx = sf, of = $x, Cx = Sy, Tx = Ix, Bx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Cx,
  SHA256: Lx,
  sha224: Tx,
  sha256: of
}, Symbol.toStringTag, { value: "Module" })), Sl = /* @__PURE__ */ fl(Bx), Mx = /* @__PURE__ */ fl(O1);
var Eo = {};
Object.defineProperty(Eo, "__esModule", { value: !0 });
Eo.joseToDer = Eo.derToJose = void 0;
const vy = Ca, Ay = Sn;
function eu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const Nx = {
  ES256: eu(256),
  ES384: eu(384),
  ES512: eu(521)
};
function Ey(e) {
  const t = Nx[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const jc = 128, ky = 0, _x = 32, Px = 16, Ux = 2, $y = Px | _x | ky << 6, Rc = Ux | ky << 6;
function Iy(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, vy.toByteArray)((0, Ay.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Hx(e, t) {
  const n = Iy(e), r = Ey(t), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== $y)
    throw new Error('Could not find expected "seq"');
  let c = n[o++];
  if (c === (jc | 1) && (c = n[o++]), i - o < c)
    throw new Error(`"seq" specified length of "${c}", only "${i - o}" remaining`);
  if (n[o++] !== Rc)
    throw new Error('Could not find expected "int" for "r"');
  const l = n[o++];
  if (i - o - 2 < l)
    throw new Error(`"r" specified length of "${l}", only "${i - o - 2}" available`);
  if (s < l)
    throw new Error(`"r" specified length of "${l}", max of "${s}" is acceptable`);
  const h = o;
  if (o += l, n[o++] !== Rc)
    throw new Error('Could not find expected "int" for "s"');
  const p = n[o++];
  if (i - o !== p)
    throw new Error(`"s" specified length of "${p}", expected "${i - o}"`);
  if (s < p)
    throw new Error(`"s" specified length of "${p}", max of "${s}" is acceptable`);
  const d = o;
  if (o += p, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const m = r - l, y = r - p, S = new Uint8Array(m + l + y + p);
  for (o = 0; o < m; ++o)
    S[o] = 0;
  S.set(n.subarray(h + Math.max(-m, 0), h + l), o), o = r;
  for (const x = o; o < x + y; ++o)
    S[o] = 0;
  return S.set(n.subarray(d + Math.max(-y, 0), d + p), o), (0, Ay.escape)((0, vy.fromByteArray)(S));
}
Eo.derToJose = Hx;
function Yh(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= jc && --r, r;
}
function Ox(e, t) {
  e = Iy(e);
  const n = Ey(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Yh(e, 0, n), i = Yh(e, n, e.length), o = n - s, c = n - i, l = 2 + o + 1 + 1 + c, h = l < jc, p = new Uint8Array((h ? 2 : 3) + l);
  let d = 0;
  return p[d++] = $y, h ? p[d++] = l : (p[d++] = jc | 1, p[d++] = l & 255), p[d++] = Rc, p[d++] = o, s < 0 ? (p[d++] = 0, p.set(e.subarray(0, n), d), d += n) : (p.set(e.subarray(s, n), d), d += n - s), p[d++] = Rc, p[d++] = c, i < 0 ? (p[d++] = 0, p.set(e.subarray(n), d)) : p.set(e.subarray(n + i), d), p;
}
Eo.joseToDer = Ox;
var ts = {};
Object.defineProperty(ts, "__esModule", { value: !0 });
ts.InvalidTokenError = ts.MissingParametersError = void 0;
class Dx extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
ts.MissingParametersError = Dx;
class Fx extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
ts.InvalidTokenError = Fx;
const Ba = /* @__PURE__ */ fl(xx);
Object.defineProperty(ml, "__esModule", { value: !0 });
ml.SECP256K1Client = void 0;
const jx = uy, Rx = Sl, kc = Mx, qh = Eo, Wh = ts, Zh = Ba;
kc.utils.hmacSha256Sync = (e, ...t) => {
  const n = jx.hmac.create(Rx.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class Ly {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Zh.bytesToHex)(kc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new Wh.MissingParametersError("a signing input hash and private key are all required");
    const s = kc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Zh.bytesToHex)(s);
    if (r === "jose")
      return (0, qh.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, qh.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new Wh.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return kc.verify(n, t, r, { strict: !1 });
  }
}
ml.SECP256K1Client = Ly;
Ly.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = ml;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(wl);
var vi = {};
const zx = /* @__PURE__ */ fl(Pg);
var Gx = An && An.__awaiter || function(e, t, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(p) {
      try {
        h(r.next(p));
      } catch (d) {
        o(d);
      }
    }
    function l(p) {
      try {
        h(r.throw(p));
      } catch (d) {
        o(d);
      }
    }
    function h(p) {
      p.done ? i(p.value) : s(p.value).then(c, l);
    }
    h((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.hashSha256Async = vi.hashSha256 = void 0;
const Kx = Sl;
function Cy(e) {
  return (0, Kx.sha256)(e);
}
vi.hashSha256 = Cy;
function Vx(e) {
  return Gx(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = zx;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Cy(e));
    }
  });
}
vi.hashSha256Async = Vx;
var Xx = An && An.__awaiter || function(e, t, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(p) {
      try {
        h(r.next(p));
      } catch (d) {
        o(d);
      }
    }
    function l(p) {
      try {
        h(r.throw(p));
      } catch (d) {
        o(d);
      }
    }
    function h(p) {
      p.done ? i(p.value) : s(p.value).then(c, l);
    }
    h((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Ao, "__esModule", { value: !0 });
Ao.TokenSigner = Ao.createUnsecuredToken = void 0;
const Ru = Sn, Jh = wl, Yx = ts, Qh = vi;
function zu(e, t) {
  const n = [], r = Ru.encode(JSON.stringify(t));
  n.push(r);
  const s = Ru.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function qx(e) {
  return zu(e, { typ: "JWT", alg: "none" }) + ".";
}
Ao.createUnsecuredToken = qx;
class Wx {
  constructor(t, n) {
    if (!(t && n))
      throw new Yx.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !Jh.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Jh.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), i = zu(t, s), o = (0, Qh.hashSha256)(i);
    return this.createWithSignedHash(t, n, s, i, o);
  }
  signAsync(t, n = !1, r = {}) {
    return Xx(this, void 0, void 0, function* () {
      const s = this.header(r), i = zu(t, s), o = yield (0, Qh.hashSha256Async)(i);
      return this.createWithSignedHash(t, n, s, i, o);
    });
  }
  createWithSignedHash(t, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Ru.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [o]
    } : [s, o].join(".");
  }
}
Ao.TokenSigner = Wx;
var vl = {};
Object.defineProperty(vl, "__esModule", { value: !0 });
vl.TokenVerifier = void 0;
const Zx = Sn, ep = wl, Jx = ts, Ya = vi;
class Qx {
  constructor(t, n) {
    if (!(t && n))
      throw new Jx.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !ep.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = ep.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), s = r[0] + "." + r[1], i = (o) => {
      const c = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, c, this.rawPublicKey);
    };
    if (n)
      return (0, Ya.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Ya.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), Zx.encode(t.payload)].join(".");
    let s = !0;
    const i = (o) => (t.signature.map((c) => {
      const l = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(o, l, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ya.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Ya.hashSha256)(r);
      return i(o);
    }
  }
}
vl.TokenVerifier = Qx;
var Al = {};
Object.defineProperty(Al, "__esModule", { value: !0 });
Al.decodeToken = void 0;
const qa = Sn;
function eS(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(qa.decode(t[0])), r = JSON.parse(qa.decode(t[1])), s = t[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = qa.decode(t));
    const n = [];
    return e.header.map((r) => {
      const s = JSON.parse(qa.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
Al.decodeToken = eS;
(function(e) {
  var t = An && An.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var c = Object.getOwnPropertyDescriptor(s, i);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, c);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = An && An.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && t(s, r, i);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Ao, e), n(vl, e), n(Al, e), n(ts, e), n(wl, e);
})(dn);
function tS(e) {
  return `did:btc-addr:${e}`;
}
function nS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new Nh("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new Nh('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function Ty(e) {
  if (e)
    return nS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const rS = "1.4.0";
function sS() {
  return z2();
}
function iS(e, t, n, r = kg.slice(), s, i = Fb().getTime(), o = {}) {
  const c = (y) => {
    const S = Rd("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  t || (t = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const l = Object.assign({}, o, {
    jti: Rb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: rS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), h = dn.SECP256K1Client.derivePublicKey(e);
  l.public_keys = [h];
  const p = ny(h);
  return l.iss = tS(p), new dn.TokenSigner("ES256k", e).sign(l);
}
async function tp(e, t) {
  const n = Ia(it(t)), r = JSON.parse(n), s = await oy(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function oS(e) {
  const t = dn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new dn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function aS(e) {
  const t = dn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = Ty(t.iss);
  if (n.length === 1) {
    if (ny(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function cS(e) {
  const t = dn.decodeToken(e).payload;
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
function lS(e) {
  const t = dn.decodeToken(e).payload;
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
function uS(e) {
  const t = [
    lS(e),
    cS(e),
    oS(e),
    aS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const np = "1.0.0";
class Ks {
  constructor(t) {
    this.version = np, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== np)
      throw new _u(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new Ks(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class By {
  constructor(t) {
    if (t) {
      const n = new Ks(t);
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
class rp extends By {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new Ks({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new $g("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ks({})), !0;
  }
}
class sp extends By {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = Hb, !localStorage.getItem(this.key)) {
      const r = new Ks({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new $g("No session data was found in localStorage");
    const n = JSON.parse(t);
    return Ks.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ks({})), !0;
  }
}
var pa;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(pa || (pa = {}));
var zc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(zc || (zc = {}));
pa.Mainnet;
var Jr;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Jr || (Jr = {}));
var Tr;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Tr || (Tr = {}));
Jr.Mainnet;
const My = {
  chainId: pa.Mainnet,
  transactionVersion: Jr.Mainnet,
  peerNetworkId: zc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Tr.MainnetSingleSig,
    multiSig: Tr.MainnetMultiSig
  },
  client: { baseUrl: Ig }
}, Gu = {
  chainId: pa.Testnet,
  transactionVersion: Jr.Testnet,
  peerNetworkId: zc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Tr.TestnetSingleSig,
    multiSig: Tr.TestnetMultiSig
  },
  client: { baseUrl: Lg }
}, $c = {
  ...Gu,
  addressVersion: { ...Gu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Cg }
}, dS = {
  ...$c,
  addressVersion: { ...$c.addressVersion },
  client: { ...$c.client }
};
function fS(e) {
  switch (e) {
    case "mainnet":
      return My;
    case "testnet":
      return Gu;
    case "devnet":
      return $c;
    case "mocknet":
      return dS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Ny(e) {
  return typeof e == "string" ? fS(e) : e;
}
var ip;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ip || (ip = {}));
var op;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(op || (op = {}));
var lr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(lr || (lr = {}));
const tu = ["onChainOnly", "offChainOnly", "any"];
tu[0] + "", lr.OnChainOnly, tu[1] + "", lr.OffChainOnly, tu[2] + "", lr.Any, lr.OnChainOnly + "", lr.OnChainOnly, lr.OffChainOnly + "", lr.OffChainOnly, lr.Any + "", lr.Any;
var ap;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(ap || (ap = {}));
var cp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(cp || (cp = {}));
var lp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(lp || (lp = {}));
var Wr;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Wr || (Wr = {}));
var up;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(up || (up = {}));
var dp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(dp || (dp = {}));
var fp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(fp || (fp = {}));
var hp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(hp || (hp = {}));
var pp;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(pp || (pp = {}));
var gp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(gp || (gp = {}));
var yp;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(yp || (yp = {}));
var wp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(wp || (wp = {}));
var mp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(mp || (mp = {}));
function Ku(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function hS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function _y(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function pS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ku(e.outputLen), Ku(e.blockLen);
}
function gS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function yS(e, t) {
  _y(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ui = {
  number: Ku,
  bool: hS,
  bytes: _y,
  hash: pS,
  exists: gS,
  output: yS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const nu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Ar = (e, t) => e << 32 - t | e >>> t, wS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!wS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function mS(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function af(e) {
  if (typeof e == "string" && (e = mS(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Py = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Oi(e) {
  const t = (r) => e().update(af(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Uy = class extends Py {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, ui.hash(t);
    const r = af(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return ui.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    ui.exists(this), ui.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: c } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Hy = (e, t, n) => new Uy(e, t).update(n).digest();
Hy.create = (e, t) => new Uy(e, t);
function bS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + h, c, r);
}
let cf = class extends Py {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = nu(this.buffer);
  }
  update(t) {
    ui.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = af(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const l = nu(t);
        for (; s <= i - o; o += s)
          this.process(l, o);
        continue;
      }
      r.set(t.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    ui.exists(this), ui.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let d = o; d < s; d++)
      n[d] = 0;
    bS(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = nu(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = l / 4, p = this.get();
    if (h > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < h; d++)
      c.setUint32(4 * d, p[d], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return t.length = s, t.pos = c, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const xS = (e, t, n) => e & t ^ ~e & n, SS = (e, t, n) => e & t ^ e & n ^ t & n, vS = new Uint32Array([
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
]), Es = new Uint32Array(64);
let Oy = class extends cf {
  constructor() {
    super(64, 32, 8, !1), this.A = As[0] | 0, this.B = As[1] | 0, this.C = As[2] | 0, this.D = As[3] | 0, this.E = As[4] | 0, this.F = As[5] | 0, this.G = As[6] | 0, this.H = As[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: c, H: l } = this;
    return [t, n, r, s, i, o, c, l];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Es[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Es[d - 15], y = Es[d - 2], S = Ar(m, 7) ^ Ar(m, 18) ^ m >>> 3, x = Ar(y, 17) ^ Ar(y, 19) ^ y >>> 10;
      Es[d] = x + Es[d - 7] + S + Es[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: h, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const m = Ar(c, 6) ^ Ar(c, 11) ^ Ar(c, 25), y = p + m + xS(c, l, h) + vS[d] + Es[d] | 0, x = (Ar(r, 2) ^ Ar(r, 13) ^ Ar(r, 22)) + SS(r, s, i) | 0;
      p = h, h = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, h = h + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, h, p);
  }
  roundClean() {
    Es.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, AS = class extends Oy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Dy = Oi(() => new Oy());
Oi(() => new AS());
var Di = {}, lf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = Ba;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, c) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let l = [], h = 0;
    for (let y = o.length - 1; y >= 0; y--)
      if (h < 4) {
        const S = n.indexOf(o[y]) >> h;
        let x = 0;
        y !== 0 && (x = n.indexOf(o[y - 1]));
        const I = 1 + h, H = x % (1 << I) << 5 - I, U = e.c32[S + H];
        h = I, l.unshift(U);
      } else
        h = 0;
    let p = 0;
    for (let y = 0; y < l.length && l[y] === "0"; y++)
      p++;
    l = l.slice(p);
    const d = new TextDecoder().decode((0, t.hexToBytes)(o)).match(/^\u0000*/), m = d ? d[0].length : 0;
    for (let y = 0; y < m; y++)
      l.unshift(e.c32[0]);
    if (c) {
      const y = c - l.length;
      for (let S = 0; S < y; S++)
        l.unshift(e.c32[0]);
    }
    return l.join("");
  }
  e.c32encode = r;
  function s(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = s;
  function i(o, c) {
    if (o = s(o), !o.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const l = o.match(`^${e.c32[0]}*`), h = l ? l[0].length : 0;
    let p = [], d = 0, m = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      m === 4 && (p.unshift(n[d]), m = 0, d = 0);
      const H = (e.c32.indexOf(o[x]) << m) + d, U = n[H % 16];
      if (m += 1, d = H >> 4, d > 1 << m)
        throw new Error("Panic error in decoding.");
      p.unshift(U);
    }
    p.unshift(n[d]), p.length % 2 === 1 && p.unshift("0");
    let y = 0;
    for (let x = 0; x < p.length && p[x] === "0"; x++)
      y++;
    p = p.slice(y - y % 2);
    let S = p.join("");
    for (let x = 0; x < h; x++)
      S = `00${S}`;
    if (c) {
      const x = c * 2 - S.length;
      for (let I = 0; I < x; I += 2)
        S = `00${S}`;
    }
    return S;
  }
  e.c32decode = i;
})(lf);
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.c32checkDecode = Ai.c32checkEncode = void 0;
const bp = Sl, xp = Ba, ca = lf;
function Fy(e) {
  const t = (0, bp.sha256)((0, bp.sha256)((0, xp.hexToBytes)(e)));
  return (0, xp.bytesToHex)(t.slice(0, 4));
}
function ES(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Fy(`${n}${t}`), s = (0, ca.c32encode)(`${t}${r}`);
  return `${ca.c32[e]}${s}`;
}
Ai.c32checkEncode = ES;
function kS(e) {
  e = (0, ca.c32normalize)(e);
  const t = (0, ca.c32decode)(e.slice(1)), n = e[0], r = ca.c32.indexOf(n), s = t.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Fy(`${i}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
Ai.c32checkDecode = kS;
var jy = {}, ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
ko.decode = ko.encode = void 0;
const Gc = Sl, Sp = Ba, Ry = Zg, zy = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function $S(e, t = "00") {
  const n = typeof e == "string" ? (0, Sp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, Sp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Gc.sha256)((0, Gc.sha256)(new Uint8Array([...r, ...n])));
  return Ry(zy).encode([...r, ...n, ...s.slice(0, 4)]);
}
ko.encode = $S;
function IS(e) {
  const t = Ry(zy).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, Gc.sha256)((0, Gc.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ko.decode = IS;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = Ai, n = ko, r = Ba;
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
  const i = {};
  i[e.versions.mainnet.p2pkh] = 0, i[e.versions.mainnet.p2sh] = 5, i[e.versions.testnet.p2pkh] = 111, i[e.versions.testnet.p2sh] = 196;
  function o(p, d) {
    if (!d.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(p, d)}`;
  }
  e.c32address = o;
  function c(p) {
    if (p.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (p[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(p.slice(1));
  }
  e.c32addressDecode = c;
  function l(p, d = -1) {
    const m = n.decode(p), y = (0, r.bytesToHex)(m.data), S = parseInt((0, r.bytesToHex)(m.prefix), 16);
    let x;
    return d < 0 ? (x = S, s[S] !== void 0 && (x = s[S])) : x = d, o(x, y);
  }
  e.b58ToC32 = l;
  function h(p, d = -1) {
    const m = c(p), y = m[0], S = m[1];
    let x;
    d < 0 ? (x = y, i[y] !== void 0 && (x = i[y])) : x = d;
    let I = x.toString(16);
    return I.length === 1 && (I = `0${I}`), n.encode(S, I);
  }
  e.c32ToB58 = h;
})(jy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = lf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = Ai;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = jy;
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
})(Di);
function LS(e, t) {
  switch (t = Ny(t ?? My), e) {
    case Wr.P2PKH:
      switch (t.transactionVersion) {
        case Jr.Mainnet:
          return Tr.MainnetSingleSig;
        case Jr.Testnet:
          return Tr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case Wr.P2SH:
    case Wr.P2SHNonSequential:
    case Wr.P2WPKH:
    case Wr.P2WSH:
    case Wr.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case Jr.Mainnet:
          return Tr.MainnetMultiSig;
        case Jr.Testnet:
          return Tr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const CS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Gy = Uint8Array.from({ length: 16 }, (e, t) => t), TS = Gy.map((e) => (9 * e + 5) % 16);
let uf = [Gy], df = [TS];
for (let e = 0; e < 4; e++)
  for (let t of [uf, df])
    t.push(t[e].map((n) => CS[n]));
const Ky = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), BS = uf.map((e, t) => e.map((n) => Ky[t][n])), MS = df.map((e, t) => e.map((n) => Ky[t][n])), NS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _S = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wa = (e, t) => e << t | e >>> 32 - t;
function vp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Za = new Uint32Array(16);
let PS = class extends cf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Za[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, l = c, h = this.h3 | 0, p = h, d = this.h4 | 0, m = d;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = NS[y], I = _S[y], H = uf[y], U = df[y], A = BS[y], B = MS[y];
      for (let _ = 0; _ < 16; _++) {
        const W = Wa(r + vp(y, i, c, h) + Za[H[_]] + x, A[_]) + d | 0;
        r = d, d = h, h = Wa(c, 10) | 0, c = i, i = W;
      }
      for (let _ = 0; _ < 16; _++) {
        const W = Wa(s + vp(S, o, l, p) + Za[U[_]] + I, B[_]) + m | 0;
        s = m, m = p, p = Wa(l, 10) | 0, l = o, o = W;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + h + m | 0, this.h3 + d + s | 0, this.h4 + r + o | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    Za.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const US = Oi(() => new PS()), Ja = BigInt(2 ** 32 - 1), Vu = BigInt(32);
function Vy(e, t = !1) {
  return t ? { h: Number(e & Ja), l: Number(e >> Vu & Ja) } : { h: Number(e >> Vu & Ja) | 0, l: Number(e & Ja) | 0 };
}
function HS(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = Vy(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const OS = (e, t) => BigInt(e >>> 0) << Vu | BigInt(t >>> 0), DS = (e, t, n) => e >>> n, FS = (e, t, n) => e << 32 - n | t >>> n, jS = (e, t, n) => e >>> n | t << 32 - n, RS = (e, t, n) => e << 32 - n | t >>> n, zS = (e, t, n) => e << 64 - n | t >>> n - 32, GS = (e, t, n) => e >>> n - 32 | t << 64 - n, KS = (e, t) => t, VS = (e, t) => e, XS = (e, t, n) => e << n | t >>> 32 - n, YS = (e, t, n) => t << n | e >>> 32 - n, qS = (e, t, n) => t << n - 32 | e >>> 64 - n, WS = (e, t, n) => e << n - 32 | t >>> 64 - n;
function ZS(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const JS = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), QS = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, ev = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), tv = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, nv = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), rv = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, je = {
  fromBig: Vy,
  split: HS,
  toBig: OS,
  shrSH: DS,
  shrSL: FS,
  rotrSH: jS,
  rotrSL: RS,
  rotrBH: zS,
  rotrBL: GS,
  rotr32H: KS,
  rotr32L: VS,
  rotlSH: XS,
  rotlSL: YS,
  rotlBH: qS,
  rotlBL: WS,
  add: ZS,
  add3L: JS,
  add3H: QS,
  add4L: ev,
  add4H: tv,
  add5H: rv,
  add5L: nv
}, [sv, iv] = je.split([
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
].map((e) => BigInt(e))), ks = new Uint32Array(80), $s = new Uint32Array(80);
let El = class extends cf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: l, Eh: h, El: p, Fh: d, Fl: m, Gh: y, Gl: S, Hh: x, Hl: I } = this;
    return [t, n, r, s, i, o, c, l, h, p, d, m, y, S, x, I];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l, h, p, d, m, y, S, x, I) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = h | 0, this.El = p | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = I | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      ks[A] = t.getUint32(n), $s[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const B = ks[A - 15] | 0, _ = $s[A - 15] | 0, W = je.rotrSH(B, _, 1) ^ je.rotrSH(B, _, 8) ^ je.shrSH(B, _, 7), ae = je.rotrSL(B, _, 1) ^ je.rotrSL(B, _, 8) ^ je.shrSL(B, _, 7), Z = ks[A - 2] | 0, X = $s[A - 2] | 0, b = je.rotrSH(Z, X, 19) ^ je.rotrBH(Z, X, 61) ^ je.shrSH(Z, X, 6), k = je.rotrSL(Z, X, 19) ^ je.rotrBL(Z, X, 61) ^ je.shrSL(Z, X, 6), M = je.add4L(ae, k, $s[A - 7], $s[A - 16]), N = je.add4H(M, W, b, ks[A - 7], ks[A - 16]);
      ks[A] = N | 0, $s[A] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: l, Dh: h, Dl: p, Eh: d, El: m, Fh: y, Fl: S, Gh: x, Gl: I, Hh: H, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const B = je.rotrSH(d, m, 14) ^ je.rotrSH(d, m, 18) ^ je.rotrBH(d, m, 41), _ = je.rotrSL(d, m, 14) ^ je.rotrSL(d, m, 18) ^ je.rotrBL(d, m, 41), W = d & y ^ ~d & x, ae = m & S ^ ~m & I, Z = je.add5L(U, _, ae, iv[A], $s[A]), X = je.add5H(Z, H, B, W, sv[A], ks[A]), b = Z | 0, k = je.rotrSH(r, s, 28) ^ je.rotrBH(r, s, 34) ^ je.rotrBH(r, s, 39), M = je.rotrSL(r, s, 28) ^ je.rotrBL(r, s, 34) ^ je.rotrBL(r, s, 39), N = r & i ^ r & c ^ i & c, Y = s & o ^ s & l ^ o & l;
      H = x | 0, U = I | 0, x = y | 0, I = S | 0, y = d | 0, S = m | 0, { h: d, l: m } = je.add(h | 0, p | 0, X | 0, b | 0), h = c | 0, p = l | 0, c = i | 0, l = o | 0, i = r | 0, o = s | 0;
      const O = je.add3L(b, M, Y);
      r = je.add3H(O, X, k, N), s = O | 0;
    }
    ({ h: r, l: s } = je.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = je.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l } = je.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h, l: p } = je.add(this.Dh | 0, this.Dl | 0, h | 0, p | 0), { h: d, l: m } = je.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: y, l: S } = je.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: I } = je.add(this.Gh | 0, this.Gl | 0, x | 0, I | 0), { h: H, l: U } = je.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, i, o, c, l, h, p, d, m, y, S, x, I, H, U);
  }
  roundClean() {
    ks.fill(0), $s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ov = class extends El {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, av = class extends El {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, cv = class extends El {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Oi(() => new El());
Oi(() => new ov());
Oi(() => new av());
Oi(() => new cv());
var Kc = { exports: {} };
Kc.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", c = "[object Boolean]", l = "[object Date]", h = "[object Error]", p = "[object Function]", d = "[object GeneratorFunction]", m = "[object Map]", y = "[object Number]", S = "[object Object]", x = "[object Promise]", I = "[object RegExp]", H = "[object Set]", U = "[object String]", A = "[object Symbol]", B = "[object WeakMap]", _ = "[object ArrayBuffer]", W = "[object DataView]", ae = "[object Float32Array]", Z = "[object Float64Array]", X = "[object Int8Array]", b = "[object Int16Array]", k = "[object Int32Array]", M = "[object Uint8Array]", N = "[object Uint8ClampedArray]", Y = "[object Uint16Array]", O = "[object Uint32Array]", pe = /[\\^$.*+?()[\]{}|]/g, se = /\w*$/, Ce = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, D = {};
  D[i] = D[o] = D[_] = D[W] = D[c] = D[l] = D[ae] = D[Z] = D[X] = D[b] = D[k] = D[m] = D[y] = D[S] = D[I] = D[H] = D[U] = D[A] = D[M] = D[N] = D[Y] = D[O] = !0, D[h] = D[p] = D[B] = !1;
  var ce = typeof An == "object" && An && An.Object === Object && An, ge = typeof self == "object" && self && self.Object === Object && self, Le = ce || ge || Function("return this")(), Te = t && !t.nodeType && t, St = Te && !0 && e && !e.nodeType && e, Be = St && St.exports === Te;
  function Pe(w, T) {
    return w.set(T[0], T[1]), w;
  }
  function Ee(w, T) {
    return w.add(T), w;
  }
  function rn(w, T) {
    for (var R = -1, de = w ? w.length : 0; ++R < de && T(w[R], R, w) !== !1; )
      ;
    return w;
  }
  function qt(w, T) {
    for (var R = -1, de = T.length, At = w.length; ++R < de; )
      w[At + R] = T[R];
    return w;
  }
  function Qe(w, T, R, de) {
    for (var At = -1, It = w ? w.length : 0; ++At < It; )
      R = T(R, w[At], At, w);
    return R;
  }
  function Bt(w, T) {
    for (var R = -1, de = Array(w); ++R < w; )
      de[R] = T(R);
    return de;
  }
  function ct(w, T) {
    return w == null ? void 0 : w[T];
  }
  function j(w) {
    var T = !1;
    if (w != null && typeof w.toString != "function")
      try {
        T = !!(w + "");
      } catch {
      }
    return T;
  }
  function P(w) {
    var T = -1, R = Array(w.size);
    return w.forEach(function(de, At) {
      R[++T] = [At, de];
    }), R;
  }
  function te(w, T) {
    return function(R) {
      return w(T(R));
    };
  }
  function Q(w) {
    var T = -1, R = Array(w.size);
    return w.forEach(function(de) {
      R[++T] = de;
    }), R;
  }
  var ie = Array.prototype, De = Function.prototype, ke = Object.prototype, Me = Le["__core-js_shared__"], nt = function() {
    var w = /[^.]+$/.exec(Me && Me.keys && Me.keys.IE_PROTO || "");
    return w ? "Symbol(src)_1." + w : "";
  }(), ye = De.toString, me = ke.hasOwnProperty, Ke = ke.toString, Ze = RegExp(
    "^" + ye.call(me).replace(pe, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), qe = Be ? Le.Buffer : void 0, jt = Le.Symbol, Wt = Le.Uint8Array, Vt = te(Object.getPrototypeOf, Object), pt = Object.create, fn = ke.propertyIsEnumerable, $n = ie.splice, Sr = Object.getOwnPropertySymbols, Or = qe ? qe.isBuffer : void 0, E = te(Object.keys, Object), F = vt(Le, "DataView"), K = vt(Le, "Map"), V = vt(Le, "Promise"), ee = vt(Le, "Set"), v = vt(Le, "WeakMap"), oe = vt(Object, "create"), Ue = Cn(F), Ve = Cn(K), gt = Cn(V), He = Cn(ee), Pt = Cn(v), et = jt ? jt.prototype : void 0, ot = et ? et.valueOf : void 0;
  function Ut(w) {
    var T = -1, R = w ? w.length : 0;
    for (this.clear(); ++T < R; ) {
      var de = w[T];
      this.set(de[0], de[1]);
    }
  }
  function Ne() {
    this.__data__ = oe ? oe(null) : {};
  }
  function Zt(w) {
    return this.has(w) && delete this.__data__[w];
  }
  function Xt(w) {
    var T = this.__data__;
    if (oe) {
      var R = T[w];
      return R === r ? void 0 : R;
    }
    return me.call(T, w) ? T[w] : void 0;
  }
  function nr(w) {
    var T = this.__data__;
    return oe ? T[w] !== void 0 : me.call(T, w);
  }
  function rr(w, T) {
    var R = this.__data__;
    return R[w] = oe && T === void 0 ? r : T, this;
  }
  Ut.prototype.clear = Ne, Ut.prototype.delete = Zt, Ut.prototype.get = Xt, Ut.prototype.has = nr, Ut.prototype.set = rr;
  function hn(w) {
    var T = -1, R = w ? w.length : 0;
    for (this.clear(); ++T < R; ) {
      var de = w[T];
      this.set(de[0], de[1]);
    }
  }
  function ss() {
    this.__data__ = [];
  }
  function is(w) {
    var T = this.__data__, R = as(T, w);
    if (R < 0)
      return !1;
    var de = T.length - 1;
    return R == de ? T.pop() : $n.call(T, R, 1), !0;
  }
  function Gi(w) {
    var T = this.__data__, R = as(T, w);
    return R < 0 ? void 0 : T[R][1];
  }
  function jo(w) {
    return as(this.__data__, w) > -1;
  }
  function Nn(w, T) {
    var R = this.__data__, de = as(R, w);
    return de < 0 ? R.push([w, T]) : R[de][1] = T, this;
  }
  hn.prototype.clear = ss, hn.prototype.delete = is, hn.prototype.get = Gi, hn.prototype.has = jo, hn.prototype.set = Nn;
  function Jt(w) {
    var T = -1, R = w ? w.length : 0;
    for (this.clear(); ++T < R; ) {
      var de = w[T];
      this.set(de[0], de[1]);
    }
  }
  function _n() {
    this.__data__ = {
      hash: new Ut(),
      map: new (K || hn)(),
      string: new Ut()
    };
  }
  function Je(w) {
    return Rr(this, w).delete(w);
  }
  function $t(w) {
    return Rr(this, w).get(w);
  }
  function Ws(w) {
    return Rr(this, w).has(w);
  }
  function os(w, T) {
    return Rr(this, w).set(w, T), this;
  }
  Jt.prototype.clear = _n, Jt.prototype.delete = Je, Jt.prototype.get = $t, Jt.prototype.has = Ws, Jt.prototype.set = os;
  function Kn(w) {
    this.__data__ = new hn(w);
  }
  function bn() {
    this.__data__ = new hn();
  }
  function In(w) {
    return this.__data__.delete(w);
  }
  function Ln(w) {
    return this.__data__.get(w);
  }
  function Qt(w) {
    return this.__data__.has(w);
  }
  function Dr(w, T) {
    var R = this.__data__;
    if (R instanceof hn) {
      var de = R.__data__;
      if (!K || de.length < n - 1)
        return de.push([w, T]), this;
      R = this.__data__ = new Jt(de);
    }
    return R.set(w, T), this;
  }
  Kn.prototype.clear = bn, Kn.prototype.delete = In, Kn.prototype.get = Ln, Kn.prototype.has = Qt, Kn.prototype.set = Dr;
  function Ro(w, T) {
    var R = g(w) || u(w) ? Bt(w.length, String) : [], de = R.length, At = !!de;
    for (var It in w)
      me.call(w, It) && !(At && (It == "length" || Xi(It, de))) && R.push(It);
    return R;
  }
  function Ki(w, T, R) {
    var de = w[T];
    (!(me.call(w, T) && a(de, R)) || R === void 0 && !(T in w)) && (w[T] = R);
  }
  function as(w, T) {
    for (var R = w.length; R--; )
      if (a(w[R][0], T))
        return R;
    return -1;
  }
  function Zs(w, T) {
    return w && Vi(T, be(T), w);
  }
  function Fr(w, T, R, de, At, It, sn) {
    var Et;
    if (de && (Et = It ? de(w, At, It, sn) : de(w)), Et !== void 0)
      return Et;
    if (!J(w))
      return w;
    var Vo = g(w);
    if (Vo) {
      if (Et = zr(w), !T)
        return ti(w, Et);
    } else {
      var Vn = en(w), $e = Vn == p || Vn == d;
      if (L(w))
        return ls(w, T);
      if (Vn == S || Vn == i || $e && !It) {
        if (j(w))
          return It ? w : {};
        if (Et = ir($e ? {} : w), !T)
          return Ko(w, Zs(Et, w));
      } else {
        if (!D[Vn])
          return It ? w : {};
        Et = Gr(w, Vn, Fr, T);
      }
    }
    sn || (sn = new Kn());
    var lt = sn.get(w);
    if (lt)
      return lt;
    if (sn.set(w, Et), !Vo)
      var ht = R ? ni(w) : be(w);
    return rn(ht || w, function(on, si) {
      ht && (si = on, on = w[si]), Ki(Et, si, Fr(on, T, R, de, si, w, sn));
    }), Et;
  }
  function Pn(w) {
    return J(w) ? pt(w) : {};
  }
  function zo(w, T, R) {
    var de = T(w);
    return g(w) ? de : qt(de, R(w));
  }
  function Js(w) {
    return Ke.call(w);
  }
  function Go(w) {
    if (!J(w) || Yi(w))
      return !1;
    var T = G(w) || j(w) ? Ze : Ce;
    return T.test(Cn(w));
  }
  function cs(w) {
    if (!ri(w))
      return E(w);
    var T = [];
    for (var R in Object(w))
      me.call(w, R) && R != "constructor" && T.push(R);
    return T;
  }
  function ls(w, T) {
    if (T)
      return w.slice();
    var R = new w.constructor(w.length);
    return w.copy(R), R;
  }
  function sr(w) {
    var T = new w.constructor(w.byteLength);
    return new Wt(T).set(new Wt(w)), T;
  }
  function jr(w, T) {
    var R = T ? sr(w.buffer) : w.buffer;
    return new w.constructor(R, w.byteOffset, w.byteLength);
  }
  function Qs(w, T, R) {
    var de = T ? R(P(w), !0) : P(w);
    return Qe(de, Pe, new w.constructor());
  }
  function us(w) {
    var T = new w.constructor(w.source, se.exec(w));
    return T.lastIndex = w.lastIndex, T;
  }
  function ds(w, T, R) {
    var de = T ? R(Q(w), !0) : Q(w);
    return Qe(de, Ee, new w.constructor());
  }
  function ei(w) {
    return ot ? Object(ot.call(w)) : {};
  }
  function at(w, T) {
    var R = T ? sr(w.buffer) : w.buffer;
    return new w.constructor(R, w.byteOffset, w.length);
  }
  function ti(w, T) {
    var R = -1, de = w.length;
    for (T || (T = Array(de)); ++R < de; )
      T[R] = w[R];
    return T;
  }
  function Vi(w, T, R, de) {
    R || (R = {});
    for (var At = -1, It = T.length; ++At < It; ) {
      var sn = T[At], Et = void 0;
      Ki(R, sn, Et === void 0 ? w[sn] : Et);
    }
    return R;
  }
  function Ko(w, T) {
    return Vi(w, fs(w), T);
  }
  function ni(w) {
    return zo(w, be, fs);
  }
  function Rr(w, T) {
    var R = w.__data__;
    return hs(T) ? R[typeof T == "string" ? "string" : "hash"] : R.map;
  }
  function vt(w, T) {
    var R = ct(w, T);
    return Go(R) ? R : void 0;
  }
  var fs = Sr ? te(Sr, Object) : Se, en = Js;
  (F && en(new F(new ArrayBuffer(1))) != W || K && en(new K()) != m || V && en(V.resolve()) != x || ee && en(new ee()) != H || v && en(new v()) != B) && (en = function(w) {
    var T = Ke.call(w), R = T == S ? w.constructor : void 0, de = R ? Cn(R) : void 0;
    if (de)
      switch (de) {
        case Ue:
          return W;
        case Ve:
          return m;
        case gt:
          return x;
        case He:
          return H;
        case Pt:
          return B;
      }
    return T;
  });
  function zr(w) {
    var T = w.length, R = w.constructor(T);
    return T && typeof w[0] == "string" && me.call(w, "index") && (R.index = w.index, R.input = w.input), R;
  }
  function ir(w) {
    return typeof w.constructor == "function" && !ri(w) ? Pn(Vt(w)) : {};
  }
  function Gr(w, T, R, de) {
    var At = w.constructor;
    switch (T) {
      case _:
        return sr(w);
      case c:
      case l:
        return new At(+w);
      case W:
        return jr(w, de);
      case ae:
      case Z:
      case X:
      case b:
      case k:
      case M:
      case N:
      case Y:
      case O:
        return at(w, de);
      case m:
        return Qs(w, de, R);
      case y:
      case U:
        return new At(w);
      case I:
        return us(w);
      case H:
        return ds(w, de, R);
      case A:
        return ei(w);
    }
  }
  function Xi(w, T) {
    return T = T ?? s, !!T && (typeof w == "number" || $.test(w)) && w > -1 && w % 1 == 0 && w < T;
  }
  function hs(w) {
    var T = typeof w;
    return T == "string" || T == "number" || T == "symbol" || T == "boolean" ? w !== "__proto__" : w === null;
  }
  function Yi(w) {
    return !!nt && nt in w;
  }
  function ri(w) {
    var T = w && w.constructor, R = typeof T == "function" && T.prototype || ke;
    return w === R;
  }
  function Cn(w) {
    if (w != null) {
      try {
        return ye.call(w);
      } catch {
      }
      try {
        return w + "";
      } catch {
      }
    }
    return "";
  }
  function qi(w) {
    return Fr(w, !0, !0);
  }
  function a(w, T) {
    return w === T || w !== w && T !== T;
  }
  function u(w) {
    return C(w) && me.call(w, "callee") && (!fn.call(w, "callee") || Ke.call(w) == i);
  }
  var g = Array.isArray;
  function f(w) {
    return w != null && z(w.length) && !G(w);
  }
  function C(w) {
    return we(w) && f(w);
  }
  var L = Or || ve;
  function G(w) {
    var T = J(w) ? Ke.call(w) : "";
    return T == p || T == d;
  }
  function z(w) {
    return typeof w == "number" && w > -1 && w % 1 == 0 && w <= s;
  }
  function J(w) {
    var T = typeof w;
    return !!w && (T == "object" || T == "function");
  }
  function we(w) {
    return !!w && typeof w == "object";
  }
  function be(w) {
    return f(w) ? Ro(w) : cs(w);
  }
  function Se() {
    return [];
  }
  function ve() {
    return !1;
  }
  e.exports = qi;
})(Kc, Kc.exports);
var lv = Kc.exports;
const Xy = /* @__PURE__ */ Sg(lv);
var Xu;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Xu || (Xu = {}));
function uv(e, t) {
  return { type: Xu.Address, version: e, hash160: t };
}
function dv(e) {
  return Di.c32address(e.version, e.hash160);
}
const fv = (e) => US(Dy(e)), hv = (e) => Ie(fv(e));
Ft.hmacSha256Sync = (e, ...t) => {
  const n = Hy.create(Dy, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function pv(e, t = "mainnet") {
  t = Ny(t), e = typeof e == "string" ? it(e) : e;
  const n = LS(Wr.P2PKH, t), r = uv(n, hv(e));
  return dv(r);
}
function gv(e, t) {
  const n = dn.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, i = pv(s);
  if (t !== s) {
    if (t !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new dn.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function yv(e, t = null) {
  let n;
  t ? n = gv(e, t) : n = dn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Ap = "_blockstackDidCheckEchoReply", wv = "echoReply", mv = "authContinuation";
function bv(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function xv() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[Ap];
  if (typeof t == "boolean")
    return t;
  const n = bv(e.location.search), r = n[wv];
  if (r) {
    e[Ap] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const i = n[mv];
      e.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Yu {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new Tg();
    else
      throw new Db("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new sp(t.sessionOptions) : this.store = new sp() : t ? this.store = new rp(t.sessionOptions) : this.store = new rp();
  }
  makeAuthRequestToken(t, n, r, s, i, o = jb().getTime(), c = {}) {
    const l = this.appConfig;
    if (!l)
      throw new _u("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || l.redirectURI(), r = r || l.manifestURI(), s = s || l.scopes, i = i || l.appDomain, iS(t, n, r, s, i, o, c);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = sS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = Rd("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (xv())
        return ao.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      ao.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = u1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Fa("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = dn.decodeToken(t).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await uS(t))
      throw new Fa("Invalid authentication response.");
    let c = i.private_key, l = i.core_token;
    if (Wl(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            c = await tp(s, i.private_key);
          } catch {
            if (ao.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ft.isValidPrivateKey(i.private_key))
              throw new Fa("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (l != null)
          try {
            l = await tp(s, l);
          } catch {
            ao.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Fa("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let h = Qb, p;
    Wl(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (h = i.hubUrl), Wl(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (p = i.associationToken);
    const d = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Ty(i.iss),
      appPrivateKey: c,
      coreSessionToken: l,
      authResponseToken: t,
      hubUrl: h,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: p
    }, m = i.profile_url;
    if (!d.profile && m) {
      const y = await n(m);
      if (!y.ok)
        d.profile = Object.assign({}, Ub);
      else {
        const S = await y.text(), x = JSON.parse(S);
        d.profile = yv(x[0].token);
      }
    } else
      d.profile = i.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new _u("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Q2(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ex(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
Yu.prototype.makeAuthRequest = Yu.prototype.makeAuthRequestToken;
const Sv = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], vv = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = Sv(), n = e.filter((r) => t.find((i) => i.id === r.id) ? !1 : !!kl(r.id));
  return t.concat(n);
}, kl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), Yy = "STX_PROVIDER", Ei = () => typeof window > "u" ? null : window.localStorage.getItem(Yy), Av = (e) => {
  typeof window < "u" && window.localStorage.setItem(Yy, e);
}, Ev = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function kv(e, t) {
  const n = {};
  return Object.assign(n, Ev, t), await fetch(e, n);
}
function $v(e) {
  let t = kv, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Iv(...e) {
  const { fetchLib: t, middlewares: n } = $v(e);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (o = await Promise.resolve(l.pre({
        fetch: t,
        ...o
      })) ?? o);
    let c = await t(o.url, o.init);
    for (const l of n)
      typeof l.post == "function" && (c = await Promise.resolve(l.post({
        fetch: t,
        url: o.url,
        init: o.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var $o;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})($o || ($o = {}));
var ki;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ki || (ki = {}));
var Ep;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Ep || (Ep = {}));
const Lv = "https://api.mainnet.hiro.so", Cv = "https://api.testnet.hiro.so", Tv = "http://localhost:3999", Bv = ["mainnet", "testnet", "devnet", "mocknet"];
class $i {
  constructor(t) {
    this.version = ki.Mainnet, this.chainId = $o.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ki.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Iv();
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
$i.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new qu();
    case "testnet":
      return new Wu();
    case "devnet":
      return new Mv();
    case "mocknet":
      return new qy();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Bv.join(", ")}`);
  }
};
$i.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : $i.fromName(e);
class qu extends $i {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Lv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ki.Mainnet, this.chainId = $o.Mainnet;
  }
}
class Wu extends $i {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Cv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ki.Testnet, this.chainId = $o.Testnet;
  }
}
class qy extends $i {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Tv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ki.Testnet, this.chainId = $o.Testnet;
  }
}
const Mv = qy;
var Ii;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Ii || (Ii = {}));
var Vc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Vc || (Vc = {}));
Ii.Mainnet;
var Li;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Li || (Li = {}));
var Ci;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ci || (Ci = {}));
Li.Mainnet;
const Nv = {
  chainId: Ii.Mainnet,
  transactionVersion: Li.Mainnet,
  peerNetworkId: Vc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ci.MainnetSingleSig,
    multiSig: Ci.MainnetMultiSig
  },
  client: { baseUrl: Ig }
}, Zu = {
  chainId: Ii.Testnet,
  transactionVersion: Li.Testnet,
  peerNetworkId: Vc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ci.TestnetSingleSig,
    multiSig: Ci.TestnetMultiSig
  },
  client: { baseUrl: Lg }
}, Ic = {
  ...Zu,
  addressVersion: { ...Zu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Cg }
}, _v = {
  ...Ic,
  addressVersion: { ...Ic.addressVersion },
  client: { ...Ic.client }
};
function Pv(e) {
  switch (e) {
    case "mainnet":
      return Nv;
    case "testnet":
      return Zu;
    case "devnet":
      return Ic;
    case "mocknet":
      return _v;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Uv(e) {
  return typeof e == "string" ? Pv(e) : e;
}
function Hv(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const kp = /* @__PURE__ */ new Map();
function Wy(e, t) {
  const n = kp.get(e);
  if (n !== void 0)
    return n(t);
  const r = Hv(e);
  return kp.set(e, r), Wy(e, t);
}
let kt = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? it(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return o1(this.readBytes(4), 0);
  }
  readUInt8() {
    return s1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return n1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Ie(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Ie(n);
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
    if (Wy(t, r))
      return r;
    throw n(r);
  }
};
const Ov = 128, Dv = 128, Zy = 16, gi = 32, Ju = 80, $l = 65, Fv = 32, jv = 64, Xc = 34, Rv = 1 + 16 * 1024 * 1024, zv = 165, Gv = 16, Kv = 16, Vv = 20, Xv = Kv + 2 + Vv, Yv = Xv + 4, qv = Rv + (zv + Gv * Yv);
var ft;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ft || (ft = {}));
var Qu;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Qu || (Qu = {}));
var On;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(On || (On = {}));
const ru = ["onChainOnly", "offChainOnly", "any"];
ru[0] + "", On.OnChainOnly, ru[1] + "", On.OffChainOnly, ru[2] + "", On.Any, On.OnChainOnly + "", On.OnChainOnly, On.OffChainOnly + "", On.OffChainOnly, On.Any + "", On.Any;
var Yc;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Yc || (Yc = {}));
var Lt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Lt || (Lt = {}));
var Ot;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Ot || (Ot = {}));
var mt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(mt || (mt = {}));
var Nt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Nt || (Nt = {}));
var la;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(la || (la = {}));
var ed;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(ed || (ed = {}));
var td;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(td || (td = {}));
var vn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(vn || (vn = {}));
var $p;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})($p || ($p = {}));
var nd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(nd || (nd = {}));
var fr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(fr || (fr = {}));
var Ip;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Ip || (Ip = {}));
let Il = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, co = class extends Il {
  constructor(t) {
    super(t);
  }
}, xn = class extends Il {
  constructor(t) {
    super(t);
  }
}, qc = class extends Il {
  constructor(t) {
    super(t);
  }
}, di = class extends Il {
  constructor(t) {
    super(t);
  }
};
function rd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Wv(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Jy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Zv(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  rd(e.outputLen), rd(e.blockLen);
}
function Jv(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Qv(e, t) {
  Jy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const fi = {
  number: rd,
  bool: Wv,
  bytes: Jy,
  hash: Zv,
  exists: Jv,
  output: Qv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const su = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Er = (e, t) => e << 32 - t | e >>> t, eA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!eA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function tA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function ff(e) {
  if (typeof e == "string" && (e = tA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Qy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Fi(e) {
  const t = (r) => e().update(ff(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let ew = class extends Qy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, fi.hash(t);
    const r = ff(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return fi.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    fi.exists(this), fi.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: c } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const tw = (e, t, n) => new ew(e, t).update(n).digest();
tw.create = (e, t) => new ew(e, t);
function nA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + h, c, r);
}
let hf = class extends Qy {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = su(this.buffer);
  }
  update(t) {
    fi.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = ff(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const l = su(t);
        for (; s <= i - o; o += s)
          this.process(l, o);
        continue;
      }
      r.set(t.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    fi.exists(this), fi.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let d = o; d < s; d++)
      n[d] = 0;
    nA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = su(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = l / 4, p = this.get();
    if (h > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < h; d++)
      c.setUint32(4 * d, p[d], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return t.length = s, t.pos = c, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const rA = (e, t, n) => e & t ^ ~e & n, sA = (e, t, n) => e & t ^ e & n ^ t & n, iA = new Uint32Array([
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
let nw = class extends hf {
  constructor() {
    super(64, 32, 8, !1), this.A = Is[0] | 0, this.B = Is[1] | 0, this.C = Is[2] | 0, this.D = Is[3] | 0, this.E = Is[4] | 0, this.F = Is[5] | 0, this.G = Is[6] | 0, this.H = Is[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: c, H: l } = this;
    return [t, n, r, s, i, o, c, l];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Ls[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Ls[d - 15], y = Ls[d - 2], S = Er(m, 7) ^ Er(m, 18) ^ m >>> 3, x = Er(y, 17) ^ Er(y, 19) ^ y >>> 10;
      Ls[d] = x + Ls[d - 7] + S + Ls[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: h, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const m = Er(c, 6) ^ Er(c, 11) ^ Er(c, 25), y = p + m + rA(c, l, h) + iA[d] + Ls[d] | 0, x = (Er(r, 2) ^ Er(r, 13) ^ Er(r, 22)) + sA(r, s, i) | 0;
      p = h, h = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, h = h + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, h, p);
  }
  roundClean() {
    Ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, oA = class extends nw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const pf = Fi(() => new nw());
Fi(() => new oA());
const aA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), rw = Uint8Array.from({ length: 16 }, (e, t) => t), cA = rw.map((e) => (9 * e + 5) % 16);
let gf = [rw], yf = [cA];
for (let e = 0; e < 4; e++)
  for (let t of [gf, yf])
    t.push(t[e].map((n) => aA[n]));
const sw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), lA = gf.map((e, t) => e.map((n) => sw[t][n])), uA = yf.map((e, t) => e.map((n) => sw[t][n])), dA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), fA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qa = (e, t) => e << t | e >>> 32 - t;
function Lp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const ec = new Uint32Array(16);
let hA = class extends hf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      ec[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, l = c, h = this.h3 | 0, p = h, d = this.h4 | 0, m = d;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = dA[y], I = fA[y], H = gf[y], U = yf[y], A = lA[y], B = uA[y];
      for (let _ = 0; _ < 16; _++) {
        const W = Qa(r + Lp(y, i, c, h) + ec[H[_]] + x, A[_]) + d | 0;
        r = d, d = h, h = Qa(c, 10) | 0, c = i, i = W;
      }
      for (let _ = 0; _ < 16; _++) {
        const W = Qa(s + Lp(S, o, l, p) + ec[U[_]] + I, B[_]) + m | 0;
        s = m, m = p, p = Qa(l, 10) | 0, l = o, o = W;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + h + m | 0, this.h3 + d + s | 0, this.h4 + r + o | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    ec.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const pA = Fi(() => new hA()), tc = BigInt(2 ** 32 - 1), sd = BigInt(32);
function iw(e, t = !1) {
  return t ? { h: Number(e & tc), l: Number(e >> sd & tc) } : { h: Number(e >> sd & tc) | 0, l: Number(e & tc) | 0 };
}
function gA(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = iw(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const yA = (e, t) => BigInt(e >>> 0) << sd | BigInt(t >>> 0), wA = (e, t, n) => e >>> n, mA = (e, t, n) => e << 32 - n | t >>> n, bA = (e, t, n) => e >>> n | t << 32 - n, xA = (e, t, n) => e << 32 - n | t >>> n, SA = (e, t, n) => e << 64 - n | t >>> n - 32, vA = (e, t, n) => e >>> n - 32 | t << 64 - n, AA = (e, t) => t, EA = (e, t) => e, kA = (e, t, n) => e << n | t >>> 32 - n, $A = (e, t, n) => t << n | e >>> 32 - n, IA = (e, t, n) => t << n - 32 | e >>> 64 - n, LA = (e, t, n) => e << n - 32 | t >>> 64 - n;
function CA(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const TA = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), BA = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, MA = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), NA = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, _A = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), PA = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Re = {
  fromBig: iw,
  split: gA,
  toBig: yA,
  shrSH: wA,
  shrSL: mA,
  rotrSH: bA,
  rotrSL: xA,
  rotrBH: SA,
  rotrBL: vA,
  rotr32H: AA,
  rotr32L: EA,
  rotlSH: kA,
  rotlSL: $A,
  rotlBH: IA,
  rotlBL: LA,
  add: CA,
  add3L: TA,
  add3H: BA,
  add4L: MA,
  add4H: NA,
  add5H: PA,
  add5L: _A
}, [UA, HA] = Re.split([
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
].map((e) => BigInt(e))), Cs = new Uint32Array(80), Ts = new Uint32Array(80);
let Ll = class extends hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: l, Eh: h, El: p, Fh: d, Fl: m, Gh: y, Gl: S, Hh: x, Hl: I } = this;
    return [t, n, r, s, i, o, c, l, h, p, d, m, y, S, x, I];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l, h, p, d, m, y, S, x, I) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = h | 0, this.El = p | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = I | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Cs[A] = t.getUint32(n), Ts[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const B = Cs[A - 15] | 0, _ = Ts[A - 15] | 0, W = Re.rotrSH(B, _, 1) ^ Re.rotrSH(B, _, 8) ^ Re.shrSH(B, _, 7), ae = Re.rotrSL(B, _, 1) ^ Re.rotrSL(B, _, 8) ^ Re.shrSL(B, _, 7), Z = Cs[A - 2] | 0, X = Ts[A - 2] | 0, b = Re.rotrSH(Z, X, 19) ^ Re.rotrBH(Z, X, 61) ^ Re.shrSH(Z, X, 6), k = Re.rotrSL(Z, X, 19) ^ Re.rotrBL(Z, X, 61) ^ Re.shrSL(Z, X, 6), M = Re.add4L(ae, k, Ts[A - 7], Ts[A - 16]), N = Re.add4H(M, W, b, Cs[A - 7], Cs[A - 16]);
      Cs[A] = N | 0, Ts[A] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: l, Dh: h, Dl: p, Eh: d, El: m, Fh: y, Fl: S, Gh: x, Gl: I, Hh: H, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const B = Re.rotrSH(d, m, 14) ^ Re.rotrSH(d, m, 18) ^ Re.rotrBH(d, m, 41), _ = Re.rotrSL(d, m, 14) ^ Re.rotrSL(d, m, 18) ^ Re.rotrBL(d, m, 41), W = d & y ^ ~d & x, ae = m & S ^ ~m & I, Z = Re.add5L(U, _, ae, HA[A], Ts[A]), X = Re.add5H(Z, H, B, W, UA[A], Cs[A]), b = Z | 0, k = Re.rotrSH(r, s, 28) ^ Re.rotrBH(r, s, 34) ^ Re.rotrBH(r, s, 39), M = Re.rotrSL(r, s, 28) ^ Re.rotrBL(r, s, 34) ^ Re.rotrBL(r, s, 39), N = r & i ^ r & c ^ i & c, Y = s & o ^ s & l ^ o & l;
      H = x | 0, U = I | 0, x = y | 0, I = S | 0, y = d | 0, S = m | 0, { h: d, l: m } = Re.add(h | 0, p | 0, X | 0, b | 0), h = c | 0, p = l | 0, c = i | 0, l = o | 0, i = r | 0, o = s | 0;
      const O = Re.add3L(b, M, Y);
      r = Re.add3H(O, X, k, N), s = O | 0;
    }
    ({ h: r, l: s } = Re.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Re.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l } = Re.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h, l: p } = Re.add(this.Dh | 0, this.Dl | 0, h | 0, p | 0), { h: d, l: m } = Re.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: y, l: S } = Re.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: I } = Re.add(this.Gh | 0, this.Gl | 0, x | 0, I | 0), { h: H, l: U } = Re.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, i, o, c, l, h, p, d, m, y, S, x, I, H, U);
  }
  roundClean() {
    Cs.fill(0), Ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, OA = class extends Ll {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, DA = class extends Ll {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, FA = class extends Ll {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Fi(() => new Ll());
Fi(() => new OA());
const jA = Fi(() => new DA());
Fi(() => new FA());
var tt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(tt || (tt = {}));
var Yt;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(Yt || (Yt = {}));
function wf(e) {
  return Yt[e];
}
const RA = () => ({ type: tt.BoolTrue }), zA = () => ({ type: tt.BoolFalse }), GA = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: tt.Buffer, value: Ie(e) };
}, Cp = BigInt("0xffffffffffffffffffffffffffffffff"), KA = BigInt(0), Tp = BigInt("0x7fffffffffffffffffffffffffffffff"), Bp = BigInt("-170141183460469231731687303715884105728"), VA = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = Uu(it(e))), Mn(e, Uint8Array) && (e = Uu(e));
  const t = mn(e);
  if (t > Tp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Tp}`);
  if (t < Bp)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Bp}`);
  return { type: tt.Int, value: t };
}, XA = (e) => {
  const t = mn(e);
  if (t < KA)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Cp)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Cp}`);
  return { type: tt.UInt, value: t };
};
function YA(e) {
  return { type: tt.List, value: e };
}
function ow() {
  return { type: tt.OptionalNone };
}
function aw(e) {
  return { type: tt.OptionalSome, value: e };
}
var fe;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(fe || (fe = {}));
function qA() {
  return {
    type: fe.Address,
    version: Ci.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Mp(e) {
  if (e && yw(e, Xc))
    throw new Error(`Memo exceeds maximum length of ${Xc} bytes`);
  return { type: fe.MemoString, content: e };
}
function mf(e, t) {
  return {
    type: fe.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function id(e) {
  if (it(e).byteLength != $l)
    throw Error("Invalid signature");
  return {
    type: fe.MessageSignature,
    data: e
  };
}
function WA(e, t, n) {
  return typeof e == "string" && (e = fE(e)), typeof n == "string" && (n = Mp(n)), {
    type: fe.Payload,
    payloadType: ft.TokenTransfer,
    recipient: e,
    amount: mn(t),
    memo: n ?? Mp("")
  };
}
function ZA(e, t, n, r) {
  return typeof t == "string" && (t = wr(t)), typeof n == "string" && (n = wr(n)), {
    type: fe.Payload,
    payloadType: ft.ContractCall,
    contractAddress: typeof e == "string" ? qs(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function JA(e) {
  return wr(e, 4, 1e5);
}
function Np(e, t, n) {
  return typeof e == "string" && (e = wr(e)), typeof t == "string" && (t = JA(t)), typeof n == "number" ? {
    type: fe.Payload,
    payloadType: ft.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: fe.Payload,
    payloadType: ft.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function QA() {
  return { type: fe.Payload, payloadType: ft.PoisonMicroblock };
}
function _p(e, t) {
  if (e.byteLength != gi)
    throw Error(`Coinbase buffer size must be ${gi} bytes`);
  return t != null ? {
    type: fe.Payload,
    payloadType: ft.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: fe.Payload,
    payloadType: ft.Coinbase,
    coinbaseBytes: e
  };
}
function eE(e, t, n) {
  if (e.byteLength != gi)
    throw Error(`Coinbase buffer size must be ${gi} bytes`);
  if (n.byteLength != Ju)
    throw Error(`VRF proof buffer size must be ${Ju} bytes`);
  return {
    type: fe.Payload,
    payloadType: ft.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === tt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function tE(e, t, n, r, s, i, o) {
  return {
    type: fe.Payload,
    payloadType: ft.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function wr(e, t, n) {
  const r = t || 1, s = n || Ov;
  if (yw(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: fe.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function nE(e, t, n) {
  return {
    type: fe.Asset,
    address: qs(e),
    contractName: wr(t),
    assetName: wr(n)
  };
}
function qs(e) {
  const t = Di.c32addressDecode(e);
  return {
    type: fe.Address,
    version: t[0],
    hash160: t[1]
  };
}
function rE(e, t) {
  const n = qs(e), r = wr(t);
  return {
    type: fe.Principal,
    prefix: vn.Contract,
    address: n,
    contractName: r
  };
}
function sE(e) {
  const t = qs(e);
  return {
    type: fe.Principal,
    prefix: vn.Standard,
    address: t
  };
}
function lo(e, t) {
  return {
    pubKeyEncoding: e,
    type: fe.TransactionAuthField,
    contents: t
  };
}
function Xr(e) {
  switch (e.type) {
    case fe.Address:
      return Ma(e);
    case fe.Principal:
      return cw(e);
    case fe.LengthPrefixedString:
      return Lo(e);
    case fe.MemoString:
      return oE(e);
    case fe.Asset:
      return uw(e);
    case fe.PostCondition:
      return fw(e);
    case fe.PublicKey:
      return cd(e);
    case fe.LengthPrefixedList:
      return bf(e);
    case fe.Payload:
      return hw(e);
    case fe.TransactionAuthField:
      return dE(e);
    case fe.MessageSignature:
      return xf(e);
  }
}
function Ma(e) {
  const t = [];
  return t.push(it($a(e.version, 1))), t.push(it(e.hash160)), Gt(t);
}
function Io(e) {
  const t = Mn(e, kt) ? e : new kt(e), n = hl(Ie(t.readBytes(1))), r = Ie(t.readBytes(20));
  return { type: fe.Address, version: n, hash160: r };
}
function cw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === vn.Standard || e.prefix === vn.Contract) && t.push(Ma(e.address)), e.prefix === vn.Contract && t.push(Lo(e.contractName)), Gt(t);
}
function iE(e) {
  const t = Mn(e, kt) ? e : new kt(e), n = t.readUInt8Enum(vn, (i) => {
    throw new xn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === vn.Origin)
    return { type: fe.Principal, prefix: n };
  const r = Io(t);
  if (n === vn.Standard)
    return { type: fe.Principal, prefix: n, address: r };
  const s = Qn(t);
  return {
    type: fe.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Lo(e) {
  const t = [], n = Pi(e.content), r = n.byteLength;
  return t.push(it($a(r, e.lengthPrefixBytes))), t.push(n), Gt(t);
}
function Qn(e, t, n) {
  t = t || 1;
  const r = Mn(e, kt) ? e : new kt(e), s = hl(Ie(r.readBytes(t))), i = Ia(r.readBytes(s));
  return wr(i, t, n ?? 128);
}
function oE(e) {
  const t = [], n = Pi(e.content), r = _E(Ie(n), Xc * 2);
  return t.push(it(r)), Gt(t);
}
function lw(e) {
  const t = Mn(e, kt) ? e : new kt(e);
  let n = Ia(t.readBytes(Xc));
  return n = n.replace(/\u0000*$/, ""), { type: fe.MemoString, content: n };
}
function uw(e) {
  const t = [];
  return t.push(Ma(e.address)), t.push(Lo(e.contractName)), t.push(Lo(e.assetName)), Gt(t);
}
function od(e) {
  const t = Mn(e, kt) ? e : new kt(e);
  return {
    type: fe.Asset,
    address: Io(t),
    contractName: Qn(t),
    assetName: Qn(t)
  };
}
function bf(e) {
  const t = e.values, n = [];
  n.push(it($a(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Xr(r));
  return Gt(n);
}
function dw(e, t, n) {
  const r = Mn(e, kt) ? e : new kt(e), s = hl(Ie(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (t) {
      case fe.Address:
        i.push(Io(r));
        break;
      case fe.LengthPrefixedString:
        i.push(Qn(r));
        break;
      case fe.MemoString:
        i.push(lw(r));
        break;
      case fe.Asset:
        i.push(od(r));
        break;
      case fe.PostCondition:
        i.push(cE(r));
        break;
      case fe.PublicKey:
        i.push(ld(r));
        break;
      case fe.TransactionAuthField:
        i.push(uE(r));
        break;
    }
  return mf(i, n);
}
function aE(e) {
  return Ie(fw(e));
}
function fw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(cw(e.principal)), (e.conditionType === Lt.Fungible || e.conditionType === Lt.NonFungible) && t.push(uw(e.asset)), e.conditionType === Lt.NonFungible && t.push(Br(e.assetName)), t.push(e.conditionCode), e.conditionType === Lt.STX || e.conditionType === Lt.Fungible || e.conditionType === Lt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new co("The post-condition amount may not be larger than 8 bytes");
    t.push(Xs(e.amount, 8));
  }
  return Gt(t);
}
function cE(e) {
  const t = Mn(e, kt) ? e : new kt(e), n = t.readUInt8Enum(Lt, (c) => {
    throw new xn(`Could not read ${c} as PostConditionType`);
  }), r = iE(t);
  let s, i, o;
  switch (n) {
    case Lt.STX:
      return s = t.readUInt8Enum(la, (l) => {
        throw new xn(`Could not read ${l} as FungibleConditionCode`);
      }), o = BigInt(`0x${Ie(t.readBytes(8))}`), {
        type: fe.PostCondition,
        conditionType: Lt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Lt.Fungible:
      return i = od(t), s = t.readUInt8Enum(la, (l) => {
        throw new xn(`Could not read ${l} as FungibleConditionCode`);
      }), o = BigInt(`0x${Ie(t.readBytes(8))}`), {
        type: fe.PostCondition,
        conditionType: Lt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Lt.NonFungible:
      i = od(t);
      const c = Lr(t);
      return s = t.readUInt8Enum(ed, (l) => {
        throw new xn(`Could not read ${l} as FungibleConditionCode`);
      }), {
        type: fe.PostCondition,
        conditionType: Lt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: c
      };
    case Lt.Staking:
      return s = t.readUInt8Enum(la, (l) => {
        throw new xn(`Could not read ${l} as FungibleConditionCode`);
      }), o = BigInt(`0x${Ie(t.readBytes(8))}`), {
        type: fe.PostCondition,
        conditionType: Lt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Lt.PoX: {
      const l = t.readUInt8Enum(td, (h) => {
        throw new xn(`Could not read ${h} as PoxConditionCode`);
      });
      return {
        type: fe.PostCondition,
        conditionType: Lt.PoX,
        principal: r,
        conditionCode: l
      };
    }
  }
}
function hw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case ft.TokenTransfer:
      t.push(Br(e.recipient)), t.push(Xs(e.amount, 8)), t.push(Xr(e.memo));
      break;
    case ft.ContractCall:
      t.push(Xr(e.contractAddress)), t.push(Xr(e.contractName)), t.push(Xr(e.functionName));
      const n = new Uint8Array(4);
      bi(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Br(r));
      });
      break;
    case ft.SmartContract:
      t.push(Xr(e.contractName)), t.push(Xr(e.codeBody));
      break;
    case ft.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Xr(e.contractName)), t.push(Xr(e.codeBody));
      break;
    case ft.PoisonMicroblock:
      break;
    case ft.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case ft.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Br(e.recipient));
      break;
    case ft.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Br(e.recipient ? aw(e.recipient) : ow())), t.push(e.vrfProof);
      break;
    case ft.TenureChange:
      t.push(it(e.tenureHash)), t.push(it(e.previousTenureHash)), t.push(it(e.burnViewHash)), t.push(it(e.previousTenureEnd)), t.push(bi(new Uint8Array(4), e.previousTenureBlocks)), t.push(i1(new Uint8Array(1), e.cause)), t.push(it(e.publicKeyHash));
      break;
  }
  return Gt(t);
}
function lE(e) {
  const t = Mn(e, kt) ? e : new kt(e);
  switch (t.readUInt8Enum(ft, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case ft.TokenTransfer:
      const r = Lr(t), s = mn(t.readBytes(8)), i = lw(t);
      return WA(r, s, i);
    case ft.ContractCall:
      const o = Io(t), c = Qn(t), l = Qn(t), h = [], p = t.readUInt32BE();
      for (let B = 0; B < p; B++) {
        const _ = Lr(t);
        h.push(_);
      }
      return ZA(o, c, l, h);
    case ft.SmartContract:
      const d = Qn(t), m = Qn(t, 4, 1e5);
      return Np(d, m);
    case ft.VersionedSmartContract: {
      const B = t.readUInt8Enum(Qu, (ae) => {
        throw new Error(`Cannot recognize ClarityVersion: ${ae}`);
      }), _ = Qn(t), W = Qn(t, 4, qv);
      return Np(_, W, B);
    }
    case ft.PoisonMicroblock:
      return QA();
    case ft.Coinbase: {
      const B = t.readBytes(gi);
      return _p(B);
    }
    case ft.CoinbaseToAltRecipient: {
      const B = t.readBytes(gi), _ = Lr(t);
      return _p(B, _);
    }
    case ft.NakamotoCoinbase: {
      const B = t.readBytes(gi), _ = Lr(t), W = t.readBytes(Ju);
      return eE(B, _, W);
    }
    case ft.TenureChange:
      const y = Ie(t.readBytes(20)), S = Ie(t.readBytes(20)), x = Ie(t.readBytes(20)), I = Ie(t.readBytes(32)), H = t.readUInt32BE(), U = t.readUInt8Enum(nd, (B) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${B}`);
      }), A = Ie(t.readBytes(20));
      return tE(y, S, x, I, H, U, A);
  }
}
function ad(e) {
  const t = Mn(e, kt) ? e : new kt(e);
  return id(Ie(t.readBytes($l)));
}
function uE(e) {
  const t = Mn(e, kt) ? e : new kt(e), n = t.readUInt8Enum(fr, (r) => {
    throw new xn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case fr.PublicKeyCompressed:
      return lo(Nt.Compressed, ld(t));
    case fr.PublicKeyUncompressed:
      return lo(Nt.Uncompressed, Uo(KE(ld(t).data)));
    case fr.SignatureCompressed:
      return lo(Nt.Compressed, ad(t));
    case fr.SignatureUncompressed:
      return lo(Nt.Uncompressed, ad(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function xf(e) {
  return it(e.data);
}
function dE(e) {
  const t = [];
  switch (e.contents.type) {
    case fe.PublicKey:
      t.push(e.pubKeyEncoding === Nt.Compressed ? fr.PublicKeyCompressed : fr.PublicKeyUncompressed), t.push(it(GE(e.contents.data)));
      break;
    case fe.MessageSignature:
      t.push(e.pubKeyEncoding === Nt.Compressed ? fr.SignatureCompressed : fr.SignatureUncompressed), t.push(xf(e.contents));
      break;
  }
  return Gt(t);
}
function cd(e) {
  return e.data.slice();
}
function ld(e) {
  const t = Mn(e, kt) ? e : new kt(e), n = t.readUInt8(), r = n === 4 ? jv : Fv;
  return Uo(Gt([n, t.readBytes(r)]));
}
function Sf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === mt.P2PKH || t === mt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === mt.P2WPKH || t === mt.P2WSH || t === mt.P2WSHNonSequential) && !r.map((s) => s.data).every(Ho))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case mt.P2PKH:
      return nc(e, PE(r[0].data));
    case mt.P2WPKH:
      return nc(e, UE(r[0].data));
    case mt.P2SH:
    case mt.P2SHNonSequential:
      return nc(e, HE(n, r.map(cd)));
    case mt.P2WSH:
    case mt.P2WSHNonSequential:
      return nc(e, OE(n, r.map(cd)));
  }
}
function nc(e, t) {
  return { type: fe.Address, version: e, hash160: t };
}
function vf(e) {
  return Di.c32address(e.version, e.hash160);
}
function Pp(e) {
  const [t, n, r] = e.split(/\.|::/);
  return nE(t, n, r);
}
function Zo(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return rE(t, n);
  } else
    return sE(e);
}
function fE(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return gE(t, n);
  } else
    return hE(e);
}
function hE(e) {
  const t = qs(e);
  return { type: tt.PrincipalStandard, value: vf(t) };
}
function pE(e) {
  return { type: tt.PrincipalStandard, value: vf(e) };
}
function gE(e, t) {
  const n = qs(e), r = wr(t);
  return pw(n, r);
}
function pw(e, t) {
  if (Pi(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: tt.PrincipalContract,
    value: `${vf(e)}.${t.content}`
  };
}
function yE(e) {
  return { type: tt.ResponseErr, value: e };
}
function wE(e) {
  return { type: tt.ResponseOk, value: e };
}
const mE = (e) => ({ type: tt.StringASCII, value: e }), bE = (e) => ({ type: tt.StringUTF8, value: e });
function xE(e) {
  for (const t in e)
    if (!DE(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: tt.Tuple, value: e };
}
function Lr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new kt(it(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new kt(e) : t = e;
  switch (t.readUInt8Enum(Yt, (r) => {
    throw new xn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Yt.int:
      return VA(Uu(t.readBytes(16)));
    case Yt.uint:
      return XA(t.readBytes(16));
    case Yt.buffer:
      const r = t.readUInt32BE();
      return GA(t.readBytes(r));
    case Yt.true:
      return RA();
    case Yt.false:
      return zA();
    case Yt.address:
      const s = Io(t);
      return pE(s);
    case Yt.contract:
      const i = Io(t), o = Qn(t);
      return pw(i, o);
    case Yt.ok:
      return wE(Lr(t));
    case Yt.err:
      return yE(Lr(t));
    case Yt.none:
      return ow();
    case Yt.some:
      return aw(Lr(t));
    case Yt.list:
      const c = t.readUInt32BE(), l = [];
      for (let x = 0; x < c; x++)
        l.push(Lr(t));
      return YA(l);
    case Yt.tuple:
      const h = t.readUInt32BE(), p = {};
      for (let x = 0; x < h; x++) {
        const I = Qn(t).content;
        if (I === void 0)
          throw new xn('"content" is undefined');
        p[I] = Lr(t);
      }
      return xE(p);
    case Yt.ascii:
      const d = t.readUInt32BE(), m = Zb(t.readBytes(d));
      return mE(m);
    case Yt.utf8:
      const y = t.readUInt32BE(), S = Ia(t.readBytes(y));
      return bE(S);
    default:
      throw new xn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Pr(e, t) {
  return Gt([wf(e), t]);
}
function SE(e) {
  return new Uint8Array([wf(e.type)]);
}
function vE(e) {
  return e.type === tt.OptionalNone ? new Uint8Array([wf(e.type)]) : Pr(e.type, Br(e.value));
}
function AE(e) {
  const t = new Uint8Array(4);
  return bi(t, Math.ceil(e.value.length / 2), 0), Pr(e.type, Nr(t, it(e.value)));
}
function EE(e) {
  const t = zd(Vb(BigInt(e.value), BigInt(Dv)), Zy);
  return Pr(e.type, t);
}
function kE(e) {
  const t = zd(BigInt(e.value), Zy);
  return Pr(e.type, t);
}
function $E(e) {
  return Pr(e.type, Ma(qs(e.value)));
}
function IE(e) {
  const [t, n] = FE(e.value);
  return Pr(e.type, Nr(Ma(qs(t)), Lo(wr(n))));
}
function LE(e) {
  return Pr(e.type, Br(e.value));
}
function CE(e) {
  const t = [], n = new Uint8Array(4);
  bi(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = Br(r);
    t.push(s);
  }
  return Pr(e.type, Gt(t));
}
function TE(e) {
  const t = [], n = new Uint8Array(4);
  bi(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = wr(s);
    t.push(Lo(i));
    const o = Br(e.value[s]);
    t.push(o);
  }
  return Pr(e.type, Gt(t));
}
function gw(e, t) {
  const n = [], r = t == "ascii" ? Wb(e.value) : Pi(e.value), s = new Uint8Array(4);
  return bi(s, r.length, 0), n.push(s), n.push(r), Pr(e.type, Gt(n));
}
function BE(e) {
  return gw(e, "ascii");
}
function ME(e) {
  return gw(e, "utf8");
}
function Up(e) {
  return Ie(Br(e));
}
function Br(e) {
  switch (e.type) {
    case tt.BoolTrue:
    case tt.BoolFalse:
      return SE(e);
    case tt.OptionalNone:
    case tt.OptionalSome:
      return vE(e);
    case tt.Buffer:
      return AE(e);
    case tt.UInt:
      return kE(e);
    case tt.Int:
      return EE(e);
    case tt.PrincipalStandard:
      return $E(e);
    case tt.PrincipalContract:
      return IE(e);
    case tt.ResponseOk:
    case tt.ResponseErr:
      return LE(e);
    case tt.List:
      return CE(e);
    case tt.Tuple:
      return TE(e);
    case tt.StringASCII:
      return BE(e);
    case tt.StringUTF8:
      return ME(e);
    default:
      throw new co("Unable to serialize. Invalid Clarity Value.");
  }
}
const NE = (e) => e.length % 2 ? `0${e}` : e, _E = (e, t) => e.padEnd(t, "0"), yw = (e, t) => e ? Pi(e).length > t : !1;
function ud(e) {
  return Xy(e);
}
const ga = (e) => pA(pf(e)), Af = (e) => Ie(jA(e)), PE = (e) => Ie(ga(e)), UE = (e) => {
  const t = ga(e), n = Nr(new Uint8Array([0]), new Uint8Array([t.length]), t), r = ga(n);
  return Ie(r);
}, HE = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + t.length), n.push(174);
  const r = Gt(n), s = ga(r);
  return Ie(s);
}, OE = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((l) => {
    n.push(l.length), n.push(l);
  }), n.push(80 + t.length), n.push(174);
  const r = Gt(n), s = pf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Gt(i), c = ga(o);
  return Ie(c);
};
function DE(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function FE(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
Ft.hmacSha256Sync = (e, ...t) => {
  const n = tw.create(pf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Uo(e) {
  return e = typeof e == "string" ? it(e) : e, {
    type: fe.PublicKey,
    data: e
  };
}
function jE(e, t, n = Nt.Compressed) {
  const r = t1(t), s = new Rn(Uh(r.r), Uh(r.s)), i = Ye.fromSignature(e, s, r.recoveryId), o = n === Nt.Compressed;
  return i.toHex(o);
}
function RE(e) {
  return typeof e == "string" ? e : Ie(e);
}
const Ef = RE;
function ww(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === e1;
}
function Ho(e) {
  return !Ef(e).startsWith("04");
}
function zE(e) {
  e = Gd(e);
  const t = ww(e);
  return Ie(La(e.slice(0, 32), t));
}
function GE(e) {
  return Ye.fromHex(Ef(e)).toHex(!0);
}
function KE(e) {
  return Ye.fromHex(Ef(e)).toHex(!1);
}
function VE(e, t) {
  e = Gd(e);
  const [n, r] = gl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return $a(r, 1) + Rn.fromHex(n).toCompactHex();
}
function kf() {
  return {
    type: fe.MessageSignature,
    data: Ie(new Uint8Array($l))
  };
}
function mw(e, t, n, r) {
  const s = Sf(0, e, 1, [Uo(t)]).hash160, i = Ho(t) ? Nt.Compressed : Nt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: mn(n),
    fee: mn(r),
    keyEncoding: i,
    signature: kf()
  };
}
function ya(e) {
  return "signature" in e;
}
function Hp(e) {
  return e === mt.P2SH || e === mt.P2WSH;
}
function XE(e) {
  return e === mt.P2SHNonSequential || e === mt.P2WSHNonSequential;
}
function Op(e) {
  const t = ud(e);
  return t.nonce = 0, t.fee = 0, ya(t) ? t.signature = kf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function YE(e) {
  const t = [
    e.hashMode,
    it(e.signer),
    Xs(e.nonce, 8),
    Xs(e.fee, 8),
    e.keyEncoding,
    xf(e.signature)
  ];
  return Gt(t);
}
function qE(e) {
  const t = [
    e.hashMode,
    it(e.signer),
    Xs(e.nonce, 8),
    Xs(e.fee, 8)
  ], n = mf(e.fields);
  t.push(bf(n));
  const r = new Uint8Array(2);
  return r1(r, e.signaturesRequired, 0), t.push(r), Gt(t);
}
function WE(e, t) {
  const n = Ie(t.readBytes(20)), r = BigInt(`0x${Ie(t.readBytes(8))}`), s = BigInt(`0x${Ie(t.readBytes(8))}`), i = t.readUInt8Enum(Nt, (c) => {
    throw new xn(`Could not parse ${c} as PubKeyEncoding`);
  });
  if (e === mt.P2WPKH && i != Nt.Compressed)
    throw new xn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = ad(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function ZE(e, t) {
  const n = Ie(t.readBytes(20)), r = BigInt("0x" + Ie(t.readBytes(8))), s = BigInt("0x" + Ie(t.readBytes(8))), i = dw(t, fe.TransactionAuthField).values;
  let o = !1, c = 0;
  for (const h of i)
    switch (h.contents.type) {
      case fe.PublicKey:
        Ho(h.contents.data) || (o = !0);
        break;
      case fe.MessageSignature:
        if (h.pubKeyEncoding === Nt.Uncompressed && (o = !0), c += 1, c === 65536)
          throw new di("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const l = t.readUInt16BE();
  if (o && (e === mt.P2WSH || e === mt.P2WSHNonSequential))
    throw new di("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: l
  };
}
function iu(e) {
  return ya(e) ? YE(e) : qE(e);
}
function ou(e) {
  const t = e.readUInt8Enum(mt, (n) => {
    throw new xn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === mt.P2PKH || t === mt.P2WPKH ? WE(t, e) : ZE(t, e);
}
function bw(e, t, n, r) {
  const i = e + Ie(new Uint8Array([t])) + Ie(Xs(n, 8)) + Ie(Xs(r, 8));
  if (it(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Af(it(i));
}
function xw(e, t, n) {
  const r = 33 + $l, s = Ho(t.data) ? Nt.Compressed : Nt.Uncompressed, i = e + NE(s.toString(16)) + n, o = it(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Af(o);
}
function JE(e, t, n, r, s) {
  const i = bw(e, t, n, r), o = VE(s, i), c = Uo(zE(s)), l = xw(i, c, o);
  return {
    nextSig: o,
    nextSigHash: l
  };
}
function Sw(e, t, n, r, s, i) {
  const o = bw(e, t, n, r), c = Uo(jE(o, i, s)), l = xw(o, c, i);
  return {
    pubKey: c,
    nextSigHash: l
  };
}
function QE() {
  const e = mw(mt.P2PKH, "", 0, 0);
  return e.signer = qA().hash160, e.keyEncoding = Nt.Compressed, e.signature = kf(), e;
}
function Dp(e, t, n) {
  return ya(e) ? e3(e, t, n) : t3(e, t, n);
}
function e3(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Sw(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), i = Sf(0, e.hashMode, 1, [r]).hash160;
  if (i !== e.signer)
    throw new di(`Signer hash does not equal hash of public key(s): ${i} != ${e.signer}`);
  return s;
}
function t3(e, t, n) {
  const r = [];
  let s = t, i = !1, o = 0;
  for (const l of e.fields)
    switch (l.contents.type) {
      case fe.PublicKey:
        Ho(l.contents.data) || (i = !0), r.push(l.contents);
        break;
      case fe.MessageSignature:
        l.pubKeyEncoding === Nt.Uncompressed && (i = !0);
        const { pubKey: h, nextSigHash: p } = Sw(s, n, e.fee, e.nonce, l.pubKeyEncoding, l.contents.data);
        if (Hp(e.hashMode) && (s = p), r.push(h), o += 1, o === 65536)
          throw new di("Too many signatures");
        break;
    }
  if (Hp(e.hashMode) && o !== e.signaturesRequired || XE(e.hashMode) && o < e.signaturesRequired)
    throw new di("Incorrect number of signatures");
  if (i && (e.hashMode === mt.P2WSH || e.hashMode === mt.P2WSHNonSequential))
    throw new di("Uncompressed keys are not allowed in this hash mode");
  const c = Sf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (c !== e.signer)
    throw new di(`Signer hash does not equal hash of public key(s): ${c} != ${e.signer}`);
  return s;
}
function vw(e) {
  return {
    authType: Ot.Standard,
    spendingCondition: e
  };
}
function Aw(e, t) {
  return {
    authType: Ot.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || mw(mt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Fp(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Ot.Standard:
        return vw(Op(e.spendingCondition));
      case Ot.Sponsored:
        return Aw(Op(e.spendingCondition), QE());
      default:
        throw new qc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function n3(e, t) {
  switch (e.authType) {
    case Ot.Standard:
      return Dp(e.spendingCondition, t, Ot.Standard);
    case Ot.Sponsored:
      return Dp(e.spendingCondition, t, Ot.Standard);
    default:
      throw new qc("Invalid origin auth type");
  }
}
function r3(e, t) {
  switch (e.authType) {
    case Ot.Standard:
      const n = {
        ...e.spendingCondition,
        fee: mn(t)
      };
      return { ...e, spendingCondition: n };
    case Ot.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: mn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function s3(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: mn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function i3(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: mn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function o3(e, t) {
  const n = {
    ...t,
    nonce: mn(t.nonce),
    fee: mn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function a3(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Ot.Standard:
      t.push(iu(e.spendingCondition));
      break;
    case Ot.Sponsored:
      t.push(iu(e.spendingCondition)), t.push(iu(e.sponsorSpendingCondition));
      break;
  }
  return Gt(t);
}
function c3(e) {
  const t = e.readUInt8Enum(Ot, (r) => {
    throw new xn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Ot.Standard:
      return n = ou(e), vw(n);
    case Ot.Sponsored:
      n = ou(e);
      const r = ou(e);
      return Aw(n, r);
  }
}
class l3 {
  constructor({ auth: t, payload: n, postConditions: r = mf([]), postConditionMode: s = Yc.Deny, transactionVersion: i, chainId: o, network: c = "mainnet" }) {
    c = Uv(c), this.transactionVersion = i ?? c.transactionVersion, this.chainId = o ?? c.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: mn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = On.Any;
  }
  signBegin() {
    const t = ud(this);
    return t.auth = Fp(t.auth), t.txid();
  }
  verifyBegin() {
    const t = ud(this);
    return t.auth = Fp(t.auth), t.txid();
  }
  verifyOrigin() {
    return n3(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Ot.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Ot.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Ot.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : Uo(t), r = this.auth.spendingCondition;
    if (r && !ya(r)) {
      const s = Ho(n.data);
      r.fields.push(lo(s ? Nt.Compressed : Nt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: i, nextSigHash: o } = JE(n, r, t.fee, t.nonce, s);
    if (ya(t))
      t.signature = id(i);
    else {
      const c = ww(s);
      t.fields.push(lo(c ? Nt.Compressed : Nt.Uncompressed, id(i)));
    }
    return o;
  }
  txid() {
    const t = this.serializeBytes();
    return Af(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Ot.Sponsored)
      throw new qc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = o3(this.auth, t);
  }
  setFee(t) {
    this.auth = r3(this.auth, t);
  }
  setNonce(t) {
    this.auth = s3(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Ot.Sponsored)
      throw new qc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = i3(this.auth, t);
  }
  serialize() {
    return Ie(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new co('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new co('"chainId" is undefined');
    if (this.auth === void 0)
      throw new co('"auth" is undefined');
    if (this.payload === void 0)
      throw new co('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return bi(n, this.chainId, 0), t.push(n), t.push(a3(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(bf(this.postConditions)), t.push(hw(this.payload)), Gt(t);
  }
}
function u3(e) {
  const t = Mn(e, kt) ? e : new kt(e), n = t.readUInt8Enum(Li, (p) => {
    throw new Error(`Could not parse ${p} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = c3(t), i = t.readUInt8Enum(On, (p) => {
    throw new Error(`Could not parse ${p} as AnchorMode`);
  }), o = t.readUInt8Enum(Yc, (p) => {
    throw new Error(`Could not parse ${p} as PostConditionMode`);
  }), c = dw(t, fe.PostCondition), l = lE(t), h = new l3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: l,
    postConditions: c,
    postConditionMode: o
  });
  return h.anchorMode = i, h;
}
const jp = BigInt("18446744073709551615");
function au(e) {
  const t = mn(e);
  if (t < 0n || t > jp)
    throw new RangeError(`Post-condition amount must be between 0 and ${jp} (u64 max), received: ${t}`);
  return t;
}
var dd;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(dd || (dd = {}));
var fd;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(fd || (fd = {}));
function d3(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: fe.PostCondition,
        conditionType: Lt.STX,
        principal: e.address === "origin" ? { type: fe.Principal, prefix: vn.Origin } : Zo(e.address),
        conditionCode: rc(e.condition),
        amount: au(e.amount)
      };
    case "ft-postcondition":
      return {
        type: fe.PostCondition,
        conditionType: Lt.Fungible,
        principal: e.address === "origin" ? { type: fe.Principal, prefix: vn.Origin } : Zo(e.address),
        conditionCode: rc(e.condition),
        amount: au(e.amount),
        asset: Pp(e.asset)
      };
    case "nft-postcondition":
      return {
        type: fe.PostCondition,
        conditionType: Lt.NonFungible,
        principal: e.address === "origin" ? { type: fe.Principal, prefix: vn.Origin } : Zo(e.address),
        conditionCode: rc(e.condition),
        asset: Pp(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: fe.PostCondition,
        conditionType: Lt.Staking,
        principal: e.address === "origin" ? { type: fe.Principal, prefix: vn.Origin } : Zo(e.address),
        conditionCode: rc(e.condition),
        amount: au(e.amount)
      };
    case "pox-postcondition":
      return {
        type: fe.PostCondition,
        conditionType: Lt.PoX,
        principal: e.address === "origin" ? { type: fe.Principal, prefix: vn.Origin } : Zo(e.address),
        conditionCode: f3(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function rc(e) {
  return dd[e];
}
function f3(e) {
  return fd[e];
}
function Ew(e) {
  const t = d3(e);
  return aE(t);
}
function h3(e, t, n) {
  return If(kw(e), n);
}
function kw(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = wa(r);
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
    return BigInt(`0x${y3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function $f(e, t = 8) {
  return (typeof e == "bigint" ? e : kw(e)).toString(16).padStart(t * 2, "0");
}
function If(e, t = 16) {
  const n = $f(e, t);
  return wa(n);
}
function p3(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const g3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function y3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += g3[n];
  return t;
}
function wa(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = t.slice(s, s + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Lf(e) {
  return new TextEncoder().encode(e);
}
function w3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function m3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Rp(e) {
  if (e.some(m3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Cf(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function rs(e) {
  return Cf(...e.map((t) => typeof t == "number" ? Rp([t]) : t instanceof Array ? Rp(t) : t));
}
function Cl(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var hd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(hd || (hd = {}));
hd.Mainnet;
const b3 = 128, x3 = 128, $w = 16;
var pd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(pd || (pd = {}));
var zp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(zp || (zp = {}));
var Gp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Gp || (Gp = {}));
var ur;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(ur || (ur = {}));
const cu = ["onChainOnly", "offChainOnly", "any"];
cu[0] + "", ur.OnChainOnly, cu[1] + "", ur.OffChainOnly, cu[2] + "", ur.Any, ur.OnChainOnly + "", ur.OnChainOnly, ur.OffChainOnly + "", ur.OffChainOnly, ur.Any + "", ur.Any;
var gd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(gd || (gd = {}));
gd.Mainnet;
var Kp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Kp || (Kp = {}));
var ai;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(ai || (ai = {}));
var Vp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Vp || (Vp = {}));
var Xp;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Xp || (Xp = {}));
var Yp;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Yp || (Yp = {}));
var qp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(qp || (qp = {}));
var Wp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Wp || (Wp = {}));
var Zp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Zp || (Zp = {}));
var yd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(yd || (yd = {}));
var Jp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Jp || (Jp = {}));
var Qp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(Qp || (Qp = {}));
function wd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function S3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Iw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function v3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wd(e.outputLen), wd(e.blockLen);
}
function A3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function E3(e, t) {
  Iw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const lu = {
  number: wd,
  bool: S3,
  bytes: Iw,
  hash: v3,
  exists: A3,
  output: E3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), kr = (e, t) => e << 32 - t | e >>> t, k3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!k3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function $3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Lw(e) {
  if (typeof e == "string" && (e = $3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let I3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ji(e) {
  const t = (r) => e().update(Lw(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function L3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + h, c, r);
}
let Tf = class extends I3 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = uu(this.buffer);
  }
  update(t) {
    lu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Lw(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const l = uu(t);
        for (; s <= i - o; o += s)
          this.process(l, o);
        continue;
      }
      r.set(t.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    lu.exists(this), lu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let d = o; d < s; d++)
      n[d] = 0;
    L3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = uu(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = l / 4, p = this.get();
    if (h > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < h; d++)
      c.setUint32(4 * d, p[d], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return t.length = s, t.pos = c, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
};
const C3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Cw = Uint8Array.from({ length: 16 }, (e, t) => t), T3 = Cw.map((e) => (9 * e + 5) % 16);
let Bf = [Cw], Mf = [T3];
for (let e = 0; e < 4; e++)
  for (let t of [Bf, Mf])
    t.push(t[e].map((n) => C3[n]));
const Tw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), B3 = Bf.map((e, t) => e.map((n) => Tw[t][n])), M3 = Mf.map((e, t) => e.map((n) => Tw[t][n])), N3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), sc = (e, t) => e << t | e >>> 32 - t;
function e0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const ic = new Uint32Array(16);
let P3 = class extends Tf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      ic[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, l = c, h = this.h3 | 0, p = h, d = this.h4 | 0, m = d;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = N3[y], I = _3[y], H = Bf[y], U = Mf[y], A = B3[y], B = M3[y];
      for (let _ = 0; _ < 16; _++) {
        const W = sc(r + e0(y, i, c, h) + ic[H[_]] + x, A[_]) + d | 0;
        r = d, d = h, h = sc(c, 10) | 0, c = i, i = W;
      }
      for (let _ = 0; _ < 16; _++) {
        const W = sc(s + e0(S, o, l, p) + ic[U[_]] + I, B[_]) + m | 0;
        s = m, m = p, p = sc(l, 10) | 0, l = o, o = W;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + h + m | 0, this.h3 + d + s | 0, this.h4 + r + o | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    ic.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ji(() => new P3());
const U3 = (e, t, n) => e & t ^ ~e & n, H3 = (e, t, n) => e & t ^ e & n ^ t & n, O3 = new Uint32Array([
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
let Bw = class extends Tf {
  constructor() {
    super(64, 32, 8, !1), this.A = Bs[0] | 0, this.B = Bs[1] | 0, this.C = Bs[2] | 0, this.D = Bs[3] | 0, this.E = Bs[4] | 0, this.F = Bs[5] | 0, this.G = Bs[6] | 0, this.H = Bs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: c, H: l } = this;
    return [t, n, r, s, i, o, c, l];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Ms[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Ms[d - 15], y = Ms[d - 2], S = kr(m, 7) ^ kr(m, 18) ^ m >>> 3, x = kr(y, 17) ^ kr(y, 19) ^ y >>> 10;
      Ms[d] = x + Ms[d - 7] + S + Ms[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: h, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const m = kr(c, 6) ^ kr(c, 11) ^ kr(c, 25), y = p + m + U3(c, l, h) + O3[d] + Ms[d] | 0, x = (kr(r, 2) ^ kr(r, 13) ^ kr(r, 22)) + H3(r, s, i) | 0;
      p = h, h = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, h = h + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, h, p);
  }
  roundClean() {
    Ms.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, D3 = class extends Bw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ji(() => new Bw());
ji(() => new D3());
const oc = BigInt(2 ** 32 - 1), md = BigInt(32);
function Mw(e, t = !1) {
  return t ? { h: Number(e & oc), l: Number(e >> md & oc) } : { h: Number(e >> md & oc) | 0, l: Number(e & oc) | 0 };
}
function F3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = Mw(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const j3 = (e, t) => BigInt(e >>> 0) << md | BigInt(t >>> 0), R3 = (e, t, n) => e >>> n, z3 = (e, t, n) => e << 32 - n | t >>> n, G3 = (e, t, n) => e >>> n | t << 32 - n, K3 = (e, t, n) => e << 32 - n | t >>> n, V3 = (e, t, n) => e << 64 - n | t >>> n - 32, X3 = (e, t, n) => e >>> n - 32 | t << 64 - n, Y3 = (e, t) => t, q3 = (e, t) => e, W3 = (e, t, n) => e << n | t >>> 32 - n, Z3 = (e, t, n) => t << n | e >>> 32 - n, J3 = (e, t, n) => t << n - 32 | e >>> 64 - n, Q3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function e4(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const t4 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), n4 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, r4 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), s4 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, i4 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), o4 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, ze = {
  fromBig: Mw,
  split: F3,
  toBig: j3,
  shrSH: R3,
  shrSL: z3,
  rotrSH: G3,
  rotrSL: K3,
  rotrBH: V3,
  rotrBL: X3,
  rotr32H: Y3,
  rotr32L: q3,
  rotlSH: W3,
  rotlSL: Z3,
  rotlBH: J3,
  rotlBL: Q3,
  add: e4,
  add3L: t4,
  add3H: n4,
  add4L: r4,
  add4H: s4,
  add5H: o4,
  add5L: i4
}, [a4, c4] = ze.split([
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
let Tl = class extends Tf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: l, Eh: h, El: p, Fh: d, Fl: m, Gh: y, Gl: S, Hh: x, Hl: I } = this;
    return [t, n, r, s, i, o, c, l, h, p, d, m, y, S, x, I];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l, h, p, d, m, y, S, x, I) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = h | 0, this.El = p | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = I | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ns[A] = t.getUint32(n), _s[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const B = Ns[A - 15] | 0, _ = _s[A - 15] | 0, W = ze.rotrSH(B, _, 1) ^ ze.rotrSH(B, _, 8) ^ ze.shrSH(B, _, 7), ae = ze.rotrSL(B, _, 1) ^ ze.rotrSL(B, _, 8) ^ ze.shrSL(B, _, 7), Z = Ns[A - 2] | 0, X = _s[A - 2] | 0, b = ze.rotrSH(Z, X, 19) ^ ze.rotrBH(Z, X, 61) ^ ze.shrSH(Z, X, 6), k = ze.rotrSL(Z, X, 19) ^ ze.rotrBL(Z, X, 61) ^ ze.shrSL(Z, X, 6), M = ze.add4L(ae, k, _s[A - 7], _s[A - 16]), N = ze.add4H(M, W, b, Ns[A - 7], Ns[A - 16]);
      Ns[A] = N | 0, _s[A] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: l, Dh: h, Dl: p, Eh: d, El: m, Fh: y, Fl: S, Gh: x, Gl: I, Hh: H, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const B = ze.rotrSH(d, m, 14) ^ ze.rotrSH(d, m, 18) ^ ze.rotrBH(d, m, 41), _ = ze.rotrSL(d, m, 14) ^ ze.rotrSL(d, m, 18) ^ ze.rotrBL(d, m, 41), W = d & y ^ ~d & x, ae = m & S ^ ~m & I, Z = ze.add5L(U, _, ae, c4[A], _s[A]), X = ze.add5H(Z, H, B, W, a4[A], Ns[A]), b = Z | 0, k = ze.rotrSH(r, s, 28) ^ ze.rotrBH(r, s, 34) ^ ze.rotrBH(r, s, 39), M = ze.rotrSL(r, s, 28) ^ ze.rotrBL(r, s, 34) ^ ze.rotrBL(r, s, 39), N = r & i ^ r & c ^ i & c, Y = s & o ^ s & l ^ o & l;
      H = x | 0, U = I | 0, x = y | 0, I = S | 0, y = d | 0, S = m | 0, { h: d, l: m } = ze.add(h | 0, p | 0, X | 0, b | 0), h = c | 0, p = l | 0, c = i | 0, l = o | 0, i = r | 0, o = s | 0;
      const O = ze.add3L(b, M, Y);
      r = ze.add3H(O, X, k, N), s = O | 0;
    }
    ({ h: r, l: s } = ze.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ze.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l } = ze.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h, l: p } = ze.add(this.Dh | 0, this.Dl | 0, h | 0, p | 0), { h: d, l: m } = ze.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: y, l: S } = ze.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: I } = ze.add(this.Gh | 0, this.Gl | 0, x | 0, I | 0), { h: H, l: U } = ze.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, i, o, c, l, h, p, d, m, y, S, x, I, H, U);
  }
  roundClean() {
    Ns.fill(0), _s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, l4 = class extends Tl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, u4 = class extends Tl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, d4 = class extends Tl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ji(() => new Tl());
ji(() => new l4());
ji(() => new u4());
ji(() => new d4());
function f4(e, t, n) {
  const s = b3;
  if (L4(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: pd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var tn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(tn || (tn = {}));
let h4 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Nw = class extends h4 {
  constructor(t) {
    super(t);
  }
};
function Bl(e) {
  const t = [];
  return t.push(wa($f(e.version, 1))), t.push(wa(e.hash160)), rs(t);
}
function p4(e) {
  const t = [];
  return t.push(e.prefix), t.push(Bl(e.address)), e.prefix === yd.Contract && t.push(ma(e.contractName)), rs(t);
}
function ma(e) {
  const t = [], n = Lf(e.content), r = n.byteLength;
  return t.push(wa($f(r, e.lengthPrefixBytes))), t.push(n), rs(t);
}
function g4(e) {
  const t = [];
  return t.push(Bl(e.address)), t.push(ma(e.contractName)), t.push(ma(e.assetName)), rs(t);
}
function _w(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(p4(e.principal)), (e.conditionType === ai.Fungible || e.conditionType === ai.NonFungible) && t.push(g4(e.assetInfo)), e.conditionType === ai.NonFungible && t.push(Ti(e.assetName)), t.push(e.conditionCode), e.conditionType === ai.STX || e.conditionType === ai.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Nw("The post-condition amount may not be larger than 8 bytes");
    t.push(h3(e.amount, !1, 8));
  }
  return rs(t);
}
function Ur(e, t) {
  return rs([e, t]);
}
function y4(e) {
  return new Uint8Array([e.type]);
}
function w4(e) {
  return e.type === tn.OptionalNone ? new Uint8Array([e.type]) : Ur(e.type, Ti(e.value));
}
function m4(e) {
  const t = new Uint8Array(4);
  return Cl(t, e.buffer.length, 0), Ur(e.type, Cf(t, e.buffer));
}
function b4(e) {
  const t = If(p3(e.value, BigInt(x3)), $w);
  return Ur(e.type, t);
}
function x4(e) {
  const t = If(e.value, $w);
  return Ur(e.type, t);
}
function S4(e) {
  return Ur(e.type, Bl(e.address));
}
function v4(e) {
  return Ur(e.type, Cf(Bl(e.address), ma(e.contractName)));
}
function A4(e) {
  return Ur(e.type, Ti(e.value));
}
function E4(e) {
  const t = [], n = new Uint8Array(4);
  Cl(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Ti(r);
    t.push(s);
  }
  return Ur(e.type, rs(t));
}
function k4(e) {
  const t = [], n = new Uint8Array(4);
  Cl(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = f4(s);
    t.push(ma(i));
    const o = Ti(e.data[s]);
    t.push(o);
  }
  return Ur(e.type, rs(t));
}
function Pw(e, t) {
  const n = [], r = t == "ascii" ? w3(e.data) : Lf(e.data), s = new Uint8Array(4);
  return Cl(s, r.length, 0), n.push(s), n.push(r), Ur(e.type, rs(n));
}
function $4(e) {
  return Pw(e, "ascii");
}
function I4(e) {
  return Pw(e, "utf8");
}
function Ti(e) {
  switch (e.type) {
    case tn.BoolTrue:
    case tn.BoolFalse:
      return y4(e);
    case tn.OptionalNone:
    case tn.OptionalSome:
      return w4(e);
    case tn.Buffer:
      return m4(e);
    case tn.UInt:
      return x4(e);
    case tn.Int:
      return b4(e);
    case tn.PrincipalStandard:
      return S4(e);
    case tn.PrincipalContract:
      return v4(e);
    case tn.ResponseOk:
    case tn.ResponseErr:
      return A4(e);
    case tn.List:
      return E4(e);
    case tn.Tuple:
      return k4(e);
    case tn.StringASCII:
      return $4(e);
    case tn.StringUTF8:
      return I4(e);
    default:
      throw new Nw("Unable to serialize. Invalid Clarity Value.");
  }
}
const L4 = (e, t) => e ? Lf(e).length > t : !1, C4 = "connect-ui";
let Lc, Uw, Dn = !1, bd = !1;
const ns = (e, t = "") => () => {
}, T4 = (e, t) => () => {
}, B4 = "{visibility:hidden}.hydrated{visibility:inherit}", t0 = {}, M4 = "http://www.w3.org/2000/svg", N4 = "http://www.w3.org/1999/xhtml", _4 = (e) => e != null, Nf = (e) => (e = typeof e, e === "object" || e === "function");
function Hw(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Oe = (e, t, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], c = (h) => {
    for (let p = 0; p < h.length; p++)
      r = h[p], Array.isArray(r) ? c(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !Nf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? xd(null, r) : r), i = s);
  };
  if (c(n), t) {
    const h = t.className || t.class;
    h && (t.class = typeof h != "object" ? h : Object.keys(h).filter((p) => h[p]).join(" "));
  }
  const l = xd(e, null);
  return l.$attrs$ = t, o.length > 0 && (l.$children$ = o), l;
}, xd = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, P4 = {}, U4 = (e) => e && e.$tag$ === P4, H4 = (e, t) => e != null && !Nf(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, O4 = (e) => Oo(e).$hostElement$, D4 = (e, t, n) => {
  const r = yn.ce(t, n);
  return e.dispatchEvent(r), r;
}, n0 = /* @__PURE__ */ new WeakMap(), F4 = (e, t, n) => {
  let r = Wc.get(e);
  ok && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, Wc.set(e, r);
}, j4 = (e, t, n, r) => {
  var s;
  let i = Ow(t);
  const o = Wc.get(i);
  if (e = e.nodeType === 11 ? e : Mr, o)
    if (typeof o == "string") {
      e = e.head || e;
      let c = n0.get(e), l;
      if (c || n0.set(e, c = /* @__PURE__ */ new Set()), !c.has(i)) {
        {
          l = Mr.createElement("style"), l.innerHTML = o;
          const h = (s = yn.$nonce$) !== null && s !== void 0 ? s : Hw(Mr);
          h != null && l.setAttribute("nonce", h), e.insertBefore(l, e.querySelector("link"));
        }
        c && c.add(i);
      }
    } else e.adoptedStyleSheets.includes(o) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, o]);
  return i;
}, R4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = ns("attachStyles", t.$tagName$), i = j4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Ow = (e, t) => "sc-" + e.$tagName$, r0 = (e, t, n, r, s, i) => {
  if (n !== r) {
    let o = i0(e, t), c = t.toLowerCase();
    if (t === "class") {
      const l = e.classList, h = s0(n), p = s0(r);
      l.remove(...h.filter((d) => d && !p.includes(d))), l.add(...p.filter((d) => d && !h.includes(d)));
    } else if (!o && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : i0(Ml, c) ? t = c.slice(2) : t = c[2] + t.slice(3), n && yn.rel(e, t, n, !1), r && yn.ael(e, t, r, !1);
    else {
      const l = Nf(r);
      if ((o || l && r !== null) && !s)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const h = r ?? "";
            t === "list" ? o = !1 : (n == null || e[t] != h) && (e[t] = h);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!o || i & 4 || s) && !l && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, z4 = /\s/, s0 = (e) => e ? e.split(z4) : [], Dw = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, i = e && e.$attrs$ || t0, o = t.$attrs$ || t0;
  for (r in i)
    r in o || r0(s, r, i[r], void 0, n, t.$flags$);
  for (r in o)
    r0(s, r, i[r], o[r], n, t.$flags$);
}, _f = (e, t, n, r) => {
  const s = t.$children$[n];
  let i = 0, o, c;
  if (s.$text$ !== null)
    o = s.$elm$ = Mr.createTextNode(s.$text$);
  else {
    if (Dn || (Dn = s.$tag$ === "svg"), o = s.$elm$ = Mr.createElementNS(Dn ? M4 : N4, s.$tag$), Dn && s.$tag$ === "foreignObject" && (Dn = !1), Dw(null, s, Dn), _4(Lc) && o["s-si"] !== Lc && o.classList.add(o["s-si"] = Lc), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        c = _f(e, s, i), c && o.appendChild(c);
    s.$tag$ === "svg" ? Dn = !1 : o.tagName === "foreignObject" && (Dn = !0);
  }
  return o;
}, Fw = (e, t, n, r, s, i) => {
  let o = e, c;
  for (o.shadowRoot && o.tagName === Uw && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (c = _f(null, n, s), c && (r[s].$elm$ = c, o.insertBefore(c, t)));
}, jw = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, G4 = (e, t, n, r) => {
  let s = 0, i = 0, o = t.length - 1, c = t[0], l = t[o], h = r.length - 1, p = r[0], d = r[h], m;
  for (; s <= o && i <= h; )
    c == null ? c = t[++s] : l == null ? l = t[--o] : p == null ? p = r[++i] : d == null ? d = r[--h] : ac(c, p) ? (sa(c, p), c = t[++s], p = r[++i]) : ac(l, d) ? (sa(l, d), l = t[--o], d = r[--h]) : ac(c, d) ? (sa(c, d), e.insertBefore(c.$elm$, l.$elm$.nextSibling), c = t[++s], d = r[--h]) : ac(l, p) ? (sa(l, p), e.insertBefore(l.$elm$, c.$elm$), l = t[--o], p = r[++i]) : (m = _f(t && t[i], n, i), p = r[++i], m && c.$elm$.parentNode.insertBefore(m, c.$elm$));
  s > o ? Fw(e, r[h + 1] == null ? null : r[h + 1].$elm$, n, r, i, h) : i > h && jw(t, s, o);
}, ac = (e, t) => e.$tag$ === t.$tag$, sa = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, i = t.$tag$, o = t.$text$;
  o === null ? (Dn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Dn, Dw(e, t, Dn), r !== null && s !== null ? G4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), Fw(n, null, t, s, 0, s.length - 1)) : r !== null && jw(r, 0, r.length - 1), Dn && i === "svg" && (Dn = !1)) : e.$text$ !== o && (n.data = o);
}, K4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || xd(null, null), s = U4(t) ? t : Oe(null, null, t);
  Uw = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Lc = n["s-sc"], sa(r, s);
}, Rw = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, Pf = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Rw(e, e.$ancestorComponent$), ck(() => V4(e, t));
}, V4 = (e, t) => {
  const n = ns("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), W4(s, () => X4(e, r, t));
}, X4 = async (e, t, n) => {
  const r = e.$hostElement$, s = ns("update", e.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && R4(e);
  const o = ns("render", e.$cmpMeta$.$tagName$);
  Y4(e, t), i && (i.map((c) => c()), r["s-rc"] = void 0), o(), s();
  {
    const c = r["s-p"], l = () => q4(e);
    c.length === 0 ? l() : (Promise.all(c).then(l), e.$flags$ |= 4, c.length = 0);
  }
}, Y4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, K4(e, t);
  } catch (r) {
    ba(r, e.$hostElement$);
  }
  return null;
}, q4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = ns("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Gw(n), r(), e.$onReadyResolve$(n), s || zw()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && Hf(() => Pf(e, !1)), e.$flags$ &= -517;
}, zw = (e) => {
  Gw(Mr.documentElement), Hf(() => D4(Ml, "appload", { detail: { namespace: C4 } }));
}, W4 = (e, t) => e && e.then ? e.then(t) : t(), Gw = (e) => e.classList.add("hydrated"), Z4 = (e, t) => Oo(e).$instanceValues$.get(t), J4 = (e, t, n, r) => {
  const s = Oo(e), i = s.$instanceValues$.get(t), o = s.$flags$, c = s.$lazyInstance$;
  n = H4(n, r.$members$[t][0]);
  const l = Number.isNaN(i) && Number.isNaN(n), h = n !== i && !l;
  (!(o & 8) || i === void 0) && h && (s.$instanceValues$.set(t, n), c && (o & 18) === 2 && Pf(s, !1));
}, Kw = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return Z4(this, i);
        },
        set(c) {
          J4(this, i, c, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, c, l) {
        yn.jmp(() => {
          const h = i.get(o);
          if (this.hasOwnProperty(h))
            l = this[h], delete this[h];
          else if (s.hasOwnProperty(h) && typeof this[h] == "number" && this[h] == l)
            return;
          this[h] = l === null && typeof this[h] == "boolean" ? !1 : l;
        });
      }, e.observedAttributes = r.filter(
        ([o, c]) => c[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([o, c]) => {
        const l = c[1] || o;
        return i.set(l, o), l;
      });
    }
  }
  return e;
}, Q4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = ik(n), s.then) {
        const l = T4();
        s = await s, l();
      }
      s.isProxied || (Kw(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const c = ns("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (l) {
        ba(l);
      }
      t.$flags$ &= -9, c();
    }
    if (s.style) {
      let c = s.style;
      const l = Ow(n);
      if (!Wc.has(l)) {
        const h = ns("registerStyles", n.$tagName$);
        F4(l, c, !!(n.$flags$ & 1)), h();
      }
    }
  }
  const i = t.$ancestorComponent$, o = () => Pf(t, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, ek = (e) => {
  if (!(yn.$flags$ & 1)) {
    const t = Oo(e), n = t.$cmpMeta$, r = ns("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Rw(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && e.hasOwnProperty(s)) {
          const o = e[s];
          delete e[s], e[s] = o;
        }
      }), Q4(e, t, n);
    }
    r();
  }
}, tk = (e) => {
  yn.$flags$ & 1 || Oo(e);
}, nk = (e, t = {}) => {
  var n;
  const r = ns(), s = [], i = t.exclude || [], o = Ml.customElements, c = Mr.head, l = /* @__PURE__ */ c.querySelector("meta[charset]"), h = /* @__PURE__ */ Mr.createElement("style"), p = [];
  let d, m = !0;
  Object.assign(yn, t), yn.$resourcesUrl$ = new URL(t.resourcesUrl || "./", Mr.baseURI).href, e.map((y) => {
    y[1].map((S) => {
      const x = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      x.$members$ = S[2];
      const I = x.$tagName$, H = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, sk(U, x), x.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), m ? p.push(this) : yn.jmp(() => ek(this));
        }
        disconnectedCallback() {
          yn.jmp(() => tk(this));
        }
        componentOnReady() {
          return Oo(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = y[0], !i.includes(I) && !o.get(I) && (s.push(I), o.define(I, Kw(
        H,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    h.innerHTML = s + B4, h.setAttribute("data-styles", "");
    const y = (n = yn.$nonce$) !== null && n !== void 0 ? n : Hw(Mr);
    y != null && h.setAttribute("nonce", y), c.insertBefore(h, l ? l.nextSibling : c.firstChild);
  }
  m = !1, p.length ? p.map((y) => y.connectedCallback()) : yn.jmp(() => d = setTimeout(zw, 30)), r();
}, Uf = /* @__PURE__ */ new WeakMap(), Oo = (e) => Uf.get(e), rk = (e, t) => Uf.set(t.$lazyInstance$ = e, t), sk = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], Uf.set(e, n);
}, i0 = (e, t) => t in e, ba = (e, t) => (0, console.error)(e, t), du = /* @__PURE__ */ new Map(), ik = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, i = du.get(s);
  if (i)
    return i[r];
  {
    const o = (c) => (du.set(s, c), c[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => PL).then(o, ba);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (du.set(s, o), o[r]), ba);
}, Wc = /* @__PURE__ */ new Map(), Ml = typeof window < "u" ? window : {}, Mr = Ml.document || { head: {} }, yn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, Vw = (e) => Promise.resolve(e), ok = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), o0 = [], Xw = [], ak = (e, t) => (n) => {
  e.push(n), bd || (bd = !0, yn.$flags$ & 4 ? Hf(Sd) : yn.raf(Sd));
}, a0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      ba(n);
    }
  e.length = 0;
}, Sd = () => {
  a0(o0), a0(Xw), (bd = o0.length > 0) && yn.raf(Sd);
}, Hf = (e) => Vw().then(e), ck = /* @__PURE__ */ ak(Xw), lk = () => Vw(), uk = (e, t) => typeof window > "u" ? Promise.resolve() : lk().then(() => nk([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var dk = Object.defineProperty, fk = Object.defineProperties, hk = Object.getOwnPropertyDescriptors, Zc = Object.getOwnPropertySymbols, Yw = Object.prototype.hasOwnProperty, qw = Object.prototype.propertyIsEnumerable, c0 = (e, t, n) => t in e ? dk(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Gn = (e, t) => {
  for (var n in t || (t = {})) Yw.call(t, n) && c0(e, n, t[n]);
  if (Zc) for (var n of Zc(t)) qw.call(t, n) && c0(e, n, t[n]);
  return e;
}, mr = (e, t) => fk(e, hk(t)), Ww = (e, t) => {
  var n = {};
  for (var r in e) Yw.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Zc) for (var r of Zc(e)) t.indexOf(r) < 0 && qw.call(e, r) && (n[r] = e[r]);
  return n;
};
function Zw() {
  return kl(Ei()) || window.StacksProvider || window.BlockstackProvider;
}
function Nl(e) {
  return e ? typeof e == "string" ? $i.fromName(e) : "version" in e ? e : "url" in e ? new qu({ url: e.url }) : e.transactionVersion === Li.Mainnet ? new qu({ url: e.client.baseUrl }) : new Wu({ url: e.client.baseUrl }) : new Wu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var pk = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(pk || {}), gk = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(gk || {}), Of = (e) => {
  let t = e;
  if (!t) {
    let n = new Tg(["store_write"], document.location.href);
    t = new Yu({ appConfig: n });
  }
  return t;
};
function Jw(e) {
  try {
    return Of(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Qw = (e) => {
  let t = Of(e).loadUserData().appPrivateKey, n = dn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function yk(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let i = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, o = { [Ii.Mainnet]: "mainnet", [Ii.Testnet]: "testnet" }, c = Nl(s);
  return i == null ? void 0 : i[o[c.chainId]];
}
function wk(e) {
  let t = Nl(e.network), n = Of(e.userSession), r = mr(Gn({}, e), { network: t, userSession: n });
  return Gn({ stxAddress: yk(r) }, r);
}
async function mk(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Ew) : n = n.map((r) => Ie(_w(r)))), new dn.TokenSigner("ES256k", t).signAsync(mr(Gn({}, e), { postConditions: n }));
}
function bk(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(Ew) : t = t.map((n) => Ie(_w(n)))), dn.createUnsecuredToken(mr(Gn({}, e), { postConditions: t }));
}
var xk = async ({ token: e, options: t }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(e), { txRaw: c } = o, l = it(c.replace(/^0x/, "")), h = u3(l);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, mr(Gn({}, o), { stacksTransaction: h }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, mr(Gn({}, o), { stacksTransaction: h }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = t.onCancel) == null || i.call(t);
  }
}, Sk = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, i = Ww(t, ["amount", "appDetails", "userSession"]);
  if (Jw(s)) {
    let { privateKey: c, publicKey: l } = Qw(s), h = mr(Gn({}, i), { amount: n.toString(10), publicKey: l, txType: "token_transfer" });
    return r && (h.appDetails = r), mk(h, c);
  }
  let o = mr(Gn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), bk(o);
};
async function vk(e, t, n) {
  let r = await t(mr(Gn(Gn({}, wk(e)), e), { network: Nl(e.network) }));
  return xk({ token: r, options: e }, n);
}
function Ak(e, t = Zw()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return vk(e, Sk, t);
}
function em(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? mr(Gn({}, e), { message: Up(t), domain: Up(n) }) : mr(Gn({}, e), { message: Ie(Ti(t)), domain: Ie(Ti(n)) });
}
async function Ek(e, t) {
  return new dn.TokenSigner("ES256k", t).signAsync(em(e));
}
async function kk(e) {
  let t = e, { userSession: n } = t, r = Ww(t, ["userSession"]);
  if (Jw(n)) {
    let { privateKey: s, publicKey: i } = Qw(n), o = mr(Gn({}, r), { publicKey: i });
    return Ek(o, s);
  }
  return dn.createUnsecuredToken(em(e));
}
var $k = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))($k || {}), tm = "asigna-stx", l0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === tm && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Lk(e, t), "*");
}), Ik = { authenticationRequest: async (e) => l0(e, "authenticationRequest"), transactionRequest: async (e) => l0(e, "transactionRequest") }, Lk = (e, t) => ({ source: tm, [t]: e }), Ck = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Ik);
};
Ck();
var Tk = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function Bk(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let i = Ei(), o = Zw();
    if (i && o) return e(n, o);
    if (typeof window > "u") return;
    uk();
    let c = (s = n == null ? void 0 : n.defaultProviders) != null ? s : Tk, l = vv(c), h = document.createElement("connect-modal");
    h.defaultProviders = c, h.installedProviders = l, h.persistSelection = t;
    let p = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      h.remove(), document.body.style.overflow = p;
    };
    h.callback = (y) => {
      d(), e(n, y);
    }, h.cancelCallback = () => {
      var y;
      d(), (y = n.onCancel) == null || y.call(n);
    }, document.body.appendChild(h);
    let m = (y) => {
      y.key === "Escape" && (document.removeEventListener("keydown", m), h.remove());
    };
    document.addEventListener("keydown", m);
  };
}
var cc = Bk(Ak);
function Ys(e, t, n) {
  return Df(kn(e, t), n);
}
function kn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Tt(r);
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
      const r = _k(BigInt(`0x${We(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${We(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function u0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Na(e, t = 8) {
  return (typeof e == "bigint" ? e : kn(e, !1)).toString(16).padStart(t * 2, "0");
}
function _l(e) {
  return parseInt(e, 16);
}
function Df(e, t = 16) {
  const n = Na(e, t);
  return Tt(n);
}
function Mk(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function Nk(e, t) {
  return e & BigInt(1) << t;
}
function _k(e, t) {
  return Nk(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const Pk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function We(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Pk[n];
  return t;
}
function Tt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = t.slice(s, s + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Do(e) {
  return new TextEncoder().encode(e);
}
function Ff(e) {
  return new TextDecoder().decode(e);
}
function nm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Uk(e) {
  return String.fromCharCode.apply(null, e);
}
function Hk(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function d0(e) {
  if (e.some(Hk))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Pl(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Kt(e) {
  return Pl(...e.map((t) => typeof t == "number" ? d0([t]) : t instanceof Array ? d0(t) : t));
}
var f0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(f0 || (f0 = {}));
var h0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(h0 || (h0 = {}));
var p0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(p0 || (p0 = {}));
const rm = 33, fu = 32;
function Ok(e) {
  if (e.length < fu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + fu * 2), r = e.slice(2 + fu * 2);
  return {
    recoveryId: _l(t),
    r: n,
    s: r
  };
}
function Dk(e) {
  const t = typeof e == "string" ? Tt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function Fk(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function jk(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function Rk(e, t) {
  return e[t];
}
function zk(e, t, n = 0) {
  return e[n] = t, e;
}
function Gk(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Bi(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var vd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(vd || (vd = {}));
const Kk = vd.Mainnet, Vk = 128, Xk = 128, sm = 16, yi = 32, Ad = 80, Ul = 65, Yk = 32, qk = 64, Jc = 34;
var Ae;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Ae || (Ae = {}));
var Xe;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Xe || (Xe = {}));
var Ed;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Ed || (Ed = {}));
var Tn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Tn || (Tn = {}));
const Cc = ["onChainOnly", "offChainOnly", "any"], g0 = {
  [Cc[0]]: Tn.OnChainOnly,
  [Cc[1]]: Tn.OffChainOnly,
  [Cc[2]]: Tn.Any,
  [Tn.OnChainOnly]: Tn.OnChainOnly,
  [Tn.OffChainOnly]: Tn.OffChainOnly,
  [Tn.Any]: Tn.Any
};
function Wk(e) {
  if (e in g0)
    return g0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${Cc.join(", ")}`);
}
var Qc;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Qc || (Qc = {}));
Qc.Mainnet;
var Co;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Co || (Co = {}));
var Bn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Bn || (Bn = {}));
var Dt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Dt || (Dt = {}));
var bt;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(bt || (bt = {}));
var el;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(el || (el = {}));
var _t;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(_t || (_t = {}));
var xa;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(xa || (xa = {}));
var kd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(kd || (kd = {}));
var Sa;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Sa || (Sa = {}));
var y0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(y0 || (y0 = {}));
var w0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(w0 || (w0 = {}));
function $d(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Zk(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function im(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Jk(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  $d(e.outputLen), $d(e.blockLen);
}
function Qk(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function e8(e, t) {
  im(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const hi = {
  number: $d,
  bool: Zk,
  bytes: im,
  hash: Jk,
  exists: Qk,
  output: e8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const hu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), $r = (e, t) => e << 32 - t | e >>> t, t8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!t8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function n8(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function jf(e) {
  if (typeof e == "string" && (e = n8(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class om {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ri(e) {
  const t = (r) => e().update(jf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function r8(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, h = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + h, c, r);
}
class Rf extends om {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = hu(this.buffer);
  }
  update(t) {
    hi.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = jf(t);
    const i = t.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const l = hu(t);
        for (; s <= i - o; o += s)
          this.process(l, o);
        continue;
      }
      r.set(t.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    hi.exists(this), hi.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let d = o; d < s; d++)
      n[d] = 0;
    r8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = hu(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = l / 4, p = this.get();
    if (h > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < h; d++)
      c.setUint32(4 * d, p[d], i);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return t.length = s, t.pos = c, t.finished = i, t.destroyed = o, s % n && t.buffer.set(r), t;
  }
}
const s8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), am = Uint8Array.from({ length: 16 }, (e, t) => t), i8 = am.map((e) => (9 * e + 5) % 16);
let zf = [am], Gf = [i8];
for (let e = 0; e < 4; e++)
  for (let t of [zf, Gf])
    t.push(t[e].map((n) => s8[n]));
const cm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), o8 = zf.map((e, t) => e.map((n) => cm[t][n])), a8 = Gf.map((e, t) => e.map((n) => cm[t][n])), c8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), l8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), lc = (e, t) => e << t | e >>> 32 - t;
function m0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const uc = new Uint32Array(16);
class u8 extends Rf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: i } = this;
    return [t, n, r, s, i];
  }
  set(t, n, r, s, i) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      uc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, l = c, h = this.h3 | 0, p = h, d = this.h4 | 0, m = d;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = c8[y], I = l8[y], H = zf[y], U = Gf[y], A = o8[y], B = a8[y];
      for (let _ = 0; _ < 16; _++) {
        const W = lc(r + m0(y, i, c, h) + uc[H[_]] + x, A[_]) + d | 0;
        r = d, d = h, h = lc(c, 10) | 0, c = i, i = W;
      }
      for (let _ = 0; _ < 16; _++) {
        const W = lc(s + m0(S, o, l, p) + uc[U[_]] + I, B[_]) + m | 0;
        s = m, m = p, p = lc(l, 10) | 0, l = o, o = W;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + h + m | 0, this.h3 + d + s | 0, this.h4 + r + o | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    uc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const d8 = Ri(() => new u8()), f8 = (e, t, n) => e & t ^ ~e & n, h8 = (e, t, n) => e & t ^ e & n ^ t & n, p8 = new Uint32Array([
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
class lm extends Rf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ps[0] | 0, this.B = Ps[1] | 0, this.C = Ps[2] | 0, this.D = Ps[3] | 0, this.E = Ps[4] | 0, this.F = Ps[5] | 0, this.G = Ps[6] | 0, this.H = Ps[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: i, F: o, G: c, H: l } = this;
    return [t, n, r, s, i, o, c, l];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Us[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Us[d - 15], y = Us[d - 2], S = $r(m, 7) ^ $r(m, 18) ^ m >>> 3, x = $r(y, 17) ^ $r(y, 19) ^ y >>> 10;
      Us[d] = x + Us[d - 7] + S + Us[d - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: h, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const m = $r(c, 6) ^ $r(c, 11) ^ $r(c, 25), y = p + m + f8(c, l, h) + p8[d] + Us[d] | 0, x = ($r(r, 2) ^ $r(r, 13) ^ $r(r, 22)) + h8(r, s, i) | 0;
      p = h, h = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, h = h + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, h, p);
  }
  roundClean() {
    Us.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class g8 extends lm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Kf = Ri(() => new lm());
Ri(() => new g8());
const dc = BigInt(2 ** 32 - 1), Id = BigInt(32);
function um(e, t = !1) {
  return t ? { h: Number(e & dc), l: Number(e >> Id & dc) } : { h: Number(e >> Id & dc) | 0, l: Number(e & dc) | 0 };
}
function y8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = um(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const w8 = (e, t) => BigInt(e >>> 0) << Id | BigInt(t >>> 0), m8 = (e, t, n) => e >>> n, b8 = (e, t, n) => e << 32 - n | t >>> n, x8 = (e, t, n) => e >>> n | t << 32 - n, S8 = (e, t, n) => e << 32 - n | t >>> n, v8 = (e, t, n) => e << 64 - n | t >>> n - 32, A8 = (e, t, n) => e >>> n - 32 | t << 64 - n, E8 = (e, t) => t, k8 = (e, t) => e, $8 = (e, t, n) => e << n | t >>> 32 - n, I8 = (e, t, n) => t << n | e >>> 32 - n, L8 = (e, t, n) => t << n - 32 | e >>> 64 - n, C8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function T8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const B8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), M8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, N8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), _8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, P8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), U8 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Ge = {
  fromBig: um,
  split: y8,
  toBig: w8,
  shrSH: m8,
  shrSL: b8,
  rotrSH: x8,
  rotrSL: S8,
  rotrBH: v8,
  rotrBL: A8,
  rotr32H: E8,
  rotr32L: k8,
  rotlSH: $8,
  rotlSL: I8,
  rotlBH: L8,
  rotlBL: C8,
  add: T8,
  add3L: B8,
  add3H: M8,
  add4L: N8,
  add4H: _8,
  add5H: U8,
  add5L: P8
}, [H8, O8] = Ge.split([
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
].map((e) => BigInt(e))), Hs = new Uint32Array(80), Os = new Uint32Array(80);
class Hl extends Rf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: l, Eh: h, El: p, Fh: d, Fl: m, Gh: y, Gl: S, Hh: x, Hl: I } = this;
    return [t, n, r, s, i, o, c, l, h, p, d, m, y, S, x, I];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l, h, p, d, m, y, S, x, I) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = h | 0, this.El = p | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = I | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Hs[A] = t.getUint32(n), Os[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const B = Hs[A - 15] | 0, _ = Os[A - 15] | 0, W = Ge.rotrSH(B, _, 1) ^ Ge.rotrSH(B, _, 8) ^ Ge.shrSH(B, _, 7), ae = Ge.rotrSL(B, _, 1) ^ Ge.rotrSL(B, _, 8) ^ Ge.shrSL(B, _, 7), Z = Hs[A - 2] | 0, X = Os[A - 2] | 0, b = Ge.rotrSH(Z, X, 19) ^ Ge.rotrBH(Z, X, 61) ^ Ge.shrSH(Z, X, 6), k = Ge.rotrSL(Z, X, 19) ^ Ge.rotrBL(Z, X, 61) ^ Ge.shrSL(Z, X, 6), M = Ge.add4L(ae, k, Os[A - 7], Os[A - 16]), N = Ge.add4H(M, W, b, Hs[A - 7], Hs[A - 16]);
      Hs[A] = N | 0, Os[A] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: l, Dh: h, Dl: p, Eh: d, El: m, Fh: y, Fl: S, Gh: x, Gl: I, Hh: H, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const B = Ge.rotrSH(d, m, 14) ^ Ge.rotrSH(d, m, 18) ^ Ge.rotrBH(d, m, 41), _ = Ge.rotrSL(d, m, 14) ^ Ge.rotrSL(d, m, 18) ^ Ge.rotrBL(d, m, 41), W = d & y ^ ~d & x, ae = m & S ^ ~m & I, Z = Ge.add5L(U, _, ae, O8[A], Os[A]), X = Ge.add5H(Z, H, B, W, H8[A], Hs[A]), b = Z | 0, k = Ge.rotrSH(r, s, 28) ^ Ge.rotrBH(r, s, 34) ^ Ge.rotrBH(r, s, 39), M = Ge.rotrSL(r, s, 28) ^ Ge.rotrBL(r, s, 34) ^ Ge.rotrBL(r, s, 39), N = r & i ^ r & c ^ i & c, Y = s & o ^ s & l ^ o & l;
      H = x | 0, U = I | 0, x = y | 0, I = S | 0, y = d | 0, S = m | 0, { h: d, l: m } = Ge.add(h | 0, p | 0, X | 0, b | 0), h = c | 0, p = l | 0, c = i | 0, l = o | 0, i = r | 0, o = s | 0;
      const O = Ge.add3L(b, M, Y);
      r = Ge.add3H(O, X, k, N), s = O | 0;
    }
    ({ h: r, l: s } = Ge.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ge.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l } = Ge.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h, l: p } = Ge.add(this.Dh | 0, this.Dl | 0, h | 0, p | 0), { h: d, l: m } = Ge.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: y, l: S } = Ge.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: I } = Ge.add(this.Gh | 0, this.Gl | 0, x | 0, I | 0), { h: H, l: U } = Ge.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, i, o, c, l, h, p, d, m, y, S, x, I, H, U);
  }
  roundClean() {
    Hs.fill(0), Os.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class D8 extends Hl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class F8 extends Hl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class j8 extends Hl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ri(() => new Hl());
Ri(() => new D8());
const R8 = Ri(() => new F8());
Ri(() => new j8());
function dm(e) {
  if (Tt(e).byteLength != Ul)
    throw Error("Invalid signature");
  return {
    type: Ae.MessageSignature,
    data: e
  };
}
function ia(e, t) {
  return { type: Ae.Address, version: e, hash160: t };
}
function uo(e) {
  return Di.c32address(e.version, e.hash160);
}
function Mi(e, t, n) {
  const r = t || 1, s = n || Vk;
  if (Lm(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ae.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Vf(e) {
  const t = Di.c32addressDecode(e);
  return {
    type: Ae.Address,
    version: t[0],
    hash160: t[1]
  };
}
var re;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(re || (re = {}));
function z8(e) {
  if (e.type === re.PrincipalStandard)
    return uo(e.address);
  if (e.type === re.PrincipalContract)
    return `${uo(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function fm(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return V8(t, n);
  } else
    return G8(e);
}
function G8(e) {
  const t = Vf(e);
  return { type: re.PrincipalStandard, address: t };
}
function K8(e) {
  return { type: re.PrincipalStandard, address: e };
}
function V8(e, t) {
  const n = Vf(e), r = Mi(t);
  return hm(n, r);
}
function hm(e, t) {
  if (Do(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: re.PrincipalContract, address: e, contractName: t };
}
function pu(e, t = !1) {
  switch (e.type) {
    case re.BoolTrue:
      return !0;
    case re.BoolFalse:
      return !1;
    case re.Int:
    case re.UInt:
      return t ? e.value.toString() : e.value;
    case re.Buffer:
      return `0x${We(e.buffer)}`;
    case re.OptionalNone:
      return null;
    case re.OptionalSome:
      return hr(e.value);
    case re.ResponseErr:
      return hr(e.value);
    case re.ResponseOk:
      return hr(e.value);
    case re.PrincipalStandard:
    case re.PrincipalContract:
      return z8(e);
    case re.List:
      return e.list.map((r) => hr(r));
    case re.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = hr(e.data[r]);
      }), n;
    case re.StringASCII:
      return e.data;
    case re.StringUTF8:
      return e.data;
  }
}
function hr(e) {
  switch (e.type) {
    case re.ResponseErr:
      return { type: js(e), value: pu(e, !0), success: !1 };
    case re.ResponseOk:
      return { type: js(e), value: pu(e, !0), success: !0 };
    default:
      return { type: js(e), value: pu(e, !0) };
  }
}
function js(e) {
  switch (e.type) {
    case re.BoolTrue:
    case re.BoolFalse:
      return "bool";
    case re.Int:
      return "int";
    case re.UInt:
      return "uint";
    case re.Buffer:
      return `(buff ${e.buffer.length})`;
    case re.OptionalNone:
      return "(optional none)";
    case re.OptionalSome:
      return `(optional ${js(e.value)})`;
    case re.ResponseErr:
      return `(response UnknownType ${js(e.value)})`;
    case re.ResponseOk:
      return `(response ${js(e.value)} UnknownType)`;
    case re.PrincipalStandard:
    case re.PrincipalContract:
      return "principal";
    case re.List:
      return `(list ${e.list.length} ${e.list.length ? js(e.list[0]) : "UnknownType"})`;
    case re.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${js(e.data[t])})`).join(" ")})`;
    case re.StringASCII:
      return `(string-ascii ${nm(e.data).length})`;
    case re.StringUTF8:
      return `(string-utf8 ${Do(e.data).length})`;
  }
}
const pm = () => ({ type: re.BoolTrue }), gm = () => ({ type: re.BoolFalse }), X8 = (e) => e ? pm() : gm(), b0 = BigInt("0xffffffffffffffffffffffffffffffff"), Y8 = BigInt(0), x0 = BigInt("0x7fffffffffffffffffffffffffffffff"), S0 = BigInt("-170141183460469231731687303715884105728"), q8 = (e) => {
  const t = kn(e, !0);
  if (t > x0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${x0}`);
  if (t < S0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${S0}`);
  return { type: re.Int, value: t };
}, En = (e) => {
  const t = kn(e, !1);
  if (t < Y8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > b0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${b0}`);
  return { type: re.UInt, value: t };
}, ym = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: re.Buffer, buffer: e };
};
function wm() {
  return { type: re.OptionalNone };
}
function mm(e) {
  return { type: re.OptionalSome, value: e };
}
function W8(e) {
  return { type: re.ResponseErr, value: e };
}
function Z8(e) {
  return { type: re.ResponseOk, value: e };
}
function J8(e) {
  return { type: re.List, list: e };
}
function br(e) {
  for (const t in e)
    if (!j$(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: re.Tuple, data: e };
}
const xt = (e) => ({ type: re.StringASCII, data: e }), Q8 = (e) => ({ type: re.StringUTF8, data: e });
class bm extends om {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, hi.hash(t);
    const r = jf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? t.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = t.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(t) {
    return hi.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    hi.exists(this), hi.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: c } = this;
    return t = t, t.finished = s, t.destroyed = i, t.blockLen = o, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const xm = (e, t, n) => new bm(e, t).update(n).digest();
xm.create = (e, t) => new bm(e, t);
Ft.hmacSha256Sync = (e, ...t) => {
  const n = xm.create(Kf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function To(e) {
  return {
    type: Ae.PublicKey,
    data: Tt(e)
  };
}
function e$(e, t, n = _t.Compressed) {
  const r = Ok(t.data), s = new Rn(u0(r.r), u0(r.s)), i = Ye.fromSignature(e, s, r.recoveryId), o = n === _t.Compressed;
  return i.toHex(o);
}
function t$(e) {
  return { type: Ae.PublicKey, data: e };
}
function Fo(e) {
  return !We(e.data).startsWith("04");
}
function tl(e) {
  return e.data.slice();
}
function n$(e) {
  const t = i$(e), n = La(t.data.slice(0, 32), t.compressed);
  return To(We(n));
}
function r$(e) {
  const t = typeof e == "string" ? e : We(e), n = Ye.fromHex(t).toHex(!0);
  return To(n);
}
function s$(e) {
  const t = typeof e == "string" ? e : We(e), n = Ye.fromHex(t).toHex(!1);
  return To(n);
}
function Ld(e) {
  const t = e.readUInt8(), n = t === 4 ? qk : Yk;
  return t$(Kt([t, e.readBytes(n)]));
}
function i$(e) {
  const t = Dk(e), n = t.length == rm;
  return { data: t, compressed: n };
}
function o$(e, t) {
  const [n, r] = gl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Na(r, 1) + Rn.fromHex(n).toCompactHex();
  return dm(i);
}
function a$(e) {
  return n$(e.data);
}
function c$(e, t, n) {
  return typeof e == "string" && (e = fm(e)), typeof n == "string" && (n = E0(n)), {
    type: Ae.Payload,
    payloadType: Xe.TokenTransfer,
    recipient: e,
    amount: kn(t, !1),
    memo: n ?? E0("")
  };
}
function l$(e, t, n, r) {
  return typeof e == "string" && (e = Vf(e)), typeof t == "string" && (t = Mi(t)), typeof n == "string" && (n = Mi(n)), {
    type: Ae.Payload,
    payloadType: Xe.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function v0(e, t, n) {
  return typeof e == "string" && (e = Mi(e)), typeof t == "string" && (t = m$(t)), typeof n == "number" ? {
    type: Ae.Payload,
    payloadType: Xe.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Ae.Payload,
    payloadType: Xe.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function u$() {
  return { type: Ae.Payload, payloadType: Xe.PoisonMicroblock };
}
function A0(e, t) {
  if (e.byteLength != yi)
    throw Error(`Coinbase buffer size must be ${yi} bytes`);
  return t != null ? {
    type: Ae.Payload,
    payloadType: Xe.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Ae.Payload,
    payloadType: Xe.Coinbase,
    coinbaseBytes: e
  };
}
function d$(e, t, n) {
  if (e.byteLength != yi)
    throw Error(`Coinbase buffer size must be ${yi} bytes`);
  if (n.byteLength != Ad)
    throw Error(`VRF proof buffer size must be ${Ad} bytes`);
  return {
    type: Ae.Payload,
    payloadType: Xe.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === re.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var Cd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Cd || (Cd = {}));
function f$(e, t, n, r, s, i, o) {
  return {
    type: Ae.Payload,
    payloadType: Xe.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Sm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case Xe.TokenTransfer:
      t.push(Rt(e.recipient)), t.push(Ys(e.amount, !1, 8)), t.push(Yr(e.memo));
      break;
    case Xe.ContractCall:
      t.push(Yr(e.contractAddress)), t.push(Yr(e.contractName)), t.push(Yr(e.functionName));
      const n = new Uint8Array(4);
      Bi(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Rt(r));
      });
      break;
    case Xe.SmartContract:
      t.push(Yr(e.contractName)), t.push(Yr(e.codeBody));
      break;
    case Xe.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Yr(e.contractName)), t.push(Yr(e.codeBody));
      break;
    case Xe.PoisonMicroblock:
      break;
    case Xe.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case Xe.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Rt(e.recipient));
      break;
    case Xe.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Rt(e.recipient ? mm(e.recipient) : wm())), t.push(e.vrfProof);
      break;
    case Xe.TenureChange:
      t.push(Tt(e.tenureHash)), t.push(Tt(e.previousTenureHash)), t.push(Tt(e.burnViewHash)), t.push(Tt(e.previousTenureEnd)), t.push(Bi(new Uint8Array(4), e.previousTenureBlocks)), t.push(zk(new Uint8Array(1), e.cause)), t.push(Tt(e.publicKeyHash));
      break;
  }
  return Kt(t);
}
function h$(e) {
  switch (e.readUInt8Enum(Xe, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Xe.TokenTransfer:
      const n = tr(e), r = kn(e.readBytes(8), !1), s = Am(e);
      return c$(n, r, s);
    case Xe.ContractCall:
      const i = Bo(e), o = er(e), c = er(e), l = [], h = e.readUInt32BE();
      for (let A = 0; A < h; A++) {
        const B = tr(e);
        l.push(B);
      }
      return l$(i, o, c, l);
    case Xe.SmartContract:
      const p = er(e), d = er(e, 4, 1e5);
      return v0(p, d);
    case Xe.VersionedSmartContract: {
      const A = e.readUInt8Enum(Ed, (W) => {
        throw new Error(`Cannot recognize ClarityVersion: ${W}`);
      }), B = er(e), _ = er(e, 4, 1e5);
      return v0(B, _, A);
    }
    case Xe.PoisonMicroblock:
      return u$();
    case Xe.Coinbase: {
      const A = e.readBytes(yi);
      return A0(A);
    }
    case Xe.CoinbaseToAltRecipient: {
      const A = e.readBytes(yi), B = tr(e);
      return A0(A, B);
    }
    case Xe.NakamotoCoinbase: {
      const A = e.readBytes(yi), B = tr(e), _ = e.readBytes(Ad);
      return d$(A, B, _);
    }
    case Xe.TenureChange:
      const m = We(e.readBytes(20)), y = We(e.readBytes(20)), S = We(e.readBytes(20)), x = We(e.readBytes(32)), I = e.readUInt32BE(), H = e.readUInt8Enum(Cd, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), U = We(e.readBytes(20));
      return f$(m, y, S, x, I, H, U);
  }
}
class Ol extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ci extends Ol {
  constructor(t) {
    super(t);
  }
}
class jn extends Ol {
  constructor(t) {
    super(t);
  }
}
class nl extends Ol {
  constructor(t) {
    super(t);
  }
}
class pi extends Ol {
  constructor(t) {
    super(t);
  }
}
var pr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(pr || (pr = {}));
function Td(e) {
  return dm(We(e.readBytes(Ul)));
}
function fo(e, t) {
  return {
    pubKeyEncoding: e,
    type: Ae.TransactionAuthField,
    contents: t
  };
}
function p$(e) {
  const t = e.readUInt8Enum(pr, (n) => {
    throw new jn(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case pr.PublicKeyCompressed:
      return fo(_t.Compressed, Ld(e));
    case pr.PublicKeyUncompressed:
      return fo(_t.Uncompressed, s$(Ld(e).data));
    case pr.SignatureCompressed:
      return fo(_t.Compressed, Td(e));
    case pr.SignatureUncompressed:
      return fo(_t.Uncompressed, Td(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function Xf(e) {
  return Tt(e.data);
}
function g$(e) {
  const t = [];
  switch (e.contents.type) {
    case Ae.PublicKey:
      t.push(e.pubKeyEncoding === _t.Compressed ? pr.PublicKeyCompressed : pr.PublicKeyUncompressed), t.push(tl(r$(e.contents.data)));
      break;
    case Ae.MessageSignature:
      t.push(e.pubKeyEncoding === _t.Compressed ? pr.SignatureCompressed : pr.SignatureUncompressed), t.push(Xf(e.contents));
      break;
  }
  return Kt(t);
}
function Yr(e) {
  switch (e.type) {
    case Ae.Address:
      return _a(e);
    case Ae.Principal:
      return vm(e);
    case Ae.LengthPrefixedString:
      return Mo(e);
    case Ae.MemoString:
      return b$(e);
    case Ae.AssetInfo:
      return Em(e);
    case Ae.PostCondition:
      return x$(e);
    case Ae.PublicKey:
      return tl(e);
    case Ae.LengthPrefixedList:
      return Wf(e);
    case Ae.Payload:
      return Sm(e);
    case Ae.TransactionAuthField:
      return g$(e);
    case Ae.MessageSignature:
      return Xf(e);
  }
}
function y$() {
  return {
    type: Ae.Address,
    version: el.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Yf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === bt.SerializeP2PKH || t === bt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === bt.SerializeP2WPKH || t === bt.SerializeP2WSH || t === bt.SerializeP2WSHNonSequential) && !r.every(Fo))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case bt.SerializeP2PKH:
      return ia(e, H$(r[0].data));
    case bt.SerializeP2WPKH:
      return ia(e, O$(r[0].data));
    case bt.SerializeP2SH:
    case bt.SerializeP2SHNonSequential:
      return ia(e, D$(n, r.map(tl)));
    case bt.SerializeP2WSH:
    case bt.SerializeP2WSHNonSequential:
      return ia(e, F$(n, r.map(tl)));
  }
}
function _a(e) {
  const t = [];
  return t.push(Tt(Na(e.version, 1))), t.push(Tt(e.hash160)), Kt(t);
}
function Bo(e) {
  const t = _l(We(e.readBytes(1))), n = We(e.readBytes(20));
  return { type: Ae.Address, version: t, hash160: n };
}
function vm(e) {
  const t = [];
  return t.push(e.prefix), t.push(_a(e.address)), e.prefix === Sa.Contract && t.push(Mo(e.contractName)), Kt(t);
}
function w$(e) {
  const t = e.readUInt8Enum(Sa, (s) => {
    throw new jn(`Unexpected Principal payload type: ${s}`);
  }), n = Bo(e);
  if (t === Sa.Standard)
    return { type: Ae.Principal, prefix: t, address: n };
  const r = er(e);
  return {
    type: Ae.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function Mo(e) {
  const t = [], n = Do(e.content), r = n.byteLength;
  return t.push(Tt(Na(r, e.lengthPrefixBytes))), t.push(n), Kt(t);
}
function er(e, t, n) {
  t = t || 1;
  const r = _l(We(e.readBytes(t))), s = Ff(e.readBytes(r));
  return Mi(s, t, n ?? 128);
}
function m$(e) {
  return Mi(e, 4, 1e5);
}
function E0(e) {
  if (e && Lm(e, Jc))
    throw new Error(`Memo exceeds maximum length of ${Jc} bytes`);
  return { type: Ae.MemoString, content: e };
}
function b$(e) {
  const t = [], n = Do(e.content), r = U$(We(n), Jc * 2);
  return t.push(Tt(r)), Kt(t);
}
function Am(e) {
  let t = Ff(e.readBytes(Jc));
  return t = t.replace(/\u0000*$/, ""), { type: Ae.MemoString, content: t };
}
function Em(e) {
  const t = [];
  return t.push(_a(e.address)), t.push(Mo(e.contractName)), t.push(Mo(e.assetName)), Kt(t);
}
function Bd(e) {
  return {
    type: Ae.AssetInfo,
    address: Bo(e),
    contractName: er(e),
    assetName: er(e)
  };
}
function qf(e, t) {
  return {
    type: Ae.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Wf(e) {
  const t = e.values, n = [];
  n.push(Tt(Na(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Yr(r));
  return Kt(n);
}
function km(e, t, n) {
  const r = _l(We(e.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (t) {
      case Ae.Address:
        s.push(Bo(e));
        break;
      case Ae.LengthPrefixedString:
        s.push(er(e));
        break;
      case Ae.MemoString:
        s.push(Am(e));
        break;
      case Ae.AssetInfo:
        s.push(Bd(e));
        break;
      case Ae.PostCondition:
        s.push(S$(e));
        break;
      case Ae.PublicKey:
        s.push(Ld(e));
        break;
      case Ae.TransactionAuthField:
        s.push(p$(e));
        break;
    }
  return qf(s, n);
}
function x$(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(vm(e.principal)), (e.conditionType === Bn.Fungible || e.conditionType === Bn.NonFungible) && t.push(Em(e.assetInfo)), e.conditionType === Bn.NonFungible && t.push(Rt(e.assetName)), t.push(e.conditionCode), e.conditionType === Bn.STX || e.conditionType === Bn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new ci("The post-condition amount may not be larger than 8 bytes");
    t.push(Ys(e.amount, !1, 8));
  }
  return Kt(t);
}
function S$(e) {
  const t = e.readUInt8Enum(Bn, (o) => {
    throw new jn(`Could not read ${o} as PostConditionType`);
  }), n = w$(e);
  let r, s, i;
  switch (t) {
    case Bn.STX:
      return r = e.readUInt8Enum(xa, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${We(e.readBytes(8))}`), {
        type: Ae.PostCondition,
        conditionType: Bn.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Bn.Fungible:
      return s = Bd(e), r = e.readUInt8Enum(xa, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${We(e.readBytes(8))}`), {
        type: Ae.PostCondition,
        conditionType: Bn.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Bn.NonFungible:
      s = Bd(e);
      const o = tr(e);
      return r = e.readUInt8Enum(kd, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: Ae.PostCondition,
        conditionType: Bn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Hr(e, t) {
  return Kt([e, t]);
}
function v$(e) {
  return new Uint8Array([e.type]);
}
function A$(e) {
  return e.type === re.OptionalNone ? new Uint8Array([e.type]) : Hr(e.type, Rt(e.value));
}
function E$(e) {
  const t = new Uint8Array(4);
  return Bi(t, e.buffer.length, 0), Hr(e.type, Pl(t, e.buffer));
}
function k$(e) {
  const t = Df(Mk(e.value, BigInt(Xk)), sm);
  return Hr(e.type, t);
}
function $$(e) {
  const t = Df(e.value, sm);
  return Hr(e.type, t);
}
function I$(e) {
  return Hr(e.type, _a(e.address));
}
function L$(e) {
  return Hr(e.type, Pl(_a(e.address), Mo(e.contractName)));
}
function C$(e) {
  return Hr(e.type, Rt(e.value));
}
function T$(e) {
  const t = [], n = new Uint8Array(4);
  Bi(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Rt(r);
    t.push(s);
  }
  return Hr(e.type, Kt(t));
}
function B$(e) {
  const t = [], n = new Uint8Array(4);
  Bi(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Mi(s);
    t.push(Mo(i));
    const o = Rt(e.data[s]);
    t.push(o);
  }
  return Hr(e.type, Kt(t));
}
function $m(e, t) {
  const n = [], r = t == "ascii" ? nm(e.data) : Do(e.data), s = new Uint8Array(4);
  return Bi(s, r.length, 0), n.push(s), n.push(r), Hr(e.type, Kt(n));
}
function M$(e) {
  return $m(e, "ascii");
}
function N$(e) {
  return $m(e, "utf8");
}
function Rt(e) {
  switch (e.type) {
    case re.BoolTrue:
    case re.BoolFalse:
      return v$(e);
    case re.OptionalNone:
    case re.OptionalSome:
      return A$(e);
    case re.Buffer:
      return E$(e);
    case re.UInt:
      return $$(e);
    case re.Int:
      return k$(e);
    case re.PrincipalStandard:
      return I$(e);
    case re.PrincipalContract:
      return L$(e);
    case re.ResponseOk:
    case re.ResponseErr:
      return C$(e);
    case re.List:
      return T$(e);
    case re.Tuple:
      return B$(e);
    case re.StringASCII:
      return M$(e);
    case re.StringUTF8:
      return N$(e);
    default:
      throw new ci("Unable to serialize. Invalid Clarity Value.");
  }
}
function _$(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const k0 = /* @__PURE__ */ new Map();
function Im(e, t) {
  const n = k0.get(e);
  if (n !== void 0)
    return n(t);
  const r = _$(e);
  return k0.set(e, r), Im(e, t);
}
class ua {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return Gk(this.readBytes(4), 0);
  }
  readUInt8() {
    return Rk(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Fk(this.readBytes(2), 0);
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
    if (Im(t, r))
      return r;
    throw n(r);
  }
}
function tr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new ua(Tt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new ua(e) : t = e;
  switch (t.readUInt8Enum(re, (r) => {
    throw new jn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case re.Int:
      return q8(t.readBytes(16));
    case re.UInt:
      return En(t.readBytes(16));
    case re.Buffer:
      const r = t.readUInt32BE();
      return ym(t.readBytes(r));
    case re.BoolTrue:
      return pm();
    case re.BoolFalse:
      return gm();
    case re.PrincipalStandard:
      const s = Bo(t);
      return K8(s);
    case re.PrincipalContract:
      const i = Bo(t), o = er(t);
      return hm(i, o);
    case re.ResponseOk:
      return Z8(tr(t));
    case re.ResponseErr:
      return W8(tr(t));
    case re.OptionalNone:
      return wm();
    case re.OptionalSome:
      return mm(tr(t));
    case re.List:
      const c = t.readUInt32BE(), l = [];
      for (let x = 0; x < c; x++)
        l.push(tr(t));
      return J8(l);
    case re.Tuple:
      const h = t.readUInt32BE(), p = {};
      for (let x = 0; x < h; x++) {
        const I = er(t).content;
        if (I === void 0)
          throw new jn('"content" is undefined');
        p[I] = tr(t);
      }
      return br(p);
    case re.StringASCII:
      const d = t.readUInt32BE(), m = Uk(t.readBytes(d));
      return xt(m);
    case re.StringUTF8:
      const y = t.readUInt32BE(), S = Ff(t.readBytes(y));
      return Q8(S);
    default:
      throw new jn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const P$ = (e) => e.length % 2 == 0 ? e : `0${e}`, U$ = (e, t) => e.padEnd(t, "0"), Lm = (e, t) => e ? Do(e).length > t : !1;
function Md(e) {
  return Xy(e);
}
const va = (e) => d8(Kf(e)), Zf = (e) => We(R8(e)), H$ = (e) => We(va(e)), O$ = (e) => {
  const t = va(e), n = Pl(new Uint8Array([0]), new Uint8Array([t.length]), t), r = va(n);
  return We(r);
}, D$ = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + t.length), n.push(174);
  const r = Kt(n), s = va(r);
  return We(s);
}, F$ = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((l) => {
    n.push(l.length), n.push(l);
  }), n.push(80 + t.length), n.push(174);
  const r = Kt(n), s = Kf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Kt(i), c = va(o);
  return We(c);
};
function j$(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Cm(e) {
  const t = Rt(e);
  return `0x${We(t)}`;
}
function R$(e) {
  return tr(e);
}
const go = (e) => {
  try {
    return Di.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Jf() {
  return {
    type: Ae.MessageSignature,
    data: We(new Uint8Array(Ul))
  };
}
function Tm(e, t, n, r) {
  const s = Yf(0, e, 1, [To(t)]).hash160, i = Fo(To(t)) ? _t.Compressed : _t.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: kn(n, !1),
    fee: kn(r, !1),
    keyEncoding: i,
    signature: Jf()
  };
}
function Aa(e) {
  return "signature" in e;
}
function $0(e) {
  return e === bt.SerializeP2SH || e === bt.SerializeP2WSH;
}
function z$(e) {
  return e === bt.SerializeP2SHNonSequential || e === bt.SerializeP2WSHNonSequential;
}
function I0(e) {
  const t = Md(e);
  return t.nonce = 0, t.fee = 0, Aa(t) ? t.signature = Jf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function G$(e) {
  const t = [
    e.hashMode,
    Tt(e.signer),
    Ys(e.nonce, !1, 8),
    Ys(e.fee, !1, 8),
    e.keyEncoding,
    Xf(e.signature)
  ];
  return Kt(t);
}
function K$(e) {
  const t = [
    e.hashMode,
    Tt(e.signer),
    Ys(e.nonce, !1, 8),
    Ys(e.fee, !1, 8)
  ], n = qf(e.fields);
  t.push(Wf(n));
  const r = new Uint8Array(2);
  return jk(r, e.signaturesRequired, 0), t.push(r), Kt(t);
}
function V$(e, t) {
  const n = We(t.readBytes(20)), r = BigInt(`0x${We(t.readBytes(8))}`), s = BigInt(`0x${We(t.readBytes(8))}`), i = t.readUInt8Enum(_t, (c) => {
    throw new jn(`Could not parse ${c} as PubKeyEncoding`);
  });
  if (e === bt.SerializeP2WPKH && i != _t.Compressed)
    throw new jn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Td(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function X$(e, t) {
  const n = We(t.readBytes(20)), r = BigInt("0x" + We(t.readBytes(8))), s = BigInt("0x" + We(t.readBytes(8))), i = km(t, Ae.TransactionAuthField).values;
  let o = !1, c = 0;
  for (const h of i)
    switch (h.contents.type) {
      case Ae.PublicKey:
        Fo(h.contents) || (o = !0);
        break;
      case Ae.MessageSignature:
        if (h.pubKeyEncoding === _t.Uncompressed && (o = !0), c += 1, c === 65536)
          throw new pi("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const l = t.readUInt16BE();
  if (o && (e === bt.SerializeP2WSH || e === bt.SerializeP2WSHNonSequential))
    throw new pi("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: l
  };
}
function gu(e) {
  return Aa(e) ? G$(e) : K$(e);
}
function yu(e) {
  const t = e.readUInt8Enum(bt, (n) => {
    throw new jn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === bt.SerializeP2PKH || t === bt.SerializeP2WPKH ? V$(t, e) : X$(t, e);
}
function Bm(e, t, n, r) {
  const i = e + We(new Uint8Array([t])) + We(Ys(n, !1, 8)) + We(Ys(r, !1, 8));
  if (Tt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Zf(Tt(i));
}
function Mm(e, t, n) {
  const r = 33 + Ul, s = Fo(t) ? _t.Compressed : _t.Uncompressed, i = e + P$(s.toString(16)) + n.data, o = Tt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Zf(o);
}
function Y$(e, t, n, r, s) {
  const i = Bm(e, t, n, r), o = o$(s, i), c = a$(s), l = Mm(i, c, o);
  return {
    nextSig: o,
    nextSigHash: l
  };
}
function Nm(e, t, n, r, s, i) {
  const o = Bm(e, t, n, r), c = To(e$(o, i, s)), l = Mm(o, c, i);
  return {
    pubKey: c,
    nextSigHash: l
  };
}
function q$() {
  const e = Tm(bt.SerializeP2PKH, "", 0, 0);
  return e.signer = y$().hash160, e.keyEncoding = _t.Compressed, e.signature = Jf(), e;
}
function L0(e, t, n) {
  return Aa(e) ? W$(e, t, n) : Z$(e, t, n);
}
function W$(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Nm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), i = Yf(0, e.hashMode, 1, [r]).hash160;
  if (i !== e.signer)
    throw new pi(`Signer hash does not equal hash of public key(s): ${i} != ${e.signer}`);
  return s;
}
function Z$(e, t, n) {
  const r = [];
  let s = t, i = !1, o = 0;
  for (const l of e.fields)
    switch (l.contents.type) {
      case Ae.PublicKey:
        Fo(l.contents) || (i = !0), r.push(l.contents);
        break;
      case Ae.MessageSignature:
        l.pubKeyEncoding === _t.Uncompressed && (i = !0);
        const { pubKey: h, nextSigHash: p } = Nm(s, n, e.fee, e.nonce, l.pubKeyEncoding, l.contents);
        if ($0(e.hashMode) && (s = p), r.push(h), o += 1, o === 65536)
          throw new pi("Too many signatures");
        break;
    }
  if ($0(e.hashMode) && o !== e.signaturesRequired || z$(e.hashMode) && o < e.signaturesRequired)
    throw new pi("Incorrect number of signatures");
  if (i && (e.hashMode === bt.SerializeP2WSH || e.hashMode === bt.SerializeP2WSHNonSequential))
    throw new pi("Uncompressed keys are not allowed in this hash mode");
  const c = Yf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (c !== e.signer)
    throw new pi(`Signer hash does not equal hash of public key(s): ${c} != ${e.signer}`);
  return s;
}
function _m(e) {
  return {
    authType: Dt.Standard,
    spendingCondition: e
  };
}
function Pm(e, t) {
  return {
    authType: Dt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Tm(bt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function C0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Dt.Standard:
        return _m(I0(e.spendingCondition));
      case Dt.Sponsored:
        return Pm(I0(e.spendingCondition), q$());
      default:
        throw new nl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function J$(e, t) {
  switch (e.authType) {
    case Dt.Standard:
      return L0(e.spendingCondition, t, Dt.Standard);
    case Dt.Sponsored:
      return L0(e.spendingCondition, t, Dt.Standard);
    default:
      throw new nl("Invalid origin auth type");
  }
}
function Q$(e, t) {
  switch (e.authType) {
    case Dt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: kn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case Dt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: kn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function e6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: kn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function t6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: kn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function n6(e, t) {
  const n = {
    ...t,
    nonce: kn(t.nonce, !1),
    fee: kn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function r6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Dt.Standard:
      t.push(gu(e.spendingCondition));
      break;
    case Dt.Sponsored:
      t.push(gu(e.spendingCondition)), t.push(gu(e.sponsorSpendingCondition));
      break;
  }
  return Kt(t);
}
function s6(e) {
  const t = e.readUInt8Enum(Dt, (r) => {
    throw new jn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Dt.Standard:
      return n = yu(e), _m(n);
    case Dt.Sponsored:
      n = yu(e);
      const r = yu(e);
      return Pm(n, r);
  }
}
class i6 {
  constructor(t, n, r, s, i, o, c) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: kn(r.amount, !1)
    } : this.payload = r, this.chainId = c ?? Kk, this.postConditionMode = i ?? Co.Deny, this.postConditions = s ?? qf([]), o)
      this.anchorMode = Wk(o);
    else
      switch (r.payloadType) {
        case Xe.Coinbase:
        case Xe.CoinbaseToAltRecipient:
        case Xe.NakamotoCoinbase:
        case Xe.PoisonMicroblock:
        case Xe.TenureChange:
          this.anchorMode = Tn.OnChainOnly;
          break;
        case Xe.ContractCall:
        case Xe.SmartContract:
        case Xe.VersionedSmartContract:
        case Xe.TokenTransfer:
          this.anchorMode = Tn.Any;
          break;
      }
  }
  signBegin() {
    const t = Md(this);
    return t.auth = C0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Md(this);
    return t.auth = C0(t.auth), t.txid();
  }
  verifyOrigin() {
    return J$(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Dt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Dt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Dt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !Aa(n)) {
      const r = Fo(t);
      n.fields.push(fo(r ? _t.Compressed : _t.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: i, nextSigHash: o } = Y$(n, r, t.fee, t.nonce, s);
    return Aa(t) ? t.signature = i : t.fields.push(fo(s.data.byteLength === rm ? _t.Compressed : _t.Uncompressed, i)), o;
  }
  txid() {
    const t = this.serialize();
    return Zf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Dt.Sponsored)
      throw new nl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = n6(this.auth, t);
  }
  setFee(t) {
    this.auth = Q$(this.auth, t);
  }
  setNonce(t) {
    this.auth = e6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Dt.Sponsored)
      throw new nl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = t6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new ci('"version" is undefined');
    if (this.chainId === void 0)
      throw new ci('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ci('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ci('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ci('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return Bi(n, this.chainId, 0), t.push(n), t.push(r6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Wf(this.postConditions)), t.push(Sm(this.payload)), Kt(t);
  }
}
function ho(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new ua(Tt(e.slice(2))) : t = new ua(Tt(e)) : e instanceof Uint8Array ? t = new ua(e) : t = e;
  const n = t.readUInt8Enum(Qc, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = s6(t), i = t.readUInt8Enum(Tn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = t.readUInt8Enum(Co, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), c = km(t, Ae.PostCondition), l = h$(t);
  return new i6(n, s, l, c, o, i, r);
}
const o6 = X8, da = En, a6 = ym;
const c6 = /* @__PURE__ */ new Set([4001, -31001]), l6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], u6 = ["result", "data", "payload", "response", "params"], T0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Dl = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), zi = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, es = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, d6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Um = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => d6(i, r)) === s
  );
}, Hm = (e) => e ? Um(zi()).some(
  (t) => {
    var n;
    return t.id === e && (Dl(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Om = () => {
  if (typeof window > "u")
    return;
  const e = zi(), t = Um(e).filter(
    (n) => {
      var r;
      return Dl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = es(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of l6) {
    const r = es(e, n) ?? (e === window ? void 0 : es(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, f6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = zi(), n = es(t, e) ?? (t === window ? void 0 : es(window, e)) ?? kl(e);
  if (n)
    return n;
  if (Dl(e) || Hm(e))
    return Om();
}, fc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, h6 = ["blockstack-session", "blockstack"], p6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of h6) {
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
p6();
const Dm = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, Fn = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, g6 = (e) => {
  const t = Fn(e);
  if (!t)
    return null;
  const n = Dm(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, y6 = (e) => {
  const t = Fn(e);
  if (!t)
    return null;
  const n = Dm(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Nd = (e, t = "mainnet") => {
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
      return Nd(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Nd(r, t);
  }
  return t;
}, wi = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, Ea = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return go(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const i = Ea(s, t + 1);
      if (i)
        return i;
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
    const i = Ea(n[s], t + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && go(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && go(n.testnet) ? n.testnet.trim() : null;
}, B0 = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Fm = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && c6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Ni = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = Fn(n == null ? void 0 : n.message) ?? Fn(t.message) ?? Fn(t.error) ?? Fn(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, No = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw Ni(t);
    if (t.status === "error")
      throw Ni(t.result ?? t);
  }
  return e;
}, M0 = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return No(r);
  } catch (r) {
    throw Ni(r);
  }
}, jm = () => Om(), Qf = () => {
  if (typeof window > "u")
    return;
  const e = zi();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = es(e, t) ?? (e === window ? void 0 : es(window, t));
    if (n)
      return n;
  }
}, N0 = () => {
  if (typeof window > "u")
    return;
  const e = Qf();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = zi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = es(t, n) ?? (t === window ? void 0 : es(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Tc = (e) => {
  var r, s;
  const t = Ei();
  if (Dl(t) || Hm(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = zi() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === jm();
}, wu = (e) => {
  const t = y6(e);
  if (!t)
    return null;
  try {
    const n = ho(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, rl = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = wu(e), r = g6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Fn(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const c of e) {
      const l = rl(c, t + 1);
      if (l)
        return l;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const s = e;
  let i = null;
  for (const c of T0)
    if (wu(s[c])) {
      i = Fn(s[c]);
      break;
    }
  const o = Fn(s.txId) || Fn(s.txid) || Fn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Fn(s.txRaw) ?? void 0
    };
  for (const c of T0) {
    const l = wu(s[c]);
    if (l)
      return {
        ...s,
        txId: l,
        txid: l,
        txRaw: Fn(s[c]) ?? void 0
      };
  }
  for (const c of u6) {
    const l = s[c], h = rl(l, t + 1);
    if (h)
      return {
        ...s,
        ...l && typeof l == "object" ? l : {},
        ...h,
        txId: h.txId,
        txid: h.txid ?? h.txId
      };
  }
  return null;
}, mu = (e) => {
  const t = rl(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, w6 = (e) => {
  const t = rl(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, m6 = (e) => ({
  ...e,
  fee: wi(e.fee),
  nonce: wi(e.nonce),
  sponsored: e.sponsored === !0
}), _0 = (e) => ({
  recipient: e.recipient,
  amount: wi(e.amount) ?? "0",
  memo: e.memo,
  network: Nd(e.network),
  address: e.stxAddress,
  fee: wi(e.fee),
  nonce: wi(e.nonce),
  sponsored: e.sponsored ?? !1
}), Rm = "WALLET_ADDRESS_MISMATCH", b6 = 45e3;
let fa = null;
const _d = (e) => {
  e && (fa = { address: e, at: Date.now() });
}, x6 = () => {
  fa = null;
}, S6 = () => fa && Date.now() - fa.at <= b6 ? fa.address : null, v6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, A6 = async (e) => {
  x6();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = No(await e.request("wallet_connect")), n = Ea(t);
  return _d(n), n;
}, E6 = async (e, t, n, r) => {
  try {
    return No(await e.request(t, n));
  } catch (s) {
    const i = Ni(s);
    if (!v6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: i.message
    });
    let o = null;
    try {
      o = await A6(e);
    } catch (c) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: c instanceof Error ? c.message : String(c)
      }), i;
    }
    if (!o || r && o !== r)
      throw Object.assign(
        new Error(
          o ? `Xverse reconnected as ${o}, not the expected ${r}. Switch back to that account and retry.` : i.message
        ),
        { code: o ? Rm : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: o });
    try {
      return No(await e.request(t, n));
    } catch (c) {
      throw Ni(c);
    }
  }
};
let P0 = 3e4;
const k6 = (e, t) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${P0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, P0);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, $6 = async (e, t, n) => {
  const r = (l, h) => {
    if (t && l !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${l} (via ${h}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Rm }
      );
    return l;
  }, s = S6();
  if (s)
    return fc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  fc(n, "account-read");
  try {
    const l = No(
      await k6(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Ea(l), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (l) {
    if (Fm(l))
      throw Ni(l);
    fc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: l instanceof Error ? l.message : String(l)
    });
  }
  if (i)
    return _d(i), r(i, "wallet_getAccount");
  let o;
  fc(n, "account-reconnect");
  try {
    o = No(await e.request("wallet_connect"));
  } catch (l) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: l instanceof Error ? l.message : String(l)
    }), Ni(l);
  }
  const c = Ea(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: c }), !c)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return _d(c), r(c, "wallet_connect");
}, I6 = async (e, t) => {
  if (!Tc(e)) {
    const i = await M0(
      e,
      "stx_transferStx",
      _0(t)
    );
    return mu(i);
  }
  const n = Qf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await M0(
      n,
      "stx_transferStx",
      _0(t)
    );
    return mu(i);
  }
  const r = jm();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await $6(r, t.stxAddress);
  const s = await E6(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: wi(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: wi(t.fee) } : {}
    },
    t.stxAddress
  );
  return mu(s);
}, L6 = () => Ei(), zm = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = Ei(), t = e ? f6(e) : void 0;
  if (t)
    return t;
  const n = zi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, U0 = (e, t) => {
  const n = zm(), r = m6({
    ...e,
    onFinish: (s) => {
      var i;
      (i = e.onFinish) == null || i.call(e, w6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return cc(r, t);
  if (Tc(n) && !Qf()) {
    const s = N0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Ei(),
        route: "legacy-transaction-request"
      }), cc(r, s);
  }
  return void I6(n, e).then((s) => {
    var i;
    (i = e.onFinish) == null || i.call(e, s);
  }).catch((s) => {
    var i, o;
    if (B0(s) && Tc(n)) {
      const c = N0();
      if (c) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Ei(),
          route: "legacy-transaction-request"
        }), cc(r, c);
        return;
      }
    }
    if (B0(s) && !Tc(n)) {
      cc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Fm(s)) {
      (i = e.onCancel) == null || i.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (o = e.onCancel) == null || o.call(e);
  });
}, C6 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), H0 = (e) => Cm(e).replace(/^0x/, ""), O0 = "This wallet cannot sign messages. Try Xverse or Leather.", D0 = (e) => typeof (e == null ? void 0 : e.request) == "function", F0 = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", T6 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, B6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function M6(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: H0(t.message),
    domain: H0(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function N6(e, t) {
  const n = await kk({
    domain: t.domain,
    message: t.message,
    network: Nl(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? C6()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function bu(e) {
  var s, i;
  const t = L6() || "", n = /xverse/i.test(t);
  let r = zm();
  if (n && !F0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (F0(r))
    try {
      return await N6(r, e);
    } catch (o) {
      if (n || !D0(r) || !B6(o)) throw o;
    }
  if (!n && D0(r))
    try {
      return await M6(r, e);
    } catch (o) {
      throw T6(o) ? new Error(O0) : o;
    }
  throw new Error(O0);
}
const j0 = 1000000n, Zr = 1000000n, sl = 50n, zt = 3000n, xr = 300n, Jo = 3000n, _6 = 50000n, xu = 200n, Fl = 15000n, wn = (e) => e + sl;
function dr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / j0}.${(n % j0).toString().padStart(6, "0")}`;
}
function R0(e, t = xr) {
  return e <= zt ? 0 : Number((e - zt) / wn(t));
}
function Su(e, t = 0n) {
  const n = Zr - e - t;
  return n > 0n ? n : 0n;
}
function P6(e, t = xr) {
  return e > Zr ? "over" : e < zt + wn(t) ? "empty" : e < _6 ? "low" : "ok";
}
const U6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", H6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", O6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function D6(e) {
  var n, r, s, i;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = t["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || O6.some((o, c) => {
    var l;
    return ((l = t["core-" + (c + 1)]) == null ? void 0 : l.value) !== U6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Gm = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", vu = 3, F6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", j6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", z0 = 1, [Pd, Km] = Gm.split("."), Wn = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function Ud(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function R6(e) {
  return Wn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function Vs(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Vm(e, t = []) {
  const n = await Vs(`/v2/contracts/call-read/${Pd}/${Km}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Pd, arguments: t.map((r) => "0x" + Wn(Rt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return hr(tr(n.result));
}
async function z6() {
  const e = await Vs(`/v2/contracts/source/${Pd}/${Km}?proof=0`);
  if (typeof e.source != "string" || await R6(e.source) !== H6) throw Error("Deployed source does not match the tested helper.");
  if (D6(await Vm("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Xm(e) {
  return e.startsWith("SP") && go(e) && !e.includes(".");
}
async function G6(e) {
  var r;
  if (!Xm(e)) throw Error("Invalid mainnet wallet address.");
  const t = await Vs(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await Vs(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function K6(e) {
  const t = await Vs(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function V6(e, t) {
  var s, i;
  const n = await Vm("get-owner", [da(e), da(t)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Xm(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function X6(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Ud(e), signal: AbortSignal.timeout(15e3) });
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
async function Y6(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function q6(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = ho(Ud(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || uo(ia(el.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const i = t.postConditions.values[0];
    if (r.payloadType !== 2 || uo(r.contractAddress) + "." + r.contractName.content !== Gm || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Wn(Rt(r.functionArgs[0])) !== Wn(Rt(da(e.core))) || Wn(Rt(r.functionArgs[1])) !== Wn(Rt(da(e.song))) || Wn(Rt(r.functionArgs[2])) !== Wn(Rt(a6(Ud(e.id)))) || e.amount !== "50" || t.postConditionMode !== Co.Deny || t.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== xa.Equal || i.principal.prefix !== 2 || uo(i.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || uo(r.contractAddress) + "." + r.contractName.content !== F6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Wn(Rt(r.functionArgs[0])) !== Wn(Rt(da(e.song))) || typeof e.liked != "boolean" || Wn(Rt(r.functionArgs[1])) !== Wn(Rt(o6(e.liked))) || e.amount !== "0" || t.postConditionMode !== Co.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || hr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const W6 = "xtrata.xyz/radio/listening-wallet", Z6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Cr = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && go(e), J6 = (e) => ({
  domain: br({ name: xt(W6), version: xt("1"), "chain-id": En(1) }),
  message: br({
    purpose: xt(Z6),
    main: xt(e.main),
    listening: xt(e.listening),
    issued: En(e.issued)
  })
}), Ym = 100000n, Q6 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function e5(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !Cr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= Ym).sort(Q6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const hc = 50;
function il(e) {
  const t = e;
  if (!t || typeof t.total != "number" || !Number.isSafeInteger(t.total) || t.total < 0 || !Array.isArray(t.results)) return null;
  const n = [];
  for (const r of t.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const s = Number(r.block_height), i = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(s) || !Number.isSafeInteger(i)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: s, txIndex: i });
  }
  return { total: t.total, transfers: n };
}
async function t5(e, t, n = 4) {
  if (!Cr(e)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${e}/stx_inbound?limit=${hc}&offset=${o}`, s = il(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - hc);
    for (let o = 0; o < n; o++) {
      const c = i === 0 && s.total <= hc ? s : il(await t(r(i)));
      if (!c || !c.transfers.length) return { ok: !1 };
      const l = e5(c.transfers, e);
      if (l.ok && l.funder) return i > 0 ? { ...l, distinct: Math.max(l.distinct, 2) } : l;
      if (i === 0) return l;
      i = Math.max(0, i - hc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Vr = 50, n5 = 6, r5 = 20, G0 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function K0(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const i of n.results) {
    const o = i && typeof i == "object" && i.tx && typeof i.tx == "object" ? i.tx : i;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (s.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== t || o.tx_status !== "success") continue;
    const c = o.token_transfer;
    if (!c || typeof c.recipient_address != "string" || typeof c.amount != "string" || !/^\d+$/.test(c.amount)) return null;
    const l = Number(o.block_height), h = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(l) || !Number.isSafeInteger(h)) return null;
    r.push({ recipient: c.recipient_address, amount: BigInt(c.amount), txId: o.tx_id, blockHeight: l, txIndex: h });
  }
  return { total: n.total, sent: r, rows: s };
}
async function s5(e, t, n) {
  if (!Cr(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = il(await t(`/extended/v1/address/${e}/stx_inbound?limit=${Vr}&offset=0`));
    if (!s || s.total > n5 * Vr) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Vr; o < s.total; o += Vr) {
      const c = il(await t(`/extended/v1/address/${e}/stx_inbound?limit=${Vr}&offset=${o}`));
      if (!c || !c.transfers.length) return { ok: !1 };
      for (const l of c.transfers) r.set(l.txId + ":" + l.txIndex, l);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (h) => `/extended/v1/address/${e}/transactions?limit=${Vr}&offset=${h}`, c = K0(await t(o(0)), e);
      if (!c || c.total > r5 * Vr) return { ok: !1 };
      const l = new Set(c.rows);
      for (const h of c.sent) i.set(h.txId, h);
      for (let h = Vr; h < c.total; h += Vr) {
        const p = K0(await t(o(h)), e);
        if (!p || !p.rows.length) return { ok: !1 };
        for (const d of p.rows) l.add(d);
        for (const d of p.sent) i.set(d.txId, d);
      }
      if (l.size !== c.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...i.values()] };
  } catch {
    return { ok: !1 };
  }
}
function i5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(G0).map((d, m) => {
    const y = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: y, kind: "gift", to: r.payer, at: m } : Cr(d.sender) && y >= Ym ? { sender: d.sender, left: y, kind: "deposit", to: d.sender, at: m } : { sender: d.sender, left: y, kind: "dust", to: null, at: m };
  }), i = s.reduce((d, m) => d + m.left, 0n), o = [...e.outgoing].filter((d) => d && d.recipient !== t && Cr(d.recipient) && d.amount > 0n).sort(G0), c = o.reduce((d, m) => d + m.amount, 0n), l = i - n - c;
  if (l < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const h = (d, m) => {
    let y = m;
    for (const S of d) {
      if (y <= 0n) break;
      const x = S.left < y ? S.left : y;
      S.left -= x, y -= x;
    }
    return y;
  };
  for (const d of o) {
    const m = h(s.filter((y) => y.to === d.recipient), d.amount);
    m > 0n && h(s, m);
  }
  if (h(s, l) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((d, m) => d + m.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const p = /* @__PURE__ */ new Map();
  for (const d of s) {
    if (d.left <= 0n) continue;
    const m = `${d.kind}:${d.to ?? ""}`, y = p.get(m);
    y ? (y.amount += d.left, y.newest = Math.max(y.newest, d.at)) : p.set(m, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...p.values()].sort((d, m) => d.newest - m.newest),
    hasTopUp: s.some((d) => d.kind === "deposit")
  };
}
function o5(e, t) {
  const n = e.filter((h) => h.kind === "deposit").sort((h, p) => h.newest - p.newest), r = e.find((h) => h.kind === "gift"), s = e.filter((h) => h.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((h, p) => h + p.amount, 0n), o = [], c = [], l = i > t;
  return n.forEach((h, p) => {
    if (h.amount <= t) {
      c.push(h);
      return;
    }
    const d = p === n.length - 1 && !l;
    o.push({ to: h.to, kind: "deposit", mode: d ? "all" : "amount", send: h.amount - t });
  }), l ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - t }) : (r && c.push(r), c.push(...s)), { steps: o, tooSmall: c };
}
function V0(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const pc = 1500n, Bc = [100, 250, 500], a5 = (e, t) => BigInt(e) * wn(t), Qo = ["prepared", "signed", "unknown", "pending"], c5 = 30 * 6e4, ol = 6e4, to = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, l5 = 3e3, al = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Au = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function u5(e) {
  let t = null, n = -1 / 0, r, s = null, i = null, o, c = -1 / 0, l = null, h = null, p = !1, d = !1, m = !1, y = null, S = !1, x = "", I = "", H = 0, U, A = null, B, _ = [], W, ae = -1 / 0;
  const Z = /* @__PURE__ */ new Set();
  let X = null, b = !1, k = 0, M = null, N = null, Y = !1, O = null, pe = !1, se = null, Ce = !1, $ = !1, D = !1, ce = !1, ge = !1, Le = 0, Te = null, St = Promise.resolve();
  const Be = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? xr.toString()), Pe = (a) => !!i && !(i.features ?? []).includes(a), Ee = (a, u) => `xtrata.ppp.v1.${a}:${u}`, rn = "xtrata.ppp.v1.as-main", qt = () => {
    if (e.main()) return;
    const a = e.store.get(rn);
    return a && Cr(a) ? a : void 0;
  }, Qe = () => e.main() ?? qt(), Bt = (a = i == null ? void 0 : i.address) => {
    if (!a) return [];
    try {
      const u = JSON.parse(e.store.get(Ee("entries", a)) || "[]");
      return Array.isArray(u) ? u : [];
    } catch {
      return [];
    }
  }, ct = (a) => {
    const u = [a, ...Bt(a.address).filter((g) => !(g.txid === a.txid && g.kind === a.kind))].slice(0, 200);
    e.store.set(Ee("entries", a.address), JSON.stringify(u));
  }, j = (a = i == null ? void 0 : i.address) => !!a && e.store.get(Ee("on", a)) !== "0", P = (a) => {
    i != null && i.address && e.store.set(Ee("on", i.address), a ? "1" : "0");
  }, te = () => Bt().filter((a) => Qo.includes(a.status)), Q = () => Ze() ? [...te(), ...Bt(Ke()).filter((a) => Qo.includes(a.status))] : te(), ie = () => De(i == null ? void 0 : i.address), De = (a) => {
    if (!a) return null;
    try {
      return JSON.parse(e.store.get(Ee("deposit", a)) || "null");
    } catch {
      return null;
    }
  }, ke = (a, u = i == null ? void 0 : i.address) => {
    u && e.store.set(Ee("deposit", u), JSON.stringify(a));
  };
  let Me = null;
  const nt = (a = ol) => {
    const u = e.now();
    Me = { since: Me && u < Me.until ? Me.since : u, until: Math.max((Me == null ? void 0 : Me.until) ?? 0, u + a) };
  }, ye = () => !!Me && e.now() < Me.until && (o === void 0 || o < zt + wn(Be())), me = () => !!ie() || ye(), Ke = () => Pe("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), Ze = () => !!(i != null && i.address) && Ke() !== i.address, qe = () => Ze() ? l && l.for === Ke() ? l.value : void 0 : o, jt = (a) => a !== void 0 && a < zt + xu, Wt = () => te().filter((a) => e.now() - a.created > c5 && Z.has(a.txid)), Vt = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!Qe() || r === Qe() && !t.allowed), pt = () => Vt() && !(i != null && i.linked), fn = () => {
    const a = Qe();
    return !pt() && !!a && !!(i != null && i.linked) && i.linked !== a;
  }, $n = (a) => Ee("return-to", a), Sr = (a = i == null ? void 0 : i.address) => {
    if (!a) return;
    const u = e.store.get($n(a));
    return u && Cr(u) && u !== a ? u : void 0;
  }, Or = (a = i == null ? void 0 : i.address) => X && X.for === a ? X.res : null;
  function E() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const a = Sr();
    if (a) return { to: a, kind: "chosen" };
    const u = Or();
    if (u != null && u.ok && u.funder) return { to: u.funder, kind: "funder" };
  }
  const F = (a) => Ee("gift", a);
  function K() {
    const a = i == null ? void 0 : i.address;
    if (!a) return null;
    if ((O == null ? void 0 : O.for) === a) return O.info;
    try {
      const u = JSON.parse(e.store.get(F(a)) || "null");
      return u && typeof u.returnTo == "string" && typeof u.treasury == "string" ? u : null;
    } catch {
      return null;
    }
  }
  const V = () => (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : ((i == null ? void 0 : i.slot) ?? 0) === 0 ? i == null ? void 0 : i.address : void 0;
  let ee = null, v = null, oe = !1;
  const Ue = (a) => Ee("award-claim", a), Ve = (a) => Ee("award-send", a), gt = (a) => {
    try {
      const u = JSON.parse(e.store.get(Ve(a)) || "null");
      return u && typeof u.txid == "string" && e.now() - u.at < 2 * 36e5 ? u : null;
    } catch {
      return null;
    }
  }, He = (a) => {
    try {
      const u = JSON.parse(e.store.get(Ue(a)) || "null");
      return u && typeof u.txid == "string" && e.now() - u.at < 2 * 36e5 ? u : null;
    } catch {
      return null;
    }
  };
  async function Pt(a = !1) {
    const u = V();
    if (!u || !e.awardStatus || oe) return;
    const g = (ee == null ? void 0 : ee.for) === u ? ee : null, f = g == null ? void 0 : g.view.state, C = g ? f === "off" || f === "not-a-player" ? 30 * 6e4 : He(u) || gt(u) ? 2e4 : f === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(g && !a && e.now() - g.at < C)) {
      oe = !0;
      try {
        const L = await e.awardStatus(u);
        if (ee = { for: u, view: L, at: e.now() }, L.state === "claimed" && e.store.set(Ue(u), ""), L.state === "claimed" && L.holds === !1 && e.store.set(Ve(u), ""), L.state === "ready" && e.awardName && (v == null ? void 0 : v.for) !== u)
          try {
            v = { for: u, name: await e.awardName(u), at: e.now() };
          } catch {
            v = { for: u, name: void 0, at: e.now() };
          }
      } catch {
        ee = { for: u, view: g && g.view.state !== "off" && g.view.state !== "not-a-player" ? { ...g.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        oe = !1;
      }
    }
  }
  function et() {
    const a = V();
    if (!a || (ee == null ? void 0 : ee.for) !== a) return null;
    const u = ee.view;
    if (u.state === "off" || u.state === "not-a-player") return null;
    const g = u.state === "claimed" ? null : He(a), f = u.state === "claimed" && u.holds !== !1 ? gt(a) : null;
    return { ...u, ...(v == null ? void 0 : v.for) === a ? { name: v.name } : {}, ...g ? { claimTx: g.txid } : {}, ...f ? { sendTx: f.txid } : {} };
  }
  async function ot() {
    var C;
    const a = i == null ? void 0 : i.address;
    if (!a || !e.giftInfo || !((C = t == null ? void 0 : t.gifts) != null && C.enabled) || pe) return;
    const u = (O == null ? void 0 : O.for) === a ? O : null, g = u ? u.ok ? u.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (u && e.now() - u.at < g) return;
    pe = !0;
    const f = K();
    try {
      const L = await e.giftInfo(a);
      O = { for: a, info: L, ok: !0, at: e.now() }, e.store.set(F(a), JSON.stringify(L));
    } catch {
      O = { for: a, info: f, ok: !1, at: e.now() };
    } finally {
      pe = !1;
    }
  }
  const Ut = () => Bt().reduce((a, u) => Qo.includes(u.status) ? a + BigInt(u.amount || "0") + BigInt(u.fee || "0") : a, 0n);
  function Ne() {
    if (o === void 0) return 0;
    const a = o - Ut() - BigInt(vt.length) * wn(Be());
    return a > 0n ? R0(a, Be()) : 0;
  }
  const Zt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Xt = "EMPTY — ADD STX TO PLAY";
  function nr() {
    if (!(t != null && t.here)) return null;
    const a = (u, g) => ({ reason: u, text: g });
    switch (Nn()) {
      case "connect":
      case "wrong-wallet":
        return a("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return a("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return a("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return a("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return a("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return a("locked", "UNLOCK TO LISTEN");
      case "link":
        return a("link", "FINISH SETUP TO LISTEN");
      case "over":
        return a("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return me() ? a("arriving", "YOUR PLAYS ARE ARRIVING") : a("out", Ze() ? Zt : Xt);
      case "ready":
        return !j() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= e.now() ? a("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : D ? Ne() < 1 ? a("out", Ze() ? Zt : Xt) : null : a("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const rr = () => {
    var a;
    return !!(i != null && i.address) && Ze() && !!((a = K()) != null && a.player);
  };
  function hn() {
    return rr() ? { locked: !0, known: !0 } : null;
  }
  const ss = 3 * 6e4, is = () => !!K() && !!e.history && !(i != null && i.linked);
  async function Gi() {
    const a = i.address, u = K(), { balance: g, nonce: f } = await e.chain.account(a), C = await e.history(a, !0);
    if (!C.ok) return null;
    const L = i5({ self: a, balance: g, inbound: C.inbound, outgoing: C.outgoing, gift: { sender: u.treasury, payer: u.returnTo } });
    if (!L.ok) return null;
    const G = o5(L.parts, Jo);
    return { balance: g, nonce: f, parts: L.parts, steps: G.steps, tooSmall: G.tooSmall.length };
  }
  const jo = () => Ce ? { state: "unavailable" } : !se || e.now() - se.at > ss || o !== void 0 && o !== se.balance ? { state: "none" } : se.plan;
  function Nn() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const a = Qe();
    if (!pt()) {
      if (!a) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : fn() ? "wrong-wallet" : i.state === "known" ? "locked" : !pt() && i.linked !== a ? "link" : o === void 0 ? "loading" : o > Zr && !i.backedUp ? "over" : o < zt + wn(Be()) ? "fund" : "ready" : "loading";
  }
  const Jt = () => {
    var a, u, g, f, C;
    return {
      step: Nn(),
      busy: h,
      message: x,
      error: I,
      notice: _n(),
      gate: t,
      main: Qe(),
      mainConnected: !!e.main(),
      standIn: qt(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      award: et(),
      unproven: !!(i != null && i.unproven),
      phrase: !!(i != null && i.phrase),
      backedUp: !!(i != null && i.backedUp),
      balance: o,
      balanceState: o === void 0 ? void 0 : ((L) => L === "over" && (i != null && i.backedUp) ? "ok" : L)(P6(o, Be())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: o !== void 0 && o > Zr && !!(i != null && i.backedUp),
      playsLeft: o === void 0 ? 0 : R0(o, Be()),
      allowance: o === void 0 ? Zr : Su(o, BigInt(((a = ie()) == null ? void 0 : a.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: j(),
      entries: Bt(),
      depositTxid: ((u = ie()) == null ? void 0 : u.txid) ?? U,
      depositPending: me(),
      arrival: me() ? { since: ((g = ie()) == null ? void 0 : g.at) ?? (Me == null ? void 0 : Me.since) ?? e.now(), graceMs: ol } : null,
      walletOutdated: Pe("like"),
      linkedListening: W && W === Qe() ? _.map((L) => L.listening) : [],
      serverLinked: !!A && B === `${Qe()}:${i == null ? void 0 : i.address}`,
      stuck: Wt().length,
      armed: ce,
      queued: vt.length,
      solo: pt(),
      returnTo: (f = E()) == null ? void 0 : f.to,
      returnToKind: (C = E()) == null ? void 0 : C.kind,
      funderState: (() => {
        const L = Or();
        return L ? L.ok ? L.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const L = Or();
        return !!L && L.ok && L.distinct > 1;
      })(),
      walletCannotSolo: pt() && Pe("standalone"),
      walletCannotMulti: Pe("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((L) => L !== Qe() && L !== (i == null ? void 0 : i.linked)),
      creditedTo: pt() && (i != null && i.address) && (M == null ? void 0 : M.for) === i.address && M.main ? M.main : void 0,
      createdHere: !!(i != null && i.address) && e.store.get(Ee("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (N == null ? void 0 : N.for) === i.address && N.unused,
      gift: (() => {
        const L = K();
        return L ? { player: L.player, from: L.from, source: L.source, amount: L.amount, ...L.drop !== void 0 ? { drop: L.drop } : {} } : null;
      })(),
      giftPlays: K() ? Ne() : 0,
      playCost: wn(Be()),
      giftStop: nr(),
      albumLock: hn(),
      returnPlan: jo(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Pe("slots"),
      likeFunds: (() => {
        var z;
        const L = Ke();
        if (!L || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const G = qe();
        return { address: L, balance: G, low: jt(G), album: Ze(), pending: !!De(L), txid: (z = De(L)) == null ? void 0 : z.txid, main: Qe() };
      })()
    };
  }, _n = () => H ? H < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Je = (a, u = "") => {
    x = a, I = u, e.changed();
  };
  async function $t(a, u) {
    if (!h) {
      h = a, I = "", e.changed();
      try {
        await u();
      } catch (g) {
        const f = g instanceof Error ? g.message : String(g);
        I = /Cancelled in the listening wallet/.test(f) ? "" : f, I || (x = "Not now. Nothing was signed.", ge = !0);
      } finally {
        h = null, await Pn(!0);
      }
    }
  }
  const Ws = () => !!(t != null && t.enabled) && t.here && (pt() || !!Qe() && t.allowed), os = () => Ws() && !fn(), Kn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", bn = () => {
    if (fn()) throw new Error(Kn());
  };
  async function In() {
    if (!Ws()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const Ln = (a) => {
    const u = Qe();
    return a.request("listening.status", u ? { main: u } : void 0);
  };
  async function Qt(a = !1) {
    i != null && i.address && (!a && e.now() - c < 3e4 || (o = await e.chain.balance(i.address), c = e.now(), await Dr(a)));
  }
  async function Dr(a = !1) {
    const u = Ke();
    if (!(!Ze() || !u || (i == null ? void 0 : i.state) !== "unlocked") && !(!a && (l == null ? void 0 : l.for) === u && e.now() - l.at < 3e4))
      try {
        l = { for: u, value: await e.chain.balance(u), at: e.now() };
      } catch {
      }
  }
  async function Ro(a) {
    if ((W !== a || e.now() - ae >= 6e4) && (_ = await e.links(a), W = a, ae = e.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === a) return;
    const u = `${a}:${i.address}`;
    B === u && A || (A = _.find((g) => g.listening === i.address) ?? null, B = u);
  }
  async function Ki() {
    const a = i == null ? void 0 : i.address;
    if (!pt() || !a || i != null && i.linked || !e.funder || b || !o || o <= 0n) return;
    const u = Or(a);
    if (u != null && u.ok && u.funder) return;
    const g = u != null && u.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, k - 1), 30 * 6e4);
    if (!(X && X.for === a && e.now() - X.at < g)) {
      b = !0;
      try {
        X = { for: a, res: await e.funder(a), at: e.now() };
      } catch {
        X = { for: a, res: { ok: !1 }, at: e.now() };
      } finally {
        b = !1;
      }
      k = X.res.ok ? 0 : k + 1;
    }
  }
  async function as() {
    const a = i == null ? void 0 : i.address;
    if (!(!pt() || !a || i != null && i.linked || !e.mainOf || Y) && !(M && M.for === a && (M.ok || e.now() - M.at < 6e4))) {
      Y = !0;
      try {
        M = { for: a, main: await e.mainOf(a), ok: !0, at: e.now() };
      } catch {
        M = { for: a, main: null, ok: !1, at: e.now() };
      } finally {
        Y = !1;
      }
    }
  }
  async function Zs() {
    const a = i == null ? void 0 : i.address;
    if (!(!a || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (N == null ? void 0 : N.for) === a) && e.store.get(Ee("created", a)) !== "1")
      try {
        N = { for: a, unused: await e.chain.confirmedNonce(a) === 0n };
      } catch {
      }
  }
  async function Fr() {
    var C;
    const a = i == null ? void 0 : i.address;
    if (!a) return !1;
    let u, g = !1;
    const f = /* @__PURE__ */ new Map();
    for (const L of Q())
      try {
        const G = await e.chain.transaction(L.txid);
        if (!G) {
          if (Z.add(L.txid), e.now() - L.created > 15 * 6e4 && !f.has(L.address) && f.set(L.address, await e.chain.confirmedNonce(L.address)), u = f.get(L.address), u !== void 0 && u > BigInt(L.nonce)) {
            ct({ ...L, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((L.status === "unknown" || L.status === "signed") && L.raw)
            try {
              await e.chain.broadcast(L.raw, L.txid), ct({ ...L, status: "pending" });
            } catch (J) {
              to(J) && ct({ ...L, status: "failed", note: J.message, raw: void 0 });
            }
          continue;
        }
        Z.delete(L.txid);
        const z = String(G.tx_status);
        if (z === "success" && G.canonical !== !1 && G.is_unanchored === !1) {
          if (ct({ ...L, status: "confirmed", confirmedAt: e.now(), actualFee: String(G.fee_rate ?? L.fee), raw: void 0 }), g = !0, L.kind === "like" && (S = !0, L.status !== "confirmed" && typeof L.liked == "boolean"))
            try {
              (C = e.likeConfirmed) == null || C.call(e, L.song, L.liked);
            } catch {
            }
        } else z.startsWith("abort_") || z.startsWith("dropped_") ? ct({ ...L, status: "failed", note: z, raw: void 0 }) : L.status !== "pending" && ct({ ...L, status: "pending" });
      } catch {
      }
    for (const L of Ze() ? [a, Ke()] : [a]) {
      const G = De(L);
      if (G)
        try {
          const z = await e.chain.transaction(G.txid), J = String((z == null ? void 0 : z.tx_status) ?? "");
          (J === "success" && z.is_unanchored === !1 || J.startsWith("abort_") || J.startsWith("dropped_") || !z && e.now() - G.at > 2 * 36e5) && (ke(null, L), J === "success" && nt(2e4), c = -1 / 0, l = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return g;
  }
  async function Pn(a = !1) {
    var u;
    try {
      const g = Qe();
      if ((a || !t || r !== g || e.now() - n > 3e5) && (t = await e.config(g), n = e.now(), r = g), !t.enabled || !t.here || !pt() && (!g || !t.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), ce && cs(), e.changed();
        return;
      }
      await In(), i = await Ln(s), fn() && i.state === "unlocked" && (Gr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Ln(s)), g && t.allowed && await Ro(g), await Qt(a), await Ki(), await as(), await Zs(), await ot(), await Pt(), await Fr() && await Qt(!0), await Dr(), await Vi(), H = 0;
    } catch {
      H++;
    }
    if (Nn() === "locked" ? Go() : ce && cs(), S) {
      S = !1;
      try {
        (u = e.likesChanged) == null || u.call(e);
      } catch {
      }
    }
    e.changed(), vt.length && !zr && hs();
  }
  async function zo(a) {
    const u = i == null ? void 0 : i.root;
    if (!u || i != null && i.slot || !(i != null && i.address) || Pe("slots")) return;
    const g = Number(e.store.get(Ee("slot", u)));
    if (!(!Number.isSafeInteger(g) || g < 1))
      try {
        const { balance: f } = await e.chain.account(i.address);
        if (f >= zt + wn(Be())) return;
        await a.request("listening.openSlot", { slot: g }), i = await Ln(a), o = void 0, c = -1 / 0;
      } catch {
      }
  }
  async function Js(a, u) {
    var L;
    bn();
    const g = !(i != null && i.address) || j(i.address), f = i != null && i.linked ? (L = e.nameOf) == null ? void 0 : L.call(e, i.linked) : void 0;
    await a.request("listening.unlock", { mode: "unlock", terms: g ? ls() : void 0, anyPasskey: u, ...Qe() ? { main: Qe() } : {}, ...f ? { label: f } : {} }), i = await Ln(a), g && (j(i.address) ? await sr() : await a.request("listening.stop")), await zo(a), Je(g ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const C = y;
    y = null, C && e.now() - C.at < 12e4 && setTimeout(() => void Pn(!0).then(() => Cn(C)), 0);
  }
  function Go() {
    ce || h || ge || Le >= 3 || !s || !(i != null && i.address) || (ce = !0, St = (async () => {
      try {
        await Js(s, !1), Le = 0;
      } catch (a) {
        const u = a instanceof Error ? a.message : String(a);
        /Cancelled in the listening wallet/.test(u) ? Te || (ge = !0, Je("Not now. Nothing was signed.")) : /did not answer/.test(u) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Le++, I = u);
      } finally {
        ce = !1;
        const a = Te;
        Te = null, a ? await a() : await Pn(!0);
      }
    })());
  }
  async function cs(a) {
    ce && (Te = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await St), a && await a(), e.changed();
  }
  const ls = () => ({
    fee: Be().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: Zr.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function sr() {
    if (!(i != null && i.address)) return !1;
    if (D || (D = await e.tabLock(i.address)), !D)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function jr(a, u) {
    const g = i.address, { balance: f, nonce: C } = u ?? await e.chain.account(g);
    o = f;
    const L = await s.request("listening.prepareReturn", {
      mode: a.mode,
      balance: f.toString(),
      nonce: C.toString(),
      fee: Jo.toString(),
      ...a.amount !== void 0 ? { amount: a.amount.toString() } : {},
      ...a.linked ? {} : { destination: a.to }
    });
    if (L.recipient !== a.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const G = a.mode === "amount" ? a.amount : a.mode === "all" ? f - Jo : f - Zr - Jo, z = ho(L.raw);
    if (hr(z.payload.recipient).value !== a.to || String(z.payload.amount) !== L.amount || G !== void 0 && L.amount !== G.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const J = {
      id: Au(),
      address: g,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: L.recipient,
      amount: L.amount,
      fee: L.fee,
      nonce: C.toString(),
      created: e.now(),
      status: "signed",
      raw: L.raw,
      txid: L.txid
    };
    e.validate(J), ct(J);
    try {
      await e.chain.broadcast(L.raw, L.txid), ct({ ...J, status: "pending" });
    } catch (we) {
      throw ct({ ...J, status: "unknown", note: we.message }), we;
    }
    return L;
  }
  const Qs = Fl, us = Jo;
  async function ds(a, u, g) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Pe("slots") || Pe("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const f = i.slot ?? 0;
    if (a === u || ![a, u].includes(f) || ![a, u].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const C = i.root ?? i.address, L = a === 0 ? C : i.address, G = u === 0 ? C : i.address, { balance: z, nonce: J } = await e.chain.account(L);
    if (z < g + us + zt) throw new Error(a === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const we = await s.request("listening.signMove", { from: a, to: u, amount: g.toString(), fee: us.toString(), nonce: J.toString(), balance: z.toString() }), be = ho(we.raw);
    if (we.from !== L || we.to !== G || we.amount !== g.toString() || hr(be.payload.recipient).value !== G || String(be.payload.amount) !== g.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const Se = {
      id: Au(),
      address: L,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: G,
      amount: we.amount,
      fee: we.fee,
      nonce: J.toString(),
      created: e.now(),
      status: "signed",
      raw: we.raw,
      txid: we.txid
    };
    e.validate(Se), ct(Se);
    try {
      await e.chain.broadcast(we.raw, we.txid), ct({ ...Se, status: "pending" });
    } catch (ve) {
      throw ct({ ...Se, status: "unknown", note: ve.message }), ve;
    }
    return ke({ txid: we.txid, amount: we.amount, at: e.now() }, G), G === C && C !== i.address ? l = null : c = -1 / 0, we;
  }
  let ei = !1;
  const at = /* @__PURE__ */ new Map(), ti = (a) => Ee("float", a);
  async function Vi() {
    if (ei || (i == null ? void 0 : i.state) !== "unlocked" || !Ze() || Pe("move") || Pe("rootLike") || !i.address) return;
    const a = i.address;
    if (e.store.get(ti(a)) === "1") return;
    const u = K();
    if (!(u != null && u.player) || u.state !== "arrived") return;
    const g = qe();
    if (g === void 0 || o === void 0) return;
    if (!jt(g)) {
      e.store.set(ti(a), "1");
      return;
    }
    if (De(Ke()) || ir() || Q().length || o < Qs * 4n + zt + us) return;
    const f = at.get(a);
    if (!(f && (f.n >= 3 || e.now() - f.at < 5 * 6e4))) {
      ei = !0, at.set(a, { n: ((f == null ? void 0 : f.n) ?? 0) + 1, at: e.now() });
      try {
        await ds(i.slot ?? 0, 0, Qs), e.store.set(ti(a), "1");
      } catch (C) {
        console.warn("[radio] likes float not sent yet", C);
      } finally {
        ei = !1;
      }
    }
  }
  async function Ko(a) {
    if (te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Pe("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const u = await Gi().catch(() => null);
    if (!u)
      throw se = null, Ce = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Ce = !1, o = u.balance;
    const g = { balance: u.balance, nonce: u.nonce };
    if (a === "excess") {
      const z = V0(u.parts) ?? Sr();
      if (!z) throw new Error("Choose where to send the excess first.");
      await jr({ mode: "excess", to: z, linked: !1 }, g), se = null, Je("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const f = u.steps;
    if (!f.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!se && se.balance === u.balance && e.now() - se.at <= ss && se.steps.length === f.length && se.steps.every((z, J) => z.to === f[J].to && z.mode === f[J].mode && z.send === f[J].send))) {
      se = {
        at: e.now(),
        balance: u.balance,
        steps: f,
        parts: u.parts,
        plan: { state: "ready", steps: f.map((z) => ({ to: z.to, kind: z.kind, send: z.send.toString() })), kept: u.tooSmall, excess: V0(u.parts) }
      }, Je(f.length > 1 ? `This goes back in ${f.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const L = f[0], G = L.to ?? Sr();
    if (!G) throw new Error("Choose where to send the rest first.");
    if (L.mode === "amount" && Pe("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await jr({ mode: L.mode, to: G, linked: !1, ...L.mode === "amount" ? { amount: L.send } : {} }, g), se = null, f.length === 1 ? (P(!1), Je("Returned ✓ Paying is off.")) : Je(`Returned ✓ ${f.length - 1} more ${f.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function ni() {
    if (!(i != null && i.unproven)) return;
    const a = await In();
    await a.request("listening.prove"), i = await Ln(a);
  }
  const Rr = {
    forceRefresh: () => Pn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (a) => {
      if (!e.main() && !(a !== null && !Cr(a))) {
        if (a === qt()) return Pn(!0);
        e.store.set(rn, a ?? ""), I = "", x = "", o = void 0, c = -1 / 0, l = null, await Pn(!0);
      }
    },
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (a) => $t("Waiting for your passkey…", async () => {
      const u = await In();
      await u.request("listening.unlock", { mode: "create", terms: ls(), ...e.main() ? { main: e.main() } : {}, ...a != null && a.quick && !e.main() ? { quick: !0 } : {} }), i = await Ln(u), i.address && e.store.set(Ee("created", i.address), "1"), P(!0), Je(pt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await sr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (a) => {
      a ? nt() : Me = null, e.changed();
    },
    giftSent: (a, u) => {
      !(i != null && i.address) || ie() || (ke({ txid: a, amount: u.toString(), at: e.now() }), c = -1 / 0, O = null, Je("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (a) => {
      if (bn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Pe("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await In()).request("listening.bindSlot", { slot: a, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (a, u, g, f) => {
      ke({ txid: g, amount: f.toString(), at: e.now() }, u), O = null, await Rr.openAlbum(a), Je("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (a) => $t("Opening…", async () => {
      if (bn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Pe("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (p || d || m) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === a) return;
      Gr(), await s.request("listening.openSlot", { slot: a }), i = await Ln(s), o = void 0, c = -1 / 0, se = null, Ce = !1;
      const u = i.root;
      u && a > 0 && e.store.set(Ee("slot", u), String(a)), Je(a === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (a = !1) => {
      const u = () => $t("Waiting for your passkey…", async () => Js(await In(), a));
      return ce ? a ? Pe("cancel") ? (Je("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : cs(async () => {
        (Nn() === "locked" || Nn() === "intro") && await u();
      }) : St : u();
    },
    link: () => $t("Sign in your wallet…", async () => {
      bn();
      const a = e.main();
      if (!a || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const u = (await e.links(a)).find((g) => g.listening === i.address);
      if (u)
        await s.request("listening.link", { main: a, issued: u.issued, mainSignature: u.mainSignature });
      else {
        const g = { main: a, listening: i.address, issued: e.now() }, f = await e.signWithMain(a, J6(g)), C = await s.request("listening.link", { main: a, issued: g.issued, mainSignature: f });
        await e.saveLink({ ...g, mainSignature: f, listeningSignature: C.listeningSignature }), ae = -1 / 0;
      }
      Je("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => i != null && i.unproven ? (await $t("One more passkey check…", ni), !(i != null && i.unproven)) : !0,
    deposit: () => $t("Approve the deposit in your wallet…", async () => {
      bn(), await ni();
      const a = e.main();
      if (!a || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (ie()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (ye()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Qt(!0);
      const u = Su(o ?? 0n);
      if (u <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      U = await e.deposit(a, i.address, u), U && ke({ txid: U, amount: u.toString(), at: e.now() }), Je("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => $t("Approve the top-up in your wallet…", async () => {
      bn(), await ni();
      const a = e.main(), u = Ke();
      if (!a || !u) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (De(u)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const g = await e.chain.balance(u);
      Ze() ? l = { for: u, value: g, at: e.now() } : (o = g, c = e.now());
      const f = Su(g);
      if (f <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const C = await e.deposit(a, u, f);
      C && ke({ txid: C, amount: f.toString(), at: e.now() }, u), Je("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (a) => $t("Adding plays…", async () => {
      if (bn(), !Ze()) throw new Error("Open the album you want to add plays to first.");
      if (!Bc.includes(a)) throw new Error("Choose one of the amounts offered.");
      const u = a5(a, Be());
      if (p || d || m) throw new Error("Still sending a payment. Try again in a moment.");
      if (Q().length || ie()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await ds(0, i.slot ?? 0, u), Je("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => $t("Confirm in the listening wallet…", async () => {
      if (!os()) throw new Error("Connect your wallet first.");
      await sr(), await s.request("listening.approveSession", ls()), P(!0), Je("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => $t("Clearing…", async () => {
      for (const a of Wt())
        await e.chain.transaction(a.txid) || ct({ ...a, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Je("Cleared ✓");
    }),
    switchOff: () => $t("Switching off…", async () => {
      Gr(), await (s == null ? void 0 : s.request("listening.stop")), P(!1), Je("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => $t("Showing your backup words in the box…", async () => {
      if (!(i != null && i.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const a = await In();
      await a.request("listening.backup"), i = await Ln(a), Je("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (a, u) => {
      if ((i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Pe("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await In()).request("listening.signShelf", { action: a, ...u ? { release: u } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      v = null, await Pt(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (a) => $t("Confirm in the listening wallet…", async () => {
      var J, we, be, Se;
      const u = V();
      if ((i == null ? void 0 : i.state) !== "unlocked" || !u) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Pe("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (He(u)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (p || d || m || Q().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await sr();
      const g = await e.awardNote(u, a), { balance: f, nonce: C } = await e.chain.account(u);
      if (f < pc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const G = await (await In()).request("listening.signAward", {
        cls: g.cls,
        number: g.number,
        plays: g.plays,
        record: g.record,
        signature: g.signature,
        fee: pc.toString(),
        nonce: C.toString(),
        balance: f.toString()
      }), z = ho(G.raw);
      if (G.hero !== u || G.number !== g.number || ((we = (J = z.payload) == null ? void 0 : J.functionName) == null ? void 0 : we.content) !== "claim" || ((Se = (be = z.payload) == null ? void 0 : be.contractName) == null ? void 0 : Se.content) !== j6.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(G.raw, G.txid), e.store.set(Ue(u), JSON.stringify({ txid: G.txid, at: e.now() })), c = -1 / 0, ee && (ee = { ...ee, at: -1 / 0 }), Je("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (a) => $t("Confirm in the listening wallet…", async () => {
      var we, be, Se;
      const u = V(), g = et();
      if ((i == null ? void 0 : i.state) !== "unlocked" || !u) throw new Error("Unlock your player first.");
      if ((g == null ? void 0 : g.state) !== "claimed" || g.inscription === void 0) throw new Error("There is no record to send yet.");
      if (g.holds === !1) throw new Error("This record has already been sent.");
      if (g.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (gt(u)) throw new Error("Your record is already on its way.");
      const f = a.trim();
      if (!Cr(f)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (f === u) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Pe("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (p || d || m || Q().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await sr();
      const { balance: C, nonce: L } = await e.chain.account(u);
      if (C < pc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const z = await (await In()).request("listening.signSendRecord", { inscription: g.inscription, recipient: f, fee: pc.toString(), nonce: L.toString(), balance: C.toString() }), J = ho(z.raw);
      if (z.from !== u || z.recipient !== f || z.inscription !== g.inscription || ((be = (we = J.payload) == null ? void 0 : we.functionName) == null ? void 0 : be.content) !== "transfer" || hr((Se = J.payload.functionArgs) == null ? void 0 : Se[2]).value !== f)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(z.raw, z.txid), e.store.set(Ve(u), JSON.stringify({ txid: z.txid, at: e.now() })), c = -1 / 0, ee && (ee = { ...ee, at: -1 / 0 }), Je("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => $t("Locking…", async () => {
      Gr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Je("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (a) => {
      const u = String(a ?? "").trim();
      if (!(i != null && i.address)) return Je("", "Unlock the listening wallet first.");
      if (!Cr(u)) return Je("", "Enter a standard mainnet address (it starts with SP).");
      if (u === i.address) return Je("", "That is this listening wallet itself. Enter a different address.");
      e.store.set($n(i.address), u), Je("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && e.store.set($n(i.address), ""), e.changed();
    },
    returnFunds: (a) => $t("Check the return in the listening wallet…", async () => {
      if (!os()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (is()) return Ko(a);
      const u = E();
      if (!u) throw new Error(pt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (u.kind !== "linked" && Pe("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await jr({ mode: a, to: u.to, linked: u.kind === "linked" }), a === "all" && P(!1), Je(a === "all" ? u.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, vt = [], fs = 10, en = 30 * 6e4;
  let zr = !1;
  const ir = () => p || !!h || d || m, Gr = () => {
    vt.length && (vt.length = 0, e.changed());
  };
  async function Xi(a) {
    if (!vt.some((u) => u.id === a.id) && !Bt().some((u) => u.id === a.id) && (vt.push({ ...a, at: e.now() }), vt.length > fs && vt.shift()), ir() || te().length) {
      const u = vt.length;
      x = `Queued ${u === 1 ? "this song" : u + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await hs();
  }
  async function hs() {
    if (!zr) {
      zr = !0;
      try {
        for (; vt.length; ) {
          for (; vt.length && e.now() - vt[0].at > en; ) vt.shift();
          if (!vt.length || ir() || await Yi(vt[0]) === "wait") return;
          vt.shift();
        }
      } finally {
        zr = !1, e.changed();
      }
    }
  }
  async function Yi(a) {
    var u;
    p = !0;
    try {
      await Pn();
      const g = Nn();
      if (g === "loading") return "wait";
      if (g !== "ready" || !j() || !(i != null && i.session) || i.session.playsLeft < 1 || !D) return "done";
      if (te().length) return "wait";
      $ || (await e.chain.verify(), $ = !0);
      const f = i.address, { balance: C, nonce: L } = await e.chain.account(f);
      o = C, c = e.now();
      const G = await e.chain.owner(vu, a.song);
      if (G === f || G === Qe()) return "done";
      const z = await s.request("listening.signPlay", {
        core: vu,
        song: a.song,
        receipt: a.id,
        fee: Be().toString(),
        nonce: L.toString(),
        balance: C.toString()
      }), J = {
        id: a.id,
        address: f,
        kind: "play",
        core: vu,
        song: a.song,
        recipient: G,
        amount: "50",
        fee: Be().toString(),
        nonce: L.toString(),
        created: e.now(),
        status: "signed",
        raw: z.raw,
        txid: z.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...a.title ? { title: String(a.title).slice(0, 120) } : {},
        ...a.artist ? { artist: String(a.artist).slice(0, 120) } : {}
      };
      e.validate(J), ct(J);
      const we = a.title ? `“${a.title}”${a.artist ? ` by ${a.artist}` : ""}` : `song #${a.song}`;
      try {
        await e.chain.broadcast(z.raw, z.txid), ct({ ...J, status: "pending" }), x = `♪ Paid ${we}`, I = "";
      } catch (be) {
        ct({ ...J, status: to(be) ? "failed" : "unknown", note: be.message, ...to(be) ? { raw: void 0 } : {} }), I = be.message;
      }
      return i = await Ln(s), "done";
    } catch (g) {
      const f = g instanceof Error ? g.message : "payment unavailable";
      return (u = K()) != null && u.player ? (x = "Payment is taking a moment: " + f, "wait") : (x = "This song played free: " + f, "done");
    } finally {
      p = !1, e.changed();
    }
  }
  function ri(a) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Nn()) || Pe("like") ? !1 : (Cn(a), !0);
  }
  async function Cn(a) {
    const u = a.title ? `“${a.title}”` : `song #${a.song}`, g = (w) => {
      var T;
      I = w, x = "";
      try {
        (T = e.likeFailed) == null || T.call(e, a.song);
      } catch {
      }
      e.changed();
    }, f = Ze(), C = Nn(), L = Qe(), G = f && (C === "fund" || C === "over") ? "ready" : C, z = pt() ? Ke() : L;
    if (G === "locked") {
      y = { ...a, at: e.now() }, Je(`Unlock to like ${u}. It sends straight after.`);
      return;
    }
    if (G === "wrong-wallet") return g(Kn());
    if (G === "link") return g("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (pt() && Pe("standalone")) return g("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (G === "fund") return g("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (G === "over") return g("Return the excess first: the listening wallet holds more than 1 STX.");
    if (f) {
      await Dr(!0);
      const w = qe();
      if (jt(w))
        return e.changed(), g(al);
    }
    if (G !== "ready" || !z) return g("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return g("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!D) return g("Pay-per-play is running in another tab. Like from that tab.");
    const J = Bt(Ke()).find((w) => w.kind === "like" && w.song === a.song);
    if (J && Qo.includes(J.status))
      return g(`Your last like for ${u} is still on its way. It can change again once it confirms.`);
    if (d) return g("One like at a time: your last one is still being sent.");
    if ((J == null ? void 0 : J.status) === "confirmed" && e.now() - (J.confirmedAt ?? 0) < l5)
      return g(`Your like for ${u} has only just confirmed. Try again in a moment.`);
    let we;
    m = !0;
    try {
      we = e.likeState ? (await e.likeState(z, a.song)).by : a.likedBy ?? [];
    } catch {
      we = a.likedBy;
    } finally {
      m = !1;
    }
    if (!we) return g(`Could not check ${u} right now. Try the heart again.`);
    const be = Ke(), ve = ((J == null ? void 0 : J.status) === "confirmed" && typeof J.liked == "boolean" && e.now() - (J.confirmedAt ?? J.created) < 5 * 6e4 ? J.liked : void 0) ?? we.includes(be);
    if (!ve && we.some((w) => w !== be)) return g(pt() ? `${u} was liked from another wallet of yours. Unlike it there.` : `${u} was liked from your main wallet${we.includes(L) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await qi({ song: a.song, liked: !ve, title: a.title, artist: a.artist });
  }
  async function qi(a) {
    var f, C, L;
    if (d) {
      Je("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const u = a.title ? `“${a.title}”${a.artist ? ` by ${a.artist}` : ""}` : `song #${a.song}`, g = e.wait ?? ((G) => new Promise((z) => setTimeout(z, G)));
    try {
      Je(`${a.liked ? "Liking" : "Unliking"} ${u}…`);
      const G = e.now() + 12e4;
      for (; p || (Ze() ? Bt(Ke()).some((ve) => Qo.includes(ve.status)) : te().length); ) {
        if (e.now() > G) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await g(5e3), await Pn(!0);
      }
      if (!Ze() && Nn() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const z = Ke(), { balance: J, nonce: we } = await e.chain.account(z);
      if (Ze() ? l = { for: z, value: J, at: e.now() } : (o = J, c = e.now()), jt(J)) throw new Error(al);
      const be = await s.request("listening.signLike", {
        song: a.song,
        liked: a.liked,
        fee: xu.toString(),
        nonce: we.toString(),
        balance: J.toString()
      }), Se = {
        id: Au(),
        address: z,
        kind: "like",
        core: 0,
        song: a.song,
        liked: a.liked,
        recipient: "",
        amount: "0",
        fee: xu.toString(),
        nonce: we.toString(),
        created: e.now(),
        status: "signed",
        raw: be.raw,
        txid: be.txid,
        ...a.title ? { title: String(a.title).slice(0, 120) } : {},
        ...a.artist ? { artist: String(a.artist).slice(0, 120) } : {}
      };
      e.validate(Se), ct(Se);
      try {
        await e.chain.broadcast(be.raw, be.txid), ct({ ...Se, status: "pending" }), x = `${a.liked ? "♥ Liked" : "Unliked"} ${u}`, I = "";
        try {
          (f = e.likeSent) == null || f.call(e, a.song, a.liked);
        } catch {
        }
      } catch (ve) {
        if (ct({ ...Se, status: to(ve) ? "failed" : "unknown", note: ve.message, ...to(ve) ? { raw: void 0 } : {} }), I = ve.message, to(ve)) try {
          (C = e.likeFailed) == null || C.call(e, a.song);
        } catch {
        }
      }
      i = await Ln(s);
    } catch (G) {
      I = "Like not sent: " + (G instanceof Error ? G.message : "the listening wallet is unavailable");
      try {
        (L = e.likeFailed) == null || L.call(e, a.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), hs();
    }
  }
  return { snapshot: Jt, refresh: Pn, onListened: Xi, heart: ri, toggleLike: Cn, ...Rr };
}
const qm = ["Connect", "Passkey", "Link & fund", "Listen"], Wm = ["Passkey", "Add 1 STX", "Listen"], Hd = (e) => e ? Wm : qm;
function d5(e) {
  if (e.solo) return f5(e);
  const t = qm.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function f5(e) {
  const t = Wm.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function h5(e, t) {
  return !t || t.at >= Hd(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const p5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function g5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !p5(r.id)));
}
const y5 = {}, w5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, m5 = (e) => {
  const t = y5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, b5 = (e) => `/hiro/${e}`, x5 = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, S5 = (e) => {
  const t = m5(e);
  if (t)
    return [x5(t)];
  const n = w5[e];
  return typeof window < "u" ? [`${window.location.origin}${b5(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, v5 = {}, X0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, A5 = "xtrata.log.enabled", E5 = "xtrata.log.level", k5 = "xtrata.log.tags", $5 = "xtrata.log.dedupe", gc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, I5 = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, L5 = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, C5 = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, T5 = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, B5 = () => {
  const e = v5 ?? {}, t = gc(A5) ?? e.VITE_LOG_ENABLED, n = gc(E5) ?? e.VITE_LOG_LEVEL, r = gc(k5) ?? e.VITE_LOG_TAGS, s = gc($5) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: I5(t),
    level: L5(n) ?? "warn",
    tags: T5(r),
    dedupe: C5(s)
  };
}, M5 = (e, t, n) => !e.enabled || X0[n] < X0[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), N5 = (e, t, n, r) => {
  const s = B5();
  if (!M5(s, t, e) || P5(s.dedupe))
    return;
  const i = `[xtrata:${t}] ${n}`, o = console[e] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, _5 = /* @__PURE__ */ new Set();
let Y0 = null;
const P5 = (e, t, n, r, s) => (Y0 !== e && (_5.clear(), Y0 = e), !1), U5 = (e, t, n) => N5("debug", e, t, n), H5 = {}, O5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, D5 = (e) => {
  const t = H5, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : O5[e];
}, F5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, j5 = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return F5.test(n) ? n : null;
}, R5 = (e) => e.replace(/\/+$/, ""), z5 = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), q0 = (e) => {
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
}, no = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, G5 = (e) => {
  var l, h;
  let t;
  try {
    t = hr(R$(e));
  } catch {
    return null;
  }
  const n = no(t);
  if (!n || n.success === !1)
    return null;
  const r = no(n.value), s = no(r == null ? void 0 : r.value), i = no(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = q0((l = no(i.name)) == null ? void 0 : l.value), c = q0((h = no(i.namespace)) == null ? void 0 : h.value);
  return !o || !c ? null : j5(`${o}.${c}`);
}, K5 = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${R5(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [Cm(fm(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : G5(i.result);
}, V5 = async (e) => {
  const t = e.address.trim();
  if (!go(t))
    return null;
  const n = D5(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of S5(e.network))
    try {
      return await K5({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (i) {
      r = i;
    }
  return U5("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: z5(r)
  }), null;
};
function X5(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, i = /* @__PURE__ */ new Map(), o = (c, l) => {
    l.pending = !0, l.failedAt = void 0, Promise.resolve().then(() => e(c)).then((h) => {
      l.pending = !1, h && (l.name = h, t());
    }).catch(() => {
      l.pending = !1, l.failedAt = s();
    });
  };
  return {
    get(c) {
      if (!c) return null;
      let l = i.get(c);
      return l ? !l.pending && l.name === null && l.failedAt !== void 0 && s() - l.failedAt >= r && o(c, l) : (l = { name: null, pending: !1 }, i.set(c, l), o(c, l)), l.name;
    }
  };
}
const W0 = Object.freeze({
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
}), Z0 = Object.freeze({ 139: "melophonic" });
function J0(e, t = "") {
  const n = String(e);
  return Object.hasOwn(W0, n) ? W0[n] : Object.hasOwn(Z0, n) ? Z0[n] : t;
}
const Q0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function eg(e, t = "") {
  return Object.hasOwn(Q0, String(e)) ? Q0[String(e)] : t;
}
const Zm = 10000n, eh = 1000000n, cl = 3000n, Y5 = (e, t) => `${e}#gift=${t}`, q5 = 100, ea = (e, t = xr) => e <= zt ? 0 : Number((e - zt) / wn(t)), tg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), Jm = "xtrata.xyz/radio/gifts", yc = q5, W5 = "Create a prefunded Xtrata radio gift batch", Z5 = (e) => ({
  domain: br({ name: xt(Jm), version: xt("1"), "chain-id": En(1) }),
  message: br({
    purpose: xt(W5),
    creator: xt(e.creator),
    count: En(e.count),
    amount: En(BigInt(e.amount)),
    label: xt(e.label),
    issued: En(e.issued),
    ...e.player ? { player: xt(e.player) } : {}
  })
}), J5 = (e, t, n = xr) => zt + BigInt(e) * wn(n) + (t ? Fl : 0n), Q5 = (e, t = xr) => Number((eh - zt - (e ? Fl : 0n)) / wn(t)), eI = (e, t) => BigInt(e) * (t + cl);
function tI(e, t, n, r = xr) {
  const s = n ? Fl : 0n, i = t > zt + s ? t - zt - s : 0n, o = Number(i / wn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * sl,
    fees: BigInt(o) * r,
    reserve: zt,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: cl,
    perCopy: t + cl,
    total: eI(e, t)
  };
}
const nI = (e) => e >= Zm && e <= eh, ng = 40, rI = "Create an Xtrata radio gift player", Od = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), sI = /^[^\u0000-\u001f\u007f<>]+$/u;
function rg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && sI.test(e) : !n;
}
function Qm(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!rg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!rg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > ng) throw new Error(`A player holds 1 to ${ng} songs.`);
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
  const r = [...new Set(n)].sort((s, i) => s - i);
  return { title: e.title, subtitle: e.subtitle ?? "", tracks: [...e.tracks], cover: e.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const eb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return nf(of(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, iI = (e) => ({
  domain: br({ name: xt(Jm), version: xt("1"), "chain-id": En(1) }),
  message: br({
    purpose: xt(rI),
    admin: xt(e.admin),
    player: xt(e.hash),
    issued: En(e.issued)
  })
}), yr = (e) => e.tracks.filter((t) => !t.hidden), oI = (e) => e.tracks.find((t) => t.hidden) ?? null, Eu = [300, 500, 1e3], sg = 1800, ku = /* @__PURE__ */ new Map();
async function aI(e) {
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
function cI(e, t, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = e, (() => {
    const c = ku.get(e), l = !!c && c.until > Date.now();
    i.textContent = l ? c.label : t, i.classList.toggle("is-done", l && c.ok), i.classList.toggle("is-failed", l && !c.ok);
  })(), i.onclick = async () => {
    const c = await n();
    if (c) {
      ku.set(e, { ...c, until: Date.now() + sg });
      for (const l of document.querySelectorAll("button[data-feedback]"))
        l.dataset.feedback === e && (l.textContent = c.label, l.classList.remove("is-done", "is-failed", "is-pop"), l.offsetWidth, l.classList.add(c.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ku.delete(e), s();
      }, sg + 50);
    }
  }, i;
}
const Jn = (e, t, n, r, s) => cI(e, t, async () => await aI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), ii = "xtrata.radio.gift.incoming.v1", ig = (e) => "xtrata.radio.gift.mine.v1:" + e, og = (e) => "xtrata.radio.gift.batches.v1:" + e, xe = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, ar = (e, t, n = "") => {
  const r = xe("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, ta = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Yn = (e) => dr(e).replace(/\.?0+$/, "");
function lI(e) {
  let t = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), F = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return F !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), tg(F) ? F : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const E = JSON.parse(e.store.get(ii) || "null");
      return tg(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    t = { code: i }, e.store.set(ii, JSON.stringify({ code: i, at: e.now() }));
    let E = 0;
    const F = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (K) => {
      const V = await K.json().catch(() => ({}));
      if (K.status === 404) {
        e.store.set(ii, null), t = { ...t, error: (V == null ? void 0 : V.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!K.ok) throw new Error("busy");
      const ee = V;
      t = { ...t, view: ee, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ee.status) && e.store.set(ii, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void F(), n(E++)));
    });
    F();
  }
  const o = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, c = () => {
    const E = t == null ? void 0 : t.view;
    return !(E != null && E.player) || !o() ? null : { player: E.player, from: d(E), plays: ea(BigInt(E.amount)) };
  }, l = () => {
    const E = t == null ? void 0 : t.view;
    return !E || E.player || !o() ? null : { plays: ea(BigInt(E.amount)), from: E.from ? e.who(E.from) : null };
  }, h = () => {
    const E = t == null ? void 0 : t.code;
    if (!E) return [];
    const F = `${location.origin}${location.pathname}#gift=${E}`;
    return [Jn("gift-pass-on", "Copy the link to pass on", () => F, "primary", e.changed)];
  }, p = () => {
    t = null, e.store.set(ii, null), e.changed();
  }, d = (E) => E.from ? e.who(E.from) : E.label ? `Xtrata Radio · ${E.label}` : "Xtrata Radio";
  let m = {};
  const y = (E) => {
    if (m.box) return m.box;
    const F = xe("div", "", "ppp-gift-check");
    m.box = F;
    const K = () => {
      const V = window.turnstile;
      !V || m.rendered || (m.rendered = !0, V.render(F, { sitekey: E, callback: (ee) => {
        m.token = ee, e.changed();
      }, "expired-callback": () => {
        m.token = void 0;
      } }));
    };
    if (window.turnstile) K();
    else {
      const V = document.createElement("script");
      V.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", V.async = !0, V.onload = K, document.head.append(V);
    }
    return F;
  }, S = (E) => {
    queueMicrotask(() => void E());
  };
  let x;
  async function I(E) {
    var V, ee, v, oe, Ue, Ve, gt, He, Pt;
    if (!t || t.claiming || !E.listening) return;
    const F = !!((V = t.view) != null && V.player);
    if (F && !E.root) return;
    t.claiming = !0, t.error = void 0, (ee = e.claiming) == null || ee.call(e, !0), e.changed();
    const K = async (et) => {
      const ot = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: m.token, ...et })
      });
      return { res: ot, r: await ot.json().catch(() => ({})) };
    };
    try {
      let et = 0, ot = E.listening, Ut;
      if (F) {
        const Xt = Number((v = await e.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : v.next);
        if (!Number.isSafeInteger(Xt) || Xt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        et = Xt;
        for (let nr = 0; ; nr++) {
          const rr = await e.album.bind(et);
          if (ot = rr.address, Ut = await K({ wallet: ot, binding: rr }), Ut.res.status === 409 && /just taken/.test(((oe = Ut.r) == null ? void 0 : oe.error) || "") && nr < 5) {
            et += 1;
            continue;
          }
          break;
        }
      } else Ut = await K({ wallet: ot });
      const { res: Ne, r: Zt } = Ut;
      if (Ne.status === 503 && /sending another gift/.test((Zt == null ? void 0 : Zt.error) || "")) {
        t.waiting = !0, (Ue = e.claiming) == null || Ue.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!Ne.ok) {
        const Xt = String((Zt == null ? void 0 : Zt.error) || "");
        if (Ne.status === 404 || Ne.status === 410 || Ne.status === 409 && /already had a gift|brand-new|already have this album/.test(Xt))
          throw e.store.set(ii, null), new Error(Xt || "This gift cannot be opened.");
        if (Ne.status === 429 || Ne.status === 403 || Ne.status === 400 && !/wallet number/i.test(Xt)) throw new Error(Xt || `Could not open the gift (${Ne.status}).`);
        const rr = /topping up/.test(Xt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(Xt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(Xt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(rr), { retry: !0, slow: /topping up|not paid for yet/.test(Xt) });
      }
      t.done = !0, e.store.set(ii, null), F ? await e.album.arrived(et, ot, Zt.txid, BigInt(Zt.amount)) : e.giftSent(Zt.txid, BigInt(Zt.amount));
    } catch (et) {
      const ot = et, Ut = ot.name === "TypeError" || ot.name === "AbortError" || ot.name === "TimeoutError" || /wallet number/i.test(ot.message);
      if (ot.retry || Ut) {
        const Ne = t.tries ?? 0;
        t.tries = Ne + 1, t.retry = { text: ot.retry ? ot.message : "Still sending your gift… the network is slow, trying again." }, (Ve = e.claiming) == null || Ve.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, ot.slow ? 6e4 : n(Ne));
      } else
        t.error = ot.message, (gt = e.claiming) == null || gt.call(e, !1);
      m.token = void 0;
      try {
        (Pt = (He = window.turnstile) == null ? void 0 : He.reset) == null || Pt.call(He, m.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let H = null;
  function U(E) {
    if (!E.listening || !E.depositPending || E.step !== "fund")
      return H = null, [];
    if (!H || H.wallet !== E.listening || e.now() - H.at > 3e4) {
      const K = E.listening;
      H = { ...(H == null ? void 0 : H.wallet) === K ? H : {}, wallet: K, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(K)).then((V) => {
        var ee, v;
        (H == null ? void 0 : H.wallet) === K && (H.state = (ee = V == null ? void 0 : V.gift) == null ? void 0 : ee.state, H.problem = ((v = V == null ? void 0 : V.gift) == null ? void 0 : v.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(H.state === "sending" && H.problem)) return [];
    const F = xe("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return F.title = `Network reply: ${H.problem}`, [F];
  }
  function A(E, F, K = !1) {
    var Ve, gt;
    const V = F.player, ee = BigInt(F.amount), v = K ? [] : [xe("p", `🎁 ${d(F)} sent you “${V.title}”${V.subtitle ? ` by ${V.subtitle}` : ""}: ${yr(V).length} ${yr(V).length === 1 ? "song" : "songs"} and ${ea(ee).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step))) {
      if (K) return v;
      if (v.push(xe("p", E.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : E.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), E.step === "intro") {
        const He = document.createElement("details");
        He.className = "ppp-how";
        const Pt = document.createElement("summary");
        Pt.textContent = "How does this work?", He.append(Pt, xe("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), v.push(He);
      }
      return v;
    }
    if (E.walletCannotAlbums)
      return v.push(xe("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), v;
    const Ue = (gt = (Ve = E.gate) == null ? void 0 : Ve.gifts) == null ? void 0 : gt.turnstileSiteKey;
    return Ue && !m.token ? v.push(xe("p", "One quick check and it is yours:", "ppp-mute"), y(Ue)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => I(E)), v.push(...B(E, "Sending your album…")), v;
  }
  function B(E, F) {
    const K = [];
    return t.claiming || t.waiting ? K.push(xe("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : F, "ppp-cyan")) : t.retry && K.push(xe("p", t.retry.text, "ppp-warn"), ar("Try now", () => {
      clearTimeout(x), t.retry = void 0, I(E);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? K.push(xe("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...h(), ar("Forget this gift link here", p, "quiet")) : t.error && K.push(xe("p", t.error, "ppp-bad"), ar("Try again", () => {
      t.error = void 0, I(E);
    })), K;
  }
  const _ = (E) => {
    var F;
    return !!t && !t.done && !t.error && o() && !!E.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !E.linked && !E.creditedTo && (E.createdHere || E.brandNew || !!((F = t.view) != null && F.player)) && (E.balance ?? 0n) === 0n && !E.entries.length);
  };
  function W(E, F = {}) {
    var Pt, et;
    const K = U(E);
    if (!t || ["off", "elsewhere"].includes(E.step)) return K;
    const V = t.view;
    if (t.error && !V) return [xe("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!V) return [xe("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return K;
    if (V.status === "claimed" || V.status === "claiming") return [xe("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(V.status)) return [xe("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (V.status === "pending-deposit") return [xe("p", `🎁 ${d(V)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (V.player) return [...A(E, V, !!F.bare), ...K];
    if (!!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0))
      return [xe("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...h(), ar("Forget this gift link here", p, "quiet")];
    const v = BigInt(V.amount), oe = ea(v).toLocaleString(), Ue = xe(
      "p",
      `🎁 ${d(V)} sent you ${Yn(v)} STX of on-chain music: about ${oe} paid plays.`,
      "ppp-gift"
    ), Ve = F.bare ? [] : [Ue], gt = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, He = (et = (Pt = E.gate) == null ? void 0 : Pt.gifts) == null ? void 0 : et.turnstileSiteKey;
    return gt ? (He && !m.token ? Ve.push(xe("p", "One quick check and it is yours:", "ppp-mute"), y(He)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => I(E)), Ve.push(...B(E, "Sending your gift…"))) : E.step === "intro" ? F.bare || Ve.push(xe("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : E.listening && E.linked ? Ve.push(xe("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...h(), ar("Forget this gift link here", p, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && Ve.push(xe("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...h(), ar("Forget this gift link here", p, "quiet")), Ve;
  }
  async function ae(E, F, K) {
    var V;
    try {
      const ee = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(E));
      if ((V = ee == null ? void 0 : ee.gift) != null && V.returnTo) return { ok: !0, funder: ee.gift.returnTo, txId: ee.gift.txid ?? void 0, amount: ee.gift.amount, distinct: 1 };
    } catch {
      if (K) return { ok: !1 };
    }
    return F();
  }
  const Z = xe("div", "", "ppp-gift-fold");
  let X = 250000n, b = "", k = "";
  const M = (E) => {
    try {
      const F = JSON.parse(e.store.get(ig(E)) || "[]");
      return Array.isArray(F) ? F : [];
    } catch {
      return [];
    }
  }, N = (E, F) => e.store.set(ig(E), JSON.stringify(F.slice(0, 50)));
  async function Y(E) {
    const F = M(E);
    for (const K of F)
      if (!(K.view && ["claimed", "refunded", "expired"].includes(K.view.status)))
        try {
          K.view = !K.view || K.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: K.id, ...K.txid ? { txid: K.txid } : {} }) }) : await e.json("/radio/gift?id=" + K.id), K.error = void 0;
        } catch (V) {
          K.error = V.message;
        }
    N(E, F), e.changed();
  }
  async function O(E) {
    if (b) return;
    b = "Starting your gift…", k = "", e.changed();
    let F = null;
    try {
      F = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: X.toString() }) });
      const K = M(E);
      K.unshift({ id: F.id, code: F.code, amount: X.toString(), at: e.now() }), N(E, K), b = "Approve the gift in your wallet…", e.changed();
      const V = await e.pay(E, F.depositTo, BigInt(F.deposit), F.memo), ee = M(E), v = ee.find((oe) => oe.id === F.id);
      v && (v.txid = V, v.view = { status: "pending-deposit", amount: X.toString(), source: "friend", from: E, label: "", expires: 0 }), N(E, ee), k = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", Y(E);
    } catch (K) {
      k = K.message || "Not sent.";
    } finally {
      b = "", e.changed();
    }
  }
  const pe = (E) => "xtrata.radio.gift.players.v1:" + E, se = (E) => {
    try {
      const F = JSON.parse(e.store.get(pe(E)) || "[]");
      return Array.isArray(F) ? F.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id)) : [];
    } catch {
      return [];
    }
  };
  async function Ce(E, F) {
    var K;
    if (!b) {
      b = "Checking the player…", k = "", e.changed();
      try {
        const V = F.tracks.split(/[\s,]+/).filter(Boolean).map((He) => Number(He.replace(/^#/, ""))), ee = (F.explicit ?? "").split(/[\s,]+/).map((He) => He.replace(/^#/, "")).filter(Boolean).map(Number), v = Qm({ title: F.title.trim(), subtitle: F.subtitle.trim(), tracks: V, cover: (K = F.cover) != null && K.trim() ? Number(F.cover.trim().replace(/^#/, "")) : null, ...ee.length ? { explicit: ee } : {} });
        b = "Sign in your wallet…", e.changed();
        const oe = { admin: E, hash: eb(v), issued: e.now() }, Ue = await e.sign(E, iI(oe));
        b = "Making the player…", e.changed();
        const Ve = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: v, request: oe, signature: Ue }) }), gt = se(E).filter((He) => He.id !== Ve.id);
        gt.unshift({ id: Ve.id, title: Ve.title, tracks: Ve.tracks }), e.store.set(pe(E), JSON.stringify(gt.slice(0, 30))), k = `${Ve.existing ? "That player already exists" : "Player made"} ✓ “${Ve.title}” · ${Ve.tracks} songs. Pick it below for a batch.`;
      } catch (V) {
        k = V.message || "Not made.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const $ = (E, F) => Y5(E || location.origin + "/radio.html", F), D = (E) => {
    try {
      const F = JSON.parse(e.store.get(og(E)) || "[]");
      return Array.isArray(F) ? F.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id) && Array.isArray(K.codes)) : [];
    } catch {
      return [];
    }
  }, ce = (E, F) => e.store.set(og(E), JSON.stringify(F.slice(0, 20))), ge = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, Le = (E, F) => e.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(F) });
  let Te = 0;
  async function St(E) {
    const F = D(E);
    for (const K of F)
      if (!ge(K))
        try {
          K.view = !K.view || K.view.status === "pending-deposit" ? await Le("/radio/gift/batch/confirm", { id: K.id, ...K.txid ? { txid: K.txid } : {} }) : await e.json("/radio/gift/batch?id=" + K.id), K.error = void 0;
        } catch (V) {
          K.error = V.message;
        }
    try {
      const K = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const V of (K == null ? void 0 : K.batches) ?? []) {
        const ee = F.find((v) => v.id === V.id);
        if (ee) {
          ee.error || (ee.view = V);
          continue;
        }
        F.push({ id: V.id, codes: [], count: V.count, amount: V.amount, label: V.label, player: V.player, depositTo: "", deposit: V.deposit, memo: V.memo, at: 0, view: V });
      }
    } catch {
    }
    ce(E, F), e.changed();
  }
  async function Be(E, F) {
    const K = D(E).find((V) => V.id === F);
    if (!(!K || !K.depositTo || b)) {
      b = "Approve the payment in your wallet…", k = "", e.changed();
      try {
        const V = await e.pay(E, K.depositTo, BigInt(K.deposit), K.memo), ee = D(E), v = ee.find((oe) => oe.id === F);
        v && (v.txid = V), ce(E, ee), k = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", b = "", St(E);
      } catch (V) {
        k = `${/cancel/i.test(V.message) ? "Payment cancelled." : V.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        b = "", e.changed();
      }
    }
  }
  async function Pe(E, F, K, V) {
    if (b) return;
    if (!F.ok) {
      k = F.reason, e.changed();
      return;
    }
    b = "Sign in your wallet…", k = "", e.changed();
    let ee = null;
    try {
      const v = { creator: E, count: F.count, amount: F.amount.toString(), label: K, issued: e.now(), ...V ? { player: V } : {} }, oe = await e.sign(E, Z5(v));
      b = "Making your links…", e.changed(), ee = await Le("/radio/gift/batch", { request: v, signature: oe });
      const Ue = D(E);
      Ue.unshift({ id: ee.id, codes: ee.codes, count: F.count, amount: ee.amount, label: K, player: V ?? null, depositTo: ee.depositTo, deposit: ee.deposit, memo: ee.memo, at: e.now() }), ce(E, Ue);
    } catch (v) {
      k = v.message || "Not made.", b = "", e.changed();
      return;
    }
    b = "", e.changed(), await Be(E, ee.id);
  }
  const Ee = () => rn(!!nt.value, ye.value, me.value);
  function rn(E, F, K) {
    const V = F === "max" ? Q5(E) : Number(F), ee = J5(V, E), v = Number(K);
    return !Number.isInteger(v) || v < 1 || v > yc ? { ok: !1, reason: `Make 1 to ${yc} copies at a time.`, album: E, plays: V, amount: ee, count: v } : nI(ee) ? { ok: !0, reason: "", album: E, plays: V, amount: ee, count: v, bill: tI(v, ee, E) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: E, plays: V, amount: ee, count: v };
  }
  const qt = (E = Ee()) => {
    if (!E.ok) return E.reason;
    const F = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${Yn(F.holders)} to song holders, ${Yn(F.fees)} network fees)${E.album ? `, ${Yn(F.float)} for the album’s likes` : ""}, ${Yn(F.reserve)} kept so a listener can return what is left, + ${Yn(F.sendFee)} to send it = ${Yn(F.perCopy)} STX. ${E.count} copies = ${Yn(F.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Qe = (E, F) => F.codes.map((K) => $(E, K)), Bt = xe("input");
  Bt.type = "range", Bt.min = String(Zm), Bt.max = String(eh), Bt.step = "10000", Bt.value = String(X), Bt.setAttribute("aria-label", "Gift amount");
  const ct = xe("p", "", "ppp-gift-amount"), j = ar("", () => {
    const E = e.main();
    E && O(E);
  }, "primary"), P = () => {
    ct.textContent = te(), j.textContent = `Gift ${Yn(X)} STX`;
  };
  Bt.oninput = () => {
    X = BigInt(Bt.value), P();
  };
  const te = () => `${Yn(X)} STX · about ${ea(X).toLocaleString()} paid plays · you pay ${Yn(X + cl)} STX with the network fee`;
  P();
  const Q = xe("input");
  Q.maxLength = 60, Q.placeholder = "Title, e.g. Proof of Sound", Q.setAttribute("aria-label", "Player title");
  const ie = xe("input");
  ie.maxLength = 80, ie.placeholder = "Artist (optional)", ie.setAttribute("aria-label", "Player subtitle");
  const De = xe("textarea");
  De.rows = 3, De.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", De.setAttribute("aria-label", "Songs");
  const ke = xe("input");
  ke.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", ke.setAttribute("aria-label", "Explicit songs");
  const Me = xe("input");
  Me.inputMode = "numeric", Me.placeholder = "Cover inscription number (optional), shown when the album loads", Me.setAttribute("aria-label", "Cover inscription");
  const nt = xe("select");
  nt.setAttribute("aria-label", "Batch album");
  const ye = xe("select");
  ye.setAttribute("aria-label", "Plays per copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Eu])].sort((F, K) => F - K)) ye.append(ta(`${E.toLocaleString()} plays`, String(E)));
  ye.append(ta("Max (1 STX)", "max")), ye.value = String(Eu[0]);
  const me = xe("input");
  me.type = "number", me.min = "1", me.max = String(yc), me.value = "10", me.setAttribute("aria-label", "Copies");
  const Ke = xe("input");
  Ke.maxLength = 40, Ke.placeholder = "Label, e.g. Opera launch", Ke.setAttribute("aria-label", "Batch label");
  const Ze = xe("p", "", "ppp-mute"), qe = () => {
    Ze.textContent = qt();
  };
  for (const E of [nt, ye, me])
    E.oninput = qe, E.onchange = qe;
  qe();
  function jt(E, F, K) {
    const V = F.view, ee = V == null ? void 0 : V.copies, v = F.error ? F.error : !V || V.status === "pending-deposit" ? F.txid ? "payment confirming…" : "waiting for your payment" : `${ee.claimed} of ${V.count} claimed${ee.refunding + ee.refunded ? ` · ${ee.refunded} refunded${ee.refunding ? `, ${ee.refunding} on their way` : ""}` : ""}`, oe = xe("li");
    if (oe.append(xe("span", `${F.label || "Batch"} · ${F.count} × ${Yn(BigInt(F.amount))} STX`, "t"), xe("span", v, "ppp-mute")), !F.txid && F.depositTo && (!V || V.status === "pending-deposit") && oe.append(ar("Pay now", () => void Be(E, F.id), "tiny")), F.codes.length && (V == null ? void 0 : V.status) === "live") {
      const Ue = Qe(K, F);
      oe.append(
        Jn("batch-copy:" + F.id, "Copy all links", () => Ue.join(`
`), "tiny", e.changed),
        Jn("batch-csv:" + F.id, "Copy as CSV", () => ["copy,link", ...Ue.map((Ve, gt) => `${gt + 1},${Ve}`)].join(`
`), "tiny", e.changed)
      );
    } else F.codes.length || oe.append(xe("span", "links were made on another device", "ppp-mute"));
    return oe;
  }
  const Wt = xe("select");
  Wt.setAttribute("aria-label", "Plays in each copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Eu])].sort((F, K) => F - K)) Wt.append(ta(`${E.toLocaleString()} plays`, String(E)));
  Wt.value = "50";
  const Vt = xe("input");
  Vt.type = "number", Vt.min = "1", Vt.max = String(yc), Vt.value = "10", Vt.setAttribute("aria-label", "How many copies");
  const pt = xe("input");
  pt.maxLength = 40, pt.placeholder = "A note recipients see, e.g. Launch week (optional)", pt.setAttribute("aria-label", "Note for recipients");
  const fn = xe("p", "", "ppp-mute");
  function $n(E, F, K) {
    const V = () => rn(!0, Wt.value, Vt.value), ee = () => {
      fn.textContent = qt(V());
    };
    for (const He of [Wt, Vt])
      He.oninput = ee, He.onchange = ee;
    ee();
    const v = () => (pt.value.trim() || F.title).replace(/[^ -~]/g, "").slice(0, 40), oe = ar("Sign, pay and make links", () => {
      Pe(E, V(), v(), F.id);
    }, "primary");
    oe.disabled = !!b;
    const Ue = (He, Pt) => {
      const et = xe("label", He);
      return et.append(Pt), et;
    }, Ve = [
      xe("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims within 30 days come back to you.", "ppp-mute"),
      Ue("Plays in each ", Wt),
      Ue("Copies ", Vt),
      pt,
      fn,
      oe
    ];
    e.now() - Te > 3e4 && (Te = e.now(), St(E));
    const gt = D(E).filter((He) => He.player === F.id);
    if (gt.length) {
      const He = xe("ul", "", "ppp-gift-list");
      for (const Pt of gt.slice(0, 10)) He.append(jt(E, Pt, K));
      Ve.push(He);
    }
    return b && Ve.push(xe("p", b, "ppp-cyan")), k && Ve.push(xe("p", k, /✓/.test(k) ? "ppp-ok" : "ppp-warn")), Ve;
  }
  function Sr(E) {
    var ee, v;
    const F = (ee = E.gate) == null ? void 0 : ee.gifts;
    if (!(F != null && F.enabled) || !F.admin || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const K = e.main(), V = [xe("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!K)
      V.push(xe("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (F.admin) {
      const oe = xe("div", "", "ppp-gift-admin"), Ue = (et, ot) => {
        const Ut = xe("label", et);
        return Ut.append(ot), Ut;
      }, Ve = se(K);
      oe.append(
        xe("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Q,
        ie,
        De,
        Me,
        ke,
        ar("Sign and make player", () => void Ce(K, { title: Q.value, subtitle: ie.value, tracks: De.value, cover: Me.value, explicit: ke.value }))
      );
      const gt = ar("Sign, pay and make links", () => {
        Pe(K, Ee(), Ke.value.trim(), nt.value || void 0);
      });
      gt.disabled = !!b;
      const He = nt.value;
      nt.replaceChildren(ta("No album (starter copies)", ""), ...Ve.map((et) => ta(`${et.title} · ${et.tracks} songs`, et.id))), Ve.some((et) => et.id === He) && (nt.value = He), qe(), oe.append(
        xe("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        Ue("Album ", nt),
        Ue("Plays each ", ye),
        Ue("Copies ", me),
        Ke,
        Ze,
        gt
      ), e.now() - Te > 3e4 && (Te = e.now(), St(K));
      const Pt = D(K);
      if (Pt.length) {
        const et = xe("ul", "", "ppp-gift-list");
        for (const ot of Pt.slice(0, 10)) et.append(jt(K, ot, ((v = E.gate) == null ? void 0 : v.radioUrl) ?? null));
        oe.append(et);
      }
      V.push(oe);
    }
    return b && V.push(xe("p", b, "ppp-cyan")), k && V.push(xe("p", k, /✓/.test(k) ? "ppp-ok" : "ppp-warn")), Z.replaceChildren(...V), Z;
  }
  return { banner: W, funder: ae, renderFold: Sr, copies: $n, liveGift: o, incomingAlbum: c, incomingStarter: l, setAside: p, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: _ };
}
const uI = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function dI(e) {
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
const fI = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function hI(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((i) => (!t.pinnedOnly || t.pins.has(i.slot)) && (() => {
    const o = fI(i);
    return n.every((c) => o.includes(c));
  })()), s = {
    recent: (i, o) => (t.recents[o.slot] ?? 0) - (t.recents[i.slot] ?? 0) || o.slot - i.slot,
    newest: (i, o) => o.slot - i.slot,
    oldest: (i, o) => i.slot - o.slot,
    title: (i, o) => {
      var c, l;
      return (((c = i.player) == null ? void 0 : c.title) ?? "").localeCompare(((l = o.player) == null ? void 0 : l.title) ?? "") || i.slot - o.slot;
    }
  };
  return r.sort((i, o) => Number(t.pins.has(o.slot)) - Number(t.pins.has(i.slot)) || s[t.sort](i, o));
}
function pI(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Dd = /* @__PURE__ */ new Set(), th = (e) => (Dd.add(e), () => {
  Dd.delete(e);
}), ll = () => {
  for (const e of [...Dd])
    try {
      e();
    } catch {
    }
}, ag = "xtrata:al-thumb:v1:", nh = "-", na = 96, gI = 24 * 1024 * 1024, nn = /* @__PURE__ */ new Map(), cg = /* @__PURE__ */ new Set(), Fd = [];
let $u = !1, Iu;
const ka = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(ag + e);
    window.localStorage.setItem(ag + e, t);
  } catch {
  }
  return null;
};
function rh(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return t(e);
      const i = new Image(), o = setTimeout(() => t(e), 8e3);
      i.onload = () => {
        clearTimeout(o);
        try {
          const c = Math.min(i.naturalWidth, i.naturalHeight);
          if (!c) return t(e);
          r.width = r.height = na, s.fillStyle = "#143a40", s.fillRect(0, 0, na, na), s.drawImage(i, (i.naturalWidth - c) / 2, (i.naturalHeight - c) / 2, c, c, 0, 0, na, na), t(r.toDataURL("image/jpeg", 0.82));
        } catch {
          t(e);
        }
      }, i.onerror = () => {
        clearTimeout(o), t(e);
      }, i.src = e;
    } catch {
      t(e);
    }
  });
}
async function yI(e) {
  var l, h, p, d, m;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((l = t.body) == null ? void 0 : l.cancel()), null;
  if (n.startsWith("image/"))
    return await ((h = t.body) == null ? void 0 : h.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((p = t.body) == null ? void 0 : p.cancel()), "";
  let r = "", s = 0;
  const i = (y) => {
    let S = 0;
    for (; ; ) {
      const x = r.slice(S).search(/<img\b/i);
      if (x < 0)
        return r = y ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const I = S + x, H = r.indexOf(">", I);
      if (H < 0)
        return r = r.slice(I), null;
      const U = r.slice(I, H + 1), A = U.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const B = U.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (B) return "/inscription/" + B[1];
      S = H + 1;
    }
  }, o = (m = (d = t.body) == null ? void 0 : d.getReader) == null ? void 0 : m.call(d);
  if (!o)
    return r = await t.text(), i(!0) ?? "";
  const c = new TextDecoder();
  for (; ; ) {
    const { done: y, value: S } = await o.read();
    if (y) break;
    s += S.byteLength, r += c.decode(S, { stream: !0 });
    const x = i(!1);
    if (x)
      return await o.cancel(), x;
    if (s > gI)
      return await o.cancel(), null;
  }
  return r += c.decode(), i(!0) ?? "";
}
async function wI() {
  if (!$u) {
    $u = !0;
    try {
      for (; Fd.length; ) {
        const e = Fd.shift();
        if (!nn.has(e))
          try {
            const t = await yI(e);
            if (t === null) continue;
            if (!t) {
              nn.set(e, ""), ka(e, nh), ll();
              continue;
            }
            const n = await rh(t);
            nn.set(e, n), n.startsWith("data:image/jpeg") && ka(e, n), ll();
          } catch {
          }
      }
    } finally {
      $u = !1;
    }
  }
}
function sh(e, t) {
  if (t && !nn.get(e) ? (nn.set(e, t), rh(t).then((r) => {
    r !== t && (nn.set(e, r), r.startsWith("data:image/jpeg") && ka(e, r), ll());
  })) : t === "" && !nn.has(e) && nn.set(e, ""), nn.has(e)) return nn.get(e);
  const n = ka(e);
  if (n != null) {
    const r = n === nh ? "" : n;
    return nn.set(e, r), r;
  }
  return cg.has(e) || (cg.add(e), Fd.push(e), Iu || (Iu = setTimeout(() => {
    Iu = void 0, wI();
  }, 1200))), "";
}
function lg(e) {
  if (nn.has(e)) return nn.get(e);
  const t = ka(e);
  if (t == null) return null;
  const n = t === nh ? "" : t;
  return nn.set(e, n), n;
}
const Lu = /* @__PURE__ */ new Map(), Cu = /* @__PURE__ */ new Set();
function Mc(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : Lu.has(e) ? Lu.get(e) : (Cu.has(e) || (Cu.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, s, i, o;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = t.body) == null ? void 0 : s.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((i = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : i[1]) ?? "").replace(/&amp;/g, "&") : (await ((o = t.body) == null ? void 0 : o.cancel()), "");
  }).then((t) => {
    Lu.set(e, t), ll();
  }).catch(() => {
    Cu.delete(e);
  })), "");
}
const ro = 12, mI = 5e3, gn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, so = (e, t, n = "") => {
  const r = gn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function bI(e) {
  let t, n = [], r = 0, s = !1, i = !1, o = -1 / 0, c = "", l = "recent", h = !1, p = ro;
  const d = gn("div", "", "ppp-shelf-box");
  th(() => e.changed());
  const m = (M) => "xtrata.radio.shelf.pins.v1:" + M, y = (M) => "xtrata.radio.shelf.recent.v1:" + M, S = (M, N) => {
    try {
      return JSON.parse(e.store.get(M) || "null") ?? N;
    } catch {
      return N;
    }
  }, x = (M) => new Set(S(m(M), []).filter((N) => Number.isSafeInteger(N))), I = (M) => {
    const N = S(y(M), {}), Y = {};
    for (const [O, pe] of Object.entries(N)) Number.isSafeInteger(Number(O)) && typeof pe == "number" && (Y[Number(O)] = pe);
    return Y;
  };
  async function H(M) {
    if (!s) {
      s = !0, i = !1;
      try {
        const N = [];
        let Y = 0, O = 0;
        for (let pe = 0; pe < mI / 100 + 1; pe++) {
          const se = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(M)}&after=${Y}&limit=100`);
          if (N.push(...dI(se == null ? void 0 : se.shelf)), O = Number(se == null ? void 0 : se.total) || N.length, !(se != null && se.next) || !Number.isSafeInteger(se.next)) break;
          Y = se.next;
        }
        M === t && (n = N, r = O, o = e.now());
      } catch {
        i = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const U = () => {
    o = -1 / 0;
  }, A = gn("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    c = A.value, p = ro, e.changed();
  };
  const B = gn("select");
  B.setAttribute("aria-label", "Sort albums");
  for (const M of uI) {
    const N = document.createElement("option");
    N.value = M.value, N.textContent = M.label, B.append(N);
  }
  B.onchange = () => {
    l = B.value, p = ro, e.changed();
  };
  const _ = so("", () => {
    h = !h, p = ro, e.changed();
  }, "tiny"), W = gn("div", "", "ppp-shelf-tools");
  W.append(A, B, _);
  const ae = gn("div"), Z = gn("div");
  function X(M) {
    const N = M.step === "off" || M.step === "elsewhere" ? void 0 : M.root;
    if (N !== t && (t = N, n = [], r = 0, o = -1 / 0, p = ro), !N || M.walletCannotAlbums) return null;
    if (!s && e.now() - o > 5 * 6e4 && H(N), !n.length)
      return i ? (Z.replaceChildren(gn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), so("Try again", () => {
        o = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(Z), d) : null;
    const Y = x(N), O = I(N), pe = hI(n, { query: c, sort: l, pinnedOnly: h, pins: Y, recents: O });
    A.value !== c && (A.value = c), B.value = l, _.textContent = h ? "★ Pinned only" : "☆ Pinned only", _.setAttribute("aria-pressed", String(h));
    const se = [];
    if (M.slot > 0 && se.push(so("← My player", () => e.open(0), "quiet")), !pe.length) se.push(gn("p", "No album matches that.", "ppp-mute"));
    else {
      const Ce = gn("ul", "", "ppp-shelf-list");
      for (const $ of pe.slice(0, p)) {
        const D = gn("li", "", $.slot === M.slot ? "now" : ""), ce = Y.has($.slot), ge = so(ce ? "★" : "☆", () => {
          const Qe = new Set(Y);
          ce ? Qe.delete($.slot) : Qe.add($.slot), e.store.set(m(N), JSON.stringify([...Qe])), e.changed();
        }, "tiny");
        ge.setAttribute("aria-label", ce ? `Unpin ${$.player.title}` : `Pin ${$.player.title}`);
        const Le = [$.player.subtitle, `${yr($.player).length} ${yr($.player).length === 1 ? "song" : "songs"}`, $.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Te = $.slot === M.slot, St = so(Te ? "Playing" : "Select", () => {
          e.store.set(y(N), JSON.stringify(pI({ ...O, [$.slot]: e.now() }))), e.open($.slot);
        }, Te ? "tiny ppp-pick" : "tiny primary ppp-pick");
        St.disabled = Te;
        const Be = yr($.player)[0], Pe = $.player.cover ?? (Be == null ? void 0 : Be.id), Ee = Pe ? sh(String(Pe)) : "", rn = gn("span", "", "ppp-shelf-art");
        if (Ee) {
          const Qe = document.createElement("img");
          Qe.src = Ee, Qe.alt = "", Qe.decoding = "async", rn.append(Qe);
        } else rn.textContent = "💿";
        const qt = gn("span", "", "ppp-shelf-txt");
        qt.append(gn("span", $.player.title, "t"), gn("span", Le, "ppp-mute")), D.append(ge, rn, qt, St), Ce.append(D);
      }
      se.push(Ce), pe.length > p && se.push(so(`Show more (${pe.length - p} left)`, () => {
        p += ro, e.changed();
      }, "quiet"));
    }
    return i && se.push(gn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), ae.replaceChildren(...se), d.firstChild !== W && d.replaceChildren(W, ae), d;
  }
  return { render: X, invalidate: U, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const M = I(t), N = [...n].filter((Y) => Y.player).sort((Y, O) => (M[O.slot] ?? 0) - (M[Y.slot] ?? 0) || O.slot - Y.slot)[0];
    return N ? { slot: N.slot, title: N.player.title } : null;
  } };
}
const ug = "http://www.w3.org/2000/svg", xI = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function ul(e = "", t = !1) {
  const n = document.createElementNS(ug, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of xI) {
    const i = document.createElementNS(ug, "path");
    i.setAttribute("fill-rule", "evenodd"), i.setAttribute("fill", t ? "currentColor" : r), i.setAttribute("d", s), n.append(i);
  }
  return n;
}
const ut = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, oi = (e, t, n, r = !1) => {
  const s = ut("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, tb = (e) => e.toLocaleString(), dg = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, SI = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function dl(e, t) {
  const n = ut("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const i = ut("li", s < t ? "is-done" : s === t ? "is-now" : "");
    i.append(ut("i", "", s < t ? "✓" : String(s + 1)), ut("span", "", r)), n.append(i);
  }), n;
}
function vI() {
  const e = ut("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(ut("span", "tier-disc__mark", "?")), e;
}
const AI = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], qr = {
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
}, EI = (e, t, n = !1) => n ? `${t || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${t || "Xtrata Music"} has covered ${e ? `${tb(e)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, kI = (e) => e ? `Your player holds ${tb(e)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", $I = (e) => e ? `You got a ${e.name} player` : qr.landed.title;
function II(e, t = !0) {
  const n = ut("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(ut("span", "tier-disc__mark", e.mark)), n;
}
function LI(e) {
  const t = document.documentElement;
  let n = !1;
  const r = () => {
    const s = ut("ul", "al-welcome-points");
    for (const [i, o, c] of AI) {
      const l = ut("li");
      l.title = o;
      const h = ut("em", "", c);
      h.setAttribute("aria-hidden", "true"), l.append(h, ut("b", "", i), ut("span", "", o)), s.append(l);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, i = !1) {
      var d;
      if (!s) {
        n && !i && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = s.mode, s.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const o = ut("header", "al-top"), c = ut("a", "al-brand");
      c.href = "/radio", c.append(ul("al-logo"), ut("span", "", "Xtrata "), ut("b", "", "Music")), o.append(c);
      const l = ut("div", "al-body al-body--welcome"), h = ut("div", "al-welcome"), p = s.mode;
      if (p === "checking")
        h.append(ut("p", "al-welcome-wait", qr.checking));
      else {
        const m = SI(p);
        if (m >= 0 && h.append(dl(p === "new" ? dg.fresh : dg.gift, m)), s.tier && (p === "landed" || p === "back" || p === "empty") ? h.append(II(s.tier)) : p === "gift" || p === "arriving" ? h.append(vI()) : p === "new" && h.append(ul("al-hero-mark")), h.append(ut("h1", "", p === "landed" ? $I(s.tier) : p === "back" && s.tier ? `Your ${s.tier.name} player` : qr[p].title)), h.append(ut("p", "", p === "gift" ? EI(s.plays, s.from, s.mystery) : p === "landed" ? kI(s.plays) : qr[p].body)), (p === "landed" || p === "gift") && h.append(r()), s.status.length) {
          const y = ut("div", "al-status");
          y.setAttribute("role", "status"), y.append(...s.status), h.append(y);
        }
        if (s.asking) h.append(ut("p", "al-hint al-hint--ask", qr.asking));
        else if (p === "gift" || p === "new" || p === "back") {
          const y = qr[p];
          s.canStart && h.append(oi("al-primary", y.primary, p === "back" ? s.unlock : s.start, s.busy), ut("p", "al-hint", y.hint)), s.canStart && h.append(oi("al-link", y.returning, s.returning, s.busy)), h.append(oi("al-link", y.full, s.full));
        } else if (p === "landed") {
          if (h.append(oi("al-primary", qr.landed.primary, s.full)), (d = s.albums) != null && d.length) {
            h.append(ut("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const y of s.albums) {
              const S = oi("al-album", "", y.run);
              if (y.cover) {
                const I = ut("img", "al-album__art");
                I.src = y.cover, I.alt = "", S.classList.add("al-album--art"), S.append(I);
              }
              const x = ut("span", "al-album__t");
              x.append(ut("b", "", y.title), ut("span", "", y.by)), S.append(x), h.append(S);
            }
          }
        } else p === "empty" && h.append(oi("al-primary", qr.empty.primary, s.restock), oi("al-link", qr.empty.full, s.full));
      }
      l.append(h), e.hidden = !1, e.replaceChildren(o, l);
    }
  };
}
const CI = 20, TI = ["Album", "Passkey", "Listen"], cn = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Ht = {
  grid: cn('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: cn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: cn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: cn('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: cn('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: cn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: cn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: cn('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: cn('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: cn('<path d="M6 9l6 6 6-6"/>', 18),
  right: cn('<path d="M9 6l6 6-6 6"/>', 16),
  close: cn('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: cn('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: cn('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: cn('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: cn('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: cn('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function ne(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, i] of Object.entries(t))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const pn = (e, ...t) => ne("button", { type: "button", ...e }, ...t), wc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, ra = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, BI = { music: "My music", device: "This device", gifts: "Albums (admin)" }, MI = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function fg(e, t, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const c = document.documentElement;
  function l(b) {
    var M, N, Y;
    if (!b || !Number.isSafeInteger(b)) return "";
    const k = (Y = (N = (M = t.radio()) == null ? void 0 : M.getState) == null ? void 0 : N.call(M)) == null ? void 0 : Y.albumCover;
    return k != null && k.url && Number(k.tokenId) === b ? k.url : Mc(b);
  }
  th(() => X());
  function h(b) {
    var M;
    i = b, b ? c.dataset.sheet = b : delete c.dataset.sheet;
    const k = document.querySelector(".side");
    if (b && b !== "more") {
      for (const O of MI[b]) {
        const pe = k == null ? void 0 : k.querySelector(O);
        pe && (pe.open = !0);
      }
      const N = document.getElementById("sheetTitle");
      N && (N.textContent = BI[b]);
      const Y = document.getElementById("sheetExtra");
      Y && Y.replaceChildren(...b === "music" ? [d()] : []), (M = k == null ? void 0 : k.scrollTo) == null || M.call(k, { top: 0 });
    }
    X();
  }
  const p = r ? null : document.getElementById("sheetClose");
  p && (p.onclick = () => h("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && i && c.dataset.view === "album" && h("");
  });
  const d = () => pn(
    { class: "al-row", onClick: () => {
      h(""), t.openPlayer();
    } },
    ne("span", { class: "al-row-i", html: Ht.radio }),
    ne("span", { class: "al-row-t" }, ne("b", {}, "Xtrata Radio"), ne("small", {}, "Every song on-chain · FM, liked, all")),
    ne("span", { class: "al-row-go", html: Ht.right })
  );
  let m = null, y = !1;
  const S = () => {
    var k;
    const b = t.radio();
    y || !(b != null && b.subscribe) || (y = !0, b.subscribe((M) => {
      m = M, (s == null ? void 0 : s.mode) === "open" && X();
    }), m = ((k = b.getState) == null ? void 0 : k.call(b)) ?? null);
  };
  r || setInterval(() => {
    var N, Y;
    if ((s == null ? void 0 : s.mode) !== "open" || !(m != null && m.playing)) return;
    const b = (Y = (N = t.radio()) == null ? void 0 : N.getPosition) == null ? void 0 : Y.call(N), k = e.querySelector(".al-bar > i"), M = e.querySelectorAll(".al-times span");
    !b || !k || (k.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", M.length === 2 && (M[0].textContent = wc(b.current || 0), M[1].textContent = b.duration ? wc(b.duration) : "–:––"));
  }, 500);
  let x = "", I = null;
  function H(b, k, M = {}) {
    const N = M.song || l(b.cover), O = [N ? ne("img", { src: N, alt: M.song ? "Song artwork" : `${b.title} cover` }) : ne("div", { class: "al-cover-fallback" }, ne("b", {}, b.title), b.subtitle ? ne("span", {}, b.subtitle) : null), M.paused ? ne("span", { class: "al-paused" }, ne("i", { html: Ht.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], pe = "al-cover" + (k ? "" : " al-cover--small") + (M.paused ? " is-paused" : "");
    return M.flip ? (O.push(ne("span", { class: "al-flip", "aria-hidden": "true", html: Ht.flip })), pn({ class: pe + " is-flippable", "aria-label": M.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: M.flip }, ...O)) : ne("div", { class: pe }, ...O);
  }
  function U(b) {
    return b.plays === null || b.plays === void 0 ? ne("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? ne("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : ne("span", { class: "al-chip" + (b.plays <= CI ? " al-chip--low" : "") }, `${ra(b.plays, "play", "plays")} left`);
  }
  function A(b) {
    const k = b.player, M = k.tracks.filter((Y) => !Y.hidden), N = [];
    return b.step !== void 0 && N.push(dl(TI, b.step)), b.mode === "arrive" && b.from && N.push(ne("p", { class: "al-from" }, ne("span", { html: Ht.gift }), ne("span", {}, ne("b", {}, b.from), " sent you an album"))), N.push(H(k, !0)), N.push(ne(
      "div",
      { class: "al-intro" },
      ne("h1", {}, k.title),
      k.subtitle ? ne("p", { class: "al-artist" }, k.subtitle) : null,
      M.length ? ne("p", { class: "al-songline" }, M.map((Y) => Y.title || `#${Y.id}`).join(" · ")) : null,
      ne("span", { class: "al-chip" }, [ra(M.length, "song", "songs"), b.offered ? ra(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && N.push(ne("div", { class: "al-status", role: "status" }, ...b.status)), N.push(ne("div", { class: "al-grow" })), b.asking ? N.push(ne("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && N.push(pn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, ne("span", { html: Ht.playSmall }), b.primary.label)), b.hint && !b.asking && N.push(ne("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && N.push(pn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), N;
  }
  function B(b, k) {
    const { songs: M, current: N, started: Y, own: O, out: pe, waiting: se } = k, Ce = b.player, $ = t.radio(), D = [];
    D.push(ne("div", { class: "al-listhead" }, ne("span", {}, ne("b", {}, Ce.title), ` · ${ra(M.length, "song", "songs")}`), U(b)));
    const ce = l(Ce.cover), ge = "album:" + Ce.cover;
    ce && !nn.has(ge) && (nn.set(ge, ce), rh(ce).then((Te) => {
      Te !== ce && (nn.set(ge, Te), X());
    }));
    const Le = ce ? nn.get(ge) || ce : "";
    return D.push(ne("ol", { class: "al-tracks" }, ...M.map((Te, St) => {
      const Be = String(Te.id) === N, Pe = sh(String(Te.id), Be && Y ? O : void 0);
      return ne("li", {}, pn(
        { class: "al-track" + (Be ? " is-on" : ""), "aria-label": `Play ${Te.title || "#" + Te.id}`, "aria-current": Be ? "true" : void 0, disabled: pe || se, onClick: () => {
          var Ee;
          return (Ee = $ == null ? void 0 : $.playToken) == null ? void 0 : Ee.call($, Te.id);
        } },
        ne(
          "span",
          { class: "al-th" + (Pe ? "" : " is-blank") },
          Pe ? ne("img", { src: Pe, alt: "", decoding: "async" }) : Le ? ne("img", { src: Le, alt: "", decoding: "async" }) : null,
          Pe ? null : ne("span", { class: "al-n" }, String(St + 1)),
          Be ? ne("span", { class: "al-eq", html: Ht.eq }) : null
        ),
        ne("span", { class: "al-tt" }, Te.title || `#${Te.id}`, Te.explicit ? ne("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), D;
  }
  function _(b) {
    var Pe;
    const k = b.player, M = k.tracks.filter((Ee) => !Ee.hidden), N = t.radio(), Y = m == null ? void 0 : m.nowPlaying, O = Y && k.tracks.some((Ee) => String(Ee.id) === String(Y.tokenId)) ? String(Y.tokenId) : null, pe = O ? k.tracks.find((Ee) => String(Ee.id) === O) : null, se = b.plays === 0 && !b.playsComing, Ce = !!b.playsComing && !b.plays, $ = !!(m != null && m.playing) && !!O, D = m == null ? void 0 : m.heart, ce = O ? (Pe = N == null ? void 0 : N.getPosition) == null ? void 0 : Pe.call(N) : null;
    O && ($ || ((ce == null ? void 0 : ce.current) ?? 0) > 0.5) && (x = k.id);
    const ge = !!O && x === k.id;
    I && I !== O && (I = null);
    const Le = ge ? String((Y == null ? void 0 : Y.cover) || "") : "", Te = !!Le && I === O, Be = [H(k, !se, { song: Te ? "" : Le, paused: ge && !$, flip: Le ? () => {
      I = I === O ? null : O, X();
    } : void 0, flipped: Te })];
    if (Be.push(ne(
      "div",
      { class: "al-now" },
      ne(
        "div",
        { class: "al-now-t" },
        ne("div", { class: "al-song" }, pe ? pe.title || (Y == null ? void 0 : Y.title) || `#${pe.id}` : k.title),
        ne("div", { class: "al-artist" }, pe ? pe.artist || (Y == null ? void 0 : Y.artist) || k.subtitle : k.subtitle || "Press play")
      ),
      O ? pn({ class: "al-icon" + (D != null && D.liked ? " is-on" : ""), "aria-label": D != null && D.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(D != null && D.liked)), disabled: !!(D != null && D.pending) || !!(D != null && D.locked) || Ce, onClick: () => {
        var Ee;
        return (Ee = N == null ? void 0 : N.toggleLike) == null ? void 0 : Ee.call(N);
      }, html: D != null && D.liked ? Ht.heartOn : Ht.heart }) : null
    )), se)
      Be.push(ne(
        "div",
        { class: "al-out" },
        ne("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        ne("p", { class: "al-out-t" }, "You've played this album out"),
        ne("p", { class: "al-out-s" }, "Add plays to keep listening."),
        W(b, !0)
      ));
    else {
      const Ee = ce != null && ce.duration ? Math.min(100, ce.current / ce.duration * 100) : 0;
      Be.push(ne(
        "div",
        { class: "al-prog" },
        ne("div", { class: "al-bar" }, ne("i", { style: `width: ${Ee}%` })),
        ne("div", { class: "al-times" }, ne("span", {}, wc((ce == null ? void 0 : ce.current) || 0)), ne("span", {}, ce != null && ce.duration ? wc(ce.duration) : "–:––"))
      ));
    }
    return Be.push(ne(
      "div",
      { class: "al-ctl" + (se || Ce ? " is-off" : "") },
      pn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: se || Ce, onClick: () => {
        var Ee;
        return (Ee = N == null ? void 0 : N.prev) == null ? void 0 : Ee.call(N);
      }, html: Ht.prev }),
      pn({ class: "al-play", "aria-label": $ ? "Pause" : "Play", disabled: se || Ce, onClick: () => {
        var Ee;
        return (Ee = N == null ? void 0 : N.playPause) == null ? void 0 : Ee.call(N);
      }, html: $ ? Ht.pause : Ht.play }),
      pn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: se || Ce, onClick: () => {
        var Ee;
        return (Ee = N == null ? void 0 : N.next) == null ? void 0 : Ee.call(N);
      }, html: Ht.next })
    )), b.status.length && Be.push(ne("div", { class: "al-status", role: "status" }, ...b.status)), Be.push(...B(b, { songs: M, current: O, started: ge, own: Le, out: se, waiting: Ce })), Be.push(ne("div", { class: "al-grow" })), Be.push(pn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => h(i === "more" ? "" : "more") },
      ne("span", {}, "More ", ne("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      ne("span", { html: Ht.down })
    )), Be;
  }
  function W(b, k) {
    const M = ne("div", { class: "al-topups" + (k ? " al-topups--primary" : "") }), N = k ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const Y of N) {
      const O = b.myPlays !== void 0 && b.myPlays >= Y && !b.playsComing && !b.busy;
      M.append(pn({ class: "al-topup", disabled: !O, onClick: () => t.topUp(Y) }, k ? `Add ${Y.toLocaleString()} plays` : `+${Y.toLocaleString()}`));
    }
    return k && M.append(pn({ class: "al-link", onClick: () => h("more") }, "Other amounts")), M;
  }
  function ae(b) {
    const k = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), M = ne(
      "div",
      { class: "al-card" },
      ne("div", { class: "al-card-h" }, ne("b", {}, `Add plays to ${b.player.title}`), ne("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      W(b, !1),
      ne("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : k ? `Moved from My player · ${ra(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !k && !b.playsComing && b.myPlays !== void 0 ? pn({ class: "al-link", onClick: () => {
        h(""), t.openPlayer();
      } }, "Open My player") : null
    ), N = (O, pe, se, Ce) => pn(
      { class: "al-row", onClick: Ce },
      ne("span", { class: "al-row-i", html: O }),
      ne("span", { class: "al-row-t" }, ne("b", {}, pe), ne("small", {}, se)),
      ne("span", { class: "al-row-go", html: Ht.right })
    ), Y = ne(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      N(Ht.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, X();
      }),
      o ? ne("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return ne(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      ne("div", { class: "al-sheet-h" }, ne("b", {}, "More"), pn({ class: "al-icon", "aria-label": "Close", onClick: () => h(""), html: Ht.close })),
      b.mode === "open" ? M : null,
      ne(
        "div",
        { class: "al-rows" },
        N(Ht.grid, "My music", "Your albums and the radio", () => h("music")),
        N(Ht.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          h(""), t.openPlayer();
        }),
        b.canMake ? N(Ht.gift, "Albums (admin)", "Make an album and fund copies", () => h("gifts")) : null,
        N(Ht.device, "This device", "Backup, history, Stacks wallet, returns", () => h("device")),
        Y
      )
    );
  }
  function Z(b) {
    var se, Ce;
    const k = b.player, M = m == null ? void 0 : m.nowPlaying, N = M && k.tracks.some(($) => String($.id) === String(M.tokenId)) ? String(M.tokenId) : null, Y = !!(m != null && m.playing) && !!N, O = N ? (Ce = (se = t.radio()) == null ? void 0 : se.getPosition) == null ? void 0 : Ce.call(se) : null;
    N && (Y || ((O == null ? void 0 : O.current) ?? 0) > 0.5) && (x = k.id);
    const pe = !!N && x === k.id;
    return B(b, {
      songs: k.tracks.filter(($) => !$.hidden),
      current: N,
      started: pe,
      own: pe ? String((M == null ? void 0 : M.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function X() {
    const b = s;
    if (r) {
      if (!b || b.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete c.dataset.albumlist;
        return;
      }
      S(), e.hidden = !1, c.dataset.albumlist = "1", e.replaceChildren(...Z(b));
      return;
    }
    if (!b) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    S(), e.hidden = !1;
    const k = ne(
      "header",
      { class: "al-top" },
      ne("a", { class: "al-brand", href: "/radio" }, ul("al-logo"), "Xtrata ", ne("b", {}, "Music")),
      b.mode === "open" ? pn({ class: "al-icon", "aria-label": "My music", onClick: () => h("music"), html: Ht.grid }) : null
    ), M = ne("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? _(b) : A(b));
    e.replaceChildren(k, M, ...i === "more" ? [ne("div", { class: "al-scrim", onClick: () => h("") }), ae(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, X();
        return;
      }
      const k = !!s;
      s = b, !b && (k || i) && (i = "", delete c.dataset.sheet), b ? c.dataset.view = "album" : delete c.dataset.view, b != null && b.asking ? c.dataset.asking = "1" : delete c.dataset.asking, X();
    },
    sheet: () => i,
    setSheet: h
  };
}
const NI = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", _I = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${NI}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, PI = (e) => _I("source|audio", e), UI = 48 * 1024 * 1024;
function HI(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function OI(e) {
  const t = e.fetch ?? ((...p) => fetch(...p));
  let n = null, r = null, s = "", i = null;
  const o = (p) => {
    n = p, e.changed();
  }, c = () => {
    var p;
    if (i == null || i.abort(), i = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (p = r.load) == null || p.call(r);
      } catch {
      }
    s.startsWith("blob:") && URL.revokeObjectURL(s), s = "";
  };
  async function l(p, d, m = 0) {
    var A, B, _;
    const y = "/inscription/" + p, S = await t(y, { signal: d }), x = (S.headers.get("content-type") || "").toLowerCase();
    if (!S.ok)
      throw await ((A = S.body) == null ? void 0 : A.cancel()), new Error("not found");
    if (x.startsWith("audio/"))
      return await ((B = S.body) == null ? void 0 : B.cancel()), y;
    if (!x.includes("text/html"))
      throw await ((_ = S.body) == null ? void 0 : _.cancel()), new Error("not a song");
    const I = await S.text();
    if (I.length > UI) throw new Error("too large");
    const H = I.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (H) return HI(H[1].replace(/&amp;/g, "&"));
    const U = m === 0 ? PI(I) : null;
    if (U) return l(Number(U), d, 1);
    throw new Error("no audio");
  }
  async function h(p) {
    var m;
    c();
    const d = i = new AbortController();
    o({ id: p, state: "loading" });
    try {
      const y = await l(p, d.signal);
      if (d.signal.aborted) {
        y.startsWith("blob:") && URL.revokeObjectURL(y);
        return;
      }
      if (s = y, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (c(), o(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const S = n.id;
          c(), o({ id: S, state: "error" });
        }
      })), (m = e.quiet) == null || m.call(e), r.src = y, await r.play(), d.signal.aborted) return;
      o({ id: p, state: "playing" });
    } catch {
      if (d.signal.aborted) return;
      c(), o({ id: p, state: "error" });
    }
  }
  return {
    state: (p) => (n == null ? void 0 : n.id) === p ? n.state : "idle",
    toggle: (p) => {
      (n == null ? void 0 : n.id) === p && n.state !== "error" ? (c(), o(null)) : h(p);
    },
    stop: () => {
      n && (c(), o(null));
    }
  };
}
const DI = ["Earned", "Claim", "Yours"], FI = ["Connect", "Link", "Name"], yt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, un = (e, t, n, r = !1) => {
  const s = yt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, hg = (e, t, n, r = !1) => {
  const s = un("al-album", "", n, r), i = yt("span", "al-album__t");
  return i.append(yt("b", "", e), yt("span", "", t)), s.append(i), s;
}, jI = (e) => `No. ${String(e).padStart(4, "0")}`, RI = (e) => e.main ? e.linked ? 2 : 1 : 0;
function zI(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const i = (o) => {
    if (s && r === o.art) return s;
    r = o.art, s = yt("div", "aw-art");
    const c = document.createElement("iframe");
    return c.src = o.art, c.title = `${o.tier.name} record. Drag to turn it.`, c.setAttribute("sandbox", "allow-scripts"), s.append(c), s;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(o, c = !1) {
      if (!o) {
        n && !c && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", s = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = o.screen, o.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const l = yt("header", "al-top"), h = yt("a", "al-brand");
      h.href = "/radio", h.append(ul("al-logo"), yt("span", "", "Xtrata "), yt("b", "", "Music")), l.append(h);
      const p = yt("div", "al-welcome"), d = o.screen, m = o.tier.name, y = typeof o.name == "string" && o.name ? o.name : null;
      if (p.append(d === "have" ? dl(FI, RI(o)) : dl(DI, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const U = yt("div", "tier-disc tier-disc--mid");
        U.dataset.tier = o.tier.id, U.append(yt("span", "tier-disc__mark", o.tier.mark)), p.append(U);
      } else if (d !== "have" && d !== "get") {
        const U = i(o);
        U.classList.toggle("aw-art--small", d === "name"), p.append(U);
      }
      const S = d === "ready" ? `Your ${m} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      p.append(yt("h1", "", S));
      const x = (U, A = "") => p.append(yt("p", A, U)), I = [];
      if (d === "ready")
        x(`You’ve paid artists for ${o.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), I.push(un("al-primary", `Claim my ${m} record`, () => o.go("name"), o.busy), yt("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), un("al-link", "Later", o.later));
      else if (d === "name")
        y ? (x(`Your record will carry ${y} beside your player’s address.`), I.push(un("al-primary", `Claim with ${y}`, () => o.claim("auto"), o.busy), un("al-link", "Use my address only", () => o.claim("none"), o.busy))) : o.name === null ? (x("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), I.push(
          hg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => o.go("have"), o.busy),
          hg("I want to get a name", "Where to get one, and how to put it on your player", () => o.go("get"), o.busy),
          un("al-primary", "Claim with my address", () => o.claim("none"), o.busy)
        )) : (x("Could not check for a .btc name just now.", "ppp-warn"), I.push(un("al-primary", "Check again", o.refresh, o.busy), un("al-link", "Claim with my address only", () => o.claim("none"), o.busy))), I.push(yt("p", "al-hint", "What is on the plaque cannot be changed afterwards."));
      else if (d === "have")
        o.main ? !o.linked && o.canLink ? (x(`Link this player to ${o.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), I.push(un("al-primary", "Link my player", o.link, o.busy))) : o.linked ? y ? (x(`Found it: ${y}. It goes on your plaque beside your player’s address.`), I.push(un("al-primary", `Claim with ${y}`, () => o.claim("auto"), o.busy))) : (x(o.name === null ? `${o.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", o.name === null ? "" : "ppp-warn"), I.push(un("al-primary", "Check again", o.refresh, o.busy))) : (x(`Linking is not open for ${o.main} right now. You can send a name to your player instead.`, "ppp-warn"), I.push(un("al-primary", "Show me how", () => o.go("get"), o.busy))) : (x("Connect the Leather or Xverse wallet that holds your .btc name."), I.push(un("al-primary", "Connect my wallet", o.connect, o.busy))), I.push(un("al-link", "Back", () => o.go("name")));
      else if (d === "get") {
        const U = yt("ol", "aw-steps"), A = yt("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const B = yt("a", "", "Open BNS One ↗");
        B.href = "https://bns.one", B.target = "_blank", B.rel = "noopener", A.append(B);
        const _ = yt("li");
        _.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", yt("span", "ppp-addr-full", o.player), o.copyAddress());
        const W = yt("li", "", "Check again, and your name shows on the preview before you claim.");
        U.append(A, _, W), p.append(U), I.push(un("al-primary", "I have my name: check again", () => {
          o.refresh(), o.go("name");
        }, o.busy), un("al-link", "Back", () => o.go("name")));
      } else if (d === "making") {
        if (x("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), o.claimLink) {
          const U = yt("p", "al-hint"), A = yt("a", "", "See the claim on-chain ↗");
          A.href = o.claimLink, A.target = "_blank", A.rel = "noopener", U.append(A), p.append(U);
        }
      } else if (x(`${m} record ${jI(o.number)}${o.inscription !== void 0 ? ` · Xtrata inscription #${o.inscription}` : ""}. In your player now, and yours for good.`), I.push(un("al-primary", "See it in my player", o.done)), o.inscription !== void 0) {
        const U = yt("a", "al-link", "Open it full screen ↗");
        U.href = `/i/${o.inscription}`, U.target = "_blank", U.rel = "noopener", I.push(U);
      }
      if (o.status.length) {
        const U = yt("div", "al-status");
        U.setAttribute("role", "status"), U.append(...o.status), p.append(U);
      }
      o.asking ? p.append(yt("p", "al-hint al-hint--ask", "Continue in the box below.")) : p.append(...I);
      const H = yt("div", "al-body al-body--welcome");
      H.append(p), e.hidden = !1, e.replaceChildren(l, H);
    }
  };
}
const nb = "xtrata.xyz/music/release", GI = "Release music on Xtrata Music; no spending permission", KI = (e) => ({
  domain: br({ name: xt(nb), version: xt("1"), "chain-id": En(1) }),
  message: br({ purpose: xt(GI), artist: xt(e.artist), release: xt(e.hash), issued: En(e.issued) })
}), VI = "Set the price of my release on Xtrata Music; no spending permission", XI = 100000n, YI = 1000000000n, qI = (e) => e === 0n || e >= XI && e <= YI, WI = (e) => ({
  domain: br({ name: xt(nb), version: xt("1"), "chain-id": En(1) }),
  message: br({ purpose: xt(VI), artist: xt(e.artist), release: xt(e.release), price: En(BigInt(e.price)), issued: En(e.issued) })
}), io = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, ZI = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, he = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, ln = (e, t, n = "") => {
  const r = he("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, mc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), pg = (e) => {
  const t = yr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function bc(e, t, n = "", r = "") {
  const s = he("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), i = e || n;
  if (i) {
    const o = document.createElement("img");
    o.src = i, o.alt = "", o.decoding = "async", s.append(o);
  }
  return e || s.append(he("span", t)), s;
}
const Tu = (e) => !!e && Od(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function JI(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, s = "", i = "";
  const o = (() => {
    try {
      const j = new URLSearchParams(location.search).get("release");
      return Od(j) ? j : null;
    } catch {
      return null;
    }
  })();
  let c = o ? { id: o } : null;
  const l = (j) => "xtrata.radio.releases.shelf.v1:" + j;
  let h = null, p = !1, d = -1 / 0;
  const m = (j, P, te) => {
    const Q = Array.isArray(P) ? P.filter(Tu).map((ie) => ({ ...ie, hidden: !!ie.hidden })) : [];
    h = { for: j, albums: Q, fresh: te }, te && e.store.set(l(j), JSON.stringify(Q));
  }, y = (j) => {
    try {
      m(j, JSON.parse(e.store.get(l(j)) || "[]"), !1);
    } catch {
      m(j, [], !1);
    }
  }, S = () => {
    const j = e.player().address;
    return j && (h == null ? void 0 : h.for) === j ? h.albums : [];
  };
  async function x(j, P = "") {
    const te = e.player();
    if (!te.address || !te.unlocked)
      return i = "Unlock your player first.", e.changed(), !1;
    if (p) return !1;
    p = !0, i = "", e.changed();
    try {
      const Q = await e.signShelf(j, P), ie = await e.json("/radio/release/shelf", mc(Q));
      return m(te.address, ie == null ? void 0 : ie.albums, !0), H(ie == null ? void 0 : ie.pay) ? A(te.address, ie.pay) : j === "add" && A(te.address, null, P), !0;
    } catch (Q) {
      return j !== "list" && (i = Q.message || "That did not work. Try again."), !1;
    } finally {
      p = !1, e.changed();
    }
  }
  const I = (j) => "xtrata.radio.releases.orders.v1:" + j, H = (j) => !!j && /^[0-9a-f]{16}$/.test(j.order) && Od(j.release) && typeof j.to == "string" && /^\d{1,12}$/.test(j.amount) && typeof j.memo == "string", U = (j) => {
    if (!j) return {};
    try {
      const P = JSON.parse(e.store.get(I(j)) || "{}");
      return P && typeof P == "object" ? Object.fromEntries(Object.entries(P).filter(([, te]) => H(te))) : {};
    } catch {
      return {};
    }
  };
  function A(j, P, te = (P == null ? void 0 : P.release) ?? "") {
    var ie;
    const Q = U(j);
    P ? Q[P.release] = { ...((ie = Q[P.release]) == null ? void 0 : ie.order) === P.order ? Q[P.release] : {}, ...P } : delete Q[te], e.store.set(I(j), Object.keys(Q).length ? JSON.stringify(Q) : null);
  }
  const B = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Map();
  async function W(j, P, te = !1) {
    var Q;
    if (!B.has(P.order)) {
      B.add(P.order), _.set(P.order, e.now()), te && (i = "", e.changed());
      try {
        const ie = await e.json("/radio/release/paid", mc({ order: P.order, ...P.txid ? { txid: P.txid } : {} }));
        (ie == null ? void 0 : ie.status) === "paid" ? (A(j, null, P.release), ((Q = c == null ? void 0 : c.view) == null ? void 0 : Q.id) === P.release && (c.view = { ...c.view, added: c.view.added + 1 }), i = "", B.delete(P.order), (h == null ? void 0 : h.for) === j && (h.fresh = !1), e.player().unlocked && await x("list")) : (H(ie) && A(j, { ...P, ...ie }), te && (ie == null ? void 0 : ie.status) === "pending" && (i = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (ie) {
        /did not go through|does not pay this order/.test(ie.message || "") && A(j, { ...P, txid: void 0, status: "pending" }), (te || P.txid) && (i = ie.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        B.delete(P.order), e.changed();
      }
    }
  }
  async function ae(j, P, te) {
    if (!s) {
      s = "Approve the payment in your wallet…", i = "", e.changed();
      try {
        const Q = await e.pay(j, te.to, BigInt(te.amount), te.memo), ie = { ...te, txid: Q || void 0, status: "confirming" };
        A(P, ie), s = "", W(P, ie);
      } catch (Q) {
        i = /cancel/i.test(Q.message || "") ? "Payment cancelled. Nothing was sent." : Q.message || "Not paid. Nothing was sent.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  async function Z(j) {
    const P = e.player();
    if (!await x("add", j.id) || !P.address) return;
    const te = U(P.address)[j.id], Q = e.main();
    te && Q && await ae(Q, P.address, te);
  }
  function X() {
    if (r || (r = !0, e.json("/radio/release/config").then((P) => {
      t = (P == null ? void 0 : P.enabled) === !0, n = { copies: t && (P == null ? void 0 : P.copies) === !0, sales: t && (P == null ? void 0 : P.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (c && !c.view && !c.error) {
      const P = c;
      P.error = "", e.json("/radio/release/view?id=" + P.id).then(
        (te) => {
          Tu(te) ? (P.view = te, delete P.error) : P.error = "This release could not be read.";
        },
        (te) => {
          P.error = te.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const j = e.player();
    if (j.address) {
      (h == null ? void 0 : h.for) !== j.address && y(j.address), j.unlocked && !(h != null && h.fresh) && !p && e.now() - d > 6e4 && (d = e.now(), x("list"));
      for (const P of Object.values(U(j.address)))
        if ((P.txid || P.status === "confirming") && !B.has(P.order) && e.now() - (_.get(P.order) ?? -1 / 0) > 2e4) {
          const te = j.address;
          W(te, P).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const b = () => t ? S().filter((j) => !j.hidden) : [];
  function k(j, P) {
    const te = he("ol", "", "ppp-rel-songs");
    return j.forEach((Q, ie) => {
      const De = he("li");
      De.append(bc(e.art.song(Q.id, !0) || "", String(ie + 1), P), he("span", Q.title)), te.append(De);
    }), te;
  }
  function M() {
    if (!t || !c || c.dismissed) return [];
    if (!c.view) return c.error ? [he("p", `♫ ${c.error}`, "ppp-warn")] : [he("p", "♫ Opening this release…", "ppp-mute")];
    const j = c.view, P = he("div", "", "ppp-release-in"), te = he("p", "", "ppp-release-in__h"), Q = BigInt(/^\d{1,12}$/.test(j.price ?? "") ? j.price : "0");
    te.append(he("b", j.title), he("span", `${j.subtitle || e.who(j.artist)} · ${pg(j)}${Q > 0n ? ` · ${io(Q)} STX` : ""}`));
    const ie = yr(j), De = e.art.cover(j.cover) || (j.cover ? "" : ie[0] && e.art.song(ie[0].id, !0) || ""), ke = he("div", "", "ppp-rel-top");
    ke.append(bc(De, "💿", "", "is-cover"), te), P.append(ke, k(ie.map((me) => ({ id: me.id, title: me.title || `#${me.id}` })), e.art.cover(j.cover))), P.append(he("p", `Released by ${e.who(j.artist)}. ${j.added === 1 ? "1 player has" : `${j.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const Me = e.player(), nt = S().find((me) => me.id === j.id), ye = he("div", "", "ppp-award__row");
    if (nt)
      P.append(he("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), ye.append(ln("Play it", () => e.open(j), "primary"));
    else if (!Me.address) P.append(he("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!Me.unlocked) P.append(he("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (Q > 0n) {
      const me = U(Me.address)[j.id], Ke = e.main(), Ze = `${io((me == null ? void 0 : me.amount) ?? Q)} STX`;
      if (me != null && me.txid || (me == null ? void 0 : me.status) === "confirming") {
        P.append(he("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const qe = ln("Check now", () => void W(Me.address, me, !0));
        qe.disabled = B.has(me.order), ye.append(qe);
      } else if (P.append(he("p", `This album costs ${Ze}. You pay ${e.who(j.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !me) P.append(he("p", "Buying is paused right now.", "ppp-warn"));
      else if (me) {
        if (Ke) {
          const Vt = ln(`Pay ${Ze} from my wallet`, () => void ae(Ke, Me.address, me), "primary");
          Vt.disabled = !!s, ye.append(Vt);
        } else P.append(he("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const qe = he("div", "", "ppp-rel-pay"), jt = (Vt, pt, fn) => {
          const $n = he("p");
          return $n.append(he("span", Vt), he("code", pt), Jn(`order-${fn}:${me.order}`, "Copy", () => pt, "tiny", e.changed)), $n;
        };
        qe.append(jt("Send", io(me.amount) + " STX", "amount"), jt("To", me.to, "to"), jt("Memo", me.memo, "memo")), P.append(qe, he("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const Wt = ln("I have paid: check", () => void W(Me.address, me, !0));
        Wt.disabled = B.has(me.order), ye.append(Wt);
      } else {
        const qe = ln(`Buy · ${Ze}`, () => void Z(j), "primary");
        qe.disabled = p || !!s, ye.append(qe);
      }
    } else {
      P.append(he("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const me = ln("Add to my player", () => {
        x("add", j.id).then((Ke) => {
          Ke && (c != null && c.view) && (c.view = { ...c.view, added: c.view.added + 1 });
        });
      }, "primary");
      me.disabled = p, ye.append(me);
    }
    return ye.append(ln("Not now", () => {
      c && (c.dismissed = !0), e.changed();
    }, "quiet")), P.append(ye), s && P.append(he("p", s, "ppp-cyan")), i && P.append(he("p", i, "ppp-warn")), [P];
  }
  let N = !1;
  function Y() {
    const j = t ? S() : [];
    if (!j.length) return null;
    const P = he("details", "", "ppp-release-manage");
    P.open = N, P.ontoggle = () => {
      N = P.open;
    };
    const te = j.filter((ie) => ie.hidden).length;
    P.append(he("summary", `Albums I added (${j.length}${te ? `, ${te} hidden` : ""})`));
    const Q = e.player().unlocked;
    Q || P.append(he("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const ie of j) {
      const De = he("div", "", "ppp-release-row" + (ie.hidden ? " is-hidden" : "")), ke = he("span", "", "ppp-release-row__t");
      ke.append(he("b", ie.title), he("span", `${ie.subtitle || e.who(ie.artist)}${ie.hidden ? " · hidden" : ""}`));
      const Me = ln(ie.hidden ? "Show" : "Hide", () => void x(ie.hidden ? "show" : "hide", ie.id), "tiny"), nt = ln("Remove", () => void x("remove", ie.id), "tiny");
      Me.disabled = nt.disabled = !Q || p, De.append(ke, Me, nt), P.append(De);
    }
    return P.append(he("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), i && !c && P.append(he("p", i, "ppp-warn")), P;
  }
  let O = null, pe = [], se = null;
  const Ce = he("input");
  Ce.maxLength = 60, Ce.placeholder = "Title of the single, EP or album", Ce.setAttribute("aria-label", "Release title");
  const $ = he("input");
  $.maxLength = 80, $.placeholder = "Artist name shown under the title", $.setAttribute("aria-label", "Artist name");
  const D = he("input");
  D.inputMode = "numeric", D.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", D.setAttribute("aria-label", "Cover inscription number");
  const ce = he("input");
  ce.inputMode = "decimal", ce.placeholder = "Price in STX, e.g. 2 (0 makes it free)", ce.setAttribute("aria-label", "Price in STX");
  let ge = null;
  const Le = (j, P, te = "") => {
    ge = (ge == null ? void 0 : ge.id) === j && ge.what === P ? null : { id: j, what: P }, (ge == null ? void 0 : ge.what) === "price" && (ce.value = te), i = "", e.changed();
  };
  async function Te(j, P) {
    if (s) return;
    const te = ZI(ce.value);
    if (te === null || !qI(te)) {
      i = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", i = "", e.changed();
    try {
      const Q = { artist: j, release: P.id, price: te.toString(), issued: e.now() }, ie = await e.sign(j, WI(Q));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", mc({ request: Q, signature: ie })), i = te > 0n ? `Price set ✓ “${P.title}” now costs ${io(te)} STX, paid straight to this wallet.` : `“${P.title}” is free again ✓`, ge = null, Pe(j, !0);
    } catch (Q) {
      i = Q.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const St = (j) => `${location.origin}${location.pathname}?release=${j}`;
  function Be(j) {
    O = { for: j, loading: !0 }, pe = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(j)).then(
      (P) => {
        const te = Array.isArray(P == null ? void 0 : P.songs) ? P.songs.filter((Q) => Number.isSafeInteger(Q == null ? void 0 : Q.id) && typeof Q.title == "string") : null;
        O = te ? { for: j, songs: te, more: !!P.more } : { for: j, error: "Your songs could not be read right now." };
      },
      (P) => {
        O = { for: j, error: P.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Pe(j, P = !1) {
    !P && (se == null ? void 0 : se.for) === j && e.now() - se.at < 6e4 || (se = { for: j, list: (se == null ? void 0 : se.for) === j ? se.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(j)).then((te) => {
      Array.isArray(te == null ? void 0 : te.releases) && (se = { for: j, list: te.releases.filter(Tu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Ee(j) {
    if (!s) {
      s = "Checking your release…", i = "", e.changed();
      try {
        const P = D.value.trim().replace(/^#/, ""), te = Qm({ title: Ce.value.trim(), subtitle: $.value.trim(), tracks: [...pe], cover: P ? Number(P) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const Q = { artist: j, hash: eb(te), issued: e.now() }, ie = await e.sign(j, KI(Q));
        s = "Releasing…", e.changed();
        const De = await e.json("/radio/release/create", mc({ definition: te, request: Q, signature: ie }));
        i = `${De.existing ? "Already released" : "Released"} ✓ “${De.title}”. Its link is below.`, pe = [], Ce.value = "", D.value = "", e.audition.stop(), Pe(j, !0);
      } catch (P) {
        i = P.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const rn = () => {
    queueMicrotask(() => e.audition.stop());
  }, qt = /* @__PURE__ */ new Set();
  function Qe(j) {
    const P = pe.map((qe) => j.find((jt) => jt.id === qe)).filter((qe) => !!qe), te = D.value.trim().replace(/^#/, ""), Q = /^\d{1,9}$/.test(te) ? Number(te) : null, ie = e.art.cover(Q), De = P[0] ? e.art.song(P[0].id, !0) : null, ke = he("div", "", "ppp-release-preview");
    ke.append(he("p", "How it will look", "ppp-featured__h"));
    const Me = he("p", "", "ppp-release-in__h"), nt = he("b", Ce.value.trim() || "Untitled"), ye = he("span", `${$.value.trim() || e.who(e.main())} · ${P.length} ${P.length === 1 ? "song" : "songs"}`);
    Me.append(nt, ye);
    const me = he("div", "", "ppp-rel-top");
    me.append(bc(Q ? ie : De || "", "💿", "", "is-cover"), Me), ke.append(me, k(P.map((qe) => ({ id: qe.id, title: qe.title })), ie));
    const Ke = P.filter((qe) => e.art.song(qe.id, !0) === null).length, Ze = [];
    Q && !ie && Ze.push(`Looking for an image in #${Q}… If none appears, that inscription is not a picture.`), Ke && Ze.push(`Finding artwork for ${Ke} ${Ke === 1 ? "song" : "songs"}…`), !Ke && P.some((qe) => e.art.song(qe.id, !1) === "") && Ze.push(`A numbered square is a song with no artwork of its own${ie ? ": it shows the cover, dimmed" : ""}.`);
    for (const qe of Ze) ke.append(he("p", qe, "ppp-mute"));
    return Ce.oninput = () => {
      nt.textContent = Ce.value.trim() || "Untitled";
    }, $.oninput = () => {
      ye.textContent = `${$.value.trim() || e.who(e.main())} · ${P.length} ${P.length === 1 ? "song" : "songs"}`;
    }, D.onchange = () => e.changed(), ke;
  }
  function Bt() {
    var te;
    const j = e.main();
    if (!t || !j)
      return O && (O = null, pe = [], rn()), null;
    const P = [he("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (O && O.for !== j && (O = null, pe = [], qt.clear(), rn()), !O) P.push(ln("Show the songs in my wallet", () => Be(j), "primary"));
    else if (O.loading) P.push(he("p", "Reading your wallet…", "ppp-cyan"));
    else if (O.error) P.push(he("p", O.error, "ppp-warn"), ln("Try again", () => Be(j)));
    else if (!O.songs.length) P.push(he("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      P.push(he("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const Q = he("div", "", "ppp-release-songs");
      for (const ke of O.songs) {
        const Me = pe.indexOf(ke.id), nt = he("div", "", "ppp-release-song" + (Me >= 0 ? " is-on" : "")), ye = e.audition.state(ke.id);
        ye !== "idle" && qt.add(ke.id);
        const me = ln(ye === "playing" ? "❚❚" : ye === "loading" ? "…" : "▶", () => e.audition.toggle(ke.id), "ppp-release-hear" + (ye === "playing" ? " is-on" : ""));
        me.setAttribute("aria-label", ye === "playing" ? `Stop ${ke.title}` : `Listen to ${ke.title}`), me.title = ye === "error" ? "This song could not be played just now" : ye === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const Ke = e.art.song(ke.id, Me >= 0 || qt.has(ke.id)), Ze = ln("", () => {
          pe = Me >= 0 ? pe.filter((qe) => qe !== ke.id) : [...pe, ke.id], e.changed();
        }, "ppp-release-pick");
        Ze.setAttribute("aria-pressed", String(Me >= 0)), Ze.append(he("i", Me >= 0 ? String(Me + 1) : "+"), he("b", ke.title), he("span", ye === "error" ? "could not play" : `${ke.artist ? ke.artist + " · " : ""}#${ke.id}`, ye === "error" ? "ppp-warn" : "")), nt.append(me, bc(Ke || "", Ke === "" ? "♪" : "", ""), Ze), Q.append(nt);
      }
      P.push(Q), O.more && P.push(he("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !$.value && pe.length && ($.value = ((te = O.songs.find((ke) => ke.id === pe[0])) == null ? void 0 : te.artist) || "");
      const ie = pe.length === 0 ? "release" : pe.length === 1 ? "single" : pe.length <= 6 ? "EP" : "album", De = ln(pe.length ? `Sign and release this ${ie} · ${pe.length} ${pe.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Ee(j), "primary");
      De.disabled = !pe.length || !!s, P.push(Ce, $, D), pe.length && P.push(Qe(O.songs)), P.push(De);
    }
    if (s && P.push(he("p", s, "ppp-cyan")), i && !c && P.push(he("p", i, /✓/.test(i) ? "ppp-ok" : "ppp-warn")), Pe(j), (se == null ? void 0 : se.for) === j && se.list.length) {
      P.push(he("p", "Your releases", "ppp-featured__h"));
      for (const Q of se.list) {
        const ie = he("div", "", "ppp-release-row"), De = he("span", "", "ppp-release-row__t"), ke = BigInt(/^\d{1,12}$/.test(Q.price ?? "") ? Q.price : "0"), Me = ke > 0n ? ` · ${io(ke)} STX · ${(Q.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (De.append(he("b", Q.title), he("span", `${pg(Q)} · added by ${Q.added.toLocaleString()} ${Q.added === 1 ? "player" : "players"}${Me}`)), ie.append(De, Jn("release-link:" + Q.id, "Copy link", () => St(Q.id), "tiny", e.changed)), n.sales) {
          const ye = ln("Price", () => Le(Q.id, "price", ke > 0n ? io(ke) : ""), "tiny");
          ye.setAttribute("aria-expanded", String((ge == null ? void 0 : ge.id) === Q.id && ge.what === "price")), ie.append(ye);
        }
        if (n.copies && e.copies) {
          const ye = ln("Send copies", () => Le(Q.id, "copies"), "tiny");
          ye.setAttribute("aria-expanded", String((ge == null ? void 0 : ge.id) === Q.id && ge.what === "copies")), ie.append(ye);
        }
        if (P.push(ie), (ge == null ? void 0 : ge.id) !== Q.id) continue;
        const nt = he("div", "", "ppp-release-way");
        if (ge.what === "price" && n.sales) {
          const ye = ln("Sign this price", () => void Te(j, Q), "primary");
          ye.disabled = !!s, nt.append(
            he("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            ce,
            ye
          );
        } else ge.what === "copies" && n.copies && e.copies && nt.append(...e.copies(j, { id: Q.id, title: Q.title }));
        nt.childNodes.length && P.push(nt);
      }
    }
    return P;
  }
  return { sync: X, albums: b, banner: M, manage: Y, fold: Bt, wantsArt: () => t === !0 && (!!(c != null && c.view) && !c.dismissed || !!(O != null && O.songs) && !!e.main()), enabled: () => t === !0 };
}
const QI = [
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
function eL(e) {
  for (const [t, n] of QI) if (n.test(e)) return t;
  return null;
}
const rb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), sb = (e) => /Android/.test(e);
function tL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : rb(t) ? "x-safari-" + n.href : sb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const nL = (e) => rb(e) ? "Safari" : sb(e) ? "Chrome" : "your browser", oo = "Xtrata Music Wallet", rL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function gg(e, t = (n) => n) {
  var i, o, c;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((i = e.gate) == null ? void 0 : i.passkeyOnly) || e.linked || ((o = e.others) == null ? void 0 : o.length) ? [{ action: null, label: oo, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((l) => !!l))];
  for (const l of s) {
    const h = e.standIn === l && rL.has(e.step);
    r.push({
      action: "linked",
      main: l,
      label: `${oo} · ${t(l)}`,
      detail: h ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(l)}.`
    });
  }
  if ((c = e.gate) != null && c.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: oo, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: oo, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: oo, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: oo, detail: "Open on this device." });
    }
  return r;
}
const Bu = "xtrata.radio.novice", ib = "xtrata.radio.novice.previewed.v1", yg = 6 * 6e4;
function sL(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(Bu, r), n = r;
    else {
      if (r === "0")
        return t.set(Bu, null), { on: !1, preview: !1 };
      n = t.get(Bu);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const iL = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, wg = (e) => iL.test(e ?? ""), oL = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, aL = {
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
}, cL = (e, t) => aL[e] ?? t;
function lL(e, t) {
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
const uL = "Make your player once, with Face ID or your fingerprint, and the music starts.", dL = "Checking your player…", jd = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function ob(e) {
  try {
    const t = JSON.parse(e.get(ib) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function fL(e, t) {
  const n = ob(e).filter((r) => r !== t);
  n.push(t), e.set(ib, JSON.stringify(n.slice(-50)));
}
function Mu(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...jd(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : jd();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > yg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > yg ? { ...e, phase: "done" } : e;
  }
}
const xc = (e) => e.phase === "open" || e.phase === "playing";
function hL(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const pL = [100, 250, 500, 1e3], gL = (e, t = xr) => BigInt(e) * wn(t);
function yL(e, t = xr, n = 0n) {
  const r = Zr - e - n;
  return r > 0n ? Number(r / wn(t)) : 0;
}
function wL(e, t = xr, n = 0n) {
  const r = e === void 0 ? 0 : yL(e, t, n);
  return pL.map((s) => ({ plays: s, stx: gL(s, t), fits: e !== void 0 && s <= r }));
}
const mL = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, bL = (e) => mL[e.unit](e.amount), Mt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Nc = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function xL(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${Nc(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${Nc(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${Nc(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function SL(e) {
  let t = null, n = 0, r = "stx";
  const s = (o) => {
    var l;
    if (o.some((h) => h.plays === n && h.fits)) return;
    const c = o.filter((h) => h.fits);
    n = ((l = c.find((h) => {
      var p;
      return h.plays === ((p = o[1]) == null ? void 0 : p.plays);
    }) ?? c.at(-1)) == null ? void 0 : l.plays) ?? 0;
  };
  function i() {
    var y;
    if (!t) return;
    const o = e.input();
    if (!o) {
      t.close();
      return;
    }
    const c = wL(o.balance, o.fee, o.incoming);
    s(c);
    const l = hL(o.switches);
    (y = l.find((S) => S.id === r)) != null && y.on || (r = "stx");
    const h = [], p = Mt("h2", "ppp-connect__title", "Add plays");
    p.id = "ppp-restock-title", h.push(p), h.push(Mt("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${Nc(o.playsLeft, "play", "plays")} left.`));
    const d = xL(o.done);
    if (d && h.push(Mt("p", "ppp-restock__done", d)), o.arriving)
      h.push(Mt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      h.push(Mt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!c.some((S) => S.fits))
      h.push(Mt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const S = Mt("div", "ppp-restock__packs");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How many plays");
      for (const H of c) {
        const U = Mt("button", "ppp-restock__pack" + (H.plays === n ? " is-on" : ""));
        U.type = "button", U.disabled = !H.fits, U.setAttribute("aria-pressed", String(H.plays === n)), U.append(Mt("b", "", H.plays.toLocaleString()), Mt("span", "", "plays")), U.onclick = () => {
          n = H.plays, i();
        }, S.append(U);
      }
      h.push(S);
      const x = Mt("div", "ppp-restock__ways");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How to pay");
      for (const H of l) {
        const U = Mt("button", "ppp-restock__way" + (H.id === r ? " is-on" : ""));
        U.type = "button", U.disabled = !H.on, U.setAttribute("aria-pressed", String(H.id === r)), U.append(Mt("b", "", H.label), Mt("span", "", H.on ? H.blurb : "Soon")), U.onclick = () => {
          r = H.id, i();
        }, x.append(U);
      }
      h.push(x);
      const I = c.find((H) => H.plays === n);
      if (I && r === "stx") {
        const H = Mt("div", "ppp-restock__pay"), U = bL({ unit: "microSTX", amount: I.stx }), A = Mt("p", "ppp-restock__amount");
        A.append("Send ", Mt("b", "", U), " to your player:"), H.append(A, Mt("p", "ppp-addr-full ppp-restock__addr", o.address));
        const B = Mt("div", "ppp-restock__row");
        B.append(e.copyButton("restock-address", "Copy address", () => o.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => dr(I.stx), "")), H.append(B), H.append(Mt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${o.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), h.push(H);
      }
    }
    h.push(Mt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const m = Mt("button", "quiet ppp-connect__cancel", "Close");
    m.type = "button", m.onclick = () => t == null ? void 0 : t.close(), h.push(m), t.replaceChildren(...h);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Mt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
      const o = t;
      o.addEventListener("close", () => {
        o.remove(), t === o && (t = null);
      }), o.addEventListener("click", (c) => {
        c.target === o && o.close();
      }), document.body.appendChild(o), i(), typeof o.showModal == "function" ? o.showModal() : o.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: i,
    close() {
      t == null || t.close();
    }
  };
}
const Qr = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), vL = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function AL(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const i = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(i) || i < 0 || n.has(i)) continue;
    n.add(i);
    const o = t(i, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: i, title: vL(o.title) ? `#${i}` : o.title.trim(), artist: (o.artist || "").trim() });
  }
  return r.sort((s, i) => s.id - i.id);
}
function EL(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = Qr(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function kL(e, t, n = "", r = 60) {
  const s = Qr(t).split(/\s+/).filter(Boolean), i = Qr(n);
  if (!s.length && !i) return { songs: [], total: 0 };
  const o = [];
  for (const c of e) {
    const l = Qr(c.artist), h = Qr(c.title), p = String(c.id);
    if (i && l !== i) continue;
    let d = 0, m = !0;
    for (const y of s) {
      const S = y.replace(/^#/, "");
      if (h.includes(y)) d += h.startsWith(y) ? 0 : 1;
      else if (/^\d+$/.test(S) && p === S) d += 0;
      else if (l.includes(y)) d += 2;
      else if (/^\d+$/.test(S) && p.startsWith(S)) d += 3;
      else {
        m = !1;
        break;
      }
    }
    m && o.push({ s: c, rank: d });
  }
  return o.sort((c, l) => c.rank - l.rank || c.s.id - l.s.id), { songs: o.slice(0, r).map((c) => c.s), total: o.length };
}
const qn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, mg = 12;
function $L(e, t) {
  let n = null, r = "idle", s = "", i = "", o = !1;
  const c = qn("input", "find-q");
  c.type = "search", c.placeholder = "Search songs, artists or #", c.setAttribute("aria-label", "Search all music"), c.autocomplete = "off";
  const l = qn("div", "hint"), h = qn("div", "find-artists"), p = qn("ol", "likesList find-list");
  l.setAttribute("role", "status");
  const d = qn("div", "likesTools");
  d.append(c), e.replaceChildren(d, l, h, p), c.oninput = () => {
    s = c.value, y();
  };
  function m() {
    r === "loading" || r === "ready" || (r = "loading", y(), t.load().then((S) => {
      n = S, r = "ready", y();
    }, () => {
      r = "failed", y();
    }));
  }
  function y() {
    const S = t.locked();
    if (c.disabled = S, S) {
      l.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", h.replaceChildren(), p.replaceChildren();
      return;
    }
    if (r === "idle") {
      l.textContent = "";
      return;
    }
    if (r === "loading") {
      l.textContent = "Loading the catalogue…";
      return;
    }
    if (r === "failed" || !n) {
      l.textContent = "The catalogue is unavailable right now. ";
      const B = qn("button", "", "Try again");
      B.type = "button", B.onclick = () => {
        r = "idle", m();
      }, l.append(B), h.replaceChildren(), p.replaceChildren();
      return;
    }
    const x = EL(n), I = o ? x : x.slice(0, mg), H = (B, _, W, ae = "") => {
      const Z = qn("button", "find-chip" + (_ ? " is-on" : ""), B);
      return Z.type = "button", Z.setAttribute("aria-pressed", String(_)), ae && (Z.title = ae), Z.onclick = W, Z;
    };
    h.replaceChildren(
      ...I.map((B) => H(`${B.name} · ${B.songs}`, Qr(B.name) === Qr(i), () => {
        i = Qr(B.name) === Qr(i) ? "" : B.name, y();
      }, `Show ${B.name}’s ${B.songs === 1 ? "song" : `${B.songs} songs`}`)),
      ...x.length > mg ? [H(o ? "Fewer artists" : `All ${x.length} artists`, !1, () => {
        o = !o, y();
      })] : []
    );
    const U = kL(n, s, i), A = t.current();
    p.replaceChildren(...U.songs.map((B) => {
      var ae, Z;
      const _ = qn("li", "lrow" + (B.id === A ? " now" : "")), W = qn("button", "lt", B.title);
      if (W.type = "button", W.title = `Play “${B.title}”${B.artist ? ` by ${B.artist}` : ""}`, W.onclick = () => t.play(B.id), (ae = t.explicit) != null && ae.call(t, B.id)) {
        const X = qn("span", "exp", "E");
        X.title = "Explicit lyrics: only plays when you choose it", W.append(" ", X);
      }
      if ((Z = t.liked) != null && Z.call(t, B.id)) {
        const X = qn("span", "find-liked", "♥");
        X.title = "You like this song", X.setAttribute("role", "img"), X.setAttribute("aria-label", "Liked"), _.append(W, X);
      } else _.append(W);
      return _.append(qn("span", "find-by", `${B.artist ? B.artist + " · " : ""}#${B.id}`)), _;
    })), l.textContent = !s.trim() && !i ? `${n.length.toLocaleString()} songs by ${x.length.toLocaleString()} artists. Search, or pick an artist.` : U.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : U.total > U.songs.length ? `Showing ${U.songs.length} of ${U.total.toLocaleString()}. Type more to narrow it down.` : `${U.total} ${U.total === 1 ? "song" : "songs"}${i ? ` by ${i}` : ""}. Tap one to play it.`;
  }
  return { load: m, refresh: y };
}
const ha = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Sc = (e) => typeof e == "string" && ha.some((t) => t.id === e), vc = (e) => ha.find((t) => t.id === e), IL = (e) => ha.find((t) => e >= t.min) ?? ha[ha.length - 1];
function LL(e, t = xr) {
  return IL(e <= zt ? 0 : Number((e - zt) / wn(t)));
}
const bg = (e, t, n) => nf(of(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), xg = document.getElementById("ppp");
xg && CL(xg);
function CL(e) {
  var qi;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = _b(), s = (a) => e.querySelector(a), i = s(".ppp-frame");
  let o = null;
  const c = async (a, u) => {
    const g = await fetch(a, { cache: "no-store", ...u, signal: AbortSignal.timeout(15e3) }), f = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${g.status}).`);
    return f;
  }, l = u5({
    now: Date.now,
    main: () => {
      const a = r.load();
      return a.isConnected && a.network === "mainnet" ? a.address : void 0;
    },
    config: (a) => c("/radio/listening-wallet/config?main=" + encodeURIComponent(a || "")),
    links: async (a) => (await c("/radio/listening-wallet/link?main=" + encodeURIComponent(a))).links ?? [],
    mainOf: async (a) => {
      var g;
      const u = (await c("/radio/listening-wallet/link?listening=" + encodeURIComponent(a))).links;
      return ((g = u == null ? void 0 : u.find((f) => f.listening === a)) == null ? void 0 : g.main) ?? null;
    },
    saveLink: async (a) => {
      await c("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(a) });
    },
    bridge: async (a) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${a}; publickey-credentials-create ${a}`), o.referrerPolicy = "no-referrer";
      const u = new Promise((L, G) => {
        o.addEventListener("load", () => L(), { once: !0 }), setTimeout(() => G(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = a + "/", i.replaceChildren(o), await u;
      const g = new kb({ walletOrigin: a, frame: o, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), C = (L, G) => f.has(L) ? g.request(L, G) : Promise.race([
        g.request(L, G),
        new Promise((z, J) => setTimeout(() => J(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await C("listening.status"), { request: C };
    },
    chain: {
      verify: z6,
      balance: K6,
      account: G6,
      owner: V6,
      broadcast: X6,
      transaction: Y6,
      confirmedNonce: async (a) => {
        const u = await Vs(`/v2/accounts/${a}?proof=0`);
        if (!Number.isSafeInteger(u == null ? void 0 : u.nonce) || u.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(u.nonce);
      }
    },
    signWithMain: (a, u) => bu({ ...u, network: "mainnet", stxAddress: a }),
    deposit: (a, u, g) => new Promise((f, C) => U0({
      recipient: u,
      amount: g.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: a,
      network: new Nu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (L) => f(L.txId || ""),
      onCancel: () => C(new Error("Deposit cancelled. Nothing was sent.")),
      onError: C
    })),
    validate: q6,
    tabLock: (a) => new Promise((u) => {
      const g = navigator.locks;
      if (!(g != null && g.request)) {
        u(!0);
        return;
      }
      g.request("xtrata-ppp:" + a, { ifAvailable: !0 }, async (f) => {
        u(!!f), f && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, u) => {
        try {
          localStorage.setItem(a, u);
        } catch {
        }
      }
    },
    changed: () => at(l.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (a) => {
      var u, g;
      return p.funder(a, () => t5(a, Vs), !!((g = (u = l.snapshot().gate) == null ? void 0 : u.gifts) != null && g.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (a) => {
      const u = await c("/radio/gift/for?wallet=" + encodeURIComponent(a)), g = u == null ? void 0 : u.gift;
      if (!g) return null;
      if (typeof g.returnTo != "string" || typeof g.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: g.returnTo, from: typeof g.from == "string" ? g.from : null, source: String(g.source ?? ""), amount: String(g.amount ?? "0"), treasury: g.treasury, state: g.state === "sending" ? "sending" : "arrived", player: g.player ?? null };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (a) => {
      const u = await c("/radio/awards/status?address=" + encodeURIComponent(a));
      if (typeof (u == null ? void 0 : u.state) != "string") throw new Error("Unreadable award status.");
      return u;
    },
    awardName: async (a) => {
      const u = await c("/radio/awards/name?address=" + encodeURIComponent(a));
      if ((u == null ? void 0 : u.name) !== null && typeof (u == null ? void 0 : u.name) != "string") throw new Error("Unreadable name.");
      return u.name;
    },
    awardNote: async (a, u) => {
      const g = await c("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: a, name: u }) });
      if (typeof (g == null ? void 0 : g.record) != "string" || typeof (g == null ? void 0 : g.signature) != "string" || !Number.isSafeInteger(g == null ? void 0 : g.cls) || !Number.isSafeInteger(g == null ? void 0 : g.number) || !Number.isSafeInteger(g == null ? void 0 : g.plays)) throw new Error("Unreadable award note.");
      return { cls: g.cls, number: g.number, plays: g.plays, record: g.record, signature: g.signature, name: typeof g.name == "string" ? g.name : null };
    },
    history: (a, u) => s5(a, (g) => Vs(g), u),
    likesChanged: () => {
      var a, u;
      (u = (a = window.XtrataRadio) == null ? void 0 : a.refreshLikes) == null || u.call(a);
    },
    likeState: async (a, u) => {
      const g = await c("/radio/chain-likes?" + new URLSearchParams({ wallet: a, ids: String(u) })), f = Array.isArray(g == null ? void 0 : g.rows) ? g.rows.find((C) => (C == null ? void 0 : C.id) === u) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((C) => typeof C == "string") : f.liked ? [a] : [] };
    },
    likeSent: (a, u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: a, liked: u } })),
    nameOf: (a) => et(a) ?? void 0,
    likeConfirmed: (a, u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: a, liked: u } })),
    likeFailed: (a) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: a } }))
  }), h = (a, u, g, f, C, L) => new Promise((G, z) => U0({
    recipient: f,
    amount: C.toString(),
    memo: L,
    stxAddress: g,
    network: new Nu(),
    appDetails: { name: a, icon: "/favicon.svg" },
    onFinish: (J) => G(J.txId || ""),
    onCancel: () => z(new Error(u)),
    onError: z
  })), p = lI({
    json: c,
    main: () => {
      const a = r.load();
      return a.isConnected && a.network === "mainnet" ? a.address : void 0;
    },
    pay: (a, u, g, f) => h("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", a, u, g, f),
    sign: (a, u) => bu({ ...u, network: "mainnet", stxAddress: a }),
    giftSent: (a, u) => l.giftSent(a, u),
    claiming: (a) => l.giftClaiming(a),
    album: { bind: (a) => l.bindAlbum(a), arrived: async (a, u, g, f) => {
      d.invalidate(), await l.albumArriving(a, u, g, f);
    } },
    who: (a) => Ne(a),
    changed: () => at(l.snapshot()),
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, u) => {
        try {
          u === null ? localStorage.removeItem(a) : localStorage.setItem(a, u);
        } catch {
        }
      }
    },
    now: Date.now
  }), d = bI({
    json: c,
    open: (a) => {
      l.openAlbum(a);
    },
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, u) => {
        try {
          u === null ? localStorage.removeItem(a) : localStorage.setItem(a, u);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => at(l.snapshot())
  }), m = {
    get: (a) => {
      try {
        return localStorage.getItem(a);
      } catch {
        return null;
      }
    },
    set: (a, u) => {
      try {
        u === null ? localStorage.removeItem(a) : localStorage.setItem(a, u);
      } catch {
      }
    }
  }, y = sL(location.search, m);
  y.on && (document.documentElement.dataset.novice = y.preview ? "preview" : "1");
  const S = (a) => y.on && a.solo, x = y.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), I = x ? document.getElementById("album") : null, H = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (a) => void l.topUpAlbum(a),
    openPlayer: () => void l.openAlbum(0)
  }, U = I ? fg(I, H) : null, A = JI({
    json: c,
    main: () => {
      const a = r.load();
      return a.isConnected && a.network === "mainnet" ? a.address : void 0;
    },
    sign: (a, u) => bu({ ...u, network: "mainnet", stxAddress: a }),
    signShelf: (a, u) => l.signShelf(a, u),
    pay: (a, u, g, f) => h("Xtrata Music · album", "Payment cancelled. Nothing was sent.", a, u, g, f),
    copies: (a, u) => {
      var g;
      return p.copies(a, u, ((g = l.snapshot().gate) == null ? void 0 : g.radioUrl) ?? null);
    },
    player: () => {
      const a = l.snapshot(), u = a.slot === 0 ? a.listening : a.root;
      return { address: u, unlocked: !!u && ["ready", "fund", "over", "link"].includes(a.step) };
    },
    open: (a) => nt(a, !0),
    who: (a) => Ne(a),
    art: { song: (a, u) => u && sh(String(a)) || lg(String(a)), cover: (a) => Mc(a) },
    audition: OI({
      changed: () => at(l.snapshot()),
      quiet: () => {
        var u;
        const a = window.XtrataRadio;
        try {
          (u = a == null ? void 0 : a.getState) != null && u.call(a).playing && a.playPause();
        } catch {
        }
      }
    }),
    changed: () => at(l.snapshot()),
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, u) => {
        try {
          u === null ? localStorage.removeItem(a) : localStorage.setItem(a, u);
        } catch {
        }
      }
    },
    now: () => Date.now()
  }), B = () => {
    const a = new Set(te.map((u) => u.id));
    return [...te, ...A.albums().filter((u) => !a.has(u.id))];
  }, _ = I ? zI(I) : null, W = "xtrata.radio.award.later.v1";
  let ae = "ready", Z = !1, X = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(W) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), b = !1;
  const k = "xtrata.radio.tier.v1";
  let M = (() => {
    const a = m.get(k);
    return Sc(a) ? vc(a) : null;
  })();
  const N = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function Y(a) {
    var C;
    if (a.listening && a.slot === 0 && ["fund", "ready", "over"].includes(a.step) && !(a.gift && a.gift.drop === void 0)) {
      let L = null;
      try {
        L = a.gift && !a.gift.player && a.gift.drop === "players" ? LL(BigInt(a.gift.amount)) : null;
      } catch {
        L = null;
      }
      ((C = a.award) == null ? void 0 : C.state) === "claimed" && a.award.holds === !1 && (L = null), ((L == null ? void 0 : L.id) ?? null) !== ((M == null ? void 0 : M.id) ?? null) && (M = L, m.set(k, L ? L.id : null));
    }
    const u = document.documentElement;
    M ? u.dataset.tier = M.id : delete u.dataset.tier;
    const g = document.querySelector("#ppp .ppp-head h3");
    if (!g) return;
    let f = g.querySelector(".ppp-tier");
    if (!M) {
      f == null || f.remove();
      return;
    }
    f || (f = v("span", "", "ppp-tier"), g.append(f)), f.dataset.tier = M.id, f.textContent = `${M.mark} ${M.name.toUpperCase()} PLAYER`, f.title = `A ${M.name} player from the Xtrata Music giveaway`;
  }
  const O = y.on && I ? LI(I) : null, pe = Date.now();
  let se = !1, Ce = null, $ = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const D = () => {
    $ = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    at(l.snapshot());
  }, ce = (a, u) => {
    var C;
    if (!O || u || $) return null;
    if (!a.gate || a.step === "loading" || (se = !0), !se) return Date.now() - pe < 1e4 ? "checking" : null;
    if (!S(a)) return null;
    if (a.step === "intro" || a.step === "unsupported") return p.incomingStarter() ? "gift" : "new";
    if (a.step === "locked") return "back";
    const f = a.slot === 0 && !((C = a.gift) != null && C.player) && !a.entries.some((L) => L.kind === "play");
    return a.step === "fund" && f ? a.depositPending ? "arriving" : "empty" : a.step === "ready" && f && (Ce === "arriving" || Ce === "landed") ? "landed" : a.step === "loading" && Ce !== "checking" ? Ce : null;
  };
  let ge = !1;
  function Le(a, u, g = [], f) {
    if (!O) return;
    const C = f !== void 0 ? f : ce(a, u);
    if (Ce = C, delete document.documentElement.dataset.noviceBoot, !C) {
      O.render(null, u);
      return;
    }
    const L = [...g];
    C === "arriving" && a.arrival && L.push(jr(a.arrival)), a.step === "unsupported" ? L.push(v("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : a.error && L.push(v("p", a.error, "ppp-warn"));
    const G = C === "gift" ? p.incomingStarter() : null;
    G && !ge && a.step === "intro" && !a.busy && !a.armed && !a.error && !ot && (ge = !0, l.create({ quick: !0 })), O.render({
      mode: C,
      status: L,
      asking: !!a.busy || a.armed,
      busy: !!a.busy,
      canStart: (a.step === "intro" || a.step === "locked") && !ot,
      plays: G ? G.plays : C === "landed" ? a.playsLeft : null,
      from: (G == null ? void 0 : G.from) ?? null,
      tier: M,
      mystery: N,
      albums: C === "landed" ? te.map((z) => ({ title: z.title, by: z.subtitle, cover: Mc(z.cover), run: () => {
        D(), nt(z, !0);
      } })) : [],
      start: () => void l.create({ quick: !!p.incomingStarter() }),
      unlock: () => void l.unlock(),
      returning: () => void l.unlock(!0),
      restock: () => Be(),
      full: () => {
        var we, be, Se;
        const z = window.XtrataRadio, J = C === "landed" && !((be = (we = z == null ? void 0 : z.getState) == null ? void 0 : we.call(z)) != null && be.playing);
        D(), J && ((Se = z == null ? void 0 : z.playPause) == null || Se.call(z));
      }
    });
  }
  O && setTimeout(() => {
    se || at(l.snapshot());
  }, 10100), th(() => {
    (O != null && O.showing() || document.documentElement.dataset.asking || A.wantsArt()) && at(l.snapshot());
  });
  const St = SL({
    input: () => {
      var C, L, G, z;
      const a = l.snapshot();
      if (!["fund", "ready", "over"].includes(a.step)) return null;
      const u = a.slot === 0 ? { address: a.listening, balance: a.balance } : { address: a.root, balance: (C = a.likeFunds) == null ? void 0 : C.balance };
      if (!u.address) return null;
      const g = a.slot === 0 ? a.entries : [], f = g.filter((J) => J.kind === "play" && J.status === "confirmed");
      return {
        playsLeft: u.balance === void 0 ? null : F(u.balance),
        balance: u.balance,
        incoming: 0n,
        fee: BigInt(((L = a.gate) == null ? void 0 : L.limits.playFee) ?? "300"),
        address: u.address,
        switches: ((G = a.gate) == null ? void 0 : G.restock) ?? {},
        backedUp: a.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((J) => J.recipient)).size, likes: g.filter((J) => J.kind === "like" && J.status === "confirmed" && J.liked).length } : null,
        arriving: a.slot === 0 ? a.depositPending : !!((z = a.likeFunds) != null && z.pending)
      };
    },
    copyButton: (a, u, g, f) => Jn(a, u, g, f, () => {
      at(l.snapshot());
    })
  }), Be = () => {
    if (!l.snapshot().unproven) {
      St.open();
      return;
    }
    l.prove().then((a) => {
      a && St.open();
    });
  }, Pe = document.getElementById("albumList"), Ee = Pe ? fg(Pe, H, { list: !0 }) : null, rn = "xtrata.radio.album.last.v1", qt = () => {
    try {
      const a = JSON.parse(localStorage.getItem(rn) || "null");
      return a && typeof a.root == "string" && Number.isSafeInteger(a.slot) && a.slot > 0 && a.player && Array.isArray(a.player.tracks) ? a : null;
    } catch {
      return null;
    }
  };
  let Qe = "";
  const Bt = (a) => {
    const u = JSON.stringify(a);
    if (u !== Qe) {
      Qe = u;
      try {
        localStorage.setItem(rn, u);
      } catch {
      }
    }
  };
  let ct = null;
  window.XtrataRadioLikeHandler = (a) => {
    var g;
    if (!a || !Number.isSafeInteger(a.song) || a.song < 0) return !1;
    (g = l.snapshot().likeFunds) != null && g.album && (fn = !0), hn();
    const u = ss(a.song, { title: a.title, artist: a.artist });
    return l.heart({ song: a.song, title: u.title || void 0, artist: u.artist || void 0, likedBy: Array.isArray(a.likedBy) ? a.likedBy : void 0 });
  };
  let j;
  window.XtrataRadioListeningIdentity = () => {
    const a = l.snapshot();
    return a.solo && a.step !== "off" && a.step !== "elsewhere" ? a.listening : void 0;
  };
  const P = (a) => {
    var g, f;
    const u = window.XtrataRadioListeningIdentity();
    u !== j && (j = u, (f = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || f.call(g));
  };
  let te = [], Q = 0, ie = !1, De = null;
  const ke = (a) => {
    var u, g;
    ie || !((g = (u = a.gate) == null ? void 0 : u.gifts) != null && g.enabled) || Date.now() - Q < 6e4 || (Q = Date.now(), c("/radio/gift/featured").then((f) => {
      te = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((C) => C && typeof C.id == "string" && typeof C.title == "string" && Array.isArray(C.tracks) && C.tracks.length > 0).slice(0, 6), ie = !0, te.length && at(l.snapshot());
    }).catch(() => {
    }));
  }, Me = (a) => {
    var u;
    return De && a.slot === 0 && !((u = a.gift) != null && u.player) && ["ready", "fund", "loading"].includes(a.step) ? De : null;
  }, nt = (a, u = !1) => {
    var f, C;
    De = a, at(l.snapshot());
    const g = a && u ? yr(a)[0] : null;
    g && ((C = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || C.call(f, g.id));
  };
  let ye = jd(), me = null;
  const Ke = (a) => {
    const u = y.preview && !ot && a.step === "intro" ? p.incomingAlbum() : null;
    return u ? (ye = Mu(ye, { kind: "offer", album: u.player.id, already: ob(m).includes(u.player.id) }), xc(ye) ? u.player : null) : (ye = Mu(ye, { kind: "withdraw" }), null);
  }, Ze = (a) => {
    const u = ye.phase;
    ye = Mu(ye, a), ye.phase !== u && (ye.album && (ye.phase === "playing" || ye.phase === "done") && fL(m, ye.album), at(l.snapshot()));
  };
  setInterval(() => {
    ye.phase === "playing" && Ze({ kind: "tick", at: Date.now() });
  }, 5e3);
  let qe = "", jt, Wt = !1, Vt = !1;
  const pt = (a, u) => {
    var Se, ve, w, T, R, de, At, It;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const f = u.depositPending && a.step === "fund" && ((Se = a.giftStop) == null ? void 0 : Se.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : a.giftStop, C = me, L = f ? S(a) ? cL(f.reason, f.text) : f.text : null, G = C ? null : L ?? (t && (!((ve = a.gate) != null && ve.here) || a.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    G && G !== jt && (g.setGiftStop(G), jt = G);
    const z = a.step === "off" || a.step === "elsewhere" ? null : ((w = a.gift) == null ? void 0 : w.player) ?? C ?? Me(a) ?? null, J = z ? z.id + ":" + z.cover + ":" + z.tracks.map((sn) => sn.id).join(",") : "";
    J !== qe && (g.setGiftPlayer(z ? { id: z.id, title: z.title, subtitle: z.subtitle, tracks: yr(z).map((sn) => sn.id), hidden: ((T = oI(z)) == null ? void 0 : T.id) ?? null, cover: z.cover } : null), qe = J), G !== jt && (g.setGiftStop(G), jt = G);
    const we = (f == null ? void 0 : f.reason) === "arriving";
    we !== Vt && ((R = g.setGiftWait) == null || R.call(g, we), Vt = we);
    const be = !!z && (!!C || !!((de = a.albumLock) != null && de.locked));
    be !== Wt && ((At = g.setGiftLock) == null || At.call(g, be), Wt = be), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(a.step) && ((It = g.forgetWallets) == null || It.call(g));
  };
  let fn = !1;
  const $n = /* @__PURE__ */ new Map(), Sr = (a) => {
    if (!(a.step === "fund" && !a.depositPending && !!a.gift && !!a.listening && a.balance === 0n && !a.entries.some((f) => f.kind === "play") && (a.brandNew || a.createdHere))) return null;
    let g = $n.get(a.listening);
    return g === void 0 && (g = Date.now(), $n.set(a.listening, g)), Date.now() - g < ol ? g : null;
  }, Or = (a) => a.step === "fund" && !a.depositPending && !!a.gift && a.balance === 0n && !a.entries.some((u) => u.kind === "play") && !!a.listening && $n.has(a.listening), E = (a) => a ? a.slice(0, 6) + "…" + a.slice(-4) : "", F = (a) => {
    const u = l.snapshot().playCost || 350n;
    return a > zt ? Number((a - zt) / u) : 0;
  }, K = (a) => (Number(a) / 1e6).toFixed(a < 1000n ? 6 : 4), V = (a) => {
    const u = Math.round((Date.now() - a) / 6e4);
    return u < 1 ? "now" : u < 60 ? `${u}m` : u < 1440 ? `${Math.round(u / 60)}h` : `${Math.round(u / 1440)}d`;
  }, ee = (a) => `https://explorer.hiro.so/txid/${a}?chain=mainnet`, v = (a, u = "", g = "") => {
    const f = document.createElement(a);
    return u && (f.textContent = u), g && (f.className = g), f;
  }, oe = (a, u, g = "") => {
    const f = v("button", a, g);
    return f.type = "button", f.onclick = u, f;
  }, Ue = (a, u) => {
    const g = v("a", a);
    return g.href = u, g.target = "_blank", g.rel = "noopener", g;
  };
  let Ve = null, gt = location.hash === "#give";
  gt && history.replaceState(null, "", location.pathname + location.search);
  let He = !1;
  const Pt = X5((a) => V5({ address: a, network: "mainnet" }), () => at(l.snapshot())), et = (a) => Pt.get(a), ot = eL(navigator.userAgent), Ut = (a, u) => {
    const g = navigator.userAgent, f = nL(g), C = `${location.origin}${location.pathname}${u ? `#gift=${u}` : ""}`, L = [v("p", `You are in ${a}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${y.on ? "player" : "listening wallet"}${u ? y.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], G = v("div", "", "ppp-open-row"), z = tL(C, g);
    if (z) {
      const J = v("a", `Open in ${f}`, "primary ppp-open-in");
      J.href = z, J.dataset.homeAction = "radio:open-in-browser", G.append(J);
    }
    return G.append(Jn("copy-page-link", "Copy link", () => C, z ? "" : "primary", () => at(l.snapshot()))), L.push(G, v("p", `If that does not open ${f}, use ${a}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), L;
  }, Ne = (a) => et(a) ?? E(a), Zt = (a) => a.slice(0, 2).map(Ne).join(" and ") + (a.length > 2 ? ` and ${a.length - 2} more` : ""), Xt = /* @__PURE__ */ new Map();
  let nr = !1;
  const rr = (a) => !a || /^(?:Inscription )?#\d+$/.test(a.trim()), hn = () => {
    nr || (nr = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((a) => a.ok ? a.json() : null).then((a) => {
      for (const u of Array.isArray(a == null ? void 0 : a.tracks) ? a.tracks : []) {
        const g = Number(u == null ? void 0 : u.id);
        Number.isSafeInteger(g) && Xt.set(g, { title: typeof u.title == "string" ? u.title : void 0, artist: typeof u.artist == "string" ? u.artist : void 0 });
      }
      at(l.snapshot());
    }).catch(() => {
      nr = !1;
    }));
  }, ss = (a, u) => {
    const g = Xt.get(a), f = eg(a, [g == null ? void 0 : g.title, u == null ? void 0 : u.title].find((L) => !rr(L)) || ""), C = J0(a, (g == null ? void 0 : g.artist) || (u == null ? void 0 : u.artist) || "");
    return { title: f, artist: C };
  }, is = (a) => {
    const { title: u, artist: g } = ss(a.song, a);
    return u ? `“${u}”${g ? ` — ${g}` : ""}` : `Song #${a.song}${g ? ` — ${g}` : ""}`;
  }, Gi = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, jo = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Nn(a) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(a.step) ? ["", ""] : a.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : a.step === "over" ? ["TOO MUCH", "bad"] : a.step === "locked" ? ["LOCKED", "mute"] : a.step === "intro" || a.step === "link" ? ["", ""] : a.step === "fund" ? a.depositPending ? ["ON ITS WAY", "warn"] : a.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : a.payingOn && a.session && a.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Jt(a, u, g = "", f) {
    const C = v("dt", a), L = v("dd", u, g);
    return f && L.append(" ", f), [C, L];
  }
  const _n = document.getElementById("ppp-top"), Je = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? e : i).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, $t = () => {
    var u;
    const a = window.XtrataRadioConnectStacks;
    a ? a() : (u = document.getElementById("radio-wallet-connect")) == null || u.click();
  }, Ws = () => {
    var u, g;
    const a = l.snapshot();
    if (a.step === "connect" || a.step === "wrong-wallet") {
      $t();
      return;
    }
    if (a.step === "elsewhere" && ((u = a.gate) != null && u.radioUrl)) {
      location.href = a.gate.radioUrl;
      return;
    }
    if (a.step === "locked" && !a.armed && !a.busy && l.unlock(), a.step === "ready" && ((g = a.giftStop) == null ? void 0 : g.reason) === "off" && !a.busy && l.switchOn(), a.step === "fund" && a.solo && !a.depositPending && !a.busy) {
      Be();
      return;
    }
    Je();
  };
  _n && (_n.onclick = Ws);
  const os = (a, u, g, f = "") => a.standIn && !a.mainConnected ? oe(`Connect ${Ne(a.standIn)} to add STX`, $t, f) : oe(u, g, f), Kn = (a) => {
    l.useLinked(a).then(() => Je());
  };
  let bn = null;
  const In = () => {
    const a = gg(l.snapshot(), Ne);
    return a.length ? bn || (bn = new Promise((u) => {
      var be;
      const g = v("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const C = (Se) => {
        f = Se, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), bn = null, u(f);
      }), g.addEventListener("click", (Se) => {
        Se.target === g && C(null);
      });
      const L = (Se, ve, w, T, R = !1) => {
        const de = v("button", "", "ppp-connect__opt " + w);
        return de.type = "button", de.disabled = R, de.onclick = T, de.append(v("b", Se), v("span", ve)), de;
      }, G = v("h2", "Connect", "ppp-connect__title");
      G.id = "ppp-connect-title";
      const z = a.map((Se) => L(Se.label, Se.detail, "is-music", () => {
        if (C("music"), Se.action === "linked" && Se.main) {
          Kn(Se.main);
          return;
        }
        const ve = gg(l.snapshot(), Ne).find((w) => w.action !== "linked");
        (ve == null ? void 0 : ve.action) === "create" ? l.create() : (ve == null ? void 0 : ve.action) === "unlock" && l.unlock(), Je();
      }, !!Se.disabled)), J = L("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => C("stacks")), we = oe("Cancel", () => C(null), "quiet ppp-connect__cancel");
      g.append(G, ...z, J, we), document.body.appendChild(g), g.showModal(), (be = z.find((Se) => !Se.disabled)) == null || be.focus();
    }), bn) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = In;
  function Ln(a) {
    if (!_n) return;
    const u = (f, C, L) => {
      _n.hidden = !1, _n.className = "ppp-top" + (C ? " is-" + C : ""), _n.replaceChildren(v("span", "", "dot"), document.createTextNode(f)), _n.title = L;
    }, g = a.session ? Math.min(a.session.playsLeft, a.playsLeft) : 0;
    switch (a.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        _n.hidden = !0;
        return;
      case "elsewhere":
        return u("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        _n.hidden = !0;
        return;
      case "intro":
        return u("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return u(`Connect ${Ne(a.linked)}`, "warn", `This device's listening wallet belongs to ${Ne(a.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return u("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return u("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return a.depositPending ? u("Plays on their way", "quiet", "Plays start by themselves when they land") : u(a.entries.some((f) => f.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return u("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return u("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return a.payingOn && g > 0 && !a.giftStop ? u(`${g.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : u("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Qt = document.getElementById("pppNudge"), Dr = document.getElementById("onair");
  (qi = Qt == null ? void 0 : Qt.querySelector("button")) == null || qi.addEventListener("click", () => Ws());
  const Ro = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Ki = {
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
  function as(a) {
    if (a.step === "loading") return;
    const u = a.session ? Math.min(a.session.playsLeft, a.playsLeft) : 0, g = a.step === "ready" && a.payingOn && u > 0 && !a.giftStop, f = a.step === "fund" && a.depositPending, C = a.step === "elsewhere" && !t, L = g || f || C ? "" : Ro[a.step] ?? "", G = g ? "on" : C ? "free" : L ? "off" : "";
    G ? document.documentElement.dataset.ppp = G : delete document.documentElement.dataset.ppp, Dr && (Dr.hidden = !G || G === "free", Dr.querySelector(".onair-sub").textContent = g ? `${u.toLocaleString()} plays left` : "Plays off"), Qt && (Qt.hidden = G !== "off" && G !== "free", Qt.classList.toggle("is-free", G === "free"), G === "free" ? (Qt.querySelector(".nudge-t").textContent = "You’re on the free player", Qt.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Qt.querySelector("button").textContent = "Get a player") : G === "off" && (Qt.querySelector(".nudge-t").textContent = L, Qt.querySelector(".nudge-s").textContent = S(a) ? a.step === "intro" ? uL : "" : "This radio requires a funded listening wallet with music support on.", Qt.querySelector("button").textContent = Ki[a.step] ?? "Start"));
  }
  let Zs = "";
  function Fr(a) {
    const u = v("div", "", "ppp-pick");
    a.funderMultiple && a.returnToKind === "funder" && u.append(v("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), a.returnToKind === "funder" && u.append(v("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = v("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = Zs, g.oninput = () => {
      Zs = g.value;
    };
    const f = oe(a.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      l.setReturnAddress(g.value), Zs = "";
    }, "tiny");
    return u.append(g, " ", f), a.returnToKind === "chosen" && u.append(" ", oe("Back to the funder", () => l.clearReturnAddress(), "tiny")), u;
  }
  const Pn = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function zo() {
    const a = v("p", Pn + " ", "ppp-mute");
    return a.append(Ue("Xverse", "https://www.xverse.app/download"), " · ", Ue("Leather", "https://leather.io/install-extension")), a;
  }
  let Js = "";
  const Go = (a) => {
    const u = document.documentElement, g = a.solo && !a.main ? a.listening ? E(a.listening) : "new" : "", f = g5() ? "1" : "", C = a.standIn && !a.mainConnected ? Ne(a.standIn) : "";
    `${g}|${f}|${C}` !== Js && (Js = `${g}|${f}|${C}`, g ? u.dataset.pppSolo = g : delete u.dataset.pppSolo, C ? u.dataset.pppAs = C : delete u.dataset.pppAs, f ? u.dataset.pppWalletInstalled = f : delete u.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const a of [1500, 4e3, 9e3]) setTimeout(() => at(l.snapshot()), a);
  function cs(a, u = "") {
    const g = v("div", "", "ppp-topup"), f = ls(a);
    g.append(v("span", "Add plays from My player: ", "ppp-mute"));
    for (const C of Bc) {
      const L = oe(`+${C.toLocaleString()}`, () => void l.topUpAlbum(C), u);
      L.disabled = f === void 0 || f < C || a.depositPending || !!a.busy, g.append(L);
    }
    return f !== void 0 && f < Bc[0] && g.append(v("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const ls = (a) => {
    var f;
    const u = (f = a.likeFunds) == null ? void 0 : f.balance;
    if (u === void 0 || !a.playCost) return;
    const g = u - zt - 6000n;
    return g > 0n ? Number(g / a.playCost) : 0;
  };
  function sr(a) {
    const u = a.likeFunds;
    if (!u || !u.album || !u.low && !u.pending) return [];
    if (u.low || (fn = !1), u.low && !fn) return [];
    const g = v("div", "", "ppp-pick ppp-lowbox");
    if (!u.low) {
      if (!u.txid) return [];
      const C = v("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return u.txid && C.append(Ue("View", ee(u.txid))), g.append(C), [g];
    }
    g.append(v("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append(v("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append(v("p", u.address, "ppp-addr-full"));
    const f = v("div", "", "ppp-open-row");
    if (f.append(Jn("copy-likes-address", "Copy address", () => u.address, "primary", () => at(l.snapshot()))), u.main && !a.solo) {
      const C = Zr - (u.balance ?? 0n);
      C > 0n && f.append(os(a, `Pay ${dr(C)} STX from my wallet`, () => void l.topUpLikes(), "primary"));
    }
    return g.append(f), g.append(v("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const jr = (a) => {
    const u = v("div", "", "ppp-wait");
    u.dataset.since = String(a.since), u.dataset.grace = String(a.graceMs), u.setAttribute("role", "progressbar"), u.setAttribute("aria-label", "Your plays are arriving");
    const g = v("p", "", "ppp-wait-t"), f = v("div", "", "ppp-wait-track");
    return f.append(v("div", "", "ppp-wait-fill")), u.append(g, f), Qs(u), u;
  };
  function Qs(a) {
    const u = Number(a.dataset.since), g = Number(a.dataset.grace) || 6e4, f = Math.max(0, Date.now() - u), C = a.querySelector(".ppp-wait-fill"), L = a.querySelector(".ppp-wait-t");
    if (f < g) {
      const G = Math.ceil((g - f) / 1e3);
      C.style.width = Math.max(4, Math.min(95, f / g * 100)).toFixed(0) + "%", L.textContent = `Your plays are arriving… usually about a minute · ${G}s`, a.classList.remove("is-long"), a.setAttribute("aria-valuenow", String(Math.round(f / g * 100)));
    } else
      C.style.width = "", L.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", a.classList.add("is-long"), a.removeAttribute("aria-valuenow");
  }
  let us = 0;
  setInterval(() => {
    const a = document.querySelectorAll(".ppp-wait");
    if (!a.length) {
      us = 0;
      return;
    }
    a.forEach(Qs), ++us % 10 === 0 && at(l.snapshot());
  }, 1e3);
  let ds = null;
  function ei(a) {
    if (a.step === "loading" && ds !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(a.step) || !!a.busy || a.armed || !!p.pendingCode() && !["ready", "fund", "over"].includes(a.step);
    g !== ds && (ds = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function at(a) {
    var dh, fh, hh, ph, gh, yh, wh, mh, bh, xh, Sh, vh, Ah, Eh, kh, $h, Ih, Lh;
    if (A.sync(), ct && ["ready", "fund", "over"].includes(a.step) && !a.busy) {
      const q = ct;
      ct = null, a.root === q.root && a.slot !== q.slot && l.openAlbum(q.slot);
    }
    const u = p.inProgress(a), g = Sr(a), f = u && a.step === "fund" ? { ...a, depositPending: !0 } : g !== null ? { ...a, depositPending: !0, arrival: { since: g, graceMs: ol } } : a, C = f.error === al;
    if (P(), ke(a), Y(a), me = Ke(a), pt(a, f), ei(f), Go(f), !u && p.inProgress(a)) return;
    if (Ln(f), as(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? y.on ? dL : "Checking your listening wallet…" : y.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      Le(f, !1);
      return;
    }
    const [L, G] = Nn(f), z = s(".ppp-state");
    z.textContent = L, z.className = "ppp-state" + (G ? " ppp-state--" + G : ""), z.hidden = !L;
    const J = !!f.busy || f.armed, we = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (J || !["intro", "loading"].includes(f.step));
    i.hidden = !we, i.classList.toggle("ppp-frame--rest", !J && !He);
    const be = s(".ppp-frame-label");
    be.hidden = !0;
    const Se = d5(f) ?? Ve;
    Ve = Se;
    const ve = "xtrata.radio.ppp.heard.v1", w = (() => {
      try {
        return localStorage.getItem(ve) === "1";
      } catch {
        return !1;
      }
    })();
    if (!w && f.entries.some((q) => q.kind === "play"))
      try {
        localStorage.setItem(ve, "1");
      } catch {
      }
    const T = w || f.slot > 0 && ((((dh = f.likeFunds) == null ? void 0 : dh.balance) ?? 0n) > 0n || d.count() > 1), R = S(f), de = !R && h5({ ...f, heard: T }, Se);
    s(".ppp-badge").hidden = !de;
    const At = s(".ppp-steps"), It = s(".ppp-stage");
    At.hidden = It.hidden = !de, Se && de && (At.replaceChildren(...Hd(f.solo).map((q, le) => {
      const _e = v("li", "", le < Se.at ? "done" : le === Se.at ? Se.blocked ? "now blocked" : "now" : "");
      return _e.append(v("span", le < Se.at ? "✓" : String(le + 1), "n"), q), le === Se.at && _e.setAttribute("aria-current", "step"), _e;
    })), It.textContent = Se.caption, It.className = "ppp-stage " + (Se.at >= Hd(f.solo).length ? "ppp-ok" : Se.blocked ? "ppp-bad" : "ppp-cyan"));
    const sn = s(".ppp-facts"), Et = [];
    f.main && ((fh = f.gate) != null && fh.here) && !f.solo && Et.push(...Jt("Your wallet", Ne(f.main), "ppp-addr-short"));
    const Vo = () => {
      if (!f.listening) return;
      const q = Jn("copy-listening", "Copy", () => f.listening || "", "tiny", () => at(l.snapshot()));
      Et.push(...Jt(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", E(f.listening), "ppp-addr-short", q));
    };
    if (f.linked || Vo(), f.listening && f.step !== "intro")
      if (f.linked)
        Et.push(...Jt("Credited to", `${Ne(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Vo();
      else if (f.solo) {
        f.creditedTo && Et.push(...Jt("Credited to", `${Ne(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const q = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${Ne(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Et.push(...Jt("Returns go to", f.gift ? q : f.returnTo && !et(f.returnTo) ? q.replace(E(f.returnTo), f.returnTo) : q, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Et.push(...Jt("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((hh = f.gate) != null && hh.here)) {
      const q = f.linkedListening.map((le) => E(le) + (le === f.listening ? " (this one)" : "")).join(", ");
      Et.push(...Jt(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", q, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const q = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Et.push(...Jt("Balance", `${dr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, q));
    }
    const Vn = f.entries.find((q) => q.kind === "play");
    Vn && hn(), Vn && Et.push(...Jt("Last paid song", `${is(Vn)} → ${Ne(Vn.recipient)}`, Gi[Vn.status] || "")), sn.replaceChildren(...Et), sn.hidden = !Et.length;
    const $e = [], lt = [], ht = [], on = [], si = wn(BigInt(((ph = f.gate) == null ? void 0 : ph.limits.playFee) ?? "300")), ih = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${dr(sl)} STX to the song holder, plus a ${dr(si - sl)} STX network fee.`, oh = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if ($e.push(v("p", "Pay artists as you listen.")), (gh = f.gate) != null && gh.radioUrl) {
          const le = v("p");
          le.append(Ue("Open the pay-per-play radio →", f.gate.radioUrl)), $e.push(le);
        }
        lt.push(v("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const le = [f.linked, ...f.others];
          $e.push(v("p", le.length > 1 ? `This device has listening wallets for ${Zt(le)}.` : `This device has a listening wallet for ${Ne(f.linked)}.`)), lt.push(v("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), le.slice(0, 3).forEach((_e, st) => ht.push(oe(`Open ${Ne(_e)}`, () => Kn(_e), st === 0 ? "primary" : "")));
        } else
          $e.push(v("p", "Connect your wallet to pay artists as you listen.")), lt.push(v("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        $e.push(v("p", `This device's listening wallet belongs to ${Ne(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), lt.push(v("p", `You are connected as ${Ne(f.main)}. Switch to the linked wallet to continue listening.`)), lt.push(v("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), ht.push(oe("Switch wallet", $t, "primary"));
        break;
      case "not-invited":
        $e.push(v("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        $e.push(v("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        $e.push(v("p", "Every play counts for the song’s owner, on-chain.")), lt.push(v("p", ih)), lt.push(v("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), lt.push(v("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? ($e.push(v("p", `This device already has a listening wallet for ${Zt(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), lt.push(v("p", `Otherwise, set up a new listening wallet for ${Ne(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && lt.push(v("p", `This is the listening wallet for ${Ne(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && lt.push(v("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const q = p.liveGift();
        ht.push(oe(q ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${Ne(f.main)}` : "Start listening", () => void l.create(), "primary")), !q && !f.solo && f.main && f.others.length && ht.push(oe("Switch wallet", $t)), !q && f.solo && ht.push(oe("I have a Stacks wallet", $t)), ht.push(oe("I already have a listening wallet", () => void l.unlock(!0))), q && ht.push(oe("Not now", () => p.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || ($e.push(v("p", "Locked.", "ppp-mute")), ht.push(oe("Unlock", () => void l.unlock(), "primary"))), f.standIn ? on.push(oe("Use a different listening wallet", () => void In().then((le) => {
          le === "stacks" && $t();
        }), "quiet")) : on.push(oe("Use a different listening wallet", () => void l.unlock(!0), "quiet"));
        break;
      case "link":
        $e.push(v("p", `Link to ${Ne(f.main)} · free`)), lt.push(v("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), lt.push(v("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), ht.push(oe(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void l.link(), "primary"));
        break;
      case "loading":
        $e.push(v("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && $e.push(jr(f.arrival)) : Or(f) ? $e.push(v("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (yh = f.gift) != null && yh.player ? $e.push(v("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? $e.push(v("p", "No plays left · add plays to keep counting", "ppp-bad")) : $e.push(v("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / si)).toLocaleString()} plays`)), f.entries.length && lt.push(v("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && lt.push(v("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), u ? lt.push(v("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? lt.push(v("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (lt.push(v("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), lt.push(v("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && ht.push(Jn("copy-address", "Copy my address", () => f.listening || "", "primary", () => at(l.snapshot())))) : lt.push(v("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const le = v("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          le.append(Ue("View", ee(f.depositTxid))), $e.push(le);
        } else f.allowance > 0n && !f.solo && !f.depositPending && ht.push(os(f, `Deposit ${dr(f.allowance)} STX from my wallet`, () => void l.deposit(), "primary"));
        break;
      }
      case "over":
        $e.push(v("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && ($e.push(v("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), ht.push(oe("Back up my player · 24 words", () => void l.backup(), ""))), f.solo && !f.returnTo && ($e.push(v("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), $e.push(Fr(f))), (!f.solo || f.returnTo) && ht.push(oe("Return excess", () => void l.returnFunds("excess"), "primary"), oe("Return all", () => void l.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((wh = f.giftStop) == null ? void 0 : wh.reason) !== "off") {
          const le = Math.min(f.session.playsLeft, f.playsLeft);
          $e.push(v("p", `${le.toLocaleString()} plays left`, "ppp-ok")), lt.push(v("p", ih + " The heart likes or unlikes from this wallet for 0.0002 STX.")), ht.push(oe("Switch off", () => void l.switchOff()));
        } else
          $e.push(v("p", "Switch on music support to listen.", "ppp-mute")), ht.push(oe("Switch plays on", () => void l.switchOn(), "primary"));
        f.queued && $e.push(v("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && $e.push(v("p", "Running low on plays", "ppp-warn")), f.aboveTarget && $e.push(v("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? $e.push(v("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && ht.push(os(f, `Top up ${dr(f.allowance)} STX`, () => void l.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const q = f.step === "fund", le = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      q ? ht.unshift(oe("Add plays", () => Be(), "primary")) : le ? ht.push(oe("Add plays", () => Be(), "primary")) : f.step === "ready" && on.push(oe("Add plays", () => Be(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && lt.push(v("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && lt.push(Fr(f)), lt.push(zo()), f.slot === 0 && f.step === "ready" && f.entries.some((q) => q.kind === "play" && q.status === "confirmed"))) {
      const q = v("p", "New to Stacks? ", "ppp-mute");
      q.append(Ue("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), $e.push(q);
    }
    if (f.walletOutdated && lt.push(v("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && ($e.push(v("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), ht.push(oe("Clear stuck payments", () => void l.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && on.push(oe(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${Ne(f.returnTo)}`, () => void l.returnFunds("all"), "quiet")), f.slot > 0 && ((mh = f.gift) != null && mh.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && on.push(cs(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && on.push(oe(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void l.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && on.push(oe("Lock", () => void l.lock(), "quiet")), we && !J && on.push(oe(He ? "Hide listening wallet box" : "Show listening wallet box", () => {
      He = !He, at(l.snapshot());
    }, "quiet")), [...ht, ...on].forEach((q) => q.disabled = oh), oh && (ht.length = 0), !R && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((bh = f.gift) != null && bh.player)) {
      const q = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", le = $e.at(0);
      f.step === "ready" && le ? le.append(v("span", ` · ${K(f.balance)} STX`, q)) : $e.push(v("p", `Balance ${K(f.balance)} STX`, q));
    }
    if (R) {
      for (const _e of [...ht, ...on]) {
        const st = oL[_e.textContent ?? ""];
        st && (_e.textContent = st);
      }
      for (let _e = $e.length - 1; _e >= 0; _e--) wg($e[_e].textContent) && lt.unshift(...$e.splice(_e, 1));
      for (let _e = ht.length - 1; _e >= 0; _e--) wg(ht[_e].textContent) && on.unshift(...ht.splice(_e, 1));
      const q = f.entries.some((_e) => _e.kind === "play"), le = lL(f.step, { played: q, arriving: f.depositPending });
      le.length && $e.length && le.shift(), $e.push(...le.map((_e) => v("p", _e, "ppp-mute")));
    }
    if ((xh = f.gift) != null && xh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const q = v("p", "", "ppp-gift");
      q.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && q.append(" · ", f.gift.player.subtitle);
      const le = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? v("span", " · plays on their way", "ppp-warn") : v("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      le && q.append(le);
      const _e = (Sh = $e.at(0)) == null ? void 0 : Sh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && _e && /STX/.test(_e.textContent ?? "") && _e.remove(), $e.unshift(q), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          $e.splice(1, 0, v("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), cs(f, "primary"));
        else {
          const st = v("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          st.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), st.append(Ue("Xverse", "https://www.xverse.app/download"), " and ", Ue("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), $e.splice(1, 0, st);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const q = f.returnPlan, le = v("div", "", "ppp-pick");
      le.append(v("p", q.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const _e = v("ul", "", "ppp-gift-list");
      q.steps.forEach((st, or) => {
        const Un = st.kind === "gift" ? "the unused gift" : st.kind === "deposit" ? "what was added to it" : "the rest", an = v("li");
        an.append(v("span", `${or + 1}. ${dr(BigInt(st.send))} STX · ${Un}`, "t"), v("span", st.to ? ` → ${Ne(st.to)}` : " → choose an address below", st.to ? "ppp-mute" : "ppp-warn")), _e.append(an);
      }), le.append(_e), q.kept && le.append(v("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), q.steps.some((st) => !st.to) && le.append(Fr(f)), le.append(oe(q.steps.length > 1 ? `Confirm part 1 of ${q.steps.length}` : "Confirm and return", () => void l.returnFunds("all"), "primary")), $e.push(le);
    }
    const ps = ti(f), gs = x ? ps : null, Wi = ce(f, !!gs), cb = Wi === "gift" || Wi === "arriving" || Wi === "new", jl = p.banner(a, { bare: !!gs || Wi === "gift" || Wi === "arriving" }), Pa = ot && (p.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? Ut(ot, p.pendingCode()) : [];
    gs || ($e.unshift(...jl), $e.push(...sr(f)), $e.unshift(...Pa)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && $e.unshift(v("p", `This is ${Ne(f.creditedTo)}'s listening wallet. Plays and likes count for ${Ne(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...$e);
    const Rl = document.querySelector(".ppp-switch");
    if (Rl) {
      const q = d.latest(), le = f.slot > 0, _e = ["fund", "ready", "over"].includes(f.step) && (le || !!q);
      if (Rl.hidden = !_e, _e) {
        const st = (an, Oa, Da, Yl) => {
          const Ji = oe("", Yl, "ppp-tab");
          return Ji.setAttribute("aria-pressed", String(Da)), Ji.append(v("span", an, "tt"), v("span", Oa === void 0 ? "…" : `${F(Oa).toLocaleString()} plays`, "ts")), Ji.disabled = !!f.busy, Ji;
        }, or = le ? ((Ah = (vh = f.gift) == null ? void 0 : vh.player) == null ? void 0 : Ah.title) ?? "Album" : q.title, Un = oe("View all albums" + (d.count() > 1 ? ` (${d.count()})` : ""), () => {
          const an = document.querySelector(".ppp-shelf");
          an && (an.hidden = !1, an.open = !an.open, Un.setAttribute("aria-expanded", String(an.open)), an.open && requestAnimationFrame(() => an.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Un.setAttribute("aria-expanded", String(!!((Eh = document.querySelector(".ppp-shelf")) != null && Eh.open))), Rl.replaceChildren(
          st("🎧 My player", le ? (kh = f.likeFunds) == null ? void 0 : kh.balance : f.balance, !le, () => {
            le && l.openAlbum(0);
          }),
          st("💿 " + or, le ? f.balance : void 0, le, () => {
            !le && q && l.openAlbum(q.slot);
          }),
          Un
        );
      }
    }
    const Ua = d.render(f), Ha = document.querySelector(".ppp-shelf");
    if (Ha) {
      Ha.hidden = !Ua;
      const q = Ha.querySelector("summary");
      q && (q.textContent = d.count() > 0 ? `♪ My albums (${d.count()})` : "♪ My albums");
      const le = Ha.querySelector(".ppp-shelf-body");
      Ua && le && !le.contains(Ua) && le.replaceChildren(Ua);
    }
    const Xo = p.renderFold(a);
    if (s(".ppp-gifts").hidden = !Xo, Xo && !s(".ppp-gift-body").contains(Xo) && s(".ppp-gift-body").replaceChildren(Xo), Xo && gt) {
      gt = !1;
      const q = s(".ppp-gifts");
      q.open = !0, requestAnimationFrame(() => q.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const zl = document.querySelector("#ppp .ppp-featured");
    if (zl) {
      const q = B(), le = A.manage(), _e = (q.length > 0 || !!le) && f.slot === 0 && !(($h = f.gift) != null && $h.player) && f.step === "ready";
      zl.hidden = !_e, _e && zl.replaceChildren(...q.length ? [v("p", "Albums in your player", "ppp-featured__h")] : [], ...q.map((st) => {
        const or = (De == null ? void 0 : De.id) === st.id, Un = oe("", () => nt(or ? null : st, !or), "ppp-featured__a" + (or ? " is-on" : "")), an = yr(st).length;
        return Un.append(v("b", st.title), v("span", or ? "Playing now · tap to go back to the radio" : `${st.subtitle ? st.subtitle + " · " : ""}${an} ${an === 1 ? "song" : "songs"}`)), Un.setAttribute("aria-pressed", String(or)), Un.disabled = !!f.busy, Un;
      }), ...le ? [le] : []);
    }
    const Gl = document.querySelector("#ppp .ppp-release-in-slot");
    if (Gl) {
      const q = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : A.banner();
      Gl.hidden = !q.length, Gl.replaceChildren(...q);
    }
    const Zi = document.querySelector("#ppp .ppp-release");
    if (Zi) {
      const q = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : A.fold();
      if (Zi.hidden = !q, q) {
        const le = document.activeElement instanceof HTMLElement && Zi.contains(document.activeElement) ? document.activeElement : null, _e = ((Ih = Zi.querySelector(".ppp-release-songs")) == null ? void 0 : Ih.scrollTop) ?? 0;
        (Lh = Zi.querySelector(".ppp-release-body")) == null || Lh.replaceChildren(...q);
        const st = Zi.querySelector(".ppp-release-songs");
        st && _e && (st.scrollTop = _e), le && le.isConnected && document.activeElement !== le && le.focus({ preventScroll: !0 });
      }
    }
    Rr(f);
    const Kl = document.querySelector("#ppp .ppp-yours");
    if (Kl) {
      const q = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      Kl.hidden = !q;
      const le = Kl.querySelector(".ppp-yours-body");
      if (q && le && le.getAttribute("data-for") !== f.listening) {
        le.setAttribute("data-for", f.listening);
        const _e = (Yl, ...Ji) => {
          const Ch = v("details", "", "ppp-yours-item");
          return Ch.append(v("summary", Yl), ...Ji), Ch;
        }, st = v("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        st.append(v("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const or = v("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), Un = v("p");
        Un.append(Ue("Find a name at BNS One →", "https://bns.one"));
        const an = v("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Oa = v("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Da = v("p");
        Da.append(Ue("See the giveaway →", "https://xtrata.xyz/giveaway")), le.replaceChildren(
          _e("Give your player a name", st, or, v("p", f.listening, "ppp-addr-full"), Jn("copy-yours-address", "Copy my player’s code", () => l.snapshot().listening || "", "tiny", () => at(l.snapshot())), Un),
          _e("Link it to a wallet you already have", an),
          _e("Bring a friend in", Oa, Da)
        );
      }
    }
    s(".ppp-body").replaceChildren(...lt), s(".ppp-actions").replaceChildren(...ht), s(".ppp-actions2").replaceChildren(...on);
    const Vl = f.busy || f.message || "", ah = s(".ppp-msg"), Xl = Vl && $e.some((q) => (q.textContent ?? "").startsWith(Vl.replace(/[.✓\s]+$/, ""))) ? "" : Vl, ch = !Xl && !f.error ? f.notice : C && !Xl ? f.error : "";
    ah.textContent = Xl || ch, ah.classList.toggle("is-warn", !!ch), s(".ppp-err").textContent = C ? "" : f.error;
    const lb = f.entries.filter((q) => q.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...lb.slice(0, 5).map((q) => {
      const le = v("li"), _e = q.status === "confirmed" ? "ok" : q.status === "failed" ? "bad" : "warn";
      return le.append(v("span", "", "d " + _e), v("span", is(q), "t"), v("span", V(q.created), "ppp-mute")), q.txid && le.append(Ue("tx", ee(q.txid))), le;
    })), s(".ppp-wallets").hidden = !(sn.childElementCount || on.length), s(".ppp-more").hidden = !lt.length;
    const lh = s(".ppp-history");
    lh.hidden = !f.entries.length, f.entries.length && hn(), lh.replaceChildren(v("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((q) => {
      const le = v("div", "", "ppp-row"), _e = q.kind === "play" ? [v("span", is(q), "ppp-song"), v("span", ` · ${dr(BigInt(q.amount))} STX to ${Ne(q.recipient)}`, "ppp-mute")] : q.kind === "like" ? [v("span", `${q.liked ? "♥ Liked" : "Unliked"} ${is(q)}`, "ppp-song"), v("span", ` · for ${f.linked ? Ne(f.linked) : "this listening wallet"}`, "ppp-mute")] : [v("span", `Returned ${dr(BigInt(q.amount))} STX`, "ppp-song"), v("span", ` to ${Ne(q.recipient)}`, "ppp-mute")];
      return le.append(
        v("span", jo[q.status] || q.status, "ppp-status " + (Gi[q.status] || "")),
        ..._e,
        v("span", ` · ${new Date(q.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), q.txid && le.append(Ue("tx ↗", ee(q.txid))), le;
    })), U == null || U.render(gs ? fs(f, gs, [...Pa, ...jl]) : null), Le(f, !!gs, cb ? [...Pa, ...jl] : Pa, Wi), ni(f, !!gs || !!(O != null && O.showing())), vt(f, gs), St.isOpen() && St.refresh(), hs();
    const uh = (ps == null ? void 0 : ps.mode) === "open" ? null : Me(f);
    Ee == null || Ee.render((ps == null ? void 0 : ps.mode) === "open" ? fs(f, ps, []) : uh ? { ...fs(f, { mode: "open", player: uh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function ti(a) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(a.step)) return null;
    if (a.slot > 0 && ((f = a.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(a.step))
      return a.root && Bt({ root: a.root, slot: a.slot, player: a.gift.player }), { mode: "open", player: a.gift.player };
    const u = p.incomingAlbum();
    if (u) return { mode: "arrive", player: u.player, from: u.from, offered: u.plays };
    const g = qt();
    return g && (a.step === "locked" || ct && a.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const Vi = (a, u, g, f, C) => `/awards/${a.id}#${new URLSearchParams({ n: String(u), a: g, ...C ? { b: C } : {}, p: String(f), s: bg(z0, u, g) })}`;
  function Ko(a) {
    const u = a.award;
    return !u || !["ready", "fund", "over", "link"].includes(a.step) ? null : u.claimTx ? Z ? "making" : null : u.state === "claimed" ? Z && u.inscription !== void 0 ? "yours" : null : u.state !== "ready" || X || a.step === "link" && ae !== "have" ? null : ae === "making" || ae === "yours" ? "ready" : ae;
  }
  function ni(a, u) {
    if (!_) return;
    const g = a.award, f = g != null && g.cls && Sc(g.cls) ? vc(g.cls) : null, C = a.slot === 0 ? a.listening : a.root, L = u || !g || !f || !C || g.number === void 0 ? null : Ko(a);
    if (!L || !g || !f || !C) {
      _.render(null, u);
      return;
    }
    L === "have" && a.linked && !b && (b = !0, l.awardRefresh());
    const G = typeof g.name == "string" && g.name ? g.name : null, z = [];
    a.error && z.push(v("p", a.error, "ppp-warn"));
    const J = (we) => {
      ae = we, we === "name" && (Z = !0), at(l.snapshot());
    };
    _.render({
      screen: L,
      tier: f,
      number: g.number,
      need: g.need ?? 0,
      player: C,
      name: g.name,
      inscription: g.inscription,
      art: L === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : Vi(f, g.number, C, g.need ?? 0, G),
      claimLink: g.claimTx ? ee(g.claimTx) : void 0,
      status: z,
      asking: !!a.busy || a.armed,
      busy: !!a.busy,
      main: a.main ? Ne(a.main) : null,
      canLink: a.step === "link",
      linked: !!a.linked,
      copyAddress: () => Jn("award-player-address", "Copy my player’s address", () => C, "tiny", () => at(l.snapshot())),
      go: J,
      claim: (we) => {
        Z = !0, l.claimAward(we);
      },
      refresh: () => void l.awardRefresh(),
      connect: () => {
        var we;
        return (we = document.getElementById("radio-wallet-connect")) == null ? void 0 : we.click();
      },
      link: () => void l.link(),
      later: () => {
        X = !0;
        try {
          localStorage.setItem(W, String(Date.now()));
        } catch {
        }
        at(l.snapshot());
      },
      done: () => {
        Z = !1, ae = "ready", at(l.snapshot());
      }
    }, u);
  }
  function Rr(a) {
    var Se;
    const u = document.querySelector("#ppp .ppp-award");
    if (!u) return;
    const g = a.award, f = a.slot === 0 ? a.listening : a.root, C = g != null && g.cls && Sc(g.cls) ? vc(g.cls) : null, L = !!g && !!C && !!f && ["ready", "fund", "over"].includes(a.step) && !(g.state === "unavailable" && g.number === void 0);
    if (u.hidden = !L, !L || !g || !C || !f) {
      u.replaceChildren();
      return;
    }
    const G = JSON.stringify([g, f, !!a.busy]);
    if (u.getAttribute("data-sig") === G) return;
    u.setAttribute("data-sig", G);
    const z = (ve) => {
      const w = v("p", "", "ppp-award__h");
      return w.append(v("b", `${C.mark} Music Hero award`), v("span", ve)), w;
    }, J = `No. ${String(g.number ?? 0).padStart(4, "0")}`, we = (ve) => {
      const w = v("div", "", "ppp-award__art"), T = document.createElement("iframe");
      return T.src = ve, T.title = `${C.name} record`, T.setAttribute("sandbox", "allow-scripts"), T.setAttribute("loading", "lazy"), w.append(T), w;
    }, be = [];
    if (g.state === "claimed") {
      if (be.push(z(`${C.name} record · ${J}`)), g.inscription !== void 0 && be.push(we(`/i/${g.inscription}`)), be.push(v("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${C.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const ve = v("p");
        ve.append(Ue("Open it full screen ↗", `/i/${g.inscription}`)), be.push(ve);
      }
      if (g.sendTx) {
        const ve = v("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        ve.append(Ue("View", ee(g.sendTx))), be.push(ve);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const ve = v("details", "", "ppp-award__send"), w = document.createElement("input");
        w.type = "text", w.placeholder = "SP… address to send it to", w.autocomplete = "off", w.spellcheck = !1, w.setAttribute("aria-label", "Address to send your record to");
        const T = oe("Send my record…", () => void l.sendAward(w.value), "");
        T.disabled = !!a.busy, ve.append(
          v("summary", "Send this record to someone"),
          v("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          w,
          T
        ), be.push(ve);
      }
    } else if (g.claimTx) {
      be.push(z(`${C.name} record · ${J}`));
      const ve = v("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      ve.append(Ue("View", ee(g.claimTx))), be.push(ve);
    } else if (g.state === "ready") {
      be.push(z(`${C.name} record · ${J}`));
      const ve = typeof g.name == "string" && g.name ? g.name : null, w = new URLSearchParams({ n: String(g.number), a: f, ...ve ? { b: ve } : {}, p: String(g.need), s: bg(z0, g.number, f) });
      be.push(we(`/awards/${C.id}#${w}`)), be.push(v("p", `Your ${C.name} record is ready. You have paid artists for ${(Se = g.need) == null ? void 0 : Se.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const T = v("div", "", "ppp-award__row");
      ve ? (be.push(v("p", `Its plaque will carry ${ve} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), T.append(oe("Claim my record", () => {
        Z = !0, l.claimAward("auto");
      }, "primary"), oe("Use my address only", () => {
        Z = !0, l.claimAward("none");
      }, "quiet"))) : g.name === null ? (be.push(v("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), T.append(oe("Claim my record", () => {
        Z = !0, l.claimAward("none");
      }, "primary"), oe("Check for a name again", () => void l.awardRefresh(), "quiet"))) : (be.push(v("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), T.append(oe("Check for a name again", () => void l.awardRefresh(), "primary"), oe("Claim with my address only", () => void l.claimAward("none"), "quiet"))), T.querySelectorAll("button").forEach((R) => {
        R.disabled = !!a.busy;
      }), be.push(T, v("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      be.push(z(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const ve = v("div", "", "ppp-award__bar"), w = document.createElement("i");
      w.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, ve.append(w);
      const T = g.need - g.have;
      be.push(ve, v("p", `${T.toLocaleString()} more ${T === 1 ? "play" : "plays"} and your ${C.name} record is yours to claim.`, "ppp-mute"));
    } else
      be.push(z(`${C.name} record · ${J}`)), be.push(v("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    u.replaceChildren(...be);
  }
  function vt(a, u) {
    var z;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!u && (_ != null && _.showing()) && ((z = a.award) != null && z.cls) && Sc(a.award.cls) && (a.busy || a.armed)) {
      const J = vc(a.award.cls), we = v("span", "", "ppp-skin__t");
      we.append(v("b", `${J.name} record · No. ${String(a.award.number ?? 0).padStart(4, "0")}`), v("span", "Xtrata Music Hero")), g.hidden = !1, g.replaceChildren(v("span", J.mark, "ppp-skin__art ppp-skin__art--none"), we);
      return;
    }
    const f = !!u && (!!a.busy || a.armed);
    if (g.hidden = !f, !f || !u) {
      g.replaceChildren();
      return;
    }
    const C = Mc(u.player.cover), L = C ? v("img", "", "ppp-skin__art") : v("span", "♪", "ppp-skin__art ppp-skin__art--none");
    C && (L.src = C, L.alt = "");
    const G = v("span", "", "ppp-skin__t");
    G.append(v("b", u.player.title), v("span", u.mode === "arrive" && u.from ? `A gift from ${u.from}` : u.player.subtitle || "Your album")), g.replaceChildren(L, G);
  }
  function fs(a, u, g) {
    var J, we, be, Se, ve;
    const f = !!a.busy || a.armed, C = [...g];
    a.depositPending && a.arrival && C.push(jr(a.arrival)), a.error ? C.push(v("p", a.error, a.error === al ? "ppp-warn" : "ppp-bad")) : a.message && !f ? C.push(v("p", a.message, "ppp-cyan")) : a.notice && C.push(v("p", a.notice, "ppp-warn")), u.mode === "open" && fn && ((J = a.likeFunds) != null && J.album) && a.likeFunds.low && !a.likeFunds.pending && C.push(v("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let L = "Kept on this device with Face ID or your passkey. No app or account needed.", G = null, z = null;
    if (u.mode === "locked")
      G = { label: "Continue listening", run: () => {
        ct = qt(), l.unlock();
      } }, z = { label: "Use a different passkey", run: () => {
        ct = null, l.unlock(!0);
      } };
    else if (u.mode === "arrive")
      if (a.step === "intro" && xc(ye) && ye.album === u.player.id) {
        const w = window.XtrataRadio, T = yr(u.player)[0], R = ye.phase === "playing";
        G = { label: R && !!((be = (we = w == null ? void 0 : w.getState) == null ? void 0 : we.call(w)) != null && be.playing) ? "Pause" : R ? "Carry on" : "Play the first song", run: () => {
          var At, It;
          R ? (At = w == null ? void 0 : w.playPause) == null || At.call(w) : T && ((It = w == null ? void 0 : w.playToken) == null || It.call(w, T.id));
        } }, z = { label: "Make my player and hear it all", run: () => void l.create() }, L = "The first song is free. Nothing to set up yet.";
      } else if (a.step === "intro") {
        const w = ye.phase === "done" && ye.album === u.player.id;
        w && !C.length && C.push(v("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), G = { label: w ? "Keep listening" : "Open album", run: () => void l.create() }, z = { label: "I've used Xtrata Music here before", run: () => void l.unlock(!0) };
      } else a.step === "locked" ? (G = { label: "Open album", run: () => void l.unlock() }, z = { label: "Use a different passkey", run: () => void l.unlock(!0) }) : a.step === "unsupported" ? C.push(v("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : C.length || C.push(v("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: u.mode,
      player: u.player,
      from: u.from,
      offered: u.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: u.mode === "arrive" && a.step === "intro" ? 1 : void 0,
      plays: u.mode === "open" ? a.balance === void 0 ? null : a.giftPlays : void 0,
      playsComing: a.depositPending,
      status: C,
      primary: G,
      secondary: z,
      hint: G ? L : void 0,
      asking: f,
      busy: !!a.busy,
      myPlays: ls(a),
      topUps: Bc,
      canMake: !!((ve = (Se = a.gate) == null ? void 0 : Se.gifts) != null && ve.admin)
    };
  }
  const en = document.getElementById("findBox"), zr = document.getElementById("findBody"), ir = en && zr ? $L(zr, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((a) => a.ok ? a.json() : Promise.reject(new Error("catalogue unavailable"))).then((a) => AL(a == null ? void 0 : a.tracks, (u, g) => ({ title: eg(u, rr(g.title) ? "" : g.title), artist: J0(u, g.artist || "") }))),
    play: (a) => {
      var u, g;
      (g = (u = window.XtrataRadio) == null ? void 0 : u.playToken) == null || g.call(u, a);
    },
    current: () => {
      var u, g, f, C;
      const a = Number((C = (f = (g = (u = window.XtrataRadio) == null ? void 0 : u.getState) == null ? void 0 : g.call(u)) == null ? void 0 : f.nowPlaying) == null ? void 0 : C.tokenId);
      return Number.isSafeInteger(a) ? a : null;
    },
    locked: () => {
      var a;
      return !!((a = l.snapshot().albumLock) != null && a.locked);
    },
    explicit: (a) => {
      var u, g;
      return !!((g = (u = window.XtrataRadio) == null ? void 0 : u.isExplicit) != null && g.call(u, a));
    },
    liked: (a) => Xi().has(a)
  }) : null;
  en == null || en.addEventListener("toggle", () => {
    en.open && (ir == null || ir.load());
  });
  let Gr = "";
  const Xi = () => {
    var u, g, f;
    const a = (f = (g = (u = window.XtrataRadio) == null ? void 0 : u.getState) == null ? void 0 : g.call(u)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(a) ? a.map((C) => Number(C == null ? void 0 : C.tokenId)).filter(Number.isSafeInteger) : []);
  }, hs = () => {
    var u, g, f, C, L;
    if (!ir || !(en != null && en.open)) return;
    const a = `${!!((u = l.snapshot().albumLock) != null && u.locked)}|${((L = (C = (f = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : f.call(g)) == null ? void 0 : C.nowPlaying) == null ? void 0 : L.tokenId) ?? ""}|${[...Xi()].sort((G, z) => G - z).join(",")}`;
    a !== Gr && (Gr = a, ir.refresh());
  }, Yi = /* @__PURE__ */ new Map();
  let ri = !1;
  const Cn = () => {
    const a = window.XtrataRadio;
    return a != null && a.subscribe ? (a.subscribe((u) => {
      const g = u == null ? void 0 : u.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && Yi.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), hs(), xc(ye)) {
        const f = !!(u != null && u.playing);
        Ze({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: f, at: Date.now() }), f !== ri && (ri = f, at(l.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Cn()) {
    const a = setInterval(() => {
      Cn() && clearInterval(a);
    }, 500);
    setTimeout(() => clearInterval(a), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (a) => {
    const u = a.detail;
    if (xc(ye) && Ze({ kind: "listened", at: Date.now() }), u && Number.isSafeInteger(u.song) && typeof u.id == "string" && /^[0-9a-f]{32}$/.test(u.id)) {
      hn();
      const g = ss(u.song, Yi.get(u.song));
      l.onListened({ song: u.song, id: u.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void l.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || l.refresh();
  }), setInterval(() => {
    !document.hidden && (t || l.snapshot().step !== "off") && l.refresh();
  }, 15e3), l.refresh();
}
const TL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", BL = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), i = /CriOS/.exec(t.userAgent), o = t.userAgent.includes("Mobile");
  return i ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, ML = () => BL() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, NL = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, _L = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', ab = class {
  constructor(e) {
    rk(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && Av(e), this.callback(kl(e));
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
    var r, s, i, o, c, l, h, p, d, m;
    return n === "IOS" ? (s = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && s !== void 0 ? s : e.webUrl : t === "Chrome" ? (o = (i = e.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(e)) !== null && o !== void 0 ? o : e.webUrl : t === "Firefox" ? (l = (c = e.mozillaAddOnsUrl) !== null && c !== void 0 ? c : this.getMobileUrl(e)) !== null && l !== void 0 ? l : e.webUrl : n === "Android" ? (p = (h = e.googlePlayStoreUrl) !== null && h !== void 0 ? h : this.getBrowserUrl(e)) !== null && p !== void 0 ? p : e.webUrl : (m = (d = this.getBrowserUrl(e)) !== null && d !== void 0 ? d : e.webUrl) !== null && m !== void 0 ? m : this.getMobileUrl(e);
  }
  render() {
    const e = ML(), t = NL(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Oe("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Oe("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Oe("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Oe("div", { class: "flex flex-col space-y-[10px]" }, Oe("div", { class: "flex items-center" }, Oe("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Oe("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Oe("span", { class: "sr-only" }, "Close popup"), Oe("img", { src: TL }))), r ? Oe("p", null, "Select the wallet you want to connect to.") : Oe("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && Oe("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Oe("div", { class: "mt-6" }, Oe("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Oe("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Oe("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Oe("div", { class: "aspect-square basis-9 overflow-hidden" }, Oe("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Oe("div", { class: "flex-1" }, Oe("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Oe("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Oe("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Oe("div", { class: "mt-6" }, r ? Oe("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Oe("div", { class: "mb-5 flex justify-between" }, Oe("p", { class: "text-sm font-medium" }, "Recommended wallets"), Oe("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Oe("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Oe("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Oe("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Oe("p", null, "What is a wallet? ", Oe("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Oe("ul", { class: "space-y-3" }, n.map((i) => Oe("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Oe("div", { class: "aspect-square basis-9 overflow-hidden" }, Oe("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Oe("div", { class: "flex-1" }, Oe("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Oe("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, e, t) && Oe("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, e, t), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return O4(this);
  }
};
ab.style = _L;
const PL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: ab
}, Symbol.toStringTag, { value: "Module" }));
