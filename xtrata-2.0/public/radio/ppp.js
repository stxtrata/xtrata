var db = Object.defineProperty;
var fb = (e, t, n) => t in e ? db(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Yo = (e, t, n) => fb(e, typeof t != "symbol" ? t + "" : t, n);
var An = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function vg(e) {
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
      function d(b) {
        var I = {
          next: function() {
            var N = b.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function p(b) {
        this.map = {}, b instanceof p ? b.forEach(function(I, N) {
          this.append(N, I);
        }, this) : Array.isArray(b) ? b.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(I) {
          this.append(I, b[I]);
        }, this);
      }
      p.prototype.append = function(b, I) {
        b = c(b), I = l(I);
        var N = this.map[b];
        this.map[b] = N ? N + ", " + I : I;
      }, p.prototype.delete = function(b) {
        delete this.map[c(b)];
      }, p.prototype.get = function(b) {
        return b = c(b), this.has(b) ? this.map[b] : null;
      }, p.prototype.has = function(b) {
        return this.map.hasOwnProperty(c(b));
      }, p.prototype.set = function(b, I) {
        this.map[c(b)] = l(I);
      }, p.prototype.forEach = function(b, I) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && b.call(I, this.map[N], N, this);
      }, p.prototype.keys = function() {
        var b = [];
        return this.forEach(function(I, N) {
          b.push(N);
        }), d(b);
      }, p.prototype.values = function() {
        var b = [];
        return this.forEach(function(I) {
          b.push(I);
        }), d(b);
      }, p.prototype.entries = function() {
        var b = [];
        return this.forEach(function(I, N) {
          b.push([N, I]);
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
        return new Promise(function(I, N) {
          b.onload = function() {
            I(b.result);
          }, b.onerror = function() {
            N(b.error);
          };
        });
      }
      function y(b) {
        var I = new FileReader(), N = w(I);
        return I.readAsArrayBuffer(b), N;
      }
      function S(b) {
        var I = new FileReader(), N = w(I), M = /charset=([A-Za-z0-9_-]+)/.exec(b.type), q = M ? M[1] : "utf-8";
        return I.readAsText(b, q), N;
      }
      function v(b) {
        for (var I = new Uint8Array(b), N = new Array(I.length), M = 0; M < I.length; M++)
          N[M] = String.fromCharCode(I[M]);
        return N.join("");
      }
      function T(b) {
        if (b.slice)
          return b.slice(0);
        var I = new Uint8Array(b.byteLength);
        return I.set(new Uint8Array(b)), I.buffer;
      }
      function U() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = T(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || o(b)) ? this._bodyArrayBuffer = T(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
              return this.blob().then(y);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var b = u(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return S(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(v(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(_);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var H = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function E(b) {
        var I = b.toUpperCase();
        return H.indexOf(I) > -1 ? I : b;
      }
      function B(b, I) {
        if (!(this instanceof B))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var N = I.body;
        if (b instanceof B) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, I.headers || (this.headers = new p(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !N && b._bodyInit != null && (N = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new p(I.headers)), this.method = E(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var D = new AbortController();
            return D.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var M = /([?&])_=[^&]*/;
          if (M.test(this.url))
            this.url = this.url.replace(M, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var q = /\?/;
            this.url += (q.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      B.prototype.clone = function() {
        return new B(this, { body: this._bodyInit });
      };
      function _(b) {
        var I = new FormData();
        return b.trim().split("&").forEach(function(N) {
          if (N) {
            var M = N.split("="), q = M.shift().replace(/\+/g, " "), D = M.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(q), decodeURIComponent(D));
          }
        }), I;
      }
      function Z(b) {
        var I = new p(), N = b.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(M) {
          return M.indexOf(`
`) === 0 ? M.substr(1, M.length) : M;
        }).forEach(function(M) {
          var q = M.split(":"), D = q.shift().trim();
          if (D) {
            var ae = q.join(":").trim();
            try {
              I.append(D, ae);
            } catch (ie) {
              console.warn("Response " + ie.message);
            }
          }
        }), I;
      }
      U.call(B.prototype);
      function de(b, I) {
        if (!(this instanceof de))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new p(I.headers), this.url = I.url || "", this._initBody(b);
      }
      U.call(de.prototype), de.prototype.clone = function() {
        return new de(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new p(this.headers),
          url: this.url
        });
      }, de.error = function() {
        var b = new de(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var Q = [301, 302, 303, 307, 308];
      de.redirect = function(b, I) {
        if (Q.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new de(null, { status: I, headers: { location: b } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(I, N) {
          this.message = I, this.name = N;
          var M = Error(I);
          this.stack = M.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function Y(b, I) {
        return new Promise(function(N, M) {
          var q = new B(b, I);
          if (q.signal && q.signal.aborted)
            return M(new t.DOMException("Aborted", "AbortError"));
          var D = new XMLHttpRequest();
          function ae() {
            D.abort();
          }
          D.onload = function() {
            var L = {
              statusText: D.statusText,
              headers: Z(D.getAllResponseHeaders() || "")
            };
            q.url.indexOf("file://") === 0 && (D.status < 200 || D.status > 599) ? L.status = 200 : L.status = D.status, L.url = "responseURL" in D ? D.responseURL : L.headers.get("X-Request-URL");
            var O = "response" in D ? D.response : D.responseText;
            setTimeout(function() {
              N(new de(O, L));
            }, 0);
          }, D.onerror = function() {
            setTimeout(function() {
              M(new TypeError("Network request failed"));
            }, 0);
          }, D.ontimeout = function() {
            setTimeout(function() {
              M(new TypeError("Network request timed out"));
            }, 0);
          }, D.onabort = function() {
            setTimeout(function() {
              M(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ie(L) {
            try {
              return L === "" && n.location.href ? n.location.href : L;
            } catch {
              return L;
            }
          }
          if (D.open(q.method, ie(q.url), !0), q.credentials === "include" ? D.withCredentials = !0 : q.credentials === "omit" && (D.withCredentials = !1), "responseType" in D && (r.blob ? D.responseType = "blob" : r.arrayBuffer && (D.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof p || n.Headers && I.headers instanceof n.Headers)) {
            var Ue = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(L) {
              Ue.push(c(L)), D.setRequestHeader(L, l(I.headers[L]));
            }), q.headers.forEach(function(L, O) {
              Ue.indexOf(O) === -1 && D.setRequestHeader(O, L);
            });
          } else
            q.headers.forEach(function(L, O) {
              D.setRequestHeader(O, L);
            });
          q.signal && (q.signal.addEventListener("abort", ae), D.onreadystatechange = function() {
            D.readyState === 4 && q.signal.removeEventListener("abort", ae);
          }), D.send(typeof q._bodyInit > "u" ? null : q._bodyInit);
        });
      }
      return Y.polyfill = !0, n.fetch || (n.fetch = Y, n.Headers = p, n.Request = B, n.Response = de), t.Headers = p, t.Request = B, t.Response = de, t.fetch = Y, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : An);
})();
const hb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function pb(e, t) {
  const n = {};
  return Object.assign(n, hb, t), await fetch(e, n);
}
function gb(e) {
  let t = pb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function yb(...e) {
  const { fetchLib: t, middlewares: n } = gb(e);
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
var bo;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(bo || (bo = {}));
var wi;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(wi || (wi = {}));
var Bh;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Bh || (Bh = {}));
const wb = "https://api.mainnet.hiro.so", mb = "https://api.testnet.hiro.so", bb = "http://localhost:3999", xb = ["mainnet", "testnet", "devnet", "mocknet"];
let xo = class {
  constructor(t) {
    this.version = wi.Mainnet, this.chainId = bo.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === wi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? yb();
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
xo.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Nu();
    case "testnet":
      return new Sb();
    case "devnet":
      return new vb();
    case "mocknet":
      return new Ag();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${xb.join(", ")}`);
  }
};
xo.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : xo.fromName(e);
let Nu = class extends xo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? wb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = wi.Mainnet, this.chainId = bo.Mainnet;
  }
}, Sb = class extends xo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? mb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = wi.Testnet, this.chainId = bo.Testnet;
  }
}, Ag = class extends xo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? bb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = wi.Testnet, this.chainId = bo.Testnet;
  }
};
const vb = Ag, Eg = "xtrata.wallet.bridge.v1", Ab = (e) => typeof e == "object" && e !== null && e.protocol === Eg, Eb = (e) => Ab(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", kb = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class qo extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const Mh = 12e4;
class $b {
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
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !Eb(t.data)) return;
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
    const s = kb(), i = { protocol: Eg, kind: "request", id: s, method: t, params: n };
    return new Promise((o, c) => {
      const l = setTimeout(() => {
        this.pending.delete(s), c(
          new qo(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? Mh}ms.`
          )
        );
      }, this.options.timeoutMs ?? Mh);
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
const Ib = ["SP", "SM"], Lb = ["ST", "SN"], Cb = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return Ib.includes(n) ? "mainnet" : Lb.includes(n) ? "testnet" : null;
}, Tb = () => {
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
}, Bb = () => typeof window > "u" || !window.localStorage ? Tb() : window.localStorage, ql = "xtrata.v15.1.wallet.session", Nh = "mainnet", _c = { isConnected: !1 }, Mb = (e) => e.address ? Cb(e.address) ?? e.network : e.network, kg = (e) => !e.isConnected || !e.address ? { ..._c } : Mb(e) !== Nh ? { ..._c } : {
  isConnected: !0,
  address: e.address,
  network: Nh,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, Nb = (e) => {
  if (!e)
    return { ..._c };
  try {
    const t = JSON.parse(e);
    return kg(t);
  } catch {
    return { ..._c };
  }
}, _b = (e) => {
  const t = kg(e);
  return JSON.stringify(t);
}, Pb = (e) => {
  const t = Bb();
  return {
    load: () => Nb(t.getItem(ql)),
    save: (n) => {
      t.setItem(ql, _b(n));
    },
    clear: () => {
      t.removeItem(ql);
    }
  };
}, Ub = "https://browser.blockstack.org/auth", Hb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, $g = ["store_write"], Ob = "blockstack-session", Db = {
  logLevel: "debug"
}, Ni = {
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
Object.freeze(Ni);
class Ho extends Error {
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
class Fb extends Ho {
  constructor(t, n = "") {
    super({ code: Ni.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class _h extends Ho {
  constructor(t = "") {
    super({ code: Ni.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Fa extends Ho {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: Ni.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Ph extends Ho {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: Ni.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class _u extends Ho {
  constructor(t) {
    super({ code: Ni.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class Ig extends Ho {
  constructor(t) {
    super({ code: Ni.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const Uh = ["debug", "info", "warn", "error", "none"], Pu = {};
for (let e = 0; e < Uh.length; e++) {
  const t = Uh[e];
  Pu[t] = e;
}
class uo {
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
    return Pu[Db.logLevel] <= Pu[t];
  }
}
function jb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Rb() {
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
function zb() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Gb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Kb(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function Rd(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Gb(), s) {
      const i = s[e];
      if (i)
        return i;
    }
  } catch (i) {
    uo.error(`Error getting object '${e}' from global scope '${s}': ${i}`);
  }
  if (t) {
    const i = Kb(s, e.toString(), n);
    throw uo.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Xs(e, t) {
  return zd(gn(e), t);
}
function gn(e) {
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
  if (Bn(e, Uint8Array))
    return BigInt(`0x${Le(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Vb(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Hh(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function $a(e, t = 8) {
  return (typeof e == "bigint" ? e : gn(e)).toString(16).padStart(t * 2, "0");
}
function hl(e) {
  return parseInt(e, 16);
}
function zd(e, t = 16) {
  const n = $a(e, t);
  return ct(n);
}
function Xb(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function Yb(e, t) {
  return e & BigInt(1) << t;
}
function Uu(e) {
  return qb(BigInt(`0x${Le(e)}`), BigInt(e.byteLength * 8));
}
function qb(e, t) {
  return Yb(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const Wb = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Le(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Wb[n];
  return t;
}
function ct(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = Vb(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    t[n] = i;
  }
  return t;
}
function _i(e) {
  return new TextEncoder().encode(e);
}
function Ia(e) {
  return new TextDecoder().decode(e);
}
function Zb(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Jb(e) {
  return String.fromCharCode.apply(null, e);
}
function Qb(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Oh(e) {
  if (e.some(Qb))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Hr(...e) {
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
function zt(e) {
  return Hr(...e.map((t) => typeof t == "number" ? Oh([t]) : t instanceof Array ? Oh(t) : t));
}
function Bn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const Lg = "https://api.mainnet.hiro.so", Cg = "https://api.testnet.hiro.so", Tg = "http://localhost:3999", e1 = "https://hub.blockstack.org", t1 = 33, Zl = 32;
function n1(e) {
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
  const t = typeof e == "string" ? ct(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function r1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function s1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function i1(e, t) {
  return e[t];
}
function o1(e, t, n = 0) {
  return e[n] = t, e;
}
function a1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function mi(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const c1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function l1(e, t) {
  const n = {};
  return Object.assign(n, c1, t), await fetch(e, n);
}
function u1(e) {
  let t = l1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function d1(...e) {
  const { fetchLib: t, middlewares: n } = u1(e);
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
class Bg {
  constructor(t = $g.slice(), n = ((c) => (c = Rd("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", i = void 0, o = Ub) {
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
function f1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Mg(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function h1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Hu(e.outputLen), Hu(e.blockLen);
}
function p1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function g1(e, t) {
  Mg(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ci = {
  number: Hu,
  bool: f1,
  bytes: Mg,
  hash: h1,
  exists: p1,
  output: g1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jl = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), kr = (e, t) => e << 32 - t | e >>> t, y1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!y1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function w1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Kd(e) {
  if (typeof e == "string" && (e = w1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Ng = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Pi(e) {
  const t = (r) => e().update(Kd(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let _g = class extends Ng {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, ci.hash(t);
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
    return ci.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    ci.exists(this), ci.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const pl = (e, t, n) => new _g(e, t).update(n).digest();
pl.create = (e, t) => new _g(e, t);
function m1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + d, c, r);
}
let Vd = class extends Ng {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Jl(this.buffer);
  }
  update(t) {
    ci.exists(this);
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
    ci.exists(this), ci.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    m1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Jl(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = l / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      c.setUint32(4 * u, p[u], i);
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
const b1 = (e, t, n) => e & t ^ ~e & n, x1 = (e, t, n) => e & t ^ e & n ^ t & n, S1 = new Uint32Array([
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
let Pg = class extends Vd {
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
    for (let u = 0; u < 16; u++, n += 4)
      ws[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = ws[u - 15], y = ws[u - 2], S = kr(w, 7) ^ kr(w, 18) ^ w >>> 3, v = kr(y, 17) ^ kr(y, 19) ^ y >>> 10;
      ws[u] = v + ws[u - 7] + S + ws[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = kr(c, 6) ^ kr(c, 11) ^ kr(c, 25), y = p + w + b1(c, l, d) + S1[u] + ws[u] | 0, v = (kr(r, 2) ^ kr(r, 13) ^ kr(r, 22)) + x1(r, s, i) | 0;
      p = d, d = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, d, p);
  }
  roundClean() {
    ws.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, v1 = class extends Pg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const So = Pi(() => new Pg());
Pi(() => new v1());
const A1 = {}, Ug = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: A1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const tt = BigInt(0), Lt = BigInt(1), Rs = BigInt(2), oa = BigInt(3), Dh = BigInt(8), mt = Object.freeze({
  a: tt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Lt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Fh = (e, t) => (e + t / Rs) / t, ja = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = mt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Lt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), c = Fh(i * e, t), l = Fh(-r * e, t);
    let d = pe(e - c * n - l * s, t), p = pe(-c * r - l * i, t);
    const u = d > o, w = p > o;
    if (u && (d = t - d), w && (p = t - p), d > o || p > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: u, k1: d, k2neg: w, k2: p };
  }
}, wr = 32, bi = 32, Hg = 32, Pc = wr + 1, Uc = 2 * wr + 1;
function jh(e) {
  const { a: t, b: n } = mt, r = pe(e * e), s = pe(r * e);
  return pe(s + t * e + n);
}
const Ra = mt.a === tt;
class Xd extends Error {
  constructor(t) {
    super(t);
  }
}
function Rh(e) {
  if (!(e instanceof ft))
    throw new TypeError("JacobianPoint expected");
}
class ft {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof qe))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(qe.ZERO) ? ft.ZERO : new ft(t.x, t.y, Lt);
  }
  static toAffineBatch(t) {
    const n = L1(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return ft.toAffineBatch(t).map(ft.fromAffine);
  }
  equals(t) {
    Rh(t);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = t, l = pe(s * s), d = pe(c * c), p = pe(n * d), u = pe(i * l), w = pe(pe(r * c) * d), y = pe(pe(o * s) * l);
    return p === u && w === y;
  }
  negate() {
    return new ft(this.x, pe(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = pe(t * t), i = pe(n * n), o = pe(i * i), c = t + i, l = pe(Rs * (pe(c * c) - s - o)), d = pe(oa * s), p = pe(d * d), u = pe(p - Rs * l), w = pe(d * (l - u) - Dh * o), y = pe(Rs * n * r);
    return new ft(u, w, y);
  }
  add(t) {
    Rh(t);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = t;
    if (i === tt || o === tt)
      return this;
    if (n === tt || r === tt)
      return t;
    const l = pe(s * s), d = pe(c * c), p = pe(n * d), u = pe(i * l), w = pe(pe(r * c) * d), y = pe(pe(o * s) * l), S = pe(u - p), v = pe(y - w);
    if (S === tt)
      return v === tt ? this.double() : ft.ZERO;
    const T = pe(S * S), U = pe(S * T), H = pe(p * T), E = pe(v * v - U - Rs * H), B = pe(v * (H - E) - w * U), _ = pe(s * c * S);
    return new ft(E, B, _);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = ft.ZERO;
    if (typeof t == "bigint" && t === tt)
      return n;
    let r = Kh(t);
    if (r === Lt)
      return this;
    if (!Ra) {
      let u = n, w = this;
      for (; r > tt; )
        r & Lt && (u = u.add(w)), w = w.double(), r >>= Lt;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: c } = ja.splitScalar(r), l = n, d = n, p = this;
    for (; i > tt || c > tt; )
      i & Lt && (l = l.add(p)), c & Lt && (d = d.add(p)), p = p.double(), i >>= Lt, c >>= Lt;
    return s && (l = l.negate()), o && (d = d.negate()), d = new ft(pe(d.x * ja.beta), d.y, d.z), l.add(d);
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
    !n && this.equals(ft.BASE) && (n = qe.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ou.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ft.normalizeZ(s), Ou.set(n, s)));
    let i = ft.ZERO, o = ft.BASE;
    const c = 1 + (Ra ? 128 / r : 256 / r), l = 2 ** (r - 1), d = BigInt(2 ** r - 1), p = 2 ** r, u = BigInt(r);
    for (let w = 0; w < c; w++) {
      const y = w * l;
      let S = Number(t & d);
      t >>= u, S > l && (S -= p, t += Lt);
      const v = y, T = y + Math.abs(S) - 1, U = w % 2 !== 0, H = S < 0;
      S === 0 ? o = o.add(za(U, s[v])) : i = i.add(za(H, s[T]));
    }
    return { p: i, f: o };
  }
  multiply(t, n) {
    let r = Kh(t), s, i;
    if (Ra) {
      const { k1neg: o, k1: c, k2neg: l, k2: d } = ja.splitScalar(r);
      let { p, f: u } = this.wNAF(c, n), { p: w, f: y } = this.wNAF(d, n);
      p = za(o, p), w = za(l, w), w = new ft(pe(w.x * ja.beta), w.y, w.z), s = p.add(w), i = u.add(y);
    } else {
      const { p: o, f: c } = this.wNAF(r, n);
      s = o, i = c;
    }
    return ft.normalizeZ([s, i])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, i = this.equals(ft.ZERO);
    t == null && (t = i ? Dh : Oo(s));
    const o = t, c = pe(o * o), l = pe(c * o), d = pe(n * c), p = pe(r * l), u = pe(s * o);
    if (i)
      return qe.ZERO;
    if (u !== Lt)
      throw new Error("invZ was invalid");
    return new qe(d, p);
  }
}
ft.BASE = new ft(mt.Gx, mt.Gy, Lt);
ft.ZERO = new ft(tt, Lt, tt);
function za(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Ou = /* @__PURE__ */ new WeakMap();
class qe {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Ou.delete(this);
  }
  hasEvenY() {
    return this.y % Rs === tt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = Kn(n ? t : t.subarray(1));
    if (!Ac(r))
      throw new Error("Point is not on curve");
    const s = jh(r);
    let i = I1(s);
    const o = (i & Lt) === Lt;
    n ? o && (i = pe(-i)) : (t[0] & 1) === 1 !== o && (i = pe(-i));
    const c = new qe(r, i);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(t) {
    const n = Kn(t.subarray(1, wr + 1)), r = Kn(t.subarray(wr + 1, wr * 2 + 1)), s = new qe(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = Or(t), r = n.length, s = n[0];
    if (r === wr)
      return this.fromCompressedHex(n);
    if (r === Pc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Uc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Pc} compressed bytes or ${Uc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return qe.BASE.multiply(xi(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: i } = Fg(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Yd(Or(t)), { n: c } = mt, l = r === 2 || r === 3 ? s + c : s, d = Oo(l, c), p = pe(-o * d, c), u = pe(i * d, c), w = r & 1 ? "03" : "02", y = qe.fromHex(w + zs(l)), S = qe.BASE.multiplyAndAddUnsafe(y, p, u);
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
    const s = pe(r * r), i = jh(n);
    if (pe(s - i) !== tt)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new qe(this.x, pe(-this.y));
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
    const s = ft.fromAffine(this), i = n === tt || n === Lt || this !== qe.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ft.fromAffine(t).multiplyUnsafe(r), c = i.add(o);
    return c.equals(ft.ZERO) ? void 0 : c.toAffine();
  }
}
qe.BASE = new qe(mt.Gx, mt.Gy);
qe.ZERO = new qe(tt, tt);
function zh(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Gh(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${vo(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Kn(n), left: e.subarray(t + 2) };
}
function E1(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${vo(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Gh(e.subarray(2)), { data: r, left: s } = Gh(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${vo(s)}`);
  return { r: t, s: r };
}
class Gn {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? vo(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Gn(Hc(s.slice(0, 64)), Hc(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = E1(n ? t : Gs(t));
    return new Gn(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Eo(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Eo(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = mt.n >> Lt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new Gn(this.r, pe(-this.s, mt.n)) : this;
  }
  toDERRawBytes() {
    return Gs(this.toDERHex());
  }
  toDERHex() {
    const t = zh(Wo(this.s)), n = zh(Wo(this.r)), r = t.length / 2, s = n.length / 2, i = Wo(r), o = Wo(s);
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
const k1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function vo(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += k1[e[n]];
  return t;
}
const $1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function zs(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(tt <= e && e < $1))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Ao(e) {
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
function Kn(e) {
  return Hc(vo(e));
}
function Or(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Gs(e);
}
function Kh(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Eo(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function pe(e, t = mt.P) {
  const n = e % t;
  return n >= tt ? n : t + n;
}
function Jn(e, t) {
  const { P: n } = mt;
  let r = e;
  for (; t-- > tt; )
    r *= r, r %= n;
  return r;
}
function I1(e) {
  const { P: t } = mt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), c = BigInt(88), l = e * e * e % t, d = l * l * e % t, p = Jn(d, oa) * d % t, u = Jn(p, oa) * d % t, w = Jn(u, Rs) * l % t, y = Jn(w, r) * w % t, S = Jn(y, s) * y % t, v = Jn(S, o) * S % t, T = Jn(v, c) * v % t, U = Jn(T, o) * S % t, H = Jn(U, oa) * d % t, E = Jn(H, i) * y % t, B = Jn(E, n) * l % t, _ = Jn(B, Rs);
  if (_ * _ % t !== e)
    throw new Error("Cannot find square root");
  return _;
}
function Oo(e, t = mt.P) {
  if (e === tt || t <= tt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = pe(e, t), r = t, s = tt, i = Lt;
  for (; n !== tt; ) {
    const c = r / n, l = r % n, d = s - i * c;
    r = n, n = l, s = i, i = d;
  }
  if (r !== Lt)
    throw new Error("invert: does not exist");
  return pe(s, t);
}
function L1(e, t = mt.P) {
  const n = new Array(e.length), r = e.reduce((i, o, c) => o === tt ? i : (n[c] = i, pe(i * o, t)), Lt), s = Oo(r, t);
  return e.reduceRight((i, o, c) => o === tt ? i : (n[c] = pe(i * n[c], t), pe(i * o, t)), s), n;
}
function C1(e) {
  const t = e.length * 8 - bi * 8, n = Kn(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function Yd(e, t = !1) {
  const n = C1(e);
  if (t)
    return n;
  const { n: r } = mt;
  return n >= r ? n - r : n;
}
let wo, aa;
class Og {
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
function Eo(e) {
  return tt < e && e < mt.n;
}
function Ac(e) {
  return tt < e && e < mt.P;
}
function Dg(e, t, n, r = !0) {
  const { n: s } = mt, i = Yd(e, !0);
  if (!Eo(i))
    return;
  const o = Oo(i, s), c = qe.BASE.multiply(i), l = pe(c.x, s);
  if (l === tt)
    return;
  const d = pe(o * pe(t + n * l, s), s);
  if (d === tt)
    return;
  let p = new Gn(l, d), u = (c.x === p.r ? 0 : 2) | Number(c.y & Lt);
  return r && p.hasHighS() && (p = p.normalizeS(), u ^= 1), { sig: p, recovery: u };
}
function xi(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * bi)
      throw new Error("Expected 32 bytes of private key");
    t = Hc(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== bi)
      throw new Error("Expected 32 bytes of private key");
    t = Kn(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Eo(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function qd(e) {
  return e instanceof qe ? (e.assertValidity(), e) : qe.fromHex(e);
}
function Fg(e) {
  if (e instanceof Gn)
    return e.assertValidity(), e;
  try {
    return Gn.fromDER(e);
  } catch {
    return Gn.fromCompact(e);
  }
}
function La(e, t = !1) {
  return qe.fromPrivateKey(e).toRawBytes(t);
}
function T1(e, t, n, r = !1) {
  return qe.fromSignature(e, t, n).toRawBytes(r);
}
function Vh(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === Pc || r === Uc : n ? r === Pc * 2 || r === Uc * 2 : e instanceof qe;
}
function Wd(e, t, n = !1) {
  if (Vh(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Vh(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = qd(t);
  return r.assertValidity(), r.multiply(xi(e)).toRawBytes(n);
}
function jg(e) {
  const t = e.length > wr ? e.slice(0, wr) : e;
  return Kn(t);
}
function B1(e) {
  const t = jg(e), n = pe(t, mt.n);
  return Rg(n < tt ? t : n);
}
function Rg(e) {
  return Ao(e);
}
function zg(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = Or(e), s = xi(t), i = [Rg(s), B1(r)];
  if (n != null) {
    n === !0 && (n = Ft.randomBytes(wr));
    const l = Or(n);
    if (l.length !== wr)
      throw new Error(`sign: Expected ${wr} bytes of extra data`);
    i.push(l);
  }
  const o = Fs(...i), c = jg(r);
  return { seed: o, m: c, d: s };
}
function Gg(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, t), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function M1(e, t, n = {}) {
  const { seed: r, m: s, d: i } = zg(e, t, n.extraEntropy), o = new Og(Hg, bi);
  await o.reseed(r);
  let c;
  for (; !(c = Dg(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Gg(c, n);
}
function gl(e, t, n = {}) {
  const { seed: r, m: s, d: i } = zg(e, t, n.extraEntropy), o = new Og(Hg, bi);
  o.reseedSync(r);
  let c;
  for (; !(c = Dg(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Gg(c, n);
}
const N1 = { strict: !0 };
function _1(e, t, n, r = N1) {
  let s;
  try {
    s = Fg(e), t = Or(t);
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
  const { n: d } = mt, p = Oo(o, d), u = pe(c * p, d), w = pe(i * p, d), y = qe.BASE.multiplyAndAddUnsafe(l, u, w);
  return y ? pe(y.x, d) === i : !1;
}
function Oc(e) {
  return pe(Kn(e), mt.n);
}
class ko {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = Or(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Kn(n.subarray(0, 32)), s = Kn(n.subarray(32, 64));
    return new ko(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Ac(t) || !Eo(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return zs(this.r) + zs(this.s);
  }
  toRawBytes() {
    return Gs(this.toHex());
  }
}
function P1(e) {
  return qe.fromPrivateKey(e).toRawX();
}
class Kg {
  constructor(t, n, r = Ft.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = Or(t);
    const { x: s, scalar: i } = this.getScalar(xi(n));
    if (this.px = s, this.d = i, this.rand = Or(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = qe.fromPrivateKey(t), r = n.hasEvenY() ? t : mt.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Ao(t ^ Kn(n));
  }
  finalizeNonce(t) {
    const n = pe(Kn(t), mt.n);
    if (n === tt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(t, n, r, s) {
    return new ko(t.x, pe(n + r * s, mt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, i = Ft.taggedHash, o = this.initNonce(n, await i(Ds.aux, s)), { R: c, rx: l, k: d } = this.finalizeNonce(await i(Ds.nonce, o, r, t)), p = Oc(await i(Ds.challenge, l, r, t)), u = this.finalizeSig(c, d, p, n);
    return await Yg(u, t, r) || this.error(), u;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, i = Ft.taggedHashSync, o = this.initNonce(n, i(Ds.aux, s)), { R: c, rx: l, k: d } = this.finalizeNonce(i(Ds.nonce, o, r, t)), p = Oc(i(Ds.challenge, l, r, t)), u = this.finalizeSig(c, d, p, n);
    return qg(u, t, r) || this.error(), u;
  }
}
async function U1(e, t, n) {
  return new Kg(e, t, n).calc();
}
function H1(e, t, n) {
  return new Kg(e, t, n).calcSync();
}
function Vg(e, t, n) {
  const r = e instanceof ko, s = r ? e : ko.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: Or(t),
    P: qd(n)
  };
}
function Xg(e, t, n, r) {
  const s = qe.BASE.multiplyAndAddUnsafe(t, xi(n), pe(-r, mt.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function Yg(e, t, n) {
  try {
    const { r, s, m: i, P: o } = Vg(e, t, n), c = Oc(await Ft.taggedHash(Ds.challenge, Ao(r), o.toRawX(), i));
    return Xg(r, o, s, c);
  } catch {
    return !1;
  }
}
function qg(e, t, n) {
  try {
    const { r, s, m: i, P: o } = Vg(e, t, n), c = Oc(Ft.taggedHashSync(Ds.challenge, Ao(r), o.toRawX(), i));
    return Xg(r, o, s, c);
  } catch (r) {
    if (r instanceof Xd)
      throw r;
    return !1;
  }
}
const O1 = {
  Signature: ko,
  getPublicKey: P1,
  sign: U1,
  verify: Yg,
  signSync: H1,
  verifySync: qg
};
qe.BASE._setWindowSize(8);
const On = {
  node: Ug,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ds = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ga = {}, Ft = {
  bytesToHex: vo,
  hexToBytes: Gs,
  concatBytes: Fs,
  mod: pe,
  invert: Oo,
  isValidPrivateKey(e) {
    try {
      return xi(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ao,
  _normalizePrivateKey: xi,
  hashToPrivateKey: (e) => {
    e = Or(e);
    const t = bi + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = pe(Kn(e), mt.n - Lt) + Lt;
    return Ao(n);
  },
  randomBytes: (e = 32) => {
    if (On.web)
      return On.web.getRandomValues(new Uint8Array(e));
    if (On.node) {
      const { randomBytes: t } = On.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ft.hashToPrivateKey(Ft.randomBytes(bi + 8)),
  precompute(e = 8, t = qe.BASE) {
    const n = t === qe.BASE ? t : new qe(t.x, t.y);
    return n._setWindowSize(e), n.multiply(oa), n;
  },
  sha256: async (...e) => {
    if (On.web) {
      const t = await On.web.subtle.digest("SHA-256", Fs(...e));
      return new Uint8Array(t);
    } else if (On.node) {
      const { createHash: t } = On.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (On.web) {
      const n = await On.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Fs(...t), s = await On.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (On.node) {
      const { createHmac: n } = On.node, r = n("sha256", e);
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
    if (typeof wo != "function")
      throw new Xd("sha256Sync is undefined, you need to set it");
    let n = Ga[e];
    if (n === void 0) {
      const r = wo(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Fs(r, r), Ga[e] = n;
    }
    return wo(n, ...t);
  },
  _JacobianPoint: ft
};
Object.defineProperties(Ft, {
  sha256Sync: {
    configurable: !1,
    get() {
      return wo;
    },
    set(e) {
      wo || (wo = e);
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
const D1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: mt,
  Point: qe,
  Signature: Gn,
  getPublicKey: La,
  getSharedSecret: Wd,
  recoverPublicKey: T1,
  schnorr: O1,
  sign: M1,
  signSync: gl,
  utils: Ft,
  verify: _1
}, Symbol.toStringTag, { value: "Module" }));
var Ca = {};
Ca.byteLength = G1;
var F1 = Ca.toByteArray = V1, j1 = Ca.fromByteArray = q1, Br = [], nr = [], R1 = typeof Uint8Array < "u" ? Uint8Array : Array, Ql = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var no = 0, z1 = Ql.length; no < z1; ++no)
  Br[no] = Ql[no], nr[Ql.charCodeAt(no)] = no;
nr[45] = 62;
nr[95] = 63;
function Wg(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function G1(e) {
  var t = Wg(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function K1(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function V1(e) {
  var t, n = Wg(e), r = n[0], s = n[1], i = new R1(K1(e, r, s)), o = 0, c = s > 0 ? r - 4 : r, l;
  for (l = 0; l < c; l += 4)
    t = nr[e.charCodeAt(l)] << 18 | nr[e.charCodeAt(l + 1)] << 12 | nr[e.charCodeAt(l + 2)] << 6 | nr[e.charCodeAt(l + 3)], i[o++] = t >> 16 & 255, i[o++] = t >> 8 & 255, i[o++] = t & 255;
  return s === 2 && (t = nr[e.charCodeAt(l)] << 2 | nr[e.charCodeAt(l + 1)] >> 4, i[o++] = t & 255), s === 1 && (t = nr[e.charCodeAt(l)] << 10 | nr[e.charCodeAt(l + 1)] << 4 | nr[e.charCodeAt(l + 2)] >> 2, i[o++] = t >> 8 & 255, i[o++] = t & 255), i;
}
function X1(e) {
  return Br[e >> 18 & 63] + Br[e >> 12 & 63] + Br[e >> 6 & 63] + Br[e & 63];
}
function Y1(e, t, n) {
  for (var r, s = [], i = t; i < n; i += 3)
    r = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (e[i + 2] & 255), s.push(X1(r));
  return s.join("");
}
function q1(e) {
  for (var t, n = e.length, r = n % 3, s = [], i = 16383, o = 0, c = n - r; o < c; o += i)
    s.push(Y1(e, o, o + i > c ? c : o + i));
  return r === 1 ? (t = e[n - 1], s.push(
    Br[t >> 2] + Br[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    Br[t >> 10] + Br[t >> 4 & 63] + Br[t << 2 & 63] + "="
  )), s.join("");
}
function W1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Z1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function J1() {
  if (W1())
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
    throw new Error(Z1);
  }
}
class Q1 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const i = this.createCipher(t, n, r), o = new Uint8Array(Hr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const i = this.createDecipher(t, n, r), o = new Uint8Array(Hr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class e2 {
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
async function Zg() {
  const e = await J1();
  return e.name === "subtleCrypto" ? new e2(e.lib) : new Q1(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function t2(e) {
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
  var o = e.length, c = e.charAt(0), l = Math.log(o) / Math.log(256), d = Math.log(256) / Math.log(o);
  function p(y) {
    if (y instanceof Uint8Array || (ArrayBuffer.isView(y) ? y = new Uint8Array(y.buffer, y.byteOffset, y.byteLength) : Array.isArray(y) && (y = Uint8Array.from(y))), !(y instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (y.length === 0)
      return "";
    for (var S = 0, v = 0, T = 0, U = y.length; T !== U && y[T] === 0; )
      T++, S++;
    for (var H = (U - T) * d + 1 >>> 0, E = new Uint8Array(H); T !== U; ) {
      for (var B = y[T], _ = 0, Z = H - 1; (B !== 0 || _ < v) && Z !== -1; Z--, _++)
        B += 256 * E[Z] >>> 0, E[Z] = B % o >>> 0, B = B / o >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      v = _, T++;
    }
    for (var de = H - v; de !== H && E[de] === 0; )
      de++;
    for (var Q = c.repeat(S); de < H; ++de)
      Q += e.charAt(E[de]);
    return Q;
  }
  function u(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var S = 0, v = 0, T = 0; y[S] === c; )
      v++, S++;
    for (var U = (y.length - S) * l + 1 >>> 0, H = new Uint8Array(U); y[S]; ) {
      var E = y.charCodeAt(S);
      if (E > 255)
        return;
      var B = t[E];
      if (B === 255)
        return;
      for (var _ = 0, Z = U - 1; (B !== 0 || _ < T) && Z !== -1; Z--, _++)
        B += o * H[Z] >>> 0, H[Z] = B % 256 >>> 0, B = B / 256 >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      T = _, S++;
    }
    for (var de = U - T; de !== U && H[de] === 0; )
      de++;
    for (var Q = new Uint8Array(v + (U - de)), Y = v; de !== U; )
      Q[Y++] = H[de++];
    return Q;
  }
  function w(y) {
    var S = u(y);
    if (S)
      return S;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: p,
    decodeUnsafe: u,
    decode: w
  };
}
var Jg = t2;
const n2 = Jg, r2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var s2 = n2(r2);
const i2 = /* @__PURE__ */ vg(s2), o2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Qg = Uint8Array.from({ length: 16 }, (e, t) => t), a2 = Qg.map((e) => (9 * e + 5) % 16);
let Zd = [Qg], Jd = [a2];
for (let e = 0; e < 4; e++)
  for (let t of [Zd, Jd])
    t.push(t[e].map((n) => o2[n]));
const ey = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), c2 = Zd.map((e, t) => e.map((n) => ey[t][n])), l2 = Jd.map((e, t) => e.map((n) => ey[t][n])), u2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), d2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ka = (e, t) => e << t | e >>> 32 - t;
function Xh(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Va = new Uint32Array(16);
let f2 = class extends Vd {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, l = c, d = this.h3 | 0, p = d, u = this.h4 | 0, w = u;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, v = u2[y], T = d2[y], U = Zd[y], H = Jd[y], E = c2[y], B = l2[y];
      for (let _ = 0; _ < 16; _++) {
        const Z = Ka(r + Xh(y, i, c, d) + Va[U[_]] + v, E[_]) + u | 0;
        r = u, u = d, d = Ka(c, 10) | 0, c = i, i = Z;
      }
      for (let _ = 0; _ < 16; _++) {
        const Z = Ka(s + Xh(S, o, l, p) + Va[H[_]] + T, B[_]) + w | 0;
        s = w, w = p, p = Ka(l, 10) | 0, l = o, o = Z;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    Va.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const h2 = Pi(() => new f2());
function p2(e) {
  return h2(e);
}
const Xa = BigInt(2 ** 32 - 1), Du = BigInt(32);
function ty(e, t = !1) {
  return t ? { h: Number(e & Xa), l: Number(e >> Du & Xa) } : { h: Number(e >> Du & Xa) | 0, l: Number(e & Xa) | 0 };
}
function g2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = ty(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const y2 = (e, t) => BigInt(e >>> 0) << Du | BigInt(t >>> 0), w2 = (e, t, n) => e >>> n, m2 = (e, t, n) => e << 32 - n | t >>> n, b2 = (e, t, n) => e >>> n | t << 32 - n, x2 = (e, t, n) => e << 32 - n | t >>> n, S2 = (e, t, n) => e << 64 - n | t >>> n - 32, v2 = (e, t, n) => e >>> n - 32 | t << 64 - n, A2 = (e, t) => t, E2 = (e, t) => e, k2 = (e, t, n) => e << n | t >>> 32 - n, $2 = (e, t, n) => t << n | e >>> 32 - n, I2 = (e, t, n) => t << n - 32 | e >>> 64 - n, L2 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function C2(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const T2 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), B2 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, M2 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), N2 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, _2 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), P2 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, je = {
  fromBig: ty,
  split: g2,
  toBig: y2,
  shrSH: w2,
  shrSL: m2,
  rotrSH: b2,
  rotrSL: x2,
  rotrBH: S2,
  rotrBL: v2,
  rotr32H: A2,
  rotr32L: E2,
  rotlSH: k2,
  rotlSL: $2,
  rotlBH: I2,
  rotlBL: L2,
  add: C2,
  add3L: T2,
  add3H: B2,
  add4L: M2,
  add4H: N2,
  add5H: P2,
  add5L: _2
}, [U2, H2] = je.split([
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
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: l, Eh: d, El: p, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: T } = this;
    return [t, n, r, s, i, o, c, l, d, p, u, w, y, S, v, T];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l, d, p, u, w, y, S, v, T) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      ms[E] = t.getUint32(n), bs[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const B = ms[E - 15] | 0, _ = bs[E - 15] | 0, Z = je.rotrSH(B, _, 1) ^ je.rotrSH(B, _, 8) ^ je.shrSH(B, _, 7), de = je.rotrSL(B, _, 1) ^ je.rotrSL(B, _, 8) ^ je.shrSL(B, _, 7), Q = ms[E - 2] | 0, Y = bs[E - 2] | 0, b = je.rotrSH(Q, Y, 19) ^ je.rotrBH(Q, Y, 61) ^ je.shrSH(Q, Y, 6), I = je.rotrSL(Q, Y, 19) ^ je.rotrBL(Q, Y, 61) ^ je.shrSL(Q, Y, 6), N = je.add4L(de, I, bs[E - 7], bs[E - 16]), M = je.add4H(N, Z, b, ms[E - 7], ms[E - 16]);
      ms[E] = M | 0, bs[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: l, Dh: d, Dl: p, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: T, Hh: U, Hl: H } = this;
    for (let E = 0; E < 80; E++) {
      const B = je.rotrSH(u, w, 14) ^ je.rotrSH(u, w, 18) ^ je.rotrBH(u, w, 41), _ = je.rotrSL(u, w, 14) ^ je.rotrSL(u, w, 18) ^ je.rotrBL(u, w, 41), Z = u & y ^ ~u & v, de = w & S ^ ~w & T, Q = je.add5L(H, _, de, H2[E], bs[E]), Y = je.add5H(Q, U, B, Z, U2[E], ms[E]), b = Q | 0, I = je.rotrSH(r, s, 28) ^ je.rotrBH(r, s, 34) ^ je.rotrBH(r, s, 39), N = je.rotrSL(r, s, 28) ^ je.rotrBL(r, s, 34) ^ je.rotrBL(r, s, 39), M = r & i ^ r & c ^ i & c, q = s & o ^ s & l ^ o & l;
      U = v | 0, H = T | 0, v = y | 0, T = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = je.add(d | 0, p | 0, Y | 0, b | 0), d = c | 0, p = l | 0, c = i | 0, l = o | 0, i = r | 0, o = s | 0;
      const D = je.add3L(b, N, q);
      r = je.add3H(D, Y, I, M), s = D | 0;
    }
    ({ h: r, l: s } = je.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = je.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l } = je.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: d, l: p } = je.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h: u, l: w } = je.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = je.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: T } = je.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: H } = je.add(this.Hh | 0, this.Hl | 0, U | 0, H | 0), this.set(r, s, i, o, c, l, d, p, u, w, y, S, v, T, U, H);
  }
  roundClean() {
    ms.fill(0), bs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, O2 = class extends yl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, D2 = class extends yl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, F2 = class extends yl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const j2 = Pi(() => new yl());
Pi(() => new O2());
Pi(() => new D2());
Pi(() => new F2());
function ny(e) {
  return So(e);
}
function R2(e) {
  return j2(e);
}
const z2 = 0;
Ft.hmacSha256Sync = (e, ...t) => {
  const n = pl.create(So, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function G2() {
  return Le(Ft.randomPrivateKey());
}
function K2(e) {
  const t = So(So(e));
  return i2.encode(Hr(e, t).slice(0, e.length + 4));
}
function V2(e, t) {
  return K2(Hr(new Uint8Array([e]), t.slice(0, 20)));
}
function ry(e, t = z2) {
  const n = typeof e == "string" ? ct(e) : e, r = p2(ny(n));
  return V2(t, r);
}
function sy(e) {
  const t = Gd(e);
  return Le(La(t.slice(0, 32), !0));
}
Ft.hmacSha256Sync = (e, ...t) => {
  const n = pl.create(So, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var Dc;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(Dc || (Dc = {}));
async function X2(e, t, n) {
  return await (await Zg()).encrypt("aes-256-cbc", t, e, n);
}
async function Y2(e, t, n) {
  return await (await Zg()).decrypt("aes-256-cbc", t, e, n);
}
function iy(e, t) {
  return pl(So, e, t);
}
function q2(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function oy(e) {
  const t = R2(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function W2(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function Z2(e) {
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
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !W2(e))
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
async function J2(e, t, n, r) {
  const s = Z2(e);
  if (!s.result)
    throw s;
  const i = Ft.randomPrivateKey(), o = La(i, !0);
  let c = Wd(i, e, !0);
  c = c.slice(1);
  const l = oy(c), d = Ft.randomBytes(16), p = await X2(d, l.encryptionKey, t), u = Hr(d, o, p), w = iy(l.hmacKey, u);
  let y;
  if (!r || r === "hex")
    y = Le(p);
  else if (r === "base64")
    y = j1(p);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: Le(d),
    ephemeralPK: Le(o),
    cipherText: y,
    mac: Le(w),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function ay(e, t) {
  if (!t.ephemeralPK)
    throw new Ph("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = Wd(e, n, !0);
  r = r.slice(1);
  const s = oy(r), i = ct(t.iv);
  let o;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    o = ct(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    o = F1(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const c = Hr(i, ct(n), o), l = iy(s.hmacKey, c), d = ct(t.mac);
  if (!q2(d, l))
    throw new Ph("Decryption failed: failure in MAC check");
  const p = await Y2(i, s.encryptionKey, o);
  return t.wasString ? Ia(p) : p;
}
function Q2(e, t) {
  const n = typeof t == "string" ? _i(t) : t, r = sy(e), s = ny(n), i = gl(s, e);
  return {
    signature: Le(i),
    publicKey: r
  };
}
async function ex(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = sy(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", i = typeof e == "string" ? _i(e) : e, o = await J2(n.publicKey, i, s, n.cipherTextEncoding);
  let c = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const l = Q2(r, c), d = {
      signature: l.signature,
      publicKey: l.publicKey,
      cipherText: c
    };
    c = JSON.stringify(d);
  }
  return c;
}
function tx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return ay(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var un = {}, $o = {}, Sn = {};
Object.defineProperty(Sn, "__esModule", { value: !0 });
Sn.decode = Sn.encode = Sn.unescape = Sn.escape = Sn.pad = void 0;
const cy = Ca;
function Qd(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Sn.pad = Qd;
function ly(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Sn.escape = ly;
function uy(e) {
  return Qd(e).replace(/-/g, "+").replace(/_/g, "/");
}
Sn.unescape = uy;
function nx(e) {
  return ly((0, cy.fromByteArray)(new TextEncoder().encode(e)));
}
Sn.encode = nx;
function rx(e) {
  return new TextDecoder().decode((0, cy.toByteArray)(Qd(uy(e))));
}
Sn.decode = rx;
var wl = {}, ml = {}, dy = {}, fy = {}, bl = {};
Object.defineProperty(bl, "__esModule", { value: !0 });
bl.crypto = void 0;
bl.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = i, e.aexists = o, e.aoutput = c, e.u8 = l, e.u32 = d, e.clean = p, e.createView = u, e.rotr = w, e.rotl = y, e.byteSwap = S, e.byteSwap32 = v, e.bytesToHex = H, e.hexToBytes = _, e.asyncLoop = de, e.utf8ToBytes = Q, e.bytesToUtf8 = Y, e.toBytes = b, e.kdfInputToBytes = I, e.concatBytes = N, e.checkOpts = M, e.createHasher = D, e.createOptHasher = ae, e.createXOFer = ie, e.randomBytes = Ue;
  const t = bl;
  function n(L) {
    return L instanceof Uint8Array || ArrayBuffer.isView(L) && L.constructor.name === "Uint8Array";
  }
  function r(L) {
    if (!Number.isSafeInteger(L) || L < 0)
      throw new Error("positive integer expected, got " + L);
  }
  function s(L, ...O) {
    if (!n(L))
      throw new Error("Uint8Array expected");
    if (O.length > 0 && !O.includes(L.length))
      throw new Error("Uint8Array expected of length " + O + ", got length=" + L.length);
  }
  function i(L) {
    if (typeof L != "function" || typeof L.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(L.outputLen), r(L.blockLen);
  }
  function o(L, O = !0) {
    if (L.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (O && L.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function c(L, O) {
    s(L);
    const le = O.outputLen;
    if (L.length < le)
      throw new Error("digestInto() expects output buffer of length at least " + le);
  }
  function l(L) {
    return new Uint8Array(L.buffer, L.byteOffset, L.byteLength);
  }
  function d(L) {
    return new Uint32Array(L.buffer, L.byteOffset, Math.floor(L.byteLength / 4));
  }
  function p(...L) {
    for (let O = 0; O < L.length; O++)
      L[O].fill(0);
  }
  function u(L) {
    return new DataView(L.buffer, L.byteOffset, L.byteLength);
  }
  function w(L, O) {
    return L << 32 - O | L >>> O;
  }
  function y(L, O) {
    return L << O | L >>> 32 - O >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function S(L) {
    return L << 24 & 4278190080 | L << 8 & 16711680 | L >>> 8 & 65280 | L >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (L) => L : (L) => S(L), e.byteSwapIfBE = e.swap8IfBE;
  function v(L) {
    for (let O = 0; O < L.length; O++)
      L[O] = S(L[O]);
    return L;
  }
  e.swap32IfBE = e.isLE ? (L) => L : v;
  const T = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, (L, O) => O.toString(16).padStart(2, "0"));
  function H(L) {
    if (s(L), T)
      return L.toHex();
    let O = "";
    for (let le = 0; le < L.length; le++)
      O += U[L[le]];
    return O;
  }
  const E = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function B(L) {
    if (L >= E._0 && L <= E._9)
      return L - E._0;
    if (L >= E.A && L <= E.F)
      return L - (E.A - 10);
    if (L >= E.a && L <= E.f)
      return L - (E.a - 10);
  }
  function _(L) {
    if (typeof L != "string")
      throw new Error("hex string expected, got " + typeof L);
    if (T)
      return Uint8Array.fromHex(L);
    const O = L.length, le = O / 2;
    if (O % 2)
      throw new Error("hex string expected, got unpadded hex of length " + O);
    const me = new Uint8Array(le);
    for (let Ce = 0, Te = 0; Ce < le; Ce++, Te += 2) {
      const _t = B(L.charCodeAt(Te)), Me = B(L.charCodeAt(Te + 1));
      if (_t === void 0 || Me === void 0) {
        const $e = L[Te] + L[Te + 1];
        throw new Error('hex string expected, got non-hex character "' + $e + '" at index ' + Te);
      }
      me[Ce] = _t * 16 + Me;
    }
    return me;
  }
  const Z = async () => {
  };
  e.nextTick = Z;
  async function de(L, O, le) {
    let me = Date.now();
    for (let Ce = 0; Ce < L; Ce++) {
      le(Ce);
      const Te = Date.now() - me;
      Te >= 0 && Te < O || (await (0, e.nextTick)(), me += Te);
    }
  }
  function Q(L) {
    if (typeof L != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(L));
  }
  function Y(L) {
    return new TextDecoder().decode(L);
  }
  function b(L) {
    return typeof L == "string" && (L = Q(L)), s(L), L;
  }
  function I(L) {
    return typeof L == "string" && (L = Q(L)), s(L), L;
  }
  function N(...L) {
    let O = 0;
    for (let me = 0; me < L.length; me++) {
      const Ce = L[me];
      s(Ce), O += Ce.length;
    }
    const le = new Uint8Array(O);
    for (let me = 0, Ce = 0; me < L.length; me++) {
      const Te = L[me];
      le.set(Te, Ce), Ce += Te.length;
    }
    return le;
  }
  function M(L, O) {
    if (O !== void 0 && {}.toString.call(O) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(L, O);
  }
  class q {
  }
  e.Hash = q;
  function D(L) {
    const O = (me) => L().update(b(me)).digest(), le = L();
    return O.outputLen = le.outputLen, O.blockLen = le.blockLen, O.create = () => L(), O;
  }
  function ae(L) {
    const O = (me, Ce) => L(Ce).update(b(me)).digest(), le = L({});
    return O.outputLen = le.outputLen, O.blockLen = le.blockLen, O.create = (me) => L(me), O;
  }
  function ie(L) {
    const O = (me, Ce) => L(Ce).update(b(me)).digest(), le = L({});
    return O.outputLen = le.outputLen, O.blockLen = le.blockLen, O.create = (me) => L(me), O;
  }
  e.wrapConstructor = D, e.wrapConstructorWithOpts = ae, e.wrapXOFConstructorWithOpts = ie;
  function Ue(L = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(L));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(L));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(fy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = fy;
  class n extends t.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(i);
      const c = (0, t.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const l = this.blockLen, d = new Uint8Array(l);
      d.set(c.length > l ? i.create().update(c).digest() : c);
      for (let p = 0; p < d.length; p++)
        d[p] ^= 54;
      this.iHash.update(d), this.oHash = i.create();
      for (let p = 0; p < d.length; p++)
        d[p] ^= 106;
      this.oHash.update(d), (0, t.clean)(d);
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
      const { oHash: o, iHash: c, finished: l, destroyed: d, blockLen: p, outputLen: u } = this;
      return i = i, i.finished = l, i.destroyed = d, i.blockLen = p, i.outputLen = u, i.oHash = o._cloneInto(i.oHash), i.iHash = c._cloneInto(i.iHash), i;
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
})(dy);
const ro = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function hy(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Fu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Ui(e, ...t) {
  if (!hy(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function sx(e) {
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
function py(e, t) {
  Ui(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function ix(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function ox(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Fc(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Ec(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function lr(e, t) {
  return e << 32 - t | e >>> t;
}
function ax(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const ef = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function tf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const gy = ef ? (e) => e : (e) => tf(e), cx = gy;
function yy(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = tf(e[t]);
  return e;
}
const lx = ef ? (e) => e : yy, wy = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", ux = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function nf(e) {
  if (Ui(e), wy)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += ux[e[n]];
  return t;
}
const Yr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Yh(e) {
  if (e >= Yr._0 && e <= Yr._9)
    return e - Yr._0;
  if (e >= Yr.A && e <= Yr.F)
    return e - (Yr.A - 10);
  if (e >= Yr.a && e <= Yr.f)
    return e - (Yr.a - 10);
}
function dx(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (wy)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Yh(e.charCodeAt(i)), c = Yh(e.charCodeAt(i + 1));
    if (o === void 0 || c === void 0) {
      const l = e[i] + e[i + 1];
      throw new Error('hex string expected, got non-hex character "' + l + '" at index ' + i);
    }
    r[s] = o * 16 + c;
  }
  return r;
}
const my = async () => {
};
async function fx(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < t || (await my(), r += i);
  }
}
function rf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function hx(e) {
  return new TextDecoder().decode(e);
}
function Ta(e) {
  return typeof e == "string" && (e = rf(e)), Ui(e), e;
}
function px(e) {
  return typeof e == "string" && (e = rf(e)), Ui(e), e;
}
function gx(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    Ui(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const i = e[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function yx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let by = class {
};
function xl(e) {
  const t = (r) => e().update(Ta(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function xy(e) {
  const t = (r, s) => e(s).update(Ta(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function Sy(e) {
  const t = (r, s) => e(s).update(Ta(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const wx = xl, mx = xy, bx = Sy;
function xx(e = 32) {
  if (ro && typeof ro.getRandomValues == "function")
    return ro.getRandomValues(new Uint8Array(e));
  if (ro && typeof ro.randomBytes == "function")
    return Uint8Array.from(ro.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const Sx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: by,
  abytes: Ui,
  aexists: ju,
  ahash: sx,
  anumber: Fu,
  aoutput: py,
  asyncLoop: fx,
  byteSwap: tf,
  byteSwap32: yy,
  byteSwapIfBE: cx,
  bytesToHex: nf,
  bytesToUtf8: hx,
  checkOpts: yx,
  clean: Fc,
  concatBytes: gx,
  createHasher: xl,
  createOptHasher: xy,
  createView: Ec,
  createXOFer: Sy,
  hexToBytes: dx,
  isBytes: hy,
  isLE: ef,
  kdfInputToBytes: px,
  nextTick: my,
  randomBytes: xx,
  rotl: ax,
  rotr: lr,
  swap32IfBE: lx,
  swap8IfBE: gy,
  toBytes: Ta,
  u32: ox,
  u8: ix,
  utf8ToBytes: rf,
  wrapConstructor: wx,
  wrapConstructorWithOpts: mx,
  wrapXOFConstructorWithOpts: bx
}, Symbol.toStringTag, { value: "Module" }));
function vx(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + d, c, r);
}
function Ax(e, t, n) {
  return e & t ^ ~e & n;
}
function Ex(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class kx extends by {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Ec(this.buffer);
  }
  update(t) {
    ju(this), t = Ta(t), Ui(t);
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
    ju(this), py(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Fc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    vx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Ec(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = l / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      c.setUint32(4 * u, p[u], i);
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
]), $x = /* @__PURE__ */ Uint32Array.from([
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
let sf = class extends kx {
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
    for (let u = 0; u < 16; u++, n += 4)
      vs[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = vs[u - 15], y = vs[u - 2], S = lr(w, 7) ^ lr(w, 18) ^ w >>> 3, v = lr(y, 17) ^ lr(y, 19) ^ y >>> 10;
      vs[u] = v + vs[u - 7] + S + vs[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = lr(c, 6) ^ lr(c, 11) ^ lr(c, 25), y = p + w + Ax(c, l, d) + $x[u] + vs[u] | 0, v = (lr(r, 2) ^ lr(r, 13) ^ lr(r, 22)) + Ex(r, s, i) | 0;
      p = d, d = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, d, p);
  }
  roundClean() {
    Fc(vs);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Fc(this.buffer);
  }
}, vy = class extends sf {
  constructor() {
    super(28), this.A = Ss[0] | 0, this.B = Ss[1] | 0, this.C = Ss[2] | 0, this.D = Ss[3] | 0, this.E = Ss[4] | 0, this.F = Ss[5] | 0, this.G = Ss[6] | 0, this.H = Ss[7] | 0;
  }
};
const Ix = /* @__PURE__ */ xl(() => new sf()), Lx = /* @__PURE__ */ xl(() => new vy()), Cx = sf, of = Ix, Tx = vy, Bx = Lx, Mx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Tx,
  SHA256: Cx,
  sha224: Bx,
  sha256: of
}, Symbol.toStringTag, { value: "Module" })), Sl = /* @__PURE__ */ fl(Mx), Nx = /* @__PURE__ */ fl(D1);
var Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
Io.joseToDer = Io.derToJose = void 0;
const Ay = Ca, Ey = Sn;
function eu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const _x = {
  ES256: eu(256),
  ES384: eu(384),
  ES512: eu(521)
};
function ky(e) {
  const t = _x[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const jc = 128, $y = 0, Px = 32, Ux = 16, Hx = 2, Iy = Ux | Px | $y << 6, Rc = Hx | $y << 6;
function Ly(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, Ay.toByteArray)((0, Ey.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Ox(e, t) {
  const n = Ly(e), r = ky(t), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Iy)
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
  const d = o;
  if (o += l, n[o++] !== Rc)
    throw new Error('Could not find expected "int" for "s"');
  const p = n[o++];
  if (i - o !== p)
    throw new Error(`"s" specified length of "${p}", expected "${i - o}"`);
  if (s < p)
    throw new Error(`"s" specified length of "${p}", max of "${s}" is acceptable`);
  const u = o;
  if (o += p, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const w = r - l, y = r - p, S = new Uint8Array(w + l + y + p);
  for (o = 0; o < w; ++o)
    S[o] = 0;
  S.set(n.subarray(d + Math.max(-w, 0), d + l), o), o = r;
  for (const v = o; o < v + y; ++o)
    S[o] = 0;
  return S.set(n.subarray(u + Math.max(-y, 0), u + p), o), (0, Ey.escape)((0, Ay.fromByteArray)(S));
}
Io.derToJose = Ox;
function qh(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= jc && --r, r;
}
function Dx(e, t) {
  e = Ly(e);
  const n = ky(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = qh(e, 0, n), i = qh(e, n, e.length), o = n - s, c = n - i, l = 2 + o + 1 + 1 + c, d = l < jc, p = new Uint8Array((d ? 2 : 3) + l);
  let u = 0;
  return p[u++] = Iy, d ? p[u++] = l : (p[u++] = jc | 1, p[u++] = l & 255), p[u++] = Rc, p[u++] = o, s < 0 ? (p[u++] = 0, p.set(e.subarray(0, n), u), u += n) : (p.set(e.subarray(s, n), u), u += n - s), p[u++] = Rc, p[u++] = c, i < 0 ? (p[u++] = 0, p.set(e.subarray(n), u)) : p.set(e.subarray(n + i), u), p;
}
Io.joseToDer = Dx;
var rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
rs.InvalidTokenError = rs.MissingParametersError = void 0;
class Fx extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
rs.MissingParametersError = Fx;
class jx extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
rs.InvalidTokenError = jx;
const Ba = /* @__PURE__ */ fl(Sx);
Object.defineProperty(ml, "__esModule", { value: !0 });
ml.SECP256K1Client = void 0;
const Rx = dy, zx = Sl, kc = Nx, Wh = Io, Zh = rs, Jh = Ba;
kc.utils.hmacSha256Sync = (e, ...t) => {
  const n = Rx.hmac.create(zx.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class Cy {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Jh.bytesToHex)(kc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new Zh.MissingParametersError("a signing input hash and private key are all required");
    const s = kc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Jh.bytesToHex)(s);
    if (r === "jose")
      return (0, Wh.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, Wh.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new Zh.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return kc.verify(n, t, r, { strict: !1 });
  }
}
ml.SECP256K1Client = Cy;
Cy.algorithmName = "ES256K";
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
var Si = {};
const Gx = /* @__PURE__ */ fl(Ug);
var Kx = An && An.__awaiter || function(e, t, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(p) {
      try {
        d(r.next(p));
      } catch (u) {
        o(u);
      }
    }
    function l(p) {
      try {
        d(r.throw(p));
      } catch (u) {
        o(u);
      }
    }
    function d(p) {
      p.done ? i(p.value) : s(p.value).then(c, l);
    }
    d((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.hashSha256Async = Si.hashSha256 = void 0;
const Vx = Sl;
function Ty(e) {
  return (0, Vx.sha256)(e);
}
Si.hashSha256 = Ty;
function Xx(e) {
  return Kx(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Gx;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Ty(e));
    }
  });
}
Si.hashSha256Async = Xx;
var Yx = An && An.__awaiter || function(e, t, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(p) {
      try {
        d(r.next(p));
      } catch (u) {
        o(u);
      }
    }
    function l(p) {
      try {
        d(r.throw(p));
      } catch (u) {
        o(u);
      }
    }
    function d(p) {
      p.done ? i(p.value) : s(p.value).then(c, l);
    }
    d((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty($o, "__esModule", { value: !0 });
$o.TokenSigner = $o.createUnsecuredToken = void 0;
const Ru = Sn, Qh = wl, qx = rs, ep = Si;
function zu(e, t) {
  const n = [], r = Ru.encode(JSON.stringify(t));
  n.push(r);
  const s = Ru.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function Wx(e) {
  return zu(e, { typ: "JWT", alg: "none" }) + ".";
}
$o.createUnsecuredToken = Wx;
class Zx {
  constructor(t, n) {
    if (!(t && n))
      throw new qx.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !Qh.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Qh.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), i = zu(t, s), o = (0, ep.hashSha256)(i);
    return this.createWithSignedHash(t, n, s, i, o);
  }
  signAsync(t, n = !1, r = {}) {
    return Yx(this, void 0, void 0, function* () {
      const s = this.header(r), i = zu(t, s), o = yield (0, ep.hashSha256Async)(i);
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
$o.TokenSigner = Zx;
var vl = {};
Object.defineProperty(vl, "__esModule", { value: !0 });
vl.TokenVerifier = void 0;
const Jx = Sn, tp = wl, Qx = rs, Ya = Si;
class eS {
  constructor(t, n) {
    if (!(t && n))
      throw new Qx.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !tp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = tp.cryptoClients[t], this.rawPublicKey = n;
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
    const r = [t.header.join("."), Jx.encode(t.payload)].join(".");
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
vl.TokenVerifier = eS;
var Al = {};
Object.defineProperty(Al, "__esModule", { value: !0 });
Al.decodeToken = void 0;
const qa = Sn;
function tS(e) {
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
Al.decodeToken = tS;
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
  Object.defineProperty(e, "__esModule", { value: !0 }), n($o, e), n(vl, e), n(Al, e), n(rs, e), n(wl, e);
})(un);
function nS(e) {
  return `did:btc-addr:${e}`;
}
function rS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new _h("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new _h('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function By(e) {
  if (e)
    return rS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const sS = "1.4.0";
function iS() {
  return G2();
}
function oS(e, t, n, r = $g.slice(), s, i = jb().getTime(), o = {}) {
  const c = (y) => {
    const S = Rd("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  t || (t = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const l = Object.assign({}, o, {
    jti: zb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: sS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), d = un.SECP256K1Client.derivePublicKey(e);
  l.public_keys = [d];
  const p = ry(d);
  return l.iss = nS(p), new un.TokenSigner("ES256k", e).sign(l);
}
async function np(e, t) {
  const n = Ia(ct(t)), r = JSON.parse(n), s = await ay(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function aS(e) {
  const t = un.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new un.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function cS(e) {
  const t = un.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = By(t.iss);
  if (n.length === 1) {
    if (ry(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function lS(e) {
  const t = un.decodeToken(e).payload;
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
function uS(e) {
  const t = un.decodeToken(e).payload;
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
function dS(e) {
  const t = [
    uS(e),
    lS(e),
    aS(e),
    cS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const rp = "1.0.0";
class Ks {
  constructor(t) {
    this.version = rp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== rp)
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
class My {
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
class sp extends My {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new Ks({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Ig("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ks({})), !0;
  }
}
class ip extends My {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = Ob, !localStorage.getItem(this.key)) {
      const r = new Ks({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new Ig("No session data was found in localStorage");
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
var es;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(es || (es = {}));
var _r;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(_r || (_r = {}));
es.Mainnet;
const Ny = {
  chainId: pa.Mainnet,
  transactionVersion: es.Mainnet,
  peerNetworkId: zc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: _r.MainnetSingleSig,
    multiSig: _r.MainnetMultiSig
  },
  client: { baseUrl: Lg }
}, Gu = {
  chainId: pa.Testnet,
  transactionVersion: es.Testnet,
  peerNetworkId: zc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: _r.TestnetSingleSig,
    multiSig: _r.TestnetMultiSig
  },
  client: { baseUrl: Cg }
}, $c = {
  ...Gu,
  addressVersion: { ...Gu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Tg }
}, fS = {
  ...$c,
  addressVersion: { ...$c.addressVersion },
  client: { ...$c.client }
};
function hS(e) {
  switch (e) {
    case "mainnet":
      return Ny;
    case "testnet":
      return Gu;
    case "devnet":
      return $c;
    case "mocknet":
      return fS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function _y(e) {
  return typeof e == "string" ? hS(e) : e;
}
var op;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(op || (op = {}));
var ap;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(ap || (ap = {}));
var dr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(dr || (dr = {}));
const tu = ["onChainOnly", "offChainOnly", "any"];
tu[0] + "", dr.OnChainOnly, tu[1] + "", dr.OffChainOnly, tu[2] + "", dr.Any, dr.OnChainOnly + "", dr.OnChainOnly, dr.OffChainOnly + "", dr.OffChainOnly, dr.Any + "", dr.Any;
var cp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(cp || (cp = {}));
var lp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(lp || (lp = {}));
var up;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(up || (up = {}));
var Jr;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Jr || (Jr = {}));
var dp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(dp || (dp = {}));
var fp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(fp || (fp = {}));
var hp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(hp || (hp = {}));
var pp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(pp || (pp = {}));
var gp;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(gp || (gp = {}));
var yp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(yp || (yp = {}));
var wp;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(wp || (wp = {}));
var mp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(mp || (mp = {}));
var bp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(bp || (bp = {}));
function Ku(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function pS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Py(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function gS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ku(e.outputLen), Ku(e.blockLen);
}
function yS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function wS(e, t) {
  Py(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const li = {
  number: Ku,
  bool: pS,
  bytes: Py,
  hash: gS,
  exists: yS,
  output: wS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const nu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), $r = (e, t) => e << 32 - t | e >>> t, mS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!mS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function bS(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function af(e) {
  if (typeof e == "string" && (e = bS(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Uy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Hi(e) {
  const t = (r) => e().update(af(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Hy = class extends Uy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, li.hash(t);
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
const Oy = (e, t, n) => new Hy(e, t).update(n).digest();
Oy.create = (e, t) => new Hy(e, t);
function xS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + d, c, r);
}
let cf = class extends Uy {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = nu(this.buffer);
  }
  update(t) {
    li.exists(this);
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
    li.exists(this), li.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    xS(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = nu(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = l / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      c.setUint32(4 * u, p[u], i);
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
const SS = (e, t, n) => e & t ^ ~e & n, vS = (e, t, n) => e & t ^ e & n ^ t & n, AS = new Uint32Array([
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
let Dy = class extends cf {
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
    for (let u = 0; u < 16; u++, n += 4)
      Es[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Es[u - 15], y = Es[u - 2], S = $r(w, 7) ^ $r(w, 18) ^ w >>> 3, v = $r(y, 17) ^ $r(y, 19) ^ y >>> 10;
      Es[u] = v + Es[u - 7] + S + Es[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = $r(c, 6) ^ $r(c, 11) ^ $r(c, 25), y = p + w + SS(c, l, d) + AS[u] + Es[u] | 0, v = ($r(r, 2) ^ $r(r, 13) ^ $r(r, 22)) + vS(r, s, i) | 0;
      p = d, d = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, d, p);
  }
  roundClean() {
    Es.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ES = class extends Dy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Fy = Hi(() => new Dy());
Hi(() => new ES());
var Oi = {}, lf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = Ba;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, c) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let l = [], d = 0;
    for (let y = o.length - 1; y >= 0; y--)
      if (d < 4) {
        const S = n.indexOf(o[y]) >> d;
        let v = 0;
        y !== 0 && (v = n.indexOf(o[y - 1]));
        const T = 1 + d, U = v % (1 << T) << 5 - T, H = e.c32[S + U];
        d = T, l.unshift(H);
      } else
        d = 0;
    let p = 0;
    for (let y = 0; y < l.length && l[y] === "0"; y++)
      p++;
    l = l.slice(p);
    const u = new TextDecoder().decode((0, t.hexToBytes)(o)).match(/^\u0000*/), w = u ? u[0].length : 0;
    for (let y = 0; y < w; y++)
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
    const l = o.match(`^${e.c32[0]}*`), d = l ? l[0].length : 0;
    let p = [], u = 0, w = 0;
    for (let v = o.length - 1; v >= 0; v--) {
      w === 4 && (p.unshift(n[u]), w = 0, u = 0);
      const U = (e.c32.indexOf(o[v]) << w) + u, H = n[U % 16];
      if (w += 1, u = U >> 4, u > 1 << w)
        throw new Error("Panic error in decoding.");
      p.unshift(H);
    }
    p.unshift(n[u]), p.length % 2 === 1 && p.unshift("0");
    let y = 0;
    for (let v = 0; v < p.length && p[v] === "0"; v++)
      y++;
    p = p.slice(y - y % 2);
    let S = p.join("");
    for (let v = 0; v < d; v++)
      S = `00${S}`;
    if (c) {
      const v = c * 2 - S.length;
      for (let T = 0; T < v; T += 2)
        S = `00${S}`;
    }
    return S;
  }
  e.c32decode = i;
})(lf);
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.c32checkDecode = vi.c32checkEncode = void 0;
const xp = Sl, Sp = Ba, ca = lf;
function jy(e) {
  const t = (0, xp.sha256)((0, xp.sha256)((0, Sp.hexToBytes)(e)));
  return (0, Sp.bytesToHex)(t.slice(0, 4));
}
function kS(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = jy(`${n}${t}`), s = (0, ca.c32encode)(`${t}${r}`);
  return `${ca.c32[e]}${s}`;
}
vi.c32checkEncode = kS;
function $S(e) {
  e = (0, ca.c32normalize)(e);
  const t = (0, ca.c32decode)(e.slice(1)), n = e[0], r = ca.c32.indexOf(n), s = t.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), jy(`${i}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
vi.c32checkDecode = $S;
var Ry = {}, Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
Lo.decode = Lo.encode = void 0;
const Gc = Sl, vp = Ba, zy = Jg, Gy = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function IS(e, t = "00") {
  const n = typeof e == "string" ? (0, vp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, vp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Gc.sha256)((0, Gc.sha256)(new Uint8Array([...r, ...n])));
  return zy(Gy).encode([...r, ...n, ...s.slice(0, 4)]);
}
Lo.encode = IS;
function LS(e) {
  const t = zy(Gy).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, Gc.sha256)((0, Gc.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Lo.decode = LS;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = vi, n = Lo, r = Ba;
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
  function o(p, u) {
    if (!u.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(p, u)}`;
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
  function l(p, u = -1) {
    const w = n.decode(p), y = (0, r.bytesToHex)(w.data), S = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let v;
    return u < 0 ? (v = S, s[S] !== void 0 && (v = s[S])) : v = u, o(v, y);
  }
  e.b58ToC32 = l;
  function d(p, u = -1) {
    const w = c(p), y = w[0], S = w[1];
    let v;
    u < 0 ? (v = y, i[y] !== void 0 && (v = i[y])) : v = u;
    let T = v.toString(16);
    return T.length === 1 && (T = `0${T}`), n.encode(S, T);
  }
  e.c32ToB58 = d;
})(Ry);
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
  const n = vi;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Ry;
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
})(Oi);
function CS(e, t) {
  switch (t = _y(t ?? Ny), e) {
    case Jr.P2PKH:
      switch (t.transactionVersion) {
        case es.Mainnet:
          return _r.MainnetSingleSig;
        case es.Testnet:
          return _r.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case Jr.P2SH:
    case Jr.P2SHNonSequential:
    case Jr.P2WPKH:
    case Jr.P2WSH:
    case Jr.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case es.Mainnet:
          return _r.MainnetMultiSig;
        case es.Testnet:
          return _r.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const TS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ky = Uint8Array.from({ length: 16 }, (e, t) => t), BS = Ky.map((e) => (9 * e + 5) % 16);
let uf = [Ky], df = [BS];
for (let e = 0; e < 4; e++)
  for (let t of [uf, df])
    t.push(t[e].map((n) => TS[n]));
const Vy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), MS = uf.map((e, t) => e.map((n) => Vy[t][n])), NS = df.map((e, t) => e.map((n) => Vy[t][n])), _S = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), PS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wa = (e, t) => e << t | e >>> 32 - t;
function Ap(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Za = new Uint32Array(16);
let US = class extends cf {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, l = c, d = this.h3 | 0, p = d, u = this.h4 | 0, w = u;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, v = _S[y], T = PS[y], U = uf[y], H = df[y], E = MS[y], B = NS[y];
      for (let _ = 0; _ < 16; _++) {
        const Z = Wa(r + Ap(y, i, c, d) + Za[U[_]] + v, E[_]) + u | 0;
        r = u, u = d, d = Wa(c, 10) | 0, c = i, i = Z;
      }
      for (let _ = 0; _ < 16; _++) {
        const Z = Wa(s + Ap(S, o, l, p) + Za[H[_]] + T, B[_]) + w | 0;
        s = w, w = p, p = Wa(l, 10) | 0, l = o, o = Z;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    Za.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const HS = Hi(() => new US()), Ja = BigInt(2 ** 32 - 1), Vu = BigInt(32);
function Xy(e, t = !1) {
  return t ? { h: Number(e & Ja), l: Number(e >> Vu & Ja) } : { h: Number(e >> Vu & Ja) | 0, l: Number(e & Ja) | 0 };
}
function OS(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = Xy(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const DS = (e, t) => BigInt(e >>> 0) << Vu | BigInt(t >>> 0), FS = (e, t, n) => e >>> n, jS = (e, t, n) => e << 32 - n | t >>> n, RS = (e, t, n) => e >>> n | t << 32 - n, zS = (e, t, n) => e << 32 - n | t >>> n, GS = (e, t, n) => e << 64 - n | t >>> n - 32, KS = (e, t, n) => e >>> n - 32 | t << 64 - n, VS = (e, t) => t, XS = (e, t) => e, YS = (e, t, n) => e << n | t >>> 32 - n, qS = (e, t, n) => t << n | e >>> 32 - n, WS = (e, t, n) => t << n - 32 | e >>> 64 - n, ZS = (e, t, n) => e << n - 32 | t >>> 64 - n;
function JS(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const QS = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), ev = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, tv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), nv = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, rv = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), sv = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Re = {
  fromBig: Xy,
  split: OS,
  toBig: DS,
  shrSH: FS,
  shrSL: jS,
  rotrSH: RS,
  rotrSL: zS,
  rotrBH: GS,
  rotrBL: KS,
  rotr32H: VS,
  rotr32L: XS,
  rotlSH: YS,
  rotlSL: qS,
  rotlBH: WS,
  rotlBL: ZS,
  add: JS,
  add3L: QS,
  add3H: ev,
  add4L: tv,
  add4H: nv,
  add5H: sv,
  add5L: rv
}, [iv, ov] = Re.split([
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
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: l, Eh: d, El: p, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: T } = this;
    return [t, n, r, s, i, o, c, l, d, p, u, w, y, S, v, T];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l, d, p, u, w, y, S, v, T) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      ks[E] = t.getUint32(n), $s[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const B = ks[E - 15] | 0, _ = $s[E - 15] | 0, Z = Re.rotrSH(B, _, 1) ^ Re.rotrSH(B, _, 8) ^ Re.shrSH(B, _, 7), de = Re.rotrSL(B, _, 1) ^ Re.rotrSL(B, _, 8) ^ Re.shrSL(B, _, 7), Q = ks[E - 2] | 0, Y = $s[E - 2] | 0, b = Re.rotrSH(Q, Y, 19) ^ Re.rotrBH(Q, Y, 61) ^ Re.shrSH(Q, Y, 6), I = Re.rotrSL(Q, Y, 19) ^ Re.rotrBL(Q, Y, 61) ^ Re.shrSL(Q, Y, 6), N = Re.add4L(de, I, $s[E - 7], $s[E - 16]), M = Re.add4H(N, Z, b, ks[E - 7], ks[E - 16]);
      ks[E] = M | 0, $s[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: l, Dh: d, Dl: p, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: T, Hh: U, Hl: H } = this;
    for (let E = 0; E < 80; E++) {
      const B = Re.rotrSH(u, w, 14) ^ Re.rotrSH(u, w, 18) ^ Re.rotrBH(u, w, 41), _ = Re.rotrSL(u, w, 14) ^ Re.rotrSL(u, w, 18) ^ Re.rotrBL(u, w, 41), Z = u & y ^ ~u & v, de = w & S ^ ~w & T, Q = Re.add5L(H, _, de, ov[E], $s[E]), Y = Re.add5H(Q, U, B, Z, iv[E], ks[E]), b = Q | 0, I = Re.rotrSH(r, s, 28) ^ Re.rotrBH(r, s, 34) ^ Re.rotrBH(r, s, 39), N = Re.rotrSL(r, s, 28) ^ Re.rotrBL(r, s, 34) ^ Re.rotrBL(r, s, 39), M = r & i ^ r & c ^ i & c, q = s & o ^ s & l ^ o & l;
      U = v | 0, H = T | 0, v = y | 0, T = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Re.add(d | 0, p | 0, Y | 0, b | 0), d = c | 0, p = l | 0, c = i | 0, l = o | 0, i = r | 0, o = s | 0;
      const D = Re.add3L(b, N, q);
      r = Re.add3H(D, Y, I, M), s = D | 0;
    }
    ({ h: r, l: s } = Re.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Re.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l } = Re.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: d, l: p } = Re.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h: u, l: w } = Re.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Re.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: T } = Re.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: H } = Re.add(this.Hh | 0, this.Hl | 0, U | 0, H | 0), this.set(r, s, i, o, c, l, d, p, u, w, y, S, v, T, U, H);
  }
  roundClean() {
    ks.fill(0), $s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, av = class extends El {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, cv = class extends El {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, lv = class extends El {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Hi(() => new El());
Hi(() => new av());
Hi(() => new cv());
Hi(() => new lv());
var Kc = { exports: {} };
Kc.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", c = "[object Boolean]", l = "[object Date]", d = "[object Error]", p = "[object Function]", u = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", S = "[object Object]", v = "[object Promise]", T = "[object RegExp]", U = "[object Set]", H = "[object String]", E = "[object Symbol]", B = "[object WeakMap]", _ = "[object ArrayBuffer]", Z = "[object DataView]", de = "[object Float32Array]", Q = "[object Float64Array]", Y = "[object Int8Array]", b = "[object Int16Array]", I = "[object Int32Array]", N = "[object Uint8Array]", M = "[object Uint8ClampedArray]", q = "[object Uint16Array]", D = "[object Uint32Array]", ae = /[\\^$.*+?()[\]{}|]/g, ie = /\w*$/, Ue = /^\[object .+?Constructor\]$/, L = /^(?:0|[1-9]\d*)$/, O = {};
  O[i] = O[o] = O[_] = O[Z] = O[c] = O[l] = O[de] = O[Q] = O[Y] = O[b] = O[I] = O[w] = O[y] = O[S] = O[T] = O[U] = O[H] = O[E] = O[N] = O[M] = O[q] = O[D] = !0, O[d] = O[p] = O[B] = !1;
  var le = typeof An == "object" && An && An.Object === Object && An, me = typeof self == "object" && self && self.Object === Object && self, Ce = le || me || Function("return this")(), Te = t && !t.nodeType && t, _t = Te && !0 && e && !e.nodeType && e, Me = _t && _t.exports === Te;
  function $e(m, C) {
    return m.set(C[0], C[1]), m;
  }
  function ke(m, C) {
    return m.add(C), m;
  }
  function Jt(m, C) {
    for (var j = -1, he = m ? m.length : 0; ++j < he && C(m[j], j, m) !== !1; )
      ;
    return m;
  }
  function Qt(m, C) {
    for (var j = -1, he = C.length, ut = m.length; ++j < he; )
      m[ut + j] = C[j];
    return m;
  }
  function Je(m, C, j, he) {
    for (var ut = -1, Tt = m ? m.length : 0; ++ut < Tt; )
      j = C(j, m[ut], ut, m);
    return j;
  }
  function $t(m, C) {
    for (var j = -1, he = Array(m); ++j < m; )
      he[j] = C(j);
    return he;
  }
  function vt(m, C) {
    return m == null ? void 0 : m[C];
  }
  function R(m) {
    var C = !1;
    if (m != null && typeof m.toString != "function")
      try {
        C = !!(m + "");
      } catch {
      }
    return C;
  }
  function P(m) {
    var C = -1, j = Array(m.size);
    return m.forEach(function(he, ut) {
      j[++C] = [ut, he];
    }), j;
  }
  function re(m, C) {
    return function(j) {
      return m(C(j));
    };
  }
  function J(m) {
    var C = -1, j = Array(m.size);
    return m.forEach(function(he) {
      j[++C] = he;
    }), j;
  }
  var se = Array.prototype, Ze = Function.prototype, xe = Object.prototype, Ne = Ce["__core-js_shared__"], nt = function() {
    var m = /[^.]+$/.exec(Ne && Ne.keys && Ne.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), Be = Ze.toString, oe = xe.hasOwnProperty, Fe = xe.toString, Qe = RegExp(
    "^" + Be.call(oe).replace(ae, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ve = Me ? Ce.Buffer : void 0, Yt = Ce.Symbol, Kt = Ce.Uint8Array, Vt = re(Object.getPrototypeOf, Object), gt = Object.create, Mn = xe.propertyIsEnumerable, yn = se.splice, Xn = Object.getOwnPropertySymbols, Rr = Ve ? Ve.isBuffer : void 0, $ = re(Object.keys, Object), F = At(Ce, "DataView"), V = At(Ce, "Map"), X = At(Ce, "Promise"), ee = At(Ce, "Set"), fe = At(Ce, "WeakMap"), k = At(Object, "create"), ye = In(F), _e = In(V), lt = In(X), Xe = In(ee), kt = In(fe), rt = Yt ? Yt.prototype : void 0, st = rt ? rt.valueOf : void 0;
  function yt(m) {
    var C = -1, j = m ? m.length : 0;
    for (this.clear(); ++C < j; ) {
      var he = m[C];
      this.set(he[0], he[1]);
    }
  }
  function qt() {
    this.__data__ = k ? k(null) : {};
  }
  function He(m) {
    return this.has(m) && delete this.__data__[m];
  }
  function Xt(m) {
    var C = this.__data__;
    if (k) {
      var j = C[m];
      return j === r ? void 0 : j;
    }
    return oe.call(C, m) ? C[m] : void 0;
  }
  function Ar(m) {
    var C = this.__data__;
    return k ? C[m] !== void 0 : oe.call(C, m);
  }
  function Yn(m, C) {
    var j = this.__data__;
    return j[m] = k && C === void 0 ? r : C, this;
  }
  yt.prototype.clear = qt, yt.prototype.delete = He, yt.prototype.get = Xt, yt.prototype.has = Ar, yt.prototype.set = Yn;
  function $n(m) {
    var C = -1, j = m ? m.length : 0;
    for (this.clear(); ++C < j; ) {
      var he = m[C];
      this.set(he[0], he[1]);
    }
  }
  function zr() {
    this.__data__ = [];
  }
  function Ws(m) {
    var C = this.__data__, j = as(C, m);
    if (j < 0)
      return !1;
    var he = C.length - 1;
    return j == he ? C.pop() : yn.call(C, j, 1), !0;
  }
  function os(m) {
    var C = this.__data__, j = as(C, m);
    return j < 0 ? void 0 : C[j][1];
  }
  function zi(m) {
    return as(this.__data__, m) > -1;
  }
  function Nn(m, C) {
    var j = this.__data__, he = as(j, m);
    return he < 0 ? j.push([m, C]) : j[he][1] = C, this;
  }
  $n.prototype.clear = zr, $n.prototype.delete = Ws, $n.prototype.get = os, $n.prototype.has = zi, $n.prototype.set = Nn;
  function Er(m) {
    var C = -1, j = m ? m.length : 0;
    for (this.clear(); ++C < j; ) {
      var he = m[C];
      this.set(he[0], he[1]);
    }
  }
  function _n() {
    this.__data__ = {
      hash: new yt(),
      map: new (V || $n)(),
      string: new yt()
    };
  }
  function Oe(m) {
    return Vr(this, m).delete(m);
  }
  function Pt(m) {
    return Vr(this, m).get(m);
  }
  function ar(m) {
    return Vr(this, m).has(m);
  }
  function Zs(m, C) {
    return Vr(this, m).set(m, C), this;
  }
  Er.prototype.clear = _n, Er.prototype.delete = Oe, Er.prototype.get = Pt, Er.prototype.has = ar, Er.prototype.set = Zs;
  function Pn(m) {
    this.__data__ = new $n(m);
  }
  function qn() {
    this.__data__ = new $n();
  }
  function sn(m) {
    return this.__data__.delete(m);
  }
  function wn(m) {
    return this.__data__.get(m);
  }
  function Js(m) {
    return this.__data__.has(m);
  }
  function en(m, C) {
    var j = this.__data__;
    if (j instanceof $n) {
      var he = j.__data__;
      if (!V || he.length < n - 1)
        return he.push([m, C]), this;
      j = this.__data__ = new Er(he);
    }
    return j.set(m, C), this;
  }
  Pn.prototype.clear = qn, Pn.prototype.delete = sn, Pn.prototype.get = wn, Pn.prototype.has = Js, Pn.prototype.set = en;
  function Qs(m, C) {
    var j = h(m) || a(m) ? $t(m.length, String) : [], he = j.length, ut = !!he;
    for (var Tt in m)
      oe.call(m, Tt) && !(ut && (Tt == "length" || Wi(Tt, he))) && j.push(Tt);
    return j;
  }
  function Gi(m, C, j) {
    var he = m[C];
    (!(oe.call(m, C) && x(he, j)) || j === void 0 && !(C in m)) && (m[C] = j);
  }
  function as(m, C) {
    for (var j = m.length; j--; )
      if (x(m[j][0], C))
        return j;
    return -1;
  }
  function Go(m, C) {
    return m && Yi(C, ve(C), m);
  }
  function Gr(m, C, j, he, ut, Tt, Wt) {
    var Ut;
    if (he && (Ut = Tt ? he(m, ut, Tt, Wt) : he(m)), Ut !== void 0)
      return Ut;
    if (!K(m))
      return m;
    var Ln = h(m);
    if (Ln) {
      if (Ut = bn(m), !C)
        return it(m, Ut);
    } else {
      var Xr = Un(m), hs = Xr == p || Xr == u;
      if (A(m))
        return cs(m, C);
      if (Xr == S || Xr == i || hs && !Tt) {
        if (R(m))
          return Tt ? m : {};
        if (Ut = ds(hs ? {} : m), !C)
          return Vo(m, Go(Ut, m));
      } else {
        if (!O[Xr])
          return Tt ? m : {};
        Ut = Zn(m, Xr, Gr, C);
      }
    }
    Wt || (Wt = new Pn());
    var Ie = Wt.get(m);
    if (Ie)
      return Ie;
    if (Wt.set(m, Ut), !Ln)
      var dt = j ? ri(m) : ve(m);
    return Jt(dt || m, function(ht, tn) {
      dt && (tn = ht, ht = m[tn]), Gi(Ut, tn, Gr(ht, C, j, he, tn, m, Wt));
    }), Ut;
  }
  function mn(m) {
    return K(m) ? gt(m) : {};
  }
  function Ko(m, C, j) {
    var he = C(m);
    return h(m) ? he : Qt(he, j(m));
  }
  function Ki(m) {
    return Fe.call(m);
  }
  function Vi(m) {
    if (!K(m) || Zi(m))
      return !1;
    var C = z(m) || R(m) ? Qe : Ue;
    return C.test(In(m));
  }
  function ei(m) {
    if (!si(m))
      return $(m);
    var C = [];
    for (var j in Object(m))
      oe.call(m, j) && j != "constructor" && C.push(j);
    return C;
  }
  function cs(m, C) {
    if (C)
      return m.slice();
    var j = new m.constructor(m.length);
    return m.copy(j), j;
  }
  function Wn(m) {
    var C = new m.constructor(m.byteLength);
    return new Kt(C).set(new Kt(m)), C;
  }
  function ti(m, C) {
    var j = C ? Wn(m.buffer) : m.buffer;
    return new m.constructor(j, m.byteOffset, m.byteLength);
  }
  function ls(m, C, j) {
    var he = C ? j(P(m), !0) : P(m);
    return Je(he, $e, new m.constructor());
  }
  function us(m) {
    var C = new m.constructor(m.source, ie.exec(m));
    return C.lastIndex = m.lastIndex, C;
  }
  function ni(m, C, j) {
    var he = C ? j(J(m), !0) : J(m);
    return Je(he, ke, new m.constructor());
  }
  function Kr(m) {
    return st ? Object(st.call(m)) : {};
  }
  function Xi(m, C) {
    var j = C ? Wn(m.buffer) : m.buffer;
    return new m.constructor(j, m.byteOffset, m.length);
  }
  function it(m, C) {
    var j = -1, he = m.length;
    for (C || (C = Array(he)); ++j < he; )
      C[j] = m[j];
    return C;
  }
  function Yi(m, C, j, he) {
    j || (j = {});
    for (var ut = -1, Tt = C.length; ++ut < Tt; ) {
      var Wt = C[ut], Ut = void 0;
      Gi(j, Wt, Ut === void 0 ? m[Wt] : Ut);
    }
    return j;
  }
  function Vo(m, C) {
    return Yi(m, qi(m), C);
  }
  function ri(m) {
    return Ko(m, ve, qi);
  }
  function Vr(m, C) {
    var j = m.__data__;
    return fs(C) ? j[typeof C == "string" ? "string" : "hash"] : j.map;
  }
  function At(m, C) {
    var j = vt(m, C);
    return Vi(j) ? j : void 0;
  }
  var qi = Xn ? re(Xn, Object) : Ae, Un = Ki;
  (F && Un(new F(new ArrayBuffer(1))) != Z || V && Un(new V()) != w || X && Un(X.resolve()) != v || ee && Un(new ee()) != U || fe && Un(new fe()) != B) && (Un = function(m) {
    var C = Fe.call(m), j = C == S ? m.constructor : void 0, he = j ? In(j) : void 0;
    if (he)
      switch (he) {
        case ye:
          return Z;
        case _e:
          return w;
        case lt:
          return v;
        case Xe:
          return U;
        case kt:
          return B;
      }
    return C;
  });
  function bn(m) {
    var C = m.length, j = m.constructor(C);
    return C && typeof m[0] == "string" && oe.call(m, "index") && (j.index = m.index, j.input = m.input), j;
  }
  function ds(m) {
    return typeof m.constructor == "function" && !si(m) ? mn(Vt(m)) : {};
  }
  function Zn(m, C, j, he) {
    var ut = m.constructor;
    switch (C) {
      case _:
        return Wn(m);
      case c:
      case l:
        return new ut(+m);
      case Z:
        return ti(m, he);
      case de:
      case Q:
      case Y:
      case b:
      case I:
      case N:
      case M:
      case q:
      case D:
        return Xi(m, he);
      case w:
        return ls(m, he, j);
      case y:
      case H:
        return new ut(m);
      case T:
        return us(m);
      case U:
        return ni(m, he, j);
      case E:
        return Kr(m);
    }
  }
  function Wi(m, C) {
    return C = C ?? s, !!C && (typeof m == "number" || L.test(m)) && m > -1 && m % 1 == 0 && m < C;
  }
  function fs(m) {
    var C = typeof m;
    return C == "string" || C == "number" || C == "symbol" || C == "boolean" ? m !== "__proto__" : m === null;
  }
  function Zi(m) {
    return !!nt && nt in m;
  }
  function si(m) {
    var C = m && m.constructor, j = typeof C == "function" && C.prototype || xe;
    return m === j;
  }
  function In(m) {
    if (m != null) {
      try {
        return Be.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function Ji(m) {
    return Gr(m, !0, !0);
  }
  function x(m, C) {
    return m === C || m !== m && C !== C;
  }
  function a(m) {
    return f(m) && oe.call(m, "callee") && (!Mn.call(m, "callee") || Fe.call(m) == i);
  }
  var h = Array.isArray;
  function g(m) {
    return m != null && G(m.length) && !z(m);
  }
  function f(m) {
    return ce(m) && g(m);
  }
  var A = Rr || Ee;
  function z(m) {
    var C = K(m) ? Fe.call(m) : "";
    return C == p || C == u;
  }
  function G(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= s;
  }
  function K(m) {
    var C = typeof m;
    return !!m && (C == "object" || C == "function");
  }
  function ce(m) {
    return !!m && typeof m == "object";
  }
  function ve(m) {
    return g(m) ? Qs(m) : ei(m);
  }
  function Ae() {
    return [];
  }
  function Ee() {
    return !1;
  }
  e.exports = Ji;
})(Kc, Kc.exports);
var uv = Kc.exports;
const Yy = /* @__PURE__ */ vg(uv);
var Xu;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Xu || (Xu = {}));
function dv(e, t) {
  return { type: Xu.Address, version: e, hash160: t };
}
function fv(e) {
  return Oi.c32address(e.version, e.hash160);
}
const hv = (e) => HS(Fy(e)), pv = (e) => Le(hv(e));
Ft.hmacSha256Sync = (e, ...t) => {
  const n = Oy.create(Fy, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function gv(e, t = "mainnet") {
  t = _y(t), e = typeof e == "string" ? ct(e) : e;
  const n = CS(Jr.P2PKH, t), r = dv(n, pv(e));
  return fv(r);
}
function yv(e, t) {
  const n = un.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, i = gv(s);
  if (t !== s) {
    if (t !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new un.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function wv(e, t = null) {
  let n;
  t ? n = yv(e, t) : n = un.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Ep = "_blockstackDidCheckEchoReply", mv = "echoReply", bv = "authContinuation";
function xv(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Sv() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[Ep];
  if (typeof t == "boolean")
    return t;
  const n = xv(e.location.search), r = n[mv];
  if (r) {
    e[Ep] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const i = n[bv];
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
      this.appConfig = new Bg();
    else
      throw new Fb("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new ip(t.sessionOptions) : this.store = new ip() : t ? this.store = new sp(t.sessionOptions) : this.store = new sp();
  }
  makeAuthRequestToken(t, n, r, s, i, o = Rb().getTime(), c = {}) {
    const l = this.appConfig;
    if (!l)
      throw new _u("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || l.redirectURI(), r = r || l.manifestURI(), s = s || l.scopes, i = i || l.appDomain, oS(t, n, r, s, i, o, c);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = iS();
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
      if (Sv())
        return uo.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      uo.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = d1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Fa("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = un.decodeToken(t).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await dS(t))
      throw new Fa("Invalid authentication response.");
    let c = i.private_key, l = i.core_token;
    if (Wl(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            c = await np(s, i.private_key);
          } catch {
            if (uo.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ft.isValidPrivateKey(i.private_key))
              throw new Fa("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (l != null)
          try {
            l = await np(s, l);
          } catch {
            uo.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Fa("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let d = e1, p;
    Wl(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (d = i.hubUrl), Wl(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (p = i.associationToken);
    const u = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: By(i.iss),
      appPrivateKey: c,
      coreSessionToken: l,
      authResponseToken: t,
      hubUrl: d,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: p
    }, w = i.profile_url;
    if (!u.profile && w) {
      const y = await n(w);
      if (!y.ok)
        u.profile = Object.assign({}, Hb);
      else {
        const S = await y.text(), v = JSON.parse(S);
        u.profile = wv(v[0].token);
      }
    } else
      u.profile = i.profile;
    return r.userData = u, this.store.setSessionData(r), u;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new _u("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ex(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), tx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
Yu.prototype.makeAuthRequest = Yu.prototype.makeAuthRequestToken;
const vv = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Av = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = vv(), n = e.filter((r) => t.find((i) => i.id === r.id) ? !1 : !!kl(r.id));
  return t.concat(n);
}, kl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), qy = "STX_PROVIDER", Ai = () => typeof window > "u" ? null : window.localStorage.getItem(qy), Ev = (e) => {
  typeof window < "u" && window.localStorage.setItem(qy, e);
}, kv = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function $v(e, t) {
  const n = {};
  return Object.assign(n, kv, t), await fetch(e, n);
}
function Iv(e) {
  let t = $v, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Lv(...e) {
  const { fetchLib: t, middlewares: n } = Iv(e);
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
var Co;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Co || (Co = {}));
var Ei;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ei || (Ei = {}));
var kp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(kp || (kp = {}));
const Cv = "https://api.mainnet.hiro.so", Tv = "https://api.testnet.hiro.so", Bv = "http://localhost:3999", Mv = ["mainnet", "testnet", "devnet", "mocknet"];
class ki {
  constructor(t) {
    this.version = Ei.Mainnet, this.chainId = Co.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ei.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Lv();
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
ki.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new qu();
    case "testnet":
      return new Wu();
    case "devnet":
      return new Nv();
    case "mocknet":
      return new Wy();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Mv.join(", ")}`);
  }
};
ki.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : ki.fromName(e);
class qu extends ki {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Cv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ei.Mainnet, this.chainId = Co.Mainnet;
  }
}
class Wu extends ki {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Tv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ei.Testnet, this.chainId = Co.Testnet;
  }
}
class Wy extends ki {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Bv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ei.Testnet, this.chainId = Co.Testnet;
  }
}
const Nv = Wy;
var $i;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})($i || ($i = {}));
var Vc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Vc || (Vc = {}));
$i.Mainnet;
var Ii;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ii || (Ii = {}));
var Li;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Li || (Li = {}));
Ii.Mainnet;
const _v = {
  chainId: $i.Mainnet,
  transactionVersion: Ii.Mainnet,
  peerNetworkId: Vc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Li.MainnetSingleSig,
    multiSig: Li.MainnetMultiSig
  },
  client: { baseUrl: Lg }
}, Zu = {
  chainId: $i.Testnet,
  transactionVersion: Ii.Testnet,
  peerNetworkId: Vc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Li.TestnetSingleSig,
    multiSig: Li.TestnetMultiSig
  },
  client: { baseUrl: Cg }
}, Ic = {
  ...Zu,
  addressVersion: { ...Zu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Tg }
}, Pv = {
  ...Ic,
  addressVersion: { ...Ic.addressVersion },
  client: { ...Ic.client }
};
function Uv(e) {
  switch (e) {
    case "mainnet":
      return _v;
    case "testnet":
      return Zu;
    case "devnet":
      return Ic;
    case "mocknet":
      return Pv;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Hv(e) {
  return typeof e == "string" ? Uv(e) : e;
}
function Ov(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const $p = /* @__PURE__ */ new Map();
function Zy(e, t) {
  const n = $p.get(e);
  if (n !== void 0)
    return n(t);
  const r = Ov(e);
  return $p.set(e, r), Zy(e, t);
}
let Et = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? ct(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return a1(this.readBytes(4), 0);
  }
  readUInt8() {
    return i1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return r1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Le(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Le(n);
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
    if (Zy(t, r))
      return r;
    throw n(r);
  }
};
const Dv = 128, Fv = 128, Jy = 16, pi = 32, Ju = 80, $l = 65, jv = 32, Rv = 64, Xc = 34, zv = 1 + 16 * 1024 * 1024, Gv = 165, Kv = 16, Vv = 16, Xv = 20, Yv = Vv + 2 + Xv, qv = Yv + 4, Wv = zv + (Gv + Kv * qv);
var pt;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(pt || (pt = {}));
var Qu;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Qu || (Qu = {}));
var Fn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Fn || (Fn = {}));
const ru = ["onChainOnly", "offChainOnly", "any"];
ru[0] + "", Fn.OnChainOnly, ru[1] + "", Fn.OffChainOnly, ru[2] + "", Fn.Any, Fn.OnChainOnly + "", Fn.OnChainOnly, Fn.OffChainOnly + "", Fn.OffChainOnly, Fn.Any + "", Fn.Any;
var Yc;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Yc || (Yc = {}));
var It;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(It || (It = {}));
var Ot;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Ot || (Ot = {}));
var bt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(bt || (bt = {}));
var Mt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Mt || (Mt = {}));
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
var Ip;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Ip || (Ip = {}));
var nd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(nd || (nd = {}));
var pr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(pr || (pr = {}));
var Lp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Lp || (Lp = {}));
let Il = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, fo = class extends Il {
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
}, ui = class extends Il {
  constructor(t) {
    super(t);
  }
};
function rd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Zv(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Qy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Jv(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  rd(e.outputLen), rd(e.blockLen);
}
function Qv(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function eA(e, t) {
  Qy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const di = {
  number: rd,
  bool: Zv,
  bytes: Qy,
  hash: Jv,
  exists: Qv,
  output: eA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const su = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Ir = (e, t) => e << 32 - t | e >>> t, tA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!tA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function nA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function ff(e) {
  if (typeof e == "string" && (e = nA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let ew = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Di(e) {
  const t = (r) => e().update(ff(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let tw = class extends ew {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, di.hash(t);
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
    return di.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    di.exists(this), di.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const nw = (e, t, n) => new tw(e, t).update(n).digest();
nw.create = (e, t) => new tw(e, t);
function rA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + d, c, r);
}
let hf = class extends ew {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = su(this.buffer);
  }
  update(t) {
    di.exists(this);
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
    di.exists(this), di.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    rA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = su(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = l / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      c.setUint32(4 * u, p[u], i);
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
const sA = (e, t, n) => e & t ^ ~e & n, iA = (e, t, n) => e & t ^ e & n ^ t & n, oA = new Uint32Array([
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
let rw = class extends hf {
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
    for (let u = 0; u < 16; u++, n += 4)
      Ls[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Ls[u - 15], y = Ls[u - 2], S = Ir(w, 7) ^ Ir(w, 18) ^ w >>> 3, v = Ir(y, 17) ^ Ir(y, 19) ^ y >>> 10;
      Ls[u] = v + Ls[u - 7] + S + Ls[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = Ir(c, 6) ^ Ir(c, 11) ^ Ir(c, 25), y = p + w + sA(c, l, d) + oA[u] + Ls[u] | 0, v = (Ir(r, 2) ^ Ir(r, 13) ^ Ir(r, 22)) + iA(r, s, i) | 0;
      p = d, d = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, d, p);
  }
  roundClean() {
    Ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, aA = class extends rw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const pf = Di(() => new rw());
Di(() => new aA());
const cA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), sw = Uint8Array.from({ length: 16 }, (e, t) => t), lA = sw.map((e) => (9 * e + 5) % 16);
let gf = [sw], yf = [lA];
for (let e = 0; e < 4; e++)
  for (let t of [gf, yf])
    t.push(t[e].map((n) => cA[n]));
const iw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), uA = gf.map((e, t) => e.map((n) => iw[t][n])), dA = yf.map((e, t) => e.map((n) => iw[t][n])), fA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), hA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qa = (e, t) => e << t | e >>> 32 - t;
function Cp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const ec = new Uint32Array(16);
let pA = class extends hf {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, l = c, d = this.h3 | 0, p = d, u = this.h4 | 0, w = u;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, v = fA[y], T = hA[y], U = gf[y], H = yf[y], E = uA[y], B = dA[y];
      for (let _ = 0; _ < 16; _++) {
        const Z = Qa(r + Cp(y, i, c, d) + ec[U[_]] + v, E[_]) + u | 0;
        r = u, u = d, d = Qa(c, 10) | 0, c = i, i = Z;
      }
      for (let _ = 0; _ < 16; _++) {
        const Z = Qa(s + Cp(S, o, l, p) + ec[H[_]] + T, B[_]) + w | 0;
        s = w, w = p, p = Qa(l, 10) | 0, l = o, o = Z;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    ec.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const gA = Di(() => new pA()), tc = BigInt(2 ** 32 - 1), sd = BigInt(32);
function ow(e, t = !1) {
  return t ? { h: Number(e & tc), l: Number(e >> sd & tc) } : { h: Number(e >> sd & tc) | 0, l: Number(e & tc) | 0 };
}
function yA(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = ow(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const wA = (e, t) => BigInt(e >>> 0) << sd | BigInt(t >>> 0), mA = (e, t, n) => e >>> n, bA = (e, t, n) => e << 32 - n | t >>> n, xA = (e, t, n) => e >>> n | t << 32 - n, SA = (e, t, n) => e << 32 - n | t >>> n, vA = (e, t, n) => e << 64 - n | t >>> n - 32, AA = (e, t, n) => e >>> n - 32 | t << 64 - n, EA = (e, t) => t, kA = (e, t) => e, $A = (e, t, n) => e << n | t >>> 32 - n, IA = (e, t, n) => t << n | e >>> 32 - n, LA = (e, t, n) => t << n - 32 | e >>> 64 - n, CA = (e, t, n) => e << n - 32 | t >>> 64 - n;
function TA(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const BA = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), MA = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, NA = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), _A = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, PA = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), UA = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, ze = {
  fromBig: ow,
  split: yA,
  toBig: wA,
  shrSH: mA,
  shrSL: bA,
  rotrSH: xA,
  rotrSL: SA,
  rotrBH: vA,
  rotrBL: AA,
  rotr32H: EA,
  rotr32L: kA,
  rotlSH: $A,
  rotlSL: IA,
  rotlBH: LA,
  rotlBL: CA,
  add: TA,
  add3L: BA,
  add3H: MA,
  add4L: NA,
  add4H: _A,
  add5H: UA,
  add5L: PA
}, [HA, OA] = ze.split([
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
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: l, Eh: d, El: p, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: T } = this;
    return [t, n, r, s, i, o, c, l, d, p, u, w, y, S, v, T];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l, d, p, u, w, y, S, v, T) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Cs[E] = t.getUint32(n), Ts[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const B = Cs[E - 15] | 0, _ = Ts[E - 15] | 0, Z = ze.rotrSH(B, _, 1) ^ ze.rotrSH(B, _, 8) ^ ze.shrSH(B, _, 7), de = ze.rotrSL(B, _, 1) ^ ze.rotrSL(B, _, 8) ^ ze.shrSL(B, _, 7), Q = Cs[E - 2] | 0, Y = Ts[E - 2] | 0, b = ze.rotrSH(Q, Y, 19) ^ ze.rotrBH(Q, Y, 61) ^ ze.shrSH(Q, Y, 6), I = ze.rotrSL(Q, Y, 19) ^ ze.rotrBL(Q, Y, 61) ^ ze.shrSL(Q, Y, 6), N = ze.add4L(de, I, Ts[E - 7], Ts[E - 16]), M = ze.add4H(N, Z, b, Cs[E - 7], Cs[E - 16]);
      Cs[E] = M | 0, Ts[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: l, Dh: d, Dl: p, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: T, Hh: U, Hl: H } = this;
    for (let E = 0; E < 80; E++) {
      const B = ze.rotrSH(u, w, 14) ^ ze.rotrSH(u, w, 18) ^ ze.rotrBH(u, w, 41), _ = ze.rotrSL(u, w, 14) ^ ze.rotrSL(u, w, 18) ^ ze.rotrBL(u, w, 41), Z = u & y ^ ~u & v, de = w & S ^ ~w & T, Q = ze.add5L(H, _, de, OA[E], Ts[E]), Y = ze.add5H(Q, U, B, Z, HA[E], Cs[E]), b = Q | 0, I = ze.rotrSH(r, s, 28) ^ ze.rotrBH(r, s, 34) ^ ze.rotrBH(r, s, 39), N = ze.rotrSL(r, s, 28) ^ ze.rotrBL(r, s, 34) ^ ze.rotrBL(r, s, 39), M = r & i ^ r & c ^ i & c, q = s & o ^ s & l ^ o & l;
      U = v | 0, H = T | 0, v = y | 0, T = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = ze.add(d | 0, p | 0, Y | 0, b | 0), d = c | 0, p = l | 0, c = i | 0, l = o | 0, i = r | 0, o = s | 0;
      const D = ze.add3L(b, N, q);
      r = ze.add3H(D, Y, I, M), s = D | 0;
    }
    ({ h: r, l: s } = ze.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ze.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l } = ze.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: d, l: p } = ze.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h: u, l: w } = ze.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = ze.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: T } = ze.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: H } = ze.add(this.Hh | 0, this.Hl | 0, U | 0, H | 0), this.set(r, s, i, o, c, l, d, p, u, w, y, S, v, T, U, H);
  }
  roundClean() {
    Cs.fill(0), Ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, DA = class extends Ll {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, FA = class extends Ll {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, jA = class extends Ll {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Di(() => new Ll());
Di(() => new DA());
const RA = Di(() => new FA());
Di(() => new jA());
var et;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(et || (et = {}));
var Zt;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(Zt || (Zt = {}));
function wf(e) {
  return Zt[e];
}
const zA = () => ({ type: et.BoolTrue }), GA = () => ({ type: et.BoolFalse }), KA = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: et.Buffer, value: Le(e) };
}, Tp = BigInt("0xffffffffffffffffffffffffffffffff"), VA = BigInt(0), Bp = BigInt("0x7fffffffffffffffffffffffffffffff"), Mp = BigInt("-170141183460469231731687303715884105728"), XA = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = Uu(ct(e))), Bn(e, Uint8Array) && (e = Uu(e));
  const t = gn(e);
  if (t > Bp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Bp}`);
  if (t < Mp)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Mp}`);
  return { type: et.Int, value: t };
}, YA = (e) => {
  const t = gn(e);
  if (t < VA)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Tp)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Tp}`);
  return { type: et.UInt, value: t };
};
function qA(e) {
  return { type: et.List, value: e };
}
function aw() {
  return { type: et.OptionalNone };
}
function cw(e) {
  return { type: et.OptionalSome, value: e };
}
var ge;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ge || (ge = {}));
function WA() {
  return {
    type: ge.Address,
    version: Li.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Np(e) {
  if (e && ww(e, Xc))
    throw new Error(`Memo exceeds maximum length of ${Xc} bytes`);
  return { type: ge.MemoString, content: e };
}
function mf(e, t) {
  return {
    type: ge.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function id(e) {
  if (ct(e).byteLength != $l)
    throw Error("Invalid signature");
  return {
    type: ge.MessageSignature,
    data: e
  };
}
function ZA(e, t, n) {
  return typeof e == "string" && (e = hE(e)), typeof n == "string" && (n = Np(n)), {
    type: ge.Payload,
    payloadType: pt.TokenTransfer,
    recipient: e,
    amount: gn(t),
    memo: n ?? Np("")
  };
}
function JA(e, t, n, r) {
  return typeof t == "string" && (t = br(t)), typeof n == "string" && (n = br(n)), {
    type: ge.Payload,
    payloadType: pt.ContractCall,
    contractAddress: typeof e == "string" ? qs(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function QA(e) {
  return br(e, 4, 1e5);
}
function _p(e, t, n) {
  return typeof e == "string" && (e = br(e)), typeof t == "string" && (t = QA(t)), typeof n == "number" ? {
    type: ge.Payload,
    payloadType: pt.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ge.Payload,
    payloadType: pt.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function eE() {
  return { type: ge.Payload, payloadType: pt.PoisonMicroblock };
}
function Pp(e, t) {
  if (e.byteLength != pi)
    throw Error(`Coinbase buffer size must be ${pi} bytes`);
  return t != null ? {
    type: ge.Payload,
    payloadType: pt.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ge.Payload,
    payloadType: pt.Coinbase,
    coinbaseBytes: e
  };
}
function tE(e, t, n) {
  if (e.byteLength != pi)
    throw Error(`Coinbase buffer size must be ${pi} bytes`);
  if (n.byteLength != Ju)
    throw Error(`VRF proof buffer size must be ${Ju} bytes`);
  return {
    type: ge.Payload,
    payloadType: pt.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === et.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function nE(e, t, n, r, s, i, o) {
  return {
    type: ge.Payload,
    payloadType: pt.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function br(e, t, n) {
  const r = t || 1, s = n || Dv;
  if (ww(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ge.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function rE(e, t, n) {
  return {
    type: ge.Asset,
    address: qs(e),
    contractName: br(t),
    assetName: br(n)
  };
}
function qs(e) {
  const t = Oi.c32addressDecode(e);
  return {
    type: ge.Address,
    version: t[0],
    hash160: t[1]
  };
}
function sE(e, t) {
  const n = qs(e), r = br(t);
  return {
    type: ge.Principal,
    prefix: vn.Contract,
    address: n,
    contractName: r
  };
}
function iE(e) {
  const t = qs(e);
  return {
    type: ge.Principal,
    prefix: vn.Standard,
    address: t
  };
}
function ho(e, t) {
  return {
    pubKeyEncoding: e,
    type: ge.TransactionAuthField,
    contents: t
  };
}
function Wr(e) {
  switch (e.type) {
    case ge.Address:
      return Ma(e);
    case ge.Principal:
      return lw(e);
    case ge.LengthPrefixedString:
      return Bo(e);
    case ge.MemoString:
      return aE(e);
    case ge.Asset:
      return dw(e);
    case ge.PostCondition:
      return hw(e);
    case ge.PublicKey:
      return cd(e);
    case ge.LengthPrefixedList:
      return bf(e);
    case ge.Payload:
      return pw(e);
    case ge.TransactionAuthField:
      return fE(e);
    case ge.MessageSignature:
      return xf(e);
  }
}
function Ma(e) {
  const t = [];
  return t.push(ct($a(e.version, 1))), t.push(ct(e.hash160)), zt(t);
}
function To(e) {
  const t = Bn(e, Et) ? e : new Et(e), n = hl(Le(t.readBytes(1))), r = Le(t.readBytes(20));
  return { type: ge.Address, version: n, hash160: r };
}
function lw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === vn.Standard || e.prefix === vn.Contract) && t.push(Ma(e.address)), e.prefix === vn.Contract && t.push(Bo(e.contractName)), zt(t);
}
function oE(e) {
  const t = Bn(e, Et) ? e : new Et(e), n = t.readUInt8Enum(vn, (i) => {
    throw new xn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === vn.Origin)
    return { type: ge.Principal, prefix: n };
  const r = To(t);
  if (n === vn.Standard)
    return { type: ge.Principal, prefix: n, address: r };
  const s = sr(t);
  return {
    type: ge.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Bo(e) {
  const t = [], n = _i(e.content), r = n.byteLength;
  return t.push(ct($a(r, e.lengthPrefixBytes))), t.push(n), zt(t);
}
function sr(e, t, n) {
  t = t || 1;
  const r = Bn(e, Et) ? e : new Et(e), s = hl(Le(r.readBytes(t))), i = Ia(r.readBytes(s));
  return br(i, t, n ?? 128);
}
function aE(e) {
  const t = [], n = _i(e.content), r = PE(Le(n), Xc * 2);
  return t.push(ct(r)), zt(t);
}
function uw(e) {
  const t = Bn(e, Et) ? e : new Et(e);
  let n = Ia(t.readBytes(Xc));
  return n = n.replace(/\u0000*$/, ""), { type: ge.MemoString, content: n };
}
function dw(e) {
  const t = [];
  return t.push(Ma(e.address)), t.push(Bo(e.contractName)), t.push(Bo(e.assetName)), zt(t);
}
function od(e) {
  const t = Bn(e, Et) ? e : new Et(e);
  return {
    type: ge.Asset,
    address: To(t),
    contractName: sr(t),
    assetName: sr(t)
  };
}
function bf(e) {
  const t = e.values, n = [];
  n.push(ct($a(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Wr(r));
  return zt(n);
}
function fw(e, t, n) {
  const r = Bn(e, Et) ? e : new Et(e), s = hl(Le(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (t) {
      case ge.Address:
        i.push(To(r));
        break;
      case ge.LengthPrefixedString:
        i.push(sr(r));
        break;
      case ge.MemoString:
        i.push(uw(r));
        break;
      case ge.Asset:
        i.push(od(r));
        break;
      case ge.PostCondition:
        i.push(lE(r));
        break;
      case ge.PublicKey:
        i.push(ld(r));
        break;
      case ge.TransactionAuthField:
        i.push(dE(r));
        break;
    }
  return mf(i, n);
}
function cE(e) {
  return Le(hw(e));
}
function hw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(lw(e.principal)), (e.conditionType === It.Fungible || e.conditionType === It.NonFungible) && t.push(dw(e.asset)), e.conditionType === It.NonFungible && t.push(Pr(e.assetName)), t.push(e.conditionCode), e.conditionType === It.STX || e.conditionType === It.Fungible || e.conditionType === It.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new fo("The post-condition amount may not be larger than 8 bytes");
    t.push(Xs(e.amount, 8));
  }
  return zt(t);
}
function lE(e) {
  const t = Bn(e, Et) ? e : new Et(e), n = t.readUInt8Enum(It, (c) => {
    throw new xn(`Could not read ${c} as PostConditionType`);
  }), r = oE(t);
  let s, i, o;
  switch (n) {
    case It.STX:
      return s = t.readUInt8Enum(la, (l) => {
        throw new xn(`Could not read ${l} as FungibleConditionCode`);
      }), o = BigInt(`0x${Le(t.readBytes(8))}`), {
        type: ge.PostCondition,
        conditionType: It.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case It.Fungible:
      return i = od(t), s = t.readUInt8Enum(la, (l) => {
        throw new xn(`Could not read ${l} as FungibleConditionCode`);
      }), o = BigInt(`0x${Le(t.readBytes(8))}`), {
        type: ge.PostCondition,
        conditionType: It.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case It.NonFungible:
      i = od(t);
      const c = Mr(t);
      return s = t.readUInt8Enum(ed, (l) => {
        throw new xn(`Could not read ${l} as FungibleConditionCode`);
      }), {
        type: ge.PostCondition,
        conditionType: It.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: c
      };
    case It.Staking:
      return s = t.readUInt8Enum(la, (l) => {
        throw new xn(`Could not read ${l} as FungibleConditionCode`);
      }), o = BigInt(`0x${Le(t.readBytes(8))}`), {
        type: ge.PostCondition,
        conditionType: It.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case It.PoX: {
      const l = t.readUInt8Enum(td, (d) => {
        throw new xn(`Could not read ${d} as PoxConditionCode`);
      });
      return {
        type: ge.PostCondition,
        conditionType: It.PoX,
        principal: r,
        conditionCode: l
      };
    }
  }
}
function pw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case pt.TokenTransfer:
      t.push(Pr(e.recipient)), t.push(Xs(e.amount, 8)), t.push(Wr(e.memo));
      break;
    case pt.ContractCall:
      t.push(Wr(e.contractAddress)), t.push(Wr(e.contractName)), t.push(Wr(e.functionName));
      const n = new Uint8Array(4);
      mi(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Pr(r));
      });
      break;
    case pt.SmartContract:
      t.push(Wr(e.contractName)), t.push(Wr(e.codeBody));
      break;
    case pt.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Wr(e.contractName)), t.push(Wr(e.codeBody));
      break;
    case pt.PoisonMicroblock:
      break;
    case pt.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case pt.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Pr(e.recipient));
      break;
    case pt.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Pr(e.recipient ? cw(e.recipient) : aw())), t.push(e.vrfProof);
      break;
    case pt.TenureChange:
      t.push(ct(e.tenureHash)), t.push(ct(e.previousTenureHash)), t.push(ct(e.burnViewHash)), t.push(ct(e.previousTenureEnd)), t.push(mi(new Uint8Array(4), e.previousTenureBlocks)), t.push(o1(new Uint8Array(1), e.cause)), t.push(ct(e.publicKeyHash));
      break;
  }
  return zt(t);
}
function uE(e) {
  const t = Bn(e, Et) ? e : new Et(e);
  switch (t.readUInt8Enum(pt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case pt.TokenTransfer:
      const r = Mr(t), s = gn(t.readBytes(8)), i = uw(t);
      return ZA(r, s, i);
    case pt.ContractCall:
      const o = To(t), c = sr(t), l = sr(t), d = [], p = t.readUInt32BE();
      for (let B = 0; B < p; B++) {
        const _ = Mr(t);
        d.push(_);
      }
      return JA(o, c, l, d);
    case pt.SmartContract:
      const u = sr(t), w = sr(t, 4, 1e5);
      return _p(u, w);
    case pt.VersionedSmartContract: {
      const B = t.readUInt8Enum(Qu, (de) => {
        throw new Error(`Cannot recognize ClarityVersion: ${de}`);
      }), _ = sr(t), Z = sr(t, 4, Wv);
      return _p(_, Z, B);
    }
    case pt.PoisonMicroblock:
      return eE();
    case pt.Coinbase: {
      const B = t.readBytes(pi);
      return Pp(B);
    }
    case pt.CoinbaseToAltRecipient: {
      const B = t.readBytes(pi), _ = Mr(t);
      return Pp(B, _);
    }
    case pt.NakamotoCoinbase: {
      const B = t.readBytes(pi), _ = Mr(t), Z = t.readBytes(Ju);
      return tE(B, _, Z);
    }
    case pt.TenureChange:
      const y = Le(t.readBytes(20)), S = Le(t.readBytes(20)), v = Le(t.readBytes(20)), T = Le(t.readBytes(32)), U = t.readUInt32BE(), H = t.readUInt8Enum(nd, (B) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${B}`);
      }), E = Le(t.readBytes(20));
      return nE(y, S, v, T, U, H, E);
  }
}
function ad(e) {
  const t = Bn(e, Et) ? e : new Et(e);
  return id(Le(t.readBytes($l)));
}
function dE(e) {
  const t = Bn(e, Et) ? e : new Et(e), n = t.readUInt8Enum(pr, (r) => {
    throw new xn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case pr.PublicKeyCompressed:
      return ho(Mt.Compressed, ld(t));
    case pr.PublicKeyUncompressed:
      return ho(Mt.Uncompressed, Do(VE(ld(t).data)));
    case pr.SignatureCompressed:
      return ho(Mt.Compressed, ad(t));
    case pr.SignatureUncompressed:
      return ho(Mt.Uncompressed, ad(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function xf(e) {
  return ct(e.data);
}
function fE(e) {
  const t = [];
  switch (e.contents.type) {
    case ge.PublicKey:
      t.push(e.pubKeyEncoding === Mt.Compressed ? pr.PublicKeyCompressed : pr.PublicKeyUncompressed), t.push(ct(KE(e.contents.data)));
      break;
    case ge.MessageSignature:
      t.push(e.pubKeyEncoding === Mt.Compressed ? pr.SignatureCompressed : pr.SignatureUncompressed), t.push(xf(e.contents));
      break;
  }
  return zt(t);
}
function cd(e) {
  return e.data.slice();
}
function ld(e) {
  const t = Bn(e, Et) ? e : new Et(e), n = t.readUInt8(), r = n === 4 ? Rv : jv;
  return Do(zt([n, t.readBytes(r)]));
}
function Sf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === bt.P2PKH || t === bt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === bt.P2WPKH || t === bt.P2WSH || t === bt.P2WSHNonSequential) && !r.map((s) => s.data).every(Fo))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case bt.P2PKH:
      return nc(e, UE(r[0].data));
    case bt.P2WPKH:
      return nc(e, HE(r[0].data));
    case bt.P2SH:
    case bt.P2SHNonSequential:
      return nc(e, OE(n, r.map(cd)));
    case bt.P2WSH:
    case bt.P2WSHNonSequential:
      return nc(e, DE(n, r.map(cd)));
  }
}
function nc(e, t) {
  return { type: ge.Address, version: e, hash160: t };
}
function vf(e) {
  return Oi.c32address(e.version, e.hash160);
}
function Up(e) {
  const [t, n, r] = e.split(/\.|::/);
  return rE(t, n, r);
}
function Zo(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return sE(t, n);
  } else
    return iE(e);
}
function hE(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return yE(t, n);
  } else
    return pE(e);
}
function pE(e) {
  const t = qs(e);
  return { type: et.PrincipalStandard, value: vf(t) };
}
function gE(e) {
  return { type: et.PrincipalStandard, value: vf(e) };
}
function yE(e, t) {
  const n = qs(e), r = br(t);
  return gw(n, r);
}
function gw(e, t) {
  if (_i(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: et.PrincipalContract,
    value: `${vf(e)}.${t.content}`
  };
}
function wE(e) {
  return { type: et.ResponseErr, value: e };
}
function mE(e) {
  return { type: et.ResponseOk, value: e };
}
const bE = (e) => ({ type: et.StringASCII, value: e }), xE = (e) => ({ type: et.StringUTF8, value: e });
function SE(e) {
  for (const t in e)
    if (!FE(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: et.Tuple, value: e };
}
function Mr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Et(ct(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Et(e) : t = e;
  switch (t.readUInt8Enum(Zt, (r) => {
    throw new xn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Zt.int:
      return XA(Uu(t.readBytes(16)));
    case Zt.uint:
      return YA(t.readBytes(16));
    case Zt.buffer:
      const r = t.readUInt32BE();
      return KA(t.readBytes(r));
    case Zt.true:
      return zA();
    case Zt.false:
      return GA();
    case Zt.address:
      const s = To(t);
      return gE(s);
    case Zt.contract:
      const i = To(t), o = sr(t);
      return gw(i, o);
    case Zt.ok:
      return mE(Mr(t));
    case Zt.err:
      return wE(Mr(t));
    case Zt.none:
      return aw();
    case Zt.some:
      return cw(Mr(t));
    case Zt.list:
      const c = t.readUInt32BE(), l = [];
      for (let v = 0; v < c; v++)
        l.push(Mr(t));
      return qA(l);
    case Zt.tuple:
      const d = t.readUInt32BE(), p = {};
      for (let v = 0; v < d; v++) {
        const T = sr(t).content;
        if (T === void 0)
          throw new xn('"content" is undefined');
        p[T] = Mr(t);
      }
      return SE(p);
    case Zt.ascii:
      const u = t.readUInt32BE(), w = Jb(t.readBytes(u));
      return bE(w);
    case Zt.utf8:
      const y = t.readUInt32BE(), S = Ia(t.readBytes(y));
      return xE(S);
    default:
      throw new xn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Dr(e, t) {
  return zt([wf(e), t]);
}
function vE(e) {
  return new Uint8Array([wf(e.type)]);
}
function AE(e) {
  return e.type === et.OptionalNone ? new Uint8Array([wf(e.type)]) : Dr(e.type, Pr(e.value));
}
function EE(e) {
  const t = new Uint8Array(4);
  return mi(t, Math.ceil(e.value.length / 2), 0), Dr(e.type, Hr(t, ct(e.value)));
}
function kE(e) {
  const t = zd(Xb(BigInt(e.value), BigInt(Fv)), Jy);
  return Dr(e.type, t);
}
function $E(e) {
  const t = zd(BigInt(e.value), Jy);
  return Dr(e.type, t);
}
function IE(e) {
  return Dr(e.type, Ma(qs(e.value)));
}
function LE(e) {
  const [t, n] = jE(e.value);
  return Dr(e.type, Hr(Ma(qs(t)), Bo(br(n))));
}
function CE(e) {
  return Dr(e.type, Pr(e.value));
}
function TE(e) {
  const t = [], n = new Uint8Array(4);
  mi(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = Pr(r);
    t.push(s);
  }
  return Dr(e.type, zt(t));
}
function BE(e) {
  const t = [], n = new Uint8Array(4);
  mi(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = br(s);
    t.push(Bo(i));
    const o = Pr(e.value[s]);
    t.push(o);
  }
  return Dr(e.type, zt(t));
}
function yw(e, t) {
  const n = [], r = t == "ascii" ? Zb(e.value) : _i(e.value), s = new Uint8Array(4);
  return mi(s, r.length, 0), n.push(s), n.push(r), Dr(e.type, zt(n));
}
function ME(e) {
  return yw(e, "ascii");
}
function NE(e) {
  return yw(e, "utf8");
}
function Hp(e) {
  return Le(Pr(e));
}
function Pr(e) {
  switch (e.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return vE(e);
    case et.OptionalNone:
    case et.OptionalSome:
      return AE(e);
    case et.Buffer:
      return EE(e);
    case et.UInt:
      return $E(e);
    case et.Int:
      return kE(e);
    case et.PrincipalStandard:
      return IE(e);
    case et.PrincipalContract:
      return LE(e);
    case et.ResponseOk:
    case et.ResponseErr:
      return CE(e);
    case et.List:
      return TE(e);
    case et.Tuple:
      return BE(e);
    case et.StringASCII:
      return ME(e);
    case et.StringUTF8:
      return NE(e);
    default:
      throw new fo("Unable to serialize. Invalid Clarity Value.");
  }
}
const _E = (e) => e.length % 2 ? `0${e}` : e, PE = (e, t) => e.padEnd(t, "0"), ww = (e, t) => e ? _i(e).length > t : !1;
function ud(e) {
  return Yy(e);
}
const ga = (e) => gA(pf(e)), Af = (e) => Le(RA(e)), UE = (e) => Le(ga(e)), HE = (e) => {
  const t = ga(e), n = Hr(new Uint8Array([0]), new Uint8Array([t.length]), t), r = ga(n);
  return Le(r);
}, OE = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + t.length), n.push(174);
  const r = zt(n), s = ga(r);
  return Le(s);
}, DE = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((l) => {
    n.push(l.length), n.push(l);
  }), n.push(80 + t.length), n.push(174);
  const r = zt(n), s = pf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = zt(i), c = ga(o);
  return Le(c);
};
function FE(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function jE(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
Ft.hmacSha256Sync = (e, ...t) => {
  const n = nw.create(pf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Do(e) {
  return e = typeof e == "string" ? ct(e) : e, {
    type: ge.PublicKey,
    data: e
  };
}
function RE(e, t, n = Mt.Compressed) {
  const r = n1(t), s = new Gn(Hh(r.r), Hh(r.s)), i = qe.fromSignature(e, s, r.recoveryId), o = n === Mt.Compressed;
  return i.toHex(o);
}
function zE(e) {
  return typeof e == "string" ? e : Le(e);
}
const Ef = zE;
function mw(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === t1;
}
function Fo(e) {
  return !Ef(e).startsWith("04");
}
function GE(e) {
  e = Gd(e);
  const t = mw(e);
  return Le(La(e.slice(0, 32), t));
}
function KE(e) {
  return qe.fromHex(Ef(e)).toHex(!0);
}
function VE(e) {
  return qe.fromHex(Ef(e)).toHex(!1);
}
function XE(e, t) {
  e = Gd(e);
  const [n, r] = gl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return $a(r, 1) + Gn.fromHex(n).toCompactHex();
}
function kf() {
  return {
    type: ge.MessageSignature,
    data: Le(new Uint8Array($l))
  };
}
function bw(e, t, n, r) {
  const s = Sf(0, e, 1, [Do(t)]).hash160, i = Fo(t) ? Mt.Compressed : Mt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: gn(n),
    fee: gn(r),
    keyEncoding: i,
    signature: kf()
  };
}
function ya(e) {
  return "signature" in e;
}
function Op(e) {
  return e === bt.P2SH || e === bt.P2WSH;
}
function YE(e) {
  return e === bt.P2SHNonSequential || e === bt.P2WSHNonSequential;
}
function Dp(e) {
  const t = ud(e);
  return t.nonce = 0, t.fee = 0, ya(t) ? t.signature = kf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function qE(e) {
  const t = [
    e.hashMode,
    ct(e.signer),
    Xs(e.nonce, 8),
    Xs(e.fee, 8),
    e.keyEncoding,
    xf(e.signature)
  ];
  return zt(t);
}
function WE(e) {
  const t = [
    e.hashMode,
    ct(e.signer),
    Xs(e.nonce, 8),
    Xs(e.fee, 8)
  ], n = mf(e.fields);
  t.push(bf(n));
  const r = new Uint8Array(2);
  return s1(r, e.signaturesRequired, 0), t.push(r), zt(t);
}
function ZE(e, t) {
  const n = Le(t.readBytes(20)), r = BigInt(`0x${Le(t.readBytes(8))}`), s = BigInt(`0x${Le(t.readBytes(8))}`), i = t.readUInt8Enum(Mt, (c) => {
    throw new xn(`Could not parse ${c} as PubKeyEncoding`);
  });
  if (e === bt.P2WPKH && i != Mt.Compressed)
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
function JE(e, t) {
  const n = Le(t.readBytes(20)), r = BigInt("0x" + Le(t.readBytes(8))), s = BigInt("0x" + Le(t.readBytes(8))), i = fw(t, ge.TransactionAuthField).values;
  let o = !1, c = 0;
  for (const d of i)
    switch (d.contents.type) {
      case ge.PublicKey:
        Fo(d.contents.data) || (o = !0);
        break;
      case ge.MessageSignature:
        if (d.pubKeyEncoding === Mt.Uncompressed && (o = !0), c += 1, c === 65536)
          throw new ui("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const l = t.readUInt16BE();
  if (o && (e === bt.P2WSH || e === bt.P2WSHNonSequential))
    throw new ui("Uncompressed keys are not allowed in this hash mode");
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
  return ya(e) ? qE(e) : WE(e);
}
function ou(e) {
  const t = e.readUInt8Enum(bt, (n) => {
    throw new xn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === bt.P2PKH || t === bt.P2WPKH ? ZE(t, e) : JE(t, e);
}
function xw(e, t, n, r) {
  const i = e + Le(new Uint8Array([t])) + Le(Xs(n, 8)) + Le(Xs(r, 8));
  if (ct(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Af(ct(i));
}
function Sw(e, t, n) {
  const r = 33 + $l, s = Fo(t.data) ? Mt.Compressed : Mt.Uncompressed, i = e + _E(s.toString(16)) + n, o = ct(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Af(o);
}
function QE(e, t, n, r, s) {
  const i = xw(e, t, n, r), o = XE(s, i), c = Do(GE(s)), l = Sw(i, c, o);
  return {
    nextSig: o,
    nextSigHash: l
  };
}
function vw(e, t, n, r, s, i) {
  const o = xw(e, t, n, r), c = Do(RE(o, i, s)), l = Sw(o, c, i);
  return {
    pubKey: c,
    nextSigHash: l
  };
}
function e3() {
  const e = bw(bt.P2PKH, "", 0, 0);
  return e.signer = WA().hash160, e.keyEncoding = Mt.Compressed, e.signature = kf(), e;
}
function Fp(e, t, n) {
  return ya(e) ? t3(e, t, n) : n3(e, t, n);
}
function t3(e, t, n) {
  const { pubKey: r, nextSigHash: s } = vw(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), i = Sf(0, e.hashMode, 1, [r]).hash160;
  if (i !== e.signer)
    throw new ui(`Signer hash does not equal hash of public key(s): ${i} != ${e.signer}`);
  return s;
}
function n3(e, t, n) {
  const r = [];
  let s = t, i = !1, o = 0;
  for (const l of e.fields)
    switch (l.contents.type) {
      case ge.PublicKey:
        Fo(l.contents.data) || (i = !0), r.push(l.contents);
        break;
      case ge.MessageSignature:
        l.pubKeyEncoding === Mt.Uncompressed && (i = !0);
        const { pubKey: d, nextSigHash: p } = vw(s, n, e.fee, e.nonce, l.pubKeyEncoding, l.contents.data);
        if (Op(e.hashMode) && (s = p), r.push(d), o += 1, o === 65536)
          throw new ui("Too many signatures");
        break;
    }
  if (Op(e.hashMode) && o !== e.signaturesRequired || YE(e.hashMode) && o < e.signaturesRequired)
    throw new ui("Incorrect number of signatures");
  if (i && (e.hashMode === bt.P2WSH || e.hashMode === bt.P2WSHNonSequential))
    throw new ui("Uncompressed keys are not allowed in this hash mode");
  const c = Sf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (c !== e.signer)
    throw new ui(`Signer hash does not equal hash of public key(s): ${c} != ${e.signer}`);
  return s;
}
function Aw(e) {
  return {
    authType: Ot.Standard,
    spendingCondition: e
  };
}
function Ew(e, t) {
  return {
    authType: Ot.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || bw(bt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function jp(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Ot.Standard:
        return Aw(Dp(e.spendingCondition));
      case Ot.Sponsored:
        return Ew(Dp(e.spendingCondition), e3());
      default:
        throw new qc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function r3(e, t) {
  switch (e.authType) {
    case Ot.Standard:
      return Fp(e.spendingCondition, t, Ot.Standard);
    case Ot.Sponsored:
      return Fp(e.spendingCondition, t, Ot.Standard);
    default:
      throw new qc("Invalid origin auth type");
  }
}
function s3(e, t) {
  switch (e.authType) {
    case Ot.Standard:
      const n = {
        ...e.spendingCondition,
        fee: gn(t)
      };
      return { ...e, spendingCondition: n };
    case Ot.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: gn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function i3(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: gn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function o3(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: gn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function a3(e, t) {
  const n = {
    ...t,
    nonce: gn(t.nonce),
    fee: gn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function c3(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Ot.Standard:
      t.push(iu(e.spendingCondition));
      break;
    case Ot.Sponsored:
      t.push(iu(e.spendingCondition)), t.push(iu(e.sponsorSpendingCondition));
      break;
  }
  return zt(t);
}
function l3(e) {
  const t = e.readUInt8Enum(Ot, (r) => {
    throw new xn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Ot.Standard:
      return n = ou(e), Aw(n);
    case Ot.Sponsored:
      n = ou(e);
      const r = ou(e);
      return Ew(n, r);
  }
}
class u3 {
  constructor({ auth: t, payload: n, postConditions: r = mf([]), postConditionMode: s = Yc.Deny, transactionVersion: i, chainId: o, network: c = "mainnet" }) {
    c = Hv(c), this.transactionVersion = i ?? c.transactionVersion, this.chainId = o ?? c.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: gn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Fn.Any;
  }
  signBegin() {
    const t = ud(this);
    return t.auth = jp(t.auth), t.txid();
  }
  verifyBegin() {
    const t = ud(this);
    return t.auth = jp(t.auth), t.txid();
  }
  verifyOrigin() {
    return r3(this.auth, this.verifyBegin());
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
    const n = typeof t == "object" && "type" in t ? t : Do(t), r = this.auth.spendingCondition;
    if (r && !ya(r)) {
      const s = Fo(n.data);
      r.fields.push(ho(s ? Mt.Compressed : Mt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: i, nextSigHash: o } = QE(n, r, t.fee, t.nonce, s);
    if (ya(t))
      t.signature = id(i);
    else {
      const c = mw(s);
      t.fields.push(ho(c ? Mt.Compressed : Mt.Uncompressed, id(i)));
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
    this.auth = a3(this.auth, t);
  }
  setFee(t) {
    this.auth = s3(this.auth, t);
  }
  setNonce(t) {
    this.auth = i3(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Ot.Sponsored)
      throw new qc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = o3(this.auth, t);
  }
  serialize() {
    return Le(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new fo('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new fo('"chainId" is undefined');
    if (this.auth === void 0)
      throw new fo('"auth" is undefined');
    if (this.payload === void 0)
      throw new fo('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return mi(n, this.chainId, 0), t.push(n), t.push(c3(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(bf(this.postConditions)), t.push(pw(this.payload)), zt(t);
  }
}
function d3(e) {
  const t = Bn(e, Et) ? e : new Et(e), n = t.readUInt8Enum(Ii, (p) => {
    throw new Error(`Could not parse ${p} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = l3(t), i = t.readUInt8Enum(Fn, (p) => {
    throw new Error(`Could not parse ${p} as AnchorMode`);
  }), o = t.readUInt8Enum(Yc, (p) => {
    throw new Error(`Could not parse ${p} as PostConditionMode`);
  }), c = fw(t, ge.PostCondition), l = uE(t), d = new u3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: l,
    postConditions: c,
    postConditionMode: o
  });
  return d.anchorMode = i, d;
}
const Rp = BigInt("18446744073709551615");
function au(e) {
  const t = gn(e);
  if (t < 0n || t > Rp)
    throw new RangeError(`Post-condition amount must be between 0 and ${Rp} (u64 max), received: ${t}`);
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
function f3(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: It.STX,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: vn.Origin } : Zo(e.address),
        conditionCode: rc(e.condition),
        amount: au(e.amount)
      };
    case "ft-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: It.Fungible,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: vn.Origin } : Zo(e.address),
        conditionCode: rc(e.condition),
        amount: au(e.amount),
        asset: Up(e.asset)
      };
    case "nft-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: It.NonFungible,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: vn.Origin } : Zo(e.address),
        conditionCode: rc(e.condition),
        asset: Up(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: It.Staking,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: vn.Origin } : Zo(e.address),
        conditionCode: rc(e.condition),
        amount: au(e.amount)
      };
    case "pox-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: It.PoX,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: vn.Origin } : Zo(e.address),
        conditionCode: h3(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function rc(e) {
  return dd[e];
}
function h3(e) {
  return fd[e];
}
function kw(e) {
  const t = f3(e);
  return cE(t);
}
function p3(e, t, n) {
  return If($w(e), n);
}
function $w(e, t) {
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
    return BigInt(`0x${w3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function $f(e, t = 8) {
  return (typeof e == "bigint" ? e : $w(e)).toString(16).padStart(t * 2, "0");
}
function If(e, t = 16) {
  const n = $f(e, t);
  return wa(n);
}
function g3(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const y3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function w3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += y3[n];
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
function m3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function b3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function zp(e) {
  if (e.some(b3))
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
function is(e) {
  return Cf(...e.map((t) => typeof t == "number" ? zp([t]) : t instanceof Array ? zp(t) : t));
}
function Cl(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var hd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(hd || (hd = {}));
hd.Mainnet;
const x3 = 128, S3 = 128, Iw = 16;
var pd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(pd || (pd = {}));
var Gp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Gp || (Gp = {}));
var Kp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Kp || (Kp = {}));
var fr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(fr || (fr = {}));
const cu = ["onChainOnly", "offChainOnly", "any"];
cu[0] + "", fr.OnChainOnly, cu[1] + "", fr.OffChainOnly, cu[2] + "", fr.Any, fr.OnChainOnly + "", fr.OnChainOnly, fr.OffChainOnly + "", fr.OffChainOnly, fr.Any + "", fr.Any;
var gd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(gd || (gd = {}));
gd.Mainnet;
var Vp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Vp || (Vp = {}));
var oi;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(oi || (oi = {}));
var Xp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Xp || (Xp = {}));
var Yp;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Yp || (Yp = {}));
var qp;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(qp || (qp = {}));
var Wp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Wp || (Wp = {}));
var Zp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Zp || (Zp = {}));
var Jp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Jp || (Jp = {}));
var yd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(yd || (yd = {}));
var Qp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Qp || (Qp = {}));
var e0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(e0 || (e0 = {}));
function wd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function v3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Lw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function A3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wd(e.outputLen), wd(e.blockLen);
}
function E3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function k3(e, t) {
  Lw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const lu = {
  number: wd,
  bool: v3,
  bytes: Lw,
  hash: A3,
  exists: E3,
  output: k3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Lr = (e, t) => e << 32 - t | e >>> t, $3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!$3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function I3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Cw(e) {
  if (typeof e == "string" && (e = I3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let L3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Fi(e) {
  const t = (r) => e().update(Cw(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function C3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + d, c, r);
}
let Tf = class extends L3 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = uu(this.buffer);
  }
  update(t) {
    lu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Cw(t);
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
    for (let u = o; u < s; u++)
      n[u] = 0;
    C3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = uu(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = l / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      c.setUint32(4 * u, p[u], i);
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
const T3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Tw = Uint8Array.from({ length: 16 }, (e, t) => t), B3 = Tw.map((e) => (9 * e + 5) % 16);
let Bf = [Tw], Mf = [B3];
for (let e = 0; e < 4; e++)
  for (let t of [Bf, Mf])
    t.push(t[e].map((n) => T3[n]));
const Bw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), M3 = Bf.map((e, t) => e.map((n) => Bw[t][n])), N3 = Mf.map((e, t) => e.map((n) => Bw[t][n])), _3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), P3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), sc = (e, t) => e << t | e >>> 32 - t;
function t0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const ic = new Uint32Array(16);
let U3 = class extends Tf {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, l = c, d = this.h3 | 0, p = d, u = this.h4 | 0, w = u;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, v = _3[y], T = P3[y], U = Bf[y], H = Mf[y], E = M3[y], B = N3[y];
      for (let _ = 0; _ < 16; _++) {
        const Z = sc(r + t0(y, i, c, d) + ic[U[_]] + v, E[_]) + u | 0;
        r = u, u = d, d = sc(c, 10) | 0, c = i, i = Z;
      }
      for (let _ = 0; _ < 16; _++) {
        const Z = sc(s + t0(S, o, l, p) + ic[H[_]] + T, B[_]) + w | 0;
        s = w, w = p, p = sc(l, 10) | 0, l = o, o = Z;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    ic.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Fi(() => new U3());
const H3 = (e, t, n) => e & t ^ ~e & n, O3 = (e, t, n) => e & t ^ e & n ^ t & n, D3 = new Uint32Array([
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
let Mw = class extends Tf {
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
    for (let u = 0; u < 16; u++, n += 4)
      Ms[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Ms[u - 15], y = Ms[u - 2], S = Lr(w, 7) ^ Lr(w, 18) ^ w >>> 3, v = Lr(y, 17) ^ Lr(y, 19) ^ y >>> 10;
      Ms[u] = v + Ms[u - 7] + S + Ms[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = Lr(c, 6) ^ Lr(c, 11) ^ Lr(c, 25), y = p + w + H3(c, l, d) + D3[u] + Ms[u] | 0, v = (Lr(r, 2) ^ Lr(r, 13) ^ Lr(r, 22)) + O3(r, s, i) | 0;
      p = d, d = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, d, p);
  }
  roundClean() {
    Ms.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, F3 = class extends Mw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Fi(() => new Mw());
Fi(() => new F3());
const oc = BigInt(2 ** 32 - 1), md = BigInt(32);
function Nw(e, t = !1) {
  return t ? { h: Number(e & oc), l: Number(e >> md & oc) } : { h: Number(e >> md & oc) | 0, l: Number(e & oc) | 0 };
}
function j3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = Nw(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const R3 = (e, t) => BigInt(e >>> 0) << md | BigInt(t >>> 0), z3 = (e, t, n) => e >>> n, G3 = (e, t, n) => e << 32 - n | t >>> n, K3 = (e, t, n) => e >>> n | t << 32 - n, V3 = (e, t, n) => e << 32 - n | t >>> n, X3 = (e, t, n) => e << 64 - n | t >>> n - 32, Y3 = (e, t, n) => e >>> n - 32 | t << 64 - n, q3 = (e, t) => t, W3 = (e, t) => e, Z3 = (e, t, n) => e << n | t >>> 32 - n, J3 = (e, t, n) => t << n | e >>> 32 - n, Q3 = (e, t, n) => t << n - 32 | e >>> 64 - n, e4 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function t4(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const n4 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), r4 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, s4 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), i4 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, o4 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), a4 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Ge = {
  fromBig: Nw,
  split: j3,
  toBig: R3,
  shrSH: z3,
  shrSL: G3,
  rotrSH: K3,
  rotrSL: V3,
  rotrBH: X3,
  rotrBL: Y3,
  rotr32H: q3,
  rotr32L: W3,
  rotlSH: Z3,
  rotlSL: J3,
  rotlBH: Q3,
  rotlBL: e4,
  add: t4,
  add3L: n4,
  add3H: r4,
  add4L: s4,
  add4H: i4,
  add5H: a4,
  add5L: o4
}, [c4, l4] = Ge.split([
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
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: l, Eh: d, El: p, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: T } = this;
    return [t, n, r, s, i, o, c, l, d, p, u, w, y, S, v, T];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l, d, p, u, w, y, S, v, T) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Ns[E] = t.getUint32(n), _s[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const B = Ns[E - 15] | 0, _ = _s[E - 15] | 0, Z = Ge.rotrSH(B, _, 1) ^ Ge.rotrSH(B, _, 8) ^ Ge.shrSH(B, _, 7), de = Ge.rotrSL(B, _, 1) ^ Ge.rotrSL(B, _, 8) ^ Ge.shrSL(B, _, 7), Q = Ns[E - 2] | 0, Y = _s[E - 2] | 0, b = Ge.rotrSH(Q, Y, 19) ^ Ge.rotrBH(Q, Y, 61) ^ Ge.shrSH(Q, Y, 6), I = Ge.rotrSL(Q, Y, 19) ^ Ge.rotrBL(Q, Y, 61) ^ Ge.shrSL(Q, Y, 6), N = Ge.add4L(de, I, _s[E - 7], _s[E - 16]), M = Ge.add4H(N, Z, b, Ns[E - 7], Ns[E - 16]);
      Ns[E] = M | 0, _s[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: l, Dh: d, Dl: p, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: T, Hh: U, Hl: H } = this;
    for (let E = 0; E < 80; E++) {
      const B = Ge.rotrSH(u, w, 14) ^ Ge.rotrSH(u, w, 18) ^ Ge.rotrBH(u, w, 41), _ = Ge.rotrSL(u, w, 14) ^ Ge.rotrSL(u, w, 18) ^ Ge.rotrBL(u, w, 41), Z = u & y ^ ~u & v, de = w & S ^ ~w & T, Q = Ge.add5L(H, _, de, l4[E], _s[E]), Y = Ge.add5H(Q, U, B, Z, c4[E], Ns[E]), b = Q | 0, I = Ge.rotrSH(r, s, 28) ^ Ge.rotrBH(r, s, 34) ^ Ge.rotrBH(r, s, 39), N = Ge.rotrSL(r, s, 28) ^ Ge.rotrBL(r, s, 34) ^ Ge.rotrBL(r, s, 39), M = r & i ^ r & c ^ i & c, q = s & o ^ s & l ^ o & l;
      U = v | 0, H = T | 0, v = y | 0, T = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Ge.add(d | 0, p | 0, Y | 0, b | 0), d = c | 0, p = l | 0, c = i | 0, l = o | 0, i = r | 0, o = s | 0;
      const D = Ge.add3L(b, N, q);
      r = Ge.add3H(D, Y, I, M), s = D | 0;
    }
    ({ h: r, l: s } = Ge.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ge.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l } = Ge.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: d, l: p } = Ge.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h: u, l: w } = Ge.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Ge.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: T } = Ge.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: H } = Ge.add(this.Hh | 0, this.Hl | 0, U | 0, H | 0), this.set(r, s, i, o, c, l, d, p, u, w, y, S, v, T, U, H);
  }
  roundClean() {
    Ns.fill(0), _s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, u4 = class extends Tl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, d4 = class extends Tl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, f4 = class extends Tl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Fi(() => new Tl());
Fi(() => new u4());
Fi(() => new d4());
Fi(() => new f4());
function h4(e, t, n) {
  const s = x3;
  if (C4(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: pd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var nn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(nn || (nn = {}));
let p4 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, _w = class extends p4 {
  constructor(t) {
    super(t);
  }
};
function Bl(e) {
  const t = [];
  return t.push(wa($f(e.version, 1))), t.push(wa(e.hash160)), is(t);
}
function g4(e) {
  const t = [];
  return t.push(e.prefix), t.push(Bl(e.address)), e.prefix === yd.Contract && t.push(ma(e.contractName)), is(t);
}
function ma(e) {
  const t = [], n = Lf(e.content), r = n.byteLength;
  return t.push(wa($f(r, e.lengthPrefixBytes))), t.push(n), is(t);
}
function y4(e) {
  const t = [];
  return t.push(Bl(e.address)), t.push(ma(e.contractName)), t.push(ma(e.assetName)), is(t);
}
function Pw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(g4(e.principal)), (e.conditionType === oi.Fungible || e.conditionType === oi.NonFungible) && t.push(y4(e.assetInfo)), e.conditionType === oi.NonFungible && t.push(Ci(e.assetName)), t.push(e.conditionCode), e.conditionType === oi.STX || e.conditionType === oi.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new _w("The post-condition amount may not be larger than 8 bytes");
    t.push(p3(e.amount, !1, 8));
  }
  return is(t);
}
function Fr(e, t) {
  return is([e, t]);
}
function w4(e) {
  return new Uint8Array([e.type]);
}
function m4(e) {
  return e.type === nn.OptionalNone ? new Uint8Array([e.type]) : Fr(e.type, Ci(e.value));
}
function b4(e) {
  const t = new Uint8Array(4);
  return Cl(t, e.buffer.length, 0), Fr(e.type, Cf(t, e.buffer));
}
function x4(e) {
  const t = If(g3(e.value, BigInt(S3)), Iw);
  return Fr(e.type, t);
}
function S4(e) {
  const t = If(e.value, Iw);
  return Fr(e.type, t);
}
function v4(e) {
  return Fr(e.type, Bl(e.address));
}
function A4(e) {
  return Fr(e.type, Cf(Bl(e.address), ma(e.contractName)));
}
function E4(e) {
  return Fr(e.type, Ci(e.value));
}
function k4(e) {
  const t = [], n = new Uint8Array(4);
  Cl(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Ci(r);
    t.push(s);
  }
  return Fr(e.type, is(t));
}
function $4(e) {
  const t = [], n = new Uint8Array(4);
  Cl(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = h4(s);
    t.push(ma(i));
    const o = Ci(e.data[s]);
    t.push(o);
  }
  return Fr(e.type, is(t));
}
function Uw(e, t) {
  const n = [], r = t == "ascii" ? m3(e.data) : Lf(e.data), s = new Uint8Array(4);
  return Cl(s, r.length, 0), n.push(s), n.push(r), Fr(e.type, is(n));
}
function I4(e) {
  return Uw(e, "ascii");
}
function L4(e) {
  return Uw(e, "utf8");
}
function Ci(e) {
  switch (e.type) {
    case nn.BoolTrue:
    case nn.BoolFalse:
      return w4(e);
    case nn.OptionalNone:
    case nn.OptionalSome:
      return m4(e);
    case nn.Buffer:
      return b4(e);
    case nn.UInt:
      return S4(e);
    case nn.Int:
      return x4(e);
    case nn.PrincipalStandard:
      return v4(e);
    case nn.PrincipalContract:
      return A4(e);
    case nn.ResponseOk:
    case nn.ResponseErr:
      return E4(e);
    case nn.List:
      return k4(e);
    case nn.Tuple:
      return $4(e);
    case nn.StringASCII:
      return I4(e);
    case nn.StringUTF8:
      return L4(e);
    default:
      throw new _w("Unable to serialize. Invalid Clarity Value.");
  }
}
const C4 = (e, t) => e ? Lf(e).length > t : !1, T4 = "connect-ui";
let Lc, Hw, jn = !1, bd = !1;
const ss = (e, t = "") => () => {
}, B4 = (e, t) => () => {
}, M4 = "{visibility:hidden}.hydrated{visibility:inherit}", n0 = {}, N4 = "http://www.w3.org/2000/svg", _4 = "http://www.w3.org/1999/xhtml", P4 = (e) => e != null, Nf = (e) => (e = typeof e, e === "object" || e === "function");
function Ow(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const De = (e, t, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], c = (d) => {
    for (let p = 0; p < d.length; p++)
      r = d[p], Array.isArray(r) ? c(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !Nf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? xd(null, r) : r), i = s);
  };
  if (c(n), t) {
    const d = t.className || t.class;
    d && (t.class = typeof d != "object" ? d : Object.keys(d).filter((p) => d[p]).join(" "));
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
}, U4 = {}, H4 = (e) => e && e.$tag$ === U4, O4 = (e, t) => e != null && !Nf(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, D4 = (e) => jo(e).$hostElement$, F4 = (e, t, n) => {
  const r = hn.ce(t, n);
  return e.dispatchEvent(r), r;
}, r0 = /* @__PURE__ */ new WeakMap(), j4 = (e, t, n) => {
  let r = Wc.get(e);
  ak && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, Wc.set(e, r);
}, R4 = (e, t, n, r) => {
  var s;
  let i = Dw(t);
  const o = Wc.get(i);
  if (e = e.nodeType === 11 ? e : Ur, o)
    if (typeof o == "string") {
      e = e.head || e;
      let c = r0.get(e), l;
      if (c || r0.set(e, c = /* @__PURE__ */ new Set()), !c.has(i)) {
        {
          l = Ur.createElement("style"), l.innerHTML = o;
          const d = (s = hn.$nonce$) !== null && s !== void 0 ? s : Ow(Ur);
          d != null && l.setAttribute("nonce", d), e.insertBefore(l, e.querySelector("link"));
        }
        c && c.add(i);
      }
    } else e.adoptedStyleSheets.includes(o) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, o]);
  return i;
}, z4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = ss("attachStyles", t.$tagName$), i = R4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Dw = (e, t) => "sc-" + e.$tagName$, s0 = (e, t, n, r, s, i) => {
  if (n !== r) {
    let o = o0(e, t), c = t.toLowerCase();
    if (t === "class") {
      const l = e.classList, d = i0(n), p = i0(r);
      l.remove(...d.filter((u) => u && !p.includes(u))), l.add(...p.filter((u) => u && !d.includes(u)));
    } else if (!o && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : o0(Ml, c) ? t = c.slice(2) : t = c[2] + t.slice(3), n && hn.rel(e, t, n, !1), r && hn.ael(e, t, r, !1);
    else {
      const l = Nf(r);
      if ((o || l && r !== null) && !s)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const d = r ?? "";
            t === "list" ? o = !1 : (n == null || e[t] != d) && (e[t] = d);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!o || i & 4 || s) && !l && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, G4 = /\s/, i0 = (e) => e ? e.split(G4) : [], Fw = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, i = e && e.$attrs$ || n0, o = t.$attrs$ || n0;
  for (r in i)
    r in o || s0(s, r, i[r], void 0, n, t.$flags$);
  for (r in o)
    s0(s, r, i[r], o[r], n, t.$flags$);
}, _f = (e, t, n, r) => {
  const s = t.$children$[n];
  let i = 0, o, c;
  if (s.$text$ !== null)
    o = s.$elm$ = Ur.createTextNode(s.$text$);
  else {
    if (jn || (jn = s.$tag$ === "svg"), o = s.$elm$ = Ur.createElementNS(jn ? N4 : _4, s.$tag$), jn && s.$tag$ === "foreignObject" && (jn = !1), Fw(null, s, jn), P4(Lc) && o["s-si"] !== Lc && o.classList.add(o["s-si"] = Lc), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        c = _f(e, s, i), c && o.appendChild(c);
    s.$tag$ === "svg" ? jn = !1 : o.tagName === "foreignObject" && (jn = !0);
  }
  return o;
}, jw = (e, t, n, r, s, i) => {
  let o = e, c;
  for (o.shadowRoot && o.tagName === Hw && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (c = _f(null, n, s), c && (r[s].$elm$ = c, o.insertBefore(c, t)));
}, Rw = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, K4 = (e, t, n, r) => {
  let s = 0, i = 0, o = t.length - 1, c = t[0], l = t[o], d = r.length - 1, p = r[0], u = r[d], w;
  for (; s <= o && i <= d; )
    c == null ? c = t[++s] : l == null ? l = t[--o] : p == null ? p = r[++i] : u == null ? u = r[--d] : ac(c, p) ? (sa(c, p), c = t[++s], p = r[++i]) : ac(l, u) ? (sa(l, u), l = t[--o], u = r[--d]) : ac(c, u) ? (sa(c, u), e.insertBefore(c.$elm$, l.$elm$.nextSibling), c = t[++s], u = r[--d]) : ac(l, p) ? (sa(l, p), e.insertBefore(l.$elm$, c.$elm$), l = t[--o], p = r[++i]) : (w = _f(t && t[i], n, i), p = r[++i], w && c.$elm$.parentNode.insertBefore(w, c.$elm$));
  s > o ? jw(e, r[d + 1] == null ? null : r[d + 1].$elm$, n, r, i, d) : i > d && Rw(t, s, o);
}, ac = (e, t) => e.$tag$ === t.$tag$, sa = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, i = t.$tag$, o = t.$text$;
  o === null ? (jn = i === "svg" ? !0 : i === "foreignObject" ? !1 : jn, Fw(e, t, jn), r !== null && s !== null ? K4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), jw(n, null, t, s, 0, s.length - 1)) : r !== null && Rw(r, 0, r.length - 1), jn && i === "svg" && (jn = !1)) : e.$text$ !== o && (n.data = o);
}, V4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || xd(null, null), s = H4(t) ? t : De(null, null, t);
  Hw = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Lc = n["s-sc"], sa(r, s);
}, zw = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, Pf = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return zw(e, e.$ancestorComponent$), lk(() => X4(e, t));
}, X4 = (e, t) => {
  const n = ss("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), Z4(s, () => Y4(e, r, t));
}, Y4 = async (e, t, n) => {
  const r = e.$hostElement$, s = ss("update", e.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && z4(e);
  const o = ss("render", e.$cmpMeta$.$tagName$);
  q4(e, t), i && (i.map((c) => c()), r["s-rc"] = void 0), o(), s();
  {
    const c = r["s-p"], l = () => W4(e);
    c.length === 0 ? l() : (Promise.all(c).then(l), e.$flags$ |= 4, c.length = 0);
  }
}, q4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, V4(e, t);
  } catch (r) {
    ba(r, e.$hostElement$);
  }
  return null;
}, W4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = ss("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Kw(n), r(), e.$onReadyResolve$(n), s || Gw()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && Hf(() => Pf(e, !1)), e.$flags$ &= -517;
}, Gw = (e) => {
  Kw(Ur.documentElement), Hf(() => F4(Ml, "appload", { detail: { namespace: T4 } }));
}, Z4 = (e, t) => e && e.then ? e.then(t) : t(), Kw = (e) => e.classList.add("hydrated"), J4 = (e, t) => jo(e).$instanceValues$.get(t), Q4 = (e, t, n, r) => {
  const s = jo(e), i = s.$instanceValues$.get(t), o = s.$flags$, c = s.$lazyInstance$;
  n = O4(n, r.$members$[t][0]);
  const l = Number.isNaN(i) && Number.isNaN(n), d = n !== i && !l;
  (!(o & 8) || i === void 0) && d && (s.$instanceValues$.set(t, n), c && (o & 18) === 2 && Pf(s, !1));
}, Vw = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return J4(this, i);
        },
        set(c) {
          Q4(this, i, c, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, c, l) {
        hn.jmp(() => {
          const d = i.get(o);
          if (this.hasOwnProperty(d))
            l = this[d], delete this[d];
          else if (s.hasOwnProperty(d) && typeof this[d] == "number" && this[d] == l)
            return;
          this[d] = l === null && typeof this[d] == "boolean" ? !1 : l;
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
}, ek = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = ok(n), s.then) {
        const l = B4();
        s = await s, l();
      }
      s.isProxied || (Vw(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const c = ss("createInstance", n.$tagName$);
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
      const l = Dw(n);
      if (!Wc.has(l)) {
        const d = ss("registerStyles", n.$tagName$);
        j4(l, c, !!(n.$flags$ & 1)), d();
      }
    }
  }
  const i = t.$ancestorComponent$, o = () => Pf(t, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, tk = (e) => {
  if (!(hn.$flags$ & 1)) {
    const t = jo(e), n = t.$cmpMeta$, r = ss("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            zw(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && e.hasOwnProperty(s)) {
          const o = e[s];
          delete e[s], e[s] = o;
        }
      }), ek(e, t, n);
    }
    r();
  }
}, nk = (e) => {
  hn.$flags$ & 1 || jo(e);
}, rk = (e, t = {}) => {
  var n;
  const r = ss(), s = [], i = t.exclude || [], o = Ml.customElements, c = Ur.head, l = /* @__PURE__ */ c.querySelector("meta[charset]"), d = /* @__PURE__ */ Ur.createElement("style"), p = [];
  let u, w = !0;
  Object.assign(hn, t), hn.$resourcesUrl$ = new URL(t.resourcesUrl || "./", Ur.baseURI).href, e.map((y) => {
    y[1].map((S) => {
      const v = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      v.$members$ = S[2];
      const T = v.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(H) {
          super(H), H = this, ik(H, v), v.$flags$ & 1 && H.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), w ? p.push(this) : hn.jmp(() => tk(this));
        }
        disconnectedCallback() {
          hn.jmp(() => nk(this));
        }
        componentOnReady() {
          return jo(this).$onReadyPromise$;
        }
      };
      v.$lazyBundleId$ = y[0], !i.includes(T) && !o.get(T) && (s.push(T), o.define(T, Vw(
        U,
        v,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    d.innerHTML = s + M4, d.setAttribute("data-styles", "");
    const y = (n = hn.$nonce$) !== null && n !== void 0 ? n : Ow(Ur);
    y != null && d.setAttribute("nonce", y), c.insertBefore(d, l ? l.nextSibling : c.firstChild);
  }
  w = !1, p.length ? p.map((y) => y.connectedCallback()) : hn.jmp(() => u = setTimeout(Gw, 30)), r();
}, Uf = /* @__PURE__ */ new WeakMap(), jo = (e) => Uf.get(e), sk = (e, t) => Uf.set(t.$lazyInstance$ = e, t), ik = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], Uf.set(e, n);
}, o0 = (e, t) => t in e, ba = (e, t) => (0, console.error)(e, t), du = /* @__PURE__ */ new Map(), ok = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, i = du.get(s);
  if (i)
    return i[r];
  {
    const o = (c) => (du.set(s, c), c[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => UL).then(o, ba);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (du.set(s, o), o[r]), ba);
}, Wc = /* @__PURE__ */ new Map(), Ml = typeof window < "u" ? window : {}, Ur = Ml.document || { head: {} }, hn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, Xw = (e) => Promise.resolve(e), ak = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), a0 = [], Yw = [], ck = (e, t) => (n) => {
  e.push(n), bd || (bd = !0, hn.$flags$ & 4 ? Hf(Sd) : hn.raf(Sd));
}, c0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      ba(n);
    }
  e.length = 0;
}, Sd = () => {
  c0(a0), c0(Yw), (bd = a0.length > 0) && hn.raf(Sd);
}, Hf = (e) => Xw().then(e), lk = /* @__PURE__ */ ck(Yw), uk = () => Xw(), dk = (e, t) => typeof window > "u" ? Promise.resolve() : uk().then(() => rk([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var fk = Object.defineProperty, hk = Object.defineProperties, pk = Object.getOwnPropertyDescriptors, Zc = Object.getOwnPropertySymbols, qw = Object.prototype.hasOwnProperty, Ww = Object.prototype.propertyIsEnumerable, l0 = (e, t, n) => t in e ? fk(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Vn = (e, t) => {
  for (var n in t || (t = {})) qw.call(t, n) && l0(e, n, t[n]);
  if (Zc) for (var n of Zc(t)) Ww.call(t, n) && l0(e, n, t[n]);
  return e;
}, xr = (e, t) => hk(e, pk(t)), Zw = (e, t) => {
  var n = {};
  for (var r in e) qw.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Zc) for (var r of Zc(e)) t.indexOf(r) < 0 && Ww.call(e, r) && (n[r] = e[r]);
  return n;
};
function Jw() {
  return kl(Ai()) || window.StacksProvider || window.BlockstackProvider;
}
function Nl(e) {
  return e ? typeof e == "string" ? ki.fromName(e) : "version" in e ? e : "url" in e ? new qu({ url: e.url }) : e.transactionVersion === Ii.Mainnet ? new qu({ url: e.client.baseUrl }) : new Wu({ url: e.client.baseUrl }) : new Wu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var gk = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(gk || {}), yk = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(yk || {}), Of = (e) => {
  let t = e;
  if (!t) {
    let n = new Bg(["store_write"], document.location.href);
    t = new Yu({ appConfig: n });
  }
  return t;
};
function Qw(e) {
  try {
    return Of(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var em = (e) => {
  let t = Of(e).loadUserData().appPrivateKey, n = un.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function wk(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let i = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, o = { [$i.Mainnet]: "mainnet", [$i.Testnet]: "testnet" }, c = Nl(s);
  return i == null ? void 0 : i[o[c.chainId]];
}
function mk(e) {
  let t = Nl(e.network), n = Of(e.userSession), r = xr(Vn({}, e), { network: t, userSession: n });
  return Vn({ stxAddress: wk(r) }, r);
}
async function bk(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(kw) : n = n.map((r) => Le(Pw(r)))), new un.TokenSigner("ES256k", t).signAsync(xr(Vn({}, e), { postConditions: n }));
}
function xk(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(kw) : t = t.map((n) => Le(Pw(n)))), un.createUnsecuredToken(xr(Vn({}, e), { postConditions: t }));
}
var Sk = async ({ token: e, options: t }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(e), { txRaw: c } = o, l = ct(c.replace(/^0x/, "")), d = d3(l);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, xr(Vn({}, o), { stacksTransaction: d }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, xr(Vn({}, o), { stacksTransaction: d }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = t.onCancel) == null || i.call(t);
  }
}, vk = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, i = Zw(t, ["amount", "appDetails", "userSession"]);
  if (Qw(s)) {
    let { privateKey: c, publicKey: l } = em(s), d = xr(Vn({}, i), { amount: n.toString(10), publicKey: l, txType: "token_transfer" });
    return r && (d.appDetails = r), bk(d, c);
  }
  let o = xr(Vn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), xk(o);
};
async function Ak(e, t, n) {
  let r = await t(xr(Vn(Vn({}, mk(e)), e), { network: Nl(e.network) }));
  return Sk({ token: r, options: e }, n);
}
function Ek(e, t = Jw()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return Ak(e, vk, t);
}
function tm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? xr(Vn({}, e), { message: Hp(t), domain: Hp(n) }) : xr(Vn({}, e), { message: Le(Ci(t)), domain: Le(Ci(n)) });
}
async function kk(e, t) {
  return new un.TokenSigner("ES256k", t).signAsync(tm(e));
}
async function $k(e) {
  let t = e, { userSession: n } = t, r = Zw(t, ["userSession"]);
  if (Qw(n)) {
    let { privateKey: s, publicKey: i } = em(n), o = xr(Vn({}, r), { publicKey: i });
    return kk(o, s);
  }
  return un.createUnsecuredToken(tm(e));
}
var Ik = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(Ik || {}), nm = "asigna-stx", u0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === nm && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Ck(e, t), "*");
}), Lk = { authenticationRequest: async (e) => u0(e, "authenticationRequest"), transactionRequest: async (e) => u0(e, "transactionRequest") }, Ck = (e, t) => ({ source: nm, [t]: e }), Tk = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Lk);
};
Tk();
var Bk = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function Mk(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let i = Ai(), o = Jw();
    if (i && o) return e(n, o);
    if (typeof window > "u") return;
    dk();
    let c = (s = n == null ? void 0 : n.defaultProviders) != null ? s : Bk, l = Av(c), d = document.createElement("connect-modal");
    d.defaultProviders = c, d.installedProviders = l, d.persistSelection = t;
    let p = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let u = () => {
      d.remove(), document.body.style.overflow = p;
    };
    d.callback = (y) => {
      u(), e(n, y);
    }, d.cancelCallback = () => {
      var y;
      u(), (y = n.onCancel) == null || y.call(n);
    }, document.body.appendChild(d);
    let w = (y) => {
      y.key === "Escape" && (document.removeEventListener("keydown", w), d.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var cc = Mk(Ek);
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ct(r);
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
      const r = Pk(BigInt(`0x${We(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${We(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function d0(e) {
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
  return Ct(n);
}
function Nk(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function _k(e, t) {
  return e & BigInt(1) << t;
}
function Pk(e, t) {
  return _k(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const Uk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function We(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Uk[n];
  return t;
}
function Ct(e) {
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
function Ro(e) {
  return new TextEncoder().encode(e);
}
function Ff(e) {
  return new TextDecoder().decode(e);
}
function rm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Hk(e) {
  return String.fromCharCode.apply(null, e);
}
function Ok(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function f0(e) {
  if (e.some(Ok))
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
function Gt(e) {
  return Pl(...e.map((t) => typeof t == "number" ? f0([t]) : t instanceof Array ? f0(t) : t));
}
var h0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(h0 || (h0 = {}));
var p0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(p0 || (p0 = {}));
var g0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(g0 || (g0 = {}));
const sm = 33, fu = 32;
function Dk(e) {
  if (e.length < fu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + fu * 2), r = e.slice(2 + fu * 2);
  return {
    recoveryId: _l(t),
    r: n,
    s: r
  };
}
function Fk(e) {
  const t = typeof e == "string" ? Ct(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function jk(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function Rk(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function zk(e, t) {
  return e[t];
}
function Gk(e, t, n = 0) {
  return e[n] = t, e;
}
function Kk(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Ti(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var vd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(vd || (vd = {}));
const Vk = vd.Mainnet, Xk = 128, Yk = 128, im = 16, gi = 32, Ad = 80, Ul = 65, qk = 32, Wk = 64, Jc = 34;
var Se;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Se || (Se = {}));
var Ye;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ye || (Ye = {}));
var Ed;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Ed || (Ed = {}));
var Cn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Cn || (Cn = {}));
const Cc = ["onChainOnly", "offChainOnly", "any"], y0 = {
  [Cc[0]]: Cn.OnChainOnly,
  [Cc[1]]: Cn.OffChainOnly,
  [Cc[2]]: Cn.Any,
  [Cn.OnChainOnly]: Cn.OnChainOnly,
  [Cn.OffChainOnly]: Cn.OffChainOnly,
  [Cn.Any]: Cn.Any
};
function Zk(e) {
  if (e in y0)
    return y0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${Cc.join(", ")}`);
}
var Qc;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Qc || (Qc = {}));
Qc.Mainnet;
var Mo;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Mo || (Mo = {}));
var Tn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Tn || (Tn = {}));
var Dt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Dt || (Dt = {}));
var xt;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(xt || (xt = {}));
var el;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(el || (el = {}));
var Nt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Nt || (Nt = {}));
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
var w0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(w0 || (w0 = {}));
var m0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(m0 || (m0 = {}));
function $d(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Jk(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function om(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Qk(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  $d(e.outputLen), $d(e.blockLen);
}
function e8(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function t8(e, t) {
  om(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const fi = {
  number: $d,
  bool: Jk,
  bytes: om,
  hash: Qk,
  exists: e8,
  output: t8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const hu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Cr = (e, t) => e << 32 - t | e >>> t, n8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!n8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function r8(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function jf(e) {
  if (typeof e == "string" && (e = r8(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class am {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ji(e) {
  const t = (r) => e().update(jf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function s8(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), l = r ? 4 : 0, d = r ? 0 : 4;
  e.setUint32(t + l, o, r), e.setUint32(t + d, c, r);
}
class Rf extends am {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = hu(this.buffer);
  }
  update(t) {
    fi.exists(this);
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
    fi.exists(this), fi.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    s8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = hu(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = l / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      c.setUint32(4 * u, p[u], i);
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
const i8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cm = Uint8Array.from({ length: 16 }, (e, t) => t), o8 = cm.map((e) => (9 * e + 5) % 16);
let zf = [cm], Gf = [o8];
for (let e = 0; e < 4; e++)
  for (let t of [zf, Gf])
    t.push(t[e].map((n) => i8[n]));
const lm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), a8 = zf.map((e, t) => e.map((n) => lm[t][n])), c8 = Gf.map((e, t) => e.map((n) => lm[t][n])), l8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), u8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), lc = (e, t) => e << t | e >>> 32 - t;
function b0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const uc = new Uint32Array(16);
class d8 extends Rf {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, l = c, d = this.h3 | 0, p = d, u = this.h4 | 0, w = u;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, v = l8[y], T = u8[y], U = zf[y], H = Gf[y], E = a8[y], B = c8[y];
      for (let _ = 0; _ < 16; _++) {
        const Z = lc(r + b0(y, i, c, d) + uc[U[_]] + v, E[_]) + u | 0;
        r = u, u = d, d = lc(c, 10) | 0, c = i, i = Z;
      }
      for (let _ = 0; _ < 16; _++) {
        const Z = lc(s + b0(S, o, l, p) + uc[H[_]] + T, B[_]) + w | 0;
        s = w, w = p, p = lc(l, 10) | 0, l = o, o = Z;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + l | 0);
  }
  roundClean() {
    uc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const f8 = ji(() => new d8()), h8 = (e, t, n) => e & t ^ ~e & n, p8 = (e, t, n) => e & t ^ e & n ^ t & n, g8 = new Uint32Array([
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
class um extends Rf {
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
    for (let u = 0; u < 16; u++, n += 4)
      Us[u] = t.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Us[u - 15], y = Us[u - 2], S = Cr(w, 7) ^ Cr(w, 18) ^ w >>> 3, v = Cr(y, 17) ^ Cr(y, 19) ^ y >>> 10;
      Us[u] = v + Us[u - 7] + S + Us[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: l, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = Cr(c, 6) ^ Cr(c, 11) ^ Cr(c, 25), y = p + w + h8(c, l, d) + g8[u] + Us[u] | 0, v = (Cr(r, 2) ^ Cr(r, 13) ^ Cr(r, 22)) + p8(r, s, i) | 0;
      p = d, d = l, l = c, c = o + y | 0, o = i, i = s, s = r, r = y + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, i, o, c, l, d, p);
  }
  roundClean() {
    Us.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class y8 extends um {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Kf = ji(() => new um());
ji(() => new y8());
const dc = BigInt(2 ** 32 - 1), Id = BigInt(32);
function dm(e, t = !1) {
  return t ? { h: Number(e & dc), l: Number(e >> Id & dc) } : { h: Number(e >> Id & dc) | 0, l: Number(e & dc) | 0 };
}
function w8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: i, l: o } = dm(e[s], t);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const m8 = (e, t) => BigInt(e >>> 0) << Id | BigInt(t >>> 0), b8 = (e, t, n) => e >>> n, x8 = (e, t, n) => e << 32 - n | t >>> n, S8 = (e, t, n) => e >>> n | t << 32 - n, v8 = (e, t, n) => e << 32 - n | t >>> n, A8 = (e, t, n) => e << 64 - n | t >>> n - 32, E8 = (e, t, n) => e >>> n - 32 | t << 64 - n, k8 = (e, t) => t, $8 = (e, t) => e, I8 = (e, t, n) => e << n | t >>> 32 - n, L8 = (e, t, n) => t << n | e >>> 32 - n, C8 = (e, t, n) => t << n - 32 | e >>> 64 - n, T8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function B8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const M8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), N8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, _8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), P8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, U8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), H8 = (e, t, n, r, s, i) => t + n + r + s + i + (e / 2 ** 32 | 0) | 0, Ke = {
  fromBig: dm,
  split: w8,
  toBig: m8,
  shrSH: b8,
  shrSL: x8,
  rotrSH: S8,
  rotrSL: v8,
  rotrBH: A8,
  rotrBL: E8,
  rotr32H: k8,
  rotr32L: $8,
  rotlSH: I8,
  rotlSL: L8,
  rotlBH: C8,
  rotlBL: T8,
  add: B8,
  add3L: M8,
  add3H: N8,
  add4L: _8,
  add4H: P8,
  add5H: H8,
  add5L: U8
}, [O8, D8] = Ke.split([
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
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: l, Eh: d, El: p, Fh: u, Fl: w, Gh: y, Gl: S, Hh: v, Hl: T } = this;
    return [t, n, r, s, i, o, c, l, d, p, u, w, y, S, v, T];
  }
  // prettier-ignore
  set(t, n, r, s, i, o, c, l, d, p, u, w, y, S, v, T) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Hs[E] = t.getUint32(n), Os[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const B = Hs[E - 15] | 0, _ = Os[E - 15] | 0, Z = Ke.rotrSH(B, _, 1) ^ Ke.rotrSH(B, _, 8) ^ Ke.shrSH(B, _, 7), de = Ke.rotrSL(B, _, 1) ^ Ke.rotrSL(B, _, 8) ^ Ke.shrSL(B, _, 7), Q = Hs[E - 2] | 0, Y = Os[E - 2] | 0, b = Ke.rotrSH(Q, Y, 19) ^ Ke.rotrBH(Q, Y, 61) ^ Ke.shrSH(Q, Y, 6), I = Ke.rotrSL(Q, Y, 19) ^ Ke.rotrBL(Q, Y, 61) ^ Ke.shrSL(Q, Y, 6), N = Ke.add4L(de, I, Os[E - 7], Os[E - 16]), M = Ke.add4H(N, Z, b, Hs[E - 7], Hs[E - 16]);
      Hs[E] = M | 0, Os[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: l, Dh: d, Dl: p, Eh: u, El: w, Fh: y, Fl: S, Gh: v, Gl: T, Hh: U, Hl: H } = this;
    for (let E = 0; E < 80; E++) {
      const B = Ke.rotrSH(u, w, 14) ^ Ke.rotrSH(u, w, 18) ^ Ke.rotrBH(u, w, 41), _ = Ke.rotrSL(u, w, 14) ^ Ke.rotrSL(u, w, 18) ^ Ke.rotrBL(u, w, 41), Z = u & y ^ ~u & v, de = w & S ^ ~w & T, Q = Ke.add5L(H, _, de, D8[E], Os[E]), Y = Ke.add5H(Q, U, B, Z, O8[E], Hs[E]), b = Q | 0, I = Ke.rotrSH(r, s, 28) ^ Ke.rotrBH(r, s, 34) ^ Ke.rotrBH(r, s, 39), N = Ke.rotrSL(r, s, 28) ^ Ke.rotrBL(r, s, 34) ^ Ke.rotrBL(r, s, 39), M = r & i ^ r & c ^ i & c, q = s & o ^ s & l ^ o & l;
      U = v | 0, H = T | 0, v = y | 0, T = S | 0, y = u | 0, S = w | 0, { h: u, l: w } = Ke.add(d | 0, p | 0, Y | 0, b | 0), d = c | 0, p = l | 0, c = i | 0, l = o | 0, i = r | 0, o = s | 0;
      const D = Ke.add3L(b, N, q);
      r = Ke.add3H(D, Y, I, M), s = D | 0;
    }
    ({ h: r, l: s } = Ke.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ke.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l } = Ke.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: d, l: p } = Ke.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h: u, l: w } = Ke.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: y, l: S } = Ke.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: v, l: T } = Ke.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: H } = Ke.add(this.Hh | 0, this.Hl | 0, U | 0, H | 0), this.set(r, s, i, o, c, l, d, p, u, w, y, S, v, T, U, H);
  }
  roundClean() {
    Hs.fill(0), Os.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class F8 extends Hl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class j8 extends Hl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class R8 extends Hl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ji(() => new Hl());
ji(() => new F8());
const z8 = ji(() => new j8());
ji(() => new R8());
function fm(e) {
  if (Ct(e).byteLength != Ul)
    throw Error("Invalid signature");
  return {
    type: Se.MessageSignature,
    data: e
  };
}
function ia(e, t) {
  return { type: Se.Address, version: e, hash160: t };
}
function po(e) {
  return Oi.c32address(e.version, e.hash160);
}
function Bi(e, t, n) {
  const r = t || 1, s = n || Xk;
  if (Cm(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Se.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Vf(e) {
  const t = Oi.c32addressDecode(e);
  return {
    type: Se.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ne;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ne || (ne = {}));
function G8(e) {
  if (e.type === ne.PrincipalStandard)
    return po(e.address);
  if (e.type === ne.PrincipalContract)
    return `${po(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function hm(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return X8(t, n);
  } else
    return K8(e);
}
function K8(e) {
  const t = Vf(e);
  return { type: ne.PrincipalStandard, address: t };
}
function V8(e) {
  return { type: ne.PrincipalStandard, address: e };
}
function X8(e, t) {
  const n = Vf(e), r = Bi(t);
  return pm(n, r);
}
function pm(e, t) {
  if (Ro(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ne.PrincipalContract, address: e, contractName: t };
}
function pu(e, t = !1) {
  switch (e.type) {
    case ne.BoolTrue:
      return !0;
    case ne.BoolFalse:
      return !1;
    case ne.Int:
    case ne.UInt:
      return t ? e.value.toString() : e.value;
    case ne.Buffer:
      return `0x${We(e.buffer)}`;
    case ne.OptionalNone:
      return null;
    case ne.OptionalSome:
      return gr(e.value);
    case ne.ResponseErr:
      return gr(e.value);
    case ne.ResponseOk:
      return gr(e.value);
    case ne.PrincipalStandard:
    case ne.PrincipalContract:
      return G8(e);
    case ne.List:
      return e.list.map((r) => gr(r));
    case ne.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = gr(e.data[r]);
      }), n;
    case ne.StringASCII:
      return e.data;
    case ne.StringUTF8:
      return e.data;
  }
}
function gr(e) {
  switch (e.type) {
    case ne.ResponseErr:
      return { type: js(e), value: pu(e, !0), success: !1 };
    case ne.ResponseOk:
      return { type: js(e), value: pu(e, !0), success: !0 };
    default:
      return { type: js(e), value: pu(e, !0) };
  }
}
function js(e) {
  switch (e.type) {
    case ne.BoolTrue:
    case ne.BoolFalse:
      return "bool";
    case ne.Int:
      return "int";
    case ne.UInt:
      return "uint";
    case ne.Buffer:
      return `(buff ${e.buffer.length})`;
    case ne.OptionalNone:
      return "(optional none)";
    case ne.OptionalSome:
      return `(optional ${js(e.value)})`;
    case ne.ResponseErr:
      return `(response UnknownType ${js(e.value)})`;
    case ne.ResponseOk:
      return `(response ${js(e.value)} UnknownType)`;
    case ne.PrincipalStandard:
    case ne.PrincipalContract:
      return "principal";
    case ne.List:
      return `(list ${e.list.length} ${e.list.length ? js(e.list[0]) : "UnknownType"})`;
    case ne.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${js(e.data[t])})`).join(" ")})`;
    case ne.StringASCII:
      return `(string-ascii ${rm(e.data).length})`;
    case ne.StringUTF8:
      return `(string-utf8 ${Ro(e.data).length})`;
  }
}
const gm = () => ({ type: ne.BoolTrue }), ym = () => ({ type: ne.BoolFalse }), Y8 = (e) => e ? gm() : ym(), x0 = BigInt("0xffffffffffffffffffffffffffffffff"), q8 = BigInt(0), S0 = BigInt("0x7fffffffffffffffffffffffffffffff"), v0 = BigInt("-170141183460469231731687303715884105728"), W8 = (e) => {
  const t = kn(e, !0);
  if (t > S0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${S0}`);
  if (t < v0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${v0}`);
  return { type: ne.Int, value: t };
}, En = (e) => {
  const t = kn(e, !1);
  if (t < q8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > x0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${x0}`);
  return { type: ne.UInt, value: t };
}, wm = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ne.Buffer, buffer: e };
};
function mm() {
  return { type: ne.OptionalNone };
}
function bm(e) {
  return { type: ne.OptionalSome, value: e };
}
function Z8(e) {
  return { type: ne.ResponseErr, value: e };
}
function J8(e) {
  return { type: ne.ResponseOk, value: e };
}
function Q8(e) {
  return { type: ne.List, list: e };
}
function Sr(e) {
  for (const t in e)
    if (!R$(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ne.Tuple, data: e };
}
const St = (e) => ({ type: ne.StringASCII, data: e }), e$ = (e) => ({ type: ne.StringUTF8, data: e });
class xm extends am {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, fi.hash(t);
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
}
const Sm = (e, t, n) => new xm(e, t).update(n).digest();
Sm.create = (e, t) => new xm(e, t);
Ft.hmacSha256Sync = (e, ...t) => {
  const n = Sm.create(Kf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function No(e) {
  return {
    type: Se.PublicKey,
    data: Ct(e)
  };
}
function t$(e, t, n = Nt.Compressed) {
  const r = Dk(t.data), s = new Gn(d0(r.r), d0(r.s)), i = qe.fromSignature(e, s, r.recoveryId), o = n === Nt.Compressed;
  return i.toHex(o);
}
function n$(e) {
  return { type: Se.PublicKey, data: e };
}
function zo(e) {
  return !We(e.data).startsWith("04");
}
function tl(e) {
  return e.data.slice();
}
function r$(e) {
  const t = o$(e), n = La(t.data.slice(0, 32), t.compressed);
  return No(We(n));
}
function s$(e) {
  const t = typeof e == "string" ? e : We(e), n = qe.fromHex(t).toHex(!0);
  return No(n);
}
function i$(e) {
  const t = typeof e == "string" ? e : We(e), n = qe.fromHex(t).toHex(!1);
  return No(n);
}
function Ld(e) {
  const t = e.readUInt8(), n = t === 4 ? Wk : qk;
  return n$(Gt([t, e.readBytes(n)]));
}
function o$(e) {
  const t = Fk(e), n = t.length == sm;
  return { data: t, compressed: n };
}
function a$(e, t) {
  const [n, r] = gl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Na(r, 1) + Gn.fromHex(n).toCompactHex();
  return fm(i);
}
function c$(e) {
  return r$(e.data);
}
function l$(e, t, n) {
  return typeof e == "string" && (e = hm(e)), typeof n == "string" && (n = k0(n)), {
    type: Se.Payload,
    payloadType: Ye.TokenTransfer,
    recipient: e,
    amount: kn(t, !1),
    memo: n ?? k0("")
  };
}
function u$(e, t, n, r) {
  return typeof e == "string" && (e = Vf(e)), typeof t == "string" && (t = Bi(t)), typeof n == "string" && (n = Bi(n)), {
    type: Se.Payload,
    payloadType: Ye.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function A0(e, t, n) {
  return typeof e == "string" && (e = Bi(e)), typeof t == "string" && (t = b$(t)), typeof n == "number" ? {
    type: Se.Payload,
    payloadType: Ye.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Se.Payload,
    payloadType: Ye.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function d$() {
  return { type: Se.Payload, payloadType: Ye.PoisonMicroblock };
}
function E0(e, t) {
  if (e.byteLength != gi)
    throw Error(`Coinbase buffer size must be ${gi} bytes`);
  return t != null ? {
    type: Se.Payload,
    payloadType: Ye.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Se.Payload,
    payloadType: Ye.Coinbase,
    coinbaseBytes: e
  };
}
function f$(e, t, n) {
  if (e.byteLength != gi)
    throw Error(`Coinbase buffer size must be ${gi} bytes`);
  if (n.byteLength != Ad)
    throw Error(`VRF proof buffer size must be ${Ad} bytes`);
  return {
    type: Se.Payload,
    payloadType: Ye.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ne.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var Cd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Cd || (Cd = {}));
function h$(e, t, n, r, s, i, o) {
  return {
    type: Se.Payload,
    payloadType: Ye.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function vm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case Ye.TokenTransfer:
      t.push(jt(e.recipient)), t.push(Ys(e.amount, !1, 8)), t.push(Zr(e.memo));
      break;
    case Ye.ContractCall:
      t.push(Zr(e.contractAddress)), t.push(Zr(e.contractName)), t.push(Zr(e.functionName));
      const n = new Uint8Array(4);
      Ti(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(jt(r));
      });
      break;
    case Ye.SmartContract:
      t.push(Zr(e.contractName)), t.push(Zr(e.codeBody));
      break;
    case Ye.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Zr(e.contractName)), t.push(Zr(e.codeBody));
      break;
    case Ye.PoisonMicroblock:
      break;
    case Ye.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case Ye.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(jt(e.recipient));
      break;
    case Ye.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(jt(e.recipient ? bm(e.recipient) : mm())), t.push(e.vrfProof);
      break;
    case Ye.TenureChange:
      t.push(Ct(e.tenureHash)), t.push(Ct(e.previousTenureHash)), t.push(Ct(e.burnViewHash)), t.push(Ct(e.previousTenureEnd)), t.push(Ti(new Uint8Array(4), e.previousTenureBlocks)), t.push(Gk(new Uint8Array(1), e.cause)), t.push(Ct(e.publicKeyHash));
      break;
  }
  return Gt(t);
}
function p$(e) {
  switch (e.readUInt8Enum(Ye, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ye.TokenTransfer:
      const n = or(e), r = kn(e.readBytes(8), !1), s = Em(e);
      return l$(n, r, s);
    case Ye.ContractCall:
      const i = _o(e), o = ir(e), c = ir(e), l = [], d = e.readUInt32BE();
      for (let E = 0; E < d; E++) {
        const B = or(e);
        l.push(B);
      }
      return u$(i, o, c, l);
    case Ye.SmartContract:
      const p = ir(e), u = ir(e, 4, 1e5);
      return A0(p, u);
    case Ye.VersionedSmartContract: {
      const E = e.readUInt8Enum(Ed, (Z) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Z}`);
      }), B = ir(e), _ = ir(e, 4, 1e5);
      return A0(B, _, E);
    }
    case Ye.PoisonMicroblock:
      return d$();
    case Ye.Coinbase: {
      const E = e.readBytes(gi);
      return E0(E);
    }
    case Ye.CoinbaseToAltRecipient: {
      const E = e.readBytes(gi), B = or(e);
      return E0(E, B);
    }
    case Ye.NakamotoCoinbase: {
      const E = e.readBytes(gi), B = or(e), _ = e.readBytes(Ad);
      return f$(E, B, _);
    }
    case Ye.TenureChange:
      const w = We(e.readBytes(20)), y = We(e.readBytes(20)), S = We(e.readBytes(20)), v = We(e.readBytes(32)), T = e.readUInt32BE(), U = e.readUInt8Enum(Cd, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), H = We(e.readBytes(20));
      return h$(w, y, S, v, T, U, H);
  }
}
class Ol extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ai extends Ol {
  constructor(t) {
    super(t);
  }
}
class zn extends Ol {
  constructor(t) {
    super(t);
  }
}
class nl extends Ol {
  constructor(t) {
    super(t);
  }
}
class hi extends Ol {
  constructor(t) {
    super(t);
  }
}
var yr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(yr || (yr = {}));
function Td(e) {
  return fm(We(e.readBytes(Ul)));
}
function go(e, t) {
  return {
    pubKeyEncoding: e,
    type: Se.TransactionAuthField,
    contents: t
  };
}
function g$(e) {
  const t = e.readUInt8Enum(yr, (n) => {
    throw new zn(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case yr.PublicKeyCompressed:
      return go(Nt.Compressed, Ld(e));
    case yr.PublicKeyUncompressed:
      return go(Nt.Uncompressed, i$(Ld(e).data));
    case yr.SignatureCompressed:
      return go(Nt.Compressed, Td(e));
    case yr.SignatureUncompressed:
      return go(Nt.Uncompressed, Td(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function Xf(e) {
  return Ct(e.data);
}
function y$(e) {
  const t = [];
  switch (e.contents.type) {
    case Se.PublicKey:
      t.push(e.pubKeyEncoding === Nt.Compressed ? yr.PublicKeyCompressed : yr.PublicKeyUncompressed), t.push(tl(s$(e.contents.data)));
      break;
    case Se.MessageSignature:
      t.push(e.pubKeyEncoding === Nt.Compressed ? yr.SignatureCompressed : yr.SignatureUncompressed), t.push(Xf(e.contents));
      break;
  }
  return Gt(t);
}
function Zr(e) {
  switch (e.type) {
    case Se.Address:
      return _a(e);
    case Se.Principal:
      return Am(e);
    case Se.LengthPrefixedString:
      return Po(e);
    case Se.MemoString:
      return x$(e);
    case Se.AssetInfo:
      return km(e);
    case Se.PostCondition:
      return S$(e);
    case Se.PublicKey:
      return tl(e);
    case Se.LengthPrefixedList:
      return Wf(e);
    case Se.Payload:
      return vm(e);
    case Se.TransactionAuthField:
      return y$(e);
    case Se.MessageSignature:
      return Xf(e);
  }
}
function w$() {
  return {
    type: Se.Address,
    version: el.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Yf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === xt.SerializeP2PKH || t === xt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === xt.SerializeP2WPKH || t === xt.SerializeP2WSH || t === xt.SerializeP2WSHNonSequential) && !r.every(zo))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case xt.SerializeP2PKH:
      return ia(e, O$(r[0].data));
    case xt.SerializeP2WPKH:
      return ia(e, D$(r[0].data));
    case xt.SerializeP2SH:
    case xt.SerializeP2SHNonSequential:
      return ia(e, F$(n, r.map(tl)));
    case xt.SerializeP2WSH:
    case xt.SerializeP2WSHNonSequential:
      return ia(e, j$(n, r.map(tl)));
  }
}
function _a(e) {
  const t = [];
  return t.push(Ct(Na(e.version, 1))), t.push(Ct(e.hash160)), Gt(t);
}
function _o(e) {
  const t = _l(We(e.readBytes(1))), n = We(e.readBytes(20));
  return { type: Se.Address, version: t, hash160: n };
}
function Am(e) {
  const t = [];
  return t.push(e.prefix), t.push(_a(e.address)), e.prefix === Sa.Contract && t.push(Po(e.contractName)), Gt(t);
}
function m$(e) {
  const t = e.readUInt8Enum(Sa, (s) => {
    throw new zn(`Unexpected Principal payload type: ${s}`);
  }), n = _o(e);
  if (t === Sa.Standard)
    return { type: Se.Principal, prefix: t, address: n };
  const r = ir(e);
  return {
    type: Se.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function Po(e) {
  const t = [], n = Ro(e.content), r = n.byteLength;
  return t.push(Ct(Na(r, e.lengthPrefixBytes))), t.push(n), Gt(t);
}
function ir(e, t, n) {
  t = t || 1;
  const r = _l(We(e.readBytes(t))), s = Ff(e.readBytes(r));
  return Bi(s, t, n ?? 128);
}
function b$(e) {
  return Bi(e, 4, 1e5);
}
function k0(e) {
  if (e && Cm(e, Jc))
    throw new Error(`Memo exceeds maximum length of ${Jc} bytes`);
  return { type: Se.MemoString, content: e };
}
function x$(e) {
  const t = [], n = Ro(e.content), r = H$(We(n), Jc * 2);
  return t.push(Ct(r)), Gt(t);
}
function Em(e) {
  let t = Ff(e.readBytes(Jc));
  return t = t.replace(/\u0000*$/, ""), { type: Se.MemoString, content: t };
}
function km(e) {
  const t = [];
  return t.push(_a(e.address)), t.push(Po(e.contractName)), t.push(Po(e.assetName)), Gt(t);
}
function Bd(e) {
  return {
    type: Se.AssetInfo,
    address: _o(e),
    contractName: ir(e),
    assetName: ir(e)
  };
}
function qf(e, t) {
  return {
    type: Se.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Wf(e) {
  const t = e.values, n = [];
  n.push(Ct(Na(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Zr(r));
  return Gt(n);
}
function $m(e, t, n) {
  const r = _l(We(e.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (t) {
      case Se.Address:
        s.push(_o(e));
        break;
      case Se.LengthPrefixedString:
        s.push(ir(e));
        break;
      case Se.MemoString:
        s.push(Em(e));
        break;
      case Se.AssetInfo:
        s.push(Bd(e));
        break;
      case Se.PostCondition:
        s.push(v$(e));
        break;
      case Se.PublicKey:
        s.push(Ld(e));
        break;
      case Se.TransactionAuthField:
        s.push(g$(e));
        break;
    }
  return qf(s, n);
}
function S$(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Am(e.principal)), (e.conditionType === Tn.Fungible || e.conditionType === Tn.NonFungible) && t.push(km(e.assetInfo)), e.conditionType === Tn.NonFungible && t.push(jt(e.assetName)), t.push(e.conditionCode), e.conditionType === Tn.STX || e.conditionType === Tn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new ai("The post-condition amount may not be larger than 8 bytes");
    t.push(Ys(e.amount, !1, 8));
  }
  return Gt(t);
}
function v$(e) {
  const t = e.readUInt8Enum(Tn, (o) => {
    throw new zn(`Could not read ${o} as PostConditionType`);
  }), n = m$(e);
  let r, s, i;
  switch (t) {
    case Tn.STX:
      return r = e.readUInt8Enum(xa, (c) => {
        throw new zn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${We(e.readBytes(8))}`), {
        type: Se.PostCondition,
        conditionType: Tn.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Tn.Fungible:
      return s = Bd(e), r = e.readUInt8Enum(xa, (c) => {
        throw new zn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${We(e.readBytes(8))}`), {
        type: Se.PostCondition,
        conditionType: Tn.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Tn.NonFungible:
      s = Bd(e);
      const o = or(e);
      return r = e.readUInt8Enum(kd, (c) => {
        throw new zn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: Se.PostCondition,
        conditionType: Tn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function jr(e, t) {
  return Gt([e, t]);
}
function A$(e) {
  return new Uint8Array([e.type]);
}
function E$(e) {
  return e.type === ne.OptionalNone ? new Uint8Array([e.type]) : jr(e.type, jt(e.value));
}
function k$(e) {
  const t = new Uint8Array(4);
  return Ti(t, e.buffer.length, 0), jr(e.type, Pl(t, e.buffer));
}
function $$(e) {
  const t = Df(Nk(e.value, BigInt(Yk)), im);
  return jr(e.type, t);
}
function I$(e) {
  const t = Df(e.value, im);
  return jr(e.type, t);
}
function L$(e) {
  return jr(e.type, _a(e.address));
}
function C$(e) {
  return jr(e.type, Pl(_a(e.address), Po(e.contractName)));
}
function T$(e) {
  return jr(e.type, jt(e.value));
}
function B$(e) {
  const t = [], n = new Uint8Array(4);
  Ti(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = jt(r);
    t.push(s);
  }
  return jr(e.type, Gt(t));
}
function M$(e) {
  const t = [], n = new Uint8Array(4);
  Ti(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Bi(s);
    t.push(Po(i));
    const o = jt(e.data[s]);
    t.push(o);
  }
  return jr(e.type, Gt(t));
}
function Im(e, t) {
  const n = [], r = t == "ascii" ? rm(e.data) : Ro(e.data), s = new Uint8Array(4);
  return Ti(s, r.length, 0), n.push(s), n.push(r), jr(e.type, Gt(n));
}
function N$(e) {
  return Im(e, "ascii");
}
function _$(e) {
  return Im(e, "utf8");
}
function jt(e) {
  switch (e.type) {
    case ne.BoolTrue:
    case ne.BoolFalse:
      return A$(e);
    case ne.OptionalNone:
    case ne.OptionalSome:
      return E$(e);
    case ne.Buffer:
      return k$(e);
    case ne.UInt:
      return I$(e);
    case ne.Int:
      return $$(e);
    case ne.PrincipalStandard:
      return L$(e);
    case ne.PrincipalContract:
      return C$(e);
    case ne.ResponseOk:
    case ne.ResponseErr:
      return T$(e);
    case ne.List:
      return B$(e);
    case ne.Tuple:
      return M$(e);
    case ne.StringASCII:
      return N$(e);
    case ne.StringUTF8:
      return _$(e);
    default:
      throw new ai("Unable to serialize. Invalid Clarity Value.");
  }
}
function P$(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const $0 = /* @__PURE__ */ new Map();
function Lm(e, t) {
  const n = $0.get(e);
  if (n !== void 0)
    return n(t);
  const r = P$(e);
  return $0.set(e, r), Lm(e, t);
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
    return Kk(this.readBytes(4), 0);
  }
  readUInt8() {
    return zk(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return jk(this.readBytes(2), 0);
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
    if (Lm(t, r))
      return r;
    throw n(r);
  }
}
function or(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new ua(Ct(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new ua(e) : t = e;
  switch (t.readUInt8Enum(ne, (r) => {
    throw new zn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ne.Int:
      return W8(t.readBytes(16));
    case ne.UInt:
      return En(t.readBytes(16));
    case ne.Buffer:
      const r = t.readUInt32BE();
      return wm(t.readBytes(r));
    case ne.BoolTrue:
      return gm();
    case ne.BoolFalse:
      return ym();
    case ne.PrincipalStandard:
      const s = _o(t);
      return V8(s);
    case ne.PrincipalContract:
      const i = _o(t), o = ir(t);
      return pm(i, o);
    case ne.ResponseOk:
      return J8(or(t));
    case ne.ResponseErr:
      return Z8(or(t));
    case ne.OptionalNone:
      return mm();
    case ne.OptionalSome:
      return bm(or(t));
    case ne.List:
      const c = t.readUInt32BE(), l = [];
      for (let v = 0; v < c; v++)
        l.push(or(t));
      return Q8(l);
    case ne.Tuple:
      const d = t.readUInt32BE(), p = {};
      for (let v = 0; v < d; v++) {
        const T = ir(t).content;
        if (T === void 0)
          throw new zn('"content" is undefined');
        p[T] = or(t);
      }
      return Sr(p);
    case ne.StringASCII:
      const u = t.readUInt32BE(), w = Hk(t.readBytes(u));
      return St(w);
    case ne.StringUTF8:
      const y = t.readUInt32BE(), S = Ff(t.readBytes(y));
      return e$(S);
    default:
      throw new zn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const U$ = (e) => e.length % 2 == 0 ? e : `0${e}`, H$ = (e, t) => e.padEnd(t, "0"), Cm = (e, t) => e ? Ro(e).length > t : !1;
function Md(e) {
  return Yy(e);
}
const va = (e) => f8(Kf(e)), Zf = (e) => We(z8(e)), O$ = (e) => We(va(e)), D$ = (e) => {
  const t = va(e), n = Pl(new Uint8Array([0]), new Uint8Array([t.length]), t), r = va(n);
  return We(r);
}, F$ = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + t.length), n.push(174);
  const r = Gt(n), s = va(r);
  return We(s);
}, j$ = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((l) => {
    n.push(l.length), n.push(l);
  }), n.push(80 + t.length), n.push(174);
  const r = Gt(n), s = Kf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Gt(i), c = va(o);
  return We(c);
};
function R$(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Tm(e) {
  const t = jt(e);
  return `0x${We(t)}`;
}
function z$(e) {
  return or(e);
}
const mo = (e) => {
  try {
    return Oi.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Jf() {
  return {
    type: Se.MessageSignature,
    data: We(new Uint8Array(Ul))
  };
}
function Bm(e, t, n, r) {
  const s = Yf(0, e, 1, [No(t)]).hash160, i = zo(No(t)) ? Nt.Compressed : Nt.Uncompressed;
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
function I0(e) {
  return e === xt.SerializeP2SH || e === xt.SerializeP2WSH;
}
function G$(e) {
  return e === xt.SerializeP2SHNonSequential || e === xt.SerializeP2WSHNonSequential;
}
function L0(e) {
  const t = Md(e);
  return t.nonce = 0, t.fee = 0, Aa(t) ? t.signature = Jf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function K$(e) {
  const t = [
    e.hashMode,
    Ct(e.signer),
    Ys(e.nonce, !1, 8),
    Ys(e.fee, !1, 8),
    e.keyEncoding,
    Xf(e.signature)
  ];
  return Gt(t);
}
function V$(e) {
  const t = [
    e.hashMode,
    Ct(e.signer),
    Ys(e.nonce, !1, 8),
    Ys(e.fee, !1, 8)
  ], n = qf(e.fields);
  t.push(Wf(n));
  const r = new Uint8Array(2);
  return Rk(r, e.signaturesRequired, 0), t.push(r), Gt(t);
}
function X$(e, t) {
  const n = We(t.readBytes(20)), r = BigInt(`0x${We(t.readBytes(8))}`), s = BigInt(`0x${We(t.readBytes(8))}`), i = t.readUInt8Enum(Nt, (c) => {
    throw new zn(`Could not parse ${c} as PubKeyEncoding`);
  });
  if (e === xt.SerializeP2WPKH && i != Nt.Compressed)
    throw new zn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function Y$(e, t) {
  const n = We(t.readBytes(20)), r = BigInt("0x" + We(t.readBytes(8))), s = BigInt("0x" + We(t.readBytes(8))), i = $m(t, Se.TransactionAuthField).values;
  let o = !1, c = 0;
  for (const d of i)
    switch (d.contents.type) {
      case Se.PublicKey:
        zo(d.contents) || (o = !0);
        break;
      case Se.MessageSignature:
        if (d.pubKeyEncoding === Nt.Uncompressed && (o = !0), c += 1, c === 65536)
          throw new hi("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const l = t.readUInt16BE();
  if (o && (e === xt.SerializeP2WSH || e === xt.SerializeP2WSHNonSequential))
    throw new hi("Uncompressed keys are not allowed in this hash mode");
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
  return Aa(e) ? K$(e) : V$(e);
}
function yu(e) {
  const t = e.readUInt8Enum(xt, (n) => {
    throw new zn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === xt.SerializeP2PKH || t === xt.SerializeP2WPKH ? X$(t, e) : Y$(t, e);
}
function Mm(e, t, n, r) {
  const i = e + We(new Uint8Array([t])) + We(Ys(n, !1, 8)) + We(Ys(r, !1, 8));
  if (Ct(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Zf(Ct(i));
}
function Nm(e, t, n) {
  const r = 33 + Ul, s = zo(t) ? Nt.Compressed : Nt.Uncompressed, i = e + U$(s.toString(16)) + n.data, o = Ct(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Zf(o);
}
function q$(e, t, n, r, s) {
  const i = Mm(e, t, n, r), o = a$(s, i), c = c$(s), l = Nm(i, c, o);
  return {
    nextSig: o,
    nextSigHash: l
  };
}
function _m(e, t, n, r, s, i) {
  const o = Mm(e, t, n, r), c = No(t$(o, i, s)), l = Nm(o, c, i);
  return {
    pubKey: c,
    nextSigHash: l
  };
}
function W$() {
  const e = Bm(xt.SerializeP2PKH, "", 0, 0);
  return e.signer = w$().hash160, e.keyEncoding = Nt.Compressed, e.signature = Jf(), e;
}
function C0(e, t, n) {
  return Aa(e) ? Z$(e, t, n) : J$(e, t, n);
}
function Z$(e, t, n) {
  const { pubKey: r, nextSigHash: s } = _m(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), i = Yf(0, e.hashMode, 1, [r]).hash160;
  if (i !== e.signer)
    throw new hi(`Signer hash does not equal hash of public key(s): ${i} != ${e.signer}`);
  return s;
}
function J$(e, t, n) {
  const r = [];
  let s = t, i = !1, o = 0;
  for (const l of e.fields)
    switch (l.contents.type) {
      case Se.PublicKey:
        zo(l.contents) || (i = !0), r.push(l.contents);
        break;
      case Se.MessageSignature:
        l.pubKeyEncoding === Nt.Uncompressed && (i = !0);
        const { pubKey: d, nextSigHash: p } = _m(s, n, e.fee, e.nonce, l.pubKeyEncoding, l.contents);
        if (I0(e.hashMode) && (s = p), r.push(d), o += 1, o === 65536)
          throw new hi("Too many signatures");
        break;
    }
  if (I0(e.hashMode) && o !== e.signaturesRequired || G$(e.hashMode) && o < e.signaturesRequired)
    throw new hi("Incorrect number of signatures");
  if (i && (e.hashMode === xt.SerializeP2WSH || e.hashMode === xt.SerializeP2WSHNonSequential))
    throw new hi("Uncompressed keys are not allowed in this hash mode");
  const c = Yf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (c !== e.signer)
    throw new hi(`Signer hash does not equal hash of public key(s): ${c} != ${e.signer}`);
  return s;
}
function Pm(e) {
  return {
    authType: Dt.Standard,
    spendingCondition: e
  };
}
function Um(e, t) {
  return {
    authType: Dt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Bm(xt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function T0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Dt.Standard:
        return Pm(L0(e.spendingCondition));
      case Dt.Sponsored:
        return Um(L0(e.spendingCondition), W$());
      default:
        throw new nl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Q$(e, t) {
  switch (e.authType) {
    case Dt.Standard:
      return C0(e.spendingCondition, t, Dt.Standard);
    case Dt.Sponsored:
      return C0(e.spendingCondition, t, Dt.Standard);
    default:
      throw new nl("Invalid origin auth type");
  }
}
function e6(e, t) {
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
function t6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: kn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function n6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: kn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function r6(e, t) {
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
function s6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Dt.Standard:
      t.push(gu(e.spendingCondition));
      break;
    case Dt.Sponsored:
      t.push(gu(e.spendingCondition)), t.push(gu(e.sponsorSpendingCondition));
      break;
  }
  return Gt(t);
}
function i6(e) {
  const t = e.readUInt8Enum(Dt, (r) => {
    throw new zn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Dt.Standard:
      return n = yu(e), Pm(n);
    case Dt.Sponsored:
      n = yu(e);
      const r = yu(e);
      return Um(n, r);
  }
}
class o6 {
  constructor(t, n, r, s, i, o, c) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: kn(r.amount, !1)
    } : this.payload = r, this.chainId = c ?? Vk, this.postConditionMode = i ?? Mo.Deny, this.postConditions = s ?? qf([]), o)
      this.anchorMode = Zk(o);
    else
      switch (r.payloadType) {
        case Ye.Coinbase:
        case Ye.CoinbaseToAltRecipient:
        case Ye.NakamotoCoinbase:
        case Ye.PoisonMicroblock:
        case Ye.TenureChange:
          this.anchorMode = Cn.OnChainOnly;
          break;
        case Ye.ContractCall:
        case Ye.SmartContract:
        case Ye.VersionedSmartContract:
        case Ye.TokenTransfer:
          this.anchorMode = Cn.Any;
          break;
      }
  }
  signBegin() {
    const t = Md(this);
    return t.auth = T0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Md(this);
    return t.auth = T0(t.auth), t.txid();
  }
  verifyOrigin() {
    return Q$(this.auth, this.verifyBegin());
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
      const r = zo(t);
      n.fields.push(go(r ? Nt.Compressed : Nt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: i, nextSigHash: o } = q$(n, r, t.fee, t.nonce, s);
    return Aa(t) ? t.signature = i : t.fields.push(go(s.data.byteLength === sm ? Nt.Compressed : Nt.Uncompressed, i)), o;
  }
  txid() {
    const t = this.serialize();
    return Zf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Dt.Sponsored)
      throw new nl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = r6(this.auth, t);
  }
  setFee(t) {
    this.auth = e6(this.auth, t);
  }
  setNonce(t) {
    this.auth = t6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Dt.Sponsored)
      throw new nl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = n6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new ai('"version" is undefined');
    if (this.chainId === void 0)
      throw new ai('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ai('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ai('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ai('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return Ti(n, this.chainId, 0), t.push(n), t.push(s6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Wf(this.postConditions)), t.push(vm(this.payload)), Gt(t);
  }
}
function yo(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new ua(Ct(e.slice(2))) : t = new ua(Ct(e)) : e instanceof Uint8Array ? t = new ua(e) : t = e;
  const n = t.readUInt8Enum(Qc, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = i6(t), i = t.readUInt8Enum(Cn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = t.readUInt8Enum(Mo, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), c = $m(t, Se.PostCondition), l = p$(t);
  return new o6(n, s, l, c, o, i, r);
}
const a6 = Y8, da = En, c6 = wm;
const l6 = /* @__PURE__ */ new Set([4001, -31001]), u6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], d6 = ["result", "data", "payload", "response", "params"], B0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Dl = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), Ri = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, ns = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, f6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Hm = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => f6(i, r)) === s
  );
}, Om = (e) => e ? Hm(Ri()).some(
  (t) => {
    var n;
    return t.id === e && (Dl(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Dm = () => {
  if (typeof window > "u")
    return;
  const e = Ri(), t = Hm(e).filter(
    (n) => {
      var r;
      return Dl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = ns(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of u6) {
    const r = ns(e, n) ?? (e === window ? void 0 : ns(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, h6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = Ri(), n = ns(t, e) ?? (t === window ? void 0 : ns(window, e)) ?? kl(e);
  if (n)
    return n;
  if (Dl(e) || Om(e))
    return Dm();
}, fc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, p6 = ["blockstack-session", "blockstack"], g6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of p6) {
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
g6();
const Fm = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, Rn = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, y6 = (e) => {
  const t = Rn(e);
  if (!t)
    return null;
  const n = Fm(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, w6 = (e) => {
  const t = Rn(e);
  if (!t)
    return null;
  const n = Fm(t);
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
}, yi = (e) => {
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
    return mo(s) ? s : null;
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
  return typeof n.mainnet == "string" && mo(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && mo(n.testnet) ? n.testnet.trim() : null;
}, M0 = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, jm = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && l6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Mi = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = Rn(n == null ? void 0 : n.message) ?? Rn(t.message) ?? Rn(t.error) ?? Rn(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, Uo = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw Mi(t);
    if (t.status === "error")
      throw Mi(t.result ?? t);
  }
  return e;
}, N0 = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return Uo(r);
  } catch (r) {
    throw Mi(r);
  }
}, Rm = () => Dm(), Qf = () => {
  if (typeof window > "u")
    return;
  const e = Ri();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = ns(e, t) ?? (e === window ? void 0 : ns(window, t));
    if (n)
      return n;
  }
}, _0 = () => {
  if (typeof window > "u")
    return;
  const e = Qf();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = Ri();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = ns(t, n) ?? (t === window ? void 0 : ns(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Tc = (e) => {
  var r, s;
  const t = Ai();
  if (Dl(t) || Om(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ri() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === Rm();
}, wu = (e) => {
  const t = w6(e);
  if (!t)
    return null;
  try {
    const n = yo(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, rl = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = wu(e), r = y6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Rn(e) ?? void 0 : void 0
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
  for (const c of B0)
    if (wu(s[c])) {
      i = Rn(s[c]);
      break;
    }
  const o = Rn(s.txId) || Rn(s.txid) || Rn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Rn(s.txRaw) ?? void 0
    };
  for (const c of B0) {
    const l = wu(s[c]);
    if (l)
      return {
        ...s,
        txId: l,
        txid: l,
        txRaw: Rn(s[c]) ?? void 0
      };
  }
  for (const c of d6) {
    const l = s[c], d = rl(l, t + 1);
    if (d)
      return {
        ...s,
        ...l && typeof l == "object" ? l : {},
        ...d,
        txId: d.txId,
        txid: d.txid ?? d.txId
      };
  }
  return null;
}, mu = (e) => {
  const t = rl(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, m6 = (e) => {
  const t = rl(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, b6 = (e) => ({
  ...e,
  fee: yi(e.fee),
  nonce: yi(e.nonce),
  sponsored: e.sponsored === !0
}), P0 = (e) => ({
  recipient: e.recipient,
  amount: yi(e.amount) ?? "0",
  memo: e.memo,
  network: Nd(e.network),
  address: e.stxAddress,
  fee: yi(e.fee),
  nonce: yi(e.nonce),
  sponsored: e.sponsored ?? !1
}), zm = "WALLET_ADDRESS_MISMATCH", x6 = 45e3;
let fa = null;
const _d = (e) => {
  e && (fa = { address: e, at: Date.now() });
}, S6 = () => {
  fa = null;
}, v6 = () => fa && Date.now() - fa.at <= x6 ? fa.address : null, A6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, E6 = async (e) => {
  S6();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = Uo(await e.request("wallet_connect")), n = Ea(t);
  return _d(n), n;
}, k6 = async (e, t, n, r) => {
  try {
    return Uo(await e.request(t, n));
  } catch (s) {
    const i = Mi(s);
    if (!A6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: i.message
    });
    let o = null;
    try {
      o = await E6(e);
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
        { code: o ? zm : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: o });
    try {
      return Uo(await e.request(t, n));
    } catch (c) {
      throw Mi(c);
    }
  }
};
let U0 = 3e4;
const $6 = (e, t) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${U0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, U0);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, I6 = async (e, t, n) => {
  const r = (l, d) => {
    if (t && l !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${l} (via ${d}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: zm }
      );
    return l;
  }, s = v6();
  if (s)
    return fc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  fc(n, "account-read");
  try {
    const l = Uo(
      await $6(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Ea(l), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (l) {
    if (jm(l))
      throw Mi(l);
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
    o = Uo(await e.request("wallet_connect"));
  } catch (l) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: l instanceof Error ? l.message : String(l)
    }), Mi(l);
  }
  const c = Ea(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: c }), !c)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return _d(c), r(c, "wallet_connect");
}, L6 = async (e, t) => {
  if (!Tc(e)) {
    const i = await N0(
      e,
      "stx_transferStx",
      P0(t)
    );
    return mu(i);
  }
  const n = Qf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await N0(
      n,
      "stx_transferStx",
      P0(t)
    );
    return mu(i);
  }
  const r = Rm();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await I6(r, t.stxAddress);
  const s = await k6(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: yi(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: yi(t.fee) } : {}
    },
    t.stxAddress
  );
  return mu(s);
}, C6 = () => Ai(), Gm = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = Ai(), t = e ? h6(e) : void 0;
  if (t)
    return t;
  const n = Ri() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, H0 = (e, t) => {
  const n = Gm(), r = b6({
    ...e,
    onFinish: (s) => {
      var i;
      (i = e.onFinish) == null || i.call(e, m6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return cc(r, t);
  if (Tc(n) && !Qf()) {
    const s = _0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Ai(),
        route: "legacy-transaction-request"
      }), cc(r, s);
  }
  return void L6(n, e).then((s) => {
    var i;
    (i = e.onFinish) == null || i.call(e, s);
  }).catch((s) => {
    var i, o;
    if (M0(s) && Tc(n)) {
      const c = _0();
      if (c) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Ai(),
          route: "legacy-transaction-request"
        }), cc(r, c);
        return;
      }
    }
    if (M0(s) && !Tc(n)) {
      cc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), jm(s)) {
      (i = e.onCancel) == null || i.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (o = e.onCancel) == null || o.call(e);
  });
}, T6 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), O0 = (e) => Tm(e).replace(/^0x/, ""), D0 = "This wallet cannot sign messages. Try Xverse or Leather.", F0 = (e) => typeof (e == null ? void 0 : e.request) == "function", j0 = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", B6 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, M6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function N6(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: O0(t.message),
    domain: O0(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function _6(e, t) {
  const n = await $k({
    domain: t.domain,
    message: t.message,
    network: Nl(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? T6()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function bu(e) {
  var s, i;
  const t = C6() || "", n = /xverse/i.test(t);
  let r = Gm();
  if (n && !j0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (j0(r))
    try {
      return await _6(r, e);
    } catch (o) {
      if (n || !F0(r) || !M6(o)) throw o;
    }
  if (!n && F0(r))
    try {
      return await N6(r, e);
    } catch (o) {
      throw B6(o) ? new Error(D0) : o;
    }
  throw new Error(D0);
}
const R0 = 1000000n, Qr = 1000000n, sl = 50n, Rt = 3000n, vr = 300n, Jo = 3000n, P6 = 50000n, xu = 200n, Fl = 15000n, pn = (e) => e + sl;
function hr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / R0}.${(n % R0).toString().padStart(6, "0")}`;
}
function z0(e, t = vr) {
  return e <= Rt ? 0 : Number((e - Rt) / pn(t));
}
function Su(e, t = 0n) {
  const n = Qr - e - t;
  return n > 0n ? n : 0n;
}
function U6(e, t = vr) {
  return e > Qr ? "over" : e < Rt + pn(t) ? "empty" : e < P6 ? "low" : "ok";
}
const H6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", O6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", D6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function F6(e) {
  var n, r, s, i;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = t["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || D6.some((o, c) => {
    var l;
    return ((l = t["core-" + (c + 1)]) == null ? void 0 : l.value) !== H6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Km = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", vu = 3, j6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", R6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", G0 = 1, [Pd, Vm] = Km.split("."), tr = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function Ud(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function z6(e) {
  return tr(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function Vs(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Xm(e, t = []) {
  const n = await Vs(`/v2/contracts/call-read/${Pd}/${Vm}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Pd, arguments: t.map((r) => "0x" + tr(jt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return gr(or(n.result));
}
async function G6() {
  const e = await Vs(`/v2/contracts/source/${Pd}/${Vm}?proof=0`);
  if (typeof e.source != "string" || await z6(e.source) !== O6) throw Error("Deployed source does not match the tested helper.");
  if (F6(await Xm("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Ym(e) {
  return e.startsWith("SP") && mo(e) && !e.includes(".");
}
async function K6(e) {
  var r;
  if (!Ym(e)) throw Error("Invalid mainnet wallet address.");
  const t = await Vs(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await Vs(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function V6(e) {
  const t = await Vs(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function X6(e, t) {
  var s, i;
  const n = await Xm("get-owner", [da(e), da(t)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Ym(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function Y6(e, t) {
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
async function q6(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function W6(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = yo(Ud(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || po(ia(el.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const i = t.postConditions.values[0];
    if (r.payloadType !== 2 || po(r.contractAddress) + "." + r.contractName.content !== Km || r.functionName.content !== "play" || r.functionArgs.length !== 3 || tr(jt(r.functionArgs[0])) !== tr(jt(da(e.core))) || tr(jt(r.functionArgs[1])) !== tr(jt(da(e.song))) || tr(jt(r.functionArgs[2])) !== tr(jt(c6(Ud(e.id)))) || e.amount !== "50" || t.postConditionMode !== Mo.Deny || t.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== xa.Equal || i.principal.prefix !== 2 || po(i.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || po(r.contractAddress) + "." + r.contractName.content !== j6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || tr(jt(r.functionArgs[0])) !== tr(jt(da(e.song))) || typeof e.liked != "boolean" || tr(jt(r.functionArgs[1])) !== tr(jt(a6(e.liked))) || e.amount !== "0" || t.postConditionMode !== Mo.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || gr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const Z6 = "xtrata.xyz/radio/listening-wallet", J6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Nr = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && mo(e), Q6 = (e) => ({
  domain: Sr({ name: St(Z6), version: St("1"), "chain-id": En(1) }),
  message: Sr({
    purpose: St(J6),
    main: St(e.main),
    listening: St(e.listening),
    issued: En(e.issued)
  })
}), qm = 100000n, e5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function t5(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !Nr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= qm).sort(e5);
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
async function n5(e, t, n = 4) {
  if (!Nr(e)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${e}/stx_inbound?limit=${hc}&offset=${o}`, s = il(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - hc);
    for (let o = 0; o < n; o++) {
      const c = i === 0 && s.total <= hc ? s : il(await t(r(i)));
      if (!c || !c.transfers.length) return { ok: !1 };
      const l = t5(c.transfers, e);
      if (l.ok && l.funder) return i > 0 ? { ...l, distinct: Math.max(l.distinct, 2) } : l;
      if (i === 0) return l;
      i = Math.max(0, i - hc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const qr = 50, r5 = 6, s5 = 20, K0 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function V0(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const i of n.results) {
    const o = i && typeof i == "object" && i.tx && typeof i.tx == "object" ? i.tx : i;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (s.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== t || o.tx_status !== "success") continue;
    const c = o.token_transfer;
    if (!c || typeof c.recipient_address != "string" || typeof c.amount != "string" || !/^\d+$/.test(c.amount)) return null;
    const l = Number(o.block_height), d = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(l) || !Number.isSafeInteger(d)) return null;
    r.push({ recipient: c.recipient_address, amount: BigInt(c.amount), txId: o.tx_id, blockHeight: l, txIndex: d });
  }
  return { total: n.total, sent: r, rows: s };
}
async function i5(e, t, n) {
  if (!Nr(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = il(await t(`/extended/v1/address/${e}/stx_inbound?limit=${qr}&offset=0`));
    if (!s || s.total > r5 * qr) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = qr; o < s.total; o += qr) {
      const c = il(await t(`/extended/v1/address/${e}/stx_inbound?limit=${qr}&offset=${o}`));
      if (!c || !c.transfers.length) return { ok: !1 };
      for (const l of c.transfers) r.set(l.txId + ":" + l.txIndex, l);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (d) => `/extended/v1/address/${e}/transactions?limit=${qr}&offset=${d}`, c = V0(await t(o(0)), e);
      if (!c || c.total > s5 * qr) return { ok: !1 };
      const l = new Set(c.rows);
      for (const d of c.sent) i.set(d.txId, d);
      for (let d = qr; d < c.total; d += qr) {
        const p = V0(await t(o(d)), e);
        if (!p || !p.rows.length) return { ok: !1 };
        for (const u of p.rows) l.add(u);
        for (const u of p.sent) i.set(u.txId, u);
      }
      if (l.size !== c.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...i.values()] };
  } catch {
    return { ok: !1 };
  }
}
function o5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((u) => u && typeof u.sender == "string" && u.sender !== t && /^\d+$/.test(u.amount) && BigInt(u.amount) > 0n).sort(K0).map((u, w) => {
    const y = BigInt(u.amount);
    return r && u.sender === r.sender ? { sender: u.sender, left: y, kind: "gift", to: r.payer, at: w } : Nr(u.sender) && y >= qm ? { sender: u.sender, left: y, kind: "deposit", to: u.sender, at: w } : { sender: u.sender, left: y, kind: "dust", to: null, at: w };
  }), i = s.reduce((u, w) => u + w.left, 0n), o = [...e.outgoing].filter((u) => u && u.recipient !== t && Nr(u.recipient) && u.amount > 0n).sort(K0), c = o.reduce((u, w) => u + w.amount, 0n), l = i - n - c;
  if (l < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const d = (u, w) => {
    let y = w;
    for (const S of u) {
      if (y <= 0n) break;
      const v = S.left < y ? S.left : y;
      S.left -= v, y -= v;
    }
    return y;
  };
  for (const u of o) {
    const w = d(s.filter((y) => y.to === u.recipient), u.amount);
    w > 0n && d(s, w);
  }
  if (d(s, l) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((u, w) => u + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const p = /* @__PURE__ */ new Map();
  for (const u of s) {
    if (u.left <= 0n) continue;
    const w = `${u.kind}:${u.to ?? ""}`, y = p.get(w);
    y ? (y.amount += u.left, y.newest = Math.max(y.newest, u.at)) : p.set(w, { to: u.to, kind: u.kind, amount: u.left, newest: u.at });
  }
  return {
    ok: !0,
    parts: [...p.values()].sort((u, w) => u.newest - w.newest),
    hasTopUp: s.some((u) => u.kind === "deposit")
  };
}
function a5(e, t) {
  const n = e.filter((d) => d.kind === "deposit").sort((d, p) => d.newest - p.newest), r = e.find((d) => d.kind === "gift"), s = e.filter((d) => d.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((d, p) => d + p.amount, 0n), o = [], c = [], l = i > t;
  return n.forEach((d, p) => {
    if (d.amount <= t) {
      c.push(d);
      return;
    }
    const u = p === n.length - 1 && !l;
    o.push({ to: d.to, kind: "deposit", mode: u ? "all" : "amount", send: d.amount - t });
  }), l ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - t }) : (r && c.push(r), c.push(...s)), { steps: o, tooSmall: c };
}
function X0(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const pc = 1500n, Bc = [100, 250, 500], c5 = (e, t) => BigInt(e) * pn(t), Qo = ["prepared", "signed", "unknown", "pending"], l5 = 30 * 6e4, ol = 6e4, so = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, u5 = 3e3, al = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Au = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function d5(e) {
  let t = null, n = -1 / 0, r, s = null, i = null, o, c = -1 / 0, l = null, d = null, p = !1, u = !1, w = !1, y = null, S = !1, v = "", T = "", U = 0, H, E = null, B, _ = [], Z, de = -1 / 0;
  const Q = /* @__PURE__ */ new Set();
  let Y = null, b = !1, I = 0, N = null, M = null, q = !1, D = null, ae = !1, ie = null, Ue = !1, L = !1, O = !1, le = !1, me = !1, Ce = 0, Te = null, _t = Promise.resolve();
  const Me = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? vr.toString()), $e = (x) => !!i && !(i.features ?? []).includes(x), ke = (x, a) => `xtrata.ppp.v1.${x}:${a}`, Jt = "xtrata.ppp.v1.as-main", Qt = () => {
    if (e.main()) return;
    const x = e.store.get(Jt);
    return x && Nr(x) ? x : void 0;
  }, Je = () => e.main() ?? Qt(), $t = (x = i == null ? void 0 : i.address) => {
    if (!x) return [];
    try {
      const a = JSON.parse(e.store.get(ke("entries", x)) || "[]");
      return Array.isArray(a) ? a : [];
    } catch {
      return [];
    }
  }, vt = (x) => {
    const a = [x, ...$t(x.address).filter((h) => !(h.txid === x.txid && h.kind === x.kind))].slice(0, 200);
    e.store.set(ke("entries", x.address), JSON.stringify(a));
  }, R = (x = i == null ? void 0 : i.address) => !!x && e.store.get(ke("on", x)) !== "0", P = (x) => {
    i != null && i.address && e.store.set(ke("on", i.address), x ? "1" : "0");
  }, re = () => $t().filter((x) => Qo.includes(x.status)), J = () => Qe() ? [...re(), ...$t(Fe()).filter((x) => Qo.includes(x.status))] : re(), se = () => Ze(i == null ? void 0 : i.address), Ze = (x) => {
    if (!x) return null;
    try {
      return JSON.parse(e.store.get(ke("deposit", x)) || "null");
    } catch {
      return null;
    }
  }, xe = (x, a = i == null ? void 0 : i.address) => {
    a && e.store.set(ke("deposit", a), JSON.stringify(x));
  };
  let Ne = null;
  const nt = (x = ol) => {
    const a = e.now();
    Ne = { since: Ne && a < Ne.until ? Ne.since : a, until: Math.max((Ne == null ? void 0 : Ne.until) ?? 0, a + x) };
  }, Be = () => !!Ne && e.now() < Ne.until && (o === void 0 || o < Rt + pn(Me())), oe = () => !!se() || Be(), Fe = () => $e("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), Qe = () => !!(i != null && i.address) && Fe() !== i.address, Ve = () => Qe() ? l && l.for === Fe() ? l.value : void 0 : o, Yt = (x) => x !== void 0 && x < Rt + xu, Kt = () => re().filter((x) => e.now() - x.created > l5 && Q.has(x.txid)), Vt = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!Je() || r === Je() && !t.allowed), gt = () => Vt() && !(i != null && i.linked), Mn = () => {
    const x = Je();
    return !gt() && !!x && !!(i != null && i.linked) && i.linked !== x;
  }, yn = (x) => ke("return-to", x), Xn = (x = i == null ? void 0 : i.address) => {
    if (!x) return;
    const a = e.store.get(yn(x));
    return a && Nr(a) && a !== x ? a : void 0;
  }, Rr = (x = i == null ? void 0 : i.address) => Y && Y.for === x ? Y.res : null;
  function $() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const x = Xn();
    if (x) return { to: x, kind: "chosen" };
    const a = Rr();
    if (a != null && a.ok && a.funder) return { to: a.funder, kind: "funder" };
  }
  const F = (x) => ke("gift", x);
  function V() {
    const x = i == null ? void 0 : i.address;
    if (!x) return null;
    if ((D == null ? void 0 : D.for) === x) return D.info;
    try {
      const a = JSON.parse(e.store.get(F(x)) || "null");
      return a && typeof a.returnTo == "string" && typeof a.treasury == "string" ? a : null;
    } catch {
      return null;
    }
  }
  const X = () => (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : ((i == null ? void 0 : i.slot) ?? 0) === 0 ? i == null ? void 0 : i.address : void 0;
  let ee = null, fe = null, k = !1;
  const ye = (x) => ke("award-claim", x), _e = (x) => ke("award-send", x), lt = (x) => {
    try {
      const a = JSON.parse(e.store.get(_e(x)) || "null");
      return a && typeof a.txid == "string" && e.now() - a.at < 2 * 36e5 ? a : null;
    } catch {
      return null;
    }
  }, Xe = (x) => {
    try {
      const a = JSON.parse(e.store.get(ye(x)) || "null");
      return a && typeof a.txid == "string" && e.now() - a.at < 2 * 36e5 ? a : null;
    } catch {
      return null;
    }
  };
  async function kt(x = !1) {
    const a = X();
    if (!a || !e.awardStatus || k) return;
    const h = (ee == null ? void 0 : ee.for) === a ? ee : null, g = h == null ? void 0 : h.view.state, f = h ? g === "off" || g === "not-a-player" ? 30 * 6e4 : Xe(a) || lt(a) ? 2e4 : g === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(h && !x && e.now() - h.at < f)) {
      k = !0;
      try {
        const A = await e.awardStatus(a);
        if (ee = { for: a, view: A, at: e.now() }, A.state === "claimed" && e.store.set(ye(a), ""), A.state === "claimed" && A.holds === !1 && e.store.set(_e(a), ""), A.state === "ready" && e.awardName && (fe == null ? void 0 : fe.for) !== a)
          try {
            fe = { for: a, name: await e.awardName(a), at: e.now() };
          } catch {
            fe = { for: a, name: void 0, at: e.now() };
          }
      } catch {
        ee = { for: a, view: h && h.view.state !== "off" && h.view.state !== "not-a-player" ? { ...h.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        k = !1;
      }
    }
  }
  function rt() {
    const x = X();
    if (!x || (ee == null ? void 0 : ee.for) !== x) return null;
    const a = ee.view;
    if (a.state === "off" || a.state === "not-a-player") return null;
    const h = a.state === "claimed" ? null : Xe(x), g = a.state === "claimed" && a.holds !== !1 ? lt(x) : null;
    return { ...a, ...(fe == null ? void 0 : fe.for) === x ? { name: fe.name } : {}, ...h ? { claimTx: h.txid } : {}, ...g ? { sendTx: g.txid } : {} };
  }
  async function st() {
    var f;
    const x = i == null ? void 0 : i.address;
    if (!x || !e.giftInfo || !((f = t == null ? void 0 : t.gifts) != null && f.enabled) || ae) return;
    const a = (D == null ? void 0 : D.for) === x ? D : null, h = a ? a.ok ? a.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (a && e.now() - a.at < h) return;
    ae = !0;
    const g = V();
    try {
      const A = await e.giftInfo(x);
      D = { for: x, info: A, ok: !0, at: e.now() }, e.store.set(F(x), JSON.stringify(A));
    } catch {
      D = { for: x, info: g, ok: !1, at: e.now() };
    } finally {
      ae = !1;
    }
  }
  const yt = () => $t().reduce((x, a) => Qo.includes(a.status) ? x + BigInt(a.amount || "0") + BigInt(a.fee || "0") : x, 0n);
  function qt() {
    if (o === void 0) return 0;
    const x = o - yt() - BigInt(At.length) * pn(Me());
    return x > 0n ? z0(x, Me()) : 0;
  }
  const He = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Xt = "EMPTY — ADD STX TO PLAY";
  function Ar() {
    if (!(t != null && t.here)) return null;
    const x = (a, h) => ({ reason: a, text: h });
    switch (Nn()) {
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
        return oe() ? x("arriving", "YOUR PLAYS ARE ARRIVING") : x("out", Qe() ? He : Xt);
      case "ready":
        return !R() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= e.now() ? x("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : O ? qt() < 1 ? x("out", Qe() ? He : Xt) : null : x("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Yn = () => {
    var x;
    return !!(i != null && i.address) && Qe() && !!((x = V()) != null && x.player);
  };
  function $n() {
    return Yn() ? { locked: !0, known: !0 } : null;
  }
  const zr = 3 * 6e4, Ws = () => !!V() && !!e.history && !(i != null && i.linked);
  async function os() {
    const x = i.address, a = V(), { balance: h, nonce: g } = await e.chain.account(x), f = await e.history(x, !0);
    if (!f.ok) return null;
    const A = o5({ self: x, balance: h, inbound: f.inbound, outgoing: f.outgoing, gift: { sender: a.treasury, payer: a.returnTo } });
    if (!A.ok) return null;
    const z = a5(A.parts, Jo);
    return { balance: h, nonce: g, parts: A.parts, steps: z.steps, tooSmall: z.tooSmall.length };
  }
  const zi = () => Ue ? { state: "unavailable" } : !ie || e.now() - ie.at > zr || o !== void 0 && o !== ie.balance ? { state: "none" } : ie.plan;
  function Nn() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const x = Je();
    if (!gt()) {
      if (!x) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : Mn() ? "wrong-wallet" : i.state === "known" ? "locked" : !gt() && i.linked !== x ? "link" : o === void 0 ? "loading" : o > Qr && !i.backedUp ? "over" : o < Rt + pn(Me()) ? "fund" : "ready" : "loading";
  }
  const Er = () => {
    var x, a, h, g, f;
    return {
      step: Nn(),
      busy: d,
      message: v,
      error: T,
      notice: _n(),
      gate: t,
      main: Je(),
      mainConnected: !!e.main(),
      standIn: Qt(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      award: rt(),
      unproven: !!(i != null && i.unproven),
      phrase: !!(i != null && i.phrase),
      backedUp: !!(i != null && i.backedUp),
      balance: o,
      balanceState: o === void 0 ? void 0 : ((A) => A === "over" && (i != null && i.backedUp) ? "ok" : A)(U6(o, Me())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: o !== void 0 && o > Qr && !!(i != null && i.backedUp),
      playsLeft: o === void 0 ? 0 : z0(o, Me()),
      allowance: o === void 0 ? Qr : Su(o, BigInt(((x = se()) == null ? void 0 : x.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: R(),
      entries: $t(),
      depositTxid: ((a = se()) == null ? void 0 : a.txid) ?? H,
      depositPending: oe(),
      arrival: oe() ? { since: ((h = se()) == null ? void 0 : h.at) ?? (Ne == null ? void 0 : Ne.since) ?? e.now(), graceMs: ol } : null,
      walletOutdated: $e("like"),
      canAnother: !!i && !$e("another"),
      hadGift: i != null && i.address && (D == null ? void 0 : D.for) === i.address && D.ok ? !!D.info : null,
      linkedListening: Z && Z === Je() ? _.map((A) => A.listening) : [],
      serverLinked: !!E && B === `${Je()}:${i == null ? void 0 : i.address}`,
      stuck: Kt().length,
      armed: le,
      queued: At.length,
      solo: gt(),
      returnTo: (g = $()) == null ? void 0 : g.to,
      returnToKind: (f = $()) == null ? void 0 : f.kind,
      funderState: (() => {
        const A = Rr();
        return A ? A.ok ? A.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const A = Rr();
        return !!A && A.ok && A.distinct > 1;
      })(),
      walletCannotSolo: gt() && $e("standalone"),
      walletCannotMulti: $e("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((A) => A !== Je() && A !== (i == null ? void 0 : i.linked)),
      creditedTo: gt() && (i != null && i.address) && (N == null ? void 0 : N.for) === i.address && N.main ? N.main : void 0,
      createdHere: !!(i != null && i.address) && e.store.get(ke("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (M == null ? void 0 : M.for) === i.address && M.unused,
      gift: (() => {
        const A = V();
        return A ? { player: A.player, from: A.from, source: A.source, amount: A.amount, ...A.drop !== void 0 ? { drop: A.drop } : {} } : null;
      })(),
      giftPlays: V() ? qt() : 0,
      playCost: pn(Me()),
      giftStop: Ar(),
      albumLock: $n(),
      returnPlan: zi(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: $e("slots"),
      likeFunds: (() => {
        var G;
        const A = Fe();
        if (!A || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const z = Ve();
        return { address: A, balance: z, low: Yt(z), album: Qe(), pending: !!Ze(A), txid: (G = Ze(A)) == null ? void 0 : G.txid, main: Je() };
      })()
    };
  }, _n = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Oe = (x, a = "") => {
    v = x, T = a, e.changed();
  };
  async function Pt(x, a) {
    if (!d) {
      d = x, T = "", e.changed();
      try {
        await a();
      } catch (h) {
        const g = h instanceof Error ? h.message : String(h);
        T = /Cancelled in the listening wallet/.test(g) ? "" : g, T || (v = "Not now. Nothing was signed.", me = !0);
      } finally {
        d = null, await mn(!0);
      }
    }
  }
  const ar = () => !!(t != null && t.enabled) && t.here && (gt() || !!Je() && t.allowed), Zs = () => ar() && !Mn(), Pn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", qn = () => {
    if (Mn()) throw new Error(Pn());
  };
  async function sn() {
    if (!ar()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const wn = (x) => {
    const a = Je();
    return x.request("listening.status", a ? { main: a } : void 0);
  };
  async function Js(x = !1) {
    i != null && i.address && (!x && e.now() - c < 3e4 || (o = await e.chain.balance(i.address), c = e.now(), await en(x)));
  }
  async function en(x = !1) {
    const a = Fe();
    if (!(!Qe() || !a || (i == null ? void 0 : i.state) !== "unlocked") && !(!x && (l == null ? void 0 : l.for) === a && e.now() - l.at < 3e4))
      try {
        l = { for: a, value: await e.chain.balance(a), at: e.now() };
      } catch {
      }
  }
  async function Qs(x) {
    if ((Z !== x || e.now() - de >= 6e4) && (_ = await e.links(x), Z = x, de = e.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === x) return;
    const a = `${x}:${i.address}`;
    B === a && E || (E = _.find((h) => h.listening === i.address) ?? null, B = a);
  }
  async function Gi() {
    const x = i == null ? void 0 : i.address;
    if (!gt() || !x || i != null && i.linked || !e.funder || b || !o || o <= 0n) return;
    const a = Rr(x);
    if (a != null && a.ok && a.funder) return;
    const h = a != null && a.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, I - 1), 30 * 6e4);
    if (!(Y && Y.for === x && e.now() - Y.at < h)) {
      b = !0;
      try {
        Y = { for: x, res: await e.funder(x), at: e.now() };
      } catch {
        Y = { for: x, res: { ok: !1 }, at: e.now() };
      } finally {
        b = !1;
      }
      I = Y.res.ok ? 0 : I + 1;
    }
  }
  async function as() {
    const x = i == null ? void 0 : i.address;
    if (!(!gt() || !x || i != null && i.linked || !e.mainOf || q) && !(N && N.for === x && (N.ok || e.now() - N.at < 6e4))) {
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
  async function Go() {
    const x = i == null ? void 0 : i.address;
    if (!(!x || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (M == null ? void 0 : M.for) === x) && e.store.get(ke("created", x)) !== "1")
      try {
        M = { for: x, unused: await e.chain.confirmedNonce(x) === 0n };
      } catch {
      }
  }
  async function Gr() {
    var f;
    const x = i == null ? void 0 : i.address;
    if (!x) return !1;
    let a, h = !1;
    const g = /* @__PURE__ */ new Map();
    for (const A of J())
      try {
        const z = await e.chain.transaction(A.txid);
        if (!z) {
          if (Q.add(A.txid), e.now() - A.created > 15 * 6e4 && !g.has(A.address) && g.set(A.address, await e.chain.confirmedNonce(A.address)), a = g.get(A.address), a !== void 0 && a > BigInt(A.nonce)) {
            vt({ ...A, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((A.status === "unknown" || A.status === "signed") && A.raw)
            try {
              await e.chain.broadcast(A.raw, A.txid), vt({ ...A, status: "pending" });
            } catch (K) {
              so(K) && vt({ ...A, status: "failed", note: K.message, raw: void 0 });
            }
          continue;
        }
        Q.delete(A.txid);
        const G = String(z.tx_status);
        if (G === "success" && z.canonical !== !1 && z.is_unanchored === !1) {
          if (vt({ ...A, status: "confirmed", confirmedAt: e.now(), actualFee: String(z.fee_rate ?? A.fee), raw: void 0 }), h = !0, A.kind === "like" && (S = !0, A.status !== "confirmed" && typeof A.liked == "boolean"))
            try {
              (f = e.likeConfirmed) == null || f.call(e, A.song, A.liked);
            } catch {
            }
        } else G.startsWith("abort_") || G.startsWith("dropped_") ? vt({ ...A, status: "failed", note: G, raw: void 0 }) : A.status !== "pending" && vt({ ...A, status: "pending" });
      } catch {
      }
    for (const A of Qe() ? [x, Fe()] : [x]) {
      const z = Ze(A);
      if (z)
        try {
          const G = await e.chain.transaction(z.txid), K = String((G == null ? void 0 : G.tx_status) ?? "");
          (K === "success" && G.is_unanchored === !1 || K.startsWith("abort_") || K.startsWith("dropped_") || !G && e.now() - z.at > 2 * 36e5) && (xe(null, A), K === "success" && nt(2e4), c = -1 / 0, l = null, /on its way/i.test(v) && (v = ""));
        } catch {
        }
    }
    return h;
  }
  async function mn(x = !1) {
    var a;
    try {
      const h = Je();
      if ((x || !t || r !== h || e.now() - n > 3e5) && (t = await e.config(h), n = e.now(), r = h), !t.enabled || !t.here || !gt() && (!h || !t.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), le && ei(), e.changed();
        return;
      }
      await sn(), i = await wn(s), Mn() && i.state === "unlocked" && (Zn(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await wn(s)), h && t.allowed && await Qs(h), await Js(x), await Gi(), await as(), await Go(), await st(), await kt(), await Gr() && await Js(!0), await en(), await Yi(), U = 0;
    } catch {
      U++;
    }
    if (Nn() === "locked" ? Vi() : le && ei(), S) {
      S = !1;
      try {
        (a = e.likesChanged) == null || a.call(e);
      } catch {
      }
    }
    e.changed(), At.length && !bn && fs();
  }
  async function Ko(x) {
    const a = i == null ? void 0 : i.root;
    if (!a || i != null && i.slot || !(i != null && i.address) || $e("slots")) return;
    const h = Number(e.store.get(ke("slot", a)));
    if (!(!Number.isSafeInteger(h) || h < 1))
      try {
        const { balance: g } = await e.chain.account(i.address);
        if (g >= Rt + pn(Me())) return;
        await x.request("listening.openSlot", { slot: h }), i = await wn(x), o = void 0, c = -1 / 0;
      } catch {
      }
  }
  async function Ki(x, a) {
    var A;
    qn();
    const h = !(i != null && i.address) || R(i.address), g = i != null && i.linked ? (A = e.nameOf) == null ? void 0 : A.call(e, i.linked) : void 0;
    await x.request("listening.unlock", { mode: "unlock", terms: h ? cs() : void 0, anyPasskey: a, ...Je() ? { main: Je() } : {}, ...g ? { label: g } : {} }), i = await wn(x), h && (R(i.address) ? await Wn() : await x.request("listening.stop")), await Ko(x), Oe(h ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const f = y;
    y = null, f && e.now() - f.at < 12e4 && setTimeout(() => void mn(!0).then(() => In(f)), 0);
  }
  function Vi() {
    le || d || me || Ce >= 3 || !s || !(i != null && i.address) || (le = !0, _t = (async () => {
      try {
        await Ki(s, !1), Ce = 0;
      } catch (x) {
        const a = x instanceof Error ? x.message : String(x);
        /Cancelled in the listening wallet/.test(a) ? Te || (me = !0, Oe("Not now. Nothing was signed.")) : /did not answer/.test(a) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Ce++, T = a);
      } finally {
        le = !1;
        const x = Te;
        Te = null, x ? await x() : await mn(!0);
      }
    })());
  }
  async function ei(x) {
    le && (Te = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await _t), x && await x(), e.changed();
  }
  const cs = () => ({
    fee: Me().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: Qr.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function Wn() {
    if (!(i != null && i.address)) return !1;
    if (O || (O = await e.tabLock(i.address)), !O)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function ti(x, a) {
    const h = i.address, { balance: g, nonce: f } = a ?? await e.chain.account(h);
    o = g;
    const A = await s.request("listening.prepareReturn", {
      mode: x.mode,
      balance: g.toString(),
      nonce: f.toString(),
      fee: Jo.toString(),
      ...x.amount !== void 0 ? { amount: x.amount.toString() } : {},
      ...x.linked ? {} : { destination: x.to }
    });
    if (A.recipient !== x.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const z = x.mode === "amount" ? x.amount : x.mode === "all" ? g - Jo : g - Qr - Jo, G = yo(A.raw);
    if (gr(G.payload.recipient).value !== x.to || String(G.payload.amount) !== A.amount || z !== void 0 && A.amount !== z.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const K = {
      id: Au(),
      address: h,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: A.recipient,
      amount: A.amount,
      fee: A.fee,
      nonce: f.toString(),
      created: e.now(),
      status: "signed",
      raw: A.raw,
      txid: A.txid
    };
    e.validate(K), vt(K);
    try {
      await e.chain.broadcast(A.raw, A.txid), vt({ ...K, status: "pending" });
    } catch (ce) {
      throw vt({ ...K, status: "unknown", note: ce.message }), ce;
    }
    return A;
  }
  const ls = Fl, us = Jo;
  async function ni(x, a, h) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if ($e("slots") || $e("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const g = i.slot ?? 0;
    if (x === a || ![x, a].includes(g) || ![x, a].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const f = i.root ?? i.address, A = x === 0 ? f : i.address, z = a === 0 ? f : i.address, { balance: G, nonce: K } = await e.chain.account(A);
    if (G < h + us + Rt) throw new Error(x === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const ce = await s.request("listening.signMove", { from: x, to: a, amount: h.toString(), fee: us.toString(), nonce: K.toString(), balance: G.toString() }), ve = yo(ce.raw);
    if (ce.from !== A || ce.to !== z || ce.amount !== h.toString() || gr(ve.payload.recipient).value !== z || String(ve.payload.amount) !== h.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const Ae = {
      id: Au(),
      address: A,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: z,
      amount: ce.amount,
      fee: ce.fee,
      nonce: K.toString(),
      created: e.now(),
      status: "signed",
      raw: ce.raw,
      txid: ce.txid
    };
    e.validate(Ae), vt(Ae);
    try {
      await e.chain.broadcast(ce.raw, ce.txid), vt({ ...Ae, status: "pending" });
    } catch (Ee) {
      throw vt({ ...Ae, status: "unknown", note: Ee.message }), Ee;
    }
    return xe({ txid: ce.txid, amount: ce.amount, at: e.now() }, z), z === f && f !== i.address ? l = null : c = -1 / 0, ce;
  }
  let Kr = !1;
  const Xi = /* @__PURE__ */ new Map(), it = (x) => ke("float", x);
  async function Yi() {
    if (Kr || (i == null ? void 0 : i.state) !== "unlocked" || !Qe() || $e("move") || $e("rootLike") || !i.address) return;
    const x = i.address;
    if (e.store.get(it(x)) === "1") return;
    const a = V();
    if (!(a != null && a.player) || a.state !== "arrived") return;
    const h = Ve();
    if (h === void 0 || o === void 0) return;
    if (!Yt(h)) {
      e.store.set(it(x), "1");
      return;
    }
    if (Ze(Fe()) || ds() || J().length || o < ls * 4n + Rt + us) return;
    const g = Xi.get(x);
    if (!(g && (g.n >= 3 || e.now() - g.at < 5 * 6e4))) {
      Kr = !0, Xi.set(x, { n: ((g == null ? void 0 : g.n) ?? 0) + 1, at: e.now() });
      try {
        await ni(i.slot ?? 0, 0, ls), e.store.set(it(x), "1");
      } catch (f) {
        console.warn("[radio] likes float not sent yet", f);
      } finally {
        Kr = !1;
      }
    }
  }
  async function Vo(x) {
    if (re().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if ($e("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const a = await os().catch(() => null);
    if (!a)
      throw ie = null, Ue = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Ue = !1, o = a.balance;
    const h = { balance: a.balance, nonce: a.nonce };
    if (x === "excess") {
      const G = X0(a.parts) ?? Xn();
      if (!G) throw new Error("Choose where to send the excess first.");
      await ti({ mode: "excess", to: G, linked: !1 }, h), ie = null, Oe("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const g = a.steps;
    if (!g.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ie && ie.balance === a.balance && e.now() - ie.at <= zr && ie.steps.length === g.length && ie.steps.every((G, K) => G.to === g[K].to && G.mode === g[K].mode && G.send === g[K].send))) {
      ie = {
        at: e.now(),
        balance: a.balance,
        steps: g,
        parts: a.parts,
        plan: { state: "ready", steps: g.map((G) => ({ to: G.to, kind: G.kind, send: G.send.toString() })), kept: a.tooSmall, excess: X0(a.parts) }
      }, Oe(g.length > 1 ? `This goes back in ${g.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const A = g[0], z = A.to ?? Xn();
    if (!z) throw new Error("Choose where to send the rest first.");
    if (A.mode === "amount" && $e("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await ti({ mode: A.mode, to: z, linked: !1, ...A.mode === "amount" ? { amount: A.send } : {} }, h), ie = null, g.length === 1 ? (P(!1), Oe("Returned ✓ Paying is off.")) : Oe(`Returned ✓ ${g.length - 1} more ${g.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function ri() {
    if (!(i != null && i.unproven)) return;
    const x = await sn();
    await x.request("listening.prove"), i = await wn(x);
  }
  const Vr = {
    forceRefresh: () => mn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (x) => {
      if (!e.main() && !(x !== null && !Nr(x))) {
        if (x === Qt()) return mn(!0);
        e.store.set(Jt, x ?? ""), T = "", v = "", o = void 0, c = -1 / 0, l = null, await mn(!0);
      }
    },
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (x) => Pt("Waiting for your passkey…", async () => {
      const a = await sn(), h = !!(x != null && x.another) && !e.main() && !$e("another");
      h && (i == null ? void 0 : i.state) === "unlocked" && await a.request("listening.lock"), await a.request("listening.unlock", { mode: "create", terms: cs(), ...e.main() ? { main: e.main() } : {}, ...x != null && x.quick && !e.main() ? { quick: !0 } : {}, ...h ? { another: !0 } : {} }), i = await wn(a), i.address && e.store.set(ke("created", i.address), "1"), P(!0), Oe(gt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Wn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (x) => {
      x ? nt() : Ne = null, e.changed();
    },
    giftSent: (x, a) => {
      !(i != null && i.address) || se() || (xe({ txid: x, amount: a.toString(), at: e.now() }), c = -1 / 0, D = null, Oe("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (x) => {
      if (qn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if ($e("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await sn()).request("listening.bindSlot", { slot: x, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (x, a, h, g) => {
      xe({ txid: h, amount: g.toString(), at: e.now() }, a), D = null, await Vr.openAlbum(x), Oe("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (x) => Pt("Opening…", async () => {
      if (qn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if ($e("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (p || u || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === x) return;
      Zn(), await s.request("listening.openSlot", { slot: x }), i = await wn(s), o = void 0, c = -1 / 0, ie = null, Ue = !1;
      const a = i.root;
      a && x > 0 && e.store.set(ke("slot", a), String(x)), Oe(x === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (x = !1) => {
      const a = () => Pt("Waiting for your passkey…", async () => Ki(await sn(), x));
      return le ? x ? $e("cancel") ? (Oe("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ei(async () => {
        (Nn() === "locked" || Nn() === "intro") && await a();
      }) : _t : a();
    },
    link: () => Pt("Sign in your wallet…", async () => {
      qn();
      const x = e.main();
      if (!x || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const a = (await e.links(x)).find((h) => h.listening === i.address);
      if (a)
        await s.request("listening.link", { main: x, issued: a.issued, mainSignature: a.mainSignature });
      else {
        const h = { main: x, listening: i.address, issued: e.now() }, g = await e.signWithMain(x, Q6(h)), f = await s.request("listening.link", { main: x, issued: h.issued, mainSignature: g });
        await e.saveLink({ ...h, mainSignature: g, listeningSignature: f.listeningSignature }), de = -1 / 0;
      }
      Oe("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => i != null && i.unproven ? (await Pt("One more passkey check…", ri), !(i != null && i.unproven)) : !0,
    deposit: () => Pt("Approve the deposit in your wallet…", async () => {
      qn(), await ri();
      const x = e.main();
      if (!x || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (se()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Be()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Js(!0);
      const a = Su(o ?? 0n);
      if (a <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      H = await e.deposit(x, i.address, a), H && xe({ txid: H, amount: a.toString(), at: e.now() }), Oe("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Pt("Approve the top-up in your wallet…", async () => {
      qn(), await ri();
      const x = e.main(), a = Fe();
      if (!x || !a) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Ze(a)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const h = await e.chain.balance(a);
      Qe() ? l = { for: a, value: h, at: e.now() } : (o = h, c = e.now());
      const g = Su(h);
      if (g <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const f = await e.deposit(x, a, g);
      f && xe({ txid: f, amount: g.toString(), at: e.now() }, a), Oe("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (x) => Pt("Adding plays…", async () => {
      if (qn(), !Qe()) throw new Error("Open the album you want to add plays to first.");
      if (!Bc.includes(x)) throw new Error("Choose one of the amounts offered.");
      const a = c5(x, Me());
      if (p || u || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (J().length || se()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await ni(0, i.slot ?? 0, a), Oe("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Pt("Confirm in the listening wallet…", async () => {
      if (!Zs()) throw new Error("Connect your wallet first.");
      await Wn(), await s.request("listening.approveSession", cs()), P(!0), Oe("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Pt("Clearing…", async () => {
      for (const x of Kt())
        await e.chain.transaction(x.txid) || vt({ ...x, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Oe("Cleared ✓");
    }),
    switchOff: () => Pt("Switching off…", async () => {
      Zn(), await (s == null ? void 0 : s.request("listening.stop")), P(!1), Oe("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Pt("Showing your backup words in the box…", async () => {
      if (!(i != null && i.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const x = await sn();
      await x.request("listening.backup"), i = await wn(x), Oe("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (x, a) => {
      if ((i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock your player first.");
      if ($e("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await sn()).request("listening.signShelf", { action: x, ...a ? { release: a } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      fe = null, await kt(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (x) => Pt("Confirm in the listening wallet…", async () => {
      var K, ce, ve, Ae;
      const a = X();
      if ((i == null ? void 0 : i.state) !== "unlocked" || !a) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if ($e("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (Xe(a)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (p || u || w || J().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await Wn();
      const h = await e.awardNote(a, x), { balance: g, nonce: f } = await e.chain.account(a);
      if (g < pc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const z = await (await sn()).request("listening.signAward", {
        cls: h.cls,
        number: h.number,
        plays: h.plays,
        record: h.record,
        signature: h.signature,
        fee: pc.toString(),
        nonce: f.toString(),
        balance: g.toString()
      }), G = yo(z.raw);
      if (z.hero !== a || z.number !== h.number || ((ce = (K = G.payload) == null ? void 0 : K.functionName) == null ? void 0 : ce.content) !== "claim" || ((Ae = (ve = G.payload) == null ? void 0 : ve.contractName) == null ? void 0 : Ae.content) !== R6.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(z.raw, z.txid), e.store.set(ye(a), JSON.stringify({ txid: z.txid, at: e.now() })), c = -1 / 0, ee && (ee = { ...ee, at: -1 / 0 }), Oe("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (x) => Pt("Confirm in the listening wallet…", async () => {
      var ce, ve, Ae;
      const a = X(), h = rt();
      if ((i == null ? void 0 : i.state) !== "unlocked" || !a) throw new Error("Unlock your player first.");
      if ((h == null ? void 0 : h.state) !== "claimed" || h.inscription === void 0) throw new Error("There is no record to send yet.");
      if (h.holds === !1) throw new Error("This record has already been sent.");
      if (h.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (lt(a)) throw new Error("Your record is already on its way.");
      const g = x.trim();
      if (!Nr(g)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (g === a) throw new Error("That is your player itself. Enter the address to send it to.");
      if ($e("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (p || u || w || J().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await Wn();
      const { balance: f, nonce: A } = await e.chain.account(a);
      if (f < pc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const G = await (await sn()).request("listening.signSendRecord", { inscription: h.inscription, recipient: g, fee: pc.toString(), nonce: A.toString(), balance: f.toString() }), K = yo(G.raw);
      if (G.from !== a || G.recipient !== g || G.inscription !== h.inscription || ((ve = (ce = K.payload) == null ? void 0 : ce.functionName) == null ? void 0 : ve.content) !== "transfer" || gr((Ae = K.payload.functionArgs) == null ? void 0 : Ae[2]).value !== g)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(G.raw, G.txid), e.store.set(_e(a), JSON.stringify({ txid: G.txid, at: e.now() })), c = -1 / 0, ee && (ee = { ...ee, at: -1 / 0 }), Oe("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Pt("Locking…", async () => {
      Zn(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Oe("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (x) => {
      const a = String(x ?? "").trim();
      if (!(i != null && i.address)) return Oe("", "Unlock the listening wallet first.");
      if (!Nr(a)) return Oe("", "Enter a standard mainnet address (it starts with SP).");
      if (a === i.address) return Oe("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(yn(i.address), a), Oe("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && e.store.set(yn(i.address), ""), e.changed();
    },
    returnFunds: (x) => Pt("Check the return in the listening wallet…", async () => {
      if (!Zs()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Ws()) return Vo(x);
      const a = $();
      if (!a) throw new Error(gt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (a.kind !== "linked" && $e("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (re().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await ti({ mode: x, to: a.to, linked: a.kind === "linked" }), x === "all" && P(!1), Oe(x === "all" ? a.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, At = [], qi = 10, Un = 30 * 6e4;
  let bn = !1;
  const ds = () => p || !!d || u || w, Zn = () => {
    At.length && (At.length = 0, e.changed());
  };
  async function Wi(x) {
    if (!At.some((a) => a.id === x.id) && !$t().some((a) => a.id === x.id) && (At.push({ ...x, at: e.now() }), At.length > qi && At.shift()), ds() || re().length) {
      const a = At.length;
      v = `Queued ${a === 1 ? "this song" : a + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await fs();
  }
  async function fs() {
    if (!bn) {
      bn = !0;
      try {
        for (; At.length; ) {
          for (; At.length && e.now() - At[0].at > Un; ) At.shift();
          if (!At.length || ds() || await Zi(At[0]) === "wait") return;
          At.shift();
        }
      } finally {
        bn = !1, e.changed();
      }
    }
  }
  async function Zi(x) {
    var a;
    p = !0;
    try {
      await mn();
      const h = Nn();
      if (h === "loading") return "wait";
      if (h !== "ready" || !R() || !(i != null && i.session) || i.session.playsLeft < 1 || !O) return "done";
      if (re().length) return "wait";
      L || (await e.chain.verify(), L = !0);
      const g = i.address, { balance: f, nonce: A } = await e.chain.account(g);
      o = f, c = e.now();
      const z = await e.chain.owner(vu, x.song);
      if (z === g || z === Je()) return "done";
      const G = await s.request("listening.signPlay", {
        core: vu,
        song: x.song,
        receipt: x.id,
        fee: Me().toString(),
        nonce: A.toString(),
        balance: f.toString()
      }), K = {
        id: x.id,
        address: g,
        kind: "play",
        core: vu,
        song: x.song,
        recipient: z,
        amount: "50",
        fee: Me().toString(),
        nonce: A.toString(),
        created: e.now(),
        status: "signed",
        raw: G.raw,
        txid: G.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      e.validate(K), vt(K);
      const ce = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`;
      try {
        await e.chain.broadcast(G.raw, G.txid), vt({ ...K, status: "pending" }), v = `♪ Paid ${ce}`, T = "";
      } catch (ve) {
        vt({ ...K, status: so(ve) ? "failed" : "unknown", note: ve.message, ...so(ve) ? { raw: void 0 } : {} }), T = ve.message;
      }
      return i = await wn(s), "done";
    } catch (h) {
      const g = h instanceof Error ? h.message : "payment unavailable";
      return (a = V()) != null && a.player ? (v = "Payment is taking a moment: " + g, "wait") : (v = "This song played free: " + g, "done");
    } finally {
      p = !1, e.changed();
    }
  }
  function si(x) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Nn()) || $e("like") ? !1 : (In(x), !0);
  }
  async function In(x) {
    const a = x.title ? `“${x.title}”` : `song #${x.song}`, h = (m) => {
      var C;
      T = m, v = "";
      try {
        (C = e.likeFailed) == null || C.call(e, x.song);
      } catch {
      }
      e.changed();
    }, g = Qe(), f = Nn(), A = Je(), z = g && (f === "fund" || f === "over") ? "ready" : f, G = gt() ? Fe() : A;
    if (z === "locked") {
      y = { ...x, at: e.now() }, Oe(`Unlock to like ${a}. It sends straight after.`);
      return;
    }
    if (z === "wrong-wallet") return h(Pn());
    if (z === "link") return h("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (gt() && $e("standalone")) return h("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (z === "fund") return h("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (z === "over") return h("Return the excess first: the listening wallet holds more than 1 STX.");
    if (g) {
      await en(!0);
      const m = Ve();
      if (Yt(m))
        return e.changed(), h(al);
    }
    if (z !== "ready" || !G) return h("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return h("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!O) return h("Pay-per-play is running in another tab. Like from that tab.");
    const K = $t(Fe()).find((m) => m.kind === "like" && m.song === x.song);
    if (K && Qo.includes(K.status))
      return h(`Your last like for ${a} is still on its way. It can change again once it confirms.`);
    if (u) return h("One like at a time: your last one is still being sent.");
    if ((K == null ? void 0 : K.status) === "confirmed" && e.now() - (K.confirmedAt ?? 0) < u5)
      return h(`Your like for ${a} has only just confirmed. Try again in a moment.`);
    let ce;
    w = !0;
    try {
      ce = e.likeState ? (await e.likeState(G, x.song)).by : x.likedBy ?? [];
    } catch {
      ce = x.likedBy;
    } finally {
      w = !1;
    }
    if (!ce) return h(`Could not check ${a} right now. Try the heart again.`);
    const ve = Fe(), Ee = ((K == null ? void 0 : K.status) === "confirmed" && typeof K.liked == "boolean" && e.now() - (K.confirmedAt ?? K.created) < 5 * 6e4 ? K.liked : void 0) ?? ce.includes(ve);
    if (!Ee && ce.some((m) => m !== ve)) return h(gt() ? `${a} was liked from another wallet of yours. Unlike it there.` : `${a} was liked from your main wallet${ce.includes(A) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Ji({ song: x.song, liked: !Ee, title: x.title, artist: x.artist });
  }
  async function Ji(x) {
    var g, f, A;
    if (u) {
      Oe("Still sending your last like. Try again in a moment.");
      return;
    }
    u = !0;
    const a = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`, h = e.wait ?? ((z) => new Promise((G) => setTimeout(G, z)));
    try {
      Oe(`${x.liked ? "Liking" : "Unliking"} ${a}…`);
      const z = e.now() + 12e4;
      for (; p || (Qe() ? $t(Fe()).some((Ee) => Qo.includes(Ee.status)) : re().length); ) {
        if (e.now() > z) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await h(5e3), await mn(!0);
      }
      if (!Qe() && Nn() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const G = Fe(), { balance: K, nonce: ce } = await e.chain.account(G);
      if (Qe() ? l = { for: G, value: K, at: e.now() } : (o = K, c = e.now()), Yt(K)) throw new Error(al);
      const ve = await s.request("listening.signLike", {
        song: x.song,
        liked: x.liked,
        fee: xu.toString(),
        nonce: ce.toString(),
        balance: K.toString()
      }), Ae = {
        id: Au(),
        address: G,
        kind: "like",
        core: 0,
        song: x.song,
        liked: x.liked,
        recipient: "",
        amount: "0",
        fee: xu.toString(),
        nonce: ce.toString(),
        created: e.now(),
        status: "signed",
        raw: ve.raw,
        txid: ve.txid,
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      e.validate(Ae), vt(Ae);
      try {
        await e.chain.broadcast(ve.raw, ve.txid), vt({ ...Ae, status: "pending" }), v = `${x.liked ? "♥ Liked" : "Unliked"} ${a}`, T = "";
        try {
          (g = e.likeSent) == null || g.call(e, x.song, x.liked);
        } catch {
        }
      } catch (Ee) {
        if (vt({ ...Ae, status: so(Ee) ? "failed" : "unknown", note: Ee.message, ...so(Ee) ? { raw: void 0 } : {} }), T = Ee.message, so(Ee)) try {
          (f = e.likeFailed) == null || f.call(e, x.song);
        } catch {
        }
      }
      i = await wn(s);
    } catch (z) {
      T = "Like not sent: " + (z instanceof Error ? z.message : "the listening wallet is unavailable");
      try {
        (A = e.likeFailed) == null || A.call(e, x.song);
      } catch {
      }
    } finally {
      u = !1, e.changed(), fs();
    }
  }
  return { snapshot: Er, refresh: mn, onListened: Wi, heart: si, toggleLike: In, ...Vr };
}
const Wm = ["Connect", "Passkey", "Link & fund", "Listen"], Zm = ["Passkey", "Add 1 STX", "Listen"], Hd = (e) => e ? Zm : Wm;
function f5(e) {
  if (e.solo) return h5(e);
  const t = Wm.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function h5(e) {
  const t = Zm.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function p5(e, t) {
  return !t || t.at >= Hd(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const g5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function y5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !g5(r.id)));
}
const w5 = {}, m5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, b5 = (e) => {
  const t = w5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, x5 = (e) => `/hiro/${e}`, S5 = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, v5 = (e) => {
  const t = b5(e);
  if (t)
    return [S5(t)];
  const n = m5[e];
  return typeof window < "u" ? [`${window.location.origin}${x5(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, A5 = {}, Y0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, E5 = "xtrata.log.enabled", k5 = "xtrata.log.level", $5 = "xtrata.log.tags", I5 = "xtrata.log.dedupe", gc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, L5 = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, C5 = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, T5 = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, B5 = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, M5 = () => {
  const e = A5 ?? {}, t = gc(E5) ?? e.VITE_LOG_ENABLED, n = gc(k5) ?? e.VITE_LOG_LEVEL, r = gc($5) ?? e.VITE_LOG_TAGS, s = gc(I5) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: L5(t),
    level: C5(n) ?? "warn",
    tags: B5(r),
    dedupe: T5(s)
  };
}, N5 = (e, t, n) => !e.enabled || Y0[n] < Y0[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), _5 = (e, t, n, r) => {
  const s = M5();
  if (!N5(s, t, e) || U5(s.dedupe))
    return;
  const i = `[xtrata:${t}] ${n}`, o = console[e] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, P5 = /* @__PURE__ */ new Set();
let q0 = null;
const U5 = (e, t, n, r, s) => (q0 !== e && (P5.clear(), q0 = e), !1), H5 = (e, t, n) => _5("debug", e, t, n), O5 = {}, D5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, F5 = (e) => {
  const t = O5, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : D5[e];
}, j5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, R5 = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return j5.test(n) ? n : null;
}, z5 = (e) => e.replace(/\/+$/, ""), G5 = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), W0 = (e) => {
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
}, io = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, K5 = (e) => {
  var l, d;
  let t;
  try {
    t = gr(z$(e));
  } catch {
    return null;
  }
  const n = io(t);
  if (!n || n.success === !1)
    return null;
  const r = io(n.value), s = io(r == null ? void 0 : r.value), i = io(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = W0((l = io(i.name)) == null ? void 0 : l.value), c = W0((d = io(i.namespace)) == null ? void 0 : d.value);
  return !o || !c ? null : R5(`${o}.${c}`);
}, V5 = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${z5(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [Tm(hm(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : K5(i.result);
}, X5 = async (e) => {
  const t = e.address.trim();
  if (!mo(t))
    return null;
  const n = F5(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of v5(e.network))
    try {
      return await V5({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (i) {
      r = i;
    }
  return H5("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: G5(r)
  }), null;
};
function Y5(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, i = /* @__PURE__ */ new Map(), o = (c, l) => {
    l.pending = !0, l.failedAt = void 0, Promise.resolve().then(() => e(c)).then((d) => {
      l.pending = !1, d && (l.name = d, t());
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
const Z0 = Object.freeze({
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
}), J0 = Object.freeze({ 139: "melophonic" });
function Q0(e, t = "") {
  const n = String(e);
  return Object.hasOwn(Z0, n) ? Z0[n] : Object.hasOwn(J0, n) ? J0[n] : t;
}
const eg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function tg(e, t = "") {
  return Object.hasOwn(eg, String(e)) ? eg[String(e)] : t;
}
const Jm = 10000n, eh = 1000000n, cl = 3000n, q5 = (e, t) => `${e}#gift=${t}`, W5 = 100, ea = (e, t = vr) => e <= Rt ? 0 : Number((e - Rt) / pn(t)), ng = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), Qm = "xtrata.xyz/radio/gifts", yc = W5, Z5 = "Create a prefunded Xtrata radio gift batch", J5 = (e) => ({
  domain: Sr({ name: St(Qm), version: St("1"), "chain-id": En(1) }),
  message: Sr({
    purpose: St(Z5),
    creator: St(e.creator),
    count: En(e.count),
    amount: En(BigInt(e.amount)),
    label: St(e.label),
    issued: En(e.issued),
    ...e.player ? { player: St(e.player) } : {}
  })
}), Q5 = (e, t, n = vr) => Rt + BigInt(e) * pn(n) + (t ? Fl : 0n), eI = (e, t = vr) => Number((eh - Rt - (e ? Fl : 0n)) / pn(t)), tI = (e, t) => BigInt(e) * (t + cl);
function nI(e, t, n, r = vr) {
  const s = n ? Fl : 0n, i = t > Rt + s ? t - Rt - s : 0n, o = Number(i / pn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * sl,
    fees: BigInt(o) * r,
    reserve: Rt,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: cl,
    perCopy: t + cl,
    total: tI(e, t)
  };
}
const rI = (e) => e >= Jm && e <= eh, rg = 40, sI = "Create an Xtrata radio gift player", Od = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), iI = /^[^\u0000-\u001f\u007f<>]+$/u;
function sg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && iI.test(e) : !n;
}
function eb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!sg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!sg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > rg) throw new Error(`A player holds 1 to ${rg} songs.`);
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
const tb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return nf(of(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, oI = (e) => ({
  domain: Sr({ name: St(Qm), version: St("1"), "chain-id": En(1) }),
  message: Sr({
    purpose: St(sI),
    admin: St(e.admin),
    player: St(e.hash),
    issued: En(e.issued)
  })
}), mr = (e) => e.tracks.filter((t) => !t.hidden), aI = (e) => e.tracks.find((t) => t.hidden) ?? null, Eu = [300, 500, 1e3], ig = 1800, ku = /* @__PURE__ */ new Map();
async function cI(e) {
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
function lI(e, t, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = e, (() => {
    const c = ku.get(e), l = !!c && c.until > Date.now();
    i.textContent = l ? c.label : t, i.classList.toggle("is-done", l && c.ok), i.classList.toggle("is-failed", l && !c.ok);
  })(), i.onclick = async () => {
    const c = await n();
    if (c) {
      ku.set(e, { ...c, until: Date.now() + ig });
      for (const l of document.querySelectorAll("button[data-feedback]"))
        l.dataset.feedback === e && (l.textContent = c.label, l.classList.remove("is-done", "is-failed", "is-pop"), l.offsetWidth, l.classList.add(c.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ku.delete(e), s();
      }, ig + 50);
    }
  }, i;
}
const rr = (e, t, n, r, s) => lI(e, t, async () => await cI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), ii = "xtrata.radio.gift.incoming.v1", og = (e) => "xtrata.radio.gift.mine.v1:" + e, ag = (e) => "xtrata.radio.gift.batches.v1:" + e, be = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Dn = (e, t, n = "") => {
  const r = be("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, ta = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Qn = (e) => hr(e).replace(/\.?0+$/, "");
function uI(e) {
  let t = null;
  const n = ($) => [5e3, 1e4, 2e4, 3e4][$] ?? 6e4, r = (() => {
    try {
      const $ = new URL(location.href), F = new URLSearchParams($.hash.slice(1)).get("gift") ?? $.searchParams.get("gift");
      return F !== null && ($.searchParams.delete("gift"), history.replaceState(null, "", $.pathname + ($.search || ""))), ng(F) ? F : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const $ = JSON.parse(e.store.get(ii) || "null");
      return ng($ == null ? void 0 : $.code) ? $.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    t = { code: i }, e.store.set(ii, JSON.stringify({ code: i, at: e.now() }));
    let $ = 0;
    const F = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (V) => {
      const X = await V.json().catch(() => ({}));
      if (V.status === 404) {
        e.store.set(ii, null), t = { ...t, error: (X == null ? void 0 : X.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!V.ok) throw new Error("busy");
      const ee = X;
      t = { ...t, view: ee, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ee.status) && e.store.set(ii, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void F(), n($++)));
    });
    F();
  }
  const o = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, c = () => {
    const $ = t == null ? void 0 : t.view;
    return !($ != null && $.player) || !o() ? null : { player: $.player, from: u($), plays: ea(BigInt($.amount)) };
  }, l = () => {
    const $ = t == null ? void 0 : t.view;
    return !$ || $.player || !o() ? null : { plays: ea(BigInt($.amount)), from: $.from ? e.who($.from) : null };
  }, d = () => {
    const $ = t == null ? void 0 : t.code;
    if (!$) return [];
    const F = `${location.origin}${location.pathname}#gift=${$}`;
    return [rr("gift-pass-on", "Copy the link to pass on", () => F, "primary", e.changed)];
  }, p = () => {
    t = null, e.store.set(ii, null), e.changed();
  }, u = ($) => $.from ? e.who($.from) : $.label ? `Xtrata Radio · ${$.label}` : "Xtrata Radio";
  let w = {};
  const y = ($) => {
    if (w.box) return w.box;
    const F = be("div", "", "ppp-gift-check");
    w.box = F;
    const V = () => {
      const X = window.turnstile;
      !X || w.rendered || (w.rendered = !0, X.render(F, { sitekey: $, callback: (ee) => {
        w.token = ee, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) V();
    else {
      const X = document.createElement("script");
      X.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", X.async = !0, X.onload = V, document.head.append(X);
    }
    return F;
  }, S = ($) => {
    queueMicrotask(() => void $());
  };
  let v;
  async function T($) {
    var X, ee, fe, k, ye, _e, lt, Xe, kt;
    if (!t || t.claiming || !$.listening) return;
    const F = !!((X = t.view) != null && X.player);
    if (F && !$.root) return;
    t.claiming = !0, t.error = void 0, (ee = e.claiming) == null || ee.call(e, !0), e.changed();
    const V = async (rt) => {
      const st = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...rt })
      });
      return { res: st, r: await st.json().catch(() => ({})) };
    };
    try {
      let rt = 0, st = $.listening, yt;
      if (F) {
        const Xt = Number((fe = await e.json("/radio/gift/slots?root=" + encodeURIComponent($.root))) == null ? void 0 : fe.next);
        if (!Number.isSafeInteger(Xt) || Xt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        rt = Xt;
        for (let Ar = 0; ; Ar++) {
          const Yn = await e.album.bind(rt);
          if (st = Yn.address, yt = await V({ wallet: st, binding: Yn }), yt.res.status === 409 && /just taken/.test(((k = yt.r) == null ? void 0 : k.error) || "") && Ar < 5) {
            rt += 1;
            continue;
          }
          break;
        }
      } else yt = await V({ wallet: st });
      const { res: qt, r: He } = yt;
      if (qt.status === 503 && /sending another gift/.test((He == null ? void 0 : He.error) || "")) {
        t.waiting = !0, (ye = e.claiming) == null || ye.call(e, !0), clearTimeout(v), v = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!qt.ok) {
        const Xt = String((He == null ? void 0 : He.error) || "");
        if (qt.status === 404 || qt.status === 410 || qt.status === 409 && /already had a gift|brand-new|already have this album/.test(Xt))
          throw e.store.set(ii, null), new Error(Xt || "This gift cannot be opened.");
        if (qt.status === 429 || qt.status === 403 || qt.status === 400 && !/wallet number/i.test(Xt)) throw new Error(Xt || `Could not open the gift (${qt.status}).`);
        const Yn = /topping up/.test(Xt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(Xt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(Xt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Yn), { retry: !0, slow: /topping up|not paid for yet/.test(Xt) });
      }
      t.done = !0, e.store.set(ii, null), F ? await e.album.arrived(rt, st, He.txid, BigInt(He.amount)) : e.giftSent(He.txid, BigInt(He.amount));
    } catch (rt) {
      const st = rt, yt = st.name === "TypeError" || st.name === "AbortError" || st.name === "TimeoutError" || /wallet number/i.test(st.message);
      if (st.retry || yt) {
        const qt = t.tries ?? 0;
        t.tries = qt + 1, t.retry = { text: st.retry ? st.message : "Still sending your gift… the network is slow, trying again." }, (_e = e.claiming) == null || _e.call(e, !0), clearTimeout(v), v = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, st.slow ? 6e4 : n(qt));
      } else
        t.error = st.message, (lt = e.claiming) == null || lt.call(e, !1);
      w.token = void 0;
      try {
        (kt = (Xe = window.turnstile) == null ? void 0 : Xe.reset) == null || kt.call(Xe, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let U = null;
  function H($) {
    if (!$.listening || !$.depositPending || $.step !== "fund")
      return U = null, [];
    if (!U || U.wallet !== $.listening || e.now() - U.at > 3e4) {
      const V = $.listening;
      U = { ...(U == null ? void 0 : U.wallet) === V ? U : {}, wallet: V, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(V)).then((X) => {
        var ee, fe;
        (U == null ? void 0 : U.wallet) === V && (U.state = (ee = X == null ? void 0 : X.gift) == null ? void 0 : ee.state, U.problem = ((fe = X == null ? void 0 : X.gift) == null ? void 0 : fe.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const F = be("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return F.title = `Network reply: ${U.problem}`, [F];
  }
  function E($, F, V = !1) {
    var _e, lt;
    const X = F.player, ee = BigInt(F.amount), fe = V ? [] : [be("p", `🎁 ${u(F)} sent you “${X.title}”${X.subtitle ? ` by ${X.subtitle}` : ""}: ${mr(X).length} ${mr(X).length === 1 ? "song" : "songs"} and ${ea(ee).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!$.root && ["fund", "ready", "over", "link"].includes($.step))) {
      if (V) return fe;
      if (fe.push(be("p", $.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : $.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), $.step === "intro") {
        const Xe = document.createElement("details");
        Xe.className = "ppp-how";
        const kt = document.createElement("summary");
        kt.textContent = "How does this work?", Xe.append(kt, be("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), fe.push(Xe);
      }
      return fe;
    }
    if ($.walletCannotAlbums)
      return fe.push(be("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), fe;
    const ye = (lt = (_e = $.gate) == null ? void 0 : _e.gifts) == null ? void 0 : lt.turnstileSiteKey;
    return ye && !w.token ? fe.push(be("p", "One quick check and it is yours:", "ppp-mute"), y(ye)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => T($)), fe.push(...B($, "Sending your album…")), fe;
  }
  function B($, F) {
    const V = [];
    return t.claiming || t.waiting ? V.push(be("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : F, "ppp-cyan")) : t.retry && V.push(be("p", t.retry.text, "ppp-warn"), Dn("Try now", () => {
      clearTimeout(v), t.retry = void 0, T($);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? V.push(be("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...d(), Dn("Forget this gift link here", p, "quiet")) : t.error && V.push(be("p", t.error, "ppp-bad"), Dn("Try again", () => {
      t.error = void 0, T($);
    })), V;
  }
  const _ = ($) => {
    var F;
    return !!t && !t.done && !t.error && o() && !!$.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !$.linked && !$.creditedTo && ($.createdHere || $.brandNew || !!((F = t.view) != null && F.player)) && ($.balance ?? 0n) === 0n && !$.entries.length);
  };
  function Z($, F = {}) {
    var rt, st, yt;
    const V = H($);
    if (!t || ["off", "elsewhere"].includes($.step)) return V;
    const X = t.view;
    if (t.error && !X) return [be("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!X) return [be("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return V;
    if (X.status === "claimed" || X.status === "claiming") return [be("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(X.status)) return [be("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (X.status === "pending-deposit") return [be("p", `🎁 ${u(X)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (X.player) return [...E($, X, !!F.bare), ...V];
    const ee = !!$.listening && (!($.createdHere || $.brandNew) || !!$.linked || !!$.creditedTo || ($.balance ?? 0n) > 0n || $.entries.length > 0), fe = ee ? ((rt = e.claimNew) == null ? void 0 : rt.call(e, $)) ?? null : null;
    if (fe)
      return [
        be("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        Dn("Claim it as a new player", fe, "primary"),
        Dn("Not now", p, "quiet")
      ];
    if (ee)
      return [be("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), Dn("Forget this gift link here", p, "quiet")];
    const k = BigInt(X.amount), ye = ea(k).toLocaleString(), _e = be(
      "p",
      `🎁 ${u(X)} sent you ${Qn(k)} STX of on-chain music: about ${ye} paid plays.`,
      "ppp-gift"
    ), lt = F.bare ? [] : [_e], Xe = !!$.listening && ($.createdHere || $.brandNew) && !$.linked && !$.creditedTo && $.step === "fund" && ($.balance ?? 1n) === 0n && !$.depositPending && !$.entries.length, kt = (yt = (st = $.gate) == null ? void 0 : st.gifts) == null ? void 0 : yt.turnstileSiteKey;
    return Xe ? (kt && !w.token ? lt.push(be("p", "One quick check and it is yours:", "ppp-mute"), y(kt)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => T($)), lt.push(...B($, "Sending your gift…"))) : $.step === "intro" ? F.bare || lt.push(be("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : $.listening && $.linked ? lt.push(be("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), Dn("Forget this gift link here", p, "quiet")) : $.listening && ($.balance ?? 0n) > 0n && lt.push(be("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), Dn("Forget this gift link here", p, "quiet")), lt;
  }
  async function de($, F, V) {
    var X;
    try {
      const ee = await e.json("/radio/gift/for?wallet=" + encodeURIComponent($));
      if ((X = ee == null ? void 0 : ee.gift) != null && X.returnTo) return { ok: !0, funder: ee.gift.returnTo, txId: ee.gift.txid ?? void 0, amount: ee.gift.amount, distinct: 1 };
    } catch {
      if (V) return { ok: !1 };
    }
    return F();
  }
  const Q = be("div", "", "ppp-gift-fold");
  let Y = 250000n, b = "", I = "";
  const N = ($) => {
    try {
      const F = JSON.parse(e.store.get(og($)) || "[]");
      return Array.isArray(F) ? F : [];
    } catch {
      return [];
    }
  }, M = ($, F) => e.store.set(og($), JSON.stringify(F.slice(0, 50)));
  async function q($) {
    const F = N($);
    for (const V of F)
      if (!(V.view && ["claimed", "refunded", "expired"].includes(V.view.status)))
        try {
          V.view = !V.view || V.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: V.id, ...V.txid ? { txid: V.txid } : {} }) }) : await e.json("/radio/gift?id=" + V.id), V.error = void 0;
        } catch (X) {
          V.error = X.message;
        }
    M($, F), e.changed();
  }
  async function D($) {
    if (b) return;
    b = "Starting your gift…", I = "", e.changed();
    let F = null;
    try {
      F = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: $, amount: Y.toString() }) });
      const V = N($);
      V.unshift({ id: F.id, code: F.code, amount: Y.toString(), at: e.now() }), M($, V), b = "Approve the gift in your wallet…", e.changed();
      const X = await e.pay($, F.depositTo, BigInt(F.deposit), F.memo), ee = N($), fe = ee.find((k) => k.id === F.id);
      fe && (fe.txid = X, fe.view = { status: "pending-deposit", amount: Y.toString(), source: "friend", from: $, label: "", expires: 0 }), M($, ee), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", q($);
    } catch (V) {
      I = V.message || "Not sent.";
    } finally {
      b = "", e.changed();
    }
  }
  const ae = ($) => "xtrata.radio.gift.players.v1:" + $, ie = ($) => {
    try {
      const F = JSON.parse(e.store.get(ae($)) || "[]");
      return Array.isArray(F) ? F.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id)) : [];
    } catch {
      return [];
    }
  };
  async function Ue($, F) {
    var V;
    if (!b) {
      b = "Checking the player…", I = "", e.changed();
      try {
        const X = F.tracks.split(/[\s,]+/).filter(Boolean).map((Xe) => Number(Xe.replace(/^#/, ""))), ee = (F.explicit ?? "").split(/[\s,]+/).map((Xe) => Xe.replace(/^#/, "")).filter(Boolean).map(Number), fe = eb({ title: F.title.trim(), subtitle: F.subtitle.trim(), tracks: X, cover: (V = F.cover) != null && V.trim() ? Number(F.cover.trim().replace(/^#/, "")) : null, ...ee.length ? { explicit: ee } : {} });
        b = "Sign in your wallet…", e.changed();
        const k = { admin: $, hash: tb(fe), issued: e.now() }, ye = await e.sign($, oI(k));
        b = "Making the player…", e.changed();
        const _e = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: fe, request: k, signature: ye }) }), lt = ie($).filter((Xe) => Xe.id !== _e.id);
        lt.unshift({ id: _e.id, title: _e.title, tracks: _e.tracks }), e.store.set(ae($), JSON.stringify(lt.slice(0, 30))), I = `${_e.existing ? "That player already exists" : "Player made"} ✓ “${_e.title}” · ${_e.tracks} songs. Pick it below for a batch.`;
      } catch (X) {
        I = X.message || "Not made.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const L = ($, F) => q5($ || location.origin + "/radio.html", F), O = ($) => {
    try {
      const F = JSON.parse(e.store.get(ag($)) || "[]");
      return Array.isArray(F) ? F.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id) && Array.isArray(V.codes)) : [];
    } catch {
      return [];
    }
  }, le = ($, F) => e.store.set(ag($), JSON.stringify(F.slice(0, 20))), me = ($) => !!$.view && $.view.status === "live" && $.view.copies.waiting + $.view.copies.claiming + $.view.copies.refunding === 0, Ce = ($, F) => e.json($, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(F) });
  let Te = 0;
  async function _t($) {
    const F = O($);
    for (const V of F)
      if (!me(V))
        try {
          V.view = !V.view || V.view.status === "pending-deposit" ? await Ce("/radio/gift/batch/confirm", { id: V.id, ...V.txid ? { txid: V.txid } : {} }) : await e.json("/radio/gift/batch?id=" + V.id), V.error = void 0;
        } catch (X) {
          V.error = X.message;
        }
    try {
      const V = await e.json("/radio/gift/batches?creator=" + encodeURIComponent($));
      for (const X of (V == null ? void 0 : V.batches) ?? []) {
        const ee = F.find((fe) => fe.id === X.id);
        if (ee) {
          ee.error || (ee.view = X);
          continue;
        }
        F.push({ id: X.id, codes: [], count: X.count, amount: X.amount, label: X.label, player: X.player, depositTo: "", deposit: X.deposit, memo: X.memo, at: 0, view: X });
      }
    } catch {
    }
    le($, F), e.changed();
  }
  async function Me($, F) {
    const V = O($).find((X) => X.id === F);
    if (!(!V || !V.depositTo || b)) {
      b = "Approve the payment in your wallet…", I = "", e.changed();
      try {
        const X = await e.pay($, V.depositTo, BigInt(V.deposit), V.memo), ee = O($), fe = ee.find((k) => k.id === F);
        fe && (fe.txid = X), le($, ee), I = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", b = "", _t($);
      } catch (X) {
        I = `${/cancel/i.test(X.message) ? "Payment cancelled." : X.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        b = "", e.changed();
      }
    }
  }
  async function $e($, F, V, X) {
    if (b) return;
    if (!F.ok) {
      I = F.reason, e.changed();
      return;
    }
    b = "Sign in your wallet…", I = "", e.changed();
    let ee = null;
    try {
      const fe = { creator: $, count: F.count, amount: F.amount.toString(), label: V, issued: e.now(), ...X ? { player: X } : {} }, k = await e.sign($, J5(fe));
      b = "Making your links…", e.changed(), ee = await Ce("/radio/gift/batch", { request: fe, signature: k });
      const ye = O($);
      ye.unshift({ id: ee.id, codes: ee.codes, count: F.count, amount: ee.amount, label: V, player: X ?? null, depositTo: ee.depositTo, deposit: ee.deposit, memo: ee.memo, at: e.now() }), le($, ye);
    } catch (fe) {
      I = fe.message || "Not made.", b = "", e.changed();
      return;
    }
    b = "", e.changed(), await Me($, ee.id);
  }
  const ke = () => Jt(!!nt.value, Be.value, oe.value);
  function Jt($, F, V) {
    const X = F === "max" ? eI($) : Number(F), ee = Q5(X, $), fe = Number(V);
    return !Number.isInteger(fe) || fe < 1 || fe > yc ? { ok: !1, reason: `Make 1 to ${yc} copies at a time.`, album: $, plays: X, amount: ee, count: fe } : rI(ee) ? { ok: !0, reason: "", album: $, plays: X, amount: ee, count: fe, bill: nI(fe, ee, $) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: $, plays: X, amount: ee, count: fe };
  }
  const Qt = ($ = ke()) => {
    if (!$.ok) return $.reason;
    const F = $.bill;
    return `Each copy: ${$.plays.toLocaleString()} paid plays (${Qn(F.holders)} to song holders, ${Qn(F.fees)} network fees)${$.album ? `, ${Qn(F.float)} for the album’s likes` : ""}, ${Qn(F.reserve)} kept so a listener can return what is left, + ${Qn(F.sendFee)} to send it = ${Qn(F.perCopy)} STX. ${$.count} copies = ${Qn(F.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Je = ($, F) => F.codes.map((V) => L($, V)), $t = be("input");
  $t.type = "range", $t.min = String(Jm), $t.max = String(eh), $t.step = "10000", $t.value = String(Y), $t.setAttribute("aria-label", "Gift amount");
  const vt = be("p", "", "ppp-gift-amount"), R = Dn("", () => {
    const $ = e.main();
    $ && D($);
  }, "primary"), P = () => {
    vt.textContent = re(), R.textContent = `Gift ${Qn(Y)} STX`;
  };
  $t.oninput = () => {
    Y = BigInt($t.value), P();
  };
  const re = () => `${Qn(Y)} STX · about ${ea(Y).toLocaleString()} paid plays · you pay ${Qn(Y + cl)} STX with the network fee`;
  P();
  const J = be("input");
  J.maxLength = 60, J.placeholder = "Title, e.g. Proof of Sound", J.setAttribute("aria-label", "Player title");
  const se = be("input");
  se.maxLength = 80, se.placeholder = "Artist (optional)", se.setAttribute("aria-label", "Player subtitle");
  const Ze = be("textarea");
  Ze.rows = 3, Ze.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ze.setAttribute("aria-label", "Songs");
  const xe = be("input");
  xe.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", xe.setAttribute("aria-label", "Explicit songs");
  const Ne = be("input");
  Ne.inputMode = "numeric", Ne.placeholder = "Cover inscription number (optional), shown when the album loads", Ne.setAttribute("aria-label", "Cover inscription");
  const nt = be("select");
  nt.setAttribute("aria-label", "Batch album");
  const Be = be("select");
  Be.setAttribute("aria-label", "Plays per copy");
  for (const $ of [.../* @__PURE__ */ new Set([50, 100, 250, ...Eu])].sort((F, V) => F - V)) Be.append(ta(`${$.toLocaleString()} plays`, String($)));
  Be.append(ta("Max (1 STX)", "max")), Be.value = String(Eu[0]);
  const oe = be("input");
  oe.type = "number", oe.min = "1", oe.max = String(yc), oe.value = "10", oe.setAttribute("aria-label", "Copies");
  const Fe = be("input");
  Fe.maxLength = 40, Fe.placeholder = "Label, e.g. Opera launch", Fe.setAttribute("aria-label", "Batch label");
  const Qe = be("p", "", "ppp-mute"), Ve = () => {
    Qe.textContent = Qt();
  };
  for (const $ of [nt, Be, oe])
    $.oninput = Ve, $.onchange = Ve;
  Ve();
  function Yt($, F, V) {
    const X = F.view, ee = X == null ? void 0 : X.copies, fe = F.error ? F.error : !X || X.status === "pending-deposit" ? F.txid ? "payment confirming…" : "waiting for your payment" : `${ee.claimed} of ${X.count} claimed${ee.refunding + ee.refunded ? ` · ${ee.refunded} refunded${ee.refunding ? `, ${ee.refunding} on their way` : ""}` : ""}`, k = be("li");
    if (k.append(be("span", `${F.label || "Batch"} · ${F.count} × ${Qn(BigInt(F.amount))} STX`, "t"), be("span", fe, "ppp-mute")), !F.txid && F.depositTo && (!X || X.status === "pending-deposit") && k.append(Dn("Pay now", () => void Me($, F.id), "tiny")), F.codes.length && (X == null ? void 0 : X.status) === "live") {
      const ye = Je(V, F);
      k.append(
        rr("batch-copy:" + F.id, "Copy all links", () => ye.join(`
`), "tiny", e.changed),
        rr("batch-csv:" + F.id, "Copy as CSV", () => ["copy,link", ...ye.map((_e, lt) => `${lt + 1},${_e}`)].join(`
`), "tiny", e.changed)
      );
    } else F.codes.length || k.append(be("span", "links were made on another device", "ppp-mute"));
    return k;
  }
  const Kt = be("select");
  Kt.setAttribute("aria-label", "Plays in each copy");
  for (const $ of [.../* @__PURE__ */ new Set([50, 100, 250, ...Eu])].sort((F, V) => F - V)) Kt.append(ta(`${$.toLocaleString()} plays`, String($)));
  Kt.value = "50";
  const Vt = be("input");
  Vt.type = "number", Vt.min = "1", Vt.max = String(yc), Vt.value = "10", Vt.setAttribute("aria-label", "How many copies");
  const gt = be("input");
  gt.maxLength = 40, gt.placeholder = "A note recipients see, e.g. Launch week (optional)", gt.setAttribute("aria-label", "Note for recipients");
  const Mn = be("p", "", "ppp-mute");
  function yn($, F, V) {
    const X = () => Jt(!0, Kt.value, Vt.value), ee = () => {
      Mn.textContent = Qt(X());
    };
    for (const Xe of [Kt, Vt])
      Xe.oninput = ee, Xe.onchange = ee;
    ee();
    const fe = () => (gt.value.trim() || F.title).replace(/[^ -~]/g, "").slice(0, 40), k = Dn("Sign, pay and make links", () => {
      $e($, X(), fe(), F.id);
    }, "primary");
    k.disabled = !!b;
    const ye = (Xe, kt) => {
      const rt = be("label", Xe);
      return rt.append(kt), rt;
    }, _e = [
      be("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims within 30 days come back to you.", "ppp-mute"),
      ye("Plays in each ", Kt),
      ye("Copies ", Vt),
      gt,
      Mn,
      k
    ];
    e.now() - Te > 3e4 && (Te = e.now(), _t($));
    const lt = O($).filter((Xe) => Xe.player === F.id);
    if (lt.length) {
      const Xe = be("ul", "", "ppp-gift-list");
      for (const kt of lt.slice(0, 10)) Xe.append(Yt($, kt, V));
      _e.push(Xe);
    }
    return b && _e.push(be("p", b, "ppp-cyan")), I && _e.push(be("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), _e;
  }
  function Xn($) {
    var ee, fe;
    const F = (ee = $.gate) == null ? void 0 : ee.gifts;
    if (!(F != null && F.enabled) || !F.admin || ["off", "elsewhere", "unsupported"].includes($.step)) return null;
    const V = e.main(), X = [be("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!V)
      X.push(be("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (F.admin) {
      const k = be("div", "", "ppp-gift-admin"), ye = (rt, st) => {
        const yt = be("label", rt);
        return yt.append(st), yt;
      }, _e = ie(V);
      k.append(
        be("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        J,
        se,
        Ze,
        Ne,
        xe,
        Dn("Sign and make player", () => void Ue(V, { title: J.value, subtitle: se.value, tracks: Ze.value, cover: Ne.value, explicit: xe.value }))
      );
      const lt = Dn("Sign, pay and make links", () => {
        $e(V, ke(), Fe.value.trim(), nt.value || void 0);
      });
      lt.disabled = !!b;
      const Xe = nt.value;
      nt.replaceChildren(ta("No album (starter copies)", ""), ..._e.map((rt) => ta(`${rt.title} · ${rt.tracks} songs`, rt.id))), _e.some((rt) => rt.id === Xe) && (nt.value = Xe), Ve(), k.append(
        be("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        ye("Album ", nt),
        ye("Plays each ", Be),
        ye("Copies ", oe),
        Fe,
        Qe,
        lt
      ), e.now() - Te > 3e4 && (Te = e.now(), _t(V));
      const kt = O(V);
      if (kt.length) {
        const rt = be("ul", "", "ppp-gift-list");
        for (const st of kt.slice(0, 10)) rt.append(Yt(V, st, ((fe = $.gate) == null ? void 0 : fe.radioUrl) ?? null));
        k.append(rt);
      }
      X.push(k);
    }
    return b && X.push(be("p", b, "ppp-cyan")), I && X.push(be("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), Q.replaceChildren(...X), Q;
  }
  return { banner: Z, funder: de, renderFold: Xn, copies: yn, liveGift: o, incomingAlbum: c, incomingStarter: l, setAside: p, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: _ };
}
const dI = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function fI(e) {
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
const hI = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function pI(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((i) => (!t.pinnedOnly || t.pins.has(i.slot)) && (() => {
    const o = hI(i);
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
function gI(e, t = 100) {
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
}, cg = "xtrata:al-thumb:v1:", nh = "-", na = 96, yI = 24 * 1024 * 1024, rn = /* @__PURE__ */ new Map(), lg = /* @__PURE__ */ new Set(), Fd = [];
let $u = !1, Iu;
const ka = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(cg + e);
    window.localStorage.setItem(cg + e, t);
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
async function wI(e) {
  var l, d, p, u, w;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((l = t.body) == null ? void 0 : l.cancel()), null;
  if (n.startsWith("image/"))
    return await ((d = t.body) == null ? void 0 : d.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((p = t.body) == null ? void 0 : p.cancel()), "";
  let r = "", s = 0;
  const i = (y) => {
    let S = 0;
    for (; ; ) {
      const v = r.slice(S).search(/<img\b/i);
      if (v < 0)
        return r = y ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const T = S + v, U = r.indexOf(">", T);
      if (U < 0)
        return r = r.slice(T), null;
      const H = r.slice(T, U + 1), E = H.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (E) return E[1].replace(/&amp;/g, "&");
      const B = H.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (B) return "/inscription/" + B[1];
      S = U + 1;
    }
  }, o = (w = (u = t.body) == null ? void 0 : u.getReader) == null ? void 0 : w.call(u);
  if (!o)
    return r = await t.text(), i(!0) ?? "";
  const c = new TextDecoder();
  for (; ; ) {
    const { done: y, value: S } = await o.read();
    if (y) break;
    s += S.byteLength, r += c.decode(S, { stream: !0 });
    const v = i(!1);
    if (v)
      return await o.cancel(), v;
    if (s > yI)
      return await o.cancel(), null;
  }
  return r += c.decode(), i(!0) ?? "";
}
async function mI() {
  if (!$u) {
    $u = !0;
    try {
      for (; Fd.length; ) {
        const e = Fd.shift();
        if (!rn.has(e))
          try {
            const t = await wI(e);
            if (t === null) continue;
            if (!t) {
              rn.set(e, ""), ka(e, nh), ll();
              continue;
            }
            const n = await rh(t);
            rn.set(e, n), n.startsWith("data:image/jpeg") && ka(e, n), ll();
          } catch {
          }
      }
    } finally {
      $u = !1;
    }
  }
}
function sh(e, t) {
  if (t && !rn.get(e) ? (rn.set(e, t), rh(t).then((r) => {
    r !== t && (rn.set(e, r), r.startsWith("data:image/jpeg") && ka(e, r), ll());
  })) : t === "" && !rn.has(e) && rn.set(e, ""), rn.has(e)) return rn.get(e);
  const n = ka(e);
  if (n != null) {
    const r = n === nh ? "" : n;
    return rn.set(e, r), r;
  }
  return lg.has(e) || (lg.add(e), Fd.push(e), Iu || (Iu = setTimeout(() => {
    Iu = void 0, mI();
  }, 1200))), "";
}
function ug(e) {
  if (rn.has(e)) return rn.get(e);
  const t = ka(e);
  if (t == null) return null;
  const n = t === nh ? "" : t;
  return rn.set(e, n), n;
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
const oo = 12, bI = 5e3, fn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, ao = (e, t, n = "") => {
  const r = fn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function xI(e) {
  let t, n = [], r = 0, s = !1, i = !1, o = -1 / 0, c = "", l = "recent", d = !1, p = oo;
  const u = fn("div", "", "ppp-shelf-box");
  th(() => e.changed());
  const w = (N) => "xtrata.radio.shelf.pins.v1:" + N, y = (N) => "xtrata.radio.shelf.recent.v1:" + N, S = (N, M) => {
    try {
      return JSON.parse(e.store.get(N) || "null") ?? M;
    } catch {
      return M;
    }
  }, v = (N) => new Set(S(w(N), []).filter((M) => Number.isSafeInteger(M))), T = (N) => {
    const M = S(y(N), {}), q = {};
    for (const [D, ae] of Object.entries(M)) Number.isSafeInteger(Number(D)) && typeof ae == "number" && (q[Number(D)] = ae);
    return q;
  };
  async function U(N) {
    if (!s) {
      s = !0, i = !1;
      try {
        const M = [];
        let q = 0, D = 0;
        for (let ae = 0; ae < bI / 100 + 1; ae++) {
          const ie = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${q}&limit=100`);
          if (M.push(...fI(ie == null ? void 0 : ie.shelf)), D = Number(ie == null ? void 0 : ie.total) || M.length, !(ie != null && ie.next) || !Number.isSafeInteger(ie.next)) break;
          q = ie.next;
        }
        N === t && (n = M, r = D, o = e.now());
      } catch {
        i = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const H = () => {
    o = -1 / 0;
  }, E = fn("input");
  E.type = "search", E.placeholder = "Search title, artist or #", E.setAttribute("aria-label", "Search your albums"), E.oninput = () => {
    c = E.value, p = oo, e.changed();
  };
  const B = fn("select");
  B.setAttribute("aria-label", "Sort albums");
  for (const N of dI) {
    const M = document.createElement("option");
    M.value = N.value, M.textContent = N.label, B.append(M);
  }
  B.onchange = () => {
    l = B.value, p = oo, e.changed();
  };
  const _ = ao("", () => {
    d = !d, p = oo, e.changed();
  }, "tiny"), Z = fn("div", "", "ppp-shelf-tools");
  Z.append(E, B, _);
  const de = fn("div"), Q = fn("div");
  function Y(N) {
    const M = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (M !== t && (t = M, n = [], r = 0, o = -1 / 0, p = oo), !M || N.walletCannotAlbums) return null;
    if (!s && e.now() - o > 5 * 6e4 && U(M), !n.length)
      return i ? (Q.replaceChildren(fn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), ao("Try again", () => {
        o = -1 / 0, e.changed();
      }, "quiet")), u.replaceChildren(Q), u) : null;
    const q = v(M), D = T(M), ae = pI(n, { query: c, sort: l, pinnedOnly: d, pins: q, recents: D });
    E.value !== c && (E.value = c), B.value = l, _.textContent = d ? "★ Pinned only" : "☆ Pinned only", _.setAttribute("aria-pressed", String(d));
    const ie = [];
    if (N.slot > 0 && ie.push(ao("← My player", () => e.open(0), "quiet")), !ae.length) ie.push(fn("p", "No album matches that.", "ppp-mute"));
    else {
      const Ue = fn("ul", "", "ppp-shelf-list");
      for (const L of ae.slice(0, p)) {
        const O = fn("li", "", L.slot === N.slot ? "now" : ""), le = q.has(L.slot), me = ao(le ? "★" : "☆", () => {
          const Je = new Set(q);
          le ? Je.delete(L.slot) : Je.add(L.slot), e.store.set(w(M), JSON.stringify([...Je])), e.changed();
        }, "tiny");
        me.setAttribute("aria-label", le ? `Unpin ${L.player.title}` : `Pin ${L.player.title}`);
        const Ce = [L.player.subtitle, `${mr(L.player).length} ${mr(L.player).length === 1 ? "song" : "songs"}`, L.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Te = L.slot === N.slot, _t = ao(Te ? "Playing" : "Select", () => {
          e.store.set(y(M), JSON.stringify(gI({ ...D, [L.slot]: e.now() }))), e.open(L.slot);
        }, Te ? "tiny ppp-pick" : "tiny primary ppp-pick");
        _t.disabled = Te;
        const Me = mr(L.player)[0], $e = L.player.cover ?? (Me == null ? void 0 : Me.id), ke = $e ? sh(String($e)) : "", Jt = fn("span", "", "ppp-shelf-art");
        if (ke) {
          const Je = document.createElement("img");
          Je.src = ke, Je.alt = "", Je.decoding = "async", Jt.append(Je);
        } else Jt.textContent = "💿";
        const Qt = fn("span", "", "ppp-shelf-txt");
        Qt.append(fn("span", L.player.title, "t"), fn("span", Ce, "ppp-mute")), O.append(me, Jt, Qt, _t), Ue.append(O);
      }
      ie.push(Ue), ae.length > p && ie.push(ao(`Show more (${ae.length - p} left)`, () => {
        p += oo, e.changed();
      }, "quiet"));
    }
    return i && ie.push(fn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), de.replaceChildren(...ie), u.firstChild !== Z && u.replaceChildren(Z, de), u;
  }
  return { render: Y, invalidate: H, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const N = T(t), M = [...n].filter((q) => q.player).sort((q, D) => (N[D.slot] ?? 0) - (N[q.slot] ?? 0) || D.slot - q.slot)[0];
    return M ? { slot: M.slot, title: M.player.title } : null;
  } };
}
const dg = "http://www.w3.org/2000/svg", SI = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function ul(e = "", t = !1) {
  const n = document.createElementNS(dg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of SI) {
    const i = document.createElementNS(dg, "path");
    i.setAttribute("fill-rule", "evenodd"), i.setAttribute("fill", t ? "currentColor" : r), i.setAttribute("d", s), n.append(i);
  }
  return n;
}
const at = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Tr = (e, t, n, r = !1) => {
  const s = at("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, nb = (e) => e.toLocaleString(), fg = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, vI = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function dl(e, t) {
  const n = at("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const i = at("li", s < t ? "is-done" : s === t ? "is-now" : "");
    i.append(at("i", "", s < t ? "✓" : String(s + 1)), at("span", "", r)), n.append(i);
  }), n;
}
function AI() {
  const e = at("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(at("span", "tier-disc__mark", "?")), e;
}
const EI = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], ur = {
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
    unlock: "Open my existing player instead"
  },
  arriving: { title: "Your player is made", body: "Your plays are on their way to it. This usually takes about a minute: keep this page open and it carries on by itself." },
  landed: { title: "You’re in", primary: "Start listening" },
  empty: { title: "Your player is ready", body: "It has no plays yet. Add some and every song you hear pays its artist.", primary: "Add plays", full: "Look around the radio" },
  checking: "One moment…",
  asking: "Continue in the box below."
}, kI = (e, t, n = !1) => n ? `${t || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${t || "Xtrata Music"} has covered ${e ? `${nb(e)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, $I = (e) => e ? `Your player holds ${nb(e)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", II = (e) => e ? `You got a ${e.name} player` : ur.landed.title;
function LI(e, t = !0) {
  const n = at("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(at("span", "tier-disc__mark", e.mark)), n;
}
function CI(e) {
  const t = document.documentElement;
  let n = !1;
  const r = () => {
    const s = at("ul", "al-welcome-points");
    for (const [i, o, c] of EI) {
      const l = at("li");
      l.title = o;
      const d = at("em", "", c);
      d.setAttribute("aria-hidden", "true"), l.append(d, at("b", "", i), at("span", "", o)), s.append(l);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, i = !1) {
      var u;
      if (!s) {
        n && !i && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = s.mode, s.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const o = at("header", "al-top"), c = at("a", "al-brand");
      c.href = "/radio", c.append(ul("al-logo"), at("span", "", "Xtrata "), at("b", "", "Music")), o.append(c);
      const l = at("div", "al-body al-body--welcome"), d = at("div", "al-welcome"), p = s.mode;
      if (p === "checking")
        d.append(at("p", "al-welcome-wait", ur.checking));
      else {
        const w = vI(p);
        if (w >= 0 && d.append(dl(p === "new" ? fg.fresh : fg.gift, w)), s.tier && (p === "landed" || p === "back" || p === "empty") ? d.append(LI(s.tier)) : p === "gift" || p === "arriving" ? d.append(AI()) : p === "new" && d.append(ul("al-hero-mark")), d.append(at("h1", "", p === "landed" ? II(s.tier) : p === "back" && s.tier ? `Your ${s.tier.name} player` : ur[p].title)), d.append(at("p", "", p === "gift" ? kI(s.plays, s.from, s.mystery) : p === "landed" ? $I(s.plays) : ur[p].body)), (p === "landed" || p === "gift") && d.append(r()), s.status.length) {
          const y = at("div", "al-status");
          y.setAttribute("role", "status"), y.append(...s.status), d.append(y);
        }
        if (s.asking) d.append(at("p", "al-hint al-hint--ask", ur.asking));
        else if (p === "back" && s.claimNew) {
          const y = ur.backClaim;
          d.append(at("p", "al-hint", y.body)), s.canStart && d.append(Tr("al-primary", y.primary, s.claimNew, s.busy), at("p", "al-hint", y.hint), Tr("al-link", y.unlock, s.unlock, s.busy)), d.append(Tr("al-link", ur.back.full, s.full));
        } else if (p === "gift" || p === "new" || p === "back") {
          const y = ur[p];
          s.canStart && d.append(Tr("al-primary", y.primary, p === "back" ? s.unlock : s.start, s.busy), at("p", "al-hint", y.hint)), s.canStart && d.append(Tr("al-link", y.returning, s.returning, s.busy)), d.append(Tr("al-link", y.full, s.full));
        } else if (p === "landed") {
          if (d.append(Tr("al-primary", ur.landed.primary, s.full)), (u = s.albums) != null && u.length) {
            d.append(at("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const y of s.albums) {
              const S = Tr("al-album", "", y.run);
              if (y.cover) {
                const T = at("img", "al-album__art");
                T.src = y.cover, T.alt = "", S.classList.add("al-album--art"), S.append(T);
              }
              const v = at("span", "al-album__t");
              v.append(at("b", "", y.title), at("span", "", y.by)), S.append(v), d.append(S);
            }
          }
        } else p === "empty" && d.append(Tr("al-primary", ur.empty.primary, s.restock), Tr("al-link", ur.empty.full, s.full));
      }
      l.append(d), e.hidden = !1, e.replaceChildren(o, l);
    }
  };
}
const TI = 20, BI = ["Album", "Passkey", "Listen"], an = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Ht = {
  grid: an('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: an('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: an('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: an('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: an('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: an('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: an('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: an('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: an('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: an('<path d="M6 9l6 6 6-6"/>', 18),
  right: an('<path d="M9 6l6 6-6 6"/>', 16),
  close: an('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: an('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: an('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: an('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: an('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: an('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function te(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, i] of Object.entries(t))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const dn = (e, ...t) => te("button", { type: "button", ...e }, ...t), wc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, ra = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, MI = { music: "My music", device: "This device", gifts: "Albums (admin)" }, NI = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function hg(e, t, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const c = document.documentElement;
  function l(b) {
    var N, M, q;
    if (!b || !Number.isSafeInteger(b)) return "";
    const I = (q = (M = (N = t.radio()) == null ? void 0 : N.getState) == null ? void 0 : M.call(N)) == null ? void 0 : q.albumCover;
    return I != null && I.url && Number(I.tokenId) === b ? I.url : Mc(b);
  }
  th(() => Y());
  function d(b) {
    var N;
    i = b, b ? c.dataset.sheet = b : delete c.dataset.sheet;
    const I = document.querySelector(".side");
    if (b && b !== "more") {
      for (const D of NI[b]) {
        const ae = I == null ? void 0 : I.querySelector(D);
        ae && (ae.open = !0);
      }
      const M = document.getElementById("sheetTitle");
      M && (M.textContent = MI[b]);
      const q = document.getElementById("sheetExtra");
      q && q.replaceChildren(...b === "music" ? [u()] : []), (N = I == null ? void 0 : I.scrollTo) == null || N.call(I, { top: 0 });
    }
    Y();
  }
  const p = r ? null : document.getElementById("sheetClose");
  p && (p.onclick = () => d("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && i && c.dataset.view === "album" && d("");
  });
  const u = () => dn(
    { class: "al-row", onClick: () => {
      d(""), t.openPlayer();
    } },
    te("span", { class: "al-row-i", html: Ht.radio }),
    te("span", { class: "al-row-t" }, te("b", {}, "Xtrata Radio"), te("small", {}, "Every song on-chain · FM, liked, all")),
    te("span", { class: "al-row-go", html: Ht.right })
  );
  let w = null, y = !1;
  const S = () => {
    var I;
    const b = t.radio();
    y || !(b != null && b.subscribe) || (y = !0, b.subscribe((N) => {
      w = N, (s == null ? void 0 : s.mode) === "open" && Y();
    }), w = ((I = b.getState) == null ? void 0 : I.call(b)) ?? null);
  };
  r || setInterval(() => {
    var M, q;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const b = (q = (M = t.radio()) == null ? void 0 : M.getPosition) == null ? void 0 : q.call(M), I = e.querySelector(".al-bar > i"), N = e.querySelectorAll(".al-times span");
    !b || !I || (I.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", N.length === 2 && (N[0].textContent = wc(b.current || 0), N[1].textContent = b.duration ? wc(b.duration) : "–:––"));
  }, 500);
  let v = "", T = null;
  function U(b, I, N = {}) {
    const M = N.song || l(b.cover), D = [M ? te("img", { src: M, alt: N.song ? "Song artwork" : `${b.title} cover` }) : te("div", { class: "al-cover-fallback" }, te("b", {}, b.title), b.subtitle ? te("span", {}, b.subtitle) : null), N.paused ? te("span", { class: "al-paused" }, te("i", { html: Ht.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], ae = "al-cover" + (I ? "" : " al-cover--small") + (N.paused ? " is-paused" : "");
    return N.flip ? (D.push(te("span", { class: "al-flip", "aria-hidden": "true", html: Ht.flip })), dn({ class: ae + " is-flippable", "aria-label": N.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: N.flip }, ...D)) : te("div", { class: ae }, ...D);
  }
  function H(b) {
    return b.plays === null || b.plays === void 0 ? te("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? te("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : te("span", { class: "al-chip" + (b.plays <= TI ? " al-chip--low" : "") }, `${ra(b.plays, "play", "plays")} left`);
  }
  function E(b) {
    const I = b.player, N = I.tracks.filter((q) => !q.hidden), M = [];
    return b.step !== void 0 && M.push(dl(BI, b.step)), b.mode === "arrive" && b.from && M.push(te("p", { class: "al-from" }, te("span", { html: Ht.gift }), te("span", {}, te("b", {}, b.from), " sent you an album"))), M.push(U(I, !0)), M.push(te(
      "div",
      { class: "al-intro" },
      te("h1", {}, I.title),
      I.subtitle ? te("p", { class: "al-artist" }, I.subtitle) : null,
      N.length ? te("p", { class: "al-songline" }, N.map((q) => q.title || `#${q.id}`).join(" · ")) : null,
      te("span", { class: "al-chip" }, [ra(N.length, "song", "songs"), b.offered ? ra(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && M.push(te("div", { class: "al-status", role: "status" }, ...b.status)), M.push(te("div", { class: "al-grow" })), b.asking ? M.push(te("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && M.push(dn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, te("span", { html: Ht.playSmall }), b.primary.label)), b.hint && !b.asking && M.push(te("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && M.push(dn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), M;
  }
  function B(b, I) {
    const { songs: N, current: M, started: q, own: D, out: ae, waiting: ie } = I, Ue = b.player, L = t.radio(), O = [];
    O.push(te("div", { class: "al-listhead" }, te("span", {}, te("b", {}, Ue.title), ` · ${ra(N.length, "song", "songs")}`), H(b)));
    const le = l(Ue.cover), me = "album:" + Ue.cover;
    le && !rn.has(me) && (rn.set(me, le), rh(le).then((Te) => {
      Te !== le && (rn.set(me, Te), Y());
    }));
    const Ce = le ? rn.get(me) || le : "";
    return O.push(te("ol", { class: "al-tracks" }, ...N.map((Te, _t) => {
      const Me = String(Te.id) === M, $e = sh(String(Te.id), Me && q ? D : void 0);
      return te("li", {}, dn(
        { class: "al-track" + (Me ? " is-on" : ""), "aria-label": `Play ${Te.title || "#" + Te.id}`, "aria-current": Me ? "true" : void 0, disabled: ae || ie, onClick: () => {
          var ke;
          return (ke = L == null ? void 0 : L.playToken) == null ? void 0 : ke.call(L, Te.id);
        } },
        te(
          "span",
          { class: "al-th" + ($e ? "" : " is-blank") },
          $e ? te("img", { src: $e, alt: "", decoding: "async" }) : Ce ? te("img", { src: Ce, alt: "", decoding: "async" }) : null,
          $e ? null : te("span", { class: "al-n" }, String(_t + 1)),
          Me ? te("span", { class: "al-eq", html: Ht.eq }) : null
        ),
        te("span", { class: "al-tt" }, Te.title || `#${Te.id}`, Te.explicit ? te("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), O;
  }
  function _(b) {
    var $e;
    const I = b.player, N = I.tracks.filter((ke) => !ke.hidden), M = t.radio(), q = w == null ? void 0 : w.nowPlaying, D = q && I.tracks.some((ke) => String(ke.id) === String(q.tokenId)) ? String(q.tokenId) : null, ae = D ? I.tracks.find((ke) => String(ke.id) === D) : null, ie = b.plays === 0 && !b.playsComing, Ue = !!b.playsComing && !b.plays, L = !!(w != null && w.playing) && !!D, O = w == null ? void 0 : w.heart, le = D ? ($e = M == null ? void 0 : M.getPosition) == null ? void 0 : $e.call(M) : null;
    D && (L || ((le == null ? void 0 : le.current) ?? 0) > 0.5) && (v = I.id);
    const me = !!D && v === I.id;
    T && T !== D && (T = null);
    const Ce = me ? String((q == null ? void 0 : q.cover) || "") : "", Te = !!Ce && T === D, Me = [U(I, !ie, { song: Te ? "" : Ce, paused: me && !L, flip: Ce ? () => {
      T = T === D ? null : D, Y();
    } : void 0, flipped: Te })];
    if (Me.push(te(
      "div",
      { class: "al-now" },
      te(
        "div",
        { class: "al-now-t" },
        te("div", { class: "al-song" }, ae ? ae.title || (q == null ? void 0 : q.title) || `#${ae.id}` : I.title),
        te("div", { class: "al-artist" }, ae ? ae.artist || (q == null ? void 0 : q.artist) || I.subtitle : I.subtitle || "Press play")
      ),
      D ? dn({ class: "al-icon" + (O != null && O.liked ? " is-on" : ""), "aria-label": O != null && O.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(O != null && O.liked)), disabled: !!(O != null && O.pending) || !!(O != null && O.locked) || Ue, onClick: () => {
        var ke;
        return (ke = M == null ? void 0 : M.toggleLike) == null ? void 0 : ke.call(M);
      }, html: O != null && O.liked ? Ht.heartOn : Ht.heart }) : null
    )), ie)
      Me.push(te(
        "div",
        { class: "al-out" },
        te("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        te("p", { class: "al-out-t" }, "You've played this album out"),
        te("p", { class: "al-out-s" }, "Add plays to keep listening."),
        Z(b, !0)
      ));
    else {
      const ke = le != null && le.duration ? Math.min(100, le.current / le.duration * 100) : 0;
      Me.push(te(
        "div",
        { class: "al-prog" },
        te("div", { class: "al-bar" }, te("i", { style: `width: ${ke}%` })),
        te("div", { class: "al-times" }, te("span", {}, wc((le == null ? void 0 : le.current) || 0)), te("span", {}, le != null && le.duration ? wc(le.duration) : "–:––"))
      ));
    }
    return Me.push(te(
      "div",
      { class: "al-ctl" + (ie || Ue ? " is-off" : "") },
      dn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ie || Ue, onClick: () => {
        var ke;
        return (ke = M == null ? void 0 : M.prev) == null ? void 0 : ke.call(M);
      }, html: Ht.prev }),
      dn({ class: "al-play", "aria-label": L ? "Pause" : "Play", disabled: ie || Ue, onClick: () => {
        var ke;
        return (ke = M == null ? void 0 : M.playPause) == null ? void 0 : ke.call(M);
      }, html: L ? Ht.pause : Ht.play }),
      dn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ie || Ue, onClick: () => {
        var ke;
        return (ke = M == null ? void 0 : M.next) == null ? void 0 : ke.call(M);
      }, html: Ht.next })
    )), b.status.length && Me.push(te("div", { class: "al-status", role: "status" }, ...b.status)), Me.push(...B(b, { songs: N, current: D, started: me, own: Ce, out: ie, waiting: Ue })), Me.push(te("div", { class: "al-grow" })), Me.push(dn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => d(i === "more" ? "" : "more") },
      te("span", {}, "More ", te("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      te("span", { html: Ht.down })
    )), Me;
  }
  function Z(b, I) {
    const N = te("div", { class: "al-topups" + (I ? " al-topups--primary" : "") }), M = I ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const q of M) {
      const D = b.myPlays !== void 0 && b.myPlays >= q && !b.playsComing && !b.busy;
      N.append(dn({ class: "al-topup", disabled: !D, onClick: () => t.topUp(q) }, I ? `Add ${q.toLocaleString()} plays` : `+${q.toLocaleString()}`));
    }
    return I && N.append(dn({ class: "al-link", onClick: () => d("more") }, "Other amounts")), N;
  }
  function de(b) {
    const I = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), N = te(
      "div",
      { class: "al-card" },
      te("div", { class: "al-card-h" }, te("b", {}, `Add plays to ${b.player.title}`), te("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      Z(b, !1),
      te("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : I ? `Moved from My player · ${ra(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !I && !b.playsComing && b.myPlays !== void 0 ? dn({ class: "al-link", onClick: () => {
        d(""), t.openPlayer();
      } }, "Open My player") : null
    ), M = (D, ae, ie, Ue) => dn(
      { class: "al-row", onClick: Ue },
      te("span", { class: "al-row-i", html: D }),
      te("span", { class: "al-row-t" }, te("b", {}, ae), te("small", {}, ie)),
      te("span", { class: "al-row-go", html: Ht.right })
    ), q = te(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      M(Ht.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, Y();
      }),
      o ? te("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return te(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      te("div", { class: "al-sheet-h" }, te("b", {}, "More"), dn({ class: "al-icon", "aria-label": "Close", onClick: () => d(""), html: Ht.close })),
      b.mode === "open" ? N : null,
      te(
        "div",
        { class: "al-rows" },
        M(Ht.grid, "My music", "Your albums and the radio", () => d("music")),
        M(Ht.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          d(""), t.openPlayer();
        }),
        b.canMake ? M(Ht.gift, "Albums (admin)", "Make an album and fund copies", () => d("gifts")) : null,
        M(Ht.device, "This device", "Backup, history, Stacks wallet, returns", () => d("device")),
        q
      )
    );
  }
  function Q(b) {
    var ie, Ue;
    const I = b.player, N = w == null ? void 0 : w.nowPlaying, M = N && I.tracks.some((L) => String(L.id) === String(N.tokenId)) ? String(N.tokenId) : null, q = !!(w != null && w.playing) && !!M, D = M ? (Ue = (ie = t.radio()) == null ? void 0 : ie.getPosition) == null ? void 0 : Ue.call(ie) : null;
    M && (q || ((D == null ? void 0 : D.current) ?? 0) > 0.5) && (v = I.id);
    const ae = !!M && v === I.id;
    return B(b, {
      songs: I.tracks.filter((L) => !L.hidden),
      current: M,
      started: ae,
      own: ae ? String((N == null ? void 0 : N.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function Y() {
    const b = s;
    if (r) {
      if (!b || b.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete c.dataset.albumlist;
        return;
      }
      S(), e.hidden = !1, c.dataset.albumlist = "1", e.replaceChildren(...Q(b));
      return;
    }
    if (!b) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    S(), e.hidden = !1;
    const I = te(
      "header",
      { class: "al-top" },
      te("a", { class: "al-brand", href: "/radio" }, ul("al-logo"), "Xtrata ", te("b", {}, "Music")),
      b.mode === "open" ? dn({ class: "al-icon", "aria-label": "My music", onClick: () => d("music"), html: Ht.grid }) : null
    ), N = te("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? _(b) : E(b));
    e.replaceChildren(I, N, ...i === "more" ? [te("div", { class: "al-scrim", onClick: () => d("") }), de(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, Y();
        return;
      }
      const I = !!s;
      s = b, !b && (I || i) && (i = "", delete c.dataset.sheet), b ? c.dataset.view = "album" : delete c.dataset.view, b != null && b.asking ? c.dataset.asking = "1" : delete c.dataset.asking, Y();
    },
    sheet: () => i,
    setSheet: d
  };
}
const _I = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", PI = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${_I}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, UI = (e) => PI("source|audio", e), HI = 48 * 1024 * 1024;
function OI(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function DI(e) {
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
  async function l(p, u, w = 0) {
    var E, B, _;
    const y = "/inscription/" + p, S = await t(y, { signal: u }), v = (S.headers.get("content-type") || "").toLowerCase();
    if (!S.ok)
      throw await ((E = S.body) == null ? void 0 : E.cancel()), new Error("not found");
    if (v.startsWith("audio/"))
      return await ((B = S.body) == null ? void 0 : B.cancel()), y;
    if (!v.includes("text/html"))
      throw await ((_ = S.body) == null ? void 0 : _.cancel()), new Error("not a song");
    const T = await S.text();
    if (T.length > HI) throw new Error("too large");
    const U = T.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (U) return OI(U[1].replace(/&amp;/g, "&"));
    const H = w === 0 ? UI(T) : null;
    if (H) return l(Number(H), u, 1);
    throw new Error("no audio");
  }
  async function d(p) {
    var w;
    c();
    const u = i = new AbortController();
    o({ id: p, state: "loading" });
    try {
      const y = await l(p, u.signal);
      if (u.signal.aborted) {
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
      })), (w = e.quiet) == null || w.call(e), r.src = y, await r.play(), u.signal.aborted) return;
      o({ id: p, state: "playing" });
    } catch {
      if (u.signal.aborted) return;
      c(), o({ id: p, state: "error" });
    }
  }
  return {
    state: (p) => (n == null ? void 0 : n.id) === p ? n.state : "idle",
    toggle: (p) => {
      (n == null ? void 0 : n.id) === p && n.state !== "error" ? (c(), o(null)) : d(p);
    },
    stop: () => {
      n && (c(), o(null));
    }
  };
}
const FI = ["Earned", "Claim", "Yours"], jI = ["Connect", "Link", "Name"], wt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, ln = (e, t, n, r = !1) => {
  const s = wt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, pg = (e, t, n, r = !1) => {
  const s = ln("al-album", "", n, r), i = wt("span", "al-album__t");
  return i.append(wt("b", "", e), wt("span", "", t)), s.append(i), s;
}, RI = (e) => `No. ${String(e).padStart(4, "0")}`, zI = (e) => e.main ? e.linked ? 2 : 1 : 0;
function GI(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const i = (o) => {
    if (s && r === o.art) return s;
    r = o.art, s = wt("div", "aw-art");
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
      const l = wt("header", "al-top"), d = wt("a", "al-brand");
      d.href = "/radio", d.append(ul("al-logo"), wt("span", "", "Xtrata "), wt("b", "", "Music")), l.append(d);
      const p = wt("div", "al-welcome"), u = o.screen, w = o.tier.name, y = typeof o.name == "string" && o.name ? o.name : null;
      if (p.append(u === "have" ? dl(jI, zI(o)) : dl(FI, u === "making" ? 2 : u === "yours" ? 3 : 1)), u === "making") {
        const H = wt("div", "tier-disc tier-disc--mid");
        H.dataset.tier = o.tier.id, H.append(wt("span", "tier-disc__mark", o.tier.mark)), p.append(H);
      } else if (u !== "have" && u !== "get") {
        const H = i(o);
        H.classList.toggle("aw-art--small", u === "name"), p.append(H);
      }
      const S = u === "ready" ? `Your ${w} record is ready` : u === "name" ? "Put your name on it?" : u === "have" ? "Use the name in your wallet" : u === "get" ? "Get a .btc name" : u === "making" ? "Making your record" : "It’s yours";
      p.append(wt("h1", "", S));
      const v = (H, E = "") => p.append(wt("p", E, H)), T = [];
      if (u === "ready")
        v(`You’ve paid artists for ${o.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), T.push(ln("al-primary", `Claim my ${w} record`, () => o.go("name"), o.busy), wt("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), ln("al-link", "Later", o.later));
      else if (u === "name")
        y ? (v(`Your record will carry ${y} beside your player’s address.`), T.push(ln("al-primary", `Claim with ${y}`, () => o.claim("auto"), o.busy), ln("al-link", "Use my address only", () => o.claim("none"), o.busy))) : o.name === null ? (v("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), T.push(
          pg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => o.go("have"), o.busy),
          pg("I want to get a name", "Where to get one, and how to put it on your player", () => o.go("get"), o.busy),
          ln("al-primary", "Claim with my address", () => o.claim("none"), o.busy)
        )) : (v("Could not check for a .btc name just now.", "ppp-warn"), T.push(ln("al-primary", "Check again", o.refresh, o.busy), ln("al-link", "Claim with my address only", () => o.claim("none"), o.busy))), T.push(wt("p", "al-hint", "What is on the plaque cannot be changed afterwards."));
      else if (u === "have")
        o.main ? !o.linked && o.canLink ? (v(`Link this player to ${o.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), T.push(ln("al-primary", "Link my player", o.link, o.busy))) : o.linked ? y ? (v(`Found it: ${y}. It goes on your plaque beside your player’s address.`), T.push(ln("al-primary", `Claim with ${y}`, () => o.claim("auto"), o.busy))) : (v(o.name === null ? `${o.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", o.name === null ? "" : "ppp-warn"), T.push(ln("al-primary", "Check again", o.refresh, o.busy))) : (v(`Linking is not open for ${o.main} right now. You can send a name to your player instead.`, "ppp-warn"), T.push(ln("al-primary", "Show me how", () => o.go("get"), o.busy))) : (v("Connect the Leather or Xverse wallet that holds your .btc name."), T.push(ln("al-primary", "Connect my wallet", o.connect, o.busy))), T.push(ln("al-link", "Back", () => o.go("name")));
      else if (u === "get") {
        const H = wt("ol", "aw-steps"), E = wt("li");
        E.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const B = wt("a", "", "Open BNS One ↗");
        B.href = "https://bns.one", B.target = "_blank", B.rel = "noopener", E.append(B);
        const _ = wt("li");
        _.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", wt("span", "ppp-addr-full", o.player), o.copyAddress());
        const Z = wt("li", "", "Check again, and your name shows on the preview before you claim.");
        H.append(E, _, Z), p.append(H), T.push(ln("al-primary", "I have my name: check again", () => {
          o.refresh(), o.go("name");
        }, o.busy), ln("al-link", "Back", () => o.go("name")));
      } else if (u === "making") {
        if (v("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), o.claimLink) {
          const H = wt("p", "al-hint"), E = wt("a", "", "See the claim on-chain ↗");
          E.href = o.claimLink, E.target = "_blank", E.rel = "noopener", H.append(E), p.append(H);
        }
      } else if (v(`${w} record ${RI(o.number)}${o.inscription !== void 0 ? ` · Xtrata inscription #${o.inscription}` : ""}. In your player now, and yours for good.`), T.push(ln("al-primary", "See it in my player", o.done)), o.inscription !== void 0) {
        const H = wt("a", "al-link", "Open it full screen ↗");
        H.href = `/i/${o.inscription}`, H.target = "_blank", H.rel = "noopener", T.push(H);
      }
      if (o.status.length) {
        const H = wt("div", "al-status");
        H.setAttribute("role", "status"), H.append(...o.status), p.append(H);
      }
      o.asking ? p.append(wt("p", "al-hint al-hint--ask", "Continue in the box below.")) : p.append(...T);
      const U = wt("div", "al-body al-body--welcome");
      U.append(p), e.hidden = !1, e.replaceChildren(l, U);
    }
  };
}
const rb = "xtrata.xyz/music/release", KI = "Release music on Xtrata Music; no spending permission", VI = (e) => ({
  domain: Sr({ name: St(rb), version: St("1"), "chain-id": En(1) }),
  message: Sr({ purpose: St(KI), artist: St(e.artist), release: St(e.hash), issued: En(e.issued) })
}), XI = "Set the price of my release on Xtrata Music; no spending permission", YI = 100000n, qI = 1000000000n, WI = (e) => e === 0n || e >= YI && e <= qI, ZI = (e) => ({
  domain: Sr({ name: St(rb), version: St("1"), "chain-id": En(1) }),
  message: Sr({ purpose: St(XI), artist: St(e.artist), release: St(e.release), price: En(BigInt(e.price)), issued: En(e.issued) })
}), co = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, JI = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, we = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, cn = (e, t, n = "") => {
  const r = we("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, mc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), gg = (e) => {
  const t = mr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function bc(e, t, n = "", r = "") {
  const s = we("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), i = e || n;
  if (i) {
    const o = document.createElement("img");
    o.src = i, o.alt = "", o.decoding = "async", s.append(o);
  }
  return e || s.append(we("span", t)), s;
}
const Tu = (e) => !!e && Od(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function QI(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, s = "", i = "";
  const o = (() => {
    try {
      const R = new URLSearchParams(location.search).get("release");
      return Od(R) ? R : null;
    } catch {
      return null;
    }
  })();
  let c = o ? { id: o } : null;
  const l = (R) => "xtrata.radio.releases.shelf.v1:" + R;
  let d = null, p = !1, u = -1 / 0;
  const w = (R, P, re) => {
    const J = Array.isArray(P) ? P.filter(Tu).map((se) => ({ ...se, hidden: !!se.hidden })) : [];
    d = { for: R, albums: J, fresh: re }, re && e.store.set(l(R), JSON.stringify(J));
  }, y = (R) => {
    try {
      w(R, JSON.parse(e.store.get(l(R)) || "[]"), !1);
    } catch {
      w(R, [], !1);
    }
  }, S = () => {
    const R = e.player().address;
    return R && (d == null ? void 0 : d.for) === R ? d.albums : [];
  };
  async function v(R, P = "") {
    const re = e.player();
    if (!re.address || !re.unlocked)
      return i = "Unlock your player first.", e.changed(), !1;
    if (p) return !1;
    p = !0, i = "", e.changed();
    try {
      const J = await e.signShelf(R, P), se = await e.json("/radio/release/shelf", mc(J));
      return w(re.address, se == null ? void 0 : se.albums, !0), U(se == null ? void 0 : se.pay) ? E(re.address, se.pay) : R === "add" && E(re.address, null, P), !0;
    } catch (J) {
      return R !== "list" && (i = J.message || "That did not work. Try again."), !1;
    } finally {
      p = !1, e.changed();
    }
  }
  const T = (R) => "xtrata.radio.releases.orders.v1:" + R, U = (R) => !!R && /^[0-9a-f]{16}$/.test(R.order) && Od(R.release) && typeof R.to == "string" && /^\d{1,12}$/.test(R.amount) && typeof R.memo == "string", H = (R) => {
    if (!R) return {};
    try {
      const P = JSON.parse(e.store.get(T(R)) || "{}");
      return P && typeof P == "object" ? Object.fromEntries(Object.entries(P).filter(([, re]) => U(re))) : {};
    } catch {
      return {};
    }
  };
  function E(R, P, re = (P == null ? void 0 : P.release) ?? "") {
    var se;
    const J = H(R);
    P ? J[P.release] = { ...((se = J[P.release]) == null ? void 0 : se.order) === P.order ? J[P.release] : {}, ...P } : delete J[re], e.store.set(T(R), Object.keys(J).length ? JSON.stringify(J) : null);
  }
  const B = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Map();
  async function Z(R, P, re = !1) {
    var J;
    if (!B.has(P.order)) {
      B.add(P.order), _.set(P.order, e.now()), re && (i = "", e.changed());
      try {
        const se = await e.json("/radio/release/paid", mc({ order: P.order, ...P.txid ? { txid: P.txid } : {} }));
        (se == null ? void 0 : se.status) === "paid" ? (E(R, null, P.release), ((J = c == null ? void 0 : c.view) == null ? void 0 : J.id) === P.release && (c.view = { ...c.view, added: c.view.added + 1 }), i = "", B.delete(P.order), (d == null ? void 0 : d.for) === R && (d.fresh = !1), e.player().unlocked && await v("list")) : (U(se) && E(R, { ...P, ...se }), re && (se == null ? void 0 : se.status) === "pending" && (i = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (se) {
        /did not go through|does not pay this order/.test(se.message || "") && E(R, { ...P, txid: void 0, status: "pending" }), (re || P.txid) && (i = se.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        B.delete(P.order), e.changed();
      }
    }
  }
  async function de(R, P, re) {
    if (!s) {
      s = "Approve the payment in your wallet…", i = "", e.changed();
      try {
        const J = await e.pay(R, re.to, BigInt(re.amount), re.memo), se = { ...re, txid: J || void 0, status: "confirming" };
        E(P, se), s = "", Z(P, se);
      } catch (J) {
        i = /cancel/i.test(J.message || "") ? "Payment cancelled. Nothing was sent." : J.message || "Not paid. Nothing was sent.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  async function Q(R) {
    const P = e.player();
    if (!await v("add", R.id) || !P.address) return;
    const re = H(P.address)[R.id], J = e.main();
    re && J && await de(J, P.address, re);
  }
  function Y() {
    if (r || (r = !0, e.json("/radio/release/config").then((P) => {
      t = (P == null ? void 0 : P.enabled) === !0, n = { copies: t && (P == null ? void 0 : P.copies) === !0, sales: t && (P == null ? void 0 : P.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (c && !c.view && !c.error) {
      const P = c;
      P.error = "", e.json("/radio/release/view?id=" + P.id).then(
        (re) => {
          Tu(re) ? (P.view = re, delete P.error) : P.error = "This release could not be read.";
        },
        (re) => {
          P.error = re.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const R = e.player();
    if (R.address) {
      (d == null ? void 0 : d.for) !== R.address && y(R.address), R.unlocked && !(d != null && d.fresh) && !p && e.now() - u > 6e4 && (u = e.now(), v("list"));
      for (const P of Object.values(H(R.address)))
        if ((P.txid || P.status === "confirming") && !B.has(P.order) && e.now() - (_.get(P.order) ?? -1 / 0) > 2e4) {
          const re = R.address;
          Z(re, P).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const b = () => t ? S().filter((R) => !R.hidden) : [];
  function I(R, P) {
    const re = we("ol", "", "ppp-rel-songs");
    return R.forEach((J, se) => {
      const Ze = we("li");
      Ze.append(bc(e.art.song(J.id, !0) || "", String(se + 1), P), we("span", J.title)), re.append(Ze);
    }), re;
  }
  function N() {
    if (!t || !c || c.dismissed) return [];
    if (!c.view) return c.error ? [we("p", `♫ ${c.error}`, "ppp-warn")] : [we("p", "♫ Opening this release…", "ppp-mute")];
    const R = c.view, P = we("div", "", "ppp-release-in"), re = we("p", "", "ppp-release-in__h"), J = BigInt(/^\d{1,12}$/.test(R.price ?? "") ? R.price : "0");
    re.append(we("b", R.title), we("span", `${R.subtitle || e.who(R.artist)} · ${gg(R)}${J > 0n ? ` · ${co(J)} STX` : ""}`));
    const se = mr(R), Ze = e.art.cover(R.cover) || (R.cover ? "" : se[0] && e.art.song(se[0].id, !0) || ""), xe = we("div", "", "ppp-rel-top");
    xe.append(bc(Ze, "💿", "", "is-cover"), re), P.append(xe, I(se.map((oe) => ({ id: oe.id, title: oe.title || `#${oe.id}` })), e.art.cover(R.cover))), P.append(we("p", `Released by ${e.who(R.artist)}. ${R.added === 1 ? "1 player has" : `${R.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const Ne = e.player(), nt = S().find((oe) => oe.id === R.id), Be = we("div", "", "ppp-award__row");
    if (nt)
      P.append(we("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), Be.append(cn("Play it", () => e.open(R), "primary"));
    else if (!Ne.address) P.append(we("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!Ne.unlocked) P.append(we("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (J > 0n) {
      const oe = H(Ne.address)[R.id], Fe = e.main(), Qe = `${co((oe == null ? void 0 : oe.amount) ?? J)} STX`;
      if (oe != null && oe.txid || (oe == null ? void 0 : oe.status) === "confirming") {
        P.append(we("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Ve = cn("Check now", () => void Z(Ne.address, oe, !0));
        Ve.disabled = B.has(oe.order), Be.append(Ve);
      } else if (P.append(we("p", `This album costs ${Qe}. You pay ${e.who(R.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !oe) P.append(we("p", "Buying is paused right now.", "ppp-warn"));
      else if (oe) {
        if (Fe) {
          const Vt = cn(`Pay ${Qe} from my wallet`, () => void de(Fe, Ne.address, oe), "primary");
          Vt.disabled = !!s, Be.append(Vt);
        } else P.append(we("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const Ve = we("div", "", "ppp-rel-pay"), Yt = (Vt, gt, Mn) => {
          const yn = we("p");
          return yn.append(we("span", Vt), we("code", gt), rr(`order-${Mn}:${oe.order}`, "Copy", () => gt, "tiny", e.changed)), yn;
        };
        Ve.append(Yt("Send", co(oe.amount) + " STX", "amount"), Yt("To", oe.to, "to"), Yt("Memo", oe.memo, "memo")), P.append(Ve, we("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const Kt = cn("I have paid: check", () => void Z(Ne.address, oe, !0));
        Kt.disabled = B.has(oe.order), Be.append(Kt);
      } else {
        const Ve = cn(`Buy · ${Qe}`, () => void Q(R), "primary");
        Ve.disabled = p || !!s, Be.append(Ve);
      }
    } else {
      P.append(we("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const oe = cn("Add to my player", () => {
        v("add", R.id).then((Fe) => {
          Fe && (c != null && c.view) && (c.view = { ...c.view, added: c.view.added + 1 });
        });
      }, "primary");
      oe.disabled = p, Be.append(oe);
    }
    return Be.append(cn("Not now", () => {
      c && (c.dismissed = !0), e.changed();
    }, "quiet")), P.append(Be), s && P.append(we("p", s, "ppp-cyan")), i && P.append(we("p", i, "ppp-warn")), [P];
  }
  let M = !1;
  function q() {
    const R = t ? S() : [];
    if (!R.length) return null;
    const P = we("details", "", "ppp-release-manage");
    P.open = M, P.ontoggle = () => {
      M = P.open;
    };
    const re = R.filter((se) => se.hidden).length;
    P.append(we("summary", `Albums I added (${R.length}${re ? `, ${re} hidden` : ""})`));
    const J = e.player().unlocked;
    J || P.append(we("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const se of R) {
      const Ze = we("div", "", "ppp-release-row" + (se.hidden ? " is-hidden" : "")), xe = we("span", "", "ppp-release-row__t");
      xe.append(we("b", se.title), we("span", `${se.subtitle || e.who(se.artist)}${se.hidden ? " · hidden" : ""}`));
      const Ne = cn(se.hidden ? "Show" : "Hide", () => void v(se.hidden ? "show" : "hide", se.id), "tiny"), nt = cn("Remove", () => void v("remove", se.id), "tiny");
      Ne.disabled = nt.disabled = !J || p, Ze.append(xe, Ne, nt), P.append(Ze);
    }
    return P.append(we("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), i && !c && P.append(we("p", i, "ppp-warn")), P;
  }
  let D = null, ae = [], ie = null;
  const Ue = we("input");
  Ue.maxLength = 60, Ue.placeholder = "Title of the single, EP or album", Ue.setAttribute("aria-label", "Release title");
  const L = we("input");
  L.maxLength = 80, L.placeholder = "Artist name shown under the title", L.setAttribute("aria-label", "Artist name");
  const O = we("input");
  O.inputMode = "numeric", O.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", O.setAttribute("aria-label", "Cover inscription number");
  const le = we("input");
  le.inputMode = "decimal", le.placeholder = "Price in STX, e.g. 2 (0 makes it free)", le.setAttribute("aria-label", "Price in STX");
  let me = null;
  const Ce = (R, P, re = "") => {
    me = (me == null ? void 0 : me.id) === R && me.what === P ? null : { id: R, what: P }, (me == null ? void 0 : me.what) === "price" && (le.value = re), i = "", e.changed();
  };
  async function Te(R, P) {
    if (s) return;
    const re = JI(le.value);
    if (re === null || !WI(re)) {
      i = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", i = "", e.changed();
    try {
      const J = { artist: R, release: P.id, price: re.toString(), issued: e.now() }, se = await e.sign(R, ZI(J));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", mc({ request: J, signature: se })), i = re > 0n ? `Price set ✓ “${P.title}” now costs ${co(re)} STX, paid straight to this wallet.` : `“${P.title}” is free again ✓`, me = null, $e(R, !0);
    } catch (J) {
      i = J.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const _t = (R) => `${location.origin}${location.pathname}?release=${R}`;
  function Me(R) {
    D = { for: R, loading: !0 }, ae = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(R)).then(
      (P) => {
        const re = Array.isArray(P == null ? void 0 : P.songs) ? P.songs.filter((J) => Number.isSafeInteger(J == null ? void 0 : J.id) && typeof J.title == "string") : null;
        D = re ? { for: R, songs: re, more: !!P.more } : { for: R, error: "Your songs could not be read right now." };
      },
      (P) => {
        D = { for: R, error: P.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function $e(R, P = !1) {
    !P && (ie == null ? void 0 : ie.for) === R && e.now() - ie.at < 6e4 || (ie = { for: R, list: (ie == null ? void 0 : ie.for) === R ? ie.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(R)).then((re) => {
      Array.isArray(re == null ? void 0 : re.releases) && (ie = { for: R, list: re.releases.filter(Tu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function ke(R) {
    if (!s) {
      s = "Checking your release…", i = "", e.changed();
      try {
        const P = O.value.trim().replace(/^#/, ""), re = eb({ title: Ue.value.trim(), subtitle: L.value.trim(), tracks: [...ae], cover: P ? Number(P) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const J = { artist: R, hash: tb(re), issued: e.now() }, se = await e.sign(R, VI(J));
        s = "Releasing…", e.changed();
        const Ze = await e.json("/radio/release/create", mc({ definition: re, request: J, signature: se }));
        i = `${Ze.existing ? "Already released" : "Released"} ✓ “${Ze.title}”. Its link is below.`, ae = [], Ue.value = "", O.value = "", e.audition.stop(), $e(R, !0);
      } catch (P) {
        i = P.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const Jt = () => {
    queueMicrotask(() => e.audition.stop());
  }, Qt = /* @__PURE__ */ new Set();
  function Je(R) {
    const P = ae.map((Ve) => R.find((Yt) => Yt.id === Ve)).filter((Ve) => !!Ve), re = O.value.trim().replace(/^#/, ""), J = /^\d{1,9}$/.test(re) ? Number(re) : null, se = e.art.cover(J), Ze = P[0] ? e.art.song(P[0].id, !0) : null, xe = we("div", "", "ppp-release-preview");
    xe.append(we("p", "How it will look", "ppp-featured__h"));
    const Ne = we("p", "", "ppp-release-in__h"), nt = we("b", Ue.value.trim() || "Untitled"), Be = we("span", `${L.value.trim() || e.who(e.main())} · ${P.length} ${P.length === 1 ? "song" : "songs"}`);
    Ne.append(nt, Be);
    const oe = we("div", "", "ppp-rel-top");
    oe.append(bc(J ? se : Ze || "", "💿", "", "is-cover"), Ne), xe.append(oe, I(P.map((Ve) => ({ id: Ve.id, title: Ve.title })), se));
    const Fe = P.filter((Ve) => e.art.song(Ve.id, !0) === null).length, Qe = [];
    J && !se && Qe.push(`Looking for an image in #${J}… If none appears, that inscription is not a picture.`), Fe && Qe.push(`Finding artwork for ${Fe} ${Fe === 1 ? "song" : "songs"}…`), !Fe && P.some((Ve) => e.art.song(Ve.id, !1) === "") && Qe.push(`A numbered square is a song with no artwork of its own${se ? ": it shows the cover, dimmed" : ""}.`);
    for (const Ve of Qe) xe.append(we("p", Ve, "ppp-mute"));
    return Ue.oninput = () => {
      nt.textContent = Ue.value.trim() || "Untitled";
    }, L.oninput = () => {
      Be.textContent = `${L.value.trim() || e.who(e.main())} · ${P.length} ${P.length === 1 ? "song" : "songs"}`;
    }, O.onchange = () => e.changed(), xe;
  }
  function $t() {
    var re;
    const R = e.main();
    if (!t || !R)
      return D && (D = null, ae = [], Jt()), null;
    const P = [we("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (D && D.for !== R && (D = null, ae = [], Qt.clear(), Jt()), !D) P.push(cn("Show the songs in my wallet", () => Me(R), "primary"));
    else if (D.loading) P.push(we("p", "Reading your wallet…", "ppp-cyan"));
    else if (D.error) P.push(we("p", D.error, "ppp-warn"), cn("Try again", () => Me(R)));
    else if (!D.songs.length) P.push(we("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      P.push(we("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const J = we("div", "", "ppp-release-songs");
      for (const xe of D.songs) {
        const Ne = ae.indexOf(xe.id), nt = we("div", "", "ppp-release-song" + (Ne >= 0 ? " is-on" : "")), Be = e.audition.state(xe.id);
        Be !== "idle" && Qt.add(xe.id);
        const oe = cn(Be === "playing" ? "❚❚" : Be === "loading" ? "…" : "▶", () => e.audition.toggle(xe.id), "ppp-release-hear" + (Be === "playing" ? " is-on" : ""));
        oe.setAttribute("aria-label", Be === "playing" ? `Stop ${xe.title}` : `Listen to ${xe.title}`), oe.title = Be === "error" ? "This song could not be played just now" : Be === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const Fe = e.art.song(xe.id, Ne >= 0 || Qt.has(xe.id)), Qe = cn("", () => {
          ae = Ne >= 0 ? ae.filter((Ve) => Ve !== xe.id) : [...ae, xe.id], e.changed();
        }, "ppp-release-pick");
        Qe.setAttribute("aria-pressed", String(Ne >= 0)), Qe.append(we("i", Ne >= 0 ? String(Ne + 1) : "+"), we("b", xe.title), we("span", Be === "error" ? "could not play" : `${xe.artist ? xe.artist + " · " : ""}#${xe.id}`, Be === "error" ? "ppp-warn" : "")), nt.append(oe, bc(Fe || "", Fe === "" ? "♪" : "", ""), Qe), J.append(nt);
      }
      P.push(J), D.more && P.push(we("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !L.value && ae.length && (L.value = ((re = D.songs.find((xe) => xe.id === ae[0])) == null ? void 0 : re.artist) || "");
      const se = ae.length === 0 ? "release" : ae.length === 1 ? "single" : ae.length <= 6 ? "EP" : "album", Ze = cn(ae.length ? `Sign and release this ${se} · ${ae.length} ${ae.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void ke(R), "primary");
      Ze.disabled = !ae.length || !!s, P.push(Ue, L, O), ae.length && P.push(Je(D.songs)), P.push(Ze);
    }
    if (s && P.push(we("p", s, "ppp-cyan")), i && !c && P.push(we("p", i, /✓/.test(i) ? "ppp-ok" : "ppp-warn")), $e(R), (ie == null ? void 0 : ie.for) === R && ie.list.length) {
      P.push(we("p", "Your releases", "ppp-featured__h"));
      for (const J of ie.list) {
        const se = we("div", "", "ppp-release-row"), Ze = we("span", "", "ppp-release-row__t"), xe = BigInt(/^\d{1,12}$/.test(J.price ?? "") ? J.price : "0"), Ne = xe > 0n ? ` · ${co(xe)} STX · ${(J.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (Ze.append(we("b", J.title), we("span", `${gg(J)} · added by ${J.added.toLocaleString()} ${J.added === 1 ? "player" : "players"}${Ne}`)), se.append(Ze, rr("release-link:" + J.id, "Copy link", () => _t(J.id), "tiny", e.changed)), n.sales) {
          const Be = cn("Price", () => Ce(J.id, "price", xe > 0n ? co(xe) : ""), "tiny");
          Be.setAttribute("aria-expanded", String((me == null ? void 0 : me.id) === J.id && me.what === "price")), se.append(Be);
        }
        if (n.copies && e.copies) {
          const Be = cn("Send copies", () => Ce(J.id, "copies"), "tiny");
          Be.setAttribute("aria-expanded", String((me == null ? void 0 : me.id) === J.id && me.what === "copies")), se.append(Be);
        }
        if (P.push(se), (me == null ? void 0 : me.id) !== J.id) continue;
        const nt = we("div", "", "ppp-release-way");
        if (me.what === "price" && n.sales) {
          const Be = cn("Sign this price", () => void Te(R, J), "primary");
          Be.disabled = !!s, nt.append(
            we("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            le,
            Be
          );
        } else me.what === "copies" && n.copies && e.copies && nt.append(...e.copies(R, { id: J.id, title: J.title }));
        nt.childNodes.length && P.push(nt);
      }
    }
    return P;
  }
  return { sync: Y, albums: b, banner: N, manage: q, fold: $t, wantsArt: () => t === !0 && (!!(c != null && c.view) && !c.dismissed || !!(D != null && D.songs) && !!e.main()), enabled: () => t === !0 };
}
const eL = [
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
function tL(e) {
  for (const [t, n] of eL) if (n.test(e)) return t;
  return null;
}
const sb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), ib = (e) => /Android/.test(e);
function nL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : sb(t) ? "x-safari-" + n.href : ib(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const rL = (e) => sb(e) ? "Safari" : ib(e) ? "Chrome" : "your browser", lo = "Xtrata Music Wallet", sL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function yg(e, t = (n) => n) {
  var i, o, c;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((i = e.gate) == null ? void 0 : i.passkeyOnly) || e.linked || ((o = e.others) == null ? void 0 : o.length) ? [{ action: null, label: lo, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((l) => !!l))];
  for (const l of s) {
    const d = e.standIn === l && sL.has(e.step);
    r.push({
      action: "linked",
      main: l,
      label: `${lo} · ${t(l)}`,
      detail: d ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(l)}.`
    });
  }
  if ((c = e.gate) != null && c.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: lo, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: lo, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: lo, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: lo, detail: "Open on this device." });
    }
  return r;
}
const Bu = "xtrata.radio.novice", ob = "xtrata.radio.novice.previewed.v1", wg = 6 * 6e4;
function iL(e, t) {
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
const oL = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, mg = (e) => oL.test(e ?? ""), aL = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, cL = {
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
}, lL = (e, t) => cL[e] ?? t;
function uL(e, t) {
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
const dL = "Make your player once, with Face ID or your fingerprint, and the music starts.", fL = "Checking your player…", jd = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function ab(e) {
  try {
    const t = JSON.parse(e.get(ob) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function hL(e, t) {
  const n = ab(e).filter((r) => r !== t);
  n.push(t), e.set(ob, JSON.stringify(n.slice(-50)));
}
function Mu(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...jd(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : jd();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > wg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > wg ? { ...e, phase: "done" } : e;
  }
}
const xc = (e) => e.phase === "open" || e.phase === "playing";
function pL(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const gL = [100, 250, 500, 1e3], yL = (e, t = vr) => BigInt(e) * pn(t);
function wL(e, t = vr, n = 0n) {
  const r = Qr - e - n;
  return r > 0n ? Number(r / pn(t)) : 0;
}
function mL(e, t = vr, n = 0n) {
  const r = e === void 0 ? 0 : wL(e, t, n);
  return gL.map((s) => ({ plays: s, stx: yL(s, t), fits: e !== void 0 && s <= r }));
}
const bL = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, xL = (e) => bL[e.unit](e.amount), Bt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Nc = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function SL(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${Nc(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${Nc(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${Nc(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function vL(e) {
  let t = null, n = 0, r = "stx";
  const s = (o) => {
    var l;
    if (o.some((d) => d.plays === n && d.fits)) return;
    const c = o.filter((d) => d.fits);
    n = ((l = c.find((d) => {
      var p;
      return d.plays === ((p = o[1]) == null ? void 0 : p.plays);
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
    const c = mL(o.balance, o.fee, o.incoming);
    s(c);
    const l = pL(o.switches);
    (y = l.find((S) => S.id === r)) != null && y.on || (r = "stx");
    const d = [], p = Bt("h2", "ppp-connect__title", "Add plays");
    p.id = "ppp-restock-title", d.push(p), d.push(Bt("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${Nc(o.playsLeft, "play", "plays")} left.`));
    const u = SL(o.done);
    if (u && d.push(Bt("p", "ppp-restock__done", u)), o.arriving)
      d.push(Bt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      d.push(Bt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!c.some((S) => S.fits))
      d.push(Bt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const S = Bt("div", "ppp-restock__packs");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How many plays");
      for (const U of c) {
        const H = Bt("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        H.type = "button", H.disabled = !U.fits, H.setAttribute("aria-pressed", String(U.plays === n)), H.append(Bt("b", "", U.plays.toLocaleString()), Bt("span", "", "plays")), H.onclick = () => {
          n = U.plays, i();
        }, S.append(H);
      }
      d.push(S);
      const v = Bt("div", "ppp-restock__ways");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How to pay");
      for (const U of l) {
        const H = Bt("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        H.type = "button", H.disabled = !U.on, H.setAttribute("aria-pressed", String(U.id === r)), H.append(Bt("b", "", U.label), Bt("span", "", U.on ? U.blurb : "Soon")), H.onclick = () => {
          r = U.id, i();
        }, v.append(H);
      }
      d.push(v);
      const T = c.find((U) => U.plays === n);
      if (T && r === "stx") {
        const U = Bt("div", "ppp-restock__pay"), H = xL({ unit: "microSTX", amount: T.stx }), E = Bt("p", "ppp-restock__amount");
        E.append("Send ", Bt("b", "", H), " to your player:"), U.append(E, Bt("p", "ppp-addr-full ppp-restock__addr", o.address));
        const B = Bt("div", "ppp-restock__row");
        B.append(e.copyButton("restock-address", "Copy address", () => o.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => hr(T.stx), "")), U.append(B), U.append(Bt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${o.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), d.push(U);
      }
    }
    d.push(Bt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = Bt("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), d.push(w), t.replaceChildren(...d);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Bt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
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
const ts = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), AL = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function EL(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const i = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(i) || i < 0 || n.has(i)) continue;
    n.add(i);
    const o = t(i, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: i, title: AL(o.title) ? `#${i}` : o.title.trim(), artist: (o.artist || "").trim() });
  }
  return r.sort((s, i) => s.id - i.id);
}
function kL(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = ts(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function $L(e, t, n = "", r = 60) {
  const s = ts(t).split(/\s+/).filter(Boolean), i = ts(n);
  if (!s.length && !i) return { songs: [], total: 0 };
  const o = [];
  for (const c of e) {
    const l = ts(c.artist), d = ts(c.title), p = String(c.id);
    if (i && l !== i) continue;
    let u = 0, w = !0;
    for (const y of s) {
      const S = y.replace(/^#/, "");
      if (d.includes(y)) u += d.startsWith(y) ? 0 : 1;
      else if (/^\d+$/.test(S) && p === S) u += 0;
      else if (l.includes(y)) u += 2;
      else if (/^\d+$/.test(S) && p.startsWith(S)) u += 3;
      else {
        w = !1;
        break;
      }
    }
    w && o.push({ s: c, rank: u });
  }
  return o.sort((c, l) => c.rank - l.rank || c.s.id - l.s.id), { songs: o.slice(0, r).map((c) => c.s), total: o.length };
}
const er = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, bg = 12;
function IL(e, t) {
  let n = null, r = "idle", s = "", i = "", o = !1;
  const c = er("input", "find-q");
  c.type = "search", c.placeholder = "Search songs, artists or #", c.setAttribute("aria-label", "Search all music"), c.autocomplete = "off";
  const l = er("div", "hint"), d = er("div", "find-artists"), p = er("ol", "likesList find-list");
  l.setAttribute("role", "status");
  const u = er("div", "likesTools");
  u.append(c), e.replaceChildren(u, l, d, p), c.oninput = () => {
    s = c.value, y();
  };
  function w() {
    r === "loading" || r === "ready" || (r = "loading", y(), t.load().then((S) => {
      n = S, r = "ready", y();
    }, () => {
      r = "failed", y();
    }));
  }
  function y() {
    const S = t.locked();
    if (c.disabled = S, S) {
      l.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", d.replaceChildren(), p.replaceChildren();
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
      const B = er("button", "", "Try again");
      B.type = "button", B.onclick = () => {
        r = "idle", w();
      }, l.append(B), d.replaceChildren(), p.replaceChildren();
      return;
    }
    const v = kL(n), T = o ? v : v.slice(0, bg), U = (B, _, Z, de = "") => {
      const Q = er("button", "find-chip" + (_ ? " is-on" : ""), B);
      return Q.type = "button", Q.setAttribute("aria-pressed", String(_)), de && (Q.title = de), Q.onclick = Z, Q;
    };
    d.replaceChildren(
      ...T.map((B) => U(`${B.name} · ${B.songs}`, ts(B.name) === ts(i), () => {
        i = ts(B.name) === ts(i) ? "" : B.name, y();
      }, `Show ${B.name}’s ${B.songs === 1 ? "song" : `${B.songs} songs`}`)),
      ...v.length > bg ? [U(o ? "Fewer artists" : `All ${v.length} artists`, !1, () => {
        o = !o, y();
      })] : []
    );
    const H = $L(n, s, i), E = t.current();
    p.replaceChildren(...H.songs.map((B) => {
      var de, Q;
      const _ = er("li", "lrow" + (B.id === E ? " now" : "")), Z = er("button", "lt", B.title);
      if (Z.type = "button", Z.title = `Play “${B.title}”${B.artist ? ` by ${B.artist}` : ""}`, Z.onclick = () => t.play(B.id), (de = t.explicit) != null && de.call(t, B.id)) {
        const Y = er("span", "exp", "E");
        Y.title = "Explicit lyrics: only plays when you choose it", Z.append(" ", Y);
      }
      if ((Q = t.liked) != null && Q.call(t, B.id)) {
        const Y = er("span", "find-liked", "♥");
        Y.title = "You like this song", Y.setAttribute("role", "img"), Y.setAttribute("aria-label", "Liked"), _.append(Z, Y);
      } else _.append(Z);
      return _.append(er("span", "find-by", `${B.artist ? B.artist + " · " : ""}#${B.id}`)), _;
    })), l.textContent = !s.trim() && !i ? `${n.length.toLocaleString()} songs by ${v.length.toLocaleString()} artists. Search, or pick an artist.` : H.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : H.total > H.songs.length ? `Showing ${H.songs.length} of ${H.total.toLocaleString()}. Type more to narrow it down.` : `${H.total} ${H.total === 1 ? "song" : "songs"}${i ? ` by ${i}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
const ha = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Sc = (e) => typeof e == "string" && ha.some((t) => t.id === e), vc = (e) => ha.find((t) => t.id === e), LL = (e) => ha.find((t) => e >= t.min) ?? ha[ha.length - 1];
function CL(e, t = vr) {
  return LL(e <= Rt ? 0 : Number((e - Rt) / pn(t)));
}
const xg = (e, t, n) => nf(of(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), Sg = document.getElementById("ppp");
Sg && TL(Sg);
function TL(e) {
  var x;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Pb(), s = (a) => e.querySelector(a), i = s(".ppp-frame");
  let o = null;
  const c = async (a, h) => {
    const g = await fetch(a, { cache: "no-store", ...h, signal: AbortSignal.timeout(15e3) }), f = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${g.status}).`);
    return f;
  }, l = d5({
    now: Date.now,
    main: () => {
      const a = r.load();
      return a.isConnected && a.network === "mainnet" ? a.address : void 0;
    },
    config: (a) => c("/radio/listening-wallet/config?main=" + encodeURIComponent(a || "")),
    links: async (a) => (await c("/radio/listening-wallet/link?main=" + encodeURIComponent(a))).links ?? [],
    mainOf: async (a) => {
      var g;
      const h = (await c("/radio/listening-wallet/link?listening=" + encodeURIComponent(a))).links;
      return ((g = h == null ? void 0 : h.find((f) => f.listening === a)) == null ? void 0 : g.main) ?? null;
    },
    saveLink: async (a) => {
      await c("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(a) });
    },
    bridge: async (a) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${a}; publickey-credentials-create ${a}`), o.referrerPolicy = "no-referrer";
      const h = new Promise((z, G) => {
        o.addEventListener("load", () => z(), { once: !0 }), setTimeout(() => G(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = a + "/", i.replaceChildren(o), await h;
      const g = new $b({ walletOrigin: a, frame: o, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), A = (z, G) => f.has(z) ? g.request(z, G) : Promise.race([
        g.request(z, G),
        new Promise((K, ce) => setTimeout(() => ce(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await A("listening.status"), { request: A };
    },
    chain: {
      verify: G6,
      balance: V6,
      account: K6,
      owner: X6,
      broadcast: Y6,
      transaction: q6,
      confirmedNonce: async (a) => {
        const h = await Vs(`/v2/accounts/${a}?proof=0`);
        if (!Number.isSafeInteger(h == null ? void 0 : h.nonce) || h.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(h.nonce);
      }
    },
    signWithMain: (a, h) => bu({ ...h, network: "mainnet", stxAddress: a }),
    deposit: (a, h, g) => new Promise((f, A) => H0({
      recipient: h,
      amount: g.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: a,
      network: new Nu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (z) => f(z.txId || ""),
      onCancel: () => A(new Error("Deposit cancelled. Nothing was sent.")),
      onError: A
    })),
    validate: W6,
    tabLock: (a) => new Promise((h) => {
      const g = navigator.locks;
      if (!(g != null && g.request)) {
        h(!0);
        return;
      }
      g.request("xtrata-ppp:" + a, { ifAvailable: !0 }, async (f) => {
        h(!!f), f && await new Promise(() => {
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
      set: (a, h) => {
        try {
          localStorage.setItem(a, h);
        } catch {
        }
      }
    },
    changed: () => it(l.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (a) => {
      var h, g;
      return u.funder(a, () => n5(a, Vs), !!((g = (h = l.snapshot().gate) == null ? void 0 : h.gifts) != null && g.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (a) => {
      const h = await c("/radio/gift/for?wallet=" + encodeURIComponent(a)), g = h == null ? void 0 : h.gift;
      if (!g) return null;
      if (typeof g.returnTo != "string" || typeof g.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: g.returnTo, from: typeof g.from == "string" ? g.from : null, source: String(g.source ?? ""), amount: String(g.amount ?? "0"), treasury: g.treasury, state: g.state === "sending" ? "sending" : "arrived", player: g.player ?? null };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (a) => {
      const h = await c("/radio/awards/status?address=" + encodeURIComponent(a));
      if (typeof (h == null ? void 0 : h.state) != "string") throw new Error("Unreadable award status.");
      return h;
    },
    awardName: async (a) => {
      const h = await c("/radio/awards/name?address=" + encodeURIComponent(a));
      if ((h == null ? void 0 : h.name) !== null && typeof (h == null ? void 0 : h.name) != "string") throw new Error("Unreadable name.");
      return h.name;
    },
    awardNote: async (a, h) => {
      const g = await c("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: a, name: h }) });
      if (typeof (g == null ? void 0 : g.record) != "string" || typeof (g == null ? void 0 : g.signature) != "string" || !Number.isSafeInteger(g == null ? void 0 : g.cls) || !Number.isSafeInteger(g == null ? void 0 : g.number) || !Number.isSafeInteger(g == null ? void 0 : g.plays)) throw new Error("Unreadable award note.");
      return { cls: g.cls, number: g.number, plays: g.plays, record: g.record, signature: g.signature, name: typeof g.name == "string" ? g.name : null };
    },
    history: (a, h) => i5(a, (g) => Vs(g), h),
    likesChanged: () => {
      var a, h;
      (h = (a = window.XtrataRadio) == null ? void 0 : a.refreshLikes) == null || h.call(a);
    },
    likeState: async (a, h) => {
      const g = await c("/radio/chain-likes?" + new URLSearchParams({ wallet: a, ids: String(h) })), f = Array.isArray(g == null ? void 0 : g.rows) ? g.rows.find((A) => (A == null ? void 0 : A.id) === h) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((A) => typeof A == "string") : f.liked ? [a] : [] };
    },
    likeSent: (a, h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: a, liked: h } })),
    nameOf: (a) => st(a) ?? void 0,
    likeConfirmed: (a, h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: a, liked: h } })),
    likeFailed: (a) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: a } }))
  }), d = (a, h, g, f, A, z) => new Promise((G, K) => H0({
    recipient: f,
    amount: A.toString(),
    memo: z,
    stxAddress: g,
    network: new Nu(),
    appDetails: { name: a, icon: "/favicon.svg" },
    onFinish: (ce) => G(ce.txId || ""),
    onCancel: () => K(new Error(h)),
    onError: K
  })), p = (a) => u.incomingStarter() && a.canAnother && a.hadGift === !1 && !a.main && a.listening && !a.createdHere && !a.brandNew && ["locked", "ready", "fund", "over", "link"].includes(a.step) && !a.busy ? () => void l.create({ quick: !0, another: !0 }) : null, u = uI({
    json: c,
    main: () => {
      const a = r.load();
      return a.isConnected && a.network === "mainnet" ? a.address : void 0;
    },
    pay: (a, h, g, f) => d("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", a, h, g, f),
    sign: (a, h) => bu({ ...h, network: "mainnet", stxAddress: a }),
    giftSent: (a, h) => l.giftSent(a, h),
    claiming: (a) => l.giftClaiming(a),
    claimNew: (a) => p(a),
    album: { bind: (a) => l.bindAlbum(a), arrived: async (a, h, g, f) => {
      w.invalidate(), await l.albumArriving(a, h, g, f);
    } },
    who: (a) => He(a),
    changed: () => it(l.snapshot()),
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, h) => {
        try {
          h === null ? localStorage.removeItem(a) : localStorage.setItem(a, h);
        } catch {
        }
      }
    },
    now: Date.now
  }), w = xI({
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
      set: (a, h) => {
        try {
          h === null ? localStorage.removeItem(a) : localStorage.setItem(a, h);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => it(l.snapshot())
  }), y = {
    get: (a) => {
      try {
        return localStorage.getItem(a);
      } catch {
        return null;
      }
    },
    set: (a, h) => {
      try {
        h === null ? localStorage.removeItem(a) : localStorage.setItem(a, h);
      } catch {
      }
    }
  }, S = iL(location.search, y);
  S.on && (document.documentElement.dataset.novice = S.preview ? "preview" : "1");
  const v = (a) => S.on && a.solo, T = S.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), U = T ? document.getElementById("album") : null, H = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (a) => void l.topUpAlbum(a),
    openPlayer: () => void l.openAlbum(0)
  }, E = U ? hg(U, H) : null, B = QI({
    json: c,
    main: () => {
      const a = r.load();
      return a.isConnected && a.network === "mainnet" ? a.address : void 0;
    },
    sign: (a, h) => bu({ ...h, network: "mainnet", stxAddress: a }),
    signShelf: (a, h) => l.signShelf(a, h),
    pay: (a, h, g, f) => d("Xtrata Music · album", "Payment cancelled. Nothing was sent.", a, h, g, f),
    copies: (a, h) => {
      var g;
      return u.copies(a, h, ((g = l.snapshot().gate) == null ? void 0 : g.radioUrl) ?? null);
    },
    player: () => {
      const a = l.snapshot(), h = a.slot === 0 ? a.listening : a.root;
      return { address: h, unlocked: !!h && ["ready", "fund", "over", "link"].includes(a.step) };
    },
    open: (a) => Be(a, !0),
    who: (a) => He(a),
    art: { song: (a, h) => h && sh(String(a)) || ug(String(a)), cover: (a) => Mc(a) },
    audition: DI({
      changed: () => it(l.snapshot()),
      quiet: () => {
        var h;
        const a = window.XtrataRadio;
        try {
          (h = a == null ? void 0 : a.getState) != null && h.call(a).playing && a.playPause();
        } catch {
        }
      }
    }),
    changed: () => it(l.snapshot()),
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, h) => {
        try {
          h === null ? localStorage.removeItem(a) : localStorage.setItem(a, h);
        } catch {
        }
      }
    },
    now: () => Date.now()
  }), _ = () => {
    const a = new Set(J.map((h) => h.id));
    return [...J, ...B.albums().filter((h) => !a.has(h.id))];
  }, Z = U ? GI(U) : null, de = "xtrata.radio.award.later.v1";
  let Q = "ready", Y = !1, b = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(de) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), I = !1;
  const N = "xtrata.radio.tier.v1";
  let M = (() => {
    const a = y.get(N);
    return Sc(a) ? vc(a) : null;
  })();
  const q = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function D(a) {
    var A;
    if (a.listening && a.slot === 0 && ["fund", "ready", "over"].includes(a.step) && !(a.gift && a.gift.drop === void 0)) {
      let z = null;
      try {
        z = a.gift && !a.gift.player && a.gift.drop === "players" ? CL(BigInt(a.gift.amount)) : null;
      } catch {
        z = null;
      }
      ((A = a.award) == null ? void 0 : A.state) === "claimed" && a.award.holds === !1 && (z = null), ((z == null ? void 0 : z.id) ?? null) !== ((M == null ? void 0 : M.id) ?? null) && (M = z, y.set(N, z ? z.id : null));
    }
    const h = document.documentElement;
    M ? h.dataset.tier = M.id : delete h.dataset.tier;
    const g = document.querySelector("#ppp .ppp-head h3");
    if (!g) return;
    let f = g.querySelector(".ppp-tier");
    if (!M) {
      f == null || f.remove();
      return;
    }
    f || (f = k("span", "", "ppp-tier"), g.append(f)), f.dataset.tier = M.id, f.textContent = `${M.mark} ${M.name.toUpperCase()} PLAYER`, f.title = `A ${M.name} player from the Xtrata Music giveaway`;
  }
  const ae = S.on && U ? CI(U) : null, ie = Date.now();
  let Ue = !1, L = null, O = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const le = () => {
    O = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    it(l.snapshot());
  }, me = (a, h) => {
    var A;
    if (!ae || h || O) return null;
    if (!a.gate || a.step === "loading" || (Ue = !0), !Ue) return Date.now() - ie < 1e4 ? "checking" : null;
    if (!v(a)) return null;
    if (a.step === "intro" || a.step === "unsupported") return u.incomingStarter() ? "gift" : "new";
    if (a.step === "locked") return "back";
    const f = a.slot === 0 && !((A = a.gift) != null && A.player) && !a.entries.some((z) => z.kind === "play");
    return a.step === "fund" && f ? a.depositPending ? "arriving" : "empty" : a.step === "ready" && f && (L === "arriving" || L === "landed") ? "landed" : a.step === "loading" && L !== "checking" ? L : null;
  };
  let Ce = !1;
  function Te(a, h, g = [], f) {
    if (!ae) return;
    const A = f !== void 0 ? f : me(a, h);
    if (L = A, delete document.documentElement.dataset.noviceBoot, !A) {
      ae.render(null, h);
      return;
    }
    const z = [...g];
    A === "arriving" && a.arrival && z.push(ls(a.arrival)), a.step === "unsupported" ? z.push(k("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : a.error && z.push(k("p", a.error, "ppp-warn"));
    const G = A === "gift" ? u.incomingStarter() : null;
    G && !Ce && a.step === "intro" && !a.busy && !a.armed && !a.error && !yt && (Ce = !0, l.create({ quick: !0 })), ae.render({
      mode: A,
      status: z,
      asking: !!a.busy || a.armed,
      busy: !!a.busy,
      canStart: (a.step === "intro" || a.step === "locked") && !yt,
      plays: G ? G.plays : A === "landed" ? a.playsLeft : null,
      from: (G == null ? void 0 : G.from) ?? null,
      tier: M,
      mystery: q,
      albums: A === "landed" ? J.map((K) => ({ title: K.title, by: K.subtitle, cover: Mc(K.cover), run: () => {
        le(), Be(K, !0);
      } })) : [],
      claimNew: A === "back" ? p(a) : null,
      start: () => void l.create({ quick: !!u.incomingStarter() }),
      unlock: () => void l.unlock(),
      returning: () => void l.unlock(!0),
      restock: () => $e(),
      full: () => {
        var ve, Ae, Ee;
        const K = window.XtrataRadio, ce = A === "landed" && !((Ae = (ve = K == null ? void 0 : K.getState) == null ? void 0 : ve.call(K)) != null && Ae.playing);
        le(), ce && ((Ee = K == null ? void 0 : K.playPause) == null || Ee.call(K));
      }
    });
  }
  ae && setTimeout(() => {
    Ue || it(l.snapshot());
  }, 10100), th(() => {
    (ae != null && ae.showing() || document.documentElement.dataset.asking || B.wantsArt()) && it(l.snapshot());
  });
  const Me = vL({
    input: () => {
      var A, z, G, K;
      const a = l.snapshot();
      if (!["fund", "ready", "over"].includes(a.step)) return null;
      const h = a.slot === 0 ? { address: a.listening, balance: a.balance } : { address: a.root, balance: (A = a.likeFunds) == null ? void 0 : A.balance };
      if (!h.address) return null;
      const g = a.slot === 0 ? a.entries : [], f = g.filter((ce) => ce.kind === "play" && ce.status === "confirmed");
      return {
        playsLeft: h.balance === void 0 ? null : V(h.balance),
        balance: h.balance,
        incoming: 0n,
        fee: BigInt(((z = a.gate) == null ? void 0 : z.limits.playFee) ?? "300"),
        address: h.address,
        switches: ((G = a.gate) == null ? void 0 : G.restock) ?? {},
        backedUp: a.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((ce) => ce.recipient)).size, likes: g.filter((ce) => ce.kind === "like" && ce.status === "confirmed" && ce.liked).length } : null,
        arriving: a.slot === 0 ? a.depositPending : !!((K = a.likeFunds) != null && K.pending)
      };
    },
    copyButton: (a, h, g, f) => rr(a, h, g, f, () => {
      it(l.snapshot());
    })
  }), $e = () => {
    if (!l.snapshot().unproven) {
      Me.open();
      return;
    }
    l.prove().then((a) => {
      a && Me.open();
    });
  }, ke = document.getElementById("albumList"), Jt = ke ? hg(ke, H, { list: !0 }) : null, Qt = "xtrata.radio.album.last.v1", Je = () => {
    try {
      const a = JSON.parse(localStorage.getItem(Qt) || "null");
      return a && typeof a.root == "string" && Number.isSafeInteger(a.slot) && a.slot > 0 && a.player && Array.isArray(a.player.tracks) ? a : null;
    } catch {
      return null;
    }
  };
  let $t = "";
  const vt = (a) => {
    const h = JSON.stringify(a);
    if (h !== $t) {
      $t = h;
      try {
        localStorage.setItem(Qt, h);
      } catch {
      }
    }
  };
  let R = null;
  window.XtrataRadioLikeHandler = (a) => {
    var g;
    if (!a || !Number.isSafeInteger(a.song) || a.song < 0) return !1;
    (g = l.snapshot().likeFunds) != null && g.album && (yn = !0), zr();
    const h = Ws(a.song, { title: a.title, artist: a.artist });
    return l.heart({ song: a.song, title: h.title || void 0, artist: h.artist || void 0, likedBy: Array.isArray(a.likedBy) ? a.likedBy : void 0 });
  };
  let P;
  window.XtrataRadioListeningIdentity = () => {
    const a = l.snapshot();
    return a.solo && a.step !== "off" && a.step !== "elsewhere" ? a.listening : void 0;
  };
  const re = (a) => {
    var g, f;
    const h = window.XtrataRadioListeningIdentity();
    h !== P && (P = h, (f = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || f.call(g));
  };
  let J = [], se = 0, Ze = !1, xe = null;
  const Ne = (a) => {
    var h, g;
    Ze || !((g = (h = a.gate) == null ? void 0 : h.gifts) != null && g.enabled) || Date.now() - se < 6e4 || (se = Date.now(), c("/radio/gift/featured").then((f) => {
      J = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((A) => A && typeof A.id == "string" && typeof A.title == "string" && Array.isArray(A.tracks) && A.tracks.length > 0).slice(0, 6), Ze = !0, J.length && it(l.snapshot());
    }).catch(() => {
    }));
  }, nt = (a) => {
    var h;
    return xe && a.slot === 0 && !((h = a.gift) != null && h.player) && ["ready", "fund", "loading"].includes(a.step) ? xe : null;
  }, Be = (a, h = !1) => {
    var f, A;
    xe = a, it(l.snapshot());
    const g = a && h ? mr(a)[0] : null;
    g && ((A = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || A.call(f, g.id));
  };
  let oe = jd(), Fe = null;
  const Qe = (a) => {
    const h = S.preview && !yt && a.step === "intro" ? u.incomingAlbum() : null;
    return h ? (oe = Mu(oe, { kind: "offer", album: h.player.id, already: ab(y).includes(h.player.id) }), xc(oe) ? h.player : null) : (oe = Mu(oe, { kind: "withdraw" }), null);
  }, Ve = (a) => {
    const h = oe.phase;
    oe = Mu(oe, a), oe.phase !== h && (oe.album && (oe.phase === "playing" || oe.phase === "done") && hL(y, oe.album), it(l.snapshot()));
  };
  setInterval(() => {
    oe.phase === "playing" && Ve({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Yt = "", Kt, Vt = !1, gt = !1;
  const Mn = (a, h) => {
    var Ee, m, C, j, he, ut, Tt, Wt;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const f = h.depositPending && a.step === "fund" && ((Ee = a.giftStop) == null ? void 0 : Ee.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : a.giftStop, A = Fe, z = f ? v(a) ? lL(f.reason, f.text) : f.text : null, G = A ? null : z ?? (t && (!((m = a.gate) != null && m.here) || a.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    G && G !== Kt && (g.setGiftStop(G), Kt = G);
    const K = a.step === "off" || a.step === "elsewhere" ? null : ((C = a.gift) == null ? void 0 : C.player) ?? A ?? nt(a) ?? null, ce = K ? K.id + ":" + K.cover + ":" + K.tracks.map((Ut) => Ut.id).join(",") : "";
    ce !== Yt && (g.setGiftPlayer(K ? { id: K.id, title: K.title, subtitle: K.subtitle, tracks: mr(K).map((Ut) => Ut.id), hidden: ((j = aI(K)) == null ? void 0 : j.id) ?? null, cover: K.cover } : null), Yt = ce), G !== Kt && (g.setGiftStop(G), Kt = G);
    const ve = (f == null ? void 0 : f.reason) === "arriving";
    ve !== gt && ((he = g.setGiftWait) == null || he.call(g, ve), gt = ve);
    const Ae = !!K && (!!A || !!((ut = a.albumLock) != null && ut.locked));
    Ae !== Vt && ((Tt = g.setGiftLock) == null || Tt.call(g, Ae), Vt = Ae), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(a.step) && ((Wt = g.forgetWallets) == null || Wt.call(g));
  };
  let yn = !1;
  const Xn = /* @__PURE__ */ new Map(), Rr = (a) => {
    if (!(a.step === "fund" && !a.depositPending && !!a.gift && !!a.listening && a.balance === 0n && !a.entries.some((f) => f.kind === "play") && (a.brandNew || a.createdHere))) return null;
    let g = Xn.get(a.listening);
    return g === void 0 && (g = Date.now(), Xn.set(a.listening, g)), Date.now() - g < ol ? g : null;
  }, $ = (a) => a.step === "fund" && !a.depositPending && !!a.gift && a.balance === 0n && !a.entries.some((h) => h.kind === "play") && !!a.listening && Xn.has(a.listening), F = (a) => a ? a.slice(0, 6) + "…" + a.slice(-4) : "", V = (a) => {
    const h = l.snapshot().playCost || 350n;
    return a > Rt ? Number((a - Rt) / h) : 0;
  }, X = (a) => (Number(a) / 1e6).toFixed(a < 1000n ? 6 : 4), ee = (a) => {
    const h = Math.round((Date.now() - a) / 6e4);
    return h < 1 ? "now" : h < 60 ? `${h}m` : h < 1440 ? `${Math.round(h / 60)}h` : `${Math.round(h / 1440)}d`;
  }, fe = (a) => `https://explorer.hiro.so/txid/${a}?chain=mainnet`, k = (a, h = "", g = "") => {
    const f = document.createElement(a);
    return h && (f.textContent = h), g && (f.className = g), f;
  }, ye = (a, h, g = "") => {
    const f = k("button", a, g);
    return f.type = "button", f.onclick = h, f;
  }, _e = (a, h) => {
    const g = k("a", a);
    return g.href = h, g.target = "_blank", g.rel = "noopener", g;
  };
  let lt = null, Xe = location.hash === "#give";
  Xe && history.replaceState(null, "", location.pathname + location.search);
  let kt = !1;
  const rt = Y5((a) => X5({ address: a, network: "mainnet" }), () => it(l.snapshot())), st = (a) => rt.get(a), yt = tL(navigator.userAgent), qt = (a, h) => {
    const g = navigator.userAgent, f = rL(g), A = `${location.origin}${location.pathname}${h ? `#gift=${h}` : ""}`, z = [k("p", `You are in ${a}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${S.on ? "player" : "listening wallet"}${h ? S.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], G = k("div", "", "ppp-open-row"), K = nL(A, g);
    if (K) {
      const ce = k("a", `Open in ${f}`, "primary ppp-open-in");
      ce.href = K, ce.dataset.homeAction = "radio:open-in-browser", G.append(ce);
    }
    return G.append(rr("copy-page-link", "Copy link", () => A, K ? "" : "primary", () => it(l.snapshot()))), z.push(G, k("p", `If that does not open ${f}, use ${a}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), z;
  }, He = (a) => st(a) ?? F(a), Xt = (a) => a.slice(0, 2).map(He).join(" and ") + (a.length > 2 ? ` and ${a.length - 2} more` : ""), Ar = /* @__PURE__ */ new Map();
  let Yn = !1;
  const $n = (a) => !a || /^(?:Inscription )?#\d+$/.test(a.trim()), zr = () => {
    Yn || (Yn = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((a) => a.ok ? a.json() : null).then((a) => {
      for (const h of Array.isArray(a == null ? void 0 : a.tracks) ? a.tracks : []) {
        const g = Number(h == null ? void 0 : h.id);
        Number.isSafeInteger(g) && Ar.set(g, { title: typeof h.title == "string" ? h.title : void 0, artist: typeof h.artist == "string" ? h.artist : void 0 });
      }
      it(l.snapshot());
    }).catch(() => {
      Yn = !1;
    }));
  }, Ws = (a, h) => {
    const g = Ar.get(a), f = tg(a, [g == null ? void 0 : g.title, h == null ? void 0 : h.title].find((z) => !$n(z)) || ""), A = Q0(a, (g == null ? void 0 : g.artist) || (h == null ? void 0 : h.artist) || "");
    return { title: f, artist: A };
  }, os = (a) => {
    const { title: h, artist: g } = Ws(a.song, a);
    return h ? `“${h}”${g ? ` — ${g}` : ""}` : `Song #${a.song}${g ? ` — ${g}` : ""}`;
  }, zi = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Nn = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Er(a) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(a.step) ? ["", ""] : a.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : a.step === "over" ? ["TOO MUCH", "bad"] : a.step === "locked" ? ["LOCKED", "mute"] : a.step === "intro" || a.step === "link" ? ["", ""] : a.step === "fund" ? a.depositPending ? ["ON ITS WAY", "warn"] : a.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : a.payingOn && a.session && a.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function _n(a, h, g = "", f) {
    const A = k("dt", a), z = k("dd", h, g);
    return f && z.append(" ", f), [A, z];
  }
  const Oe = document.getElementById("ppp-top"), Pt = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? e : i).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, ar = () => {
    var h;
    const a = window.XtrataRadioConnectStacks;
    a ? a() : (h = document.getElementById("radio-wallet-connect")) == null || h.click();
  }, Zs = () => {
    var h, g;
    const a = l.snapshot();
    if (a.step === "connect" || a.step === "wrong-wallet") {
      ar();
      return;
    }
    if (a.step === "elsewhere" && ((h = a.gate) != null && h.radioUrl)) {
      location.href = a.gate.radioUrl;
      return;
    }
    if (a.step === "locked" && !a.armed && !a.busy && l.unlock(), a.step === "ready" && ((g = a.giftStop) == null ? void 0 : g.reason) === "off" && !a.busy && l.switchOn(), a.step === "fund" && a.solo && !a.depositPending && !a.busy) {
      $e();
      return;
    }
    Pt();
  };
  Oe && (Oe.onclick = Zs);
  const Pn = (a, h, g, f = "") => a.standIn && !a.mainConnected ? ye(`Connect ${He(a.standIn)} to add STX`, ar, f) : ye(h, g, f), qn = (a) => {
    l.useLinked(a).then(() => Pt());
  };
  let sn = null;
  const wn = () => {
    const a = yg(l.snapshot(), He);
    return a.length ? sn || (sn = new Promise((h) => {
      var Ae;
      const g = k("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const A = (Ee) => {
        f = Ee, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), sn = null, h(f);
      }), g.addEventListener("click", (Ee) => {
        Ee.target === g && A(null);
      });
      const z = (Ee, m, C, j, he = !1) => {
        const ut = k("button", "", "ppp-connect__opt " + C);
        return ut.type = "button", ut.disabled = he, ut.onclick = j, ut.append(k("b", Ee), k("span", m)), ut;
      }, G = k("h2", "Connect", "ppp-connect__title");
      G.id = "ppp-connect-title";
      const K = a.map((Ee) => z(Ee.label, Ee.detail, "is-music", () => {
        if (A("music"), Ee.action === "linked" && Ee.main) {
          qn(Ee.main);
          return;
        }
        const m = yg(l.snapshot(), He).find((C) => C.action !== "linked");
        (m == null ? void 0 : m.action) === "create" ? l.create() : (m == null ? void 0 : m.action) === "unlock" && l.unlock(), Pt();
      }, !!Ee.disabled)), ce = z("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => A("stacks")), ve = ye("Cancel", () => A(null), "quiet ppp-connect__cancel");
      g.append(G, ...K, ce, ve), document.body.appendChild(g), g.showModal(), (Ae = K.find((Ee) => !Ee.disabled)) == null || Ae.focus();
    }), sn) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = wn;
  function Js(a) {
    if (!Oe) return;
    const h = (f, A, z) => {
      Oe.hidden = !1, Oe.className = "ppp-top" + (A ? " is-" + A : ""), Oe.replaceChildren(k("span", "", "dot"), document.createTextNode(f)), Oe.title = z;
    }, g = a.session ? Math.min(a.session.playsLeft, a.playsLeft) : 0;
    switch (a.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Oe.hidden = !0;
        return;
      case "elsewhere":
        return h("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Oe.hidden = !0;
        return;
      case "intro":
        return h("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return h(`Connect ${He(a.linked)}`, "warn", `This device's listening wallet belongs to ${He(a.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return h("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return h("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return a.depositPending ? h("Plays on their way", "quiet", "Plays start by themselves when they land") : h(a.entries.some((f) => f.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return h("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return h("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return a.payingOn && g > 0 && !a.giftStop ? h(`${g.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : h("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const en = document.getElementById("pppNudge"), Qs = document.getElementById("onair");
  (x = en == null ? void 0 : en.querySelector("button")) == null || x.addEventListener("click", () => Zs());
  const Gi = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, as = {
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
  function Go(a) {
    if (a.step === "loading") return;
    const h = a.session ? Math.min(a.session.playsLeft, a.playsLeft) : 0, g = a.step === "ready" && a.payingOn && h > 0 && !a.giftStop, f = a.step === "fund" && a.depositPending, A = a.step === "elsewhere" && !t, z = g || f || A ? "" : Gi[a.step] ?? "", G = g ? "on" : A ? "free" : z ? "off" : "";
    G ? document.documentElement.dataset.ppp = G : delete document.documentElement.dataset.ppp, Qs && (Qs.hidden = !G || G === "free", Qs.querySelector(".onair-sub").textContent = g ? `${h.toLocaleString()} plays left` : "Plays off"), en && (en.hidden = G !== "off" && G !== "free", en.classList.toggle("is-free", G === "free"), G === "free" ? (en.querySelector(".nudge-t").textContent = "You’re on the free player", en.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", en.querySelector("button").textContent = "Get a player") : G === "off" && (en.querySelector(".nudge-t").textContent = z, en.querySelector(".nudge-s").textContent = v(a) ? a.step === "intro" ? dL : "" : "This radio requires a funded listening wallet with music support on.", en.querySelector("button").textContent = as[a.step] ?? "Start"));
  }
  let Gr = "";
  function mn(a) {
    const h = k("div", "", "ppp-pick");
    a.funderMultiple && a.returnToKind === "funder" && h.append(k("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), a.returnToKind === "funder" && h.append(k("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = k("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = Gr, g.oninput = () => {
      Gr = g.value;
    };
    const f = ye(a.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      l.setReturnAddress(g.value), Gr = "";
    }, "tiny");
    return h.append(g, " ", f), a.returnToKind === "chosen" && h.append(" ", ye("Back to the funder", () => l.clearReturnAddress(), "tiny")), h;
  }
  const Ko = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Ki() {
    const a = k("p", Ko + " ", "ppp-mute");
    return a.append(_e("Xverse", "https://www.xverse.app/download"), " · ", _e("Leather", "https://leather.io/install-extension")), a;
  }
  let Vi = "";
  const ei = (a) => {
    const h = document.documentElement, g = a.solo && !a.main ? a.listening ? F(a.listening) : "new" : "", f = y5() ? "1" : "", A = a.standIn && !a.mainConnected ? He(a.standIn) : "";
    `${g}|${f}|${A}` !== Vi && (Vi = `${g}|${f}|${A}`, g ? h.dataset.pppSolo = g : delete h.dataset.pppSolo, A ? h.dataset.pppAs = A : delete h.dataset.pppAs, f ? h.dataset.pppWalletInstalled = f : delete h.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const a of [1500, 4e3, 9e3]) setTimeout(() => it(l.snapshot()), a);
  function cs(a, h = "") {
    const g = k("div", "", "ppp-topup"), f = Wn(a);
    g.append(k("span", "Add plays from My player: ", "ppp-mute"));
    for (const A of Bc) {
      const z = ye(`+${A.toLocaleString()}`, () => void l.topUpAlbum(A), h);
      z.disabled = f === void 0 || f < A || a.depositPending || !!a.busy, g.append(z);
    }
    return f !== void 0 && f < Bc[0] && g.append(k("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const Wn = (a) => {
    var f;
    const h = (f = a.likeFunds) == null ? void 0 : f.balance;
    if (h === void 0 || !a.playCost) return;
    const g = h - Rt - 6000n;
    return g > 0n ? Number(g / a.playCost) : 0;
  };
  function ti(a) {
    const h = a.likeFunds;
    if (!h || !h.album || !h.low && !h.pending) return [];
    if (h.low || (yn = !1), h.low && !yn) return [];
    const g = k("div", "", "ppp-pick ppp-lowbox");
    if (!h.low) {
      if (!h.txid) return [];
      const A = k("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return h.txid && A.append(_e("View", fe(h.txid))), g.append(A), [g];
    }
    g.append(k("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append(k("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append(k("p", h.address, "ppp-addr-full"));
    const f = k("div", "", "ppp-open-row");
    if (f.append(rr("copy-likes-address", "Copy address", () => h.address, "primary", () => it(l.snapshot()))), h.main && !a.solo) {
      const A = Qr - (h.balance ?? 0n);
      A > 0n && f.append(Pn(a, `Pay ${hr(A)} STX from my wallet`, () => void l.topUpLikes(), "primary"));
    }
    return g.append(f), g.append(k("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const ls = (a) => {
    const h = k("div", "", "ppp-wait");
    h.dataset.since = String(a.since), h.dataset.grace = String(a.graceMs), h.setAttribute("role", "progressbar"), h.setAttribute("aria-label", "Your plays are arriving");
    const g = k("p", "", "ppp-wait-t"), f = k("div", "", "ppp-wait-track");
    return f.append(k("div", "", "ppp-wait-fill")), h.append(g, f), us(h), h;
  };
  function us(a) {
    const h = Number(a.dataset.since), g = Number(a.dataset.grace) || 6e4, f = Math.max(0, Date.now() - h), A = a.querySelector(".ppp-wait-fill"), z = a.querySelector(".ppp-wait-t");
    if (f < g) {
      const G = Math.ceil((g - f) / 1e3);
      A.style.width = Math.max(4, Math.min(95, f / g * 100)).toFixed(0) + "%", z.textContent = `Your plays are arriving… usually about a minute · ${G}s`, a.classList.remove("is-long"), a.setAttribute("aria-valuenow", String(Math.round(f / g * 100)));
    } else
      A.style.width = "", z.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", a.classList.add("is-long"), a.removeAttribute("aria-valuenow");
  }
  let ni = 0;
  setInterval(() => {
    const a = document.querySelectorAll(".ppp-wait");
    if (!a.length) {
      ni = 0;
      return;
    }
    a.forEach(us), ++ni % 10 === 0 && it(l.snapshot());
  }, 1e3);
  let Kr = null;
  function Xi(a) {
    if (a.step === "loading" && Kr !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(a.step) || !!a.busy || a.armed || !!u.pendingCode() && !["ready", "fund", "over"].includes(a.step);
    g !== Kr && (Kr = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function it(a) {
    var fh, hh, ph, gh, yh, wh, mh, bh, xh, Sh, vh, Ah, Eh, kh, $h, Ih, Lh, Ch;
    if (B.sync(), R && ["ready", "fund", "over"].includes(a.step) && !a.busy) {
      const W = R;
      R = null, a.root === W.root && a.slot !== W.slot && l.openAlbum(W.slot);
    }
    const h = u.inProgress(a), g = Rr(a), f = h && a.step === "fund" ? { ...a, depositPending: !0 } : g !== null ? { ...a, depositPending: !0, arrival: { since: g, graceMs: ol } } : a, A = f.error === al;
    if (re(), Ne(a), D(a), Fe = Qe(a), Mn(a, f), Xi(f), ei(f), !h && u.inProgress(a)) return;
    if (Js(f), Go(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? S.on ? fL : "Checking your listening wallet…" : S.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      Te(f, !1);
      return;
    }
    const [z, G] = Er(f), K = s(".ppp-state");
    K.textContent = z, K.className = "ppp-state" + (G ? " ppp-state--" + G : ""), K.hidden = !z;
    const ce = !!f.busy || f.armed, ve = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (ce || !["intro", "loading"].includes(f.step));
    i.hidden = !ve, i.classList.toggle("ppp-frame--rest", !ce && !kt);
    const Ae = s(".ppp-frame-label");
    Ae.hidden = !0;
    const Ee = f5(f) ?? lt;
    lt = Ee;
    const m = "xtrata.radio.ppp.heard.v1", C = (() => {
      try {
        return localStorage.getItem(m) === "1";
      } catch {
        return !1;
      }
    })();
    if (!C && f.entries.some((W) => W.kind === "play"))
      try {
        localStorage.setItem(m, "1");
      } catch {
      }
    const j = C || f.slot > 0 && ((((fh = f.likeFunds) == null ? void 0 : fh.balance) ?? 0n) > 0n || w.count() > 1), he = v(f), ut = !he && p5({ ...f, heard: j }, Ee);
    s(".ppp-badge").hidden = !ut;
    const Tt = s(".ppp-steps"), Wt = s(".ppp-stage");
    Tt.hidden = Wt.hidden = !ut, Ee && ut && (Tt.replaceChildren(...Hd(f.solo).map((W, ue) => {
      const Pe = k("li", "", ue < Ee.at ? "done" : ue === Ee.at ? Ee.blocked ? "now blocked" : "now" : "");
      return Pe.append(k("span", ue < Ee.at ? "✓" : String(ue + 1), "n"), W), ue === Ee.at && Pe.setAttribute("aria-current", "step"), Pe;
    })), Wt.textContent = Ee.caption, Wt.className = "ppp-stage " + (Ee.at >= Hd(f.solo).length ? "ppp-ok" : Ee.blocked ? "ppp-bad" : "ppp-cyan"));
    const Ut = s(".ppp-facts"), Ln = [];
    f.main && ((hh = f.gate) != null && hh.here) && !f.solo && Ln.push(..._n("Your wallet", He(f.main), "ppp-addr-short"));
    const Xr = () => {
      if (!f.listening) return;
      const W = rr("copy-listening", "Copy", () => f.listening || "", "tiny", () => it(l.snapshot()));
      Ln.push(..._n(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", F(f.listening), "ppp-addr-short", W));
    };
    if (f.linked || Xr(), f.listening && f.step !== "intro")
      if (f.linked)
        Ln.push(..._n("Credited to", `${He(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Xr();
      else if (f.solo) {
        f.creditedTo && Ln.push(..._n("Credited to", `${He(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const W = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${He(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Ln.push(..._n("Returns go to", f.gift ? W : f.returnTo && !st(f.returnTo) ? W.replace(F(f.returnTo), f.returnTo) : W, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Ln.push(..._n("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((ph = f.gate) != null && ph.here)) {
      const W = f.linkedListening.map((ue) => F(ue) + (ue === f.listening ? " (this one)" : "")).join(", ");
      Ln.push(..._n(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", W, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const W = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Ln.push(..._n("Balance", `${hr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, W));
    }
    const hs = f.entries.find((W) => W.kind === "play");
    hs && zr(), hs && Ln.push(..._n("Last paid song", `${os(hs)} → ${He(hs.recipient)}`, zi[hs.status] || "")), Ut.replaceChildren(...Ln), Ut.hidden = !Ln.length;
    const Ie = [], dt = [], ht = [], tn = [], ih = pn(BigInt(((gh = f.gate) == null ? void 0 : gh.limits.playFee) ?? "300")), oh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${hr(sl)} STX to the song holder, plus a ${hr(ih - sl)} STX network fee.`, ah = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (Ie.push(k("p", "Pay artists as you listen.")), (yh = f.gate) != null && yh.radioUrl) {
          const ue = k("p");
          ue.append(_e("Open the pay-per-play radio →", f.gate.radioUrl)), Ie.push(ue);
        }
        dt.push(k("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const ue = [f.linked, ...f.others];
          Ie.push(k("p", ue.length > 1 ? `This device has listening wallets for ${Xt(ue)}.` : `This device has a listening wallet for ${He(f.linked)}.`)), dt.push(k("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), ue.slice(0, 3).forEach((Pe, ot) => ht.push(ye(`Open ${He(Pe)}`, () => qn(Pe), ot === 0 ? "primary" : "")));
        } else
          Ie.push(k("p", "Connect your wallet to pay artists as you listen.")), dt.push(k("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        Ie.push(k("p", `This device's listening wallet belongs to ${He(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), dt.push(k("p", `You are connected as ${He(f.main)}. Switch to the linked wallet to continue listening.`)), dt.push(k("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), ht.push(ye("Switch wallet", ar, "primary"));
        break;
      case "not-invited":
        Ie.push(k("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        Ie.push(k("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Ie.push(k("p", "Every play counts for the song’s owner, on-chain.")), dt.push(k("p", oh)), dt.push(k("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), dt.push(k("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (Ie.push(k("p", `This device already has a listening wallet for ${Xt(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), dt.push(k("p", `Otherwise, set up a new listening wallet for ${He(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && dt.push(k("p", `This is the listening wallet for ${He(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && dt.push(k("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const W = u.liveGift();
        ht.push(ye(W ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${He(f.main)}` : "Start listening", () => void l.create(), "primary")), !W && !f.solo && f.main && f.others.length && ht.push(ye("Switch wallet", ar)), !W && f.solo && ht.push(ye("I have a Stacks wallet", ar)), ht.push(ye("I already have a listening wallet", () => void l.unlock(!0))), W && ht.push(ye("Not now", () => u.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (Ie.push(k("p", "Locked.", "ppp-mute")), ht.push(ye("Unlock", () => void l.unlock(), "primary"))), f.standIn ? tn.push(ye("Use a different listening wallet", () => void wn().then((ue) => {
          ue === "stacks" && ar();
        }), "quiet")) : tn.push(ye("Use a different listening wallet", () => void l.unlock(!0), "quiet"));
        break;
      case "link":
        Ie.push(k("p", `Link to ${He(f.main)} · free`)), dt.push(k("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), dt.push(k("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), ht.push(ye(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void l.link(), "primary"));
        break;
      case "loading":
        Ie.push(k("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && Ie.push(ls(f.arrival)) : $(f) ? Ie.push(k("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (wh = f.gift) != null && wh.player ? Ie.push(k("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? Ie.push(k("p", "No plays left · add plays to keep counting", "ppp-bad")) : Ie.push(k("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / ih)).toLocaleString()} plays`)), f.entries.length && dt.push(k("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && dt.push(k("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), h ? dt.push(k("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? dt.push(k("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (dt.push(k("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), dt.push(k("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && ht.push(rr("copy-address", "Copy my address", () => f.listening || "", "primary", () => it(l.snapshot())))) : dt.push(k("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const ue = k("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          ue.append(_e("View", fe(f.depositTxid))), Ie.push(ue);
        } else f.allowance > 0n && !f.solo && !f.depositPending && ht.push(Pn(f, `Deposit ${hr(f.allowance)} STX from my wallet`, () => void l.deposit(), "primary"));
        break;
      }
      case "over":
        Ie.push(k("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (Ie.push(k("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), ht.push(ye("Back up my player · 24 words", () => void l.backup(), ""))), f.solo && !f.returnTo && (Ie.push(k("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Ie.push(mn(f))), (!f.solo || f.returnTo) && ht.push(ye("Return excess", () => void l.returnFunds("excess"), "primary"), ye("Return all", () => void l.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((mh = f.giftStop) == null ? void 0 : mh.reason) !== "off") {
          const ue = Math.min(f.session.playsLeft, f.playsLeft);
          Ie.push(k("p", `${ue.toLocaleString()} plays left`, "ppp-ok")), dt.push(k("p", oh + " The heart likes or unlikes from this wallet for 0.0002 STX.")), ht.push(ye("Switch off", () => void l.switchOff()));
        } else
          Ie.push(k("p", "Switch on music support to listen.", "ppp-mute")), ht.push(ye("Switch plays on", () => void l.switchOn(), "primary"));
        f.queued && Ie.push(k("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && Ie.push(k("p", "Running low on plays", "ppp-warn")), f.aboveTarget && Ie.push(k("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? Ie.push(k("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && ht.push(Pn(f, `Top up ${hr(f.allowance)} STX`, () => void l.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const W = f.step === "fund", ue = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      W ? ht.unshift(ye("Add plays", () => $e(), "primary")) : ue ? ht.push(ye("Add plays", () => $e(), "primary")) : f.step === "ready" && tn.push(ye("Add plays", () => $e(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && dt.push(k("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && dt.push(mn(f)), dt.push(Ki()), f.slot === 0 && f.step === "ready" && f.entries.some((W) => W.kind === "play" && W.status === "confirmed"))) {
      const W = k("p", "New to Stacks? ", "ppp-mute");
      W.append(_e("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Ie.push(W);
    }
    if (f.walletOutdated && dt.push(k("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (Ie.push(k("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), ht.push(ye("Clear stuck payments", () => void l.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && tn.push(ye(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${He(f.returnTo)}`, () => void l.returnFunds("all"), "quiet")), f.slot > 0 && ((bh = f.gift) != null && bh.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && tn.push(cs(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && tn.push(ye(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void l.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && tn.push(ye("Lock", () => void l.lock(), "quiet")), ve && !ce && tn.push(ye(kt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      kt = !kt, it(l.snapshot());
    }, "quiet")), [...ht, ...tn].forEach((W) => W.disabled = ah), ah && (ht.length = 0), !he && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((xh = f.gift) != null && xh.player)) {
      const W = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", ue = Ie.at(0);
      f.step === "ready" && ue ? ue.append(k("span", ` · ${X(f.balance)} STX`, W)) : Ie.push(k("p", `Balance ${X(f.balance)} STX`, W));
    }
    if (he) {
      for (const Pe of [...ht, ...tn]) {
        const ot = aL[Pe.textContent ?? ""];
        ot && (Pe.textContent = ot);
      }
      for (let Pe = Ie.length - 1; Pe >= 0; Pe--) mg(Ie[Pe].textContent) && dt.unshift(...Ie.splice(Pe, 1));
      for (let Pe = ht.length - 1; Pe >= 0; Pe--) mg(ht[Pe].textContent) && tn.unshift(...ht.splice(Pe, 1));
      const W = f.entries.some((Pe) => Pe.kind === "play"), ue = uL(f.step, { played: W, arriving: f.depositPending });
      ue.length && Ie.length && ue.shift(), Ie.push(...ue.map((Pe) => k("p", Pe, "ppp-mute")));
    }
    if ((Sh = f.gift) != null && Sh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const W = k("p", "", "ppp-gift");
      W.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && W.append(" · ", f.gift.player.subtitle);
      const ue = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? k("span", " · plays on their way", "ppp-warn") : k("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      ue && W.append(ue);
      const Pe = (vh = Ie.at(0)) == null ? void 0 : vh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Pe && /STX/.test(Pe.textContent ?? "") && Pe.remove(), Ie.unshift(W), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          Ie.splice(1, 0, k("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), cs(f, "primary"));
        else {
          const ot = k("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ot.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ot.append(_e("Xverse", "https://www.xverse.app/download"), " and ", _e("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Ie.splice(1, 0, ot);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const W = f.returnPlan, ue = k("div", "", "ppp-pick");
      ue.append(k("p", W.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Pe = k("ul", "", "ppp-gift-list");
      W.steps.forEach((ot, cr) => {
        const Hn = ot.kind === "gift" ? "the unused gift" : ot.kind === "deposit" ? "what was added to it" : "the rest", on = k("li");
        on.append(k("span", `${cr + 1}. ${hr(BigInt(ot.send))} STX · ${Hn}`, "t"), k("span", ot.to ? ` → ${He(ot.to)}` : " → choose an address below", ot.to ? "ppp-mute" : "ppp-warn")), Pe.append(on);
      }), ue.append(Pe), W.kept && ue.append(k("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), W.steps.some((ot) => !ot.to) && ue.append(mn(f)), ue.append(ye(W.steps.length > 1 ? `Confirm part 1 of ${W.steps.length}` : "Confirm and return", () => void l.returnFunds("all"), "primary")), Ie.push(ue);
    }
    const ps = Yi(f), gs = T ? ps : null, Qi = me(f, !!gs), lb = Qi === "gift" || Qi === "arriving" || Qi === "new", jl = u.banner(a, { bare: !!gs || Qi === "gift" || Qi === "arriving" }), Pa = yt && (u.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? qt(yt, u.pendingCode()) : [];
    gs || (Ie.unshift(...jl), Ie.push(...ti(f)), Ie.unshift(...Pa)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && Ie.unshift(k("p", `This is ${He(f.creditedTo)}'s listening wallet. Plays and likes count for ${He(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...Ie);
    const Rl = document.querySelector(".ppp-switch");
    if (Rl) {
      const W = w.latest(), ue = f.slot > 0, Pe = ["fund", "ready", "over"].includes(f.step) && (ue || !!W);
      if (Rl.hidden = !Pe, Pe) {
        const ot = (on, Oa, Da, Yl) => {
          const to = ye("", Yl, "ppp-tab");
          return to.setAttribute("aria-pressed", String(Da)), to.append(k("span", on, "tt"), k("span", Oa === void 0 ? "…" : `${V(Oa).toLocaleString()} plays`, "ts")), to.disabled = !!f.busy, to;
        }, cr = ue ? ((Eh = (Ah = f.gift) == null ? void 0 : Ah.player) == null ? void 0 : Eh.title) ?? "Album" : W.title, Hn = ye("View all albums" + (w.count() > 1 ? ` (${w.count()})` : ""), () => {
          const on = document.querySelector(".ppp-shelf");
          on && (on.hidden = !1, on.open = !on.open, Hn.setAttribute("aria-expanded", String(on.open)), on.open && requestAnimationFrame(() => on.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Hn.setAttribute("aria-expanded", String(!!((kh = document.querySelector(".ppp-shelf")) != null && kh.open))), Rl.replaceChildren(
          ot("🎧 My player", ue ? ($h = f.likeFunds) == null ? void 0 : $h.balance : f.balance, !ue, () => {
            ue && l.openAlbum(0);
          }),
          ot("💿 " + cr, ue ? f.balance : void 0, ue, () => {
            !ue && W && l.openAlbum(W.slot);
          }),
          Hn
        );
      }
    }
    const Ua = w.render(f), Ha = document.querySelector(".ppp-shelf");
    if (Ha) {
      Ha.hidden = !Ua;
      const W = Ha.querySelector("summary");
      W && (W.textContent = w.count() > 0 ? `♪ My albums (${w.count()})` : "♪ My albums");
      const ue = Ha.querySelector(".ppp-shelf-body");
      Ua && ue && !ue.contains(Ua) && ue.replaceChildren(Ua);
    }
    const Xo = u.renderFold(a);
    if (s(".ppp-gifts").hidden = !Xo, Xo && !s(".ppp-gift-body").contains(Xo) && s(".ppp-gift-body").replaceChildren(Xo), Xo && Xe) {
      Xe = !1;
      const W = s(".ppp-gifts");
      W.open = !0, requestAnimationFrame(() => W.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const zl = document.querySelector("#ppp .ppp-featured");
    if (zl) {
      const W = _(), ue = B.manage(), Pe = (W.length > 0 || !!ue) && f.slot === 0 && !((Ih = f.gift) != null && Ih.player) && f.step === "ready";
      zl.hidden = !Pe, Pe && zl.replaceChildren(...W.length ? [k("p", "Albums in your player", "ppp-featured__h")] : [], ...W.map((ot) => {
        const cr = (xe == null ? void 0 : xe.id) === ot.id, Hn = ye("", () => Be(cr ? null : ot, !cr), "ppp-featured__a" + (cr ? " is-on" : "")), on = mr(ot).length;
        return Hn.append(k("b", ot.title), k("span", cr ? "Playing now · tap to go back to the radio" : `${ot.subtitle ? ot.subtitle + " · " : ""}${on} ${on === 1 ? "song" : "songs"}`)), Hn.setAttribute("aria-pressed", String(cr)), Hn.disabled = !!f.busy, Hn;
      }), ...ue ? [ue] : []);
    }
    const Gl = document.querySelector("#ppp .ppp-release-in-slot");
    if (Gl) {
      const W = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : B.banner();
      Gl.hidden = !W.length, Gl.replaceChildren(...W);
    }
    const eo = document.querySelector("#ppp .ppp-release");
    if (eo) {
      const W = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : B.fold();
      if (eo.hidden = !W, W) {
        const ue = document.activeElement instanceof HTMLElement && eo.contains(document.activeElement) ? document.activeElement : null, Pe = ((Lh = eo.querySelector(".ppp-release-songs")) == null ? void 0 : Lh.scrollTop) ?? 0;
        (Ch = eo.querySelector(".ppp-release-body")) == null || Ch.replaceChildren(...W);
        const ot = eo.querySelector(".ppp-release-songs");
        ot && Pe && (ot.scrollTop = Pe), ue && ue.isConnected && document.activeElement !== ue && ue.focus({ preventScroll: !0 });
      }
    }
    At(f);
    const Kl = document.querySelector("#ppp .ppp-yours");
    if (Kl) {
      const W = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      Kl.hidden = !W;
      const ue = Kl.querySelector(".ppp-yours-body");
      if (W && ue && ue.getAttribute("data-for") !== f.listening) {
        ue.setAttribute("data-for", f.listening);
        const Pe = (Yl, ...to) => {
          const Th = k("details", "", "ppp-yours-item");
          return Th.append(k("summary", Yl), ...to), Th;
        }, ot = k("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        ot.append(k("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const cr = k("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), Hn = k("p");
        Hn.append(_e("Find a name at BNS One →", "https://bns.one"));
        const on = k("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Oa = k("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Da = k("p");
        Da.append(_e("See the giveaway →", "https://xtrata.xyz/giveaway")), ue.replaceChildren(
          Pe("Give your player a name", ot, cr, k("p", f.listening, "ppp-addr-full"), rr("copy-yours-address", "Copy my player’s code", () => l.snapshot().listening || "", "tiny", () => it(l.snapshot())), Hn),
          Pe("Link it to a wallet you already have", on),
          Pe("Bring a friend in", Oa, Da)
        );
      }
    }
    s(".ppp-body").replaceChildren(...dt), s(".ppp-actions").replaceChildren(...ht), s(".ppp-actions2").replaceChildren(...tn);
    const Vl = f.busy || f.message || "", ch = s(".ppp-msg"), Xl = Vl && Ie.some((W) => (W.textContent ?? "").startsWith(Vl.replace(/[.✓\s]+$/, ""))) ? "" : Vl, lh = !Xl && !f.error ? f.notice : A && !Xl ? f.error : "";
    ch.textContent = Xl || lh, ch.classList.toggle("is-warn", !!lh), s(".ppp-err").textContent = A ? "" : f.error;
    const ub = f.entries.filter((W) => W.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...ub.slice(0, 5).map((W) => {
      const ue = k("li"), Pe = W.status === "confirmed" ? "ok" : W.status === "failed" ? "bad" : "warn";
      return ue.append(k("span", "", "d " + Pe), k("span", os(W), "t"), k("span", ee(W.created), "ppp-mute")), W.txid && ue.append(_e("tx", fe(W.txid))), ue;
    })), s(".ppp-wallets").hidden = !(Ut.childElementCount || tn.length), s(".ppp-more").hidden = !dt.length;
    const uh = s(".ppp-history");
    uh.hidden = !f.entries.length, f.entries.length && zr(), uh.replaceChildren(k("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((W) => {
      const ue = k("div", "", "ppp-row"), Pe = W.kind === "play" ? [k("span", os(W), "ppp-song"), k("span", ` · ${hr(BigInt(W.amount))} STX to ${He(W.recipient)}`, "ppp-mute")] : W.kind === "like" ? [k("span", `${W.liked ? "♥ Liked" : "Unliked"} ${os(W)}`, "ppp-song"), k("span", ` · for ${f.linked ? He(f.linked) : "this listening wallet"}`, "ppp-mute")] : [k("span", `Returned ${hr(BigInt(W.amount))} STX`, "ppp-song"), k("span", ` to ${He(W.recipient)}`, "ppp-mute")];
      return ue.append(
        k("span", Nn[W.status] || W.status, "ppp-status " + (zi[W.status] || "")),
        ...Pe,
        k("span", ` · ${new Date(W.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), W.txid && ue.append(_e("tx ↗", fe(W.txid))), ue;
    })), E == null || E.render(gs ? Un(f, gs, [...Pa, ...jl]) : null), Te(f, !!gs, lb ? [...Pa, ...jl] : Pa, Qi), Vr(f, !!gs || !!(ae != null && ae.showing())), qi(f, gs), Me.isOpen() && Me.refresh(), Zi();
    const dh = (ps == null ? void 0 : ps.mode) === "open" ? null : nt(f);
    Jt == null || Jt.render((ps == null ? void 0 : ps.mode) === "open" ? Un(f, ps, []) : dh ? { ...Un(f, { mode: "open", player: dh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function Yi(a) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(a.step)) return null;
    if (a.slot > 0 && ((f = a.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(a.step))
      return a.root && vt({ root: a.root, slot: a.slot, player: a.gift.player }), { mode: "open", player: a.gift.player };
    const h = u.incomingAlbum();
    if (h) return { mode: "arrive", player: h.player, from: h.from, offered: h.plays };
    const g = Je();
    return g && (a.step === "locked" || R && a.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const Vo = (a, h, g, f, A) => `/awards/${a.id}#${new URLSearchParams({ n: String(h), a: g, ...A ? { b: A } : {}, p: String(f), s: xg(G0, h, g) })}`;
  function ri(a) {
    const h = a.award;
    return !h || !["ready", "fund", "over", "link"].includes(a.step) ? null : h.claimTx ? Y ? "making" : null : h.state === "claimed" ? Y && h.inscription !== void 0 ? "yours" : null : h.state !== "ready" || b || a.step === "link" && Q !== "have" ? null : Q === "making" || Q === "yours" ? "ready" : Q;
  }
  function Vr(a, h) {
    if (!Z) return;
    const g = a.award, f = g != null && g.cls && Sc(g.cls) ? vc(g.cls) : null, A = a.slot === 0 ? a.listening : a.root, z = h || !g || !f || !A || g.number === void 0 ? null : ri(a);
    if (!z || !g || !f || !A) {
      Z.render(null, h);
      return;
    }
    z === "have" && a.linked && !I && (I = !0, l.awardRefresh());
    const G = typeof g.name == "string" && g.name ? g.name : null, K = [];
    a.error && K.push(k("p", a.error, "ppp-warn"));
    const ce = (ve) => {
      Q = ve, ve === "name" && (Y = !0), it(l.snapshot());
    };
    Z.render({
      screen: z,
      tier: f,
      number: g.number,
      need: g.need ?? 0,
      player: A,
      name: g.name,
      inscription: g.inscription,
      art: z === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : Vo(f, g.number, A, g.need ?? 0, G),
      claimLink: g.claimTx ? fe(g.claimTx) : void 0,
      status: K,
      asking: !!a.busy || a.armed,
      busy: !!a.busy,
      main: a.main ? He(a.main) : null,
      canLink: a.step === "link",
      linked: !!a.linked,
      copyAddress: () => rr("award-player-address", "Copy my player’s address", () => A, "tiny", () => it(l.snapshot())),
      go: ce,
      claim: (ve) => {
        Y = !0, l.claimAward(ve);
      },
      refresh: () => void l.awardRefresh(),
      connect: () => {
        var ve;
        return (ve = document.getElementById("radio-wallet-connect")) == null ? void 0 : ve.click();
      },
      link: () => void l.link(),
      later: () => {
        b = !0;
        try {
          localStorage.setItem(de, String(Date.now()));
        } catch {
        }
        it(l.snapshot());
      },
      done: () => {
        Y = !1, Q = "ready", it(l.snapshot());
      }
    }, h);
  }
  function At(a) {
    var Ee;
    const h = document.querySelector("#ppp .ppp-award");
    if (!h) return;
    const g = a.award, f = a.slot === 0 ? a.listening : a.root, A = g != null && g.cls && Sc(g.cls) ? vc(g.cls) : null, z = !!g && !!A && !!f && ["ready", "fund", "over"].includes(a.step) && !(g.state === "unavailable" && g.number === void 0);
    if (h.hidden = !z, !z || !g || !A || !f) {
      h.replaceChildren();
      return;
    }
    const G = JSON.stringify([g, f, !!a.busy]);
    if (h.getAttribute("data-sig") === G) return;
    h.setAttribute("data-sig", G);
    const K = (m) => {
      const C = k("p", "", "ppp-award__h");
      return C.append(k("b", `${A.mark} Music Hero award`), k("span", m)), C;
    }, ce = `No. ${String(g.number ?? 0).padStart(4, "0")}`, ve = (m) => {
      const C = k("div", "", "ppp-award__art"), j = document.createElement("iframe");
      return j.src = m, j.title = `${A.name} record`, j.setAttribute("sandbox", "allow-scripts"), j.setAttribute("loading", "lazy"), C.append(j), C;
    }, Ae = [];
    if (g.state === "claimed") {
      if (Ae.push(K(`${A.name} record · ${ce}`)), g.inscription !== void 0 && Ae.push(ve(`/i/${g.inscription}`)), Ae.push(k("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${A.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const m = k("p");
        m.append(_e("Open it full screen ↗", `/i/${g.inscription}`)), Ae.push(m);
      }
      if (g.sendTx) {
        const m = k("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        m.append(_e("View", fe(g.sendTx))), Ae.push(m);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const m = k("details", "", "ppp-award__send"), C = document.createElement("input");
        C.type = "text", C.placeholder = "SP… address to send it to", C.autocomplete = "off", C.spellcheck = !1, C.setAttribute("aria-label", "Address to send your record to");
        const j = ye("Send my record…", () => void l.sendAward(C.value), "");
        j.disabled = !!a.busy, m.append(
          k("summary", "Send this record to someone"),
          k("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          C,
          j
        ), Ae.push(m);
      }
    } else if (g.claimTx) {
      Ae.push(K(`${A.name} record · ${ce}`));
      const m = k("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      m.append(_e("View", fe(g.claimTx))), Ae.push(m);
    } else if (g.state === "ready") {
      Ae.push(K(`${A.name} record · ${ce}`));
      const m = typeof g.name == "string" && g.name ? g.name : null, C = new URLSearchParams({ n: String(g.number), a: f, ...m ? { b: m } : {}, p: String(g.need), s: xg(G0, g.number, f) });
      Ae.push(ve(`/awards/${A.id}#${C}`)), Ae.push(k("p", `Your ${A.name} record is ready. You have paid artists for ${(Ee = g.need) == null ? void 0 : Ee.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const j = k("div", "", "ppp-award__row");
      m ? (Ae.push(k("p", `Its plaque will carry ${m} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), j.append(ye("Claim my record", () => {
        Y = !0, l.claimAward("auto");
      }, "primary"), ye("Use my address only", () => {
        Y = !0, l.claimAward("none");
      }, "quiet"))) : g.name === null ? (Ae.push(k("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), j.append(ye("Claim my record", () => {
        Y = !0, l.claimAward("none");
      }, "primary"), ye("Check for a name again", () => void l.awardRefresh(), "quiet"))) : (Ae.push(k("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), j.append(ye("Check for a name again", () => void l.awardRefresh(), "primary"), ye("Claim with my address only", () => void l.claimAward("none"), "quiet"))), j.querySelectorAll("button").forEach((he) => {
        he.disabled = !!a.busy;
      }), Ae.push(j, k("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      Ae.push(K(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const m = k("div", "", "ppp-award__bar"), C = document.createElement("i");
      C.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, m.append(C);
      const j = g.need - g.have;
      Ae.push(m, k("p", `${j.toLocaleString()} more ${j === 1 ? "play" : "plays"} and your ${A.name} record is yours to claim.`, "ppp-mute"));
    } else
      Ae.push(K(`${A.name} record · ${ce}`)), Ae.push(k("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    h.replaceChildren(...Ae);
  }
  function qi(a, h) {
    var K;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!h && (Z != null && Z.showing()) && ((K = a.award) != null && K.cls) && Sc(a.award.cls) && (a.busy || a.armed)) {
      const ce = vc(a.award.cls), ve = k("span", "", "ppp-skin__t");
      ve.append(k("b", `${ce.name} record · No. ${String(a.award.number ?? 0).padStart(4, "0")}`), k("span", "Xtrata Music Hero")), g.hidden = !1, g.replaceChildren(k("span", ce.mark, "ppp-skin__art ppp-skin__art--none"), ve);
      return;
    }
    const f = !!h && (!!a.busy || a.armed);
    if (g.hidden = !f, !f || !h) {
      g.replaceChildren();
      return;
    }
    const A = Mc(h.player.cover), z = A ? k("img", "", "ppp-skin__art") : k("span", "♪", "ppp-skin__art ppp-skin__art--none");
    A && (z.src = A, z.alt = "");
    const G = k("span", "", "ppp-skin__t");
    G.append(k("b", h.player.title), k("span", h.mode === "arrive" && h.from ? `A gift from ${h.from}` : h.player.subtitle || "Your album")), g.replaceChildren(z, G);
  }
  function Un(a, h, g) {
    var ce, ve, Ae, Ee, m;
    const f = !!a.busy || a.armed, A = [...g];
    a.depositPending && a.arrival && A.push(ls(a.arrival)), a.error ? A.push(k("p", a.error, a.error === al ? "ppp-warn" : "ppp-bad")) : a.message && !f ? A.push(k("p", a.message, "ppp-cyan")) : a.notice && A.push(k("p", a.notice, "ppp-warn")), h.mode === "open" && yn && ((ce = a.likeFunds) != null && ce.album) && a.likeFunds.low && !a.likeFunds.pending && A.push(k("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let z = "Kept on this device with Face ID or your passkey. No app or account needed.", G = null, K = null;
    if (h.mode === "locked")
      G = { label: "Continue listening", run: () => {
        R = Je(), l.unlock();
      } }, K = { label: "Use a different passkey", run: () => {
        R = null, l.unlock(!0);
      } };
    else if (h.mode === "arrive")
      if (a.step === "intro" && xc(oe) && oe.album === h.player.id) {
        const C = window.XtrataRadio, j = mr(h.player)[0], he = oe.phase === "playing";
        G = { label: he && !!((Ae = (ve = C == null ? void 0 : C.getState) == null ? void 0 : ve.call(C)) != null && Ae.playing) ? "Pause" : he ? "Carry on" : "Play the first song", run: () => {
          var Tt, Wt;
          he ? (Tt = C == null ? void 0 : C.playPause) == null || Tt.call(C) : j && ((Wt = C == null ? void 0 : C.playToken) == null || Wt.call(C, j.id));
        } }, K = { label: "Make my player and hear it all", run: () => void l.create() }, z = "The first song is free. Nothing to set up yet.";
      } else if (a.step === "intro") {
        const C = oe.phase === "done" && oe.album === h.player.id;
        C && !A.length && A.push(k("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), G = { label: C ? "Keep listening" : "Open album", run: () => void l.create() }, K = { label: "I've used Xtrata Music here before", run: () => void l.unlock(!0) };
      } else a.step === "locked" ? (G = { label: "Open album", run: () => void l.unlock() }, K = { label: "Use a different passkey", run: () => void l.unlock(!0) }) : a.step === "unsupported" ? A.push(k("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : A.length || A.push(k("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: h.mode,
      player: h.player,
      from: h.from,
      offered: h.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: h.mode === "arrive" && a.step === "intro" ? 1 : void 0,
      plays: h.mode === "open" ? a.balance === void 0 ? null : a.giftPlays : void 0,
      playsComing: a.depositPending,
      status: A,
      primary: G,
      secondary: K,
      hint: G ? z : void 0,
      asking: f,
      busy: !!a.busy,
      myPlays: Wn(a),
      topUps: Bc,
      canMake: !!((m = (Ee = a.gate) == null ? void 0 : Ee.gifts) != null && m.admin)
    };
  }
  const bn = document.getElementById("findBox"), ds = document.getElementById("findBody"), Zn = bn && ds ? IL(ds, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((a) => a.ok ? a.json() : Promise.reject(new Error("catalogue unavailable"))).then((a) => EL(a == null ? void 0 : a.tracks, (h, g) => ({ title: tg(h, $n(g.title) ? "" : g.title), artist: Q0(h, g.artist || "") }))),
    play: (a) => {
      var h, g;
      (g = (h = window.XtrataRadio) == null ? void 0 : h.playToken) == null || g.call(h, a);
    },
    current: () => {
      var h, g, f, A;
      const a = Number((A = (f = (g = (h = window.XtrataRadio) == null ? void 0 : h.getState) == null ? void 0 : g.call(h)) == null ? void 0 : f.nowPlaying) == null ? void 0 : A.tokenId);
      return Number.isSafeInteger(a) ? a : null;
    },
    locked: () => {
      var a;
      return !!((a = l.snapshot().albumLock) != null && a.locked);
    },
    explicit: (a) => {
      var h, g;
      return !!((g = (h = window.XtrataRadio) == null ? void 0 : h.isExplicit) != null && g.call(h, a));
    },
    liked: (a) => fs().has(a)
  }) : null;
  bn == null || bn.addEventListener("toggle", () => {
    bn.open && (Zn == null || Zn.load());
  });
  let Wi = "";
  const fs = () => {
    var h, g, f;
    const a = (f = (g = (h = window.XtrataRadio) == null ? void 0 : h.getState) == null ? void 0 : g.call(h)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(a) ? a.map((A) => Number(A == null ? void 0 : A.tokenId)).filter(Number.isSafeInteger) : []);
  }, Zi = () => {
    var h, g, f, A, z;
    if (!Zn || !(bn != null && bn.open)) return;
    const a = `${!!((h = l.snapshot().albumLock) != null && h.locked)}|${((z = (A = (f = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : f.call(g)) == null ? void 0 : A.nowPlaying) == null ? void 0 : z.tokenId) ?? ""}|${[...fs()].sort((G, K) => G - K).join(",")}`;
    a !== Wi && (Wi = a, Zn.refresh());
  }, si = /* @__PURE__ */ new Map();
  let In = !1;
  const Ji = () => {
    const a = window.XtrataRadio;
    return a != null && a.subscribe ? (a.subscribe((h) => {
      const g = h == null ? void 0 : h.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && si.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), Zi(), xc(oe)) {
        const f = !!(h != null && h.playing);
        Ve({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: f, at: Date.now() }), f !== In && (In = f, it(l.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Ji()) {
    const a = setInterval(() => {
      Ji() && clearInterval(a);
    }, 500);
    setTimeout(() => clearInterval(a), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (a) => {
    const h = a.detail;
    if (xc(oe) && Ve({ kind: "listened", at: Date.now() }), h && Number.isSafeInteger(h.song) && typeof h.id == "string" && /^[0-9a-f]{32}$/.test(h.id)) {
      zr();
      const g = Ws(h.song, si.get(h.song));
      l.onListened({ song: h.song, id: h.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void l.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || l.refresh();
  }), setInterval(() => {
    !document.hidden && (t || l.snapshot().step !== "off") && l.refresh();
  }, 15e3), l.refresh();
}
const BL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", ML = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), i = /CriOS/.exec(t.userAgent), o = t.userAgent.includes("Mobile");
  return i ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, NL = () => ML() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, _L = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, PL = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', cb = class {
  constructor(e) {
    sk(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && Ev(e), this.callback(kl(e));
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
    var r, s, i, o, c, l, d, p, u, w;
    return n === "IOS" ? (s = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && s !== void 0 ? s : e.webUrl : t === "Chrome" ? (o = (i = e.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(e)) !== null && o !== void 0 ? o : e.webUrl : t === "Firefox" ? (l = (c = e.mozillaAddOnsUrl) !== null && c !== void 0 ? c : this.getMobileUrl(e)) !== null && l !== void 0 ? l : e.webUrl : n === "Android" ? (p = (d = e.googlePlayStoreUrl) !== null && d !== void 0 ? d : this.getBrowserUrl(e)) !== null && p !== void 0 ? p : e.webUrl : (w = (u = this.getBrowserUrl(e)) !== null && u !== void 0 ? u : e.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(e);
  }
  render() {
    const e = NL(), t = _L(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return De("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, De("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), De("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, De("div", { class: "flex flex-col space-y-[10px]" }, De("div", { class: "flex items-center" }, De("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), De("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, De("span", { class: "sr-only" }, "Close popup"), De("img", { src: BL }))), r ? De("p", null, "Select the wallet you want to connect to.") : De("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && De("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && De("div", { class: "mt-6" }, De("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), De("ul", { class: "space-y-3" }, this.installedProviders.map((i) => De("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, De("div", { class: "aspect-square basis-9 overflow-hidden" }, De("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), De("div", { class: "flex-1" }, De("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && De("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), De("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && De("div", { class: "mt-6" }, r ? De("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : De("div", { class: "mb-5 flex justify-between" }, De("p", { class: "text-sm font-medium" }, "Recommended wallets"), De("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, De("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, De("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), De("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), De("p", null, "What is a wallet? ", De("span", { class: "align-text-bottom text-[9px]" }, "↗")))), De("ul", { class: "space-y-3" }, n.map((i) => De("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, De("div", { class: "aspect-square basis-9 overflow-hidden" }, De("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), De("div", { class: "flex-1" }, De("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && De("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, e, t) && De("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, e, t), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return D4(this);
  }
};
cb.style = PL;
const UL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: cb
}, Symbol.toStringTag, { value: "Module" }));
