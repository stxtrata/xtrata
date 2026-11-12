var Rw = Object.defineProperty;
var zw = (t, e, n) => e in t ? Rw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Bo = (t, e, n) => zw(t, typeof e != "symbol" ? e + "" : e, n);
var En = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Z0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Uc(t) {
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
      typeof En < "u" && En || {}, r = {
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
      function s(k) {
        return k && DataView.prototype.isPrototypeOf(k);
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
        ], o = ArrayBuffer.isView || function(k) {
          return k && i.indexOf(Object.prototype.toString.call(k)) > -1;
        };
      function a(k) {
        if (typeof k != "string" && (k = String(k)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(k) || k === "")
          throw new TypeError('Invalid character in header field name: "' + k + '"');
        return k.toLowerCase();
      }
      function c(k) {
        return typeof k != "string" && (k = String(k)), k;
      }
      function u(k) {
        var B = {
          next: function() {
            var b = k.shift();
            return { done: b === void 0, value: b };
          }
        };
        return r.iterable && (B[Symbol.iterator] = function() {
          return B;
        }), B;
      }
      function d(k) {
        this.map = {}, k instanceof d ? k.forEach(function(B, b) {
          this.append(b, B);
        }, this) : Array.isArray(k) ? k.forEach(function(B) {
          if (B.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + B.length);
          this.append(B[0], B[1]);
        }, this) : k && Object.getOwnPropertyNames(k).forEach(function(B) {
          this.append(B, k[B]);
        }, this);
      }
      d.prototype.append = function(k, B) {
        k = a(k), B = c(B);
        var b = this.map[k];
        this.map[k] = b ? b + ", " + B : B;
      }, d.prototype.delete = function(k) {
        delete this.map[a(k)];
      }, d.prototype.get = function(k) {
        return k = a(k), this.has(k) ? this.map[k] : null;
      }, d.prototype.has = function(k) {
        return this.map.hasOwnProperty(a(k));
      }, d.prototype.set = function(k, B) {
        this.map[a(k)] = c(B);
      }, d.prototype.forEach = function(k, B) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && k.call(B, this.map[b], b, this);
      }, d.prototype.keys = function() {
        var k = [];
        return this.forEach(function(B, b) {
          k.push(b);
        }), u(k);
      }, d.prototype.values = function() {
        var k = [];
        return this.forEach(function(B) {
          k.push(B);
        }), u(k);
      }, d.prototype.entries = function() {
        var k = [];
        return this.forEach(function(B, b) {
          k.push([b, B]);
        }), u(k);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(k) {
        if (!k._noBody) {
          if (k.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          k.bodyUsed = !0;
        }
      }
      function g(k) {
        return new Promise(function(B, b) {
          k.onload = function() {
            B(k.result);
          }, k.onerror = function() {
            b(k.error);
          };
        });
      }
      function p(k) {
        var B = new FileReader(), b = g(B);
        return B.readAsArrayBuffer(k), b;
      }
      function x(k) {
        var B = new FileReader(), b = g(B), C = /charset=([A-Za-z0-9_-]+)/.exec(k.type), z = C ? C[1] : "utf-8";
        return B.readAsText(k, z), b;
      }
      function E(k) {
        for (var B = new Uint8Array(k), b = new Array(B.length), C = 0; C < B.length; C++)
          b[C] = String.fromCharCode(B[C]);
        return b.join("");
      }
      function L(k) {
        if (k.slice)
          return k.slice(0);
        var B = new Uint8Array(k.byteLength);
        return B.set(new Uint8Array(k)), B.buffer;
      }
      function U() {
        return this.bodyUsed = !1, this._initBody = function(k) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = k, k ? typeof k == "string" ? this._bodyText = k : r.blob && Blob.prototype.isPrototypeOf(k) ? this._bodyBlob = k : r.formData && FormData.prototype.isPrototypeOf(k) ? this._bodyFormData = k : r.searchParams && URLSearchParams.prototype.isPrototypeOf(k) ? this._bodyText = k.toString() : r.arrayBuffer && r.blob && s(k) ? (this._bodyArrayBuffer = L(k.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(k) || o(k)) ? this._bodyArrayBuffer = L(k) : this._bodyText = k = Object.prototype.toString.call(k) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof k == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(k) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var k = l(this);
          if (k)
            return k;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var k = l(this);
            return k || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var k = l(this);
          if (k)
            return k;
          if (this._bodyBlob)
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(E(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(P);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var D = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function v(k) {
        var B = k.toUpperCase();
        return D.indexOf(B) > -1 ? B : k;
      }
      function H(k, B) {
        if (!(this instanceof H))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        B = B || {};
        var b = B.body;
        if (k instanceof H) {
          if (k.bodyUsed)
            throw new TypeError("Already read");
          this.url = k.url, this.credentials = k.credentials, B.headers || (this.headers = new d(k.headers)), this.method = k.method, this.mode = k.mode, this.signal = k.signal, !b && k._bodyInit != null && (b = k._bodyInit, k.bodyUsed = !0);
        } else
          this.url = String(k);
        if (this.credentials = B.credentials || this.credentials || "same-origin", (B.headers || !this.headers) && (this.headers = new d(B.headers)), this.method = v(B.method || this.method || "GET"), this.mode = B.mode || this.mode || null, this.signal = B.signal || this.signal || function() {
          if ("AbortController" in n) {
            var T = new AbortController();
            return T.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && b)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(b), (this.method === "GET" || this.method === "HEAD") && (B.cache === "no-store" || B.cache === "no-cache")) {
          var C = /([?&])_=[^&]*/;
          if (C.test(this.url))
            this.url = this.url.replace(C, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var z = /\?/;
            this.url += (z.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      H.prototype.clone = function() {
        return new H(this, { body: this._bodyInit });
      };
      function P(k) {
        var B = new FormData();
        return k.trim().split("&").forEach(function(b) {
          if (b) {
            var C = b.split("="), z = C.shift().replace(/\+/g, " "), T = C.join("=").replace(/\+/g, " ");
            B.append(decodeURIComponent(z), decodeURIComponent(T));
          }
        }), B;
      }
      function tt(k) {
        var B = new d(), b = k.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(C) {
          return C.indexOf(`
`) === 0 ? C.substr(1, C.length) : C;
        }).forEach(function(C) {
          var z = C.split(":"), T = z.shift().trim();
          if (T) {
            var st = z.join(":").trim();
            try {
              B.append(T, st);
            } catch (W) {
              console.warn("Response " + W.message);
            }
          }
        }), B;
      }
      U.call(H.prototype);
      function it(k, B) {
        if (!(this instanceof it))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (B || (B = {}), this.type = "default", this.status = B.status === void 0 ? 200 : B.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = B.statusText === void 0 ? "" : "" + B.statusText, this.headers = new d(B.headers), this.url = B.url || "", this._initBody(k);
      }
      U.call(it.prototype), it.prototype.clone = function() {
        return new it(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, it.error = function() {
        var k = new it(null, { status: 200, statusText: "" });
        return k.ok = !1, k.status = 0, k.type = "error", k;
      };
      var et = [301, 302, 303, 307, 308];
      it.redirect = function(k, B) {
        if (et.indexOf(B) === -1)
          throw new RangeError("Invalid status code");
        return new it(null, { status: B, headers: { location: k } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(B, b) {
          this.message = B, this.name = b;
          var C = Error(B);
          this.stack = C.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function X(k, B) {
        return new Promise(function(b, C) {
          var z = new H(k, B);
          if (z.signal && z.signal.aborted)
            return C(new e.DOMException("Aborted", "AbortError"));
          var T = new XMLHttpRequest();
          function st() {
            T.abort();
          }
          T.onload = function() {
            var I = {
              statusText: T.statusText,
              headers: tt(T.getAllResponseHeaders() || "")
            };
            z.url.indexOf("file://") === 0 && (T.status < 200 || T.status > 599) ? I.status = 200 : I.status = T.status, I.url = "responseURL" in T ? T.responseURL : I.headers.get("X-Request-URL");
            var O = "response" in T ? T.response : T.responseText;
            setTimeout(function() {
              b(new it(O, I));
            }, 0);
          }, T.onerror = function() {
            setTimeout(function() {
              C(new TypeError("Network request failed"));
            }, 0);
          }, T.ontimeout = function() {
            setTimeout(function() {
              C(new TypeError("Network request timed out"));
            }, 0);
          }, T.onabort = function() {
            setTimeout(function() {
              C(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function W(I) {
            try {
              return I === "" && n.location.href ? n.location.href : I;
            } catch {
              return I;
            }
          }
          if (T.open(z.method, W(z.url), !0), z.credentials === "include" ? T.withCredentials = !0 : z.credentials === "omit" && (T.withCredentials = !1), "responseType" in T && (r.blob ? T.responseType = "blob" : r.arrayBuffer && (T.responseType = "arraybuffer")), B && typeof B.headers == "object" && !(B.headers instanceof d || n.Headers && B.headers instanceof n.Headers)) {
            var vt = [];
            Object.getOwnPropertyNames(B.headers).forEach(function(I) {
              vt.push(a(I)), T.setRequestHeader(I, c(B.headers[I]));
            }), z.headers.forEach(function(I, O) {
              vt.indexOf(O) === -1 && T.setRequestHeader(O, I);
            });
          } else
            z.headers.forEach(function(I, O) {
              T.setRequestHeader(O, I);
            });
          z.signal && (z.signal.addEventListener("abort", st), T.onreadystatechange = function() {
            T.readyState === 4 && z.signal.removeEventListener("abort", st);
          }), T.send(typeof z._bodyInit > "u" ? null : z._bodyInit);
        });
      }
      return X.polyfill = !0, n.fetch || (n.fetch = X, n.Headers = d, n.Request = H, n.Response = it), e.Headers = d, e.Request = H, e.Response = it, e.fetch = X, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : En);
})();
const Gw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Kw(t, e) {
  const n = {};
  return Object.assign(n, Gw, e), await fetch(t, n);
}
function Vw(t) {
  let e = Kw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Yw(...t) {
  const { fetchLib: e, middlewares: n } = Vw(t);
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
var Xi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Xi || (Xi = {}));
var Zs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Zs || (Zs = {}));
var gd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(gd || (gd = {}));
const qw = "https://api.mainnet.hiro.so", Xw = "https://api.testnet.hiro.so", Ww = "http://localhost:3999", Zw = ["mainnet", "testnet", "devnet", "mocknet"];
let Wi = class {
  constructor(e) {
    this.version = Zs.Mainnet, this.chainId = Xi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Zs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Yw();
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
Wi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Yl();
    case "testnet":
      return new Qw();
    case "devnet":
      return new Jw();
    case "mocknet":
      return new Q0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Zw.join(", ")}`);
  }
};
Wi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Wi.fromName(t);
let Yl = class extends Wi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? qw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Zs.Mainnet, this.chainId = Xi.Mainnet;
  }
}, Qw = class extends Wi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Xw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Zs.Testnet, this.chainId = Xi.Testnet;
  }
}, Q0 = class extends Wi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ww,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Zs.Testnet, this.chainId = Xi.Testnet;
  }
};
const Jw = Q0, J0 = "xtrata.wallet.bridge.v1", tb = (t) => typeof t == "object" && t !== null && t.protocol === J0, eb = (t) => tb(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", nb = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Mo extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const yd = 12e4;
class rb {
  constructor(e) {
    Bo(this, "pending", /* @__PURE__ */ new Map());
    Bo(this, "listenTarget");
    Bo(this, "closed", !1);
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
    Bo(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !eb(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Mo("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Mo("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Mo("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = nb(), i = { protocol: J0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Mo(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? yd}ms.`
          )
        );
      }, this.options.timeoutMs ?? yd);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Mo("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const sb = ["SP", "SM"], ib = ["ST", "SN"], ob = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return sb.includes(n) ? "mainnet" : ib.includes(n) ? "testnet" : null;
}, ab = () => {
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
}, cb = () => typeof window > "u" || !window.localStorage ? ab() : window.localStorage, hl = "xtrata.v15.1.wallet.session", wd = "mainnet", ic = { isConnected: !1 }, lb = (t) => t.address ? ob(t.address) ?? t.network : t.network, tp = (t) => !t.isConnected || !t.address ? { ...ic } : lb(t) !== wd ? { ...ic } : {
  isConnected: !0,
  address: t.address,
  network: wd,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, ub = (t) => {
  if (!t)
    return { ...ic };
  try {
    const e = JSON.parse(t);
    return tp(e);
  } catch {
    return { ...ic };
  }
}, fb = (t) => {
  const e = tp(t);
  return JSON.stringify(e);
}, db = (t) => {
  const e = cb();
  return {
    load: () => ub(e.getItem(hl)),
    save: (n) => {
      e.setItem(hl, fb(n));
    },
    clear: () => {
      e.removeItem(hl);
    }
  };
}, hb = "https://browser.blockstack.org/auth", pb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, ep = ["store_write"], gb = "blockstack-session", yb = {
  logLevel: "debug"
}, pi = {
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
Object.freeze(pi);
class po extends Error {
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
class wb extends po {
  constructor(e, n = "") {
    super({ code: pi.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class bd extends po {
  constructor(e = "") {
    super({ code: pi.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class wa extends po {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: pi.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class md extends po {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: pi.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class ql extends po {
  constructor(e) {
    super({ code: pi.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class np extends po {
  constructor(e) {
    super({ code: pi.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const xd = ["debug", "info", "warn", "error", "none"], Xl = {};
for (let t = 0; t < xd.length; t++) {
  const e = xd[t];
  Xl[e] = t;
}
class Ri {
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
    return Xl[yb.logLevel] <= Xl[e];
  }
}
function bb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function mb() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function pl(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function xb() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Sb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Eb(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function nf(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Sb(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Ri.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Eb(s, t.toString(), n);
    throw Ri.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Cs(t, e) {
  return rf(fn(t), e);
}
function fn(t) {
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
  if (Ln(t, Uint8Array))
    return BigInt(`0x${bt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Ab(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Sd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function oa(t, e = 8) {
  return (typeof t == "bigint" ? t : fn(t)).toString(16).padStart(e * 2, "0");
}
function Hc(t) {
  return parseInt(t, 16);
}
function rf(t, e = 16) {
  const n = oa(t, e);
  return Zt(n);
}
function vb(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function kb(t, e) {
  return t & BigInt(1) << e;
}
function Wl(t) {
  return $b(BigInt(`0x${bt(t)}`), BigInt(t.byteLength * 8));
}
function $b(t, e) {
  return kb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Ib = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Ib[n];
  return e;
}
function Zt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Ab(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function gi(t) {
  return new TextEncoder().encode(t);
}
function aa(t) {
  return new TextDecoder().decode(t);
}
function Lb(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Cb(t) {
  return String.fromCharCode.apply(null, t);
}
function Tb(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ed(t) {
  if (t.some(Tb))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function vr(...t) {
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
function Pe(t) {
  return vr(...t.map((e) => typeof e == "number" ? Ed([e]) : e instanceof Array ? Ed(e) : e));
}
function Ln(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const rp = "https://api.mainnet.hiro.so", sp = "https://api.testnet.hiro.so", ip = "http://localhost:3999", Bb = "https://hub.blockstack.org", Mb = 33, gl = 32;
function Pb(t) {
  if (t.length < gl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + gl * 2), r = t.slice(2 + gl * 2);
  return {
    recoveryId: Hc(e),
    r: n,
    s: r
  };
}
function sf(t) {
  const e = typeof t == "string" ? Zt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Nb(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function _b(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Ub(t, e) {
  return t[e];
}
function Hb(t, e, n = 0) {
  return t[n] = e, t;
}
function Ob(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Qs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Db = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Fb(t, e) {
  const n = {};
  return Object.assign(n, Db, e), await fetch(t, n);
}
function jb(t) {
  let e = Fb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Rb(...t) {
  const { fetchLib: e, middlewares: n } = jb(t);
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
class op {
  constructor(e = ep.slice(), n = ((a) => (a = nf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = hb) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Zl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function zb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ap(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Gb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zl(t.outputLen), Zl(t.blockLen);
}
function Kb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Vb(t, e) {
  ap(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const js = {
  number: Zl,
  bool: zb,
  bytes: ap,
  hash: Gb,
  exists: Kb,
  output: Vb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const yl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), fr = (t, e) => t << 32 - e | t >>> e, Yb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Yb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function qb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function of(t) {
  if (typeof t == "string" && (t = qb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let cp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function yi(t) {
  const e = (r) => t().update(of(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let lp = class extends cp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, js.hash(e);
    const r = of(n);
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
    return js.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    js.exists(this), js.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Oc = (t, e, n) => new lp(t, e).update(n).digest();
Oc.create = (t, e) => new lp(t, e);
function Xb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let af = class extends cp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = yl(this.buffer);
  }
  update(e) {
    js.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = of(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = yl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    js.exists(this), js.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Xb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = yl(e), c = this.outputLen;
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
const Wb = (t, e, n) => t & e ^ ~t & n, Zb = (t, e, n) => t & e ^ t & n ^ e & n, Qb = new Uint32Array([
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
]), Xr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Wr = new Uint32Array(64);
let up = class extends af {
  constructor() {
    super(64, 32, 8, !1), this.A = Xr[0] | 0, this.B = Xr[1] | 0, this.C = Xr[2] | 0, this.D = Xr[3] | 0, this.E = Xr[4] | 0, this.F = Xr[5] | 0, this.G = Xr[6] | 0, this.H = Xr[7] | 0;
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
      Wr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Wr[l - 15], p = Wr[l - 2], x = fr(g, 7) ^ fr(g, 18) ^ g >>> 3, E = fr(p, 17) ^ fr(p, 19) ^ p >>> 10;
      Wr[l] = E + Wr[l - 7] + x + Wr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = fr(a, 6) ^ fr(a, 11) ^ fr(a, 25), p = d + g + Wb(a, c, u) + Qb[l] + Wr[l] | 0, E = (fr(r, 2) ^ fr(r, 13) ^ fr(r, 22)) + Zb(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Wr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Jb = class extends up {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Zi = yi(() => new up());
yi(() => new Jb());
const tm = {}, fp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: tm
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const qt = BigInt(0), be = BigInt(1), As = BigInt(2), Ro = BigInt(3), Ad = BigInt(8), ae = Object.freeze({
  a: qt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: be,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), vd = (t, e) => (t + e / As) / e, ba = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ae, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -be * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = vd(i * t, e), c = vd(-r * t, e);
    let u = nt(t - a * n - c * s, e), d = nt(-a * r - c * i, e);
    const l = u > o, g = d > o;
    if (l && (u = e - u), g && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: d };
  }
}, ar = 32, Js = 32, dp = 32, oc = ar + 1, ac = 2 * ar + 1;
function kd(t) {
  const { a: e, b: n } = ae, r = nt(t * t), s = nt(r * t);
  return nt(s + e * t + n);
}
const ma = ae.a === qt;
class cf extends Error {
  constructor(e) {
    super(e);
  }
}
function $d(t) {
  if (!(t instanceof ne))
    throw new TypeError("JacobianPoint expected");
}
class ne {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ot))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ot.ZERO) ? ne.ZERO : new ne(e.x, e.y, be);
  }
  static toAffineBatch(e) {
    const n = im(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return ne.toAffineBatch(e).map(ne.fromAffine);
  }
  equals(e) {
    $d(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = nt(s * s), u = nt(a * a), d = nt(n * u), l = nt(i * c), g = nt(nt(r * a) * u), p = nt(nt(o * s) * c);
    return d === l && g === p;
  }
  negate() {
    return new ne(this.x, nt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = nt(e * e), i = nt(n * n), o = nt(i * i), a = e + i, c = nt(As * (nt(a * a) - s - o)), u = nt(Ro * s), d = nt(u * u), l = nt(d - As * c), g = nt(u * (c - l) - Ad * o), p = nt(As * n * r);
    return new ne(l, g, p);
  }
  add(e) {
    $d(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === qt || o === qt)
      return this;
    if (n === qt || r === qt)
      return e;
    const c = nt(s * s), u = nt(a * a), d = nt(n * u), l = nt(i * c), g = nt(nt(r * a) * u), p = nt(nt(o * s) * c), x = nt(l - d), E = nt(p - g);
    if (x === qt)
      return E === qt ? this.double() : ne.ZERO;
    const L = nt(x * x), U = nt(x * L), D = nt(d * L), v = nt(E * E - U - As * D), H = nt(E * (D - v) - g * U), P = nt(s * a * x);
    return new ne(v, H, P);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = ne.ZERO;
    if (typeof e == "bigint" && e === qt)
      return n;
    let r = Cd(e);
    if (r === be)
      return this;
    if (!ma) {
      let l = n, g = this;
      for (; r > qt; )
        r & be && (l = l.add(g)), g = g.double(), r >>= be;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = ba.splitScalar(r), c = n, u = n, d = this;
    for (; i > qt || a > qt; )
      i & be && (c = c.add(d)), a & be && (u = u.add(d)), d = d.double(), i >>= be, a >>= be;
    return s && (c = c.negate()), o && (u = u.negate()), u = new ne(nt(u.x * ba.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = ma ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(ne.BASE) && (n = Ot.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ql.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ne.normalizeZ(s), Ql.set(n, s)));
    let i = ne.ZERO, o = ne.BASE;
    const a = 1 + (ma ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const p = g * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= d, e += be);
      const E = p, L = p + Math.abs(x) - 1, U = g % 2 !== 0, D = x < 0;
      x === 0 ? o = o.add(xa(U, s[E])) : i = i.add(xa(D, s[L]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Cd(e), s, i;
    if (ma) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = ba.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: p } = this.wNAF(u, n);
      d = xa(o, d), g = xa(c, g), g = new ne(nt(g.x * ba.beta), g.y, g.z), s = d.add(g), i = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ne.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(ne.ZERO);
    e == null && (e = i ? Ad : go(s));
    const o = e, a = nt(o * o), c = nt(a * o), u = nt(n * a), d = nt(r * c), l = nt(s * o);
    if (i)
      return Ot.ZERO;
    if (l !== be)
      throw new Error("invZ was invalid");
    return new Ot(u, d);
  }
}
ne.BASE = new ne(ae.Gx, ae.Gy, be);
ne.ZERO = new ne(qt, be, qt);
function xa(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ql = /* @__PURE__ */ new WeakMap();
class Ot {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ql.delete(this);
  }
  hasEvenY() {
    return this.y % As === qt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Fn(n ? e : e.subarray(1));
    if (!Xa(r))
      throw new Error("Point is not on curve");
    const s = kd(r);
    let i = sm(s);
    const o = (i & be) === be;
    n ? o && (i = nt(-i)) : (e[0] & 1) === 1 !== o && (i = nt(-i));
    const a = new Ot(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Fn(e.subarray(1, ar + 1)), r = Fn(e.subarray(ar + 1, ar * 2 + 1)), s = new Ot(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = kr(e), r = n.length, s = n[0];
    if (r === ar)
      return this.fromCompressedHex(n);
    if (r === oc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ac && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${oc} compressed bytes or ${ac} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ot.BASE.multiply(ti(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = gp(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = lf(kr(e)), { n: a } = ae, c = r === 2 || r === 3 ? s + a : s, u = go(c, a), d = nt(-o * u, a), l = nt(i * u, a), g = r & 1 ? "03" : "02", p = Ot.fromHex(g + ks(c)), x = Ot.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return $s(this.toHex(e));
  }
  toHex(e = !1) {
    const n = ks(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${ks(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Xa(n) || !Xa(r))
      throw new Error(e);
    const s = nt(r * r), i = kd(n);
    if (nt(s - i) !== qt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ot(this.x, nt(-this.y));
  }
  double() {
    return ne.fromAffine(this).double().toAffine();
  }
  add(e) {
    return ne.fromAffine(this).add(ne.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return ne.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = ne.fromAffine(this), i = n === qt || n === be || this !== Ot.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ne.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ne.ZERO) ? void 0 : a.toAffine();
  }
}
Ot.BASE = new Ot(ae.Gx, ae.Gy);
Ot.ZERO = new Ot(qt, qt);
function Id(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Ld(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Qi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Fn(n), left: t.subarray(e + 2) };
}
function em(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Qi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Ld(t.subarray(2)), { data: r, left: s } = Ld(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Qi(s)}`);
  return { r: e, s: r };
}
class Dn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Qi(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Dn(cc(s.slice(0, 64)), cc(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = em(n ? e : $s(e));
    return new Dn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!to(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!to(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = ae.n >> be;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Dn(this.r, nt(-this.s, ae.n)) : this;
  }
  toDERRawBytes() {
    return $s(this.toDERHex());
  }
  toDERHex() {
    const e = Id(Po(this.s)), n = Id(Po(this.r)), r = e.length / 2, s = n.length / 2, i = Po(r), o = Po(s);
    return `30${Po(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return $s(this.toCompactHex());
  }
  toCompactHex() {
    return ks(this.r) + ks(this.s);
  }
}
function xs(...t) {
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
const nm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += nm[t[n]];
  return e;
}
const rm = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ks(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(qt <= t && t < rm))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ji(t) {
  const e = $s(ks(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Po(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function cc(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function $s(t) {
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
function Fn(t) {
  return cc(Qi(t));
}
function kr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : $s(t);
}
function Cd(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && to(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function nt(t, e = ae.P) {
  const n = t % e;
  return n >= qt ? n : e + n;
}
function Vn(t, e) {
  const { P: n } = ae;
  let r = t;
  for (; e-- > qt; )
    r *= r, r %= n;
  return r;
}
function sm(t) {
  const { P: e } = ae, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = Vn(u, Ro) * u % e, l = Vn(d, Ro) * u % e, g = Vn(l, As) * c % e, p = Vn(g, r) * g % e, x = Vn(p, s) * p % e, E = Vn(x, o) * x % e, L = Vn(E, a) * E % e, U = Vn(L, o) * x % e, D = Vn(U, Ro) * u % e, v = Vn(D, i) * p % e, H = Vn(v, n) * c % e, P = Vn(H, As);
  if (P * P % e !== t)
    throw new Error("Cannot find square root");
  return P;
}
function go(t, e = ae.P) {
  if (t === qt || e <= qt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = nt(t, e), r = e, s = qt, i = be;
  for (; n !== qt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== be)
    throw new Error("invert: does not exist");
  return nt(s, e);
}
function im(t, e = ae.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === qt ? i : (n[a] = i, nt(i * o, e)), be), s = go(r, e);
  return t.reduceRight((i, o, a) => o === qt ? i : (n[a] = nt(i * n[a], e), nt(i * o, e)), s), n;
}
function om(t) {
  const e = t.length * 8 - Js * 8, n = Fn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function lf(t, e = !1) {
  const n = om(t);
  if (e)
    return n;
  const { n: r } = ae;
  return n >= r ? n - r : n;
}
let Yi, zo;
class hp {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Le.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return zo(this.k, ...e);
  }
  checkSync() {
    if (typeof zo != "function")
      throw new cf("hmacSha256Sync needs to be set");
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
    return xs(...n);
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
    return xs(...n);
  }
}
function to(t) {
  return qt < t && t < ae.n;
}
function Xa(t) {
  return qt < t && t < ae.P;
}
function pp(t, e, n, r = !0) {
  const { n: s } = ae, i = lf(t, !0);
  if (!to(i))
    return;
  const o = go(i, s), a = Ot.BASE.multiply(i), c = nt(a.x, s);
  if (c === qt)
    return;
  const u = nt(o * nt(e + n * c, s), s);
  if (u === qt)
    return;
  let d = new Dn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & be);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function ti(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Js)
      throw new Error("Expected 32 bytes of private key");
    e = cc(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Js)
      throw new Error("Expected 32 bytes of private key");
    e = Fn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!to(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function uf(t) {
  return t instanceof Ot ? (t.assertValidity(), t) : Ot.fromHex(t);
}
function gp(t) {
  if (t instanceof Dn)
    return t.assertValidity(), t;
  try {
    return Dn.fromDER(t);
  } catch {
    return Dn.fromCompact(t);
  }
}
function ca(t, e = !1) {
  return Ot.fromPrivateKey(t).toRawBytes(e);
}
function am(t, e, n, r = !1) {
  return Ot.fromSignature(t, e, n).toRawBytes(r);
}
function Td(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === oc || r === ac : n ? r === oc * 2 || r === ac * 2 : t instanceof Ot;
}
function ff(t, e, n = !1) {
  if (Td(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Td(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = uf(e);
  return r.assertValidity(), r.multiply(ti(t)).toRawBytes(n);
}
function yp(t) {
  const e = t.length > ar ? t.slice(0, ar) : t;
  return Fn(e);
}
function cm(t) {
  const e = yp(t), n = nt(e, ae.n);
  return wp(n < qt ? e : n);
}
function wp(t) {
  return Ji(t);
}
function bp(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = kr(t), s = ti(e), i = [wp(s), cm(r)];
  if (n != null) {
    n === !0 && (n = Le.randomBytes(ar));
    const c = kr(n);
    if (c.length !== ar)
      throw new Error(`sign: Expected ${ar} bytes of extra data`);
    i.push(c);
  }
  const o = xs(...i), a = yp(r);
  return { seed: o, m: a, d: s };
}
function mp(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function lm(t, e, n = {}) {
  const { seed: r, m: s, d: i } = bp(t, e, n.extraEntropy), o = new hp(dp, Js);
  await o.reseed(r);
  let a;
  for (; !(a = pp(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return mp(a, n);
}
function Dc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = bp(t, e, n.extraEntropy), o = new hp(dp, Js);
  o.reseedSync(r);
  let a;
  for (; !(a = pp(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return mp(a, n);
}
const um = { strict: !0 };
function fm(t, e, n, r = um) {
  let s;
  try {
    s = gp(t), e = kr(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = lf(e);
  let c;
  try {
    c = uf(n);
  } catch {
    return !1;
  }
  const { n: u } = ae, d = go(o, u), l = nt(a * d, u), g = nt(i * d, u), p = Ot.BASE.multiplyAndAddUnsafe(c, l, g);
  return p ? nt(p.x, u) === i : !1;
}
function lc(t) {
  return nt(Fn(t), ae.n);
}
class eo {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = kr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Fn(n.subarray(0, 32)), s = Fn(n.subarray(32, 64));
    return new eo(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Xa(e) || !to(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ks(this.r) + ks(this.s);
  }
  toRawBytes() {
    return $s(this.toHex());
  }
}
function dm(t) {
  return Ot.fromPrivateKey(t).toRawX();
}
class xp {
  constructor(e, n, r = Le.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = kr(e);
    const { x: s, scalar: i } = this.getScalar(ti(n));
    if (this.px = s, this.d = i, this.rand = kr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Ot.fromPrivateKey(e), r = n.hasEvenY() ? e : ae.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ji(e ^ Fn(n));
  }
  finalizeNonce(e) {
    const n = nt(Fn(e), ae.n);
    if (n === qt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new eo(e.x, nt(n + r * s, ae.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Le.taggedHash, o = this.initNonce(n, await i(ms.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(ms.nonce, o, r, e)), d = lc(await i(ms.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await Ap(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Le.taggedHashSync, o = this.initNonce(n, i(ms.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(ms.nonce, o, r, e)), d = lc(i(ms.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return vp(l, e, r) || this.error(), l;
  }
}
async function hm(t, e, n) {
  return new xp(t, e, n).calc();
}
function pm(t, e, n) {
  return new xp(t, e, n).calcSync();
}
function Sp(t, e, n) {
  const r = t instanceof eo, s = r ? t : eo.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: kr(e),
    P: uf(n)
  };
}
function Ep(t, e, n, r) {
  const s = Ot.BASE.multiplyAndAddUnsafe(e, ti(n), nt(-r, ae.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Ap(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Sp(t, e, n), a = lc(await Le.taggedHash(ms.challenge, Ji(r), o.toRawX(), i));
    return Ep(r, o, s, a);
  } catch {
    return !1;
  }
}
function vp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Sp(t, e, n), a = lc(Le.taggedHashSync(ms.challenge, Ji(r), o.toRawX(), i));
    return Ep(r, o, s, a);
  } catch (r) {
    if (r instanceof cf)
      throw r;
    return !1;
  }
}
const gm = {
  Signature: eo,
  getPublicKey: dm,
  sign: hm,
  verify: Ap,
  signSync: pm,
  verifySync: vp
};
Ot.BASE._setWindowSize(8);
const Nn = {
  node: fp,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ms = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Sa = {}, Le = {
  bytesToHex: Qi,
  hexToBytes: $s,
  concatBytes: xs,
  mod: nt,
  invert: go,
  isValidPrivateKey(t) {
    try {
      return ti(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ji,
  _normalizePrivateKey: ti,
  hashToPrivateKey: (t) => {
    t = kr(t);
    const e = Js + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = nt(Fn(t), ae.n - be) + be;
    return Ji(n);
  },
  randomBytes: (t = 32) => {
    if (Nn.web)
      return Nn.web.getRandomValues(new Uint8Array(t));
    if (Nn.node) {
      const { randomBytes: e } = Nn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Le.hashToPrivateKey(Le.randomBytes(Js + 8)),
  precompute(t = 8, e = Ot.BASE) {
    const n = e === Ot.BASE ? e : new Ot(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ro), n;
  },
  sha256: async (...t) => {
    if (Nn.web) {
      const e = await Nn.web.subtle.digest("SHA-256", xs(...t));
      return new Uint8Array(e);
    } else if (Nn.node) {
      const { createHash: e } = Nn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Nn.web) {
      const n = await Nn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = xs(...e), s = await Nn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Nn.node) {
      const { createHmac: n } = Nn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Sa[t];
    if (n === void 0) {
      const r = await Le.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = xs(r, r), Sa[t] = n;
    }
    return Le.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Yi != "function")
      throw new cf("sha256Sync is undefined, you need to set it");
    let n = Sa[t];
    if (n === void 0) {
      const r = Yi(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = xs(r, r), Sa[t] = n;
    }
    return Yi(n, ...e);
  },
  _JacobianPoint: ne
};
Object.defineProperties(Le, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Yi;
    },
    set(t) {
      Yi || (Yi = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return zo;
    },
    set(t) {
      zo || (zo = t);
    }
  }
});
const ym = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ae,
  Point: Ot,
  Signature: Dn,
  getPublicKey: ca,
  getSharedSecret: ff,
  recoverPublicKey: am,
  schnorr: gm,
  sign: lm,
  signSync: Dc,
  utils: Le,
  verify: fm
}, Symbol.toStringTag, { value: "Module" }));
var la = {};
la.byteLength = Sm;
var wm = la.toByteArray = Am, bm = la.fromByteArray = $m, wr = [], Xn = [], mm = typeof Uint8Array < "u" ? Uint8Array : Array, wl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ni = 0, xm = wl.length; Ni < xm; ++Ni)
  wr[Ni] = wl[Ni], Xn[wl.charCodeAt(Ni)] = Ni;
Xn[45] = 62;
Xn[95] = 63;
function kp(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Sm(t) {
  var e = kp(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Em(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Am(t) {
  var e, n = kp(t), r = n[0], s = n[1], i = new mm(Em(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Xn[t.charCodeAt(c)] << 18 | Xn[t.charCodeAt(c + 1)] << 12 | Xn[t.charCodeAt(c + 2)] << 6 | Xn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Xn[t.charCodeAt(c)] << 2 | Xn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Xn[t.charCodeAt(c)] << 10 | Xn[t.charCodeAt(c + 1)] << 4 | Xn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function vm(t) {
  return wr[t >> 18 & 63] + wr[t >> 12 & 63] + wr[t >> 6 & 63] + wr[t & 63];
}
function km(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(vm(r));
  return s.join("");
}
function $m(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(km(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    wr[e >> 2] + wr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    wr[e >> 10] + wr[e >> 4 & 63] + wr[e << 2 & 63] + "="
  )), s.join("");
}
function Im() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Lm = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Cm() {
  if (Im())
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
    throw new Error(Lm);
  }
}
class Tm {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(vr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(vr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Bm {
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
async function $p() {
  const t = await Cm();
  return t.name === "subtleCrypto" ? new Bm(t.lib) : new Tm(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Mm(t) {
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
  function d(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var x = 0, E = 0, L = 0, U = p.length; L !== U && p[L] === 0; )
      L++, x++;
    for (var D = (U - L) * u + 1 >>> 0, v = new Uint8Array(D); L !== U; ) {
      for (var H = p[L], P = 0, tt = D - 1; (H !== 0 || P < E) && tt !== -1; tt--, P++)
        H += 256 * v[tt] >>> 0, v[tt] = H % o >>> 0, H = H / o >>> 0;
      if (H !== 0)
        throw new Error("Non-zero carry");
      E = P, L++;
    }
    for (var it = D - E; it !== D && v[it] === 0; )
      it++;
    for (var et = a.repeat(x); it < D; ++it)
      et += t.charAt(v[it]);
    return et;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var x = 0, E = 0, L = 0; p[x] === a; )
      E++, x++;
    for (var U = (p.length - x) * c + 1 >>> 0, D = new Uint8Array(U); p[x]; ) {
      var v = p.charCodeAt(x);
      if (v > 255)
        return;
      var H = e[v];
      if (H === 255)
        return;
      for (var P = 0, tt = U - 1; (H !== 0 || P < L) && tt !== -1; tt--, P++)
        H += o * D[tt] >>> 0, D[tt] = H % 256 >>> 0, H = H / 256 >>> 0;
      if (H !== 0)
        throw new Error("Non-zero carry");
      L = P, x++;
    }
    for (var it = U - L; it !== U && D[it] === 0; )
      it++;
    for (var et = new Uint8Array(E + (U - it)), X = E; it !== U; )
      et[X++] = D[it++];
    return et;
  }
  function g(p) {
    var x = l(p);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var Ip = Mm;
const Pm = Ip, Nm = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var _m = Pm(Nm);
const Um = /* @__PURE__ */ Z0(_m), Hm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Lp = Uint8Array.from({ length: 16 }, (t, e) => e), Om = Lp.map((t) => (9 * t + 5) % 16);
let df = [Lp], hf = [Om];
for (let t = 0; t < 4; t++)
  for (let e of [df, hf])
    e.push(e[t].map((n) => Hm[n]));
const Cp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Dm = df.map((t, e) => t.map((n) => Cp[e][n])), Fm = hf.map((t, e) => t.map((n) => Cp[e][n])), jm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Rm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ea = (t, e) => t << e | t >>> 32 - e;
function Bd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Aa = new Uint32Array(16);
let zm = class extends af {
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
    for (let p = 0; p < 16; p++, n += 4)
      Aa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = jm[p], L = Rm[p], U = df[p], D = hf[p], v = Dm[p], H = Fm[p];
      for (let P = 0; P < 16; P++) {
        const tt = Ea(r + Bd(p, i, a, u) + Aa[U[P]] + E, v[P]) + l | 0;
        r = l, l = u, u = Ea(a, 10) | 0, a = i, i = tt;
      }
      for (let P = 0; P < 16; P++) {
        const tt = Ea(s + Bd(x, o, c, d) + Aa[D[P]] + L, H[P]) + g | 0;
        s = g, g = d, d = Ea(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Aa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Gm = yi(() => new zm());
function Km(t) {
  return Gm(t);
}
const va = BigInt(2 ** 32 - 1), Jl = BigInt(32);
function Tp(t, e = !1) {
  return e ? { h: Number(t & va), l: Number(t >> Jl & va) } : { h: Number(t >> Jl & va) | 0, l: Number(t & va) | 0 };
}
function Vm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Tp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Ym = (t, e) => BigInt(t >>> 0) << Jl | BigInt(e >>> 0), qm = (t, e, n) => t >>> n, Xm = (t, e, n) => t << 32 - n | e >>> n, Wm = (t, e, n) => t >>> n | e << 32 - n, Zm = (t, e, n) => t << 32 - n | e >>> n, Qm = (t, e, n) => t << 64 - n | e >>> n - 32, Jm = (t, e, n) => t >>> n - 32 | e << 64 - n, t1 = (t, e) => e, e1 = (t, e) => t, n1 = (t, e, n) => t << n | e >>> 32 - n, r1 = (t, e, n) => e << n | t >>> 32 - n, s1 = (t, e, n) => e << n - 32 | t >>> 64 - n, i1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function o1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const a1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), c1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, l1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), u1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, f1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), d1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: Tp,
  split: Vm,
  toBig: Ym,
  shrSH: qm,
  shrSL: Xm,
  rotrSH: Wm,
  rotrSL: Zm,
  rotrBH: Qm,
  rotrBL: Jm,
  rotr32H: t1,
  rotr32L: e1,
  rotlSH: n1,
  rotlSL: r1,
  rotlBH: s1,
  rotlBL: i1,
  add: o1,
  add3L: a1,
  add3H: c1,
  add4L: l1,
  add4H: u1,
  add5H: d1,
  add5L: f1
}, [h1, p1] = Bt.split([
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
].map((t) => BigInt(t))), Zr = new Uint32Array(80), Qr = new Uint32Array(80);
let Fc = class extends af {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: x, Hh: E, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Zr[v] = e.getUint32(n), Qr[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const H = Zr[v - 15] | 0, P = Qr[v - 15] | 0, tt = Bt.rotrSH(H, P, 1) ^ Bt.rotrSH(H, P, 8) ^ Bt.shrSH(H, P, 7), it = Bt.rotrSL(H, P, 1) ^ Bt.rotrSL(H, P, 8) ^ Bt.shrSL(H, P, 7), et = Zr[v - 2] | 0, X = Qr[v - 2] | 0, k = Bt.rotrSH(et, X, 19) ^ Bt.rotrBH(et, X, 61) ^ Bt.shrSH(et, X, 6), B = Bt.rotrSL(et, X, 19) ^ Bt.rotrBL(et, X, 61) ^ Bt.shrSL(et, X, 6), b = Bt.add4L(it, B, Qr[v - 7], Qr[v - 16]), C = Bt.add4H(b, tt, k, Zr[v - 7], Zr[v - 16]);
      Zr[v] = C | 0, Qr[v] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: x, Gh: E, Gl: L, Hh: U, Hl: D } = this;
    for (let v = 0; v < 80; v++) {
      const H = Bt.rotrSH(l, g, 14) ^ Bt.rotrSH(l, g, 18) ^ Bt.rotrBH(l, g, 41), P = Bt.rotrSL(l, g, 14) ^ Bt.rotrSL(l, g, 18) ^ Bt.rotrBL(l, g, 41), tt = l & p ^ ~l & E, it = g & x ^ ~g & L, et = Bt.add5L(D, P, it, p1[v], Qr[v]), X = Bt.add5H(et, U, H, tt, h1[v], Zr[v]), k = et | 0, B = Bt.rotrSH(r, s, 28) ^ Bt.rotrBH(r, s, 34) ^ Bt.rotrBH(r, s, 39), b = Bt.rotrSL(r, s, 28) ^ Bt.rotrBL(r, s, 34) ^ Bt.rotrBL(r, s, 39), C = r & i ^ r & a ^ i & a, z = s & o ^ s & c ^ o & c;
      U = E | 0, D = L | 0, E = p | 0, L = x | 0, p = l | 0, x = g | 0, { h: l, l: g } = Bt.add(u | 0, d | 0, X | 0, k | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Bt.add3L(k, b, z);
      r = Bt.add3H(T, X, B, C), s = T | 0;
    }
    ({ h: r, l: s } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Bt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: x } = Bt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: L } = Bt.add(this.Gh | 0, this.Gl | 0, E | 0, L | 0), { h: U, l: D } = Bt.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, d, l, g, p, x, E, L, U, D);
  }
  roundClean() {
    Zr.fill(0), Qr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, g1 = class extends Fc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, y1 = class extends Fc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, w1 = class extends Fc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const b1 = yi(() => new Fc());
yi(() => new g1());
yi(() => new y1());
yi(() => new w1());
function Bp(t) {
  return Zi(t);
}
function m1(t) {
  return b1(t);
}
const x1 = 0;
Le.hmacSha256Sync = (t, ...e) => {
  const n = Oc.create(Zi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function S1() {
  return bt(Le.randomPrivateKey());
}
function E1(t) {
  const e = Zi(Zi(t));
  return Um.encode(vr(t, e).slice(0, t.length + 4));
}
function A1(t, e) {
  return E1(vr(new Uint8Array([t]), e.slice(0, 20)));
}
function Mp(t, e = x1) {
  const n = typeof t == "string" ? Zt(t) : t, r = Km(Bp(n));
  return A1(e, r);
}
function Pp(t) {
  const e = sf(t);
  return bt(ca(e.slice(0, 32), !0));
}
Le.hmacSha256Sync = (t, ...e) => {
  const n = Oc.create(Zi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var uc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(uc || (uc = {}));
async function v1(t, e, n) {
  return await (await $p()).encrypt("aes-256-cbc", e, t, n);
}
async function k1(t, e, n) {
  return await (await $p()).decrypt("aes-256-cbc", e, t, n);
}
function Np(t, e) {
  return Oc(Zi, t, e);
}
function $1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function _p(t) {
  const e = m1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function I1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function L1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: uc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: uc.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !I1(t))
    return e;
  try {
    return Ot.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function C1(t, e, n, r) {
  const s = L1(t);
  if (!s.result)
    throw s;
  const i = Le.randomPrivateKey(), o = ca(i, !0);
  let a = ff(i, t, !0);
  a = a.slice(1);
  const c = _p(a), u = Le.randomBytes(16), d = await v1(u, c.encryptionKey, e), l = vr(u, o, d), g = Np(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = bt(d);
  else if (r === "base64")
    p = bm(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: bt(u),
    ephemeralPK: bt(o),
    cipherText: p,
    mac: bt(g),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function Up(t, e) {
  if (!e.ephemeralPK)
    throw new md("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = ff(t, n, !0);
  r = r.slice(1);
  const s = _p(r), i = Zt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Zt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = wm(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = vr(i, Zt(n), o), c = Np(s.hmacKey, a), u = Zt(e.mac);
  if (!$1(u, c))
    throw new md("Decryption failed: failure in MAC check");
  const d = await k1(i, s.encryptionKey, o);
  return e.wasString ? aa(d) : d;
}
function T1(t, e) {
  const n = typeof e == "string" ? gi(e) : e, r = Pp(t), s = Bp(n), i = Dc(s, t);
  return {
    signature: bt(i),
    publicKey: r
  };
}
async function B1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Pp(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? gi(t) : t, o = await C1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = T1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function M1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Up(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var sn = {}, no = {}, mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
mn.decode = mn.encode = mn.unescape = mn.escape = mn.pad = void 0;
const Hp = la;
function pf(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
mn.pad = pf;
function Op(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
mn.escape = Op;
function Dp(t) {
  return pf(t).replace(/-/g, "+").replace(/_/g, "/");
}
mn.unescape = Dp;
function P1(t) {
  return Op((0, Hp.fromByteArray)(new TextEncoder().encode(t)));
}
mn.encode = P1;
function N1(t) {
  return new TextDecoder().decode((0, Hp.toByteArray)(pf(Dp(t))));
}
mn.decode = N1;
var jc = {}, Rc = {}, Fp = {}, jp = {}, zc = {};
Object.defineProperty(zc, "__esModule", { value: !0 });
zc.crypto = void 0;
zc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = g, t.rotl = p, t.byteSwap = x, t.byteSwap32 = E, t.bytesToHex = D, t.hexToBytes = P, t.asyncLoop = it, t.utf8ToBytes = et, t.bytesToUtf8 = X, t.toBytes = k, t.kdfInputToBytes = B, t.concatBytes = b, t.checkOpts = C, t.createHasher = T, t.createOptHasher = st, t.createXOFer = W, t.randomBytes = vt;
  const e = zc;
  function n(I) {
    return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
  }
  function r(I) {
    if (!Number.isSafeInteger(I) || I < 0)
      throw new Error("positive integer expected, got " + I);
  }
  function s(I, ...O) {
    if (!n(I))
      throw new Error("Uint8Array expected");
    if (O.length > 0 && !O.includes(I.length))
      throw new Error("Uint8Array expected of length " + O + ", got length=" + I.length);
  }
  function i(I) {
    if (typeof I != "function" || typeof I.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(I.outputLen), r(I.blockLen);
  }
  function o(I, O = !0) {
    if (I.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (O && I.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(I, O) {
    s(I);
    const J = O.outputLen;
    if (I.length < J)
      throw new Error("digestInto() expects output buffer of length at least " + J);
  }
  function c(I) {
    return new Uint8Array(I.buffer, I.byteOffset, I.byteLength);
  }
  function u(I) {
    return new Uint32Array(I.buffer, I.byteOffset, Math.floor(I.byteLength / 4));
  }
  function d(...I) {
    for (let O = 0; O < I.length; O++)
      I[O].fill(0);
  }
  function l(I) {
    return new DataView(I.buffer, I.byteOffset, I.byteLength);
  }
  function g(I, O) {
    return I << 32 - O | I >>> O;
  }
  function p(I, O) {
    return I << O | I >>> 32 - O >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(I) {
    return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (I) => I : (I) => x(I), t.byteSwapIfBE = t.swap8IfBE;
  function E(I) {
    for (let O = 0; O < I.length; O++)
      I[O] = x(I[O]);
    return I;
  }
  t.swap32IfBE = t.isLE ? (I) => I : E;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, (I, O) => O.toString(16).padStart(2, "0"));
  function D(I) {
    if (s(I), L)
      return I.toHex();
    let O = "";
    for (let J = 0; J < I.length; J++)
      O += U[I[J]];
    return O;
  }
  const v = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function H(I) {
    if (I >= v._0 && I <= v._9)
      return I - v._0;
    if (I >= v.A && I <= v.F)
      return I - (v.A - 10);
    if (I >= v.a && I <= v.f)
      return I - (v.a - 10);
  }
  function P(I) {
    if (typeof I != "string")
      throw new Error("hex string expected, got " + typeof I);
    if (L)
      return Uint8Array.fromHex(I);
    const O = I.length, J = O / 2;
    if (O % 2)
      throw new Error("hex string expected, got unpadded hex of length " + O);
    const ot = new Uint8Array(J);
    for (let ct = 0, It = 0; ct < J; ct++, It += 2) {
      const ue = H(I.charCodeAt(It)), kt = H(I.charCodeAt(It + 1));
      if (ue === void 0 || kt === void 0) {
        const Xt = I[It] + I[It + 1];
        throw new Error('hex string expected, got non-hex character "' + Xt + '" at index ' + It);
      }
      ot[ct] = ue * 16 + kt;
    }
    return ot;
  }
  const tt = async () => {
  };
  t.nextTick = tt;
  async function it(I, O, J) {
    let ot = Date.now();
    for (let ct = 0; ct < I; ct++) {
      J(ct);
      const It = Date.now() - ot;
      It >= 0 && It < O || (await (0, t.nextTick)(), ot += It);
    }
  }
  function et(I) {
    if (typeof I != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(I));
  }
  function X(I) {
    return new TextDecoder().decode(I);
  }
  function k(I) {
    return typeof I == "string" && (I = et(I)), s(I), I;
  }
  function B(I) {
    return typeof I == "string" && (I = et(I)), s(I), I;
  }
  function b(...I) {
    let O = 0;
    for (let ot = 0; ot < I.length; ot++) {
      const ct = I[ot];
      s(ct), O += ct.length;
    }
    const J = new Uint8Array(O);
    for (let ot = 0, ct = 0; ot < I.length; ot++) {
      const It = I[ot];
      J.set(It, ct), ct += It.length;
    }
    return J;
  }
  function C(I, O) {
    if (O !== void 0 && {}.toString.call(O) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(I, O);
  }
  class z {
  }
  t.Hash = z;
  function T(I) {
    const O = (ot) => I().update(k(ot)).digest(), J = I();
    return O.outputLen = J.outputLen, O.blockLen = J.blockLen, O.create = () => I(), O;
  }
  function st(I) {
    const O = (ot, ct) => I(ct).update(k(ot)).digest(), J = I({});
    return O.outputLen = J.outputLen, O.blockLen = J.blockLen, O.create = (ot) => I(ot), O;
  }
  function W(I) {
    const O = (ot, ct) => I(ct).update(k(ot)).digest(), J = I({});
    return O.outputLen = J.outputLen, O.blockLen = J.blockLen, O.create = (ot) => I(ot), O;
  }
  t.wrapConstructor = T, t.wrapConstructorWithOpts = st, t.wrapXOFConstructorWithOpts = W;
  function vt(I = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(I));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(I));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(jp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = jp;
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
})(Fp);
const _i = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Rp(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function tu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function wi(t, ...e) {
  if (!Rp(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function _1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  tu(t.outputLen), tu(t.blockLen);
}
function eu(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function zp(t, e) {
  wi(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function U1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function H1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function fc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Wa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function er(t, e) {
  return t << 32 - e | t >>> e;
}
function O1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const gf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function yf(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Gp = gf ? (t) => t : (t) => yf(t), D1 = Gp;
function Kp(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = yf(t[e]);
  return t;
}
const F1 = gf ? (t) => t : Kp, Vp = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", j1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Yp(t) {
  if (wi(t), Vp)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += j1[t[n]];
  return e;
}
const Nr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Md(t) {
  if (t >= Nr._0 && t <= Nr._9)
    return t - Nr._0;
  if (t >= Nr.A && t <= Nr.F)
    return t - (Nr.A - 10);
  if (t >= Nr.a && t <= Nr.f)
    return t - (Nr.a - 10);
}
function R1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Vp)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Md(t.charCodeAt(i)), a = Md(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const qp = async () => {
};
async function z1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await qp(), r += i);
  }
}
function wf(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function G1(t) {
  return new TextDecoder().decode(t);
}
function ua(t) {
  return typeof t == "string" && (t = wf(t)), wi(t), t;
}
function K1(t) {
  return typeof t == "string" && (t = wf(t)), wi(t), t;
}
function V1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    wi(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Y1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Xp = class {
};
function Gc(t) {
  const e = (r) => t().update(ua(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Wp(t) {
  const e = (r, s) => t(s).update(ua(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Zp(t) {
  const e = (r, s) => t(s).update(ua(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const q1 = Gc, X1 = Wp, W1 = Zp;
function Z1(t = 32) {
  if (_i && typeof _i.getRandomValues == "function")
    return _i.getRandomValues(new Uint8Array(t));
  if (_i && typeof _i.randomBytes == "function")
    return Uint8Array.from(_i.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Q1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Xp,
  abytes: wi,
  aexists: eu,
  ahash: _1,
  anumber: tu,
  aoutput: zp,
  asyncLoop: z1,
  byteSwap: yf,
  byteSwap32: Kp,
  byteSwapIfBE: D1,
  bytesToHex: Yp,
  bytesToUtf8: G1,
  checkOpts: Y1,
  clean: fc,
  concatBytes: V1,
  createHasher: Gc,
  createOptHasher: Wp,
  createView: Wa,
  createXOFer: Zp,
  hexToBytes: R1,
  isBytes: Rp,
  isLE: gf,
  kdfInputToBytes: K1,
  nextTick: qp,
  randomBytes: Z1,
  rotl: O1,
  rotr: er,
  swap32IfBE: F1,
  swap8IfBE: Gp,
  toBytes: ua,
  u32: H1,
  u8: U1,
  utf8ToBytes: wf,
  wrapConstructor: q1,
  wrapConstructorWithOpts: X1,
  wrapXOFConstructorWithOpts: W1
}, Symbol.toStringTag, { value: "Module" }));
function J1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function t2(t, e, n) {
  return t & e ^ ~t & n;
}
function e2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class n2 extends Xp {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Wa(this.buffer);
  }
  update(e) {
    eu(this), e = ua(e), wi(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Wa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    eu(this), zp(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, fc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    J1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Wa(e), c = this.outputLen;
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
const Jr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ts = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), r2 = /* @__PURE__ */ Uint32Array.from([
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
]), es = /* @__PURE__ */ new Uint32Array(64);
let bf = class extends n2 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Jr[0] | 0, this.B = Jr[1] | 0, this.C = Jr[2] | 0, this.D = Jr[3] | 0, this.E = Jr[4] | 0, this.F = Jr[5] | 0, this.G = Jr[6] | 0, this.H = Jr[7] | 0;
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
      es[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = es[l - 15], p = es[l - 2], x = er(g, 7) ^ er(g, 18) ^ g >>> 3, E = er(p, 17) ^ er(p, 19) ^ p >>> 10;
      es[l] = E + es[l - 7] + x + es[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = er(a, 6) ^ er(a, 11) ^ er(a, 25), p = d + g + t2(a, c, u) + r2[l] + es[l] | 0, E = (er(r, 2) ^ er(r, 13) ^ er(r, 22)) + e2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    fc(es);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), fc(this.buffer);
  }
}, Qp = class extends bf {
  constructor() {
    super(28), this.A = ts[0] | 0, this.B = ts[1] | 0, this.C = ts[2] | 0, this.D = ts[3] | 0, this.E = ts[4] | 0, this.F = ts[5] | 0, this.G = ts[6] | 0, this.H = ts[7] | 0;
  }
};
const s2 = /* @__PURE__ */ Gc(() => new bf()), i2 = /* @__PURE__ */ Gc(() => new Qp()), o2 = bf, Jp = s2, a2 = Qp, c2 = i2, l2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: a2,
  SHA256: o2,
  sha224: c2,
  sha256: Jp
}, Symbol.toStringTag, { value: "Module" })), Kc = /* @__PURE__ */ Uc(l2), u2 = /* @__PURE__ */ Uc(ym);
var ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
ro.joseToDer = ro.derToJose = void 0;
const tg = la, eg = mn;
function bl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const f2 = {
  ES256: bl(256),
  ES384: bl(384),
  ES512: bl(521)
};
function ng(t) {
  const e = f2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const dc = 128, rg = 0, d2 = 32, h2 = 16, p2 = 2, sg = h2 | d2 | rg << 6, hc = p2 | rg << 6;
function ig(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, tg.toByteArray)((0, eg.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function g2(t, e) {
  const n = ig(t), r = ng(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== sg)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (dc | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== hc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== hc)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, p = r - d, x = new Uint8Array(g + c + p + d);
  for (o = 0; o < g; ++o)
    x[o] = 0;
  x.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const E = o; o < E + p; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, eg.escape)((0, tg.fromByteArray)(x));
}
ro.derToJose = g2;
function Pd(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= dc && --r, r;
}
function y2(t, e) {
  t = ig(t);
  const n = ng(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Pd(t, 0, n), i = Pd(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < dc, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = sg, u ? d[l++] = c : (d[l++] = dc | 1, d[l++] = c & 255), d[l++] = hc, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = hc, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
ro.joseToDer = y2;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.InvalidTokenError = Rr.MissingParametersError = void 0;
class w2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Rr.MissingParametersError = w2;
class b2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Rr.InvalidTokenError = b2;
const fa = /* @__PURE__ */ Uc(Q1);
Object.defineProperty(Rc, "__esModule", { value: !0 });
Rc.SECP256K1Client = void 0;
const m2 = Fp, x2 = Kc, Za = u2, Nd = ro, _d = Rr, Ud = fa;
Za.utils.hmacSha256Sync = (t, ...e) => {
  const n = m2.hmac.create(x2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class og {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Ud.bytesToHex)(Za.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new _d.MissingParametersError("a signing input hash and private key are all required");
    const s = Za.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Ud.bytesToHex)(s);
    if (r === "jose")
      return (0, Nd.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Nd.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new _d.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Za.verify(n, e, r, { strict: !1 });
  }
}
Rc.SECP256K1Client = og;
og.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Rc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(jc);
var ei = {};
const S2 = /* @__PURE__ */ Uc(fp);
var E2 = En && En.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(ei, "__esModule", { value: !0 });
ei.hashSha256Async = ei.hashSha256 = void 0;
const A2 = Kc;
function ag(t) {
  return (0, A2.sha256)(t);
}
ei.hashSha256 = ag;
function v2(t) {
  return E2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = S2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(ag(t));
    }
  });
}
ei.hashSha256Async = v2;
var k2 = En && En.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(no, "__esModule", { value: !0 });
no.TokenSigner = no.createUnsecuredToken = void 0;
const nu = mn, Hd = jc, $2 = Rr, Od = ei;
function ru(t, e) {
  const n = [], r = nu.encode(JSON.stringify(e));
  n.push(r);
  const s = nu.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function I2(t) {
  return ru(t, { typ: "JWT", alg: "none" }) + ".";
}
no.createUnsecuredToken = I2;
class L2 {
  constructor(e, n) {
    if (!(e && n))
      throw new $2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Hd.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Hd.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = ru(e, s), o = (0, Od.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return k2(this, void 0, void 0, function* () {
      const s = this.header(r), i = ru(e, s), o = yield (0, Od.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [nu.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
no.TokenSigner = L2;
var Vc = {};
Object.defineProperty(Vc, "__esModule", { value: !0 });
Vc.TokenVerifier = void 0;
const C2 = mn, Dd = jc, T2 = Rr, ka = ei;
class B2 {
  constructor(e, n) {
    if (!(e && n))
      throw new T2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Dd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Dd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, ka.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, ka.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), C2.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, ka.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, ka.hashSha256)(r);
      return i(o);
    }
  }
}
Vc.TokenVerifier = B2;
var Yc = {};
Object.defineProperty(Yc, "__esModule", { value: !0 });
Yc.decodeToken = void 0;
const $a = mn;
function M2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse($a.decode(e[0])), r = JSON.parse($a.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = $a.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse($a.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Yc.decodeToken = M2;
(function(t) {
  var e = En && En.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = En && En.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(no, t), n(Vc, t), n(Yc, t), n(Rr, t), n(jc, t);
})(sn);
function P2(t) {
  return `did:btc-addr:${t}`;
}
function N2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new bd("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new bd('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function cg(t) {
  if (t)
    return N2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const _2 = "1.4.0";
function U2() {
  return S1();
}
function H2(t, e, n, r = ep.slice(), s, i = bb().getTime(), o = {}) {
  const a = (p) => {
    const x = nf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: xb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: _2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = sn.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = Mp(u);
  return c.iss = P2(d), new sn.TokenSigner("ES256k", t).sign(c);
}
async function Fd(t, e) {
  const n = aa(Zt(e)), r = JSON.parse(n), s = await Up(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function O2(t) {
  const e = sn.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new sn.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function D2(t) {
  const e = sn.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = cg(e.iss);
  if (n.length === 1) {
    if (Mp(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function F2(t) {
  const e = sn.decodeToken(t).payload;
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
function j2(t) {
  const e = sn.decodeToken(t).payload;
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
function R2(t) {
  const e = [
    j2(t),
    F2(t),
    O2(t),
    D2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const jd = "1.0.0";
class Is {
  constructor(e) {
    this.version = jd, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== jd)
      throw new ql(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Is(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class lg {
  constructor(e) {
    if (e) {
      const n = new Is(e);
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
class Rd extends lg {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Is({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new np("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Is({})), !0;
  }
}
class zd extends lg {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = gb, !localStorage.getItem(this.key)) {
      const r = new Is({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new np("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Is.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Is({})), !0;
  }
}
var Xo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Xo || (Xo = {}));
var pc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(pc || (pc = {}));
Xo.Mainnet;
var Dr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Dr || (Dr = {}));
var xr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(xr || (xr = {}));
Dr.Mainnet;
const ug = {
  chainId: Xo.Mainnet,
  transactionVersion: Dr.Mainnet,
  peerNetworkId: pc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: xr.MainnetSingleSig,
    multiSig: xr.MainnetMultiSig
  },
  client: { baseUrl: rp }
}, su = {
  chainId: Xo.Testnet,
  transactionVersion: Dr.Testnet,
  peerNetworkId: pc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: xr.TestnetSingleSig,
    multiSig: xr.TestnetMultiSig
  },
  client: { baseUrl: sp }
}, Qa = {
  ...su,
  addressVersion: { ...su.addressVersion },
  magicBytes: "id",
  client: { baseUrl: ip }
}, z2 = {
  ...Qa,
  addressVersion: { ...Qa.addressVersion },
  client: { ...Qa.client }
};
function G2(t) {
  switch (t) {
    case "mainnet":
      return ug;
    case "testnet":
      return su;
    case "devnet":
      return Qa;
    case "mocknet":
      return z2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function fg(t) {
  return typeof t == "string" ? G2(t) : t;
}
var Gd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Gd || (Gd = {}));
var Kd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Kd || (Kd = {}));
var nr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(nr || (nr = {}));
const ml = ["onChainOnly", "offChainOnly", "any"];
ml[0] + "", nr.OnChainOnly, ml[1] + "", nr.OffChainOnly, ml[2] + "", nr.Any, nr.OnChainOnly + "", nr.OnChainOnly, nr.OffChainOnly + "", nr.OffChainOnly, nr.Any + "", nr.Any;
var Vd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Vd || (Vd = {}));
var Yd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Yd || (Yd = {}));
var qd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(qd || (qd = {}));
var Or;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Or || (Or = {}));
var Xd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Xd || (Xd = {}));
var Wd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Wd || (Wd = {}));
var Zd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Zd || (Zd = {}));
var Qd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Qd || (Qd = {}));
var Jd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Jd || (Jd = {}));
var th;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(th || (th = {}));
var eh;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(eh || (eh = {}));
var nh;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(nh || (nh = {}));
var rh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(rh || (rh = {}));
function iu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function K2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function dg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function V2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  iu(t.outputLen), iu(t.blockLen);
}
function Y2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function q2(t, e) {
  dg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Rs = {
  number: iu,
  bool: K2,
  bytes: dg,
  hash: V2,
  exists: Y2,
  output: q2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const xl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), dr = (t, e) => t << 32 - e | t >>> e, X2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!X2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function W2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function mf(t) {
  if (typeof t == "string" && (t = W2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let hg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function bi(t) {
  const e = (r) => t().update(mf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let pg = class extends hg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Rs.hash(e);
    const r = mf(n);
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
    return Rs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Rs.exists(this), Rs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const gg = (t, e, n) => new pg(t, e).update(n).digest();
gg.create = (t, e) => new pg(t, e);
function Z2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let xf = class extends hg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = xl(this.buffer);
  }
  update(e) {
    Rs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = mf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = xl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Rs.exists(this), Rs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Z2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = xl(e), c = this.outputLen;
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
const Q2 = (t, e, n) => t & e ^ ~t & n, J2 = (t, e, n) => t & e ^ t & n ^ e & n, tx = new Uint32Array([
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
let yg = class extends xf {
  constructor() {
    super(64, 32, 8, !1), this.A = ns[0] | 0, this.B = ns[1] | 0, this.C = ns[2] | 0, this.D = ns[3] | 0, this.E = ns[4] | 0, this.F = ns[5] | 0, this.G = ns[6] | 0, this.H = ns[7] | 0;
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
      rs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = rs[l - 15], p = rs[l - 2], x = dr(g, 7) ^ dr(g, 18) ^ g >>> 3, E = dr(p, 17) ^ dr(p, 19) ^ p >>> 10;
      rs[l] = E + rs[l - 7] + x + rs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = dr(a, 6) ^ dr(a, 11) ^ dr(a, 25), p = d + g + Q2(a, c, u) + tx[l] + rs[l] | 0, E = (dr(r, 2) ^ dr(r, 13) ^ dr(r, 22)) + J2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ex = class extends yg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const wg = bi(() => new yg());
bi(() => new ex());
var mi = {}, Sf = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = fa;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const x = n.indexOf(o[p]) >> u;
        let E = 0;
        p !== 0 && (E = n.indexOf(o[p - 1]));
        const L = 1 + u, U = E % (1 << L) << 5 - L, D = t.c32[x + U];
        u = L, c.unshift(D);
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
      for (let x = 0; x < p; x++)
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
    let d = [], l = 0, g = 0;
    for (let E = o.length - 1; E >= 0; E--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const U = (t.c32.indexOf(o[E]) << g) + l, D = n[U % 16];
      if (g += 1, l = U >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(D);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let E = 0; E < d.length && d[E] === "0"; E++)
      p++;
    d = d.slice(p - p % 2);
    let x = d.join("");
    for (let E = 0; E < u; E++)
      x = `00${x}`;
    if (a) {
      const E = a * 2 - x.length;
      for (let L = 0; L < E; L += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = i;
})(Sf);
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
ni.c32checkDecode = ni.c32checkEncode = void 0;
const sh = Kc, ih = fa, Go = Sf;
function bg(t) {
  const e = (0, sh.sha256)((0, sh.sha256)((0, ih.hexToBytes)(t)));
  return (0, ih.bytesToHex)(e.slice(0, 4));
}
function nx(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = bg(`${n}${e}`), s = (0, Go.c32encode)(`${e}${r}`);
  return `${Go.c32[t]}${s}`;
}
ni.c32checkEncode = nx;
function rx(t) {
  t = (0, Go.c32normalize)(t);
  const e = (0, Go.c32decode)(t.slice(1)), n = t[0], r = Go.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), bg(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
ni.c32checkDecode = rx;
var mg = {}, so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
so.decode = so.encode = void 0;
const gc = Kc, oh = fa, xg = Ip, Sg = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function sx(t, e = "00") {
  const n = typeof t == "string" ? (0, oh.hexToBytes)(t) : t, r = typeof e == "string" ? (0, oh.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, gc.sha256)((0, gc.sha256)(new Uint8Array([...r, ...n])));
  return xg(Sg).encode([...r, ...n, ...s.slice(0, 4)]);
}
so.encode = sx;
function ix(t) {
  const e = xg(Sg).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, gc.sha256)((0, gc.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
so.decode = ix;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = ni, n = so, r = fa;
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
    const g = n.decode(d), p = (0, r.bytesToHex)(g.data), x = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let E;
    return l < 0 ? (E = x, s[x] !== void 0 && (E = s[x])) : E = l, o(E, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const g = a(d), p = g[0], x = g[1];
    let E;
    l < 0 ? (E = p, i[p] !== void 0 && (E = i[p])) : E = l;
    let L = E.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(x, L);
  }
  t.c32ToB58 = u;
})(mg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Sf;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = ni;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = mg;
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
})(mi);
function ox(t, e) {
  switch (e = fg(e ?? ug), t) {
    case Or.P2PKH:
      switch (e.transactionVersion) {
        case Dr.Mainnet:
          return xr.MainnetSingleSig;
        case Dr.Testnet:
          return xr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Or.P2SH:
    case Or.P2SHNonSequential:
    case Or.P2WPKH:
    case Or.P2WSH:
    case Or.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Dr.Mainnet:
          return xr.MainnetMultiSig;
        case Dr.Testnet:
          return xr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const ax = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Eg = Uint8Array.from({ length: 16 }, (t, e) => e), cx = Eg.map((t) => (9 * t + 5) % 16);
let Ef = [Eg], Af = [cx];
for (let t = 0; t < 4; t++)
  for (let e of [Ef, Af])
    e.push(e[t].map((n) => ax[n]));
const Ag = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), lx = Ef.map((t, e) => t.map((n) => Ag[e][n])), ux = Af.map((t, e) => t.map((n) => Ag[e][n])), fx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), dx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ia = (t, e) => t << e | t >>> 32 - e;
function ah(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const La = new Uint32Array(16);
let hx = class extends xf {
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
    for (let p = 0; p < 16; p++, n += 4)
      La[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = fx[p], L = dx[p], U = Ef[p], D = Af[p], v = lx[p], H = ux[p];
      for (let P = 0; P < 16; P++) {
        const tt = Ia(r + ah(p, i, a, u) + La[U[P]] + E, v[P]) + l | 0;
        r = l, l = u, u = Ia(a, 10) | 0, a = i, i = tt;
      }
      for (let P = 0; P < 16; P++) {
        const tt = Ia(s + ah(x, o, c, d) + La[D[P]] + L, H[P]) + g | 0;
        s = g, g = d, d = Ia(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    La.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const px = bi(() => new hx()), Ca = BigInt(2 ** 32 - 1), ou = BigInt(32);
function vg(t, e = !1) {
  return e ? { h: Number(t & Ca), l: Number(t >> ou & Ca) } : { h: Number(t >> ou & Ca) | 0, l: Number(t & Ca) | 0 };
}
function gx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = vg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const yx = (t, e) => BigInt(t >>> 0) << ou | BigInt(e >>> 0), wx = (t, e, n) => t >>> n, bx = (t, e, n) => t << 32 - n | e >>> n, mx = (t, e, n) => t >>> n | e << 32 - n, xx = (t, e, n) => t << 32 - n | e >>> n, Sx = (t, e, n) => t << 64 - n | e >>> n - 32, Ex = (t, e, n) => t >>> n - 32 | e << 64 - n, Ax = (t, e) => e, vx = (t, e) => t, kx = (t, e, n) => t << n | e >>> 32 - n, $x = (t, e, n) => e << n | t >>> 32 - n, Ix = (t, e, n) => e << n - 32 | t >>> 64 - n, Lx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Cx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Tx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Bx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Mx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Px = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Nx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), _x = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Mt = {
  fromBig: vg,
  split: gx,
  toBig: yx,
  shrSH: wx,
  shrSL: bx,
  rotrSH: mx,
  rotrSL: xx,
  rotrBH: Sx,
  rotrBL: Ex,
  rotr32H: Ax,
  rotr32L: vx,
  rotlSH: kx,
  rotlSL: $x,
  rotlBH: Ix,
  rotlBL: Lx,
  add: Cx,
  add3L: Tx,
  add3H: Bx,
  add4L: Mx,
  add4H: Px,
  add5H: _x,
  add5L: Nx
}, [Ux, Hx] = Mt.split([
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
let qc = class extends xf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: x, Hh: E, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      ss[v] = e.getUint32(n), is[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const H = ss[v - 15] | 0, P = is[v - 15] | 0, tt = Mt.rotrSH(H, P, 1) ^ Mt.rotrSH(H, P, 8) ^ Mt.shrSH(H, P, 7), it = Mt.rotrSL(H, P, 1) ^ Mt.rotrSL(H, P, 8) ^ Mt.shrSL(H, P, 7), et = ss[v - 2] | 0, X = is[v - 2] | 0, k = Mt.rotrSH(et, X, 19) ^ Mt.rotrBH(et, X, 61) ^ Mt.shrSH(et, X, 6), B = Mt.rotrSL(et, X, 19) ^ Mt.rotrBL(et, X, 61) ^ Mt.shrSL(et, X, 6), b = Mt.add4L(it, B, is[v - 7], is[v - 16]), C = Mt.add4H(b, tt, k, ss[v - 7], ss[v - 16]);
      ss[v] = C | 0, is[v] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: x, Gh: E, Gl: L, Hh: U, Hl: D } = this;
    for (let v = 0; v < 80; v++) {
      const H = Mt.rotrSH(l, g, 14) ^ Mt.rotrSH(l, g, 18) ^ Mt.rotrBH(l, g, 41), P = Mt.rotrSL(l, g, 14) ^ Mt.rotrSL(l, g, 18) ^ Mt.rotrBL(l, g, 41), tt = l & p ^ ~l & E, it = g & x ^ ~g & L, et = Mt.add5L(D, P, it, Hx[v], is[v]), X = Mt.add5H(et, U, H, tt, Ux[v], ss[v]), k = et | 0, B = Mt.rotrSH(r, s, 28) ^ Mt.rotrBH(r, s, 34) ^ Mt.rotrBH(r, s, 39), b = Mt.rotrSL(r, s, 28) ^ Mt.rotrBL(r, s, 34) ^ Mt.rotrBL(r, s, 39), C = r & i ^ r & a ^ i & a, z = s & o ^ s & c ^ o & c;
      U = E | 0, D = L | 0, E = p | 0, L = x | 0, p = l | 0, x = g | 0, { h: l, l: g } = Mt.add(u | 0, d | 0, X | 0, k | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Mt.add3L(k, b, z);
      r = Mt.add3H(T, X, B, C), s = T | 0;
    }
    ({ h: r, l: s } = Mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Mt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Mt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: x } = Mt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: L } = Mt.add(this.Gh | 0, this.Gl | 0, E | 0, L | 0), { h: U, l: D } = Mt.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, d, l, g, p, x, E, L, U, D);
  }
  roundClean() {
    ss.fill(0), is.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Ox = class extends qc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Dx = class extends qc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Fx = class extends qc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
bi(() => new qc());
bi(() => new Ox());
bi(() => new Dx());
bi(() => new Fx());
var yc = { exports: {} };
yc.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", p = "[object Number]", x = "[object Object]", E = "[object Promise]", L = "[object RegExp]", U = "[object Set]", D = "[object String]", v = "[object Symbol]", H = "[object WeakMap]", P = "[object ArrayBuffer]", tt = "[object DataView]", it = "[object Float32Array]", et = "[object Float64Array]", X = "[object Int8Array]", k = "[object Int16Array]", B = "[object Int32Array]", b = "[object Uint8Array]", C = "[object Uint8ClampedArray]", z = "[object Uint16Array]", T = "[object Uint32Array]", st = /[\\^$.*+?()[\]{}|]/g, W = /\w*$/, vt = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, O = {};
  O[i] = O[o] = O[P] = O[tt] = O[a] = O[c] = O[it] = O[et] = O[X] = O[k] = O[B] = O[g] = O[p] = O[x] = O[L] = O[U] = O[D] = O[v] = O[b] = O[C] = O[z] = O[T] = !0, O[u] = O[d] = O[H] = !1;
  var J = typeof En == "object" && En && En.Object === Object && En, ot = typeof self == "object" && self && self.Object === Object && self, ct = J || ot || Function("return this")(), It = e && !e.nodeType && e, ue = It && !0 && t && !t.nodeType && t, kt = ue && ue.exports === It;
  function Xt(w, M) {
    return w.set(M[0], M[1]), w;
  }
  function Tt(w, M) {
    return w.add(M), w;
  }
  function _e(w, M) {
    for (var j = -1, lt = w ? w.length : 0; ++j < lt && M(w[j], j, w) !== !1; )
      ;
    return w;
  }
  function Dt(w, M) {
    for (var j = -1, lt = M.length, De = w.length; ++j < lt; )
      w[De + j] = M[j];
    return w;
  }
  function Lt(w, M, j, lt) {
    for (var De = -1, tn = w ? w.length : 0; ++De < tn; )
      j = M(j, w[De], De, w);
    return j;
  }
  function vn(w, M) {
    for (var j = -1, lt = Array(w); ++j < w; )
      lt[j] = M(j);
    return lt;
  }
  function he(w, M) {
    return w == null ? void 0 : w[M];
  }
  function Xe(w) {
    var M = !1;
    if (w != null && typeof w.toString != "function")
      try {
        M = !!(w + "");
      } catch {
      }
    return M;
  }
  function Cn(w) {
    var M = -1, j = Array(w.size);
    return w.forEach(function(lt, De) {
      j[++M] = [De, lt];
    }), j;
  }
  function Ce(w, M) {
    return function(j) {
      return w(M(j));
    };
  }
  function kn(w) {
    var M = -1, j = Array(w.size);
    return w.forEach(function(lt) {
      j[++M] = lt;
    }), j;
  }
  var Ue = Array.prototype, N = Function.prototype, gt = Object.prototype, zt = ct["__core-js_shared__"], We = function() {
    var w = /[^.]+$/.exec(zt && zt.keys && zt.keys.IE_PROTO || "");
    return w ? "Symbol(src)_1." + w : "";
  }(), dn = N.toString, He = gt.hasOwnProperty, pe = gt.toString, xe = RegExp(
    "^" + dn.call(He).replace(st, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Rn = kt ? ct.Buffer : void 0, $ = ct.Symbol, _ = ct.Uint8Array, G = Ce(Object.getPrototypeOf, Object), R = Object.create, dt = gt.propertyIsEnumerable, At = Ue.splice, re = Object.getOwnPropertySymbols, Wt = Rn ? Rn.isBuffer : void 0, ie = Ce(Object.keys, Object), ge = tr(ct, "DataView"), Jt = tr(ct, "Map"), je = tr(ct, "Promise"), Ft = tr(ct, "Set"), yt = tr(ct, "WeakMap"), Gt = tr(Object, "create"), te = $t(ge), Re = $t(Jt), fe = $t(je), Tn = $t(Ft), Ze = $t(yt), Tr = $ ? $.prototype : void 0, vi = Tr ? Tr.valueOf : void 0;
  function ve(w) {
    var M = -1, j = w ? w.length : 0;
    for (this.clear(); ++M < j; ) {
      var lt = w[M];
      this.set(lt[0], lt[1]);
    }
  }
  function hn() {
    this.__data__ = Gt ? Gt(null) : {};
  }
  function So(w) {
    return this.has(w) && delete this.__data__[w];
  }
  function Eo(w) {
    var M = this.__data__;
    if (Gt) {
      var j = M[w];
      return j === r ? void 0 : j;
    }
    return He.call(M, w) ? M[w] : void 0;
  }
  function ee(w) {
    var M = this.__data__;
    return Gt ? M[w] !== void 0 : He.call(M, w);
  }
  function Ye(w, M) {
    var j = this.__data__;
    return j[w] = Gt && M === void 0 ? r : M, this;
  }
  ve.prototype.clear = hn, ve.prototype.delete = So, ve.prototype.get = Eo, ve.prototype.has = ee, ve.prototype.set = Ye;
  function on(w) {
    var M = -1, j = w ? w.length : 0;
    for (this.clear(); ++M < j; ) {
      var lt = w[M];
      this.set(lt[0], lt[1]);
    }
  }
  function ki() {
    this.__data__ = [];
  }
  function $i(w) {
    var M = this.__data__, j = f(M, w);
    if (j < 0)
      return !1;
    var lt = M.length - 1;
    return j == lt ? M.pop() : At.call(M, j, 1), !0;
  }
  function zn(w) {
    var M = this.__data__, j = f(M, w);
    return j < 0 ? void 0 : M[j][1];
  }
  function Kr(w) {
    return f(this.__data__, w) > -1;
  }
  function Bn(w, M) {
    var j = this.__data__, lt = f(j, w);
    return lt < 0 ? j.push([w, M]) : j[lt][1] = M, this;
  }
  on.prototype.clear = ki, on.prototype.delete = $i, on.prototype.get = zn, on.prototype.has = Kr, on.prototype.set = Bn;
  function Mn(w) {
    var M = -1, j = w ? w.length : 0;
    for (this.clear(); ++M < j; ) {
      var lt = w[M];
      this.set(lt[0], lt[1]);
    }
  }
  function Ms() {
    this.__data__ = {
      hash: new ve(),
      map: new (Jt || on)(),
      string: new ve()
    };
  }
  function Ps(w) {
    return Oe(this, w).delete(w);
  }
  function Ii(w) {
    return Oe(this, w).get(w);
  }
  function Li(w) {
    return Oe(this, w).has(w);
  }
  function Ns(w, M) {
    return Oe(this, w).set(w, M), this;
  }
  Mn.prototype.clear = Ms, Mn.prototype.delete = Ps, Mn.prototype.get = Ii, Mn.prototype.has = Li, Mn.prototype.set = Ns;
  function ur(w) {
    this.__data__ = new on(w);
  }
  function oe() {
    this.__data__ = new on();
  }
  function Ao(w) {
    return this.__data__.delete(w);
  }
  function _s(w) {
    return this.__data__.get(w);
  }
  function Ci(w) {
    return this.__data__.has(w);
  }
  function Vr(w, M) {
    var j = this.__data__;
    if (j instanceof on) {
      var lt = j.__data__;
      if (!Jt || lt.length < n - 1)
        return lt.push([w, M]), this;
      j = this.__data__ = new Mn(lt);
    }
    return j.set(w, M), this;
  }
  ur.prototype.clear = oe, ur.prototype.delete = Ao, ur.prototype.get = _s, ur.prototype.has = Ci, ur.prototype.set = Vr;
  function Yr(w, M) {
    var j = Je(w) || Ge(w) ? vn(w.length, String) : [], lt = j.length, De = !!lt;
    for (var tn in w)
      He.call(w, tn) && !(De && (tn == "length" || K(tn, lt))) && j.push(tn);
    return j;
  }
  function Br(w, M, j) {
    var lt = w[M];
    (!(He.call(w, M) && yn(lt, j)) || j === void 0 && !(M in w)) && (w[M] = j);
  }
  function f(w, M) {
    for (var j = w.length; j--; )
      if (yn(w[j][0], M))
        return j;
    return -1;
  }
  function m(w, M) {
    return w && gn(M, Mi(M), w);
  }
  function A(w, M, j, lt, De, tn, Gn) {
    var en;
    if (lt && (en = tn ? lt(w, De, tn, Gn) : lt(w)), en !== void 0)
      return en;
    if (!Us(w))
      return w;
    var $o = Je(w);
    if ($o) {
      if (en = F(w), !M)
        return Qe(w, en);
    } else {
      var Pr = S(w), Io = Pr == d || Pr == l;
      if (Bi(w))
        return Qt(w, M);
      if (Pr == x || Pr == i || Io && !tn) {
        if (Xe(w))
          return tn ? w : {};
        if (en = V(Io ? {} : w), !M)
          return Pn(w, m(en, w));
      } else {
        if (!O[Pr])
          return tn ? w : {};
        en = ft(w, Pr, A, M);
      }
    }
    Gn || (Gn = new ur());
    var Lo = Gn.get(w);
    if (Lo)
      return Lo;
    if (Gn.set(w, en), !$o)
      var Co = j ? Jn(w) : Mi(w);
    return _e(Co || w, function(Pi, Hs) {
      Co && (Hs = Pi, Pi = w[Hs]), Br(en, Hs, A(Pi, M, j, lt, Hs, w, Gn));
    }), en;
  }
  function h(w) {
    return Us(w) ? R(w) : {};
  }
  function q(w, M, j) {
    var lt = M(w);
    return Je(w) ? lt : Dt(lt, j(w));
  }
  function pt(w) {
    return pe.call(w);
  }
  function ut(w) {
    if (!Us(w) || xt(w))
      return !1;
    var M = qr(w) || Xe(w) ? xe : vt;
    return M.test($t(w));
  }
  function St(w) {
    if (!wt(w))
      return ie(w);
    var M = [];
    for (var j in Object(w))
      He.call(w, j) && j != "constructor" && M.push(j);
    return M;
  }
  function Qt(w, M) {
    if (M)
      return w.slice();
    var j = new w.constructor(w.length);
    return w.copy(j), j;
  }
  function Te(w) {
    var M = new w.constructor(w.byteLength);
    return new _(M).set(new _(w)), M;
  }
  function Yt(w, M) {
    var j = M ? Te(w.buffer) : w.buffer;
    return new w.constructor(j, w.byteOffset, w.byteLength);
  }
  function Ut(w, M, j) {
    var lt = M ? j(Cn(w), !0) : Cn(w);
    return Lt(lt, Xt, new w.constructor());
  }
  function Be(w) {
    var M = new w.constructor(w.source, W.exec(w));
    return M.lastIndex = w.lastIndex, M;
  }
  function Kt(w, M, j) {
    var lt = M ? j(kn(w), !0) : kn(w);
    return Lt(lt, Tt, new w.constructor());
  }
  function pn(w) {
    return vi ? Object(vi.call(w)) : {};
  }
  function ze(w, M) {
    var j = M ? Te(w.buffer) : w.buffer;
    return new w.constructor(j, w.byteOffset, w.length);
  }
  function Qe(w, M) {
    var j = -1, lt = w.length;
    for (M || (M = Array(lt)); ++j < lt; )
      M[j] = w[j];
    return M;
  }
  function gn(w, M, j, lt) {
    j || (j = {});
    for (var De = -1, tn = M.length; ++De < tn; ) {
      var Gn = M[De], en = void 0;
      Br(j, Gn, en === void 0 ? w[Gn] : en);
    }
    return j;
  }
  function Pn(w, M) {
    return gn(w, y(w), M);
  }
  function Jn(w) {
    return q(w, Mi, y);
  }
  function Oe(w, M) {
    var j = w.__data__;
    return mt(M) ? j[typeof M == "string" ? "string" : "hash"] : j.map;
  }
  function tr(w, M) {
    var j = he(w, M);
    return ut(j) ? j : void 0;
  }
  var y = re ? Ce(re, Object) : fl, S = pt;
  (ge && S(new ge(new ArrayBuffer(1))) != tt || Jt && S(new Jt()) != g || je && S(je.resolve()) != E || Ft && S(new Ft()) != U || yt && S(new yt()) != H) && (S = function(w) {
    var M = pe.call(w), j = M == x ? w.constructor : void 0, lt = j ? $t(j) : void 0;
    if (lt)
      switch (lt) {
        case te:
          return tt;
        case Re:
          return g;
        case fe:
          return E;
        case Tn:
          return U;
        case Ze:
          return H;
      }
    return M;
  });
  function F(w) {
    var M = w.length, j = w.constructor(M);
    return M && typeof w[0] == "string" && He.call(w, "index") && (j.index = w.index, j.input = w.input), j;
  }
  function V(w) {
    return typeof w.constructor == "function" && !wt(w) ? h(G(w)) : {};
  }
  function ft(w, M, j, lt) {
    var De = w.constructor;
    switch (M) {
      case P:
        return Te(w);
      case a:
      case c:
        return new De(+w);
      case tt:
        return Yt(w, lt);
      case it:
      case et:
      case X:
      case k:
      case B:
      case b:
      case C:
      case z:
      case T:
        return ze(w, lt);
      case g:
        return Ut(w, lt, j);
      case p:
      case D:
        return new De(w);
      case L:
        return Be(w);
      case U:
        return Kt(w, lt, j);
      case v:
        return pn(w);
    }
  }
  function K(w, M) {
    return M = M ?? s, !!M && (typeof w == "number" || I.test(w)) && w > -1 && w % 1 == 0 && w < M;
  }
  function mt(w) {
    var M = typeof w;
    return M == "string" || M == "number" || M == "symbol" || M == "boolean" ? w !== "__proto__" : w === null;
  }
  function xt(w) {
    return !!We && We in w;
  }
  function wt(w) {
    var M = w && w.constructor, j = typeof M == "function" && M.prototype || gt;
    return w === j;
  }
  function $t(w) {
    if (w != null) {
      try {
        return dn.call(w);
      } catch {
      }
      try {
        return w + "";
      } catch {
      }
    }
    return "";
  }
  function ye(w) {
    return A(w, !0, !0);
  }
  function yn(w, M) {
    return w === M || w !== w && M !== M;
  }
  function Ge(w) {
    return Ti(w) && He.call(w, "callee") && (!dt.call(w, "callee") || pe.call(w) == i);
  }
  var Je = Array.isArray;
  function Mr(w) {
    return w != null && vo(w.length) && !qr(w);
  }
  function Ti(w) {
    return ko(w) && Mr(w);
  }
  var Bi = Wt || ga;
  function qr(w) {
    var M = Us(w) ? pe.call(w) : "";
    return M == d || M == l;
  }
  function vo(w) {
    return typeof w == "number" && w > -1 && w % 1 == 0 && w <= s;
  }
  function Us(w) {
    var M = typeof w;
    return !!w && (M == "object" || M == "function");
  }
  function ko(w) {
    return !!w && typeof w == "object";
  }
  function Mi(w) {
    return Mr(w) ? Yr(w) : St(w);
  }
  function fl() {
    return [];
  }
  function ga() {
    return !1;
  }
  t.exports = ye;
})(yc, yc.exports);
var jx = yc.exports;
const kg = /* @__PURE__ */ Z0(jx);
var au;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(au || (au = {}));
function Rx(t, e) {
  return { type: au.Address, version: t, hash160: e };
}
function zx(t) {
  return mi.c32address(t.version, t.hash160);
}
const Gx = (t) => px(wg(t)), Kx = (t) => bt(Gx(t));
Le.hmacSha256Sync = (t, ...e) => {
  const n = gg.create(wg, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Vx(t, e = "mainnet") {
  e = fg(e), t = typeof t == "string" ? Zt(t) : t;
  const n = ox(Or.P2PKH, e), r = Rx(n, Kx(t));
  return zx(r);
}
function Yx(t, e) {
  const n = sn.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Vx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new sn.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function qx(t, e = null) {
  let n;
  e ? n = Yx(t, e) : n = sn.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const ch = "_blockstackDidCheckEchoReply", Xx = "echoReply", Wx = "authContinuation";
function Zx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Qx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[ch];
  if (typeof e == "boolean")
    return e;
  const n = Zx(t.location.search), r = n[Xx];
  if (r) {
    t[ch] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Wx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class cu {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new op();
    else
      throw new wb("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new zd(e.sessionOptions) : this.store = new zd() : e ? this.store = new Rd(e.sessionOptions) : this.store = new Rd();
  }
  makeAuthRequestToken(e, n, r, s, i, o = mb().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ql("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, H2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = U2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = nf("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Qx())
        return Ri.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ri.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Rb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new wa("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = sn.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await R2(e))
      throw new wa("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (pl(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Fd(s, i.private_key);
          } catch {
            if (Ri.warn("Failed decryption of appPrivateKey, will try to use as given"), !Le.isValidPrivateKey(i.private_key))
              throw new wa("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Fd(s, c);
          } catch {
            Ri.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new wa("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Bb, d;
    pl(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), pl(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: cg(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = i.profile_url;
    if (!l.profile && g) {
      const p = await n(g);
      if (!p.ok)
        l.profile = Object.assign({}, pb);
      else {
        const x = await p.text(), E = JSON.parse(x);
        l.profile = qx(E[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new ql("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), B1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), M1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
cu.prototype.makeAuthRequest = cu.prototype.makeAuthRequestToken;
const Jx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], tS = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Jx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Xc(r.id));
  return e.concat(n);
}, Xc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), $g = "STX_PROVIDER", ri = () => typeof window > "u" ? null : window.localStorage.getItem($g), eS = (t) => {
  typeof window < "u" && window.localStorage.setItem($g, t);
}, nS = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function rS(t, e) {
  const n = {};
  return Object.assign(n, nS, e), await fetch(t, n);
}
function sS(t) {
  let e = rS, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function iS(...t) {
  const { fetchLib: e, middlewares: n } = sS(t);
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
var io;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(io || (io = {}));
var si;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(si || (si = {}));
var lh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(lh || (lh = {}));
const oS = "https://api.mainnet.hiro.so", aS = "https://api.testnet.hiro.so", cS = "http://localhost:3999", lS = ["mainnet", "testnet", "devnet", "mocknet"];
class ii {
  constructor(e) {
    this.version = si.Mainnet, this.chainId = io.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === si.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? iS();
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
ii.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new lu();
    case "testnet":
      return new uu();
    case "devnet":
      return new uS();
    case "mocknet":
      return new Ig();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${lS.join(", ")}`);
  }
};
ii.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ii.fromName(t);
class lu extends ii {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? oS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = si.Mainnet, this.chainId = io.Mainnet;
  }
}
class uu extends ii {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? aS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = si.Testnet, this.chainId = io.Testnet;
  }
}
class Ig extends ii {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = si.Testnet, this.chainId = io.Testnet;
  }
}
const uS = Ig;
var oi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(oi || (oi = {}));
var wc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(wc || (wc = {}));
oi.Mainnet;
var ai;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ai || (ai = {}));
var ci;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ci || (ci = {}));
ai.Mainnet;
const fS = {
  chainId: oi.Mainnet,
  transactionVersion: ai.Mainnet,
  peerNetworkId: wc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ci.MainnetSingleSig,
    multiSig: ci.MainnetMultiSig
  },
  client: { baseUrl: rp }
}, fu = {
  chainId: oi.Testnet,
  transactionVersion: ai.Testnet,
  peerNetworkId: wc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ci.TestnetSingleSig,
    multiSig: ci.TestnetMultiSig
  },
  client: { baseUrl: sp }
}, Ja = {
  ...fu,
  addressVersion: { ...fu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: ip }
}, dS = {
  ...Ja,
  addressVersion: { ...Ja.addressVersion },
  client: { ...Ja.client }
};
function hS(t) {
  switch (t) {
    case "mainnet":
      return fS;
    case "testnet":
      return fu;
    case "devnet":
      return Ja;
    case "mocknet":
      return dS;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function pS(t) {
  return typeof t == "string" ? hS(t) : t;
}
function gS(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const uh = /* @__PURE__ */ new Map();
function Lg(t, e) {
  const n = uh.get(t);
  if (n !== void 0)
    return n(e);
  const r = gS(t);
  return uh.set(t, r), Lg(t, e);
}
let de = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Zt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Ob(this.readBytes(4), 0);
  }
  readUInt8() {
    return Ub(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Nb(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = bt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = bt(n);
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
    if (Lg(e, r))
      return r;
    throw n(r);
  }
};
const yS = 128, wS = 128, Cg = 16, Ys = 32, du = 80, Wc = 65, bS = 32, mS = 64, bc = 34, xS = 1 + 16 * 1024 * 1024, SS = 165, ES = 16, AS = 16, vS = 20, kS = AS + 2 + vS, $S = kS + 4, IS = xS + (SS + ES * $S);
var se;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(se || (se = {}));
var hu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(hu || (hu = {}));
var _n;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(_n || (_n = {}));
const Sl = ["onChainOnly", "offChainOnly", "any"];
Sl[0] + "", _n.OnChainOnly, Sl[1] + "", _n.OffChainOnly, Sl[2] + "", _n.Any, _n.OnChainOnly + "", _n.OnChainOnly, _n.OffChainOnly + "", _n.OffChainOnly, _n.Any + "", _n.Any;
var mc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(mc || (mc = {}));
var we;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(we || (we = {}));
var $e;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})($e || ($e = {}));
var ce;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ce || (ce = {}));
var Ee;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ee || (Ee = {}));
var Ko;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ko || (Ko = {}));
var pu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(pu || (pu = {}));
var gu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(gu || (gu = {}));
var xn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(xn || (xn = {}));
var fh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(fh || (fh = {}));
var yu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(yu || (yu = {}));
var ir;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ir || (ir = {}));
var dh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(dh || (dh = {}));
let Zc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, zi = class extends Zc {
  constructor(e) {
    super(e);
  }
}, bn = class extends Zc {
  constructor(e) {
    super(e);
  }
}, xc = class extends Zc {
  constructor(e) {
    super(e);
  }
}, zs = class extends Zc {
  constructor(e) {
    super(e);
  }
};
function wu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function LS(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Tg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function CS(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wu(t.outputLen), wu(t.blockLen);
}
function TS(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function BS(t, e) {
  Tg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Gs = {
  number: wu,
  bool: LS,
  bytes: Tg,
  hash: CS,
  exists: TS,
  output: BS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const El = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, MS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!MS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function PS(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function vf(t) {
  if (typeof t == "string" && (t = PS(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Bg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function xi(t) {
  const e = (r) => t().update(vf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Mg = class extends Bg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Gs.hash(e);
    const r = vf(n);
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
    return Gs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Gs.exists(this), Gs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Pg = (t, e, n) => new Mg(t, e).update(n).digest();
Pg.create = (t, e) => new Mg(t, e);
function NS(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let kf = class extends Bg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = El(this.buffer);
  }
  update(e) {
    Gs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = vf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = El(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Gs.exists(this), Gs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    NS(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = El(e), c = this.outputLen;
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
const _S = (t, e, n) => t & e ^ ~t & n, US = (t, e, n) => t & e ^ t & n ^ e & n, HS = new Uint32Array([
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
]), os = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), as = new Uint32Array(64);
let Ng = class extends kf {
  constructor() {
    super(64, 32, 8, !1), this.A = os[0] | 0, this.B = os[1] | 0, this.C = os[2] | 0, this.D = os[3] | 0, this.E = os[4] | 0, this.F = os[5] | 0, this.G = os[6] | 0, this.H = os[7] | 0;
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
      as[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = as[l - 15], p = as[l - 2], x = hr(g, 7) ^ hr(g, 18) ^ g >>> 3, E = hr(p, 17) ^ hr(p, 19) ^ p >>> 10;
      as[l] = E + as[l - 7] + x + as[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), p = d + g + _S(a, c, u) + HS[l] + as[l] | 0, E = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + US(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    as.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, OS = class extends Ng {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const $f = xi(() => new Ng());
xi(() => new OS());
const DS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _g = Uint8Array.from({ length: 16 }, (t, e) => e), FS = _g.map((t) => (9 * t + 5) % 16);
let If = [_g], Lf = [FS];
for (let t = 0; t < 4; t++)
  for (let e of [If, Lf])
    e.push(e[t].map((n) => DS[n]));
const Ug = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), jS = If.map((t, e) => t.map((n) => Ug[e][n])), RS = Lf.map((t, e) => t.map((n) => Ug[e][n])), zS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), GS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ta = (t, e) => t << e | t >>> 32 - e;
function hh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ba = new Uint32Array(16);
let KS = class extends kf {
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
    for (let p = 0; p < 16; p++, n += 4)
      Ba[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = zS[p], L = GS[p], U = If[p], D = Lf[p], v = jS[p], H = RS[p];
      for (let P = 0; P < 16; P++) {
        const tt = Ta(r + hh(p, i, a, u) + Ba[U[P]] + E, v[P]) + l | 0;
        r = l, l = u, u = Ta(a, 10) | 0, a = i, i = tt;
      }
      for (let P = 0; P < 16; P++) {
        const tt = Ta(s + hh(x, o, c, d) + Ba[D[P]] + L, H[P]) + g | 0;
        s = g, g = d, d = Ta(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ba.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const VS = xi(() => new KS()), Ma = BigInt(2 ** 32 - 1), bu = BigInt(32);
function Hg(t, e = !1) {
  return e ? { h: Number(t & Ma), l: Number(t >> bu & Ma) } : { h: Number(t >> bu & Ma) | 0, l: Number(t & Ma) | 0 };
}
function YS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Hg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const qS = (t, e) => BigInt(t >>> 0) << bu | BigInt(e >>> 0), XS = (t, e, n) => t >>> n, WS = (t, e, n) => t << 32 - n | e >>> n, ZS = (t, e, n) => t >>> n | e << 32 - n, QS = (t, e, n) => t << 32 - n | e >>> n, JS = (t, e, n) => t << 64 - n | e >>> n - 32, tE = (t, e, n) => t >>> n - 32 | e << 64 - n, eE = (t, e) => e, nE = (t, e) => t, rE = (t, e, n) => t << n | e >>> 32 - n, sE = (t, e, n) => e << n | t >>> 32 - n, iE = (t, e, n) => e << n - 32 | t >>> 64 - n, oE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function aE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const cE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), lE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, uE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), fE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, dE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), hE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: Hg,
  split: YS,
  toBig: qS,
  shrSH: XS,
  shrSL: WS,
  rotrSH: ZS,
  rotrSL: QS,
  rotrBH: JS,
  rotrBL: tE,
  rotr32H: eE,
  rotr32L: nE,
  rotlSH: rE,
  rotlSL: sE,
  rotlBH: iE,
  rotlBL: oE,
  add: aE,
  add3L: cE,
  add3H: lE,
  add4L: uE,
  add4H: fE,
  add5H: hE,
  add5L: dE
}, [pE, gE] = Pt.split([
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
].map((t) => BigInt(t))), cs = new Uint32Array(80), ls = new Uint32Array(80);
let Qc = class extends kf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: x, Hh: E, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      cs[v] = e.getUint32(n), ls[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const H = cs[v - 15] | 0, P = ls[v - 15] | 0, tt = Pt.rotrSH(H, P, 1) ^ Pt.rotrSH(H, P, 8) ^ Pt.shrSH(H, P, 7), it = Pt.rotrSL(H, P, 1) ^ Pt.rotrSL(H, P, 8) ^ Pt.shrSL(H, P, 7), et = cs[v - 2] | 0, X = ls[v - 2] | 0, k = Pt.rotrSH(et, X, 19) ^ Pt.rotrBH(et, X, 61) ^ Pt.shrSH(et, X, 6), B = Pt.rotrSL(et, X, 19) ^ Pt.rotrBL(et, X, 61) ^ Pt.shrSL(et, X, 6), b = Pt.add4L(it, B, ls[v - 7], ls[v - 16]), C = Pt.add4H(b, tt, k, cs[v - 7], cs[v - 16]);
      cs[v] = C | 0, ls[v] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: x, Gh: E, Gl: L, Hh: U, Hl: D } = this;
    for (let v = 0; v < 80; v++) {
      const H = Pt.rotrSH(l, g, 14) ^ Pt.rotrSH(l, g, 18) ^ Pt.rotrBH(l, g, 41), P = Pt.rotrSL(l, g, 14) ^ Pt.rotrSL(l, g, 18) ^ Pt.rotrBL(l, g, 41), tt = l & p ^ ~l & E, it = g & x ^ ~g & L, et = Pt.add5L(D, P, it, gE[v], ls[v]), X = Pt.add5H(et, U, H, tt, pE[v], cs[v]), k = et | 0, B = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), b = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), C = r & i ^ r & a ^ i & a, z = s & o ^ s & c ^ o & c;
      U = E | 0, D = L | 0, E = p | 0, L = x | 0, p = l | 0, x = g | 0, { h: l, l: g } = Pt.add(u | 0, d | 0, X | 0, k | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Pt.add3L(k, b, z);
      r = Pt.add3H(T, X, B, C), s = T | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Pt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: x } = Pt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: L } = Pt.add(this.Gh | 0, this.Gl | 0, E | 0, L | 0), { h: U, l: D } = Pt.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, d, l, g, p, x, E, L, U, D);
  }
  roundClean() {
    cs.fill(0), ls.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, yE = class extends Qc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, wE = class extends Qc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, bE = class extends Qc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
xi(() => new Qc());
xi(() => new yE());
const mE = xi(() => new wE());
xi(() => new bE());
var Vt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Vt || (Vt = {}));
var Ke;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ke || (Ke = {}));
function Cf(t) {
  return Ke[t];
}
const xE = () => ({ type: Vt.BoolTrue }), SE = () => ({ type: Vt.BoolFalse }), EE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Vt.Buffer, value: bt(t) };
}, ph = BigInt("0xffffffffffffffffffffffffffffffff"), AE = BigInt(0), gh = BigInt("0x7fffffffffffffffffffffffffffffff"), yh = BigInt("-170141183460469231731687303715884105728"), vE = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Wl(Zt(t))), Ln(t, Uint8Array) && (t = Wl(t));
  const e = fn(t);
  if (e > gh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${gh}`);
  if (e < yh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${yh}`);
  return { type: Vt.Int, value: e };
}, kE = (t) => {
  const e = fn(t);
  if (e < AE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ph)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ph}`);
  return { type: Vt.UInt, value: e };
};
function $E(t) {
  return { type: Vt.List, value: t };
}
function Og() {
  return { type: Vt.OptionalNone };
}
function Dg(t) {
  return { type: Vt.OptionalSome, value: t };
}
var rt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(rt || (rt = {}));
function IE() {
  return {
    type: rt.Address,
    version: ci.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function wh(t) {
  if (t && qg(t, bc))
    throw new Error(`Memo exceeds maximum length of ${bc} bytes`);
  return { type: rt.MemoString, content: t };
}
function Tf(t, e) {
  return {
    type: rt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function mu(t) {
  if (Zt(t).byteLength != Wc)
    throw Error("Invalid signature");
  return {
    type: rt.MessageSignature,
    data: t
  };
}
function LE(t, e, n) {
  return typeof t == "string" && (t = GE(t)), typeof n == "string" && (n = wh(n)), {
    type: rt.Payload,
    payloadType: se.TokenTransfer,
    recipient: t,
    amount: fn(e),
    memo: n ?? wh("")
  };
}
function CE(t, e, n, r) {
  return typeof e == "string" && (e = cr(e)), typeof n == "string" && (n = cr(n)), {
    type: rt.Payload,
    payloadType: se.ContractCall,
    contractAddress: typeof t == "string" ? Bs(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function TE(t) {
  return cr(t, 4, 1e5);
}
function bh(t, e, n) {
  return typeof t == "string" && (t = cr(t)), typeof e == "string" && (e = TE(e)), typeof n == "number" ? {
    type: rt.Payload,
    payloadType: se.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: rt.Payload,
    payloadType: se.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function BE() {
  return { type: rt.Payload, payloadType: se.PoisonMicroblock };
}
function mh(t, e) {
  if (t.byteLength != Ys)
    throw Error(`Coinbase buffer size must be ${Ys} bytes`);
  return e != null ? {
    type: rt.Payload,
    payloadType: se.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: rt.Payload,
    payloadType: se.Coinbase,
    coinbaseBytes: t
  };
}
function ME(t, e, n) {
  if (t.byteLength != Ys)
    throw Error(`Coinbase buffer size must be ${Ys} bytes`);
  if (n.byteLength != du)
    throw Error(`VRF proof buffer size must be ${du} bytes`);
  return {
    type: rt.Payload,
    payloadType: se.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Vt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function PE(t, e, n, r, s, i, o) {
  return {
    type: rt.Payload,
    payloadType: se.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function cr(t, e, n) {
  const r = e || 1, s = n || yS;
  if (qg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: rt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function NE(t, e, n) {
  return {
    type: rt.Asset,
    address: Bs(t),
    contractName: cr(e),
    assetName: cr(n)
  };
}
function Bs(t) {
  const e = mi.c32addressDecode(t);
  return {
    type: rt.Address,
    version: e[0],
    hash160: e[1]
  };
}
function _E(t, e) {
  const n = Bs(t), r = cr(e);
  return {
    type: rt.Principal,
    prefix: xn.Contract,
    address: n,
    contractName: r
  };
}
function UE(t) {
  const e = Bs(t);
  return {
    type: rt.Principal,
    prefix: xn.Standard,
    address: e
  };
}
function Gi(t, e) {
  return {
    pubKeyEncoding: t,
    type: rt.TransactionAuthField,
    contents: e
  };
}
function Ur(t) {
  switch (t.type) {
    case rt.Address:
      return da(t);
    case rt.Principal:
      return Fg(t);
    case rt.LengthPrefixedString:
      return ao(t);
    case rt.MemoString:
      return OE(t);
    case rt.Asset:
      return Rg(t);
    case rt.PostCondition:
      return Gg(t);
    case rt.PublicKey:
      return Eu(t);
    case rt.LengthPrefixedList:
      return Bf(t);
    case rt.Payload:
      return Kg(t);
    case rt.TransactionAuthField:
      return zE(t);
    case rt.MessageSignature:
      return Mf(t);
  }
}
function da(t) {
  const e = [];
  return e.push(Zt(oa(t.version, 1))), e.push(Zt(t.hash160)), Pe(e);
}
function oo(t) {
  const e = Ln(t, de) ? t : new de(t), n = Hc(bt(e.readBytes(1))), r = bt(e.readBytes(20));
  return { type: rt.Address, version: n, hash160: r };
}
function Fg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === xn.Standard || t.prefix === xn.Contract) && e.push(da(t.address)), t.prefix === xn.Contract && e.push(ao(t.contractName)), Pe(e);
}
function HE(t) {
  const e = Ln(t, de) ? t : new de(t), n = e.readUInt8Enum(xn, (i) => {
    throw new bn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === xn.Origin)
    return { type: rt.Principal, prefix: n };
  const r = oo(e);
  if (n === xn.Standard)
    return { type: rt.Principal, prefix: n, address: r };
  const s = Wn(e);
  return {
    type: rt.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function ao(t) {
  const e = [], n = gi(t.content), r = n.byteLength;
  return e.push(Zt(oa(r, t.lengthPrefixBytes))), e.push(n), Pe(e);
}
function Wn(t, e, n) {
  e = e || 1;
  const r = Ln(t, de) ? t : new de(t), s = Hc(bt(r.readBytes(e))), i = aa(r.readBytes(s));
  return cr(i, e, n ?? 128);
}
function OE(t) {
  const e = [], n = gi(t.content), r = dA(bt(n), bc * 2);
  return e.push(Zt(r)), Pe(e);
}
function jg(t) {
  const e = Ln(t, de) ? t : new de(t);
  let n = aa(e.readBytes(bc));
  return n = n.replace(/\u0000*$/, ""), { type: rt.MemoString, content: n };
}
function Rg(t) {
  const e = [];
  return e.push(da(t.address)), e.push(ao(t.contractName)), e.push(ao(t.assetName)), Pe(e);
}
function xu(t) {
  const e = Ln(t, de) ? t : new de(t);
  return {
    type: rt.Asset,
    address: oo(e),
    contractName: Wn(e),
    assetName: Wn(e)
  };
}
function Bf(t) {
  const e = t.values, n = [];
  n.push(Zt(oa(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ur(r));
  return Pe(n);
}
function zg(t, e, n) {
  const r = Ln(t, de) ? t : new de(t), s = Hc(bt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case rt.Address:
        i.push(oo(r));
        break;
      case rt.LengthPrefixedString:
        i.push(Wn(r));
        break;
      case rt.MemoString:
        i.push(jg(r));
        break;
      case rt.Asset:
        i.push(xu(r));
        break;
      case rt.PostCondition:
        i.push(FE(r));
        break;
      case rt.PublicKey:
        i.push(Au(r));
        break;
      case rt.TransactionAuthField:
        i.push(RE(r));
        break;
    }
  return Tf(i, n);
}
function DE(t) {
  return bt(Gg(t));
}
function Gg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Fg(t.principal)), (t.conditionType === we.Fungible || t.conditionType === we.NonFungible) && e.push(Rg(t.asset)), t.conditionType === we.NonFungible && e.push(Sr(t.assetName)), e.push(t.conditionCode), t.conditionType === we.STX || t.conditionType === we.Fungible || t.conditionType === we.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new zi("The post-condition amount may not be larger than 8 bytes");
    e.push(Cs(t.amount, 8));
  }
  return Pe(e);
}
function FE(t) {
  const e = Ln(t, de) ? t : new de(t), n = e.readUInt8Enum(we, (a) => {
    throw new bn(`Could not read ${a} as PostConditionType`);
  }), r = HE(e);
  let s, i, o;
  switch (n) {
    case we.STX:
      return s = e.readUInt8Enum(Ko, (c) => {
        throw new bn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: we.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case we.Fungible:
      return i = xu(e), s = e.readUInt8Enum(Ko, (c) => {
        throw new bn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: we.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case we.NonFungible:
      i = xu(e);
      const a = br(e);
      return s = e.readUInt8Enum(pu, (c) => {
        throw new bn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: rt.PostCondition,
        conditionType: we.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case we.Staking:
      return s = e.readUInt8Enum(Ko, (c) => {
        throw new bn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: we.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case we.PoX: {
      const c = e.readUInt8Enum(gu, (u) => {
        throw new bn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: rt.PostCondition,
        conditionType: we.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Kg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case se.TokenTransfer:
      e.push(Sr(t.recipient)), e.push(Cs(t.amount, 8)), e.push(Ur(t.memo));
      break;
    case se.ContractCall:
      e.push(Ur(t.contractAddress)), e.push(Ur(t.contractName)), e.push(Ur(t.functionName));
      const n = new Uint8Array(4);
      Qs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Sr(r));
      });
      break;
    case se.SmartContract:
      e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case se.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case se.PoisonMicroblock:
      break;
    case se.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case se.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Sr(t.recipient));
      break;
    case se.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Sr(t.recipient ? Dg(t.recipient) : Og())), e.push(t.vrfProof);
      break;
    case se.TenureChange:
      e.push(Zt(t.tenureHash)), e.push(Zt(t.previousTenureHash)), e.push(Zt(t.burnViewHash)), e.push(Zt(t.previousTenureEnd)), e.push(Qs(new Uint8Array(4), t.previousTenureBlocks)), e.push(Hb(new Uint8Array(1), t.cause)), e.push(Zt(t.publicKeyHash));
      break;
  }
  return Pe(e);
}
function jE(t) {
  const e = Ln(t, de) ? t : new de(t);
  switch (e.readUInt8Enum(se, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case se.TokenTransfer:
      const r = br(e), s = fn(e.readBytes(8)), i = jg(e);
      return LE(r, s, i);
    case se.ContractCall:
      const o = oo(e), a = Wn(e), c = Wn(e), u = [], d = e.readUInt32BE();
      for (let H = 0; H < d; H++) {
        const P = br(e);
        u.push(P);
      }
      return CE(o, a, c, u);
    case se.SmartContract:
      const l = Wn(e), g = Wn(e, 4, 1e5);
      return bh(l, g);
    case se.VersionedSmartContract: {
      const H = e.readUInt8Enum(hu, (it) => {
        throw new Error(`Cannot recognize ClarityVersion: ${it}`);
      }), P = Wn(e), tt = Wn(e, 4, IS);
      return bh(P, tt, H);
    }
    case se.PoisonMicroblock:
      return BE();
    case se.Coinbase: {
      const H = e.readBytes(Ys);
      return mh(H);
    }
    case se.CoinbaseToAltRecipient: {
      const H = e.readBytes(Ys), P = br(e);
      return mh(H, P);
    }
    case se.NakamotoCoinbase: {
      const H = e.readBytes(Ys), P = br(e), tt = e.readBytes(du);
      return ME(H, P, tt);
    }
    case se.TenureChange:
      const p = bt(e.readBytes(20)), x = bt(e.readBytes(20)), E = bt(e.readBytes(20)), L = bt(e.readBytes(32)), U = e.readUInt32BE(), D = e.readUInt8Enum(yu, (H) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${H}`);
      }), v = bt(e.readBytes(20));
      return PE(p, x, E, L, U, D, v);
  }
}
function Su(t) {
  const e = Ln(t, de) ? t : new de(t);
  return mu(bt(e.readBytes(Wc)));
}
function RE(t) {
  const e = Ln(t, de) ? t : new de(t), n = e.readUInt8Enum(ir, (r) => {
    throw new bn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case ir.PublicKeyCompressed:
      return Gi(Ee.Compressed, Au(e));
    case ir.PublicKeyUncompressed:
      return Gi(Ee.Uncompressed, yo(AA(Au(e).data)));
    case ir.SignatureCompressed:
      return Gi(Ee.Compressed, Su(e));
    case ir.SignatureUncompressed:
      return Gi(Ee.Uncompressed, Su(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Mf(t) {
  return Zt(t.data);
}
function zE(t) {
  const e = [];
  switch (t.contents.type) {
    case rt.PublicKey:
      e.push(t.pubKeyEncoding === Ee.Compressed ? ir.PublicKeyCompressed : ir.PublicKeyUncompressed), e.push(Zt(EA(t.contents.data)));
      break;
    case rt.MessageSignature:
      e.push(t.pubKeyEncoding === Ee.Compressed ? ir.SignatureCompressed : ir.SignatureUncompressed), e.push(Mf(t.contents));
      break;
  }
  return Pe(e);
}
function Eu(t) {
  return t.data.slice();
}
function Au(t) {
  const e = Ln(t, de) ? t : new de(t), n = e.readUInt8(), r = n === 4 ? mS : bS;
  return yo(Pe([n, e.readBytes(r)]));
}
function Pf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ce.P2PKH || e === ce.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ce.P2WPKH || e === ce.P2WSH || e === ce.P2WSHNonSequential) && !r.map((s) => s.data).every(wo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ce.P2PKH:
      return Pa(t, hA(r[0].data));
    case ce.P2WPKH:
      return Pa(t, pA(r[0].data));
    case ce.P2SH:
    case ce.P2SHNonSequential:
      return Pa(t, gA(n, r.map(Eu)));
    case ce.P2WSH:
    case ce.P2WSHNonSequential:
      return Pa(t, yA(n, r.map(Eu)));
  }
}
function Pa(t, e) {
  return { type: rt.Address, version: t, hash160: e };
}
function Nf(t) {
  return mi.c32address(t.version, t.hash160);
}
function xh(t) {
  const [e, n, r] = t.split(/\.|::/);
  return NE(e, n, r);
}
function No(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return _E(e, n);
  } else
    return UE(t);
}
function GE(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return YE(e, n);
  } else
    return KE(t);
}
function KE(t) {
  const e = Bs(t);
  return { type: Vt.PrincipalStandard, value: Nf(e) };
}
function VE(t) {
  return { type: Vt.PrincipalStandard, value: Nf(t) };
}
function YE(t, e) {
  const n = Bs(t), r = cr(e);
  return Vg(n, r);
}
function Vg(t, e) {
  if (gi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Vt.PrincipalContract,
    value: `${Nf(t)}.${e.content}`
  };
}
function qE(t) {
  return { type: Vt.ResponseErr, value: t };
}
function XE(t) {
  return { type: Vt.ResponseOk, value: t };
}
const WE = (t) => ({ type: Vt.StringASCII, value: t }), ZE = (t) => ({ type: Vt.StringUTF8, value: t });
function QE(t) {
  for (const e in t)
    if (!wA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Vt.Tuple, value: t };
}
function br(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new de(Zt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new de(t) : e = t;
  switch (e.readUInt8Enum(Ke, (r) => {
    throw new bn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ke.int:
      return vE(Wl(e.readBytes(16)));
    case Ke.uint:
      return kE(e.readBytes(16));
    case Ke.buffer:
      const r = e.readUInt32BE();
      return EE(e.readBytes(r));
    case Ke.true:
      return xE();
    case Ke.false:
      return SE();
    case Ke.address:
      const s = oo(e);
      return VE(s);
    case Ke.contract:
      const i = oo(e), o = Wn(e);
      return Vg(i, o);
    case Ke.ok:
      return XE(br(e));
    case Ke.err:
      return qE(br(e));
    case Ke.none:
      return Og();
    case Ke.some:
      return Dg(br(e));
    case Ke.list:
      const a = e.readUInt32BE(), c = [];
      for (let E = 0; E < a; E++)
        c.push(br(e));
      return $E(c);
    case Ke.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let E = 0; E < u; E++) {
        const L = Wn(e).content;
        if (L === void 0)
          throw new bn('"content" is undefined');
        d[L] = br(e);
      }
      return QE(d);
    case Ke.ascii:
      const l = e.readUInt32BE(), g = Cb(e.readBytes(l));
      return WE(g);
    case Ke.utf8:
      const p = e.readUInt32BE(), x = aa(e.readBytes(p));
      return ZE(x);
    default:
      throw new bn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function $r(t, e) {
  return Pe([Cf(t), e]);
}
function JE(t) {
  return new Uint8Array([Cf(t.type)]);
}
function tA(t) {
  return t.type === Vt.OptionalNone ? new Uint8Array([Cf(t.type)]) : $r(t.type, Sr(t.value));
}
function eA(t) {
  const e = new Uint8Array(4);
  return Qs(e, Math.ceil(t.value.length / 2), 0), $r(t.type, vr(e, Zt(t.value)));
}
function nA(t) {
  const e = rf(vb(BigInt(t.value), BigInt(wS)), Cg);
  return $r(t.type, e);
}
function rA(t) {
  const e = rf(BigInt(t.value), Cg);
  return $r(t.type, e);
}
function sA(t) {
  return $r(t.type, da(Bs(t.value)));
}
function iA(t) {
  const [e, n] = bA(t.value);
  return $r(t.type, vr(da(Bs(e)), ao(cr(n))));
}
function oA(t) {
  return $r(t.type, Sr(t.value));
}
function aA(t) {
  const e = [], n = new Uint8Array(4);
  Qs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Sr(r);
    e.push(s);
  }
  return $r(t.type, Pe(e));
}
function cA(t) {
  const e = [], n = new Uint8Array(4);
  Qs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = cr(s);
    e.push(ao(i));
    const o = Sr(t.value[s]);
    e.push(o);
  }
  return $r(t.type, Pe(e));
}
function Yg(t, e) {
  const n = [], r = e == "ascii" ? Lb(t.value) : gi(t.value), s = new Uint8Array(4);
  return Qs(s, r.length, 0), n.push(s), n.push(r), $r(t.type, Pe(n));
}
function lA(t) {
  return Yg(t, "ascii");
}
function uA(t) {
  return Yg(t, "utf8");
}
function Sh(t) {
  return bt(Sr(t));
}
function Sr(t) {
  switch (t.type) {
    case Vt.BoolTrue:
    case Vt.BoolFalse:
      return JE(t);
    case Vt.OptionalNone:
    case Vt.OptionalSome:
      return tA(t);
    case Vt.Buffer:
      return eA(t);
    case Vt.UInt:
      return rA(t);
    case Vt.Int:
      return nA(t);
    case Vt.PrincipalStandard:
      return sA(t);
    case Vt.PrincipalContract:
      return iA(t);
    case Vt.ResponseOk:
    case Vt.ResponseErr:
      return oA(t);
    case Vt.List:
      return aA(t);
    case Vt.Tuple:
      return cA(t);
    case Vt.StringASCII:
      return lA(t);
    case Vt.StringUTF8:
      return uA(t);
    default:
      throw new zi("Unable to serialize. Invalid Clarity Value.");
  }
}
const fA = (t) => t.length % 2 ? `0${t}` : t, dA = (t, e) => t.padEnd(e, "0"), qg = (t, e) => t ? gi(t).length > e : !1;
function vu(t) {
  return kg(t);
}
const Wo = (t) => VS($f(t)), _f = (t) => bt(mE(t)), hA = (t) => bt(Wo(t)), pA = (t) => {
  const e = Wo(t), n = vr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Wo(n);
  return bt(r);
}, gA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = Wo(r);
  return bt(s);
}, yA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = $f(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Pe(i), a = Wo(o);
  return bt(a);
};
function wA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function bA(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Le.hmacSha256Sync = (t, ...e) => {
  const n = Pg.create($f, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function yo(t) {
  return t = typeof t == "string" ? Zt(t) : t, {
    type: rt.PublicKey,
    data: t
  };
}
function mA(t, e, n = Ee.Compressed) {
  const r = Pb(e), s = new Dn(Sd(r.r), Sd(r.s)), i = Ot.fromSignature(t, s, r.recoveryId), o = n === Ee.Compressed;
  return i.toHex(o);
}
function xA(t) {
  return typeof t == "string" ? t : bt(t);
}
const Uf = xA;
function Xg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Mb;
}
function wo(t) {
  return !Uf(t).startsWith("04");
}
function SA(t) {
  t = sf(t);
  const e = Xg(t);
  return bt(ca(t.slice(0, 32), e));
}
function EA(t) {
  return Ot.fromHex(Uf(t)).toHex(!0);
}
function AA(t) {
  return Ot.fromHex(Uf(t)).toHex(!1);
}
function vA(t, e) {
  t = sf(t);
  const [n, r] = Dc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return oa(r, 1) + Dn.fromHex(n).toCompactHex();
}
function Hf() {
  return {
    type: rt.MessageSignature,
    data: bt(new Uint8Array(Wc))
  };
}
function Wg(t, e, n, r) {
  const s = Pf(0, t, 1, [yo(e)]).hash160, i = wo(e) ? Ee.Compressed : Ee.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: fn(n),
    fee: fn(r),
    keyEncoding: i,
    signature: Hf()
  };
}
function Zo(t) {
  return "signature" in t;
}
function Eh(t) {
  return t === ce.P2SH || t === ce.P2WSH;
}
function kA(t) {
  return t === ce.P2SHNonSequential || t === ce.P2WSHNonSequential;
}
function Ah(t) {
  const e = vu(t);
  return e.nonce = 0, e.fee = 0, Zo(e) ? e.signature = Hf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function $A(t) {
  const e = [
    t.hashMode,
    Zt(t.signer),
    Cs(t.nonce, 8),
    Cs(t.fee, 8),
    t.keyEncoding,
    Mf(t.signature)
  ];
  return Pe(e);
}
function IA(t) {
  const e = [
    t.hashMode,
    Zt(t.signer),
    Cs(t.nonce, 8),
    Cs(t.fee, 8)
  ], n = Tf(t.fields);
  e.push(Bf(n));
  const r = new Uint8Array(2);
  return _b(r, t.signaturesRequired, 0), e.push(r), Pe(e);
}
function LA(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt(`0x${bt(e.readBytes(8))}`), s = BigInt(`0x${bt(e.readBytes(8))}`), i = e.readUInt8Enum(Ee, (a) => {
    throw new bn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ce.P2WPKH && i != Ee.Compressed)
    throw new bn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Su(e);
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
  const n = bt(e.readBytes(20)), r = BigInt("0x" + bt(e.readBytes(8))), s = BigInt("0x" + bt(e.readBytes(8))), i = zg(e, rt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case rt.PublicKey:
        wo(u.contents.data) || (o = !0);
        break;
      case rt.MessageSignature:
        if (u.pubKeyEncoding === Ee.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new zs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ce.P2WSH || t === ce.P2WSHNonSequential))
    throw new zs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Al(t) {
  return Zo(t) ? $A(t) : IA(t);
}
function vl(t) {
  const e = t.readUInt8Enum(ce, (n) => {
    throw new bn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ce.P2PKH || e === ce.P2WPKH ? LA(e, t) : CA(e, t);
}
function Zg(t, e, n, r) {
  const i = t + bt(new Uint8Array([e])) + bt(Cs(n, 8)) + bt(Cs(r, 8));
  if (Zt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return _f(Zt(i));
}
function Qg(t, e, n) {
  const r = 33 + Wc, s = wo(e.data) ? Ee.Compressed : Ee.Uncompressed, i = t + fA(s.toString(16)) + n, o = Zt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return _f(o);
}
function TA(t, e, n, r, s) {
  const i = Zg(t, e, n, r), o = vA(s, i), a = yo(SA(s)), c = Qg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Jg(t, e, n, r, s, i) {
  const o = Zg(t, e, n, r), a = yo(mA(o, i, s)), c = Qg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function BA() {
  const t = Wg(ce.P2PKH, "", 0, 0);
  return t.signer = IE().hash160, t.keyEncoding = Ee.Compressed, t.signature = Hf(), t;
}
function vh(t, e, n) {
  return Zo(t) ? MA(t, e, n) : PA(t, e, n);
}
function MA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Jg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Pf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new zs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function PA(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case rt.PublicKey:
        wo(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case rt.MessageSignature:
        c.pubKeyEncoding === Ee.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = Jg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Eh(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new zs("Too many signatures");
        break;
    }
  if (Eh(t.hashMode) && o !== t.signaturesRequired || kA(t.hashMode) && o < t.signaturesRequired)
    throw new zs("Incorrect number of signatures");
  if (i && (t.hashMode === ce.P2WSH || t.hashMode === ce.P2WSHNonSequential))
    throw new zs("Uncompressed keys are not allowed in this hash mode");
  const a = Pf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new zs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ty(t) {
  return {
    authType: $e.Standard,
    spendingCondition: t
  };
}
function ey(t, e) {
  return {
    authType: $e.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Wg(ce.P2PKH, "0".repeat(66), 0, 0)
  };
}
function kh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case $e.Standard:
        return ty(Ah(t.spendingCondition));
      case $e.Sponsored:
        return ey(Ah(t.spendingCondition), BA());
      default:
        throw new xc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function NA(t, e) {
  switch (t.authType) {
    case $e.Standard:
      return vh(t.spendingCondition, e, $e.Standard);
    case $e.Sponsored:
      return vh(t.spendingCondition, e, $e.Standard);
    default:
      throw new xc("Invalid origin auth type");
  }
}
function _A(t, e) {
  switch (t.authType) {
    case $e.Standard:
      const n = {
        ...t.spendingCondition,
        fee: fn(e)
      };
      return { ...t, spendingCondition: n };
    case $e.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: fn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function UA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: fn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function HA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: fn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function OA(t, e) {
  const n = {
    ...e,
    nonce: fn(e.nonce),
    fee: fn(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function DA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case $e.Standard:
      e.push(Al(t.spendingCondition));
      break;
    case $e.Sponsored:
      e.push(Al(t.spendingCondition)), e.push(Al(t.sponsorSpendingCondition));
      break;
  }
  return Pe(e);
}
function FA(t) {
  const e = t.readUInt8Enum($e, (r) => {
    throw new bn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case $e.Standard:
      return n = vl(t), ty(n);
    case $e.Sponsored:
      n = vl(t);
      const r = vl(t);
      return ey(n, r);
  }
}
class jA {
  constructor({ auth: e, payload: n, postConditions: r = Tf([]), postConditionMode: s = mc.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = pS(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: fn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = _n.Any;
  }
  signBegin() {
    const e = vu(this);
    return e.auth = kh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = vu(this);
    return e.auth = kh(e.auth), e.txid();
  }
  verifyOrigin() {
    return NA(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, $e.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === $e.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, $e.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : yo(e), r = this.auth.spendingCondition;
    if (r && !Zo(r)) {
      const s = wo(n.data);
      r.fields.push(Gi(s ? Ee.Compressed : Ee.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = TA(n, r, e.fee, e.nonce, s);
    if (Zo(e))
      e.signature = mu(i);
    else {
      const a = Xg(s);
      e.fields.push(Gi(a ? Ee.Compressed : Ee.Uncompressed, mu(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return _f(e);
  }
  setSponsor(e) {
    if (this.auth.authType != $e.Sponsored)
      throw new xc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = OA(this.auth, e);
  }
  setFee(e) {
    this.auth = _A(this.auth, e);
  }
  setNonce(e) {
    this.auth = UA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != $e.Sponsored)
      throw new xc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = HA(this.auth, e);
  }
  serialize() {
    return bt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new zi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new zi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new zi('"auth" is undefined');
    if (this.payload === void 0)
      throw new zi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Qs(n, this.chainId, 0), e.push(n), e.push(DA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Bf(this.postConditions)), e.push(Kg(this.payload)), Pe(e);
  }
}
function RA(t) {
  const e = Ln(t, de) ? t : new de(t), n = e.readUInt8Enum(ai, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = FA(e), i = e.readUInt8Enum(_n, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(mc, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = zg(e, rt.PostCondition), c = jE(e), u = new jA({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const $h = BigInt("18446744073709551615");
function kl(t) {
  const e = fn(t);
  if (e < 0n || e > $h)
    throw new RangeError(`Post-condition amount must be between 0 and ${$h} (u64 max), received: ${e}`);
  return e;
}
var ku;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(ku || (ku = {}));
var $u;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})($u || ($u = {}));
function zA(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: we.STX,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: xn.Origin } : No(t.address),
        conditionCode: Na(t.condition),
        amount: kl(t.amount)
      };
    case "ft-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: we.Fungible,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: xn.Origin } : No(t.address),
        conditionCode: Na(t.condition),
        amount: kl(t.amount),
        asset: xh(t.asset)
      };
    case "nft-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: we.NonFungible,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: xn.Origin } : No(t.address),
        conditionCode: Na(t.condition),
        asset: xh(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: we.Staking,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: xn.Origin } : No(t.address),
        conditionCode: Na(t.condition),
        amount: kl(t.amount)
      };
    case "pox-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: we.PoX,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: xn.Origin } : No(t.address),
        conditionCode: GA(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Na(t) {
  return ku[t];
}
function GA(t) {
  return $u[t];
}
function ny(t) {
  const e = zA(t);
  return DE(e);
}
function KA(t, e, n) {
  return Df(ry(t), n);
}
function ry(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Qo(r);
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
    return BigInt(`0x${qA(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Of(t, e = 8) {
  return (typeof t == "bigint" ? t : ry(t)).toString(16).padStart(e * 2, "0");
}
function Df(t, e = 16) {
  const n = Of(t, e);
  return Qo(n);
}
function VA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const YA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function qA(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += YA[n];
  return e;
}
function Qo(t) {
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
function Ff(t) {
  return new TextEncoder().encode(t);
}
function XA(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function WA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ih(t) {
  if (t.some(WA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function jf(...t) {
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
function Gr(t) {
  return jf(...t.map((e) => typeof e == "number" ? Ih([e]) : e instanceof Array ? Ih(e) : e));
}
function Jc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Iu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Iu || (Iu = {}));
Iu.Mainnet;
const ZA = 128, QA = 128, sy = 16;
var Lu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Lu || (Lu = {}));
var Lh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Lh || (Lh = {}));
var Ch;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ch || (Ch = {}));
var rr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(rr || (rr = {}));
const $l = ["onChainOnly", "offChainOnly", "any"];
$l[0] + "", rr.OnChainOnly, $l[1] + "", rr.OffChainOnly, $l[2] + "", rr.Any, rr.OnChainOnly + "", rr.OnChainOnly, rr.OffChainOnly + "", rr.OffChainOnly, rr.Any + "", rr.Any;
var Cu;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Cu || (Cu = {}));
Cu.Mainnet;
var Th;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Th || (Th = {}));
var Ds;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ds || (Ds = {}));
var Bh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Bh || (Bh = {}));
var Mh;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Mh || (Mh = {}));
var Ph;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ph || (Ph = {}));
var Nh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Nh || (Nh = {}));
var _h;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(_h || (_h = {}));
var Uh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Uh || (Uh = {}));
var Tu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Tu || (Tu = {}));
var Hh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Hh || (Hh = {}));
var Oh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Oh || (Oh = {}));
function Bu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function JA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function iy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function t3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bu(t.outputLen), Bu(t.blockLen);
}
function e3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function n3(t, e) {
  iy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Il = {
  number: Bu,
  bool: JA,
  bytes: iy,
  hash: t3,
  exists: e3,
  output: n3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ll = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, r3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!r3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function s3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function oy(t) {
  if (typeof t == "string" && (t = s3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let i3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Si(t) {
  const e = (r) => t().update(oy(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function o3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Rf = class extends i3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ll(this.buffer);
  }
  update(e) {
    Il.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = oy(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ll(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Il.exists(this), Il.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    o3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ll(e), c = this.outputLen;
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
const a3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ay = Uint8Array.from({ length: 16 }, (t, e) => e), c3 = ay.map((t) => (9 * t + 5) % 16);
let zf = [ay], Gf = [c3];
for (let t = 0; t < 4; t++)
  for (let e of [zf, Gf])
    e.push(e[t].map((n) => a3[n]));
const cy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), l3 = zf.map((t, e) => t.map((n) => cy[e][n])), u3 = Gf.map((t, e) => t.map((n) => cy[e][n])), f3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), d3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), _a = (t, e) => t << e | t >>> 32 - e;
function Dh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ua = new Uint32Array(16);
let h3 = class extends Rf {
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
    for (let p = 0; p < 16; p++, n += 4)
      Ua[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = f3[p], L = d3[p], U = zf[p], D = Gf[p], v = l3[p], H = u3[p];
      for (let P = 0; P < 16; P++) {
        const tt = _a(r + Dh(p, i, a, u) + Ua[U[P]] + E, v[P]) + l | 0;
        r = l, l = u, u = _a(a, 10) | 0, a = i, i = tt;
      }
      for (let P = 0; P < 16; P++) {
        const tt = _a(s + Dh(x, o, c, d) + Ua[D[P]] + L, H[P]) + g | 0;
        s = g, g = d, d = _a(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ua.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Si(() => new h3());
const p3 = (t, e, n) => t & e ^ ~t & n, g3 = (t, e, n) => t & e ^ t & n ^ e & n, y3 = new Uint32Array([
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
]), us = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fs = new Uint32Array(64);
let ly = class extends Rf {
  constructor() {
    super(64, 32, 8, !1), this.A = us[0] | 0, this.B = us[1] | 0, this.C = us[2] | 0, this.D = us[3] | 0, this.E = us[4] | 0, this.F = us[5] | 0, this.G = us[6] | 0, this.H = us[7] | 0;
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
      fs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = fs[l - 15], p = fs[l - 2], x = pr(g, 7) ^ pr(g, 18) ^ g >>> 3, E = pr(p, 17) ^ pr(p, 19) ^ p >>> 10;
      fs[l] = E + fs[l - 7] + x + fs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), p = d + g + p3(a, c, u) + y3[l] + fs[l] | 0, E = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + g3(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    fs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, w3 = class extends ly {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Si(() => new ly());
Si(() => new w3());
const Ha = BigInt(2 ** 32 - 1), Mu = BigInt(32);
function uy(t, e = !1) {
  return e ? { h: Number(t & Ha), l: Number(t >> Mu & Ha) } : { h: Number(t >> Mu & Ha) | 0, l: Number(t & Ha) | 0 };
}
function b3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = uy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const m3 = (t, e) => BigInt(t >>> 0) << Mu | BigInt(e >>> 0), x3 = (t, e, n) => t >>> n, S3 = (t, e, n) => t << 32 - n | e >>> n, E3 = (t, e, n) => t >>> n | e << 32 - n, A3 = (t, e, n) => t << 32 - n | e >>> n, v3 = (t, e, n) => t << 64 - n | e >>> n - 32, k3 = (t, e, n) => t >>> n - 32 | e << 64 - n, $3 = (t, e) => e, I3 = (t, e) => t, L3 = (t, e, n) => t << n | e >>> 32 - n, C3 = (t, e, n) => e << n | t >>> 32 - n, T3 = (t, e, n) => e << n - 32 | t >>> 64 - n, B3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function M3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const P3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), N3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, _3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), U3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, H3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), O3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: uy,
  split: b3,
  toBig: m3,
  shrSH: x3,
  shrSL: S3,
  rotrSH: E3,
  rotrSL: A3,
  rotrBH: v3,
  rotrBL: k3,
  rotr32H: $3,
  rotr32L: I3,
  rotlSH: L3,
  rotlSL: C3,
  rotlBH: T3,
  rotlBL: B3,
  add: M3,
  add3L: P3,
  add3H: N3,
  add4L: _3,
  add4H: U3,
  add5H: O3,
  add5L: H3
}, [D3, F3] = Nt.split([
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
].map((t) => BigInt(t))), ds = new Uint32Array(80), hs = new Uint32Array(80);
let tl = class extends Rf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: x, Hh: E, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      ds[v] = e.getUint32(n), hs[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const H = ds[v - 15] | 0, P = hs[v - 15] | 0, tt = Nt.rotrSH(H, P, 1) ^ Nt.rotrSH(H, P, 8) ^ Nt.shrSH(H, P, 7), it = Nt.rotrSL(H, P, 1) ^ Nt.rotrSL(H, P, 8) ^ Nt.shrSL(H, P, 7), et = ds[v - 2] | 0, X = hs[v - 2] | 0, k = Nt.rotrSH(et, X, 19) ^ Nt.rotrBH(et, X, 61) ^ Nt.shrSH(et, X, 6), B = Nt.rotrSL(et, X, 19) ^ Nt.rotrBL(et, X, 61) ^ Nt.shrSL(et, X, 6), b = Nt.add4L(it, B, hs[v - 7], hs[v - 16]), C = Nt.add4H(b, tt, k, ds[v - 7], ds[v - 16]);
      ds[v] = C | 0, hs[v] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: x, Gh: E, Gl: L, Hh: U, Hl: D } = this;
    for (let v = 0; v < 80; v++) {
      const H = Nt.rotrSH(l, g, 14) ^ Nt.rotrSH(l, g, 18) ^ Nt.rotrBH(l, g, 41), P = Nt.rotrSL(l, g, 14) ^ Nt.rotrSL(l, g, 18) ^ Nt.rotrBL(l, g, 41), tt = l & p ^ ~l & E, it = g & x ^ ~g & L, et = Nt.add5L(D, P, it, F3[v], hs[v]), X = Nt.add5H(et, U, H, tt, D3[v], ds[v]), k = et | 0, B = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), b = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), C = r & i ^ r & a ^ i & a, z = s & o ^ s & c ^ o & c;
      U = E | 0, D = L | 0, E = p | 0, L = x | 0, p = l | 0, x = g | 0, { h: l, l: g } = Nt.add(u | 0, d | 0, X | 0, k | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Nt.add3L(k, b, z);
      r = Nt.add3H(T, X, B, C), s = T | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Nt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Nt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: x } = Nt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: L } = Nt.add(this.Gh | 0, this.Gl | 0, E | 0, L | 0), { h: U, l: D } = Nt.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, d, l, g, p, x, E, L, U, D);
  }
  roundClean() {
    ds.fill(0), hs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, j3 = class extends tl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, R3 = class extends tl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, z3 = class extends tl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Si(() => new tl());
Si(() => new j3());
Si(() => new R3());
Si(() => new z3());
function G3(t, e, n) {
  const s = ZA;
  if (ov(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Lu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var qe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(qe || (qe = {}));
let K3 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, fy = class extends K3 {
  constructor(e) {
    super(e);
  }
};
function el(t) {
  const e = [];
  return e.push(Qo(Of(t.version, 1))), e.push(Qo(t.hash160)), Gr(e);
}
function V3(t) {
  const e = [];
  return e.push(t.prefix), e.push(el(t.address)), t.prefix === Tu.Contract && e.push(Jo(t.contractName)), Gr(e);
}
function Jo(t) {
  const e = [], n = Ff(t.content), r = n.byteLength;
  return e.push(Qo(Of(r, t.lengthPrefixBytes))), e.push(n), Gr(e);
}
function Y3(t) {
  const e = [];
  return e.push(el(t.address)), e.push(Jo(t.contractName)), e.push(Jo(t.assetName)), Gr(e);
}
function dy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(V3(t.principal)), (t.conditionType === Ds.Fungible || t.conditionType === Ds.NonFungible) && e.push(Y3(t.assetInfo)), t.conditionType === Ds.NonFungible && e.push(li(t.assetName)), e.push(t.conditionCode), t.conditionType === Ds.STX || t.conditionType === Ds.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new fy("The post-condition amount may not be larger than 8 bytes");
    e.push(KA(t.amount, !1, 8));
  }
  return Gr(e);
}
function Ir(t, e) {
  return Gr([t, e]);
}
function q3(t) {
  return new Uint8Array([t.type]);
}
function X3(t) {
  return t.type === qe.OptionalNone ? new Uint8Array([t.type]) : Ir(t.type, li(t.value));
}
function W3(t) {
  const e = new Uint8Array(4);
  return Jc(e, t.buffer.length, 0), Ir(t.type, jf(e, t.buffer));
}
function Z3(t) {
  const e = Df(VA(t.value, BigInt(QA)), sy);
  return Ir(t.type, e);
}
function Q3(t) {
  const e = Df(t.value, sy);
  return Ir(t.type, e);
}
function J3(t) {
  return Ir(t.type, el(t.address));
}
function tv(t) {
  return Ir(t.type, jf(el(t.address), Jo(t.contractName)));
}
function ev(t) {
  return Ir(t.type, li(t.value));
}
function nv(t) {
  const e = [], n = new Uint8Array(4);
  Jc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = li(r);
    e.push(s);
  }
  return Ir(t.type, Gr(e));
}
function rv(t) {
  const e = [], n = new Uint8Array(4);
  Jc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = G3(s);
    e.push(Jo(i));
    const o = li(t.data[s]);
    e.push(o);
  }
  return Ir(t.type, Gr(e));
}
function hy(t, e) {
  const n = [], r = e == "ascii" ? XA(t.data) : Ff(t.data), s = new Uint8Array(4);
  return Jc(s, r.length, 0), n.push(s), n.push(r), Ir(t.type, Gr(n));
}
function sv(t) {
  return hy(t, "ascii");
}
function iv(t) {
  return hy(t, "utf8");
}
function li(t) {
  switch (t.type) {
    case qe.BoolTrue:
    case qe.BoolFalse:
      return q3(t);
    case qe.OptionalNone:
    case qe.OptionalSome:
      return X3(t);
    case qe.Buffer:
      return W3(t);
    case qe.UInt:
      return Q3(t);
    case qe.Int:
      return Z3(t);
    case qe.PrincipalStandard:
      return J3(t);
    case qe.PrincipalContract:
      return tv(t);
    case qe.ResponseOk:
    case qe.ResponseErr:
      return ev(t);
    case qe.List:
      return nv(t);
    case qe.Tuple:
      return rv(t);
    case qe.StringASCII:
      return sv(t);
    case qe.StringUTF8:
      return iv(t);
    default:
      throw new fy("Unable to serialize. Invalid Clarity Value.");
  }
}
const ov = (t, e) => t ? Ff(t).length > e : !1, av = "connect-ui";
let tc, py, Un = !1, Pu = !1;
const zr = (t, e = "") => () => {
}, cv = (t, e) => () => {
}, lv = "{visibility:hidden}.hydrated{visibility:inherit}", Fh = {}, uv = "http://www.w3.org/2000/svg", fv = "http://www.w3.org/1999/xhtml", dv = (t) => t != null, Kf = (t) => (t = typeof t, t === "object" || t === "function");
function gy(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Ct = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Kf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Nu(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Nu(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Nu = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, hv = {}, pv = (t) => t && t.$tag$ === hv, gv = (t, e) => t != null && !Kf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, yv = (t) => bo(t).$hostElement$, wv = (t, e, n) => {
  const r = un.ce(e, n);
  return t.dispatchEvent(r), r;
}, jh = /* @__PURE__ */ new WeakMap(), bv = (t, e, n) => {
  let r = Sc.get(t);
  Ov && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Sc.set(t, r);
}, mv = (t, e, n, r) => {
  var s;
  let i = yy(e);
  const o = Sc.get(i);
  if (t = t.nodeType === 11 ? t : Er, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = jh.get(t), c;
      if (a || jh.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Er.createElement("style"), c.innerHTML = o;
          const u = (s = un.$nonce$) !== null && s !== void 0 ? s : gy(Er);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, xv = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = zr("attachStyles", e.$tagName$), i = mv(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, yy = (t, e) => "sc-" + t.$tagName$, Rh = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Gh(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = zh(n), d = zh(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Gh(nl, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && un.rel(t, e, n, !1), r && un.ael(t, e, r, !1);
    else {
      const c = Kf(r);
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
}, Sv = /\s/, zh = (t) => t ? t.split(Sv) : [], wy = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Fh, o = e.$attrs$ || Fh;
  for (r in i)
    r in o || Rh(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Rh(s, r, i[r], o[r], n, e.$flags$);
}, Vf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Er.createTextNode(s.$text$);
  else {
    if (Un || (Un = s.$tag$ === "svg"), o = s.$elm$ = Er.createElementNS(Un ? uv : fv, s.$tag$), Un && s.$tag$ === "foreignObject" && (Un = !1), wy(null, s, Un), dv(tc) && o["s-si"] !== tc && o.classList.add(o["s-si"] = tc), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Vf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Un = !1 : o.tagName === "foreignObject" && (Un = !0);
  }
  return o;
}, by = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === py && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Vf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, my = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, Ev = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : Oa(a, d) ? (Fo(a, d), a = e[++s], d = r[++i]) : Oa(c, l) ? (Fo(c, l), c = e[--o], l = r[--u]) : Oa(a, l) ? (Fo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Oa(c, d) ? (Fo(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = Vf(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? by(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && my(e, s, o);
}, Oa = (t, e) => t.$tag$ === e.$tag$, Fo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Un = i === "svg" ? !0 : i === "foreignObject" ? !1 : Un, wy(t, e, Un), r !== null && s !== null ? Ev(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), by(n, null, e, s, 0, s.length - 1)) : r !== null && my(r, 0, r.length - 1), Un && i === "svg" && (Un = !1)) : t.$text$ !== o && (n.data = o);
}, Av = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Nu(null, null), s = pv(e) ? e : Ct(null, null, e);
  py = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, tc = n["s-sc"], Fo(r, s);
}, xy = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Yf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return xy(t, t.$ancestorComponent$), Fv(() => vv(t, e));
}, vv = (t, e) => {
  const n = zr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), Lv(s, () => kv(t, r, e));
}, kv = async (t, e, n) => {
  const r = t.$hostElement$, s = zr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && xv(t);
  const o = zr("render", t.$cmpMeta$.$tagName$);
  $v(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => Iv(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, $v = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, Av(t, e);
  } catch (r) {
    ta(r, t.$hostElement$);
  }
  return null;
}, Iv = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = zr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Ey(n), r(), t.$onReadyResolve$(n), s || Sy()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Xf(() => Yf(t, !1)), t.$flags$ &= -517;
}, Sy = (t) => {
  Ey(Er.documentElement), Xf(() => wv(nl, "appload", { detail: { namespace: av } }));
}, Lv = (t, e) => t && t.then ? t.then(e) : e(), Ey = (t) => t.classList.add("hydrated"), Cv = (t, e) => bo(t).$instanceValues$.get(e), Tv = (t, e, n, r) => {
  const s = bo(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = gv(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Yf(s, !1));
}, Ay = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return Cv(this, i);
        },
        set(a) {
          Tv(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        un.jmp(() => {
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
}, Bv = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = Hv(n), s.then) {
        const c = cv();
        s = await s, c();
      }
      s.isProxied || (Ay(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = zr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        ta(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = yy(n);
      if (!Sc.has(c)) {
        const u = zr("registerStyles", n.$tagName$);
        bv(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Yf(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, Mv = (t) => {
  if (!(un.$flags$ & 1)) {
    const e = bo(t), n = e.$cmpMeta$, r = zr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            xy(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), Bv(t, e, n);
    }
    r();
  }
}, Pv = (t) => {
  un.$flags$ & 1 || bo(t);
}, Nv = (t, e = {}) => {
  var n;
  const r = zr(), s = [], i = e.exclude || [], o = nl.customElements, a = Er.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Er.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(un, e), un.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Er.baseURI).href, t.map((p) => {
    p[1].map((x) => {
      const E = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      E.$members$ = x[2];
      const L = E.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(D) {
          super(D), D = this, Uv(D, E), E.$flags$ & 1 && D.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : un.jmp(() => Mv(this));
        }
        disconnectedCallback() {
          un.jmp(() => Pv(this));
        }
        componentOnReady() {
          return bo(this).$onReadyPromise$;
        }
      };
      E.$lazyBundleId$ = p[0], !i.includes(L) && !o.get(L) && (s.push(L), o.define(L, Ay(
        U,
        E,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + lv, u.setAttribute("data-styles", "");
    const p = (n = un.$nonce$) !== null && n !== void 0 ? n : gy(Er);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((p) => p.connectedCallback()) : un.jmp(() => l = setTimeout(Sy, 30)), r();
}, qf = /* @__PURE__ */ new WeakMap(), bo = (t) => qf.get(t), _v = (t, e) => qf.set(e.$lazyInstance$ = t, e), Uv = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], qf.set(t, n);
}, Gh = (t, e) => e in t, ta = (t, e) => (0, console.error)(t, e), Cl = /* @__PURE__ */ new Map(), Hv = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Cl.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Cl.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => O$).then(o, ta);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Cl.set(s, o), o[r]), ta);
}, Sc = /* @__PURE__ */ new Map(), nl = typeof window < "u" ? window : {}, Er = nl.document || { head: {} }, un = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, vy = (t) => Promise.resolve(t), Ov = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Kh = [], ky = [], Dv = (t, e) => (n) => {
  t.push(n), Pu || (Pu = !0, un.$flags$ & 4 ? Xf(_u) : un.raf(_u));
}, Vh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      ta(n);
    }
  t.length = 0;
}, _u = () => {
  Vh(Kh), Vh(ky), (Pu = Kh.length > 0) && un.raf(_u);
}, Xf = (t) => vy().then(t), Fv = /* @__PURE__ */ Dv(ky), jv = () => vy(), Rv = (t, e) => typeof window > "u" ? Promise.resolve() : jv().then(() => Nv([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var zv = Object.defineProperty, Gv = Object.defineProperties, Kv = Object.getOwnPropertyDescriptors, Ec = Object.getOwnPropertySymbols, $y = Object.prototype.hasOwnProperty, Iy = Object.prototype.propertyIsEnumerable, Yh = (t, e, n) => e in t ? zv(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, jn = (t, e) => {
  for (var n in e || (e = {})) $y.call(e, n) && Yh(t, n, e[n]);
  if (Ec) for (var n of Ec(e)) Iy.call(e, n) && Yh(t, n, e[n]);
  return t;
}, lr = (t, e) => Gv(t, Kv(e)), Ly = (t, e) => {
  var n = {};
  for (var r in t) $y.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ec) for (var r of Ec(t)) e.indexOf(r) < 0 && Iy.call(t, r) && (n[r] = t[r]);
  return n;
};
function Cy() {
  return Xc(ri()) || window.StacksProvider || window.BlockstackProvider;
}
function rl(t) {
  return t ? typeof t == "string" ? ii.fromName(t) : "version" in t ? t : "url" in t ? new lu({ url: t.url }) : t.transactionVersion === ai.Mainnet ? new lu({ url: t.client.baseUrl }) : new uu({ url: t.client.baseUrl }) : new uu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Vv = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Vv || {}), Yv = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Yv || {}), Wf = (t) => {
  let e = t;
  if (!e) {
    let n = new op(["store_write"], document.location.href);
    e = new cu({ appConfig: n });
  }
  return e;
};
function Ty(t) {
  try {
    return Wf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var By = (t) => {
  let e = Wf(t).loadUserData().appPrivateKey, n = sn.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function qv(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [oi.Mainnet]: "mainnet", [oi.Testnet]: "testnet" }, a = rl(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function Xv(t) {
  let e = rl(t.network), n = Wf(t.userSession), r = lr(jn({}, t), { network: e, userSession: n });
  return jn({ stxAddress: qv(r) }, r);
}
async function Wv(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(ny) : n = n.map((r) => bt(dy(r)))), new sn.TokenSigner("ES256k", e).signAsync(lr(jn({}, t), { postConditions: n }));
}
function Zv(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(ny) : e = e.map((n) => bt(dy(n)))), sn.createUnsecuredToken(lr(jn({}, t), { postConditions: e }));
}
var Qv = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Zt(a.replace(/^0x/, "")), u = RA(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, lr(jn({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, lr(jn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, Jv = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Ly(e, ["amount", "appDetails", "userSession"]);
  if (Ty(s)) {
    let { privateKey: a, publicKey: c } = By(s), u = lr(jn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), Wv(u, a);
  }
  let o = lr(jn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), Zv(o);
};
async function t4(t, e, n) {
  let r = await e(lr(jn(jn({}, Xv(t)), t), { network: rl(t.network) }));
  return Qv({ token: r, options: t }, n);
}
function e4(t, e = Cy()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return t4(t, Jv, e);
}
function My(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? lr(jn({}, t), { message: Sh(e), domain: Sh(n) }) : lr(jn({}, t), { message: bt(li(e)), domain: bt(li(n)) });
}
async function n4(t, e) {
  return new sn.TokenSigner("ES256k", e).signAsync(My(t));
}
async function r4(t) {
  let e = t, { userSession: n } = e, r = Ly(e, ["userSession"]);
  if (Ty(n)) {
    let { privateKey: s, publicKey: i } = By(n), o = lr(jn({}, r), { publicKey: i });
    return n4(o, s);
  }
  return sn.createUnsecuredToken(My(t));
}
var s4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(s4 || {}), Py = "asigna-stx", qh = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Py && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(o4(t, e), "*");
}), i4 = { authenticationRequest: async (t) => qh(t, "authenticationRequest"), transactionRequest: async (t) => qh(t, "transactionRequest") }, o4 = (t, e) => ({ source: Py, [e]: t }), a4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = i4);
};
a4();
var c4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function l4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = ri(), o = Cy();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    Rv();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : c4, c = tS(a), u = document.createElement("connect-modal");
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
var Da = l4(e4);
function Ts(t, e, n) {
  return Zf(An(t, e), n);
}
function An(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = me(r);
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
      const r = d4(BigInt(`0x${jt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${jt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Xh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ha(t, e = 8) {
  return (typeof t == "bigint" ? t : An(t, !1)).toString(16).padStart(e * 2, "0");
}
function sl(t) {
  return parseInt(t, 16);
}
function Zf(t, e = 16) {
  const n = ha(t, e);
  return me(n);
}
function u4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function f4(t, e) {
  return t & BigInt(1) << e;
}
function d4(t, e) {
  return f4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const h4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += h4[n];
  return e;
}
function me(t) {
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
function mo(t) {
  return new TextEncoder().encode(t);
}
function Qf(t) {
  return new TextDecoder().decode(t);
}
function Ny(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function p4(t) {
  return String.fromCharCode.apply(null, t);
}
function g4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Wh(t) {
  if (t.some(g4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function il(...t) {
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
function Ne(t) {
  return il(...t.map((e) => typeof e == "number" ? Wh([e]) : e instanceof Array ? Wh(e) : e));
}
var Zh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Zh || (Zh = {}));
var Qh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Qh || (Qh = {}));
var Jh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Jh || (Jh = {}));
const _y = 33, Tl = 32;
function y4(t) {
  if (t.length < Tl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Tl * 2), r = t.slice(2 + Tl * 2);
  return {
    recoveryId: sl(e),
    r: n,
    s: r
  };
}
function w4(t) {
  const e = typeof t == "string" ? me(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function b4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function m4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function x4(t, e) {
  return t[e];
}
function S4(t, e, n = 0) {
  return t[n] = e, t;
}
function E4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ui(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Uu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Uu || (Uu = {}));
const A4 = Uu.Mainnet, v4 = 128, k4 = 128, Uy = 16, qs = 32, Hu = 80, ol = 65, $4 = 32, I4 = 64, Ac = 34;
var ht;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ht || (ht = {}));
var Ht;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ht || (Ht = {}));
var Ou;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ou || (Ou = {}));
var $n;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})($n || ($n = {}));
const ec = ["onChainOnly", "offChainOnly", "any"], t0 = {
  [ec[0]]: $n.OnChainOnly,
  [ec[1]]: $n.OffChainOnly,
  [ec[2]]: $n.Any,
  [$n.OnChainOnly]: $n.OnChainOnly,
  [$n.OffChainOnly]: $n.OffChainOnly,
  [$n.Any]: $n.Any
};
function L4(t) {
  if (t in t0)
    return t0[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${ec.join(", ")}`);
}
var vc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(vc || (vc = {}));
vc.Mainnet;
var co;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(co || (co = {}));
var In;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(In || (In = {}));
var Ie;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ie || (Ie = {}));
var le;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(le || (le = {}));
var kc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(kc || (kc = {}));
var Ae;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ae || (Ae = {}));
var ea;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ea || (ea = {}));
var Du;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Du || (Du = {}));
var na;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(na || (na = {}));
var e0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(e0 || (e0 = {}));
var n0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(n0 || (n0 = {}));
function Fu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function C4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Hy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function T4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Fu(t.outputLen), Fu(t.blockLen);
}
function B4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function M4(t, e) {
  Hy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ks = {
  number: Fu,
  bool: C4,
  bytes: Hy,
  hash: T4,
  exists: B4,
  output: M4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Bl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), gr = (t, e) => t << 32 - e | t >>> e, P4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!P4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function N4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Jf(t) {
  if (typeof t == "string" && (t = N4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Oy {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ei(t) {
  const e = (r) => t().update(Jf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function _4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class td extends Oy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Bl(this.buffer);
  }
  update(e) {
    Ks.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Jf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Bl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ks.exists(this), Ks.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    _4(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Bl(e), c = this.outputLen;
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
const U4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Dy = Uint8Array.from({ length: 16 }, (t, e) => e), H4 = Dy.map((t) => (9 * t + 5) % 16);
let ed = [Dy], nd = [H4];
for (let t = 0; t < 4; t++)
  for (let e of [ed, nd])
    e.push(e[t].map((n) => U4[n]));
const Fy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), O4 = ed.map((t, e) => t.map((n) => Fy[e][n])), D4 = nd.map((t, e) => t.map((n) => Fy[e][n])), F4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), j4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Fa = (t, e) => t << e | t >>> 32 - e;
function r0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ja = new Uint32Array(16);
class R4 extends td {
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
    for (let p = 0; p < 16; p++, n += 4)
      ja[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = F4[p], L = j4[p], U = ed[p], D = nd[p], v = O4[p], H = D4[p];
      for (let P = 0; P < 16; P++) {
        const tt = Fa(r + r0(p, i, a, u) + ja[U[P]] + E, v[P]) + l | 0;
        r = l, l = u, u = Fa(a, 10) | 0, a = i, i = tt;
      }
      for (let P = 0; P < 16; P++) {
        const tt = Fa(s + r0(x, o, c, d) + ja[D[P]] + L, H[P]) + g | 0;
        s = g, g = d, d = Fa(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ja.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const z4 = Ei(() => new R4()), G4 = (t, e, n) => t & e ^ ~t & n, K4 = (t, e, n) => t & e ^ t & n ^ e & n, V4 = new Uint32Array([
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
]), ps = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), gs = new Uint32Array(64);
class jy extends td {
  constructor() {
    super(64, 32, 8, !1), this.A = ps[0] | 0, this.B = ps[1] | 0, this.C = ps[2] | 0, this.D = ps[3] | 0, this.E = ps[4] | 0, this.F = ps[5] | 0, this.G = ps[6] | 0, this.H = ps[7] | 0;
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
      gs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = gs[l - 15], p = gs[l - 2], x = gr(g, 7) ^ gr(g, 18) ^ g >>> 3, E = gr(p, 17) ^ gr(p, 19) ^ p >>> 10;
      gs[l] = E + gs[l - 7] + x + gs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), p = d + g + G4(a, c, u) + V4[l] + gs[l] | 0, E = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + K4(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    gs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Y4 extends jy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const rd = Ei(() => new jy());
Ei(() => new Y4());
const Ra = BigInt(2 ** 32 - 1), ju = BigInt(32);
function Ry(t, e = !1) {
  return e ? { h: Number(t & Ra), l: Number(t >> ju & Ra) } : { h: Number(t >> ju & Ra) | 0, l: Number(t & Ra) | 0 };
}
function q4(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ry(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const X4 = (t, e) => BigInt(t >>> 0) << ju | BigInt(e >>> 0), W4 = (t, e, n) => t >>> n, Z4 = (t, e, n) => t << 32 - n | e >>> n, Q4 = (t, e, n) => t >>> n | e << 32 - n, J4 = (t, e, n) => t << 32 - n | e >>> n, tk = (t, e, n) => t << 64 - n | e >>> n - 32, ek = (t, e, n) => t >>> n - 32 | e << 64 - n, nk = (t, e) => e, rk = (t, e) => t, sk = (t, e, n) => t << n | e >>> 32 - n, ik = (t, e, n) => e << n | t >>> 32 - n, ok = (t, e, n) => e << n - 32 | t >>> 64 - n, ak = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ck(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const lk = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), uk = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, fk = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), dk = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, hk = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), pk = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: Ry,
  split: q4,
  toBig: X4,
  shrSH: W4,
  shrSL: Z4,
  rotrSH: Q4,
  rotrSL: J4,
  rotrBH: tk,
  rotrBL: ek,
  rotr32H: nk,
  rotr32L: rk,
  rotlSH: sk,
  rotlSL: ik,
  rotlBH: ok,
  rotlBL: ak,
  add: ck,
  add3L: lk,
  add3H: uk,
  add4L: fk,
  add4H: dk,
  add5H: pk,
  add5L: hk
}, [gk, yk] = _t.split([
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
].map((t) => BigInt(t))), ys = new Uint32Array(80), ws = new Uint32Array(80);
class al extends td {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: x, Hh: E, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      ys[v] = e.getUint32(n), ws[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const H = ys[v - 15] | 0, P = ws[v - 15] | 0, tt = _t.rotrSH(H, P, 1) ^ _t.rotrSH(H, P, 8) ^ _t.shrSH(H, P, 7), it = _t.rotrSL(H, P, 1) ^ _t.rotrSL(H, P, 8) ^ _t.shrSL(H, P, 7), et = ys[v - 2] | 0, X = ws[v - 2] | 0, k = _t.rotrSH(et, X, 19) ^ _t.rotrBH(et, X, 61) ^ _t.shrSH(et, X, 6), B = _t.rotrSL(et, X, 19) ^ _t.rotrBL(et, X, 61) ^ _t.shrSL(et, X, 6), b = _t.add4L(it, B, ws[v - 7], ws[v - 16]), C = _t.add4H(b, tt, k, ys[v - 7], ys[v - 16]);
      ys[v] = C | 0, ws[v] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: x, Gh: E, Gl: L, Hh: U, Hl: D } = this;
    for (let v = 0; v < 80; v++) {
      const H = _t.rotrSH(l, g, 14) ^ _t.rotrSH(l, g, 18) ^ _t.rotrBH(l, g, 41), P = _t.rotrSL(l, g, 14) ^ _t.rotrSL(l, g, 18) ^ _t.rotrBL(l, g, 41), tt = l & p ^ ~l & E, it = g & x ^ ~g & L, et = _t.add5L(D, P, it, yk[v], ws[v]), X = _t.add5H(et, U, H, tt, gk[v], ys[v]), k = et | 0, B = _t.rotrSH(r, s, 28) ^ _t.rotrBH(r, s, 34) ^ _t.rotrBH(r, s, 39), b = _t.rotrSL(r, s, 28) ^ _t.rotrBL(r, s, 34) ^ _t.rotrBL(r, s, 39), C = r & i ^ r & a ^ i & a, z = s & o ^ s & c ^ o & c;
      U = E | 0, D = L | 0, E = p | 0, L = x | 0, p = l | 0, x = g | 0, { h: l, l: g } = _t.add(u | 0, d | 0, X | 0, k | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = _t.add3L(k, b, z);
      r = _t.add3H(T, X, B, C), s = T | 0;
    }
    ({ h: r, l: s } = _t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = _t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = _t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = _t.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = _t.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: x } = _t.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: L } = _t.add(this.Gh | 0, this.Gl | 0, E | 0, L | 0), { h: U, l: D } = _t.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, d, l, g, p, x, E, L, U, D);
  }
  roundClean() {
    ys.fill(0), ws.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class wk extends al {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class bk extends al {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class mk extends al {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ei(() => new al());
Ei(() => new wk());
const xk = Ei(() => new bk());
Ei(() => new mk());
function zy(t) {
  if (me(t).byteLength != ol)
    throw Error("Invalid signature");
  return {
    type: ht.MessageSignature,
    data: t
  };
}
function jo(t, e) {
  return { type: ht.Address, version: t, hash160: e };
}
function Ki(t) {
  return mi.c32address(t.version, t.hash160);
}
function fi(t, e, n) {
  const r = e || 1, s = n || v4;
  if (ow(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ht.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function sd(t) {
  const e = mi.c32addressDecode(t);
  return {
    type: ht.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Z;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Z || (Z = {}));
function Sk(t) {
  if (t.type === Z.PrincipalStandard)
    return Ki(t.address);
  if (t.type === Z.PrincipalContract)
    return `${Ki(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Gy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return vk(e, n);
  } else
    return Ek(t);
}
function Ek(t) {
  const e = sd(t);
  return { type: Z.PrincipalStandard, address: e };
}
function Ak(t) {
  return { type: Z.PrincipalStandard, address: t };
}
function vk(t, e) {
  const n = sd(t), r = fi(e);
  return Ky(n, r);
}
function Ky(t, e) {
  if (mo(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Z.PrincipalContract, address: t, contractName: e };
}
function Ml(t, e = !1) {
  switch (t.type) {
    case Z.BoolTrue:
      return !0;
    case Z.BoolFalse:
      return !1;
    case Z.Int:
    case Z.UInt:
      return e ? t.value.toString() : t.value;
    case Z.Buffer:
      return `0x${jt(t.buffer)}`;
    case Z.OptionalNone:
      return null;
    case Z.OptionalSome:
      return mr(t.value);
    case Z.ResponseErr:
      return mr(t.value);
    case Z.ResponseOk:
      return mr(t.value);
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return Sk(t);
    case Z.List:
      return t.list.map((r) => mr(r));
    case Z.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = mr(t.data[r]);
      }), n;
    case Z.StringASCII:
      return t.data;
    case Z.StringUTF8:
      return t.data;
  }
}
function mr(t) {
  switch (t.type) {
    case Z.ResponseErr:
      return { type: Ss(t), value: Ml(t, !0), success: !1 };
    case Z.ResponseOk:
      return { type: Ss(t), value: Ml(t, !0), success: !0 };
    default:
      return { type: Ss(t), value: Ml(t, !0) };
  }
}
function Ss(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return "bool";
    case Z.Int:
      return "int";
    case Z.UInt:
      return "uint";
    case Z.Buffer:
      return `(buff ${t.buffer.length})`;
    case Z.OptionalNone:
      return "(optional none)";
    case Z.OptionalSome:
      return `(optional ${Ss(t.value)})`;
    case Z.ResponseErr:
      return `(response UnknownType ${Ss(t.value)})`;
    case Z.ResponseOk:
      return `(response ${Ss(t.value)} UnknownType)`;
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return "principal";
    case Z.List:
      return `(list ${t.list.length} ${t.list.length ? Ss(t.list[0]) : "UnknownType"})`;
    case Z.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Ss(t.data[e])})`).join(" ")})`;
    case Z.StringASCII:
      return `(string-ascii ${Ny(t.data).length})`;
    case Z.StringUTF8:
      return `(string-utf8 ${mo(t.data).length})`;
  }
}
const Vy = () => ({ type: Z.BoolTrue }), Yy = () => ({ type: Z.BoolFalse }), kk = (t) => t ? Vy() : Yy(), s0 = BigInt("0xffffffffffffffffffffffffffffffff"), $k = BigInt(0), i0 = BigInt("0x7fffffffffffffffffffffffffffffff"), o0 = BigInt("-170141183460469231731687303715884105728"), Ik = (t) => {
  const e = An(t, !0);
  if (e > i0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${i0}`);
  if (e < o0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${o0}`);
  return { type: Z.Int, value: e };
}, Ar = (t) => {
  const e = An(t, !1);
  if (e < $k)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > s0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${s0}`);
  return { type: Z.UInt, value: e };
}, qy = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Z.Buffer, buffer: t };
};
function Xy() {
  return { type: Z.OptionalNone };
}
function Wy(t) {
  return { type: Z.OptionalSome, value: t };
}
function Lk(t) {
  return { type: Z.ResponseErr, value: t };
}
function Ck(t) {
  return { type: Z.ResponseOk, value: t };
}
function Tk(t) {
  return { type: Z.List, list: t };
}
function di(t) {
  for (const e in t)
    if (!m8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Z.Tuple, data: t };
}
const rn = (t) => ({ type: Z.StringASCII, data: t }), Bk = (t) => ({ type: Z.StringUTF8, data: t });
class Zy extends Oy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ks.hash(e);
    const r = Jf(n);
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
    return Ks.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ks.exists(this), Ks.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Qy = (t, e, n) => new Zy(t, e).update(n).digest();
Qy.create = (t, e) => new Zy(t, e);
Le.hmacSha256Sync = (t, ...e) => {
  const n = Qy.create(rd, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function lo(t) {
  return {
    type: ht.PublicKey,
    data: me(t)
  };
}
function Mk(t, e, n = Ae.Compressed) {
  const r = y4(e.data), s = new Dn(Xh(r.r), Xh(r.s)), i = Ot.fromSignature(t, s, r.recoveryId), o = n === Ae.Compressed;
  return i.toHex(o);
}
function Pk(t) {
  return { type: ht.PublicKey, data: t };
}
function xo(t) {
  return !jt(t.data).startsWith("04");
}
function $c(t) {
  return t.data.slice();
}
function Nk(t) {
  const e = Hk(t), n = ca(e.data.slice(0, 32), e.compressed);
  return lo(jt(n));
}
function _k(t) {
  const e = typeof t == "string" ? t : jt(t), n = Ot.fromHex(e).toHex(!0);
  return lo(n);
}
function Uk(t) {
  const e = typeof t == "string" ? t : jt(t), n = Ot.fromHex(e).toHex(!1);
  return lo(n);
}
function Ru(t) {
  const e = t.readUInt8(), n = e === 4 ? I4 : $4;
  return Pk(Ne([e, t.readBytes(n)]));
}
function Hk(t) {
  const e = w4(t), n = e.length == _y;
  return { data: e, compressed: n };
}
function Ok(t, e) {
  const [n, r] = Dc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = ha(r, 1) + Dn.fromHex(n).toCompactHex();
  return zy(i);
}
function Dk(t) {
  return Nk(t.data);
}
function Fk(t, e, n) {
  return typeof t == "string" && (t = Gy(t)), typeof n == "string" && (n = l0(n)), {
    type: ht.Payload,
    payloadType: Ht.TokenTransfer,
    recipient: t,
    amount: An(e, !1),
    memo: n ?? l0("")
  };
}
function jk(t, e, n, r) {
  return typeof t == "string" && (t = sd(t)), typeof e == "string" && (e = fi(e)), typeof n == "string" && (n = fi(n)), {
    type: ht.Payload,
    payloadType: Ht.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function a0(t, e, n) {
  return typeof t == "string" && (t = fi(t)), typeof e == "string" && (e = Wk(e)), typeof n == "number" ? {
    type: ht.Payload,
    payloadType: Ht.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ht.Payload,
    payloadType: Ht.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Rk() {
  return { type: ht.Payload, payloadType: Ht.PoisonMicroblock };
}
function c0(t, e) {
  if (t.byteLength != qs)
    throw Error(`Coinbase buffer size must be ${qs} bytes`);
  return e != null ? {
    type: ht.Payload,
    payloadType: Ht.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ht.Payload,
    payloadType: Ht.Coinbase,
    coinbaseBytes: t
  };
}
function zk(t, e, n) {
  if (t.byteLength != qs)
    throw Error(`Coinbase buffer size must be ${qs} bytes`);
  if (n.byteLength != Hu)
    throw Error(`VRF proof buffer size must be ${Hu} bytes`);
  return {
    type: ht.Payload,
    payloadType: Ht.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Z.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var zu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(zu || (zu = {}));
function Gk(t, e, n, r, s, i, o) {
  return {
    type: ht.Payload,
    payloadType: Ht.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Jy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ht.TokenTransfer:
      e.push(Me(t.recipient)), e.push(Ts(t.amount, !1, 8)), e.push(Hr(t.memo));
      break;
    case Ht.ContractCall:
      e.push(Hr(t.contractAddress)), e.push(Hr(t.contractName)), e.push(Hr(t.functionName));
      const n = new Uint8Array(4);
      ui(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Me(r));
      });
      break;
    case Ht.SmartContract:
      e.push(Hr(t.contractName)), e.push(Hr(t.codeBody));
      break;
    case Ht.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Hr(t.contractName)), e.push(Hr(t.codeBody));
      break;
    case Ht.PoisonMicroblock:
      break;
    case Ht.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ht.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Me(t.recipient));
      break;
    case Ht.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Me(t.recipient ? Wy(t.recipient) : Xy())), e.push(t.vrfProof);
      break;
    case Ht.TenureChange:
      e.push(me(t.tenureHash)), e.push(me(t.previousTenureHash)), e.push(me(t.burnViewHash)), e.push(me(t.previousTenureEnd)), e.push(ui(new Uint8Array(4), t.previousTenureBlocks)), e.push(S4(new Uint8Array(1), t.cause)), e.push(me(t.publicKeyHash));
      break;
  }
  return Ne(e);
}
function Kk(t) {
  switch (t.readUInt8Enum(Ht, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ht.TokenTransfer:
      const n = Qn(t), r = An(t.readBytes(8), !1), s = ew(t);
      return Fk(n, r, s);
    case Ht.ContractCall:
      const i = uo(t), o = Zn(t), a = Zn(t), c = [], u = t.readUInt32BE();
      for (let v = 0; v < u; v++) {
        const H = Qn(t);
        c.push(H);
      }
      return jk(i, o, a, c);
    case Ht.SmartContract:
      const d = Zn(t), l = Zn(t, 4, 1e5);
      return a0(d, l);
    case Ht.VersionedSmartContract: {
      const v = t.readUInt8Enum(Ou, (tt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${tt}`);
      }), H = Zn(t), P = Zn(t, 4, 1e5);
      return a0(H, P, v);
    }
    case Ht.PoisonMicroblock:
      return Rk();
    case Ht.Coinbase: {
      const v = t.readBytes(qs);
      return c0(v);
    }
    case Ht.CoinbaseToAltRecipient: {
      const v = t.readBytes(qs), H = Qn(t);
      return c0(v, H);
    }
    case Ht.NakamotoCoinbase: {
      const v = t.readBytes(qs), H = Qn(t), P = t.readBytes(Hu);
      return zk(v, H, P);
    }
    case Ht.TenureChange:
      const g = jt(t.readBytes(20)), p = jt(t.readBytes(20)), x = jt(t.readBytes(20)), E = jt(t.readBytes(32)), L = t.readUInt32BE(), U = t.readUInt8Enum(zu, (v) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${v}`);
      }), D = jt(t.readBytes(20));
      return Gk(g, p, x, E, L, U, D);
  }
}
class cl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Fs extends cl {
  constructor(e) {
    super(e);
  }
}
class On extends cl {
  constructor(e) {
    super(e);
  }
}
class Ic extends cl {
  constructor(e) {
    super(e);
  }
}
class Vs extends cl {
  constructor(e) {
    super(e);
  }
}
var or;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(or || (or = {}));
function Gu(t) {
  return zy(jt(t.readBytes(ol)));
}
function Vi(t, e) {
  return {
    pubKeyEncoding: t,
    type: ht.TransactionAuthField,
    contents: e
  };
}
function Vk(t) {
  const e = t.readUInt8Enum(or, (n) => {
    throw new On(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case or.PublicKeyCompressed:
      return Vi(Ae.Compressed, Ru(t));
    case or.PublicKeyUncompressed:
      return Vi(Ae.Uncompressed, Uk(Ru(t).data));
    case or.SignatureCompressed:
      return Vi(Ae.Compressed, Gu(t));
    case or.SignatureUncompressed:
      return Vi(Ae.Uncompressed, Gu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function id(t) {
  return me(t.data);
}
function Yk(t) {
  const e = [];
  switch (t.contents.type) {
    case ht.PublicKey:
      e.push(t.pubKeyEncoding === Ae.Compressed ? or.PublicKeyCompressed : or.PublicKeyUncompressed), e.push($c(_k(t.contents.data)));
      break;
    case ht.MessageSignature:
      e.push(t.pubKeyEncoding === Ae.Compressed ? or.SignatureCompressed : or.SignatureUncompressed), e.push(id(t.contents));
      break;
  }
  return Ne(e);
}
function Hr(t) {
  switch (t.type) {
    case ht.Address:
      return pa(t);
    case ht.Principal:
      return tw(t);
    case ht.LengthPrefixedString:
      return fo(t);
    case ht.MemoString:
      return Zk(t);
    case ht.AssetInfo:
      return nw(t);
    case ht.PostCondition:
      return Qk(t);
    case ht.PublicKey:
      return $c(t);
    case ht.LengthPrefixedList:
      return cd(t);
    case ht.Payload:
      return Jy(t);
    case ht.TransactionAuthField:
      return Yk(t);
    case ht.MessageSignature:
      return id(t);
  }
}
function qk() {
  return {
    type: ht.Address,
    version: kc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function od(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === le.SerializeP2PKH || e === le.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === le.SerializeP2WPKH || e === le.SerializeP2WSH || e === le.SerializeP2WSHNonSequential) && !r.every(xo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case le.SerializeP2PKH:
      return jo(t, g8(r[0].data));
    case le.SerializeP2WPKH:
      return jo(t, y8(r[0].data));
    case le.SerializeP2SH:
    case le.SerializeP2SHNonSequential:
      return jo(t, w8(n, r.map($c)));
    case le.SerializeP2WSH:
    case le.SerializeP2WSHNonSequential:
      return jo(t, b8(n, r.map($c)));
  }
}
function pa(t) {
  const e = [];
  return e.push(me(ha(t.version, 1))), e.push(me(t.hash160)), Ne(e);
}
function uo(t) {
  const e = sl(jt(t.readBytes(1))), n = jt(t.readBytes(20));
  return { type: ht.Address, version: e, hash160: n };
}
function tw(t) {
  const e = [];
  return e.push(t.prefix), e.push(pa(t.address)), t.prefix === na.Contract && e.push(fo(t.contractName)), Ne(e);
}
function Xk(t) {
  const e = t.readUInt8Enum(na, (s) => {
    throw new On(`Unexpected Principal payload type: ${s}`);
  }), n = uo(t);
  if (e === na.Standard)
    return { type: ht.Principal, prefix: e, address: n };
  const r = Zn(t);
  return {
    type: ht.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function fo(t) {
  const e = [], n = mo(t.content), r = n.byteLength;
  return e.push(me(ha(r, t.lengthPrefixBytes))), e.push(n), Ne(e);
}
function Zn(t, e, n) {
  e = e || 1;
  const r = sl(jt(t.readBytes(e))), s = Qf(t.readBytes(r));
  return fi(s, e, n ?? 128);
}
function Wk(t) {
  return fi(t, 4, 1e5);
}
function l0(t) {
  if (t && ow(t, Ac))
    throw new Error(`Memo exceeds maximum length of ${Ac} bytes`);
  return { type: ht.MemoString, content: t };
}
function Zk(t) {
  const e = [], n = mo(t.content), r = p8(jt(n), Ac * 2);
  return e.push(me(r)), Ne(e);
}
function ew(t) {
  let e = Qf(t.readBytes(Ac));
  return e = e.replace(/\u0000*$/, ""), { type: ht.MemoString, content: e };
}
function nw(t) {
  const e = [];
  return e.push(pa(t.address)), e.push(fo(t.contractName)), e.push(fo(t.assetName)), Ne(e);
}
function Ku(t) {
  return {
    type: ht.AssetInfo,
    address: uo(t),
    contractName: Zn(t),
    assetName: Zn(t)
  };
}
function ad(t, e) {
  return {
    type: ht.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function cd(t) {
  const e = t.values, n = [];
  n.push(me(ha(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Hr(r));
  return Ne(n);
}
function rw(t, e, n) {
  const r = sl(jt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case ht.Address:
        s.push(uo(t));
        break;
      case ht.LengthPrefixedString:
        s.push(Zn(t));
        break;
      case ht.MemoString:
        s.push(ew(t));
        break;
      case ht.AssetInfo:
        s.push(Ku(t));
        break;
      case ht.PostCondition:
        s.push(Jk(t));
        break;
      case ht.PublicKey:
        s.push(Ru(t));
        break;
      case ht.TransactionAuthField:
        s.push(Vk(t));
        break;
    }
  return ad(s, n);
}
function Qk(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(tw(t.principal)), (t.conditionType === In.Fungible || t.conditionType === In.NonFungible) && e.push(nw(t.assetInfo)), t.conditionType === In.NonFungible && e.push(Me(t.assetName)), e.push(t.conditionCode), t.conditionType === In.STX || t.conditionType === In.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Fs("The post-condition amount may not be larger than 8 bytes");
    e.push(Ts(t.amount, !1, 8));
  }
  return Ne(e);
}
function Jk(t) {
  const e = t.readUInt8Enum(In, (o) => {
    throw new On(`Could not read ${o} as PostConditionType`);
  }), n = Xk(t);
  let r, s, i;
  switch (e) {
    case In.STX:
      return r = t.readUInt8Enum(ea, (a) => {
        throw new On(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${jt(t.readBytes(8))}`), {
        type: ht.PostCondition,
        conditionType: In.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case In.Fungible:
      return s = Ku(t), r = t.readUInt8Enum(ea, (a) => {
        throw new On(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${jt(t.readBytes(8))}`), {
        type: ht.PostCondition,
        conditionType: In.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case In.NonFungible:
      s = Ku(t);
      const o = Qn(t);
      return r = t.readUInt8Enum(Du, (a) => {
        throw new On(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ht.PostCondition,
        conditionType: In.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Lr(t, e) {
  return Ne([t, e]);
}
function t8(t) {
  return new Uint8Array([t.type]);
}
function e8(t) {
  return t.type === Z.OptionalNone ? new Uint8Array([t.type]) : Lr(t.type, Me(t.value));
}
function n8(t) {
  const e = new Uint8Array(4);
  return ui(e, t.buffer.length, 0), Lr(t.type, il(e, t.buffer));
}
function r8(t) {
  const e = Zf(u4(t.value, BigInt(k4)), Uy);
  return Lr(t.type, e);
}
function s8(t) {
  const e = Zf(t.value, Uy);
  return Lr(t.type, e);
}
function i8(t) {
  return Lr(t.type, pa(t.address));
}
function o8(t) {
  return Lr(t.type, il(pa(t.address), fo(t.contractName)));
}
function a8(t) {
  return Lr(t.type, Me(t.value));
}
function c8(t) {
  const e = [], n = new Uint8Array(4);
  ui(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Me(r);
    e.push(s);
  }
  return Lr(t.type, Ne(e));
}
function l8(t) {
  const e = [], n = new Uint8Array(4);
  ui(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = fi(s);
    e.push(fo(i));
    const o = Me(t.data[s]);
    e.push(o);
  }
  return Lr(t.type, Ne(e));
}
function sw(t, e) {
  const n = [], r = e == "ascii" ? Ny(t.data) : mo(t.data), s = new Uint8Array(4);
  return ui(s, r.length, 0), n.push(s), n.push(r), Lr(t.type, Ne(n));
}
function u8(t) {
  return sw(t, "ascii");
}
function f8(t) {
  return sw(t, "utf8");
}
function Me(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return t8(t);
    case Z.OptionalNone:
    case Z.OptionalSome:
      return e8(t);
    case Z.Buffer:
      return n8(t);
    case Z.UInt:
      return s8(t);
    case Z.Int:
      return r8(t);
    case Z.PrincipalStandard:
      return i8(t);
    case Z.PrincipalContract:
      return o8(t);
    case Z.ResponseOk:
    case Z.ResponseErr:
      return a8(t);
    case Z.List:
      return c8(t);
    case Z.Tuple:
      return l8(t);
    case Z.StringASCII:
      return u8(t);
    case Z.StringUTF8:
      return f8(t);
    default:
      throw new Fs("Unable to serialize. Invalid Clarity Value.");
  }
}
function d8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const u0 = /* @__PURE__ */ new Map();
function iw(t, e) {
  const n = u0.get(t);
  if (n !== void 0)
    return n(e);
  const r = d8(t);
  return u0.set(t, r), iw(t, e);
}
class Vo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return E4(this.readBytes(4), 0);
  }
  readUInt8() {
    return x4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return b4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = jt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = jt(n);
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
    if (iw(e, r))
      return r;
    throw n(r);
  }
}
function Qn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Vo(me(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Vo(t) : e = t;
  switch (e.readUInt8Enum(Z, (r) => {
    throw new On(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Z.Int:
      return Ik(e.readBytes(16));
    case Z.UInt:
      return Ar(e.readBytes(16));
    case Z.Buffer:
      const r = e.readUInt32BE();
      return qy(e.readBytes(r));
    case Z.BoolTrue:
      return Vy();
    case Z.BoolFalse:
      return Yy();
    case Z.PrincipalStandard:
      const s = uo(e);
      return Ak(s);
    case Z.PrincipalContract:
      const i = uo(e), o = Zn(e);
      return Ky(i, o);
    case Z.ResponseOk:
      return Ck(Qn(e));
    case Z.ResponseErr:
      return Lk(Qn(e));
    case Z.OptionalNone:
      return Xy();
    case Z.OptionalSome:
      return Wy(Qn(e));
    case Z.List:
      const a = e.readUInt32BE(), c = [];
      for (let E = 0; E < a; E++)
        c.push(Qn(e));
      return Tk(c);
    case Z.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let E = 0; E < u; E++) {
        const L = Zn(e).content;
        if (L === void 0)
          throw new On('"content" is undefined');
        d[L] = Qn(e);
      }
      return di(d);
    case Z.StringASCII:
      const l = e.readUInt32BE(), g = p4(e.readBytes(l));
      return rn(g);
    case Z.StringUTF8:
      const p = e.readUInt32BE(), x = Qf(e.readBytes(p));
      return Bk(x);
    default:
      throw new On("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const h8 = (t) => t.length % 2 == 0 ? t : `0${t}`, p8 = (t, e) => t.padEnd(e, "0"), ow = (t, e) => t ? mo(t).length > e : !1;
function Vu(t) {
  return kg(t);
}
const ra = (t) => z4(rd(t)), ld = (t) => jt(xk(t)), g8 = (t) => jt(ra(t)), y8 = (t) => {
  const e = ra(t), n = il(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ra(n);
  return jt(r);
}, w8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ne(n), s = ra(r);
  return jt(s);
}, b8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ne(n), s = rd(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ne(i), a = ra(o);
  return jt(a);
};
function m8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function aw(t) {
  const e = Me(t);
  return `0x${jt(e)}`;
}
function x8(t) {
  return Qn(t);
}
const qi = (t) => {
  try {
    return mi.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function ud() {
  return {
    type: ht.MessageSignature,
    data: jt(new Uint8Array(ol))
  };
}
function cw(t, e, n, r) {
  const s = od(0, t, 1, [lo(e)]).hash160, i = xo(lo(e)) ? Ae.Compressed : Ae.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: An(n, !1),
    fee: An(r, !1),
    keyEncoding: i,
    signature: ud()
  };
}
function sa(t) {
  return "signature" in t;
}
function f0(t) {
  return t === le.SerializeP2SH || t === le.SerializeP2WSH;
}
function S8(t) {
  return t === le.SerializeP2SHNonSequential || t === le.SerializeP2WSHNonSequential;
}
function d0(t) {
  const e = Vu(t);
  return e.nonce = 0, e.fee = 0, sa(e) ? e.signature = ud() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function E8(t) {
  const e = [
    t.hashMode,
    me(t.signer),
    Ts(t.nonce, !1, 8),
    Ts(t.fee, !1, 8),
    t.keyEncoding,
    id(t.signature)
  ];
  return Ne(e);
}
function A8(t) {
  const e = [
    t.hashMode,
    me(t.signer),
    Ts(t.nonce, !1, 8),
    Ts(t.fee, !1, 8)
  ], n = ad(t.fields);
  e.push(cd(n));
  const r = new Uint8Array(2);
  return m4(r, t.signaturesRequired, 0), e.push(r), Ne(e);
}
function v8(t, e) {
  const n = jt(e.readBytes(20)), r = BigInt(`0x${jt(e.readBytes(8))}`), s = BigInt(`0x${jt(e.readBytes(8))}`), i = e.readUInt8Enum(Ae, (a) => {
    throw new On(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === le.SerializeP2WPKH && i != Ae.Compressed)
    throw new On("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Gu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function k8(t, e) {
  const n = jt(e.readBytes(20)), r = BigInt("0x" + jt(e.readBytes(8))), s = BigInt("0x" + jt(e.readBytes(8))), i = rw(e, ht.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case ht.PublicKey:
        xo(u.contents) || (o = !0);
        break;
      case ht.MessageSignature:
        if (u.pubKeyEncoding === Ae.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Vs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === le.SerializeP2WSH || t === le.SerializeP2WSHNonSequential))
    throw new Vs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Pl(t) {
  return sa(t) ? E8(t) : A8(t);
}
function Nl(t) {
  const e = t.readUInt8Enum(le, (n) => {
    throw new On(`Could not parse ${n} as AddressHashMode`);
  });
  return e === le.SerializeP2PKH || e === le.SerializeP2WPKH ? v8(e, t) : k8(e, t);
}
function lw(t, e, n, r) {
  const i = t + jt(new Uint8Array([e])) + jt(Ts(n, !1, 8)) + jt(Ts(r, !1, 8));
  if (me(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ld(me(i));
}
function uw(t, e, n) {
  const r = 33 + ol, s = xo(e) ? Ae.Compressed : Ae.Uncompressed, i = t + h8(s.toString(16)) + n.data, o = me(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return ld(o);
}
function $8(t, e, n, r, s) {
  const i = lw(t, e, n, r), o = Ok(s, i), a = Dk(s), c = uw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function fw(t, e, n, r, s, i) {
  const o = lw(t, e, n, r), a = lo(Mk(o, i, s)), c = uw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function I8() {
  const t = cw(le.SerializeP2PKH, "", 0, 0);
  return t.signer = qk().hash160, t.keyEncoding = Ae.Compressed, t.signature = ud(), t;
}
function h0(t, e, n) {
  return sa(t) ? L8(t, e, n) : C8(t, e, n);
}
function L8(t, e, n) {
  const { pubKey: r, nextSigHash: s } = fw(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = od(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Vs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function C8(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ht.PublicKey:
        xo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case ht.MessageSignature:
        c.pubKeyEncoding === Ae.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = fw(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (f0(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new Vs("Too many signatures");
        break;
    }
  if (f0(t.hashMode) && o !== t.signaturesRequired || S8(t.hashMode) && o < t.signaturesRequired)
    throw new Vs("Incorrect number of signatures");
  if (i && (t.hashMode === le.SerializeP2WSH || t.hashMode === le.SerializeP2WSHNonSequential))
    throw new Vs("Uncompressed keys are not allowed in this hash mode");
  const a = od(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Vs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function dw(t) {
  return {
    authType: Ie.Standard,
    spendingCondition: t
  };
}
function hw(t, e) {
  return {
    authType: Ie.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || cw(le.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function p0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ie.Standard:
        return dw(d0(t.spendingCondition));
      case Ie.Sponsored:
        return hw(d0(t.spendingCondition), I8());
      default:
        throw new Ic("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function T8(t, e) {
  switch (t.authType) {
    case Ie.Standard:
      return h0(t.spendingCondition, e, Ie.Standard);
    case Ie.Sponsored:
      return h0(t.spendingCondition, e, Ie.Standard);
    default:
      throw new Ic("Invalid origin auth type");
  }
}
function B8(t, e) {
  switch (t.authType) {
    case Ie.Standard:
      const n = {
        ...t.spendingCondition,
        fee: An(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Ie.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: An(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function M8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: An(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function P8(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: An(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function N8(t, e) {
  const n = {
    ...e,
    nonce: An(e.nonce, !1),
    fee: An(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function _8(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ie.Standard:
      e.push(Pl(t.spendingCondition));
      break;
    case Ie.Sponsored:
      e.push(Pl(t.spendingCondition)), e.push(Pl(t.sponsorSpendingCondition));
      break;
  }
  return Ne(e);
}
function U8(t) {
  const e = t.readUInt8Enum(Ie, (r) => {
    throw new On(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ie.Standard:
      return n = Nl(t), dw(n);
    case Ie.Sponsored:
      n = Nl(t);
      const r = Nl(t);
      return hw(n, r);
  }
}
class H8 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: An(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? A4, this.postConditionMode = i ?? co.Deny, this.postConditions = s ?? ad([]), o)
      this.anchorMode = L4(o);
    else
      switch (r.payloadType) {
        case Ht.Coinbase:
        case Ht.CoinbaseToAltRecipient:
        case Ht.NakamotoCoinbase:
        case Ht.PoisonMicroblock:
        case Ht.TenureChange:
          this.anchorMode = $n.OnChainOnly;
          break;
        case Ht.ContractCall:
        case Ht.SmartContract:
        case Ht.VersionedSmartContract:
        case Ht.TokenTransfer:
          this.anchorMode = $n.Any;
          break;
      }
  }
  signBegin() {
    const e = Vu(this);
    return e.auth = p0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Vu(this);
    return e.auth = p0(e.auth), e.txid();
  }
  verifyOrigin() {
    return T8(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ie.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ie.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ie.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !sa(n)) {
      const r = xo(e);
      n.fields.push(Vi(r ? Ae.Compressed : Ae.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = $8(n, r, e.fee, e.nonce, s);
    return sa(e) ? e.signature = i : e.fields.push(Vi(s.data.byteLength === _y ? Ae.Compressed : Ae.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return ld(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ie.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = N8(this.auth, e);
  }
  setFee(e) {
    this.auth = B8(this.auth, e);
  }
  setNonce(e) {
    this.auth = M8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ie.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = P8(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Fs('"version" is undefined');
    if (this.chainId === void 0)
      throw new Fs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Fs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Fs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Fs('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return ui(n, this.chainId, 0), e.push(n), e.push(_8(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(cd(this.postConditions)), e.push(Jy(this.payload)), Ne(e);
  }
}
function Lc(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Vo(me(t.slice(2))) : e = new Vo(me(t)) : t instanceof Uint8Array ? e = new Vo(t) : e = t;
  const n = e.readUInt8Enum(vc, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = U8(e), i = e.readUInt8Enum($n, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(co, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = rw(e, ht.PostCondition), c = Kk(e);
  return new H8(n, s, c, a, o, i, r);
}
const O8 = kk, Yo = Ar, D8 = qy;
const F8 = /* @__PURE__ */ new Set([4001, -31001]), j8 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], R8 = ["result", "data", "payload", "response", "params"], g0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], ll = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ai = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, jr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, z8 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), pw = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => z8(i, r)) === s
  );
}, gw = (t) => t ? pw(Ai()).some(
  (e) => {
    var n;
    return e.id === t && (ll(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, yw = () => {
  if (typeof window > "u")
    return;
  const t = Ai(), e = pw(t).filter(
    (n) => {
      var r;
      return ll(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = jr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of j8) {
    const r = jr(t, n) ?? (t === window ? void 0 : jr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, G8 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ai(), n = jr(e, t) ?? (e === window ? void 0 : jr(window, t)) ?? Xc(t);
  if (n)
    return n;
  if (ll(t) || gw(t))
    return yw();
}, za = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, K8 = ["blockstack-session", "blockstack"], V8 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of K8) {
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
V8();
const ww = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Hn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, Y8 = (t) => {
  const e = Hn(t);
  if (!e)
    return null;
  const n = ww(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, q8 = (t) => {
  const e = Hn(t);
  if (!e)
    return null;
  const n = ww(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Yu = (t, e = "mainnet") => {
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
      return Yu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Yu(r, e);
  }
  return e;
}, Xs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, ia = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return qi(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = ia(s, e + 1);
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
    const i = ia(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && qi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && qi(n.testnet) ? n.testnet.trim() : null;
}, y0 = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, bw = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && F8.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, hi = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Hn(n == null ? void 0 : n.message) ?? Hn(e.message) ?? Hn(e.error) ?? Hn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, ho = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw hi(e);
    if (e.status === "error")
      throw hi(e.result ?? e);
  }
  return t;
}, w0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return ho(r);
  } catch (r) {
    throw hi(r);
  }
}, mw = () => yw(), fd = () => {
  if (typeof window > "u")
    return;
  const t = Ai();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = jr(t, e) ?? (t === window ? void 0 : jr(window, e));
    if (n)
      return n;
  }
}, b0 = () => {
  if (typeof window > "u")
    return;
  const t = fd();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Ai();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = jr(e, n) ?? (e === window ? void 0 : jr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, nc = (t) => {
  var r, s;
  const e = ri();
  if (ll(e) || gw(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ai() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === mw();
}, _l = (t) => {
  const e = q8(t);
  if (!e)
    return null;
  try {
    const n = Lc(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Cc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = _l(t), r = Y8(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Hn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Cc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of g0)
    if (_l(s[a])) {
      i = Hn(s[a]);
      break;
    }
  const o = Hn(s.txId) || Hn(s.txid) || Hn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Hn(s.txRaw) ?? void 0
    };
  for (const a of g0) {
    const c = _l(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Hn(s[a]) ?? void 0
      };
  }
  for (const a of R8) {
    const c = s[a], u = Cc(c, e + 1);
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
}, Ul = (t) => {
  const e = Cc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, X8 = (t) => {
  const e = Cc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, W8 = (t) => ({
  ...t,
  fee: Xs(t.fee),
  nonce: Xs(t.nonce),
  sponsored: t.sponsored === !0
}), m0 = (t) => ({
  recipient: t.recipient,
  amount: Xs(t.amount) ?? "0",
  memo: t.memo,
  network: Yu(t.network),
  address: t.stxAddress,
  fee: Xs(t.fee),
  nonce: Xs(t.nonce),
  sponsored: t.sponsored ?? !1
}), xw = "WALLET_ADDRESS_MISMATCH", Z8 = 45e3;
let qo = null;
const qu = (t) => {
  t && (qo = { address: t, at: Date.now() });
}, Q8 = () => {
  qo = null;
}, J8 = () => qo && Date.now() - qo.at <= Z8 ? qo.address : null, t5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, e5 = async (t) => {
  Q8();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = ho(await t.request("wallet_connect")), n = ia(e);
  return qu(n), n;
}, n5 = async (t, e, n, r) => {
  try {
    return ho(await t.request(e, n));
  } catch (s) {
    const i = hi(s);
    if (!t5(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await e5(t);
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
        { code: o ? xw : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return ho(await t.request(e, n));
    } catch (a) {
      throw hi(a);
    }
  }
};
let x0 = 3e4;
const r5 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${x0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, x0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, s5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: xw }
      );
    return c;
  }, s = J8();
  if (s)
    return za(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  za(n, "account-read");
  try {
    const c = ho(
      await r5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = ia(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (bw(c))
      throw hi(c);
    za(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return qu(i), r(i, "wallet_getAccount");
  let o;
  za(n, "account-reconnect");
  try {
    o = ho(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), hi(c);
  }
  const a = ia(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return qu(a), r(a, "wallet_connect");
}, i5 = async (t, e) => {
  if (!nc(t)) {
    const i = await w0(
      t,
      "stx_transferStx",
      m0(e)
    );
    return Ul(i);
  }
  const n = fd();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await w0(
      n,
      "stx_transferStx",
      m0(e)
    );
    return Ul(i);
  }
  const r = mw();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await s5(r, e.stxAddress);
  const s = await n5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Xs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Xs(e.fee) } : {}
    },
    e.stxAddress
  );
  return Ul(s);
}, o5 = () => ri(), Sw = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ri(), e = t ? G8(t) : void 0;
  if (e)
    return e;
  const n = Ai() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, S0 = (t, e) => {
  const n = Sw(), r = W8({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, X8(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Da(r, e);
  if (nc(n) && !fd()) {
    const s = b0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ri(),
        route: "legacy-transaction-request"
      }), Da(r, s);
  }
  return void i5(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (y0(s) && nc(n)) {
      const a = b0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ri(),
          route: "legacy-transaction-request"
        }), Da(r, a);
        return;
      }
    }
    if (y0(s) && !nc(n)) {
      Da(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), bw(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, a5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), E0 = (t) => aw(t).replace(/^0x/, ""), A0 = "This wallet cannot sign messages. Try Xverse or Leather.", v0 = (t) => typeof (t == null ? void 0 : t.request) == "function", k0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", c5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, l5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function u5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: E0(e.message),
    domain: E0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function f5(t, e) {
  const n = await r4({
    domain: e.domain,
    message: e.message,
    network: rl(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? a5()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function $0(t) {
  var s, i;
  const e = o5() || "", n = /xverse/i.test(e);
  let r = Sw();
  if (n && !k0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (k0(r))
    try {
      return await f5(r, t);
    } catch (o) {
      if (n || !v0(r) || !l5(o)) throw o;
    }
  if (!n && v0(r))
    try {
      return await u5(r, t);
    } catch (o) {
      throw c5(o) ? new Error(A0) : o;
    }
  throw new Error(A0);
}
const I0 = 1000000n, vs = 1000000n, Tc = 50n, Ve = 3000n, Cr = 300n, _o = 3000n, d5 = 50000n, Hl = 200n, ul = 15000n, Sn = (t) => t + Tc;
function sr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / I0}.${(n % I0).toString().padStart(6, "0")}`;
}
function L0(t, e = Cr) {
  return t <= Ve ? 0 : Number((t - Ve) / Sn(e));
}
function Ol(t, e = 0n) {
  const n = vs - t - e;
  return n > 0n ? n : 0n;
}
function h5(t, e = Cr) {
  return t > vs ? "over" : t < Ve + Sn(e) ? "empty" : t < d5 ? "low" : "ok";
}
const p5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", g5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", y5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function w5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || y5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== p5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Ew = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Dl = 3, b5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Xu, Aw] = Ew.split("."), qn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Wu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function m5(t) {
  return qn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Ls(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function vw(t, e = []) {
  const n = await Ls(`/v2/contracts/call-read/${Xu}/${Aw}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Xu, arguments: e.map((r) => "0x" + qn(Me(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return mr(Qn(n.result));
}
async function x5() {
  const t = await Ls(`/v2/contracts/source/${Xu}/${Aw}?proof=0`);
  if (typeof t.source != "string" || await m5(t.source) !== g5) throw Error("Deployed source does not match the tested helper.");
  if (w5(await vw("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function kw(t) {
  return t.startsWith("SP") && qi(t) && !t.includes(".");
}
async function S5(t) {
  var r;
  if (!kw(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Ls(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Ls(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function E5(t) {
  const e = await Ls(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function A5(t, e) {
  var s, i;
  const n = await vw("get-owner", [Yo(t), Yo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !kw(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function v5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Wu(t), signal: AbortSignal.timeout(15e3) });
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
async function k5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function $5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Lc(Wu(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Ki(jo(kc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Ki(r.contractAddress) + "." + r.contractName.content !== Ew || r.functionName.content !== "play" || r.functionArgs.length !== 3 || qn(Me(r.functionArgs[0])) !== qn(Me(Yo(t.core))) || qn(Me(r.functionArgs[1])) !== qn(Me(Yo(t.song))) || qn(Me(r.functionArgs[2])) !== qn(Me(D8(Wu(t.id)))) || t.amount !== "50" || e.postConditionMode !== co.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ea.Equal || i.principal.prefix !== 2 || Ki(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Ki(r.contractAddress) + "." + r.contractName.content !== b5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || qn(Me(r.functionArgs[0])) !== qn(Me(Yo(t.song))) || typeof t.liked != "boolean" || qn(Me(r.functionArgs[1])) !== qn(Me(O8(t.liked))) || t.amount !== "0" || e.postConditionMode !== co.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || mr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const I5 = "xtrata.xyz/radio/listening-wallet", L5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Fr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && qi(t), C5 = (t) => ({
  domain: di({ name: rn(I5), version: rn("1"), "chain-id": Ar(1) }),
  message: di({
    purpose: rn(L5),
    main: rn(t.main),
    listening: rn(t.listening),
    issued: Ar(t.issued)
  })
}), $w = 100000n, T5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function B5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Fr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= $w).sort(T5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Ga = 50;
function Bc(t) {
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
async function M5(t, e, n = 4) {
  if (!Fr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Ga}&offset=${o}`, s = Bc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Ga);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Ga ? s : Bc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = B5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Ga);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const _r = 50, P5 = 6, N5 = 20, C0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function T0(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const i of n.results) {
    const o = i && typeof i == "object" && i.tx && typeof i.tx == "object" ? i.tx : i;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (s.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), u = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: s };
}
async function _5(t, e, n) {
  if (!Fr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Bc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${_r}&offset=0`));
    if (!s || s.total > P5 * _r) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = _r; o < s.total; o += _r) {
      const a = Bc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${_r}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${_r}&offset=${u}`, a = T0(await e(o(0)), t);
      if (!a || a.total > N5 * _r) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = _r; u < a.total; u += _r) {
        const d = T0(await e(o(u)), t);
        if (!d || !d.rows.length) return { ok: !1 };
        for (const l of d.rows) c.add(l);
        for (const l of d.sent) i.set(l.txId, l);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...i.values()] };
  } catch {
    return { ok: !1 };
  }
}
function U5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(C0).map((l, g) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: g } : Fr(l.sender) && p >= $w ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: p, kind: "dust", to: null, at: g };
  }), i = s.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Fr(l.recipient) && l.amount > 0n).sort(C0), a = o.reduce((l, g) => l + g.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, g) => {
    let p = g;
    for (const x of l) {
      if (p <= 0n) break;
      const E = x.left < p ? x.left : p;
      x.left -= E, p -= E;
    }
    return p;
  };
  for (const l of o) {
    const g = u(s.filter((p) => p.to === l.recipient), l.amount);
    g > 0n && u(s, g);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, g) => l + g.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const g = `${l.kind}:${l.to ?? ""}`, p = d.get(g);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : d.set(g, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, g) => l.newest - g.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function H5(t, e) {
  const n = t.filter((u) => u.kind === "deposit").sort((u, d) => u.newest - d.newest), r = t.find((u) => u.kind === "gift"), s = t.filter((u) => u.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((u, d) => u + d.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((u, d) => {
    if (u.amount <= e) {
      a.push(u);
      return;
    }
    const l = d === n.length - 1 && !c;
    o.push({ to: u.to, kind: "deposit", mode: l ? "all" : "amount", send: u.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function B0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const rc = [100, 250, 500], O5 = (t, e) => BigInt(t) * Sn(e), Uo = ["prepared", "signed", "unknown", "pending"], D5 = 30 * 6e4, Mc = 6e4, Ui = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, F5 = 3e3, Pc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Fl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function j5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, g = !1, p = null, x = !1, E = "", L = "", U = 0, D, v = null, H, P = [], tt, it = -1 / 0;
  const et = /* @__PURE__ */ new Set();
  let X = null, k = !1, B = 0, b = null, C = null, z = !1, T = null, st = !1, W = null, vt = !1, I = !1, O = !1, J = !1, ot = !1, ct = 0, It = null, ue = Promise.resolve();
  const kt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Cr.toString()), Xt = (y) => !!i && !(i.features ?? []).includes(y), Tt = (y, S) => `xtrata.ppp.v1.${y}:${S}`, _e = "xtrata.ppp.v1.as-main", Dt = () => {
    if (t.main()) return;
    const y = t.store.get(_e);
    return y && Fr(y) ? y : void 0;
  }, Lt = () => t.main() ?? Dt(), vn = (y = i == null ? void 0 : i.address) => {
    if (!y) return [];
    try {
      const S = JSON.parse(t.store.get(Tt("entries", y)) || "[]");
      return Array.isArray(S) ? S : [];
    } catch {
      return [];
    }
  }, he = (y) => {
    const S = [y, ...vn(y.address).filter((F) => !(F.txid === y.txid && F.kind === y.kind))].slice(0, 200);
    t.store.set(Tt("entries", y.address), JSON.stringify(S));
  }, Xe = (y = i == null ? void 0 : i.address) => !!y && t.store.get(Tt("on", y)) !== "0", Cn = (y) => {
    i != null && i.address && t.store.set(Tt("on", i.address), y ? "1" : "0");
  }, Ce = () => vn().filter((y) => Uo.includes(y.status)), kn = () => xe() ? [...Ce(), ...vn(pe()).filter((y) => Uo.includes(y.status))] : Ce(), Ue = () => N(i == null ? void 0 : i.address), N = (y) => {
    if (!y) return null;
    try {
      return JSON.parse(t.store.get(Tt("deposit", y)) || "null");
    } catch {
      return null;
    }
  }, gt = (y, S = i == null ? void 0 : i.address) => {
    S && t.store.set(Tt("deposit", S), JSON.stringify(y));
  };
  let zt = null;
  const We = (y = Mc) => {
    const S = t.now();
    zt = { since: zt && S < zt.until ? zt.since : S, until: Math.max((zt == null ? void 0 : zt.until) ?? 0, S + y) };
  }, dn = () => !!zt && t.now() < zt.until && (o === void 0 || o < Ve + Sn(kt())), He = () => !!Ue() || dn(), pe = () => Xt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), xe = () => !!(i != null && i.address) && pe() !== i.address, Rn = () => xe() ? c && c.for === pe() ? c.value : void 0 : o, $ = (y) => y !== void 0 && y < Ve + Hl, _ = () => Ce().filter((y) => t.now() - y.created > D5 && et.has(y.txid)), G = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Lt() || r === Lt() && !e.allowed), R = () => G() && !(i != null && i.linked), dt = () => {
    const y = Lt();
    return !R() && !!y && !!(i != null && i.linked) && i.linked !== y;
  }, At = (y) => Tt("return-to", y), re = (y = i == null ? void 0 : i.address) => {
    if (!y) return;
    const S = t.store.get(At(y));
    return S && Fr(S) && S !== y ? S : void 0;
  }, Wt = (y = i == null ? void 0 : i.address) => X && X.for === y ? X.res : null;
  function ie() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const y = re();
    if (y) return { to: y, kind: "chosen" };
    const S = Wt();
    if (S != null && S.ok && S.funder) return { to: S.funder, kind: "funder" };
  }
  const ge = (y) => Tt("gift", y);
  function Jt() {
    const y = i == null ? void 0 : i.address;
    if (!y) return null;
    if ((T == null ? void 0 : T.for) === y) return T.info;
    try {
      const S = JSON.parse(t.store.get(ge(y)) || "null");
      return S && typeof S.returnTo == "string" && typeof S.treasury == "string" ? S : null;
    } catch {
      return null;
    }
  }
  async function je() {
    var ft;
    const y = i == null ? void 0 : i.address;
    if (!y || !t.giftInfo || !((ft = e == null ? void 0 : e.gifts) != null && ft.enabled) || st) return;
    const S = (T == null ? void 0 : T.for) === y ? T : null, F = S ? S.ok ? S.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (S && t.now() - S.at < F) return;
    st = !0;
    const V = Jt();
    try {
      const K = await t.giftInfo(y);
      T = { for: y, info: K, ok: !0, at: t.now() }, t.store.set(ge(y), JSON.stringify(K));
    } catch {
      T = { for: y, info: V, ok: !1, at: t.now() };
    } finally {
      st = !1;
    }
  }
  const Ft = () => vn().reduce((y, S) => Uo.includes(S.status) ? y + BigInt(S.amount || "0") + BigInt(S.fee || "0") : y, 0n);
  function yt() {
    if (o === void 0) return 0;
    const y = o - Ft() - BigInt(Yt.length) * Sn(kt());
    return y > 0n ? L0(y, kt()) : 0;
  }
  const Gt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", te = "EMPTY — ADD STX TO PLAY";
  function Re() {
    if (!(e != null && e.here)) return null;
    const y = (S, F) => ({ reason: S, text: F });
    switch (hn()) {
      case "connect":
      case "wrong-wallet":
        return y("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return y("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return y("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return y("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return y("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return y("locked", "UNLOCK TO LISTEN");
      case "link":
        return y("link", "FINISH SETUP TO LISTEN");
      case "over":
        return y("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return He() ? y("arriving", "YOUR PLAYS ARE ARRIVING") : y("out", xe() ? Gt : te);
      case "ready":
        return !Xe() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? y("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : O ? yt() < 1 ? y("out", xe() ? Gt : te) : null : y("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const fe = () => {
    var y;
    return !!(i != null && i.address) && xe() && !!((y = Jt()) != null && y.player);
  };
  function Tn() {
    return fe() ? { locked: !0, known: !0 } : null;
  }
  const Ze = 3 * 6e4, Tr = () => !!Jt() && !!t.history && !(i != null && i.linked);
  async function vi() {
    const y = i.address, S = Jt(), { balance: F, nonce: V } = await t.chain.account(y), ft = await t.history(y, !0);
    if (!ft.ok) return null;
    const K = U5({ self: y, balance: F, inbound: ft.inbound, outgoing: ft.outgoing, gift: { sender: S.treasury, payer: S.returnTo } });
    if (!K.ok) return null;
    const mt = H5(K.parts, _o);
    return { balance: F, nonce: V, parts: K.parts, steps: mt.steps, tooSmall: mt.tooSmall.length };
  }
  const ve = () => vt ? { state: "unavailable" } : !W || t.now() - W.at > Ze || o !== void 0 && o !== W.balance ? { state: "none" } : W.plan;
  function hn() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const y = Lt();
    if (!R()) {
      if (!y) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : dt() ? "wrong-wallet" : i.state === "known" ? "locked" : !R() && i.linked !== y ? "link" : o === void 0 ? "loading" : o > vs ? "over" : o < Ve + Sn(kt()) ? "fund" : "ready" : "loading";
  }
  const So = () => {
    var y, S, F, V, ft;
    return {
      step: hn(),
      busy: u,
      message: E,
      error: L,
      notice: Eo(),
      gate: e,
      main: Lt(),
      mainConnected: !!t.main(),
      standIn: Dt(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : h5(o, kt()),
      playsLeft: o === void 0 ? 0 : L0(o, kt()),
      allowance: o === void 0 ? vs : Ol(o, BigInt(((y = Ue()) == null ? void 0 : y.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: Xe(),
      entries: vn(),
      depositTxid: ((S = Ue()) == null ? void 0 : S.txid) ?? D,
      depositPending: He(),
      arrival: He() ? { since: ((F = Ue()) == null ? void 0 : F.at) ?? (zt == null ? void 0 : zt.since) ?? t.now(), graceMs: Mc } : null,
      walletOutdated: Xt("like"),
      linkedListening: tt && tt === Lt() ? P.map((K) => K.listening) : [],
      serverLinked: !!v && H === `${Lt()}:${i == null ? void 0 : i.address}`,
      stuck: _().length,
      armed: J,
      queued: Yt.length,
      solo: R(),
      returnTo: (V = ie()) == null ? void 0 : V.to,
      returnToKind: (ft = ie()) == null ? void 0 : ft.kind,
      funderState: (() => {
        const K = Wt();
        return K ? K.ok ? K.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const K = Wt();
        return !!K && K.ok && K.distinct > 1;
      })(),
      walletCannotSolo: R() && Xt("standalone"),
      walletCannotMulti: Xt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((K) => K !== Lt() && K !== (i == null ? void 0 : i.linked)),
      creditedTo: R() && (i != null && i.address) && (b == null ? void 0 : b.for) === i.address && b.main ? b.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Tt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (C == null ? void 0 : C.for) === i.address && C.unused,
      gift: (() => {
        const K = Jt();
        return K ? { player: K.player, from: K.from, source: K.source, amount: K.amount } : null;
      })(),
      giftPlays: Jt() ? yt() : 0,
      playCost: Sn(kt()),
      giftStop: Re(),
      albumLock: Tn(),
      returnPlan: ve(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Xt("slots"),
      likeFunds: (() => {
        var xt;
        const K = pe();
        if (!K || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const mt = Rn();
        return { address: K, balance: mt, low: $(mt), album: xe(), pending: !!N(K), txid: (xt = N(K)) == null ? void 0 : xt.txid, main: Lt() };
      })()
    };
  }, Eo = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ee = (y, S = "") => {
    E = y, L = S, t.changed();
  };
  async function Ye(y, S) {
    if (!u) {
      u = y, L = "", t.changed();
      try {
        await S();
      } catch (F) {
        const V = F instanceof Error ? F.message : String(F);
        L = /Cancelled in the listening wallet/.test(V) ? "" : V, L || (E = "Not now. Nothing was signed.", ot = !0);
      } finally {
        u = null, await oe(!0);
      }
    }
  }
  const on = () => !!(e != null && e.enabled) && e.here && (R() || !!Lt() && e.allowed), ki = () => on() && !dt(), $i = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", zn = () => {
    if (dt()) throw new Error($i());
  };
  async function Kr() {
    if (!on()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Bn = (y) => {
    const S = Lt();
    return y.request("listening.status", S ? { main: S } : void 0);
  };
  async function Mn(y = !1) {
    i != null && i.address && (!y && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Ms(y)));
  }
  async function Ms(y = !1) {
    const S = pe();
    if (!(!xe() || !S || (i == null ? void 0 : i.state) !== "unlocked") && !(!y && (c == null ? void 0 : c.for) === S && t.now() - c.at < 3e4))
      try {
        c = { for: S, value: await t.chain.balance(S), at: t.now() };
      } catch {
      }
  }
  async function Ps(y) {
    if ((tt !== y || t.now() - it >= 6e4) && (P = await t.links(y), tt = y, it = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === y) return;
    const S = `${y}:${i.address}`;
    H === S && v || (v = P.find((F) => F.listening === i.address) ?? null, H = S);
  }
  async function Ii() {
    const y = i == null ? void 0 : i.address;
    if (!R() || !y || i != null && i.linked || !t.funder || k || !o || o <= 0n) return;
    const S = Wt(y);
    if (S != null && S.ok && S.funder) return;
    const F = S != null && S.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, B - 1), 30 * 6e4);
    if (!(X && X.for === y && t.now() - X.at < F)) {
      k = !0;
      try {
        X = { for: y, res: await t.funder(y), at: t.now() };
      } catch {
        X = { for: y, res: { ok: !1 }, at: t.now() };
      } finally {
        k = !1;
      }
      B = X.res.ok ? 0 : B + 1;
    }
  }
  async function Li() {
    const y = i == null ? void 0 : i.address;
    if (!(!R() || !y || i != null && i.linked || !t.mainOf || z) && !(b && b.for === y && (b.ok || t.now() - b.at < 6e4))) {
      z = !0;
      try {
        b = { for: y, main: await t.mainOf(y), ok: !0, at: t.now() };
      } catch {
        b = { for: y, main: null, ok: !1, at: t.now() };
      } finally {
        z = !1;
      }
    }
  }
  async function Ns() {
    const y = i == null ? void 0 : i.address;
    if (!(!y || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (C == null ? void 0 : C.for) === y) && t.store.get(Tt("created", y)) !== "1")
      try {
        C = { for: y, unused: await t.chain.confirmedNonce(y) === 0n };
      } catch {
      }
  }
  async function ur() {
    var ft;
    const y = i == null ? void 0 : i.address;
    if (!y) return !1;
    let S, F = !1;
    const V = /* @__PURE__ */ new Map();
    for (const K of kn())
      try {
        const mt = await t.chain.transaction(K.txid);
        if (!mt) {
          if (et.add(K.txid), t.now() - K.created > 15 * 6e4 && !V.has(K.address) && V.set(K.address, await t.chain.confirmedNonce(K.address)), S = V.get(K.address), S !== void 0 && S > BigInt(K.nonce)) {
            he({ ...K, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((K.status === "unknown" || K.status === "signed") && K.raw)
            try {
              await t.chain.broadcast(K.raw, K.txid), he({ ...K, status: "pending" });
            } catch (wt) {
              Ui(wt) && he({ ...K, status: "failed", note: wt.message, raw: void 0 });
            }
          continue;
        }
        et.delete(K.txid);
        const xt = String(mt.tx_status);
        if (xt === "success" && mt.canonical !== !1 && mt.is_unanchored === !1) {
          if (he({ ...K, status: "confirmed", confirmedAt: t.now(), actualFee: String(mt.fee_rate ?? K.fee), raw: void 0 }), F = !0, K.kind === "like" && (x = !0, K.status !== "confirmed" && typeof K.liked == "boolean"))
            try {
              (ft = t.likeConfirmed) == null || ft.call(t, K.song, K.liked);
            } catch {
            }
        } else xt.startsWith("abort_") || xt.startsWith("dropped_") ? he({ ...K, status: "failed", note: xt, raw: void 0 }) : K.status !== "pending" && he({ ...K, status: "pending" });
      } catch {
      }
    for (const K of xe() ? [y, pe()] : [y]) {
      const mt = N(K);
      if (mt)
        try {
          const xt = await t.chain.transaction(mt.txid), wt = String((xt == null ? void 0 : xt.tx_status) ?? "");
          (wt === "success" && xt.is_unanchored === !1 || wt.startsWith("abort_") || wt.startsWith("dropped_") || !xt && t.now() - mt.at > 2 * 36e5) && (gt(null, K), wt === "success" && We(2e4), a = -1 / 0, c = null, /on its way/i.test(E) && (E = ""));
        } catch {
        }
    }
    return F;
  }
  async function oe(y = !1) {
    var S;
    try {
      const F = Lt();
      if ((y || !e || r !== F || t.now() - n > 3e5) && (e = await t.config(F), n = t.now(), r = F), !e.enabled || !e.here || !R() && (!F || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), J && Vr(), t.changed();
        return;
      }
      await Kr(), i = await Bn(s), dt() && i.state === "unlocked" && (ze(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Bn(s)), F && e.allowed && await Ps(F), await Mn(y), await Ii(), await Li(), await Ns(), await je(), await ur() && await Mn(!0), await Ms(), await St(), U = 0;
    } catch {
      U++;
    }
    if (hn() === "locked" ? Ci() : J && Vr(), x) {
      x = !1;
      try {
        (S = t.likesChanged) == null || S.call(t);
      } catch {
      }
    }
    t.changed(), Yt.length && !Kt && gn();
  }
  async function Ao(y) {
    const S = i == null ? void 0 : i.root;
    if (!S || i != null && i.slot || !(i != null && i.address) || Xt("slots")) return;
    const F = Number(t.store.get(Tt("slot", S)));
    if (!(!Number.isSafeInteger(F) || F < 1))
      try {
        const { balance: V } = await t.chain.account(i.address);
        if (V >= Ve + Sn(kt())) return;
        await y.request("listening.openSlot", { slot: F }), i = await Bn(y), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function _s(y, S) {
    var K;
    zn();
    const F = !(i != null && i.address) || Xe(i.address), V = i != null && i.linked ? (K = t.nameOf) == null ? void 0 : K.call(t, i.linked) : void 0;
    await y.request("listening.unlock", { mode: "unlock", terms: F ? Yr() : void 0, anyPasskey: S, ...Lt() ? { main: Lt() } : {}, ...V ? { label: V } : {} }), i = await Bn(y), F && (Xe(i.address) ? await Br() : await y.request("listening.stop")), await Ao(y), ee(F ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const ft = p;
    p = null, ft && t.now() - ft.at < 12e4 && setTimeout(() => void oe(!0).then(() => Oe(ft)), 0);
  }
  function Ci() {
    J || u || ot || ct >= 3 || !s || !(i != null && i.address) || (J = !0, ue = (async () => {
      try {
        await _s(s, !1), ct = 0;
      } catch (y) {
        const S = y instanceof Error ? y.message : String(y);
        /Cancelled in the listening wallet/.test(S) ? It || (ot = !0, ee("Not now. Nothing was signed.")) : /did not answer/.test(S) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (ct++, L = S);
      } finally {
        J = !1;
        const y = It;
        It = null, y ? await y() : await oe(!0);
      }
    })());
  }
  async function Vr(y) {
    J && (It = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ue), y && await y(), t.changed();
  }
  const Yr = () => ({
    fee: kt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: vs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Br() {
    if (!(i != null && i.address)) return !1;
    if (O || (O = await t.tabLock(i.address)), !O)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function f(y, S) {
    const F = i.address, { balance: V, nonce: ft } = S ?? await t.chain.account(F);
    o = V;
    const K = await s.request("listening.prepareReturn", {
      mode: y.mode,
      balance: V.toString(),
      nonce: ft.toString(),
      fee: _o.toString(),
      ...y.amount !== void 0 ? { amount: y.amount.toString() } : {},
      ...y.linked ? {} : { destination: y.to }
    });
    if (K.recipient !== y.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const mt = y.mode === "amount" ? y.amount : y.mode === "all" ? V - _o : V - vs - _o, xt = Lc(K.raw);
    if (mr(xt.payload.recipient).value !== y.to || String(xt.payload.amount) !== K.amount || mt !== void 0 && K.amount !== mt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const wt = {
      id: Fl(),
      address: F,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: K.recipient,
      amount: K.amount,
      fee: K.fee,
      nonce: ft.toString(),
      created: t.now(),
      status: "signed",
      raw: K.raw,
      txid: K.txid
    };
    t.validate(wt), he(wt);
    try {
      await t.chain.broadcast(K.raw, K.txid), he({ ...wt, status: "pending" });
    } catch ($t) {
      throw he({ ...wt, status: "unknown", note: $t.message }), $t;
    }
    return K;
  }
  const m = ul, A = _o;
  async function h(y, S, F) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Xt("slots") || Xt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const V = i.slot ?? 0;
    if (y === S || ![y, S].includes(V) || ![y, S].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const ft = i.root ?? i.address, K = y === 0 ? ft : i.address, mt = S === 0 ? ft : i.address, { balance: xt, nonce: wt } = await t.chain.account(K);
    if (xt < F + A + Ve) throw new Error(y === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const $t = await s.request("listening.signMove", { from: y, to: S, amount: F.toString(), fee: A.toString(), nonce: wt.toString(), balance: xt.toString() }), ye = Lc($t.raw);
    if ($t.from !== K || $t.to !== mt || $t.amount !== F.toString() || mr(ye.payload.recipient).value !== mt || String(ye.payload.amount) !== F.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const yn = {
      id: Fl(),
      address: K,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: mt,
      amount: $t.amount,
      fee: $t.fee,
      nonce: wt.toString(),
      created: t.now(),
      status: "signed",
      raw: $t.raw,
      txid: $t.txid
    };
    t.validate(yn), he(yn);
    try {
      await t.chain.broadcast($t.raw, $t.txid), he({ ...yn, status: "pending" });
    } catch (Ge) {
      throw he({ ...yn, status: "unknown", note: Ge.message }), Ge;
    }
    return gt({ txid: $t.txid, amount: $t.amount, at: t.now() }, mt), mt === ft && ft !== i.address ? c = null : a = -1 / 0, $t;
  }
  let q = !1;
  const pt = /* @__PURE__ */ new Map(), ut = (y) => Tt("float", y);
  async function St() {
    if (q || (i == null ? void 0 : i.state) !== "unlocked" || !xe() || Xt("move") || Xt("rootLike") || !i.address) return;
    const y = i.address;
    if (t.store.get(ut(y)) === "1") return;
    const S = Jt();
    if (!(S != null && S.player) || S.state !== "arrived") return;
    const F = Rn();
    if (F === void 0 || o === void 0) return;
    if (!$(F)) {
      t.store.set(ut(y), "1");
      return;
    }
    if (N(pe()) || pn() || kn().length || o < m * 4n + Ve + A) return;
    const V = pt.get(y);
    if (!(V && (V.n >= 3 || t.now() - V.at < 5 * 6e4))) {
      q = !0, pt.set(y, { n: ((V == null ? void 0 : V.n) ?? 0) + 1, at: t.now() });
      try {
        await h(i.slot ?? 0, 0, m), t.store.set(ut(y), "1");
      } catch (ft) {
        console.warn("[radio] likes float not sent yet", ft);
      } finally {
        q = !1;
      }
    }
  }
  async function Qt(y) {
    if (Ce().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Xt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const S = await vi().catch(() => null);
    if (!S)
      throw W = null, vt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    vt = !1, o = S.balance;
    const F = { balance: S.balance, nonce: S.nonce };
    if (y === "excess") {
      const xt = B0(S.parts) ?? re();
      if (!xt) throw new Error("Choose where to send the excess first.");
      await f({ mode: "excess", to: xt, linked: !1 }, F), W = null, ee("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const V = S.steps;
    if (!V.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!W && W.balance === S.balance && t.now() - W.at <= Ze && W.steps.length === V.length && W.steps.every((xt, wt) => xt.to === V[wt].to && xt.mode === V[wt].mode && xt.send === V[wt].send))) {
      W = {
        at: t.now(),
        balance: S.balance,
        steps: V,
        parts: S.parts,
        plan: { state: "ready", steps: V.map((xt) => ({ to: xt.to, kind: xt.kind, send: xt.send.toString() })), kept: S.tooSmall, excess: B0(S.parts) }
      }, ee(V.length > 1 ? `This goes back in ${V.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const K = V[0], mt = K.to ?? re();
    if (!mt) throw new Error("Choose where to send the rest first.");
    if (K.mode === "amount" && Xt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await f({ mode: K.mode, to: mt, linked: !1, ...K.mode === "amount" ? { amount: K.send } : {} }, F), W = null, V.length === 1 ? (Cn(!1), ee("Returned ✓ Paying is off.")) : ee(`Returned ✓ ${V.length - 1} more ${V.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Te = {
    forceRefresh: () => oe(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (y) => {
      if (!t.main() && !(y !== null && !Fr(y))) {
        if (y === Dt()) return oe(!0);
        t.store.set(_e, y ?? ""), L = "", E = "", o = void 0, a = -1 / 0, c = null, await oe(!0);
      }
    },
    create: () => Ye("Waiting for your passkey…", async () => {
      const y = await Kr();
      await y.request("listening.unlock", { mode: "create", terms: Yr(), ...t.main() ? { main: t.main() } : {} }), i = await Bn(y), i.address && t.store.set(Tt("created", i.address), "1"), Cn(!0), ee(R() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Br();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (y) => {
      y ? We() : zt = null, t.changed();
    },
    giftSent: (y, S) => {
      !(i != null && i.address) || Ue() || (gt({ txid: y, amount: S.toString(), at: t.now() }), a = -1 / 0, T = null, ee("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (y) => {
      if (zn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Xt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Kr()).request("listening.bindSlot", { slot: y, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (y, S, F, V) => {
      gt({ txid: F, amount: V.toString(), at: t.now() }, S), T = null, await Te.openAlbum(y), ee("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (y) => Ye("Opening…", async () => {
      if (zn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Xt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || g) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === y) return;
      ze(), await s.request("listening.openSlot", { slot: y }), i = await Bn(s), o = void 0, a = -1 / 0, W = null, vt = !1;
      const S = i.root;
      S && y > 0 && t.store.set(Tt("slot", S), String(y)), ee(y === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (y = !1) => {
      const S = () => Ye("Waiting for your passkey…", async () => _s(await Kr(), y));
      return J ? y ? Xt("cancel") ? (ee("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Vr(async () => {
        (hn() === "locked" || hn() === "intro") && await S();
      }) : ue : S();
    },
    link: () => Ye("Sign in your wallet…", async () => {
      zn();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const S = (await t.links(y)).find((F) => F.listening === i.address);
      if (S)
        await s.request("listening.link", { main: y, issued: S.issued, mainSignature: S.mainSignature });
      else {
        const F = { main: y, listening: i.address, issued: t.now() }, V = await t.signWithMain(y, C5(F)), ft = await s.request("listening.link", { main: y, issued: F.issued, mainSignature: V });
        await t.saveLink({ ...F, mainSignature: V, listeningSignature: ft.listeningSignature }), it = -1 / 0;
      }
      ee("Linked ✓");
    }),
    deposit: () => Ye("Approve the deposit in your wallet…", async () => {
      zn();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Ue()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (dn()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Mn(!0);
      const S = Ol(o ?? 0n);
      if (S <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      D = await t.deposit(y, i.address, S), D && gt({ txid: D, amount: S.toString(), at: t.now() }), ee("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Ye("Approve the top-up in your wallet…", async () => {
      zn();
      const y = t.main(), S = pe();
      if (!y || !S) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (N(S)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const F = await t.chain.balance(S);
      xe() ? c = { for: S, value: F, at: t.now() } : (o = F, a = t.now());
      const V = Ol(F);
      if (V <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const ft = await t.deposit(y, S, V);
      ft && gt({ txid: ft, amount: V.toString(), at: t.now() }, S), ee("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (y) => Ye("Adding plays…", async () => {
      if (zn(), !xe()) throw new Error("Open the album you want to add plays to first.");
      if (!rc.includes(y)) throw new Error("Choose one of the amounts offered.");
      const S = O5(y, kt());
      if (d || l || g) throw new Error("Still sending a payment. Try again in a moment.");
      if (kn().length || Ue()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await h(0, i.slot ?? 0, S), ee("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Ye("Confirm in the listening wallet…", async () => {
      if (!ki()) throw new Error("Connect your wallet first.");
      await Br(), await s.request("listening.approveSession", Yr()), Cn(!0), ee("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Ye("Clearing…", async () => {
      for (const y of _())
        await t.chain.transaction(y.txid) || he({ ...y, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ee("Cleared ✓");
    }),
    switchOff: () => Ye("Switching off…", async () => {
      ze(), await (s == null ? void 0 : s.request("listening.stop")), Cn(!1), ee("Music support is off. Playback is paused.");
    }),
    lock: () => Ye("Locking…", async () => {
      ze(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, ee("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (y) => {
      const S = String(y ?? "").trim();
      if (!(i != null && i.address)) return ee("", "Unlock the listening wallet first.");
      if (!Fr(S)) return ee("", "Enter a standard mainnet address (it starts with SP).");
      if (S === i.address) return ee("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(At(i.address), S), ee("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(At(i.address), ""), t.changed();
    },
    returnFunds: (y) => Ye("Check the return in the listening wallet…", async () => {
      if (!ki()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Tr()) return Qt(y);
      const S = ie();
      if (!S) throw new Error(R() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (S.kind !== "linked" && Xt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Ce().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await f({ mode: y, to: S.to, linked: S.kind === "linked" }), y === "all" && Cn(!1), ee(y === "all" ? S.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Yt = [], Ut = 10, Be = 30 * 6e4;
  let Kt = !1;
  const pn = () => d || !!u || l || g, ze = () => {
    Yt.length && (Yt.length = 0, t.changed());
  };
  async function Qe(y) {
    if (!Yt.some((S) => S.id === y.id) && !vn().some((S) => S.id === y.id) && (Yt.push({ ...y, at: t.now() }), Yt.length > Ut && Yt.shift()), pn() || Ce().length) {
      const S = Yt.length;
      E = `Queued ${S === 1 ? "this song" : S + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await gn();
  }
  async function gn() {
    if (!Kt) {
      Kt = !0;
      try {
        for (; Yt.length; ) {
          for (; Yt.length && t.now() - Yt[0].at > Be; ) Yt.shift();
          if (!Yt.length || pn() || await Pn(Yt[0]) === "wait") return;
          Yt.shift();
        }
      } finally {
        Kt = !1, t.changed();
      }
    }
  }
  async function Pn(y) {
    var S;
    d = !0;
    try {
      await oe();
      const F = hn();
      if (F === "loading") return "wait";
      if (F !== "ready" || !Xe() || !(i != null && i.session) || i.session.playsLeft < 1 || !O) return "done";
      if (Ce().length) return "wait";
      I || (await t.chain.verify(), I = !0);
      const V = i.address, { balance: ft, nonce: K } = await t.chain.account(V);
      o = ft, a = t.now();
      const mt = await t.chain.owner(Dl, y.song);
      if (mt === V || mt === Lt()) return "done";
      const xt = await s.request("listening.signPlay", {
        core: Dl,
        song: y.song,
        receipt: y.id,
        fee: kt().toString(),
        nonce: K.toString(),
        balance: ft.toString()
      }), wt = {
        id: y.id,
        address: V,
        kind: "play",
        core: Dl,
        song: y.song,
        recipient: mt,
        amount: "50",
        fee: kt().toString(),
        nonce: K.toString(),
        created: t.now(),
        status: "signed",
        raw: xt.raw,
        txid: xt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(wt), he(wt);
      const $t = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`;
      try {
        await t.chain.broadcast(xt.raw, xt.txid), he({ ...wt, status: "pending" }), E = `♪ Paid ${$t}`, L = "";
      } catch (ye) {
        he({ ...wt, status: Ui(ye) ? "failed" : "unknown", note: ye.message, ...Ui(ye) ? { raw: void 0 } : {} }), L = ye.message;
      }
      return i = await Bn(s), "done";
    } catch (F) {
      const V = F instanceof Error ? F.message : "payment unavailable";
      return (S = Jt()) != null && S.player ? (E = "Payment is taking a moment: " + V, "wait") : (E = "This song played free: " + V, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function Jn(y) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(hn()) || Xt("like") ? !1 : (Oe(y), !0);
  }
  async function Oe(y) {
    const S = y.title ? `“${y.title}”` : `song #${y.song}`, F = (Je) => {
      var Mr;
      L = Je, E = "";
      try {
        (Mr = t.likeFailed) == null || Mr.call(t, y.song);
      } catch {
      }
      t.changed();
    }, V = xe(), ft = hn(), K = Lt(), mt = V && (ft === "fund" || ft === "over") ? "ready" : ft, xt = R() ? pe() : K;
    if (mt === "locked") {
      p = { ...y, at: t.now() }, ee(`Unlock to like ${S}. It sends straight after.`);
      return;
    }
    if (mt === "wrong-wallet") return F($i());
    if (mt === "link") return F("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (R() && Xt("standalone")) return F("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (mt === "fund") return F("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (mt === "over") return F("Return the excess first: the listening wallet holds more than 1 STX.");
    if (V) {
      await Ms(!0);
      const Je = Rn();
      if ($(Je))
        return t.changed(), F(Pc);
    }
    if (mt !== "ready" || !xt) return F("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return F("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!O) return F("Pay-per-play is running in another tab. Like from that tab.");
    const wt = vn(pe()).find((Je) => Je.kind === "like" && Je.song === y.song);
    if (wt && Uo.includes(wt.status))
      return F(`Your last like for ${S} is still on its way. It can change again once it confirms.`);
    if (l) return F("One like at a time: your last one is still being sent.");
    if ((wt == null ? void 0 : wt.status) === "confirmed" && t.now() - (wt.confirmedAt ?? 0) < F5)
      return F(`Your like for ${S} has only just confirmed. Try again in a moment.`);
    let $t;
    g = !0;
    try {
      $t = t.likeState ? (await t.likeState(xt, y.song)).by : y.likedBy ?? [];
    } catch {
      $t = y.likedBy;
    } finally {
      g = !1;
    }
    if (!$t) return F(`Could not check ${S} right now. Try the heart again.`);
    const ye = pe(), Ge = ((wt == null ? void 0 : wt.status) === "confirmed" && typeof wt.liked == "boolean" && t.now() - (wt.confirmedAt ?? wt.created) < 5 * 6e4 ? wt.liked : void 0) ?? $t.includes(ye);
    if (!Ge && $t.some((Je) => Je !== ye)) return F(R() ? `${S} was liked from another wallet of yours. Unlike it there.` : `${S} was liked from your main wallet${$t.includes(K) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await tr({ song: y.song, liked: !Ge, title: y.title, artist: y.artist });
  }
  async function tr(y) {
    var V, ft, K;
    if (l) {
      ee("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const S = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`, F = t.wait ?? ((mt) => new Promise((xt) => setTimeout(xt, mt)));
    try {
      ee(`${y.liked ? "Liking" : "Unliking"} ${S}…`);
      const mt = t.now() + 12e4;
      for (; d || (xe() ? vn(pe()).some((Ge) => Uo.includes(Ge.status)) : Ce().length); ) {
        if (t.now() > mt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await F(5e3), await oe(!0);
      }
      if (!xe() && hn() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const xt = pe(), { balance: wt, nonce: $t } = await t.chain.account(xt);
      if (xe() ? c = { for: xt, value: wt, at: t.now() } : (o = wt, a = t.now()), $(wt)) throw new Error(Pc);
      const ye = await s.request("listening.signLike", {
        song: y.song,
        liked: y.liked,
        fee: Hl.toString(),
        nonce: $t.toString(),
        balance: wt.toString()
      }), yn = {
        id: Fl(),
        address: xt,
        kind: "like",
        core: 0,
        song: y.song,
        liked: y.liked,
        recipient: "",
        amount: "0",
        fee: Hl.toString(),
        nonce: $t.toString(),
        created: t.now(),
        status: "signed",
        raw: ye.raw,
        txid: ye.txid,
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(yn), he(yn);
      try {
        await t.chain.broadcast(ye.raw, ye.txid), he({ ...yn, status: "pending" }), E = `${y.liked ? "♥ Liked" : "Unliked"} ${S}`, L = "";
        try {
          (V = t.likeSent) == null || V.call(t, y.song, y.liked);
        } catch {
        }
      } catch (Ge) {
        if (he({ ...yn, status: Ui(Ge) ? "failed" : "unknown", note: Ge.message, ...Ui(Ge) ? { raw: void 0 } : {} }), L = Ge.message, Ui(Ge)) try {
          (ft = t.likeFailed) == null || ft.call(t, y.song);
        } catch {
        }
      }
      i = await Bn(s);
    } catch (mt) {
      L = "Like not sent: " + (mt instanceof Error ? mt.message : "the listening wallet is unavailable");
      try {
        (K = t.likeFailed) == null || K.call(t, y.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), gn();
    }
  }
  return { snapshot: So, refresh: oe, onListened: Qe, heart: Jn, toggleLike: Oe, ...Te };
}
const Iw = ["Connect", "Passkey", "Link & fund", "Listen"], Lw = ["Passkey", "Add 1 STX", "Listen"], Zu = (t) => t ? Lw : Iw;
function R5(t) {
  if (t.solo) return z5(t);
  const e = Iw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
      const r = t.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function z5(t) {
  const e = Lw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
      const r = t.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function G5(t, e) {
  return !e || e.at >= Zu(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const K5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function V5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !K5(r.id)));
}
const Y5 = {}, q5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, X5 = (t) => {
  const e = Y5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, W5 = (t) => `/hiro/${t}`, Z5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Q5 = (t) => {
  const e = X5(t);
  if (e)
    return [Z5(e)];
  const n = q5[t];
  return typeof window < "u" ? [`${window.location.origin}${W5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, J5 = {}, M0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, t6 = "xtrata.log.enabled", e6 = "xtrata.log.level", n6 = "xtrata.log.tags", r6 = "xtrata.log.dedupe", Ka = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, s6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, i6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, o6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, a6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, c6 = () => {
  const t = J5 ?? {}, e = Ka(t6) ?? t.VITE_LOG_ENABLED, n = Ka(e6) ?? t.VITE_LOG_LEVEL, r = Ka(n6) ?? t.VITE_LOG_TAGS, s = Ka(r6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: s6(e),
    level: i6(n) ?? "warn",
    tags: a6(r),
    dedupe: o6(s)
  };
}, l6 = (t, e, n) => !t.enabled || M0[n] < M0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), u6 = (t, e, n, r) => {
  const s = c6();
  if (!l6(s, e, t) || d6(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, f6 = /* @__PURE__ */ new Set();
let P0 = null;
const d6 = (t, e, n, r, s) => (P0 !== t && (f6.clear(), P0 = t), !1), h6 = (t, e, n) => u6("debug", t, e, n), p6 = {}, g6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, y6 = (t) => {
  const e = p6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : g6[t];
}, w6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, b6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return w6.test(n) ? n : null;
}, m6 = (t) => t.replace(/\/+$/, ""), x6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), N0 = (t) => {
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
}, Hi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, S6 = (t) => {
  var c, u;
  let e;
  try {
    e = mr(x8(t));
  } catch {
    return null;
  }
  const n = Hi(e);
  if (!n || n.success === !1)
    return null;
  const r = Hi(n.value), s = Hi(r == null ? void 0 : r.value), i = Hi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = N0((c = Hi(i.name)) == null ? void 0 : c.value), a = N0((u = Hi(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : b6(`${o}.${a}`);
}, E6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${m6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [aw(Gy(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : S6(i.result);
}, A6 = async (t) => {
  const e = t.address.trim();
  if (!qi(e))
    return null;
  const n = y6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of Q5(t.network))
    try {
      return await E6({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return h6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: x6(r)
  }), null;
};
function v6(t, e, n = {}) {
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
const _0 = Object.freeze({
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
}), U0 = Object.freeze({ 139: "melophonic" });
function k6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(_0, n) ? _0[n] : Object.hasOwn(U0, n) ? U0[n] : e;
}
const H0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function $6(t, e = "") {
  return Object.hasOwn(H0, String(t)) ? H0[String(t)] : e;
}
const Cw = 10000n, dd = 1000000n, Nc = 3000n, I6 = (t, e) => `${t}#gift=${e}`, L6 = 100, Ho = (t, e = Cr) => t <= Ve ? 0 : Number((t - Ve) / Sn(e)), O0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Tw = "xtrata.xyz/radio/gifts", jl = L6, C6 = "Create a prefunded Xtrata radio gift batch", T6 = (t) => ({
  domain: di({ name: rn(Tw), version: rn("1"), "chain-id": Ar(1) }),
  message: di({
    purpose: rn(C6),
    creator: rn(t.creator),
    count: Ar(t.count),
    amount: Ar(BigInt(t.amount)),
    label: rn(t.label),
    issued: Ar(t.issued),
    ...t.player ? { player: rn(t.player) } : {}
  })
}), B6 = (t, e, n = Cr) => Ve + BigInt(t) * Sn(n) + (e ? ul : 0n), M6 = (t, e = Cr) => Number((dd - Ve - (t ? ul : 0n)) / Sn(e)), P6 = (t, e) => BigInt(t) * (e + Nc);
function N6(t, e, n, r = Cr) {
  const s = n ? ul : 0n, i = e > Ve + s ? e - Ve - s : 0n, o = Number(i / Sn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Tc,
    fees: BigInt(o) * r,
    reserve: Ve,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Nc,
    perCopy: e + Nc,
    total: P6(t, e)
  };
}
const _6 = (t) => t >= Cw && t <= dd, D0 = 40, U6 = "Create an Xtrata radio gift player", H6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function F0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && H6.test(t) : !n;
}
function O6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!F0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!F0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > D0) throw new Error(`A player holds 1 to ${D0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const D6 = (t) => Yp(Jp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), F6 = (t) => ({
  domain: di({ name: rn(Tw), version: rn("1"), "chain-id": Ar(1) }),
  message: di({
    purpose: rn(U6),
    admin: rn(t.admin),
    player: rn(t.hash),
    issued: Ar(t.issued)
  })
}), Ws = (t) => t.tracks.filter((e) => !e.hidden), j6 = (t) => t.tracks.find((e) => e.hidden) ?? null, R6 = [300, 500, 1e3], j0 = 1800, Rl = /* @__PURE__ */ new Map();
async function z6(t) {
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
function G6(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Rl.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Rl.set(t, { ...a, until: Date.now() + j0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Rl.delete(t), s();
      }, j0 + 50);
    }
  }, i;
}
const Es = (t, e, n, r, s) => G6(t, e, async () => await z6(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Os = "xtrata.radio.gift.incoming.v1", R0 = (t) => "xtrata.radio.gift.mine.v1:" + t, z0 = (t) => "xtrata.radio.gift.batches.v1:" + t, Et = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, yr = (t, e, n = "") => {
  const r = Et("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Va = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Yn = (t) => sr(t).replace(/\.?0+$/, "");
function K6(t) {
  let e = null;
  const n = ($) => [5e3, 1e4, 2e4, 3e4][$] ?? 6e4, r = (() => {
    try {
      const $ = new URL(location.href), _ = new URLSearchParams($.hash.slice(1)).get("gift") ?? $.searchParams.get("gift");
      return _ !== null && ($.searchParams.delete("gift"), history.replaceState(null, "", $.pathname + ($.search || ""))), O0(_) ? _ : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const $ = JSON.parse(t.store.get(Os) || "null");
      return O0($ == null ? void 0 : $.code) ? $.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(Os, JSON.stringify({ code: i, at: t.now() }));
    let $ = 0;
    const _ = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (G) => {
      const R = await G.json().catch(() => ({}));
      if (G.status === 404) {
        t.store.set(Os, null), e = { ...e, error: (R == null ? void 0 : R.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!G.ok) throw new Error("busy");
      const dt = R;
      e = { ...e, view: dt, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(dt.status) && t.store.set(Os, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void _(), n($++)));
    });
    _();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const $ = e == null ? void 0 : e.view;
    return !($ != null && $.player) || !o() ? null : { player: $.player, from: l($), plays: Ho(BigInt($.amount)) };
  }, c = () => {
    const $ = e == null ? void 0 : e.view;
    return !$ || $.player || !o() ? null : { plays: Ho(BigInt($.amount)), from: $.from ? t.who($.from) : null };
  }, u = () => {
    const $ = e == null ? void 0 : e.code;
    if (!$) return [];
    const _ = `${location.origin}${location.pathname}#gift=${$}`;
    return [Es("gift-pass-on", "Copy the link to pass on", () => _, "primary", t.changed)];
  }, d = () => {
    e = null, t.store.set(Os, null), t.changed();
  }, l = ($) => $.from ? t.who($.from) : $.label ? `Xtrata Radio · ${$.label}` : "Xtrata Radio";
  let g = {};
  const p = ($) => {
    if (g.box) return g.box;
    const _ = Et("div", "", "ppp-gift-check");
    g.box = _;
    const G = () => {
      const R = window.turnstile;
      !R || g.rendered || (g.rendered = !0, R.render(_, { sitekey: $, callback: (dt) => {
        g.token = dt, t.changed();
      }, "expired-callback": () => {
        g.token = void 0;
      } }));
    };
    if (window.turnstile) G();
    else {
      const R = document.createElement("script");
      R.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", R.async = !0, R.onload = G, document.head.append(R);
    }
    return _;
  }, x = ($) => {
    queueMicrotask(() => void $());
  };
  let E;
  async function L($) {
    var R, dt, At, re, Wt, ie, ge, Jt, je;
    if (!e || e.claiming || !$.listening) return;
    const _ = !!((R = e.view) != null && R.player);
    if (_ && !$.root) return;
    e.claiming = !0, e.error = void 0, (dt = t.claiming) == null || dt.call(t, !0), t.changed();
    const G = async (Ft) => {
      const yt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: g.token, ...Ft })
      });
      return { res: yt, r: await yt.json().catch(() => ({})) };
    };
    try {
      let Ft = 0, yt = $.listening, Gt;
      if (_) {
        const fe = Number((At = await t.json("/radio/gift/slots?root=" + encodeURIComponent($.root))) == null ? void 0 : At.next);
        if (!Number.isSafeInteger(fe) || fe < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Ft = fe;
        for (let Tn = 0; ; Tn++) {
          const Ze = await t.album.bind(Ft);
          if (yt = Ze.address, Gt = await G({ wallet: yt, binding: Ze }), Gt.res.status === 409 && /just taken/.test(((re = Gt.r) == null ? void 0 : re.error) || "") && Tn < 5) {
            Ft += 1;
            continue;
          }
          break;
        }
      } else Gt = await G({ wallet: yt });
      const { res: te, r: Re } = Gt;
      if (te.status === 503 && /sending another gift/.test((Re == null ? void 0 : Re.error) || "")) {
        e.waiting = !0, (Wt = t.claiming) == null || Wt.call(t, !0), clearTimeout(E), E = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!te.ok) {
        const fe = String((Re == null ? void 0 : Re.error) || "");
        if (te.status === 404 || te.status === 410 || te.status === 409 && /already had a gift|brand-new|already have this album/.test(fe))
          throw t.store.set(Os, null), new Error(fe || "This gift cannot be opened.");
        if (te.status === 429 || te.status === 403 || te.status === 400 && !/wallet number/i.test(fe)) throw new Error(fe || `Could not open the gift (${te.status}).`);
        const Ze = /topping up/.test(fe) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(fe) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(fe) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Ze), { retry: !0, slow: /topping up|not paid for yet/.test(fe) });
      }
      e.done = !0, t.store.set(Os, null), _ ? await t.album.arrived(Ft, yt, Re.txid, BigInt(Re.amount)) : t.giftSent(Re.txid, BigInt(Re.amount));
    } catch (Ft) {
      const yt = Ft, Gt = yt.name === "TypeError" || yt.name === "AbortError" || yt.name === "TimeoutError" || /wallet number/i.test(yt.message);
      if (yt.retry || Gt) {
        const te = e.tries ?? 0;
        e.tries = te + 1, e.retry = { text: yt.retry ? yt.message : "Still sending your gift… the network is slow, trying again." }, (ie = t.claiming) == null || ie.call(t, !0), clearTimeout(E), E = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, yt.slow ? 6e4 : n(te));
      } else
        e.error = yt.message, (ge = t.claiming) == null || ge.call(t, !1);
      g.token = void 0;
      try {
        (je = (Jt = window.turnstile) == null ? void 0 : Jt.reset) == null || je.call(Jt, g.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let U = null;
  function D($) {
    if (!$.listening || !$.depositPending || $.step !== "fund")
      return U = null, [];
    if (!U || U.wallet !== $.listening || t.now() - U.at > 3e4) {
      const G = $.listening;
      U = { ...(U == null ? void 0 : U.wallet) === G ? U : {}, wallet: G, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(G)).then((R) => {
        var dt, At;
        (U == null ? void 0 : U.wallet) === G && (U.state = (dt = R == null ? void 0 : R.gift) == null ? void 0 : dt.state, U.problem = ((At = R == null ? void 0 : R.gift) == null ? void 0 : At.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const _ = Et("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return _.title = `Network reply: ${U.problem}`, [_];
  }
  function v($, _, G = !1) {
    var ie, ge;
    const R = _.player, dt = BigInt(_.amount), At = G ? [] : [Et("p", `🎁 ${l(_)} sent you “${R.title}”${R.subtitle ? ` by ${R.subtitle}` : ""}: ${Ws(R).length} ${Ws(R).length === 1 ? "song" : "songs"} and ${Ho(dt).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!$.root && ["fund", "ready", "over", "link"].includes($.step))) {
      if (G) return At;
      if (At.push(Et("p", $.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : $.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), $.step === "intro") {
        const Jt = document.createElement("details");
        Jt.className = "ppp-how";
        const je = document.createElement("summary");
        je.textContent = "How does this work?", Jt.append(je, Et("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), At.push(Jt);
      }
      return At;
    }
    if ($.walletCannotAlbums)
      return At.push(Et("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), At;
    const Wt = (ge = (ie = $.gate) == null ? void 0 : ie.gifts) == null ? void 0 : ge.turnstileSiteKey;
    return Wt && !g.token ? At.push(Et("p", "One quick check and it is yours:", "ppp-mute"), p(Wt)) : !e.claiming && !e.error && !e.waiting && !e.retry && x(() => L($)), At.push(...H($, "Sending your album…")), At;
  }
  function H($, _) {
    const G = [];
    return e.claiming || e.waiting ? G.push(Et("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : _, "ppp-cyan")) : e.retry && G.push(Et("p", e.retry.text, "ppp-warn"), yr("Try now", () => {
      clearTimeout(E), e.retry = void 0, L($);
    }, "quiet")), e.error && /already have this album/i.test(e.error) ? G.push(Et("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), yr("Forget this gift link here", d, "quiet")) : e.error && G.push(Et("p", e.error, "ppp-bad"), yr("Try again", () => {
      e.error = void 0, L($);
    })), G;
  }
  const P = ($) => {
    var _;
    return !!e && !e.done && !e.error && o() && !!$.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !$.linked && !$.creditedTo && ($.createdHere || $.brandNew || !!((_ = e.view) != null && _.player)) && ($.balance ?? 0n) === 0n && !$.entries.length);
  };
  function tt($, _ = {}) {
    var je, Ft;
    const G = D($);
    if (!e || ["off", "elsewhere"].includes($.step)) return G;
    const R = e.view;
    if (e.error && !R) return [Et("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!R) return [Et("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return G;
    if (R.status === "claimed" || R.status === "claiming") return [Et("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(R.status)) return [Et("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (R.status === "pending-deposit") return [Et("p", `🎁 ${l(R)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (R.player) return [...v($, R, !!_.bare), ...G];
    if (!!$.listening && (!($.createdHere || $.brandNew) || !!$.linked || !!$.creditedTo || ($.balance ?? 0n) > 0n || $.entries.length > 0))
      return [Et("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), yr("Forget this gift link here", d, "quiet")];
    const At = BigInt(R.amount), re = Ho(At).toLocaleString(), Wt = Et(
      "p",
      `🎁 ${l(R)} sent you ${Yn(At)} STX of on-chain music: about ${re} paid plays.`,
      "ppp-gift"
    ), ie = _.bare ? [] : [Wt], ge = !!$.listening && ($.createdHere || $.brandNew) && !$.linked && !$.creditedTo && $.step === "fund" && ($.balance ?? 1n) === 0n && !$.depositPending && !$.entries.length, Jt = (Ft = (je = $.gate) == null ? void 0 : je.gifts) == null ? void 0 : Ft.turnstileSiteKey;
    return ge ? (Jt && !g.token ? ie.push(Et("p", "One quick check and it is yours:", "ppp-mute"), p(Jt)) : !e.claiming && !e.error && !e.waiting && !e.retry && x(() => L($)), ie.push(...H($, "Sending your gift…"))) : $.step === "intro" ? _.bare || ie.push(Et("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : $.listening && $.linked ? ie.push(Et("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), yr("Forget this gift link here", d, "quiet")) : $.listening && ($.balance ?? 0n) > 0n && ie.push(Et("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), yr("Forget this gift link here", d, "quiet")), ie;
  }
  async function it($, _, G) {
    var R;
    try {
      const dt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent($));
      if ((R = dt == null ? void 0 : dt.gift) != null && R.returnTo) return { ok: !0, funder: dt.gift.returnTo, txId: dt.gift.txid ?? void 0, amount: dt.gift.amount, distinct: 1 };
    } catch {
      if (G) return { ok: !1 };
    }
    return _();
  }
  const et = Et("div", "", "ppp-gift-fold");
  let X = 250000n, k = "", B = "";
  const b = ($) => {
    try {
      const _ = JSON.parse(t.store.get(R0($)) || "[]");
      return Array.isArray(_) ? _ : [];
    } catch {
      return [];
    }
  }, C = ($, _) => t.store.set(R0($), JSON.stringify(_.slice(0, 50)));
  async function z($) {
    const _ = b($);
    for (const G of _)
      if (!(G.view && ["claimed", "refunded", "expired"].includes(G.view.status)))
        try {
          G.view = !G.view || G.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: G.id, ...G.txid ? { txid: G.txid } : {} }) }) : await t.json("/radio/gift?id=" + G.id), G.error = void 0;
        } catch (R) {
          G.error = R.message;
        }
    C($, _), t.changed();
  }
  async function T($) {
    if (k) return;
    k = "Starting your gift…", B = "", t.changed();
    let _ = null;
    try {
      _ = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: $, amount: X.toString() }) });
      const G = b($);
      G.unshift({ id: _.id, code: _.code, amount: X.toString(), at: t.now() }), C($, G), k = "Approve the gift in your wallet…", t.changed();
      const R = await t.pay($, _.depositTo, BigInt(_.deposit), _.memo), dt = b($), At = dt.find((re) => re.id === _.id);
      At && (At.txid = R, At.view = { status: "pending-deposit", amount: X.toString(), source: "friend", from: $, label: "", expires: 0 }), C($, dt), B = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", z($);
    } catch (G) {
      B = G.message || "Not sent.";
    } finally {
      k = "", t.changed();
    }
  }
  const st = ($) => "xtrata.radio.gift.players.v1:" + $, W = ($) => {
    try {
      const _ = JSON.parse(t.store.get(st($)) || "[]");
      return Array.isArray(_) ? _.filter((G) => G && /^[0-9a-f]{16}$/.test(G.id)) : [];
    } catch {
      return [];
    }
  };
  async function vt($, _) {
    var G;
    if (!k) {
      k = "Checking the player…", B = "", t.changed();
      try {
        const R = _.tracks.split(/[\s,]+/).filter(Boolean).map((ge) => Number(ge.replace(/^#/, ""))), dt = O6({ title: _.title.trim(), subtitle: _.subtitle.trim(), tracks: R, cover: (G = _.cover) != null && G.trim() ? Number(_.cover.trim().replace(/^#/, "")) : null });
        k = "Sign in your wallet…", t.changed();
        const At = { admin: $, hash: D6(dt), issued: t.now() }, re = await t.sign($, F6(At));
        k = "Making the player…", t.changed();
        const Wt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: dt, request: At, signature: re }) }), ie = W($).filter((ge) => ge.id !== Wt.id);
        ie.unshift({ id: Wt.id, title: Wt.title, tracks: Wt.tracks }), t.store.set(st($), JSON.stringify(ie.slice(0, 30))), B = `${Wt.existing ? "That player already exists" : "Player made"} ✓ “${Wt.title}” · ${Wt.tracks} songs. Pick it below for a batch.`;
      } catch (R) {
        B = R.message || "Not made.";
      } finally {
        k = "", t.changed();
      }
    }
  }
  const I = ($, _) => I6($ || location.origin + "/radio.html", _), O = ($) => {
    try {
      const _ = JSON.parse(t.store.get(z0($)) || "[]");
      return Array.isArray(_) ? _.filter((G) => G && /^[0-9a-f]{16}$/.test(G.id) && Array.isArray(G.codes)) : [];
    } catch {
      return [];
    }
  }, J = ($, _) => t.store.set(z0($), JSON.stringify(_.slice(0, 20))), ot = ($) => !!$.view && $.view.status === "live" && $.view.copies.waiting + $.view.copies.claiming + $.view.copies.refunding === 0, ct = ($, _) => t.json($, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(_) });
  let It = 0;
  async function ue($) {
    const _ = O($);
    for (const G of _)
      if (!ot(G))
        try {
          G.view = !G.view || G.view.status === "pending-deposit" ? await ct("/radio/gift/batch/confirm", { id: G.id, ...G.txid ? { txid: G.txid } : {} }) : await t.json("/radio/gift/batch?id=" + G.id), G.error = void 0;
        } catch (R) {
          G.error = R.message;
        }
    try {
      const G = await t.json("/radio/gift/batches?creator=" + encodeURIComponent($));
      for (const R of (G == null ? void 0 : G.batches) ?? []) {
        const dt = _.find((At) => At.id === R.id);
        if (dt) {
          dt.error || (dt.view = R);
          continue;
        }
        _.push({ id: R.id, codes: [], count: R.count, amount: R.amount, label: R.label, player: R.player, depositTo: "", deposit: R.deposit, memo: R.memo, at: 0, view: R });
      }
    } catch {
    }
    J($, _), t.changed();
  }
  async function kt($, _) {
    const G = O($).find((R) => R.id === _);
    if (!(!G || !G.depositTo || k)) {
      k = "Approve the payment in your wallet…", B = "", t.changed();
      try {
        const R = await t.pay($, G.depositTo, BigInt(G.deposit), G.memo), dt = O($), At = dt.find((re) => re.id === _);
        At && (At.txid = R), J($, dt), B = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", k = "", ue($);
      } catch (R) {
        B = `${/cancel/i.test(R.message) ? "Payment cancelled." : R.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        k = "", t.changed();
      }
    }
  }
  async function Xt($, _, G, R) {
    if (k) return;
    if (!_.ok) {
      B = _.reason, t.changed();
      return;
    }
    k = "Sign in your wallet…", B = "", t.changed();
    let dt = null;
    try {
      const At = { creator: $, count: _.count, amount: _.amount.toString(), label: G, issued: t.now(), ...R ? { player: R } : {} }, re = await t.sign($, T6(At));
      k = "Making your links…", t.changed(), dt = await ct("/radio/gift/batch", { request: At, signature: re });
      const Wt = O($);
      Wt.unshift({ id: dt.id, codes: dt.codes, count: _.count, amount: dt.amount, label: G, player: R ?? null, depositTo: dt.depositTo, deposit: dt.deposit, memo: dt.memo, at: t.now() }), J($, Wt);
    } catch (At) {
      B = At.message || "Not made.", k = "", t.changed();
      return;
    }
    k = "", t.changed(), await kt($, dt.id);
  }
  function Tt() {
    const $ = !!gt.value, _ = zt.value === "max" ? M6($) : Number(zt.value), G = B6(_, $), R = Number(We.value);
    return !Number.isInteger(R) || R < 1 || R > jl ? { ok: !1, reason: `Make 1 to ${jl} copies at a time.`, album: $, plays: _, amount: G, count: R } : _6(G) ? { ok: !0, reason: "", album: $, plays: _, amount: G, count: R, bill: N6(R, G, $) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: $, plays: _, amount: G, count: R };
  }
  const _e = () => {
    const $ = Tt();
    if (!$.ok) return $.reason;
    const _ = $.bill;
    return `Each copy: ${$.plays.toLocaleString()} paid plays (${Yn(_.holders)} to song holders, ${Yn(_.fees)} network fees)${$.album ? `, ${Yn(_.float)} for the album’s likes` : ""}, ${Yn(_.reserve)} kept so a listener can return what is left, + ${Yn(_.sendFee)} to send it = ${Yn(_.perCopy)} STX. ${$.count} copies = ${Yn(_.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Dt = ($, _) => _.codes.map((G) => I($, G)), Lt = Et("input");
  Lt.type = "range", Lt.min = String(Cw), Lt.max = String(dd), Lt.step = "10000", Lt.value = String(X), Lt.setAttribute("aria-label", "Gift amount");
  const vn = Et("p", "", "ppp-gift-amount"), he = yr("", () => {
    const $ = t.main();
    $ && T($);
  }, "primary"), Xe = () => {
    vn.textContent = Cn(), he.textContent = `Gift ${Yn(X)} STX`;
  };
  Lt.oninput = () => {
    X = BigInt(Lt.value), Xe();
  };
  const Cn = () => `${Yn(X)} STX · about ${Ho(X).toLocaleString()} paid plays · you pay ${Yn(X + Nc)} STX with the network fee`;
  Xe();
  const Ce = Et("input");
  Ce.maxLength = 60, Ce.placeholder = "Title, e.g. Proof of Sound", Ce.setAttribute("aria-label", "Player title");
  const kn = Et("input");
  kn.maxLength = 80, kn.placeholder = "Artist (optional)", kn.setAttribute("aria-label", "Player subtitle");
  const Ue = Et("textarea");
  Ue.rows = 3, Ue.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ue.setAttribute("aria-label", "Songs");
  const N = Et("input");
  N.inputMode = "numeric", N.placeholder = "Cover inscription number (optional), shown when the album loads", N.setAttribute("aria-label", "Cover inscription");
  const gt = Et("select");
  gt.setAttribute("aria-label", "Batch album");
  const zt = Et("select");
  zt.setAttribute("aria-label", "Plays per copy");
  for (const $ of R6) zt.append(Va(`${$.toLocaleString()} plays`, String($)));
  zt.append(Va("Max (1 STX)", "max"));
  const We = Et("input");
  We.type = "number", We.min = "1", We.max = String(jl), We.value = "10", We.setAttribute("aria-label", "Copies");
  const dn = Et("input");
  dn.maxLength = 40, dn.placeholder = "Label, e.g. Opera launch", dn.setAttribute("aria-label", "Batch label");
  const He = Et("p", "", "ppp-mute"), pe = () => {
    He.textContent = _e();
  };
  for (const $ of [gt, zt, We])
    $.oninput = pe, $.onchange = pe;
  pe();
  function xe($) {
    var dt, At;
    const _ = (dt = $.gate) == null ? void 0 : dt.gifts;
    if (!(_ != null && _.enabled) || !_.admin || ["off", "elsewhere", "unsupported"].includes($.step)) return null;
    const G = t.main(), R = [Et("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!G)
      R.push(Et("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (_.admin) {
      const re = Et("div", "", "ppp-gift-admin"), Wt = (Ft, yt) => {
        const Gt = Et("label", Ft);
        return Gt.append(yt), Gt;
      }, ie = W(G);
      re.append(
        Et("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Ce,
        kn,
        Ue,
        N,
        yr("Sign and make player", () => void vt(G, { title: Ce.value, subtitle: kn.value, tracks: Ue.value, cover: N.value }))
      );
      const ge = yr("Sign, pay and make links", () => {
        Xt(G, Tt(), dn.value.trim(), gt.value || void 0);
      });
      ge.disabled = !!k;
      const Jt = gt.value;
      gt.replaceChildren(Va("No album (starter copies)", ""), ...ie.map((Ft) => Va(`${Ft.title} · ${Ft.tracks} songs`, Ft.id))), ie.some((Ft) => Ft.id === Jt) && (gt.value = Jt), pe(), re.append(
        Et("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        Wt("Album ", gt),
        Wt("Plays each ", zt),
        Wt("Copies ", We),
        dn,
        He,
        ge
      ), t.now() - It > 3e4 && (It = t.now(), ue(G));
      const je = O(G);
      if (je.length) {
        const Ft = Et("ul", "", "ppp-gift-list");
        for (const yt of je.slice(0, 10)) {
          const Gt = yt.view, te = Gt == null ? void 0 : Gt.copies, Re = yt.error ? yt.error : !Gt || Gt.status === "pending-deposit" ? yt.txid ? "payment confirming…" : "waiting for your payment" : `${te.claimed} of ${Gt.count} claimed${te.refunding + te.refunded ? ` · ${te.refunded} refunded${te.refunding ? `, ${te.refunding} on their way` : ""}` : ""}`, fe = Et("li");
          if (fe.append(Et("span", `${yt.label || "Batch"} · ${yt.count} × ${Yn(BigInt(yt.amount))} STX`, "t"), Et("span", Re, "ppp-mute")), !yt.txid && yt.depositTo && (!Gt || Gt.status === "pending-deposit") && fe.append(yr("Pay now", () => void kt(G, yt.id), "tiny")), yt.codes.length && (Gt == null ? void 0 : Gt.status) === "live") {
            const Tn = Dt(((At = $.gate) == null ? void 0 : At.radioUrl) ?? null, yt);
            fe.append(
              Es("batch-copy:" + yt.id, "Copy all links", () => Tn.join(`
`), "tiny", t.changed),
              Es("batch-csv:" + yt.id, "Copy as CSV", () => ["copy,link", ...Tn.map((Ze, Tr) => `${Tr + 1},${Ze}`)].join(`
`), "tiny", t.changed)
            );
          } else yt.codes.length || fe.append(Et("span", "links were made on another device", "ppp-mute"));
          Ft.append(fe);
        }
        re.append(Ft);
      }
      R.push(re);
    }
    return k && R.push(Et("p", k, "ppp-cyan")), B && R.push(Et("p", B, /✓/.test(B) ? "ppp-ok" : "ppp-warn")), et.replaceChildren(...R), et;
  }
  return { banner: tt, funder: it, renderFold: xe, liveGift: o, incomingAlbum: a, incomingStarter: c, setAside: d, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: P };
}
const V6 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function Y6(t) {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, s = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    s && e.push({
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
  return e;
}
const q6 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function X6(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = q6(i);
    return n.every((a) => o.includes(a));
  })()), s = {
    recent: (i, o) => (e.recents[o.slot] ?? 0) - (e.recents[i.slot] ?? 0) || o.slot - i.slot,
    newest: (i, o) => o.slot - i.slot,
    oldest: (i, o) => i.slot - o.slot,
    title: (i, o) => {
      var a, c;
      return (((a = i.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = o.player) == null ? void 0 : c.title) ?? "") || i.slot - o.slot;
    }
  };
  return r.sort((i, o) => Number(e.pins.has(o.slot)) - Number(e.pins.has(i.slot)) || s[e.sort](i, o));
}
function W6(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Qu = /* @__PURE__ */ new Set(), Bw = (t) => (Qu.add(t), () => {
  Qu.delete(t);
}), Ju = () => {
  for (const t of [...Qu])
    try {
      t();
    } catch {
    }
}, G0 = "xtrata:al-thumb:v1:", Mw = "-", Oo = 96, Z6 = 24 * 1024 * 1024, wn = /* @__PURE__ */ new Map(), K0 = /* @__PURE__ */ new Set(), tf = [];
let zl = !1, Gl;
const _c = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(G0 + t);
    window.localStorage.setItem(G0 + t, e);
  } catch {
  }
  return null;
};
function hd(t) {
  return new Promise((e) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return e(t);
      const i = new Image(), o = setTimeout(() => e(t), 8e3);
      i.onload = () => {
        clearTimeout(o);
        try {
          const a = Math.min(i.naturalWidth, i.naturalHeight);
          if (!a) return e(t);
          r.width = r.height = Oo, s.fillStyle = "#143a40", s.fillRect(0, 0, Oo, Oo), s.drawImage(i, (i.naturalWidth - a) / 2, (i.naturalHeight - a) / 2, a, a, 0, 0, Oo, Oo), e(r.toDataURL("image/jpeg", 0.82));
        } catch {
          e(t);
        }
      }, i.onerror = () => {
        clearTimeout(o), e(t);
      }, i.src = t;
    } catch {
      e(t);
    }
  });
}
async function Q6(t) {
  var c, u, d, l, g;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((c = e.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = e.body) == null ? void 0 : u.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((d = e.body) == null ? void 0 : d.cancel()), "";
  let r = "", s = 0;
  const i = (p) => {
    let x = 0;
    for (; ; ) {
      const E = r.slice(x).search(/<img\b/i);
      if (E < 0)
        return r = p ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const L = x + E, U = r.indexOf(">", L);
      if (U < 0)
        return r = r.slice(L), null;
      const D = r.slice(L, U + 1), v = D.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (v) return v[1].replace(/&amp;/g, "&");
      const H = D.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (H) return "/inscription/" + H[1];
      x = U + 1;
    }
  }, o = (g = (l = e.body) == null ? void 0 : l.getReader) == null ? void 0 : g.call(l);
  if (!o)
    return r = await e.text(), i(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: p, value: x } = await o.read();
    if (p) break;
    s += x.byteLength, r += a.decode(x, { stream: !0 });
    const E = i(!1);
    if (E)
      return await o.cancel(), E;
    if (s > Z6)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function J6() {
  if (!zl) {
    zl = !0;
    try {
      for (; tf.length; ) {
        const t = tf.shift();
        if (!wn.has(t))
          try {
            const e = await Q6(t);
            if (e === null) continue;
            if (!e) {
              wn.set(t, ""), _c(t, Mw), Ju();
              continue;
            }
            const n = await hd(e);
            wn.set(t, n), n.startsWith("data:image/jpeg") && _c(t, n), Ju();
          } catch {
          }
      }
    } finally {
      zl = !1;
    }
  }
}
function Pw(t, e) {
  if (e && !wn.get(t) ? (wn.set(t, e), hd(e).then((r) => {
    r !== e && (wn.set(t, r), r.startsWith("data:image/jpeg") && _c(t, r), Ju());
  })) : e === "" && !wn.has(t) && wn.set(t, ""), wn.has(t)) return wn.get(t);
  const n = _c(t);
  if (n != null) {
    const r = n === Mw ? "" : n;
    return wn.set(t, r), r;
  }
  return K0.has(t) || (K0.add(t), tf.push(t), Gl || (Gl = setTimeout(() => {
    Gl = void 0, J6();
  }, 1200))), "";
}
const Oi = 12, t$ = 5e3, cn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Di = (t, e, n = "") => {
  const r = cn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function e$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = Oi;
  const l = cn("div", "", "ppp-shelf-box");
  Bw(() => t.changed());
  const g = (b) => "xtrata.radio.shelf.pins.v1:" + b, p = (b) => "xtrata.radio.shelf.recent.v1:" + b, x = (b, C) => {
    try {
      return JSON.parse(t.store.get(b) || "null") ?? C;
    } catch {
      return C;
    }
  }, E = (b) => new Set(x(g(b), []).filter((C) => Number.isSafeInteger(C))), L = (b) => {
    const C = x(p(b), {}), z = {};
    for (const [T, st] of Object.entries(C)) Number.isSafeInteger(Number(T)) && typeof st == "number" && (z[Number(T)] = st);
    return z;
  };
  async function U(b) {
    if (!s) {
      s = !0, i = !1;
      try {
        const C = [];
        let z = 0, T = 0;
        for (let st = 0; st < t$ / 100 + 1; st++) {
          const W = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(b)}&after=${z}&limit=100`);
          if (C.push(...Y6(W == null ? void 0 : W.shelf)), T = Number(W == null ? void 0 : W.total) || C.length, !(W != null && W.next) || !Number.isSafeInteger(W.next)) break;
          z = W.next;
        }
        b === e && (n = C, r = T, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const D = () => {
    o = -1 / 0;
  }, v = cn("input");
  v.type = "search", v.placeholder = "Search title, artist or #", v.setAttribute("aria-label", "Search your albums"), v.oninput = () => {
    a = v.value, d = Oi, t.changed();
  };
  const H = cn("select");
  H.setAttribute("aria-label", "Sort albums");
  for (const b of V6) {
    const C = document.createElement("option");
    C.value = b.value, C.textContent = b.label, H.append(C);
  }
  H.onchange = () => {
    c = H.value, d = Oi, t.changed();
  };
  const P = Di("", () => {
    u = !u, d = Oi, t.changed();
  }, "tiny"), tt = cn("div", "", "ppp-shelf-tools");
  tt.append(v, H, P);
  const it = cn("div"), et = cn("div");
  function X(b) {
    const C = b.step === "off" || b.step === "elsewhere" ? void 0 : b.root;
    if (C !== e && (e = C, n = [], r = 0, o = -1 / 0, d = Oi), !C || b.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && U(C), !n.length)
      return i ? (et.replaceChildren(cn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Di("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(et), l) : null;
    const z = E(C), T = L(C), st = X6(n, { query: a, sort: c, pinnedOnly: u, pins: z, recents: T });
    v.value !== a && (v.value = a), H.value = c, P.textContent = u ? "★ Pinned only" : "☆ Pinned only", P.setAttribute("aria-pressed", String(u));
    const W = [];
    if (b.slot > 0 && W.push(Di("← My player", () => t.open(0), "quiet")), !st.length) W.push(cn("p", "No album matches that.", "ppp-mute"));
    else {
      const vt = cn("ul", "", "ppp-shelf-list");
      for (const I of st.slice(0, d)) {
        const O = cn("li", "", I.slot === b.slot ? "now" : ""), J = z.has(I.slot), ot = Di(J ? "★" : "☆", () => {
          const Lt = new Set(z);
          J ? Lt.delete(I.slot) : Lt.add(I.slot), t.store.set(g(C), JSON.stringify([...Lt])), t.changed();
        }, "tiny");
        ot.setAttribute("aria-label", J ? `Unpin ${I.player.title}` : `Pin ${I.player.title}`);
        const ct = [I.player.subtitle, `${Ws(I.player).length} ${Ws(I.player).length === 1 ? "song" : "songs"}`, I.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), It = I.slot === b.slot, ue = Di(It ? "Playing" : "Select", () => {
          t.store.set(p(C), JSON.stringify(W6({ ...T, [I.slot]: t.now() }))), t.open(I.slot);
        }, It ? "tiny ppp-pick" : "tiny primary ppp-pick");
        ue.disabled = It;
        const kt = Ws(I.player)[0], Xt = I.player.cover ?? (kt == null ? void 0 : kt.id), Tt = Xt ? Pw(String(Xt)) : "", _e = cn("span", "", "ppp-shelf-art");
        if (Tt) {
          const Lt = document.createElement("img");
          Lt.src = Tt, Lt.alt = "", Lt.decoding = "async", _e.append(Lt);
        } else _e.textContent = "💿";
        const Dt = cn("span", "", "ppp-shelf-txt");
        Dt.append(cn("span", I.player.title, "t"), cn("span", ct, "ppp-mute")), O.append(ot, _e, Dt, ue), vt.append(O);
      }
      W.push(vt), st.length > d && W.push(Di(`Show more (${st.length - d} left)`, () => {
        d += Oi, t.changed();
      }, "quiet"));
    }
    return i && W.push(cn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), it.replaceChildren(...W), l.firstChild !== tt && l.replaceChildren(tt, it), l;
  }
  return { render: X, invalidate: D, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const b = L(e), C = [...n].filter((z) => z.player).sort((z, T) => (b[T.slot] ?? 0) - (b[z.slot] ?? 0) || T.slot - z.slot)[0];
    return C ? { slot: C.slot, title: C.player.title } : null;
  } };
}
const n$ = 20, nn = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, ke = {
  grid: nn('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: nn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: nn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: nn('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: nn('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: nn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: nn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: nn('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: nn('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: nn('<path d="M6 9l6 6 6-6"/>', 18),
  right: nn('<path d="M9 6l6 6-6 6"/>', 16),
  close: nn('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: nn('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: nn('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: nn('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: nn('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: nn('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const an = (t, ...e) => Q("button", { type: "button", ...t }, ...e), Ya = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Do = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, r$ = { music: "My music", device: "This device", gifts: "Albums (admin)" }, s$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function V0(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function d(b) {
    var z, T, st;
    if (!b || !Number.isSafeInteger(b)) return "";
    const C = (st = (T = (z = e.radio()) == null ? void 0 : z.getState) == null ? void 0 : T.call(z)) == null ? void 0 : st.albumCover;
    return C != null && C.url && Number(C.tokenId) === b ? C.url : c.has(b) ? c.get(b) : (u.has(b) || (u.add(b), fetch("/inscription/" + b, { signal: AbortSignal.timeout(2e4) }).then(async (W) => {
      var I, O, J, ot;
      const vt = (W.headers.get("content-type") || "").toLowerCase();
      if (!W.ok)
        throw await ((I = W.body) == null ? void 0 : I.cancel()), new Error("no cover");
      return vt.startsWith("image/") ? (await ((O = W.body) == null ? void 0 : O.cancel()), "/inscription/" + b) : vt.includes("text/html") ? (((J = (await W.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : J[1]) ?? "").replace(/&amp;/g, "&") : (await ((ot = W.body) == null ? void 0 : ot.cancel()), "");
    }).then((W) => {
      c.set(b, W), B();
    }).catch(() => {
      u.delete(b);
    })), "");
  }
  Bw(() => B());
  function l(b) {
    var z;
    i = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const C = document.querySelector(".side");
    if (b && b !== "more") {
      for (const W of s$[b]) {
        const vt = C == null ? void 0 : C.querySelector(W);
        vt && (vt.open = !0);
      }
      const T = document.getElementById("sheetTitle");
      T && (T.textContent = r$[b]);
      const st = document.getElementById("sheetExtra");
      st && st.replaceChildren(...b === "music" ? [p()] : []), (z = C == null ? void 0 : C.scrollTo) == null || z.call(C, { top: 0 });
    }
    B();
  }
  const g = r ? null : document.getElementById("sheetClose");
  g && (g.onclick = () => l("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const p = () => an(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: ke.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: ke.right })
  );
  let x = null, E = !1;
  const L = () => {
    var C;
    const b = e.radio();
    E || !(b != null && b.subscribe) || (E = !0, b.subscribe((z) => {
      x = z, (s == null ? void 0 : s.mode) === "open" && B();
    }), x = ((C = b.getState) == null ? void 0 : C.call(b)) ?? null);
  };
  r || setInterval(() => {
    var T, st;
    if ((s == null ? void 0 : s.mode) !== "open" || !(x != null && x.playing)) return;
    const b = (st = (T = e.radio()) == null ? void 0 : T.getPosition) == null ? void 0 : st.call(T), C = t.querySelector(".al-bar > i"), z = t.querySelectorAll(".al-times span");
    !b || !C || (C.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", z.length === 2 && (z[0].textContent = Ya(b.current || 0), z[1].textContent = b.duration ? Ya(b.duration) : "–:––"));
  }, 500);
  let U = "", D = null;
  function v(b, C, z = {}) {
    const T = z.song || d(b.cover), W = [T ? Q("img", { src: T, alt: z.song ? "Song artwork" : `${b.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, b.title), b.subtitle ? Q("span", {}, b.subtitle) : null), z.paused ? Q("span", { class: "al-paused" }, Q("i", { html: ke.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], vt = "al-cover" + (C ? "" : " al-cover--small") + (z.paused ? " is-paused" : "");
    return z.flip ? (W.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: ke.flip })), an({ class: vt + " is-flippable", "aria-label": z.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: z.flip }, ...W)) : Q("div", { class: vt }, ...W);
  }
  function H(b) {
    return b.plays === null || b.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (b.plays <= n$ ? " al-chip--low" : "") }, `${Do(b.plays, "play", "plays")} left`);
  }
  function P(b) {
    const C = b.player, z = C.tracks.filter((st) => !st.hidden), T = [];
    return b.mode === "arrive" && b.from && T.push(Q("p", { class: "al-from" }, Q("span", { html: ke.gift }), Q("span", {}, Q("b", {}, b.from), " sent you an album"))), T.push(v(C, !0)), T.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, C.title),
      C.subtitle ? Q("p", { class: "al-artist" }, C.subtitle) : null,
      z.length ? Q("p", { class: "al-songline" }, z.map((st) => st.title || `#${st.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [Do(z.length, "song", "songs"), b.offered ? Do(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && T.push(Q("div", { class: "al-status", role: "status" }, ...b.status)), T.push(Q("div", { class: "al-grow" })), b.asking ? T.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && T.push(an({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, Q("span", { html: ke.playSmall }), b.primary.label)), b.hint && !b.asking && T.push(Q("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && T.push(an({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), T;
  }
  function tt(b, C) {
    const { songs: z, current: T, started: st, own: W, out: vt, waiting: I } = C, O = b.player, J = e.radio(), ot = [];
    ot.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, O.title), ` · ${Do(z.length, "song", "songs")}`), H(b)));
    const ct = d(O.cover), It = "album:" + O.cover;
    ct && !wn.has(It) && (wn.set(It, ct), hd(ct).then((kt) => {
      kt !== ct && (wn.set(It, kt), B());
    }));
    const ue = ct ? wn.get(It) || ct : "";
    return ot.push(Q("ol", { class: "al-tracks" }, ...z.map((kt, Xt) => {
      const Tt = String(kt.id) === T, _e = Pw(String(kt.id), Tt && st ? W : void 0);
      return Q("li", {}, an(
        { class: "al-track" + (Tt ? " is-on" : ""), "aria-label": `Play ${kt.title || "#" + kt.id}`, "aria-current": Tt ? "true" : void 0, disabled: vt || I, onClick: () => {
          var Dt;
          return (Dt = J == null ? void 0 : J.playToken) == null ? void 0 : Dt.call(J, kt.id);
        } },
        Q(
          "span",
          { class: "al-th" + (_e ? "" : " is-blank") },
          _e ? Q("img", { src: _e, alt: "", decoding: "async" }) : ue ? Q("img", { src: ue, alt: "", decoding: "async" }) : null,
          _e ? null : Q("span", { class: "al-n" }, String(Xt + 1)),
          Tt ? Q("span", { class: "al-eq", html: ke.eq }) : null
        ),
        Q("span", { class: "al-tt" }, kt.title || `#${kt.id}`)
      ));
    }))), ot;
  }
  function it(b) {
    var _e;
    const C = b.player, z = C.tracks.filter((Dt) => !Dt.hidden), T = e.radio(), st = x == null ? void 0 : x.nowPlaying, W = st && C.tracks.some((Dt) => String(Dt.id) === String(st.tokenId)) ? String(st.tokenId) : null, vt = W ? C.tracks.find((Dt) => String(Dt.id) === W) : null, I = b.plays === 0 && !b.playsComing, O = !!b.playsComing && !b.plays, J = !!(x != null && x.playing) && !!W, ot = x == null ? void 0 : x.heart, ct = W ? (_e = T == null ? void 0 : T.getPosition) == null ? void 0 : _e.call(T) : null;
    W && (J || ((ct == null ? void 0 : ct.current) ?? 0) > 0.5) && (U = C.id);
    const It = !!W && U === C.id;
    D && D !== W && (D = null);
    const ue = It ? String((st == null ? void 0 : st.cover) || "") : "", kt = !!ue && D === W, Tt = [v(C, !I, { song: kt ? "" : ue, paused: It && !J, flip: ue ? () => {
      D = D === W ? null : W, B();
    } : void 0, flipped: kt })];
    if (Tt.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, vt ? vt.title || (st == null ? void 0 : st.title) || `#${vt.id}` : C.title),
        Q("div", { class: "al-artist" }, vt ? vt.artist || (st == null ? void 0 : st.artist) || C.subtitle : C.subtitle || "Press play")
      ),
      W ? an({ class: "al-icon" + (ot != null && ot.liked ? " is-on" : ""), "aria-label": ot != null && ot.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(ot != null && ot.liked)), disabled: !!(ot != null && ot.pending) || !!(ot != null && ot.locked) || O, onClick: () => {
        var Dt;
        return (Dt = T == null ? void 0 : T.toggleLike) == null ? void 0 : Dt.call(T);
      }, html: ot != null && ot.liked ? ke.heartOn : ke.heart }) : null
    )), I)
      Tt.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        et(b, !0)
      ));
    else {
      const Dt = ct != null && ct.duration ? Math.min(100, ct.current / ct.duration * 100) : 0;
      Tt.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${Dt}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, Ya((ct == null ? void 0 : ct.current) || 0)), Q("span", {}, ct != null && ct.duration ? Ya(ct.duration) : "–:––"))
      ));
    }
    return Tt.push(Q(
      "div",
      { class: "al-ctl" + (I || O ? " is-off" : "") },
      an({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: I || O, onClick: () => {
        var Dt;
        return (Dt = T == null ? void 0 : T.prev) == null ? void 0 : Dt.call(T);
      }, html: ke.prev }),
      an({ class: "al-play", "aria-label": J ? "Pause" : "Play", disabled: I || O, onClick: () => {
        var Dt;
        return (Dt = T == null ? void 0 : T.playPause) == null ? void 0 : Dt.call(T);
      }, html: J ? ke.pause : ke.play }),
      an({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: I || O, onClick: () => {
        var Dt;
        return (Dt = T == null ? void 0 : T.next) == null ? void 0 : Dt.call(T);
      }, html: ke.next })
    )), b.status.length && Tt.push(Q("div", { class: "al-status", role: "status" }, ...b.status)), Tt.push(...tt(b, { songs: z, current: W, started: It, own: ue, out: I, waiting: O })), Tt.push(Q("div", { class: "al-grow" })), Tt.push(an(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: ke.down })
    )), Tt;
  }
  function et(b, C) {
    const z = Q("div", { class: "al-topups" + (C ? " al-topups--primary" : "") }), T = C ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const st of T) {
      const W = b.myPlays !== void 0 && b.myPlays >= st && !b.playsComing && !b.busy;
      z.append(an({ class: "al-topup", disabled: !W, onClick: () => e.topUp(st) }, C ? `Add ${st.toLocaleString()} plays` : `+${st.toLocaleString()}`));
    }
    return C && z.append(an({ class: "al-link", onClick: () => l("more") }, "Other amounts")), z;
  }
  function X(b) {
    const C = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), z = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${b.player.title}`), Q("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      et(b, !1),
      Q("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : C ? `Moved from My player · ${Do(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !C && !b.playsComing && b.myPlays !== void 0 ? an({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), T = (W, vt, I, O) => an(
      { class: "al-row", onClick: O },
      Q("span", { class: "al-row-i", html: W }),
      Q("span", { class: "al-row-t" }, Q("b", {}, vt), Q("small", {}, I)),
      Q("span", { class: "al-row-go", html: ke.right })
    ), st = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      T(ke.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, B();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), an({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: ke.close })),
      b.mode === "open" ? z : null,
      Q(
        "div",
        { class: "al-rows" },
        T(ke.grid, "My music", "Your albums and the radio", () => l("music")),
        T(ke.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        b.canMake ? T(ke.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        T(ke.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        st
      )
    );
  }
  function k(b) {
    var I, O;
    const C = b.player, z = x == null ? void 0 : x.nowPlaying, T = z && C.tracks.some((J) => String(J.id) === String(z.tokenId)) ? String(z.tokenId) : null, st = !!(x != null && x.playing) && !!T, W = T ? (O = (I = e.radio()) == null ? void 0 : I.getPosition) == null ? void 0 : O.call(I) : null;
    T && (st || ((W == null ? void 0 : W.current) ?? 0) > 0.5) && (U = C.id);
    const vt = !!T && U === C.id;
    return tt(b, {
      songs: C.tracks.filter((J) => !J.hidden),
      current: T,
      started: vt,
      own: vt ? String((z == null ? void 0 : z.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function B() {
    const b = s;
    if (r) {
      if (!b || b.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      L(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...k(b));
      return;
    }
    if (!b) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    L(), t.hidden = !1;
    const C = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      b.mode === "open" ? an({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: ke.grid }) : null
    ), z = Q("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? it(b) : P(b));
    t.replaceChildren(C, z, ...i === "more" ? [Q("div", { class: "al-scrim", onClick: () => l("") }), X(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, B();
        return;
      }
      const C = !!s;
      s = b, !b && (C || i) && (i = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, B();
    },
    sheet: () => i,
    setSheet: l
  };
}
const i$ = [
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
function o$(t) {
  for (const [e, n] of i$) if (n.test(t)) return e;
  return null;
}
const Nw = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), _w = (t) => /Android/.test(t);
function a$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Nw(e) ? "x-safari-" + n.href : _w(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const c$ = (t) => Nw(t) ? "Safari" : _w(t) ? "Chrome" : "your browser", Fi = "Xtrata Music Wallet", l$ = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Y0(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: Fi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = t.standIn === c && l$.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Fi} · ${e(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: Fi, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Fi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Fi, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Fi, detail: "Open on this device." });
    }
  return r;
}
const Kl = "xtrata.radio.novice", Uw = "xtrata.radio.novice.previewed.v1", q0 = 6 * 6e4;
function u$(t, e) {
  let n = null;
  try {
    const r = new URLSearchParams(t).get("novice");
    if (r === "1" || r === "preview")
      e.set(Kl, r), n = r;
    else {
      if (r === "0")
        return e.set(Kl, null), { on: !1, preview: !1 };
      n = e.get(Kl);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const f$ = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, X0 = (t) => f$.test(t ?? ""), d$ = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, h$ = {
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
}, p$ = (t, e) => h$[t] ?? e;
function g$(t, e) {
  switch (t) {
    case "fund":
      return e.arriving ? [] : [
        e.played ? "Out of plays." : "No plays yet.",
        "Tap “Add plays” to top up, or open an album someone shares with you."
      ];
    case "over":
      return ["Your player is holding more than it should, so plays are paused. Open “This device” below to send the extra back."];
    default:
      return [];
  }
}
const y$ = "Make your player once, with Face ID or your fingerprint, and the music starts.", w$ = "Checking your player…", ef = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Hw(t) {
  try {
    const e = JSON.parse(t.get(Uw) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function b$(t, e) {
  const n = Hw(t).filter((r) => r !== e);
  n.push(e), t.set(Uw, JSON.stringify(n.slice(-50)));
}
function Vl(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...ef(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : ef();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > q0 ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > q0 ? { ...t, phase: "done" } : t;
  }
}
const qa = (t) => t.phase === "open" || t.phase === "playing", ln = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, ji = (t, e, n, r = !1) => {
  const s = ln("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Ow = (t) => t.toLocaleString(), m$ = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle."],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password."],
  ["It keeps your taste", "Your likes become your own station, on a public record no company can take away."]
], bs = {
  gift: { title: "Your free player is waiting", primary: "Claim my player", hint: "One tap with Face ID or your fingerprint. No app, no account, no password.", returning: "I already have a player", full: "Look around first" },
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
}, x$ = (t, e) => `${e || "Xtrata Music"} has covered ${t ? `${Ow(t)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, S$ = (t) => t ? `Your player holds ${Ow(t)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.";
function E$(t) {
  const e = document.documentElement;
  let n = !1;
  const r = () => {
    const s = ln("ul", "al-welcome-points");
    for (const [i, o] of m$) {
      const a = ln("li");
      a.append(ln("b", "", i), ln("span", "", o)), s.append(a);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, i = !1) {
      if (!s) {
        n && !i && (t.hidden = !0, t.replaceChildren(), delete e.dataset.view, delete e.dataset.asking), n = !1, delete e.dataset.welcome;
        return;
      }
      n = !0, e.dataset.view = "album", e.dataset.welcome = s.mode, s.asking ? e.dataset.asking = "1" : delete e.dataset.asking;
      const o = ln("header", "al-top"), a = ln("a", "al-brand");
      a.href = "/radio", a.append("Xtrata ", ln("b", "", "Music")), o.append(a);
      const c = ln("div", "al-body al-body--welcome"), u = ln("div", "al-welcome"), d = s.mode;
      if (d === "checking")
        u.append(ln("p", "al-welcome-wait", bs.checking));
      else {
        if (u.append(ln("h1", "", bs[d].title)), u.append(ln("p", "", d === "gift" ? x$(s.plays, s.from) : d === "landed" ? S$(s.plays) : bs[d].body)), (d === "landed" || d === "gift") && u.append(r()), s.status.length) {
          const l = ln("div", "al-status");
          l.setAttribute("role", "status"), l.append(...s.status), u.append(l);
        }
        if (s.asking) u.append(ln("p", "al-hint al-hint--ask", bs.asking));
        else if (d === "gift" || d === "new" || d === "back") {
          const l = bs[d];
          s.canStart && u.append(ji("al-primary", l.primary, d === "back" ? s.unlock : s.start, s.busy), ln("p", "al-hint", l.hint)), s.canStart && u.append(ji("al-link", l.returning, s.returning, s.busy)), u.append(ji("al-link", l.full, s.full));
        } else d === "landed" ? u.append(ji("al-primary", bs.landed.primary, s.full)) : d === "empty" && u.append(ji("al-primary", bs.empty.primary, s.restock), ji("al-link", bs.empty.full, s.full));
      }
      c.append(u), t.hidden = !1, t.replaceChildren(o, c);
    }
  };
}
function A$(t = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: t.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: t.sbtc === !0 }
  ];
}
const v$ = [100, 250, 500, 1e3], k$ = (t, e = Cr) => BigInt(t) * Sn(e);
function $$(t, e = Cr, n = 0n) {
  const r = vs - t - n;
  return r > 0n ? Number(r / Sn(e)) : 0;
}
function I$(t, e = Cr, n = 0n) {
  const r = t === void 0 ? 0 : $$(t, e, n);
  return v$.map((s) => ({ plays: s, stx: k$(s, e), fits: t !== void 0 && s <= r }));
}
const L$ = {
  microSTX: (t) => `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (t) => `${t.toLocaleString("en-GB")} sats`,
  pence: (t) => `£${t / 100n}.${(t % 100n).toString().padStart(2, "0")}`
}, C$ = (t) => L$[t.unit](t.amount), Se = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, sc = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`;
function T$(t) {
  if (!t || t.plays < 1) return "";
  const e = [`paid for ${sc(t.plays, "play", "plays")}${t.artists > 0 ? ` to ${sc(t.artists, "artist", "artists")}` : ""}`];
  return t.likes > 0 && e.push(`saved ${sc(t.likes, "like", "likes")}`), `So far your player has ${e.join(" and ")}, all on the public record.`;
}
function B$(t) {
  let e = null, n = 0, r = "stx";
  const s = (o) => {
    var c;
    if (o.some((u) => u.plays === n && u.fits)) return;
    const a = o.filter((u) => u.fits);
    n = ((c = a.find((u) => {
      var d;
      return u.plays === ((d = o[1]) == null ? void 0 : d.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function i() {
    var p;
    if (!e) return;
    const o = t.input();
    if (!o) {
      e.close();
      return;
    }
    const a = I$(o.balance, o.fee, o.incoming);
    s(a);
    const c = A$(o.switches);
    (p = c.find((x) => x.id === r)) != null && p.on || (r = "stx");
    const u = [], d = Se("h2", "ppp-connect__title", "Add plays");
    d.id = "ppp-restock-title", u.push(d), u.push(Se("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${sc(o.playsLeft, "play", "plays")} left.`));
    const l = T$(o.done);
    if (l && u.push(Se("p", "ppp-restock__done", l)), o.arriving)
      u.push(Se("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      u.push(Se("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((x) => x.fits))
      u.push(Se("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const x = Se("div", "ppp-restock__packs");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const D = Se("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        D.type = "button", D.disabled = !U.fits, D.setAttribute("aria-pressed", String(U.plays === n)), D.append(Se("b", "", U.plays.toLocaleString()), Se("span", "", "plays")), D.onclick = () => {
          n = U.plays, i();
        }, x.append(D);
      }
      u.push(x);
      const E = Se("div", "ppp-restock__ways");
      E.setAttribute("role", "group"), E.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const D = Se("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        D.type = "button", D.disabled = !U.on, D.setAttribute("aria-pressed", String(U.id === r)), D.append(Se("b", "", U.label), Se("span", "", U.on ? U.blurb : "Soon")), D.onclick = () => {
          r = U.id, i();
        }, E.append(D);
      }
      u.push(E);
      const L = a.find((U) => U.plays === n);
      if (L && r === "stx") {
        const U = Se("div", "ppp-restock__pay"), D = C$({ unit: "microSTX", amount: L.stx }), v = Se("p", "ppp-restock__amount");
        v.append("Send ", Se("b", "", D), " to your player:"), U.append(v, Se("p", "ppp-addr-full ppp-restock__addr", o.address));
        const H = Se("div", "ppp-restock__row");
        H.append(t.copyButton("restock-address", "Copy address", () => o.address, "primary"), t.copyButton("restock-amount", "Copy amount", () => sr(L.stx), "")), U.append(H), U.append(Se("p", "ppp-restock__note", "From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: your player holds up to 1 STX. The plays appear here by themselves, usually within a few minutes, so you can close this.")), u.push(U);
      }
    }
    u.push(Se("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const g = Se("button", "quiet ppp-connect__cancel", "Close");
    g.type = "button", g.onclick = () => e == null ? void 0 : e.close(), u.push(g), e.replaceChildren(...u);
  }
  return {
    isOpen: () => !!e,
    open() {
      if (e || !t.input()) return;
      e = Se("dialog", "ppp-connect ppp-restock"), e.setAttribute("aria-labelledby", "ppp-restock-title");
      const o = e;
      o.addEventListener("close", () => {
        o.remove(), e === o && (e = null);
      }), o.addEventListener("click", (a) => {
        a.target === o && o.close();
      }), document.body.appendChild(o), i(), typeof o.showModal == "function" ? o.showModal() : o.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: i,
    close() {
      e == null || e.close();
    }
  };
}
const W0 = document.getElementById("ppp");
W0 && M$(W0);
function M$(t) {
  var Br;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = db(), s = (f) => t.querySelector(f), i = s(".ppp-frame");
  let o = null;
  const a = async (f, m) => {
    const A = await fetch(f, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), h = await A.json().catch(() => ({}));
    if (!A.ok) throw new Error((h == null ? void 0 : h.error) || `Request failed (${A.status}).`);
    return h;
  }, c = j5({
    now: Date.now,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    config: (f) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(f || "")),
    links: async (f) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(f))).links ?? [],
    mainOf: async (f) => {
      var A;
      const m = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(f))).links;
      return ((A = m == null ? void 0 : m.find((h) => h.listening === f)) == null ? void 0 : A.main) ?? null;
    },
    saveLink: async (f) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
    },
    bridge: async (f) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${f}; publickey-credentials-create ${f}`), o.referrerPolicy = "no-referrer";
      const m = new Promise((pt, ut) => {
        o.addEventListener("load", () => pt(), { once: !0 }), setTimeout(() => ut(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = f + "/", i.replaceChildren(o), await m;
      const A = new rb({ walletOrigin: f, frame: o, timeoutMs: 30 * 6e4 }), h = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), q = (pt, ut) => h.has(pt) ? A.request(pt, ut) : Promise.race([
        A.request(pt, ut),
        new Promise((St, Qt) => setTimeout(() => Qt(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await q("listening.status"), { request: q };
    },
    chain: {
      verify: x5,
      balance: E5,
      account: S5,
      owner: A5,
      broadcast: v5,
      transaction: k5,
      confirmedNonce: async (f) => {
        const m = await Ls(`/v2/accounts/${f}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (f, m) => $0({ ...m, network: "mainnet", stxAddress: f }),
    deposit: (f, m, A) => new Promise((h, q) => S0({
      recipient: m,
      amount: A.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: f,
      network: new Yl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (pt) => h(pt.txId || ""),
      onCancel: () => q(new Error("Deposit cancelled. Nothing was sent.")),
      onError: q
    })),
    validate: $5,
    tabLock: (f) => new Promise((m) => {
      const A = navigator.locks;
      if (!(A != null && A.request)) {
        m(!0);
        return;
      }
      A.request("xtrata-ppp:" + f, { ifAvailable: !0 }, async (h) => {
        m(!!h), h && await new Promise(() => {
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
      set: (f, m) => {
        try {
          localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    changed: () => oe(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var m, A;
      return u.funder(f, () => M5(f, Ls), !!((A = (m = c.snapshot().gate) == null ? void 0 : m.gifts) != null && A.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (f) => {
      const m = await a("/radio/gift/for?wallet=" + encodeURIComponent(f)), A = m == null ? void 0 : m.gift;
      if (!A) return null;
      if (typeof A.returnTo != "string" || typeof A.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: A.returnTo, from: typeof A.from == "string" ? A.from : null, source: String(A.source ?? ""), amount: String(A.amount ?? "0"), treasury: A.treasury, state: A.state === "sending" ? "sending" : "arrived", player: A.player ?? null };
    },
    history: (f, m) => _5(f, (A) => Ls(A), m),
    likesChanged: () => {
      var f, m;
      (m = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || m.call(f);
    },
    likeState: async (f, m) => {
      const A = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: f, ids: String(m) })), h = Array.isArray(A == null ? void 0 : A.rows) ? A.rows.find((q) => (q == null ? void 0 : q.id) === m) : null;
      if (!h || typeof h.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: h.liked, by: Array.isArray(h.by) ? h.by.filter((q) => typeof q == "string") : h.liked ? [f] : [] };
    },
    likeSent: (f, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: f, liked: m } })),
    nameOf: (f) => xe(f) ?? void 0,
    likeConfirmed: (f, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: m } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), u = K6({
    json: a,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, m, A, h) => new Promise((q, pt) => S0({
      recipient: m,
      amount: A.toString(),
      memo: h,
      stxAddress: f,
      network: new Yl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (ut) => q(ut.txId || ""),
      onCancel: () => pt(new Error("Gift cancelled. Nothing was sent.")),
      onError: pt
    })),
    sign: (f, m) => $0({ ...m, network: "mainnet", stxAddress: f }),
    giftSent: (f, m) => c.giftSent(f, m),
    claiming: (f) => c.giftClaiming(f),
    album: { bind: (f) => c.bindAlbum(f), arrived: async (f, m, A, h) => {
      d.invalidate(), await c.albumArriving(f, m, A, h);
    } },
    who: (f) => _(f),
    changed: () => oe(c.snapshot()),
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), d = e$({
    json: a,
    open: (f) => {
      c.openAlbum(f);
    },
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => oe(c.snapshot())
  }), l = {
    get: (f) => {
      try {
        return localStorage.getItem(f);
      } catch {
        return null;
      }
    },
    set: (f, m) => {
      try {
        m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
      } catch {
      }
    }
  }, g = u$(location.search, l);
  g.on && (document.documentElement.dataset.novice = g.preview ? "preview" : "1");
  const p = (f) => g.on && f.solo, x = g.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), E = x ? document.getElementById("album") : null, L = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (f) => void c.topUpAlbum(f),
    openPlayer: () => void c.openAlbum(0)
  }, U = E ? V0(E, L) : null, D = g.on && E ? E$(E) : null, v = Date.now();
  let H = !1, P = null, tt = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const it = () => {
    tt = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    oe(c.snapshot());
  }, et = (f, m) => {
    var q;
    if (!D || m || tt) return null;
    if (!f.gate || f.step === "loading" || (H = !0), !H) return Date.now() - v < 1e4 ? "checking" : null;
    if (!p(f)) return null;
    if (f.step === "intro" || f.step === "unsupported") return u.incomingStarter() ? "gift" : "new";
    if (f.step === "locked") return "back";
    const h = f.slot === 0 && !((q = f.gift) != null && q.player) && !f.entries.some((pt) => pt.kind === "play");
    return f.step === "fund" && h ? f.depositPending ? "arriving" : "empty" : f.step === "ready" && h && (P === "arriving" || P === "landed") ? "landed" : f.step === "loading" && P !== "checking" ? P : null;
  };
  function X(f, m, A = [], h) {
    if (!D) return;
    const q = h !== void 0 ? h : et(f, m);
    if (P = q, delete document.documentElement.dataset.noviceBoot, !q) {
      D.render(null, m);
      return;
    }
    const pt = [...A];
    q === "arriving" && f.arrival && pt.push(Ps(f.arrival)), f.step === "unsupported" ? pt.push(N("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : f.error && pt.push(N("p", f.error, "ppp-warn"));
    const ut = q === "gift" ? u.incomingStarter() : null;
    D.render({
      mode: q,
      status: pt,
      asking: !!f.busy || f.armed,
      busy: !!f.busy,
      canStart: (f.step === "intro" || f.step === "locked") && !Rn,
      plays: ut ? ut.plays : q === "landed" ? f.playsLeft : null,
      from: (ut == null ? void 0 : ut.from) ?? null,
      start: () => void c.create(),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => B.open(),
      full: () => {
        var Te, Yt, Ut;
        const St = window.XtrataRadio, Qt = q === "landed" && !((Yt = (Te = St == null ? void 0 : St.getState) == null ? void 0 : Te.call(St)) != null && Yt.playing);
        it(), Qt && ((Ut = St == null ? void 0 : St.playPause) == null || Ut.call(St));
      }
    });
  }
  D && setTimeout(() => {
    H || oe(c.snapshot());
  }, 10100);
  const B = B$({
    input: () => {
      var q, pt, ut, St;
      const f = c.snapshot();
      if (!["fund", "ready", "over"].includes(f.step)) return null;
      const m = f.slot === 0 ? { address: f.listening, balance: f.balance } : { address: f.root, balance: (q = f.likeFunds) == null ? void 0 : q.balance };
      if (!m.address) return null;
      const A = f.slot === 0 ? f.entries : [], h = A.filter((Qt) => Qt.kind === "play" && Qt.status === "confirmed");
      return {
        playsLeft: m.balance === void 0 ? null : Cn(m.balance),
        balance: m.balance,
        incoming: 0n,
        fee: BigInt(((pt = f.gate) == null ? void 0 : pt.limits.playFee) ?? "300"),
        address: m.address,
        switches: ((ut = f.gate) == null ? void 0 : ut.restock) ?? {},
        done: h.length ? { plays: h.length, artists: new Set(h.map((Qt) => Qt.recipient)).size, likes: A.filter((Qt) => Qt.kind === "like" && Qt.status === "confirmed" && Qt.liked).length } : null,
        arriving: f.slot === 0 ? f.depositPending : !!((St = f.likeFunds) != null && St.pending)
      };
    },
    copyButton: (f, m, A, h) => Es(f, m, A, h, () => {
      oe(c.snapshot());
    })
  }), b = document.getElementById("albumList"), C = b ? V0(b, L, { list: !0 }) : null, z = "xtrata.radio.album.last.v1", T = () => {
    try {
      const f = JSON.parse(localStorage.getItem(z) || "null");
      return f && typeof f.root == "string" && Number.isSafeInteger(f.slot) && f.slot > 0 && f.player && Array.isArray(f.player.tracks) ? f : null;
    } catch {
      return null;
    }
  };
  let st = "";
  const W = (f) => {
    const m = JSON.stringify(f);
    if (m !== st) {
      st = m;
      try {
        localStorage.setItem(z, m);
      } catch {
      }
    }
  };
  let vt = null;
  window.XtrataRadioLikeHandler = (f) => {
    var A;
    if (!f || !Number.isSafeInteger(f.song) || f.song < 0) return !1;
    (A = c.snapshot().likeFunds) != null && A.album && (Dt = !0), re();
    const m = Wt(f.song, { title: f.title, artist: f.artist });
    return c.heart({ song: f.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let I;
  window.XtrataRadioListeningIdentity = () => {
    const f = c.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const O = (f) => {
    var A, h;
    const m = window.XtrataRadioListeningIdentity();
    m !== I && (I = m, (h = (A = window.XtrataRadio) == null ? void 0 : A.refreshLikes) == null || h.call(A));
  };
  let J = ef(), ot = null;
  const ct = (f) => {
    const m = g.preview && !Rn && f.step === "intro" ? u.incomingAlbum() : null;
    return m ? (J = Vl(J, { kind: "offer", album: m.player.id, already: Hw(l).includes(m.player.id) }), qa(J) ? m.player : null) : (J = Vl(J, { kind: "withdraw" }), null);
  }, It = (f) => {
    const m = J.phase;
    J = Vl(J, f), J.phase !== m && (J.album && (J.phase === "playing" || J.phase === "done") && b$(l, J.album), oe(c.snapshot()));
  };
  setInterval(() => {
    J.phase === "playing" && It({ kind: "tick", at: Date.now() });
  }, 5e3);
  let ue = "", kt, Xt = !1, Tt = !1;
  const _e = (f, m) => {
    var Ut, Be, Kt, pn, ze, Qe, gn, Pn;
    const A = window.XtrataRadio;
    if (!(A != null && A.setGiftPlayer) || !(A != null && A.setGiftStop)) return;
    const h = m.depositPending && f.step === "fund" && ((Ut = f.giftStop) == null ? void 0 : Ut.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : f.giftStop, q = ot, pt = h ? p(f) ? p$(h.reason, h.text) : h.text : null, ut = q ? null : pt ?? (e && (!((Be = f.gate) != null && Be.here) || f.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    ut && ut !== kt && (A.setGiftStop(ut), kt = ut);
    const St = f.step === "off" || f.step === "elsewhere" ? null : ((Kt = f.gift) == null ? void 0 : Kt.player) ?? q ?? null, Qt = St ? St.id + ":" + St.cover + ":" + St.tracks.map((Jn) => Jn.id).join(",") : "";
    Qt !== ue && (A.setGiftPlayer(St ? { id: St.id, title: St.title, subtitle: St.subtitle, tracks: Ws(St).map((Jn) => Jn.id), hidden: ((pn = j6(St)) == null ? void 0 : pn.id) ?? null, cover: St.cover } : null), ue = Qt), ut !== kt && (A.setGiftStop(ut), kt = ut);
    const Te = (h == null ? void 0 : h.reason) === "arriving";
    Te !== Tt && ((ze = A.setGiftWait) == null || ze.call(A, Te), Tt = Te);
    const Yt = !!St && (!!q || !!((Qe = f.albumLock) != null && Qe.locked));
    Yt !== Xt && ((gn = A.setGiftLock) == null || gn.call(A, Yt), Xt = Yt), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(f.step) && ((Pn = A.forgetWallets) == null || Pn.call(A));
  };
  let Dt = !1;
  const Lt = /* @__PURE__ */ new Map(), vn = (f) => {
    if (!(f.step === "fund" && !f.depositPending && !!f.gift && !!f.listening && f.balance === 0n && !f.entries.some((h) => h.kind === "play") && (f.brandNew || f.createdHere))) return null;
    let A = Lt.get(f.listening);
    return A === void 0 && (A = Date.now(), Lt.set(f.listening, A)), Date.now() - A < Mc ? A : null;
  }, he = (f) => f.step === "fund" && !f.depositPending && !!f.gift && f.balance === 0n && !f.entries.some((m) => m.kind === "play") && !!f.listening && Lt.has(f.listening), Xe = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", Cn = (f) => {
    const m = c.snapshot().playCost || 350n;
    return f > Ve ? Number((f - Ve) / m) : 0;
  }, Ce = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), kn = (f) => {
    const m = Math.round((Date.now() - f) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, Ue = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, N = (f, m = "", A = "") => {
    const h = document.createElement(f);
    return m && (h.textContent = m), A && (h.className = A), h;
  }, gt = (f, m, A = "") => {
    const h = N("button", f, A);
    return h.type = "button", h.onclick = m, h;
  }, zt = (f, m) => {
    const A = N("a", f);
    return A.href = m, A.target = "_blank", A.rel = "noopener", A;
  };
  let We = null, dn = location.hash === "#give";
  dn && history.replaceState(null, "", location.pathname + location.search);
  let He = !1;
  const pe = v6((f) => A6({ address: f, network: "mainnet" }), () => oe(c.snapshot())), xe = (f) => pe.get(f), Rn = o$(navigator.userAgent), $ = (f, m) => {
    const A = navigator.userAgent, h = c$(A), q = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, pt = [N("p", `You are in ${f}'s built-in browser, where passkeys often do not work. Open this page in ${h} to make your ${g.on ? "player" : "listening wallet"}${m ? g.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], ut = N("div", "", "ppp-open-row"), St = a$(q, A);
    if (St) {
      const Qt = N("a", `Open in ${h}`, "primary ppp-open-in");
      Qt.href = St, Qt.dataset.homeAction = "radio:open-in-browser", ut.append(Qt);
    }
    return ut.append(Es("copy-page-link", "Copy link", () => q, St ? "" : "primary", () => oe(c.snapshot()))), pt.push(ut, N("p", `If that does not open ${h}, use ${f}'s menu (••• or ⋮) and choose "Open in ${h === "your browser" ? "browser" : h}", or paste the copied link there.`, "ppp-mute")), pt;
  }, _ = (f) => xe(f) ?? Xe(f), G = (f) => f.slice(0, 2).map(_).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), R = /* @__PURE__ */ new Map();
  let dt = !1;
  const At = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), re = () => {
    dt || (dt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const m of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const A = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(A) && R.set(A, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      oe(c.snapshot());
    }).catch(() => {
      dt = !1;
    }));
  }, Wt = (f, m) => {
    const A = R.get(f), h = $6(f, [A == null ? void 0 : A.title, m == null ? void 0 : m.title].find((pt) => !At(pt)) || ""), q = k6(f, (A == null ? void 0 : A.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: h, artist: q };
  }, ie = (f) => {
    const { title: m, artist: A } = Wt(f.song, f);
    return m ? `“${m}”${A ? ` — ${A}` : ""}` : `Song #${f.song}${A ? ` — ${A}` : ""}`;
  }, ge = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Jt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function je(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["TOO MUCH", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Ft(f, m, A = "", h) {
    const q = N("dt", f), pt = N("dd", m, A);
    return h && pt.append(" ", h), [q, pt];
  }
  const yt = document.getElementById("ppp-top"), Gt = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, te = () => {
    var m;
    const f = window.XtrataRadioConnectStacks;
    f ? f() : (m = document.getElementById("radio-wallet-connect")) == null || m.click();
  }, Re = () => {
    var m, A;
    const f = c.snapshot();
    if (f.step === "connect" || f.step === "wrong-wallet") {
      te();
      return;
    }
    if (f.step === "elsewhere" && ((m = f.gate) != null && m.radioUrl)) {
      location.href = f.gate.radioUrl;
      return;
    }
    if (f.step === "locked" && !f.armed && !f.busy && c.unlock(), f.step === "ready" && ((A = f.giftStop) == null ? void 0 : A.reason) === "off" && !f.busy && c.switchOn(), f.step === "fund" && f.solo && !f.depositPending && !f.busy) {
      B.open();
      return;
    }
    Gt();
  };
  yt && (yt.onclick = Re);
  const fe = (f, m, A, h = "") => f.standIn && !f.mainConnected ? gt(`Connect ${_(f.standIn)} to add STX`, te, h) : gt(m, A, h), Tn = (f) => {
    c.useLinked(f).then(() => Gt());
  };
  let Ze = null;
  const Tr = () => {
    const f = Y0(c.snapshot(), _);
    return f.length ? Ze || (Ze = new Promise((m) => {
      var Yt;
      const A = N("dialog", "", "ppp-connect");
      A.setAttribute("aria-labelledby", "ppp-connect-title");
      let h = null;
      const q = (Ut) => {
        h = Ut, A.close();
      };
      A.addEventListener("close", () => {
        A.remove(), Ze = null, m(h);
      }), A.addEventListener("click", (Ut) => {
        Ut.target === A && q(null);
      });
      const pt = (Ut, Be, Kt, pn, ze = !1) => {
        const Qe = N("button", "", "ppp-connect__opt " + Kt);
        return Qe.type = "button", Qe.disabled = ze, Qe.onclick = pn, Qe.append(N("b", Ut), N("span", Be)), Qe;
      }, ut = N("h2", "Connect", "ppp-connect__title");
      ut.id = "ppp-connect-title";
      const St = f.map((Ut) => pt(Ut.label, Ut.detail, "is-music", () => {
        if (q("music"), Ut.action === "linked" && Ut.main) {
          Tn(Ut.main);
          return;
        }
        const Be = Y0(c.snapshot(), _).find((Kt) => Kt.action !== "linked");
        (Be == null ? void 0 : Be.action) === "create" ? c.create() : (Be == null ? void 0 : Be.action) === "unlock" && c.unlock(), Gt();
      }, !!Ut.disabled)), Qt = pt("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => q("stacks")), Te = gt("Cancel", () => q(null), "quiet ppp-connect__cancel");
      A.append(ut, ...St, Qt, Te), document.body.appendChild(A), A.showModal(), (Yt = St.find((Ut) => !Ut.disabled)) == null || Yt.focus();
    }), Ze) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Tr;
  function vi(f) {
    if (!yt) return;
    const m = (h, q, pt) => {
      yt.hidden = !1, yt.className = "ppp-top" + (q ? " is-" + q : ""), yt.replaceChildren(N("span", "", "dot"), document.createTextNode(h)), yt.title = pt;
    }, A = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0;
    switch (f.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        yt.hidden = !0;
        return;
      case "elsewhere":
        return m("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        yt.hidden = !0;
        return;
      case "intro":
        return m("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return m(`Connect ${_(f.linked)}`, "warn", `This device's listening wallet belongs to ${_(f.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return f.depositPending ? m("Plays on their way", "quiet", "Plays start by themselves when they land") : m(f.entries.some((h) => h.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return m("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return m("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return f.payingOn && A > 0 && !f.giftStop ? m(`${A.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : m("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const ve = document.getElementById("pppNudge"), hn = document.getElementById("onair");
  (Br = ve == null ? void 0 : ve.querySelector("button")) == null || Br.addEventListener("click", () => Re());
  const So = {
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
  };
  function ee(f) {
    if (f.step === "loading") return;
    const m = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, A = f.step === "ready" && f.payingOn && m > 0 && !f.giftStop, h = f.step === "fund" && f.depositPending, q = f.step === "elsewhere" && !e, pt = A || h || q ? "" : So[f.step] ?? "", ut = A ? "on" : q ? "free" : pt ? "off" : "";
    ut ? document.documentElement.dataset.ppp = ut : delete document.documentElement.dataset.ppp, hn && (hn.hidden = !ut || ut === "free", hn.querySelector(".onair-sub").textContent = A ? `${m.toLocaleString()} plays left` : "Plays off"), ve && (ve.hidden = ut !== "off" && ut !== "free", ve.classList.toggle("is-free", ut === "free"), ut === "free" ? (ve.querySelector(".nudge-t").textContent = "You’re on the free player", ve.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", ve.querySelector("button").textContent = "Get a player") : ut === "off" && (ve.querySelector(".nudge-t").textContent = pt, ve.querySelector(".nudge-s").textContent = p(f) ? f.step === "intro" ? y$ : "" : "This radio requires a funded listening wallet with music support on.", ve.querySelector("button").textContent = Eo[f.step] ?? "Start"));
  }
  let Ye = "";
  function on(f) {
    const m = N("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && m.append(N("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && m.append(N("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const A = N("input");
    A.type = "text", A.placeholder = "SP… address to send returns to", A.autocomplete = "off", A.spellcheck = !1, A.setAttribute("aria-label", "Address to return funds to"), A.value = Ye, A.oninput = () => {
      Ye = A.value;
    };
    const h = gt(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(A.value), Ye = "";
    }, "tiny");
    return m.append(A, " ", h), f.returnToKind === "chosen" && m.append(" ", gt("Back to the funder", () => c.clearReturnAddress(), "tiny")), m;
  }
  const ki = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function $i() {
    const f = N("p", ki + " ", "ppp-mute");
    return f.append(zt("Xverse", "https://www.xverse.app/download"), " · ", zt("Leather", "https://leather.io/install-extension")), f;
  }
  let zn = "";
  const Kr = (f) => {
    const m = document.documentElement, A = f.solo && !f.main ? f.listening ? Xe(f.listening) : "new" : "", h = V5() ? "1" : "", q = f.standIn && !f.mainConnected ? _(f.standIn) : "";
    `${A}|${h}|${q}` !== zn && (zn = `${A}|${h}|${q}`, A ? m.dataset.pppSolo = A : delete m.dataset.pppSolo, q ? m.dataset.pppAs = q : delete m.dataset.pppAs, h ? m.dataset.pppWalletInstalled = h : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => oe(c.snapshot()), f);
  function Bn(f, m = "") {
    const A = N("div", "", "ppp-topup"), h = Mn(f);
    A.append(N("span", "Add plays from My player: ", "ppp-mute"));
    for (const q of rc) {
      const pt = gt(`+${q.toLocaleString()}`, () => void c.topUpAlbum(q), m);
      pt.disabled = h === void 0 || h < q || f.depositPending || !!f.busy, A.append(pt);
    }
    return h !== void 0 && h < rc[0] && A.append(N("p", "My player needs plays first (switch to My player above).", "ppp-mute")), A;
  }
  const Mn = (f) => {
    var h;
    const m = (h = f.likeFunds) == null ? void 0 : h.balance;
    if (m === void 0 || !f.playCost) return;
    const A = m - Ve - 6000n;
    return A > 0n ? Number(A / f.playCost) : 0;
  };
  function Ms(f) {
    const m = f.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    if (m.low || (Dt = !1), m.low && !Dt) return [];
    const A = N("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      if (!m.txid) return [];
      const q = N("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return m.txid && q.append(zt("View", Ue(m.txid))), A.append(q), [A];
    }
    A.append(N("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), A.append(N("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), A.append(N("p", m.address, "ppp-addr-full"));
    const h = N("div", "", "ppp-open-row");
    if (h.append(Es("copy-likes-address", "Copy address", () => m.address, "primary", () => oe(c.snapshot()))), m.main && !f.solo) {
      const q = vs - (m.balance ?? 0n);
      q > 0n && h.append(fe(f, `Pay ${sr(q)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return A.append(h), A.append(N("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [A];
  }
  const Ps = (f) => {
    const m = N("div", "", "ppp-wait");
    m.dataset.since = String(f.since), m.dataset.grace = String(f.graceMs), m.setAttribute("role", "progressbar"), m.setAttribute("aria-label", "Your plays are arriving");
    const A = N("p", "", "ppp-wait-t"), h = N("div", "", "ppp-wait-track");
    return h.append(N("div", "", "ppp-wait-fill")), m.append(A, h), Ii(m), m;
  };
  function Ii(f) {
    const m = Number(f.dataset.since), A = Number(f.dataset.grace) || 6e4, h = Math.max(0, Date.now() - m), q = f.querySelector(".ppp-wait-fill"), pt = f.querySelector(".ppp-wait-t");
    if (h < A) {
      const ut = Math.ceil((A - h) / 1e3);
      q.style.width = Math.max(4, Math.min(95, h / A * 100)).toFixed(0) + "%", pt.textContent = `Your plays are arriving… usually about a minute · ${ut}s`, f.classList.remove("is-long"), f.setAttribute("aria-valuenow", String(Math.round(h / A * 100)));
    } else
      q.style.width = "", pt.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", f.classList.add("is-long"), f.removeAttribute("aria-valuenow");
  }
  let Li = 0;
  setInterval(() => {
    const f = document.querySelectorAll(".ppp-wait");
    if (!f.length) {
      Li = 0;
      return;
    }
    f.forEach(Ii), ++Li % 10 === 0 && oe(c.snapshot());
  }, 1e3);
  let Ns = null;
  function ur(f) {
    if (f.step === "loading" && Ns !== null) return;
    const A = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(f.step) || !!f.busy || f.armed || !!u.pendingCode() && !["ready", "fund", "over"].includes(f.step);
    A !== Ns && (Ns = A, A ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function oe(f) {
    var w, M, j, lt, De, tn, Gn, en, $o, Pr, Io, Lo, Co, Pi, Hs;
    if (vt && ["ready", "fund", "over"].includes(f.step) && !f.busy) {
      const Y = vt;
      vt = null, f.root === Y.root && f.slot !== Y.slot && c.openAlbum(Y.slot);
    }
    const m = u.inProgress(f), A = vn(f), h = m && f.step === "fund" ? { ...f, depositPending: !0 } : A !== null ? { ...f, depositPending: !0, arrival: { since: A, graceMs: Mc } } : f, q = h.error === Pc;
    if (O(), ot = ct(f), _e(f, h), ur(h), Kr(h), !m && u.inProgress(f)) return;
    if (vi(h), ee(h), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(h.step), n.textContent = h.step === "loading" || !h.gate ? g.on ? w$ : "Checking your listening wallet…" : g.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = h.step === "off", t.hidden) {
      X(h, !1);
      return;
    }
    const [pt, ut] = je(h), St = s(".ppp-state");
    St.textContent = pt, St.className = "ppp-state" + (ut ? " ppp-state--" + ut : ""), St.hidden = !pt;
    const Qt = !!h.busy || h.armed, Te = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (Qt || !["intro", "loading"].includes(h.step));
    i.hidden = !Te, i.classList.toggle("ppp-frame--rest", !Qt && !He);
    const Yt = s(".ppp-frame-label");
    Yt.hidden = !0;
    const Ut = R5(h) ?? We;
    We = Ut;
    const Be = "xtrata.radio.ppp.heard.v1", Kt = (() => {
      try {
        return localStorage.getItem(Be) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Kt && h.entries.some((Y) => Y.kind === "play"))
      try {
        localStorage.setItem(Be, "1");
      } catch {
      }
    const pn = Kt || h.slot > 0 && ((((w = h.likeFunds) == null ? void 0 : w.balance) ?? 0n) > 0n || d.count() > 1), ze = p(h), Qe = !ze && G5({ ...h, heard: pn }, Ut);
    s(".ppp-badge").hidden = !Qe;
    const gn = s(".ppp-steps"), Pn = s(".ppp-stage");
    gn.hidden = Pn.hidden = !Qe, Ut && Qe && (gn.replaceChildren(...Zu(h.solo).map((Y, at) => {
      const Rt = N("li", "", at < Ut.at ? "done" : at === Ut.at ? Ut.blocked ? "now blocked" : "now" : "");
      return Rt.append(N("span", at < Ut.at ? "✓" : String(at + 1), "n"), Y), at === Ut.at && Rt.setAttribute("aria-current", "step"), Rt;
    })), Pn.textContent = Ut.caption, Pn.className = "ppp-stage " + (Ut.at >= Zu(h.solo).length ? "ppp-ok" : Ut.blocked ? "ppp-bad" : "ppp-cyan"));
    const Jn = s(".ppp-facts"), Oe = [];
    h.main && ((M = h.gate) != null && M.here) && !h.solo && Oe.push(...Ft("Your wallet", _(h.main), "ppp-addr-short"));
    const tr = () => {
      if (!h.listening) return;
      const Y = Es("copy-listening", "Copy", () => h.listening || "", "tiny", () => oe(c.snapshot()));
      Oe.push(...Ft(h.slot > 0 ? "Album wallet" : h.linked ? "My player (technical)" : "My player wallet", Xe(h.listening), "ppp-addr-short", Y));
    };
    if (h.linked || tr(), h.listening && h.step !== "intro")
      if (h.linked)
        Oe.push(...Ft("Credited to", `${_(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), tr();
      else if (h.solo) {
        h.creditedTo && Oe.push(...Ft("Credited to", `${_(h.creditedTo)} · plays and likes`, "ppp-ok"));
        const Y = h.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : h.returnTo ? `${_(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Oe.push(...Ft("Returns go to", h.gift ? Y : h.returnTo && !xe(h.returnTo) ? Y.replace(Xe(h.returnTo), h.returnTo) : Y, h.returnTo && !h.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Oe.push(...Ft("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((j = h.gate) != null && j.here)) {
      const Y = h.linkedListening.map((at) => Xe(at) + (at === h.listening ? " (this one)" : "")).join(", ");
      Oe.push(...Ft(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Y, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const Y = h.step === "fund" && h.depositPending ? "ppp-mute" : h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Oe.push(...Ft("Balance", `${sr(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, Y));
    }
    const y = h.entries.find((Y) => Y.kind === "play");
    y && re(), y && Oe.push(...Ft("Last paid song", `${ie(y)} → ${_(y.recipient)}`, ge[y.status] || "")), Jn.replaceChildren(...Oe), Jn.hidden = !Oe.length;
    const S = [], F = [], V = [], ft = [], K = Sn(BigInt(((lt = h.gate) == null ? void 0 : lt.limits.playFee) ?? "300")), mt = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${sr(Tc)} STX to the song holder, plus a ${sr(K - Tc)} STX network fee.`, xt = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (S.push(N("p", "Pay artists as you listen.")), (De = h.gate) != null && De.radioUrl) {
          const at = N("p");
          at.append(zt("Open the pay-per-play radio →", h.gate.radioUrl)), S.push(at);
        }
        F.push(N("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const at = [h.linked, ...h.others];
          S.push(N("p", at.length > 1 ? `This device has listening wallets for ${G(at)}.` : `This device has a listening wallet for ${_(h.linked)}.`)), F.push(N("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), at.slice(0, 3).forEach((Rt, Fe) => V.push(gt(`Open ${_(Rt)}`, () => Tn(Rt), Fe === 0 ? "primary" : "")));
        } else
          S.push(N("p", "Connect your wallet to pay artists as you listen.")), F.push(N("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        S.push(N("p", `This device's listening wallet belongs to ${_(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), F.push(N("p", `You are connected as ${_(h.main)}. Switch to the linked wallet to continue listening.`)), F.push(N("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), V.push(gt("Switch wallet", te, "primary"));
        break;
      case "not-invited":
        S.push(N("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        S.push(N("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        S.push(N("p", "Every play counts for the song’s owner, on-chain.")), F.push(N("p", mt)), F.push(N("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), F.push(N("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (S.push(N("p", `This device already has a listening wallet for ${G(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), F.push(N("p", `Otherwise, set up a new listening wallet for ${_(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && F.push(N("p", `This is the listening wallet for ${_(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && F.push(N("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Y = u.liveGift();
        V.push(gt(Y ? "Claim my gift · no wallet needed" : h.solo ? "Start listening · no wallet needed" : h.others.length && h.main ? `Set up for ${_(h.main)}` : "Start listening", () => void c.create(), "primary")), !Y && !h.solo && h.main && h.others.length && V.push(gt("Switch wallet", te)), !Y && h.solo && V.push(gt("I have a Stacks wallet", te)), V.push(gt("I already have a listening wallet", () => void c.unlock(!0))), Y && V.push(gt("Not now", () => u.setAside(), "quiet"));
        break;
      case "locked":
        h.armed || (S.push(N("p", "Locked.", "ppp-mute")), V.push(gt("Unlock", () => void c.unlock(), "primary"))), h.standIn ? ft.push(gt("Use a different listening wallet", () => void Tr().then((at) => {
          at === "stacks" && te();
        }), "quiet")) : ft.push(gt("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        S.push(N("p", `Link to ${_(h.main)} · free`)), F.push(N("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), F.push(N("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), V.push(gt(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        S.push(N("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.depositPending ? h.arrival && S.push(Ps(h.arrival)) : he(h) ? S.push(N("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (tn = h.gift) != null && tn.player ? S.push(N("p", "Out of plays · add more to keep listening", "ppp-bad")) : h.entries.length ? S.push(N("p", "No plays left · add plays to keep counting", "ppp-bad")) : S.push(N("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / K)).toLocaleString()} plays`)), h.entries.length && F.push(N("p", "Playback is paused until your top-up confirms.")), h.payingOn && !h.entries.length && F.push(N("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m ? F.push(N("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : h.depositPending ? F.push(N("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : h.solo ? (F.push(N("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), F.push(N("p", h.listening || "", "ppp-addr-full")), h.listening && !h.depositPending && V.push(Es("copy-address", "Copy my address", () => h.listening || "", "primary", () => oe(c.snapshot())))) : F.push(N("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const at = N("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          at.append(zt("View", Ue(h.depositTxid))), S.push(at);
        } else h.allowance > 0n && !h.solo && !h.depositPending && V.push(fe(h, `Deposit ${sr(h.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        S.push(N("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.solo && !h.returnTo && (S.push(N("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), S.push(on(h))), (!h.solo || h.returnTo) && V.push(gt("Return excess", () => void c.returnFunds("excess"), "primary"), gt("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0 && ((Gn = h.giftStop) == null ? void 0 : Gn.reason) !== "off") {
          const at = Math.min(h.session.playsLeft, h.playsLeft);
          S.push(N("p", `${at.toLocaleString()} plays left`, "ppp-ok")), F.push(N("p", mt + " The heart likes or unlikes from this wallet for 0.0002 STX.")), V.push(gt("Switch off", () => void c.switchOff()));
        } else
          S.push(N("p", "Switch on music support to listen.", "ppp-mute")), V.push(gt("Switch plays on", () => void c.switchOn(), "primary"));
        h.queued && S.push(N("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && S.push(N("p", "Running low on plays", "ppp-warn")), h.depositPending ? S.push(N("p", "Plays on their way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && V.push(fe(h, `Top up ${sr(h.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (h.solo && h.listening && !h.depositPending) {
      const Y = h.step === "fund", at = h.step === "ready" && (h.balanceState === "low" || !!h.gift && h.giftPlays <= 20);
      Y ? V.unshift(gt("Add plays", () => B.open(), "primary")) : at ? V.push(gt("Add plays", () => B.open(), "primary")) : h.step === "ready" && ft.push(gt("Add plays", () => B.open(), "quiet"));
    }
    if (h.solo && h.walletCannotSolo && F.push(N("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && h.slot === 0 && F.push(on(h)), F.push($i()), h.slot === 0 && h.step === "ready" && h.entries.some((Y) => Y.kind === "play" && Y.status === "confirmed"))) {
      const Y = N("p", "New to Stacks? ", "ppp-mute");
      Y.append(zt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), S.push(Y);
    }
    if (h.walletOutdated && F.push(N("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (S.push(N("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), V.push(gt("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(h.step) && (h.returnTo || h.gift) && (h.balance ?? 0n) > 0n && ft.push(gt(h.linked ? "Return all to my wallet" : h.gift ? "Return what is left…" : `Return all to ${_(h.returnTo)}`, () => void c.returnFunds("all"), "quiet")), h.slot > 0 && ((en = h.gift) != null && en.player) && ["ready", "fund"].includes(h.step) && h.giftPlays > 20 && ft.push(Bn(h, "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && ft.push(gt("Lock", () => void c.lock(), "quiet")), Te && !Qt && ft.push(gt(He ? "Hide listening wallet box" : "Show listening wallet box", () => {
      He = !He, oe(c.snapshot());
    }, "quiet")), [...V, ...ft].forEach((Y) => Y.disabled = xt), xt && (V.length = 0), !ze && h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step) && !(h.step === "fund" && h.depositPending && h.balance === 0n) && !(($o = h.gift) != null && $o.player)) {
      const Y = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", at = S.at(0);
      h.step === "ready" && at ? at.append(N("span", ` · ${Ce(h.balance)} STX`, Y)) : S.push(N("p", `Balance ${Ce(h.balance)} STX`, Y));
    }
    if (ze) {
      for (const Rt of [...V, ...ft]) {
        const Fe = d$[Rt.textContent ?? ""];
        Fe && (Rt.textContent = Fe);
      }
      for (let Rt = S.length - 1; Rt >= 0; Rt--) X0(S[Rt].textContent) && F.unshift(...S.splice(Rt, 1));
      for (let Rt = V.length - 1; Rt >= 0; Rt--) X0(V[Rt].textContent) && ft.unshift(...V.splice(Rt, 1));
      const Y = h.entries.some((Rt) => Rt.kind === "play"), at = g$(h.step, { played: Y, arriving: h.depositPending });
      at.length && S.length && at.shift(), S.push(...at.map((Rt) => N("p", Rt, "ppp-mute")));
    }
    if ((Pr = h.gift) != null && Pr.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(h.step)) {
      const Y = N("p", "", "ppp-gift");
      Y.append(`💿 Album · ${h.gift.player.title}`), h.gift.player.subtitle && Y.append(" · ", h.gift.player.subtitle);
      const at = ["ready", "fund", "over"].includes(h.step) && h.balance !== void 0 ? h.giftPlays === 0 && h.depositPending ? N("span", " · plays on their way", "ppp-warn") : N("span", h.giftPlays === 0 ? " · no plays left" : ` · ${h.giftPlays.toLocaleString()} ${h.giftPlays === 1 ? "play" : "plays"} left`, h.giftPlays === 0 ? "ppp-bad" : h.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      at && Y.append(at);
      const Rt = (Io = S.at(0)) == null ? void 0 : Io.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (h.step === "ready" && Rt && /STX/.test(Rt.textContent ?? "") && Rt.remove(), S.unshift(Y), h.giftPlays <= 20 && ["ready", "fund"].includes(h.step) && !h.depositPending)
        if (h.slot > 0)
          S.splice(1, 0, N("p", h.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Bn(h, "primary"));
        else {
          const Fe = N("p", h.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          Fe.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), Fe.append(zt("Xverse", "https://www.xverse.app/download"), " and ", zt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), S.splice(1, 0, Fe);
        }
    }
    if (h.gift && !h.linked && ["fund", "ready", "over"].includes(h.step) && h.returnPlan.state === "ready") {
      const Y = h.returnPlan, at = N("div", "", "ppp-pick");
      at.append(N("p", Y.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Rt = N("ul", "", "ppp-gift-list");
      Y.steps.forEach((Fe, dl) => {
        const To = Fe.kind === "gift" ? "the unused gift" : Fe.kind === "deposit" ? "what was added to it" : "the rest", Kn = N("li");
        Kn.append(N("span", `${dl + 1}. ${sr(BigInt(Fe.send))} STX · ${To}`, "t"), N("span", Fe.to ? ` → ${_(Fe.to)}` : " → choose an address below", Fe.to ? "ppp-mute" : "ppp-warn")), Rt.append(Kn);
      }), at.append(Rt), Y.kept && at.append(N("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Y.steps.some((Fe) => !Fe.to) && at.append(on(h)), at.append(gt(Y.steps.length > 1 ? `Confirm part 1 of ${Y.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), S.push(at);
    }
    const wt = Ao(h), $t = x ? wt : null, ye = et(h, !!$t), yn = ye === "gift" || ye === "arriving" || ye === "new", Ge = u.banner(f, { bare: !!$t || ye === "gift" || ye === "arriving" }), Je = Rn && (u.pendingCode() || ["intro", "locked", "unsupported"].includes(h.step)) ? $(Rn, u.pendingCode()) : [];
    $t || (S.unshift(...Ge), S.push(...Ms(h)), S.unshift(...Je)), h.solo && h.creditedTo && h.listening && !["intro", "off", "elsewhere", "loading"].includes(h.step) && S.unshift(N("p", `This is ${_(h.creditedTo)}'s listening wallet. Plays and likes count for ${_(h.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...S);
    const Mr = document.querySelector(".ppp-switch");
    if (Mr) {
      const Y = d.latest(), at = h.slot > 0, Rt = ["fund", "ready", "over"].includes(h.step) && (at || !!Y);
      if (Mr.hidden = !Rt, Rt) {
        const Fe = (Kn, pd, Fw, jw) => {
          const ya = gt("", jw, "ppp-tab");
          return ya.setAttribute("aria-pressed", String(Fw)), ya.append(N("span", Kn, "tt"), N("span", pd === void 0 ? "…" : `${Cn(pd).toLocaleString()} plays`, "ts")), ya.disabled = !!h.busy, ya;
        }, dl = at ? ((Co = (Lo = h.gift) == null ? void 0 : Lo.player) == null ? void 0 : Co.title) ?? "Album" : Y.title, To = gt("View all albums" + (d.count() > 1 ? ` (${d.count()})` : ""), () => {
          const Kn = document.querySelector(".ppp-shelf");
          Kn && (Kn.hidden = !1, Kn.open = !Kn.open, To.setAttribute("aria-expanded", String(Kn.open)), Kn.open && requestAnimationFrame(() => Kn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        To.setAttribute("aria-expanded", String(!!((Pi = document.querySelector(".ppp-shelf")) != null && Pi.open))), Mr.replaceChildren(
          Fe("🎧 My player", at ? (Hs = h.likeFunds) == null ? void 0 : Hs.balance : h.balance, !at, () => {
            at && c.openAlbum(0);
          }),
          Fe("💿 " + dl, at ? h.balance : void 0, at, () => {
            !at && Y && c.openAlbum(Y.slot);
          }),
          To
        );
      }
    }
    const Ti = d.render(h), Bi = document.querySelector(".ppp-shelf");
    if (Bi) {
      Bi.hidden = !Ti;
      const Y = Bi.querySelector("summary");
      Y && (Y.textContent = d.count() > 0 ? `♪ My albums (${d.count()})` : "♪ My albums");
      const at = Bi.querySelector(".ppp-shelf-body");
      Ti && at && !at.contains(Ti) && at.replaceChildren(Ti);
    }
    const qr = u.renderFold(f);
    if (s(".ppp-gifts").hidden = !qr, qr && !s(".ppp-gift-body").contains(qr) && s(".ppp-gift-body").replaceChildren(qr), qr && dn) {
      dn = !1;
      const Y = s(".ppp-gifts");
      Y.open = !0, requestAnimationFrame(() => Y.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    s(".ppp-body").replaceChildren(...F), s(".ppp-actions").replaceChildren(...V), s(".ppp-actions2").replaceChildren(...ft);
    const vo = h.busy || h.message || "", Us = s(".ppp-msg"), ko = vo && S.some((Y) => (Y.textContent ?? "").startsWith(vo.replace(/[.✓\s]+$/, ""))) ? "" : vo, Mi = !ko && !h.error ? h.notice : q && !ko ? h.error : "";
    Us.textContent = ko || Mi, Us.classList.toggle("is-warn", !!Mi), s(".ppp-err").textContent = q ? "" : h.error;
    const fl = h.entries.filter((Y) => Y.kind === "play");
    s(".ppp-recent").hidden = !h.entries.length, s(".ppp-recent-list").replaceChildren(...fl.slice(0, 5).map((Y) => {
      const at = N("li"), Rt = Y.status === "confirmed" ? "ok" : Y.status === "failed" ? "bad" : "warn";
      return at.append(N("span", "", "d " + Rt), N("span", ie(Y), "t"), N("span", kn(Y.created), "ppp-mute")), Y.txid && at.append(zt("tx", Ue(Y.txid))), at;
    })), s(".ppp-wallets").hidden = !(Jn.childElementCount || ft.length), s(".ppp-more").hidden = !F.length;
    const ga = s(".ppp-history");
    ga.hidden = !h.entries.length, h.entries.length && re(), ga.replaceChildren(N("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((Y) => {
      const at = N("div", "", "ppp-row"), Rt = Y.kind === "play" ? [N("span", ie(Y), "ppp-song"), N("span", ` · ${sr(BigInt(Y.amount))} STX to ${_(Y.recipient)}`, "ppp-mute")] : Y.kind === "like" ? [N("span", `${Y.liked ? "♥ Liked" : "Unliked"} ${ie(Y)}`, "ppp-song"), N("span", ` · for ${h.linked ? _(h.linked) : "this listening wallet"}`, "ppp-mute")] : [N("span", `Returned ${sr(BigInt(Y.amount))} STX`, "ppp-song"), N("span", ` to ${_(Y.recipient)}`, "ppp-mute")];
      return at.append(
        N("span", Jt[Y.status] || Y.status, "ppp-status " + (ge[Y.status] || "")),
        ...Rt,
        N("span", ` · ${new Date(Y.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Y.txid && at.append(zt("tx ↗", Ue(Y.txid))), at;
    })), U == null || U.render($t ? _s(h, $t, [...Je, ...Ge]) : null), X(h, !!$t, yn ? [...Je, ...Ge] : Je, ye), B.isOpen() && B.refresh(), C == null || C.render((wt == null ? void 0 : wt.mode) === "open" ? _s(h, wt, []) : null);
  }
  function Ao(f) {
    var h;
    if (["off", "elsewhere", "not-invited"].includes(f.step)) return null;
    if (f.slot > 0 && ((h = f.gift) != null && h.player) && ["fund", "ready", "over", "link", "loading"].includes(f.step))
      return f.root && W({ root: f.root, slot: f.slot, player: f.gift.player }), { mode: "open", player: f.gift.player };
    const m = u.incomingAlbum();
    if (m) return { mode: "arrive", player: m.player, from: m.from, offered: m.plays };
    const A = T();
    return A && (f.step === "locked" || vt && f.step === "loading") ? { mode: "locked", player: A.player } : null;
  }
  function _s(f, m, A) {
    var Qt, Te, Yt, Ut, Be;
    const h = !!f.busy || f.armed, q = [...A];
    f.depositPending && f.arrival && q.push(Ps(f.arrival)), f.error ? q.push(N("p", f.error, f.error === Pc ? "ppp-warn" : "ppp-bad")) : f.message && !h ? q.push(N("p", f.message, "ppp-cyan")) : f.notice && q.push(N("p", f.notice, "ppp-warn")), m.mode === "open" && Dt && ((Qt = f.likeFunds) != null && Qt.album) && f.likeFunds.low && !f.likeFunds.pending && q.push(N("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let pt = "Kept on this device with Face ID or your passkey. No app or account needed.", ut = null, St = null;
    if (m.mode === "locked")
      ut = { label: "Continue listening", run: () => {
        vt = T(), c.unlock();
      } }, St = { label: "Use a different passkey", run: () => {
        vt = null, c.unlock(!0);
      } };
    else if (m.mode === "arrive")
      if (f.step === "intro" && qa(J) && J.album === m.player.id) {
        const Kt = window.XtrataRadio, pn = Ws(m.player)[0], ze = J.phase === "playing";
        ut = { label: ze && !!((Yt = (Te = Kt == null ? void 0 : Kt.getState) == null ? void 0 : Te.call(Kt)) != null && Yt.playing) ? "Pause" : ze ? "Carry on" : "Play the first song", run: () => {
          var gn, Pn;
          ze ? (gn = Kt == null ? void 0 : Kt.playPause) == null || gn.call(Kt) : pn && ((Pn = Kt == null ? void 0 : Kt.playToken) == null || Pn.call(Kt, pn.id));
        } }, St = { label: "Make my player and hear it all", run: () => void c.create() }, pt = "The first song is free. Nothing to set up yet.";
      } else if (f.step === "intro") {
        const Kt = J.phase === "done" && J.album === m.player.id;
        Kt && !q.length && q.push(N("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), ut = { label: Kt ? "Keep listening" : "Open album", run: () => void c.create() }, St = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else f.step === "locked" ? (ut = { label: "Open album", run: () => void c.unlock() }, St = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : f.step === "unsupported" ? q.push(N("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : q.length || q.push(N("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: m.mode,
      player: m.player,
      from: m.from,
      offered: m.offered,
      plays: m.mode === "open" ? f.balance === void 0 ? null : f.giftPlays : void 0,
      playsComing: f.depositPending,
      status: q,
      primary: ut,
      secondary: St,
      hint: ut ? pt : void 0,
      asking: h,
      busy: !!f.busy,
      myPlays: Mn(f),
      topUps: rc,
      canMake: !!((Be = (Ut = f.gate) == null ? void 0 : Ut.gifts) != null && Be.admin)
    };
  }
  const Ci = /* @__PURE__ */ new Map();
  let Vr = !1;
  const Yr = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((m) => {
      const A = m == null ? void 0 : m.nowPlaying;
      if (A && Number.isSafeInteger(Number(A.tokenId)) && Ci.set(Number(A.tokenId), { title: A.title || void 0, artist: A.artist || void 0 }), qa(J)) {
        const h = !!(m != null && m.playing);
        It({ kind: "now", track: A && A.tokenId != null ? String(A.tokenId) : null, playing: h, at: Date.now() }), h !== Vr && (Vr = h, oe(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Yr()) {
    const f = setInterval(() => {
      Yr() && clearInterval(f);
    }, 500);
    setTimeout(() => clearInterval(f), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (f) => {
    const m = f.detail;
    if (qa(J) && It({ kind: "listened", at: Date.now() }), m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      re();
      const A = Wt(m.song, Ci.get(m.song));
      c.onListened({ song: m.song, id: m.id, title: A.title || void 0, artist: A.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const P$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", N$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, _$ = () => N$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, U$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, H$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Dw = class {
  constructor(t) {
    _v(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && eS(t), this.callback(Xc(t));
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
    var r, s, i, o, a, c, u, d, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = _$(), e = U$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Ct("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Ct("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Ct("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Ct("div", { class: "flex flex-col space-y-[10px]" }, Ct("div", { class: "flex items-center" }, Ct("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Ct("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Ct("span", { class: "sr-only" }, "Close popup"), Ct("img", { src: P$ }))), r ? Ct("p", null, "Select the wallet you want to connect to.") : Ct("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Ct("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Ct("div", { class: "mt-6" }, Ct("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Ct("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Ct("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ct("div", { class: "aspect-square basis-9 overflow-hidden" }, Ct("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ct("div", { class: "flex-1" }, Ct("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Ct("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Ct("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Ct("div", { class: "mt-6" }, r ? Ct("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Ct("div", { class: "mb-5 flex justify-between" }, Ct("p", { class: "text-sm font-medium" }, "Recommended wallets"), Ct("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Ct("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Ct("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Ct("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Ct("p", null, "What is a wallet? ", Ct("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Ct("ul", { class: "space-y-3" }, n.map((i) => Ct("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ct("div", { class: "aspect-square basis-9 overflow-hidden" }, Ct("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ct("div", { class: "flex-1" }, Ct("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Ct("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Ct("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return yv(this);
  }
};
Dw.style = H$;
const O$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Dw
}, Symbol.toStringTag, { value: "Module" }));
