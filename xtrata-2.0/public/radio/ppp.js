var yy = Object.defineProperty;
var wy = (t, e, n) => e in t ? yy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Qs = (t, e, n) => wy(t, typeof e != "symbol" ? e + "" : e, n);
var ye = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Qd(t) {
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
      typeof ye < "u" && ye || {}, r = {
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
        var I = {
          next: function() {
            var P = m.shift();
            return { done: P === void 0, value: P };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function d(m) {
        this.map = {}, m instanceof d ? m.forEach(function(I, P) {
          this.append(P, I);
        }, this) : Array.isArray(m) ? m.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(I) {
          this.append(I, m[I]);
        }, this);
      }
      d.prototype.append = function(m, I) {
        m = a(m), I = c(I);
        var P = this.map[m];
        this.map[m] = P ? P + ", " + I : I;
      }, d.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, d.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, d.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, d.prototype.set = function(m, I) {
        this.map[a(m)] = c(I);
      }, d.prototype.forEach = function(m, I) {
        for (var P in this.map)
          this.map.hasOwnProperty(P) && m.call(I, this.map[P], P, this);
      }, d.prototype.keys = function() {
        var m = [];
        return this.forEach(function(I, P) {
          m.push(P);
        }), u(m);
      }, d.prototype.values = function() {
        var m = [];
        return this.forEach(function(I) {
          m.push(I);
        }), u(m);
      }, d.prototype.entries = function() {
        var m = [];
        return this.forEach(function(I, P) {
          m.push([P, I]);
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
        return new Promise(function(I, P) {
          m.onload = function() {
            I(m.result);
          }, m.onerror = function() {
            P(m.error);
          };
        });
      }
      function h(m) {
        var I = new FileReader(), P = y(I);
        return I.readAsArrayBuffer(m), P;
      }
      function g(m) {
        var I = new FileReader(), P = y(I), G = /charset=([A-Za-z0-9_-]+)/.exec(m.type), st = G ? G[1] : "utf-8";
        return I.readAsText(m, st), P;
      }
      function w(m) {
        for (var I = new Uint8Array(m), P = new Array(I.length), G = 0; G < I.length; G++)
          P[G] = String.fromCharCode(I[G]);
        return P.join("");
      }
      function v(m) {
        if (m.slice)
          return m.slice(0);
        var I = new Uint8Array(m.byteLength);
        return I.set(new Uint8Array(m)), I.buffer;
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
          return this.text().then(A);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function b(m) {
        var I = m.toUpperCase();
        return U.indexOf(I) > -1 ? I : m;
      }
      function L(m, I) {
        if (!(this instanceof L))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var P = I.body;
        if (m instanceof L) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, I.headers || (this.headers = new d(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !P && m._bodyInit != null && (P = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new d(I.headers)), this.method = b(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var W = new AbortController();
            return W.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && P)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(P), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var G = /([?&])_=[^&]*/;
          if (G.test(this.url))
            this.url = this.url.replace(G, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var st = /\?/;
            this.url += (st.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function A(m) {
        var I = new FormData();
        return m.trim().split("&").forEach(function(P) {
          if (P) {
            var G = P.split("="), st = G.shift().replace(/\+/g, " "), W = G.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(st), decodeURIComponent(W));
          }
        }), I;
      }
      function D(m) {
        var I = new d(), P = m.replace(/\r?\n[\t ]+/g, " ");
        return P.split("\r").map(function(G) {
          return G.indexOf(`
`) === 0 ? G.substr(1, G.length) : G;
        }).forEach(function(G) {
          var st = G.split(":"), W = st.shift().trim();
          if (W) {
            var _t = st.join(":").trim();
            try {
              I.append(W, _t);
            } catch (Lt) {
              console.warn("Response " + Lt.message);
            }
          }
        }), I;
      }
      _.call(L.prototype);
      function K(m, I) {
        if (!(this instanceof K))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new d(I.headers), this.url = I.url || "", this._initBody(m);
      }
      _.call(K.prototype), K.prototype.clone = function() {
        return new K(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, K.error = function() {
        var m = new K(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var j = [301, 302, 303, 307, 308];
      K.redirect = function(m, I) {
        if (j.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new K(null, { status: I, headers: { location: m } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(I, P) {
          this.message = I, this.name = P;
          var G = Error(I);
          this.stack = G.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function V(m, I) {
        return new Promise(function(P, G) {
          var st = new L(m, I);
          if (st.signal && st.signal.aborted)
            return G(new e.DOMException("Aborted", "AbortError"));
          var W = new XMLHttpRequest();
          function _t() {
            W.abort();
          }
          W.onload = function() {
            var S = {
              statusText: W.statusText,
              headers: D(W.getAllResponseHeaders() || "")
            };
            st.url.indexOf("file://") === 0 && (W.status < 200 || W.status > 599) ? S.status = 200 : S.status = W.status, S.url = "responseURL" in W ? W.responseURL : S.headers.get("X-Request-URL");
            var T = "response" in W ? W.response : W.responseText;
            setTimeout(function() {
              P(new K(T, S));
            }, 0);
          }, W.onerror = function() {
            setTimeout(function() {
              G(new TypeError("Network request failed"));
            }, 0);
          }, W.ontimeout = function() {
            setTimeout(function() {
              G(new TypeError("Network request timed out"));
            }, 0);
          }, W.onabort = function() {
            setTimeout(function() {
              G(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Lt(S) {
            try {
              return S === "" && n.location.href ? n.location.href : S;
            } catch {
              return S;
            }
          }
          if (W.open(st.method, Lt(st.url), !0), st.credentials === "include" ? W.withCredentials = !0 : st.credentials === "omit" && (W.withCredentials = !1), "responseType" in W && (r.blob ? W.responseType = "blob" : r.arrayBuffer && (W.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof d || n.Headers && I.headers instanceof n.Headers)) {
            var Ut = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(S) {
              Ut.push(a(S)), W.setRequestHeader(S, c(I.headers[S]));
            }), st.headers.forEach(function(S, T) {
              Ut.indexOf(T) === -1 && W.setRequestHeader(T, S);
            });
          } else
            st.headers.forEach(function(S, T) {
              W.setRequestHeader(T, S);
            });
          st.signal && (st.signal.addEventListener("abort", _t), W.onreadystatechange = function() {
            W.readyState === 4 && st.signal.removeEventListener("abort", _t);
          }), W.send(typeof st._bodyInit > "u" ? null : st._bodyInit);
        });
      }
      return V.polyfill = !0, n.fetch || (n.fetch = V, n.Headers = d, n.Request = L, n.Response = K), e.Headers = d, e.Request = L, e.Response = K, e.fetch = V, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ye);
})();
const by = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function my(t, e) {
  const n = {};
  return Object.assign(n, by, e), await fetch(t, n);
}
function xy(t) {
  let e = my, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Sy(...t) {
  const { fetchLib: e, middlewares: n } = xy(t);
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
var vs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(vs || (vs = {}));
var Mr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Mr || (Mr = {}));
var $u;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})($u || ($u = {}));
const Ey = "https://api.mainnet.hiro.so", Ay = "https://api.testnet.hiro.so", $y = "http://localhost:3999", vy = ["mainnet", "testnet", "devnet", "mocknet"];
let Is = class {
  constructor(e) {
    this.version = Mr.Mainnet, this.chainId = vs.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Mr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Sy();
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
Is.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Za();
    case "testnet":
      return new Iy();
    case "devnet":
      return new Ly();
    case "mocknet":
      return new Jd();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${vy.join(", ")}`);
  }
};
Is.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Is.fromName(t);
let Za = class extends Is {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ey,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Mr.Mainnet, this.chainId = vs.Mainnet;
  }
}, Iy = class extends Is {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ay,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Mr.Testnet, this.chainId = vs.Testnet;
  }
}, Jd = class extends Is {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? $y,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Mr.Testnet, this.chainId = vs.Testnet;
  }
};
const Ly = Jd, th = "xtrata.wallet.bridge.v1", ky = (t) => typeof t == "object" && t !== null && t.protocol === th, Cy = (t) => ky(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", By = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Js extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const vu = 12e4;
class Ty {
  constructor(e) {
    Qs(this, "pending", /* @__PURE__ */ new Map());
    Qs(this, "listenTarget");
    Qs(this, "closed", !1);
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
    Qs(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Cy(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Js("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Js("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Js("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = By(), i = { protocol: th, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Js(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? vu}ms.`
          )
        );
      }, this.options.timeoutMs ?? vu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Js("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const My = ["SP", "SM"], _y = ["ST", "SN"], Uy = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return My.includes(n) ? "mainnet" : _y.includes(n) ? "testnet" : null;
}, Ny = () => {
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
}, Hy = () => typeof window > "u" || !window.localStorage ? Ny() : window.localStorage, Ia = "xtrata.v15.1.wallet.session", Iu = "mainnet", So = { isConnected: !1 }, Py = (t) => t.address ? Uy(t.address) ?? t.network : t.network, eh = (t) => !t.isConnected || !t.address ? { ...So } : Py(t) !== Iu ? { ...So } : {
  isConnected: !0,
  address: t.address,
  network: Iu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Oy = (t) => {
  if (!t)
    return { ...So };
  try {
    const e = JSON.parse(t);
    return eh(e);
  } catch {
    return { ...So };
  }
}, Dy = (t) => {
  const e = eh(t);
  return JSON.stringify(e);
}, jy = (t) => {
  const e = Hy();
  return {
    load: () => Oy(e.getItem(Ia)),
    save: (n) => {
      e.setItem(Ia, Dy(n));
    },
    clear: () => {
      e.removeItem(Ia);
    }
  };
}, Fy = "https://browser.blockstack.org/auth", zy = {
  "@type": "Person",
  "@context": "http://schema.org"
}, nh = ["store_write"], Ry = "blockstack-session", Gy = {
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
class Ks extends Error {
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
class Ky extends Ks {
  constructor(e, n = "") {
    super({ code: Xr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Lu extends Ks {
  constructor(e = "") {
    super({ code: Xr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Pi extends Ks {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Xr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class ku extends Ks {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Xr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Qa extends Ks {
  constructor(e) {
    super({ code: Xr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class rh extends Ks {
  constructor(e) {
    super({ code: Xr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Cu = ["debug", "info", "warn", "error", "none"], Ja = {};
for (let t = 0; t < Cu.length; t++) {
  const e = Cu[t];
  Ja[e] = t;
}
class bs {
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
    return Ja[Gy.logLevel] <= Ja[e];
  }
}
function Vy() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function qy() {
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
function Wy() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Xy() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Yy(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function rl(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Xy(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    bs.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Yy(s, t.toString(), n);
    throw bs.error(i), new Error(i);
  }
  if (r)
    return {};
}
function pr(t, e) {
  return sl(ce(t), e);
}
function ce(t) {
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
  if ($e(t, Uint8Array))
    return BigInt(`0x${et(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Zy(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Bu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function $i(t, e = 8) {
  return (typeof t == "bigint" ? t : ce(t)).toString(16).padStart(e * 2, "0");
}
function qo(t) {
  return parseInt(t, 16);
}
function sl(t, e = 16) {
  const n = $i(t, e);
  return xt(n);
}
function Qy(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Jy(t, e) {
  return t & BigInt(1) << e;
}
function tc(t) {
  return tw(BigInt(`0x${et(t)}`), BigInt(t.byteLength * 8));
}
function tw(t, e) {
  return Jy(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const ew = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function et(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += ew[n];
  return e;
}
function xt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Zy(t), t = t.length % 2 ? `0${t}` : t;
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
function vi(t) {
  return new TextDecoder().decode(t);
}
function nw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function rw(t) {
  return String.fromCharCode.apply(null, t);
}
function sw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Tu(t) {
  if (t.some(sw))
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
function Zt(t) {
  return gn(...t.map((e) => typeof e == "number" ? Tu([e]) : e instanceof Array ? Tu(e) : e));
}
function $e(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const sh = "https://api.mainnet.hiro.so", ih = "https://api.testnet.hiro.so", oh = "http://localhost:3999", iw = "https://hub.blockstack.org", ow = 33, ka = 32;
function aw(t) {
  if (t.length < ka * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ka * 2), r = t.slice(2 + ka * 2);
  return {
    recoveryId: qo(e),
    r: n,
    s: r
  };
}
function il(t) {
  const e = typeof t == "string" ? xt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function cw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function lw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function uw(t, e) {
  return t[e];
}
function fw(t, e, n = 0) {
  return t[n] = e, t;
}
function dw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function _r(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const hw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function pw(t, e) {
  const n = {};
  return Object.assign(n, hw, e), await fetch(t, n);
}
function gw(t) {
  let e = pw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function yw(...t) {
  const { fetchLib: e, middlewares: n } = gw(t);
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
class ah {
  constructor(e = nh.slice(), n = ((a) => (a = rl("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Fy) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ec(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ww(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ch(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function bw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ec(t.outputLen), ec(t.blockLen);
}
function mw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function xw(t, e) {
  ch(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ar = {
  number: ec,
  bool: ww,
  bytes: ch,
  hash: bw,
  exists: mw,
  output: xw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ca = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), sn = (t, e) => t << 32 - e | t >>> e, Sw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Sw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ew(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ol(t) {
  if (typeof t == "string" && (t = Ew(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let lh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Zr(t) {
  const e = (r) => t().update(ol(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let uh = class extends lh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ar.hash(e);
    const r = ol(n);
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
const Wo = (t, e, n) => new uh(t, e).update(n).digest();
Wo.create = (t, e) => new uh(t, e);
function Aw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let al = class extends lh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ca(this.buffer);
  }
  update(e) {
    Ar.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ol(e);
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
    Aw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const $w = (t, e, n) => t & e ^ ~t & n, vw = (t, e, n) => t & e ^ t & n ^ e & n, Iw = new Uint32Array([
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
let fh = class extends al {
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
      const y = sn(a, 6) ^ sn(a, 11) ^ sn(a, 25), h = d + y + $w(a, c, u) + Iw[l] + On[l] | 0, w = (sn(r, 2) ^ sn(r, 13) ^ sn(r, 22)) + vw(r, s, i) | 0;
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
}, Lw = class extends fh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ls = Zr(() => new fh());
Zr(() => new Lw());
const kw = {}, dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: kw
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const bt = BigInt(0), Pt = BigInt(1), lr = BigInt(2), si = BigInt(3), Mu = BigInt(8), It = Object.freeze({
  a: bt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Pt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), _u = (t, e) => (t + e / lr) / e, Oi = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = It, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Pt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = _u(i * t, e), c = _u(-r * t, e);
    let u = F(t - a * n - c * s, e), d = F(-a * r - c * i, e);
    const l = u > o, y = d > o;
    if (l && (u = e - u), y && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: d };
  }
}, Xe = 32, Ur = 32, hh = 32, Eo = Xe + 1, Ao = 2 * Xe + 1;
function Uu(t) {
  const { a: e, b: n } = It, r = F(t * t), s = F(r * t);
  return F(s + e * t + n);
}
const Di = It.a === bt;
class cl extends Error {
  constructor(e) {
    super(e);
  }
}
function Nu(t) {
  if (!(t instanceof At))
    throw new TypeError("JacobianPoint expected");
}
class At {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof dt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(dt.ZERO) ? At.ZERO : new At(e.x, e.y, Pt);
  }
  static toAffineBatch(e) {
    const n = _w(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return At.toAffineBatch(e).map(At.fromAffine);
  }
  equals(e) {
    Nu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = F(s * s), u = F(a * a), d = F(n * u), l = F(i * c), y = F(F(r * a) * u), h = F(F(o * s) * c);
    return d === l && y === h;
  }
  negate() {
    return new At(this.x, F(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = F(e * e), i = F(n * n), o = F(i * i), a = e + i, c = F(lr * (F(a * a) - s - o)), u = F(si * s), d = F(u * u), l = F(d - lr * c), y = F(u * (c - l) - Mu * o), h = F(lr * n * r);
    return new At(l, y, h);
  }
  add(e) {
    Nu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === bt || o === bt)
      return this;
    if (n === bt || r === bt)
      return e;
    const c = F(s * s), u = F(a * a), d = F(n * u), l = F(i * c), y = F(F(r * a) * u), h = F(F(o * s) * c), g = F(l - d), w = F(h - y);
    if (g === bt)
      return w === bt ? this.double() : At.ZERO;
    const v = F(g * g), _ = F(g * v), U = F(d * v), b = F(w * w - _ - lr * U), L = F(w * (U - b) - y * _), A = F(s * a * g);
    return new At(b, L, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = At.ZERO;
    if (typeof e == "bigint" && e === bt)
      return n;
    let r = Ou(e);
    if (r === Pt)
      return this;
    if (!Di) {
      let l = n, y = this;
      for (; r > bt; )
        r & Pt && (l = l.add(y)), y = y.double(), r >>= Pt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Oi.splitScalar(r), c = n, u = n, d = this;
    for (; i > bt || a > bt; )
      i & Pt && (c = c.add(d)), a & Pt && (u = u.add(d)), d = d.double(), i >>= Pt, a >>= Pt;
    return s && (c = c.negate()), o && (u = u.negate()), u = new At(F(u.x * Oi.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Di ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(At.BASE) && (n = dt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && nc.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = At.normalizeZ(s), nc.set(n, s)));
    let i = At.ZERO, o = At.BASE;
    const a = 1 + (Di ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const h = y * c;
      let g = Number(e & u);
      e >>= l, g > c && (g -= d, e += Pt);
      const w = h, v = h + Math.abs(g) - 1, _ = y % 2 !== 0, U = g < 0;
      g === 0 ? o = o.add(ji(_, s[w])) : i = i.add(ji(U, s[v]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Ou(e), s, i;
    if (Di) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Oi.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: y, f: h } = this.wNAF(u, n);
      d = ji(o, d), y = ji(c, y), y = new At(F(y.x * Oi.beta), y.y, y.z), s = d.add(y), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return At.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(At.ZERO);
    e == null && (e = i ? Mu : Vs(s));
    const o = e, a = F(o * o), c = F(a * o), u = F(n * a), d = F(r * c), l = F(s * o);
    if (i)
      return dt.ZERO;
    if (l !== Pt)
      throw new Error("invZ was invalid");
    return new dt(u, d);
  }
}
At.BASE = new At(It.Gx, It.Gy, Pt);
At.ZERO = new At(bt, Pt, bt);
function ji(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const nc = /* @__PURE__ */ new WeakMap();
class dt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, nc.delete(this);
  }
  hasEvenY() {
    return this.y % lr === bt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _e(n ? e : e.subarray(1));
    if (!ho(r))
      throw new Error("Point is not on curve");
    const s = Uu(r);
    let i = Mw(s);
    const o = (i & Pt) === Pt;
    n ? o && (i = F(-i)) : (e[0] & 1) === 1 !== o && (i = F(-i));
    const a = new dt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = _e(e.subarray(1, Xe + 1)), r = _e(e.subarray(Xe + 1, Xe * 2 + 1)), s = new dt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = yn(e), r = n.length, s = n[0];
    if (r === Xe)
      return this.fromCompressedHex(n);
    if (r === Eo && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Ao && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Eo} compressed bytes or ${Ao} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return dt.BASE.multiply(Nr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = yh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = ll(yn(e)), { n: a } = It, c = r === 2 || r === 3 ? s + a : s, u = Vs(c, a), d = F(-o * u, a), l = F(i * u, a), y = r & 1 ? "03" : "02", h = dt.fromHex(y + fr(c)), g = dt.BASE.multiplyAndAddUnsafe(h, d, l);
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
    if (!ho(n) || !ho(r))
      throw new Error(e);
    const s = F(r * r), i = Uu(n);
    if (F(s - i) !== bt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new dt(this.x, F(-this.y));
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
    const s = At.fromAffine(this), i = n === bt || n === Pt || this !== dt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = At.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(At.ZERO) ? void 0 : a.toAffine();
  }
}
dt.BASE = new dt(It.Gx, It.Gy);
dt.ZERO = new dt(bt, bt);
function Hu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Pu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${ks(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _e(n), left: t.subarray(e + 2) };
}
function Cw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${ks(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Pu(t.subarray(2)), { data: r, left: s } = Pu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${ks(s)}`);
  return { r: e, s: r };
}
class Me {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? ks(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Me($o(s.slice(0, 64)), $o(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Cw(n ? e : dr(e));
    return new Me(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Bs(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Bs(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = It.n >> Pt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Me(this.r, F(-this.s, It.n)) : this;
  }
  toDERRawBytes() {
    return dr(this.toDERHex());
  }
  toDERHex() {
    const e = Hu(ti(this.s)), n = Hu(ti(this.r)), r = e.length / 2, s = n.length / 2, i = ti(r), o = ti(s);
    return `30${ti(s + r + 4)}02${o}${n}02${i}${e}`;
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
const Bw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ks(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Bw[t[n]];
  return e;
}
const Tw = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function fr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(bt <= t && t < Tw))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Cs(t) {
  const e = dr(fr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ti(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function $o(t) {
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
function _e(t) {
  return $o(ks(t));
}
function yn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : dr(t);
}
function Ou(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Bs(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function F(t, e = It.P) {
  const n = t % e;
  return n >= bt ? n : e + n;
}
function Pe(t, e) {
  const { P: n } = It;
  let r = t;
  for (; e-- > bt; )
    r *= r, r %= n;
  return r;
}
function Mw(t) {
  const { P: e } = It, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = Pe(u, si) * u % e, l = Pe(d, si) * u % e, y = Pe(l, lr) * c % e, h = Pe(y, r) * y % e, g = Pe(h, s) * h % e, w = Pe(g, o) * g % e, v = Pe(w, a) * w % e, _ = Pe(v, o) * g % e, U = Pe(_, si) * u % e, b = Pe(U, i) * h % e, L = Pe(b, n) * c % e, A = Pe(L, lr);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function Vs(t, e = It.P) {
  if (t === bt || e <= bt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = F(t, e), r = e, s = bt, i = Pt;
  for (; n !== bt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== Pt)
    throw new Error("invert: does not exist");
  return F(s, e);
}
function _w(t, e = It.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === bt ? i : (n[a] = i, F(i * o, e)), Pt), s = Vs(r, e);
  return t.reduceRight((i, o, a) => o === bt ? i : (n[a] = F(i * n[a], e), F(i * o, e)), s), n;
}
function Uw(t) {
  const e = t.length * 8 - Ur * 8, n = _e(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function ll(t, e = !1) {
  const n = Uw(t);
  if (e)
    return n;
  const { n: r } = It;
  return n >= r ? n - r : n;
}
let As, ii;
class ph {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return qt.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ii(this.k, ...e);
  }
  checkSync() {
    if (typeof ii != "function")
      throw new cl("hmacSha256Sync needs to be set");
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
function Bs(t) {
  return bt < t && t < It.n;
}
function ho(t) {
  return bt < t && t < It.P;
}
function gh(t, e, n, r = !0) {
  const { n: s } = It, i = ll(t, !0);
  if (!Bs(i))
    return;
  const o = Vs(i, s), a = dt.BASE.multiply(i), c = F(a.x, s);
  if (c === bt)
    return;
  const u = F(o * F(e + n * c, s), s);
  if (u === bt)
    return;
  let d = new Me(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & Pt);
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
    e = $o(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ur)
      throw new Error("Expected 32 bytes of private key");
    e = _e(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Bs(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function ul(t) {
  return t instanceof dt ? (t.assertValidity(), t) : dt.fromHex(t);
}
function yh(t) {
  if (t instanceof Me)
    return t.assertValidity(), t;
  try {
    return Me.fromDER(t);
  } catch {
    return Me.fromCompact(t);
  }
}
function Ii(t, e = !1) {
  return dt.fromPrivateKey(t).toRawBytes(e);
}
function Nw(t, e, n, r = !1) {
  return dt.fromSignature(t, e, n).toRawBytes(r);
}
function Du(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Eo || r === Ao : n ? r === Eo * 2 || r === Ao * 2 : t instanceof dt;
}
function fl(t, e, n = !1) {
  if (Du(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Du(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = ul(e);
  return r.assertValidity(), r.multiply(Nr(t)).toRawBytes(n);
}
function wh(t) {
  const e = t.length > Xe ? t.slice(0, Xe) : t;
  return _e(e);
}
function Hw(t) {
  const e = wh(t), n = F(e, It.n);
  return bh(n < bt ? e : n);
}
function bh(t) {
  return Cs(t);
}
function mh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = yn(t), s = Nr(e), i = [bh(s), Hw(r)];
  if (n != null) {
    n === !0 && (n = qt.randomBytes(Xe));
    const c = yn(n);
    if (c.length !== Xe)
      throw new Error(`sign: Expected ${Xe} bytes of extra data`);
    i.push(c);
  }
  const o = ar(...i), a = wh(r);
  return { seed: o, m: a, d: s };
}
function xh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Pw(t, e, n = {}) {
  const { seed: r, m: s, d: i } = mh(t, e, n.extraEntropy), o = new ph(hh, Ur);
  await o.reseed(r);
  let a;
  for (; !(a = gh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return xh(a, n);
}
function Xo(t, e, n = {}) {
  const { seed: r, m: s, d: i } = mh(t, e, n.extraEntropy), o = new ph(hh, Ur);
  o.reseedSync(r);
  let a;
  for (; !(a = gh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return xh(a, n);
}
const Ow = { strict: !0 };
function Dw(t, e, n, r = Ow) {
  let s;
  try {
    s = yh(t), e = yn(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = ll(e);
  let c;
  try {
    c = ul(n);
  } catch {
    return !1;
  }
  const { n: u } = It, d = Vs(o, u), l = F(a * d, u), y = F(i * d, u), h = dt.BASE.multiplyAndAddUnsafe(c, l, y);
  return h ? F(h.x, u) === i : !1;
}
function vo(t) {
  return F(_e(t), It.n);
}
class Ts {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = yn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = _e(n.subarray(0, 32)), s = _e(n.subarray(32, 64));
    return new Ts(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ho(e) || !Bs(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return fr(this.r) + fr(this.s);
  }
  toRawBytes() {
    return dr(this.toHex());
  }
}
function jw(t) {
  return dt.fromPrivateKey(t).toRawX();
}
class Sh {
  constructor(e, n, r = qt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = yn(e);
    const { x: s, scalar: i } = this.getScalar(Nr(n));
    if (this.px = s, this.d = i, this.rand = yn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = dt.fromPrivateKey(e), r = n.hasEvenY() ? e : It.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Cs(e ^ _e(n));
  }
  finalizeNonce(e) {
    const n = F(_e(e), It.n);
    if (n === bt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Ts(e.x, F(n + r * s, It.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = qt.taggedHash, o = this.initNonce(n, await i(or.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(or.nonce, o, r, e)), d = vo(await i(or.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await $h(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = qt.taggedHashSync, o = this.initNonce(n, i(or.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(or.nonce, o, r, e)), d = vo(i(or.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return vh(l, e, r) || this.error(), l;
  }
}
async function Fw(t, e, n) {
  return new Sh(t, e, n).calc();
}
function zw(t, e, n) {
  return new Sh(t, e, n).calcSync();
}
function Eh(t, e, n) {
  const r = t instanceof Ts, s = r ? t : Ts.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: yn(e),
    P: ul(n)
  };
}
function Ah(t, e, n, r) {
  const s = dt.BASE.multiplyAndAddUnsafe(e, Nr(n), F(-r, It.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function $h(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Eh(t, e, n), a = vo(await qt.taggedHash(or.challenge, Cs(r), o.toRawX(), i));
    return Ah(r, o, s, a);
  } catch {
    return !1;
  }
}
function vh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Eh(t, e, n), a = vo(qt.taggedHashSync(or.challenge, Cs(r), o.toRawX(), i));
    return Ah(r, o, s, a);
  } catch (r) {
    if (r instanceof cl)
      throw r;
    return !1;
  }
}
const Rw = {
  Signature: Ts,
  getPublicKey: jw,
  sign: Fw,
  verify: $h,
  signSync: zw,
  verifySync: vh
};
dt.BASE._setWindowSize(8);
const Le = {
  node: dh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, or = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Fi = {}, qt = {
  bytesToHex: ks,
  hexToBytes: dr,
  concatBytes: ar,
  mod: F,
  invert: Vs,
  isValidPrivateKey(t) {
    try {
      return Nr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Cs,
  _normalizePrivateKey: Nr,
  hashToPrivateKey: (t) => {
    t = yn(t);
    const e = Ur + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = F(_e(t), It.n - Pt) + Pt;
    return Cs(n);
  },
  randomBytes: (t = 32) => {
    if (Le.web)
      return Le.web.getRandomValues(new Uint8Array(t));
    if (Le.node) {
      const { randomBytes: e } = Le.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => qt.hashToPrivateKey(qt.randomBytes(Ur + 8)),
  precompute(t = 8, e = dt.BASE) {
    const n = e === dt.BASE ? e : new dt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(si), n;
  },
  sha256: async (...t) => {
    if (Le.web) {
      const e = await Le.web.subtle.digest("SHA-256", ar(...t));
      return new Uint8Array(e);
    } else if (Le.node) {
      const { createHash: e } = Le.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Le.web) {
      const n = await Le.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ar(...e), s = await Le.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Le.node) {
      const { createHmac: n } = Le.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Fi[t];
    if (n === void 0) {
      const r = await qt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ar(r, r), Fi[t] = n;
    }
    return qt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof As != "function")
      throw new cl("sha256Sync is undefined, you need to set it");
    let n = Fi[t];
    if (n === void 0) {
      const r = As(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ar(r, r), Fi[t] = n;
    }
    return As(n, ...e);
  },
  _JacobianPoint: At
};
Object.defineProperties(qt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return As;
    },
    set(t) {
      As || (As = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ii;
    },
    set(t) {
      ii || (ii = t);
    }
  }
});
const Gw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: It,
  Point: dt,
  Signature: Me,
  getPublicKey: Ii,
  getSharedSecret: fl,
  recoverPublicKey: Nw,
  schnorr: Rw,
  sign: Pw,
  signSync: Xo,
  utils: qt,
  verify: Dw
}, Symbol.toStringTag, { value: "Module" }));
var Li = {};
Li.byteLength = Xw;
var Kw = Li.toByteArray = Zw, Vw = Li.fromByteArray = t1, un = [], De = [], qw = typeof Uint8Array < "u" ? Uint8Array : Array, Ba = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var fs = 0, Ww = Ba.length; fs < Ww; ++fs)
  un[fs] = Ba[fs], De[Ba.charCodeAt(fs)] = fs;
De[45] = 62;
De[95] = 63;
function Ih(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Xw(t) {
  var e = Ih(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Yw(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Zw(t) {
  var e, n = Ih(t), r = n[0], s = n[1], i = new qw(Yw(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = De[t.charCodeAt(c)] << 18 | De[t.charCodeAt(c + 1)] << 12 | De[t.charCodeAt(c + 2)] << 6 | De[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = De[t.charCodeAt(c)] << 2 | De[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = De[t.charCodeAt(c)] << 10 | De[t.charCodeAt(c + 1)] << 4 | De[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Qw(t) {
  return un[t >> 18 & 63] + un[t >> 12 & 63] + un[t >> 6 & 63] + un[t & 63];
}
function Jw(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Qw(r));
  return s.join("");
}
function t1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Jw(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    un[e >> 2] + un[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    un[e >> 10] + un[e >> 4 & 63] + un[e << 2 & 63] + "="
  )), s.join("");
}
function e1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const n1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function r1() {
  if (e1())
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
    throw new Error(n1);
  }
}
class s1 {
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
class i1 {
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
async function Lh() {
  const t = await r1();
  return t.name === "subtleCrypto" ? new i1(t.lib) : new s1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function o1(t) {
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
      for (var L = h[v], A = 0, D = U - 1; (L !== 0 || A < w) && D !== -1; D--, A++)
        L += 256 * b[D] >>> 0, b[D] = L % o >>> 0, L = L / o >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      w = A, v++;
    }
    for (var K = U - w; K !== U && b[K] === 0; )
      K++;
    for (var j = a.repeat(g); K < U; ++K)
      j += t.charAt(b[K]);
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
      for (var A = 0, D = _ - 1; (L !== 0 || A < v) && D !== -1; D--, A++)
        L += o * U[D] >>> 0, U[D] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      v = A, g++;
    }
    for (var K = _ - v; K !== _ && U[K] === 0; )
      K++;
    for (var j = new Uint8Array(w + (_ - K)), V = w; K !== _; )
      j[V++] = U[K++];
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
var kh = o1;
const a1 = kh, c1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var l1 = a1(c1);
const u1 = /* @__PURE__ */ Qd(l1), f1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ch = Uint8Array.from({ length: 16 }, (t, e) => e), d1 = Ch.map((t) => (9 * t + 5) % 16);
let dl = [Ch], hl = [d1];
for (let t = 0; t < 4; t++)
  for (let e of [dl, hl])
    e.push(e[t].map((n) => f1[n]));
const Bh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), h1 = dl.map((t, e) => t.map((n) => Bh[e][n])), p1 = hl.map((t, e) => t.map((n) => Bh[e][n])), g1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), y1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), zi = (t, e) => t << e | t >>> 32 - e;
function ju(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ri = new Uint32Array(16);
let w1 = class extends al {
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
      Ri[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = g1[h], v = y1[h], _ = dl[h], U = hl[h], b = h1[h], L = p1[h];
      for (let A = 0; A < 16; A++) {
        const D = zi(r + ju(h, i, a, u) + Ri[_[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = zi(a, 10) | 0, a = i, i = D;
      }
      for (let A = 0; A < 16; A++) {
        const D = zi(s + ju(g, o, c, d) + Ri[U[A]] + v, L[A]) + y | 0;
        s = y, y = d, d = zi(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ri.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const b1 = Zr(() => new w1());
function m1(t) {
  return b1(t);
}
const Gi = BigInt(2 ** 32 - 1), rc = BigInt(32);
function Th(t, e = !1) {
  return e ? { h: Number(t & Gi), l: Number(t >> rc & Gi) } : { h: Number(t >> rc & Gi) | 0, l: Number(t & Gi) | 0 };
}
function x1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Th(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const S1 = (t, e) => BigInt(t >>> 0) << rc | BigInt(e >>> 0), E1 = (t, e, n) => t >>> n, A1 = (t, e, n) => t << 32 - n | e >>> n, $1 = (t, e, n) => t >>> n | e << 32 - n, v1 = (t, e, n) => t << 32 - n | e >>> n, I1 = (t, e, n) => t << 64 - n | e >>> n - 32, L1 = (t, e, n) => t >>> n - 32 | e << 64 - n, k1 = (t, e) => e, C1 = (t, e) => t, B1 = (t, e, n) => t << n | e >>> 32 - n, T1 = (t, e, n) => e << n | t >>> 32 - n, M1 = (t, e, n) => e << n - 32 | t >>> 64 - n, _1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function U1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const N1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), H1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, P1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), O1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, D1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), j1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ot = {
  fromBig: Th,
  split: x1,
  toBig: S1,
  shrSH: E1,
  shrSL: A1,
  rotrSH: $1,
  rotrSL: v1,
  rotrBH: I1,
  rotrBL: L1,
  rotr32H: k1,
  rotr32L: C1,
  rotlSH: B1,
  rotlSL: T1,
  rotlBH: M1,
  rotlBL: _1,
  add: U1,
  add3L: N1,
  add3H: H1,
  add4L: P1,
  add4H: O1,
  add5H: j1,
  add5L: D1
}, [F1, z1] = ot.split([
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
let Yo = class extends al {
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
      const L = Dn[b - 15] | 0, A = jn[b - 15] | 0, D = ot.rotrSH(L, A, 1) ^ ot.rotrSH(L, A, 8) ^ ot.shrSH(L, A, 7), K = ot.rotrSL(L, A, 1) ^ ot.rotrSL(L, A, 8) ^ ot.shrSL(L, A, 7), j = Dn[b - 2] | 0, V = jn[b - 2] | 0, m = ot.rotrSH(j, V, 19) ^ ot.rotrBH(j, V, 61) ^ ot.shrSH(j, V, 6), I = ot.rotrSL(j, V, 19) ^ ot.rotrBL(j, V, 61) ^ ot.shrSL(j, V, 6), P = ot.add4L(K, I, jn[b - 7], jn[b - 16]), G = ot.add4H(P, D, m, Dn[b - 7], Dn[b - 16]);
      Dn[b] = G | 0, jn[b] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: v, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = ot.rotrSH(l, y, 14) ^ ot.rotrSH(l, y, 18) ^ ot.rotrBH(l, y, 41), A = ot.rotrSL(l, y, 14) ^ ot.rotrSL(l, y, 18) ^ ot.rotrBL(l, y, 41), D = l & h ^ ~l & w, K = y & g ^ ~y & v, j = ot.add5L(U, A, K, z1[b], jn[b]), V = ot.add5H(j, _, L, D, F1[b], Dn[b]), m = j | 0, I = ot.rotrSH(r, s, 28) ^ ot.rotrBH(r, s, 34) ^ ot.rotrBH(r, s, 39), P = ot.rotrSL(r, s, 28) ^ ot.rotrBL(r, s, 34) ^ ot.rotrBL(r, s, 39), G = r & i ^ r & a ^ i & a, st = s & o ^ s & c ^ o & c;
      _ = w | 0, U = v | 0, w = h | 0, v = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = ot.add(u | 0, d | 0, V | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = ot.add3L(m, P, st);
      r = ot.add3H(W, V, I, G), s = W | 0;
    }
    ({ h: r, l: s } = ot.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ot.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ot.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = ot.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = ot.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = ot.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: v } = ot.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: _, l: U } = ot.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, d, l, y, h, g, w, v, _, U);
  }
  roundClean() {
    Dn.fill(0), jn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, R1 = class extends Yo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, G1 = class extends Yo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, K1 = class extends Yo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const V1 = Zr(() => new Yo());
Zr(() => new R1());
Zr(() => new G1());
Zr(() => new K1());
function Mh(t) {
  return Ls(t);
}
function q1(t) {
  return V1(t);
}
const W1 = 0;
qt.hmacSha256Sync = (t, ...e) => {
  const n = Wo.create(Ls, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function X1() {
  return et(qt.randomPrivateKey());
}
function Y1(t) {
  const e = Ls(Ls(t));
  return u1.encode(gn(t, e).slice(0, t.length + 4));
}
function Z1(t, e) {
  return Y1(gn(new Uint8Array([t]), e.slice(0, 20)));
}
function _h(t, e = W1) {
  const n = typeof t == "string" ? xt(t) : t, r = m1(Mh(n));
  return Z1(e, r);
}
function Uh(t) {
  const e = il(t);
  return et(Ii(e.slice(0, 32), !0));
}
qt.hmacSha256Sync = (t, ...e) => {
  const n = Wo.create(Ls, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Io;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Io || (Io = {}));
async function Q1(t, e, n) {
  return await (await Lh()).encrypt("aes-256-cbc", e, t, n);
}
async function J1(t, e, n) {
  return await (await Lh()).decrypt("aes-256-cbc", e, t, n);
}
function Nh(t, e) {
  return Wo(Ls, t, e);
}
function tb(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Hh(t) {
  const e = q1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function eb(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function nb(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Io.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Io.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !eb(t))
    return e;
  try {
    return dt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function rb(t, e, n, r) {
  const s = nb(t);
  if (!s.result)
    throw s;
  const i = qt.randomPrivateKey(), o = Ii(i, !0);
  let a = fl(i, t, !0);
  a = a.slice(1);
  const c = Hh(a), u = qt.randomBytes(16), d = await Q1(u, c.encryptionKey, e), l = gn(u, o, d), y = Nh(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = et(d);
  else if (r === "base64")
    h = Vw(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const g = {
    iv: et(u),
    ephemeralPK: et(o),
    cipherText: h,
    mac: et(y),
    wasString: n
  };
  return r && r !== "hex" && (g.cipherTextEncoding = r), g;
}
async function Ph(t, e) {
  if (!e.ephemeralPK)
    throw new ku("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = fl(t, n, !0);
  r = r.slice(1);
  const s = Hh(r), i = xt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = xt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Kw(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = gn(i, xt(n), o), c = Nh(s.hmacKey, a), u = xt(e.mac);
  if (!tb(u, c))
    throw new ku("Decryption failed: failure in MAC check");
  const d = await J1(i, s.encryptionKey, o);
  return e.wasString ? vi(d) : d;
}
function sb(t, e) {
  const n = typeof e == "string" ? Yr(e) : e, r = Uh(t), s = Mh(n), i = Xo(s, t);
  return {
    signature: et(i),
    publicKey: r
  };
}
async function ib(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Uh(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Yr(t) : t, o = await rb(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = sb(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function ob(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Ph(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var oe = {}, Ms = {}, pe = {};
Object.defineProperty(pe, "__esModule", { value: !0 });
pe.decode = pe.encode = pe.unescape = pe.escape = pe.pad = void 0;
const Oh = Li;
function pl(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
pe.pad = pl;
function Dh(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
pe.escape = Dh;
function jh(t) {
  return pl(t).replace(/-/g, "+").replace(/_/g, "/");
}
pe.unescape = jh;
function ab(t) {
  return Dh((0, Oh.fromByteArray)(new TextEncoder().encode(t)));
}
pe.encode = ab;
function cb(t) {
  return new TextDecoder().decode((0, Oh.toByteArray)(pl(jh(t))));
}
pe.decode = cb;
var Zo = {}, Qo = {}, Fh = {}, zh = {}, Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
Jo.crypto = void 0;
Jo.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = y, t.rotl = h, t.byteSwap = g, t.byteSwap32 = w, t.bytesToHex = U, t.hexToBytes = A, t.asyncLoop = K, t.utf8ToBytes = j, t.bytesToUtf8 = V, t.toBytes = m, t.kdfInputToBytes = I, t.concatBytes = P, t.checkOpts = G, t.createHasher = W, t.createOptHasher = _t, t.createXOFer = Lt, t.randomBytes = Ut;
  const e = Jo;
  function n(S) {
    return S instanceof Uint8Array || ArrayBuffer.isView(S) && S.constructor.name === "Uint8Array";
  }
  function r(S) {
    if (!Number.isSafeInteger(S) || S < 0)
      throw new Error("positive integer expected, got " + S);
  }
  function s(S, ...T) {
    if (!n(S))
      throw new Error("Uint8Array expected");
    if (T.length > 0 && !T.includes(S.length))
      throw new Error("Uint8Array expected of length " + T + ", got length=" + S.length);
  }
  function i(S) {
    if (typeof S != "function" || typeof S.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(S.outputLen), r(S.blockLen);
  }
  function o(S, T = !0) {
    if (S.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (T && S.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(S, T) {
    s(S);
    const tt = T.outputLen;
    if (S.length < tt)
      throw new Error("digestInto() expects output buffer of length at least " + tt);
  }
  function c(S) {
    return new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
  }
  function u(S) {
    return new Uint32Array(S.buffer, S.byteOffset, Math.floor(S.byteLength / 4));
  }
  function d(...S) {
    for (let T = 0; T < S.length; T++)
      S[T].fill(0);
  }
  function l(S) {
    return new DataView(S.buffer, S.byteOffset, S.byteLength);
  }
  function y(S, T) {
    return S << 32 - T | S >>> T;
  }
  function h(S, T) {
    return S << T | S >>> 32 - T >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function g(S) {
    return S << 24 & 4278190080 | S << 8 & 16711680 | S >>> 8 & 65280 | S >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (S) => S : (S) => g(S), t.byteSwapIfBE = t.swap8IfBE;
  function w(S) {
    for (let T = 0; T < S.length; T++)
      S[T] = g(S[T]);
    return S;
  }
  t.swap32IfBE = t.isLE ? (S) => S : w;
  const v = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", _ = /* @__PURE__ */ Array.from({ length: 256 }, (S, T) => T.toString(16).padStart(2, "0"));
  function U(S) {
    if (s(S), v)
      return S.toHex();
    let T = "";
    for (let tt = 0; tt < S.length; tt++)
      T += _[S[tt]];
    return T;
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
  function A(S) {
    if (typeof S != "string")
      throw new Error("hex string expected, got " + typeof S);
    if (v)
      return Uint8Array.fromHex(S);
    const T = S.length, tt = T / 2;
    if (T % 2)
      throw new Error("hex string expected, got unpadded hex of length " + T);
    const k = new Uint8Array(tt);
    for (let N = 0, O = 0; N < tt; N++, O += 2) {
      const J = L(S.charCodeAt(O)), rt = L(S.charCodeAt(O + 1));
      if (J === void 0 || rt === void 0) {
        const Tt = S[O] + S[O + 1];
        throw new Error('hex string expected, got non-hex character "' + Tt + '" at index ' + O);
      }
      k[N] = J * 16 + rt;
    }
    return k;
  }
  const D = async () => {
  };
  t.nextTick = D;
  async function K(S, T, tt) {
    let k = Date.now();
    for (let N = 0; N < S; N++) {
      tt(N);
      const O = Date.now() - k;
      O >= 0 && O < T || (await (0, t.nextTick)(), k += O);
    }
  }
  function j(S) {
    if (typeof S != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(S));
  }
  function V(S) {
    return new TextDecoder().decode(S);
  }
  function m(S) {
    return typeof S == "string" && (S = j(S)), s(S), S;
  }
  function I(S) {
    return typeof S == "string" && (S = j(S)), s(S), S;
  }
  function P(...S) {
    let T = 0;
    for (let k = 0; k < S.length; k++) {
      const N = S[k];
      s(N), T += N.length;
    }
    const tt = new Uint8Array(T);
    for (let k = 0, N = 0; k < S.length; k++) {
      const O = S[k];
      tt.set(O, N), N += O.length;
    }
    return tt;
  }
  function G(S, T) {
    if (T !== void 0 && {}.toString.call(T) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(S, T);
  }
  class st {
  }
  t.Hash = st;
  function W(S) {
    const T = (k) => S().update(m(k)).digest(), tt = S();
    return T.outputLen = tt.outputLen, T.blockLen = tt.blockLen, T.create = () => S(), T;
  }
  function _t(S) {
    const T = (k, N) => S(N).update(m(k)).digest(), tt = S({});
    return T.outputLen = tt.outputLen, T.blockLen = tt.blockLen, T.create = (k) => S(k), T;
  }
  function Lt(S) {
    const T = (k, N) => S(N).update(m(k)).digest(), tt = S({});
    return T.outputLen = tt.outputLen, T.blockLen = tt.blockLen, T.create = (k) => S(k), T;
  }
  t.wrapConstructor = W, t.wrapConstructorWithOpts = _t, t.wrapXOFConstructorWithOpts = Lt;
  function Ut(S = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(S));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(S));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(zh);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = zh;
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
})(Fh);
const ds = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Rh(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function sc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Qr(t, ...e) {
  if (!Rh(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function lb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  sc(t.outputLen), sc(t.blockLen);
}
function ic(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Gh(t, e) {
  Qr(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function ub(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function fb(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Lo(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function po(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Re(t, e) {
  return t << 32 - e | t >>> e;
}
function db(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const gl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function yl(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Kh = gl ? (t) => t : (t) => yl(t), hb = Kh;
function Vh(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = yl(t[e]);
  return t;
}
const pb = gl ? (t) => t : Vh, qh = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", gb = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function yb(t) {
  if (Qr(t), qh)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += gb[t[n]];
  return e;
}
const En = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Fu(t) {
  if (t >= En._0 && t <= En._9)
    return t - En._0;
  if (t >= En.A && t <= En.F)
    return t - (En.A - 10);
  if (t >= En.a && t <= En.f)
    return t - (En.a - 10);
}
function wb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (qh)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Fu(t.charCodeAt(i)), a = Fu(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Wh = async () => {
};
async function bb(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Wh(), r += i);
  }
}
function wl(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function mb(t) {
  return new TextDecoder().decode(t);
}
function ki(t) {
  return typeof t == "string" && (t = wl(t)), Qr(t), t;
}
function xb(t) {
  return typeof t == "string" && (t = wl(t)), Qr(t), t;
}
function Sb(...t) {
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
function Eb(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Xh = class {
};
function ta(t) {
  const e = (r) => t().update(ki(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Yh(t) {
  const e = (r, s) => t(s).update(ki(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Zh(t) {
  const e = (r, s) => t(s).update(ki(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Ab = ta, $b = Yh, vb = Zh;
function Ib(t = 32) {
  if (ds && typeof ds.getRandomValues == "function")
    return ds.getRandomValues(new Uint8Array(t));
  if (ds && typeof ds.randomBytes == "function")
    return Uint8Array.from(ds.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Lb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Xh,
  abytes: Qr,
  aexists: ic,
  ahash: lb,
  anumber: sc,
  aoutput: Gh,
  asyncLoop: bb,
  byteSwap: yl,
  byteSwap32: Vh,
  byteSwapIfBE: hb,
  bytesToHex: yb,
  bytesToUtf8: mb,
  checkOpts: Eb,
  clean: Lo,
  concatBytes: Sb,
  createHasher: ta,
  createOptHasher: Yh,
  createView: po,
  createXOFer: Zh,
  hexToBytes: wb,
  isBytes: Rh,
  isLE: gl,
  kdfInputToBytes: xb,
  nextTick: Wh,
  randomBytes: Ib,
  rotl: db,
  rotr: Re,
  swap32IfBE: pb,
  swap8IfBE: Kh,
  toBytes: ki,
  u32: fb,
  u8: ub,
  utf8ToBytes: wl,
  wrapConstructor: Ab,
  wrapConstructorWithOpts: $b,
  wrapXOFConstructorWithOpts: vb
}, Symbol.toStringTag, { value: "Module" }));
function kb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function Cb(t, e, n) {
  return t & e ^ ~t & n;
}
function Bb(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Tb extends Xh {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = po(this.buffer);
  }
  update(e) {
    ic(this), e = ki(e), Qr(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = po(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ic(this), Gh(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Lo(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    kb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = po(e), c = this.outputLen;
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
]), Mb = /* @__PURE__ */ Uint32Array.from([
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
let bl = class extends Tb {
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
      const y = Re(a, 6) ^ Re(a, 11) ^ Re(a, 25), h = d + y + Cb(a, c, u) + Mb[l] + Rn[l] | 0, w = (Re(r, 2) ^ Re(r, 13) ^ Re(r, 22)) + Bb(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Lo(Rn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Lo(this.buffer);
  }
}, Qh = class extends bl {
  constructor() {
    super(28), this.A = zn[0] | 0, this.B = zn[1] | 0, this.C = zn[2] | 0, this.D = zn[3] | 0, this.E = zn[4] | 0, this.F = zn[5] | 0, this.G = zn[6] | 0, this.H = zn[7] | 0;
  }
};
const _b = /* @__PURE__ */ ta(() => new bl()), Ub = /* @__PURE__ */ ta(() => new Qh()), Nb = bl, Hb = _b, Pb = Qh, Ob = Ub, Db = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Pb,
  SHA256: Nb,
  sha224: Ob,
  sha256: Hb
}, Symbol.toStringTag, { value: "Module" })), ea = /* @__PURE__ */ Vo(Db), jb = /* @__PURE__ */ Vo(Gw);
var _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
_s.joseToDer = _s.derToJose = void 0;
const Jh = Li, t0 = pe;
function Ta(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Fb = {
  ES256: Ta(256),
  ES384: Ta(384),
  ES512: Ta(521)
};
function e0(t) {
  const e = Fb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const ko = 128, n0 = 0, zb = 32, Rb = 16, Gb = 2, r0 = Rb | zb | n0 << 6, Co = Gb | n0 << 6;
function s0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Jh.toByteArray)((0, t0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Kb(t, e) {
  const n = s0(t), r = e0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== r0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (ko | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Co)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Co)
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
  return g.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, t0.escape)((0, Jh.fromByteArray)(g));
}
_s.derToJose = Kb;
function zu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= ko && --r, r;
}
function Vb(t, e) {
  t = s0(t);
  const n = e0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = zu(t, 0, n), i = zu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < ko, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = r0, u ? d[l++] = c : (d[l++] = ko | 1, d[l++] = c & 255), d[l++] = Co, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = Co, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
_s.joseToDer = Vb;
var Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.InvalidTokenError = Bn.MissingParametersError = void 0;
class qb extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Bn.MissingParametersError = qb;
class Wb extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Bn.InvalidTokenError = Wb;
const Ci = /* @__PURE__ */ Vo(Lb);
Object.defineProperty(Qo, "__esModule", { value: !0 });
Qo.SECP256K1Client = void 0;
const Xb = Fh, Yb = ea, go = jb, Ru = _s, Gu = Bn, Ku = Ci;
go.utils.hmacSha256Sync = (t, ...e) => {
  const n = Xb.hmac.create(Yb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class i0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Ku.bytesToHex)(go.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Gu.MissingParametersError("a signing input hash and private key are all required");
    const s = go.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Ku.bytesToHex)(s);
    if (r === "jose")
      return (0, Ru.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Ru.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Gu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return go.verify(n, e, r, { strict: !1 });
  }
}
Qo.SECP256K1Client = i0;
i0.algorithmName = "ES256K";
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
const Zb = /* @__PURE__ */ Vo(dh);
var Qb = ye && ye.__awaiter || function(t, e, n, r) {
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
const Jb = ea;
function o0(t) {
  return (0, Jb.sha256)(t);
}
Hr.hashSha256 = o0;
function t2(t) {
  return Qb(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Zb;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(o0(t));
    }
  });
}
Hr.hashSha256Async = t2;
var e2 = ye && ye.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Ms, "__esModule", { value: !0 });
Ms.TokenSigner = Ms.createUnsecuredToken = void 0;
const oc = pe, Vu = Zo, n2 = Bn, qu = Hr;
function ac(t, e) {
  const n = [], r = oc.encode(JSON.stringify(e));
  n.push(r);
  const s = oc.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function r2(t) {
  return ac(t, { typ: "JWT", alg: "none" }) + ".";
}
Ms.createUnsecuredToken = r2;
class s2 {
  constructor(e, n) {
    if (!(e && n))
      throw new n2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Vu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Vu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = ac(e, s), o = (0, qu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return e2(this, void 0, void 0, function* () {
      const s = this.header(r), i = ac(e, s), o = yield (0, qu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [oc.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Ms.TokenSigner = s2;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
na.TokenVerifier = void 0;
const i2 = pe, Wu = Zo, o2 = Bn, Ki = Hr;
class a2 {
  constructor(e, n) {
    if (!(e && n))
      throw new o2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Wu.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Wu.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Ki.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Ki.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), i2.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ki.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Ki.hashSha256)(r);
      return i(o);
    }
  }
}
na.TokenVerifier = a2;
var ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
ra.decodeToken = void 0;
const Vi = pe;
function c2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Vi.decode(e[0])), r = JSON.parse(Vi.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Vi.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Vi.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
ra.decodeToken = c2;
(function(t) {
  var e = ye && ye.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = ye && ye.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Ms, t), n(na, t), n(ra, t), n(Bn, t), n(Zo, t);
})(oe);
function l2(t) {
  return `did:btc-addr:${t}`;
}
function u2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Lu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Lu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function a0(t) {
  if (t)
    return u2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const f2 = "1.4.0";
function d2() {
  return X1();
}
function h2(t, e, n, r = nh.slice(), s, i = Vy().getTime(), o = {}) {
  const a = (h) => {
    const g = rl("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return g == null ? void 0 : g.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Wy(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: f2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = oe.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = _h(u);
  return c.iss = l2(d), new oe.TokenSigner("ES256k", t).sign(c);
}
async function Xu(t, e) {
  const n = vi(xt(e)), r = JSON.parse(n), s = await Ph(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function p2(t) {
  const e = oe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new oe.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function g2(t) {
  const e = oe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = a0(e.iss);
  if (n.length === 1) {
    if (_h(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function y2(t) {
  const e = oe.decodeToken(t).payload;
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
function w2(t) {
  const e = oe.decodeToken(t).payload;
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
function b2(t) {
  const e = [
    w2(t),
    y2(t),
    p2(t),
    g2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Yu = "1.0.0";
class hr {
  constructor(e) {
    this.version = Yu, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Yu)
      throw new Qa(`JSON data version ${e.version} not supported by SessionData`);
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
class c0 {
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
class Zu extends c0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new hr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new rh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new hr({})), !0;
  }
}
class Qu extends c0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Ry, !localStorage.getItem(this.key)) {
      const r = new hr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new rh("No session data was found in localStorage");
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
var di;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(di || (di = {}));
var Bo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Bo || (Bo = {}));
di.Mainnet;
var kn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(kn || (kn = {}));
var dn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(dn || (dn = {}));
kn.Mainnet;
const l0 = {
  chainId: di.Mainnet,
  transactionVersion: kn.Mainnet,
  peerNetworkId: Bo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: dn.MainnetSingleSig,
    multiSig: dn.MainnetMultiSig
  },
  client: { baseUrl: sh }
}, cc = {
  chainId: di.Testnet,
  transactionVersion: kn.Testnet,
  peerNetworkId: Bo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: dn.TestnetSingleSig,
    multiSig: dn.TestnetMultiSig
  },
  client: { baseUrl: ih }
}, yo = {
  ...cc,
  addressVersion: { ...cc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: oh }
}, m2 = {
  ...yo,
  addressVersion: { ...yo.addressVersion },
  client: { ...yo.client }
};
function x2(t) {
  switch (t) {
    case "mainnet":
      return l0;
    case "testnet":
      return cc;
    case "devnet":
      return yo;
    case "mocknet":
      return m2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function u0(t) {
  return typeof t == "string" ? x2(t) : t;
}
var Ju;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ju || (Ju = {}));
var tf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(tf || (tf = {}));
var Ge;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ge || (Ge = {}));
const Ma = ["onChainOnly", "offChainOnly", "any"];
Ma[0] + "", Ge.OnChainOnly, Ma[1] + "", Ge.OffChainOnly, Ma[2] + "", Ge.Any, Ge.OnChainOnly + "", Ge.OnChainOnly, Ge.OffChainOnly + "", Ge.OffChainOnly, Ge.Any + "", Ge.Any;
var ef;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ef || (ef = {}));
var nf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(nf || (nf = {}));
var rf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(rf || (rf = {}));
var In;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(In || (In = {}));
var sf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(sf || (sf = {}));
var of;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(of || (of = {}));
var af;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(af || (af = {}));
var cf;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(cf || (cf = {}));
var lf;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(lf || (lf = {}));
var uf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(uf || (uf = {}));
var ff;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ff || (ff = {}));
var df;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(df || (df = {}));
var hf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(hf || (hf = {}));
function lc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function S2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function f0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function E2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  lc(t.outputLen), lc(t.blockLen);
}
function A2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function $2(t, e) {
  f0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $r = {
  number: lc,
  bool: S2,
  bytes: f0,
  hash: E2,
  exists: A2,
  output: $2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _a = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), on = (t, e) => t << 32 - e | t >>> e, v2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!v2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function I2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ml(t) {
  if (typeof t == "string" && (t = I2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let d0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Jr(t) {
  const e = (r) => t().update(ml(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let h0 = class extends d0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $r.hash(e);
    const r = ml(n);
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
const p0 = (t, e, n) => new h0(t, e).update(n).digest();
p0.create = (t, e) => new h0(t, e);
function L2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let xl = class extends d0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _a(this.buffer);
  }
  update(e) {
    $r.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ml(e);
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
    L2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const k2 = (t, e, n) => t & e ^ ~t & n, C2 = (t, e, n) => t & e ^ t & n ^ e & n, B2 = new Uint32Array([
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
let g0 = class extends xl {
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
      const y = on(a, 6) ^ on(a, 11) ^ on(a, 25), h = d + y + k2(a, c, u) + B2[l] + Kn[l] | 0, w = (on(r, 2) ^ on(r, 13) ^ on(r, 22)) + C2(r, s, i) | 0;
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
}, T2 = class extends g0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const y0 = Jr(() => new g0());
Jr(() => new T2());
var ts = {}, Sl = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Ci;
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
})(Sl);
var Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.c32checkDecode = Pr.c32checkEncode = void 0;
const pf = ea, gf = Ci, oi = Sl;
function w0(t) {
  const e = (0, pf.sha256)((0, pf.sha256)((0, gf.hexToBytes)(t)));
  return (0, gf.bytesToHex)(e.slice(0, 4));
}
function M2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = w0(`${n}${e}`), s = (0, oi.c32encode)(`${e}${r}`);
  return `${oi.c32[t]}${s}`;
}
Pr.c32checkEncode = M2;
function _2(t) {
  t = (0, oi.c32normalize)(t);
  const e = (0, oi.c32decode)(t.slice(1)), n = t[0], r = oi.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), w0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Pr.c32checkDecode = _2;
var b0 = {}, Us = {};
Object.defineProperty(Us, "__esModule", { value: !0 });
Us.decode = Us.encode = void 0;
const To = ea, yf = Ci, m0 = kh, x0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function U2(t, e = "00") {
  const n = typeof t == "string" ? (0, yf.hexToBytes)(t) : t, r = typeof e == "string" ? (0, yf.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, To.sha256)((0, To.sha256)(new Uint8Array([...r, ...n])));
  return m0(x0).encode([...r, ...n, ...s.slice(0, 4)]);
}
Us.encode = U2;
function N2(t) {
  const e = m0(x0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, To.sha256)((0, To.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Us.decode = N2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Pr, n = Us, r = Ci;
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
})(b0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Sl;
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
  const r = b0;
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
function H2(t, e) {
  switch (e = u0(e ?? l0), t) {
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
const P2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), S0 = Uint8Array.from({ length: 16 }, (t, e) => e), O2 = S0.map((t) => (9 * t + 5) % 16);
let El = [S0], Al = [O2];
for (let t = 0; t < 4; t++)
  for (let e of [El, Al])
    e.push(e[t].map((n) => P2[n]));
const E0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), D2 = El.map((t, e) => t.map((n) => E0[e][n])), j2 = Al.map((t, e) => t.map((n) => E0[e][n])), F2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), z2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qi = (t, e) => t << e | t >>> 32 - e;
function wf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Wi = new Uint32Array(16);
let R2 = class extends xl {
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
      Wi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = F2[h], v = z2[h], _ = El[h], U = Al[h], b = D2[h], L = j2[h];
      for (let A = 0; A < 16; A++) {
        const D = qi(r + wf(h, i, a, u) + Wi[_[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = qi(a, 10) | 0, a = i, i = D;
      }
      for (let A = 0; A < 16; A++) {
        const D = qi(s + wf(g, o, c, d) + Wi[U[A]] + v, L[A]) + y | 0;
        s = y, y = d, d = qi(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Wi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const G2 = Jr(() => new R2()), Xi = BigInt(2 ** 32 - 1), uc = BigInt(32);
function A0(t, e = !1) {
  return e ? { h: Number(t & Xi), l: Number(t >> uc & Xi) } : { h: Number(t >> uc & Xi) | 0, l: Number(t & Xi) | 0 };
}
function K2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = A0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const V2 = (t, e) => BigInt(t >>> 0) << uc | BigInt(e >>> 0), q2 = (t, e, n) => t >>> n, W2 = (t, e, n) => t << 32 - n | e >>> n, X2 = (t, e, n) => t >>> n | e << 32 - n, Y2 = (t, e, n) => t << 32 - n | e >>> n, Z2 = (t, e, n) => t << 64 - n | e >>> n - 32, Q2 = (t, e, n) => t >>> n - 32 | e << 64 - n, J2 = (t, e) => e, tm = (t, e) => t, em = (t, e, n) => t << n | e >>> 32 - n, nm = (t, e, n) => e << n | t >>> 32 - n, rm = (t, e, n) => e << n - 32 | t >>> 64 - n, sm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function im(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const om = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), am = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, cm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), lm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, um = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), fm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, at = {
  fromBig: A0,
  split: K2,
  toBig: V2,
  shrSH: q2,
  shrSL: W2,
  rotrSH: X2,
  rotrSL: Y2,
  rotrBH: Z2,
  rotrBL: Q2,
  rotr32H: J2,
  rotr32L: tm,
  rotlSH: em,
  rotlSL: nm,
  rotlBH: rm,
  rotlBL: sm,
  add: im,
  add3L: om,
  add3H: am,
  add4L: cm,
  add4H: lm,
  add5H: fm,
  add5L: um
}, [dm, hm] = at.split([
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
let sa = class extends xl {
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
      const L = Vn[b - 15] | 0, A = qn[b - 15] | 0, D = at.rotrSH(L, A, 1) ^ at.rotrSH(L, A, 8) ^ at.shrSH(L, A, 7), K = at.rotrSL(L, A, 1) ^ at.rotrSL(L, A, 8) ^ at.shrSL(L, A, 7), j = Vn[b - 2] | 0, V = qn[b - 2] | 0, m = at.rotrSH(j, V, 19) ^ at.rotrBH(j, V, 61) ^ at.shrSH(j, V, 6), I = at.rotrSL(j, V, 19) ^ at.rotrBL(j, V, 61) ^ at.shrSL(j, V, 6), P = at.add4L(K, I, qn[b - 7], qn[b - 16]), G = at.add4H(P, D, m, Vn[b - 7], Vn[b - 16]);
      Vn[b] = G | 0, qn[b] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: v, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = at.rotrSH(l, y, 14) ^ at.rotrSH(l, y, 18) ^ at.rotrBH(l, y, 41), A = at.rotrSL(l, y, 14) ^ at.rotrSL(l, y, 18) ^ at.rotrBL(l, y, 41), D = l & h ^ ~l & w, K = y & g ^ ~y & v, j = at.add5L(U, A, K, hm[b], qn[b]), V = at.add5H(j, _, L, D, dm[b], Vn[b]), m = j | 0, I = at.rotrSH(r, s, 28) ^ at.rotrBH(r, s, 34) ^ at.rotrBH(r, s, 39), P = at.rotrSL(r, s, 28) ^ at.rotrBL(r, s, 34) ^ at.rotrBL(r, s, 39), G = r & i ^ r & a ^ i & a, st = s & o ^ s & c ^ o & c;
      _ = w | 0, U = v | 0, w = h | 0, v = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = at.add(u | 0, d | 0, V | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = at.add3L(m, P, st);
      r = at.add3H(W, V, I, G), s = W | 0;
    }
    ({ h: r, l: s } = at.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = at.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = at.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = at.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = at.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = at.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: v } = at.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: _, l: U } = at.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, d, l, y, h, g, w, v, _, U);
  }
  roundClean() {
    Vn.fill(0), qn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, pm = class extends sa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, gm = class extends sa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ym = class extends sa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Jr(() => new sa());
Jr(() => new pm());
Jr(() => new gm());
Jr(() => new ym());
var Mo = { exports: {} };
Mo.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", h = "[object Number]", g = "[object Object]", w = "[object Promise]", v = "[object RegExp]", _ = "[object Set]", U = "[object String]", b = "[object Symbol]", L = "[object WeakMap]", A = "[object ArrayBuffer]", D = "[object DataView]", K = "[object Float32Array]", j = "[object Float64Array]", V = "[object Int8Array]", m = "[object Int16Array]", I = "[object Int32Array]", P = "[object Uint8Array]", G = "[object Uint8ClampedArray]", st = "[object Uint16Array]", W = "[object Uint32Array]", _t = /[\\^$.*+?()[\]{}|]/g, Lt = /\w*$/, Ut = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, T = {};
  T[i] = T[o] = T[A] = T[D] = T[a] = T[c] = T[K] = T[j] = T[V] = T[m] = T[I] = T[y] = T[h] = T[g] = T[v] = T[_] = T[U] = T[b] = T[P] = T[G] = T[st] = T[W] = !0, T[u] = T[d] = T[L] = !1;
  var tt = typeof ye == "object" && ye && ye.Object === Object && ye, k = typeof self == "object" && self && self.Object === Object && self, N = tt || k || Function("return this")(), O = e && !e.nodeType && e, J = O && !0 && t && !t.nodeType && t, rt = J && J.exports === O;
  function Tt(p, $) {
    return p.set($[0], $[1]), p;
  }
  function le(p, $) {
    return p.add($), p;
  }
  function Dt(p, $) {
    for (var C = -1, Z = p ? p.length : 0; ++C < Z && $(p[C], C, p) !== !1; )
      ;
    return p;
  }
  function ue(p, $) {
    for (var C = -1, Z = $.length, ie = p.length; ++C < Z; )
      p[ie + C] = $[C];
    return p;
  }
  function be(p, $, C, Z) {
    for (var ie = -1, xe = p ? p.length : 0; ++ie < xe; )
      C = $(C, p[ie], ie, p);
    return C;
  }
  function fe(p, $) {
    for (var C = -1, Z = Array(p); ++C < p; )
      Z[C] = $(C);
    return Z;
  }
  function Gt(p, $) {
    return p == null ? void 0 : p[$];
  }
  function Wt(p) {
    var $ = !1;
    if (p != null && typeof p.toString != "function")
      try {
        $ = !!(p + "");
      } catch {
      }
    return $;
  }
  function jt(p) {
    var $ = -1, C = Array(p.size);
    return p.forEach(function(Z, ie) {
      C[++$] = [ie, Z];
    }), C;
  }
  function f(p, $) {
    return function(C) {
      return p($(C));
    };
  }
  function E(p) {
    var $ = -1, C = Array(p.size);
    return p.forEach(function(Z) {
      C[++$] = Z;
    }), C;
  }
  var B = Array.prototype, Y = Function.prototype, ht = Object.prototype, $t = N["__core-js_shared__"], re = function() {
    var p = /[^.]+$/.exec($t && $t.keys && $t.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), te = Y.toString, Xt = ht.hasOwnProperty, Qe = ht.toString, wr = RegExp(
    "^" + te.call(Xt).replace(_t, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), _n = rt ? N.Buffer : void 0, de = N.Symbol, ve = N.Uint8Array, Je = f(Object.getPrototypeOf, Object), wt = Object.create, Et = ht.propertyIsEnumerable, Ft = B.splice, me = Object.getOwnPropertySymbols, br = _n ? _n.isBuffer : void 0, Jt = f(Object.keys, Object), Un = ls(N, "DataView"), Ne = ls(N, "Map"), He = ls(N, "Promise"), Nn = ls(N, "Set"), tn = ls(N, "WeakMap"), en = ls(Object, "create"), Hn = xr(Un), is = xr(Ne), os = xr(He), X = xr(Nn), nt = xr(tn), x = de ? de.prototype : void 0, M = x ? x.valueOf : void 0;
  function q(p) {
    var $ = -1, C = p ? p.length : 0;
    for (this.clear(); ++$ < C; ) {
      var Z = p[$];
      this.set(Z[0], Z[1]);
    }
  }
  function St() {
    this.__data__ = en ? en(null) : {};
  }
  function R(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function kt(p) {
    var $ = this.__data__;
    if (en) {
      var C = $[p];
      return C === r ? void 0 : C;
    }
    return Xt.call($, p) ? $[p] : void 0;
  }
  function gt(p) {
    var $ = this.__data__;
    return en ? $[p] !== void 0 : Xt.call($, p);
  }
  function Nt(p, $) {
    var C = this.__data__;
    return C[p] = en && $ === void 0 ? r : $, this;
  }
  q.prototype.clear = St, q.prototype.delete = R, q.prototype.get = kt, q.prototype.has = gt, q.prototype.set = Nt;
  function se(p) {
    var $ = -1, C = p ? p.length : 0;
    for (this.clear(); ++$ < C; ) {
      var Z = p[$];
      this.set(Z[0], Z[1]);
    }
  }
  function nn() {
    this.__data__ = [];
  }
  function xn(p) {
    var $ = this.__data__, C = _i($, p);
    if (C < 0)
      return !1;
    var Z = $.length - 1;
    return C == Z ? $.pop() : Ft.call($, C, 1), !0;
  }
  function Ie(p) {
    var $ = this.__data__, C = _i($, p);
    return C < 0 ? void 0 : $[C][1];
  }
  function rn(p) {
    return _i(this.__data__, p) > -1;
  }
  function kg(p, $) {
    var C = this.__data__, Z = _i(C, p);
    return Z < 0 ? C.push([p, $]) : C[Z][1] = $, this;
  }
  se.prototype.clear = nn, se.prototype.delete = xn, se.prototype.get = Ie, se.prototype.has = rn, se.prototype.set = kg;
  function as(p) {
    var $ = -1, C = p ? p.length : 0;
    for (this.clear(); ++$ < C; ) {
      var Z = p[$];
      this.set(Z[0], Z[1]);
    }
  }
  function Cg() {
    this.__data__ = {
      hash: new q(),
      map: new (Ne || se)(),
      string: new q()
    };
  }
  function Bg(p) {
    return Ui(this, p).delete(p);
  }
  function Tg(p) {
    return Ui(this, p).get(p);
  }
  function Mg(p) {
    return Ui(this, p).has(p);
  }
  function _g(p, $) {
    return Ui(this, p).set(p, $), this;
  }
  as.prototype.clear = Cg, as.prototype.delete = Bg, as.prototype.get = Tg, as.prototype.has = Mg, as.prototype.set = _g;
  function cs(p) {
    this.__data__ = new se(p);
  }
  function Ug() {
    this.__data__ = new se();
  }
  function Ng(p) {
    return this.__data__.delete(p);
  }
  function Hg(p) {
    return this.__data__.get(p);
  }
  function Pg(p) {
    return this.__data__.has(p);
  }
  function Og(p, $) {
    var C = this.__data__;
    if (C instanceof se) {
      var Z = C.__data__;
      if (!Ne || Z.length < n - 1)
        return Z.push([p, $]), this;
      C = this.__data__ = new as(Z);
    }
    return C.set(p, $), this;
  }
  cs.prototype.clear = Ug, cs.prototype.delete = Ng, cs.prototype.get = Hg, cs.prototype.has = Pg, cs.prototype.set = Og;
  function Dg(p, $) {
    var C = Aa(p) || ly(p) ? fe(p.length, String) : [], Z = C.length, ie = !!Z;
    for (var xe in p)
      Xt.call(p, xe) && !(ie && (xe == "length" || iy(xe, Z))) && C.push(xe);
    return C;
  }
  function hu(p, $, C) {
    var Z = p[$];
    (!(Xt.call(p, $) && wu(Z, C)) || C === void 0 && !($ in p)) && (p[$] = C);
  }
  function _i(p, $) {
    for (var C = p.length; C--; )
      if (wu(p[C][0], $))
        return C;
    return -1;
  }
  function jg(p, $) {
    return p && pu($, $a($), p);
  }
  function Sa(p, $, C, Z, ie, xe, Sn) {
    var Se;
    if (Z && (Se = xe ? Z(p, ie, xe, Sn) : Z(p)), Se !== void 0)
      return Se;
    if (!Ni(p))
      return p;
    var xu = Aa(p);
    if (xu) {
      if (Se = ny(p), !$)
        return Jg(p, Se);
    } else {
      var us = mr(p), Su = us == d || us == l;
      if (fy(p))
        return Vg(p, $);
      if (us == g || us == i || Su && !xe) {
        if (Wt(p))
          return xe ? p : {};
        if (Se = ry(Su ? {} : p), !$)
          return ty(p, jg(Se, p));
      } else {
        if (!T[us])
          return xe ? p : {};
        Se = sy(p, us, Sa, $);
      }
    }
    Sn || (Sn = new cs());
    var Eu = Sn.get(p);
    if (Eu)
      return Eu;
    if (Sn.set(p, Se), !xu)
      var Au = C ? ey(p) : $a(p);
    return Dt(Au || p, function(va, Hi) {
      Au && (Hi = va, va = p[Hi]), hu(Se, Hi, Sa(va, $, C, Z, Hi, p, Sn));
    }), Se;
  }
  function Fg(p) {
    return Ni(p) ? wt(p) : {};
  }
  function zg(p, $, C) {
    var Z = $(p);
    return Aa(p) ? Z : ue(Z, C(p));
  }
  function Rg(p) {
    return Qe.call(p);
  }
  function Gg(p) {
    if (!Ni(p) || ay(p))
      return !1;
    var $ = mu(p) || Wt(p) ? wr : Ut;
    return $.test(xr(p));
  }
  function Kg(p) {
    if (!yu(p))
      return Jt(p);
    var $ = [];
    for (var C in Object(p))
      Xt.call(p, C) && C != "constructor" && $.push(C);
    return $;
  }
  function Vg(p, $) {
    if ($)
      return p.slice();
    var C = new p.constructor(p.length);
    return p.copy(C), C;
  }
  function Ea(p) {
    var $ = new p.constructor(p.byteLength);
    return new ve($).set(new ve(p)), $;
  }
  function qg(p, $) {
    var C = $ ? Ea(p.buffer) : p.buffer;
    return new p.constructor(C, p.byteOffset, p.byteLength);
  }
  function Wg(p, $, C) {
    var Z = $ ? C(jt(p), !0) : jt(p);
    return be(Z, Tt, new p.constructor());
  }
  function Xg(p) {
    var $ = new p.constructor(p.source, Lt.exec(p));
    return $.lastIndex = p.lastIndex, $;
  }
  function Yg(p, $, C) {
    var Z = $ ? C(E(p), !0) : E(p);
    return be(Z, le, new p.constructor());
  }
  function Zg(p) {
    return M ? Object(M.call(p)) : {};
  }
  function Qg(p, $) {
    var C = $ ? Ea(p.buffer) : p.buffer;
    return new p.constructor(C, p.byteOffset, p.length);
  }
  function Jg(p, $) {
    var C = -1, Z = p.length;
    for ($ || ($ = Array(Z)); ++C < Z; )
      $[C] = p[C];
    return $;
  }
  function pu(p, $, C, Z) {
    C || (C = {});
    for (var ie = -1, xe = $.length; ++ie < xe; ) {
      var Sn = $[ie], Se = void 0;
      hu(C, Sn, Se === void 0 ? p[Sn] : Se);
    }
    return C;
  }
  function ty(p, $) {
    return pu(p, gu(p), $);
  }
  function ey(p) {
    return zg(p, $a, gu);
  }
  function Ui(p, $) {
    var C = p.__data__;
    return oy($) ? C[typeof $ == "string" ? "string" : "hash"] : C.map;
  }
  function ls(p, $) {
    var C = Gt(p, $);
    return Gg(C) ? C : void 0;
  }
  var gu = me ? f(me, Object) : py, mr = Rg;
  (Un && mr(new Un(new ArrayBuffer(1))) != D || Ne && mr(new Ne()) != y || He && mr(He.resolve()) != w || Nn && mr(new Nn()) != _ || tn && mr(new tn()) != L) && (mr = function(p) {
    var $ = Qe.call(p), C = $ == g ? p.constructor : void 0, Z = C ? xr(C) : void 0;
    if (Z)
      switch (Z) {
        case Hn:
          return D;
        case is:
          return y;
        case os:
          return w;
        case X:
          return _;
        case nt:
          return L;
      }
    return $;
  });
  function ny(p) {
    var $ = p.length, C = p.constructor($);
    return $ && typeof p[0] == "string" && Xt.call(p, "index") && (C.index = p.index, C.input = p.input), C;
  }
  function ry(p) {
    return typeof p.constructor == "function" && !yu(p) ? Fg(Je(p)) : {};
  }
  function sy(p, $, C, Z) {
    var ie = p.constructor;
    switch ($) {
      case A:
        return Ea(p);
      case a:
      case c:
        return new ie(+p);
      case D:
        return qg(p, Z);
      case K:
      case j:
      case V:
      case m:
      case I:
      case P:
      case G:
      case st:
      case W:
        return Qg(p, Z);
      case y:
        return Wg(p, Z, C);
      case h:
      case U:
        return new ie(p);
      case v:
        return Xg(p);
      case _:
        return Yg(p, Z, C);
      case b:
        return Zg(p);
    }
  }
  function iy(p, $) {
    return $ = $ ?? s, !!$ && (typeof p == "number" || S.test(p)) && p > -1 && p % 1 == 0 && p < $;
  }
  function oy(p) {
    var $ = typeof p;
    return $ == "string" || $ == "number" || $ == "symbol" || $ == "boolean" ? p !== "__proto__" : p === null;
  }
  function ay(p) {
    return !!re && re in p;
  }
  function yu(p) {
    var $ = p && p.constructor, C = typeof $ == "function" && $.prototype || ht;
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
  function cy(p) {
    return Sa(p, !0, !0);
  }
  function wu(p, $) {
    return p === $ || p !== p && $ !== $;
  }
  function ly(p) {
    return uy(p) && Xt.call(p, "callee") && (!Et.call(p, "callee") || Qe.call(p) == i);
  }
  var Aa = Array.isArray;
  function bu(p) {
    return p != null && dy(p.length) && !mu(p);
  }
  function uy(p) {
    return hy(p) && bu(p);
  }
  var fy = br || gy;
  function mu(p) {
    var $ = Ni(p) ? Qe.call(p) : "";
    return $ == d || $ == l;
  }
  function dy(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function Ni(p) {
    var $ = typeof p;
    return !!p && ($ == "object" || $ == "function");
  }
  function hy(p) {
    return !!p && typeof p == "object";
  }
  function $a(p) {
    return bu(p) ? Dg(p) : Kg(p);
  }
  function py() {
    return [];
  }
  function gy() {
    return !1;
  }
  t.exports = cy;
})(Mo, Mo.exports);
var wm = Mo.exports;
const $0 = /* @__PURE__ */ Qd(wm);
var fc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(fc || (fc = {}));
function bm(t, e) {
  return { type: fc.Address, version: t, hash160: e };
}
function mm(t) {
  return ts.c32address(t.version, t.hash160);
}
const xm = (t) => G2(y0(t)), Sm = (t) => et(xm(t));
qt.hmacSha256Sync = (t, ...e) => {
  const n = p0.create(y0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Em(t, e = "mainnet") {
  e = u0(e), t = typeof t == "string" ? xt(t) : t;
  const n = H2(In.P2PKH, e), r = bm(n, Sm(t));
  return mm(r);
}
function Am(t, e) {
  const n = oe.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Em(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new oe.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function $m(t, e = null) {
  let n;
  e ? n = Am(t, e) : n = oe.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const bf = "_blockstackDidCheckEchoReply", vm = "echoReply", Im = "authContinuation";
function Lm(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function km() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[bf];
  if (typeof e == "boolean")
    return e;
  const n = Lm(t.location.search), r = n[vm];
  if (r) {
    t[bf] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Im];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class dc {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new ah();
    else
      throw new Ky("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Qu(e.sessionOptions) : this.store = new Qu() : e ? this.store = new Zu(e.sessionOptions) : this.store = new Zu();
  }
  makeAuthRequestToken(e, n, r, s, i, o = qy().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Qa("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, h2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = d2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = rl("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (km())
        return bs.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      bs.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = yw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Pi("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = oe.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await b2(e))
      throw new Pi("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (La(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Xu(s, i.private_key);
          } catch {
            if (bs.warn("Failed decryption of appPrivateKey, will try to use as given"), !qt.isValidPrivateKey(i.private_key))
              throw new Pi("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Xu(s, c);
          } catch {
            bs.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Pi("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = iw, d;
    La(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), La(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: a0(i.iss),
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
        l.profile = Object.assign({}, zy);
      else {
        const g = await h.text(), w = JSON.parse(g);
        l.profile = $m(w[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Qa("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ib(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ob(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
dc.prototype.makeAuthRequest = dc.prototype.makeAuthRequestToken;
const Cm = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Bm = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Cm(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!ia(r.id));
  return e.concat(n);
}, ia = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), v0 = "STX_PROVIDER", Or = () => typeof window > "u" ? null : window.localStorage.getItem(v0), Tm = (t) => {
  typeof window < "u" && window.localStorage.setItem(v0, t);
}, Mm = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function _m(t, e) {
  const n = {};
  return Object.assign(n, Mm, e), await fetch(t, n);
}
function Um(t) {
  let e = _m, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Nm(...t) {
  const { fetchLib: e, middlewares: n } = Um(t);
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
var Ns;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ns || (Ns = {}));
var Dr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Dr || (Dr = {}));
var mf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(mf || (mf = {}));
const Hm = "https://api.mainnet.hiro.so", Pm = "https://api.testnet.hiro.so", Om = "http://localhost:3999", Dm = ["mainnet", "testnet", "devnet", "mocknet"];
class jr {
  constructor(e) {
    this.version = Dr.Mainnet, this.chainId = Ns.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Dr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Nm();
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
      return new hc();
    case "testnet":
      return new pc();
    case "devnet":
      return new jm();
    case "mocknet":
      return new I0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Dm.join(", ")}`);
  }
};
jr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : jr.fromName(t);
class hc extends jr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Hm,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Dr.Mainnet, this.chainId = Ns.Mainnet;
  }
}
class pc extends jr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Pm,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Dr.Testnet, this.chainId = Ns.Testnet;
  }
}
class I0 extends jr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Om,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Dr.Testnet, this.chainId = Ns.Testnet;
  }
}
const jm = I0;
var Fr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Fr || (Fr = {}));
var _o;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(_o || (_o = {}));
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
const Fm = {
  chainId: Fr.Mainnet,
  transactionVersion: zr.Mainnet,
  peerNetworkId: _o.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Rr.MainnetSingleSig,
    multiSig: Rr.MainnetMultiSig
  },
  client: { baseUrl: sh }
}, gc = {
  chainId: Fr.Testnet,
  transactionVersion: zr.Testnet,
  peerNetworkId: _o.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Rr.TestnetSingleSig,
    multiSig: Rr.TestnetMultiSig
  },
  client: { baseUrl: ih }
}, wo = {
  ...gc,
  addressVersion: { ...gc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: oh }
}, zm = {
  ...wo,
  addressVersion: { ...wo.addressVersion },
  client: { ...wo.client }
};
function Rm(t) {
  switch (t) {
    case "mainnet":
      return Fm;
    case "testnet":
      return gc;
    case "devnet":
      return wo;
    case "mocknet":
      return zm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Gm(t) {
  return typeof t == "string" ? Rm(t) : t;
}
function Km(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const xf = /* @__PURE__ */ new Map();
function L0(t, e) {
  const n = xf.get(t);
  if (n !== void 0)
    return n(e);
  const r = Km(t);
  return xf.set(t, r), L0(t, e);
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
    return dw(this.readBytes(4), 0);
  }
  readUInt8() {
    return uw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return cw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = et(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = et(n);
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
    if (L0(e, r))
      return r;
    throw n(r);
  }
};
const Vm = 128, qm = 128, k0 = 16, Cr = 32, yc = 80, oa = 65, Wm = 32, Xm = 64, Uo = 34, Ym = 1 + 16 * 1024 * 1024, Zm = 165, Qm = 16, Jm = 16, tx = 20, ex = Jm + 2 + tx, nx = ex + 4, rx = Ym + (Zm + Qm * nx);
var vt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(vt || (vt = {}));
var wc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(wc || (wc = {}));
var ke;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ke || (ke = {}));
const Ua = ["onChainOnly", "offChainOnly", "any"];
Ua[0] + "", ke.OnChainOnly, Ua[1] + "", ke.OffChainOnly, Ua[2] + "", ke.Any, ke.OnChainOnly + "", ke.OnChainOnly, ke.OffChainOnly + "", ke.OffChainOnly, ke.Any + "", ke.Any;
var No;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(No || (No = {}));
var Ht;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Ht || (Ht = {}));
var Kt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Kt || (Kt = {}));
var Ct;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ct || (Ct = {}));
var zt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(zt || (zt = {}));
var ai;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ai || (ai = {}));
var bc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(bc || (bc = {}));
var mc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(mc || (mc = {}));
var ge;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ge || (ge = {}));
var Sf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Sf || (Sf = {}));
var xc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(xc || (xc = {}));
var Ve;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ve || (Ve = {}));
var Ef;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ef || (Ef = {}));
let aa = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ms = class extends aa {
  constructor(e) {
    super(e);
  }
}, he = class extends aa {
  constructor(e) {
    super(e);
  }
}, Ho = class extends aa {
  constructor(e) {
    super(e);
  }
}, vr = class extends aa {
  constructor(e) {
    super(e);
  }
};
function Sc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function sx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function C0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ix(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Sc(t.outputLen), Sc(t.blockLen);
}
function ox(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ax(t, e) {
  C0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ir = {
  number: Sc,
  bool: sx,
  bytes: C0,
  hash: ix,
  exists: ox,
  output: ax
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Na = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), an = (t, e) => t << 32 - e | t >>> e, cx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!cx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function $l(t) {
  if (typeof t == "string" && (t = lx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let B0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function es(t) {
  const e = (r) => t().update($l(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let T0 = class extends B0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ir.hash(e);
    const r = $l(n);
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
const M0 = (t, e, n) => new T0(t, e).update(n).digest();
M0.create = (t, e) => new T0(t, e);
function ux(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let vl = class extends B0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Na(this.buffer);
  }
  update(e) {
    Ir.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = $l(e);
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
    ux(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const fx = (t, e, n) => t & e ^ ~t & n, dx = (t, e, n) => t & e ^ t & n ^ e & n, hx = new Uint32Array([
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
let _0 = class extends vl {
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
      const y = an(a, 6) ^ an(a, 11) ^ an(a, 25), h = d + y + fx(a, c, u) + hx[l] + Xn[l] | 0, w = (an(r, 2) ^ an(r, 13) ^ an(r, 22)) + dx(r, s, i) | 0;
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
}, px = class extends _0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Il = es(() => new _0());
es(() => new px());
const gx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), U0 = Uint8Array.from({ length: 16 }, (t, e) => e), yx = U0.map((t) => (9 * t + 5) % 16);
let Ll = [U0], kl = [yx];
for (let t = 0; t < 4; t++)
  for (let e of [Ll, kl])
    e.push(e[t].map((n) => gx[n]));
const N0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), wx = Ll.map((t, e) => t.map((n) => N0[e][n])), bx = kl.map((t, e) => t.map((n) => N0[e][n])), mx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), xx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Yi = (t, e) => t << e | t >>> 32 - e;
function Af(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Zi = new Uint32Array(16);
let Sx = class extends vl {
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
      Zi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = mx[h], v = xx[h], _ = Ll[h], U = kl[h], b = wx[h], L = bx[h];
      for (let A = 0; A < 16; A++) {
        const D = Yi(r + Af(h, i, a, u) + Zi[_[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Yi(a, 10) | 0, a = i, i = D;
      }
      for (let A = 0; A < 16; A++) {
        const D = Yi(s + Af(g, o, c, d) + Zi[U[A]] + v, L[A]) + y | 0;
        s = y, y = d, d = Yi(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Zi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Ex = es(() => new Sx()), Qi = BigInt(2 ** 32 - 1), Ec = BigInt(32);
function H0(t, e = !1) {
  return e ? { h: Number(t & Qi), l: Number(t >> Ec & Qi) } : { h: Number(t >> Ec & Qi) | 0, l: Number(t & Qi) | 0 };
}
function Ax(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = H0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const $x = (t, e) => BigInt(t >>> 0) << Ec | BigInt(e >>> 0), vx = (t, e, n) => t >>> n, Ix = (t, e, n) => t << 32 - n | e >>> n, Lx = (t, e, n) => t >>> n | e << 32 - n, kx = (t, e, n) => t << 32 - n | e >>> n, Cx = (t, e, n) => t << 64 - n | e >>> n - 32, Bx = (t, e, n) => t >>> n - 32 | e << 64 - n, Tx = (t, e) => e, Mx = (t, e) => t, _x = (t, e, n) => t << n | e >>> 32 - n, Ux = (t, e, n) => e << n | t >>> 32 - n, Nx = (t, e, n) => e << n - 32 | t >>> 64 - n, Hx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Px(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ox = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Dx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, jx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Fx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, zx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Rx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ct = {
  fromBig: H0,
  split: Ax,
  toBig: $x,
  shrSH: vx,
  shrSL: Ix,
  rotrSH: Lx,
  rotrSL: kx,
  rotrBH: Cx,
  rotrBL: Bx,
  rotr32H: Tx,
  rotr32L: Mx,
  rotlSH: _x,
  rotlSL: Ux,
  rotlBH: Nx,
  rotlBL: Hx,
  add: Px,
  add3L: Ox,
  add3H: Dx,
  add4L: jx,
  add4H: Fx,
  add5H: Rx,
  add5L: zx
}, [Gx, Kx] = ct.split([
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
let ca = class extends vl {
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
      const L = Yn[b - 15] | 0, A = Zn[b - 15] | 0, D = ct.rotrSH(L, A, 1) ^ ct.rotrSH(L, A, 8) ^ ct.shrSH(L, A, 7), K = ct.rotrSL(L, A, 1) ^ ct.rotrSL(L, A, 8) ^ ct.shrSL(L, A, 7), j = Yn[b - 2] | 0, V = Zn[b - 2] | 0, m = ct.rotrSH(j, V, 19) ^ ct.rotrBH(j, V, 61) ^ ct.shrSH(j, V, 6), I = ct.rotrSL(j, V, 19) ^ ct.rotrBL(j, V, 61) ^ ct.shrSL(j, V, 6), P = ct.add4L(K, I, Zn[b - 7], Zn[b - 16]), G = ct.add4H(P, D, m, Yn[b - 7], Yn[b - 16]);
      Yn[b] = G | 0, Zn[b] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: v, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = ct.rotrSH(l, y, 14) ^ ct.rotrSH(l, y, 18) ^ ct.rotrBH(l, y, 41), A = ct.rotrSL(l, y, 14) ^ ct.rotrSL(l, y, 18) ^ ct.rotrBL(l, y, 41), D = l & h ^ ~l & w, K = y & g ^ ~y & v, j = ct.add5L(U, A, K, Kx[b], Zn[b]), V = ct.add5H(j, _, L, D, Gx[b], Yn[b]), m = j | 0, I = ct.rotrSH(r, s, 28) ^ ct.rotrBH(r, s, 34) ^ ct.rotrBH(r, s, 39), P = ct.rotrSL(r, s, 28) ^ ct.rotrBL(r, s, 34) ^ ct.rotrBL(r, s, 39), G = r & i ^ r & a ^ i & a, st = s & o ^ s & c ^ o & c;
      _ = w | 0, U = v | 0, w = h | 0, v = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = ct.add(u | 0, d | 0, V | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = ct.add3L(m, P, st);
      r = ct.add3H(W, V, I, G), s = W | 0;
    }
    ({ h: r, l: s } = ct.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ct.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = ct.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = ct.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = ct.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: v } = ct.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: _, l: U } = ct.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, d, l, y, h, g, w, v, _, U);
  }
  roundClean() {
    Yn.fill(0), Zn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Vx = class extends ca {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, qx = class extends ca {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Wx = class extends ca {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
es(() => new ca());
es(() => new Vx());
const Xx = es(() => new qx());
es(() => new Wx());
var yt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(yt || (yt = {}));
var ee;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ee || (ee = {}));
function Cl(t) {
  return ee[t];
}
const Yx = () => ({ type: yt.BoolTrue }), Zx = () => ({ type: yt.BoolFalse }), Qx = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: yt.Buffer, value: et(t) };
}, $f = BigInt("0xffffffffffffffffffffffffffffffff"), Jx = BigInt(0), vf = BigInt("0x7fffffffffffffffffffffffffffffff"), If = BigInt("-170141183460469231731687303715884105728"), tS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = tc(xt(t))), $e(t, Uint8Array) && (t = tc(t));
  const e = ce(t);
  if (e > vf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${vf}`);
  if (e < If)
    throw new RangeError(`Cannot construct clarity integer form value less than ${If}`);
  return { type: yt.Int, value: e };
}, eS = (t) => {
  const e = ce(t);
  if (e < Jx)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > $f)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${$f}`);
  return { type: yt.UInt, value: e };
};
function nS(t) {
  return { type: yt.List, value: t };
}
function P0() {
  return { type: yt.OptionalNone };
}
function O0(t) {
  return { type: yt.OptionalSome, value: t };
}
var z;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(z || (z = {}));
function rS() {
  return {
    type: z.Address,
    version: Rr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Lf(t) {
  if (t && q0(t, Uo))
    throw new Error(`Memo exceeds maximum length of ${Uo} bytes`);
  return { type: z.MemoString, content: t };
}
function Bl(t, e) {
  return {
    type: z.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ac(t) {
  if (xt(t).byteLength != oa)
    throw Error("Invalid signature");
  return {
    type: z.MessageSignature,
    data: t
  };
}
function sS(t, e, n) {
  return typeof t == "string" && (t = xS(t)), typeof n == "string" && (n = Lf(n)), {
    type: z.Payload,
    payloadType: vt.TokenTransfer,
    recipient: t,
    amount: ce(e),
    memo: n ?? Lf("")
  };
}
function iS(t, e, n, r) {
  return typeof e == "string" && (e = Ye(e)), typeof n == "string" && (n = Ye(n)), {
    type: z.Payload,
    payloadType: vt.ContractCall,
    contractAddress: typeof t == "string" ? yr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function oS(t) {
  return Ye(t, 4, 1e5);
}
function kf(t, e, n) {
  return typeof t == "string" && (t = Ye(t)), typeof e == "string" && (e = oS(e)), typeof n == "number" ? {
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
function aS() {
  return { type: z.Payload, payloadType: vt.PoisonMicroblock };
}
function Cf(t, e) {
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
function cS(t, e, n) {
  if (t.byteLength != Cr)
    throw Error(`Coinbase buffer size must be ${Cr} bytes`);
  if (n.byteLength != yc)
    throw Error(`VRF proof buffer size must be ${yc} bytes`);
  return {
    type: z.Payload,
    payloadType: vt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === yt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function lS(t, e, n, r, s, i, o) {
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
  const r = e || 1, s = n || Vm;
  if (q0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: z.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function uS(t, e, n) {
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
function fS(t, e) {
  const n = yr(t), r = Ye(e);
  return {
    type: z.Principal,
    prefix: ge.Contract,
    address: n,
    contractName: r
  };
}
function dS(t) {
  const e = yr(t);
  return {
    type: z.Principal,
    prefix: ge.Standard,
    address: e
  };
}
function xs(t, e) {
  return {
    pubKeyEncoding: t,
    type: z.TransactionAuthField,
    contents: e
  };
}
function An(t) {
  switch (t.type) {
    case z.Address:
      return Bi(t);
    case z.Principal:
      return D0(t);
    case z.LengthPrefixedString:
      return Ps(t);
    case z.MemoString:
      return pS(t);
    case z.Asset:
      return F0(t);
    case z.PostCondition:
      return R0(t);
    case z.PublicKey:
      return Ic(t);
    case z.LengthPrefixedList:
      return Tl(t);
    case z.Payload:
      return G0(t);
    case z.TransactionAuthField:
      return mS(t);
    case z.MessageSignature:
      return Ml(t);
  }
}
function Bi(t) {
  const e = [];
  return e.push(xt($i(t.version, 1))), e.push(xt(t.hash160)), Zt(e);
}
function Hs(t) {
  const e = $e(t, Mt) ? t : new Mt(t), n = qo(et(e.readBytes(1))), r = et(e.readBytes(20));
  return { type: z.Address, version: n, hash160: r };
}
function D0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === ge.Standard || t.prefix === ge.Contract) && e.push(Bi(t.address)), t.prefix === ge.Contract && e.push(Ps(t.contractName)), Zt(e);
}
function hS(t) {
  const e = $e(t, Mt) ? t : new Mt(t), n = e.readUInt8Enum(ge, (i) => {
    throw new he(`Unexpected Principal payload type: ${i}`);
  });
  if (n === ge.Origin)
    return { type: z.Principal, prefix: n };
  const r = Hs(e);
  if (n === ge.Standard)
    return { type: z.Principal, prefix: n, address: r };
  const s = je(e);
  return {
    type: z.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Ps(t) {
  const e = [], n = Yr(t.content), r = n.byteLength;
  return e.push(xt($i(r, t.lengthPrefixBytes))), e.push(n), Zt(e);
}
function je(t, e, n) {
  e = e || 1;
  const r = $e(t, Mt) ? t : new Mt(t), s = qo(et(r.readBytes(e))), i = vi(r.readBytes(s));
  return Ye(i, e, n ?? 128);
}
function pS(t) {
  const e = [], n = Yr(t.content), r = zS(et(n), Uo * 2);
  return e.push(xt(r)), Zt(e);
}
function j0(t) {
  const e = $e(t, Mt) ? t : new Mt(t);
  let n = vi(e.readBytes(Uo));
  return n = n.replace(/\u0000*$/, ""), { type: z.MemoString, content: n };
}
function F0(t) {
  const e = [];
  return e.push(Bi(t.address)), e.push(Ps(t.contractName)), e.push(Ps(t.assetName)), Zt(e);
}
function $c(t) {
  const e = $e(t, Mt) ? t : new Mt(t);
  return {
    type: z.Asset,
    address: Hs(e),
    contractName: je(e),
    assetName: je(e)
  };
}
function Tl(t) {
  const e = t.values, n = [];
  n.push(xt($i(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(An(r));
  return Zt(n);
}
function z0(t, e, n) {
  const r = $e(t, Mt) ? t : new Mt(t), s = qo(et(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case z.Address:
        i.push(Hs(r));
        break;
      case z.LengthPrefixedString:
        i.push(je(r));
        break;
      case z.MemoString:
        i.push(j0(r));
        break;
      case z.Asset:
        i.push($c(r));
        break;
      case z.PostCondition:
        i.push(yS(r));
        break;
      case z.PublicKey:
        i.push(Lc(r));
        break;
      case z.TransactionAuthField:
        i.push(bS(r));
        break;
    }
  return Bl(i, n);
}
function gS(t) {
  return et(R0(t));
}
function R0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(D0(t.principal)), (t.conditionType === Ht.Fungible || t.conditionType === Ht.NonFungible) && e.push(F0(t.asset)), t.conditionType === Ht.NonFungible && e.push(hn(t.assetName)), e.push(t.conditionCode), t.conditionType === Ht.STX || t.conditionType === Ht.Fungible || t.conditionType === Ht.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ms("The post-condition amount may not be larger than 8 bytes");
    e.push(pr(t.amount, 8));
  }
  return Zt(e);
}
function yS(t) {
  const e = $e(t, Mt) ? t : new Mt(t), n = e.readUInt8Enum(Ht, (a) => {
    throw new he(`Could not read ${a} as PostConditionType`);
  }), r = hS(e);
  let s, i, o;
  switch (n) {
    case Ht.STX:
      return s = e.readUInt8Enum(ai, (c) => {
        throw new he(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${et(e.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Ht.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Ht.Fungible:
      return i = $c(e), s = e.readUInt8Enum(ai, (c) => {
        throw new he(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${et(e.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Ht.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Ht.NonFungible:
      i = $c(e);
      const a = fn(e);
      return s = e.readUInt8Enum(bc, (c) => {
        throw new he(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: z.PostCondition,
        conditionType: Ht.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Ht.Staking:
      return s = e.readUInt8Enum(ai, (c) => {
        throw new he(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${et(e.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Ht.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Ht.PoX: {
      const c = e.readUInt8Enum(mc, (u) => {
        throw new he(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: z.PostCondition,
        conditionType: Ht.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function G0(t) {
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
      e.push(t.coinbaseBytes), e.push(hn(t.recipient ? O0(t.recipient) : P0())), e.push(t.vrfProof);
      break;
    case vt.TenureChange:
      e.push(xt(t.tenureHash)), e.push(xt(t.previousTenureHash)), e.push(xt(t.burnViewHash)), e.push(xt(t.previousTenureEnd)), e.push(_r(new Uint8Array(4), t.previousTenureBlocks)), e.push(fw(new Uint8Array(1), t.cause)), e.push(xt(t.publicKeyHash));
      break;
  }
  return Zt(e);
}
function wS(t) {
  const e = $e(t, Mt) ? t : new Mt(t);
  switch (e.readUInt8Enum(vt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case vt.TokenTransfer:
      const r = fn(e), s = ce(e.readBytes(8)), i = j0(e);
      return sS(r, s, i);
    case vt.ContractCall:
      const o = Hs(e), a = je(e), c = je(e), u = [], d = e.readUInt32BE();
      for (let L = 0; L < d; L++) {
        const A = fn(e);
        u.push(A);
      }
      return iS(o, a, c, u);
    case vt.SmartContract:
      const l = je(e), y = je(e, 4, 1e5);
      return kf(l, y);
    case vt.VersionedSmartContract: {
      const L = e.readUInt8Enum(wc, (K) => {
        throw new Error(`Cannot recognize ClarityVersion: ${K}`);
      }), A = je(e), D = je(e, 4, rx);
      return kf(A, D, L);
    }
    case vt.PoisonMicroblock:
      return aS();
    case vt.Coinbase: {
      const L = e.readBytes(Cr);
      return Cf(L);
    }
    case vt.CoinbaseToAltRecipient: {
      const L = e.readBytes(Cr), A = fn(e);
      return Cf(L, A);
    }
    case vt.NakamotoCoinbase: {
      const L = e.readBytes(Cr), A = fn(e), D = e.readBytes(yc);
      return cS(L, A, D);
    }
    case vt.TenureChange:
      const h = et(e.readBytes(20)), g = et(e.readBytes(20)), w = et(e.readBytes(20)), v = et(e.readBytes(32)), _ = e.readUInt32BE(), U = e.readUInt8Enum(xc, (L) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${L}`);
      }), b = et(e.readBytes(20));
      return lS(h, g, w, v, _, U, b);
  }
}
function vc(t) {
  const e = $e(t, Mt) ? t : new Mt(t);
  return Ac(et(e.readBytes(oa)));
}
function bS(t) {
  const e = $e(t, Mt) ? t : new Mt(t), n = e.readUInt8Enum(Ve, (r) => {
    throw new he(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Ve.PublicKeyCompressed:
      return xs(zt.Compressed, Lc(e));
    case Ve.PublicKeyUncompressed:
      return xs(zt.Uncompressed, qs(JS(Lc(e).data)));
    case Ve.SignatureCompressed:
      return xs(zt.Compressed, vc(e));
    case Ve.SignatureUncompressed:
      return xs(zt.Uncompressed, vc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Ml(t) {
  return xt(t.data);
}
function mS(t) {
  const e = [];
  switch (t.contents.type) {
    case z.PublicKey:
      e.push(t.pubKeyEncoding === zt.Compressed ? Ve.PublicKeyCompressed : Ve.PublicKeyUncompressed), e.push(xt(QS(t.contents.data)));
      break;
    case z.MessageSignature:
      e.push(t.pubKeyEncoding === zt.Compressed ? Ve.SignatureCompressed : Ve.SignatureUncompressed), e.push(Ml(t.contents));
      break;
  }
  return Zt(e);
}
function Ic(t) {
  return t.data.slice();
}
function Lc(t) {
  const e = $e(t, Mt) ? t : new Mt(t), n = e.readUInt8(), r = n === 4 ? Xm : Wm;
  return qs(Zt([n, e.readBytes(r)]));
}
function _l(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Ct.P2PKH || e === Ct.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Ct.P2WPKH || e === Ct.P2WSH || e === Ct.P2WSHNonSequential) && !r.map((s) => s.data).every(Ws))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Ct.P2PKH:
      return Ji(t, RS(r[0].data));
    case Ct.P2WPKH:
      return Ji(t, GS(r[0].data));
    case Ct.P2SH:
    case Ct.P2SHNonSequential:
      return Ji(t, KS(n, r.map(Ic)));
    case Ct.P2WSH:
    case Ct.P2WSHNonSequential:
      return Ji(t, VS(n, r.map(Ic)));
  }
}
function Ji(t, e) {
  return { type: z.Address, version: t, hash160: e };
}
function Ul(t) {
  return ts.c32address(t.version, t.hash160);
}
function Bf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return uS(e, n, r);
}
function ei(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return fS(e, n);
  } else
    return dS(t);
}
function xS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return AS(e, n);
  } else
    return SS(t);
}
function SS(t) {
  const e = yr(t);
  return { type: yt.PrincipalStandard, value: Ul(e) };
}
function ES(t) {
  return { type: yt.PrincipalStandard, value: Ul(t) };
}
function AS(t, e) {
  const n = yr(t), r = Ye(e);
  return K0(n, r);
}
function K0(t, e) {
  if (Yr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: yt.PrincipalContract,
    value: `${Ul(t)}.${e.content}`
  };
}
function $S(t) {
  return { type: yt.ResponseErr, value: t };
}
function vS(t) {
  return { type: yt.ResponseOk, value: t };
}
const IS = (t) => ({ type: yt.StringASCII, value: t }), LS = (t) => ({ type: yt.StringUTF8, value: t });
function kS(t) {
  for (const e in t)
    if (!qS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: yt.Tuple, value: t };
}
function fn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Mt(xt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Mt(t) : e = t;
  switch (e.readUInt8Enum(ee, (r) => {
    throw new he(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ee.int:
      return tS(tc(e.readBytes(16)));
    case ee.uint:
      return eS(e.readBytes(16));
    case ee.buffer:
      const r = e.readUInt32BE();
      return Qx(e.readBytes(r));
    case ee.true:
      return Yx();
    case ee.false:
      return Zx();
    case ee.address:
      const s = Hs(e);
      return ES(s);
    case ee.contract:
      const i = Hs(e), o = je(e);
      return K0(i, o);
    case ee.ok:
      return vS(fn(e));
    case ee.err:
      return $S(fn(e));
    case ee.none:
      return P0();
    case ee.some:
      return O0(fn(e));
    case ee.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(fn(e));
      return nS(c);
    case ee.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let w = 0; w < u; w++) {
        const v = je(e).content;
        if (v === void 0)
          throw new he('"content" is undefined');
        d[v] = fn(e);
      }
      return kS(d);
    case ee.ascii:
      const l = e.readUInt32BE(), y = rw(e.readBytes(l));
      return IS(y);
    case ee.utf8:
      const h = e.readUInt32BE(), g = vi(e.readBytes(h));
      return LS(g);
    default:
      throw new he("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function wn(t, e) {
  return Zt([Cl(t), e]);
}
function CS(t) {
  return new Uint8Array([Cl(t.type)]);
}
function BS(t) {
  return t.type === yt.OptionalNone ? new Uint8Array([Cl(t.type)]) : wn(t.type, hn(t.value));
}
function TS(t) {
  const e = new Uint8Array(4);
  return _r(e, Math.ceil(t.value.length / 2), 0), wn(t.type, gn(e, xt(t.value)));
}
function MS(t) {
  const e = sl(Qy(BigInt(t.value), BigInt(qm)), k0);
  return wn(t.type, e);
}
function _S(t) {
  const e = sl(BigInt(t.value), k0);
  return wn(t.type, e);
}
function US(t) {
  return wn(t.type, Bi(yr(t.value)));
}
function NS(t) {
  const [e, n] = WS(t.value);
  return wn(t.type, gn(Bi(yr(e)), Ps(Ye(n))));
}
function HS(t) {
  return wn(t.type, hn(t.value));
}
function PS(t) {
  const e = [], n = new Uint8Array(4);
  _r(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = hn(r);
    e.push(s);
  }
  return wn(t.type, Zt(e));
}
function OS(t) {
  const e = [], n = new Uint8Array(4);
  _r(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ye(s);
    e.push(Ps(i));
    const o = hn(t.value[s]);
    e.push(o);
  }
  return wn(t.type, Zt(e));
}
function V0(t, e) {
  const n = [], r = e == "ascii" ? nw(t.value) : Yr(t.value), s = new Uint8Array(4);
  return _r(s, r.length, 0), n.push(s), n.push(r), wn(t.type, Zt(n));
}
function DS(t) {
  return V0(t, "ascii");
}
function jS(t) {
  return V0(t, "utf8");
}
function Tf(t) {
  return et(hn(t));
}
function hn(t) {
  switch (t.type) {
    case yt.BoolTrue:
    case yt.BoolFalse:
      return CS(t);
    case yt.OptionalNone:
    case yt.OptionalSome:
      return BS(t);
    case yt.Buffer:
      return TS(t);
    case yt.UInt:
      return _S(t);
    case yt.Int:
      return MS(t);
    case yt.PrincipalStandard:
      return US(t);
    case yt.PrincipalContract:
      return NS(t);
    case yt.ResponseOk:
    case yt.ResponseErr:
      return HS(t);
    case yt.List:
      return PS(t);
    case yt.Tuple:
      return OS(t);
    case yt.StringASCII:
      return DS(t);
    case yt.StringUTF8:
      return jS(t);
    default:
      throw new ms("Unable to serialize. Invalid Clarity Value.");
  }
}
const FS = (t) => t.length % 2 ? `0${t}` : t, zS = (t, e) => t.padEnd(e, "0"), q0 = (t, e) => t ? Yr(t).length > e : !1;
function kc(t) {
  return $0(t);
}
const hi = (t) => Ex(Il(t)), Nl = (t) => et(Xx(t)), RS = (t) => et(hi(t)), GS = (t) => {
  const e = hi(t), n = gn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = hi(n);
  return et(r);
}, KS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Zt(n), s = hi(r);
  return et(s);
}, VS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Zt(n), s = Il(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Zt(i), a = hi(o);
  return et(a);
};
function qS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function WS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
qt.hmacSha256Sync = (t, ...e) => {
  const n = M0.create(Il, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function qs(t) {
  return t = typeof t == "string" ? xt(t) : t, {
    type: z.PublicKey,
    data: t
  };
}
function XS(t, e, n = zt.Compressed) {
  const r = aw(e), s = new Me(Bu(r.r), Bu(r.s)), i = dt.fromSignature(t, s, r.recoveryId), o = n === zt.Compressed;
  return i.toHex(o);
}
function YS(t) {
  return typeof t == "string" ? t : et(t);
}
const Hl = YS;
function W0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === ow;
}
function Ws(t) {
  return !Hl(t).startsWith("04");
}
function ZS(t) {
  t = il(t);
  const e = W0(t);
  return et(Ii(t.slice(0, 32), e));
}
function QS(t) {
  return dt.fromHex(Hl(t)).toHex(!0);
}
function JS(t) {
  return dt.fromHex(Hl(t)).toHex(!1);
}
function t3(t, e) {
  t = il(t);
  const [n, r] = Xo(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return $i(r, 1) + Me.fromHex(n).toCompactHex();
}
function Pl() {
  return {
    type: z.MessageSignature,
    data: et(new Uint8Array(oa))
  };
}
function X0(t, e, n, r) {
  const s = _l(0, t, 1, [qs(e)]).hash160, i = Ws(e) ? zt.Compressed : zt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: ce(n),
    fee: ce(r),
    keyEncoding: i,
    signature: Pl()
  };
}
function pi(t) {
  return "signature" in t;
}
function Mf(t) {
  return t === Ct.P2SH || t === Ct.P2WSH;
}
function e3(t) {
  return t === Ct.P2SHNonSequential || t === Ct.P2WSHNonSequential;
}
function _f(t) {
  const e = kc(t);
  return e.nonce = 0, e.fee = 0, pi(e) ? e.signature = Pl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function n3(t) {
  const e = [
    t.hashMode,
    xt(t.signer),
    pr(t.nonce, 8),
    pr(t.fee, 8),
    t.keyEncoding,
    Ml(t.signature)
  ];
  return Zt(e);
}
function r3(t) {
  const e = [
    t.hashMode,
    xt(t.signer),
    pr(t.nonce, 8),
    pr(t.fee, 8)
  ], n = Bl(t.fields);
  e.push(Tl(n));
  const r = new Uint8Array(2);
  return lw(r, t.signaturesRequired, 0), e.push(r), Zt(e);
}
function s3(t, e) {
  const n = et(e.readBytes(20)), r = BigInt(`0x${et(e.readBytes(8))}`), s = BigInt(`0x${et(e.readBytes(8))}`), i = e.readUInt8Enum(zt, (a) => {
    throw new he(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Ct.P2WPKH && i != zt.Compressed)
    throw new he("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = vc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function i3(t, e) {
  const n = et(e.readBytes(20)), r = BigInt("0x" + et(e.readBytes(8))), s = BigInt("0x" + et(e.readBytes(8))), i = z0(e, z.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case z.PublicKey:
        Ws(u.contents.data) || (o = !0);
        break;
      case z.MessageSignature:
        if (u.pubKeyEncoding === zt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new vr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Ct.P2WSH || t === Ct.P2WSHNonSequential))
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
  return pi(t) ? n3(t) : r3(t);
}
function Pa(t) {
  const e = t.readUInt8Enum(Ct, (n) => {
    throw new he(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Ct.P2PKH || e === Ct.P2WPKH ? s3(e, t) : i3(e, t);
}
function Y0(t, e, n, r) {
  const i = t + et(new Uint8Array([e])) + et(pr(n, 8)) + et(pr(r, 8));
  if (xt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Nl(xt(i));
}
function Z0(t, e, n) {
  const r = 33 + oa, s = Ws(e.data) ? zt.Compressed : zt.Uncompressed, i = t + FS(s.toString(16)) + n, o = xt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Nl(o);
}
function o3(t, e, n, r, s) {
  const i = Y0(t, e, n, r), o = t3(s, i), a = qs(ZS(s)), c = Z0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Q0(t, e, n, r, s, i) {
  const o = Y0(t, e, n, r), a = qs(XS(o, i, s)), c = Z0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function a3() {
  const t = X0(Ct.P2PKH, "", 0, 0);
  return t.signer = rS().hash160, t.keyEncoding = zt.Compressed, t.signature = Pl(), t;
}
function Uf(t, e, n) {
  return pi(t) ? c3(t, e, n) : l3(t, e, n);
}
function c3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Q0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = _l(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new vr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function l3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case z.PublicKey:
        Ws(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case z.MessageSignature:
        c.pubKeyEncoding === zt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = Q0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Mf(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new vr("Too many signatures");
        break;
    }
  if (Mf(t.hashMode) && o !== t.signaturesRequired || e3(t.hashMode) && o < t.signaturesRequired)
    throw new vr("Incorrect number of signatures");
  if (i && (t.hashMode === Ct.P2WSH || t.hashMode === Ct.P2WSHNonSequential))
    throw new vr("Uncompressed keys are not allowed in this hash mode");
  const a = _l(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new vr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function J0(t) {
  return {
    authType: Kt.Standard,
    spendingCondition: t
  };
}
function tp(t, e) {
  return {
    authType: Kt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || X0(Ct.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Nf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Kt.Standard:
        return J0(_f(t.spendingCondition));
      case Kt.Sponsored:
        return tp(_f(t.spendingCondition), a3());
      default:
        throw new Ho("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function u3(t, e) {
  switch (t.authType) {
    case Kt.Standard:
      return Uf(t.spendingCondition, e, Kt.Standard);
    case Kt.Sponsored:
      return Uf(t.spendingCondition, e, Kt.Standard);
    default:
      throw new Ho("Invalid origin auth type");
  }
}
function f3(t, e) {
  switch (t.authType) {
    case Kt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ce(e)
      };
      return { ...t, spendingCondition: n };
    case Kt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: ce(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function d3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: ce(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function h3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ce(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function p3(t, e) {
  const n = {
    ...e,
    nonce: ce(e.nonce),
    fee: ce(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function g3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Kt.Standard:
      e.push(Ha(t.spendingCondition));
      break;
    case Kt.Sponsored:
      e.push(Ha(t.spendingCondition)), e.push(Ha(t.sponsorSpendingCondition));
      break;
  }
  return Zt(e);
}
function y3(t) {
  const e = t.readUInt8Enum(Kt, (r) => {
    throw new he(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Kt.Standard:
      return n = Pa(t), J0(n);
    case Kt.Sponsored:
      n = Pa(t);
      const r = Pa(t);
      return tp(n, r);
  }
}
class w3 {
  constructor({ auth: e, payload: n, postConditions: r = Bl([]), postConditionMode: s = No.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Gm(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: ce(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = ke.Any;
  }
  signBegin() {
    const e = kc(this);
    return e.auth = Nf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = kc(this);
    return e.auth = Nf(e.auth), e.txid();
  }
  verifyOrigin() {
    return u3(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : qs(e), r = this.auth.spendingCondition;
    if (r && !pi(r)) {
      const s = Ws(n.data);
      r.fields.push(xs(s ? zt.Compressed : zt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = o3(n, r, e.fee, e.nonce, s);
    if (pi(e))
      e.signature = Ac(i);
    else {
      const a = W0(s);
      e.fields.push(xs(a ? zt.Compressed : zt.Uncompressed, Ac(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Nl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Kt.Sponsored)
      throw new Ho("Cannot sponsor sign a non-sponsored transaction");
    this.auth = p3(this.auth, e);
  }
  setFee(e) {
    this.auth = f3(this.auth, e);
  }
  setNonce(e) {
    this.auth = d3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Kt.Sponsored)
      throw new Ho("Cannot sponsor sign a non-sponsored transaction");
    this.auth = h3(this.auth, e);
  }
  serialize() {
    return et(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new ms('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new ms('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ms('"auth" is undefined');
    if (this.payload === void 0)
      throw new ms('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return _r(n, this.chainId, 0), e.push(n), e.push(g3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Tl(this.postConditions)), e.push(G0(this.payload)), Zt(e);
  }
}
function b3(t) {
  const e = $e(t, Mt) ? t : new Mt(t), n = e.readUInt8Enum(zr, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = y3(e), i = e.readUInt8Enum(ke, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(No, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = z0(e, z.PostCondition), c = wS(e), u = new w3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Hf = BigInt("18446744073709551615");
function Oa(t) {
  const e = ce(t);
  if (e < 0n || e > Hf)
    throw new RangeError(`Post-condition amount must be between 0 and ${Hf} (u64 max), received: ${e}`);
  return e;
}
var Cc;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Cc || (Cc = {}));
var Bc;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Bc || (Bc = {}));
function m3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Ht.STX,
        principal: t.address === "origin" ? { type: z.Principal, prefix: ge.Origin } : ei(t.address),
        conditionCode: to(t.condition),
        amount: Oa(t.amount)
      };
    case "ft-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Ht.Fungible,
        principal: t.address === "origin" ? { type: z.Principal, prefix: ge.Origin } : ei(t.address),
        conditionCode: to(t.condition),
        amount: Oa(t.amount),
        asset: Bf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Ht.NonFungible,
        principal: t.address === "origin" ? { type: z.Principal, prefix: ge.Origin } : ei(t.address),
        conditionCode: to(t.condition),
        asset: Bf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Ht.Staking,
        principal: t.address === "origin" ? { type: z.Principal, prefix: ge.Origin } : ei(t.address),
        conditionCode: to(t.condition),
        amount: Oa(t.amount)
      };
    case "pox-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Ht.PoX,
        principal: t.address === "origin" ? { type: z.Principal, prefix: ge.Origin } : ei(t.address),
        conditionCode: x3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function to(t) {
  return Cc[t];
}
function x3(t) {
  return Bc[t];
}
function ep(t) {
  const e = m3(t);
  return gS(e);
}
function S3(t, e, n) {
  return Dl(np(t), n);
}
function np(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = gi(r);
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
    return BigInt(`0x${$3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Ol(t, e = 8) {
  return (typeof t == "bigint" ? t : np(t)).toString(16).padStart(e * 2, "0");
}
function Dl(t, e = 16) {
  const n = Ol(t, e);
  return gi(n);
}
function E3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const A3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += A3[n];
  return e;
}
function gi(t) {
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
function jl(t) {
  return new TextEncoder().encode(t);
}
function v3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function I3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Pf(t) {
  if (t.some(I3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Fl(...t) {
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
  return Fl(...t.map((e) => typeof e == "number" ? Pf([e]) : e instanceof Array ? Pf(e) : e));
}
function la(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Tc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Tc || (Tc = {}));
Tc.Mainnet;
const L3 = 128, k3 = 128, rp = 16;
var Mc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Mc || (Mc = {}));
var Of;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Of || (Of = {}));
var Df;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Df || (Df = {}));
var Ke;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ke || (Ke = {}));
const Da = ["onChainOnly", "offChainOnly", "any"];
Da[0] + "", Ke.OnChainOnly, Da[1] + "", Ke.OffChainOnly, Da[2] + "", Ke.Any, Ke.OnChainOnly + "", Ke.OnChainOnly, Ke.OffChainOnly + "", Ke.OffChainOnly, Ke.Any + "", Ke.Any;
var _c;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(_c || (_c = {}));
_c.Mainnet;
var jf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(jf || (jf = {}));
var Sr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Sr || (Sr = {}));
var Ff;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ff || (Ff = {}));
var zf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(zf || (zf = {}));
var Rf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Rf || (Rf = {}));
var Gf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Gf || (Gf = {}));
var Kf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Kf || (Kf = {}));
var Vf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Vf || (Vf = {}));
var Uc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Uc || (Uc = {}));
var qf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qf || (qf = {}));
var Wf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Wf || (Wf = {}));
function Nc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function C3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function sp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function B3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Nc(t.outputLen), Nc(t.blockLen);
}
function T3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function M3(t, e) {
  sp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ja = {
  number: Nc,
  bool: C3,
  bytes: sp,
  hash: B3,
  exists: T3,
  output: M3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Fa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), cn = (t, e) => t << 32 - e | t >>> e, _3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function U3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ip(t) {
  if (typeof t == "string" && (t = U3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let N3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ns(t) {
  const e = (r) => t().update(ip(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function H3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let zl = class extends N3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Fa(this.buffer);
  }
  update(e) {
    ja.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ip(e);
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
    H3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const P3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), op = Uint8Array.from({ length: 16 }, (t, e) => e), O3 = op.map((t) => (9 * t + 5) % 16);
let Rl = [op], Gl = [O3];
for (let t = 0; t < 4; t++)
  for (let e of [Rl, Gl])
    e.push(e[t].map((n) => P3[n]));
const ap = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), D3 = Rl.map((t, e) => t.map((n) => ap[e][n])), j3 = Gl.map((t, e) => t.map((n) => ap[e][n])), F3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), z3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), eo = (t, e) => t << e | t >>> 32 - e;
function Xf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const no = new Uint32Array(16);
let R3 = class extends zl {
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
      no[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = F3[h], v = z3[h], _ = Rl[h], U = Gl[h], b = D3[h], L = j3[h];
      for (let A = 0; A < 16; A++) {
        const D = eo(r + Xf(h, i, a, u) + no[_[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = eo(a, 10) | 0, a = i, i = D;
      }
      for (let A = 0; A < 16; A++) {
        const D = eo(s + Xf(g, o, c, d) + no[U[A]] + v, L[A]) + y | 0;
        s = y, y = d, d = eo(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    no.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ns(() => new R3());
const G3 = (t, e, n) => t & e ^ ~t & n, K3 = (t, e, n) => t & e ^ t & n ^ e & n, V3 = new Uint32Array([
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
let cp = class extends zl {
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
      const y = cn(a, 6) ^ cn(a, 11) ^ cn(a, 25), h = d + y + G3(a, c, u) + V3[l] + Jn[l] | 0, w = (cn(r, 2) ^ cn(r, 13) ^ cn(r, 22)) + K3(r, s, i) | 0;
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
}, q3 = class extends cp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ns(() => new cp());
ns(() => new q3());
const ro = BigInt(2 ** 32 - 1), Hc = BigInt(32);
function lp(t, e = !1) {
  return e ? { h: Number(t & ro), l: Number(t >> Hc & ro) } : { h: Number(t >> Hc & ro) | 0, l: Number(t & ro) | 0 };
}
function W3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = lp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const X3 = (t, e) => BigInt(t >>> 0) << Hc | BigInt(e >>> 0), Y3 = (t, e, n) => t >>> n, Z3 = (t, e, n) => t << 32 - n | e >>> n, Q3 = (t, e, n) => t >>> n | e << 32 - n, J3 = (t, e, n) => t << 32 - n | e >>> n, t4 = (t, e, n) => t << 64 - n | e >>> n - 32, e4 = (t, e, n) => t >>> n - 32 | e << 64 - n, n4 = (t, e) => e, r4 = (t, e) => t, s4 = (t, e, n) => t << n | e >>> 32 - n, i4 = (t, e, n) => e << n | t >>> 32 - n, o4 = (t, e, n) => e << n - 32 | t >>> 64 - n, a4 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function c4(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const l4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), u4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, f4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), d4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, h4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), p4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, lt = {
  fromBig: lp,
  split: W3,
  toBig: X3,
  shrSH: Y3,
  shrSL: Z3,
  rotrSH: Q3,
  rotrSL: J3,
  rotrBH: t4,
  rotrBL: e4,
  rotr32H: n4,
  rotr32L: r4,
  rotlSH: s4,
  rotlSL: i4,
  rotlBH: o4,
  rotlBL: a4,
  add: c4,
  add3L: l4,
  add3H: u4,
  add4L: f4,
  add4H: d4,
  add5H: p4,
  add5L: h4
}, [g4, y4] = lt.split([
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
let ua = class extends zl {
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
      const L = tr[b - 15] | 0, A = er[b - 15] | 0, D = lt.rotrSH(L, A, 1) ^ lt.rotrSH(L, A, 8) ^ lt.shrSH(L, A, 7), K = lt.rotrSL(L, A, 1) ^ lt.rotrSL(L, A, 8) ^ lt.shrSL(L, A, 7), j = tr[b - 2] | 0, V = er[b - 2] | 0, m = lt.rotrSH(j, V, 19) ^ lt.rotrBH(j, V, 61) ^ lt.shrSH(j, V, 6), I = lt.rotrSL(j, V, 19) ^ lt.rotrBL(j, V, 61) ^ lt.shrSL(j, V, 6), P = lt.add4L(K, I, er[b - 7], er[b - 16]), G = lt.add4H(P, D, m, tr[b - 7], tr[b - 16]);
      tr[b] = G | 0, er[b] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: v, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = lt.rotrSH(l, y, 14) ^ lt.rotrSH(l, y, 18) ^ lt.rotrBH(l, y, 41), A = lt.rotrSL(l, y, 14) ^ lt.rotrSL(l, y, 18) ^ lt.rotrBL(l, y, 41), D = l & h ^ ~l & w, K = y & g ^ ~y & v, j = lt.add5L(U, A, K, y4[b], er[b]), V = lt.add5H(j, _, L, D, g4[b], tr[b]), m = j | 0, I = lt.rotrSH(r, s, 28) ^ lt.rotrBH(r, s, 34) ^ lt.rotrBH(r, s, 39), P = lt.rotrSL(r, s, 28) ^ lt.rotrBL(r, s, 34) ^ lt.rotrBL(r, s, 39), G = r & i ^ r & a ^ i & a, st = s & o ^ s & c ^ o & c;
      _ = w | 0, U = v | 0, w = h | 0, v = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = lt.add(u | 0, d | 0, V | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = lt.add3L(m, P, st);
      r = lt.add3H(W, V, I, G), s = W | 0;
    }
    ({ h: r, l: s } = lt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = lt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = lt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = lt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = lt.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: v } = lt.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: _, l: U } = lt.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, d, l, y, h, g, w, v, _, U);
  }
  roundClean() {
    tr.fill(0), er.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, w4 = class extends ua {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, b4 = class extends ua {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, m4 = class extends ua {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ns(() => new ua());
ns(() => new w4());
ns(() => new b4());
ns(() => new m4());
function x4(t, e, n) {
  const s = L3;
  if (H4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Mc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var ne;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ne || (ne = {}));
let S4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, up = class extends S4 {
  constructor(e) {
    super(e);
  }
};
function fa(t) {
  const e = [];
  return e.push(gi(Ol(t.version, 1))), e.push(gi(t.hash160)), Mn(e);
}
function E4(t) {
  const e = [];
  return e.push(t.prefix), e.push(fa(t.address)), t.prefix === Uc.Contract && e.push(yi(t.contractName)), Mn(e);
}
function yi(t) {
  const e = [], n = jl(t.content), r = n.byteLength;
  return e.push(gi(Ol(r, t.lengthPrefixBytes))), e.push(n), Mn(e);
}
function A4(t) {
  const e = [];
  return e.push(fa(t.address)), e.push(yi(t.contractName)), e.push(yi(t.assetName)), Mn(e);
}
function fp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(E4(t.principal)), (t.conditionType === Sr.Fungible || t.conditionType === Sr.NonFungible) && e.push(A4(t.assetInfo)), t.conditionType === Sr.NonFungible && e.push(Gr(t.assetName)), e.push(t.conditionCode), t.conditionType === Sr.STX || t.conditionType === Sr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new up("The post-condition amount may not be larger than 8 bytes");
    e.push(S3(t.amount, !1, 8));
  }
  return Mn(e);
}
function bn(t, e) {
  return Mn([t, e]);
}
function $4(t) {
  return new Uint8Array([t.type]);
}
function v4(t) {
  return t.type === ne.OptionalNone ? new Uint8Array([t.type]) : bn(t.type, Gr(t.value));
}
function I4(t) {
  const e = new Uint8Array(4);
  return la(e, t.buffer.length, 0), bn(t.type, Fl(e, t.buffer));
}
function L4(t) {
  const e = Dl(E3(t.value, BigInt(k3)), rp);
  return bn(t.type, e);
}
function k4(t) {
  const e = Dl(t.value, rp);
  return bn(t.type, e);
}
function C4(t) {
  return bn(t.type, fa(t.address));
}
function B4(t) {
  return bn(t.type, Fl(fa(t.address), yi(t.contractName)));
}
function T4(t) {
  return bn(t.type, Gr(t.value));
}
function M4(t) {
  const e = [], n = new Uint8Array(4);
  la(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Gr(r);
    e.push(s);
  }
  return bn(t.type, Mn(e));
}
function _4(t) {
  const e = [], n = new Uint8Array(4);
  la(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = x4(s);
    e.push(yi(i));
    const o = Gr(t.data[s]);
    e.push(o);
  }
  return bn(t.type, Mn(e));
}
function dp(t, e) {
  const n = [], r = e == "ascii" ? v3(t.data) : jl(t.data), s = new Uint8Array(4);
  return la(s, r.length, 0), n.push(s), n.push(r), bn(t.type, Mn(n));
}
function U4(t) {
  return dp(t, "ascii");
}
function N4(t) {
  return dp(t, "utf8");
}
function Gr(t) {
  switch (t.type) {
    case ne.BoolTrue:
    case ne.BoolFalse:
      return $4(t);
    case ne.OptionalNone:
    case ne.OptionalSome:
      return v4(t);
    case ne.Buffer:
      return I4(t);
    case ne.UInt:
      return k4(t);
    case ne.Int:
      return L4(t);
    case ne.PrincipalStandard:
      return C4(t);
    case ne.PrincipalContract:
      return B4(t);
    case ne.ResponseOk:
    case ne.ResponseErr:
      return T4(t);
    case ne.List:
      return M4(t);
    case ne.Tuple:
      return _4(t);
    case ne.StringASCII:
      return U4(t);
    case ne.StringUTF8:
      return N4(t);
    default:
      throw new up("Unable to serialize. Invalid Clarity Value.");
  }
}
const H4 = (t, e) => t ? jl(t).length > e : !1, P4 = "connect-ui";
let bo, hp, Ce = !1, Pc = !1;
const Tn = (t, e = "") => () => {
}, O4 = (t, e) => () => {
}, D4 = "{visibility:hidden}.hydrated{visibility:inherit}", Yf = {}, j4 = "http://www.w3.org/2000/svg", F4 = "http://www.w3.org/1999/xhtml", z4 = (t) => t != null, Kl = (t) => (t = typeof t, t === "object" || t === "function");
function pp(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const it = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Kl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Oc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Oc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Oc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, R4 = {}, G4 = (t) => t && t.$tag$ === R4, K4 = (t, e) => t != null && !Kl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, V4 = (t) => Xs(t).$hostElement$, q4 = (t, e, n) => {
  const r = ae.ce(e, n);
  return t.dispatchEvent(r), r;
}, Zf = /* @__PURE__ */ new WeakMap(), W4 = (t, e, n) => {
  let r = Po.get(t);
  pE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Po.set(t, r);
}, X4 = (t, e, n, r) => {
  var s;
  let i = gp(e);
  const o = Po.get(i);
  if (t = t.nodeType === 11 ? t : pn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Zf.get(t), c;
      if (a || Zf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = pn.createElement("style"), c.innerHTML = o;
          const u = (s = ae.$nonce$) !== null && s !== void 0 ? s : pp(pn);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, Y4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Tn("attachStyles", e.$tagName$), i = X4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, gp = (t, e) => "sc-" + t.$tagName$, Qf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = td(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Jf(n), d = Jf(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : td(da, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && ae.rel(t, e, n, !1), r && ae.ael(t, e, r, !1);
    else {
      const c = Kl(r);
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
}, Z4 = /\s/, Jf = (t) => t ? t.split(Z4) : [], yp = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Yf, o = e.$attrs$ || Yf;
  for (r in i)
    r in o || Qf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Qf(s, r, i[r], o[r], n, e.$flags$);
}, Vl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = pn.createTextNode(s.$text$);
  else {
    if (Ce || (Ce = s.$tag$ === "svg"), o = s.$elm$ = pn.createElementNS(Ce ? j4 : F4, s.$tag$), Ce && s.$tag$ === "foreignObject" && (Ce = !1), yp(null, s, Ce), z4(bo) && o["s-si"] !== bo && o.classList.add(o["s-si"] = bo), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Vl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Ce = !1 : o.tagName === "foreignObject" && (Ce = !0);
  }
  return o;
}, wp = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === hp && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Vl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, bp = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, Q4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : so(a, d) ? (ni(a, d), a = e[++s], d = r[++i]) : so(c, l) ? (ni(c, l), c = e[--o], l = r[--u]) : so(a, l) ? (ni(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : so(c, d) ? (ni(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (y = Vl(e && e[i], n, i), d = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? wp(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && bp(e, s, o);
}, so = (t, e) => t.$tag$ === e.$tag$, ni = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Ce = i === "svg" ? !0 : i === "foreignObject" ? !1 : Ce, yp(t, e, Ce), r !== null && s !== null ? Q4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), wp(n, null, e, s, 0, s.length - 1)) : r !== null && bp(r, 0, r.length - 1), Ce && i === "svg" && (Ce = !1)) : t.$text$ !== o && (n.data = o);
}, J4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Oc(null, null), s = G4(e) ? e : it(null, null, e);
  hp = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, bo = n["s-sc"], ni(r, s);
}, mp = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, ql = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return mp(t, t.$ancestorComponent$), yE(() => tE(t, e));
}, tE = (t, e) => {
  const n = Tn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), sE(s, () => eE(t, r, e));
}, eE = async (t, e, n) => {
  const r = t.$hostElement$, s = Tn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && Y4(t);
  const o = Tn("render", t.$cmpMeta$.$tagName$);
  nE(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => rE(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, nE = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, J4(t, e);
  } catch (r) {
    wi(r, t.$hostElement$);
  }
  return null;
}, rE = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Tn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Sp(n), r(), t.$onReadyResolve$(n), s || xp()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Xl(() => ql(t, !1)), t.$flags$ &= -517;
}, xp = (t) => {
  Sp(pn.documentElement), Xl(() => q4(da, "appload", { detail: { namespace: P4 } }));
}, sE = (t, e) => t && t.then ? t.then(e) : e(), Sp = (t) => t.classList.add("hydrated"), iE = (t, e) => Xs(t).$instanceValues$.get(e), oE = (t, e, n, r) => {
  const s = Xs(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = K4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && ql(s, !1));
}, Ep = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return iE(this, i);
        },
        set(a) {
          oE(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        ae.jmp(() => {
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
}, aE = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = hE(n), s.then) {
        const c = O4();
        s = await s, c();
      }
      s.isProxied || (Ep(
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
        wi(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = gp(n);
      if (!Po.has(c)) {
        const u = Tn("registerStyles", n.$tagName$);
        W4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => ql(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, cE = (t) => {
  if (!(ae.$flags$ & 1)) {
    const e = Xs(t), n = e.$cmpMeta$, r = Tn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            mp(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), aE(t, e, n);
    }
    r();
  }
}, lE = (t) => {
  ae.$flags$ & 1 || Xs(t);
}, uE = (t, e = {}) => {
  var n;
  const r = Tn(), s = [], i = e.exclude || [], o = da.customElements, a = pn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ pn.createElement("style"), d = [];
  let l, y = !0;
  Object.assign(ae, e), ae.$resourcesUrl$ = new URL(e.resourcesUrl || "./", pn.baseURI).href, t.map((h) => {
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
          super(U), U = this, dE(U, w), w.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? d.push(this) : ae.jmp(() => cE(this));
        }
        disconnectedCallback() {
          ae.jmp(() => lE(this));
        }
        componentOnReady() {
          return Xs(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = h[0], !i.includes(v) && !o.get(v) && (s.push(v), o.define(v, Ep(
        _,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + D4, u.setAttribute("data-styles", "");
    const h = (n = ae.$nonce$) !== null && n !== void 0 ? n : pp(pn);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, d.length ? d.map((h) => h.connectedCallback()) : ae.jmp(() => l = setTimeout(xp, 30)), r();
}, Wl = /* @__PURE__ */ new WeakMap(), Xs = (t) => Wl.get(t), fE = (t, e) => Wl.set(e.$lazyInstance$ = t, e), dE = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Wl.set(t, n);
}, td = (t, e) => e in t, wi = (t, e) => (0, console.error)(t, e), za = /* @__PURE__ */ new Map(), hE = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = za.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (za.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => p$).then(o, wi);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (za.set(s, o), o[r]), wi);
}, Po = /* @__PURE__ */ new Map(), da = typeof window < "u" ? window : {}, pn = da.document || { head: {} }, ae = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Ap = (t) => Promise.resolve(t), pE = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), ed = [], $p = [], gE = (t, e) => (n) => {
  t.push(n), Pc || (Pc = !0, ae.$flags$ & 4 ? Xl(Dc) : ae.raf(Dc));
}, nd = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      wi(n);
    }
  t.length = 0;
}, Dc = () => {
  nd(ed), nd($p), (Pc = ed.length > 0) && ae.raf(Dc);
}, Xl = (t) => Ap().then(t), yE = /* @__PURE__ */ gE($p), wE = () => Ap(), bE = (t, e) => typeof window > "u" ? Promise.resolve() : wE().then(() => uE([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var mE = Object.defineProperty, xE = Object.defineProperties, SE = Object.getOwnPropertyDescriptors, Oo = Object.getOwnPropertySymbols, vp = Object.prototype.hasOwnProperty, Ip = Object.prototype.propertyIsEnumerable, rd = (t, e, n) => e in t ? mE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Ue = (t, e) => {
  for (var n in e || (e = {})) vp.call(e, n) && rd(t, n, e[n]);
  if (Oo) for (var n of Oo(e)) Ip.call(e, n) && rd(t, n, e[n]);
  return t;
}, Ze = (t, e) => xE(t, SE(e)), Lp = (t, e) => {
  var n = {};
  for (var r in t) vp.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Oo) for (var r of Oo(t)) e.indexOf(r) < 0 && Ip.call(t, r) && (n[r] = t[r]);
  return n;
};
function kp() {
  return ia(Or()) || window.StacksProvider || window.BlockstackProvider;
}
function ha(t) {
  return t ? typeof t == "string" ? jr.fromName(t) : "version" in t ? t : "url" in t ? new hc({ url: t.url }) : t.transactionVersion === zr.Mainnet ? new hc({ url: t.client.baseUrl }) : new pc({ url: t.client.baseUrl }) : new pc();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var EE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(EE || {}), AE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(AE || {}), Yl = (t) => {
  let e = t;
  if (!e) {
    let n = new ah(["store_write"], document.location.href);
    e = new dc({ appConfig: n });
  }
  return e;
};
function Cp(t) {
  try {
    return Yl(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Bp = (t) => {
  let e = Yl(t).loadUserData().appPrivateKey, n = oe.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function $E(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Fr.Mainnet]: "mainnet", [Fr.Testnet]: "testnet" }, a = ha(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function vE(t) {
  let e = ha(t.network), n = Yl(t.userSession), r = Ze(Ue({}, t), { network: e, userSession: n });
  return Ue({ stxAddress: $E(r) }, r);
}
async function IE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(ep) : n = n.map((r) => et(fp(r)))), new oe.TokenSigner("ES256k", e).signAsync(Ze(Ue({}, t), { postConditions: n }));
}
function LE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(ep) : e = e.map((n) => et(fp(n)))), oe.createUnsecuredToken(Ze(Ue({}, t), { postConditions: e }));
}
var kE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = xt(a.replace(/^0x/, "")), u = b3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Ze(Ue({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Ze(Ue({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, CE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Lp(e, ["amount", "appDetails", "userSession"]);
  if (Cp(s)) {
    let { privateKey: a, publicKey: c } = Bp(s), u = Ze(Ue({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), IE(u, a);
  }
  let o = Ze(Ue({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), LE(o);
};
async function BE(t, e, n) {
  let r = await e(Ze(Ue(Ue({}, vE(t)), t), { network: ha(t.network) }));
  return kE({ token: r, options: t }, n);
}
function TE(t, e = kp()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return BE(t, CE, e);
}
function Tp(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Ze(Ue({}, t), { message: Tf(e), domain: Tf(n) }) : Ze(Ue({}, t), { message: et(Gr(e)), domain: et(Gr(n)) });
}
async function ME(t, e) {
  return new oe.TokenSigner("ES256k", e).signAsync(Tp(t));
}
async function _E(t) {
  let e = t, { userSession: n } = e, r = Lp(e, ["userSession"]);
  if (Cp(n)) {
    let { privateKey: s, publicKey: i } = Bp(n), o = Ze(Ue({}, r), { publicKey: i });
    return ME(o, s);
  }
  return oe.createUnsecuredToken(Tp(t));
}
var UE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(UE || {}), Mp = "asigna-stx", sd = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Mp && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(HE(t, e), "*");
}), NE = { authenticationRequest: async (t) => sd(t, "authenticationRequest"), transactionRequest: async (t) => sd(t, "transactionRequest") }, HE = (t, e) => ({ source: Mp, [e]: t }), PE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = NE);
};
PE();
var OE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function DE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Or(), o = kp();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    bE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : OE, c = Bm(a), u = document.createElement("connect-modal");
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
var io = DE(TE);
function gr(t, e, n) {
  return Zl(we(t, e), n);
}
function we(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ot(r);
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
      const r = zE(BigInt(`0x${pt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${pt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function id(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ti(t, e = 8) {
  return (typeof t == "bigint" ? t : we(t, !1)).toString(16).padStart(e * 2, "0");
}
function pa(t) {
  return parseInt(t, 16);
}
function Zl(t, e = 16) {
  const n = Ti(t, e);
  return Ot(n);
}
function jE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function FE(t, e) {
  return t & BigInt(1) << e;
}
function zE(t, e) {
  return FE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const RE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function pt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += RE[n];
  return e;
}
function Ot(t) {
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
function Ys(t) {
  return new TextEncoder().encode(t);
}
function Ql(t) {
  return new TextDecoder().decode(t);
}
function _p(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function GE(t) {
  return String.fromCharCode.apply(null, t);
}
function KE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function od(t) {
  if (t.some(KE))
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
function Qt(t) {
  return ga(...t.map((e) => typeof e == "number" ? od([e]) : e instanceof Array ? od(e) : e));
}
var ad;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ad || (ad = {}));
var cd;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(cd || (cd = {}));
var ld;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ld || (ld = {}));
const Up = 33, Ra = 32;
function VE(t) {
  if (t.length < Ra * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Ra * 2), r = t.slice(2 + Ra * 2);
  return {
    recoveryId: pa(e),
    r: n,
    s: r
  };
}
function qE(t) {
  const e = typeof t == "string" ? Ot(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function WE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function XE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function YE(t, e) {
  return t[e];
}
function ZE(t, e, n = 0) {
  return t[n] = e, t;
}
function QE(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Kr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var jc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(jc || (jc = {}));
const JE = jc.Mainnet, tA = 128, eA = 128, Np = 16, Br = 32, Fc = 80, ya = 65, nA = 32, rA = 64, Do = 34;
var Q;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Q || (Q = {}));
var ft;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ft || (ft = {}));
var zc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(zc || (zc = {}));
var Ee;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ee || (Ee = {}));
const mo = ["onChainOnly", "offChainOnly", "any"], ud = {
  [mo[0]]: Ee.OnChainOnly,
  [mo[1]]: Ee.OffChainOnly,
  [mo[2]]: Ee.Any,
  [Ee.OnChainOnly]: Ee.OnChainOnly,
  [Ee.OffChainOnly]: Ee.OffChainOnly,
  [Ee.Any]: Ee.Any
};
function sA(t) {
  if (t in ud)
    return ud[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${mo.join(", ")}`);
}
var jo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(jo || (jo = {}));
jo.Mainnet;
var Os;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Os || (Os = {}));
var Ae;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ae || (Ae = {}));
var Vt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Vt || (Vt = {}));
var Bt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Bt || (Bt = {}));
var Fo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Fo || (Fo = {}));
var Rt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Rt || (Rt = {}));
var bi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(bi || (bi = {}));
var Rc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Rc || (Rc = {}));
var mi;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(mi || (mi = {}));
var fd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(fd || (fd = {}));
var dd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(dd || (dd = {}));
function Gc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function iA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Hp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function oA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Gc(t.outputLen), Gc(t.blockLen);
}
function aA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function cA(t, e) {
  Hp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Lr = {
  number: Gc,
  bool: iA,
  bytes: Hp,
  hash: oA,
  exists: aA,
  output: cA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ga = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ln = (t, e) => t << 32 - e | t >>> e, lA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!lA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function uA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Jl(t) {
  if (typeof t == "string" && (t = uA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Pp {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function rs(t) {
  const e = (r) => t().update(Jl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function fA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class tu extends Pp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ga(this.buffer);
  }
  update(e) {
    Lr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Jl(e);
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
    fA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const dA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Op = Uint8Array.from({ length: 16 }, (t, e) => e), hA = Op.map((t) => (9 * t + 5) % 16);
let eu = [Op], nu = [hA];
for (let t = 0; t < 4; t++)
  for (let e of [eu, nu])
    e.push(e[t].map((n) => dA[n]));
const Dp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pA = eu.map((t, e) => t.map((n) => Dp[e][n])), gA = nu.map((t, e) => t.map((n) => Dp[e][n])), yA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), oo = (t, e) => t << e | t >>> 32 - e;
function hd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ao = new Uint32Array(16);
class bA extends tu {
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
      ao[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = yA[h], v = wA[h], _ = eu[h], U = nu[h], b = pA[h], L = gA[h];
      for (let A = 0; A < 16; A++) {
        const D = oo(r + hd(h, i, a, u) + ao[_[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = oo(a, 10) | 0, a = i, i = D;
      }
      for (let A = 0; A < 16; A++) {
        const D = oo(s + hd(g, o, c, d) + ao[U[A]] + v, L[A]) + y | 0;
        s = y, y = d, d = oo(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ao.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const mA = rs(() => new bA()), xA = (t, e, n) => t & e ^ ~t & n, SA = (t, e, n) => t & e ^ t & n ^ e & n, EA = new Uint32Array([
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
class jp extends tu {
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
      const y = ln(a, 6) ^ ln(a, 11) ^ ln(a, 25), h = d + y + xA(a, c, u) + EA[l] + rr[l] | 0, w = (ln(r, 2) ^ ln(r, 13) ^ ln(r, 22)) + SA(r, s, i) | 0;
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
class AA extends jp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const ru = rs(() => new jp());
rs(() => new AA());
const co = BigInt(2 ** 32 - 1), Kc = BigInt(32);
function Fp(t, e = !1) {
  return e ? { h: Number(t & co), l: Number(t >> Kc & co) } : { h: Number(t >> Kc & co) | 0, l: Number(t & co) | 0 };
}
function $A(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Fp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const vA = (t, e) => BigInt(t >>> 0) << Kc | BigInt(e >>> 0), IA = (t, e, n) => t >>> n, LA = (t, e, n) => t << 32 - n | e >>> n, kA = (t, e, n) => t >>> n | e << 32 - n, CA = (t, e, n) => t << 32 - n | e >>> n, BA = (t, e, n) => t << 64 - n | e >>> n - 32, TA = (t, e, n) => t >>> n - 32 | e << 64 - n, MA = (t, e) => e, _A = (t, e) => t, UA = (t, e, n) => t << n | e >>> 32 - n, NA = (t, e, n) => e << n | t >>> 32 - n, HA = (t, e, n) => e << n - 32 | t >>> 64 - n, PA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function OA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const DA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), jA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, FA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), zA = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, RA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), GA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ut = {
  fromBig: Fp,
  split: $A,
  toBig: vA,
  shrSH: IA,
  shrSL: LA,
  rotrSH: kA,
  rotrSL: CA,
  rotrBH: BA,
  rotrBL: TA,
  rotr32H: MA,
  rotr32L: _A,
  rotlSH: UA,
  rotlSL: NA,
  rotlBH: HA,
  rotlBL: PA,
  add: OA,
  add3L: DA,
  add3H: jA,
  add4L: FA,
  add4H: zA,
  add5H: GA,
  add5L: RA
}, [KA, VA] = ut.split([
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
class wa extends tu {
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
      const L = sr[b - 15] | 0, A = ir[b - 15] | 0, D = ut.rotrSH(L, A, 1) ^ ut.rotrSH(L, A, 8) ^ ut.shrSH(L, A, 7), K = ut.rotrSL(L, A, 1) ^ ut.rotrSL(L, A, 8) ^ ut.shrSL(L, A, 7), j = sr[b - 2] | 0, V = ir[b - 2] | 0, m = ut.rotrSH(j, V, 19) ^ ut.rotrBH(j, V, 61) ^ ut.shrSH(j, V, 6), I = ut.rotrSL(j, V, 19) ^ ut.rotrBL(j, V, 61) ^ ut.shrSL(j, V, 6), P = ut.add4L(K, I, ir[b - 7], ir[b - 16]), G = ut.add4H(P, D, m, sr[b - 7], sr[b - 16]);
      sr[b] = G | 0, ir[b] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: v, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = ut.rotrSH(l, y, 14) ^ ut.rotrSH(l, y, 18) ^ ut.rotrBH(l, y, 41), A = ut.rotrSL(l, y, 14) ^ ut.rotrSL(l, y, 18) ^ ut.rotrBL(l, y, 41), D = l & h ^ ~l & w, K = y & g ^ ~y & v, j = ut.add5L(U, A, K, VA[b], ir[b]), V = ut.add5H(j, _, L, D, KA[b], sr[b]), m = j | 0, I = ut.rotrSH(r, s, 28) ^ ut.rotrBH(r, s, 34) ^ ut.rotrBH(r, s, 39), P = ut.rotrSL(r, s, 28) ^ ut.rotrBL(r, s, 34) ^ ut.rotrBL(r, s, 39), G = r & i ^ r & a ^ i & a, st = s & o ^ s & c ^ o & c;
      _ = w | 0, U = v | 0, w = h | 0, v = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = ut.add(u | 0, d | 0, V | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = ut.add3L(m, P, st);
      r = ut.add3H(W, V, I, G), s = W | 0;
    }
    ({ h: r, l: s } = ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ut.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ut.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = ut.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = ut.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = ut.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: v } = ut.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: _, l: U } = ut.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, d, l, y, h, g, w, v, _, U);
  }
  roundClean() {
    sr.fill(0), ir.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class qA extends wa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class WA extends wa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class XA extends wa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
rs(() => new wa());
rs(() => new qA());
const YA = rs(() => new WA());
rs(() => new XA());
function zp(t) {
  if (Ot(t).byteLength != ya)
    throw Error("Invalid signature");
  return {
    type: Q.MessageSignature,
    data: t
  };
}
function ri(t, e) {
  return { type: Q.Address, version: t, hash160: e };
}
function Ss(t) {
  return ts.c32address(t.version, t.hash160);
}
function Vr(t, e, n) {
  const r = e || 1, s = n || tA;
  if (ig(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Q.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function su(t) {
  const e = ts.c32addressDecode(t);
  return {
    type: Q.Address,
    version: e[0],
    hash160: e[1]
  };
}
var H;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(H || (H = {}));
function ZA(t) {
  if (t.type === H.PrincipalStandard)
    return Ss(t.address);
  if (t.type === H.PrincipalContract)
    return `${Ss(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Rp(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return t8(e, n);
  } else
    return QA(t);
}
function QA(t) {
  const e = su(t);
  return { type: H.PrincipalStandard, address: e };
}
function JA(t) {
  return { type: H.PrincipalStandard, address: t };
}
function t8(t, e) {
  const n = su(t), r = Vr(e);
  return Gp(n, r);
}
function Gp(t, e) {
  if (Ys(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: H.PrincipalContract, address: t, contractName: e };
}
function Ka(t, e = !1) {
  switch (t.type) {
    case H.BoolTrue:
      return !0;
    case H.BoolFalse:
      return !1;
    case H.Int:
    case H.UInt:
      return e ? t.value.toString() : t.value;
    case H.Buffer:
      return `0x${pt(t.buffer)}`;
    case H.OptionalNone:
      return null;
    case H.OptionalSome:
      return Ln(t.value);
    case H.ResponseErr:
      return Ln(t.value);
    case H.ResponseOk:
      return Ln(t.value);
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return ZA(t);
    case H.List:
      return t.list.map((r) => Ln(r));
    case H.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Ln(t.data[r]);
      }), n;
    case H.StringASCII:
      return t.data;
    case H.StringUTF8:
      return t.data;
  }
}
function Ln(t) {
  switch (t.type) {
    case H.ResponseErr:
      return { type: cr(t), value: Ka(t, !0), success: !1 };
    case H.ResponseOk:
      return { type: cr(t), value: Ka(t, !0), success: !0 };
    default:
      return { type: cr(t), value: Ka(t, !0) };
  }
}
function cr(t) {
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
      return `(optional ${cr(t.value)})`;
    case H.ResponseErr:
      return `(response UnknownType ${cr(t.value)})`;
    case H.ResponseOk:
      return `(response ${cr(t.value)} UnknownType)`;
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return "principal";
    case H.List:
      return `(list ${t.list.length} ${t.list.length ? cr(t.list[0]) : "UnknownType"})`;
    case H.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${cr(t.data[e])})`).join(" ")})`;
    case H.StringASCII:
      return `(string-ascii ${_p(t.data).length})`;
    case H.StringUTF8:
      return `(string-utf8 ${Ys(t.data).length})`;
  }
}
const Kp = () => ({ type: H.BoolTrue }), Vp = () => ({ type: H.BoolFalse }), e8 = (t) => t ? Kp() : Vp(), pd = BigInt("0xffffffffffffffffffffffffffffffff"), n8 = BigInt(0), gd = BigInt("0x7fffffffffffffffffffffffffffffff"), yd = BigInt("-170141183460469231731687303715884105728"), r8 = (t) => {
  const e = we(t, !0);
  if (e > gd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${gd}`);
  if (e < yd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${yd}`);
  return { type: H.Int, value: e };
}, ur = (t) => {
  const e = we(t, !1);
  if (e < n8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > pd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${pd}`);
  return { type: H.UInt, value: e };
}, qp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: H.Buffer, buffer: t };
};
function Wp() {
  return { type: H.OptionalNone };
}
function Xp(t) {
  return { type: H.OptionalSome, value: t };
}
function s8(t) {
  return { type: H.ResponseErr, value: t };
}
function i8(t) {
  return { type: H.ResponseOk, value: t };
}
function o8(t) {
  return { type: H.List, list: t };
}
function xi(t) {
  for (const e in t)
    if (!X8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: H.Tuple, data: t };
}
const qe = (t) => ({ type: H.StringASCII, data: t }), a8 = (t) => ({ type: H.StringUTF8, data: t });
class Yp extends Pp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Lr.hash(e);
    const r = Jl(n);
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
const Zp = (t, e, n) => new Yp(t, e).update(n).digest();
Zp.create = (t, e) => new Yp(t, e);
qt.hmacSha256Sync = (t, ...e) => {
  const n = Zp.create(ru, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ds(t) {
  return {
    type: Q.PublicKey,
    data: Ot(t)
  };
}
function c8(t, e, n = Rt.Compressed) {
  const r = VE(e.data), s = new Me(id(r.r), id(r.s)), i = dt.fromSignature(t, s, r.recoveryId), o = n === Rt.Compressed;
  return i.toHex(o);
}
function l8(t) {
  return { type: Q.PublicKey, data: t };
}
function Zs(t) {
  return !pt(t.data).startsWith("04");
}
function zo(t) {
  return t.data.slice();
}
function u8(t) {
  const e = h8(t), n = Ii(e.data.slice(0, 32), e.compressed);
  return Ds(pt(n));
}
function f8(t) {
  const e = typeof t == "string" ? t : pt(t), n = dt.fromHex(e).toHex(!0);
  return Ds(n);
}
function d8(t) {
  const e = typeof t == "string" ? t : pt(t), n = dt.fromHex(e).toHex(!1);
  return Ds(n);
}
function Vc(t) {
  const e = t.readUInt8(), n = e === 4 ? rA : nA;
  return l8(Qt([e, t.readBytes(n)]));
}
function h8(t) {
  const e = qE(t), n = e.length == Up;
  return { data: e, compressed: n };
}
function p8(t, e) {
  const [n, r] = Xo(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Ti(r, 1) + Me.fromHex(n).toCompactHex();
  return zp(i);
}
function g8(t) {
  return u8(t.data);
}
function y8(t, e, n) {
  return typeof t == "string" && (t = Rp(t)), typeof n == "string" && (n = md(n)), {
    type: Q.Payload,
    payloadType: ft.TokenTransfer,
    recipient: t,
    amount: we(e, !1),
    memo: n ?? md("")
  };
}
function w8(t, e, n, r) {
  return typeof t == "string" && (t = su(t)), typeof e == "string" && (e = Vr(e)), typeof n == "string" && (n = Vr(n)), {
    type: Q.Payload,
    payloadType: ft.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function wd(t, e, n) {
  return typeof t == "string" && (t = Vr(t)), typeof e == "string" && (e = I8(e)), typeof n == "number" ? {
    type: Q.Payload,
    payloadType: ft.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: Q.Payload,
    payloadType: ft.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function b8() {
  return { type: Q.Payload, payloadType: ft.PoisonMicroblock };
}
function bd(t, e) {
  if (t.byteLength != Br)
    throw Error(`Coinbase buffer size must be ${Br} bytes`);
  return e != null ? {
    type: Q.Payload,
    payloadType: ft.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: Q.Payload,
    payloadType: ft.Coinbase,
    coinbaseBytes: t
  };
}
function m8(t, e, n) {
  if (t.byteLength != Br)
    throw Error(`Coinbase buffer size must be ${Br} bytes`);
  if (n.byteLength != Fc)
    throw Error(`VRF proof buffer size must be ${Fc} bytes`);
  return {
    type: Q.Payload,
    payloadType: ft.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === H.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var qc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(qc || (qc = {}));
function x8(t, e, n, r, s, i, o) {
  return {
    type: Q.Payload,
    payloadType: ft.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Qp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case ft.TokenTransfer:
      e.push(Yt(t.recipient)), e.push(gr(t.amount, !1, 8)), e.push($n(t.memo));
      break;
    case ft.ContractCall:
      e.push($n(t.contractAddress)), e.push($n(t.contractName)), e.push($n(t.functionName));
      const n = new Uint8Array(4);
      Kr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Yt(r));
      });
      break;
    case ft.SmartContract:
      e.push($n(t.contractName)), e.push($n(t.codeBody));
      break;
    case ft.VersionedSmartContract:
      e.push(t.clarityVersion), e.push($n(t.contractName)), e.push($n(t.codeBody));
      break;
    case ft.PoisonMicroblock:
      break;
    case ft.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case ft.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Yt(t.recipient));
      break;
    case ft.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Yt(t.recipient ? Xp(t.recipient) : Wp())), e.push(t.vrfProof);
      break;
    case ft.TenureChange:
      e.push(Ot(t.tenureHash)), e.push(Ot(t.previousTenureHash)), e.push(Ot(t.burnViewHash)), e.push(Ot(t.previousTenureEnd)), e.push(Kr(new Uint8Array(4), t.previousTenureBlocks)), e.push(ZE(new Uint8Array(1), t.cause)), e.push(Ot(t.publicKeyHash));
      break;
  }
  return Qt(e);
}
function S8(t) {
  switch (t.readUInt8Enum(ft, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case ft.TokenTransfer:
      const n = ze(t), r = we(t.readBytes(8), !1), s = tg(t);
      return y8(n, r, s);
    case ft.ContractCall:
      const i = js(t), o = Fe(t), a = Fe(t), c = [], u = t.readUInt32BE();
      for (let b = 0; b < u; b++) {
        const L = ze(t);
        c.push(L);
      }
      return w8(i, o, a, c);
    case ft.SmartContract:
      const d = Fe(t), l = Fe(t, 4, 1e5);
      return wd(d, l);
    case ft.VersionedSmartContract: {
      const b = t.readUInt8Enum(zc, (D) => {
        throw new Error(`Cannot recognize ClarityVersion: ${D}`);
      }), L = Fe(t), A = Fe(t, 4, 1e5);
      return wd(L, A, b);
    }
    case ft.PoisonMicroblock:
      return b8();
    case ft.Coinbase: {
      const b = t.readBytes(Br);
      return bd(b);
    }
    case ft.CoinbaseToAltRecipient: {
      const b = t.readBytes(Br), L = ze(t);
      return bd(b, L);
    }
    case ft.NakamotoCoinbase: {
      const b = t.readBytes(Br), L = ze(t), A = t.readBytes(Fc);
      return m8(b, L, A);
    }
    case ft.TenureChange:
      const y = pt(t.readBytes(20)), h = pt(t.readBytes(20)), g = pt(t.readBytes(20)), w = pt(t.readBytes(32)), v = t.readUInt32BE(), _ = t.readUInt8Enum(qc, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), U = pt(t.readBytes(20));
      return x8(y, h, g, w, v, _, U);
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
class Te extends ba {
  constructor(e) {
    super(e);
  }
}
class Ro extends ba {
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
function Wc(t) {
  return zp(pt(t.readBytes(ya)));
}
function Es(t, e) {
  return {
    pubKeyEncoding: t,
    type: Q.TransactionAuthField,
    contents: e
  };
}
function E8(t) {
  const e = t.readUInt8Enum(We, (n) => {
    throw new Te(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case We.PublicKeyCompressed:
      return Es(Rt.Compressed, Vc(t));
    case We.PublicKeyUncompressed:
      return Es(Rt.Uncompressed, d8(Vc(t).data));
    case We.SignatureCompressed:
      return Es(Rt.Compressed, Wc(t));
    case We.SignatureUncompressed:
      return Es(Rt.Uncompressed, Wc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function iu(t) {
  return Ot(t.data);
}
function A8(t) {
  const e = [];
  switch (t.contents.type) {
    case Q.PublicKey:
      e.push(t.pubKeyEncoding === Rt.Compressed ? We.PublicKeyCompressed : We.PublicKeyUncompressed), e.push(zo(f8(t.contents.data)));
      break;
    case Q.MessageSignature:
      e.push(t.pubKeyEncoding === Rt.Compressed ? We.SignatureCompressed : We.SignatureUncompressed), e.push(iu(t.contents));
      break;
  }
  return Qt(e);
}
function $n(t) {
  switch (t.type) {
    case Q.Address:
      return Mi(t);
    case Q.Principal:
      return Jp(t);
    case Q.LengthPrefixedString:
      return Fs(t);
    case Q.MemoString:
      return L8(t);
    case Q.AssetInfo:
      return eg(t);
    case Q.PostCondition:
      return k8(t);
    case Q.PublicKey:
      return zo(t);
    case Q.LengthPrefixedList:
      return cu(t);
    case Q.Payload:
      return Qp(t);
    case Q.TransactionAuthField:
      return A8(t);
    case Q.MessageSignature:
      return iu(t);
  }
}
function $8() {
  return {
    type: Q.Address,
    version: Fo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function ou(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Bt.SerializeP2PKH || e === Bt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Bt.SerializeP2WPKH || e === Bt.SerializeP2WSH || e === Bt.SerializeP2WSHNonSequential) && !r.every(Zs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Bt.SerializeP2PKH:
      return ri(t, K8(r[0].data));
    case Bt.SerializeP2WPKH:
      return ri(t, V8(r[0].data));
    case Bt.SerializeP2SH:
    case Bt.SerializeP2SHNonSequential:
      return ri(t, q8(n, r.map(zo)));
    case Bt.SerializeP2WSH:
    case Bt.SerializeP2WSHNonSequential:
      return ri(t, W8(n, r.map(zo)));
  }
}
function Mi(t) {
  const e = [];
  return e.push(Ot(Ti(t.version, 1))), e.push(Ot(t.hash160)), Qt(e);
}
function js(t) {
  const e = pa(pt(t.readBytes(1))), n = pt(t.readBytes(20));
  return { type: Q.Address, version: e, hash160: n };
}
function Jp(t) {
  const e = [];
  return e.push(t.prefix), e.push(Mi(t.address)), t.prefix === mi.Contract && e.push(Fs(t.contractName)), Qt(e);
}
function v8(t) {
  const e = t.readUInt8Enum(mi, (s) => {
    throw new Te(`Unexpected Principal payload type: ${s}`);
  }), n = js(t);
  if (e === mi.Standard)
    return { type: Q.Principal, prefix: e, address: n };
  const r = Fe(t);
  return {
    type: Q.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Fs(t) {
  const e = [], n = Ys(t.content), r = n.byteLength;
  return e.push(Ot(Ti(r, t.lengthPrefixBytes))), e.push(n), Qt(e);
}
function Fe(t, e, n) {
  e = e || 1;
  const r = pa(pt(t.readBytes(e))), s = Ql(t.readBytes(r));
  return Vr(s, e, n ?? 128);
}
function I8(t) {
  return Vr(t, 4, 1e5);
}
function md(t) {
  if (t && ig(t, Do))
    throw new Error(`Memo exceeds maximum length of ${Do} bytes`);
  return { type: Q.MemoString, content: t };
}
function L8(t) {
  const e = [], n = Ys(t.content), r = G8(pt(n), Do * 2);
  return e.push(Ot(r)), Qt(e);
}
function tg(t) {
  let e = Ql(t.readBytes(Do));
  return e = e.replace(/\u0000*$/, ""), { type: Q.MemoString, content: e };
}
function eg(t) {
  const e = [];
  return e.push(Mi(t.address)), e.push(Fs(t.contractName)), e.push(Fs(t.assetName)), Qt(e);
}
function Xc(t) {
  return {
    type: Q.AssetInfo,
    address: js(t),
    contractName: Fe(t),
    assetName: Fe(t)
  };
}
function au(t, e) {
  return {
    type: Q.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function cu(t) {
  const e = t.values, n = [];
  n.push(Ot(Ti(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push($n(r));
  return Qt(n);
}
function ng(t, e, n) {
  const r = pa(pt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case Q.Address:
        s.push(js(t));
        break;
      case Q.LengthPrefixedString:
        s.push(Fe(t));
        break;
      case Q.MemoString:
        s.push(tg(t));
        break;
      case Q.AssetInfo:
        s.push(Xc(t));
        break;
      case Q.PostCondition:
        s.push(C8(t));
        break;
      case Q.PublicKey:
        s.push(Vc(t));
        break;
      case Q.TransactionAuthField:
        s.push(E8(t));
        break;
    }
  return au(s, n);
}
function k8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Jp(t.principal)), (t.conditionType === Ae.Fungible || t.conditionType === Ae.NonFungible) && e.push(eg(t.assetInfo)), t.conditionType === Ae.NonFungible && e.push(Yt(t.assetName)), e.push(t.conditionCode), t.conditionType === Ae.STX || t.conditionType === Ae.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Er("The post-condition amount may not be larger than 8 bytes");
    e.push(gr(t.amount, !1, 8));
  }
  return Qt(e);
}
function C8(t) {
  const e = t.readUInt8Enum(Ae, (o) => {
    throw new Te(`Could not read ${o} as PostConditionType`);
  }), n = v8(t);
  let r, s, i;
  switch (e) {
    case Ae.STX:
      return r = t.readUInt8Enum(bi, (a) => {
        throw new Te(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${pt(t.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: Ae.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Ae.Fungible:
      return s = Xc(t), r = t.readUInt8Enum(bi, (a) => {
        throw new Te(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${pt(t.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: Ae.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Ae.NonFungible:
      s = Xc(t);
      const o = ze(t);
      return r = t.readUInt8Enum(Rc, (a) => {
        throw new Te(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Q.PostCondition,
        conditionType: Ae.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function mn(t, e) {
  return Qt([t, e]);
}
function B8(t) {
  return new Uint8Array([t.type]);
}
function T8(t) {
  return t.type === H.OptionalNone ? new Uint8Array([t.type]) : mn(t.type, Yt(t.value));
}
function M8(t) {
  const e = new Uint8Array(4);
  return Kr(e, t.buffer.length, 0), mn(t.type, ga(e, t.buffer));
}
function _8(t) {
  const e = Zl(jE(t.value, BigInt(eA)), Np);
  return mn(t.type, e);
}
function U8(t) {
  const e = Zl(t.value, Np);
  return mn(t.type, e);
}
function N8(t) {
  return mn(t.type, Mi(t.address));
}
function H8(t) {
  return mn(t.type, ga(Mi(t.address), Fs(t.contractName)));
}
function P8(t) {
  return mn(t.type, Yt(t.value));
}
function O8(t) {
  const e = [], n = new Uint8Array(4);
  Kr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Yt(r);
    e.push(s);
  }
  return mn(t.type, Qt(e));
}
function D8(t) {
  const e = [], n = new Uint8Array(4);
  Kr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Vr(s);
    e.push(Fs(i));
    const o = Yt(t.data[s]);
    e.push(o);
  }
  return mn(t.type, Qt(e));
}
function rg(t, e) {
  const n = [], r = e == "ascii" ? _p(t.data) : Ys(t.data), s = new Uint8Array(4);
  return Kr(s, r.length, 0), n.push(s), n.push(r), mn(t.type, Qt(n));
}
function j8(t) {
  return rg(t, "ascii");
}
function F8(t) {
  return rg(t, "utf8");
}
function Yt(t) {
  switch (t.type) {
    case H.BoolTrue:
    case H.BoolFalse:
      return B8(t);
    case H.OptionalNone:
    case H.OptionalSome:
      return T8(t);
    case H.Buffer:
      return M8(t);
    case H.UInt:
      return U8(t);
    case H.Int:
      return _8(t);
    case H.PrincipalStandard:
      return N8(t);
    case H.PrincipalContract:
      return H8(t);
    case H.ResponseOk:
    case H.ResponseErr:
      return P8(t);
    case H.List:
      return O8(t);
    case H.Tuple:
      return D8(t);
    case H.StringASCII:
      return j8(t);
    case H.StringUTF8:
      return F8(t);
    default:
      throw new Er("Unable to serialize. Invalid Clarity Value.");
  }
}
function z8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const xd = /* @__PURE__ */ new Map();
function sg(t, e) {
  const n = xd.get(t);
  if (n !== void 0)
    return n(e);
  const r = z8(t);
  return xd.set(t, r), sg(t, e);
}
class ci {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return QE(this.readBytes(4), 0);
  }
  readUInt8() {
    return YE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return WE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = pt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = pt(n);
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
    if (sg(e, r))
      return r;
    throw n(r);
  }
}
function ze(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ci(Ot(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ci(t) : e = t;
  switch (e.readUInt8Enum(H, (r) => {
    throw new Te(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case H.Int:
      return r8(e.readBytes(16));
    case H.UInt:
      return ur(e.readBytes(16));
    case H.Buffer:
      const r = e.readUInt32BE();
      return qp(e.readBytes(r));
    case H.BoolTrue:
      return Kp();
    case H.BoolFalse:
      return Vp();
    case H.PrincipalStandard:
      const s = js(e);
      return JA(s);
    case H.PrincipalContract:
      const i = js(e), o = Fe(e);
      return Gp(i, o);
    case H.ResponseOk:
      return i8(ze(e));
    case H.ResponseErr:
      return s8(ze(e));
    case H.OptionalNone:
      return Wp();
    case H.OptionalSome:
      return Xp(ze(e));
    case H.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(ze(e));
      return o8(c);
    case H.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let w = 0; w < u; w++) {
        const v = Fe(e).content;
        if (v === void 0)
          throw new Te('"content" is undefined');
        d[v] = ze(e);
      }
      return xi(d);
    case H.StringASCII:
      const l = e.readUInt32BE(), y = GE(e.readBytes(l));
      return qe(y);
    case H.StringUTF8:
      const h = e.readUInt32BE(), g = Ql(e.readBytes(h));
      return a8(g);
    default:
      throw new Te("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const R8 = (t) => t.length % 2 == 0 ? t : `0${t}`, G8 = (t, e) => t.padEnd(e, "0"), ig = (t, e) => t ? Ys(t).length > e : !1;
function Yc(t) {
  return $0(t);
}
const Si = (t) => mA(ru(t)), lu = (t) => pt(YA(t)), K8 = (t) => pt(Si(t)), V8 = (t) => {
  const e = Si(t), n = ga(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Si(n);
  return pt(r);
}, q8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Qt(n), s = Si(r);
  return pt(s);
}, W8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Qt(n), s = ru(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Qt(i), a = Si(o);
  return pt(a);
};
function X8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function og(t) {
  const e = Yt(t);
  return `0x${pt(e)}`;
}
function Y8(t) {
  return ze(t);
}
const $s = (t) => {
  try {
    return ts.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function uu() {
  return {
    type: Q.MessageSignature,
    data: pt(new Uint8Array(ya))
  };
}
function ag(t, e, n, r) {
  const s = ou(0, t, 1, [Ds(e)]).hash160, i = Zs(Ds(e)) ? Rt.Compressed : Rt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: we(n, !1),
    fee: we(r, !1),
    keyEncoding: i,
    signature: uu()
  };
}
function Ei(t) {
  return "signature" in t;
}
function Sd(t) {
  return t === Bt.SerializeP2SH || t === Bt.SerializeP2WSH;
}
function Z8(t) {
  return t === Bt.SerializeP2SHNonSequential || t === Bt.SerializeP2WSHNonSequential;
}
function Ed(t) {
  const e = Yc(t);
  return e.nonce = 0, e.fee = 0, Ei(e) ? e.signature = uu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Q8(t) {
  const e = [
    t.hashMode,
    Ot(t.signer),
    gr(t.nonce, !1, 8),
    gr(t.fee, !1, 8),
    t.keyEncoding,
    iu(t.signature)
  ];
  return Qt(e);
}
function J8(t) {
  const e = [
    t.hashMode,
    Ot(t.signer),
    gr(t.nonce, !1, 8),
    gr(t.fee, !1, 8)
  ], n = au(t.fields);
  e.push(cu(n));
  const r = new Uint8Array(2);
  return XE(r, t.signaturesRequired, 0), e.push(r), Qt(e);
}
function t6(t, e) {
  const n = pt(e.readBytes(20)), r = BigInt(`0x${pt(e.readBytes(8))}`), s = BigInt(`0x${pt(e.readBytes(8))}`), i = e.readUInt8Enum(Rt, (a) => {
    throw new Te(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Bt.SerializeP2WPKH && i != Rt.Compressed)
    throw new Te("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Wc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function e6(t, e) {
  const n = pt(e.readBytes(20)), r = BigInt("0x" + pt(e.readBytes(8))), s = BigInt("0x" + pt(e.readBytes(8))), i = ng(e, Q.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case Q.PublicKey:
        Zs(u.contents) || (o = !0);
        break;
      case Q.MessageSignature:
        if (u.pubKeyEncoding === Rt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new kr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Bt.SerializeP2WSH || t === Bt.SerializeP2WSHNonSequential))
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
  return Ei(t) ? Q8(t) : J8(t);
}
function qa(t) {
  const e = t.readUInt8Enum(Bt, (n) => {
    throw new Te(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Bt.SerializeP2PKH || e === Bt.SerializeP2WPKH ? t6(e, t) : e6(e, t);
}
function cg(t, e, n, r) {
  const i = t + pt(new Uint8Array([e])) + pt(gr(n, !1, 8)) + pt(gr(r, !1, 8));
  if (Ot(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return lu(Ot(i));
}
function lg(t, e, n) {
  const r = 33 + ya, s = Zs(e) ? Rt.Compressed : Rt.Uncompressed, i = t + R8(s.toString(16)) + n.data, o = Ot(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return lu(o);
}
function n6(t, e, n, r, s) {
  const i = cg(t, e, n, r), o = p8(s, i), a = g8(s), c = lg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function ug(t, e, n, r, s, i) {
  const o = cg(t, e, n, r), a = Ds(c8(o, i, s)), c = lg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function r6() {
  const t = ag(Bt.SerializeP2PKH, "", 0, 0);
  return t.signer = $8().hash160, t.keyEncoding = Rt.Compressed, t.signature = uu(), t;
}
function Ad(t, e, n) {
  return Ei(t) ? s6(t, e, n) : i6(t, e, n);
}
function s6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = ug(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = ou(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new kr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function i6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case Q.PublicKey:
        Zs(c.contents) || (i = !0), r.push(c.contents);
        break;
      case Q.MessageSignature:
        c.pubKeyEncoding === Rt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = ug(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Sd(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new kr("Too many signatures");
        break;
    }
  if (Sd(t.hashMode) && o !== t.signaturesRequired || Z8(t.hashMode) && o < t.signaturesRequired)
    throw new kr("Incorrect number of signatures");
  if (i && (t.hashMode === Bt.SerializeP2WSH || t.hashMode === Bt.SerializeP2WSHNonSequential))
    throw new kr("Uncompressed keys are not allowed in this hash mode");
  const a = ou(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new kr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function fg(t) {
  return {
    authType: Vt.Standard,
    spendingCondition: t
  };
}
function dg(t, e) {
  return {
    authType: Vt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ag(Bt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function $d(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Vt.Standard:
        return fg(Ed(t.spendingCondition));
      case Vt.Sponsored:
        return dg(Ed(t.spendingCondition), r6());
      default:
        throw new Ro("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function o6(t, e) {
  switch (t.authType) {
    case Vt.Standard:
      return Ad(t.spendingCondition, e, Vt.Standard);
    case Vt.Sponsored:
      return Ad(t.spendingCondition, e, Vt.Standard);
    default:
      throw new Ro("Invalid origin auth type");
  }
}
function a6(t, e) {
  switch (t.authType) {
    case Vt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: we(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Vt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: we(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function c6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: we(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function l6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: we(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function u6(t, e) {
  const n = {
    ...e,
    nonce: we(e.nonce, !1),
    fee: we(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function f6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Vt.Standard:
      e.push(Va(t.spendingCondition));
      break;
    case Vt.Sponsored:
      e.push(Va(t.spendingCondition)), e.push(Va(t.sponsorSpendingCondition));
      break;
  }
  return Qt(e);
}
function d6(t) {
  const e = t.readUInt8Enum(Vt, (r) => {
    throw new Te(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Vt.Standard:
      return n = qa(t), fg(n);
    case Vt.Sponsored:
      n = qa(t);
      const r = qa(t);
      return dg(n, r);
  }
}
class h6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: we(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? JE, this.postConditionMode = i ?? Os.Deny, this.postConditions = s ?? au([]), o)
      this.anchorMode = sA(o);
    else
      switch (r.payloadType) {
        case ft.Coinbase:
        case ft.CoinbaseToAltRecipient:
        case ft.NakamotoCoinbase:
        case ft.PoisonMicroblock:
        case ft.TenureChange:
          this.anchorMode = Ee.OnChainOnly;
          break;
        case ft.ContractCall:
        case ft.SmartContract:
        case ft.VersionedSmartContract:
        case ft.TokenTransfer:
          this.anchorMode = Ee.Any;
          break;
      }
  }
  signBegin() {
    const e = Yc(this);
    return e.auth = $d(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Yc(this);
    return e.auth = $d(e.auth), e.txid();
  }
  verifyOrigin() {
    return o6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Vt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Vt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Vt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Ei(n)) {
      const r = Zs(e);
      n.fields.push(Es(r ? Rt.Compressed : Rt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = n6(n, r, e.fee, e.nonce, s);
    return Ei(e) ? e.signature = i : e.fields.push(Es(s.data.byteLength === Up ? Rt.Compressed : Rt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return lu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Vt.Sponsored)
      throw new Ro("Cannot sponsor sign a non-sponsored transaction");
    this.auth = u6(this.auth, e);
  }
  setFee(e) {
    this.auth = a6(this.auth, e);
  }
  setNonce(e) {
    this.auth = c6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Vt.Sponsored)
      throw new Ro("Cannot sponsor sign a non-sponsored transaction");
    this.auth = l6(this.auth, e);
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
    return Kr(n, this.chainId, 0), e.push(n), e.push(f6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(cu(this.postConditions)), e.push(Qp(this.payload)), Qt(e);
  }
}
function fu(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ci(Ot(t.slice(2))) : e = new ci(Ot(t)) : t instanceof Uint8Array ? e = new ci(t) : e = t;
  const n = e.readUInt8Enum(jo, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = d6(e), i = e.readUInt8Enum(Ee, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Os, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = ng(e, Q.PostCondition), c = S8(e);
  return new h6(n, s, c, a, o, i, r);
}
const p6 = e8, li = ur, g6 = qp;
const y6 = /* @__PURE__ */ new Set([4001, -31001]), w6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], b6 = ["result", "data", "payload", "response", "params"], vd = [
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
}, m6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), hg = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => m6(i, r)) === s
  );
}, pg = (t) => t ? hg(ss()).some(
  (e) => {
    var n;
    return e.id === t && (ma(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, gg = () => {
  if (typeof window > "u")
    return;
  const t = ss(), e = hg(t).filter(
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
  for (const n of w6) {
    const r = Cn(t, n) ?? (t === window ? void 0 : Cn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, x6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ss(), n = Cn(e, t) ?? (e === window ? void 0 : Cn(window, t)) ?? ia(t);
  if (n)
    return n;
  if (ma(t) || pg(t))
    return gg();
}, lo = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, S6 = ["blockstack-session", "blockstack"], E6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of S6) {
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
E6();
const yg = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Be = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, A6 = (t) => {
  const e = Be(t);
  if (!e)
    return null;
  const n = yg(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, $6 = (t) => {
  const e = Be(t);
  if (!e)
    return null;
  const n = yg(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Zc = (t, e = "mainnet") => {
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
      return Zc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Zc(r, e);
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
}, Ai = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return $s(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Ai(s, e + 1);
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
    const i = Ai(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && $s(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && $s(n.testnet) ? n.testnet.trim() : null;
}, Id = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, wg = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && y6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, qr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Be(n == null ? void 0 : n.message) ?? Be(e.message) ?? Be(e.error) ?? Be(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, zs = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw qr(e);
    if (e.status === "error")
      throw qr(e.result ?? e);
  }
  return t;
}, Ld = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return zs(r);
  } catch (r) {
    throw qr(r);
  }
}, bg = () => gg(), du = () => {
  if (typeof window > "u")
    return;
  const t = ss();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Cn(t, e) ?? (t === window ? void 0 : Cn(window, e));
    if (n)
      return n;
  }
}, kd = () => {
  if (typeof window > "u")
    return;
  const t = du();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = ss();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Cn(e, n) ?? (e === window ? void 0 : Cn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, xo = (t) => {
  var r, s;
  const e = Or();
  if (ma(e) || pg(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ss() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === bg();
}, Wa = (t) => {
  const e = $6(t);
  if (!e)
    return null;
  try {
    const n = fu(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Go = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Wa(t), r = A6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Be(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Go(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of vd)
    if (Wa(s[a])) {
      i = Be(s[a]);
      break;
    }
  const o = Be(s.txId) || Be(s.txid) || Be(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Be(s.txRaw) ?? void 0
    };
  for (const a of vd) {
    const c = Wa(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Be(s[a]) ?? void 0
      };
  }
  for (const a of b6) {
    const c = s[a], u = Go(c, e + 1);
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
  const e = Go(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, v6 = (t) => {
  const e = Go(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, I6 = (t) => ({
  ...t,
  fee: Tr(t.fee),
  nonce: Tr(t.nonce),
  sponsored: t.sponsored === !0
}), Cd = (t) => ({
  recipient: t.recipient,
  amount: Tr(t.amount) ?? "0",
  memo: t.memo,
  network: Zc(t.network),
  address: t.stxAddress,
  fee: Tr(t.fee),
  nonce: Tr(t.nonce),
  sponsored: t.sponsored ?? !1
}), mg = "WALLET_ADDRESS_MISMATCH", L6 = 45e3;
let ui = null;
const Qc = (t) => {
  t && (ui = { address: t, at: Date.now() });
}, k6 = () => {
  ui = null;
}, C6 = () => ui && Date.now() - ui.at <= L6 ? ui.address : null, B6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, T6 = async (t) => {
  k6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = zs(await t.request("wallet_connect")), n = Ai(e);
  return Qc(n), n;
}, M6 = async (t, e, n, r) => {
  try {
    return zs(await t.request(e, n));
  } catch (s) {
    const i = qr(s);
    if (!B6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await T6(t);
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
        { code: o ? mg : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return zs(await t.request(e, n));
    } catch (a) {
      throw qr(a);
    }
  }
};
let Bd = 3e4;
const _6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Bd / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Bd);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, U6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: mg }
      );
    return c;
  }, s = C6();
  if (s)
    return lo(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  lo(n, "account-read");
  try {
    const c = zs(
      await _6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Ai(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (wg(c))
      throw qr(c);
    lo(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Qc(i), r(i, "wallet_getAccount");
  let o;
  lo(n, "account-reconnect");
  try {
    o = zs(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), qr(c);
  }
  const a = Ai(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Qc(a), r(a, "wallet_connect");
}, N6 = async (t, e) => {
  if (!xo(t)) {
    const i = await Ld(
      t,
      "stx_transferStx",
      Cd(e)
    );
    return Xa(i);
  }
  const n = du();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Ld(
      n,
      "stx_transferStx",
      Cd(e)
    );
    return Xa(i);
  }
  const r = bg();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await U6(r, e.stxAddress);
  const s = await M6(
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
}, H6 = () => Or(), xg = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Or(), e = t ? x6(t) : void 0;
  if (e)
    return e;
  const n = ss() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Td = (t, e) => {
  const n = xg(), r = I6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, v6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return io(r, e);
  if (xo(n) && !du()) {
    const s = kd();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Or(),
        route: "legacy-transaction-request"
      }), io(r, s);
  }
  return void N6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Id(s) && xo(n)) {
      const a = kd();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Or(),
          route: "legacy-transaction-request"
        }), io(r, a);
        return;
      }
    }
    if (Id(s) && !xo(n)) {
      io(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), wg(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Md = (t) => og(t).replace(/^0x/, ""), _d = "This wallet cannot sign messages. Try Xverse or Leather.", Ud = (t) => typeof (t == null ? void 0 : t.request) == "function", Nd = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", P6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, O6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function D6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Md(e.message),
    domain: Md(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function j6(t, e) {
  const n = await _E({
    domain: e.domain,
    message: e.message,
    network: ha(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Hd(t) {
  var s, i;
  const e = H6() || "", n = /xverse/i.test(e);
  let r = xg();
  if (n && !Nd(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Nd(r))
    try {
      return await j6(r, t);
    } catch (o) {
      if (n || !Ud(r) || !O6(o)) throw o;
    }
  if (!n && Ud(r))
    try {
      return await D6(r, t);
    } catch (o) {
      throw P6(o) ? new Error(_d) : o;
    }
  throw new Error(_d);
}
const Pd = 1000000n, fi = 1000000n, Jc = 50n, Rs = 3000n, xa = 300n, F6 = 3000n, z6 = 50000n, Od = 200n, Gs = (t) => t + Jc;
function vn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Pd}.${(n % Pd).toString().padStart(6, "0")}`;
}
function R6(t, e = xa) {
  return t <= Rs ? 0 : Number((t - Rs) / Gs(e));
}
function Dd(t, e = 0n) {
  const n = fi - t - e;
  return n > 0n ? n : 0n;
}
function G6(t, e = xa) {
  return t > fi ? "over" : t < Rs + Gs(e) ? "empty" : t < z6 ? "low" : "ok";
}
const K6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", V6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", q6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function W6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || q6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== K6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Sg = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Ya = 3, X6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [tl, Eg] = Sg.split("."), Oe = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function el(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function Y6(t) {
  return Oe(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Wr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Ag(t, e = []) {
  const n = await Wr(`/v2/contracts/call-read/${tl}/${Eg}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: tl, arguments: e.map((r) => "0x" + Oe(Yt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Ln(ze(n.result));
}
async function Z6() {
  const t = await Wr(`/v2/contracts/source/${tl}/${Eg}?proof=0`);
  if (typeof t.source != "string" || await Y6(t.source) !== V6) throw Error("Deployed source does not match the tested helper.");
  if (W6(await Ag("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function $g(t) {
  return t.startsWith("SP") && $s(t) && !t.includes(".");
}
async function Q6(t) {
  var r;
  if (!$g(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Wr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Wr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function J6(t) {
  const e = await Wr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function t5(t, e) {
  var s, i;
  const n = await Ag("get-owner", [li(t), li(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !$g(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function e5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: el(t), signal: AbortSignal.timeout(15e3) });
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
async function n5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function r5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = fu(el(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Ss(ri(Fo.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Ss(r.contractAddress) + "." + r.contractName.content !== Sg || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Oe(Yt(r.functionArgs[0])) !== Oe(Yt(li(t.core))) || Oe(Yt(r.functionArgs[1])) !== Oe(Yt(li(t.song))) || Oe(Yt(r.functionArgs[2])) !== Oe(Yt(g6(el(t.id)))) || t.amount !== "50" || e.postConditionMode !== Os.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== bi.Equal || i.principal.prefix !== 2 || Ss(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Ss(r.contractAddress) + "." + r.contractName.content !== X6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Oe(Yt(r.functionArgs[0])) !== Oe(Yt(li(t.song))) || typeof t.liked != "boolean" || Oe(Yt(r.functionArgs[1])) !== Oe(Yt(p6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Os.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Ln(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const s5 = "xtrata.xyz/radio/listening-wallet", i5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Ko = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && $s(t), o5 = (t) => ({
  domain: xi({ name: qe(s5), version: qe("1"), "chain-id": ur(1) }),
  message: xi({
    purpose: qe(i5),
    main: qe(t.main),
    listening: qe(t.listening),
    issued: ur(t.issued)
  })
}), jd = ["prepared", "signed", "unknown", "pending"], a5 = 30 * 6e4, hs = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, c5 = 3e3, Fd = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function l5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = !1, d = !1, l = !1, y = null, h = !1, g = "", w = "", v, _ = null, U, b = [], L, A = -1 / 0;
  const D = /* @__PURE__ */ new Set();
  let K = null, j = !1, V = 0, m = !1, I = !1, P = !1, G = !1, st = 0, W = null, _t = Promise.resolve();
  const Lt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? xa.toString()), Ut = (x) => !!i && !(i.features ?? []).includes(x), S = (x, M) => `xtrata.ppp.v1.${x}:${M}`, T = (x = i == null ? void 0 : i.address) => {
    if (!x) return [];
    try {
      const M = JSON.parse(t.store.get(S("entries", x)) || "[]");
      return Array.isArray(M) ? M : [];
    } catch {
      return [];
    }
  }, tt = (x) => {
    const M = [x, ...T(x.address).filter((q) => !(q.txid === x.txid && q.kind === x.kind))].slice(0, 200);
    t.store.set(S("entries", x.address), JSON.stringify(M));
  }, k = (x = i == null ? void 0 : i.address) => !!x && t.store.get(S("on", x)) !== "0", N = (x) => {
    i != null && i.address && t.store.set(S("on", i.address), x ? "1" : "0");
  }, O = () => T().filter((x) => jd.includes(x.status)), J = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(S("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, rt = (x) => {
    i != null && i.address && t.store.set(S("deposit", i.address), JSON.stringify(x));
  }, Tt = () => O().filter((x) => t.now() - x.created > a5 && D.has(x.txid)), le = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Dt = () => le() && !(i != null && i.linked), ue = () => {
    const x = t.main();
    return !Dt() && !!x && !!(i != null && i.linked) && i.linked !== x;
  }, be = (x) => S("return-to", x), fe = (x = i == null ? void 0 : i.address) => {
    if (!x) return;
    const M = t.store.get(be(x));
    return M && Ko(M) && M !== x ? M : void 0;
  }, Gt = (x = i == null ? void 0 : i.address) => K && K.for === x ? K.res : null;
  function Wt() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const x = fe();
    if (x) return { to: x, kind: "chosen" };
    const M = Gt();
    if (M != null && M.ok && M.funder) return { to: M.funder, kind: "funder" };
  }
  function jt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const x = t.main();
    if (!Dt()) {
      if (!x) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : ue() ? "wrong-wallet" : i.state === "known" ? "locked" : !Dt() && i.linked !== x ? "link" : o === void 0 ? "loading" : o > fi ? "over" : o < Rs + Gs(Lt()) ? "fund" : "ready" : "loading";
  }
  const f = () => {
    var x, M, q, St;
    return {
      step: jt(),
      busy: c,
      message: g,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : G6(o, Lt()),
      playsLeft: o === void 0 ? 0 : R6(o, Lt()),
      allowance: o === void 0 ? fi : Dd(o, BigInt(((x = J()) == null ? void 0 : x.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: k(),
      entries: T(),
      depositTxid: ((M = J()) == null ? void 0 : M.txid) ?? v,
      depositPending: !!J(),
      walletOutdated: Ut("like"),
      linkedListening: L && L === t.main() ? b.map((R) => R.listening) : [],
      serverLinked: !!_ && U === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Tt().length,
      armed: P,
      queued: Jt.length,
      solo: Dt(),
      returnTo: (q = Wt()) == null ? void 0 : q.to,
      returnToKind: (St = Wt()) == null ? void 0 : St.kind,
      funderState: (() => {
        const R = Gt();
        return R ? R.ok ? R.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const R = Gt();
        return !!R && R.ok && R.distinct > 1;
      })(),
      walletCannotSolo: Dt() && Ut("standalone"),
      walletCannotMulti: Ut("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((R) => R !== t.main() && R !== (i == null ? void 0 : i.linked))
    };
  }, E = (x, M = "") => {
    g = x, w = M, t.changed();
  };
  async function B(x, M) {
    if (!c) {
      c = x, w = "", t.changed();
      try {
        await M();
      } catch (q) {
        const St = q instanceof Error ? q.message : String(q);
        w = /Cancelled in the listening wallet/.test(St) ? "" : St, w || (g = "Not now. Nothing was signed.", G = !0);
      } finally {
        c = null, await ve(!0);
      }
    }
  }
  const Y = () => !!(e != null && e.enabled) && e.here && (Dt() || !!t.main() && e.allowed), ht = () => Y() && !ue(), $t = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", re = () => {
    if (ue()) throw new Error($t());
  };
  async function te() {
    if (!Y()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Xt = (x) => {
    const M = t.main();
    return x.request("listening.status", M ? { main: M } : void 0);
  };
  async function Qe(x = !1) {
    i != null && i.address && (!x && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function wr(x) {
    if ((L !== x || t.now() - A >= 6e4) && (b = await t.links(x), L = x, A = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === x) return;
    const M = `${x}:${i.address}`;
    U === M && _ || (_ = b.find((q) => q.listening === i.address) ?? null, U = M);
  }
  async function _n() {
    const x = i == null ? void 0 : i.address;
    if (!Dt() || !x || i != null && i.linked || !t.funder || j || !o || o <= 0n) return;
    const M = Gt(x);
    if (M != null && M.ok && M.funder) return;
    const q = M != null && M.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, V - 1), 30 * 6e4);
    if (!(K && K.for === x && t.now() - K.at < q)) {
      j = !0;
      try {
        K = { for: x, res: await t.funder(x), at: t.now() };
      } catch {
        K = { for: x, res: { ok: !1 }, at: t.now() };
      } finally {
        j = !1;
      }
      V = K.res.ok ? 0 : V + 1;
    }
  }
  async function de() {
    var St;
    const x = i == null ? void 0 : i.address;
    if (!x) return;
    let M;
    for (const R of O())
      try {
        const kt = await t.chain.transaction(R.txid);
        if (!kt) {
          if (D.add(R.txid), t.now() - R.created > 15 * 6e4 && (M ?? (M = await t.chain.confirmedNonce(x))), M !== void 0 && M > BigInt(R.nonce)) {
            tt({ ...R, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((R.status === "unknown" || R.status === "signed") && R.raw)
            try {
              await t.chain.broadcast(R.raw, R.txid), tt({ ...R, status: "pending" });
            } catch (Nt) {
              hs(Nt) && tt({ ...R, status: "failed", note: Nt.message, raw: void 0 });
            }
          continue;
        }
        D.delete(R.txid);
        const gt = String(kt.tx_status);
        if (gt === "success" && kt.canonical !== !1 && kt.is_unanchored === !1) {
          if (tt({ ...R, status: "confirmed", confirmedAt: t.now(), actualFee: String(kt.fee_rate ?? R.fee), raw: void 0 }), R.kind === "like" && (h = !0, R.status !== "confirmed" && typeof R.liked == "boolean"))
            try {
              (St = t.likeConfirmed) == null || St.call(t, R.song, R.liked);
            } catch {
            }
        } else gt.startsWith("abort_") || gt.startsWith("dropped_") ? tt({ ...R, status: "failed", note: gt, raw: void 0 }) : R.status !== "pending" && tt({ ...R, status: "pending" });
      } catch {
      }
    const q = J();
    if (q)
      try {
        const R = await t.chain.transaction(q.txid), kt = String((R == null ? void 0 : R.tx_status) ?? "");
        (kt === "success" && R.is_unanchored === !1 || kt.startsWith("abort_") || kt.startsWith("dropped_") || !R && t.now() - q.at > 2 * 36e5) && (rt(null), a = -1 / 0);
      } catch {
      }
  }
  async function ve(x = !1) {
    var M;
    try {
      const q = t.main();
      if ((x || !e || r !== q || t.now() - n > 3e5) && (e = await t.config(q), n = t.now(), r = q), !e.enabled || !e.here || !Dt() && (!q || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), P && Et(), t.changed();
        return;
      }
      await te(), i = await Xt(s), ue() && i.state === "unlocked" && (tn(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Xt(s)), q && e.allowed && await wr(q), await Qe(x), await _n(), await de();
    } catch (q) {
      w = q instanceof Error ? q.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (jt() === "locked" ? wt() : P && Et(), h) {
      h = !1;
      try {
        (M = t.likesChanged) == null || M.call(t);
      } catch {
      }
    }
    t.changed(), Jt.length && !He && Hn();
  }
  async function Je(x, M) {
    var kt;
    re();
    const q = !(i != null && i.address) || k(i.address), St = i != null && i.linked ? (kt = t.nameOf) == null ? void 0 : kt.call(t, i.linked) : void 0;
    await x.request("listening.unlock", { mode: "unlock", terms: q ? Ft() : void 0, anyPasskey: M, ...t.main() ? { main: t.main() } : {}, ...St ? { label: St } : {} }), i = await Xt(x), q && (k(i.address) ? await me() : await x.request("listening.stop")), E(q ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const R = y;
    y = null, R && t.now() - R.at < 12e4 && setTimeout(() => void ve(!0).then(() => X(R)), 0);
  }
  function wt() {
    P || c || G || st >= 3 || !s || !(i != null && i.address) || (P = !0, _t = (async () => {
      try {
        await Je(s, !1), st = 0;
      } catch (x) {
        const M = x instanceof Error ? x.message : String(x);
        /Cancelled in the listening wallet/.test(M) ? W || (G = !0, E("Not now. Nothing was signed.")) : /did not answer/.test(M) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (st++, w = M);
      } finally {
        P = !1;
        const x = W;
        W = null, x ? await x() : await ve(!0);
      }
    })());
  }
  async function Et(x) {
    P && (W = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await _t), x && await x(), t.changed();
  }
  const Ft = () => ({
    fee: Lt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: fi.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function me() {
    if (!(i != null && i.address)) return !1;
    if (I || (I = await t.tabLock(i.address)), !I)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const br = {
    forceRefresh: () => ve(!0),
    create: () => B("Waiting for your passkey…", async () => {
      const x = await te();
      await x.request("listening.unlock", { mode: "create", terms: Ft(), ...t.main() ? { main: t.main() } : {} }), i = await Xt(x), N(!0), E(Dt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await me();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (x, M) => {
      !(i != null && i.address) || J() || (rt({ txid: x, amount: M.toString(), at: t.now() }), a = -1 / 0, E("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    unlock: (x = !1) => {
      const M = () => B("Waiting for your passkey…", async () => Je(await te(), x));
      return P ? x ? Ut("cancel") ? (E("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Et(async () => {
        (jt() === "locked" || jt() === "intro") && await M();
      }) : _t : M();
    },
    link: () => B("Sign in your wallet…", async () => {
      re();
      const x = t.main();
      if (!x || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const M = (await t.links(x)).find((q) => q.listening === i.address);
      if (M)
        await s.request("listening.link", { main: x, issued: M.issued, mainSignature: M.mainSignature });
      else {
        const q = { main: x, listening: i.address, issued: t.now() }, St = await t.signWithMain(x, o5(q)), R = await s.request("listening.link", { main: x, issued: q.issued, mainSignature: St });
        await t.saveLink({ ...q, mainSignature: St, listeningSignature: R.listeningSignature }), A = -1 / 0;
      }
      E("Linked ✓");
    }),
    deposit: () => B("Approve the deposit in your wallet…", async () => {
      re();
      const x = t.main();
      if (!x || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (J()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Qe(!0);
      const M = Dd(o ?? 0n);
      if (M <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      v = await t.deposit(x, i.address, M), v && rt({ txid: v, amount: M.toString(), at: t.now() }), E("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => B("Confirm in the listening wallet…", async () => {
      if (!ht()) throw new Error("Connect your wallet first.");
      await me(), await s.request("listening.approveSession", Ft()), N(!0), E("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => B("Clearing…", async () => {
      for (const x of Tt())
        await t.chain.transaction(x.txid) || tt({ ...x, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      E("Cleared ✓");
    }),
    switchOff: () => B("Switching off…", async () => {
      tn(), await (s == null ? void 0 : s.request("listening.stop")), N(!1), E("Paying is off. Music stays free.");
    }),
    lock: () => B("Locking…", async () => {
      tn(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, E("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (x) => {
      const M = String(x ?? "").trim();
      if (!(i != null && i.address)) return E("", "Unlock the listening wallet first.");
      if (!Ko(M)) return E("", "Enter a standard mainnet address (it starts with SP).");
      if (M === i.address) return E("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(be(i.address), M), E("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(be(i.address), ""), t.changed();
    },
    returnFunds: (x) => B("Check the return in the listening wallet…", async () => {
      if (!ht()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      const M = Wt();
      if (!M) throw new Error(Dt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (M.kind !== "linked" && Ut("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (O().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: q, nonce: St } = await t.chain.account(i.address);
      o = q;
      const R = await s.request("listening.prepareReturn", {
        mode: x,
        balance: q.toString(),
        nonce: St.toString(),
        fee: F6.toString(),
        ...M.kind === "linked" ? {} : { destination: M.to }
      });
      if (R.recipient !== M.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
      const kt = fu(R.raw);
      if (Ln(kt.payload.recipient).value !== M.to || String(kt.payload.amount) !== R.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const gt = {
        id: Fd(),
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
      t.validate(gt), tt(gt);
      try {
        await t.chain.broadcast(R.raw, R.txid), tt({ ...gt, status: "pending" });
      } catch (Nt) {
        throw tt({ ...gt, status: "unknown", note: Nt.message }), Nt;
      }
      x === "all" && N(!1), E(x === "all" ? M.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Jt = [], Un = 10, Ne = 30 * 6e4;
  let He = !1;
  const Nn = () => u || !!c || d || l, tn = () => {
    Jt.length && (Jt.length = 0, t.changed());
  };
  async function en(x) {
    if (!Jt.some((M) => M.id === x.id) && !T().some((M) => M.id === x.id) && (Jt.push({ ...x, at: t.now() }), Jt.length > Un && Jt.shift()), Nn() || O().length) {
      const M = Jt.length;
      g = `Queued ${M === 1 ? "this song" : M + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Hn();
  }
  async function Hn() {
    if (!He) {
      He = !0;
      try {
        for (; Jt.length; ) {
          for (; Jt.length && t.now() - Jt[0].at > Ne; ) Jt.shift();
          if (!Jt.length || Nn() || await is(Jt[0]) === "wait") return;
          Jt.shift();
        }
      } finally {
        He = !1, t.changed();
      }
    }
  }
  async function is(x) {
    u = !0;
    try {
      await ve();
      const M = jt();
      if (M === "loading") return "wait";
      if (M !== "ready" || !k() || !(i != null && i.session) || i.session.playsLeft < 1 || !I) return "done";
      if (O().length) return "wait";
      m || (await t.chain.verify(), m = !0);
      const q = i.address, { balance: St, nonce: R } = await t.chain.account(q);
      o = St, a = t.now();
      const kt = await t.chain.owner(Ya, x.song);
      if (kt === q || kt === t.main()) return "done";
      const gt = await s.request("listening.signPlay", {
        core: Ya,
        song: x.song,
        receipt: x.id,
        fee: Lt().toString(),
        nonce: R.toString(),
        balance: St.toString()
      }), Nt = {
        id: x.id,
        address: q,
        kind: "play",
        core: Ya,
        song: x.song,
        recipient: kt,
        amount: "50",
        fee: Lt().toString(),
        nonce: R.toString(),
        created: t.now(),
        status: "signed",
        raw: gt.raw,
        txid: gt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      t.validate(Nt), tt(Nt);
      const se = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`;
      try {
        await t.chain.broadcast(gt.raw, gt.txid), tt({ ...Nt, status: "pending" }), g = `♪ Paid ${se}`, w = "";
      } catch (nn) {
        tt({ ...Nt, status: hs(nn) ? "failed" : "unknown", note: nn.message, ...hs(nn) ? { raw: void 0 } : {} }), w = nn.message;
      }
      return i = await Xt(s), "done";
    } catch (M) {
      return g = "This song played free: " + (M instanceof Error ? M.message : "payment unavailable"), "done";
    } finally {
      u = !1, t.changed();
    }
  }
  function os(x) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(jt()) || Ut("like") ? !1 : (X(x), !0);
  }
  async function X(x) {
    const M = x.title ? `“${x.title}”` : `song #${x.song}`, q = (Ie) => {
      var rn;
      w = Ie, g = "";
      try {
        (rn = t.likeFailed) == null || rn.call(t, x.song);
      } catch {
      }
      t.changed();
    }, St = jt(), R = t.main(), kt = Dt() ? i == null ? void 0 : i.address : R;
    if (St === "locked") {
      y = { ...x, at: t.now() }, E(`Unlock to like ${M}. It sends straight after.`);
      return;
    }
    if (St === "wrong-wallet") return q($t());
    if (St === "link") return q("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Dt() && Ut("standalone")) return q("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (St === "fund") return q("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (St === "over") return q("Return the excess first: the listening wallet holds more than 1 STX.");
    if (St !== "ready" || !kt) return q("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return q("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!I) return q("Pay-per-play is running in another tab. Like from that tab.");
    const gt = T().find((Ie) => Ie.kind === "like" && Ie.song === x.song);
    if (gt && jd.includes(gt.status))
      return q(`Your last like for ${M} is still on its way. It can change again once it confirms.`);
    if (d) return q("One like at a time: your last one is still being sent.");
    if ((gt == null ? void 0 : gt.status) === "confirmed" && t.now() - (gt.confirmedAt ?? 0) < c5)
      return q(`Your like for ${M} has only just confirmed. Try again in a moment.`);
    let Nt;
    l = !0;
    try {
      Nt = t.likeState ? (await t.likeState(kt, x.song)).by : x.likedBy ?? [];
    } catch {
      Nt = x.likedBy;
    } finally {
      l = !1;
    }
    if (!Nt) return q(`Could not check ${M} right now. Try the heart again.`);
    const se = i.address, xn = ((gt == null ? void 0 : gt.status) === "confirmed" && typeof gt.liked == "boolean" && t.now() - (gt.confirmedAt ?? gt.created) < 5 * 6e4 ? gt.liked : void 0) ?? Nt.includes(se);
    if (!xn && Nt.some((Ie) => Ie !== se)) return q(Dt() ? `${M} was liked from another wallet of yours. Unlike it there.` : `${M} was liked from your main wallet${Nt.includes(R) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await nt({ song: x.song, liked: !xn, title: x.title, artist: x.artist });
  }
  async function nt(x) {
    var St, R, kt;
    if (d) {
      E("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const M = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`, q = t.wait ?? ((gt) => new Promise((Nt) => setTimeout(Nt, gt)));
    try {
      E(`${x.liked ? "Liking" : "Unliking"} ${M}…`);
      const gt = t.now() + 12e4;
      for (; u || O().length; ) {
        if (t.now() > gt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await q(5e3), await ve(!0);
      }
      if (jt() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const Nt = i.address, { balance: se, nonce: nn } = await t.chain.account(Nt);
      o = se, a = t.now();
      const xn = await s.request("listening.signLike", {
        song: x.song,
        liked: x.liked,
        fee: Od.toString(),
        nonce: nn.toString(),
        balance: se.toString()
      }), Ie = {
        id: Fd(),
        address: Nt,
        kind: "like",
        core: 0,
        song: x.song,
        liked: x.liked,
        recipient: "",
        amount: "0",
        fee: Od.toString(),
        nonce: nn.toString(),
        created: t.now(),
        status: "signed",
        raw: xn.raw,
        txid: xn.txid,
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      t.validate(Ie), tt(Ie);
      try {
        await t.chain.broadcast(xn.raw, xn.txid), tt({ ...Ie, status: "pending" }), g = `${x.liked ? "♥ Liked" : "Unliked"} ${M}`, w = "";
        try {
          (St = t.likeSent) == null || St.call(t, x.song, x.liked);
        } catch {
        }
      } catch (rn) {
        if (tt({ ...Ie, status: hs(rn) ? "failed" : "unknown", note: rn.message, ...hs(rn) ? { raw: void 0 } : {} }), w = rn.message, hs(rn)) try {
          (R = t.likeFailed) == null || R.call(t, x.song);
        } catch {
        }
      }
      i = await Xt(s);
    } catch (gt) {
      w = "Like not sent: " + (gt instanceof Error ? gt.message : "the listening wallet is unavailable");
      try {
        (kt = t.likeFailed) == null || kt.call(t, x.song);
      } catch {
      }
    } finally {
      d = !1, t.changed(), Hn();
    }
  }
  return { snapshot: f, refresh: ve, onListened: en, heart: os, toggleLike: X, ...br };
}
const vg = ["Connect", "Passkey", "Link & fund", "Listen"], Ig = ["Passkey", "Add 1 STX", "Listen"], nl = (t) => t ? Ig : vg;
function u5(t) {
  if (t.solo) return f5(t);
  const e = vg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function f5(t) {
  const e = Ig.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function d5(t, e) {
  return !e || e.at >= nl(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") ? !1 : !(t.step === "locked" && t.linked);
}
const h5 = 100000n, p5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function g5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Ko(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= h5).sort(p5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const uo = 50;
function zd(t) {
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
async function y5(t, e, n = 4) {
  if (!Ko(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${uo}&offset=${o}`, s = zd(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - uo);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= uo ? s : zd(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = g5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - uo);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const w5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function b5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !w5(r.id)));
}
const m5 = {}, x5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, S5 = (t) => {
  const e = m5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, E5 = (t) => `/hiro/${t}`, A5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, $5 = (t) => {
  const e = S5(t);
  if (e)
    return [A5(e)];
  const n = x5[t];
  return typeof window < "u" ? [`${window.location.origin}${E5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, v5 = {}, Rd = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, I5 = "xtrata.log.enabled", L5 = "xtrata.log.level", k5 = "xtrata.log.tags", C5 = "xtrata.log.dedupe", fo = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, B5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, T5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, M5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, _5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, U5 = () => {
  const t = v5 ?? {}, e = fo(I5) ?? t.VITE_LOG_ENABLED, n = fo(L5) ?? t.VITE_LOG_LEVEL, r = fo(k5) ?? t.VITE_LOG_TAGS, s = fo(C5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: B5(e),
    level: T5(n) ?? "warn",
    tags: _5(r),
    dedupe: M5(s)
  };
}, N5 = (t, e, n) => !t.enabled || Rd[n] < Rd[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), H5 = (t, e, n, r) => {
  const s = U5();
  if (!N5(s, e, t) || O5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, P5 = /* @__PURE__ */ new Set();
let Gd = null;
const O5 = (t, e, n, r, s) => (Gd !== t && (P5.clear(), Gd = t), !1), D5 = (t, e, n) => H5("debug", t, e, n), j5 = {}, F5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, z5 = (t) => {
  const e = j5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : F5[t];
}, R5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, G5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return R5.test(n) ? n : null;
}, K5 = (t) => t.replace(/\/+$/, ""), V5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Kd = (t) => {
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
}, ps = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, q5 = (t) => {
  var c, u;
  let e;
  try {
    e = Ln(Y8(t));
  } catch {
    return null;
  }
  const n = ps(e);
  if (!n || n.success === !1)
    return null;
  const r = ps(n.value), s = ps(r == null ? void 0 : r.value), i = ps(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Kd((c = ps(i.name)) == null ? void 0 : c.value), a = Kd((u = ps(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : G5(`${o}.${a}`);
}, W5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${K5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [og(Rp(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : q5(i.result);
}, X5 = async (t) => {
  const e = t.address.trim();
  if (!$s(e))
    return null;
  const n = z5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of $5(t.network))
    try {
      return await W5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return D5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: V5(r)
  }), null;
};
function Y5(t, e, n = {}) {
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
const Vd = Object.freeze({
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
function Z5(t, e = "") {
  return Object.hasOwn(Vd, String(t)) ? Vd[String(t)] : e;
}
const qd = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function Q5(t, e = "") {
  return Object.hasOwn(qd, String(t)) ? qd[String(t)] : e;
}
const J5 = 100000n, t$ = 1000000n, e$ = 3000n, n$ = (t, e) => `${t}#gift=${e}`, r$ = 100, Wd = (t, e = xa) => t <= Rs ? 0 : Number((t - Rs) / Gs(e)), Xd = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), s$ = "xtrata.xyz/radio/gifts", i$ = "Create Xtrata radio gift links paid from the gift treasury", o$ = (t) => ({
  domain: xi({ name: qe(s$), version: qe("1"), "chain-id": ur(1) }),
  message: xi({
    purpose: qe(i$),
    admin: qe(t.admin),
    count: ur(t.count),
    amount: ur(BigInt(t.amount)),
    label: qe(t.label),
    issued: ur(t.issued)
  })
}), gs = "xtrata.radio.gift.incoming.v1", Yd = (t) => "xtrata.radio.gift.mine.v1:" + t, mt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, ys = (t, e, n = "") => {
  const r = mt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, ws = (t) => vn(t).replace(/\.?0+$/, "");
function a$(t) {
  let e = null;
  const n = (() => {
    try {
      const k = new URL(location.href), N = new URLSearchParams(k.hash.slice(1)).get("gift") ?? k.searchParams.get("gift");
      return N !== null && (k.searchParams.delete("gift"), history.replaceState(null, "", k.pathname + (k.search || ""))), Xd(N) ? N : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const k = JSON.parse(t.store.get(gs) || "null");
      return Xd(k == null ? void 0 : k.code) ? k.code : null;
    } catch {
      return null;
    }
  })(), s = n ?? r;
  s && (e = { code: s }, t.store.set(gs, JSON.stringify({ code: s, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (k) => {
    const N = await k.json().catch(() => ({}));
    if (!k.ok)
      throw k.status === 404 && t.store.set(gs, null), new Error((N == null ? void 0 : N.error) || "Could not check your gift right now. Reload to try again.");
    const O = N;
    e = { ...e, view: O }, ["claimed", "expired", "refunding", "refunded"].includes(O.status) && t.store.set(gs, null), t.changed();
  }).catch((k) => {
    e = { ...e, error: k.message }, t.changed();
  }));
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = (k) => k.from ? t.who(k.from) : k.label ? `Xtrata Radio · ${k.label}` : "Xtrata Radio";
  let a = {};
  const c = (k) => {
    if (a.box) return a.box;
    const N = mt("div", "", "ppp-gift-check");
    a.box = N;
    const O = () => {
      const J = window.turnstile;
      !J || a.rendered || (a.rendered = !0, J.render(N, { sitekey: k, callback: (rt) => {
        a.token = rt, t.changed();
      }, "expired-callback": () => {
        a.token = void 0;
      } }));
    };
    if (window.turnstile) O();
    else {
      const J = document.createElement("script");
      J.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", J.async = !0, J.onload = O, document.head.append(J);
    }
    return N;
  };
  let u;
  async function d(k) {
    var N, O;
    if (!(!e || e.claiming || !k.listening)) {
      e.claiming = !0, e.error = void 0, t.changed();
      try {
        const J = await fetch("/radio/gift/claim", {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(3e4),
          body: JSON.stringify({ code: e.code, wallet: k.listening, turnstile: a.token })
        }), rt = await J.json().catch(() => ({}));
        if (J.status === 503 && /sending another gift/.test((rt == null ? void 0 : rt.error) || "")) {
          e.waiting = !0, clearTimeout(u), u = setTimeout(() => {
            e && (e.waiting = !1, t.changed());
          }, 12e3);
          return;
        }
        if (!J.ok)
          throw (J.status === 404 || J.status === 410 || J.status === 409 && /already had a gift|brand-new/.test((rt == null ? void 0 : rt.error) || "")) && t.store.set(gs, null), new Error((rt == null ? void 0 : rt.error) || `Could not claim the gift (${J.status}).`);
        e.done = !0, t.store.set(gs, null), t.giftSent(rt.txid, BigInt(rt.amount));
      } catch (J) {
        e.error = J.message, a.token = void 0;
        try {
          (O = (N = window.turnstile) == null ? void 0 : N.reset) == null || O.call(N, a.box);
        } catch {
        }
      } finally {
        e.claiming = !1, t.changed();
      }
    }
  }
  let l = null;
  function y(k) {
    if (!k.listening || !k.depositPending || k.step !== "fund")
      return l = null, [];
    if (!l || l.wallet !== k.listening || t.now() - l.at > 3e4) {
      const N = k.listening;
      l = { ...(l == null ? void 0 : l.wallet) === N ? l : {}, wallet: N, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(N)).then((O) => {
        var J, rt;
        (l == null ? void 0 : l.wallet) === N && (l.state = (J = O == null ? void 0 : O.gift) == null ? void 0 : J.state, l.problem = ((rt = O == null ? void 0 : O.gift) == null ? void 0 : rt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    return l.state === "sending" && l.problem ? [mt("p", `🎁 Your gift is waiting to go out (${l.problem}). It is retried automatically.`, "ppp-warn")] : [];
  }
  function h(k) {
    var ue, be;
    const N = y(k);
    if (!e || ["off", "elsewhere"].includes(k.step)) return N;
    const O = e.view;
    if (e.error && !O) return [mt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!O) return [mt("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return N;
    if (O.status === "claimed" || O.status === "claiming") return [mt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(O.status)) return [mt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (O.status === "pending-deposit") return [mt("p", `🎁 ${o(O)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    const J = BigInt(O.amount), Tt = [mt("p", `🎁 ${o(O)} sent you ${ws(J)} STX of on-chain music: about ${Wd(J).toLocaleString()} paid plays.`, "ppp-gift")], le = !!k.listening && k.step === "fund" && (k.balance ?? 1n) === 0n && !k.depositPending && !k.entries.length, Dt = (be = (ue = k.gate) == null ? void 0 : ue.gifts) == null ? void 0 : be.turnstileSiteKey;
    return le ? (Dt && !a.token ? Tt.push(mt("p", "One quick check and it is yours:", "ppp-mute"), c(Dt)) : !e.claiming && !e.error && !e.waiting && d(k), (e.claiming || e.waiting) && Tt.push(mt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && Tt.push(mt("p", e.error, "ppp-bad"), ys("Try again", () => {
      e.error = void 0, d(k);
    }))) : k.step === "intro" ? Tt.push(mt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : k.listening && (k.balance ?? 0n) > 0n && Tt.push(mt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute")), Tt;
  }
  async function g(k, N, O) {
    var J;
    try {
      const rt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(k));
      if ((J = rt == null ? void 0 : rt.gift) != null && J.returnTo) return { ok: !0, funder: rt.gift.returnTo, txId: rt.gift.txid ?? void 0, amount: rt.gift.amount, distinct: 1 };
    } catch {
      if (O) return { ok: !1 };
    }
    return N();
  }
  const w = mt("div", "", "ppp-gift-fold");
  let v = 250000n, _ = "", U = "", b = null;
  const L = (k) => {
    try {
      const N = JSON.parse(t.store.get(Yd(k)) || "[]");
      return Array.isArray(N) ? N : [];
    } catch {
      return [];
    }
  }, A = (k, N) => t.store.set(Yd(k), JSON.stringify(N.slice(0, 50)));
  let D = 0;
  async function K(k) {
    const N = L(k);
    for (const O of N)
      if (!(O.view && ["claimed", "refunded", "expired"].includes(O.view.status)))
        try {
          O.view = !O.view || O.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: O.id, ...O.txid ? { txid: O.txid } : {} }) }) : await t.json("/radio/gift?id=" + O.id), O.error = void 0;
        } catch (J) {
          O.error = J.message;
        }
    A(k, N), t.changed();
  }
  async function j(k) {
    if (_) return;
    _ = "Starting your gift…", U = "", t.changed();
    let N = null;
    try {
      N = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: k, amount: v.toString() }) });
      const O = L(k);
      O.unshift({ id: N.id, code: N.code, amount: v.toString(), at: t.now() }), A(k, O), _ = "Approve the gift in your wallet…", t.changed();
      const J = await t.pay(k, N.depositTo, BigInt(N.deposit), N.memo), rt = L(k), Tt = rt.find((le) => le.id === N.id);
      Tt && (Tt.txid = J, Tt.view = { status: "pending-deposit", amount: v.toString(), source: "friend", from: k, label: "", expires: 0 }), A(k, rt), U = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", K(k);
    } catch (O) {
      U = O.message || "Not sent.";
    } finally {
      _ = "", t.changed();
    }
  }
  async function V(k, N, O, J) {
    if (!_) {
      _ = "Sign in your wallet…", U = "", b = null, t.changed();
      try {
        const rt = { admin: k, count: N, amount: O.toString(), label: J, issued: t.now() }, Tt = await t.sign(k, o$(rt));
        _ = "Making links…", t.changed();
        const le = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: rt, signature: Tt }) });
        b = { codes: le.codes, amount: le.amount };
      } catch (rt) {
        U = rt.message || "Not made.";
      } finally {
        _ = "", t.changed();
      }
    }
  }
  const m = (k, N) => n$(k || location.origin + "/radio.html", N), I = (k) => {
    var N;
    return void ((N = navigator.clipboard) == null ? void 0 : N.writeText(k));
  }, P = (k) => navigator.share ? navigator.share({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: k }).catch(() => {
  }) : I(k), G = mt("input");
  G.type = "range", G.min = String(J5), G.max = String(t$), G.step = "50000", G.value = String(v), G.setAttribute("aria-label", "Gift amount");
  const st = mt("p", "", "ppp-gift-amount"), W = ys("", () => {
    const k = t.main();
    k && j(k);
  }, "primary"), _t = () => {
    st.textContent = Lt(), W.textContent = `Gift ${ws(v)} STX`;
  };
  G.oninput = () => {
    v = BigInt(G.value), _t();
  };
  const Lt = () => `${ws(v)} STX · about ${Wd(v).toLocaleString()} paid plays · you pay ${ws(v + e$)} STX with the network fee`;
  _t();
  const Ut = mt("input");
  Ut.type = "number", Ut.min = "1", Ut.max = String(r$), Ut.value = "10", Ut.setAttribute("aria-label", "How many links");
  const S = mt("input");
  S.type = "number", S.min = "0.1", S.max = "1", S.step = "0.05", S.value = "0.1", S.setAttribute("aria-label", "STX per link");
  const T = mt("input");
  T.maxLength = 40, T.placeholder = "Label, e.g. Launch week", T.setAttribute("aria-label", "Campaign label");
  function tt(k) {
    var rt, Tt, le, Dt, ue;
    const N = (rt = k.gate) == null ? void 0 : rt.gifts;
    if (!(N != null && N.enabled) || ["off", "elsewhere", "unsupported"].includes(k.step)) return null;
    const O = t.main(), J = [mt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!O)
      J.push(mt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      W.disabled = !!_, J.push(G, st, W), t.now() - D > 3e4 && (D = t.now(), K(O));
      const be = L(O);
      if (be.length) {
        const fe = mt("ul", "", "ppp-gift-list");
        for (const Gt of be.slice(0, 10)) {
          const Wt = (Tt = Gt.view) == null ? void 0 : Tt.status, jt = Gt.error ? Gt.error : !Wt || Wt === "pending-deposit" ? Gt.txid ? "payment confirming…" : "waiting for your payment" : Wt === "live" ? "ready to share" : Wt === "claiming" || Wt === "claimed" ? "claimed ✓" : Wt === "refunding" ? "expired · refund on its way" : Wt === "refunded" ? "expired · refunded to you" : Wt, f = mt("li");
          if (f.append(mt("span", `${ws(BigInt(Gt.amount))} STX`, "t"), mt("span", jt, ((le = Gt.view) == null ? void 0 : le.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Dt = Gt.view) == null ? void 0 : Dt.status) === "live") {
            const E = m(((ue = k.gate) == null ? void 0 : ue.radioUrl) ?? null, Gt.code);
            f.append(ys("Copy link", () => I(E), "tiny"), ys("Share", () => P(E), "tiny"));
          }
          fe.append(f);
        }
        J.push(fe);
      }
      if (N.admin) {
        const fe = ys("Sign and make links", () => {
          const jt = BigInt(Math.round(Number(S.value) * 1e6));
          V(O, Number(Ut.value), jt, T.value.trim());
        }), Gt = mt("div", "", "ppp-gift-admin"), Wt = (jt, f) => {
          const E = mt("label", jt);
          return E.append(f), E;
        };
        if (Gt.append(mt("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"), Wt("Links ", Ut), Wt("STX each ", S), T, fe), b) {
          const jt = b.codes.map((E) => {
            var B;
            return m(((B = k.gate) == null ? void 0 : B.radioUrl) ?? null, E);
          }).join(`
`), f = mt("textarea");
          f.readOnly = !0, f.value = jt, f.rows = Math.min(8, b.codes.length), Gt.append(mt("p", `${b.codes.length} links, ${ws(BigInt(b.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), f, ys("Copy all", () => I(jt), "tiny"));
        }
        J.push(Gt);
      }
    }
    return _ && J.push(mt("p", _, "ppp-cyan")), U && J.push(mt("p", U, /✓/.test(U) ? "ppp-ok" : "ppp-warn")), w.replaceChildren(...J), w;
  }
  return { banner: h, funder: g, renderFold: tt, liveGift: i };
}
const Zd = document.getElementById("ppp");
Zd && c$(Zd);
function c$(t) {
  var jt;
  const e = jy(), n = (f) => t.querySelector(f), r = n(".ppp-frame");
  let s = null;
  const i = async (f, E) => {
    const B = await fetch(f, { cache: "no-store", ...E, signal: AbortSignal.timeout(15e3) }), Y = await B.json().catch(() => ({}));
    if (!B.ok) throw new Error((Y == null ? void 0 : Y.error) || `Request failed (${B.status}).`);
    return Y;
  }, o = l5({
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
      const E = new Promise(($t, re) => {
        s.addEventListener("load", () => $t(), { once: !0 }), setTimeout(() => re(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = f + "/", r.replaceChildren(s), await E;
      const B = new Ty({ walletOrigin: f, frame: s, timeoutMs: 30 * 6e4 }), Y = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ht = ($t, re) => Y.has($t) ? B.request($t, re) : Promise.race([
        B.request($t, re),
        new Promise((te, Xt) => setTimeout(() => Xt(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ht("listening.status"), { request: ht };
    },
    chain: {
      verify: Z6,
      balance: J6,
      account: Q6,
      owner: t5,
      broadcast: e5,
      transaction: n5,
      confirmedNonce: async (f) => {
        const E = await Wr(`/v2/accounts/${f}?proof=0`);
        if (!Number.isSafeInteger(E == null ? void 0 : E.nonce) || E.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(E.nonce);
      }
    },
    signWithMain: (f, E) => Hd({ ...E, network: "mainnet", stxAddress: f }),
    deposit: (f, E, B) => new Promise((Y, ht) => Td({
      recipient: E,
      amount: B.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: f,
      network: new Za(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: ($t) => Y($t.txId || ""),
      onCancel: () => ht(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ht
    })),
    validate: r5,
    tabLock: (f) => new Promise((E) => {
      const B = navigator.locks;
      if (!(B != null && B.request)) {
        E(!0);
        return;
      }
      B.request("xtrata-ppp:" + f, { ifAvailable: !0 }, async (Y) => {
        E(!!Y), Y && await new Promise(() => {
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
      set: (f, E) => {
        try {
          localStorage.setItem(f, E);
        } catch {
        }
      }
    },
    changed: () => fe(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var E, B;
      return a.funder(f, () => y5(f, Wr), !!((B = (E = o.snapshot().gate) == null ? void 0 : E.gifts) != null && B.enabled));
    },
    likesChanged: () => {
      var f, E;
      (E = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || E.call(f);
    },
    likeState: async (f, E) => {
      const B = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: f, ids: String(E) })), Y = Array.isArray(B == null ? void 0 : B.rows) ? B.rows.find((ht) => (ht == null ? void 0 : ht.id) === E) : null;
      if (!Y || typeof Y.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: Y.liked, by: Array.isArray(Y.by) ? Y.by.filter((ht) => typeof ht == "string") : Y.liked ? [f] : [] };
    },
    likeSent: (f, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: f, liked: E } })),
    nameOf: (f) => L(f) ?? void 0,
    likeConfirmed: (f, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: E } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), a = a$({
    json: i,
    main: () => {
      const f = e.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, E, B, Y) => new Promise((ht, $t) => Td({
      recipient: E,
      amount: B.toString(),
      memo: Y,
      stxAddress: f,
      network: new Za(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (re) => ht(re.txId || ""),
      onCancel: () => $t(new Error("Gift cancelled. Nothing was sent.")),
      onError: $t
    })),
    sign: (f, E) => Hd({ ...E, network: "mainnet", stxAddress: f }),
    giftSent: (f, E) => o.giftSent(f, E),
    who: (f) => A(f),
    changed: () => fe(o.snapshot()),
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, E) => {
        try {
          E === null ? localStorage.removeItem(f) : localStorage.setItem(f, E);
        } catch {
        }
      }
    },
    now: Date.now
  });
  window.XtrataRadioLikeHandler = (f) => {
    if (!f || !Number.isSafeInteger(f.song) || f.song < 0) return !1;
    m();
    const E = I(f.song, { title: f.title, artist: f.artist });
    return o.heart({ song: f.song, title: E.title || void 0, artist: E.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let c;
  window.XtrataRadioListeningIdentity = () => {
    const f = o.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const u = (f) => {
    var B, Y;
    const E = window.XtrataRadioListeningIdentity();
    E !== c && (c = E, (Y = (B = window.XtrataRadio) == null ? void 0 : B.refreshLikes) == null || Y.call(B));
  }, d = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", l = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), y = (f) => {
    const E = Math.round((Date.now() - f) / 6e4);
    return E < 1 ? "now" : E < 60 ? `${E}m` : E < 1440 ? `${Math.round(E / 60)}h` : `${Math.round(E / 1440)}d`;
  }, h = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, g = (f, E = "", B = "") => {
    const Y = document.createElement(f);
    return E && (Y.textContent = E), B && (Y.className = B), Y;
  }, w = (f, E, B = "") => {
    const Y = g("button", f, B);
    return Y.type = "button", Y.onclick = E, Y;
  }, v = (f, E) => {
    const B = g("a", f);
    return B.href = E, B.target = "_blank", B.rel = "noopener", B;
  };
  let _ = null, U = !1;
  const b = Y5((f) => X5({ address: f, network: "mainnet" }), () => fe(o.snapshot())), L = (f) => b.get(f), A = (f) => L(f) ?? d(f), D = (f) => f.slice(0, 2).map(A).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), K = /* @__PURE__ */ new Map();
  let j = !1;
  const V = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), m = () => {
    j || (j = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const E of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const B = Number(E == null ? void 0 : E.id);
        Number.isSafeInteger(B) && K.set(B, { title: typeof E.title == "string" ? E.title : void 0, artist: typeof E.artist == "string" ? E.artist : void 0 });
      }
      fe(o.snapshot());
    }).catch(() => {
      j = !1;
    }));
  }, I = (f, E) => {
    const B = K.get(f), Y = Q5(f, [B == null ? void 0 : B.title, E == null ? void 0 : E.title].find(($t) => !V($t)) || ""), ht = Z5(f, (B == null ? void 0 : B.artist) || (E == null ? void 0 : E.artist) || "");
    return { title: Y, artist: ht };
  }, P = (f) => {
    const { title: E, artist: B } = I(f.song, f);
    return E ? `“${E}”${B ? ` — ${B}` : ""}` : `Song #${f.song}${B ? ` — ${B}` : ""}`;
  }, G = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, st = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function W(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["OVER 1 STX", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function _t(f, E, B = "", Y) {
    const ht = g("dt", f), $t = g("dd", E, B);
    return Y && $t.append(" ", Y), [ht, $t];
  }
  const Lt = document.getElementById("ppp-top"), Ut = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, S = () => {
    var E, B;
    const f = o.snapshot();
    if (f.step === "connect" || f.step === "wrong-wallet") {
      (E = document.getElementById("radio-wallet-connect")) == null || E.click();
      return;
    }
    if (f.step === "elsewhere" && ((B = f.gate) != null && B.radioUrl)) {
      location.href = f.gate.radioUrl;
      return;
    }
    f.step === "locked" && !f.armed && !f.busy && o.unlock(), f.step === "ready" && !f.payingOn && !f.busy && o.switchOn(), Ut();
  };
  Lt && (Lt.onclick = S);
  function T(f) {
    if (!Lt) return;
    const E = (Y, ht, $t) => {
      Lt.hidden = !1, Lt.className = "ppp-top" + (ht ? " is-" + ht : ""), Lt.replaceChildren(g("span", "", "dot"), document.createTextNode(Y)), Lt.title = $t;
    }, B = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0;
    switch (f.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Lt.hidden = !0;
        return;
      case "elsewhere":
        return E("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        Lt.hidden = !0;
        return;
      case "intro":
        return E("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return E(`Connect ${A(f.linked)}`, "warn", `This device's listening wallet belongs to ${A(f.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return E(f.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return E("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return f.depositPending ? E("Funds on their way", "quiet", "Paying starts by itself when they land") : E(f.entries.some((Y) => Y.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return E("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return E("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return f.payingOn && B > 0 ? E(`On · ${B.toLocaleString()} plays left`, "on", "Paying artists as you listen") : E("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const tt = document.getElementById("pppNudge"), k = document.getElementById("onair");
  (jt = tt == null ? void 0 : tt.querySelector("button")) == null || jt.addEventListener("click", () => S());
  const N = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, O = {
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
  function J(f) {
    var $t;
    if (f.step === "loading") return;
    const E = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, B = f.step === "ready" && f.payingOn && E > 0, Y = B ? "" : N[f.step] ?? "", ht = B ? "on" : Y ? "off" : "";
    if (ht ? document.documentElement.dataset.ppp = ht : delete document.documentElement.dataset.ppp, k && (k.hidden = !ht, k.querySelector(".onair-sub").textContent = B ? `Paying artists · ${E.toLocaleString()} plays left` : "Not paying"), tt && (tt.hidden = ht !== "off" || f.step === "fund" && f.depositPending, ht === "off")) {
      const re = Math.floor(Number(1000000n / Gs(BigInt((($t = f.gate) == null ? void 0 : $t.limits.playFee) ?? "300"))));
      tt.querySelector(".nudge-t").textContent = "⚠ " + Y, tt.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${re.toLocaleString()} plays, on-chain, straight to the artists.`, tt.querySelector("button").textContent = O[f.step] ?? "Start paying";
    }
  }
  let rt = "";
  function Tt(f) {
    const E = g("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && E.append(g("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && E.append(g("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const B = g("input");
    B.type = "text", B.placeholder = "SP… address to send returns to", B.autocomplete = "off", B.spellcheck = !1, B.setAttribute("aria-label", "Address to return funds to"), B.value = rt, B.oninput = () => {
      rt = B.value;
    };
    const Y = w(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(B.value), rt = "";
    }, "tiny");
    return E.append(B, " ", Y), f.returnToKind === "chosen" && E.append(" ", w("Back to the funder", () => o.clearReturnAddress(), "tiny")), E;
  }
  const le = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Dt() {
    const f = g("p", le + " ", "ppp-mute");
    return f.append(v("Xverse", "https://www.xverse.app/download"), " · ", v("Leather", "https://leather.io/install-extension")), f;
  }
  let ue = "";
  const be = (f) => {
    const E = document.documentElement, B = f.solo && !f.main ? f.listening ? d(f.listening) : "new" : "", Y = b5() ? "1" : "";
    `${B}|${Y}` !== ue && (ue = `${B}|${Y}`, B ? E.dataset.pppSolo = B : delete E.dataset.pppSolo, Y ? E.dataset.pppWalletInstalled = Y : delete E.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => fe(o.snapshot()), f);
  function fe(f) {
    var en, Hn, is, os;
    if (u(), be(f), T(f), J(f), t.hidden = f.step === "off", t.hidden) return;
    const [E, B] = W(f), Y = n(".ppp-state");
    Y.textContent = E, Y.className = "ppp-state" + (B ? " ppp-state--" + B : ""), Y.hidden = !E;
    const ht = !!f.busy || f.armed, $t = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (ht || !["intro", "loading"].includes(f.step));
    r.hidden = !$t, r.classList.toggle("ppp-frame--rest", !ht && !U);
    const re = n(".ppp-frame-label");
    re.hidden = !0;
    const te = u5(f) ?? _;
    _ = te;
    const Xt = d5(f, te);
    n(".ppp-badge").hidden = !Xt;
    const Qe = n(".ppp-steps"), wr = n(".ppp-stage");
    Qe.hidden = wr.hidden = !Xt, te && Xt && (Qe.replaceChildren(...nl(f.solo).map((X, nt) => {
      const x = g("li", "", nt < te.at ? "done" : nt === te.at ? te.blocked ? "now blocked" : "now" : "");
      return x.append(g("span", nt < te.at ? "✓" : String(nt + 1), "n"), X), nt === te.at && x.setAttribute("aria-current", "step"), x;
    })), wr.textContent = te.caption, wr.className = "ppp-stage " + (te.at >= nl(f.solo).length ? "ppp-ok" : te.blocked ? "ppp-bad" : "ppp-cyan"));
    const _n = n(".ppp-facts"), de = [];
    f.main && ((en = f.gate) != null && en.here) && !f.solo && de.push(..._t("Your wallet", A(f.main), "ppp-addr-short"));
    const ve = () => {
      if (!f.listening) return;
      const X = w("Copy", () => {
        var nt;
        return void ((nt = navigator.clipboard) == null ? void 0 : nt.writeText(f.listening || ""));
      }, "tiny");
      de.push(..._t(f.linked ? "Listening wallet (technical)" : "Listening wallet", d(f.listening), "ppp-addr-short", X));
    };
    if (f.linked || ve(), f.listening && f.step !== "intro")
      if (f.linked)
        de.push(..._t("Credited to", `${A(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), ve();
      else if (f.solo) {
        const X = f.returnTo ? `${A(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        de.push(..._t("Returns go to", f.returnTo && !L(f.returnTo) ? X.replace(d(f.returnTo), f.returnTo) : X, f.returnTo ? "ppp-addr-full" : "ppp-mute"));
      } else de.push(..._t("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Hn = f.gate) != null && Hn.here)) {
      const X = f.linkedListening.map((nt) => d(nt) + (nt === f.listening ? " (this one)" : "")).join(", ");
      de.push(..._t(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", X, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const X = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      de.push(..._t("Balance", `${vn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, X));
    }
    const Je = f.entries.find((X) => X.kind === "play");
    Je && m(), Je && de.push(..._t("Last paid song", `${P(Je)} → ${A(Je.recipient)}`, G[Je.status] || "")), _n.replaceChildren(...de), _n.hidden = !de.length;
    const wt = [], Et = [], Ft = [], me = [], br = Gs(BigInt(((is = f.gate) == null ? void 0 : is.limits.playFee) ?? "300")), Jt = `Each song you listen to for 30 seconds sends ${vn(Jc)} STX to whoever holds it, plus a ${vn(br - Jc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Un = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (wt.push(g("p", "Pay artists as you listen.")), (os = f.gate) != null && os.radioUrl) {
          const nt = g("p");
          nt.append(v("Open the pay-per-play radio →", f.gate.radioUrl)), wt.push(nt);
        }
        Et.push(g("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const nt = [f.linked, ...f.others];
          wt.push(g("p", nt.length > 1 ? `This device has listening wallets for ${D(nt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${A(f.linked)}. Connect that wallet to keep paying artists.`)), Et.push(g("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          wt.push(g("p", "Connect your wallet to pay artists as you listen.")), Et.push(g("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        wt.push(g("p", `This device's listening wallet belongs to ${A(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Et.push(g("p", `You are connected as ${A(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Et.push(g("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Ft.push(w("Switch wallet", () => {
          var nt;
          return (nt = document.getElementById("radio-wallet-connect")) == null ? void 0 : nt.click();
        }, "primary"));
        break;
      case "not-invited":
        wt.push(g("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        wt.push(g("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        wt.push(g("p", `Pay artists ${vn(br)} STX a song as you listen.`)), Et.push(g("p", Jt)), Et.push(g("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Et.push(g("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (wt.push(g("p", `This device already has a listening wallet for ${D(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Et.push(g("p", `Otherwise, set up a new listening wallet for ${A(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Et.push(g("p", `This is the listening wallet for ${A(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Et.push(g("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const X = a.liveGift();
        Ft.push(w(X ? "Claim my gift · no wallet needed" : f.solo ? "Turn on pay-per-play · no wallet needed" : f.others.length && f.main ? `Set up for ${A(f.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !X && !f.solo && f.main && f.others.length && Ft.push(w("Switch wallet", () => {
          var nt;
          return (nt = document.getElementById("radio-wallet-connect")) == null ? void 0 : nt.click();
        })), !X && f.solo && Ft.push(w("I have a Stacks wallet", () => {
          var nt;
          return (nt = document.getElementById("radio-wallet-connect")) == null ? void 0 : nt.click();
        })), X || Ft.push(w("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        f.armed || (wt.push(g("p", "Locked.", "ppp-mute")), Ft.push(w(f.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), me.push(w("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        wt.push(g("p", `Link to ${A(f.main)} · free`)), Et.push(g("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Et.push(g("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Ft.push(w(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        wt.push(g("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending || (f.entries.length ? wt.push(g("p", "Out of funds · top up to keep paying", "ppp-bad")) : wt.push(g("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / br)).toLocaleString()} songs`))), f.entries.length && Et.push(g("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && Et.push(g("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), f.solo ? (Et.push(g("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Et.push(g("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Ft.push(w("Copy my address", () => {
          var nt;
          return void ((nt = navigator.clipboard) == null ? void 0 : nt.writeText(f.listening || ""));
        }, "primary"))) : Et.push(g("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const nt = g("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          nt.append(v("View", h(f.depositTxid))), wt.push(nt);
        } else f.allowance > 0n && !f.solo && Ft.push(w(`Deposit ${vn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        wt.push(g("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (wt.push(g("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), wt.push(Tt(f))), (!f.solo || f.returnTo) && Ft.push(w("Return excess", () => void o.returnFunds("excess"), "primary"), w("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const nt = Math.min(f.session.playsLeft, f.playsLeft);
          wt.push(g("p", `Paying as you listen · up to ${nt.toLocaleString()} plays left`, "ppp-ok")), Et.push(g("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Ft.push(w("Switch off", () => void o.switchOff()));
        } else
          wt.push(g("p", "Paying is off. Music stays free.", "ppp-mute")), Ft.push(w("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        f.queued && wt.push(g("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && wt.push(g("p", "Running low · top up", "ppp-warn")), f.depositPending ? wt.push(g("p", "Top-up on its way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Ft.push(w(`Top up ${vn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && Et.push(g("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && Et.push(Tt(f)), Et.push(Dt()), f.step === "ready" && f.entries.some((X) => X.kind === "play" && X.status === "confirmed"))) {
      const X = g("p", "New to Stacks? ", "ppp-mute");
      X.append(v("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), wt.push(X);
    }
    if (f.walletOutdated && Et.push(g("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (wt.push(g("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Ft.push(w("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && f.returnTo && (f.balance ?? 0n) > 0n && me.push(w(f.linked ? "Return all to my wallet" : `Return all to ${A(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && me.push(w("Lock", () => void o.lock(), "quiet")), $t && !ht && me.push(w(U ? "Hide listening wallet box" : "Show listening wallet box", () => {
      U = !U, fe(o.snapshot());
    }, "quiet")), [...Ft, ...me].forEach((X) => X.disabled = Un), Un && (Ft.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n)) {
      const X = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", nt = wt.at(0);
      f.step === "ready" && nt ? nt.append(g("span", ` · ${l(f.balance)} STX`, X)) : wt.push(g("p", `Balance ${l(f.balance)} STX`, X));
    }
    wt.unshift(...a.banner(f)), n(".ppp-key").replaceChildren(...wt);
    const Ne = a.renderFold(f);
    n(".ppp-gifts").hidden = !Ne, Ne && !n(".ppp-gift-body").contains(Ne) && n(".ppp-gift-body").replaceChildren(Ne), n(".ppp-body").replaceChildren(...Et), n(".ppp-actions").replaceChildren(...Ft), n(".ppp-actions2").replaceChildren(...me);
    const He = f.busy || f.message || "";
    n(".ppp-msg").textContent = He && wt.some((X) => (X.textContent ?? "").startsWith(He.replace(/[.✓\s]+$/, ""))) ? "" : He, n(".ppp-err").textContent = f.error;
    const Nn = f.entries.filter((X) => X.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...Nn.slice(0, 5).map((X) => {
      const nt = g("li"), x = X.status === "confirmed" ? "ok" : X.status === "failed" ? "bad" : "warn";
      return nt.append(g("span", "", "d " + x), g("span", P(X), "t"), g("span", y(X.created), "ppp-mute")), X.txid && nt.append(v("tx", h(X.txid))), nt;
    })), n(".ppp-wallets").hidden = !(_n.childElementCount || me.length), n(".ppp-more").hidden = !Et.length;
    const tn = n(".ppp-history");
    tn.hidden = !f.entries.length, f.entries.length && m(), tn.replaceChildren(g("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((X) => {
      const nt = g("div", "", "ppp-row"), x = X.kind === "play" ? [g("span", P(X), "ppp-song"), g("span", ` · ${vn(BigInt(X.amount))} STX to ${A(X.recipient)}`, "ppp-mute")] : X.kind === "like" ? [g("span", `${X.liked ? "♥ Liked" : "Unliked"} ${P(X)}`, "ppp-song"), g("span", ` · for ${f.linked ? A(f.linked) : "this listening wallet"}`, "ppp-mute")] : [g("span", `Returned ${vn(BigInt(X.amount))} STX`, "ppp-song"), g("span", ` to ${A(X.recipient)}`, "ppp-mute")];
      return nt.append(
        g("span", st[X.status] || X.status, "ppp-status " + (G[X.status] || "")),
        ...x,
        g("span", ` · ${new Date(X.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), X.txid && nt.append(v("tx ↗", h(X.txid))), nt;
    }));
  }
  const Gt = /* @__PURE__ */ new Map(), Wt = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((E) => {
      const B = E == null ? void 0 : E.nowPlaying;
      B && Number.isSafeInteger(Number(B.tokenId)) && Gt.set(Number(B.tokenId), { title: B.title || void 0, artist: B.artist || void 0 });
    }), !0) : !1;
  };
  if (!Wt()) {
    const f = setInterval(() => {
      Wt() && clearInterval(f);
    }, 500);
    setTimeout(() => clearInterval(f), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (f) => {
    const E = f.detail;
    if (E && Number.isSafeInteger(E.song) && typeof E.id == "string" && /^[0-9a-f]{32}$/.test(E.id)) {
      m();
      const B = I(E.song, Gt.get(E.song));
      o.onListened({ song: E.song, id: E.id, title: B.title || void 0, artist: B.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const l$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", u$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, f$ = () => u$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, d$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, h$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Lg = class {
  constructor(t) {
    fE(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Tm(t), this.callback(ia(t));
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
    const t = f$(), e = d$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return it("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, it("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), it("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, it("div", { class: "flex flex-col space-y-[10px]" }, it("div", { class: "flex items-center" }, it("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), it("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, it("span", { class: "sr-only" }, "Close popup"), it("img", { src: l$ }))), r ? it("p", null, "Select the wallet you want to connect to.") : it("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && it("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && it("div", { class: "mt-6" }, it("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), it("ul", { class: "space-y-3" }, this.installedProviders.map((i) => it("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, it("div", { class: "aspect-square basis-9 overflow-hidden" }, it("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), it("div", { class: "flex-1" }, it("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && it("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), it("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && it("div", { class: "mt-6" }, r ? it("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : it("div", { class: "mb-5 flex justify-between" }, it("p", { class: "text-sm font-medium" }, "Recommended wallets"), it("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, it("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, it("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), it("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), it("p", null, "What is a wallet? ", it("span", { class: "align-text-bottom text-[9px]" }, "↗")))), it("ul", { class: "space-y-3" }, n.map((i) => it("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, it("div", { class: "aspect-square basis-9 overflow-hidden" }, it("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), it("div", { class: "flex-1" }, it("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && it("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && it("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return V4(this);
  }
};
Lg.style = h$;
const p$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Lg
}, Symbol.toStringTag, { value: "Module" }));
