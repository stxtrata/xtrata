var nw = Object.defineProperty;
var rw = (t, e, n) => e in t ? nw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var eo = (t, e, n) => rw(t, typeof e != "symbol" ? e + "" : e, n);
var Qe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function u0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function nc(t) {
  if (t.__esModule) return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, i.get ? i : {
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
      typeof Qe < "u" && Qe || {}, r = {
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
      function i(S) {
        return S && DataView.prototype.isPrototypeOf(S);
      }
      if (r.arrayBuffer)
        var s = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], o = ArrayBuffer.isView || function(S) {
          return S && s.indexOf(Object.prototype.toString.call(S)) > -1;
        };
      function a(S) {
        if (typeof S != "string" && (S = String(S)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(S) || S === "")
          throw new TypeError('Invalid character in header field name: "' + S + '"');
        return S.toLowerCase();
      }
      function c(S) {
        return typeof S != "string" && (S = String(S)), S;
      }
      function u(S) {
        var C = {
          next: function() {
            var b = S.shift();
            return { done: b === void 0, value: b };
          }
        };
        return r.iterable && (C[Symbol.iterator] = function() {
          return C;
        }), C;
      }
      function d(S) {
        this.map = {}, S instanceof d ? S.forEach(function(C, b) {
          this.append(b, C);
        }, this) : Array.isArray(S) ? S.forEach(function(C) {
          if (C.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + C.length);
          this.append(C[0], C[1]);
        }, this) : S && Object.getOwnPropertyNames(S).forEach(function(C) {
          this.append(C, S[C]);
        }, this);
      }
      d.prototype.append = function(S, C) {
        S = a(S), C = c(C);
        var b = this.map[S];
        this.map[S] = b ? b + ", " + C : C;
      }, d.prototype.delete = function(S) {
        delete this.map[a(S)];
      }, d.prototype.get = function(S) {
        return S = a(S), this.has(S) ? this.map[S] : null;
      }, d.prototype.has = function(S) {
        return this.map.hasOwnProperty(a(S));
      }, d.prototype.set = function(S, C) {
        this.map[a(S)] = c(C);
      }, d.prototype.forEach = function(S, C) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && S.call(C, this.map[b], b, this);
      }, d.prototype.keys = function() {
        var S = [];
        return this.forEach(function(C, b) {
          S.push(b);
        }), u(S);
      }, d.prototype.values = function() {
        var S = [];
        return this.forEach(function(C) {
          S.push(C);
        }), u(S);
      }, d.prototype.entries = function() {
        var S = [];
        return this.forEach(function(C, b) {
          S.push([b, C]);
        }), u(S);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(S) {
        if (!S._noBody) {
          if (S.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          S.bodyUsed = !0;
        }
      }
      function g(S) {
        return new Promise(function(C, b) {
          S.onload = function() {
            C(S.result);
          }, S.onerror = function() {
            b(S.error);
          };
        });
      }
      function p(S) {
        var C = new FileReader(), b = g(C);
        return C.readAsArrayBuffer(S), b;
      }
      function k(S) {
        var C = new FileReader(), b = g(C), N = /charset=([A-Za-z0-9_-]+)/.exec(S.type), Z = N ? N[1] : "utf-8";
        return C.readAsText(S, Z), b;
      }
      function x(S) {
        for (var C = new Uint8Array(S), b = new Array(C.length), N = 0; N < C.length; N++)
          b[N] = String.fromCharCode(C[N]);
        return b.join("");
      }
      function M(S) {
        if (S.slice)
          return S.slice(0);
        var C = new Uint8Array(S.byteLength);
        return C.set(new Uint8Array(S)), C.buffer;
      }
      function q() {
        return this.bodyUsed = !1, this._initBody = function(S) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = S, S ? typeof S == "string" ? this._bodyText = S : r.blob && Blob.prototype.isPrototypeOf(S) ? this._bodyBlob = S : r.formData && FormData.prototype.isPrototypeOf(S) ? this._bodyFormData = S : r.searchParams && URLSearchParams.prototype.isPrototypeOf(S) ? this._bodyText = S.toString() : r.arrayBuffer && r.blob && i(S) ? (this._bodyArrayBuffer = M(S.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(S) || o(S)) ? this._bodyArrayBuffer = M(S) : this._bodyText = S = Object.prototype.toString.call(S) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof S == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(S) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var S = l(this);
          if (S)
            return S;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var S = l(this);
            return S || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(p);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var S = l(this);
          if (S)
            return S;
          if (this._bodyBlob)
            return k(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(B);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var K = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function $(S) {
        var C = S.toUpperCase();
        return K.indexOf(C) > -1 ? C : S;
      }
      function P(S, C) {
        if (!(this instanceof P))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        C = C || {};
        var b = C.body;
        if (S instanceof P) {
          if (S.bodyUsed)
            throw new TypeError("Already read");
          this.url = S.url, this.credentials = S.credentials, C.headers || (this.headers = new d(S.headers)), this.method = S.method, this.mode = S.mode, this.signal = S.signal, !b && S._bodyInit != null && (b = S._bodyInit, S.bodyUsed = !0);
        } else
          this.url = String(S);
        if (this.credentials = C.credentials || this.credentials || "same-origin", (C.headers || !this.headers) && (this.headers = new d(C.headers)), this.method = $(C.method || this.method || "GET"), this.mode = C.mode || this.mode || null, this.signal = C.signal || this.signal || function() {
          if ("AbortController" in n) {
            var V = new AbortController();
            return V.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && b)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(b), (this.method === "GET" || this.method === "HEAD") && (C.cache === "no-store" || C.cache === "no-cache")) {
          var N = /([?&])_=[^&]*/;
          if (N.test(this.url))
            this.url = this.url.replace(N, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Z = /\?/;
            this.url += (Z.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      P.prototype.clone = function() {
        return new P(this, { body: this._bodyInit });
      };
      function B(S) {
        var C = new FormData();
        return S.trim().split("&").forEach(function(b) {
          if (b) {
            var N = b.split("="), Z = N.shift().replace(/\+/g, " "), V = N.join("=").replace(/\+/g, " ");
            C.append(decodeURIComponent(Z), decodeURIComponent(V));
          }
        }), C;
      }
      function A(S) {
        var C = new d(), b = S.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(N) {
          return N.indexOf(`
`) === 0 ? N.substr(1, N.length) : N;
        }).forEach(function(N) {
          var Z = N.split(":"), V = Z.shift().trim();
          if (V) {
            var ut = Z.join(":").trim();
            try {
              C.append(V, ut);
            } catch (it) {
              console.warn("Response " + it.message);
            }
          }
        }), C;
      }
      q.call(P.prototype);
      function U(S, C) {
        if (!(this instanceof U))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (C || (C = {}), this.type = "default", this.status = C.status === void 0 ? 200 : C.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = C.statusText === void 0 ? "" : "" + C.statusText, this.headers = new d(C.headers), this.url = C.url || "", this._initBody(S);
      }
      q.call(U.prototype), U.prototype.clone = function() {
        return new U(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, U.error = function() {
        var S = new U(null, { status: 200, statusText: "" });
        return S.ok = !1, S.status = 0, S.type = "error", S;
      };
      var _ = [301, 302, 303, 307, 308];
      U.redirect = function(S, C) {
        if (_.indexOf(C) === -1)
          throw new RangeError("Invalid status code");
        return new U(null, { status: C, headers: { location: S } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(C, b) {
          this.message = C, this.name = b;
          var N = Error(C);
          this.stack = N.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function L(S, C) {
        return new Promise(function(b, N) {
          var Z = new P(S, C);
          if (Z.signal && Z.signal.aborted)
            return N(new e.DOMException("Aborted", "AbortError"));
          var V = new XMLHttpRequest();
          function ut() {
            V.abort();
          }
          V.onload = function() {
            var E = {
              statusText: V.statusText,
              headers: A(V.getAllResponseHeaders() || "")
            };
            Z.url.indexOf("file://") === 0 && (V.status < 200 || V.status > 599) ? E.status = 200 : E.status = V.status, E.url = "responseURL" in V ? V.responseURL : E.headers.get("X-Request-URL");
            var O = "response" in V ? V.response : V.responseText;
            setTimeout(function() {
              b(new U(O, E));
            }, 0);
          }, V.onerror = function() {
            setTimeout(function() {
              N(new TypeError("Network request failed"));
            }, 0);
          }, V.ontimeout = function() {
            setTimeout(function() {
              N(new TypeError("Network request timed out"));
            }, 0);
          }, V.onabort = function() {
            setTimeout(function() {
              N(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function it(E) {
            try {
              return E === "" && n.location.href ? n.location.href : E;
            } catch {
              return E;
            }
          }
          if (V.open(Z.method, it(Z.url), !0), Z.credentials === "include" ? V.withCredentials = !0 : Z.credentials === "omit" && (V.withCredentials = !1), "responseType" in V && (r.blob ? V.responseType = "blob" : r.arrayBuffer && (V.responseType = "arraybuffer")), C && typeof C.headers == "object" && !(C.headers instanceof d || n.Headers && C.headers instanceof n.Headers)) {
            var de = [];
            Object.getOwnPropertyNames(C.headers).forEach(function(E) {
              de.push(a(E)), V.setRequestHeader(E, c(C.headers[E]));
            }), Z.headers.forEach(function(E, O) {
              de.indexOf(O) === -1 && V.setRequestHeader(O, E);
            });
          } else
            Z.headers.forEach(function(E, O) {
              V.setRequestHeader(O, E);
            });
          Z.signal && (Z.signal.addEventListener("abort", ut), V.onreadystatechange = function() {
            V.readyState === 4 && Z.signal.removeEventListener("abort", ut);
          }), V.send(typeof Z._bodyInit > "u" ? null : Z._bodyInit);
        });
      }
      return L.polyfill = !0, n.fetch || (n.fetch = L, n.Headers = d, n.Request = P, n.Response = U), e.Headers = d, e.Request = P, e.Response = U, e.fetch = L, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Qe);
})();
const sw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function iw(t, e) {
  const n = {};
  return Object.assign(n, sw, e), await fetch(t, n);
}
function ow(t) {
  let e = iw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function aw(...t) {
  const { fetchLib: e, middlewares: n } = ow(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
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
var Li;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Li || (Li = {}));
var Ns;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ns || (Ns = {}));
var Mf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Mf || (Mf = {}));
const cw = "https://api.mainnet.hiro.so", lw = "https://api.testnet.hiro.so", uw = "http://localhost:3999", fw = ["mainnet", "testnet", "devnet", "mocknet"];
let Ci = class {
  constructor(e) {
    this.version = Ns.Mainnet, this.chainId = Li.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ns.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? aw();
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
Ci.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ul();
    case "testnet":
      return new dw();
    case "devnet":
      return new hw();
    case "mocknet":
      return new f0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${fw.join(", ")}`);
  }
};
Ci.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ci.fromName(t);
let ul = class extends Ci {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Mainnet, this.chainId = Li.Mainnet;
  }
}, dw = class extends Ci {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Testnet, this.chainId = Li.Testnet;
  }
}, f0 = class extends Ci {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? uw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Testnet, this.chainId = Li.Testnet;
  }
};
const hw = f0, d0 = "xtrata.wallet.bridge.v1", pw = (t) => typeof t == "object" && t !== null && t.protocol === d0, gw = (t) => pw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", yw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class no extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Nf = 12e4;
class ww {
  constructor(e) {
    eo(this, "pending", /* @__PURE__ */ new Map());
    eo(this, "listenTarget");
    eo(this, "closed", !1);
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
    eo(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !gw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new no("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new no("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new no("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = yw(), s = { protocol: d0, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new no(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Nf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Nf);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new no("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const bw = ["SP", "SM"], mw = ["ST", "SN"], xw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return bw.includes(n) ? "mainnet" : mw.includes(n) ? "testnet" : null;
}, Sw = () => {
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
}, Ew = () => typeof window > "u" || !window.localStorage ? Sw() : window.localStorage, Pc = "xtrata.v15.1.wallet.session", Pf = "mainnet", La = { isConnected: !1 }, Aw = (t) => t.address ? xw(t.address) ?? t.network : t.network, h0 = (t) => !t.isConnected || !t.address ? { ...La } : Aw(t) !== Pf ? { ...La } : {
  isConnected: !0,
  address: t.address,
  network: Pf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, vw = (t) => {
  if (!t)
    return { ...La };
  try {
    const e = JSON.parse(t);
    return h0(e);
  } catch {
    return { ...La };
  }
}, $w = (t) => {
  const e = h0(t);
  return JSON.stringify(e);
}, kw = (t) => {
  const e = Ew();
  return {
    load: () => vw(e.getItem(Pc)),
    save: (n) => {
      e.setItem(Pc, $w(n));
    },
    clear: () => {
      e.removeItem(Pc);
    }
  };
}, Iw = "https://browser.blockstack.org/auth", Lw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, p0 = ["store_write"], Cw = "blockstack-session", Tw = {
  logLevel: "debug"
}, Zs = {
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
Object.freeze(Zs);
class Vi extends Error {
  constructor(e) {
    super();
    let n = e.message, r = `Error Code: ${e.code}`, i = this.stack;
    if (i)
      r += `Stack Trace:
${i}`;
    else
      try {
        throw new Error();
      } catch (s) {
        i = s.stack;
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
class Bw extends Vi {
  constructor(e, n = "") {
    super({ code: Zs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class _f extends Vi {
  constructor(e = "") {
    super({ code: Zs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class jo extends Vi {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Zs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Uf extends Vi {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Zs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class fl extends Vi {
  constructor(e) {
    super({ code: Zs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class g0 extends Vi {
  constructor(e) {
    super({ code: Zs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Hf = ["debug", "info", "warn", "error", "none"], dl = {};
for (let t = 0; t < Hf.length; t++) {
  const e = Hf[t];
  dl[e] = t;
}
class Si {
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
    return dl[Tw.logLevel] <= dl[e];
  }
}
function Mw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Nw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function _c(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((i) => parseInt(i, 10)), r = e.split(".").map((i) => parseInt(i, 10));
  for (let i = 0; i < e.length; i++)
    if (i >= t.length && r.push(0), n[i] < r[i])
      return !1;
  return !0;
}
function Pw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function _w() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Uw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function gu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = _w(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    Si.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = Uw(i, t.toString(), n);
    throw Si.error(s), new Error(s);
  }
  if (r)
    return {};
}
function ps(t, e) {
  return yu(qe(t), e);
}
function qe(t) {
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
  if (cn(t, Uint8Array))
    return BigInt(`0x${dt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Hw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Of(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function To(t, e = 8) {
  return (typeof t == "bigint" ? t : qe(t)).toString(16).padStart(e * 2, "0");
}
function rc(t) {
  return parseInt(t, 16);
}
function yu(t, e = 16) {
  const n = To(t, e);
  return Ut(n);
}
function Ow(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Dw(t, e) {
  return t & BigInt(1) << e;
}
function hl(t) {
  return Fw(BigInt(`0x${dt(t)}`), BigInt(t.byteLength * 8));
}
function Fw(t, e) {
  return Dw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const jw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function dt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += jw[n];
  return e;
}
function Ut(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Hw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function Qs(t) {
  return new TextEncoder().encode(t);
}
function Bo(t) {
  return new TextDecoder().decode(t);
}
function zw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Rw(t) {
  return String.fromCharCode.apply(null, t);
}
function Gw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Df(t) {
  if (t.some(Gw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function sr(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function Ee(t) {
  return sr(...t.map((e) => typeof e == "number" ? Df([e]) : e instanceof Array ? Df(e) : e));
}
function cn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const y0 = "https://api.mainnet.hiro.so", w0 = "https://api.testnet.hiro.so", b0 = "http://localhost:3999", Kw = "https://hub.blockstack.org", Vw = 33, Uc = 32;
function qw(t) {
  if (t.length < Uc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Uc * 2), r = t.slice(2 + Uc * 2);
  return {
    recoveryId: rc(e),
    r: n,
    s: r
  };
}
function wu(t) {
  const e = typeof t == "string" ? Ut(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Ww(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Xw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Yw(t, e) {
  return t[e];
}
function Zw(t, e, n = 0) {
  return t[n] = e, t;
}
function Qw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ps(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Jw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function tb(t, e) {
  const n = {};
  return Object.assign(n, Jw, e), await fetch(t, n);
}
function eb(t) {
  let e = tb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function nb(...t) {
  const { fetchLib: e, middlewares: n } = eb(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
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
class m0 {
  constructor(e = p0.slice(), n = ((a) => (a = gu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = Iw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function rb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function x0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function sb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pl(t.outputLen), pl(t.blockLen);
}
function ib(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ob(t, e) {
  x0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Es = {
  number: pl,
  bool: rb,
  bytes: x0,
  hash: sb,
  exists: ib,
  output: ob
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Kn = (t, e) => t << 32 - e | t >>> e, ab = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ab)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function bu(t) {
  if (typeof t == "string" && (t = cb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let S0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Js(t) {
  const e = (r) => t().update(bu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let E0 = class extends S0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Es.hash(e);
    const r = bu(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return Es.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Es.exists(this), Es.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const sc = (t, e, n) => new E0(t, e).update(n).digest();
sc.create = (t, e) => new E0(t, e);
function lb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let mu = class extends S0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hc(this.buffer);
  }
  update(e) {
    Es.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = bu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Hc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Es.exists(this), Es.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    lb(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Hc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const ub = (t, e, n) => t & e ^ ~t & n, fb = (t, e, n) => t & e ^ t & n ^ e & n, db = new Uint32Array([
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
]), Hr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Or = new Uint32Array(64);
let A0 = class extends mu {
  constructor() {
    super(64, 32, 8, !1), this.A = Hr[0] | 0, this.B = Hr[1] | 0, this.C = Hr[2] | 0, this.D = Hr[3] | 0, this.E = Hr[4] | 0, this.F = Hr[5] | 0, this.G = Hr[6] | 0, this.H = Hr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Or[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Or[l - 15], p = Or[l - 2], k = Kn(g, 7) ^ Kn(g, 18) ^ g >>> 3, x = Kn(p, 17) ^ Kn(p, 19) ^ p >>> 10;
      Or[l] = x + Or[l - 7] + k + Or[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Kn(a, 6) ^ Kn(a, 11) ^ Kn(a, 25), p = d + g + ub(a, c, u) + db[l] + Or[l] | 0, x = (Kn(r, 2) ^ Kn(r, 13) ^ Kn(r, 22)) + fb(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Or.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, hb = class extends A0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ti = Js(() => new A0());
Js(() => new hb());
const pb = {}, v0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const _t = BigInt(0), oe = BigInt(1), ls = BigInt(2), uo = BigInt(3), Ff = BigInt(8), Vt = Object.freeze({
  a: _t,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: oe,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), jf = (t, e) => (t + e / ls) / e, zo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Vt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -oe * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = jf(s * t, e), c = jf(-r * t, e);
    let u = tt(t - a * n - c * i, e), d = tt(-a * r - c * s, e);
    const l = u > o, g = d > o;
    if (l && (u = e - u), g && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: d };
  }
}, Fn = 32, _s = 32, $0 = 32, Ca = Fn + 1, Ta = 2 * Fn + 1;
function zf(t) {
  const { a: e, b: n } = Vt, r = tt(t * t), i = tt(r * t);
  return tt(i + e * t + n);
}
const Ro = Vt.a === _t;
class xu extends Error {
  constructor(e) {
    super(e);
  }
}
function Rf(t) {
  if (!(t instanceof Dt))
    throw new TypeError("JacobianPoint expected");
}
class Dt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Tt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Tt.ZERO) ? Dt.ZERO : new Dt(e.x, e.y, oe);
  }
  static toAffineBatch(e) {
    const n = mb(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return Dt.toAffineBatch(e).map(Dt.fromAffine);
  }
  equals(e) {
    Rf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = tt(i * i), u = tt(a * a), d = tt(n * u), l = tt(s * c), g = tt(tt(r * a) * u), p = tt(tt(o * i) * c);
    return d === l && g === p;
  }
  negate() {
    return new Dt(this.x, tt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = tt(e * e), s = tt(n * n), o = tt(s * s), a = e + s, c = tt(ls * (tt(a * a) - i - o)), u = tt(uo * i), d = tt(u * u), l = tt(d - ls * c), g = tt(u * (c - l) - Ff * o), p = tt(ls * n * r);
    return new Dt(l, g, p);
  }
  add(e) {
    Rf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === _t || o === _t)
      return this;
    if (n === _t || r === _t)
      return e;
    const c = tt(i * i), u = tt(a * a), d = tt(n * u), l = tt(s * c), g = tt(tt(r * a) * u), p = tt(tt(o * i) * c), k = tt(l - d), x = tt(p - g);
    if (k === _t)
      return x === _t ? this.double() : Dt.ZERO;
    const M = tt(k * k), q = tt(k * M), K = tt(d * M), $ = tt(x * x - q - ls * K), P = tt(x * (K - $) - g * q), B = tt(i * a * k);
    return new Dt($, P, B);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Dt.ZERO;
    if (typeof e == "bigint" && e === _t)
      return n;
    let r = Vf(e);
    if (r === oe)
      return this;
    if (!Ro) {
      let l = n, g = this;
      for (; r > _t; )
        r & oe && (l = l.add(g)), g = g.double(), r >>= oe;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = zo.splitScalar(r), c = n, u = n, d = this;
    for (; s > _t || a > _t; )
      s & oe && (c = c.add(d)), a & oe && (u = u.add(d)), d = d.double(), s >>= oe, a >>= oe;
    return i && (c = c.negate()), o && (u = u.negate()), u = new Dt(tt(u.x * zo.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Ro ? 128 / e + 1 : 256 / e + 1, r = [];
    let i = this, s = i;
    for (let o = 0; o < n; o++) {
      s = i, r.push(s);
      for (let a = 1; a < 2 ** (e - 1); a++)
        s = s.add(i), r.push(s);
      i = s.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(Dt.BASE) && (n = Tt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && gl.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = Dt.normalizeZ(i), gl.set(n, i)));
    let s = Dt.ZERO, o = Dt.BASE;
    const a = 1 + (Ro ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const p = g * c;
      let k = Number(e & u);
      e >>= l, k > c && (k -= d, e += oe);
      const x = p, M = p + Math.abs(k) - 1, q = g % 2 !== 0, K = k < 0;
      k === 0 ? o = o.add(Go(q, i[x])) : s = s.add(Go(K, i[M]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = Vf(e), i, s;
    if (Ro) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = zo.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: p } = this.wNAF(u, n);
      d = Go(o, d), g = Go(c, g), g = new Dt(tt(g.x * zo.beta), g.y, g.z), i = d.add(g), s = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return Dt.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(Dt.ZERO);
    e == null && (e = s ? Ff : qi(i));
    const o = e, a = tt(o * o), c = tt(a * o), u = tt(n * a), d = tt(r * c), l = tt(i * o);
    if (s)
      return Tt.ZERO;
    if (l !== oe)
      throw new Error("invZ was invalid");
    return new Tt(u, d);
  }
}
Dt.BASE = new Dt(Vt.Gx, Vt.Gy, oe);
Dt.ZERO = new Dt(_t, oe, _t);
function Go(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const gl = /* @__PURE__ */ new WeakMap();
class Tt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, gl.delete(this);
  }
  hasEvenY() {
    return this.y % ls === _t;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = xn(n ? e : e.subarray(1));
    if (!ma(r))
      throw new Error("Point is not on curve");
    const i = zf(r);
    let s = bb(i);
    const o = (s & oe) === oe;
    n ? o && (s = tt(-s)) : (e[0] & 1) === 1 !== o && (s = tt(-s));
    const a = new Tt(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = xn(e.subarray(1, Fn + 1)), r = xn(e.subarray(Fn + 1, Fn * 2 + 1)), i = new Tt(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = ir(e), r = n.length, i = n[0];
    if (r === Fn)
      return this.fromCompressedHex(n);
    if (r === Ca && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === Ta && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ca} compressed bytes or ${Ta} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Tt.BASE.multiply(Us(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = L0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Su(ir(e)), { n: a } = Vt, c = r === 2 || r === 3 ? i + a : i, u = qi(c, a), d = tt(-o * u, a), l = tt(s * u, a), g = r & 1 ? "03" : "02", p = Tt.fromHex(g + us(c)), k = Tt.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!k)
      throw new Error("Cannot recover signature: point at infinify");
    return k.assertValidity(), k;
  }
  toRawBytes(e = !1) {
    return fs(this.toHex(e));
  }
  toHex(e = !1) {
    const n = us(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${us(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ma(n) || !ma(r))
      throw new Error(e);
    const i = tt(r * r), s = zf(n);
    if (tt(i - s) !== _t)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Tt(this.x, tt(-this.y));
  }
  double() {
    return Dt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Dt.fromAffine(this).add(Dt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Dt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const i = Dt.fromAffine(this), s = n === _t || n === oe || this !== Tt.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Dt.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(Dt.ZERO) ? void 0 : a.toAffine();
  }
}
Tt.BASE = new Tt(Vt.Gx, Vt.Gy);
Tt.ZERO = new Tt(_t, _t);
function Gf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Kf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Bi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: xn(n), left: t.subarray(e + 2) };
}
function gb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Bi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Kf(t.subarray(2)), { data: r, left: i } = Kf(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Bi(i)}`);
  return { r: e, s: r };
}
class mn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? Bi(e) : e;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new mn(Ba(i.slice(0, 64)), Ba(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = gb(n ? e : fs(e));
    return new mn(r, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ni(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ni(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Vt.n >> oe;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new mn(this.r, tt(-this.s, Vt.n)) : this;
  }
  toDERRawBytes() {
    return fs(this.toDERHex());
  }
  toDERHex() {
    const e = Gf(ro(this.s)), n = Gf(ro(this.r)), r = e.length / 2, i = n.length / 2, s = ro(r), o = ro(i);
    return `30${ro(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return fs(this.toCompactHex());
  }
  toCompactHex() {
    return us(this.r) + us(this.s);
  }
}
function as(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
const yb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Bi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += yb[t[n]];
  return e;
}
const wb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function us(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(_t <= t && t < wb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Mi(t) {
  const e = fs(us(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ro(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ba(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function fs(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function xn(t) {
  return Ba(Bi(t));
}
function ir(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : fs(t);
}
function Vf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ni(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function tt(t, e = Vt.P) {
  const n = t % e;
  return n >= _t ? n : e + n;
}
function kn(t, e) {
  const { P: n } = Vt;
  let r = t;
  for (; e-- > _t; )
    r *= r, r %= n;
  return r;
}
function bb(t) {
  const { P: e } = Vt, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = kn(u, uo) * u % e, l = kn(d, uo) * u % e, g = kn(l, ls) * c % e, p = kn(g, r) * g % e, k = kn(p, i) * p % e, x = kn(k, o) * k % e, M = kn(x, a) * x % e, q = kn(M, o) * k % e, K = kn(q, uo) * u % e, $ = kn(K, s) * p % e, P = kn($, n) * c % e, B = kn(P, ls);
  if (B * B % e !== t)
    throw new Error("Cannot find square root");
  return B;
}
function qi(t, e = Vt.P) {
  if (t === _t || e <= _t)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = tt(t, e), r = e, i = _t, s = oe;
  for (; n !== _t; ) {
    const a = r / n, c = r % n, u = i - s * a;
    r = n, n = c, i = s, s = u;
  }
  if (r !== oe)
    throw new Error("invert: does not exist");
  return tt(i, e);
}
function mb(t, e = Vt.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === _t ? s : (n[a] = s, tt(s * o, e)), oe), i = qi(r, e);
  return t.reduceRight((s, o, a) => o === _t ? s : (n[a] = tt(s * n[a], e), tt(s * o, e)), i), n;
}
function xb(t) {
  const e = t.length * 8 - _s * 8, n = xn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Su(t, e = !1) {
  const n = xb(t);
  if (e)
    return n;
  const { n: r } = Vt;
  return n >= r ? n - r : n;
}
let ki, fo;
class k0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return me.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return fo(this.k, ...e);
  }
  checkSync() {
    if (typeof fo != "function")
      throw new xu("hmacSha256Sync needs to be set");
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
    return as(...n);
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
    return as(...n);
  }
}
function Ni(t) {
  return _t < t && t < Vt.n;
}
function ma(t) {
  return _t < t && t < Vt.P;
}
function I0(t, e, n, r = !0) {
  const { n: i } = Vt, s = Su(t, !0);
  if (!Ni(s))
    return;
  const o = qi(s, i), a = Tt.BASE.multiply(s), c = tt(a.x, i);
  if (c === _t)
    return;
  const u = tt(o * tt(e + n * c, i), i);
  if (u === _t)
    return;
  let d = new mn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & oe);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Us(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * _s)
      throw new Error("Expected 32 bytes of private key");
    e = Ba(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== _s)
      throw new Error("Expected 32 bytes of private key");
    e = xn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ni(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Eu(t) {
  return t instanceof Tt ? (t.assertValidity(), t) : Tt.fromHex(t);
}
function L0(t) {
  if (t instanceof mn)
    return t.assertValidity(), t;
  try {
    return mn.fromDER(t);
  } catch {
    return mn.fromCompact(t);
  }
}
function Mo(t, e = !1) {
  return Tt.fromPrivateKey(t).toRawBytes(e);
}
function Sb(t, e, n, r = !1) {
  return Tt.fromSignature(t, e, n).toRawBytes(r);
}
function qf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ca || r === Ta : n ? r === Ca * 2 || r === Ta * 2 : t instanceof Tt;
}
function Au(t, e, n = !1) {
  if (qf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!qf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Eu(e);
  return r.assertValidity(), r.multiply(Us(t)).toRawBytes(n);
}
function C0(t) {
  const e = t.length > Fn ? t.slice(0, Fn) : t;
  return xn(e);
}
function Eb(t) {
  const e = C0(t), n = tt(e, Vt.n);
  return T0(n < _t ? e : n);
}
function T0(t) {
  return Mi(t);
}
function B0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = ir(t), i = Us(e), s = [T0(i), Eb(r)];
  if (n != null) {
    n === !0 && (n = me.randomBytes(Fn));
    const c = ir(n);
    if (c.length !== Fn)
      throw new Error(`sign: Expected ${Fn} bytes of extra data`);
    s.push(c);
  }
  const o = as(...s), a = C0(r);
  return { seed: o, m: a, d: i };
}
function M0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function Ab(t, e, n = {}) {
  const { seed: r, m: i, d: s } = B0(t, e, n.extraEntropy), o = new k0($0, _s);
  await o.reseed(r);
  let a;
  for (; !(a = I0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return M0(a, n);
}
function ic(t, e, n = {}) {
  const { seed: r, m: i, d: s } = B0(t, e, n.extraEntropy), o = new k0($0, _s);
  o.reseedSync(r);
  let a;
  for (; !(a = I0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return M0(a, n);
}
const vb = { strict: !0 };
function $b(t, e, n, r = vb) {
  let i;
  try {
    i = L0(t), e = ir(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = Su(e);
  let c;
  try {
    c = Eu(n);
  } catch {
    return !1;
  }
  const { n: u } = Vt, d = qi(o, u), l = tt(a * d, u), g = tt(s * d, u), p = Tt.BASE.multiplyAndAddUnsafe(c, l, g);
  return p ? tt(p.x, u) === s : !1;
}
function Ma(t) {
  return tt(xn(t), Vt.n);
}
class Pi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = ir(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = xn(n.subarray(0, 32)), i = xn(n.subarray(32, 64));
    return new Pi(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ma(e) || !Ni(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return us(this.r) + us(this.s);
  }
  toRawBytes() {
    return fs(this.toHex());
  }
}
function kb(t) {
  return Tt.fromPrivateKey(t).toRawX();
}
class N0 {
  constructor(e, n, r = me.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = ir(e);
    const { x: i, scalar: s } = this.getScalar(Us(n));
    if (this.px = i, this.d = s, this.rand = ir(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Tt.fromPrivateKey(e), r = n.hasEvenY() ? e : Vt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Mi(e ^ xn(n));
  }
  finalizeNonce(e) {
    const n = tt(xn(e), Vt.n);
    if (n === _t)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: i, scalar: s } = this.getScalar(n);
    return { R: r, rx: i, k: s };
  }
  finalizeSig(e, n, r, i) {
    return new Pi(e.x, tt(n + r * i, Vt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: i } = this, s = me.taggedHash, o = this.initNonce(n, await s(os.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(os.nonce, o, r, e)), d = Ma(await s(os.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await U0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = me.taggedHashSync, o = this.initNonce(n, s(os.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(s(os.nonce, o, r, e)), d = Ma(s(os.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return H0(l, e, r) || this.error(), l;
  }
}
async function Ib(t, e, n) {
  return new N0(t, e, n).calc();
}
function Lb(t, e, n) {
  return new N0(t, e, n).calcSync();
}
function P0(t, e, n) {
  const r = t instanceof Pi, i = r ? t : Pi.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: ir(e),
    P: Eu(n)
  };
}
function _0(t, e, n, r) {
  const i = Tt.BASE.multiplyAndAddUnsafe(e, Us(n), tt(-r, Vt.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function U0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = P0(t, e, n), a = Ma(await me.taggedHash(os.challenge, Mi(r), o.toRawX(), s));
    return _0(r, o, i, a);
  } catch {
    return !1;
  }
}
function H0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = P0(t, e, n), a = Ma(me.taggedHashSync(os.challenge, Mi(r), o.toRawX(), s));
    return _0(r, o, i, a);
  } catch (r) {
    if (r instanceof xu)
      throw r;
    return !1;
  }
}
const Cb = {
  Signature: Pi,
  getPublicKey: kb,
  sign: Ib,
  verify: U0,
  signSync: Lb,
  verifySync: H0
};
Tt.BASE._setWindowSize(8);
const dn = {
  node: v0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, os = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ko = {}, me = {
  bytesToHex: Bi,
  hexToBytes: fs,
  concatBytes: as,
  mod: tt,
  invert: qi,
  isValidPrivateKey(t) {
    try {
      return Us(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Mi,
  _normalizePrivateKey: Us,
  hashToPrivateKey: (t) => {
    t = ir(t);
    const e = _s + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = tt(xn(t), Vt.n - oe) + oe;
    return Mi(n);
  },
  randomBytes: (t = 32) => {
    if (dn.web)
      return dn.web.getRandomValues(new Uint8Array(t));
    if (dn.node) {
      const { randomBytes: e } = dn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => me.hashToPrivateKey(me.randomBytes(_s + 8)),
  precompute(t = 8, e = Tt.BASE) {
    const n = e === Tt.BASE ? e : new Tt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(uo), n;
  },
  sha256: async (...t) => {
    if (dn.web) {
      const e = await dn.web.subtle.digest("SHA-256", as(...t));
      return new Uint8Array(e);
    } else if (dn.node) {
      const { createHash: e } = dn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (dn.web) {
      const n = await dn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = as(...e), i = await dn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (dn.node) {
      const { createHmac: n } = dn.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ko[t];
    if (n === void 0) {
      const r = await me.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = as(r, r), Ko[t] = n;
    }
    return me.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ki != "function")
      throw new xu("sha256Sync is undefined, you need to set it");
    let n = Ko[t];
    if (n === void 0) {
      const r = ki(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = as(r, r), Ko[t] = n;
    }
    return ki(n, ...e);
  },
  _JacobianPoint: Dt
};
Object.defineProperties(me, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ki;
    },
    set(t) {
      ki || (ki = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return fo;
    },
    set(t) {
      fo || (fo = t);
    }
  }
});
const Tb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Vt,
  Point: Tt,
  Signature: mn,
  getPublicKey: Mo,
  getSharedSecret: Au,
  recoverPublicKey: Sb,
  schnorr: Cb,
  sign: Ab,
  signSync: ic,
  utils: me,
  verify: $b
}, Symbol.toStringTag, { value: "Module" }));
var No = {};
No.byteLength = _b;
var Bb = No.toByteArray = Hb, Mb = No.fromByteArray = Fb, Zn = [], Ln = [], Nb = typeof Uint8Array < "u" ? Uint8Array : Array, Oc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var gi = 0, Pb = Oc.length; gi < Pb; ++gi)
  Zn[gi] = Oc[gi], Ln[Oc.charCodeAt(gi)] = gi;
Ln[45] = 62;
Ln[95] = 63;
function O0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function _b(t) {
  var e = O0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Ub(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Hb(t) {
  var e, n = O0(t), r = n[0], i = n[1], s = new Nb(Ub(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Ln[t.charCodeAt(c)] << 18 | Ln[t.charCodeAt(c + 1)] << 12 | Ln[t.charCodeAt(c + 2)] << 6 | Ln[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = Ln[t.charCodeAt(c)] << 2 | Ln[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = Ln[t.charCodeAt(c)] << 10 | Ln[t.charCodeAt(c + 1)] << 4 | Ln[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Ob(t) {
  return Zn[t >> 18 & 63] + Zn[t >> 12 & 63] + Zn[t >> 6 & 63] + Zn[t & 63];
}
function Db(t, e, n) {
  for (var r, i = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), i.push(Ob(r));
  return i.join("");
}
function Fb(t) {
  for (var e, n = t.length, r = n % 3, i = [], s = 16383, o = 0, a = n - r; o < a; o += s)
    i.push(Db(t, o, o + s > a ? a : o + s));
  return r === 1 ? (e = t[n - 1], i.push(
    Zn[e >> 2] + Zn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    Zn[e >> 10] + Zn[e >> 4 & 63] + Zn[e << 2 & 63] + "="
  )), i.join("");
}
function jb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const zb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Rb() {
  if (jb())
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
    throw new Error(zb);
  }
}
class Gb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), o = new Uint8Array(sr(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(sr(s.update(i), s.final()));
    return Promise.resolve(o);
  }
}
class Kb {
  constructor(e) {
    this.subtleCrypto = e;
  }
  async encrypt(e, n, r, i) {
    let s, o;
    if (e === "aes-128-cbc")
      s = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      s = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: o }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: s, iv: r }, a, i);
    return new Uint8Array(c);
  }
  async decrypt(e, n, r, i) {
    let s, o;
    if (e === "aes-128-cbc")
      s = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      s = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: o }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: s, iv: r }, a, i);
    return new Uint8Array(c);
  }
}
async function D0() {
  const t = await Rb();
  return t.name === "subtleCrypto" ? new Kb(t.lib) : new Gb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Vb(t) {
  if (t.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
    e[n] = 255;
  for (var r = 0; r < t.length; r++) {
    var i = t.charAt(r), s = i.charCodeAt(0);
    if (e[s] !== 255)
      throw new TypeError(i + " is ambiguous");
    e[s] = r;
  }
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), u = Math.log(256) / Math.log(o);
  function d(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var k = 0, x = 0, M = 0, q = p.length; M !== q && p[M] === 0; )
      M++, k++;
    for (var K = (q - M) * u + 1 >>> 0, $ = new Uint8Array(K); M !== q; ) {
      for (var P = p[M], B = 0, A = K - 1; (P !== 0 || B < x) && A !== -1; A--, B++)
        P += 256 * $[A] >>> 0, $[A] = P % o >>> 0, P = P / o >>> 0;
      if (P !== 0)
        throw new Error("Non-zero carry");
      x = B, M++;
    }
    for (var U = K - x; U !== K && $[U] === 0; )
      U++;
    for (var _ = a.repeat(k); U < K; ++U)
      _ += t.charAt($[U]);
    return _;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var k = 0, x = 0, M = 0; p[k] === a; )
      x++, k++;
    for (var q = (p.length - k) * c + 1 >>> 0, K = new Uint8Array(q); p[k]; ) {
      var $ = p.charCodeAt(k);
      if ($ > 255)
        return;
      var P = e[$];
      if (P === 255)
        return;
      for (var B = 0, A = q - 1; (P !== 0 || B < M) && A !== -1; A--, B++)
        P += o * K[A] >>> 0, K[A] = P % 256 >>> 0, P = P / 256 >>> 0;
      if (P !== 0)
        throw new Error("Non-zero carry");
      M = B, k++;
    }
    for (var U = q - M; U !== q && K[U] === 0; )
      U++;
    for (var _ = new Uint8Array(x + (q - U)), L = x; U !== q; )
      _[L++] = K[U++];
    return _;
  }
  function g(p) {
    var k = l(p);
    if (k)
      return k;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var F0 = Vb;
const qb = F0, Wb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Xb = qb(Wb);
const Yb = /* @__PURE__ */ u0(Xb), Zb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), j0 = Uint8Array.from({ length: 16 }, (t, e) => e), Qb = j0.map((t) => (9 * t + 5) % 16);
let vu = [j0], $u = [Qb];
for (let t = 0; t < 4; t++)
  for (let e of [vu, $u])
    e.push(e[t].map((n) => Zb[n]));
const z0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Jb = vu.map((t, e) => t.map((n) => z0[e][n])), tm = $u.map((t, e) => t.map((n) => z0[e][n])), em = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), nm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vo = (t, e) => t << e | t >>> 32 - e;
function Wf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qo = new Uint32Array(16);
let rm = class extends mu {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      qo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const k = 4 - p, x = em[p], M = nm[p], q = vu[p], K = $u[p], $ = Jb[p], P = tm[p];
      for (let B = 0; B < 16; B++) {
        const A = Vo(r + Wf(p, s, a, u) + qo[q[B]] + x, $[B]) + l | 0;
        r = l, l = u, u = Vo(a, 10) | 0, a = s, s = A;
      }
      for (let B = 0; B < 16; B++) {
        const A = Vo(i + Wf(k, o, c, d) + qo[K[B]] + M, P[B]) + g | 0;
        i = g, g = d, d = Vo(c, 10) | 0, c = o, o = A;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    qo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const sm = Js(() => new rm());
function im(t) {
  return sm(t);
}
const Wo = BigInt(2 ** 32 - 1), yl = BigInt(32);
function R0(t, e = !1) {
  return e ? { h: Number(t & Wo), l: Number(t >> yl & Wo) } : { h: Number(t >> yl & Wo) | 0, l: Number(t & Wo) | 0 };
}
function om(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = R0(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const am = (t, e) => BigInt(t >>> 0) << yl | BigInt(e >>> 0), cm = (t, e, n) => t >>> n, lm = (t, e, n) => t << 32 - n | e >>> n, um = (t, e, n) => t >>> n | e << 32 - n, fm = (t, e, n) => t << 32 - n | e >>> n, dm = (t, e, n) => t << 64 - n | e >>> n - 32, hm = (t, e, n) => t >>> n - 32 | e << 64 - n, pm = (t, e) => e, gm = (t, e) => t, ym = (t, e, n) => t << n | e >>> 32 - n, wm = (t, e, n) => e << n | t >>> 32 - n, bm = (t, e, n) => e << n - 32 | t >>> 64 - n, mm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function xm(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Sm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Em = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Am = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), vm = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, $m = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), km = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Et = {
  fromBig: R0,
  split: om,
  toBig: am,
  shrSH: cm,
  shrSL: lm,
  rotrSH: um,
  rotrSL: fm,
  rotrBH: dm,
  rotrBL: hm,
  rotr32H: pm,
  rotr32L: gm,
  rotlSH: ym,
  rotlSL: wm,
  rotlBH: bm,
  rotlBL: mm,
  add: xm,
  add3L: Sm,
  add3H: Em,
  add4L: Am,
  add4H: vm,
  add5H: km,
  add5L: $m
}, [Im, Lm] = Et.split([
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
].map((t) => BigInt(t))), Dr = new Uint32Array(80), Fr = new Uint32Array(80);
let oc = class extends mu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: k, Hh: x, Hl: M } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, g, p, k, x, M];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, g, p, k, x, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = k | 0, this.Hh = x | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let $ = 0; $ < 16; $++, n += 4)
      Dr[$] = e.getUint32(n), Fr[$] = e.getUint32(n += 4);
    for (let $ = 16; $ < 80; $++) {
      const P = Dr[$ - 15] | 0, B = Fr[$ - 15] | 0, A = Et.rotrSH(P, B, 1) ^ Et.rotrSH(P, B, 8) ^ Et.shrSH(P, B, 7), U = Et.rotrSL(P, B, 1) ^ Et.rotrSL(P, B, 8) ^ Et.shrSL(P, B, 7), _ = Dr[$ - 2] | 0, L = Fr[$ - 2] | 0, S = Et.rotrSH(_, L, 19) ^ Et.rotrBH(_, L, 61) ^ Et.shrSH(_, L, 6), C = Et.rotrSL(_, L, 19) ^ Et.rotrBL(_, L, 61) ^ Et.shrSL(_, L, 6), b = Et.add4L(U, C, Fr[$ - 7], Fr[$ - 16]), N = Et.add4H(b, A, S, Dr[$ - 7], Dr[$ - 16]);
      Dr[$] = N | 0, Fr[$] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: k, Gh: x, Gl: M, Hh: q, Hl: K } = this;
    for (let $ = 0; $ < 80; $++) {
      const P = Et.rotrSH(l, g, 14) ^ Et.rotrSH(l, g, 18) ^ Et.rotrBH(l, g, 41), B = Et.rotrSL(l, g, 14) ^ Et.rotrSL(l, g, 18) ^ Et.rotrBL(l, g, 41), A = l & p ^ ~l & x, U = g & k ^ ~g & M, _ = Et.add5L(K, B, U, Lm[$], Fr[$]), L = Et.add5H(_, q, P, A, Im[$], Dr[$]), S = _ | 0, C = Et.rotrSH(r, i, 28) ^ Et.rotrBH(r, i, 34) ^ Et.rotrBH(r, i, 39), b = Et.rotrSL(r, i, 28) ^ Et.rotrBL(r, i, 34) ^ Et.rotrBL(r, i, 39), N = r & s ^ r & a ^ s & a, Z = i & o ^ i & c ^ o & c;
      q = x | 0, K = M | 0, x = p | 0, M = k | 0, p = l | 0, k = g | 0, { h: l, l: g } = Et.add(u | 0, d | 0, L | 0, S | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const V = Et.add3L(S, b, Z);
      r = Et.add3H(V, L, C, N), i = V | 0;
    }
    ({ h: r, l: i } = Et.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Et.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Et.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Et.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: k } = Et.add(this.Fh | 0, this.Fl | 0, p | 0, k | 0), { h: x, l: M } = Et.add(this.Gh | 0, this.Gl | 0, x | 0, M | 0), { h: q, l: K } = Et.add(this.Hh | 0, this.Hl | 0, q | 0, K | 0), this.set(r, i, s, o, a, c, u, d, l, g, p, k, x, M, q, K);
  }
  roundClean() {
    Dr.fill(0), Fr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Cm = class extends oc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Tm = class extends oc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Bm = class extends oc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Mm = Js(() => new oc());
Js(() => new Cm());
Js(() => new Tm());
Js(() => new Bm());
function G0(t) {
  return Ti(t);
}
function Nm(t) {
  return Mm(t);
}
const Pm = 0;
me.hmacSha256Sync = (t, ...e) => {
  const n = sc.create(Ti, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function _m() {
  return dt(me.randomPrivateKey());
}
function Um(t) {
  const e = Ti(Ti(t));
  return Yb.encode(sr(t, e).slice(0, t.length + 4));
}
function Hm(t, e) {
  return Um(sr(new Uint8Array([t]), e.slice(0, 20)));
}
function K0(t, e = Pm) {
  const n = typeof t == "string" ? Ut(t) : t, r = im(G0(n));
  return Hm(e, r);
}
function V0(t) {
  const e = wu(t);
  return dt(Mo(e.slice(0, 32), !0));
}
me.hmacSha256Sync = (t, ...e) => {
  const n = sc.create(Ti, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Na;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Na || (Na = {}));
async function Om(t, e, n) {
  return await (await D0()).encrypt("aes-256-cbc", e, t, n);
}
async function Dm(t, e, n) {
  return await (await D0()).decrypt("aes-256-cbc", e, t, n);
}
function q0(t, e) {
  return sc(Ti, t, e);
}
function Fm(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function W0(t) {
  const e = Nm(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function jm(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function zm(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Na.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Na.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !jm(t))
    return e;
  try {
    return Tt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Rm(t, e, n, r) {
  const i = zm(t);
  if (!i.result)
    throw i;
  const s = me.randomPrivateKey(), o = Mo(s, !0);
  let a = Au(s, t, !0);
  a = a.slice(1);
  const c = W0(a), u = me.randomBytes(16), d = await Om(u, c.encryptionKey, e), l = sr(u, o, d), g = q0(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = dt(d);
  else if (r === "base64")
    p = Mb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const k = {
    iv: dt(u),
    ephemeralPK: dt(o),
    cipherText: p,
    mac: dt(g),
    wasString: n
  };
  return r && r !== "hex" && (k.cipherTextEncoding = r), k;
}
async function X0(t, e) {
  if (!e.ephemeralPK)
    throw new Uf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Au(t, n, !0);
  r = r.slice(1);
  const i = W0(r), s = Ut(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Ut(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Bb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = sr(s, Ut(n), o), c = q0(i.hmacKey, a), u = Ut(e.mac);
  if (!Fm(u, c))
    throw new Uf("Decryption failed: failure in MAC check");
  const d = await Dm(s, i.encryptionKey, o);
  return e.wasString ? Bo(d) : d;
}
function Gm(t, e) {
  const n = typeof e == "string" ? Qs(e) : e, r = V0(t), i = G0(n), s = ic(i, t);
  return {
    signature: dt(s),
    publicKey: r
  };
}
async function Km(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = V0(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? Qs(t) : t, o = await Rm(n.publicKey, s, i, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Gm(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Vm(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return X0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Re = {}, _i = {}, Ye = {};
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.decode = Ye.encode = Ye.unescape = Ye.escape = Ye.pad = void 0;
const Y0 = No;
function ku(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Ye.pad = ku;
function Z0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Ye.escape = Z0;
function Q0(t) {
  return ku(t).replace(/-/g, "+").replace(/_/g, "/");
}
Ye.unescape = Q0;
function qm(t) {
  return Z0((0, Y0.fromByteArray)(new TextEncoder().encode(t)));
}
Ye.encode = qm;
function Wm(t) {
  return new TextDecoder().decode((0, Y0.toByteArray)(ku(Q0(t))));
}
Ye.decode = Wm;
var ac = {}, cc = {}, J0 = {}, tp = {}, lc = {};
Object.defineProperty(lc, "__esModule", { value: !0 });
lc.crypto = void 0;
lc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = g, t.rotl = p, t.byteSwap = k, t.byteSwap32 = x, t.bytesToHex = K, t.hexToBytes = B, t.asyncLoop = U, t.utf8ToBytes = _, t.bytesToUtf8 = L, t.toBytes = S, t.kdfInputToBytes = C, t.concatBytes = b, t.checkOpts = N, t.createHasher = V, t.createOptHasher = ut, t.createXOFer = it, t.randomBytes = de;
  const e = lc;
  function n(E) {
    return E instanceof Uint8Array || ArrayBuffer.isView(E) && E.constructor.name === "Uint8Array";
  }
  function r(E) {
    if (!Number.isSafeInteger(E) || E < 0)
      throw new Error("positive integer expected, got " + E);
  }
  function i(E, ...O) {
    if (!n(E))
      throw new Error("Uint8Array expected");
    if (O.length > 0 && !O.includes(E.length))
      throw new Error("Uint8Array expected of length " + O + ", got length=" + E.length);
  }
  function s(E) {
    if (typeof E != "function" || typeof E.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(E.outputLen), r(E.blockLen);
  }
  function o(E, O = !0) {
    if (E.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (O && E.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(E, O) {
    i(E);
    const gt = O.outputLen;
    if (E.length < gt)
      throw new Error("digestInto() expects output buffer of length at least " + gt);
  }
  function c(E) {
    return new Uint8Array(E.buffer, E.byteOffset, E.byteLength);
  }
  function u(E) {
    return new Uint32Array(E.buffer, E.byteOffset, Math.floor(E.byteLength / 4));
  }
  function d(...E) {
    for (let O = 0; O < E.length; O++)
      E[O].fill(0);
  }
  function l(E) {
    return new DataView(E.buffer, E.byteOffset, E.byteLength);
  }
  function g(E, O) {
    return E << 32 - O | E >>> O;
  }
  function p(E, O) {
    return E << O | E >>> 32 - O >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function k(E) {
    return E << 24 & 4278190080 | E << 8 & 16711680 | E >>> 8 & 65280 | E >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (E) => E : (E) => k(E), t.byteSwapIfBE = t.swap8IfBE;
  function x(E) {
    for (let O = 0; O < E.length; O++)
      E[O] = k(E[O]);
    return E;
  }
  t.swap32IfBE = t.isLE ? (E) => E : x;
  const M = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", q = /* @__PURE__ */ Array.from({ length: 256 }, (E, O) => O.toString(16).padStart(2, "0"));
  function K(E) {
    if (i(E), M)
      return E.toHex();
    let O = "";
    for (let gt = 0; gt < E.length; gt++)
      O += q[E[gt]];
    return O;
  }
  const $ = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function P(E) {
    if (E >= $._0 && E <= $._9)
      return E - $._0;
    if (E >= $.A && E <= $.F)
      return E - ($.A - 10);
    if (E >= $.a && E <= $.f)
      return E - ($.a - 10);
  }
  function B(E) {
    if (typeof E != "string")
      throw new Error("hex string expected, got " + typeof E);
    if (M)
      return Uint8Array.fromHex(E);
    const O = E.length, gt = O / 2;
    if (O % 2)
      throw new Error("hex string expected, got unpadded hex of length " + O);
    const st = new Uint8Array(gt);
    for (let It = 0, Ot = 0; It < gt; It++, Ot += 2) {
      const Ie = P(E.charCodeAt(Ot)), Yt = P(E.charCodeAt(Ot + 1));
      if (Ie === void 0 || Yt === void 0) {
        const Gt = E[Ot] + E[Ot + 1];
        throw new Error('hex string expected, got non-hex character "' + Gt + '" at index ' + Ot);
      }
      st[It] = Ie * 16 + Yt;
    }
    return st;
  }
  const A = async () => {
  };
  t.nextTick = A;
  async function U(E, O, gt) {
    let st = Date.now();
    for (let It = 0; It < E; It++) {
      gt(It);
      const Ot = Date.now() - st;
      Ot >= 0 && Ot < O || (await (0, t.nextTick)(), st += Ot);
    }
  }
  function _(E) {
    if (typeof E != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(E));
  }
  function L(E) {
    return new TextDecoder().decode(E);
  }
  function S(E) {
    return typeof E == "string" && (E = _(E)), i(E), E;
  }
  function C(E) {
    return typeof E == "string" && (E = _(E)), i(E), E;
  }
  function b(...E) {
    let O = 0;
    for (let st = 0; st < E.length; st++) {
      const It = E[st];
      i(It), O += It.length;
    }
    const gt = new Uint8Array(O);
    for (let st = 0, It = 0; st < E.length; st++) {
      const Ot = E[st];
      gt.set(Ot, It), It += Ot.length;
    }
    return gt;
  }
  function N(E, O) {
    if (O !== void 0 && {}.toString.call(O) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(E, O);
  }
  class Z {
  }
  t.Hash = Z;
  function V(E) {
    const O = (st) => E().update(S(st)).digest(), gt = E();
    return O.outputLen = gt.outputLen, O.blockLen = gt.blockLen, O.create = () => E(), O;
  }
  function ut(E) {
    const O = (st, It) => E(It).update(S(st)).digest(), gt = E({});
    return O.outputLen = gt.outputLen, O.blockLen = gt.blockLen, O.create = (st) => E(st), O;
  }
  function it(E) {
    const O = (st, It) => E(It).update(S(st)).digest(), gt = E({});
    return O.outputLen = gt.outputLen, O.blockLen = gt.blockLen, O.create = (st) => E(st), O;
  }
  t.wrapConstructor = V, t.wrapConstructorWithOpts = ut, t.wrapXOFConstructorWithOpts = it;
  function de(E = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(E));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(E));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(tp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = tp;
  class n extends e.Hash {
    constructor(s, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(s);
      const a = (0, e.toBytes)(o);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? s.create().update(a).digest() : a);
      for (let d = 0; d < u.length; d++)
        u[d] ^= 54;
      this.iHash.update(u), this.oHash = s.create();
      for (let d = 0; d < u.length; d++)
        u[d] ^= 106;
      this.oHash.update(u), (0, e.clean)(u);
    }
    update(s) {
      return (0, e.aexists)(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      (0, e.aexists)(this), (0, e.abytes)(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: d, outputLen: l } = this;
      return s = s, s.finished = c, s.destroyed = u, s.blockLen = d, s.outputLen = l, s.oHash = o._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  t.HMAC = n;
  const r = (i, s, o) => new n(i, s).update(o).digest();
  t.hmac = r, t.hmac.create = (i, s) => new n(i, s);
})(J0);
const yi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function ep(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function ti(t, ...e) {
  if (!ep(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Xm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  wl(t.outputLen), wl(t.blockLen);
}
function bl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function np(t, e) {
  ti(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Ym(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Zm(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Pa(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function xa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function _n(t, e) {
  return t << 32 - e | t >>> e;
}
function Qm(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Iu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Lu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const rp = Iu ? (t) => t : (t) => Lu(t), Jm = rp;
function sp(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Lu(t[e]);
  return t;
}
const t1 = Iu ? (t) => t : sp, ip = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", e1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function op(t) {
  if (ti(t), ip)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += e1[t[n]];
  return e;
}
const yr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Xf(t) {
  if (t >= yr._0 && t <= yr._9)
    return t - yr._0;
  if (t >= yr.A && t <= yr.F)
    return t - (yr.A - 10);
  if (t >= yr.a && t <= yr.f)
    return t - (yr.a - 10);
}
function n1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (ip)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = Xf(t.charCodeAt(s)), a = Xf(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const ap = async () => {
};
async function r1(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await ap(), r += s);
  }
}
function Cu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function s1(t) {
  return new TextDecoder().decode(t);
}
function Po(t) {
  return typeof t == "string" && (t = Cu(t)), ti(t), t;
}
function i1(t) {
  return typeof t == "string" && (t = Cu(t)), ti(t), t;
}
function o1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    ti(i), e += i.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function a1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let cp = class {
};
function uc(t) {
  const e = (r) => t().update(Po(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function lp(t) {
  const e = (r, i) => t(i).update(Po(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function up(t) {
  const e = (r, i) => t(i).update(Po(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const c1 = uc, l1 = lp, u1 = up;
function f1(t = 32) {
  if (yi && typeof yi.getRandomValues == "function")
    return yi.getRandomValues(new Uint8Array(t));
  if (yi && typeof yi.randomBytes == "function")
    return Uint8Array.from(yi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const d1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: cp,
  abytes: ti,
  aexists: bl,
  ahash: Xm,
  anumber: wl,
  aoutput: np,
  asyncLoop: r1,
  byteSwap: Lu,
  byteSwap32: sp,
  byteSwapIfBE: Jm,
  bytesToHex: op,
  bytesToUtf8: s1,
  checkOpts: a1,
  clean: Pa,
  concatBytes: o1,
  createHasher: uc,
  createOptHasher: lp,
  createView: xa,
  createXOFer: up,
  hexToBytes: n1,
  isBytes: ep,
  isLE: Iu,
  kdfInputToBytes: i1,
  nextTick: ap,
  randomBytes: f1,
  rotl: Qm,
  rotr: _n,
  swap32IfBE: t1,
  swap8IfBE: rp,
  toBytes: Po,
  u32: Zm,
  u8: Ym,
  utf8ToBytes: Cu,
  wrapConstructor: c1,
  wrapConstructorWithOpts: l1,
  wrapXOFConstructorWithOpts: u1
}, Symbol.toStringTag, { value: "Module" }));
function h1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function p1(t, e, n) {
  return t & e ^ ~t & n;
}
function g1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class y1 extends cp {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = xa(this.buffer);
  }
  update(e) {
    bl(this), e = Po(e), ti(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = xa(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    bl(this), np(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, Pa(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    h1(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = xa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.destroyed = o, e.finished = s, e.length = i, e.pos = a, i % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const jr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), zr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), w1 = /* @__PURE__ */ Uint32Array.from([
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
]), Rr = /* @__PURE__ */ new Uint32Array(64);
let Tu = class extends y1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = jr[0] | 0, this.B = jr[1] | 0, this.C = jr[2] | 0, this.D = jr[3] | 0, this.E = jr[4] | 0, this.F = jr[5] | 0, this.G = jr[6] | 0, this.H = jr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Rr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Rr[l - 15], p = Rr[l - 2], k = _n(g, 7) ^ _n(g, 18) ^ g >>> 3, x = _n(p, 17) ^ _n(p, 19) ^ p >>> 10;
      Rr[l] = x + Rr[l - 7] + k + Rr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = _n(a, 6) ^ _n(a, 11) ^ _n(a, 25), p = d + g + p1(a, c, u) + w1[l] + Rr[l] | 0, x = (_n(r, 2) ^ _n(r, 13) ^ _n(r, 22)) + g1(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Pa(Rr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Pa(this.buffer);
  }
}, fp = class extends Tu {
  constructor() {
    super(28), this.A = zr[0] | 0, this.B = zr[1] | 0, this.C = zr[2] | 0, this.D = zr[3] | 0, this.E = zr[4] | 0, this.F = zr[5] | 0, this.G = zr[6] | 0, this.H = zr[7] | 0;
  }
};
const b1 = /* @__PURE__ */ uc(() => new Tu()), m1 = /* @__PURE__ */ uc(() => new fp()), x1 = Tu, dp = b1, S1 = fp, E1 = m1, A1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: S1,
  SHA256: x1,
  sha224: E1,
  sha256: dp
}, Symbol.toStringTag, { value: "Module" })), fc = /* @__PURE__ */ nc(A1), v1 = /* @__PURE__ */ nc(Tb);
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.joseToDer = Ui.derToJose = void 0;
const hp = No, pp = Ye;
function Dc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const $1 = {
  ES256: Dc(256),
  ES384: Dc(384),
  ES512: Dc(521)
};
function gp(t) {
  const e = $1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const _a = 128, yp = 0, k1 = 32, I1 = 16, L1 = 2, wp = I1 | k1 | yp << 6, Ua = L1 | yp << 6;
function bp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, hp.toByteArray)((0, pp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function C1(t, e) {
  const n = bp(t), r = gp(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== wp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (_a | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== Ua)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Ua)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (s - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${s - o}"`);
  if (i < d)
    throw new Error(`"s" specified length of "${d}", max of "${i}" is acceptable`);
  const l = o;
  if (o += d, o !== s)
    throw new Error(`Expected to consume entire array, but "${s - o}" bytes remain`);
  const g = r - c, p = r - d, k = new Uint8Array(g + c + p + d);
  for (o = 0; o < g; ++o)
    k[o] = 0;
  k.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const x = o; o < x + p; ++o)
    k[o] = 0;
  return k.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, pp.escape)((0, hp.fromByteArray)(k));
}
Ui.derToJose = C1;
function Yf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= _a && --r, r;
}
function T1(t, e) {
  t = bp(t);
  const n = gp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = Yf(t, 0, n), s = Yf(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, u = c < _a, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = wp, u ? d[l++] = c : (d[l++] = _a | 1, d[l++] = c & 255), d[l++] = Ua, d[l++] = o, i < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(i, n), l), l += n - i), d[l++] = Ua, d[l++] = a, s < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + s), l), d;
}
Ui.joseToDer = T1;
var vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.InvalidTokenError = vr.MissingParametersError = void 0;
class B1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
vr.MissingParametersError = B1;
class M1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
vr.InvalidTokenError = M1;
const _o = /* @__PURE__ */ nc(d1);
Object.defineProperty(cc, "__esModule", { value: !0 });
cc.SECP256K1Client = void 0;
const N1 = J0, P1 = fc, Sa = v1, Zf = Ui, Qf = vr, Jf = _o;
Sa.utils.hmacSha256Sync = (t, ...e) => {
  const n = N1.hmac.create(P1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class mp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Jf.bytesToHex)(Sa.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Qf.MissingParametersError("a signing input hash and private key are all required");
    const i = Sa.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Jf.bytesToHex)(i);
    if (r === "jose")
      return (0, Zf.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Zf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Qf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Sa.verify(n, e, r, { strict: !1 });
  }
}
cc.SECP256K1Client = mp;
mp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = cc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ac);
var Hs = {};
const _1 = /* @__PURE__ */ nc(v0);
var U1 = Qe && Qe.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
    function a(d) {
      try {
        u(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        u(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function u(d) {
      d.done ? s(d.value) : i(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.hashSha256Async = Hs.hashSha256 = void 0;
const H1 = fc;
function xp(t) {
  return (0, H1.sha256)(t);
}
Hs.hashSha256 = xp;
function O1(t) {
  return U1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = _1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(xp(t));
    }
  });
}
Hs.hashSha256Async = O1;
var D1 = Qe && Qe.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
    function a(d) {
      try {
        u(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        u(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function u(d) {
      d.done ? s(d.value) : i(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.TokenSigner = _i.createUnsecuredToken = void 0;
const ml = Ye, td = ac, F1 = vr, ed = Hs;
function xl(t, e) {
  const n = [], r = ml.encode(JSON.stringify(e));
  n.push(r);
  const i = ml.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function j1(t) {
  return xl(t, { typ: "JWT", alg: "none" }) + ".";
}
_i.createUnsecuredToken = j1;
class z1 {
  constructor(e, n) {
    if (!(e && n))
      throw new F1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !td.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = td.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = xl(e, i), o = (0, ed.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return D1(this, void 0, void 0, function* () {
      const i = this.header(r), s = xl(e, i), o = yield (0, ed.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [ml.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
_i.TokenSigner = z1;
var dc = {};
Object.defineProperty(dc, "__esModule", { value: !0 });
dc.TokenVerifier = void 0;
const R1 = Ye, nd = ac, G1 = vr, Xo = Hs;
class K1 {
  constructor(e, n) {
    if (!(e && n))
      throw new G1.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !nd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = nd.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), i = r[0] + "." + r[1], s = (o) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, a, this.rawPublicKey);
    };
    if (n)
      return (0, Xo.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, Xo.hashSha256)(i);
      return s(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), R1.encode(e.payload)].join(".");
    let i = !0;
    const s = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (i = !1);
    }), i);
    if (n)
      return (0, Xo.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, Xo.hashSha256)(r);
      return s(o);
    }
  }
}
dc.TokenVerifier = K1;
var hc = {};
Object.defineProperty(hc, "__esModule", { value: !0 });
hc.decodeToken = void 0;
const Yo = Ye;
function V1(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Yo.decode(e[0])), r = JSON.parse(Yo.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Yo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(Yo.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
hc.decodeToken = V1;
(function(t) {
  var e = Qe && Qe.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = Qe && Qe.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(_i, t), n(dc, t), n(hc, t), n(vr, t), n(ac, t);
})(Re);
function q1(t) {
  return `did:btc-addr:${t}`;
}
function W1(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new _f("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new _f('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Sp(t) {
  if (t)
    return W1(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const X1 = "1.4.0";
function Y1() {
  return _m();
}
function Z1(t, e, n, r = p0.slice(), i, s = Mw().getTime(), o = {}) {
  const a = (p) => {
    const k = gu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return k == null ? void 0 : k.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), i || (i = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Pw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: i,
    manifest_uri: n,
    redirect_uri: e,
    version: X1,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Re.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = K0(u);
  return c.iss = q1(d), new Re.TokenSigner("ES256k", t).sign(c);
}
async function rd(t, e) {
  const n = Bo(Ut(e)), r = JSON.parse(n), i = await X0(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function Q1(t) {
  const e = Re.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Re.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function J1(t) {
  const e = Re.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Sp(e.iss);
  if (n.length === 1) {
    if (K0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function t2(t) {
  const e = Re.decodeToken(t).payload;
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
  const e = Re.decodeToken(t).payload;
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
    Q1(t),
    J1(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const sd = "1.0.0";
class ds {
  constructor(e) {
    this.version = sd, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== sd)
      throw new fl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ds(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Ep {
  constructor(e) {
    if (e) {
      const n = new ds(e);
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
class id extends Ep {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ds({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new g0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ds({})), !0;
  }
}
class od extends Ep {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Cw, !localStorage.getItem(this.key)) {
      const r = new ds({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new g0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ds.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ds({})), !0;
  }
}
var bo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(bo || (bo = {}));
var Ha;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ha || (Ha = {}));
bo.Mainnet;
var Er;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Er || (Er = {}));
var tr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(tr || (tr = {}));
Er.Mainnet;
const Ap = {
  chainId: bo.Mainnet,
  transactionVersion: Er.Mainnet,
  peerNetworkId: Ha.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: tr.MainnetSingleSig,
    multiSig: tr.MainnetMultiSig
  },
  client: { baseUrl: y0 }
}, Sl = {
  chainId: bo.Testnet,
  transactionVersion: Er.Testnet,
  peerNetworkId: Ha.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: tr.TestnetSingleSig,
    multiSig: tr.TestnetMultiSig
  },
  client: { baseUrl: w0 }
}, Ea = {
  ...Sl,
  addressVersion: { ...Sl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: b0 }
}, r2 = {
  ...Ea,
  addressVersion: { ...Ea.addressVersion },
  client: { ...Ea.client }
};
function s2(t) {
  switch (t) {
    case "mainnet":
      return Ap;
    case "testnet":
      return Sl;
    case "devnet":
      return Ea;
    case "mocknet":
      return r2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function vp(t) {
  return typeof t == "string" ? s2(t) : t;
}
var ad;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ad || (ad = {}));
var cd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(cd || (cd = {}));
var Un;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Un || (Un = {}));
const Fc = ["onChainOnly", "offChainOnly", "any"];
Fc[0] + "", Un.OnChainOnly, Fc[1] + "", Un.OffChainOnly, Fc[2] + "", Un.Any, Un.OnChainOnly + "", Un.OnChainOnly, Un.OffChainOnly + "", Un.OffChainOnly, Un.Any + "", Un.Any;
var ld;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ld || (ld = {}));
var ud;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(fd || (fd = {}));
var Sr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Sr || (Sr = {}));
var dd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(gd || (gd = {}));
var yd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(yd || (yd = {}));
var wd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wd || (wd = {}));
var bd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(bd || (bd = {}));
var md;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(md || (md = {}));
var xd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(xd || (xd = {}));
function El(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function i2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function $p(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function o2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  El(t.outputLen), El(t.blockLen);
}
function a2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function c2(t, e) {
  $p(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const As = {
  number: El,
  bool: i2,
  bytes: $p,
  hash: o2,
  exists: a2,
  output: c2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const jc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vn = (t, e) => t << 32 - e | t >>> e, l2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!l2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function u2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bu(t) {
  if (typeof t == "string" && (t = u2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let kp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ei(t) {
  const e = (r) => t().update(Bu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Ip = class extends kp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, As.hash(e);
    const r = Bu(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return As.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    As.exists(this), As.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Lp = (t, e, n) => new Ip(t, e).update(n).digest();
Lp.create = (t, e) => new Ip(t, e);
function f2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Mu = class extends kp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jc(this.buffer);
  }
  update(e) {
    As.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Bu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = jc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    As.exists(this), As.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    f2(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = jc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const d2 = (t, e, n) => t & e ^ ~t & n, h2 = (t, e, n) => t & e ^ t & n ^ e & n, p2 = new Uint32Array([
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
]), Gr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Kr = new Uint32Array(64);
let Cp = class extends Mu {
  constructor() {
    super(64, 32, 8, !1), this.A = Gr[0] | 0, this.B = Gr[1] | 0, this.C = Gr[2] | 0, this.D = Gr[3] | 0, this.E = Gr[4] | 0, this.F = Gr[5] | 0, this.G = Gr[6] | 0, this.H = Gr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Kr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Kr[l - 15], p = Kr[l - 2], k = Vn(g, 7) ^ Vn(g, 18) ^ g >>> 3, x = Vn(p, 17) ^ Vn(p, 19) ^ p >>> 10;
      Kr[l] = x + Kr[l - 7] + k + Kr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Vn(a, 6) ^ Vn(a, 11) ^ Vn(a, 25), p = d + g + d2(a, c, u) + p2[l] + Kr[l] | 0, x = (Vn(r, 2) ^ Vn(r, 13) ^ Vn(r, 22)) + h2(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Kr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, g2 = class extends Cp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Tp = ei(() => new Cp());
ei(() => new g2());
var ni = {}, Nu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = _o;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const k = n.indexOf(o[p]) >> u;
        let x = 0;
        p !== 0 && (x = n.indexOf(o[p - 1]));
        const M = 1 + u, q = x % (1 << M) << 5 - M, K = t.c32[k + q];
        u = M, c.unshift(K);
      } else
        u = 0;
    let d = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let p = 0; p < g; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let k = 0; k < p; k++)
        c.unshift(t.c32[0]);
    }
    return c.join("");
  }
  t.c32encode = r;
  function i(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = i;
  function s(o, a) {
    if (o = i(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = o.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let d = [], l = 0, g = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const q = (t.c32.indexOf(o[x]) << g) + l, K = n[q % 16];
      if (g += 1, l = q >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(K);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let x = 0; x < d.length && d[x] === "0"; x++)
      p++;
    d = d.slice(p - p % 2);
    let k = d.join("");
    for (let x = 0; x < u; x++)
      k = `00${k}`;
    if (a) {
      const x = a * 2 - k.length;
      for (let M = 0; M < x; M += 2)
        k = `00${k}`;
    }
    return k;
  }
  t.c32decode = s;
})(Nu);
var Os = {};
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.c32checkDecode = Os.c32checkEncode = void 0;
const Sd = fc, Ed = _o, ho = Nu;
function Bp(t) {
  const e = (0, Sd.sha256)((0, Sd.sha256)((0, Ed.hexToBytes)(t)));
  return (0, Ed.bytesToHex)(e.slice(0, 4));
}
function y2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Bp(`${n}${e}`), i = (0, ho.c32encode)(`${e}${r}`);
  return `${ho.c32[t]}${i}`;
}
Os.c32checkEncode = y2;
function w2(t) {
  t = (0, ho.c32normalize)(t);
  const e = (0, ho.c32decode)(t.slice(1)), n = t[0], r = ho.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), Bp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Os.c32checkDecode = w2;
var Mp = {}, Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.decode = Hi.encode = void 0;
const Oa = fc, Ad = _o, Np = F0, Pp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function b2(t, e = "00") {
  const n = typeof t == "string" ? (0, Ad.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ad.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, Oa.sha256)((0, Oa.sha256)(new Uint8Array([...r, ...n])));
  return Np(Pp).encode([...r, ...n, ...i.slice(0, 4)]);
}
Hi.encode = b2;
function m2(t) {
  const e = Np(Pp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, Oa.sha256)((0, Oa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Hi.decode = m2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Os, n = Hi, r = _o;
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
  const i = {};
  i[0] = t.versions.mainnet.p2pkh, i[5] = t.versions.mainnet.p2sh, i[111] = t.versions.testnet.p2pkh, i[196] = t.versions.testnet.p2sh;
  const s = {};
  s[t.versions.mainnet.p2pkh] = 0, s[t.versions.mainnet.p2sh] = 5, s[t.versions.testnet.p2pkh] = 111, s[t.versions.testnet.p2sh] = 196;
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
    const g = n.decode(d), p = (0, r.bytesToHex)(g.data), k = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let x;
    return l < 0 ? (x = k, i[k] !== void 0 && (x = i[k])) : x = l, o(x, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const g = a(d), p = g[0], k = g[1];
    let x;
    l < 0 ? (x = p, s[p] !== void 0 && (x = s[p])) : x = l;
    let M = x.toString(16);
    return M.length === 1 && (M = `0${M}`), n.encode(k, M);
  }
  t.c32ToB58 = u;
})(Mp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Nu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Os;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Mp;
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
})(ni);
function x2(t, e) {
  switch (e = vp(e ?? Ap), t) {
    case Sr.P2PKH:
      switch (e.transactionVersion) {
        case Er.Mainnet:
          return tr.MainnetSingleSig;
        case Er.Testnet:
          return tr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Sr.P2SH:
    case Sr.P2SHNonSequential:
    case Sr.P2WPKH:
    case Sr.P2WSH:
    case Sr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Er.Mainnet:
          return tr.MainnetMultiSig;
        case Er.Testnet:
          return tr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const S2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _p = Uint8Array.from({ length: 16 }, (t, e) => e), E2 = _p.map((t) => (9 * t + 5) % 16);
let Pu = [_p], _u = [E2];
for (let t = 0; t < 4; t++)
  for (let e of [Pu, _u])
    e.push(e[t].map((n) => S2[n]));
const Up = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), A2 = Pu.map((t, e) => t.map((n) => Up[e][n])), v2 = _u.map((t, e) => t.map((n) => Up[e][n])), $2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), k2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zo = (t, e) => t << e | t >>> 32 - e;
function vd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qo = new Uint32Array(16);
let I2 = class extends Mu {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Qo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const k = 4 - p, x = $2[p], M = k2[p], q = Pu[p], K = _u[p], $ = A2[p], P = v2[p];
      for (let B = 0; B < 16; B++) {
        const A = Zo(r + vd(p, s, a, u) + Qo[q[B]] + x, $[B]) + l | 0;
        r = l, l = u, u = Zo(a, 10) | 0, a = s, s = A;
      }
      for (let B = 0; B < 16; B++) {
        const A = Zo(i + vd(k, o, c, d) + Qo[K[B]] + M, P[B]) + g | 0;
        i = g, g = d, d = Zo(c, 10) | 0, c = o, o = A;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Qo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const L2 = ei(() => new I2()), Jo = BigInt(2 ** 32 - 1), Al = BigInt(32);
function Hp(t, e = !1) {
  return e ? { h: Number(t & Jo), l: Number(t >> Al & Jo) } : { h: Number(t >> Al & Jo) | 0, l: Number(t & Jo) | 0 };
}
function C2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Hp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const T2 = (t, e) => BigInt(t >>> 0) << Al | BigInt(e >>> 0), B2 = (t, e, n) => t >>> n, M2 = (t, e, n) => t << 32 - n | e >>> n, N2 = (t, e, n) => t >>> n | e << 32 - n, P2 = (t, e, n) => t << 32 - n | e >>> n, _2 = (t, e, n) => t << 64 - n | e >>> n - 32, U2 = (t, e, n) => t >>> n - 32 | e << 64 - n, H2 = (t, e) => e, O2 = (t, e) => t, D2 = (t, e, n) => t << n | e >>> 32 - n, F2 = (t, e, n) => e << n | t >>> 32 - n, j2 = (t, e, n) => e << n - 32 | t >>> 64 - n, z2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function R2(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const G2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), K2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, V2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), q2 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, W2 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), X2 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, At = {
  fromBig: Hp,
  split: C2,
  toBig: T2,
  shrSH: B2,
  shrSL: M2,
  rotrSH: N2,
  rotrSL: P2,
  rotrBH: _2,
  rotrBL: U2,
  rotr32H: H2,
  rotr32L: O2,
  rotlSH: D2,
  rotlSL: F2,
  rotlBH: j2,
  rotlBL: z2,
  add: R2,
  add3L: G2,
  add3H: K2,
  add4L: V2,
  add4H: q2,
  add5H: X2,
  add5L: W2
}, [Y2, Z2] = At.split([
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
].map((t) => BigInt(t))), Vr = new Uint32Array(80), qr = new Uint32Array(80);
let pc = class extends Mu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: k, Hh: x, Hl: M } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, g, p, k, x, M];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, g, p, k, x, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = k | 0, this.Hh = x | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let $ = 0; $ < 16; $++, n += 4)
      Vr[$] = e.getUint32(n), qr[$] = e.getUint32(n += 4);
    for (let $ = 16; $ < 80; $++) {
      const P = Vr[$ - 15] | 0, B = qr[$ - 15] | 0, A = At.rotrSH(P, B, 1) ^ At.rotrSH(P, B, 8) ^ At.shrSH(P, B, 7), U = At.rotrSL(P, B, 1) ^ At.rotrSL(P, B, 8) ^ At.shrSL(P, B, 7), _ = Vr[$ - 2] | 0, L = qr[$ - 2] | 0, S = At.rotrSH(_, L, 19) ^ At.rotrBH(_, L, 61) ^ At.shrSH(_, L, 6), C = At.rotrSL(_, L, 19) ^ At.rotrBL(_, L, 61) ^ At.shrSL(_, L, 6), b = At.add4L(U, C, qr[$ - 7], qr[$ - 16]), N = At.add4H(b, A, S, Vr[$ - 7], Vr[$ - 16]);
      Vr[$] = N | 0, qr[$] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: k, Gh: x, Gl: M, Hh: q, Hl: K } = this;
    for (let $ = 0; $ < 80; $++) {
      const P = At.rotrSH(l, g, 14) ^ At.rotrSH(l, g, 18) ^ At.rotrBH(l, g, 41), B = At.rotrSL(l, g, 14) ^ At.rotrSL(l, g, 18) ^ At.rotrBL(l, g, 41), A = l & p ^ ~l & x, U = g & k ^ ~g & M, _ = At.add5L(K, B, U, Z2[$], qr[$]), L = At.add5H(_, q, P, A, Y2[$], Vr[$]), S = _ | 0, C = At.rotrSH(r, i, 28) ^ At.rotrBH(r, i, 34) ^ At.rotrBH(r, i, 39), b = At.rotrSL(r, i, 28) ^ At.rotrBL(r, i, 34) ^ At.rotrBL(r, i, 39), N = r & s ^ r & a ^ s & a, Z = i & o ^ i & c ^ o & c;
      q = x | 0, K = M | 0, x = p | 0, M = k | 0, p = l | 0, k = g | 0, { h: l, l: g } = At.add(u | 0, d | 0, L | 0, S | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const V = At.add3L(S, b, Z);
      r = At.add3H(V, L, C, N), i = V | 0;
    }
    ({ h: r, l: i } = At.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = At.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = At.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = At.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = At.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: k } = At.add(this.Fh | 0, this.Fl | 0, p | 0, k | 0), { h: x, l: M } = At.add(this.Gh | 0, this.Gl | 0, x | 0, M | 0), { h: q, l: K } = At.add(this.Hh | 0, this.Hl | 0, q | 0, K | 0), this.set(r, i, s, o, a, c, u, d, l, g, p, k, x, M, q, K);
  }
  roundClean() {
    Vr.fill(0), qr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Q2 = class extends pc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, J2 = class extends pc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, tx = class extends pc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ei(() => new pc());
ei(() => new Q2());
ei(() => new J2());
ei(() => new tx());
var Da = { exports: {} };
Da.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", p = "[object Number]", k = "[object Object]", x = "[object Promise]", M = "[object RegExp]", q = "[object Set]", K = "[object String]", $ = "[object Symbol]", P = "[object WeakMap]", B = "[object ArrayBuffer]", A = "[object DataView]", U = "[object Float32Array]", _ = "[object Float64Array]", L = "[object Int8Array]", S = "[object Int16Array]", C = "[object Int32Array]", b = "[object Uint8Array]", N = "[object Uint8ClampedArray]", Z = "[object Uint16Array]", V = "[object Uint32Array]", ut = /[\\^$.*+?()[\]{}|]/g, it = /\w*$/, de = /^\[object .+?Constructor\]$/, E = /^(?:0|[1-9]\d*)$/, O = {};
  O[s] = O[o] = O[B] = O[A] = O[a] = O[c] = O[U] = O[_] = O[L] = O[S] = O[C] = O[g] = O[p] = O[k] = O[M] = O[q] = O[K] = O[$] = O[b] = O[N] = O[Z] = O[V] = !0, O[u] = O[d] = O[P] = !1;
  var gt = typeof Qe == "object" && Qe && Qe.Object === Object && Qe, st = typeof self == "object" && self && self.Object === Object && self, It = gt || st || Function("return this")(), Ot = e && !e.nodeType && e, Ie = Ot && !0 && t && !t.nodeType && t, Yt = Ie && Ie.exports === Ot;
  function Gt(y, T) {
    return y.set(T[0], T[1]), y;
  }
  function ce(y, T) {
    return y.add(T), y;
  }
  function Ue(y, T) {
    for (var D = -1, ot = y ? y.length : 0; ++D < ot && T(y[D], D, y) !== !1; )
      ;
    return y;
  }
  function Zt(y, T) {
    for (var D = -1, ot = T.length, je = y.length; ++D < ot; )
      y[je + D] = T[D];
    return y;
  }
  function ve(y, T, D, ot) {
    for (var je = -1, nn = y ? y.length : 0; ++je < nn; )
      D = T(D, y[je], je, y);
    return D;
  }
  function En(y, T) {
    for (var D = -1, ot = Array(y); ++D < y; )
      ot[D] = T(D);
    return ot;
  }
  function te(y, T) {
    return y == null ? void 0 : y[T];
  }
  function Le(y) {
    var T = !1;
    if (y != null && typeof y.toString != "function")
      try {
        T = !!(y + "");
      } catch {
      }
    return T;
  }
  function tn(y) {
    var T = -1, D = Array(y.size);
    return y.forEach(function(ot, je) {
      D[++T] = [je, ot];
    }), D;
  }
  function Ce(y, T) {
    return function(D) {
      return y(T(D));
    };
  }
  function He(y) {
    var T = -1, D = Array(y.size);
    return y.forEach(function(ot) {
      D[++T] = ot;
    }), D;
  }
  var Ft = Array.prototype, en = Function.prototype, Oe = Object.prototype, De = It["__core-js_shared__"], qt = function() {
    var y = /[^.]+$/.exec(De && De.keys && De.keys.IE_PROTO || "");
    return y ? "Symbol(src)_1." + y : "";
  }(), Kt = en.toString, Te = Oe.hasOwnProperty, Ge = Oe.toString, Ir = RegExp(
    "^" + Kt.call(Te).replace(ut, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Lr = Yt ? It.Buffer : void 0, v = It.Symbol, F = It.Uint8Array, j = Ce(Object.getPrototypeOf, Object), G = Object.create, ct = Oe.propertyIsEnumerable, wt = Ft.splice, Jt = Object.getOwnPropertySymbols, mt = Lr ? Lr.isBuffer : void 0, ee = Ce(Object.keys, Object), he = R(It, "DataView"), pe = R(It, "Map"), le = R(It, "Promise"), Mt = R(It, "Set"), h = R(It, "WeakMap"), m = R(Object, "create"), f = xe(he), H = xe(pe), Y = xe(le), nt = xe(Mt), ht = xe(h), Nt = v ? v.prototype : void 0, $e = Nt ? Nt.valueOf : void 0;
  function jt(y) {
    var T = -1, D = y ? y.length : 0;
    for (this.clear(); ++T < D; ) {
      var ot = y[T];
      this.set(ot[0], ot[1]);
    }
  }
  function Lt() {
    this.__data__ = m ? m(null) : {};
  }
  function ge(y) {
    return this.has(y) && delete this.__data__[y];
  }
  function ln(y) {
    var T = this.__data__;
    if (m) {
      var D = T[y];
      return D === r ? void 0 : D;
    }
    return Te.call(T, y) ? T[y] : void 0;
  }
  function Mn(y) {
    var T = this.__data__;
    return m ? T[y] !== void 0 : Te.call(T, y);
  }
  function Be(y, T) {
    var D = this.__data__;
    return D[y] = m && T === void 0 ? r : T, this;
  }
  jt.prototype.clear = Lt, jt.prototype.delete = ge, jt.prototype.get = ln, jt.prototype.has = Mn, jt.prototype.set = Be;
  function ne(y) {
    var T = -1, D = y ? y.length : 0;
    for (this.clear(); ++T < D; ) {
      var ot = y[T];
      this.set(ot[0], ot[1]);
    }
  }
  function An() {
    this.__data__ = [];
  }
  function ft(y) {
    var T = this.__data__, D = fr(T, y);
    if (D < 0)
      return !1;
    var ot = T.length - 1;
    return D == ot ? T.pop() : wt.call(T, D, 1), !0;
  }
  function Ht(y) {
    var T = this.__data__, D = fr(T, y);
    return D < 0 ? void 0 : T[D][1];
  }
  function re(y) {
    return fr(this.__data__, y) > -1;
  }
  function vn(y, T) {
    var D = this.__data__, ot = fr(D, y);
    return ot < 0 ? D.push([y, T]) : D[ot][1] = T, this;
  }
  ne.prototype.clear = An, ne.prototype.delete = ft, ne.prototype.get = Ht, ne.prototype.has = re, ne.prototype.set = vn;
  function Nn(y) {
    var T = -1, D = y ? y.length : 0;
    for (this.clear(); ++T < D; ) {
      var ot = y[T];
      this.set(ot[0], ot[1]);
    }
  }
  function Ji() {
    this.__data__ = {
      hash: new jt(),
      map: new (pe || ne)(),
      string: new jt()
    };
  }
  function ci(y) {
    return I(this, y).delete(y);
  }
  function Cr(y) {
    return I(this, y).get(y);
  }
  function $n(y) {
    return I(this, y).has(y);
  }
  function li(y, T) {
    return I(this, y).set(y, T), this;
  }
  Nn.prototype.clear = Ji, Nn.prototype.delete = ci, Nn.prototype.get = Cr, Nn.prototype.has = $n, Nn.prototype.set = li;
  function un(y) {
    this.__data__ = new ne(y);
  }
  function Tr() {
    this.__data__ = new ne();
  }
  function Rn(y) {
    return this.__data__.delete(y);
  }
  function Pn(y) {
    return this.__data__.get(y);
  }
  function lr(y) {
    return this.__data__.has(y);
  }
  function Br(y, T) {
    var D = this.__data__;
    if (D instanceof ne) {
      var ot = D.__data__;
      if (!pe || ot.length < n - 1)
        return ot.push([y, T]), this;
      D = this.__data__ = new Nn(ot);
    }
    return D.set(y, T), this;
  }
  un.prototype.clear = Tr, un.prototype.delete = Rn, un.prototype.get = Pn, un.prototype.has = lr, un.prototype.set = Br;
  function ws(y, T) {
    var D = Bc(y) || Xy(y) ? En(y.length, String) : [], ot = D.length, je = !!ot;
    for (var nn in y)
      Te.call(y, nn) && !(je && (nn == "length" || xt(nn, ot))) && D.push(nn);
    return D;
  }
  function ur(y, T, D) {
    var ot = y[T];
    (!(Te.call(y, T) && to(ot, D)) || D === void 0 && !(T in y)) && (y[T] = D);
  }
  function fr(y, T) {
    for (var D = y.length; D--; )
      if (to(y[D][0], T))
        return D;
    return -1;
  }
  function Mr(y, T) {
    return y && se(T, Mc(T), y);
  }
  function dr(y, T, D, ot, je, nn, gr) {
    var rn;
    if (ot && (rn = nn ? ot(y, je, nn, gr) : ot(y)), rn !== void 0)
      return rn;
    if (!Do(y))
      return y;
    var Lf = Bc(y);
    if (Lf) {
      if (rn = z(y), !T)
        return rt(y, rn);
    } else {
      var pi = lt(y), Cf = pi == d || pi == l;
      if (Zy(y))
        return di(y, T);
      if (pi == k || pi == s || Cf && !nn) {
        if (Le(y))
          return nn ? y : {};
        if (rn = yt(Cf ? {} : y), !T)
          return Me(y, Mr(rn, y));
      } else {
        if (!O[pi])
          return nn ? y : {};
        rn = bt(y, pi, dr, T);
      }
    }
    gr || (gr = new un());
    var Tf = gr.get(y);
    if (Tf)
      return Tf;
    if (gr.set(y, rn), !Lf)
      var Bf = D ? w(y) : Mc(y);
    return Ue(Bf || y, function(Nc, Fo) {
      Bf && (Fo = Nc, Nc = y[Fo]), ur(rn, Fo, dr(Nc, T, D, ot, Fo, y, gr));
    }), rn;
  }
  function Nr(y) {
    return Do(y) ? G(y) : {};
  }
  function ui(y, T, D) {
    var ot = T(y);
    return Bc(y) ? ot : Zt(ot, D(y));
  }
  function fi(y) {
    return Ge.call(y);
  }
  function bs(y) {
    if (!Do(y) || Fe(y))
      return !1;
    var T = If(y) || Le(y) ? Ir : de;
    return T.test(xe(y));
  }
  function ye(y) {
    if (!fn(y))
      return ee(y);
    var T = [];
    for (var D in Object(y))
      Te.call(y, D) && D != "constructor" && T.push(D);
    return T;
  }
  function di(y, T) {
    if (T)
      return y.slice();
    var D = new y.constructor(y.length);
    return y.copy(D), D;
  }
  function Pr(y) {
    var T = new y.constructor(y.byteLength);
    return new F(T).set(new F(y)), T;
  }
  function hr(y, T) {
    var D = T ? Pr(y.buffer) : y.buffer;
    return new y.constructor(D, y.byteOffset, y.byteLength);
  }
  function _r(y, T, D) {
    var ot = T ? D(tn(y), !0) : tn(y);
    return ve(ot, Gt, new y.constructor());
  }
  function pr(y) {
    var T = new y.constructor(y.source, it.exec(y));
    return T.lastIndex = y.lastIndex, T;
  }
  function hi(y, T, D) {
    var ot = T ? D(He(y), !0) : He(y);
    return ve(ot, ce, new y.constructor());
  }
  function Ur(y) {
    return $e ? Object($e.call(y)) : {};
  }
  function W(y, T) {
    var D = T ? Pr(y.buffer) : y.buffer;
    return new y.constructor(D, y.byteOffset, y.length);
  }
  function rt(y, T) {
    var D = -1, ot = y.length;
    for (T || (T = Array(ot)); ++D < ot; )
      T[D] = y[D];
    return T;
  }
  function se(y, T, D, ot) {
    D || (D = {});
    for (var je = -1, nn = T.length; ++je < nn; ) {
      var gr = T[je], rn = void 0;
      ur(D, gr, rn === void 0 ? y[gr] : rn);
    }
    return D;
  }
  function Me(y, T) {
    return se(y, J(y), T);
  }
  function w(y) {
    return ui(y, Mc, J);
  }
  function I(y, T) {
    var D = y.__data__;
    return zt(T) ? D[typeof T == "string" ? "string" : "hash"] : D.map;
  }
  function R(y, T) {
    var D = te(y, T);
    return bs(D) ? D : void 0;
  }
  var J = Jt ? Ce(Jt, Object) : tw, lt = fi;
  (he && lt(new he(new ArrayBuffer(1))) != A || pe && lt(new pe()) != g || le && lt(le.resolve()) != x || Mt && lt(new Mt()) != q || h && lt(new h()) != P) && (lt = function(y) {
    var T = Ge.call(y), D = T == k ? y.constructor : void 0, ot = D ? xe(D) : void 0;
    if (ot)
      switch (ot) {
        case f:
          return A;
        case H:
          return g;
        case Y:
          return x;
        case nt:
          return q;
        case ht:
          return P;
      }
    return T;
  });
  function z(y) {
    var T = y.length, D = y.constructor(T);
    return T && typeof y[0] == "string" && Te.call(y, "index") && (D.index = y.index, D.input = y.input), D;
  }
  function yt(y) {
    return typeof y.constructor == "function" && !fn(y) ? Nr(j(y)) : {};
  }
  function bt(y, T, D, ot) {
    var je = y.constructor;
    switch (T) {
      case B:
        return Pr(y);
      case a:
      case c:
        return new je(+y);
      case A:
        return hr(y, ot);
      case U:
      case _:
      case L:
      case S:
      case C:
      case b:
      case N:
      case Z:
      case V:
        return W(y, ot);
      case g:
        return _r(y, ot, D);
      case p:
      case K:
        return new je(y);
      case M:
        return pr(y);
      case q:
        return hi(y, ot, D);
      case $:
        return Ur(y);
    }
  }
  function xt(y, T) {
    return T = T ?? i, !!T && (typeof y == "number" || E.test(y)) && y > -1 && y % 1 == 0 && y < T;
  }
  function zt(y) {
    var T = typeof y;
    return T == "string" || T == "number" || T == "symbol" || T == "boolean" ? y !== "__proto__" : y === null;
  }
  function Fe(y) {
    return !!qt && qt in y;
  }
  function fn(y) {
    var T = y && y.constructor, D = typeof T == "function" && T.prototype || Oe;
    return y === D;
  }
  function xe(y) {
    if (y != null) {
      try {
        return Kt.call(y);
      } catch {
      }
      try {
        return y + "";
      } catch {
      }
    }
    return "";
  }
  function Gn(y) {
    return dr(y, !0, !0);
  }
  function to(y, T) {
    return y === T || y !== y && T !== T;
  }
  function Xy(y) {
    return Yy(y) && Te.call(y, "callee") && (!ct.call(y, "callee") || Ge.call(y) == s);
  }
  var Bc = Array.isArray;
  function kf(y) {
    return y != null && Qy(y.length) && !If(y);
  }
  function Yy(y) {
    return Jy(y) && kf(y);
  }
  var Zy = mt || ew;
  function If(y) {
    var T = Do(y) ? Ge.call(y) : "";
    return T == d || T == l;
  }
  function Qy(y) {
    return typeof y == "number" && y > -1 && y % 1 == 0 && y <= i;
  }
  function Do(y) {
    var T = typeof y;
    return !!y && (T == "object" || T == "function");
  }
  function Jy(y) {
    return !!y && typeof y == "object";
  }
  function Mc(y) {
    return kf(y) ? ws(y) : ye(y);
  }
  function tw() {
    return [];
  }
  function ew() {
    return !1;
  }
  t.exports = Gn;
})(Da, Da.exports);
var ex = Da.exports;
const Op = /* @__PURE__ */ u0(ex);
var vl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(vl || (vl = {}));
function nx(t, e) {
  return { type: vl.Address, version: t, hash160: e };
}
function rx(t) {
  return ni.c32address(t.version, t.hash160);
}
const sx = (t) => L2(Tp(t)), ix = (t) => dt(sx(t));
me.hmacSha256Sync = (t, ...e) => {
  const n = Lp.create(Tp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ox(t, e = "mainnet") {
  e = vp(e), t = typeof t == "string" ? Ut(t) : t;
  const n = x2(Sr.P2PKH, e), r = nx(n, ix(t));
  return rx(r);
}
function ax(t, e) {
  const n = Re.decodeToken(t), r = n.payload;
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
  const i = r.issuer.publicKey, s = ox(i);
  if (e !== i) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Re.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function cx(t, e = null) {
  let n;
  e ? n = ax(t, e) : n = Re.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const $d = "_blockstackDidCheckEchoReply", lx = "echoReply", ux = "authContinuation";
function fx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [i, s] = r.split("=");
    return n[i] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function dx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[$d];
  if (typeof e == "boolean")
    return e;
  const n = fx(t.location.search), r = n[lx];
  if (r) {
    t[$d] = !0;
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[ux];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class $l {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new m0();
    else
      throw new Bw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new od(e.sessionOptions) : this.store = new od() : e ? this.store = new id(e.sessionOptions) : this.store = new id();
  }
  makeAuthRequestToken(e, n, r, i, s, o = Nw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new fl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, Z1(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Y1();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = gu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (dx())
        return Si.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Si.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = nb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new jo("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Re.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await n2(e))
      throw new jo("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (_c(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await rd(i, s.private_key);
          } catch {
            if (Si.warn("Failed decryption of appPrivateKey, will try to use as given"), !me.isValidPrivateKey(s.private_key))
              throw new jo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await rd(i, c);
          } catch {
            Si.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new jo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Kw, d;
    _c(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), _c(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (d = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: Sp(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = s.profile_url;
    if (!l.profile && g) {
      const p = await n(g);
      if (!p.ok)
        l.profile = Object.assign({}, Lw);
      else {
        const k = await p.text(), x = JSON.parse(k);
        l.profile = cx(x[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new fl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Km(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Vm(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
$l.prototype.makeAuthRequest = $l.prototype.makeAuthRequestToken;
const hx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], px = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = hx(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!gc(r.id));
  return e.concat(n);
}, gc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Dp = "STX_PROVIDER", Ds = () => typeof window > "u" ? null : window.localStorage.getItem(Dp), gx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Dp, t);
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
function mx(...t) {
  const { fetchLib: e, middlewares: n } = bx(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
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
var Oi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Oi || (Oi = {}));
var Fs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Fs || (Fs = {}));
var kd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(kd || (kd = {}));
const xx = "https://api.mainnet.hiro.so", Sx = "https://api.testnet.hiro.so", Ex = "http://localhost:3999", Ax = ["mainnet", "testnet", "devnet", "mocknet"];
class js {
  constructor(e) {
    this.version = Fs.Mainnet, this.chainId = Oi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Fs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? mx();
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
js.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new kl();
    case "testnet":
      return new Il();
    case "devnet":
      return new vx();
    case "mocknet":
      return new Fp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ax.join(", ")}`);
  }
};
js.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : js.fromName(t);
class kl extends js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? xx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Mainnet, this.chainId = Oi.Mainnet;
  }
}
class Il extends js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Testnet, this.chainId = Oi.Testnet;
  }
}
class Fp extends js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ex,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Testnet, this.chainId = Oi.Testnet;
  }
}
const vx = Fp;
var zs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(zs || (zs = {}));
var Fa;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Fa || (Fa = {}));
zs.Mainnet;
var Rs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rs || (Rs = {}));
var Gs;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Gs || (Gs = {}));
Rs.Mainnet;
const $x = {
  chainId: zs.Mainnet,
  transactionVersion: Rs.Mainnet,
  peerNetworkId: Fa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Gs.MainnetSingleSig,
    multiSig: Gs.MainnetMultiSig
  },
  client: { baseUrl: y0 }
}, Ll = {
  chainId: zs.Testnet,
  transactionVersion: Rs.Testnet,
  peerNetworkId: Fa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Gs.TestnetSingleSig,
    multiSig: Gs.TestnetMultiSig
  },
  client: { baseUrl: w0 }
}, Aa = {
  ...Ll,
  addressVersion: { ...Ll.addressVersion },
  magicBytes: "id",
  client: { baseUrl: b0 }
}, kx = {
  ...Aa,
  addressVersion: { ...Aa.addressVersion },
  client: { ...Aa.client }
};
function Ix(t) {
  switch (t) {
    case "mainnet":
      return $x;
    case "testnet":
      return Ll;
    case "devnet":
      return Aa;
    case "mocknet":
      return kx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Lx(t) {
  return typeof t == "string" ? Ix(t) : t;
}
function Cx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Id = /* @__PURE__ */ new Map();
function jp(t, e) {
  const n = Id.get(t);
  if (n !== void 0)
    return n(e);
  const r = Cx(t);
  return Id.set(t, r), jp(t, e);
}
let Qt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Ut(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Qw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Yw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Ww(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = dt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = dt(n);
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
    if (jp(e, r))
      return r;
    throw n(r);
  }
};
const Tx = 128, Bx = 128, zp = 16, Ts = 32, Cl = 80, yc = 65, Mx = 32, Nx = 64, ja = 34, Px = 1 + 16 * 1024 * 1024, _x = 165, Ux = 16, Hx = 16, Ox = 20, Dx = Hx + 2 + Ox, Fx = Dx + 4, jx = Px + (_x + Ux * Fx);
var Rt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Rt || (Rt = {}));
var Tl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Tl || (Tl = {}));
var pn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(pn || (pn = {}));
const zc = ["onChainOnly", "offChainOnly", "any"];
zc[0] + "", pn.OnChainOnly, zc[1] + "", pn.OffChainOnly, zc[2] + "", pn.Any, pn.OnChainOnly + "", pn.OnChainOnly, pn.OffChainOnly + "", pn.OffChainOnly, pn.Any + "", pn.Any;
var za;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(za || (za = {}));
var ie;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ie || (ie = {}));
var we;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(we || (we = {}));
var Wt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Wt || (Wt = {}));
var ue;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ue || (ue = {}));
var po;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(po || (po = {}));
var Bl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Bl || (Bl = {}));
var Ml;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ml || (Ml = {}));
var Ze;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ze || (Ze = {}));
var Ld;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ld || (Ld = {}));
var Nl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Nl || (Nl = {}));
var On;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(On || (On = {}));
var Cd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Cd || (Cd = {}));
let wc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ei = class extends wc {
  constructor(e) {
    super(e);
  }
}, Xe = class extends wc {
  constructor(e) {
    super(e);
  }
}, Ra = class extends wc {
  constructor(e) {
    super(e);
  }
}, vs = class extends wc {
  constructor(e) {
    super(e);
  }
};
function Pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function zx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Rp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Rx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Pl(t.outputLen), Pl(t.blockLen);
}
function Gx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Kx(t, e) {
  Rp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $s = {
  number: Pl,
  bool: zx,
  bytes: Rp,
  hash: Rx,
  exists: Gx,
  output: Kx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Rc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), qn = (t, e) => t << 32 - e | t >>> e, Vx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Vx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function qx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Uu(t) {
  if (typeof t == "string" && (t = qx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Gp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ri(t) {
  const e = (r) => t().update(Uu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Kp = class extends Gp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $s.hash(e);
    const r = Uu(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return $s.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    $s.exists(this), $s.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Vp = (t, e, n) => new Kp(t, e).update(n).digest();
Vp.create = (t, e) => new Kp(t, e);
function Wx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Hu = class extends Gp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Rc(this.buffer);
  }
  update(e) {
    $s.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Uu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Rc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $s.exists(this), $s.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    Wx(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Rc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const Xx = (t, e, n) => t & e ^ ~t & n, Yx = (t, e, n) => t & e ^ t & n ^ e & n, Zx = new Uint32Array([
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
]), Wr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xr = new Uint32Array(64);
let qp = class extends Hu {
  constructor() {
    super(64, 32, 8, !1), this.A = Wr[0] | 0, this.B = Wr[1] | 0, this.C = Wr[2] | 0, this.D = Wr[3] | 0, this.E = Wr[4] | 0, this.F = Wr[5] | 0, this.G = Wr[6] | 0, this.H = Wr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Xr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Xr[l - 15], p = Xr[l - 2], k = qn(g, 7) ^ qn(g, 18) ^ g >>> 3, x = qn(p, 17) ^ qn(p, 19) ^ p >>> 10;
      Xr[l] = x + Xr[l - 7] + k + Xr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = qn(a, 6) ^ qn(a, 11) ^ qn(a, 25), p = d + g + Xx(a, c, u) + Zx[l] + Xr[l] | 0, x = (qn(r, 2) ^ qn(r, 13) ^ qn(r, 22)) + Yx(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Qx = class extends qp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ou = ri(() => new qp());
ri(() => new Qx());
const Jx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Wp = Uint8Array.from({ length: 16 }, (t, e) => e), tS = Wp.map((t) => (9 * t + 5) % 16);
let Du = [Wp], Fu = [tS];
for (let t = 0; t < 4; t++)
  for (let e of [Du, Fu])
    e.push(e[t].map((n) => Jx[n]));
const Xp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), eS = Du.map((t, e) => t.map((n) => Xp[e][n])), nS = Fu.map((t, e) => t.map((n) => Xp[e][n])), rS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), sS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ta = (t, e) => t << e | t >>> 32 - e;
function Td(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ea = new Uint32Array(16);
let iS = class extends Hu {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      ea[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const k = 4 - p, x = rS[p], M = sS[p], q = Du[p], K = Fu[p], $ = eS[p], P = nS[p];
      for (let B = 0; B < 16; B++) {
        const A = ta(r + Td(p, s, a, u) + ea[q[B]] + x, $[B]) + l | 0;
        r = l, l = u, u = ta(a, 10) | 0, a = s, s = A;
      }
      for (let B = 0; B < 16; B++) {
        const A = ta(i + Td(k, o, c, d) + ea[K[B]] + M, P[B]) + g | 0;
        i = g, g = d, d = ta(c, 10) | 0, c = o, o = A;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ea.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const oS = ri(() => new iS()), na = BigInt(2 ** 32 - 1), _l = BigInt(32);
function Yp(t, e = !1) {
  return e ? { h: Number(t & na), l: Number(t >> _l & na) } : { h: Number(t >> _l & na) | 0, l: Number(t & na) | 0 };
}
function aS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Yp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const cS = (t, e) => BigInt(t >>> 0) << _l | BigInt(e >>> 0), lS = (t, e, n) => t >>> n, uS = (t, e, n) => t << 32 - n | e >>> n, fS = (t, e, n) => t >>> n | e << 32 - n, dS = (t, e, n) => t << 32 - n | e >>> n, hS = (t, e, n) => t << 64 - n | e >>> n - 32, pS = (t, e, n) => t >>> n - 32 | e << 64 - n, gS = (t, e) => e, yS = (t, e) => t, wS = (t, e, n) => t << n | e >>> 32 - n, bS = (t, e, n) => e << n | t >>> 32 - n, mS = (t, e, n) => e << n - 32 | t >>> 64 - n, xS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function SS(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const ES = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), AS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, vS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $S = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, kS = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), IS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, vt = {
  fromBig: Yp,
  split: aS,
  toBig: cS,
  shrSH: lS,
  shrSL: uS,
  rotrSH: fS,
  rotrSL: dS,
  rotrBH: hS,
  rotrBL: pS,
  rotr32H: gS,
  rotr32L: yS,
  rotlSH: wS,
  rotlSL: bS,
  rotlBH: mS,
  rotlBL: xS,
  add: SS,
  add3L: ES,
  add3H: AS,
  add4L: vS,
  add4H: $S,
  add5H: IS,
  add5L: kS
}, [LS, CS] = vt.split([
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
].map((t) => BigInt(t))), Yr = new Uint32Array(80), Zr = new Uint32Array(80);
let bc = class extends Hu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: k, Hh: x, Hl: M } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, g, p, k, x, M];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, g, p, k, x, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = k | 0, this.Hh = x | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let $ = 0; $ < 16; $++, n += 4)
      Yr[$] = e.getUint32(n), Zr[$] = e.getUint32(n += 4);
    for (let $ = 16; $ < 80; $++) {
      const P = Yr[$ - 15] | 0, B = Zr[$ - 15] | 0, A = vt.rotrSH(P, B, 1) ^ vt.rotrSH(P, B, 8) ^ vt.shrSH(P, B, 7), U = vt.rotrSL(P, B, 1) ^ vt.rotrSL(P, B, 8) ^ vt.shrSL(P, B, 7), _ = Yr[$ - 2] | 0, L = Zr[$ - 2] | 0, S = vt.rotrSH(_, L, 19) ^ vt.rotrBH(_, L, 61) ^ vt.shrSH(_, L, 6), C = vt.rotrSL(_, L, 19) ^ vt.rotrBL(_, L, 61) ^ vt.shrSL(_, L, 6), b = vt.add4L(U, C, Zr[$ - 7], Zr[$ - 16]), N = vt.add4H(b, A, S, Yr[$ - 7], Yr[$ - 16]);
      Yr[$] = N | 0, Zr[$] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: k, Gh: x, Gl: M, Hh: q, Hl: K } = this;
    for (let $ = 0; $ < 80; $++) {
      const P = vt.rotrSH(l, g, 14) ^ vt.rotrSH(l, g, 18) ^ vt.rotrBH(l, g, 41), B = vt.rotrSL(l, g, 14) ^ vt.rotrSL(l, g, 18) ^ vt.rotrBL(l, g, 41), A = l & p ^ ~l & x, U = g & k ^ ~g & M, _ = vt.add5L(K, B, U, CS[$], Zr[$]), L = vt.add5H(_, q, P, A, LS[$], Yr[$]), S = _ | 0, C = vt.rotrSH(r, i, 28) ^ vt.rotrBH(r, i, 34) ^ vt.rotrBH(r, i, 39), b = vt.rotrSL(r, i, 28) ^ vt.rotrBL(r, i, 34) ^ vt.rotrBL(r, i, 39), N = r & s ^ r & a ^ s & a, Z = i & o ^ i & c ^ o & c;
      q = x | 0, K = M | 0, x = p | 0, M = k | 0, p = l | 0, k = g | 0, { h: l, l: g } = vt.add(u | 0, d | 0, L | 0, S | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const V = vt.add3L(S, b, Z);
      r = vt.add3H(V, L, C, N), i = V | 0;
    }
    ({ h: r, l: i } = vt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = vt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = vt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = vt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = vt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: k } = vt.add(this.Fh | 0, this.Fl | 0, p | 0, k | 0), { h: x, l: M } = vt.add(this.Gh | 0, this.Gl | 0, x | 0, M | 0), { h: q, l: K } = vt.add(this.Hh | 0, this.Hl | 0, q | 0, K | 0), this.set(r, i, s, o, a, c, u, d, l, g, p, k, x, M, q, K);
  }
  roundClean() {
    Yr.fill(0), Zr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, TS = class extends bc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, BS = class extends bc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, MS = class extends bc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ri(() => new bc());
ri(() => new TS());
const NS = ri(() => new BS());
ri(() => new MS());
var Pt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Pt || (Pt = {}));
var Ne;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ne || (Ne = {}));
function ju(t) {
  return Ne[t];
}
const PS = () => ({ type: Pt.BoolTrue }), _S = () => ({ type: Pt.BoolFalse }), US = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Pt.Buffer, value: dt(t) };
}, Bd = BigInt("0xffffffffffffffffffffffffffffffff"), HS = BigInt(0), Md = BigInt("0x7fffffffffffffffffffffffffffffff"), Nd = BigInt("-170141183460469231731687303715884105728"), OS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = hl(Ut(t))), cn(t, Uint8Array) && (t = hl(t));
  const e = qe(t);
  if (e > Md)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Md}`);
  if (e < Nd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Nd}`);
  return { type: Pt.Int, value: e };
}, DS = (t) => {
  const e = qe(t);
  if (e < HS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Bd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Bd}`);
  return { type: Pt.UInt, value: e };
};
function FS(t) {
  return { type: Pt.List, value: t };
}
function Zp() {
  return { type: Pt.OptionalNone };
}
function Qp(t) {
  return { type: Pt.OptionalSome, value: t };
}
var et;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(et || (et = {}));
function jS() {
  return {
    type: et.Address,
    version: Gs.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Pd(t) {
  if (t && ag(t, ja))
    throw new Error(`Memo exceeds maximum length of ${ja} bytes`);
  return { type: et.MemoString, content: t };
}
function zu(t, e) {
  return {
    type: et.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ul(t) {
  if (Ut(t).byteLength != yc)
    throw Error("Invalid signature");
  return {
    type: et.MessageSignature,
    data: t
  };
}
function zS(t, e, n) {
  return typeof t == "string" && (t = s3(t)), typeof n == "string" && (n = Pd(n)), {
    type: et.Payload,
    payloadType: Rt.TokenTransfer,
    recipient: t,
    amount: qe(e),
    memo: n ?? Pd("")
  };
}
function RS(t, e, n, r) {
  return typeof e == "string" && (e = jn(e)), typeof n == "string" && (n = jn(n)), {
    type: et.Payload,
    payloadType: Rt.ContractCall,
    contractAddress: typeof t == "string" ? ys(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function GS(t) {
  return jn(t, 4, 1e5);
}
function _d(t, e, n) {
  return typeof t == "string" && (t = jn(t)), typeof e == "string" && (e = GS(e)), typeof n == "number" ? {
    type: et.Payload,
    payloadType: Rt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: et.Payload,
    payloadType: Rt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function KS() {
  return { type: et.Payload, payloadType: Rt.PoisonMicroblock };
}
function Ud(t, e) {
  if (t.byteLength != Ts)
    throw Error(`Coinbase buffer size must be ${Ts} bytes`);
  return e != null ? {
    type: et.Payload,
    payloadType: Rt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: et.Payload,
    payloadType: Rt.Coinbase,
    coinbaseBytes: t
  };
}
function VS(t, e, n) {
  if (t.byteLength != Ts)
    throw Error(`Coinbase buffer size must be ${Ts} bytes`);
  if (n.byteLength != Cl)
    throw Error(`VRF proof buffer size must be ${Cl} bytes`);
  return {
    type: et.Payload,
    payloadType: Rt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Pt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function qS(t, e, n, r, i, s, o) {
  return {
    type: et.Payload,
    payloadType: Rt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function jn(t, e, n) {
  const r = e || 1, i = n || Tx;
  if (ag(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: et.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function WS(t, e, n) {
  return {
    type: et.Asset,
    address: ys(t),
    contractName: jn(e),
    assetName: jn(n)
  };
}
function ys(t) {
  const e = ni.c32addressDecode(t);
  return {
    type: et.Address,
    version: e[0],
    hash160: e[1]
  };
}
function XS(t, e) {
  const n = ys(t), r = jn(e);
  return {
    type: et.Principal,
    prefix: Ze.Contract,
    address: n,
    contractName: r
  };
}
function YS(t) {
  const e = ys(t);
  return {
    type: et.Principal,
    prefix: Ze.Standard,
    address: e
  };
}
function Ai(t, e) {
  return {
    pubKeyEncoding: t,
    type: et.TransactionAuthField,
    contents: e
  };
}
function mr(t) {
  switch (t.type) {
    case et.Address:
      return Uo(t);
    case et.Principal:
      return Jp(t);
    case et.LengthPrefixedString:
      return Fi(t);
    case et.MemoString:
      return QS(t);
    case et.Asset:
      return eg(t);
    case et.PostCondition:
      return rg(t);
    case et.PublicKey:
      return Dl(t);
    case et.LengthPrefixedList:
      return Ru(t);
    case et.Payload:
      return sg(t);
    case et.TransactionAuthField:
      return r3(t);
    case et.MessageSignature:
      return Gu(t);
  }
}
function Uo(t) {
  const e = [];
  return e.push(Ut(To(t.version, 1))), e.push(Ut(t.hash160)), Ee(e);
}
function Di(t) {
  const e = cn(t, Qt) ? t : new Qt(t), n = rc(dt(e.readBytes(1))), r = dt(e.readBytes(20));
  return { type: et.Address, version: n, hash160: r };
}
function Jp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Ze.Standard || t.prefix === Ze.Contract) && e.push(Uo(t.address)), t.prefix === Ze.Contract && e.push(Fi(t.contractName)), Ee(e);
}
function ZS(t) {
  const e = cn(t, Qt) ? t : new Qt(t), n = e.readUInt8Enum(Ze, (s) => {
    throw new Xe(`Unexpected Principal payload type: ${s}`);
  });
  if (n === Ze.Origin)
    return { type: et.Principal, prefix: n };
  const r = Di(e);
  if (n === Ze.Standard)
    return { type: et.Principal, prefix: n, address: r };
  const i = Cn(e);
  return {
    type: et.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function Fi(t) {
  const e = [], n = Qs(t.content), r = n.byteLength;
  return e.push(Ut(To(r, t.lengthPrefixBytes))), e.push(n), Ee(e);
}
function Cn(t, e, n) {
  e = e || 1;
  const r = cn(t, Qt) ? t : new Qt(t), i = rc(dt(r.readBytes(e))), s = Bo(r.readBytes(i));
  return jn(s, e, n ?? 128);
}
function QS(t) {
  const e = [], n = Qs(t.content), r = k3(dt(n), ja * 2);
  return e.push(Ut(r)), Ee(e);
}
function tg(t) {
  const e = cn(t, Qt) ? t : new Qt(t);
  let n = Bo(e.readBytes(ja));
  return n = n.replace(/\u0000*$/, ""), { type: et.MemoString, content: n };
}
function eg(t) {
  const e = [];
  return e.push(Uo(t.address)), e.push(Fi(t.contractName)), e.push(Fi(t.assetName)), Ee(e);
}
function Hl(t) {
  const e = cn(t, Qt) ? t : new Qt(t);
  return {
    type: et.Asset,
    address: Di(e),
    contractName: Cn(e),
    assetName: Cn(e)
  };
}
function Ru(t) {
  const e = t.values, n = [];
  n.push(Ut(To(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(mr(r));
  return Ee(n);
}
function ng(t, e, n) {
  const r = cn(t, Qt) ? t : new Qt(t), i = rc(dt(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case et.Address:
        s.push(Di(r));
        break;
      case et.LengthPrefixedString:
        s.push(Cn(r));
        break;
      case et.MemoString:
        s.push(tg(r));
        break;
      case et.Asset:
        s.push(Hl(r));
        break;
      case et.PostCondition:
        s.push(t3(r));
        break;
      case et.PublicKey:
        s.push(Fl(r));
        break;
      case et.TransactionAuthField:
        s.push(n3(r));
        break;
    }
  return zu(s, n);
}
function JS(t) {
  return dt(rg(t));
}
function rg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Jp(t.principal)), (t.conditionType === ie.Fungible || t.conditionType === ie.NonFungible) && e.push(eg(t.asset)), t.conditionType === ie.NonFungible && e.push(er(t.assetName)), e.push(t.conditionCode), t.conditionType === ie.STX || t.conditionType === ie.Fungible || t.conditionType === ie.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ei("The post-condition amount may not be larger than 8 bytes");
    e.push(ps(t.amount, 8));
  }
  return Ee(e);
}
function t3(t) {
  const e = cn(t, Qt) ? t : new Qt(t), n = e.readUInt8Enum(ie, (a) => {
    throw new Xe(`Could not read ${a} as PostConditionType`);
  }), r = ZS(e);
  let i, s, o;
  switch (n) {
    case ie.STX:
      return i = e.readUInt8Enum(po, (c) => {
        throw new Xe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${dt(e.readBytes(8))}`), {
        type: et.PostCondition,
        conditionType: ie.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ie.Fungible:
      return s = Hl(e), i = e.readUInt8Enum(po, (c) => {
        throw new Xe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${dt(e.readBytes(8))}`), {
        type: et.PostCondition,
        conditionType: ie.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case ie.NonFungible:
      s = Hl(e);
      const a = Qn(e);
      return i = e.readUInt8Enum(Bl, (c) => {
        throw new Xe(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: et.PostCondition,
        conditionType: ie.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case ie.Staking:
      return i = e.readUInt8Enum(po, (c) => {
        throw new Xe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${dt(e.readBytes(8))}`), {
        type: et.PostCondition,
        conditionType: ie.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ie.PoX: {
      const c = e.readUInt8Enum(Ml, (u) => {
        throw new Xe(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: et.PostCondition,
        conditionType: ie.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function sg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Rt.TokenTransfer:
      e.push(er(t.recipient)), e.push(ps(t.amount, 8)), e.push(mr(t.memo));
      break;
    case Rt.ContractCall:
      e.push(mr(t.contractAddress)), e.push(mr(t.contractName)), e.push(mr(t.functionName));
      const n = new Uint8Array(4);
      Ps(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(er(r));
      });
      break;
    case Rt.SmartContract:
      e.push(mr(t.contractName)), e.push(mr(t.codeBody));
      break;
    case Rt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(mr(t.contractName)), e.push(mr(t.codeBody));
      break;
    case Rt.PoisonMicroblock:
      break;
    case Rt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Rt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(er(t.recipient));
      break;
    case Rt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(er(t.recipient ? Qp(t.recipient) : Zp())), e.push(t.vrfProof);
      break;
    case Rt.TenureChange:
      e.push(Ut(t.tenureHash)), e.push(Ut(t.previousTenureHash)), e.push(Ut(t.burnViewHash)), e.push(Ut(t.previousTenureEnd)), e.push(Ps(new Uint8Array(4), t.previousTenureBlocks)), e.push(Zw(new Uint8Array(1), t.cause)), e.push(Ut(t.publicKeyHash));
      break;
  }
  return Ee(e);
}
function e3(t) {
  const e = cn(t, Qt) ? t : new Qt(t);
  switch (e.readUInt8Enum(Rt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Rt.TokenTransfer:
      const r = Qn(e), i = qe(e.readBytes(8)), s = tg(e);
      return zS(r, i, s);
    case Rt.ContractCall:
      const o = Di(e), a = Cn(e), c = Cn(e), u = [], d = e.readUInt32BE();
      for (let P = 0; P < d; P++) {
        const B = Qn(e);
        u.push(B);
      }
      return RS(o, a, c, u);
    case Rt.SmartContract:
      const l = Cn(e), g = Cn(e, 4, 1e5);
      return _d(l, g);
    case Rt.VersionedSmartContract: {
      const P = e.readUInt8Enum(Tl, (U) => {
        throw new Error(`Cannot recognize ClarityVersion: ${U}`);
      }), B = Cn(e), A = Cn(e, 4, jx);
      return _d(B, A, P);
    }
    case Rt.PoisonMicroblock:
      return KS();
    case Rt.Coinbase: {
      const P = e.readBytes(Ts);
      return Ud(P);
    }
    case Rt.CoinbaseToAltRecipient: {
      const P = e.readBytes(Ts), B = Qn(e);
      return Ud(P, B);
    }
    case Rt.NakamotoCoinbase: {
      const P = e.readBytes(Ts), B = Qn(e), A = e.readBytes(Cl);
      return VS(P, B, A);
    }
    case Rt.TenureChange:
      const p = dt(e.readBytes(20)), k = dt(e.readBytes(20)), x = dt(e.readBytes(20)), M = dt(e.readBytes(32)), q = e.readUInt32BE(), K = e.readUInt8Enum(Nl, (P) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${P}`);
      }), $ = dt(e.readBytes(20));
      return qS(p, k, x, M, q, K, $);
  }
}
function Ol(t) {
  const e = cn(t, Qt) ? t : new Qt(t);
  return Ul(dt(e.readBytes(yc)));
}
function n3(t) {
  const e = cn(t, Qt) ? t : new Qt(t), n = e.readUInt8Enum(On, (r) => {
    throw new Xe(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case On.PublicKeyCompressed:
      return Ai(ue.Compressed, Fl(e));
    case On.PublicKeyUncompressed:
      return Ai(ue.Uncompressed, Wi(H3(Fl(e).data)));
    case On.SignatureCompressed:
      return Ai(ue.Compressed, Ol(e));
    case On.SignatureUncompressed:
      return Ai(ue.Uncompressed, Ol(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Gu(t) {
  return Ut(t.data);
}
function r3(t) {
  const e = [];
  switch (t.contents.type) {
    case et.PublicKey:
      e.push(t.pubKeyEncoding === ue.Compressed ? On.PublicKeyCompressed : On.PublicKeyUncompressed), e.push(Ut(U3(t.contents.data)));
      break;
    case et.MessageSignature:
      e.push(t.pubKeyEncoding === ue.Compressed ? On.SignatureCompressed : On.SignatureUncompressed), e.push(Gu(t.contents));
      break;
  }
  return Ee(e);
}
function Dl(t) {
  return t.data.slice();
}
function Fl(t) {
  const e = cn(t, Qt) ? t : new Qt(t), n = e.readUInt8(), r = n === 4 ? Nx : Mx;
  return Wi(Ee([n, e.readBytes(r)]));
}
function Ku(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Wt.P2PKH || e === Wt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Wt.P2WPKH || e === Wt.P2WSH || e === Wt.P2WSHNonSequential) && !r.map((i) => i.data).every(Xi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Wt.P2PKH:
      return ra(t, I3(r[0].data));
    case Wt.P2WPKH:
      return ra(t, L3(r[0].data));
    case Wt.P2SH:
    case Wt.P2SHNonSequential:
      return ra(t, C3(n, r.map(Dl)));
    case Wt.P2WSH:
    case Wt.P2WSHNonSequential:
      return ra(t, T3(n, r.map(Dl)));
  }
}
function ra(t, e) {
  return { type: et.Address, version: t, hash160: e };
}
function Vu(t) {
  return ni.c32address(t.version, t.hash160);
}
function Hd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return WS(e, n, r);
}
function so(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return XS(e, n);
  } else
    return YS(t);
}
function s3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return a3(e, n);
  } else
    return i3(t);
}
function i3(t) {
  const e = ys(t);
  return { type: Pt.PrincipalStandard, value: Vu(e) };
}
function o3(t) {
  return { type: Pt.PrincipalStandard, value: Vu(t) };
}
function a3(t, e) {
  const n = ys(t), r = jn(e);
  return ig(n, r);
}
function ig(t, e) {
  if (Qs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Pt.PrincipalContract,
    value: `${Vu(t)}.${e.content}`
  };
}
function c3(t) {
  return { type: Pt.ResponseErr, value: t };
}
function l3(t) {
  return { type: Pt.ResponseOk, value: t };
}
const u3 = (t) => ({ type: Pt.StringASCII, value: t }), f3 = (t) => ({ type: Pt.StringUTF8, value: t });
function d3(t) {
  for (const e in t)
    if (!B3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Pt.Tuple, value: t };
}
function Qn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Qt(Ut(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Qt(t) : e = t;
  switch (e.readUInt8Enum(Ne, (r) => {
    throw new Xe(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ne.int:
      return OS(hl(e.readBytes(16)));
    case Ne.uint:
      return DS(e.readBytes(16));
    case Ne.buffer:
      const r = e.readUInt32BE();
      return US(e.readBytes(r));
    case Ne.true:
      return PS();
    case Ne.false:
      return _S();
    case Ne.address:
      const i = Di(e);
      return o3(i);
    case Ne.contract:
      const s = Di(e), o = Cn(e);
      return ig(s, o);
    case Ne.ok:
      return l3(Qn(e));
    case Ne.err:
      return c3(Qn(e));
    case Ne.none:
      return Zp();
    case Ne.some:
      return Qp(Qn(e));
    case Ne.list:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Qn(e));
      return FS(c);
    case Ne.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let x = 0; x < u; x++) {
        const M = Cn(e).content;
        if (M === void 0)
          throw new Xe('"content" is undefined');
        d[M] = Qn(e);
      }
      return d3(d);
    case Ne.ascii:
      const l = e.readUInt32BE(), g = Rw(e.readBytes(l));
      return u3(g);
    case Ne.utf8:
      const p = e.readUInt32BE(), k = Bo(e.readBytes(p));
      return f3(k);
    default:
      throw new Xe("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function or(t, e) {
  return Ee([ju(t), e]);
}
function h3(t) {
  return new Uint8Array([ju(t.type)]);
}
function p3(t) {
  return t.type === Pt.OptionalNone ? new Uint8Array([ju(t.type)]) : or(t.type, er(t.value));
}
function g3(t) {
  const e = new Uint8Array(4);
  return Ps(e, Math.ceil(t.value.length / 2), 0), or(t.type, sr(e, Ut(t.value)));
}
function y3(t) {
  const e = yu(Ow(BigInt(t.value), BigInt(Bx)), zp);
  return or(t.type, e);
}
function w3(t) {
  const e = yu(BigInt(t.value), zp);
  return or(t.type, e);
}
function b3(t) {
  return or(t.type, Uo(ys(t.value)));
}
function m3(t) {
  const [e, n] = M3(t.value);
  return or(t.type, sr(Uo(ys(e)), Fi(jn(n))));
}
function x3(t) {
  return or(t.type, er(t.value));
}
function S3(t) {
  const e = [], n = new Uint8Array(4);
  Ps(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = er(r);
    e.push(i);
  }
  return or(t.type, Ee(e));
}
function E3(t) {
  const e = [], n = new Uint8Array(4);
  Ps(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = jn(i);
    e.push(Fi(s));
    const o = er(t.value[i]);
    e.push(o);
  }
  return or(t.type, Ee(e));
}
function og(t, e) {
  const n = [], r = e == "ascii" ? zw(t.value) : Qs(t.value), i = new Uint8Array(4);
  return Ps(i, r.length, 0), n.push(i), n.push(r), or(t.type, Ee(n));
}
function A3(t) {
  return og(t, "ascii");
}
function v3(t) {
  return og(t, "utf8");
}
function Od(t) {
  return dt(er(t));
}
function er(t) {
  switch (t.type) {
    case Pt.BoolTrue:
    case Pt.BoolFalse:
      return h3(t);
    case Pt.OptionalNone:
    case Pt.OptionalSome:
      return p3(t);
    case Pt.Buffer:
      return g3(t);
    case Pt.UInt:
      return w3(t);
    case Pt.Int:
      return y3(t);
    case Pt.PrincipalStandard:
      return b3(t);
    case Pt.PrincipalContract:
      return m3(t);
    case Pt.ResponseOk:
    case Pt.ResponseErr:
      return x3(t);
    case Pt.List:
      return S3(t);
    case Pt.Tuple:
      return E3(t);
    case Pt.StringASCII:
      return A3(t);
    case Pt.StringUTF8:
      return v3(t);
    default:
      throw new Ei("Unable to serialize. Invalid Clarity Value.");
  }
}
const $3 = (t) => t.length % 2 ? `0${t}` : t, k3 = (t, e) => t.padEnd(e, "0"), ag = (t, e) => t ? Qs(t).length > e : !1;
function jl(t) {
  return Op(t);
}
const mo = (t) => oS(Ou(t)), qu = (t) => dt(NS(t)), I3 = (t) => dt(mo(t)), L3 = (t) => {
  const e = mo(t), n = sr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = mo(n);
  return dt(r);
}, C3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = Ee(n), i = mo(r);
  return dt(i);
}, T3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ee(n), i = Ou(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = Ee(s), a = mo(o);
  return dt(a);
};
function B3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function M3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
me.hmacSha256Sync = (t, ...e) => {
  const n = Vp.create(Ou, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Wi(t) {
  return t = typeof t == "string" ? Ut(t) : t, {
    type: et.PublicKey,
    data: t
  };
}
function N3(t, e, n = ue.Compressed) {
  const r = qw(e), i = new mn(Of(r.r), Of(r.s)), s = Tt.fromSignature(t, i, r.recoveryId), o = n === ue.Compressed;
  return s.toHex(o);
}
function P3(t) {
  return typeof t == "string" ? t : dt(t);
}
const Wu = P3;
function cg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Vw;
}
function Xi(t) {
  return !Wu(t).startsWith("04");
}
function _3(t) {
  t = wu(t);
  const e = cg(t);
  return dt(Mo(t.slice(0, 32), e));
}
function U3(t) {
  return Tt.fromHex(Wu(t)).toHex(!0);
}
function H3(t) {
  return Tt.fromHex(Wu(t)).toHex(!1);
}
function O3(t, e) {
  t = wu(t);
  const [n, r] = ic(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return To(r, 1) + mn.fromHex(n).toCompactHex();
}
function Xu() {
  return {
    type: et.MessageSignature,
    data: dt(new Uint8Array(yc))
  };
}
function lg(t, e, n, r) {
  const i = Ku(0, t, 1, [Wi(e)]).hash160, s = Xi(e) ? ue.Compressed : ue.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: qe(n),
    fee: qe(r),
    keyEncoding: s,
    signature: Xu()
  };
}
function xo(t) {
  return "signature" in t;
}
function Dd(t) {
  return t === Wt.P2SH || t === Wt.P2WSH;
}
function D3(t) {
  return t === Wt.P2SHNonSequential || t === Wt.P2WSHNonSequential;
}
function Fd(t) {
  const e = jl(t);
  return e.nonce = 0, e.fee = 0, xo(e) ? e.signature = Xu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function F3(t) {
  const e = [
    t.hashMode,
    Ut(t.signer),
    ps(t.nonce, 8),
    ps(t.fee, 8),
    t.keyEncoding,
    Gu(t.signature)
  ];
  return Ee(e);
}
function j3(t) {
  const e = [
    t.hashMode,
    Ut(t.signer),
    ps(t.nonce, 8),
    ps(t.fee, 8)
  ], n = zu(t.fields);
  e.push(Ru(n));
  const r = new Uint8Array(2);
  return Xw(r, t.signaturesRequired, 0), e.push(r), Ee(e);
}
function z3(t, e) {
  const n = dt(e.readBytes(20)), r = BigInt(`0x${dt(e.readBytes(8))}`), i = BigInt(`0x${dt(e.readBytes(8))}`), s = e.readUInt8Enum(ue, (a) => {
    throw new Xe(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Wt.P2WPKH && s != ue.Compressed)
    throw new Xe("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ol(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function R3(t, e) {
  const n = dt(e.readBytes(20)), r = BigInt("0x" + dt(e.readBytes(8))), i = BigInt("0x" + dt(e.readBytes(8))), s = ng(e, et.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case et.PublicKey:
        Xi(u.contents.data) || (o = !0);
        break;
      case et.MessageSignature:
        if (u.pubKeyEncoding === ue.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new vs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Wt.P2WSH || t === Wt.P2WSHNonSequential))
    throw new vs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function Gc(t) {
  return xo(t) ? F3(t) : j3(t);
}
function Kc(t) {
  const e = t.readUInt8Enum(Wt, (n) => {
    throw new Xe(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Wt.P2PKH || e === Wt.P2WPKH ? z3(e, t) : R3(e, t);
}
function ug(t, e, n, r) {
  const s = t + dt(new Uint8Array([e])) + dt(ps(n, 8)) + dt(ps(r, 8));
  if (Ut(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return qu(Ut(s));
}
function fg(t, e, n) {
  const r = 33 + yc, i = Xi(e.data) ? ue.Compressed : ue.Uncompressed, s = t + $3(i.toString(16)) + n, o = Ut(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return qu(o);
}
function G3(t, e, n, r, i) {
  const s = ug(t, e, n, r), o = O3(i, s), a = Wi(_3(i)), c = fg(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function dg(t, e, n, r, i, s) {
  const o = ug(t, e, n, r), a = Wi(N3(o, s, i)), c = fg(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function K3() {
  const t = lg(Wt.P2PKH, "", 0, 0);
  return t.signer = jS().hash160, t.keyEncoding = ue.Compressed, t.signature = Xu(), t;
}
function jd(t, e, n) {
  return xo(t) ? V3(t, e, n) : q3(t, e, n);
}
function V3(t, e, n) {
  const { pubKey: r, nextSigHash: i } = dg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = Ku(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new vs(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function q3(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case et.PublicKey:
        Xi(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case et.MessageSignature:
        c.pubKeyEncoding === ue.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = dg(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Dd(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new vs("Too many signatures");
        break;
    }
  if (Dd(t.hashMode) && o !== t.signaturesRequired || D3(t.hashMode) && o < t.signaturesRequired)
    throw new vs("Incorrect number of signatures");
  if (s && (t.hashMode === Wt.P2WSH || t.hashMode === Wt.P2WSHNonSequential))
    throw new vs("Uncompressed keys are not allowed in this hash mode");
  const a = Ku(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new vs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function hg(t) {
  return {
    authType: we.Standard,
    spendingCondition: t
  };
}
function pg(t, e) {
  return {
    authType: we.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || lg(Wt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function zd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case we.Standard:
        return hg(Fd(t.spendingCondition));
      case we.Sponsored:
        return pg(Fd(t.spendingCondition), K3());
      default:
        throw new Ra("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function W3(t, e) {
  switch (t.authType) {
    case we.Standard:
      return jd(t.spendingCondition, e, we.Standard);
    case we.Sponsored:
      return jd(t.spendingCondition, e, we.Standard);
    default:
      throw new Ra("Invalid origin auth type");
  }
}
function X3(t, e) {
  switch (t.authType) {
    case we.Standard:
      const n = {
        ...t.spendingCondition,
        fee: qe(e)
      };
      return { ...t, spendingCondition: n };
    case we.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: qe(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Y3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: qe(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Z3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: qe(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Q3(t, e) {
  const n = {
    ...e,
    nonce: qe(e.nonce),
    fee: qe(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function J3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case we.Standard:
      e.push(Gc(t.spendingCondition));
      break;
    case we.Sponsored:
      e.push(Gc(t.spendingCondition)), e.push(Gc(t.sponsorSpendingCondition));
      break;
  }
  return Ee(e);
}
function tE(t) {
  const e = t.readUInt8Enum(we, (r) => {
    throw new Xe(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case we.Standard:
      return n = Kc(t), hg(n);
    case we.Sponsored:
      n = Kc(t);
      const r = Kc(t);
      return pg(n, r);
  }
}
class eE {
  constructor({ auth: e, payload: n, postConditions: r = zu([]), postConditionMode: i = za.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = Lx(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: qe(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = pn.Any;
  }
  signBegin() {
    const e = jl(this);
    return e.auth = zd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = jl(this);
    return e.auth = zd(e.auth), e.txid();
  }
  verifyOrigin() {
    return W3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, we.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === we.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, we.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Wi(e), r = this.auth.spendingCondition;
    if (r && !xo(r)) {
      const i = Xi(n.data);
      r.fields.push(Ai(i ? ue.Compressed : ue.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = G3(n, r, e.fee, e.nonce, i);
    if (xo(e))
      e.signature = Ul(s);
    else {
      const a = cg(i);
      e.fields.push(Ai(a ? ue.Compressed : ue.Uncompressed, Ul(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return qu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != we.Sponsored)
      throw new Ra("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Q3(this.auth, e);
  }
  setFee(e) {
    this.auth = X3(this.auth, e);
  }
  setNonce(e) {
    this.auth = Y3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != we.Sponsored)
      throw new Ra("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Z3(this.auth, e);
  }
  serialize() {
    return dt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ei('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ei('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ei('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ei('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Ps(n, this.chainId, 0), e.push(n), e.push(J3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ru(this.postConditions)), e.push(sg(this.payload)), Ee(e);
  }
}
function nE(t) {
  const e = cn(t, Qt) ? t : new Qt(t), n = e.readUInt8Enum(Rs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = tE(e), s = e.readUInt8Enum(pn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(za, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = ng(e, et.PostCondition), c = e3(e), u = new eE({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = s, u;
}
const Rd = BigInt("18446744073709551615");
function Vc(t) {
  const e = qe(t);
  if (e < 0n || e > Rd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Rd} (u64 max), received: ${e}`);
  return e;
}
var zl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(zl || (zl = {}));
var Rl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Rl || (Rl = {}));
function rE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: et.PostCondition,
        conditionType: ie.STX,
        principal: t.address === "origin" ? { type: et.Principal, prefix: Ze.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Vc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: et.PostCondition,
        conditionType: ie.Fungible,
        principal: t.address === "origin" ? { type: et.Principal, prefix: Ze.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Vc(t.amount),
        asset: Hd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: et.PostCondition,
        conditionType: ie.NonFungible,
        principal: t.address === "origin" ? { type: et.Principal, prefix: Ze.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        asset: Hd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: et.PostCondition,
        conditionType: ie.Staking,
        principal: t.address === "origin" ? { type: et.Principal, prefix: Ze.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Vc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: et.PostCondition,
        conditionType: ie.PoX,
        principal: t.address === "origin" ? { type: et.Principal, prefix: Ze.Origin } : so(t.address),
        conditionCode: sE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function sa(t) {
  return zl[t];
}
function sE(t) {
  return Rl[t];
}
function gg(t) {
  const e = rE(t);
  return JS(e);
}
function iE(t, e, n) {
  return Zu(yg(t), n);
}
function yg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = So(r);
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
    return BigInt(`0x${cE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Yu(t, e = 8) {
  return (typeof t == "bigint" ? t : yg(t)).toString(16).padStart(e * 2, "0");
}
function Zu(t, e = 16) {
  const n = Yu(t, e);
  return So(n);
}
function oE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const aE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += aE[n];
  return e;
}
function So(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const i = r * 2, s = e.slice(i, i + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Qu(t) {
  return new TextEncoder().encode(t);
}
function lE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function uE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Gd(t) {
  if (t.some(uE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ju(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function kr(t) {
  return Ju(...t.map((e) => typeof e == "number" ? Gd([e]) : e instanceof Array ? Gd(e) : e));
}
function mc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Gl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Gl || (Gl = {}));
Gl.Mainnet;
const fE = 128, dE = 128, wg = 16;
var Kl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Kl || (Kl = {}));
var Kd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Kd || (Kd = {}));
var Vd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Vd || (Vd = {}));
var Hn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Hn || (Hn = {}));
const qc = ["onChainOnly", "offChainOnly", "any"];
qc[0] + "", Hn.OnChainOnly, qc[1] + "", Hn.OffChainOnly, qc[2] + "", Hn.Any, Hn.OnChainOnly + "", Hn.OnChainOnly, Hn.OffChainOnly + "", Hn.OffChainOnly, Hn.Any + "", Hn.Any;
var Vl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vl || (Vl = {}));
Vl.Mainnet;
var qd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(qd || (qd = {}));
var xs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(xs || (xs = {}));
var Wd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Wd || (Wd = {}));
var Xd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Xd || (Xd = {}));
var Yd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Yd || (Yd = {}));
var Zd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Zd || (Zd = {}));
var Qd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Qd || (Qd = {}));
var Jd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Jd || (Jd = {}));
var ql;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ql || (ql = {}));
var th;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(th || (th = {}));
var eh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(eh || (eh = {}));
function Wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function hE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function bg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function pE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Wl(t.outputLen), Wl(t.blockLen);
}
function gE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function yE(t, e) {
  bg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Wc = {
  number: Wl,
  bool: hE,
  bytes: bg,
  hash: pE,
  exists: gE,
  output: yE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Wn = (t, e) => t << 32 - e | t >>> e, wE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!wE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function mg(t) {
  if (typeof t == "string" && (t = bE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let mE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function si(t) {
  const e = (r) => t().update(mg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function xE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let tf = class extends mE {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Xc(this.buffer);
  }
  update(e) {
    Wc.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = mg(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Xc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Wc.exists(this), Wc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    xE(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Xc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const SE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), xg = Uint8Array.from({ length: 16 }, (t, e) => e), EE = xg.map((t) => (9 * t + 5) % 16);
let ef = [xg], nf = [EE];
for (let t = 0; t < 4; t++)
  for (let e of [ef, nf])
    e.push(e[t].map((n) => SE[n]));
const Sg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), AE = ef.map((t, e) => t.map((n) => Sg[e][n])), vE = nf.map((t, e) => t.map((n) => Sg[e][n])), $E = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), kE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ia = (t, e) => t << e | t >>> 32 - e;
function nh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oa = new Uint32Array(16);
let IE = class extends tf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      oa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const k = 4 - p, x = $E[p], M = kE[p], q = ef[p], K = nf[p], $ = AE[p], P = vE[p];
      for (let B = 0; B < 16; B++) {
        const A = ia(r + nh(p, s, a, u) + oa[q[B]] + x, $[B]) + l | 0;
        r = l, l = u, u = ia(a, 10) | 0, a = s, s = A;
      }
      for (let B = 0; B < 16; B++) {
        const A = ia(i + nh(k, o, c, d) + oa[K[B]] + M, P[B]) + g | 0;
        i = g, g = d, d = ia(c, 10) | 0, c = o, o = A;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    oa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
si(() => new IE());
const LE = (t, e, n) => t & e ^ ~t & n, CE = (t, e, n) => t & e ^ t & n ^ e & n, TE = new Uint32Array([
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
]), Qr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jr = new Uint32Array(64);
let Eg = class extends tf {
  constructor() {
    super(64, 32, 8, !1), this.A = Qr[0] | 0, this.B = Qr[1] | 0, this.C = Qr[2] | 0, this.D = Qr[3] | 0, this.E = Qr[4] | 0, this.F = Qr[5] | 0, this.G = Qr[6] | 0, this.H = Qr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Jr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Jr[l - 15], p = Jr[l - 2], k = Wn(g, 7) ^ Wn(g, 18) ^ g >>> 3, x = Wn(p, 17) ^ Wn(p, 19) ^ p >>> 10;
      Jr[l] = x + Jr[l - 7] + k + Jr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Wn(a, 6) ^ Wn(a, 11) ^ Wn(a, 25), p = d + g + LE(a, c, u) + TE[l] + Jr[l] | 0, x = (Wn(r, 2) ^ Wn(r, 13) ^ Wn(r, 22)) + CE(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Jr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, BE = class extends Eg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
si(() => new Eg());
si(() => new BE());
const aa = BigInt(2 ** 32 - 1), Xl = BigInt(32);
function Ag(t, e = !1) {
  return e ? { h: Number(t & aa), l: Number(t >> Xl & aa) } : { h: Number(t >> Xl & aa) | 0, l: Number(t & aa) | 0 };
}
function ME(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Ag(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const NE = (t, e) => BigInt(t >>> 0) << Xl | BigInt(e >>> 0), PE = (t, e, n) => t >>> n, _E = (t, e, n) => t << 32 - n | e >>> n, UE = (t, e, n) => t >>> n | e << 32 - n, HE = (t, e, n) => t << 32 - n | e >>> n, OE = (t, e, n) => t << 64 - n | e >>> n - 32, DE = (t, e, n) => t >>> n - 32 | e << 64 - n, FE = (t, e) => e, jE = (t, e) => t, zE = (t, e, n) => t << n | e >>> 32 - n, RE = (t, e, n) => e << n | t >>> 32 - n, GE = (t, e, n) => e << n - 32 | t >>> 64 - n, KE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function VE(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const qE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), WE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, XE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), YE = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, ZE = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), QE = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, $t = {
  fromBig: Ag,
  split: ME,
  toBig: NE,
  shrSH: PE,
  shrSL: _E,
  rotrSH: UE,
  rotrSL: HE,
  rotrBH: OE,
  rotrBL: DE,
  rotr32H: FE,
  rotr32L: jE,
  rotlSH: zE,
  rotlSL: RE,
  rotlBH: GE,
  rotlBL: KE,
  add: VE,
  add3L: qE,
  add3H: WE,
  add4L: XE,
  add4H: YE,
  add5H: QE,
  add5L: ZE
}, [JE, tA] = $t.split([
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
].map((t) => BigInt(t))), ts = new Uint32Array(80), es = new Uint32Array(80);
let xc = class extends tf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: k, Hh: x, Hl: M } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, g, p, k, x, M];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, g, p, k, x, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = k | 0, this.Hh = x | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let $ = 0; $ < 16; $++, n += 4)
      ts[$] = e.getUint32(n), es[$] = e.getUint32(n += 4);
    for (let $ = 16; $ < 80; $++) {
      const P = ts[$ - 15] | 0, B = es[$ - 15] | 0, A = $t.rotrSH(P, B, 1) ^ $t.rotrSH(P, B, 8) ^ $t.shrSH(P, B, 7), U = $t.rotrSL(P, B, 1) ^ $t.rotrSL(P, B, 8) ^ $t.shrSL(P, B, 7), _ = ts[$ - 2] | 0, L = es[$ - 2] | 0, S = $t.rotrSH(_, L, 19) ^ $t.rotrBH(_, L, 61) ^ $t.shrSH(_, L, 6), C = $t.rotrSL(_, L, 19) ^ $t.rotrBL(_, L, 61) ^ $t.shrSL(_, L, 6), b = $t.add4L(U, C, es[$ - 7], es[$ - 16]), N = $t.add4H(b, A, S, ts[$ - 7], ts[$ - 16]);
      ts[$] = N | 0, es[$] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: k, Gh: x, Gl: M, Hh: q, Hl: K } = this;
    for (let $ = 0; $ < 80; $++) {
      const P = $t.rotrSH(l, g, 14) ^ $t.rotrSH(l, g, 18) ^ $t.rotrBH(l, g, 41), B = $t.rotrSL(l, g, 14) ^ $t.rotrSL(l, g, 18) ^ $t.rotrBL(l, g, 41), A = l & p ^ ~l & x, U = g & k ^ ~g & M, _ = $t.add5L(K, B, U, tA[$], es[$]), L = $t.add5H(_, q, P, A, JE[$], ts[$]), S = _ | 0, C = $t.rotrSH(r, i, 28) ^ $t.rotrBH(r, i, 34) ^ $t.rotrBH(r, i, 39), b = $t.rotrSL(r, i, 28) ^ $t.rotrBL(r, i, 34) ^ $t.rotrBL(r, i, 39), N = r & s ^ r & a ^ s & a, Z = i & o ^ i & c ^ o & c;
      q = x | 0, K = M | 0, x = p | 0, M = k | 0, p = l | 0, k = g | 0, { h: l, l: g } = $t.add(u | 0, d | 0, L | 0, S | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const V = $t.add3L(S, b, Z);
      r = $t.add3H(V, L, C, N), i = V | 0;
    }
    ({ h: r, l: i } = $t.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = $t.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = $t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = $t.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = $t.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: k } = $t.add(this.Fh | 0, this.Fl | 0, p | 0, k | 0), { h: x, l: M } = $t.add(this.Gh | 0, this.Gl | 0, x | 0, M | 0), { h: q, l: K } = $t.add(this.Hh | 0, this.Hl | 0, q | 0, K | 0), this.set(r, i, s, o, a, c, u, d, l, g, p, k, x, M, q, K);
  }
  roundClean() {
    ts.fill(0), es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, eA = class extends xc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, nA = class extends xc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, rA = class extends xc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
si(() => new xc());
si(() => new eA());
si(() => new nA());
si(() => new rA());
function sA(t, e, n) {
  const i = fE;
  if (xA(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Kl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var _e;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(_e || (_e = {}));
let iA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, vg = class extends iA {
  constructor(e) {
    super(e);
  }
};
function Sc(t) {
  const e = [];
  return e.push(So(Yu(t.version, 1))), e.push(So(t.hash160)), kr(e);
}
function oA(t) {
  const e = [];
  return e.push(t.prefix), e.push(Sc(t.address)), t.prefix === ql.Contract && e.push(Eo(t.contractName)), kr(e);
}
function Eo(t) {
  const e = [], n = Qu(t.content), r = n.byteLength;
  return e.push(So(Yu(r, t.lengthPrefixBytes))), e.push(n), kr(e);
}
function aA(t) {
  const e = [];
  return e.push(Sc(t.address)), e.push(Eo(t.contractName)), e.push(Eo(t.assetName)), kr(e);
}
function $g(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(oA(t.principal)), (t.conditionType === xs.Fungible || t.conditionType === xs.NonFungible) && e.push(aA(t.assetInfo)), t.conditionType === xs.NonFungible && e.push(Ks(t.assetName)), e.push(t.conditionCode), t.conditionType === xs.STX || t.conditionType === xs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new vg("The post-condition amount may not be larger than 8 bytes");
    e.push(iE(t.amount, !1, 8));
  }
  return kr(e);
}
function ar(t, e) {
  return kr([t, e]);
}
function cA(t) {
  return new Uint8Array([t.type]);
}
function lA(t) {
  return t.type === _e.OptionalNone ? new Uint8Array([t.type]) : ar(t.type, Ks(t.value));
}
function uA(t) {
  const e = new Uint8Array(4);
  return mc(e, t.buffer.length, 0), ar(t.type, Ju(e, t.buffer));
}
function fA(t) {
  const e = Zu(oE(t.value, BigInt(dE)), wg);
  return ar(t.type, e);
}
function dA(t) {
  const e = Zu(t.value, wg);
  return ar(t.type, e);
}
function hA(t) {
  return ar(t.type, Sc(t.address));
}
function pA(t) {
  return ar(t.type, Ju(Sc(t.address), Eo(t.contractName)));
}
function gA(t) {
  return ar(t.type, Ks(t.value));
}
function yA(t) {
  const e = [], n = new Uint8Array(4);
  mc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Ks(r);
    e.push(i);
  }
  return ar(t.type, kr(e));
}
function wA(t) {
  const e = [], n = new Uint8Array(4);
  mc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = sA(i);
    e.push(Eo(s));
    const o = Ks(t.data[i]);
    e.push(o);
  }
  return ar(t.type, kr(e));
}
function kg(t, e) {
  const n = [], r = e == "ascii" ? lE(t.data) : Qu(t.data), i = new Uint8Array(4);
  return mc(i, r.length, 0), n.push(i), n.push(r), ar(t.type, kr(n));
}
function bA(t) {
  return kg(t, "ascii");
}
function mA(t) {
  return kg(t, "utf8");
}
function Ks(t) {
  switch (t.type) {
    case _e.BoolTrue:
    case _e.BoolFalse:
      return cA(t);
    case _e.OptionalNone:
    case _e.OptionalSome:
      return lA(t);
    case _e.Buffer:
      return uA(t);
    case _e.UInt:
      return dA(t);
    case _e.Int:
      return fA(t);
    case _e.PrincipalStandard:
      return hA(t);
    case _e.PrincipalContract:
      return pA(t);
    case _e.ResponseOk:
    case _e.ResponseErr:
      return gA(t);
    case _e.List:
      return yA(t);
    case _e.Tuple:
      return wA(t);
    case _e.StringASCII:
      return bA(t);
    case _e.StringUTF8:
      return mA(t);
    default:
      throw new vg("Unable to serialize. Invalid Clarity Value.");
  }
}
const xA = (t, e) => t ? Qu(t).length > e : !1, SA = "connect-ui";
let va, Ig, gn = !1, Yl = !1;
const $r = (t, e = "") => () => {
}, EA = (t, e) => () => {
}, AA = "{visibility:hidden}.hydrated{visibility:inherit}", rh = {}, vA = "http://www.w3.org/2000/svg", $A = "http://www.w3.org/1999/xhtml", kA = (t) => t != null, rf = (t) => (t = typeof t, t === "object" || t === "function");
function Lg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const St = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !rf(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? Zl(null, r) : r), s = i);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Zl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Zl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, IA = {}, LA = (t) => t && t.$tag$ === IA, CA = (t, e) => t != null && !rf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, TA = (t) => Yi(t).$hostElement$, BA = (t, e, n) => {
  const r = Ve.ce(e, n);
  return t.dispatchEvent(r), r;
}, sh = /* @__PURE__ */ new WeakMap(), MA = (t, e, n) => {
  let r = Ga.get(t);
  QA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ga.set(t, r);
}, NA = (t, e, n, r) => {
  var i;
  let s = Cg(e);
  const o = Ga.get(s);
  if (t = t.nodeType === 11 ? t : nr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = sh.get(t), c;
      if (a || sh.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = nr.createElement("style"), c.innerHTML = o;
          const u = (i = Ve.$nonce$) !== null && i !== void 0 ? i : Lg(nr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, PA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = $r("attachStyles", e.$tagName$), s = NA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, Cg = (t, e) => "sc-" + t.$tagName$, ih = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = ah(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = oh(n), d = oh(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : ah(Ec, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Ve.rel(t, e, n, !1), r && Ve.ael(t, e, r, !1);
    else {
      const c = rf(r);
      if ((o || c && r !== null) && !i)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const u = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != u) && (t[e] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || s & 4 || i) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, _A = /\s/, oh = (t) => t ? t.split(_A) : [], Tg = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || rh, o = e.$attrs$ || rh;
  for (r in s)
    r in o || ih(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    ih(i, r, s[r], o[r], n, e.$flags$);
}, sf = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = nr.createTextNode(i.$text$);
  else {
    if (gn || (gn = i.$tag$ === "svg"), o = i.$elm$ = nr.createElementNS(gn ? vA : $A, i.$tag$), gn && i.$tag$ === "foreignObject" && (gn = !1), Tg(null, i, gn), kA(va) && o["s-si"] !== va && o.classList.add(o["s-si"] = va), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = sf(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? gn = !1 : o.tagName === "foreignObject" && (gn = !0);
  }
  return o;
}, Bg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Ig && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = sf(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, Mg = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, UA = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], g;
  for (; i <= o && s <= u; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : d == null ? d = r[++s] : l == null ? l = r[--u] : ca(a, d) ? (co(a, d), a = e[++i], d = r[++s]) : ca(c, l) ? (co(c, l), c = e[--o], l = r[--u]) : ca(a, l) ? (co(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--u]) : ca(c, d) ? (co(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++s]) : (g = sf(e && e[s], n, s), d = r[++s], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  i > o ? Bg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && Mg(e, i, o);
}, ca = (t, e) => t.$tag$ === e.$tag$, co = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (gn = s === "svg" ? !0 : s === "foreignObject" ? !1 : gn, Tg(t, e, gn), r !== null && i !== null ? UA(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), Bg(n, null, e, i, 0, i.length - 1)) : r !== null && Mg(r, 0, r.length - 1), gn && s === "svg" && (gn = !1)) : t.$text$ !== o && (n.data = o);
}, HA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Zl(null, null), i = LA(e) ? e : St(null, null, e);
  Ig = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, va = n["s-sc"], co(r, i);
}, Ng = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, of = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Ng(t, t.$ancestorComponent$), t4(() => OA(t, e));
}, OA = (t, e) => {
  const n = $r("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), zA(i, () => DA(t, r, e));
}, DA = async (t, e, n) => {
  const r = t.$hostElement$, i = $r("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && PA(t);
  const o = $r("render", t.$cmpMeta$.$tagName$);
  FA(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => jA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, FA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, HA(t, e);
  } catch (r) {
    Ao(r, t.$hostElement$);
  }
  return null;
}, jA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = $r("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, _g(n), r(), t.$onReadyResolve$(n), i || Pg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && cf(() => of(t, !1)), t.$flags$ &= -517;
}, Pg = (t) => {
  _g(nr.documentElement), cf(() => BA(Ec, "appload", { detail: { namespace: SA } }));
}, zA = (t, e) => t && t.then ? t.then(e) : e(), _g = (t) => t.classList.add("hydrated"), RA = (t, e) => Yi(t).$instanceValues$.get(e), GA = (t, e, n, r) => {
  const i = Yi(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = CA(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(o & 8) || s === void 0) && u && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && of(i, !1));
}, Ug = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), i = t.prototype;
    if (r.map(([s, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(i, s, {
        get() {
          return RA(this, s);
        },
        set(a) {
          GA(this, s, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      i.attributeChangedCallback = function(o, a, c) {
        Ve.jmp(() => {
          const u = s.get(o);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (i.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
        });
      }, t.observedAttributes = r.filter(
        ([o, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([o, a]) => {
        const c = a[1] || o;
        return s.set(c, o), c;
      });
    }
  }
  return t;
}, KA = async (t, e, n, r, i) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, i = ZA(n), i.then) {
        const c = EA();
        i = await i, c();
      }
      i.isProxied || (Ug(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = $r("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        Ao(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = Cg(n);
      if (!Ga.has(c)) {
        const u = $r("registerStyles", n.$tagName$);
        MA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => of(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, VA = (t) => {
  if (!(Ve.$flags$ & 1)) {
    const e = Yi(t), n = e.$cmpMeta$, r = $r("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            Ng(e, e.$ancestorComponent$ = i);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([i, [s]]) => {
        if (s & 31 && t.hasOwnProperty(i)) {
          const o = t[i];
          delete t[i], t[i] = o;
        }
      }), KA(t, e, n);
    }
    r();
  }
}, qA = (t) => {
  Ve.$flags$ & 1 || Yi(t);
}, WA = (t, e = {}) => {
  var n;
  const r = $r(), i = [], s = e.exclude || [], o = Ec.customElements, a = nr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ nr.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(Ve, e), Ve.$resourcesUrl$ = new URL(e.resourcesUrl || "./", nr.baseURI).href, t.map((p) => {
    p[1].map((k) => {
      const x = {
        $flags$: k[0],
        $tagName$: k[1],
        $members$: k[2],
        $listeners$: k[3]
      };
      x.$members$ = k[2];
      const M = x.$tagName$, q = class extends HTMLElement {
        // StencilLazyHost
        constructor(K) {
          super(K), K = this, YA(K, x), x.$flags$ & 1 && K.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : Ve.jmp(() => VA(this));
        }
        disconnectedCallback() {
          Ve.jmp(() => qA(this));
        }
        componentOnReady() {
          return Yi(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = p[0], !s.includes(M) && !o.get(M) && (i.push(M), o.define(M, Ug(
        q,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = i + AA, u.setAttribute("data-styles", "");
    const p = (n = Ve.$nonce$) !== null && n !== void 0 ? n : Lg(nr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((p) => p.connectedCallback()) : Ve.jmp(() => l = setTimeout(Pg, 30)), r();
}, af = /* @__PURE__ */ new WeakMap(), Yi = (t) => af.get(t), XA = (t, e) => af.set(e.$lazyInstance$ = t, e), YA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], af.set(t, n);
}, ah = (t, e) => e in t, Ao = (t, e) => (0, console.error)(t, e), Yc = /* @__PURE__ */ new Map(), ZA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = Yc.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (Yc.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => $$).then(o, Ao);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (Yc.set(i, o), o[r]), Ao);
}, Ga = /* @__PURE__ */ new Map(), Ec = typeof window < "u" ? window : {}, nr = Ec.document || { head: {} }, Ve = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Hg = (t) => Promise.resolve(t), QA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), ch = [], Og = [], JA = (t, e) => (n) => {
  t.push(n), Yl || (Yl = !0, Ve.$flags$ & 4 ? cf(Ql) : Ve.raf(Ql));
}, lh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ao(n);
    }
  t.length = 0;
}, Ql = () => {
  lh(ch), lh(Og), (Yl = ch.length > 0) && Ve.raf(Ql);
}, cf = (t) => Hg().then(t), t4 = /* @__PURE__ */ JA(Og), e4 = () => Hg(), n4 = (t, e) => typeof window > "u" ? Promise.resolve() : e4().then(() => WA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var r4 = Object.defineProperty, s4 = Object.defineProperties, i4 = Object.getOwnPropertyDescriptors, Ka = Object.getOwnPropertySymbols, Dg = Object.prototype.hasOwnProperty, Fg = Object.prototype.propertyIsEnumerable, uh = (t, e, n) => e in t ? r4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Sn = (t, e) => {
  for (var n in e || (e = {})) Dg.call(e, n) && uh(t, n, e[n]);
  if (Ka) for (var n of Ka(e)) Fg.call(e, n) && uh(t, n, e[n]);
  return t;
}, zn = (t, e) => s4(t, i4(e)), jg = (t, e) => {
  var n = {};
  for (var r in t) Dg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ka) for (var r of Ka(t)) e.indexOf(r) < 0 && Fg.call(t, r) && (n[r] = t[r]);
  return n;
};
function zg() {
  return gc(Ds()) || window.StacksProvider || window.BlockstackProvider;
}
function Ac(t) {
  return t ? typeof t == "string" ? js.fromName(t) : "version" in t ? t : "url" in t ? new kl({ url: t.url }) : t.transactionVersion === Rs.Mainnet ? new kl({ url: t.client.baseUrl }) : new Il({ url: t.client.baseUrl }) : new Il();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var o4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(o4 || {}), a4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(a4 || {}), lf = (t) => {
  let e = t;
  if (!e) {
    let n = new m0(["store_write"], document.location.href);
    e = new $l({ appConfig: n });
  }
  return e;
};
function Rg(t) {
  try {
    return lf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Gg = (t) => {
  let e = lf(t).loadUserData().appPrivateKey, n = Re.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function c4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [zs.Mainnet]: "mainnet", [zs.Testnet]: "testnet" }, a = Ac(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function l4(t) {
  let e = Ac(t.network), n = lf(t.userSession), r = zn(Sn({}, t), { network: e, userSession: n });
  return Sn({ stxAddress: c4(r) }, r);
}
async function u4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(gg) : n = n.map((r) => dt($g(r)))), new Re.TokenSigner("ES256k", e).signAsync(zn(Sn({}, t), { postConditions: n }));
}
function f4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(gg) : e = e.map((n) => dt($g(n)))), Re.createUnsecuredToken(zn(Sn({}, t), { postConditions: e }));
}
var d4 = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Ut(a.replace(/^0x/, "")), u = nE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, zn(Sn({}, o), { stacksTransaction: u }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, zn(Sn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, h4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = jg(e, ["amount", "appDetails", "userSession"]);
  if (Rg(i)) {
    let { privateKey: a, publicKey: c } = Gg(i), u = zn(Sn({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), u4(u, a);
  }
  let o = zn(Sn({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), f4(o);
};
async function p4(t, e, n) {
  let r = await e(zn(Sn(Sn({}, l4(t)), t), { network: Ac(t.network) }));
  return d4({ token: r, options: t }, n);
}
function g4(t, e = zg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return p4(t, h4, e);
}
function Kg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? zn(Sn({}, t), { message: Od(e), domain: Od(n) }) : zn(Sn({}, t), { message: dt(Ks(e)), domain: dt(Ks(n)) });
}
async function y4(t, e) {
  return new Re.TokenSigner("ES256k", e).signAsync(Kg(t));
}
async function w4(t) {
  let e = t, { userSession: n } = e, r = jg(e, ["userSession"]);
  if (Rg(n)) {
    let { privateKey: i, publicKey: s } = Gg(n), o = zn(Sn({}, r), { publicKey: s });
    return y4(o, i);
  }
  return Re.createUnsecuredToken(Kg(t));
}
var b4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(b4 || {}), Vg = "asigna-stx", fh = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === Vg && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(x4(t, e), "*");
}), m4 = { authenticationRequest: async (t) => fh(t, "authenticationRequest"), transactionRequest: async (t) => fh(t, "transactionRequest") }, x4 = (t, e) => ({ source: Vg, [e]: t }), S4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = m4);
};
S4();
var E4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function A4(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = Ds(), o = zg();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    n4();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : E4, c = px(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = d;
    };
    u.callback = (p) => {
      l(), t(n, p);
    }, u.cancelCallback = () => {
      var p;
      l(), (p = n.onCancel) == null || p.call(n);
    }, document.body.appendChild(u);
    let g = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", g), u.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var la = A4(g4);
function gs(t, e, n) {
  return uf(Je(t, e), n);
}
function Je(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ae(r);
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
      const r = k4(BigInt(`0x${Bt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Bt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function dh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ho(t, e = 8) {
  return (typeof t == "bigint" ? t : Je(t, !1)).toString(16).padStart(e * 2, "0");
}
function vc(t) {
  return parseInt(t, 16);
}
function uf(t, e = 16) {
  const n = Ho(t, e);
  return ae(n);
}
function v4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function $4(t, e) {
  return t & BigInt(1) << e;
}
function k4(t, e) {
  return $4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const I4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Bt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += I4[n];
  return e;
}
function ae(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const i = r * 2, s = e.slice(i, i + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Zi(t) {
  return new TextEncoder().encode(t);
}
function ff(t) {
  return new TextDecoder().decode(t);
}
function qg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function L4(t) {
  return String.fromCharCode.apply(null, t);
}
function C4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function hh(t) {
  if (t.some(C4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function $c(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function Ae(t) {
  return $c(...t.map((e) => typeof e == "number" ? hh([e]) : e instanceof Array ? hh(e) : e));
}
var ph;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ph || (ph = {}));
var gh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(yh || (yh = {}));
const Wg = 33, Zc = 32;
function T4(t) {
  if (t.length < Zc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Zc * 2), r = t.slice(2 + Zc * 2);
  return {
    recoveryId: vc(e),
    r: n,
    s: r
  };
}
function B4(t) {
  const e = typeof t == "string" ? ae(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function M4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function N4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function P4(t, e) {
  return t[e];
}
function _4(t, e, n = 0) {
  return t[n] = e, t;
}
function U4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Vs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Jl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Jl || (Jl = {}));
const H4 = Jl.Mainnet, O4 = 128, D4 = 128, Xg = 16, Bs = 32, tu = 80, kc = 65, F4 = 32, j4 = 64, Va = 34;
var at;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(at || (at = {}));
var Ct;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ct || (Ct = {}));
var eu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(eu || (eu = {}));
var on;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(on || (on = {}));
const $a = ["onChainOnly", "offChainOnly", "any"], wh = {
  [$a[0]]: on.OnChainOnly,
  [$a[1]]: on.OffChainOnly,
  [$a[2]]: on.Any,
  [on.OnChainOnly]: on.OnChainOnly,
  [on.OffChainOnly]: on.OffChainOnly,
  [on.Any]: on.Any
};
function z4(t) {
  if (t in wh)
    return wh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${$a.join(", ")}`);
}
var qa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(qa || (qa = {}));
qa.Mainnet;
var ji;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ji || (ji = {}));
var an;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(an || (an = {}));
var be;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(be || (be = {}));
var Xt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Xt || (Xt = {}));
var Wa;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Wa || (Wa = {}));
var fe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(fe || (fe = {}));
var vo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(vo || (vo = {}));
var nu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(nu || (nu = {}));
var $o;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})($o || ($o = {}));
var bh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(bh || (bh = {}));
var mh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(mh || (mh = {}));
function ru(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function R4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Yg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function G4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ru(t.outputLen), ru(t.blockLen);
}
function K4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function V4(t, e) {
  Yg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ks = {
  number: ru,
  bool: R4,
  bytes: Yg,
  hash: G4,
  exists: K4,
  output: V4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Qc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Xn = (t, e) => t << 32 - e | t >>> e, q4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!q4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function W4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function df(t) {
  if (typeof t == "string" && (t = W4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Zg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ii(t) {
  const e = (r) => t().update(df(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function X4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class hf extends Zg {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Qc(this.buffer);
  }
  update(e) {
    ks.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = df(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Qc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ks.exists(this), ks.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    X4(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Qc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
}
const Y4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Qg = Uint8Array.from({ length: 16 }, (t, e) => e), Z4 = Qg.map((t) => (9 * t + 5) % 16);
let pf = [Qg], gf = [Z4];
for (let t = 0; t < 4; t++)
  for (let e of [pf, gf])
    e.push(e[t].map((n) => Y4[n]));
const Jg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Q4 = pf.map((t, e) => t.map((n) => Jg[e][n])), J4 = gf.map((t, e) => t.map((n) => Jg[e][n])), tv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ev = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ua = (t, e) => t << e | t >>> 32 - e;
function xh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fa = new Uint32Array(16);
class nv extends hf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      fa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const k = 4 - p, x = tv[p], M = ev[p], q = pf[p], K = gf[p], $ = Q4[p], P = J4[p];
      for (let B = 0; B < 16; B++) {
        const A = ua(r + xh(p, s, a, u) + fa[q[B]] + x, $[B]) + l | 0;
        r = l, l = u, u = ua(a, 10) | 0, a = s, s = A;
      }
      for (let B = 0; B < 16; B++) {
        const A = ua(i + xh(k, o, c, d) + fa[K[B]] + M, P[B]) + g | 0;
        i = g, g = d, d = ua(c, 10) | 0, c = o, o = A;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    fa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const rv = ii(() => new nv()), sv = (t, e, n) => t & e ^ ~t & n, iv = (t, e, n) => t & e ^ t & n ^ e & n, ov = new Uint32Array([
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
]), ns = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), rs = new Uint32Array(64);
class ty extends hf {
  constructor() {
    super(64, 32, 8, !1), this.A = ns[0] | 0, this.B = ns[1] | 0, this.C = ns[2] | 0, this.D = ns[3] | 0, this.E = ns[4] | 0, this.F = ns[5] | 0, this.G = ns[6] | 0, this.H = ns[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      rs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = rs[l - 15], p = rs[l - 2], k = Xn(g, 7) ^ Xn(g, 18) ^ g >>> 3, x = Xn(p, 17) ^ Xn(p, 19) ^ p >>> 10;
      rs[l] = x + rs[l - 7] + k + rs[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), p = d + g + sv(a, c, u) + ov[l] + rs[l] | 0, x = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + iv(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class av extends ty {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const yf = ii(() => new ty());
ii(() => new av());
const da = BigInt(2 ** 32 - 1), su = BigInt(32);
function ey(t, e = !1) {
  return e ? { h: Number(t & da), l: Number(t >> su & da) } : { h: Number(t >> su & da) | 0, l: Number(t & da) | 0 };
}
function cv(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = ey(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const lv = (t, e) => BigInt(t >>> 0) << su | BigInt(e >>> 0), uv = (t, e, n) => t >>> n, fv = (t, e, n) => t << 32 - n | e >>> n, dv = (t, e, n) => t >>> n | e << 32 - n, hv = (t, e, n) => t << 32 - n | e >>> n, pv = (t, e, n) => t << 64 - n | e >>> n - 32, gv = (t, e, n) => t >>> n - 32 | e << 64 - n, yv = (t, e) => e, wv = (t, e) => t, bv = (t, e, n) => t << n | e >>> 32 - n, mv = (t, e, n) => e << n | t >>> 32 - n, xv = (t, e, n) => e << n - 32 | t >>> 64 - n, Sv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ev(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Av = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), vv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, $v = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), kv = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, Iv = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), Lv = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, kt = {
  fromBig: ey,
  split: cv,
  toBig: lv,
  shrSH: uv,
  shrSL: fv,
  rotrSH: dv,
  rotrSL: hv,
  rotrBH: pv,
  rotrBL: gv,
  rotr32H: yv,
  rotr32L: wv,
  rotlSH: bv,
  rotlSL: mv,
  rotlBH: xv,
  rotlBL: Sv,
  add: Ev,
  add3L: Av,
  add3H: vv,
  add4L: $v,
  add4H: kv,
  add5H: Lv,
  add5L: Iv
}, [Cv, Tv] = kt.split([
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
].map((t) => BigInt(t))), ss = new Uint32Array(80), is = new Uint32Array(80);
class Ic extends hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: k, Hh: x, Hl: M } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, g, p, k, x, M];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, g, p, k, x, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = k | 0, this.Hh = x | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let $ = 0; $ < 16; $++, n += 4)
      ss[$] = e.getUint32(n), is[$] = e.getUint32(n += 4);
    for (let $ = 16; $ < 80; $++) {
      const P = ss[$ - 15] | 0, B = is[$ - 15] | 0, A = kt.rotrSH(P, B, 1) ^ kt.rotrSH(P, B, 8) ^ kt.shrSH(P, B, 7), U = kt.rotrSL(P, B, 1) ^ kt.rotrSL(P, B, 8) ^ kt.shrSL(P, B, 7), _ = ss[$ - 2] | 0, L = is[$ - 2] | 0, S = kt.rotrSH(_, L, 19) ^ kt.rotrBH(_, L, 61) ^ kt.shrSH(_, L, 6), C = kt.rotrSL(_, L, 19) ^ kt.rotrBL(_, L, 61) ^ kt.shrSL(_, L, 6), b = kt.add4L(U, C, is[$ - 7], is[$ - 16]), N = kt.add4H(b, A, S, ss[$ - 7], ss[$ - 16]);
      ss[$] = N | 0, is[$] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: k, Gh: x, Gl: M, Hh: q, Hl: K } = this;
    for (let $ = 0; $ < 80; $++) {
      const P = kt.rotrSH(l, g, 14) ^ kt.rotrSH(l, g, 18) ^ kt.rotrBH(l, g, 41), B = kt.rotrSL(l, g, 14) ^ kt.rotrSL(l, g, 18) ^ kt.rotrBL(l, g, 41), A = l & p ^ ~l & x, U = g & k ^ ~g & M, _ = kt.add5L(K, B, U, Tv[$], is[$]), L = kt.add5H(_, q, P, A, Cv[$], ss[$]), S = _ | 0, C = kt.rotrSH(r, i, 28) ^ kt.rotrBH(r, i, 34) ^ kt.rotrBH(r, i, 39), b = kt.rotrSL(r, i, 28) ^ kt.rotrBL(r, i, 34) ^ kt.rotrBL(r, i, 39), N = r & s ^ r & a ^ s & a, Z = i & o ^ i & c ^ o & c;
      q = x | 0, K = M | 0, x = p | 0, M = k | 0, p = l | 0, k = g | 0, { h: l, l: g } = kt.add(u | 0, d | 0, L | 0, S | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const V = kt.add3L(S, b, Z);
      r = kt.add3H(V, L, C, N), i = V | 0;
    }
    ({ h: r, l: i } = kt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = kt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = kt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = kt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = kt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: k } = kt.add(this.Fh | 0, this.Fl | 0, p | 0, k | 0), { h: x, l: M } = kt.add(this.Gh | 0, this.Gl | 0, x | 0, M | 0), { h: q, l: K } = kt.add(this.Hh | 0, this.Hl | 0, q | 0, K | 0), this.set(r, i, s, o, a, c, u, d, l, g, p, k, x, M, q, K);
  }
  roundClean() {
    ss.fill(0), is.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Bv extends Ic {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Mv extends Ic {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Nv extends Ic {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ii(() => new Ic());
ii(() => new Bv());
const Pv = ii(() => new Mv());
ii(() => new Nv());
function ny(t) {
  if (ae(t).byteLength != kc)
    throw Error("Invalid signature");
  return {
    type: at.MessageSignature,
    data: t
  };
}
function lo(t, e) {
  return { type: at.Address, version: t, hash160: e };
}
function vi(t) {
  return ni.c32address(t.version, t.hash160);
}
function qs(t, e, n) {
  const r = e || 1, i = n || O4;
  if (my(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: at.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function wf(t) {
  const e = ni.c32addressDecode(t);
  return {
    type: at.Address,
    version: e[0],
    hash160: e[1]
  };
}
var X;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(X || (X = {}));
function _v(t) {
  if (t.type === X.PrincipalStandard)
    return vi(t.address);
  if (t.type === X.PrincipalContract)
    return `${vi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function ry(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Ov(e, n);
  } else
    return Uv(t);
}
function Uv(t) {
  const e = wf(t);
  return { type: X.PrincipalStandard, address: e };
}
function Hv(t) {
  return { type: X.PrincipalStandard, address: t };
}
function Ov(t, e) {
  const n = wf(t), r = qs(e);
  return sy(n, r);
}
function sy(t, e) {
  if (Zi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: X.PrincipalContract, address: t, contractName: e };
}
function Jc(t, e = !1) {
  switch (t.type) {
    case X.BoolTrue:
      return !0;
    case X.BoolFalse:
      return !1;
    case X.Int:
    case X.UInt:
      return e ? t.value.toString() : t.value;
    case X.Buffer:
      return `0x${Bt(t.buffer)}`;
    case X.OptionalNone:
      return null;
    case X.OptionalSome:
      return Jn(t.value);
    case X.ResponseErr:
      return Jn(t.value);
    case X.ResponseOk:
      return Jn(t.value);
    case X.PrincipalStandard:
    case X.PrincipalContract:
      return _v(t);
    case X.List:
      return t.list.map((r) => Jn(r));
    case X.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Jn(t.data[r]);
      }), n;
    case X.StringASCII:
      return t.data;
    case X.StringUTF8:
      return t.data;
  }
}
function Jn(t) {
  switch (t.type) {
    case X.ResponseErr:
      return { type: cs(t), value: Jc(t, !0), success: !1 };
    case X.ResponseOk:
      return { type: cs(t), value: Jc(t, !0), success: !0 };
    default:
      return { type: cs(t), value: Jc(t, !0) };
  }
}
function cs(t) {
  switch (t.type) {
    case X.BoolTrue:
    case X.BoolFalse:
      return "bool";
    case X.Int:
      return "int";
    case X.UInt:
      return "uint";
    case X.Buffer:
      return `(buff ${t.buffer.length})`;
    case X.OptionalNone:
      return "(optional none)";
    case X.OptionalSome:
      return `(optional ${cs(t.value)})`;
    case X.ResponseErr:
      return `(response UnknownType ${cs(t.value)})`;
    case X.ResponseOk:
      return `(response ${cs(t.value)} UnknownType)`;
    case X.PrincipalStandard:
    case X.PrincipalContract:
      return "principal";
    case X.List:
      return `(list ${t.list.length} ${t.list.length ? cs(t.list[0]) : "UnknownType"})`;
    case X.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${cs(t.data[e])})`).join(" ")})`;
    case X.StringASCII:
      return `(string-ascii ${qg(t.data).length})`;
    case X.StringUTF8:
      return `(string-utf8 ${Zi(t.data).length})`;
  }
}
const iy = () => ({ type: X.BoolTrue }), oy = () => ({ type: X.BoolFalse }), Dv = (t) => t ? iy() : oy(), Sh = BigInt("0xffffffffffffffffffffffffffffffff"), Fv = BigInt(0), Eh = BigInt("0x7fffffffffffffffffffffffffffffff"), Ah = BigInt("-170141183460469231731687303715884105728"), jv = (t) => {
  const e = Je(t, !0);
  if (e > Eh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Eh}`);
  if (e < Ah)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ah}`);
  return { type: X.Int, value: e };
}, rr = (t) => {
  const e = Je(t, !1);
  if (e < Fv)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Sh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Sh}`);
  return { type: X.UInt, value: e };
}, ay = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: X.Buffer, buffer: t };
};
function cy() {
  return { type: X.OptionalNone };
}
function ly(t) {
  return { type: X.OptionalSome, value: t };
}
function zv(t) {
  return { type: X.ResponseErr, value: t };
}
function Rv(t) {
  return { type: X.ResponseOk, value: t };
}
function Gv(t) {
  return { type: X.List, list: t };
}
function Ws(t) {
  for (const e in t)
    if (!N8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: X.Tuple, data: t };
}
const ze = (t) => ({ type: X.StringASCII, data: t }), Kv = (t) => ({ type: X.StringUTF8, data: t });
class uy extends Zg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ks.hash(e);
    const r = df(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return ks.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ks.exists(this), ks.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const fy = (t, e, n) => new uy(t, e).update(n).digest();
fy.create = (t, e) => new uy(t, e);
me.hmacSha256Sync = (t, ...e) => {
  const n = fy.create(yf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function zi(t) {
  return {
    type: at.PublicKey,
    data: ae(t)
  };
}
function Vv(t, e, n = fe.Compressed) {
  const r = T4(e.data), i = new mn(dh(r.r), dh(r.s)), s = Tt.fromSignature(t, i, r.recoveryId), o = n === fe.Compressed;
  return s.toHex(o);
}
function qv(t) {
  return { type: at.PublicKey, data: t };
}
function Qi(t) {
  return !Bt(t.data).startsWith("04");
}
function Xa(t) {
  return t.data.slice();
}
function Wv(t) {
  const e = Zv(t), n = Mo(e.data.slice(0, 32), e.compressed);
  return zi(Bt(n));
}
function Xv(t) {
  const e = typeof t == "string" ? t : Bt(t), n = Tt.fromHex(e).toHex(!0);
  return zi(n);
}
function Yv(t) {
  const e = typeof t == "string" ? t : Bt(t), n = Tt.fromHex(e).toHex(!1);
  return zi(n);
}
function iu(t) {
  const e = t.readUInt8(), n = e === 4 ? j4 : F4;
  return qv(Ae([e, t.readBytes(n)]));
}
function Zv(t) {
  const e = B4(t), n = e.length == Wg;
  return { data: e, compressed: n };
}
function Qv(t, e) {
  const [n, r] = ic(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = Ho(r, 1) + mn.fromHex(n).toCompactHex();
  return ny(s);
}
function Jv(t) {
  return Wv(t.data);
}
function t8(t, e, n) {
  return typeof t == "string" && (t = ry(t)), typeof n == "string" && (n = kh(n)), {
    type: at.Payload,
    payloadType: Ct.TokenTransfer,
    recipient: t,
    amount: Je(e, !1),
    memo: n ?? kh("")
  };
}
function e8(t, e, n, r) {
  return typeof t == "string" && (t = wf(t)), typeof e == "string" && (e = qs(e)), typeof n == "string" && (n = qs(n)), {
    type: at.Payload,
    payloadType: Ct.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function vh(t, e, n) {
  return typeof t == "string" && (t = qs(t)), typeof e == "string" && (e = u8(e)), typeof n == "number" ? {
    type: at.Payload,
    payloadType: Ct.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: at.Payload,
    payloadType: Ct.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function n8() {
  return { type: at.Payload, payloadType: Ct.PoisonMicroblock };
}
function $h(t, e) {
  if (t.byteLength != Bs)
    throw Error(`Coinbase buffer size must be ${Bs} bytes`);
  return e != null ? {
    type: at.Payload,
    payloadType: Ct.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: at.Payload,
    payloadType: Ct.Coinbase,
    coinbaseBytes: t
  };
}
function r8(t, e, n) {
  if (t.byteLength != Bs)
    throw Error(`Coinbase buffer size must be ${Bs} bytes`);
  if (n.byteLength != tu)
    throw Error(`VRF proof buffer size must be ${tu} bytes`);
  return {
    type: at.Payload,
    payloadType: Ct.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === X.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var ou;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(ou || (ou = {}));
function s8(t, e, n, r, i, s, o) {
  return {
    type: at.Payload,
    payloadType: Ct.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function dy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ct.TokenTransfer:
      e.push(Se(t.recipient)), e.push(gs(t.amount, !1, 8)), e.push(xr(t.memo));
      break;
    case Ct.ContractCall:
      e.push(xr(t.contractAddress)), e.push(xr(t.contractName)), e.push(xr(t.functionName));
      const n = new Uint8Array(4);
      Vs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Se(r));
      });
      break;
    case Ct.SmartContract:
      e.push(xr(t.contractName)), e.push(xr(t.codeBody));
      break;
    case Ct.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(xr(t.contractName)), e.push(xr(t.codeBody));
      break;
    case Ct.PoisonMicroblock:
      break;
    case Ct.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ct.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Se(t.recipient));
      break;
    case Ct.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Se(t.recipient ? ly(t.recipient) : cy())), e.push(t.vrfProof);
      break;
    case Ct.TenureChange:
      e.push(ae(t.tenureHash)), e.push(ae(t.previousTenureHash)), e.push(ae(t.burnViewHash)), e.push(ae(t.previousTenureEnd)), e.push(Vs(new Uint8Array(4), t.previousTenureBlocks)), e.push(_4(new Uint8Array(1), t.cause)), e.push(ae(t.publicKeyHash));
      break;
  }
  return Ae(e);
}
function i8(t) {
  switch (t.readUInt8Enum(Ct, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ct.TokenTransfer:
      const n = Bn(t), r = Je(t.readBytes(8), !1), i = py(t);
      return t8(n, r, i);
    case Ct.ContractCall:
      const s = Ri(t), o = Tn(t), a = Tn(t), c = [], u = t.readUInt32BE();
      for (let $ = 0; $ < u; $++) {
        const P = Bn(t);
        c.push(P);
      }
      return e8(s, o, a, c);
    case Ct.SmartContract:
      const d = Tn(t), l = Tn(t, 4, 1e5);
      return vh(d, l);
    case Ct.VersionedSmartContract: {
      const $ = t.readUInt8Enum(eu, (A) => {
        throw new Error(`Cannot recognize ClarityVersion: ${A}`);
      }), P = Tn(t), B = Tn(t, 4, 1e5);
      return vh(P, B, $);
    }
    case Ct.PoisonMicroblock:
      return n8();
    case Ct.Coinbase: {
      const $ = t.readBytes(Bs);
      return $h($);
    }
    case Ct.CoinbaseToAltRecipient: {
      const $ = t.readBytes(Bs), P = Bn(t);
      return $h($, P);
    }
    case Ct.NakamotoCoinbase: {
      const $ = t.readBytes(Bs), P = Bn(t), B = t.readBytes(tu);
      return r8($, P, B);
    }
    case Ct.TenureChange:
      const g = Bt(t.readBytes(20)), p = Bt(t.readBytes(20)), k = Bt(t.readBytes(20)), x = Bt(t.readBytes(32)), M = t.readUInt32BE(), q = t.readUInt8Enum(ou, ($) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${$}`);
      }), K = Bt(t.readBytes(20));
      return s8(g, p, k, x, M, q, K);
  }
}
class Lc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ss extends Lc {
  constructor(e) {
    super(e);
  }
}
class bn extends Lc {
  constructor(e) {
    super(e);
  }
}
class Ya extends Lc {
  constructor(e) {
    super(e);
  }
}
class Is extends Lc {
  constructor(e) {
    super(e);
  }
}
var Dn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Dn || (Dn = {}));
function au(t) {
  return ny(Bt(t.readBytes(kc)));
}
function $i(t, e) {
  return {
    pubKeyEncoding: t,
    type: at.TransactionAuthField,
    contents: e
  };
}
function o8(t) {
  const e = t.readUInt8Enum(Dn, (n) => {
    throw new bn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Dn.PublicKeyCompressed:
      return $i(fe.Compressed, iu(t));
    case Dn.PublicKeyUncompressed:
      return $i(fe.Uncompressed, Yv(iu(t).data));
    case Dn.SignatureCompressed:
      return $i(fe.Compressed, au(t));
    case Dn.SignatureUncompressed:
      return $i(fe.Uncompressed, au(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function bf(t) {
  return ae(t.data);
}
function a8(t) {
  const e = [];
  switch (t.contents.type) {
    case at.PublicKey:
      e.push(t.pubKeyEncoding === fe.Compressed ? Dn.PublicKeyCompressed : Dn.PublicKeyUncompressed), e.push(Xa(Xv(t.contents.data)));
      break;
    case at.MessageSignature:
      e.push(t.pubKeyEncoding === fe.Compressed ? Dn.SignatureCompressed : Dn.SignatureUncompressed), e.push(bf(t.contents));
      break;
  }
  return Ae(e);
}
function xr(t) {
  switch (t.type) {
    case at.Address:
      return Oo(t);
    case at.Principal:
      return hy(t);
    case at.LengthPrefixedString:
      return Gi(t);
    case at.MemoString:
      return f8(t);
    case at.AssetInfo:
      return gy(t);
    case at.PostCondition:
      return d8(t);
    case at.PublicKey:
      return Xa(t);
    case at.LengthPrefixedList:
      return Sf(t);
    case at.Payload:
      return dy(t);
    case at.TransactionAuthField:
      return a8(t);
    case at.MessageSignature:
      return bf(t);
  }
}
function c8() {
  return {
    type: at.Address,
    version: Wa.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function mf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Xt.SerializeP2PKH || e === Xt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Xt.SerializeP2WPKH || e === Xt.SerializeP2WSH || e === Xt.SerializeP2WSHNonSequential) && !r.every(Qi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Xt.SerializeP2PKH:
      return lo(t, C8(r[0].data));
    case Xt.SerializeP2WPKH:
      return lo(t, T8(r[0].data));
    case Xt.SerializeP2SH:
    case Xt.SerializeP2SHNonSequential:
      return lo(t, B8(n, r.map(Xa)));
    case Xt.SerializeP2WSH:
    case Xt.SerializeP2WSHNonSequential:
      return lo(t, M8(n, r.map(Xa)));
  }
}
function Oo(t) {
  const e = [];
  return e.push(ae(Ho(t.version, 1))), e.push(ae(t.hash160)), Ae(e);
}
function Ri(t) {
  const e = vc(Bt(t.readBytes(1))), n = Bt(t.readBytes(20));
  return { type: at.Address, version: e, hash160: n };
}
function hy(t) {
  const e = [];
  return e.push(t.prefix), e.push(Oo(t.address)), t.prefix === $o.Contract && e.push(Gi(t.contractName)), Ae(e);
}
function l8(t) {
  const e = t.readUInt8Enum($o, (i) => {
    throw new bn(`Unexpected Principal payload type: ${i}`);
  }), n = Ri(t);
  if (e === $o.Standard)
    return { type: at.Principal, prefix: e, address: n };
  const r = Tn(t);
  return {
    type: at.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Gi(t) {
  const e = [], n = Zi(t.content), r = n.byteLength;
  return e.push(ae(Ho(r, t.lengthPrefixBytes))), e.push(n), Ae(e);
}
function Tn(t, e, n) {
  e = e || 1;
  const r = vc(Bt(t.readBytes(e))), i = ff(t.readBytes(r));
  return qs(i, e, n ?? 128);
}
function u8(t) {
  return qs(t, 4, 1e5);
}
function kh(t) {
  if (t && my(t, Va))
    throw new Error(`Memo exceeds maximum length of ${Va} bytes`);
  return { type: at.MemoString, content: t };
}
function f8(t) {
  const e = [], n = Zi(t.content), r = L8(Bt(n), Va * 2);
  return e.push(ae(r)), Ae(e);
}
function py(t) {
  let e = ff(t.readBytes(Va));
  return e = e.replace(/\u0000*$/, ""), { type: at.MemoString, content: e };
}
function gy(t) {
  const e = [];
  return e.push(Oo(t.address)), e.push(Gi(t.contractName)), e.push(Gi(t.assetName)), Ae(e);
}
function cu(t) {
  return {
    type: at.AssetInfo,
    address: Ri(t),
    contractName: Tn(t),
    assetName: Tn(t)
  };
}
function xf(t, e) {
  return {
    type: at.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Sf(t) {
  const e = t.values, n = [];
  n.push(ae(Ho(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(xr(r));
  return Ae(n);
}
function yy(t, e, n) {
  const r = vc(Bt(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case at.Address:
        i.push(Ri(t));
        break;
      case at.LengthPrefixedString:
        i.push(Tn(t));
        break;
      case at.MemoString:
        i.push(py(t));
        break;
      case at.AssetInfo:
        i.push(cu(t));
        break;
      case at.PostCondition:
        i.push(h8(t));
        break;
      case at.PublicKey:
        i.push(iu(t));
        break;
      case at.TransactionAuthField:
        i.push(o8(t));
        break;
    }
  return xf(i, n);
}
function d8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(hy(t.principal)), (t.conditionType === an.Fungible || t.conditionType === an.NonFungible) && e.push(gy(t.assetInfo)), t.conditionType === an.NonFungible && e.push(Se(t.assetName)), e.push(t.conditionCode), t.conditionType === an.STX || t.conditionType === an.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ss("The post-condition amount may not be larger than 8 bytes");
    e.push(gs(t.amount, !1, 8));
  }
  return Ae(e);
}
function h8(t) {
  const e = t.readUInt8Enum(an, (o) => {
    throw new bn(`Could not read ${o} as PostConditionType`);
  }), n = l8(t);
  let r, i, s;
  switch (e) {
    case an.STX:
      return r = t.readUInt8Enum(vo, (a) => {
        throw new bn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Bt(t.readBytes(8))}`), {
        type: at.PostCondition,
        conditionType: an.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case an.Fungible:
      return i = cu(t), r = t.readUInt8Enum(vo, (a) => {
        throw new bn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Bt(t.readBytes(8))}`), {
        type: at.PostCondition,
        conditionType: an.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case an.NonFungible:
      i = cu(t);
      const o = Bn(t);
      return r = t.readUInt8Enum(nu, (a) => {
        throw new bn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: at.PostCondition,
        conditionType: an.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function cr(t, e) {
  return Ae([t, e]);
}
function p8(t) {
  return new Uint8Array([t.type]);
}
function g8(t) {
  return t.type === X.OptionalNone ? new Uint8Array([t.type]) : cr(t.type, Se(t.value));
}
function y8(t) {
  const e = new Uint8Array(4);
  return Vs(e, t.buffer.length, 0), cr(t.type, $c(e, t.buffer));
}
function w8(t) {
  const e = uf(v4(t.value, BigInt(D4)), Xg);
  return cr(t.type, e);
}
function b8(t) {
  const e = uf(t.value, Xg);
  return cr(t.type, e);
}
function m8(t) {
  return cr(t.type, Oo(t.address));
}
function x8(t) {
  return cr(t.type, $c(Oo(t.address), Gi(t.contractName)));
}
function S8(t) {
  return cr(t.type, Se(t.value));
}
function E8(t) {
  const e = [], n = new Uint8Array(4);
  Vs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Se(r);
    e.push(i);
  }
  return cr(t.type, Ae(e));
}
function A8(t) {
  const e = [], n = new Uint8Array(4);
  Vs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = qs(i);
    e.push(Gi(s));
    const o = Se(t.data[i]);
    e.push(o);
  }
  return cr(t.type, Ae(e));
}
function wy(t, e) {
  const n = [], r = e == "ascii" ? qg(t.data) : Zi(t.data), i = new Uint8Array(4);
  return Vs(i, r.length, 0), n.push(i), n.push(r), cr(t.type, Ae(n));
}
function v8(t) {
  return wy(t, "ascii");
}
function $8(t) {
  return wy(t, "utf8");
}
function Se(t) {
  switch (t.type) {
    case X.BoolTrue:
    case X.BoolFalse:
      return p8(t);
    case X.OptionalNone:
    case X.OptionalSome:
      return g8(t);
    case X.Buffer:
      return y8(t);
    case X.UInt:
      return b8(t);
    case X.Int:
      return w8(t);
    case X.PrincipalStandard:
      return m8(t);
    case X.PrincipalContract:
      return x8(t);
    case X.ResponseOk:
    case X.ResponseErr:
      return S8(t);
    case X.List:
      return E8(t);
    case X.Tuple:
      return A8(t);
    case X.StringASCII:
      return v8(t);
    case X.StringUTF8:
      return $8(t);
    default:
      throw new Ss("Unable to serialize. Invalid Clarity Value.");
  }
}
function k8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ih = /* @__PURE__ */ new Map();
function by(t, e) {
  const n = Ih.get(t);
  if (n !== void 0)
    return n(e);
  const r = k8(t);
  return Ih.set(t, r), by(t, e);
}
class go {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return U4(this.readBytes(4), 0);
  }
  readUInt8() {
    return P4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return M4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Bt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Bt(n);
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
    if (by(e, r))
      return r;
    throw n(r);
  }
}
function Bn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new go(ae(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new go(t) : e = t;
  switch (e.readUInt8Enum(X, (r) => {
    throw new bn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case X.Int:
      return jv(e.readBytes(16));
    case X.UInt:
      return rr(e.readBytes(16));
    case X.Buffer:
      const r = e.readUInt32BE();
      return ay(e.readBytes(r));
    case X.BoolTrue:
      return iy();
    case X.BoolFalse:
      return oy();
    case X.PrincipalStandard:
      const i = Ri(e);
      return Hv(i);
    case X.PrincipalContract:
      const s = Ri(e), o = Tn(e);
      return sy(s, o);
    case X.ResponseOk:
      return Rv(Bn(e));
    case X.ResponseErr:
      return zv(Bn(e));
    case X.OptionalNone:
      return cy();
    case X.OptionalSome:
      return ly(Bn(e));
    case X.List:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Bn(e));
      return Gv(c);
    case X.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let x = 0; x < u; x++) {
        const M = Tn(e).content;
        if (M === void 0)
          throw new bn('"content" is undefined');
        d[M] = Bn(e);
      }
      return Ws(d);
    case X.StringASCII:
      const l = e.readUInt32BE(), g = L4(e.readBytes(l));
      return ze(g);
    case X.StringUTF8:
      const p = e.readUInt32BE(), k = ff(e.readBytes(p));
      return Kv(k);
    default:
      throw new bn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const I8 = (t) => t.length % 2 == 0 ? t : `0${t}`, L8 = (t, e) => t.padEnd(e, "0"), my = (t, e) => t ? Zi(t).length > e : !1;
function lu(t) {
  return Op(t);
}
const ko = (t) => rv(yf(t)), Ef = (t) => Bt(Pv(t)), C8 = (t) => Bt(ko(t)), T8 = (t) => {
  const e = ko(t), n = $c(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ko(n);
  return Bt(r);
}, B8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = Ae(n), i = ko(r);
  return Bt(i);
}, M8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ae(n), i = yf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = Ae(s), a = ko(o);
  return Bt(a);
};
function N8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function xy(t) {
  const e = Se(t);
  return `0x${Bt(e)}`;
}
function P8(t) {
  return Bn(t);
}
const Ii = (t) => {
  try {
    return ni.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Af() {
  return {
    type: at.MessageSignature,
    data: Bt(new Uint8Array(kc))
  };
}
function Sy(t, e, n, r) {
  const i = mf(0, t, 1, [zi(e)]).hash160, s = Qi(zi(e)) ? fe.Compressed : fe.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Je(n, !1),
    fee: Je(r, !1),
    keyEncoding: s,
    signature: Af()
  };
}
function Io(t) {
  return "signature" in t;
}
function Lh(t) {
  return t === Xt.SerializeP2SH || t === Xt.SerializeP2WSH;
}
function _8(t) {
  return t === Xt.SerializeP2SHNonSequential || t === Xt.SerializeP2WSHNonSequential;
}
function Ch(t) {
  const e = lu(t);
  return e.nonce = 0, e.fee = 0, Io(e) ? e.signature = Af() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function U8(t) {
  const e = [
    t.hashMode,
    ae(t.signer),
    gs(t.nonce, !1, 8),
    gs(t.fee, !1, 8),
    t.keyEncoding,
    bf(t.signature)
  ];
  return Ae(e);
}
function H8(t) {
  const e = [
    t.hashMode,
    ae(t.signer),
    gs(t.nonce, !1, 8),
    gs(t.fee, !1, 8)
  ], n = xf(t.fields);
  e.push(Sf(n));
  const r = new Uint8Array(2);
  return N4(r, t.signaturesRequired, 0), e.push(r), Ae(e);
}
function O8(t, e) {
  const n = Bt(e.readBytes(20)), r = BigInt(`0x${Bt(e.readBytes(8))}`), i = BigInt(`0x${Bt(e.readBytes(8))}`), s = e.readUInt8Enum(fe, (a) => {
    throw new bn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Xt.SerializeP2WPKH && s != fe.Compressed)
    throw new bn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = au(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function D8(t, e) {
  const n = Bt(e.readBytes(20)), r = BigInt("0x" + Bt(e.readBytes(8))), i = BigInt("0x" + Bt(e.readBytes(8))), s = yy(e, at.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case at.PublicKey:
        Qi(u.contents) || (o = !0);
        break;
      case at.MessageSignature:
        if (u.pubKeyEncoding === fe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Is("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Xt.SerializeP2WSH || t === Xt.SerializeP2WSHNonSequential))
    throw new Is("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function tl(t) {
  return Io(t) ? U8(t) : H8(t);
}
function el(t) {
  const e = t.readUInt8Enum(Xt, (n) => {
    throw new bn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Xt.SerializeP2PKH || e === Xt.SerializeP2WPKH ? O8(e, t) : D8(e, t);
}
function Ey(t, e, n, r) {
  const s = t + Bt(new Uint8Array([e])) + Bt(gs(n, !1, 8)) + Bt(gs(r, !1, 8));
  if (ae(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ef(ae(s));
}
function Ay(t, e, n) {
  const r = 33 + kc, i = Qi(e) ? fe.Compressed : fe.Uncompressed, s = t + I8(i.toString(16)) + n.data, o = ae(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ef(o);
}
function F8(t, e, n, r, i) {
  const s = Ey(t, e, n, r), o = Qv(i, s), a = Jv(i), c = Ay(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function vy(t, e, n, r, i, s) {
  const o = Ey(t, e, n, r), a = zi(Vv(o, s, i)), c = Ay(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function j8() {
  const t = Sy(Xt.SerializeP2PKH, "", 0, 0);
  return t.signer = c8().hash160, t.keyEncoding = fe.Compressed, t.signature = Af(), t;
}
function Th(t, e, n) {
  return Io(t) ? z8(t, e, n) : R8(t, e, n);
}
function z8(t, e, n) {
  const { pubKey: r, nextSigHash: i } = vy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = mf(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new Is(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function R8(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case at.PublicKey:
        Qi(c.contents) || (s = !0), r.push(c.contents);
        break;
      case at.MessageSignature:
        c.pubKeyEncoding === fe.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = vy(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Lh(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new Is("Too many signatures");
        break;
    }
  if (Lh(t.hashMode) && o !== t.signaturesRequired || _8(t.hashMode) && o < t.signaturesRequired)
    throw new Is("Incorrect number of signatures");
  if (s && (t.hashMode === Xt.SerializeP2WSH || t.hashMode === Xt.SerializeP2WSHNonSequential))
    throw new Is("Uncompressed keys are not allowed in this hash mode");
  const a = mf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Is(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function $y(t) {
  return {
    authType: be.Standard,
    spendingCondition: t
  };
}
function ky(t, e) {
  return {
    authType: be.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Sy(Xt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Bh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case be.Standard:
        return $y(Ch(t.spendingCondition));
      case be.Sponsored:
        return ky(Ch(t.spendingCondition), j8());
      default:
        throw new Ya("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function G8(t, e) {
  switch (t.authType) {
    case be.Standard:
      return Th(t.spendingCondition, e, be.Standard);
    case be.Sponsored:
      return Th(t.spendingCondition, e, be.Standard);
    default:
      throw new Ya("Invalid origin auth type");
  }
}
function K8(t, e) {
  switch (t.authType) {
    case be.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Je(e, !1)
      };
      return { ...t, spendingCondition: n };
    case be.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Je(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function V8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Je(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function q8(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Je(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function W8(t, e) {
  const n = {
    ...e,
    nonce: Je(e.nonce, !1),
    fee: Je(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function X8(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case be.Standard:
      e.push(tl(t.spendingCondition));
      break;
    case be.Sponsored:
      e.push(tl(t.spendingCondition)), e.push(tl(t.sponsorSpendingCondition));
      break;
  }
  return Ae(e);
}
function Y8(t) {
  const e = t.readUInt8Enum(be, (r) => {
    throw new bn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case be.Standard:
      return n = el(t), $y(n);
    case be.Sponsored:
      n = el(t);
      const r = el(t);
      return ky(n, r);
  }
}
class Z8 {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Je(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? H4, this.postConditionMode = s ?? ji.Deny, this.postConditions = i ?? xf([]), o)
      this.anchorMode = z4(o);
    else
      switch (r.payloadType) {
        case Ct.Coinbase:
        case Ct.CoinbaseToAltRecipient:
        case Ct.NakamotoCoinbase:
        case Ct.PoisonMicroblock:
        case Ct.TenureChange:
          this.anchorMode = on.OnChainOnly;
          break;
        case Ct.ContractCall:
        case Ct.SmartContract:
        case Ct.VersionedSmartContract:
        case Ct.TokenTransfer:
          this.anchorMode = on.Any;
          break;
      }
  }
  signBegin() {
    const e = lu(this);
    return e.auth = Bh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = lu(this);
    return e.auth = Bh(e.auth), e.txid();
  }
  verifyOrigin() {
    return G8(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, be.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === be.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, be.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Io(n)) {
      const r = Qi(e);
      n.fields.push($i(r ? fe.Compressed : fe.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = F8(n, r, e.fee, e.nonce, i);
    return Io(e) ? e.signature = s : e.fields.push($i(i.data.byteLength === Wg ? fe.Compressed : fe.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return Ef(e);
  }
  setSponsor(e) {
    if (this.auth.authType != be.Sponsored)
      throw new Ya("Cannot sponsor sign a non-sponsored transaction");
    this.auth = W8(this.auth, e);
  }
  setFee(e) {
    this.auth = K8(this.auth, e);
  }
  setNonce(e) {
    this.auth = V8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != be.Sponsored)
      throw new Ya("Cannot sponsor sign a non-sponsored transaction");
    this.auth = q8(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ss('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ss('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ss('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ss('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ss('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Vs(n, this.chainId, 0), e.push(n), e.push(X8(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Sf(this.postConditions)), e.push(dy(this.payload)), Ae(e);
  }
}
function Za(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new go(ae(t.slice(2))) : e = new go(ae(t)) : t instanceof Uint8Array ? e = new go(t) : e = t;
  const n = e.readUInt8Enum(qa, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = Y8(e), s = e.readUInt8Enum(on, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(ji, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = yy(e, at.PostCondition), c = i8(e);
  return new Z8(n, i, c, a, o, s, r);
}
const Q8 = Dv, yo = rr, J8 = ay;
const t5 = /* @__PURE__ */ new Set([4001, -31001]), e5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], n5 = ["result", "data", "payload", "response", "params"], Mh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Cc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), oi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Ar = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, r5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Iy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, i) => !!(r != null && r.id) && n.findIndex((s) => r5(s, r)) === i
  );
}, Ly = (t) => t ? Iy(oi()).some(
  (e) => {
    var n;
    return e.id === t && (Cc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Cy = () => {
  if (typeof window > "u")
    return;
  const t = oi(), e = Iy(t).filter(
    (n) => {
      var r;
      return Cc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Ar(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of e5) {
    const r = Ar(t, n) ?? (t === window ? void 0 : Ar(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, s5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = oi(), n = Ar(e, t) ?? (e === window ? void 0 : Ar(window, t)) ?? gc(t);
  if (n)
    return n;
  if (Cc(t) || Ly(t))
    return Cy();
}, ha = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, i5 = ["blockstack-session", "blockstack"], o5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of i5) {
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
o5();
const Ty = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, yn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, a5 = (t) => {
  const e = yn(t);
  if (!e)
    return null;
  const n = Ty(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, c5 = (t) => {
  const e = yn(t);
  if (!e)
    return null;
  const n = Ty(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, uu = (t, e = "mainnet") => {
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
      return uu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return uu(r, e);
  }
  return e;
}, Ms = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Lo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    return Ii(i) ? i : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = Lo(i, e + 1);
      if (s)
        return s;
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
  for (const i of r) {
    if (!(i in n))
      continue;
    const s = Lo(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && Ii(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ii(n.testnet) ? n.testnet.trim() : null;
}, Nh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, By = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && t5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Xs = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = yn(n == null ? void 0 : n.message) ?? yn(e.message) ?? yn(e.error) ?? yn(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, Ki = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Xs(e);
    if (e.status === "error")
      throw Xs(e.result ?? e);
  }
  return t;
}, Ph = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Ki(r);
  } catch (r) {
    throw Xs(r);
  }
}, My = () => Cy(), vf = () => {
  if (typeof window > "u")
    return;
  const t = oi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Ar(t, e) ?? (t === window ? void 0 : Ar(window, e));
    if (n)
      return n;
  }
}, _h = () => {
  if (typeof window > "u")
    return;
  const t = vf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = oi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Ar(e, n) ?? (e === window ? void 0 : Ar(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, ka = (t) => {
  var r, i;
  const e = Ds();
  if (Cc(e) || Ly(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = oi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === My();
}, nl = (t) => {
  const e = c5(t);
  if (!e)
    return null;
  try {
    const n = Za(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Qa = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = nl(t), r = a5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? yn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Qa(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of Mh)
    if (nl(i[a])) {
      s = yn(i[a]);
      break;
    }
  const o = yn(i.txId) || yn(i.txid) || yn(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? yn(i.txRaw) ?? void 0
    };
  for (const a of Mh) {
    const c = nl(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: yn(i[a]) ?? void 0
      };
  }
  for (const a of n5) {
    const c = i[a], u = Qa(c, e + 1);
    if (u)
      return {
        ...i,
        ...c && typeof c == "object" ? c : {},
        ...u,
        txId: u.txId,
        txid: u.txid ?? u.txId
      };
  }
  return null;
}, rl = (t) => {
  const e = Qa(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, l5 = (t) => {
  const e = Qa(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, u5 = (t) => ({
  ...t,
  fee: Ms(t.fee),
  nonce: Ms(t.nonce),
  sponsored: t.sponsored === !0
}), Uh = (t) => ({
  recipient: t.recipient,
  amount: Ms(t.amount) ?? "0",
  memo: t.memo,
  network: uu(t.network),
  address: t.stxAddress,
  fee: Ms(t.fee),
  nonce: Ms(t.nonce),
  sponsored: t.sponsored ?? !1
}), Ny = "WALLET_ADDRESS_MISMATCH", f5 = 45e3;
let wo = null;
const fu = (t) => {
  t && (wo = { address: t, at: Date.now() });
}, d5 = () => {
  wo = null;
}, h5 = () => wo && Date.now() - wo.at <= f5 ? wo.address : null, p5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, g5 = async (t) => {
  d5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Ki(await t.request("wallet_connect")), n = Lo(e);
  return fu(n), n;
}, y5 = async (t, e, n, r) => {
  try {
    return Ki(await t.request(e, n));
  } catch (i) {
    const s = Xs(i);
    if (!p5(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: s.message
    });
    let o = null;
    try {
      o = await g5(t);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), s;
    }
    if (!o || r && o !== r)
      throw Object.assign(
        new Error(
          o ? `Xverse reconnected as ${o}, not the expected ${r}. Switch back to that account and retry.` : s.message
        ),
        { code: o ? Ny : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Ki(await t.request(e, n));
    } catch (a) {
      throw Xs(a);
    }
  }
};
let Hh = 3e4;
const w5 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Hh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Hh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, b5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ny }
      );
    return c;
  }, i = h5();
  if (i)
    return ha(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  ha(n, "account-read");
  try {
    const c = Ki(
      await w5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = Lo(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (By(c))
      throw Xs(c);
    ha(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return fu(s), r(s, "wallet_getAccount");
  let o;
  ha(n, "account-reconnect");
  try {
    o = Ki(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Xs(c);
  }
  const a = Lo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return fu(a), r(a, "wallet_connect");
}, m5 = async (t, e) => {
  if (!ka(t)) {
    const s = await Ph(
      t,
      "stx_transferStx",
      Uh(e)
    );
    return rl(s);
  }
  const n = vf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await Ph(
      n,
      "stx_transferStx",
      Uh(e)
    );
    return rl(s);
  }
  const r = My();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await b5(r, e.stxAddress);
  const i = await y5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Ms(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Ms(e.fee) } : {}
    },
    e.stxAddress
  );
  return rl(i);
}, x5 = () => Ds(), Py = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = Ds(), e = t ? s5(t) : void 0;
  if (e)
    return e;
  const n = oi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Oh = (t, e) => {
  const n = Py(), r = u5({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, l5(i));
    }
  });
  if (!n || typeof n.request != "function")
    return la(r, e);
  if (ka(n) && !vf()) {
    const i = _h();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Ds(),
        route: "legacy-transaction-request"
      }), la(r, i);
  }
  return void m5(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if (Nh(i) && ka(n)) {
      const a = _h();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Ds(),
          route: "legacy-transaction-request"
        }), la(r, a);
        return;
      }
    }
    if (Nh(i) && !ka(n)) {
      la(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), By(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Dh = (t) => xy(t).replace(/^0x/, ""), Fh = "This wallet cannot sign messages. Try Xverse or Leather.", jh = (t) => typeof (t == null ? void 0 : t.request) == "function", zh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", S5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, E5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function A5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Dh(e.message),
    domain: Dh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function v5(t, e) {
  const n = await w4({
    domain: e.domain,
    message: e.message,
    network: Ac(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Rh(t) {
  var i, s;
  const e = x5() || "", n = /xverse/i.test(e);
  let r = Py();
  if (n && !zh(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (zh(r))
    try {
      return await v5(r, t);
    } catch (o) {
      if (n || !jh(r) || !E5(o)) throw o;
    }
  if (!n && jh(r))
    try {
      return await A5(r, t);
    } catch (o) {
      throw S5(o) ? new Error(Fh) : o;
    }
  throw new Error(Fh);
}
const Gh = 1000000n, Ls = 1000000n, Ja = 50n, Pe = 3000n, ai = 300n, io = 3000n, $5 = 50000n, sl = 200n, Tc = 15000n, wn = (t) => t + Ja;
function Yn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Gh}.${(n % Gh).toString().padStart(6, "0")}`;
}
function Kh(t, e = ai) {
  return t <= Pe ? 0 : Number((t - Pe) / wn(e));
}
function il(t, e = 0n) {
  const n = Ls - t - e;
  return n > 0n ? n : 0n;
}
function k5(t, e = ai) {
  return t > Ls ? "over" : t < Pe + wn(e) ? "empty" : t < $5 ? "low" : "ok";
}
const I5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", L5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", C5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function T5(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || C5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== I5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const _y = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", ol = 3, B5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [du, Uy] = _y.split("."), In = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function hu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function M5(t) {
  return In(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function hs(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Hy(t, e = []) {
  const n = await hs(`/v2/contracts/call-read/${du}/${Uy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: du, arguments: e.map((r) => "0x" + In(Se(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Jn(Bn(n.result));
}
async function N5() {
  const t = await hs(`/v2/contracts/source/${du}/${Uy}?proof=0`);
  if (typeof t.source != "string" || await M5(t.source) !== L5) throw Error("Deployed source does not match the tested helper.");
  if (T5(await Hy("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Oy(t) {
  return t.startsWith("SP") && Ii(t) && !t.includes(".");
}
async function P5(t) {
  var r;
  if (!Oy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await hs(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await hs(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function _5(t) {
  const e = await hs(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function U5(t, e) {
  var i, s;
  const n = await Hy("get-owner", [yo(t), yo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Oy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function H5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: hu(t), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const i = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(i, { feeRejected: !0 }), i;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== e.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function O5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function D5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Za(hu(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || vi(lo(Wa.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || vi(r.contractAddress) + "." + r.contractName.content !== _y || r.functionName.content !== "play" || r.functionArgs.length !== 3 || In(Se(r.functionArgs[0])) !== In(Se(yo(t.core))) || In(Se(r.functionArgs[1])) !== In(Se(yo(t.song))) || In(Se(r.functionArgs[2])) !== In(Se(J8(hu(t.id)))) || t.amount !== "50" || e.postConditionMode !== ji.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== vo.Equal || s.principal.prefix !== 2 || vi(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || vi(r.contractAddress) + "." + r.contractName.content !== B5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || In(Se(r.functionArgs[0])) !== In(Se(yo(t.song))) || typeof t.liked != "boolean" || In(Se(r.functionArgs[1])) !== In(Se(Q8(t.liked))) || t.amount !== "0" || e.postConditionMode !== ji.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Jn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const F5 = "xtrata.xyz/radio/listening-wallet", j5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Ys = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Ii(t), z5 = (t) => ({
  domain: Ws({ name: ze(F5), version: ze("1"), "chain-id": rr(1) }),
  message: Ws({
    purpose: ze(j5),
    main: ze(t.main),
    listening: ze(t.listening),
    issued: rr(t.issued)
  })
}), Dy = 100000n, R5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function G5(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !Ys(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= Dy).sort(R5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const pa = 50;
function tc(t) {
  const e = t;
  if (!e || typeof e.total != "number" || !Number.isSafeInteger(e.total) || e.total < 0 || !Array.isArray(e.results)) return null;
  const n = [];
  for (const r of e.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const i = Number(r.block_height), s = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(i) || !Number.isSafeInteger(s)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: i, txIndex: s });
  }
  return { total: e.total, transfers: n };
}
async function K5(t, e, n = 4) {
  if (!Ys(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${pa}&offset=${o}`, i = tc(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - pa);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= pa ? i : tc(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = G5(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - pa);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const wr = 50, V5 = 6, q5 = 20, Vh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function qh(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], i = [];
  for (const s of n.results) {
    const o = s && typeof s == "object" && s.tx && typeof s.tx == "object" ? s.tx : s;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (i.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), u = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: i };
}
async function W5(t, e, n) {
  if (!Ys(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = tc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${wr}&offset=0`));
    if (!i || i.total > V5 * wr) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = wr; o < i.total; o += wr) {
      const a = tc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${wr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${wr}&offset=${u}`, a = qh(await e(o(0)), t);
      if (!a || a.total > q5 * wr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = wr; u < a.total; u += wr) {
        const d = qh(await e(o(u)), t);
        if (!d || !d.rows.length) return { ok: !1 };
        for (const l of d.rows) c.add(l);
        for (const l of d.sent) s.set(l.txId, l);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function X5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Vh).map((l, g) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: g } : Ys(l.sender) && p >= Dy ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: p, kind: "dust", to: null, at: g };
  }), s = i.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Ys(l.recipient) && l.amount > 0n).sort(Vh), a = o.reduce((l, g) => l + g.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, g) => {
    let p = g;
    for (const k of l) {
      if (p <= 0n) break;
      const x = k.left < p ? k.left : p;
      k.left -= x, p -= x;
    }
    return p;
  };
  for (const l of o) {
    const g = u(i.filter((p) => p.to === l.recipient), l.amount);
    g > 0n && u(i, g);
  }
  if (u(i, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (i.reduce((l, g) => l + g.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of i) {
    if (l.left <= 0n) continue;
    const g = `${l.kind}:${l.to ?? ""}`, p = d.get(g);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : d.set(g, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, g) => l.newest - g.newest),
    hasTopUp: i.some((l) => l.kind === "deposit")
  };
}
function Y5(t, e) {
  const n = t.filter((u) => u.kind === "deposit").sort((u, d) => u.newest - d.newest), r = t.find((u) => u.kind === "gift"), i = t.filter((u) => u.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + i.reduce((u, d) => u + d.amount, 0n), o = [], a = [], c = s > e;
  return n.forEach((u, d) => {
    if (u.amount <= e) {
      a.push(u);
      return;
    }
    const l = d === n.length - 1 && !c;
    o.push({ to: u.to, kind: "deposit", mode: l ? "all" : "amount", send: u.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - e }) : (r && a.push(r), a.push(...i)), { steps: o, tooSmall: a };
}
function Wh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const Ia = [100, 250, 500], Z5 = (t, e) => BigInt(t) * wn(e), oo = ["prepared", "signed", "unknown", "pending"], Q5 = 30 * 6e4, Xh = 6e4, wi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, J5 = 3e3, Yh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", al = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function t6(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, g = !1, p = null, k = !1, x = "", M = "", q = 0, K, $ = null, P, B = [], A, U = -1 / 0;
  const _ = /* @__PURE__ */ new Set();
  let L = null, S = !1, C = 0, b = null, N = null, Z = !1, V = null, ut = !1, it = null, de = !1, E = !1, O = !1, gt = !1, st = !1, It = 0, Ot = null, Ie = Promise.resolve();
  const Yt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ai.toString()), Gt = (w) => !!s && !(s.features ?? []).includes(w), ce = (w, I) => `xtrata.ppp.v1.${w}:${I}`, Ue = (w = s == null ? void 0 : s.address) => {
    if (!w) return [];
    try {
      const I = JSON.parse(t.store.get(ce("entries", w)) || "[]");
      return Array.isArray(I) ? I : [];
    } catch {
      return [];
    }
  }, Zt = (w) => {
    const I = [w, ...Ue(w.address).filter((R) => !(R.txid === w.txid && R.kind === w.kind))].slice(0, 200);
    t.store.set(ce("entries", w.address), JSON.stringify(I));
  }, ve = (w = s == null ? void 0 : s.address) => !!w && t.store.get(ce("on", w)) !== "0", En = (w) => {
    s != null && s.address && t.store.set(ce("on", s.address), w ? "1" : "0");
  }, te = () => Ue().filter((w) => oo.includes(w.status)), Le = () => Kt() ? [...te(), ...Ue(qt()).filter((w) => oo.includes(w.status))] : te(), tn = () => Ce(s == null ? void 0 : s.address), Ce = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(ce("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, He = (w, I = s == null ? void 0 : s.address) => {
    I && t.store.set(ce("deposit", I), JSON.stringify(w));
  };
  let Ft = null;
  const en = (w = Xh) => {
    const I = t.now();
    Ft = { since: Ft && I < Ft.until ? Ft.since : I, until: Math.max((Ft == null ? void 0 : Ft.until) ?? 0, I + w) };
  }, Oe = () => !!Ft && t.now() < Ft.until && (o === void 0 || o < Pe + wn(Yt())), De = () => !!tn() || Oe(), qt = () => Gt("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), Kt = () => !!(s != null && s.address) && qt() !== s.address, Te = () => Kt() ? c && c.for === qt() ? c.value : void 0 : o, Ge = (w) => w !== void 0 && w < Pe + sl, Ir = () => te().filter((w) => t.now() - w.created > Q5 && _.has(w.txid)), Lr = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), v = () => Lr() && !(s != null && s.linked), F = () => {
    const w = t.main();
    return !v() && !!w && !!(s != null && s.linked) && s.linked !== w;
  }, j = (w) => ce("return-to", w), G = (w = s == null ? void 0 : s.address) => {
    if (!w) return;
    const I = t.store.get(j(w));
    return I && Ys(I) && I !== w ? I : void 0;
  }, ct = (w = s == null ? void 0 : s.address) => L && L.for === w ? L.res : null;
  function wt() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const w = G();
    if (w) return { to: w, kind: "chosen" };
    const I = ct();
    if (I != null && I.ok && I.funder) return { to: I.funder, kind: "funder" };
  }
  const Jt = (w) => ce("gift", w);
  function mt() {
    const w = s == null ? void 0 : s.address;
    if (!w) return null;
    if ((V == null ? void 0 : V.for) === w) return V.info;
    try {
      const I = JSON.parse(t.store.get(Jt(w)) || "null");
      return I && typeof I.returnTo == "string" && typeof I.treasury == "string" ? I : null;
    } catch {
      return null;
    }
  }
  async function ee() {
    var lt;
    const w = s == null ? void 0 : s.address;
    if (!w || !t.giftInfo || !((lt = e == null ? void 0 : e.gifts) != null && lt.enabled) || ut) return;
    const I = (V == null ? void 0 : V.for) === w ? V : null, R = I ? I.ok ? I.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (I && t.now() - I.at < R) return;
    ut = !0;
    const J = mt();
    try {
      const z = await t.giftInfo(w);
      V = { for: w, info: z, ok: !0, at: t.now() }, t.store.set(Jt(w), JSON.stringify(z));
    } catch {
      V = { for: w, info: J, ok: !1, at: t.now() };
    } finally {
      ut = !1;
    }
  }
  const he = () => Ue().reduce((w, I) => oo.includes(I.status) ? w + BigInt(I.amount || "0") + BigInt(I.fee || "0") : w, 0n);
  function pe() {
    if (o === void 0) return 0;
    const w = o - he() - BigInt(ye.length) * wn(Yt());
    return w > 0n ? Kh(w, Yt()) : 0;
  }
  const le = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Mt = "EMPTY — ADD STX TO PLAY";
  function h() {
    var R;
    const w = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((R = mt()) != null && R.player) && !w) return null;
    const I = (J, lt) => ({ reason: J, text: lt });
    switch (Nt()) {
      case "connect":
      case "wrong-wallet":
        return I("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return I("locked", "UNLOCK TO LISTEN");
      case "link":
        return I("link", "FINISH SETUP TO LISTEN");
      case "over":
        return I("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return De() ? I("arriving", "YOUR PLAYS ARE ARRIVING") : I("out", Kt() ? le : Mt);
      case "ready":
        return !ve() || !(s != null && s.session) || s.session.playsLeft < 1 ? I("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : O ? pe() < 1 ? I("out", Kt() ? le : Mt) : null : I("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const m = () => {
    var w;
    return !!(s != null && s.address) && Kt() && !!((w = mt()) != null && w.player);
  };
  function f() {
    return m() ? { locked: !0, known: !0 } : null;
  }
  const H = 3 * 6e4, Y = () => !!mt() && !!t.history && !(s != null && s.linked);
  async function nt() {
    const w = s.address, I = mt(), { balance: R, nonce: J } = await t.chain.account(w), lt = await t.history(w, !0);
    if (!lt.ok) return null;
    const z = X5({ self: w, balance: R, inbound: lt.inbound, outgoing: lt.outgoing, gift: { sender: I.treasury, payer: I.returnTo } });
    if (!z.ok) return null;
    const yt = Y5(z.parts, io);
    return { balance: R, nonce: J, parts: z.parts, steps: yt.steps, tooSmall: yt.tooSmall.length };
  }
  const ht = () => de ? { state: "unavailable" } : !it || t.now() - it.at > H || o !== void 0 && o !== it.balance ? { state: "none" } : it.plan;
  function Nt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!v()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : F() ? "wrong-wallet" : s.state === "known" ? "locked" : !v() && s.linked !== w ? "link" : o === void 0 ? "loading" : o > Ls ? "over" : o < Pe + wn(Yt()) ? "fund" : "ready" : "loading";
  }
  const $e = () => {
    var w, I, R, J, lt;
    return {
      step: Nt(),
      busy: u,
      message: x,
      error: M,
      notice: jt(),
      gate: e,
      main: t.main(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : k5(o, Yt()),
      playsLeft: o === void 0 ? 0 : Kh(o, Yt()),
      allowance: o === void 0 ? Ls : il(o, BigInt(((w = tn()) == null ? void 0 : w.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: ve(),
      entries: Ue(),
      depositTxid: ((I = tn()) == null ? void 0 : I.txid) ?? K,
      depositPending: De(),
      arrival: De() ? { since: ((R = tn()) == null ? void 0 : R.at) ?? (Ft == null ? void 0 : Ft.since) ?? t.now(), graceMs: Xh } : null,
      walletOutdated: Gt("like"),
      linkedListening: A && A === t.main() ? B.map((z) => z.listening) : [],
      serverLinked: !!$ && P === `${t.main()}:${s == null ? void 0 : s.address}`,
      stuck: Ir().length,
      armed: gt,
      queued: ye.length,
      solo: v(),
      returnTo: (J = wt()) == null ? void 0 : J.to,
      returnToKind: (lt = wt()) == null ? void 0 : lt.kind,
      funderState: (() => {
        const z = ct();
        return z ? z.ok ? z.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const z = ct();
        return !!z && z.ok && z.distinct > 1;
      })(),
      walletCannotSolo: v() && Gt("standalone"),
      walletCannotMulti: Gt("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((z) => z !== t.main() && z !== (s == null ? void 0 : s.linked)),
      creditedTo: v() && (s != null && s.address) && (b == null ? void 0 : b.for) === s.address && b.main ? b.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(ce("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (N == null ? void 0 : N.for) === s.address && N.unused,
      gift: (() => {
        const z = mt();
        return z ? { player: z.player, from: z.from, source: z.source, amount: z.amount } : null;
      })(),
      giftPlays: mt() ? pe() : 0,
      playCost: wn(Yt()),
      giftStop: h(),
      albumLock: f(),
      returnPlan: ht(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Gt("slots"),
      likeFunds: (() => {
        var bt;
        const z = qt();
        if (!z || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const yt = Te();
        return { address: z, balance: yt, low: Ge(yt), album: Kt(), pending: !!Ce(z), txid: (bt = Ce(z)) == null ? void 0 : bt.txid, main: t.main() };
      })()
    };
  }, jt = () => q ? q < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Lt = (w, I = "") => {
    x = w, M = I, t.changed();
  };
  async function ge(w, I) {
    if (!u) {
      u = w, M = "", t.changed();
      try {
        await I();
      } catch (R) {
        const J = R instanceof Error ? R.message : String(R);
        M = /Cancelled in the listening wallet/.test(J) ? "" : J, M || (x = "Not now. Nothing was signed.", st = !0);
      } finally {
        u = null, await $n(!0);
      }
    }
  }
  const ln = () => !!(e != null && e.enabled) && e.here && (v() || !!t.main() && e.allowed), Mn = () => ln() && !F(), Be = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", ne = () => {
    if (F()) throw new Error(Be());
  };
  async function An() {
    if (!ln()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const ft = (w) => {
    const I = t.main();
    return w.request("listening.status", I ? { main: I } : void 0);
  };
  async function Ht(w = !1) {
    s != null && s.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await re(w)));
  }
  async function re(w = !1) {
    const I = qt();
    if (!(!Kt() || !I || (s == null ? void 0 : s.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === I && t.now() - c.at < 3e4))
      try {
        c = { for: I, value: await t.chain.balance(I), at: t.now() };
      } catch {
      }
  }
  async function vn(w) {
    if ((A !== w || t.now() - U >= 6e4) && (B = await t.links(w), A = w, U = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === w) return;
    const I = `${w}:${s.address}`;
    P === I && $ || ($ = B.find((R) => R.listening === s.address) ?? null, P = I);
  }
  async function Nn() {
    const w = s == null ? void 0 : s.address;
    if (!v() || !w || s != null && s.linked || !t.funder || S || !o || o <= 0n) return;
    const I = ct(w);
    if (I != null && I.ok && I.funder) return;
    const R = I != null && I.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, C - 1), 30 * 6e4);
    if (!(L && L.for === w && t.now() - L.at < R)) {
      S = !0;
      try {
        L = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        L = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        S = !1;
      }
      C = L.res.ok ? 0 : C + 1;
    }
  }
  async function Ji() {
    const w = s == null ? void 0 : s.address;
    if (!(!v() || !w || s != null && s.linked || !t.mainOf || Z) && !(b && b.for === w && (b.ok || t.now() - b.at < 6e4))) {
      Z = !0;
      try {
        b = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        b = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        Z = !1;
      }
    }
  }
  async function ci() {
    const w = s == null ? void 0 : s.address;
    if (!(!w || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (N == null ? void 0 : N.for) === w) && t.store.get(ce("created", w)) !== "1")
      try {
        N = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function Cr() {
    var lt;
    const w = s == null ? void 0 : s.address;
    if (!w) return !1;
    let I, R = !1;
    const J = /* @__PURE__ */ new Map();
    for (const z of Le())
      try {
        const yt = await t.chain.transaction(z.txid);
        if (!yt) {
          if (_.add(z.txid), t.now() - z.created > 15 * 6e4 && !J.has(z.address) && J.set(z.address, await t.chain.confirmedNonce(z.address)), I = J.get(z.address), I !== void 0 && I > BigInt(z.nonce)) {
            Zt({ ...z, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((z.status === "unknown" || z.status === "signed") && z.raw)
            try {
              await t.chain.broadcast(z.raw, z.txid), Zt({ ...z, status: "pending" });
            } catch (xt) {
              wi(xt) && Zt({ ...z, status: "failed", note: xt.message, raw: void 0 });
            }
          continue;
        }
        _.delete(z.txid);
        const bt = String(yt.tx_status);
        if (bt === "success" && yt.canonical !== !1 && yt.is_unanchored === !1) {
          if (Zt({ ...z, status: "confirmed", confirmedAt: t.now(), actualFee: String(yt.fee_rate ?? z.fee), raw: void 0 }), R = !0, z.kind === "like" && (k = !0, z.status !== "confirmed" && typeof z.liked == "boolean"))
            try {
              (lt = t.likeConfirmed) == null || lt.call(t, z.song, z.liked);
            } catch {
            }
        } else bt.startsWith("abort_") || bt.startsWith("dropped_") ? Zt({ ...z, status: "failed", note: bt, raw: void 0 }) : z.status !== "pending" && Zt({ ...z, status: "pending" });
      } catch {
      }
    for (const z of Kt() ? [w, qt()] : [w]) {
      const yt = Ce(z);
      if (yt)
        try {
          const bt = await t.chain.transaction(yt.txid), xt = String((bt == null ? void 0 : bt.tx_status) ?? "");
          (xt === "success" && bt.is_unanchored === !1 || xt.startsWith("abort_") || xt.startsWith("dropped_") || !bt && t.now() - yt.at > 2 * 36e5) && (He(null, z), xt === "success" && en(2e4), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return R;
  }
  async function $n(w = !1) {
    var I;
    try {
      const R = t.main();
      if ((w || !e || r !== R || t.now() - n > 3e5) && (e = await t.config(R), n = t.now(), r = R), !e.enabled || !e.here || !v() && (!R || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), gt && Rn(), t.changed();
        return;
      }
      await An(), s = await ft(i), F() && s.state === "unlocked" && (pr(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await ft(i)), R && e.allowed && await vn(R), await Ht(w), await Nn(), await Ji(), await ci(), await ee(), await Cr() && await Ht(!0), await re(), await ui(), q = 0;
    } catch {
      q++;
    }
    if (Nt() === "locked" ? Tr() : gt && Rn(), k) {
      k = !1;
      try {
        (I = t.likesChanged) == null || I.call(t);
      } catch {
      }
    }
    t.changed(), ye.length && !hr && Ur();
  }
  async function li(w) {
    const I = s == null ? void 0 : s.root;
    if (!I || s != null && s.slot || !(s != null && s.address) || Gt("slots")) return;
    const R = Number(t.store.get(ce("slot", I)));
    if (!(!Number.isSafeInteger(R) || R < 1))
      try {
        const { balance: J } = await t.chain.account(s.address);
        if (J >= Pe + wn(Yt())) return;
        await w.request("listening.openSlot", { slot: R }), s = await ft(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function un(w, I) {
    var z;
    ne();
    const R = !(s != null && s.address) || ve(s.address), J = s != null && s.linked ? (z = t.nameOf) == null ? void 0 : z.call(t, s.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: R ? Pn() : void 0, anyPasskey: I, ...t.main() ? { main: t.main() } : {}, ...J ? { label: J } : {} }), s = await ft(w), R && (ve(s.address) ? await lr() : await w.request("listening.stop")), await li(w), Lt(R ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const lt = p;
    p = null, lt && t.now() - lt.at < 12e4 && setTimeout(() => void $n(!0).then(() => se(lt)), 0);
  }
  function Tr() {
    gt || u || st || It >= 3 || !i || !(s != null && s.address) || (gt = !0, Ie = (async () => {
      try {
        await un(i, !1), It = 0;
      } catch (w) {
        const I = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(I) ? Ot || (st = !0, Lt("Not now. Nothing was signed.")) : /did not answer/.test(I) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (It++, M = I);
      } finally {
        gt = !1;
        const w = Ot;
        Ot = null, w ? await w() : await $n(!0);
      }
    })());
  }
  async function Rn(w) {
    gt && (Ot = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await Ie), w && await w(), t.changed();
  }
  const Pn = () => ({
    fee: Yt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ls.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function lr() {
    if (!(s != null && s.address)) return !1;
    if (O || (O = await t.tabLock(s.address)), !O)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Br(w, I) {
    const R = s.address, { balance: J, nonce: lt } = I ?? await t.chain.account(R);
    o = J;
    const z = await i.request("listening.prepareReturn", {
      mode: w.mode,
      balance: J.toString(),
      nonce: lt.toString(),
      fee: io.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (z.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const yt = w.mode === "amount" ? w.amount : w.mode === "all" ? J - io : J - Ls - io, bt = Za(z.raw);
    if (Jn(bt.payload.recipient).value !== w.to || String(bt.payload.amount) !== z.amount || yt !== void 0 && z.amount !== yt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const xt = {
      id: al(),
      address: R,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: z.recipient,
      amount: z.amount,
      fee: z.fee,
      nonce: lt.toString(),
      created: t.now(),
      status: "signed",
      raw: z.raw,
      txid: z.txid
    };
    t.validate(xt), Zt(xt);
    try {
      await t.chain.broadcast(z.raw, z.txid), Zt({ ...xt, status: "pending" });
    } catch (zt) {
      throw Zt({ ...xt, status: "unknown", note: zt.message }), zt;
    }
    return z;
  }
  const ws = Tc, ur = io;
  async function fr(w, I, R) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Gt("slots") || Gt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const J = s.slot ?? 0;
    if (w === I || ![w, I].includes(J) || ![w, I].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const lt = s.root ?? s.address, z = w === 0 ? lt : s.address, yt = I === 0 ? lt : s.address, { balance: bt, nonce: xt } = await t.chain.account(z);
    if (bt < R + ur + Pe) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const zt = await i.request("listening.signMove", { from: w, to: I, amount: R.toString(), fee: ur.toString(), nonce: xt.toString(), balance: bt.toString() }), Fe = Za(zt.raw);
    if (zt.from !== z || zt.to !== yt || zt.amount !== R.toString() || Jn(Fe.payload.recipient).value !== yt || String(Fe.payload.amount) !== R.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const fn = {
      id: al(),
      address: z,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: yt,
      amount: zt.amount,
      fee: zt.fee,
      nonce: xt.toString(),
      created: t.now(),
      status: "signed",
      raw: zt.raw,
      txid: zt.txid
    };
    t.validate(fn), Zt(fn);
    try {
      await t.chain.broadcast(zt.raw, zt.txid), Zt({ ...fn, status: "pending" });
    } catch (xe) {
      throw Zt({ ...fn, status: "unknown", note: xe.message }), xe;
    }
    return He({ txid: zt.txid, amount: zt.amount, at: t.now() }, yt), yt === lt && lt !== s.address ? c = null : a = -1 / 0, zt;
  }
  let Mr = !1;
  const dr = /* @__PURE__ */ new Map(), Nr = (w) => ce("float", w);
  async function ui() {
    if (Mr || (s == null ? void 0 : s.state) !== "unlocked" || !Kt() || Gt("move") || Gt("rootLike") || !s.address) return;
    const w = s.address;
    if (t.store.get(Nr(w)) === "1") return;
    const I = mt();
    if (!(I != null && I.player) || I.state !== "arrived") return;
    const R = Te();
    if (R === void 0 || o === void 0) return;
    if (!Ge(R)) {
      t.store.set(Nr(w), "1");
      return;
    }
    if (Ce(qt()) || _r() || Le().length || o < ws * 4n + Pe + ur) return;
    const J = dr.get(w);
    if (!(J && (J.n >= 3 || t.now() - J.at < 5 * 6e4))) {
      Mr = !0, dr.set(w, { n: ((J == null ? void 0 : J.n) ?? 0) + 1, at: t.now() });
      try {
        await fr(s.slot ?? 0, 0, ws), t.store.set(Nr(w), "1");
      } catch (lt) {
        console.warn("[radio] likes float not sent yet", lt);
      } finally {
        Mr = !1;
      }
    }
  }
  async function fi(w) {
    if (te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Gt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const I = await nt().catch(() => null);
    if (!I)
      throw it = null, de = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    de = !1, o = I.balance;
    const R = { balance: I.balance, nonce: I.nonce };
    if (w === "excess") {
      const bt = Wh(I.parts) ?? G();
      if (!bt) throw new Error("Choose where to send the excess first.");
      await Br({ mode: "excess", to: bt, linked: !1 }, R), it = null, Lt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const J = I.steps;
    if (!J.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!it && it.balance === I.balance && t.now() - it.at <= H && it.steps.length === J.length && it.steps.every((bt, xt) => bt.to === J[xt].to && bt.mode === J[xt].mode && bt.send === J[xt].send))) {
      it = {
        at: t.now(),
        balance: I.balance,
        steps: J,
        parts: I.parts,
        plan: { state: "ready", steps: J.map((bt) => ({ to: bt.to, kind: bt.kind, send: bt.send.toString() })), kept: I.tooSmall, excess: Wh(I.parts) }
      }, Lt(J.length > 1 ? `This goes back in ${J.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const z = J[0], yt = z.to ?? G();
    if (!yt) throw new Error("Choose where to send the rest first.");
    if (z.mode === "amount" && Gt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Br({ mode: z.mode, to: yt, linked: !1, ...z.mode === "amount" ? { amount: z.send } : {} }, R), it = null, J.length === 1 ? (En(!1), Lt("Returned ✓ Paying is off.")) : Lt(`Returned ✓ ${J.length - 1} more ${J.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const bs = {
    forceRefresh: () => $n(!0),
    create: () => ge("Waiting for your passkey…", async () => {
      const w = await An();
      await w.request("listening.unlock", { mode: "create", terms: Pn(), ...t.main() ? { main: t.main() } : {} }), s = await ft(w), s.address && t.store.set(ce("created", s.address), "1"), En(!0), Lt(v() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await lr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (w) => {
      w ? en() : Ft = null, t.changed();
    },
    giftSent: (w, I) => {
      !(s != null && s.address) || tn() || (He({ txid: w, amount: I.toString(), at: t.now() }), a = -1 / 0, V = null, Lt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (ne(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Gt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await An()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, I, R, J) => {
      He({ txid: R, amount: J.toString(), at: t.now() }, I), V = null, await bs.openAlbum(w), Lt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => ge("Opening…", async () => {
      if (ne(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Gt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || g) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === w) return;
      pr(), await i.request("listening.openSlot", { slot: w }), s = await ft(i), o = void 0, a = -1 / 0, it = null, de = !1;
      const I = s.root;
      I && w > 0 && t.store.set(ce("slot", I), String(w)), Lt(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const I = () => ge("Waiting for your passkey…", async () => un(await An(), w));
      return gt ? w ? Gt("cancel") ? (Lt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Rn(async () => {
        (Nt() === "locked" || Nt() === "intro") && await I();
      }) : Ie : I();
    },
    link: () => ge("Sign in your wallet…", async () => {
      ne();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const I = (await t.links(w)).find((R) => R.listening === s.address);
      if (I)
        await i.request("listening.link", { main: w, issued: I.issued, mainSignature: I.mainSignature });
      else {
        const R = { main: w, listening: s.address, issued: t.now() }, J = await t.signWithMain(w, z5(R)), lt = await i.request("listening.link", { main: w, issued: R.issued, mainSignature: J });
        await t.saveLink({ ...R, mainSignature: J, listeningSignature: lt.listeningSignature }), U = -1 / 0;
      }
      Lt("Linked ✓");
    }),
    deposit: () => ge("Approve the deposit in your wallet…", async () => {
      ne();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (tn()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Ht(!0);
      const I = il(o ?? 0n);
      if (I <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      K = await t.deposit(w, s.address, I), K && He({ txid: K, amount: I.toString(), at: t.now() }), Lt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => ge("Approve the top-up in your wallet…", async () => {
      ne();
      const w = t.main(), I = qt();
      if (!w || !I) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Ce(I)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const R = await t.chain.balance(I);
      Kt() ? c = { for: I, value: R, at: t.now() } : (o = R, a = t.now());
      const J = il(R);
      if (J <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const lt = await t.deposit(w, I, J);
      lt && He({ txid: lt, amount: J.toString(), at: t.now() }, I), Lt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (w) => ge("Adding plays…", async () => {
      if (ne(), !Kt()) throw new Error("Open the album you want to add plays to first.");
      if (!Ia.includes(w)) throw new Error("Choose one of the amounts offered.");
      const I = Z5(w, Yt());
      if (d || l || g) throw new Error("Still sending a payment. Try again in a moment.");
      if (Le().length || tn()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await fr(0, s.slot ?? 0, I), Lt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => ge("Confirm in the listening wallet…", async () => {
      if (!Mn()) throw new Error("Connect your wallet first.");
      await lr(), await i.request("listening.approveSession", Pn()), En(!0), Lt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => ge("Clearing…", async () => {
      for (const w of Ir())
        await t.chain.transaction(w.txid) || Zt({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Lt("Cleared ✓");
    }),
    switchOff: () => ge("Switching off…", async () => {
      pr(), await (i == null ? void 0 : i.request("listening.stop")), En(!1), Lt("Paying is off. Music stays free.");
    }),
    lock: () => ge("Locking…", async () => {
      pr(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, Lt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const I = String(w ?? "").trim();
      if (!(s != null && s.address)) return Lt("", "Unlock the listening wallet first.");
      if (!Ys(I)) return Lt("", "Enter a standard mainnet address (it starts with SP).");
      if (I === s.address) return Lt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(j(s.address), I), Lt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(j(s.address), ""), t.changed();
    },
    returnFunds: (w) => ge("Check the return in the listening wallet…", async () => {
      if (!Mn()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (Y()) return fi(w);
      const I = wt();
      if (!I) throw new Error(v() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (I.kind !== "linked" && Gt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Br({ mode: w, to: I.to, linked: I.kind === "linked" }), w === "all" && En(!1), Lt(w === "all" ? I.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ye = [], di = 10, Pr = 30 * 6e4;
  let hr = !1;
  const _r = () => d || !!u || l || g, pr = () => {
    ye.length && (ye.length = 0, t.changed());
  };
  async function hi(w) {
    if (!ye.some((I) => I.id === w.id) && !Ue().some((I) => I.id === w.id) && (ye.push({ ...w, at: t.now() }), ye.length > di && ye.shift()), _r() || te().length) {
      const I = ye.length;
      x = `Queued ${I === 1 ? "this song" : I + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Ur();
  }
  async function Ur() {
    if (!hr) {
      hr = !0;
      try {
        for (; ye.length; ) {
          for (; ye.length && t.now() - ye[0].at > Pr; ) ye.shift();
          if (!ye.length || _r() || await W(ye[0]) === "wait") return;
          ye.shift();
        }
      } finally {
        hr = !1, t.changed();
      }
    }
  }
  async function W(w) {
    var I;
    d = !0;
    try {
      await $n();
      const R = Nt();
      if (R === "loading") return "wait";
      if (R !== "ready" || !ve() || !(s != null && s.session) || s.session.playsLeft < 1 || !O) return "done";
      if (te().length) return "wait";
      E || (await t.chain.verify(), E = !0);
      const J = s.address, { balance: lt, nonce: z } = await t.chain.account(J);
      o = lt, a = t.now();
      const yt = await t.chain.owner(ol, w.song);
      if (yt === J || yt === t.main()) return "done";
      const bt = await i.request("listening.signPlay", {
        core: ol,
        song: w.song,
        receipt: w.id,
        fee: Yt().toString(),
        nonce: z.toString(),
        balance: lt.toString()
      }), xt = {
        id: w.id,
        address: J,
        kind: "play",
        core: ol,
        song: w.song,
        recipient: yt,
        amount: "50",
        fee: Yt().toString(),
        nonce: z.toString(),
        created: t.now(),
        status: "signed",
        raw: bt.raw,
        txid: bt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(xt), Zt(xt);
      const zt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(bt.raw, bt.txid), Zt({ ...xt, status: "pending" }), x = `♪ Paid ${zt}`, M = "";
      } catch (Fe) {
        Zt({ ...xt, status: wi(Fe) ? "failed" : "unknown", note: Fe.message, ...wi(Fe) ? { raw: void 0 } : {} }), M = Fe.message;
      }
      return s = await ft(i), "done";
    } catch (R) {
      const J = R instanceof Error ? R.message : "payment unavailable";
      return (I = mt()) != null && I.player ? (x = "Payment is taking a moment: " + J, "wait") : (x = "This song played free: " + J, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function rt(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Nt()) || Gt("like") ? !1 : (se(w), !0);
  }
  async function se(w) {
    const I = w.title ? `“${w.title}”` : `song #${w.song}`, R = (Gn) => {
      var to;
      M = Gn, x = "";
      try {
        (to = t.likeFailed) == null || to.call(t, w.song);
      } catch {
      }
      t.changed();
    }, J = Kt(), lt = Nt(), z = t.main(), yt = J && (lt === "fund" || lt === "over") ? "ready" : lt, bt = v() ? qt() : z;
    if (yt === "locked") {
      p = { ...w, at: t.now() }, Lt(`Unlock to like ${I}. It sends straight after.`);
      return;
    }
    if (yt === "wrong-wallet") return R(Be());
    if (yt === "link") return R("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (v() && Gt("standalone")) return R("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (yt === "fund") return R("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (yt === "over") return R("Return the excess first: the listening wallet holds more than 1 STX.");
    if (J) {
      await re(!0);
      const Gn = Te();
      if (Ge(Gn))
        return t.changed(), R(Yh);
    }
    if (yt !== "ready" || !bt) return R("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return R("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!O) return R("Pay-per-play is running in another tab. Like from that tab.");
    const xt = Ue(qt()).find((Gn) => Gn.kind === "like" && Gn.song === w.song);
    if (xt && oo.includes(xt.status))
      return R(`Your last like for ${I} is still on its way. It can change again once it confirms.`);
    if (l) return R("One like at a time: your last one is still being sent.");
    if ((xt == null ? void 0 : xt.status) === "confirmed" && t.now() - (xt.confirmedAt ?? 0) < J5)
      return R(`Your like for ${I} has only just confirmed. Try again in a moment.`);
    let zt;
    g = !0;
    try {
      zt = t.likeState ? (await t.likeState(bt, w.song)).by : w.likedBy ?? [];
    } catch {
      zt = w.likedBy;
    } finally {
      g = !1;
    }
    if (!zt) return R(`Could not check ${I} right now. Try the heart again.`);
    const Fe = qt(), xe = ((xt == null ? void 0 : xt.status) === "confirmed" && typeof xt.liked == "boolean" && t.now() - (xt.confirmedAt ?? xt.created) < 5 * 6e4 ? xt.liked : void 0) ?? zt.includes(Fe);
    if (!xe && zt.some((Gn) => Gn !== Fe)) return R(v() ? `${I} was liked from another wallet of yours. Unlike it there.` : `${I} was liked from your main wallet${zt.includes(z) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Me({ song: w.song, liked: !xe, title: w.title, artist: w.artist });
  }
  async function Me(w) {
    var J, lt, z;
    if (l) {
      Lt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const I = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, R = t.wait ?? ((yt) => new Promise((bt) => setTimeout(bt, yt)));
    try {
      Lt(`${w.liked ? "Liking" : "Unliking"} ${I}…`);
      const yt = t.now() + 12e4;
      for (; d || (Kt() ? Ue(qt()).some((xe) => oo.includes(xe.status)) : te().length); ) {
        if (t.now() > yt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await R(5e3), await $n(!0);
      }
      if (!Kt() && Nt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const bt = qt(), { balance: xt, nonce: zt } = await t.chain.account(bt);
      if (Kt() ? c = { for: bt, value: xt, at: t.now() } : (o = xt, a = t.now()), Ge(xt)) throw new Error(Yh);
      const Fe = await i.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: sl.toString(),
        nonce: zt.toString(),
        balance: xt.toString()
      }), fn = {
        id: al(),
        address: bt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: sl.toString(),
        nonce: zt.toString(),
        created: t.now(),
        status: "signed",
        raw: Fe.raw,
        txid: Fe.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(fn), Zt(fn);
      try {
        await t.chain.broadcast(Fe.raw, Fe.txid), Zt({ ...fn, status: "pending" }), x = `${w.liked ? "♥ Liked" : "Unliked"} ${I}`, M = "";
        try {
          (J = t.likeSent) == null || J.call(t, w.song, w.liked);
        } catch {
        }
      } catch (xe) {
        if (Zt({ ...fn, status: wi(xe) ? "failed" : "unknown", note: xe.message, ...wi(xe) ? { raw: void 0 } : {} }), M = xe.message, wi(xe)) try {
          (lt = t.likeFailed) == null || lt.call(t, w.song);
        } catch {
        }
      }
      s = await ft(i);
    } catch (yt) {
      M = "Like not sent: " + (yt instanceof Error ? yt.message : "the listening wallet is unavailable");
      try {
        (z = t.likeFailed) == null || z.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Ur();
    }
  }
  return { snapshot: $e, refresh: $n, onListened: hi, heart: rt, toggleLike: se, ...bs };
}
const Fy = ["Connect", "Passkey", "Link & fund", "Listen"], jy = ["Passkey", "Add 1 STX", "Listen"], pu = (t) => t ? jy : Fy;
function e6(t) {
  if (t.solo) return n6(t);
  const e = Fy.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
      const r = t.entries.filter((i) => i.kind === "play");
      return r.some((i) => i.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((i) => ["signed", "pending", "unknown"].includes(i.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function n6(t) {
  const e = jy.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
      const r = t.entries.filter((i) => i.kind === "play");
      return r.some((i) => i.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((i) => ["signed", "pending", "unknown"].includes(i.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function r6(t, e) {
  return !e || e.at >= pu(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const s6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function i6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !s6(r.id)));
}
const o6 = {}, a6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, c6 = (t) => {
  const e = o6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, l6 = (t) => `/hiro/${t}`, u6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, f6 = (t) => {
  const e = c6(t);
  if (e)
    return [u6(e)];
  const n = a6[t];
  return typeof window < "u" ? [`${window.location.origin}${l6(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, d6 = {}, Zh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, h6 = "xtrata.log.enabled", p6 = "xtrata.log.level", g6 = "xtrata.log.tags", y6 = "xtrata.log.dedupe", ga = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, w6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, b6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, m6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, x6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, S6 = () => {
  const t = d6 ?? {}, e = ga(h6) ?? t.VITE_LOG_ENABLED, n = ga(p6) ?? t.VITE_LOG_LEVEL, r = ga(g6) ?? t.VITE_LOG_TAGS, i = ga(y6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: w6(e),
    level: b6(n) ?? "warn",
    tags: x6(r),
    dedupe: m6(i)
  };
}, E6 = (t, e, n) => !t.enabled || Zh[n] < Zh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), A6 = (t, e, n, r) => {
  const i = S6();
  if (!E6(i, e, t) || $6(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, v6 = /* @__PURE__ */ new Set();
let Qh = null;
const $6 = (t, e, n, r, i) => (Qh !== t && (v6.clear(), Qh = t), !1), k6 = (t, e, n) => A6("debug", t, e, n), I6 = {}, L6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, C6 = (t) => {
  const e = I6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : L6[t];
}, T6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, B6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return T6.test(n) ? n : null;
}, M6 = (t) => t.replace(/\/+$/, ""), N6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Jh = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.startsWith("0x") ? t.slice(2) : t;
  if (!e || e.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(e))
    return null;
  let n = "";
  for (let r = 0; r < e.length; r += 2) {
    const i = Number.parseInt(e.slice(r, r + 2), 16);
    if (i < 32 || i > 126)
      return null;
    n += String.fromCharCode(i);
  }
  return n;
}, bi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, P6 = (t) => {
  var c, u;
  let e;
  try {
    e = Jn(P8(t));
  } catch {
    return null;
  }
  const n = bi(e);
  if (!n || n.success === !1)
    return null;
  const r = bi(n.value), i = bi(r == null ? void 0 : r.value), s = bi(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = Jh((c = bi(s.name)) == null ? void 0 : c.value), a = Jh((u = bi(s.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : B6(`${o}.${a}`);
}, _6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${M6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [xy(ry(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : P6(s.result);
}, U6 = async (t) => {
  const e = t.address.trim();
  if (!Ii(e))
    return null;
  const n = C6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of f6(t.network))
    try {
      return await _6({
        baseUrl: i,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return k6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: N6(r)
  }), null;
};
function H6(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, i = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((u) => {
      c.pending = !1, u && (c.name = u, e());
    }).catch(() => {
      c.pending = !1, c.failedAt = i();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = s.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && i() - c.failedAt >= r && o(a, c) : (c = { name: null, pending: !1 }, s.set(a, c), o(a, c)), c.name;
    }
  };
}
const t0 = Object.freeze({
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
}), e0 = Object.freeze({ 139: "melophonic" });
function O6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(t0, n) ? t0[n] : Object.hasOwn(e0, n) ? e0[n] : e;
}
const n0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function D6(t, e = "") {
  return Object.hasOwn(n0, String(t)) ? n0[String(t)] : e;
}
const zy = 100000n, $f = 1000000n, ec = 3000n, F6 = (t, e) => `${t}#gift=${e}`, j6 = 100, ya = (t, e = ai) => t <= Pe ? 0 : Number((t - Pe) / wn(e)), r0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Ry = "xtrata.xyz/radio/gifts", cl = j6, z6 = "Create a prefunded Xtrata radio gift batch", R6 = (t) => ({
  domain: Ws({ name: ze(Ry), version: ze("1"), "chain-id": rr(1) }),
  message: Ws({
    purpose: ze(z6),
    creator: ze(t.creator),
    count: rr(t.count),
    amount: rr(BigInt(t.amount)),
    label: ze(t.label),
    issued: rr(t.issued),
    ...t.player ? { player: ze(t.player) } : {}
  })
}), G6 = (t, e, n = ai) => Pe + BigInt(t) * wn(n) + (e ? Tc : 0n), K6 = (t, e = ai) => Number(($f - Pe - (t ? Tc : 0n)) / wn(e)), V6 = (t, e) => BigInt(t) * (e + ec);
function q6(t, e, n, r = ai) {
  const i = n ? Tc : 0n, s = e > Pe + i ? e - Pe - i : 0n, o = Number(s / wn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Ja,
    fees: BigInt(o) * r,
    reserve: Pe,
    float: i,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: ec,
    perCopy: e + ec,
    total: V6(t, e)
  };
}
const W6 = (t) => t >= zy && t <= $f, s0 = 40, X6 = "Create an Xtrata radio gift player", Y6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function i0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && Y6.test(t) : !n;
}
function Z6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!i0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!i0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > s0) throw new Error(`A player holds 1 to ${s0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const Q6 = (t) => op(dp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), J6 = (t) => ({
  domain: Ws({ name: ze(Ry), version: ze("1"), "chain-id": rr(1) }),
  message: Ws({
    purpose: ze(X6),
    admin: ze(t.admin),
    player: ze(t.hash),
    issued: rr(t.issued)
  })
}), Co = (t) => t.tracks.filter((e) => !e.hidden), t$ = (t) => t.tracks.find((e) => e.hidden) ?? null, e$ = [300, 500, 1e3], o0 = 1800, ll = /* @__PURE__ */ new Map();
async function Gy(t) {
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
async function n$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await Gy(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function Ky(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = ll.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      ll.set(t, { ...a, until: Date.now() + o0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ll.delete(t), i();
      }, o0 + 50);
    }
  }, s;
}
const Cs = (t, e, n, r, i) => Ky(t, e, async () => await Gy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), ms = "xtrata.radio.gift.incoming.v1", a0 = (t) => "xtrata.radio.gift.mine.v1:" + t, c0 = (t) => "xtrata.radio.gift.batches.v1:" + t, pt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, br = (t, e, n = "") => {
  const r = pt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, wa = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, hn = (t) => Yn(t).replace(/\.?0+$/, "");
function r$(t) {
  let e = null;
  const n = (v) => [5e3, 1e4, 2e4, 3e4][v] ?? 6e4, r = (() => {
    try {
      const v = new URL(location.href), F = new URLSearchParams(v.hash.slice(1)).get("gift") ?? v.searchParams.get("gift");
      return F !== null && (v.searchParams.delete("gift"), history.replaceState(null, "", v.pathname + (v.search || ""))), r0(F) ? F : null;
    } catch {
      return null;
    }
  })(), i = (() => {
    try {
      const v = JSON.parse(t.store.get(ms) || "null");
      return r0(v == null ? void 0 : v.code) ? v.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? i;
  if (s) {
    e = { code: s }, t.store.set(ms, JSON.stringify({ code: s, at: t.now() }));
    let v = 0;
    const F = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (j) => {
      const G = await j.json().catch(() => ({}));
      if (j.status === 404) {
        t.store.set(ms, null), e = { ...e, error: (G == null ? void 0 : G.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!j.ok) throw new Error("busy");
      const ct = G;
      e = { ...e, view: ct, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ct.status) && t.store.set(ms, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void F(), n(v++)));
    });
    F();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const v = e == null ? void 0 : e.view;
    return !(v != null && v.player) || !o() ? null : { player: v.player, from: u(v), plays: ya(BigInt(v.amount)) };
  }, c = () => {
    e = null, t.store.set(ms, null), t.changed();
  }, u = (v) => v.from ? t.who(v.from) : v.label ? `Xtrata Radio · ${v.label}` : "Xtrata Radio";
  let d = {};
  const l = (v) => {
    if (d.box) return d.box;
    const F = pt("div", "", "ppp-gift-check");
    d.box = F;
    const j = () => {
      const G = window.turnstile;
      !G || d.rendered || (d.rendered = !0, G.render(F, { sitekey: v, callback: (ct) => {
        d.token = ct, t.changed();
      }, "expired-callback": () => {
        d.token = void 0;
      } }));
    };
    if (window.turnstile) j();
    else {
      const G = document.createElement("script");
      G.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", G.async = !0, G.onload = j, document.head.append(G);
    }
    return F;
  }, g = (v) => {
    queueMicrotask(() => void v());
  };
  let p;
  async function k(v) {
    var G, ct, wt, Jt, mt, ee, he, pe, le;
    if (!e || e.claiming || !v.listening) return;
    const F = !!((G = e.view) != null && G.player);
    if (F && !v.root) return;
    e.claiming = !0, e.error = void 0, (ct = t.claiming) == null || ct.call(t, !0), t.changed();
    const j = async (Mt) => {
      const h = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: d.token, ...Mt })
      });
      return { res: h, r: await h.json().catch(() => ({})) };
    };
    try {
      let Mt = 0, h = v.listening, m;
      if (F) {
        const Y = Number((wt = await t.json("/radio/gift/slots?root=" + encodeURIComponent(v.root))) == null ? void 0 : wt.next);
        if (!Number.isSafeInteger(Y) || Y < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Mt = Y;
        for (let nt = 0; ; nt++) {
          const ht = await t.album.bind(Mt);
          if (h = ht.address, m = await j({ wallet: h, binding: ht }), m.res.status === 409 && /just taken/.test(((Jt = m.r) == null ? void 0 : Jt.error) || "") && nt < 5) {
            Mt += 1;
            continue;
          }
          break;
        }
      } else m = await j({ wallet: h });
      const { res: f, r: H } = m;
      if (f.status === 503 && /sending another gift/.test((H == null ? void 0 : H.error) || "")) {
        e.waiting = !0, (mt = t.claiming) == null || mt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!f.ok) {
        const Y = String((H == null ? void 0 : H.error) || "");
        if (f.status === 404 || f.status === 410 || f.status === 409 && /already had a gift|brand-new/.test(Y))
          throw t.store.set(ms, null), new Error(Y || "This gift cannot be opened.");
        if (f.status === 429 || f.status === 403 || f.status === 400 && !/wallet number/i.test(Y)) throw new Error(Y || `Could not open the gift (${f.status}).`);
        const ht = /topping up/.test(Y) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(Y) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(Y) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(ht), { retry: !0, slow: /topping up|not paid for yet/.test(Y) });
      }
      e.done = !0, t.store.set(ms, null), F ? await t.album.arrived(Mt, h, H.txid, BigInt(H.amount)) : t.giftSent(H.txid, BigInt(H.amount));
    } catch (Mt) {
      const h = Mt, m = h.name === "TypeError" || h.name === "AbortError" || h.name === "TimeoutError" || /wallet number/i.test(h.message);
      if (h.retry || m) {
        const f = e.tries ?? 0;
        e.tries = f + 1, e.retry = { text: h.retry ? h.message : "Still sending your gift… the network is slow, trying again." }, (ee = t.claiming) == null || ee.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, h.slow ? 6e4 : n(f));
      } else
        e.error = h.message, (he = t.claiming) == null || he.call(t, !1);
      d.token = void 0;
      try {
        (le = (pe = window.turnstile) == null ? void 0 : pe.reset) == null || le.call(pe, d.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let x = null;
  function M(v) {
    if (!v.listening || !v.depositPending || v.step !== "fund")
      return x = null, [];
    if (!x || x.wallet !== v.listening || t.now() - x.at > 3e4) {
      const j = v.listening;
      x = { ...(x == null ? void 0 : x.wallet) === j ? x : {}, wallet: j, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(j)).then((G) => {
        var ct, wt;
        (x == null ? void 0 : x.wallet) === j && (x.state = (ct = G == null ? void 0 : G.gift) == null ? void 0 : ct.state, x.problem = ((wt = G == null ? void 0 : G.gift) == null ? void 0 : wt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(x.state === "sending" && x.problem)) return [];
    const F = pt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return F.title = `Network reply: ${x.problem}`, [F];
  }
  function q(v, F, j = !1) {
    var ee, he;
    const G = F.player, ct = BigInt(F.amount), wt = j ? [] : [pt("p", `🎁 ${u(F)} sent you “${G.title}”${G.subtitle ? ` by ${G.subtitle}` : ""}: ${Co(G).length} ${Co(G).length === 1 ? "song" : "songs"} and ${ya(ct).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!v.root && ["fund", "ready", "over", "link"].includes(v.step)))
      return j || wt.push(pt("p", v.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : v.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), wt;
    if (v.walletCannotAlbums)
      return wt.push(pt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), wt;
    const mt = (he = (ee = v.gate) == null ? void 0 : ee.gifts) == null ? void 0 : he.turnstileSiteKey;
    return mt && !d.token ? wt.push(pt("p", "One quick check and it is yours:", "ppp-mute"), l(mt)) : !e.claiming && !e.error && !e.waiting && !e.retry && g(() => k(v)), wt.push(...K(v, "Sending your album…")), wt;
  }
  function K(v, F) {
    const j = [];
    return e.claiming || e.waiting ? j.push(pt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : F, "ppp-cyan")) : e.retry && j.push(pt("p", e.retry.text, "ppp-warn"), br("Try now", () => {
      clearTimeout(p), e.retry = void 0, k(v);
    }, "quiet")), e.error && j.push(pt("p", e.error, "ppp-bad"), br("Try again", () => {
      e.error = void 0, k(v);
    })), j;
  }
  const $ = (v) => {
    var F;
    return !!e && !e.done && !e.error && o() && !!v.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !v.linked && !v.creditedTo && (v.createdHere || v.brandNew || !!((F = e.view) != null && F.player)) && (v.balance ?? 0n) === 0n && !v.entries.length);
  };
  function P(v, F = {}) {
    var le, Mt;
    const j = M(v);
    if (!e || ["off", "elsewhere"].includes(v.step)) return j;
    const G = e.view;
    if (e.error && !G) return [pt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!G) return [pt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return j;
    if (G.status === "claimed" || G.status === "claiming") return [pt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(G.status)) return [pt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (G.status === "pending-deposit") return [pt("p", `🎁 ${u(G)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (G.player) return [...q(v, G, !!F.bare), ...j];
    if (!!v.listening && (!(v.createdHere || v.brandNew) || !!v.linked || !!v.creditedTo || (v.balance ?? 0n) > 0n || v.entries.length > 0))
      return [pt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), br("Forget this gift link here", c, "quiet")];
    const wt = BigInt(G.amount), Jt = ya(wt).toLocaleString(), ee = [pt(
      "p",
      `🎁 ${u(G)} sent you ${hn(wt)} STX of on-chain music: about ${Jt} paid plays.`,
      "ppp-gift"
    )], he = !!v.listening && (v.createdHere || v.brandNew) && !v.linked && !v.creditedTo && v.step === "fund" && (v.balance ?? 1n) === 0n && !v.depositPending && !v.entries.length, pe = (Mt = (le = v.gate) == null ? void 0 : le.gifts) == null ? void 0 : Mt.turnstileSiteKey;
    return he ? (pe && !d.token ? ee.push(pt("p", "One quick check and it is yours:", "ppp-mute"), l(pe)) : !e.claiming && !e.error && !e.waiting && !e.retry && g(() => k(v)), ee.push(...K(v, "Sending your gift…"))) : v.step === "intro" ? ee.push(pt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : v.listening && v.linked ? ee.push(pt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), br("Forget this gift link here", c, "quiet")) : v.listening && (v.balance ?? 0n) > 0n && ee.push(pt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), br("Forget this gift link here", c, "quiet")), ee;
  }
  async function B(v, F, j) {
    var G;
    try {
      const ct = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(v));
      if ((G = ct == null ? void 0 : ct.gift) != null && G.returnTo) return { ok: !0, funder: ct.gift.returnTo, txId: ct.gift.txid ?? void 0, amount: ct.gift.amount, distinct: 1 };
    } catch {
      if (j) return { ok: !1 };
    }
    return F();
  }
  const A = pt("div", "", "ppp-gift-fold");
  let U = 250000n, _ = "", L = "";
  const S = (v) => {
    try {
      const F = JSON.parse(t.store.get(a0(v)) || "[]");
      return Array.isArray(F) ? F : [];
    } catch {
      return [];
    }
  }, C = (v, F) => t.store.set(a0(v), JSON.stringify(F.slice(0, 50)));
  let b = 0;
  async function N(v) {
    const F = S(v);
    for (const j of F)
      if (!(j.view && ["claimed", "refunded", "expired"].includes(j.view.status)))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: j.id, ...j.txid ? { txid: j.txid } : {} }) }) : await t.json("/radio/gift?id=" + j.id), j.error = void 0;
        } catch (G) {
          j.error = G.message;
        }
    C(v, F), t.changed();
  }
  async function Z(v) {
    if (_) return;
    _ = "Starting your gift…", L = "", t.changed();
    let F = null;
    try {
      F = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: v, amount: U.toString() }) });
      const j = S(v);
      j.unshift({ id: F.id, code: F.code, amount: U.toString(), at: t.now() }), C(v, j), _ = "Approve the gift in your wallet…", t.changed();
      const G = await t.pay(v, F.depositTo, BigInt(F.deposit), F.memo), ct = S(v), wt = ct.find((Jt) => Jt.id === F.id);
      wt && (wt.txid = G, wt.view = { status: "pending-deposit", amount: U.toString(), source: "friend", from: v, label: "", expires: 0 }), C(v, ct), L = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", N(v);
    } catch (j) {
      L = j.message || "Not sent.";
    } finally {
      _ = "", t.changed();
    }
  }
  const V = (v) => "xtrata.radio.gift.players.v1:" + v, ut = (v) => {
    try {
      const F = JSON.parse(t.store.get(V(v)) || "[]");
      return Array.isArray(F) ? F.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id)) : [];
    } catch {
      return [];
    }
  };
  async function it(v, F) {
    var j;
    if (!_) {
      _ = "Checking the player…", L = "", t.changed();
      try {
        const G = F.tracks.split(/[\s,]+/).filter(Boolean).map((he) => Number(he.replace(/^#/, ""))), ct = Z6({ title: F.title.trim(), subtitle: F.subtitle.trim(), tracks: G, cover: (j = F.cover) != null && j.trim() ? Number(F.cover.trim().replace(/^#/, "")) : null });
        _ = "Sign in your wallet…", t.changed();
        const wt = { admin: v, hash: Q6(ct), issued: t.now() }, Jt = await t.sign(v, J6(wt));
        _ = "Making the player…", t.changed();
        const mt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ct, request: wt, signature: Jt }) }), ee = ut(v).filter((he) => he.id !== mt.id);
        ee.unshift({ id: mt.id, title: mt.title, tracks: mt.tracks }), t.store.set(V(v), JSON.stringify(ee.slice(0, 30))), L = `${mt.existing ? "That player already exists" : "Player made"} ✓ “${mt.title}” · ${mt.tracks} songs. Pick it below for a batch.`;
      } catch (G) {
        L = G.message || "Not made.";
      } finally {
        _ = "", t.changed();
      }
    }
  }
  const de = (v, F) => F6(v || location.origin + "/radio.html", F), E = (v) => n$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: v }), O = (v) => {
    try {
      const F = JSON.parse(t.store.get(c0(v)) || "[]");
      return Array.isArray(F) ? F.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id) && Array.isArray(j.codes)) : [];
    } catch {
      return [];
    }
  }, gt = (v, F) => t.store.set(c0(v), JSON.stringify(F.slice(0, 20))), st = (v) => !!v.view && v.view.status === "live" && v.view.copies.waiting + v.view.copies.claiming + v.view.copies.refunding === 0, It = (v, F) => t.json(v, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(F) });
  let Ot = 0;
  async function Ie(v) {
    const F = O(v);
    for (const j of F)
      if (!st(j))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await It("/radio/gift/batch/confirm", { id: j.id, ...j.txid ? { txid: j.txid } : {} }) : await t.json("/radio/gift/batch?id=" + j.id), j.error = void 0;
        } catch (G) {
          j.error = G.message;
        }
    try {
      const j = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(v));
      for (const G of (j == null ? void 0 : j.batches) ?? []) {
        const ct = F.find((wt) => wt.id === G.id);
        if (ct) {
          ct.error || (ct.view = G);
          continue;
        }
        F.push({ id: G.id, codes: [], count: G.count, amount: G.amount, label: G.label, player: G.player, depositTo: "", deposit: G.deposit, memo: G.memo, at: 0, view: G });
      }
    } catch {
    }
    gt(v, F), t.changed();
  }
  async function Yt(v, F) {
    const j = O(v).find((G) => G.id === F);
    if (!(!j || !j.depositTo || _)) {
      _ = "Approve the payment in your wallet…", L = "", t.changed();
      try {
        const G = await t.pay(v, j.depositTo, BigInt(j.deposit), j.memo), ct = O(v), wt = ct.find((Jt) => Jt.id === F);
        wt && (wt.txid = G), gt(v, ct), L = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", _ = "", Ie(v);
      } catch (G) {
        L = `${/cancel/i.test(G.message) ? "Payment cancelled." : G.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        _ = "", t.changed();
      }
    }
  }
  async function Gt(v, F, j, G) {
    if (_) return;
    if (!F.ok) {
      L = F.reason, t.changed();
      return;
    }
    _ = "Sign in your wallet…", L = "", t.changed();
    let ct = null;
    try {
      const wt = { creator: v, count: F.count, amount: F.amount.toString(), label: j, issued: t.now(), ...G ? { player: G } : {} }, Jt = await t.sign(v, R6(wt));
      _ = "Making your links…", t.changed(), ct = await It("/radio/gift/batch", { request: wt, signature: Jt });
      const mt = O(v);
      mt.unshift({ id: ct.id, codes: ct.codes, count: F.count, amount: ct.amount, label: j, player: G ?? null, depositTo: ct.depositTo, deposit: ct.deposit, memo: ct.memo, at: t.now() }), gt(v, mt);
    } catch (wt) {
      L = wt.message || "Not made.", _ = "", t.changed();
      return;
    }
    _ = "", t.changed(), await Yt(v, ct.id);
  }
  function ce() {
    const v = !!Oe.value, F = De.value === "max" ? K6(v) : Number(De.value), j = G6(F, v), G = Number(qt.value);
    return !Number.isInteger(G) || G < 1 || G > cl ? { ok: !1, reason: `Make 1 to ${cl} copies at a time.`, album: v, plays: F, amount: j, count: G } : W6(j) ? { ok: !0, reason: "", album: v, plays: F, amount: j, count: G, bill: q6(G, j, v) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: v, plays: F, amount: j, count: G };
  }
  const Ue = () => {
    const v = ce();
    if (!v.ok) return v.reason;
    const F = v.bill;
    return `Each copy: ${v.plays.toLocaleString()} paid plays (${hn(F.holders)} to song holders, ${hn(F.fees)} network fees)${v.album ? `, ${hn(F.float)} for the album’s likes` : ""}, ${hn(F.reserve)} kept so a listener can return what is left, + ${hn(F.sendFee)} to send it = ${hn(F.perCopy)} STX. ${v.count} copies = ${hn(F.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Zt = (v, F) => F.codes.map((j) => de(v, j)), ve = pt("input");
  ve.type = "range", ve.min = String(zy), ve.max = String($f), ve.step = "50000", ve.value = String(U), ve.setAttribute("aria-label", "Gift amount");
  const En = pt("p", "", "ppp-gift-amount"), te = br("", () => {
    const v = t.main();
    v && Z(v);
  }, "primary"), Le = () => {
    En.textContent = tn(), te.textContent = `Gift ${hn(U)} STX`;
  };
  ve.oninput = () => {
    U = BigInt(ve.value), Le();
  };
  const tn = () => `${hn(U)} STX · about ${ya(U).toLocaleString()} paid plays · you pay ${hn(U + ec)} STX with the network fee`;
  Le();
  const Ce = pt("input");
  Ce.maxLength = 60, Ce.placeholder = "Title, e.g. Proof of Sound", Ce.setAttribute("aria-label", "Player title");
  const He = pt("input");
  He.maxLength = 80, He.placeholder = "Artist (optional)", He.setAttribute("aria-label", "Player subtitle");
  const Ft = pt("textarea");
  Ft.rows = 3, Ft.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ft.setAttribute("aria-label", "Songs");
  const en = pt("input");
  en.inputMode = "numeric", en.placeholder = "Cover inscription number (optional), shown when the album loads", en.setAttribute("aria-label", "Cover inscription");
  const Oe = pt("select");
  Oe.setAttribute("aria-label", "Batch album");
  const De = pt("select");
  De.setAttribute("aria-label", "Plays per copy");
  for (const v of e$) De.append(wa(`${v.toLocaleString()} plays`, String(v)));
  De.append(wa("Max (1 STX)", "max"));
  const qt = pt("input");
  qt.type = "number", qt.min = "1", qt.max = String(cl), qt.value = "10", qt.setAttribute("aria-label", "Copies");
  const Kt = pt("input");
  Kt.maxLength = 40, Kt.placeholder = "Label, e.g. Opera launch", Kt.setAttribute("aria-label", "Batch label");
  const Te = pt("p", "", "ppp-mute"), Ge = () => {
    Te.textContent = Ue();
  };
  for (const v of [Oe, De, qt])
    v.oninput = Ge, v.onchange = Ge;
  Ge();
  function Ir(v) {
    var ct, wt, Jt, mt, ee, he;
    const F = (ct = v.gate) == null ? void 0 : ct.gifts;
    if (!(F != null && F.enabled) || ["off", "elsewhere", "unsupported"].includes(v.step)) return null;
    const j = t.main(), G = [pt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!j)
      G.push(pt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      te.disabled = !!_, G.push(ve, En, te), t.now() - b > 3e4 && (b = t.now(), N(j));
      const pe = S(j);
      if (pe.length) {
        const le = pt("ul", "", "ppp-gift-list");
        for (const Mt of pe.slice(0, 10)) {
          const h = (wt = Mt.view) == null ? void 0 : wt.status, m = Mt.error ? Mt.error : !h || h === "pending-deposit" ? Mt.txid ? "payment confirming…" : "waiting for your payment" : h === "live" ? "ready to share" : h === "claiming" || h === "claimed" ? "claimed ✓" : h === "refunding" ? "expired · refund on its way" : h === "refunded" ? "expired · refunded to you" : h, f = pt("li");
          if (f.append(pt("span", `${hn(BigInt(Mt.amount))} STX`, "t"), pt("span", m, ((Jt = Mt.view) == null ? void 0 : Jt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((mt = Mt.view) == null ? void 0 : mt.status) === "live") {
            const H = de(((ee = v.gate) == null ? void 0 : ee.radioUrl) ?? null, Mt.code);
            f.append(Cs("gift-copy:" + Mt.id, "Copy link", () => H, "tiny", t.changed), Ky("gift-share:" + Mt.id, "Share", () => E(H), "tiny", t.changed));
          }
          le.append(f);
        }
        G.push(le);
      }
      if (F.admin) {
        const le = pt("div", "", "ppp-gift-admin"), Mt = (Y, nt) => {
          const ht = pt("label", Y);
          return ht.append(nt), ht;
        }, h = ut(j);
        le.append(
          pt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          Ce,
          He,
          Ft,
          en,
          br("Sign and make player", () => void it(j, { title: Ce.value, subtitle: He.value, tracks: Ft.value, cover: en.value }))
        );
        const m = br("Sign, pay and make links", () => {
          Gt(j, ce(), Kt.value.trim(), Oe.value || void 0);
        });
        m.disabled = !!_;
        const f = Oe.value;
        Oe.replaceChildren(wa("No album (starter copies)", ""), ...h.map((Y) => wa(`${Y.title} · ${Y.tracks} songs`, Y.id))), h.some((Y) => Y.id === f) && (Oe.value = f), Ge(), le.append(
          pt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          Mt("Album ", Oe),
          Mt("Plays each ", De),
          Mt("Copies ", qt),
          Kt,
          Te,
          m
        ), t.now() - Ot > 3e4 && (Ot = t.now(), Ie(j));
        const H = O(j);
        if (H.length) {
          const Y = pt("ul", "", "ppp-gift-list");
          for (const nt of H.slice(0, 10)) {
            const ht = nt.view, Nt = ht == null ? void 0 : ht.copies, $e = nt.error ? nt.error : !ht || ht.status === "pending-deposit" ? nt.txid ? "payment confirming…" : "waiting for your payment" : `${Nt.claimed} of ${ht.count} claimed${Nt.refunding + Nt.refunded ? ` · ${Nt.refunded} refunded${Nt.refunding ? `, ${Nt.refunding} on their way` : ""}` : ""}`, jt = pt("li");
            if (jt.append(pt("span", `${nt.label || "Batch"} · ${nt.count} × ${hn(BigInt(nt.amount))} STX`, "t"), pt("span", $e, "ppp-mute")), !nt.txid && nt.depositTo && (!ht || ht.status === "pending-deposit") && jt.append(br("Pay now", () => void Yt(j, nt.id), "tiny")), nt.codes.length && (ht == null ? void 0 : ht.status) === "live") {
              const Lt = Zt(((he = v.gate) == null ? void 0 : he.radioUrl) ?? null, nt);
              jt.append(
                Cs("batch-copy:" + nt.id, "Copy all links", () => Lt.join(`
`), "tiny", t.changed),
                Cs("batch-csv:" + nt.id, "Copy as CSV", () => ["copy,link", ...Lt.map((ge, ln) => `${ln + 1},${ge}`)].join(`
`), "tiny", t.changed)
              );
            } else nt.codes.length || jt.append(pt("span", "links were made on another device", "ppp-mute"));
            Y.append(jt);
          }
          le.append(Y);
        }
        G.push(le);
      }
    }
    return _ && G.push(pt("p", _, "ppp-cyan")), L && G.push(pt("p", L, /✓/.test(L) ? "ppp-ok" : "ppp-warn")), A.replaceChildren(...G), A;
  }
  return { banner: P, funder: B, renderFold: Ir, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: $ };
}
const s$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function i$(t) {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, i = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    i && e.push({
      slot: n.slot,
      address: n.address,
      state: n.state === "arrived" ? "arrived" : "sending",
      amount: String(n.amount ?? "0"),
      label: typeof n.label == "string" ? n.label : "",
      from: typeof n.from == "string" ? n.from : null,
      source: String(n.source ?? ""),
      player: i
    });
  }
  return e;
}
const o$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((i) => !i.hidden).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function a$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = o$(s);
    return n.every((a) => o.includes(a));
  })()), i = {
    recent: (s, o) => (e.recents[o.slot] ?? 0) - (e.recents[s.slot] ?? 0) || o.slot - s.slot,
    newest: (s, o) => o.slot - s.slot,
    oldest: (s, o) => s.slot - o.slot,
    title: (s, o) => {
      var a, c;
      return (((a = s.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = o.player) == null ? void 0 : c.title) ?? "") || s.slot - o.slot;
    }
  };
  return r.sort((s, o) => Number(e.pins.has(o.slot)) - Number(e.pins.has(s.slot)) || i[e.sort](s, o));
}
function c$(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const mi = 12, l$ = 5e3, sn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, xi = (t, e, n = "") => {
  const r = sn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function u$(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = mi;
  const l = sn("div", "", "ppp-shelf-box"), g = (b) => "xtrata.radio.shelf.pins.v1:" + b, p = (b) => "xtrata.radio.shelf.recent.v1:" + b, k = (b, N) => {
    try {
      return JSON.parse(t.store.get(b) || "null") ?? N;
    } catch {
      return N;
    }
  }, x = (b) => new Set(k(g(b), []).filter((N) => Number.isSafeInteger(N))), M = (b) => {
    const N = k(p(b), {}), Z = {};
    for (const [V, ut] of Object.entries(N)) Number.isSafeInteger(Number(V)) && typeof ut == "number" && (Z[Number(V)] = ut);
    return Z;
  };
  async function q(b) {
    if (!i) {
      i = !0, s = !1;
      try {
        const N = [];
        let Z = 0, V = 0;
        for (let ut = 0; ut < l$ / 100 + 1; ut++) {
          const it = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(b)}&after=${Z}&limit=100`);
          if (N.push(...i$(it == null ? void 0 : it.shelf)), V = Number(it == null ? void 0 : it.total) || N.length, !(it != null && it.next) || !Number.isSafeInteger(it.next)) break;
          Z = it.next;
        }
        b === e && (n = N, r = V, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const K = () => {
    o = -1 / 0;
  }, $ = sn("input");
  $.type = "search", $.placeholder = "Search title, artist or #", $.setAttribute("aria-label", "Search your albums"), $.oninput = () => {
    a = $.value, d = mi, t.changed();
  };
  const P = sn("select");
  P.setAttribute("aria-label", "Sort albums");
  for (const b of s$) {
    const N = document.createElement("option");
    N.value = b.value, N.textContent = b.label, P.append(N);
  }
  P.onchange = () => {
    c = P.value, d = mi, t.changed();
  };
  const B = xi("", () => {
    u = !u, d = mi, t.changed();
  }, "tiny"), A = sn("div", "", "ppp-shelf-tools");
  A.append($, P, B);
  const U = sn("div"), _ = sn("div");
  function L(b) {
    const N = b.step === "off" || b.step === "elsewhere" ? void 0 : b.root;
    if (N !== e && (e = N, n = [], r = 0, o = -1 / 0, d = mi), !N || b.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && q(N), !n.length)
      return s ? (_.replaceChildren(sn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), xi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(_), l) : null;
    const Z = x(N), V = M(N), ut = a$(n, { query: a, sort: c, pinnedOnly: u, pins: Z, recents: V });
    $.value !== a && ($.value = a), P.value = c, B.textContent = u ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(u));
    const it = [];
    if (b.slot > 0 && it.push(xi("← My player", () => t.open(0), "quiet")), !ut.length) it.push(sn("p", "No album matches that.", "ppp-mute"));
    else {
      const de = sn("ul", "", "ppp-shelf-list");
      for (const E of ut.slice(0, d)) {
        const O = sn("li", "", E.slot === b.slot ? "now" : ""), gt = Z.has(E.slot), st = xi(gt ? "★" : "☆", () => {
          const Yt = new Set(Z);
          gt ? Yt.delete(E.slot) : Yt.add(E.slot), t.store.set(g(N), JSON.stringify([...Yt])), t.changed();
        }, "tiny");
        st.setAttribute("aria-label", gt ? `Unpin ${E.player.title}` : `Pin ${E.player.title}`);
        const It = [E.player.subtitle, `${Co(E.player).length} ${Co(E.player).length === 1 ? "song" : "songs"}`, E.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Ot = E.slot === b.slot, Ie = xi(Ot ? "Playing" : "Play", () => {
          t.store.set(p(N), JSON.stringify(c$({ ...V, [E.slot]: t.now() }))), t.open(E.slot);
        }, Ot ? "tiny" : "tiny primary");
        Ie.disabled = Ot, O.append(st, sn("span", E.player.title, "t"), sn("span", " " + It, "ppp-mute"), Ie), de.append(O);
      }
      it.push(de), ut.length > d && it.push(xi(`Show more (${ut.length - d} left)`, () => {
        d += mi, t.changed();
      }, "quiet"));
    }
    return s && it.push(sn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), U.replaceChildren(...it), l.firstChild !== A && l.replaceChildren(A, U), l;
  }
  return { render: L, invalidate: K, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const b = M(e), N = [...n].filter((Z) => Z.player).sort((Z, V) => (b[V.slot] ?? 0) - (b[Z.slot] ?? 0) || V.slot - Z.slot)[0];
    return N ? { slot: N.slot, title: N.player.title } : null;
  } };
}
const f$ = 20, Ke = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, ke = {
  grid: Ke('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Ke('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Ke('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Ke('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Ke('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Ke('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Ke('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Ke('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Ke('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Ke('<path d="M6 9l6 6 6-6"/>', 18),
  right: Ke('<path d="M9 6l6 6-6 6"/>', 16),
  close: Ke('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Ke('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Ke('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Ke('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  info: Ke('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [i, s] of Object.entries(e))
    s == null || s === !1 || (i === "class" ? r.className = String(s) : i === "html" ? r.innerHTML = String(s) : i.startsWith("on") && typeof s == "function" ? r[i.toLowerCase()] = s : i === "disabled" ? r.disabled = !!s : r.setAttribute(i, s === !0 ? "" : String(s)));
  for (const i of n) i != null && i !== !1 && r.append(i);
  return r;
}
const We = (t, ...e) => Q("button", { type: "button", ...t }, ...e), ba = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, ao = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, d$ = { music: "My music", device: "This device", gifts: "Send music to a friend" }, h$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function p$(t, e) {
  let n = null, r = "", i = !1;
  const s = document.documentElement, o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
  function c(A) {
    var _, L, S;
    if (!A || !Number.isSafeInteger(A)) return "";
    const U = (S = (L = (_ = e.radio()) == null ? void 0 : _.getState) == null ? void 0 : L.call(_)) == null ? void 0 : S.albumCover;
    return U != null && U.url && Number(U.tokenId) === A ? U.url : o.has(A) ? o.get(A) : (a.has(A) || (a.add(A), fetch("/inscription/" + A, { signal: AbortSignal.timeout(2e4) }).then(async (C) => {
      var N, Z, V, ut;
      const b = (C.headers.get("content-type") || "").toLowerCase();
      if (!C.ok)
        throw await ((N = C.body) == null ? void 0 : N.cancel()), new Error("no cover");
      return b.startsWith("image/") ? (await ((Z = C.body) == null ? void 0 : Z.cancel()), "/inscription/" + A) : b.includes("text/html") ? (((V = (await C.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : V[1]) ?? "").replace(/&amp;/g, "&") : (await ((ut = C.body) == null ? void 0 : ut.cancel()), "");
    }).then((C) => {
      o.set(A, C), B();
    }).catch(() => {
      a.delete(A);
    })), "");
  }
  function u(A) {
    var _;
    r = A, A ? s.dataset.sheet = A : delete s.dataset.sheet;
    const U = document.querySelector(".side");
    if (A && A !== "more") {
      for (const C of h$[A]) {
        const b = U == null ? void 0 : U.querySelector(C);
        b && (b.open = !0);
      }
      const L = document.getElementById("sheetTitle");
      L && (L.textContent = d$[A]);
      const S = document.getElementById("sheetExtra");
      S && S.replaceChildren(...A === "music" ? [l()] : []), (_ = U == null ? void 0 : U.scrollTo) == null || _.call(U, { top: 0 });
    }
    B();
  }
  const d = document.getElementById("sheetClose");
  d && (d.onclick = () => u("")), document.addEventListener("keydown", (A) => {
    A.key === "Escape" && r && s.dataset.view === "album" && u("");
  });
  const l = () => We(
    { class: "al-row", onClick: () => {
      u(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: ke.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: ke.right })
  );
  let g = null, p = !1;
  const k = () => {
    var U;
    const A = e.radio();
    p || !(A != null && A.subscribe) || (p = !0, A.subscribe((_) => {
      g = _, (n == null ? void 0 : n.mode) === "open" && B();
    }), g = ((U = A.getState) == null ? void 0 : U.call(A)) ?? null);
  };
  setInterval(() => {
    var L, S;
    if ((n == null ? void 0 : n.mode) !== "open" || !(g != null && g.playing)) return;
    const A = (S = (L = e.radio()) == null ? void 0 : L.getPosition) == null ? void 0 : S.call(L), U = t.querySelector(".al-bar > i"), _ = t.querySelectorAll(".al-times span");
    !A || !U || (U.style.width = A.duration ? `${Math.min(100, A.current / A.duration * 100)}%` : "0%", _.length === 2 && (_[0].textContent = ba(A.current || 0), _[1].textContent = A.duration ? ba(A.duration) : "–:––"));
  }, 500);
  function x(A, U) {
    const _ = c(A.cover);
    return Q(
      "div",
      { class: "al-cover" + (U ? "" : " al-cover--small") },
      _ ? Q("img", { src: _, alt: `${A.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, A.title), A.subtitle ? Q("span", {}, A.subtitle) : null)
    );
  }
  function M(A) {
    return A.plays === null || A.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, A.playsComing ? "Plays on their way…" : "…") : A.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, A.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (A.plays <= f$ ? " al-chip--low" : "") }, `${ao(A.plays, "play", "plays")} left`);
  }
  function q(A) {
    const U = A.player, _ = U.tracks.filter((S) => !S.hidden), L = [];
    return A.mode === "arrive" && A.from && L.push(Q("p", { class: "al-from" }, Q("span", { html: ke.gift }), Q("span", {}, Q("b", {}, A.from), " sent you an album"))), L.push(x(U, !0)), L.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, U.title),
      U.subtitle ? Q("p", { class: "al-artist" }, U.subtitle) : null,
      _.length ? Q("p", { class: "al-songline" }, _.map((S) => S.title || `#${S.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [ao(_.length, "song", "songs"), A.offered ? ao(A.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), A.status.length && L.push(Q("div", { class: "al-status", role: "status" }, ...A.status)), L.push(Q("div", { class: "al-grow" })), A.asking ? L.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : A.primary && L.push(We({ class: "al-primary", onClick: A.primary.run, disabled: A.busy }, Q("span", { html: ke.playSmall }), A.primary.label)), A.hint && !A.asking && L.push(Q("p", { class: "al-hint" }, A.hint)), A.secondary && !A.asking && L.push(We({ class: "al-link", onClick: A.secondary.run, disabled: A.busy }, A.secondary.label)), L;
  }
  function K(A) {
    var de;
    const U = A.player, _ = U.tracks.filter((E) => !E.hidden), L = e.radio(), S = g == null ? void 0 : g.nowPlaying, C = S && U.tracks.some((E) => String(E.id) === String(S.tokenId)) ? String(S.tokenId) : null, b = C ? U.tracks.find((E) => String(E.id) === C) : null, N = A.plays === 0 && !A.playsComing, Z = !!A.playsComing && !A.plays, V = !!(g != null && g.playing) && !!C, ut = g == null ? void 0 : g.heart, it = [x(U, !N)];
    if (it.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, b ? b.title || (S == null ? void 0 : S.title) || `#${b.id}` : U.title),
        Q("div", { class: "al-artist" }, b ? b.artist || (S == null ? void 0 : S.artist) || U.subtitle : U.subtitle || "Press play")
      ),
      C ? We({ class: "al-icon" + (ut != null && ut.liked ? " is-on" : ""), "aria-label": ut != null && ut.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(ut != null && ut.liked)), disabled: !!(ut != null && ut.pending) || !!(ut != null && ut.locked) || Z, onClick: () => {
        var E;
        return (E = L == null ? void 0 : L.toggleLike) == null ? void 0 : E.call(L);
      }, html: ut != null && ut.liked ? ke.heartOn : ke.heart }) : null
    )), N)
      it.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        $(A, !0)
      ));
    else {
      const E = C ? (de = L == null ? void 0 : L.getPosition) == null ? void 0 : de.call(L) : null, O = E != null && E.duration ? Math.min(100, E.current / E.duration * 100) : 0;
      it.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${O}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, ba((E == null ? void 0 : E.current) || 0)), Q("span", {}, E != null && E.duration ? ba(E.duration) : "–:––"))
      ));
    }
    return it.push(Q(
      "div",
      { class: "al-ctl" + (N || Z ? " is-off" : "") },
      We({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: N || Z, onClick: () => {
        var E;
        return (E = L == null ? void 0 : L.prev) == null ? void 0 : E.call(L);
      }, html: ke.prev }),
      We({ class: "al-play", "aria-label": V ? "Pause" : "Play", disabled: N || Z, onClick: () => {
        var E;
        return (E = L == null ? void 0 : L.playPause) == null ? void 0 : E.call(L);
      }, html: V ? ke.pause : ke.play }),
      We({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: N || Z, onClick: () => {
        var E;
        return (E = L == null ? void 0 : L.next) == null ? void 0 : E.call(L);
      }, html: ke.next })
    )), A.status.length && it.push(Q("div", { class: "al-status", role: "status" }, ...A.status)), it.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, U.title), ` · ${ao(_.length, "song", "songs")}`), M(A))), it.push(Q("ol", { class: "al-tracks" }, ..._.map((E, O) => {
      const gt = String(E.id) === C;
      return Q("li", {}, We(
        { class: "al-track" + (gt ? " is-on" : ""), "aria-label": `Play ${E.title || "#" + E.id}`, "aria-current": gt ? "true" : void 0, disabled: N || Z, onClick: () => {
          var st;
          return (st = L == null ? void 0 : L.playToken) == null ? void 0 : st.call(L, E.id);
        } },
        Q("span", { class: "al-n" }, String(O + 1)),
        Q("span", { class: "al-tt" }, E.title || `#${E.id}`),
        gt ? Q("span", { class: "al-eq", html: ke.eq }) : null
      ));
    }))), it.push(Q("div", { class: "al-grow" })), it.push(We(
      { class: "al-more", "aria-expanded": String(r === "more"), onClick: () => u(r === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: ke.down })
    )), it;
  }
  function $(A, U) {
    const _ = Q("div", { class: "al-topups" + (U ? " al-topups--primary" : "") }), L = U ? [A.topUps[1] ?? A.topUps[0]] : [...A.topUps];
    for (const S of L) {
      const C = A.myPlays !== void 0 && A.myPlays >= S && !A.playsComing && !A.busy;
      _.append(We({ class: "al-topup", disabled: !C, onClick: () => e.topUp(S) }, U ? `Add ${S.toLocaleString()} plays` : `+${S.toLocaleString()}`));
    }
    return U && _.append(We({ class: "al-link", onClick: () => u("more") }, "Other amounts")), _;
  }
  function P(A) {
    const U = A.myPlays !== void 0 && A.myPlays >= (A.topUps[0] ?? 0), _ = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${A.player.title}`), Q("span", { class: "al-mono" }, A.plays === null || A.plays === void 0 ? "" : `${A.plays.toLocaleString()} left`)),
      $(A, !1),
      Q("p", { class: "al-mute al-small" }, A.playsComing ? "Plays are on their way. Add more once they arrive." : A.myPlays === void 0 ? "Checking My player…" : U ? `Moved from My player · ${ao(A.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !U && !A.playsComing && A.myPlays !== void 0 ? We({ class: "al-link", onClick: () => {
        u(""), e.openPlayer();
      } }, "Open My player") : null
    ), L = (C, b, N, Z) => We(
      { class: "al-row", onClick: Z },
      Q("span", { class: "al-row-i", html: C }),
      Q("span", { class: "al-row-t" }, Q("b", {}, b), Q("small", {}, N)),
      Q("span", { class: "al-row-go", html: ke.right })
    ), S = Q(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      L(ke.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, B();
      }),
      i ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), We({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: ke.close })),
      A.mode === "open" ? _ : null,
      Q(
        "div",
        { class: "al-rows" },
        L(ke.grid, "My music", "Your albums and the radio", () => u("music")),
        L(ke.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), e.openPlayer();
        }),
        L(ke.gift, "Send music to a friend", "They open it with a link", () => u("gifts")),
        L(ke.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        S
      )
    );
  }
  function B() {
    const A = n;
    if (!A) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    k(), t.hidden = !1;
    const U = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      A.mode === "open" ? We({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: ke.grid }) : null
    ), _ = Q("div", { class: "al-body al-body--" + A.mode }, ...A.mode === "open" ? K(A) : q(A));
    t.replaceChildren(U, _, ...r === "more" ? [Q("div", { class: "al-scrim", onClick: () => u("") }), P(A)] : []);
  }
  return {
    render(A) {
      const U = !!n;
      n = A, !A && (U || r) && (r = "", delete s.dataset.sheet), A ? s.dataset.view = "album" : delete s.dataset.view, A != null && A.asking ? s.dataset.asking = "1" : delete s.dataset.asking, B();
    },
    sheet: () => r,
    setSheet: u
  };
}
const g$ = [
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
function y$(t) {
  for (const [e, n] of g$) if (n.test(t)) return e;
  return null;
}
const Vy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), qy = (t) => /Android/.test(t);
function w$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Vy(e) ? "x-safari-" + n.href : qy(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const b$ = (t) => Vy(t) ? "Safari" : qy(t) ? "Chrome" : "your browser", l0 = document.getElementById("ppp");
l0 && m$(l0);
function m$(t) {
  var Mt;
  const e = kw(), n = (h) => t.querySelector(h), r = n(".ppp-frame");
  let i = null;
  const s = async (h, m) => {
    const f = await fetch(h, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), H = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((H == null ? void 0 : H.error) || `Request failed (${f.status}).`);
    return H;
  }, o = t6({
    now: Date.now,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    config: (h) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(h || "")),
    links: async (h) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(h))).links ?? [],
    mainOf: async (h) => {
      var f;
      const m = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(h))).links;
      return ((f = m == null ? void 0 : m.find((H) => H.listening === h)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (h) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(h) });
    },
    bridge: async (h) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${h}; publickey-credentials-create ${h}`), i.referrerPolicy = "no-referrer";
      const m = new Promise((nt, ht) => {
        i.addEventListener("load", () => nt(), { once: !0 }), setTimeout(() => ht(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = h + "/", r.replaceChildren(i), await m;
      const f = new ww({ walletOrigin: h, frame: i, timeoutMs: 30 * 6e4 }), H = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), Y = (nt, ht) => H.has(nt) ? f.request(nt, ht) : Promise.race([
        f.request(nt, ht),
        new Promise((Nt, $e) => setTimeout(() => $e(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await Y("listening.status"), { request: Y };
    },
    chain: {
      verify: N5,
      balance: _5,
      account: P5,
      owner: U5,
      broadcast: H5,
      transaction: O5,
      confirmedNonce: async (h) => {
        const m = await hs(`/v2/accounts/${h}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (h, m) => Rh({ ...m, network: "mainnet", stxAddress: h }),
    deposit: (h, m, f) => new Promise((H, Y) => Oh({
      recipient: m,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: h,
      network: new ul(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (nt) => H(nt.txId || ""),
      onCancel: () => Y(new Error("Deposit cancelled. Nothing was sent.")),
      onError: Y
    })),
    validate: D5,
    tabLock: (h) => new Promise((m) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        m(!0);
        return;
      }
      f.request("xtrata-ppp:" + h, { ifAvailable: !0 }, async (H) => {
        m(!!H), H && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, m) => {
        try {
          localStorage.setItem(h, m);
        } catch {
        }
      }
    },
    changed: () => mt(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (h) => {
      var m, f;
      return a.funder(h, () => K5(h, hs), !!((f = (m = o.snapshot().gate) == null ? void 0 : m.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (h) => {
      const m = await s("/radio/gift/for?wallet=" + encodeURIComponent(h)), f = m == null ? void 0 : m.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (h, m) => W5(h, (f) => hs(f), m),
    likesChanged: () => {
      var h, m;
      (m = (h = window.XtrataRadio) == null ? void 0 : h.refreshLikes) == null || m.call(h);
    },
    likeState: async (h, m) => {
      const f = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: h, ids: String(m) })), H = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((Y) => (Y == null ? void 0 : Y.id) === m) : null;
      if (!H || typeof H.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: H.liked, by: Array.isArray(H.by) ? H.by.filter((Y) => typeof Y == "string") : H.liked ? [h] : [] };
    },
    likeSent: (h, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: h, liked: m } })),
    nameOf: (h) => E(h) ?? void 0,
    likeConfirmed: (h, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: h, liked: m } })),
    likeFailed: (h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: h } }))
  }), a = r$({
    json: s,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    pay: (h, m, f, H) => new Promise((Y, nt) => Oh({
      recipient: m,
      amount: f.toString(),
      memo: H,
      stxAddress: h,
      network: new ul(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (ht) => Y(ht.txId || ""),
      onCancel: () => nt(new Error("Gift cancelled. Nothing was sent.")),
      onError: nt
    })),
    sign: (h, m) => Rh({ ...m, network: "mainnet", stxAddress: h }),
    giftSent: (h, m) => o.giftSent(h, m),
    claiming: (h) => o.giftClaiming(h),
    album: { bind: (h) => o.bindAlbum(h), arrived: async (h, m, f, H) => {
      c.invalidate(), await o.albumArriving(h, m, f, H);
    } },
    who: (h) => st(h),
    changed: () => mt(o.snapshot()),
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, m) => {
        try {
          m === null ? localStorage.removeItem(h) : localStorage.setItem(h, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = u$({
    json: s,
    open: (h) => {
      o.openAlbum(h);
    },
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, m) => {
        try {
          m === null ? localStorage.removeItem(h) : localStorage.setItem(h, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => mt(o.snapshot())
  }), u = document.getElementById("album"), d = u ? p$(u, {
    radio: () => window.XtrataRadio ?? null,
    topUp: (h) => void o.topUpAlbum(h),
    openPlayer: () => void o.openAlbum(0)
  }) : null, l = "xtrata.radio.album.last.v1", g = () => {
    try {
      const h = JSON.parse(localStorage.getItem(l) || "null");
      return h && typeof h.root == "string" && Number.isSafeInteger(h.slot) && h.slot > 0 && h.player && Array.isArray(h.player.tracks) ? h : null;
    } catch {
      return null;
    }
  };
  let p = "";
  const k = (h) => {
    const m = JSON.stringify(h);
    if (m !== p) {
      p = m;
      try {
        localStorage.setItem(l, m);
      } catch {
      }
    }
  };
  let x = null;
  window.XtrataRadioLikeHandler = (h) => {
    if (!h || !Number.isSafeInteger(h.song) || h.song < 0) return !1;
    Gt();
    const m = ce(h.song, { title: h.title, artist: h.artist });
    return o.heart({ song: h.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(h.likedBy) ? h.likedBy : void 0 });
  };
  let M;
  window.XtrataRadioListeningIdentity = () => {
    const h = o.snapshot();
    return h.solo && h.step !== "off" && h.step !== "elsewhere" ? h.listening : void 0;
  };
  const q = (h) => {
    var f, H;
    const m = window.XtrataRadioListeningIdentity();
    m !== M && (M = m, (H = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || H.call(f));
  };
  let K = "", $ = null, P = !1, B = !1;
  const A = (h) => {
    var Nt, $e, jt, Lt, ge, ln, Mn, Be;
    const m = window.XtrataRadio;
    if (!(m != null && m.setGiftPlayer) || !(m != null && m.setGiftStop)) return;
    const f = h.step === "off" || h.step === "elsewhere" ? null : ((Nt = h.gift) == null ? void 0 : Nt.player) ?? null, H = f ? f.id + ":" + f.cover + ":" + f.tracks.map((ne) => ne.id).join(",") : "";
    H !== K && (m.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: Co(f).map((ne) => ne.id), hidden: (($e = t$(f)) == null ? void 0 : $e.id) ?? null, cover: f.cover } : null), K = H);
    const Y = ((jt = h.giftStop) == null ? void 0 : jt.text) ?? null;
    Y !== $ && (m.setGiftStop(Y), $ = Y);
    const nt = ((Lt = h.giftStop) == null ? void 0 : Lt.reason) === "arriving";
    nt !== B && ((ge = m.setGiftWait) == null || ge.call(m, nt), B = nt);
    const ht = !!f && !!((ln = h.albumLock) != null && ln.locked);
    ht !== P && ((Mn = m.setGiftLock) == null || Mn.call(m, ht), P = ht), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(h.step) && ((Be = m.forgetWallets) == null || Be.call(m));
  }, U = (h) => h ? h.slice(0, 6) + "…" + h.slice(-4) : "", _ = (h) => {
    const m = o.snapshot().playCost || 350n;
    return h > Pe ? Number((h - Pe) / m) : 0;
  }, L = (h) => (Number(h) / 1e6).toFixed(h < 1000n ? 6 : 4), S = (h) => {
    const m = Math.round((Date.now() - h) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, C = (h) => `https://explorer.hiro.so/txid/${h}?chain=mainnet`, b = (h, m = "", f = "") => {
    const H = document.createElement(h);
    return m && (H.textContent = m), f && (H.className = f), H;
  }, N = (h, m, f = "") => {
    const H = b("button", h, f);
    return H.type = "button", H.onclick = m, H;
  }, Z = (h, m) => {
    const f = b("a", h);
    return f.href = m, f.target = "_blank", f.rel = "noopener", f;
  };
  let V = null, ut = location.hash === "#give";
  ut && history.replaceState(null, "", location.pathname + location.search);
  let it = !1;
  const de = H6((h) => U6({ address: h, network: "mainnet" }), () => mt(o.snapshot())), E = (h) => de.get(h), O = y$(navigator.userAgent), gt = (h, m) => {
    const f = navigator.userAgent, H = b$(f), Y = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, nt = [b("p", `You are in ${h}'s built-in browser, where passkeys often do not work. Open this page in ${H} to make your listening wallet${m ? " and claim your gift" : ""}.`, "ppp-warn")], ht = b("div", "", "ppp-open-row"), Nt = w$(Y, f);
    if (Nt) {
      const $e = b("a", `Open in ${H}`, "primary ppp-open-in");
      $e.href = Nt, $e.dataset.homeAction = "radio:open-in-browser", ht.append($e);
    }
    return ht.append(Cs("copy-page-link", "Copy link", () => Y, Nt ? "" : "primary", () => mt(o.snapshot()))), nt.push(ht, b("p", `If that does not open ${H}, use ${h}'s menu (••• or ⋮) and choose "Open in ${H === "your browser" ? "browser" : H}", or paste the copied link there.`, "ppp-mute")), nt;
  }, st = (h) => E(h) ?? U(h), It = (h) => h.slice(0, 2).map(st).join(" and ") + (h.length > 2 ? ` and ${h.length - 2} more` : ""), Ot = /* @__PURE__ */ new Map();
  let Ie = !1;
  const Yt = (h) => !h || /^(?:Inscription )?#\d+$/.test(h.trim()), Gt = () => {
    Ie || (Ie = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((h) => h.ok ? h.json() : null).then((h) => {
      for (const m of Array.isArray(h == null ? void 0 : h.tracks) ? h.tracks : []) {
        const f = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(f) && Ot.set(f, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      mt(o.snapshot());
    }).catch(() => {
      Ie = !1;
    }));
  }, ce = (h, m) => {
    const f = Ot.get(h), H = D6(h, [f == null ? void 0 : f.title, m == null ? void 0 : m.title].find((nt) => !Yt(nt)) || ""), Y = O6(h, (f == null ? void 0 : f.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: H, artist: Y };
  }, Ue = (h) => {
    const { title: m, artist: f } = ce(h.song, h);
    return m ? `“${m}”${f ? ` — ${f}` : ""}` : `Song #${h.song}${f ? ` — ${f}` : ""}`;
  }, Zt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, ve = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function En(h) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(h.step) ? ["", ""] : h.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : h.step === "over" ? ["TOO MUCH", "bad"] : h.step === "locked" ? ["LOCKED", "mute"] : h.step === "intro" || h.step === "link" ? ["", ""] : h.step === "fund" ? h.depositPending ? ["ON ITS WAY", "warn"] : h.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : h.payingOn && h.session && h.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function te(h, m, f = "", H) {
    const Y = b("dt", h), nt = b("dd", m, f);
    return H && nt.append(" ", H), [Y, nt];
  }
  const Le = document.getElementById("ppp-top"), tn = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Ce = () => {
    var m, f;
    const h = o.snapshot();
    if (h.step === "connect" || h.step === "wrong-wallet") {
      (m = document.getElementById("radio-wallet-connect")) == null || m.click();
      return;
    }
    if (h.step === "elsewhere" && ((f = h.gate) != null && f.radioUrl)) {
      location.href = h.gate.radioUrl;
      return;
    }
    h.step === "locked" && !h.armed && !h.busy && o.unlock(), h.step === "ready" && !h.payingOn && !h.busy && o.switchOn(), tn();
  };
  Le && (Le.onclick = Ce);
  function He(h) {
    if (!Le) return;
    const m = (H, Y, nt) => {
      Le.hidden = !1, Le.className = "ppp-top" + (Y ? " is-" + Y : ""), Le.replaceChildren(b("span", "", "dot"), document.createTextNode(H)), Le.title = nt;
    }, f = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0;
    switch (h.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Le.hidden = !0;
        return;
      case "elsewhere":
        return m("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Le.hidden = !0;
        return;
      case "intro":
        return m("Start listening", "", "Make your player with a passkey: no app or account needed");
      case "wrong-wallet":
        return m(`Connect ${st(h.linked)}`, "warn", `This device's listening wallet belongs to ${st(h.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m("Unlock", "", "One tap with your passkey");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return h.depositPending ? m("Plays on their way", "quiet", "Plays start by themselves when they land") : m(h.entries.some((H) => H.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return m("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return m("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return h.payingOn && f > 0 ? m(`${f.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : m("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Ft = document.getElementById("pppNudge"), en = document.getElementById("onair");
  (Mt = Ft == null ? void 0 : Ft.querySelector("button")) == null || Mt.addEventListener("click", () => Ce());
  const Oe = {
    elsewhere: "Plays are not counted here",
    connect: "Plays are not counted",
    intro: "Plays are not counted",
    locked: "Locked · plays are not counted",
    "wrong-wallet": "Wrong wallet connected · plays are not counted",
    link: "Plays are not counted yet",
    fund: "No plays yet",
    over: "Paused · plays are not counted",
    ready: "Plays are off"
  }, De = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Start",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  };
  function qt(h) {
    if (h.step === "loading") return;
    const m = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0, f = h.step === "ready" && h.payingOn && m > 0, H = h.step === "fund" && h.depositPending, Y = f || H ? "" : Oe[h.step] ?? "", nt = f ? "on" : Y ? "off" : "";
    nt ? document.documentElement.dataset.ppp = nt : delete document.documentElement.dataset.ppp, en && (en.hidden = !nt, en.querySelector(".onair-sub").textContent = f ? `${m.toLocaleString()} plays left` : "Plays off"), Ft && (Ft.hidden = nt !== "off", nt === "off" && (Ft.querySelector(".nudge-t").textContent = Y, Ft.querySelector(".nudge-s").textContent = "Every play you count goes to the song’s owner, on-chain.", Ft.querySelector("button").textContent = De[h.step] ?? "Start"));
  }
  let Kt = "";
  function Te(h) {
    const m = b("div", "", "ppp-pick");
    h.funderMultiple && h.returnToKind === "funder" && m.append(b("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), h.returnToKind === "funder" && m.append(b("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = b("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = Kt, f.oninput = () => {
      Kt = f.value;
    };
    const H = N(h.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), Kt = "";
    }, "tiny");
    return m.append(f, " ", H), h.returnToKind === "chosen" && m.append(" ", N("Back to the funder", () => o.clearReturnAddress(), "tiny")), m;
  }
  const Ge = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Ir() {
    const h = b("p", Ge + " ", "ppp-mute");
    return h.append(Z("Xverse", "https://www.xverse.app/download"), " · ", Z("Leather", "https://leather.io/install-extension")), h;
  }
  let Lr = "";
  const v = (h) => {
    const m = document.documentElement, f = h.solo && !h.main ? h.listening ? U(h.listening) : "new" : "", H = i6() ? "1" : "";
    `${f}|${H}` !== Lr && (Lr = `${f}|${H}`, f ? m.dataset.pppSolo = f : delete m.dataset.pppSolo, H ? m.dataset.pppWalletInstalled = H : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const h of [1500, 4e3, 9e3]) setTimeout(() => mt(o.snapshot()), h);
  function F(h, m = "") {
    const f = b("div", "", "ppp-topup"), H = j(h);
    f.append(b("span", "Add plays from My player: ", "ppp-mute"));
    for (const Y of Ia) {
      const nt = N(`+${Y.toLocaleString()}`, () => void o.topUpAlbum(Y), m);
      nt.disabled = H === void 0 || H < Y || h.depositPending || !!h.busy, f.append(nt);
    }
    return H !== void 0 && H < Ia[0] && f.append(b("p", "My player needs plays first (switch to My player above).", "ppp-mute")), f;
  }
  const j = (h) => {
    var H;
    const m = (H = h.likeFunds) == null ? void 0 : H.balance;
    if (m === void 0 || !h.playCost) return;
    const f = m - Pe - 6000n;
    return f > 0n ? Number(f / h.playCost) : 0;
  };
  function G(h) {
    const m = h.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    const f = b("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      const Y = b("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return m.txid && Y.append(Z("View", C(m.txid))), f.append(Y), [f];
    }
    f.append(b("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(b("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(b("p", m.address, "ppp-addr-full"));
    const H = b("div", "", "ppp-open-row");
    if (H.append(Cs("copy-likes-address", "Copy address", () => m.address, "primary", () => mt(o.snapshot()))), m.main && !h.solo) {
      const Y = Ls - (m.balance ?? 0n);
      Y > 0n && H.append(N(`Pay ${Yn(Y)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(H), f.append(b("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  const ct = (h) => {
    const m = b("div", "", "ppp-wait");
    m.dataset.since = String(h.since), m.dataset.grace = String(h.graceMs), m.setAttribute("role", "progressbar"), m.setAttribute("aria-label", "Your plays are arriving");
    const f = b("p", "", "ppp-wait-t"), H = b("div", "", "ppp-wait-track");
    return H.append(b("div", "", "ppp-wait-fill")), m.append(f, H), wt(m), m;
  };
  function wt(h) {
    const m = Number(h.dataset.since), f = Number(h.dataset.grace) || 6e4, H = Math.max(0, Date.now() - m), Y = h.querySelector(".ppp-wait-fill"), nt = h.querySelector(".ppp-wait-t");
    if (H < f) {
      const ht = Math.ceil((f - H) / 1e3);
      Y.style.width = Math.max(4, Math.min(95, H / f * 100)).toFixed(0) + "%", nt.textContent = `Your plays are arriving… usually about a minute · ${ht}s`, h.classList.remove("is-long"), h.setAttribute("aria-valuenow", String(Math.round(H / f * 100)));
    } else
      Y.style.width = "", nt.textContent = "Still arriving… this can take a few minutes. Nothing for you to do: it starts by itself.", h.classList.add("is-long"), h.removeAttribute("aria-valuenow");
  }
  let Jt = 0;
  setInterval(() => {
    const h = document.querySelectorAll(".ppp-wait");
    if (!h.length) {
      Jt = 0;
      return;
    }
    h.forEach(wt), ++Jt % 10 === 0 && mt(o.snapshot());
  }, 1e3);
  function mt(h) {
    var dr, Nr, ui, fi, bs, ye, di, Pr, hr, _r, pr, hi, Ur;
    if (x && ["ready", "fund", "over"].includes(h.step) && !h.busy) {
      const W = x;
      x = null, h.root === W.root && h.slot !== W.slot && o.openAlbum(W.slot);
    }
    const m = a.inProgress(h), f = m && h.step === "fund" ? { ...h, depositPending: !0 } : h;
    if (q(), A(h), v(f), !m && a.inProgress(h) || (He(f), qt(f), t.hidden = f.step === "off", t.hidden)) return;
    const [H, Y] = En(f), nt = n(".ppp-state");
    nt.textContent = H, nt.className = "ppp-state" + (Y ? " ppp-state--" + Y : ""), nt.hidden = !H;
    const ht = !!f.busy || f.armed, Nt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (ht || !["intro", "loading"].includes(f.step));
    r.hidden = !Nt, r.classList.toggle("ppp-frame--rest", !ht && !it);
    const $e = n(".ppp-frame-label");
    $e.hidden = !0;
    const jt = e6(f) ?? V;
    V = jt;
    const Lt = r6(f, jt);
    n(".ppp-badge").hidden = !Lt;
    const ge = n(".ppp-steps"), ln = n(".ppp-stage");
    ge.hidden = ln.hidden = !Lt, jt && Lt && (ge.replaceChildren(...pu(f.solo).map((W, rt) => {
      const se = b("li", "", rt < jt.at ? "done" : rt === jt.at ? jt.blocked ? "now blocked" : "now" : "");
      return se.append(b("span", rt < jt.at ? "✓" : String(rt + 1), "n"), W), rt === jt.at && se.setAttribute("aria-current", "step"), se;
    })), ln.textContent = jt.caption, ln.className = "ppp-stage " + (jt.at >= pu(f.solo).length ? "ppp-ok" : jt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Mn = n(".ppp-facts"), Be = [];
    f.main && ((dr = f.gate) != null && dr.here) && !f.solo && Be.push(...te("Your wallet", st(f.main), "ppp-addr-short"));
    const ne = () => {
      if (!f.listening) return;
      const W = Cs("copy-listening", "Copy", () => f.listening || "", "tiny", () => mt(o.snapshot()));
      Be.push(...te(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", U(f.listening), "ppp-addr-short", W));
    };
    if (f.linked || ne(), f.listening && f.step !== "intro")
      if (f.linked)
        Be.push(...te("Credited to", `${st(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), ne();
      else if (f.solo) {
        f.creditedTo && Be.push(...te("Credited to", `${st(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const W = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${st(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Be.push(...te("Returns go to", f.gift ? W : f.returnTo && !E(f.returnTo) ? W.replace(U(f.returnTo), f.returnTo) : W, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Be.push(...te("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Nr = f.gate) != null && Nr.here)) {
      const W = f.linkedListening.map((rt) => U(rt) + (rt === f.listening ? " (this one)" : "")).join(", ");
      Be.push(...te(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", W, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const W = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Be.push(...te("Balance", `${Yn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, W));
    }
    const An = f.entries.find((W) => W.kind === "play");
    An && Gt(), An && Be.push(...te("Last paid song", `${Ue(An)} → ${st(An.recipient)}`, Zt[An.status] || "")), Mn.replaceChildren(...Be), Mn.hidden = !Be.length;
    const ft = [], Ht = [], re = [], vn = [], Nn = wn(BigInt(((ui = f.gate) == null ? void 0 : ui.limits.playFee) ?? "300")), Ji = `Each song you listen to for 30 seconds sends ${Yn(Ja)} STX to whoever holds it, plus a ${Yn(Nn - Ja)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, ci = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (ft.push(b("p", "Pay artists as you listen.")), (fi = f.gate) != null && fi.radioUrl) {
          const rt = b("p");
          rt.append(Z("Open the pay-per-play radio →", f.gate.radioUrl)), ft.push(rt);
        }
        Ht.push(b("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const rt = [f.linked, ...f.others];
          ft.push(b("p", rt.length > 1 ? `This device has listening wallets for ${It(rt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${st(f.linked)}. Connect that wallet to keep paying artists.`)), Ht.push(b("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          ft.push(b("p", "Connect your wallet to pay artists as you listen.")), Ht.push(b("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        ft.push(b("p", `This device's listening wallet belongs to ${st(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Ht.push(b("p", `You are connected as ${st(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Ht.push(b("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), re.push(N("Switch wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        }, "primary"));
        break;
      case "not-invited":
        ft.push(b("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ft.push(b("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ft.push(b("p", "Every play counts for the song’s owner, on-chain.")), Ht.push(b("p", Ji)), Ht.push(b("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Ht.push(b("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (ft.push(b("p", `This device already has a listening wallet for ${It(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Ht.push(b("p", `Otherwise, set up a new listening wallet for ${st(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Ht.push(b("p", `This is the listening wallet for ${st(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Ht.push(b("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const W = a.liveGift();
        re.push(N(W ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${st(f.main)}` : "Start listening", () => void o.create(), "primary")), !W && !f.solo && f.main && f.others.length && re.push(N("Switch wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        })), !W && f.solo && re.push(N("I have a Stacks wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        })), re.push(N("I already have a listening wallet", () => void o.unlock(!0))), W && re.push(N("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (ft.push(b("p", "Locked.", "ppp-mute")), re.push(N("Unlock", () => void o.unlock(), "primary"))), vn.push(N("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ft.push(b("p", `Link to ${st(f.main)} · free`)), Ht.push(b("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Ht.push(b("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), re.push(N(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ft.push(b("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && ft.push(ct(f.arrival)) : (bs = f.gift) != null && bs.player ? ft.push(b("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? ft.push(b("p", "No plays left · add plays to keep counting", "ppp-bad")) : ft.push(b("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Nn)).toLocaleString()} plays`)), (ye = f.gift) != null && ye.player ? Ht.push(b("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && Ht.push(b("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && Ht.push(b("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m || (f.solo ? (Ht.push(b("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Ht.push(b("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && re.push(Cs("copy-address", "Copy my address", () => f.listening || "", "primary", () => mt(o.snapshot())))) : Ht.push(b("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), f.depositPending && f.depositTxid) {
          const rt = b("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          rt.append(Z("View", C(f.depositTxid))), ft.push(rt);
        } else f.allowance > 0n && !f.solo && re.push(N(`Deposit ${Yn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ft.push(b("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (ft.push(b("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ft.push(Te(f))), (!f.solo || f.returnTo) && re.push(N("Return excess", () => void o.returnFunds("excess"), "primary"), N("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const rt = Math.min(f.session.playsLeft, f.playsLeft);
          ft.push(b("p", `${rt.toLocaleString()} plays left`, "ppp-ok")), Ht.push(b("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), re.push(N("Switch off", () => void o.switchOff()));
        } else
          ft.push(b("p", "Plays are off. Music stays free.", "ppp-mute")), re.push(N("Switch plays on", () => void o.switchOn(), "primary"));
        f.queued && ft.push(b("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && ft.push(b("p", "Running low on plays", "ppp-warn")), f.depositPending ? ft.push(b("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && re.push(N(`Top up ${Yn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && Ht.push(b("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && Ht.push(Te(f)), Ht.push(Ir()), f.slot === 0 && f.step === "ready" && f.entries.some((W) => W.kind === "play" && W.status === "confirmed"))) {
      const W = b("p", "New to Stacks? ", "ppp-mute");
      W.append(Z("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ft.push(W);
    }
    if (f.walletOutdated && Ht.push(b("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (ft.push(b("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), re.push(N("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && vn.push(N(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${st(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((di = f.gift) != null && di.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && vn.push(F(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && vn.push(N("Lock", () => void o.lock(), "quiet")), Nt && !ht && vn.push(N(it ? "Hide listening wallet box" : "Show listening wallet box", () => {
      it = !it, mt(o.snapshot());
    }, "quiet")), [...re, ...vn].forEach((W) => W.disabled = ci), ci && (re.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((Pr = f.gift) != null && Pr.player)) {
      const W = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", rt = ft.at(0);
      f.step === "ready" && rt ? rt.append(b("span", ` · ${L(f.balance)} STX`, W)) : ft.push(b("p", `Balance ${L(f.balance)} STX`, W));
    }
    if ((hr = f.gift) != null && hr.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const W = b("p", "", "ppp-gift");
      W.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && W.append(" · ", f.gift.player.subtitle);
      const rt = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? b("span", " · plays on their way", "ppp-warn") : b("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      rt && W.append(rt);
      const se = (_r = ft.at(0)) == null ? void 0 : _r.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && se && /STX/.test(se.textContent ?? "") && se.remove(), ft.unshift(W), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          ft.splice(1, 0, b("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), F(f, "primary"));
        else {
          const Me = b("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          Me.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), Me.append(Z("Xverse", "https://www.xverse.app/download"), " and ", Z("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ft.splice(1, 0, Me);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const W = f.returnPlan, rt = b("div", "", "ppp-pick");
      rt.append(b("p", W.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const se = b("ul", "", "ppp-gift-list");
      W.steps.forEach((Me, w) => {
        const I = Me.kind === "gift" ? "the unused gift" : Me.kind === "deposit" ? "what was added to it" : "the rest", R = b("li");
        R.append(b("span", `${w + 1}. ${Yn(BigInt(Me.send))} STX · ${I}`, "t"), b("span", Me.to ? ` → ${st(Me.to)}` : " → choose an address below", Me.to ? "ppp-mute" : "ppp-warn")), se.append(R);
      }), rt.append(se), W.kept && rt.append(b("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), W.steps.some((Me) => !Me.to) && rt.append(Te(f)), rt.append(N(W.steps.length > 1 ? `Confirm part 1 of ${W.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), ft.push(rt);
    }
    const Cr = ee(f), $n = a.banner(h, { bare: !!Cr }), li = O && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? gt(O, a.pendingCode()) : [];
    Cr || (ft.unshift(...$n), ft.unshift(...G(f)), ft.unshift(...li)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && ft.unshift(b("p", `This is ${st(f.creditedTo)}'s listening wallet. Plays and likes count for ${st(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...ft);
    const un = document.querySelector(".ppp-switch");
    if (un) {
      const W = c.latest(), rt = f.slot > 0, se = ["fund", "ready", "over"].includes(f.step) && (rt || !!W);
      if (un.hidden = !se, se) {
        const Me = (I, R, J, lt) => {
          const z = N("", lt, "ppp-tab");
          return z.setAttribute("aria-pressed", String(J)), z.append(b("span", I, "tt"), b("span", R === void 0 ? "…" : `${_(R).toLocaleString()} plays`, "ts")), z.disabled = !!f.busy, z;
        }, w = rt ? ((hi = (pr = f.gift) == null ? void 0 : pr.player) == null ? void 0 : hi.title) ?? "Album" : W.title;
        un.replaceChildren(
          Me("🎧 My player", rt ? (Ur = f.likeFunds) == null ? void 0 : Ur.balance : f.balance, !rt, () => {
            rt && o.openAlbum(0);
          }),
          Me("💿 " + w, rt ? f.balance : void 0, rt, () => {
            !rt && W && o.openAlbum(W.slot);
          })
        );
      }
    }
    const Tr = c.render(f), Rn = document.querySelector(".ppp-shelf");
    if (Rn) {
      Rn.hidden = !Tr;
      const W = Rn.querySelector("summary");
      W && (W.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const rt = Rn.querySelector(".ppp-shelf-body");
      Tr && rt && !rt.contains(Tr) && rt.replaceChildren(Tr);
    }
    const Pn = a.renderFold(h);
    if (n(".ppp-gifts").hidden = !Pn, Pn && !n(".ppp-gift-body").contains(Pn) && n(".ppp-gift-body").replaceChildren(Pn), Pn && ut) {
      ut = !1;
      const W = n(".ppp-gifts");
      W.open = !0, requestAnimationFrame(() => W.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Ht), n(".ppp-actions").replaceChildren(...re), n(".ppp-actions2").replaceChildren(...vn);
    const lr = f.busy || f.message || "", Br = n(".ppp-msg"), ws = lr && ft.some((W) => (W.textContent ?? "").startsWith(lr.replace(/[.✓\s]+$/, ""))) ? "" : lr, ur = !ws && !f.error ? f.notice : "";
    Br.textContent = ws || ur, Br.classList.toggle("is-warn", !!ur), n(".ppp-err").textContent = f.error;
    const fr = f.entries.filter((W) => W.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...fr.slice(0, 5).map((W) => {
      const rt = b("li"), se = W.status === "confirmed" ? "ok" : W.status === "failed" ? "bad" : "warn";
      return rt.append(b("span", "", "d " + se), b("span", Ue(W), "t"), b("span", S(W.created), "ppp-mute")), W.txid && rt.append(Z("tx", C(W.txid))), rt;
    })), n(".ppp-wallets").hidden = !(Mn.childElementCount || vn.length), n(".ppp-more").hidden = !Ht.length;
    const Mr = n(".ppp-history");
    Mr.hidden = !f.entries.length, f.entries.length && Gt(), Mr.replaceChildren(b("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((W) => {
      const rt = b("div", "", "ppp-row"), se = W.kind === "play" ? [b("span", Ue(W), "ppp-song"), b("span", ` · ${Yn(BigInt(W.amount))} STX to ${st(W.recipient)}`, "ppp-mute")] : W.kind === "like" ? [b("span", `${W.liked ? "♥ Liked" : "Unliked"} ${Ue(W)}`, "ppp-song"), b("span", ` · for ${f.linked ? st(f.linked) : "this listening wallet"}`, "ppp-mute")] : [b("span", `Returned ${Yn(BigInt(W.amount))} STX`, "ppp-song"), b("span", ` to ${st(W.recipient)}`, "ppp-mute")];
      return rt.append(
        b("span", ve[W.status] || W.status, "ppp-status " + (Zt[W.status] || "")),
        ...se,
        b("span", ` · ${new Date(W.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), W.txid && rt.append(Z("tx ↗", C(W.txid))), rt;
    })), d == null || d.render(Cr ? he(f, Cr, [...li, ...$n]) : null);
  }
  function ee(h) {
    var H;
    if (["off", "elsewhere", "not-invited"].includes(h.step)) return null;
    if (h.slot > 0 && ((H = h.gift) != null && H.player) && ["fund", "ready", "over", "link", "loading"].includes(h.step))
      return h.root && k({ root: h.root, slot: h.slot, player: h.gift.player }), { mode: "open", player: h.gift.player };
    const m = a.incomingAlbum();
    if (m) return { mode: "arrive", player: m.player, from: m.from, offered: m.plays };
    const f = g();
    return f && (h.step === "locked" || x && h.step === "loading") ? { mode: "locked", player: f.player } : null;
  }
  function he(h, m, f) {
    var $e;
    const H = !!h.busy || h.armed, Y = [...f];
    h.depositPending && h.arrival && Y.push(ct(h.arrival)), h.error ? Y.push(b("p", h.error, "ppp-bad")) : h.message && !H ? Y.push(b("p", h.message, "ppp-cyan")) : h.notice && Y.push(b("p", h.notice, "ppp-warn")), m.mode === "open" && (($e = h.likeFunds) != null && $e.album) && h.likeFunds.low && !h.likeFunds.pending && Y.push(b("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const nt = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let ht = null, Nt = null;
    return m.mode === "locked" ? (ht = { label: "Continue listening", run: () => {
      x = g(), o.unlock();
    } }, Nt = { label: "Use a different passkey", run: () => {
      x = null, o.unlock(!0);
    } }) : m.mode === "arrive" && (h.step === "intro" ? (ht = { label: "Open album", run: () => void o.create() }, Nt = { label: "I've used Xtrata Music here before", run: () => void o.unlock(!0) }) : h.step === "locked" ? (ht = { label: "Open album", run: () => void o.unlock() }, Nt = { label: "Use a different passkey", run: () => void o.unlock(!0) }) : h.step === "unsupported" ? Y.push(b("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : Y.length || Y.push(b("p", "Opening your album…", "ppp-cyan"))), {
      mode: m.mode,
      player: m.player,
      from: m.from,
      offered: m.offered,
      plays: m.mode === "open" ? h.balance === void 0 ? null : h.giftPlays : void 0,
      playsComing: h.depositPending,
      status: Y,
      primary: ht,
      secondary: Nt,
      hint: ht ? nt : void 0,
      asking: H,
      busy: !!h.busy,
      myPlays: j(h),
      topUps: Ia
    };
  }
  const pe = /* @__PURE__ */ new Map(), le = () => {
    const h = window.XtrataRadio;
    return h != null && h.subscribe ? (h.subscribe((m) => {
      const f = m == null ? void 0 : m.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && pe.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!le()) {
    const h = setInterval(() => {
      le() && clearInterval(h);
    }, 500);
    setTimeout(() => clearInterval(h), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (h) => {
    const m = h.detail;
    if (m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      Gt();
      const f = ce(m.song, pe.get(m.song));
      o.onListened({ song: m.song, id: m.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const x$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", S$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, E$ = () => S$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, A$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, v$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Wy = class {
  constructor(t) {
    XA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && gx(t), this.callback(gc(t));
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
    var r, i, s, o, a, c, u, d, l, g;
    return n === "IOS" ? (i = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Chrome" ? (o = (s = t.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = E$(), e = A$(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return St("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, St("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), St("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, St("div", { class: "flex flex-col space-y-[10px]" }, St("div", { class: "flex items-center" }, St("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), St("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, St("span", { class: "sr-only" }, "Close popup"), St("img", { src: x$ }))), r ? St("p", null, "Select the wallet you want to connect to.") : St("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && St("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && St("div", { class: "mt-6" }, St("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), St("ul", { class: "space-y-3" }, this.installedProviders.map((s) => St("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, St("div", { class: "aspect-square basis-9 overflow-hidden" }, St("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), St("div", { class: "flex-1" }, St("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && St("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), St("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && St("div", { class: "mt-6" }, r ? St("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : St("div", { class: "mb-5 flex justify-between" }, St("p", { class: "text-sm font-medium" }, "Recommended wallets"), St("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, St("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, St("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), St("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), St("p", null, "What is a wallet? ", St("span", { class: "align-text-bottom text-[9px]" }, "↗")))), St("ul", { class: "space-y-3" }, n.map((s) => St("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, St("div", { class: "aspect-square basis-9 overflow-hidden" }, St("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), St("div", { class: "flex-1" }, St("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && St("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && St("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return TA(this);
  }
};
Wy.style = v$;
const $$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Wy
}, Symbol.toStringTag, { value: "Module" }));
