var Kb = Object.defineProperty;
var Vb = (e, t, n) => t in e ? Kb(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ya = (e, t, n) => Vb(e, typeof t != "symbol" ? t + "" : t, n);
var zn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ey(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Ml(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, o.get ? o : {
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
      typeof zn < "u" && zn || {}, r = {
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
      function o(m) {
        return m && DataView.prototype.isPrototypeOf(m);
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
        ], i = ArrayBuffer.isView || function(m) {
          return m && s.indexOf(Object.prototype.toString.call(m)) > -1;
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
            var N = m.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function h(m) {
        this.map = {}, m instanceof h ? m.forEach(function(I, N) {
          this.append(N, I);
        }, this) : Array.isArray(m) ? m.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(I) {
          this.append(I, m[I]);
        }, this);
      }
      h.prototype.append = function(m, I) {
        m = a(m), I = c(I);
        var N = this.map[m];
        this.map[m] = N ? N + ", " + I : I;
      }, h.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, h.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, h.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, h.prototype.set = function(m, I) {
        this.map[a(m)] = c(I);
      }, h.prototype.forEach = function(m, I) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && m.call(I, this.map[N], N, this);
      }, h.prototype.keys = function() {
        var m = [];
        return this.forEach(function(I, N) {
          m.push(N);
        }), u(m);
      }, h.prototype.values = function() {
        var m = [];
        return this.forEach(function(I) {
          m.push(I);
        }), u(m);
      }, h.prototype.entries = function() {
        var m = [];
        return this.forEach(function(I, N) {
          m.push([N, I]);
        }), u(m);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function d(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function w(m) {
        return new Promise(function(I, N) {
          m.onload = function() {
            I(m.result);
          }, m.onerror = function() {
            N(m.error);
          };
        });
      }
      function g(m) {
        var I = new FileReader(), N = w(I);
        return I.readAsArrayBuffer(m), N;
      }
      function v(m) {
        var I = new FileReader(), N = w(I), P = /charset=([A-Za-z0-9_-]+)/.exec(m.type), W = P ? P[1] : "utf-8";
        return I.readAsText(m, W), N;
      }
      function x(m) {
        for (var I = new Uint8Array(m), N = new Array(I.length), P = 0; P < I.length; P++)
          N[P] = String.fromCharCode(I[P]);
        return N.join("");
      }
      function L(m) {
        if (m.slice)
          return m.slice(0);
        var I = new Uint8Array(m.byteLength);
        return I.set(new Uint8Array(m)), I.buffer;
      }
      function B() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && o(m) ? (this._bodyArrayBuffer = L(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || i(m)) ? this._bodyArrayBuffer = L(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = d(this);
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
            var m = d(this);
            return m || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(g);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var m = d(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return v(this._bodyBlob);
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
      function A(m) {
        var I = m.toUpperCase();
        return U.indexOf(I) > -1 ? I : m;
      }
      function T(m, I) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var N = I.body;
        if (m instanceof T) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, I.headers || (this.headers = new h(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !N && m._bodyInit != null && (N = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new h(I.headers)), this.method = A(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var R = new AbortController();
            return R.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var P = /([?&])_=[^&]*/;
          if (P.test(this.url))
            this.url = this.url.replace(P, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var W = /\?/;
            this.url += (W.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      T.prototype.clone = function() {
        return new T(this, { body: this._bodyInit });
      };
      function _(m) {
        var I = new FormData();
        return m.trim().split("&").forEach(function(N) {
          if (N) {
            var P = N.split("="), W = P.shift().replace(/\+/g, " "), R = P.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(W), decodeURIComponent(R));
          }
        }), I;
      }
      function Y(m) {
        var I = new h(), N = m.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(P) {
          return P.indexOf(`
`) === 0 ? P.substr(1, P.length) : P;
        }).forEach(function(P) {
          var W = P.split(":"), R = W.shift().trim();
          if (R) {
            var le = W.join(":").trim();
            try {
              I.append(R, le);
            } catch (ue) {
              console.warn("Response " + ue.message);
            }
          }
        }), I;
      }
      B.call(T.prototype);
      function ce(m, I) {
        if (!(this instanceof ce))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new h(I.headers), this.url = I.url || "", this._initBody(m);
      }
      B.call(ce.prototype), ce.prototype.clone = function() {
        return new ce(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, ce.error = function() {
        var m = new ce(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var ne = [301, 302, 303, 307, 308];
      ce.redirect = function(m, I) {
        if (ne.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new ce(null, { status: I, headers: { location: m } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(I, N) {
          this.message = I, this.name = N;
          var P = Error(I);
          this.stack = P.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function q(m, I) {
        return new Promise(function(N, P) {
          var W = new T(m, I);
          if (W.signal && W.signal.aborted)
            return P(new t.DOMException("Aborted", "AbortError"));
          var R = new XMLHttpRequest();
          function le() {
            R.abort();
          }
          R.onload = function() {
            var C = {
              statusText: R.statusText,
              headers: Y(R.getAllResponseHeaders() || "")
            };
            W.url.indexOf("file://") === 0 && (R.status < 200 || R.status > 599) ? C.status = 200 : C.status = R.status, C.url = "responseURL" in R ? R.responseURL : C.headers.get("X-Request-URL");
            var F = "response" in R ? R.response : R.responseText;
            setTimeout(function() {
              N(new ce(F, C));
            }, 0);
          }, R.onerror = function() {
            setTimeout(function() {
              P(new TypeError("Network request failed"));
            }, 0);
          }, R.ontimeout = function() {
            setTimeout(function() {
              P(new TypeError("Network request timed out"));
            }, 0);
          }, R.onabort = function() {
            setTimeout(function() {
              P(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ue(C) {
            try {
              return C === "" && n.location.href ? n.location.href : C;
            } catch {
              return C;
            }
          }
          if (R.open(W.method, ue(W.url), !0), W.credentials === "include" ? R.withCredentials = !0 : W.credentials === "omit" && (R.withCredentials = !1), "responseType" in R && (r.blob ? R.responseType = "blob" : r.arrayBuffer && (R.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof h || n.Headers && I.headers instanceof n.Headers)) {
            var Xe = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(C) {
              Xe.push(a(C)), R.setRequestHeader(C, c(I.headers[C]));
            }), W.headers.forEach(function(C, F) {
              Xe.indexOf(F) === -1 && R.setRequestHeader(F, C);
            });
          } else
            W.headers.forEach(function(C, F) {
              R.setRequestHeader(F, C);
            });
          W.signal && (W.signal.addEventListener("abort", le), R.onreadystatechange = function() {
            R.readyState === 4 && W.signal.removeEventListener("abort", le);
          }), R.send(typeof W._bodyInit > "u" ? null : W._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = h, n.Request = T, n.Response = ce), t.Headers = h, t.Request = T, t.Response = ce, t.fetch = q, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : zn);
})();
const Xb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Yb(e, t) {
  const n = {};
  return Object.assign(n, Xb, t), await fetch(e, n);
}
function qb(e) {
  let t = Yb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Wb(...e) {
  const { fetchLib: t, middlewares: n } = qb(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
var Ri;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ri || (Ri = {}));
var Go;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Go || (Go = {}));
var sp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(sp || (sp = {}));
const Zb = "https://api.mainnet.hiro.so", Jb = "https://api.testnet.hiro.so", Qb = "http://localhost:3999", e1 = ["mainnet", "testnet", "devnet", "mocknet"];
let zi = class {
  constructor(t) {
    this.version = Go.Mainnet, this.chainId = Ri.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Go.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Wb();
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
zi.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new nd();
    case "testnet":
      return new t1();
    case "devnet":
      return new n1();
    case "mocknet":
      return new ty();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${e1.join(", ")}`);
  }
};
zi.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : zi.fromName(e);
let nd = class extends zi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Zb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Go.Mainnet, this.chainId = Ri.Mainnet;
  }
}, t1 = class extends zi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Jb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Go.Testnet, this.chainId = Ri.Testnet;
  }
}, ty = class extends zi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Qb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Go.Testnet, this.chainId = Ri.Testnet;
  }
};
const n1 = ty, ny = "xtrata.wallet.bridge.v1", r1 = (e) => typeof e == "object" && e !== null && e.protocol === ny, s1 = (e) => r1(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", o1 = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class wa extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const op = 12e4;
class i1 {
  constructor(t) {
    ya(this, "pending", /* @__PURE__ */ new Map());
    ya(this, "listenTarget");
    ya(this, "closed", !1);
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
    ya(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !s1(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new wa("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new wa("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new wa("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const o = o1(), s = { protocol: ny, kind: "request", id: o, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(o), a(
          new wa(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? op}ms.`
          )
        );
      }, this.options.timeoutMs ?? op);
      this.pending.set(o, { resolve: i, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new wa("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const a1 = ["SP", "SM"], c1 = ["ST", "SN"], l1 = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return a1.includes(n) ? "mainnet" : c1.includes(n) ? "testnet" : null;
}, u1 = () => {
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
}, d1 = () => typeof window > "u" || !window.localStorage ? u1() : window.localStorage, wu = "xtrata.v15.1.wallet.session", ip = "mainnet", tl = { isConnected: !1 }, f1 = (e) => e.address ? l1(e.address) ?? e.network : e.network, ry = (e) => !e.isConnected || !e.address ? { ...tl } : f1(e) !== ip ? { ...tl } : {
  isConnected: !0,
  address: e.address,
  network: ip,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, h1 = (e) => {
  if (!e)
    return { ...tl };
  try {
    const t = JSON.parse(e);
    return ry(t);
  } catch {
    return { ...tl };
  }
}, p1 = (e) => {
  const t = ry(e);
  return JSON.stringify(t);
}, g1 = (e) => {
  const t = d1();
  return {
    load: () => h1(t.getItem(wu)),
    save: (n) => {
      t.setItem(wu, p1(n));
    },
    clear: () => {
      t.removeItem(wu);
    }
  };
}, y1 = "https://browser.blockstack.org/auth", w1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, sy = ["store_write"], m1 = "blockstack-session", b1 = {
  logLevel: "debug"
}, ii = {
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
Object.freeze(ii);
class ia extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, o = this.stack;
    if (o)
      r += `Stack Trace:
${o}`;
    else
      try {
        throw new Error();
      } catch (s) {
        o = s.stack;
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
class x1 extends ia {
  constructor(t, n = "") {
    super({ code: ii.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class ap extends ia {
  constructor(t = "") {
    super({ code: ii.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class lc extends ia {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: ii.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class cp extends ia {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: ii.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class rd extends ia {
  constructor(t) {
    super({ code: ii.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class oy extends ia {
  constructor(t) {
    super({ code: ii.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const lp = ["debug", "info", "warn", "error", "none"], sd = {};
for (let e = 0; e < lp.length; e++) {
  const t = lp[e];
  sd[t] = e;
}
class Mi {
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
    return sd[b1.logLevel] <= sd[t];
  }
}
function S1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function v1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function mu(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((o) => parseInt(o, 10)), r = t.split(".").map((o) => parseInt(o, 10));
  for (let o = 0; o < t.length; o++)
    if (o >= e.length && r.push(0), n[o] < r[o])
      return !1;
  return !0;
}
function A1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function E1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function k1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function ff(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let o;
  try {
    if (o = E1(), o) {
      const s = o[e];
      if (s)
        return s;
    }
  } catch (s) {
    Mi.error(`Error getting object '${e}' from global scope '${o}': ${s}`);
  }
  if (t) {
    const s = k1(o, e.toString(), n);
    throw Mi.error(s), new Error(s);
  }
  if (r)
    return {};
}
function yo(e, t) {
  return hf(Hn(e), t);
}
function Hn(e) {
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
  if (Qn(e, Uint8Array))
    return BigInt(`0x${Oe(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function $1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function up(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function qa(e, t = 8) {
  return (typeof e == "bigint" ? e : Hn(e)).toString(16).padStart(t * 2, "0");
}
function Pl(e) {
  return parseInt(e, 16);
}
function hf(e, t = 16) {
  const n = qa(e, t);
  return bt(n);
}
function I1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function L1(e, t) {
  return e & BigInt(1) << t;
}
function od(e) {
  return C1(BigInt(`0x${Oe(e)}`), BigInt(e.byteLength * 8));
}
function C1(e, t) {
  return L1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const T1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Oe(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += T1[n];
  return t;
}
function bt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = $1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, o = e.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function ai(e) {
  return new TextEncoder().encode(e);
}
function Wa(e) {
  return new TextDecoder().decode(e);
}
function B1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function N1(e) {
  return String.fromCharCode.apply(null, e);
}
function M1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function dp(e) {
  if (e.some(M1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function ss(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function cn(e) {
  return ss(...e.map((t) => typeof t == "number" ? dp([t]) : t instanceof Array ? dp(t) : t));
}
function Qn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const iy = "https://api.mainnet.hiro.so", ay = "https://api.testnet.hiro.so", cy = "http://localhost:3999", P1 = "https://hub.blockstack.org", _1 = 33, bu = 32;
function U1(e) {
  if (e.length < bu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + bu * 2), r = e.slice(2 + bu * 2);
  return {
    recoveryId: Pl(t),
    r: n,
    s: r
  };
}
function pf(e) {
  const t = typeof e == "string" ? bt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function O1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function H1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function D1(e, t) {
  return e[t];
}
function F1(e, t, n = 0) {
  return e[n] = t, e;
}
function j1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Ko(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const R1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function z1(e, t) {
  const n = {};
  return Object.assign(n, R1, t), await fetch(e, n);
}
function G1(e) {
  let t = z1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function K1(...e) {
  const { fetchLib: t, middlewares: n } = G1(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
class ly {
  constructor(t = sy.slice(), n = ((a) => (a = ff("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", o = "/manifest.json", s = void 0, i = y1) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = o, this.coreNode = s, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function id(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function V1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function uy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function X1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  id(e.outputLen), id(e.blockLen);
}
function Y1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function q1(e, t) {
  uy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Po = {
  number: id,
  bool: V1,
  bytes: uy,
  hash: X1,
  exists: Y1,
  output: q1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const xu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Xr = (e, t) => e << 32 - t | e >>> t, W1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!W1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Z1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function gf(e) {
  if (typeof e == "string" && (e = Z1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let dy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ci(e) {
  const t = (r) => e().update(gf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let fy = class extends dy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Po.hash(t);
    const r = gf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Po.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Po.exists(this), Po.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const _l = (e, t, n) => new fy(e, t).update(n).digest();
_l.create = (e, t) => new fy(e, t);
function J1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let yf = class extends dy {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = xu(this.buffer);
  }
  update(t) {
    Po.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = gf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = xu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Po.exists(this), Po.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    J1(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = xu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const Q1 = (e, t, n) => e & t ^ ~e & n, e2 = (e, t, n) => e & t ^ e & n ^ t & n, t2 = new Uint32Array([
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
let hy = class extends yf {
  constructor() {
    super(64, 32, 8, !1), this.A = Os[0] | 0, this.B = Os[1] | 0, this.C = Os[2] | 0, this.D = Os[3] | 0, this.E = Os[4] | 0, this.F = Os[5] | 0, this.G = Os[6] | 0, this.H = Os[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Hs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Hs[d - 15], g = Hs[d - 2], v = Xr(w, 7) ^ Xr(w, 18) ^ w >>> 3, x = Xr(g, 17) ^ Xr(g, 19) ^ g >>> 10;
      Hs[d] = x + Hs[d - 7] + v + Hs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Xr(a, 6) ^ Xr(a, 11) ^ Xr(a, 25), g = h + w + Q1(a, c, u) + t2[d] + Hs[d] | 0, x = (Xr(r, 2) ^ Xr(r, 13) ^ Xr(r, 22)) + e2(r, o, s) | 0;
      h = u, u = c, c = a, a = i + g | 0, i = s, s = o, o = r, r = g + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    Hs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, n2 = class extends hy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Gi = ci(() => new hy());
ci(() => new n2());
const r2 = {}, py = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: r2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const yt = BigInt(0), zt = BigInt(1), uo = BigInt(2), Ca = BigInt(3), fp = BigInt(8), Tt = Object.freeze({
  a: yt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: zt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), hp = (e, t) => (e + t / uo) / t, uc = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = Tt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -zt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), o = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, i = BigInt("0x100000000000000000000000000000000"), a = hp(s * e, t), c = hp(-r * e, t);
    let u = ye(e - a * n - c * o, t), h = ye(-a * r - c * s, t);
    const d = u > i, w = h > i;
    if (d && (u = t - u), w && (h = t - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: w, k2: h };
  }
}, Hr = 32, Vo = 32, gy = 32, nl = Hr + 1, rl = 2 * Hr + 1;
function pp(e) {
  const { a: t, b: n } = Tt, r = ye(e * e), o = ye(r * e);
  return ye(o + t * e + n);
}
const dc = Tt.a === yt;
class wf extends Error {
  constructor(t) {
    super(t);
  }
}
function gp(e) {
  if (!(e instanceof At))
    throw new TypeError("JacobianPoint expected");
}
class At {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof at))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(at.ZERO) ? At.ZERO : new At(t.x, t.y, zt);
  }
  static toAffineBatch(t) {
    const n = c2(t.map((r) => r.z));
    return t.map((r, o) => r.toAffine(n[o]));
  }
  static normalizeZ(t) {
    return At.toAffineBatch(t).map(At.fromAffine);
  }
  equals(t) {
    gp(t);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = t, c = ye(o * o), u = ye(a * a), h = ye(n * u), d = ye(s * c), w = ye(ye(r * a) * u), g = ye(ye(i * o) * c);
    return h === d && w === g;
  }
  negate() {
    return new At(this.x, ye(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, o = ye(t * t), s = ye(n * n), i = ye(s * s), a = t + s, c = ye(uo * (ye(a * a) - o - i)), u = ye(Ca * o), h = ye(u * u), d = ye(h - uo * c), w = ye(u * (c - d) - fp * i), g = ye(uo * n * r);
    return new At(d, w, g);
  }
  add(t) {
    gp(t);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = t;
    if (s === yt || i === yt)
      return this;
    if (n === yt || r === yt)
      return t;
    const c = ye(o * o), u = ye(a * a), h = ye(n * u), d = ye(s * c), w = ye(ye(r * a) * u), g = ye(ye(i * o) * c), v = ye(d - h), x = ye(g - w);
    if (v === yt)
      return x === yt ? this.double() : At.ZERO;
    const L = ye(v * v), B = ye(v * L), U = ye(h * L), A = ye(x * x - B - uo * U), T = ye(x * (U - A) - w * B), _ = ye(o * a * v);
    return new At(A, T, _);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = At.ZERO;
    if (typeof t == "bigint" && t === yt)
      return n;
    let r = mp(t);
    if (r === zt)
      return this;
    if (!dc) {
      let d = n, w = this;
      for (; r > yt; )
        r & zt && (d = d.add(w)), w = w.double(), r >>= zt;
      return d;
    }
    let { k1neg: o, k1: s, k2neg: i, k2: a } = uc.splitScalar(r), c = n, u = n, h = this;
    for (; s > yt || a > yt; )
      s & zt && (c = c.add(h)), a & zt && (u = u.add(h)), h = h.double(), s >>= zt, a >>= zt;
    return o && (c = c.negate()), i && (u = u.negate()), u = new At(ye(u.x * uc.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(t) {
    const n = dc ? 128 / t + 1 : 256 / t + 1, r = [];
    let o = this, s = o;
    for (let i = 0; i < n; i++) {
      s = o, r.push(s);
      for (let a = 1; a < 2 ** (t - 1); a++)
        s = s.add(o), r.push(s);
      o = s.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(At.BASE) && (n = at.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let o = n && ad.get(n);
    o || (o = this.precomputeWindow(r), n && r !== 1 && (o = At.normalizeZ(o), ad.set(n, o)));
    let s = At.ZERO, i = At.BASE;
    const a = 1 + (dc ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let w = 0; w < a; w++) {
      const g = w * c;
      let v = Number(t & u);
      t >>= d, v > c && (v -= h, t += zt);
      const x = g, L = g + Math.abs(v) - 1, B = w % 2 !== 0, U = v < 0;
      v === 0 ? i = i.add(fc(B, o[x])) : s = s.add(fc(U, o[L]));
    }
    return { p: s, f: i };
  }
  multiply(t, n) {
    let r = mp(t), o, s;
    if (dc) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = uc.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: w, f: g } = this.wNAF(u, n);
      h = fc(i, h), w = fc(c, w), w = new At(ye(w.x * uc.beta), w.y, w.z), o = h.add(w), s = d.add(g);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      o = i, s = a;
    }
    return At.normalizeZ([o, s])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: o } = this, s = this.equals(At.ZERO);
    t == null && (t = s ? fp : aa(o));
    const i = t, a = ye(i * i), c = ye(a * i), u = ye(n * a), h = ye(r * c), d = ye(o * i);
    if (s)
      return at.ZERO;
    if (d !== zt)
      throw new Error("invZ was invalid");
    return new at(u, h);
  }
}
At.BASE = new At(Tt.Gx, Tt.Gy, zt);
At.ZERO = new At(yt, zt, yt);
function fc(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const ad = /* @__PURE__ */ new WeakMap();
class at {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, ad.delete(this);
  }
  hasEvenY() {
    return this.y % uo === yt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = gr(n ? t : t.subarray(1));
    if (!Gc(r))
      throw new Error("Point is not on curve");
    const o = pp(r);
    let s = a2(o);
    const i = (s & zt) === zt;
    n ? i && (s = ye(-s)) : (t[0] & 1) === 1 !== i && (s = ye(-s));
    const a = new at(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = gr(t.subarray(1, Hr + 1)), r = gr(t.subarray(Hr + 1, Hr * 2 + 1)), o = new at(n, r);
    return o.assertValidity(), o;
  }
  static fromHex(t) {
    const n = os(t), r = n.length, o = n[0];
    if (r === Hr)
      return this.fromCompressedHex(n);
    if (r === nl && (o === 2 || o === 3))
      return this.fromCompressedHex(n);
    if (r === rl && o === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${nl} compressed bytes or ${rl} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return at.BASE.multiply(Xo(t));
  }
  static fromSignature(t, n, r) {
    const { r: o, s } = my(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = mf(os(t)), { n: a } = Tt, c = r === 2 || r === 3 ? o + a : o, u = aa(c, a), h = ye(-i * u, a), d = ye(s * u, a), w = r & 1 ? "03" : "02", g = at.fromHex(w + fo(c)), v = at.BASE.multiplyAndAddUnsafe(g, h, d);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return ho(this.toHex(t));
  }
  toHex(t = !1) {
    const n = fo(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${fo(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Gc(n) || !Gc(r))
      throw new Error(t);
    const o = ye(r * r), s = pp(n);
    if (ye(o - s) !== yt)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new at(this.x, ye(-this.y));
  }
  double() {
    return At.fromAffine(this).double().toAffine();
  }
  add(t) {
    return At.fromAffine(this).add(At.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return At.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const o = At.fromAffine(this), s = n === yt || n === zt || this !== at.BASE ? o.multiplyUnsafe(n) : o.multiply(n), i = At.fromAffine(t).multiplyUnsafe(r), a = s.add(i);
    return a.equals(At.ZERO) ? void 0 : a.toAffine();
  }
}
at.BASE = new at(Tt.Gx, Tt.Gy);
at.ZERO = new at(yt, yt);
function yp(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function wp(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ki(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: gr(n), left: e.subarray(t + 2) };
}
function s2(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Ki(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = wp(e.subarray(2)), { data: r, left: o } = wp(n);
  if (o.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ki(o)}`);
  return { r: t, s: r };
}
class pr {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const o = n ? Ki(t) : t;
    if (o.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new pr(sl(o.slice(0, 64)), sl(o.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: o } = s2(n ? t : ho(t));
    return new pr(r, o);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Xi(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Xi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = Tt.n >> zt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new pr(this.r, ye(-this.s, Tt.n)) : this;
  }
  toDERRawBytes() {
    return ho(this.toDERHex());
  }
  toDERHex() {
    const t = yp(ma(this.s)), n = yp(ma(this.r)), r = t.length / 2, o = n.length / 2, s = ma(r), i = ma(o);
    return `30${ma(o + r + 4)}02${i}${n}02${s}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return ho(this.toCompactHex());
  }
  toCompactHex() {
    return fo(this.r) + fo(this.s);
  }
}
function co(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
const o2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Ki(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += o2[e[n]];
  return t;
}
const i2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function fo(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(yt <= e && e < i2))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Vi(e) {
  const t = ho(fo(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function ma(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function sl(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function ho(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, o = e.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function gr(e) {
  return sl(Ki(e));
}
function os(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : ho(e);
}
function mp(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Xi(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ye(e, t = Tt.P) {
  const n = e % t;
  return n >= yt ? n : t + n;
}
function xr(e, t) {
  const { P: n } = Tt;
  let r = e;
  for (; t-- > yt; )
    r *= r, r %= n;
  return r;
}
function a2(e) {
  const { P: t } = Tt, n = BigInt(6), r = BigInt(11), o = BigInt(22), s = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, h = xr(u, Ca) * u % t, d = xr(h, Ca) * u % t, w = xr(d, uo) * c % t, g = xr(w, r) * w % t, v = xr(g, o) * g % t, x = xr(v, i) * v % t, L = xr(x, a) * x % t, B = xr(L, i) * v % t, U = xr(B, Ca) * u % t, A = xr(U, s) * g % t, T = xr(A, n) * c % t, _ = xr(T, uo);
  if (_ * _ % t !== e)
    throw new Error("Cannot find square root");
  return _;
}
function aa(e, t = Tt.P) {
  if (e === yt || t <= yt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = ye(e, t), r = t, o = yt, s = zt;
  for (; n !== yt; ) {
    const a = r / n, c = r % n, u = o - s * a;
    r = n, n = c, o = s, s = u;
  }
  if (r !== zt)
    throw new Error("invert: does not exist");
  return ye(o, t);
}
function c2(e, t = Tt.P) {
  const n = new Array(e.length), r = e.reduce((s, i, a) => i === yt ? s : (n[a] = s, ye(s * i, t)), zt), o = aa(r, t);
  return e.reduceRight((s, i, a) => i === yt ? s : (n[a] = ye(s * n[a], t), ye(s * i, t)), o), n;
}
function l2(e) {
  const t = e.length * 8 - Vo * 8, n = gr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function mf(e, t = !1) {
  const n = l2(e);
  if (t)
    return n;
  const { n: r } = Tt;
  return n >= r ? n - r : n;
}
let Fi, Ta;
class yy {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return rn.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return Ta(this.k, ...t);
  }
  checkSync() {
    if (typeof Ta != "function")
      throw new wf("hmacSha256Sync needs to be set");
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
    return co(...n);
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
    return co(...n);
  }
}
function Xi(e) {
  return yt < e && e < Tt.n;
}
function Gc(e) {
  return yt < e && e < Tt.P;
}
function wy(e, t, n, r = !0) {
  const { n: o } = Tt, s = mf(e, !0);
  if (!Xi(s))
    return;
  const i = aa(s, o), a = at.BASE.multiply(s), c = ye(a.x, o);
  if (c === yt)
    return;
  const u = ye(i * ye(t + n * c, o), o);
  if (u === yt)
    return;
  let h = new pr(c, u), d = (a.x === h.r ? 0 : 2) | Number(a.y & zt);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function Xo(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Vo)
      throw new Error("Expected 32 bytes of private key");
    t = sl(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Vo)
      throw new Error("Expected 32 bytes of private key");
    t = gr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Xi(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function bf(e) {
  return e instanceof at ? (e.assertValidity(), e) : at.fromHex(e);
}
function my(e) {
  if (e instanceof pr)
    return e.assertValidity(), e;
  try {
    return pr.fromDER(e);
  } catch {
    return pr.fromCompact(e);
  }
}
function Za(e, t = !1) {
  return at.fromPrivateKey(e).toRawBytes(t);
}
function u2(e, t, n, r = !1) {
  return at.fromSignature(e, t, n).toRawBytes(r);
}
function bp(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === nl || r === rl : n ? r === nl * 2 || r === rl * 2 : e instanceof at;
}
function xf(e, t, n = !1) {
  if (bp(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!bp(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = bf(t);
  return r.assertValidity(), r.multiply(Xo(e)).toRawBytes(n);
}
function by(e) {
  const t = e.length > Hr ? e.slice(0, Hr) : e;
  return gr(t);
}
function d2(e) {
  const t = by(e), n = ye(t, Tt.n);
  return xy(n < yt ? t : n);
}
function xy(e) {
  return Vi(e);
}
function Sy(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = os(e), o = Xo(t), s = [xy(o), d2(r)];
  if (n != null) {
    n === !0 && (n = rn.randomBytes(Hr));
    const c = os(n);
    if (c.length !== Hr)
      throw new Error(`sign: Expected ${Hr} bytes of extra data`);
    s.push(c);
  }
  const i = co(...s), a = by(r);
  return { seed: i, m: a, d: o };
}
function vy(e, t) {
  const { sig: n, recovery: r } = e, { der: o, recovered: s } = Object.assign({ canonical: !0, der: !0 }, t), i = o ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [i, r] : i;
}
async function f2(e, t, n = {}) {
  const { seed: r, m: o, d: s } = Sy(e, t, n.extraEntropy), i = new yy(gy, Vo);
  await i.reseed(r);
  let a;
  for (; !(a = wy(await i.generate(), o, s, n.canonical)); )
    await i.reseed();
  return vy(a, n);
}
function Ul(e, t, n = {}) {
  const { seed: r, m: o, d: s } = Sy(e, t, n.extraEntropy), i = new yy(gy, Vo);
  i.reseedSync(r);
  let a;
  for (; !(a = wy(i.generateSync(), o, s, n.canonical)); )
    i.reseedSync();
  return vy(a, n);
}
const h2 = { strict: !0 };
function p2(e, t, n, r = h2) {
  let o;
  try {
    o = my(e), t = os(t);
  } catch {
    return !1;
  }
  const { r: s, s: i } = o;
  if (r.strict && o.hasHighS())
    return !1;
  const a = mf(t);
  let c;
  try {
    c = bf(n);
  } catch {
    return !1;
  }
  const { n: u } = Tt, h = aa(i, u), d = ye(a * h, u), w = ye(s * h, u), g = at.BASE.multiplyAndAddUnsafe(c, d, w);
  return g ? ye(g.x, u) === s : !1;
}
function ol(e) {
  return ye(gr(e), Tt.n);
}
class Yi {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = os(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = gr(n.subarray(0, 32)), o = gr(n.subarray(32, 64));
    return new Yi(r, o);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Gc(t) || !Xi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return fo(this.r) + fo(this.s);
  }
  toRawBytes() {
    return ho(this.toHex());
  }
}
function g2(e) {
  return at.fromPrivateKey(e).toRawX();
}
class Ay {
  constructor(t, n, r = rn.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = os(t);
    const { x: o, scalar: s } = this.getScalar(Xo(n));
    if (this.px = o, this.d = s, this.rand = os(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = at.fromPrivateKey(t), r = n.hasEvenY() ? t : Tt.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Vi(t ^ gr(n));
  }
  finalizeNonce(t) {
    const n = ye(gr(t), Tt.n);
    if (n === yt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: o, scalar: s } = this.getScalar(n);
    return { R: r, rx: o, k: s };
  }
  finalizeSig(t, n, r, o) {
    return new Yi(t.x, ye(n + r * o, Tt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: o } = this, s = rn.taggedHash, i = this.initNonce(n, await s(ao.aux, o)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(ao.nonce, i, r, t)), h = ol(await s(ao.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return await $y(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: o } = this, s = rn.taggedHashSync, i = this.initNonce(n, s(ao.aux, o)), { R: a, rx: c, k: u } = this.finalizeNonce(s(ao.nonce, i, r, t)), h = ol(s(ao.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return Iy(d, t, r) || this.error(), d;
  }
}
async function y2(e, t, n) {
  return new Ay(e, t, n).calc();
}
function w2(e, t, n) {
  return new Ay(e, t, n).calcSync();
}
function Ey(e, t, n) {
  const r = e instanceof Yi, o = r ? e : Yi.fromHex(e);
  return r && o.assertValidity(), {
    ...o,
    m: os(t),
    P: bf(n)
  };
}
function ky(e, t, n, r) {
  const o = at.BASE.multiplyAndAddUnsafe(t, Xo(n), ye(-r, Tt.n));
  return !(!o || !o.hasEvenY() || o.x !== e);
}
async function $y(e, t, n) {
  try {
    const { r, s: o, m: s, P: i } = Ey(e, t, n), a = ol(await rn.taggedHash(ao.challenge, Vi(r), i.toRawX(), s));
    return ky(r, i, o, a);
  } catch {
    return !1;
  }
}
function Iy(e, t, n) {
  try {
    const { r, s: o, m: s, P: i } = Ey(e, t, n), a = ol(rn.taggedHashSync(ao.challenge, Vi(r), i.toRawX(), s));
    return ky(r, i, o, a);
  } catch (r) {
    if (r instanceof wf)
      throw r;
    return !1;
  }
}
const m2 = {
  Signature: Yi,
  getPublicKey: g2,
  sign: y2,
  verify: $y,
  signSync: w2,
  verifySync: Iy
};
at.BASE._setWindowSize(8);
const ar = {
  node: py,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ao = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, hc = {}, rn = {
  bytesToHex: Ki,
  hexToBytes: ho,
  concatBytes: co,
  mod: ye,
  invert: aa,
  isValidPrivateKey(e) {
    try {
      return Xo(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Vi,
  _normalizePrivateKey: Xo,
  hashToPrivateKey: (e) => {
    e = os(e);
    const t = Vo + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ye(gr(e), Tt.n - zt) + zt;
    return Vi(n);
  },
  randomBytes: (e = 32) => {
    if (ar.web)
      return ar.web.getRandomValues(new Uint8Array(e));
    if (ar.node) {
      const { randomBytes: t } = ar.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => rn.hashToPrivateKey(rn.randomBytes(Vo + 8)),
  precompute(e = 8, t = at.BASE) {
    const n = t === at.BASE ? t : new at(t.x, t.y);
    return n._setWindowSize(e), n.multiply(Ca), n;
  },
  sha256: async (...e) => {
    if (ar.web) {
      const t = await ar.web.subtle.digest("SHA-256", co(...e));
      return new Uint8Array(t);
    } else if (ar.node) {
      const { createHash: t } = ar.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (ar.web) {
      const n = await ar.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = co(...t), o = await ar.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(o);
    } else if (ar.node) {
      const { createHmac: n } = ar.node, r = n("sha256", e);
      return t.forEach((o) => r.update(o)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = hc[e];
    if (n === void 0) {
      const r = await rn.sha256(Uint8Array.from(e, (o) => o.charCodeAt(0)));
      n = co(r, r), hc[e] = n;
    }
    return rn.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Fi != "function")
      throw new wf("sha256Sync is undefined, you need to set it");
    let n = hc[e];
    if (n === void 0) {
      const r = Fi(Uint8Array.from(e, (o) => o.charCodeAt(0)));
      n = co(r, r), hc[e] = n;
    }
    return Fi(n, ...t);
  },
  _JacobianPoint: At
};
Object.defineProperties(rn, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Fi;
    },
    set(e) {
      Fi || (Fi = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ta;
    },
    set(e) {
      Ta || (Ta = e);
    }
  }
});
const b2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Tt,
  Point: at,
  Signature: pr,
  getPublicKey: Za,
  getSharedSecret: xf,
  recoverPublicKey: u2,
  schnorr: m2,
  sign: f2,
  signSync: Ul,
  utils: rn,
  verify: p2
}, Symbol.toStringTag, { value: "Module" }));
var Ja = {};
Ja.byteLength = E2;
var x2 = Ja.toByteArray = $2, S2 = Ja.fromByteArray = C2, Jr = [], Ar = [], v2 = typeof Uint8Array < "u" ? Uint8Array : Array, Su = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ki = 0, A2 = Su.length; ki < A2; ++ki)
  Jr[ki] = Su[ki], Ar[Su.charCodeAt(ki)] = ki;
Ar[45] = 62;
Ar[95] = 63;
function Ly(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function E2(e) {
  var t = Ly(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function k2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function $2(e) {
  var t, n = Ly(e), r = n[0], o = n[1], s = new v2(k2(e, r, o)), i = 0, a = o > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = Ar[e.charCodeAt(c)] << 18 | Ar[e.charCodeAt(c + 1)] << 12 | Ar[e.charCodeAt(c + 2)] << 6 | Ar[e.charCodeAt(c + 3)], s[i++] = t >> 16 & 255, s[i++] = t >> 8 & 255, s[i++] = t & 255;
  return o === 2 && (t = Ar[e.charCodeAt(c)] << 2 | Ar[e.charCodeAt(c + 1)] >> 4, s[i++] = t & 255), o === 1 && (t = Ar[e.charCodeAt(c)] << 10 | Ar[e.charCodeAt(c + 1)] << 4 | Ar[e.charCodeAt(c + 2)] >> 2, s[i++] = t >> 8 & 255, s[i++] = t & 255), s;
}
function I2(e) {
  return Jr[e >> 18 & 63] + Jr[e >> 12 & 63] + Jr[e >> 6 & 63] + Jr[e & 63];
}
function L2(e, t, n) {
  for (var r, o = [], s = t; s < n; s += 3)
    r = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (e[s + 2] & 255), o.push(I2(r));
  return o.join("");
}
function C2(e) {
  for (var t, n = e.length, r = n % 3, o = [], s = 16383, i = 0, a = n - r; i < a; i += s)
    o.push(L2(e, i, i + s > a ? a : i + s));
  return r === 1 ? (t = e[n - 1], o.push(
    Jr[t >> 2] + Jr[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], o.push(
    Jr[t >> 10] + Jr[t >> 4 & 63] + Jr[t << 2 & 63] + "="
  )), o.join("");
}
function T2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const B2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function N2() {
  if (T2())
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
    throw new Error(B2);
  }
}
class M2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, o) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const s = this.createCipher(t, n, r), i = new Uint8Array(ss(s.update(o), s.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, o) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const s = this.createDecipher(t, n, r), i = new Uint8Array(ss(s.update(o), s.final()));
    return Promise.resolve(i);
  }
}
class P2 {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, o) {
    let s, i;
    if (t === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: s, iv: r }, a, o);
    return new Uint8Array(c);
  }
  async decrypt(t, n, r, o) {
    let s, i;
    if (t === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: s, iv: r }, a, o);
    return new Uint8Array(c);
  }
}
async function Cy() {
  const e = await N2();
  return e.name === "subtleCrypto" ? new P2(e.lib) : new M2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function _2(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var o = e.charAt(r), s = o.charCodeAt(0);
    if (t[s] !== 255)
      throw new TypeError(o + " is ambiguous");
    t[s] = r;
  }
  var i = e.length, a = e.charAt(0), c = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function h(g) {
    if (g instanceof Uint8Array || (ArrayBuffer.isView(g) ? g = new Uint8Array(g.buffer, g.byteOffset, g.byteLength) : Array.isArray(g) && (g = Uint8Array.from(g))), !(g instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (g.length === 0)
      return "";
    for (var v = 0, x = 0, L = 0, B = g.length; L !== B && g[L] === 0; )
      L++, v++;
    for (var U = (B - L) * u + 1 >>> 0, A = new Uint8Array(U); L !== B; ) {
      for (var T = g[L], _ = 0, Y = U - 1; (T !== 0 || _ < x) && Y !== -1; Y--, _++)
        T += 256 * A[Y] >>> 0, A[Y] = T % i >>> 0, T = T / i >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      x = _, L++;
    }
    for (var ce = U - x; ce !== U && A[ce] === 0; )
      ce++;
    for (var ne = a.repeat(v); ce < U; ++ce)
      ne += e.charAt(A[ce]);
    return ne;
  }
  function d(g) {
    if (typeof g != "string")
      throw new TypeError("Expected String");
    if (g.length === 0)
      return new Uint8Array();
    for (var v = 0, x = 0, L = 0; g[v] === a; )
      x++, v++;
    for (var B = (g.length - v) * c + 1 >>> 0, U = new Uint8Array(B); g[v]; ) {
      var A = g.charCodeAt(v);
      if (A > 255)
        return;
      var T = t[A];
      if (T === 255)
        return;
      for (var _ = 0, Y = B - 1; (T !== 0 || _ < L) && Y !== -1; Y--, _++)
        T += i * U[Y] >>> 0, U[Y] = T % 256 >>> 0, T = T / 256 >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      L = _, v++;
    }
    for (var ce = B - L; ce !== B && U[ce] === 0; )
      ce++;
    for (var ne = new Uint8Array(x + (B - ce)), q = x; ce !== B; )
      ne[q++] = U[ce++];
    return ne;
  }
  function w(g) {
    var v = d(g);
    if (v)
      return v;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: d,
    decode: w
  };
}
var Ty = _2;
const U2 = Ty, O2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var H2 = U2(O2);
const D2 = /* @__PURE__ */ ey(H2), F2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), By = Uint8Array.from({ length: 16 }, (e, t) => t), j2 = By.map((e) => (9 * e + 5) % 16);
let Sf = [By], vf = [j2];
for (let e = 0; e < 4; e++)
  for (let t of [Sf, vf])
    t.push(t[e].map((n) => F2[n]));
const Ny = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), R2 = Sf.map((e, t) => e.map((n) => Ny[t][n])), z2 = vf.map((e, t) => e.map((n) => Ny[t][n])), G2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), K2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), pc = (e, t) => e << t | e >>> 32 - t;
function xp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const gc = new Uint32Array(16);
let V2 = class extends yf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let g = 0; g < 16; g++, n += 4)
      gc[g] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let g = 0; g < 5; g++) {
      const v = 4 - g, x = G2[g], L = K2[g], B = Sf[g], U = vf[g], A = R2[g], T = z2[g];
      for (let _ = 0; _ < 16; _++) {
        const Y = pc(r + xp(g, s, a, u) + gc[B[_]] + x, A[_]) + d | 0;
        r = d, d = u, u = pc(a, 10) | 0, a = s, s = Y;
      }
      for (let _ = 0; _ < 16; _++) {
        const Y = pc(o + xp(v, i, c, h) + gc[U[_]] + L, T[_]) + w | 0;
        o = w, w = h, h = pc(c, 10) | 0, c = i, i = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    gc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const X2 = ci(() => new V2());
function Y2(e) {
  return X2(e);
}
const yc = BigInt(2 ** 32 - 1), cd = BigInt(32);
function My(e, t = !1) {
  return t ? { h: Number(e & yc), l: Number(e >> cd & yc) } : { h: Number(e >> cd & yc) | 0, l: Number(e & yc) | 0 };
}
function q2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = My(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const W2 = (e, t) => BigInt(e >>> 0) << cd | BigInt(t >>> 0), Z2 = (e, t, n) => e >>> n, J2 = (e, t, n) => e << 32 - n | t >>> n, Q2 = (e, t, n) => e >>> n | t << 32 - n, ex = (e, t, n) => e << 32 - n | t >>> n, tx = (e, t, n) => e << 64 - n | t >>> n - 32, nx = (e, t, n) => e >>> n - 32 | t << 64 - n, rx = (e, t) => t, sx = (e, t) => e, ox = (e, t, n) => e << n | t >>> 32 - n, ix = (e, t, n) => t << n | e >>> 32 - n, ax = (e, t, n) => t << n - 32 | e >>> 64 - n, cx = (e, t, n) => e << n - 32 | t >>> 64 - n;
function lx(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const ux = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), dx = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, fx = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), hx = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, px = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), gx = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Je = {
  fromBig: My,
  split: q2,
  toBig: W2,
  shrSH: Z2,
  shrSL: J2,
  rotrSH: Q2,
  rotrSL: ex,
  rotrBH: tx,
  rotrBL: nx,
  rotr32H: rx,
  rotr32L: sx,
  rotlSH: ox,
  rotlSL: ix,
  rotlBH: ax,
  rotlBL: cx,
  add: lx,
  add3L: ux,
  add3H: dx,
  add4L: fx,
  add4H: hx,
  add5H: gx,
  add5L: px
}, [yx, wx] = Je.split([
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
let Ol = class extends yf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: g, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, w, g, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, w, g, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ds[A] = t.getUint32(n), Fs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Ds[A - 15] | 0, _ = Fs[A - 15] | 0, Y = Je.rotrSH(T, _, 1) ^ Je.rotrSH(T, _, 8) ^ Je.shrSH(T, _, 7), ce = Je.rotrSL(T, _, 1) ^ Je.rotrSL(T, _, 8) ^ Je.shrSL(T, _, 7), ne = Ds[A - 2] | 0, q = Fs[A - 2] | 0, m = Je.rotrSH(ne, q, 19) ^ Je.rotrBH(ne, q, 61) ^ Je.shrSH(ne, q, 6), I = Je.rotrSL(ne, q, 19) ^ Je.rotrBL(ne, q, 61) ^ Je.shrSL(ne, q, 6), N = Je.add4L(ce, I, Fs[A - 7], Fs[A - 16]), P = Je.add4H(N, Y, m, Ds[A - 7], Ds[A - 16]);
      Ds[A] = P | 0, Fs[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: g, Fl: v, Gh: x, Gl: L, Hh: B, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = Je.rotrSH(d, w, 14) ^ Je.rotrSH(d, w, 18) ^ Je.rotrBH(d, w, 41), _ = Je.rotrSL(d, w, 14) ^ Je.rotrSL(d, w, 18) ^ Je.rotrBL(d, w, 41), Y = d & g ^ ~d & x, ce = w & v ^ ~w & L, ne = Je.add5L(U, _, ce, wx[A], Fs[A]), q = Je.add5H(ne, B, T, Y, yx[A], Ds[A]), m = ne | 0, I = Je.rotrSH(r, o, 28) ^ Je.rotrBH(r, o, 34) ^ Je.rotrBH(r, o, 39), N = Je.rotrSL(r, o, 28) ^ Je.rotrBL(r, o, 34) ^ Je.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      B = x | 0, U = L | 0, x = g | 0, L = v | 0, g = d | 0, v = w | 0, { h: d, l: w } = Je.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = Je.add3L(m, N, W);
      r = Je.add3H(R, q, I, P), o = R | 0;
    }
    ({ h: r, l: o } = Je.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Je.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = Je.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Je.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = Je.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: g, l: v } = Je.add(this.Fh | 0, this.Fl | 0, g | 0, v | 0), { h: x, l: L } = Je.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: U } = Je.add(this.Hh | 0, this.Hl | 0, B | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, w, g, v, x, L, B, U);
  }
  roundClean() {
    Ds.fill(0), Fs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, mx = class extends Ol {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, bx = class extends Ol {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, xx = class extends Ol {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Sx = ci(() => new Ol());
ci(() => new mx());
ci(() => new bx());
ci(() => new xx());
function Py(e) {
  return Gi(e);
}
function vx(e) {
  return Sx(e);
}
const Ax = 0;
rn.hmacSha256Sync = (e, ...t) => {
  const n = _l.create(Gi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Ex() {
  return Oe(rn.randomPrivateKey());
}
function kx(e) {
  const t = Gi(Gi(e));
  return D2.encode(ss(e, t).slice(0, e.length + 4));
}
function $x(e, t) {
  return kx(ss(new Uint8Array([e]), t.slice(0, 20)));
}
function _y(e, t = Ax) {
  const n = typeof e == "string" ? bt(e) : e, r = Y2(Py(n));
  return $x(t, r);
}
function Uy(e) {
  const t = pf(e);
  return Oe(Za(t.slice(0, 32), !0));
}
rn.hmacSha256Sync = (e, ...t) => {
  const n = _l.create(Gi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var il;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(il || (il = {}));
async function Ix(e, t, n) {
  return await (await Cy()).encrypt("aes-256-cbc", t, e, n);
}
async function Lx(e, t, n) {
  return await (await Cy()).decrypt("aes-256-cbc", t, e, n);
}
function Oy(e, t) {
  return _l(Gi, e, t);
}
function Cx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function Hy(e) {
  const t = vx(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function Tx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function Bx(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: il.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: il.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !Tx(e))
    return t;
  try {
    return at.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Nx(e, t, n, r) {
  const o = Bx(e);
  if (!o.result)
    throw o;
  const s = rn.randomPrivateKey(), i = Za(s, !0);
  let a = xf(s, e, !0);
  a = a.slice(1);
  const c = Hy(a), u = rn.randomBytes(16), h = await Ix(u, c.encryptionKey, t), d = ss(u, i, h), w = Oy(c.hmacKey, d);
  let g;
  if (!r || r === "hex")
    g = Oe(h);
  else if (r === "base64")
    g = S2(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const v = {
    iv: Oe(u),
    ephemeralPK: Oe(i),
    cipherText: g,
    mac: Oe(w),
    wasString: n
  };
  return r && r !== "hex" && (v.cipherTextEncoding = r), v;
}
async function Dy(e, t) {
  if (!t.ephemeralPK)
    throw new cp("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = xf(e, n, !0);
  r = r.slice(1);
  const o = Hy(r), s = bt(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = bt(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = x2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = ss(s, bt(n), i), c = Oy(o.hmacKey, a), u = bt(t.mac);
  if (!Cx(u, c))
    throw new cp("Decryption failed: failure in MAC check");
  const h = await Lx(s, o.encryptionKey, i);
  return t.wasString ? Wa(h) : h;
}
function Mx(e, t) {
  const n = typeof t == "string" ? ai(t) : t, r = Uy(e), o = Py(n), s = Ul(o, e);
  return {
    signature: Oe(s),
    publicKey: r
  };
}
async function Px(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Uy(n.privateKey);
  }
  const o = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", s = typeof e == "string" ? ai(e) : e, i = await Nx(n.publicKey, s, o, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Mx(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function _x(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return Dy(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Bn = {}, qi = {}, jn = {};
Object.defineProperty(jn, "__esModule", { value: !0 });
jn.decode = jn.encode = jn.unescape = jn.escape = jn.pad = void 0;
const Fy = Ja;
function Af(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
jn.pad = Af;
function jy(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
jn.escape = jy;
function Ry(e) {
  return Af(e).replace(/-/g, "+").replace(/_/g, "/");
}
jn.unescape = Ry;
function Ux(e) {
  return jy((0, Fy.fromByteArray)(new TextEncoder().encode(e)));
}
jn.encode = Ux;
function Ox(e) {
  return new TextDecoder().decode((0, Fy.toByteArray)(Af(Ry(e))));
}
jn.decode = Ox;
var Hl = {}, Dl = {}, zy = {}, Gy = {}, Fl = {};
Object.defineProperty(Fl, "__esModule", { value: !0 });
Fl.crypto = void 0;
Fl.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = o, e.ahash = s, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = u, e.clean = h, e.createView = d, e.rotr = w, e.rotl = g, e.byteSwap = v, e.byteSwap32 = x, e.bytesToHex = U, e.hexToBytes = _, e.asyncLoop = ce, e.utf8ToBytes = ne, e.bytesToUtf8 = q, e.toBytes = m, e.kdfInputToBytes = I, e.concatBytes = N, e.checkOpts = P, e.createHasher = R, e.createOptHasher = le, e.createXOFer = ue, e.randomBytes = Xe;
  const t = Fl;
  function n(C) {
    return C instanceof Uint8Array || ArrayBuffer.isView(C) && C.constructor.name === "Uint8Array";
  }
  function r(C) {
    if (!Number.isSafeInteger(C) || C < 0)
      throw new Error("positive integer expected, got " + C);
  }
  function o(C, ...F) {
    if (!n(C))
      throw new Error("Uint8Array expected");
    if (F.length > 0 && !F.includes(C.length))
      throw new Error("Uint8Array expected of length " + F + ", got length=" + C.length);
  }
  function s(C) {
    if (typeof C != "function" || typeof C.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(C.outputLen), r(C.blockLen);
  }
  function i(C, F = !0) {
    if (C.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (F && C.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(C, F) {
    o(C);
    const re = F.outputLen;
    if (C.length < re)
      throw new Error("digestInto() expects output buffer of length at least " + re);
  }
  function c(C) {
    return new Uint8Array(C.buffer, C.byteOffset, C.byteLength);
  }
  function u(C) {
    return new Uint32Array(C.buffer, C.byteOffset, Math.floor(C.byteLength / 4));
  }
  function h(...C) {
    for (let F = 0; F < C.length; F++)
      C[F].fill(0);
  }
  function d(C) {
    return new DataView(C.buffer, C.byteOffset, C.byteLength);
  }
  function w(C, F) {
    return C << 32 - F | C >>> F;
  }
  function g(C, F) {
    return C << F | C >>> 32 - F >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v(C) {
    return C << 24 & 4278190080 | C << 8 & 16711680 | C >>> 8 & 65280 | C >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (C) => C : (C) => v(C), e.byteSwapIfBE = e.swap8IfBE;
  function x(C) {
    for (let F = 0; F < C.length; F++)
      C[F] = v(C[F]);
    return C;
  }
  e.swap32IfBE = e.isLE ? (C) => C : x;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", B = /* @__PURE__ */ Array.from({ length: 256 }, (C, F) => F.toString(16).padStart(2, "0"));
  function U(C) {
    if (o(C), L)
      return C.toHex();
    let F = "";
    for (let re = 0; re < C.length; re++)
      F += B[C[re]];
    return F;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function T(C) {
    if (C >= A._0 && C <= A._9)
      return C - A._0;
    if (C >= A.A && C <= A.F)
      return C - (A.A - 10);
    if (C >= A.a && C <= A.f)
      return C - (A.a - 10);
  }
  function _(C) {
    if (typeof C != "string")
      throw new Error("hex string expected, got " + typeof C);
    if (L)
      return Uint8Array.fromHex(C);
    const F = C.length, re = F / 2;
    if (F % 2)
      throw new Error("hex string expected, got unpadded hex of length " + F);
    const de = new Uint8Array(re);
    for (let Ne = 0, Pe = 0; Ne < re; Ne++, Pe += 2) {
      const Ht = T(C.charCodeAt(Pe)), Ge = T(C.charCodeAt(Pe + 1));
      if (Ht === void 0 || Ge === void 0) {
        const _e = C[Pe] + C[Pe + 1];
        throw new Error('hex string expected, got non-hex character "' + _e + '" at index ' + Pe);
      }
      de[Ne] = Ht * 16 + Ge;
    }
    return de;
  }
  const Y = async () => {
  };
  e.nextTick = Y;
  async function ce(C, F, re) {
    let de = Date.now();
    for (let Ne = 0; Ne < C; Ne++) {
      re(Ne);
      const Pe = Date.now() - de;
      Pe >= 0 && Pe < F || (await (0, e.nextTick)(), de += Pe);
    }
  }
  function ne(C) {
    if (typeof C != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(C));
  }
  function q(C) {
    return new TextDecoder().decode(C);
  }
  function m(C) {
    return typeof C == "string" && (C = ne(C)), o(C), C;
  }
  function I(C) {
    return typeof C == "string" && (C = ne(C)), o(C), C;
  }
  function N(...C) {
    let F = 0;
    for (let de = 0; de < C.length; de++) {
      const Ne = C[de];
      o(Ne), F += Ne.length;
    }
    const re = new Uint8Array(F);
    for (let de = 0, Ne = 0; de < C.length; de++) {
      const Pe = C[de];
      re.set(Pe, Ne), Ne += Pe.length;
    }
    return re;
  }
  function P(C, F) {
    if (F !== void 0 && {}.toString.call(F) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(C, F);
  }
  class W {
  }
  e.Hash = W;
  function R(C) {
    const F = (de) => C().update(m(de)).digest(), re = C();
    return F.outputLen = re.outputLen, F.blockLen = re.blockLen, F.create = () => C(), F;
  }
  function le(C) {
    const F = (de, Ne) => C(Ne).update(m(de)).digest(), re = C({});
    return F.outputLen = re.outputLen, F.blockLen = re.blockLen, F.create = (de) => C(de), F;
  }
  function ue(C) {
    const F = (de, Ne) => C(Ne).update(m(de)).digest(), re = C({});
    return F.outputLen = re.outputLen, F.blockLen = re.blockLen, F.create = (de) => C(de), F;
  }
  e.wrapConstructor = R, e.wrapConstructorWithOpts = le, e.wrapXOFConstructorWithOpts = ue;
  function Xe(C = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(C));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(C));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Gy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = Gy;
  class n extends t.Hash {
    constructor(s, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(s);
      const a = (0, t.toBytes)(i);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? s.create().update(a).digest() : a);
      for (let h = 0; h < u.length; h++)
        u[h] ^= 54;
      this.iHash.update(u), this.oHash = s.create();
      for (let h = 0; h < u.length; h++)
        u[h] ^= 106;
      this.oHash.update(u), (0, t.clean)(u);
    }
    update(s) {
      return (0, t.aexists)(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      (0, t.aexists)(this), (0, t.abytes)(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: i, iHash: a, finished: c, destroyed: u, blockLen: h, outputLen: d } = this;
      return s = s, s.finished = c, s.destroyed = u, s.blockLen = h, s.outputLen = d, s.oHash = i._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (o, s, i) => new n(o, s).update(i).digest();
  e.hmac = r, e.hmac.create = (o, s) => new n(o, s);
})(zy);
const $i = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Ky(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function ld(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function li(e, ...t) {
  if (!Ky(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Hx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  ld(e.outputLen), ld(e.blockLen);
}
function ud(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Vy(e, t) {
  li(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Dx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function Fx(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function al(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Kc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Br(e, t) {
  return e << 32 - t | e >>> t;
}
function jx(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const Ef = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function kf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const Xy = Ef ? (e) => e : (e) => kf(e), Rx = Xy;
function Yy(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = kf(e[t]);
  return e;
}
const zx = Ef ? (e) => e : Yy, qy = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Gx = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function $f(e) {
  if (li(e), qy)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Gx[e[n]];
  return t;
}
const ms = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Sp(e) {
  if (e >= ms._0 && e <= ms._9)
    return e - ms._0;
  if (e >= ms.A && e <= ms.F)
    return e - (ms.A - 10);
  if (e >= ms.a && e <= ms.f)
    return e - (ms.a - 10);
}
function Kx(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (qy)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let o = 0, s = 0; o < n; o++, s += 2) {
    const i = Sp(e.charCodeAt(s)), a = Sp(e.charCodeAt(s + 1));
    if (i === void 0 || a === void 0) {
      const c = e[s] + e[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[o] = i * 16 + a;
  }
  return r;
}
const Wy = async () => {
};
async function Vx(e, t, n) {
  let r = Date.now();
  for (let o = 0; o < e; o++) {
    n(o);
    const s = Date.now() - r;
    s >= 0 && s < t || (await Wy(), r += s);
  }
}
function If(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function Xx(e) {
  return new TextDecoder().decode(e);
}
function Qa(e) {
  return typeof e == "string" && (e = If(e)), li(e), e;
}
function Yx(e) {
  return typeof e == "string" && (e = If(e)), li(e), e;
}
function qx(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    li(o), t += o.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Wx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let Zy = class {
};
function jl(e) {
  const t = (r) => e().update(Qa(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Jy(e) {
  const t = (r, o) => e(o).update(Qa(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function Qy(e) {
  const t = (r, o) => e(o).update(Qa(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const Zx = jl, Jx = Jy, Qx = Qy;
function eS(e = 32) {
  if ($i && typeof $i.getRandomValues == "function")
    return $i.getRandomValues(new Uint8Array(e));
  if ($i && typeof $i.randomBytes == "function")
    return Uint8Array.from($i.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const tS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Zy,
  abytes: li,
  aexists: ud,
  ahash: Hx,
  anumber: ld,
  aoutput: Vy,
  asyncLoop: Vx,
  byteSwap: kf,
  byteSwap32: Yy,
  byteSwapIfBE: Rx,
  bytesToHex: $f,
  bytesToUtf8: Xx,
  checkOpts: Wx,
  clean: al,
  concatBytes: qx,
  createHasher: jl,
  createOptHasher: Jy,
  createView: Kc,
  createXOFer: Qy,
  hexToBytes: Kx,
  isBytes: Ky,
  isLE: Ef,
  kdfInputToBytes: Yx,
  nextTick: Wy,
  randomBytes: eS,
  rotl: jx,
  rotr: Br,
  swap32IfBE: zx,
  swap8IfBE: Xy,
  toBytes: Qa,
  u32: Fx,
  u8: Dx,
  utf8ToBytes: If,
  wrapConstructor: Zx,
  wrapConstructorWithOpts: Jx,
  wrapXOFConstructorWithOpts: Qx
}, Symbol.toStringTag, { value: "Module" }));
function nS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function rS(e, t, n) {
  return e & t ^ ~e & n;
}
function sS(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class oS extends Zy {
  constructor(t, n, r, o) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.buffer = new Uint8Array(t), this.view = Kc(this.buffer);
  }
  update(t) {
    ud(this), t = Qa(t), li(t);
    const { view: n, buffer: r, blockLen: o } = this, s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Kc(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    ud(this), Vy(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, al(this.buffer.subarray(i)), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    nS(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Kc(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.destroyed = i, t.finished = s, t.length = o, t.pos = a, o % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const js = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Rs = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), iS = /* @__PURE__ */ Uint32Array.from([
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
]), zs = /* @__PURE__ */ new Uint32Array(64);
let Lf = class extends oS {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = js[0] | 0, this.B = js[1] | 0, this.C = js[2] | 0, this.D = js[3] | 0, this.E = js[4] | 0, this.F = js[5] | 0, this.G = js[6] | 0, this.H = js[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      zs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = zs[d - 15], g = zs[d - 2], v = Br(w, 7) ^ Br(w, 18) ^ w >>> 3, x = Br(g, 17) ^ Br(g, 19) ^ g >>> 10;
      zs[d] = x + zs[d - 7] + v + zs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Br(a, 6) ^ Br(a, 11) ^ Br(a, 25), g = h + w + rS(a, c, u) + iS[d] + zs[d] | 0, x = (Br(r, 2) ^ Br(r, 13) ^ Br(r, 22)) + sS(r, o, s) | 0;
      h = u, u = c, c = a, a = i + g | 0, i = s, s = o, o = r, r = g + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    al(zs);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), al(this.buffer);
  }
}, ew = class extends Lf {
  constructor() {
    super(28), this.A = Rs[0] | 0, this.B = Rs[1] | 0, this.C = Rs[2] | 0, this.D = Rs[3] | 0, this.E = Rs[4] | 0, this.F = Rs[5] | 0, this.G = Rs[6] | 0, this.H = Rs[7] | 0;
  }
};
const aS = /* @__PURE__ */ jl(() => new Lf()), cS = /* @__PURE__ */ jl(() => new ew()), lS = Lf, Cf = aS, uS = ew, dS = cS, fS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: uS,
  SHA256: lS,
  sha224: dS,
  sha256: Cf
}, Symbol.toStringTag, { value: "Module" })), Rl = /* @__PURE__ */ Ml(fS), hS = /* @__PURE__ */ Ml(b2);
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.joseToDer = Wi.derToJose = void 0;
const tw = Ja, nw = jn;
function vu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const pS = {
  ES256: vu(256),
  ES384: vu(384),
  ES512: vu(521)
};
function rw(e) {
  const t = pS[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const cl = 128, sw = 0, gS = 32, yS = 16, wS = 2, ow = yS | gS | sw << 6, ll = wS | sw << 6;
function iw(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, tw.toByteArray)((0, nw.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function mS(e, t) {
  const n = iw(e), r = rw(t), o = r + 1, s = n.length;
  let i = 0;
  if (n[i++] !== ow)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (cl | 1) && (a = n[i++]), s - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - i}" remaining`);
  if (n[i++] !== ll)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (s - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - i - 2}" available`);
  if (o < c)
    throw new Error(`"r" specified length of "${c}", max of "${o}" is acceptable`);
  const u = i;
  if (i += c, n[i++] !== ll)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (s - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${s - i}"`);
  if (o < h)
    throw new Error(`"s" specified length of "${h}", max of "${o}" is acceptable`);
  const d = i;
  if (i += h, i !== s)
    throw new Error(`Expected to consume entire array, but "${s - i}" bytes remain`);
  const w = r - c, g = r - h, v = new Uint8Array(w + c + g + h);
  for (i = 0; i < w; ++i)
    v[i] = 0;
  v.set(n.subarray(u + Math.max(-w, 0), u + c), i), i = r;
  for (const x = i; i < x + g; ++i)
    v[i] = 0;
  return v.set(n.subarray(d + Math.max(-g, 0), d + h), i), (0, nw.escape)((0, tw.fromByteArray)(v));
}
Wi.derToJose = mS;
function vp(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= cl && --r, r;
}
function bS(e, t) {
  e = iw(e);
  const n = rw(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const o = vp(e, 0, n), s = vp(e, n, e.length), i = n - o, a = n - s, c = 2 + i + 1 + 1 + a, u = c < cl, h = new Uint8Array((u ? 2 : 3) + c);
  let d = 0;
  return h[d++] = ow, u ? h[d++] = c : (h[d++] = cl | 1, h[d++] = c & 255), h[d++] = ll, h[d++] = i, o < 0 ? (h[d++] = 0, h.set(e.subarray(0, n), d), d += n) : (h.set(e.subarray(o, n), d), d += n - o), h[d++] = ll, h[d++] = a, s < 0 ? (h[d++] = 0, h.set(e.subarray(n), d)) : h.set(e.subarray(n + s), d), h;
}
Wi.joseToDer = bS;
var Is = {};
Object.defineProperty(Is, "__esModule", { value: !0 });
Is.InvalidTokenError = Is.MissingParametersError = void 0;
class xS extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
Is.MissingParametersError = xS;
class SS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
Is.InvalidTokenError = SS;
const ec = /* @__PURE__ */ Ml(tS);
Object.defineProperty(Dl, "__esModule", { value: !0 });
Dl.SECP256K1Client = void 0;
const vS = zy, AS = Rl, Vc = hS, Ap = Wi, Ep = Is, kp = ec;
Vc.utils.hmacSha256Sync = (e, ...t) => {
  const n = vS.hmac.create(AS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class aw {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, kp.bytesToHex)(Vc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new Ep.MissingParametersError("a signing input hash and private key are all required");
    const o = Vc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, kp.bytesToHex)(o);
    if (r === "jose")
      return (0, Ap.derToJose)(o, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, Ap.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new Ep.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Vc.verify(n, t, r, { strict: !1 });
  }
}
Dl.SECP256K1Client = aw;
aw.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = Dl;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(Hl);
var Yo = {};
const ES = /* @__PURE__ */ Ml(py);
var kS = zn && zn.__awaiter || function(e, t, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
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
      h.done ? s(h.value) : o(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Yo, "__esModule", { value: !0 });
Yo.hashSha256Async = Yo.hashSha256 = void 0;
const $S = Rl;
function cw(e) {
  return (0, $S.sha256)(e);
}
Yo.hashSha256 = cw;
function IS(e) {
  return kS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = ES;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(cw(e));
    }
  });
}
Yo.hashSha256Async = IS;
var LS = zn && zn.__awaiter || function(e, t, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
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
      h.done ? s(h.value) : o(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.TokenSigner = qi.createUnsecuredToken = void 0;
const dd = jn, $p = Hl, CS = Is, Ip = Yo;
function fd(e, t) {
  const n = [], r = dd.encode(JSON.stringify(t));
  n.push(r);
  const o = dd.encode(JSON.stringify(e));
  return n.push(o), n.join(".");
}
function TS(e) {
  return fd(e, { typ: "JWT", alg: "none" }) + ".";
}
qi.createUnsecuredToken = TS;
class BS {
  constructor(t, n) {
    if (!(t && n))
      throw new CS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !$p.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = $p.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const o = this.header(r), s = fd(t, o), i = (0, Ip.hashSha256)(s);
    return this.createWithSignedHash(t, n, o, s, i);
  }
  signAsync(t, n = !1, r = {}) {
    return LS(this, void 0, void 0, function* () {
      const o = this.header(r), s = fd(t, o), i = yield (0, Ip.hashSha256Async)(s);
      return this.createWithSignedHash(t, n, o, s, i);
    });
  }
  createWithSignedHash(t, n, r, o, s) {
    const i = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [dd.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [o, i].join(".");
  }
}
qi.TokenSigner = BS;
var zl = {};
Object.defineProperty(zl, "__esModule", { value: !0 });
zl.TokenVerifier = void 0;
const NS = jn, Lp = Hl, MS = Is, wc = Yo;
class PS {
  constructor(t, n) {
    if (!(t && n))
      throw new MS.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !Lp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Lp.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), o = r[0] + "." + r[1], s = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, wc.hashSha256Async)(o).then((i) => s(i));
    {
      const i = (0, wc.hashSha256)(o);
      return s(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), NS.encode(t.payload)].join(".");
    let o = !0;
    const s = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (o = !1);
    }), o);
    if (n)
      return (0, wc.hashSha256Async)(r).then((i) => s(i));
    {
      const i = (0, wc.hashSha256)(r);
      return s(i);
    }
  }
}
zl.TokenVerifier = PS;
var Gl = {};
Object.defineProperty(Gl, "__esModule", { value: !0 });
Gl.decodeToken = void 0;
const mc = jn;
function _S(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(mc.decode(t[0])), r = JSON.parse(mc.decode(t[1])), o = t[2];
    return {
      header: n,
      payload: r,
      signature: o
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = mc.decode(t));
    const n = [];
    return e.header.map((r) => {
      const o = JSON.parse(mc.decode(r));
      n.push(o);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
Gl.decodeToken = _S;
(function(e) {
  var t = zn && zn.__createBinding || (Object.create ? function(r, o, s, i) {
    i === void 0 && (i = s);
    var a = Object.getOwnPropertyDescriptor(o, s);
    (!a || ("get" in a ? !o.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return o[s];
    } }), Object.defineProperty(r, i, a);
  } : function(r, o, s, i) {
    i === void 0 && (i = s), r[i] = o[s];
  }), n = zn && zn.__exportStar || function(r, o) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(o, s) && t(o, r, s);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(qi, e), n(zl, e), n(Gl, e), n(Is, e), n(Hl, e);
})(Bn);
function US(e) {
  return `did:btc-addr:${e}`;
}
function OS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new ap("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new ap('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function lw(e) {
  if (e)
    return OS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const HS = "1.4.0";
function DS() {
  return Ex();
}
function FS(e, t, n, r = sy.slice(), o, s = S1().getTime(), i = {}) {
  const a = (g) => {
    const v = ff("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${g}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), o || (o = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: A1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: o,
    manifest_uri: n,
    redirect_uri: t,
    version: HS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Bn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [u];
  const h = _y(u);
  return c.iss = US(h), new Bn.TokenSigner("ES256k", e).sign(c);
}
async function Cp(e, t) {
  const n = Wa(bt(t)), r = JSON.parse(n), o = await Dy(e, r);
  if (typeof o != "string")
    throw new Error("Unable to correctly decrypt private key");
  return o;
}
function jS(e) {
  const t = Bn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Bn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function RS(e) {
  const t = Bn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = lw(t.iss);
  if (n.length === 1) {
    if (_y(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function zS(e) {
  const t = Bn.decodeToken(e).payload;
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
function GS(e) {
  const t = Bn.decodeToken(e).payload;
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
function KS(e) {
  const t = [
    GS(e),
    zS(e),
    jS(e),
    RS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const Tp = "1.0.0";
class po {
  constructor(t) {
    this.version = Tp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== Tp)
      throw new rd(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new po(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class uw {
  constructor(t) {
    if (t) {
      const n = new po(t);
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
class Bp extends uw {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new po({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new oy("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new po({})), !0;
  }
}
class Np extends uw {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = m1, !localStorage.getItem(this.key)) {
      const r = new po({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new oy("No session data was found in localStorage");
    const n = JSON.parse(t);
    return po.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new po({})), !0;
  }
}
var Oa;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Oa || (Oa = {}));
var ul;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(ul || (ul = {}));
Oa.Mainnet;
var Es;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Es || (Es = {}));
var ts;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ts || (ts = {}));
Es.Mainnet;
const dw = {
  chainId: Oa.Mainnet,
  transactionVersion: Es.Mainnet,
  peerNetworkId: ul.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ts.MainnetSingleSig,
    multiSig: ts.MainnetMultiSig
  },
  client: { baseUrl: iy }
}, hd = {
  chainId: Oa.Testnet,
  transactionVersion: Es.Testnet,
  peerNetworkId: ul.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ts.TestnetSingleSig,
    multiSig: ts.TestnetMultiSig
  },
  client: { baseUrl: ay }
}, Xc = {
  ...hd,
  addressVersion: { ...hd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: cy }
}, VS = {
  ...Xc,
  addressVersion: { ...Xc.addressVersion },
  client: { ...Xc.client }
};
function XS(e) {
  switch (e) {
    case "mainnet":
      return dw;
    case "testnet":
      return hd;
    case "devnet":
      return Xc;
    case "mocknet":
      return VS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function fw(e) {
  return typeof e == "string" ? XS(e) : e;
}
var Mp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Mp || (Mp = {}));
var Pp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Pp || (Pp = {}));
var Nr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Nr || (Nr = {}));
const Au = ["onChainOnly", "offChainOnly", "any"];
Au[0] + "", Nr.OnChainOnly, Au[1] + "", Nr.OffChainOnly, Au[2] + "", Nr.Any, Nr.OnChainOnly + "", Nr.OnChainOnly, Nr.OffChainOnly + "", Nr.OffChainOnly, Nr.Any + "", Nr.Any;
var _p;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(_p || (_p = {}));
var Up;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Up || (Up = {}));
var Op;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Op || (Op = {}));
var vs;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(vs || (vs = {}));
var Hp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Hp || (Hp = {}));
var Dp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Dp || (Dp = {}));
var Fp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Fp || (Fp = {}));
var jp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(jp || (jp = {}));
var Rp;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Rp || (Rp = {}));
var zp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(zp || (zp = {}));
var Gp;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Gp || (Gp = {}));
var Kp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Kp || (Kp = {}));
var Vp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Vp || (Vp = {}));
function pd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function YS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function hw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function qS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pd(e.outputLen), pd(e.blockLen);
}
function WS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function ZS(e, t) {
  hw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const _o = {
  number: pd,
  bool: YS,
  bytes: hw,
  hash: qS,
  exists: WS,
  output: ZS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Eu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Yr = (e, t) => e << 32 - t | e >>> t, JS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!JS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function QS(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Tf(e) {
  if (typeof e == "string" && (e = QS(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let pw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ui(e) {
  const t = (r) => e().update(Tf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let gw = class extends pw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, _o.hash(t);
    const r = Tf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return _o.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    _o.exists(this), _o.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const yw = (e, t, n) => new gw(e, t).update(n).digest();
yw.create = (e, t) => new gw(e, t);
function ev(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Bf = class extends pw {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Eu(this.buffer);
  }
  update(t) {
    _o.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = Tf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Eu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    _o.exists(this), _o.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    ev(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Eu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const tv = (e, t, n) => e & t ^ ~e & n, nv = (e, t, n) => e & t ^ e & n ^ t & n, rv = new Uint32Array([
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
]), Gs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ks = new Uint32Array(64);
let ww = class extends Bf {
  constructor() {
    super(64, 32, 8, !1), this.A = Gs[0] | 0, this.B = Gs[1] | 0, this.C = Gs[2] | 0, this.D = Gs[3] | 0, this.E = Gs[4] | 0, this.F = Gs[5] | 0, this.G = Gs[6] | 0, this.H = Gs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Ks[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Ks[d - 15], g = Ks[d - 2], v = Yr(w, 7) ^ Yr(w, 18) ^ w >>> 3, x = Yr(g, 17) ^ Yr(g, 19) ^ g >>> 10;
      Ks[d] = x + Ks[d - 7] + v + Ks[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Yr(a, 6) ^ Yr(a, 11) ^ Yr(a, 25), g = h + w + tv(a, c, u) + rv[d] + Ks[d] | 0, x = (Yr(r, 2) ^ Yr(r, 13) ^ Yr(r, 22)) + nv(r, o, s) | 0;
      h = u, u = c, c = a, a = i + g | 0, i = s, s = o, o = r, r = g + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    Ks.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, sv = class extends ww {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const mw = ui(() => new ww());
ui(() => new sv());
var di = {}, Nf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = ec;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], u = 0;
    for (let g = i.length - 1; g >= 0; g--)
      if (u < 4) {
        const v = n.indexOf(i[g]) >> u;
        let x = 0;
        g !== 0 && (x = n.indexOf(i[g - 1]));
        const L = 1 + u, B = x % (1 << L) << 5 - L, U = e.c32[v + B];
        u = L, c.unshift(U);
      } else
        u = 0;
    let h = 0;
    for (let g = 0; g < c.length && c[g] === "0"; g++)
      h++;
    c = c.slice(h);
    const d = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), w = d ? d[0].length : 0;
    for (let g = 0; g < w; g++)
      c.unshift(e.c32[0]);
    if (a) {
      const g = a - c.length;
      for (let v = 0; v < g; v++)
        c.unshift(e.c32[0]);
    }
    return c.join("");
  }
  e.c32encode = r;
  function o(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = o;
  function s(i, a) {
    if (i = o(i), !i.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${e.c32[0]}*`), u = c ? c[0].length : 0;
    let h = [], d = 0, w = 0;
    for (let x = i.length - 1; x >= 0; x--) {
      w === 4 && (h.unshift(n[d]), w = 0, d = 0);
      const B = (e.c32.indexOf(i[x]) << w) + d, U = n[B % 16];
      if (w += 1, d = B >> 4, d > 1 << w)
        throw new Error("Panic error in decoding.");
      h.unshift(U);
    }
    h.unshift(n[d]), h.length % 2 === 1 && h.unshift("0");
    let g = 0;
    for (let x = 0; x < h.length && h[x] === "0"; x++)
      g++;
    h = h.slice(g - g % 2);
    let v = h.join("");
    for (let x = 0; x < u; x++)
      v = `00${v}`;
    if (a) {
      const x = a * 2 - v.length;
      for (let L = 0; L < x; L += 2)
        v = `00${v}`;
    }
    return v;
  }
  e.c32decode = s;
})(Nf);
var qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
qo.c32checkDecode = qo.c32checkEncode = void 0;
const Xp = Rl, Yp = ec, Ba = Nf;
function bw(e) {
  const t = (0, Xp.sha256)((0, Xp.sha256)((0, Yp.hexToBytes)(e)));
  return (0, Yp.bytesToHex)(t.slice(0, 4));
}
function ov(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = bw(`${n}${t}`), o = (0, Ba.c32encode)(`${t}${r}`);
  return `${Ba.c32[e]}${o}`;
}
qo.c32checkEncode = ov;
function iv(e) {
  e = (0, Ba.c32normalize)(e);
  const t = (0, Ba.c32decode)(e.slice(1)), n = e[0], r = Ba.c32.indexOf(n), o = t.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), bw(`${s}${t.substring(0, t.length - 8)}`) !== o)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
qo.c32checkDecode = iv;
var xw = {}, Zi = {};
Object.defineProperty(Zi, "__esModule", { value: !0 });
Zi.decode = Zi.encode = void 0;
const dl = Rl, qp = ec, Sw = Ty, vw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function av(e, t = "00") {
  const n = typeof e == "string" ? (0, qp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, qp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const o = (0, dl.sha256)((0, dl.sha256)(new Uint8Array([...r, ...n])));
  return Sw(vw).encode([...r, ...n, ...o.slice(0, 4)]);
}
Zi.encode = av;
function cv(e) {
  const t = Sw(vw).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), o = (0, dl.sha256)((0, dl.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((s, i) => {
    if (s !== o[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Zi.decode = cv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = qo, n = Zi, r = ec;
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
  const o = {};
  o[0] = e.versions.mainnet.p2pkh, o[5] = e.versions.mainnet.p2sh, o[111] = e.versions.testnet.p2pkh, o[196] = e.versions.testnet.p2sh;
  const s = {};
  s[e.versions.mainnet.p2pkh] = 0, s[e.versions.mainnet.p2sh] = 5, s[e.versions.testnet.p2pkh] = 111, s[e.versions.testnet.p2sh] = 196;
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
    const w = n.decode(h), g = (0, r.bytesToHex)(w.data), v = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let x;
    return d < 0 ? (x = v, o[v] !== void 0 && (x = o[v])) : x = d, i(x, g);
  }
  e.b58ToC32 = c;
  function u(h, d = -1) {
    const w = a(h), g = w[0], v = w[1];
    let x;
    d < 0 ? (x = g, s[g] !== void 0 && (x = s[g])) : x = d;
    let L = x.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(v, L);
  }
  e.c32ToB58 = u;
})(xw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = Nf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = qo;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = xw;
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
})(di);
function lv(e, t) {
  switch (t = fw(t ?? dw), e) {
    case vs.P2PKH:
      switch (t.transactionVersion) {
        case Es.Mainnet:
          return ts.MainnetSingleSig;
        case Es.Testnet:
          return ts.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case vs.P2SH:
    case vs.P2SHNonSequential:
    case vs.P2WPKH:
    case vs.P2WSH:
    case vs.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case Es.Mainnet:
          return ts.MainnetMultiSig;
        case Es.Testnet:
          return ts.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const uv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Aw = Uint8Array.from({ length: 16 }, (e, t) => t), dv = Aw.map((e) => (9 * e + 5) % 16);
let Mf = [Aw], Pf = [dv];
for (let e = 0; e < 4; e++)
  for (let t of [Mf, Pf])
    t.push(t[e].map((n) => uv[n]));
const Ew = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), fv = Mf.map((e, t) => e.map((n) => Ew[t][n])), hv = Pf.map((e, t) => e.map((n) => Ew[t][n])), pv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), gv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), bc = (e, t) => e << t | e >>> 32 - t;
function Wp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const xc = new Uint32Array(16);
let yv = class extends Bf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let g = 0; g < 16; g++, n += 4)
      xc[g] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let g = 0; g < 5; g++) {
      const v = 4 - g, x = pv[g], L = gv[g], B = Mf[g], U = Pf[g], A = fv[g], T = hv[g];
      for (let _ = 0; _ < 16; _++) {
        const Y = bc(r + Wp(g, s, a, u) + xc[B[_]] + x, A[_]) + d | 0;
        r = d, d = u, u = bc(a, 10) | 0, a = s, s = Y;
      }
      for (let _ = 0; _ < 16; _++) {
        const Y = bc(o + Wp(v, i, c, h) + xc[U[_]] + L, T[_]) + w | 0;
        o = w, w = h, h = bc(c, 10) | 0, c = i, i = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    xc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const wv = ui(() => new yv()), Sc = BigInt(2 ** 32 - 1), gd = BigInt(32);
function kw(e, t = !1) {
  return t ? { h: Number(e & Sc), l: Number(e >> gd & Sc) } : { h: Number(e >> gd & Sc) | 0, l: Number(e & Sc) | 0 };
}
function mv(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = kw(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const bv = (e, t) => BigInt(e >>> 0) << gd | BigInt(t >>> 0), xv = (e, t, n) => e >>> n, Sv = (e, t, n) => e << 32 - n | t >>> n, vv = (e, t, n) => e >>> n | t << 32 - n, Av = (e, t, n) => e << 32 - n | t >>> n, Ev = (e, t, n) => e << 64 - n | t >>> n - 32, kv = (e, t, n) => e >>> n - 32 | t << 64 - n, $v = (e, t) => t, Iv = (e, t) => e, Lv = (e, t, n) => e << n | t >>> 32 - n, Cv = (e, t, n) => t << n | e >>> 32 - n, Tv = (e, t, n) => t << n - 32 | e >>> 64 - n, Bv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Nv(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const Mv = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Pv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, _v = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Uv = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, Ov = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), Hv = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Qe = {
  fromBig: kw,
  split: mv,
  toBig: bv,
  shrSH: xv,
  shrSL: Sv,
  rotrSH: vv,
  rotrSL: Av,
  rotrBH: Ev,
  rotrBL: kv,
  rotr32H: $v,
  rotr32L: Iv,
  rotlSH: Lv,
  rotlSL: Cv,
  rotlBH: Tv,
  rotlBL: Bv,
  add: Nv,
  add3L: Mv,
  add3H: Pv,
  add4L: _v,
  add4H: Uv,
  add5H: Hv,
  add5L: Ov
}, [Dv, Fv] = Qe.split([
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
].map((e) => BigInt(e))), Vs = new Uint32Array(80), Xs = new Uint32Array(80);
let Kl = class extends Bf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: g, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, w, g, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, w, g, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Vs[A] = t.getUint32(n), Xs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Vs[A - 15] | 0, _ = Xs[A - 15] | 0, Y = Qe.rotrSH(T, _, 1) ^ Qe.rotrSH(T, _, 8) ^ Qe.shrSH(T, _, 7), ce = Qe.rotrSL(T, _, 1) ^ Qe.rotrSL(T, _, 8) ^ Qe.shrSL(T, _, 7), ne = Vs[A - 2] | 0, q = Xs[A - 2] | 0, m = Qe.rotrSH(ne, q, 19) ^ Qe.rotrBH(ne, q, 61) ^ Qe.shrSH(ne, q, 6), I = Qe.rotrSL(ne, q, 19) ^ Qe.rotrBL(ne, q, 61) ^ Qe.shrSL(ne, q, 6), N = Qe.add4L(ce, I, Xs[A - 7], Xs[A - 16]), P = Qe.add4H(N, Y, m, Vs[A - 7], Vs[A - 16]);
      Vs[A] = P | 0, Xs[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: g, Fl: v, Gh: x, Gl: L, Hh: B, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = Qe.rotrSH(d, w, 14) ^ Qe.rotrSH(d, w, 18) ^ Qe.rotrBH(d, w, 41), _ = Qe.rotrSL(d, w, 14) ^ Qe.rotrSL(d, w, 18) ^ Qe.rotrBL(d, w, 41), Y = d & g ^ ~d & x, ce = w & v ^ ~w & L, ne = Qe.add5L(U, _, ce, Fv[A], Xs[A]), q = Qe.add5H(ne, B, T, Y, Dv[A], Vs[A]), m = ne | 0, I = Qe.rotrSH(r, o, 28) ^ Qe.rotrBH(r, o, 34) ^ Qe.rotrBH(r, o, 39), N = Qe.rotrSL(r, o, 28) ^ Qe.rotrBL(r, o, 34) ^ Qe.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      B = x | 0, U = L | 0, x = g | 0, L = v | 0, g = d | 0, v = w | 0, { h: d, l: w } = Qe.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = Qe.add3L(m, N, W);
      r = Qe.add3H(R, q, I, P), o = R | 0;
    }
    ({ h: r, l: o } = Qe.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Qe.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = Qe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Qe.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = Qe.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: g, l: v } = Qe.add(this.Fh | 0, this.Fl | 0, g | 0, v | 0), { h: x, l: L } = Qe.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: U } = Qe.add(this.Hh | 0, this.Hl | 0, B | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, w, g, v, x, L, B, U);
  }
  roundClean() {
    Vs.fill(0), Xs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, jv = class extends Kl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Rv = class extends Kl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, zv = class extends Kl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ui(() => new Kl());
ui(() => new jv());
ui(() => new Rv());
ui(() => new zv());
var fl = { exports: {} };
fl.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", o = 9007199254740991, s = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", w = "[object Map]", g = "[object Number]", v = "[object Object]", x = "[object Promise]", L = "[object RegExp]", B = "[object Set]", U = "[object String]", A = "[object Symbol]", T = "[object WeakMap]", _ = "[object ArrayBuffer]", Y = "[object DataView]", ce = "[object Float32Array]", ne = "[object Float64Array]", q = "[object Int8Array]", m = "[object Int16Array]", I = "[object Int32Array]", N = "[object Uint8Array]", P = "[object Uint8ClampedArray]", W = "[object Uint16Array]", R = "[object Uint32Array]", le = /[\\^$.*+?()[\]{}|]/g, ue = /\w*$/, Xe = /^\[object .+?Constructor\]$/, C = /^(?:0|[1-9]\d*)$/, F = {};
  F[s] = F[i] = F[_] = F[Y] = F[a] = F[c] = F[ce] = F[ne] = F[q] = F[m] = F[I] = F[w] = F[g] = F[v] = F[L] = F[B] = F[U] = F[A] = F[N] = F[P] = F[W] = F[R] = !0, F[u] = F[h] = F[T] = !1;
  var re = typeof zn == "object" && zn && zn.Object === Object && zn, de = typeof self == "object" && self && self.Object === Object && self, Ne = re || de || Function("return this")(), Pe = t && !t.nodeType && t, Ht = Pe && !0 && e && !e.nodeType && e, Ge = Ht && Ht.exports === Pe;
  function _e(S, M) {
    return S.set(M[0], M[1]), S;
  }
  function Ue(S, M) {
    return S.add(M), S;
  }
  function _t(S, M) {
    for (var G = -1, me = S ? S.length : 0; ++G < me && M(S[G], G, S) !== !1; )
      ;
    return S;
  }
  function kn(S, M) {
    for (var G = -1, me = M.length, Xt = S.length; ++G < me; )
      S[Xt + G] = M[G];
    return S;
  }
  function ut(S, M, G, me) {
    for (var Xt = -1, $n = S ? S.length : 0; ++Xt < $n; )
      G = M(G, S[Xt], Xt, S);
    return G;
  }
  function Zt(S, M) {
    for (var G = -1, me = Array(S); ++G < S; )
      me[G] = M(G);
    return me;
  }
  function $t(S, M) {
    return S == null ? void 0 : S[M];
  }
  function z(S) {
    var M = !1;
    if (S != null && typeof S.toString != "function")
      try {
        M = !!(S + "");
      } catch {
      }
    return M;
  }
  function H(S) {
    var M = -1, G = Array(S.size);
    return S.forEach(function(me, Xt) {
      G[++M] = [Xt, me];
    }), G;
  }
  function Q(S, M) {
    return function(G) {
      return S(M(G));
    };
  }
  function se(S) {
    var M = -1, G = Array(S.size);
    return S.forEach(function(me) {
      G[++M] = me;
    }), G;
  }
  var he = Array.prototype, ft = Function.prototype, Me = Object.prototype, He = Ne["__core-js_shared__"], vt = function() {
    var S = /[^.]+$/.exec(He && He.keys && He.keys.IE_PROTO || "");
    return S ? "Symbol(src)_1." + S : "";
  }(), Ke = ft.toString, $e = Me.hasOwnProperty, Ze = Me.toString, Ye = RegExp(
    "^" + Ke.call($e).replace(le, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ve = Ge ? Ne.Buffer : void 0, Dt = Ne.Symbol, gn = Ne.Uint8Array, yn = Q(Object.getPrototypeOf, Object), Kn = Object.create, It = Me.propertyIsEnumerable, dn = he.splice, Ir = Object.getOwnPropertySymbols, zr = Ve ? Ve.isBuffer : void 0, mr = Q(Object.keys, Object), xt = rr(Ne, "DataView"), wn = rr(Ne, "Map"), Ft = rr(Ne, "Promise"), mn = rr(Ne, "Set"), kt = rr(Ne, "WeakMap"), Kt = rr(Object, "create"), Gr = Yn(xt), ls = Yn(wn), E = Yn(Ft), O = Yn(mn), K = Yn(kt), D = Dt ? Dt.prototype : void 0, J = D ? D.valueOf : void 0;
  function ee(S) {
    var M = -1, G = S ? S.length : 0;
    for (this.clear(); ++M < G; ) {
      var me = S[M];
      this.set(me[0], me[1]);
    }
  }
  function Te() {
    this.__data__ = Kt ? Kt(null) : {};
  }
  function ke(S) {
    return this.has(S) && delete this.__data__[S];
  }
  function Fe(S) {
    var M = this.__data__;
    if (Kt) {
      var G = M[S];
      return G === r ? void 0 : G;
    }
    return $e.call(M, S) ? M[S] : void 0;
  }
  function ht(S) {
    var M = this.__data__;
    return Kt ? M[S] !== void 0 : $e.call(M, S);
  }
  function $(S, M) {
    var G = this.__data__;
    return G[S] = Kt && M === void 0 ? r : M, this;
  }
  ee.prototype.clear = Te, ee.prototype.delete = ke, ee.prototype.get = Fe, ee.prototype.has = ht, ee.prototype.set = $;
  function pe(S) {
    var M = -1, G = S ? S.length : 0;
    for (this.clear(); ++M < G; ) {
      var me = S[M];
      this.set(me[0], me[1]);
    }
  }
  function ze() {
    this.__data__ = [];
  }
  function dt(S) {
    var M = this.__data__, G = Mn(M, S);
    if (G < 0)
      return !1;
    var me = M.length - 1;
    return G == me ? M.pop() : dn.call(M, G, 1), !0;
  }
  function Vt(S) {
    var M = this.__data__, G = Mn(M, S);
    return G < 0 ? void 0 : M[G][1];
  }
  function jt(S) {
    return Mn(this.__data__, S) > -1;
  }
  function fn(S, M) {
    var G = this.__data__, me = Mn(G, S);
    return me < 0 ? G.push([S, M]) : G[me][1] = M, this;
  }
  pe.prototype.clear = ze, pe.prototype.delete = dt, pe.prototype.get = Vt, pe.prototype.has = jt, pe.prototype.set = fn;
  function wt(S) {
    var M = -1, G = S ? S.length : 0;
    for (this.clear(); ++M < G; ) {
      var me = S[M];
      this.set(me[0], me[1]);
    }
  }
  function er() {
    this.__data__ = {
      hash: new ee(),
      map: new (wn || pe)(),
      string: new ee()
    };
  }
  function Kr(S) {
    return br(this, S).delete(S);
  }
  function ve(S) {
    return br(this, S).get(S);
  }
  function Jt(S) {
    return br(this, S).has(S);
  }
  function bo(S, M) {
    return br(this, S).set(S, M), this;
  }
  wt.prototype.clear = er, wt.prototype.delete = Kr, wt.prototype.get = ve, wt.prototype.has = Jt, wt.prototype.set = bo;
  function tr(S) {
    this.__data__ = new pe(S);
  }
  function xo() {
    this.__data__ = new pe();
  }
  function Vn(S) {
    return this.__data__.delete(S);
  }
  function Nn(S) {
    return this.__data__.get(S);
  }
  function bn(S) {
    return this.__data__.has(S);
  }
  function Ts(S, M) {
    var G = this.__data__;
    if (G instanceof pe) {
      var me = G.__data__;
      if (!wn || me.length < n - 1)
        return me.push([S, M]), this;
      G = this.__data__ = new wt(me);
    }
    return G.set(S, M), this;
  }
  tr.prototype.clear = xo, tr.prototype.delete = Vn, tr.prototype.get = Nn, tr.prototype.has = bn, tr.prototype.set = Ts;
  function So(S, M) {
    var G = To(S) || ct(S) ? Zt(S.length, String) : [], me = G.length, Xt = !!me;
    for (var $n in S)
      $e.call(S, $n) && !(Xt && ($n == "length" || bi($n, me))) && G.push($n);
    return G;
  }
  function yi(S, M, G) {
    var me = S[M];
    (!($e.call(S, M) && xi(me, G)) || G === void 0 && !(M in S)) && (S[M] = G);
  }
  function Mn(S, M) {
    for (var G = S.length; G--; )
      if (xi(S[G][0], M))
        return G;
    return -1;
  }
  function nr(S, M) {
    return S && gs(M, xe(M), S);
  }
  function us(S, M, G, me, Xt, $n, l) {
    var p;
    if (me && (p = $n ? me(S, Xt, $n, l) : me(S)), p !== void 0)
      return p;
    if (!X(S))
      return S;
    var y = To(S);
    if (y) {
      if (p = ko(S), !M)
        return ps(S, p);
    } else {
      var f = Lr(S), j = f == h || f == d;
      if (V(S))
        return Bs(S, M);
      if (f == v || f == s || j && !$n) {
        if (z(S))
          return $n ? S : {};
        if (p = Ps(j ? {} : S), !M)
          return mi(S, nr(p, S));
      } else {
        if (!F[f])
          return $n ? S : {};
        p = $o(S, f, us, M);
      }
    }
    l || (l = new tr());
    var ae = l.get(S);
    if (ae)
      return ae;
    if (l.set(S, p), !y)
      var Ee = G ? ha(S) : xe(S);
    return _t(Ee || S, function(Ae, Ce) {
      Ee && (Ce = Ae, Ae = S[Ce]), yi(p, Ce, us(Ae, M, G, me, Ce, S, l));
    }), p;
  }
  function Vr(S) {
    return X(S) ? Kn(S) : {};
  }
  function Xn(S, M, G) {
    var me = M(S);
    return To(S) ? me : kn(me, G(S));
  }
  function vo(S) {
    return Ze.call(S);
  }
  function Ao(S) {
    if (!X(S) || Cr(S))
      return !1;
    var M = te(S) || z(S) ? Ye : Xe;
    return M.test(Yn(S));
  }
  function ds(S) {
    if (!Lo(S))
      return mr(S);
    var M = [];
    for (var G in Object(S))
      $e.call(S, G) && G != "constructor" && M.push(G);
    return M;
  }
  function Bs(S, M) {
    if (M)
      return S.slice();
    var G = new S.constructor(S.length);
    return S.copy(G), G;
  }
  function fs(S) {
    var M = new S.constructor(S.byteLength);
    return new gn(M).set(new gn(S)), M;
  }
  function un(S, M) {
    var G = M ? fs(S.buffer) : S.buffer;
    return new S.constructor(G, S.byteOffset, S.byteLength);
  }
  function hs(S, M, G) {
    var me = M ? G(H(S), !0) : H(S);
    return ut(me, _e, new S.constructor());
  }
  function wi(S) {
    var M = new S.constructor(S.source, ue.exec(S));
    return M.lastIndex = S.lastIndex, M;
  }
  function Eo(S, M, G) {
    var me = M ? G(se(S), !0) : se(S);
    return ut(me, Ue, new S.constructor());
  }
  function Ns(S) {
    return J ? Object(J.call(S)) : {};
  }
  function Ms(S, M) {
    var G = M ? fs(S.buffer) : S.buffer;
    return new S.constructor(G, S.byteOffset, S.length);
  }
  function ps(S, M) {
    var G = -1, me = S.length;
    for (M || (M = Array(me)); ++G < me; )
      M[G] = S[G];
    return M;
  }
  function gs(S, M, G, me) {
    G || (G = {});
    for (var Xt = -1, $n = M.length; ++Xt < $n; ) {
      var l = M[Xt], p = void 0;
      yi(G, l, p === void 0 ? S[l] : p);
    }
    return G;
  }
  function mi(S, M) {
    return gs(S, Qt(S), M);
  }
  function ha(S) {
    return Xn(S, xe, Qt);
  }
  function br(S, M) {
    var G = S.__data__;
    return Io(M) ? G[typeof M == "string" ? "string" : "hash"] : G.map;
  }
  function rr(S, M) {
    var G = $t(S, M);
    return Ao(G) ? G : void 0;
  }
  var Qt = Ir ? Q(Ir, Object) : Ie, Lr = vo;
  (xt && Lr(new xt(new ArrayBuffer(1))) != Y || wn && Lr(new wn()) != w || Ft && Lr(Ft.resolve()) != x || mn && Lr(new mn()) != B || kt && Lr(new kt()) != T) && (Lr = function(S) {
    var M = Ze.call(S), G = M == v ? S.constructor : void 0, me = G ? Yn(G) : void 0;
    if (me)
      switch (me) {
        case Gr:
          return Y;
        case ls:
          return w;
        case E:
          return x;
        case O:
          return B;
        case K:
          return T;
      }
    return M;
  });
  function ko(S) {
    var M = S.length, G = S.constructor(M);
    return M && typeof S[0] == "string" && $e.call(S, "index") && (G.index = S.index, G.input = S.input), G;
  }
  function Ps(S) {
    return typeof S.constructor == "function" && !Lo(S) ? Vr(yn(S)) : {};
  }
  function $o(S, M, G, me) {
    var Xt = S.constructor;
    switch (M) {
      case _:
        return fs(S);
      case a:
      case c:
        return new Xt(+S);
      case Y:
        return un(S, me);
      case ce:
      case ne:
      case q:
      case m:
      case I:
      case N:
      case P:
      case W:
      case R:
        return Ms(S, me);
      case w:
        return hs(S, me, G);
      case g:
      case U:
        return new Xt(S);
      case L:
        return wi(S);
      case B:
        return Eo(S, me, G);
      case A:
        return Ns(S);
    }
  }
  function bi(S, M) {
    return M = M ?? o, !!M && (typeof S == "number" || C.test(S)) && S > -1 && S % 1 == 0 && S < M;
  }
  function Io(S) {
    var M = typeof S;
    return M == "string" || M == "number" || M == "symbol" || M == "boolean" ? S !== "__proto__" : S === null;
  }
  function Cr(S) {
    return !!vt && vt in S;
  }
  function Lo(S) {
    var M = S && S.constructor, G = typeof M == "function" && M.prototype || Me;
    return S === G;
  }
  function Yn(S) {
    if (S != null) {
      try {
        return Ke.call(S);
      } catch {
      }
      try {
        return S + "";
      } catch {
      }
    }
    return "";
  }
  function Co(S) {
    return us(S, !0, !0);
  }
  function xi(S, M) {
    return S === M || S !== S && M !== M;
  }
  function ct(S) {
    return k(S) && $e.call(S, "callee") && (!It.call(S, "callee") || Ze.call(S) == s);
  }
  var To = Array.isArray;
  function b(S) {
    return S != null && Be(S.length) && !te(S);
  }
  function k(S) {
    return Se(S) && b(S);
  }
  var V = zr || st;
  function te(S) {
    var M = X(S) ? Ze.call(S) : "";
    return M == h || M == d;
  }
  function Be(S) {
    return typeof S == "number" && S > -1 && S % 1 == 0 && S <= o;
  }
  function X(S) {
    var M = typeof S;
    return !!S && (M == "object" || M == "function");
  }
  function Se(S) {
    return !!S && typeof S == "object";
  }
  function xe(S) {
    return b(S) ? So(S) : ds(S);
  }
  function Ie() {
    return [];
  }
  function st() {
    return !1;
  }
  e.exports = Co;
})(fl, fl.exports);
var Gv = fl.exports;
const $w = /* @__PURE__ */ ey(Gv);
var yd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(yd || (yd = {}));
function Kv(e, t) {
  return { type: yd.Address, version: e, hash160: t };
}
function Vv(e) {
  return di.c32address(e.version, e.hash160);
}
const Xv = (e) => wv(mw(e)), Yv = (e) => Oe(Xv(e));
rn.hmacSha256Sync = (e, ...t) => {
  const n = yw.create(mw, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function qv(e, t = "mainnet") {
  t = fw(t), e = typeof e == "string" ? bt(e) : e;
  const n = lv(vs.P2PKH, t), r = Kv(n, Yv(e));
  return Vv(r);
}
function Wv(e, t) {
  const n = Bn.decodeToken(e), r = n.payload;
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
  const o = r.issuer.publicKey, s = qv(o);
  if (t !== o) {
    if (t !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new Bn.TokenVerifier(n.header.alg, o);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function Zv(e, t = null) {
  let n;
  t ? n = Wv(e, t) : n = Bn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const o = n.payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    o.hasOwnProperty("claim") && (r = o.claim);
  }
  return r;
}
const Zp = "_blockstackDidCheckEchoReply", Jv = "echoReply", Qv = "authContinuation";
function eA(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [o, s] = r.split("=");
    return n[o] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function tA() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[Zp];
  if (typeof t == "boolean")
    return t;
  const n = eA(e.location.search), r = n[Jv];
  if (r) {
    e[Zp] = !0;
    const o = `echo-reply-${r}`;
    return e.localStorage.setItem(o, "success"), e.setTimeout(() => {
      const s = n[Qv];
      e.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class wd {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new ly();
    else
      throw new x1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Np(t.sessionOptions) : this.store = new Np() : t ? this.store = new Bp(t.sessionOptions) : this.store = new Bp();
  }
  makeAuthRequestToken(t, n, r, o, s, i = v1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new rd("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), o = o || c.scopes, s = s || c.appDomain, FS(t, n, r, o, s, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = DS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = ff("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (tA())
        return Mi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      Mi.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = K1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new lc("Existing user session found.");
    const o = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Bn.decodeToken(t).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await KS(t))
      throw new lc("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (mu(s.version, "1.1.0"))
      if (o !== void 0 && o != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await Cp(o, s.private_key);
          } catch {
            if (Mi.warn("Failed decryption of appPrivateKey, will try to use as given"), !rn.isValidPrivateKey(s.private_key))
              throw new lc("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Cp(o, c);
          } catch {
            Mi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new lc("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = P1, h;
    mu(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), mu(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (h = s.associationToken);
    const d = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: lw(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, w = s.profile_url;
    if (!d.profile && w) {
      const g = await n(w);
      if (!g.ok)
        d.profile = Object.assign({}, w1);
      else {
        const v = await g.text(), x = JSON.parse(v);
        d.profile = Zv(x[0].token);
      }
    } else
      d.profile = s.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new rd("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Px(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), _x(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
wd.prototype.makeAuthRequest = wd.prototype.makeAuthRequestToken;
const nA = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], rA = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = nA(), n = e.filter((r) => t.find((s) => s.id === r.id) ? !1 : !!Vl(r.id));
  return t.concat(n);
}, Vl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), Iw = "STX_PROVIDER", Wo = () => typeof window > "u" ? null : window.localStorage.getItem(Iw), sA = (e) => {
  typeof window < "u" && window.localStorage.setItem(Iw, e);
}, oA = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function iA(e, t) {
  const n = {};
  return Object.assign(n, oA, t), await fetch(e, n);
}
function aA(e) {
  let t = iA, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function cA(...e) {
  const { fetchLib: t, middlewares: n } = aA(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
var Ji;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ji || (Ji = {}));
var Zo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Zo || (Zo = {}));
var Jp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Jp || (Jp = {}));
const lA = "https://api.mainnet.hiro.so", uA = "https://api.testnet.hiro.so", dA = "http://localhost:3999", fA = ["mainnet", "testnet", "devnet", "mocknet"];
class Jo {
  constructor(t) {
    this.version = Zo.Mainnet, this.chainId = Ji.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Zo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? cA();
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
Jo.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new md();
    case "testnet":
      return new bd();
    case "devnet":
      return new hA();
    case "mocknet":
      return new Lw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${fA.join(", ")}`);
  }
};
Jo.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Jo.fromName(e);
class md extends Jo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? lA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Zo.Mainnet, this.chainId = Ji.Mainnet;
  }
}
class bd extends Jo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? uA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Zo.Testnet, this.chainId = Ji.Testnet;
  }
}
class Lw extends Jo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? dA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Zo.Testnet, this.chainId = Ji.Testnet;
  }
}
const hA = Lw;
var Qo;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Qo || (Qo = {}));
var hl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(hl || (hl = {}));
Qo.Mainnet;
var ei;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ei || (ei = {}));
var ti;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ti || (ti = {}));
ei.Mainnet;
const pA = {
  chainId: Qo.Mainnet,
  transactionVersion: ei.Mainnet,
  peerNetworkId: hl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ti.MainnetSingleSig,
    multiSig: ti.MainnetMultiSig
  },
  client: { baseUrl: iy }
}, xd = {
  chainId: Qo.Testnet,
  transactionVersion: ei.Testnet,
  peerNetworkId: hl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ti.TestnetSingleSig,
    multiSig: ti.TestnetMultiSig
  },
  client: { baseUrl: ay }
}, Yc = {
  ...xd,
  addressVersion: { ...xd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: cy }
}, gA = {
  ...Yc,
  addressVersion: { ...Yc.addressVersion },
  client: { ...Yc.client }
};
function yA(e) {
  switch (e) {
    case "mainnet":
      return pA;
    case "testnet":
      return xd;
    case "devnet":
      return Yc;
    case "mocknet":
      return gA;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function wA(e) {
  return typeof e == "string" ? yA(e) : e;
}
function mA(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const Qp = /* @__PURE__ */ new Map();
function Cw(e, t) {
  const n = Qp.get(e);
  if (n !== void 0)
    return n(t);
  const r = mA(e);
  return Qp.set(e, r), Cw(e, t);
}
let Ot = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? bt(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return j1(this.readBytes(4), 0);
  }
  readUInt8() {
    return D1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return O1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Oe(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Oe(n);
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
    if (Cw(t, r))
      return r;
    throw n(r);
  }
};
const bA = 128, xA = 128, Tw = 16, jo = 32, Sd = 80, Xl = 65, SA = 32, vA = 64, pl = 34, AA = 1 + 16 * 1024 * 1024, EA = 165, kA = 16, $A = 16, IA = 20, LA = $A + 2 + IA, CA = LA + 4, TA = AA + (EA + kA * CA);
var Et;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Et || (Et = {}));
var vd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(vd || (vd = {}));
var lr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(lr || (lr = {}));
const ku = ["onChainOnly", "offChainOnly", "any"];
ku[0] + "", lr.OnChainOnly, ku[1] + "", lr.OffChainOnly, ku[2] + "", lr.Any, lr.OnChainOnly + "", lr.OnChainOnly, lr.OffChainOnly + "", lr.OffChainOnly, lr.Any + "", lr.Any;
var gl;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(gl || (gl = {}));
var Rt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Rt || (Rt = {}));
var tn;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(tn || (tn = {}));
var Mt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Mt || (Mt = {}));
var qt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(qt || (qt = {}));
var Na;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Na || (Na = {}));
var Ad;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Ad || (Ad = {}));
var Ed;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Ed || (Ed = {}));
var Rn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Rn || (Rn = {}));
var e0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(e0 || (e0 = {}));
var kd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(kd || (kd = {}));
var _r;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(_r || (_r = {}));
var t0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(t0 || (t0 = {}));
let Yl = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Pi = class extends Yl {
  constructor(t) {
    super(t);
  }
}, Fn = class extends Yl {
  constructor(t) {
    super(t);
  }
}, yl = class extends Yl {
  constructor(t) {
    super(t);
  }
}, Uo = class extends Yl {
  constructor(t) {
    super(t);
  }
};
function $d(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function BA(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Bw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function NA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  $d(e.outputLen), $d(e.blockLen);
}
function MA(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function PA(e, t) {
  Bw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Oo = {
  number: $d,
  bool: BA,
  bytes: Bw,
  hash: NA,
  exists: MA,
  output: PA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $u = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), qr = (e, t) => e << 32 - t | e >>> t, _A = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_A)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function UA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function _f(e) {
  if (typeof e == "string" && (e = UA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Nw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function fi(e) {
  const t = (r) => e().update(_f(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Mw = class extends Nw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Oo.hash(t);
    const r = _f(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Oo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Oo.exists(this), Oo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Pw = (e, t, n) => new Mw(e, t).update(n).digest();
Pw.create = (e, t) => new Mw(e, t);
function OA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Uf = class extends Nw {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = $u(this.buffer);
  }
  update(t) {
    Oo.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = _f(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = $u(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Oo.exists(this), Oo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    OA(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = $u(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const HA = (e, t, n) => e & t ^ ~e & n, DA = (e, t, n) => e & t ^ e & n ^ t & n, FA = new Uint32Array([
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
]), Ys = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), qs = new Uint32Array(64);
let _w = class extends Uf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ys[0] | 0, this.B = Ys[1] | 0, this.C = Ys[2] | 0, this.D = Ys[3] | 0, this.E = Ys[4] | 0, this.F = Ys[5] | 0, this.G = Ys[6] | 0, this.H = Ys[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      qs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = qs[d - 15], g = qs[d - 2], v = qr(w, 7) ^ qr(w, 18) ^ w >>> 3, x = qr(g, 17) ^ qr(g, 19) ^ g >>> 10;
      qs[d] = x + qs[d - 7] + v + qs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = qr(a, 6) ^ qr(a, 11) ^ qr(a, 25), g = h + w + HA(a, c, u) + FA[d] + qs[d] | 0, x = (qr(r, 2) ^ qr(r, 13) ^ qr(r, 22)) + DA(r, o, s) | 0;
      h = u, u = c, c = a, a = i + g | 0, i = s, s = o, o = r, r = g + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    qs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, jA = class extends _w {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Of = fi(() => new _w());
fi(() => new jA());
const RA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Uw = Uint8Array.from({ length: 16 }, (e, t) => t), zA = Uw.map((e) => (9 * e + 5) % 16);
let Hf = [Uw], Df = [zA];
for (let e = 0; e < 4; e++)
  for (let t of [Hf, Df])
    t.push(t[e].map((n) => RA[n]));
const Ow = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), GA = Hf.map((e, t) => e.map((n) => Ow[t][n])), KA = Df.map((e, t) => e.map((n) => Ow[t][n])), VA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), XA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), vc = (e, t) => e << t | e >>> 32 - t;
function n0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Ac = new Uint32Array(16);
let YA = class extends Uf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Ac[g] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let g = 0; g < 5; g++) {
      const v = 4 - g, x = VA[g], L = XA[g], B = Hf[g], U = Df[g], A = GA[g], T = KA[g];
      for (let _ = 0; _ < 16; _++) {
        const Y = vc(r + n0(g, s, a, u) + Ac[B[_]] + x, A[_]) + d | 0;
        r = d, d = u, u = vc(a, 10) | 0, a = s, s = Y;
      }
      for (let _ = 0; _ < 16; _++) {
        const Y = vc(o + n0(v, i, c, h) + Ac[U[_]] + L, T[_]) + w | 0;
        o = w, w = h, h = vc(c, 10) | 0, c = i, i = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Ac.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const qA = fi(() => new YA()), Ec = BigInt(2 ** 32 - 1), Id = BigInt(32);
function Hw(e, t = !1) {
  return t ? { h: Number(e & Ec), l: Number(e >> Id & Ec) } : { h: Number(e >> Id & Ec) | 0, l: Number(e & Ec) | 0 };
}
function WA(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Hw(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const ZA = (e, t) => BigInt(e >>> 0) << Id | BigInt(t >>> 0), JA = (e, t, n) => e >>> n, QA = (e, t, n) => e << 32 - n | t >>> n, eE = (e, t, n) => e >>> n | t << 32 - n, tE = (e, t, n) => e << 32 - n | t >>> n, nE = (e, t, n) => e << 64 - n | t >>> n - 32, rE = (e, t, n) => e >>> n - 32 | t << 64 - n, sE = (e, t) => t, oE = (e, t) => e, iE = (e, t, n) => e << n | t >>> 32 - n, aE = (e, t, n) => t << n | e >>> 32 - n, cE = (e, t, n) => t << n - 32 | e >>> 64 - n, lE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function uE(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const dE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), fE = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, hE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), pE = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, gE = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), yE = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, et = {
  fromBig: Hw,
  split: WA,
  toBig: ZA,
  shrSH: JA,
  shrSL: QA,
  rotrSH: eE,
  rotrSL: tE,
  rotrBH: nE,
  rotrBL: rE,
  rotr32H: sE,
  rotr32L: oE,
  rotlSH: iE,
  rotlSL: aE,
  rotlBH: cE,
  rotlBL: lE,
  add: uE,
  add3L: dE,
  add3H: fE,
  add4L: hE,
  add4H: pE,
  add5H: yE,
  add5L: gE
}, [wE, mE] = et.split([
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
].map((e) => BigInt(e))), Ws = new Uint32Array(80), Zs = new Uint32Array(80);
let ql = class extends Uf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: g, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, w, g, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, w, g, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ws[A] = t.getUint32(n), Zs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Ws[A - 15] | 0, _ = Zs[A - 15] | 0, Y = et.rotrSH(T, _, 1) ^ et.rotrSH(T, _, 8) ^ et.shrSH(T, _, 7), ce = et.rotrSL(T, _, 1) ^ et.rotrSL(T, _, 8) ^ et.shrSL(T, _, 7), ne = Ws[A - 2] | 0, q = Zs[A - 2] | 0, m = et.rotrSH(ne, q, 19) ^ et.rotrBH(ne, q, 61) ^ et.shrSH(ne, q, 6), I = et.rotrSL(ne, q, 19) ^ et.rotrBL(ne, q, 61) ^ et.shrSL(ne, q, 6), N = et.add4L(ce, I, Zs[A - 7], Zs[A - 16]), P = et.add4H(N, Y, m, Ws[A - 7], Ws[A - 16]);
      Ws[A] = P | 0, Zs[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: g, Fl: v, Gh: x, Gl: L, Hh: B, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = et.rotrSH(d, w, 14) ^ et.rotrSH(d, w, 18) ^ et.rotrBH(d, w, 41), _ = et.rotrSL(d, w, 14) ^ et.rotrSL(d, w, 18) ^ et.rotrBL(d, w, 41), Y = d & g ^ ~d & x, ce = w & v ^ ~w & L, ne = et.add5L(U, _, ce, mE[A], Zs[A]), q = et.add5H(ne, B, T, Y, wE[A], Ws[A]), m = ne | 0, I = et.rotrSH(r, o, 28) ^ et.rotrBH(r, o, 34) ^ et.rotrBH(r, o, 39), N = et.rotrSL(r, o, 28) ^ et.rotrBL(r, o, 34) ^ et.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      B = x | 0, U = L | 0, x = g | 0, L = v | 0, g = d | 0, v = w | 0, { h: d, l: w } = et.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = et.add3L(m, N, W);
      r = et.add3H(R, q, I, P), o = R | 0;
    }
    ({ h: r, l: o } = et.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = et.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = et.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = et.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: g, l: v } = et.add(this.Fh | 0, this.Fl | 0, g | 0, v | 0), { h: x, l: L } = et.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: U } = et.add(this.Hh | 0, this.Hl | 0, B | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, w, g, v, x, L, B, U);
  }
  roundClean() {
    Ws.fill(0), Zs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, bE = class extends ql {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, xE = class extends ql {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, SE = class extends ql {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
fi(() => new ql());
fi(() => new bE());
const vE = fi(() => new xE());
fi(() => new SE());
var gt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(gt || (gt = {}));
var pn;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(pn || (pn = {}));
function Ff(e) {
  return pn[e];
}
const AE = () => ({ type: gt.BoolTrue }), EE = () => ({ type: gt.BoolFalse }), kE = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: gt.Buffer, value: Oe(e) };
}, r0 = BigInt("0xffffffffffffffffffffffffffffffff"), $E = BigInt(0), s0 = BigInt("0x7fffffffffffffffffffffffffffffff"), o0 = BigInt("-170141183460469231731687303715884105728"), IE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = od(bt(e))), Qn(e, Uint8Array) && (e = od(e));
  const t = Hn(e);
  if (t > s0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${s0}`);
  if (t < o0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${o0}`);
  return { type: gt.Int, value: t };
}, LE = (e) => {
  const t = Hn(e);
  if (t < $E)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > r0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${r0}`);
  return { type: gt.UInt, value: t };
};
function CE(e) {
  return { type: gt.List, value: e };
}
function Dw() {
  return { type: gt.OptionalNone };
}
function Fw(e) {
  return { type: gt.OptionalSome, value: e };
}
var we;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(we || (we = {}));
function TE() {
  return {
    type: we.Address,
    version: ti.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function i0(e) {
  if (e && qw(e, pl))
    throw new Error(`Memo exceeds maximum length of ${pl} bytes`);
  return { type: we.MemoString, content: e };
}
function jf(e, t) {
  return {
    type: we.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Ld(e) {
  if (bt(e).byteLength != Xl)
    throw Error("Invalid signature");
  return {
    type: we.MessageSignature,
    data: e
  };
}
function BE(e, t, n) {
  return typeof e == "string" && (e = XE(e)), typeof n == "string" && (n = i0(n)), {
    type: we.Payload,
    payloadType: Et.TokenTransfer,
    recipient: e,
    amount: Hn(t),
    memo: n ?? i0("")
  };
}
function NE(e, t, n, r) {
  return typeof t == "string" && (t = Fr(t)), typeof n == "string" && (n = Fr(n)), {
    type: we.Payload,
    payloadType: Et.ContractCall,
    contractAddress: typeof e == "string" ? mo(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function ME(e) {
  return Fr(e, 4, 1e5);
}
function a0(e, t, n) {
  return typeof e == "string" && (e = Fr(e)), typeof t == "string" && (t = ME(t)), typeof n == "number" ? {
    type: we.Payload,
    payloadType: Et.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: we.Payload,
    payloadType: Et.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function PE() {
  return { type: we.Payload, payloadType: Et.PoisonMicroblock };
}
function c0(e, t) {
  if (e.byteLength != jo)
    throw Error(`Coinbase buffer size must be ${jo} bytes`);
  return t != null ? {
    type: we.Payload,
    payloadType: Et.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: we.Payload,
    payloadType: Et.Coinbase,
    coinbaseBytes: e
  };
}
function _E(e, t, n) {
  if (e.byteLength != jo)
    throw Error(`Coinbase buffer size must be ${jo} bytes`);
  if (n.byteLength != Sd)
    throw Error(`VRF proof buffer size must be ${Sd} bytes`);
  return {
    type: we.Payload,
    payloadType: Et.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === gt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function UE(e, t, n, r, o, s, i) {
  return {
    type: we.Payload,
    payloadType: Et.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: o,
    cause: s,
    publicKeyHash: i
  };
}
function Fr(e, t, n) {
  const r = t || 1, o = n || bA;
  if (qw(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: we.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function OE(e, t, n) {
  return {
    type: we.Asset,
    address: mo(e),
    contractName: Fr(t),
    assetName: Fr(n)
  };
}
function mo(e) {
  const t = di.c32addressDecode(e);
  return {
    type: we.Address,
    version: t[0],
    hash160: t[1]
  };
}
function HE(e, t) {
  const n = mo(e), r = Fr(t);
  return {
    type: we.Principal,
    prefix: Rn.Contract,
    address: n,
    contractName: r
  };
}
function DE(e) {
  const t = mo(e);
  return {
    type: we.Principal,
    prefix: Rn.Standard,
    address: t
  };
}
function _i(e, t) {
  return {
    pubKeyEncoding: e,
    type: we.TransactionAuthField,
    contents: t
  };
}
function xs(e) {
  switch (e.type) {
    case we.Address:
      return tc(e);
    case we.Principal:
      return jw(e);
    case we.LengthPrefixedString:
      return ea(e);
    case we.MemoString:
      return jE(e);
    case we.Asset:
      return zw(e);
    case we.PostCondition:
      return Kw(e);
    case we.PublicKey:
      return Bd(e);
    case we.LengthPrefixedList:
      return Rf(e);
    case we.Payload:
      return Vw(e);
    case we.TransactionAuthField:
      return VE(e);
    case we.MessageSignature:
      return zf(e);
  }
}
function tc(e) {
  const t = [];
  return t.push(bt(qa(e.version, 1))), t.push(bt(e.hash160)), cn(t);
}
function Qi(e) {
  const t = Qn(e, Ot) ? e : new Ot(e), n = Pl(Oe(t.readBytes(1))), r = Oe(t.readBytes(20));
  return { type: we.Address, version: n, hash160: r };
}
function jw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === Rn.Standard || e.prefix === Rn.Contract) && t.push(tc(e.address)), e.prefix === Rn.Contract && t.push(ea(e.contractName)), cn(t);
}
function FE(e) {
  const t = Qn(e, Ot) ? e : new Ot(e), n = t.readUInt8Enum(Rn, (s) => {
    throw new Fn(`Unexpected Principal payload type: ${s}`);
  });
  if (n === Rn.Origin)
    return { type: we.Principal, prefix: n };
  const r = Qi(t);
  if (n === Rn.Standard)
    return { type: we.Principal, prefix: n, address: r };
  const o = Er(t);
  return {
    type: we.Principal,
    prefix: n,
    address: r,
    contractName: o
  };
}
function ea(e) {
  const t = [], n = ai(e.content), r = n.byteLength;
  return t.push(bt(qa(r, e.lengthPrefixBytes))), t.push(n), cn(t);
}
function Er(e, t, n) {
  t = t || 1;
  const r = Qn(e, Ot) ? e : new Ot(e), o = Pl(Oe(r.readBytes(t))), s = Wa(r.readBytes(o));
  return Fr(s, t, n ?? 128);
}
function jE(e) {
  const t = [], n = ai(e.content), r = gk(Oe(n), pl * 2);
  return t.push(bt(r)), cn(t);
}
function Rw(e) {
  const t = Qn(e, Ot) ? e : new Ot(e);
  let n = Wa(t.readBytes(pl));
  return n = n.replace(/\u0000*$/, ""), { type: we.MemoString, content: n };
}
function zw(e) {
  const t = [];
  return t.push(tc(e.address)), t.push(ea(e.contractName)), t.push(ea(e.assetName)), cn(t);
}
function Cd(e) {
  const t = Qn(e, Ot) ? e : new Ot(e);
  return {
    type: we.Asset,
    address: Qi(t),
    contractName: Er(t),
    assetName: Er(t)
  };
}
function Rf(e) {
  const t = e.values, n = [];
  n.push(bt(qa(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(xs(r));
  return cn(n);
}
function Gw(e, t, n) {
  const r = Qn(e, Ot) ? e : new Ot(e), o = Pl(Oe(r.readBytes(4))), s = [];
  for (let i = 0; i < o; i++)
    switch (t) {
      case we.Address:
        s.push(Qi(r));
        break;
      case we.LengthPrefixedString:
        s.push(Er(r));
        break;
      case we.MemoString:
        s.push(Rw(r));
        break;
      case we.Asset:
        s.push(Cd(r));
        break;
      case we.PostCondition:
        s.push(zE(r));
        break;
      case we.PublicKey:
        s.push(Nd(r));
        break;
      case we.TransactionAuthField:
        s.push(KE(r));
        break;
    }
  return jf(s, n);
}
function RE(e) {
  return Oe(Kw(e));
}
function Kw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(jw(e.principal)), (e.conditionType === Rt.Fungible || e.conditionType === Rt.NonFungible) && t.push(zw(e.asset)), e.conditionType === Rt.NonFungible && t.push(ns(e.assetName)), t.push(e.conditionCode), e.conditionType === Rt.STX || e.conditionType === Rt.Fungible || e.conditionType === Rt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Pi("The post-condition amount may not be larger than 8 bytes");
    t.push(yo(e.amount, 8));
  }
  return cn(t);
}
function zE(e) {
  const t = Qn(e, Ot) ? e : new Ot(e), n = t.readUInt8Enum(Rt, (a) => {
    throw new Fn(`Could not read ${a} as PostConditionType`);
  }), r = FE(t);
  let o, s, i;
  switch (n) {
    case Rt.STX:
      return o = t.readUInt8Enum(Na, (c) => {
        throw new Fn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Oe(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: Rt.STX,
        principal: r,
        conditionCode: o,
        amount: i
      };
    case Rt.Fungible:
      return s = Cd(t), o = t.readUInt8Enum(Na, (c) => {
        throw new Fn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Oe(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: Rt.Fungible,
        principal: r,
        conditionCode: o,
        amount: i,
        asset: s
      };
    case Rt.NonFungible:
      s = Cd(t);
      const a = Qr(t);
      return o = t.readUInt8Enum(Ad, (c) => {
        throw new Fn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: we.PostCondition,
        conditionType: Rt.NonFungible,
        principal: r,
        conditionCode: o,
        asset: s,
        assetName: a
      };
    case Rt.Staking:
      return o = t.readUInt8Enum(Na, (c) => {
        throw new Fn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Oe(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: Rt.Staking,
        principal: r,
        conditionCode: o,
        amount: i
      };
    case Rt.PoX: {
      const c = t.readUInt8Enum(Ed, (u) => {
        throw new Fn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: we.PostCondition,
        conditionType: Rt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Vw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case Et.TokenTransfer:
      t.push(ns(e.recipient)), t.push(yo(e.amount, 8)), t.push(xs(e.memo));
      break;
    case Et.ContractCall:
      t.push(xs(e.contractAddress)), t.push(xs(e.contractName)), t.push(xs(e.functionName));
      const n = new Uint8Array(4);
      Ko(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(ns(r));
      });
      break;
    case Et.SmartContract:
      t.push(xs(e.contractName)), t.push(xs(e.codeBody));
      break;
    case Et.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(xs(e.contractName)), t.push(xs(e.codeBody));
      break;
    case Et.PoisonMicroblock:
      break;
    case Et.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case Et.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(ns(e.recipient));
      break;
    case Et.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(ns(e.recipient ? Fw(e.recipient) : Dw())), t.push(e.vrfProof);
      break;
    case Et.TenureChange:
      t.push(bt(e.tenureHash)), t.push(bt(e.previousTenureHash)), t.push(bt(e.burnViewHash)), t.push(bt(e.previousTenureEnd)), t.push(Ko(new Uint8Array(4), e.previousTenureBlocks)), t.push(F1(new Uint8Array(1), e.cause)), t.push(bt(e.publicKeyHash));
      break;
  }
  return cn(t);
}
function GE(e) {
  const t = Qn(e, Ot) ? e : new Ot(e);
  switch (t.readUInt8Enum(Et, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Et.TokenTransfer:
      const r = Qr(t), o = Hn(t.readBytes(8)), s = Rw(t);
      return BE(r, o, s);
    case Et.ContractCall:
      const i = Qi(t), a = Er(t), c = Er(t), u = [], h = t.readUInt32BE();
      for (let T = 0; T < h; T++) {
        const _ = Qr(t);
        u.push(_);
      }
      return NE(i, a, c, u);
    case Et.SmartContract:
      const d = Er(t), w = Er(t, 4, 1e5);
      return a0(d, w);
    case Et.VersionedSmartContract: {
      const T = t.readUInt8Enum(vd, (ce) => {
        throw new Error(`Cannot recognize ClarityVersion: ${ce}`);
      }), _ = Er(t), Y = Er(t, 4, TA);
      return a0(_, Y, T);
    }
    case Et.PoisonMicroblock:
      return PE();
    case Et.Coinbase: {
      const T = t.readBytes(jo);
      return c0(T);
    }
    case Et.CoinbaseToAltRecipient: {
      const T = t.readBytes(jo), _ = Qr(t);
      return c0(T, _);
    }
    case Et.NakamotoCoinbase: {
      const T = t.readBytes(jo), _ = Qr(t), Y = t.readBytes(Sd);
      return _E(T, _, Y);
    }
    case Et.TenureChange:
      const g = Oe(t.readBytes(20)), v = Oe(t.readBytes(20)), x = Oe(t.readBytes(20)), L = Oe(t.readBytes(32)), B = t.readUInt32BE(), U = t.readUInt8Enum(kd, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), A = Oe(t.readBytes(20));
      return UE(g, v, x, L, B, U, A);
  }
}
function Td(e) {
  const t = Qn(e, Ot) ? e : new Ot(e);
  return Ld(Oe(t.readBytes(Xl)));
}
function KE(e) {
  const t = Qn(e, Ot) ? e : new Ot(e), n = t.readUInt8Enum(_r, (r) => {
    throw new Fn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case _r.PublicKeyCompressed:
      return _i(qt.Compressed, Nd(t));
    case _r.PublicKeyUncompressed:
      return _i(qt.Uncompressed, ca($k(Nd(t).data)));
    case _r.SignatureCompressed:
      return _i(qt.Compressed, Td(t));
    case _r.SignatureUncompressed:
      return _i(qt.Uncompressed, Td(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function zf(e) {
  return bt(e.data);
}
function VE(e) {
  const t = [];
  switch (e.contents.type) {
    case we.PublicKey:
      t.push(e.pubKeyEncoding === qt.Compressed ? _r.PublicKeyCompressed : _r.PublicKeyUncompressed), t.push(bt(kk(e.contents.data)));
      break;
    case we.MessageSignature:
      t.push(e.pubKeyEncoding === qt.Compressed ? _r.SignatureCompressed : _r.SignatureUncompressed), t.push(zf(e.contents));
      break;
  }
  return cn(t);
}
function Bd(e) {
  return e.data.slice();
}
function Nd(e) {
  const t = Qn(e, Ot) ? e : new Ot(e), n = t.readUInt8(), r = n === 4 ? vA : SA;
  return ca(cn([n, t.readBytes(r)]));
}
function Gf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Mt.P2PKH || t === Mt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Mt.P2WPKH || t === Mt.P2WSH || t === Mt.P2WSHNonSequential) && !r.map((o) => o.data).every(la))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Mt.P2PKH:
      return kc(e, yk(r[0].data));
    case Mt.P2WPKH:
      return kc(e, wk(r[0].data));
    case Mt.P2SH:
    case Mt.P2SHNonSequential:
      return kc(e, mk(n, r.map(Bd)));
    case Mt.P2WSH:
    case Mt.P2WSHNonSequential:
      return kc(e, bk(n, r.map(Bd)));
  }
}
function kc(e, t) {
  return { type: we.Address, version: e, hash160: t };
}
function Kf(e) {
  return di.c32address(e.version, e.hash160);
}
function l0(e) {
  const [t, n, r] = e.split(/\.|::/);
  return OE(t, n, r);
}
function ba(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return HE(t, n);
  } else
    return DE(e);
}
function XE(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return WE(t, n);
  } else
    return YE(e);
}
function YE(e) {
  const t = mo(e);
  return { type: gt.PrincipalStandard, value: Kf(t) };
}
function qE(e) {
  return { type: gt.PrincipalStandard, value: Kf(e) };
}
function WE(e, t) {
  const n = mo(e), r = Fr(t);
  return Xw(n, r);
}
function Xw(e, t) {
  if (ai(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: gt.PrincipalContract,
    value: `${Kf(e)}.${t.content}`
  };
}
function ZE(e) {
  return { type: gt.ResponseErr, value: e };
}
function JE(e) {
  return { type: gt.ResponseOk, value: e };
}
const QE = (e) => ({ type: gt.StringASCII, value: e }), ek = (e) => ({ type: gt.StringUTF8, value: e });
function tk(e) {
  for (const t in e)
    if (!xk(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: gt.Tuple, value: e };
}
function Qr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Ot(bt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Ot(e) : t = e;
  switch (t.readUInt8Enum(pn, (r) => {
    throw new Fn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case pn.int:
      return IE(od(t.readBytes(16)));
    case pn.uint:
      return LE(t.readBytes(16));
    case pn.buffer:
      const r = t.readUInt32BE();
      return kE(t.readBytes(r));
    case pn.true:
      return AE();
    case pn.false:
      return EE();
    case pn.address:
      const o = Qi(t);
      return qE(o);
    case pn.contract:
      const s = Qi(t), i = Er(t);
      return Xw(s, i);
    case pn.ok:
      return JE(Qr(t));
    case pn.err:
      return ZE(Qr(t));
    case pn.none:
      return Dw();
    case pn.some:
      return Fw(Qr(t));
    case pn.list:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Qr(t));
      return CE(c);
    case pn.tuple:
      const u = t.readUInt32BE(), h = {};
      for (let x = 0; x < u; x++) {
        const L = Er(t).content;
        if (L === void 0)
          throw new Fn('"content" is undefined');
        h[L] = Qr(t);
      }
      return tk(h);
    case pn.ascii:
      const d = t.readUInt32BE(), w = N1(t.readBytes(d));
      return QE(w);
    case pn.utf8:
      const g = t.readUInt32BE(), v = Wa(t.readBytes(g));
      return ek(v);
    default:
      throw new Fn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function is(e, t) {
  return cn([Ff(e), t]);
}
function nk(e) {
  return new Uint8Array([Ff(e.type)]);
}
function rk(e) {
  return e.type === gt.OptionalNone ? new Uint8Array([Ff(e.type)]) : is(e.type, ns(e.value));
}
function sk(e) {
  const t = new Uint8Array(4);
  return Ko(t, Math.ceil(e.value.length / 2), 0), is(e.type, ss(t, bt(e.value)));
}
function ok(e) {
  const t = hf(I1(BigInt(e.value), BigInt(xA)), Tw);
  return is(e.type, t);
}
function ik(e) {
  const t = hf(BigInt(e.value), Tw);
  return is(e.type, t);
}
function ak(e) {
  return is(e.type, tc(mo(e.value)));
}
function ck(e) {
  const [t, n] = Sk(e.value);
  return is(e.type, ss(tc(mo(t)), ea(Fr(n))));
}
function lk(e) {
  return is(e.type, ns(e.value));
}
function uk(e) {
  const t = [], n = new Uint8Array(4);
  Ko(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const o = ns(r);
    t.push(o);
  }
  return is(e.type, cn(t));
}
function dk(e) {
  const t = [], n = new Uint8Array(4);
  Ko(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Fr(o);
    t.push(ea(s));
    const i = ns(e.value[o]);
    t.push(i);
  }
  return is(e.type, cn(t));
}
function Yw(e, t) {
  const n = [], r = t == "ascii" ? B1(e.value) : ai(e.value), o = new Uint8Array(4);
  return Ko(o, r.length, 0), n.push(o), n.push(r), is(e.type, cn(n));
}
function fk(e) {
  return Yw(e, "ascii");
}
function hk(e) {
  return Yw(e, "utf8");
}
function u0(e) {
  return Oe(ns(e));
}
function ns(e) {
  switch (e.type) {
    case gt.BoolTrue:
    case gt.BoolFalse:
      return nk(e);
    case gt.OptionalNone:
    case gt.OptionalSome:
      return rk(e);
    case gt.Buffer:
      return sk(e);
    case gt.UInt:
      return ik(e);
    case gt.Int:
      return ok(e);
    case gt.PrincipalStandard:
      return ak(e);
    case gt.PrincipalContract:
      return ck(e);
    case gt.ResponseOk:
    case gt.ResponseErr:
      return lk(e);
    case gt.List:
      return uk(e);
    case gt.Tuple:
      return dk(e);
    case gt.StringASCII:
      return fk(e);
    case gt.StringUTF8:
      return hk(e);
    default:
      throw new Pi("Unable to serialize. Invalid Clarity Value.");
  }
}
const pk = (e) => e.length % 2 ? `0${e}` : e, gk = (e, t) => e.padEnd(t, "0"), qw = (e, t) => e ? ai(e).length > t : !1;
function Md(e) {
  return $w(e);
}
const Ha = (e) => qA(Of(e)), Vf = (e) => Oe(vE(e)), yk = (e) => Oe(Ha(e)), wk = (e) => {
  const t = Ha(e), n = ss(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ha(n);
  return Oe(r);
}, mk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), o = Ha(r);
  return Oe(o);
}, bk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), o = Of(r), s = [];
  s.push(0), s.push(o.length), s.push(o);
  const i = cn(s), a = Ha(i);
  return Oe(a);
};
function xk(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Sk(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
rn.hmacSha256Sync = (e, ...t) => {
  const n = Pw.create(Of, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ca(e) {
  return e = typeof e == "string" ? bt(e) : e, {
    type: we.PublicKey,
    data: e
  };
}
function vk(e, t, n = qt.Compressed) {
  const r = U1(t), o = new pr(up(r.r), up(r.s)), s = at.fromSignature(e, o, r.recoveryId), i = n === qt.Compressed;
  return s.toHex(i);
}
function Ak(e) {
  return typeof e == "string" ? e : Oe(e);
}
const Xf = Ak;
function Ww(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === _1;
}
function la(e) {
  return !Xf(e).startsWith("04");
}
function Ek(e) {
  e = pf(e);
  const t = Ww(e);
  return Oe(Za(e.slice(0, 32), t));
}
function kk(e) {
  return at.fromHex(Xf(e)).toHex(!0);
}
function $k(e) {
  return at.fromHex(Xf(e)).toHex(!1);
}
function Ik(e, t) {
  e = pf(e);
  const [n, r] = Ul(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return qa(r, 1) + pr.fromHex(n).toCompactHex();
}
function Yf() {
  return {
    type: we.MessageSignature,
    data: Oe(new Uint8Array(Xl))
  };
}
function Zw(e, t, n, r) {
  const o = Gf(0, e, 1, [ca(t)]).hash160, s = la(t) ? qt.Compressed : qt.Uncompressed;
  return {
    hashMode: e,
    signer: o,
    nonce: Hn(n),
    fee: Hn(r),
    keyEncoding: s,
    signature: Yf()
  };
}
function Da(e) {
  return "signature" in e;
}
function d0(e) {
  return e === Mt.P2SH || e === Mt.P2WSH;
}
function Lk(e) {
  return e === Mt.P2SHNonSequential || e === Mt.P2WSHNonSequential;
}
function f0(e) {
  const t = Md(e);
  return t.nonce = 0, t.fee = 0, Da(t) ? t.signature = Yf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Ck(e) {
  const t = [
    e.hashMode,
    bt(e.signer),
    yo(e.nonce, 8),
    yo(e.fee, 8),
    e.keyEncoding,
    zf(e.signature)
  ];
  return cn(t);
}
function Tk(e) {
  const t = [
    e.hashMode,
    bt(e.signer),
    yo(e.nonce, 8),
    yo(e.fee, 8)
  ], n = jf(e.fields);
  t.push(Rf(n));
  const r = new Uint8Array(2);
  return H1(r, e.signaturesRequired, 0), t.push(r), cn(t);
}
function Bk(e, t) {
  const n = Oe(t.readBytes(20)), r = BigInt(`0x${Oe(t.readBytes(8))}`), o = BigInt(`0x${Oe(t.readBytes(8))}`), s = t.readUInt8Enum(qt, (a) => {
    throw new Fn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Mt.P2WPKH && s != qt.Compressed)
    throw new Fn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Td(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    keyEncoding: s,
    signature: i
  };
}
function Nk(e, t) {
  const n = Oe(t.readBytes(20)), r = BigInt("0x" + Oe(t.readBytes(8))), o = BigInt("0x" + Oe(t.readBytes(8))), s = Gw(t, we.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case we.PublicKey:
        la(u.contents.data) || (i = !0);
        break;
      case we.MessageSignature:
        if (u.pubKeyEncoding === qt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Uo("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Mt.P2WSH || e === Mt.P2WSHNonSequential))
    throw new Uo("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    fields: s,
    signaturesRequired: c
  };
}
function Iu(e) {
  return Da(e) ? Ck(e) : Tk(e);
}
function Lu(e) {
  const t = e.readUInt8Enum(Mt, (n) => {
    throw new Fn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Mt.P2PKH || t === Mt.P2WPKH ? Bk(t, e) : Nk(t, e);
}
function Jw(e, t, n, r) {
  const s = e + Oe(new Uint8Array([t])) + Oe(yo(n, 8)) + Oe(yo(r, 8));
  if (bt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Vf(bt(s));
}
function Qw(e, t, n) {
  const r = 33 + Xl, o = la(t.data) ? qt.Compressed : qt.Uncompressed, s = e + pk(o.toString(16)) + n, i = bt(s);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Vf(i);
}
function Mk(e, t, n, r, o) {
  const s = Jw(e, t, n, r), i = Ik(o, s), a = ca(Ek(o)), c = Qw(s, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function em(e, t, n, r, o, s) {
  const i = Jw(e, t, n, r), a = ca(vk(i, s, o)), c = Qw(i, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Pk() {
  const e = Zw(Mt.P2PKH, "", 0, 0);
  return e.signer = TE().hash160, e.keyEncoding = qt.Compressed, e.signature = Yf(), e;
}
function h0(e, t, n) {
  return Da(e) ? _k(e, t, n) : Uk(e, t, n);
}
function _k(e, t, n) {
  const { pubKey: r, nextSigHash: o } = em(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), s = Gf(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new Uo(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return o;
}
function Uk(e, t, n) {
  const r = [];
  let o = t, s = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case we.PublicKey:
        la(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case we.MessageSignature:
        c.pubKeyEncoding === qt.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: h } = em(o, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (d0(e.hashMode) && (o = h), r.push(u), i += 1, i === 65536)
          throw new Uo("Too many signatures");
        break;
    }
  if (d0(e.hashMode) && i !== e.signaturesRequired || Lk(e.hashMode) && i < e.signaturesRequired)
    throw new Uo("Incorrect number of signatures");
  if (s && (e.hashMode === Mt.P2WSH || e.hashMode === Mt.P2WSHNonSequential))
    throw new Uo("Uncompressed keys are not allowed in this hash mode");
  const a = Gf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Uo(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return o;
}
function tm(e) {
  return {
    authType: tn.Standard,
    spendingCondition: e
  };
}
function nm(e, t) {
  return {
    authType: tn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Zw(Mt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function p0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case tn.Standard:
        return tm(f0(e.spendingCondition));
      case tn.Sponsored:
        return nm(f0(e.spendingCondition), Pk());
      default:
        throw new yl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Ok(e, t) {
  switch (e.authType) {
    case tn.Standard:
      return h0(e.spendingCondition, t, tn.Standard);
    case tn.Sponsored:
      return h0(e.spendingCondition, t, tn.Standard);
    default:
      throw new yl("Invalid origin auth type");
  }
}
function Hk(e, t) {
  switch (e.authType) {
    case tn.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Hn(t)
      };
      return { ...e, spendingCondition: n };
    case tn.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Hn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Dk(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Hn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function Fk(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Hn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function jk(e, t) {
  const n = {
    ...t,
    nonce: Hn(t.nonce),
    fee: Hn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Rk(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case tn.Standard:
      t.push(Iu(e.spendingCondition));
      break;
    case tn.Sponsored:
      t.push(Iu(e.spendingCondition)), t.push(Iu(e.sponsorSpendingCondition));
      break;
  }
  return cn(t);
}
function zk(e) {
  const t = e.readUInt8Enum(tn, (r) => {
    throw new Fn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case tn.Standard:
      return n = Lu(e), tm(n);
    case tn.Sponsored:
      n = Lu(e);
      const r = Lu(e);
      return nm(n, r);
  }
}
class Gk {
  constructor({ auth: t, payload: n, postConditions: r = jf([]), postConditionMode: o = gl.Deny, transactionVersion: s, chainId: i, network: a = "mainnet" }) {
    a = wA(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: Hn(n.amount)
    } : this.payload = n, this.postConditionMode = o, this.postConditions = r, this.anchorMode = lr.Any;
  }
  signBegin() {
    const t = Md(this);
    return t.auth = p0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Md(this);
    return t.auth = p0(t.auth), t.txid();
  }
  verifyOrigin() {
    return Ok(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, tn.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === tn.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, tn.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : ca(t), r = this.auth.spendingCondition;
    if (r && !Da(r)) {
      const o = la(n.data);
      r.fields.push(_i(o ? qt.Compressed : qt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, o) {
    const { nextSig: s, nextSigHash: i } = Mk(n, r, t.fee, t.nonce, o);
    if (Da(t))
      t.signature = Ld(s);
    else {
      const a = Ww(o);
      t.fields.push(_i(a ? qt.Compressed : qt.Uncompressed, Ld(s)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return Vf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new yl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = jk(this.auth, t);
  }
  setFee(t) {
    this.auth = Hk(this.auth, t);
  }
  setNonce(t) {
    this.auth = Dk(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new yl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Fk(this.auth, t);
  }
  serialize() {
    return Oe(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Pi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Pi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Pi('"auth" is undefined');
    if (this.payload === void 0)
      throw new Pi('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Ko(n, this.chainId, 0), t.push(n), t.push(Rk(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Rf(this.postConditions)), t.push(Vw(this.payload)), cn(t);
  }
}
function Kk(e) {
  const t = Qn(e, Ot) ? e : new Ot(e), n = t.readUInt8Enum(ei, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), o = zk(t), s = t.readUInt8Enum(lr, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = t.readUInt8Enum(gl, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = Gw(t, we.PostCondition), c = GE(t), u = new Gk({
    transactionVersion: n,
    chainId: r,
    auth: o,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return u.anchorMode = s, u;
}
const g0 = BigInt("18446744073709551615");
function Cu(e) {
  const t = Hn(e);
  if (t < 0n || t > g0)
    throw new RangeError(`Post-condition amount must be between 0 and ${g0} (u64 max), received: ${t}`);
  return t;
}
var Pd;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(Pd || (Pd = {}));
var _d;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(_d || (_d = {}));
function Vk(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Rt.STX,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Rn.Origin } : ba(e.address),
        conditionCode: $c(e.condition),
        amount: Cu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Rt.Fungible,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Rn.Origin } : ba(e.address),
        conditionCode: $c(e.condition),
        amount: Cu(e.amount),
        asset: l0(e.asset)
      };
    case "nft-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Rt.NonFungible,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Rn.Origin } : ba(e.address),
        conditionCode: $c(e.condition),
        asset: l0(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Rt.Staking,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Rn.Origin } : ba(e.address),
        conditionCode: $c(e.condition),
        amount: Cu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: we.PostCondition,
        conditionType: Rt.PoX,
        principal: e.address === "origin" ? { type: we.Principal, prefix: Rn.Origin } : ba(e.address),
        conditionCode: Xk(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function $c(e) {
  return Pd[e];
}
function Xk(e) {
  return _d[e];
}
function rm(e) {
  const t = Vk(e);
  return RE(t);
}
function Yk(e, t, n) {
  return Wf(sm(e), n);
}
function sm(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Fa(r);
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
    return BigInt(`0x${Zk(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function qf(e, t = 8) {
  return (typeof e == "bigint" ? e : sm(e)).toString(16).padStart(t * 2, "0");
}
function Wf(e, t = 16) {
  const n = qf(e, t);
  return Fa(n);
}
function qk(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const Wk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Zk(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Wk[n];
  return t;
}
function Fa(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, s = t.slice(o, o + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function Zf(e) {
  return new TextEncoder().encode(e);
}
function Jk(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Qk(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function y0(e) {
  if (e.some(Qk))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Jf(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Cs(e) {
  return Jf(...e.map((t) => typeof t == "number" ? y0([t]) : t instanceof Array ? y0(t) : t));
}
function Wl(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Ud;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ud || (Ud = {}));
Ud.Mainnet;
const e3 = 128, t3 = 128, om = 16;
var Od;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Od || (Od = {}));
var w0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(w0 || (w0 = {}));
var m0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(m0 || (m0 = {}));
var Mr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Mr || (Mr = {}));
const Tu = ["onChainOnly", "offChainOnly", "any"];
Tu[0] + "", Mr.OnChainOnly, Tu[1] + "", Mr.OffChainOnly, Tu[2] + "", Mr.Any, Mr.OnChainOnly + "", Mr.OnChainOnly, Mr.OffChainOnly + "", Mr.OffChainOnly, Mr.Any + "", Mr.Any;
var Hd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Hd || (Hd = {}));
Hd.Mainnet;
var b0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(b0 || (b0 = {}));
var No;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(No || (No = {}));
var x0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(x0 || (x0 = {}));
var S0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(S0 || (S0 = {}));
var v0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(v0 || (v0 = {}));
var A0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(A0 || (A0 = {}));
var E0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(E0 || (E0 = {}));
var k0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(k0 || (k0 = {}));
var Dd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Dd || (Dd = {}));
var $0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})($0 || ($0 = {}));
var I0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(I0 || (I0 = {}));
function Fd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function n3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function im(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function r3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Fd(e.outputLen), Fd(e.blockLen);
}
function s3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function o3(e, t) {
  im(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Bu = {
  number: Fd,
  bool: n3,
  bytes: im,
  hash: r3,
  exists: s3,
  output: o3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Nu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Wr = (e, t) => e << 32 - t | e >>> t, i3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!i3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function a3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function am(e) {
  if (typeof e == "string" && (e = a3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let c3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hi(e) {
  const t = (r) => e().update(am(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function l3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Qf = class extends c3 {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Nu(this.buffer);
  }
  update(t) {
    Bu.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = am(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Nu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Bu.exists(this), Bu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    l3(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Nu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const u3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cm = Uint8Array.from({ length: 16 }, (e, t) => t), d3 = cm.map((e) => (9 * e + 5) % 16);
let eh = [cm], th = [d3];
for (let e = 0; e < 4; e++)
  for (let t of [eh, th])
    t.push(t[e].map((n) => u3[n]));
const lm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), f3 = eh.map((e, t) => e.map((n) => lm[t][n])), h3 = th.map((e, t) => e.map((n) => lm[t][n])), p3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), g3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ic = (e, t) => e << t | e >>> 32 - t;
function L0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Lc = new Uint32Array(16);
let y3 = class extends Qf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Lc[g] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let g = 0; g < 5; g++) {
      const v = 4 - g, x = p3[g], L = g3[g], B = eh[g], U = th[g], A = f3[g], T = h3[g];
      for (let _ = 0; _ < 16; _++) {
        const Y = Ic(r + L0(g, s, a, u) + Lc[B[_]] + x, A[_]) + d | 0;
        r = d, d = u, u = Ic(a, 10) | 0, a = s, s = Y;
      }
      for (let _ = 0; _ < 16; _++) {
        const Y = Ic(o + L0(v, i, c, h) + Lc[U[_]] + L, T[_]) + w | 0;
        o = w, w = h, h = Ic(c, 10) | 0, c = i, i = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Lc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
hi(() => new y3());
const w3 = (e, t, n) => e & t ^ ~e & n, m3 = (e, t, n) => e & t ^ e & n ^ t & n, b3 = new Uint32Array([
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
]), Js = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qs = new Uint32Array(64);
let um = class extends Qf {
  constructor() {
    super(64, 32, 8, !1), this.A = Js[0] | 0, this.B = Js[1] | 0, this.C = Js[2] | 0, this.D = Js[3] | 0, this.E = Js[4] | 0, this.F = Js[5] | 0, this.G = Js[6] | 0, this.H = Js[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Qs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Qs[d - 15], g = Qs[d - 2], v = Wr(w, 7) ^ Wr(w, 18) ^ w >>> 3, x = Wr(g, 17) ^ Wr(g, 19) ^ g >>> 10;
      Qs[d] = x + Qs[d - 7] + v + Qs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Wr(a, 6) ^ Wr(a, 11) ^ Wr(a, 25), g = h + w + w3(a, c, u) + b3[d] + Qs[d] | 0, x = (Wr(r, 2) ^ Wr(r, 13) ^ Wr(r, 22)) + m3(r, o, s) | 0;
      h = u, u = c, c = a, a = i + g | 0, i = s, s = o, o = r, r = g + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    Qs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, x3 = class extends um {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
hi(() => new um());
hi(() => new x3());
const Cc = BigInt(2 ** 32 - 1), jd = BigInt(32);
function dm(e, t = !1) {
  return t ? { h: Number(e & Cc), l: Number(e >> jd & Cc) } : { h: Number(e >> jd & Cc) | 0, l: Number(e & Cc) | 0 };
}
function S3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = dm(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const v3 = (e, t) => BigInt(e >>> 0) << jd | BigInt(t >>> 0), A3 = (e, t, n) => e >>> n, E3 = (e, t, n) => e << 32 - n | t >>> n, k3 = (e, t, n) => e >>> n | t << 32 - n, $3 = (e, t, n) => e << 32 - n | t >>> n, I3 = (e, t, n) => e << 64 - n | t >>> n - 32, L3 = (e, t, n) => e >>> n - 32 | t << 64 - n, C3 = (e, t) => t, T3 = (e, t) => e, B3 = (e, t, n) => e << n | t >>> 32 - n, N3 = (e, t, n) => t << n | e >>> 32 - n, M3 = (e, t, n) => t << n - 32 | e >>> 64 - n, P3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function _3(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const U3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), O3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, H3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), D3 = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, F3 = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), j3 = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, tt = {
  fromBig: dm,
  split: S3,
  toBig: v3,
  shrSH: A3,
  shrSL: E3,
  rotrSH: k3,
  rotrSL: $3,
  rotrBH: I3,
  rotrBL: L3,
  rotr32H: C3,
  rotr32L: T3,
  rotlSH: B3,
  rotlSL: N3,
  rotlBH: M3,
  rotlBL: P3,
  add: _3,
  add3L: U3,
  add3H: O3,
  add4L: H3,
  add4H: D3,
  add5H: j3,
  add5L: F3
}, [R3, z3] = tt.split([
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
].map((e) => BigInt(e))), eo = new Uint32Array(80), to = new Uint32Array(80);
let Zl = class extends Qf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: g, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, w, g, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, w, g, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      eo[A] = t.getUint32(n), to[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = eo[A - 15] | 0, _ = to[A - 15] | 0, Y = tt.rotrSH(T, _, 1) ^ tt.rotrSH(T, _, 8) ^ tt.shrSH(T, _, 7), ce = tt.rotrSL(T, _, 1) ^ tt.rotrSL(T, _, 8) ^ tt.shrSL(T, _, 7), ne = eo[A - 2] | 0, q = to[A - 2] | 0, m = tt.rotrSH(ne, q, 19) ^ tt.rotrBH(ne, q, 61) ^ tt.shrSH(ne, q, 6), I = tt.rotrSL(ne, q, 19) ^ tt.rotrBL(ne, q, 61) ^ tt.shrSL(ne, q, 6), N = tt.add4L(ce, I, to[A - 7], to[A - 16]), P = tt.add4H(N, Y, m, eo[A - 7], eo[A - 16]);
      eo[A] = P | 0, to[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: g, Fl: v, Gh: x, Gl: L, Hh: B, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = tt.rotrSH(d, w, 14) ^ tt.rotrSH(d, w, 18) ^ tt.rotrBH(d, w, 41), _ = tt.rotrSL(d, w, 14) ^ tt.rotrSL(d, w, 18) ^ tt.rotrBL(d, w, 41), Y = d & g ^ ~d & x, ce = w & v ^ ~w & L, ne = tt.add5L(U, _, ce, z3[A], to[A]), q = tt.add5H(ne, B, T, Y, R3[A], eo[A]), m = ne | 0, I = tt.rotrSH(r, o, 28) ^ tt.rotrBH(r, o, 34) ^ tt.rotrBH(r, o, 39), N = tt.rotrSL(r, o, 28) ^ tt.rotrBL(r, o, 34) ^ tt.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      B = x | 0, U = L | 0, x = g | 0, L = v | 0, g = d | 0, v = w | 0, { h: d, l: w } = tt.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = tt.add3L(m, N, W);
      r = tt.add3H(R, q, I, P), o = R | 0;
    }
    ({ h: r, l: o } = tt.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = tt.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = tt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: g, l: v } = tt.add(this.Fh | 0, this.Fl | 0, g | 0, v | 0), { h: x, l: L } = tt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: U } = tt.add(this.Hh | 0, this.Hl | 0, B | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, w, g, v, x, L, B, U);
  }
  roundClean() {
    eo.fill(0), to.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, G3 = class extends Zl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, K3 = class extends Zl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, V3 = class extends Zl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hi(() => new Zl());
hi(() => new G3());
hi(() => new K3());
hi(() => new V3());
function X3(e, t, n) {
  const o = e3;
  if (l4(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Od.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: o
  };
}
var vn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(vn || (vn = {}));
let Y3 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, fm = class extends Y3 {
  constructor(t) {
    super(t);
  }
};
function Jl(e) {
  const t = [];
  return t.push(Fa(qf(e.version, 1))), t.push(Fa(e.hash160)), Cs(t);
}
function q3(e) {
  const t = [];
  return t.push(e.prefix), t.push(Jl(e.address)), e.prefix === Dd.Contract && t.push(ja(e.contractName)), Cs(t);
}
function ja(e) {
  const t = [], n = Zf(e.content), r = n.byteLength;
  return t.push(Fa(qf(r, e.lengthPrefixBytes))), t.push(n), Cs(t);
}
function W3(e) {
  const t = [];
  return t.push(Jl(e.address)), t.push(ja(e.contractName)), t.push(ja(e.assetName)), Cs(t);
}
function hm(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(q3(e.principal)), (e.conditionType === No.Fungible || e.conditionType === No.NonFungible) && t.push(W3(e.assetInfo)), e.conditionType === No.NonFungible && t.push(ni(e.assetName)), t.push(e.conditionCode), e.conditionType === No.STX || e.conditionType === No.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new fm("The post-condition amount may not be larger than 8 bytes");
    t.push(Yk(e.amount, !1, 8));
  }
  return Cs(t);
}
function as(e, t) {
  return Cs([e, t]);
}
function Z3(e) {
  return new Uint8Array([e.type]);
}
function J3(e) {
  return e.type === vn.OptionalNone ? new Uint8Array([e.type]) : as(e.type, ni(e.value));
}
function Q3(e) {
  const t = new Uint8Array(4);
  return Wl(t, e.buffer.length, 0), as(e.type, Jf(t, e.buffer));
}
function e4(e) {
  const t = Wf(qk(e.value, BigInt(t3)), om);
  return as(e.type, t);
}
function t4(e) {
  const t = Wf(e.value, om);
  return as(e.type, t);
}
function n4(e) {
  return as(e.type, Jl(e.address));
}
function r4(e) {
  return as(e.type, Jf(Jl(e.address), ja(e.contractName)));
}
function s4(e) {
  return as(e.type, ni(e.value));
}
function o4(e) {
  const t = [], n = new Uint8Array(4);
  Wl(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const o = ni(r);
    t.push(o);
  }
  return as(e.type, Cs(t));
}
function i4(e) {
  const t = [], n = new Uint8Array(4);
  Wl(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = X3(o);
    t.push(ja(s));
    const i = ni(e.data[o]);
    t.push(i);
  }
  return as(e.type, Cs(t));
}
function pm(e, t) {
  const n = [], r = t == "ascii" ? Jk(e.data) : Zf(e.data), o = new Uint8Array(4);
  return Wl(o, r.length, 0), n.push(o), n.push(r), as(e.type, Cs(n));
}
function a4(e) {
  return pm(e, "ascii");
}
function c4(e) {
  return pm(e, "utf8");
}
function ni(e) {
  switch (e.type) {
    case vn.BoolTrue:
    case vn.BoolFalse:
      return Z3(e);
    case vn.OptionalNone:
    case vn.OptionalSome:
      return J3(e);
    case vn.Buffer:
      return Q3(e);
    case vn.UInt:
      return t4(e);
    case vn.Int:
      return e4(e);
    case vn.PrincipalStandard:
      return n4(e);
    case vn.PrincipalContract:
      return r4(e);
    case vn.ResponseOk:
    case vn.ResponseErr:
      return s4(e);
    case vn.List:
      return o4(e);
    case vn.Tuple:
      return i4(e);
    case vn.StringASCII:
      return a4(e);
    case vn.StringUTF8:
      return c4(e);
    default:
      throw new fm("Unable to serialize. Invalid Clarity Value.");
  }
}
const l4 = (e, t) => e ? Zf(e).length > t : !1, u4 = "connect-ui";
let qc, gm, ur = !1, Rd = !1;
const Ls = (e, t = "") => () => {
}, d4 = (e, t) => () => {
}, f4 = "{visibility:hidden}.hydrated{visibility:inherit}", C0 = {}, h4 = "http://www.w3.org/2000/svg", p4 = "http://www.w3.org/1999/xhtml", g4 = (e) => e != null, nh = (e) => (e = typeof e, e === "object" || e === "function");
function ym(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const We = (e, t, ...n) => {
  let r = null, o = !1, s = !1;
  const i = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((o = typeof e != "function" && !nh(r)) && (r = String(r)), o && s ? i[i.length - 1].$text$ += r : i.push(o ? zd(null, r) : r), s = o);
  };
  if (a(n), t) {
    const u = t.className || t.class;
    u && (t.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = zd(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, zd = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, y4 = {}, w4 = (e) => e && e.$tag$ === y4, m4 = (e, t) => e != null && !nh(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, b4 = (e) => ua(e).$hostElement$, x4 = (e, t, n) => {
  const r = Un.ce(t, n);
  return e.dispatchEvent(r), r;
}, T0 = /* @__PURE__ */ new WeakMap(), S4 = (e, t, n) => {
  let r = wl.get(e);
  j4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, wl.set(e, r);
}, v4 = (e, t, n, r) => {
  var o;
  let s = wm(t);
  const i = wl.get(s);
  if (e = e.nodeType === 11 ? e : rs, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = T0.get(e), c;
      if (a || T0.set(e, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = rs.createElement("style"), c.innerHTML = i;
          const u = (o = Un.$nonce$) !== null && o !== void 0 ? o : ym(rs);
          u != null && c.setAttribute("nonce", u), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(s);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return s;
}, A4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, o = Ls("attachStyles", t.$tagName$), s = v4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), o();
}, wm = (e, t) => "sc-" + e.$tagName$, B0 = (e, t, n, r, o, s) => {
  if (n !== r) {
    let i = M0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, u = N0(n), h = N0(r);
      c.remove(...u.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : M0(Ql, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && Un.rel(e, t, n, !1), r && Un.ael(e, t, r, !1);
    else {
      const c = nh(r);
      if ((i || c && r !== null) && !o)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const u = r ?? "";
            t === "list" ? i = !1 : (n == null || e[t] != u) && (e[t] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!i || s & 4 || o) && !c && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, E4 = /\s/, N0 = (e) => e ? e.split(E4) : [], mm = (e, t, n, r) => {
  const o = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, s = e && e.$attrs$ || C0, i = t.$attrs$ || C0;
  for (r in s)
    r in i || B0(o, r, s[r], void 0, n, t.$flags$);
  for (r in i)
    B0(o, r, s[r], i[r], n, t.$flags$);
}, rh = (e, t, n, r) => {
  const o = t.$children$[n];
  let s = 0, i, a;
  if (o.$text$ !== null)
    i = o.$elm$ = rs.createTextNode(o.$text$);
  else {
    if (ur || (ur = o.$tag$ === "svg"), i = o.$elm$ = rs.createElementNS(ur ? h4 : p4, o.$tag$), ur && o.$tag$ === "foreignObject" && (ur = !1), mm(null, o, ur), g4(qc) && i["s-si"] !== qc && i.classList.add(i["s-si"] = qc), o.$children$)
      for (s = 0; s < o.$children$.length; ++s)
        a = rh(e, o, s), a && i.appendChild(a);
    o.$tag$ === "svg" ? ur = !1 : i.tagName === "foreignObject" && (ur = !0);
  }
  return i;
}, bm = (e, t, n, r, o, s) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === gm && (i = i.shadowRoot); o <= s; ++o)
    r[o] && (a = rh(null, n, o), a && (r[o].$elm$ = a, i.insertBefore(a, t)));
}, xm = (e, t, n, r, o) => {
  for (; t <= n; ++t)
    (r = e[t]) && (o = r.$elm$, o.remove());
}, k4 = (e, t, n, r) => {
  let o = 0, s = 0, i = t.length - 1, a = t[0], c = t[i], u = r.length - 1, h = r[0], d = r[u], w;
  for (; o <= i && s <= u; )
    a == null ? a = t[++o] : c == null ? c = t[--i] : h == null ? h = r[++s] : d == null ? d = r[--u] : Tc(a, h) ? ($a(a, h), a = t[++o], h = r[++s]) : Tc(c, d) ? ($a(c, d), c = t[--i], d = r[--u]) : Tc(a, d) ? ($a(a, d), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++o], d = r[--u]) : Tc(c, h) ? ($a(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], h = r[++s]) : (w = rh(t && t[s], n, s), h = r[++s], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  o > i ? bm(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && xm(t, o, i);
}, Tc = (e, t) => e.$tag$ === t.$tag$, $a = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, o = t.$children$, s = t.$tag$, i = t.$text$;
  i === null ? (ur = s === "svg" ? !0 : s === "foreignObject" ? !1 : ur, mm(e, t, ur), r !== null && o !== null ? k4(n, r, t, o) : o !== null ? (e.$text$ !== null && (n.textContent = ""), bm(n, null, t, o, 0, o.length - 1)) : r !== null && xm(r, 0, r.length - 1), ur && s === "svg" && (ur = !1)) : e.$text$ !== i && (n.data = i);
}, $4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || zd(null, null), o = w4(t) ? t : We(null, null, t);
  gm = n.tagName, o.$tag$ = null, o.$flags$ |= 4, e.$vnode$ = o, o.$elm$ = r.$elm$ = n.shadowRoot || n, qc = n["s-sc"], $a(r, o);
}, Sm = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, sh = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Sm(e, e.$ancestorComponent$), z4(() => I4(e, t));
}, I4 = (e, t) => {
  const n = Ls("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let o;
  return n(), B4(o, () => L4(e, r, t));
}, L4 = async (e, t, n) => {
  const r = e.$hostElement$, o = Ls("update", e.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && A4(e);
  const i = Ls("render", e.$cmpMeta$.$tagName$);
  C4(e, t), s && (s.map((a) => a()), r["s-rc"] = void 0), i(), o();
  {
    const a = r["s-p"], c = () => T4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, C4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, $4(e, t);
  } catch (r) {
    Ra(r, e.$hostElement$);
  }
  return null;
}, T4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = Ls("postUpdate", t), o = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Am(n), r(), e.$onReadyResolve$(n), o || vm()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && ih(() => sh(e, !1)), e.$flags$ &= -517;
}, vm = (e) => {
  Am(rs.documentElement), ih(() => x4(Ql, "appload", { detail: { namespace: u4 } }));
}, B4 = (e, t) => e && e.then ? e.then(t) : t(), Am = (e) => e.classList.add("hydrated"), N4 = (e, t) => ua(e).$instanceValues$.get(t), M4 = (e, t, n, r) => {
  const o = ua(e), s = o.$instanceValues$.get(t), i = o.$flags$, a = o.$lazyInstance$;
  n = m4(n, r.$members$[t][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(i & 8) || s === void 0) && u && (o.$instanceValues$.set(t, n), a && (i & 18) === 2 && sh(o, !1));
}, Em = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), o = e.prototype;
    if (r.map(([s, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(o, s, {
        get() {
          return N4(this, s);
        },
        set(a) {
          M4(this, s, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      o.attributeChangedCallback = function(i, a, c) {
        Un.jmp(() => {
          const u = s.get(i);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (o.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
        });
      }, e.observedAttributes = r.filter(
        ([i, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, a]) => {
        const c = a[1] || i;
        return s.set(c, i), c;
      });
    }
  }
  return e;
}, P4 = async (e, t, n, r, o) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, o = F4(n), o.then) {
        const c = d4();
        o = await o, c();
      }
      o.isProxied || (Em(
        o,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), o.isProxied = !0);
      const a = Ls("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new o(t);
      } catch (c) {
        Ra(c);
      }
      t.$flags$ &= -9, a();
    }
    if (o.style) {
      let a = o.style;
      const c = wm(n);
      if (!wl.has(c)) {
        const u = Ls("registerStyles", n.$tagName$);
        S4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = t.$ancestorComponent$, i = () => sh(t, !0);
  s && s["s-rc"] ? s["s-rc"].push(i) : i();
}, _4 = (e) => {
  if (!(Un.$flags$ & 1)) {
    const t = ua(e), n = t.$cmpMeta$, r = Ls("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let o = e;
        for (; o = o.parentNode || o.host; )
          if (o["s-p"]) {
            Sm(t, t.$ancestorComponent$ = o);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([o, [s]]) => {
        if (s & 31 && e.hasOwnProperty(o)) {
          const i = e[o];
          delete e[o], e[o] = i;
        }
      }), P4(e, t, n);
    }
    r();
  }
}, U4 = (e) => {
  Un.$flags$ & 1 || ua(e);
}, O4 = (e, t = {}) => {
  var n;
  const r = Ls(), o = [], s = t.exclude || [], i = Ql.customElements, a = rs.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ rs.createElement("style"), h = [];
  let d, w = !0;
  Object.assign(Un, t), Un.$resourcesUrl$ = new URL(t.resourcesUrl || "./", rs.baseURI).href, e.map((g) => {
    g[1].map((v) => {
      const x = {
        $flags$: v[0],
        $tagName$: v[1],
        $members$: v[2],
        $listeners$: v[3]
      };
      x.$members$ = v[2];
      const L = x.$tagName$, B = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, D4(U, x), x.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), w ? h.push(this) : Un.jmp(() => _4(this));
        }
        disconnectedCallback() {
          Un.jmp(() => U4(this));
        }
        componentOnReady() {
          return ua(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = g[0], !s.includes(L) && !i.get(L) && (o.push(L), i.define(L, Em(
        B,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = o + f4, u.setAttribute("data-styles", "");
    const g = (n = Un.$nonce$) !== null && n !== void 0 ? n : ym(rs);
    g != null && u.setAttribute("nonce", g), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  w = !1, h.length ? h.map((g) => g.connectedCallback()) : Un.jmp(() => d = setTimeout(vm, 30)), r();
}, oh = /* @__PURE__ */ new WeakMap(), ua = (e) => oh.get(e), H4 = (e, t) => oh.set(t.$lazyInstance$ = e, t), D4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], oh.set(e, n);
}, M0 = (e, t) => t in e, Ra = (e, t) => (0, console.error)(e, t), Mu = /* @__PURE__ */ new Map(), F4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), o = e.$lazyBundleId$, s = Mu.get(o);
  if (s)
    return s[r];
  {
    const i = (a) => (Mu.set(o, a), a[r]);
    switch (o) {
      case "connect-modal":
        return Promise.resolve().then(() => PC).then(i, Ra);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${o}.entry.js`
  ).then((i) => (Mu.set(o, i), i[r]), Ra);
}, wl = /* @__PURE__ */ new Map(), Ql = typeof window < "u" ? window : {}, rs = Ql.document || { head: {} }, Un = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, km = (e) => Promise.resolve(e), j4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), P0 = [], $m = [], R4 = (e, t) => (n) => {
  e.push(n), Rd || (Rd = !0, Un.$flags$ & 4 ? ih(Gd) : Un.raf(Gd));
}, _0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Ra(n);
    }
  e.length = 0;
}, Gd = () => {
  _0(P0), _0($m), (Rd = P0.length > 0) && Un.raf(Gd);
}, ih = (e) => km().then(e), z4 = /* @__PURE__ */ R4($m), G4 = () => km(), K4 = (e, t) => typeof window > "u" ? Promise.resolve() : G4().then(() => O4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var V4 = Object.defineProperty, X4 = Object.defineProperties, Y4 = Object.getOwnPropertyDescriptors, ml = Object.getOwnPropertySymbols, Im = Object.prototype.hasOwnProperty, Lm = Object.prototype.propertyIsEnumerable, U0 = (e, t, n) => t in e ? V4(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, yr = (e, t) => {
  for (var n in t || (t = {})) Im.call(t, n) && U0(e, n, t[n]);
  if (ml) for (var n of ml(t)) Lm.call(t, n) && U0(e, n, t[n]);
  return e;
}, jr = (e, t) => X4(e, Y4(t)), Cm = (e, t) => {
  var n = {};
  for (var r in e) Im.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && ml) for (var r of ml(e)) t.indexOf(r) < 0 && Lm.call(e, r) && (n[r] = e[r]);
  return n;
};
function Tm() {
  return Vl(Wo()) || window.StacksProvider || window.BlockstackProvider;
}
function eu(e) {
  return e ? typeof e == "string" ? Jo.fromName(e) : "version" in e ? e : "url" in e ? new md({ url: e.url }) : e.transactionVersion === ei.Mainnet ? new md({ url: e.client.baseUrl }) : new bd({ url: e.client.baseUrl }) : new bd();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var q4 = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(q4 || {}), W4 = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(W4 || {}), ah = (e) => {
  let t = e;
  if (!t) {
    let n = new ly(["store_write"], document.location.href);
    t = new wd({ appConfig: n });
  }
  return t;
};
function Bm(e) {
  try {
    return ah(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Nm = (e) => {
  let t = ah(e).loadUserData().appPrivateKey, n = Bn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function Z4(e) {
  var t;
  let { stxAddress: n, userSession: r, network: o } = e;
  if (n) return n;
  if (!r || !o) return;
  let s = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [Qo.Mainnet]: "mainnet", [Qo.Testnet]: "testnet" }, a = eu(o);
  return s == null ? void 0 : s[i[a.chainId]];
}
function J4(e) {
  let t = eu(e.network), n = ah(e.userSession), r = jr(yr({}, e), { network: t, userSession: n });
  return yr({ stxAddress: Z4(r) }, r);
}
async function Q4(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(rm) : n = n.map((r) => Oe(hm(r)))), new Bn.TokenSigner("ES256k", t).signAsync(jr(yr({}, e), { postConditions: n }));
}
function e$(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(rm) : t = t.map((n) => Oe(hm(n)))), Bn.createUnsecuredToken(jr(yr({}, e), { postConditions: t }));
}
var t$ = async ({ token: e, options: t }, n) => {
  var r, o, s;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = bt(a.replace(/^0x/, "")), u = Kk(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, jr(yr({}, i), { stacksTransaction: u }));
      return;
    }
    (o = t.onFinish) == null || o.call(t, jr(yr({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (s = t.onCancel) == null || s.call(t);
  }
}, n$ = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: o } = t, s = Cm(t, ["amount", "appDetails", "userSession"]);
  if (Bm(o)) {
    let { privateKey: a, publicKey: c } = Nm(o), u = jr(yr({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), Q4(u, a);
  }
  let i = jr(yr({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), e$(i);
};
async function r$(e, t, n) {
  let r = await t(jr(yr(yr({}, J4(e)), e), { network: eu(e.network) }));
  return t$({ token: r, options: e }, n);
}
function s$(e, t = Tm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return r$(e, n$, t);
}
function Mm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? jr(yr({}, e), { message: u0(t), domain: u0(n) }) : jr(yr({}, e), { message: Oe(ni(t)), domain: Oe(ni(n)) });
}
async function o$(e, t) {
  return new Bn.TokenSigner("ES256k", t).signAsync(Mm(e));
}
async function i$(e) {
  let t = e, { userSession: n } = t, r = Cm(t, ["userSession"]);
  if (Bm(n)) {
    let { privateKey: o, publicKey: s } = Nm(n), i = jr(yr({}, r), { publicKey: s });
    return o$(i, o);
  }
  return Bn.createUnsecuredToken(Mm(e));
}
var a$ = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(a$ || {}), Pm = "asigna-stx", O0 = (e, t) => new Promise((n) => {
  function r(o) {
    o.data.source === Pm && o.data[t] && (n(o.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(l$(e, t), "*");
}), c$ = { authenticationRequest: async (e) => O0(e, "authenticationRequest"), transactionRequest: async (e) => O0(e, "transactionRequest") }, l$ = (e, t) => ({ source: Pm, [t]: e }), u$ = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = c$);
};
u$();
var d$ = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function f$(e, t = !0) {
  return function(n, r) {
    var o;
    if (r) return e(n, r);
    let s = Wo(), i = Tm();
    if (s && i) return e(n, i);
    if (typeof window > "u") return;
    K4();
    let a = (o = n == null ? void 0 : n.defaultProviders) != null ? o : d$, c = rA(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = t;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      u.remove(), document.body.style.overflow = h;
    };
    u.callback = (g) => {
      d(), e(n, g);
    }, u.cancelCallback = () => {
      var g;
      d(), (g = n.onCancel) == null || g.call(n);
    }, document.body.appendChild(u);
    let w = (g) => {
      g.key === "Escape" && (document.removeEventListener("keydown", w), u.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var Bc = f$(s$);
function wo(e, t, n) {
  return ch(Gn(e, t), n);
}
function Gn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Gt(r);
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
      const r = g$(BigInt(`0x${lt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${lt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function H0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function nc(e, t = 8) {
  return (typeof e == "bigint" ? e : Gn(e, !1)).toString(16).padStart(t * 2, "0");
}
function tu(e) {
  return parseInt(e, 16);
}
function ch(e, t = 16) {
  const n = nc(e, t);
  return Gt(n);
}
function h$(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function p$(e, t) {
  return e & BigInt(1) << t;
}
function g$(e, t) {
  return p$(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const y$ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function lt(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += y$[n];
  return t;
}
function Gt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, s = t.slice(o, o + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function da(e) {
  return new TextEncoder().encode(e);
}
function lh(e) {
  return new TextDecoder().decode(e);
}
function _m(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function w$(e) {
  return String.fromCharCode.apply(null, e);
}
function m$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function D0(e) {
  if (e.some(m$))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function nu(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function ln(e) {
  return nu(...e.map((t) => typeof t == "number" ? D0([t]) : t instanceof Array ? D0(t) : t));
}
var F0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(F0 || (F0 = {}));
var j0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(j0 || (j0 = {}));
var R0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(R0 || (R0 = {}));
const Um = 33, Pu = 32;
function b$(e) {
  if (e.length < Pu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Pu * 2), r = e.slice(2 + Pu * 2);
  return {
    recoveryId: tu(t),
    r: n,
    s: r
  };
}
function x$(e) {
  const t = typeof e == "string" ? Gt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function S$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function v$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function A$(e, t) {
  return e[t];
}
function E$(e, t, n = 0) {
  return e[n] = t, e;
}
function k$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function ri(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Kd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Kd || (Kd = {}));
const $$ = Kd.Mainnet, I$ = 128, L$ = 128, Om = 16, Ro = 32, Vd = 80, ru = 65, C$ = 32, T$ = 64, bl = 34;
var Le;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Le || (Le = {}));
var it;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(it || (it = {}));
var Xd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Xd || (Xd = {}));
var Zn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Zn || (Zn = {}));
const Wc = ["onChainOnly", "offChainOnly", "any"], z0 = {
  [Wc[0]]: Zn.OnChainOnly,
  [Wc[1]]: Zn.OffChainOnly,
  [Wc[2]]: Zn.Any,
  [Zn.OnChainOnly]: Zn.OnChainOnly,
  [Zn.OffChainOnly]: Zn.OffChainOnly,
  [Zn.Any]: Zn.Any
};
function B$(e) {
  if (e in z0)
    return z0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${Wc.join(", ")}`);
}
var xl;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(xl || (xl = {}));
xl.Mainnet;
var ta;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(ta || (ta = {}));
var Jn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Jn || (Jn = {}));
var nn;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(nn || (nn = {}));
var Pt;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Pt || (Pt = {}));
var Sl;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Sl || (Sl = {}));
var Wt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Wt || (Wt = {}));
var za;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(za || (za = {}));
var Yd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Yd || (Yd = {}));
var Ga;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Ga || (Ga = {}));
var G0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(G0 || (G0 = {}));
var K0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(K0 || (K0 = {}));
function qd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function N$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Hm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function M$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  qd(e.outputLen), qd(e.blockLen);
}
function P$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function _$(e, t) {
  Hm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ho = {
  number: qd,
  bool: N$,
  bytes: Hm,
  hash: M$,
  exists: P$,
  output: _$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _u = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Zr = (e, t) => e << 32 - t | e >>> t, U$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!U$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function O$(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function uh(e) {
  if (typeof e == "string" && (e = O$(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class Dm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function pi(e) {
  const t = (r) => e().update(uh(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function H$(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
class dh extends Dm {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = _u(this.buffer);
  }
  update(t) {
    Ho.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = uh(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = _u(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Ho.exists(this), Ho.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    H$(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = _u(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
}
const D$ = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fm = Uint8Array.from({ length: 16 }, (e, t) => t), F$ = Fm.map((e) => (9 * e + 5) % 16);
let fh = [Fm], hh = [F$];
for (let e = 0; e < 4; e++)
  for (let t of [fh, hh])
    t.push(t[e].map((n) => D$[n]));
const jm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), j$ = fh.map((e, t) => e.map((n) => jm[t][n])), R$ = hh.map((e, t) => e.map((n) => jm[t][n])), z$ = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), G$ = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Nc = (e, t) => e << t | e >>> 32 - t;
function V0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Mc = new Uint32Array(16);
class K$ extends dh {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Mc[g] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let g = 0; g < 5; g++) {
      const v = 4 - g, x = z$[g], L = G$[g], B = fh[g], U = hh[g], A = j$[g], T = R$[g];
      for (let _ = 0; _ < 16; _++) {
        const Y = Nc(r + V0(g, s, a, u) + Mc[B[_]] + x, A[_]) + d | 0;
        r = d, d = u, u = Nc(a, 10) | 0, a = s, s = Y;
      }
      for (let _ = 0; _ < 16; _++) {
        const Y = Nc(o + V0(v, i, c, h) + Mc[U[_]] + L, T[_]) + w | 0;
        o = w, w = h, h = Nc(c, 10) | 0, c = i, i = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Mc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const V$ = pi(() => new K$()), X$ = (e, t, n) => e & t ^ ~e & n, Y$ = (e, t, n) => e & t ^ e & n ^ t & n, q$ = new Uint32Array([
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
]), no = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ro = new Uint32Array(64);
class Rm extends dh {
  constructor() {
    super(64, 32, 8, !1), this.A = no[0] | 0, this.B = no[1] | 0, this.C = no[2] | 0, this.D = no[3] | 0, this.E = no[4] | 0, this.F = no[5] | 0, this.G = no[6] | 0, this.H = no[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ro[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = ro[d - 15], g = ro[d - 2], v = Zr(w, 7) ^ Zr(w, 18) ^ w >>> 3, x = Zr(g, 17) ^ Zr(g, 19) ^ g >>> 10;
      ro[d] = x + ro[d - 7] + v + ro[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Zr(a, 6) ^ Zr(a, 11) ^ Zr(a, 25), g = h + w + X$(a, c, u) + q$[d] + ro[d] | 0, x = (Zr(r, 2) ^ Zr(r, 13) ^ Zr(r, 22)) + Y$(r, o, s) | 0;
      h = u, u = c, c = a, a = i + g | 0, i = s, s = o, o = r, r = g + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    ro.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class W$ extends Rm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const ph = pi(() => new Rm());
pi(() => new W$());
const Pc = BigInt(2 ** 32 - 1), Wd = BigInt(32);
function zm(e, t = !1) {
  return t ? { h: Number(e & Pc), l: Number(e >> Wd & Pc) } : { h: Number(e >> Wd & Pc) | 0, l: Number(e & Pc) | 0 };
}
function Z$(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = zm(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const J$ = (e, t) => BigInt(e >>> 0) << Wd | BigInt(t >>> 0), Q$ = (e, t, n) => e >>> n, e8 = (e, t, n) => e << 32 - n | t >>> n, t8 = (e, t, n) => e >>> n | t << 32 - n, n8 = (e, t, n) => e << 32 - n | t >>> n, r8 = (e, t, n) => e << 64 - n | t >>> n - 32, s8 = (e, t, n) => e >>> n - 32 | t << 64 - n, o8 = (e, t) => t, i8 = (e, t) => e, a8 = (e, t, n) => e << n | t >>> 32 - n, c8 = (e, t, n) => t << n | e >>> 32 - n, l8 = (e, t, n) => t << n - 32 | e >>> 64 - n, u8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function d8(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const f8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), h8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, p8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), g8 = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, y8 = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), w8 = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, nt = {
  fromBig: zm,
  split: Z$,
  toBig: J$,
  shrSH: Q$,
  shrSL: e8,
  rotrSH: t8,
  rotrSL: n8,
  rotrBH: r8,
  rotrBL: s8,
  rotr32H: o8,
  rotr32L: i8,
  rotlSH: a8,
  rotlSL: c8,
  rotlBH: l8,
  rotlBL: u8,
  add: d8,
  add3L: f8,
  add3H: h8,
  add4L: p8,
  add4H: g8,
  add5H: w8,
  add5L: y8
}, [m8, b8] = nt.split([
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
].map((e) => BigInt(e))), so = new Uint32Array(80), oo = new Uint32Array(80);
class su extends dh {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: g, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, w, g, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, w, g, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      so[A] = t.getUint32(n), oo[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = so[A - 15] | 0, _ = oo[A - 15] | 0, Y = nt.rotrSH(T, _, 1) ^ nt.rotrSH(T, _, 8) ^ nt.shrSH(T, _, 7), ce = nt.rotrSL(T, _, 1) ^ nt.rotrSL(T, _, 8) ^ nt.shrSL(T, _, 7), ne = so[A - 2] | 0, q = oo[A - 2] | 0, m = nt.rotrSH(ne, q, 19) ^ nt.rotrBH(ne, q, 61) ^ nt.shrSH(ne, q, 6), I = nt.rotrSL(ne, q, 19) ^ nt.rotrBL(ne, q, 61) ^ nt.shrSL(ne, q, 6), N = nt.add4L(ce, I, oo[A - 7], oo[A - 16]), P = nt.add4H(N, Y, m, so[A - 7], so[A - 16]);
      so[A] = P | 0, oo[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: g, Fl: v, Gh: x, Gl: L, Hh: B, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = nt.rotrSH(d, w, 14) ^ nt.rotrSH(d, w, 18) ^ nt.rotrBH(d, w, 41), _ = nt.rotrSL(d, w, 14) ^ nt.rotrSL(d, w, 18) ^ nt.rotrBL(d, w, 41), Y = d & g ^ ~d & x, ce = w & v ^ ~w & L, ne = nt.add5L(U, _, ce, b8[A], oo[A]), q = nt.add5H(ne, B, T, Y, m8[A], so[A]), m = ne | 0, I = nt.rotrSH(r, o, 28) ^ nt.rotrBH(r, o, 34) ^ nt.rotrBH(r, o, 39), N = nt.rotrSL(r, o, 28) ^ nt.rotrBL(r, o, 34) ^ nt.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      B = x | 0, U = L | 0, x = g | 0, L = v | 0, g = d | 0, v = w | 0, { h: d, l: w } = nt.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = nt.add3L(m, N, W);
      r = nt.add3H(R, q, I, P), o = R | 0;
    }
    ({ h: r, l: o } = nt.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = nt.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = nt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: g, l: v } = nt.add(this.Fh | 0, this.Fl | 0, g | 0, v | 0), { h: x, l: L } = nt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: U } = nt.add(this.Hh | 0, this.Hl | 0, B | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, w, g, v, x, L, B, U);
  }
  roundClean() {
    so.fill(0), oo.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class x8 extends su {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class S8 extends su {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class v8 extends su {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
pi(() => new su());
pi(() => new x8());
const A8 = pi(() => new S8());
pi(() => new v8());
function Gm(e) {
  if (Gt(e).byteLength != ru)
    throw Error("Invalid signature");
  return {
    type: Le.MessageSignature,
    data: e
  };
}
function Ia(e, t) {
  return { type: Le.Address, version: e, hash160: t };
}
function Ui(e) {
  return di.c32address(e.version, e.hash160);
}
function si(e, t, n) {
  const r = t || 1, o = n || I$;
  if (ab(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Le.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function gh(e) {
  const t = di.c32addressDecode(e);
  return {
    type: Le.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ie;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ie || (ie = {}));
function E8(e) {
  if (e.type === ie.PrincipalStandard)
    return Ui(e.address);
  if (e.type === ie.PrincipalContract)
    return `${Ui(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Km(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return I8(t, n);
  } else
    return k8(e);
}
function k8(e) {
  const t = gh(e);
  return { type: ie.PrincipalStandard, address: t };
}
function $8(e) {
  return { type: ie.PrincipalStandard, address: e };
}
function I8(e, t) {
  const n = gh(e), r = si(t);
  return Vm(n, r);
}
function Vm(e, t) {
  if (da(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ie.PrincipalContract, address: e, contractName: t };
}
function Uu(e, t = !1) {
  switch (e.type) {
    case ie.BoolTrue:
      return !0;
    case ie.BoolFalse:
      return !1;
    case ie.Int:
    case ie.UInt:
      return t ? e.value.toString() : e.value;
    case ie.Buffer:
      return `0x${lt(e.buffer)}`;
    case ie.OptionalNone:
      return null;
    case ie.OptionalSome:
      return Ur(e.value);
    case ie.ResponseErr:
      return Ur(e.value);
    case ie.ResponseOk:
      return Ur(e.value);
    case ie.PrincipalStandard:
    case ie.PrincipalContract:
      return E8(e);
    case ie.List:
      return e.list.map((r) => Ur(r));
    case ie.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Ur(e.data[r]);
      }), n;
    case ie.StringASCII:
      return e.data;
    case ie.StringUTF8:
      return e.data;
  }
}
function Ur(e) {
  switch (e.type) {
    case ie.ResponseErr:
      return { type: lo(e), value: Uu(e, !0), success: !1 };
    case ie.ResponseOk:
      return { type: lo(e), value: Uu(e, !0), success: !0 };
    default:
      return { type: lo(e), value: Uu(e, !0) };
  }
}
function lo(e) {
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
      return `(optional ${lo(e.value)})`;
    case ie.ResponseErr:
      return `(response UnknownType ${lo(e.value)})`;
    case ie.ResponseOk:
      return `(response ${lo(e.value)} UnknownType)`;
    case ie.PrincipalStandard:
    case ie.PrincipalContract:
      return "principal";
    case ie.List:
      return `(list ${e.list.length} ${e.list.length ? lo(e.list[0]) : "UnknownType"})`;
    case ie.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${lo(e.data[t])})`).join(" ")})`;
    case ie.StringASCII:
      return `(string-ascii ${_m(e.data).length})`;
    case ie.StringUTF8:
      return `(string-utf8 ${da(e.data).length})`;
  }
}
const Xm = () => ({ type: ie.BoolTrue }), Ym = () => ({ type: ie.BoolFalse }), L8 = (e) => e ? Xm() : Ym(), X0 = BigInt("0xffffffffffffffffffffffffffffffff"), C8 = BigInt(0), Y0 = BigInt("0x7fffffffffffffffffffffffffffffff"), q0 = BigInt("-170141183460469231731687303715884105728"), T8 = (e) => {
  const t = Gn(e, !0);
  if (t > Y0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Y0}`);
  if (t < q0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${q0}`);
  return { type: ie.Int, value: t };
}, En = (e) => {
  const t = Gn(e, !1);
  if (t < C8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > X0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${X0}`);
  return { type: ie.UInt, value: t };
}, qm = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ie.Buffer, buffer: e };
};
function Wm() {
  return { type: ie.OptionalNone };
}
function Zm(e) {
  return { type: ie.OptionalSome, value: e };
}
function B8(e) {
  return { type: ie.ResponseErr, value: e };
}
function N8(e) {
  return { type: ie.ResponseOk, value: e };
}
function M8(e) {
  return { type: ie.List, list: e };
}
function wr(e) {
  for (const t in e)
    if (!v6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ie.Tuple, data: e };
}
const St = (e) => ({ type: ie.StringASCII, data: e }), P8 = (e) => ({ type: ie.StringUTF8, data: e });
class Jm extends Dm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Ho.hash(t);
    const r = uh(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Ho.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Ho.exists(this), Ho.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Qm = (e, t, n) => new Jm(e, t).update(n).digest();
Qm.create = (e, t) => new Jm(e, t);
rn.hmacSha256Sync = (e, ...t) => {
  const n = Qm.create(ph, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function na(e) {
  return {
    type: Le.PublicKey,
    data: Gt(e)
  };
}
function _8(e, t, n = Wt.Compressed) {
  const r = b$(t.data), o = new pr(H0(r.r), H0(r.s)), s = at.fromSignature(e, o, r.recoveryId), i = n === Wt.Compressed;
  return s.toHex(i);
}
function U8(e) {
  return { type: Le.PublicKey, data: e };
}
function fa(e) {
  return !lt(e.data).startsWith("04");
}
function vl(e) {
  return e.data.slice();
}
function O8(e) {
  const t = F8(e), n = Za(t.data.slice(0, 32), t.compressed);
  return na(lt(n));
}
function H8(e) {
  const t = typeof e == "string" ? e : lt(e), n = at.fromHex(t).toHex(!0);
  return na(n);
}
function D8(e) {
  const t = typeof e == "string" ? e : lt(e), n = at.fromHex(t).toHex(!1);
  return na(n);
}
function Zd(e) {
  const t = e.readUInt8(), n = t === 4 ? T$ : C$;
  return U8(ln([t, e.readBytes(n)]));
}
function F8(e) {
  const t = x$(e), n = t.length == Um;
  return { data: t, compressed: n };
}
function j8(e, t) {
  const [n, r] = Ul(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = nc(r, 1) + pr.fromHex(n).toCompactHex();
  return Gm(s);
}
function R8(e) {
  return O8(e.data);
}
function z8(e, t, n) {
  return typeof e == "string" && (e = Km(e)), typeof n == "string" && (n = J0(n)), {
    type: Le.Payload,
    payloadType: it.TokenTransfer,
    recipient: e,
    amount: Gn(t, !1),
    memo: n ?? J0("")
  };
}
function G8(e, t, n, r) {
  return typeof e == "string" && (e = gh(e)), typeof t == "string" && (t = si(t)), typeof n == "string" && (n = si(n)), {
    type: Le.Payload,
    payloadType: it.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function W0(e, t, n) {
  return typeof e == "string" && (e = si(e)), typeof t == "string" && (t = Q8(t)), typeof n == "number" ? {
    type: Le.Payload,
    payloadType: it.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Le.Payload,
    payloadType: it.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function K8() {
  return { type: Le.Payload, payloadType: it.PoisonMicroblock };
}
function Z0(e, t) {
  if (e.byteLength != Ro)
    throw Error(`Coinbase buffer size must be ${Ro} bytes`);
  return t != null ? {
    type: Le.Payload,
    payloadType: it.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Le.Payload,
    payloadType: it.Coinbase,
    coinbaseBytes: e
  };
}
function V8(e, t, n) {
  if (e.byteLength != Ro)
    throw Error(`Coinbase buffer size must be ${Ro} bytes`);
  if (n.byteLength != Vd)
    throw Error(`VRF proof buffer size must be ${Vd} bytes`);
  return {
    type: Le.Payload,
    payloadType: it.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ie.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var Jd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Jd || (Jd = {}));
function X8(e, t, n, r, o, s, i) {
  return {
    type: Le.Payload,
    payloadType: it.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: o,
    cause: s,
    publicKeyHash: i
  };
}
function eb(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case it.TokenTransfer:
      t.push(on(e.recipient)), t.push(wo(e.amount, !1, 8)), t.push(Ss(e.memo));
      break;
    case it.ContractCall:
      t.push(Ss(e.contractAddress)), t.push(Ss(e.contractName)), t.push(Ss(e.functionName));
      const n = new Uint8Array(4);
      ri(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(on(r));
      });
      break;
    case it.SmartContract:
      t.push(Ss(e.contractName)), t.push(Ss(e.codeBody));
      break;
    case it.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Ss(e.contractName)), t.push(Ss(e.codeBody));
      break;
    case it.PoisonMicroblock:
      break;
    case it.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case it.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(on(e.recipient));
      break;
    case it.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(on(e.recipient ? Zm(e.recipient) : Wm())), t.push(e.vrfProof);
      break;
    case it.TenureChange:
      t.push(Gt(e.tenureHash)), t.push(Gt(e.previousTenureHash)), t.push(Gt(e.burnViewHash)), t.push(Gt(e.previousTenureEnd)), t.push(ri(new Uint8Array(4), e.previousTenureBlocks)), t.push(E$(new Uint8Array(1), e.cause)), t.push(Gt(e.publicKeyHash));
      break;
  }
  return ln(t);
}
function Y8(e) {
  switch (e.readUInt8Enum(it, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case it.TokenTransfer:
      const n = $r(e), r = Gn(e.readBytes(8), !1), o = nb(e);
      return z8(n, r, o);
    case it.ContractCall:
      const s = ra(e), i = kr(e), a = kr(e), c = [], u = e.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const T = $r(e);
        c.push(T);
      }
      return G8(s, i, a, c);
    case it.SmartContract:
      const h = kr(e), d = kr(e, 4, 1e5);
      return W0(h, d);
    case it.VersionedSmartContract: {
      const A = e.readUInt8Enum(Xd, (Y) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Y}`);
      }), T = kr(e), _ = kr(e, 4, 1e5);
      return W0(T, _, A);
    }
    case it.PoisonMicroblock:
      return K8();
    case it.Coinbase: {
      const A = e.readBytes(Ro);
      return Z0(A);
    }
    case it.CoinbaseToAltRecipient: {
      const A = e.readBytes(Ro), T = $r(e);
      return Z0(A, T);
    }
    case it.NakamotoCoinbase: {
      const A = e.readBytes(Ro), T = $r(e), _ = e.readBytes(Vd);
      return V8(A, T, _);
    }
    case it.TenureChange:
      const w = lt(e.readBytes(20)), g = lt(e.readBytes(20)), v = lt(e.readBytes(20)), x = lt(e.readBytes(32)), L = e.readUInt32BE(), B = e.readUInt8Enum(Jd, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), U = lt(e.readBytes(20));
      return X8(w, g, v, x, L, B, U);
  }
}
class ou extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Mo extends ou {
  constructor(t) {
    super(t);
  }
}
class hr extends ou {
  constructor(t) {
    super(t);
  }
}
class Al extends ou {
  constructor(t) {
    super(t);
  }
}
class Do extends ou {
  constructor(t) {
    super(t);
  }
}
var Or;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Or || (Or = {}));
function Qd(e) {
  return Gm(lt(e.readBytes(ru)));
}
function Oi(e, t) {
  return {
    pubKeyEncoding: e,
    type: Le.TransactionAuthField,
    contents: t
  };
}
function q8(e) {
  const t = e.readUInt8Enum(Or, (n) => {
    throw new hr(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Or.PublicKeyCompressed:
      return Oi(Wt.Compressed, Zd(e));
    case Or.PublicKeyUncompressed:
      return Oi(Wt.Uncompressed, D8(Zd(e).data));
    case Or.SignatureCompressed:
      return Oi(Wt.Compressed, Qd(e));
    case Or.SignatureUncompressed:
      return Oi(Wt.Uncompressed, Qd(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function yh(e) {
  return Gt(e.data);
}
function W8(e) {
  const t = [];
  switch (e.contents.type) {
    case Le.PublicKey:
      t.push(e.pubKeyEncoding === Wt.Compressed ? Or.PublicKeyCompressed : Or.PublicKeyUncompressed), t.push(vl(H8(e.contents.data)));
      break;
    case Le.MessageSignature:
      t.push(e.pubKeyEncoding === Wt.Compressed ? Or.SignatureCompressed : Or.SignatureUncompressed), t.push(yh(e.contents));
      break;
  }
  return ln(t);
}
function Ss(e) {
  switch (e.type) {
    case Le.Address:
      return rc(e);
    case Le.Principal:
      return tb(e);
    case Le.LengthPrefixedString:
      return sa(e);
    case Le.MemoString:
      return e6(e);
    case Le.AssetInfo:
      return rb(e);
    case Le.PostCondition:
      return t6(e);
    case Le.PublicKey:
      return vl(e);
    case Le.LengthPrefixedList:
      return bh(e);
    case Le.Payload:
      return eb(e);
    case Le.TransactionAuthField:
      return W8(e);
    case Le.MessageSignature:
      return yh(e);
  }
}
function Z8() {
  return {
    type: Le.Address,
    version: Sl.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function wh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Pt.SerializeP2PKH || t === Pt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Pt.SerializeP2WPKH || t === Pt.SerializeP2WSH || t === Pt.SerializeP2WSHNonSequential) && !r.every(fa))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Pt.SerializeP2PKH:
      return Ia(e, m6(r[0].data));
    case Pt.SerializeP2WPKH:
      return Ia(e, b6(r[0].data));
    case Pt.SerializeP2SH:
    case Pt.SerializeP2SHNonSequential:
      return Ia(e, x6(n, r.map(vl)));
    case Pt.SerializeP2WSH:
    case Pt.SerializeP2WSHNonSequential:
      return Ia(e, S6(n, r.map(vl)));
  }
}
function rc(e) {
  const t = [];
  return t.push(Gt(nc(e.version, 1))), t.push(Gt(e.hash160)), ln(t);
}
function ra(e) {
  const t = tu(lt(e.readBytes(1))), n = lt(e.readBytes(20));
  return { type: Le.Address, version: t, hash160: n };
}
function tb(e) {
  const t = [];
  return t.push(e.prefix), t.push(rc(e.address)), e.prefix === Ga.Contract && t.push(sa(e.contractName)), ln(t);
}
function J8(e) {
  const t = e.readUInt8Enum(Ga, (o) => {
    throw new hr(`Unexpected Principal payload type: ${o}`);
  }), n = ra(e);
  if (t === Ga.Standard)
    return { type: Le.Principal, prefix: t, address: n };
  const r = kr(e);
  return {
    type: Le.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function sa(e) {
  const t = [], n = da(e.content), r = n.byteLength;
  return t.push(Gt(nc(r, e.lengthPrefixBytes))), t.push(n), ln(t);
}
function kr(e, t, n) {
  t = t || 1;
  const r = tu(lt(e.readBytes(t))), o = lh(e.readBytes(r));
  return si(o, t, n ?? 128);
}
function Q8(e) {
  return si(e, 4, 1e5);
}
function J0(e) {
  if (e && ab(e, bl))
    throw new Error(`Memo exceeds maximum length of ${bl} bytes`);
  return { type: Le.MemoString, content: e };
}
function e6(e) {
  const t = [], n = da(e.content), r = w6(lt(n), bl * 2);
  return t.push(Gt(r)), ln(t);
}
function nb(e) {
  let t = lh(e.readBytes(bl));
  return t = t.replace(/\u0000*$/, ""), { type: Le.MemoString, content: t };
}
function rb(e) {
  const t = [];
  return t.push(rc(e.address)), t.push(sa(e.contractName)), t.push(sa(e.assetName)), ln(t);
}
function ef(e) {
  return {
    type: Le.AssetInfo,
    address: ra(e),
    contractName: kr(e),
    assetName: kr(e)
  };
}
function mh(e, t) {
  return {
    type: Le.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function bh(e) {
  const t = e.values, n = [];
  n.push(Gt(nc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Ss(r));
  return ln(n);
}
function sb(e, t, n) {
  const r = tu(lt(e.readBytes(4))), o = [];
  for (let s = 0; s < r; s++)
    switch (t) {
      case Le.Address:
        o.push(ra(e));
        break;
      case Le.LengthPrefixedString:
        o.push(kr(e));
        break;
      case Le.MemoString:
        o.push(nb(e));
        break;
      case Le.AssetInfo:
        o.push(ef(e));
        break;
      case Le.PostCondition:
        o.push(n6(e));
        break;
      case Le.PublicKey:
        o.push(Zd(e));
        break;
      case Le.TransactionAuthField:
        o.push(q8(e));
        break;
    }
  return mh(o, n);
}
function t6(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(tb(e.principal)), (e.conditionType === Jn.Fungible || e.conditionType === Jn.NonFungible) && t.push(rb(e.assetInfo)), e.conditionType === Jn.NonFungible && t.push(on(e.assetName)), t.push(e.conditionCode), e.conditionType === Jn.STX || e.conditionType === Jn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Mo("The post-condition amount may not be larger than 8 bytes");
    t.push(wo(e.amount, !1, 8));
  }
  return ln(t);
}
function n6(e) {
  const t = e.readUInt8Enum(Jn, (i) => {
    throw new hr(`Could not read ${i} as PostConditionType`);
  }), n = J8(e);
  let r, o, s;
  switch (t) {
    case Jn.STX:
      return r = e.readUInt8Enum(za, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${lt(e.readBytes(8))}`), {
        type: Le.PostCondition,
        conditionType: Jn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case Jn.Fungible:
      return o = ef(e), r = e.readUInt8Enum(za, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${lt(e.readBytes(8))}`), {
        type: Le.PostCondition,
        conditionType: Jn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: o
      };
    case Jn.NonFungible:
      o = ef(e);
      const i = $r(e);
      return r = e.readUInt8Enum(Yd, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Le.PostCondition,
        conditionType: Jn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: o,
        assetName: i
      };
  }
}
function cs(e, t) {
  return ln([e, t]);
}
function r6(e) {
  return new Uint8Array([e.type]);
}
function s6(e) {
  return e.type === ie.OptionalNone ? new Uint8Array([e.type]) : cs(e.type, on(e.value));
}
function o6(e) {
  const t = new Uint8Array(4);
  return ri(t, e.buffer.length, 0), cs(e.type, nu(t, e.buffer));
}
function i6(e) {
  const t = ch(h$(e.value, BigInt(L$)), Om);
  return cs(e.type, t);
}
function a6(e) {
  const t = ch(e.value, Om);
  return cs(e.type, t);
}
function c6(e) {
  return cs(e.type, rc(e.address));
}
function l6(e) {
  return cs(e.type, nu(rc(e.address), sa(e.contractName)));
}
function u6(e) {
  return cs(e.type, on(e.value));
}
function d6(e) {
  const t = [], n = new Uint8Array(4);
  ri(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const o = on(r);
    t.push(o);
  }
  return cs(e.type, ln(t));
}
function f6(e) {
  const t = [], n = new Uint8Array(4);
  ri(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = si(o);
    t.push(sa(s));
    const i = on(e.data[o]);
    t.push(i);
  }
  return cs(e.type, ln(t));
}
function ob(e, t) {
  const n = [], r = t == "ascii" ? _m(e.data) : da(e.data), o = new Uint8Array(4);
  return ri(o, r.length, 0), n.push(o), n.push(r), cs(e.type, ln(n));
}
function h6(e) {
  return ob(e, "ascii");
}
function p6(e) {
  return ob(e, "utf8");
}
function on(e) {
  switch (e.type) {
    case ie.BoolTrue:
    case ie.BoolFalse:
      return r6(e);
    case ie.OptionalNone:
    case ie.OptionalSome:
      return s6(e);
    case ie.Buffer:
      return o6(e);
    case ie.UInt:
      return a6(e);
    case ie.Int:
      return i6(e);
    case ie.PrincipalStandard:
      return c6(e);
    case ie.PrincipalContract:
      return l6(e);
    case ie.ResponseOk:
    case ie.ResponseErr:
      return u6(e);
    case ie.List:
      return d6(e);
    case ie.Tuple:
      return f6(e);
    case ie.StringASCII:
      return h6(e);
    case ie.StringUTF8:
      return p6(e);
    default:
      throw new Mo("Unable to serialize. Invalid Clarity Value.");
  }
}
function g6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const Q0 = /* @__PURE__ */ new Map();
function ib(e, t) {
  const n = Q0.get(e);
  if (n !== void 0)
    return n(t);
  const r = g6(e);
  return Q0.set(e, r), ib(e, t);
}
class Ma {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return k$(this.readBytes(4), 0);
  }
  readUInt8() {
    return A$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return S$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = lt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = lt(n);
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
    if (ib(t, r))
      return r;
    throw n(r);
  }
}
function $r(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Ma(Gt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Ma(e) : t = e;
  switch (t.readUInt8Enum(ie, (r) => {
    throw new hr(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ie.Int:
      return T8(t.readBytes(16));
    case ie.UInt:
      return En(t.readBytes(16));
    case ie.Buffer:
      const r = t.readUInt32BE();
      return qm(t.readBytes(r));
    case ie.BoolTrue:
      return Xm();
    case ie.BoolFalse:
      return Ym();
    case ie.PrincipalStandard:
      const o = ra(t);
      return $8(o);
    case ie.PrincipalContract:
      const s = ra(t), i = kr(t);
      return Vm(s, i);
    case ie.ResponseOk:
      return N8($r(t));
    case ie.ResponseErr:
      return B8($r(t));
    case ie.OptionalNone:
      return Wm();
    case ie.OptionalSome:
      return Zm($r(t));
    case ie.List:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push($r(t));
      return M8(c);
    case ie.Tuple:
      const u = t.readUInt32BE(), h = {};
      for (let x = 0; x < u; x++) {
        const L = kr(t).content;
        if (L === void 0)
          throw new hr('"content" is undefined');
        h[L] = $r(t);
      }
      return wr(h);
    case ie.StringASCII:
      const d = t.readUInt32BE(), w = w$(t.readBytes(d));
      return St(w);
    case ie.StringUTF8:
      const g = t.readUInt32BE(), v = lh(t.readBytes(g));
      return P8(v);
    default:
      throw new hr("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const y6 = (e) => e.length % 2 == 0 ? e : `0${e}`, w6 = (e, t) => e.padEnd(t, "0"), ab = (e, t) => e ? da(e).length > t : !1;
function tf(e) {
  return $w(e);
}
const Ka = (e) => V$(ph(e)), xh = (e) => lt(A8(e)), m6 = (e) => lt(Ka(e)), b6 = (e) => {
  const t = Ka(e), n = nu(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ka(n);
  return lt(r);
}, x6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = ln(n), o = Ka(r);
  return lt(o);
}, S6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = ln(n), o = ph(r), s = [];
  s.push(0), s.push(o.length), s.push(o);
  const i = ln(s), a = Ka(i);
  return lt(a);
};
function v6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function cb(e) {
  const t = on(e);
  return `0x${lt(t)}`;
}
function A6(e) {
  return $r(e);
}
const ji = (e) => {
  try {
    return di.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Sh() {
  return {
    type: Le.MessageSignature,
    data: lt(new Uint8Array(ru))
  };
}
function lb(e, t, n, r) {
  const o = wh(0, e, 1, [na(t)]).hash160, s = fa(na(t)) ? Wt.Compressed : Wt.Uncompressed;
  return {
    hashMode: e,
    signer: o,
    nonce: Gn(n, !1),
    fee: Gn(r, !1),
    keyEncoding: s,
    signature: Sh()
  };
}
function Va(e) {
  return "signature" in e;
}
function eg(e) {
  return e === Pt.SerializeP2SH || e === Pt.SerializeP2WSH;
}
function E6(e) {
  return e === Pt.SerializeP2SHNonSequential || e === Pt.SerializeP2WSHNonSequential;
}
function tg(e) {
  const t = tf(e);
  return t.nonce = 0, t.fee = 0, Va(t) ? t.signature = Sh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function k6(e) {
  const t = [
    e.hashMode,
    Gt(e.signer),
    wo(e.nonce, !1, 8),
    wo(e.fee, !1, 8),
    e.keyEncoding,
    yh(e.signature)
  ];
  return ln(t);
}
function $6(e) {
  const t = [
    e.hashMode,
    Gt(e.signer),
    wo(e.nonce, !1, 8),
    wo(e.fee, !1, 8)
  ], n = mh(e.fields);
  t.push(bh(n));
  const r = new Uint8Array(2);
  return v$(r, e.signaturesRequired, 0), t.push(r), ln(t);
}
function I6(e, t) {
  const n = lt(t.readBytes(20)), r = BigInt(`0x${lt(t.readBytes(8))}`), o = BigInt(`0x${lt(t.readBytes(8))}`), s = t.readUInt8Enum(Wt, (a) => {
    throw new hr(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Pt.SerializeP2WPKH && s != Wt.Compressed)
    throw new hr("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Qd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    keyEncoding: s,
    signature: i
  };
}
function L6(e, t) {
  const n = lt(t.readBytes(20)), r = BigInt("0x" + lt(t.readBytes(8))), o = BigInt("0x" + lt(t.readBytes(8))), s = sb(t, Le.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case Le.PublicKey:
        fa(u.contents) || (i = !0);
        break;
      case Le.MessageSignature:
        if (u.pubKeyEncoding === Wt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Do("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Pt.SerializeP2WSH || e === Pt.SerializeP2WSHNonSequential))
    throw new Do("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    fields: s,
    signaturesRequired: c
  };
}
function Ou(e) {
  return Va(e) ? k6(e) : $6(e);
}
function Hu(e) {
  const t = e.readUInt8Enum(Pt, (n) => {
    throw new hr(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Pt.SerializeP2PKH || t === Pt.SerializeP2WPKH ? I6(t, e) : L6(t, e);
}
function ub(e, t, n, r) {
  const s = e + lt(new Uint8Array([t])) + lt(wo(n, !1, 8)) + lt(wo(r, !1, 8));
  if (Gt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return xh(Gt(s));
}
function db(e, t, n) {
  const r = 33 + ru, o = fa(t) ? Wt.Compressed : Wt.Uncompressed, s = e + y6(o.toString(16)) + n.data, i = Gt(s);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return xh(i);
}
function C6(e, t, n, r, o) {
  const s = ub(e, t, n, r), i = j8(o, s), a = R8(o), c = db(s, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function fb(e, t, n, r, o, s) {
  const i = ub(e, t, n, r), a = na(_8(i, s, o)), c = db(i, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function T6() {
  const e = lb(Pt.SerializeP2PKH, "", 0, 0);
  return e.signer = Z8().hash160, e.keyEncoding = Wt.Compressed, e.signature = Sh(), e;
}
function ng(e, t, n) {
  return Va(e) ? B6(e, t, n) : N6(e, t, n);
}
function B6(e, t, n) {
  const { pubKey: r, nextSigHash: o } = fb(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), s = wh(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new Do(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return o;
}
function N6(e, t, n) {
  const r = [];
  let o = t, s = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Le.PublicKey:
        fa(c.contents) || (s = !0), r.push(c.contents);
        break;
      case Le.MessageSignature:
        c.pubKeyEncoding === Wt.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: h } = fb(o, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (eg(e.hashMode) && (o = h), r.push(u), i += 1, i === 65536)
          throw new Do("Too many signatures");
        break;
    }
  if (eg(e.hashMode) && i !== e.signaturesRequired || E6(e.hashMode) && i < e.signaturesRequired)
    throw new Do("Incorrect number of signatures");
  if (s && (e.hashMode === Pt.SerializeP2WSH || e.hashMode === Pt.SerializeP2WSHNonSequential))
    throw new Do("Uncompressed keys are not allowed in this hash mode");
  const a = wh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Do(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return o;
}
function hb(e) {
  return {
    authType: nn.Standard,
    spendingCondition: e
  };
}
function pb(e, t) {
  return {
    authType: nn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || lb(Pt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function rg(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case nn.Standard:
        return hb(tg(e.spendingCondition));
      case nn.Sponsored:
        return pb(tg(e.spendingCondition), T6());
      default:
        throw new Al("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function M6(e, t) {
  switch (e.authType) {
    case nn.Standard:
      return ng(e.spendingCondition, t, nn.Standard);
    case nn.Sponsored:
      return ng(e.spendingCondition, t, nn.Standard);
    default:
      throw new Al("Invalid origin auth type");
  }
}
function P6(e, t) {
  switch (e.authType) {
    case nn.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Gn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case nn.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Gn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function _6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Gn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function U6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Gn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function O6(e, t) {
  const n = {
    ...t,
    nonce: Gn(t.nonce, !1),
    fee: Gn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function H6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case nn.Standard:
      t.push(Ou(e.spendingCondition));
      break;
    case nn.Sponsored:
      t.push(Ou(e.spendingCondition)), t.push(Ou(e.sponsorSpendingCondition));
      break;
  }
  return ln(t);
}
function D6(e) {
  const t = e.readUInt8Enum(nn, (r) => {
    throw new hr(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case nn.Standard:
      return n = Hu(e), hb(n);
    case nn.Sponsored:
      n = Hu(e);
      const r = Hu(e);
      return pb(n, r);
  }
}
class F6 {
  constructor(t, n, r, o, s, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Gn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? $$, this.postConditionMode = s ?? ta.Deny, this.postConditions = o ?? mh([]), i)
      this.anchorMode = B$(i);
    else
      switch (r.payloadType) {
        case it.Coinbase:
        case it.CoinbaseToAltRecipient:
        case it.NakamotoCoinbase:
        case it.PoisonMicroblock:
        case it.TenureChange:
          this.anchorMode = Zn.OnChainOnly;
          break;
        case it.ContractCall:
        case it.SmartContract:
        case it.VersionedSmartContract:
        case it.TokenTransfer:
          this.anchorMode = Zn.Any;
          break;
      }
  }
  signBegin() {
    const t = tf(this);
    return t.auth = rg(t.auth), t.txid();
  }
  verifyBegin() {
    const t = tf(this);
    return t.auth = rg(t.auth), t.txid();
  }
  verifyOrigin() {
    return M6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, nn.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === nn.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, nn.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !Va(n)) {
      const r = fa(t);
      n.fields.push(Oi(r ? Wt.Compressed : Wt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, o) {
    const { nextSig: s, nextSigHash: i } = C6(n, r, t.fee, t.nonce, o);
    return Va(t) ? t.signature = s : t.fields.push(Oi(o.data.byteLength === Um ? Wt.Compressed : Wt.Uncompressed, s)), i;
  }
  txid() {
    const t = this.serialize();
    return xh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != nn.Sponsored)
      throw new Al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = O6(this.auth, t);
  }
  setFee(t) {
    this.auth = P6(this.auth, t);
  }
  setNonce(t) {
    this.auth = _6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != nn.Sponsored)
      throw new Al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = U6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new Mo('"version" is undefined');
    if (this.chainId === void 0)
      throw new Mo('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Mo('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Mo('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Mo('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return ri(n, this.chainId, 0), t.push(n), t.push(H6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(bh(this.postConditions)), t.push(eb(this.payload)), ln(t);
  }
}
function Hi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new Ma(Gt(e.slice(2))) : t = new Ma(Gt(e)) : e instanceof Uint8Array ? t = new Ma(e) : t = e;
  const n = t.readUInt8Enum(xl, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), o = D6(t), s = t.readUInt8Enum(Zn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(ta, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = sb(t, Le.PostCondition), c = Y8(t);
  return new F6(n, o, c, a, i, s, r);
}
const j6 = L8, Pa = En, R6 = qm;
const z6 = /* @__PURE__ */ new Set([4001, -31001]), G6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], K6 = ["result", "data", "payload", "response", "params"], sg = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], iu = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), gi = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, $s = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, V6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), gb = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, o) => !!(r != null && r.id) && n.findIndex((s) => V6(s, r)) === o
  );
}, yb = (e) => e ? gb(gi()).some(
  (t) => {
    var n;
    return t.id === e && (iu(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, wb = () => {
  if (typeof window > "u")
    return;
  const e = gi(), t = gb(e).filter(
    (n) => {
      var r;
      return iu(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = $s(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of G6) {
    const r = $s(e, n) ?? (e === window ? void 0 : $s(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, X6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = gi(), n = $s(t, e) ?? (t === window ? void 0 : $s(window, e)) ?? Vl(e);
  if (n)
    return n;
  if (iu(e) || yb(e))
    return wb();
}, _c = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, Y6 = ["blockstack-session", "blockstack"], q6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of Y6) {
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
q6();
const mb = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, dr = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, W6 = (e) => {
  const t = dr(e);
  if (!t)
    return null;
  const n = mb(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, Z6 = (e) => {
  const t = dr(e);
  if (!t)
    return null;
  const n = mb(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, nf = (e, t = "mainnet") => {
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
      return nf(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return nf(r, t);
  }
  return t;
}, zo = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, Xa = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const o = e.trim();
    return ji(o) ? o : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const o of e) {
      const s = Xa(o, t + 1);
      if (s)
        return s;
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
  for (const o of r) {
    if (!(o in n))
      continue;
    const s = Xa(n[o], t + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && ji(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ji(n.testnet) ? n.testnet.trim() : null;
}, og = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, bb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && z6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, oi = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = dr(n == null ? void 0 : n.message) ?? dr(t.message) ?? dr(t.error) ?? dr(e) ?? "Wallet provider request failed.", o = new Error(r);
  return o.code = (n == null ? void 0 : n.code) ?? t.code, o.data = (n == null ? void 0 : n.data) ?? t.data, o;
}, oa = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw oi(t);
    if (t.status === "error")
      throw oi(t.result ?? t);
  }
  return e;
}, ig = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return oa(r);
  } catch (r) {
    throw oi(r);
  }
}, xb = () => wb(), vh = () => {
  if (typeof window > "u")
    return;
  const e = gi();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = $s(e, t) ?? (e === window ? void 0 : $s(window, t));
    if (n)
      return n;
  }
}, ag = () => {
  if (typeof window > "u")
    return;
  const e = vh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = gi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = $s(t, n) ?? (t === window ? void 0 : $s(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Zc = (e) => {
  var r, o;
  const t = Wo();
  if (iu(t) || yb(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = gi() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) || e === xb();
}, Du = (e) => {
  const t = Z6(e);
  if (!t)
    return null;
  try {
    const n = Hi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, El = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = Du(e), r = W6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? dr(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = El(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const o = e;
  let s = null;
  for (const a of sg)
    if (Du(o[a])) {
      s = dr(o[a]);
      break;
    }
  const i = dr(o.txId) || dr(o.txid) || dr(o.transactionId);
  if (i)
    return {
      ...o,
      txId: i,
      txid: i,
      txRaw: s ?? dr(o.txRaw) ?? void 0
    };
  for (const a of sg) {
    const c = Du(o[a]);
    if (c)
      return {
        ...o,
        txId: c,
        txid: c,
        txRaw: dr(o[a]) ?? void 0
      };
  }
  for (const a of K6) {
    const c = o[a], u = El(c, t + 1);
    if (u)
      return {
        ...o,
        ...c && typeof c == "object" ? c : {},
        ...u,
        txId: u.txId,
        txid: u.txid ?? u.txId
      };
  }
  return null;
}, Fu = (e) => {
  const t = El(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, J6 = (e) => {
  const t = El(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, Q6 = (e) => ({
  ...e,
  fee: zo(e.fee),
  nonce: zo(e.nonce),
  sponsored: e.sponsored === !0
}), cg = (e) => ({
  recipient: e.recipient,
  amount: zo(e.amount) ?? "0",
  memo: e.memo,
  network: nf(e.network),
  address: e.stxAddress,
  fee: zo(e.fee),
  nonce: zo(e.nonce),
  sponsored: e.sponsored ?? !1
}), Sb = "WALLET_ADDRESS_MISMATCH", e5 = 45e3;
let _a = null;
const rf = (e) => {
  e && (_a = { address: e, at: Date.now() });
}, t5 = () => {
  _a = null;
}, n5 = () => _a && Date.now() - _a.at <= e5 ? _a.address : null, r5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, s5 = async (e) => {
  t5();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = oa(await e.request("wallet_connect")), n = Xa(t);
  return rf(n), n;
}, o5 = async (e, t, n, r) => {
  try {
    return oa(await e.request(t, n));
  } catch (o) {
    const s = oi(o);
    if (!r5(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: s.message
    });
    let i = null;
    try {
      i = await s5(e);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), s;
    }
    if (!i || r && i !== r)
      throw Object.assign(
        new Error(
          i ? `Xverse reconnected as ${i}, not the expected ${r}. Switch back to that account and retry.` : s.message
        ),
        { code: i ? Sb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return oa(await e.request(t, n));
    } catch (a) {
      throw oi(a);
    }
  }
};
let lg = 3e4;
const i5 = (e, t) => {
  let n;
  const r = new Promise((o, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${lg / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, lg);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, a5 = async (e, t, n) => {
  const r = (c, u) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Sb }
      );
    return c;
  }, o = n5();
  if (o)
    return _c(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: o }), r(o, "cached-session");
  let s = null;
  _c(n, "account-read");
  try {
    const c = oa(
      await i5(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = Xa(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (bb(c))
      throw oi(c);
    _c(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return rf(s), r(s, "wallet_getAccount");
  let i;
  _c(n, "account-reconnect");
  try {
    i = oa(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), oi(c);
  }
  const a = Xa(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return rf(a), r(a, "wallet_connect");
}, c5 = async (e, t) => {
  if (!Zc(e)) {
    const s = await ig(
      e,
      "stx_transferStx",
      cg(t)
    );
    return Fu(s);
  }
  const n = vh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await ig(
      n,
      "stx_transferStx",
      cg(t)
    );
    return Fu(s);
  }
  const r = xb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await a5(r, t.stxAddress);
  const o = await o5(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: zo(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: zo(t.fee) } : {}
    },
    t.stxAddress
  );
  return Fu(o);
}, l5 = () => Wo(), vb = () => {
  var r, o;
  if (typeof window > "u")
    return;
  const e = Wo(), t = e ? X6(e) : void 0;
  if (t)
    return t;
  const n = gi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, ug = (e, t) => {
  const n = vb(), r = Q6({
    ...e,
    onFinish: (o) => {
      var s;
      (s = e.onFinish) == null || s.call(e, J6(o));
    }
  });
  if (!n || typeof n.request != "function")
    return Bc(r, t);
  if (Zc(n) && !vh()) {
    const o = ag();
    if (o)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Wo(),
        route: "legacy-transaction-request"
      }), Bc(r, o);
  }
  return void c5(n, e).then((o) => {
    var s;
    (s = e.onFinish) == null || s.call(e, o);
  }).catch((o) => {
    var s, i;
    if (og(o) && Zc(n)) {
      const a = ag();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Wo(),
          route: "legacy-transaction-request"
        }), Bc(r, a);
        return;
      }
    }
    if (og(o) && !Zc(n)) {
      Bc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", o), bb(o)) {
      (s = e.onCancel) == null || s.call(e);
      return;
    }
    if (e.onError) {
      e.onError(o);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, u5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), dg = (e) => cb(e).replace(/^0x/, ""), fg = "This wallet cannot sign messages. Try Xverse or Leather.", hg = (e) => typeof (e == null ? void 0 : e.request) == "function", pg = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", d5 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, f5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function h5(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: dg(t.message),
    domain: dg(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function p5(e, t) {
  const n = await i$({
    domain: t.domain,
    message: t.message,
    network: eu(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? u5()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function ju(e) {
  var o, s;
  const t = l5() || "", n = /xverse/i.test(t);
  let r = vb();
  if (n && !pg(r)) {
    const i = window;
    r = ((o = i.XverseProviders) == null ? void 0 : o.StacksProvider) ?? ((s = i.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (pg(r))
    try {
      return await p5(r, e);
    } catch (i) {
      if (n || !hg(r) || !f5(i)) throw i;
    }
  if (!n && hg(r))
    try {
      return await h5(r, e);
    } catch (i) {
      throw d5(i) ? new Error(fg) : i;
    }
  throw new Error(fg);
}
const gg = 1000000n, As = 1000000n, kl = 50n, an = 3000n, Rr = 300n, xa = 3000n, g5 = 50000n, y5 = 300n, w5 = 200n, au = 15000n, On = (e) => e + kl;
function Pr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / gg}.${(n % gg).toString().padStart(6, "0")}`;
}
function yg(e, t = Rr) {
  return e <= an ? 0 : Number((e - an) / On(t));
}
function Ru(e, t = 0n) {
  const n = As - e - t;
  return n > 0n ? n : 0n;
}
function m5(e, t = Rr) {
  return e > As ? "over" : e < an + On(t) ? "empty" : e < g5 ? "low" : "ok";
}
const b5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", x5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", S5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function v5(e) {
  var n, r, o, s;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((o = t["holder-payment"]) == null ? void 0 : o.value) !== "50" || ((s = t["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || S5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== b5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Ab = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", zu = 3, A5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", E5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", wg = 1, [sf, Eb] = Ab.split("."), vr = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function of(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function k5(e) {
  return vr(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function go(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function kb(e, t = []) {
  const n = await go(`/v2/contracts/call-read/${sf}/${Eb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: sf, arguments: t.map((r) => "0x" + vr(on(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Ur($r(n.result));
}
async function $5() {
  const e = await go(`/v2/contracts/source/${sf}/${Eb}?proof=0`);
  if (typeof e.source != "string" || await k5(e.source) !== x5) throw Error("Deployed source does not match the tested helper.");
  if (v5(await kb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function $b(e) {
  return e.startsWith("SP") && ji(e) && !e.includes(".");
}
async function I5(e) {
  var r;
  if (!$b(e)) throw Error("Invalid mainnet wallet address.");
  const t = await go(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await go(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function L5(e) {
  const t = await go(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function C5(e, t) {
  var o, s;
  const n = await kb("get-owner", [Pa(e), Pa(t)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (o = n.value) == null ? void 0 : o.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !$b(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function T5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: of(e), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const o = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(o, { feeRejected: !0 }), o;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== t.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function B5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function N5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = Hi(of(e.raw)), n = t.auth, r = t.payload, o = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || o.hashMode !== 0 || Ui(Ia(Sl.MainnetSingleSig, o.signer)) !== e.address || o.fee !== BigInt(e.fee) || o.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const s = t.postConditions.values[0];
    if (r.payloadType !== 2 || Ui(r.contractAddress) + "." + r.contractName.content !== Ab || r.functionName.content !== "play" || r.functionArgs.length !== 3 || vr(on(r.functionArgs[0])) !== vr(on(Pa(e.core))) || vr(on(r.functionArgs[1])) !== vr(on(Pa(e.song))) || vr(on(r.functionArgs[2])) !== vr(on(R6(of(e.id)))) || e.amount !== "50" || t.postConditionMode !== ta.Deny || t.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== za.Equal || s.principal.prefix !== 2 || Ui(s.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || Ui(r.contractAddress) + "." + r.contractName.content !== A5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || vr(on(r.functionArgs[0])) !== vr(on(Pa(e.song))) || typeof e.liked != "boolean" || vr(on(r.functionArgs[1])) !== vr(on(j6(e.liked))) || e.amount !== "0" || t.postConditionMode !== ta.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Ur(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const M5 = "xtrata.xyz/radio/listening-wallet", P5 = "Link a temporary listening wallet for pay-per-play; no spending permission", es = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && ji(e), _5 = (e) => ({
  domain: wr({ name: St(M5), version: St("1"), "chain-id": En(1) }),
  message: wr({
    purpose: St(P5),
    main: St(e.main),
    listening: St(e.listening),
    issued: En(e.issued)
  })
}), Ib = 100000n, U5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function O5(e, t) {
  const n = e.filter((o) => !o || typeof o.sender != "string" || o.sender === t || !es(o.sender) || !/^\d+$/.test(o.amount) ? !1 : BigInt(o.amount) >= Ib).sort(U5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((o) => o.sender)).size };
}
const Uc = 50;
function $l(e) {
  const t = e;
  if (!t || typeof t.total != "number" || !Number.isSafeInteger(t.total) || t.total < 0 || !Array.isArray(t.results)) return null;
  const n = [];
  for (const r of t.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const o = Number(r.block_height), s = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(o) || !Number.isSafeInteger(s)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: o, txIndex: s });
  }
  return { total: t.total, transfers: n };
}
async function H5(e, t, n = 4) {
  if (!es(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${Uc}&offset=${i}`, o = $l(await t(r(0)));
    if (!o || o.total > 0 && !o.transfers.length) return { ok: !1 };
    if (o.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, o.total - Uc);
    for (let i = 0; i < n; i++) {
      const a = s === 0 && o.total <= Uc ? o : $l(await t(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = O5(a.transfers, e);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - Uc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const bs = 50, D5 = 6, F5 = 20, mg = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function bg(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], o = [];
  for (const s of n.results) {
    const i = s && typeof s == "object" && s.tx && typeof s.tx == "object" ? s.tx : s;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (o.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== t || i.tx_status !== "success") continue;
    const a = i.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(i.block_height), u = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: i.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: o };
}
async function j5(e, t, n) {
  if (!es(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), o = $l(await t(`/extended/v1/address/${e}/stx_inbound?limit=${bs}&offset=0`));
    if (!o || o.total > D5 * bs) return { ok: !1 };
    for (const i of o.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = bs; i < o.total; i += bs) {
      const a = $l(await t(`/extended/v1/address/${e}/stx_inbound?limit=${bs}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== o.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${bs}&offset=${u}`, a = bg(await t(i(0)), e);
      if (!a || a.total > F5 * bs) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = bs; u < a.total; u += bs) {
        const h = bg(await t(i(u)), e);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const d of h.rows) c.add(d);
        for (const d of h.sent) s.set(d.txId, d);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function R5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const o = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(mg).map((d, w) => {
    const g = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: g, kind: "gift", to: r.payer, at: w } : es(d.sender) && g >= Ib ? { sender: d.sender, left: g, kind: "deposit", to: d.sender, at: w } : { sender: d.sender, left: g, kind: "dust", to: null, at: w };
  }), s = o.reduce((d, w) => d + w.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && es(d.recipient) && d.amount > 0n).sort(mg), a = i.reduce((d, w) => d + w.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (d, w) => {
    let g = w;
    for (const v of d) {
      if (g <= 0n) break;
      const x = v.left < g ? v.left : g;
      v.left -= x, g -= x;
    }
    return g;
  };
  for (const d of i) {
    const w = u(o.filter((g) => g.to === d.recipient), d.amount);
    w > 0n && u(o, w);
  }
  if (u(o, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (o.reduce((d, w) => d + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const d of o) {
    if (d.left <= 0n) continue;
    const w = `${d.kind}:${d.to ?? ""}`, g = h.get(w);
    g ? (g.amount += d.left, g.newest = Math.max(g.newest, d.at)) : h.set(w, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((d, w) => d.newest - w.newest),
    hasTopUp: o.some((d) => d.kind === "deposit")
  };
}
function z5(e, t) {
  const n = e.filter((u) => u.kind === "deposit").sort((u, h) => u.newest - h.newest), r = e.find((u) => u.kind === "gift"), o = e.filter((u) => u.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + o.reduce((u, h) => u + h.amount, 0n), i = [], a = [], c = s > t;
  return n.forEach((u, h) => {
    if (u.amount <= t) {
      a.push(u);
      return;
    }
    const d = h === n.length - 1 && !c;
    i.push({ to: u.to, kind: "deposit", mode: d ? "all" : "amount", send: u.amount - t });
  }), c ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - t }) : (r && a.push(r), a.push(...o)), { steps: i, tooSmall: a };
}
function xg(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const Oc = 1500n, Jc = [100, 250, 500], G5 = (e, t) => BigInt(e) * On(t), Sa = ["prepared", "signed", "unknown", "pending"], K5 = 30 * 6e4, Il = 6e4, Ii = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, V5 = 3e3, Ll = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Gu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function X5(e) {
  let t = null, n = -1 / 0, r, o = null, s = null, i, a = -1 / 0, c = null, u = null, h = !1, d = !1, w = !1, g = null, v = !1, x = "", L = "", B = 0, U, A = null, T, _ = [], Y, ce = -1 / 0;
  const ne = /* @__PURE__ */ new Set();
  let q = null, m = !1, I = 0, N = null, P = null, W = !1, R = null, le = !1, ue = null, Xe = !1, C = !1, F = !1, re = !1, de = !1, Ne = 0, Pe = null, Ht = Promise.resolve();
  const Ge = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Rr.toString()), _e = (b) => !!s && !(s.features ?? []).includes(b), Ue = (b, k) => `xtrata.ppp.v1.${b}:${k}`, _t = "xtrata.ppp.v1.as-main", kn = () => {
    if (e.main()) return;
    const b = e.store.get(_t);
    return b && es(b) ? b : void 0;
  }, ut = () => e.main() ?? kn(), Zt = (b = s == null ? void 0 : s.address) => {
    if (!b) return [];
    try {
      const k = JSON.parse(e.store.get(Ue("entries", b)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, $t = (b) => {
    const k = [b, ...Zt(b.address).filter((V) => !(V.txid === b.txid && V.kind === b.kind))].slice(0, 200);
    e.store.set(Ue("entries", b.address), JSON.stringify(k));
  }, z = (b = s == null ? void 0 : s.address) => !!b && e.store.get(Ue("on", b)) !== "0", H = (b) => {
    s != null && s.address && e.store.set(Ue("on", s.address), b ? "1" : "0");
  }, Q = () => Zt().filter((b) => Sa.includes(b.status)), se = () => Ye() ? [...Q(), ...Zt(Ze()).filter((b) => Sa.includes(b.status))] : Q(), he = () => ft(s == null ? void 0 : s.address), ft = (b) => {
    if (!b) return null;
    try {
      return JSON.parse(e.store.get(Ue("deposit", b)) || "null");
    } catch {
      return null;
    }
  }, Me = (b, k = s == null ? void 0 : s.address) => {
    k && e.store.set(Ue("deposit", k), JSON.stringify(b));
  };
  let He = null;
  const vt = (b = Il) => {
    const k = e.now();
    He = { since: He && k < He.until ? He.since : k, until: Math.max((He == null ? void 0 : He.until) ?? 0, k + b) };
  }, Ke = () => !!He && e.now() < He.until && (i === void 0 || i < an + On(Ge())), $e = () => !!he() || Ke(), Ze = () => _e("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), Ye = () => !!(s != null && s.address) && Ze() !== s.address, Ve = () => Ye() ? c && c.for === Ze() ? c.value : void 0 : i, Dt = () => _e("likeFee") ? w5 : y5, gn = (b) => b !== void 0 && b < an + Dt(), yn = () => Q().filter((b) => e.now() - b.created > K5 && ne.has(b.txid)), Kn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!ut() || r === ut() && !t.allowed), It = () => Kn() && !(s != null && s.linked), dn = () => {
    const b = ut();
    return !It() && !!b && !!(s != null && s.linked) && s.linked !== b;
  }, Ir = (b) => Ue("return-to", b), zr = (b = s == null ? void 0 : s.address) => {
    if (!b) return;
    const k = e.store.get(Ir(b));
    return k && es(k) && k !== b ? k : void 0;
  }, mr = (b = s == null ? void 0 : s.address) => q && q.for === b ? q.res : null;
  function xt() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const b = zr();
    if (b) return { to: b, kind: "chosen" };
    const k = mr();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const wn = (b) => Ue("gift", b);
  function Ft() {
    const b = s == null ? void 0 : s.address;
    if (!b) return null;
    if ((R == null ? void 0 : R.for) === b) return R.info;
    try {
      const k = JSON.parse(e.store.get(wn(b)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  const mn = () => (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : ((s == null ? void 0 : s.slot) ?? 0) === 0 ? s == null ? void 0 : s.address : void 0;
  let kt = null, Kt = null, Gr = !1;
  const ls = (b) => Ue("award-claim", b), E = (b) => Ue("award-send", b), O = (b) => {
    try {
      const k = JSON.parse(e.store.get(E(b)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  }, K = (b) => {
    try {
      const k = JSON.parse(e.store.get(ls(b)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  };
  async function D(b = !1) {
    var Se;
    const k = mn();
    if (!k || !e.awardStatus || Gr) return;
    const V = (kt == null ? void 0 : kt.for) === k ? kt : null, te = V == null ? void 0 : V.view.state, Be = te === "not-a-player" && ((Se = Ft()) == null ? void 0 : Se.drop) === "players", X = V ? Be ? 2e4 : te === "off" || te === "not-a-player" ? 30 * 6e4 : K(k) || O(k) ? 2e4 : te === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(V && !b && e.now() - V.at < X)) {
      Gr = !0;
      try {
        const xe = await e.awardStatus(k);
        if (kt = { for: k, view: xe, at: e.now() }, xe.state === "claimed" && e.store.set(ls(k), ""), xe.state === "claimed" && xe.holds === !1 && e.store.set(E(k), ""), xe.state === "ready" && e.awardName && (Kt == null ? void 0 : Kt.for) !== k)
          try {
            Kt = { for: k, name: await e.awardName(k), at: e.now() };
          } catch {
            Kt = { for: k, name: void 0, at: e.now() };
          }
      } catch {
        kt = { for: k, view: V && V.view.state !== "off" && V.view.state !== "not-a-player" ? { ...V.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        Gr = !1;
      }
    }
  }
  function J() {
    const b = mn();
    if (!b || (kt == null ? void 0 : kt.for) !== b) return null;
    const k = kt.view;
    if (k.state === "off" || k.state === "not-a-player") return null;
    const V = k.state === "claimed" ? null : K(b), te = k.state === "claimed" && k.holds !== !1 ? O(b) : null;
    return { ...k, ...(Kt == null ? void 0 : Kt.for) === b ? { name: Kt.name } : {}, ...V ? { claimTx: V.txid } : {}, ...te ? { sendTx: te.txid } : {} };
  }
  async function ee() {
    var Be;
    const b = s == null ? void 0 : s.address;
    if (!b || !e.giftInfo || !((Be = t == null ? void 0 : t.gifts) != null && Be.enabled) || le) return;
    const k = (R == null ? void 0 : R.for) === b ? R : null, V = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && e.now() - k.at < V) return;
    le = !0;
    const te = Ft();
    try {
      const X = await e.giftInfo(b);
      R = { for: b, info: X, ok: !0, at: e.now() }, e.store.set(wn(b), JSON.stringify(X));
    } catch {
      R = { for: b, info: te, ok: !1, at: e.now() };
    } finally {
      le = !1;
    }
  }
  const Te = () => Zt().reduce((b, k) => Sa.includes(k.status) ? b + BigInt(k.amount || "0") + BigInt(k.fee || "0") : b, 0n);
  function ke() {
    if (i === void 0) return 0;
    const b = i - Te() - BigInt(Qt.length) * On(Ge());
    return b > 0n ? yg(b, Ge()) : 0;
  }
  const Fe = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", ht = "EMPTY — ADD STX TO PLAY";
  function $() {
    if (!(t != null && t.here)) return null;
    const b = (k, V) => ({ reason: k, text: V });
    switch (wt()) {
      case "connect":
      case "wrong-wallet":
        return b("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return b("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return b("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return b("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return b("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return b("locked", "UNLOCK TO LISTEN");
      case "link":
        return b("link", "FINISH SETUP TO LISTEN");
      case "over":
        return b("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return $e() ? b("arriving", "YOUR PLAYS ARE ARRIVING") : b("out", Ye() ? Fe : ht);
      case "ready":
        return !z() || !(s != null && s.session) || s.session.playsLeft < 1 || s.session.expires <= e.now() ? b("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : F ? ke() < 1 ? b("out", Ye() ? Fe : ht) : null : b("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const pe = () => {
    var b;
    return !!(s != null && s.address) && Ye() && !!((b = Ft()) != null && b.player);
  };
  function ze() {
    return pe() ? { locked: !0, known: !0 } : null;
  }
  const dt = 3 * 6e4, Vt = () => !!Ft() && !!e.history && !(s != null && s.linked);
  async function jt() {
    const b = s.address, k = Ft(), { balance: V, nonce: te } = await e.chain.account(b), Be = await e.history(b, !0);
    if (!Be.ok) return null;
    const X = R5({ self: b, balance: V, inbound: Be.inbound, outgoing: Be.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!X.ok) return null;
    const Se = z5(X.parts, xa);
    return { balance: V, nonce: te, parts: X.parts, steps: Se.steps, tooSmall: Se.tooSmall.length };
  }
  const fn = () => Xe ? { state: "unavailable" } : !ue || e.now() - ue.at > dt || i !== void 0 && i !== ue.balance ? { state: "none" } : ue.plan;
  function wt() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const b = ut();
    if (!It()) {
      if (!b) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : dn() ? "wrong-wallet" : s.state === "known" ? "locked" : !It() && s.linked !== b ? "link" : i === void 0 ? "loading" : i > As && !s.backedUp ? "over" : i < an + On(Ge()) ? "fund" : "ready" : "loading";
  }
  const er = () => {
    var b, k, V, te, Be;
    return {
      step: wt(),
      busy: u,
      message: x,
      error: L,
      notice: Kr(),
      gate: t,
      main: ut(),
      mainConnected: !!e.main(),
      standIn: kn(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      award: J(),
      unproven: !!(s != null && s.unproven),
      phrase: !!(s != null && s.hasBackup),
      backedUp: !!(s != null && s.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((X) => X === "over" && (s != null && s.backedUp) ? "ok" : X)(m5(i, Ge())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > As && !!(s != null && s.backedUp),
      playsLeft: i === void 0 ? 0 : yg(i, Ge()),
      allowance: i === void 0 ? As : Ru(i, BigInt(((b = he()) == null ? void 0 : b.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: z(),
      entries: Zt(),
      depositTxid: ((k = he()) == null ? void 0 : k.txid) ?? U,
      depositPending: $e(),
      arrival: $e() ? { since: ((V = he()) == null ? void 0 : V.at) ?? (He == null ? void 0 : He.since) ?? e.now(), graceMs: Il } : null,
      walletOutdated: _e("like"),
      canAnother: !!s && !_e("another"),
      canForget: !!s && !_e("forget"),
      passkeyName: s == null ? void 0 : s.passkeyName,
      hadGift: s != null && s.address && (R == null ? void 0 : R.for) === s.address && R.ok ? !!R.info : null,
      linkedListening: Y && Y === ut() ? _.map((X) => X.listening) : [],
      serverLinked: !!A && T === `${ut()}:${s == null ? void 0 : s.address}`,
      stuck: yn().length,
      armed: re,
      queued: Qt.length,
      solo: It(),
      returnTo: (te = xt()) == null ? void 0 : te.to,
      returnToKind: (Be = xt()) == null ? void 0 : Be.kind,
      funderState: (() => {
        const X = mr();
        return X ? X.ok ? X.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const X = mr();
        return !!X && X.ok && X.distinct > 1;
      })(),
      walletCannotSolo: It() && _e("standalone"),
      walletCannotMulti: _e("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((X) => X !== ut() && X !== (s == null ? void 0 : s.linked)),
      creditedTo: It() && (s != null && s.address) && (N == null ? void 0 : N.for) === s.address && N.main ? N.main : void 0,
      createdHere: !!(s != null && s.address) && e.store.get(Ue("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && i === 0n && (P == null ? void 0 : P.for) === s.address && P.unused,
      gift: (() => {
        const X = Ft();
        return X ? { player: X.player, from: X.from, source: X.source, amount: X.amount, ...X.drop !== void 0 ? { drop: X.drop } : {} } : null;
      })(),
      giftPlays: Ft() ? ke() : 0,
      playCost: On(Ge()),
      giftStop: $(),
      albumLock: ze(),
      returnPlan: fn(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: _e("slots"),
      likeFunds: (() => {
        var xe;
        const X = Ze();
        if (!X || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const Se = Ve();
        return { address: X, balance: Se, low: gn(Se), album: Ye(), pending: !!ft(X), txid: (xe = ft(X)) == null ? void 0 : xe.txid, main: ut() };
      })()
    };
  }, Kr = () => B ? B < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ve = (b, k = "") => {
    x = b, L = k, e.changed();
  };
  async function Jt(b, k) {
    if (!u) {
      u = b, L = "", e.changed();
      try {
        await k();
      } catch (V) {
        const te = V instanceof Error ? V.message : String(V);
        L = /Cancelled in the listening wallet/.test(te) ? "" : te, L || (x = "Not now. Nothing was signed.", de = !0);
      } finally {
        u = null, await Xn(!0);
      }
    }
  }
  const bo = () => !!(t != null && t.enabled) && t.here && (It() || !!ut() && t.allowed), tr = () => bo() && !dn(), xo = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Vn = () => {
    if (dn()) throw new Error(xo());
  };
  async function Nn() {
    if (!bo()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return o ?? (o = await e.bridge(t.walletOrigin)), o;
  }
  const bn = (b) => {
    const k = ut();
    return b.request("listening.status", k ? { main: k } : void 0);
  };
  async function Ts(b = !1) {
    s != null && s.address && (!b && e.now() - a < 3e4 || (i = await e.chain.balance(s.address), a = e.now(), await So(b)));
  }
  async function So(b = !1) {
    const k = Ze();
    if (!(!Ye() || !k || (s == null ? void 0 : s.state) !== "unlocked") && !(!b && (c == null ? void 0 : c.for) === k && e.now() - c.at < 3e4))
      try {
        c = { for: k, value: await e.chain.balance(k), at: e.now() };
      } catch {
      }
  }
  async function yi(b) {
    if ((Y !== b || e.now() - ce >= 6e4) && (_ = await e.links(b), Y = b, ce = e.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === b) return;
    const k = `${b}:${s.address}`;
    T === k && A || (A = _.find((V) => V.listening === s.address) ?? null, T = k);
  }
  async function Mn() {
    const b = s == null ? void 0 : s.address;
    if (!It() || !b || s != null && s.linked || !e.funder || m || !i || i <= 0n) return;
    const k = mr(b);
    if (k != null && k.ok && k.funder) return;
    const V = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, I - 1), 30 * 6e4);
    if (!(q && q.for === b && e.now() - q.at < V)) {
      m = !0;
      try {
        q = { for: b, res: await e.funder(b), at: e.now() };
      } catch {
        q = { for: b, res: { ok: !1 }, at: e.now() };
      } finally {
        m = !1;
      }
      I = q.res.ok ? 0 : I + 1;
    }
  }
  async function nr() {
    const b = s == null ? void 0 : s.address;
    if (!(!It() || !b || s != null && s.linked || !e.mainOf || W) && !(N && N.for === b && (N.ok || e.now() - N.at < 6e4))) {
      W = !0;
      try {
        N = { for: b, main: await e.mainOf(b), ok: !0, at: e.now() };
      } catch {
        N = { for: b, main: null, ok: !1, at: e.now() };
      } finally {
        W = !1;
      }
    }
  }
  async function us() {
    const b = s == null ? void 0 : s.address;
    if (!(!b || (s == null ? void 0 : s.state) !== "unlocked" || i !== 0n || (P == null ? void 0 : P.for) === b) && e.store.get(Ue("created", b)) !== "1")
      try {
        P = { for: b, unused: await e.chain.confirmedNonce(b) === 0n };
      } catch {
      }
  }
  async function Vr() {
    var Be;
    const b = s == null ? void 0 : s.address;
    if (!b) return !1;
    let k, V = !1;
    const te = /* @__PURE__ */ new Map();
    for (const X of se())
      try {
        const Se = await e.chain.transaction(X.txid);
        if (!Se) {
          if (ne.add(X.txid), e.now() - X.created > 15 * 6e4 && !te.has(X.address) && te.set(X.address, await e.chain.confirmedNonce(X.address)), k = te.get(X.address), k !== void 0 && k > BigInt(X.nonce)) {
            $t({ ...X, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((X.status === "unknown" || X.status === "signed") && X.raw)
            try {
              await e.chain.broadcast(X.raw, X.txid), $t({ ...X, status: "pending" });
            } catch (Ie) {
              Ii(Ie) && $t({ ...X, status: "failed", note: Ie.message, raw: void 0 });
            }
          continue;
        }
        ne.delete(X.txid);
        const xe = String(Se.tx_status);
        if (xe === "success" && Se.canonical !== !1 && Se.is_unanchored === !1) {
          if ($t({ ...X, status: "confirmed", confirmedAt: e.now(), actualFee: String(Se.fee_rate ?? X.fee), raw: void 0 }), V = !0, X.kind === "like" && (v = !0, X.status !== "confirmed" && typeof X.liked == "boolean"))
            try {
              (Be = e.likeConfirmed) == null || Be.call(e, X.song, X.liked);
            } catch {
            }
        } else xe.startsWith("abort_") || xe.startsWith("dropped_") ? $t({ ...X, status: "failed", note: xe, raw: void 0 }) : X.status !== "pending" && $t({ ...X, status: "pending" });
      } catch {
      }
    for (const X of Ye() ? [b, Ze()] : [b]) {
      const Se = ft(X);
      if (Se)
        try {
          const xe = await e.chain.transaction(Se.txid), Ie = String((xe == null ? void 0 : xe.tx_status) ?? "");
          (Ie === "success" && xe.is_unanchored === !1 || Ie.startsWith("abort_") || Ie.startsWith("dropped_") || !xe && e.now() - Se.at > 2 * 36e5) && (Me(null, X), Ie === "success" && vt(2e4), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return V;
  }
  async function Xn(b = !1) {
    var k;
    try {
      const V = ut();
      if ((b || !t || r !== V || e.now() - n > 3e5) && (t = await e.config(V), n = e.now(), r = V), !t.enabled || !t.here || !It() && (!V || !t.allowed)) {
        o && (s != null && s.session) && await o.request("listening.stop").catch(() => {
        }), re && Bs(), e.changed();
        return;
      }
      await Nn(), s = await bn(o), dn() && s.state === "unlocked" && (Cr(), await o.request("listening.lock").catch(() => {
      }), i = void 0, s = await bn(o)), V && t.allowed && await yi(V), await Ts(b), await Mn(), await nr(), await us(), await ee(), await D(), await Vr() && await Ts(!0), await So(), await mi(), B = 0;
    } catch {
      B++;
    }
    if (wt() === "locked" ? ds() : re && Bs(), v) {
      v = !1;
      try {
        (k = e.likesChanged) == null || k.call(e);
      } catch {
      }
    }
    e.changed(), Qt.length && !Ps && Yn();
  }
  async function vo(b) {
    const k = s == null ? void 0 : s.root;
    if (!k || s != null && s.slot || !(s != null && s.address) || _e("slots")) return;
    const V = Number(e.store.get(Ue("slot", k)));
    if (!(!Number.isSafeInteger(V) || V < 1))
      try {
        const { balance: te } = await e.chain.account(s.address);
        if (te >= an + On(Ge())) return;
        await b.request("listening.openSlot", { slot: V }), s = await bn(b), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Ao(b, k) {
    var X;
    Vn();
    const V = !(s != null && s.address) || z(s.address), te = s != null && s.linked ? (X = e.nameOf) == null ? void 0 : X.call(e, s.linked) : void 0;
    await b.request("listening.unlock", { mode: "unlock", terms: V ? fs() : void 0, anyPasskey: k, ...ut() ? { main: ut() } : {}, ...te ? { label: te } : {} }), s = await bn(b), V && (z(s.address) ? await un() : await b.request("listening.stop")), await vo(b), ve(V ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Be = g;
    g = null, Be && e.now() - Be.at < 12e4 && setTimeout(() => void Xn(!0).then(() => ct(Be)), 0);
  }
  function ds() {
    re || u || de || Ne >= 3 || !o || !(s != null && s.address) || (re = !0, Ht = (async () => {
      try {
        await Ao(o, !1), Ne = 0;
      } catch (b) {
        const k = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test(k) ? Pe || (de = !0, ve("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (o == null ? void 0 : o.request("listening.cancel").catch(() => {
        })) : (Ne++, L = k);
      } finally {
        re = !1;
        const b = Pe;
        Pe = null, b ? await b() : await Xn(!0);
      }
    })());
  }
  async function Bs(b) {
    re && (Pe = async () => {
    }, await (o == null ? void 0 : o.request("listening.cancel").catch(() => {
    })), await Ht), b && await b(), e.changed();
  }
  const fs = () => ({
    fee: Ge().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: As.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function un() {
    if (!(s != null && s.address)) return !1;
    if (F || (F = await e.tabLock(s.address)), !F)
      throw await (o == null ? void 0 : o.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function hs(b, k) {
    const V = s.address, { balance: te, nonce: Be } = k ?? await e.chain.account(V);
    i = te;
    const X = await o.request("listening.prepareReturn", {
      mode: b.mode,
      balance: te.toString(),
      nonce: Be.toString(),
      fee: xa.toString(),
      ...b.amount !== void 0 ? { amount: b.amount.toString() } : {},
      ...b.linked ? {} : { destination: b.to }
    });
    if (X.recipient !== b.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const Se = b.mode === "amount" ? b.amount : b.mode === "all" ? te - xa : te - As - xa, xe = Hi(X.raw);
    if (Ur(xe.payload.recipient).value !== b.to || String(xe.payload.amount) !== X.amount || Se !== void 0 && X.amount !== Se.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const Ie = {
      id: Gu(),
      address: V,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: X.recipient,
      amount: X.amount,
      fee: X.fee,
      nonce: Be.toString(),
      created: e.now(),
      status: "signed",
      raw: X.raw,
      txid: X.txid
    };
    e.validate(Ie), $t(Ie);
    try {
      await e.chain.broadcast(X.raw, X.txid), $t({ ...Ie, status: "pending" });
    } catch (st) {
      throw $t({ ...Ie, status: "unknown", note: st.message }), st;
    }
    return X;
  }
  const wi = au, Eo = xa;
  async function Ns(b, k, V) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (_e("slots") || _e("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const te = s.slot ?? 0;
    if (b === k || ![b, k].includes(te) || ![b, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Be = s.root ?? s.address, X = b === 0 ? Be : s.address, Se = k === 0 ? Be : s.address, { balance: xe, nonce: Ie } = await e.chain.account(X);
    if (xe < V + Eo + an) throw new Error(b === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const st = await o.request("listening.signMove", { from: b, to: k, amount: V.toString(), fee: Eo.toString(), nonce: Ie.toString(), balance: xe.toString() }), S = Hi(st.raw);
    if (st.from !== X || st.to !== Se || st.amount !== V.toString() || Ur(S.payload.recipient).value !== Se || String(S.payload.amount) !== V.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const M = {
      id: Gu(),
      address: X,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: Se,
      amount: st.amount,
      fee: st.fee,
      nonce: Ie.toString(),
      created: e.now(),
      status: "signed",
      raw: st.raw,
      txid: st.txid
    };
    e.validate(M), $t(M);
    try {
      await e.chain.broadcast(st.raw, st.txid), $t({ ...M, status: "pending" });
    } catch (G) {
      throw $t({ ...M, status: "unknown", note: G.message }), G;
    }
    return Me({ txid: st.txid, amount: st.amount, at: e.now() }, Se), Se === Be && Be !== s.address ? c = null : a = -1 / 0, st;
  }
  let Ms = !1;
  const ps = /* @__PURE__ */ new Map(), gs = (b) => Ue("float", b);
  async function mi() {
    if (Ms || (s == null ? void 0 : s.state) !== "unlocked" || !Ye() || _e("move") || _e("rootLike") || !s.address) return;
    const b = s.address;
    if (e.store.get(gs(b)) === "1") return;
    const k = Ft();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const V = Ve();
    if (V === void 0 || i === void 0) return;
    if (!gn(V)) {
      e.store.set(gs(b), "1");
      return;
    }
    if (ft(Ze()) || Io() || se().length || i < wi * 4n + an + Eo) return;
    const te = ps.get(b);
    if (!(te && (te.n >= 3 || e.now() - te.at < 5 * 6e4))) {
      Ms = !0, ps.set(b, { n: ((te == null ? void 0 : te.n) ?? 0) + 1, at: e.now() });
      try {
        await Ns(s.slot ?? 0, 0, wi), e.store.set(gs(b), "1");
      } catch (Be) {
        console.warn("[radio] likes float not sent yet", Be);
      } finally {
        Ms = !1;
      }
    }
  }
  async function ha(b) {
    if (Q().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (_e("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await jt().catch(() => null);
    if (!k)
      throw ue = null, Xe = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Xe = !1, i = k.balance;
    const V = { balance: k.balance, nonce: k.nonce };
    if (b === "excess") {
      const xe = xg(k.parts) ?? zr();
      if (!xe) throw new Error("Choose where to send the excess first.");
      await hs({ mode: "excess", to: xe, linked: !1 }, V), ue = null, ve("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const te = k.steps;
    if (!te.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ue && ue.balance === k.balance && e.now() - ue.at <= dt && ue.steps.length === te.length && ue.steps.every((xe, Ie) => xe.to === te[Ie].to && xe.mode === te[Ie].mode && xe.send === te[Ie].send))) {
      ue = {
        at: e.now(),
        balance: k.balance,
        steps: te,
        parts: k.parts,
        plan: { state: "ready", steps: te.map((xe) => ({ to: xe.to, kind: xe.kind, send: xe.send.toString() })), kept: k.tooSmall, excess: xg(k.parts) }
      }, ve(te.length > 1 ? `This goes back in ${te.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const X = te[0], Se = X.to ?? zr();
    if (!Se) throw new Error("Choose where to send the rest first.");
    if (X.mode === "amount" && _e("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await hs({ mode: X.mode, to: Se, linked: !1, ...X.mode === "amount" ? { amount: X.send } : {} }, V), ue = null, te.length === 1 ? (H(!1), ve("Returned ✓ Paying is off.")) : ve(`Returned ✓ ${te.length - 1} more ${te.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function br() {
    if (!(s != null && s.unproven)) return;
    const b = await Nn();
    await b.request("listening.prove"), s = await bn(b);
  }
  const rr = {
    forceRefresh: () => Xn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (b) => {
      if (!e.main() && !(b !== null && !es(b))) {
        if (b === kn()) return Xn(!0);
        e.store.set(_t, b ?? ""), L = "", x = "", i = void 0, a = -1 / 0, c = null, await Xn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => Jt("Check the listening wallet…", async () => {
      const b = await Nn();
      if (_e("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((s == null ? void 0 : s.state) !== "unlocked" || (s.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (Q().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      Cr(), await b.request("listening.forget"), i = void 0, s = await bn(b), H(!1), ve("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (b) => Jt("Waiting for your passkey…", async () => {
      const k = await Nn(), V = !!(b != null && b.another) && !e.main() && !_e("another");
      V && (s == null ? void 0 : s.state) === "unlocked" && await k.request("listening.lock"), await k.request("listening.unlock", { mode: "create", terms: fs(), ...e.main() ? { main: e.main() } : {}, ...b != null && b.quick && !e.main() ? { quick: !0 } : {}, ...V ? { another: !0 } : {} }), s = await bn(k), s.address && e.store.set(Ue("created", s.address), "1"), H(!0), ve(It() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await un();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** The intro song has started for someone claiming a new player: its play waits for the plays to land (30 minutes at most). */
    holdFirstPlay: () => {
      $o = e.now() + ko;
    },
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (b) => {
      b ? vt() : He = null, e.changed();
    },
    giftSent: (b, k) => {
      !(s != null && s.address) || he() || (Me({ txid: b, amount: k.toString(), at: e.now() }), a = -1 / 0, R = null, kt && (kt = { ...kt, at: -1 / 0 }), ve("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (b) => {
      if (Vn(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (_e("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Nn()).request("listening.bindSlot", { slot: b, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (b, k, V, te) => {
      Me({ txid: V, amount: te.toString(), at: e.now() }, k), R = null, await rr.openAlbum(b), ve("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (b) => Jt("Opening…", async () => {
      if (Vn(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (_e("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === b) return;
      Cr(), await o.request("listening.openSlot", { slot: b }), s = await bn(o), i = void 0, a = -1 / 0, ue = null, Xe = !1;
      const k = s.root;
      k && b > 0 && e.store.set(Ue("slot", k), String(b)), ve(b === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (b = !1) => {
      const k = () => Jt("Waiting for your passkey…", async () => Ao(await Nn(), b));
      return re ? b ? _e("cancel") ? (ve("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Bs(async () => {
        (wt() === "locked" || wt() === "intro") && await k();
      }) : Ht : k();
    },
    link: () => Jt("Sign in your wallet…", async () => {
      Vn();
      const b = e.main();
      if (!b || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const k = (await e.links(b)).find((V) => V.listening === s.address);
      if (k)
        await o.request("listening.link", { main: b, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const V = { main: b, listening: s.address, issued: e.now() }, te = await e.signWithMain(b, _5(V)), Be = await o.request("listening.link", { main: b, issued: V.issued, mainSignature: te });
        await e.saveLink({ ...V, mainSignature: te, listeningSignature: Be.listeningSignature }), ce = -1 / 0;
      }
      ve("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => s != null && s.unproven ? (await Jt("One more passkey check…", br), !(s != null && s.unproven)) : !0,
    deposit: () => Jt("Approve the deposit in your wallet…", async () => {
      Vn(), await br();
      const b = e.main();
      if (!b || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (he()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Ke()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Ts(!0);
      const k = Ru(i ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      U = await e.deposit(b, s.address, k), U && Me({ txid: U, amount: k.toString(), at: e.now() }), ve("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Jt("Approve the top-up in your wallet…", async () => {
      Vn(), await br();
      const b = e.main(), k = Ze();
      if (!b || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (ft(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const V = await e.chain.balance(k);
      Ye() ? c = { for: k, value: V, at: e.now() } : (i = V, a = e.now());
      const te = Ru(V);
      if (te <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Be = await e.deposit(b, k, te);
      Be && Me({ txid: Be, amount: te.toString(), at: e.now() }, k), ve("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (b) => Jt("Adding plays…", async () => {
      if (Vn(), !Ye()) throw new Error("Open the album you want to add plays to first.");
      if (!Jc.includes(b)) throw new Error("Choose one of the amounts offered.");
      const k = G5(b, Ge());
      if (h || d || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (se().length || he()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Ns(0, s.slot ?? 0, k), ve("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Jt("Confirm in the listening wallet…", async () => {
      if (!tr()) throw new Error("Connect your wallet first.");
      await un(), await o.request("listening.approveSession", fs()), H(!0), ve("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Jt("Clearing…", async () => {
      for (const b of yn())
        await e.chain.transaction(b.txid) || $t({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ve("Cleared ✓");
    }),
    switchOff: () => Jt("Switching off…", async () => {
      Cr(), await (o == null ? void 0 : o.request("listening.stop")), H(!1), ve("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Jt("Showing your backup words in the box…", async () => {
      if (!(s != null && s.hasBackup)) throw new Error("This player was made before backup words existed, so it has none.");
      const b = await Nn();
      await b.request("listening.backup"), s = await bn(b), ve("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (b, k) => {
      if ((s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (_e("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await Nn()).request("listening.signShelf", { action: b, ...k ? { release: k } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      Kt = null, await D(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (b) => Jt("Confirm in the listening wallet…", async () => {
      var Ie, st, S, M;
      const k = mn();
      if ((s == null ? void 0 : s.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (_e("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (K(k)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || w || se().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await un();
      const V = await e.awardNote(k, b), { balance: te, nonce: Be } = await e.chain.account(k);
      if (te < Oc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const Se = await (await Nn()).request("listening.signAward", {
        cls: V.cls,
        number: V.number,
        plays: V.plays,
        record: V.record,
        signature: V.signature,
        fee: Oc.toString(),
        nonce: Be.toString(),
        balance: te.toString()
      }), xe = Hi(Se.raw);
      if (Se.hero !== k || Se.number !== V.number || ((st = (Ie = xe.payload) == null ? void 0 : Ie.functionName) == null ? void 0 : st.content) !== "claim" || ((M = (S = xe.payload) == null ? void 0 : S.contractName) == null ? void 0 : M.content) !== E5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(Se.raw, Se.txid), e.store.set(ls(k), JSON.stringify({ txid: Se.txid, at: e.now() })), a = -1 / 0, kt && (kt = { ...kt, at: -1 / 0 }), ve("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (b) => Jt("Confirm in the listening wallet…", async () => {
      var st, S, M;
      const k = mn(), V = J();
      if ((s == null ? void 0 : s.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if ((V == null ? void 0 : V.state) !== "claimed" || V.inscription === void 0) throw new Error("There is no record to send yet.");
      if (V.holds === !1) throw new Error("This record has already been sent.");
      if (V.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (O(k)) throw new Error("Your record is already on its way.");
      const te = b.trim();
      if (!es(te)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (te === k) throw new Error("That is your player itself. Enter the address to send it to.");
      if (_e("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || w || se().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await un();
      const { balance: Be, nonce: X } = await e.chain.account(k);
      if (Be < Oc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const xe = await (await Nn()).request("listening.signSendRecord", { inscription: V.inscription, recipient: te, fee: Oc.toString(), nonce: X.toString(), balance: Be.toString() }), Ie = Hi(xe.raw);
      if (xe.from !== k || xe.recipient !== te || xe.inscription !== V.inscription || ((S = (st = Ie.payload) == null ? void 0 : st.functionName) == null ? void 0 : S.content) !== "transfer" || Ur((M = Ie.payload.functionArgs) == null ? void 0 : M[2]).value !== te)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(xe.raw, xe.txid), e.store.set(E(k), JSON.stringify({ txid: xe.txid, at: e.now() })), a = -1 / 0, kt && (kt = { ...kt, at: -1 / 0 }), ve("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Jt("Locking…", async () => {
      Cr(), await (o == null ? void 0 : o.request("listening.lock")), i = void 0, ve("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const k = String(b ?? "").trim();
      if (!(s != null && s.address)) return ve("", "Unlock the listening wallet first.");
      if (!es(k)) return ve("", "Enter a standard mainnet address (it starts with SP).");
      if (k === s.address) return ve("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(Ir(s.address), k), ve("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && e.store.set(Ir(s.address), ""), e.changed();
    },
    returnFunds: (b) => Jt("Check the return in the listening wallet…", async () => {
      if (!tr()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (Vt()) return ha(b);
      const k = xt();
      if (!k) throw new Error(It() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && _e("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Q().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await hs({ mode: b, to: k.to, linked: k.kind === "linked" }), b === "all" && H(!1), ve(b === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Qt = [], Lr = 10, ko = 30 * 6e4;
  let Ps = !1, $o = 0;
  const bi = (b) => e.now() < $o && (b === "intro" || b === "locked" || b === "link" || b === "fund" && $e()), Io = () => h || !!u || d || w, Cr = () => {
    Qt.length && (Qt.length = 0, e.changed());
  };
  async function Lo(b) {
    if (!Qt.some((k) => k.id === b.id) && !Zt().some((k) => k.id === b.id) && (Qt.push({ ...b, at: e.now() }), Qt.length > Lr && Qt.shift()), Io() || Q().length) {
      const k = Qt.length;
      x = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await Yn();
  }
  async function Yn() {
    if (!Ps) {
      Ps = !0;
      try {
        for (; Qt.length; ) {
          for (; Qt.length && e.now() - Qt[0].at > ko; ) Qt.shift();
          if (!Qt.length || Io() || await Co(Qt[0]) === "wait") return;
          Qt.shift();
        }
      } finally {
        Ps = !1, e.changed();
      }
    }
  }
  async function Co(b) {
    var k;
    h = !0;
    try {
      await Xn();
      const V = wt();
      if (V === "loading" || bi(V)) return "wait";
      if (V !== "ready" || !z() || !(s != null && s.session) || s.session.playsLeft < 1 || !F) return "done";
      if (Q().length) return "wait";
      C || (await e.chain.verify(), C = !0);
      const te = s.address, { balance: Be, nonce: X } = await e.chain.account(te);
      i = Be, a = e.now();
      const Se = await e.chain.owner(zu, b.song);
      if (Se === te || Se === ut()) return "done";
      const xe = await o.request("listening.signPlay", {
        core: zu,
        song: b.song,
        receipt: b.id,
        fee: Ge().toString(),
        nonce: X.toString(),
        balance: Be.toString()
      }), Ie = {
        id: b.id,
        address: te,
        kind: "play",
        core: zu,
        song: b.song,
        recipient: Se,
        amount: "50",
        fee: Ge().toString(),
        nonce: X.toString(),
        created: e.now(),
        status: "signed",
        raw: xe.raw,
        txid: xe.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(Ie), $t(Ie);
      const st = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await e.chain.broadcast(xe.raw, xe.txid), $t({ ...Ie, status: "pending" }), x = `♪ Paid ${st}`, L = "";
      } catch (S) {
        $t({ ...Ie, status: Ii(S) ? "failed" : "unknown", note: S.message, ...Ii(S) ? { raw: void 0 } : {} }), L = S.message;
      }
      return s = await bn(o), "done";
    } catch (V) {
      const te = V instanceof Error ? V.message : "payment unavailable";
      return (k = Ft()) != null && k.player ? (x = "Payment is taking a moment: " + te, "wait") : (x = "This song played free: " + te, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function xi(b) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(wt()) || _e("like") ? !1 : (ct(b), !0);
  }
  async function ct(b) {
    const k = b.title ? `“${b.title}”` : `song #${b.song}`, V = (me) => {
      var Xt;
      L = me, x = "";
      try {
        (Xt = e.likeFailed) == null || Xt.call(e, b.song);
      } catch {
      }
      e.changed();
    }, te = Ye(), Be = wt(), X = ut(), Se = te && (Be === "fund" || Be === "over") ? "ready" : Be, xe = It() ? Ze() : X;
    if (Se === "locked") {
      g = { ...b, at: e.now() }, ve(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (Se === "wrong-wallet") return V(xo());
    if (Se === "link") return V("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (It() && _e("standalone")) return V("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (Se === "fund") return V("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if (Se === "over") return V("Return the excess first: the listening wallet holds more than 1 STX.");
    if (te) {
      await So(!0);
      const me = Ve();
      if (gn(me))
        return e.changed(), V(Ll);
    }
    if (Se !== "ready" || !xe) return V("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return V("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!F) return V("Pay-per-play is running in another tab. Like from that tab.");
    const Ie = Zt(Ze()).find((me) => me.kind === "like" && me.song === b.song);
    if (Ie && Sa.includes(Ie.status))
      return V(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (d) return V("One like at a time: your last one is still being sent.");
    if ((Ie == null ? void 0 : Ie.status) === "confirmed" && e.now() - (Ie.confirmedAt ?? 0) < V5)
      return V(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let st;
    w = !0;
    try {
      st = e.likeState ? (await e.likeState(xe, b.song)).by : b.likedBy ?? [];
    } catch {
      st = b.likedBy;
    } finally {
      w = !1;
    }
    if (!st) return V(`Could not check ${k} right now. Try the heart again.`);
    const S = Ze(), G = ((Ie == null ? void 0 : Ie.status) === "confirmed" && typeof Ie.liked == "boolean" && e.now() - (Ie.confirmedAt ?? Ie.created) < 5 * 6e4 ? Ie.liked : void 0) ?? st.includes(S);
    if (!G && st.some((me) => me !== S)) return V(It() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${st.includes(X) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await To({ song: b.song, liked: !G, title: b.title, artist: b.artist });
  }
  async function To(b) {
    var te, Be, X;
    if (d) {
      ve("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const k = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, V = e.wait ?? ((Se) => new Promise((xe) => setTimeout(xe, Se)));
    try {
      ve(`${b.liked ? "Liking" : "Unliking"} ${k}…`);
      const Se = e.now() + 12e4;
      for (; h || (Ye() ? Zt(Ze()).some((G) => Sa.includes(G.status)) : Q().length); ) {
        if (e.now() > Se) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await V(5e3), await Xn(!0);
      }
      if (!Ye() && wt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const xe = Ze(), { balance: Ie, nonce: st } = await e.chain.account(xe);
      if (Ye() ? c = { for: xe, value: Ie, at: e.now() } : (i = Ie, a = e.now()), gn(Ie)) throw new Error(Ll);
      const S = await o.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: Dt().toString(),
        nonce: st.toString(),
        balance: Ie.toString()
      }), M = {
        id: Gu(),
        address: xe,
        kind: "like",
        core: 0,
        song: b.song,
        liked: b.liked,
        recipient: "",
        amount: "0",
        fee: Dt().toString(),
        nonce: st.toString(),
        created: e.now(),
        status: "signed",
        raw: S.raw,
        txid: S.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(M), $t(M);
      try {
        await e.chain.broadcast(S.raw, S.txid), $t({ ...M, status: "pending" }), x = `${b.liked ? "♥ Liked" : "Unliked"} ${k}`, L = "";
        try {
          (te = e.likeSent) == null || te.call(e, b.song, b.liked);
        } catch {
        }
      } catch (G) {
        if ($t({ ...M, status: Ii(G) ? "failed" : "unknown", note: G.message, ...Ii(G) ? { raw: void 0 } : {} }), L = G.message, Ii(G)) try {
          (Be = e.likeFailed) == null || Be.call(e, b.song);
        } catch {
        }
      }
      s = await bn(o);
    } catch (Se) {
      L = "Like not sent: " + (Se instanceof Error ? Se.message : "the listening wallet is unavailable");
      try {
        (X = e.likeFailed) == null || X.call(e, b.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), Yn();
    }
  }
  return { snapshot: er, refresh: Xn, onListened: Lo, heart: xi, toggleLike: ct, ...rr };
}
const Lb = ["Connect", "Passkey", "Link & fund", "Listen"], Cb = ["Passkey", "Add 1 STX", "Listen"], af = (e) => e ? Cb : Lb;
function Y5(e) {
  if (e.solo) return q5(e);
  const t = Lb.length, n = (r, o, s = !1) => ({ at: r, blocked: s, caption: r >= t ? o : `Step ${r + 1} of ${t} · ${o}` });
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
      const r = e.entries.filter((o) => o.kind === "play");
      return r.some((o) => o.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((o) => ["signed", "pending", "unknown"].includes(o.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function q5(e) {
  const t = Cb.length, n = (r, o, s = !1) => ({ at: r, blocked: s, caption: r >= t ? o : `Step ${r + 1} of ${t} · ${o}` });
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
      const r = e.entries.filter((o) => o.kind === "play");
      return r.some((o) => o.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((o) => ["signed", "pending", "unknown"].includes(o.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function W5(e, t) {
  return !t || t.at >= af(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const Z5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function J5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !Z5(r.id)));
}
const Q5 = {}, eI = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, tI = (e) => {
  const t = Q5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, nI = (e) => `/hiro/${e}`, rI = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, sI = (e) => {
  const t = tI(e);
  if (t)
    return [rI(t)];
  const n = eI[e];
  return typeof window < "u" ? [`${window.location.origin}${nI(e)}`, ...n.filter((o) => !o.includes("hiro.so"))] : n;
}, oI = {}, Sg = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, iI = "xtrata.log.enabled", aI = "xtrata.log.level", cI = "xtrata.log.tags", lI = "xtrata.log.dedupe", Hc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, uI = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, dI = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, fI = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, hI = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, pI = () => {
  const e = oI ?? {}, t = Hc(iI) ?? e.VITE_LOG_ENABLED, n = Hc(aI) ?? e.VITE_LOG_LEVEL, r = Hc(cI) ?? e.VITE_LOG_TAGS, o = Hc(lI) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: uI(t),
    level: dI(n) ?? "warn",
    tags: hI(r),
    dedupe: fI(o)
  };
}, gI = (e, t, n) => !e.enabled || Sg[n] < Sg[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), yI = (e, t, n, r) => {
  const o = pI();
  if (!gI(o, t, e) || mI(o.dedupe))
    return;
  const s = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(s, r) : i(s);
}, wI = /* @__PURE__ */ new Set();
let vg = null;
const mI = (e, t, n, r, o) => (vg !== e && (wI.clear(), vg = e), !1), bI = (e, t, n) => yI("debug", e, t, n), xI = {}, SI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, vI = (e) => {
  const t = xI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : SI[e];
}, AI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, EI = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return AI.test(n) ? n : null;
}, kI = (e) => e.replace(/\/+$/, ""), $I = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), Ag = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.startsWith("0x") ? e.slice(2) : e;
  if (!t || t.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(t))
    return null;
  let n = "";
  for (let r = 0; r < t.length; r += 2) {
    const o = Number.parseInt(t.slice(r, r + 2), 16);
    if (o < 32 || o > 126)
      return null;
    n += String.fromCharCode(o);
  }
  return n;
}, Li = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, II = (e) => {
  var c, u;
  let t;
  try {
    t = Ur(A6(e));
  } catch {
    return null;
  }
  const n = Li(t);
  if (!n || n.success === !1)
    return null;
  const r = Li(n.value), o = Li(r == null ? void 0 : r.value), s = Li(o == null ? void 0 : o.value);
  if (!s)
    return null;
  const i = Ag((c = Li(s.name)) == null ? void 0 : c.value), a = Ag((u = Li(s.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : EI(`${i}.${a}`);
}, LI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${kI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, o = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [cb(Km(e.address))]
    }),
    signal: e.signal
  });
  if (!o.ok)
    throw new Error(`BNS primary lookup failed (${o.status})`);
  const s = await o.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : II(s.result);
}, CI = async (e) => {
  const t = e.address.trim();
  if (!ji(t))
    return null;
  const n = vI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const o of sI(e.network))
    try {
      return await LI({
        baseUrl: o,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (s) {
      r = s;
    }
  return bI("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: $I(r)
  }), null;
};
function TI(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, o = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => e(a)).then((u) => {
      c.pending = !1, u && (c.name = u, t());
    }).catch(() => {
      c.pending = !1, c.failedAt = o();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = s.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && o() - c.failedAt >= r && i(a, c) : (c = { name: null, pending: !1 }, s.set(a, c), i(a, c)), c.name;
    }
  };
}
const Eg = Object.freeze({
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
}), kg = Object.freeze({ 139: "melophonic" });
function $g(e, t = "") {
  const n = String(e);
  return Object.hasOwn(Eg, n) ? Eg[n] : Object.hasOwn(kg, n) ? kg[n] : t;
}
const Ig = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function Lg(e, t = "") {
  return Object.hasOwn(Ig, String(e)) ? Ig[String(e)] : t;
}
const Tb = 10000n, Ah = 1000000n, Cl = 3000n, BI = (e, t) => `${e}#gift=${t}`, NI = 100, va = (e, t = Rr) => e <= an ? 0 : Number((e - an) / On(t)), Cg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), Eh = "xtrata.xyz/radio/gifts", La = NI, MI = "Create a prefunded Xtrata radio gift batch", PI = (e) => ({
  domain: wr({ name: St(Eh), version: St("1"), "chain-id": En(1) }),
  message: wr({
    purpose: St(MI),
    creator: St(e.creator),
    count: En(e.count),
    amount: En(BigInt(e.amount)),
    label: St(e.label),
    issued: En(e.issued),
    ...e.player ? { player: St(e.player) } : {}
  })
}), Bb = (e, t, n = Rr) => an + BigInt(e) * On(n) + (t ? au : 0n), _I = (e, t = Rr) => Number((Ah - an - (e ? au : 0n)) / On(t)), Nb = (e, t) => BigInt(e) * (t + Cl);
function UI(e, t, n, r = Rr) {
  const o = n ? au : 0n, s = t > an + o ? t - an - o : 0n, i = Number(s / On(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * kl,
    fees: BigInt(i) * r,
    reserve: an,
    float: o,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Cl,
    perCopy: t + Cl,
    total: Nb(e, t)
  };
}
const OI = (e) => e >= Tb && e <= Ah, HI = 90, Tg = [30, 90], DI = "Extend my prefunded Xtrata radio gift batches; no spending permission", FI = (e) => ({
  domain: wr({ name: St(Eh), version: St("1"), "chain-id": En(1) }),
  message: wr({ purpose: St(DI), creator: St(e.creator), batch: St(e.batch), days: En(e.days), issued: En(e.issued) })
}), Bg = 40, jI = "Create an Xtrata radio gift player", cf = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), RI = /^[^\u0000-\u001f\u007f<>]+$/u;
function Ng(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && RI.test(e) : !n;
}
function Mb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!Ng(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Ng(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Bg) throw new Error(`A player holds 1 to ${Bg} songs.`);
  const t = /* @__PURE__ */ new Set();
  for (const o of e.tracks) {
    if (!Number.isSafeInteger(o) || o < 1) throw new Error("Songs are catalogue token numbers.");
    if (t.has(o)) throw new Error("A song appears twice in the list.");
    t.add(o);
  }
  if (e.cover !== null && e.cover !== void 0 && (!Number.isSafeInteger(e.cover) || e.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = e.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const o of n) if (!t.has(o)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((o, s) => o - s);
  return { title: e.title, subtitle: e.subtitle ?? "", tracks: [...e.tracks], cover: e.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const Pb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return $f(Cf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, zI = (e) => ({
  domain: wr({ name: St(Eh), version: St("1"), "chain-id": En(1) }),
  message: wr({
    purpose: St(jI),
    admin: St(e.admin),
    player: St(e.hash),
    issued: En(e.issued)
  })
}), Dr = (e) => e.tracks.filter((t) => !t.hidden), GI = (e) => e.tracks.find((t) => t.hidden) ?? null, Ku = [300, 500, 1e3], Ua = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Dc = (e) => typeof e == "string" && Ua.some((t) => t.id === e), Fo = (e) => Ua.find((t) => t.id === e), KI = (e) => Ua.find((t) => e >= t.min) ?? Ua[Ua.length - 1];
function VI(e, t = Rr) {
  return KI(e <= an ? 0 : Number((e - an) / On(t)));
}
const _b = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], XI = "1000 Players";
function kh(e = La) {
  const t = [];
  for (const n of _b) {
    const r = Bb(n.plays, !1);
    for (let o = n.count; o > 0; o -= e) {
      const s = Math.min(o, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: s, label: `${XI} ${String(i).padStart(2, "0")}`, amount: r, deposit: Nb(s, r) });
    }
  }
  return t;
}
const $h = (e = kh()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: _b.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), YI = 23 * 36e5, Mg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function qI(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < YI ? "unpaid" : "todo";
}
function WI(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: qI(c, n) })).filter((c) => c.state !== "todo").sort((c, u) => Mg(u.state) - Mg(c.state) || u.b.at - c.b.at), o = r[0];
  if (!o) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const s = (a = o.b.view) == null ? void 0 : a.copies, i = o.state === "live" ? `live · all ${e.count} waiting to be claimed` : o.state === "touched" ? `live, but only ${(s == null ? void 0 : s.waiting) ?? 0} of ${e.count} still waiting (${(s == null ? void 0 : s.claimed) ?? 0} claimed)` : o.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: o.state, batch: o.b, extras: r.length - 1, detail: o.b.error ? `${i} (${o.b.error})` : i };
}
function Pg(e, t, n = kh()) {
  var u;
  const r = n.map((h) => WI(h, e, t)), o = [];
  for (const h of r)
    h.extras && o.push(`Batch ${h.step.n} was made more than once. The extra ${h.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${h.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), h.state === "touched" && o.push(`Batch ${h.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const s = r.every((h) => h.state === "live"), i = s ? r.flatMap((h) => h.batch.codes) : [], a = $h(n).players;
  s && new Set(i).size !== a && o.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = s && new Set(i).size === a;
  return { steps: r, next: ((u = r.find((h) => h.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((h) => h.state === "live").length, ready: c, codes: c ? i : [], problems: o };
}
function ZI(e, t = kh()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = $h(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const o = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), s = r.tiers.map((u) => {
    var d;
    const h = (d = n.tiers) == null ? void 0 : d.find((w) => w.plays === u.plays);
    return { ...u, got: (h == null ? void 0 : h.total) ?? 0 };
  }), i = s.map((u) => `${u.got} ${Fo(u.id).name}`).join(", "), a = (n.tiers ?? []).filter((u) => !r.tiers.some((h) => h.plays === u.plays)), c = n.total === r.players && o === 0 && !!n.tiers && s.every((u) => u.got === u.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((u, h) => u + h.total, 0)} of another size` : ""})` : ""}${o ? `, ${o} no longer available` : ""}.` };
}
const _g = 1800, Vu = /* @__PURE__ */ new Map();
async function JI(e) {
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
function QI(e, t, n, r, o) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = e, (() => {
    const a = Vu.get(e), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : t, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      Vu.set(e, { ...a, until: Date.now() + _g });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Vu.delete(e), o();
      }, _g + 50);
    }
  }, s;
}
const fr = (e, t, n, r, o) => QI(e, t, async () => await JI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, o), Bo = "xtrata.radio.gift.incoming.v1", Ug = (e) => "xtrata.radio.gift.mine.v1:" + e, Og = (e) => "xtrata.radio.gift.batches.v1:" + e, ge = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, sn = (e, t, n = "") => {
  const r = ge("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Aa = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Wn = (e) => Pr(e).replace(/\.?0+$/, "");
function eL(e) {
  let t = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), O = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return O !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), Cg(O) ? O : null;
    } catch {
      return null;
    }
  })(), o = (() => {
    try {
      const E = JSON.parse(e.store.get(Bo) || "null");
      return Cg(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? o;
  if (s) {
    t = { code: s }, e.store.set(Bo, JSON.stringify({ code: s, at: e.now() }));
    let E = 0;
    const O = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (K) => {
      const D = await K.json().catch(() => ({}));
      if (K.status === 404) {
        e.store.set(Bo, null), t = { ...t, error: (D == null ? void 0 : D.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!K.ok) throw new Error("busy");
      const J = D;
      t = { ...t, view: J, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(J.status) && e.store.set(Bo, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void O(), n(E++)));
    });
    O();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const E = t == null ? void 0 : t.view;
    return !(E != null && E.player) || !i() ? null : { player: E.player, from: d(E), plays: va(BigInt(E.amount)) };
  }, c = () => {
    const E = t == null ? void 0 : t.view;
    return !E || E.player || !i() ? null : { plays: va(BigInt(E.amount)), from: E.from ? e.who(E.from) : null };
  }, u = () => {
    const E = t == null ? void 0 : t.code;
    if (!E) return [];
    const O = `${location.origin}${location.pathname}#gift=${E}`;
    return [fr("gift-pass-on", "Copy the link to pass on", () => O, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(Bo, null), e.changed();
  }, d = (E) => E.from ? e.who(E.from) : E.label ? `Xtrata Radio · ${E.label}` : "Xtrata Radio";
  let w = {};
  const g = (E) => {
    if (w.box) return w.box;
    const O = ge("div", "", "ppp-gift-check");
    w.box = O;
    const K = () => {
      const D = window.turnstile;
      !D || w.rendered || (w.rendered = !0, D.render(O, { sitekey: E, callback: (J) => {
        w.token = J, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) K();
    else {
      const D = document.createElement("script");
      D.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", D.async = !0, D.onload = K, document.head.append(D);
    }
    return O;
  }, v = (E) => {
    queueMicrotask(() => void E());
  };
  let x;
  async function L(E) {
    var D, J, ee, Te, ke, Fe, ht, $, pe;
    if (!t || t.claiming || !E.listening) return;
    const O = !!((D = t.view) != null && D.player);
    if (O && !E.root) return;
    t.claiming = !0, t.error = void 0, (J = e.claiming) == null || J.call(e, !0), e.changed();
    const K = async (ze) => {
      const dt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...ze })
      });
      return { res: dt, r: await dt.json().catch(() => ({})) };
    };
    try {
      let ze = 0, dt = E.listening, Vt;
      if (O) {
        const wt = Number((ee = await e.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : ee.next);
        if (!Number.isSafeInteger(wt) || wt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        ze = wt;
        for (let er = 0; ; er++) {
          const Kr = await e.album.bind(ze);
          if (dt = Kr.address, Vt = await K({ wallet: dt, binding: Kr }), Vt.res.status === 409 && /just taken/.test(((Te = Vt.r) == null ? void 0 : Te.error) || "") && er < 5) {
            ze += 1;
            continue;
          }
          break;
        }
      } else Vt = await K({ wallet: dt });
      const { res: jt, r: fn } = Vt;
      if (jt.status === 503 && /sending another gift/.test((fn == null ? void 0 : fn.error) || "")) {
        t.waiting = !0, (ke = e.claiming) == null || ke.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!jt.ok) {
        const wt = String((fn == null ? void 0 : fn.error) || "");
        if (jt.status === 404 || jt.status === 410 || jt.status === 409 && /already had a gift|brand-new|already have this album/.test(wt))
          throw e.store.set(Bo, null), new Error(wt || "This gift cannot be opened.");
        if (jt.status === 429 || jt.status === 403 || jt.status === 400 && !/wallet number/i.test(wt)) throw new Error(wt || `Could not open the gift (${jt.status}).`);
        const Kr = /topping up/.test(wt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(wt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(wt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Kr), { retry: !0, slow: /topping up|not paid for yet/.test(wt) });
      }
      t.done = !0, e.store.set(Bo, null), O ? await e.album.arrived(ze, dt, fn.txid, BigInt(fn.amount)) : e.giftSent(fn.txid, BigInt(fn.amount));
    } catch (ze) {
      const dt = ze, Vt = dt.name === "TypeError" || dt.name === "AbortError" || dt.name === "TimeoutError" || /wallet number/i.test(dt.message);
      if (dt.retry || Vt) {
        const jt = t.tries ?? 0;
        t.tries = jt + 1, t.retry = { text: dt.retry ? dt.message : "Still sending your gift… the network is slow, trying again." }, (Fe = e.claiming) == null || Fe.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, dt.slow ? 6e4 : n(jt));
      } else
        t.error = dt.message, (ht = e.claiming) == null || ht.call(e, !1);
      w.token = void 0;
      try {
        (pe = ($ = window.turnstile) == null ? void 0 : $.reset) == null || pe.call($, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let B = null;
  function U(E) {
    if (!E.listening || !E.depositPending || E.step !== "fund")
      return B = null, [];
    if (!B || B.wallet !== E.listening || e.now() - B.at > 3e4) {
      const K = E.listening;
      B = { ...(B == null ? void 0 : B.wallet) === K ? B : {}, wallet: K, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(K)).then((D) => {
        var J, ee;
        (B == null ? void 0 : B.wallet) === K && (B.state = (J = D == null ? void 0 : D.gift) == null ? void 0 : J.state, B.problem = ((ee = D == null ? void 0 : D.gift) == null ? void 0 : ee.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(B.state === "sending" && B.problem)) return [];
    const O = ge("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return O.title = `Network reply: ${B.problem}`, [O];
  }
  function A(E, O, K = !1) {
    var Fe, ht;
    const D = O.player, J = BigInt(O.amount), ee = K ? [] : [ge("p", `🎁 ${d(O)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${Dr(D).length} ${Dr(D).length === 1 ? "song" : "songs"} and ${va(J).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step))) {
      if (K) return ee;
      if (ee.push(ge("p", E.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : E.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), E.step === "intro") {
        const $ = document.createElement("details");
        $.className = "ppp-how";
        const pe = document.createElement("summary");
        pe.textContent = "How does this work?", $.append(pe, ge("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), ee.push($);
      }
      return ee;
    }
    if (E.walletCannotAlbums)
      return ee.push(ge("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), ee;
    const ke = (ht = (Fe = E.gate) == null ? void 0 : Fe.gifts) == null ? void 0 : ht.turnstileSiteKey;
    return ke && !w.token ? ee.push(ge("p", "One quick check and it is yours:", "ppp-mute"), g(ke)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(E)), ee.push(...T(E, "Sending your album…")), ee;
  }
  function T(E, O) {
    const K = [];
    return t.claiming || t.waiting ? K.push(ge("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : O, "ppp-cyan")) : t.retry && K.push(ge("p", t.retry.text, "ppp-warn"), sn("Try now", () => {
      clearTimeout(x), t.retry = void 0, L(E);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? K.push(ge("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), sn("Forget this gift link here", h, "quiet")) : t.error && K.push(ge("p", t.error, "ppp-bad"), sn("Try again", () => {
      t.error = void 0, L(E);
    })), K;
  }
  const _ = (E) => {
    var O;
    return !!t && !t.done && !t.error && i() && !!E.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !E.linked && !E.creditedTo && (E.createdHere || E.brandNew || !!((O = t.view) != null && O.player)) && (E.balance ?? 0n) === 0n && !E.entries.length);
  };
  function Y(E, O = {}) {
    var dt, Vt, jt, fn;
    const K = U(E);
    if (!t || ["off", "elsewhere"].includes(E.step)) return K;
    const D = t.view;
    if (t.error && !D) return [ge("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!D) return [ge("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return K;
    if (D.status === "claimed" || D.status === "claiming") return [ge("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [ge("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [ge("p", `🎁 ${d(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (D.player) return [...A(E, D, !!O.bare), ...K];
    const J = !!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0), ee = J ? ((dt = e.claimNew) == null ? void 0 : dt.call(e, E)) ?? null : null, Te = ee ? ((Vt = e.replaceOld) == null ? void 0 : Vt.call(e, E)) ?? null : null;
    if (ee && Te)
      return [
        ge("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        sn("Replace my old player", Te, "primary"),
        sn("Keep both players", ee, "quiet"),
        sn("Not now", h, "quiet")
      ];
    if (ee)
      return [
        ge("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        sn("Claim it as a new player", ee, "primary"),
        sn("Not now", h, "quiet")
      ];
    if (J)
      return [ge("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), sn("Forget this gift link here", h, "quiet")];
    const ke = BigInt(D.amount), Fe = va(ke).toLocaleString(), ht = ge(
      "p",
      `🎁 ${d(D)} sent you ${Wn(ke)} STX of on-chain music: about ${Fe} paid plays.`,
      "ppp-gift"
    ), $ = O.bare ? [] : [ht], pe = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, ze = (fn = (jt = E.gate) == null ? void 0 : jt.gifts) == null ? void 0 : fn.turnstileSiteKey;
    return pe ? (ze && !w.token ? $.push(ge("p", "One quick check and it is yours:", "ppp-mute"), g(ze)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(E)), $.push(...T(E, "Sending your gift…"))) : E.step === "intro" ? O.bare || $.push(ge("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : E.listening && E.linked ? $.push(ge("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), sn("Forget this gift link here", h, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && $.push(ge("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), sn("Forget this gift link here", h, "quiet")), $;
  }
  async function ce(E, O, K) {
    var D;
    try {
      const J = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(E));
      if ((D = J == null ? void 0 : J.gift) != null && D.returnTo) return { ok: !0, funder: J.gift.returnTo, txId: J.gift.txid ?? void 0, amount: J.gift.amount, distinct: 1 };
    } catch {
      if (K) return { ok: !1 };
    }
    return O();
  }
  const ne = ge("div", "", "ppp-gift-fold");
  let q = 250000n, m = "", I = "";
  const N = (E) => {
    try {
      const O = JSON.parse(e.store.get(Ug(E)) || "[]");
      return Array.isArray(O) ? O : [];
    } catch {
      return [];
    }
  }, P = (E, O) => e.store.set(Ug(E), JSON.stringify(O.slice(0, 50)));
  async function W(E) {
    const O = N(E);
    for (const K of O)
      if (!(K.view && ["claimed", "refunded", "expired"].includes(K.view.status)))
        try {
          K.view = !K.view || K.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: K.id, ...K.txid ? { txid: K.txid } : {} }) }) : await e.json("/radio/gift?id=" + K.id), K.error = void 0;
        } catch (D) {
          K.error = D.message;
        }
    P(E, O), e.changed();
  }
  async function R(E) {
    if (m) return;
    m = "Starting your gift…", I = "", e.changed();
    let O = null;
    try {
      O = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: q.toString() }) });
      const K = N(E);
      K.unshift({ id: O.id, code: O.code, amount: q.toString(), at: e.now() }), P(E, K), m = "Approve the gift in your wallet…", e.changed();
      const D = await e.pay(E, O.depositTo, BigInt(O.deposit), O.memo), J = N(E), ee = J.find((Te) => Te.id === O.id);
      ee && (ee.txid = D, ee.view = { status: "pending-deposit", amount: q.toString(), source: "friend", from: E, label: "", expires: 0 }), P(E, J), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", W(E);
    } catch (K) {
      I = K.message || "Not sent.";
    } finally {
      m = "", e.changed();
    }
  }
  const le = (E) => "xtrata.radio.gift.players.v1:" + E, ue = (E) => {
    try {
      const O = JSON.parse(e.store.get(le(E)) || "[]");
      return Array.isArray(O) ? O.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id)) : [];
    } catch {
      return [];
    }
  };
  async function Xe(E, O) {
    var K;
    if (!m) {
      m = "Checking the player…", I = "", e.changed();
      try {
        const D = O.tracks.split(/[\s,]+/).filter(Boolean).map(($) => Number($.replace(/^#/, ""))), J = (O.explicit ?? "").split(/[\s,]+/).map(($) => $.replace(/^#/, "")).filter(Boolean).map(Number), ee = Mb({ title: O.title.trim(), subtitle: O.subtitle.trim(), tracks: D, cover: (K = O.cover) != null && K.trim() ? Number(O.cover.trim().replace(/^#/, "")) : null, ...J.length ? { explicit: J } : {} });
        m = "Sign in your wallet…", e.changed();
        const Te = { admin: E, hash: Pb(ee), issued: e.now() }, ke = await e.sign(E, zI(Te));
        m = "Making the player…", e.changed();
        const Fe = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ee, request: Te, signature: ke }) }), ht = ue(E).filter(($) => $.id !== Fe.id);
        ht.unshift({ id: Fe.id, title: Fe.title, tracks: Fe.tracks }), e.store.set(le(E), JSON.stringify(ht.slice(0, 30))), I = `${Fe.existing ? "That player already exists" : "Player made"} ✓ “${Fe.title}” · ${Fe.tracks} songs. Pick it below for a batch.`;
      } catch (D) {
        I = D.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const C = (E, O) => BI(E || location.origin + "/radio.html", O), F = (E) => {
    try {
      const O = JSON.parse(e.store.get(Og(E)) || "[]");
      return Array.isArray(O) ? O.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id) && Array.isArray(K.codes)) : [];
    } catch {
      return [];
    }
  }, re = (E, O) => e.store.set(Og(E), JSON.stringify([...O.filter((K) => K.codes.length), ...O.filter((K) => !K.codes.length)].slice(0, 80))), de = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, Ne = (E, O) => e.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(O) });
  let Pe = 0;
  async function Ht(E) {
    const O = F(E);
    for (const D of O)
      if (!de(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await Ne("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await e.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (J) {
          D.error = J.message;
        }
    try {
      const D = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const J of (D == null ? void 0 : D.batches) ?? []) {
        const ee = O.find((Te) => Te.id === J.id);
        if (ee) {
          ee.error || (ee.view = J);
          continue;
        }
        O.push({ id: J.id, codes: [], count: J.count, amount: J.amount, label: J.label, player: J.player, depositTo: "", deposit: J.deposit, memo: J.memo, at: 0, view: J });
      }
    } catch {
    }
    const K = /* @__PURE__ */ new Map();
    for (const D of F(E)) (!K.has(D.id) || D.codes.length > K.get(D.id).codes.length) && K.set(D.id, D);
    for (const D of O) {
      const J = K.get(D.id);
      J ? K.set(D.id, { ...J, view: D.view ?? J.view, error: D.error, txid: J.txid ?? D.txid, codes: J.codes.length >= D.codes.length ? J.codes : D.codes, depositTo: J.depositTo || D.depositTo }) : K.set(D.id, D);
    }
    re(E, [...K.values()]), e.changed();
  }
  async function Ge(E, O) {
    const K = F(E).find((D) => D.id === O);
    if (!(!K || !K.depositTo || m)) {
      m = "Approve the payment in your wallet…", I = "", e.changed();
      try {
        const D = await e.pay(E, K.depositTo, BigInt(K.deposit), K.memo), J = F(E), ee = J.find((Te) => Te.id === O);
        ee && (ee.txid = D), re(E, J), I = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", Ht(E);
      } catch (D) {
        I = `${/cancel/i.test(D.message) ? "Payment cancelled." : D.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        m = "", e.changed();
      }
    }
  }
  async function _e(E, O, K, D) {
    if (m) return;
    if (!O.ok) {
      I = O.reason, e.changed();
      return;
    }
    m = "Sign in your wallet…", I = "", e.changed();
    let J = null;
    try {
      const ee = { creator: E, count: O.count, amount: O.amount.toString(), label: K, issued: e.now(), ...D ? { player: D } : {} }, Te = await e.sign(E, PI(ee));
      m = "Making your links…", e.changed(), J = await Ne("/radio/gift/batch", { request: ee, signature: Te });
      const ke = F(E);
      ke.unshift({ id: J.id, codes: J.codes, count: O.count, amount: J.amount, label: K, player: D ?? null, depositTo: J.depositTo, deposit: J.deposit, memo: J.memo, at: e.now() }), re(E, ke);
    } catch (ee) {
      I = ee.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await Ge(E, J.id);
  }
  async function Ue(E, O, K) {
    if (!m) {
      m = "Sign in your wallet (nothing is spent)…", I = "", e.changed();
      try {
        const D = { creator: E, batch: O, days: K, issued: e.now() }, J = await e.sign(E, FI(D));
        m = "Extending…", e.changed();
        const ee = await Ne("/radio/gift/batch/extend", { request: D, signature: J }), Te = F(E);
        for (const ke of (ee == null ? void 0 : ee.batches) ?? []) {
          const Fe = Te.find((ht) => ht.id === ke.id);
          Fe && (Fe.view = ke, Fe.error = void 0);
        }
        re(E, Te), I = ee != null && ee.extended ? `Extended ✓ ${ee.extended === 1 ? "That batch has" : `${ee.extended} batches have`} ${K} more days.` : "There was nothing live to extend.";
      } catch (D) {
        I = /cancel/i.test(D.message || "") ? "Cancelled. Nothing changed." : D.message || "Not extended.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const _t = (E) => Math.max(0, Math.ceil((E - e.now()) / 864e5));
  function kn(E, O) {
    const K = O.filter((ee) => {
      var Te;
      return ((Te = ee.view) == null ? void 0 : Te.status) === "live" && ee.view.copies.waiting > 0;
    });
    if (!K.length) return null;
    const D = Math.min(...K.map((ee) => ee.view.expires)), J = ge("p", "", "ppp-batch-extend");
    J.append(ge("span", `${K.length} live ${K.length === 1 ? "batch" : "batches"} · the first runs out in ${_t(D)} days. Extend ${K.length === 1 ? "it" : "them all"}: `));
    for (const ee of Tg) {
      const Te = sn(`+${ee} days`, () => void Ue(E, "all", ee), "tiny");
      Te.disabled = !!m, J.append(Te);
    }
    return J;
  }
  const ut = () => Zt(!!Ye.value, Ve.value, Dt.value);
  function Zt(E, O, K) {
    const D = O === "max" ? _I(E) : Number(O), J = Bb(D, E), ee = Number(K);
    return !Number.isInteger(ee) || ee < 1 || ee > La ? { ok: !1, reason: `Make 1 to ${La} copies at a time.`, album: E, plays: D, amount: J, count: ee } : OI(J) ? { ok: !0, reason: "", album: E, plays: D, amount: J, count: ee, bill: UI(ee, J, E) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: E, plays: D, amount: J, count: ee };
  }
  const $t = () => {
    var E;
    return ((E = e.batchDays) == null ? void 0 : E.call(e)) ?? HI;
  }, z = (E = ut()) => {
    if (!E.ok) return E.reason;
    const O = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${Wn(O.holders)} to song holders, ${Wn(O.fees)} network fees)${E.album ? `, ${Wn(O.float)} for the album’s likes` : ""}, ${Wn(O.reserve)} kept so a listener can return what is left, + ${Wn(O.sendFee)} to send it = ${Wn(O.perCopy)} STX. ${E.count} copies = ${Wn(O.total)} STX, paid now in one payment. Copies nobody claims within ${$t()} days come back to you, and you can extend that at any time.`;
  }, H = (E, O) => O.codes.map((K) => C(E, K)), Q = ge("input");
  Q.type = "range", Q.min = String(Tb), Q.max = String(Ah), Q.step = "10000", Q.value = String(q), Q.setAttribute("aria-label", "Gift amount");
  const se = ge("p", "", "ppp-gift-amount"), he = sn("", () => {
    const E = e.main();
    E && R(E);
  }, "primary"), ft = () => {
    se.textContent = Me(), he.textContent = `Gift ${Wn(q)} STX`;
  };
  Q.oninput = () => {
    q = BigInt(Q.value), ft();
  };
  const Me = () => `${Wn(q)} STX · about ${va(q).toLocaleString()} paid plays · you pay ${Wn(q + Cl)} STX with the network fee`;
  ft();
  const He = ge("input");
  He.maxLength = 60, He.placeholder = "Title, e.g. Proof of Sound", He.setAttribute("aria-label", "Player title");
  const vt = ge("input");
  vt.maxLength = 80, vt.placeholder = "Artist (optional)", vt.setAttribute("aria-label", "Player subtitle");
  const Ke = ge("textarea");
  Ke.rows = 3, Ke.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ke.setAttribute("aria-label", "Songs");
  const $e = ge("input");
  $e.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", $e.setAttribute("aria-label", "Explicit songs");
  const Ze = ge("input");
  Ze.inputMode = "numeric", Ze.placeholder = "Cover inscription number (optional), shown when the album loads", Ze.setAttribute("aria-label", "Cover inscription");
  const Ye = ge("select");
  Ye.setAttribute("aria-label", "Batch album");
  const Ve = ge("select");
  Ve.setAttribute("aria-label", "Plays per copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Ku])].sort((O, K) => O - K)) Ve.append(Aa(`${E.toLocaleString()} plays`, String(E)));
  Ve.append(Aa("Max (1 STX)", "max")), Ve.value = String(Ku[0]);
  const Dt = ge("input");
  Dt.type = "number", Dt.min = "1", Dt.max = String(La), Dt.value = "10", Dt.setAttribute("aria-label", "Copies");
  const gn = ge("input");
  gn.maxLength = 40, gn.placeholder = "Label, e.g. Opera launch", gn.setAttribute("aria-label", "Batch label");
  const yn = ge("p", "", "ppp-mute"), Kn = () => {
    yn.textContent = z();
  };
  for (const E of [Ye, Ve, Dt])
    E.oninput = Kn, E.onchange = Kn;
  Kn();
  let It = null, dn = 0;
  async function Ir() {
    dn = e.now();
    try {
      It = ZI(await e.json("/radio/giveaway/players"));
    } catch {
      It = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const zr = (E, O) => {
    var D;
    if (((D = Pg(F(E), e.now()).next) == null ? void 0 : D.n) !== O.n) {
      I = "That batch is already made. Check again.", e.changed();
      return;
    }
    _e(E, Zt(!1, String(O.plays), String(O.count)), O.label);
  };
  function mr(E) {
    var Te;
    const O = Pg(F(E), e.now()), K = $h(), D = ge("div", "", "ppp-drop");
    D.append(
      ge("p", `The ${K.players.toLocaleString("en-GB")} players (admin) · ${O.done} of ${K.batches} batches live`, "ppp-cyan"),
      ge("p", `${K.tiers.map((ke) => `${ke.count} ${Fo(ke.id).name}`).join(", ")}. ${K.batches} batches, ${Wn(K.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const J = ge("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const ke of O.steps) {
      const Fe = ge("li"), ht = ke.state === "live" ? "✓" : ke.state === "touched" ? "!" : ke.state === "todo" ? "○" : "…";
      if (Fe.append(ge("span", `${ht} ${ke.step.n}. ${Fo(ke.step.tier).name} · ${ke.step.count} × ${ke.step.plays.toLocaleString("en-GB")} plays · ${Wn(ke.step.deposit)} STX`, "t"), ge("span", ke.detail, ke.state === "live" ? "ppp-ok" : ke.state === "touched" ? "ppp-warn" : "ppp-mute")), ke.state === "todo" && ((Te = O.next) == null ? void 0 : Te.n) === ke.step.n) {
        const $ = sn("Sign and pay", () => zr(E, ke.step), "tiny");
        $.disabled = !!m, Fe.append($);
      }
      if (ke.state === "unpaid" && ke.batch) {
        const $ = sn("Pay now", () => void Ge(E, ke.batch.id), "tiny");
        $.disabled = !!m, Fe.append($);
      }
      J.append(Fe);
    }
    D.append(J);
    for (const ke of O.problems) D.append(ge("p", ke, "ppp-warn"));
    O.ready ? D.append(
      ge("p", `All ${K.batches} batches are live: ${O.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      fr("drop-copy", `Copy the ${O.codes.length.toLocaleString("en-GB")} links`, () => O.codes.join(`
`), "tiny", e.changed)
    ) : D.append(ge("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - dn > 6e4 && Ir(), It && D.append(ge("p", It.text, It.ok ? "ppp-ok" : "ppp-mute"));
    const ee = sn("Check again", () => {
      Pe = e.now(), Ht(E), Ir();
    }, "tiny");
    return ee.disabled = !!m, D.append(ee), D;
  }
  function xt(E, O, K) {
    const D = O.view, J = D == null ? void 0 : D.copies, ee = O.error ? O.error : !D || D.status === "pending-deposit" ? O.txid ? "payment confirming…" : "waiting for your payment" : `${J.claimed} of ${D.count} claimed${J.refunding + J.refunded ? ` · ${J.refunded} refunded${J.refunding ? `, ${J.refunding} on their way` : ""}` : ""}`, Te = ge("li");
    if (Te.append(ge("span", `${O.label || "Batch"} · ${O.count} × ${Wn(BigInt(O.amount))} STX`, "t"), ge("span", ee, "ppp-mute")), !O.txid && O.depositTo && (!D || D.status === "pending-deposit") && Te.append(sn("Pay now", () => void Ge(E, O.id), "tiny")), (D == null ? void 0 : D.status) === "live" && J.waiting > 0) {
      Te.append(ge("span", `${_t(D.expires)} days left`, "ppp-mute"));
      for (const ke of Tg) {
        const Fe = sn(`+${ke}`, () => void Ue(E, O.id, ke), "tiny");
        Fe.title = `Extend this batch by ${ke} days (a signature, no payment)`, Fe.setAttribute("aria-label", `Extend ${O.label || "this batch"} by ${ke} days`), Fe.disabled = !!m, Te.append(Fe);
      }
    }
    if (O.codes.length && (D == null ? void 0 : D.status) === "live") {
      const ke = H(K, O);
      Te.append(
        fr("batch-copy:" + O.id, "Copy all links", () => ke.join(`
`), "tiny", e.changed),
        fr("batch-csv:" + O.id, "Copy as CSV", () => ["copy,link", ...ke.map((Fe, ht) => `${ht + 1},${Fe}`)].join(`
`), "tiny", e.changed)
      );
    } else O.codes.length || Te.append(ge("span", "links were made on another device", "ppp-mute"));
    return Te;
  }
  const wn = ge("select");
  wn.setAttribute("aria-label", "Plays in each copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Ku])].sort((O, K) => O - K)) wn.append(Aa(`${E.toLocaleString()} plays`, String(E)));
  wn.value = "50";
  const Ft = ge("input");
  Ft.type = "number", Ft.min = "1", Ft.max = String(La), Ft.value = "10", Ft.setAttribute("aria-label", "How many copies");
  const mn = ge("input");
  mn.maxLength = 40, mn.placeholder = "A note recipients see, e.g. Launch week (optional)", mn.setAttribute("aria-label", "Note for recipients");
  const kt = ge("p", "", "ppp-mute");
  function Kt(E, O, K) {
    const D = () => Zt(!0, wn.value, Ft.value), J = () => {
      kt.textContent = z(D());
    };
    for (const pe of [wn, Ft])
      pe.oninput = J, pe.onchange = J;
    J();
    const ee = () => (mn.value.trim() || O.title).replace(/[^ -~]/g, "").slice(0, 40), Te = sn("Sign, pay and make links", () => {
      _e(E, D(), ee(), O.id);
    }, "primary");
    Te.disabled = !!m;
    const ke = (pe, ze) => {
      const dt = ge("label", pe);
      return dt.append(ze), dt;
    }, Fe = [
      ge("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      ke("Plays in each ", wn),
      ke("Copies ", Ft),
      mn,
      kt,
      Te
    ];
    e.now() - Pe > 3e4 && (Pe = e.now(), Ht(E));
    const ht = F(E).filter((pe) => pe.player === O.id);
    if (ht.length) {
      const pe = ge("ul", "", "ppp-gift-list");
      for (const ze of ht.slice(0, 10)) pe.append(xt(E, ze, K));
      Fe.push(pe);
    }
    const $ = kn(E, F(E));
    return $ && Fe.push($), m && Fe.push(ge("p", m, "ppp-cyan")), I && Fe.push(ge("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), Fe;
  }
  function Gr(E) {
    var J, ee;
    const O = (J = E.gate) == null ? void 0 : J.gifts;
    if (!(O != null && O.enabled) || !O.admin || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const K = e.main(), D = [ge("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!K)
      D.push(ge("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (O.admin) {
      const Te = ge("div", "", "ppp-gift-admin"), ke = (ze, dt) => {
        const Vt = ge("label", ze);
        return Vt.append(dt), Vt;
      }, Fe = ue(K);
      Te.append(
        ge("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        He,
        vt,
        Ke,
        Ze,
        $e,
        sn("Sign and make player", () => void Xe(K, { title: He.value, subtitle: vt.value, tracks: Ke.value, cover: Ze.value, explicit: $e.value }))
      );
      const ht = sn("Sign, pay and make links", () => {
        _e(K, ut(), gn.value.trim(), Ye.value || void 0);
      });
      ht.disabled = !!m;
      const $ = Ye.value;
      Ye.replaceChildren(Aa("No album (starter copies)", ""), ...Fe.map((ze) => Aa(`${ze.title} · ${ze.tracks} songs`, ze.id))), Fe.some((ze) => ze.id === $) && (Ye.value = $), Kn(), Te.append(
        ge("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${$t()} days unless you extend`, "ppp-cyan"),
        ke("Album ", Ye),
        ke("Plays each ", Ve),
        ke("Copies ", Dt),
        gn,
        yn,
        ht
      ), e.now() - Pe > 3e4 && (Pe = e.now(), Ht(K));
      const pe = F(K);
      if (pe.length) {
        const ze = ge("ul", "", "ppp-gift-list");
        for (const Vt of pe.slice(0, 20)) ze.append(xt(K, Vt, ((ee = E.gate) == null ? void 0 : ee.radioUrl) ?? null));
        Te.append(ze);
        const dt = kn(K, pe);
        dt && Te.append(dt);
      }
      Te.append(mr(K)), D.push(Te);
    }
    return m && D.push(ge("p", m, "ppp-cyan")), I && D.push(ge("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), ne.replaceChildren(...D), ne;
  }
  return { banner: Y, funder: ce, renderFold: Gr, copies: Kt, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: _ };
}
const tL = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function nL(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, o = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    o && t.push({
      slot: n.slot,
      address: n.address,
      state: n.state === "arrived" ? "arrived" : "sending",
      amount: String(n.amount ?? "0"),
      label: typeof n.label == "string" ? n.label : "",
      from: typeof n.from == "string" ? n.from : null,
      source: String(n.source ?? ""),
      player: o
    });
  }
  return t;
}
const rL = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((o) => !o.hidden).flatMap((o) => [o.title, o.artist])].filter(Boolean).join(" ").toLowerCase();
};
function sL(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((s) => (!t.pinnedOnly || t.pins.has(s.slot)) && (() => {
    const i = rL(s);
    return n.every((a) => i.includes(a));
  })()), o = {
    recent: (s, i) => (t.recents[i.slot] ?? 0) - (t.recents[s.slot] ?? 0) || i.slot - s.slot,
    newest: (s, i) => i.slot - s.slot,
    oldest: (s, i) => s.slot - i.slot,
    title: (s, i) => {
      var a, c;
      return (((a = s.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = i.player) == null ? void 0 : c.title) ?? "") || s.slot - i.slot;
    }
  };
  return r.sort((s, i) => Number(t.pins.has(i.slot)) - Number(t.pins.has(s.slot)) || o[t.sort](s, i));
}
function oL(e, t = 100) {
  const n = Object.entries(e).sort((r, o) => o[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, o]) => [Number(r), o]));
}
const lf = /* @__PURE__ */ new Set(), Ih = (e) => (lf.add(e), () => {
  lf.delete(e);
}), Tl = () => {
  for (const e of [...lf])
    try {
      e();
    } catch {
    }
}, Hg = "xtrata:al-thumb:v1:", Lh = "-", Ea = 96, iL = 24 * 1024 * 1024, An = /* @__PURE__ */ new Map(), Dg = /* @__PURE__ */ new Set(), uf = [];
let Xu = !1, Yu;
const Ya = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(Hg + e);
    window.localStorage.setItem(Hg + e, t);
  } catch {
  }
  return null;
};
function Ch(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), o = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!o) return t(e);
      const s = new Image(), i = setTimeout(() => t(e), 8e3);
      s.onload = () => {
        clearTimeout(i);
        try {
          const a = Math.min(s.naturalWidth, s.naturalHeight);
          if (!a) return t(e);
          r.width = r.height = Ea, o.fillStyle = "#143a40", o.fillRect(0, 0, Ea, Ea), o.drawImage(s, (s.naturalWidth - a) / 2, (s.naturalHeight - a) / 2, a, a, 0, 0, Ea, Ea), t(r.toDataURL("image/jpeg", 0.82));
        } catch {
          t(e);
        }
      }, s.onerror = () => {
        clearTimeout(i), t(e);
      }, s.src = e;
    } catch {
      t(e);
    }
  });
}
async function aL(e) {
  var c, u, h, d, w;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = t.body) == null ? void 0 : u.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((h = t.body) == null ? void 0 : h.cancel()), "";
  let r = "", o = 0;
  const s = (g) => {
    let v = 0;
    for (; ; ) {
      const x = r.slice(v).search(/<img\b/i);
      if (x < 0)
        return r = g ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const L = v + x, B = r.indexOf(">", L);
      if (B < 0)
        return r = r.slice(L), null;
      const U = r.slice(L, B + 1), A = U.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const T = U.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (T) return "/inscription/" + T[1];
      v = B + 1;
    }
  }, i = (w = (d = t.body) == null ? void 0 : d.getReader) == null ? void 0 : w.call(d);
  if (!i)
    return r = await t.text(), s(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: g, value: v } = await i.read();
    if (g) break;
    o += v.byteLength, r += a.decode(v, { stream: !0 });
    const x = s(!1);
    if (x)
      return await i.cancel(), x;
    if (o > iL)
      return await i.cancel(), null;
  }
  return r += a.decode(), s(!0) ?? "";
}
async function cL() {
  if (!Xu) {
    Xu = !0;
    try {
      for (; uf.length; ) {
        const e = uf.shift();
        if (!An.has(e))
          try {
            const t = await aL(e);
            if (t === null) continue;
            if (!t) {
              An.set(e, ""), Ya(e, Lh), Tl();
              continue;
            }
            const n = await Ch(t);
            An.set(e, n), n.startsWith("data:image/jpeg") && Ya(e, n), Tl();
          } catch {
          }
      }
    } finally {
      Xu = !1;
    }
  }
}
function Th(e, t) {
  if (t && !An.get(e) ? (An.set(e, t), Ch(t).then((r) => {
    r !== t && (An.set(e, r), r.startsWith("data:image/jpeg") && Ya(e, r), Tl());
  })) : t === "" && !An.has(e) && An.set(e, ""), An.has(e)) return An.get(e);
  const n = Ya(e);
  if (n != null) {
    const r = n === Lh ? "" : n;
    return An.set(e, r), r;
  }
  return Dg.has(e) || (Dg.add(e), uf.push(e), Yu || (Yu = setTimeout(() => {
    Yu = void 0, cL();
  }, 1200))), "";
}
function Fg(e) {
  if (An.has(e)) return An.get(e);
  const t = Ya(e);
  if (t == null) return null;
  const n = t === Lh ? "" : t;
  return An.set(e, n), n;
}
const qu = /* @__PURE__ */ new Map(), Wu = /* @__PURE__ */ new Set();
function Qc(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : qu.has(e) ? qu.get(e) : (Wu.has(e) || (Wu.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, o, s, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((o = t.body) == null ? void 0 : o.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((s = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : s[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    qu.set(e, t), Tl();
  }).catch(() => {
    Wu.delete(e);
  })), "");
}
const Ci = 12, lL = 5e3, _n = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Ti = (e, t, n = "") => {
  const r = _n("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function uL(e) {
  let t, n = [], r = 0, o = !1, s = !1, i = -1 / 0, a = "", c = "recent", u = !1, h = Ci;
  const d = _n("div", "", "ppp-shelf-box");
  Ih(() => e.changed());
  const w = (N) => "xtrata.radio.shelf.pins.v1:" + N, g = (N) => "xtrata.radio.shelf.recent.v1:" + N, v = (N, P) => {
    try {
      return JSON.parse(e.store.get(N) || "null") ?? P;
    } catch {
      return P;
    }
  }, x = (N) => new Set(v(w(N), []).filter((P) => Number.isSafeInteger(P))), L = (N) => {
    const P = v(g(N), {}), W = {};
    for (const [R, le] of Object.entries(P)) Number.isSafeInteger(Number(R)) && typeof le == "number" && (W[Number(R)] = le);
    return W;
  };
  async function B(N) {
    if (!o) {
      o = !0, s = !1;
      try {
        const P = [];
        let W = 0, R = 0;
        for (let le = 0; le < lL / 100 + 1; le++) {
          const ue = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${W}&limit=100`);
          if (P.push(...nL(ue == null ? void 0 : ue.shelf)), R = Number(ue == null ? void 0 : ue.total) || P.length, !(ue != null && ue.next) || !Number.isSafeInteger(ue.next)) break;
          W = ue.next;
        }
        N === t && (n = P, r = R, i = e.now());
      } catch {
        s = !0;
      } finally {
        o = !1, e.changed();
      }
    }
  }
  const U = () => {
    i = -1 / 0;
  }, A = _n("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, h = Ci, e.changed();
  };
  const T = _n("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const N of tL) {
    const P = document.createElement("option");
    P.value = N.value, P.textContent = N.label, T.append(P);
  }
  T.onchange = () => {
    c = T.value, h = Ci, e.changed();
  };
  const _ = Ti("", () => {
    u = !u, h = Ci, e.changed();
  }, "tiny"), Y = _n("div", "", "ppp-shelf-tools");
  Y.append(A, T, _);
  const ce = _n("div"), ne = _n("div");
  function q(N) {
    const P = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (P !== t && (t = P, n = [], r = 0, i = -1 / 0, h = Ci), !P || N.walletCannotAlbums) return null;
    if (!o && e.now() - i > 5 * 6e4 && B(P), !n.length)
      return s ? (ne.replaceChildren(_n("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ti("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(ne), d) : null;
    const W = x(P), R = L(P), le = sL(n, { query: a, sort: c, pinnedOnly: u, pins: W, recents: R });
    A.value !== a && (A.value = a), T.value = c, _.textContent = u ? "★ Pinned only" : "☆ Pinned only", _.setAttribute("aria-pressed", String(u));
    const ue = [];
    if (N.slot > 0 && ue.push(Ti("← My player", () => e.open(0), "quiet")), !le.length) ue.push(_n("p", "No album matches that.", "ppp-mute"));
    else {
      const Xe = _n("ul", "", "ppp-shelf-list");
      for (const C of le.slice(0, h)) {
        const F = _n("li", "", C.slot === N.slot ? "now" : ""), re = W.has(C.slot), de = Ti(re ? "★" : "☆", () => {
          const ut = new Set(W);
          re ? ut.delete(C.slot) : ut.add(C.slot), e.store.set(w(P), JSON.stringify([...ut])), e.changed();
        }, "tiny");
        de.setAttribute("aria-label", re ? `Unpin ${C.player.title}` : `Pin ${C.player.title}`);
        const Ne = [C.player.subtitle, `${Dr(C.player).length} ${Dr(C.player).length === 1 ? "song" : "songs"}`, C.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Pe = C.slot === N.slot, Ht = Ti(Pe ? "Playing" : "Select", () => {
          e.store.set(g(P), JSON.stringify(oL({ ...R, [C.slot]: e.now() }))), e.open(C.slot);
        }, Pe ? "tiny ppp-pick" : "tiny primary ppp-pick");
        Ht.disabled = Pe;
        const Ge = Dr(C.player)[0], _e = C.player.cover ?? (Ge == null ? void 0 : Ge.id), Ue = _e ? Th(String(_e)) : "", _t = _n("span", "", "ppp-shelf-art");
        if (Ue) {
          const ut = document.createElement("img");
          ut.src = Ue, ut.alt = "", ut.decoding = "async", _t.append(ut);
        } else _t.textContent = "💿";
        const kn = _n("span", "", "ppp-shelf-txt");
        kn.append(_n("span", C.player.title, "t"), _n("span", Ne, "ppp-mute")), F.append(de, _t, kn, Ht), Xe.append(F);
      }
      ue.push(Xe), le.length > h && ue.push(Ti(`Show more (${le.length - h} left)`, () => {
        h += Ci, e.changed();
      }, "quiet"));
    }
    return s && ue.push(_n("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), ce.replaceChildren(...ue), d.firstChild !== Y && d.replaceChildren(Y, ce), d;
  }
  return { render: q, invalidate: U, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const N = L(t), P = [...n].filter((W) => W.player).sort((W, R) => (N[R.slot] ?? 0) - (N[W.slot] ?? 0) || R.slot - W.slot)[0];
    return P ? { slot: P.slot, title: P.player.title } : null;
  } };
}
const jg = "http://www.w3.org/2000/svg", dL = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function Bl(e = "", t = !1) {
  const n = document.createElementNS(jg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, o] of dL) {
    const s = document.createElementNS(jg, "path");
    s.setAttribute("fill-rule", "evenodd"), s.setAttribute("fill", t ? "currentColor" : r), s.setAttribute("d", o), n.append(s);
  }
  return n;
}
const rt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, hn = (e, t, n, r = !1) => {
  const o = rt("button", e, t);
  return o.type = "button", o.disabled = r, o.onclick = n, o;
}, Ub = (e) => e.toLocaleString(), Rg = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, fL = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function Nl(e, t) {
  const n = rt("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, o) => {
    const s = rt("li", o < t ? "is-done" : o === t ? "is-now" : "");
    s.append(rt("i", "", o < t ? "✓" : String(o + 1)), rt("span", "", r)), n.append(s);
  }), n;
}
function hL() {
  const e = rt("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(rt("span", "tier-disc__mark", "?")), e;
}
const Sn = {
  gift: { title: "Your disc is ready", primary: "Claim my free player", play: "Play", hint: "Free. Face ID or fingerprint.", returning: "I already have a player", full: "Look around first" },
  installedNew: { title: "Open your player", body: "Use your face or fingerprint to open the player you already have.", primary: "Open my player", hint: "Face ID or fingerprint.", fresh: "I’m new: make my player" },
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
  arriving: { title: "Your player is made", body: "Your plays are on their way to it. This usually takes about a minute: keep this page open and it carries on by itself.", playing: "Your player is made" },
  landed: { title: "You’re in", primary: "Start listening", playing: "Keep listening" },
  empty: { title: "Your player is ready", body: "It has no plays yet. Add some and every song you hear pays its artist.", primary: "Add plays", full: "Look around the radio" },
  checking: "One moment…",
  asking: "Continue in the box below."
}, pL = (e) => e ? `Disc ${e} is yours` : Sn.gift.title, gL = (e, t, n = !1) => n ? "What is inside? Play it to find out." : e ? `${Ub(e)} plays inside. Every play pays the artist.` : "Every play pays the artist.", yL = (e) => e ? `${Ub(e)} plays. Every one pays the artist.` : "Every play pays the artist.";
function zg(e, t = !1) {
  const n = rt("div", "al-now" + (t ? " al-now--big" : "")), r = rt("img", "al-now__art");
  r.src = e.art, r.alt = "";
  const o = rt("div", "al-now__t");
  o.append(rt("b", "", e.title || "Playing now"), rt("span", "", e.artist));
  const s = rt("i", "al-now__eq" + (e.playing ? " is-on" : ""));
  return s.setAttribute("aria-hidden", "true"), s.append(rt("s"), rt("s"), rt("s")), n.append(r, o, s), n.setAttribute("role", "group"), n.setAttribute("aria-label", `${e.playing ? "Playing" : "Starting"}: ${e.title || "your first song"}${e.artist ? ` by ${e.artist}` : ""}`), n;
}
const wL = (e) => e ? `You got a ${e.name} player` : Sn.landed.title;
function mL(e, t = !0) {
  const n = rt("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(rt("span", "tier-disc__mark", e.mark)), n;
}
function bL(e) {
  const t = document.documentElement;
  let n = !1;
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(r, o = !1) {
      var h, d;
      if (!r) {
        n && !o && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = r.mode, r.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const s = rt("header", "al-top"), i = rt("a", "al-brand");
      i.href = "/radio", i.append(Bl("al-logo"), rt("span", "", "Xtrata "), rt("b", "", "Music")), s.append(i);
      const a = rt("div", "al-body al-body--welcome"), c = rt("div", "al-welcome"), u = r.mode;
      if (u === "checking")
        c.append(rt("p", "al-welcome-wait", Sn.checking));
      else {
        const w = fL(u);
        w >= 0 && c.append(Nl(u === "new" ? Rg.fresh : Rg.gift, w)), r.tier && (u === "landed" || u === "back" || u === "empty") ? c.append(mL(r.tier)) : u === "gift" || u === "arriving" ? c.append(hL()) : u === "new" && c.append(Bl("al-hero-mark"));
        const g = r.now && (u === "gift" || u === "arriving" || u === "landed") ? r.now : null, v = u === "new" && !!r.installed;
        if (c.append(rt("h1", "", u === "landed" ? wL(r.tier) : u === "back" && r.tier ? `Your ${r.tier.name} player` : u === "gift" ? pL(r.spot) : v ? Sn.installedNew.title : Sn[u].title)), g && u === "arriving" ? c.append(zg(g, !0)) : c.append(rt("p", "", u === "gift" ? gL(r.plays, r.from, r.mystery) : u === "landed" ? yL(r.plays) : v ? Sn.installedNew.body : Sn[u].body)), g && u !== "arriving" && c.append(zg(g)), r.status.length) {
          const x = rt("div", "al-status");
          x.setAttribute("role", "status"), x.append(...r.status), c.append(x);
        }
        if (r.asking) c.append(rt("p", "al-hint al-hint--ask", Sn.asking));
        else if (u === "back" && r.claimNew) {
          const x = Sn.backClaim;
          c.append(rt("p", "al-hint", x.body)), r.canStart && r.replaceOld ? c.append(hn("al-primary", x.replace, r.replaceOld, r.busy), rt("p", "al-hint", x.replaceHint), hn("al-link", x.both, r.claimNew, r.busy), hn("al-link", x.unlock, r.unlock, r.busy)) : r.canStart && c.append(hn("al-primary", x.primary, r.claimNew, r.busy), rt("p", "al-hint", x.hint), hn("al-link", x.unlock, r.unlock, r.busy)), c.append(hn("al-link", Sn.back.full, r.full));
        } else if (u === "gift") {
          const x = Sn.gift;
          if (r.canStart) {
            const L = hn("al-primary" + (r.intro ? " al-primary--play" : ""), r.intro ? x.play : x.primary, r.start, r.busy);
            c.append(L, rt("p", "al-hint", x.hint));
          }
          r.canStart ? c.append(hn("al-link", x.returning, r.returning, r.busy)) : c.append(hn("al-link", x.full, r.full));
        } else if (u === "new" && r.installed) {
          const x = Sn.installedNew;
          r.canStart && c.append(hn("al-primary", x.primary, r.returning, r.busy), rt("p", "al-hint", x.hint), hn("al-link", x.fresh, r.start, r.busy)), c.append(hn("al-link", Sn.new.full, r.full));
        } else if (u === "new" || u === "back") {
          const x = Sn[u];
          r.canStart && c.append(hn("al-primary", x.primary, u === "back" ? r.unlock : r.start, r.busy), rt("p", "al-hint", x.hint)), r.canStart && c.append(hn("al-link", x.returning, r.returning, r.busy)), c.append(hn("al-link", x.full, r.full));
        } else if (u === "landed") {
          if (c.append(hn("al-primary", (h = r.now) != null && h.playing ? Sn.landed.playing : Sn.landed.primary, r.full)), (d = r.albums) != null && d.length && !r.now) {
            c.append(rt("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const x of r.albums) {
              const L = hn("al-album", "", x.run);
              if (x.cover) {
                const U = rt("img", "al-album__art");
                U.src = x.cover, U.alt = "", L.classList.add("al-album--art"), L.append(U);
              }
              const B = rt("span", "al-album__t");
              B.append(rt("b", "", x.title), rt("span", "", x.by)), L.append(B), c.append(L);
            }
          }
        } else u === "empty" && c.append(hn("al-primary", Sn.empty.primary, r.restock), hn("al-link", Sn.empty.full, r.full));
      }
      a.append(c), e.hidden = !1, e.replaceChildren(s, a);
    }
  };
}
const xL = 20, SL = ["Album", "Passkey", "Listen"], Ln = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, en = {
  grid: Ln('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Ln('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Ln('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Ln('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Ln('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Ln('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Ln('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Ln('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Ln('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Ln('<path d="M6 9l6 6 6-6"/>', 18),
  right: Ln('<path d="M9 6l6 6-6 6"/>', 16),
  close: Ln('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Ln('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Ln('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Ln('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Ln('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Ln('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function oe(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [o, s] of Object.entries(t))
    s == null || s === !1 || (o === "class" ? r.className = String(s) : o === "html" ? r.innerHTML = String(s) : o.startsWith("on") && typeof s == "function" ? r[o.toLowerCase()] = s : o === "disabled" ? r.disabled = !!s : r.setAttribute(o, s === !0 ? "" : String(s)));
  for (const o of n) o != null && o !== !1 && r.append(o);
  return r;
}
const Pn = (e, ...t) => oe("button", { type: "button", ...e }, ...t), Fc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, ka = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, vL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, AL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function Gg(e, t, n = {}) {
  const r = !!n.list;
  let o = null, s = "", i = !1;
  const a = document.documentElement;
  function c(m) {
    var N, P, W;
    if (!m || !Number.isSafeInteger(m)) return "";
    const I = (W = (P = (N = t.radio()) == null ? void 0 : N.getState) == null ? void 0 : P.call(N)) == null ? void 0 : W.albumCover;
    return I != null && I.url && Number(I.tokenId) === m ? I.url : Qc(m);
  }
  Ih(() => q());
  function u(m) {
    var N;
    s = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const I = document.querySelector(".side");
    if (m && m !== "more") {
      for (const R of AL[m]) {
        const le = I == null ? void 0 : I.querySelector(R);
        le && (le.open = !0);
      }
      const P = document.getElementById("sheetTitle");
      P && (P.textContent = vL[m]);
      const W = document.getElementById("sheetExtra");
      W && W.replaceChildren(...m === "music" ? [d()] : []), (N = I == null ? void 0 : I.scrollTo) == null || N.call(I, { top: 0 });
    }
    q();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => u("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && s && a.dataset.view === "album" && u("");
  });
  const d = () => Pn(
    { class: "al-row", onClick: () => {
      u(""), t.openPlayer();
    } },
    oe("span", { class: "al-row-i", html: en.radio }),
    oe("span", { class: "al-row-t" }, oe("b", {}, "Xtrata Radio"), oe("small", {}, "Every song on-chain · FM, liked, all")),
    oe("span", { class: "al-row-go", html: en.right })
  );
  let w = null, g = !1;
  const v = () => {
    var I;
    const m = t.radio();
    g || !(m != null && m.subscribe) || (g = !0, m.subscribe((N) => {
      w = N, (o == null ? void 0 : o.mode) === "open" && q();
    }), w = ((I = m.getState) == null ? void 0 : I.call(m)) ?? null);
  };
  r || setInterval(() => {
    var P, W;
    if ((o == null ? void 0 : o.mode) !== "open" || !(w != null && w.playing)) return;
    const m = (W = (P = t.radio()) == null ? void 0 : P.getPosition) == null ? void 0 : W.call(P), I = e.querySelector(".al-bar > i"), N = e.querySelectorAll(".al-times span");
    !m || !I || (I.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", N.length === 2 && (N[0].textContent = Fc(m.current || 0), N[1].textContent = m.duration ? Fc(m.duration) : "–:––"));
  }, 500);
  let x = "", L = null;
  function B(m, I, N = {}) {
    const P = N.song || c(m.cover), R = [P ? oe("img", { src: P, alt: N.song ? "Song artwork" : `${m.title} cover` }) : oe("div", { class: "al-cover-fallback" }, oe("b", {}, m.title), m.subtitle ? oe("span", {}, m.subtitle) : null), N.paused ? oe("span", { class: "al-paused" }, oe("i", { html: en.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], le = "al-cover" + (I ? "" : " al-cover--small") + (N.paused ? " is-paused" : "");
    return N.flip ? (R.push(oe("span", { class: "al-flip", "aria-hidden": "true", html: en.flip })), Pn({ class: le + " is-flippable", "aria-label": N.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: N.flip }, ...R)) : oe("div", { class: le }, ...R);
  }
  function U(m) {
    return m.plays === null || m.plays === void 0 ? oe("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? oe("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : oe("span", { class: "al-chip" + (m.plays <= xL ? " al-chip--low" : "") }, `${ka(m.plays, "play", "plays")} left`);
  }
  function A(m) {
    const I = m.player, N = I.tracks.filter((W) => !W.hidden), P = [];
    return m.step !== void 0 && P.push(Nl(SL, m.step)), m.mode === "arrive" && m.from && P.push(oe("p", { class: "al-from" }, oe("span", { html: en.gift }), oe("span", {}, oe("b", {}, m.from), " sent you an album"))), P.push(B(I, !0)), P.push(oe(
      "div",
      { class: "al-intro" },
      oe("h1", {}, I.title),
      I.subtitle ? oe("p", { class: "al-artist" }, I.subtitle) : null,
      N.length ? oe("p", { class: "al-songline" }, N.map((W) => W.title || `#${W.id}`).join(" · ")) : null,
      oe("span", { class: "al-chip" }, [ka(N.length, "song", "songs"), m.offered ? ka(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && P.push(oe("div", { class: "al-status", role: "status" }, ...m.status)), P.push(oe("div", { class: "al-grow" })), m.asking ? P.push(oe("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && P.push(Pn({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, oe("span", { html: en.playSmall }), m.primary.label)), m.hint && !m.asking && P.push(oe("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && P.push(Pn({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), P;
  }
  function T(m, I) {
    const { songs: N, current: P, started: W, own: R, out: le, waiting: ue } = I, Xe = m.player, C = t.radio(), F = [];
    F.push(oe("div", { class: "al-listhead" }, oe("span", {}, oe("b", {}, Xe.title), ` · ${ka(N.length, "song", "songs")}`), U(m)));
    const re = c(Xe.cover), de = "album:" + Xe.cover;
    re && !An.has(de) && (An.set(de, re), Ch(re).then((Pe) => {
      Pe !== re && (An.set(de, Pe), q());
    }));
    const Ne = re ? An.get(de) || re : "";
    return F.push(oe("ol", { class: "al-tracks" }, ...N.map((Pe, Ht) => {
      const Ge = String(Pe.id) === P, _e = Th(String(Pe.id), Ge && W ? R : void 0);
      return oe("li", {}, Pn(
        { class: "al-track" + (Ge ? " is-on" : ""), "aria-label": `Play ${Pe.title || "#" + Pe.id}`, "aria-current": Ge ? "true" : void 0, disabled: le || ue, onClick: () => {
          var Ue;
          return (Ue = C == null ? void 0 : C.playToken) == null ? void 0 : Ue.call(C, Pe.id);
        } },
        oe(
          "span",
          { class: "al-th" + (_e ? "" : " is-blank") },
          _e ? oe("img", { src: _e, alt: "", decoding: "async" }) : Ne ? oe("img", { src: Ne, alt: "", decoding: "async" }) : null,
          _e ? null : oe("span", { class: "al-n" }, String(Ht + 1)),
          Ge ? oe("span", { class: "al-eq", html: en.eq }) : null
        ),
        oe("span", { class: "al-tt" }, Pe.title || `#${Pe.id}`, Pe.explicit ? oe("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), F;
  }
  function _(m) {
    var _e;
    const I = m.player, N = I.tracks.filter((Ue) => !Ue.hidden), P = t.radio(), W = w == null ? void 0 : w.nowPlaying, R = W && I.tracks.some((Ue) => String(Ue.id) === String(W.tokenId)) ? String(W.tokenId) : null, le = R ? I.tracks.find((Ue) => String(Ue.id) === R) : null, ue = m.plays === 0 && !m.playsComing, Xe = !!m.playsComing && !m.plays, C = !!(w != null && w.playing) && !!R, F = w == null ? void 0 : w.heart, re = R ? (_e = P == null ? void 0 : P.getPosition) == null ? void 0 : _e.call(P) : null;
    R && (C || ((re == null ? void 0 : re.current) ?? 0) > 0.5) && (x = I.id);
    const de = !!R && x === I.id;
    L && L !== R && (L = null);
    const Ne = de ? String((W == null ? void 0 : W.cover) || "") : "", Pe = !!Ne && L === R, Ge = [B(I, !ue, { song: Pe ? "" : Ne, paused: de && !C, flip: Ne ? () => {
      L = L === R ? null : R, q();
    } : void 0, flipped: Pe })];
    if (Ge.push(oe(
      "div",
      { class: "al-now" },
      oe(
        "div",
        { class: "al-now-t" },
        oe("div", { class: "al-song" }, le ? le.title || (W == null ? void 0 : W.title) || `#${le.id}` : I.title),
        oe("div", { class: "al-artist" }, le ? le.artist || (W == null ? void 0 : W.artist) || I.subtitle : I.subtitle || "Press play")
      ),
      R ? Pn({ class: "al-icon" + (F != null && F.liked ? " is-on" : ""), "aria-label": F != null && F.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(F != null && F.liked)), disabled: !!(F != null && F.pending) || !!(F != null && F.locked) || Xe, onClick: () => {
        var Ue;
        return (Ue = P == null ? void 0 : P.toggleLike) == null ? void 0 : Ue.call(P);
      }, html: F != null && F.liked ? en.heartOn : en.heart }) : null
    )), ue)
      Ge.push(oe(
        "div",
        { class: "al-out" },
        oe("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        oe("p", { class: "al-out-t" }, "You've played this album out"),
        oe("p", { class: "al-out-s" }, "Add plays to keep listening."),
        Y(m, !0)
      ));
    else {
      const Ue = re != null && re.duration ? Math.min(100, re.current / re.duration * 100) : 0;
      Ge.push(oe(
        "div",
        { class: "al-prog" },
        oe("div", { class: "al-bar" }, oe("i", { style: `width: ${Ue}%` })),
        oe("div", { class: "al-times" }, oe("span", {}, Fc((re == null ? void 0 : re.current) || 0)), oe("span", {}, re != null && re.duration ? Fc(re.duration) : "–:––"))
      ));
    }
    return Ge.push(oe(
      "div",
      { class: "al-ctl" + (ue || Xe ? " is-off" : "") },
      Pn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ue || Xe, onClick: () => {
        var Ue;
        return (Ue = P == null ? void 0 : P.prev) == null ? void 0 : Ue.call(P);
      }, html: en.prev }),
      Pn({ class: "al-play", "aria-label": C ? "Pause" : "Play", disabled: ue || Xe, onClick: () => {
        var Ue;
        return (Ue = P == null ? void 0 : P.playPause) == null ? void 0 : Ue.call(P);
      }, html: C ? en.pause : en.play }),
      Pn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ue || Xe, onClick: () => {
        var Ue;
        return (Ue = P == null ? void 0 : P.next) == null ? void 0 : Ue.call(P);
      }, html: en.next })
    )), m.status.length && Ge.push(oe("div", { class: "al-status", role: "status" }, ...m.status)), Ge.push(...T(m, { songs: N, current: R, started: de, own: Ne, out: ue, waiting: Xe })), Ge.push(oe("div", { class: "al-grow" })), Ge.push(Pn(
      { class: "al-more", "aria-expanded": String(s === "more"), onClick: () => u(s === "more" ? "" : "more") },
      oe("span", {}, "More ", oe("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      oe("span", { html: en.down })
    )), Ge;
  }
  function Y(m, I) {
    const N = oe("div", { class: "al-topups" + (I ? " al-topups--primary" : "") }), P = I ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const W of P) {
      const R = m.myPlays !== void 0 && m.myPlays >= W && !m.playsComing && !m.busy;
      N.append(Pn({ class: "al-topup", disabled: !R, onClick: () => t.topUp(W) }, I ? `Add ${W.toLocaleString()} plays` : `+${W.toLocaleString()}`));
    }
    return I && N.append(Pn({ class: "al-link", onClick: () => u("more") }, "Other amounts")), N;
  }
  function ce(m) {
    const I = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), N = oe(
      "div",
      { class: "al-card" },
      oe("div", { class: "al-card-h" }, oe("b", {}, `Add plays to ${m.player.title}`), oe("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      Y(m, !1),
      oe("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : I ? `Moved from My player · ${ka(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !I && !m.playsComing && m.myPlays !== void 0 ? Pn({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), P = (R, le, ue, Xe) => Pn(
      { class: "al-row", onClick: Xe },
      oe("span", { class: "al-row-i", html: R }),
      oe("span", { class: "al-row-t" }, oe("b", {}, le), oe("small", {}, ue)),
      oe("span", { class: "al-row-go", html: en.right })
    ), W = oe(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      P(en.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, q();
      }),
      i ? oe("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return oe(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      oe("div", { class: "al-sheet-h" }, oe("b", {}, "More"), Pn({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: en.close })),
      m.mode === "open" ? N : null,
      oe(
        "div",
        { class: "al-rows" },
        P(en.grid, "My music", "Your albums and the radio", () => u("music")),
        P(en.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), t.openPlayer();
        }),
        m.canMake ? P(en.gift, "Albums (admin)", "Make an album and fund copies", () => u("gifts")) : null,
        P(en.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        W
      )
    );
  }
  function ne(m) {
    var ue, Xe;
    const I = m.player, N = w == null ? void 0 : w.nowPlaying, P = N && I.tracks.some((C) => String(C.id) === String(N.tokenId)) ? String(N.tokenId) : null, W = !!(w != null && w.playing) && !!P, R = P ? (Xe = (ue = t.radio()) == null ? void 0 : ue.getPosition) == null ? void 0 : Xe.call(ue) : null;
    P && (W || ((R == null ? void 0 : R.current) ?? 0) > 0.5) && (x = I.id);
    const le = !!P && x === I.id;
    return T(m, {
      songs: I.tracks.filter((C) => !C.hidden),
      current: P,
      started: le,
      own: le ? String((N == null ? void 0 : N.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function q() {
    const m = o;
    if (r) {
      if (!m || m.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      v(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...ne(m));
      return;
    }
    if (!m) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    v(), e.hidden = !1;
    const I = oe(
      "header",
      { class: "al-top" },
      oe("a", { class: "al-brand", href: "/radio" }, Bl("al-logo"), "Xtrata ", oe("b", {}, "Music")),
      m.mode === "open" ? Pn({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: en.grid }) : null
    ), N = oe("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? _(m) : A(m));
    e.replaceChildren(I, N, ...s === "more" ? [oe("div", { class: "al-scrim", onClick: () => u("") }), ce(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        o = m, q();
        return;
      }
      const I = !!o;
      o = m, !m && (I || s) && (s = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, q();
    },
    sheet: () => s,
    setSheet: u
  };
}
const EL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", kL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${EL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, $L = (e) => kL("source|audio", e), IL = 48 * 1024 * 1024;
function LL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let o = 0; o < n.length; o++) r[o] = n.charCodeAt(o);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function CL(e) {
  const t = e.fetch ?? ((...h) => fetch(...h));
  let n = null, r = null, o = "", s = null;
  const i = (h) => {
    n = h, e.changed();
  }, a = () => {
    var h;
    if (s == null || s.abort(), s = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (h = r.load) == null || h.call(r);
      } catch {
      }
    o.startsWith("blob:") && URL.revokeObjectURL(o), o = "";
  };
  async function c(h, d, w = 0) {
    var A, T, _;
    const g = "/inscription/" + h, v = await t(g, { signal: d }), x = (v.headers.get("content-type") || "").toLowerCase();
    if (!v.ok)
      throw await ((A = v.body) == null ? void 0 : A.cancel()), new Error("not found");
    if (x.startsWith("audio/"))
      return await ((T = v.body) == null ? void 0 : T.cancel()), g;
    if (!x.includes("text/html"))
      throw await ((_ = v.body) == null ? void 0 : _.cancel()), new Error("not a song");
    const L = await v.text();
    if (L.length > IL) throw new Error("too large");
    const B = L.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (B) return LL(B[1].replace(/&amp;/g, "&"));
    const U = w === 0 ? $L(L) : null;
    if (U) return c(Number(U), d, 1);
    throw new Error("no audio");
  }
  async function u(h) {
    var w;
    a();
    const d = s = new AbortController();
    i({ id: h, state: "loading" });
    try {
      const g = await c(h, d.signal);
      if (d.signal.aborted) {
        g.startsWith("blob:") && URL.revokeObjectURL(g);
        return;
      }
      if (o = g, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (a(), i(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const v = n.id;
          a(), i({ id: v, state: "error" });
        }
      })), (w = e.quiet) == null || w.call(e), r.src = g, await r.play(), d.signal.aborted) return;
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
const TL = ["Earned", "Claim", "Yours"], BL = ["Connect", "Link", "Name"], Ct = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, xn = (e, t, n, r = !1) => {
  const o = Ct("button", e, t);
  return o.type = "button", o.disabled = r, o.onclick = n, o;
}, Kg = (e, t, n, r = !1) => {
  const o = xn("al-album", "", n, r), s = Ct("span", "al-album__t");
  return s.append(Ct("b", "", e), Ct("span", "", t)), o.append(s), o;
}, NL = (e) => `No. ${String(e).padStart(4, "0")}`, ML = (e) => e.main ? e.linked ? 2 : 1 : 0;
function PL(e) {
  const t = document.documentElement;
  let n = !1, r = "", o = null;
  const s = (i) => {
    if (o && r === i.art) return o;
    r = i.art, o = Ct("div", "aw-art");
    const a = document.createElement("iframe");
    return a.src = i.art, a.title = `${i.tier.name} record. Drag to turn it.`, a.setAttribute("sandbox", "allow-scripts"), o.append(a), o;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, a = !1) {
      if (!i) {
        n && !a && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", o = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = i.screen, i.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const c = Ct("header", "al-top"), u = Ct("a", "al-brand");
      u.href = "/radio", u.append(Bl("al-logo"), Ct("span", "", "Xtrata "), Ct("b", "", "Music")), c.append(u);
      const h = Ct("div", "al-welcome"), d = i.screen, w = i.tier.name, g = typeof i.name == "string" && i.name ? i.name : null;
      if (h.append(d === "have" ? Nl(BL, ML(i)) : Nl(TL, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const U = Ct("div", "tier-disc tier-disc--mid");
        U.dataset.tier = i.tier.id, U.append(Ct("span", "tier-disc__mark", i.tier.mark)), h.append(U);
      } else if (d !== "have" && d !== "get") {
        const U = s(i);
        U.classList.toggle("aw-art--small", d === "name"), h.append(U);
      }
      const v = d === "ready" ? `Your ${w} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      h.append(Ct("h1", "", v));
      const x = (U, A = "") => h.append(Ct("p", A, U)), L = [];
      if (d === "ready")
        x(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), L.push(xn("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), Ct("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), xn("al-link", "Later", i.later));
      else if (d === "name")
        g ? (x(`Your record will carry ${g} beside your player’s address.`), L.push(xn("al-primary", `Claim with ${g}`, () => i.claim("auto"), i.busy), xn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (x("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), L.push(
          Kg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          Kg("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          xn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (x("Could not check for a .btc name just now.", "ppp-warn"), L.push(xn("al-primary", "Check again", i.refresh, i.busy), xn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), L.push(Ct("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), L.push(xn("al-link", "Later", i.later));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (x(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), L.push(xn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? g ? (x(`Found it: ${g}. It goes on your plaque beside your player’s address.`), L.push(xn("al-primary", `Claim with ${g}`, () => i.claim("auto"), i.busy))) : (x(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), L.push(xn("al-primary", "Check again", i.refresh, i.busy))) : (x(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), L.push(xn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (x("Connect the Leather or Xverse wallet that holds your .btc name."), L.push(xn("al-primary", "Connect my wallet", i.connect, i.busy))), L.push(xn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const U = Ct("ol", "aw-steps"), A = Ct("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = Ct("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", A.append(T);
        const _ = Ct("li");
        _.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", Ct("span", "ppp-addr-full", i.player), i.copyAddress());
        const Y = Ct("li", "", "Check again, and your name shows on the preview before you claim.");
        U.append(A, _, Y), h.append(U), L.push(xn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), xn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (x("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const U = Ct("p", "al-hint"), A = Ct("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", U.append(A), h.append(U);
        }
      } else if (x(`${w} record ${NL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), L.push(xn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const U = Ct("a", "al-link", "Open it full screen ↗");
        U.href = `/i/${i.inscription}`, U.target = "_blank", U.rel = "noopener", L.push(U);
      }
      if (i.status.length) {
        const U = Ct("div", "al-status");
        U.setAttribute("role", "status"), U.append(...i.status), h.append(U);
      }
      i.asking ? h.append(Ct("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...L);
      const B = Ct("div", "al-body al-body--welcome");
      B.append(h), e.hidden = !1, e.replaceChildren(c, B);
    }
  };
}
const Ob = "xtrata.xyz/music/release", _L = "Release music on Xtrata Music; no spending permission", UL = (e) => ({
  domain: wr({ name: St(Ob), version: St("1"), "chain-id": En(1) }),
  message: wr({ purpose: St(_L), artist: St(e.artist), release: St(e.hash), issued: En(e.issued) })
}), OL = "Set the price of my release on Xtrata Music; no spending permission", HL = 100000n, DL = 1000000000n, FL = (e) => e === 0n || e >= HL && e <= DL, jL = (e) => ({
  domain: wr({ name: St(Ob), version: St("1"), "chain-id": En(1) }),
  message: wr({ purpose: St(OL), artist: St(e.artist), release: St(e.release), price: En(BigInt(e.price)), issued: En(e.issued) })
}), Bi = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, RL = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, be = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Cn = (e, t, n = "") => {
  const r = be("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, jc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), Vg = (e) => {
  const t = Dr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function Rc(e, t, n = "", r = "") {
  const o = be("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), s = e || n;
  if (s) {
    const i = document.createElement("img");
    i.src = s, i.alt = "", i.decoding = "async", o.append(i);
  }
  return e || o.append(be("span", t)), o;
}
const Zu = (e) => !!e && cf(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function zL(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, o = "", s = "";
  const i = (() => {
    try {
      const z = new URLSearchParams(location.search).get("release");
      return cf(z) ? z : null;
    } catch {
      return null;
    }
  })();
  let a = i ? { id: i } : null;
  const c = (z) => "xtrata.radio.releases.shelf.v1:" + z;
  let u = null, h = !1, d = -1 / 0;
  const w = (z, H, Q) => {
    const se = Array.isArray(H) ? H.filter(Zu).map((he) => ({ ...he, hidden: !!he.hidden })) : [];
    u = { for: z, albums: se, fresh: Q }, Q && e.store.set(c(z), JSON.stringify(se));
  }, g = (z) => {
    try {
      w(z, JSON.parse(e.store.get(c(z)) || "[]"), !1);
    } catch {
      w(z, [], !1);
    }
  }, v = () => {
    const z = e.player().address;
    return z && (u == null ? void 0 : u.for) === z ? u.albums : [];
  };
  async function x(z, H = "") {
    const Q = e.player();
    if (!Q.address || !Q.unlocked)
      return s = "Unlock your player first.", e.changed(), !1;
    if (h) return !1;
    h = !0, s = "", e.changed();
    try {
      const se = await e.signShelf(z, H), he = await e.json("/radio/release/shelf", jc(se));
      return w(Q.address, he == null ? void 0 : he.albums, !0), B(he == null ? void 0 : he.pay) ? A(Q.address, he.pay) : z === "add" && A(Q.address, null, H), !0;
    } catch (se) {
      return z !== "list" && (s = se.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const L = (z) => "xtrata.radio.releases.orders.v1:" + z, B = (z) => !!z && /^[0-9a-f]{16}$/.test(z.order) && cf(z.release) && typeof z.to == "string" && /^\d{1,12}$/.test(z.amount) && typeof z.memo == "string", U = (z) => {
    if (!z) return {};
    try {
      const H = JSON.parse(e.store.get(L(z)) || "{}");
      return H && typeof H == "object" ? Object.fromEntries(Object.entries(H).filter(([, Q]) => B(Q))) : {};
    } catch {
      return {};
    }
  };
  function A(z, H, Q = (H == null ? void 0 : H.release) ?? "") {
    var he;
    const se = U(z);
    H ? se[H.release] = { ...((he = se[H.release]) == null ? void 0 : he.order) === H.order ? se[H.release] : {}, ...H } : delete se[Q], e.store.set(L(z), Object.keys(se).length ? JSON.stringify(se) : null);
  }
  const T = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Map();
  async function Y(z, H, Q = !1) {
    var se;
    if (!T.has(H.order)) {
      T.add(H.order), _.set(H.order, e.now()), Q && (s = "", e.changed());
      try {
        const he = await e.json("/radio/release/paid", jc({ order: H.order, ...H.txid ? { txid: H.txid } : {} }));
        (he == null ? void 0 : he.status) === "paid" ? (A(z, null, H.release), ((se = a == null ? void 0 : a.view) == null ? void 0 : se.id) === H.release && (a.view = { ...a.view, added: a.view.added + 1 }), s = "", T.delete(H.order), (u == null ? void 0 : u.for) === z && (u.fresh = !1), e.player().unlocked && await x("list")) : (B(he) && A(z, { ...H, ...he }), Q && (he == null ? void 0 : he.status) === "pending" && (s = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (he) {
        /did not go through|does not pay this order/.test(he.message || "") && A(z, { ...H, txid: void 0, status: "pending" }), (Q || H.txid) && (s = he.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        T.delete(H.order), e.changed();
      }
    }
  }
  async function ce(z, H, Q) {
    if (!o) {
      o = "Approve the payment in your wallet…", s = "", e.changed();
      try {
        const se = await e.pay(z, Q.to, BigInt(Q.amount), Q.memo), he = { ...Q, txid: se || void 0, status: "confirming" };
        A(H, he), o = "", Y(H, he);
      } catch (se) {
        s = /cancel/i.test(se.message || "") ? "Payment cancelled. Nothing was sent." : se.message || "Not paid. Nothing was sent.";
      } finally {
        o = "", e.changed();
      }
    }
  }
  async function ne(z) {
    const H = e.player();
    if (!await x("add", z.id) || !H.address) return;
    const Q = U(H.address)[z.id], se = e.main();
    Q && se && await ce(se, H.address, Q);
  }
  function q() {
    if (r || (r = !0, e.json("/radio/release/config").then((H) => {
      t = (H == null ? void 0 : H.enabled) === !0, n = { copies: t && (H == null ? void 0 : H.copies) === !0, sales: t && (H == null ? void 0 : H.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (a && !a.view && !a.error) {
      const H = a;
      H.error = "", e.json("/radio/release/view?id=" + H.id).then(
        (Q) => {
          Zu(Q) ? (H.view = Q, delete H.error) : H.error = "This release could not be read.";
        },
        (Q) => {
          H.error = Q.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const z = e.player();
    if (z.address) {
      (u == null ? void 0 : u.for) !== z.address && g(z.address), z.unlocked && !(u != null && u.fresh) && !h && e.now() - d > 6e4 && (d = e.now(), x("list"));
      for (const H of Object.values(U(z.address)))
        if ((H.txid || H.status === "confirming") && !T.has(H.order) && e.now() - (_.get(H.order) ?? -1 / 0) > 2e4) {
          const Q = z.address;
          Y(Q, H).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const m = () => t ? v().filter((z) => !z.hidden) : [];
  function I(z, H) {
    const Q = be("ol", "", "ppp-rel-songs");
    return z.forEach((se, he) => {
      const ft = be("li");
      ft.append(Rc(e.art.song(se.id, !0) || "", String(he + 1), H), be("span", se.title)), Q.append(ft);
    }), Q;
  }
  function N() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [be("p", `♫ ${a.error}`, "ppp-warn")] : [be("p", "♫ Opening this release…", "ppp-mute")];
    const z = a.view, H = be("div", "", "ppp-release-in"), Q = be("p", "", "ppp-release-in__h"), se = BigInt(/^\d{1,12}$/.test(z.price ?? "") ? z.price : "0");
    Q.append(be("b", z.title), be("span", `${z.subtitle || e.who(z.artist)} · ${Vg(z)}${se > 0n ? ` · ${Bi(se)} STX` : ""}`));
    const he = Dr(z), ft = e.art.cover(z.cover) || (z.cover ? "" : he[0] && e.art.song(he[0].id, !0) || ""), Me = be("div", "", "ppp-rel-top");
    Me.append(Rc(ft, "💿", "", "is-cover"), Q), H.append(Me, I(he.map(($e) => ({ id: $e.id, title: $e.title || `#${$e.id}` })), e.art.cover(z.cover))), H.append(be("p", `Released by ${e.who(z.artist)}. ${z.added === 1 ? "1 player has" : `${z.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const He = e.player(), vt = v().find(($e) => $e.id === z.id), Ke = be("div", "", "ppp-award__row");
    if (vt)
      H.append(be("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), Ke.append(Cn("Play it", () => e.open(z), "primary"));
    else if (!He.address) H.append(be("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!He.unlocked) H.append(be("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (se > 0n) {
      const $e = U(He.address)[z.id], Ze = e.main(), Ye = `${Bi(($e == null ? void 0 : $e.amount) ?? se)} STX`;
      if ($e != null && $e.txid || ($e == null ? void 0 : $e.status) === "confirming") {
        H.append(be("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Ve = Cn("Check now", () => void Y(He.address, $e, !0));
        Ve.disabled = T.has($e.order), Ke.append(Ve);
      } else if (H.append(be("p", `This album costs ${Ye}. You pay ${e.who(z.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !$e) H.append(be("p", "Buying is paused right now.", "ppp-warn"));
      else if ($e) {
        if (Ze) {
          const yn = Cn(`Pay ${Ye} from my wallet`, () => void ce(Ze, He.address, $e), "primary");
          yn.disabled = !!o, Ke.append(yn);
        } else H.append(be("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const Ve = be("div", "", "ppp-rel-pay"), Dt = (yn, Kn, It) => {
          const dn = be("p");
          return dn.append(be("span", yn), be("code", Kn), fr(`order-${It}:${$e.order}`, "Copy", () => Kn, "tiny", e.changed)), dn;
        };
        Ve.append(Dt("Send", Bi($e.amount) + " STX", "amount"), Dt("To", $e.to, "to"), Dt("Memo", $e.memo, "memo")), H.append(Ve, be("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const gn = Cn("I have paid: check", () => void Y(He.address, $e, !0));
        gn.disabled = T.has($e.order), Ke.append(gn);
      } else {
        const Ve = Cn(`Buy · ${Ye}`, () => void ne(z), "primary");
        Ve.disabled = h || !!o, Ke.append(Ve);
      }
    } else {
      H.append(be("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const $e = Cn("Add to my player", () => {
        x("add", z.id).then((Ze) => {
          Ze && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      $e.disabled = h, Ke.append($e);
    }
    return Ke.append(Cn("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), H.append(Ke), o && H.append(be("p", o, "ppp-cyan")), s && H.append(be("p", s, "ppp-warn")), [H];
  }
  let P = !1;
  function W() {
    const z = t ? v() : [];
    if (!z.length) return null;
    const H = be("details", "", "ppp-release-manage");
    H.open = P, H.ontoggle = () => {
      P = H.open;
    };
    const Q = z.filter((he) => he.hidden).length;
    H.append(be("summary", `Albums I added (${z.length}${Q ? `, ${Q} hidden` : ""})`));
    const se = e.player().unlocked;
    se || H.append(be("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const he of z) {
      const ft = be("div", "", "ppp-release-row" + (he.hidden ? " is-hidden" : "")), Me = be("span", "", "ppp-release-row__t");
      Me.append(be("b", he.title), be("span", `${he.subtitle || e.who(he.artist)}${he.hidden ? " · hidden" : ""}`));
      const He = Cn(he.hidden ? "Show" : "Hide", () => void x(he.hidden ? "show" : "hide", he.id), "tiny"), vt = Cn("Remove", () => void x("remove", he.id), "tiny");
      He.disabled = vt.disabled = !se || h, ft.append(Me, He, vt), H.append(ft);
    }
    return H.append(be("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), s && !a && H.append(be("p", s, "ppp-warn")), H;
  }
  let R = null, le = [], ue = null;
  const Xe = be("input");
  Xe.maxLength = 60, Xe.placeholder = "Title of the single, EP or album", Xe.setAttribute("aria-label", "Release title");
  const C = be("input");
  C.maxLength = 80, C.placeholder = "Artist name shown under the title", C.setAttribute("aria-label", "Artist name");
  const F = be("input");
  F.inputMode = "numeric", F.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", F.setAttribute("aria-label", "Cover inscription number");
  const re = be("input");
  re.inputMode = "decimal", re.placeholder = "Price in STX, e.g. 2 (0 makes it free)", re.setAttribute("aria-label", "Price in STX");
  let de = null;
  const Ne = (z, H, Q = "") => {
    de = (de == null ? void 0 : de.id) === z && de.what === H ? null : { id: z, what: H }, (de == null ? void 0 : de.what) === "price" && (re.value = Q), s = "", e.changed();
  };
  async function Pe(z, H) {
    if (o) return;
    const Q = RL(re.value);
    if (Q === null || !FL(Q)) {
      s = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    o = "Sign in your wallet (nothing is spent)…", s = "", e.changed();
    try {
      const se = { artist: z, release: H.id, price: Q.toString(), issued: e.now() }, he = await e.sign(z, jL(se));
      o = "Saving the price…", e.changed(), await e.json("/radio/release/price", jc({ request: se, signature: he })), s = Q > 0n ? `Price set ✓ “${H.title}” now costs ${Bi(Q)} STX, paid straight to this wallet.` : `“${H.title}” is free again ✓`, de = null, _e(z, !0);
    } catch (se) {
      s = se.message || "The price was not changed.";
    } finally {
      o = "", e.changed();
    }
  }
  const Ht = (z) => `${location.origin}${location.pathname}?release=${z}`;
  function Ge(z) {
    R = { for: z, loading: !0 }, le = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(z)).then(
      (H) => {
        const Q = Array.isArray(H == null ? void 0 : H.songs) ? H.songs.filter((se) => Number.isSafeInteger(se == null ? void 0 : se.id) && typeof se.title == "string") : null;
        R = Q ? { for: z, songs: Q, more: !!H.more } : { for: z, error: "Your songs could not be read right now." };
      },
      (H) => {
        R = { for: z, error: H.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function _e(z, H = !1) {
    !H && (ue == null ? void 0 : ue.for) === z && e.now() - ue.at < 6e4 || (ue = { for: z, list: (ue == null ? void 0 : ue.for) === z ? ue.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(z)).then((Q) => {
      Array.isArray(Q == null ? void 0 : Q.releases) && (ue = { for: z, list: Q.releases.filter(Zu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Ue(z) {
    if (!o) {
      o = "Checking your release…", s = "", e.changed();
      try {
        const H = F.value.trim().replace(/^#/, ""), Q = Mb({ title: Xe.value.trim(), subtitle: C.value.trim(), tracks: [...le], cover: H ? Number(H) : null });
        o = "Sign in your wallet (nothing is spent)…", e.changed();
        const se = { artist: z, hash: Pb(Q), issued: e.now() }, he = await e.sign(z, UL(se));
        o = "Releasing…", e.changed();
        const ft = await e.json("/radio/release/create", jc({ definition: Q, request: se, signature: he }));
        s = `${ft.existing ? "Already released" : "Released"} ✓ “${ft.title}”. Its link is below.`, le = [], Xe.value = "", F.value = "", e.audition.stop(), _e(z, !0);
      } catch (H) {
        s = H.message || "Not released.";
      } finally {
        o = "", e.changed();
      }
    }
  }
  const _t = () => {
    queueMicrotask(() => e.audition.stop());
  }, kn = /* @__PURE__ */ new Set();
  function ut(z) {
    const H = le.map((Ve) => z.find((Dt) => Dt.id === Ve)).filter((Ve) => !!Ve), Q = F.value.trim().replace(/^#/, ""), se = /^\d{1,9}$/.test(Q) ? Number(Q) : null, he = e.art.cover(se), ft = H[0] ? e.art.song(H[0].id, !0) : null, Me = be("div", "", "ppp-release-preview");
    Me.append(be("p", "How it will look", "ppp-featured__h"));
    const He = be("p", "", "ppp-release-in__h"), vt = be("b", Xe.value.trim() || "Untitled"), Ke = be("span", `${C.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`);
    He.append(vt, Ke);
    const $e = be("div", "", "ppp-rel-top");
    $e.append(Rc(se ? he : ft || "", "💿", "", "is-cover"), He), Me.append($e, I(H.map((Ve) => ({ id: Ve.id, title: Ve.title })), he));
    const Ze = H.filter((Ve) => e.art.song(Ve.id, !0) === null).length, Ye = [];
    se && !he && Ye.push(`Looking for an image in #${se}… If none appears, that inscription is not a picture.`), Ze && Ye.push(`Finding artwork for ${Ze} ${Ze === 1 ? "song" : "songs"}…`), !Ze && H.some((Ve) => e.art.song(Ve.id, !1) === "") && Ye.push(`A numbered square is a song with no artwork of its own${he ? ": it shows the cover, dimmed" : ""}.`);
    for (const Ve of Ye) Me.append(be("p", Ve, "ppp-mute"));
    return Xe.oninput = () => {
      vt.textContent = Xe.value.trim() || "Untitled";
    }, C.oninput = () => {
      Ke.textContent = `${C.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`;
    }, F.onchange = () => e.changed(), Me;
  }
  function Zt() {
    var Q;
    const z = e.main();
    if (!t || !z)
      return R && (R = null, le = [], _t()), null;
    const H = [be("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (R && R.for !== z && (R = null, le = [], kn.clear(), _t()), !R) H.push(Cn("Show the songs in my wallet", () => Ge(z), "primary"));
    else if (R.loading) H.push(be("p", "Reading your wallet…", "ppp-cyan"));
    else if (R.error) H.push(be("p", R.error, "ppp-warn"), Cn("Try again", () => Ge(z)));
    else if (!R.songs.length) H.push(be("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      H.push(be("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const se = be("div", "", "ppp-release-songs");
      for (const Me of R.songs) {
        const He = le.indexOf(Me.id), vt = be("div", "", "ppp-release-song" + (He >= 0 ? " is-on" : "")), Ke = e.audition.state(Me.id);
        Ke !== "idle" && kn.add(Me.id);
        const $e = Cn(Ke === "playing" ? "❚❚" : Ke === "loading" ? "…" : "▶", () => e.audition.toggle(Me.id), "ppp-release-hear" + (Ke === "playing" ? " is-on" : ""));
        $e.setAttribute("aria-label", Ke === "playing" ? `Stop ${Me.title}` : `Listen to ${Me.title}`), $e.title = Ke === "error" ? "This song could not be played just now" : Ke === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const Ze = e.art.song(Me.id, He >= 0 || kn.has(Me.id)), Ye = Cn("", () => {
          le = He >= 0 ? le.filter((Ve) => Ve !== Me.id) : [...le, Me.id], e.changed();
        }, "ppp-release-pick");
        Ye.setAttribute("aria-pressed", String(He >= 0)), Ye.append(be("i", He >= 0 ? String(He + 1) : "+"), be("b", Me.title), be("span", Ke === "error" ? "could not play" : `${Me.artist ? Me.artist + " · " : ""}#${Me.id}`, Ke === "error" ? "ppp-warn" : "")), vt.append($e, Rc(Ze || "", Ze === "" ? "♪" : "", ""), Ye), se.append(vt);
      }
      H.push(se), R.more && H.push(be("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !C.value && le.length && (C.value = ((Q = R.songs.find((Me) => Me.id === le[0])) == null ? void 0 : Q.artist) || "");
      const he = le.length === 0 ? "release" : le.length === 1 ? "single" : le.length <= 6 ? "EP" : "album", ft = Cn(le.length ? `Sign and release this ${he} · ${le.length} ${le.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Ue(z), "primary");
      ft.disabled = !le.length || !!o, H.push(Xe, C, F), le.length && H.push(ut(R.songs)), H.push(ft);
    }
    if (o && H.push(be("p", o, "ppp-cyan")), s && !a && H.push(be("p", s, /✓/.test(s) ? "ppp-ok" : "ppp-warn")), _e(z), (ue == null ? void 0 : ue.for) === z && ue.list.length) {
      H.push(be("p", "Your releases", "ppp-featured__h"));
      for (const se of ue.list) {
        const he = be("div", "", "ppp-release-row"), ft = be("span", "", "ppp-release-row__t"), Me = BigInt(/^\d{1,12}$/.test(se.price ?? "") ? se.price : "0"), He = Me > 0n ? ` · ${Bi(Me)} STX · ${(se.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (ft.append(be("b", se.title), be("span", `${Vg(se)} · added by ${se.added.toLocaleString()} ${se.added === 1 ? "player" : "players"}${He}`)), he.append(ft, fr("release-link:" + se.id, "Copy link", () => Ht(se.id), "tiny", e.changed)), n.sales) {
          const Ke = Cn("Price", () => Ne(se.id, "price", Me > 0n ? Bi(Me) : ""), "tiny");
          Ke.setAttribute("aria-expanded", String((de == null ? void 0 : de.id) === se.id && de.what === "price")), he.append(Ke);
        }
        if (n.copies && e.copies) {
          const Ke = Cn("Send copies", () => Ne(se.id, "copies"), "tiny");
          Ke.setAttribute("aria-expanded", String((de == null ? void 0 : de.id) === se.id && de.what === "copies")), he.append(Ke);
        }
        if (H.push(he), (de == null ? void 0 : de.id) !== se.id) continue;
        const vt = be("div", "", "ppp-release-way");
        if (de.what === "price" && n.sales) {
          const Ke = Cn("Sign this price", () => void Pe(z, se), "primary");
          Ke.disabled = !!o, vt.append(
            be("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            re,
            Ke
          );
        } else de.what === "copies" && n.copies && e.copies && vt.append(...e.copies(z, { id: se.id, title: se.title }));
        vt.childNodes.length && H.push(vt);
      }
    }
    return H;
  }
  return { sync: q, albums: m, banner: N, manage: W, fold: Zt, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(R != null && R.songs) && !!e.main()), enabled: () => t === !0 };
}
const Ju = "xtrata.radio.replace.v1", Tn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, io = (e, t, n = "") => {
  const r = Tn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Xg = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function GL(e) {
  let n = (() => {
    try {
      const v = JSON.parse(e.store.get(Ju) || "null");
      return v && typeof v.old == "string" ? v : null;
    } catch {
      return null;
    }
  })();
  const r = (v) => {
    n = v, e.store.set(Ju, v ? JSON.stringify(v) : null), e.changed();
  };
  let o = null, s = !1, i = "", a = !1;
  function c(v) {
    s || (o == null ? void 0 : o.for) === v && (o.n !== null || Date.now() - o.at < 3e4) || (s = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(v) + "&limit=1").then(
      (x) => {
        o = { for: v, n: Number.isSafeInteger(x == null ? void 0 : x.total) ? x.total : null, at: Date.now() };
      },
      () => {
        o = { for: v, n: null, at: Date.now() };
      }
    ).finally(() => {
      s = !1, e.changed();
    }));
  }
  const u = () => !!n, h = () => !!(n != null && n.removed);
  function d(v) {
    v.listening && (i = "", r({ old: v.listening }));
  }
  const w = () => {
    i = "", r(null);
  };
  function g(v) {
    var _;
    if (!n) return null;
    n.removed && v.listening === n.old && (n = { old: n.old }, e.store.set(Ju, JSON.stringify(n)));
    const x = [], L = (Y, ce) => x.push(Tn("p", `Replacing your old player · step ${Y} of 3 · ${ce}`, "ppp-cyan")), B = () => io("Stop · keep my old player", w, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return w(), null;
      x.push(Tn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? x.push(Tn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), io("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && x.push(Tn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const Y = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return x.push(Tn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${Y}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), x.push(io("Done", w, "quiet")), x;
    }
    if (!v.listening || n.removed)
      return n.removed ? (L(3, "claim your new player"), x.push(Tn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), x.push(io("Hide this", w, "quiet")), x) : null;
    if (c(n.old), v.step === "locked" || v.step === "intro")
      return L(1, "empty it"), x.push(Tn("p", "Unlock your old player so it can be emptied."), io("Unlock my old player", e.unlock, "primary"), B()), x;
    const U = e.keepBoth(v), A = (Y) => (L(1, "empty it"), x.push(Tn("p", Y, "ppp-warn")), U && x.push(io("Keep both players instead", () => {
      w(), U();
    }, "primary")), x.push(B()), x);
    if (v.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((o == null ? void 0 : o.for) !== n.old)
      return L(1, "empty it"), x.push(Tn("p", "Checking what this player has…", "ppp-mute"), B()), x;
    if (o.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (o.n > 0) return A(`This player has ${o.n === 1 ? "an album" : `${o.n} albums`} of its own. Replacing it would leave ${o.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((_ = v.award) == null ? void 0 : _.state) === "claimed" && v.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((Y) => ["prepared", "signed", "unknown", "pending"].includes(String(Y.status))))
      return L(1, "empty it"), x.push(Tn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), B()), x;
    if (v.balance === void 0)
      return L(1, "empty it"), x.push(Tn("p", "Checking what it holds…", "ppp-mute"), B()), x;
    if (v.balance > e.dust(v))
      return L(1, "empty it"), x.push(Tn("p", `It holds ${Xg(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? x.push(io("Send everything back", e.returnAll, "primary")) : x.push(Tn("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), x.push(B()), x;
    L(2, "remove it from this device"), x.push(Tn("p", v.balance > 0n ? `Empty ✓ (the ${Xg(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), x.push(Tn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const T = io(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (Y) => {
        i = /cancel/i.test((Y == null ? void 0 : Y.message) || "") ? "" : (Y == null ? void 0 : Y.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return T.disabled = a || !!v.busy, x.push(T, B()), i && x.push(Tn("p", i, "ppp-warn")), x;
  }
  return { active: u, claiming: h, start: d, stop: w, lines: g };
}
const KL = [
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
function VL(e) {
  for (const [t, n] of KL) if (n.test(e)) return t;
  return null;
}
const Hb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), Db = (e) => /Android/.test(e);
function XL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : Hb(t) ? "x-safari-" + n.href : Db(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const YL = (e) => Hb(e) ? "Safari" : Db(e) ? "Chrome" : "your browser", Ni = "Xtrata Music Wallet", qL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Yg(e, t = (n) => n) {
  var s, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((s = e.gate) == null ? void 0 : s.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: Ni, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], o = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of o) {
    const u = e.standIn === c && qL.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Ni} · ${t(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: Ni, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Ni, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Ni, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Ni, detail: "Open on this device." });
    }
  return r;
}
const Qu = "xtrata.radio.novice", Fb = "xtrata.radio.novice.previewed.v1", qg = 6 * 6e4;
function WL(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(Qu, r), n = r;
    else {
      if (r === "0")
        return t.set(Qu, null), { on: !1, preview: !1 };
      n = t.get(Qu);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const ZL = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Wg = (e) => ZL.test(e ?? ""), JL = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, QL = {
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
}, eC = (e, t) => QL[e] ?? t;
function tC(e, t) {
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
const nC = "Make your player once, with Face ID or your fingerprint, and the music starts.", rC = "Checking your player…", df = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function jb(e) {
  try {
    const t = JSON.parse(e.get(Fb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function sC(e, t) {
  const n = jb(e).filter((r) => r !== t);
  n.push(t), e.set(Fb, JSON.stringify(n.slice(-50)));
}
function ed(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...df(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : df();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > qg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > qg ? { ...e, phase: "done" } : e;
  }
}
const zc = (e) => e.phase === "open" || e.phase === "playing";
function oC(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const iC = [100, 250, 500, 1e3], aC = (e, t = Rr) => BigInt(e) * On(t);
function cC(e, t = Rr, n = 0n) {
  const r = As - e - n;
  return r > 0n ? Number(r / On(t)) : 0;
}
function lC(e, t = Rr, n = 0n) {
  const r = e === void 0 ? 0 : cC(e, t, n);
  return iC.map((o) => ({ plays: o, stx: aC(o, t), fits: e !== void 0 && o <= r }));
}
const uC = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, dC = (e) => uC[e.unit](e.amount), Yt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, el = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function fC(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${el(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${el(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${el(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function hC(e) {
  let t = null, n = 0, r = "stx";
  const o = (i) => {
    var c;
    if (i.some((u) => u.plays === n && u.fits)) return;
    const a = i.filter((u) => u.fits);
    n = ((c = a.find((u) => {
      var h;
      return u.plays === ((h = i[1]) == null ? void 0 : h.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function s() {
    var g;
    if (!t) return;
    const i = e.input();
    if (!i) {
      t.close();
      return;
    }
    const a = lC(i.balance, i.fee, i.incoming);
    o(a);
    const c = oC(i.switches);
    (g = c.find((v) => v.id === r)) != null && g.on || (r = "stx");
    const u = [], h = Yt("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Yt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${el(i.playsLeft, "play", "plays")} left.`));
    const d = fC(i.done);
    if (d && u.push(Yt("p", "ppp-restock__done", d)), i.arriving)
      u.push(Yt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      u.push(Yt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((v) => v.fits))
      u.push(Yt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const v = Yt("div", "ppp-restock__packs");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How many plays");
      for (const B of a) {
        const U = Yt("button", "ppp-restock__pack" + (B.plays === n ? " is-on" : ""));
        U.type = "button", U.disabled = !B.fits, U.setAttribute("aria-pressed", String(B.plays === n)), U.append(Yt("b", "", B.plays.toLocaleString()), Yt("span", "", "plays")), U.onclick = () => {
          n = B.plays, s();
        }, v.append(U);
      }
      u.push(v);
      const x = Yt("div", "ppp-restock__ways");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How to pay");
      for (const B of c) {
        const U = Yt("button", "ppp-restock__way" + (B.id === r ? " is-on" : ""));
        U.type = "button", U.disabled = !B.on, U.setAttribute("aria-pressed", String(B.id === r)), U.append(Yt("b", "", B.label), Yt("span", "", B.on ? B.blurb : "Soon")), U.onclick = () => {
          r = B.id, s();
        }, x.append(U);
      }
      u.push(x);
      const L = a.find((B) => B.plays === n);
      if (L && r === "stx") {
        const B = Yt("div", "ppp-restock__pay"), U = dC({ unit: "microSTX", amount: L.stx }), A = Yt("p", "ppp-restock__amount");
        A.append("Send ", Yt("b", "", U), " to your player:"), B.append(A, Yt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = Yt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => Pr(L.stx), "")), B.append(T), B.append(Yt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(B);
      }
    }
    u.push(Yt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = Yt("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), u.push(w), t.replaceChildren(...u);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Yt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
      const i = t;
      i.addEventListener("close", () => {
        i.remove(), t === i && (t = null);
      }), i.addEventListener("click", (a) => {
        a.target === i && i.close();
      }), document.body.appendChild(i), s(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: s,
    close() {
      t == null || t.close();
    }
  };
}
const ks = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), pC = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function gC(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const o of Array.isArray(e) ? e : []) {
    const s = Number(o == null ? void 0 : o.id);
    if (!Number.isSafeInteger(s) || s < 0 || n.has(s)) continue;
    n.add(s);
    const i = t(s, { title: typeof o.title == "string" ? o.title : void 0, artist: typeof o.artist == "string" ? o.artist : void 0 });
    r.push({ id: s, title: pC(i.title) ? `#${s}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((o, s) => o.id - s.id);
}
function yC(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = ks(n.artist), o = t.get(r);
    o ? o.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function wC(e, t, n = "", r = 60) {
  const o = ks(t).split(/\s+/).filter(Boolean), s = ks(n);
  if (!o.length && !s) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = ks(a.artist), u = ks(a.title), h = String(a.id);
    if (s && c !== s) continue;
    let d = 0, w = !0;
    for (const g of o) {
      const v = g.replace(/^#/, "");
      if (u.includes(g)) d += u.startsWith(g) ? 0 : 1;
      else if (/^\d+$/.test(v) && h === v) d += 0;
      else if (c.includes(g)) d += 2;
      else if (/^\d+$/.test(v) && h.startsWith(v)) d += 3;
      else {
        w = !1;
        break;
      }
    }
    w && i.push({ s: a, rank: d });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const Sr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Zg = 12;
function mC(e, t) {
  let n = null, r = "idle", o = "", s = "", i = !1;
  const a = Sr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = Sr("div", "hint"), u = Sr("div", "find-artists"), h = Sr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = Sr("div", "likesTools");
  d.append(a), e.replaceChildren(d, c, u, h), a.oninput = () => {
    o = a.value, g();
  };
  function w() {
    r === "loading" || r === "ready" || (r = "loading", g(), t.load().then((v) => {
      n = v, r = "ready", g();
    }, () => {
      r = "failed", g();
    }));
  }
  function g() {
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
      const T = Sr("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", w();
      }, c.append(T), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const x = yC(n), L = i ? x : x.slice(0, Zg), B = (T, _, Y, ce = "") => {
      const ne = Sr("button", "find-chip" + (_ ? " is-on" : ""), T);
      return ne.type = "button", ne.setAttribute("aria-pressed", String(_)), ce && (ne.title = ce), ne.onclick = Y, ne;
    };
    u.replaceChildren(
      ...L.map((T) => B(`${T.name} · ${T.songs}`, ks(T.name) === ks(s), () => {
        s = ks(T.name) === ks(s) ? "" : T.name, g();
      }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`)),
      ...x.length > Zg ? [B(i ? "Fewer artists" : `All ${x.length} artists`, !1, () => {
        i = !i, g();
      })] : []
    );
    const U = wC(n, o, s), A = t.current();
    h.replaceChildren(...U.songs.map((T) => {
      var ce, ne;
      const _ = Sr("li", "lrow" + (T.id === A ? " now" : "")), Y = Sr("button", "lt", T.title);
      if (Y.type = "button", Y.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, Y.onclick = () => t.play(T.id), (ce = t.explicit) != null && ce.call(t, T.id)) {
        const q = Sr("span", "exp", "E");
        q.title = "Explicit lyrics: only plays when you choose it", Y.append(" ", q);
      }
      if ((ne = t.liked) != null && ne.call(t, T.id)) {
        const q = Sr("span", "find-liked", "♥");
        q.title = "You like this song", q.setAttribute("role", "img"), q.setAttribute("aria-label", "Liked"), _.append(Y, q);
      } else _.append(Y);
      return _.append(Sr("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), _;
    })), c.textContent = !o.trim() && !s ? `${n.length.toLocaleString()} songs by ${x.length.toLocaleString()} artists. Search, or pick an artist.` : U.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : U.total > U.songs.length ? `Showing ${U.songs.length} of ${U.total.toLocaleString()}. Type more to narrow it down.` : `${U.total} ${U.total === 1 ? "song" : "songs"}${s ? ` by ${s}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: g };
}
const Jg = (e, t, n) => $f(Cf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), bC = 317, xC = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 1 && e <= 999999999, SC = 15 * 6e4, vC = (e) => /iPhone|iPad|iPod/.test(e.userAgent) || /Macintosh/.test(e.userAgent) && e.maxTouchPoints > 1;
function td(e, t) {
  return e.standalone ? null : t ? "prompt" : vC(e) ? "ios" : null;
}
const Di = {
  label: "Add to Home Screen",
  title: "Add it to your Home Screen",
  body: "Your phone only lets you do this from its own menu. It takes a few taps:",
  close: "Got it"
};
function AC(e) {
  var n;
  return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(e) ? "other" : Number(((n = /Version\/(\d+)/.exec(e)) == null ? void 0 : n[1]) ?? 0) >= 26 ? "safari-dots" : "safari";
}
function EC(e) {
  return e === "safari-dots" ? { steps: ["Tap ••• at the bottom right of your screen", "Tap Share", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom-right" } : e === "safari" ? { steps: ["Tap the Share button at the bottom of your screen (a square with an arrow)", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom" } : { steps: ["Tap the Share button beside the address bar (a square with an arrow)", "Tap “Add to Home Screen”", "Tap Add"], where: "top-right" };
}
const cr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, kC = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("viewBox", "0 0 26 26"), t.setAttribute("aria-hidden", "true");
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return n.setAttribute("d", e), t.append(n), t;
};
function $C(e, t, n = "safari") {
  const r = EC(n), o = cr("div", "a2hs-sheet a2hs-sheet--" + r.where);
  o.setAttribute("role", "dialog"), o.setAttribute("aria-modal", "true"), o.setAttribute("aria-label", Di.title);
  const s = cr("div", "a2hs-card"), i = cr("div", "a2hs-head"), a = cr("img", "a2hs-icon");
  a.src = e, a.alt = "";
  const c = cr("div");
  c.append(cr("h2", "", Di.title), cr("p", "", Di.body)), i.append(a, c);
  const u = cr("ol", "a2hs-steps");
  r.steps.forEach((w, g) => {
    const v = cr("li");
    v.append(cr("i", "", String(g + 1)), cr("span", "", w)), u.append(v);
  });
  const h = cr("div", "a2hs-arrow");
  h.setAttribute("aria-hidden", "true"), h.append(kC(r.where === "top-right" ? "M13 22V5M6 12l7-7 7 7" : "M13 4v17M6 14l7 7 7-7"));
  const d = cr("button", "a2hs-close", Di.close);
  return d.type = "button", d.onclick = t, s.append(i, u, d), o.append(s, h), o.onclick = (w) => {
    w.target === o && t();
  }, o;
}
function IC(e) {
  let t = null, n = null, r = !1;
  const o = () => {
    n == null || n.remove(), n = null, e.button.focus();
  }, s = () => {
    const i = r ? null : td(e.env(), !!t);
    e.button.hidden = !i, e.button.dataset.kind = i ?? "";
  };
  return e.button.setAttribute("aria-label", Di.label), e.button.title = Di.label, e.button.onclick = () => {
    var a;
    const i = td(e.env(), !!t);
    if (i === "prompt" && t) {
      const c = t;
      t = null;
      try {
        c.prompt();
      } catch {
      }
      s();
      return;
    }
    i === "ios" && !n && (n = $C(e.icon, o, AC(e.env().userAgent)), e.mount.append(n), (a = n.querySelector(".a2hs-close")) == null || a.focus());
  }, e.target.addEventListener("beforeinstallprompt", (i) => {
    i.preventDefault(), t = i, s();
  }), e.target.addEventListener("appinstalled", () => {
    r = !0, t = null, o(), s();
  }), s(), { sync: s, kind: () => r ? null : td(e.env(), !!t) };
}
const Qg = document.getElementById("ppp");
Qg && LC(Qg);
function LC(e) {
  var $n;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = g1(), o = (l) => e.querySelector(l), s = o(".ppp-frame");
  let i = null;
  const a = async (l, p) => {
    const y = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await y.json().catch(() => ({}));
    if (!y.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${y.status}).`);
    return f;
  }, c = X5({
    now: Date.now,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    config: (l) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(l || "")),
    links: async (l) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(l))).links ?? [],
    mainOf: async (l) => {
      var y;
      const p = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(l))).links;
      return ((y = p == null ? void 0 : p.find((f) => f.listening === l)) == null ? void 0 : y.main) ?? null;
    },
    saveLink: async (l) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(l) });
    },
    bridge: async (l) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${l}; publickey-credentials-create ${l}`), i.referrerPolicy = "no-referrer";
      const p = new Promise((ae, Ee) => {
        i.addEventListener("load", () => ae(), { once: !0 }), setTimeout(() => Ee(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", s.replaceChildren(i), await p;
      const y = new i1({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), j = (ae, Ee) => f.has(ae) ? y.request(ae, Ee) : Promise.race([
        y.request(ae, Ee),
        new Promise((Ae, Ce) => setTimeout(() => Ce(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await j("listening.status"), { request: j };
    },
    chain: {
      verify: $5,
      balance: L5,
      account: I5,
      owner: C5,
      broadcast: T5,
      transaction: B5,
      confirmedNonce: async (l) => {
        const p = await go(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => ju({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, y) => new Promise((f, j) => ug({
      recipient: p,
      amount: y.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new nd(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ae) => f(ae.txId || ""),
      onCancel: () => j(new Error("Deposit cancelled. Nothing was sent.")),
      onError: j
    })),
    validate: N5,
    tabLock: (l) => new Promise((p) => {
      const y = navigator.locks;
      if (!(y != null && y.request)) {
        p(!0);
        return;
      }
      y.request("xtrata-ppp:" + l, { ifAvailable: !0 }, async (f) => {
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
    changed: () => ct(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var p, y;
      return v.funder(l, () => H5(l, go), !!((y = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && y.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const p = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), y = p == null ? void 0 : p.gift;
      if (!y) return null;
      if (typeof y.returnTo != "string" || typeof y.treasury != "string") throw new Error("Unreadable gift record.");
      return {
        returnTo: y.returnTo,
        from: typeof y.from == "string" ? y.from : null,
        source: String(y.source ?? ""),
        amount: String(y.amount ?? "0"),
        treasury: y.treasury,
        state: y.state === "sending" ? "sending" : "arrived",
        player: y.player ?? null,
        ...y.drop === "players" || y.drop === null ? { drop: y.drop } : {}
      };
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
      const y = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: l, name: p }) });
      if (typeof (y == null ? void 0 : y.record) != "string" || typeof (y == null ? void 0 : y.signature) != "string" || !Number.isSafeInteger(y == null ? void 0 : y.cls) || !Number.isSafeInteger(y == null ? void 0 : y.number) || !Number.isSafeInteger(y == null ? void 0 : y.plays)) throw new Error("Unreadable award note.");
      return { cls: y.cls, number: y.number, plays: y.plays, record: y.record, signature: y.signature, name: typeof y.name == "string" ? y.name : null };
    },
    history: (l, p) => j5(l, (y) => go(y), p),
    likesChanged: () => {
      var l, p;
      (p = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || p.call(l);
    },
    likeState: async (l, p) => {
      const y = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(p) })), f = Array.isArray(y == null ? void 0 : y.rows) ? y.rows.find((j) => (j == null ? void 0 : j.id) === p) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((j) => typeof j == "string") : f.liked ? [l] : [] };
    },
    likeSent: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: p } })),
    nameOf: (l) => wt(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), u = (l, p, y, f, j, ae) => new Promise((Ee, Ae) => ug({
    recipient: f,
    amount: j.toString(),
    memo: ae,
    stxAddress: y,
    network: new nd(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Ce) => Ee(Ce.txId || ""),
    onCancel: () => Ae(new Error(p)),
    onError: Ae
  })), h = (l) => v.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, d = (l) => h(l) && l.canForget ? () => {
    w.start(l), ct(c.snapshot());
  } : null, w = GL({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => ve(l),
    changed: () => ct(c.snapshot()),
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
  }), g = () => ({ quick: !!v.incomingStarter(), ...w.claiming() ? { another: !0 } : {} }), v = eL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, p, y, f) => u("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, p, y, f),
    sign: (l, p) => ju({ ...p, network: "mainnet", stxAddress: l }),
    giftSent: (l, p) => c.giftSent(l, p),
    claiming: (l) => c.giftClaiming(l),
    batchDays: () => {
      var l, p;
      return (p = (l = c.snapshot().gate) == null ? void 0 : l.gifts) == null ? void 0 : p.batchDays;
    },
    claimNew: (l) => h(l),
    replaceOld: (l) => d(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, p, y, f) => {
      x.invalidate(), await c.albumArriving(l, p, y, f);
    } },
    who: (l) => ve(l),
    changed: () => ct(c.snapshot()),
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
  }), x = uL({
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
    changed: () => ct(c.snapshot())
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
  }, B = WL(location.search, L);
  B.on && (document.documentElement.dataset.novice = B.preview ? "preview" : "1");
  const U = (l) => B.on && l.solo, A = B.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), T = A ? document.getElementById("album") : null, _ = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, Y = T ? Gg(T, _) : null, ce = zL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, p) => ju({ ...p, network: "mainnet", stxAddress: l }),
    signShelf: (l, p) => c.signShelf(l, p),
    pay: (l, p, y, f) => u("Xtrata Music · album", "Payment cancelled. Nothing was sent.", l, p, y, f),
    copies: (l, p) => {
      var y;
      return v.copies(l, p, ((y = c.snapshot().gate) == null ? void 0 : y.radioUrl) ?? null);
    },
    player: () => {
      const l = c.snapshot(), p = l.slot === 0 ? l.listening : l.root;
      return { address: p, unlocked: !!p && ["ready", "fund", "over", "link"].includes(l.step) };
    },
    open: (l) => mr(l, !0),
    who: (l) => ve(l),
    art: { song: (l, p) => p && Th(String(l)) || Fg(String(l)), cover: (l) => Qc(l) },
    audition: CL({
      changed: () => ct(c.snapshot()),
      quiet: () => {
        var p;
        const l = window.XtrataRadio;
        try {
          (p = l == null ? void 0 : l.getState) != null && p.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => ct(c.snapshot()),
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
  }), ne = () => {
    const l = new Set(yn.map((p) => p.id));
    return [...yn, ...ce.albums().filter((p) => !l.has(p.id))];
  }, q = T ? PL(T) : null, m = "xtrata.radio.award.later.v1";
  let I = "ready", N = !1, P = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(m) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), W = !1;
  const R = "xtrata.radio.tier.v1";
  let le = (() => {
    const l = L.get(R);
    return Dc(l) ? Fo(l) : null;
  })();
  const ue = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function Xe(l) {
    var j;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let ae = null;
      try {
        ae = l.gift && !l.gift.player && l.gift.drop === "players" ? VI(BigInt(l.gift.amount)) : null;
      } catch {
        ae = null;
      }
      ((j = l.award) == null ? void 0 : j.state) === "claimed" && l.award.holds === !1 && (ae = null), ((ae == null ? void 0 : ae.id) ?? null) !== ((le == null ? void 0 : le.id) ?? null) && (le = ae, L.set(R, ae ? ae.id : null));
    }
    const p = document.documentElement;
    le ? p.dataset.tier = le.id : delete p.dataset.tier;
    const y = document.querySelector("#ppp .ppp-head h3");
    if (!y) return;
    let f = y.querySelector(".ppp-tier");
    if (!le) {
      f == null || f.remove();
      return;
    }
    f || (f = $("span", "", "ppp-tier"), y.append(f)), f.dataset.tier = le.id, f.textContent = `${le.mark} ${le.name.toUpperCase()} PLAYER`, f.title = `A ${le.name} player from the Xtrata Music giveaway`;
  }
  const C = (() => {
    var l;
    try {
      return !!((l = window.matchMedia) != null && l.call(window, "(display-mode: standalone)").matches) || navigator.standalone === !0;
    } catch {
      return !1;
    }
  })(), F = document.getElementById("a2hs");
  F && IC({
    button: F,
    icon: "/radio/icons/app-192.png",
    mount: document.body,
    target: window,
    env: () => ({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints || 0, standalone: C })
  });
  let re = B.on ? bC : null, de = !1, Ne = 0, Pe = "";
  B.on && a("/radio/giveaway/players/intro").then((l) => {
    const p = l && l.song === null ? null : xC(l == null ? void 0 : l.song) ? l.song : re;
    p !== re && !de && (re = p, ct(c.snapshot()));
  }).catch(() => {
  });
  const Ht = (() => {
    try {
      const l = Number(new URLSearchParams(location.search).get("n"));
      Number.isSafeInteger(l) && l >= 1 && l <= 1e5 && sessionStorage.setItem("xtrata.radio.spot", String(l));
      const p = Number(sessionStorage.getItem("xtrata.radio.spot"));
      return Number.isSafeInteger(p) && p >= 1 ? p : null;
    } catch {
      return null;
    }
  })(), Ge = (l) => {
    var f, j, ae;
    if (!de || re === null) return !1;
    if (Date.now() - Ne > SC || l.step === "ready")
      return l.step !== "ready" && (de = !1), !1;
    const p = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), y = Number((ae = p == null ? void 0 : p.nowPlaying) == null ? void 0 : ae.tokenId);
    return Date.now() - Ne < 2e4 && !Number.isSafeInteger(y) ? !0 : y !== re ? (de = !1, !1) : !0;
  };
  function _e() {
    const l = window.XtrataRadio;
    if (!(re === null || !(l != null && l.playToken))) {
      de = !0, Ne = Date.now(), c.holdFirstPlay(), ct(c.snapshot());
      try {
        l.playToken(re);
      } catch {
        de = !1;
      }
    }
  }
  const Ue = () => {
    var f, j;
    if (!de || re === null) return null;
    const l = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), p = l != null && l.nowPlaying && Number(l.nowPlaying.tokenId) === re ? l.nowPlaying : null, y = G.get(re);
    return { title: (p == null ? void 0 : p.title) || (y == null ? void 0 : y.title) || "", artist: (p == null ? void 0 : p.artist) || (y == null ? void 0 : y.artist) || "", art: `/radio/artwork?id=${re}`, playing: !!(l != null && l.playing) };
  }, _t = B.on && T ? bL(T) : null, kn = Date.now();
  let ut = !1, Zt = null, $t = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const z = () => {
    $t = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    ct(c.snapshot());
  }, H = (l, p) => {
    var ae;
    if (!_t || p || $t) return null;
    if (!l.gate || l.step === "loading" || (ut = !0), !ut) return Date.now() - kn < 1e4 ? "checking" : null;
    if (!U(l) || w.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((ae = l.gift) != null && ae.player), j = f && !l.entries.some((Ee) => Ee.kind === "play");
    return l.step === "fund" && j ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (Zt === "landed" || Zt === "arriving" && (j || de)) ? "landed" : l.step === "loading" && Zt !== "checking" ? Zt : null;
  };
  let Q = !1;
  function se(l, p, y = [], f) {
    if (!_t) return;
    const j = f !== void 0 ? f : H(l, p);
    if (Zt = j, delete document.documentElement.dataset.noviceBoot, !j) {
      _t.render(null, p);
      return;
    }
    const ae = [...y];
    j === "arriving" && l.arrival && ae.push(Cr(l.arrival)), l.step === "unsupported" ? ae.push($("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && ae.push($("p", l.error, "ppp-warn"));
    const Ee = j === "gift" ? v.incomingStarter() : null;
    Ee && re === null && !Q && l.step === "intro" && !l.busy && !l.armed && !l.error && !er && (Q = !0, c.create({ quick: !0, ...w.claiming() ? { another: !0 } : {} })), _t.render({
      mode: j,
      status: ae,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !er,
      plays: Ee ? Ee.plays : j === "landed" ? l.playsLeft : null,
      from: (Ee == null ? void 0 : Ee.from) ?? null,
      tier: le,
      mystery: ue,
      spot: Ht,
      installed: C,
      intro: Ee && re !== null && l.step === "intro" ? { ready: !0 } : null,
      now: Ue(),
      albums: j === "landed" ? yn.map((Ae) => ({ title: Ae.title, by: Ae.subtitle, cover: Qc(Ae.cover), run: () => {
        z(), mr(Ae, !0);
      } })) : [],
      claimNew: j === "back" ? h(l) : null,
      replaceOld: j === "back" ? d(l) : null,
      start: () => {
        Ee && re !== null && _e(), c.create(g());
      },
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Me(),
      full: () => {
        var Bt, pt, ot;
        const Ae = window.XtrataRadio, Ce = j === "landed" && !((pt = (Bt = Ae == null ? void 0 : Ae.getState) == null ? void 0 : Bt.call(Ae)) != null && pt.playing);
        de = !1, z(), Ce && ((ot = Ae == null ? void 0 : Ae.playPause) == null || ot.call(Ae));
      }
    });
  }
  _t && setTimeout(() => {
    ut || ct(c.snapshot());
  }, 10100), Ih(() => {
    (_t != null && _t.showing() || document.documentElement.dataset.asking || ce.wantsArt()) && ct(c.snapshot());
  });
  const ft = hC({
    input: () => {
      var j, ae, Ee, Ae;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (j = l.likeFunds) == null ? void 0 : j.balance };
      if (!p.address) return null;
      const y = l.slot === 0 ? l.entries : [], f = y.filter((Ce) => Ce.kind === "play" && Ce.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : Te(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((ae = l.gate) == null ? void 0 : ae.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((Ee = l.gate) == null ? void 0 : Ee.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Ce) => Ce.recipient)).size, likes: y.filter((Ce) => Ce.kind === "like" && Ce.status === "confirmed" && Ce.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((Ae = l.likeFunds) != null && Ae.pending)
      };
    },
    copyButton: (l, p, y, f) => fr(l, p, y, f, () => {
      ct(c.snapshot());
    })
  }), Me = () => {
    if (!c.snapshot().unproven) {
      ft.open();
      return;
    }
    c.prove().then((l) => {
      l && ft.open();
    });
  }, He = document.getElementById("albumList"), vt = He ? Gg(He, _, { list: !0 }) : null, Ke = "xtrata.radio.album.last.v1", $e = () => {
    try {
      const l = JSON.parse(localStorage.getItem(Ke) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let Ze = "";
  const Ye = (l) => {
    const p = JSON.stringify(l);
    if (p !== Ze) {
      Ze = p;
      try {
        localStorage.setItem(Ke, p);
      } catch {
      }
    }
  };
  let Ve = null;
  window.XtrataRadioLikeHandler = (l) => {
    var y;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (y = c.snapshot().likeFunds) != null && y.album && (O = !0), Vn();
    const p = Nn(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let Dt;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const gn = (l) => {
    var y, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== Dt && (Dt = p, (f = (y = window.XtrataRadio) == null ? void 0 : y.refreshLikes) == null || f.call(y));
  };
  let yn = [], Kn = 0, It = !1, dn = null;
  const Ir = (l) => {
    var p, y;
    It || !((y = (p = l.gate) == null ? void 0 : p.gifts) != null && y.enabled) || Date.now() - Kn < 6e4 || (Kn = Date.now(), a("/radio/gift/featured").then((f) => {
      yn = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((j) => j && typeof j.id == "string" && typeof j.title == "string" && Array.isArray(j.tracks) && j.tracks.length > 0).slice(0, 6), It = !0, yn.length && ct(c.snapshot());
    }).catch(() => {
    }));
  }, zr = (l) => {
    var p;
    return dn && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? dn : null;
  }, mr = (l, p = !1) => {
    var f, j;
    dn = l, ct(c.snapshot());
    const y = l && p ? Dr(l)[0] : null;
    y && ((j = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || j.call(f, y.id));
  };
  let xt = df(), wn = null;
  const Ft = (l) => {
    const p = B.preview && !er && l.step === "intro" ? v.incomingAlbum() : null;
    return p ? (xt = ed(xt, { kind: "offer", album: p.player.id, already: jb(L).includes(p.player.id) }), zc(xt) ? p.player : null) : (xt = ed(xt, { kind: "withdraw" }), null);
  }, mn = (l) => {
    const p = xt.phase;
    xt = ed(xt, l), xt.phase !== p && (xt.album && (xt.phase === "playing" || xt.phase === "done") && sC(L, xt.album), ct(c.snapshot()));
  };
  setInterval(() => {
    xt.phase === "playing" && mn({ kind: "tick", at: Date.now() });
  }, 5e3);
  let kt = "", Kt, Gr = !1, ls = !1;
  const E = (l, p) => {
    var qe, je, Nt, qn, sr, _s, ys, Si;
    const y = window.XtrataRadio;
    if (!(y != null && y.setGiftPlayer) || !(y != null && y.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((qe = l.giftStop) == null ? void 0 : qe.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, j = wn, ae = Ge(l), Ee = f ? U(l) ? eC(f.reason, f.text) : f.text : null, Ae = j || ae ? null : Ee ?? (t && (!((je = l.gate) != null && je.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    Ae && Ae !== Kt && (y.setGiftStop(Ae), Kt = Ae);
    const Ce = l.step === "off" || l.step === "elsewhere" ? null : ((Nt = l.gift) == null ? void 0 : Nt.player) ?? j ?? zr(l) ?? null, Bt = Ce ? Ce.id + ":" + Ce.cover + ":" + Ce.tracks.map((Dn) => Dn.id).join(",") : "";
    Bt !== kt && (y.setGiftPlayer(Ce ? { id: Ce.id, title: Ce.title, subtitle: Ce.subtitle, tracks: Dr(Ce).map((Dn) => Dn.id), hidden: ((qn = GI(Ce)) == null ? void 0 : qn.id) ?? null, cover: Ce.cover } : null), kt = Bt), Ae !== Kt && (y.setGiftStop(Ae), Kt = Ae);
    const pt = !ae && (f == null ? void 0 : f.reason) === "arriving";
    pt !== ls && ((sr = y.setGiftWait) == null || sr.call(y, pt), ls = pt);
    const ot = !!Ce && (!!j || !!((_s = l.albumLock) != null && _s.locked));
    ot !== Gr && ((ys = y.setGiftLock) == null || ys.call(y, ot), Gr = ot), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((Si = y.forgetWallets) == null || Si.call(y));
  };
  let O = !1;
  const K = /* @__PURE__ */ new Map(), D = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let y = K.get(l.listening);
    return y === void 0 && (y = Date.now(), K.set(l.listening, y)), Date.now() - y < Il ? y : null;
  }, J = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && K.has(l.listening), ee = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", Te = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > an ? Number((l - an) / p) : 0;
  }, ke = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), Fe = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, ht = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, $ = (l, p = "", y = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), y && (f.className = y), f;
  }, pe = (l, p, y = "") => {
    const f = $("button", l, y);
    return f.type = "button", f.onclick = p, f;
  }, ze = (l, p) => {
    const y = $("a", l);
    return y.href = p, y.target = "_blank", y.rel = "noopener", y;
  };
  let dt = null, Vt = location.hash === "#give";
  Vt && history.replaceState(null, "", location.pathname + location.search);
  let jt = !1;
  const fn = TI((l) => CI({ address: l, network: "mainnet" }), () => ct(c.snapshot())), wt = (l) => fn.get(l), er = VL(navigator.userAgent), Kr = (l, p) => {
    const y = navigator.userAgent, f = YL(y), j = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, ae = [$("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${B.on ? "player" : "listening wallet"}${p ? B.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], Ee = $("div", "", "ppp-open-row"), Ae = XL(j, y);
    if (Ae) {
      const Ce = $("a", `Open in ${f}`, "primary ppp-open-in");
      Ce.href = Ae, Ce.dataset.homeAction = "radio:open-in-browser", Ee.append(Ce);
    }
    return Ee.append(fr("copy-page-link", "Copy link", () => j, Ae ? "" : "primary", () => ct(c.snapshot()))), ae.push(Ee, $("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), ae;
  }, ve = (l) => wt(l) ?? ee(l), Jt = (l) => l.slice(0, 2).map(ve).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), bo = /* @__PURE__ */ new Map();
  let tr = !1;
  const xo = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), Vn = () => {
    tr || (tr = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const y = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(y) && bo.set(y, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      ct(c.snapshot());
    }).catch(() => {
      tr = !1;
    }));
  }, Nn = (l, p) => {
    const y = bo.get(l), f = Lg(l, [y == null ? void 0 : y.title, p == null ? void 0 : p.title].find((ae) => !xo(ae)) || ""), j = $g(l, (y == null ? void 0 : y.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: j };
  }, bn = (l) => {
    const { title: p, artist: y } = Nn(l.song, l);
    return p ? `“${p}”${y ? ` — ${y}` : ""}` : `Song #${l.song}${y ? ` — ${y}` : ""}`;
  }, Ts = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, So = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function yi(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Mn(l, p, y = "", f) {
    const j = $("dt", l), ae = $("dd", p, y);
    return f && ae.append(" ", f), [j, ae];
  }
  const nr = document.getElementById("ppp-top"), us = () => {
    window.dispatchEvent(new CustomEvent("xtrata:radio-panel")), (s.hidden || s.classList.contains("ppp-frame--rest") ? e : s).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, Vr = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, Xn = () => {
    var p, y;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      Vr();
      return;
    }
    if (l.step === "elsewhere" && ((p = l.gate) != null && p.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((y = l.giftStop) == null ? void 0 : y.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      Me();
      return;
    }
    us();
  };
  nr && (nr.onclick = Xn);
  const vo = (l, p, y, f = "") => l.standIn && !l.mainConnected ? pe(`Connect ${ve(l.standIn)} to add STX`, Vr, f) : pe(p, y, f), Ao = (l) => {
    c.useLinked(l).then(() => us());
  };
  let ds = null;
  const Bs = () => {
    const l = Yg(c.snapshot(), ve);
    return l.length ? ds || (ds = new Promise((p) => {
      var pt;
      const y = $("dialog", "", "ppp-connect");
      y.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const j = (ot) => {
        f = ot, y.close();
      };
      y.addEventListener("close", () => {
        y.remove(), ds = null, p(f);
      }), y.addEventListener("click", (ot) => {
        ot.target === y && j(null);
      });
      const ae = (ot, qe, je, Nt, qn = !1) => {
        const sr = $("button", "", "ppp-connect__opt " + je);
        return sr.type = "button", sr.disabled = qn, sr.onclick = Nt, sr.append($("b", ot), $("span", qe)), sr;
      }, Ee = $("h2", "Connect", "ppp-connect__title");
      Ee.id = "ppp-connect-title";
      const Ae = l.map((ot) => ae(ot.label, ot.detail, "is-music", () => {
        if (j("music"), ot.action === "linked" && ot.main) {
          Ao(ot.main);
          return;
        }
        const qe = Yg(c.snapshot(), ve).find((je) => je.action !== "linked");
        (qe == null ? void 0 : qe.action) === "create" ? c.create() : (qe == null ? void 0 : qe.action) === "unlock" && c.unlock(), us();
      }, !!ot.disabled)), Ce = ae("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => j("stacks")), Bt = pe("Cancel", () => j(null), "quiet ppp-connect__cancel");
      y.append(Ee, ...Ae, Ce, Bt), document.body.appendChild(y), y.showModal(), (pt = Ae.find((ot) => !ot.disabled)) == null || pt.focus();
    }), ds) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Bs;
  function fs(l) {
    if (!nr) return;
    const p = (f, j, ae) => {
      nr.hidden = !1, nr.className = "ppp-top" + (j ? " is-" + j : ""), nr.replaceChildren($("span", "", "dot"), document.createTextNode(f)), nr.title = ae;
    }, y = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        nr.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        nr.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${ve(l.linked)}`, "warn", `This device's listening wallet belongs to ${ve(l.linked)}. Connect that wallet to pay artists or like songs.`);
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
        return l.payingOn && y > 0 && !l.giftStop ? p(`${y.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : p("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const un = document.getElementById("pppNudge"), hs = document.getElementById("onair");
  ($n = un == null ? void 0 : un.querySelector("button")) == null || $n.addEventListener("click", () => Xn());
  const wi = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Eo = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  }, Ns = document.getElementById("claimCard");
  let Ms = !1, ps = 0, gs = 0;
  function mi(l) {
    if (!Ns) return;
    const p = (l.step === "intro" || l.step === "connect" || l.step === "elsewhere") && !l.gift;
    p && !Ms && (Ms = !0, a("/radio/giveaway/players").then((f) => {
      (f == null ? void 0 : f.state) !== "open" || typeof f.free != "number" || typeof f.total != "number" || f.free <= 0 || (ps = f.free, gs = f.total, mi(c.snapshot()));
    }).catch(() => {
    })), Ns.hidden = !(p && ps > 0);
    const y = Ns.querySelector(".claim-n");
    y && ps > 0 && (y.textContent = `${ps.toLocaleString()} of ${gs.toLocaleString()} left`);
  }
  function ha(l) {
    if (l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, y = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, j = l.step === "elsewhere" && !t, ae = y || f || j ? "" : wi[l.step] ?? "", Ee = y ? "on" : j ? "free" : ae ? "off" : "";
    Ee ? document.documentElement.dataset.ppp = Ee : delete document.documentElement.dataset.ppp, hs && (hs.hidden = !Ee || Ee === "free", hs.querySelector(".onair-sub").textContent = y ? `${p.toLocaleString()} plays left` : "Plays off"), un && (un.hidden = Ee !== "off" && Ee !== "free", un.classList.toggle("is-free", Ee === "free"), Ee === "free" ? (un.querySelector(".nudge-t").textContent = "You’re on the free player", un.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", un.querySelector("button").textContent = "Get a player") : Ee === "off" && (un.querySelector(".nudge-t").textContent = ae, un.querySelector(".nudge-s").textContent = U(l) ? l.step === "intro" ? nC : "" : "This radio requires a funded listening wallet with music support on.", un.querySelector("button").textContent = Eo[l.step] ?? "Start"));
  }
  let br = "";
  function rr(l) {
    const p = $("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append($("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append($("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const y = $("input");
    y.type = "text", y.placeholder = "SP… address to send returns to", y.autocomplete = "off", y.spellcheck = !1, y.setAttribute("aria-label", "Address to return funds to"), y.value = br, y.oninput = () => {
      br = y.value;
    };
    const f = pe(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(y.value), br = "";
    }, "tiny");
    return p.append(y, " ", f), l.returnToKind === "chosen" && p.append(" ", pe("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const Qt = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Lr() {
    const l = $("p", Qt + " ", "ppp-mute");
    return l.append(ze("Xverse", "https://www.xverse.app/download"), " · ", ze("Leather", "https://leather.io/install-extension")), l;
  }
  let ko = "";
  const Ps = (l) => {
    const p = document.documentElement, y = l.solo && !l.main ? l.listening ? ee(l.listening) : "new" : "", f = J5() ? "1" : "", j = l.standIn && !l.mainConnected ? ve(l.standIn) : "";
    `${y}|${f}|${j}` !== ko && (ko = `${y}|${f}|${j}`, y ? p.dataset.pppSolo = y : delete p.dataset.pppSolo, j ? p.dataset.pppAs = j : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => ct(c.snapshot()), l);
  function $o(l, p = "") {
    const y = $("div", "", "ppp-topup"), f = bi(l);
    y.append($("span", "Add plays from My player: ", "ppp-mute"));
    for (const j of Jc) {
      const ae = pe(`+${j.toLocaleString()}`, () => void c.topUpAlbum(j), p);
      ae.disabled = f === void 0 || f < j || l.depositPending || !!l.busy, y.append(ae);
    }
    return f !== void 0 && f < Jc[0] && y.append($("p", "My player needs plays first (switch to My player above).", "ppp-mute")), y;
  }
  const bi = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const y = p - an - 6000n;
    return y > 0n ? Number(y / l.playCost) : 0;
  };
  function Io(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (O = !1), p.low && !O) return [];
    const y = $("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const j = $("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && j.append(ze("View", ht(p.txid))), y.append(j), [y];
    }
    y.append($("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), y.append($("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), y.append($("p", p.address, "ppp-addr-full"));
    const f = $("div", "", "ppp-open-row");
    if (f.append(fr("copy-likes-address", "Copy address", () => p.address, "primary", () => ct(c.snapshot()))), p.main && !l.solo) {
      const j = As - (p.balance ?? 0n);
      j > 0n && f.append(vo(l, `Pay ${Pr(j)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return y.append(f), y.append($("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [y];
  }
  const Cr = (l) => {
    const p = $("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const y = $("p", "", "ppp-wait-t"), f = $("div", "", "ppp-wait-track");
    return f.append($("div", "", "ppp-wait-fill")), p.append(y, f), Lo(p), p;
  };
  function Lo(l) {
    const p = Number(l.dataset.since), y = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), j = l.querySelector(".ppp-wait-fill"), ae = l.querySelector(".ppp-wait-t");
    if (f < y) {
      const Ee = Math.ceil((y - f) / 1e3);
      j.style.width = Math.max(4, Math.min(95, f / y * 100)).toFixed(0) + "%", ae.textContent = `Loading your plays · ${Ee}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / y * 100)));
    } else
      j.style.width = "", ae.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let Yn = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      Yn = 0;
      return;
    }
    l.forEach(Lo), ++Yn % 10 === 0 && ct(c.snapshot());
  }, 1e3);
  let Co = null;
  function xi(l) {
    if (l.step === "loading" && Co !== null) return;
    const y = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    y !== Co && (Co = y, y ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function ct(l) {
    var Dh, Fh, jh, Rh, zh, Gh, Kh, Vh, Xh, Yh, qh, Wh, Zh, Jh, Qh, ep, tp, np;
    if (ce.sync(), Ve && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const Z = Ve;
      Ve = null, l.root === Z.root && l.slot !== Z.slot && c.openAlbum(Z.slot);
    }
    const p = v.inProgress(l), y = D(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : y !== null ? { ...l, depositPending: !0, arrival: { since: y, graceMs: Il } } : l, j = f.error === Ll;
    if (gn(), Ir(l), Xe(l), wn = Ft(l), E(l, f), xi(f), Ps(f), !p && v.inProgress(l)) return;
    if (fs(f), ha(f), mi(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? B.on ? rC : "Checking your listening wallet…" : B.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      se(f, !1);
      return;
    }
    const [ae, Ee] = yi(f), Ae = o(".ppp-state");
    Ae.textContent = ae, Ae.className = "ppp-state" + (Ee ? " ppp-state--" + Ee : ""), Ae.hidden = !ae;
    const Ce = !!f.busy || f.armed, Bt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Ce || !["intro", "loading"].includes(f.step));
    s.hidden = !Bt, s.classList.toggle("ppp-frame--rest", !Ce && !jt);
    const pt = o(".ppp-frame-label");
    pt.hidden = !0;
    const ot = Y5(f) ?? dt;
    dt = ot;
    const qe = "xtrata.radio.ppp.heard.v1", je = (() => {
      try {
        return localStorage.getItem(qe) === "1";
      } catch {
        return !1;
      }
    })();
    if (!je && f.entries.some((Z) => Z.kind === "play"))
      try {
        localStorage.setItem(qe, "1");
      } catch {
      }
    const Nt = je || f.slot > 0 && ((((Dh = f.likeFunds) == null ? void 0 : Dh.balance) ?? 0n) > 0n || x.count() > 1), qn = U(f), sr = !qn && W5({ ...f, heard: Nt }, ot);
    o(".ppp-badge").hidden = !sr;
    const _s = o(".ppp-steps"), ys = o(".ppp-stage");
    _s.hidden = ys.hidden = !sr, ot && sr && (_s.replaceChildren(...af(f.solo).map((Z, fe) => {
      const Re = $("li", "", fe < ot.at ? "done" : fe === ot.at ? ot.blocked ? "now blocked" : "now" : "");
      return Re.append($("span", fe < ot.at ? "✓" : String(fe + 1), "n"), Z), fe === ot.at && Re.setAttribute("aria-current", "step"), Re;
    })), ys.textContent = ot.caption, ys.className = "ppp-stage " + (ot.at >= af(f.solo).length ? "ppp-ok" : ot.blocked ? "ppp-bad" : "ppp-cyan"));
    const Si = o(".ppp-facts"), Dn = [];
    f.main && ((Fh = f.gate) != null && Fh.here) && !f.solo && Dn.push(...Mn("Your wallet", ve(f.main), "ppp-addr-short"));
    const Bh = () => {
      if (!f.listening) return;
      const Z = fr("copy-listening", "Copy", () => f.listening || "", "tiny", () => ct(c.snapshot()));
      Dn.push(...Mn(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", ee(f.listening), "ppp-addr-short", Z));
    };
    if (f.linked || Bh(), f.listening && f.step !== "intro")
      if (f.linked)
        Dn.push(...Mn("Credited to", `${ve(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Bh();
      else if (f.solo) {
        f.creditedTo && Dn.push(...Mn("Credited to", `${ve(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const Z = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${ve(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Dn.push(...Mn("Returns go to", f.gift ? Z : f.returnTo && !wt(f.returnTo) ? Z.replace(ee(f.returnTo), f.returnTo) : Z, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Dn.push(...Mn("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((jh = f.gate) != null && jh.here)) {
      const Z = f.linkedListening.map((fe) => ee(fe) + (fe === f.listening ? " (this one)" : "")).join(", ");
      Dn.push(...Mn(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Z = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Dn.push(...Mn("Balance", `${Pr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Z));
    }
    const pa = f.entries.find((Z) => Z.kind === "play");
    pa && Vn(), pa && Dn.push(...Mn("Last paid song", `${bn(pa)} → ${ve(pa.recipient)}`, Ts[pa.status] || "")), Si.replaceChildren(...Dn), Si.hidden = !Dn.length;
    const De = [], Lt = [], Ut = [], or = [], Nh = On(BigInt(((Rh = f.gate) == null ? void 0 : Rh.limits.playFee) ?? "300")), Mh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${Pr(kl)} STX to the song holder, plus a ${Pr(Nh - kl)} STX network fee.`, Ph = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (De.push($("p", "Pay artists as you listen.")), (zh = f.gate) != null && zh.radioUrl) {
          const fe = $("p");
          fe.append(ze("Open the pay-per-play radio →", f.gate.radioUrl)), De.push(fe);
        }
        Lt.push($("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const fe = [f.linked, ...f.others];
          De.push($("p", fe.length > 1 ? `This device has listening wallets for ${Jt(fe)}.` : `This device has a listening wallet for ${ve(f.linked)}.`)), Lt.push($("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), fe.slice(0, 3).forEach((Re, mt) => Ut.push(pe(`Open ${ve(Re)}`, () => Ao(Re), mt === 0 ? "primary" : "")));
        } else
          De.push($("p", "Connect your wallet to pay artists as you listen.")), Lt.push($("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        De.push($("p", `This device's listening wallet belongs to ${ve(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Lt.push($("p", `You are connected as ${ve(f.main)}. Switch to the linked wallet to continue listening.`)), Lt.push($("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Ut.push(pe("Switch wallet", Vr, "primary"));
        break;
      case "not-invited":
        De.push($("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        De.push($("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        De.push($("p", "Every play counts for the song’s owner, on-chain.")), Lt.push($("p", Mh)), Lt.push($("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Lt.push($("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (De.push($("p", `This device already has a listening wallet for ${Jt(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Lt.push($("p", `Otherwise, set up a new listening wallet for ${ve(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Lt.push($("p", `This is the listening wallet for ${ve(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Lt.push($("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Z = v.liveGift();
        Ut.push(pe(Z ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${ve(f.main)}` : "Start listening", () => void c.create(w.claiming() ? { another: !0 } : void 0), "primary")), !Z && !f.solo && f.main && f.others.length && Ut.push(pe("Switch wallet", Vr)), !Z && f.solo && Ut.push(pe("I have a Stacks wallet", Vr)), Ut.push(pe("I already have a listening wallet", () => void c.unlock(!0))), Z && Ut.push(pe("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (De.push($("p", "Locked.", "ppp-mute")), Ut.push(pe("Unlock", () => void c.unlock(), "primary"))), f.standIn ? or.push(pe("Use a different listening wallet", () => void Bs().then((fe) => {
          fe === "stacks" && Vr();
        }), "quiet")) : or.push(pe("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        De.push($("p", `Link to ${ve(f.main)} · free`)), Lt.push($("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Lt.push($("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Ut.push(pe(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        De.push($("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && De.push(Cr(f.arrival)) : J(f) ? De.push($("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Gh = f.gift) != null && Gh.player ? De.push($("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? De.push($("p", "No plays left · add plays to keep counting", "ppp-bad")) : De.push($("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Nh)).toLocaleString()} plays`)), f.entries.length && Lt.push($("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && Lt.push($("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? Lt.push($("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? Lt.push($("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (Lt.push($("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Lt.push($("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Ut.push(fr("copy-address", "Copy my address", () => f.listening || "", "primary", () => ct(c.snapshot())))) : Lt.push($("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const fe = $("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          fe.append(ze("View", ht(f.depositTxid))), De.push(fe);
        } else f.allowance > 0n && !f.solo && !f.depositPending && Ut.push(vo(f, `Deposit ${Pr(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        De.push($("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (De.push($("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), Ut.push(pe("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (De.push($("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), De.push(rr(f))), (!f.solo || f.returnTo) && Ut.push(pe("Return excess", () => void c.returnFunds("excess"), "primary"), pe("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((Kh = f.giftStop) == null ? void 0 : Kh.reason) !== "off") {
          const fe = Math.min(f.session.playsLeft, f.playsLeft);
          De.push($("p", `${fe.toLocaleString()} plays left`, "ppp-ok")), Lt.push($("p", Mh + " The heart likes or unlikes from this wallet for 0.0003 STX.")), Ut.push(pe("Switch off", () => void c.switchOff()));
        } else
          De.push($("p", "Switch on music support to listen.", "ppp-mute")), Ut.push(pe("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && De.push($("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && De.push($("p", "Running low on plays", "ppp-warn")), f.aboveTarget && De.push($("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? De.push($("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Ut.push(vo(f, `Top up ${Pr(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const Z = f.step === "fund", fe = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      Z ? Ut.unshift(pe("Add plays", () => Me(), "primary")) : fe ? Ut.push(pe("Add plays", () => Me(), "primary")) : f.step === "ready" && or.push(pe("Add plays", () => Me(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && Lt.push($("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && Lt.push(rr(f)), Lt.push(Lr()), f.slot === 0 && f.step === "ready" && f.entries.some((Z) => Z.kind === "play" && Z.status === "confirmed"))) {
      const Z = $("p", "New to Stacks? ", "ppp-mute");
      Z.append(ze("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), De.push(Z);
    }
    if (f.walletOutdated && Lt.push($("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (De.push($("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Ut.push(pe("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && or.push(pe(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${ve(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((Vh = f.gift) != null && Vh.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && or.push($o(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && or.push(pe(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && or.push(pe("Lock", () => void c.lock(), "quiet")), Bt && !Ce && or.push(pe(jt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      jt = !jt, ct(c.snapshot());
    }, "quiet")), [...Ut, ...or].forEach((Z) => Z.disabled = Ph), Ph && (Ut.length = 0), !qn && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((Xh = f.gift) != null && Xh.player)) {
      const Z = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", fe = De.at(0);
      f.step === "ready" && fe ? fe.append($("span", ` · ${ke(f.balance)} STX`, Z)) : De.push($("p", `Balance ${ke(f.balance)} STX`, Z));
    }
    if (qn) {
      for (const Re of [...Ut, ...or]) {
        const mt = JL[Re.textContent ?? ""];
        mt && (Re.textContent = mt);
      }
      for (let Re = De.length - 1; Re >= 0; Re--) Wg(De[Re].textContent) && Lt.unshift(...De.splice(Re, 1));
      for (let Re = Ut.length - 1; Re >= 0; Re--) Wg(Ut[Re].textContent) && or.unshift(...Ut.splice(Re, 1));
      const Z = f.entries.some((Re) => Re.kind === "play"), fe = tC(f.step, { played: Z, arriving: f.depositPending });
      fe.length && De.length && fe.shift(), De.push(...fe.map((Re) => $("p", Re, "ppp-mute")));
    }
    if ((Yh = f.gift) != null && Yh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const Z = $("p", "", "ppp-gift");
      Z.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && Z.append(" · ", f.gift.player.subtitle);
      const fe = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? $("span", " · plays on their way", "ppp-warn") : $("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      fe && Z.append(fe);
      const Re = (qh = De.at(0)) == null ? void 0 : qh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Re && /STX/.test(Re.textContent ?? "") && Re.remove(), De.unshift(Z), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          De.splice(1, 0, $("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), $o(f, "primary"));
        else {
          const mt = $("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          mt.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), mt.append(ze("Xverse", "https://www.xverse.app/download"), " and ", ze("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), De.splice(1, 0, mt);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const Z = f.returnPlan, fe = $("div", "", "ppp-pick");
      fe.append($("p", Z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Re = $("ul", "", "ppp-gift-list");
      Z.steps.forEach((mt, Tr) => {
        const ir = mt.kind === "gift" ? "the unused gift" : mt.kind === "deposit" ? "what was added to it" : "the rest", In = $("li");
        In.append($("span", `${Tr + 1}. ${Pr(BigInt(mt.send))} STX · ${ir}`, "t"), $("span", mt.to ? ` → ${ve(mt.to)}` : " → choose an address below", mt.to ? "ppp-mute" : "ppp-warn")), Re.append(In);
      }), fe.append(Re), Z.kept && fe.append($("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Z.steps.some((mt) => !mt.to) && fe.append(rr(f)), fe.append(pe(Z.steps.length > 1 ? `Confirm part 1 of ${Z.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), De.push(fe);
    }
    const Us = To(f), ws = A ? Us : null, vi = H(f, !!ws), zb = vi === "gift" || vi === "arriving" || vi === "new", cu = ws ? null : w.lines(l), lu = cu && !w.claiming() ? cu : [...cu ?? [], ...v.banner(l, { bare: !!ws || vi === "gift" || vi === "arriving" })], sc = er && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? Kr(er, v.pendingCode()) : [];
    ws || (De.unshift(...lu), De.push(...Io(f)), De.unshift(...sc)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && De.unshift($("p", `This is ${ve(f.creditedTo)}'s listening wallet. Plays and likes count for ${ve(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), o(".ppp-key").replaceChildren(...De);
    const uu = document.querySelector(".ppp-switch");
    if (uu) {
      const Z = x.latest(), fe = f.slot > 0, Re = ["fund", "ready", "over"].includes(f.step) && (fe || !!Z);
      if (uu.hidden = !Re, Re) {
        const mt = (In, ac, cc, yu) => {
          const Ei = pe("", yu, "ppp-tab");
          return Ei.setAttribute("aria-pressed", String(cc)), Ei.append($("span", In, "tt"), $("span", ac === void 0 ? "…" : `${Te(ac).toLocaleString()} plays`, "ts")), Ei.disabled = !!f.busy, Ei;
        }, Tr = fe ? ((Zh = (Wh = f.gift) == null ? void 0 : Wh.player) == null ? void 0 : Zh.title) ?? "Album" : Z.title, ir = pe("View all albums" + (x.count() > 1 ? ` (${x.count()})` : ""), () => {
          const In = document.querySelector(".ppp-shelf");
          In && (In.hidden = !1, In.open = !In.open, ir.setAttribute("aria-expanded", String(In.open)), In.open && requestAnimationFrame(() => In.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        ir.setAttribute("aria-expanded", String(!!((Jh = document.querySelector(".ppp-shelf")) != null && Jh.open))), uu.replaceChildren(
          mt("🎧 My player", fe ? (Qh = f.likeFunds) == null ? void 0 : Qh.balance : f.balance, !fe, () => {
            fe && c.openAlbum(0);
          }),
          mt("💿 " + Tr, fe ? f.balance : void 0, fe, () => {
            !fe && Z && c.openAlbum(Z.slot);
          }),
          ir
        );
      }
    }
    const oc = x.render(f), ic = document.querySelector(".ppp-shelf");
    if (ic) {
      ic.hidden = !oc;
      const Z = ic.querySelector("summary");
      Z && (Z.textContent = x.count() > 0 ? `♪ My albums (${x.count()})` : "♪ My albums");
      const fe = ic.querySelector(".ppp-shelf-body");
      oc && fe && !fe.contains(oc) && fe.replaceChildren(oc);
    }
    const ga = v.renderFold(l);
    if (o(".ppp-gifts").hidden = !ga, ga && !o(".ppp-gift-body").contains(ga) && o(".ppp-gift-body").replaceChildren(ga), ga && Vt) {
      Vt = !1;
      const Z = o(".ppp-gifts");
      Z.open = !0, requestAnimationFrame(() => Z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const du = document.querySelector("#ppp .ppp-featured");
    if (du) {
      const Z = ne(), fe = ce.manage(), Re = (Z.length > 0 || !!fe) && f.slot === 0 && !((ep = f.gift) != null && ep.player) && f.step === "ready";
      du.hidden = !Re, Re && du.replaceChildren(...Z.length ? [$("p", "Albums in your player", "ppp-featured__h")] : [], ...Z.map((mt) => {
        const Tr = (dn == null ? void 0 : dn.id) === mt.id, ir = pe("", () => mr(Tr ? null : mt, !Tr), "ppp-featured__a" + (Tr ? " is-on" : "")), In = Dr(mt).length;
        return ir.append($("b", mt.title), $("span", Tr ? "Playing now · tap to go back to the radio" : `${mt.subtitle ? mt.subtitle + " · " : ""}${In} ${In === 1 ? "song" : "songs"}`)), ir.setAttribute("aria-pressed", String(Tr)), ir.disabled = !!f.busy, ir;
      }), ...fe ? [fe] : []);
    }
    const fu = document.querySelector("#ppp .ppp-release-in-slot");
    if (fu) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : ce.banner();
      fu.hidden = !Z.length, fu.replaceChildren(...Z);
    }
    const Ai = document.querySelector("#ppp .ppp-release");
    if (Ai) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : ce.fold();
      if (Ai.hidden = !Z, Z) {
        const fe = document.activeElement instanceof HTMLElement && Ai.contains(document.activeElement) ? document.activeElement : null, Re = ((tp = Ai.querySelector(".ppp-release-songs")) == null ? void 0 : tp.scrollTop) ?? 0;
        (np = Ai.querySelector(".ppp-release-body")) == null || np.replaceChildren(...Z);
        const mt = Ai.querySelector(".ppp-release-songs");
        mt && Re && (mt.scrollTop = Re), fe && fe.isConnected && document.activeElement !== fe && fe.focus({ preventScroll: !0 });
      }
    }
    te(f);
    const hu = document.querySelector("#ppp .ppp-yours");
    if (hu) {
      const Z = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      hu.hidden = !Z;
      const fe = hu.querySelector(".ppp-yours-body");
      if (Z && fe && fe.getAttribute("data-for") !== f.listening) {
        fe.setAttribute("data-for", f.listening);
        const Re = (yu, ...Ei) => {
          const rp = $("details", "", "ppp-yours-item");
          return rp.append($("summary", yu), ...Ei), rp;
        }, mt = $("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        mt.append($("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Tr = $("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), ir = $("p");
        ir.append(ze("Find a name at BNS One →", "https://bns.one"));
        const In = $("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), ac = $("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), cc = $("p");
        cc.append(ze("See the giveaway →", "https://xtrata.xyz/giveaway")), fe.replaceChildren(
          Re("Give your player a name", mt, Tr, $("p", f.listening, "ppp-addr-full"), fr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => ct(c.snapshot())), ir),
          Re("Link it to a wallet you already have", In),
          Re("Bring a friend in", ac, cc)
        );
      }
    }
    o(".ppp-body").replaceChildren(...Lt), o(".ppp-actions").replaceChildren(...Ut), o(".ppp-actions2").replaceChildren(...or);
    const pu = f.busy || f.message || "", _h = o(".ppp-msg"), gu = pu && De.some((Z) => (Z.textContent ?? "").startsWith(pu.replace(/[.✓\s]+$/, ""))) ? "" : pu, Uh = !gu && !f.error ? f.notice : j && !gu ? f.error : "";
    _h.textContent = gu || Uh, _h.classList.toggle("is-warn", !!Uh), o(".ppp-err").textContent = j ? "" : f.error;
    const Gb = f.entries.filter((Z) => Z.kind === "play");
    o(".ppp-recent").hidden = !f.entries.length, o(".ppp-recent-list").replaceChildren(...Gb.slice(0, 5).map((Z) => {
      const fe = $("li"), Re = Z.status === "confirmed" ? "ok" : Z.status === "failed" ? "bad" : "warn";
      return fe.append($("span", "", "d " + Re), $("span", bn(Z), "t"), $("span", Fe(Z.created), "ppp-mute")), Z.txid && fe.append(ze("tx", ht(Z.txid))), fe;
    })), o(".ppp-wallets").hidden = !(Si.childElementCount || or.length), o(".ppp-more").hidden = !Lt.length;
    const Oh = o(".ppp-history");
    Oh.hidden = !f.entries.length, f.entries.length && Vn(), Oh.replaceChildren($("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Z) => {
      const fe = $("div", "", "ppp-row"), Re = Z.kind === "play" ? [$("span", bn(Z), "ppp-song"), $("span", ` · ${Pr(BigInt(Z.amount))} STX to ${ve(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [$("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${bn(Z)}`, "ppp-song"), $("span", ` · for ${f.linked ? ve(f.linked) : "this listening wallet"}`, "ppp-mute")] : [$("span", `Returned ${Pr(BigInt(Z.amount))} STX`, "ppp-song"), $("span", ` to ${ve(Z.recipient)}`, "ppp-mute")];
      return fe.append(
        $("span", So[Z.status] || Z.status, "ppp-status " + (Ts[Z.status] || "")),
        ...Re,
        $("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && fe.append(ze("tx ↗", ht(Z.txid))), fe;
    })), Y == null || Y.render(ws ? X(f, ws, [...sc, ...lu]) : null), se(f, !!ws, zb ? [...sc, ...lu] : sc, vi), V(f, !!ws || !!(_t != null && _t.showing())), Be(f, ws), ft.isOpen() && ft.refresh(), M();
    const Hh = (Us == null ? void 0 : Us.mode) === "open" ? null : zr(f);
    vt == null || vt.render((Us == null ? void 0 : Us.mode) === "open" ? X(f, Us, []) : Hh ? { ...X(f, { mode: "open", player: Hh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function To(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && Ye({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = v.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const y = $e();
    return y && (l.step === "locked" || Ve && l.step === "loading") ? { mode: "locked", player: y.player } : null;
  }
  const b = (l, p, y, f, j) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: y, ...j ? { b: j } : {}, p: String(f), s: Jg(wg, p, y) })}`;
  function k(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? N ? "making" : null : p.state === "claimed" ? N && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || P || l.step === "link" && I !== "have" ? null : I === "making" || I === "yours" ? "ready" : I;
  }
  function V(l, p) {
    if (!q) return;
    const y = l.award, f = y != null && y.cls && Dc(y.cls) ? Fo(y.cls) : null, j = l.slot === 0 ? l.listening : l.root, ae = p || !y || !f || !j || y.number === void 0 ? null : k(l);
    if (!ae || !y || !f || !j) {
      q.render(null, p);
      return;
    }
    ae === "have" && l.linked && !W && (W = !0, c.awardRefresh());
    const Ee = typeof y.name == "string" && y.name ? y.name : null, Ae = [];
    l.error && Ae.push($("p", l.error, "ppp-warn"));
    const Ce = (Bt) => {
      I = Bt, Bt === "name" && (N = !0), ct(c.snapshot());
    };
    q.render({
      screen: ae,
      tier: f,
      number: y.number,
      need: y.need ?? 0,
      player: j,
      name: y.name,
      inscription: y.inscription,
      art: ae === "yours" && y.inscription !== void 0 ? `/i/${y.inscription}` : b(f, y.number, j, y.need ?? 0, Ee),
      claimLink: y.claimTx ? ht(y.claimTx) : void 0,
      status: Ae,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? ve(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => fr("award-player-address", "Copy my player’s address", () => j, "tiny", () => ct(c.snapshot())),
      go: Ce,
      claim: (Bt) => {
        N = !0, c.claimAward(Bt);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var Bt;
        return (Bt = document.getElementById("radio-wallet-connect")) == null ? void 0 : Bt.click();
      },
      link: () => void c.link(),
      later: () => {
        P = !0;
        try {
          localStorage.setItem(m, String(Date.now()));
        } catch {
        }
        ct(c.snapshot());
      },
      done: () => {
        N = !1, I = "ready", ct(c.snapshot());
      }
    }, p);
  }
  function te(l) {
    var ot;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const y = l.award, f = l.slot === 0 ? l.listening : l.root, j = y != null && y.cls && Dc(y.cls) ? Fo(y.cls) : null, ae = !!y && !!j && !!f && ["ready", "fund", "over"].includes(l.step) && !(y.state === "unavailable" && y.number === void 0);
    if (p.hidden = !ae, !ae || !y || !j || !f) {
      p.replaceChildren();
      return;
    }
    const Ee = JSON.stringify([y, f, !!l.busy]);
    if (p.getAttribute("data-sig") === Ee) return;
    p.setAttribute("data-sig", Ee);
    const Ae = (qe) => {
      const je = $("p", "", "ppp-award__h");
      return je.append($("b", `${j.mark} Music Hero award`), $("span", qe)), je;
    }, Ce = `No. ${String(y.number ?? 0).padStart(4, "0")}`, Bt = (qe) => {
      const je = $("div", "", "ppp-award__art"), Nt = document.createElement("iframe");
      return Nt.src = qe, Nt.title = `${j.name} record`, Nt.setAttribute("sandbox", "allow-scripts"), Nt.setAttribute("loading", "lazy"), je.append(Nt), je;
    }, pt = [];
    if (y.state === "claimed") {
      if (pt.push(Ae(`${j.name} record · ${Ce}`)), y.inscription !== void 0 && pt.push(Bt(`/i/${y.inscription}`)), pt.push($("p", y.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : y.holds === null || y.holds === void 0 ? `Yours: Xtrata inscription #${y.inscription}.` : `Yours for good: Xtrata inscription #${y.inscription}. It gives your player its ${j.name} colours.`, y.holds === !1 ? "ppp-mute" : "ppp-ok")), y.inscription !== void 0) {
        const qe = $("p");
        qe.append(ze("Open it full screen ↗", `/i/${y.inscription}`)), pt.push(qe);
      }
      if (y.sendTx) {
        const qe = $("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        qe.append(ze("View", ht(y.sendTx))), pt.push(qe);
      } else if (y.holds === !0 && y.inscription !== void 0) {
        const qe = $("details", "", "ppp-award__send"), je = document.createElement("input");
        je.type = "text", je.placeholder = "SP… address to send it to", je.autocomplete = "off", je.spellcheck = !1, je.setAttribute("aria-label", "Address to send your record to");
        const Nt = pe("Send my record…", () => void c.sendAward(je.value), "");
        Nt.disabled = !!l.busy, qe.append(
          $("summary", "Send this record to someone"),
          $("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          je,
          Nt
        ), pt.push(qe);
      }
    } else if (y.claimTx) {
      pt.push(Ae(`${j.name} record · ${Ce}`));
      const qe = $("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      qe.append(ze("View", ht(y.claimTx))), pt.push(qe);
    } else if (y.state === "ready") {
      pt.push(Ae(`${j.name} record · ${Ce}`));
      const qe = typeof y.name == "string" && y.name ? y.name : null, je = new URLSearchParams({ n: String(y.number), a: f, ...qe ? { b: qe } : {}, p: String(y.need), s: Jg(wg, y.number, f) });
      pt.push(Bt(`/awards/${j.id}#${je}`)), pt.push($("p", `Your ${j.name} record is ready. You have paid artists for ${(ot = y.need) == null ? void 0 : ot.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const Nt = $("div", "", "ppp-award__row");
      qe ? (pt.push($("p", `Its plaque will carry ${qe} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), Nt.append(pe("Claim my record", () => {
        N = !0, c.claimAward("auto");
      }, "primary"), pe("Use my address only", () => {
        N = !0, c.claimAward("none");
      }, "quiet"))) : y.name === null ? (pt.push($("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), Nt.append(pe("Claim my record", () => {
        N = !0, c.claimAward("none");
      }, "primary"), pe("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (pt.push($("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), Nt.append(pe("Check for a name again", () => void c.awardRefresh(), "primary"), pe("Claim with my address only", () => void c.claimAward("none"), "quiet"))), Nt.querySelectorAll("button").forEach((qn) => {
        qn.disabled = !!l.busy;
      }), pt.push(Nt, $("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (y.state === "earning" && y.have !== void 0 && y.need) {
      pt.push(Ae(`${y.have.toLocaleString()} of ${y.need.toLocaleString()} paid plays`));
      const qe = $("div", "", "ppp-award__bar"), je = document.createElement("i");
      je.style.width = `${Math.min(100, Math.round(y.have / y.need * 100))}%`, qe.append(je);
      const Nt = y.need - y.have;
      pt.push(qe, $("p", `${Nt.toLocaleString()} more ${Nt === 1 ? "play" : "plays"} and your ${j.name} record is yours to claim.`, "ppp-mute"));
    } else
      pt.push(Ae(`${j.name} record · ${Ce}`)), pt.push($("p", y.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : y.state === "class-full" || y.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...pt);
  }
  function Be(l, p) {
    var Ae;
    const y = document.querySelector(".ppp-skin");
    if (!y) return;
    if (!p && (q != null && q.showing()) && ((Ae = l.award) != null && Ae.cls) && Dc(l.award.cls) && (l.busy || l.armed)) {
      const Ce = Fo(l.award.cls), Bt = $("span", "", "ppp-skin__t");
      Bt.append($("b", `${Ce.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), $("span", "Xtrata Music Hero")), y.hidden = !1, y.replaceChildren($("span", Ce.mark, "ppp-skin__art ppp-skin__art--none"), Bt);
      return;
    }
    const f = !!p && (!!l.busy || l.armed);
    if (y.hidden = !f, !f || !p) {
      y.replaceChildren();
      return;
    }
    const j = Qc(p.player.cover), ae = j ? $("img", "", "ppp-skin__art") : $("span", "♪", "ppp-skin__art ppp-skin__art--none");
    j && (ae.src = j, ae.alt = "");
    const Ee = $("span", "", "ppp-skin__t");
    Ee.append($("b", p.player.title), $("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), y.replaceChildren(ae, Ee);
  }
  function X(l, p, y) {
    var Ce, Bt, pt, ot, qe;
    const f = !!l.busy || l.armed, j = [...y];
    l.depositPending && l.arrival && j.push(Cr(l.arrival)), l.error ? j.push($("p", l.error, l.error === Ll ? "ppp-warn" : "ppp-bad")) : l.message && !f ? j.push($("p", l.message, "ppp-cyan")) : l.notice && j.push($("p", l.notice, "ppp-warn")), p.mode === "open" && O && ((Ce = l.likeFunds) != null && Ce.album) && l.likeFunds.low && !l.likeFunds.pending && j.push($("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let ae = "Kept on this device with Face ID or your passkey. No app or account needed.", Ee = null, Ae = null;
    if (p.mode === "locked")
      Ee = { label: "Continue listening", run: () => {
        Ve = $e(), c.unlock();
      } }, Ae = { label: "Use a different passkey", run: () => {
        Ve = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && zc(xt) && xt.album === p.player.id) {
        const je = window.XtrataRadio, Nt = Dr(p.player)[0], qn = xt.phase === "playing";
        Ee = { label: qn && !!((pt = (Bt = je == null ? void 0 : je.getState) == null ? void 0 : Bt.call(je)) != null && pt.playing) ? "Pause" : qn ? "Carry on" : "Play the first song", run: () => {
          var _s, ys;
          qn ? (_s = je == null ? void 0 : je.playPause) == null || _s.call(je) : Nt && ((ys = je == null ? void 0 : je.playToken) == null || ys.call(je, Nt.id));
        } }, Ae = { label: "Make my player and hear it all", run: () => void c.create() }, ae = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const je = xt.phase === "done" && xt.album === p.player.id;
        je && !j.length && j.push($("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), Ee = { label: je ? "Keep listening" : "Open album", run: () => void c.create() }, Ae = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (Ee = { label: "Open album", run: () => void c.unlock() }, Ae = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? j.push($("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : j.length || j.push($("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: p.mode,
      player: p.player,
      from: p.from,
      offered: p.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: p.mode === "arrive" && l.step === "intro" ? 1 : void 0,
      plays: p.mode === "open" ? l.balance === void 0 ? null : l.giftPlays : void 0,
      playsComing: l.depositPending,
      status: j,
      primary: Ee,
      secondary: Ae,
      hint: Ee ? ae : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: bi(l),
      topUps: Jc,
      canMake: !!((qe = (ot = l.gate) == null ? void 0 : ot.gifts) != null && qe.admin)
    };
  }
  const Se = document.getElementById("findBox"), xe = document.getElementById("findBody"), Ie = Se && xe ? mC(xe, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => gC(l == null ? void 0 : l.tracks, (p, y) => ({ title: Lg(p, xo(y.title) ? "" : y.title), artist: $g(p, y.artist || "") }))),
    play: (l) => {
      var p, y;
      (y = (p = window.XtrataRadio) == null ? void 0 : p.playToken) == null || y.call(p, l);
    },
    current: () => {
      var p, y, f, j;
      const l = Number((j = (f = (y = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : y.call(p)) == null ? void 0 : f.nowPlaying) == null ? void 0 : j.tokenId);
      return Number.isSafeInteger(l) ? l : null;
    },
    locked: () => {
      var l;
      return !!((l = c.snapshot().albumLock) != null && l.locked);
    },
    explicit: (l) => {
      var p, y;
      return !!((y = (p = window.XtrataRadio) == null ? void 0 : p.isExplicit) != null && y.call(p, l));
    },
    liked: (l) => S().has(l)
  }) : null;
  Se == null || Se.addEventListener("toggle", () => {
    Se.open && (Ie == null || Ie.load());
  });
  let st = "";
  const S = () => {
    var p, y, f;
    const l = (f = (y = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : y.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((j) => Number(j == null ? void 0 : j.tokenId)).filter(Number.isSafeInteger) : []);
  }, M = () => {
    var p, y, f, j, ae;
    if (!Ie || !(Se != null && Se.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((ae = (j = (f = (y = window.XtrataRadio) == null ? void 0 : y.getState) == null ? void 0 : f.call(y)) == null ? void 0 : j.nowPlaying) == null ? void 0 : ae.tokenId) ?? ""}|${[...S()].sort((Ee, Ae) => Ee - Ae).join(",")}`;
    l !== st && (st = l, Ie.refresh());
  }, G = /* @__PURE__ */ new Map();
  let me = !1;
  const Xt = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const y = p == null ? void 0 : p.nowPlaying;
      if (y && Number.isSafeInteger(Number(y.tokenId)) && G.set(Number(y.tokenId), { title: y.title || void 0, artist: y.artist || void 0 }), M(), de) {
        const f = `${(y == null ? void 0 : y.tokenId) ?? ""}|${!!(p != null && p.playing)}`;
        f !== Pe && (Pe = f, ct(c.snapshot()));
      }
      if (zc(xt)) {
        const f = !!(p != null && p.playing);
        mn({ kind: "now", track: y && y.tokenId != null ? String(y.tokenId) : null, playing: f, at: Date.now() }), f !== me && (me = f, ct(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Xt()) {
    const l = setInterval(() => {
      Xt() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const p = l.detail;
    if (zc(xt) && mn({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      Vn();
      const y = Nn(p.song, G.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: y.title || void 0, artist: y.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const CC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", TC = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", o = t.userAgent.includes("Edge"), s = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return s ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && o === !1 && i === !1;
}, BC = () => TC() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, NC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, MC = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Rb = class {
  constructor(e) {
    H4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && sA(e), this.callback(Vl(e));
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
    var r, o, s, i, a, c, u, h, d, w;
    return n === "IOS" ? (o = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && o !== void 0 ? o : e.webUrl : t === "Chrome" ? (i = (s = e.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (h = (u = e.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl : (w = (d = this.getBrowserUrl(e)) !== null && d !== void 0 ? d : e.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(e);
  }
  render() {
    const e = BC(), t = NC(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((i) => i.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, o = n.length > 0;
    return We("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, We("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), We("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, We("div", { class: "flex flex-col space-y-[10px]" }, We("div", { class: "flex items-center" }, We("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), We("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, We("span", { class: "sr-only" }, "Close popup"), We("img", { src: CC }))), r ? We("p", null, "Select the wallet you want to connect to.") : We("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && We("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && We("div", { class: "mt-6" }, We("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), We("ul", { class: "space-y-3" }, this.installedProviders.map((s) => We("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, We("div", { class: "aspect-square basis-9 overflow-hidden" }, We("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), We("div", { class: "flex-1" }, We("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && We("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), We("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), o && We("div", { class: "mt-6" }, r ? We("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : We("div", { class: "mb-5 flex justify-between" }, We("p", { class: "text-sm font-medium" }, "Recommended wallets"), We("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, We("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, We("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), We("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), We("p", null, "What is a wallet? ", We("span", { class: "align-text-bottom text-[9px]" }, "↗")))), We("ul", { class: "space-y-3" }, n.map((s) => We("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, We("div", { class: "aspect-square basis-9 overflow-hidden" }, We("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), We("div", { class: "flex-1" }, We("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && We("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, e, t) && We("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, e, t), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return b4(this);
  }
};
Rb.style = MC;
const PC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Rb
}, Symbol.toStringTag, { value: "Module" }));
