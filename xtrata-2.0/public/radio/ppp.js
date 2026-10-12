var zg = Object.defineProperty;
var Rg = (t, e, n) => e in t ? zg(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Jr = (t, e, n) => Rg(t, typeof e != "symbol" ? e + "" : e, n);
var jt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function oh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Xi(t) {
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
      typeof jt < "u" && jt || {}, r = {
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
      function s(y) {
        return y && DataView.prototype.isPrototypeOf(y);
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
        ], o = ArrayBuffer.isView || function(y) {
          return y && i.indexOf(Object.prototype.toString.call(y)) > -1;
        };
      function a(y) {
        if (typeof y != "string" && (y = String(y)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(y) || y === "")
          throw new TypeError('Invalid character in header field name: "' + y + '"');
        return y.toLowerCase();
      }
      function c(y) {
        return typeof y != "string" && (y = String(y)), y;
      }
      function l(y) {
        var A = {
          next: function() {
            var k = y.shift();
            return { done: k === void 0, value: k };
          }
        };
        return r.iterable && (A[Symbol.iterator] = function() {
          return A;
        }), A;
      }
      function f(y) {
        this.map = {}, y instanceof f ? y.forEach(function(A, k) {
          this.append(k, A);
        }, this) : Array.isArray(y) ? y.forEach(function(A) {
          if (A.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + A.length);
          this.append(A[0], A[1]);
        }, this) : y && Object.getOwnPropertyNames(y).forEach(function(A) {
          this.append(A, y[A]);
        }, this);
      }
      f.prototype.append = function(y, A) {
        y = a(y), A = c(A);
        var k = this.map[y];
        this.map[y] = k ? k + ", " + A : A;
      }, f.prototype.delete = function(y) {
        delete this.map[a(y)];
      }, f.prototype.get = function(y) {
        return y = a(y), this.has(y) ? this.map[y] : null;
      }, f.prototype.has = function(y) {
        return this.map.hasOwnProperty(a(y));
      }, f.prototype.set = function(y, A) {
        this.map[a(y)] = c(A);
      }, f.prototype.forEach = function(y, A) {
        for (var k in this.map)
          this.map.hasOwnProperty(k) && y.call(A, this.map[k], k, this);
      }, f.prototype.keys = function() {
        var y = [];
        return this.forEach(function(A, k) {
          y.push(k);
        }), l(y);
      }, f.prototype.values = function() {
        var y = [];
        return this.forEach(function(A) {
          y.push(A);
        }), l(y);
      }, f.prototype.entries = function() {
        var y = [];
        return this.forEach(function(A, k) {
          y.push([k, A]);
        }), l(y);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function u(y) {
        if (!y._noBody) {
          if (y.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          y.bodyUsed = !0;
        }
      }
      function g(y) {
        return new Promise(function(A, k) {
          y.onload = function() {
            A(y.result);
          }, y.onerror = function() {
            k(y.error);
          };
        });
      }
      function h(y) {
        var A = new FileReader(), k = g(A);
        return A.readAsArrayBuffer(y), k;
      }
      function w(y) {
        var A = new FileReader(), k = g(A), j = /charset=([A-Za-z0-9_-]+)/.exec(y.type), K = j ? j[1] : "utf-8";
        return A.readAsText(y, K), k;
      }
      function x(y) {
        for (var A = new Uint8Array(y), k = new Array(A.length), j = 0; j < A.length; j++)
          k[j] = String.fromCharCode(A[j]);
        return k.join("");
      }
      function E(y) {
        if (y.slice)
          return y.slice(0);
        var A = new Uint8Array(y.byteLength);
        return A.set(new Uint8Array(y)), A.buffer;
      }
      function U() {
        return this.bodyUsed = !1, this._initBody = function(y) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = y, y ? typeof y == "string" ? this._bodyText = y : r.blob && Blob.prototype.isPrototypeOf(y) ? this._bodyBlob = y : r.formData && FormData.prototype.isPrototypeOf(y) ? this._bodyFormData = y : r.searchParams && URLSearchParams.prototype.isPrototypeOf(y) ? this._bodyText = y.toString() : r.arrayBuffer && r.blob && s(y) ? (this._bodyArrayBuffer = E(y.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(y) || o(y)) ? this._bodyArrayBuffer = E(y) : this._bodyText = y = Object.prototype.toString.call(y) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof y == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(y) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var y = u(this);
          if (y)
            return y;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var y = u(this);
            return y || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var y = u(this);
          if (y)
            return y;
          if (this._bodyBlob)
            return w(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(p);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var _ = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function b(y) {
        var A = y.toUpperCase();
        return _.indexOf(A) > -1 ? A : y;
      }
      function I(y, A) {
        if (!(this instanceof I))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        A = A || {};
        var k = A.body;
        if (y instanceof I) {
          if (y.bodyUsed)
            throw new TypeError("Already read");
          this.url = y.url, this.credentials = y.credentials, A.headers || (this.headers = new f(y.headers)), this.method = y.method, this.mode = y.mode, this.signal = y.signal, !k && y._bodyInit != null && (k = y._bodyInit, y.bodyUsed = !0);
        } else
          this.url = String(y);
        if (this.credentials = A.credentials || this.credentials || "same-origin", (A.headers || !this.headers) && (this.headers = new f(A.headers)), this.method = b(A.method || this.method || "GET"), this.mode = A.mode || this.mode || null, this.signal = A.signal || this.signal || function() {
          if ("AbortController" in n) {
            var O = new AbortController();
            return O.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && k)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(k), (this.method === "GET" || this.method === "HEAD") && (A.cache === "no-store" || A.cache === "no-cache")) {
          var j = /([?&])_=[^&]*/;
          if (j.test(this.url))
            this.url = this.url.replace(j, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var K = /\?/;
            this.url += (K.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      I.prototype.clone = function() {
        return new I(this, { body: this._bodyInit });
      };
      function p(y) {
        var A = new FormData();
        return y.trim().split("&").forEach(function(k) {
          if (k) {
            var j = k.split("="), K = j.shift().replace(/\+/g, " "), O = j.join("=").replace(/\+/g, " ");
            A.append(decodeURIComponent(K), decodeURIComponent(O));
          }
        }), A;
      }
      function $(y) {
        var A = new f(), k = y.replace(/\r?\n[\t ]+/g, " ");
        return k.split("\r").map(function(j) {
          return j.indexOf(`
`) === 0 ? j.substr(1, j.length) : j;
        }).forEach(function(j) {
          var K = j.split(":"), O = K.shift().trim();
          if (O) {
            var $t = K.join(":").trim();
            try {
              A.append(O, $t);
            } catch (nt) {
              console.warn("Response " + nt.message);
            }
          }
        }), A;
      }
      U.call(I.prototype);
      function C(y, A) {
        if (!(this instanceof C))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (A || (A = {}), this.type = "default", this.status = A.status === void 0 ? 200 : A.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = A.statusText === void 0 ? "" : "" + A.statusText, this.headers = new f(A.headers), this.url = A.url || "", this._initBody(y);
      }
      U.call(C.prototype), C.prototype.clone = function() {
        return new C(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, C.error = function() {
        var y = new C(null, { status: 200, statusText: "" });
        return y.ok = !1, y.status = 0, y.type = "error", y;
      };
      var L = [301, 302, 303, 307, 308];
      C.redirect = function(y, A) {
        if (L.indexOf(A) === -1)
          throw new RangeError("Invalid status code");
        return new C(null, { status: A, headers: { location: y } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(A, k) {
          this.message = A, this.name = k;
          var j = Error(A);
          this.stack = j.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function N(y, A) {
        return new Promise(function(k, j) {
          var K = new I(y, A);
          if (K.signal && K.signal.aborted)
            return j(new e.DOMException("Aborted", "AbortError"));
          var O = new XMLHttpRequest();
          function $t() {
            O.abort();
          }
          O.onload = function() {
            var m = {
              statusText: O.statusText,
              headers: $(O.getAllResponseHeaders() || "")
            };
            K.url.indexOf("file://") === 0 && (O.status < 200 || O.status > 599) ? m.status = 200 : m.status = O.status, m.url = "responseURL" in O ? O.responseURL : m.headers.get("X-Request-URL");
            var B = "response" in O ? O.response : O.responseText;
            setTimeout(function() {
              k(new C(B, m));
            }, 0);
          }, O.onerror = function() {
            setTimeout(function() {
              j(new TypeError("Network request failed"));
            }, 0);
          }, O.ontimeout = function() {
            setTimeout(function() {
              j(new TypeError("Network request timed out"));
            }, 0);
          }, O.onabort = function() {
            setTimeout(function() {
              j(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function nt(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (O.open(K.method, nt(K.url), !0), K.credentials === "include" ? O.withCredentials = !0 : K.credentials === "omit" && (O.withCredentials = !1), "responseType" in O && (r.blob ? O.responseType = "blob" : r.arrayBuffer && (O.responseType = "arraybuffer")), A && typeof A.headers == "object" && !(A.headers instanceof f || n.Headers && A.headers instanceof n.Headers)) {
            var gt = [];
            Object.getOwnPropertyNames(A.headers).forEach(function(m) {
              gt.push(a(m)), O.setRequestHeader(m, c(A.headers[m]));
            }), K.headers.forEach(function(m, B) {
              gt.indexOf(B) === -1 && O.setRequestHeader(B, m);
            });
          } else
            K.headers.forEach(function(m, B) {
              O.setRequestHeader(B, m);
            });
          K.signal && (K.signal.addEventListener("abort", $t), O.onreadystatechange = function() {
            O.readyState === 4 && K.signal.removeEventListener("abort", $t);
          }), O.send(typeof K._bodyInit > "u" ? null : K._bodyInit);
        });
      }
      return N.polyfill = !0, n.fetch || (n.fetch = N, n.Headers = f, n.Request = I, n.Response = C), e.Headers = f, e.Request = I, e.Response = C, e.fetch = N, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : jt);
})();
const Gg = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Kg(t, e) {
  const n = {};
  return Object.assign(n, Gg, e), await fetch(t, n);
}
function Vg(t) {
  let e = Kg, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function qg(...t) {
  const { fetchLib: e, middlewares: n } = Vg(t);
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
var vr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(vr || (vr = {}));
var Fn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Fn || (Fn = {}));
var Vu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Vu || (Vu = {}));
const Wg = "https://api.mainnet.hiro.so", Yg = "https://api.testnet.hiro.so", Xg = "http://localhost:3999", Zg = ["mainnet", "testnet", "devnet", "mocknet"];
let Lr = class {
  constructor(e) {
    this.version = Fn.Mainnet, this.chainId = vr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Fn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? qg();
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
Lr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ah();
    case "testnet":
      return new Qg();
    case "devnet":
      return new Jg();
    case "mocknet":
      return new ch();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Zg.join(", ")}`);
  }
};
Lr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Lr.fromName(t);
let ah = class extends Lr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Wg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fn.Mainnet, this.chainId = vr.Mainnet;
  }
}, Qg = class extends Lr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Yg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fn.Testnet, this.chainId = vr.Testnet;
  }
}, ch = class extends Lr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Xg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fn.Testnet, this.chainId = vr.Testnet;
  }
};
const Jg = ch, uh = "xtrata.wallet.bridge.v1", t1 = (t) => typeof t == "object" && t !== null && t.protocol === uh, e1 = (t) => t1(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", n1 = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class ts extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const qu = 12e4;
class r1 {
  constructor(e) {
    Jr(this, "pending", /* @__PURE__ */ new Map());
    Jr(this, "listenTarget");
    Jr(this, "closed", !1);
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
    Jr(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !e1(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new ts("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new ts("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ts("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = n1(), i = { protocol: uh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ts(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? qu}ms.`
          )
        );
      }, this.options.timeoutMs ?? qu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new ts("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const s1 = ["SP", "SM"], i1 = ["ST", "SN"], o1 = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return s1.includes(n) ? "mainnet" : i1.includes(n) ? "testnet" : null;
}, a1 = () => {
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
}, c1 = () => typeof window > "u" || !window.localStorage ? a1() : window.localStorage, Po = "xtrata.v15.1.wallet.session", Wu = "mainnet", Ai = { isConnected: !1 }, u1 = (t) => t.address ? o1(t.address) ?? t.network : t.network, lh = (t) => !t.isConnected || !t.address ? { ...Ai } : u1(t) !== Wu ? { ...Ai } : {
  isConnected: !0,
  address: t.address,
  network: Wu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, l1 = (t) => {
  if (!t)
    return { ...Ai };
  try {
    const e = JSON.parse(t);
    return lh(e);
  } catch {
    return { ...Ai };
  }
}, f1 = (t) => {
  const e = lh(t);
  return JSON.stringify(e);
}, h1 = (t) => {
  const e = c1();
  return {
    load: () => l1(e.getItem(Po)),
    save: (n) => {
      e.setItem(Po, f1(n));
    },
    clear: () => {
      e.removeItem(Po);
    }
  };
}, d1 = "https://browser.blockstack.org/auth", p1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, fh = ["store_write"], g1 = "blockstack-session", y1 = {
  logLevel: "debug"
}, rr = {
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
Object.freeze(rr);
class Gr extends Error {
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
class b1 extends Gr {
  constructor(e, n = "") {
    super({ code: rr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Yu extends Gr {
  constructor(e = "") {
    super({ code: rr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Fs extends Gr {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: rr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Xu extends Gr {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: rr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class ua extends Gr {
  constructor(e) {
    super({ code: rr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class hh extends Gr {
  constructor(e) {
    super({ code: rr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Zu = ["debug", "info", "warn", "error", "none"], la = {};
for (let t = 0; t < Zu.length; t++) {
  const e = Zu[t];
  la[e] = t;
}
class Sr {
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
    return la[y1.logLevel] <= la[e];
  }
}
function w1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function x1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Do(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function m1() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function S1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function E1(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function gc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = S1(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Sr.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = E1(s, t.toString(), n);
    throw Sr.error(i), new Error(i);
  }
  if (r)
    return {};
}
function An(t, e) {
  return yc(kt(t), e);
}
function kt(t) {
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
  if (Vt(t, Uint8Array))
    return BigInt(`0x${G(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function A1(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Qu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Is(t, e = 8) {
  return (typeof t == "bigint" ? t : kt(t)).toString(16).padStart(e * 2, "0");
}
function Zi(t) {
  return parseInt(t, 16);
}
function yc(t, e = 16) {
  const n = Is(t, e);
  return at(n);
}
function $1(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function I1(t, e) {
  return t & BigInt(1) << e;
}
function fa(t) {
  return v1(BigInt(`0x${G(t)}`), BigInt(t.byteLength * 8));
}
function v1(t, e) {
  return I1(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const L1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function G(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += L1[n];
  return e;
}
function at(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = A1(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function sr(t) {
  return new TextEncoder().encode(t);
}
function vs(t) {
  return new TextDecoder().decode(t);
}
function B1(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function C1(t) {
  return String.fromCharCode.apply(null, t);
}
function M1(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ju(t) {
  if (t.some(M1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ve(...t) {
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
function vt(t) {
  return ve(...t.map((e) => typeof e == "number" ? Ju([e]) : e instanceof Array ? Ju(e) : e));
}
function Vt(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const dh = "https://api.mainnet.hiro.so", ph = "https://api.testnet.hiro.so", gh = "http://localhost:3999", U1 = "https://hub.blockstack.org", H1 = 33, Oo = 32;
function _1(t) {
  if (t.length < Oo * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Oo * 2), r = t.slice(2 + Oo * 2);
  return {
    recoveryId: Zi(e),
    r: n,
    s: r
  };
}
function bc(t) {
  const e = typeof t == "string" ? at(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function T1(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function N1(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function k1(t, e) {
  return t[e];
}
function P1(t, e, n = 0) {
  return t[n] = e, t;
}
function D1(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function zn(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const O1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function j1(t, e) {
  const n = {};
  return Object.assign(n, O1, e), await fetch(t, n);
}
function F1(t) {
  let e = j1, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function z1(...t) {
  const { fetchLib: e, middlewares: n } = F1(t);
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
class yh {
  constructor(e = fh.slice(), n = ((a) => (a = gc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = d1) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ha(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function R1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function bh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function G1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ha(t.outputLen), ha(t.blockLen);
}
function K1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function V1(t, e) {
  bh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Hn = {
  number: ha,
  bool: R1,
  bytes: bh,
  hash: G1,
  exists: K1,
  output: V1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const jo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ye = (t, e) => t << 32 - e | t >>> e, q1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!q1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function W1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function wc(t) {
  if (typeof t == "string" && (t = W1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let wh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ir(t) {
  const e = (r) => t().update(wc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let xh = class extends wh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Hn.hash(e);
    const r = wc(n);
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
    return Hn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Hn.exists(this), Hn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Qi = (t, e, n) => new xh(t, e).update(n).digest();
Qi.create = (t, e) => new xh(t, e);
function Y1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let xc = class extends wh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jo(this.buffer);
  }
  update(e) {
    Hn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = wc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = jo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Hn.exists(this), Hn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Y1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = jo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const X1 = (t, e, n) => t & e ^ ~t & n, Z1 = (t, e, n) => t & e ^ t & n ^ e & n, Q1 = new Uint32Array([
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
]), Re = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ge = new Uint32Array(64);
let mh = class extends xc {
  constructor() {
    super(64, 32, 8, !1), this.A = Re[0] | 0, this.B = Re[1] | 0, this.C = Re[2] | 0, this.D = Re[3] | 0, this.E = Re[4] | 0, this.F = Re[5] | 0, this.G = Re[6] | 0, this.H = Re[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      Ge[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = Ge[u - 15], h = Ge[u - 2], w = ye(g, 7) ^ ye(g, 18) ^ g >>> 3, x = ye(h, 17) ^ ye(h, 19) ^ h >>> 10;
      Ge[u] = x + Ge[u - 7] + w + Ge[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = ye(a, 6) ^ ye(a, 11) ^ ye(a, 25), h = f + g + X1(a, c, l) + Q1[u] + Ge[u] | 0, x = (ye(r, 2) ^ ye(r, 13) ^ ye(r, 22)) + Z1(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Ge.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, J1 = class extends mh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Br = ir(() => new mh());
ir(() => new J1());
const ty = {}, Sh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ty
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const it = BigInt(0), bt = BigInt(1), xn = BigInt(2), is = BigInt(3), tl = BigInt(8), ft = Object.freeze({
  a: it,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: bt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), el = (t, e) => (t + e / xn) / e, zs = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ft, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -bt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = el(i * t, e), c = el(-r * t, e);
    let l = P(t - a * n - c * s, e), f = P(-a * r - c * i, e);
    const u = l > o, g = f > o;
    if (u && (l = e - l), g && (f = e - f), l > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: u, k1: l, k2neg: g, k2: f };
  }
}, he = 32, Rn = 32, Eh = 32, $i = he + 1, Ii = 2 * he + 1;
function nl(t) {
  const { a: e, b: n } = ft, r = P(t * t), s = P(r * t);
  return P(s + e * t + n);
}
const Rs = ft.a === it;
class mc extends Error {
  constructor(e) {
    super(e);
  }
}
function rl(t) {
  if (!(t instanceof ut))
    throw new TypeError("JacobianPoint expected");
}
class ut {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof tt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(tt.ZERO) ? ut.ZERO : new ut(e.x, e.y, bt);
  }
  static toAffineBatch(e) {
    const n = iy(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return ut.toAffineBatch(e).map(ut.fromAffine);
  }
  equals(e) {
    rl(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = P(s * s), l = P(a * a), f = P(n * l), u = P(i * c), g = P(P(r * a) * l), h = P(P(o * s) * c);
    return f === u && g === h;
  }
  negate() {
    return new ut(this.x, P(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = P(e * e), i = P(n * n), o = P(i * i), a = e + i, c = P(xn * (P(a * a) - s - o)), l = P(is * s), f = P(l * l), u = P(f - xn * c), g = P(l * (c - u) - tl * o), h = P(xn * n * r);
    return new ut(u, g, h);
  }
  add(e) {
    rl(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === it || o === it)
      return this;
    if (n === it || r === it)
      return e;
    const c = P(s * s), l = P(a * a), f = P(n * l), u = P(i * c), g = P(P(r * a) * l), h = P(P(o * s) * c), w = P(u - f), x = P(h - g);
    if (w === it)
      return x === it ? this.double() : ut.ZERO;
    const E = P(w * w), U = P(w * E), _ = P(f * E), b = P(x * x - U - xn * _), I = P(x * (_ - b) - g * U), p = P(s * a * w);
    return new ut(b, I, p);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = ut.ZERO;
    if (typeof e == "bigint" && e === it)
      return n;
    let r = ol(e);
    if (r === bt)
      return this;
    if (!Rs) {
      let u = n, g = this;
      for (; r > it; )
        r & bt && (u = u.add(g)), g = g.double(), r >>= bt;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = zs.splitScalar(r), c = n, l = n, f = this;
    for (; i > it || a > it; )
      i & bt && (c = c.add(f)), a & bt && (l = l.add(f)), f = f.double(), i >>= bt, a >>= bt;
    return s && (c = c.negate()), o && (l = l.negate()), l = new ut(P(l.x * zs.beta), l.y, l.z), c.add(l);
  }
  precomputeWindow(e) {
    const n = Rs ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(ut.BASE) && (n = tt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && da.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ut.normalizeZ(s), da.set(n, s)));
    let i = ut.ZERO, o = ut.BASE;
    const a = 1 + (Rs ? 128 / r : 256 / r), c = 2 ** (r - 1), l = BigInt(2 ** r - 1), f = 2 ** r, u = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let w = Number(e & l);
      e >>= u, w > c && (w -= f, e += bt);
      const x = h, E = h + Math.abs(w) - 1, U = g % 2 !== 0, _ = w < 0;
      w === 0 ? o = o.add(Gs(U, s[x])) : i = i.add(Gs(_, s[E]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = ol(e), s, i;
    if (Rs) {
      const { k1neg: o, k1: a, k2neg: c, k2: l } = zs.splitScalar(r);
      let { p: f, f: u } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(l, n);
      f = Gs(o, f), g = Gs(c, g), g = new ut(P(g.x * zs.beta), g.y, g.z), s = f.add(g), i = u.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ut.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(ut.ZERO);
    e == null && (e = i ? tl : Kr(s));
    const o = e, a = P(o * o), c = P(a * o), l = P(n * a), f = P(r * c), u = P(s * o);
    if (i)
      return tt.ZERO;
    if (u !== bt)
      throw new Error("invZ was invalid");
    return new tt(l, f);
  }
}
ut.BASE = new ut(ft.Gx, ft.Gy, bt);
ut.ZERO = new ut(it, bt, it);
function Gs(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const da = /* @__PURE__ */ new WeakMap();
class tt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, da.delete(this);
  }
  hasEvenY() {
    return this.y % xn === it;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Jt(n ? e : e.subarray(1));
    if (!pi(r))
      throw new Error("Point is not on curve");
    const s = nl(r);
    let i = sy(s);
    const o = (i & bt) === bt;
    n ? o && (i = P(-i)) : (e[0] & 1) === 1 !== o && (i = P(-i));
    const a = new tt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Jt(e.subarray(1, he + 1)), r = Jt(e.subarray(he + 1, he * 2 + 1)), s = new tt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Le(e), r = n.length, s = n[0];
    if (r === he)
      return this.fromCompressedHex(n);
    if (r === $i && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Ii && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${$i} compressed bytes or ${Ii} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return tt.BASE.multiply(Gn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Ih(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Sc(Le(e)), { n: a } = ft, c = r === 2 || r === 3 ? s + a : s, l = Kr(c, a), f = P(-o * l, a), u = P(i * l, a), g = r & 1 ? "03" : "02", h = tt.fromHex(g + mn(c)), w = tt.BASE.multiplyAndAddUnsafe(h, f, u);
    if (!w)
      throw new Error("Cannot recover signature: point at infinify");
    return w.assertValidity(), w;
  }
  toRawBytes(e = !1) {
    return Sn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = mn(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${mn(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!pi(n) || !pi(r))
      throw new Error(e);
    const s = P(r * r), i = nl(n);
    if (P(s - i) !== it)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new tt(this.x, P(-this.y));
  }
  double() {
    return ut.fromAffine(this).double().toAffine();
  }
  add(e) {
    return ut.fromAffine(this).add(ut.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return ut.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = ut.fromAffine(this), i = n === it || n === bt || this !== tt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ut.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ut.ZERO) ? void 0 : a.toAffine();
  }
}
tt.BASE = new tt(ft.Gx, ft.Gy);
tt.ZERO = new tt(it, it);
function sl(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function il(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Cr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Jt(n), left: t.subarray(e + 2) };
}
function ey(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Cr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = il(t.subarray(2)), { data: r, left: s } = il(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Cr(s)}`);
  return { r: e, s: r };
}
class Qt {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Cr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Qt(vi(s.slice(0, 64)), vi(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = ey(n ? e : Sn(e));
    return new Qt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ur(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ur(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = ft.n >> bt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Qt(this.r, P(-this.s, ft.n)) : this;
  }
  toDERRawBytes() {
    return Sn(this.toDERHex());
  }
  toDERHex() {
    const e = sl(es(this.s)), n = sl(es(this.r)), r = e.length / 2, s = n.length / 2, i = es(r), o = es(s);
    return `30${es(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Sn(this.toCompactHex());
  }
  toCompactHex() {
    return mn(this.r) + mn(this.s);
  }
}
function yn(...t) {
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
const ny = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Cr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ny[t[n]];
  return e;
}
const ry = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function mn(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(it <= t && t < ry))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Mr(t) {
  const e = Sn(mn(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function es(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function vi(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Sn(t) {
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
function Jt(t) {
  return vi(Cr(t));
}
function Le(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Sn(t);
}
function ol(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ur(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function P(t, e = ft.P) {
  const n = t % e;
  return n >= it ? n : e + n;
}
function ne(t, e) {
  const { P: n } = ft;
  let r = t;
  for (; e-- > it; )
    r *= r, r %= n;
  return r;
}
function sy(t) {
  const { P: e } = ft, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, l = c * c * t % e, f = ne(l, is) * l % e, u = ne(f, is) * l % e, g = ne(u, xn) * c % e, h = ne(g, r) * g % e, w = ne(h, s) * h % e, x = ne(w, o) * w % e, E = ne(x, a) * x % e, U = ne(E, o) * w % e, _ = ne(U, is) * l % e, b = ne(_, i) * h % e, I = ne(b, n) * c % e, p = ne(I, xn);
  if (p * p % e !== t)
    throw new Error("Cannot find square root");
  return p;
}
function Kr(t, e = ft.P) {
  if (t === it || e <= it)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = P(t, e), r = e, s = it, i = bt;
  for (; n !== it; ) {
    const a = r / n, c = r % n, l = s - i * a;
    r = n, n = c, s = i, i = l;
  }
  if (r !== bt)
    throw new Error("invert: does not exist");
  return P(s, e);
}
function iy(t, e = ft.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === it ? i : (n[a] = i, P(i * o, e)), bt), s = Kr(r, e);
  return t.reduceRight((i, o, a) => o === it ? i : (n[a] = P(i * n[a], e), P(i * o, e)), s), n;
}
function oy(t) {
  const e = t.length * 8 - Rn * 8, n = Jt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Sc(t, e = !1) {
  const n = oy(t);
  if (e)
    return n;
  const { n: r } = ft;
  return n >= r ? n - r : n;
}
let Ir, os;
class Ah {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return At.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return os(this.k, ...e);
  }
  checkSync() {
    if (typeof os != "function")
      throw new mc("hmacSha256Sync needs to be set");
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
    return yn(...n);
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
    return yn(...n);
  }
}
function Ur(t) {
  return it < t && t < ft.n;
}
function pi(t) {
  return it < t && t < ft.P;
}
function $h(t, e, n, r = !0) {
  const { n: s } = ft, i = Sc(t, !0);
  if (!Ur(i))
    return;
  const o = Kr(i, s), a = tt.BASE.multiply(i), c = P(a.x, s);
  if (c === it)
    return;
  const l = P(o * P(e + n * c, s), s);
  if (l === it)
    return;
  let f = new Qt(c, l), u = (a.x === f.r ? 0 : 2) | Number(a.y & bt);
  return r && f.hasHighS() && (f = f.normalizeS(), u ^= 1), { sig: f, recovery: u };
}
function Gn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Rn)
      throw new Error("Expected 32 bytes of private key");
    e = vi(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Rn)
      throw new Error("Expected 32 bytes of private key");
    e = Jt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ur(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Ec(t) {
  return t instanceof tt ? (t.assertValidity(), t) : tt.fromHex(t);
}
function Ih(t) {
  if (t instanceof Qt)
    return t.assertValidity(), t;
  try {
    return Qt.fromDER(t);
  } catch {
    return Qt.fromCompact(t);
  }
}
function Ls(t, e = !1) {
  return tt.fromPrivateKey(t).toRawBytes(e);
}
function ay(t, e, n, r = !1) {
  return tt.fromSignature(t, e, n).toRawBytes(r);
}
function al(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === $i || r === Ii : n ? r === $i * 2 || r === Ii * 2 : t instanceof tt;
}
function Ac(t, e, n = !1) {
  if (al(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!al(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Ec(e);
  return r.assertValidity(), r.multiply(Gn(t)).toRawBytes(n);
}
function vh(t) {
  const e = t.length > he ? t.slice(0, he) : t;
  return Jt(e);
}
function cy(t) {
  const e = vh(t), n = P(e, ft.n);
  return Lh(n < it ? e : n);
}
function Lh(t) {
  return Mr(t);
}
function Bh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Le(t), s = Gn(e), i = [Lh(s), cy(r)];
  if (n != null) {
    n === !0 && (n = At.randomBytes(he));
    const c = Le(n);
    if (c.length !== he)
      throw new Error(`sign: Expected ${he} bytes of extra data`);
    i.push(c);
  }
  const o = yn(...i), a = vh(r);
  return { seed: o, m: a, d: s };
}
function Ch(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function uy(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Bh(t, e, n.extraEntropy), o = new Ah(Eh, Rn);
  await o.reseed(r);
  let a;
  for (; !(a = $h(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Ch(a, n);
}
function Ji(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Bh(t, e, n.extraEntropy), o = new Ah(Eh, Rn);
  o.reseedSync(r);
  let a;
  for (; !(a = $h(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Ch(a, n);
}
const ly = { strict: !0 };
function fy(t, e, n, r = ly) {
  let s;
  try {
    s = Ih(t), e = Le(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Sc(e);
  let c;
  try {
    c = Ec(n);
  } catch {
    return !1;
  }
  const { n: l } = ft, f = Kr(o, l), u = P(a * f, l), g = P(i * f, l), h = tt.BASE.multiplyAndAddUnsafe(c, u, g);
  return h ? P(h.x, l) === i : !1;
}
function Li(t) {
  return P(Jt(t), ft.n);
}
class Hr {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Le(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Jt(n.subarray(0, 32)), s = Jt(n.subarray(32, 64));
    return new Hr(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!pi(e) || !Ur(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return mn(this.r) + mn(this.s);
  }
  toRawBytes() {
    return Sn(this.toHex());
  }
}
function hy(t) {
  return tt.fromPrivateKey(t).toRawX();
}
class Mh {
  constructor(e, n, r = At.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Le(e);
    const { x: s, scalar: i } = this.getScalar(Gn(n));
    if (this.px = s, this.d = i, this.rand = Le(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = tt.fromPrivateKey(e), r = n.hasEvenY() ? e : ft.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Mr(e ^ Jt(n));
  }
  finalizeNonce(e) {
    const n = P(Jt(e), ft.n);
    if (n === it)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Hr(e.x, P(n + r * s, ft.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = At.taggedHash, o = this.initNonce(n, await i(pn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(await i(pn.nonce, o, r, e)), f = Li(await i(pn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return await _h(u, e, r) || this.error(), u;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = At.taggedHashSync, o = this.initNonce(n, i(pn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(i(pn.nonce, o, r, e)), f = Li(i(pn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return Th(u, e, r) || this.error(), u;
  }
}
async function dy(t, e, n) {
  return new Mh(t, e, n).calc();
}
function py(t, e, n) {
  return new Mh(t, e, n).calcSync();
}
function Uh(t, e, n) {
  const r = t instanceof Hr, s = r ? t : Hr.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Le(e),
    P: Ec(n)
  };
}
function Hh(t, e, n, r) {
  const s = tt.BASE.multiplyAndAddUnsafe(e, Gn(n), P(-r, ft.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function _h(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Uh(t, e, n), a = Li(await At.taggedHash(pn.challenge, Mr(r), o.toRawX(), i));
    return Hh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Th(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Uh(t, e, n), a = Li(At.taggedHashSync(pn.challenge, Mr(r), o.toRawX(), i));
    return Hh(r, o, s, a);
  } catch (r) {
    if (r instanceof mc)
      throw r;
    return !1;
  }
}
const gy = {
  Signature: Hr,
  getPublicKey: hy,
  sign: dy,
  verify: _h,
  signSync: py,
  verifySync: Th
};
tt.BASE._setWindowSize(8);
const qt = {
  node: Sh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, pn = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ks = {}, At = {
  bytesToHex: Cr,
  hexToBytes: Sn,
  concatBytes: yn,
  mod: P,
  invert: Kr,
  isValidPrivateKey(t) {
    try {
      return Gn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Mr,
  _normalizePrivateKey: Gn,
  hashToPrivateKey: (t) => {
    t = Le(t);
    const e = Rn + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = P(Jt(t), ft.n - bt) + bt;
    return Mr(n);
  },
  randomBytes: (t = 32) => {
    if (qt.web)
      return qt.web.getRandomValues(new Uint8Array(t));
    if (qt.node) {
      const { randomBytes: e } = qt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => At.hashToPrivateKey(At.randomBytes(Rn + 8)),
  precompute(t = 8, e = tt.BASE) {
    const n = e === tt.BASE ? e : new tt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(is), n;
  },
  sha256: async (...t) => {
    if (qt.web) {
      const e = await qt.web.subtle.digest("SHA-256", yn(...t));
      return new Uint8Array(e);
    } else if (qt.node) {
      const { createHash: e } = qt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (qt.web) {
      const n = await qt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = yn(...e), s = await qt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (qt.node) {
      const { createHmac: n } = qt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ks[t];
    if (n === void 0) {
      const r = await At.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = yn(r, r), Ks[t] = n;
    }
    return At.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Ir != "function")
      throw new mc("sha256Sync is undefined, you need to set it");
    let n = Ks[t];
    if (n === void 0) {
      const r = Ir(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = yn(r, r), Ks[t] = n;
    }
    return Ir(n, ...e);
  },
  _JacobianPoint: ut
};
Object.defineProperties(At, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ir;
    },
    set(t) {
      Ir || (Ir = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return os;
    },
    set(t) {
      os || (os = t);
    }
  }
});
const yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ft,
  Point: tt,
  Signature: Qt,
  getPublicKey: Ls,
  getSharedSecret: Ac,
  recoverPublicKey: ay,
  schnorr: gy,
  sign: uy,
  signSync: Ji,
  utils: At,
  verify: fy
}, Symbol.toStringTag, { value: "Module" }));
var Bs = {};
Bs.byteLength = Sy;
var by = Bs.toByteArray = Ay, wy = Bs.fromByteArray = vy, Se = [], re = [], xy = typeof Uint8Array < "u" ? Uint8Array : Array, Fo = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var wr = 0, my = Fo.length; wr < my; ++wr)
  Se[wr] = Fo[wr], re[Fo.charCodeAt(wr)] = wr;
re[45] = 62;
re[95] = 63;
function Nh(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Sy(t) {
  var e = Nh(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Ey(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Ay(t) {
  var e, n = Nh(t), r = n[0], s = n[1], i = new xy(Ey(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = re[t.charCodeAt(c)] << 18 | re[t.charCodeAt(c + 1)] << 12 | re[t.charCodeAt(c + 2)] << 6 | re[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = re[t.charCodeAt(c)] << 2 | re[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = re[t.charCodeAt(c)] << 10 | re[t.charCodeAt(c + 1)] << 4 | re[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function $y(t) {
  return Se[t >> 18 & 63] + Se[t >> 12 & 63] + Se[t >> 6 & 63] + Se[t & 63];
}
function Iy(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push($y(r));
  return s.join("");
}
function vy(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Iy(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Se[e >> 2] + Se[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Se[e >> 10] + Se[e >> 4 & 63] + Se[e << 2 & 63] + "="
  )), s.join("");
}
function Ly() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const By = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Cy() {
  if (Ly())
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
    throw new Error(By);
  }
}
class My {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(ve(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(ve(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Uy {
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
async function kh() {
  const t = await Cy();
  return t.name === "subtleCrypto" ? new Uy(t.lib) : new My(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Hy(t) {
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), l = Math.log(256) / Math.log(o);
  function f(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var w = 0, x = 0, E = 0, U = h.length; E !== U && h[E] === 0; )
      E++, w++;
    for (var _ = (U - E) * l + 1 >>> 0, b = new Uint8Array(_); E !== U; ) {
      for (var I = h[E], p = 0, $ = _ - 1; (I !== 0 || p < x) && $ !== -1; $--, p++)
        I += 256 * b[$] >>> 0, b[$] = I % o >>> 0, I = I / o >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      x = p, E++;
    }
    for (var C = _ - x; C !== _ && b[C] === 0; )
      C++;
    for (var L = a.repeat(w); C < _; ++C)
      L += t.charAt(b[C]);
    return L;
  }
  function u(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var w = 0, x = 0, E = 0; h[w] === a; )
      x++, w++;
    for (var U = (h.length - w) * c + 1 >>> 0, _ = new Uint8Array(U); h[w]; ) {
      var b = h.charCodeAt(w);
      if (b > 255)
        return;
      var I = e[b];
      if (I === 255)
        return;
      for (var p = 0, $ = U - 1; (I !== 0 || p < E) && $ !== -1; $--, p++)
        I += o * _[$] >>> 0, _[$] = I % 256 >>> 0, I = I / 256 >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      E = p, w++;
    }
    for (var C = U - E; C !== U && _[C] === 0; )
      C++;
    for (var L = new Uint8Array(x + (U - C)), N = x; C !== U; )
      L[N++] = _[C++];
    return L;
  }
  function g(h) {
    var w = u(h);
    if (w)
      return w;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: u,
    decode: g
  };
}
var Ph = Hy;
const _y = Ph, Ty = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Ny = _y(Ty);
const ky = /* @__PURE__ */ oh(Ny), Py = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Dh = Uint8Array.from({ length: 16 }, (t, e) => e), Dy = Dh.map((t) => (9 * t + 5) % 16);
let $c = [Dh], Ic = [Dy];
for (let t = 0; t < 4; t++)
  for (let e of [$c, Ic])
    e.push(e[t].map((n) => Py[n]));
const Oh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Oy = $c.map((t, e) => t.map((n) => Oh[e][n])), jy = Ic.map((t, e) => t.map((n) => Oh[e][n])), Fy = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zy = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vs = (t, e) => t << e | t >>> 32 - e;
function cl(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qs = new Uint32Array(16);
let Ry = class extends xc {
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
      qs[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, x = Fy[h], E = zy[h], U = $c[h], _ = Ic[h], b = Oy[h], I = jy[h];
      for (let p = 0; p < 16; p++) {
        const $ = Vs(r + cl(h, i, a, l) + qs[U[p]] + x, b[p]) + u | 0;
        r = u, u = l, l = Vs(a, 10) | 0, a = i, i = $;
      }
      for (let p = 0; p < 16; p++) {
        const $ = Vs(s + cl(w, o, c, f) + qs[_[p]] + E, I[p]) + g | 0;
        s = g, g = f, f = Vs(c, 10) | 0, c = o, o = $;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    qs.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Gy = ir(() => new Ry());
function Ky(t) {
  return Gy(t);
}
const Ws = BigInt(2 ** 32 - 1), pa = BigInt(32);
function jh(t, e = !1) {
  return e ? { h: Number(t & Ws), l: Number(t >> pa & Ws) } : { h: Number(t >> pa & Ws) | 0, l: Number(t & Ws) | 0 };
}
function Vy(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = jh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const qy = (t, e) => BigInt(t >>> 0) << pa | BigInt(e >>> 0), Wy = (t, e, n) => t >>> n, Yy = (t, e, n) => t << 32 - n | e >>> n, Xy = (t, e, n) => t >>> n | e << 32 - n, Zy = (t, e, n) => t << 32 - n | e >>> n, Qy = (t, e, n) => t << 64 - n | e >>> n - 32, Jy = (t, e, n) => t >>> n - 32 | e << 64 - n, tb = (t, e) => e, eb = (t, e) => t, nb = (t, e, n) => t << n | e >>> 32 - n, rb = (t, e, n) => e << n | t >>> 32 - n, sb = (t, e, n) => e << n - 32 | t >>> 64 - n, ib = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ob(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ab = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), cb = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ub = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), lb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, fb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), hb = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, W = {
  fromBig: jh,
  split: Vy,
  toBig: qy,
  shrSH: Wy,
  shrSL: Yy,
  rotrSH: Xy,
  rotrSL: Zy,
  rotrBH: Qy,
  rotrBL: Jy,
  rotr32H: tb,
  rotr32L: eb,
  rotlSH: nb,
  rotlSL: rb,
  rotlBH: sb,
  rotlBL: ib,
  add: ob,
  add3L: ab,
  add3H: cb,
  add4L: ub,
  add4H: lb,
  add5H: hb,
  add5L: fb
}, [db, pb] = W.split([
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
].map((t) => BigInt(t))), Ke = new Uint32Array(80), Ve = new Uint32Array(80);
let to = class extends xc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: w, Hh: x, Hl: E } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, w, x, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, w, x, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = x | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Ke[b] = e.getUint32(n), Ve[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const I = Ke[b - 15] | 0, p = Ve[b - 15] | 0, $ = W.rotrSH(I, p, 1) ^ W.rotrSH(I, p, 8) ^ W.shrSH(I, p, 7), C = W.rotrSL(I, p, 1) ^ W.rotrSL(I, p, 8) ^ W.shrSL(I, p, 7), L = Ke[b - 2] | 0, N = Ve[b - 2] | 0, y = W.rotrSH(L, N, 19) ^ W.rotrBH(L, N, 61) ^ W.shrSH(L, N, 6), A = W.rotrSL(L, N, 19) ^ W.rotrBL(L, N, 61) ^ W.shrSL(L, N, 6), k = W.add4L(C, A, Ve[b - 7], Ve[b - 16]), j = W.add4H(k, $, y, Ke[b - 7], Ke[b - 16]);
      Ke[b] = j | 0, Ve[b] = k | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: w, Gh: x, Gl: E, Hh: U, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const I = W.rotrSH(u, g, 14) ^ W.rotrSH(u, g, 18) ^ W.rotrBH(u, g, 41), p = W.rotrSL(u, g, 14) ^ W.rotrSL(u, g, 18) ^ W.rotrBL(u, g, 41), $ = u & h ^ ~u & x, C = g & w ^ ~g & E, L = W.add5L(_, p, C, pb[b], Ve[b]), N = W.add5H(L, U, I, $, db[b], Ke[b]), y = L | 0, A = W.rotrSH(r, s, 28) ^ W.rotrBH(r, s, 34) ^ W.rotrBH(r, s, 39), k = W.rotrSL(r, s, 28) ^ W.rotrBL(r, s, 34) ^ W.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = x | 0, _ = E | 0, x = h | 0, E = w | 0, h = u | 0, w = g | 0, { h: u, l: g } = W.add(l | 0, f | 0, N | 0, y | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const O = W.add3L(y, k, K);
      r = W.add3H(O, N, A, j), s = O | 0;
    }
    ({ h: r, l: s } = W.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = W.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = W.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = W.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = W.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: w } = W.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: x, l: E } = W.add(this.Gh | 0, this.Gl | 0, x | 0, E | 0), { h: U, l: _ } = W.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, w, x, E, U, _);
  }
  roundClean() {
    Ke.fill(0), Ve.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, gb = class extends to {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, yb = class extends to {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, bb = class extends to {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const wb = ir(() => new to());
ir(() => new gb());
ir(() => new yb());
ir(() => new bb());
function Fh(t) {
  return Br(t);
}
function xb(t) {
  return wb(t);
}
const mb = 0;
At.hmacSha256Sync = (t, ...e) => {
  const n = Qi.create(Br, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Sb() {
  return G(At.randomPrivateKey());
}
function Eb(t) {
  const e = Br(Br(t));
  return ky.encode(ve(t, e).slice(0, t.length + 4));
}
function Ab(t, e) {
  return Eb(ve(new Uint8Array([t]), e.slice(0, 20)));
}
function zh(t, e = mb) {
  const n = typeof t == "string" ? at(t) : t, r = Ky(Fh(n));
  return Ab(e, r);
}
function Rh(t) {
  const e = bc(t);
  return G(Ls(e.slice(0, 32), !0));
}
At.hmacSha256Sync = (t, ...e) => {
  const n = Qi.create(Br, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Bi;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Bi || (Bi = {}));
async function $b(t, e, n) {
  return await (await kh()).encrypt("aes-256-cbc", e, t, n);
}
async function Ib(t, e, n) {
  return await (await kh()).decrypt("aes-256-cbc", e, t, n);
}
function Gh(t, e) {
  return Qi(Br, t, e);
}
function vb(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Kh(t) {
  const e = xb(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Lb(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Bb(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Bi.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Bi.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Lb(t))
    return e;
  try {
    return tt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Cb(t, e, n, r) {
  const s = Bb(t);
  if (!s.result)
    throw s;
  const i = At.randomPrivateKey(), o = Ls(i, !0);
  let a = Ac(i, t, !0);
  a = a.slice(1);
  const c = Kh(a), l = At.randomBytes(16), f = await $b(l, c.encryptionKey, e), u = ve(l, o, f), g = Gh(c.hmacKey, u);
  let h;
  if (!r || r === "hex")
    h = G(f);
  else if (r === "base64")
    h = wy(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const w = {
    iv: G(l),
    ephemeralPK: G(o),
    cipherText: h,
    mac: G(g),
    wasString: n
  };
  return r && r !== "hex" && (w.cipherTextEncoding = r), w;
}
async function Vh(t, e) {
  if (!e.ephemeralPK)
    throw new Xu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Ac(t, n, !0);
  r = r.slice(1);
  const s = Kh(r), i = at(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = at(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = by(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ve(i, at(n), o), c = Gh(s.hmacKey, a), l = at(e.mac);
  if (!vb(l, c))
    throw new Xu("Decryption failed: failure in MAC check");
  const f = await Ib(i, s.encryptionKey, o);
  return e.wasString ? vs(f) : f;
}
function Mb(t, e) {
  const n = typeof e == "string" ? sr(e) : e, r = Rh(t), s = Fh(n), i = Ji(s, t);
  return {
    signature: G(i),
    publicKey: r
  };
}
async function Ub(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Rh(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? sr(t) : t, o = await Cb(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Mb(r, a), l = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(l);
  }
  return a;
}
function Hb(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Vh(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var _t = {}, _r = {}, Dt = {};
Object.defineProperty(Dt, "__esModule", { value: !0 });
Dt.decode = Dt.encode = Dt.unescape = Dt.escape = Dt.pad = void 0;
const qh = Bs;
function vc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Dt.pad = vc;
function Wh(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Dt.escape = Wh;
function Yh(t) {
  return vc(t).replace(/-/g, "+").replace(/_/g, "/");
}
Dt.unescape = Yh;
function _b(t) {
  return Wh((0, qh.fromByteArray)(new TextEncoder().encode(t)));
}
Dt.encode = _b;
function Tb(t) {
  return new TextDecoder().decode((0, qh.toByteArray)(vc(Yh(t))));
}
Dt.decode = Tb;
var eo = {}, no = {}, Xh = {}, Zh = {}, ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
ro.crypto = void 0;
ro.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = l, t.clean = f, t.createView = u, t.rotr = g, t.rotl = h, t.byteSwap = w, t.byteSwap32 = x, t.bytesToHex = _, t.hexToBytes = p, t.asyncLoop = C, t.utf8ToBytes = L, t.bytesToUtf8 = N, t.toBytes = y, t.kdfInputToBytes = A, t.concatBytes = k, t.checkOpts = j, t.createHasher = O, t.createOptHasher = $t, t.createXOFer = nt, t.randomBytes = gt;
  const e = ro;
  function n(m) {
    return m instanceof Uint8Array || ArrayBuffer.isView(m) && m.constructor.name === "Uint8Array";
  }
  function r(m) {
    if (!Number.isSafeInteger(m) || m < 0)
      throw new Error("positive integer expected, got " + m);
  }
  function s(m, ...B) {
    if (!n(m))
      throw new Error("Uint8Array expected");
    if (B.length > 0 && !B.includes(m.length))
      throw new Error("Uint8Array expected of length " + B + ", got length=" + m.length);
  }
  function i(m) {
    if (typeof m != "function" || typeof m.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(m.outputLen), r(m.blockLen);
  }
  function o(m, B = !0) {
    if (m.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (B && m.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(m, B) {
    s(m);
    const ot = B.outputLen;
    if (m.length < ot)
      throw new Error("digestInto() expects output buffer of length at least " + ot);
  }
  function c(m) {
    return new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
  }
  function l(m) {
    return new Uint32Array(m.buffer, m.byteOffset, Math.floor(m.byteLength / 4));
  }
  function f(...m) {
    for (let B = 0; B < m.length; B++)
      m[B].fill(0);
  }
  function u(m) {
    return new DataView(m.buffer, m.byteOffset, m.byteLength);
  }
  function g(m, B) {
    return m << 32 - B | m >>> B;
  }
  function h(m, B) {
    return m << B | m >>> 32 - B >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function w(m) {
    return m << 24 & 4278190080 | m << 8 & 16711680 | m >>> 8 & 65280 | m >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (m) => m : (m) => w(m), t.byteSwapIfBE = t.swap8IfBE;
  function x(m) {
    for (let B = 0; B < m.length; B++)
      m[B] = w(m[B]);
    return m;
  }
  t.swap32IfBE = t.isLE ? (m) => m : x;
  const E = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, (m, B) => B.toString(16).padStart(2, "0"));
  function _(m) {
    if (s(m), E)
      return m.toHex();
    let B = "";
    for (let ot = 0; ot < m.length; ot++)
      B += U[m[ot]];
    return B;
  }
  const b = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function I(m) {
    if (m >= b._0 && m <= b._9)
      return m - b._0;
    if (m >= b.A && m <= b.F)
      return m - (b.A - 10);
    if (m >= b.a && m <= b.f)
      return m - (b.a - 10);
  }
  function p(m) {
    if (typeof m != "string")
      throw new Error("hex string expected, got " + typeof m);
    if (E)
      return Uint8Array.fromHex(m);
    const B = m.length, ot = B / 2;
    if (B % 2)
      throw new Error("hex string expected, got unpadded hex of length " + B);
    const ct = new Uint8Array(ot);
    for (let st = 0, It = 0; st < ot; st++, It += 2) {
      const ge = I(m.charCodeAt(It)), M = I(m.charCodeAt(It + 1));
      if (ge === void 0 || M === void 0) {
        const T = m[It] + m[It + 1];
        throw new Error('hex string expected, got non-hex character "' + T + '" at index ' + It);
      }
      ct[st] = ge * 16 + M;
    }
    return ct;
  }
  const $ = async () => {
  };
  t.nextTick = $;
  async function C(m, B, ot) {
    let ct = Date.now();
    for (let st = 0; st < m; st++) {
      ot(st);
      const It = Date.now() - ct;
      It >= 0 && It < B || (await (0, t.nextTick)(), ct += It);
    }
  }
  function L(m) {
    if (typeof m != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(m));
  }
  function N(m) {
    return new TextDecoder().decode(m);
  }
  function y(m) {
    return typeof m == "string" && (m = L(m)), s(m), m;
  }
  function A(m) {
    return typeof m == "string" && (m = L(m)), s(m), m;
  }
  function k(...m) {
    let B = 0;
    for (let ct = 0; ct < m.length; ct++) {
      const st = m[ct];
      s(st), B += st.length;
    }
    const ot = new Uint8Array(B);
    for (let ct = 0, st = 0; ct < m.length; ct++) {
      const It = m[ct];
      ot.set(It, st), st += It.length;
    }
    return ot;
  }
  function j(m, B) {
    if (B !== void 0 && {}.toString.call(B) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, B);
  }
  class K {
  }
  t.Hash = K;
  function O(m) {
    const B = (ct) => m().update(y(ct)).digest(), ot = m();
    return B.outputLen = ot.outputLen, B.blockLen = ot.blockLen, B.create = () => m(), B;
  }
  function $t(m) {
    const B = (ct, st) => m(st).update(y(ct)).digest(), ot = m({});
    return B.outputLen = ot.outputLen, B.blockLen = ot.blockLen, B.create = (ct) => m(ct), B;
  }
  function nt(m) {
    const B = (ct, st) => m(st).update(y(ct)).digest(), ot = m({});
    return B.outputLen = ot.outputLen, B.blockLen = ot.blockLen, B.create = (ct) => m(ct), B;
  }
  t.wrapConstructor = O, t.wrapConstructorWithOpts = $t, t.wrapXOFConstructorWithOpts = nt;
  function gt(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Zh);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Zh;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, l = new Uint8Array(c);
      l.set(a.length > c ? i.create().update(a).digest() : a);
      for (let f = 0; f < l.length; f++)
        l[f] ^= 54;
      this.iHash.update(l), this.oHash = i.create();
      for (let f = 0; f < l.length; f++)
        l[f] ^= 106;
      this.oHash.update(l), (0, e.clean)(l);
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
      const { oHash: o, iHash: a, finished: c, destroyed: l, blockLen: f, outputLen: u } = this;
      return i = i, i.finished = c, i.destroyed = l, i.blockLen = f, i.outputLen = u, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(Xh);
const xr = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Qh(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function ga(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function or(t, ...e) {
  if (!Qh(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Nb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  ga(t.outputLen), ga(t.blockLen);
}
function ya(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Jh(t, e) {
  or(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function kb(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Pb(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ci(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function gi(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function oe(t, e) {
  return t << 32 - e | t >>> e;
}
function Db(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Lc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Bc(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const td = Lc ? (t) => t : (t) => Bc(t), Ob = td;
function ed(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Bc(t[e]);
  return t;
}
const jb = Lc ? (t) => t : ed, nd = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Fb = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zb(t) {
  if (or(t), nd)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Fb[t[n]];
  return e;
}
const _e = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function ul(t) {
  if (t >= _e._0 && t <= _e._9)
    return t - _e._0;
  if (t >= _e.A && t <= _e.F)
    return t - (_e.A - 10);
  if (t >= _e.a && t <= _e.f)
    return t - (_e.a - 10);
}
function Rb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (nd)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = ul(t.charCodeAt(i)), a = ul(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const rd = async () => {
};
async function Gb(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await rd(), r += i);
  }
}
function Cc(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Kb(t) {
  return new TextDecoder().decode(t);
}
function Cs(t) {
  return typeof t == "string" && (t = Cc(t)), or(t), t;
}
function Vb(t) {
  return typeof t == "string" && (t = Cc(t)), or(t), t;
}
function qb(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    or(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Wb(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let sd = class {
};
function so(t) {
  const e = (r) => t().update(Cs(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function id(t) {
  const e = (r, s) => t(s).update(Cs(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function od(t) {
  const e = (r, s) => t(s).update(Cs(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Yb = so, Xb = id, Zb = od;
function Qb(t = 32) {
  if (xr && typeof xr.getRandomValues == "function")
    return xr.getRandomValues(new Uint8Array(t));
  if (xr && typeof xr.randomBytes == "function")
    return Uint8Array.from(xr.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Jb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: sd,
  abytes: or,
  aexists: ya,
  ahash: Nb,
  anumber: ga,
  aoutput: Jh,
  asyncLoop: Gb,
  byteSwap: Bc,
  byteSwap32: ed,
  byteSwapIfBE: Ob,
  bytesToHex: zb,
  bytesToUtf8: Kb,
  checkOpts: Wb,
  clean: Ci,
  concatBytes: qb,
  createHasher: so,
  createOptHasher: id,
  createView: gi,
  createXOFer: od,
  hexToBytes: Rb,
  isBytes: Qh,
  isLE: Lc,
  kdfInputToBytes: Vb,
  nextTick: rd,
  randomBytes: Qb,
  rotl: Db,
  rotr: oe,
  swap32IfBE: jb,
  swap8IfBE: td,
  toBytes: Cs,
  u32: Pb,
  u8: kb,
  utf8ToBytes: Cc,
  wrapConstructor: Yb,
  wrapConstructorWithOpts: Xb,
  wrapXOFConstructorWithOpts: Zb
}, Symbol.toStringTag, { value: "Module" }));
function tw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
function ew(t, e, n) {
  return t & e ^ ~t & n;
}
function nw(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class rw extends sd {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = gi(this.buffer);
  }
  update(e) {
    ya(this), e = Cs(e), or(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = gi(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ya(this), Jh(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Ci(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    tw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = gi(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const qe = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), We = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), sw = /* @__PURE__ */ Uint32Array.from([
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
]), Ye = /* @__PURE__ */ new Uint32Array(64);
let Mc = class extends rw {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = qe[0] | 0, this.B = qe[1] | 0, this.C = qe[2] | 0, this.D = qe[3] | 0, this.E = qe[4] | 0, this.F = qe[5] | 0, this.G = qe[6] | 0, this.H = qe[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      Ye[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = Ye[u - 15], h = Ye[u - 2], w = oe(g, 7) ^ oe(g, 18) ^ g >>> 3, x = oe(h, 17) ^ oe(h, 19) ^ h >>> 10;
      Ye[u] = x + Ye[u - 7] + w + Ye[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = oe(a, 6) ^ oe(a, 11) ^ oe(a, 25), h = f + g + ew(a, c, l) + sw[u] + Ye[u] | 0, x = (oe(r, 2) ^ oe(r, 13) ^ oe(r, 22)) + nw(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Ci(Ye);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ci(this.buffer);
  }
}, ad = class extends Mc {
  constructor() {
    super(28), this.A = We[0] | 0, this.B = We[1] | 0, this.C = We[2] | 0, this.D = We[3] | 0, this.E = We[4] | 0, this.F = We[5] | 0, this.G = We[6] | 0, this.H = We[7] | 0;
  }
};
const iw = /* @__PURE__ */ so(() => new Mc()), ow = /* @__PURE__ */ so(() => new ad()), aw = Mc, cw = iw, uw = ad, lw = ow, fw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: uw,
  SHA256: aw,
  sha224: lw,
  sha256: cw
}, Symbol.toStringTag, { value: "Module" })), io = /* @__PURE__ */ Xi(fw), hw = /* @__PURE__ */ Xi(yy);
var Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.joseToDer = Tr.derToJose = void 0;
const cd = Bs, ud = Dt;
function zo(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const dw = {
  ES256: zo(256),
  ES384: zo(384),
  ES512: zo(521)
};
function ld(t) {
  const e = dw[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Mi = 128, fd = 0, pw = 32, gw = 16, yw = 2, hd = gw | pw | fd << 6, Ui = yw | fd << 6;
function dd(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, cd.toByteArray)((0, ud.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function bw(t, e) {
  const n = dd(t), r = ld(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== hd)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Mi | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Ui)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const l = o;
  if (o += c, n[o++] !== Ui)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const u = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, h = r - f, w = new Uint8Array(g + c + h + f);
  for (o = 0; o < g; ++o)
    w[o] = 0;
  w.set(n.subarray(l + Math.max(-g, 0), l + c), o), o = r;
  for (const x = o; o < x + h; ++o)
    w[o] = 0;
  return w.set(n.subarray(u + Math.max(-h, 0), u + f), o), (0, ud.escape)((0, cd.fromByteArray)(w));
}
Tr.derToJose = bw;
function ll(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Mi && --r, r;
}
function ww(t, e) {
  t = dd(t);
  const n = ld(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = ll(t, 0, n), i = ll(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, l = c < Mi, f = new Uint8Array((l ? 2 : 3) + c);
  let u = 0;
  return f[u++] = hd, l ? f[u++] = c : (f[u++] = Mi | 1, f[u++] = c & 255), f[u++] = Ui, f[u++] = o, s < 0 ? (f[u++] = 0, f.set(t.subarray(0, n), u), u += n) : (f.set(t.subarray(s, n), u), u += n - s), f[u++] = Ui, f[u++] = a, i < 0 ? (f[u++] = 0, f.set(t.subarray(n), u)) : f.set(t.subarray(n + i), u), f;
}
Tr.joseToDer = ww;
var Oe = {};
Object.defineProperty(Oe, "__esModule", { value: !0 });
Oe.InvalidTokenError = Oe.MissingParametersError = void 0;
class xw extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Oe.MissingParametersError = xw;
class mw extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Oe.InvalidTokenError = mw;
const Ms = /* @__PURE__ */ Xi(Jb);
Object.defineProperty(no, "__esModule", { value: !0 });
no.SECP256K1Client = void 0;
const Sw = Xh, Ew = io, yi = hw, fl = Tr, hl = Oe, dl = Ms;
yi.utils.hmacSha256Sync = (t, ...e) => {
  const n = Sw.hmac.create(Ew.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class pd {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, dl.bytesToHex)(yi.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new hl.MissingParametersError("a signing input hash and private key are all required");
    const s = yi.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, dl.bytesToHex)(s);
    if (r === "jose")
      return (0, fl.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, fl.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new hl.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return yi.verify(n, e, r, { strict: !1 });
  }
}
no.SECP256K1Client = pd;
pd.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = no;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(eo);
var Kn = {};
const Aw = /* @__PURE__ */ Xi(Sh);
var $w = jt && jt.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(f) {
      try {
        l(r.next(f));
      } catch (u) {
        o(u);
      }
    }
    function c(f) {
      try {
        l(r.throw(f));
      } catch (u) {
        o(u);
      }
    }
    function l(f) {
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.hashSha256Async = Kn.hashSha256 = void 0;
const Iw = io;
function gd(t) {
  return (0, Iw.sha256)(t);
}
Kn.hashSha256 = gd;
function vw(t) {
  return $w(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Aw;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(gd(t));
    }
  });
}
Kn.hashSha256Async = vw;
var Lw = jt && jt.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(f) {
      try {
        l(r.next(f));
      } catch (u) {
        o(u);
      }
    }
    function c(f) {
      try {
        l(r.throw(f));
      } catch (u) {
        o(u);
      }
    }
    function l(f) {
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.TokenSigner = _r.createUnsecuredToken = void 0;
const ba = Dt, pl = eo, Bw = Oe, gl = Kn;
function wa(t, e) {
  const n = [], r = ba.encode(JSON.stringify(e));
  n.push(r);
  const s = ba.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Cw(t) {
  return wa(t, { typ: "JWT", alg: "none" }) + ".";
}
_r.createUnsecuredToken = Cw;
class Mw {
  constructor(e, n) {
    if (!(e && n))
      throw new Bw.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !pl.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = pl.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = wa(e, s), o = (0, gl.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Lw(this, void 0, void 0, function* () {
      const s = this.header(r), i = wa(e, s), o = yield (0, gl.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [ba.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
_r.TokenSigner = Mw;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
oo.TokenVerifier = void 0;
const Uw = Dt, yl = eo, Hw = Oe, Ys = Kn;
class _w {
  constructor(e, n) {
    if (!(e && n))
      throw new Hw.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !yl.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = yl.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Ys.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Ys.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Uw.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ys.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Ys.hashSha256)(r);
      return i(o);
    }
  }
}
oo.TokenVerifier = _w;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
ao.decodeToken = void 0;
const Xs = Dt;
function Tw(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Xs.decode(e[0])), r = JSON.parse(Xs.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Xs.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Xs.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
ao.decodeToken = Tw;
(function(t) {
  var e = jt && jt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = jt && jt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(_r, t), n(oo, t), n(ao, t), n(Oe, t), n(eo, t);
})(_t);
function Nw(t) {
  return `did:btc-addr:${t}`;
}
function kw(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Yu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Yu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function yd(t) {
  if (t)
    return kw(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Pw = "1.4.0";
function Dw() {
  return Sb();
}
function Ow(t, e, n, r = fh.slice(), s, i = w1().getTime(), o = {}) {
  const a = (h) => {
    const w = gc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return w == null ? void 0 : w.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: m1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Pw,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), l = _t.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [l];
  const f = zh(l);
  return c.iss = Nw(f), new _t.TokenSigner("ES256k", t).sign(c);
}
async function bl(t, e) {
  const n = vs(at(e)), r = JSON.parse(n), s = await Vh(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function jw(t) {
  const e = _t.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new _t.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Fw(t) {
  const e = _t.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = yd(e.iss);
  if (n.length === 1) {
    if (zh(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function zw(t) {
  const e = _t.decodeToken(t).payload;
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
function Rw(t) {
  const e = _t.decodeToken(t).payload;
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
function Gw(t) {
  const e = [
    Rw(t),
    zw(t),
    jw(t),
    Fw(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const wl = "1.0.0";
class En {
  constructor(e) {
    this.version = wl, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== wl)
      throw new ua(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new En(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class bd {
  constructor(e) {
    if (e) {
      const n = new En(e);
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
class xl extends bd {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new En({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new hh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new En({})), !0;
  }
}
class ml extends bd {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = g1, !localStorage.getItem(this.key)) {
      const r = new En({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new hh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return En.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new En({})), !0;
  }
}
var ds;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ds || (ds = {}));
var Hi;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Hi || (Hi = {}));
ds.Mainnet;
var Pe;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pe || (Pe = {}));
var Ae;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ae || (Ae = {}));
Pe.Mainnet;
const wd = {
  chainId: ds.Mainnet,
  transactionVersion: Pe.Mainnet,
  peerNetworkId: Hi.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ae.MainnetSingleSig,
    multiSig: Ae.MainnetMultiSig
  },
  client: { baseUrl: dh }
}, xa = {
  chainId: ds.Testnet,
  transactionVersion: Pe.Testnet,
  peerNetworkId: Hi.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ae.TestnetSingleSig,
    multiSig: Ae.TestnetMultiSig
  },
  client: { baseUrl: ph }
}, bi = {
  ...xa,
  addressVersion: { ...xa.addressVersion },
  magicBytes: "id",
  client: { baseUrl: gh }
}, Kw = {
  ...bi,
  addressVersion: { ...bi.addressVersion },
  client: { ...bi.client }
};
function Vw(t) {
  switch (t) {
    case "mainnet":
      return wd;
    case "testnet":
      return xa;
    case "devnet":
      return bi;
    case "mocknet":
      return Kw;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function xd(t) {
  return typeof t == "string" ? Vw(t) : t;
}
var Sl;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Sl || (Sl = {}));
var El;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(El || (El = {}));
var ae;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ae || (ae = {}));
const Ro = ["onChainOnly", "offChainOnly", "any"];
Ro[0] + "", ae.OnChainOnly, Ro[1] + "", ae.OffChainOnly, Ro[2] + "", ae.Any, ae.OnChainOnly + "", ae.OnChainOnly, ae.OffChainOnly + "", ae.OffChainOnly, ae.Any + "", ae.Any;
var Al;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Al || (Al = {}));
var $l;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})($l || ($l = {}));
var Il;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Il || (Il = {}));
var ke;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ke || (ke = {}));
var vl;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(vl || (vl = {}));
var Ll;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ll || (Ll = {}));
var Bl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Bl || (Bl = {}));
var Cl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Cl || (Cl = {}));
var Ml;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ml || (Ml = {}));
var Ul;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ul || (Ul = {}));
var Hl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Hl || (Hl = {}));
var _l;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(_l || (_l = {}));
var Tl;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Tl || (Tl = {}));
function ma(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function qw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function md(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ww(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ma(t.outputLen), ma(t.blockLen);
}
function Yw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xw(t, e) {
  md(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const _n = {
  number: ma,
  bool: qw,
  bytes: md,
  hash: Ww,
  exists: Yw,
  output: Xw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Go = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), be = (t, e) => t << 32 - e | t >>> e, Zw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Zw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Uc(t) {
  if (typeof t == "string" && (t = Qw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Sd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ar(t) {
  const e = (r) => t().update(Uc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Ed = class extends Sd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, _n.hash(e);
    const r = Uc(n);
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
    return _n.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    _n.exists(this), _n.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ad = (t, e, n) => new Ed(t, e).update(n).digest();
Ad.create = (t, e) => new Ed(t, e);
function Jw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Hc = class extends Sd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Go(this.buffer);
  }
  update(e) {
    _n.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Uc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Go(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    _n.exists(this), _n.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Jw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Go(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const t2 = (t, e, n) => t & e ^ ~t & n, e2 = (t, e, n) => t & e ^ t & n ^ e & n, n2 = new Uint32Array([
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
]), Xe = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ze = new Uint32Array(64);
let $d = class extends Hc {
  constructor() {
    super(64, 32, 8, !1), this.A = Xe[0] | 0, this.B = Xe[1] | 0, this.C = Xe[2] | 0, this.D = Xe[3] | 0, this.E = Xe[4] | 0, this.F = Xe[5] | 0, this.G = Xe[6] | 0, this.H = Xe[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      Ze[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = Ze[u - 15], h = Ze[u - 2], w = be(g, 7) ^ be(g, 18) ^ g >>> 3, x = be(h, 17) ^ be(h, 19) ^ h >>> 10;
      Ze[u] = x + Ze[u - 7] + w + Ze[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = be(a, 6) ^ be(a, 11) ^ be(a, 25), h = f + g + t2(a, c, l) + n2[u] + Ze[u] | 0, x = (be(r, 2) ^ be(r, 13) ^ be(r, 22)) + e2(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Ze.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, r2 = class extends $d {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Id = ar(() => new $d());
ar(() => new r2());
var cr = {}, _c = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Ms;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], l = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (l < 4) {
        const w = n.indexOf(o[h]) >> l;
        let x = 0;
        h !== 0 && (x = n.indexOf(o[h - 1]));
        const E = 1 + l, U = x % (1 << E) << 5 - E, _ = t.c32[w + U];
        l = E, c.unshift(_);
      } else
        l = 0;
    let f = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      f++;
    c = c.slice(f);
    const u = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = u ? u[0].length : 0;
    for (let h = 0; h < g; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let w = 0; w < h; w++)
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
    const c = o.match(`^${t.c32[0]}*`), l = c ? c[0].length : 0;
    let f = [], u = 0, g = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      g === 4 && (f.unshift(n[u]), g = 0, u = 0);
      const U = (t.c32.indexOf(o[x]) << g) + u, _ = n[U % 16];
      if (g += 1, u = U >> 4, u > 1 << g)
        throw new Error("Panic error in decoding.");
      f.unshift(_);
    }
    f.unshift(n[u]), f.length % 2 === 1 && f.unshift("0");
    let h = 0;
    for (let x = 0; x < f.length && f[x] === "0"; x++)
      h++;
    f = f.slice(h - h % 2);
    let w = f.join("");
    for (let x = 0; x < l; x++)
      w = `00${w}`;
    if (a) {
      const x = a * 2 - w.length;
      for (let E = 0; E < x; E += 2)
        w = `00${w}`;
    }
    return w;
  }
  t.c32decode = i;
})(_c);
var Vn = {};
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.c32checkDecode = Vn.c32checkEncode = void 0;
const Nl = io, kl = Ms, as = _c;
function vd(t) {
  const e = (0, Nl.sha256)((0, Nl.sha256)((0, kl.hexToBytes)(t)));
  return (0, kl.bytesToHex)(e.slice(0, 4));
}
function s2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = vd(`${n}${e}`), s = (0, as.c32encode)(`${e}${r}`);
  return `${as.c32[t]}${s}`;
}
Vn.c32checkEncode = s2;
function i2(t) {
  t = (0, as.c32normalize)(t);
  const e = (0, as.c32decode)(t.slice(1)), n = t[0], r = as.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), vd(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Vn.c32checkDecode = i2;
var Ld = {}, Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.decode = Nr.encode = void 0;
const _i = io, Pl = Ms, Bd = Ph, Cd = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function o2(t, e = "00") {
  const n = typeof t == "string" ? (0, Pl.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Pl.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, _i.sha256)((0, _i.sha256)(new Uint8Array([...r, ...n])));
  return Bd(Cd).encode([...r, ...n, ...s.slice(0, 4)]);
}
Nr.encode = o2;
function a2(t) {
  const e = Bd(Cd).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, _i.sha256)((0, _i.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Nr.decode = a2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Vn, n = Nr, r = Ms;
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
  function o(f, u) {
    if (!u.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(f, u)}`;
  }
  t.c32address = o;
  function a(f) {
    if (f.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (f[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(f.slice(1));
  }
  t.c32addressDecode = a;
  function c(f, u = -1) {
    const g = n.decode(f), h = (0, r.bytesToHex)(g.data), w = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let x;
    return u < 0 ? (x = w, s[w] !== void 0 && (x = s[w])) : x = u, o(x, h);
  }
  t.b58ToC32 = c;
  function l(f, u = -1) {
    const g = a(f), h = g[0], w = g[1];
    let x;
    u < 0 ? (x = h, i[h] !== void 0 && (x = i[h])) : x = u;
    let E = x.toString(16);
    return E.length === 1 && (E = `0${E}`), n.encode(w, E);
  }
  t.c32ToB58 = l;
})(Ld);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = _c;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Vn;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Ld;
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
})(cr);
function c2(t, e) {
  switch (e = xd(e ?? wd), t) {
    case ke.P2PKH:
      switch (e.transactionVersion) {
        case Pe.Mainnet:
          return Ae.MainnetSingleSig;
        case Pe.Testnet:
          return Ae.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case ke.P2SH:
    case ke.P2SHNonSequential:
    case ke.P2WPKH:
    case ke.P2WSH:
    case ke.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Pe.Mainnet:
          return Ae.MainnetMultiSig;
        case Pe.Testnet:
          return Ae.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const u2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Md = Uint8Array.from({ length: 16 }, (t, e) => e), l2 = Md.map((t) => (9 * t + 5) % 16);
let Tc = [Md], Nc = [l2];
for (let t = 0; t < 4; t++)
  for (let e of [Tc, Nc])
    e.push(e[t].map((n) => u2[n]));
const Ud = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), f2 = Tc.map((t, e) => t.map((n) => Ud[e][n])), h2 = Nc.map((t, e) => t.map((n) => Ud[e][n])), d2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), p2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zs = (t, e) => t << e | t >>> 32 - e;
function Dl(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qs = new Uint32Array(16);
let g2 = class extends Hc {
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
      Qs[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, x = d2[h], E = p2[h], U = Tc[h], _ = Nc[h], b = f2[h], I = h2[h];
      for (let p = 0; p < 16; p++) {
        const $ = Zs(r + Dl(h, i, a, l) + Qs[U[p]] + x, b[p]) + u | 0;
        r = u, u = l, l = Zs(a, 10) | 0, a = i, i = $;
      }
      for (let p = 0; p < 16; p++) {
        const $ = Zs(s + Dl(w, o, c, f) + Qs[_[p]] + E, I[p]) + g | 0;
        s = g, g = f, f = Zs(c, 10) | 0, c = o, o = $;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Qs.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const y2 = ar(() => new g2()), Js = BigInt(2 ** 32 - 1), Sa = BigInt(32);
function Hd(t, e = !1) {
  return e ? { h: Number(t & Js), l: Number(t >> Sa & Js) } : { h: Number(t >> Sa & Js) | 0, l: Number(t & Js) | 0 };
}
function b2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Hd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const w2 = (t, e) => BigInt(t >>> 0) << Sa | BigInt(e >>> 0), x2 = (t, e, n) => t >>> n, m2 = (t, e, n) => t << 32 - n | e >>> n, S2 = (t, e, n) => t >>> n | e << 32 - n, E2 = (t, e, n) => t << 32 - n | e >>> n, A2 = (t, e, n) => t << 64 - n | e >>> n - 32, $2 = (t, e, n) => t >>> n - 32 | e << 64 - n, I2 = (t, e) => e, v2 = (t, e) => t, L2 = (t, e, n) => t << n | e >>> 32 - n, B2 = (t, e, n) => e << n | t >>> 32 - n, C2 = (t, e, n) => e << n - 32 | t >>> 64 - n, M2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function U2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const H2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, T2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), N2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, k2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), P2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Y = {
  fromBig: Hd,
  split: b2,
  toBig: w2,
  shrSH: x2,
  shrSL: m2,
  rotrSH: S2,
  rotrSL: E2,
  rotrBH: A2,
  rotrBL: $2,
  rotr32H: I2,
  rotr32L: v2,
  rotlSH: L2,
  rotlSL: B2,
  rotlBH: C2,
  rotlBL: M2,
  add: U2,
  add3L: H2,
  add3H: _2,
  add4L: T2,
  add4H: N2,
  add5H: P2,
  add5L: k2
}, [D2, O2] = Y.split([
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
].map((t) => BigInt(t))), Qe = new Uint32Array(80), Je = new Uint32Array(80);
let co = class extends Hc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: w, Hh: x, Hl: E } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, w, x, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, w, x, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = x | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Qe[b] = e.getUint32(n), Je[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const I = Qe[b - 15] | 0, p = Je[b - 15] | 0, $ = Y.rotrSH(I, p, 1) ^ Y.rotrSH(I, p, 8) ^ Y.shrSH(I, p, 7), C = Y.rotrSL(I, p, 1) ^ Y.rotrSL(I, p, 8) ^ Y.shrSL(I, p, 7), L = Qe[b - 2] | 0, N = Je[b - 2] | 0, y = Y.rotrSH(L, N, 19) ^ Y.rotrBH(L, N, 61) ^ Y.shrSH(L, N, 6), A = Y.rotrSL(L, N, 19) ^ Y.rotrBL(L, N, 61) ^ Y.shrSL(L, N, 6), k = Y.add4L(C, A, Je[b - 7], Je[b - 16]), j = Y.add4H(k, $, y, Qe[b - 7], Qe[b - 16]);
      Qe[b] = j | 0, Je[b] = k | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: w, Gh: x, Gl: E, Hh: U, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const I = Y.rotrSH(u, g, 14) ^ Y.rotrSH(u, g, 18) ^ Y.rotrBH(u, g, 41), p = Y.rotrSL(u, g, 14) ^ Y.rotrSL(u, g, 18) ^ Y.rotrBL(u, g, 41), $ = u & h ^ ~u & x, C = g & w ^ ~g & E, L = Y.add5L(_, p, C, O2[b], Je[b]), N = Y.add5H(L, U, I, $, D2[b], Qe[b]), y = L | 0, A = Y.rotrSH(r, s, 28) ^ Y.rotrBH(r, s, 34) ^ Y.rotrBH(r, s, 39), k = Y.rotrSL(r, s, 28) ^ Y.rotrBL(r, s, 34) ^ Y.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = x | 0, _ = E | 0, x = h | 0, E = w | 0, h = u | 0, w = g | 0, { h: u, l: g } = Y.add(l | 0, f | 0, N | 0, y | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const O = Y.add3L(y, k, K);
      r = Y.add3H(O, N, A, j), s = O | 0;
    }
    ({ h: r, l: s } = Y.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Y.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Y.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = Y.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = Y.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: w } = Y.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: x, l: E } = Y.add(this.Gh | 0, this.Gl | 0, x | 0, E | 0), { h: U, l: _ } = Y.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, w, x, E, U, _);
  }
  roundClean() {
    Qe.fill(0), Je.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, j2 = class extends co {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, F2 = class extends co {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, z2 = class extends co {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ar(() => new co());
ar(() => new j2());
ar(() => new F2());
ar(() => new z2());
var Ti = { exports: {} };
Ti.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", l = "[object Error]", f = "[object Function]", u = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", w = "[object Object]", x = "[object Promise]", E = "[object RegExp]", U = "[object Set]", _ = "[object String]", b = "[object Symbol]", I = "[object WeakMap]", p = "[object ArrayBuffer]", $ = "[object DataView]", C = "[object Float32Array]", L = "[object Float64Array]", N = "[object Int8Array]", y = "[object Int16Array]", A = "[object Int32Array]", k = "[object Uint8Array]", j = "[object Uint8ClampedArray]", K = "[object Uint16Array]", O = "[object Uint32Array]", $t = /[\\^$.*+?()[\]{}|]/g, nt = /\w*$/, gt = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, B = {};
  B[i] = B[o] = B[p] = B[$] = B[a] = B[c] = B[C] = B[L] = B[N] = B[y] = B[A] = B[g] = B[h] = B[w] = B[E] = B[U] = B[_] = B[b] = B[k] = B[j] = B[K] = B[O] = !0, B[l] = B[f] = B[I] = !1;
  var ot = typeof jt == "object" && jt && jt.Object === Object && jt, ct = typeof self == "object" && self && self.Object === Object && self, st = ot || ct || Function("return this")(), It = e && !e.nodeType && e, ge = It && !0 && t && !t.nodeType && t, M = ge && ge.exports === It;
  function T(d, S) {
    return d.set(S[0], S[1]), d;
  }
  function V(d, S) {
    return d.add(S), d;
  }
  function R(d, S) {
    for (var v = -1, F = d ? d.length : 0; ++v < F && S(d[v], v, d) !== !1; )
      ;
    return d;
  }
  function Bt(d, S) {
    for (var v = -1, F = S.length, Ut = d.length; ++v < F; )
      d[Ut + v] = S[v];
    return d;
  }
  function Tt(d, S, v, F) {
    for (var Ut = -1, zt = d ? d.length : 0; ++Ut < zt; )
      v = S(v, d[Ut], Ut, d);
    return v;
  }
  function ee(d, S) {
    for (var v = -1, F = Array(d); ++v < d; )
      F[v] = S(v);
    return F;
  }
  function dr(d, S) {
    return d == null ? void 0 : d[S];
  }
  function Ts(d) {
    var S = !1;
    if (d != null && typeof d.toString != "function")
      try {
        S = !!(d + "");
      } catch {
      }
    return S;
  }
  function vn(d) {
    var S = -1, v = Array(d.size);
    return d.forEach(function(F, Ut) {
      v[++S] = [Ut, F];
    }), v;
  }
  function vo(d, S) {
    return function(v) {
      return d(S(v));
    };
  }
  function vu(d) {
    var S = -1, v = Array(d.size);
    return d.forEach(function(F) {
      v[++S] = F;
    }), v;
  }
  var Up = Array.prototype, Hp = Function.prototype, Ns = Object.prototype, Lo = st["__core-js_shared__"], Lu = function() {
    var d = /[^.]+$/.exec(Lo && Lo.keys && Lo.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Bu = Hp.toString, ze = Ns.hasOwnProperty, ks = Ns.toString, _p = RegExp(
    "^" + Bu.call(ze).replace($t, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Cu = M ? st.Buffer : void 0, Mu = st.Symbol, Uu = st.Uint8Array, Tp = vo(Object.getPrototypeOf, Object), Np = Object.create, kp = Ns.propertyIsEnumerable, Pp = Up.splice, Hu = Object.getOwnPropertySymbols, Dp = Cu ? Cu.isBuffer : void 0, Op = vo(Object.keys, Object), Bo = yr(st, "DataView"), Zr = yr(st, "Map"), Co = yr(st, "Promise"), Mo = yr(st, "Set"), Uo = yr(st, "WeakMap"), Qr = yr(Object, "create"), jp = Cn(Bo), Fp = Cn(Zr), zp = Cn(Co), Rp = Cn(Mo), Gp = Cn(Uo), _u = Mu ? Mu.prototype : void 0, Tu = _u ? _u.valueOf : void 0;
  function Ln(d) {
    var S = -1, v = d ? d.length : 0;
    for (this.clear(); ++S < v; ) {
      var F = d[S];
      this.set(F[0], F[1]);
    }
  }
  function Kp() {
    this.__data__ = Qr ? Qr(null) : {};
  }
  function Vp(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function qp(d) {
    var S = this.__data__;
    if (Qr) {
      var v = S[d];
      return v === r ? void 0 : v;
    }
    return ze.call(S, d) ? S[d] : void 0;
  }
  function Wp(d) {
    var S = this.__data__;
    return Qr ? S[d] !== void 0 : ze.call(S, d);
  }
  function Yp(d, S) {
    var v = this.__data__;
    return v[d] = Qr && S === void 0 ? r : S, this;
  }
  Ln.prototype.clear = Kp, Ln.prototype.delete = Vp, Ln.prototype.get = qp, Ln.prototype.has = Wp, Ln.prototype.set = Yp;
  function Ue(d) {
    var S = -1, v = d ? d.length : 0;
    for (this.clear(); ++S < v; ) {
      var F = d[S];
      this.set(F[0], F[1]);
    }
  }
  function Xp() {
    this.__data__ = [];
  }
  function Zp(d) {
    var S = this.__data__, v = Ps(S, d);
    if (v < 0)
      return !1;
    var F = S.length - 1;
    return v == F ? S.pop() : Pp.call(S, v, 1), !0;
  }
  function Qp(d) {
    var S = this.__data__, v = Ps(S, d);
    return v < 0 ? void 0 : S[v][1];
  }
  function Jp(d) {
    return Ps(this.__data__, d) > -1;
  }
  function tg(d, S) {
    var v = this.__data__, F = Ps(v, d);
    return F < 0 ? v.push([d, S]) : v[F][1] = S, this;
  }
  Ue.prototype.clear = Xp, Ue.prototype.delete = Zp, Ue.prototype.get = Qp, Ue.prototype.has = Jp, Ue.prototype.set = tg;
  function pr(d) {
    var S = -1, v = d ? d.length : 0;
    for (this.clear(); ++S < v; ) {
      var F = d[S];
      this.set(F[0], F[1]);
    }
  }
  function eg() {
    this.__data__ = {
      hash: new Ln(),
      map: new (Zr || Ue)(),
      string: new Ln()
    };
  }
  function ng(d) {
    return Ds(this, d).delete(d);
  }
  function rg(d) {
    return Ds(this, d).get(d);
  }
  function sg(d) {
    return Ds(this, d).has(d);
  }
  function ig(d, S) {
    return Ds(this, d).set(d, S), this;
  }
  pr.prototype.clear = eg, pr.prototype.delete = ng, pr.prototype.get = rg, pr.prototype.has = sg, pr.prototype.set = ig;
  function gr(d) {
    this.__data__ = new Ue(d);
  }
  function og() {
    this.__data__ = new Ue();
  }
  function ag(d) {
    return this.__data__.delete(d);
  }
  function cg(d) {
    return this.__data__.get(d);
  }
  function ug(d) {
    return this.__data__.has(d);
  }
  function lg(d, S) {
    var v = this.__data__;
    if (v instanceof Ue) {
      var F = v.__data__;
      if (!Zr || F.length < n - 1)
        return F.push([d, S]), this;
      v = this.__data__ = new pr(F);
    }
    return v.set(d, S), this;
  }
  gr.prototype.clear = og, gr.prototype.delete = ag, gr.prototype.get = cg, gr.prototype.has = ug, gr.prototype.set = lg;
  function fg(d, S) {
    var v = To(d) || Ng(d) ? ee(d.length, String) : [], F = v.length, Ut = !!F;
    for (var zt in d)
      ze.call(d, zt) && !(Ut && (zt == "length" || Ug(zt, F))) && v.push(zt);
    return v;
  }
  function Nu(d, S, v) {
    var F = d[S];
    (!(ze.call(d, S) && Ou(F, v)) || v === void 0 && !(S in d)) && (d[S] = v);
  }
  function Ps(d, S) {
    for (var v = d.length; v--; )
      if (Ou(d[v][0], S))
        return v;
    return -1;
  }
  function hg(d, S) {
    return d && ku(S, No(S), d);
  }
  function Ho(d, S, v, F, Ut, zt, He) {
    var Rt;
    if (F && (Rt = zt ? F(d, Ut, zt, He) : F(d)), Rt !== void 0)
      return Rt;
    if (!Os(d))
      return d;
    var zu = To(d);
    if (zu) {
      if (Rt = Bg(d), !S)
        return Ig(d, Rt);
    } else {
      var br = Bn(d), Ru = br == f || br == u;
      if (Pg(d))
        return wg(d, S);
      if (br == w || br == i || Ru && !zt) {
        if (Ts(d))
          return zt ? d : {};
        if (Rt = Cg(Ru ? {} : d), !S)
          return vg(d, hg(Rt, d));
      } else {
        if (!B[br])
          return zt ? d : {};
        Rt = Mg(d, br, Ho, S);
      }
    }
    He || (He = new gr());
    var Gu = He.get(d);
    if (Gu)
      return Gu;
    if (He.set(d, Rt), !zu)
      var Ku = v ? Lg(d) : No(d);
    return R(Ku || d, function(ko, js) {
      Ku && (js = ko, ko = d[js]), Nu(Rt, js, Ho(ko, S, v, F, js, d, He));
    }), Rt;
  }
  function dg(d) {
    return Os(d) ? Np(d) : {};
  }
  function pg(d, S, v) {
    var F = S(d);
    return To(d) ? F : Bt(F, v(d));
  }
  function gg(d) {
    return ks.call(d);
  }
  function yg(d) {
    if (!Os(d) || _g(d))
      return !1;
    var S = Fu(d) || Ts(d) ? _p : gt;
    return S.test(Cn(d));
  }
  function bg(d) {
    if (!Du(d))
      return Op(d);
    var S = [];
    for (var v in Object(d))
      ze.call(d, v) && v != "constructor" && S.push(v);
    return S;
  }
  function wg(d, S) {
    if (S)
      return d.slice();
    var v = new d.constructor(d.length);
    return d.copy(v), v;
  }
  function _o(d) {
    var S = new d.constructor(d.byteLength);
    return new Uu(S).set(new Uu(d)), S;
  }
  function xg(d, S) {
    var v = S ? _o(d.buffer) : d.buffer;
    return new d.constructor(v, d.byteOffset, d.byteLength);
  }
  function mg(d, S, v) {
    var F = S ? v(vn(d), !0) : vn(d);
    return Tt(F, T, new d.constructor());
  }
  function Sg(d) {
    var S = new d.constructor(d.source, nt.exec(d));
    return S.lastIndex = d.lastIndex, S;
  }
  function Eg(d, S, v) {
    var F = S ? v(vu(d), !0) : vu(d);
    return Tt(F, V, new d.constructor());
  }
  function Ag(d) {
    return Tu ? Object(Tu.call(d)) : {};
  }
  function $g(d, S) {
    var v = S ? _o(d.buffer) : d.buffer;
    return new d.constructor(v, d.byteOffset, d.length);
  }
  function Ig(d, S) {
    var v = -1, F = d.length;
    for (S || (S = Array(F)); ++v < F; )
      S[v] = d[v];
    return S;
  }
  function ku(d, S, v, F) {
    v || (v = {});
    for (var Ut = -1, zt = S.length; ++Ut < zt; ) {
      var He = S[Ut], Rt = void 0;
      Nu(v, He, Rt === void 0 ? d[He] : Rt);
    }
    return v;
  }
  function vg(d, S) {
    return ku(d, Pu(d), S);
  }
  function Lg(d) {
    return pg(d, No, Pu);
  }
  function Ds(d, S) {
    var v = d.__data__;
    return Hg(S) ? v[typeof S == "string" ? "string" : "hash"] : v.map;
  }
  function yr(d, S) {
    var v = dr(d, S);
    return yg(v) ? v : void 0;
  }
  var Pu = Hu ? vo(Hu, Object) : jg, Bn = gg;
  (Bo && Bn(new Bo(new ArrayBuffer(1))) != $ || Zr && Bn(new Zr()) != g || Co && Bn(Co.resolve()) != x || Mo && Bn(new Mo()) != U || Uo && Bn(new Uo()) != I) && (Bn = function(d) {
    var S = ks.call(d), v = S == w ? d.constructor : void 0, F = v ? Cn(v) : void 0;
    if (F)
      switch (F) {
        case jp:
          return $;
        case Fp:
          return g;
        case zp:
          return x;
        case Rp:
          return U;
        case Gp:
          return I;
      }
    return S;
  });
  function Bg(d) {
    var S = d.length, v = d.constructor(S);
    return S && typeof d[0] == "string" && ze.call(d, "index") && (v.index = d.index, v.input = d.input), v;
  }
  function Cg(d) {
    return typeof d.constructor == "function" && !Du(d) ? dg(Tp(d)) : {};
  }
  function Mg(d, S, v, F) {
    var Ut = d.constructor;
    switch (S) {
      case p:
        return _o(d);
      case a:
      case c:
        return new Ut(+d);
      case $:
        return xg(d, F);
      case C:
      case L:
      case N:
      case y:
      case A:
      case k:
      case j:
      case K:
      case O:
        return $g(d, F);
      case g:
        return mg(d, F, v);
      case h:
      case _:
        return new Ut(d);
      case E:
        return Sg(d);
      case U:
        return Eg(d, F, v);
      case b:
        return Ag(d);
    }
  }
  function Ug(d, S) {
    return S = S ?? s, !!S && (typeof d == "number" || m.test(d)) && d > -1 && d % 1 == 0 && d < S;
  }
  function Hg(d) {
    var S = typeof d;
    return S == "string" || S == "number" || S == "symbol" || S == "boolean" ? d !== "__proto__" : d === null;
  }
  function _g(d) {
    return !!Lu && Lu in d;
  }
  function Du(d) {
    var S = d && d.constructor, v = typeof S == "function" && S.prototype || Ns;
    return d === v;
  }
  function Cn(d) {
    if (d != null) {
      try {
        return Bu.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function Tg(d) {
    return Ho(d, !0, !0);
  }
  function Ou(d, S) {
    return d === S || d !== d && S !== S;
  }
  function Ng(d) {
    return kg(d) && ze.call(d, "callee") && (!kp.call(d, "callee") || ks.call(d) == i);
  }
  var To = Array.isArray;
  function ju(d) {
    return d != null && Dg(d.length) && !Fu(d);
  }
  function kg(d) {
    return Og(d) && ju(d);
  }
  var Pg = Dp || Fg;
  function Fu(d) {
    var S = Os(d) ? ks.call(d) : "";
    return S == f || S == u;
  }
  function Dg(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function Os(d) {
    var S = typeof d;
    return !!d && (S == "object" || S == "function");
  }
  function Og(d) {
    return !!d && typeof d == "object";
  }
  function No(d) {
    return ju(d) ? fg(d) : bg(d);
  }
  function jg() {
    return [];
  }
  function Fg() {
    return !1;
  }
  t.exports = Tg;
})(Ti, Ti.exports);
var R2 = Ti.exports;
const _d = /* @__PURE__ */ oh(R2);
var Ea;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ea || (Ea = {}));
function G2(t, e) {
  return { type: Ea.Address, version: t, hash160: e };
}
function K2(t) {
  return cr.c32address(t.version, t.hash160);
}
const V2 = (t) => y2(Id(t)), q2 = (t) => G(V2(t));
At.hmacSha256Sync = (t, ...e) => {
  const n = Ad.create(Id, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function W2(t, e = "mainnet") {
  e = xd(e), t = typeof t == "string" ? at(t) : t;
  const n = c2(ke.P2PKH, e), r = G2(n, q2(t));
  return K2(r);
}
function Y2(t, e) {
  const n = _t.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = W2(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new _t.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function X2(t, e = null) {
  let n;
  e ? n = Y2(t, e) : n = _t.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Ol = "_blockstackDidCheckEchoReply", Z2 = "echoReply", Q2 = "authContinuation";
function J2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function tx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Ol];
  if (typeof e == "boolean")
    return e;
  const n = J2(t.location.search), r = n[Z2];
  if (r) {
    t[Ol] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Q2];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Aa {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new yh();
    else
      throw new b1("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new ml(e.sessionOptions) : this.store = new ml() : e ? this.store = new xl(e.sessionOptions) : this.store = new xl();
  }
  makeAuthRequestToken(e, n, r, s, i, o = x1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ua("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Ow(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Dw();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = gc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (tx())
        return Sr.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Sr.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = z1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Fs("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = _t.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Gw(e))
      throw new Fs("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Do(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await bl(s, i.private_key);
          } catch {
            if (Sr.warn("Failed decryption of appPrivateKey, will try to use as given"), !At.isValidPrivateKey(i.private_key))
              throw new Fs("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await bl(s, c);
          } catch {
            Sr.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Fs("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let l = U1, f;
    Do(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (l = i.hubUrl), Do(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const u = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: yd(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: l,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, g = i.profile_url;
    if (!u.profile && g) {
      const h = await n(g);
      if (!h.ok)
        u.profile = Object.assign({}, p1);
      else {
        const w = await h.text(), x = JSON.parse(w);
        u.profile = X2(x[0].token);
      }
    } else
      u.profile = i.profile;
    return r.userData = u, this.store.setSessionData(r), u;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new ua("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Ub(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Hb(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Aa.prototype.makeAuthRequest = Aa.prototype.makeAuthRequestToken;
const ex = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], nx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = ex(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!uo(r.id));
  return e.concat(n);
}, uo = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Td = "STX_PROVIDER", qn = () => typeof window > "u" ? null : window.localStorage.getItem(Td), rx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Td, t);
}, sx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ix(t, e) {
  const n = {};
  return Object.assign(n, sx, e), await fetch(t, n);
}
function ox(t) {
  let e = ix, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ax(...t) {
  const { fetchLib: e, middlewares: n } = ox(t);
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
var kr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(kr || (kr = {}));
var Wn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Wn || (Wn = {}));
var jl;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(jl || (jl = {}));
const cx = "https://api.mainnet.hiro.so", ux = "https://api.testnet.hiro.so", lx = "http://localhost:3999", fx = ["mainnet", "testnet", "devnet", "mocknet"];
class Yn {
  constructor(e) {
    this.version = Wn.Mainnet, this.chainId = kr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Wn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ax();
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
Yn.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new $a();
    case "testnet":
      return new Ia();
    case "devnet":
      return new hx();
    case "mocknet":
      return new Nd();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${fx.join(", ")}`);
  }
};
Yn.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Yn.fromName(t);
class $a extends Yn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Wn.Mainnet, this.chainId = kr.Mainnet;
  }
}
class Ia extends Yn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ux,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Wn.Testnet, this.chainId = kr.Testnet;
  }
}
class Nd extends Yn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Wn.Testnet, this.chainId = kr.Testnet;
  }
}
const hx = Nd;
var Xn;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Xn || (Xn = {}));
var Ni;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ni || (Ni = {}));
Xn.Mainnet;
var Zn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Zn || (Zn = {}));
var Qn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Qn || (Qn = {}));
Zn.Mainnet;
const dx = {
  chainId: Xn.Mainnet,
  transactionVersion: Zn.Mainnet,
  peerNetworkId: Ni.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Qn.MainnetSingleSig,
    multiSig: Qn.MainnetMultiSig
  },
  client: { baseUrl: dh }
}, va = {
  chainId: Xn.Testnet,
  transactionVersion: Zn.Testnet,
  peerNetworkId: Ni.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Qn.TestnetSingleSig,
    multiSig: Qn.TestnetMultiSig
  },
  client: { baseUrl: ph }
}, wi = {
  ...va,
  addressVersion: { ...va.addressVersion },
  magicBytes: "id",
  client: { baseUrl: gh }
}, px = {
  ...wi,
  addressVersion: { ...wi.addressVersion },
  client: { ...wi.client }
};
function gx(t) {
  switch (t) {
    case "mainnet":
      return dx;
    case "testnet":
      return va;
    case "devnet":
      return wi;
    case "mocknet":
      return px;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function yx(t) {
  return typeof t == "string" ? gx(t) : t;
}
function bx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Fl = /* @__PURE__ */ new Map();
function kd(t, e) {
  const n = Fl.get(t);
  if (n !== void 0)
    return n(e);
  const r = bx(t);
  return Fl.set(t, r), kd(t, e);
}
let pt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? at(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return D1(this.readBytes(4), 0);
  }
  readUInt8() {
    return k1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return T1(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = G(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = G(n);
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
    if (kd(e, r))
      return r;
    throw n(r);
  }
};
const wx = 128, xx = 128, Pd = 16, Dn = 32, La = 80, lo = 65, mx = 32, Sx = 64, ki = 34, Ex = 1 + 16 * 1024 * 1024, Ax = 165, $x = 16, Ix = 16, vx = 20, Lx = Ix + 2 + vx, Bx = Lx + 4, Cx = Ex + (Ax + $x * Bx);
var lt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(lt || (lt = {}));
var Ba;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ba || (Ba = {}));
var Wt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Wt || (Wt = {}));
const Ko = ["onChainOnly", "offChainOnly", "any"];
Ko[0] + "", Wt.OnChainOnly, Ko[1] + "", Wt.OffChainOnly, Ko[2] + "", Wt.Any, Wt.OnChainOnly + "", Wt.OnChainOnly, Wt.OffChainOnly + "", Wt.OffChainOnly, Wt.Any + "", Wt.Any;
var Pi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Pi || (Pi = {}));
var yt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(yt || (yt = {}));
var St;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(St || (St = {}));
var ht;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ht || (ht = {}));
var xt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(xt || (xt = {}));
var cs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(cs || (cs = {}));
var Ca;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ca || (Ca = {}));
var Ma;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ma || (Ma = {}));
var Ot;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ot || (Ot = {}));
var zl;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(zl || (zl = {}));
var Ua;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ua || (Ua = {}));
var ue;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ue || (ue = {}));
var Rl;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Rl || (Rl = {}));
let fo = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Er = class extends fo {
  constructor(e) {
    super(e);
  }
}, Pt = class extends fo {
  constructor(e) {
    super(e);
  }
}, Di = class extends fo {
  constructor(e) {
    super(e);
  }
}, Tn = class extends fo {
  constructor(e) {
    super(e);
  }
};
function Ha(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Mx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ux(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ha(t.outputLen), Ha(t.blockLen);
}
function Hx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _x(t, e) {
  Dd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Nn = {
  number: Ha,
  bool: Mx,
  bytes: Dd,
  hash: Ux,
  exists: Hx,
  output: _x
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Vo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), we = (t, e) => t << 32 - e | t >>> e, Tx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Tx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Nx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function kc(t) {
  if (typeof t == "string" && (t = Nx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Od = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ur(t) {
  const e = (r) => t().update(kc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let jd = class extends Od {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Nn.hash(e);
    const r = kc(n);
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
    return Nn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Nn.exists(this), Nn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Fd = (t, e, n) => new jd(t, e).update(n).digest();
Fd.create = (t, e) => new jd(t, e);
function kx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Pc = class extends Od {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Vo(this.buffer);
  }
  update(e) {
    Nn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = kc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Vo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Nn.exists(this), Nn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    kx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Vo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const Px = (t, e, n) => t & e ^ ~t & n, Dx = (t, e, n) => t & e ^ t & n ^ e & n, Ox = new Uint32Array([
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
]), tn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), en = new Uint32Array(64);
let zd = class extends Pc {
  constructor() {
    super(64, 32, 8, !1), this.A = tn[0] | 0, this.B = tn[1] | 0, this.C = tn[2] | 0, this.D = tn[3] | 0, this.E = tn[4] | 0, this.F = tn[5] | 0, this.G = tn[6] | 0, this.H = tn[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      en[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = en[u - 15], h = en[u - 2], w = we(g, 7) ^ we(g, 18) ^ g >>> 3, x = we(h, 17) ^ we(h, 19) ^ h >>> 10;
      en[u] = x + en[u - 7] + w + en[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = we(a, 6) ^ we(a, 11) ^ we(a, 25), h = f + g + Px(a, c, l) + Ox[u] + en[u] | 0, x = (we(r, 2) ^ we(r, 13) ^ we(r, 22)) + Dx(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    en.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, jx = class extends zd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Dc = ur(() => new zd());
ur(() => new jx());
const Fx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Rd = Uint8Array.from({ length: 16 }, (t, e) => e), zx = Rd.map((t) => (9 * t + 5) % 16);
let Oc = [Rd], jc = [zx];
for (let t = 0; t < 4; t++)
  for (let e of [Oc, jc])
    e.push(e[t].map((n) => Fx[n]));
const Gd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Rx = Oc.map((t, e) => t.map((n) => Gd[e][n])), Gx = jc.map((t, e) => t.map((n) => Gd[e][n])), Kx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Vx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ti = (t, e) => t << e | t >>> 32 - e;
function Gl(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ei = new Uint32Array(16);
let qx = class extends Pc {
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
      ei[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, x = Kx[h], E = Vx[h], U = Oc[h], _ = jc[h], b = Rx[h], I = Gx[h];
      for (let p = 0; p < 16; p++) {
        const $ = ti(r + Gl(h, i, a, l) + ei[U[p]] + x, b[p]) + u | 0;
        r = u, u = l, l = ti(a, 10) | 0, a = i, i = $;
      }
      for (let p = 0; p < 16; p++) {
        const $ = ti(s + Gl(w, o, c, f) + ei[_[p]] + E, I[p]) + g | 0;
        s = g, g = f, f = ti(c, 10) | 0, c = o, o = $;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ei.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Wx = ur(() => new qx()), ni = BigInt(2 ** 32 - 1), _a = BigInt(32);
function Kd(t, e = !1) {
  return e ? { h: Number(t & ni), l: Number(t >> _a & ni) } : { h: Number(t >> _a & ni) | 0, l: Number(t & ni) | 0 };
}
function Yx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Kd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Xx = (t, e) => BigInt(t >>> 0) << _a | BigInt(e >>> 0), Zx = (t, e, n) => t >>> n, Qx = (t, e, n) => t << 32 - n | e >>> n, Jx = (t, e, n) => t >>> n | e << 32 - n, tm = (t, e, n) => t << 32 - n | e >>> n, em = (t, e, n) => t << 64 - n | e >>> n - 32, nm = (t, e, n) => t >>> n - 32 | e << 64 - n, rm = (t, e) => e, sm = (t, e) => t, im = (t, e, n) => t << n | e >>> 32 - n, om = (t, e, n) => e << n | t >>> 32 - n, am = (t, e, n) => e << n - 32 | t >>> 64 - n, cm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function um(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const lm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), fm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, hm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), dm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, pm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), gm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, X = {
  fromBig: Kd,
  split: Yx,
  toBig: Xx,
  shrSH: Zx,
  shrSL: Qx,
  rotrSH: Jx,
  rotrSL: tm,
  rotrBH: em,
  rotrBL: nm,
  rotr32H: rm,
  rotr32L: sm,
  rotlSH: im,
  rotlSL: om,
  rotlBH: am,
  rotlBL: cm,
  add: um,
  add3L: lm,
  add3H: fm,
  add4L: hm,
  add4H: dm,
  add5H: gm,
  add5L: pm
}, [ym, bm] = X.split([
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
].map((t) => BigInt(t))), nn = new Uint32Array(80), rn = new Uint32Array(80);
let ho = class extends Pc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: w, Hh: x, Hl: E } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, w, x, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, w, x, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = x | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      nn[b] = e.getUint32(n), rn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const I = nn[b - 15] | 0, p = rn[b - 15] | 0, $ = X.rotrSH(I, p, 1) ^ X.rotrSH(I, p, 8) ^ X.shrSH(I, p, 7), C = X.rotrSL(I, p, 1) ^ X.rotrSL(I, p, 8) ^ X.shrSL(I, p, 7), L = nn[b - 2] | 0, N = rn[b - 2] | 0, y = X.rotrSH(L, N, 19) ^ X.rotrBH(L, N, 61) ^ X.shrSH(L, N, 6), A = X.rotrSL(L, N, 19) ^ X.rotrBL(L, N, 61) ^ X.shrSL(L, N, 6), k = X.add4L(C, A, rn[b - 7], rn[b - 16]), j = X.add4H(k, $, y, nn[b - 7], nn[b - 16]);
      nn[b] = j | 0, rn[b] = k | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: w, Gh: x, Gl: E, Hh: U, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const I = X.rotrSH(u, g, 14) ^ X.rotrSH(u, g, 18) ^ X.rotrBH(u, g, 41), p = X.rotrSL(u, g, 14) ^ X.rotrSL(u, g, 18) ^ X.rotrBL(u, g, 41), $ = u & h ^ ~u & x, C = g & w ^ ~g & E, L = X.add5L(_, p, C, bm[b], rn[b]), N = X.add5H(L, U, I, $, ym[b], nn[b]), y = L | 0, A = X.rotrSH(r, s, 28) ^ X.rotrBH(r, s, 34) ^ X.rotrBH(r, s, 39), k = X.rotrSL(r, s, 28) ^ X.rotrBL(r, s, 34) ^ X.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = x | 0, _ = E | 0, x = h | 0, E = w | 0, h = u | 0, w = g | 0, { h: u, l: g } = X.add(l | 0, f | 0, N | 0, y | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const O = X.add3L(y, k, K);
      r = X.add3H(O, N, A, j), s = O | 0;
    }
    ({ h: r, l: s } = X.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = X.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = X.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = X.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = X.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: w } = X.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: x, l: E } = X.add(this.Gh | 0, this.Gl | 0, x | 0, E | 0), { h: U, l: _ } = X.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, w, x, E, U, _);
  }
  roundClean() {
    nn.fill(0), rn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, wm = class extends ho {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, xm = class extends ho {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, mm = class extends ho {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ur(() => new ho());
ur(() => new wm());
const Sm = ur(() => new xm());
ur(() => new mm());
var rt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(rt || (rt = {}));
var Ct;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ct || (Ct = {}));
function Fc(t) {
  return Ct[t];
}
const Em = () => ({ type: rt.BoolTrue }), Am = () => ({ type: rt.BoolFalse }), $m = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: rt.Buffer, value: G(t) };
}, Kl = BigInt("0xffffffffffffffffffffffffffffffff"), Im = BigInt(0), Vl = BigInt("0x7fffffffffffffffffffffffffffffff"), ql = BigInt("-170141183460469231731687303715884105728"), vm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = fa(at(t))), Vt(t, Uint8Array) && (t = fa(t));
  const e = kt(t);
  if (e > Vl)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Vl}`);
  if (e < ql)
    throw new RangeError(`Cannot construct clarity integer form value less than ${ql}`);
  return { type: rt.Int, value: e };
}, Lm = (t) => {
  const e = kt(t);
  if (e < Im)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Kl)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Kl}`);
  return { type: rt.UInt, value: e };
};
function Bm(t) {
  return { type: rt.List, value: t };
}
function Vd() {
  return { type: rt.OptionalNone };
}
function qd(t) {
  return { type: rt.OptionalSome, value: t };
}
var D;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(D || (D = {}));
function Cm() {
  return {
    type: D.Address,
    version: Qn.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Wl(t) {
  if (t && n0(t, ki))
    throw new Error(`Memo exceeds maximum length of ${ki} bytes`);
  return { type: D.MemoString, content: t };
}
function zc(t, e) {
  return {
    type: D.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ta(t) {
  if (at(t).byteLength != lo)
    throw Error("Invalid signature");
  return {
    type: D.MessageSignature,
    data: t
  };
}
function Mm(t, e, n) {
  return typeof t == "string" && (t = Vm(t)), typeof n == "string" && (n = Wl(n)), {
    type: D.Payload,
    payloadType: lt.TokenTransfer,
    recipient: t,
    amount: kt(e),
    memo: n ?? Wl("")
  };
}
function Um(t, e, n, r) {
  return typeof e == "string" && (e = de(e)), typeof n == "string" && (n = de(n)), {
    type: D.Payload,
    payloadType: lt.ContractCall,
    contractAddress: typeof t == "string" ? In(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Hm(t) {
  return de(t, 4, 1e5);
}
function Yl(t, e, n) {
  return typeof t == "string" && (t = de(t)), typeof e == "string" && (e = Hm(e)), typeof n == "number" ? {
    type: D.Payload,
    payloadType: lt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: D.Payload,
    payloadType: lt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function _m() {
  return { type: D.Payload, payloadType: lt.PoisonMicroblock };
}
function Xl(t, e) {
  if (t.byteLength != Dn)
    throw Error(`Coinbase buffer size must be ${Dn} bytes`);
  return e != null ? {
    type: D.Payload,
    payloadType: lt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: D.Payload,
    payloadType: lt.Coinbase,
    coinbaseBytes: t
  };
}
function Tm(t, e, n) {
  if (t.byteLength != Dn)
    throw Error(`Coinbase buffer size must be ${Dn} bytes`);
  if (n.byteLength != La)
    throw Error(`VRF proof buffer size must be ${La} bytes`);
  return {
    type: D.Payload,
    payloadType: lt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === rt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function Nm(t, e, n, r, s, i, o) {
  return {
    type: D.Payload,
    payloadType: lt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function de(t, e, n) {
  const r = e || 1, s = n || wx;
  if (n0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: D.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function km(t, e, n) {
  return {
    type: D.Asset,
    address: In(t),
    contractName: de(e),
    assetName: de(n)
  };
}
function In(t) {
  const e = cr.c32addressDecode(t);
  return {
    type: D.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Pm(t, e) {
  const n = In(t), r = de(e);
  return {
    type: D.Principal,
    prefix: Ot.Contract,
    address: n,
    contractName: r
  };
}
function Dm(t) {
  const e = In(t);
  return {
    type: D.Principal,
    prefix: Ot.Standard,
    address: e
  };
}
function Ar(t, e) {
  return {
    pubKeyEncoding: t,
    type: D.TransactionAuthField,
    contents: e
  };
}
function Te(t) {
  switch (t.type) {
    case D.Address:
      return Us(t);
    case D.Principal:
      return Wd(t);
    case D.LengthPrefixedString:
      return Dr(t);
    case D.MemoString:
      return jm(t);
    case D.Asset:
      return Xd(t);
    case D.PostCondition:
      return Qd(t);
    case D.PublicKey:
      return Pa(t);
    case D.LengthPrefixedList:
      return Rc(t);
    case D.Payload:
      return Jd(t);
    case D.TransactionAuthField:
      return Km(t);
    case D.MessageSignature:
      return Gc(t);
  }
}
function Us(t) {
  const e = [];
  return e.push(at(Is(t.version, 1))), e.push(at(t.hash160)), vt(e);
}
function Pr(t) {
  const e = Vt(t, pt) ? t : new pt(t), n = Zi(G(e.readBytes(1))), r = G(e.readBytes(20));
  return { type: D.Address, version: n, hash160: r };
}
function Wd(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Ot.Standard || t.prefix === Ot.Contract) && e.push(Us(t.address)), t.prefix === Ot.Contract && e.push(Dr(t.contractName)), vt(e);
}
function Om(t) {
  const e = Vt(t, pt) ? t : new pt(t), n = e.readUInt8Enum(Ot, (i) => {
    throw new Pt(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Ot.Origin)
    return { type: D.Principal, prefix: n };
  const r = Pr(e);
  if (n === Ot.Standard)
    return { type: D.Principal, prefix: n, address: r };
  const s = se(e);
  return {
    type: D.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Dr(t) {
  const e = [], n = sr(t.content), r = n.byteLength;
  return e.push(at(Is(r, t.lengthPrefixBytes))), e.push(n), vt(e);
}
function se(t, e, n) {
  e = e || 1;
  const r = Vt(t, pt) ? t : new pt(t), s = Zi(G(r.readBytes(e))), i = vs(r.readBytes(s));
  return de(i, e, n ?? 128);
}
function jm(t) {
  const e = [], n = sr(t.content), r = pS(G(n), ki * 2);
  return e.push(at(r)), vt(e);
}
function Yd(t) {
  const e = Vt(t, pt) ? t : new pt(t);
  let n = vs(e.readBytes(ki));
  return n = n.replace(/\u0000*$/, ""), { type: D.MemoString, content: n };
}
function Xd(t) {
  const e = [];
  return e.push(Us(t.address)), e.push(Dr(t.contractName)), e.push(Dr(t.assetName)), vt(e);
}
function Na(t) {
  const e = Vt(t, pt) ? t : new pt(t);
  return {
    type: D.Asset,
    address: Pr(e),
    contractName: se(e),
    assetName: se(e)
  };
}
function Rc(t) {
  const e = t.values, n = [];
  n.push(at(Is(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Te(r));
  return vt(n);
}
function Zd(t, e, n) {
  const r = Vt(t, pt) ? t : new pt(t), s = Zi(G(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case D.Address:
        i.push(Pr(r));
        break;
      case D.LengthPrefixedString:
        i.push(se(r));
        break;
      case D.MemoString:
        i.push(Yd(r));
        break;
      case D.Asset:
        i.push(Na(r));
        break;
      case D.PostCondition:
        i.push(zm(r));
        break;
      case D.PublicKey:
        i.push(Da(r));
        break;
      case D.TransactionAuthField:
        i.push(Gm(r));
        break;
    }
  return zc(i, n);
}
function Fm(t) {
  return G(Qd(t));
}
function Qd(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Wd(t.principal)), (t.conditionType === yt.Fungible || t.conditionType === yt.NonFungible) && e.push(Xd(t.asset)), t.conditionType === yt.NonFungible && e.push($e(t.assetName)), e.push(t.conditionCode), t.conditionType === yt.STX || t.conditionType === yt.Fungible || t.conditionType === yt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Er("The post-condition amount may not be larger than 8 bytes");
    e.push(An(t.amount, 8));
  }
  return vt(e);
}
function zm(t) {
  const e = Vt(t, pt) ? t : new pt(t), n = e.readUInt8Enum(yt, (a) => {
    throw new Pt(`Could not read ${a} as PostConditionType`);
  }), r = Om(e);
  let s, i, o;
  switch (n) {
    case yt.STX:
      return s = e.readUInt8Enum(cs, (c) => {
        throw new Pt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${G(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: yt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case yt.Fungible:
      return i = Na(e), s = e.readUInt8Enum(cs, (c) => {
        throw new Pt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${G(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: yt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case yt.NonFungible:
      i = Na(e);
      const a = Ee(e);
      return s = e.readUInt8Enum(Ca, (c) => {
        throw new Pt(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: D.PostCondition,
        conditionType: yt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case yt.Staking:
      return s = e.readUInt8Enum(cs, (c) => {
        throw new Pt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${G(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: yt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case yt.PoX: {
      const c = e.readUInt8Enum(Ma, (l) => {
        throw new Pt(`Could not read ${l} as PoxConditionCode`);
      });
      return {
        type: D.PostCondition,
        conditionType: yt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Jd(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case lt.TokenTransfer:
      e.push($e(t.recipient)), e.push(An(t.amount, 8)), e.push(Te(t.memo));
      break;
    case lt.ContractCall:
      e.push(Te(t.contractAddress)), e.push(Te(t.contractName)), e.push(Te(t.functionName));
      const n = new Uint8Array(4);
      zn(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push($e(r));
      });
      break;
    case lt.SmartContract:
      e.push(Te(t.contractName)), e.push(Te(t.codeBody));
      break;
    case lt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Te(t.contractName)), e.push(Te(t.codeBody));
      break;
    case lt.PoisonMicroblock:
      break;
    case lt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case lt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push($e(t.recipient));
      break;
    case lt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push($e(t.recipient ? qd(t.recipient) : Vd())), e.push(t.vrfProof);
      break;
    case lt.TenureChange:
      e.push(at(t.tenureHash)), e.push(at(t.previousTenureHash)), e.push(at(t.burnViewHash)), e.push(at(t.previousTenureEnd)), e.push(zn(new Uint8Array(4), t.previousTenureBlocks)), e.push(P1(new Uint8Array(1), t.cause)), e.push(at(t.publicKeyHash));
      break;
  }
  return vt(e);
}
function Rm(t) {
  const e = Vt(t, pt) ? t : new pt(t);
  switch (e.readUInt8Enum(lt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case lt.TokenTransfer:
      const r = Ee(e), s = kt(e.readBytes(8)), i = Yd(e);
      return Mm(r, s, i);
    case lt.ContractCall:
      const o = Pr(e), a = se(e), c = se(e), l = [], f = e.readUInt32BE();
      for (let I = 0; I < f; I++) {
        const p = Ee(e);
        l.push(p);
      }
      return Um(o, a, c, l);
    case lt.SmartContract:
      const u = se(e), g = se(e, 4, 1e5);
      return Yl(u, g);
    case lt.VersionedSmartContract: {
      const I = e.readUInt8Enum(Ba, (C) => {
        throw new Error(`Cannot recognize ClarityVersion: ${C}`);
      }), p = se(e), $ = se(e, 4, Cx);
      return Yl(p, $, I);
    }
    case lt.PoisonMicroblock:
      return _m();
    case lt.Coinbase: {
      const I = e.readBytes(Dn);
      return Xl(I);
    }
    case lt.CoinbaseToAltRecipient: {
      const I = e.readBytes(Dn), p = Ee(e);
      return Xl(I, p);
    }
    case lt.NakamotoCoinbase: {
      const I = e.readBytes(Dn), p = Ee(e), $ = e.readBytes(La);
      return Tm(I, p, $);
    }
    case lt.TenureChange:
      const h = G(e.readBytes(20)), w = G(e.readBytes(20)), x = G(e.readBytes(20)), E = G(e.readBytes(32)), U = e.readUInt32BE(), _ = e.readUInt8Enum(Ua, (I) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${I}`);
      }), b = G(e.readBytes(20));
      return Nm(h, w, x, E, U, _, b);
  }
}
function ka(t) {
  const e = Vt(t, pt) ? t : new pt(t);
  return Ta(G(e.readBytes(lo)));
}
function Gm(t) {
  const e = Vt(t, pt) ? t : new pt(t), n = e.readUInt8Enum(ue, (r) => {
    throw new Pt(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case ue.PublicKeyCompressed:
      return Ar(xt.Compressed, Da(e));
    case ue.PublicKeyUncompressed:
      return Ar(xt.Uncompressed, Vr(IS(Da(e).data)));
    case ue.SignatureCompressed:
      return Ar(xt.Compressed, ka(e));
    case ue.SignatureUncompressed:
      return Ar(xt.Uncompressed, ka(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Gc(t) {
  return at(t.data);
}
function Km(t) {
  const e = [];
  switch (t.contents.type) {
    case D.PublicKey:
      e.push(t.pubKeyEncoding === xt.Compressed ? ue.PublicKeyCompressed : ue.PublicKeyUncompressed), e.push(at($S(t.contents.data)));
      break;
    case D.MessageSignature:
      e.push(t.pubKeyEncoding === xt.Compressed ? ue.SignatureCompressed : ue.SignatureUncompressed), e.push(Gc(t.contents));
      break;
  }
  return vt(e);
}
function Pa(t) {
  return t.data.slice();
}
function Da(t) {
  const e = Vt(t, pt) ? t : new pt(t), n = e.readUInt8(), r = n === 4 ? Sx : mx;
  return Vr(vt([n, e.readBytes(r)]));
}
function Kc(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ht.P2PKH || e === ht.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ht.P2WPKH || e === ht.P2WSH || e === ht.P2WSHNonSequential) && !r.map((s) => s.data).every(qr))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ht.P2PKH:
      return ri(t, gS(r[0].data));
    case ht.P2WPKH:
      return ri(t, yS(r[0].data));
    case ht.P2SH:
    case ht.P2SHNonSequential:
      return ri(t, bS(n, r.map(Pa)));
    case ht.P2WSH:
    case ht.P2WSHNonSequential:
      return ri(t, wS(n, r.map(Pa)));
  }
}
function ri(t, e) {
  return { type: D.Address, version: t, hash160: e };
}
function Vc(t) {
  return cr.c32address(t.version, t.hash160);
}
function Zl(t) {
  const [e, n, r] = t.split(/\.|::/);
  return km(e, n, r);
}
function ns(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Pm(e, n);
  } else
    return Dm(t);
}
function Vm(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Ym(e, n);
  } else
    return qm(t);
}
function qm(t) {
  const e = In(t);
  return { type: rt.PrincipalStandard, value: Vc(e) };
}
function Wm(t) {
  return { type: rt.PrincipalStandard, value: Vc(t) };
}
function Ym(t, e) {
  const n = In(t), r = de(e);
  return t0(n, r);
}
function t0(t, e) {
  if (sr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: rt.PrincipalContract,
    value: `${Vc(t)}.${e.content}`
  };
}
function Xm(t) {
  return { type: rt.ResponseErr, value: t };
}
function Zm(t) {
  return { type: rt.ResponseOk, value: t };
}
const Qm = (t) => ({ type: rt.StringASCII, value: t }), Jm = (t) => ({ type: rt.StringUTF8, value: t });
function tS(t) {
  for (const e in t)
    if (!xS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: rt.Tuple, value: t };
}
function Ee(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new pt(at(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new pt(t) : e = t;
  switch (e.readUInt8Enum(Ct, (r) => {
    throw new Pt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ct.int:
      return vm(fa(e.readBytes(16)));
    case Ct.uint:
      return Lm(e.readBytes(16));
    case Ct.buffer:
      const r = e.readUInt32BE();
      return $m(e.readBytes(r));
    case Ct.true:
      return Em();
    case Ct.false:
      return Am();
    case Ct.address:
      const s = Pr(e);
      return Wm(s);
    case Ct.contract:
      const i = Pr(e), o = se(e);
      return t0(i, o);
    case Ct.ok:
      return Zm(Ee(e));
    case Ct.err:
      return Xm(Ee(e));
    case Ct.none:
      return Vd();
    case Ct.some:
      return qd(Ee(e));
    case Ct.list:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Ee(e));
      return Bm(c);
    case Ct.tuple:
      const l = e.readUInt32BE(), f = {};
      for (let x = 0; x < l; x++) {
        const E = se(e).content;
        if (E === void 0)
          throw new Pt('"content" is undefined');
        f[E] = Ee(e);
      }
      return tS(f);
    case Ct.ascii:
      const u = e.readUInt32BE(), g = C1(e.readBytes(u));
      return Qm(g);
    case Ct.utf8:
      const h = e.readUInt32BE(), w = vs(e.readBytes(h));
      return Jm(w);
    default:
      throw new Pt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Be(t, e) {
  return vt([Fc(t), e]);
}
function eS(t) {
  return new Uint8Array([Fc(t.type)]);
}
function nS(t) {
  return t.type === rt.OptionalNone ? new Uint8Array([Fc(t.type)]) : Be(t.type, $e(t.value));
}
function rS(t) {
  const e = new Uint8Array(4);
  return zn(e, Math.ceil(t.value.length / 2), 0), Be(t.type, ve(e, at(t.value)));
}
function sS(t) {
  const e = yc($1(BigInt(t.value), BigInt(xx)), Pd);
  return Be(t.type, e);
}
function iS(t) {
  const e = yc(BigInt(t.value), Pd);
  return Be(t.type, e);
}
function oS(t) {
  return Be(t.type, Us(In(t.value)));
}
function aS(t) {
  const [e, n] = mS(t.value);
  return Be(t.type, ve(Us(In(e)), Dr(de(n))));
}
function cS(t) {
  return Be(t.type, $e(t.value));
}
function uS(t) {
  const e = [], n = new Uint8Array(4);
  zn(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = $e(r);
    e.push(s);
  }
  return Be(t.type, vt(e));
}
function lS(t) {
  const e = [], n = new Uint8Array(4);
  zn(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = de(s);
    e.push(Dr(i));
    const o = $e(t.value[s]);
    e.push(o);
  }
  return Be(t.type, vt(e));
}
function e0(t, e) {
  const n = [], r = e == "ascii" ? B1(t.value) : sr(t.value), s = new Uint8Array(4);
  return zn(s, r.length, 0), n.push(s), n.push(r), Be(t.type, vt(n));
}
function fS(t) {
  return e0(t, "ascii");
}
function hS(t) {
  return e0(t, "utf8");
}
function Ql(t) {
  return G($e(t));
}
function $e(t) {
  switch (t.type) {
    case rt.BoolTrue:
    case rt.BoolFalse:
      return eS(t);
    case rt.OptionalNone:
    case rt.OptionalSome:
      return nS(t);
    case rt.Buffer:
      return rS(t);
    case rt.UInt:
      return iS(t);
    case rt.Int:
      return sS(t);
    case rt.PrincipalStandard:
      return oS(t);
    case rt.PrincipalContract:
      return aS(t);
    case rt.ResponseOk:
    case rt.ResponseErr:
      return cS(t);
    case rt.List:
      return uS(t);
    case rt.Tuple:
      return lS(t);
    case rt.StringASCII:
      return fS(t);
    case rt.StringUTF8:
      return hS(t);
    default:
      throw new Er("Unable to serialize. Invalid Clarity Value.");
  }
}
const dS = (t) => t.length % 2 ? `0${t}` : t, pS = (t, e) => t.padEnd(e, "0"), n0 = (t, e) => t ? sr(t).length > e : !1;
function Oa(t) {
  return _d(t);
}
const ps = (t) => Wx(Dc(t)), qc = (t) => G(Sm(t)), gS = (t) => G(ps(t)), yS = (t) => {
  const e = ps(t), n = ve(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ps(n);
  return G(r);
}, bS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = vt(n), s = ps(r);
  return G(s);
}, wS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = vt(n), s = Dc(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = vt(i), a = ps(o);
  return G(a);
};
function xS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function mS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
At.hmacSha256Sync = (t, ...e) => {
  const n = Fd.create(Dc, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Vr(t) {
  return t = typeof t == "string" ? at(t) : t, {
    type: D.PublicKey,
    data: t
  };
}
function SS(t, e, n = xt.Compressed) {
  const r = _1(e), s = new Qt(Qu(r.r), Qu(r.s)), i = tt.fromSignature(t, s, r.recoveryId), o = n === xt.Compressed;
  return i.toHex(o);
}
function ES(t) {
  return typeof t == "string" ? t : G(t);
}
const Wc = ES;
function r0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === H1;
}
function qr(t) {
  return !Wc(t).startsWith("04");
}
function AS(t) {
  t = bc(t);
  const e = r0(t);
  return G(Ls(t.slice(0, 32), e));
}
function $S(t) {
  return tt.fromHex(Wc(t)).toHex(!0);
}
function IS(t) {
  return tt.fromHex(Wc(t)).toHex(!1);
}
function vS(t, e) {
  t = bc(t);
  const [n, r] = Ji(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Is(r, 1) + Qt.fromHex(n).toCompactHex();
}
function Yc() {
  return {
    type: D.MessageSignature,
    data: G(new Uint8Array(lo))
  };
}
function s0(t, e, n, r) {
  const s = Kc(0, t, 1, [Vr(e)]).hash160, i = qr(e) ? xt.Compressed : xt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: kt(n),
    fee: kt(r),
    keyEncoding: i,
    signature: Yc()
  };
}
function gs(t) {
  return "signature" in t;
}
function Jl(t) {
  return t === ht.P2SH || t === ht.P2WSH;
}
function LS(t) {
  return t === ht.P2SHNonSequential || t === ht.P2WSHNonSequential;
}
function tf(t) {
  const e = Oa(t);
  return e.nonce = 0, e.fee = 0, gs(e) ? e.signature = Yc() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function BS(t) {
  const e = [
    t.hashMode,
    at(t.signer),
    An(t.nonce, 8),
    An(t.fee, 8),
    t.keyEncoding,
    Gc(t.signature)
  ];
  return vt(e);
}
function CS(t) {
  const e = [
    t.hashMode,
    at(t.signer),
    An(t.nonce, 8),
    An(t.fee, 8)
  ], n = zc(t.fields);
  e.push(Rc(n));
  const r = new Uint8Array(2);
  return N1(r, t.signaturesRequired, 0), e.push(r), vt(e);
}
function MS(t, e) {
  const n = G(e.readBytes(20)), r = BigInt(`0x${G(e.readBytes(8))}`), s = BigInt(`0x${G(e.readBytes(8))}`), i = e.readUInt8Enum(xt, (a) => {
    throw new Pt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ht.P2WPKH && i != xt.Compressed)
    throw new Pt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = ka(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function US(t, e) {
  const n = G(e.readBytes(20)), r = BigInt("0x" + G(e.readBytes(8))), s = BigInt("0x" + G(e.readBytes(8))), i = Zd(e, D.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case D.PublicKey:
        qr(l.contents.data) || (o = !0);
        break;
      case D.MessageSignature:
        if (l.pubKeyEncoding === xt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Tn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ht.P2WSH || t === ht.P2WSHNonSequential))
    throw new Tn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function qo(t) {
  return gs(t) ? BS(t) : CS(t);
}
function Wo(t) {
  const e = t.readUInt8Enum(ht, (n) => {
    throw new Pt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ht.P2PKH || e === ht.P2WPKH ? MS(e, t) : US(e, t);
}
function i0(t, e, n, r) {
  const i = t + G(new Uint8Array([e])) + G(An(n, 8)) + G(An(r, 8));
  if (at(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return qc(at(i));
}
function o0(t, e, n) {
  const r = 33 + lo, s = qr(e.data) ? xt.Compressed : xt.Uncompressed, i = t + dS(s.toString(16)) + n, o = at(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return qc(o);
}
function HS(t, e, n, r, s) {
  const i = i0(t, e, n, r), o = vS(s, i), a = Vr(AS(s)), c = o0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function a0(t, e, n, r, s, i) {
  const o = i0(t, e, n, r), a = Vr(SS(o, i, s)), c = o0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function _S() {
  const t = s0(ht.P2PKH, "", 0, 0);
  return t.signer = Cm().hash160, t.keyEncoding = xt.Compressed, t.signature = Yc(), t;
}
function ef(t, e, n) {
  return gs(t) ? TS(t, e, n) : NS(t, e, n);
}
function TS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = a0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Kc(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Tn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function NS(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case D.PublicKey:
        qr(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case D.MessageSignature:
        c.pubKeyEncoding === xt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = a0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Jl(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new Tn("Too many signatures");
        break;
    }
  if (Jl(t.hashMode) && o !== t.signaturesRequired || LS(t.hashMode) && o < t.signaturesRequired)
    throw new Tn("Incorrect number of signatures");
  if (i && (t.hashMode === ht.P2WSH || t.hashMode === ht.P2WSHNonSequential))
    throw new Tn("Uncompressed keys are not allowed in this hash mode");
  const a = Kc(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Tn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function c0(t) {
  return {
    authType: St.Standard,
    spendingCondition: t
  };
}
function u0(t, e) {
  return {
    authType: St.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || s0(ht.P2PKH, "0".repeat(66), 0, 0)
  };
}
function nf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case St.Standard:
        return c0(tf(t.spendingCondition));
      case St.Sponsored:
        return u0(tf(t.spendingCondition), _S());
      default:
        throw new Di("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function kS(t, e) {
  switch (t.authType) {
    case St.Standard:
      return ef(t.spendingCondition, e, St.Standard);
    case St.Sponsored:
      return ef(t.spendingCondition, e, St.Standard);
    default:
      throw new Di("Invalid origin auth type");
  }
}
function PS(t, e) {
  switch (t.authType) {
    case St.Standard:
      const n = {
        ...t.spendingCondition,
        fee: kt(e)
      };
      return { ...t, spendingCondition: n };
    case St.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: kt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function DS(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: kt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function OS(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: kt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function jS(t, e) {
  const n = {
    ...e,
    nonce: kt(e.nonce),
    fee: kt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function FS(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case St.Standard:
      e.push(qo(t.spendingCondition));
      break;
    case St.Sponsored:
      e.push(qo(t.spendingCondition)), e.push(qo(t.sponsorSpendingCondition));
      break;
  }
  return vt(e);
}
function zS(t) {
  const e = t.readUInt8Enum(St, (r) => {
    throw new Pt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case St.Standard:
      return n = Wo(t), c0(n);
    case St.Sponsored:
      n = Wo(t);
      const r = Wo(t);
      return u0(n, r);
  }
}
class RS {
  constructor({ auth: e, payload: n, postConditions: r = zc([]), postConditionMode: s = Pi.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = yx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: kt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Wt.Any;
  }
  signBegin() {
    const e = Oa(this);
    return e.auth = nf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Oa(this);
    return e.auth = nf(e.auth), e.txid();
  }
  verifyOrigin() {
    return kS(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, St.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === St.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, St.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Vr(e), r = this.auth.spendingCondition;
    if (r && !gs(r)) {
      const s = qr(n.data);
      r.fields.push(Ar(s ? xt.Compressed : xt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = HS(n, r, e.fee, e.nonce, s);
    if (gs(e))
      e.signature = Ta(i);
    else {
      const a = r0(s);
      e.fields.push(Ar(a ? xt.Compressed : xt.Uncompressed, Ta(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return qc(e);
  }
  setSponsor(e) {
    if (this.auth.authType != St.Sponsored)
      throw new Di("Cannot sponsor sign a non-sponsored transaction");
    this.auth = jS(this.auth, e);
  }
  setFee(e) {
    this.auth = PS(this.auth, e);
  }
  setNonce(e) {
    this.auth = DS(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != St.Sponsored)
      throw new Di("Cannot sponsor sign a non-sponsored transaction");
    this.auth = OS(this.auth, e);
  }
  serialize() {
    return G(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Er('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Er('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Er('"auth" is undefined');
    if (this.payload === void 0)
      throw new Er('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return zn(n, this.chainId, 0), e.push(n), e.push(FS(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Rc(this.postConditions)), e.push(Jd(this.payload)), vt(e);
  }
}
function GS(t) {
  const e = Vt(t, pt) ? t : new pt(t), n = e.readUInt8Enum(Zn, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = zS(e), i = e.readUInt8Enum(Wt, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(Pi, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Zd(e, D.PostCondition), c = Rm(e), l = new RS({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return l.anchorMode = i, l;
}
const rf = BigInt("18446744073709551615");
function Yo(t) {
  const e = kt(t);
  if (e < 0n || e > rf)
    throw new RangeError(`Post-condition amount must be between 0 and ${rf} (u64 max), received: ${e}`);
  return e;
}
var ja;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(ja || (ja = {}));
var Fa;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Fa || (Fa = {}));
function KS(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: D.PostCondition,
        conditionType: yt.STX,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Ot.Origin } : ns(t.address),
        conditionCode: si(t.condition),
        amount: Yo(t.amount)
      };
    case "ft-postcondition":
      return {
        type: D.PostCondition,
        conditionType: yt.Fungible,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Ot.Origin } : ns(t.address),
        conditionCode: si(t.condition),
        amount: Yo(t.amount),
        asset: Zl(t.asset)
      };
    case "nft-postcondition":
      return {
        type: D.PostCondition,
        conditionType: yt.NonFungible,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Ot.Origin } : ns(t.address),
        conditionCode: si(t.condition),
        asset: Zl(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: D.PostCondition,
        conditionType: yt.Staking,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Ot.Origin } : ns(t.address),
        conditionCode: si(t.condition),
        amount: Yo(t.amount)
      };
    case "pox-postcondition":
      return {
        type: D.PostCondition,
        conditionType: yt.PoX,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Ot.Origin } : ns(t.address),
        conditionCode: VS(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function si(t) {
  return ja[t];
}
function VS(t) {
  return Fa[t];
}
function l0(t) {
  const e = KS(t);
  return Fm(e);
}
function qS(t, e, n) {
  return Zc(f0(t), n);
}
function f0(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ys(r);
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
    return BigInt(`0x${XS(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Xc(t, e = 8) {
  return (typeof t == "bigint" ? t : f0(t)).toString(16).padStart(e * 2, "0");
}
function Zc(t, e = 16) {
  const n = Xc(t, e);
  return ys(n);
}
function WS(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const YS = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function XS(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += YS[n];
  return e;
}
function ys(t) {
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
function Qc(t) {
  return new TextEncoder().encode(t);
}
function ZS(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function QS(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function sf(t) {
  if (t.some(QS))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Jc(...t) {
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
function Fe(t) {
  return Jc(...t.map((e) => typeof e == "number" ? sf([e]) : e instanceof Array ? sf(e) : e));
}
function po(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var za;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(za || (za = {}));
za.Mainnet;
const JS = 128, t3 = 128, h0 = 16;
var Ra;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ra || (Ra = {}));
var of;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(of || (of = {}));
var af;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(af || (af = {}));
var ce;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ce || (ce = {}));
const Xo = ["onChainOnly", "offChainOnly", "any"];
Xo[0] + "", ce.OnChainOnly, Xo[1] + "", ce.OffChainOnly, Xo[2] + "", ce.Any, ce.OnChainOnly + "", ce.OnChainOnly, ce.OffChainOnly + "", ce.OffChainOnly, ce.Any + "", ce.Any;
var Ga;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ga || (Ga = {}));
Ga.Mainnet;
var cf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(cf || (cf = {}));
var Mn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Mn || (Mn = {}));
var uf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(uf || (uf = {}));
var lf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(lf || (lf = {}));
var ff;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ff || (ff = {}));
var hf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(hf || (hf = {}));
var df;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(df || (df = {}));
var pf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(pf || (pf = {}));
var Ka;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ka || (Ka = {}));
var gf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(gf || (gf = {}));
var yf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(yf || (yf = {}));
function Va(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function e3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function d0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function n3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Va(t.outputLen), Va(t.blockLen);
}
function r3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function s3(t, e) {
  d0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Zo = {
  number: Va,
  bool: e3,
  bytes: d0,
  hash: n3,
  exists: r3,
  output: s3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Qo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), xe = (t, e) => t << 32 - e | t >>> e, i3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!i3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function o3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function p0(t) {
  if (typeof t == "string" && (t = o3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let a3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function lr(t) {
  const e = (r) => t().update(p0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function c3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let tu = class extends a3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Qo(this.buffer);
  }
  update(e) {
    Zo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = p0(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Qo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Zo.exists(this), Zo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    c3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Qo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const u3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), g0 = Uint8Array.from({ length: 16 }, (t, e) => e), l3 = g0.map((t) => (9 * t + 5) % 16);
let eu = [g0], nu = [l3];
for (let t = 0; t < 4; t++)
  for (let e of [eu, nu])
    e.push(e[t].map((n) => u3[n]));
const y0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), f3 = eu.map((t, e) => t.map((n) => y0[e][n])), h3 = nu.map((t, e) => t.map((n) => y0[e][n])), d3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), p3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ii = (t, e) => t << e | t >>> 32 - e;
function bf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oi = new Uint32Array(16);
let g3 = class extends tu {
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
      oi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, x = d3[h], E = p3[h], U = eu[h], _ = nu[h], b = f3[h], I = h3[h];
      for (let p = 0; p < 16; p++) {
        const $ = ii(r + bf(h, i, a, l) + oi[U[p]] + x, b[p]) + u | 0;
        r = u, u = l, l = ii(a, 10) | 0, a = i, i = $;
      }
      for (let p = 0; p < 16; p++) {
        const $ = ii(s + bf(w, o, c, f) + oi[_[p]] + E, I[p]) + g | 0;
        s = g, g = f, f = ii(c, 10) | 0, c = o, o = $;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    oi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
lr(() => new g3());
const y3 = (t, e, n) => t & e ^ ~t & n, b3 = (t, e, n) => t & e ^ t & n ^ e & n, w3 = new Uint32Array([
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
]), sn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), on = new Uint32Array(64);
let b0 = class extends tu {
  constructor() {
    super(64, 32, 8, !1), this.A = sn[0] | 0, this.B = sn[1] | 0, this.C = sn[2] | 0, this.D = sn[3] | 0, this.E = sn[4] | 0, this.F = sn[5] | 0, this.G = sn[6] | 0, this.H = sn[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      on[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = on[u - 15], h = on[u - 2], w = xe(g, 7) ^ xe(g, 18) ^ g >>> 3, x = xe(h, 17) ^ xe(h, 19) ^ h >>> 10;
      on[u] = x + on[u - 7] + w + on[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = xe(a, 6) ^ xe(a, 11) ^ xe(a, 25), h = f + g + y3(a, c, l) + w3[u] + on[u] | 0, x = (xe(r, 2) ^ xe(r, 13) ^ xe(r, 22)) + b3(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    on.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, x3 = class extends b0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
lr(() => new b0());
lr(() => new x3());
const ai = BigInt(2 ** 32 - 1), qa = BigInt(32);
function w0(t, e = !1) {
  return e ? { h: Number(t & ai), l: Number(t >> qa & ai) } : { h: Number(t >> qa & ai) | 0, l: Number(t & ai) | 0 };
}
function m3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = w0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const S3 = (t, e) => BigInt(t >>> 0) << qa | BigInt(e >>> 0), E3 = (t, e, n) => t >>> n, A3 = (t, e, n) => t << 32 - n | e >>> n, $3 = (t, e, n) => t >>> n | e << 32 - n, I3 = (t, e, n) => t << 32 - n | e >>> n, v3 = (t, e, n) => t << 64 - n | e >>> n - 32, L3 = (t, e, n) => t >>> n - 32 | e << 64 - n, B3 = (t, e) => e, C3 = (t, e) => t, M3 = (t, e, n) => t << n | e >>> 32 - n, U3 = (t, e, n) => e << n | t >>> 32 - n, H3 = (t, e, n) => e << n - 32 | t >>> 64 - n, _3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function T3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const N3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), k3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, P3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), D3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, O3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), j3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Z = {
  fromBig: w0,
  split: m3,
  toBig: S3,
  shrSH: E3,
  shrSL: A3,
  rotrSH: $3,
  rotrSL: I3,
  rotrBH: v3,
  rotrBL: L3,
  rotr32H: B3,
  rotr32L: C3,
  rotlSH: M3,
  rotlSL: U3,
  rotlBH: H3,
  rotlBL: _3,
  add: T3,
  add3L: N3,
  add3H: k3,
  add4L: P3,
  add4H: D3,
  add5H: j3,
  add5L: O3
}, [F3, z3] = Z.split([
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
].map((t) => BigInt(t))), an = new Uint32Array(80), cn = new Uint32Array(80);
let go = class extends tu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: w, Hh: x, Hl: E } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, w, x, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, w, x, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = x | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      an[b] = e.getUint32(n), cn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const I = an[b - 15] | 0, p = cn[b - 15] | 0, $ = Z.rotrSH(I, p, 1) ^ Z.rotrSH(I, p, 8) ^ Z.shrSH(I, p, 7), C = Z.rotrSL(I, p, 1) ^ Z.rotrSL(I, p, 8) ^ Z.shrSL(I, p, 7), L = an[b - 2] | 0, N = cn[b - 2] | 0, y = Z.rotrSH(L, N, 19) ^ Z.rotrBH(L, N, 61) ^ Z.shrSH(L, N, 6), A = Z.rotrSL(L, N, 19) ^ Z.rotrBL(L, N, 61) ^ Z.shrSL(L, N, 6), k = Z.add4L(C, A, cn[b - 7], cn[b - 16]), j = Z.add4H(k, $, y, an[b - 7], an[b - 16]);
      an[b] = j | 0, cn[b] = k | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: w, Gh: x, Gl: E, Hh: U, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const I = Z.rotrSH(u, g, 14) ^ Z.rotrSH(u, g, 18) ^ Z.rotrBH(u, g, 41), p = Z.rotrSL(u, g, 14) ^ Z.rotrSL(u, g, 18) ^ Z.rotrBL(u, g, 41), $ = u & h ^ ~u & x, C = g & w ^ ~g & E, L = Z.add5L(_, p, C, z3[b], cn[b]), N = Z.add5H(L, U, I, $, F3[b], an[b]), y = L | 0, A = Z.rotrSH(r, s, 28) ^ Z.rotrBH(r, s, 34) ^ Z.rotrBH(r, s, 39), k = Z.rotrSL(r, s, 28) ^ Z.rotrBL(r, s, 34) ^ Z.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = x | 0, _ = E | 0, x = h | 0, E = w | 0, h = u | 0, w = g | 0, { h: u, l: g } = Z.add(l | 0, f | 0, N | 0, y | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const O = Z.add3L(y, k, K);
      r = Z.add3H(O, N, A, j), s = O | 0;
    }
    ({ h: r, l: s } = Z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Z.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Z.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = Z.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = Z.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: w } = Z.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: x, l: E } = Z.add(this.Gh | 0, this.Gl | 0, x | 0, E | 0), { h: U, l: _ } = Z.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, w, x, E, U, _);
  }
  roundClean() {
    an.fill(0), cn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, R3 = class extends go {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, G3 = class extends go {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, K3 = class extends go {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
lr(() => new go());
lr(() => new R3());
lr(() => new G3());
lr(() => new K3());
function V3(t, e, n) {
  const s = JS;
  if (c4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ra.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Mt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Mt || (Mt = {}));
let q3 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, x0 = class extends q3 {
  constructor(e) {
    super(e);
  }
};
function yo(t) {
  const e = [];
  return e.push(ys(Xc(t.version, 1))), e.push(ys(t.hash160)), Fe(e);
}
function W3(t) {
  const e = [];
  return e.push(t.prefix), e.push(yo(t.address)), t.prefix === Ka.Contract && e.push(bs(t.contractName)), Fe(e);
}
function bs(t) {
  const e = [], n = Qc(t.content), r = n.byteLength;
  return e.push(ys(Xc(r, t.lengthPrefixBytes))), e.push(n), Fe(e);
}
function Y3(t) {
  const e = [];
  return e.push(yo(t.address)), e.push(bs(t.contractName)), e.push(bs(t.assetName)), Fe(e);
}
function m0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(W3(t.principal)), (t.conditionType === Mn.Fungible || t.conditionType === Mn.NonFungible) && e.push(Y3(t.assetInfo)), t.conditionType === Mn.NonFungible && e.push(Jn(t.assetName)), e.push(t.conditionCode), t.conditionType === Mn.STX || t.conditionType === Mn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new x0("The post-condition amount may not be larger than 8 bytes");
    e.push(qS(t.amount, !1, 8));
  }
  return Fe(e);
}
function Ce(t, e) {
  return Fe([t, e]);
}
function X3(t) {
  return new Uint8Array([t.type]);
}
function Z3(t) {
  return t.type === Mt.OptionalNone ? new Uint8Array([t.type]) : Ce(t.type, Jn(t.value));
}
function Q3(t) {
  const e = new Uint8Array(4);
  return po(e, t.buffer.length, 0), Ce(t.type, Jc(e, t.buffer));
}
function J3(t) {
  const e = Zc(WS(t.value, BigInt(t3)), h0);
  return Ce(t.type, e);
}
function t4(t) {
  const e = Zc(t.value, h0);
  return Ce(t.type, e);
}
function e4(t) {
  return Ce(t.type, yo(t.address));
}
function n4(t) {
  return Ce(t.type, Jc(yo(t.address), bs(t.contractName)));
}
function r4(t) {
  return Ce(t.type, Jn(t.value));
}
function s4(t) {
  const e = [], n = new Uint8Array(4);
  po(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Jn(r);
    e.push(s);
  }
  return Ce(t.type, Fe(e));
}
function i4(t) {
  const e = [], n = new Uint8Array(4);
  po(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = V3(s);
    e.push(bs(i));
    const o = Jn(t.data[s]);
    e.push(o);
  }
  return Ce(t.type, Fe(e));
}
function S0(t, e) {
  const n = [], r = e == "ascii" ? ZS(t.data) : Qc(t.data), s = new Uint8Array(4);
  return po(s, r.length, 0), n.push(s), n.push(r), Ce(t.type, Fe(n));
}
function o4(t) {
  return S0(t, "ascii");
}
function a4(t) {
  return S0(t, "utf8");
}
function Jn(t) {
  switch (t.type) {
    case Mt.BoolTrue:
    case Mt.BoolFalse:
      return X3(t);
    case Mt.OptionalNone:
    case Mt.OptionalSome:
      return Z3(t);
    case Mt.Buffer:
      return Q3(t);
    case Mt.UInt:
      return t4(t);
    case Mt.Int:
      return J3(t);
    case Mt.PrincipalStandard:
      return e4(t);
    case Mt.PrincipalContract:
      return n4(t);
    case Mt.ResponseOk:
    case Mt.ResponseErr:
      return r4(t);
    case Mt.List:
      return s4(t);
    case Mt.Tuple:
      return i4(t);
    case Mt.StringASCII:
      return o4(t);
    case Mt.StringUTF8:
      return a4(t);
    default:
      throw new x0("Unable to serialize. Invalid Clarity Value.");
  }
}
const c4 = (t, e) => t ? Qc(t).length > e : !1, u4 = "connect-ui";
let xi, E0, Yt = !1, Wa = !1;
const je = (t, e = "") => () => {
}, l4 = (t, e) => () => {
}, f4 = "{visibility:hidden}.hydrated{visibility:inherit}", wf = {}, h4 = "http://www.w3.org/2000/svg", d4 = "http://www.w3.org/1999/xhtml", p4 = (t) => t != null, ru = (t) => (t = typeof t, t === "object" || t === "function");
function A0(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const q = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (l) => {
    for (let f = 0; f < l.length; f++)
      r = l[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !ru(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Ya(null, r) : r), i = s);
  };
  if (a(n), e) {
    const l = e.className || e.class;
    l && (e.class = typeof l != "object" ? l : Object.keys(l).filter((f) => l[f]).join(" "));
  }
  const c = Ya(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Ya = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, g4 = {}, y4 = (t) => t && t.$tag$ === g4, b4 = (t, e) => t != null && !ru(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, w4 = (t) => Wr(t).$hostElement$, x4 = (t, e, n) => {
  const r = Nt.ce(e, n);
  return t.dispatchEvent(r), r;
}, xf = /* @__PURE__ */ new WeakMap(), m4 = (t, e, n) => {
  let r = Oi.get(t);
  j4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Oi.set(t, r);
}, S4 = (t, e, n, r) => {
  var s;
  let i = $0(e);
  const o = Oi.get(i);
  if (t = t.nodeType === 11 ? t : Ie, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = xf.get(t), c;
      if (a || xf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Ie.createElement("style"), c.innerHTML = o;
          const l = (s = Nt.$nonce$) !== null && s !== void 0 ? s : A0(Ie);
          l != null && c.setAttribute("nonce", l), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, E4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = je("attachStyles", e.$tagName$), i = S4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, $0 = (t, e) => "sc-" + t.$tagName$, mf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Ef(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, l = Sf(n), f = Sf(r);
      c.remove(...l.filter((u) => u && !f.includes(u))), c.add(...f.filter((u) => u && !l.includes(u)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Ef(bo, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Nt.rel(t, e, n, !1), r && Nt.ael(t, e, r, !1);
    else {
      const c = ru(r);
      if ((o || c && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const l = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != l) && (t[e] = l);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || i & 4 || s) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, A4 = /\s/, Sf = (t) => t ? t.split(A4) : [], I0 = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || wf, o = e.$attrs$ || wf;
  for (r in i)
    r in o || mf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    mf(s, r, i[r], o[r], n, e.$flags$);
}, su = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Ie.createTextNode(s.$text$);
  else {
    if (Yt || (Yt = s.$tag$ === "svg"), o = s.$elm$ = Ie.createElementNS(Yt ? h4 : d4, s.$tag$), Yt && s.$tag$ === "foreignObject" && (Yt = !1), I0(null, s, Yt), p4(xi) && o["s-si"] !== xi && o.classList.add(o["s-si"] = xi), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = su(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Yt = !1 : o.tagName === "foreignObject" && (Yt = !0);
  }
  return o;
}, v0 = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === E0 && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = su(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, L0 = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, $4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], l = r.length - 1, f = r[0], u = r[l], g;
  for (; s <= o && i <= l; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : u == null ? u = r[--l] : ci(a, f) ? (rs(a, f), a = e[++s], f = r[++i]) : ci(c, u) ? (rs(c, u), c = e[--o], u = r[--l]) : ci(a, u) ? (rs(a, u), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], u = r[--l]) : ci(c, f) ? (rs(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (g = su(e && e[i], n, i), f = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? v0(t, r[l + 1] == null ? null : r[l + 1].$elm$, n, r, i, l) : i > l && L0(e, s, o);
}, ci = (t, e) => t.$tag$ === e.$tag$, rs = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Yt = i === "svg" ? !0 : i === "foreignObject" ? !1 : Yt, I0(t, e, Yt), r !== null && s !== null ? $4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), v0(n, null, e, s, 0, s.length - 1)) : r !== null && L0(r, 0, r.length - 1), Yt && i === "svg" && (Yt = !1)) : t.$text$ !== o && (n.data = o);
}, I4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Ya(null, null), s = y4(e) ? e : q(null, null, e);
  E0 = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, xi = n["s-sc"], rs(r, s);
}, B0 = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, iu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return B0(t, t.$ancestorComponent$), z4(() => v4(t, e));
}, v4 = (t, e) => {
  const n = je("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), M4(s, () => L4(t, r, e));
}, L4 = async (t, e, n) => {
  const r = t.$hostElement$, s = je("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && E4(t);
  const o = je("render", t.$cmpMeta$.$tagName$);
  B4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => C4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, B4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, I4(t, e);
  } catch (r) {
    ws(r, t.$hostElement$);
  }
  return null;
}, C4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = je("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, M0(n), r(), t.$onReadyResolve$(n), s || C0()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && au(() => iu(t, !1)), t.$flags$ &= -517;
}, C0 = (t) => {
  M0(Ie.documentElement), au(() => x4(bo, "appload", { detail: { namespace: u4 } }));
}, M4 = (t, e) => t && t.then ? t.then(e) : e(), M0 = (t) => t.classList.add("hydrated"), U4 = (t, e) => Wr(t).$instanceValues$.get(e), H4 = (t, e, n, r) => {
  const s = Wr(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = b4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), l = n !== i && !c;
  (!(o & 8) || i === void 0) && l && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && iu(s, !1));
}, U0 = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return U4(this, i);
        },
        set(a) {
          H4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Nt.jmp(() => {
          const l = i.get(o);
          if (this.hasOwnProperty(l))
            c = this[l], delete this[l];
          else if (s.hasOwnProperty(l) && typeof this[l] == "number" && this[l] == c)
            return;
          this[l] = c === null && typeof this[l] == "boolean" ? !1 : c;
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
}, _4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = O4(n), s.then) {
        const c = l4();
        s = await s, c();
      }
      s.isProxied || (U0(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = je("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        ws(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = $0(n);
      if (!Oi.has(c)) {
        const l = je("registerStyles", n.$tagName$);
        m4(c, a, !!(n.$flags$ & 1)), l();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => iu(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, T4 = (t) => {
  if (!(Nt.$flags$ & 1)) {
    const e = Wr(t), n = e.$cmpMeta$, r = je("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            B0(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), _4(t, e, n);
    }
    r();
  }
}, N4 = (t) => {
  Nt.$flags$ & 1 || Wr(t);
}, k4 = (t, e = {}) => {
  var n;
  const r = je(), s = [], i = e.exclude || [], o = bo.customElements, a = Ie.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), l = /* @__PURE__ */ Ie.createElement("style"), f = [];
  let u, g = !0;
  Object.assign(Nt, e), Nt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Ie.baseURI).href, t.map((h) => {
    h[1].map((w) => {
      const x = {
        $flags$: w[0],
        $tagName$: w[1],
        $members$: w[2],
        $listeners$: w[3]
      };
      x.$members$ = w[2];
      const E = x.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(_) {
          super(_), _ = this, D4(_, x), x.$flags$ & 1 && _.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), g ? f.push(this) : Nt.jmp(() => T4(this));
        }
        disconnectedCallback() {
          Nt.jmp(() => N4(this));
        }
        componentOnReady() {
          return Wr(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = h[0], !i.includes(E) && !o.get(E) && (s.push(E), o.define(E, U0(
        U,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    l.innerHTML = s + f4, l.setAttribute("data-styles", "");
    const h = (n = Nt.$nonce$) !== null && n !== void 0 ? n : A0(Ie);
    h != null && l.setAttribute("nonce", h), a.insertBefore(l, c ? c.nextSibling : a.firstChild);
  }
  g = !1, f.length ? f.map((h) => h.connectedCallback()) : Nt.jmp(() => u = setTimeout(C0, 30)), r();
}, ou = /* @__PURE__ */ new WeakMap(), Wr = (t) => ou.get(t), P4 = (t, e) => ou.set(e.$lazyInstance$ = t, e), D4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], ou.set(t, n);
}, Ef = (t, e) => e in t, ws = (t, e) => (0, console.error)(t, e), Jo = /* @__PURE__ */ new Map(), O4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Jo.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Jo.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => V6).then(o, ws);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Jo.set(s, o), o[r]), ws);
}, Oi = /* @__PURE__ */ new Map(), bo = typeof window < "u" ? window : {}, Ie = bo.document || { head: {} }, Nt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, H0 = (t) => Promise.resolve(t), j4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Af = [], _0 = [], F4 = (t, e) => (n) => {
  t.push(n), Wa || (Wa = !0, Nt.$flags$ & 4 ? au(Xa) : Nt.raf(Xa));
}, $f = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      ws(n);
    }
  t.length = 0;
}, Xa = () => {
  $f(Af), $f(_0), (Wa = Af.length > 0) && Nt.raf(Xa);
}, au = (t) => H0().then(t), z4 = /* @__PURE__ */ F4(_0), R4 = () => H0(), G4 = (t, e) => typeof window > "u" ? Promise.resolve() : R4().then(() => k4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var K4 = Object.defineProperty, V4 = Object.defineProperties, q4 = Object.getOwnPropertyDescriptors, ji = Object.getOwnPropertySymbols, T0 = Object.prototype.hasOwnProperty, N0 = Object.prototype.propertyIsEnumerable, If = (t, e, n) => e in t ? K4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, te = (t, e) => {
  for (var n in e || (e = {})) T0.call(e, n) && If(t, n, e[n]);
  if (ji) for (var n of ji(e)) N0.call(e, n) && If(t, n, e[n]);
  return t;
}, pe = (t, e) => V4(t, q4(e)), k0 = (t, e) => {
  var n = {};
  for (var r in t) T0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ji) for (var r of ji(t)) e.indexOf(r) < 0 && N0.call(t, r) && (n[r] = t[r]);
  return n;
};
function P0() {
  return uo(qn()) || window.StacksProvider || window.BlockstackProvider;
}
function wo(t) {
  return t ? typeof t == "string" ? Yn.fromName(t) : "version" in t ? t : "url" in t ? new $a({ url: t.url }) : t.transactionVersion === Zn.Mainnet ? new $a({ url: t.client.baseUrl }) : new Ia({ url: t.client.baseUrl }) : new Ia();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var W4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(W4 || {}), Y4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Y4 || {}), cu = (t) => {
  let e = t;
  if (!e) {
    let n = new yh(["store_write"], document.location.href);
    e = new Aa({ appConfig: n });
  }
  return e;
};
function D0(t) {
  try {
    return cu(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var O0 = (t) => {
  let e = cu(t).loadUserData().appPrivateKey, n = _t.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function X4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Xn.Mainnet]: "mainnet", [Xn.Testnet]: "testnet" }, a = wo(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function Z4(t) {
  let e = wo(t.network), n = cu(t.userSession), r = pe(te({}, t), { network: e, userSession: n });
  return te({ stxAddress: X4(r) }, r);
}
async function Q4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(l0) : n = n.map((r) => G(m0(r)))), new _t.TokenSigner("ES256k", e).signAsync(pe(te({}, t), { postConditions: n }));
}
function J4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(l0) : e = e.map((n) => G(m0(n)))), _t.createUnsecuredToken(pe(te({}, t), { postConditions: e }));
}
var tE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = at(a.replace(/^0x/, "")), l = GS(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, pe(te({}, o), { stacksTransaction: l }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, pe(te({}, o), { stacksTransaction: l }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, eE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = k0(e, ["amount", "appDetails", "userSession"]);
  if (D0(s)) {
    let { privateKey: a, publicKey: c } = O0(s), l = pe(te({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (l.appDetails = r), Q4(l, a);
  }
  let o = pe(te({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), J4(o);
};
async function nE(t, e, n) {
  let r = await e(pe(te(te({}, Z4(t)), t), { network: wo(t.network) }));
  return tE({ token: r, options: t }, n);
}
function rE(t, e = P0()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return nE(t, eE, e);
}
function j0(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? pe(te({}, t), { message: Ql(e), domain: Ql(n) }) : pe(te({}, t), { message: G(Jn(e)), domain: G(Jn(n)) });
}
async function sE(t, e) {
  return new _t.TokenSigner("ES256k", e).signAsync(j0(t));
}
async function iE(t) {
  let e = t, { userSession: n } = e, r = k0(e, ["userSession"]);
  if (D0(n)) {
    let { privateKey: s, publicKey: i } = O0(n), o = pe(te({}, r), { publicKey: i });
    return sE(o, s);
  }
  return _t.createUnsecuredToken(j0(t));
}
var oE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(oE || {}), F0 = "asigna-stx", vf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === F0 && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(cE(t, e), "*");
}), aE = { authenticationRequest: async (t) => vf(t, "authenticationRequest"), transactionRequest: async (t) => vf(t, "transactionRequest") }, cE = (t, e) => ({ source: F0, [e]: t }), uE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = aE);
};
uE();
var lE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function fE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = qn(), o = P0();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    G4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : lE, c = nx(a), l = document.createElement("connect-modal");
    l.defaultProviders = a, l.installedProviders = c, l.persistSelection = e;
    let f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let u = () => {
      l.remove(), document.body.style.overflow = f;
    };
    l.callback = (h) => {
      u(), t(n, h);
    }, l.cancelCallback = () => {
      var h;
      u(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(l);
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), l.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var ui = fE(rE);
function $n(t, e, n) {
  return uu(Ft(t, e), n);
}
function Ft(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = wt(r);
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
      const r = pE(BigInt(`0x${et(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${et(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Lf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Hs(t, e = 8) {
  return (typeof t == "bigint" ? t : Ft(t, !1)).toString(16).padStart(e * 2, "0");
}
function xo(t) {
  return parseInt(t, 16);
}
function uu(t, e = 16) {
  const n = Hs(t, e);
  return wt(n);
}
function hE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function dE(t, e) {
  return t & BigInt(1) << e;
}
function pE(t, e) {
  return dE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const gE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function et(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += gE[n];
  return e;
}
function wt(t) {
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
function Yr(t) {
  return new TextEncoder().encode(t);
}
function lu(t) {
  return new TextDecoder().decode(t);
}
function z0(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function yE(t) {
  return String.fromCharCode.apply(null, t);
}
function bE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Bf(t) {
  if (t.some(bE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function mo(...t) {
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
function Lt(t) {
  return mo(...t.map((e) => typeof e == "number" ? Bf([e]) : e instanceof Array ? Bf(e) : e));
}
var Cf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Cf || (Cf = {}));
var Mf;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Mf || (Mf = {}));
var Uf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Uf || (Uf = {}));
const R0 = 33, ta = 32;
function wE(t) {
  if (t.length < ta * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ta * 2), r = t.slice(2 + ta * 2);
  return {
    recoveryId: xo(e),
    r: n,
    s: r
  };
}
function xE(t) {
  const e = typeof t == "string" ? wt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function mE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function SE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function EE(t, e) {
  return t[e];
}
function AE(t, e, n = 0) {
  return t[n] = e, t;
}
function $E(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function tr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Za;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Za || (Za = {}));
const IE = Za.Mainnet, vE = 128, LE = 128, G0 = 16, On = 32, Qa = 80, So = 65, BE = 32, CE = 64, Fi = 34;
var z;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(z || (z = {}));
var J;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(J || (J = {}));
var Ja;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ja || (Ja = {}));
var Gt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Gt || (Gt = {}));
const mi = ["onChainOnly", "offChainOnly", "any"], Hf = {
  [mi[0]]: Gt.OnChainOnly,
  [mi[1]]: Gt.OffChainOnly,
  [mi[2]]: Gt.Any,
  [Gt.OnChainOnly]: Gt.OnChainOnly,
  [Gt.OffChainOnly]: Gt.OffChainOnly,
  [Gt.Any]: Gt.Any
};
function ME(t) {
  if (t in Hf)
    return Hf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${mi.join(", ")}`);
}
var zi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zi || (zi = {}));
zi.Mainnet;
var xs;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(xs || (xs = {}));
var Kt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Kt || (Kt = {}));
var Et;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Et || (Et = {}));
var dt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(dt || (dt = {}));
var Ri;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ri || (Ri = {}));
var mt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(mt || (mt = {}));
var ms;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ms || (ms = {}));
var tc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(tc || (tc = {}));
var Ss;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ss || (Ss = {}));
var _f;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(_f || (_f = {}));
var Tf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Tf || (Tf = {}));
function ec(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function UE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function K0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function HE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ec(t.outputLen), ec(t.blockLen);
}
function _E(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function TE(t, e) {
  K0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const kn = {
  number: ec,
  bool: UE,
  bytes: K0,
  hash: HE,
  exists: _E,
  output: TE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ea = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), me = (t, e) => t << 32 - e | t >>> e, NE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!NE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function kE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function fu(t) {
  if (typeof t == "string" && (t = kE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class V0 {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function fr(t) {
  const e = (r) => t().update(fu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function PE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
class hu extends V0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ea(this.buffer);
  }
  update(e) {
    kn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = fu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ea(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    kn.exists(this), kn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    PE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ea(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const DE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), q0 = Uint8Array.from({ length: 16 }, (t, e) => e), OE = q0.map((t) => (9 * t + 5) % 16);
let du = [q0], pu = [OE];
for (let t = 0; t < 4; t++)
  for (let e of [du, pu])
    e.push(e[t].map((n) => DE[n]));
const W0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), jE = du.map((t, e) => t.map((n) => W0[e][n])), FE = pu.map((t, e) => t.map((n) => W0[e][n])), zE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), RE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), li = (t, e) => t << e | t >>> 32 - e;
function Nf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fi = new Uint32Array(16);
class GE extends hu {
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
      fi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, x = zE[h], E = RE[h], U = du[h], _ = pu[h], b = jE[h], I = FE[h];
      for (let p = 0; p < 16; p++) {
        const $ = li(r + Nf(h, i, a, l) + fi[U[p]] + x, b[p]) + u | 0;
        r = u, u = l, l = li(a, 10) | 0, a = i, i = $;
      }
      for (let p = 0; p < 16; p++) {
        const $ = li(s + Nf(w, o, c, f) + fi[_[p]] + E, I[p]) + g | 0;
        s = g, g = f, f = li(c, 10) | 0, c = o, o = $;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    fi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const KE = fr(() => new GE()), VE = (t, e, n) => t & e ^ ~t & n, qE = (t, e, n) => t & e ^ t & n ^ e & n, WE = new Uint32Array([
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
]), un = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ln = new Uint32Array(64);
class Y0 extends hu {
  constructor() {
    super(64, 32, 8, !1), this.A = un[0] | 0, this.B = un[1] | 0, this.C = un[2] | 0, this.D = un[3] | 0, this.E = un[4] | 0, this.F = un[5] | 0, this.G = un[6] | 0, this.H = un[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      ln[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = ln[u - 15], h = ln[u - 2], w = me(g, 7) ^ me(g, 18) ^ g >>> 3, x = me(h, 17) ^ me(h, 19) ^ h >>> 10;
      ln[u] = x + ln[u - 7] + w + ln[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = me(a, 6) ^ me(a, 11) ^ me(a, 25), h = f + g + VE(a, c, l) + WE[u] + ln[u] | 0, x = (me(r, 2) ^ me(r, 13) ^ me(r, 22)) + qE(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    ln.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class YE extends Y0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const gu = fr(() => new Y0());
fr(() => new YE());
const hi = BigInt(2 ** 32 - 1), nc = BigInt(32);
function X0(t, e = !1) {
  return e ? { h: Number(t & hi), l: Number(t >> nc & hi) } : { h: Number(t >> nc & hi) | 0, l: Number(t & hi) | 0 };
}
function XE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = X0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const ZE = (t, e) => BigInt(t >>> 0) << nc | BigInt(e >>> 0), QE = (t, e, n) => t >>> n, JE = (t, e, n) => t << 32 - n | e >>> n, t8 = (t, e, n) => t >>> n | e << 32 - n, e8 = (t, e, n) => t << 32 - n | e >>> n, n8 = (t, e, n) => t << 64 - n | e >>> n - 32, r8 = (t, e, n) => t >>> n - 32 | e << 64 - n, s8 = (t, e) => e, i8 = (t, e) => t, o8 = (t, e, n) => t << n | e >>> 32 - n, a8 = (t, e, n) => e << n | t >>> 32 - n, c8 = (t, e, n) => e << n - 32 | t >>> 64 - n, u8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function l8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const f8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), h8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, d8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), p8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, g8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), y8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Q = {
  fromBig: X0,
  split: XE,
  toBig: ZE,
  shrSH: QE,
  shrSL: JE,
  rotrSH: t8,
  rotrSL: e8,
  rotrBH: n8,
  rotrBL: r8,
  rotr32H: s8,
  rotr32L: i8,
  rotlSH: o8,
  rotlSL: a8,
  rotlBH: c8,
  rotlBL: u8,
  add: l8,
  add3L: f8,
  add3H: h8,
  add4L: d8,
  add4H: p8,
  add5H: y8,
  add5L: g8
}, [b8, w8] = Q.split([
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
].map((t) => BigInt(t))), fn = new Uint32Array(80), hn = new Uint32Array(80);
class Eo extends hu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: w, Hh: x, Hl: E } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, w, x, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, w, x, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = x | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      fn[b] = e.getUint32(n), hn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const I = fn[b - 15] | 0, p = hn[b - 15] | 0, $ = Q.rotrSH(I, p, 1) ^ Q.rotrSH(I, p, 8) ^ Q.shrSH(I, p, 7), C = Q.rotrSL(I, p, 1) ^ Q.rotrSL(I, p, 8) ^ Q.shrSL(I, p, 7), L = fn[b - 2] | 0, N = hn[b - 2] | 0, y = Q.rotrSH(L, N, 19) ^ Q.rotrBH(L, N, 61) ^ Q.shrSH(L, N, 6), A = Q.rotrSL(L, N, 19) ^ Q.rotrBL(L, N, 61) ^ Q.shrSL(L, N, 6), k = Q.add4L(C, A, hn[b - 7], hn[b - 16]), j = Q.add4H(k, $, y, fn[b - 7], fn[b - 16]);
      fn[b] = j | 0, hn[b] = k | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: w, Gh: x, Gl: E, Hh: U, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const I = Q.rotrSH(u, g, 14) ^ Q.rotrSH(u, g, 18) ^ Q.rotrBH(u, g, 41), p = Q.rotrSL(u, g, 14) ^ Q.rotrSL(u, g, 18) ^ Q.rotrBL(u, g, 41), $ = u & h ^ ~u & x, C = g & w ^ ~g & E, L = Q.add5L(_, p, C, w8[b], hn[b]), N = Q.add5H(L, U, I, $, b8[b], fn[b]), y = L | 0, A = Q.rotrSH(r, s, 28) ^ Q.rotrBH(r, s, 34) ^ Q.rotrBH(r, s, 39), k = Q.rotrSL(r, s, 28) ^ Q.rotrBL(r, s, 34) ^ Q.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = x | 0, _ = E | 0, x = h | 0, E = w | 0, h = u | 0, w = g | 0, { h: u, l: g } = Q.add(l | 0, f | 0, N | 0, y | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const O = Q.add3L(y, k, K);
      r = Q.add3H(O, N, A, j), s = O | 0;
    }
    ({ h: r, l: s } = Q.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Q.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = Q.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = Q.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: w } = Q.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: x, l: E } = Q.add(this.Gh | 0, this.Gl | 0, x | 0, E | 0), { h: U, l: _ } = Q.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, w, x, E, U, _);
  }
  roundClean() {
    fn.fill(0), hn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class x8 extends Eo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class m8 extends Eo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class S8 extends Eo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
fr(() => new Eo());
fr(() => new x8());
const E8 = fr(() => new m8());
fr(() => new S8());
function Z0(t) {
  if (wt(t).byteLength != So)
    throw Error("Invalid signature");
  return {
    type: z.MessageSignature,
    data: t
  };
}
function ss(t, e) {
  return { type: z.Address, version: t, hash160: e };
}
function us(t) {
  return cr.c32address(t.version, t.hash160);
}
function er(t, e, n) {
  const r = e || 1, s = n || vE;
  if (fp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: z.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function yu(t) {
  const e = cr.c32addressDecode(t);
  return {
    type: z.Address,
    version: e[0],
    hash160: e[1]
  };
}
var H;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(H || (H = {}));
function A8(t) {
  if (t.type === H.PrincipalStandard)
    return us(t.address);
  if (t.type === H.PrincipalContract)
    return `${us(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function $8(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return L8(e, n);
  } else
    return I8(t);
}
function I8(t) {
  const e = yu(t);
  return { type: H.PrincipalStandard, address: e };
}
function v8(t) {
  return { type: H.PrincipalStandard, address: t };
}
function L8(t, e) {
  const n = yu(t), r = er(e);
  return Q0(n, r);
}
function Q0(t, e) {
  if (Yr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: H.PrincipalContract, address: t, contractName: e };
}
function na(t, e = !1) {
  switch (t.type) {
    case H.BoolTrue:
      return !0;
    case H.BoolFalse:
      return !1;
    case H.Int:
    case H.UInt:
      return e ? t.value.toString() : t.value;
    case H.Buffer:
      return `0x${et(t.buffer)}`;
    case H.OptionalNone:
      return null;
    case H.OptionalSome:
      return bn(t.value);
    case H.ResponseErr:
      return bn(t.value);
    case H.ResponseOk:
      return bn(t.value);
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return A8(t);
    case H.List:
      return t.list.map((r) => bn(r));
    case H.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = bn(t.data[r]);
      }), n;
    case H.StringASCII:
      return t.data;
    case H.StringUTF8:
      return t.data;
  }
}
function bn(t) {
  switch (t.type) {
    case H.ResponseErr:
      return { type: wn(t), value: na(t, !0), success: !1 };
    case H.ResponseOk:
      return { type: wn(t), value: na(t, !0), success: !0 };
    default:
      return { type: wn(t), value: na(t, !0) };
  }
}
function wn(t) {
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
      return `(optional ${wn(t.value)})`;
    case H.ResponseErr:
      return `(response UnknownType ${wn(t.value)})`;
    case H.ResponseOk:
      return `(response ${wn(t.value)} UnknownType)`;
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return "principal";
    case H.List:
      return `(list ${t.list.length} ${t.list.length ? wn(t.list[0]) : "UnknownType"})`;
    case H.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${wn(t.data[e])})`).join(" ")})`;
    case H.StringASCII:
      return `(string-ascii ${z0(t.data).length})`;
    case H.StringUTF8:
      return `(string-utf8 ${Yr(t.data).length})`;
  }
}
const B8 = () => ({ type: H.BoolTrue }), C8 = () => ({ type: H.BoolFalse }), kf = BigInt("0xffffffffffffffffffffffffffffffff"), M8 = BigInt(0), Pf = BigInt("0x7fffffffffffffffffffffffffffffff"), Df = BigInt("-170141183460469231731687303715884105728"), U8 = (t) => {
  const e = Ft(t, !0);
  if (e > Pf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Pf}`);
  if (e < Df)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Df}`);
  return { type: H.Int, value: e };
}, Gi = (t) => {
  const e = Ft(t, !1);
  if (e < M8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > kf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${kf}`);
  return { type: H.UInt, value: e };
}, J0 = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: H.Buffer, buffer: t };
};
function tp() {
  return { type: H.OptionalNone };
}
function ep(t) {
  return { type: H.OptionalSome, value: t };
}
function H8(t) {
  return { type: H.ResponseErr, value: t };
}
function _8(t) {
  return { type: H.ResponseOk, value: t };
}
function T8(t) {
  return { type: H.List, list: t };
}
function rc(t) {
  for (const e in t)
    if (!AA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: H.Tuple, data: t };
}
const mr = (t) => ({ type: H.StringASCII, data: t }), N8 = (t) => ({ type: H.StringUTF8, data: t });
class np extends V0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, kn.hash(e);
    const r = fu(n);
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
    return kn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    kn.exists(this), kn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const rp = (t, e, n) => new np(t, e).update(n).digest();
rp.create = (t, e) => new np(t, e);
At.hmacSha256Sync = (t, ...e) => {
  const n = rp.create(gu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Or(t) {
  return {
    type: z.PublicKey,
    data: wt(t)
  };
}
function k8(t, e, n = mt.Compressed) {
  const r = wE(e.data), s = new Qt(Lf(r.r), Lf(r.s)), i = tt.fromSignature(t, s, r.recoveryId), o = n === mt.Compressed;
  return i.toHex(o);
}
function P8(t) {
  return { type: z.PublicKey, data: t };
}
function Xr(t) {
  return !et(t.data).startsWith("04");
}
function Ki(t) {
  return t.data.slice();
}
function D8(t) {
  const e = F8(t), n = Ls(e.data.slice(0, 32), e.compressed);
  return Or(et(n));
}
function O8(t) {
  const e = typeof t == "string" ? t : et(t), n = tt.fromHex(e).toHex(!0);
  return Or(n);
}
function j8(t) {
  const e = typeof t == "string" ? t : et(t), n = tt.fromHex(e).toHex(!1);
  return Or(n);
}
function sc(t) {
  const e = t.readUInt8(), n = e === 4 ? CE : BE;
  return P8(Lt([e, t.readBytes(n)]));
}
function F8(t) {
  const e = xE(t), n = e.length == R0;
  return { data: e, compressed: n };
}
function z8(t, e) {
  const [n, r] = Ji(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Hs(r, 1) + Qt.fromHex(n).toCompactHex();
  return Z0(i);
}
function R8(t) {
  return D8(t.data);
}
function G8(t, e, n) {
  return typeof t == "string" && (t = $8(t)), typeof n == "string" && (n = Ff(n)), {
    type: z.Payload,
    payloadType: J.TokenTransfer,
    recipient: t,
    amount: Ft(e, !1),
    memo: n ?? Ff("")
  };
}
function K8(t, e, n, r) {
  return typeof t == "string" && (t = yu(t)), typeof e == "string" && (e = er(e)), typeof n == "string" && (n = er(n)), {
    type: z.Payload,
    payloadType: J.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Of(t, e, n) {
  return typeof t == "string" && (t = er(t)), typeof e == "string" && (e = tA(e)), typeof n == "number" ? {
    type: z.Payload,
    payloadType: J.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: z.Payload,
    payloadType: J.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function V8() {
  return { type: z.Payload, payloadType: J.PoisonMicroblock };
}
function jf(t, e) {
  if (t.byteLength != On)
    throw Error(`Coinbase buffer size must be ${On} bytes`);
  return e != null ? {
    type: z.Payload,
    payloadType: J.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: z.Payload,
    payloadType: J.Coinbase,
    coinbaseBytes: t
  };
}
function q8(t, e, n) {
  if (t.byteLength != On)
    throw Error(`Coinbase buffer size must be ${On} bytes`);
  if (n.byteLength != Qa)
    throw Error(`VRF proof buffer size must be ${Qa} bytes`);
  return {
    type: z.Payload,
    payloadType: J.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === H.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var ic;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(ic || (ic = {}));
function W8(t, e, n, r, s, i, o) {
  return {
    type: z.Payload,
    payloadType: J.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function sp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case J.TokenTransfer:
      e.push(Ht(t.recipient)), e.push($n(t.amount, !1, 8)), e.push(Ne(t.memo));
      break;
    case J.ContractCall:
      e.push(Ne(t.contractAddress)), e.push(Ne(t.contractName)), e.push(Ne(t.functionName));
      const n = new Uint8Array(4);
      tr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ht(r));
      });
      break;
    case J.SmartContract:
      e.push(Ne(t.contractName)), e.push(Ne(t.codeBody));
      break;
    case J.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ne(t.contractName)), e.push(Ne(t.codeBody));
      break;
    case J.PoisonMicroblock:
      break;
    case J.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case J.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ht(t.recipient));
      break;
    case J.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ht(t.recipient ? ep(t.recipient) : tp())), e.push(t.vrfProof);
      break;
    case J.TenureChange:
      e.push(wt(t.tenureHash)), e.push(wt(t.previousTenureHash)), e.push(wt(t.burnViewHash)), e.push(wt(t.previousTenureEnd)), e.push(tr(new Uint8Array(4), t.previousTenureBlocks)), e.push(AE(new Uint8Array(1), t.cause)), e.push(wt(t.publicKeyHash));
      break;
  }
  return Lt(e);
}
function Y8(t) {
  switch (t.readUInt8Enum(J, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case J.TokenTransfer:
      const n = fe(t), r = Ft(t.readBytes(8), !1), s = op(t);
      return G8(n, r, s);
    case J.ContractCall:
      const i = jr(t), o = ie(t), a = ie(t), c = [], l = t.readUInt32BE();
      for (let b = 0; b < l; b++) {
        const I = fe(t);
        c.push(I);
      }
      return K8(i, o, a, c);
    case J.SmartContract:
      const f = ie(t), u = ie(t, 4, 1e5);
      return Of(f, u);
    case J.VersionedSmartContract: {
      const b = t.readUInt8Enum(Ja, ($) => {
        throw new Error(`Cannot recognize ClarityVersion: ${$}`);
      }), I = ie(t), p = ie(t, 4, 1e5);
      return Of(I, p, b);
    }
    case J.PoisonMicroblock:
      return V8();
    case J.Coinbase: {
      const b = t.readBytes(On);
      return jf(b);
    }
    case J.CoinbaseToAltRecipient: {
      const b = t.readBytes(On), I = fe(t);
      return jf(b, I);
    }
    case J.NakamotoCoinbase: {
      const b = t.readBytes(On), I = fe(t), p = t.readBytes(Qa);
      return q8(b, I, p);
    }
    case J.TenureChange:
      const g = et(t.readBytes(20)), h = et(t.readBytes(20)), w = et(t.readBytes(20)), x = et(t.readBytes(32)), E = t.readUInt32BE(), U = t.readUInt8Enum(ic, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), _ = et(t.readBytes(20));
      return W8(g, h, w, x, E, U, _);
  }
}
class Ao extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Un extends Ao {
  constructor(e) {
    super(e);
  }
}
class Zt extends Ao {
  constructor(e) {
    super(e);
  }
}
class Vi extends Ao {
  constructor(e) {
    super(e);
  }
}
class Pn extends Ao {
  constructor(e) {
    super(e);
  }
}
var le;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(le || (le = {}));
function oc(t) {
  return Z0(et(t.readBytes(So)));
}
function $r(t, e) {
  return {
    pubKeyEncoding: t,
    type: z.TransactionAuthField,
    contents: e
  };
}
function X8(t) {
  const e = t.readUInt8Enum(le, (n) => {
    throw new Zt(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case le.PublicKeyCompressed:
      return $r(mt.Compressed, sc(t));
    case le.PublicKeyUncompressed:
      return $r(mt.Uncompressed, j8(sc(t).data));
    case le.SignatureCompressed:
      return $r(mt.Compressed, oc(t));
    case le.SignatureUncompressed:
      return $r(mt.Uncompressed, oc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function bu(t) {
  return wt(t.data);
}
function Z8(t) {
  const e = [];
  switch (t.contents.type) {
    case z.PublicKey:
      e.push(t.pubKeyEncoding === mt.Compressed ? le.PublicKeyCompressed : le.PublicKeyUncompressed), e.push(Ki(O8(t.contents.data)));
      break;
    case z.MessageSignature:
      e.push(t.pubKeyEncoding === mt.Compressed ? le.SignatureCompressed : le.SignatureUncompressed), e.push(bu(t.contents));
      break;
  }
  return Lt(e);
}
function Ne(t) {
  switch (t.type) {
    case z.Address:
      return _s(t);
    case z.Principal:
      return ip(t);
    case z.LengthPrefixedString:
      return Fr(t);
    case z.MemoString:
      return eA(t);
    case z.AssetInfo:
      return ap(t);
    case z.PostCondition:
      return nA(t);
    case z.PublicKey:
      return Ki(t);
    case z.LengthPrefixedList:
      return mu(t);
    case z.Payload:
      return sp(t);
    case z.TransactionAuthField:
      return Z8(t);
    case z.MessageSignature:
      return bu(t);
  }
}
function Q8() {
  return {
    type: z.Address,
    version: Ri.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function wu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === dt.SerializeP2PKH || e === dt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === dt.SerializeP2WPKH || e === dt.SerializeP2WSH || e === dt.SerializeP2WSHNonSequential) && !r.every(Xr))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case dt.SerializeP2PKH:
      return ss(t, xA(r[0].data));
    case dt.SerializeP2WPKH:
      return ss(t, mA(r[0].data));
    case dt.SerializeP2SH:
    case dt.SerializeP2SHNonSequential:
      return ss(t, SA(n, r.map(Ki)));
    case dt.SerializeP2WSH:
    case dt.SerializeP2WSHNonSequential:
      return ss(t, EA(n, r.map(Ki)));
  }
}
function _s(t) {
  const e = [];
  return e.push(wt(Hs(t.version, 1))), e.push(wt(t.hash160)), Lt(e);
}
function jr(t) {
  const e = xo(et(t.readBytes(1))), n = et(t.readBytes(20));
  return { type: z.Address, version: e, hash160: n };
}
function ip(t) {
  const e = [];
  return e.push(t.prefix), e.push(_s(t.address)), t.prefix === Ss.Contract && e.push(Fr(t.contractName)), Lt(e);
}
function J8(t) {
  const e = t.readUInt8Enum(Ss, (s) => {
    throw new Zt(`Unexpected Principal payload type: ${s}`);
  }), n = jr(t);
  if (e === Ss.Standard)
    return { type: z.Principal, prefix: e, address: n };
  const r = ie(t);
  return {
    type: z.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Fr(t) {
  const e = [], n = Yr(t.content), r = n.byteLength;
  return e.push(wt(Hs(r, t.lengthPrefixBytes))), e.push(n), Lt(e);
}
function ie(t, e, n) {
  e = e || 1;
  const r = xo(et(t.readBytes(e))), s = lu(t.readBytes(r));
  return er(s, e, n ?? 128);
}
function tA(t) {
  return er(t, 4, 1e5);
}
function Ff(t) {
  if (t && fp(t, Fi))
    throw new Error(`Memo exceeds maximum length of ${Fi} bytes`);
  return { type: z.MemoString, content: t };
}
function eA(t) {
  const e = [], n = Yr(t.content), r = wA(et(n), Fi * 2);
  return e.push(wt(r)), Lt(e);
}
function op(t) {
  let e = lu(t.readBytes(Fi));
  return e = e.replace(/\u0000*$/, ""), { type: z.MemoString, content: e };
}
function ap(t) {
  const e = [];
  return e.push(_s(t.address)), e.push(Fr(t.contractName)), e.push(Fr(t.assetName)), Lt(e);
}
function ac(t) {
  return {
    type: z.AssetInfo,
    address: jr(t),
    contractName: ie(t),
    assetName: ie(t)
  };
}
function xu(t, e) {
  return {
    type: z.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function mu(t) {
  const e = t.values, n = [];
  n.push(wt(Hs(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ne(r));
  return Lt(n);
}
function cp(t, e, n) {
  const r = xo(et(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case z.Address:
        s.push(jr(t));
        break;
      case z.LengthPrefixedString:
        s.push(ie(t));
        break;
      case z.MemoString:
        s.push(op(t));
        break;
      case z.AssetInfo:
        s.push(ac(t));
        break;
      case z.PostCondition:
        s.push(rA(t));
        break;
      case z.PublicKey:
        s.push(sc(t));
        break;
      case z.TransactionAuthField:
        s.push(X8(t));
        break;
    }
  return xu(s, n);
}
function nA(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ip(t.principal)), (t.conditionType === Kt.Fungible || t.conditionType === Kt.NonFungible) && e.push(ap(t.assetInfo)), t.conditionType === Kt.NonFungible && e.push(Ht(t.assetName)), e.push(t.conditionCode), t.conditionType === Kt.STX || t.conditionType === Kt.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Un("The post-condition amount may not be larger than 8 bytes");
    e.push($n(t.amount, !1, 8));
  }
  return Lt(e);
}
function rA(t) {
  const e = t.readUInt8Enum(Kt, (o) => {
    throw new Zt(`Could not read ${o} as PostConditionType`);
  }), n = J8(t);
  let r, s, i;
  switch (e) {
    case Kt.STX:
      return r = t.readUInt8Enum(ms, (a) => {
        throw new Zt(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${et(t.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Kt.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Kt.Fungible:
      return s = ac(t), r = t.readUInt8Enum(ms, (a) => {
        throw new Zt(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${et(t.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Kt.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Kt.NonFungible:
      s = ac(t);
      const o = fe(t);
      return r = t.readUInt8Enum(tc, (a) => {
        throw new Zt(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: z.PostCondition,
        conditionType: Kt.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Me(t, e) {
  return Lt([t, e]);
}
function sA(t) {
  return new Uint8Array([t.type]);
}
function iA(t) {
  return t.type === H.OptionalNone ? new Uint8Array([t.type]) : Me(t.type, Ht(t.value));
}
function oA(t) {
  const e = new Uint8Array(4);
  return tr(e, t.buffer.length, 0), Me(t.type, mo(e, t.buffer));
}
function aA(t) {
  const e = uu(hE(t.value, BigInt(LE)), G0);
  return Me(t.type, e);
}
function cA(t) {
  const e = uu(t.value, G0);
  return Me(t.type, e);
}
function uA(t) {
  return Me(t.type, _s(t.address));
}
function lA(t) {
  return Me(t.type, mo(_s(t.address), Fr(t.contractName)));
}
function fA(t) {
  return Me(t.type, Ht(t.value));
}
function hA(t) {
  const e = [], n = new Uint8Array(4);
  tr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ht(r);
    e.push(s);
  }
  return Me(t.type, Lt(e));
}
function dA(t) {
  const e = [], n = new Uint8Array(4);
  tr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = er(s);
    e.push(Fr(i));
    const o = Ht(t.data[s]);
    e.push(o);
  }
  return Me(t.type, Lt(e));
}
function up(t, e) {
  const n = [], r = e == "ascii" ? z0(t.data) : Yr(t.data), s = new Uint8Array(4);
  return tr(s, r.length, 0), n.push(s), n.push(r), Me(t.type, Lt(n));
}
function pA(t) {
  return up(t, "ascii");
}
function gA(t) {
  return up(t, "utf8");
}
function Ht(t) {
  switch (t.type) {
    case H.BoolTrue:
    case H.BoolFalse:
      return sA(t);
    case H.OptionalNone:
    case H.OptionalSome:
      return iA(t);
    case H.Buffer:
      return oA(t);
    case H.UInt:
      return cA(t);
    case H.Int:
      return aA(t);
    case H.PrincipalStandard:
      return uA(t);
    case H.PrincipalContract:
      return lA(t);
    case H.ResponseOk:
    case H.ResponseErr:
      return fA(t);
    case H.List:
      return hA(t);
    case H.Tuple:
      return dA(t);
    case H.StringASCII:
      return pA(t);
    case H.StringUTF8:
      return gA(t);
    default:
      throw new Un("Unable to serialize. Invalid Clarity Value.");
  }
}
function yA(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const zf = /* @__PURE__ */ new Map();
function lp(t, e) {
  const n = zf.get(t);
  if (n !== void 0)
    return n(e);
  const r = yA(t);
  return zf.set(t, r), lp(t, e);
}
class ls {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return $E(this.readBytes(4), 0);
  }
  readUInt8() {
    return EE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return mE(this.readBytes(2), 0);
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
    if (lp(e, r))
      return r;
    throw n(r);
  }
}
function fe(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ls(wt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ls(t) : e = t;
  switch (e.readUInt8Enum(H, (r) => {
    throw new Zt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case H.Int:
      return U8(e.readBytes(16));
    case H.UInt:
      return Gi(e.readBytes(16));
    case H.Buffer:
      const r = e.readUInt32BE();
      return J0(e.readBytes(r));
    case H.BoolTrue:
      return B8();
    case H.BoolFalse:
      return C8();
    case H.PrincipalStandard:
      const s = jr(e);
      return v8(s);
    case H.PrincipalContract:
      const i = jr(e), o = ie(e);
      return Q0(i, o);
    case H.ResponseOk:
      return _8(fe(e));
    case H.ResponseErr:
      return H8(fe(e));
    case H.OptionalNone:
      return tp();
    case H.OptionalSome:
      return ep(fe(e));
    case H.List:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(fe(e));
      return T8(c);
    case H.Tuple:
      const l = e.readUInt32BE(), f = {};
      for (let x = 0; x < l; x++) {
        const E = ie(e).content;
        if (E === void 0)
          throw new Zt('"content" is undefined');
        f[E] = fe(e);
      }
      return rc(f);
    case H.StringASCII:
      const u = e.readUInt32BE(), g = yE(e.readBytes(u));
      return mr(g);
    case H.StringUTF8:
      const h = e.readUInt32BE(), w = lu(e.readBytes(h));
      return N8(w);
    default:
      throw new Zt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const bA = (t) => t.length % 2 == 0 ? t : `0${t}`, wA = (t, e) => t.padEnd(e, "0"), fp = (t, e) => t ? Yr(t).length > e : !1;
function cc(t) {
  return _d(t);
}
const Es = (t) => KE(gu(t)), Su = (t) => et(E8(t)), xA = (t) => et(Es(t)), mA = (t) => {
  const e = Es(t), n = mo(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Es(n);
  return et(r);
}, SA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Lt(n), s = Es(r);
  return et(s);
}, EA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Lt(n), s = gu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Lt(i), a = Es(o);
  return et(a);
};
function AA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function $A(t) {
  const e = Ht(t);
  return `0x${et(e)}`;
}
const Si = (t) => {
  try {
    return cr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Eu() {
  return {
    type: z.MessageSignature,
    data: et(new Uint8Array(So))
  };
}
function hp(t, e, n, r) {
  const s = wu(0, t, 1, [Or(e)]).hash160, i = Xr(Or(e)) ? mt.Compressed : mt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ft(n, !1),
    fee: Ft(r, !1),
    keyEncoding: i,
    signature: Eu()
  };
}
function As(t) {
  return "signature" in t;
}
function Rf(t) {
  return t === dt.SerializeP2SH || t === dt.SerializeP2WSH;
}
function IA(t) {
  return t === dt.SerializeP2SHNonSequential || t === dt.SerializeP2WSHNonSequential;
}
function Gf(t) {
  const e = cc(t);
  return e.nonce = 0, e.fee = 0, As(e) ? e.signature = Eu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function vA(t) {
  const e = [
    t.hashMode,
    wt(t.signer),
    $n(t.nonce, !1, 8),
    $n(t.fee, !1, 8),
    t.keyEncoding,
    bu(t.signature)
  ];
  return Lt(e);
}
function LA(t) {
  const e = [
    t.hashMode,
    wt(t.signer),
    $n(t.nonce, !1, 8),
    $n(t.fee, !1, 8)
  ], n = xu(t.fields);
  e.push(mu(n));
  const r = new Uint8Array(2);
  return SE(r, t.signaturesRequired, 0), e.push(r), Lt(e);
}
function BA(t, e) {
  const n = et(e.readBytes(20)), r = BigInt(`0x${et(e.readBytes(8))}`), s = BigInt(`0x${et(e.readBytes(8))}`), i = e.readUInt8Enum(mt, (a) => {
    throw new Zt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === dt.SerializeP2WPKH && i != mt.Compressed)
    throw new Zt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = oc(e);
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
  const n = et(e.readBytes(20)), r = BigInt("0x" + et(e.readBytes(8))), s = BigInt("0x" + et(e.readBytes(8))), i = cp(e, z.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case z.PublicKey:
        Xr(l.contents) || (o = !0);
        break;
      case z.MessageSignature:
        if (l.pubKeyEncoding === mt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Pn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === dt.SerializeP2WSH || t === dt.SerializeP2WSHNonSequential))
    throw new Pn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ra(t) {
  return As(t) ? vA(t) : LA(t);
}
function sa(t) {
  const e = t.readUInt8Enum(dt, (n) => {
    throw new Zt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === dt.SerializeP2PKH || e === dt.SerializeP2WPKH ? BA(e, t) : CA(e, t);
}
function dp(t, e, n, r) {
  const i = t + et(new Uint8Array([e])) + et($n(n, !1, 8)) + et($n(r, !1, 8));
  if (wt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Su(wt(i));
}
function pp(t, e, n) {
  const r = 33 + So, s = Xr(e) ? mt.Compressed : mt.Uncompressed, i = t + bA(s.toString(16)) + n.data, o = wt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Su(o);
}
function MA(t, e, n, r, s) {
  const i = dp(t, e, n, r), o = z8(s, i), a = R8(s), c = pp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function gp(t, e, n, r, s, i) {
  const o = dp(t, e, n, r), a = Or(k8(o, i, s)), c = pp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function UA() {
  const t = hp(dt.SerializeP2PKH, "", 0, 0);
  return t.signer = Q8().hash160, t.keyEncoding = mt.Compressed, t.signature = Eu(), t;
}
function Kf(t, e, n) {
  return As(t) ? HA(t, e, n) : _A(t, e, n);
}
function HA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = gp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = wu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Pn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function _A(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case z.PublicKey:
        Xr(c.contents) || (i = !0), r.push(c.contents);
        break;
      case z.MessageSignature:
        c.pubKeyEncoding === mt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = gp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Rf(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new Pn("Too many signatures");
        break;
    }
  if (Rf(t.hashMode) && o !== t.signaturesRequired || IA(t.hashMode) && o < t.signaturesRequired)
    throw new Pn("Incorrect number of signatures");
  if (i && (t.hashMode === dt.SerializeP2WSH || t.hashMode === dt.SerializeP2WSHNonSequential))
    throw new Pn("Uncompressed keys are not allowed in this hash mode");
  const a = wu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Pn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function yp(t) {
  return {
    authType: Et.Standard,
    spendingCondition: t
  };
}
function bp(t, e) {
  return {
    authType: Et.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || hp(dt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Vf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Et.Standard:
        return yp(Gf(t.spendingCondition));
      case Et.Sponsored:
        return bp(Gf(t.spendingCondition), UA());
      default:
        throw new Vi("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function TA(t, e) {
  switch (t.authType) {
    case Et.Standard:
      return Kf(t.spendingCondition, e, Et.Standard);
    case Et.Sponsored:
      return Kf(t.spendingCondition, e, Et.Standard);
    default:
      throw new Vi("Invalid origin auth type");
  }
}
function NA(t, e) {
  switch (t.authType) {
    case Et.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ft(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Et.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ft(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function kA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ft(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function PA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ft(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function DA(t, e) {
  const n = {
    ...e,
    nonce: Ft(e.nonce, !1),
    fee: Ft(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function OA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Et.Standard:
      e.push(ra(t.spendingCondition));
      break;
    case Et.Sponsored:
      e.push(ra(t.spendingCondition)), e.push(ra(t.sponsorSpendingCondition));
      break;
  }
  return Lt(e);
}
function jA(t) {
  const e = t.readUInt8Enum(Et, (r) => {
    throw new Zt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Et.Standard:
      return n = sa(t), yp(n);
    case Et.Sponsored:
      n = sa(t);
      const r = sa(t);
      return bp(n, r);
  }
}
class FA {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ft(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? IE, this.postConditionMode = i ?? xs.Deny, this.postConditions = s ?? xu([]), o)
      this.anchorMode = ME(o);
    else
      switch (r.payloadType) {
        case J.Coinbase:
        case J.CoinbaseToAltRecipient:
        case J.NakamotoCoinbase:
        case J.PoisonMicroblock:
        case J.TenureChange:
          this.anchorMode = Gt.OnChainOnly;
          break;
        case J.ContractCall:
        case J.SmartContract:
        case J.VersionedSmartContract:
        case J.TokenTransfer:
          this.anchorMode = Gt.Any;
          break;
      }
  }
  signBegin() {
    const e = cc(this);
    return e.auth = Vf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = cc(this);
    return e.auth = Vf(e.auth), e.txid();
  }
  verifyOrigin() {
    return TA(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Et.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Et.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Et.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !As(n)) {
      const r = Xr(e);
      n.fields.push($r(r ? mt.Compressed : mt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = MA(n, r, e.fee, e.nonce, s);
    return As(e) ? e.signature = i : e.fields.push($r(s.data.byteLength === R0 ? mt.Compressed : mt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Su(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Et.Sponsored)
      throw new Vi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = DA(this.auth, e);
  }
  setFee(e) {
    this.auth = NA(this.auth, e);
  }
  setNonce(e) {
    this.auth = kA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Et.Sponsored)
      throw new Vi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = PA(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Un('"version" is undefined');
    if (this.chainId === void 0)
      throw new Un('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Un('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Un('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Un('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return tr(n, this.chainId, 0), e.push(n), e.push(OA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(mu(this.postConditions)), e.push(sp(this.payload)), Lt(e);
  }
}
function Au(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ls(wt(t.slice(2))) : e = new ls(wt(t)) : t instanceof Uint8Array ? e = new ls(t) : e = t;
  const n = e.readUInt8Enum(zi, (l) => {
    throw new Error(`Could not parse ${l} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = jA(e), i = e.readUInt8Enum(Gt, (l) => {
    throw new Error(`Could not parse ${l} as AnchorMode`);
  }), o = e.readUInt8Enum(xs, (l) => {
    throw new Error(`Could not parse ${l} as PostConditionMode`);
  }), a = cp(e, z.PostCondition), c = Y8(e);
  return new FA(n, s, c, a, o, i, r);
}
const qi = Gi, zA = J0;
const RA = /* @__PURE__ */ new Set([4001, -31001]), GA = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], KA = ["result", "data", "payload", "response", "params"], qf = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], $o = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), hr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, De = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, VA = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), wp = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => VA(i, r)) === s
  );
}, xp = (t) => t ? wp(hr()).some(
  (e) => {
    var n;
    return e.id === t && ($o(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, mp = () => {
  if (typeof window > "u")
    return;
  const t = hr(), e = wp(t).filter(
    (n) => {
      var r;
      return $o(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = De(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of GA) {
    const r = De(t, n) ?? (t === window ? void 0 : De(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, qA = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = hr(), n = De(e, t) ?? (e === window ? void 0 : De(window, t)) ?? uo(t);
  if (n)
    return n;
  if ($o(t) || xp(t))
    return mp();
}, di = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, WA = ["blockstack-session", "blockstack"], YA = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of WA) {
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
YA();
const Sp = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Xt = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, XA = (t) => {
  const e = Xt(t);
  if (!e)
    return null;
  const n = Sp(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, ZA = (t) => {
  const e = Xt(t);
  if (!e)
    return null;
  const n = Sp(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, uc = (t, e = "mainnet") => {
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
      return uc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return uc(r, e);
  }
  return e;
}, jn = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, $s = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Si(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = $s(s, e + 1);
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
    const i = $s(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Si(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Si(n.testnet) ? n.testnet.trim() : null;
}, Wf = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Ep = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && RA.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, nr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Xt(n == null ? void 0 : n.message) ?? Xt(e.message) ?? Xt(e.error) ?? Xt(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, zr = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw nr(e);
    if (e.status === "error")
      throw nr(e.result ?? e);
  }
  return t;
}, Yf = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return zr(r);
  } catch (r) {
    throw nr(r);
  }
}, Ap = () => mp(), $u = () => {
  if (typeof window > "u")
    return;
  const t = hr();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = De(t, e) ?? (t === window ? void 0 : De(window, e));
    if (n)
      return n;
  }
}, Xf = () => {
  if (typeof window > "u")
    return;
  const t = $u();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = hr();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = De(e, n) ?? (e === window ? void 0 : De(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Ei = (t) => {
  var r, s;
  const e = qn();
  if ($o(e) || xp(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = hr() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Ap();
}, ia = (t) => {
  const e = ZA(t);
  if (!e)
    return null;
  try {
    const n = Au(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Wi = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = ia(t), r = XA(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Xt(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Wi(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of qf)
    if (ia(s[a])) {
      i = Xt(s[a]);
      break;
    }
  const o = Xt(s.txId) || Xt(s.txid) || Xt(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Xt(s.txRaw) ?? void 0
    };
  for (const a of qf) {
    const c = ia(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Xt(s[a]) ?? void 0
      };
  }
  for (const a of KA) {
    const c = s[a], l = Wi(c, e + 1);
    if (l)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...l,
        txId: l.txId,
        txid: l.txid ?? l.txId
      };
  }
  return null;
}, oa = (t) => {
  const e = Wi(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, QA = (t) => {
  const e = Wi(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, JA = (t) => ({
  ...t,
  fee: jn(t.fee),
  nonce: jn(t.nonce),
  sponsored: t.sponsored === !0
}), Zf = (t) => ({
  recipient: t.recipient,
  amount: jn(t.amount) ?? "0",
  memo: t.memo,
  network: uc(t.network),
  address: t.stxAddress,
  fee: jn(t.fee),
  nonce: jn(t.nonce),
  sponsored: t.sponsored ?? !1
}), $p = "WALLET_ADDRESS_MISMATCH", t6 = 45e3;
let fs = null;
const lc = (t) => {
  t && (fs = { address: t, at: Date.now() });
}, e6 = () => {
  fs = null;
}, n6 = () => fs && Date.now() - fs.at <= t6 ? fs.address : null, r6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, s6 = async (t) => {
  e6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = zr(await t.request("wallet_connect")), n = $s(e);
  return lc(n), n;
}, i6 = async (t, e, n, r) => {
  try {
    return zr(await t.request(e, n));
  } catch (s) {
    const i = nr(s);
    if (!r6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await s6(t);
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
        { code: o ? $p : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return zr(await t.request(e, n));
    } catch (a) {
      throw nr(a);
    }
  }
};
let Qf = 3e4;
const o6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Qf / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Qf);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, a6 = async (t, e, n) => {
  const r = (c, l) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${l}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: $p }
      );
    return c;
  }, s = n6();
  if (s)
    return di(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  di(n, "account-read");
  try {
    const c = zr(
      await o6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = $s(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Ep(c))
      throw nr(c);
    di(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return lc(i), r(i, "wallet_getAccount");
  let o;
  di(n, "account-reconnect");
  try {
    o = zr(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), nr(c);
  }
  const a = $s(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return lc(a), r(a, "wallet_connect");
}, c6 = async (t, e) => {
  if (!Ei(t)) {
    const i = await Yf(
      t,
      "stx_transferStx",
      Zf(e)
    );
    return oa(i);
  }
  const n = $u();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Yf(
      n,
      "stx_transferStx",
      Zf(e)
    );
    return oa(i);
  }
  const r = Ap();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await a6(r, e.stxAddress);
  const s = await i6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: jn(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: jn(e.fee) } : {}
    },
    e.stxAddress
  );
  return oa(s);
}, u6 = () => qn(), Ip = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = qn(), e = t ? qA(t) : void 0;
  if (e)
    return e;
  const n = hr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, l6 = (t, e) => {
  const n = Ip(), r = JA({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, QA(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ui(r, e);
  if (Ei(n) && !$u()) {
    const s = Xf();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: qn(),
        route: "legacy-transaction-request"
      }), ui(r, s);
  }
  return void c6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Wf(s) && Ei(n)) {
      const a = Xf();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: qn(),
          route: "legacy-transaction-request"
        }), ui(r, a);
        return;
      }
    }
    if (Wf(s) && !Ei(n)) {
      ui(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Ep(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Jf = (t) => $A(t).replace(/^0x/, ""), th = "This wallet cannot sign messages. Try Xverse or Leather.", eh = (t) => typeof (t == null ? void 0 : t.request) == "function", nh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", f6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, h6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function d6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Jf(e.message),
    domain: Jf(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function p6(t, e) {
  const n = await iE({
    domain: e.domain,
    message: e.message,
    network: wo(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function g6(t) {
  var s, i;
  const e = u6() || "", n = /xverse/i.test(e);
  let r = Ip();
  if (n && !nh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (nh(r))
    try {
      return await p6(r, t);
    } catch (o) {
      if (n || !eh(r) || !h6(o)) throw o;
    }
  if (!n && eh(r))
    try {
      return await d6(r, t);
    } catch (o) {
      throw f6(o) ? new Error(th) : o;
    }
  throw new Error(th);
}
const rh = 1000000n, hs = 1000000n, fc = 50n, Yi = 3000n, Iu = 300n, y6 = 3000n, b6 = 50000n, Io = (t) => t + fc;
function dn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / rh}.${(n % rh).toString().padStart(6, "0")}`;
}
function w6(t, e = Iu) {
  return t <= Yi ? 0 : Number((t - Yi) / Io(e));
}
function sh(t, e = 0n) {
  const n = hs - t - e;
  return n > 0n ? n : 0n;
}
function x6(t, e = Iu) {
  return t > hs ? "over" : t < Yi + Io(e) ? "empty" : t < b6 ? "low" : "ok";
}
const m6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", S6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", E6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function A6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || E6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== m6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const vp = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", [hc, Lp] = vp.split("."), gn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function dc(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function $6(t) {
  return gn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Rr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Bp(t, e = []) {
  const n = await Rr(`/v2/contracts/call-read/${hc}/${Lp}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: hc, arguments: e.map((r) => "0x" + gn(Ht(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return bn(fe(n.result));
}
async function I6() {
  const t = await Rr(`/v2/contracts/source/${hc}/${Lp}?proof=0`);
  if (typeof t.source != "string" || await $6(t.source) !== S6) throw Error("Deployed source does not match the tested helper.");
  if (A6(await Bp("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Cp(t) {
  return t.startsWith("SP") && Si(t) && !t.includes(".");
}
async function v6(t) {
  var r;
  if (!Cp(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Rr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Rr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function L6(t) {
  const e = await Rr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function B6(t, e) {
  var s, i;
  const n = await Bp("get-owner", [qi(t), qi(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Cp(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function C6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: dc(t), signal: AbortSignal.timeout(15e3) });
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
async function M6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function U6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Au(dc(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || us(ss(Ri.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || us(r.contractAddress) + "." + r.contractName.content !== vp || r.functionName.content !== "play" || r.functionArgs.length !== 3 || gn(Ht(r.functionArgs[0])) !== gn(Ht(qi(t.core))) || gn(Ht(r.functionArgs[1])) !== gn(Ht(qi(t.song))) || gn(Ht(r.functionArgs[2])) !== gn(Ht(zA(dc(t.id)))) || t.amount !== "50" || e.postConditionMode !== xs.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ms.Equal || i.principal.prefix !== 2 || us(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (r.payloadType !== 0 || bn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const H6 = "xtrata.xyz/radio/listening-wallet", _6 = "Link a temporary listening wallet for pay-per-play; no spending permission", T6 = (t) => ({
  domain: rc({ name: mr(H6), version: mr("1"), "chain-id": Gi(1) }),
  message: rc({
    purpose: mr(_6),
    main: mr(t.main),
    listening: mr(t.listening),
    issued: Gi(t.issued)
  })
}), aa = 3, N6 = ["prepared", "signed", "unknown", "pending"], k6 = 30 * 6e4, ca = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, P6 = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function D6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, l = !1, f = "", u = "", g, h = null, w, x = -1 / 0;
  const E = /* @__PURE__ */ new Set();
  let U = !1, _ = !1;
  const b = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Iu.toString()), I = (M, T) => `xtrata.ppp.v1.${M}:${T}`, p = (M = i == null ? void 0 : i.address) => {
    if (!M) return [];
    try {
      const T = JSON.parse(t.store.get(I("entries", M)) || "[]");
      return Array.isArray(T) ? T : [];
    } catch {
      return [];
    }
  }, $ = (M) => {
    const T = [M, ...p(M.address).filter((V) => !(V.txid === M.txid && V.kind === M.kind))].slice(0, 200);
    t.store.set(I("entries", M.address), JSON.stringify(T));
  }, C = (M = i == null ? void 0 : i.address) => !!M && t.store.get(I("on", M)) !== "0", L = (M) => {
    i != null && i.address && t.store.set(I("on", i.address), M ? "1" : "0");
  }, N = () => p().filter((M) => N6.includes(M.status)), y = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(I("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, A = (M) => {
    i != null && i.address && t.store.set(I("deposit", i.address), JSON.stringify(M));
  }, k = () => N().filter((M) => t.now() - M.created > k6 && E.has(M.txid));
  function j() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const M = t.main();
    return M ? e.allowed ? i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : i.linked !== M ? "link" : o === void 0 ? "loading" : o > hs ? "over" : o < Yi + Io(b()) ? "fund" : "ready" : "loading" : "not-invited" : "connect";
  }
  const K = () => {
    var M, T;
    return {
      step: j(),
      busy: c,
      message: f,
      error: u,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : x6(o, b()),
      playsLeft: o === void 0 ? 0 : w6(o, b()),
      allowance: o === void 0 ? hs : sh(o, BigInt(((M = y()) == null ? void 0 : M.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: C(),
      entries: p(),
      depositTxid: ((T = y()) == null ? void 0 : T.txid) ?? g,
      depositPending: !!y(),
      serverLinked: !!h && w === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: k().length
    };
  }, O = (M, T = "") => {
    f = M, u = T, t.changed();
  };
  async function $t(M, T) {
    if (!c) {
      c = M, u = "", t.changed();
      try {
        await T();
      } catch (V) {
        const R = V instanceof Error ? V.message : String(V);
        u = /Cancelled in the listening wallet/.test(R) ? "" : R, u || (f = "Cancelled. Nothing was signed.");
      } finally {
        c = null, await ot(!0);
      }
    }
  }
  async function nt() {
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function gt(M = !1) {
    i != null && i.address && (!M && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function m(M) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || i.linked === M) return;
    const T = `${M}:${i.address}`;
    w === T && (h || t.now() - x < 6e4) || (h = (await t.links(M)).find((V) => V.listening === i.address) ?? null, w = T, x = t.now());
  }
  async function B() {
    const M = i == null ? void 0 : i.address;
    if (!M) return;
    let T;
    for (const R of N())
      try {
        const Bt = await t.chain.transaction(R.txid);
        if (!Bt) {
          if (E.add(R.txid), t.now() - R.created > 15 * 6e4 && (T ?? (T = await t.chain.confirmedNonce(M))), T !== void 0 && T > BigInt(R.nonce)) {
            $({ ...R, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((R.status === "unknown" || R.status === "signed") && R.raw)
            try {
              await t.chain.broadcast(R.raw, R.txid), $({ ...R, status: "pending" });
            } catch (ee) {
              ca(ee) && $({ ...R, status: "failed", note: ee.message, raw: void 0 });
            }
          continue;
        }
        E.delete(R.txid);
        const Tt = String(Bt.tx_status);
        Tt === "success" && Bt.canonical !== !1 && Bt.is_unanchored === !1 ? $({ ...R, status: "confirmed", confirmedAt: t.now(), actualFee: String(Bt.fee_rate ?? R.fee), raw: void 0 }) : Tt.startsWith("abort_") || Tt.startsWith("dropped_") ? $({ ...R, status: "failed", note: Tt, raw: void 0 }) : R.status !== "pending" && $({ ...R, status: "pending" });
      } catch {
      }
    const V = y();
    if (V)
      try {
        const R = await t.chain.transaction(V.txid), Bt = String((R == null ? void 0 : R.tx_status) ?? "");
        (Bt === "success" && R.is_unanchored === !1 || Bt.startsWith("abort_") || Bt.startsWith("dropped_") || !R && t.now() - V.at > 2 * 36e5) && (A(null), a = -1 / 0);
      } catch {
      }
  }
  async function ot(M = !1) {
    try {
      const T = t.main();
      if ((M || !e || r !== T || t.now() - n > 3e5) && (e = await t.config(T), n = t.now(), r = T), !e.enabled || !e.here || !T || !e.allowed) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), t.changed();
        return;
      }
      await nt(), i = await s.request("listening.status"), await m(T), await gt(M), await B();
    } catch (T) {
      u = T instanceof Error ? T.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    t.changed();
  }
  const ct = () => ({
    fee: b().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: hs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function st() {
    if (!(i != null && i.address)) return !1;
    if (_ || (_ = await t.tabLock(i.address)), !_)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const It = {
    forceRefresh: () => ot(!0),
    create: () => $t("Waiting for your passkey in the listening wallet…", async () => {
      const M = await nt();
      await M.request("listening.unlock", { mode: "create", terms: ct() }), i = await M.request("listening.status"), L(!0), O("Listening wallet created and paying is switched on. Next, link it to your main wallet."), await st();
    }),
    unlock: (M = !1) => $t("Waiting for your passkey in the listening wallet…", async () => {
      const T = await nt(), V = !(i != null && i.address) || C(i.address);
      await T.request("listening.unlock", { mode: "unlock", terms: V ? ct() : void 0, anyPasskey: M }), i = await T.request("listening.status"), V && (C(i.address) ? await st() : await T.request("listening.stop")), O(V ? "Unlocked. Each song you listen to for 30 seconds pays its holder." : "Unlocked. Paying is switched off.");
    }),
    link: () => $t("Waiting for your main wallet to sign…", async () => {
      const M = t.main();
      if (!M || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const T = (await t.links(M)).find((V) => V.listening === i.address);
      if (T)
        await s.request("listening.link", { main: M, issued: T.issued, mainSignature: T.mainSignature });
      else {
        const V = { main: M, listening: i.address, issued: t.now() }, R = await t.signWithMain(M, T6(V)), Bt = await s.request("listening.link", { main: M, issued: V.issued, mainSignature: R });
        await t.saveLink({ ...V, mainSignature: R, listeningSignature: Bt.listeningSignature });
      }
      x = -1 / 0, O("Linked. Returns from the listening wallet can only go to your main wallet.");
    }),
    deposit: () => $t("Waiting for your main wallet to approve the deposit…", async () => {
      const M = t.main();
      if (!M || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (y()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await gt(!0);
      const T = sh(o ?? 0n);
      if (T <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      g = await t.deposit(M, i.address, T), g && A({ txid: g, amount: T.toString(), at: t.now() }), O("Deposit sent. It usually confirms within a few minutes; this page checks automatically.");
    }),
    switchOn: () => $t("Confirm in the listening wallet…", async () => {
      await st(), await s.request("listening.approveSession", ct()), L(!0), O("Switched on. Each song you listen to for 30 seconds pays its holder until you switch it off or the wallet runs out.");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => $t("Clearing…", async () => {
      for (const M of k())
        await t.chain.transaction(M.txid) || $({ ...M, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      O("Cleared. If one of those still confirms later, it will simply show in your wallet history on the explorer.");
    }),
    switchOff: () => $t("Switching off…", async () => {
      await (s == null ? void 0 : s.request("listening.stop")), L(!1), O("Switched off. Music plays free until you switch it back on.");
    }),
    lock: () => $t("Locking…", async () => {
      await (s == null ? void 0 : s.request("listening.lock")), o = void 0, O("Locked. The listening key has been forgotten.");
    }),
    returnFunds: (M) => $t("Review the return in the listening wallet…", async () => {
      if (!(i != null && i.address) || !i.linked) throw new Error("Link your main wallet first.");
      if (N().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: T, nonce: V } = await t.chain.account(i.address);
      o = T;
      const R = await s.request("listening.prepareReturn", { mode: M, balance: T.toString(), nonce: V.toString(), fee: y6.toString() });
      if (R.recipient !== i.linked) throw new Error("Return destination does not match your linked main wallet. Nothing was sent.");
      const Bt = Au(R.raw);
      if (bn(Bt.payload.recipient).value !== i.linked || String(Bt.payload.amount) !== R.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const Tt = {
        id: P6(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: R.recipient,
        amount: R.amount,
        fee: R.fee,
        nonce: V.toString(),
        created: t.now(),
        status: "signed",
        raw: R.raw,
        txid: R.txid
      };
      t.validate(Tt), $(Tt);
      try {
        await t.chain.broadcast(R.raw, R.txid), $({ ...Tt, status: "pending" });
      } catch (ee) {
        throw $({ ...Tt, status: "unknown", note: ee.message }), ee;
      }
      M === "all" && L(!1), O(M === "all" ? "Return sent to your main wallet. Paying is switched off; switch it back on after adding funds." : "Excess sent to your main wallet. Switch paying back on to continue.");
    })
  };
  async function ge(M) {
    if (!(l || c)) {
      l = !0;
      try {
        if (await ot(), j() !== "ready" || !C() || !(i != null && i.session) || i.session.playsLeft < 1 || !_ || N().length) return;
        U || (await t.chain.verify(), U = !0);
        const V = i.address, { balance: R, nonce: Bt } = await t.chain.account(V);
        o = R, a = t.now();
        const Tt = await t.chain.owner(aa, M.song);
        if (Tt === V || Tt === t.main()) return;
        const ee = await s.request("listening.signPlay", {
          core: aa,
          song: M.song,
          receipt: M.id,
          fee: b().toString(),
          nonce: Bt.toString(),
          balance: R.toString()
        }), dr = {
          id: M.id,
          address: V,
          kind: "play",
          core: aa,
          song: M.song,
          recipient: Tt,
          amount: "50",
          fee: b().toString(),
          nonce: Bt.toString(),
          created: t.now(),
          status: "signed",
          raw: ee.raw,
          txid: ee.txid,
          // Display only: the radio's title and artist for this song, kept with the public history.
          ...M.title ? { title: String(M.title).slice(0, 120) } : {},
          ...M.artist ? { artist: String(M.artist).slice(0, 120) } : {}
        };
        t.validate(dr), $(dr);
        const Ts = M.title ? `“${M.title}”${M.artist ? ` by ${M.artist}` : ""}` : `song #${M.song}`;
        try {
          await t.chain.broadcast(ee.raw, ee.txid), $({ ...dr, status: "pending" }), f = `Paid play sent for ${Ts}.`, u = "";
        } catch (vn) {
          $({ ...dr, status: ca(vn) ? "failed" : "unknown", note: vn.message, ...ca(vn) ? { raw: void 0 } : {} }), u = vn.message;
        }
        i = await s.request("listening.status");
      } catch (T) {
        f = "This song played free: " + (T instanceof Error ? T.message : "payment unavailable");
      } finally {
        l = !1, t.changed();
      }
    }
  }
  return { snapshot: K, refresh: ot, onListened: ge, ...It };
}
const pc = ["Radio address", "Connect wallet", "Access", "Passkey wallet", "Link", "Add funds", "Switch on", "First paid play"];
function O6(t) {
  const e = pc.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Stage ${r + 1} of ${e} · ${s}` });
  switch (t.step) {
    case "off":
    case "loading":
      return null;
    case "elsewhere":
      return n(0, "open the pay-per-play radio address");
    case "connect":
      return n(1, "connect your main Stacks wallet above");
    case "not-invited":
      return n(2, "this wallet is not in the canary yet", !0);
    case "unsupported":
      return n(3, "this browser cannot make a passkey wallet", !0);
    case "intro":
      return n(3, "create your passkey listening wallet");
    case "locked":
      return n(3, "unlock your passkey listening wallet");
    case "link":
      return n(4, "link the listening wallet to your main wallet");
    case "fund":
      return n(5, "add up to 1 STX to the listening wallet");
    case "over":
      return n(5, "over 1 STX: return the excess to keep paying", !0);
    case "ready": {
      if (!t.payingOn || !t.session || t.session.playsLeft < 1) return n(6, "switch paying on");
      const r = t.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(e, "All stages done · paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(7, "first paid play sent, confirming on-chain") : n(7, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
const ih = document.getElementById("ppp");
ih && j6(ih);
function j6(t) {
  const e = h1(), n = (p) => t.querySelector(p), r = n(".ppp-frame");
  let s = null;
  const i = async (p, $) => {
    const C = await fetch(p, { cache: "no-store", ...$, signal: AbortSignal.timeout(15e3) }), L = await C.json().catch(() => ({}));
    if (!C.ok) throw new Error((L == null ? void 0 : L.error) || `Request failed (${C.status}).`);
    return L;
  }, o = D6({
    now: Date.now,
    main: () => {
      const p = e.load();
      return p.isConnected && p.network === "mainnet" ? p.address : void 0;
    },
    config: (p) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(p || "")),
    links: async (p) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(p))).links ?? [],
    saveLink: async (p) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(p) });
    },
    bridge: async (p) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${p}; publickey-credentials-create ${p}`), s.referrerPolicy = "no-referrer";
      const $ = new Promise((y, A) => {
        s.addEventListener("load", () => y(), { once: !0 }), setTimeout(() => A(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = p + "/", r.replaceChildren(s), await $;
      const C = new r1({ walletOrigin: p, frame: s, timeoutMs: 30 * 6e4 }), L = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), N = (y, A) => L.has(y) ? C.request(y, A) : Promise.race([
        C.request(y, A),
        new Promise((k, j) => setTimeout(() => j(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await N("listening.status"), { request: N };
    },
    chain: {
      verify: I6,
      balance: L6,
      account: v6,
      owner: B6,
      broadcast: C6,
      transaction: M6,
      confirmedNonce: async (p) => {
        const $ = await Rr(`/v2/accounts/${p}?proof=0`);
        if (!Number.isSafeInteger($ == null ? void 0 : $.nonce) || $.nonce < 0) throw new Error("Malformed account data.");
        return BigInt($.nonce);
      }
    },
    signWithMain: (p, $) => g6({ ...$, network: "mainnet", stxAddress: p }),
    deposit: (p, $, C) => new Promise((L, N) => l6({
      recipient: $,
      amount: C.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: p,
      network: new ah(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (y) => L(y.txId || ""),
      onCancel: () => N(new Error("Deposit cancelled. Nothing was sent.")),
      onError: N
    })),
    validate: U6,
    tabLock: (p) => new Promise(($) => {
      const C = navigator.locks;
      if (!(C != null && C.request)) {
        $(!0);
        return;
      }
      C.request("xtrata-ppp:" + p, { ifAvailable: !0 }, async (L) => {
        $(!!L), L && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (p) => {
        try {
          return localStorage.getItem(p);
        } catch {
          return null;
        }
      },
      set: (p, $) => {
        try {
          localStorage.setItem(p, $);
        } catch {
        }
      }
    },
    changed: () => _(o.snapshot())
  }), a = (p) => p ? p.slice(0, 6) + "…" + p.slice(-4) : "", c = (p) => `https://explorer.hiro.so/txid/${p}?chain=mainnet`, l = (p, $ = "", C = "") => {
    const L = document.createElement(p);
    return $ && (L.textContent = $), C && (L.className = C), L;
  }, f = (p, $, C = "") => {
    const L = l("button", p, C);
    return L.type = "button", L.onclick = $, L;
  }, u = (p, $) => {
    const C = l("a", p);
    return C.href = $, C.target = "_blank", C.rel = "noopener", C;
  };
  let g = null;
  const h = (p) => p.title ? `“${p.title}”${p.artist ? ` — ${p.artist}` : ""}` : `Song #${p.song}`, w = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, x = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function E(p) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(p.step) ? ["", ""] : p.step === "over" ? ["OVER 1 STX", "bad"] : p.step === "locked" ? ["LOCKED", "mute"] : p.step === "intro" || p.step === "link" ? ["SETUP", "warn"] : p.step === "fund" ? p.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : p.payingOn && p.session && p.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function U(p, $, C = "", L) {
    const N = l("dt", p), y = l("dd", $, C);
    return L && y.append(" ", L), [N, y];
  }
  function _(p) {
    var st, It, ge, M;
    if (t.hidden = p.step === "off", t.hidden) return;
    n(".ppp-badge").hidden = !((st = p.gate) != null && st.canary);
    const [$, C] = E(p), L = n(".ppp-state");
    L.textContent = $, L.className = "ppp-state" + (C ? " ppp-state--" + C : ""), L.hidden = !$;
    const N = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(p.step);
    r.hidden = !N, n(".ppp-frame-label").hidden = !N, r.classList.toggle("ppp-frame--active", !!p.busy);
    const y = O6(p) ?? g;
    g = y;
    const A = n(".ppp-steps"), k = n(".ppp-stage");
    A.hidden = k.hidden = !y, y && (A.replaceChildren(...pc.map((T, V) => {
      const R = l("li", "", V < y.at ? "done" : V === y.at ? y.blocked ? "now blocked" : "now" : "");
      return R.append(l("span", V < y.at ? "✓" : String(V + 1), "n"), T), V === y.at && R.setAttribute("aria-current", "step"), R;
    })), k.textContent = y.caption, k.className = "ppp-stage " + (y.at >= pc.length ? "ppp-ok" : y.blocked ? "ppp-bad" : "ppp-cyan"));
    const j = n(".ppp-facts"), K = [];
    if (p.main && ((It = p.gate) != null && It.here) && K.push(...U("Your wallet", a(p.main), "ppp-addr-short")), p.listening) {
      const T = f("Copy", () => {
        var V;
        return void ((V = navigator.clipboard) == null ? void 0 : V.writeText(p.listening || ""));
      }, "tiny");
      K.push(...U("Listening wallet", a(p.listening), "ppp-addr-short", T));
    }
    if (p.listening && p.step !== "intro" && p.step !== "locked" && K.push(...p.linked ? U("Returns go to", a(p.linked), "ppp-addr-short") : U("Returns go to", "not linked yet", "ppp-warn")), p.balance !== void 0 && ["fund", "ready", "over"].includes(p.step)) {
      const T = p.balanceState === "ok" ? "ppp-ok" : p.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      K.push(...U("Balance", `${dn(p.balance)} STX · about ${p.playsLeft.toLocaleString()} plays`, T));
    }
    const O = p.entries.find((T) => T.kind === "play");
    O && K.push(...U("Last paid song", `${h(O)} → ${a(O.recipient)}`, w[O.status] || "")), j.replaceChildren(...K), j.hidden = !K.length;
    const $t = n(".ppp-body"), nt = [], gt = [], m = Io(BigInt(((ge = p.gate) == null ? void 0 : ge.limits.playFee) ?? "300")), B = `Each song you listen to for 30 seconds sends ${dn(fc)} STX to whoever holds it, plus a ${dn(m - fc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, ot = !!p.busy;
    switch (p.step) {
      case "elsewhere": {
        if (nt.push(l("p", "Pay artists a tiny amount for each song you listen to for 30 seconds, recorded on-chain. Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet.")), (M = p.gate) != null && M.radioUrl) {
          const T = l("p");
          T.append(u("Open the pay-per-play radio →", p.gate.radioUrl)), nt.push(T);
        }
        break;
      }
      case "connect":
        nt.push(l("p", "Pay artists a tiny amount for each song you listen to for 30 seconds, recorded on-chain. Connect your wallet above to turn it on. Listening is always free."));
        break;
      case "not-invited":
        nt.push(l("p", "Pay-per-play is in a small test right now. Listening is free for everyone, and it will open up soon.", "ppp-mute"));
        break;
      case "unsupported":
        nt.push(l("p", "This browser cannot create the passkey pay-per-play needs. Listening is free. Try Chrome or Safari on a current phone or computer.", "ppp-warn"));
        break;
      case "intro":
        nt.push(l("p", B)), nt.push(l("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), nt.push(l("p", "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), gt.push(f("Turn on pay-per-play", () => void o.create(), "primary")), gt.push(f("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        nt.push(l("p", p.payingOn ? "Unlock it with your passkey to keep paying as you listen." : "Paying is switched off. Unlock to manage your wallet.", p.payingOn ? "" : "ppp-mute")), gt.push(f(p.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary")), gt.push(f("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        nt.push(l("p", p.serverLinked ? `This listening wallet was linked to ${a(p.main)} on another device. Confirm it in the listening wallet below.` : `Link the listening wallet to your main wallet ${a(p.main)}. This is one signature, not a transaction: no fee, no spending permission. Afterwards, returns can only go back to this main wallet.`)), nt.push(l("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), gt.push(f(p.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        nt.push(l("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (p.entries.length ? nt.push(l("p", "Out of funds: songs play free until you top up. Paying carries on automatically once the top-up confirms.", "ppp-bad")) : p.payingOn && nt.push(l("p", "Paying is switched on. Add funds and it starts with the next song you listen to for 30 seconds.", "ppp-ok")), nt.push(l("p", `Add up to ${dn(p.allowance)} STX. 1 STX covers about ${Math.floor(Number(1000000n / m)).toLocaleString()} paid plays.`)), nt.push(l("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), p.depositPending && p.depositTxid) {
          const T = l("p", "Deposit sent, waiting for it to confirm. This page checks automatically. ", "ppp-warn");
          T.append(u("View", c(p.depositTxid))), nt.push(T);
        } else p.allowance > 0n && gt.push(f(`Deposit ${dn(p.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        nt.push(l("p", `This wallet holds more than the recommended 1 STX, so paid plays are paused. Return the excess or everything to your main wallet ${a(p.linked)}.`, "ppp-bad")), gt.push(f("Return excess", () => void o.returnFunds("excess"), "primary"), f("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        p.payingOn && p.session && p.session.playsLeft > 0 ? (nt.push(l("p", "Paying as you listen: each song pays its holder once you have heard 30 seconds of it. Skips stay free.", "ppp-ok")), gt.push(f("Switch off", () => void o.switchOff()))) : (nt.push(l("p", "Paying is switched off. Music plays free.", "ppp-mute")), gt.push(f("Switch on paying as I listen", () => void o.switchOn(), "primary"))), p.balanceState === "low" && nt.push(l("p", "Running low. Top up to keep paying artists.", "ppp-warn")), p.depositPending ? nt.push(l("p", "Top-up sent, waiting for it to confirm.", "ppp-warn")) : p.allowance > 0n && p.balanceState !== "ok" && gt.push(f(`Top up ${dn(p.allowance)} STX`, () => void o.deposit()));
        break;
    }
    p.stuck && (nt.push(l("p", p.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${p.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), gt.push(f("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(p.step) && p.linked && (p.balance ?? 0n) > 0n && gt.push(f("Return all to my wallet", () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(p.step) && gt.push(f("Lock", () => void o.lock(), "quiet")), gt.forEach((T) => T.disabled = ot), $t.replaceChildren(...nt), n(".ppp-actions").replaceChildren(...gt), n(".ppp-msg").textContent = p.busy || p.message, n(".ppp-err").textContent = p.error;
    const ct = n(".ppp-history");
    ct.hidden = !p.entries.length, ct.replaceChildren(l("summary", `Payments and returns (${p.entries.length})`), ...p.entries.slice(0, 20).map((T) => {
      const V = l("div", "", "ppp-row"), R = T.kind === "play" ? [l("span", h(T), "ppp-song"), l("span", ` · ${dn(BigInt(T.amount))} STX to ${a(T.recipient)}`, "ppp-mute")] : [l("span", `Returned ${dn(BigInt(T.amount))} STX`, "ppp-song"), l("span", ` to ${a(T.recipient)}`, "ppp-mute")];
      return V.append(
        l("span", x[T.status] || T.status, "ppp-status " + (w[T.status] || "")),
        ...R,
        l("span", ` · ${new Date(T.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), T.txid && V.append(u("tx ↗", c(T.txid))), V;
    }));
  }
  const b = /* @__PURE__ */ new Map(), I = () => {
    const p = window.XtrataRadio;
    return p != null && p.subscribe ? (p.subscribe(($) => {
      const C = $ == null ? void 0 : $.nowPlaying;
      C && Number.isSafeInteger(Number(C.tokenId)) && b.set(Number(C.tokenId), { title: C.title || void 0, artist: C.artist || void 0 });
    }), !0) : !1;
  };
  if (!I()) {
    const p = setInterval(() => {
      I() && clearInterval(p);
    }, 500);
    setTimeout(() => clearInterval(p), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (p) => {
    const $ = p.detail;
    $ && Number.isSafeInteger($.song) && typeof $.id == "string" && /^[0-9a-f]{32}$/.test($.id) && o.onListened({ song: $.song, id: $.id, ...b.get($.song) });
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const F6 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", z6 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, R6 = () => z6() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, G6 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, K6 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Mp = class {
  constructor(t) {
    P4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && rx(t), this.callback(uo(t));
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
    var r, s, i, o, a, c, l, f, u, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (l = t.googlePlayStoreUrl) !== null && l !== void 0 ? l : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (g = (u = this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = R6(), e = G6(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return q("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, q("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), q("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, q("div", { class: "flex flex-col space-y-[10px]" }, q("div", { class: "flex items-center" }, q("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), q("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, q("span", { class: "sr-only" }, "Close popup"), q("img", { src: F6 }))), r ? q("p", null, "Select the wallet you want to connect to.") : q("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && q("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && q("div", { class: "mt-6" }, q("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), q("ul", { class: "space-y-3" }, this.installedProviders.map((i) => q("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, q("div", { class: "aspect-square basis-9 overflow-hidden" }, q("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), q("div", { class: "flex-1" }, q("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && q("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), q("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && q("div", { class: "mt-6" }, r ? q("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : q("div", { class: "mb-5 flex justify-between" }, q("p", { class: "text-sm font-medium" }, "Recommended wallets"), q("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, q("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, q("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), q("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), q("p", null, "What is a wallet? ", q("span", { class: "align-text-bottom text-[9px]" }, "↗")))), q("ul", { class: "space-y-3" }, n.map((i) => q("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, q("div", { class: "aspect-square basis-9 overflow-hidden" }, q("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), q("div", { class: "flex-1" }, q("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && q("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && q("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return w4(this);
  }
};
Mp.style = K6;
const V6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Mp
}, Symbol.toStringTag, { value: "Module" }));
