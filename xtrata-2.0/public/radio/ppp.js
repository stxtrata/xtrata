var Sy = Object.defineProperty;
var Ey = (t, e, n) => e in t ? Sy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Zs = (t, e, n) => Ey(t, typeof e != "symbol" ? e + "" : e, n);
var ge = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function eh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Vo(t) {
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
      typeof ge < "u" && ge || {}, r = {
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
      function s(m) {
        return m && DataView.prototype.isPrototypeOf(m);
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
        ], o = ArrayBuffer.isView || function(m) {
          return m && i.indexOf(Object.prototype.toString.call(m)) > -1;
        };
      function a(m) {
        if (typeof m != "string" && (m = String(m)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(m) || m === "")
          throw new TypeError('Invalid character in header field name: "' + m + '"');
        return m.toLowerCase();
      }
      function c(m) {
        return typeof m != "string" && (m = String(m)), m;
      }
      function u(m) {
        var k = {
          next: function() {
            var N = m.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && (k[Symbol.iterator] = function() {
          return k;
        }), k;
      }
      function d(m) {
        this.map = {}, m instanceof d ? m.forEach(function(k, N) {
          this.append(N, k);
        }, this) : Array.isArray(m) ? m.forEach(function(k) {
          if (k.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + k.length);
          this.append(k[0], k[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(k) {
          this.append(k, m[k]);
        }, this);
      }
      d.prototype.append = function(m, k) {
        m = a(m), k = c(k);
        var N = this.map[m];
        this.map[m] = N ? N + ", " + k : k;
      }, d.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, d.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, d.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, d.prototype.set = function(m, k) {
        this.map[a(m)] = c(k);
      }, d.prototype.forEach = function(m, k) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && m.call(k, this.map[N], N, this);
      }, d.prototype.keys = function() {
        var m = [];
        return this.forEach(function(k, N) {
          m.push(N);
        }), u(m);
      }, d.prototype.values = function() {
        var m = [];
        return this.forEach(function(k) {
          m.push(k);
        }), u(m);
      }, d.prototype.entries = function() {
        var m = [];
        return this.forEach(function(k, N) {
          m.push([N, k]);
        }), u(m);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function y(m) {
        return new Promise(function(k, N) {
          m.onload = function() {
            k(m.result);
          }, m.onerror = function() {
            N(m.error);
          };
        });
      }
      function h(m) {
        var k = new FileReader(), N = y(k);
        return k.readAsArrayBuffer(m), N;
      }
      function g(m) {
        var k = new FileReader(), N = y(k), X = /charset=([A-Za-z0-9_-]+)/.exec(m.type), nt = X ? X[1] : "utf-8";
        return k.readAsText(m, nt), N;
      }
      function w(m) {
        for (var k = new Uint8Array(m), N = new Array(k.length), X = 0; X < k.length; X++)
          N[X] = String.fromCharCode(k[X]);
        return N.join("");
      }
      function v(m) {
        if (m.slice)
          return m.slice(0);
        var k = new Uint8Array(m.byteLength);
        return k.set(new Uint8Array(m)), k.buffer;
      }
      function _() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = v(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || o(m)) ? this._bodyArrayBuffer = v(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = l(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var m = l(this);
            return m || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var m = l(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return g(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(w(this._bodyArrayBuffer));
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
      function b(m) {
        var k = m.toUpperCase();
        return U.indexOf(k) > -1 ? k : m;
      }
      function L(m, k) {
        if (!(this instanceof L))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        k = k || {};
        var N = k.body;
        if (m instanceof L) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, k.headers || (this.headers = new d(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !N && m._bodyInit != null && (N = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = k.credentials || this.credentials || "same-origin", (k.headers || !this.headers) && (this.headers = new d(k.headers)), this.method = b(k.method || this.method || "GET"), this.mode = k.mode || this.mode || null, this.signal = k.signal || this.signal || function() {
          if ("AbortController" in n) {
            var W = new AbortController();
            return W.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (k.cache === "no-store" || k.cache === "no-cache")) {
          var X = /([?&])_=[^&]*/;
          if (X.test(this.url))
            this.url = this.url.replace(X, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var nt = /\?/;
            this.url += (nt.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function E(m) {
        var k = new FormData();
        return m.trim().split("&").forEach(function(N) {
          if (N) {
            var X = N.split("="), nt = X.shift().replace(/\+/g, " "), W = X.join("=").replace(/\+/g, " ");
            k.append(decodeURIComponent(nt), decodeURIComponent(W));
          }
        }), k;
      }
      function D(m) {
        var k = new d(), N = m.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(X) {
          return X.indexOf(`
`) === 0 ? X.substr(1, X.length) : X;
        }).forEach(function(X) {
          var nt = X.split(":"), W = nt.shift().trim();
          if (W) {
            var Nt = nt.join(":").trim();
            try {
              k.append(W, Nt);
            } catch (bt) {
              console.warn("Response " + bt.message);
            }
          }
        }), k;
      }
      _.call(L.prototype);
      function G(m, k) {
        if (!(this instanceof G))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (k || (k = {}), this.type = "default", this.status = k.status === void 0 ? 200 : k.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = k.statusText === void 0 ? "" : "" + k.statusText, this.headers = new d(k.headers), this.url = k.url || "", this._initBody(m);
      }
      _.call(G.prototype), G.prototype.clone = function() {
        return new G(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, G.error = function() {
        var m = new G(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var j = [301, 302, 303, 307, 308];
      G.redirect = function(m, k) {
        if (j.indexOf(k) === -1)
          throw new RangeError("Invalid status code");
        return new G(null, { status: k, headers: { location: m } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(k, N) {
          this.message = k, this.name = N;
          var X = Error(k);
          this.stack = X.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function K(m, k) {
        return new Promise(function(N, X) {
          var nt = new L(m, k);
          if (nt.signal && nt.signal.aborted)
            return X(new e.DOMException("Aborted", "AbortError"));
          var W = new XMLHttpRequest();
          function Nt() {
            W.abort();
          }
          W.onload = function() {
            var S = {
              statusText: W.statusText,
              headers: D(W.getAllResponseHeaders() || "")
            };
            nt.url.indexOf("file://") === 0 && (W.status < 200 || W.status > 599) ? S.status = 200 : S.status = W.status, S.url = "responseURL" in W ? W.responseURL : S.headers.get("X-Request-URL");
            var M = "response" in W ? W.response : W.responseText;
            setTimeout(function() {
              N(new G(M, S));
            }, 0);
          }, W.onerror = function() {
            setTimeout(function() {
              X(new TypeError("Network request failed"));
            }, 0);
          }, W.ontimeout = function() {
            setTimeout(function() {
              X(new TypeError("Network request timed out"));
            }, 0);
          }, W.onabort = function() {
            setTimeout(function() {
              X(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function bt(S) {
            try {
              return S === "" && n.location.href ? n.location.href : S;
            } catch {
              return S;
            }
          }
          if (W.open(nt.method, bt(nt.url), !0), nt.credentials === "include" ? W.withCredentials = !0 : nt.credentials === "omit" && (W.withCredentials = !1), "responseType" in W && (r.blob ? W.responseType = "blob" : r.arrayBuffer && (W.responseType = "arraybuffer")), k && typeof k.headers == "object" && !(k.headers instanceof d || n.Headers && k.headers instanceof n.Headers)) {
            var _t = [];
            Object.getOwnPropertyNames(k.headers).forEach(function(S) {
              _t.push(a(S)), W.setRequestHeader(S, c(k.headers[S]));
            }), nt.headers.forEach(function(S, M) {
              _t.indexOf(M) === -1 && W.setRequestHeader(M, S);
            });
          } else
            nt.headers.forEach(function(S, M) {
              W.setRequestHeader(M, S);
            });
          nt.signal && (nt.signal.addEventListener("abort", Nt), W.onreadystatechange = function() {
            W.readyState === 4 && nt.signal.removeEventListener("abort", Nt);
          }), W.send(typeof nt._bodyInit > "u" ? null : nt._bodyInit);
        });
      }
      return K.polyfill = !0, n.fetch || (n.fetch = K, n.Headers = d, n.Request = L, n.Response = G), e.Headers = d, e.Request = L, e.Response = G, e.fetch = K, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ge);
})();
const Ay = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function $y(t, e) {
  const n = {};
  return Object.assign(n, Ay, e), await fetch(t, n);
}
function vy(t) {
  let e = $y, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Iy(...t) {
  const { fetchLib: e, middlewares: n } = vy(t);
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
var $s;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})($s || ($s = {}));
var Mr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Mr || (Mr = {}));
var Iu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Iu || (Iu = {}));
const Ly = "https://api.mainnet.hiro.so", ky = "https://api.testnet.hiro.so", Cy = "http://localhost:3999", By = ["mainnet", "testnet", "devnet", "mocknet"];
let vs = class {
  constructor(e) {
    this.version = Mr.Mainnet, this.chainId = $s.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Mr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Iy();
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
vs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Ja();
    case "testnet":
      return new Ty();
    case "devnet":
      return new My();
    case "mocknet":
      return new nh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${By.join(", ")}`);
  }
};
vs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : vs.fromName(t);
let Ja = class extends vs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ly,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Mr.Mainnet, this.chainId = $s.Mainnet;
  }
}, Ty = class extends vs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ky,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Mr.Testnet, this.chainId = $s.Testnet;
  }
}, nh = class extends vs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Cy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Mr.Testnet, this.chainId = $s.Testnet;
  }
};
const My = nh, rh = "xtrata.wallet.bridge.v1", _y = (t) => typeof t == "object" && t !== null && t.protocol === rh, Uy = (t) => _y(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Ny = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Qs extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Lu = 12e4;
class Hy {
  constructor(e) {
    Zs(this, "pending", /* @__PURE__ */ new Map());
    Zs(this, "listenTarget");
    Zs(this, "closed", !1);
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
    Zs(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Uy(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Qs("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Qs("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Qs("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Ny(), i = { protocol: rh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Qs(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Lu}ms.`
          )
        );
      }, this.options.timeoutMs ?? Lu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Qs("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Py = ["SP", "SM"], Oy = ["ST", "SN"], Dy = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Py.includes(n) ? "mainnet" : Oy.includes(n) ? "testnet" : null;
}, jy = () => {
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
}, Fy = () => typeof window > "u" || !window.localStorage ? jy() : window.localStorage, Ia = "xtrata.v15.1.wallet.session", ku = "mainnet", xo = { isConnected: !1 }, zy = (t) => t.address ? Dy(t.address) ?? t.network : t.network, sh = (t) => !t.isConnected || !t.address ? { ...xo } : zy(t) !== ku ? { ...xo } : {
  isConnected: !0,
  address: t.address,
  network: ku,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Ry = (t) => {
  if (!t)
    return { ...xo };
  try {
    const e = JSON.parse(t);
    return sh(e);
  } catch {
    return { ...xo };
  }
}, Gy = (t) => {
  const e = sh(t);
  return JSON.stringify(e);
}, Ky = (t) => {
  const e = Fy();
  return {
    load: () => Ry(e.getItem(Ia)),
    save: (n) => {
      e.setItem(Ia, Gy(n));
    },
    clear: () => {
      e.removeItem(Ia);
    }
  };
}, Vy = "https://browser.blockstack.org/auth", qy = {
  "@type": "Person",
  "@context": "http://schema.org"
}, ih = ["store_write"], Wy = "blockstack-session", Xy = {
  logLevel: "debug"
}, Xr = {
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
Object.freeze(Xr);
class Gs extends Error {
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
class Yy extends Gs {
  constructor(e, n = "") {
    super({ code: Xr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Cu extends Gs {
  constructor(e = "") {
    super({ code: Xr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Hi extends Gs {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Xr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Bu extends Gs {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Xr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class tc extends Gs {
  constructor(e) {
    super({ code: Xr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class oh extends Gs {
  constructor(e) {
    super({ code: Xr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Tu = ["debug", "info", "warn", "error", "none"], ec = {};
for (let t = 0; t < Tu.length; t++) {
  const e = Tu[t];
  ec[e] = t;
}
class ws {
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
    return ec[Xy.logLevel] <= ec[e];
  }
}
function Zy() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Qy() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function La(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Jy() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function tw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function ew(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function il(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = tw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    ws.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = ew(s, t.toString(), n);
    throw ws.error(i), new Error(i);
  }
  if (r)
    return {};
}
function pr(t, e) {
  return ol(le(t), e);
}
function le(t) {
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
  if (Ee(t, Uint8Array))
    return BigInt(`0x${tt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function nw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Mu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ai(t, e = 8) {
  return (typeof t == "bigint" ? t : le(t)).toString(16).padStart(e * 2, "0");
}
function qo(t) {
  return parseInt(t, 16);
}
function ol(t, e = 16) {
  const n = Ai(t, e);
  return xt(n);
}
function rw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function sw(t, e) {
  return t & BigInt(1) << e;
}
function nc(t) {
  return iw(BigInt(`0x${tt(t)}`), BigInt(t.byteLength * 8));
}
function iw(t, e) {
  return sw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const ow = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += ow[n];
  return e;
}
function xt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = nw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Yr(t) {
  return new TextEncoder().encode(t);
}
function $i(t) {
  return new TextDecoder().decode(t);
}
function aw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function cw(t) {
  return String.fromCharCode.apply(null, t);
}
function lw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function _u(t) {
  if (t.some(lw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
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
function Yt(t) {
  return gn(...t.map((e) => typeof e == "number" ? _u([e]) : e instanceof Array ? _u(e) : e));
}
function Ee(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const ah = "https://api.mainnet.hiro.so", ch = "https://api.testnet.hiro.so", lh = "http://localhost:3999", uw = "https://hub.blockstack.org", fw = 33, ka = 32;
function dw(t) {
  if (t.length < ka * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ka * 2), r = t.slice(2 + ka * 2);
  return {
    recoveryId: qo(e),
    r: n,
    s: r
  };
}
function al(t) {
  const e = typeof t == "string" ? xt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function hw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function pw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function gw(t, e) {
  return t[e];
}
function yw(t, e, n = 0) {
  return t[n] = e, t;
}
function ww(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function _r(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const bw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function mw(t, e) {
  const n = {};
  return Object.assign(n, bw, e), await fetch(t, n);
}
function xw(t) {
  let e = mw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Sw(...t) {
  const { fetchLib: e, middlewares: n } = xw(t);
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
class uh {
  constructor(e = ih.slice(), n = ((a) => (a = il("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Vy) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function rc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ew(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function fh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Aw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  rc(t.outputLen), rc(t.blockLen);
}
function $w(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function vw(t, e) {
  fh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ar = {
  number: rc,
  bool: Ew,
  bytes: fh,
  hash: Aw,
  exists: $w,
  output: vw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ca = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), sn = (t, e) => t << 32 - e | t >>> e, Iw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Iw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Lw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function cl(t) {
  if (typeof t == "string" && (t = Lw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let dh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Zr(t) {
  const e = (r) => t().update(cl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let hh = class extends dh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ar.hash(e);
    const r = cl(n);
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
    return Ar.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ar.exists(this), Ar.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Wo = (t, e, n) => new hh(t, e).update(n).digest();
Wo.create = (t, e) => new hh(t, e);
function kw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let ll = class extends dh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ca(this.buffer);
  }
  update(e) {
    Ar.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = cl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ca(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ar.exists(this), Ar.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    kw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ca(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const Cw = (t, e, n) => t & e ^ ~t & n, Bw = (t, e, n) => t & e ^ t & n ^ e & n, Tw = new Uint32Array([
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
]), Pn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), On = new Uint32Array(64);
let ph = class extends ll {
  constructor() {
    super(64, 32, 8, !1), this.A = Pn[0] | 0, this.B = Pn[1] | 0, this.C = Pn[2] | 0, this.D = Pn[3] | 0, this.E = Pn[4] | 0, this.F = Pn[5] | 0, this.G = Pn[6] | 0, this.H = Pn[7] | 0;
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
      On[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = On[l - 15], h = On[l - 2], g = sn(y, 7) ^ sn(y, 18) ^ y >>> 3, w = sn(h, 17) ^ sn(h, 19) ^ h >>> 10;
      On[l] = w + On[l - 7] + g + On[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = sn(a, 6) ^ sn(a, 11) ^ sn(a, 25), h = d + y + Cw(a, c, u) + Tw[l] + On[l] | 0, w = (sn(r, 2) ^ sn(r, 13) ^ sn(r, 22)) + Bw(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    On.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Mw = class extends ph {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Is = Zr(() => new ph());
Zr(() => new Mw());
const _w = {}, gh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _w
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const wt = BigInt(0), Ot = BigInt(1), lr = BigInt(2), ri = BigInt(3), Uu = BigInt(8), Lt = Object.freeze({
  a: wt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Ot,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Nu = (t, e) => (t + e / lr) / e, Pi = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Lt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Ot * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Nu(i * t, e), c = Nu(-r * t, e);
    let u = F(t - a * n - c * s, e), d = F(-a * r - c * i, e);
    const l = u > o, y = d > o;
    if (l && (u = e - u), y && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: d };
  }
}, Xe = 32, Ur = 32, yh = 32, So = Xe + 1, Eo = 2 * Xe + 1;
function Hu(t) {
  const { a: e, b: n } = Lt, r = F(t * t), s = F(r * t);
  return F(s + e * t + n);
}
const Oi = Lt.a === wt;
class ul extends Error {
  constructor(e) {
    super(e);
  }
}
function Pu(t) {
  if (!(t instanceof At))
    throw new TypeError("JacobianPoint expected");
}
class At {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof ft))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(ft.ZERO) ? At.ZERO : new At(e.x, e.y, Ot);
  }
  static toAffineBatch(e) {
    const n = Ow(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return At.toAffineBatch(e).map(At.fromAffine);
  }
  equals(e) {
    Pu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = F(s * s), u = F(a * a), d = F(n * u), l = F(i * c), y = F(F(r * a) * u), h = F(F(o * s) * c);
    return d === l && y === h;
  }
  negate() {
    return new At(this.x, F(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = F(e * e), i = F(n * n), o = F(i * i), a = e + i, c = F(lr * (F(a * a) - s - o)), u = F(ri * s), d = F(u * u), l = F(d - lr * c), y = F(u * (c - l) - Uu * o), h = F(lr * n * r);
    return new At(l, y, h);
  }
  add(e) {
    Pu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === wt || o === wt)
      return this;
    if (n === wt || r === wt)
      return e;
    const c = F(s * s), u = F(a * a), d = F(n * u), l = F(i * c), y = F(F(r * a) * u), h = F(F(o * s) * c), g = F(l - d), w = F(h - y);
    if (g === wt)
      return w === wt ? this.double() : At.ZERO;
    const v = F(g * g), _ = F(g * v), U = F(d * v), b = F(w * w - _ - lr * U), L = F(w * (U - b) - y * _), E = F(s * a * g);
    return new At(b, L, E);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = At.ZERO;
    if (typeof e == "bigint" && e === wt)
      return n;
    let r = ju(e);
    if (r === Ot)
      return this;
    if (!Oi) {
      let l = n, y = this;
      for (; r > wt; )
        r & Ot && (l = l.add(y)), y = y.double(), r >>= Ot;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Pi.splitScalar(r), c = n, u = n, d = this;
    for (; i > wt || a > wt; )
      i & Ot && (c = c.add(d)), a & Ot && (u = u.add(d)), d = d.double(), i >>= Ot, a >>= Ot;
    return s && (c = c.negate()), o && (u = u.negate()), u = new At(F(u.x * Pi.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Oi ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(At.BASE) && (n = ft.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && sc.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = At.normalizeZ(s), sc.set(n, s)));
    let i = At.ZERO, o = At.BASE;
    const a = 1 + (Oi ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const h = y * c;
      let g = Number(e & u);
      e >>= l, g > c && (g -= d, e += Ot);
      const w = h, v = h + Math.abs(g) - 1, _ = y % 2 !== 0, U = g < 0;
      g === 0 ? o = o.add(Di(_, s[w])) : i = i.add(Di(U, s[v]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = ju(e), s, i;
    if (Oi) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Pi.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: y, f: h } = this.wNAF(u, n);
      d = Di(o, d), y = Di(c, y), y = new At(F(y.x * Pi.beta), y.y, y.z), s = d.add(y), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return At.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(At.ZERO);
    e == null && (e = i ? Uu : Ks(s));
    const o = e, a = F(o * o), c = F(a * o), u = F(n * a), d = F(r * c), l = F(s * o);
    if (i)
      return ft.ZERO;
    if (l !== Ot)
      throw new Error("invZ was invalid");
    return new ft(u, d);
  }
}
At.BASE = new At(Lt.Gx, Lt.Gy, Ot);
At.ZERO = new At(wt, Ot, wt);
function Di(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const sc = /* @__PURE__ */ new WeakMap();
class ft {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, sc.delete(this);
  }
  hasEvenY() {
    return this.y % lr === wt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Me(n ? e : e.subarray(1));
    if (!fo(r))
      throw new Error("Point is not on curve");
    const s = Hu(r);
    let i = Pw(s);
    const o = (i & Ot) === Ot;
    n ? o && (i = F(-i)) : (e[0] & 1) === 1 !== o && (i = F(-i));
    const a = new ft(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Me(e.subarray(1, Xe + 1)), r = Me(e.subarray(Xe + 1, Xe * 2 + 1)), s = new ft(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = yn(e), r = n.length, s = n[0];
    if (r === Xe)
      return this.fromCompressedHex(n);
    if (r === So && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Eo && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${So} compressed bytes or ${Eo} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return ft.BASE.multiply(Nr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = mh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = fl(yn(e)), { n: a } = Lt, c = r === 2 || r === 3 ? s + a : s, u = Ks(c, a), d = F(-o * u, a), l = F(i * u, a), y = r & 1 ? "03" : "02", h = ft.fromHex(y + fr(c)), g = ft.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!g)
      throw new Error("Cannot recover signature: point at infinify");
    return g.assertValidity(), g;
  }
  toRawBytes(e = !1) {
    return dr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = fr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${fr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!fo(n) || !fo(r))
      throw new Error(e);
    const s = F(r * r), i = Hu(n);
    if (F(s - i) !== wt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new ft(this.x, F(-this.y));
  }
  double() {
    return At.fromAffine(this).double().toAffine();
  }
  add(e) {
    return At.fromAffine(this).add(At.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return At.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = At.fromAffine(this), i = n === wt || n === Ot || this !== ft.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = At.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(At.ZERO) ? void 0 : a.toAffine();
  }
}
ft.BASE = new ft(Lt.Gx, Lt.Gy);
ft.ZERO = new ft(wt, wt);
function Ou(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Du(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ls(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Me(n), left: t.subarray(e + 2) };
}
function Uw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ls(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Du(t.subarray(2)), { data: r, left: s } = Du(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ls(s)}`);
  return { r: e, s: r };
}
class Te {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Ls(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Te(Ao(s.slice(0, 64)), Ao(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Uw(n ? e : dr(e));
    return new Te(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Cs(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Cs(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Lt.n >> Ot;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Te(this.r, F(-this.s, Lt.n)) : this;
  }
  toDERRawBytes() {
    return dr(this.toDERHex());
  }
  toDERHex() {
    const e = Ou(Js(this.s)), n = Ou(Js(this.r)), r = e.length / 2, s = n.length / 2, i = Js(r), o = Js(s);
    return `30${Js(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return dr(this.toCompactHex());
  }
  toCompactHex() {
    return fr(this.r) + fr(this.s);
  }
}
function ar(...t) {
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
const Nw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ls(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Nw[t[n]];
  return e;
}
const Hw = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function fr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(wt <= t && t < Hw))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function ks(t) {
  const e = dr(fr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Js(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ao(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function dr(t) {
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
function Me(t) {
  return Ao(Ls(t));
}
function yn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : dr(t);
}
function ju(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Cs(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function F(t, e = Lt.P) {
  const n = t % e;
  return n >= wt ? n : e + n;
}
function He(t, e) {
  const { P: n } = Lt;
  let r = t;
  for (; e-- > wt; )
    r *= r, r %= n;
  return r;
}
function Pw(t) {
  const { P: e } = Lt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = He(u, ri) * u % e, l = He(d, ri) * u % e, y = He(l, lr) * c % e, h = He(y, r) * y % e, g = He(h, s) * h % e, w = He(g, o) * g % e, v = He(w, a) * w % e, _ = He(v, o) * g % e, U = He(_, ri) * u % e, b = He(U, i) * h % e, L = He(b, n) * c % e, E = He(L, lr);
  if (E * E % e !== t)
    throw new Error("Cannot find square root");
  return E;
}
function Ks(t, e = Lt.P) {
  if (t === wt || e <= wt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = F(t, e), r = e, s = wt, i = Ot;
  for (; n !== wt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== Ot)
    throw new Error("invert: does not exist");
  return F(s, e);
}
function Ow(t, e = Lt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === wt ? i : (n[a] = i, F(i * o, e)), Ot), s = Ks(r, e);
  return t.reduceRight((i, o, a) => o === wt ? i : (n[a] = F(i * n[a], e), F(i * o, e)), s), n;
}
function Dw(t) {
  const e = t.length * 8 - Ur * 8, n = Me(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function fl(t, e = !1) {
  const n = Dw(t);
  if (e)
    return n;
  const { n: r } = Lt;
  return n >= r ? n - r : n;
}
let Es, si;
class wh {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Vt.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return si(this.k, ...e);
  }
  checkSync() {
    if (typeof si != "function")
      throw new ul("hmacSha256Sync needs to be set");
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
    return ar(...n);
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
    return ar(...n);
  }
}
function Cs(t) {
  return wt < t && t < Lt.n;
}
function fo(t) {
  return wt < t && t < Lt.P;
}
function bh(t, e, n, r = !0) {
  const { n: s } = Lt, i = fl(t, !0);
  if (!Cs(i))
    return;
  const o = Ks(i, s), a = ft.BASE.multiply(i), c = F(a.x, s);
  if (c === wt)
    return;
  const u = F(o * F(e + n * c, s), s);
  if (u === wt)
    return;
  let d = new Te(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & Ot);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Nr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ur)
      throw new Error("Expected 32 bytes of private key");
    e = Ao(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ur)
      throw new Error("Expected 32 bytes of private key");
    e = Me(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Cs(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function dl(t) {
  return t instanceof ft ? (t.assertValidity(), t) : ft.fromHex(t);
}
function mh(t) {
  if (t instanceof Te)
    return t.assertValidity(), t;
  try {
    return Te.fromDER(t);
  } catch {
    return Te.fromCompact(t);
  }
}
function vi(t, e = !1) {
  return ft.fromPrivateKey(t).toRawBytes(e);
}
function jw(t, e, n, r = !1) {
  return ft.fromSignature(t, e, n).toRawBytes(r);
}
function Fu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === So || r === Eo : n ? r === So * 2 || r === Eo * 2 : t instanceof ft;
}
function hl(t, e, n = !1) {
  if (Fu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Fu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = dl(e);
  return r.assertValidity(), r.multiply(Nr(t)).toRawBytes(n);
}
function xh(t) {
  const e = t.length > Xe ? t.slice(0, Xe) : t;
  return Me(e);
}
function Fw(t) {
  const e = xh(t), n = F(e, Lt.n);
  return Sh(n < wt ? e : n);
}
function Sh(t) {
  return ks(t);
}
function Eh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = yn(t), s = Nr(e), i = [Sh(s), Fw(r)];
  if (n != null) {
    n === !0 && (n = Vt.randomBytes(Xe));
    const c = yn(n);
    if (c.length !== Xe)
      throw new Error(`sign: Expected ${Xe} bytes of extra data`);
    i.push(c);
  }
  const o = ar(...i), a = xh(r);
  return { seed: o, m: a, d: s };
}
function Ah(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function zw(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Eh(t, e, n.extraEntropy), o = new wh(yh, Ur);
  await o.reseed(r);
  let a;
  for (; !(a = bh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Ah(a, n);
}
function Xo(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Eh(t, e, n.extraEntropy), o = new wh(yh, Ur);
  o.reseedSync(r);
  let a;
  for (; !(a = bh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Ah(a, n);
}
const Rw = { strict: !0 };
function Gw(t, e, n, r = Rw) {
  let s;
  try {
    s = mh(t), e = yn(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = fl(e);
  let c;
  try {
    c = dl(n);
  } catch {
    return !1;
  }
  const { n: u } = Lt, d = Ks(o, u), l = F(a * d, u), y = F(i * d, u), h = ft.BASE.multiplyAndAddUnsafe(c, l, y);
  return h ? F(h.x, u) === i : !1;
}
function $o(t) {
  return F(Me(t), Lt.n);
}
class Bs {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = yn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Me(n.subarray(0, 32)), s = Me(n.subarray(32, 64));
    return new Bs(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!fo(e) || !Cs(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return fr(this.r) + fr(this.s);
  }
  toRawBytes() {
    return dr(this.toHex());
  }
}
function Kw(t) {
  return ft.fromPrivateKey(t).toRawX();
}
class $h {
  constructor(e, n, r = Vt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = yn(e);
    const { x: s, scalar: i } = this.getScalar(Nr(n));
    if (this.px = s, this.d = i, this.rand = yn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = ft.fromPrivateKey(e), r = n.hasEvenY() ? e : Lt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return ks(e ^ Me(n));
  }
  finalizeNonce(e) {
    const n = F(Me(e), Lt.n);
    if (n === wt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Bs(e.x, F(n + r * s, Lt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Vt.taggedHash, o = this.initNonce(n, await i(or.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(or.nonce, o, r, e)), d = $o(await i(or.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await Lh(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Vt.taggedHashSync, o = this.initNonce(n, i(or.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(or.nonce, o, r, e)), d = $o(i(or.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return kh(l, e, r) || this.error(), l;
  }
}
async function Vw(t, e, n) {
  return new $h(t, e, n).calc();
}
function qw(t, e, n) {
  return new $h(t, e, n).calcSync();
}
function vh(t, e, n) {
  const r = t instanceof Bs, s = r ? t : Bs.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: yn(e),
    P: dl(n)
  };
}
function Ih(t, e, n, r) {
  const s = ft.BASE.multiplyAndAddUnsafe(e, Nr(n), F(-r, Lt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Lh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = vh(t, e, n), a = $o(await Vt.taggedHash(or.challenge, ks(r), o.toRawX(), i));
    return Ih(r, o, s, a);
  } catch {
    return !1;
  }
}
function kh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = vh(t, e, n), a = $o(Vt.taggedHashSync(or.challenge, ks(r), o.toRawX(), i));
    return Ih(r, o, s, a);
  } catch (r) {
    if (r instanceof ul)
      throw r;
    return !1;
  }
}
const Ww = {
  Signature: Bs,
  getPublicKey: Kw,
  sign: Vw,
  verify: Lh,
  signSync: qw,
  verifySync: kh
};
ft.BASE._setWindowSize(8);
const Ie = {
  node: gh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, or = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ji = {}, Vt = {
  bytesToHex: Ls,
  hexToBytes: dr,
  concatBytes: ar,
  mod: F,
  invert: Ks,
  isValidPrivateKey(t) {
    try {
      return Nr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ks,
  _normalizePrivateKey: Nr,
  hashToPrivateKey: (t) => {
    t = yn(t);
    const e = Ur + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = F(Me(t), Lt.n - Ot) + Ot;
    return ks(n);
  },
  randomBytes: (t = 32) => {
    if (Ie.web)
      return Ie.web.getRandomValues(new Uint8Array(t));
    if (Ie.node) {
      const { randomBytes: e } = Ie.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Vt.hashToPrivateKey(Vt.randomBytes(Ur + 8)),
  precompute(t = 8, e = ft.BASE) {
    const n = e === ft.BASE ? e : new ft(e.x, e.y);
    return n._setWindowSize(t), n.multiply(ri), n;
  },
  sha256: async (...t) => {
    if (Ie.web) {
      const e = await Ie.web.subtle.digest("SHA-256", ar(...t));
      return new Uint8Array(e);
    } else if (Ie.node) {
      const { createHash: e } = Ie.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Ie.web) {
      const n = await Ie.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ar(...e), s = await Ie.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Ie.node) {
      const { createHmac: n } = Ie.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = ji[t];
    if (n === void 0) {
      const r = await Vt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ar(r, r), ji[t] = n;
    }
    return Vt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Es != "function")
      throw new ul("sha256Sync is undefined, you need to set it");
    let n = ji[t];
    if (n === void 0) {
      const r = Es(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ar(r, r), ji[t] = n;
    }
    return Es(n, ...e);
  },
  _JacobianPoint: At
};
Object.defineProperties(Vt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Es;
    },
    set(t) {
      Es || (Es = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return si;
    },
    set(t) {
      si || (si = t);
    }
  }
});
const Xw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Lt,
  Point: ft,
  Signature: Te,
  getPublicKey: vi,
  getSharedSecret: hl,
  recoverPublicKey: jw,
  schnorr: Ww,
  sign: zw,
  signSync: Xo,
  utils: Vt,
  verify: Gw
}, Symbol.toStringTag, { value: "Module" }));
var Ii = {};
Ii.byteLength = t1;
var Yw = Ii.toByteArray = n1, Zw = Ii.fromByteArray = i1, un = [], Oe = [], Qw = typeof Uint8Array < "u" ? Uint8Array : Array, Ba = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var fs = 0, Jw = Ba.length; fs < Jw; ++fs)
  un[fs] = Ba[fs], Oe[Ba.charCodeAt(fs)] = fs;
Oe[45] = 62;
Oe[95] = 63;
function Ch(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function t1(t) {
  var e = Ch(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function e1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function n1(t) {
  var e, n = Ch(t), r = n[0], s = n[1], i = new Qw(e1(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Oe[t.charCodeAt(c)] << 18 | Oe[t.charCodeAt(c + 1)] << 12 | Oe[t.charCodeAt(c + 2)] << 6 | Oe[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Oe[t.charCodeAt(c)] << 2 | Oe[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Oe[t.charCodeAt(c)] << 10 | Oe[t.charCodeAt(c + 1)] << 4 | Oe[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function r1(t) {
  return un[t >> 18 & 63] + un[t >> 12 & 63] + un[t >> 6 & 63] + un[t & 63];
}
function s1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(r1(r));
  return s.join("");
}
function i1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(s1(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    un[e >> 2] + un[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    un[e >> 10] + un[e >> 4 & 63] + un[e << 2 & 63] + "="
  )), s.join("");
}
function o1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const a1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function c1() {
  if (o1())
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
    throw new Error(a1);
  }
}
class l1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(gn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(gn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class u1 {
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
async function Bh() {
  const t = await c1();
  return t.name === "subtleCrypto" ? new u1(t.lib) : new l1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function f1(t) {
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), u = Math.log(256) / Math.log(o);
  function d(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var g = 0, w = 0, v = 0, _ = h.length; v !== _ && h[v] === 0; )
      v++, g++;
    for (var U = (_ - v) * u + 1 >>> 0, b = new Uint8Array(U); v !== _; ) {
      for (var L = h[v], E = 0, D = U - 1; (L !== 0 || E < w) && D !== -1; D--, E++)
        L += 256 * b[D] >>> 0, b[D] = L % o >>> 0, L = L / o >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      w = E, v++;
    }
    for (var G = U - w; G !== U && b[G] === 0; )
      G++;
    for (var j = a.repeat(g); G < U; ++G)
      j += t.charAt(b[G]);
    return j;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var g = 0, w = 0, v = 0; h[g] === a; )
      w++, g++;
    for (var _ = (h.length - g) * c + 1 >>> 0, U = new Uint8Array(_); h[g]; ) {
      var b = h.charCodeAt(g);
      if (b > 255)
        return;
      var L = e[b];
      if (L === 255)
        return;
      for (var E = 0, D = _ - 1; (L !== 0 || E < v) && D !== -1; D--, E++)
        L += o * U[D] >>> 0, U[D] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      v = E, g++;
    }
    for (var G = _ - v; G !== _ && U[G] === 0; )
      G++;
    for (var j = new Uint8Array(w + (_ - G)), K = w; G !== _; )
      j[K++] = U[G++];
    return j;
  }
  function y(h) {
    var g = l(h);
    if (g)
      return g;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: y
  };
}
var Th = f1;
const d1 = Th, h1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var p1 = d1(h1);
const g1 = /* @__PURE__ */ eh(p1), y1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Mh = Uint8Array.from({ length: 16 }, (t, e) => e), w1 = Mh.map((t) => (9 * t + 5) % 16);
let pl = [Mh], gl = [w1];
for (let t = 0; t < 4; t++)
  for (let e of [pl, gl])
    e.push(e[t].map((n) => y1[n]));
const _h = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), b1 = pl.map((t, e) => t.map((n) => _h[e][n])), m1 = gl.map((t, e) => t.map((n) => _h[e][n])), x1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), S1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Fi = (t, e) => t << e | t >>> 32 - e;
function zu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const zi = new Uint32Array(16);
let E1 = class extends ll {
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
      zi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = x1[h], v = S1[h], _ = pl[h], U = gl[h], b = b1[h], L = m1[h];
      for (let E = 0; E < 16; E++) {
        const D = Fi(r + zu(h, i, a, u) + zi[_[E]] + w, b[E]) + l | 0;
        r = l, l = u, u = Fi(a, 10) | 0, a = i, i = D;
      }
      for (let E = 0; E < 16; E++) {
        const D = Fi(s + zu(g, o, c, d) + zi[U[E]] + v, L[E]) + y | 0;
        s = y, y = d, d = Fi(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    zi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const A1 = Zr(() => new E1());
function $1(t) {
  return A1(t);
}
const Ri = BigInt(2 ** 32 - 1), ic = BigInt(32);
function Uh(t, e = !1) {
  return e ? { h: Number(t & Ri), l: Number(t >> ic & Ri) } : { h: Number(t >> ic & Ri) | 0, l: Number(t & Ri) | 0 };
}
function v1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Uh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const I1 = (t, e) => BigInt(t >>> 0) << ic | BigInt(e >>> 0), L1 = (t, e, n) => t >>> n, k1 = (t, e, n) => t << 32 - n | e >>> n, C1 = (t, e, n) => t >>> n | e << 32 - n, B1 = (t, e, n) => t << 32 - n | e >>> n, T1 = (t, e, n) => t << 64 - n | e >>> n - 32, M1 = (t, e, n) => t >>> n - 32 | e << 64 - n, _1 = (t, e) => e, U1 = (t, e) => t, N1 = (t, e, n) => t << n | e >>> 32 - n, H1 = (t, e, n) => e << n | t >>> 32 - n, P1 = (t, e, n) => e << n - 32 | t >>> 64 - n, O1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function D1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const j1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), F1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, z1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), R1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, G1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), K1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, it = {
  fromBig: Uh,
  split: v1,
  toBig: I1,
  shrSH: L1,
  shrSL: k1,
  rotrSH: C1,
  rotrSL: B1,
  rotrBH: T1,
  rotrBL: M1,
  rotr32H: _1,
  rotr32L: U1,
  rotlSH: N1,
  rotlSL: H1,
  rotlBH: P1,
  rotlBL: O1,
  add: D1,
  add3L: j1,
  add3H: F1,
  add4L: z1,
  add4H: R1,
  add5H: K1,
  add5L: G1
}, [V1, q1] = it.split([
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
].map((t) => BigInt(t))), Dn = new Uint32Array(80), jn = new Uint32Array(80);
let Yo = class extends ll {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: g, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, h, g, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, h, g, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Dn[b] = e.getUint32(n), jn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = Dn[b - 15] | 0, E = jn[b - 15] | 0, D = it.rotrSH(L, E, 1) ^ it.rotrSH(L, E, 8) ^ it.shrSH(L, E, 7), G = it.rotrSL(L, E, 1) ^ it.rotrSL(L, E, 8) ^ it.shrSL(L, E, 7), j = Dn[b - 2] | 0, K = jn[b - 2] | 0, m = it.rotrSH(j, K, 19) ^ it.rotrBH(j, K, 61) ^ it.shrSH(j, K, 6), k = it.rotrSL(j, K, 19) ^ it.rotrBL(j, K, 61) ^ it.shrSL(j, K, 6), N = it.add4L(G, k, jn[b - 7], jn[b - 16]), X = it.add4H(N, D, m, Dn[b - 7], Dn[b - 16]);
      Dn[b] = X | 0, jn[b] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: v, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = it.rotrSH(l, y, 14) ^ it.rotrSH(l, y, 18) ^ it.rotrBH(l, y, 41), E = it.rotrSL(l, y, 14) ^ it.rotrSL(l, y, 18) ^ it.rotrBL(l, y, 41), D = l & h ^ ~l & w, G = y & g ^ ~y & v, j = it.add5L(U, E, G, q1[b], jn[b]), K = it.add5H(j, _, L, D, V1[b], Dn[b]), m = j | 0, k = it.rotrSH(r, s, 28) ^ it.rotrBH(r, s, 34) ^ it.rotrBH(r, s, 39), N = it.rotrSL(r, s, 28) ^ it.rotrBL(r, s, 34) ^ it.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      _ = w | 0, U = v | 0, w = h | 0, v = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = it.add(u | 0, d | 0, K | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = it.add3L(m, N, nt);
      r = it.add3H(W, K, k, X), s = W | 0;
    }
    ({ h: r, l: s } = it.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = it.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = it.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = it.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = it.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = it.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: v } = it.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: _, l: U } = it.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, d, l, y, h, g, w, v, _, U);
  }
  roundClean() {
    Dn.fill(0), jn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, W1 = class extends Yo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, X1 = class extends Yo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Y1 = class extends Yo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Z1 = Zr(() => new Yo());
Zr(() => new W1());
Zr(() => new X1());
Zr(() => new Y1());
function Nh(t) {
  return Is(t);
}
function Q1(t) {
  return Z1(t);
}
const J1 = 0;
Vt.hmacSha256Sync = (t, ...e) => {
  const n = Wo.create(Is, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function tb() {
  return tt(Vt.randomPrivateKey());
}
function eb(t) {
  const e = Is(Is(t));
  return g1.encode(gn(t, e).slice(0, t.length + 4));
}
function nb(t, e) {
  return eb(gn(new Uint8Array([t]), e.slice(0, 20)));
}
function Hh(t, e = J1) {
  const n = typeof t == "string" ? xt(t) : t, r = $1(Nh(n));
  return nb(e, r);
}
function Ph(t) {
  const e = al(t);
  return tt(vi(e.slice(0, 32), !0));
}
Vt.hmacSha256Sync = (t, ...e) => {
  const n = Wo.create(Is, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var vo;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(vo || (vo = {}));
async function rb(t, e, n) {
  return await (await Bh()).encrypt("aes-256-cbc", e, t, n);
}
async function sb(t, e, n) {
  return await (await Bh()).decrypt("aes-256-cbc", e, t, n);
}
function Oh(t, e) {
  return Wo(Is, t, e);
}
function ib(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Dh(t) {
  const e = Q1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function ob(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function ab(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: vo.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: vo.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !ob(t))
    return e;
  try {
    return ft.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function cb(t, e, n, r) {
  const s = ab(t);
  if (!s.result)
    throw s;
  const i = Vt.randomPrivateKey(), o = vi(i, !0);
  let a = hl(i, t, !0);
  a = a.slice(1);
  const c = Dh(a), u = Vt.randomBytes(16), d = await rb(u, c.encryptionKey, e), l = gn(u, o, d), y = Oh(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = tt(d);
  else if (r === "base64")
    h = Zw(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const g = {
    iv: tt(u),
    ephemeralPK: tt(o),
    cipherText: h,
    mac: tt(y),
    wasString: n
  };
  return r && r !== "hex" && (g.cipherTextEncoding = r), g;
}
async function jh(t, e) {
  if (!e.ephemeralPK)
    throw new Bu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = hl(t, n, !0);
  r = r.slice(1);
  const s = Dh(r), i = xt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = xt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Yw(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = gn(i, xt(n), o), c = Oh(s.hmacKey, a), u = xt(e.mac);
  if (!ib(u, c))
    throw new Bu("Decryption failed: failure in MAC check");
  const d = await sb(i, s.encryptionKey, o);
  return e.wasString ? $i(d) : d;
}
function lb(t, e) {
  const n = typeof e == "string" ? Yr(e) : e, r = Ph(t), s = Nh(n), i = Xo(s, t);
  return {
    signature: tt(i),
    publicKey: r
  };
}
async function ub(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Ph(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Yr(t) : t, o = await cb(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = lb(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function fb(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return jh(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var ae = {}, Ts = {}, he = {};
Object.defineProperty(he, "__esModule", { value: !0 });
he.decode = he.encode = he.unescape = he.escape = he.pad = void 0;
const Fh = Ii;
function yl(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
he.pad = yl;
function zh(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
he.escape = zh;
function Rh(t) {
  return yl(t).replace(/-/g, "+").replace(/_/g, "/");
}
he.unescape = Rh;
function db(t) {
  return zh((0, Fh.fromByteArray)(new TextEncoder().encode(t)));
}
he.encode = db;
function hb(t) {
  return new TextDecoder().decode((0, Fh.toByteArray)(yl(Rh(t))));
}
he.decode = hb;
var Zo = {}, Qo = {}, Gh = {}, Kh = {}, Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
Jo.crypto = void 0;
Jo.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = y, t.rotl = h, t.byteSwap = g, t.byteSwap32 = w, t.bytesToHex = U, t.hexToBytes = E, t.asyncLoop = G, t.utf8ToBytes = j, t.bytesToUtf8 = K, t.toBytes = m, t.kdfInputToBytes = k, t.concatBytes = N, t.checkOpts = X, t.createHasher = W, t.createOptHasher = Nt, t.createXOFer = bt, t.randomBytes = _t;
  const e = Jo;
  function n(S) {
    return S instanceof Uint8Array || ArrayBuffer.isView(S) && S.constructor.name === "Uint8Array";
  }
  function r(S) {
    if (!Number.isSafeInteger(S) || S < 0)
      throw new Error("positive integer expected, got " + S);
  }
  function s(S, ...M) {
    if (!n(S))
      throw new Error("Uint8Array expected");
    if (M.length > 0 && !M.includes(S.length))
      throw new Error("Uint8Array expected of length " + M + ", got length=" + S.length);
  }
  function i(S) {
    if (typeof S != "function" || typeof S.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(S.outputLen), r(S.blockLen);
  }
  function o(S, M = !0) {
    if (S.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (M && S.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(S, M) {
    s(S);
    const I = M.outputLen;
    if (S.length < I)
      throw new Error("digestInto() expects output buffer of length at least " + I);
  }
  function c(S) {
    return new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
  }
  function u(S) {
    return new Uint32Array(S.buffer, S.byteOffset, Math.floor(S.byteLength / 4));
  }
  function d(...S) {
    for (let M = 0; M < S.length; M++)
      S[M].fill(0);
  }
  function l(S) {
    return new DataView(S.buffer, S.byteOffset, S.byteLength);
  }
  function y(S, M) {
    return S << 32 - M | S >>> M;
  }
  function h(S, M) {
    return S << M | S >>> 32 - M >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function g(S) {
    return S << 24 & 4278190080 | S << 8 & 16711680 | S >>> 8 & 65280 | S >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (S) => S : (S) => g(S), t.byteSwapIfBE = t.swap8IfBE;
  function w(S) {
    for (let M = 0; M < S.length; M++)
      S[M] = g(S[M]);
    return S;
  }
  t.swap32IfBE = t.isLE ? (S) => S : w;
  const v = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", _ = /* @__PURE__ */ Array.from({ length: 256 }, (S, M) => M.toString(16).padStart(2, "0"));
  function U(S) {
    if (s(S), v)
      return S.toHex();
    let M = "";
    for (let I = 0; I < S.length; I++)
      M += _[S[I]];
    return M;
  }
  const b = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function L(S) {
    if (S >= b._0 && S <= b._9)
      return S - b._0;
    if (S >= b.A && S <= b.F)
      return S - (b.A - 10);
    if (S >= b.a && S <= b.f)
      return S - (b.a - 10);
  }
  function E(S) {
    if (typeof S != "string")
      throw new Error("hex string expected, got " + typeof S);
    if (v)
      return Uint8Array.fromHex(S);
    const M = S.length, I = M / 2;
    if (M % 2)
      throw new Error("hex string expected, got unpadded hex of length " + M);
    const H = new Uint8Array(I);
    for (let P = 0, q = 0; P < I; P++, q += 2) {
      const et = L(S.charCodeAt(q)), It = L(S.charCodeAt(q + 1));
      if (et === void 0 || It === void 0) {
        const Jt = S[q] + S[q + 1];
        throw new Error('hex string expected, got non-hex character "' + Jt + '" at index ' + q);
      }
      H[P] = et * 16 + It;
    }
    return H;
  }
  const D = async () => {
  };
  t.nextTick = D;
  async function G(S, M, I) {
    let H = Date.now();
    for (let P = 0; P < S; P++) {
      I(P);
      const q = Date.now() - H;
      q >= 0 && q < M || (await (0, t.nextTick)(), H += q);
    }
  }
  function j(S) {
    if (typeof S != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(S));
  }
  function K(S) {
    return new TextDecoder().decode(S);
  }
  function m(S) {
    return typeof S == "string" && (S = j(S)), s(S), S;
  }
  function k(S) {
    return typeof S == "string" && (S = j(S)), s(S), S;
  }
  function N(...S) {
    let M = 0;
    for (let H = 0; H < S.length; H++) {
      const P = S[H];
      s(P), M += P.length;
    }
    const I = new Uint8Array(M);
    for (let H = 0, P = 0; H < S.length; H++) {
      const q = S[H];
      I.set(q, P), P += q.length;
    }
    return I;
  }
  function X(S, M) {
    if (M !== void 0 && {}.toString.call(M) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(S, M);
  }
  class nt {
  }
  t.Hash = nt;
  function W(S) {
    const M = (H) => S().update(m(H)).digest(), I = S();
    return M.outputLen = I.outputLen, M.blockLen = I.blockLen, M.create = () => S(), M;
  }
  function Nt(S) {
    const M = (H, P) => S(P).update(m(H)).digest(), I = S({});
    return M.outputLen = I.outputLen, M.blockLen = I.blockLen, M.create = (H) => S(H), M;
  }
  function bt(S) {
    const M = (H, P) => S(P).update(m(H)).digest(), I = S({});
    return M.outputLen = I.outputLen, M.blockLen = I.blockLen, M.create = (H) => S(H), M;
  }
  t.wrapConstructor = W, t.wrapConstructorWithOpts = Nt, t.wrapXOFConstructorWithOpts = bt;
  function _t(S = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(S));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(S));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Kh);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Kh;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? i.create().update(a).digest() : a);
      for (let d = 0; d < u.length; d++)
        u[d] ^= 54;
      this.iHash.update(u), this.oHash = i.create();
      for (let d = 0; d < u.length; d++)
        u[d] ^= 106;
      this.oHash.update(u), (0, e.clean)(u);
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
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: d, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = u, i.blockLen = d, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(Gh);
const ds = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Vh(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function oc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Qr(t, ...e) {
  if (!Vh(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function pb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  oc(t.outputLen), oc(t.blockLen);
}
function ac(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qh(t, e) {
  Qr(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function gb(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function yb(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Io(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function ho(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Re(t, e) {
  return t << 32 - e | t >>> e;
}
function wb(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const wl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function bl(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Wh = wl ? (t) => t : (t) => bl(t), bb = Wh;
function Xh(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = bl(t[e]);
  return t;
}
const mb = wl ? (t) => t : Xh, Yh = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", xb = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Sb(t) {
  if (Qr(t), Yh)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += xb[t[n]];
  return e;
}
const En = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ru(t) {
  if (t >= En._0 && t <= En._9)
    return t - En._0;
  if (t >= En.A && t <= En.F)
    return t - (En.A - 10);
  if (t >= En.a && t <= En.f)
    return t - (En.a - 10);
}
function Eb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Yh)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Ru(t.charCodeAt(i)), a = Ru(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Zh = async () => {
};
async function Ab(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Zh(), r += i);
  }
}
function ml(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function $b(t) {
  return new TextDecoder().decode(t);
}
function Li(t) {
  return typeof t == "string" && (t = ml(t)), Qr(t), t;
}
function vb(t) {
  return typeof t == "string" && (t = ml(t)), Qr(t), t;
}
function Ib(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Qr(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Lb(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Qh = class {
};
function ta(t) {
  const e = (r) => t().update(Li(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Jh(t) {
  const e = (r, s) => t(s).update(Li(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function t0(t) {
  const e = (r, s) => t(s).update(Li(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const kb = ta, Cb = Jh, Bb = t0;
function Tb(t = 32) {
  if (ds && typeof ds.getRandomValues == "function")
    return ds.getRandomValues(new Uint8Array(t));
  if (ds && typeof ds.randomBytes == "function")
    return Uint8Array.from(ds.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Mb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Qh,
  abytes: Qr,
  aexists: ac,
  ahash: pb,
  anumber: oc,
  aoutput: qh,
  asyncLoop: Ab,
  byteSwap: bl,
  byteSwap32: Xh,
  byteSwapIfBE: bb,
  bytesToHex: Sb,
  bytesToUtf8: $b,
  checkOpts: Lb,
  clean: Io,
  concatBytes: Ib,
  createHasher: ta,
  createOptHasher: Jh,
  createView: ho,
  createXOFer: t0,
  hexToBytes: Eb,
  isBytes: Vh,
  isLE: wl,
  kdfInputToBytes: vb,
  nextTick: Zh,
  randomBytes: Tb,
  rotl: wb,
  rotr: Re,
  swap32IfBE: mb,
  swap8IfBE: Wh,
  toBytes: Li,
  u32: yb,
  u8: gb,
  utf8ToBytes: ml,
  wrapConstructor: kb,
  wrapConstructorWithOpts: Cb,
  wrapXOFConstructorWithOpts: Bb
}, Symbol.toStringTag, { value: "Module" }));
function _b(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function Ub(t, e, n) {
  return t & e ^ ~t & n;
}
function Nb(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Hb extends Qh {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = ho(this.buffer);
  }
  update(e) {
    ac(this), e = Li(e), Qr(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ho(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ac(this), qh(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Io(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    _b(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ho(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const Fn = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), zn = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Pb = /* @__PURE__ */ Uint32Array.from([
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
]), Rn = /* @__PURE__ */ new Uint32Array(64);
let xl = class extends Hb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Fn[0] | 0, this.B = Fn[1] | 0, this.C = Fn[2] | 0, this.D = Fn[3] | 0, this.E = Fn[4] | 0, this.F = Fn[5] | 0, this.G = Fn[6] | 0, this.H = Fn[7] | 0;
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
      Rn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Rn[l - 15], h = Rn[l - 2], g = Re(y, 7) ^ Re(y, 18) ^ y >>> 3, w = Re(h, 17) ^ Re(h, 19) ^ h >>> 10;
      Rn[l] = w + Rn[l - 7] + g + Rn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Re(a, 6) ^ Re(a, 11) ^ Re(a, 25), h = d + y + Ub(a, c, u) + Pb[l] + Rn[l] | 0, w = (Re(r, 2) ^ Re(r, 13) ^ Re(r, 22)) + Nb(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Io(Rn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Io(this.buffer);
  }
}, e0 = class extends xl {
  constructor() {
    super(28), this.A = zn[0] | 0, this.B = zn[1] | 0, this.C = zn[2] | 0, this.D = zn[3] | 0, this.E = zn[4] | 0, this.F = zn[5] | 0, this.G = zn[6] | 0, this.H = zn[7] | 0;
  }
};
const Ob = /* @__PURE__ */ ta(() => new xl()), Db = /* @__PURE__ */ ta(() => new e0()), jb = xl, Fb = Ob, zb = e0, Rb = Db, Gb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: zb,
  SHA256: jb,
  sha224: Rb,
  sha256: Fb
}, Symbol.toStringTag, { value: "Module" })), ea = /* @__PURE__ */ Vo(Gb), Kb = /* @__PURE__ */ Vo(Xw);
var Ms = {};
Object.defineProperty(Ms, "__esModule", { value: !0 });
Ms.joseToDer = Ms.derToJose = void 0;
const n0 = Ii, r0 = he;
function Ta(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Vb = {
  ES256: Ta(256),
  ES384: Ta(384),
  ES512: Ta(521)
};
function s0(t) {
  const e = Vb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Lo = 128, i0 = 0, qb = 32, Wb = 16, Xb = 2, o0 = Wb | qb | i0 << 6, ko = Xb | i0 << 6;
function a0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, n0.toByteArray)((0, r0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Yb(t, e) {
  const n = a0(t), r = s0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== o0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Lo | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== ko)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== ko)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const y = r - c, h = r - d, g = new Uint8Array(y + c + h + d);
  for (o = 0; o < y; ++o)
    g[o] = 0;
  g.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const w = o; o < w + h; ++o)
    g[o] = 0;
  return g.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, r0.escape)((0, n0.fromByteArray)(g));
}
Ms.derToJose = Yb;
function Gu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Lo && --r, r;
}
function Zb(t, e) {
  t = a0(t);
  const n = s0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Gu(t, 0, n), i = Gu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Lo, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = o0, u ? d[l++] = c : (d[l++] = Lo | 1, d[l++] = c & 255), d[l++] = ko, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = ko, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
Ms.joseToDer = Zb;
var Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.InvalidTokenError = Bn.MissingParametersError = void 0;
class Qb extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Bn.MissingParametersError = Qb;
class Jb extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Bn.InvalidTokenError = Jb;
const ki = /* @__PURE__ */ Vo(Mb);
Object.defineProperty(Qo, "__esModule", { value: !0 });
Qo.SECP256K1Client = void 0;
const t2 = Gh, e2 = ea, po = Kb, Ku = Ms, Vu = Bn, qu = ki;
po.utils.hmacSha256Sync = (t, ...e) => {
  const n = t2.hmac.create(e2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class c0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, qu.bytesToHex)(po.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Vu.MissingParametersError("a signing input hash and private key are all required");
    const s = po.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, qu.bytesToHex)(s);
    if (r === "jose")
      return (0, Ku.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Ku.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Vu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return po.verify(n, e, r, { strict: !1 });
  }
}
Qo.SECP256K1Client = c0;
c0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Qo;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Zo);
var Hr = {};
const n2 = /* @__PURE__ */ Vo(gh);
var r2 = ge && ge.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
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
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Hr, "__esModule", { value: !0 });
Hr.hashSha256Async = Hr.hashSha256 = void 0;
const s2 = ea;
function l0(t) {
  return (0, s2.sha256)(t);
}
Hr.hashSha256 = l0;
function i2(t) {
  return r2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = n2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(l0(t));
    }
  });
}
Hr.hashSha256Async = i2;
var o2 = ge && ge.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
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
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.TokenSigner = Ts.createUnsecuredToken = void 0;
const cc = he, Wu = Zo, a2 = Bn, Xu = Hr;
function lc(t, e) {
  const n = [], r = cc.encode(JSON.stringify(e));
  n.push(r);
  const s = cc.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function c2(t) {
  return lc(t, { typ: "JWT", alg: "none" }) + ".";
}
Ts.createUnsecuredToken = c2;
class l2 {
  constructor(e, n) {
    if (!(e && n))
      throw new a2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Wu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Wu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = lc(e, s), o = (0, Xu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return o2(this, void 0, void 0, function* () {
      const s = this.header(r), i = lc(e, s), o = yield (0, Xu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [cc.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Ts.TokenSigner = l2;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
na.TokenVerifier = void 0;
const u2 = he, Yu = Zo, f2 = Bn, Gi = Hr;
class d2 {
  constructor(e, n) {
    if (!(e && n))
      throw new f2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Yu.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Yu.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Gi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Gi.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), u2.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Gi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Gi.hashSha256)(r);
      return i(o);
    }
  }
}
na.TokenVerifier = d2;
var ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
ra.decodeToken = void 0;
const Ki = he;
function h2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Ki.decode(e[0])), r = JSON.parse(Ki.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Ki.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Ki.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
ra.decodeToken = h2;
(function(t) {
  var e = ge && ge.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = ge && ge.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Ts, t), n(na, t), n(ra, t), n(Bn, t), n(Zo, t);
})(ae);
function p2(t) {
  return `did:btc-addr:${t}`;
}
function g2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Cu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Cu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function u0(t) {
  if (t)
    return g2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const y2 = "1.4.0";
function w2() {
  return tb();
}
function b2(t, e, n, r = ih.slice(), s, i = Zy().getTime(), o = {}) {
  const a = (h) => {
    const g = il("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return g == null ? void 0 : g.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Jy(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: y2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = ae.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = Hh(u);
  return c.iss = p2(d), new ae.TokenSigner("ES256k", t).sign(c);
}
async function Zu(t, e) {
  const n = $i(xt(e)), r = JSON.parse(n), s = await jh(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function m2(t) {
  const e = ae.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new ae.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function x2(t) {
  const e = ae.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = u0(e.iss);
  if (n.length === 1) {
    if (Hh(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function S2(t) {
  const e = ae.decodeToken(t).payload;
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
function E2(t) {
  const e = ae.decodeToken(t).payload;
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
function A2(t) {
  const e = [
    E2(t),
    S2(t),
    m2(t),
    x2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Qu = "1.0.0";
class hr {
  constructor(e) {
    this.version = Qu, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Qu)
      throw new tc(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new hr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class f0 {
  constructor(e) {
    if (e) {
      const n = new hr(e);
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
class Ju extends f0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new hr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new oh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new hr({})), !0;
  }
}
class tf extends f0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Wy, !localStorage.getItem(this.key)) {
      const r = new hr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new oh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return hr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new hr({})), !0;
  }
}
var fi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(fi || (fi = {}));
var Co;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Co || (Co = {}));
fi.Mainnet;
var kn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(kn || (kn = {}));
var dn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(dn || (dn = {}));
kn.Mainnet;
const d0 = {
  chainId: fi.Mainnet,
  transactionVersion: kn.Mainnet,
  peerNetworkId: Co.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: dn.MainnetSingleSig,
    multiSig: dn.MainnetMultiSig
  },
  client: { baseUrl: ah }
}, uc = {
  chainId: fi.Testnet,
  transactionVersion: kn.Testnet,
  peerNetworkId: Co.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: dn.TestnetSingleSig,
    multiSig: dn.TestnetMultiSig
  },
  client: { baseUrl: ch }
}, go = {
  ...uc,
  addressVersion: { ...uc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: lh }
}, $2 = {
  ...go,
  addressVersion: { ...go.addressVersion },
  client: { ...go.client }
};
function v2(t) {
  switch (t) {
    case "mainnet":
      return d0;
    case "testnet":
      return uc;
    case "devnet":
      return go;
    case "mocknet":
      return $2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function h0(t) {
  return typeof t == "string" ? v2(t) : t;
}
var ef;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ef || (ef = {}));
var nf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(nf || (nf = {}));
var Ge;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ge || (Ge = {}));
const Ma = ["onChainOnly", "offChainOnly", "any"];
Ma[0] + "", Ge.OnChainOnly, Ma[1] + "", Ge.OffChainOnly, Ma[2] + "", Ge.Any, Ge.OnChainOnly + "", Ge.OnChainOnly, Ge.OffChainOnly + "", Ge.OffChainOnly, Ge.Any + "", Ge.Any;
var rf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(rf || (rf = {}));
var sf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(sf || (sf = {}));
var of;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(of || (of = {}));
var In;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(In || (In = {}));
var af;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(af || (af = {}));
var cf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(cf || (cf = {}));
var lf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(lf || (lf = {}));
var uf;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(uf || (uf = {}));
var ff;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ff || (ff = {}));
var df;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(df || (df = {}));
var hf;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(hf || (hf = {}));
var pf;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(pf || (pf = {}));
var gf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(gf || (gf = {}));
function fc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function I2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function p0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function L2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fc(t.outputLen), fc(t.blockLen);
}
function k2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function C2(t, e) {
  p0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $r = {
  number: fc,
  bool: I2,
  bytes: p0,
  hash: L2,
  exists: k2,
  output: C2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _a = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), on = (t, e) => t << 32 - e | t >>> e, B2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!B2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function T2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Sl(t) {
  if (typeof t == "string" && (t = T2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let g0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Jr(t) {
  const e = (r) => t().update(Sl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let y0 = class extends g0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $r.hash(e);
    const r = Sl(n);
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
    return $r.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    $r.exists(this), $r.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const w0 = (t, e, n) => new y0(t, e).update(n).digest();
w0.create = (t, e) => new y0(t, e);
function M2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let El = class extends g0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _a(this.buffer);
  }
  update(e) {
    $r.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Sl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = _a(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $r.exists(this), $r.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    M2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = _a(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const _2 = (t, e, n) => t & e ^ ~t & n, U2 = (t, e, n) => t & e ^ t & n ^ e & n, N2 = new Uint32Array([
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
]), Gn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Kn = new Uint32Array(64);
let b0 = class extends El {
  constructor() {
    super(64, 32, 8, !1), this.A = Gn[0] | 0, this.B = Gn[1] | 0, this.C = Gn[2] | 0, this.D = Gn[3] | 0, this.E = Gn[4] | 0, this.F = Gn[5] | 0, this.G = Gn[6] | 0, this.H = Gn[7] | 0;
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
      Kn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Kn[l - 15], h = Kn[l - 2], g = on(y, 7) ^ on(y, 18) ^ y >>> 3, w = on(h, 17) ^ on(h, 19) ^ h >>> 10;
      Kn[l] = w + Kn[l - 7] + g + Kn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = on(a, 6) ^ on(a, 11) ^ on(a, 25), h = d + y + _2(a, c, u) + N2[l] + Kn[l] | 0, w = (on(r, 2) ^ on(r, 13) ^ on(r, 22)) + U2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Kn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, H2 = class extends b0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const m0 = Jr(() => new b0());
Jr(() => new H2());
var ts = {}, Al = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ki;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (u < 4) {
        const g = n.indexOf(o[h]) >> u;
        let w = 0;
        h !== 0 && (w = n.indexOf(o[h - 1]));
        const v = 1 + u, _ = w % (1 << v) << 5 - v, U = t.c32[g + _];
        u = v, c.unshift(U);
      } else
        u = 0;
    let d = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), y = l ? l[0].length : 0;
    for (let h = 0; h < y; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let g = 0; g < h; g++)
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
    const c = o.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let d = [], l = 0, y = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      y === 4 && (d.unshift(n[l]), y = 0, l = 0);
      const _ = (t.c32.indexOf(o[w]) << y) + l, U = n[_ % 16];
      if (y += 1, l = _ >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      d.unshift(U);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let w = 0; w < d.length && d[w] === "0"; w++)
      h++;
    d = d.slice(h - h % 2);
    let g = d.join("");
    for (let w = 0; w < u; w++)
      g = `00${g}`;
    if (a) {
      const w = a * 2 - g.length;
      for (let v = 0; v < w; v += 2)
        g = `00${g}`;
    }
    return g;
  }
  t.c32decode = i;
})(Al);
var Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.c32checkDecode = Pr.c32checkEncode = void 0;
const yf = ea, wf = ki, ii = Al;
function x0(t) {
  const e = (0, yf.sha256)((0, yf.sha256)((0, wf.hexToBytes)(t)));
  return (0, wf.bytesToHex)(e.slice(0, 4));
}
function P2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = x0(`${n}${e}`), s = (0, ii.c32encode)(`${e}${r}`);
  return `${ii.c32[t]}${s}`;
}
Pr.c32checkEncode = P2;
function O2(t) {
  t = (0, ii.c32normalize)(t);
  const e = (0, ii.c32decode)(t.slice(1)), n = t[0], r = ii.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), x0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Pr.c32checkDecode = O2;
var S0 = {}, _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
_s.decode = _s.encode = void 0;
const Bo = ea, bf = ki, E0 = Th, A0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function D2(t, e = "00") {
  const n = typeof t == "string" ? (0, bf.hexToBytes)(t) : t, r = typeof e == "string" ? (0, bf.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Bo.sha256)((0, Bo.sha256)(new Uint8Array([...r, ...n])));
  return E0(A0).encode([...r, ...n, ...s.slice(0, 4)]);
}
_s.encode = D2;
function j2(t) {
  const e = E0(A0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Bo.sha256)((0, Bo.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
_s.decode = j2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Pr, n = _s, r = ki;
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
    const y = n.decode(d), h = (0, r.bytesToHex)(y.data), g = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let w;
    return l < 0 ? (w = g, s[g] !== void 0 && (w = s[g])) : w = l, o(w, h);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const y = a(d), h = y[0], g = y[1];
    let w;
    l < 0 ? (w = h, i[h] !== void 0 && (w = i[h])) : w = l;
    let v = w.toString(16);
    return v.length === 1 && (v = `0${v}`), n.encode(g, v);
  }
  t.c32ToB58 = u;
})(S0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Al;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Pr;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = S0;
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
})(ts);
function F2(t, e) {
  switch (e = h0(e ?? d0), t) {
    case In.P2PKH:
      switch (e.transactionVersion) {
        case kn.Mainnet:
          return dn.MainnetSingleSig;
        case kn.Testnet:
          return dn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case In.P2SH:
    case In.P2SHNonSequential:
    case In.P2WPKH:
    case In.P2WSH:
    case In.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case kn.Mainnet:
          return dn.MainnetMultiSig;
        case kn.Testnet:
          return dn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const z2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $0 = Uint8Array.from({ length: 16 }, (t, e) => e), R2 = $0.map((t) => (9 * t + 5) % 16);
let $l = [$0], vl = [R2];
for (let t = 0; t < 4; t++)
  for (let e of [$l, vl])
    e.push(e[t].map((n) => z2[n]));
const v0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), G2 = $l.map((t, e) => t.map((n) => v0[e][n])), K2 = vl.map((t, e) => t.map((n) => v0[e][n])), V2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), q2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vi = (t, e) => t << e | t >>> 32 - e;
function mf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qi = new Uint32Array(16);
let W2 = class extends El {
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
      qi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = V2[h], v = q2[h], _ = $l[h], U = vl[h], b = G2[h], L = K2[h];
      for (let E = 0; E < 16; E++) {
        const D = Vi(r + mf(h, i, a, u) + qi[_[E]] + w, b[E]) + l | 0;
        r = l, l = u, u = Vi(a, 10) | 0, a = i, i = D;
      }
      for (let E = 0; E < 16; E++) {
        const D = Vi(s + mf(g, o, c, d) + qi[U[E]] + v, L[E]) + y | 0;
        s = y, y = d, d = Vi(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    qi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const X2 = Jr(() => new W2()), Wi = BigInt(2 ** 32 - 1), dc = BigInt(32);
function I0(t, e = !1) {
  return e ? { h: Number(t & Wi), l: Number(t >> dc & Wi) } : { h: Number(t >> dc & Wi) | 0, l: Number(t & Wi) | 0 };
}
function Y2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = I0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Z2 = (t, e) => BigInt(t >>> 0) << dc | BigInt(e >>> 0), Q2 = (t, e, n) => t >>> n, J2 = (t, e, n) => t << 32 - n | e >>> n, tm = (t, e, n) => t >>> n | e << 32 - n, em = (t, e, n) => t << 32 - n | e >>> n, nm = (t, e, n) => t << 64 - n | e >>> n - 32, rm = (t, e, n) => t >>> n - 32 | e << 64 - n, sm = (t, e) => e, im = (t, e) => t, om = (t, e, n) => t << n | e >>> 32 - n, am = (t, e, n) => e << n | t >>> 32 - n, cm = (t, e, n) => e << n - 32 | t >>> 64 - n, lm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function um(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const fm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), dm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, hm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), pm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, gm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ym = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ot = {
  fromBig: I0,
  split: Y2,
  toBig: Z2,
  shrSH: Q2,
  shrSL: J2,
  rotrSH: tm,
  rotrSL: em,
  rotrBH: nm,
  rotrBL: rm,
  rotr32H: sm,
  rotr32L: im,
  rotlSH: om,
  rotlSL: am,
  rotlBH: cm,
  rotlBL: lm,
  add: um,
  add3L: fm,
  add3H: dm,
  add4L: hm,
  add4H: pm,
  add5H: ym,
  add5L: gm
}, [wm, bm] = ot.split([
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
].map((t) => BigInt(t))), Vn = new Uint32Array(80), qn = new Uint32Array(80);
let sa = class extends El {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: g, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, h, g, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, h, g, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Vn[b] = e.getUint32(n), qn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = Vn[b - 15] | 0, E = qn[b - 15] | 0, D = ot.rotrSH(L, E, 1) ^ ot.rotrSH(L, E, 8) ^ ot.shrSH(L, E, 7), G = ot.rotrSL(L, E, 1) ^ ot.rotrSL(L, E, 8) ^ ot.shrSL(L, E, 7), j = Vn[b - 2] | 0, K = qn[b - 2] | 0, m = ot.rotrSH(j, K, 19) ^ ot.rotrBH(j, K, 61) ^ ot.shrSH(j, K, 6), k = ot.rotrSL(j, K, 19) ^ ot.rotrBL(j, K, 61) ^ ot.shrSL(j, K, 6), N = ot.add4L(G, k, qn[b - 7], qn[b - 16]), X = ot.add4H(N, D, m, Vn[b - 7], Vn[b - 16]);
      Vn[b] = X | 0, qn[b] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: v, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = ot.rotrSH(l, y, 14) ^ ot.rotrSH(l, y, 18) ^ ot.rotrBH(l, y, 41), E = ot.rotrSL(l, y, 14) ^ ot.rotrSL(l, y, 18) ^ ot.rotrBL(l, y, 41), D = l & h ^ ~l & w, G = y & g ^ ~y & v, j = ot.add5L(U, E, G, bm[b], qn[b]), K = ot.add5H(j, _, L, D, wm[b], Vn[b]), m = j | 0, k = ot.rotrSH(r, s, 28) ^ ot.rotrBH(r, s, 34) ^ ot.rotrBH(r, s, 39), N = ot.rotrSL(r, s, 28) ^ ot.rotrBL(r, s, 34) ^ ot.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      _ = w | 0, U = v | 0, w = h | 0, v = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = ot.add(u | 0, d | 0, K | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = ot.add3L(m, N, nt);
      r = ot.add3H(W, K, k, X), s = W | 0;
    }
    ({ h: r, l: s } = ot.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ot.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ot.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = ot.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = ot.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = ot.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: v } = ot.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: _, l: U } = ot.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, d, l, y, h, g, w, v, _, U);
  }
  roundClean() {
    Vn.fill(0), qn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, mm = class extends sa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, xm = class extends sa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Sm = class extends sa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Jr(() => new sa());
Jr(() => new mm());
Jr(() => new xm());
Jr(() => new Sm());
var To = { exports: {} };
To.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", h = "[object Number]", g = "[object Object]", w = "[object Promise]", v = "[object RegExp]", _ = "[object Set]", U = "[object String]", b = "[object Symbol]", L = "[object WeakMap]", E = "[object ArrayBuffer]", D = "[object DataView]", G = "[object Float32Array]", j = "[object Float64Array]", K = "[object Int8Array]", m = "[object Int16Array]", k = "[object Int32Array]", N = "[object Uint8Array]", X = "[object Uint8ClampedArray]", nt = "[object Uint16Array]", W = "[object Uint32Array]", Nt = /[\\^$.*+?()[\]{}|]/g, bt = /\w*$/, _t = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, M = {};
  M[i] = M[o] = M[E] = M[D] = M[a] = M[c] = M[G] = M[j] = M[K] = M[m] = M[k] = M[y] = M[h] = M[g] = M[v] = M[_] = M[U] = M[b] = M[N] = M[X] = M[nt] = M[W] = !0, M[u] = M[d] = M[L] = !1;
  var I = typeof ge == "object" && ge && ge.Object === Object && ge, H = typeof self == "object" && self && self.Object === Object && self, P = I || H || Function("return this")(), q = e && !e.nodeType && e, et = q && !0 && t && !t.nodeType && t, It = et && et.exports === q;
  function Jt(p, $) {
    return p.set($[0], $[1]), p;
  }
  function ze(p, $) {
    return p.add($), p;
  }
  function jt(p, $) {
    for (var C = -1, Q = p ? p.length : 0; ++C < Q && $(p[C], C, p) !== !1; )
      ;
    return p;
  }
  function ue(p, $) {
    for (var C = -1, Q = $.length, oe = p.length; ++C < Q; )
      p[oe + C] = $[C];
    return p;
  }
  function Ae(p, $, C, Q) {
    for (var oe = -1, be = p ? p.length : 0; ++oe < be; )
      C = $(C, p[oe], oe, p);
    return C;
  }
  function kt(p, $) {
    for (var C = -1, Q = Array(p); ++C < p; )
      Q[C] = $(C);
    return Q;
  }
  function qt(p, $) {
    return p == null ? void 0 : p[$];
  }
  function ne(p) {
    var $ = !1;
    if (p != null && typeof p.toString != "function")
      try {
        $ = !!(p + "");
      } catch {
      }
    return $;
  }
  function Ut(p) {
    var $ = -1, C = Array(p.size);
    return p.forEach(function(Q, oe) {
      C[++$] = [oe, Q];
    }), C;
  }
  function f(p, $) {
    return function(C) {
      return p($(C));
    };
  }
  function A(p) {
    var $ = -1, C = Array(p.size);
    return p.forEach(function(Q) {
      C[++$] = Q;
    }), C;
  }
  var B = Array.prototype, Z = Function.prototype, dt = Object.prototype, $t = P["__core-js_shared__"], se = function() {
    var p = /[^.]+$/.exec($t && $t.keys && $t.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), te = Z.toString, Wt = dt.hasOwnProperty, Qe = dt.toString, wr = RegExp(
    "^" + te.call(Wt).replace(Nt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), _n = It ? P.Buffer : void 0, fe = P.Symbol, $e = P.Uint8Array, Je = f(Object.getPrototypeOf, Object), yt = Object.create, Et = dt.propertyIsEnumerable, Ft = B.splice, we = Object.getOwnPropertySymbols, br = _n ? _n.isBuffer : void 0, Qt = f(Object.keys, Object), Un = ls(P, "DataView"), Ue = ls(P, "Map"), Ne = ls(P, "Promise"), Nn = ls(P, "Set"), tn = ls(P, "WeakMap"), en = ls(Object, "create"), Hn = xr(Un), is = xr(Ue), os = xr(Ne), Y = xr(Nn), rt = xr(tn), x = fe ? fe.prototype : void 0, T = x ? x.valueOf : void 0;
  function V(p) {
    var $ = -1, C = p ? p.length : 0;
    for (this.clear(); ++$ < C; ) {
      var Q = p[$];
      this.set(Q[0], Q[1]);
    }
  }
  function St() {
    this.__data__ = en ? en(null) : {};
  }
  function R(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function Ct(p) {
    var $ = this.__data__;
    if (en) {
      var C = $[p];
      return C === r ? void 0 : C;
    }
    return Wt.call($, p) ? $[p] : void 0;
  }
  function pt(p) {
    var $ = this.__data__;
    return en ? $[p] !== void 0 : Wt.call($, p);
  }
  function Ht(p, $) {
    var C = this.__data__;
    return C[p] = en && $ === void 0 ? r : $, this;
  }
  V.prototype.clear = St, V.prototype.delete = R, V.prototype.get = Ct, V.prototype.has = pt, V.prototype.set = Ht;
  function ie(p) {
    var $ = -1, C = p ? p.length : 0;
    for (this.clear(); ++$ < C; ) {
      var Q = p[$];
      this.set(Q[0], Q[1]);
    }
  }
  function nn() {
    this.__data__ = [];
  }
  function xn(p) {
    var $ = this.__data__, C = Mi($, p);
    if (C < 0)
      return !1;
    var Q = $.length - 1;
    return C == Q ? $.pop() : Ft.call($, C, 1), !0;
  }
  function ve(p) {
    var $ = this.__data__, C = Mi($, p);
    return C < 0 ? void 0 : $[C][1];
  }
  function rn(p) {
    return Mi(this.__data__, p) > -1;
  }
  function _g(p, $) {
    var C = this.__data__, Q = Mi(C, p);
    return Q < 0 ? C.push([p, $]) : C[Q][1] = $, this;
  }
  ie.prototype.clear = nn, ie.prototype.delete = xn, ie.prototype.get = ve, ie.prototype.has = rn, ie.prototype.set = _g;
  function as(p) {
    var $ = -1, C = p ? p.length : 0;
    for (this.clear(); ++$ < C; ) {
      var Q = p[$];
      this.set(Q[0], Q[1]);
    }
  }
  function Ug() {
    this.__data__ = {
      hash: new V(),
      map: new (Ue || ie)(),
      string: new V()
    };
  }
  function Ng(p) {
    return _i(this, p).delete(p);
  }
  function Hg(p) {
    return _i(this, p).get(p);
  }
  function Pg(p) {
    return _i(this, p).has(p);
  }
  function Og(p, $) {
    return _i(this, p).set(p, $), this;
  }
  as.prototype.clear = Ug, as.prototype.delete = Ng, as.prototype.get = Hg, as.prototype.has = Pg, as.prototype.set = Og;
  function cs(p) {
    this.__data__ = new ie(p);
  }
  function Dg() {
    this.__data__ = new ie();
  }
  function jg(p) {
    return this.__data__.delete(p);
  }
  function Fg(p) {
    return this.__data__.get(p);
  }
  function zg(p) {
    return this.__data__.has(p);
  }
  function Rg(p, $) {
    var C = this.__data__;
    if (C instanceof ie) {
      var Q = C.__data__;
      if (!Ue || Q.length < n - 1)
        return Q.push([p, $]), this;
      C = this.__data__ = new as(Q);
    }
    return C.set(p, $), this;
  }
  cs.prototype.clear = Dg, cs.prototype.delete = jg, cs.prototype.get = Fg, cs.prototype.has = zg, cs.prototype.set = Rg;
  function Gg(p, $) {
    var C = Aa(p) || py(p) ? kt(p.length, String) : [], Q = C.length, oe = !!Q;
    for (var be in p)
      Wt.call(p, be) && !(oe && (be == "length" || uy(be, Q))) && C.push(be);
    return C;
  }
  function gu(p, $, C) {
    var Q = p[$];
    (!(Wt.call(p, $) && mu(Q, C)) || C === void 0 && !($ in p)) && (p[$] = C);
  }
  function Mi(p, $) {
    for (var C = p.length; C--; )
      if (mu(p[C][0], $))
        return C;
    return -1;
  }
  function Kg(p, $) {
    return p && yu($, $a($), p);
  }
  function Sa(p, $, C, Q, oe, be, Sn) {
    var me;
    if (Q && (me = be ? Q(p, oe, be, Sn) : Q(p)), me !== void 0)
      return me;
    if (!Ui(p))
      return p;
    var Eu = Aa(p);
    if (Eu) {
      if (me = ay(p), !$)
        return sy(p, me);
    } else {
      var us = mr(p), Au = us == d || us == l;
      if (yy(p))
        return Zg(p, $);
      if (us == g || us == i || Au && !be) {
        if (ne(p))
          return be ? p : {};
        if (me = cy(Au ? {} : p), !$)
          return iy(p, Kg(me, p));
      } else {
        if (!M[us])
          return be ? p : {};
        me = ly(p, us, Sa, $);
      }
    }
    Sn || (Sn = new cs());
    var $u = Sn.get(p);
    if ($u)
      return $u;
    if (Sn.set(p, me), !Eu)
      var vu = C ? oy(p) : $a(p);
    return jt(vu || p, function(va, Ni) {
      vu && (Ni = va, va = p[Ni]), gu(me, Ni, Sa(va, $, C, Q, Ni, p, Sn));
    }), me;
  }
  function Vg(p) {
    return Ui(p) ? yt(p) : {};
  }
  function qg(p, $, C) {
    var Q = $(p);
    return Aa(p) ? Q : ue(Q, C(p));
  }
  function Wg(p) {
    return Qe.call(p);
  }
  function Xg(p) {
    if (!Ui(p) || dy(p))
      return !1;
    var $ = Su(p) || ne(p) ? wr : _t;
    return $.test(xr(p));
  }
  function Yg(p) {
    if (!bu(p))
      return Qt(p);
    var $ = [];
    for (var C in Object(p))
      Wt.call(p, C) && C != "constructor" && $.push(C);
    return $;
  }
  function Zg(p, $) {
    if ($)
      return p.slice();
    var C = new p.constructor(p.length);
    return p.copy(C), C;
  }
  function Ea(p) {
    var $ = new p.constructor(p.byteLength);
    return new $e($).set(new $e(p)), $;
  }
  function Qg(p, $) {
    var C = $ ? Ea(p.buffer) : p.buffer;
    return new p.constructor(C, p.byteOffset, p.byteLength);
  }
  function Jg(p, $, C) {
    var Q = $ ? C(Ut(p), !0) : Ut(p);
    return Ae(Q, Jt, new p.constructor());
  }
  function ty(p) {
    var $ = new p.constructor(p.source, bt.exec(p));
    return $.lastIndex = p.lastIndex, $;
  }
  function ey(p, $, C) {
    var Q = $ ? C(A(p), !0) : A(p);
    return Ae(Q, ze, new p.constructor());
  }
  function ny(p) {
    return T ? Object(T.call(p)) : {};
  }
  function ry(p, $) {
    var C = $ ? Ea(p.buffer) : p.buffer;
    return new p.constructor(C, p.byteOffset, p.length);
  }
  function sy(p, $) {
    var C = -1, Q = p.length;
    for ($ || ($ = Array(Q)); ++C < Q; )
      $[C] = p[C];
    return $;
  }
  function yu(p, $, C, Q) {
    C || (C = {});
    for (var oe = -1, be = $.length; ++oe < be; ) {
      var Sn = $[oe], me = void 0;
      gu(C, Sn, me === void 0 ? p[Sn] : me);
    }
    return C;
  }
  function iy(p, $) {
    return yu(p, wu(p), $);
  }
  function oy(p) {
    return qg(p, $a, wu);
  }
  function _i(p, $) {
    var C = p.__data__;
    return fy($) ? C[typeof $ == "string" ? "string" : "hash"] : C.map;
  }
  function ls(p, $) {
    var C = qt(p, $);
    return Xg(C) ? C : void 0;
  }
  var wu = we ? f(we, Object) : my, mr = Wg;
  (Un && mr(new Un(new ArrayBuffer(1))) != D || Ue && mr(new Ue()) != y || Ne && mr(Ne.resolve()) != w || Nn && mr(new Nn()) != _ || tn && mr(new tn()) != L) && (mr = function(p) {
    var $ = Qe.call(p), C = $ == g ? p.constructor : void 0, Q = C ? xr(C) : void 0;
    if (Q)
      switch (Q) {
        case Hn:
          return D;
        case is:
          return y;
        case os:
          return w;
        case Y:
          return _;
        case rt:
          return L;
      }
    return $;
  });
  function ay(p) {
    var $ = p.length, C = p.constructor($);
    return $ && typeof p[0] == "string" && Wt.call(p, "index") && (C.index = p.index, C.input = p.input), C;
  }
  function cy(p) {
    return typeof p.constructor == "function" && !bu(p) ? Vg(Je(p)) : {};
  }
  function ly(p, $, C, Q) {
    var oe = p.constructor;
    switch ($) {
      case E:
        return Ea(p);
      case a:
      case c:
        return new oe(+p);
      case D:
        return Qg(p, Q);
      case G:
      case j:
      case K:
      case m:
      case k:
      case N:
      case X:
      case nt:
      case W:
        return ry(p, Q);
      case y:
        return Jg(p, Q, C);
      case h:
      case U:
        return new oe(p);
      case v:
        return ty(p);
      case _:
        return ey(p, Q, C);
      case b:
        return ny(p);
    }
  }
  function uy(p, $) {
    return $ = $ ?? s, !!$ && (typeof p == "number" || S.test(p)) && p > -1 && p % 1 == 0 && p < $;
  }
  function fy(p) {
    var $ = typeof p;
    return $ == "string" || $ == "number" || $ == "symbol" || $ == "boolean" ? p !== "__proto__" : p === null;
  }
  function dy(p) {
    return !!se && se in p;
  }
  function bu(p) {
    var $ = p && p.constructor, C = typeof $ == "function" && $.prototype || dt;
    return p === C;
  }
  function xr(p) {
    if (p != null) {
      try {
        return te.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function hy(p) {
    return Sa(p, !0, !0);
  }
  function mu(p, $) {
    return p === $ || p !== p && $ !== $;
  }
  function py(p) {
    return gy(p) && Wt.call(p, "callee") && (!Et.call(p, "callee") || Qe.call(p) == i);
  }
  var Aa = Array.isArray;
  function xu(p) {
    return p != null && wy(p.length) && !Su(p);
  }
  function gy(p) {
    return by(p) && xu(p);
  }
  var yy = br || xy;
  function Su(p) {
    var $ = Ui(p) ? Qe.call(p) : "";
    return $ == d || $ == l;
  }
  function wy(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function Ui(p) {
    var $ = typeof p;
    return !!p && ($ == "object" || $ == "function");
  }
  function by(p) {
    return !!p && typeof p == "object";
  }
  function $a(p) {
    return xu(p) ? Gg(p) : Yg(p);
  }
  function my() {
    return [];
  }
  function xy() {
    return !1;
  }
  t.exports = hy;
})(To, To.exports);
var Em = To.exports;
const L0 = /* @__PURE__ */ eh(Em);
var hc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(hc || (hc = {}));
function Am(t, e) {
  return { type: hc.Address, version: t, hash160: e };
}
function $m(t) {
  return ts.c32address(t.version, t.hash160);
}
const vm = (t) => X2(m0(t)), Im = (t) => tt(vm(t));
Vt.hmacSha256Sync = (t, ...e) => {
  const n = w0.create(m0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Lm(t, e = "mainnet") {
  e = h0(e), t = typeof t == "string" ? xt(t) : t;
  const n = F2(In.P2PKH, e), r = Am(n, Im(t));
  return $m(r);
}
function km(t, e) {
  const n = ae.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Lm(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new ae.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Cm(t, e = null) {
  let n;
  e ? n = km(t, e) : n = ae.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const xf = "_blockstackDidCheckEchoReply", Bm = "echoReply", Tm = "authContinuation";
function Mm(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function _m() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[xf];
  if (typeof e == "boolean")
    return e;
  const n = Mm(t.location.search), r = n[Bm];
  if (r) {
    t[xf] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Tm];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class pc {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new uh();
    else
      throw new Yy("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new tf(e.sessionOptions) : this.store = new tf() : e ? this.store = new Ju(e.sessionOptions) : this.store = new Ju();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Qy().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new tc("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, b2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = w2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = il("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (_m())
        return ws.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ws.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Sw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Hi("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = ae.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await A2(e))
      throw new Hi("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (La(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Zu(s, i.private_key);
          } catch {
            if (ws.warn("Failed decryption of appPrivateKey, will try to use as given"), !Vt.isValidPrivateKey(i.private_key))
              throw new Hi("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Zu(s, c);
          } catch {
            ws.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Hi("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = uw, d;
    La(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), La(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: u0(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, y = i.profile_url;
    if (!l.profile && y) {
      const h = await n(y);
      if (!h.ok)
        l.profile = Object.assign({}, qy);
      else {
        const g = await h.text(), w = JSON.parse(g);
        l.profile = Cm(w[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new tc("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ub(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), fb(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
pc.prototype.makeAuthRequest = pc.prototype.makeAuthRequestToken;
const Um = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Nm = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Um(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!ia(r.id));
  return e.concat(n);
}, ia = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), k0 = "STX_PROVIDER", Or = () => typeof window > "u" ? null : window.localStorage.getItem(k0), Hm = (t) => {
  typeof window < "u" && window.localStorage.setItem(k0, t);
}, Pm = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Om(t, e) {
  const n = {};
  return Object.assign(n, Pm, e), await fetch(t, n);
}
function Dm(t) {
  let e = Om, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function jm(...t) {
  const { fetchLib: e, middlewares: n } = Dm(t);
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
var Us;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Us || (Us = {}));
var Dr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Dr || (Dr = {}));
var Sf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Sf || (Sf = {}));
const Fm = "https://api.mainnet.hiro.so", zm = "https://api.testnet.hiro.so", Rm = "http://localhost:3999", Gm = ["mainnet", "testnet", "devnet", "mocknet"];
class jr {
  constructor(e) {
    this.version = Dr.Mainnet, this.chainId = Us.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Dr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? jm();
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
jr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new gc();
    case "testnet":
      return new yc();
    case "devnet":
      return new Km();
    case "mocknet":
      return new C0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Gm.join(", ")}`);
  }
};
jr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : jr.fromName(t);
class gc extends jr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Fm,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Dr.Mainnet, this.chainId = Us.Mainnet;
  }
}
class yc extends jr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? zm,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Dr.Testnet, this.chainId = Us.Testnet;
  }
}
class C0 extends jr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Rm,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Dr.Testnet, this.chainId = Us.Testnet;
  }
}
const Km = C0;
var Fr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Fr || (Fr = {}));
var Mo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Mo || (Mo = {}));
Fr.Mainnet;
var zr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zr || (zr = {}));
var Rr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Rr || (Rr = {}));
zr.Mainnet;
const Vm = {
  chainId: Fr.Mainnet,
  transactionVersion: zr.Mainnet,
  peerNetworkId: Mo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Rr.MainnetSingleSig,
    multiSig: Rr.MainnetMultiSig
  },
  client: { baseUrl: ah }
}, wc = {
  chainId: Fr.Testnet,
  transactionVersion: zr.Testnet,
  peerNetworkId: Mo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Rr.TestnetSingleSig,
    multiSig: Rr.TestnetMultiSig
  },
  client: { baseUrl: ch }
}, yo = {
  ...wc,
  addressVersion: { ...wc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: lh }
}, qm = {
  ...yo,
  addressVersion: { ...yo.addressVersion },
  client: { ...yo.client }
};
function Wm(t) {
  switch (t) {
    case "mainnet":
      return Vm;
    case "testnet":
      return wc;
    case "devnet":
      return yo;
    case "mocknet":
      return qm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Xm(t) {
  return typeof t == "string" ? Wm(t) : t;
}
function Ym(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ef = /* @__PURE__ */ new Map();
function B0(t, e) {
  const n = Ef.get(t);
  if (n !== void 0)
    return n(e);
  const r = Ym(t);
  return Ef.set(t, r), B0(t, e);
}
let Mt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? xt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return ww(this.readBytes(4), 0);
  }
  readUInt8() {
    return gw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return hw(this.readBytes(2), 0);
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
    if (B0(e, r))
      return r;
    throw n(r);
  }
};
const Zm = 128, Qm = 128, T0 = 16, Cr = 32, bc = 80, oa = 65, Jm = 32, tx = 64, _o = 34, ex = 1 + 16 * 1024 * 1024, nx = 165, rx = 16, sx = 16, ix = 20, ox = sx + 2 + ix, ax = ox + 4, cx = ex + (nx + rx * ax);
var vt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(vt || (vt = {}));
var mc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(mc || (mc = {}));
var Le;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Le || (Le = {}));
const Ua = ["onChainOnly", "offChainOnly", "any"];
Ua[0] + "", Le.OnChainOnly, Ua[1] + "", Le.OffChainOnly, Ua[2] + "", Le.Any, Le.OnChainOnly + "", Le.OnChainOnly, Le.OffChainOnly + "", Le.OffChainOnly, Le.Any + "", Le.Any;
var Uo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Uo || (Uo = {}));
var Pt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Pt || (Pt = {}));
var Gt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Gt || (Gt = {}));
var Bt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Bt || (Bt = {}));
var zt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(zt || (zt = {}));
var oi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(oi || (oi = {}));
var xc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(xc || (xc = {}));
var Sc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Sc || (Sc = {}));
var pe;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(pe || (pe = {}));
var Af;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Af || (Af = {}));
var Ec;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ec || (Ec = {}));
var Ve;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ve || (Ve = {}));
var $f;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})($f || ($f = {}));
let aa = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, bs = class extends aa {
  constructor(e) {
    super(e);
  }
}, de = class extends aa {
  constructor(e) {
    super(e);
  }
}, No = class extends aa {
  constructor(e) {
    super(e);
  }
}, vr = class extends aa {
  constructor(e) {
    super(e);
  }
};
function Ac(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function lx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function M0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ux(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ac(t.outputLen), Ac(t.blockLen);
}
function fx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function dx(t, e) {
  M0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ir = {
  number: Ac,
  bool: lx,
  bytes: M0,
  hash: ux,
  exists: fx,
  output: dx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Na = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), an = (t, e) => t << 32 - e | t >>> e, hx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!hx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function px(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Il(t) {
  if (typeof t == "string" && (t = px(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let _0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function es(t) {
  const e = (r) => t().update(Il(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let U0 = class extends _0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ir.hash(e);
    const r = Il(n);
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
    return Ir.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ir.exists(this), Ir.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const N0 = (t, e, n) => new U0(t, e).update(n).digest();
N0.create = (t, e) => new U0(t, e);
function gx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Ll = class extends _0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Na(this.buffer);
  }
  update(e) {
    Ir.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Il(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Na(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ir.exists(this), Ir.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    gx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Na(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const yx = (t, e, n) => t & e ^ ~t & n, wx = (t, e, n) => t & e ^ t & n ^ e & n, bx = new Uint32Array([
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
]), Wn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xn = new Uint32Array(64);
let H0 = class extends Ll {
  constructor() {
    super(64, 32, 8, !1), this.A = Wn[0] | 0, this.B = Wn[1] | 0, this.C = Wn[2] | 0, this.D = Wn[3] | 0, this.E = Wn[4] | 0, this.F = Wn[5] | 0, this.G = Wn[6] | 0, this.H = Wn[7] | 0;
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
      Xn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Xn[l - 15], h = Xn[l - 2], g = an(y, 7) ^ an(y, 18) ^ y >>> 3, w = an(h, 17) ^ an(h, 19) ^ h >>> 10;
      Xn[l] = w + Xn[l - 7] + g + Xn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = an(a, 6) ^ an(a, 11) ^ an(a, 25), h = d + y + yx(a, c, u) + bx[l] + Xn[l] | 0, w = (an(r, 2) ^ an(r, 13) ^ an(r, 22)) + wx(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Xn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, mx = class extends H0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const kl = es(() => new H0());
es(() => new mx());
const xx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), P0 = Uint8Array.from({ length: 16 }, (t, e) => e), Sx = P0.map((t) => (9 * t + 5) % 16);
let Cl = [P0], Bl = [Sx];
for (let t = 0; t < 4; t++)
  for (let e of [Cl, Bl])
    e.push(e[t].map((n) => xx[n]));
const O0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ex = Cl.map((t, e) => t.map((n) => O0[e][n])), Ax = Bl.map((t, e) => t.map((n) => O0[e][n])), $x = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), vx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Xi = (t, e) => t << e | t >>> 32 - e;
function vf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Yi = new Uint32Array(16);
let Ix = class extends Ll {
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
      Yi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = $x[h], v = vx[h], _ = Cl[h], U = Bl[h], b = Ex[h], L = Ax[h];
      for (let E = 0; E < 16; E++) {
        const D = Xi(r + vf(h, i, a, u) + Yi[_[E]] + w, b[E]) + l | 0;
        r = l, l = u, u = Xi(a, 10) | 0, a = i, i = D;
      }
      for (let E = 0; E < 16; E++) {
        const D = Xi(s + vf(g, o, c, d) + Yi[U[E]] + v, L[E]) + y | 0;
        s = y, y = d, d = Xi(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Yi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Lx = es(() => new Ix()), Zi = BigInt(2 ** 32 - 1), $c = BigInt(32);
function D0(t, e = !1) {
  return e ? { h: Number(t & Zi), l: Number(t >> $c & Zi) } : { h: Number(t >> $c & Zi) | 0, l: Number(t & Zi) | 0 };
}
function kx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = D0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Cx = (t, e) => BigInt(t >>> 0) << $c | BigInt(e >>> 0), Bx = (t, e, n) => t >>> n, Tx = (t, e, n) => t << 32 - n | e >>> n, Mx = (t, e, n) => t >>> n | e << 32 - n, _x = (t, e, n) => t << 32 - n | e >>> n, Ux = (t, e, n) => t << 64 - n | e >>> n - 32, Nx = (t, e, n) => t >>> n - 32 | e << 64 - n, Hx = (t, e) => e, Px = (t, e) => t, Ox = (t, e, n) => t << n | e >>> 32 - n, Dx = (t, e, n) => e << n | t >>> 32 - n, jx = (t, e, n) => e << n - 32 | t >>> 64 - n, Fx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function zx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Rx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Gx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Kx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Vx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, qx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Wx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, at = {
  fromBig: D0,
  split: kx,
  toBig: Cx,
  shrSH: Bx,
  shrSL: Tx,
  rotrSH: Mx,
  rotrSL: _x,
  rotrBH: Ux,
  rotrBL: Nx,
  rotr32H: Hx,
  rotr32L: Px,
  rotlSH: Ox,
  rotlSL: Dx,
  rotlBH: jx,
  rotlBL: Fx,
  add: zx,
  add3L: Rx,
  add3H: Gx,
  add4L: Kx,
  add4H: Vx,
  add5H: Wx,
  add5L: qx
}, [Xx, Yx] = at.split([
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
].map((t) => BigInt(t))), Yn = new Uint32Array(80), Zn = new Uint32Array(80);
let ca = class extends Ll {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: g, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, h, g, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, h, g, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Yn[b] = e.getUint32(n), Zn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = Yn[b - 15] | 0, E = Zn[b - 15] | 0, D = at.rotrSH(L, E, 1) ^ at.rotrSH(L, E, 8) ^ at.shrSH(L, E, 7), G = at.rotrSL(L, E, 1) ^ at.rotrSL(L, E, 8) ^ at.shrSL(L, E, 7), j = Yn[b - 2] | 0, K = Zn[b - 2] | 0, m = at.rotrSH(j, K, 19) ^ at.rotrBH(j, K, 61) ^ at.shrSH(j, K, 6), k = at.rotrSL(j, K, 19) ^ at.rotrBL(j, K, 61) ^ at.shrSL(j, K, 6), N = at.add4L(G, k, Zn[b - 7], Zn[b - 16]), X = at.add4H(N, D, m, Yn[b - 7], Yn[b - 16]);
      Yn[b] = X | 0, Zn[b] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: v, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = at.rotrSH(l, y, 14) ^ at.rotrSH(l, y, 18) ^ at.rotrBH(l, y, 41), E = at.rotrSL(l, y, 14) ^ at.rotrSL(l, y, 18) ^ at.rotrBL(l, y, 41), D = l & h ^ ~l & w, G = y & g ^ ~y & v, j = at.add5L(U, E, G, Yx[b], Zn[b]), K = at.add5H(j, _, L, D, Xx[b], Yn[b]), m = j | 0, k = at.rotrSH(r, s, 28) ^ at.rotrBH(r, s, 34) ^ at.rotrBH(r, s, 39), N = at.rotrSL(r, s, 28) ^ at.rotrBL(r, s, 34) ^ at.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      _ = w | 0, U = v | 0, w = h | 0, v = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = at.add(u | 0, d | 0, K | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = at.add3L(m, N, nt);
      r = at.add3H(W, K, k, X), s = W | 0;
    }
    ({ h: r, l: s } = at.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = at.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = at.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = at.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = at.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = at.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: v } = at.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: _, l: U } = at.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, d, l, y, h, g, w, v, _, U);
  }
  roundClean() {
    Yn.fill(0), Zn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Zx = class extends ca {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Qx = class extends ca {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Jx = class extends ca {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
es(() => new ca());
es(() => new Zx());
const tS = es(() => new Qx());
es(() => new Jx());
var gt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(gt || (gt = {}));
var ee;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ee || (ee = {}));
function Tl(t) {
  return ee[t];
}
const eS = () => ({ type: gt.BoolTrue }), nS = () => ({ type: gt.BoolFalse }), rS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: gt.Buffer, value: tt(t) };
}, If = BigInt("0xffffffffffffffffffffffffffffffff"), sS = BigInt(0), Lf = BigInt("0x7fffffffffffffffffffffffffffffff"), kf = BigInt("-170141183460469231731687303715884105728"), iS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = nc(xt(t))), Ee(t, Uint8Array) && (t = nc(t));
  const e = le(t);
  if (e > Lf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Lf}`);
  if (e < kf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${kf}`);
  return { type: gt.Int, value: e };
}, oS = (t) => {
  const e = le(t);
  if (e < sS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > If)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${If}`);
  return { type: gt.UInt, value: e };
};
function aS(t) {
  return { type: gt.List, value: t };
}
function j0() {
  return { type: gt.OptionalNone };
}
function F0(t) {
  return { type: gt.OptionalSome, value: t };
}
var z;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(z || (z = {}));
function cS() {
  return {
    type: z.Address,
    version: Rr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Cf(t) {
  if (t && Y0(t, _o))
    throw new Error(`Memo exceeds maximum length of ${_o} bytes`);
  return { type: z.MemoString, content: t };
}
function Ml(t, e) {
  return {
    type: z.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function vc(t) {
  if (xt(t).byteLength != oa)
    throw Error("Invalid signature");
  return {
    type: z.MessageSignature,
    data: t
  };
}
function lS(t, e, n) {
  return typeof t == "string" && (t = vS(t)), typeof n == "string" && (n = Cf(n)), {
    type: z.Payload,
    payloadType: vt.TokenTransfer,
    recipient: t,
    amount: le(e),
    memo: n ?? Cf("")
  };
}
function uS(t, e, n, r) {
  return typeof e == "string" && (e = Ye(e)), typeof n == "string" && (n = Ye(n)), {
    type: z.Payload,
    payloadType: vt.ContractCall,
    contractAddress: typeof t == "string" ? yr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function fS(t) {
  return Ye(t, 4, 1e5);
}
function Bf(t, e, n) {
  return typeof t == "string" && (t = Ye(t)), typeof e == "string" && (e = fS(e)), typeof n == "number" ? {
    type: z.Payload,
    payloadType: vt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: z.Payload,
    payloadType: vt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function dS() {
  return { type: z.Payload, payloadType: vt.PoisonMicroblock };
}
function Tf(t, e) {
  if (t.byteLength != Cr)
    throw Error(`Coinbase buffer size must be ${Cr} bytes`);
  return e != null ? {
    type: z.Payload,
    payloadType: vt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: z.Payload,
    payloadType: vt.Coinbase,
    coinbaseBytes: t
  };
}
function hS(t, e, n) {
  if (t.byteLength != Cr)
    throw Error(`Coinbase buffer size must be ${Cr} bytes`);
  if (n.byteLength != bc)
    throw Error(`VRF proof buffer size must be ${bc} bytes`);
  return {
    type: z.Payload,
    payloadType: vt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === gt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function pS(t, e, n, r, s, i, o) {
  return {
    type: z.Payload,
    payloadType: vt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Ye(t, e, n) {
  const r = e || 1, s = n || Zm;
  if (Y0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: z.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function gS(t, e, n) {
  return {
    type: z.Asset,
    address: yr(t),
    contractName: Ye(e),
    assetName: Ye(n)
  };
}
function yr(t) {
  const e = ts.c32addressDecode(t);
  return {
    type: z.Address,
    version: e[0],
    hash160: e[1]
  };
}
function yS(t, e) {
  const n = yr(t), r = Ye(e);
  return {
    type: z.Principal,
    prefix: pe.Contract,
    address: n,
    contractName: r
  };
}
function wS(t) {
  const e = yr(t);
  return {
    type: z.Principal,
    prefix: pe.Standard,
    address: e
  };
}
function ms(t, e) {
  return {
    pubKeyEncoding: t,
    type: z.TransactionAuthField,
    contents: e
  };
}
function An(t) {
  switch (t.type) {
    case z.Address:
      return Ci(t);
    case z.Principal:
      return z0(t);
    case z.LengthPrefixedString:
      return Hs(t);
    case z.MemoString:
      return mS(t);
    case z.Asset:
      return G0(t);
    case z.PostCondition:
      return V0(t);
    case z.PublicKey:
      return kc(t);
    case z.LengthPrefixedList:
      return _l(t);
    case z.Payload:
      return q0(t);
    case z.TransactionAuthField:
      return $S(t);
    case z.MessageSignature:
      return Ul(t);
  }
}
function Ci(t) {
  const e = [];
  return e.push(xt(Ai(t.version, 1))), e.push(xt(t.hash160)), Yt(e);
}
function Ns(t) {
  const e = Ee(t, Mt) ? t : new Mt(t), n = qo(tt(e.readBytes(1))), r = tt(e.readBytes(20));
  return { type: z.Address, version: n, hash160: r };
}
function z0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === pe.Standard || t.prefix === pe.Contract) && e.push(Ci(t.address)), t.prefix === pe.Contract && e.push(Hs(t.contractName)), Yt(e);
}
function bS(t) {
  const e = Ee(t, Mt) ? t : new Mt(t), n = e.readUInt8Enum(pe, (i) => {
    throw new de(`Unexpected Principal payload type: ${i}`);
  });
  if (n === pe.Origin)
    return { type: z.Principal, prefix: n };
  const r = Ns(e);
  if (n === pe.Standard)
    return { type: z.Principal, prefix: n, address: r };
  const s = De(e);
  return {
    type: z.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Hs(t) {
  const e = [], n = Yr(t.content), r = n.byteLength;
  return e.push(xt(Ai(r, t.lengthPrefixBytes))), e.push(n), Yt(e);
}
function De(t, e, n) {
  e = e || 1;
  const r = Ee(t, Mt) ? t : new Mt(t), s = qo(tt(r.readBytes(e))), i = $i(r.readBytes(s));
  return Ye(i, e, n ?? 128);
}
function mS(t) {
  const e = [], n = Yr(t.content), r = qS(tt(n), _o * 2);
  return e.push(xt(r)), Yt(e);
}
function R0(t) {
  const e = Ee(t, Mt) ? t : new Mt(t);
  let n = $i(e.readBytes(_o));
  return n = n.replace(/\u0000*$/, ""), { type: z.MemoString, content: n };
}
function G0(t) {
  const e = [];
  return e.push(Ci(t.address)), e.push(Hs(t.contractName)), e.push(Hs(t.assetName)), Yt(e);
}
function Ic(t) {
  const e = Ee(t, Mt) ? t : new Mt(t);
  return {
    type: z.Asset,
    address: Ns(e),
    contractName: De(e),
    assetName: De(e)
  };
}
function _l(t) {
  const e = t.values, n = [];
  n.push(xt(Ai(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(An(r));
  return Yt(n);
}
function K0(t, e, n) {
  const r = Ee(t, Mt) ? t : new Mt(t), s = qo(tt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case z.Address:
        i.push(Ns(r));
        break;
      case z.LengthPrefixedString:
        i.push(De(r));
        break;
      case z.MemoString:
        i.push(R0(r));
        break;
      case z.Asset:
        i.push(Ic(r));
        break;
      case z.PostCondition:
        i.push(SS(r));
        break;
      case z.PublicKey:
        i.push(Cc(r));
        break;
      case z.TransactionAuthField:
        i.push(AS(r));
        break;
    }
  return Ml(i, n);
}
function xS(t) {
  return tt(V0(t));
}
function V0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(z0(t.principal)), (t.conditionType === Pt.Fungible || t.conditionType === Pt.NonFungible) && e.push(G0(t.asset)), t.conditionType === Pt.NonFungible && e.push(hn(t.assetName)), e.push(t.conditionCode), t.conditionType === Pt.STX || t.conditionType === Pt.Fungible || t.conditionType === Pt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new bs("The post-condition amount may not be larger than 8 bytes");
    e.push(pr(t.amount, 8));
  }
  return Yt(e);
}
function SS(t) {
  const e = Ee(t, Mt) ? t : new Mt(t), n = e.readUInt8Enum(Pt, (a) => {
    throw new de(`Could not read ${a} as PostConditionType`);
  }), r = bS(e);
  let s, i, o;
  switch (n) {
    case Pt.STX:
      return s = e.readUInt8Enum(oi, (c) => {
        throw new de(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${tt(e.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Pt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Pt.Fungible:
      return i = Ic(e), s = e.readUInt8Enum(oi, (c) => {
        throw new de(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${tt(e.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Pt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Pt.NonFungible:
      i = Ic(e);
      const a = fn(e);
      return s = e.readUInt8Enum(xc, (c) => {
        throw new de(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: z.PostCondition,
        conditionType: Pt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Pt.Staking:
      return s = e.readUInt8Enum(oi, (c) => {
        throw new de(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${tt(e.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Pt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Pt.PoX: {
      const c = e.readUInt8Enum(Sc, (u) => {
        throw new de(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: z.PostCondition,
        conditionType: Pt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function q0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case vt.TokenTransfer:
      e.push(hn(t.recipient)), e.push(pr(t.amount, 8)), e.push(An(t.memo));
      break;
    case vt.ContractCall:
      e.push(An(t.contractAddress)), e.push(An(t.contractName)), e.push(An(t.functionName));
      const n = new Uint8Array(4);
      _r(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(hn(r));
      });
      break;
    case vt.SmartContract:
      e.push(An(t.contractName)), e.push(An(t.codeBody));
      break;
    case vt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(An(t.contractName)), e.push(An(t.codeBody));
      break;
    case vt.PoisonMicroblock:
      break;
    case vt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case vt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(hn(t.recipient));
      break;
    case vt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(hn(t.recipient ? F0(t.recipient) : j0())), e.push(t.vrfProof);
      break;
    case vt.TenureChange:
      e.push(xt(t.tenureHash)), e.push(xt(t.previousTenureHash)), e.push(xt(t.burnViewHash)), e.push(xt(t.previousTenureEnd)), e.push(_r(new Uint8Array(4), t.previousTenureBlocks)), e.push(yw(new Uint8Array(1), t.cause)), e.push(xt(t.publicKeyHash));
      break;
  }
  return Yt(e);
}
function ES(t) {
  const e = Ee(t, Mt) ? t : new Mt(t);
  switch (e.readUInt8Enum(vt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case vt.TokenTransfer:
      const r = fn(e), s = le(e.readBytes(8)), i = R0(e);
      return lS(r, s, i);
    case vt.ContractCall:
      const o = Ns(e), a = De(e), c = De(e), u = [], d = e.readUInt32BE();
      for (let L = 0; L < d; L++) {
        const E = fn(e);
        u.push(E);
      }
      return uS(o, a, c, u);
    case vt.SmartContract:
      const l = De(e), y = De(e, 4, 1e5);
      return Bf(l, y);
    case vt.VersionedSmartContract: {
      const L = e.readUInt8Enum(mc, (G) => {
        throw new Error(`Cannot recognize ClarityVersion: ${G}`);
      }), E = De(e), D = De(e, 4, cx);
      return Bf(E, D, L);
    }
    case vt.PoisonMicroblock:
      return dS();
    case vt.Coinbase: {
      const L = e.readBytes(Cr);
      return Tf(L);
    }
    case vt.CoinbaseToAltRecipient: {
      const L = e.readBytes(Cr), E = fn(e);
      return Tf(L, E);
    }
    case vt.NakamotoCoinbase: {
      const L = e.readBytes(Cr), E = fn(e), D = e.readBytes(bc);
      return hS(L, E, D);
    }
    case vt.TenureChange:
      const h = tt(e.readBytes(20)), g = tt(e.readBytes(20)), w = tt(e.readBytes(20)), v = tt(e.readBytes(32)), _ = e.readUInt32BE(), U = e.readUInt8Enum(Ec, (L) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${L}`);
      }), b = tt(e.readBytes(20));
      return pS(h, g, w, v, _, U, b);
  }
}
function Lc(t) {
  const e = Ee(t, Mt) ? t : new Mt(t);
  return vc(tt(e.readBytes(oa)));
}
function AS(t) {
  const e = Ee(t, Mt) ? t : new Mt(t), n = e.readUInt8Enum(Ve, (r) => {
    throw new de(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Ve.PublicKeyCompressed:
      return ms(zt.Compressed, Cc(e));
    case Ve.PublicKeyUncompressed:
      return ms(zt.Uncompressed, Vs(s3(Cc(e).data)));
    case Ve.SignatureCompressed:
      return ms(zt.Compressed, Lc(e));
    case Ve.SignatureUncompressed:
      return ms(zt.Uncompressed, Lc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Ul(t) {
  return xt(t.data);
}
function $S(t) {
  const e = [];
  switch (t.contents.type) {
    case z.PublicKey:
      e.push(t.pubKeyEncoding === zt.Compressed ? Ve.PublicKeyCompressed : Ve.PublicKeyUncompressed), e.push(xt(r3(t.contents.data)));
      break;
    case z.MessageSignature:
      e.push(t.pubKeyEncoding === zt.Compressed ? Ve.SignatureCompressed : Ve.SignatureUncompressed), e.push(Ul(t.contents));
      break;
  }
  return Yt(e);
}
function kc(t) {
  return t.data.slice();
}
function Cc(t) {
  const e = Ee(t, Mt) ? t : new Mt(t), n = e.readUInt8(), r = n === 4 ? tx : Jm;
  return Vs(Yt([n, e.readBytes(r)]));
}
function Nl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Bt.P2PKH || e === Bt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Bt.P2WPKH || e === Bt.P2WSH || e === Bt.P2WSHNonSequential) && !r.map((s) => s.data).every(qs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Bt.P2PKH:
      return Qi(t, WS(r[0].data));
    case Bt.P2WPKH:
      return Qi(t, XS(r[0].data));
    case Bt.P2SH:
    case Bt.P2SHNonSequential:
      return Qi(t, YS(n, r.map(kc)));
    case Bt.P2WSH:
    case Bt.P2WSHNonSequential:
      return Qi(t, ZS(n, r.map(kc)));
  }
}
function Qi(t, e) {
  return { type: z.Address, version: t, hash160: e };
}
function Hl(t) {
  return ts.c32address(t.version, t.hash160);
}
function Mf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return gS(e, n, r);
}
function ti(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return yS(e, n);
  } else
    return wS(t);
}
function vS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return kS(e, n);
  } else
    return IS(t);
}
function IS(t) {
  const e = yr(t);
  return { type: gt.PrincipalStandard, value: Hl(e) };
}
function LS(t) {
  return { type: gt.PrincipalStandard, value: Hl(t) };
}
function kS(t, e) {
  const n = yr(t), r = Ye(e);
  return W0(n, r);
}
function W0(t, e) {
  if (Yr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: gt.PrincipalContract,
    value: `${Hl(t)}.${e.content}`
  };
}
function CS(t) {
  return { type: gt.ResponseErr, value: t };
}
function BS(t) {
  return { type: gt.ResponseOk, value: t };
}
const TS = (t) => ({ type: gt.StringASCII, value: t }), MS = (t) => ({ type: gt.StringUTF8, value: t });
function _S(t) {
  for (const e in t)
    if (!QS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: gt.Tuple, value: t };
}
function fn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Mt(xt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Mt(t) : e = t;
  switch (e.readUInt8Enum(ee, (r) => {
    throw new de(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ee.int:
      return iS(nc(e.readBytes(16)));
    case ee.uint:
      return oS(e.readBytes(16));
    case ee.buffer:
      const r = e.readUInt32BE();
      return rS(e.readBytes(r));
    case ee.true:
      return eS();
    case ee.false:
      return nS();
    case ee.address:
      const s = Ns(e);
      return LS(s);
    case ee.contract:
      const i = Ns(e), o = De(e);
      return W0(i, o);
    case ee.ok:
      return BS(fn(e));
    case ee.err:
      return CS(fn(e));
    case ee.none:
      return j0();
    case ee.some:
      return F0(fn(e));
    case ee.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(fn(e));
      return aS(c);
    case ee.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let w = 0; w < u; w++) {
        const v = De(e).content;
        if (v === void 0)
          throw new de('"content" is undefined');
        d[v] = fn(e);
      }
      return _S(d);
    case ee.ascii:
      const l = e.readUInt32BE(), y = cw(e.readBytes(l));
      return TS(y);
    case ee.utf8:
      const h = e.readUInt32BE(), g = $i(e.readBytes(h));
      return MS(g);
    default:
      throw new de("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function wn(t, e) {
  return Yt([Tl(t), e]);
}
function US(t) {
  return new Uint8Array([Tl(t.type)]);
}
function NS(t) {
  return t.type === gt.OptionalNone ? new Uint8Array([Tl(t.type)]) : wn(t.type, hn(t.value));
}
function HS(t) {
  const e = new Uint8Array(4);
  return _r(e, Math.ceil(t.value.length / 2), 0), wn(t.type, gn(e, xt(t.value)));
}
function PS(t) {
  const e = ol(rw(BigInt(t.value), BigInt(Qm)), T0);
  return wn(t.type, e);
}
function OS(t) {
  const e = ol(BigInt(t.value), T0);
  return wn(t.type, e);
}
function DS(t) {
  return wn(t.type, Ci(yr(t.value)));
}
function jS(t) {
  const [e, n] = JS(t.value);
  return wn(t.type, gn(Ci(yr(e)), Hs(Ye(n))));
}
function FS(t) {
  return wn(t.type, hn(t.value));
}
function zS(t) {
  const e = [], n = new Uint8Array(4);
  _r(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = hn(r);
    e.push(s);
  }
  return wn(t.type, Yt(e));
}
function RS(t) {
  const e = [], n = new Uint8Array(4);
  _r(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ye(s);
    e.push(Hs(i));
    const o = hn(t.value[s]);
    e.push(o);
  }
  return wn(t.type, Yt(e));
}
function X0(t, e) {
  const n = [], r = e == "ascii" ? aw(t.value) : Yr(t.value), s = new Uint8Array(4);
  return _r(s, r.length, 0), n.push(s), n.push(r), wn(t.type, Yt(n));
}
function GS(t) {
  return X0(t, "ascii");
}
function KS(t) {
  return X0(t, "utf8");
}
function _f(t) {
  return tt(hn(t));
}
function hn(t) {
  switch (t.type) {
    case gt.BoolTrue:
    case gt.BoolFalse:
      return US(t);
    case gt.OptionalNone:
    case gt.OptionalSome:
      return NS(t);
    case gt.Buffer:
      return HS(t);
    case gt.UInt:
      return OS(t);
    case gt.Int:
      return PS(t);
    case gt.PrincipalStandard:
      return DS(t);
    case gt.PrincipalContract:
      return jS(t);
    case gt.ResponseOk:
    case gt.ResponseErr:
      return FS(t);
    case gt.List:
      return zS(t);
    case gt.Tuple:
      return RS(t);
    case gt.StringASCII:
      return GS(t);
    case gt.StringUTF8:
      return KS(t);
    default:
      throw new bs("Unable to serialize. Invalid Clarity Value.");
  }
}
const VS = (t) => t.length % 2 ? `0${t}` : t, qS = (t, e) => t.padEnd(e, "0"), Y0 = (t, e) => t ? Yr(t).length > e : !1;
function Bc(t) {
  return L0(t);
}
const di = (t) => Lx(kl(t)), Pl = (t) => tt(tS(t)), WS = (t) => tt(di(t)), XS = (t) => {
  const e = di(t), n = gn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = di(n);
  return tt(r);
}, YS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Yt(n), s = di(r);
  return tt(s);
}, ZS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Yt(n), s = kl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Yt(i), a = di(o);
  return tt(a);
};
function QS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function JS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Vt.hmacSha256Sync = (t, ...e) => {
  const n = N0.create(kl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Vs(t) {
  return t = typeof t == "string" ? xt(t) : t, {
    type: z.PublicKey,
    data: t
  };
}
function t3(t, e, n = zt.Compressed) {
  const r = dw(e), s = new Te(Mu(r.r), Mu(r.s)), i = ft.fromSignature(t, s, r.recoveryId), o = n === zt.Compressed;
  return i.toHex(o);
}
function e3(t) {
  return typeof t == "string" ? t : tt(t);
}
const Ol = e3;
function Z0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === fw;
}
function qs(t) {
  return !Ol(t).startsWith("04");
}
function n3(t) {
  t = al(t);
  const e = Z0(t);
  return tt(vi(t.slice(0, 32), e));
}
function r3(t) {
  return ft.fromHex(Ol(t)).toHex(!0);
}
function s3(t) {
  return ft.fromHex(Ol(t)).toHex(!1);
}
function i3(t, e) {
  t = al(t);
  const [n, r] = Xo(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ai(r, 1) + Te.fromHex(n).toCompactHex();
}
function Dl() {
  return {
    type: z.MessageSignature,
    data: tt(new Uint8Array(oa))
  };
}
function Q0(t, e, n, r) {
  const s = Nl(0, t, 1, [Vs(e)]).hash160, i = qs(e) ? zt.Compressed : zt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: le(n),
    fee: le(r),
    keyEncoding: i,
    signature: Dl()
  };
}
function hi(t) {
  return "signature" in t;
}
function Uf(t) {
  return t === Bt.P2SH || t === Bt.P2WSH;
}
function o3(t) {
  return t === Bt.P2SHNonSequential || t === Bt.P2WSHNonSequential;
}
function Nf(t) {
  const e = Bc(t);
  return e.nonce = 0, e.fee = 0, hi(e) ? e.signature = Dl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function a3(t) {
  const e = [
    t.hashMode,
    xt(t.signer),
    pr(t.nonce, 8),
    pr(t.fee, 8),
    t.keyEncoding,
    Ul(t.signature)
  ];
  return Yt(e);
}
function c3(t) {
  const e = [
    t.hashMode,
    xt(t.signer),
    pr(t.nonce, 8),
    pr(t.fee, 8)
  ], n = Ml(t.fields);
  e.push(_l(n));
  const r = new Uint8Array(2);
  return pw(r, t.signaturesRequired, 0), e.push(r), Yt(e);
}
function l3(t, e) {
  const n = tt(e.readBytes(20)), r = BigInt(`0x${tt(e.readBytes(8))}`), s = BigInt(`0x${tt(e.readBytes(8))}`), i = e.readUInt8Enum(zt, (a) => {
    throw new de(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Bt.P2WPKH && i != zt.Compressed)
    throw new de("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Lc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function u3(t, e) {
  const n = tt(e.readBytes(20)), r = BigInt("0x" + tt(e.readBytes(8))), s = BigInt("0x" + tt(e.readBytes(8))), i = K0(e, z.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case z.PublicKey:
        qs(u.contents.data) || (o = !0);
        break;
      case z.MessageSignature:
        if (u.pubKeyEncoding === zt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new vr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Bt.P2WSH || t === Bt.P2WSHNonSequential))
    throw new vr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ha(t) {
  return hi(t) ? a3(t) : c3(t);
}
function Pa(t) {
  const e = t.readUInt8Enum(Bt, (n) => {
    throw new de(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Bt.P2PKH || e === Bt.P2WPKH ? l3(e, t) : u3(e, t);
}
function J0(t, e, n, r) {
  const i = t + tt(new Uint8Array([e])) + tt(pr(n, 8)) + tt(pr(r, 8));
  if (xt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Pl(xt(i));
}
function tp(t, e, n) {
  const r = 33 + oa, s = qs(e.data) ? zt.Compressed : zt.Uncompressed, i = t + VS(s.toString(16)) + n, o = xt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Pl(o);
}
function f3(t, e, n, r, s) {
  const i = J0(t, e, n, r), o = i3(s, i), a = Vs(n3(s)), c = tp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function ep(t, e, n, r, s, i) {
  const o = J0(t, e, n, r), a = Vs(t3(o, i, s)), c = tp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function d3() {
  const t = Q0(Bt.P2PKH, "", 0, 0);
  return t.signer = cS().hash160, t.keyEncoding = zt.Compressed, t.signature = Dl(), t;
}
function Hf(t, e, n) {
  return hi(t) ? h3(t, e, n) : p3(t, e, n);
}
function h3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = ep(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Nl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new vr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function p3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case z.PublicKey:
        qs(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case z.MessageSignature:
        c.pubKeyEncoding === zt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = ep(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Uf(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new vr("Too many signatures");
        break;
    }
  if (Uf(t.hashMode) && o !== t.signaturesRequired || o3(t.hashMode) && o < t.signaturesRequired)
    throw new vr("Incorrect number of signatures");
  if (i && (t.hashMode === Bt.P2WSH || t.hashMode === Bt.P2WSHNonSequential))
    throw new vr("Uncompressed keys are not allowed in this hash mode");
  const a = Nl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new vr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function np(t) {
  return {
    authType: Gt.Standard,
    spendingCondition: t
  };
}
function rp(t, e) {
  return {
    authType: Gt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Q0(Bt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Pf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Gt.Standard:
        return np(Nf(t.spendingCondition));
      case Gt.Sponsored:
        return rp(Nf(t.spendingCondition), d3());
      default:
        throw new No("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function g3(t, e) {
  switch (t.authType) {
    case Gt.Standard:
      return Hf(t.spendingCondition, e, Gt.Standard);
    case Gt.Sponsored:
      return Hf(t.spendingCondition, e, Gt.Standard);
    default:
      throw new No("Invalid origin auth type");
  }
}
function y3(t, e) {
  switch (t.authType) {
    case Gt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: le(e)
      };
      return { ...t, spendingCondition: n };
    case Gt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: le(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function w3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: le(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function b3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: le(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function m3(t, e) {
  const n = {
    ...e,
    nonce: le(e.nonce),
    fee: le(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function x3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Gt.Standard:
      e.push(Ha(t.spendingCondition));
      break;
    case Gt.Sponsored:
      e.push(Ha(t.spendingCondition)), e.push(Ha(t.sponsorSpendingCondition));
      break;
  }
  return Yt(e);
}
function S3(t) {
  const e = t.readUInt8Enum(Gt, (r) => {
    throw new de(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Gt.Standard:
      return n = Pa(t), np(n);
    case Gt.Sponsored:
      n = Pa(t);
      const r = Pa(t);
      return rp(n, r);
  }
}
class E3 {
  constructor({ auth: e, payload: n, postConditions: r = Ml([]), postConditionMode: s = Uo.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Xm(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: le(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Le.Any;
  }
  signBegin() {
    const e = Bc(this);
    return e.auth = Pf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Bc(this);
    return e.auth = Pf(e.auth), e.txid();
  }
  verifyOrigin() {
    return g3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Gt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Gt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Gt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Vs(e), r = this.auth.spendingCondition;
    if (r && !hi(r)) {
      const s = qs(n.data);
      r.fields.push(ms(s ? zt.Compressed : zt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = f3(n, r, e.fee, e.nonce, s);
    if (hi(e))
      e.signature = vc(i);
    else {
      const a = Z0(s);
      e.fields.push(ms(a ? zt.Compressed : zt.Uncompressed, vc(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Pl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Gt.Sponsored)
      throw new No("Cannot sponsor sign a non-sponsored transaction");
    this.auth = m3(this.auth, e);
  }
  setFee(e) {
    this.auth = y3(this.auth, e);
  }
  setNonce(e) {
    this.auth = w3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Gt.Sponsored)
      throw new No("Cannot sponsor sign a non-sponsored transaction");
    this.auth = b3(this.auth, e);
  }
  serialize() {
    return tt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new bs('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new bs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new bs('"auth" is undefined');
    if (this.payload === void 0)
      throw new bs('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return _r(n, this.chainId, 0), e.push(n), e.push(x3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(_l(this.postConditions)), e.push(q0(this.payload)), Yt(e);
  }
}
function A3(t) {
  const e = Ee(t, Mt) ? t : new Mt(t), n = e.readUInt8Enum(zr, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = S3(e), i = e.readUInt8Enum(Le, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Uo, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = K0(e, z.PostCondition), c = ES(e), u = new E3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Of = BigInt("18446744073709551615");
function Oa(t) {
  const e = le(t);
  if (e < 0n || e > Of)
    throw new RangeError(`Post-condition amount must be between 0 and ${Of} (u64 max), received: ${e}`);
  return e;
}
var Tc;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Tc || (Tc = {}));
var Mc;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Mc || (Mc = {}));
function $3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Pt.STX,
        principal: t.address === "origin" ? { type: z.Principal, prefix: pe.Origin } : ti(t.address),
        conditionCode: Ji(t.condition),
        amount: Oa(t.amount)
      };
    case "ft-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Pt.Fungible,
        principal: t.address === "origin" ? { type: z.Principal, prefix: pe.Origin } : ti(t.address),
        conditionCode: Ji(t.condition),
        amount: Oa(t.amount),
        asset: Mf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Pt.NonFungible,
        principal: t.address === "origin" ? { type: z.Principal, prefix: pe.Origin } : ti(t.address),
        conditionCode: Ji(t.condition),
        asset: Mf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Pt.Staking,
        principal: t.address === "origin" ? { type: z.Principal, prefix: pe.Origin } : ti(t.address),
        conditionCode: Ji(t.condition),
        amount: Oa(t.amount)
      };
    case "pox-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Pt.PoX,
        principal: t.address === "origin" ? { type: z.Principal, prefix: pe.Origin } : ti(t.address),
        conditionCode: v3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Ji(t) {
  return Tc[t];
}
function v3(t) {
  return Mc[t];
}
function sp(t) {
  const e = $3(t);
  return xS(e);
}
function I3(t, e, n) {
  return Fl(ip(t), n);
}
function ip(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = pi(r);
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
    return BigInt(`0x${C3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function jl(t, e = 8) {
  return (typeof t == "bigint" ? t : ip(t)).toString(16).padStart(e * 2, "0");
}
function Fl(t, e = 16) {
  const n = jl(t, e);
  return pi(n);
}
function L3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const k3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function C3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += k3[n];
  return e;
}
function pi(t) {
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
function zl(t) {
  return new TextEncoder().encode(t);
}
function B3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function T3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Df(t) {
  if (t.some(T3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Rl(...t) {
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
function Mn(t) {
  return Rl(...t.map((e) => typeof e == "number" ? Df([e]) : e instanceof Array ? Df(e) : e));
}
function la(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var _c;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(_c || (_c = {}));
_c.Mainnet;
const M3 = 128, _3 = 128, op = 16;
var Uc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Uc || (Uc = {}));
var jf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(jf || (jf = {}));
var Ff;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ff || (Ff = {}));
var Ke;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ke || (Ke = {}));
const Da = ["onChainOnly", "offChainOnly", "any"];
Da[0] + "", Ke.OnChainOnly, Da[1] + "", Ke.OffChainOnly, Da[2] + "", Ke.Any, Ke.OnChainOnly + "", Ke.OnChainOnly, Ke.OffChainOnly + "", Ke.OffChainOnly, Ke.Any + "", Ke.Any;
var Nc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Nc || (Nc = {}));
Nc.Mainnet;
var zf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(zf || (zf = {}));
var Sr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Sr || (Sr = {}));
var Rf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Rf || (Rf = {}));
var Gf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Gf || (Gf = {}));
var Kf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Kf || (Kf = {}));
var Vf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Vf || (Vf = {}));
var qf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(qf || (qf = {}));
var Wf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Wf || (Wf = {}));
var Hc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Hc || (Hc = {}));
var Xf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Xf || (Xf = {}));
var Yf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Yf || (Yf = {}));
function Pc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function U3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ap(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function N3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Pc(t.outputLen), Pc(t.blockLen);
}
function H3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function P3(t, e) {
  ap(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ja = {
  number: Pc,
  bool: U3,
  bytes: ap,
  hash: N3,
  exists: H3,
  output: P3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Fa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), cn = (t, e) => t << 32 - e | t >>> e, O3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!O3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function D3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function cp(t) {
  if (typeof t == "string" && (t = D3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let j3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ns(t) {
  const e = (r) => t().update(cp(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function F3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Gl = class extends j3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Fa(this.buffer);
  }
  update(e) {
    ja.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = cp(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Fa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ja.exists(this), ja.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    F3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Fa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const z3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), lp = Uint8Array.from({ length: 16 }, (t, e) => e), R3 = lp.map((t) => (9 * t + 5) % 16);
let Kl = [lp], Vl = [R3];
for (let t = 0; t < 4; t++)
  for (let e of [Kl, Vl])
    e.push(e[t].map((n) => z3[n]));
const up = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), G3 = Kl.map((t, e) => t.map((n) => up[e][n])), K3 = Vl.map((t, e) => t.map((n) => up[e][n])), V3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), q3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), to = (t, e) => t << e | t >>> 32 - e;
function Zf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const eo = new Uint32Array(16);
let W3 = class extends Gl {
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
      eo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = V3[h], v = q3[h], _ = Kl[h], U = Vl[h], b = G3[h], L = K3[h];
      for (let E = 0; E < 16; E++) {
        const D = to(r + Zf(h, i, a, u) + eo[_[E]] + w, b[E]) + l | 0;
        r = l, l = u, u = to(a, 10) | 0, a = i, i = D;
      }
      for (let E = 0; E < 16; E++) {
        const D = to(s + Zf(g, o, c, d) + eo[U[E]] + v, L[E]) + y | 0;
        s = y, y = d, d = to(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    eo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ns(() => new W3());
const X3 = (t, e, n) => t & e ^ ~t & n, Y3 = (t, e, n) => t & e ^ t & n ^ e & n, Z3 = new Uint32Array([
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
]), Qn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jn = new Uint32Array(64);
let fp = class extends Gl {
  constructor() {
    super(64, 32, 8, !1), this.A = Qn[0] | 0, this.B = Qn[1] | 0, this.C = Qn[2] | 0, this.D = Qn[3] | 0, this.E = Qn[4] | 0, this.F = Qn[5] | 0, this.G = Qn[6] | 0, this.H = Qn[7] | 0;
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
      Jn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Jn[l - 15], h = Jn[l - 2], g = cn(y, 7) ^ cn(y, 18) ^ y >>> 3, w = cn(h, 17) ^ cn(h, 19) ^ h >>> 10;
      Jn[l] = w + Jn[l - 7] + g + Jn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = cn(a, 6) ^ cn(a, 11) ^ cn(a, 25), h = d + y + X3(a, c, u) + Z3[l] + Jn[l] | 0, w = (cn(r, 2) ^ cn(r, 13) ^ cn(r, 22)) + Y3(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Jn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Q3 = class extends fp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ns(() => new fp());
ns(() => new Q3());
const no = BigInt(2 ** 32 - 1), Oc = BigInt(32);
function dp(t, e = !1) {
  return e ? { h: Number(t & no), l: Number(t >> Oc & no) } : { h: Number(t >> Oc & no) | 0, l: Number(t & no) | 0 };
}
function J3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = dp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const t4 = (t, e) => BigInt(t >>> 0) << Oc | BigInt(e >>> 0), e4 = (t, e, n) => t >>> n, n4 = (t, e, n) => t << 32 - n | e >>> n, r4 = (t, e, n) => t >>> n | e << 32 - n, s4 = (t, e, n) => t << 32 - n | e >>> n, i4 = (t, e, n) => t << 64 - n | e >>> n - 32, o4 = (t, e, n) => t >>> n - 32 | e << 64 - n, a4 = (t, e) => e, c4 = (t, e) => t, l4 = (t, e, n) => t << n | e >>> 32 - n, u4 = (t, e, n) => e << n | t >>> 32 - n, f4 = (t, e, n) => e << n - 32 | t >>> 64 - n, d4 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function h4(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const p4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), g4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, y4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), w4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, b4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), m4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ct = {
  fromBig: dp,
  split: J3,
  toBig: t4,
  shrSH: e4,
  shrSL: n4,
  rotrSH: r4,
  rotrSL: s4,
  rotrBH: i4,
  rotrBL: o4,
  rotr32H: a4,
  rotr32L: c4,
  rotlSH: l4,
  rotlSL: u4,
  rotlBH: f4,
  rotlBL: d4,
  add: h4,
  add3L: p4,
  add3H: g4,
  add4L: y4,
  add4H: w4,
  add5H: m4,
  add5L: b4
}, [x4, S4] = ct.split([
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
].map((t) => BigInt(t))), tr = new Uint32Array(80), er = new Uint32Array(80);
let ua = class extends Gl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: g, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, h, g, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, h, g, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      tr[b] = e.getUint32(n), er[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = tr[b - 15] | 0, E = er[b - 15] | 0, D = ct.rotrSH(L, E, 1) ^ ct.rotrSH(L, E, 8) ^ ct.shrSH(L, E, 7), G = ct.rotrSL(L, E, 1) ^ ct.rotrSL(L, E, 8) ^ ct.shrSL(L, E, 7), j = tr[b - 2] | 0, K = er[b - 2] | 0, m = ct.rotrSH(j, K, 19) ^ ct.rotrBH(j, K, 61) ^ ct.shrSH(j, K, 6), k = ct.rotrSL(j, K, 19) ^ ct.rotrBL(j, K, 61) ^ ct.shrSL(j, K, 6), N = ct.add4L(G, k, er[b - 7], er[b - 16]), X = ct.add4H(N, D, m, tr[b - 7], tr[b - 16]);
      tr[b] = X | 0, er[b] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: v, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = ct.rotrSH(l, y, 14) ^ ct.rotrSH(l, y, 18) ^ ct.rotrBH(l, y, 41), E = ct.rotrSL(l, y, 14) ^ ct.rotrSL(l, y, 18) ^ ct.rotrBL(l, y, 41), D = l & h ^ ~l & w, G = y & g ^ ~y & v, j = ct.add5L(U, E, G, S4[b], er[b]), K = ct.add5H(j, _, L, D, x4[b], tr[b]), m = j | 0, k = ct.rotrSH(r, s, 28) ^ ct.rotrBH(r, s, 34) ^ ct.rotrBH(r, s, 39), N = ct.rotrSL(r, s, 28) ^ ct.rotrBL(r, s, 34) ^ ct.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      _ = w | 0, U = v | 0, w = h | 0, v = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = ct.add(u | 0, d | 0, K | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = ct.add3L(m, N, nt);
      r = ct.add3H(W, K, k, X), s = W | 0;
    }
    ({ h: r, l: s } = ct.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ct.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = ct.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = ct.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = ct.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: v } = ct.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: _, l: U } = ct.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, d, l, y, h, g, w, v, _, U);
  }
  roundClean() {
    tr.fill(0), er.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, E4 = class extends ua {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, A4 = class extends ua {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, $4 = class extends ua {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ns(() => new ua());
ns(() => new E4());
ns(() => new A4());
ns(() => new $4());
function v4(t, e, n) {
  const s = M3;
  if (F4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Uc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var re;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(re || (re = {}));
let I4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, hp = class extends I4 {
  constructor(e) {
    super(e);
  }
};
function fa(t) {
  const e = [];
  return e.push(pi(jl(t.version, 1))), e.push(pi(t.hash160)), Mn(e);
}
function L4(t) {
  const e = [];
  return e.push(t.prefix), e.push(fa(t.address)), t.prefix === Hc.Contract && e.push(gi(t.contractName)), Mn(e);
}
function gi(t) {
  const e = [], n = zl(t.content), r = n.byteLength;
  return e.push(pi(jl(r, t.lengthPrefixBytes))), e.push(n), Mn(e);
}
function k4(t) {
  const e = [];
  return e.push(fa(t.address)), e.push(gi(t.contractName)), e.push(gi(t.assetName)), Mn(e);
}
function pp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(L4(t.principal)), (t.conditionType === Sr.Fungible || t.conditionType === Sr.NonFungible) && e.push(k4(t.assetInfo)), t.conditionType === Sr.NonFungible && e.push(Gr(t.assetName)), e.push(t.conditionCode), t.conditionType === Sr.STX || t.conditionType === Sr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new hp("The post-condition amount may not be larger than 8 bytes");
    e.push(I3(t.amount, !1, 8));
  }
  return Mn(e);
}
function bn(t, e) {
  return Mn([t, e]);
}
function C4(t) {
  return new Uint8Array([t.type]);
}
function B4(t) {
  return t.type === re.OptionalNone ? new Uint8Array([t.type]) : bn(t.type, Gr(t.value));
}
function T4(t) {
  const e = new Uint8Array(4);
  return la(e, t.buffer.length, 0), bn(t.type, Rl(e, t.buffer));
}
function M4(t) {
  const e = Fl(L3(t.value, BigInt(_3)), op);
  return bn(t.type, e);
}
function _4(t) {
  const e = Fl(t.value, op);
  return bn(t.type, e);
}
function U4(t) {
  return bn(t.type, fa(t.address));
}
function N4(t) {
  return bn(t.type, Rl(fa(t.address), gi(t.contractName)));
}
function H4(t) {
  return bn(t.type, Gr(t.value));
}
function P4(t) {
  const e = [], n = new Uint8Array(4);
  la(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Gr(r);
    e.push(s);
  }
  return bn(t.type, Mn(e));
}
function O4(t) {
  const e = [], n = new Uint8Array(4);
  la(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = v4(s);
    e.push(gi(i));
    const o = Gr(t.data[s]);
    e.push(o);
  }
  return bn(t.type, Mn(e));
}
function gp(t, e) {
  const n = [], r = e == "ascii" ? B3(t.data) : zl(t.data), s = new Uint8Array(4);
  return la(s, r.length, 0), n.push(s), n.push(r), bn(t.type, Mn(n));
}
function D4(t) {
  return gp(t, "ascii");
}
function j4(t) {
  return gp(t, "utf8");
}
function Gr(t) {
  switch (t.type) {
    case re.BoolTrue:
    case re.BoolFalse:
      return C4(t);
    case re.OptionalNone:
    case re.OptionalSome:
      return B4(t);
    case re.Buffer:
      return T4(t);
    case re.UInt:
      return _4(t);
    case re.Int:
      return M4(t);
    case re.PrincipalStandard:
      return U4(t);
    case re.PrincipalContract:
      return N4(t);
    case re.ResponseOk:
    case re.ResponseErr:
      return H4(t);
    case re.List:
      return P4(t);
    case re.Tuple:
      return O4(t);
    case re.StringASCII:
      return D4(t);
    case re.StringUTF8:
      return j4(t);
    default:
      throw new hp("Unable to serialize. Invalid Clarity Value.");
  }
}
const F4 = (t, e) => t ? zl(t).length > e : !1, z4 = "connect-ui";
let wo, yp, ke = !1, Dc = !1;
const Tn = (t, e = "") => () => {
}, R4 = (t, e) => () => {
}, G4 = "{visibility:hidden}.hydrated{visibility:inherit}", Qf = {}, K4 = "http://www.w3.org/2000/svg", V4 = "http://www.w3.org/1999/xhtml", q4 = (t) => t != null, ql = (t) => (t = typeof t, t === "object" || t === "function");
function wp(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const st = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !ql(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? jc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = jc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, jc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, W4 = {}, X4 = (t) => t && t.$tag$ === W4, Y4 = (t, e) => t != null && !ql(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, Z4 = (t) => Ws(t).$hostElement$, Q4 = (t, e, n) => {
  const r = ce.ce(e, n);
  return t.dispatchEvent(r), r;
}, Jf = /* @__PURE__ */ new WeakMap(), J4 = (t, e, n) => {
  let r = Ho.get(t);
  mE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ho.set(t, r);
}, tE = (t, e, n, r) => {
  var s;
  let i = bp(e);
  const o = Ho.get(i);
  if (t = t.nodeType === 11 ? t : pn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Jf.get(t), c;
      if (a || Jf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = pn.createElement("style"), c.innerHTML = o;
          const u = (s = ce.$nonce$) !== null && s !== void 0 ? s : wp(pn);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, eE = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Tn("attachStyles", e.$tagName$), i = tE(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, bp = (t, e) => "sc-" + t.$tagName$, td = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = nd(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = ed(n), d = ed(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : nd(da, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && ce.rel(t, e, n, !1), r && ce.ael(t, e, r, !1);
    else {
      const c = ql(r);
      if ((o || c && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const u = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != u) && (t[e] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || i & 4 || s) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, nE = /\s/, ed = (t) => t ? t.split(nE) : [], mp = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Qf, o = e.$attrs$ || Qf;
  for (r in i)
    r in o || td(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    td(s, r, i[r], o[r], n, e.$flags$);
}, Wl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = pn.createTextNode(s.$text$);
  else {
    if (ke || (ke = s.$tag$ === "svg"), o = s.$elm$ = pn.createElementNS(ke ? K4 : V4, s.$tag$), ke && s.$tag$ === "foreignObject" && (ke = !1), mp(null, s, ke), q4(wo) && o["s-si"] !== wo && o.classList.add(o["s-si"] = wo), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Wl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? ke = !1 : o.tagName === "foreignObject" && (ke = !0);
  }
  return o;
}, xp = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === yp && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Wl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Sp = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, rE = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : ro(a, d) ? (ei(a, d), a = e[++s], d = r[++i]) : ro(c, l) ? (ei(c, l), c = e[--o], l = r[--u]) : ro(a, l) ? (ei(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : ro(c, d) ? (ei(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (y = Wl(e && e[i], n, i), d = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? xp(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Sp(e, s, o);
}, ro = (t, e) => t.$tag$ === e.$tag$, ei = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (ke = i === "svg" ? !0 : i === "foreignObject" ? !1 : ke, mp(t, e, ke), r !== null && s !== null ? rE(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), xp(n, null, e, s, 0, s.length - 1)) : r !== null && Sp(r, 0, r.length - 1), ke && i === "svg" && (ke = !1)) : t.$text$ !== o && (n.data = o);
}, sE = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || jc(null, null), s = X4(e) ? e : st(null, null, e);
  yp = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, wo = n["s-sc"], ei(r, s);
}, Ep = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Xl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Ep(t, t.$ancestorComponent$), SE(() => iE(t, e));
}, iE = (t, e) => {
  const n = Tn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), lE(s, () => oE(t, r, e));
}, oE = async (t, e, n) => {
  const r = t.$hostElement$, s = Tn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && eE(t);
  const o = Tn("render", t.$cmpMeta$.$tagName$);
  aE(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => cE(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, aE = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, sE(t, e);
  } catch (r) {
    yi(r, t.$hostElement$);
  }
  return null;
}, cE = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Tn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, $p(n), r(), t.$onReadyResolve$(n), s || Ap()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Zl(() => Xl(t, !1)), t.$flags$ &= -517;
}, Ap = (t) => {
  $p(pn.documentElement), Zl(() => Q4(da, "appload", { detail: { namespace: z4 } }));
}, lE = (t, e) => t && t.then ? t.then(e) : e(), $p = (t) => t.classList.add("hydrated"), uE = (t, e) => Ws(t).$instanceValues$.get(e), fE = (t, e, n, r) => {
  const s = Ws(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = Y4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Xl(s, !1));
}, vp = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return uE(this, i);
        },
        set(a) {
          fE(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        ce.jmp(() => {
          const u = i.get(o);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (s.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
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
}, dE = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = bE(n), s.then) {
        const c = R4();
        s = await s, c();
      }
      s.isProxied || (vp(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Tn("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        yi(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = bp(n);
      if (!Ho.has(c)) {
        const u = Tn("registerStyles", n.$tagName$);
        J4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Xl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, hE = (t) => {
  if (!(ce.$flags$ & 1)) {
    const e = Ws(t), n = e.$cmpMeta$, r = Tn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Ep(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), dE(t, e, n);
    }
    r();
  }
}, pE = (t) => {
  ce.$flags$ & 1 || Ws(t);
}, gE = (t, e = {}) => {
  var n;
  const r = Tn(), s = [], i = e.exclude || [], o = da.customElements, a = pn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ pn.createElement("style"), d = [];
  let l, y = !0;
  Object.assign(ce, e), ce.$resourcesUrl$ = new URL(e.resourcesUrl || "./", pn.baseURI).href, t.map((h) => {
    h[1].map((g) => {
      const w = {
        $flags$: g[0],
        $tagName$: g[1],
        $members$: g[2],
        $listeners$: g[3]
      };
      w.$members$ = g[2];
      const v = w.$tagName$, _ = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, wE(U, w), w.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? d.push(this) : ce.jmp(() => hE(this));
        }
        disconnectedCallback() {
          ce.jmp(() => pE(this));
        }
        componentOnReady() {
          return Ws(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = h[0], !i.includes(v) && !o.get(v) && (s.push(v), o.define(v, vp(
        _,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + G4, u.setAttribute("data-styles", "");
    const h = (n = ce.$nonce$) !== null && n !== void 0 ? n : wp(pn);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, d.length ? d.map((h) => h.connectedCallback()) : ce.jmp(() => l = setTimeout(Ap, 30)), r();
}, Yl = /* @__PURE__ */ new WeakMap(), Ws = (t) => Yl.get(t), yE = (t, e) => Yl.set(e.$lazyInstance$ = t, e), wE = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Yl.set(t, n);
}, nd = (t, e) => e in t, yi = (t, e) => (0, console.error)(t, e), za = /* @__PURE__ */ new Map(), bE = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = za.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (za.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => x$).then(o, yi);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (za.set(s, o), o[r]), yi);
}, Ho = /* @__PURE__ */ new Map(), da = typeof window < "u" ? window : {}, pn = da.document || { head: {} }, ce = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Ip = (t) => Promise.resolve(t), mE = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), rd = [], Lp = [], xE = (t, e) => (n) => {
  t.push(n), Dc || (Dc = !0, ce.$flags$ & 4 ? Zl(Fc) : ce.raf(Fc));
}, sd = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      yi(n);
    }
  t.length = 0;
}, Fc = () => {
  sd(rd), sd(Lp), (Dc = rd.length > 0) && ce.raf(Fc);
}, Zl = (t) => Ip().then(t), SE = /* @__PURE__ */ xE(Lp), EE = () => Ip(), AE = (t, e) => typeof window > "u" ? Promise.resolve() : EE().then(() => gE([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var $E = Object.defineProperty, vE = Object.defineProperties, IE = Object.getOwnPropertyDescriptors, Po = Object.getOwnPropertySymbols, kp = Object.prototype.hasOwnProperty, Cp = Object.prototype.propertyIsEnumerable, id = (t, e, n) => e in t ? $E(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, _e = (t, e) => {
  for (var n in e || (e = {})) kp.call(e, n) && id(t, n, e[n]);
  if (Po) for (var n of Po(e)) Cp.call(e, n) && id(t, n, e[n]);
  return t;
}, Ze = (t, e) => vE(t, IE(e)), Bp = (t, e) => {
  var n = {};
  for (var r in t) kp.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Po) for (var r of Po(t)) e.indexOf(r) < 0 && Cp.call(t, r) && (n[r] = t[r]);
  return n;
};
function Tp() {
  return ia(Or()) || window.StacksProvider || window.BlockstackProvider;
}
function ha(t) {
  return t ? typeof t == "string" ? jr.fromName(t) : "version" in t ? t : "url" in t ? new gc({ url: t.url }) : t.transactionVersion === zr.Mainnet ? new gc({ url: t.client.baseUrl }) : new yc({ url: t.client.baseUrl }) : new yc();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var LE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(LE || {}), kE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(kE || {}), Ql = (t) => {
  let e = t;
  if (!e) {
    let n = new uh(["store_write"], document.location.href);
    e = new pc({ appConfig: n });
  }
  return e;
};
function Mp(t) {
  try {
    return Ql(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var _p = (t) => {
  let e = Ql(t).loadUserData().appPrivateKey, n = ae.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function CE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Fr.Mainnet]: "mainnet", [Fr.Testnet]: "testnet" }, a = ha(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function BE(t) {
  let e = ha(t.network), n = Ql(t.userSession), r = Ze(_e({}, t), { network: e, userSession: n });
  return _e({ stxAddress: CE(r) }, r);
}
async function TE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(sp) : n = n.map((r) => tt(pp(r)))), new ae.TokenSigner("ES256k", e).signAsync(Ze(_e({}, t), { postConditions: n }));
}
function ME(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(sp) : e = e.map((n) => tt(pp(n)))), ae.createUnsecuredToken(Ze(_e({}, t), { postConditions: e }));
}
var _E = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = xt(a.replace(/^0x/, "")), u = A3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Ze(_e({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Ze(_e({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, UE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Bp(e, ["amount", "appDetails", "userSession"]);
  if (Mp(s)) {
    let { privateKey: a, publicKey: c } = _p(s), u = Ze(_e({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), TE(u, a);
  }
  let o = Ze(_e({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), ME(o);
};
async function NE(t, e, n) {
  let r = await e(Ze(_e(_e({}, BE(t)), t), { network: ha(t.network) }));
  return _E({ token: r, options: t }, n);
}
function HE(t, e = Tp()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return NE(t, UE, e);
}
function Up(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Ze(_e({}, t), { message: _f(e), domain: _f(n) }) : Ze(_e({}, t), { message: tt(Gr(e)), domain: tt(Gr(n)) });
}
async function PE(t, e) {
  return new ae.TokenSigner("ES256k", e).signAsync(Up(t));
}
async function OE(t) {
  let e = t, { userSession: n } = e, r = Bp(e, ["userSession"]);
  if (Mp(n)) {
    let { privateKey: s, publicKey: i } = _p(n), o = Ze(_e({}, r), { publicKey: i });
    return PE(o, s);
  }
  return ae.createUnsecuredToken(Up(t));
}
var DE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(DE || {}), Np = "asigna-stx", od = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Np && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(FE(t, e), "*");
}), jE = { authenticationRequest: async (t) => od(t, "authenticationRequest"), transactionRequest: async (t) => od(t, "transactionRequest") }, FE = (t, e) => ({ source: Np, [e]: t }), zE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = jE);
};
zE();
var RE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function GE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Or(), o = Tp();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    AE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : RE, c = Nm(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = d;
    };
    u.callback = (h) => {
      l(), t(n, h);
    }, u.cancelCallback = () => {
      var h;
      l(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(u);
    let y = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", y), u.remove());
    };
    document.addEventListener("keydown", y);
  };
}
var so = GE(HE);
function gr(t, e, n) {
  return Jl(ye(t, e), n);
}
function ye(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Dt(r);
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
      const r = qE(BigInt(`0x${ht(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ht(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ad(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Bi(t, e = 8) {
  return (typeof t == "bigint" ? t : ye(t, !1)).toString(16).padStart(e * 2, "0");
}
function pa(t) {
  return parseInt(t, 16);
}
function Jl(t, e = 16) {
  const n = Bi(t, e);
  return Dt(n);
}
function KE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function VE(t, e) {
  return t & BigInt(1) << e;
}
function qE(t, e) {
  return VE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const WE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ht(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += WE[n];
  return e;
}
function Dt(t) {
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
function Xs(t) {
  return new TextEncoder().encode(t);
}
function tu(t) {
  return new TextDecoder().decode(t);
}
function Hp(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function XE(t) {
  return String.fromCharCode.apply(null, t);
}
function YE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function cd(t) {
  if (t.some(YE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ga(...t) {
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
function Zt(t) {
  return ga(...t.map((e) => typeof e == "number" ? cd([e]) : e instanceof Array ? cd(e) : e));
}
var ld;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ld || (ld = {}));
var ud;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(fd || (fd = {}));
const Pp = 33, Ra = 32;
function ZE(t) {
  if (t.length < Ra * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Ra * 2), r = t.slice(2 + Ra * 2);
  return {
    recoveryId: pa(e),
    r: n,
    s: r
  };
}
function QE(t) {
  const e = typeof t == "string" ? Dt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function JE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function tA(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function eA(t, e) {
  return t[e];
}
function nA(t, e, n = 0) {
  return t[n] = e, t;
}
function rA(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Kr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var zc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(zc || (zc = {}));
const sA = zc.Mainnet, iA = 128, oA = 128, Op = 16, Br = 32, Rc = 80, ya = 65, aA = 32, cA = 64, Oo = 34;
var J;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(J || (J = {}));
var ut;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ut || (ut = {}));
var Gc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Gc || (Gc = {}));
var xe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(xe || (xe = {}));
const bo = ["onChainOnly", "offChainOnly", "any"], dd = {
  [bo[0]]: xe.OnChainOnly,
  [bo[1]]: xe.OffChainOnly,
  [bo[2]]: xe.Any,
  [xe.OnChainOnly]: xe.OnChainOnly,
  [xe.OffChainOnly]: xe.OffChainOnly,
  [xe.Any]: xe.Any
};
function lA(t) {
  if (t in dd)
    return dd[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${bo.join(", ")}`);
}
var Do;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Do || (Do = {}));
Do.Mainnet;
var Ps;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ps || (Ps = {}));
var Se;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Se || (Se = {}));
var Kt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Kt || (Kt = {}));
var Tt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Tt || (Tt = {}));
var jo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(jo || (jo = {}));
var Rt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Rt || (Rt = {}));
var wi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(wi || (wi = {}));
var Kc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Kc || (Kc = {}));
var bi;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(bi || (bi = {}));
var hd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(hd || (hd = {}));
var pd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(pd || (pd = {}));
function Vc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function uA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function fA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vc(t.outputLen), Vc(t.blockLen);
}
function dA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function hA(t, e) {
  Dp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Lr = {
  number: Vc,
  bool: uA,
  bytes: Dp,
  hash: fA,
  exists: dA,
  output: hA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ga = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ln = (t, e) => t << 32 - e | t >>> e, pA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!pA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function gA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function eu(t) {
  if (typeof t == "string" && (t = gA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class jp {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function rs(t) {
  const e = (r) => t().update(eu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function yA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class nu extends jp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ga(this.buffer);
  }
  update(e) {
    Lr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = eu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ga(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Lr.exists(this), Lr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    yA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ga(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const wA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fp = Uint8Array.from({ length: 16 }, (t, e) => e), bA = Fp.map((t) => (9 * t + 5) % 16);
let ru = [Fp], su = [bA];
for (let t = 0; t < 4; t++)
  for (let e of [ru, su])
    e.push(e[t].map((n) => wA[n]));
const zp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), mA = ru.map((t, e) => t.map((n) => zp[e][n])), xA = su.map((t, e) => t.map((n) => zp[e][n])), SA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), EA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), io = (t, e) => t << e | t >>> 32 - e;
function gd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oo = new Uint32Array(16);
class AA extends nu {
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
      oo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = SA[h], v = EA[h], _ = ru[h], U = su[h], b = mA[h], L = xA[h];
      for (let E = 0; E < 16; E++) {
        const D = io(r + gd(h, i, a, u) + oo[_[E]] + w, b[E]) + l | 0;
        r = l, l = u, u = io(a, 10) | 0, a = i, i = D;
      }
      for (let E = 0; E < 16; E++) {
        const D = io(s + gd(g, o, c, d) + oo[U[E]] + v, L[E]) + y | 0;
        s = y, y = d, d = io(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    oo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const $A = rs(() => new AA()), vA = (t, e, n) => t & e ^ ~t & n, IA = (t, e, n) => t & e ^ t & n ^ e & n, LA = new Uint32Array([
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
]), nr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), rr = new Uint32Array(64);
class Rp extends nu {
  constructor() {
    super(64, 32, 8, !1), this.A = nr[0] | 0, this.B = nr[1] | 0, this.C = nr[2] | 0, this.D = nr[3] | 0, this.E = nr[4] | 0, this.F = nr[5] | 0, this.G = nr[6] | 0, this.H = nr[7] | 0;
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
      rr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = rr[l - 15], h = rr[l - 2], g = ln(y, 7) ^ ln(y, 18) ^ y >>> 3, w = ln(h, 17) ^ ln(h, 19) ^ h >>> 10;
      rr[l] = w + rr[l - 7] + g + rr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = ln(a, 6) ^ ln(a, 11) ^ ln(a, 25), h = d + y + vA(a, c, u) + LA[l] + rr[l] | 0, w = (ln(r, 2) ^ ln(r, 13) ^ ln(r, 22)) + IA(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    rr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class kA extends Rp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const iu = rs(() => new Rp());
rs(() => new kA());
const ao = BigInt(2 ** 32 - 1), qc = BigInt(32);
function Gp(t, e = !1) {
  return e ? { h: Number(t & ao), l: Number(t >> qc & ao) } : { h: Number(t >> qc & ao) | 0, l: Number(t & ao) | 0 };
}
function CA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Gp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const BA = (t, e) => BigInt(t >>> 0) << qc | BigInt(e >>> 0), TA = (t, e, n) => t >>> n, MA = (t, e, n) => t << 32 - n | e >>> n, _A = (t, e, n) => t >>> n | e << 32 - n, UA = (t, e, n) => t << 32 - n | e >>> n, NA = (t, e, n) => t << 64 - n | e >>> n - 32, HA = (t, e, n) => t >>> n - 32 | e << 64 - n, PA = (t, e) => e, OA = (t, e) => t, DA = (t, e, n) => t << n | e >>> 32 - n, jA = (t, e, n) => e << n | t >>> 32 - n, FA = (t, e, n) => e << n - 32 | t >>> 64 - n, zA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function RA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const GA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), KA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, VA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), qA = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, WA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), XA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, lt = {
  fromBig: Gp,
  split: CA,
  toBig: BA,
  shrSH: TA,
  shrSL: MA,
  rotrSH: _A,
  rotrSL: UA,
  rotrBH: NA,
  rotrBL: HA,
  rotr32H: PA,
  rotr32L: OA,
  rotlSH: DA,
  rotlSL: jA,
  rotlBH: FA,
  rotlBL: zA,
  add: RA,
  add3L: GA,
  add3H: KA,
  add4L: VA,
  add4H: qA,
  add5H: XA,
  add5L: WA
}, [YA, ZA] = lt.split([
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
].map((t) => BigInt(t))), sr = new Uint32Array(80), ir = new Uint32Array(80);
class wa extends nu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: g, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, h, g, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, h, g, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      sr[b] = e.getUint32(n), ir[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = sr[b - 15] | 0, E = ir[b - 15] | 0, D = lt.rotrSH(L, E, 1) ^ lt.rotrSH(L, E, 8) ^ lt.shrSH(L, E, 7), G = lt.rotrSL(L, E, 1) ^ lt.rotrSL(L, E, 8) ^ lt.shrSL(L, E, 7), j = sr[b - 2] | 0, K = ir[b - 2] | 0, m = lt.rotrSH(j, K, 19) ^ lt.rotrBH(j, K, 61) ^ lt.shrSH(j, K, 6), k = lt.rotrSL(j, K, 19) ^ lt.rotrBL(j, K, 61) ^ lt.shrSL(j, K, 6), N = lt.add4L(G, k, ir[b - 7], ir[b - 16]), X = lt.add4H(N, D, m, sr[b - 7], sr[b - 16]);
      sr[b] = X | 0, ir[b] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: v, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = lt.rotrSH(l, y, 14) ^ lt.rotrSH(l, y, 18) ^ lt.rotrBH(l, y, 41), E = lt.rotrSL(l, y, 14) ^ lt.rotrSL(l, y, 18) ^ lt.rotrBL(l, y, 41), D = l & h ^ ~l & w, G = y & g ^ ~y & v, j = lt.add5L(U, E, G, ZA[b], ir[b]), K = lt.add5H(j, _, L, D, YA[b], sr[b]), m = j | 0, k = lt.rotrSH(r, s, 28) ^ lt.rotrBH(r, s, 34) ^ lt.rotrBH(r, s, 39), N = lt.rotrSL(r, s, 28) ^ lt.rotrBL(r, s, 34) ^ lt.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      _ = w | 0, U = v | 0, w = h | 0, v = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = lt.add(u | 0, d | 0, K | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = lt.add3L(m, N, nt);
      r = lt.add3H(W, K, k, X), s = W | 0;
    }
    ({ h: r, l: s } = lt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = lt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = lt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = lt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = lt.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: v } = lt.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: _, l: U } = lt.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, d, l, y, h, g, w, v, _, U);
  }
  roundClean() {
    sr.fill(0), ir.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class QA extends wa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class JA extends wa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class t8 extends wa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
rs(() => new wa());
rs(() => new QA());
const e8 = rs(() => new JA());
rs(() => new t8());
function Kp(t) {
  if (Dt(t).byteLength != ya)
    throw Error("Invalid signature");
  return {
    type: J.MessageSignature,
    data: t
  };
}
function ni(t, e) {
  return { type: J.Address, version: t, hash160: e };
}
function xs(t) {
  return ts.c32address(t.version, t.hash160);
}
function Vr(t, e, n) {
  const r = e || 1, s = n || iA;
  if (cg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: J.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function ou(t) {
  const e = ts.c32addressDecode(t);
  return {
    type: J.Address,
    version: e[0],
    hash160: e[1]
  };
}
var O;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(O || (O = {}));
function n8(t) {
  if (t.type === O.PrincipalStandard)
    return xs(t.address);
  if (t.type === O.PrincipalContract)
    return `${xs(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Vp(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return i8(e, n);
  } else
    return r8(t);
}
function r8(t) {
  const e = ou(t);
  return { type: O.PrincipalStandard, address: e };
}
function s8(t) {
  return { type: O.PrincipalStandard, address: t };
}
function i8(t, e) {
  const n = ou(t), r = Vr(e);
  return qp(n, r);
}
function qp(t, e) {
  if (Xs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: O.PrincipalContract, address: t, contractName: e };
}
function Ka(t, e = !1) {
  switch (t.type) {
    case O.BoolTrue:
      return !0;
    case O.BoolFalse:
      return !1;
    case O.Int:
    case O.UInt:
      return e ? t.value.toString() : t.value;
    case O.Buffer:
      return `0x${ht(t.buffer)}`;
    case O.OptionalNone:
      return null;
    case O.OptionalSome:
      return Ln(t.value);
    case O.ResponseErr:
      return Ln(t.value);
    case O.ResponseOk:
      return Ln(t.value);
    case O.PrincipalStandard:
    case O.PrincipalContract:
      return n8(t);
    case O.List:
      return t.list.map((r) => Ln(r));
    case O.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Ln(t.data[r]);
      }), n;
    case O.StringASCII:
      return t.data;
    case O.StringUTF8:
      return t.data;
  }
}
function Ln(t) {
  switch (t.type) {
    case O.ResponseErr:
      return { type: cr(t), value: Ka(t, !0), success: !1 };
    case O.ResponseOk:
      return { type: cr(t), value: Ka(t, !0), success: !0 };
    default:
      return { type: cr(t), value: Ka(t, !0) };
  }
}
function cr(t) {
  switch (t.type) {
    case O.BoolTrue:
    case O.BoolFalse:
      return "bool";
    case O.Int:
      return "int";
    case O.UInt:
      return "uint";
    case O.Buffer:
      return `(buff ${t.buffer.length})`;
    case O.OptionalNone:
      return "(optional none)";
    case O.OptionalSome:
      return `(optional ${cr(t.value)})`;
    case O.ResponseErr:
      return `(response UnknownType ${cr(t.value)})`;
    case O.ResponseOk:
      return `(response ${cr(t.value)} UnknownType)`;
    case O.PrincipalStandard:
    case O.PrincipalContract:
      return "principal";
    case O.List:
      return `(list ${t.list.length} ${t.list.length ? cr(t.list[0]) : "UnknownType"})`;
    case O.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${cr(t.data[e])})`).join(" ")})`;
    case O.StringASCII:
      return `(string-ascii ${Hp(t.data).length})`;
    case O.StringUTF8:
      return `(string-utf8 ${Xs(t.data).length})`;
  }
}
const Wp = () => ({ type: O.BoolTrue }), Xp = () => ({ type: O.BoolFalse }), o8 = (t) => t ? Wp() : Xp(), yd = BigInt("0xffffffffffffffffffffffffffffffff"), a8 = BigInt(0), wd = BigInt("0x7fffffffffffffffffffffffffffffff"), bd = BigInt("-170141183460469231731687303715884105728"), c8 = (t) => {
  const e = ye(t, !0);
  if (e > wd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${wd}`);
  if (e < bd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${bd}`);
  return { type: O.Int, value: e };
}, ur = (t) => {
  const e = ye(t, !1);
  if (e < a8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > yd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${yd}`);
  return { type: O.UInt, value: e };
}, Yp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: O.Buffer, buffer: t };
};
function Zp() {
  return { type: O.OptionalNone };
}
function Qp(t) {
  return { type: O.OptionalSome, value: t };
}
function l8(t) {
  return { type: O.ResponseErr, value: t };
}
function u8(t) {
  return { type: O.ResponseOk, value: t };
}
function f8(t) {
  return { type: O.List, list: t };
}
function mi(t) {
  for (const e in t)
    if (!t6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: O.Tuple, data: t };
}
const qe = (t) => ({ type: O.StringASCII, data: t }), d8 = (t) => ({ type: O.StringUTF8, data: t });
class Jp extends jp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Lr.hash(e);
    const r = eu(n);
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
    return Lr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Lr.exists(this), Lr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const tg = (t, e, n) => new Jp(t, e).update(n).digest();
tg.create = (t, e) => new Jp(t, e);
Vt.hmacSha256Sync = (t, ...e) => {
  const n = tg.create(iu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Os(t) {
  return {
    type: J.PublicKey,
    data: Dt(t)
  };
}
function h8(t, e, n = Rt.Compressed) {
  const r = ZE(e.data), s = new Te(ad(r.r), ad(r.s)), i = ft.fromSignature(t, s, r.recoveryId), o = n === Rt.Compressed;
  return i.toHex(o);
}
function p8(t) {
  return { type: J.PublicKey, data: t };
}
function Ys(t) {
  return !ht(t.data).startsWith("04");
}
function Fo(t) {
  return t.data.slice();
}
function g8(t) {
  const e = b8(t), n = vi(e.data.slice(0, 32), e.compressed);
  return Os(ht(n));
}
function y8(t) {
  const e = typeof t == "string" ? t : ht(t), n = ft.fromHex(e).toHex(!0);
  return Os(n);
}
function w8(t) {
  const e = typeof t == "string" ? t : ht(t), n = ft.fromHex(e).toHex(!1);
  return Os(n);
}
function Wc(t) {
  const e = t.readUInt8(), n = e === 4 ? cA : aA;
  return p8(Zt([e, t.readBytes(n)]));
}
function b8(t) {
  const e = QE(t), n = e.length == Pp;
  return { data: e, compressed: n };
}
function m8(t, e) {
  const [n, r] = Xo(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Bi(r, 1) + Te.fromHex(n).toCompactHex();
  return Kp(i);
}
function x8(t) {
  return g8(t.data);
}
function S8(t, e, n) {
  return typeof t == "string" && (t = Vp(t)), typeof n == "string" && (n = Sd(n)), {
    type: J.Payload,
    payloadType: ut.TokenTransfer,
    recipient: t,
    amount: ye(e, !1),
    memo: n ?? Sd("")
  };
}
function E8(t, e, n, r) {
  return typeof t == "string" && (t = ou(t)), typeof e == "string" && (e = Vr(e)), typeof n == "string" && (n = Vr(n)), {
    type: J.Payload,
    payloadType: ut.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function md(t, e, n) {
  return typeof t == "string" && (t = Vr(t)), typeof e == "string" && (e = T8(e)), typeof n == "number" ? {
    type: J.Payload,
    payloadType: ut.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: J.Payload,
    payloadType: ut.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function A8() {
  return { type: J.Payload, payloadType: ut.PoisonMicroblock };
}
function xd(t, e) {
  if (t.byteLength != Br)
    throw Error(`Coinbase buffer size must be ${Br} bytes`);
  return e != null ? {
    type: J.Payload,
    payloadType: ut.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: J.Payload,
    payloadType: ut.Coinbase,
    coinbaseBytes: t
  };
}
function $8(t, e, n) {
  if (t.byteLength != Br)
    throw Error(`Coinbase buffer size must be ${Br} bytes`);
  if (n.byteLength != Rc)
    throw Error(`VRF proof buffer size must be ${Rc} bytes`);
  return {
    type: J.Payload,
    payloadType: ut.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === O.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Xc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Xc || (Xc = {}));
function v8(t, e, n, r, s, i, o) {
  return {
    type: J.Payload,
    payloadType: ut.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function eg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case ut.TokenTransfer:
      e.push(Xt(t.recipient)), e.push(gr(t.amount, !1, 8)), e.push($n(t.memo));
      break;
    case ut.ContractCall:
      e.push($n(t.contractAddress)), e.push($n(t.contractName)), e.push($n(t.functionName));
      const n = new Uint8Array(4);
      Kr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Xt(r));
      });
      break;
    case ut.SmartContract:
      e.push($n(t.contractName)), e.push($n(t.codeBody));
      break;
    case ut.VersionedSmartContract:
      e.push(t.clarityVersion), e.push($n(t.contractName)), e.push($n(t.codeBody));
      break;
    case ut.PoisonMicroblock:
      break;
    case ut.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case ut.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Xt(t.recipient));
      break;
    case ut.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Xt(t.recipient ? Qp(t.recipient) : Zp())), e.push(t.vrfProof);
      break;
    case ut.TenureChange:
      e.push(Dt(t.tenureHash)), e.push(Dt(t.previousTenureHash)), e.push(Dt(t.burnViewHash)), e.push(Dt(t.previousTenureEnd)), e.push(Kr(new Uint8Array(4), t.previousTenureBlocks)), e.push(nA(new Uint8Array(1), t.cause)), e.push(Dt(t.publicKeyHash));
      break;
  }
  return Zt(e);
}
function I8(t) {
  switch (t.readUInt8Enum(ut, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case ut.TokenTransfer:
      const n = Fe(t), r = ye(t.readBytes(8), !1), s = rg(t);
      return S8(n, r, s);
    case ut.ContractCall:
      const i = Ds(t), o = je(t), a = je(t), c = [], u = t.readUInt32BE();
      for (let b = 0; b < u; b++) {
        const L = Fe(t);
        c.push(L);
      }
      return E8(i, o, a, c);
    case ut.SmartContract:
      const d = je(t), l = je(t, 4, 1e5);
      return md(d, l);
    case ut.VersionedSmartContract: {
      const b = t.readUInt8Enum(Gc, (D) => {
        throw new Error(`Cannot recognize ClarityVersion: ${D}`);
      }), L = je(t), E = je(t, 4, 1e5);
      return md(L, E, b);
    }
    case ut.PoisonMicroblock:
      return A8();
    case ut.Coinbase: {
      const b = t.readBytes(Br);
      return xd(b);
    }
    case ut.CoinbaseToAltRecipient: {
      const b = t.readBytes(Br), L = Fe(t);
      return xd(b, L);
    }
    case ut.NakamotoCoinbase: {
      const b = t.readBytes(Br), L = Fe(t), E = t.readBytes(Rc);
      return $8(b, L, E);
    }
    case ut.TenureChange:
      const y = ht(t.readBytes(20)), h = ht(t.readBytes(20)), g = ht(t.readBytes(20)), w = ht(t.readBytes(32)), v = t.readUInt32BE(), _ = t.readUInt8Enum(Xc, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), U = ht(t.readBytes(20));
      return v8(y, h, g, w, v, _, U);
  }
}
class ba extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Er extends ba {
  constructor(e) {
    super(e);
  }
}
class Be extends ba {
  constructor(e) {
    super(e);
  }
}
class zo extends ba {
  constructor(e) {
    super(e);
  }
}
class kr extends ba {
  constructor(e) {
    super(e);
  }
}
var We;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(We || (We = {}));
function Yc(t) {
  return Kp(ht(t.readBytes(ya)));
}
function Ss(t, e) {
  return {
    pubKeyEncoding: t,
    type: J.TransactionAuthField,
    contents: e
  };
}
function L8(t) {
  const e = t.readUInt8Enum(We, (n) => {
    throw new Be(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case We.PublicKeyCompressed:
      return Ss(Rt.Compressed, Wc(t));
    case We.PublicKeyUncompressed:
      return Ss(Rt.Uncompressed, w8(Wc(t).data));
    case We.SignatureCompressed:
      return Ss(Rt.Compressed, Yc(t));
    case We.SignatureUncompressed:
      return Ss(Rt.Uncompressed, Yc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function au(t) {
  return Dt(t.data);
}
function k8(t) {
  const e = [];
  switch (t.contents.type) {
    case J.PublicKey:
      e.push(t.pubKeyEncoding === Rt.Compressed ? We.PublicKeyCompressed : We.PublicKeyUncompressed), e.push(Fo(y8(t.contents.data)));
      break;
    case J.MessageSignature:
      e.push(t.pubKeyEncoding === Rt.Compressed ? We.SignatureCompressed : We.SignatureUncompressed), e.push(au(t.contents));
      break;
  }
  return Zt(e);
}
function $n(t) {
  switch (t.type) {
    case J.Address:
      return Ti(t);
    case J.Principal:
      return ng(t);
    case J.LengthPrefixedString:
      return js(t);
    case J.MemoString:
      return M8(t);
    case J.AssetInfo:
      return sg(t);
    case J.PostCondition:
      return _8(t);
    case J.PublicKey:
      return Fo(t);
    case J.LengthPrefixedList:
      return uu(t);
    case J.Payload:
      return eg(t);
    case J.TransactionAuthField:
      return k8(t);
    case J.MessageSignature:
      return au(t);
  }
}
function C8() {
  return {
    type: J.Address,
    version: jo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function cu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Tt.SerializeP2PKH || e === Tt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Tt.SerializeP2WPKH || e === Tt.SerializeP2WSH || e === Tt.SerializeP2WSHNonSequential) && !r.every(Ys))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Tt.SerializeP2PKH:
      return ni(t, Y8(r[0].data));
    case Tt.SerializeP2WPKH:
      return ni(t, Z8(r[0].data));
    case Tt.SerializeP2SH:
    case Tt.SerializeP2SHNonSequential:
      return ni(t, Q8(n, r.map(Fo)));
    case Tt.SerializeP2WSH:
    case Tt.SerializeP2WSHNonSequential:
      return ni(t, J8(n, r.map(Fo)));
  }
}
function Ti(t) {
  const e = [];
  return e.push(Dt(Bi(t.version, 1))), e.push(Dt(t.hash160)), Zt(e);
}
function Ds(t) {
  const e = pa(ht(t.readBytes(1))), n = ht(t.readBytes(20));
  return { type: J.Address, version: e, hash160: n };
}
function ng(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ti(t.address)), t.prefix === bi.Contract && e.push(js(t.contractName)), Zt(e);
}
function B8(t) {
  const e = t.readUInt8Enum(bi, (s) => {
    throw new Be(`Unexpected Principal payload type: ${s}`);
  }), n = Ds(t);
  if (e === bi.Standard)
    return { type: J.Principal, prefix: e, address: n };
  const r = je(t);
  return {
    type: J.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function js(t) {
  const e = [], n = Xs(t.content), r = n.byteLength;
  return e.push(Dt(Bi(r, t.lengthPrefixBytes))), e.push(n), Zt(e);
}
function je(t, e, n) {
  e = e || 1;
  const r = pa(ht(t.readBytes(e))), s = tu(t.readBytes(r));
  return Vr(s, e, n ?? 128);
}
function T8(t) {
  return Vr(t, 4, 1e5);
}
function Sd(t) {
  if (t && cg(t, Oo))
    throw new Error(`Memo exceeds maximum length of ${Oo} bytes`);
  return { type: J.MemoString, content: t };
}
function M8(t) {
  const e = [], n = Xs(t.content), r = X8(ht(n), Oo * 2);
  return e.push(Dt(r)), Zt(e);
}
function rg(t) {
  let e = tu(t.readBytes(Oo));
  return e = e.replace(/\u0000*$/, ""), { type: J.MemoString, content: e };
}
function sg(t) {
  const e = [];
  return e.push(Ti(t.address)), e.push(js(t.contractName)), e.push(js(t.assetName)), Zt(e);
}
function Zc(t) {
  return {
    type: J.AssetInfo,
    address: Ds(t),
    contractName: je(t),
    assetName: je(t)
  };
}
function lu(t, e) {
  return {
    type: J.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function uu(t) {
  const e = t.values, n = [];
  n.push(Dt(Bi(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push($n(r));
  return Zt(n);
}
function ig(t, e, n) {
  const r = pa(ht(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case J.Address:
        s.push(Ds(t));
        break;
      case J.LengthPrefixedString:
        s.push(je(t));
        break;
      case J.MemoString:
        s.push(rg(t));
        break;
      case J.AssetInfo:
        s.push(Zc(t));
        break;
      case J.PostCondition:
        s.push(U8(t));
        break;
      case J.PublicKey:
        s.push(Wc(t));
        break;
      case J.TransactionAuthField:
        s.push(L8(t));
        break;
    }
  return lu(s, n);
}
function _8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ng(t.principal)), (t.conditionType === Se.Fungible || t.conditionType === Se.NonFungible) && e.push(sg(t.assetInfo)), t.conditionType === Se.NonFungible && e.push(Xt(t.assetName)), e.push(t.conditionCode), t.conditionType === Se.STX || t.conditionType === Se.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Er("The post-condition amount may not be larger than 8 bytes");
    e.push(gr(t.amount, !1, 8));
  }
  return Zt(e);
}
function U8(t) {
  const e = t.readUInt8Enum(Se, (o) => {
    throw new Be(`Could not read ${o} as PostConditionType`);
  }), n = B8(t);
  let r, s, i;
  switch (e) {
    case Se.STX:
      return r = t.readUInt8Enum(wi, (a) => {
        throw new Be(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ht(t.readBytes(8))}`), {
        type: J.PostCondition,
        conditionType: Se.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Se.Fungible:
      return s = Zc(t), r = t.readUInt8Enum(wi, (a) => {
        throw new Be(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ht(t.readBytes(8))}`), {
        type: J.PostCondition,
        conditionType: Se.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Se.NonFungible:
      s = Zc(t);
      const o = Fe(t);
      return r = t.readUInt8Enum(Kc, (a) => {
        throw new Be(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: J.PostCondition,
        conditionType: Se.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function mn(t, e) {
  return Zt([t, e]);
}
function N8(t) {
  return new Uint8Array([t.type]);
}
function H8(t) {
  return t.type === O.OptionalNone ? new Uint8Array([t.type]) : mn(t.type, Xt(t.value));
}
function P8(t) {
  const e = new Uint8Array(4);
  return Kr(e, t.buffer.length, 0), mn(t.type, ga(e, t.buffer));
}
function O8(t) {
  const e = Jl(KE(t.value, BigInt(oA)), Op);
  return mn(t.type, e);
}
function D8(t) {
  const e = Jl(t.value, Op);
  return mn(t.type, e);
}
function j8(t) {
  return mn(t.type, Ti(t.address));
}
function F8(t) {
  return mn(t.type, ga(Ti(t.address), js(t.contractName)));
}
function z8(t) {
  return mn(t.type, Xt(t.value));
}
function R8(t) {
  const e = [], n = new Uint8Array(4);
  Kr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Xt(r);
    e.push(s);
  }
  return mn(t.type, Zt(e));
}
function G8(t) {
  const e = [], n = new Uint8Array(4);
  Kr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Vr(s);
    e.push(js(i));
    const o = Xt(t.data[s]);
    e.push(o);
  }
  return mn(t.type, Zt(e));
}
function og(t, e) {
  const n = [], r = e == "ascii" ? Hp(t.data) : Xs(t.data), s = new Uint8Array(4);
  return Kr(s, r.length, 0), n.push(s), n.push(r), mn(t.type, Zt(n));
}
function K8(t) {
  return og(t, "ascii");
}
function V8(t) {
  return og(t, "utf8");
}
function Xt(t) {
  switch (t.type) {
    case O.BoolTrue:
    case O.BoolFalse:
      return N8(t);
    case O.OptionalNone:
    case O.OptionalSome:
      return H8(t);
    case O.Buffer:
      return P8(t);
    case O.UInt:
      return D8(t);
    case O.Int:
      return O8(t);
    case O.PrincipalStandard:
      return j8(t);
    case O.PrincipalContract:
      return F8(t);
    case O.ResponseOk:
    case O.ResponseErr:
      return z8(t);
    case O.List:
      return R8(t);
    case O.Tuple:
      return G8(t);
    case O.StringASCII:
      return K8(t);
    case O.StringUTF8:
      return V8(t);
    default:
      throw new Er("Unable to serialize. Invalid Clarity Value.");
  }
}
function q8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ed = /* @__PURE__ */ new Map();
function ag(t, e) {
  const n = Ed.get(t);
  if (n !== void 0)
    return n(e);
  const r = q8(t);
  return Ed.set(t, r), ag(t, e);
}
class ai {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return rA(this.readBytes(4), 0);
  }
  readUInt8() {
    return eA(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return JE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ht(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ht(n);
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
    if (ag(e, r))
      return r;
    throw n(r);
  }
}
function Fe(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ai(Dt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ai(t) : e = t;
  switch (e.readUInt8Enum(O, (r) => {
    throw new Be(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case O.Int:
      return c8(e.readBytes(16));
    case O.UInt:
      return ur(e.readBytes(16));
    case O.Buffer:
      const r = e.readUInt32BE();
      return Yp(e.readBytes(r));
    case O.BoolTrue:
      return Wp();
    case O.BoolFalse:
      return Xp();
    case O.PrincipalStandard:
      const s = Ds(e);
      return s8(s);
    case O.PrincipalContract:
      const i = Ds(e), o = je(e);
      return qp(i, o);
    case O.ResponseOk:
      return u8(Fe(e));
    case O.ResponseErr:
      return l8(Fe(e));
    case O.OptionalNone:
      return Zp();
    case O.OptionalSome:
      return Qp(Fe(e));
    case O.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Fe(e));
      return f8(c);
    case O.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let w = 0; w < u; w++) {
        const v = je(e).content;
        if (v === void 0)
          throw new Be('"content" is undefined');
        d[v] = Fe(e);
      }
      return mi(d);
    case O.StringASCII:
      const l = e.readUInt32BE(), y = XE(e.readBytes(l));
      return qe(y);
    case O.StringUTF8:
      const h = e.readUInt32BE(), g = tu(e.readBytes(h));
      return d8(g);
    default:
      throw new Be("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const W8 = (t) => t.length % 2 == 0 ? t : `0${t}`, X8 = (t, e) => t.padEnd(e, "0"), cg = (t, e) => t ? Xs(t).length > e : !1;
function Qc(t) {
  return L0(t);
}
const xi = (t) => $A(iu(t)), fu = (t) => ht(e8(t)), Y8 = (t) => ht(xi(t)), Z8 = (t) => {
  const e = xi(t), n = ga(new Uint8Array([0]), new Uint8Array([e.length]), e), r = xi(n);
  return ht(r);
}, Q8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Zt(n), s = xi(r);
  return ht(s);
}, J8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Zt(n), s = iu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Zt(i), a = xi(o);
  return ht(a);
};
function t6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function lg(t) {
  const e = Xt(t);
  return `0x${ht(e)}`;
}
function e6(t) {
  return Fe(t);
}
const As = (t) => {
  try {
    return ts.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function du() {
  return {
    type: J.MessageSignature,
    data: ht(new Uint8Array(ya))
  };
}
function ug(t, e, n, r) {
  const s = cu(0, t, 1, [Os(e)]).hash160, i = Ys(Os(e)) ? Rt.Compressed : Rt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: ye(n, !1),
    fee: ye(r, !1),
    keyEncoding: i,
    signature: du()
  };
}
function Si(t) {
  return "signature" in t;
}
function Ad(t) {
  return t === Tt.SerializeP2SH || t === Tt.SerializeP2WSH;
}
function n6(t) {
  return t === Tt.SerializeP2SHNonSequential || t === Tt.SerializeP2WSHNonSequential;
}
function $d(t) {
  const e = Qc(t);
  return e.nonce = 0, e.fee = 0, Si(e) ? e.signature = du() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function r6(t) {
  const e = [
    t.hashMode,
    Dt(t.signer),
    gr(t.nonce, !1, 8),
    gr(t.fee, !1, 8),
    t.keyEncoding,
    au(t.signature)
  ];
  return Zt(e);
}
function s6(t) {
  const e = [
    t.hashMode,
    Dt(t.signer),
    gr(t.nonce, !1, 8),
    gr(t.fee, !1, 8)
  ], n = lu(t.fields);
  e.push(uu(n));
  const r = new Uint8Array(2);
  return tA(r, t.signaturesRequired, 0), e.push(r), Zt(e);
}
function i6(t, e) {
  const n = ht(e.readBytes(20)), r = BigInt(`0x${ht(e.readBytes(8))}`), s = BigInt(`0x${ht(e.readBytes(8))}`), i = e.readUInt8Enum(Rt, (a) => {
    throw new Be(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Tt.SerializeP2WPKH && i != Rt.Compressed)
    throw new Be("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function o6(t, e) {
  const n = ht(e.readBytes(20)), r = BigInt("0x" + ht(e.readBytes(8))), s = BigInt("0x" + ht(e.readBytes(8))), i = ig(e, J.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case J.PublicKey:
        Ys(u.contents) || (o = !0);
        break;
      case J.MessageSignature:
        if (u.pubKeyEncoding === Rt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new kr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Tt.SerializeP2WSH || t === Tt.SerializeP2WSHNonSequential))
    throw new kr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Va(t) {
  return Si(t) ? r6(t) : s6(t);
}
function qa(t) {
  const e = t.readUInt8Enum(Tt, (n) => {
    throw new Be(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Tt.SerializeP2PKH || e === Tt.SerializeP2WPKH ? i6(e, t) : o6(e, t);
}
function fg(t, e, n, r) {
  const i = t + ht(new Uint8Array([e])) + ht(gr(n, !1, 8)) + ht(gr(r, !1, 8));
  if (Dt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return fu(Dt(i));
}
function dg(t, e, n) {
  const r = 33 + ya, s = Ys(e) ? Rt.Compressed : Rt.Uncompressed, i = t + W8(s.toString(16)) + n.data, o = Dt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return fu(o);
}
function a6(t, e, n, r, s) {
  const i = fg(t, e, n, r), o = m8(s, i), a = x8(s), c = dg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function hg(t, e, n, r, s, i) {
  const o = fg(t, e, n, r), a = Os(h8(o, i, s)), c = dg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function c6() {
  const t = ug(Tt.SerializeP2PKH, "", 0, 0);
  return t.signer = C8().hash160, t.keyEncoding = Rt.Compressed, t.signature = du(), t;
}
function vd(t, e, n) {
  return Si(t) ? l6(t, e, n) : u6(t, e, n);
}
function l6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = hg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = cu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new kr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function u6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case J.PublicKey:
        Ys(c.contents) || (i = !0), r.push(c.contents);
        break;
      case J.MessageSignature:
        c.pubKeyEncoding === Rt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = hg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Ad(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new kr("Too many signatures");
        break;
    }
  if (Ad(t.hashMode) && o !== t.signaturesRequired || n6(t.hashMode) && o < t.signaturesRequired)
    throw new kr("Incorrect number of signatures");
  if (i && (t.hashMode === Tt.SerializeP2WSH || t.hashMode === Tt.SerializeP2WSHNonSequential))
    throw new kr("Uncompressed keys are not allowed in this hash mode");
  const a = cu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new kr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function pg(t) {
  return {
    authType: Kt.Standard,
    spendingCondition: t
  };
}
function gg(t, e) {
  return {
    authType: Kt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ug(Tt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Id(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Kt.Standard:
        return pg($d(t.spendingCondition));
      case Kt.Sponsored:
        return gg($d(t.spendingCondition), c6());
      default:
        throw new zo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function f6(t, e) {
  switch (t.authType) {
    case Kt.Standard:
      return vd(t.spendingCondition, e, Kt.Standard);
    case Kt.Sponsored:
      return vd(t.spendingCondition, e, Kt.Standard);
    default:
      throw new zo("Invalid origin auth type");
  }
}
function d6(t, e) {
  switch (t.authType) {
    case Kt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ye(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Kt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: ye(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function h6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: ye(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function p6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ye(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function g6(t, e) {
  const n = {
    ...e,
    nonce: ye(e.nonce, !1),
    fee: ye(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function y6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Kt.Standard:
      e.push(Va(t.spendingCondition));
      break;
    case Kt.Sponsored:
      e.push(Va(t.spendingCondition)), e.push(Va(t.sponsorSpendingCondition));
      break;
  }
  return Zt(e);
}
function w6(t) {
  const e = t.readUInt8Enum(Kt, (r) => {
    throw new Be(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Kt.Standard:
      return n = qa(t), pg(n);
    case Kt.Sponsored:
      n = qa(t);
      const r = qa(t);
      return gg(n, r);
  }
}
class b6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: ye(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? sA, this.postConditionMode = i ?? Ps.Deny, this.postConditions = s ?? lu([]), o)
      this.anchorMode = lA(o);
    else
      switch (r.payloadType) {
        case ut.Coinbase:
        case ut.CoinbaseToAltRecipient:
        case ut.NakamotoCoinbase:
        case ut.PoisonMicroblock:
        case ut.TenureChange:
          this.anchorMode = xe.OnChainOnly;
          break;
        case ut.ContractCall:
        case ut.SmartContract:
        case ut.VersionedSmartContract:
        case ut.TokenTransfer:
          this.anchorMode = xe.Any;
          break;
      }
  }
  signBegin() {
    const e = Qc(this);
    return e.auth = Id(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Qc(this);
    return e.auth = Id(e.auth), e.txid();
  }
  verifyOrigin() {
    return f6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Kt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Kt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Kt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Si(n)) {
      const r = Ys(e);
      n.fields.push(Ss(r ? Rt.Compressed : Rt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = a6(n, r, e.fee, e.nonce, s);
    return Si(e) ? e.signature = i : e.fields.push(Ss(s.data.byteLength === Pp ? Rt.Compressed : Rt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return fu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Kt.Sponsored)
      throw new zo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = g6(this.auth, e);
  }
  setFee(e) {
    this.auth = d6(this.auth, e);
  }
  setNonce(e) {
    this.auth = h6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Kt.Sponsored)
      throw new zo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = p6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Er('"version" is undefined');
    if (this.chainId === void 0)
      throw new Er('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Er('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Er('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Er('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Kr(n, this.chainId, 0), e.push(n), e.push(y6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(uu(this.postConditions)), e.push(eg(this.payload)), Zt(e);
  }
}
function hu(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ai(Dt(t.slice(2))) : e = new ai(Dt(t)) : t instanceof Uint8Array ? e = new ai(t) : e = t;
  const n = e.readUInt8Enum(Do, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = w6(e), i = e.readUInt8Enum(xe, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Ps, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = ig(e, J.PostCondition), c = I8(e);
  return new b6(n, s, c, a, o, i, r);
}
const m6 = o8, ci = ur, x6 = Yp;
const S6 = /* @__PURE__ */ new Set([4001, -31001]), E6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], A6 = ["result", "data", "payload", "response", "params"], Ld = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], ma = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), ss = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Cn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, $6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), yg = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => $6(i, r)) === s
  );
}, wg = (t) => t ? yg(ss()).some(
  (e) => {
    var n;
    return e.id === t && (ma(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, bg = () => {
  if (typeof window > "u")
    return;
  const t = ss(), e = yg(t).filter(
    (n) => {
      var r;
      return ma(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Cn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of E6) {
    const r = Cn(t, n) ?? (t === window ? void 0 : Cn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, v6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ss(), n = Cn(e, t) ?? (e === window ? void 0 : Cn(window, t)) ?? ia(t);
  if (n)
    return n;
  if (ma(t) || wg(t))
    return bg();
}, co = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, I6 = ["blockstack-session", "blockstack"], L6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of I6) {
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
L6();
const mg = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Ce = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, k6 = (t) => {
  const e = Ce(t);
  if (!e)
    return null;
  const n = mg(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, C6 = (t) => {
  const e = Ce(t);
  if (!e)
    return null;
  const n = mg(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Jc = (t, e = "mainnet") => {
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
      return Jc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Jc(r, e);
  }
  return e;
}, Tr = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Ei = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return As(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Ei(s, e + 1);
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
    const i = Ei(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && As(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && As(n.testnet) ? n.testnet.trim() : null;
}, kd = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, xg = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && S6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, qr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Ce(n == null ? void 0 : n.message) ?? Ce(e.message) ?? Ce(e.error) ?? Ce(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Fs = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw qr(e);
    if (e.status === "error")
      throw qr(e.result ?? e);
  }
  return t;
}, Cd = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Fs(r);
  } catch (r) {
    throw qr(r);
  }
}, Sg = () => bg(), pu = () => {
  if (typeof window > "u")
    return;
  const t = ss();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Cn(t, e) ?? (t === window ? void 0 : Cn(window, e));
    if (n)
      return n;
  }
}, Bd = () => {
  if (typeof window > "u")
    return;
  const t = pu();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = ss();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Cn(e, n) ?? (e === window ? void 0 : Cn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, mo = (t) => {
  var r, s;
  const e = Or();
  if (ma(e) || wg(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ss() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Sg();
}, Wa = (t) => {
  const e = C6(t);
  if (!e)
    return null;
  try {
    const n = hu(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ro = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Wa(t), r = k6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Ce(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ro(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Ld)
    if (Wa(s[a])) {
      i = Ce(s[a]);
      break;
    }
  const o = Ce(s.txId) || Ce(s.txid) || Ce(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Ce(s.txRaw) ?? void 0
    };
  for (const a of Ld) {
    const c = Wa(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Ce(s[a]) ?? void 0
      };
  }
  for (const a of A6) {
    const c = s[a], u = Ro(c, e + 1);
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
}, Xa = (t) => {
  const e = Ro(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, B6 = (t) => {
  const e = Ro(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, T6 = (t) => ({
  ...t,
  fee: Tr(t.fee),
  nonce: Tr(t.nonce),
  sponsored: t.sponsored === !0
}), Td = (t) => ({
  recipient: t.recipient,
  amount: Tr(t.amount) ?? "0",
  memo: t.memo,
  network: Jc(t.network),
  address: t.stxAddress,
  fee: Tr(t.fee),
  nonce: Tr(t.nonce),
  sponsored: t.sponsored ?? !1
}), Eg = "WALLET_ADDRESS_MISMATCH", M6 = 45e3;
let li = null;
const tl = (t) => {
  t && (li = { address: t, at: Date.now() });
}, _6 = () => {
  li = null;
}, U6 = () => li && Date.now() - li.at <= M6 ? li.address : null, N6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, H6 = async (t) => {
  _6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Fs(await t.request("wallet_connect")), n = Ei(e);
  return tl(n), n;
}, P6 = async (t, e, n, r) => {
  try {
    return Fs(await t.request(e, n));
  } catch (s) {
    const i = qr(s);
    if (!N6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await H6(t);
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
        { code: o ? Eg : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Fs(await t.request(e, n));
    } catch (a) {
      throw qr(a);
    }
  }
};
let Md = 3e4;
const O6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Md / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Md);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, D6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Eg }
      );
    return c;
  }, s = U6();
  if (s)
    return co(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  co(n, "account-read");
  try {
    const c = Fs(
      await O6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Ei(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (xg(c))
      throw qr(c);
    co(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return tl(i), r(i, "wallet_getAccount");
  let o;
  co(n, "account-reconnect");
  try {
    o = Fs(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), qr(c);
  }
  const a = Ei(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return tl(a), r(a, "wallet_connect");
}, j6 = async (t, e) => {
  if (!mo(t)) {
    const i = await Cd(
      t,
      "stx_transferStx",
      Td(e)
    );
    return Xa(i);
  }
  const n = pu();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Cd(
      n,
      "stx_transferStx",
      Td(e)
    );
    return Xa(i);
  }
  const r = Sg();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await D6(r, e.stxAddress);
  const s = await P6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Tr(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Tr(e.fee) } : {}
    },
    e.stxAddress
  );
  return Xa(s);
}, F6 = () => Or(), Ag = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Or(), e = t ? v6(t) : void 0;
  if (e)
    return e;
  const n = ss() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, _d = (t, e) => {
  const n = Ag(), r = T6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, B6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return so(r, e);
  if (mo(n) && !pu()) {
    const s = Bd();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Or(),
        route: "legacy-transaction-request"
      }), so(r, s);
  }
  return void j6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (kd(s) && mo(n)) {
      const a = Bd();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Or(),
          route: "legacy-transaction-request"
        }), so(r, a);
        return;
      }
    }
    if (kd(s) && !mo(n)) {
      so(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), xg(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Ud = (t) => lg(t).replace(/^0x/, ""), Nd = "This wallet cannot sign messages. Try Xverse or Leather.", Hd = (t) => typeof (t == null ? void 0 : t.request) == "function", Pd = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", z6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, R6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function G6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Ud(e.message),
    domain: Ud(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function K6(t, e) {
  const n = await OE({
    domain: e.domain,
    message: e.message,
    network: ha(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Od(t) {
  var s, i;
  const e = F6() || "", n = /xverse/i.test(e);
  let r = Ag();
  if (n && !Pd(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Pd(r))
    try {
      return await K6(r, t);
    } catch (o) {
      if (n || !Hd(r) || !R6(o)) throw o;
    }
  if (!n && Hd(r))
    try {
      return await G6(r, t);
    } catch (o) {
      throw z6(o) ? new Error(Nd) : o;
    }
  throw new Error(Nd);
}
const Dd = 1000000n, ui = 1000000n, el = 50n, zs = 3000n, xa = 300n, V6 = 3000n, q6 = 50000n, jd = 200n, Rs = (t) => t + el;
function vn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Dd}.${(n % Dd).toString().padStart(6, "0")}`;
}
function W6(t, e = xa) {
  return t <= zs ? 0 : Number((t - zs) / Rs(e));
}
function Fd(t, e = 0n) {
  const n = ui - t - e;
  return n > 0n ? n : 0n;
}
function X6(t, e = xa) {
  return t > ui ? "over" : t < zs + Rs(e) ? "empty" : t < q6 ? "low" : "ok";
}
const Y6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", Z6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", Q6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function J6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || Q6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== Y6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const $g = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Ya = 3, t5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [nl, vg] = $g.split("."), Pe = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function rl(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function e5(t) {
  return Pe(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Wr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Ig(t, e = []) {
  const n = await Wr(`/v2/contracts/call-read/${nl}/${vg}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: nl, arguments: e.map((r) => "0x" + Pe(Xt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Ln(Fe(n.result));
}
async function n5() {
  const t = await Wr(`/v2/contracts/source/${nl}/${vg}?proof=0`);
  if (typeof t.source != "string" || await e5(t.source) !== Z6) throw Error("Deployed source does not match the tested helper.");
  if (J6(await Ig("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Lg(t) {
  return t.startsWith("SP") && As(t) && !t.includes(".");
}
async function r5(t) {
  var r;
  if (!Lg(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Wr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Wr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function s5(t) {
  const e = await Wr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function i5(t, e) {
  var s, i;
  const n = await Ig("get-owner", [ci(t), ci(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Lg(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function o5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: rl(t), signal: AbortSignal.timeout(15e3) });
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
async function a5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function c5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = hu(rl(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || xs(ni(jo.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || xs(r.contractAddress) + "." + r.contractName.content !== $g || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Pe(Xt(r.functionArgs[0])) !== Pe(Xt(ci(t.core))) || Pe(Xt(r.functionArgs[1])) !== Pe(Xt(ci(t.song))) || Pe(Xt(r.functionArgs[2])) !== Pe(Xt(x6(rl(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ps.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== wi.Equal || i.principal.prefix !== 2 || xs(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || xs(r.contractAddress) + "." + r.contractName.content !== t5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Pe(Xt(r.functionArgs[0])) !== Pe(Xt(ci(t.song))) || typeof t.liked != "boolean" || Pe(Xt(r.functionArgs[1])) !== Pe(Xt(m6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ps.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Ln(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const l5 = "xtrata.xyz/radio/listening-wallet", u5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Go = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && As(t), f5 = (t) => ({
  domain: mi({ name: qe(l5), version: qe("1"), "chain-id": ur(1) }),
  message: mi({
    purpose: qe(u5),
    main: qe(t.main),
    listening: qe(t.listening),
    issued: ur(t.issued)
  })
}), zd = ["prepared", "signed", "unknown", "pending"], d5 = 30 * 6e4, hs = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, h5 = 3e3, Rd = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function p5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = !1, d = !1, l = !1, y = null, h = !1, g = "", w = "", v, _ = null, U, b = [], L, E = -1 / 0;
  const D = /* @__PURE__ */ new Set();
  let G = null, j = !1, K = 0, m = !1, k = !1, N = !1, X = !1, nt = 0, W = null, Nt = Promise.resolve();
  const bt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? xa.toString()), _t = (x) => !!i && !(i.features ?? []).includes(x), S = (x, T) => `xtrata.ppp.v1.${x}:${T}`, M = (x = i == null ? void 0 : i.address) => {
    if (!x) return [];
    try {
      const T = JSON.parse(t.store.get(S("entries", x)) || "[]");
      return Array.isArray(T) ? T : [];
    } catch {
      return [];
    }
  }, I = (x) => {
    const T = [x, ...M(x.address).filter((V) => !(V.txid === x.txid && V.kind === x.kind))].slice(0, 200);
    t.store.set(S("entries", x.address), JSON.stringify(T));
  }, H = (x = i == null ? void 0 : i.address) => !!x && t.store.get(S("on", x)) !== "0", P = (x) => {
    i != null && i.address && t.store.set(S("on", i.address), x ? "1" : "0");
  }, q = () => M().filter((x) => zd.includes(x.status)), et = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(S("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, It = (x) => {
    i != null && i.address && t.store.set(S("deposit", i.address), JSON.stringify(x));
  }, Jt = () => q().filter((x) => t.now() - x.created > d5 && D.has(x.txid)), ze = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), jt = () => ze() && !(i != null && i.linked), ue = () => {
    const x = t.main();
    return !jt() && !!x && !!(i != null && i.linked) && i.linked !== x;
  }, Ae = (x) => S("return-to", x), kt = (x = i == null ? void 0 : i.address) => {
    if (!x) return;
    const T = t.store.get(Ae(x));
    return T && Go(T) && T !== x ? T : void 0;
  }, qt = (x = i == null ? void 0 : i.address) => G && G.for === x ? G.res : null;
  function ne() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const x = kt();
    if (x) return { to: x, kind: "chosen" };
    const T = qt();
    if (T != null && T.ok && T.funder) return { to: T.funder, kind: "funder" };
  }
  function Ut() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const x = t.main();
    if (!jt()) {
      if (!x) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : ue() ? "wrong-wallet" : i.state === "known" ? "locked" : !jt() && i.linked !== x ? "link" : o === void 0 ? "loading" : o > ui ? "over" : o < zs + Rs(bt()) ? "fund" : "ready" : "loading";
  }
  const f = () => {
    var x, T, V, St;
    return {
      step: Ut(),
      busy: c,
      message: g,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : X6(o, bt()),
      playsLeft: o === void 0 ? 0 : W6(o, bt()),
      allowance: o === void 0 ? ui : Fd(o, BigInt(((x = et()) == null ? void 0 : x.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: H(),
      entries: M(),
      depositTxid: ((T = et()) == null ? void 0 : T.txid) ?? v,
      depositPending: !!et(),
      walletOutdated: _t("like"),
      linkedListening: L && L === t.main() ? b.map((R) => R.listening) : [],
      serverLinked: !!_ && U === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Jt().length,
      armed: N,
      queued: Qt.length,
      solo: jt(),
      returnTo: (V = ne()) == null ? void 0 : V.to,
      returnToKind: (St = ne()) == null ? void 0 : St.kind,
      funderState: (() => {
        const R = qt();
        return R ? R.ok ? R.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const R = qt();
        return !!R && R.ok && R.distinct > 1;
      })(),
      walletCannotSolo: jt() && _t("standalone"),
      walletCannotMulti: _t("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((R) => R !== t.main() && R !== (i == null ? void 0 : i.linked))
    };
  }, A = (x, T = "") => {
    g = x, w = T, t.changed();
  };
  async function B(x, T) {
    if (!c) {
      c = x, w = "", t.changed();
      try {
        await T();
      } catch (V) {
        const St = V instanceof Error ? V.message : String(V);
        w = /Cancelled in the listening wallet/.test(St) ? "" : St, w || (g = "Not now. Nothing was signed.", X = !0);
      } finally {
        c = null, await $e(!0);
      }
    }
  }
  const Z = () => !!(e != null && e.enabled) && e.here && (jt() || !!t.main() && e.allowed), dt = () => Z() && !ue(), $t = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", se = () => {
    if (ue()) throw new Error($t());
  };
  async function te() {
    if (!Z()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Wt = (x) => {
    const T = t.main();
    return x.request("listening.status", T ? { main: T } : void 0);
  };
  async function Qe(x = !1) {
    i != null && i.address && (!x && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function wr(x) {
    if ((L !== x || t.now() - E >= 6e4) && (b = await t.links(x), L = x, E = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === x) return;
    const T = `${x}:${i.address}`;
    U === T && _ || (_ = b.find((V) => V.listening === i.address) ?? null, U = T);
  }
  async function _n() {
    const x = i == null ? void 0 : i.address;
    if (!jt() || !x || i != null && i.linked || !t.funder || j || !o || o <= 0n) return;
    const T = qt(x);
    if (T != null && T.ok && T.funder) return;
    const V = T != null && T.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, K - 1), 30 * 6e4);
    if (!(G && G.for === x && t.now() - G.at < V)) {
      j = !0;
      try {
        G = { for: x, res: await t.funder(x), at: t.now() };
      } catch {
        G = { for: x, res: { ok: !1 }, at: t.now() };
      } finally {
        j = !1;
      }
      K = G.res.ok ? 0 : K + 1;
    }
  }
  async function fe() {
    var St;
    const x = i == null ? void 0 : i.address;
    if (!x) return;
    let T;
    for (const R of q())
      try {
        const Ct = await t.chain.transaction(R.txid);
        if (!Ct) {
          if (D.add(R.txid), t.now() - R.created > 15 * 6e4 && (T ?? (T = await t.chain.confirmedNonce(x))), T !== void 0 && T > BigInt(R.nonce)) {
            I({ ...R, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((R.status === "unknown" || R.status === "signed") && R.raw)
            try {
              await t.chain.broadcast(R.raw, R.txid), I({ ...R, status: "pending" });
            } catch (Ht) {
              hs(Ht) && I({ ...R, status: "failed", note: Ht.message, raw: void 0 });
            }
          continue;
        }
        D.delete(R.txid);
        const pt = String(Ct.tx_status);
        if (pt === "success" && Ct.canonical !== !1 && Ct.is_unanchored === !1) {
          if (I({ ...R, status: "confirmed", confirmedAt: t.now(), actualFee: String(Ct.fee_rate ?? R.fee), raw: void 0 }), R.kind === "like" && (h = !0, R.status !== "confirmed" && typeof R.liked == "boolean"))
            try {
              (St = t.likeConfirmed) == null || St.call(t, R.song, R.liked);
            } catch {
            }
        } else pt.startsWith("abort_") || pt.startsWith("dropped_") ? I({ ...R, status: "failed", note: pt, raw: void 0 }) : R.status !== "pending" && I({ ...R, status: "pending" });
      } catch {
      }
    const V = et();
    if (V)
      try {
        const R = await t.chain.transaction(V.txid), Ct = String((R == null ? void 0 : R.tx_status) ?? "");
        (Ct === "success" && R.is_unanchored === !1 || Ct.startsWith("abort_") || Ct.startsWith("dropped_") || !R && t.now() - V.at > 2 * 36e5) && (It(null), a = -1 / 0);
      } catch {
      }
  }
  async function $e(x = !1) {
    var T;
    try {
      const V = t.main();
      if ((x || !e || r !== V || t.now() - n > 3e5) && (e = await t.config(V), n = t.now(), r = V), !e.enabled || !e.here || !jt() && (!V || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), N && Et(), t.changed();
        return;
      }
      await te(), i = await Wt(s), ue() && i.state === "unlocked" && (tn(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Wt(s)), V && e.allowed && await wr(V), await Qe(x), await _n(), await fe();
    } catch (V) {
      w = V instanceof Error ? V.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (Ut() === "locked" ? yt() : N && Et(), h) {
      h = !1;
      try {
        (T = t.likesChanged) == null || T.call(t);
      } catch {
      }
    }
    t.changed(), Qt.length && !Ne && Hn();
  }
  async function Je(x, T) {
    var Ct;
    se();
    const V = !(i != null && i.address) || H(i.address), St = i != null && i.linked ? (Ct = t.nameOf) == null ? void 0 : Ct.call(t, i.linked) : void 0;
    await x.request("listening.unlock", { mode: "unlock", terms: V ? Ft() : void 0, anyPasskey: T, ...t.main() ? { main: t.main() } : {}, ...St ? { label: St } : {} }), i = await Wt(x), V && (H(i.address) ? await we() : await x.request("listening.stop")), A(V ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const R = y;
    y = null, R && t.now() - R.at < 12e4 && setTimeout(() => void $e(!0).then(() => Y(R)), 0);
  }
  function yt() {
    N || c || X || nt >= 3 || !s || !(i != null && i.address) || (N = !0, Nt = (async () => {
      try {
        await Je(s, !1), nt = 0;
      } catch (x) {
        const T = x instanceof Error ? x.message : String(x);
        /Cancelled in the listening wallet/.test(T) ? W || (X = !0, A("Not now. Nothing was signed.")) : /did not answer/.test(T) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (nt++, w = T);
      } finally {
        N = !1;
        const x = W;
        W = null, x ? await x() : await $e(!0);
      }
    })());
  }
  async function Et(x) {
    N && (W = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Nt), x && await x(), t.changed();
  }
  const Ft = () => ({
    fee: bt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: ui.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function we() {
    if (!(i != null && i.address)) return !1;
    if (k || (k = await t.tabLock(i.address)), !k)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const br = {
    forceRefresh: () => $e(!0),
    create: () => B("Waiting for your passkey…", async () => {
      const x = await te();
      await x.request("listening.unlock", { mode: "create", terms: Ft(), ...t.main() ? { main: t.main() } : {} }), i = await Wt(x), P(!0), A(jt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await we();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (x, T) => {
      !(i != null && i.address) || et() || (It({ txid: x, amount: T.toString(), at: t.now() }), a = -1 / 0, A("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    unlock: (x = !1) => {
      const T = () => B("Waiting for your passkey…", async () => Je(await te(), x));
      return N ? x ? _t("cancel") ? (A("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Et(async () => {
        (Ut() === "locked" || Ut() === "intro") && await T();
      }) : Nt : T();
    },
    link: () => B("Sign in your wallet…", async () => {
      se();
      const x = t.main();
      if (!x || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const T = (await t.links(x)).find((V) => V.listening === i.address);
      if (T)
        await s.request("listening.link", { main: x, issued: T.issued, mainSignature: T.mainSignature });
      else {
        const V = { main: x, listening: i.address, issued: t.now() }, St = await t.signWithMain(x, f5(V)), R = await s.request("listening.link", { main: x, issued: V.issued, mainSignature: St });
        await t.saveLink({ ...V, mainSignature: St, listeningSignature: R.listeningSignature }), E = -1 / 0;
      }
      A("Linked ✓");
    }),
    deposit: () => B("Approve the deposit in your wallet…", async () => {
      se();
      const x = t.main();
      if (!x || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (et()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Qe(!0);
      const T = Fd(o ?? 0n);
      if (T <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      v = await t.deposit(x, i.address, T), v && It({ txid: v, amount: T.toString(), at: t.now() }), A("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => B("Confirm in the listening wallet…", async () => {
      if (!dt()) throw new Error("Connect your wallet first.");
      await we(), await s.request("listening.approveSession", Ft()), P(!0), A("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => B("Clearing…", async () => {
      for (const x of Jt())
        await t.chain.transaction(x.txid) || I({ ...x, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      A("Cleared ✓");
    }),
    switchOff: () => B("Switching off…", async () => {
      tn(), await (s == null ? void 0 : s.request("listening.stop")), P(!1), A("Paying is off. Music stays free.");
    }),
    lock: () => B("Locking…", async () => {
      tn(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, A("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (x) => {
      const T = String(x ?? "").trim();
      if (!(i != null && i.address)) return A("", "Unlock the listening wallet first.");
      if (!Go(T)) return A("", "Enter a standard mainnet address (it starts with SP).");
      if (T === i.address) return A("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Ae(i.address), T), A("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(Ae(i.address), ""), t.changed();
    },
    returnFunds: (x) => B("Check the return in the listening wallet…", async () => {
      if (!dt()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      const T = ne();
      if (!T) throw new Error(jt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (T.kind !== "linked" && _t("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (q().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: V, nonce: St } = await t.chain.account(i.address);
      o = V;
      const R = await s.request("listening.prepareReturn", {
        mode: x,
        balance: V.toString(),
        nonce: St.toString(),
        fee: V6.toString(),
        ...T.kind === "linked" ? {} : { destination: T.to }
      });
      if (R.recipient !== T.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
      const Ct = hu(R.raw);
      if (Ln(Ct.payload.recipient).value !== T.to || String(Ct.payload.amount) !== R.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const pt = {
        id: Rd(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: R.recipient,
        amount: R.amount,
        fee: R.fee,
        nonce: St.toString(),
        created: t.now(),
        status: "signed",
        raw: R.raw,
        txid: R.txid
      };
      t.validate(pt), I(pt);
      try {
        await t.chain.broadcast(R.raw, R.txid), I({ ...pt, status: "pending" });
      } catch (Ht) {
        throw I({ ...pt, status: "unknown", note: Ht.message }), Ht;
      }
      x === "all" && P(!1), A(x === "all" ? T.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Qt = [], Un = 10, Ue = 30 * 6e4;
  let Ne = !1;
  const Nn = () => u || !!c || d || l, tn = () => {
    Qt.length && (Qt.length = 0, t.changed());
  };
  async function en(x) {
    if (!Qt.some((T) => T.id === x.id) && !M().some((T) => T.id === x.id) && (Qt.push({ ...x, at: t.now() }), Qt.length > Un && Qt.shift()), Nn() || q().length) {
      const T = Qt.length;
      g = `Queued ${T === 1 ? "this song" : T + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Hn();
  }
  async function Hn() {
    if (!Ne) {
      Ne = !0;
      try {
        for (; Qt.length; ) {
          for (; Qt.length && t.now() - Qt[0].at > Ue; ) Qt.shift();
          if (!Qt.length || Nn() || await is(Qt[0]) === "wait") return;
          Qt.shift();
        }
      } finally {
        Ne = !1, t.changed();
      }
    }
  }
  async function is(x) {
    u = !0;
    try {
      await $e();
      const T = Ut();
      if (T === "loading") return "wait";
      if (T !== "ready" || !H() || !(i != null && i.session) || i.session.playsLeft < 1 || !k) return "done";
      if (q().length) return "wait";
      m || (await t.chain.verify(), m = !0);
      const V = i.address, { balance: St, nonce: R } = await t.chain.account(V);
      o = St, a = t.now();
      const Ct = await t.chain.owner(Ya, x.song);
      if (Ct === V || Ct === t.main()) return "done";
      const pt = await s.request("listening.signPlay", {
        core: Ya,
        song: x.song,
        receipt: x.id,
        fee: bt().toString(),
        nonce: R.toString(),
        balance: St.toString()
      }), Ht = {
        id: x.id,
        address: V,
        kind: "play",
        core: Ya,
        song: x.song,
        recipient: Ct,
        amount: "50",
        fee: bt().toString(),
        nonce: R.toString(),
        created: t.now(),
        status: "signed",
        raw: pt.raw,
        txid: pt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      t.validate(Ht), I(Ht);
      const ie = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`;
      try {
        await t.chain.broadcast(pt.raw, pt.txid), I({ ...Ht, status: "pending" }), g = `♪ Paid ${ie}`, w = "";
      } catch (nn) {
        I({ ...Ht, status: hs(nn) ? "failed" : "unknown", note: nn.message, ...hs(nn) ? { raw: void 0 } : {} }), w = nn.message;
      }
      return i = await Wt(s), "done";
    } catch (T) {
      return g = "This song played free: " + (T instanceof Error ? T.message : "payment unavailable"), "done";
    } finally {
      u = !1, t.changed();
    }
  }
  function os(x) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Ut()) || _t("like") ? !1 : (Y(x), !0);
  }
  async function Y(x) {
    const T = x.title ? `“${x.title}”` : `song #${x.song}`, V = (ve) => {
      var rn;
      w = ve, g = "";
      try {
        (rn = t.likeFailed) == null || rn.call(t, x.song);
      } catch {
      }
      t.changed();
    }, St = Ut(), R = t.main(), Ct = jt() ? i == null ? void 0 : i.address : R;
    if (St === "locked") {
      y = { ...x, at: t.now() }, A(`Unlock to like ${T}. It sends straight after.`);
      return;
    }
    if (St === "wrong-wallet") return V($t());
    if (St === "link") return V("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (jt() && _t("standalone")) return V("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (St === "fund") return V("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (St === "over") return V("Return the excess first: the listening wallet holds more than 1 STX.");
    if (St !== "ready" || !Ct) return V("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return V("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!k) return V("Pay-per-play is running in another tab. Like from that tab.");
    const pt = M().find((ve) => ve.kind === "like" && ve.song === x.song);
    if (pt && zd.includes(pt.status))
      return V(`Your last like for ${T} is still on its way. It can change again once it confirms.`);
    if (d) return V("One like at a time: your last one is still being sent.");
    if ((pt == null ? void 0 : pt.status) === "confirmed" && t.now() - (pt.confirmedAt ?? 0) < h5)
      return V(`Your like for ${T} has only just confirmed. Try again in a moment.`);
    let Ht;
    l = !0;
    try {
      Ht = t.likeState ? (await t.likeState(Ct, x.song)).by : x.likedBy ?? [];
    } catch {
      Ht = x.likedBy;
    } finally {
      l = !1;
    }
    if (!Ht) return V(`Could not check ${T} right now. Try the heart again.`);
    const ie = i.address, xn = ((pt == null ? void 0 : pt.status) === "confirmed" && typeof pt.liked == "boolean" && t.now() - (pt.confirmedAt ?? pt.created) < 5 * 6e4 ? pt.liked : void 0) ?? Ht.includes(ie);
    if (!xn && Ht.some((ve) => ve !== ie)) return V(jt() ? `${T} was liked from another wallet of yours. Unlike it there.` : `${T} was liked from your main wallet${Ht.includes(R) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await rt({ song: x.song, liked: !xn, title: x.title, artist: x.artist });
  }
  async function rt(x) {
    var St, R, Ct;
    if (d) {
      A("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const T = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`, V = t.wait ?? ((pt) => new Promise((Ht) => setTimeout(Ht, pt)));
    try {
      A(`${x.liked ? "Liking" : "Unliking"} ${T}…`);
      const pt = t.now() + 12e4;
      for (; u || q().length; ) {
        if (t.now() > pt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await V(5e3), await $e(!0);
      }
      if (Ut() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const Ht = i.address, { balance: ie, nonce: nn } = await t.chain.account(Ht);
      o = ie, a = t.now();
      const xn = await s.request("listening.signLike", {
        song: x.song,
        liked: x.liked,
        fee: jd.toString(),
        nonce: nn.toString(),
        balance: ie.toString()
      }), ve = {
        id: Rd(),
        address: Ht,
        kind: "like",
        core: 0,
        song: x.song,
        liked: x.liked,
        recipient: "",
        amount: "0",
        fee: jd.toString(),
        nonce: nn.toString(),
        created: t.now(),
        status: "signed",
        raw: xn.raw,
        txid: xn.txid,
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      t.validate(ve), I(ve);
      try {
        await t.chain.broadcast(xn.raw, xn.txid), I({ ...ve, status: "pending" }), g = `${x.liked ? "♥ Liked" : "Unliked"} ${T}`, w = "";
        try {
          (St = t.likeSent) == null || St.call(t, x.song, x.liked);
        } catch {
        }
      } catch (rn) {
        if (I({ ...ve, status: hs(rn) ? "failed" : "unknown", note: rn.message, ...hs(rn) ? { raw: void 0 } : {} }), w = rn.message, hs(rn)) try {
          (R = t.likeFailed) == null || R.call(t, x.song);
        } catch {
        }
      }
      i = await Wt(s);
    } catch (pt) {
      w = "Like not sent: " + (pt instanceof Error ? pt.message : "the listening wallet is unavailable");
      try {
        (Ct = t.likeFailed) == null || Ct.call(t, x.song);
      } catch {
      }
    } finally {
      d = !1, t.changed(), Hn();
    }
  }
  return { snapshot: f, refresh: $e, onListened: en, heart: os, toggleLike: Y, ...br };
}
const kg = ["Connect", "Passkey", "Link & fund", "Listen"], Cg = ["Passkey", "Add 1 STX", "Listen"], sl = (t) => t ? Cg : kg;
function g5(t) {
  if (t.solo) return y5(t);
  const e = kg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function y5(t) {
  const e = Cg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function w5(t, e) {
  return !e || e.at >= sl(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") ? !1 : !(t.step === "locked" && t.linked);
}
const b5 = 100000n, m5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function x5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Go(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= b5).sort(m5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const lo = 50;
function Gd(t) {
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
async function S5(t, e, n = 4) {
  if (!Go(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${lo}&offset=${o}`, s = Gd(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - lo);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= lo ? s : Gd(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = x5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - lo);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const E5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function A5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !E5(r.id)));
}
const $5 = {}, v5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, I5 = (t) => {
  const e = $5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, L5 = (t) => `/hiro/${t}`, k5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, C5 = (t) => {
  const e = I5(t);
  if (e)
    return [k5(e)];
  const n = v5[t];
  return typeof window < "u" ? [`${window.location.origin}${L5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, B5 = {}, Kd = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, T5 = "xtrata.log.enabled", M5 = "xtrata.log.level", _5 = "xtrata.log.tags", U5 = "xtrata.log.dedupe", uo = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, N5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, H5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, P5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, O5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, D5 = () => {
  const t = B5 ?? {}, e = uo(T5) ?? t.VITE_LOG_ENABLED, n = uo(M5) ?? t.VITE_LOG_LEVEL, r = uo(_5) ?? t.VITE_LOG_TAGS, s = uo(U5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: N5(e),
    level: H5(n) ?? "warn",
    tags: O5(r),
    dedupe: P5(s)
  };
}, j5 = (t, e, n) => !t.enabled || Kd[n] < Kd[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), F5 = (t, e, n, r) => {
  const s = D5();
  if (!j5(s, e, t) || R5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, z5 = /* @__PURE__ */ new Set();
let Vd = null;
const R5 = (t, e, n, r, s) => (Vd !== t && (z5.clear(), Vd = t), !1), G5 = (t, e, n) => F5("debug", t, e, n), K5 = {}, V5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, q5 = (t) => {
  const e = K5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : V5[t];
}, W5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, X5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return W5.test(n) ? n : null;
}, Y5 = (t) => t.replace(/\/+$/, ""), Z5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), qd = (t) => {
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
}, ps = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Q5 = (t) => {
  var c, u;
  let e;
  try {
    e = Ln(e6(t));
  } catch {
    return null;
  }
  const n = ps(e);
  if (!n || n.success === !1)
    return null;
  const r = ps(n.value), s = ps(r == null ? void 0 : r.value), i = ps(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = qd((c = ps(i.name)) == null ? void 0 : c.value), a = qd((u = ps(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : X5(`${o}.${a}`);
}, J5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Y5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [lg(Vp(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : Q5(i.result);
}, t$ = async (t) => {
  const e = t.address.trim();
  if (!As(e))
    return null;
  const n = q5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of C5(t.network))
    try {
      return await J5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return G5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: Z5(r)
  }), null;
};
function e$(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, i = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((u) => {
      c.pending = !1, u && (c.name = u, e());
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
const Wd = Object.freeze({
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
function n$(t, e = "") {
  return Object.hasOwn(Wd, String(t)) ? Wd[String(t)] : e;
}
const Xd = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function r$(t, e = "") {
  return Object.hasOwn(Xd, String(t)) ? Xd[String(t)] : e;
}
const s$ = 100000n, i$ = 1000000n, o$ = 3000n, a$ = (t, e) => `${t}#gift=${e}`, c$ = 100, Yd = (t, e = xa) => t <= zs ? 0 : Number((t - zs) / Rs(e)), Zd = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), l$ = "xtrata.xyz/radio/gifts", u$ = "Create Xtrata radio gift links paid from the gift treasury", f$ = (t) => ({
  domain: mi({ name: qe(l$), version: qe("1"), "chain-id": ur(1) }),
  message: mi({
    purpose: qe(u$),
    admin: qe(t.admin),
    count: ur(t.count),
    amount: ur(BigInt(t.amount)),
    label: qe(t.label),
    issued: ur(t.issued)
  })
}), Qd = 1800, Za = /* @__PURE__ */ new Map();
async function Bg(t) {
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
async function d$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await Bg(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function Tg(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Za.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Za.set(t, { ...a, until: Date.now() + Qd });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Za.delete(t), s();
      }, Qd + 50);
    }
  }, i;
}
const Ko = (t, e, n, r, s) => Tg(t, e, async () => await Bg(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), gs = "xtrata.radio.gift.incoming.v1", Jd = (t) => "xtrata.radio.gift.mine.v1:" + t, mt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Qa = (t, e, n = "") => {
  const r = mt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, ys = (t) => vn(t).replace(/\.?0+$/, "");
function h$(t) {
  let e = null;
  const n = (() => {
    try {
      const I = new URL(location.href), H = new URLSearchParams(I.hash.slice(1)).get("gift") ?? I.searchParams.get("gift");
      return H !== null && (I.searchParams.delete("gift"), history.replaceState(null, "", I.pathname + (I.search || ""))), Zd(H) ? H : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const I = JSON.parse(t.store.get(gs) || "null");
      return Zd(I == null ? void 0 : I.code) ? I.code : null;
    } catch {
      return null;
    }
  })(), s = n ?? r;
  s && (e = { code: s }, t.store.set(gs, JSON.stringify({ code: s, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (I) => {
    const H = await I.json().catch(() => ({}));
    if (!I.ok)
      throw I.status === 404 && t.store.set(gs, null), new Error((H == null ? void 0 : H.error) || "Could not check your gift right now. Reload to try again.");
    const P = H;
    e = { ...e, view: P }, ["claimed", "expired", "refunding", "refunded"].includes(P.status) && t.store.set(gs, null), t.changed();
  }).catch((I) => {
    e = { ...e, error: I.message }, t.changed();
  }));
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = (I) => I.from ? t.who(I.from) : I.label ? `Xtrata Radio · ${I.label}` : "Xtrata Radio";
  let a = {};
  const c = (I) => {
    if (a.box) return a.box;
    const H = mt("div", "", "ppp-gift-check");
    a.box = H;
    const P = () => {
      const q = window.turnstile;
      !q || a.rendered || (a.rendered = !0, q.render(H, { sitekey: I, callback: (et) => {
        a.token = et, t.changed();
      }, "expired-callback": () => {
        a.token = void 0;
      } }));
    };
    if (window.turnstile) P();
    else {
      const q = document.createElement("script");
      q.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", q.async = !0, q.onload = P, document.head.append(q);
    }
    return H;
  };
  let u;
  async function d(I) {
    var H, P;
    if (!(!e || e.claiming || !I.listening)) {
      e.claiming = !0, e.error = void 0, t.changed();
      try {
        const q = await fetch("/radio/gift/claim", {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(3e4),
          body: JSON.stringify({ code: e.code, wallet: I.listening, turnstile: a.token })
        }), et = await q.json().catch(() => ({}));
        if (q.status === 503 && /sending another gift/.test((et == null ? void 0 : et.error) || "")) {
          e.waiting = !0, clearTimeout(u), u = setTimeout(() => {
            e && (e.waiting = !1, t.changed());
          }, 12e3);
          return;
        }
        if (!q.ok)
          throw (q.status === 404 || q.status === 410 || q.status === 409 && /already had a gift|brand-new/.test((et == null ? void 0 : et.error) || "")) && t.store.set(gs, null), new Error((et == null ? void 0 : et.error) || `Could not claim the gift (${q.status}).`);
        e.done = !0, t.store.set(gs, null), t.giftSent(et.txid, BigInt(et.amount));
      } catch (q) {
        e.error = q.message, a.token = void 0;
        try {
          (P = (H = window.turnstile) == null ? void 0 : H.reset) == null || P.call(H, a.box);
        } catch {
        }
      } finally {
        e.claiming = !1, t.changed();
      }
    }
  }
  let l = null;
  function y(I) {
    if (!I.listening || !I.depositPending || I.step !== "fund")
      return l = null, [];
    if (!l || l.wallet !== I.listening || t.now() - l.at > 3e4) {
      const H = I.listening;
      l = { ...(l == null ? void 0 : l.wallet) === H ? l : {}, wallet: H, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(H)).then((P) => {
        var q, et;
        (l == null ? void 0 : l.wallet) === H && (l.state = (q = P == null ? void 0 : P.gift) == null ? void 0 : q.state, l.problem = ((et = P == null ? void 0 : P.gift) == null ? void 0 : et.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    return l.state === "sending" && l.problem ? [mt("p", `🎁 Your gift is waiting to go out (${l.problem}). It is retried automatically.`, "ppp-warn")] : [];
  }
  function h(I) {
    var jt, ue;
    const H = y(I);
    if (!e || ["off", "elsewhere"].includes(I.step)) return H;
    const P = e.view;
    if (e.error && !P) return [mt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!P) return [mt("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return H;
    if (P.status === "claimed" || P.status === "claiming") return [mt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(P.status)) return [mt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (P.status === "pending-deposit") return [mt("p", `🎁 ${o(P)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    const q = BigInt(P.amount), It = [mt("p", `🎁 ${o(P)} sent you ${ys(q)} STX of on-chain music: about ${Yd(q).toLocaleString()} paid plays.`, "ppp-gift")], Jt = !!I.listening && I.step === "fund" && (I.balance ?? 1n) === 0n && !I.depositPending && !I.entries.length, ze = (ue = (jt = I.gate) == null ? void 0 : jt.gifts) == null ? void 0 : ue.turnstileSiteKey;
    return Jt ? (ze && !a.token ? It.push(mt("p", "One quick check and it is yours:", "ppp-mute"), c(ze)) : !e.claiming && !e.error && !e.waiting && d(I), (e.claiming || e.waiting) && It.push(mt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && It.push(mt("p", e.error, "ppp-bad"), Qa("Try again", () => {
      e.error = void 0, d(I);
    }))) : I.step === "intro" ? It.push(mt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : I.listening && (I.balance ?? 0n) > 0n && It.push(mt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute")), It;
  }
  async function g(I, H, P) {
    var q;
    try {
      const et = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(I));
      if ((q = et == null ? void 0 : et.gift) != null && q.returnTo) return { ok: !0, funder: et.gift.returnTo, txId: et.gift.txid ?? void 0, amount: et.gift.amount, distinct: 1 };
    } catch {
      if (P) return { ok: !1 };
    }
    return H();
  }
  const w = mt("div", "", "ppp-gift-fold");
  let v = 250000n, _ = "", U = "", b = null;
  const L = (I) => {
    try {
      const H = JSON.parse(t.store.get(Jd(I)) || "[]");
      return Array.isArray(H) ? H : [];
    } catch {
      return [];
    }
  }, E = (I, H) => t.store.set(Jd(I), JSON.stringify(H.slice(0, 50)));
  let D = 0;
  async function G(I) {
    const H = L(I);
    for (const P of H)
      if (!(P.view && ["claimed", "refunded", "expired"].includes(P.view.status)))
        try {
          P.view = !P.view || P.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: P.id, ...P.txid ? { txid: P.txid } : {} }) }) : await t.json("/radio/gift?id=" + P.id), P.error = void 0;
        } catch (q) {
          P.error = q.message;
        }
    E(I, H), t.changed();
  }
  async function j(I) {
    if (_) return;
    _ = "Starting your gift…", U = "", t.changed();
    let H = null;
    try {
      H = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: I, amount: v.toString() }) });
      const P = L(I);
      P.unshift({ id: H.id, code: H.code, amount: v.toString(), at: t.now() }), E(I, P), _ = "Approve the gift in your wallet…", t.changed();
      const q = await t.pay(I, H.depositTo, BigInt(H.deposit), H.memo), et = L(I), It = et.find((Jt) => Jt.id === H.id);
      It && (It.txid = q, It.view = { status: "pending-deposit", amount: v.toString(), source: "friend", from: I, label: "", expires: 0 }), E(I, et), U = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", G(I);
    } catch (P) {
      U = P.message || "Not sent.";
    } finally {
      _ = "", t.changed();
    }
  }
  async function K(I, H, P, q) {
    if (!_) {
      _ = "Sign in your wallet…", U = "", b = null, t.changed();
      try {
        const et = { admin: I, count: H, amount: P.toString(), label: q, issued: t.now() }, It = await t.sign(I, f$(et));
        _ = "Making links…", t.changed();
        const Jt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: et, signature: It }) });
        b = { codes: Jt.codes, amount: Jt.amount };
      } catch (et) {
        U = et.message || "Not made.";
      } finally {
        _ = "", t.changed();
      }
    }
  }
  const m = (I, H) => a$(I || location.origin + "/radio.html", H), k = (I) => d$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: I }), N = mt("input");
  N.type = "range", N.min = String(s$), N.max = String(i$), N.step = "50000", N.value = String(v), N.setAttribute("aria-label", "Gift amount");
  const X = mt("p", "", "ppp-gift-amount"), nt = Qa("", () => {
    const I = t.main();
    I && j(I);
  }, "primary"), W = () => {
    X.textContent = Nt(), nt.textContent = `Gift ${ys(v)} STX`;
  };
  N.oninput = () => {
    v = BigInt(N.value), W();
  };
  const Nt = () => `${ys(v)} STX · about ${Yd(v).toLocaleString()} paid plays · you pay ${ys(v + o$)} STX with the network fee`;
  W();
  const bt = mt("input");
  bt.type = "number", bt.min = "1", bt.max = String(c$), bt.value = "10", bt.setAttribute("aria-label", "How many links");
  const _t = mt("input");
  _t.type = "number", _t.min = "0.1", _t.max = "1", _t.step = "0.05", _t.value = "0.1", _t.setAttribute("aria-label", "STX per link");
  const S = mt("input");
  S.maxLength = 40, S.placeholder = "Label, e.g. Launch week", S.setAttribute("aria-label", "Campaign label");
  function M(I) {
    var et, It, Jt, ze, jt;
    const H = (et = I.gate) == null ? void 0 : et.gifts;
    if (!(H != null && H.enabled) || ["off", "elsewhere", "unsupported"].includes(I.step)) return null;
    const P = t.main(), q = [mt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!P)
      q.push(mt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      nt.disabled = !!_, q.push(N, X, nt), t.now() - D > 3e4 && (D = t.now(), G(P));
      const ue = L(P);
      if (ue.length) {
        const Ae = mt("ul", "", "ppp-gift-list");
        for (const kt of ue.slice(0, 10)) {
          const qt = (It = kt.view) == null ? void 0 : It.status, ne = kt.error ? kt.error : !qt || qt === "pending-deposit" ? kt.txid ? "payment confirming…" : "waiting for your payment" : qt === "live" ? "ready to share" : qt === "claiming" || qt === "claimed" ? "claimed ✓" : qt === "refunding" ? "expired · refund on its way" : qt === "refunded" ? "expired · refunded to you" : qt, Ut = mt("li");
          if (Ut.append(mt("span", `${ys(BigInt(kt.amount))} STX`, "t"), mt("span", ne, ((Jt = kt.view) == null ? void 0 : Jt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((ze = kt.view) == null ? void 0 : ze.status) === "live") {
            const f = m(((jt = I.gate) == null ? void 0 : jt.radioUrl) ?? null, kt.code);
            Ut.append(Ko("gift-copy:" + kt.id, "Copy link", () => f, "tiny", t.changed), Tg("gift-share:" + kt.id, "Share", () => k(f), "tiny", t.changed));
          }
          Ae.append(Ut);
        }
        q.push(Ae);
      }
      if (H.admin) {
        const Ae = Qa("Sign and make links", () => {
          const ne = BigInt(Math.round(Number(_t.value) * 1e6));
          K(P, Number(bt.value), ne, S.value.trim());
        }), kt = mt("div", "", "ppp-gift-admin"), qt = (ne, Ut) => {
          const f = mt("label", ne);
          return f.append(Ut), f;
        };
        if (kt.append(mt("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"), qt("Links ", bt), qt("STX each ", _t), S, Ae), b) {
          const ne = b.codes.map((f) => {
            var A;
            return m(((A = I.gate) == null ? void 0 : A.radioUrl) ?? null, f);
          }).join(`
`), Ut = mt("textarea");
          Ut.readOnly = !0, Ut.value = ne, Ut.rows = Math.min(8, b.codes.length), kt.append(mt("p", `${b.codes.length} links, ${ys(BigInt(b.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), Ut, Ko("campaign-copy", "Copy all", () => ne, "tiny", t.changed));
        }
        q.push(kt);
      }
    }
    return _ && q.push(mt("p", _, "ppp-cyan")), U && q.push(mt("p", U, /✓/.test(U) ? "ppp-ok" : "ppp-warn")), w.replaceChildren(...q), w;
  }
  return { banner: h, funder: g, renderFold: M, liveGift: i };
}
const th = document.getElementById("ppp");
th && p$(th);
function p$(t) {
  var Ut;
  const e = Ky(), n = (f) => t.querySelector(f), r = n(".ppp-frame");
  let s = null;
  const i = async (f, A) => {
    const B = await fetch(f, { cache: "no-store", ...A, signal: AbortSignal.timeout(15e3) }), Z = await B.json().catch(() => ({}));
    if (!B.ok) throw new Error((Z == null ? void 0 : Z.error) || `Request failed (${B.status}).`);
    return Z;
  }, o = p5({
    now: Date.now,
    main: () => {
      const f = e.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    config: (f) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(f || "")),
    links: async (f) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(f))).links ?? [],
    saveLink: async (f) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
    },
    bridge: async (f) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${f}; publickey-credentials-create ${f}`), s.referrerPolicy = "no-referrer";
      const A = new Promise(($t, se) => {
        s.addEventListener("load", () => $t(), { once: !0 }), setTimeout(() => se(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = f + "/", r.replaceChildren(s), await A;
      const B = new Hy({ walletOrigin: f, frame: s, timeoutMs: 30 * 6e4 }), Z = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), dt = ($t, se) => Z.has($t) ? B.request($t, se) : Promise.race([
        B.request($t, se),
        new Promise((te, Wt) => setTimeout(() => Wt(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await dt("listening.status"), { request: dt };
    },
    chain: {
      verify: n5,
      balance: s5,
      account: r5,
      owner: i5,
      broadcast: o5,
      transaction: a5,
      confirmedNonce: async (f) => {
        const A = await Wr(`/v2/accounts/${f}?proof=0`);
        if (!Number.isSafeInteger(A == null ? void 0 : A.nonce) || A.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(A.nonce);
      }
    },
    signWithMain: (f, A) => Od({ ...A, network: "mainnet", stxAddress: f }),
    deposit: (f, A, B) => new Promise((Z, dt) => _d({
      recipient: A,
      amount: B.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: f,
      network: new Ja(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: ($t) => Z($t.txId || ""),
      onCancel: () => dt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: dt
    })),
    validate: c5,
    tabLock: (f) => new Promise((A) => {
      const B = navigator.locks;
      if (!(B != null && B.request)) {
        A(!0);
        return;
      }
      B.request("xtrata-ppp:" + f, { ifAvailable: !0 }, async (Z) => {
        A(!!Z), Z && await new Promise(() => {
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
      set: (f, A) => {
        try {
          localStorage.setItem(f, A);
        } catch {
        }
      }
    },
    changed: () => kt(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var A, B;
      return a.funder(f, () => S5(f, Wr), !!((B = (A = o.snapshot().gate) == null ? void 0 : A.gifts) != null && B.enabled));
    },
    likesChanged: () => {
      var f, A;
      (A = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || A.call(f);
    },
    likeState: async (f, A) => {
      const B = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: f, ids: String(A) })), Z = Array.isArray(B == null ? void 0 : B.rows) ? B.rows.find((dt) => (dt == null ? void 0 : dt.id) === A) : null;
      if (!Z || typeof Z.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: Z.liked, by: Array.isArray(Z.by) ? Z.by.filter((dt) => typeof dt == "string") : Z.liked ? [f] : [] };
    },
    likeSent: (f, A) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: f, liked: A } })),
    nameOf: (f) => L(f) ?? void 0,
    likeConfirmed: (f, A) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: A } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), a = h$({
    json: i,
    main: () => {
      const f = e.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, A, B, Z) => new Promise((dt, $t) => _d({
      recipient: A,
      amount: B.toString(),
      memo: Z,
      stxAddress: f,
      network: new Ja(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (se) => dt(se.txId || ""),
      onCancel: () => $t(new Error("Gift cancelled. Nothing was sent.")),
      onError: $t
    })),
    sign: (f, A) => Od({ ...A, network: "mainnet", stxAddress: f }),
    giftSent: (f, A) => o.giftSent(f, A),
    who: (f) => E(f),
    changed: () => kt(o.snapshot()),
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, A) => {
        try {
          A === null ? localStorage.removeItem(f) : localStorage.setItem(f, A);
        } catch {
        }
      }
    },
    now: Date.now
  });
  window.XtrataRadioLikeHandler = (f) => {
    if (!f || !Number.isSafeInteger(f.song) || f.song < 0) return !1;
    m();
    const A = k(f.song, { title: f.title, artist: f.artist });
    return o.heart({ song: f.song, title: A.title || void 0, artist: A.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let c;
  window.XtrataRadioListeningIdentity = () => {
    const f = o.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const u = (f) => {
    var B, Z;
    const A = window.XtrataRadioListeningIdentity();
    A !== c && (c = A, (Z = (B = window.XtrataRadio) == null ? void 0 : B.refreshLikes) == null || Z.call(B));
  }, d = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", l = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), y = (f) => {
    const A = Math.round((Date.now() - f) / 6e4);
    return A < 1 ? "now" : A < 60 ? `${A}m` : A < 1440 ? `${Math.round(A / 60)}h` : `${Math.round(A / 1440)}d`;
  }, h = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, g = (f, A = "", B = "") => {
    const Z = document.createElement(f);
    return A && (Z.textContent = A), B && (Z.className = B), Z;
  }, w = (f, A, B = "") => {
    const Z = g("button", f, B);
    return Z.type = "button", Z.onclick = A, Z;
  }, v = (f, A) => {
    const B = g("a", f);
    return B.href = A, B.target = "_blank", B.rel = "noopener", B;
  };
  let _ = null, U = !1;
  const b = e$((f) => t$({ address: f, network: "mainnet" }), () => kt(o.snapshot())), L = (f) => b.get(f), E = (f) => L(f) ?? d(f), D = (f) => f.slice(0, 2).map(E).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), G = /* @__PURE__ */ new Map();
  let j = !1;
  const K = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), m = () => {
    j || (j = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const A of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const B = Number(A == null ? void 0 : A.id);
        Number.isSafeInteger(B) && G.set(B, { title: typeof A.title == "string" ? A.title : void 0, artist: typeof A.artist == "string" ? A.artist : void 0 });
      }
      kt(o.snapshot());
    }).catch(() => {
      j = !1;
    }));
  }, k = (f, A) => {
    const B = G.get(f), Z = r$(f, [B == null ? void 0 : B.title, A == null ? void 0 : A.title].find(($t) => !K($t)) || ""), dt = n$(f, (B == null ? void 0 : B.artist) || (A == null ? void 0 : A.artist) || "");
    return { title: Z, artist: dt };
  }, N = (f) => {
    const { title: A, artist: B } = k(f.song, f);
    return A ? `“${A}”${B ? ` — ${B}` : ""}` : `Song #${f.song}${B ? ` — ${B}` : ""}`;
  }, X = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, nt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function W(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["OVER 1 STX", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function Nt(f, A, B = "", Z) {
    const dt = g("dt", f), $t = g("dd", A, B);
    return Z && $t.append(" ", Z), [dt, $t];
  }
  const bt = document.getElementById("ppp-top"), _t = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, S = () => {
    var A, B;
    const f = o.snapshot();
    if (f.step === "connect" || f.step === "wrong-wallet") {
      (A = document.getElementById("radio-wallet-connect")) == null || A.click();
      return;
    }
    if (f.step === "elsewhere" && ((B = f.gate) != null && B.radioUrl)) {
      location.href = f.gate.radioUrl;
      return;
    }
    f.step === "locked" && !f.armed && !f.busy && o.unlock(), f.step === "ready" && !f.payingOn && !f.busy && o.switchOn(), _t();
  };
  bt && (bt.onclick = S);
  function M(f) {
    if (!bt) return;
    const A = (Z, dt, $t) => {
      bt.hidden = !1, bt.className = "ppp-top" + (dt ? " is-" + dt : ""), bt.replaceChildren(g("span", "", "dot"), document.createTextNode(Z)), bt.title = $t;
    }, B = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0;
    switch (f.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        bt.hidden = !0;
        return;
      case "elsewhere":
        return A("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        bt.hidden = !0;
        return;
      case "intro":
        return A("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return A(`Connect ${E(f.linked)}`, "warn", `This device's listening wallet belongs to ${E(f.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return A(f.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return A("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return f.depositPending ? A("Funds on their way", "quiet", "Paying starts by itself when they land") : A(f.entries.some((Z) => Z.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return A("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return A("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return f.payingOn && B > 0 ? A(`On · ${B.toLocaleString()} plays left`, "on", "Paying artists as you listen") : A("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const I = document.getElementById("pppNudge"), H = document.getElementById("onair");
  (Ut = I == null ? void 0 : I.querySelector("button")) == null || Ut.addEventListener("click", () => S());
  const P = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, q = {
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
  function et(f) {
    var $t;
    if (f.step === "loading") return;
    const A = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, B = f.step === "ready" && f.payingOn && A > 0, Z = B ? "" : P[f.step] ?? "", dt = B ? "on" : Z ? "off" : "";
    if (dt ? document.documentElement.dataset.ppp = dt : delete document.documentElement.dataset.ppp, H && (H.hidden = !dt, H.querySelector(".onair-sub").textContent = B ? `Paying artists · ${A.toLocaleString()} plays left` : "Not paying"), I && (I.hidden = dt !== "off" || f.step === "fund" && f.depositPending, dt === "off")) {
      const se = Math.floor(Number(1000000n / Rs(BigInt((($t = f.gate) == null ? void 0 : $t.limits.playFee) ?? "300"))));
      I.querySelector(".nudge-t").textContent = "⚠ " + Z, I.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${se.toLocaleString()} plays, on-chain, straight to the artists.`, I.querySelector("button").textContent = q[f.step] ?? "Start paying";
    }
  }
  let It = "";
  function Jt(f) {
    const A = g("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && A.append(g("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && A.append(g("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const B = g("input");
    B.type = "text", B.placeholder = "SP… address to send returns to", B.autocomplete = "off", B.spellcheck = !1, B.setAttribute("aria-label", "Address to return funds to"), B.value = It, B.oninput = () => {
      It = B.value;
    };
    const Z = w(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(B.value), It = "";
    }, "tiny");
    return A.append(B, " ", Z), f.returnToKind === "chosen" && A.append(" ", w("Back to the funder", () => o.clearReturnAddress(), "tiny")), A;
  }
  const ze = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function jt() {
    const f = g("p", ze + " ", "ppp-mute");
    return f.append(v("Xverse", "https://www.xverse.app/download"), " · ", v("Leather", "https://leather.io/install-extension")), f;
  }
  let ue = "";
  const Ae = (f) => {
    const A = document.documentElement, B = f.solo && !f.main ? f.listening ? d(f.listening) : "new" : "", Z = A5() ? "1" : "";
    `${B}|${Z}` !== ue && (ue = `${B}|${Z}`, B ? A.dataset.pppSolo = B : delete A.dataset.pppSolo, Z ? A.dataset.pppWalletInstalled = Z : delete A.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => kt(o.snapshot()), f);
  function kt(f) {
    var en, Hn, is, os;
    if (u(), Ae(f), M(f), et(f), t.hidden = f.step === "off", t.hidden) return;
    const [A, B] = W(f), Z = n(".ppp-state");
    Z.textContent = A, Z.className = "ppp-state" + (B ? " ppp-state--" + B : ""), Z.hidden = !A;
    const dt = !!f.busy || f.armed, $t = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (dt || !["intro", "loading"].includes(f.step));
    r.hidden = !$t, r.classList.toggle("ppp-frame--rest", !dt && !U);
    const se = n(".ppp-frame-label");
    se.hidden = !0;
    const te = g5(f) ?? _;
    _ = te;
    const Wt = w5(f, te);
    n(".ppp-badge").hidden = !Wt;
    const Qe = n(".ppp-steps"), wr = n(".ppp-stage");
    Qe.hidden = wr.hidden = !Wt, te && Wt && (Qe.replaceChildren(...sl(f.solo).map((Y, rt) => {
      const x = g("li", "", rt < te.at ? "done" : rt === te.at ? te.blocked ? "now blocked" : "now" : "");
      return x.append(g("span", rt < te.at ? "✓" : String(rt + 1), "n"), Y), rt === te.at && x.setAttribute("aria-current", "step"), x;
    })), wr.textContent = te.caption, wr.className = "ppp-stage " + (te.at >= sl(f.solo).length ? "ppp-ok" : te.blocked ? "ppp-bad" : "ppp-cyan"));
    const _n = n(".ppp-facts"), fe = [];
    f.main && ((en = f.gate) != null && en.here) && !f.solo && fe.push(...Nt("Your wallet", E(f.main), "ppp-addr-short"));
    const $e = () => {
      if (!f.listening) return;
      const Y = Ko("copy-listening", "Copy", () => f.listening || "", "tiny", () => kt(o.snapshot()));
      fe.push(...Nt(f.linked ? "Listening wallet (technical)" : "Listening wallet", d(f.listening), "ppp-addr-short", Y));
    };
    if (f.linked || $e(), f.listening && f.step !== "intro")
      if (f.linked)
        fe.push(...Nt("Credited to", `${E(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), $e();
      else if (f.solo) {
        const Y = f.returnTo ? `${E(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        fe.push(...Nt("Returns go to", f.returnTo && !L(f.returnTo) ? Y.replace(d(f.returnTo), f.returnTo) : Y, f.returnTo ? "ppp-addr-full" : "ppp-mute"));
      } else fe.push(...Nt("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Hn = f.gate) != null && Hn.here)) {
      const Y = f.linkedListening.map((rt) => d(rt) + (rt === f.listening ? " (this one)" : "")).join(", ");
      fe.push(...Nt(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Y, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Y = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      fe.push(...Nt("Balance", `${vn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Y));
    }
    const Je = f.entries.find((Y) => Y.kind === "play");
    Je && m(), Je && fe.push(...Nt("Last paid song", `${N(Je)} → ${E(Je.recipient)}`, X[Je.status] || "")), _n.replaceChildren(...fe), _n.hidden = !fe.length;
    const yt = [], Et = [], Ft = [], we = [], br = Rs(BigInt(((is = f.gate) == null ? void 0 : is.limits.playFee) ?? "300")), Qt = `Each song you listen to for 30 seconds sends ${vn(el)} STX to whoever holds it, plus a ${vn(br - el)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Un = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (yt.push(g("p", "Pay artists as you listen.")), (os = f.gate) != null && os.radioUrl) {
          const rt = g("p");
          rt.append(v("Open the pay-per-play radio →", f.gate.radioUrl)), yt.push(rt);
        }
        Et.push(g("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const rt = [f.linked, ...f.others];
          yt.push(g("p", rt.length > 1 ? `This device has listening wallets for ${D(rt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${E(f.linked)}. Connect that wallet to keep paying artists.`)), Et.push(g("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          yt.push(g("p", "Connect your wallet to pay artists as you listen.")), Et.push(g("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        yt.push(g("p", `This device's listening wallet belongs to ${E(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Et.push(g("p", `You are connected as ${E(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Et.push(g("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Ft.push(w("Switch wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        }, "primary"));
        break;
      case "not-invited":
        yt.push(g("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        yt.push(g("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        yt.push(g("p", `Pay artists ${vn(br)} STX a song as you listen.`)), Et.push(g("p", Qt)), Et.push(g("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Et.push(g("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (yt.push(g("p", `This device already has a listening wallet for ${D(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Et.push(g("p", `Otherwise, set up a new listening wallet for ${E(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Et.push(g("p", `This is the listening wallet for ${E(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Et.push(g("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Y = a.liveGift();
        Ft.push(w(Y ? "Claim my gift · no wallet needed" : f.solo ? "Turn on pay-per-play · no wallet needed" : f.others.length && f.main ? `Set up for ${E(f.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !Y && !f.solo && f.main && f.others.length && Ft.push(w("Switch wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        })), !Y && f.solo && Ft.push(w("I have a Stacks wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        })), Y || Ft.push(w("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        f.armed || (yt.push(g("p", "Locked.", "ppp-mute")), Ft.push(w(f.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), we.push(w("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        yt.push(g("p", `Link to ${E(f.main)} · free`)), Et.push(g("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Et.push(g("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Ft.push(w(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        yt.push(g("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending || (f.entries.length ? yt.push(g("p", "Out of funds · top up to keep paying", "ppp-bad")) : yt.push(g("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / br)).toLocaleString()} songs`))), f.entries.length && Et.push(g("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && Et.push(g("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), f.solo ? (Et.push(g("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Et.push(g("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Ft.push(Ko("copy-address", "Copy my address", () => f.listening || "", "primary", () => kt(o.snapshot())))) : Et.push(g("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const rt = g("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          rt.append(v("View", h(f.depositTxid))), yt.push(rt);
        } else f.allowance > 0n && !f.solo && Ft.push(w(`Deposit ${vn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        yt.push(g("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (yt.push(g("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), yt.push(Jt(f))), (!f.solo || f.returnTo) && Ft.push(w("Return excess", () => void o.returnFunds("excess"), "primary"), w("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const rt = Math.min(f.session.playsLeft, f.playsLeft);
          yt.push(g("p", `Paying as you listen · up to ${rt.toLocaleString()} plays left`, "ppp-ok")), Et.push(g("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Ft.push(w("Switch off", () => void o.switchOff()));
        } else
          yt.push(g("p", "Paying is off. Music stays free.", "ppp-mute")), Ft.push(w("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        f.queued && yt.push(g("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && yt.push(g("p", "Running low · top up", "ppp-warn")), f.depositPending ? yt.push(g("p", "Top-up on its way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Ft.push(w(`Top up ${vn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && Et.push(g("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && Et.push(Jt(f)), Et.push(jt()), f.step === "ready" && f.entries.some((Y) => Y.kind === "play" && Y.status === "confirmed"))) {
      const Y = g("p", "New to Stacks? ", "ppp-mute");
      Y.append(v("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), yt.push(Y);
    }
    if (f.walletOutdated && Et.push(g("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (yt.push(g("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Ft.push(w("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && f.returnTo && (f.balance ?? 0n) > 0n && we.push(w(f.linked ? "Return all to my wallet" : `Return all to ${E(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && we.push(w("Lock", () => void o.lock(), "quiet")), $t && !dt && we.push(w(U ? "Hide listening wallet box" : "Show listening wallet box", () => {
      U = !U, kt(o.snapshot());
    }, "quiet")), [...Ft, ...we].forEach((Y) => Y.disabled = Un), Un && (Ft.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n)) {
      const Y = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", rt = yt.at(0);
      f.step === "ready" && rt ? rt.append(g("span", ` · ${l(f.balance)} STX`, Y)) : yt.push(g("p", `Balance ${l(f.balance)} STX`, Y));
    }
    yt.unshift(...a.banner(f)), n(".ppp-key").replaceChildren(...yt);
    const Ue = a.renderFold(f);
    n(".ppp-gifts").hidden = !Ue, Ue && !n(".ppp-gift-body").contains(Ue) && n(".ppp-gift-body").replaceChildren(Ue), n(".ppp-body").replaceChildren(...Et), n(".ppp-actions").replaceChildren(...Ft), n(".ppp-actions2").replaceChildren(...we);
    const Ne = f.busy || f.message || "";
    n(".ppp-msg").textContent = Ne && yt.some((Y) => (Y.textContent ?? "").startsWith(Ne.replace(/[.✓\s]+$/, ""))) ? "" : Ne, n(".ppp-err").textContent = f.error;
    const Nn = f.entries.filter((Y) => Y.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...Nn.slice(0, 5).map((Y) => {
      const rt = g("li"), x = Y.status === "confirmed" ? "ok" : Y.status === "failed" ? "bad" : "warn";
      return rt.append(g("span", "", "d " + x), g("span", N(Y), "t"), g("span", y(Y.created), "ppp-mute")), Y.txid && rt.append(v("tx", h(Y.txid))), rt;
    })), n(".ppp-wallets").hidden = !(_n.childElementCount || we.length), n(".ppp-more").hidden = !Et.length;
    const tn = n(".ppp-history");
    tn.hidden = !f.entries.length, f.entries.length && m(), tn.replaceChildren(g("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Y) => {
      const rt = g("div", "", "ppp-row"), x = Y.kind === "play" ? [g("span", N(Y), "ppp-song"), g("span", ` · ${vn(BigInt(Y.amount))} STX to ${E(Y.recipient)}`, "ppp-mute")] : Y.kind === "like" ? [g("span", `${Y.liked ? "♥ Liked" : "Unliked"} ${N(Y)}`, "ppp-song"), g("span", ` · for ${f.linked ? E(f.linked) : "this listening wallet"}`, "ppp-mute")] : [g("span", `Returned ${vn(BigInt(Y.amount))} STX`, "ppp-song"), g("span", ` to ${E(Y.recipient)}`, "ppp-mute")];
      return rt.append(
        g("span", nt[Y.status] || Y.status, "ppp-status " + (X[Y.status] || "")),
        ...x,
        g("span", ` · ${new Date(Y.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Y.txid && rt.append(v("tx ↗", h(Y.txid))), rt;
    }));
  }
  const qt = /* @__PURE__ */ new Map(), ne = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((A) => {
      const B = A == null ? void 0 : A.nowPlaying;
      B && Number.isSafeInteger(Number(B.tokenId)) && qt.set(Number(B.tokenId), { title: B.title || void 0, artist: B.artist || void 0 });
    }), !0) : !1;
  };
  if (!ne()) {
    const f = setInterval(() => {
      ne() && clearInterval(f);
    }, 500);
    setTimeout(() => clearInterval(f), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (f) => {
    const A = f.detail;
    if (A && Number.isSafeInteger(A.song) && typeof A.id == "string" && /^[0-9a-f]{32}$/.test(A.id)) {
      m();
      const B = k(A.song, qt.get(A.song));
      o.onListened({ song: A.song, id: A.id, title: B.title || void 0, artist: B.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const g$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", y$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, w$ = () => y$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, b$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, m$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Mg = class {
  constructor(t) {
    yE(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Hm(t), this.callback(ia(t));
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
    var r, s, i, o, a, c, u, d, l, y;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (y = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = w$(), e = b$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return st("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, st("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), st("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, st("div", { class: "flex flex-col space-y-[10px]" }, st("div", { class: "flex items-center" }, st("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), st("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, st("span", { class: "sr-only" }, "Close popup"), st("img", { src: g$ }))), r ? st("p", null, "Select the wallet you want to connect to.") : st("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && st("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && st("div", { class: "mt-6" }, st("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), st("ul", { class: "space-y-3" }, this.installedProviders.map((i) => st("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, st("div", { class: "aspect-square basis-9 overflow-hidden" }, st("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), st("div", { class: "flex-1" }, st("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && st("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), st("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && st("div", { class: "mt-6" }, r ? st("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : st("div", { class: "mb-5 flex justify-between" }, st("p", { class: "text-sm font-medium" }, "Recommended wallets"), st("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, st("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, st("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), st("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), st("p", null, "What is a wallet? ", st("span", { class: "align-text-bottom text-[9px]" }, "↗")))), st("ul", { class: "space-y-3" }, n.map((i) => st("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, st("div", { class: "aspect-square basis-9 overflow-hidden" }, st("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), st("div", { class: "flex-1" }, st("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && st("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && st("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return Z4(this);
  }
};
Mg.style = m$;
const x$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Mg
}, Symbol.toStringTag, { value: "Module" }));
