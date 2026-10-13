var Sy = Object.defineProperty;
var Ey = (t, e, n) => e in t ? Sy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var ti = (t, e, n) => Ey(t, typeof e != "symbol" ? e + "" : e, n);
var ge = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function rh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Xo(t) {
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
      function f(m) {
        var k = {
          next: function() {
            var O = m.shift();
            return { done: O === void 0, value: O };
          }
        };
        return r.iterable && (k[Symbol.iterator] = function() {
          return k;
        }), k;
      }
      function d(m) {
        this.map = {}, m instanceof d ? m.forEach(function(k, O) {
          this.append(O, k);
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
        var O = this.map[m];
        this.map[m] = O ? O + ", " + k : k;
      }, d.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, d.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, d.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, d.prototype.set = function(m, k) {
        this.map[a(m)] = c(k);
      }, d.prototype.forEach = function(m, k) {
        for (var O in this.map)
          this.map.hasOwnProperty(O) && m.call(k, this.map[O], O, this);
      }, d.prototype.keys = function() {
        var m = [];
        return this.forEach(function(k, O) {
          m.push(O);
        }), f(m);
      }, d.prototype.values = function() {
        var m = [];
        return this.forEach(function(k) {
          m.push(k);
        }), f(m);
      }, d.prototype.entries = function() {
        var m = [];
        return this.forEach(function(k, O) {
          m.push([O, k]);
        }), f(m);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function g(m) {
        return new Promise(function(k, O) {
          m.onload = function() {
            k(m.result);
          }, m.onerror = function() {
            O(m.error);
          };
        });
      }
      function h(m) {
        var k = new FileReader(), O = g(k);
        return k.readAsArrayBuffer(m), O;
      }
      function y(m) {
        var k = new FileReader(), O = g(k), z = /charset=([A-Za-z0-9_-]+)/.exec(m.type), J = z ? z[1] : "utf-8";
        return k.readAsText(m, J), O;
      }
      function w(m) {
        for (var k = new Uint8Array(m), O = new Array(k.length), z = 0; z < k.length; z++)
          O[z] = String.fromCharCode(k[z]);
        return O.join("");
      }
      function $(m) {
        if (m.slice)
          return m.slice(0);
        var k = new Uint8Array(m.byteLength);
        return k.set(new Uint8Array(m)), k.buffer;
      }
      function H() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = $(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || o(m)) ? this._bodyArrayBuffer = $(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
            return y(this._bodyBlob);
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
        var k = m.toUpperCase();
        return U.indexOf(k) > -1 ? k : m;
      }
      function L(m, k) {
        if (!(this instanceof L))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        k = k || {};
        var O = k.body;
        if (m instanceof L) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, k.headers || (this.headers = new d(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !O && m._bodyInit != null && (O = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = k.credentials || this.credentials || "same-origin", (k.headers || !this.headers) && (this.headers = new d(k.headers)), this.method = b(k.method || this.method || "GET"), this.mode = k.mode || this.mode || null, this.signal = k.signal || this.signal || function() {
          if ("AbortController" in n) {
            var W = new AbortController();
            return W.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && O)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(O), (this.method === "GET" || this.method === "HEAD") && (k.cache === "no-store" || k.cache === "no-cache")) {
          var z = /([?&])_=[^&]*/;
          if (z.test(this.url))
            this.url = this.url.replace(z, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var J = /\?/;
            this.url += (J.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function A(m) {
        var k = new FormData();
        return m.trim().split("&").forEach(function(O) {
          if (O) {
            var z = O.split("="), J = z.shift().replace(/\+/g, " "), W = z.join("=").replace(/\+/g, " ");
            k.append(decodeURIComponent(J), decodeURIComponent(W));
          }
        }), k;
      }
      function N(m) {
        var k = new d(), O = m.replace(/\r?\n[\t ]+/g, " ");
        return O.split("\r").map(function(z) {
          return z.indexOf(`
`) === 0 ? z.substr(1, z.length) : z;
        }).forEach(function(z) {
          var J = z.split(":"), W = J.shift().trim();
          if (W) {
            var ne = J.join(":").trim();
            try {
              k.append(W, ne);
            } catch (Nt) {
              console.warn("Response " + Nt.message);
            }
          }
        }), k;
      }
      H.call(L.prototype);
      function q(m, k) {
        if (!(this instanceof q))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (k || (k = {}), this.type = "default", this.status = k.status === void 0 ? 200 : k.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = k.statusText === void 0 ? "" : "" + k.statusText, this.headers = new d(k.headers), this.url = k.url || "", this._initBody(m);
      }
      H.call(q.prototype), q.prototype.clone = function() {
        return new q(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, q.error = function() {
        var m = new q(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var F = [301, 302, 303, 307, 308];
      q.redirect = function(m, k) {
        if (F.indexOf(k) === -1)
          throw new RangeError("Invalid status code");
        return new q(null, { status: k, headers: { location: m } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(k, O) {
          this.message = k, this.name = O;
          var z = Error(k);
          this.stack = z.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function K(m, k) {
        return new Promise(function(O, z) {
          var J = new L(m, k);
          if (J.signal && J.signal.aborted)
            return z(new e.DOMException("Aborted", "AbortError"));
          var W = new XMLHttpRequest();
          function ne() {
            W.abort();
          }
          W.onload = function() {
            var S = {
              statusText: W.statusText,
              headers: N(W.getAllResponseHeaders() || "")
            };
            J.url.indexOf("file://") === 0 && (W.status < 200 || W.status > 599) ? S.status = 200 : S.status = W.status, S.url = "responseURL" in W ? W.responseURL : S.headers.get("X-Request-URL");
            var T = "response" in W ? W.response : W.responseText;
            setTimeout(function() {
              O(new q(T, S));
            }, 0);
          }, W.onerror = function() {
            setTimeout(function() {
              z(new TypeError("Network request failed"));
            }, 0);
          }, W.ontimeout = function() {
            setTimeout(function() {
              z(new TypeError("Network request timed out"));
            }, 0);
          }, W.onabort = function() {
            setTimeout(function() {
              z(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Nt(S) {
            try {
              return S === "" && n.location.href ? n.location.href : S;
            } catch {
              return S;
            }
          }
          if (W.open(J.method, Nt(J.url), !0), J.credentials === "include" ? W.withCredentials = !0 : J.credentials === "omit" && (W.withCredentials = !1), "responseType" in W && (r.blob ? W.responseType = "blob" : r.arrayBuffer && (W.responseType = "arraybuffer")), k && typeof k.headers == "object" && !(k.headers instanceof d || n.Headers && k.headers instanceof n.Headers)) {
            var kt = [];
            Object.getOwnPropertyNames(k.headers).forEach(function(S) {
              kt.push(a(S)), W.setRequestHeader(S, c(k.headers[S]));
            }), J.headers.forEach(function(S, T) {
              kt.indexOf(T) === -1 && W.setRequestHeader(T, S);
            });
          } else
            J.headers.forEach(function(S, T) {
              W.setRequestHeader(T, S);
            });
          J.signal && (J.signal.addEventListener("abort", ne), W.onreadystatechange = function() {
            W.readyState === 4 && J.signal.removeEventListener("abort", ne);
          }), W.send(typeof J._bodyInit > "u" ? null : J._bodyInit);
        });
      }
      return K.polyfill = !0, n.fetch || (n.fetch = K, n.Headers = d, n.Request = L, n.Response = q), e.Headers = d, e.Request = L, e.Response = q, e.fetch = K, Object.defineProperty(e, "__esModule", { value: !0 }), e;
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
var Ls;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ls || (Ls = {}));
var Hr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Hr || (Hr = {}));
var ku;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ku || (ku = {}));
const Ly = "https://api.mainnet.hiro.so", ky = "https://api.testnet.hiro.so", Cy = "http://localhost:3999", By = ["mainnet", "testnet", "devnet", "mocknet"];
let ks = class {
  constructor(e) {
    this.version = Hr.Mainnet, this.chainId = Ls.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Hr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
ks.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ec();
    case "testnet":
      return new Ty();
    case "devnet":
      return new My();
    case "mocknet":
      return new sh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${By.join(", ")}`);
  }
};
ks.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ks.fromName(t);
let ec = class extends ks {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ly,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Hr.Mainnet, this.chainId = Ls.Mainnet;
  }
}, Ty = class extends ks {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ky,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Hr.Testnet, this.chainId = Ls.Testnet;
  }
}, sh = class extends ks {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Cy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Hr.Testnet, this.chainId = Ls.Testnet;
  }
};
const My = sh, ih = "xtrata.wallet.bridge.v1", _y = (t) => typeof t == "object" && t !== null && t.protocol === ih, Uy = (t) => _y(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Ny = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class ei extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Cu = 12e4;
class Hy {
  constructor(e) {
    ti(this, "pending", /* @__PURE__ */ new Map());
    ti(this, "listenTarget");
    ti(this, "closed", !1);
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
    ti(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Uy(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new ei("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new ei("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ei("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Ny(), i = { protocol: ih, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ei(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Cu}ms.`
          )
        );
      }, this.options.timeoutMs ?? Cu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new ei("CLOSED", "Bridge client closed before the reply arrived."));
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
}, Fy = () => {
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
}, jy = () => typeof window > "u" || !window.localStorage ? Fy() : window.localStorage, Ca = "xtrata.v15.1.wallet.session", Bu = "mainnet", Ao = { isConnected: !1 }, zy = (t) => t.address ? Dy(t.address) ?? t.network : t.network, oh = (t) => !t.isConnected || !t.address ? { ...Ao } : zy(t) !== Bu ? { ...Ao } : {
  isConnected: !0,
  address: t.address,
  network: Bu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Ry = (t) => {
  if (!t)
    return { ...Ao };
  try {
    const e = JSON.parse(t);
    return oh(e);
  } catch {
    return { ...Ao };
  }
}, Gy = (t) => {
  const e = oh(t);
  return JSON.stringify(e);
}, Ky = (t) => {
  const e = jy();
  return {
    load: () => Ry(e.getItem(Ca)),
    save: (n) => {
      e.setItem(Ca, Gy(n));
    },
    clear: () => {
      e.removeItem(Ca);
    }
  };
}, Vy = "https://browser.blockstack.org/auth", qy = {
  "@type": "Person",
  "@context": "http://schema.org"
}, ah = ["store_write"], Wy = "blockstack-session", Xy = {
  logLevel: "debug"
}, Jr = {
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
Object.freeze(Jr);
class qs extends Error {
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
class Yy extends qs {
  constructor(e, n = "") {
    super({ code: Jr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Tu extends qs {
  constructor(e = "") {
    super({ code: Jr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Di extends qs {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Jr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Mu extends qs {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Jr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class nc extends qs {
  constructor(e) {
    super({ code: Jr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class ch extends qs {
  constructor(e) {
    super({ code: Jr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const _u = ["debug", "info", "warn", "error", "none"], rc = {};
for (let t = 0; t < _u.length; t++) {
  const e = _u[t];
  rc[e] = t;
}
class xs {
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
    return rc[Xy.logLevel] <= rc[e];
  }
}
function Zy() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Qy() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Ba(t, e) {
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
function al(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = tw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    xs.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = ew(s, t.toString(), n);
    throw xs.error(i), new Error(i);
  }
  if (r)
    return {};
}
function wr(t, e) {
  return cl(fe(t), e);
}
function fe(t) {
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
  if (Ae(t, Uint8Array))
    return BigInt(`0x${nt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function nw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Uu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ii(t, e = 8) {
  return (typeof t == "bigint" ? t : fe(t)).toString(16).padStart(e * 2, "0");
}
function Yo(t) {
  return parseInt(t, 16);
}
function cl(t, e = 16) {
  const n = Ii(t, e);
  return St(n);
}
function rw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function sw(t, e) {
  return t & BigInt(1) << e;
}
function sc(t) {
  return iw(BigInt(`0x${nt(t)}`), BigInt(t.byteLength * 8));
}
function iw(t, e) {
  return sw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const ow = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += ow[n];
  return e;
}
function St(t) {
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
function ts(t) {
  return new TextEncoder().encode(t);
}
function Li(t) {
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
function Nu(t) {
  if (t.some(lw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function dn(...t) {
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
  return dn(...t.map((e) => typeof e == "number" ? Nu([e]) : e instanceof Array ? Nu(e) : e));
}
function Ae(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const lh = "https://api.mainnet.hiro.so", uh = "https://api.testnet.hiro.so", fh = "http://localhost:3999", uw = "https://hub.blockstack.org", fw = 33, Ta = 32;
function dw(t) {
  if (t.length < Ta * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Ta * 2), r = t.slice(2 + Ta * 2);
  return {
    recoveryId: Yo(e),
    r: n,
    s: r
  };
}
function ll(t) {
  const e = typeof t == "string" ? St(t) : t;
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
function Pr(t, e, n = 0) {
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
class dh {
  constructor(e = ah.slice(), n = ((a) => (a = al("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Vy) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ic(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ew(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function hh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Aw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ic(t.outputLen), ic(t.blockLen);
}
function $w(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function vw(t, e) {
  hh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Lr = {
  number: ic,
  bool: Ew,
  bytes: hh,
  hash: Aw,
  exists: $w,
  output: vw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ma = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), en = (t, e) => t << 32 - e | t >>> e, Iw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Iw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Lw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ul(t) {
  if (typeof t == "string" && (t = Lw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ph = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function es(t) {
  const e = (r) => t().update(ul(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let gh = class extends ph {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Lr.hash(e);
    const r = ul(n);
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
};
const Zo = (t, e, n) => new gh(t, e).update(n).digest();
Zo.create = (t, e) => new gh(t, e);
function kw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let fl = class extends ph {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ma(this.buffer);
  }
  update(e) {
    Lr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ul(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ma(e);
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
    kw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ma(e), c = this.outputLen;
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
]), Fn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), jn = new Uint32Array(64);
let yh = class extends fl {
  constructor() {
    super(64, 32, 8, !1), this.A = Fn[0] | 0, this.B = Fn[1] | 0, this.C = Fn[2] | 0, this.D = Fn[3] | 0, this.E = Fn[4] | 0, this.F = Fn[5] | 0, this.G = Fn[6] | 0, this.H = Fn[7] | 0;
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
      jn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = jn[l - 15], h = jn[l - 2], y = en(g, 7) ^ en(g, 18) ^ g >>> 3, w = en(h, 17) ^ en(h, 19) ^ h >>> 10;
      jn[l] = w + jn[l - 7] + y + jn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = en(a, 6) ^ en(a, 11) ^ en(a, 25), h = d + g + Cw(a, c, f) + Tw[l] + jn[l] | 0, w = (en(r, 2) ^ en(r, 13) ^ en(r, 22)) + Bw(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    jn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Mw = class extends yh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Cs = es(() => new yh());
es(() => new Mw());
const _w = {}, wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _w
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const xt = BigInt(0), jt = BigInt(1), dr = BigInt(2), oi = BigInt(3), Hu = BigInt(8), Ct = Object.freeze({
  a: xt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: jt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Pu = (t, e) => (t + e / dr) / e, Fi = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Ct, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -jt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Pu(i * t, e), c = Pu(-r * t, e);
    let f = j(t - a * n - c * s, e), d = j(-a * r - c * i, e);
    const l = f > o, g = d > o;
    if (l && (f = e - f), g && (d = e - d), f > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: d };
  }
}, Xe = 32, Or = 32, bh = 32, $o = Xe + 1, vo = 2 * Xe + 1;
function Ou(t) {
  const { a: e, b: n } = Ct, r = j(t * t), s = j(r * t);
  return j(s + e * t + n);
}
const ji = Ct.a === xt;
class dl extends Error {
  constructor(e) {
    super(e);
  }
}
function Du(t) {
  if (!(t instanceof At))
    throw new TypeError("JacobianPoint expected");
}
class At {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof ht))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(ht.ZERO) ? At.ZERO : new At(e.x, e.y, jt);
  }
  static toAffineBatch(e) {
    const n = Ow(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return At.toAffineBatch(e).map(At.fromAffine);
  }
  equals(e) {
    Du(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = j(s * s), f = j(a * a), d = j(n * f), l = j(i * c), g = j(j(r * a) * f), h = j(j(o * s) * c);
    return d === l && g === h;
  }
  negate() {
    return new At(this.x, j(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = j(e * e), i = j(n * n), o = j(i * i), a = e + i, c = j(dr * (j(a * a) - s - o)), f = j(oi * s), d = j(f * f), l = j(d - dr * c), g = j(f * (c - l) - Hu * o), h = j(dr * n * r);
    return new At(l, g, h);
  }
  add(e) {
    Du(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === xt || o === xt)
      return this;
    if (n === xt || r === xt)
      return e;
    const c = j(s * s), f = j(a * a), d = j(n * f), l = j(i * c), g = j(j(r * a) * f), h = j(j(o * s) * c), y = j(l - d), w = j(h - g);
    if (y === xt)
      return w === xt ? this.double() : At.ZERO;
    const $ = j(y * y), H = j(y * $), U = j(d * $), b = j(w * w - H - dr * U), L = j(w * (U - b) - g * H), A = j(s * a * y);
    return new At(b, L, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = At.ZERO;
    if (typeof e == "bigint" && e === xt)
      return n;
    let r = zu(e);
    if (r === jt)
      return this;
    if (!ji) {
      let l = n, g = this;
      for (; r > xt; )
        r & jt && (l = l.add(g)), g = g.double(), r >>= jt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Fi.splitScalar(r), c = n, f = n, d = this;
    for (; i > xt || a > xt; )
      i & jt && (c = c.add(d)), a & jt && (f = f.add(d)), d = d.double(), i >>= jt, a >>= jt;
    return s && (c = c.negate()), o && (f = f.negate()), f = new At(j(f.x * Fi.beta), f.y, f.z), c.add(f);
  }
  precomputeWindow(e) {
    const n = ji ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(At.BASE) && (n = ht.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && oc.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = At.normalizeZ(s), oc.set(n, s)));
    let i = At.ZERO, o = At.BASE;
    const a = 1 + (ji ? 128 / r : 256 / r), c = 2 ** (r - 1), f = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let y = Number(e & f);
      e >>= l, y > c && (y -= d, e += jt);
      const w = h, $ = h + Math.abs(y) - 1, H = g % 2 !== 0, U = y < 0;
      y === 0 ? o = o.add(zi(H, s[w])) : i = i.add(zi(U, s[$]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = zu(e), s, i;
    if (ji) {
      const { k1neg: o, k1: a, k2neg: c, k2: f } = Fi.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(f, n);
      d = zi(o, d), g = zi(c, g), g = new At(j(g.x * Fi.beta), g.y, g.z), s = d.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return At.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(At.ZERO);
    e == null && (e = i ? Hu : Ws(s));
    const o = e, a = j(o * o), c = j(a * o), f = j(n * a), d = j(r * c), l = j(s * o);
    if (i)
      return ht.ZERO;
    if (l !== jt)
      throw new Error("invZ was invalid");
    return new ht(f, d);
  }
}
At.BASE = new At(Ct.Gx, Ct.Gy, jt);
At.ZERO = new At(xt, jt, xt);
function zi(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const oc = /* @__PURE__ */ new WeakMap();
class ht {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, oc.delete(this);
  }
  hasEvenY() {
    return this.y % dr === xt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Me(n ? e : e.subarray(1));
    if (!go(r))
      throw new Error("Point is not on curve");
    const s = Ou(r);
    let i = Pw(s);
    const o = (i & jt) === jt;
    n ? o && (i = j(-i)) : (e[0] & 1) === 1 !== o && (i = j(-i));
    const a = new ht(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Me(e.subarray(1, Xe + 1)), r = Me(e.subarray(Xe + 1, Xe * 2 + 1)), s = new ht(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = hn(e), r = n.length, s = n[0];
    if (r === Xe)
      return this.fromCompressedHex(n);
    if (r === $o && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === vo && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${$o} compressed bytes or ${vo} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return ht.BASE.multiply(Dr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Sh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = hl(hn(e)), { n: a } = Ct, c = r === 2 || r === 3 ? s + a : s, f = Ws(c, a), d = j(-o * f, a), l = j(i * f, a), g = r & 1 ? "03" : "02", h = ht.fromHex(g + pr(c)), y = ht.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!y)
      throw new Error("Cannot recover signature: point at infinify");
    return y.assertValidity(), y;
  }
  toRawBytes(e = !1) {
    return gr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = pr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${pr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!go(n) || !go(r))
      throw new Error(e);
    const s = j(r * r), i = Ou(n);
    if (j(s - i) !== xt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new ht(this.x, j(-this.y));
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
    const s = At.fromAffine(this), i = n === xt || n === jt || this !== ht.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = At.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(At.ZERO) ? void 0 : a.toAffine();
  }
}
ht.BASE = new ht(Ct.Gx, Ct.Gy);
ht.ZERO = new ht(xt, xt);
function Fu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function ju(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Bs(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Me(n), left: t.subarray(e + 2) };
}
function Uw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Bs(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = ju(t.subarray(2)), { data: r, left: s } = ju(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Bs(s)}`);
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
    const s = n ? Bs(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Te(Io(s.slice(0, 64)), Io(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Uw(n ? e : gr(e));
    return new Te(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ms(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ms(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Ct.n >> jt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Te(this.r, j(-this.s, Ct.n)) : this;
  }
  toDERRawBytes() {
    return gr(this.toDERHex());
  }
  toDERHex() {
    const e = Fu(ni(this.s)), n = Fu(ni(this.r)), r = e.length / 2, s = n.length / 2, i = ni(r), o = ni(s);
    return `30${ni(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return gr(this.toCompactHex());
  }
  toCompactHex() {
    return pr(this.r) + pr(this.s);
  }
}
function ur(...t) {
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
function Bs(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Nw[t[n]];
  return e;
}
const Hw = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function pr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(xt <= t && t < Hw))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ts(t) {
  const e = gr(pr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ni(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Io(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function gr(t) {
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
  return Io(Bs(t));
}
function hn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : gr(t);
}
function zu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ms(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function j(t, e = Ct.P) {
  const n = t % e;
  return n >= xt ? n : e + n;
}
function Ue(t, e) {
  const { P: n } = Ct;
  let r = t;
  for (; e-- > xt; )
    r *= r, r %= n;
  return r;
}
function Pw(t) {
  const { P: e } = Ct, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, f = c * c * t % e, d = Ue(f, oi) * f % e, l = Ue(d, oi) * f % e, g = Ue(l, dr) * c % e, h = Ue(g, r) * g % e, y = Ue(h, s) * h % e, w = Ue(y, o) * y % e, $ = Ue(w, a) * w % e, H = Ue($, o) * y % e, U = Ue(H, oi) * f % e, b = Ue(U, i) * h % e, L = Ue(b, n) * c % e, A = Ue(L, dr);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function Ws(t, e = Ct.P) {
  if (t === xt || e <= xt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = j(t, e), r = e, s = xt, i = jt;
  for (; n !== xt; ) {
    const a = r / n, c = r % n, f = s - i * a;
    r = n, n = c, s = i, i = f;
  }
  if (r !== jt)
    throw new Error("invert: does not exist");
  return j(s, e);
}
function Ow(t, e = Ct.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === xt ? i : (n[a] = i, j(i * o, e)), jt), s = Ws(r, e);
  return t.reduceRight((i, o, a) => o === xt ? i : (n[a] = j(i * n[a], e), j(i * o, e)), s), n;
}
function Dw(t) {
  const e = t.length * 8 - Or * 8, n = Me(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function hl(t, e = !1) {
  const n = Dw(t);
  if (e)
    return n;
  const { n: r } = Ct;
  return n >= r ? n - r : n;
}
let vs, ai;
class mh {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Wt.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ai(this.k, ...e);
  }
  checkSync() {
    if (typeof ai != "function")
      throw new dl("hmacSha256Sync needs to be set");
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
    return ur(...n);
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
    return ur(...n);
  }
}
function Ms(t) {
  return xt < t && t < Ct.n;
}
function go(t) {
  return xt < t && t < Ct.P;
}
function xh(t, e, n, r = !0) {
  const { n: s } = Ct, i = hl(t, !0);
  if (!Ms(i))
    return;
  const o = Ws(i, s), a = ht.BASE.multiply(i), c = j(a.x, s);
  if (c === xt)
    return;
  const f = j(o * j(e + n * c, s), s);
  if (f === xt)
    return;
  let d = new Te(c, f), l = (a.x === d.r ? 0 : 2) | Number(a.y & jt);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Dr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Or)
      throw new Error("Expected 32 bytes of private key");
    e = Io(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Or)
      throw new Error("Expected 32 bytes of private key");
    e = Me(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ms(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function pl(t) {
  return t instanceof ht ? (t.assertValidity(), t) : ht.fromHex(t);
}
function Sh(t) {
  if (t instanceof Te)
    return t.assertValidity(), t;
  try {
    return Te.fromDER(t);
  } catch {
    return Te.fromCompact(t);
  }
}
function ki(t, e = !1) {
  return ht.fromPrivateKey(t).toRawBytes(e);
}
function Fw(t, e, n, r = !1) {
  return ht.fromSignature(t, e, n).toRawBytes(r);
}
function Ru(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === $o || r === vo : n ? r === $o * 2 || r === vo * 2 : t instanceof ht;
}
function gl(t, e, n = !1) {
  if (Ru(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Ru(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = pl(e);
  return r.assertValidity(), r.multiply(Dr(t)).toRawBytes(n);
}
function Eh(t) {
  const e = t.length > Xe ? t.slice(0, Xe) : t;
  return Me(e);
}
function jw(t) {
  const e = Eh(t), n = j(e, Ct.n);
  return Ah(n < xt ? e : n);
}
function Ah(t) {
  return Ts(t);
}
function $h(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = hn(t), s = Dr(e), i = [Ah(s), jw(r)];
  if (n != null) {
    n === !0 && (n = Wt.randomBytes(Xe));
    const c = hn(n);
    if (c.length !== Xe)
      throw new Error(`sign: Expected ${Xe} bytes of extra data`);
    i.push(c);
  }
  const o = ur(...i), a = Eh(r);
  return { seed: o, m: a, d: s };
}
function vh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function zw(t, e, n = {}) {
  const { seed: r, m: s, d: i } = $h(t, e, n.extraEntropy), o = new mh(bh, Or);
  await o.reseed(r);
  let a;
  for (; !(a = xh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return vh(a, n);
}
function Qo(t, e, n = {}) {
  const { seed: r, m: s, d: i } = $h(t, e, n.extraEntropy), o = new mh(bh, Or);
  o.reseedSync(r);
  let a;
  for (; !(a = xh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return vh(a, n);
}
const Rw = { strict: !0 };
function Gw(t, e, n, r = Rw) {
  let s;
  try {
    s = Sh(t), e = hn(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = hl(e);
  let c;
  try {
    c = pl(n);
  } catch {
    return !1;
  }
  const { n: f } = Ct, d = Ws(o, f), l = j(a * d, f), g = j(i * d, f), h = ht.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? j(h.x, f) === i : !1;
}
function Lo(t) {
  return j(Me(t), Ct.n);
}
class _s {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = hn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Me(n.subarray(0, 32)), s = Me(n.subarray(32, 64));
    return new _s(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!go(e) || !Ms(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return pr(this.r) + pr(this.s);
  }
  toRawBytes() {
    return gr(this.toHex());
  }
}
function Kw(t) {
  return ht.fromPrivateKey(t).toRawX();
}
class Ih {
  constructor(e, n, r = Wt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = hn(e);
    const { x: s, scalar: i } = this.getScalar(Dr(n));
    if (this.px = s, this.d = i, this.rand = hn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = ht.fromPrivateKey(e), r = n.hasEvenY() ? e : Ct.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ts(e ^ Me(n));
  }
  finalizeNonce(e) {
    const n = j(Me(e), Ct.n);
    if (n === xt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new _s(e.x, j(n + r * s, Ct.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Wt.taggedHash, o = this.initNonce(n, await i(lr.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(await i(lr.nonce, o, r, e)), d = Lo(await i(lr.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return await Ch(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Wt.taggedHashSync, o = this.initNonce(n, i(lr.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(i(lr.nonce, o, r, e)), d = Lo(i(lr.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return Bh(l, e, r) || this.error(), l;
  }
}
async function Vw(t, e, n) {
  return new Ih(t, e, n).calc();
}
function qw(t, e, n) {
  return new Ih(t, e, n).calcSync();
}
function Lh(t, e, n) {
  const r = t instanceof _s, s = r ? t : _s.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: hn(e),
    P: pl(n)
  };
}
function kh(t, e, n, r) {
  const s = ht.BASE.multiplyAndAddUnsafe(e, Dr(n), j(-r, Ct.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Ch(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Lh(t, e, n), a = Lo(await Wt.taggedHash(lr.challenge, Ts(r), o.toRawX(), i));
    return kh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Bh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Lh(t, e, n), a = Lo(Wt.taggedHashSync(lr.challenge, Ts(r), o.toRawX(), i));
    return kh(r, o, s, a);
  } catch (r) {
    if (r instanceof dl)
      throw r;
    return !1;
  }
}
const Ww = {
  Signature: _s,
  getPublicKey: Kw,
  sign: Vw,
  verify: Ch,
  signSync: qw,
  verifySync: Bh
};
ht.BASE._setWindowSize(8);
const Ie = {
  node: wh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, lr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ri = {}, Wt = {
  bytesToHex: Bs,
  hexToBytes: gr,
  concatBytes: ur,
  mod: j,
  invert: Ws,
  isValidPrivateKey(t) {
    try {
      return Dr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ts,
  _normalizePrivateKey: Dr,
  hashToPrivateKey: (t) => {
    t = hn(t);
    const e = Or + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = j(Me(t), Ct.n - jt) + jt;
    return Ts(n);
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
  randomPrivateKey: () => Wt.hashToPrivateKey(Wt.randomBytes(Or + 8)),
  precompute(t = 8, e = ht.BASE) {
    const n = e === ht.BASE ? e : new ht(e.x, e.y);
    return n._setWindowSize(t), n.multiply(oi), n;
  },
  sha256: async (...t) => {
    if (Ie.web) {
      const e = await Ie.web.subtle.digest("SHA-256", ur(...t));
      return new Uint8Array(e);
    } else if (Ie.node) {
      const { createHash: e } = Ie.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Ie.web) {
      const n = await Ie.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ur(...e), s = await Ie.web.subtle.sign("HMAC", n, r);
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
    let n = Ri[t];
    if (n === void 0) {
      const r = await Wt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ur(r, r), Ri[t] = n;
    }
    return Wt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof vs != "function")
      throw new dl("sha256Sync is undefined, you need to set it");
    let n = Ri[t];
    if (n === void 0) {
      const r = vs(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ur(r, r), Ri[t] = n;
    }
    return vs(n, ...e);
  },
  _JacobianPoint: At
};
Object.defineProperties(Wt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return vs;
    },
    set(t) {
      vs || (vs = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ai;
    },
    set(t) {
      ai || (ai = t);
    }
  }
});
const Xw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Ct,
  Point: ht,
  Signature: Te,
  getPublicKey: ki,
  getSharedSecret: gl,
  recoverPublicKey: Fw,
  schnorr: Ww,
  sign: zw,
  signSync: Qo,
  utils: Wt,
  verify: Gw
}, Symbol.toStringTag, { value: "Module" }));
var Ci = {};
Ci.byteLength = tb;
var Yw = Ci.toByteArray = nb, Zw = Ci.fromByteArray = ib, an = [], He = [], Qw = typeof Uint8Array < "u" ? Uint8Array : Array, _a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ps = 0, Jw = _a.length; ps < Jw; ++ps)
  an[ps] = _a[ps], He[_a.charCodeAt(ps)] = ps;
He[45] = 62;
He[95] = 63;
function Th(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function tb(t) {
  var e = Th(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function eb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function nb(t) {
  var e, n = Th(t), r = n[0], s = n[1], i = new Qw(eb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = He[t.charCodeAt(c)] << 18 | He[t.charCodeAt(c + 1)] << 12 | He[t.charCodeAt(c + 2)] << 6 | He[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = He[t.charCodeAt(c)] << 2 | He[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = He[t.charCodeAt(c)] << 10 | He[t.charCodeAt(c + 1)] << 4 | He[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function rb(t) {
  return an[t >> 18 & 63] + an[t >> 12 & 63] + an[t >> 6 & 63] + an[t & 63];
}
function sb(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(rb(r));
  return s.join("");
}
function ib(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(sb(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    an[e >> 2] + an[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    an[e >> 10] + an[e >> 4 & 63] + an[e << 2 & 63] + "="
  )), s.join("");
}
function ob() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const ab = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function cb() {
  if (ob())
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
    throw new Error(ab);
  }
}
class lb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(dn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(dn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class ub {
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
async function Mh() {
  const t = await cb();
  return t.name === "subtleCrypto" ? new ub(t.lib) : new lb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function fb(t) {
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
    for (var y = 0, w = 0, $ = 0, H = h.length; $ !== H && h[$] === 0; )
      $++, y++;
    for (var U = (H - $) * f + 1 >>> 0, b = new Uint8Array(U); $ !== H; ) {
      for (var L = h[$], A = 0, N = U - 1; (L !== 0 || A < w) && N !== -1; N--, A++)
        L += 256 * b[N] >>> 0, b[N] = L % o >>> 0, L = L / o >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      w = A, $++;
    }
    for (var q = U - w; q !== U && b[q] === 0; )
      q++;
    for (var F = a.repeat(y); q < U; ++q)
      F += t.charAt(b[q]);
    return F;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var y = 0, w = 0, $ = 0; h[y] === a; )
      w++, y++;
    for (var H = (h.length - y) * c + 1 >>> 0, U = new Uint8Array(H); h[y]; ) {
      var b = h.charCodeAt(y);
      if (b > 255)
        return;
      var L = e[b];
      if (L === 255)
        return;
      for (var A = 0, N = H - 1; (L !== 0 || A < $) && N !== -1; N--, A++)
        L += o * U[N] >>> 0, U[N] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      $ = A, y++;
    }
    for (var q = H - $; q !== H && U[q] === 0; )
      q++;
    for (var F = new Uint8Array(w + (H - q)), K = w; q !== H; )
      F[K++] = U[q++];
    return F;
  }
  function g(h) {
    var y = l(h);
    if (y)
      return y;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var _h = fb;
const db = _h, hb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var pb = db(hb);
const gb = /* @__PURE__ */ rh(pb), yb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Uh = Uint8Array.from({ length: 16 }, (t, e) => e), wb = Uh.map((t) => (9 * t + 5) % 16);
let yl = [Uh], wl = [wb];
for (let t = 0; t < 4; t++)
  for (let e of [yl, wl])
    e.push(e[t].map((n) => yb[n]));
const Nh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), bb = yl.map((t, e) => t.map((n) => Nh[e][n])), mb = wl.map((t, e) => t.map((n) => Nh[e][n])), xb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Sb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Gi = (t, e) => t << e | t >>> 32 - e;
function Gu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ki = new Uint32Array(16);
let Eb = class extends fl {
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
      Ki[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = xb[h], $ = Sb[h], H = yl[h], U = wl[h], b = bb[h], L = mb[h];
      for (let A = 0; A < 16; A++) {
        const N = Gi(r + Gu(h, i, a, f) + Ki[H[A]] + w, b[A]) + l | 0;
        r = l, l = f, f = Gi(a, 10) | 0, a = i, i = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = Gi(s + Gu(y, o, c, d) + Ki[U[A]] + $, L[A]) + g | 0;
        s = g, g = d, d = Gi(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ki.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Ab = es(() => new Eb());
function $b(t) {
  return Ab(t);
}
const Vi = BigInt(2 ** 32 - 1), ac = BigInt(32);
function Hh(t, e = !1) {
  return e ? { h: Number(t & Vi), l: Number(t >> ac & Vi) } : { h: Number(t >> ac & Vi) | 0, l: Number(t & Vi) | 0 };
}
function vb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Hh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Ib = (t, e) => BigInt(t >>> 0) << ac | BigInt(e >>> 0), Lb = (t, e, n) => t >>> n, kb = (t, e, n) => t << 32 - n | e >>> n, Cb = (t, e, n) => t >>> n | e << 32 - n, Bb = (t, e, n) => t << 32 - n | e >>> n, Tb = (t, e, n) => t << 64 - n | e >>> n - 32, Mb = (t, e, n) => t >>> n - 32 | e << 64 - n, _b = (t, e) => e, Ub = (t, e) => t, Nb = (t, e, n) => t << n | e >>> 32 - n, Hb = (t, e, n) => e << n | t >>> 32 - n, Pb = (t, e, n) => e << n - 32 | t >>> 64 - n, Ob = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Db(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Fb = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), jb = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, zb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Rb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Gb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Kb = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, at = {
  fromBig: Hh,
  split: vb,
  toBig: Ib,
  shrSH: Lb,
  shrSL: kb,
  rotrSH: Cb,
  rotrSL: Bb,
  rotrBH: Tb,
  rotrBL: Mb,
  rotr32H: _b,
  rotr32L: Ub,
  rotlSH: Nb,
  rotlSL: Hb,
  rotlBH: Pb,
  rotlBL: Ob,
  add: Db,
  add3L: Fb,
  add3H: jb,
  add4L: zb,
  add4H: Rb,
  add5H: Kb,
  add5L: Gb
}, [Vb, qb] = at.split([
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
].map((t) => BigInt(t))), zn = new Uint32Array(80), Rn = new Uint32Array(80);
let Jo = class extends fl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      zn[b] = e.getUint32(n), Rn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = zn[b - 15] | 0, A = Rn[b - 15] | 0, N = at.rotrSH(L, A, 1) ^ at.rotrSH(L, A, 8) ^ at.shrSH(L, A, 7), q = at.rotrSL(L, A, 1) ^ at.rotrSL(L, A, 8) ^ at.shrSL(L, A, 7), F = zn[b - 2] | 0, K = Rn[b - 2] | 0, m = at.rotrSH(F, K, 19) ^ at.rotrBH(F, K, 61) ^ at.shrSH(F, K, 6), k = at.rotrSL(F, K, 19) ^ at.rotrBL(F, K, 61) ^ at.shrSL(F, K, 6), O = at.add4L(q, k, Rn[b - 7], Rn[b - 16]), z = at.add4H(O, N, m, zn[b - 7], zn[b - 16]);
      zn[b] = z | 0, Rn[b] = O | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: y, Gh: w, Gl: $, Hh: H, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = at.rotrSH(l, g, 14) ^ at.rotrSH(l, g, 18) ^ at.rotrBH(l, g, 41), A = at.rotrSL(l, g, 14) ^ at.rotrSL(l, g, 18) ^ at.rotrBL(l, g, 41), N = l & h ^ ~l & w, q = g & y ^ ~g & $, F = at.add5L(U, A, q, qb[b], Rn[b]), K = at.add5H(F, H, L, N, Vb[b], zn[b]), m = F | 0, k = at.rotrSH(r, s, 28) ^ at.rotrBH(r, s, 34) ^ at.rotrBH(r, s, 39), O = at.rotrSL(r, s, 28) ^ at.rotrBL(r, s, 34) ^ at.rotrBL(r, s, 39), z = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      H = w | 0, U = $ | 0, w = h | 0, $ = y | 0, h = l | 0, y = g | 0, { h: l, l: g } = at.add(f | 0, d | 0, K | 0, m | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = at.add3L(m, O, J);
      r = at.add3H(W, K, k, z), s = W | 0;
    }
    ({ h: r, l: s } = at.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = at.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = at.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = at.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = at.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: y } = at.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: $ } = at.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: H, l: U } = at.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, y, w, $, H, U);
  }
  roundClean() {
    zn.fill(0), Rn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Wb = class extends Jo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Xb = class extends Jo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Yb = class extends Jo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Zb = es(() => new Jo());
es(() => new Wb());
es(() => new Xb());
es(() => new Yb());
function Ph(t) {
  return Cs(t);
}
function Qb(t) {
  return Zb(t);
}
const Jb = 0;
Wt.hmacSha256Sync = (t, ...e) => {
  const n = Zo.create(Cs, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function t1() {
  return nt(Wt.randomPrivateKey());
}
function e1(t) {
  const e = Cs(Cs(t));
  return gb.encode(dn(t, e).slice(0, t.length + 4));
}
function n1(t, e) {
  return e1(dn(new Uint8Array([t]), e.slice(0, 20)));
}
function Oh(t, e = Jb) {
  const n = typeof t == "string" ? St(t) : t, r = $b(Ph(n));
  return n1(e, r);
}
function Dh(t) {
  const e = ll(t);
  return nt(ki(e.slice(0, 32), !0));
}
Wt.hmacSha256Sync = (t, ...e) => {
  const n = Zo.create(Cs, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ko;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ko || (ko = {}));
async function r1(t, e, n) {
  return await (await Mh()).encrypt("aes-256-cbc", e, t, n);
}
async function s1(t, e, n) {
  return await (await Mh()).decrypt("aes-256-cbc", e, t, n);
}
function Fh(t, e) {
  return Zo(Cs, t, e);
}
function i1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function jh(t) {
  const e = Qb(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function o1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function a1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ko.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ko.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !o1(t))
    return e;
  try {
    return ht.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function c1(t, e, n, r) {
  const s = a1(t);
  if (!s.result)
    throw s;
  const i = Wt.randomPrivateKey(), o = ki(i, !0);
  let a = gl(i, t, !0);
  a = a.slice(1);
  const c = jh(a), f = Wt.randomBytes(16), d = await r1(f, c.encryptionKey, e), l = dn(f, o, d), g = Fh(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = nt(d);
  else if (r === "base64")
    h = Zw(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const y = {
    iv: nt(f),
    ephemeralPK: nt(o),
    cipherText: h,
    mac: nt(g),
    wasString: n
  };
  return r && r !== "hex" && (y.cipherTextEncoding = r), y;
}
async function zh(t, e) {
  if (!e.ephemeralPK)
    throw new Mu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = gl(t, n, !0);
  r = r.slice(1);
  const s = jh(r), i = St(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = St(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Yw(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = dn(i, St(n), o), c = Fh(s.hmacKey, a), f = St(e.mac);
  if (!i1(f, c))
    throw new Mu("Decryption failed: failure in MAC check");
  const d = await s1(i, s.encryptionKey, o);
  return e.wasString ? Li(d) : d;
}
function l1(t, e) {
  const n = typeof e == "string" ? ts(e) : e, r = Dh(t), s = Ph(n), i = Qo(s, t);
  return {
    signature: nt(i),
    publicKey: r
  };
}
async function u1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Dh(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? ts(t) : t, o = await c1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = l1(r, a), f = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(f);
  }
  return a;
}
function f1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return zh(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var oe = {}, Us = {}, he = {};
Object.defineProperty(he, "__esModule", { value: !0 });
he.decode = he.encode = he.unescape = he.escape = he.pad = void 0;
const Rh = Ci;
function bl(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
he.pad = bl;
function Gh(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
he.escape = Gh;
function Kh(t) {
  return bl(t).replace(/-/g, "+").replace(/_/g, "/");
}
he.unescape = Kh;
function d1(t) {
  return Gh((0, Rh.fromByteArray)(new TextEncoder().encode(t)));
}
he.encode = d1;
function h1(t) {
  return new TextDecoder().decode((0, Rh.toByteArray)(bl(Kh(t))));
}
he.decode = h1;
var ta = {}, ea = {}, Vh = {}, qh = {}, na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
na.crypto = void 0;
na.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = f, t.clean = d, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = y, t.byteSwap32 = w, t.bytesToHex = U, t.hexToBytes = A, t.asyncLoop = q, t.utf8ToBytes = F, t.bytesToUtf8 = K, t.toBytes = m, t.kdfInputToBytes = k, t.concatBytes = O, t.checkOpts = z, t.createHasher = W, t.createOptHasher = ne, t.createXOFer = Nt, t.randomBytes = kt;
  const e = na;
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
    const ot = T.outputLen;
    if (S.length < ot)
      throw new Error("digestInto() expects output buffer of length at least " + ot);
  }
  function c(S) {
    return new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
  }
  function f(S) {
    return new Uint32Array(S.buffer, S.byteOffset, Math.floor(S.byteLength / 4));
  }
  function d(...S) {
    for (let T = 0; T < S.length; T++)
      S[T].fill(0);
  }
  function l(S) {
    return new DataView(S.buffer, S.byteOffset, S.byteLength);
  }
  function g(S, T) {
    return S << 32 - T | S >>> T;
  }
  function h(S, T) {
    return S << T | S >>> 32 - T >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function y(S) {
    return S << 24 & 4278190080 | S << 8 & 16711680 | S >>> 8 & 65280 | S >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (S) => S : (S) => y(S), t.byteSwapIfBE = t.swap8IfBE;
  function w(S) {
    for (let T = 0; T < S.length; T++)
      S[T] = y(S[T]);
    return S;
  }
  t.swap32IfBE = t.isLE ? (S) => S : w;
  const $ = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", H = /* @__PURE__ */ Array.from({ length: 256 }, (S, T) => T.toString(16).padStart(2, "0"));
  function U(S) {
    if (s(S), $)
      return S.toHex();
    let T = "";
    for (let ot = 0; ot < S.length; ot++)
      T += H[S[ot]];
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
    if ($)
      return Uint8Array.fromHex(S);
    const T = S.length, ot = T / 2;
    if (T % 2)
      throw new Error("hex string expected, got unpadded hex of length " + T);
    const I = new Uint8Array(ot);
    for (let M = 0, D = 0; M < ot; M++, D += 2) {
      const tt = L(S.charCodeAt(D)), et = L(S.charCodeAt(D + 1));
      if (tt === void 0 || et === void 0) {
        const Ht = S[D] + S[D + 1];
        throw new Error('hex string expected, got non-hex character "' + Ht + '" at index ' + D);
      }
      I[M] = tt * 16 + et;
    }
    return I;
  }
  const N = async () => {
  };
  t.nextTick = N;
  async function q(S, T, ot) {
    let I = Date.now();
    for (let M = 0; M < S; M++) {
      ot(M);
      const D = Date.now() - I;
      D >= 0 && D < T || (await (0, t.nextTick)(), I += D);
    }
  }
  function F(S) {
    if (typeof S != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(S));
  }
  function K(S) {
    return new TextDecoder().decode(S);
  }
  function m(S) {
    return typeof S == "string" && (S = F(S)), s(S), S;
  }
  function k(S) {
    return typeof S == "string" && (S = F(S)), s(S), S;
  }
  function O(...S) {
    let T = 0;
    for (let I = 0; I < S.length; I++) {
      const M = S[I];
      s(M), T += M.length;
    }
    const ot = new Uint8Array(T);
    for (let I = 0, M = 0; I < S.length; I++) {
      const D = S[I];
      ot.set(D, M), M += D.length;
    }
    return ot;
  }
  function z(S, T) {
    if (T !== void 0 && {}.toString.call(T) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(S, T);
  }
  class J {
  }
  t.Hash = J;
  function W(S) {
    const T = (I) => S().update(m(I)).digest(), ot = S();
    return T.outputLen = ot.outputLen, T.blockLen = ot.blockLen, T.create = () => S(), T;
  }
  function ne(S) {
    const T = (I, M) => S(M).update(m(I)).digest(), ot = S({});
    return T.outputLen = ot.outputLen, T.blockLen = ot.blockLen, T.create = (I) => S(I), T;
  }
  function Nt(S) {
    const T = (I, M) => S(M).update(m(I)).digest(), ot = S({});
    return T.outputLen = ot.outputLen, T.blockLen = ot.blockLen, T.create = (I) => S(I), T;
  }
  t.wrapConstructor = W, t.wrapConstructorWithOpts = ne, t.wrapXOFConstructorWithOpts = Nt;
  function kt(S = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(S));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(S));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(qh);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = qh;
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
})(Vh);
const gs = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Wh(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function cc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function ns(t, ...e) {
  if (!Wh(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function p1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  cc(t.outputLen), cc(t.blockLen);
}
function lc(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xh(t, e) {
  ns(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function g1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function y1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Co(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function yo(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Re(t, e) {
  return t << 32 - e | t >>> e;
}
function w1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const ml = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function xl(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Yh = ml ? (t) => t : (t) => xl(t), b1 = Yh;
function Zh(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = xl(t[e]);
  return t;
}
const m1 = ml ? (t) => t : Zh, Qh = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", x1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function S1(t) {
  if (ns(t), Qh)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += x1[t[n]];
  return e;
}
const In = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ku(t) {
  if (t >= In._0 && t <= In._9)
    return t - In._0;
  if (t >= In.A && t <= In.F)
    return t - (In.A - 10);
  if (t >= In.a && t <= In.f)
    return t - (In.a - 10);
}
function E1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Qh)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Ku(t.charCodeAt(i)), a = Ku(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Jh = async () => {
};
async function A1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Jh(), r += i);
  }
}
function Sl(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function $1(t) {
  return new TextDecoder().decode(t);
}
function Bi(t) {
  return typeof t == "string" && (t = Sl(t)), ns(t), t;
}
function v1(t) {
  return typeof t == "string" && (t = Sl(t)), ns(t), t;
}
function I1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    ns(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function L1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let t0 = class {
};
function ra(t) {
  const e = (r) => t().update(Bi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function e0(t) {
  const e = (r, s) => t(s).update(Bi(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function n0(t) {
  const e = (r, s) => t(s).update(Bi(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const k1 = ra, C1 = e0, B1 = n0;
function T1(t = 32) {
  if (gs && typeof gs.getRandomValues == "function")
    return gs.getRandomValues(new Uint8Array(t));
  if (gs && typeof gs.randomBytes == "function")
    return Uint8Array.from(gs.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const M1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: t0,
  abytes: ns,
  aexists: lc,
  ahash: p1,
  anumber: cc,
  aoutput: Xh,
  asyncLoop: A1,
  byteSwap: xl,
  byteSwap32: Zh,
  byteSwapIfBE: b1,
  bytesToHex: S1,
  bytesToUtf8: $1,
  checkOpts: L1,
  clean: Co,
  concatBytes: I1,
  createHasher: ra,
  createOptHasher: e0,
  createView: yo,
  createXOFer: n0,
  hexToBytes: E1,
  isBytes: Wh,
  isLE: ml,
  kdfInputToBytes: v1,
  nextTick: Jh,
  randomBytes: T1,
  rotl: w1,
  rotr: Re,
  swap32IfBE: m1,
  swap8IfBE: Yh,
  toBytes: Bi,
  u32: y1,
  u8: g1,
  utf8ToBytes: Sl,
  wrapConstructor: k1,
  wrapConstructorWithOpts: C1,
  wrapXOFConstructorWithOpts: B1
}, Symbol.toStringTag, { value: "Module" }));
function _1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
function U1(t, e, n) {
  return t & e ^ ~t & n;
}
function N1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class H1 extends t0 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = yo(this.buffer);
  }
  update(e) {
    lc(this), e = Bi(e), ns(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = yo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    lc(this), Xh(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Co(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    _1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = yo(e), c = this.outputLen;
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
const Gn = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Kn = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), P1 = /* @__PURE__ */ Uint32Array.from([
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
]), Vn = /* @__PURE__ */ new Uint32Array(64);
let El = class extends H1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Gn[0] | 0, this.B = Gn[1] | 0, this.C = Gn[2] | 0, this.D = Gn[3] | 0, this.E = Gn[4] | 0, this.F = Gn[5] | 0, this.G = Gn[6] | 0, this.H = Gn[7] | 0;
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
      Vn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Vn[l - 15], h = Vn[l - 2], y = Re(g, 7) ^ Re(g, 18) ^ g >>> 3, w = Re(h, 17) ^ Re(h, 19) ^ h >>> 10;
      Vn[l] = w + Vn[l - 7] + y + Vn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Re(a, 6) ^ Re(a, 11) ^ Re(a, 25), h = d + g + U1(a, c, f) + P1[l] + Vn[l] | 0, w = (Re(r, 2) ^ Re(r, 13) ^ Re(r, 22)) + N1(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    Co(Vn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Co(this.buffer);
  }
}, r0 = class extends El {
  constructor() {
    super(28), this.A = Kn[0] | 0, this.B = Kn[1] | 0, this.C = Kn[2] | 0, this.D = Kn[3] | 0, this.E = Kn[4] | 0, this.F = Kn[5] | 0, this.G = Kn[6] | 0, this.H = Kn[7] | 0;
  }
};
const O1 = /* @__PURE__ */ ra(() => new El()), D1 = /* @__PURE__ */ ra(() => new r0()), F1 = El, j1 = O1, z1 = r0, R1 = D1, G1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: z1,
  SHA256: F1,
  sha224: R1,
  sha256: j1
}, Symbol.toStringTag, { value: "Module" })), sa = /* @__PURE__ */ Xo(G1), K1 = /* @__PURE__ */ Xo(Xw);
var Ns = {};
Object.defineProperty(Ns, "__esModule", { value: !0 });
Ns.joseToDer = Ns.derToJose = void 0;
const s0 = Ci, i0 = he;
function Ua(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const V1 = {
  ES256: Ua(256),
  ES384: Ua(384),
  ES512: Ua(521)
};
function o0(t) {
  const e = V1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Bo = 128, a0 = 0, q1 = 32, W1 = 16, X1 = 2, c0 = W1 | q1 | a0 << 6, To = X1 | a0 << 6;
function l0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, s0.toByteArray)((0, i0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Y1(t, e) {
  const n = l0(t), r = o0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== c0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Bo | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== To)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const f = o;
  if (o += c, n[o++] !== To)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, h = r - d, y = new Uint8Array(g + c + h + d);
  for (o = 0; o < g; ++o)
    y[o] = 0;
  y.set(n.subarray(f + Math.max(-g, 0), f + c), o), o = r;
  for (const w = o; o < w + h; ++o)
    y[o] = 0;
  return y.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, i0.escape)((0, s0.fromByteArray)(y));
}
Ns.derToJose = Y1;
function Vu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Bo && --r, r;
}
function Z1(t, e) {
  t = l0(t);
  const n = o0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Vu(t, 0, n), i = Vu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, f = c < Bo, d = new Uint8Array((f ? 2 : 3) + c);
  let l = 0;
  return d[l++] = c0, f ? d[l++] = c : (d[l++] = Bo | 1, d[l++] = c & 255), d[l++] = To, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = To, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
Ns.joseToDer = Z1;
var Un = {};
Object.defineProperty(Un, "__esModule", { value: !0 });
Un.InvalidTokenError = Un.MissingParametersError = void 0;
class Q1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Un.MissingParametersError = Q1;
class J1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Un.InvalidTokenError = J1;
const Ti = /* @__PURE__ */ Xo(M1);
Object.defineProperty(ea, "__esModule", { value: !0 });
ea.SECP256K1Client = void 0;
const t2 = Vh, e2 = sa, wo = K1, qu = Ns, Wu = Un, Xu = Ti;
wo.utils.hmacSha256Sync = (t, ...e) => {
  const n = t2.hmac.create(e2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class u0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Xu.bytesToHex)(wo.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Wu.MissingParametersError("a signing input hash and private key are all required");
    const s = wo.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Xu.bytesToHex)(s);
    if (r === "jose")
      return (0, qu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, qu.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Wu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return wo.verify(n, e, r, { strict: !1 });
  }
}
ea.SECP256K1Client = u0;
u0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = ea;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ta);
var Fr = {};
const n2 = /* @__PURE__ */ Xo(wh);
var r2 = ge && ge.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.hashSha256Async = Fr.hashSha256 = void 0;
const s2 = sa;
function f0(t) {
  return (0, s2.sha256)(t);
}
Fr.hashSha256 = f0;
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
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(f0(t));
    }
  });
}
Fr.hashSha256Async = i2;
var o2 = ge && ge.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Us, "__esModule", { value: !0 });
Us.TokenSigner = Us.createUnsecuredToken = void 0;
const uc = he, Yu = ta, a2 = Un, Zu = Fr;
function fc(t, e) {
  const n = [], r = uc.encode(JSON.stringify(e));
  n.push(r);
  const s = uc.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function c2(t) {
  return fc(t, { typ: "JWT", alg: "none" }) + ".";
}
Us.createUnsecuredToken = c2;
class l2 {
  constructor(e, n) {
    if (!(e && n))
      throw new a2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Yu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Yu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = fc(e, s), o = (0, Zu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return o2(this, void 0, void 0, function* () {
      const s = this.header(r), i = fc(e, s), o = yield (0, Zu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [uc.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Us.TokenSigner = l2;
var ia = {};
Object.defineProperty(ia, "__esModule", { value: !0 });
ia.TokenVerifier = void 0;
const u2 = he, Qu = ta, f2 = Un, qi = Fr;
class d2 {
  constructor(e, n) {
    if (!(e && n))
      throw new f2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Qu.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Qu.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, qi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, qi.hashSha256)(s);
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
      return (0, qi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, qi.hashSha256)(r);
      return i(o);
    }
  }
}
ia.TokenVerifier = d2;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
oa.decodeToken = void 0;
const Wi = he;
function h2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Wi.decode(e[0])), r = JSON.parse(Wi.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Wi.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Wi.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
oa.decodeToken = h2;
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
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Us, t), n(ia, t), n(oa, t), n(Un, t), n(ta, t);
})(oe);
function p2(t) {
  return `did:btc-addr:${t}`;
}
function g2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Tu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Tu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function d0(t) {
  if (t)
    return g2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const y2 = "1.4.0";
function w2() {
  return t1();
}
function b2(t, e, n, r = ah.slice(), s, i = Zy().getTime(), o = {}) {
  const a = (h) => {
    const y = al("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return y == null ? void 0 : y.origin;
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
  }), f = oe.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [f];
  const d = Oh(f);
  return c.iss = p2(d), new oe.TokenSigner("ES256k", t).sign(c);
}
async function Ju(t, e) {
  const n = Li(St(e)), r = JSON.parse(n), s = await zh(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function m2(t) {
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
function x2(t) {
  const e = oe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = d0(e.iss);
  if (n.length === 1) {
    if (Oh(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function S2(t) {
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
function E2(t) {
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
function A2(t) {
  const e = [
    E2(t),
    S2(t),
    m2(t),
    x2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const tf = "1.0.0";
class yr {
  constructor(e) {
    this.version = tf, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== tf)
      throw new nc(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new yr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class h0 {
  constructor(e) {
    if (e) {
      const n = new yr(e);
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
class ef extends h0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new yr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new ch("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new yr({})), !0;
  }
}
class nf extends h0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Wy, !localStorage.getItem(this.key)) {
      const r = new yr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new ch("No session data was found in localStorage");
    const n = JSON.parse(e);
    return yr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new yr({})), !0;
  }
}
var pi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(pi || (pi = {}));
var Mo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Mo || (Mo = {}));
pi.Mainnet;
var Mn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Mn || (Mn = {}));
var ln;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ln || (ln = {}));
Mn.Mainnet;
const p0 = {
  chainId: pi.Mainnet,
  transactionVersion: Mn.Mainnet,
  peerNetworkId: Mo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ln.MainnetSingleSig,
    multiSig: ln.MainnetMultiSig
  },
  client: { baseUrl: lh }
}, dc = {
  chainId: pi.Testnet,
  transactionVersion: Mn.Testnet,
  peerNetworkId: Mo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ln.TestnetSingleSig,
    multiSig: ln.TestnetMultiSig
  },
  client: { baseUrl: uh }
}, bo = {
  ...dc,
  addressVersion: { ...dc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: fh }
}, $2 = {
  ...bo,
  addressVersion: { ...bo.addressVersion },
  client: { ...bo.client }
};
function v2(t) {
  switch (t) {
    case "mainnet":
      return p0;
    case "testnet":
      return dc;
    case "devnet":
      return bo;
    case "mocknet":
      return $2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function g0(t) {
  return typeof t == "string" ? v2(t) : t;
}
var rf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(rf || (rf = {}));
var sf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(sf || (sf = {}));
var Ge;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ge || (Ge = {}));
const Na = ["onChainOnly", "offChainOnly", "any"];
Na[0] + "", Ge.OnChainOnly, Na[1] + "", Ge.OffChainOnly, Na[2] + "", Ge.Any, Ge.OnChainOnly + "", Ge.OnChainOnly, Ge.OffChainOnly + "", Ge.OffChainOnly, Ge.Any + "", Ge.Any;
var of;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(of || (of = {}));
var af;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(af || (af = {}));
var cf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(cf || (cf = {}));
var Bn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Bn || (Bn = {}));
var lf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(lf || (lf = {}));
var uf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(uf || (uf = {}));
var ff;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(ff || (ff = {}));
var df;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(df || (df = {}));
var hf;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(hf || (hf = {}));
var pf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(pf || (pf = {}));
var gf;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(gf || (gf = {}));
var yf;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(yf || (yf = {}));
var wf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(wf || (wf = {}));
function hc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function I2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function y0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function L2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  hc(t.outputLen), hc(t.blockLen);
}
function k2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function C2(t, e) {
  y0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const kr = {
  number: hc,
  bool: I2,
  bytes: y0,
  hash: L2,
  exists: k2,
  output: C2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ha = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), nn = (t, e) => t << 32 - e | t >>> e, B2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!B2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function T2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Al(t) {
  if (typeof t == "string" && (t = T2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let w0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function rs(t) {
  const e = (r) => t().update(Al(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let b0 = class extends w0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, kr.hash(e);
    const r = Al(n);
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
    return kr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    kr.exists(this), kr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const m0 = (t, e, n) => new b0(t, e).update(n).digest();
m0.create = (t, e) => new b0(t, e);
function M2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let $l = class extends w0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ha(this.buffer);
  }
  update(e) {
    kr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Al(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ha(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    kr.exists(this), kr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    M2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ha(e), c = this.outputLen;
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
]), qn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Wn = new Uint32Array(64);
let x0 = class extends $l {
  constructor() {
    super(64, 32, 8, !1), this.A = qn[0] | 0, this.B = qn[1] | 0, this.C = qn[2] | 0, this.D = qn[3] | 0, this.E = qn[4] | 0, this.F = qn[5] | 0, this.G = qn[6] | 0, this.H = qn[7] | 0;
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
      Wn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Wn[l - 15], h = Wn[l - 2], y = nn(g, 7) ^ nn(g, 18) ^ g >>> 3, w = nn(h, 17) ^ nn(h, 19) ^ h >>> 10;
      Wn[l] = w + Wn[l - 7] + y + Wn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = nn(a, 6) ^ nn(a, 11) ^ nn(a, 25), h = d + g + _2(a, c, f) + N2[l] + Wn[l] | 0, w = (nn(r, 2) ^ nn(r, 13) ^ nn(r, 22)) + U2(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    Wn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, H2 = class extends x0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const S0 = rs(() => new x0());
rs(() => new H2());
var ss = {}, vl = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Ti;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], f = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (f < 4) {
        const y = n.indexOf(o[h]) >> f;
        let w = 0;
        h !== 0 && (w = n.indexOf(o[h - 1]));
        const $ = 1 + f, H = w % (1 << $) << 5 - $, U = t.c32[y + H];
        f = $, c.unshift(U);
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
      for (let y = 0; y < h; y++)
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
    for (let w = o.length - 1; w >= 0; w--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const H = (t.c32.indexOf(o[w]) << g) + l, U = n[H % 16];
      if (g += 1, l = H >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(U);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let w = 0; w < d.length && d[w] === "0"; w++)
      h++;
    d = d.slice(h - h % 2);
    let y = d.join("");
    for (let w = 0; w < f; w++)
      y = `00${y}`;
    if (a) {
      const w = a * 2 - y.length;
      for (let $ = 0; $ < w; $ += 2)
        y = `00${y}`;
    }
    return y;
  }
  t.c32decode = i;
})(vl);
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.c32checkDecode = jr.c32checkEncode = void 0;
const bf = sa, mf = Ti, ci = vl;
function E0(t) {
  const e = (0, bf.sha256)((0, bf.sha256)((0, mf.hexToBytes)(t)));
  return (0, mf.bytesToHex)(e.slice(0, 4));
}
function P2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = E0(`${n}${e}`), s = (0, ci.c32encode)(`${e}${r}`);
  return `${ci.c32[t]}${s}`;
}
jr.c32checkEncode = P2;
function O2(t) {
  t = (0, ci.c32normalize)(t);
  const e = (0, ci.c32decode)(t.slice(1)), n = t[0], r = ci.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), E0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
jr.c32checkDecode = O2;
var A0 = {}, Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.decode = Hs.encode = void 0;
const _o = sa, xf = Ti, $0 = _h, v0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function D2(t, e = "00") {
  const n = typeof t == "string" ? (0, xf.hexToBytes)(t) : t, r = typeof e == "string" ? (0, xf.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, _o.sha256)((0, _o.sha256)(new Uint8Array([...r, ...n])));
  return $0(v0).encode([...r, ...n, ...s.slice(0, 4)]);
}
Hs.encode = D2;
function F2(t) {
  const e = $0(v0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, _o.sha256)((0, _o.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Hs.decode = F2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = jr, n = Hs, r = Ti;
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
    const g = n.decode(d), h = (0, r.bytesToHex)(g.data), y = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let w;
    return l < 0 ? (w = y, s[y] !== void 0 && (w = s[y])) : w = l, o(w, h);
  }
  t.b58ToC32 = c;
  function f(d, l = -1) {
    const g = a(d), h = g[0], y = g[1];
    let w;
    l < 0 ? (w = h, i[h] !== void 0 && (w = i[h])) : w = l;
    let $ = w.toString(16);
    return $.length === 1 && ($ = `0${$}`), n.encode(y, $);
  }
  t.c32ToB58 = f;
})(A0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = vl;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = jr;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = A0;
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
})(ss);
function j2(t, e) {
  switch (e = g0(e ?? p0), t) {
    case Bn.P2PKH:
      switch (e.transactionVersion) {
        case Mn.Mainnet:
          return ln.MainnetSingleSig;
        case Mn.Testnet:
          return ln.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Bn.P2SH:
    case Bn.P2SHNonSequential:
    case Bn.P2WPKH:
    case Bn.P2WSH:
    case Bn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Mn.Mainnet:
          return ln.MainnetMultiSig;
        case Mn.Testnet:
          return ln.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const z2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), I0 = Uint8Array.from({ length: 16 }, (t, e) => e), R2 = I0.map((t) => (9 * t + 5) % 16);
let Il = [I0], Ll = [R2];
for (let t = 0; t < 4; t++)
  for (let e of [Il, Ll])
    e.push(e[t].map((n) => z2[n]));
const L0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), G2 = Il.map((t, e) => t.map((n) => L0[e][n])), K2 = Ll.map((t, e) => t.map((n) => L0[e][n])), V2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), q2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Xi = (t, e) => t << e | t >>> 32 - e;
function Sf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Yi = new Uint32Array(16);
let W2 = class extends $l {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = V2[h], $ = q2[h], H = Il[h], U = Ll[h], b = G2[h], L = K2[h];
      for (let A = 0; A < 16; A++) {
        const N = Xi(r + Sf(h, i, a, f) + Yi[H[A]] + w, b[A]) + l | 0;
        r = l, l = f, f = Xi(a, 10) | 0, a = i, i = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = Xi(s + Sf(y, o, c, d) + Yi[U[A]] + $, L[A]) + g | 0;
        s = g, g = d, d = Xi(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Yi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const X2 = rs(() => new W2()), Zi = BigInt(2 ** 32 - 1), pc = BigInt(32);
function k0(t, e = !1) {
  return e ? { h: Number(t & Zi), l: Number(t >> pc & Zi) } : { h: Number(t >> pc & Zi) | 0, l: Number(t & Zi) | 0 };
}
function Y2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = k0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Z2 = (t, e) => BigInt(t >>> 0) << pc | BigInt(e >>> 0), Q2 = (t, e, n) => t >>> n, J2 = (t, e, n) => t << 32 - n | e >>> n, tm = (t, e, n) => t >>> n | e << 32 - n, em = (t, e, n) => t << 32 - n | e >>> n, nm = (t, e, n) => t << 64 - n | e >>> n - 32, rm = (t, e, n) => t >>> n - 32 | e << 64 - n, sm = (t, e) => e, im = (t, e) => t, om = (t, e, n) => t << n | e >>> 32 - n, am = (t, e, n) => e << n | t >>> 32 - n, cm = (t, e, n) => e << n - 32 | t >>> 64 - n, lm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function um(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const fm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), dm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, hm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), pm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, gm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ym = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ct = {
  fromBig: k0,
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
}, [wm, bm] = ct.split([
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
].map((t) => BigInt(t))), Xn = new Uint32Array(80), Yn = new Uint32Array(80);
let aa = class extends $l {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Xn[b] = e.getUint32(n), Yn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = Xn[b - 15] | 0, A = Yn[b - 15] | 0, N = ct.rotrSH(L, A, 1) ^ ct.rotrSH(L, A, 8) ^ ct.shrSH(L, A, 7), q = ct.rotrSL(L, A, 1) ^ ct.rotrSL(L, A, 8) ^ ct.shrSL(L, A, 7), F = Xn[b - 2] | 0, K = Yn[b - 2] | 0, m = ct.rotrSH(F, K, 19) ^ ct.rotrBH(F, K, 61) ^ ct.shrSH(F, K, 6), k = ct.rotrSL(F, K, 19) ^ ct.rotrBL(F, K, 61) ^ ct.shrSL(F, K, 6), O = ct.add4L(q, k, Yn[b - 7], Yn[b - 16]), z = ct.add4H(O, N, m, Xn[b - 7], Xn[b - 16]);
      Xn[b] = z | 0, Yn[b] = O | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: y, Gh: w, Gl: $, Hh: H, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = ct.rotrSH(l, g, 14) ^ ct.rotrSH(l, g, 18) ^ ct.rotrBH(l, g, 41), A = ct.rotrSL(l, g, 14) ^ ct.rotrSL(l, g, 18) ^ ct.rotrBL(l, g, 41), N = l & h ^ ~l & w, q = g & y ^ ~g & $, F = ct.add5L(U, A, q, bm[b], Yn[b]), K = ct.add5H(F, H, L, N, wm[b], Xn[b]), m = F | 0, k = ct.rotrSH(r, s, 28) ^ ct.rotrBH(r, s, 34) ^ ct.rotrBH(r, s, 39), O = ct.rotrSL(r, s, 28) ^ ct.rotrBL(r, s, 34) ^ ct.rotrBL(r, s, 39), z = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      H = w | 0, U = $ | 0, w = h | 0, $ = y | 0, h = l | 0, y = g | 0, { h: l, l: g } = ct.add(f | 0, d | 0, K | 0, m | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = ct.add3L(m, O, J);
      r = ct.add3H(W, K, k, z), s = W | 0;
    }
    ({ h: r, l: s } = ct.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ct.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = ct.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = ct.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: y } = ct.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: $ } = ct.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: H, l: U } = ct.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, y, w, $, H, U);
  }
  roundClean() {
    Xn.fill(0), Yn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, mm = class extends aa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, xm = class extends aa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Sm = class extends aa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
rs(() => new aa());
rs(() => new mm());
rs(() => new xm());
rs(() => new Sm());
var Uo = { exports: {} };
Uo.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", f = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", y = "[object Object]", w = "[object Promise]", $ = "[object RegExp]", H = "[object Set]", U = "[object String]", b = "[object Symbol]", L = "[object WeakMap]", A = "[object ArrayBuffer]", N = "[object DataView]", q = "[object Float32Array]", F = "[object Float64Array]", K = "[object Int8Array]", m = "[object Int16Array]", k = "[object Int32Array]", O = "[object Uint8Array]", z = "[object Uint8ClampedArray]", J = "[object Uint16Array]", W = "[object Uint32Array]", ne = /[\\^$.*+?()[\]{}|]/g, Nt = /\w*$/, kt = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, T = {};
  T[i] = T[o] = T[A] = T[N] = T[a] = T[c] = T[q] = T[F] = T[K] = T[m] = T[k] = T[g] = T[h] = T[y] = T[$] = T[H] = T[U] = T[b] = T[O] = T[z] = T[J] = T[W] = !0, T[f] = T[d] = T[L] = !1;
  var ot = typeof ge == "object" && ge && ge.Object === Object && ge, I = typeof self == "object" && self && self.Object === Object && self, M = ot || I || Function("return this")(), D = e && !e.nodeType && e, tt = D && !0 && t && !t.nodeType && t, et = tt && tt.exports === D;
  function Ht(p, E) {
    return p.set(E[0], E[1]), p;
  }
  function Ot(p, E) {
    return p.add(E), p;
  }
  function Fe(p, E) {
    for (var B = -1, Z = p ? p.length : 0; ++B < Z && E(p[B], B, p) !== !1; )
      ;
    return p;
  }
  function je(p, E) {
    for (var B = -1, Z = E.length, ie = p.length; ++B < Z; )
      p[ie + B] = E[B];
    return p;
  }
  function Bt(p, E, B, Z) {
    for (var ie = -1, me = p ? p.length : 0; ++ie < me; )
      B = E(B, p[ie], ie, p);
    return B;
  }
  function ae(p, E) {
    for (var B = -1, Z = Array(p); ++B < p; )
      Z[B] = E(B);
    return Z;
  }
  function It(p, E) {
    return p == null ? void 0 : p[E];
  }
  function Jt(p) {
    var E = !1;
    if (p != null && typeof p.toString != "function")
      try {
        E = !!(p + "");
      } catch {
      }
    return E;
  }
  function te(p) {
    var E = -1, B = Array(p.size);
    return p.forEach(function(Z, ie) {
      B[++E] = [ie, Z];
    }), B;
  }
  function Xt(p, E) {
    return function(B) {
      return p(E(B));
    };
  }
  function u(p) {
    var E = -1, B = Array(p.size);
    return p.forEach(function(Z) {
      B[++E] = Z;
    }), B;
  }
  var v = Array.prototype, C = Function.prototype, R = Object.prototype, gt = M["__core-js_shared__"], Lt = function() {
    var p = /[^.]+$/.exec(gt && gt.keys && gt.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), ce = C.toString, Pt = R.hasOwnProperty, we = R.toString, ze = RegExp(
    "^" + ce.call(Pt).replace(ne, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), wn = et ? M.Buffer : void 0, Pn = M.Symbol, le = M.Uint8Array, ls = Xt(Object.getPrototypeOf, Object), bn = Object.create, st = R.propertyIsEnumerable, $t = v.splice, Rt = Object.getOwnPropertySymbols, $e = wn ? wn.isBuffer : void 0, mn = Xt(Object.keys, Object), xn = ds(M, "DataView"), Qe = ds(M, "Map"), _t = ds(M, "Promise"), Sn = ds(M, "Set"), xr = ds(M, "WeakMap"), ve = ds(Object, "create"), Sr = Ar(xn), On = Ar(Qe), us = Ar(_t), Dn = Ar(Sn), X = Ar(xr), rt = Pn ? Pn.prototype : void 0, be = rt ? rt.valueOf : void 0;
  function En(p) {
    var E = -1, B = p ? p.length : 0;
    for (this.clear(); ++E < B; ) {
      var Z = p[E];
      this.set(Z[0], Z[1]);
    }
  }
  function x() {
    this.__data__ = ve ? ve(null) : {};
  }
  function _(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function Y(p) {
    var E = this.__data__;
    if (ve) {
      var B = E[p];
      return B === r ? void 0 : B;
    }
    return Pt.call(E, p) ? E[p] : void 0;
  }
  function Et(p) {
    var E = this.__data__;
    return ve ? E[p] !== void 0 : Pt.call(E, p);
  }
  function V(p, E) {
    var B = this.__data__;
    return B[p] = ve && E === void 0 ? r : E, this;
  }
  En.prototype.clear = x, En.prototype.delete = _, En.prototype.get = Y, En.prototype.has = Et, En.prototype.set = V;
  function wt(p) {
    var E = -1, B = p ? p.length : 0;
    for (this.clear(); ++E < B; ) {
      var Z = p[E];
      this.set(Z[0], Z[1]);
    }
  }
  function yt() {
    this.__data__ = [];
  }
  function Dt(p) {
    var E = this.__data__, B = Ni(E, p);
    if (B < 0)
      return !1;
    var Z = E.length - 1;
    return B == Z ? E.pop() : $t.call(E, B, 1), !0;
  }
  function An(p) {
    var E = this.__data__, B = Ni(E, p);
    return B < 0 ? void 0 : E[B][1];
  }
  function Je(p) {
    return Ni(this.__data__, p) > -1;
  }
  function $n(p, E) {
    var B = this.__data__, Z = Ni(B, p);
    return Z < 0 ? B.push([p, E]) : B[Z][1] = E, this;
  }
  wt.prototype.clear = yt, wt.prototype.delete = Dt, wt.prototype.get = An, wt.prototype.has = Je, wt.prototype.set = $n;
  function re(p) {
    var E = -1, B = p ? p.length : 0;
    for (this.clear(); ++E < B; ) {
      var Z = p[E];
      this.set(Z[0], Z[1]);
    }
  }
  function tn() {
    this.__data__ = {
      hash: new En(),
      map: new (Qe || wt)(),
      string: new En()
    };
  }
  function Ng(p) {
    return Hi(this, p).delete(p);
  }
  function Hg(p) {
    return Hi(this, p).get(p);
  }
  function Pg(p) {
    return Hi(this, p).has(p);
  }
  function Og(p, E) {
    return Hi(this, p).set(p, E), this;
  }
  re.prototype.clear = tn, re.prototype.delete = Ng, re.prototype.get = Hg, re.prototype.has = Pg, re.prototype.set = Og;
  function fs(p) {
    this.__data__ = new wt(p);
  }
  function Dg() {
    this.__data__ = new wt();
  }
  function Fg(p) {
    return this.__data__.delete(p);
  }
  function jg(p) {
    return this.__data__.get(p);
  }
  function zg(p) {
    return this.__data__.has(p);
  }
  function Rg(p, E) {
    var B = this.__data__;
    if (B instanceof wt) {
      var Z = B.__data__;
      if (!Qe || Z.length < n - 1)
        return Z.push([p, E]), this;
      B = this.__data__ = new re(Z);
    }
    return B.set(p, E), this;
  }
  fs.prototype.clear = Dg, fs.prototype.delete = Fg, fs.prototype.get = jg, fs.prototype.has = zg, fs.prototype.set = Rg;
  function Gg(p, E) {
    var B = Ia(p) || py(p) ? ae(p.length, String) : [], Z = B.length, ie = !!Z;
    for (var me in p)
      Pt.call(p, me) && !(ie && (me == "length" || uy(me, Z))) && B.push(me);
    return B;
  }
  function wu(p, E, B) {
    var Z = p[E];
    (!(Pt.call(p, E) && Su(Z, B)) || B === void 0 && !(E in p)) && (p[E] = B);
  }
  function Ni(p, E) {
    for (var B = p.length; B--; )
      if (Su(p[B][0], E))
        return B;
    return -1;
  }
  function Kg(p, E) {
    return p && bu(E, La(E), p);
  }
  function $a(p, E, B, Z, ie, me, vn) {
    var xe;
    if (Z && (xe = me ? Z(p, ie, me, vn) : Z(p)), xe !== void 0)
      return xe;
    if (!Pi(p))
      return p;
    var $u = Ia(p);
    if ($u) {
      if (xe = ay(p), !E)
        return sy(p, xe);
    } else {
      var hs = Er(p), vu = hs == d || hs == l;
      if (yy(p))
        return Zg(p, E);
      if (hs == y || hs == i || vu && !me) {
        if (Jt(p))
          return me ? p : {};
        if (xe = cy(vu ? {} : p), !E)
          return iy(p, Kg(xe, p));
      } else {
        if (!T[hs])
          return me ? p : {};
        xe = ly(p, hs, $a, E);
      }
    }
    vn || (vn = new fs());
    var Iu = vn.get(p);
    if (Iu)
      return Iu;
    if (vn.set(p, xe), !$u)
      var Lu = B ? oy(p) : La(p);
    return Fe(Lu || p, function(ka, Oi) {
      Lu && (Oi = ka, ka = p[Oi]), wu(xe, Oi, $a(ka, E, B, Z, Oi, p, vn));
    }), xe;
  }
  function Vg(p) {
    return Pi(p) ? bn(p) : {};
  }
  function qg(p, E, B) {
    var Z = E(p);
    return Ia(p) ? Z : je(Z, B(p));
  }
  function Wg(p) {
    return we.call(p);
  }
  function Xg(p) {
    if (!Pi(p) || dy(p))
      return !1;
    var E = Au(p) || Jt(p) ? ze : kt;
    return E.test(Ar(p));
  }
  function Yg(p) {
    if (!xu(p))
      return mn(p);
    var E = [];
    for (var B in Object(p))
      Pt.call(p, B) && B != "constructor" && E.push(B);
    return E;
  }
  function Zg(p, E) {
    if (E)
      return p.slice();
    var B = new p.constructor(p.length);
    return p.copy(B), B;
  }
  function va(p) {
    var E = new p.constructor(p.byteLength);
    return new le(E).set(new le(p)), E;
  }
  function Qg(p, E) {
    var B = E ? va(p.buffer) : p.buffer;
    return new p.constructor(B, p.byteOffset, p.byteLength);
  }
  function Jg(p, E, B) {
    var Z = E ? B(te(p), !0) : te(p);
    return Bt(Z, Ht, new p.constructor());
  }
  function ty(p) {
    var E = new p.constructor(p.source, Nt.exec(p));
    return E.lastIndex = p.lastIndex, E;
  }
  function ey(p, E, B) {
    var Z = E ? B(u(p), !0) : u(p);
    return Bt(Z, Ot, new p.constructor());
  }
  function ny(p) {
    return be ? Object(be.call(p)) : {};
  }
  function ry(p, E) {
    var B = E ? va(p.buffer) : p.buffer;
    return new p.constructor(B, p.byteOffset, p.length);
  }
  function sy(p, E) {
    var B = -1, Z = p.length;
    for (E || (E = Array(Z)); ++B < Z; )
      E[B] = p[B];
    return E;
  }
  function bu(p, E, B, Z) {
    B || (B = {});
    for (var ie = -1, me = E.length; ++ie < me; ) {
      var vn = E[ie], xe = void 0;
      wu(B, vn, xe === void 0 ? p[vn] : xe);
    }
    return B;
  }
  function iy(p, E) {
    return bu(p, mu(p), E);
  }
  function oy(p) {
    return qg(p, La, mu);
  }
  function Hi(p, E) {
    var B = p.__data__;
    return fy(E) ? B[typeof E == "string" ? "string" : "hash"] : B.map;
  }
  function ds(p, E) {
    var B = It(p, E);
    return Xg(B) ? B : void 0;
  }
  var mu = Rt ? Xt(Rt, Object) : my, Er = Wg;
  (xn && Er(new xn(new ArrayBuffer(1))) != N || Qe && Er(new Qe()) != g || _t && Er(_t.resolve()) != w || Sn && Er(new Sn()) != H || xr && Er(new xr()) != L) && (Er = function(p) {
    var E = we.call(p), B = E == y ? p.constructor : void 0, Z = B ? Ar(B) : void 0;
    if (Z)
      switch (Z) {
        case Sr:
          return N;
        case On:
          return g;
        case us:
          return w;
        case Dn:
          return H;
        case X:
          return L;
      }
    return E;
  });
  function ay(p) {
    var E = p.length, B = p.constructor(E);
    return E && typeof p[0] == "string" && Pt.call(p, "index") && (B.index = p.index, B.input = p.input), B;
  }
  function cy(p) {
    return typeof p.constructor == "function" && !xu(p) ? Vg(ls(p)) : {};
  }
  function ly(p, E, B, Z) {
    var ie = p.constructor;
    switch (E) {
      case A:
        return va(p);
      case a:
      case c:
        return new ie(+p);
      case N:
        return Qg(p, Z);
      case q:
      case F:
      case K:
      case m:
      case k:
      case O:
      case z:
      case J:
      case W:
        return ry(p, Z);
      case g:
        return Jg(p, Z, B);
      case h:
      case U:
        return new ie(p);
      case $:
        return ty(p);
      case H:
        return ey(p, Z, B);
      case b:
        return ny(p);
    }
  }
  function uy(p, E) {
    return E = E ?? s, !!E && (typeof p == "number" || S.test(p)) && p > -1 && p % 1 == 0 && p < E;
  }
  function fy(p) {
    var E = typeof p;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? p !== "__proto__" : p === null;
  }
  function dy(p) {
    return !!Lt && Lt in p;
  }
  function xu(p) {
    var E = p && p.constructor, B = typeof E == "function" && E.prototype || R;
    return p === B;
  }
  function Ar(p) {
    if (p != null) {
      try {
        return ce.call(p);
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
    return $a(p, !0, !0);
  }
  function Su(p, E) {
    return p === E || p !== p && E !== E;
  }
  function py(p) {
    return gy(p) && Pt.call(p, "callee") && (!st.call(p, "callee") || we.call(p) == i);
  }
  var Ia = Array.isArray;
  function Eu(p) {
    return p != null && wy(p.length) && !Au(p);
  }
  function gy(p) {
    return by(p) && Eu(p);
  }
  var yy = $e || xy;
  function Au(p) {
    var E = Pi(p) ? we.call(p) : "";
    return E == d || E == l;
  }
  function wy(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function Pi(p) {
    var E = typeof p;
    return !!p && (E == "object" || E == "function");
  }
  function by(p) {
    return !!p && typeof p == "object";
  }
  function La(p) {
    return Eu(p) ? Gg(p) : Yg(p);
  }
  function my() {
    return [];
  }
  function xy() {
    return !1;
  }
  t.exports = hy;
})(Uo, Uo.exports);
var Em = Uo.exports;
const C0 = /* @__PURE__ */ rh(Em);
var gc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(gc || (gc = {}));
function Am(t, e) {
  return { type: gc.Address, version: t, hash160: e };
}
function $m(t) {
  return ss.c32address(t.version, t.hash160);
}
const vm = (t) => X2(S0(t)), Im = (t) => nt(vm(t));
Wt.hmacSha256Sync = (t, ...e) => {
  const n = m0.create(S0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Lm(t, e = "mainnet") {
  e = g0(e), t = typeof t == "string" ? St(t) : t;
  const n = j2(Bn.P2PKH, e), r = Am(n, Im(t));
  return $m(r);
}
function km(t, e) {
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
  const s = r.issuer.publicKey, i = Lm(s);
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
function Cm(t, e = null) {
  let n;
  e ? n = km(t, e) : n = oe.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Ef = "_blockstackDidCheckEchoReply", Bm = "echoReply", Tm = "authContinuation";
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
  const e = t[Ef];
  if (typeof e == "boolean")
    return e;
  const n = Mm(t.location.search), r = n[Bm];
  if (r) {
    t[Ef] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Tm];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class yc {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new dh();
    else
      throw new Yy("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new nf(e.sessionOptions) : this.store = new nf() : e ? this.store = new ef(e.sessionOptions) : this.store = new ef();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Qy().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new nc("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, b2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = w2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = al("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (_m())
        return xs.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      xs.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Sw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Di("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = oe.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await A2(e))
      throw new Di("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Ba(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Ju(s, i.private_key);
          } catch {
            if (xs.warn("Failed decryption of appPrivateKey, will try to use as given"), !Wt.isValidPrivateKey(i.private_key))
              throw new Di("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Ju(s, c);
          } catch {
            xs.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Di("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = uw, d;
    Ba(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (f = i.hubUrl), Ba(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: d0(i.iss),
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
        l.profile = Object.assign({}, qy);
      else {
        const y = await h.text(), w = JSON.parse(y);
        l.profile = Cm(w[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new nc("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), u1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), f1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
yc.prototype.makeAuthRequest = yc.prototype.makeAuthRequestToken;
const Um = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Nm = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Um(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!ca(r.id));
  return e.concat(n);
}, ca = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), B0 = "STX_PROVIDER", zr = () => typeof window > "u" ? null : window.localStorage.getItem(B0), Hm = (t) => {
  typeof window < "u" && window.localStorage.setItem(B0, t);
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
function Fm(...t) {
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
var Ps;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ps || (Ps = {}));
var Rr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rr || (Rr = {}));
var Af;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Af || (Af = {}));
const jm = "https://api.mainnet.hiro.so", zm = "https://api.testnet.hiro.so", Rm = "http://localhost:3999", Gm = ["mainnet", "testnet", "devnet", "mocknet"];
class Gr {
  constructor(e) {
    this.version = Rr.Mainnet, this.chainId = Ps.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Rr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Fm();
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
Gr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new wc();
    case "testnet":
      return new bc();
    case "devnet":
      return new Km();
    case "mocknet":
      return new T0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Gm.join(", ")}`);
  }
};
Gr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Gr.fromName(t);
class wc extends Gr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? jm,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Rr.Mainnet, this.chainId = Ps.Mainnet;
  }
}
class bc extends Gr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? zm,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Rr.Testnet, this.chainId = Ps.Testnet;
  }
}
class T0 extends Gr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Rm,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Rr.Testnet, this.chainId = Ps.Testnet;
  }
}
const Km = T0;
var Kr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Kr || (Kr = {}));
var No;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(No || (No = {}));
Kr.Mainnet;
var Vr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vr || (Vr = {}));
var qr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(qr || (qr = {}));
Vr.Mainnet;
const Vm = {
  chainId: Kr.Mainnet,
  transactionVersion: Vr.Mainnet,
  peerNetworkId: No.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: qr.MainnetSingleSig,
    multiSig: qr.MainnetMultiSig
  },
  client: { baseUrl: lh }
}, mc = {
  chainId: Kr.Testnet,
  transactionVersion: Vr.Testnet,
  peerNetworkId: No.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: qr.TestnetSingleSig,
    multiSig: qr.TestnetMultiSig
  },
  client: { baseUrl: uh }
}, mo = {
  ...mc,
  addressVersion: { ...mc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: fh }
}, qm = {
  ...mo,
  addressVersion: { ...mo.addressVersion },
  client: { ...mo.client }
};
function Wm(t) {
  switch (t) {
    case "mainnet":
      return Vm;
    case "testnet":
      return mc;
    case "devnet":
      return mo;
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
const $f = /* @__PURE__ */ new Map();
function M0(t, e) {
  const n = $f.get(t);
  if (n !== void 0)
    return n(e);
  const r = Ym(t);
  return $f.set(t, r), M0(t, e);
}
let Ut = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? St(e) : e;
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
    if (M0(e, r))
      return r;
    throw n(r);
  }
};
const Zm = 128, Qm = 128, _0 = 16, _r = 32, xc = 80, la = 65, Jm = 32, tx = 64, Ho = 34, ex = 1 + 16 * 1024 * 1024, nx = 165, rx = 16, sx = 16, ix = 20, ox = sx + 2 + ix, ax = ox + 4, cx = ex + (nx + rx * ax);
var vt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(vt || (vt = {}));
var Sc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Sc || (Sc = {}));
var Le;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Le || (Le = {}));
const Pa = ["onChainOnly", "offChainOnly", "any"];
Pa[0] + "", Le.OnChainOnly, Pa[1] + "", Le.OffChainOnly, Pa[2] + "", Le.Any, Le.OnChainOnly + "", Le.OnChainOnly, Le.OffChainOnly + "", Le.OffChainOnly, Le.Any + "", Le.Any;
var Po;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Po || (Po = {}));
var Ft;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Ft || (Ft = {}));
var Vt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Vt || (Vt = {}));
var Tt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Tt || (Tt = {}));
var Gt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Gt || (Gt = {}));
var li;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(li || (li = {}));
var Ec;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ec || (Ec = {}));
var Ac;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ac || (Ac = {}));
var pe;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(pe || (pe = {}));
var vf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(vf || (vf = {}));
var $c;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})($c || ($c = {}));
var Ve;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ve || (Ve = {}));
var If;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(If || (If = {}));
let ua = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ss = class extends ua {
  constructor(e) {
    super(e);
  }
}, de = class extends ua {
  constructor(e) {
    super(e);
  }
}, Oo = class extends ua {
  constructor(e) {
    super(e);
  }
}, Cr = class extends ua {
  constructor(e) {
    super(e);
  }
};
function vc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function lx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function U0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ux(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  vc(t.outputLen), vc(t.blockLen);
}
function fx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function dx(t, e) {
  U0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Br = {
  number: vc,
  bool: lx,
  bytes: U0,
  hash: ux,
  exists: fx,
  output: dx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Oa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), rn = (t, e) => t << 32 - e | t >>> e, hx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!hx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function px(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function kl(t) {
  if (typeof t == "string" && (t = px(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let N0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function is(t) {
  const e = (r) => t().update(kl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let H0 = class extends N0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Br.hash(e);
    const r = kl(n);
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
    return Br.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Br.exists(this), Br.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const P0 = (t, e, n) => new H0(t, e).update(n).digest();
P0.create = (t, e) => new H0(t, e);
function gx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Cl = class extends N0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Oa(this.buffer);
  }
  update(e) {
    Br.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = kl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Oa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Br.exists(this), Br.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    gx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Oa(e), c = this.outputLen;
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
]), Zn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qn = new Uint32Array(64);
let O0 = class extends Cl {
  constructor() {
    super(64, 32, 8, !1), this.A = Zn[0] | 0, this.B = Zn[1] | 0, this.C = Zn[2] | 0, this.D = Zn[3] | 0, this.E = Zn[4] | 0, this.F = Zn[5] | 0, this.G = Zn[6] | 0, this.H = Zn[7] | 0;
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
      Qn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Qn[l - 15], h = Qn[l - 2], y = rn(g, 7) ^ rn(g, 18) ^ g >>> 3, w = rn(h, 17) ^ rn(h, 19) ^ h >>> 10;
      Qn[l] = w + Qn[l - 7] + y + Qn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = rn(a, 6) ^ rn(a, 11) ^ rn(a, 25), h = d + g + yx(a, c, f) + bx[l] + Qn[l] | 0, w = (rn(r, 2) ^ rn(r, 13) ^ rn(r, 22)) + wx(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    Qn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, mx = class extends O0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Bl = is(() => new O0());
is(() => new mx());
const xx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), D0 = Uint8Array.from({ length: 16 }, (t, e) => e), Sx = D0.map((t) => (9 * t + 5) % 16);
let Tl = [D0], Ml = [Sx];
for (let t = 0; t < 4; t++)
  for (let e of [Tl, Ml])
    e.push(e[t].map((n) => xx[n]));
const F0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ex = Tl.map((t, e) => t.map((n) => F0[e][n])), Ax = Ml.map((t, e) => t.map((n) => F0[e][n])), $x = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), vx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qi = (t, e) => t << e | t >>> 32 - e;
function Lf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ji = new Uint32Array(16);
let Ix = class extends Cl {
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
      Ji[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = $x[h], $ = vx[h], H = Tl[h], U = Ml[h], b = Ex[h], L = Ax[h];
      for (let A = 0; A < 16; A++) {
        const N = Qi(r + Lf(h, i, a, f) + Ji[H[A]] + w, b[A]) + l | 0;
        r = l, l = f, f = Qi(a, 10) | 0, a = i, i = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = Qi(s + Lf(y, o, c, d) + Ji[U[A]] + $, L[A]) + g | 0;
        s = g, g = d, d = Qi(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ji.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Lx = is(() => new Ix()), to = BigInt(2 ** 32 - 1), Ic = BigInt(32);
function j0(t, e = !1) {
  return e ? { h: Number(t & to), l: Number(t >> Ic & to) } : { h: Number(t >> Ic & to) | 0, l: Number(t & to) | 0 };
}
function kx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = j0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Cx = (t, e) => BigInt(t >>> 0) << Ic | BigInt(e >>> 0), Bx = (t, e, n) => t >>> n, Tx = (t, e, n) => t << 32 - n | e >>> n, Mx = (t, e, n) => t >>> n | e << 32 - n, _x = (t, e, n) => t << 32 - n | e >>> n, Ux = (t, e, n) => t << 64 - n | e >>> n - 32, Nx = (t, e, n) => t >>> n - 32 | e << 64 - n, Hx = (t, e) => e, Px = (t, e) => t, Ox = (t, e, n) => t << n | e >>> 32 - n, Dx = (t, e, n) => e << n | t >>> 32 - n, Fx = (t, e, n) => e << n - 32 | t >>> 64 - n, jx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function zx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Rx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Gx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Kx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Vx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, qx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Wx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, lt = {
  fromBig: j0,
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
  rotlBH: Fx,
  rotlBL: jx,
  add: zx,
  add3L: Rx,
  add3H: Gx,
  add4L: Kx,
  add4H: Vx,
  add5H: Wx,
  add5L: qx
}, [Xx, Yx] = lt.split([
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
].map((t) => BigInt(t))), Jn = new Uint32Array(80), tr = new Uint32Array(80);
let fa = class extends Cl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Jn[b] = e.getUint32(n), tr[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = Jn[b - 15] | 0, A = tr[b - 15] | 0, N = lt.rotrSH(L, A, 1) ^ lt.rotrSH(L, A, 8) ^ lt.shrSH(L, A, 7), q = lt.rotrSL(L, A, 1) ^ lt.rotrSL(L, A, 8) ^ lt.shrSL(L, A, 7), F = Jn[b - 2] | 0, K = tr[b - 2] | 0, m = lt.rotrSH(F, K, 19) ^ lt.rotrBH(F, K, 61) ^ lt.shrSH(F, K, 6), k = lt.rotrSL(F, K, 19) ^ lt.rotrBL(F, K, 61) ^ lt.shrSL(F, K, 6), O = lt.add4L(q, k, tr[b - 7], tr[b - 16]), z = lt.add4H(O, N, m, Jn[b - 7], Jn[b - 16]);
      Jn[b] = z | 0, tr[b] = O | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: y, Gh: w, Gl: $, Hh: H, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = lt.rotrSH(l, g, 14) ^ lt.rotrSH(l, g, 18) ^ lt.rotrBH(l, g, 41), A = lt.rotrSL(l, g, 14) ^ lt.rotrSL(l, g, 18) ^ lt.rotrBL(l, g, 41), N = l & h ^ ~l & w, q = g & y ^ ~g & $, F = lt.add5L(U, A, q, Yx[b], tr[b]), K = lt.add5H(F, H, L, N, Xx[b], Jn[b]), m = F | 0, k = lt.rotrSH(r, s, 28) ^ lt.rotrBH(r, s, 34) ^ lt.rotrBH(r, s, 39), O = lt.rotrSL(r, s, 28) ^ lt.rotrBL(r, s, 34) ^ lt.rotrBL(r, s, 39), z = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      H = w | 0, U = $ | 0, w = h | 0, $ = y | 0, h = l | 0, y = g | 0, { h: l, l: g } = lt.add(f | 0, d | 0, K | 0, m | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = lt.add3L(m, O, J);
      r = lt.add3H(W, K, k, z), s = W | 0;
    }
    ({ h: r, l: s } = lt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = lt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = lt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = lt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: y } = lt.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: $ } = lt.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: H, l: U } = lt.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, y, w, $, H, U);
  }
  roundClean() {
    Jn.fill(0), tr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Zx = class extends fa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Qx = class extends fa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Jx = class extends fa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
is(() => new fa());
is(() => new Zx());
const tS = is(() => new Qx());
is(() => new Jx());
var mt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(mt || (mt = {}));
var ee;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ee || (ee = {}));
function _l(t) {
  return ee[t];
}
const eS = () => ({ type: mt.BoolTrue }), nS = () => ({ type: mt.BoolFalse }), rS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: mt.Buffer, value: nt(t) };
}, kf = BigInt("0xffffffffffffffffffffffffffffffff"), sS = BigInt(0), Cf = BigInt("0x7fffffffffffffffffffffffffffffff"), Bf = BigInt("-170141183460469231731687303715884105728"), iS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = sc(St(t))), Ae(t, Uint8Array) && (t = sc(t));
  const e = fe(t);
  if (e > Cf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Cf}`);
  if (e < Bf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Bf}`);
  return { type: mt.Int, value: e };
}, oS = (t) => {
  const e = fe(t);
  if (e < sS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > kf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${kf}`);
  return { type: mt.UInt, value: e };
};
function aS(t) {
  return { type: mt.List, value: t };
}
function z0() {
  return { type: mt.OptionalNone };
}
function R0(t) {
  return { type: mt.OptionalSome, value: t };
}
var G;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(G || (G = {}));
function cS() {
  return {
    type: G.Address,
    version: qr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Tf(t) {
  if (t && Q0(t, Ho))
    throw new Error(`Memo exceeds maximum length of ${Ho} bytes`);
  return { type: G.MemoString, content: t };
}
function Ul(t, e) {
  return {
    type: G.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Lc(t) {
  if (St(t).byteLength != la)
    throw Error("Invalid signature");
  return {
    type: G.MessageSignature,
    data: t
  };
}
function lS(t, e, n) {
  return typeof t == "string" && (t = vS(t)), typeof n == "string" && (n = Tf(n)), {
    type: G.Payload,
    payloadType: vt.TokenTransfer,
    recipient: t,
    amount: fe(e),
    memo: n ?? Tf("")
  };
}
function uS(t, e, n, r) {
  return typeof e == "string" && (e = Ye(e)), typeof n == "string" && (n = Ye(n)), {
    type: G.Payload,
    payloadType: vt.ContractCall,
    contractAddress: typeof t == "string" ? mr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function fS(t) {
  return Ye(t, 4, 1e5);
}
function Mf(t, e, n) {
  return typeof t == "string" && (t = Ye(t)), typeof e == "string" && (e = fS(e)), typeof n == "number" ? {
    type: G.Payload,
    payloadType: vt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: G.Payload,
    payloadType: vt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function dS() {
  return { type: G.Payload, payloadType: vt.PoisonMicroblock };
}
function _f(t, e) {
  if (t.byteLength != _r)
    throw Error(`Coinbase buffer size must be ${_r} bytes`);
  return e != null ? {
    type: G.Payload,
    payloadType: vt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: G.Payload,
    payloadType: vt.Coinbase,
    coinbaseBytes: t
  };
}
function hS(t, e, n) {
  if (t.byteLength != _r)
    throw Error(`Coinbase buffer size must be ${_r} bytes`);
  if (n.byteLength != xc)
    throw Error(`VRF proof buffer size must be ${xc} bytes`);
  return {
    type: G.Payload,
    payloadType: vt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === mt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function pS(t, e, n, r, s, i, o) {
  return {
    type: G.Payload,
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
  if (Q0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: G.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function gS(t, e, n) {
  return {
    type: G.Asset,
    address: mr(t),
    contractName: Ye(e),
    assetName: Ye(n)
  };
}
function mr(t) {
  const e = ss.c32addressDecode(t);
  return {
    type: G.Address,
    version: e[0],
    hash160: e[1]
  };
}
function yS(t, e) {
  const n = mr(t), r = Ye(e);
  return {
    type: G.Principal,
    prefix: pe.Contract,
    address: n,
    contractName: r
  };
}
function wS(t) {
  const e = mr(t);
  return {
    type: G.Principal,
    prefix: pe.Standard,
    address: e
  };
}
function Es(t, e) {
  return {
    pubKeyEncoding: t,
    type: G.TransactionAuthField,
    contents: e
  };
}
function Ln(t) {
  switch (t.type) {
    case G.Address:
      return Mi(t);
    case G.Principal:
      return G0(t);
    case G.LengthPrefixedString:
      return Ds(t);
    case G.MemoString:
      return mS(t);
    case G.Asset:
      return V0(t);
    case G.PostCondition:
      return W0(t);
    case G.PublicKey:
      return Bc(t);
    case G.LengthPrefixedList:
      return Nl(t);
    case G.Payload:
      return X0(t);
    case G.TransactionAuthField:
      return $S(t);
    case G.MessageSignature:
      return Hl(t);
  }
}
function Mi(t) {
  const e = [];
  return e.push(St(Ii(t.version, 1))), e.push(St(t.hash160)), Zt(e);
}
function Os(t) {
  const e = Ae(t, Ut) ? t : new Ut(t), n = Yo(nt(e.readBytes(1))), r = nt(e.readBytes(20));
  return { type: G.Address, version: n, hash160: r };
}
function G0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === pe.Standard || t.prefix === pe.Contract) && e.push(Mi(t.address)), t.prefix === pe.Contract && e.push(Ds(t.contractName)), Zt(e);
}
function bS(t) {
  const e = Ae(t, Ut) ? t : new Ut(t), n = e.readUInt8Enum(pe, (i) => {
    throw new de(`Unexpected Principal payload type: ${i}`);
  });
  if (n === pe.Origin)
    return { type: G.Principal, prefix: n };
  const r = Os(e);
  if (n === pe.Standard)
    return { type: G.Principal, prefix: n, address: r };
  const s = Pe(e);
  return {
    type: G.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Ds(t) {
  const e = [], n = ts(t.content), r = n.byteLength;
  return e.push(St(Ii(r, t.lengthPrefixBytes))), e.push(n), Zt(e);
}
function Pe(t, e, n) {
  e = e || 1;
  const r = Ae(t, Ut) ? t : new Ut(t), s = Yo(nt(r.readBytes(e))), i = Li(r.readBytes(s));
  return Ye(i, e, n ?? 128);
}
function mS(t) {
  const e = [], n = ts(t.content), r = qS(nt(n), Ho * 2);
  return e.push(St(r)), Zt(e);
}
function K0(t) {
  const e = Ae(t, Ut) ? t : new Ut(t);
  let n = Li(e.readBytes(Ho));
  return n = n.replace(/\u0000*$/, ""), { type: G.MemoString, content: n };
}
function V0(t) {
  const e = [];
  return e.push(Mi(t.address)), e.push(Ds(t.contractName)), e.push(Ds(t.assetName)), Zt(e);
}
function kc(t) {
  const e = Ae(t, Ut) ? t : new Ut(t);
  return {
    type: G.Asset,
    address: Os(e),
    contractName: Pe(e),
    assetName: Pe(e)
  };
}
function Nl(t) {
  const e = t.values, n = [];
  n.push(St(Ii(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ln(r));
  return Zt(n);
}
function q0(t, e, n) {
  const r = Ae(t, Ut) ? t : new Ut(t), s = Yo(nt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case G.Address:
        i.push(Os(r));
        break;
      case G.LengthPrefixedString:
        i.push(Pe(r));
        break;
      case G.MemoString:
        i.push(K0(r));
        break;
      case G.Asset:
        i.push(kc(r));
        break;
      case G.PostCondition:
        i.push(SS(r));
        break;
      case G.PublicKey:
        i.push(Tc(r));
        break;
      case G.TransactionAuthField:
        i.push(AS(r));
        break;
    }
  return Ul(i, n);
}
function xS(t) {
  return nt(W0(t));
}
function W0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(G0(t.principal)), (t.conditionType === Ft.Fungible || t.conditionType === Ft.NonFungible) && e.push(V0(t.asset)), t.conditionType === Ft.NonFungible && e.push(un(t.assetName)), e.push(t.conditionCode), t.conditionType === Ft.STX || t.conditionType === Ft.Fungible || t.conditionType === Ft.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ss("The post-condition amount may not be larger than 8 bytes");
    e.push(wr(t.amount, 8));
  }
  return Zt(e);
}
function SS(t) {
  const e = Ae(t, Ut) ? t : new Ut(t), n = e.readUInt8Enum(Ft, (a) => {
    throw new de(`Could not read ${a} as PostConditionType`);
  }), r = bS(e);
  let s, i, o;
  switch (n) {
    case Ft.STX:
      return s = e.readUInt8Enum(li, (c) => {
        throw new de(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${nt(e.readBytes(8))}`), {
        type: G.PostCondition,
        conditionType: Ft.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Ft.Fungible:
      return i = kc(e), s = e.readUInt8Enum(li, (c) => {
        throw new de(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${nt(e.readBytes(8))}`), {
        type: G.PostCondition,
        conditionType: Ft.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Ft.NonFungible:
      i = kc(e);
      const a = cn(e);
      return s = e.readUInt8Enum(Ec, (c) => {
        throw new de(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: G.PostCondition,
        conditionType: Ft.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Ft.Staking:
      return s = e.readUInt8Enum(li, (c) => {
        throw new de(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${nt(e.readBytes(8))}`), {
        type: G.PostCondition,
        conditionType: Ft.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Ft.PoX: {
      const c = e.readUInt8Enum(Ac, (f) => {
        throw new de(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: G.PostCondition,
        conditionType: Ft.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function X0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case vt.TokenTransfer:
      e.push(un(t.recipient)), e.push(wr(t.amount, 8)), e.push(Ln(t.memo));
      break;
    case vt.ContractCall:
      e.push(Ln(t.contractAddress)), e.push(Ln(t.contractName)), e.push(Ln(t.functionName));
      const n = new Uint8Array(4);
      Pr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(un(r));
      });
      break;
    case vt.SmartContract:
      e.push(Ln(t.contractName)), e.push(Ln(t.codeBody));
      break;
    case vt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ln(t.contractName)), e.push(Ln(t.codeBody));
      break;
    case vt.PoisonMicroblock:
      break;
    case vt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case vt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(un(t.recipient));
      break;
    case vt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(un(t.recipient ? R0(t.recipient) : z0())), e.push(t.vrfProof);
      break;
    case vt.TenureChange:
      e.push(St(t.tenureHash)), e.push(St(t.previousTenureHash)), e.push(St(t.burnViewHash)), e.push(St(t.previousTenureEnd)), e.push(Pr(new Uint8Array(4), t.previousTenureBlocks)), e.push(yw(new Uint8Array(1), t.cause)), e.push(St(t.publicKeyHash));
      break;
  }
  return Zt(e);
}
function ES(t) {
  const e = Ae(t, Ut) ? t : new Ut(t);
  switch (e.readUInt8Enum(vt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case vt.TokenTransfer:
      const r = cn(e), s = fe(e.readBytes(8)), i = K0(e);
      return lS(r, s, i);
    case vt.ContractCall:
      const o = Os(e), a = Pe(e), c = Pe(e), f = [], d = e.readUInt32BE();
      for (let L = 0; L < d; L++) {
        const A = cn(e);
        f.push(A);
      }
      return uS(o, a, c, f);
    case vt.SmartContract:
      const l = Pe(e), g = Pe(e, 4, 1e5);
      return Mf(l, g);
    case vt.VersionedSmartContract: {
      const L = e.readUInt8Enum(Sc, (q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${q}`);
      }), A = Pe(e), N = Pe(e, 4, cx);
      return Mf(A, N, L);
    }
    case vt.PoisonMicroblock:
      return dS();
    case vt.Coinbase: {
      const L = e.readBytes(_r);
      return _f(L);
    }
    case vt.CoinbaseToAltRecipient: {
      const L = e.readBytes(_r), A = cn(e);
      return _f(L, A);
    }
    case vt.NakamotoCoinbase: {
      const L = e.readBytes(_r), A = cn(e), N = e.readBytes(xc);
      return hS(L, A, N);
    }
    case vt.TenureChange:
      const h = nt(e.readBytes(20)), y = nt(e.readBytes(20)), w = nt(e.readBytes(20)), $ = nt(e.readBytes(32)), H = e.readUInt32BE(), U = e.readUInt8Enum($c, (L) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${L}`);
      }), b = nt(e.readBytes(20));
      return pS(h, y, w, $, H, U, b);
  }
}
function Cc(t) {
  const e = Ae(t, Ut) ? t : new Ut(t);
  return Lc(nt(e.readBytes(la)));
}
function AS(t) {
  const e = Ae(t, Ut) ? t : new Ut(t), n = e.readUInt8Enum(Ve, (r) => {
    throw new de(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Ve.PublicKeyCompressed:
      return Es(Gt.Compressed, Tc(e));
    case Ve.PublicKeyUncompressed:
      return Es(Gt.Uncompressed, Xs(s3(Tc(e).data)));
    case Ve.SignatureCompressed:
      return Es(Gt.Compressed, Cc(e));
    case Ve.SignatureUncompressed:
      return Es(Gt.Uncompressed, Cc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Hl(t) {
  return St(t.data);
}
function $S(t) {
  const e = [];
  switch (t.contents.type) {
    case G.PublicKey:
      e.push(t.pubKeyEncoding === Gt.Compressed ? Ve.PublicKeyCompressed : Ve.PublicKeyUncompressed), e.push(St(r3(t.contents.data)));
      break;
    case G.MessageSignature:
      e.push(t.pubKeyEncoding === Gt.Compressed ? Ve.SignatureCompressed : Ve.SignatureUncompressed), e.push(Hl(t.contents));
      break;
  }
  return Zt(e);
}
function Bc(t) {
  return t.data.slice();
}
function Tc(t) {
  const e = Ae(t, Ut) ? t : new Ut(t), n = e.readUInt8(), r = n === 4 ? tx : Jm;
  return Xs(Zt([n, e.readBytes(r)]));
}
function Pl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Tt.P2PKH || e === Tt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Tt.P2WPKH || e === Tt.P2WSH || e === Tt.P2WSHNonSequential) && !r.map((s) => s.data).every(Ys))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Tt.P2PKH:
      return eo(t, WS(r[0].data));
    case Tt.P2WPKH:
      return eo(t, XS(r[0].data));
    case Tt.P2SH:
    case Tt.P2SHNonSequential:
      return eo(t, YS(n, r.map(Bc)));
    case Tt.P2WSH:
    case Tt.P2WSHNonSequential:
      return eo(t, ZS(n, r.map(Bc)));
  }
}
function eo(t, e) {
  return { type: G.Address, version: t, hash160: e };
}
function Ol(t) {
  return ss.c32address(t.version, t.hash160);
}
function Uf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return gS(e, n, r);
}
function ri(t) {
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
  const e = mr(t);
  return { type: mt.PrincipalStandard, value: Ol(e) };
}
function LS(t) {
  return { type: mt.PrincipalStandard, value: Ol(t) };
}
function kS(t, e) {
  const n = mr(t), r = Ye(e);
  return Y0(n, r);
}
function Y0(t, e) {
  if (ts(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: mt.PrincipalContract,
    value: `${Ol(t)}.${e.content}`
  };
}
function CS(t) {
  return { type: mt.ResponseErr, value: t };
}
function BS(t) {
  return { type: mt.ResponseOk, value: t };
}
const TS = (t) => ({ type: mt.StringASCII, value: t }), MS = (t) => ({ type: mt.StringUTF8, value: t });
function _S(t) {
  for (const e in t)
    if (!QS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: mt.Tuple, value: t };
}
function cn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Ut(St(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Ut(t) : e = t;
  switch (e.readUInt8Enum(ee, (r) => {
    throw new de(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ee.int:
      return iS(sc(e.readBytes(16)));
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
      const s = Os(e);
      return LS(s);
    case ee.contract:
      const i = Os(e), o = Pe(e);
      return Y0(i, o);
    case ee.ok:
      return BS(cn(e));
    case ee.err:
      return CS(cn(e));
    case ee.none:
      return z0();
    case ee.some:
      return R0(cn(e));
    case ee.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(cn(e));
      return aS(c);
    case ee.tuple:
      const f = e.readUInt32BE(), d = {};
      for (let w = 0; w < f; w++) {
        const $ = Pe(e).content;
        if ($ === void 0)
          throw new de('"content" is undefined');
        d[$] = cn(e);
      }
      return _S(d);
    case ee.ascii:
      const l = e.readUInt32BE(), g = cw(e.readBytes(l));
      return TS(g);
    case ee.utf8:
      const h = e.readUInt32BE(), y = Li(e.readBytes(h));
      return MS(y);
    default:
      throw new de("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function pn(t, e) {
  return Zt([_l(t), e]);
}
function US(t) {
  return new Uint8Array([_l(t.type)]);
}
function NS(t) {
  return t.type === mt.OptionalNone ? new Uint8Array([_l(t.type)]) : pn(t.type, un(t.value));
}
function HS(t) {
  const e = new Uint8Array(4);
  return Pr(e, Math.ceil(t.value.length / 2), 0), pn(t.type, dn(e, St(t.value)));
}
function PS(t) {
  const e = cl(rw(BigInt(t.value), BigInt(Qm)), _0);
  return pn(t.type, e);
}
function OS(t) {
  const e = cl(BigInt(t.value), _0);
  return pn(t.type, e);
}
function DS(t) {
  return pn(t.type, Mi(mr(t.value)));
}
function FS(t) {
  const [e, n] = JS(t.value);
  return pn(t.type, dn(Mi(mr(e)), Ds(Ye(n))));
}
function jS(t) {
  return pn(t.type, un(t.value));
}
function zS(t) {
  const e = [], n = new Uint8Array(4);
  Pr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = un(r);
    e.push(s);
  }
  return pn(t.type, Zt(e));
}
function RS(t) {
  const e = [], n = new Uint8Array(4);
  Pr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ye(s);
    e.push(Ds(i));
    const o = un(t.value[s]);
    e.push(o);
  }
  return pn(t.type, Zt(e));
}
function Z0(t, e) {
  const n = [], r = e == "ascii" ? aw(t.value) : ts(t.value), s = new Uint8Array(4);
  return Pr(s, r.length, 0), n.push(s), n.push(r), pn(t.type, Zt(n));
}
function GS(t) {
  return Z0(t, "ascii");
}
function KS(t) {
  return Z0(t, "utf8");
}
function Nf(t) {
  return nt(un(t));
}
function un(t) {
  switch (t.type) {
    case mt.BoolTrue:
    case mt.BoolFalse:
      return US(t);
    case mt.OptionalNone:
    case mt.OptionalSome:
      return NS(t);
    case mt.Buffer:
      return HS(t);
    case mt.UInt:
      return OS(t);
    case mt.Int:
      return PS(t);
    case mt.PrincipalStandard:
      return DS(t);
    case mt.PrincipalContract:
      return FS(t);
    case mt.ResponseOk:
    case mt.ResponseErr:
      return jS(t);
    case mt.List:
      return zS(t);
    case mt.Tuple:
      return RS(t);
    case mt.StringASCII:
      return GS(t);
    case mt.StringUTF8:
      return KS(t);
    default:
      throw new Ss("Unable to serialize. Invalid Clarity Value.");
  }
}
const VS = (t) => t.length % 2 ? `0${t}` : t, qS = (t, e) => t.padEnd(e, "0"), Q0 = (t, e) => t ? ts(t).length > e : !1;
function Mc(t) {
  return C0(t);
}
const gi = (t) => Lx(Bl(t)), Dl = (t) => nt(tS(t)), WS = (t) => nt(gi(t)), XS = (t) => {
  const e = gi(t), n = dn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = gi(n);
  return nt(r);
}, YS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Zt(n), s = gi(r);
  return nt(s);
}, ZS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Zt(n), s = Bl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Zt(i), a = gi(o);
  return nt(a);
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
Wt.hmacSha256Sync = (t, ...e) => {
  const n = P0.create(Bl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Xs(t) {
  return t = typeof t == "string" ? St(t) : t, {
    type: G.PublicKey,
    data: t
  };
}
function t3(t, e, n = Gt.Compressed) {
  const r = dw(e), s = new Te(Uu(r.r), Uu(r.s)), i = ht.fromSignature(t, s, r.recoveryId), o = n === Gt.Compressed;
  return i.toHex(o);
}
function e3(t) {
  return typeof t == "string" ? t : nt(t);
}
const Fl = e3;
function J0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === fw;
}
function Ys(t) {
  return !Fl(t).startsWith("04");
}
function n3(t) {
  t = ll(t);
  const e = J0(t);
  return nt(ki(t.slice(0, 32), e));
}
function r3(t) {
  return ht.fromHex(Fl(t)).toHex(!0);
}
function s3(t) {
  return ht.fromHex(Fl(t)).toHex(!1);
}
function i3(t, e) {
  t = ll(t);
  const [n, r] = Qo(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ii(r, 1) + Te.fromHex(n).toCompactHex();
}
function jl() {
  return {
    type: G.MessageSignature,
    data: nt(new Uint8Array(la))
  };
}
function tp(t, e, n, r) {
  const s = Pl(0, t, 1, [Xs(e)]).hash160, i = Ys(e) ? Gt.Compressed : Gt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: fe(n),
    fee: fe(r),
    keyEncoding: i,
    signature: jl()
  };
}
function yi(t) {
  return "signature" in t;
}
function Hf(t) {
  return t === Tt.P2SH || t === Tt.P2WSH;
}
function o3(t) {
  return t === Tt.P2SHNonSequential || t === Tt.P2WSHNonSequential;
}
function Pf(t) {
  const e = Mc(t);
  return e.nonce = 0, e.fee = 0, yi(e) ? e.signature = jl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function a3(t) {
  const e = [
    t.hashMode,
    St(t.signer),
    wr(t.nonce, 8),
    wr(t.fee, 8),
    t.keyEncoding,
    Hl(t.signature)
  ];
  return Zt(e);
}
function c3(t) {
  const e = [
    t.hashMode,
    St(t.signer),
    wr(t.nonce, 8),
    wr(t.fee, 8)
  ], n = Ul(t.fields);
  e.push(Nl(n));
  const r = new Uint8Array(2);
  return pw(r, t.signaturesRequired, 0), e.push(r), Zt(e);
}
function l3(t, e) {
  const n = nt(e.readBytes(20)), r = BigInt(`0x${nt(e.readBytes(8))}`), s = BigInt(`0x${nt(e.readBytes(8))}`), i = e.readUInt8Enum(Gt, (a) => {
    throw new de(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Tt.P2WPKH && i != Gt.Compressed)
    throw new de("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Cc(e);
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
  const n = nt(e.readBytes(20)), r = BigInt("0x" + nt(e.readBytes(8))), s = BigInt("0x" + nt(e.readBytes(8))), i = q0(e, G.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case G.PublicKey:
        Ys(f.contents.data) || (o = !0);
        break;
      case G.MessageSignature:
        if (f.pubKeyEncoding === Gt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Cr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Tt.P2WSH || t === Tt.P2WSHNonSequential))
    throw new Cr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Da(t) {
  return yi(t) ? a3(t) : c3(t);
}
function Fa(t) {
  const e = t.readUInt8Enum(Tt, (n) => {
    throw new de(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Tt.P2PKH || e === Tt.P2WPKH ? l3(e, t) : u3(e, t);
}
function ep(t, e, n, r) {
  const i = t + nt(new Uint8Array([e])) + nt(wr(n, 8)) + nt(wr(r, 8));
  if (St(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Dl(St(i));
}
function np(t, e, n) {
  const r = 33 + la, s = Ys(e.data) ? Gt.Compressed : Gt.Uncompressed, i = t + VS(s.toString(16)) + n, o = St(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Dl(o);
}
function f3(t, e, n, r, s) {
  const i = ep(t, e, n, r), o = i3(s, i), a = Xs(n3(s)), c = np(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function rp(t, e, n, r, s, i) {
  const o = ep(t, e, n, r), a = Xs(t3(o, i, s)), c = np(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function d3() {
  const t = tp(Tt.P2PKH, "", 0, 0);
  return t.signer = cS().hash160, t.keyEncoding = Gt.Compressed, t.signature = jl(), t;
}
function Of(t, e, n) {
  return yi(t) ? h3(t, e, n) : p3(t, e, n);
}
function h3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = rp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Pl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Cr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function p3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case G.PublicKey:
        Ys(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case G.MessageSignature:
        c.pubKeyEncoding === Gt.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = rp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Hf(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new Cr("Too many signatures");
        break;
    }
  if (Hf(t.hashMode) && o !== t.signaturesRequired || o3(t.hashMode) && o < t.signaturesRequired)
    throw new Cr("Incorrect number of signatures");
  if (i && (t.hashMode === Tt.P2WSH || t.hashMode === Tt.P2WSHNonSequential))
    throw new Cr("Uncompressed keys are not allowed in this hash mode");
  const a = Pl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Cr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function sp(t) {
  return {
    authType: Vt.Standard,
    spendingCondition: t
  };
}
function ip(t, e) {
  return {
    authType: Vt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || tp(Tt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Df(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Vt.Standard:
        return sp(Pf(t.spendingCondition));
      case Vt.Sponsored:
        return ip(Pf(t.spendingCondition), d3());
      default:
        throw new Oo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function g3(t, e) {
  switch (t.authType) {
    case Vt.Standard:
      return Of(t.spendingCondition, e, Vt.Standard);
    case Vt.Sponsored:
      return Of(t.spendingCondition, e, Vt.Standard);
    default:
      throw new Oo("Invalid origin auth type");
  }
}
function y3(t, e) {
  switch (t.authType) {
    case Vt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: fe(e)
      };
      return { ...t, spendingCondition: n };
    case Vt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: fe(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function w3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: fe(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function b3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: fe(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function m3(t, e) {
  const n = {
    ...e,
    nonce: fe(e.nonce),
    fee: fe(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function x3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Vt.Standard:
      e.push(Da(t.spendingCondition));
      break;
    case Vt.Sponsored:
      e.push(Da(t.spendingCondition)), e.push(Da(t.sponsorSpendingCondition));
      break;
  }
  return Zt(e);
}
function S3(t) {
  const e = t.readUInt8Enum(Vt, (r) => {
    throw new de(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Vt.Standard:
      return n = Fa(t), sp(n);
    case Vt.Sponsored:
      n = Fa(t);
      const r = Fa(t);
      return ip(n, r);
  }
}
class E3 {
  constructor({ auth: e, payload: n, postConditions: r = Ul([]), postConditionMode: s = Po.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Xm(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: fe(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Le.Any;
  }
  signBegin() {
    const e = Mc(this);
    return e.auth = Df(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Mc(this);
    return e.auth = Df(e.auth), e.txid();
  }
  verifyOrigin() {
    return g3(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : Xs(e), r = this.auth.spendingCondition;
    if (r && !yi(r)) {
      const s = Ys(n.data);
      r.fields.push(Es(s ? Gt.Compressed : Gt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = f3(n, r, e.fee, e.nonce, s);
    if (yi(e))
      e.signature = Lc(i);
    else {
      const a = J0(s);
      e.fields.push(Es(a ? Gt.Compressed : Gt.Uncompressed, Lc(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Dl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Vt.Sponsored)
      throw new Oo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = m3(this.auth, e);
  }
  setFee(e) {
    this.auth = y3(this.auth, e);
  }
  setNonce(e) {
    this.auth = w3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Vt.Sponsored)
      throw new Oo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = b3(this.auth, e);
  }
  serialize() {
    return nt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ss('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ss('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ss('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ss('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Pr(n, this.chainId, 0), e.push(n), e.push(x3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Nl(this.postConditions)), e.push(X0(this.payload)), Zt(e);
  }
}
function A3(t) {
  const e = Ae(t, Ut) ? t : new Ut(t), n = e.readUInt8Enum(Vr, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = S3(e), i = e.readUInt8Enum(Le, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Po, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = q0(e, G.PostCondition), c = ES(e), f = new E3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return f.anchorMode = i, f;
}
const Ff = BigInt("18446744073709551615");
function ja(t) {
  const e = fe(t);
  if (e < 0n || e > Ff)
    throw new RangeError(`Post-condition amount must be between 0 and ${Ff} (u64 max), received: ${e}`);
  return e;
}
var _c;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(_c || (_c = {}));
var Uc;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Uc || (Uc = {}));
function $3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: G.PostCondition,
        conditionType: Ft.STX,
        principal: t.address === "origin" ? { type: G.Principal, prefix: pe.Origin } : ri(t.address),
        conditionCode: no(t.condition),
        amount: ja(t.amount)
      };
    case "ft-postcondition":
      return {
        type: G.PostCondition,
        conditionType: Ft.Fungible,
        principal: t.address === "origin" ? { type: G.Principal, prefix: pe.Origin } : ri(t.address),
        conditionCode: no(t.condition),
        amount: ja(t.amount),
        asset: Uf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: G.PostCondition,
        conditionType: Ft.NonFungible,
        principal: t.address === "origin" ? { type: G.Principal, prefix: pe.Origin } : ri(t.address),
        conditionCode: no(t.condition),
        asset: Uf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: G.PostCondition,
        conditionType: Ft.Staking,
        principal: t.address === "origin" ? { type: G.Principal, prefix: pe.Origin } : ri(t.address),
        conditionCode: no(t.condition),
        amount: ja(t.amount)
      };
    case "pox-postcondition":
      return {
        type: G.PostCondition,
        conditionType: Ft.PoX,
        principal: t.address === "origin" ? { type: G.Principal, prefix: pe.Origin } : ri(t.address),
        conditionCode: v3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function no(t) {
  return _c[t];
}
function v3(t) {
  return Uc[t];
}
function op(t) {
  const e = $3(t);
  return xS(e);
}
function I3(t, e, n) {
  return Rl(ap(t), n);
}
function ap(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = wi(r);
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
function zl(t, e = 8) {
  return (typeof t == "bigint" ? t : ap(t)).toString(16).padStart(e * 2, "0");
}
function Rl(t, e = 16) {
  const n = zl(t, e);
  return wi(n);
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
function wi(t) {
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
function Gl(t) {
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
function jf(t) {
  if (t.some(T3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Kl(...t) {
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
function Hn(t) {
  return Kl(...t.map((e) => typeof e == "number" ? jf([e]) : e instanceof Array ? jf(e) : e));
}
function da(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Nc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Nc || (Nc = {}));
Nc.Mainnet;
const M3 = 128, _3 = 128, cp = 16;
var Hc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Hc || (Hc = {}));
var zf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(zf || (zf = {}));
var Rf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Rf || (Rf = {}));
var Ke;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ke || (Ke = {}));
const za = ["onChainOnly", "offChainOnly", "any"];
za[0] + "", Ke.OnChainOnly, za[1] + "", Ke.OffChainOnly, za[2] + "", Ke.Any, Ke.OnChainOnly + "", Ke.OnChainOnly, Ke.OffChainOnly + "", Ke.OffChainOnly, Ke.Any + "", Ke.Any;
var Pc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pc || (Pc = {}));
Pc.Mainnet;
var Gf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Gf || (Gf = {}));
var vr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(vr || (vr = {}));
var Kf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Kf || (Kf = {}));
var Vf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Vf || (Vf = {}));
var qf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(qf || (qf = {}));
var Wf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Wf || (Wf = {}));
var Xf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Xf || (Xf = {}));
var Yf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Yf || (Yf = {}));
var Oc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Oc || (Oc = {}));
var Zf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Zf || (Zf = {}));
var Qf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Qf || (Qf = {}));
function Dc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function U3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function lp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function N3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Dc(t.outputLen), Dc(t.blockLen);
}
function H3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function P3(t, e) {
  lp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ra = {
  number: Dc,
  bool: U3,
  bytes: lp,
  hash: N3,
  exists: H3,
  output: P3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ga = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), sn = (t, e) => t << 32 - e | t >>> e, O3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!O3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function D3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function up(t) {
  if (typeof t == "string" && (t = D3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let F3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function os(t) {
  const e = (r) => t().update(up(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function j3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Vl = class extends F3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ga(this.buffer);
  }
  update(e) {
    Ra.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = up(e);
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
    Ra.exists(this), Ra.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    j3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ga(e), c = this.outputLen;
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
const z3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fp = Uint8Array.from({ length: 16 }, (t, e) => e), R3 = fp.map((t) => (9 * t + 5) % 16);
let ql = [fp], Wl = [R3];
for (let t = 0; t < 4; t++)
  for (let e of [ql, Wl])
    e.push(e[t].map((n) => z3[n]));
const dp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), G3 = ql.map((t, e) => t.map((n) => dp[e][n])), K3 = Wl.map((t, e) => t.map((n) => dp[e][n])), V3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), q3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ro = (t, e) => t << e | t >>> 32 - e;
function Jf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const so = new Uint32Array(16);
let W3 = class extends Vl {
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
      so[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = V3[h], $ = q3[h], H = ql[h], U = Wl[h], b = G3[h], L = K3[h];
      for (let A = 0; A < 16; A++) {
        const N = ro(r + Jf(h, i, a, f) + so[H[A]] + w, b[A]) + l | 0;
        r = l, l = f, f = ro(a, 10) | 0, a = i, i = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = ro(s + Jf(y, o, c, d) + so[U[A]] + $, L[A]) + g | 0;
        s = g, g = d, d = ro(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    so.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
os(() => new W3());
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
]), er = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), nr = new Uint32Array(64);
let hp = class extends Vl {
  constructor() {
    super(64, 32, 8, !1), this.A = er[0] | 0, this.B = er[1] | 0, this.C = er[2] | 0, this.D = er[3] | 0, this.E = er[4] | 0, this.F = er[5] | 0, this.G = er[6] | 0, this.H = er[7] | 0;
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
      nr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = nr[l - 15], h = nr[l - 2], y = sn(g, 7) ^ sn(g, 18) ^ g >>> 3, w = sn(h, 17) ^ sn(h, 19) ^ h >>> 10;
      nr[l] = w + nr[l - 7] + y + nr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = sn(a, 6) ^ sn(a, 11) ^ sn(a, 25), h = d + g + X3(a, c, f) + Z3[l] + nr[l] | 0, w = (sn(r, 2) ^ sn(r, 13) ^ sn(r, 22)) + Y3(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    nr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Q3 = class extends hp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
os(() => new hp());
os(() => new Q3());
const io = BigInt(2 ** 32 - 1), Fc = BigInt(32);
function pp(t, e = !1) {
  return e ? { h: Number(t & io), l: Number(t >> Fc & io) } : { h: Number(t >> Fc & io) | 0, l: Number(t & io) | 0 };
}
function J3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = pp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const t4 = (t, e) => BigInt(t >>> 0) << Fc | BigInt(e >>> 0), e4 = (t, e, n) => t >>> n, n4 = (t, e, n) => t << 32 - n | e >>> n, r4 = (t, e, n) => t >>> n | e << 32 - n, s4 = (t, e, n) => t << 32 - n | e >>> n, i4 = (t, e, n) => t << 64 - n | e >>> n - 32, o4 = (t, e, n) => t >>> n - 32 | e << 64 - n, a4 = (t, e) => e, c4 = (t, e) => t, l4 = (t, e, n) => t << n | e >>> 32 - n, u4 = (t, e, n) => e << n | t >>> 32 - n, f4 = (t, e, n) => e << n - 32 | t >>> 64 - n, d4 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function h4(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const p4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), g4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, y4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), w4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, b4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), m4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ut = {
  fromBig: pp,
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
}, [x4, S4] = ut.split([
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
].map((t) => BigInt(t))), rr = new Uint32Array(80), sr = new Uint32Array(80);
let ha = class extends Vl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      rr[b] = e.getUint32(n), sr[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = rr[b - 15] | 0, A = sr[b - 15] | 0, N = ut.rotrSH(L, A, 1) ^ ut.rotrSH(L, A, 8) ^ ut.shrSH(L, A, 7), q = ut.rotrSL(L, A, 1) ^ ut.rotrSL(L, A, 8) ^ ut.shrSL(L, A, 7), F = rr[b - 2] | 0, K = sr[b - 2] | 0, m = ut.rotrSH(F, K, 19) ^ ut.rotrBH(F, K, 61) ^ ut.shrSH(F, K, 6), k = ut.rotrSL(F, K, 19) ^ ut.rotrBL(F, K, 61) ^ ut.shrSL(F, K, 6), O = ut.add4L(q, k, sr[b - 7], sr[b - 16]), z = ut.add4H(O, N, m, rr[b - 7], rr[b - 16]);
      rr[b] = z | 0, sr[b] = O | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: y, Gh: w, Gl: $, Hh: H, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = ut.rotrSH(l, g, 14) ^ ut.rotrSH(l, g, 18) ^ ut.rotrBH(l, g, 41), A = ut.rotrSL(l, g, 14) ^ ut.rotrSL(l, g, 18) ^ ut.rotrBL(l, g, 41), N = l & h ^ ~l & w, q = g & y ^ ~g & $, F = ut.add5L(U, A, q, S4[b], sr[b]), K = ut.add5H(F, H, L, N, x4[b], rr[b]), m = F | 0, k = ut.rotrSH(r, s, 28) ^ ut.rotrBH(r, s, 34) ^ ut.rotrBH(r, s, 39), O = ut.rotrSL(r, s, 28) ^ ut.rotrBL(r, s, 34) ^ ut.rotrBL(r, s, 39), z = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      H = w | 0, U = $ | 0, w = h | 0, $ = y | 0, h = l | 0, y = g | 0, { h: l, l: g } = ut.add(f | 0, d | 0, K | 0, m | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = ut.add3L(m, O, J);
      r = ut.add3H(W, K, k, z), s = W | 0;
    }
    ({ h: r, l: s } = ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ut.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ut.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = ut.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = ut.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: y } = ut.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: $ } = ut.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: H, l: U } = ut.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, y, w, $, H, U);
  }
  roundClean() {
    rr.fill(0), sr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, E4 = class extends ha {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, A4 = class extends ha {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, $4 = class extends ha {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
os(() => new ha());
os(() => new E4());
os(() => new A4());
os(() => new $4());
function v4(t, e, n) {
  const s = M3;
  if (j4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Hc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var se;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(se || (se = {}));
let I4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, gp = class extends I4 {
  constructor(e) {
    super(e);
  }
};
function pa(t) {
  const e = [];
  return e.push(wi(zl(t.version, 1))), e.push(wi(t.hash160)), Hn(e);
}
function L4(t) {
  const e = [];
  return e.push(t.prefix), e.push(pa(t.address)), t.prefix === Oc.Contract && e.push(bi(t.contractName)), Hn(e);
}
function bi(t) {
  const e = [], n = Gl(t.content), r = n.byteLength;
  return e.push(wi(zl(r, t.lengthPrefixBytes))), e.push(n), Hn(e);
}
function k4(t) {
  const e = [];
  return e.push(pa(t.address)), e.push(bi(t.contractName)), e.push(bi(t.assetName)), Hn(e);
}
function yp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(L4(t.principal)), (t.conditionType === vr.Fungible || t.conditionType === vr.NonFungible) && e.push(k4(t.assetInfo)), t.conditionType === vr.NonFungible && e.push(Wr(t.assetName)), e.push(t.conditionCode), t.conditionType === vr.STX || t.conditionType === vr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new gp("The post-condition amount may not be larger than 8 bytes");
    e.push(I3(t.amount, !1, 8));
  }
  return Hn(e);
}
function gn(t, e) {
  return Hn([t, e]);
}
function C4(t) {
  return new Uint8Array([t.type]);
}
function B4(t) {
  return t.type === se.OptionalNone ? new Uint8Array([t.type]) : gn(t.type, Wr(t.value));
}
function T4(t) {
  const e = new Uint8Array(4);
  return da(e, t.buffer.length, 0), gn(t.type, Kl(e, t.buffer));
}
function M4(t) {
  const e = Rl(L3(t.value, BigInt(_3)), cp);
  return gn(t.type, e);
}
function _4(t) {
  const e = Rl(t.value, cp);
  return gn(t.type, e);
}
function U4(t) {
  return gn(t.type, pa(t.address));
}
function N4(t) {
  return gn(t.type, Kl(pa(t.address), bi(t.contractName)));
}
function H4(t) {
  return gn(t.type, Wr(t.value));
}
function P4(t) {
  const e = [], n = new Uint8Array(4);
  da(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Wr(r);
    e.push(s);
  }
  return gn(t.type, Hn(e));
}
function O4(t) {
  const e = [], n = new Uint8Array(4);
  da(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = v4(s);
    e.push(bi(i));
    const o = Wr(t.data[s]);
    e.push(o);
  }
  return gn(t.type, Hn(e));
}
function wp(t, e) {
  const n = [], r = e == "ascii" ? B3(t.data) : Gl(t.data), s = new Uint8Array(4);
  return da(s, r.length, 0), n.push(s), n.push(r), gn(t.type, Hn(n));
}
function D4(t) {
  return wp(t, "ascii");
}
function F4(t) {
  return wp(t, "utf8");
}
function Wr(t) {
  switch (t.type) {
    case se.BoolTrue:
    case se.BoolFalse:
      return C4(t);
    case se.OptionalNone:
    case se.OptionalSome:
      return B4(t);
    case se.Buffer:
      return T4(t);
    case se.UInt:
      return _4(t);
    case se.Int:
      return M4(t);
    case se.PrincipalStandard:
      return U4(t);
    case se.PrincipalContract:
      return N4(t);
    case se.ResponseOk:
    case se.ResponseErr:
      return H4(t);
    case se.List:
      return P4(t);
    case se.Tuple:
      return O4(t);
    case se.StringASCII:
      return D4(t);
    case se.StringUTF8:
      return F4(t);
    default:
      throw new gp("Unable to serialize. Invalid Clarity Value.");
  }
}
const j4 = (t, e) => t ? Gl(t).length > e : !1, z4 = "connect-ui";
let xo, bp, ke = !1, jc = !1;
const Nn = (t, e = "") => () => {
}, R4 = (t, e) => () => {
}, G4 = "{visibility:hidden}.hydrated{visibility:inherit}", td = {}, K4 = "http://www.w3.org/2000/svg", V4 = "http://www.w3.org/1999/xhtml", q4 = (t) => t != null, Xl = (t) => (t = typeof t, t === "object" || t === "function");
function mp(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const it = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (f) => {
    for (let d = 0; d < f.length; d++)
      r = f[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Xl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? zc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((d) => f[d]).join(" "));
  }
  const c = zc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, zc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, W4 = {}, X4 = (t) => t && t.$tag$ === W4, Y4 = (t, e) => t != null && !Xl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, Z4 = (t) => Zs(t).$hostElement$, Q4 = (t, e, n) => {
  const r = ue.ce(e, n);
  return t.dispatchEvent(r), r;
}, ed = /* @__PURE__ */ new WeakMap(), J4 = (t, e, n) => {
  let r = Do.get(t);
  mE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Do.set(t, r);
}, tE = (t, e, n, r) => {
  var s;
  let i = xp(e);
  const o = Do.get(i);
  if (t = t.nodeType === 11 ? t : fn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = ed.get(t), c;
      if (a || ed.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = fn.createElement("style"), c.innerHTML = o;
          const f = (s = ue.$nonce$) !== null && s !== void 0 ? s : mp(fn);
          f != null && c.setAttribute("nonce", f), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, eE = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Nn("attachStyles", e.$tagName$), i = tE(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, xp = (t, e) => "sc-" + t.$tagName$, nd = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = sd(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, f = rd(n), d = rd(r);
      c.remove(...f.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : sd(ga, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && ue.rel(t, e, n, !1), r && ue.ael(t, e, r, !1);
    else {
      const c = Xl(r);
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
}, nE = /\s/, rd = (t) => t ? t.split(nE) : [], Sp = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || td, o = e.$attrs$ || td;
  for (r in i)
    r in o || nd(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    nd(s, r, i[r], o[r], n, e.$flags$);
}, Yl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = fn.createTextNode(s.$text$);
  else {
    if (ke || (ke = s.$tag$ === "svg"), o = s.$elm$ = fn.createElementNS(ke ? K4 : V4, s.$tag$), ke && s.$tag$ === "foreignObject" && (ke = !1), Sp(null, s, ke), q4(xo) && o["s-si"] !== xo && o.classList.add(o["s-si"] = xo), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Yl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? ke = !1 : o.tagName === "foreignObject" && (ke = !0);
  }
  return o;
}, Ep = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === bp && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Yl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Ap = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, rE = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], f = r.length - 1, d = r[0], l = r[f], g;
  for (; s <= o && i <= f; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--f] : oo(a, d) ? (si(a, d), a = e[++s], d = r[++i]) : oo(c, l) ? (si(c, l), c = e[--o], l = r[--f]) : oo(a, l) ? (si(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--f]) : oo(c, d) ? (si(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = Yl(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? Ep(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, i, f) : i > f && Ap(e, s, o);
}, oo = (t, e) => t.$tag$ === e.$tag$, si = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (ke = i === "svg" ? !0 : i === "foreignObject" ? !1 : ke, Sp(t, e, ke), r !== null && s !== null ? rE(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Ep(n, null, e, s, 0, s.length - 1)) : r !== null && Ap(r, 0, r.length - 1), ke && i === "svg" && (ke = !1)) : t.$text$ !== o && (n.data = o);
}, sE = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || zc(null, null), s = X4(e) ? e : it(null, null, e);
  bp = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, xo = n["s-sc"], si(r, s);
}, $p = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Zl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return $p(t, t.$ancestorComponent$), SE(() => iE(t, e));
}, iE = (t, e) => {
  const n = Nn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), lE(s, () => oE(t, r, e));
}, oE = async (t, e, n) => {
  const r = t.$hostElement$, s = Nn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && eE(t);
  const o = Nn("render", t.$cmpMeta$.$tagName$);
  aE(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => cE(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, aE = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, sE(t, e);
  } catch (r) {
    mi(r, t.$hostElement$);
  }
  return null;
}, cE = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Nn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Ip(n), r(), t.$onReadyResolve$(n), s || vp()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Jl(() => Zl(t, !1)), t.$flags$ &= -517;
}, vp = (t) => {
  Ip(fn.documentElement), Jl(() => Q4(ga, "appload", { detail: { namespace: z4 } }));
}, lE = (t, e) => t && t.then ? t.then(e) : e(), Ip = (t) => t.classList.add("hydrated"), uE = (t, e) => Zs(t).$instanceValues$.get(e), fE = (t, e, n, r) => {
  const s = Zs(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = Y4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), f = n !== i && !c;
  (!(o & 8) || i === void 0) && f && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Zl(s, !1));
}, Lp = (t, e, n) => {
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
        ue.jmp(() => {
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
}, dE = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = bE(n), s.then) {
        const c = R4();
        s = await s, c();
      }
      s.isProxied || (Lp(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Nn("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        mi(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = xp(n);
      if (!Do.has(c)) {
        const f = Nn("registerStyles", n.$tagName$);
        J4(c, a, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Zl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, hE = (t) => {
  if (!(ue.$flags$ & 1)) {
    const e = Zs(t), n = e.$cmpMeta$, r = Nn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            $p(e, e.$ancestorComponent$ = s);
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
  ue.$flags$ & 1 || Zs(t);
}, gE = (t, e = {}) => {
  var n;
  const r = Nn(), s = [], i = e.exclude || [], o = ga.customElements, a = fn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), f = /* @__PURE__ */ fn.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(ue, e), ue.$resourcesUrl$ = new URL(e.resourcesUrl || "./", fn.baseURI).href, t.map((h) => {
    h[1].map((y) => {
      const w = {
        $flags$: y[0],
        $tagName$: y[1],
        $members$: y[2],
        $listeners$: y[3]
      };
      w.$members$ = y[2];
      const $ = w.$tagName$, H = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, wE(U, w), w.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : ue.jmp(() => hE(this));
        }
        disconnectedCallback() {
          ue.jmp(() => pE(this));
        }
        componentOnReady() {
          return Zs(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = h[0], !i.includes($) && !o.get($) && (s.push($), o.define($, Lp(
        H,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + G4, f.setAttribute("data-styles", "");
    const h = (n = ue.$nonce$) !== null && n !== void 0 ? n : mp(fn);
    h != null && f.setAttribute("nonce", h), a.insertBefore(f, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((h) => h.connectedCallback()) : ue.jmp(() => l = setTimeout(vp, 30)), r();
}, Ql = /* @__PURE__ */ new WeakMap(), Zs = (t) => Ql.get(t), yE = (t, e) => Ql.set(e.$lazyInstance$ = t, e), wE = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Ql.set(t, n);
}, sd = (t, e) => e in t, mi = (t, e) => (0, console.error)(t, e), Ka = /* @__PURE__ */ new Map(), bE = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Ka.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Ka.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => x$).then(o, mi);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Ka.set(s, o), o[r]), mi);
}, Do = /* @__PURE__ */ new Map(), ga = typeof window < "u" ? window : {}, fn = ga.document || { head: {} }, ue = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, kp = (t) => Promise.resolve(t), mE = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), id = [], Cp = [], xE = (t, e) => (n) => {
  t.push(n), jc || (jc = !0, ue.$flags$ & 4 ? Jl(Rc) : ue.raf(Rc));
}, od = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      mi(n);
    }
  t.length = 0;
}, Rc = () => {
  od(id), od(Cp), (jc = id.length > 0) && ue.raf(Rc);
}, Jl = (t) => kp().then(t), SE = /* @__PURE__ */ xE(Cp), EE = () => kp(), AE = (t, e) => typeof window > "u" ? Promise.resolve() : EE().then(() => gE([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var $E = Object.defineProperty, vE = Object.defineProperties, IE = Object.getOwnPropertyDescriptors, Fo = Object.getOwnPropertySymbols, Bp = Object.prototype.hasOwnProperty, Tp = Object.prototype.propertyIsEnumerable, ad = (t, e, n) => e in t ? $E(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, _e = (t, e) => {
  for (var n in e || (e = {})) Bp.call(e, n) && ad(t, n, e[n]);
  if (Fo) for (var n of Fo(e)) Tp.call(e, n) && ad(t, n, e[n]);
  return t;
}, Ze = (t, e) => vE(t, IE(e)), Mp = (t, e) => {
  var n = {};
  for (var r in t) Bp.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Fo) for (var r of Fo(t)) e.indexOf(r) < 0 && Tp.call(t, r) && (n[r] = t[r]);
  return n;
};
function _p() {
  return ca(zr()) || window.StacksProvider || window.BlockstackProvider;
}
function ya(t) {
  return t ? typeof t == "string" ? Gr.fromName(t) : "version" in t ? t : "url" in t ? new wc({ url: t.url }) : t.transactionVersion === Vr.Mainnet ? new wc({ url: t.client.baseUrl }) : new bc({ url: t.client.baseUrl }) : new bc();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var LE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(LE || {}), kE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(kE || {}), tu = (t) => {
  let e = t;
  if (!e) {
    let n = new dh(["store_write"], document.location.href);
    e = new yc({ appConfig: n });
  }
  return e;
};
function Up(t) {
  try {
    return tu(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Np = (t) => {
  let e = tu(t).loadUserData().appPrivateKey, n = oe.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function CE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Kr.Mainnet]: "mainnet", [Kr.Testnet]: "testnet" }, a = ya(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function BE(t) {
  let e = ya(t.network), n = tu(t.userSession), r = Ze(_e({}, t), { network: e, userSession: n });
  return _e({ stxAddress: CE(r) }, r);
}
async function TE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(op) : n = n.map((r) => nt(yp(r)))), new oe.TokenSigner("ES256k", e).signAsync(Ze(_e({}, t), { postConditions: n }));
}
function ME(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(op) : e = e.map((n) => nt(yp(n)))), oe.createUnsecuredToken(Ze(_e({}, t), { postConditions: e }));
}
var _E = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = St(a.replace(/^0x/, "")), f = A3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Ze(_e({}, o), { stacksTransaction: f }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Ze(_e({}, o), { stacksTransaction: f }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, UE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Mp(e, ["amount", "appDetails", "userSession"]);
  if (Up(s)) {
    let { privateKey: a, publicKey: c } = Np(s), f = Ze(_e({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (f.appDetails = r), TE(f, a);
  }
  let o = Ze(_e({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), ME(o);
};
async function NE(t, e, n) {
  let r = await e(Ze(_e(_e({}, BE(t)), t), { network: ya(t.network) }));
  return _E({ token: r, options: t }, n);
}
function HE(t, e = _p()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return NE(t, UE, e);
}
function Hp(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Ze(_e({}, t), { message: Nf(e), domain: Nf(n) }) : Ze(_e({}, t), { message: nt(Wr(e)), domain: nt(Wr(n)) });
}
async function PE(t, e) {
  return new oe.TokenSigner("ES256k", e).signAsync(Hp(t));
}
async function OE(t) {
  let e = t, { userSession: n } = e, r = Mp(e, ["userSession"]);
  if (Up(n)) {
    let { privateKey: s, publicKey: i } = Np(n), o = Ze(_e({}, r), { publicKey: i });
    return PE(o, s);
  }
  return oe.createUnsecuredToken(Hp(t));
}
var DE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(DE || {}), Pp = "asigna-stx", cd = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Pp && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(jE(t, e), "*");
}), FE = { authenticationRequest: async (t) => cd(t, "authenticationRequest"), transactionRequest: async (t) => cd(t, "transactionRequest") }, jE = (t, e) => ({ source: Pp, [e]: t }), zE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = FE);
};
zE();
var RE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function GE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = zr(), o = _p();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    AE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : RE, c = Nm(a), f = document.createElement("connect-modal");
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
var ao = GE(HE);
function br(t, e, n) {
  return eu(ye(t, e), n);
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
      r = r.padStart(r.length + r.length % 2, "0"), n = zt(r);
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
      const r = qE(BigInt(`0x${pt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${pt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ld(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function _i(t, e = 8) {
  return (typeof t == "bigint" ? t : ye(t, !1)).toString(16).padStart(e * 2, "0");
}
function wa(t) {
  return parseInt(t, 16);
}
function eu(t, e = 16) {
  const n = _i(t, e);
  return zt(n);
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
function pt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += WE[n];
  return e;
}
function zt(t) {
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
function Qs(t) {
  return new TextEncoder().encode(t);
}
function nu(t) {
  return new TextDecoder().decode(t);
}
function Op(t) {
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
function ud(t) {
  if (t.some(YE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ba(...t) {
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
  return ba(...t.map((e) => typeof e == "number" ? ud([e]) : e instanceof Array ? ud(e) : e));
}
var fd;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(fd || (fd = {}));
var dd;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(hd || (hd = {}));
const Dp = 33, Va = 32;
function ZE(t) {
  if (t.length < Va * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Va * 2), r = t.slice(2 + Va * 2);
  return {
    recoveryId: wa(e),
    r: n,
    s: r
  };
}
function QE(t) {
  const e = typeof t == "string" ? zt(t) : t;
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
function Xr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Gc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Gc || (Gc = {}));
const sA = Gc.Mainnet, iA = 128, oA = 128, Fp = 16, Ur = 32, Kc = 80, ma = 65, aA = 32, cA = 64, jo = 34;
var Q;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Q || (Q = {}));
var dt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(dt || (dt = {}));
var Vc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Vc || (Vc = {}));
var Se;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Se || (Se = {}));
const So = ["onChainOnly", "offChainOnly", "any"], pd = {
  [So[0]]: Se.OnChainOnly,
  [So[1]]: Se.OffChainOnly,
  [So[2]]: Se.Any,
  [Se.OnChainOnly]: Se.OnChainOnly,
  [Se.OffChainOnly]: Se.OffChainOnly,
  [Se.Any]: Se.Any
};
function lA(t) {
  if (t in pd)
    return pd[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${So.join(", ")}`);
}
var zo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zo || (zo = {}));
zo.Mainnet;
var Fs;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Fs || (Fs = {}));
var Ee;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ee || (Ee = {}));
var qt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(qt || (qt = {}));
var Mt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Mt || (Mt = {}));
var Ro;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ro || (Ro = {}));
var Kt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Kt || (Kt = {}));
var xi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(xi || (xi = {}));
var qc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(qc || (qc = {}));
var Si;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Si || (Si = {}));
var gd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(gd || (gd = {}));
var yd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(yd || (yd = {}));
function Wc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function uA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function jp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function fA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Wc(t.outputLen), Wc(t.blockLen);
}
function dA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function hA(t, e) {
  jp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Tr = {
  number: Wc,
  bool: uA,
  bytes: jp,
  hash: fA,
  exists: dA,
  output: hA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const qa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), on = (t, e) => t << 32 - e | t >>> e, pA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!pA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function gA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ru(t) {
  if (typeof t == "string" && (t = gA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class zp {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function as(t) {
  const e = (r) => t().update(ru(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function yA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
class su extends zp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = qa(this.buffer);
  }
  update(e) {
    Tr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ru(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = qa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Tr.exists(this), Tr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    yA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = qa(e), c = this.outputLen;
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
const wA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Rp = Uint8Array.from({ length: 16 }, (t, e) => e), bA = Rp.map((t) => (9 * t + 5) % 16);
let iu = [Rp], ou = [bA];
for (let t = 0; t < 4; t++)
  for (let e of [iu, ou])
    e.push(e[t].map((n) => wA[n]));
const Gp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), mA = iu.map((t, e) => t.map((n) => Gp[e][n])), xA = ou.map((t, e) => t.map((n) => Gp[e][n])), SA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), EA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), co = (t, e) => t << e | t >>> 32 - e;
function wd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const lo = new Uint32Array(16);
class AA extends su {
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
      const y = 4 - h, w = SA[h], $ = EA[h], H = iu[h], U = ou[h], b = mA[h], L = xA[h];
      for (let A = 0; A < 16; A++) {
        const N = co(r + wd(h, i, a, f) + lo[H[A]] + w, b[A]) + l | 0;
        r = l, l = f, f = co(a, 10) | 0, a = i, i = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = co(s + wd(y, o, c, d) + lo[U[A]] + $, L[A]) + g | 0;
        s = g, g = d, d = co(c, 10) | 0, c = o, o = N;
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
}
const $A = as(() => new AA()), vA = (t, e, n) => t & e ^ ~t & n, IA = (t, e, n) => t & e ^ t & n ^ e & n, LA = new Uint32Array([
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
]), ir = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), or = new Uint32Array(64);
class Kp extends su {
  constructor() {
    super(64, 32, 8, !1), this.A = ir[0] | 0, this.B = ir[1] | 0, this.C = ir[2] | 0, this.D = ir[3] | 0, this.E = ir[4] | 0, this.F = ir[5] | 0, this.G = ir[6] | 0, this.H = ir[7] | 0;
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
      or[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = or[l - 15], h = or[l - 2], y = on(g, 7) ^ on(g, 18) ^ g >>> 3, w = on(h, 17) ^ on(h, 19) ^ h >>> 10;
      or[l] = w + or[l - 7] + y + or[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = on(a, 6) ^ on(a, 11) ^ on(a, 25), h = d + g + vA(a, c, f) + LA[l] + or[l] | 0, w = (on(r, 2) ^ on(r, 13) ^ on(r, 22)) + IA(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    or.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class kA extends Kp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const au = as(() => new Kp());
as(() => new kA());
const uo = BigInt(2 ** 32 - 1), Xc = BigInt(32);
function Vp(t, e = !1) {
  return e ? { h: Number(t & uo), l: Number(t >> Xc & uo) } : { h: Number(t >> Xc & uo) | 0, l: Number(t & uo) | 0 };
}
function CA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Vp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const BA = (t, e) => BigInt(t >>> 0) << Xc | BigInt(e >>> 0), TA = (t, e, n) => t >>> n, MA = (t, e, n) => t << 32 - n | e >>> n, _A = (t, e, n) => t >>> n | e << 32 - n, UA = (t, e, n) => t << 32 - n | e >>> n, NA = (t, e, n) => t << 64 - n | e >>> n - 32, HA = (t, e, n) => t >>> n - 32 | e << 64 - n, PA = (t, e) => e, OA = (t, e) => t, DA = (t, e, n) => t << n | e >>> 32 - n, FA = (t, e, n) => e << n | t >>> 32 - n, jA = (t, e, n) => e << n - 32 | t >>> 64 - n, zA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function RA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const GA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), KA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, VA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), qA = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, WA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), XA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ft = {
  fromBig: Vp,
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
  rotlSL: FA,
  rotlBH: jA,
  rotlBL: zA,
  add: RA,
  add3L: GA,
  add3H: KA,
  add4L: VA,
  add4H: qA,
  add5H: XA,
  add5L: WA
}, [YA, ZA] = ft.split([
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
].map((t) => BigInt(t))), ar = new Uint32Array(80), cr = new Uint32Array(80);
class xa extends su {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      ar[b] = e.getUint32(n), cr[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = ar[b - 15] | 0, A = cr[b - 15] | 0, N = ft.rotrSH(L, A, 1) ^ ft.rotrSH(L, A, 8) ^ ft.shrSH(L, A, 7), q = ft.rotrSL(L, A, 1) ^ ft.rotrSL(L, A, 8) ^ ft.shrSL(L, A, 7), F = ar[b - 2] | 0, K = cr[b - 2] | 0, m = ft.rotrSH(F, K, 19) ^ ft.rotrBH(F, K, 61) ^ ft.shrSH(F, K, 6), k = ft.rotrSL(F, K, 19) ^ ft.rotrBL(F, K, 61) ^ ft.shrSL(F, K, 6), O = ft.add4L(q, k, cr[b - 7], cr[b - 16]), z = ft.add4H(O, N, m, ar[b - 7], ar[b - 16]);
      ar[b] = z | 0, cr[b] = O | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: y, Gh: w, Gl: $, Hh: H, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const L = ft.rotrSH(l, g, 14) ^ ft.rotrSH(l, g, 18) ^ ft.rotrBH(l, g, 41), A = ft.rotrSL(l, g, 14) ^ ft.rotrSL(l, g, 18) ^ ft.rotrBL(l, g, 41), N = l & h ^ ~l & w, q = g & y ^ ~g & $, F = ft.add5L(U, A, q, ZA[b], cr[b]), K = ft.add5H(F, H, L, N, YA[b], ar[b]), m = F | 0, k = ft.rotrSH(r, s, 28) ^ ft.rotrBH(r, s, 34) ^ ft.rotrBH(r, s, 39), O = ft.rotrSL(r, s, 28) ^ ft.rotrBL(r, s, 34) ^ ft.rotrBL(r, s, 39), z = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      H = w | 0, U = $ | 0, w = h | 0, $ = y | 0, h = l | 0, y = g | 0, { h: l, l: g } = ft.add(f | 0, d | 0, K | 0, m | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const W = ft.add3L(m, O, J);
      r = ft.add3H(W, K, k, z), s = W | 0;
    }
    ({ h: r, l: s } = ft.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ft.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ft.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = ft.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = ft.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: y } = ft.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: $ } = ft.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: H, l: U } = ft.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, y, w, $, H, U);
  }
  roundClean() {
    ar.fill(0), cr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class QA extends xa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class JA extends xa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class t8 extends xa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
as(() => new xa());
as(() => new QA());
const e8 = as(() => new JA());
as(() => new t8());
function qp(t) {
  if (zt(t).byteLength != ma)
    throw Error("Invalid signature");
  return {
    type: Q.MessageSignature,
    data: t
  };
}
function ii(t, e) {
  return { type: Q.Address, version: t, hash160: e };
}
function As(t) {
  return ss.c32address(t.version, t.hash160);
}
function Yr(t, e, n) {
  const r = e || 1, s = n || iA;
  if (ug(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Q.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function cu(t) {
  const e = ss.c32addressDecode(t);
  return {
    type: Q.Address,
    version: e[0],
    hash160: e[1]
  };
}
var P;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(P || (P = {}));
function n8(t) {
  if (t.type === P.PrincipalStandard)
    return As(t.address);
  if (t.type === P.PrincipalContract)
    return `${As(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Wp(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return i8(e, n);
  } else
    return r8(t);
}
function r8(t) {
  const e = cu(t);
  return { type: P.PrincipalStandard, address: e };
}
function s8(t) {
  return { type: P.PrincipalStandard, address: t };
}
function i8(t, e) {
  const n = cu(t), r = Yr(e);
  return Xp(n, r);
}
function Xp(t, e) {
  if (Qs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: P.PrincipalContract, address: t, contractName: e };
}
function Wa(t, e = !1) {
  switch (t.type) {
    case P.BoolTrue:
      return !0;
    case P.BoolFalse:
      return !1;
    case P.Int:
    case P.UInt:
      return e ? t.value.toString() : t.value;
    case P.Buffer:
      return `0x${pt(t.buffer)}`;
    case P.OptionalNone:
      return null;
    case P.OptionalSome:
      return Tn(t.value);
    case P.ResponseErr:
      return Tn(t.value);
    case P.ResponseOk:
      return Tn(t.value);
    case P.PrincipalStandard:
    case P.PrincipalContract:
      return n8(t);
    case P.List:
      return t.list.map((r) => Tn(r));
    case P.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Tn(t.data[r]);
      }), n;
    case P.StringASCII:
      return t.data;
    case P.StringUTF8:
      return t.data;
  }
}
function Tn(t) {
  switch (t.type) {
    case P.ResponseErr:
      return { type: fr(t), value: Wa(t, !0), success: !1 };
    case P.ResponseOk:
      return { type: fr(t), value: Wa(t, !0), success: !0 };
    default:
      return { type: fr(t), value: Wa(t, !0) };
  }
}
function fr(t) {
  switch (t.type) {
    case P.BoolTrue:
    case P.BoolFalse:
      return "bool";
    case P.Int:
      return "int";
    case P.UInt:
      return "uint";
    case P.Buffer:
      return `(buff ${t.buffer.length})`;
    case P.OptionalNone:
      return "(optional none)";
    case P.OptionalSome:
      return `(optional ${fr(t.value)})`;
    case P.ResponseErr:
      return `(response UnknownType ${fr(t.value)})`;
    case P.ResponseOk:
      return `(response ${fr(t.value)} UnknownType)`;
    case P.PrincipalStandard:
    case P.PrincipalContract:
      return "principal";
    case P.List:
      return `(list ${t.list.length} ${t.list.length ? fr(t.list[0]) : "UnknownType"})`;
    case P.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${fr(t.data[e])})`).join(" ")})`;
    case P.StringASCII:
      return `(string-ascii ${Op(t.data).length})`;
    case P.StringUTF8:
      return `(string-utf8 ${Qs(t.data).length})`;
  }
}
const Yp = () => ({ type: P.BoolTrue }), Zp = () => ({ type: P.BoolFalse }), o8 = (t) => t ? Yp() : Zp(), bd = BigInt("0xffffffffffffffffffffffffffffffff"), a8 = BigInt(0), md = BigInt("0x7fffffffffffffffffffffffffffffff"), xd = BigInt("-170141183460469231731687303715884105728"), c8 = (t) => {
  const e = ye(t, !0);
  if (e > md)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${md}`);
  if (e < xd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${xd}`);
  return { type: P.Int, value: e };
}, hr = (t) => {
  const e = ye(t, !1);
  if (e < a8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > bd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${bd}`);
  return { type: P.UInt, value: e };
}, Qp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: P.Buffer, buffer: t };
};
function Jp() {
  return { type: P.OptionalNone };
}
function tg(t) {
  return { type: P.OptionalSome, value: t };
}
function l8(t) {
  return { type: P.ResponseErr, value: t };
}
function u8(t) {
  return { type: P.ResponseOk, value: t };
}
function f8(t) {
  return { type: P.List, list: t };
}
function Ei(t) {
  for (const e in t)
    if (!t6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: P.Tuple, data: t };
}
const qe = (t) => ({ type: P.StringASCII, data: t }), d8 = (t) => ({ type: P.StringUTF8, data: t });
class eg extends zp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Tr.hash(e);
    const r = ru(n);
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
    return Tr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Tr.exists(this), Tr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ng = (t, e, n) => new eg(t, e).update(n).digest();
ng.create = (t, e) => new eg(t, e);
Wt.hmacSha256Sync = (t, ...e) => {
  const n = ng.create(au, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function js(t) {
  return {
    type: Q.PublicKey,
    data: zt(t)
  };
}
function h8(t, e, n = Kt.Compressed) {
  const r = ZE(e.data), s = new Te(ld(r.r), ld(r.s)), i = ht.fromSignature(t, s, r.recoveryId), o = n === Kt.Compressed;
  return i.toHex(o);
}
function p8(t) {
  return { type: Q.PublicKey, data: t };
}
function Js(t) {
  return !pt(t.data).startsWith("04");
}
function Go(t) {
  return t.data.slice();
}
function g8(t) {
  const e = b8(t), n = ki(e.data.slice(0, 32), e.compressed);
  return js(pt(n));
}
function y8(t) {
  const e = typeof t == "string" ? t : pt(t), n = ht.fromHex(e).toHex(!0);
  return js(n);
}
function w8(t) {
  const e = typeof t == "string" ? t : pt(t), n = ht.fromHex(e).toHex(!1);
  return js(n);
}
function Yc(t) {
  const e = t.readUInt8(), n = e === 4 ? cA : aA;
  return p8(Qt([e, t.readBytes(n)]));
}
function b8(t) {
  const e = QE(t), n = e.length == Dp;
  return { data: e, compressed: n };
}
function m8(t, e) {
  const [n, r] = Qo(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = _i(r, 1) + Te.fromHex(n).toCompactHex();
  return qp(i);
}
function x8(t) {
  return g8(t.data);
}
function S8(t, e, n) {
  return typeof t == "string" && (t = Wp(t)), typeof n == "string" && (n = Ad(n)), {
    type: Q.Payload,
    payloadType: dt.TokenTransfer,
    recipient: t,
    amount: ye(e, !1),
    memo: n ?? Ad("")
  };
}
function E8(t, e, n, r) {
  return typeof t == "string" && (t = cu(t)), typeof e == "string" && (e = Yr(e)), typeof n == "string" && (n = Yr(n)), {
    type: Q.Payload,
    payloadType: dt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Sd(t, e, n) {
  return typeof t == "string" && (t = Yr(t)), typeof e == "string" && (e = T8(e)), typeof n == "number" ? {
    type: Q.Payload,
    payloadType: dt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: Q.Payload,
    payloadType: dt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function A8() {
  return { type: Q.Payload, payloadType: dt.PoisonMicroblock };
}
function Ed(t, e) {
  if (t.byteLength != Ur)
    throw Error(`Coinbase buffer size must be ${Ur} bytes`);
  return e != null ? {
    type: Q.Payload,
    payloadType: dt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: Q.Payload,
    payloadType: dt.Coinbase,
    coinbaseBytes: t
  };
}
function $8(t, e, n) {
  if (t.byteLength != Ur)
    throw Error(`Coinbase buffer size must be ${Ur} bytes`);
  if (n.byteLength != Kc)
    throw Error(`VRF proof buffer size must be ${Kc} bytes`);
  return {
    type: Q.Payload,
    payloadType: dt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === P.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Zc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Zc || (Zc = {}));
function v8(t, e, n, r, s, i, o) {
  return {
    type: Q.Payload,
    payloadType: dt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function rg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case dt.TokenTransfer:
      e.push(Yt(t.recipient)), e.push(br(t.amount, !1, 8)), e.push(kn(t.memo));
      break;
    case dt.ContractCall:
      e.push(kn(t.contractAddress)), e.push(kn(t.contractName)), e.push(kn(t.functionName));
      const n = new Uint8Array(4);
      Xr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Yt(r));
      });
      break;
    case dt.SmartContract:
      e.push(kn(t.contractName)), e.push(kn(t.codeBody));
      break;
    case dt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(kn(t.contractName)), e.push(kn(t.codeBody));
      break;
    case dt.PoisonMicroblock:
      break;
    case dt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case dt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Yt(t.recipient));
      break;
    case dt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Yt(t.recipient ? tg(t.recipient) : Jp())), e.push(t.vrfProof);
      break;
    case dt.TenureChange:
      e.push(zt(t.tenureHash)), e.push(zt(t.previousTenureHash)), e.push(zt(t.burnViewHash)), e.push(zt(t.previousTenureEnd)), e.push(Xr(new Uint8Array(4), t.previousTenureBlocks)), e.push(nA(new Uint8Array(1), t.cause)), e.push(zt(t.publicKeyHash));
      break;
  }
  return Qt(e);
}
function I8(t) {
  switch (t.readUInt8Enum(dt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case dt.TokenTransfer:
      const n = De(t), r = ye(t.readBytes(8), !1), s = ig(t);
      return S8(n, r, s);
    case dt.ContractCall:
      const i = zs(t), o = Oe(t), a = Oe(t), c = [], f = t.readUInt32BE();
      for (let b = 0; b < f; b++) {
        const L = De(t);
        c.push(L);
      }
      return E8(i, o, a, c);
    case dt.SmartContract:
      const d = Oe(t), l = Oe(t, 4, 1e5);
      return Sd(d, l);
    case dt.VersionedSmartContract: {
      const b = t.readUInt8Enum(Vc, (N) => {
        throw new Error(`Cannot recognize ClarityVersion: ${N}`);
      }), L = Oe(t), A = Oe(t, 4, 1e5);
      return Sd(L, A, b);
    }
    case dt.PoisonMicroblock:
      return A8();
    case dt.Coinbase: {
      const b = t.readBytes(Ur);
      return Ed(b);
    }
    case dt.CoinbaseToAltRecipient: {
      const b = t.readBytes(Ur), L = De(t);
      return Ed(b, L);
    }
    case dt.NakamotoCoinbase: {
      const b = t.readBytes(Ur), L = De(t), A = t.readBytes(Kc);
      return $8(b, L, A);
    }
    case dt.TenureChange:
      const g = pt(t.readBytes(20)), h = pt(t.readBytes(20)), y = pt(t.readBytes(20)), w = pt(t.readBytes(32)), $ = t.readUInt32BE(), H = t.readUInt8Enum(Zc, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), U = pt(t.readBytes(20));
      return v8(g, h, y, w, $, H, U);
  }
}
class Sa extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ir extends Sa {
  constructor(e) {
    super(e);
  }
}
class Be extends Sa {
  constructor(e) {
    super(e);
  }
}
class Ko extends Sa {
  constructor(e) {
    super(e);
  }
}
class Mr extends Sa {
  constructor(e) {
    super(e);
  }
}
var We;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(We || (We = {}));
function Qc(t) {
  return qp(pt(t.readBytes(ma)));
}
function $s(t, e) {
  return {
    pubKeyEncoding: t,
    type: Q.TransactionAuthField,
    contents: e
  };
}
function L8(t) {
  const e = t.readUInt8Enum(We, (n) => {
    throw new Be(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case We.PublicKeyCompressed:
      return $s(Kt.Compressed, Yc(t));
    case We.PublicKeyUncompressed:
      return $s(Kt.Uncompressed, w8(Yc(t).data));
    case We.SignatureCompressed:
      return $s(Kt.Compressed, Qc(t));
    case We.SignatureUncompressed:
      return $s(Kt.Uncompressed, Qc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function lu(t) {
  return zt(t.data);
}
function k8(t) {
  const e = [];
  switch (t.contents.type) {
    case Q.PublicKey:
      e.push(t.pubKeyEncoding === Kt.Compressed ? We.PublicKeyCompressed : We.PublicKeyUncompressed), e.push(Go(y8(t.contents.data)));
      break;
    case Q.MessageSignature:
      e.push(t.pubKeyEncoding === Kt.Compressed ? We.SignatureCompressed : We.SignatureUncompressed), e.push(lu(t.contents));
      break;
  }
  return Qt(e);
}
function kn(t) {
  switch (t.type) {
    case Q.Address:
      return Ui(t);
    case Q.Principal:
      return sg(t);
    case Q.LengthPrefixedString:
      return Rs(t);
    case Q.MemoString:
      return M8(t);
    case Q.AssetInfo:
      return og(t);
    case Q.PostCondition:
      return _8(t);
    case Q.PublicKey:
      return Go(t);
    case Q.LengthPrefixedList:
      return du(t);
    case Q.Payload:
      return rg(t);
    case Q.TransactionAuthField:
      return k8(t);
    case Q.MessageSignature:
      return lu(t);
  }
}
function C8() {
  return {
    type: Q.Address,
    version: Ro.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function uu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Mt.SerializeP2PKH || e === Mt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Mt.SerializeP2WPKH || e === Mt.SerializeP2WSH || e === Mt.SerializeP2WSHNonSequential) && !r.every(Js))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Mt.SerializeP2PKH:
      return ii(t, Y8(r[0].data));
    case Mt.SerializeP2WPKH:
      return ii(t, Z8(r[0].data));
    case Mt.SerializeP2SH:
    case Mt.SerializeP2SHNonSequential:
      return ii(t, Q8(n, r.map(Go)));
    case Mt.SerializeP2WSH:
    case Mt.SerializeP2WSHNonSequential:
      return ii(t, J8(n, r.map(Go)));
  }
}
function Ui(t) {
  const e = [];
  return e.push(zt(_i(t.version, 1))), e.push(zt(t.hash160)), Qt(e);
}
function zs(t) {
  const e = wa(pt(t.readBytes(1))), n = pt(t.readBytes(20));
  return { type: Q.Address, version: e, hash160: n };
}
function sg(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ui(t.address)), t.prefix === Si.Contract && e.push(Rs(t.contractName)), Qt(e);
}
function B8(t) {
  const e = t.readUInt8Enum(Si, (s) => {
    throw new Be(`Unexpected Principal payload type: ${s}`);
  }), n = zs(t);
  if (e === Si.Standard)
    return { type: Q.Principal, prefix: e, address: n };
  const r = Oe(t);
  return {
    type: Q.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Rs(t) {
  const e = [], n = Qs(t.content), r = n.byteLength;
  return e.push(zt(_i(r, t.lengthPrefixBytes))), e.push(n), Qt(e);
}
function Oe(t, e, n) {
  e = e || 1;
  const r = wa(pt(t.readBytes(e))), s = nu(t.readBytes(r));
  return Yr(s, e, n ?? 128);
}
function T8(t) {
  return Yr(t, 4, 1e5);
}
function Ad(t) {
  if (t && ug(t, jo))
    throw new Error(`Memo exceeds maximum length of ${jo} bytes`);
  return { type: Q.MemoString, content: t };
}
function M8(t) {
  const e = [], n = Qs(t.content), r = X8(pt(n), jo * 2);
  return e.push(zt(r)), Qt(e);
}
function ig(t) {
  let e = nu(t.readBytes(jo));
  return e = e.replace(/\u0000*$/, ""), { type: Q.MemoString, content: e };
}
function og(t) {
  const e = [];
  return e.push(Ui(t.address)), e.push(Rs(t.contractName)), e.push(Rs(t.assetName)), Qt(e);
}
function Jc(t) {
  return {
    type: Q.AssetInfo,
    address: zs(t),
    contractName: Oe(t),
    assetName: Oe(t)
  };
}
function fu(t, e) {
  return {
    type: Q.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function du(t) {
  const e = t.values, n = [];
  n.push(zt(_i(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(kn(r));
  return Qt(n);
}
function ag(t, e, n) {
  const r = wa(pt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case Q.Address:
        s.push(zs(t));
        break;
      case Q.LengthPrefixedString:
        s.push(Oe(t));
        break;
      case Q.MemoString:
        s.push(ig(t));
        break;
      case Q.AssetInfo:
        s.push(Jc(t));
        break;
      case Q.PostCondition:
        s.push(U8(t));
        break;
      case Q.PublicKey:
        s.push(Yc(t));
        break;
      case Q.TransactionAuthField:
        s.push(L8(t));
        break;
    }
  return fu(s, n);
}
function _8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(sg(t.principal)), (t.conditionType === Ee.Fungible || t.conditionType === Ee.NonFungible) && e.push(og(t.assetInfo)), t.conditionType === Ee.NonFungible && e.push(Yt(t.assetName)), e.push(t.conditionCode), t.conditionType === Ee.STX || t.conditionType === Ee.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ir("The post-condition amount may not be larger than 8 bytes");
    e.push(br(t.amount, !1, 8));
  }
  return Qt(e);
}
function U8(t) {
  const e = t.readUInt8Enum(Ee, (o) => {
    throw new Be(`Could not read ${o} as PostConditionType`);
  }), n = B8(t);
  let r, s, i;
  switch (e) {
    case Ee.STX:
      return r = t.readUInt8Enum(xi, (a) => {
        throw new Be(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${pt(t.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: Ee.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Ee.Fungible:
      return s = Jc(t), r = t.readUInt8Enum(xi, (a) => {
        throw new Be(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${pt(t.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: Ee.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Ee.NonFungible:
      s = Jc(t);
      const o = De(t);
      return r = t.readUInt8Enum(qc, (a) => {
        throw new Be(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Q.PostCondition,
        conditionType: Ee.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function yn(t, e) {
  return Qt([t, e]);
}
function N8(t) {
  return new Uint8Array([t.type]);
}
function H8(t) {
  return t.type === P.OptionalNone ? new Uint8Array([t.type]) : yn(t.type, Yt(t.value));
}
function P8(t) {
  const e = new Uint8Array(4);
  return Xr(e, t.buffer.length, 0), yn(t.type, ba(e, t.buffer));
}
function O8(t) {
  const e = eu(KE(t.value, BigInt(oA)), Fp);
  return yn(t.type, e);
}
function D8(t) {
  const e = eu(t.value, Fp);
  return yn(t.type, e);
}
function F8(t) {
  return yn(t.type, Ui(t.address));
}
function j8(t) {
  return yn(t.type, ba(Ui(t.address), Rs(t.contractName)));
}
function z8(t) {
  return yn(t.type, Yt(t.value));
}
function R8(t) {
  const e = [], n = new Uint8Array(4);
  Xr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Yt(r);
    e.push(s);
  }
  return yn(t.type, Qt(e));
}
function G8(t) {
  const e = [], n = new Uint8Array(4);
  Xr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Yr(s);
    e.push(Rs(i));
    const o = Yt(t.data[s]);
    e.push(o);
  }
  return yn(t.type, Qt(e));
}
function cg(t, e) {
  const n = [], r = e == "ascii" ? Op(t.data) : Qs(t.data), s = new Uint8Array(4);
  return Xr(s, r.length, 0), n.push(s), n.push(r), yn(t.type, Qt(n));
}
function K8(t) {
  return cg(t, "ascii");
}
function V8(t) {
  return cg(t, "utf8");
}
function Yt(t) {
  switch (t.type) {
    case P.BoolTrue:
    case P.BoolFalse:
      return N8(t);
    case P.OptionalNone:
    case P.OptionalSome:
      return H8(t);
    case P.Buffer:
      return P8(t);
    case P.UInt:
      return D8(t);
    case P.Int:
      return O8(t);
    case P.PrincipalStandard:
      return F8(t);
    case P.PrincipalContract:
      return j8(t);
    case P.ResponseOk:
    case P.ResponseErr:
      return z8(t);
    case P.List:
      return R8(t);
    case P.Tuple:
      return G8(t);
    case P.StringASCII:
      return K8(t);
    case P.StringUTF8:
      return V8(t);
    default:
      throw new Ir("Unable to serialize. Invalid Clarity Value.");
  }
}
function q8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const $d = /* @__PURE__ */ new Map();
function lg(t, e) {
  const n = $d.get(t);
  if (n !== void 0)
    return n(e);
  const r = q8(t);
  return $d.set(t, r), lg(t, e);
}
class ui {
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
    if (lg(e, r))
      return r;
    throw n(r);
  }
}
function De(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ui(zt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ui(t) : e = t;
  switch (e.readUInt8Enum(P, (r) => {
    throw new Be(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case P.Int:
      return c8(e.readBytes(16));
    case P.UInt:
      return hr(e.readBytes(16));
    case P.Buffer:
      const r = e.readUInt32BE();
      return Qp(e.readBytes(r));
    case P.BoolTrue:
      return Yp();
    case P.BoolFalse:
      return Zp();
    case P.PrincipalStandard:
      const s = zs(e);
      return s8(s);
    case P.PrincipalContract:
      const i = zs(e), o = Oe(e);
      return Xp(i, o);
    case P.ResponseOk:
      return u8(De(e));
    case P.ResponseErr:
      return l8(De(e));
    case P.OptionalNone:
      return Jp();
    case P.OptionalSome:
      return tg(De(e));
    case P.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(De(e));
      return f8(c);
    case P.Tuple:
      const f = e.readUInt32BE(), d = {};
      for (let w = 0; w < f; w++) {
        const $ = Oe(e).content;
        if ($ === void 0)
          throw new Be('"content" is undefined');
        d[$] = De(e);
      }
      return Ei(d);
    case P.StringASCII:
      const l = e.readUInt32BE(), g = XE(e.readBytes(l));
      return qe(g);
    case P.StringUTF8:
      const h = e.readUInt32BE(), y = nu(e.readBytes(h));
      return d8(y);
    default:
      throw new Be("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const W8 = (t) => t.length % 2 == 0 ? t : `0${t}`, X8 = (t, e) => t.padEnd(e, "0"), ug = (t, e) => t ? Qs(t).length > e : !1;
function tl(t) {
  return C0(t);
}
const Ai = (t) => $A(au(t)), hu = (t) => pt(e8(t)), Y8 = (t) => pt(Ai(t)), Z8 = (t) => {
  const e = Ai(t), n = ba(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ai(n);
  return pt(r);
}, Q8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Qt(n), s = Ai(r);
  return pt(s);
}, J8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Qt(n), s = au(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Qt(i), a = Ai(o);
  return pt(a);
};
function t6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function fg(t) {
  const e = Yt(t);
  return `0x${pt(e)}`;
}
function e6(t) {
  return De(t);
}
const Is = (t) => {
  try {
    return ss.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function pu() {
  return {
    type: Q.MessageSignature,
    data: pt(new Uint8Array(ma))
  };
}
function dg(t, e, n, r) {
  const s = uu(0, t, 1, [js(e)]).hash160, i = Js(js(e)) ? Kt.Compressed : Kt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: ye(n, !1),
    fee: ye(r, !1),
    keyEncoding: i,
    signature: pu()
  };
}
function $i(t) {
  return "signature" in t;
}
function vd(t) {
  return t === Mt.SerializeP2SH || t === Mt.SerializeP2WSH;
}
function n6(t) {
  return t === Mt.SerializeP2SHNonSequential || t === Mt.SerializeP2WSHNonSequential;
}
function Id(t) {
  const e = tl(t);
  return e.nonce = 0, e.fee = 0, $i(e) ? e.signature = pu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function r6(t) {
  const e = [
    t.hashMode,
    zt(t.signer),
    br(t.nonce, !1, 8),
    br(t.fee, !1, 8),
    t.keyEncoding,
    lu(t.signature)
  ];
  return Qt(e);
}
function s6(t) {
  const e = [
    t.hashMode,
    zt(t.signer),
    br(t.nonce, !1, 8),
    br(t.fee, !1, 8)
  ], n = fu(t.fields);
  e.push(du(n));
  const r = new Uint8Array(2);
  return tA(r, t.signaturesRequired, 0), e.push(r), Qt(e);
}
function i6(t, e) {
  const n = pt(e.readBytes(20)), r = BigInt(`0x${pt(e.readBytes(8))}`), s = BigInt(`0x${pt(e.readBytes(8))}`), i = e.readUInt8Enum(Kt, (a) => {
    throw new Be(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Mt.SerializeP2WPKH && i != Kt.Compressed)
    throw new Be("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Qc(e);
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
  const n = pt(e.readBytes(20)), r = BigInt("0x" + pt(e.readBytes(8))), s = BigInt("0x" + pt(e.readBytes(8))), i = ag(e, Q.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case Q.PublicKey:
        Js(f.contents) || (o = !0);
        break;
      case Q.MessageSignature:
        if (f.pubKeyEncoding === Kt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Mr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Mt.SerializeP2WSH || t === Mt.SerializeP2WSHNonSequential))
    throw new Mr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Xa(t) {
  return $i(t) ? r6(t) : s6(t);
}
function Ya(t) {
  const e = t.readUInt8Enum(Mt, (n) => {
    throw new Be(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Mt.SerializeP2PKH || e === Mt.SerializeP2WPKH ? i6(e, t) : o6(e, t);
}
function hg(t, e, n, r) {
  const i = t + pt(new Uint8Array([e])) + pt(br(n, !1, 8)) + pt(br(r, !1, 8));
  if (zt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return hu(zt(i));
}
function pg(t, e, n) {
  const r = 33 + ma, s = Js(e) ? Kt.Compressed : Kt.Uncompressed, i = t + W8(s.toString(16)) + n.data, o = zt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return hu(o);
}
function a6(t, e, n, r, s) {
  const i = hg(t, e, n, r), o = m8(s, i), a = x8(s), c = pg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function gg(t, e, n, r, s, i) {
  const o = hg(t, e, n, r), a = js(h8(o, i, s)), c = pg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function c6() {
  const t = dg(Mt.SerializeP2PKH, "", 0, 0);
  return t.signer = C8().hash160, t.keyEncoding = Kt.Compressed, t.signature = pu(), t;
}
function Ld(t, e, n) {
  return $i(t) ? l6(t, e, n) : u6(t, e, n);
}
function l6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = gg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = uu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Mr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function u6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case Q.PublicKey:
        Js(c.contents) || (i = !0), r.push(c.contents);
        break;
      case Q.MessageSignature:
        c.pubKeyEncoding === Kt.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = gg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (vd(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new Mr("Too many signatures");
        break;
    }
  if (vd(t.hashMode) && o !== t.signaturesRequired || n6(t.hashMode) && o < t.signaturesRequired)
    throw new Mr("Incorrect number of signatures");
  if (i && (t.hashMode === Mt.SerializeP2WSH || t.hashMode === Mt.SerializeP2WSHNonSequential))
    throw new Mr("Uncompressed keys are not allowed in this hash mode");
  const a = uu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Mr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function yg(t) {
  return {
    authType: qt.Standard,
    spendingCondition: t
  };
}
function wg(t, e) {
  return {
    authType: qt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || dg(Mt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function kd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case qt.Standard:
        return yg(Id(t.spendingCondition));
      case qt.Sponsored:
        return wg(Id(t.spendingCondition), c6());
      default:
        throw new Ko("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function f6(t, e) {
  switch (t.authType) {
    case qt.Standard:
      return Ld(t.spendingCondition, e, qt.Standard);
    case qt.Sponsored:
      return Ld(t.spendingCondition, e, qt.Standard);
    default:
      throw new Ko("Invalid origin auth type");
  }
}
function d6(t, e) {
  switch (t.authType) {
    case qt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ye(e, !1)
      };
      return { ...t, spendingCondition: n };
    case qt.Sponsored:
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
    case qt.Standard:
      e.push(Xa(t.spendingCondition));
      break;
    case qt.Sponsored:
      e.push(Xa(t.spendingCondition)), e.push(Xa(t.sponsorSpendingCondition));
      break;
  }
  return Qt(e);
}
function w6(t) {
  const e = t.readUInt8Enum(qt, (r) => {
    throw new Be(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case qt.Standard:
      return n = Ya(t), yg(n);
    case qt.Sponsored:
      n = Ya(t);
      const r = Ya(t);
      return wg(n, r);
  }
}
class b6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: ye(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? sA, this.postConditionMode = i ?? Fs.Deny, this.postConditions = s ?? fu([]), o)
      this.anchorMode = lA(o);
    else
      switch (r.payloadType) {
        case dt.Coinbase:
        case dt.CoinbaseToAltRecipient:
        case dt.NakamotoCoinbase:
        case dt.PoisonMicroblock:
        case dt.TenureChange:
          this.anchorMode = Se.OnChainOnly;
          break;
        case dt.ContractCall:
        case dt.SmartContract:
        case dt.VersionedSmartContract:
        case dt.TokenTransfer:
          this.anchorMode = Se.Any;
          break;
      }
  }
  signBegin() {
    const e = tl(this);
    return e.auth = kd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = tl(this);
    return e.auth = kd(e.auth), e.txid();
  }
  verifyOrigin() {
    return f6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, qt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === qt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, qt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !$i(n)) {
      const r = Js(e);
      n.fields.push($s(r ? Kt.Compressed : Kt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = a6(n, r, e.fee, e.nonce, s);
    return $i(e) ? e.signature = i : e.fields.push($s(s.data.byteLength === Dp ? Kt.Compressed : Kt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return hu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != qt.Sponsored)
      throw new Ko("Cannot sponsor sign a non-sponsored transaction");
    this.auth = g6(this.auth, e);
  }
  setFee(e) {
    this.auth = d6(this.auth, e);
  }
  setNonce(e) {
    this.auth = h6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != qt.Sponsored)
      throw new Ko("Cannot sponsor sign a non-sponsored transaction");
    this.auth = p6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ir('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ir('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ir('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ir('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ir('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Xr(n, this.chainId, 0), e.push(n), e.push(y6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(du(this.postConditions)), e.push(rg(this.payload)), Qt(e);
  }
}
function gu(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ui(zt(t.slice(2))) : e = new ui(zt(t)) : t instanceof Uint8Array ? e = new ui(t) : e = t;
  const n = e.readUInt8Enum(zo, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = w6(e), i = e.readUInt8Enum(Se, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(Fs, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = ag(e, Q.PostCondition), c = I8(e);
  return new b6(n, s, c, a, o, i, r);
}
const m6 = o8, fi = hr, x6 = Qp;
const S6 = /* @__PURE__ */ new Set([4001, -31001]), E6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], A6 = ["result", "data", "payload", "response", "params"], Cd = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Ea = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), cs = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, _n = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, $6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), bg = (t) => {
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
}, mg = (t) => t ? bg(cs()).some(
  (e) => {
    var n;
    return e.id === t && (Ea(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, xg = () => {
  if (typeof window > "u")
    return;
  const t = cs(), e = bg(t).filter(
    (n) => {
      var r;
      return Ea(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = _n(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of E6) {
    const r = _n(t, n) ?? (t === window ? void 0 : _n(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, v6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = cs(), n = _n(e, t) ?? (e === window ? void 0 : _n(window, t)) ?? ca(t);
  if (n)
    return n;
  if (Ea(t) || mg(t))
    return xg();
}, fo = (t, e) => {
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
const Sg = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Ce = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, k6 = (t) => {
  const e = Ce(t);
  if (!e)
    return null;
  const n = Sg(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, C6 = (t) => {
  const e = Ce(t);
  if (!e)
    return null;
  const n = Sg(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, el = (t, e = "mainnet") => {
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
      return el(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return el(r, e);
  }
  return e;
}, Nr = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, vi = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Is(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = vi(s, e + 1);
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
    const i = vi(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Is(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Is(n.testnet) ? n.testnet.trim() : null;
}, Bd = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Eg = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && S6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Zr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Ce(n == null ? void 0 : n.message) ?? Ce(e.message) ?? Ce(e.error) ?? Ce(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Gs = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Zr(e);
    if (e.status === "error")
      throw Zr(e.result ?? e);
  }
  return t;
}, Td = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Gs(r);
  } catch (r) {
    throw Zr(r);
  }
}, Ag = () => xg(), yu = () => {
  if (typeof window > "u")
    return;
  const t = cs();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = _n(t, e) ?? (t === window ? void 0 : _n(window, e));
    if (n)
      return n;
  }
}, Md = () => {
  if (typeof window > "u")
    return;
  const t = yu();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = cs();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = _n(e, n) ?? (e === window ? void 0 : _n(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Eo = (t) => {
  var r, s;
  const e = zr();
  if (Ea(e) || mg(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = cs() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Ag();
}, Za = (t) => {
  const e = C6(t);
  if (!e)
    return null;
  try {
    const n = gu(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Vo = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Za(t), r = k6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Ce(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Vo(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Cd)
    if (Za(s[a])) {
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
  for (const a of Cd) {
    const c = Za(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Ce(s[a]) ?? void 0
      };
  }
  for (const a of A6) {
    const c = s[a], f = Vo(c, e + 1);
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
}, Qa = (t) => {
  const e = Vo(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, B6 = (t) => {
  const e = Vo(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, T6 = (t) => ({
  ...t,
  fee: Nr(t.fee),
  nonce: Nr(t.nonce),
  sponsored: t.sponsored === !0
}), _d = (t) => ({
  recipient: t.recipient,
  amount: Nr(t.amount) ?? "0",
  memo: t.memo,
  network: el(t.network),
  address: t.stxAddress,
  fee: Nr(t.fee),
  nonce: Nr(t.nonce),
  sponsored: t.sponsored ?? !1
}), $g = "WALLET_ADDRESS_MISMATCH", M6 = 45e3;
let di = null;
const nl = (t) => {
  t && (di = { address: t, at: Date.now() });
}, _6 = () => {
  di = null;
}, U6 = () => di && Date.now() - di.at <= M6 ? di.address : null, N6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, H6 = async (t) => {
  _6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Gs(await t.request("wallet_connect")), n = vi(e);
  return nl(n), n;
}, P6 = async (t, e, n, r) => {
  try {
    return Gs(await t.request(e, n));
  } catch (s) {
    const i = Zr(s);
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
        { code: o ? $g : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Gs(await t.request(e, n));
    } catch (a) {
      throw Zr(a);
    }
  }
};
let Ud = 3e4;
const O6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Ud / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Ud);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, D6 = async (t, e, n) => {
  const r = (c, f) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${f}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: $g }
      );
    return c;
  }, s = U6();
  if (s)
    return fo(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  fo(n, "account-read");
  try {
    const c = Gs(
      await O6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = vi(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Eg(c))
      throw Zr(c);
    fo(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return nl(i), r(i, "wallet_getAccount");
  let o;
  fo(n, "account-reconnect");
  try {
    o = Gs(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Zr(c);
  }
  const a = vi(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return nl(a), r(a, "wallet_connect");
}, F6 = async (t, e) => {
  if (!Eo(t)) {
    const i = await Td(
      t,
      "stx_transferStx",
      _d(e)
    );
    return Qa(i);
  }
  const n = yu();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Td(
      n,
      "stx_transferStx",
      _d(e)
    );
    return Qa(i);
  }
  const r = Ag();
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
      amount: Nr(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Nr(e.fee) } : {}
    },
    e.stxAddress
  );
  return Qa(s);
}, j6 = () => zr(), vg = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = zr(), e = t ? v6(t) : void 0;
  if (e)
    return e;
  const n = cs() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Nd = (t, e) => {
  const n = vg(), r = T6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, B6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ao(r, e);
  if (Eo(n) && !yu()) {
    const s = Md();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: zr(),
        route: "legacy-transaction-request"
      }), ao(r, s);
  }
  return void F6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Bd(s) && Eo(n)) {
      const a = Md();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: zr(),
          route: "legacy-transaction-request"
        }), ao(r, a);
        return;
      }
    }
    if (Bd(s) && !Eo(n)) {
      ao(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Eg(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Hd = (t) => fg(t).replace(/^0x/, ""), Pd = "This wallet cannot sign messages. Try Xverse or Leather.", Od = (t) => typeof (t == null ? void 0 : t.request) == "function", Dd = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", z6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, R6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function G6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Hd(e.message),
    domain: Hd(e.domain)
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
    network: ya(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Fd(t) {
  var s, i;
  const e = j6() || "", n = /xverse/i.test(e);
  let r = vg();
  if (n && !Dd(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Dd(r))
    try {
      return await K6(r, t);
    } catch (o) {
      if (n || !Od(r) || !R6(o)) throw o;
    }
  if (!n && Od(r))
    try {
      return await G6(r, t);
    } catch (o) {
      throw z6(o) ? new Error(Pd) : o;
    }
  throw new Error(Pd);
}
const jd = 1000000n, hi = 1000000n, rl = 50n, Ks = 3000n, Aa = 300n, V6 = 3000n, q6 = 50000n, zd = 200n, Vs = (t) => t + rl;
function Cn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / jd}.${(n % jd).toString().padStart(6, "0")}`;
}
function W6(t, e = Aa) {
  return t <= Ks ? 0 : Number((t - Ks) / Vs(e));
}
function Rd(t, e = 0n) {
  const n = hi - t - e;
  return n > 0n ? n : 0n;
}
function X6(t, e = Aa) {
  return t > hi ? "over" : t < Ks + Vs(e) ? "empty" : t < q6 ? "low" : "ok";
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
const Ig = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Ja = 3, t5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [sl, Lg] = Ig.split("."), Ne = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function il(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function e5(t) {
  return Ne(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Qr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function kg(t, e = []) {
  const n = await Qr(`/v2/contracts/call-read/${sl}/${Lg}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: sl, arguments: e.map((r) => "0x" + Ne(Yt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Tn(De(n.result));
}
async function n5() {
  const t = await Qr(`/v2/contracts/source/${sl}/${Lg}?proof=0`);
  if (typeof t.source != "string" || await e5(t.source) !== Z6) throw Error("Deployed source does not match the tested helper.");
  if (J6(await kg("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Cg(t) {
  return t.startsWith("SP") && Is(t) && !t.includes(".");
}
async function r5(t) {
  var r;
  if (!Cg(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Qr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Qr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function s5(t) {
  const e = await Qr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function i5(t, e) {
  var s, i;
  const n = await kg("get-owner", [fi(t), fi(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Cg(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function o5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: il(t), signal: AbortSignal.timeout(15e3) });
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
  const e = gu(il(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || As(ii(Ro.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || As(r.contractAddress) + "." + r.contractName.content !== Ig || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Ne(Yt(r.functionArgs[0])) !== Ne(Yt(fi(t.core))) || Ne(Yt(r.functionArgs[1])) !== Ne(Yt(fi(t.song))) || Ne(Yt(r.functionArgs[2])) !== Ne(Yt(x6(il(t.id)))) || t.amount !== "50" || e.postConditionMode !== Fs.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== xi.Equal || i.principal.prefix !== 2 || As(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || As(r.contractAddress) + "." + r.contractName.content !== t5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Ne(Yt(r.functionArgs[0])) !== Ne(Yt(fi(t.song))) || typeof t.liked != "boolean" || Ne(Yt(r.functionArgs[1])) !== Ne(Yt(m6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Fs.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Tn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const l5 = "xtrata.xyz/radio/listening-wallet", u5 = "Link a temporary listening wallet for pay-per-play; no spending permission", qo = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Is(t), f5 = (t) => ({
  domain: Ei({ name: qe(l5), version: qe("1"), "chain-id": hr(1) }),
  message: Ei({
    purpose: qe(u5),
    main: qe(t.main),
    listening: qe(t.listening),
    issued: hr(t.issued)
  })
}), Gd = ["prepared", "signed", "unknown", "pending"], d5 = 30 * 6e4, ys = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, h5 = 3e3, Kd = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function p5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, f = !1, d = !1, l = !1, g = null, h = !1, y = "", w = "", $, H = null, U, b = [], L, A = -1 / 0;
  const N = /* @__PURE__ */ new Set();
  let q = null, F = !1, K = 0, m = null, k = !1, O = !1, z = !1, J = !1, W = !1, ne = 0, Nt = null, kt = Promise.resolve();
  const S = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Aa.toString()), T = (x) => !!i && !(i.features ?? []).includes(x), ot = (x, _) => `xtrata.ppp.v1.${x}:${_}`, I = (x = i == null ? void 0 : i.address) => {
    if (!x) return [];
    try {
      const _ = JSON.parse(t.store.get(ot("entries", x)) || "[]");
      return Array.isArray(_) ? _ : [];
    } catch {
      return [];
    }
  }, M = (x) => {
    const _ = [x, ...I(x.address).filter((Y) => !(Y.txid === x.txid && Y.kind === x.kind))].slice(0, 200);
    t.store.set(ot("entries", x.address), JSON.stringify(_));
  }, D = (x = i == null ? void 0 : i.address) => !!x && t.store.get(ot("on", x)) !== "0", tt = (x) => {
    i != null && i.address && t.store.set(ot("on", i.address), x ? "1" : "0");
  }, et = () => I().filter((x) => Gd.includes(x.status)), Ht = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(ot("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, Ot = (x) => {
    i != null && i.address && t.store.set(ot("deposit", i.address), JSON.stringify(x));
  }, Fe = () => et().filter((x) => t.now() - x.created > d5 && N.has(x.txid)), je = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Bt = () => je() && !(i != null && i.linked), ae = () => {
    const x = t.main();
    return !Bt() && !!x && !!(i != null && i.linked) && i.linked !== x;
  }, It = (x) => ot("return-to", x), Jt = (x = i == null ? void 0 : i.address) => {
    if (!x) return;
    const _ = t.store.get(It(x));
    return _ && qo(_) && _ !== x ? _ : void 0;
  }, te = (x = i == null ? void 0 : i.address) => q && q.for === x ? q.res : null;
  function Xt() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const x = Jt();
    if (x) return { to: x, kind: "chosen" };
    const _ = te();
    if (_ != null && _.ok && _.funder) return { to: _.funder, kind: "funder" };
  }
  function u() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const x = t.main();
    if (!Bt()) {
      if (!x) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : ae() ? "wrong-wallet" : i.state === "known" ? "locked" : !Bt() && i.linked !== x ? "link" : o === void 0 ? "loading" : o > hi ? "over" : o < Ks + Vs(S()) ? "fund" : "ready" : "loading";
  }
  const v = () => {
    var x, _, Y, Et;
    return {
      step: u(),
      busy: c,
      message: y,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : X6(o, S()),
      playsLeft: o === void 0 ? 0 : W6(o, S()),
      allowance: o === void 0 ? hi : Rd(o, BigInt(((x = Ht()) == null ? void 0 : x.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: D(),
      entries: I(),
      depositTxid: ((_ = Ht()) == null ? void 0 : _.txid) ?? $,
      depositPending: !!Ht(),
      walletOutdated: T("like"),
      linkedListening: L && L === t.main() ? b.map((V) => V.listening) : [],
      serverLinked: !!H && U === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Fe().length,
      armed: J,
      queued: _t.length,
      solo: Bt(),
      returnTo: (Y = Xt()) == null ? void 0 : Y.to,
      returnToKind: (Et = Xt()) == null ? void 0 : Et.kind,
      funderState: (() => {
        const V = te();
        return V ? V.ok ? V.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const V = te();
        return !!V && V.ok && V.distinct > 1;
      })(),
      walletCannotSolo: Bt() && T("standalone"),
      walletCannotMulti: T("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((V) => V !== t.main() && V !== (i == null ? void 0 : i.linked)),
      creditedTo: Bt() && (i != null && i.address) && (m == null ? void 0 : m.for) === i.address && m.main ? m.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(ot("created", i.address)) === "1"
    };
  }, C = (x, _ = "") => {
    y = x, w = _, t.changed();
  };
  async function R(x, _) {
    if (!c) {
      c = x, w = "", t.changed();
      try {
        await _();
      } catch (Y) {
        const Et = Y instanceof Error ? Y.message : String(Y);
        w = /Cancelled in the listening wallet/.test(Et) ? "" : Et, w || (y = "Not now. Nothing was signed.", W = !0);
      } finally {
        c = null, await st(!0);
      }
    }
  }
  const gt = () => !!(e != null && e.enabled) && e.here && (Bt() || !!t.main() && e.allowed), Lt = () => gt() && !ae(), ce = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Pt = () => {
    if (ae()) throw new Error(ce());
  };
  async function we() {
    if (!gt()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const ze = (x) => {
    const _ = t.main();
    return x.request("listening.status", _ ? { main: _ } : void 0);
  };
  async function wn(x = !1) {
    i != null && i.address && (!x && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function Pn(x) {
    if ((L !== x || t.now() - A >= 6e4) && (b = await t.links(x), L = x, A = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === x) return;
    const _ = `${x}:${i.address}`;
    U === _ && H || (H = b.find((Y) => Y.listening === i.address) ?? null, U = _);
  }
  async function le() {
    const x = i == null ? void 0 : i.address;
    if (!Bt() || !x || i != null && i.linked || !t.funder || F || !o || o <= 0n) return;
    const _ = te(x);
    if (_ != null && _.ok && _.funder) return;
    const Y = _ != null && _.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, K - 1), 30 * 6e4);
    if (!(q && q.for === x && t.now() - q.at < Y)) {
      F = !0;
      try {
        q = { for: x, res: await t.funder(x), at: t.now() };
      } catch {
        q = { for: x, res: { ok: !1 }, at: t.now() };
      } finally {
        F = !1;
      }
      K = q.res.ok ? 0 : K + 1;
    }
  }
  async function ls() {
    const x = i == null ? void 0 : i.address;
    if (!(!Bt() || !x || i != null && i.linked || !t.mainOf || k) && !(m && m.for === x && (m.ok || t.now() - m.at < 6e4))) {
      k = !0;
      try {
        m = { for: x, main: await t.mainOf(x), ok: !0, at: t.now() };
      } catch {
        m = { for: x, main: null, ok: !1, at: t.now() };
      } finally {
        k = !1;
      }
    }
  }
  async function bn() {
    var Et;
    const x = i == null ? void 0 : i.address;
    if (!x) return;
    let _;
    for (const V of et())
      try {
        const wt = await t.chain.transaction(V.txid);
        if (!wt) {
          if (N.add(V.txid), t.now() - V.created > 15 * 6e4 && (_ ?? (_ = await t.chain.confirmedNonce(x))), _ !== void 0 && _ > BigInt(V.nonce)) {
            M({ ...V, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((V.status === "unknown" || V.status === "signed") && V.raw)
            try {
              await t.chain.broadcast(V.raw, V.txid), M({ ...V, status: "pending" });
            } catch (Dt) {
              ys(Dt) && M({ ...V, status: "failed", note: Dt.message, raw: void 0 });
            }
          continue;
        }
        N.delete(V.txid);
        const yt = String(wt.tx_status);
        if (yt === "success" && wt.canonical !== !1 && wt.is_unanchored === !1) {
          if (M({ ...V, status: "confirmed", confirmedAt: t.now(), actualFee: String(wt.fee_rate ?? V.fee), raw: void 0 }), V.kind === "like" && (h = !0, V.status !== "confirmed" && typeof V.liked == "boolean"))
            try {
              (Et = t.likeConfirmed) == null || Et.call(t, V.song, V.liked);
            } catch {
            }
        } else yt.startsWith("abort_") || yt.startsWith("dropped_") ? M({ ...V, status: "failed", note: yt, raw: void 0 }) : V.status !== "pending" && M({ ...V, status: "pending" });
      } catch {
      }
    const Y = Ht();
    if (Y)
      try {
        const V = await t.chain.transaction(Y.txid), wt = String((V == null ? void 0 : V.tx_status) ?? "");
        (wt === "success" && V.is_unanchored === !1 || wt.startsWith("abort_") || wt.startsWith("dropped_") || !V && t.now() - Y.at > 2 * 36e5) && (Ot(null), a = -1 / 0);
      } catch {
      }
  }
  async function st(x = !1) {
    var _;
    try {
      const Y = t.main();
      if ((x || !e || r !== Y || t.now() - n > 3e5) && (e = await t.config(Y), n = t.now(), r = Y), !e.enabled || !e.here || !Bt() && (!Y || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), J && $e(), t.changed();
        return;
      }
      await we(), i = await ze(s), ae() && i.state === "unlocked" && (On(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await ze(s)), Y && e.allowed && await Pn(Y), await wn(x), await le(), await ls(), await bn();
    } catch (Y) {
      w = Y instanceof Error ? Y.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (u() === "locked" ? Rt() : J && $e(), h) {
      h = !1;
      try {
        (_ = t.likesChanged) == null || _.call(t);
      } catch {
      }
    }
    t.changed(), _t.length && !ve && Dn();
  }
  async function $t(x, _) {
    var wt;
    Pt();
    const Y = !(i != null && i.address) || D(i.address), Et = i != null && i.linked ? (wt = t.nameOf) == null ? void 0 : wt.call(t, i.linked) : void 0;
    await x.request("listening.unlock", { mode: "unlock", terms: Y ? mn() : void 0, anyPasskey: _, ...t.main() ? { main: t.main() } : {}, ...Et ? { label: Et } : {} }), i = await ze(x), Y && (D(i.address) ? await xn() : await x.request("listening.stop")), C(Y ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const V = g;
    g = null, V && t.now() - V.at < 12e4 && setTimeout(() => void st(!0).then(() => be(V)), 0);
  }
  function Rt() {
    J || c || W || ne >= 3 || !s || !(i != null && i.address) || (J = !0, kt = (async () => {
      try {
        await $t(s, !1), ne = 0;
      } catch (x) {
        const _ = x instanceof Error ? x.message : String(x);
        /Cancelled in the listening wallet/.test(_) ? Nt || (W = !0, C("Not now. Nothing was signed.")) : /did not answer/.test(_) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (ne++, w = _);
      } finally {
        J = !1;
        const x = Nt;
        Nt = null, x ? await x() : await st(!0);
      }
    })());
  }
  async function $e(x) {
    J && (Nt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await kt), x && await x(), t.changed();
  }
  const mn = () => ({
    fee: S().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: hi.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function xn() {
    if (!(i != null && i.address)) return !1;
    if (z || (z = await t.tabLock(i.address)), !z)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const Qe = {
    forceRefresh: () => st(!0),
    create: () => R("Waiting for your passkey…", async () => {
      const x = await we();
      await x.request("listening.unlock", { mode: "create", terms: mn(), ...t.main() ? { main: t.main() } : {} }), i = await ze(x), i.address && t.store.set(ot("created", i.address), "1"), tt(!0), C(Bt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await xn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (x, _) => {
      !(i != null && i.address) || Ht() || (Ot({ txid: x, amount: _.toString(), at: t.now() }), a = -1 / 0, C("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    unlock: (x = !1) => {
      const _ = () => R("Waiting for your passkey…", async () => $t(await we(), x));
      return J ? x ? T("cancel") ? (C("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : $e(async () => {
        (u() === "locked" || u() === "intro") && await _();
      }) : kt : _();
    },
    link: () => R("Sign in your wallet…", async () => {
      Pt();
      const x = t.main();
      if (!x || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const _ = (await t.links(x)).find((Y) => Y.listening === i.address);
      if (_)
        await s.request("listening.link", { main: x, issued: _.issued, mainSignature: _.mainSignature });
      else {
        const Y = { main: x, listening: i.address, issued: t.now() }, Et = await t.signWithMain(x, f5(Y)), V = await s.request("listening.link", { main: x, issued: Y.issued, mainSignature: Et });
        await t.saveLink({ ...Y, mainSignature: Et, listeningSignature: V.listeningSignature }), A = -1 / 0;
      }
      C("Linked ✓");
    }),
    deposit: () => R("Approve the deposit in your wallet…", async () => {
      Pt();
      const x = t.main();
      if (!x || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Ht()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await wn(!0);
      const _ = Rd(o ?? 0n);
      if (_ <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      $ = await t.deposit(x, i.address, _), $ && Ot({ txid: $, amount: _.toString(), at: t.now() }), C("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => R("Confirm in the listening wallet…", async () => {
      if (!Lt()) throw new Error("Connect your wallet first.");
      await xn(), await s.request("listening.approveSession", mn()), tt(!0), C("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => R("Clearing…", async () => {
      for (const x of Fe())
        await t.chain.transaction(x.txid) || M({ ...x, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      C("Cleared ✓");
    }),
    switchOff: () => R("Switching off…", async () => {
      On(), await (s == null ? void 0 : s.request("listening.stop")), tt(!1), C("Paying is off. Music stays free.");
    }),
    lock: () => R("Locking…", async () => {
      On(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, C("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (x) => {
      const _ = String(x ?? "").trim();
      if (!(i != null && i.address)) return C("", "Unlock the listening wallet first.");
      if (!qo(_)) return C("", "Enter a standard mainnet address (it starts with SP).");
      if (_ === i.address) return C("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(It(i.address), _), C("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(It(i.address), ""), t.changed();
    },
    returnFunds: (x) => R("Check the return in the listening wallet…", async () => {
      if (!Lt()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      const _ = Xt();
      if (!_) throw new Error(Bt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (_.kind !== "linked" && T("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (et().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: Y, nonce: Et } = await t.chain.account(i.address);
      o = Y;
      const V = await s.request("listening.prepareReturn", {
        mode: x,
        balance: Y.toString(),
        nonce: Et.toString(),
        fee: V6.toString(),
        ..._.kind === "linked" ? {} : { destination: _.to }
      });
      if (V.recipient !== _.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
      const wt = gu(V.raw);
      if (Tn(wt.payload.recipient).value !== _.to || String(wt.payload.amount) !== V.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const yt = {
        id: Kd(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: V.recipient,
        amount: V.amount,
        fee: V.fee,
        nonce: Et.toString(),
        created: t.now(),
        status: "signed",
        raw: V.raw,
        txid: V.txid
      };
      t.validate(yt), M(yt);
      try {
        await t.chain.broadcast(V.raw, V.txid), M({ ...yt, status: "pending" });
      } catch (Dt) {
        throw M({ ...yt, status: "unknown", note: Dt.message }), Dt;
      }
      x === "all" && tt(!1), C(x === "all" ? _.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, _t = [], Sn = 10, xr = 30 * 6e4;
  let ve = !1;
  const Sr = () => f || !!c || d || l, On = () => {
    _t.length && (_t.length = 0, t.changed());
  };
  async function us(x) {
    if (!_t.some((_) => _.id === x.id) && !I().some((_) => _.id === x.id) && (_t.push({ ...x, at: t.now() }), _t.length > Sn && _t.shift()), Sr() || et().length) {
      const _ = _t.length;
      y = `Queued ${_ === 1 ? "this song" : _ + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Dn();
  }
  async function Dn() {
    if (!ve) {
      ve = !0;
      try {
        for (; _t.length; ) {
          for (; _t.length && t.now() - _t[0].at > xr; ) _t.shift();
          if (!_t.length || Sr() || await X(_t[0]) === "wait") return;
          _t.shift();
        }
      } finally {
        ve = !1, t.changed();
      }
    }
  }
  async function X(x) {
    f = !0;
    try {
      await st();
      const _ = u();
      if (_ === "loading") return "wait";
      if (_ !== "ready" || !D() || !(i != null && i.session) || i.session.playsLeft < 1 || !z) return "done";
      if (et().length) return "wait";
      O || (await t.chain.verify(), O = !0);
      const Y = i.address, { balance: Et, nonce: V } = await t.chain.account(Y);
      o = Et, a = t.now();
      const wt = await t.chain.owner(Ja, x.song);
      if (wt === Y || wt === t.main()) return "done";
      const yt = await s.request("listening.signPlay", {
        core: Ja,
        song: x.song,
        receipt: x.id,
        fee: S().toString(),
        nonce: V.toString(),
        balance: Et.toString()
      }), Dt = {
        id: x.id,
        address: Y,
        kind: "play",
        core: Ja,
        song: x.song,
        recipient: wt,
        amount: "50",
        fee: S().toString(),
        nonce: V.toString(),
        created: t.now(),
        status: "signed",
        raw: yt.raw,
        txid: yt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      t.validate(Dt), M(Dt);
      const An = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`;
      try {
        await t.chain.broadcast(yt.raw, yt.txid), M({ ...Dt, status: "pending" }), y = `♪ Paid ${An}`, w = "";
      } catch (Je) {
        M({ ...Dt, status: ys(Je) ? "failed" : "unknown", note: Je.message, ...ys(Je) ? { raw: void 0 } : {} }), w = Je.message;
      }
      return i = await ze(s), "done";
    } catch (_) {
      return y = "This song played free: " + (_ instanceof Error ? _.message : "payment unavailable"), "done";
    } finally {
      f = !1, t.changed();
    }
  }
  function rt(x) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(u()) || T("like") ? !1 : (be(x), !0);
  }
  async function be(x) {
    const _ = x.title ? `“${x.title}”` : `song #${x.song}`, Y = (re) => {
      var tn;
      w = re, y = "";
      try {
        (tn = t.likeFailed) == null || tn.call(t, x.song);
      } catch {
      }
      t.changed();
    }, Et = u(), V = t.main(), wt = Bt() ? i == null ? void 0 : i.address : V;
    if (Et === "locked") {
      g = { ...x, at: t.now() }, C(`Unlock to like ${_}. It sends straight after.`);
      return;
    }
    if (Et === "wrong-wallet") return Y(ce());
    if (Et === "link") return Y("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Bt() && T("standalone")) return Y("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (Et === "fund") return Y("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (Et === "over") return Y("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Et !== "ready" || !wt) return Y("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return Y("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!z) return Y("Pay-per-play is running in another tab. Like from that tab.");
    const yt = I().find((re) => re.kind === "like" && re.song === x.song);
    if (yt && Gd.includes(yt.status))
      return Y(`Your last like for ${_} is still on its way. It can change again once it confirms.`);
    if (d) return Y("One like at a time: your last one is still being sent.");
    if ((yt == null ? void 0 : yt.status) === "confirmed" && t.now() - (yt.confirmedAt ?? 0) < h5)
      return Y(`Your like for ${_} has only just confirmed. Try again in a moment.`);
    let Dt;
    l = !0;
    try {
      Dt = t.likeState ? (await t.likeState(wt, x.song)).by : x.likedBy ?? [];
    } catch {
      Dt = x.likedBy;
    } finally {
      l = !1;
    }
    if (!Dt) return Y(`Could not check ${_} right now. Try the heart again.`);
    const An = i.address, $n = ((yt == null ? void 0 : yt.status) === "confirmed" && typeof yt.liked == "boolean" && t.now() - (yt.confirmedAt ?? yt.created) < 5 * 6e4 ? yt.liked : void 0) ?? Dt.includes(An);
    if (!$n && Dt.some((re) => re !== An)) return Y(Bt() ? `${_} was liked from another wallet of yours. Unlike it there.` : `${_} was liked from your main wallet${Dt.includes(V) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await En({ song: x.song, liked: !$n, title: x.title, artist: x.artist });
  }
  async function En(x) {
    var Et, V, wt;
    if (d) {
      C("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const _ = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`, Y = t.wait ?? ((yt) => new Promise((Dt) => setTimeout(Dt, yt)));
    try {
      C(`${x.liked ? "Liking" : "Unliking"} ${_}…`);
      const yt = t.now() + 12e4;
      for (; f || et().length; ) {
        if (t.now() > yt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await Y(5e3), await st(!0);
      }
      if (u() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const Dt = i.address, { balance: An, nonce: Je } = await t.chain.account(Dt);
      o = An, a = t.now();
      const $n = await s.request("listening.signLike", {
        song: x.song,
        liked: x.liked,
        fee: zd.toString(),
        nonce: Je.toString(),
        balance: An.toString()
      }), re = {
        id: Kd(),
        address: Dt,
        kind: "like",
        core: 0,
        song: x.song,
        liked: x.liked,
        recipient: "",
        amount: "0",
        fee: zd.toString(),
        nonce: Je.toString(),
        created: t.now(),
        status: "signed",
        raw: $n.raw,
        txid: $n.txid,
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      t.validate(re), M(re);
      try {
        await t.chain.broadcast($n.raw, $n.txid), M({ ...re, status: "pending" }), y = `${x.liked ? "♥ Liked" : "Unliked"} ${_}`, w = "";
        try {
          (Et = t.likeSent) == null || Et.call(t, x.song, x.liked);
        } catch {
        }
      } catch (tn) {
        if (M({ ...re, status: ys(tn) ? "failed" : "unknown", note: tn.message, ...ys(tn) ? { raw: void 0 } : {} }), w = tn.message, ys(tn)) try {
          (V = t.likeFailed) == null || V.call(t, x.song);
        } catch {
        }
      }
      i = await ze(s);
    } catch (yt) {
      w = "Like not sent: " + (yt instanceof Error ? yt.message : "the listening wallet is unavailable");
      try {
        (wt = t.likeFailed) == null || wt.call(t, x.song);
      } catch {
      }
    } finally {
      d = !1, t.changed(), Dn();
    }
  }
  return { snapshot: v, refresh: st, onListened: us, heart: rt, toggleLike: be, ...Qe };
}
const Bg = ["Connect", "Passkey", "Link & fund", "Listen"], Tg = ["Passkey", "Add 1 STX", "Listen"], ol = (t) => t ? Tg : Bg;
function g5(t) {
  if (t.solo) return y5(t);
  const e = Bg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
  const e = Tg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
  return !e || e.at >= ol(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const b5 = 100000n, m5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function x5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !qo(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= b5).sort(m5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const ho = 50;
function Vd(t) {
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
  if (!qo(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${ho}&offset=${o}`, s = Vd(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - ho);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= ho ? s : Vd(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = x5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - ho);
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
}, B5 = {}, qd = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, T5 = "xtrata.log.enabled", M5 = "xtrata.log.level", _5 = "xtrata.log.tags", U5 = "xtrata.log.dedupe", po = (t) => {
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
  const t = B5 ?? {}, e = po(T5) ?? t.VITE_LOG_ENABLED, n = po(M5) ?? t.VITE_LOG_LEVEL, r = po(_5) ?? t.VITE_LOG_TAGS, s = po(U5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: N5(e),
    level: H5(n) ?? "warn",
    tags: O5(r),
    dedupe: P5(s)
  };
}, F5 = (t, e, n) => !t.enabled || qd[n] < qd[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), j5 = (t, e, n, r) => {
  const s = D5();
  if (!F5(s, e, t) || R5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, z5 = /* @__PURE__ */ new Set();
let Wd = null;
const R5 = (t, e, n, r, s) => (Wd !== t && (z5.clear(), Wd = t), !1), G5 = (t, e, n) => j5("debug", t, e, n), K5 = {}, V5 = {
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
}, Y5 = (t) => t.replace(/\/+$/, ""), Z5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Xd = (t) => {
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
}, ws = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Q5 = (t) => {
  var c, f;
  let e;
  try {
    e = Tn(e6(t));
  } catch {
    return null;
  }
  const n = ws(e);
  if (!n || n.success === !1)
    return null;
  const r = ws(n.value), s = ws(r == null ? void 0 : r.value), i = ws(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Xd((c = ws(i.name)) == null ? void 0 : c.value), a = Xd((f = ws(i.namespace)) == null ? void 0 : f.value);
  return !o || !a ? null : X5(`${o}.${a}`);
}, J5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Y5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [fg(Wp(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : Q5(i.result);
}, t$ = async (t) => {
  const e = t.address.trim();
  if (!Is(e))
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
const Yd = Object.freeze({
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
  return Object.hasOwn(Yd, String(t)) ? Yd[String(t)] : e;
}
const Zd = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function r$(t, e = "") {
  return Object.hasOwn(Zd, String(t)) ? Zd[String(t)] : e;
}
const s$ = 100000n, i$ = 1000000n, o$ = 3000n, a$ = (t, e) => `${t}#gift=${e}`, c$ = 100, Qd = (t, e = Aa) => t <= Ks ? 0 : Number((t - Ks) / Vs(e)), Jd = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), l$ = "xtrata.xyz/radio/gifts", u$ = "Create Xtrata radio gift links paid from the gift treasury", f$ = (t) => ({
  domain: Ei({ name: qe(l$), version: qe("1"), "chain-id": hr(1) }),
  message: Ei({
    purpose: qe(u$),
    admin: qe(t.admin),
    count: hr(t.count),
    amount: hr(BigInt(t.amount)),
    label: qe(t.label),
    issued: hr(t.issued)
  })
}), th = 1800, tc = /* @__PURE__ */ new Map();
async function Mg(t) {
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
  return await Mg(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function _g(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = tc.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      tc.set(t, { ...a, until: Date.now() + th });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        tc.delete(t), s();
      }, th + 50);
    }
  }, i;
}
const Wo = (t, e, n, r, s) => _g(t, e, async () => await Mg(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), $r = "xtrata.radio.gift.incoming.v1", eh = (t) => "xtrata.radio.gift.mine.v1:" + t, bt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, bs = (t, e, n = "") => {
  const r = bt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, ms = (t) => Cn(t).replace(/\.?0+$/, "");
function h$(t) {
  let e = null;
  const n = (() => {
    try {
      const I = new URL(location.href), M = new URLSearchParams(I.hash.slice(1)).get("gift") ?? I.searchParams.get("gift");
      return M !== null && (I.searchParams.delete("gift"), history.replaceState(null, "", I.pathname + (I.search || ""))), Jd(M) ? M : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const I = JSON.parse(t.store.get($r) || "null");
      return Jd(I == null ? void 0 : I.code) ? I.code : null;
    } catch {
      return null;
    }
  })(), s = n ?? r;
  s && (e = { code: s }, t.store.set($r, JSON.stringify({ code: s, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (I) => {
    const M = await I.json().catch(() => ({}));
    if (!I.ok)
      throw I.status === 404 && t.store.set($r, null), new Error((M == null ? void 0 : M.error) || "Could not check your gift right now. Reload to try again.");
    const D = M;
    e = { ...e, view: D }, ["claimed", "expired", "refunding", "refunded"].includes(D.status) && t.store.set($r, null), t.changed();
  }).catch((I) => {
    e = { ...e, error: I.message }, t.changed();
  }));
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = () => {
    e = null, t.store.set($r, null), t.changed();
  }, a = (I) => I.from ? t.who(I.from) : I.label ? `Xtrata Radio · ${I.label}` : "Xtrata Radio";
  let c = {};
  const f = (I) => {
    if (c.box) return c.box;
    const M = bt("div", "", "ppp-gift-check");
    c.box = M;
    const D = () => {
      const tt = window.turnstile;
      !tt || c.rendered || (c.rendered = !0, tt.render(M, { sitekey: I, callback: (et) => {
        c.token = et, t.changed();
      }, "expired-callback": () => {
        c.token = void 0;
      } }));
    };
    if (window.turnstile) D();
    else {
      const tt = document.createElement("script");
      tt.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", tt.async = !0, tt.onload = D, document.head.append(tt);
    }
    return M;
  };
  let d;
  async function l(I) {
    var M, D;
    if (!(!e || e.claiming || !I.listening)) {
      e.claiming = !0, e.error = void 0, t.changed();
      try {
        const tt = await fetch("/radio/gift/claim", {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(3e4),
          body: JSON.stringify({ code: e.code, wallet: I.listening, turnstile: c.token })
        }), et = await tt.json().catch(() => ({}));
        if (tt.status === 503 && /sending another gift/.test((et == null ? void 0 : et.error) || "")) {
          e.waiting = !0, clearTimeout(d), d = setTimeout(() => {
            e && (e.waiting = !1, t.changed());
          }, 12e3);
          return;
        }
        if (!tt.ok)
          throw (tt.status === 404 || tt.status === 410 || tt.status === 409 && /already had a gift|brand-new/.test((et == null ? void 0 : et.error) || "")) && t.store.set($r, null), new Error((et == null ? void 0 : et.error) || `Could not claim the gift (${tt.status}).`);
        e.done = !0, t.store.set($r, null), t.giftSent(et.txid, BigInt(et.amount));
      } catch (tt) {
        e.error = tt.message, c.token = void 0;
        try {
          (D = (M = window.turnstile) == null ? void 0 : M.reset) == null || D.call(M, c.box);
        } catch {
        }
      } finally {
        e.claiming = !1, t.changed();
      }
    }
  }
  let g = null;
  function h(I) {
    if (!I.listening || !I.depositPending || I.step !== "fund")
      return g = null, [];
    if (!g || g.wallet !== I.listening || t.now() - g.at > 3e4) {
      const M = I.listening;
      g = { ...(g == null ? void 0 : g.wallet) === M ? g : {}, wallet: M, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(M)).then((D) => {
        var tt, et;
        (g == null ? void 0 : g.wallet) === M && (g.state = (tt = D == null ? void 0 : D.gift) == null ? void 0 : tt.state, g.problem = ((et = D == null ? void 0 : D.gift) == null ? void 0 : et.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    return g.state === "sending" && g.problem ? [bt("p", `🎁 Your gift is waiting to go out (${g.problem}). It is retried automatically.`, "ppp-warn")] : [];
  }
  function y(I) {
    var Bt, ae;
    const M = h(I);
    if (!e || ["off", "elsewhere"].includes(I.step)) return M;
    const D = e.view;
    if (e.error && !D) return [bt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!D) return [bt("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return M;
    if (D.status === "claimed" || D.status === "claiming") return [bt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [bt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [bt("p", `🎁 ${a(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (!!I.listening && (!I.createdHere || !!I.linked || !!I.creditedTo || (I.balance ?? 0n) > 0n || I.entries.length > 0))
      return [bt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), bs("Forget this gift link here", o, "quiet")];
    const et = BigInt(D.amount), Ot = [bt("p", `🎁 ${a(D)} sent you ${ms(et)} STX of on-chain music: about ${Qd(et).toLocaleString()} paid plays.`, "ppp-gift")], Fe = !!I.listening && I.createdHere && !I.linked && !I.creditedTo && I.step === "fund" && (I.balance ?? 1n) === 0n && !I.depositPending && !I.entries.length, je = (ae = (Bt = I.gate) == null ? void 0 : Bt.gifts) == null ? void 0 : ae.turnstileSiteKey;
    return Fe ? (je && !c.token ? Ot.push(bt("p", "One quick check and it is yours:", "ppp-mute"), f(je)) : !e.claiming && !e.error && !e.waiting && l(I), (e.claiming || e.waiting) && Ot.push(bt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && Ot.push(bt("p", e.error, "ppp-bad"), bs("Try again", () => {
      e.error = void 0, l(I);
    }))) : I.step === "intro" ? Ot.push(bt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : I.listening && I.linked ? Ot.push(bt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), bs("Forget this gift link here", o, "quiet")) : I.listening && (I.balance ?? 0n) > 0n && Ot.push(bt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), bs("Forget this gift link here", o, "quiet")), Ot;
  }
  async function w(I, M, D) {
    var tt;
    try {
      const et = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(I));
      if ((tt = et == null ? void 0 : et.gift) != null && tt.returnTo) return { ok: !0, funder: et.gift.returnTo, txId: et.gift.txid ?? void 0, amount: et.gift.amount, distinct: 1 };
    } catch {
      if (D) return { ok: !1 };
    }
    return M();
  }
  const $ = bt("div", "", "ppp-gift-fold");
  let H = 250000n, U = "", b = "", L = null;
  const A = (I) => {
    try {
      const M = JSON.parse(t.store.get(eh(I)) || "[]");
      return Array.isArray(M) ? M : [];
    } catch {
      return [];
    }
  }, N = (I, M) => t.store.set(eh(I), JSON.stringify(M.slice(0, 50)));
  let q = 0;
  async function F(I) {
    const M = A(I);
    for (const D of M)
      if (!(D.view && ["claimed", "refunded", "expired"].includes(D.view.status)))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: D.id, ...D.txid ? { txid: D.txid } : {} }) }) : await t.json("/radio/gift?id=" + D.id), D.error = void 0;
        } catch (tt) {
          D.error = tt.message;
        }
    N(I, M), t.changed();
  }
  async function K(I) {
    if (U) return;
    U = "Starting your gift…", b = "", t.changed();
    let M = null;
    try {
      M = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: I, amount: H.toString() }) });
      const D = A(I);
      D.unshift({ id: M.id, code: M.code, amount: H.toString(), at: t.now() }), N(I, D), U = "Approve the gift in your wallet…", t.changed();
      const tt = await t.pay(I, M.depositTo, BigInt(M.deposit), M.memo), et = A(I), Ht = et.find((Ot) => Ot.id === M.id);
      Ht && (Ht.txid = tt, Ht.view = { status: "pending-deposit", amount: H.toString(), source: "friend", from: I, label: "", expires: 0 }), N(I, et), b = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", F(I);
    } catch (D) {
      b = D.message || "Not sent.";
    } finally {
      U = "", t.changed();
    }
  }
  async function m(I, M, D, tt) {
    if (!U) {
      U = "Sign in your wallet…", b = "", L = null, t.changed();
      try {
        const et = { admin: I, count: M, amount: D.toString(), label: tt, issued: t.now() }, Ht = await t.sign(I, f$(et));
        U = "Making links…", t.changed();
        const Ot = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: et, signature: Ht }) });
        L = { codes: Ot.codes, amount: Ot.amount };
      } catch (et) {
        b = et.message || "Not made.";
      } finally {
        U = "", t.changed();
      }
    }
  }
  const k = (I, M) => a$(I || location.origin + "/radio.html", M), O = (I) => d$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: I }), z = bt("input");
  z.type = "range", z.min = String(s$), z.max = String(i$), z.step = "50000", z.value = String(H), z.setAttribute("aria-label", "Gift amount");
  const J = bt("p", "", "ppp-gift-amount"), W = bs("", () => {
    const I = t.main();
    I && K(I);
  }, "primary"), ne = () => {
    J.textContent = Nt(), W.textContent = `Gift ${ms(H)} STX`;
  };
  z.oninput = () => {
    H = BigInt(z.value), ne();
  };
  const Nt = () => `${ms(H)} STX · about ${Qd(H).toLocaleString()} paid plays · you pay ${ms(H + o$)} STX with the network fee`;
  ne();
  const kt = bt("input");
  kt.type = "number", kt.min = "1", kt.max = String(c$), kt.value = "10", kt.setAttribute("aria-label", "How many links");
  const S = bt("input");
  S.type = "number", S.min = "0.1", S.max = "1", S.step = "0.05", S.value = "0.1", S.setAttribute("aria-label", "STX per link");
  const T = bt("input");
  T.maxLength = 40, T.placeholder = "Label, e.g. Launch week", T.setAttribute("aria-label", "Campaign label");
  function ot(I) {
    var et, Ht, Ot, Fe, je;
    const M = (et = I.gate) == null ? void 0 : et.gifts;
    if (!(M != null && M.enabled) || ["off", "elsewhere", "unsupported"].includes(I.step)) return null;
    const D = t.main(), tt = [bt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!D)
      tt.push(bt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      W.disabled = !!U, tt.push(z, J, W), t.now() - q > 3e4 && (q = t.now(), F(D));
      const Bt = A(D);
      if (Bt.length) {
        const ae = bt("ul", "", "ppp-gift-list");
        for (const It of Bt.slice(0, 10)) {
          const Jt = (Ht = It.view) == null ? void 0 : Ht.status, te = It.error ? It.error : !Jt || Jt === "pending-deposit" ? It.txid ? "payment confirming…" : "waiting for your payment" : Jt === "live" ? "ready to share" : Jt === "claiming" || Jt === "claimed" ? "claimed ✓" : Jt === "refunding" ? "expired · refund on its way" : Jt === "refunded" ? "expired · refunded to you" : Jt, Xt = bt("li");
          if (Xt.append(bt("span", `${ms(BigInt(It.amount))} STX`, "t"), bt("span", te, ((Ot = It.view) == null ? void 0 : Ot.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Fe = It.view) == null ? void 0 : Fe.status) === "live") {
            const u = k(((je = I.gate) == null ? void 0 : je.radioUrl) ?? null, It.code);
            Xt.append(Wo("gift-copy:" + It.id, "Copy link", () => u, "tiny", t.changed), _g("gift-share:" + It.id, "Share", () => O(u), "tiny", t.changed));
          }
          ae.append(Xt);
        }
        tt.push(ae);
      }
      if (M.admin) {
        const ae = bs("Sign and make links", () => {
          const te = BigInt(Math.round(Number(S.value) * 1e6));
          m(D, Number(kt.value), te, T.value.trim());
        }), It = bt("div", "", "ppp-gift-admin"), Jt = (te, Xt) => {
          const u = bt("label", te);
          return u.append(Xt), u;
        };
        if (It.append(bt("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"), Jt("Links ", kt), Jt("STX each ", S), T, ae), L) {
          const te = L.codes.map((u) => {
            var v;
            return k(((v = I.gate) == null ? void 0 : v.radioUrl) ?? null, u);
          }).join(`
`), Xt = bt("textarea");
          Xt.readOnly = !0, Xt.value = te, Xt.rows = Math.min(8, L.codes.length), It.append(bt("p", `${L.codes.length} links, ${ms(BigInt(L.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), Xt, Wo("campaign-copy", "Copy all", () => te, "tiny", t.changed));
        }
        tt.push(It);
      }
    }
    return U && tt.push(bt("p", U, "ppp-cyan")), b && tt.push(bt("p", b, /✓/.test(b) ? "ppp-ok" : "ppp-warn")), $.replaceChildren(...tt), $;
  }
  return { banner: y, funder: w, renderFold: ot, liveGift: i, setAside: o };
}
const nh = document.getElementById("ppp");
nh && p$(nh);
function p$(t) {
  var Xt;
  const e = Ky(), n = (u) => t.querySelector(u), r = n(".ppp-frame");
  let s = null;
  const i = async (u, v) => {
    const C = await fetch(u, { cache: "no-store", ...v, signal: AbortSignal.timeout(15e3) }), R = await C.json().catch(() => ({}));
    if (!C.ok) throw new Error((R == null ? void 0 : R.error) || `Request failed (${C.status}).`);
    return R;
  }, o = p5({
    now: Date.now,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    config: (u) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(u || "")),
    links: async (u) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(u))).links ?? [],
    mainOf: async (u) => {
      var C;
      const v = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(u))).links;
      return ((C = v == null ? void 0 : v.find((R) => R.listening === u)) == null ? void 0 : C.main) ?? null;
    },
    saveLink: async (u) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(u) });
    },
    bridge: async (u) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${u}; publickey-credentials-create ${u}`), s.referrerPolicy = "no-referrer";
      const v = new Promise((Lt, ce) => {
        s.addEventListener("load", () => Lt(), { once: !0 }), setTimeout(() => ce(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = u + "/", r.replaceChildren(s), await v;
      const C = new Hy({ walletOrigin: u, frame: s, timeoutMs: 30 * 6e4 }), R = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), gt = (Lt, ce) => R.has(Lt) ? C.request(Lt, ce) : Promise.race([
        C.request(Lt, ce),
        new Promise((Pt, we) => setTimeout(() => we(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await gt("listening.status"), { request: gt };
    },
    chain: {
      verify: n5,
      balance: s5,
      account: r5,
      owner: i5,
      broadcast: o5,
      transaction: a5,
      confirmedNonce: async (u) => {
        const v = await Qr(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(v == null ? void 0 : v.nonce) || v.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(v.nonce);
      }
    },
    signWithMain: (u, v) => Fd({ ...v, network: "mainnet", stxAddress: u }),
    deposit: (u, v, C) => new Promise((R, gt) => Nd({
      recipient: v,
      amount: C.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new ec(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (Lt) => R(Lt.txId || ""),
      onCancel: () => gt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: gt
    })),
    validate: c5,
    tabLock: (u) => new Promise((v) => {
      const C = navigator.locks;
      if (!(C != null && C.request)) {
        v(!0);
        return;
      }
      C.request("xtrata-ppp:" + u, { ifAvailable: !0 }, async (R) => {
        v(!!R), R && await new Promise(() => {
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
      set: (u, v) => {
        try {
          localStorage.setItem(u, v);
        } catch {
        }
      }
    },
    changed: () => It(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var v, C;
      return a.funder(u, () => S5(u, Qr), !!((C = (v = o.snapshot().gate) == null ? void 0 : v.gifts) != null && C.enabled));
    },
    likesChanged: () => {
      var u, v;
      (v = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || v.call(u);
    },
    likeState: async (u, v) => {
      const C = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: u, ids: String(v) })), R = Array.isArray(C == null ? void 0 : C.rows) ? C.rows.find((gt) => (gt == null ? void 0 : gt.id) === v) : null;
      if (!R || typeof R.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: R.liked, by: Array.isArray(R.by) ? R.by.filter((gt) => typeof gt == "string") : R.liked ? [u] : [] };
    },
    likeSent: (u, v) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: u, liked: v } })),
    nameOf: (u) => A(u) ?? void 0,
    likeConfirmed: (u, v) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: u, liked: v } })),
    likeFailed: (u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: u } }))
  }), a = h$({
    json: i,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, v, C, R) => new Promise((gt, Lt) => Nd({
      recipient: v,
      amount: C.toString(),
      memo: R,
      stxAddress: u,
      network: new ec(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (ce) => gt(ce.txId || ""),
      onCancel: () => Lt(new Error("Gift cancelled. Nothing was sent.")),
      onError: Lt
    })),
    sign: (u, v) => Fd({ ...v, network: "mainnet", stxAddress: u }),
    giftSent: (u, v) => o.giftSent(u, v),
    who: (u) => N(u),
    changed: () => It(o.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, v) => {
        try {
          v === null ? localStorage.removeItem(u) : localStorage.setItem(u, v);
        } catch {
        }
      }
    },
    now: Date.now
  });
  window.XtrataRadioLikeHandler = (u) => {
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    k();
    const v = O(u.song, { title: u.title, artist: u.artist });
    return o.heart({ song: u.song, title: v.title || void 0, artist: v.artist || void 0, likedBy: Array.isArray(u.likedBy) ? u.likedBy : void 0 });
  };
  let c;
  window.XtrataRadioListeningIdentity = () => {
    const u = o.snapshot();
    return u.solo && u.step !== "off" && u.step !== "elsewhere" ? u.listening : void 0;
  };
  const f = (u) => {
    var C, R;
    const v = window.XtrataRadioListeningIdentity();
    v !== c && (c = v, (R = (C = window.XtrataRadio) == null ? void 0 : C.refreshLikes) == null || R.call(C));
  }, d = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", l = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), g = (u) => {
    const v = Math.round((Date.now() - u) / 6e4);
    return v < 1 ? "now" : v < 60 ? `${v}m` : v < 1440 ? `${Math.round(v / 60)}h` : `${Math.round(v / 1440)}d`;
  }, h = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, y = (u, v = "", C = "") => {
    const R = document.createElement(u);
    return v && (R.textContent = v), C && (R.className = C), R;
  }, w = (u, v, C = "") => {
    const R = y("button", u, C);
    return R.type = "button", R.onclick = v, R;
  }, $ = (u, v) => {
    const C = y("a", u);
    return C.href = v, C.target = "_blank", C.rel = "noopener", C;
  };
  let H = null, U = location.hash === "#give";
  U && history.replaceState(null, "", location.pathname + location.search);
  let b = !1;
  const L = e$((u) => t$({ address: u, network: "mainnet" }), () => It(o.snapshot())), A = (u) => L.get(u), N = (u) => A(u) ?? d(u), q = (u) => u.slice(0, 2).map(N).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), F = /* @__PURE__ */ new Map();
  let K = !1;
  const m = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), k = () => {
    K || (K = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const v of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const C = Number(v == null ? void 0 : v.id);
        Number.isSafeInteger(C) && F.set(C, { title: typeof v.title == "string" ? v.title : void 0, artist: typeof v.artist == "string" ? v.artist : void 0 });
      }
      It(o.snapshot());
    }).catch(() => {
      K = !1;
    }));
  }, O = (u, v) => {
    const C = F.get(u), R = r$(u, [C == null ? void 0 : C.title, v == null ? void 0 : v.title].find((Lt) => !m(Lt)) || ""), gt = n$(u, (C == null ? void 0 : C.artist) || (v == null ? void 0 : v.artist) || "");
    return { title: R, artist: gt };
  }, z = (u) => {
    const { title: v, artist: C } = O(u.song, u);
    return v ? `“${v}”${C ? ` — ${C}` : ""}` : `Song #${u.song}${C ? ` — ${C}` : ""}`;
  }, J = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, W = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function ne(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["OVER 1 STX", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function Nt(u, v, C = "", R) {
    const gt = y("dt", u), Lt = y("dd", v, C);
    return R && Lt.append(" ", R), [gt, Lt];
  }
  const kt = document.getElementById("ppp-top"), S = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, T = () => {
    var v, C;
    const u = o.snapshot();
    if (u.step === "connect" || u.step === "wrong-wallet") {
      (v = document.getElementById("radio-wallet-connect")) == null || v.click();
      return;
    }
    if (u.step === "elsewhere" && ((C = u.gate) != null && C.radioUrl)) {
      location.href = u.gate.radioUrl;
      return;
    }
    u.step === "locked" && !u.armed && !u.busy && o.unlock(), u.step === "ready" && !u.payingOn && !u.busy && o.switchOn(), S();
  };
  kt && (kt.onclick = T);
  function ot(u) {
    if (!kt) return;
    const v = (R, gt, Lt) => {
      kt.hidden = !1, kt.className = "ppp-top" + (gt ? " is-" + gt : ""), kt.replaceChildren(y("span", "", "dot"), document.createTextNode(R)), kt.title = Lt;
    }, C = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        kt.hidden = !0;
        return;
      case "elsewhere":
        return v("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        kt.hidden = !0;
        return;
      case "intro":
        return v("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return v(`Connect ${N(u.linked)}`, "warn", `This device's listening wallet belongs to ${N(u.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return v(u.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return v("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return u.depositPending ? v("Funds on their way", "quiet", "Paying starts by itself when they land") : v(u.entries.some((R) => R.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return v("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return v("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return u.payingOn && C > 0 ? v(`On · ${C.toLocaleString()} plays left`, "on", "Paying artists as you listen") : v("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const I = document.getElementById("pppNudge"), M = document.getElementById("onair");
  (Xt = I == null ? void 0 : I.querySelector("button")) == null || Xt.addEventListener("click", () => T());
  const D = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, tt = {
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
  function et(u) {
    var Lt;
    if (u.step === "loading") return;
    const v = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, C = u.step === "ready" && u.payingOn && v > 0, R = C ? "" : D[u.step] ?? "", gt = C ? "on" : R ? "off" : "";
    if (gt ? document.documentElement.dataset.ppp = gt : delete document.documentElement.dataset.ppp, M && (M.hidden = !gt, M.querySelector(".onair-sub").textContent = C ? `Paying artists · ${v.toLocaleString()} plays left` : "Not paying"), I && (I.hidden = gt !== "off" || u.step === "fund" && u.depositPending, gt === "off")) {
      const ce = Math.floor(Number(1000000n / Vs(BigInt(((Lt = u.gate) == null ? void 0 : Lt.limits.playFee) ?? "300"))));
      I.querySelector(".nudge-t").textContent = "⚠ " + R, I.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${ce.toLocaleString()} plays, on-chain, straight to the artists.`, I.querySelector("button").textContent = tt[u.step] ?? "Start paying";
    }
  }
  let Ht = "";
  function Ot(u) {
    const v = y("div", "", "ppp-pick");
    u.funderMultiple && u.returnToKind === "funder" && v.append(y("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), u.returnToKind === "funder" && v.append(y("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const C = y("input");
    C.type = "text", C.placeholder = "SP… address to send returns to", C.autocomplete = "off", C.spellcheck = !1, C.setAttribute("aria-label", "Address to return funds to"), C.value = Ht, C.oninput = () => {
      Ht = C.value;
    };
    const R = w(u.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(C.value), Ht = "";
    }, "tiny");
    return v.append(C, " ", R), u.returnToKind === "chosen" && v.append(" ", w("Back to the funder", () => o.clearReturnAddress(), "tiny")), v;
  }
  const Fe = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function je() {
    const u = y("p", Fe + " ", "ppp-mute");
    return u.append($("Xverse", "https://www.xverse.app/download"), " · ", $("Leather", "https://leather.io/install-extension")), u;
  }
  let Bt = "";
  const ae = (u) => {
    const v = document.documentElement, C = u.solo && !u.main ? u.listening ? d(u.listening) : "new" : "", R = A5() ? "1" : "";
    `${C}|${R}` !== Bt && (Bt = `${C}|${R}`, C ? v.dataset.pppSolo = C : delete v.dataset.pppSolo, R ? v.dataset.pppWalletInstalled = R : delete v.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => It(o.snapshot()), u);
  function It(u) {
    var Sr, On, us, Dn;
    if (f(), ae(u), ot(u), et(u), t.hidden = u.step === "off", t.hidden) return;
    const [v, C] = ne(u), R = n(".ppp-state");
    R.textContent = v, R.className = "ppp-state" + (C ? " ppp-state--" + C : ""), R.hidden = !v;
    const gt = !!u.busy || u.armed, Lt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(u.step) && (gt || !["intro", "loading"].includes(u.step));
    r.hidden = !Lt, r.classList.toggle("ppp-frame--rest", !gt && !b);
    const ce = n(".ppp-frame-label");
    ce.hidden = !0;
    const Pt = g5(u) ?? H;
    H = Pt;
    const we = w5(u, Pt);
    n(".ppp-badge").hidden = !we;
    const ze = n(".ppp-steps"), wn = n(".ppp-stage");
    ze.hidden = wn.hidden = !we, Pt && we && (ze.replaceChildren(...ol(u.solo).map((X, rt) => {
      const be = y("li", "", rt < Pt.at ? "done" : rt === Pt.at ? Pt.blocked ? "now blocked" : "now" : "");
      return be.append(y("span", rt < Pt.at ? "✓" : String(rt + 1), "n"), X), rt === Pt.at && be.setAttribute("aria-current", "step"), be;
    })), wn.textContent = Pt.caption, wn.className = "ppp-stage " + (Pt.at >= ol(u.solo).length ? "ppp-ok" : Pt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Pn = n(".ppp-facts"), le = [];
    u.main && ((Sr = u.gate) != null && Sr.here) && !u.solo && le.push(...Nt("Your wallet", N(u.main), "ppp-addr-short"));
    const ls = () => {
      if (!u.listening) return;
      const X = Wo("copy-listening", "Copy", () => u.listening || "", "tiny", () => It(o.snapshot()));
      le.push(...Nt(u.linked ? "Listening wallet (technical)" : "Listening wallet", d(u.listening), "ppp-addr-short", X));
    };
    if (u.linked || ls(), u.listening && u.step !== "intro")
      if (u.linked)
        le.push(...Nt("Credited to", `${N(u.linked)} · plays, likes and returns`, u.linked === u.main || u.solo ? "ppp-ok" : "ppp-warn")), ls();
      else if (u.solo) {
        u.creditedTo && le.push(...Nt("Credited to", `${N(u.creditedTo)} · plays and likes`, "ppp-ok"));
        const X = u.returnTo ? `${N(u.returnTo)} · ${u.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : u.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        le.push(...Nt("Returns go to", u.returnTo && !A(u.returnTo) ? X.replace(d(u.returnTo), u.returnTo) : X, u.returnTo ? "ppp-addr-full" : "ppp-mute"));
      } else le.push(...Nt("Linked to", "not linked yet", "ppp-warn"));
    if (u.linkedListening.length && ((On = u.gate) != null && On.here)) {
      const X = u.linkedListening.map((rt) => d(rt) + (rt === u.listening ? " (this one)" : "")).join(", ");
      le.push(...Nt(u.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", X, "ppp-addr-short"));
    }
    if (u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step)) {
      const X = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      le.push(...Nt("Balance", `${Cn(u.balance)} STX · about ${u.playsLeft.toLocaleString()} plays`, X));
    }
    const bn = u.entries.find((X) => X.kind === "play");
    bn && k(), bn && le.push(...Nt("Last paid song", `${z(bn)} → ${N(bn.recipient)}`, J[bn.status] || "")), Pn.replaceChildren(...le), Pn.hidden = !le.length;
    const st = [], $t = [], Rt = [], $e = [], mn = Vs(BigInt(((us = u.gate) == null ? void 0 : us.limits.playFee) ?? "300")), xn = `Each song you listen to for 30 seconds sends ${Cn(rl)} STX to whoever holds it, plus a ${Cn(mn - rl)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Qe = !!u.busy;
    switch (u.step) {
      case "elsewhere": {
        if (st.push(y("p", "Pay artists as you listen.")), (Dn = u.gate) != null && Dn.radioUrl) {
          const rt = y("p");
          rt.append($("Open the pay-per-play radio →", u.gate.radioUrl)), st.push(rt);
        }
        $t.push(y("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (u.linked) {
          const rt = [u.linked, ...u.others];
          st.push(y("p", rt.length > 1 ? `This device has listening wallets for ${q(rt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${N(u.linked)}. Connect that wallet to keep paying artists.`)), $t.push(y("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          st.push(y("p", "Connect your wallet to pay artists as you listen.")), $t.push(y("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        st.push(y("p", `This device's listening wallet belongs to ${N(u.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), $t.push(y("p", `You are connected as ${N(u.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), $t.push(y("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Rt.push(w("Switch wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        }, "primary"));
        break;
      case "not-invited":
        st.push(y("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        st.push(y("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        st.push(y("p", `Pay artists ${Cn(mn)} STX a song as you listen.`)), $t.push(y("p", xn)), $t.push(y("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), $t.push(y("p", u.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !u.solo && u.main && u.others.length ? (st.push(y("p", `This device already has a listening wallet for ${q(u.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), $t.push(y("p", `Otherwise, set up a new listening wallet for ${N(u.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !u.solo && u.main && $t.push(y("p", `This is the listening wallet for ${N(u.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), u.solo && $t.push(y("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const X = a.liveGift();
        Rt.push(w(X ? "Claim my gift · no wallet needed" : u.solo ? "Turn on pay-per-play · no wallet needed" : u.others.length && u.main ? `Set up for ${N(u.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !X && !u.solo && u.main && u.others.length && Rt.push(w("Switch wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        })), !X && u.solo && Rt.push(w("I have a Stacks wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        })), Rt.push(w("I already have a listening wallet", () => void o.unlock(!0))), X && Rt.push(w("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        u.armed || (st.push(y("p", "Locked.", "ppp-mute")), Rt.push(w(u.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), $e.push(w("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        st.push(y("p", `Link to ${N(u.main)} · free`)), $t.push(y("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), $t.push(y("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Rt.push(w(u.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        st.push(y("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (u.depositPending || (u.entries.length ? st.push(y("p", "Out of funds · top up to keep paying", "ppp-bad")) : st.push(y("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / mn)).toLocaleString()} songs`))), u.entries.length && $t.push(y("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), u.payingOn && !u.entries.length && $t.push(y("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), u.solo ? ($t.push(y("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), $t.push(y("p", u.listening || "", "ppp-addr-full")), u.listening && !u.depositPending && Rt.push(Wo("copy-address", "Copy my address", () => u.listening || "", "primary", () => It(o.snapshot())))) : $t.push(y("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), u.depositPending && u.depositTxid) {
          const rt = y("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          rt.append($("View", h(u.depositTxid))), st.push(rt);
        } else u.allowance > 0n && !u.solo && Rt.push(w(`Deposit ${Cn(u.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        st.push(y("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), u.solo && !u.returnTo && (st.push(y("p", u.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), st.push(Ot(u))), (!u.solo || u.returnTo) && Rt.push(w("Return excess", () => void o.returnFunds("excess"), "primary"), w("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (u.payingOn && u.session && u.session.playsLeft > 0) {
          const rt = Math.min(u.session.playsLeft, u.playsLeft);
          st.push(y("p", `Paying as you listen · up to ${rt.toLocaleString()} plays left`, "ppp-ok")), $t.push(y("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Rt.push(w("Switch off", () => void o.switchOff()));
        } else
          st.push(y("p", "Paying is off. Music stays free.", "ppp-mute")), Rt.push(w("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        u.queued && st.push(y("p", u.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${u.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), u.balanceState === "low" && st.push(y("p", "Running low · top up", "ppp-warn")), u.depositPending ? st.push(y("p", "Top-up on its way…", "ppp-warn")) : u.allowance > 0n && u.balanceState !== "ok" && !u.solo && Rt.push(w(`Top up ${Cn(u.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (u.solo && u.walletCannotSolo && $t.push(y("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), u.solo && ["fund", "ready"].includes(u.step) && ((u.balance ?? 0n) > 0n && $t.push(Ot(u)), $t.push(je()), u.step === "ready" && u.entries.some((X) => X.kind === "play" && X.status === "confirmed"))) {
      const X = y("p", "New to Stacks? ", "ppp-mute");
      X.append($("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), st.push(X);
    }
    if (u.walletOutdated && $t.push(y("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), u.stuck && (st.push(y("p", u.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${u.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Rt.push(w("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(u.step) && u.returnTo && (u.balance ?? 0n) > 0n && $e.push(w(u.linked ? "Return all to my wallet" : `Return all to ${N(u.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(u.step) && $e.push(w("Lock", () => void o.lock(), "quiet")), Lt && !gt && $e.push(w(b ? "Hide listening wallet box" : "Show listening wallet box", () => {
      b = !b, It(o.snapshot());
    }, "quiet")), [...Rt, ...$e].forEach((X) => X.disabled = Qe), Qe && (Rt.length = 0), u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step) && !(u.step === "fund" && u.depositPending && u.balance === 0n)) {
      const X = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad", rt = st.at(0);
      u.step === "ready" && rt ? rt.append(y("span", ` · ${l(u.balance)} STX`, X)) : st.push(y("p", `Balance ${l(u.balance)} STX`, X));
    }
    st.unshift(...a.banner(u)), u.solo && u.creditedTo && u.listening && !["intro", "off", "elsewhere", "loading"].includes(u.step) && st.unshift(y("p", `This is ${N(u.creditedTo)}'s listening wallet. Plays and likes count for ${N(u.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...st);
    const _t = a.renderFold(u);
    if (n(".ppp-gifts").hidden = !_t, _t && !n(".ppp-gift-body").contains(_t) && n(".ppp-gift-body").replaceChildren(_t), _t && U) {
      U = !1;
      const X = n(".ppp-gifts");
      X.open = !0, requestAnimationFrame(() => X.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...$t), n(".ppp-actions").replaceChildren(...Rt), n(".ppp-actions2").replaceChildren(...$e);
    const Sn = u.busy || u.message || "";
    n(".ppp-msg").textContent = Sn && st.some((X) => (X.textContent ?? "").startsWith(Sn.replace(/[.✓\s]+$/, ""))) ? "" : Sn, n(".ppp-err").textContent = u.error;
    const xr = u.entries.filter((X) => X.kind === "play");
    n(".ppp-recent").hidden = !u.entries.length, n(".ppp-recent-list").replaceChildren(...xr.slice(0, 5).map((X) => {
      const rt = y("li"), be = X.status === "confirmed" ? "ok" : X.status === "failed" ? "bad" : "warn";
      return rt.append(y("span", "", "d " + be), y("span", z(X), "t"), y("span", g(X.created), "ppp-mute")), X.txid && rt.append($("tx", h(X.txid))), rt;
    })), n(".ppp-wallets").hidden = !(Pn.childElementCount || $e.length), n(".ppp-more").hidden = !$t.length;
    const ve = n(".ppp-history");
    ve.hidden = !u.entries.length, u.entries.length && k(), ve.replaceChildren(y("summary", `All activity (${u.entries.length})`), ...u.entries.slice(0, 20).map((X) => {
      const rt = y("div", "", "ppp-row"), be = X.kind === "play" ? [y("span", z(X), "ppp-song"), y("span", ` · ${Cn(BigInt(X.amount))} STX to ${N(X.recipient)}`, "ppp-mute")] : X.kind === "like" ? [y("span", `${X.liked ? "♥ Liked" : "Unliked"} ${z(X)}`, "ppp-song"), y("span", ` · for ${u.linked ? N(u.linked) : "this listening wallet"}`, "ppp-mute")] : [y("span", `Returned ${Cn(BigInt(X.amount))} STX`, "ppp-song"), y("span", ` to ${N(X.recipient)}`, "ppp-mute")];
      return rt.append(
        y("span", W[X.status] || X.status, "ppp-status " + (J[X.status] || "")),
        ...be,
        y("span", ` · ${new Date(X.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), X.txid && rt.append($("tx ↗", h(X.txid))), rt;
    }));
  }
  const Jt = /* @__PURE__ */ new Map(), te = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((v) => {
      const C = v == null ? void 0 : v.nowPlaying;
      C && Number.isSafeInteger(Number(C.tokenId)) && Jt.set(Number(C.tokenId), { title: C.title || void 0, artist: C.artist || void 0 });
    }), !0) : !1;
  };
  if (!te()) {
    const u = setInterval(() => {
      te() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const v = u.detail;
    if (v && Number.isSafeInteger(v.song) && typeof v.id == "string" && /^[0-9a-f]{32}$/.test(v.id)) {
      k();
      const C = O(v.song, Jt.get(v.song));
      o.onListened({ song: v.song, id: v.id, title: C.title || void 0, artist: C.artist || void 0 });
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
}, w$ = () => y$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, b$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, m$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Ug = class {
  constructor(t) {
    yE(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Hm(t), this.callback(ca(t));
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
    const t = w$(), e = b$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return it("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, it("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), it("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, it("div", { class: "flex flex-col space-y-[10px]" }, it("div", { class: "flex items-center" }, it("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), it("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, it("span", { class: "sr-only" }, "Close popup"), it("img", { src: g$ }))), r ? it("p", null, "Select the wallet you want to connect to.") : it("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && it("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && it("div", { class: "mt-6" }, it("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), it("ul", { class: "space-y-3" }, this.installedProviders.map((i) => it("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, it("div", { class: "aspect-square basis-9 overflow-hidden" }, it("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), it("div", { class: "flex-1" }, it("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && it("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), it("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && it("div", { class: "mt-6" }, r ? it("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : it("div", { class: "mb-5 flex justify-between" }, it("p", { class: "text-sm font-medium" }, "Recommended wallets"), it("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, it("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, it("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), it("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), it("p", null, "What is a wallet? ", it("span", { class: "align-text-bottom text-[9px]" }, "↗")))), it("ul", { class: "space-y-3" }, n.map((i) => it("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, it("div", { class: "aspect-square basis-9 overflow-hidden" }, it("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), it("div", { class: "flex-1" }, it("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && it("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && it("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return Z4(this);
  }
};
Ug.style = m$;
const x$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Ug
}, Symbol.toStringTag, { value: "Module" }));
