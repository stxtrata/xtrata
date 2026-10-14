var Ay = Object.defineProperty;
var $y = (t, e, n) => e in t ? Ay(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var ei = (t, e, n) => $y(t, typeof e != "symbol" ? e + "" : e, n);
var me = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ih(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Yo(t) {
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
      typeof me < "u" && me || {}, r = {
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
            var D = m.shift();
            return { done: D === void 0, value: D };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function d(m) {
        this.map = {}, m instanceof d ? m.forEach(function(I, D) {
          this.append(D, I);
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
        var D = this.map[m];
        this.map[m] = D ? D + ", " + I : I;
      }, d.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, d.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, d.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, d.prototype.set = function(m, I) {
        this.map[a(m)] = c(I);
      }, d.prototype.forEach = function(m, I) {
        for (var D in this.map)
          this.map.hasOwnProperty(D) && m.call(I, this.map[D], D, this);
      }, d.prototype.keys = function() {
        var m = [];
        return this.forEach(function(I, D) {
          m.push(D);
        }), u(m);
      }, d.prototype.values = function() {
        var m = [];
        return this.forEach(function(I) {
          m.push(I);
        }), u(m);
      }, d.prototype.entries = function() {
        var m = [];
        return this.forEach(function(I, D) {
          m.push([D, I]);
        }), u(m);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function g(m) {
        return new Promise(function(I, D) {
          m.onload = function() {
            I(m.result);
          }, m.onerror = function() {
            D(m.error);
          };
        });
      }
      function h(m) {
        var I = new FileReader(), D = g(I);
        return I.readAsArrayBuffer(m), D;
      }
      function y(m) {
        var I = new FileReader(), D = g(I), R = /charset=([A-Za-z0-9_-]+)/.exec(m.type), tt = R ? R[1] : "utf-8";
        return I.readAsText(m, tt), D;
      }
      function w(m) {
        for (var I = new Uint8Array(m), D = new Array(I.length), R = 0; R < I.length; R++)
          D[R] = String.fromCharCode(I[R]);
        return D.join("");
      }
      function v(m) {
        if (m.slice)
          return m.slice(0);
        var I = new Uint8Array(m.byteLength);
        return I.set(new Uint8Array(m)), I.buffer;
      }
      function N() {
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
            return y(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(w(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then($);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var _ = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function b(m) {
        var I = m.toUpperCase();
        return _.indexOf(I) > -1 ? I : m;
      }
      function k(m, I) {
        if (!(this instanceof k))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var D = I.body;
        if (m instanceof k) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, I.headers || (this.headers = new d(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !D && m._bodyInit != null && (D = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new d(I.headers)), this.method = b(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var F = new AbortController();
            return F.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && D)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(D), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var R = /([?&])_=[^&]*/;
          if (R.test(this.url))
            this.url = this.url.replace(R, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var tt = /\?/;
            this.url += (tt.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      k.prototype.clone = function() {
        return new k(this, { body: this._bodyInit });
      };
      function $(m) {
        var I = new FormData();
        return m.trim().split("&").forEach(function(D) {
          if (D) {
            var R = D.split("="), tt = R.shift().replace(/\+/g, " "), F = R.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(tt), decodeURIComponent(F));
          }
        }), I;
      }
      function O(m) {
        var I = new d(), D = m.replace(/\r?\n[\t ]+/g, " ");
        return D.split("\r").map(function(R) {
          return R.indexOf(`
`) === 0 ? R.substr(1, R.length) : R;
        }).forEach(function(R) {
          var tt = R.split(":"), F = tt.shift().trim();
          if (F) {
            var re = tt.join(":").trim();
            try {
              I.append(F, re);
            } catch (ue) {
              console.warn("Response " + ue.message);
            }
          }
        }), I;
      }
      N.call(k.prototype);
      function q(m, I) {
        if (!(this instanceof q))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new d(I.headers), this.url = I.url || "", this._initBody(m);
      }
      N.call(q.prototype), q.prototype.clone = function() {
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
      var H = [301, 302, 303, 307, 308];
      q.redirect = function(m, I) {
        if (H.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new q(null, { status: I, headers: { location: m } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(I, D) {
          this.message = I, this.name = D;
          var R = Error(I);
          this.stack = R.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function K(m, I) {
        return new Promise(function(D, R) {
          var tt = new k(m, I);
          if (tt.signal && tt.signal.aborted)
            return R(new e.DOMException("Aborted", "AbortError"));
          var F = new XMLHttpRequest();
          function re() {
            F.abort();
          }
          F.onload = function() {
            var S = {
              statusText: F.statusText,
              headers: O(F.getAllResponseHeaders() || "")
            };
            tt.url.indexOf("file://") === 0 && (F.status < 200 || F.status > 599) ? S.status = 200 : S.status = F.status, S.url = "responseURL" in F ? F.responseURL : S.headers.get("X-Request-URL");
            var C = "response" in F ? F.response : F.responseText;
            setTimeout(function() {
              D(new q(C, S));
            }, 0);
          }, F.onerror = function() {
            setTimeout(function() {
              R(new TypeError("Network request failed"));
            }, 0);
          }, F.ontimeout = function() {
            setTimeout(function() {
              R(new TypeError("Network request timed out"));
            }, 0);
          }, F.onabort = function() {
            setTimeout(function() {
              R(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ue(S) {
            try {
              return S === "" && n.location.href ? n.location.href : S;
            } catch {
              return S;
            }
          }
          if (F.open(tt.method, ue(tt.url), !0), tt.credentials === "include" ? F.withCredentials = !0 : tt.credentials === "omit" && (F.withCredentials = !1), "responseType" in F && (r.blob ? F.responseType = "blob" : r.arrayBuffer && (F.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof d || n.Headers && I.headers instanceof n.Headers)) {
            var Xt = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(S) {
              Xt.push(a(S)), F.setRequestHeader(S, c(I.headers[S]));
            }), tt.headers.forEach(function(S, C) {
              Xt.indexOf(C) === -1 && F.setRequestHeader(C, S);
            });
          } else
            tt.headers.forEach(function(S, C) {
              F.setRequestHeader(C, S);
            });
          tt.signal && (tt.signal.addEventListener("abort", re), F.onreadystatechange = function() {
            F.readyState === 4 && tt.signal.removeEventListener("abort", re);
          }), F.send(typeof tt._bodyInit > "u" ? null : tt._bodyInit);
        });
      }
      return K.polyfill = !0, n.fetch || (n.fetch = K, n.Headers = d, n.Request = k, n.Response = q), e.Headers = d, e.Request = k, e.Response = q, e.fetch = K, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : me);
})();
const vy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Iy(t, e) {
  const n = {};
  return Object.assign(n, vy, e), await fetch(t, n);
}
function Ly(t) {
  let e = Iy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ky(...t) {
  const { fetchLib: e, middlewares: n } = Ly(t);
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
var Bu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Bu || (Bu = {}));
const Cy = "https://api.mainnet.hiro.so", By = "https://api.testnet.hiro.so", Ty = "http://localhost:3999", My = ["mainnet", "testnet", "devnet", "mocknet"];
let ks = class {
  constructor(e) {
    this.version = Hr.Mainnet, this.chainId = Ls.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Hr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ky();
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
      return new rc();
    case "testnet":
      return new _y();
    case "devnet":
      return new Ny();
    case "mocknet":
      return new oh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${My.join(", ")}`);
  }
};
ks.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ks.fromName(t);
let rc = class extends ks {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Cy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Hr.Mainnet, this.chainId = Ls.Mainnet;
  }
}, _y = class extends ks {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? By,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Hr.Testnet, this.chainId = Ls.Testnet;
  }
}, oh = class extends ks {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ty,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Hr.Testnet, this.chainId = Ls.Testnet;
  }
};
const Ny = oh, ah = "xtrata.wallet.bridge.v1", Uy = (t) => typeof t == "object" && t !== null && t.protocol === ah, Hy = (t) => Uy(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Py = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class ni extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Tu = 12e4;
class Oy {
  constructor(e) {
    ei(this, "pending", /* @__PURE__ */ new Map());
    ei(this, "listenTarget");
    ei(this, "closed", !1);
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
    ei(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Hy(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new ni("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new ni("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ni("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Py(), i = { protocol: ah, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ni(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Tu}ms.`
          )
        );
      }, this.options.timeoutMs ?? Tu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new ni("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Dy = ["SP", "SM"], Fy = ["ST", "SN"], jy = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Dy.includes(n) ? "mainnet" : Fy.includes(n) ? "testnet" : null;
}, zy = () => {
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
}, Ry = () => typeof window > "u" || !window.localStorage ? zy() : window.localStorage, Ta = "xtrata.v15.1.wallet.session", Mu = "mainnet", vo = { isConnected: !1 }, Gy = (t) => t.address ? jy(t.address) ?? t.network : t.network, ch = (t) => !t.isConnected || !t.address ? { ...vo } : Gy(t) !== Mu ? { ...vo } : {
  isConnected: !0,
  address: t.address,
  network: Mu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Ky = (t) => {
  if (!t)
    return { ...vo };
  try {
    const e = JSON.parse(t);
    return ch(e);
  } catch {
    return { ...vo };
  }
}, Vy = (t) => {
  const e = ch(t);
  return JSON.stringify(e);
}, qy = (t) => {
  const e = Ry();
  return {
    load: () => Ky(e.getItem(Ta)),
    save: (n) => {
      e.setItem(Ta, Vy(n));
    },
    clear: () => {
      e.removeItem(Ta);
    }
  };
}, Wy = "https://browser.blockstack.org/auth", Xy = {
  "@type": "Person",
  "@context": "http://schema.org"
}, lh = ["store_write"], Yy = "blockstack-session", Zy = {
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
class Qy extends qs {
  constructor(e, n = "") {
    super({ code: Jr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class _u extends qs {
  constructor(e = "") {
    super({ code: Jr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ji extends qs {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Jr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Nu extends qs {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Jr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class sc extends qs {
  constructor(e) {
    super({ code: Jr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class uh extends qs {
  constructor(e) {
    super({ code: Jr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Uu = ["debug", "info", "warn", "error", "none"], ic = {};
for (let t = 0; t < Uu.length; t++) {
  const e = Uu[t];
  ic[e] = t;
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
    return ic[Zy.logLevel] <= ic[e];
  }
}
function Jy() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function tw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Ma(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function ew() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function nw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function rw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function ll(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = nw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    xs.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = rw(s, t.toString(), n);
    throw xs.error(i), new Error(i);
  }
  if (r)
    return {};
}
function wr(t, e) {
  return ul(de(t), e);
}
function de(t) {
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
  if (ve(t, Uint8Array))
    return BigInt(`0x${J(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function sw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Hu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ki(t, e = 8) {
  return (typeof t == "bigint" ? t : de(t)).toString(16).padStart(e * 2, "0");
}
function Zo(t) {
  return parseInt(t, 16);
}
function ul(t, e = 16) {
  const n = ki(t, e);
  return At(n);
}
function iw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function ow(t, e) {
  return t & BigInt(1) << e;
}
function oc(t) {
  return aw(BigInt(`0x${J(t)}`), BigInt(t.byteLength * 8));
}
function aw(t, e) {
  return ow(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const cw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function J(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += cw[n];
  return e;
}
function At(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = sw(t), t = t.length % 2 ? `0${t}` : t;
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
function Ci(t) {
  return new TextDecoder().decode(t);
}
function lw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function uw(t) {
  return String.fromCharCode.apply(null, t);
}
function fw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Pu(t) {
  if (t.some(fw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function hn(...t) {
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
function Jt(t) {
  return hn(...t.map((e) => typeof e == "number" ? Pu([e]) : e instanceof Array ? Pu(e) : e));
}
function ve(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const fh = "https://api.mainnet.hiro.so", dh = "https://api.testnet.hiro.so", hh = "http://localhost:3999", dw = "https://hub.blockstack.org", hw = 33, _a = 32;
function pw(t) {
  if (t.length < _a * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + _a * 2), r = t.slice(2 + _a * 2);
  return {
    recoveryId: Zo(e),
    r: n,
    s: r
  };
}
function fl(t) {
  const e = typeof t == "string" ? At(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function gw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function yw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function ww(t, e) {
  return t[e];
}
function bw(t, e, n = 0) {
  return t[n] = e, t;
}
function mw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Pr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const xw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Sw(t, e) {
  const n = {};
  return Object.assign(n, xw, e), await fetch(t, n);
}
function Ew(t) {
  let e = Sw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Aw(...t) {
  const { fetchLib: e, middlewares: n } = Ew(t);
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
class ph {
  constructor(e = lh.slice(), n = ((a) => (a = ll("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Wy) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ac(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function $w(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function gh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function vw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ac(t.outputLen), ac(t.blockLen);
}
function Iw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Lw(t, e) {
  gh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Lr = {
  number: ac,
  bool: $w,
  bytes: gh,
  hash: vw,
  exists: Iw,
  output: Lw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Na = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), nn = (t, e) => t << 32 - e | t >>> e, kw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!kw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Cw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function dl(t) {
  if (typeof t == "string" && (t = Cw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let yh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function es(t) {
  const e = (r) => t().update(dl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let wh = class extends yh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Lr.hash(e);
    const r = dl(n);
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
const Qo = (t, e, n) => new wh(t, e).update(n).digest();
Qo.create = (t, e) => new wh(t, e);
function Bw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let hl = class extends yh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Na(this.buffer);
  }
  update(e) {
    Lr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = dl(e);
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
    Lr.exists(this), Lr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Bw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const Tw = (t, e, n) => t & e ^ ~t & n, Mw = (t, e, n) => t & e ^ t & n ^ e & n, _w = new Uint32Array([
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
let bh = class extends hl {
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
      const g = jn[l - 15], h = jn[l - 2], y = nn(g, 7) ^ nn(g, 18) ^ g >>> 3, w = nn(h, 17) ^ nn(h, 19) ^ h >>> 10;
      jn[l] = w + jn[l - 7] + y + jn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = nn(a, 6) ^ nn(a, 11) ^ nn(a, 25), h = d + g + Tw(a, c, u) + _w[l] + jn[l] | 0, w = (nn(r, 2) ^ nn(r, 13) ^ nn(r, 22)) + Mw(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    jn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Nw = class extends bh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Cs = es(() => new bh());
es(() => new Nw());
const Uw = {}, mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Uw
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Et = BigInt(0), Ot = BigInt(1), dr = BigInt(2), ai = BigInt(3), Ou = BigInt(8), Lt = Object.freeze({
  a: Et,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Ot,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Du = (t, e) => (t + e / dr) / e, zi = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Lt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Ot * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Du(i * t, e), c = Du(-r * t, e);
    let u = j(t - a * n - c * s, e), d = j(-a * r - c * i, e);
    const l = u > o, g = d > o;
    if (l && (u = e - u), g && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: d };
  }
}, Qe = 32, Or = 32, xh = 32, Io = Qe + 1, Lo = 2 * Qe + 1;
function Fu(t) {
  const { a: e, b: n } = Lt, r = j(t * t), s = j(r * t);
  return j(s + e * t + n);
}
const Ri = Lt.a === Et;
class pl extends Error {
  constructor(e) {
    super(e);
  }
}
function ju(t) {
  if (!(t instanceof $t))
    throw new TypeError("JacobianPoint expected");
}
class $t {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof gt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(gt.ZERO) ? $t.ZERO : new $t(e.x, e.y, Ot);
  }
  static toAffineBatch(e) {
    const n = Fw(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return $t.toAffineBatch(e).map($t.fromAffine);
  }
  equals(e) {
    ju(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = j(s * s), u = j(a * a), d = j(n * u), l = j(i * c), g = j(j(r * a) * u), h = j(j(o * s) * c);
    return d === l && g === h;
  }
  negate() {
    return new $t(this.x, j(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = j(e * e), i = j(n * n), o = j(i * i), a = e + i, c = j(dr * (j(a * a) - s - o)), u = j(ai * s), d = j(u * u), l = j(d - dr * c), g = j(u * (c - l) - Ou * o), h = j(dr * n * r);
    return new $t(l, g, h);
  }
  add(e) {
    ju(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Et || o === Et)
      return this;
    if (n === Et || r === Et)
      return e;
    const c = j(s * s), u = j(a * a), d = j(n * u), l = j(i * c), g = j(j(r * a) * u), h = j(j(o * s) * c), y = j(l - d), w = j(h - g);
    if (y === Et)
      return w === Et ? this.double() : $t.ZERO;
    const v = j(y * y), N = j(y * v), _ = j(d * v), b = j(w * w - N - dr * _), k = j(w * (_ - b) - g * N), $ = j(s * a * y);
    return new $t(b, k, $);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = $t.ZERO;
    if (typeof e == "bigint" && e === Et)
      return n;
    let r = Gu(e);
    if (r === Ot)
      return this;
    if (!Ri) {
      let l = n, g = this;
      for (; r > Et; )
        r & Ot && (l = l.add(g)), g = g.double(), r >>= Ot;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = zi.splitScalar(r), c = n, u = n, d = this;
    for (; i > Et || a > Et; )
      i & Ot && (c = c.add(d)), a & Ot && (u = u.add(d)), d = d.double(), i >>= Ot, a >>= Ot;
    return s && (c = c.negate()), o && (u = u.negate()), u = new $t(j(u.x * zi.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Ri ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals($t.BASE) && (n = gt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && cc.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = $t.normalizeZ(s), cc.set(n, s)));
    let i = $t.ZERO, o = $t.BASE;
    const a = 1 + (Ri ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let y = Number(e & u);
      e >>= l, y > c && (y -= d, e += Ot);
      const w = h, v = h + Math.abs(y) - 1, N = g % 2 !== 0, _ = y < 0;
      y === 0 ? o = o.add(Gi(N, s[w])) : i = i.add(Gi(_, s[v]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Gu(e), s, i;
    if (Ri) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = zi.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(u, n);
      d = Gi(o, d), g = Gi(c, g), g = new $t(j(g.x * zi.beta), g.y, g.z), s = d.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return $t.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals($t.ZERO);
    e == null && (e = i ? Ou : Ws(s));
    const o = e, a = j(o * o), c = j(a * o), u = j(n * a), d = j(r * c), l = j(s * o);
    if (i)
      return gt.ZERO;
    if (l !== Ot)
      throw new Error("invZ was invalid");
    return new gt(u, d);
  }
}
$t.BASE = new $t(Lt.Gx, Lt.Gy, Ot);
$t.ZERO = new $t(Et, Ot, Et);
function Gi(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const cc = /* @__PURE__ */ new WeakMap();
class gt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, cc.delete(this);
  }
  hasEvenY() {
    return this.y % dr === Et;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Ue(n ? e : e.subarray(1));
    if (!wo(r))
      throw new Error("Point is not on curve");
    const s = Fu(r);
    let i = Dw(s);
    const o = (i & Ot) === Ot;
    n ? o && (i = j(-i)) : (e[0] & 1) === 1 !== o && (i = j(-i));
    const a = new gt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Ue(e.subarray(1, Qe + 1)), r = Ue(e.subarray(Qe + 1, Qe * 2 + 1)), s = new gt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = pn(e), r = n.length, s = n[0];
    if (r === Qe)
      return this.fromCompressedHex(n);
    if (r === Io && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Lo && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Io} compressed bytes or ${Lo} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return gt.BASE.multiply(Dr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Ah(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = gl(pn(e)), { n: a } = Lt, c = r === 2 || r === 3 ? s + a : s, u = Ws(c, a), d = j(-o * u, a), l = j(i * u, a), g = r & 1 ? "03" : "02", h = gt.fromHex(g + pr(c)), y = gt.BASE.multiplyAndAddUnsafe(h, d, l);
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
    if (!wo(n) || !wo(r))
      throw new Error(e);
    const s = j(r * r), i = Fu(n);
    if (j(s - i) !== Et)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new gt(this.x, j(-this.y));
  }
  double() {
    return $t.fromAffine(this).double().toAffine();
  }
  add(e) {
    return $t.fromAffine(this).add($t.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return $t.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = $t.fromAffine(this), i = n === Et || n === Ot || this !== gt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = $t.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals($t.ZERO) ? void 0 : a.toAffine();
  }
}
gt.BASE = new gt(Lt.Gx, Lt.Gy);
gt.ZERO = new gt(Et, Et);
function zu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Ru(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Bs(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Ue(n), left: t.subarray(e + 2) };
}
function Hw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Bs(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Ru(t.subarray(2)), { data: r, left: s } = Ru(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Bs(s)}`);
  return { r: e, s: r };
}
class Ne {
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
    return new Ne(ko(s.slice(0, 64)), ko(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Hw(n ? e : gr(e));
    return new Ne(r, s);
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
    const e = Lt.n >> Ot;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Ne(this.r, j(-this.s, Lt.n)) : this;
  }
  toDERRawBytes() {
    return gr(this.toDERHex());
  }
  toDERHex() {
    const e = zu(ri(this.s)), n = zu(ri(this.r)), r = e.length / 2, s = n.length / 2, i = ri(r), o = ri(s);
    return `30${ri(s + r + 4)}02${o}${n}02${i}${e}`;
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
const Pw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Bs(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Pw[t[n]];
  return e;
}
const Ow = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function pr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Et <= t && t < Ow))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ts(t) {
  const e = gr(pr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ri(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ko(t) {
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
function Ue(t) {
  return ko(Bs(t));
}
function pn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : gr(t);
}
function Gu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ms(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function j(t, e = Lt.P) {
  const n = t % e;
  return n >= Et ? n : e + n;
}
function De(t, e) {
  const { P: n } = Lt;
  let r = t;
  for (; e-- > Et; )
    r *= r, r %= n;
  return r;
}
function Dw(t) {
  const { P: e } = Lt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = De(u, ai) * u % e, l = De(d, ai) * u % e, g = De(l, dr) * c % e, h = De(g, r) * g % e, y = De(h, s) * h % e, w = De(y, o) * y % e, v = De(w, a) * w % e, N = De(v, o) * y % e, _ = De(N, ai) * u % e, b = De(_, i) * h % e, k = De(b, n) * c % e, $ = De(k, dr);
  if ($ * $ % e !== t)
    throw new Error("Cannot find square root");
  return $;
}
function Ws(t, e = Lt.P) {
  if (t === Et || e <= Et)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = j(t, e), r = e, s = Et, i = Ot;
  for (; n !== Et; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== Ot)
    throw new Error("invert: does not exist");
  return j(s, e);
}
function Fw(t, e = Lt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Et ? i : (n[a] = i, j(i * o, e)), Ot), s = Ws(r, e);
  return t.reduceRight((i, o, a) => o === Et ? i : (n[a] = j(i * n[a], e), j(i * o, e)), s), n;
}
function jw(t) {
  const e = t.length * 8 - Or * 8, n = Ue(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function gl(t, e = !1) {
  const n = jw(t);
  if (e)
    return n;
  const { n: r } = Lt;
  return n >= r ? n - r : n;
}
let vs, ci;
class Sh {
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
    return ci(this.k, ...e);
  }
  checkSync() {
    if (typeof ci != "function")
      throw new pl("hmacSha256Sync needs to be set");
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
  return Et < t && t < Lt.n;
}
function wo(t) {
  return Et < t && t < Lt.P;
}
function Eh(t, e, n, r = !0) {
  const { n: s } = Lt, i = gl(t, !0);
  if (!Ms(i))
    return;
  const o = Ws(i, s), a = gt.BASE.multiply(i), c = j(a.x, s);
  if (c === Et)
    return;
  const u = j(o * j(e + n * c, s), s);
  if (u === Et)
    return;
  let d = new Ne(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & Ot);
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
    e = ko(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Or)
      throw new Error("Expected 32 bytes of private key");
    e = Ue(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ms(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function yl(t) {
  return t instanceof gt ? (t.assertValidity(), t) : gt.fromHex(t);
}
function Ah(t) {
  if (t instanceof Ne)
    return t.assertValidity(), t;
  try {
    return Ne.fromDER(t);
  } catch {
    return Ne.fromCompact(t);
  }
}
function Bi(t, e = !1) {
  return gt.fromPrivateKey(t).toRawBytes(e);
}
function zw(t, e, n, r = !1) {
  return gt.fromSignature(t, e, n).toRawBytes(r);
}
function Ku(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Io || r === Lo : n ? r === Io * 2 || r === Lo * 2 : t instanceof gt;
}
function wl(t, e, n = !1) {
  if (Ku(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Ku(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = yl(e);
  return r.assertValidity(), r.multiply(Dr(t)).toRawBytes(n);
}
function $h(t) {
  const e = t.length > Qe ? t.slice(0, Qe) : t;
  return Ue(e);
}
function Rw(t) {
  const e = $h(t), n = j(e, Lt.n);
  return vh(n < Et ? e : n);
}
function vh(t) {
  return Ts(t);
}
function Ih(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = pn(t), s = Dr(e), i = [vh(s), Rw(r)];
  if (n != null) {
    n === !0 && (n = Wt.randomBytes(Qe));
    const c = pn(n);
    if (c.length !== Qe)
      throw new Error(`sign: Expected ${Qe} bytes of extra data`);
    i.push(c);
  }
  const o = ur(...i), a = $h(r);
  return { seed: o, m: a, d: s };
}
function Lh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Gw(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Ih(t, e, n.extraEntropy), o = new Sh(xh, Or);
  await o.reseed(r);
  let a;
  for (; !(a = Eh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Lh(a, n);
}
function Jo(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Ih(t, e, n.extraEntropy), o = new Sh(xh, Or);
  o.reseedSync(r);
  let a;
  for (; !(a = Eh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Lh(a, n);
}
const Kw = { strict: !0 };
function Vw(t, e, n, r = Kw) {
  let s;
  try {
    s = Ah(t), e = pn(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = gl(e);
  let c;
  try {
    c = yl(n);
  } catch {
    return !1;
  }
  const { n: u } = Lt, d = Ws(o, u), l = j(a * d, u), g = j(i * d, u), h = gt.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? j(h.x, u) === i : !1;
}
function Co(t) {
  return j(Ue(t), Lt.n);
}
class _s {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = pn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Ue(n.subarray(0, 32)), s = Ue(n.subarray(32, 64));
    return new _s(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!wo(e) || !Ms(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return pr(this.r) + pr(this.s);
  }
  toRawBytes() {
    return gr(this.toHex());
  }
}
function qw(t) {
  return gt.fromPrivateKey(t).toRawX();
}
class kh {
  constructor(e, n, r = Wt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = pn(e);
    const { x: s, scalar: i } = this.getScalar(Dr(n));
    if (this.px = s, this.d = i, this.rand = pn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = gt.fromPrivateKey(e), r = n.hasEvenY() ? e : Lt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ts(e ^ Ue(n));
  }
  finalizeNonce(e) {
    const n = j(Ue(e), Lt.n);
    if (n === Et)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new _s(e.x, j(n + r * s, Lt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Wt.taggedHash, o = this.initNonce(n, await i(lr.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(lr.nonce, o, r, e)), d = Co(await i(lr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await Th(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Wt.taggedHashSync, o = this.initNonce(n, i(lr.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(lr.nonce, o, r, e)), d = Co(i(lr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return Mh(l, e, r) || this.error(), l;
  }
}
async function Ww(t, e, n) {
  return new kh(t, e, n).calc();
}
function Xw(t, e, n) {
  return new kh(t, e, n).calcSync();
}
function Ch(t, e, n) {
  const r = t instanceof _s, s = r ? t : _s.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: pn(e),
    P: yl(n)
  };
}
function Bh(t, e, n, r) {
  const s = gt.BASE.multiplyAndAddUnsafe(e, Dr(n), j(-r, Lt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Th(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Ch(t, e, n), a = Co(await Wt.taggedHash(lr.challenge, Ts(r), o.toRawX(), i));
    return Bh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Mh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Ch(t, e, n), a = Co(Wt.taggedHashSync(lr.challenge, Ts(r), o.toRawX(), i));
    return Bh(r, o, s, a);
  } catch (r) {
    if (r instanceof pl)
      throw r;
    return !1;
  }
}
const Yw = {
  Signature: _s,
  getPublicKey: qw,
  sign: Ww,
  verify: Th,
  signSync: Xw,
  verifySync: Mh
};
gt.BASE._setWindowSize(8);
const Ce = {
  node: mh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, lr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ki = {}, Wt = {
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
    t = pn(t);
    const e = Or + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = j(Ue(t), Lt.n - Ot) + Ot;
    return Ts(n);
  },
  randomBytes: (t = 32) => {
    if (Ce.web)
      return Ce.web.getRandomValues(new Uint8Array(t));
    if (Ce.node) {
      const { randomBytes: e } = Ce.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Wt.hashToPrivateKey(Wt.randomBytes(Or + 8)),
  precompute(t = 8, e = gt.BASE) {
    const n = e === gt.BASE ? e : new gt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(ai), n;
  },
  sha256: async (...t) => {
    if (Ce.web) {
      const e = await Ce.web.subtle.digest("SHA-256", ur(...t));
      return new Uint8Array(e);
    } else if (Ce.node) {
      const { createHash: e } = Ce.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Ce.web) {
      const n = await Ce.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ur(...e), s = await Ce.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Ce.node) {
      const { createHmac: n } = Ce.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ki[t];
    if (n === void 0) {
      const r = await Wt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ur(r, r), Ki[t] = n;
    }
    return Wt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof vs != "function")
      throw new pl("sha256Sync is undefined, you need to set it");
    let n = Ki[t];
    if (n === void 0) {
      const r = vs(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ur(r, r), Ki[t] = n;
    }
    return vs(n, ...e);
  },
  _JacobianPoint: $t
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
      return ci;
    },
    set(t) {
      ci || (ci = t);
    }
  }
});
const Zw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Lt,
  Point: gt,
  Signature: Ne,
  getPublicKey: Bi,
  getSharedSecret: wl,
  recoverPublicKey: zw,
  schnorr: Yw,
  sign: Gw,
  signSync: Jo,
  utils: Wt,
  verify: Vw
}, Symbol.toStringTag, { value: "Module" }));
var Ti = {};
Ti.byteLength = nb;
var Qw = Ti.toByteArray = sb, Jw = Ti.fromByteArray = ab, cn = [], je = [], tb = typeof Uint8Array < "u" ? Uint8Array : Array, Ua = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ps = 0, eb = Ua.length; ps < eb; ++ps)
  cn[ps] = Ua[ps], je[Ua.charCodeAt(ps)] = ps;
je[45] = 62;
je[95] = 63;
function _h(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function nb(t) {
  var e = _h(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function rb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function sb(t) {
  var e, n = _h(t), r = n[0], s = n[1], i = new tb(rb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = je[t.charCodeAt(c)] << 18 | je[t.charCodeAt(c + 1)] << 12 | je[t.charCodeAt(c + 2)] << 6 | je[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = je[t.charCodeAt(c)] << 2 | je[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = je[t.charCodeAt(c)] << 10 | je[t.charCodeAt(c + 1)] << 4 | je[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function ib(t) {
  return cn[t >> 18 & 63] + cn[t >> 12 & 63] + cn[t >> 6 & 63] + cn[t & 63];
}
function ob(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(ib(r));
  return s.join("");
}
function ab(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(ob(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    cn[e >> 2] + cn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    cn[e >> 10] + cn[e >> 4 & 63] + cn[e << 2 & 63] + "="
  )), s.join("");
}
function cb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const lb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function ub() {
  if (cb())
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
    throw new Error(lb);
  }
}
class fb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(hn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(hn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class db {
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
async function Nh() {
  const t = await ub();
  return t.name === "subtleCrypto" ? new db(t.lib) : new fb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function hb(t) {
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
    for (var y = 0, w = 0, v = 0, N = h.length; v !== N && h[v] === 0; )
      v++, y++;
    for (var _ = (N - v) * u + 1 >>> 0, b = new Uint8Array(_); v !== N; ) {
      for (var k = h[v], $ = 0, O = _ - 1; (k !== 0 || $ < w) && O !== -1; O--, $++)
        k += 256 * b[O] >>> 0, b[O] = k % o >>> 0, k = k / o >>> 0;
      if (k !== 0)
        throw new Error("Non-zero carry");
      w = $, v++;
    }
    for (var q = _ - w; q !== _ && b[q] === 0; )
      q++;
    for (var H = a.repeat(y); q < _; ++q)
      H += t.charAt(b[q]);
    return H;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var y = 0, w = 0, v = 0; h[y] === a; )
      w++, y++;
    for (var N = (h.length - y) * c + 1 >>> 0, _ = new Uint8Array(N); h[y]; ) {
      var b = h.charCodeAt(y);
      if (b > 255)
        return;
      var k = e[b];
      if (k === 255)
        return;
      for (var $ = 0, O = N - 1; (k !== 0 || $ < v) && O !== -1; O--, $++)
        k += o * _[O] >>> 0, _[O] = k % 256 >>> 0, k = k / 256 >>> 0;
      if (k !== 0)
        throw new Error("Non-zero carry");
      v = $, y++;
    }
    for (var q = N - v; q !== N && _[q] === 0; )
      q++;
    for (var H = new Uint8Array(w + (N - q)), K = w; q !== N; )
      H[K++] = _[q++];
    return H;
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
var Uh = hb;
const pb = Uh, gb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var yb = pb(gb);
const wb = /* @__PURE__ */ ih(yb), bb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hh = Uint8Array.from({ length: 16 }, (t, e) => e), mb = Hh.map((t) => (9 * t + 5) % 16);
let bl = [Hh], ml = [mb];
for (let t = 0; t < 4; t++)
  for (let e of [bl, ml])
    e.push(e[t].map((n) => bb[n]));
const Ph = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), xb = bl.map((t, e) => t.map((n) => Ph[e][n])), Sb = ml.map((t, e) => t.map((n) => Ph[e][n])), Eb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ab = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vi = (t, e) => t << e | t >>> 32 - e;
function Vu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qi = new Uint32Array(16);
let $b = class extends hl {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = Eb[h], v = Ab[h], N = bl[h], _ = ml[h], b = xb[h], k = Sb[h];
      for (let $ = 0; $ < 16; $++) {
        const O = Vi(r + Vu(h, i, a, u) + qi[N[$]] + w, b[$]) + l | 0;
        r = l, l = u, u = Vi(a, 10) | 0, a = i, i = O;
      }
      for (let $ = 0; $ < 16; $++) {
        const O = Vi(s + Vu(y, o, c, d) + qi[_[$]] + v, k[$]) + g | 0;
        s = g, g = d, d = Vi(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    qi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const vb = es(() => new $b());
function Ib(t) {
  return vb(t);
}
const Wi = BigInt(2 ** 32 - 1), lc = BigInt(32);
function Oh(t, e = !1) {
  return e ? { h: Number(t & Wi), l: Number(t >> lc & Wi) } : { h: Number(t >> lc & Wi) | 0, l: Number(t & Wi) | 0 };
}
function Lb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Oh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const kb = (t, e) => BigInt(t >>> 0) << lc | BigInt(e >>> 0), Cb = (t, e, n) => t >>> n, Bb = (t, e, n) => t << 32 - n | e >>> n, Tb = (t, e, n) => t >>> n | e << 32 - n, Mb = (t, e, n) => t << 32 - n | e >>> n, _b = (t, e, n) => t << 64 - n | e >>> n - 32, Nb = (t, e, n) => t >>> n - 32 | e << 64 - n, Ub = (t, e) => e, Hb = (t, e) => t, Pb = (t, e, n) => t << n | e >>> 32 - n, Ob = (t, e, n) => e << n | t >>> 32 - n, Db = (t, e, n) => e << n - 32 | t >>> 64 - n, Fb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function jb(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const zb = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Rb = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Gb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Kb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Vb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), qb = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ct = {
  fromBig: Oh,
  split: Lb,
  toBig: kb,
  shrSH: Cb,
  shrSL: Bb,
  rotrSH: Tb,
  rotrSL: Mb,
  rotrBH: _b,
  rotrBL: Nb,
  rotr32H: Ub,
  rotr32L: Hb,
  rotlSH: Pb,
  rotlSL: Ob,
  rotlBH: Db,
  rotlBL: Fb,
  add: jb,
  add3L: zb,
  add3H: Rb,
  add4L: Gb,
  add4H: Kb,
  add5H: qb,
  add5L: Vb
}, [Wb, Xb] = ct.split([
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
let ta = class extends hl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: h, Gl: y, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, h, y, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, h, y, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      zn[b] = e.getUint32(n), Rn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const k = zn[b - 15] | 0, $ = Rn[b - 15] | 0, O = ct.rotrSH(k, $, 1) ^ ct.rotrSH(k, $, 8) ^ ct.shrSH(k, $, 7), q = ct.rotrSL(k, $, 1) ^ ct.rotrSL(k, $, 8) ^ ct.shrSL(k, $, 7), H = zn[b - 2] | 0, K = Rn[b - 2] | 0, m = ct.rotrSH(H, K, 19) ^ ct.rotrBH(H, K, 61) ^ ct.shrSH(H, K, 6), I = ct.rotrSL(H, K, 19) ^ ct.rotrBL(H, K, 61) ^ ct.shrSL(H, K, 6), D = ct.add4L(q, I, Rn[b - 7], Rn[b - 16]), R = ct.add4H(D, O, m, zn[b - 7], zn[b - 16]);
      zn[b] = R | 0, Rn[b] = D | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: h, Fl: y, Gh: w, Gl: v, Hh: N, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const k = ct.rotrSH(l, g, 14) ^ ct.rotrSH(l, g, 18) ^ ct.rotrBH(l, g, 41), $ = ct.rotrSL(l, g, 14) ^ ct.rotrSL(l, g, 18) ^ ct.rotrBL(l, g, 41), O = l & h ^ ~l & w, q = g & y ^ ~g & v, H = ct.add5L(_, $, q, Xb[b], Rn[b]), K = ct.add5H(H, N, k, O, Wb[b], zn[b]), m = H | 0, I = ct.rotrSH(r, s, 28) ^ ct.rotrBH(r, s, 34) ^ ct.rotrBH(r, s, 39), D = ct.rotrSL(r, s, 28) ^ ct.rotrBL(r, s, 34) ^ ct.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, tt = s & o ^ s & c ^ o & c;
      N = w | 0, _ = v | 0, w = h | 0, v = y | 0, h = l | 0, y = g | 0, { h: l, l: g } = ct.add(u | 0, d | 0, K | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const F = ct.add3L(m, D, tt);
      r = ct.add3H(F, K, I, R), s = F | 0;
    }
    ({ h: r, l: s } = ct.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ct.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = ct.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = ct.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: y } = ct.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: v } = ct.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: N, l: _ } = ct.add(this.Hh | 0, this.Hl | 0, N | 0, _ | 0), this.set(r, s, i, o, a, c, u, d, l, g, h, y, w, v, N, _);
  }
  roundClean() {
    zn.fill(0), Rn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Yb = class extends ta {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Zb = class extends ta {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Qb = class extends ta {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Jb = es(() => new ta());
es(() => new Yb());
es(() => new Zb());
es(() => new Qb());
function Dh(t) {
  return Cs(t);
}
function t1(t) {
  return Jb(t);
}
const e1 = 0;
Wt.hmacSha256Sync = (t, ...e) => {
  const n = Qo.create(Cs, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function n1() {
  return J(Wt.randomPrivateKey());
}
function r1(t) {
  const e = Cs(Cs(t));
  return wb.encode(hn(t, e).slice(0, t.length + 4));
}
function s1(t, e) {
  return r1(hn(new Uint8Array([t]), e.slice(0, 20)));
}
function Fh(t, e = e1) {
  const n = typeof t == "string" ? At(t) : t, r = Ib(Dh(n));
  return s1(e, r);
}
function jh(t) {
  const e = fl(t);
  return J(Bi(e.slice(0, 32), !0));
}
Wt.hmacSha256Sync = (t, ...e) => {
  const n = Qo.create(Cs, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Bo;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Bo || (Bo = {}));
async function i1(t, e, n) {
  return await (await Nh()).encrypt("aes-256-cbc", e, t, n);
}
async function o1(t, e, n) {
  return await (await Nh()).decrypt("aes-256-cbc", e, t, n);
}
function zh(t, e) {
  return Qo(Cs, t, e);
}
function a1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Rh(t) {
  const e = t1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function c1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function l1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Bo.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Bo.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !c1(t))
    return e;
  try {
    return gt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function u1(t, e, n, r) {
  const s = l1(t);
  if (!s.result)
    throw s;
  const i = Wt.randomPrivateKey(), o = Bi(i, !0);
  let a = wl(i, t, !0);
  a = a.slice(1);
  const c = Rh(a), u = Wt.randomBytes(16), d = await i1(u, c.encryptionKey, e), l = hn(u, o, d), g = zh(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = J(d);
  else if (r === "base64")
    h = Jw(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const y = {
    iv: J(u),
    ephemeralPK: J(o),
    cipherText: h,
    mac: J(g),
    wasString: n
  };
  return r && r !== "hex" && (y.cipherTextEncoding = r), y;
}
async function Gh(t, e) {
  if (!e.ephemeralPK)
    throw new Nu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = wl(t, n, !0);
  r = r.slice(1);
  const s = Rh(r), i = At(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = At(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Qw(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = hn(i, At(n), o), c = zh(s.hmacKey, a), u = At(e.mac);
  if (!a1(u, c))
    throw new Nu("Decryption failed: failure in MAC check");
  const d = await o1(i, s.encryptionKey, o);
  return e.wasString ? Ci(d) : d;
}
function f1(t, e) {
  const n = typeof e == "string" ? ts(e) : e, r = jh(t), s = Dh(n), i = Jo(s, t);
  return {
    signature: J(i),
    publicKey: r
  };
}
async function d1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = jh(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? ts(t) : t, o = await u1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = f1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function h1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Gh(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var le = {}, Ns = {}, we = {};
Object.defineProperty(we, "__esModule", { value: !0 });
we.decode = we.encode = we.unescape = we.escape = we.pad = void 0;
const Kh = Ti;
function xl(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
we.pad = xl;
function Vh(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
we.escape = Vh;
function qh(t) {
  return xl(t).replace(/-/g, "+").replace(/_/g, "/");
}
we.unescape = qh;
function p1(t) {
  return Vh((0, Kh.fromByteArray)(new TextEncoder().encode(t)));
}
we.encode = p1;
function g1(t) {
  return new TextDecoder().decode((0, Kh.toByteArray)(xl(qh(t))));
}
we.decode = g1;
var ea = {}, na = {}, Wh = {}, Xh = {}, ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
ra.crypto = void 0;
ra.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = y, t.byteSwap32 = w, t.bytesToHex = _, t.hexToBytes = $, t.asyncLoop = q, t.utf8ToBytes = H, t.bytesToUtf8 = K, t.toBytes = m, t.kdfInputToBytes = I, t.concatBytes = D, t.checkOpts = R, t.createHasher = F, t.createOptHasher = re, t.createXOFer = ue, t.randomBytes = Xt;
  const e = ra;
  function n(S) {
    return S instanceof Uint8Array || ArrayBuffer.isView(S) && S.constructor.name === "Uint8Array";
  }
  function r(S) {
    if (!Number.isSafeInteger(S) || S < 0)
      throw new Error("positive integer expected, got " + S);
  }
  function s(S, ...C) {
    if (!n(S))
      throw new Error("Uint8Array expected");
    if (C.length > 0 && !C.includes(S.length))
      throw new Error("Uint8Array expected of length " + C + ", got length=" + S.length);
  }
  function i(S) {
    if (typeof S != "function" || typeof S.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(S.outputLen), r(S.blockLen);
  }
  function o(S, C = !0) {
    if (S.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (C && S.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(S, C) {
    s(S);
    const yt = C.outputLen;
    if (S.length < yt)
      throw new Error("digestInto() expects output buffer of length at least " + yt);
  }
  function c(S) {
    return new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
  }
  function u(S) {
    return new Uint32Array(S.buffer, S.byteOffset, Math.floor(S.byteLength / 4));
  }
  function d(...S) {
    for (let C = 0; C < S.length; C++)
      S[C].fill(0);
  }
  function l(S) {
    return new DataView(S.buffer, S.byteOffset, S.byteLength);
  }
  function g(S, C) {
    return S << 32 - C | S >>> C;
  }
  function h(S, C) {
    return S << C | S >>> 32 - C >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function y(S) {
    return S << 24 & 4278190080 | S << 8 & 16711680 | S >>> 8 & 65280 | S >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (S) => S : (S) => y(S), t.byteSwapIfBE = t.swap8IfBE;
  function w(S) {
    for (let C = 0; C < S.length; C++)
      S[C] = y(S[C]);
    return S;
  }
  t.swap32IfBE = t.isLE ? (S) => S : w;
  const v = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", N = /* @__PURE__ */ Array.from({ length: 256 }, (S, C) => C.toString(16).padStart(2, "0"));
  function _(S) {
    if (s(S), v)
      return S.toHex();
    let C = "";
    for (let yt = 0; yt < S.length; yt++)
      C += N[S[yt]];
    return C;
  }
  const b = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function k(S) {
    if (S >= b._0 && S <= b._9)
      return S - b._0;
    if (S >= b.A && S <= b.F)
      return S - (b.A - 10);
    if (S >= b.a && S <= b.f)
      return S - (b.a - 10);
  }
  function $(S) {
    if (typeof S != "string")
      throw new Error("hex string expected, got " + typeof S);
    if (v)
      return Uint8Array.fromHex(S);
    const C = S.length, yt = C / 2;
    if (C % 2)
      throw new Error("hex string expected, got unpadded hex of length " + C);
    const ot = new Uint8Array(yt);
    for (let L = 0, U = 0; L < yt; L++, U += 2) {
      const W = k(S.charCodeAt(U)), et = k(S.charCodeAt(U + 1));
      if (W === void 0 || et === void 0) {
        const nt = S[U] + S[U + 1];
        throw new Error('hex string expected, got non-hex character "' + nt + '" at index ' + U);
      }
      ot[L] = W * 16 + et;
    }
    return ot;
  }
  const O = async () => {
  };
  t.nextTick = O;
  async function q(S, C, yt) {
    let ot = Date.now();
    for (let L = 0; L < S; L++) {
      yt(L);
      const U = Date.now() - ot;
      U >= 0 && U < C || (await (0, t.nextTick)(), ot += U);
    }
  }
  function H(S) {
    if (typeof S != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(S));
  }
  function K(S) {
    return new TextDecoder().decode(S);
  }
  function m(S) {
    return typeof S == "string" && (S = H(S)), s(S), S;
  }
  function I(S) {
    return typeof S == "string" && (S = H(S)), s(S), S;
  }
  function D(...S) {
    let C = 0;
    for (let ot = 0; ot < S.length; ot++) {
      const L = S[ot];
      s(L), C += L.length;
    }
    const yt = new Uint8Array(C);
    for (let ot = 0, L = 0; ot < S.length; ot++) {
      const U = S[ot];
      yt.set(U, L), L += U.length;
    }
    return yt;
  }
  function R(S, C) {
    if (C !== void 0 && {}.toString.call(C) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(S, C);
  }
  class tt {
  }
  t.Hash = tt;
  function F(S) {
    const C = (ot) => S().update(m(ot)).digest(), yt = S();
    return C.outputLen = yt.outputLen, C.blockLen = yt.blockLen, C.create = () => S(), C;
  }
  function re(S) {
    const C = (ot, L) => S(L).update(m(ot)).digest(), yt = S({});
    return C.outputLen = yt.outputLen, C.blockLen = yt.blockLen, C.create = (ot) => S(ot), C;
  }
  function ue(S) {
    const C = (ot, L) => S(L).update(m(ot)).digest(), yt = S({});
    return C.outputLen = yt.outputLen, C.blockLen = yt.blockLen, C.create = (ot) => S(ot), C;
  }
  t.wrapConstructor = F, t.wrapConstructorWithOpts = re, t.wrapXOFConstructorWithOpts = ue;
  function Xt(S = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(S));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(S));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Xh);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Xh;
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
})(Wh);
const gs = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Yh(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function uc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function ns(t, ...e) {
  if (!Yh(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function y1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  uc(t.outputLen), uc(t.blockLen);
}
function fc(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Zh(t, e) {
  ns(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function w1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function b1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function To(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function bo(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Ve(t, e) {
  return t << 32 - e | t >>> e;
}
function m1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Sl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function El(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Qh = Sl ? (t) => t : (t) => El(t), x1 = Qh;
function Jh(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = El(t[e]);
  return t;
}
const S1 = Sl ? (t) => t : Jh, t0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", E1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function A1(t) {
  if (ns(t), t0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += E1[t[n]];
  return e;
}
const vn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function qu(t) {
  if (t >= vn._0 && t <= vn._9)
    return t - vn._0;
  if (t >= vn.A && t <= vn.F)
    return t - (vn.A - 10);
  if (t >= vn.a && t <= vn.f)
    return t - (vn.a - 10);
}
function $1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (t0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = qu(t.charCodeAt(i)), a = qu(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const e0 = async () => {
};
async function v1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await e0(), r += i);
  }
}
function Al(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function I1(t) {
  return new TextDecoder().decode(t);
}
function Mi(t) {
  return typeof t == "string" && (t = Al(t)), ns(t), t;
}
function L1(t) {
  return typeof t == "string" && (t = Al(t)), ns(t), t;
}
function k1(...t) {
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
function C1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let n0 = class {
};
function sa(t) {
  const e = (r) => t().update(Mi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function r0(t) {
  const e = (r, s) => t(s).update(Mi(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function s0(t) {
  const e = (r, s) => t(s).update(Mi(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const B1 = sa, T1 = r0, M1 = s0;
function _1(t = 32) {
  if (gs && typeof gs.getRandomValues == "function")
    return gs.getRandomValues(new Uint8Array(t));
  if (gs && typeof gs.randomBytes == "function")
    return Uint8Array.from(gs.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const N1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: n0,
  abytes: ns,
  aexists: fc,
  ahash: y1,
  anumber: uc,
  aoutput: Zh,
  asyncLoop: v1,
  byteSwap: El,
  byteSwap32: Jh,
  byteSwapIfBE: x1,
  bytesToHex: A1,
  bytesToUtf8: I1,
  checkOpts: C1,
  clean: To,
  concatBytes: k1,
  createHasher: sa,
  createOptHasher: r0,
  createView: bo,
  createXOFer: s0,
  hexToBytes: $1,
  isBytes: Yh,
  isLE: Sl,
  kdfInputToBytes: L1,
  nextTick: e0,
  randomBytes: _1,
  rotl: m1,
  rotr: Ve,
  swap32IfBE: S1,
  swap8IfBE: Qh,
  toBytes: Mi,
  u32: b1,
  u8: w1,
  utf8ToBytes: Al,
  wrapConstructor: B1,
  wrapConstructorWithOpts: T1,
  wrapXOFConstructorWithOpts: M1
}, Symbol.toStringTag, { value: "Module" }));
function U1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function H1(t, e, n) {
  return t & e ^ ~t & n;
}
function P1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class O1 extends n0 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = bo(this.buffer);
  }
  update(e) {
    fc(this), e = Mi(e), ns(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = bo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    fc(this), Zh(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, To(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    U1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = bo(e), c = this.outputLen;
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
]), D1 = /* @__PURE__ */ Uint32Array.from([
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
let $l = class extends O1 {
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
      const g = Vn[l - 15], h = Vn[l - 2], y = Ve(g, 7) ^ Ve(g, 18) ^ g >>> 3, w = Ve(h, 17) ^ Ve(h, 19) ^ h >>> 10;
      Vn[l] = w + Vn[l - 7] + y + Vn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ve(a, 6) ^ Ve(a, 11) ^ Ve(a, 25), h = d + g + H1(a, c, u) + D1[l] + Vn[l] | 0, w = (Ve(r, 2) ^ Ve(r, 13) ^ Ve(r, 22)) + P1(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    To(Vn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), To(this.buffer);
  }
}, i0 = class extends $l {
  constructor() {
    super(28), this.A = Kn[0] | 0, this.B = Kn[1] | 0, this.C = Kn[2] | 0, this.D = Kn[3] | 0, this.E = Kn[4] | 0, this.F = Kn[5] | 0, this.G = Kn[6] | 0, this.H = Kn[7] | 0;
  }
};
const F1 = /* @__PURE__ */ sa(() => new $l()), j1 = /* @__PURE__ */ sa(() => new i0()), z1 = $l, R1 = F1, G1 = i0, K1 = j1, V1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: G1,
  SHA256: z1,
  sha224: K1,
  sha256: R1
}, Symbol.toStringTag, { value: "Module" })), ia = /* @__PURE__ */ Yo(V1), q1 = /* @__PURE__ */ Yo(Zw);
var Us = {};
Object.defineProperty(Us, "__esModule", { value: !0 });
Us.joseToDer = Us.derToJose = void 0;
const o0 = Ti, a0 = we;
function Ha(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const W1 = {
  ES256: Ha(256),
  ES384: Ha(384),
  ES512: Ha(521)
};
function c0(t) {
  const e = W1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Mo = 128, l0 = 0, X1 = 32, Y1 = 16, Z1 = 2, u0 = Y1 | X1 | l0 << 6, _o = Z1 | l0 << 6;
function f0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, o0.toByteArray)((0, a0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Q1(t, e) {
  const n = f0(t), r = c0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== u0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Mo | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== _o)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== _o)
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
  y.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const w = o; o < w + h; ++o)
    y[o] = 0;
  return y.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, a0.escape)((0, o0.fromByteArray)(y));
}
Us.derToJose = Q1;
function Wu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Mo && --r, r;
}
function J1(t, e) {
  t = f0(t);
  const n = c0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Wu(t, 0, n), i = Wu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Mo, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = u0, u ? d[l++] = c : (d[l++] = Mo | 1, d[l++] = c & 255), d[l++] = _o, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = _o, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
Us.joseToDer = J1;
var _n = {};
Object.defineProperty(_n, "__esModule", { value: !0 });
_n.InvalidTokenError = _n.MissingParametersError = void 0;
class t2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
_n.MissingParametersError = t2;
class e2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
_n.InvalidTokenError = e2;
const _i = /* @__PURE__ */ Yo(N1);
Object.defineProperty(na, "__esModule", { value: !0 });
na.SECP256K1Client = void 0;
const n2 = Wh, r2 = ia, mo = q1, Xu = Us, Yu = _n, Zu = _i;
mo.utils.hmacSha256Sync = (t, ...e) => {
  const n = n2.hmac.create(r2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class d0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Zu.bytesToHex)(mo.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Yu.MissingParametersError("a signing input hash and private key are all required");
    const s = mo.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Zu.bytesToHex)(s);
    if (r === "jose")
      return (0, Xu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Xu.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Yu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return mo.verify(n, e, r, { strict: !1 });
  }
}
na.SECP256K1Client = d0;
d0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = na;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ea);
var Fr = {};
const s2 = /* @__PURE__ */ Yo(mh);
var i2 = me && me.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.hashSha256Async = Fr.hashSha256 = void 0;
const o2 = ia;
function h0(t) {
  return (0, o2.sha256)(t);
}
Fr.hashSha256 = h0;
function a2(t) {
  return i2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = s2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(h0(t));
    }
  });
}
Fr.hashSha256Async = a2;
var c2 = me && me.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Ns, "__esModule", { value: !0 });
Ns.TokenSigner = Ns.createUnsecuredToken = void 0;
const dc = we, Qu = ea, l2 = _n, Ju = Fr;
function hc(t, e) {
  const n = [], r = dc.encode(JSON.stringify(e));
  n.push(r);
  const s = dc.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function u2(t) {
  return hc(t, { typ: "JWT", alg: "none" }) + ".";
}
Ns.createUnsecuredToken = u2;
class f2 {
  constructor(e, n) {
    if (!(e && n))
      throw new l2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Qu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Qu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = hc(e, s), o = (0, Ju.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return c2(this, void 0, void 0, function* () {
      const s = this.header(r), i = hc(e, s), o = yield (0, Ju.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [dc.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Ns.TokenSigner = f2;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
oa.TokenVerifier = void 0;
const d2 = we, tf = ea, h2 = _n, Xi = Fr;
class p2 {
  constructor(e, n) {
    if (!(e && n))
      throw new h2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !tf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = tf.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Xi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Xi.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), d2.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Xi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Xi.hashSha256)(r);
      return i(o);
    }
  }
}
oa.TokenVerifier = p2;
var aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
aa.decodeToken = void 0;
const Yi = we;
function g2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Yi.decode(e[0])), r = JSON.parse(Yi.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Yi.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Yi.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
aa.decodeToken = g2;
(function(t) {
  var e = me && me.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = me && me.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Ns, t), n(oa, t), n(aa, t), n(_n, t), n(ea, t);
})(le);
function y2(t) {
  return `did:btc-addr:${t}`;
}
function w2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new _u("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new _u('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function p0(t) {
  if (t)
    return w2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const b2 = "1.4.0";
function m2() {
  return n1();
}
function x2(t, e, n, r = lh.slice(), s, i = Jy().getTime(), o = {}) {
  const a = (h) => {
    const y = ll("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return y == null ? void 0 : y.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: ew(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: b2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = le.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = Fh(u);
  return c.iss = y2(d), new le.TokenSigner("ES256k", t).sign(c);
}
async function ef(t, e) {
  const n = Ci(At(e)), r = JSON.parse(n), s = await Gh(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function S2(t) {
  const e = le.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new le.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function E2(t) {
  const e = le.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = p0(e.iss);
  if (n.length === 1) {
    if (Fh(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function A2(t) {
  const e = le.decodeToken(t).payload;
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
function $2(t) {
  const e = le.decodeToken(t).payload;
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
function v2(t) {
  const e = [
    $2(t),
    A2(t),
    S2(t),
    E2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const nf = "1.0.0";
class yr {
  constructor(e) {
    this.version = nf, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== nf)
      throw new sc(`JSON data version ${e.version} not supported by SessionData`);
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
class g0 {
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
class rf extends g0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new yr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new uh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new yr({})), !0;
  }
}
class sf extends g0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Yy, !localStorage.getItem(this.key)) {
      const r = new yr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new uh("No session data was found in localStorage");
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
var yi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(yi || (yi = {}));
var No;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(No || (No = {}));
yi.Mainnet;
var Tn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Tn || (Tn = {}));
var un;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(un || (un = {}));
Tn.Mainnet;
const y0 = {
  chainId: yi.Mainnet,
  transactionVersion: Tn.Mainnet,
  peerNetworkId: No.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: un.MainnetSingleSig,
    multiSig: un.MainnetMultiSig
  },
  client: { baseUrl: fh }
}, pc = {
  chainId: yi.Testnet,
  transactionVersion: Tn.Testnet,
  peerNetworkId: No.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: un.TestnetSingleSig,
    multiSig: un.TestnetMultiSig
  },
  client: { baseUrl: dh }
}, xo = {
  ...pc,
  addressVersion: { ...pc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: hh }
}, I2 = {
  ...xo,
  addressVersion: { ...xo.addressVersion },
  client: { ...xo.client }
};
function L2(t) {
  switch (t) {
    case "mainnet":
      return y0;
    case "testnet":
      return pc;
    case "devnet":
      return xo;
    case "mocknet":
      return I2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function w0(t) {
  return typeof t == "string" ? L2(t) : t;
}
var of;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(of || (of = {}));
var af;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(af || (af = {}));
var qe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(qe || (qe = {}));
const Pa = ["onChainOnly", "offChainOnly", "any"];
Pa[0] + "", qe.OnChainOnly, Pa[1] + "", qe.OffChainOnly, Pa[2] + "", qe.Any, qe.OnChainOnly + "", qe.OnChainOnly, qe.OffChainOnly + "", qe.OffChainOnly, qe.Any + "", qe.Any;
var cf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(cf || (cf = {}));
var lf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(lf || (lf = {}));
var uf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(uf || (uf = {}));
var Cn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Cn || (Cn = {}));
var ff;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ff || (ff = {}));
var df;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(df || (df = {}));
var hf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(hf || (hf = {}));
var pf;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(pf || (pf = {}));
var gf;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(gf || (gf = {}));
var yf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yf || (yf = {}));
var wf;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(wf || (wf = {}));
var bf;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(bf || (bf = {}));
var mf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(mf || (mf = {}));
function gc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function k2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function b0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function C2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  gc(t.outputLen), gc(t.blockLen);
}
function B2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function T2(t, e) {
  b0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const kr = {
  number: gc,
  bool: k2,
  bytes: b0,
  hash: C2,
  exists: B2,
  output: T2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Oa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), rn = (t, e) => t << 32 - e | t >>> e, M2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!M2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function _2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function vl(t) {
  if (typeof t == "string" && (t = _2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let m0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function rs(t) {
  const e = (r) => t().update(vl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let x0 = class extends m0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, kr.hash(e);
    const r = vl(n);
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
const S0 = (t, e, n) => new x0(t, e).update(n).digest();
S0.create = (t, e) => new x0(t, e);
function N2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Il = class extends m0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Oa(this.buffer);
  }
  update(e) {
    kr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = vl(e);
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
    kr.exists(this), kr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    N2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Oa(e), c = this.outputLen;
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
const U2 = (t, e, n) => t & e ^ ~t & n, H2 = (t, e, n) => t & e ^ t & n ^ e & n, P2 = new Uint32Array([
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
let E0 = class extends Il {
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
      const g = Wn[l - 15], h = Wn[l - 2], y = rn(g, 7) ^ rn(g, 18) ^ g >>> 3, w = rn(h, 17) ^ rn(h, 19) ^ h >>> 10;
      Wn[l] = w + Wn[l - 7] + y + Wn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = rn(a, 6) ^ rn(a, 11) ^ rn(a, 25), h = d + g + U2(a, c, u) + P2[l] + Wn[l] | 0, w = (rn(r, 2) ^ rn(r, 13) ^ rn(r, 22)) + H2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Wn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, O2 = class extends E0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const A0 = rs(() => new E0());
rs(() => new O2());
var ss = {}, Ll = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = _i;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (u < 4) {
        const y = n.indexOf(o[h]) >> u;
        let w = 0;
        h !== 0 && (w = n.indexOf(o[h - 1]));
        const v = 1 + u, N = w % (1 << v) << 5 - v, _ = t.c32[y + N];
        u = v, c.unshift(_);
      } else
        u = 0;
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
    const c = o.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let d = [], l = 0, g = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const N = (t.c32.indexOf(o[w]) << g) + l, _ = n[N % 16];
      if (g += 1, l = N >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(_);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let w = 0; w < d.length && d[w] === "0"; w++)
      h++;
    d = d.slice(h - h % 2);
    let y = d.join("");
    for (let w = 0; w < u; w++)
      y = `00${y}`;
    if (a) {
      const w = a * 2 - y.length;
      for (let v = 0; v < w; v += 2)
        y = `00${y}`;
    }
    return y;
  }
  t.c32decode = i;
})(Ll);
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.c32checkDecode = jr.c32checkEncode = void 0;
const xf = ia, Sf = _i, li = Ll;
function $0(t) {
  const e = (0, xf.sha256)((0, xf.sha256)((0, Sf.hexToBytes)(t)));
  return (0, Sf.bytesToHex)(e.slice(0, 4));
}
function D2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = $0(`${n}${e}`), s = (0, li.c32encode)(`${e}${r}`);
  return `${li.c32[t]}${s}`;
}
jr.c32checkEncode = D2;
function F2(t) {
  t = (0, li.c32normalize)(t);
  const e = (0, li.c32decode)(t.slice(1)), n = t[0], r = li.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), $0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
jr.c32checkDecode = F2;
var v0 = {}, Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.decode = Hs.encode = void 0;
const Uo = ia, Ef = _i, I0 = Uh, L0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function j2(t, e = "00") {
  const n = typeof t == "string" ? (0, Ef.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ef.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Uo.sha256)((0, Uo.sha256)(new Uint8Array([...r, ...n])));
  return I0(L0).encode([...r, ...n, ...s.slice(0, 4)]);
}
Hs.encode = j2;
function z2(t) {
  const e = I0(L0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Uo.sha256)((0, Uo.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Hs.decode = z2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = jr, n = Hs, r = _i;
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
  function u(d, l = -1) {
    const g = a(d), h = g[0], y = g[1];
    let w;
    l < 0 ? (w = h, i[h] !== void 0 && (w = i[h])) : w = l;
    let v = w.toString(16);
    return v.length === 1 && (v = `0${v}`), n.encode(y, v);
  }
  t.c32ToB58 = u;
})(v0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Ll;
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
  const r = v0;
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
function R2(t, e) {
  switch (e = w0(e ?? y0), t) {
    case Cn.P2PKH:
      switch (e.transactionVersion) {
        case Tn.Mainnet:
          return un.MainnetSingleSig;
        case Tn.Testnet:
          return un.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Cn.P2SH:
    case Cn.P2SHNonSequential:
    case Cn.P2WPKH:
    case Cn.P2WSH:
    case Cn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Tn.Mainnet:
          return un.MainnetMultiSig;
        case Tn.Testnet:
          return un.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const G2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), k0 = Uint8Array.from({ length: 16 }, (t, e) => e), K2 = k0.map((t) => (9 * t + 5) % 16);
let kl = [k0], Cl = [K2];
for (let t = 0; t < 4; t++)
  for (let e of [kl, Cl])
    e.push(e[t].map((n) => G2[n]));
const C0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), V2 = kl.map((t, e) => t.map((n) => C0[e][n])), q2 = Cl.map((t, e) => t.map((n) => C0[e][n])), W2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), X2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zi = (t, e) => t << e | t >>> 32 - e;
function Af(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qi = new Uint32Array(16);
let Y2 = class extends Il {
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
      Qi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = W2[h], v = X2[h], N = kl[h], _ = Cl[h], b = V2[h], k = q2[h];
      for (let $ = 0; $ < 16; $++) {
        const O = Zi(r + Af(h, i, a, u) + Qi[N[$]] + w, b[$]) + l | 0;
        r = l, l = u, u = Zi(a, 10) | 0, a = i, i = O;
      }
      for (let $ = 0; $ < 16; $++) {
        const O = Zi(s + Af(y, o, c, d) + Qi[_[$]] + v, k[$]) + g | 0;
        s = g, g = d, d = Zi(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Qi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Z2 = rs(() => new Y2()), Ji = BigInt(2 ** 32 - 1), yc = BigInt(32);
function B0(t, e = !1) {
  return e ? { h: Number(t & Ji), l: Number(t >> yc & Ji) } : { h: Number(t >> yc & Ji) | 0, l: Number(t & Ji) | 0 };
}
function Q2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = B0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const J2 = (t, e) => BigInt(t >>> 0) << yc | BigInt(e >>> 0), tm = (t, e, n) => t >>> n, em = (t, e, n) => t << 32 - n | e >>> n, nm = (t, e, n) => t >>> n | e << 32 - n, rm = (t, e, n) => t << 32 - n | e >>> n, sm = (t, e, n) => t << 64 - n | e >>> n - 32, im = (t, e, n) => t >>> n - 32 | e << 64 - n, om = (t, e) => e, am = (t, e) => t, cm = (t, e, n) => t << n | e >>> 32 - n, lm = (t, e, n) => e << n | t >>> 32 - n, um = (t, e, n) => e << n - 32 | t >>> 64 - n, fm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function dm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const hm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), pm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, gm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ym = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, wm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), bm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, lt = {
  fromBig: B0,
  split: Q2,
  toBig: J2,
  shrSH: tm,
  shrSL: em,
  rotrSH: nm,
  rotrSL: rm,
  rotrBH: sm,
  rotrBL: im,
  rotr32H: om,
  rotr32L: am,
  rotlSH: cm,
  rotlSL: lm,
  rotlBH: um,
  rotlBL: fm,
  add: dm,
  add3L: hm,
  add3H: pm,
  add4L: gm,
  add4H: ym,
  add5H: bm,
  add5L: wm
}, [mm, xm] = lt.split([
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
let ca = class extends Il {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: h, Gl: y, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, h, y, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, h, y, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Xn[b] = e.getUint32(n), Yn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const k = Xn[b - 15] | 0, $ = Yn[b - 15] | 0, O = lt.rotrSH(k, $, 1) ^ lt.rotrSH(k, $, 8) ^ lt.shrSH(k, $, 7), q = lt.rotrSL(k, $, 1) ^ lt.rotrSL(k, $, 8) ^ lt.shrSL(k, $, 7), H = Xn[b - 2] | 0, K = Yn[b - 2] | 0, m = lt.rotrSH(H, K, 19) ^ lt.rotrBH(H, K, 61) ^ lt.shrSH(H, K, 6), I = lt.rotrSL(H, K, 19) ^ lt.rotrBL(H, K, 61) ^ lt.shrSL(H, K, 6), D = lt.add4L(q, I, Yn[b - 7], Yn[b - 16]), R = lt.add4H(D, O, m, Xn[b - 7], Xn[b - 16]);
      Xn[b] = R | 0, Yn[b] = D | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: h, Fl: y, Gh: w, Gl: v, Hh: N, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const k = lt.rotrSH(l, g, 14) ^ lt.rotrSH(l, g, 18) ^ lt.rotrBH(l, g, 41), $ = lt.rotrSL(l, g, 14) ^ lt.rotrSL(l, g, 18) ^ lt.rotrBL(l, g, 41), O = l & h ^ ~l & w, q = g & y ^ ~g & v, H = lt.add5L(_, $, q, xm[b], Yn[b]), K = lt.add5H(H, N, k, O, mm[b], Xn[b]), m = H | 0, I = lt.rotrSH(r, s, 28) ^ lt.rotrBH(r, s, 34) ^ lt.rotrBH(r, s, 39), D = lt.rotrSL(r, s, 28) ^ lt.rotrBL(r, s, 34) ^ lt.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, tt = s & o ^ s & c ^ o & c;
      N = w | 0, _ = v | 0, w = h | 0, v = y | 0, h = l | 0, y = g | 0, { h: l, l: g } = lt.add(u | 0, d | 0, K | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const F = lt.add3L(m, D, tt);
      r = lt.add3H(F, K, I, R), s = F | 0;
    }
    ({ h: r, l: s } = lt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = lt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = lt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = lt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: y } = lt.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: v } = lt.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: N, l: _ } = lt.add(this.Hh | 0, this.Hl | 0, N | 0, _ | 0), this.set(r, s, i, o, a, c, u, d, l, g, h, y, w, v, N, _);
  }
  roundClean() {
    Xn.fill(0), Yn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Sm = class extends ca {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Em = class extends ca {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Am = class extends ca {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
rs(() => new ca());
rs(() => new Sm());
rs(() => new Em());
rs(() => new Am());
var Ho = { exports: {} };
Ho.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", y = "[object Object]", w = "[object Promise]", v = "[object RegExp]", N = "[object Set]", _ = "[object String]", b = "[object Symbol]", k = "[object WeakMap]", $ = "[object ArrayBuffer]", O = "[object DataView]", q = "[object Float32Array]", H = "[object Float64Array]", K = "[object Int8Array]", m = "[object Int16Array]", I = "[object Int32Array]", D = "[object Uint8Array]", R = "[object Uint8ClampedArray]", tt = "[object Uint16Array]", F = "[object Uint32Array]", re = /[\\^$.*+?()[\]{}|]/g, ue = /\w*$/, Xt = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, C = {};
  C[i] = C[o] = C[$] = C[O] = C[a] = C[c] = C[q] = C[H] = C[K] = C[m] = C[I] = C[g] = C[h] = C[y] = C[v] = C[N] = C[_] = C[b] = C[D] = C[R] = C[tt] = C[F] = !0, C[u] = C[d] = C[k] = !1;
  var yt = typeof me == "object" && me && me.Object === Object && me, ot = typeof self == "object" && self && self.Object === Object && self, L = yt || ot || Function("return this")(), U = e && !e.nodeType && e, W = U && !0 && t && !t.nodeType && t, et = W && W.exports === U;
  function nt(p, A) {
    return p.set(A[0], A[1]), p;
  }
  function Yt(p, A) {
    return p.add(A), p;
  }
  function Nt(p, A) {
    for (var T = -1, Z = p ? p.length : 0; ++T < Z && A(p[T], T, p) !== !1; )
      ;
    return p;
  }
  function Pe(p, A) {
    for (var T = -1, Z = A.length, ce = p.length; ++T < Z; )
      p[ce + T] = A[T];
    return p;
  }
  function Oe(p, A, T, Z) {
    for (var ce = -1, Se = p ? p.length : 0; ++ce < Se; )
      T = A(T, p[ce], ce, p);
    return T;
  }
  function Ut(p, A) {
    for (var T = -1, Z = Array(p); ++T < p; )
      Z[T] = A(T);
    return Z;
  }
  function ae(p, A) {
    return p == null ? void 0 : p[A];
  }
  function Ft(p) {
    var A = !1;
    if (p != null && typeof p.toString != "function")
      try {
        A = !!(p + "");
      } catch {
      }
    return A;
  }
  function Tt(p) {
    var A = -1, T = Array(p.size);
    return p.forEach(function(Z, ce) {
      T[++A] = [ce, Z];
    }), T;
  }
  function ee(p, A) {
    return function(T) {
      return p(A(T));
    };
  }
  function ne(p) {
    var A = -1, T = Array(p.size);
    return p.forEach(function(Z) {
      T[++A] = Z;
    }), T;
  }
  var Zt = Array.prototype, f = Function.prototype, E = Object.prototype, B = L["__core-js_shared__"], V = function() {
    var p = /[^.]+$/.exec(B && B.keys && B.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), ht = f.toString, wt = E.hasOwnProperty, jt = E.toString, Gt = RegExp(
    "^" + ht.call(wt).replace(re, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), se = et ? L.Buffer : void 0, Hn = L.Symbol, Pn = L.Uint8Array, xr = ee(Object.getPrototypeOf, Object), he = Object.create, ls = E.propertyIsEnumerable, bn = Zt.splice, st = Object.getOwnPropertySymbols, vt = se ? se.isBuffer : void 0, Kt = ee(Object.keys, Object), pe = ds(L, "DataView"), Ie = ds(L, "Map"), mn = ds(L, "Promise"), On = ds(L, "Set"), Mt = ds(L, "WeakMap"), Ke = ds(Object, "create"), ti = Ar(pe), xn = Ar(Ie), Sr = Ar(mn), Dn = Ar(On), us = Ar(Mt), Sn = Hn ? Hn.prototype : void 0, X = Sn ? Sn.valueOf : void 0;
  function rt(p) {
    var A = -1, T = p ? p.length : 0;
    for (this.clear(); ++A < T; ) {
      var Z = p[A];
      this.set(Z[0], Z[1]);
    }
  }
  function Le() {
    this.__data__ = Ke ? Ke(null) : {};
  }
  function va(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function x(p) {
    var A = this.__data__;
    if (Ke) {
      var T = A[p];
      return T === r ? void 0 : T;
    }
    return wt.call(A, p) ? A[p] : void 0;
  }
  function M(p) {
    var A = this.__data__;
    return Ke ? A[p] !== void 0 : wt.call(A, p);
  }
  function Y(p, A) {
    var T = this.__data__;
    return T[p] = Ke && A === void 0 ? r : A, this;
  }
  rt.prototype.clear = Le, rt.prototype.delete = va, rt.prototype.get = x, rt.prototype.has = M, rt.prototype.set = Y;
  function at(p) {
    var A = -1, T = p ? p.length : 0;
    for (this.clear(); ++A < T; ) {
      var Z = p[A];
      this.set(Z[0], Z[1]);
    }
  }
  function G() {
    this.__data__ = [];
  }
  function kt(p) {
    var A = this.__data__, T = Pi(A, p);
    if (T < 0)
      return !1;
    var Z = A.length - 1;
    return T == Z ? A.pop() : bn.call(A, T, 1), !0;
  }
  function mt(p) {
    var A = this.__data__, T = Pi(A, p);
    return T < 0 ? void 0 : A[T][1];
  }
  function Ht(p) {
    return Pi(this.__data__, p) > -1;
  }
  function En(p, A) {
    var T = this.__data__, Z = Pi(T, p);
    return Z < 0 ? T.push([p, A]) : T[Z][1] = A, this;
  }
  at.prototype.clear = G, at.prototype.delete = kt, at.prototype.get = mt, at.prototype.has = Ht, at.prototype.set = En;
  function ge(p) {
    var A = -1, T = p ? p.length : 0;
    for (this.clear(); ++A < T; ) {
      var Z = p[A];
      this.set(Z[0], Z[1]);
    }
  }
  function An() {
    this.__data__ = {
      hash: new rt(),
      map: new (Ie || at)(),
      string: new rt()
    };
  }
  function ke(p) {
    return Oi(this, p).delete(p);
  }
  function en(p) {
    return Oi(this, p).get(p);
  }
  function Dg(p) {
    return Oi(this, p).has(p);
  }
  function Fg(p, A) {
    return Oi(this, p).set(p, A), this;
  }
  ge.prototype.clear = An, ge.prototype.delete = ke, ge.prototype.get = en, ge.prototype.has = Dg, ge.prototype.set = Fg;
  function fs(p) {
    this.__data__ = new at(p);
  }
  function jg() {
    this.__data__ = new at();
  }
  function zg(p) {
    return this.__data__.delete(p);
  }
  function Rg(p) {
    return this.__data__.get(p);
  }
  function Gg(p) {
    return this.__data__.has(p);
  }
  function Kg(p, A) {
    var T = this.__data__;
    if (T instanceof at) {
      var Z = T.__data__;
      if (!Ie || Z.length < n - 1)
        return Z.push([p, A]), this;
      T = this.__data__ = new ge(Z);
    }
    return T.set(p, A), this;
  }
  fs.prototype.clear = jg, fs.prototype.delete = zg, fs.prototype.get = Rg, fs.prototype.has = Gg, fs.prototype.set = Kg;
  function Vg(p, A) {
    var T = ka(p) || yy(p) ? Ut(p.length, String) : [], Z = T.length, ce = !!Z;
    for (var Se in p)
      wt.call(p, Se) && !(ce && (Se == "length" || dy(Se, Z))) && T.push(Se);
    return T;
  }
  function mu(p, A, T) {
    var Z = p[A];
    (!(wt.call(p, A) && Au(Z, T)) || T === void 0 && !(A in p)) && (p[A] = T);
  }
  function Pi(p, A) {
    for (var T = p.length; T--; )
      if (Au(p[T][0], A))
        return T;
    return -1;
  }
  function qg(p, A) {
    return p && xu(A, Ca(A), p);
  }
  function Ia(p, A, T, Z, ce, Se, $n) {
    var Ee;
    if (Z && (Ee = Se ? Z(p, ce, Se, $n) : Z(p)), Ee !== void 0)
      return Ee;
    if (!Di(p))
      return p;
    var Iu = ka(p);
    if (Iu) {
      if (Ee = ly(p), !A)
        return oy(p, Ee);
    } else {
      var hs = Er(p), Lu = hs == d || hs == l;
      if (by(p))
        return Jg(p, A);
      if (hs == y || hs == i || Lu && !Se) {
        if (Ft(p))
          return Se ? p : {};
        if (Ee = uy(Lu ? {} : p), !A)
          return ay(p, qg(Ee, p));
      } else {
        if (!C[hs])
          return Se ? p : {};
        Ee = fy(p, hs, Ia, A);
      }
    }
    $n || ($n = new fs());
    var ku = $n.get(p);
    if (ku)
      return ku;
    if ($n.set(p, Ee), !Iu)
      var Cu = T ? cy(p) : Ca(p);
    return Nt(Cu || p, function(Ba, Fi) {
      Cu && (Fi = Ba, Ba = p[Fi]), mu(Ee, Fi, Ia(Ba, A, T, Z, Fi, p, $n));
    }), Ee;
  }
  function Wg(p) {
    return Di(p) ? he(p) : {};
  }
  function Xg(p, A, T) {
    var Z = A(p);
    return ka(p) ? Z : Pe(Z, T(p));
  }
  function Yg(p) {
    return jt.call(p);
  }
  function Zg(p) {
    if (!Di(p) || py(p))
      return !1;
    var A = vu(p) || Ft(p) ? Gt : Xt;
    return A.test(Ar(p));
  }
  function Qg(p) {
    if (!Eu(p))
      return Kt(p);
    var A = [];
    for (var T in Object(p))
      wt.call(p, T) && T != "constructor" && A.push(T);
    return A;
  }
  function Jg(p, A) {
    if (A)
      return p.slice();
    var T = new p.constructor(p.length);
    return p.copy(T), T;
  }
  function La(p) {
    var A = new p.constructor(p.byteLength);
    return new Pn(A).set(new Pn(p)), A;
  }
  function ty(p, A) {
    var T = A ? La(p.buffer) : p.buffer;
    return new p.constructor(T, p.byteOffset, p.byteLength);
  }
  function ey(p, A, T) {
    var Z = A ? T(Tt(p), !0) : Tt(p);
    return Oe(Z, nt, new p.constructor());
  }
  function ny(p) {
    var A = new p.constructor(p.source, ue.exec(p));
    return A.lastIndex = p.lastIndex, A;
  }
  function ry(p, A, T) {
    var Z = A ? T(ne(p), !0) : ne(p);
    return Oe(Z, Yt, new p.constructor());
  }
  function sy(p) {
    return X ? Object(X.call(p)) : {};
  }
  function iy(p, A) {
    var T = A ? La(p.buffer) : p.buffer;
    return new p.constructor(T, p.byteOffset, p.length);
  }
  function oy(p, A) {
    var T = -1, Z = p.length;
    for (A || (A = Array(Z)); ++T < Z; )
      A[T] = p[T];
    return A;
  }
  function xu(p, A, T, Z) {
    T || (T = {});
    for (var ce = -1, Se = A.length; ++ce < Se; ) {
      var $n = A[ce], Ee = void 0;
      mu(T, $n, Ee === void 0 ? p[$n] : Ee);
    }
    return T;
  }
  function ay(p, A) {
    return xu(p, Su(p), A);
  }
  function cy(p) {
    return Xg(p, Ca, Su);
  }
  function Oi(p, A) {
    var T = p.__data__;
    return hy(A) ? T[typeof A == "string" ? "string" : "hash"] : T.map;
  }
  function ds(p, A) {
    var T = ae(p, A);
    return Zg(T) ? T : void 0;
  }
  var Su = st ? ee(st, Object) : Sy, Er = Yg;
  (pe && Er(new pe(new ArrayBuffer(1))) != O || Ie && Er(new Ie()) != g || mn && Er(mn.resolve()) != w || On && Er(new On()) != N || Mt && Er(new Mt()) != k) && (Er = function(p) {
    var A = jt.call(p), T = A == y ? p.constructor : void 0, Z = T ? Ar(T) : void 0;
    if (Z)
      switch (Z) {
        case ti:
          return O;
        case xn:
          return g;
        case Sr:
          return w;
        case Dn:
          return N;
        case us:
          return k;
      }
    return A;
  });
  function ly(p) {
    var A = p.length, T = p.constructor(A);
    return A && typeof p[0] == "string" && wt.call(p, "index") && (T.index = p.index, T.input = p.input), T;
  }
  function uy(p) {
    return typeof p.constructor == "function" && !Eu(p) ? Wg(xr(p)) : {};
  }
  function fy(p, A, T, Z) {
    var ce = p.constructor;
    switch (A) {
      case $:
        return La(p);
      case a:
      case c:
        return new ce(+p);
      case O:
        return ty(p, Z);
      case q:
      case H:
      case K:
      case m:
      case I:
      case D:
      case R:
      case tt:
      case F:
        return iy(p, Z);
      case g:
        return ey(p, Z, T);
      case h:
      case _:
        return new ce(p);
      case v:
        return ny(p);
      case N:
        return ry(p, Z, T);
      case b:
        return sy(p);
    }
  }
  function dy(p, A) {
    return A = A ?? s, !!A && (typeof p == "number" || S.test(p)) && p > -1 && p % 1 == 0 && p < A;
  }
  function hy(p) {
    var A = typeof p;
    return A == "string" || A == "number" || A == "symbol" || A == "boolean" ? p !== "__proto__" : p === null;
  }
  function py(p) {
    return !!V && V in p;
  }
  function Eu(p) {
    var A = p && p.constructor, T = typeof A == "function" && A.prototype || E;
    return p === T;
  }
  function Ar(p) {
    if (p != null) {
      try {
        return ht.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function gy(p) {
    return Ia(p, !0, !0);
  }
  function Au(p, A) {
    return p === A || p !== p && A !== A;
  }
  function yy(p) {
    return wy(p) && wt.call(p, "callee") && (!ls.call(p, "callee") || jt.call(p) == i);
  }
  var ka = Array.isArray;
  function $u(p) {
    return p != null && my(p.length) && !vu(p);
  }
  function wy(p) {
    return xy(p) && $u(p);
  }
  var by = vt || Ey;
  function vu(p) {
    var A = Di(p) ? jt.call(p) : "";
    return A == d || A == l;
  }
  function my(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function Di(p) {
    var A = typeof p;
    return !!p && (A == "object" || A == "function");
  }
  function xy(p) {
    return !!p && typeof p == "object";
  }
  function Ca(p) {
    return $u(p) ? Vg(p) : Qg(p);
  }
  function Sy() {
    return [];
  }
  function Ey() {
    return !1;
  }
  t.exports = gy;
})(Ho, Ho.exports);
var $m = Ho.exports;
const T0 = /* @__PURE__ */ ih($m);
var wc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(wc || (wc = {}));
function vm(t, e) {
  return { type: wc.Address, version: t, hash160: e };
}
function Im(t) {
  return ss.c32address(t.version, t.hash160);
}
const Lm = (t) => Z2(A0(t)), km = (t) => J(Lm(t));
Wt.hmacSha256Sync = (t, ...e) => {
  const n = S0.create(A0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Cm(t, e = "mainnet") {
  e = w0(e), t = typeof t == "string" ? At(t) : t;
  const n = R2(Cn.P2PKH, e), r = vm(n, km(t));
  return Im(r);
}
function Bm(t, e) {
  const n = le.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Cm(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new le.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Tm(t, e = null) {
  let n;
  e ? n = Bm(t, e) : n = le.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const $f = "_blockstackDidCheckEchoReply", Mm = "echoReply", _m = "authContinuation";
function Nm(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Um() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[$f];
  if (typeof e == "boolean")
    return e;
  const n = Nm(t.location.search), r = n[Mm];
  if (r) {
    t[$f] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[_m];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class bc {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new ph();
    else
      throw new Qy("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new sf(e.sessionOptions) : this.store = new sf() : e ? this.store = new rf(e.sessionOptions) : this.store = new rf();
  }
  makeAuthRequestToken(e, n, r, s, i, o = tw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new sc("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, x2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = m2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = ll("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Um())
        return xs.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      xs.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Aw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ji("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = le.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await v2(e))
      throw new ji("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Ma(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await ef(s, i.private_key);
          } catch {
            if (xs.warn("Failed decryption of appPrivateKey, will try to use as given"), !Wt.isValidPrivateKey(i.private_key))
              throw new ji("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await ef(s, c);
          } catch {
            xs.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ji("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = dw, d;
    Ma(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Ma(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: p0(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = i.profile_url;
    if (!l.profile && g) {
      const h = await n(g);
      if (!h.ok)
        l.profile = Object.assign({}, Xy);
      else {
        const y = await h.text(), w = JSON.parse(y);
        l.profile = Tm(w[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new sc("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), d1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), h1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
bc.prototype.makeAuthRequest = bc.prototype.makeAuthRequestToken;
const Hm = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Pm = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Hm(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!la(r.id));
  return e.concat(n);
}, la = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), M0 = "STX_PROVIDER", zr = () => typeof window > "u" ? null : window.localStorage.getItem(M0), Om = (t) => {
  typeof window < "u" && window.localStorage.setItem(M0, t);
}, Dm = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Fm(t, e) {
  const n = {};
  return Object.assign(n, Dm, e), await fetch(t, n);
}
function jm(t) {
  let e = Fm, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function zm(...t) {
  const { fetchLib: e, middlewares: n } = jm(t);
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
var vf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vf || (vf = {}));
const Rm = "https://api.mainnet.hiro.so", Gm = "https://api.testnet.hiro.so", Km = "http://localhost:3999", Vm = ["mainnet", "testnet", "devnet", "mocknet"];
class Gr {
  constructor(e) {
    this.version = Rr.Mainnet, this.chainId = Ps.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Rr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? zm();
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
      return new mc();
    case "testnet":
      return new xc();
    case "devnet":
      return new qm();
    case "mocknet":
      return new _0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Vm.join(", ")}`);
  }
};
Gr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Gr.fromName(t);
class mc extends Gr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Rm,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Rr.Mainnet, this.chainId = Ps.Mainnet;
  }
}
class xc extends Gr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Gm,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Rr.Testnet, this.chainId = Ps.Testnet;
  }
}
class _0 extends Gr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Km,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Rr.Testnet, this.chainId = Ps.Testnet;
  }
}
const qm = _0;
var Kr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Kr || (Kr = {}));
var Po;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Po || (Po = {}));
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
const Wm = {
  chainId: Kr.Mainnet,
  transactionVersion: Vr.Mainnet,
  peerNetworkId: Po.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: qr.MainnetSingleSig,
    multiSig: qr.MainnetMultiSig
  },
  client: { baseUrl: fh }
}, Sc = {
  chainId: Kr.Testnet,
  transactionVersion: Vr.Testnet,
  peerNetworkId: Po.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: qr.TestnetSingleSig,
    multiSig: qr.TestnetMultiSig
  },
  client: { baseUrl: dh }
}, So = {
  ...Sc,
  addressVersion: { ...Sc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: hh }
}, Xm = {
  ...So,
  addressVersion: { ...So.addressVersion },
  client: { ...So.client }
};
function Ym(t) {
  switch (t) {
    case "mainnet":
      return Wm;
    case "testnet":
      return Sc;
    case "devnet":
      return So;
    case "mocknet":
      return Xm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Zm(t) {
  return typeof t == "string" ? Ym(t) : t;
}
function Qm(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const If = /* @__PURE__ */ new Map();
function N0(t, e) {
  const n = If.get(t);
  if (n !== void 0)
    return n(e);
  const r = Qm(t);
  return If.set(t, r), N0(t, e);
}
let _t = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? At(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return mw(this.readBytes(4), 0);
  }
  readUInt8() {
    return ww(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return gw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = J(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = J(n);
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
    if (N0(e, r))
      return r;
    throw n(r);
  }
};
const Jm = 128, tx = 128, U0 = 16, _r = 32, Ec = 80, ua = 65, ex = 32, nx = 64, Oo = 34, rx = 1 + 16 * 1024 * 1024, sx = 165, ix = 16, ox = 16, ax = 20, cx = ox + 2 + ax, lx = cx + 4, ux = rx + (sx + ix * lx);
var It;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(It || (It = {}));
var Ac;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ac || (Ac = {}));
var Be;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Be || (Be = {}));
const Da = ["onChainOnly", "offChainOnly", "any"];
Da[0] + "", Be.OnChainOnly, Da[1] + "", Be.OffChainOnly, Da[2] + "", Be.Any, Be.OnChainOnly + "", Be.OnChainOnly, Be.OffChainOnly + "", Be.OffChainOnly, Be.Any + "", Be.Any;
var Do;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Do || (Do = {}));
var Pt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Pt || (Pt = {}));
var Vt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Vt || (Vt = {}));
var Ct;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ct || (Ct = {}));
var zt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(zt || (zt = {}));
var ui;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ui || (ui = {}));
var $c;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})($c || ($c = {}));
var vc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(vc || (vc = {}));
var be;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(be || (be = {}));
var Lf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Lf || (Lf = {}));
var Ic;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ic || (Ic = {}));
var Xe;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Xe || (Xe = {}));
var kf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(kf || (kf = {}));
let fa = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ss = class extends fa {
  constructor(e) {
    super(e);
  }
}, ye = class extends fa {
  constructor(e) {
    super(e);
  }
}, Fo = class extends fa {
  constructor(e) {
    super(e);
  }
}, Cr = class extends fa {
  constructor(e) {
    super(e);
  }
};
function Lc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function fx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function H0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function dx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Lc(t.outputLen), Lc(t.blockLen);
}
function hx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function px(t, e) {
  H0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Br = {
  number: Lc,
  bool: fx,
  bytes: H0,
  hash: dx,
  exists: hx,
  output: px
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Fa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), sn = (t, e) => t << 32 - e | t >>> e, gx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!gx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function yx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bl(t) {
  if (typeof t == "string" && (t = yx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let P0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function is(t) {
  const e = (r) => t().update(Bl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let O0 = class extends P0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Br.hash(e);
    const r = Bl(n);
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
const D0 = (t, e, n) => new O0(t, e).update(n).digest();
D0.create = (t, e) => new O0(t, e);
function wx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Tl = class extends P0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Fa(this.buffer);
  }
  update(e) {
    Br.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Bl(e);
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
    Br.exists(this), Br.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    wx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const bx = (t, e, n) => t & e ^ ~t & n, mx = (t, e, n) => t & e ^ t & n ^ e & n, xx = new Uint32Array([
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
let F0 = class extends Tl {
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
      const g = Qn[l - 15], h = Qn[l - 2], y = sn(g, 7) ^ sn(g, 18) ^ g >>> 3, w = sn(h, 17) ^ sn(h, 19) ^ h >>> 10;
      Qn[l] = w + Qn[l - 7] + y + Qn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = sn(a, 6) ^ sn(a, 11) ^ sn(a, 25), h = d + g + bx(a, c, u) + xx[l] + Qn[l] | 0, w = (sn(r, 2) ^ sn(r, 13) ^ sn(r, 22)) + mx(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Qn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Sx = class extends F0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ml = is(() => new F0());
is(() => new Sx());
const Ex = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), j0 = Uint8Array.from({ length: 16 }, (t, e) => e), Ax = j0.map((t) => (9 * t + 5) % 16);
let _l = [j0], Nl = [Ax];
for (let t = 0; t < 4; t++)
  for (let e of [_l, Nl])
    e.push(e[t].map((n) => Ex[n]));
const z0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), $x = _l.map((t, e) => t.map((n) => z0[e][n])), vx = Nl.map((t, e) => t.map((n) => z0[e][n])), Ix = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Lx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), to = (t, e) => t << e | t >>> 32 - e;
function Cf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const eo = new Uint32Array(16);
let kx = class extends Tl {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = Ix[h], v = Lx[h], N = _l[h], _ = Nl[h], b = $x[h], k = vx[h];
      for (let $ = 0; $ < 16; $++) {
        const O = to(r + Cf(h, i, a, u) + eo[N[$]] + w, b[$]) + l | 0;
        r = l, l = u, u = to(a, 10) | 0, a = i, i = O;
      }
      for (let $ = 0; $ < 16; $++) {
        const O = to(s + Cf(y, o, c, d) + eo[_[$]] + v, k[$]) + g | 0;
        s = g, g = d, d = to(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    eo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Cx = is(() => new kx()), no = BigInt(2 ** 32 - 1), kc = BigInt(32);
function R0(t, e = !1) {
  return e ? { h: Number(t & no), l: Number(t >> kc & no) } : { h: Number(t >> kc & no) | 0, l: Number(t & no) | 0 };
}
function Bx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = R0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Tx = (t, e) => BigInt(t >>> 0) << kc | BigInt(e >>> 0), Mx = (t, e, n) => t >>> n, _x = (t, e, n) => t << 32 - n | e >>> n, Nx = (t, e, n) => t >>> n | e << 32 - n, Ux = (t, e, n) => t << 32 - n | e >>> n, Hx = (t, e, n) => t << 64 - n | e >>> n - 32, Px = (t, e, n) => t >>> n - 32 | e << 64 - n, Ox = (t, e) => e, Dx = (t, e) => t, Fx = (t, e, n) => t << n | e >>> 32 - n, jx = (t, e, n) => e << n | t >>> 32 - n, zx = (t, e, n) => e << n - 32 | t >>> 64 - n, Rx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Gx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Kx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Vx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, qx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Wx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Xx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Yx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ut = {
  fromBig: R0,
  split: Bx,
  toBig: Tx,
  shrSH: Mx,
  shrSL: _x,
  rotrSH: Nx,
  rotrSL: Ux,
  rotrBH: Hx,
  rotrBL: Px,
  rotr32H: Ox,
  rotr32L: Dx,
  rotlSH: Fx,
  rotlSL: jx,
  rotlBH: zx,
  rotlBL: Rx,
  add: Gx,
  add3L: Kx,
  add3H: Vx,
  add4L: qx,
  add4H: Wx,
  add5H: Yx,
  add5L: Xx
}, [Zx, Qx] = ut.split([
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
let da = class extends Tl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: h, Gl: y, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, h, y, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, h, y, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Jn[b] = e.getUint32(n), tr[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const k = Jn[b - 15] | 0, $ = tr[b - 15] | 0, O = ut.rotrSH(k, $, 1) ^ ut.rotrSH(k, $, 8) ^ ut.shrSH(k, $, 7), q = ut.rotrSL(k, $, 1) ^ ut.rotrSL(k, $, 8) ^ ut.shrSL(k, $, 7), H = Jn[b - 2] | 0, K = tr[b - 2] | 0, m = ut.rotrSH(H, K, 19) ^ ut.rotrBH(H, K, 61) ^ ut.shrSH(H, K, 6), I = ut.rotrSL(H, K, 19) ^ ut.rotrBL(H, K, 61) ^ ut.shrSL(H, K, 6), D = ut.add4L(q, I, tr[b - 7], tr[b - 16]), R = ut.add4H(D, O, m, Jn[b - 7], Jn[b - 16]);
      Jn[b] = R | 0, tr[b] = D | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: h, Fl: y, Gh: w, Gl: v, Hh: N, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const k = ut.rotrSH(l, g, 14) ^ ut.rotrSH(l, g, 18) ^ ut.rotrBH(l, g, 41), $ = ut.rotrSL(l, g, 14) ^ ut.rotrSL(l, g, 18) ^ ut.rotrBL(l, g, 41), O = l & h ^ ~l & w, q = g & y ^ ~g & v, H = ut.add5L(_, $, q, Qx[b], tr[b]), K = ut.add5H(H, N, k, O, Zx[b], Jn[b]), m = H | 0, I = ut.rotrSH(r, s, 28) ^ ut.rotrBH(r, s, 34) ^ ut.rotrBH(r, s, 39), D = ut.rotrSL(r, s, 28) ^ ut.rotrBL(r, s, 34) ^ ut.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, tt = s & o ^ s & c ^ o & c;
      N = w | 0, _ = v | 0, w = h | 0, v = y | 0, h = l | 0, y = g | 0, { h: l, l: g } = ut.add(u | 0, d | 0, K | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const F = ut.add3L(m, D, tt);
      r = ut.add3H(F, K, I, R), s = F | 0;
    }
    ({ h: r, l: s } = ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ut.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ut.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = ut.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = ut.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: y } = ut.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: v } = ut.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: N, l: _ } = ut.add(this.Hh | 0, this.Hl | 0, N | 0, _ | 0), this.set(r, s, i, o, a, c, u, d, l, g, h, y, w, v, N, _);
  }
  roundClean() {
    Jn.fill(0), tr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Jx = class extends da {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, tS = class extends da {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, eS = class extends da {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
is(() => new da());
is(() => new Jx());
const nS = is(() => new tS());
is(() => new eS());
var St;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(St || (St = {}));
var ie;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ie || (ie = {}));
function Ul(t) {
  return ie[t];
}
const rS = () => ({ type: St.BoolTrue }), sS = () => ({ type: St.BoolFalse }), iS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: St.Buffer, value: J(t) };
}, Bf = BigInt("0xffffffffffffffffffffffffffffffff"), oS = BigInt(0), Tf = BigInt("0x7fffffffffffffffffffffffffffffff"), Mf = BigInt("-170141183460469231731687303715884105728"), aS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = oc(At(t))), ve(t, Uint8Array) && (t = oc(t));
  const e = de(t);
  if (e > Tf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Tf}`);
  if (e < Mf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Mf}`);
  return { type: St.Int, value: e };
}, cS = (t) => {
  const e = de(t);
  if (e < oS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Bf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Bf}`);
  return { type: St.UInt, value: e };
};
function lS(t) {
  return { type: St.List, value: t };
}
function G0() {
  return { type: St.OptionalNone };
}
function K0(t) {
  return { type: St.OptionalSome, value: t };
}
var z;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(z || (z = {}));
function uS() {
  return {
    type: z.Address,
    version: qr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function _f(t) {
  if (t && tp(t, Oo))
    throw new Error(`Memo exceeds maximum length of ${Oo} bytes`);
  return { type: z.MemoString, content: t };
}
function Hl(t, e) {
  return {
    type: z.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Cc(t) {
  if (At(t).byteLength != ua)
    throw Error("Invalid signature");
  return {
    type: z.MessageSignature,
    data: t
  };
}
function fS(t, e, n) {
  return typeof t == "string" && (t = LS(t)), typeof n == "string" && (n = _f(n)), {
    type: z.Payload,
    payloadType: It.TokenTransfer,
    recipient: t,
    amount: de(e),
    memo: n ?? _f("")
  };
}
function dS(t, e, n, r) {
  return typeof e == "string" && (e = Je(e)), typeof n == "string" && (n = Je(n)), {
    type: z.Payload,
    payloadType: It.ContractCall,
    contractAddress: typeof t == "string" ? mr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function hS(t) {
  return Je(t, 4, 1e5);
}
function Nf(t, e, n) {
  return typeof t == "string" && (t = Je(t)), typeof e == "string" && (e = hS(e)), typeof n == "number" ? {
    type: z.Payload,
    payloadType: It.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: z.Payload,
    payloadType: It.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function pS() {
  return { type: z.Payload, payloadType: It.PoisonMicroblock };
}
function Uf(t, e) {
  if (t.byteLength != _r)
    throw Error(`Coinbase buffer size must be ${_r} bytes`);
  return e != null ? {
    type: z.Payload,
    payloadType: It.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: z.Payload,
    payloadType: It.Coinbase,
    coinbaseBytes: t
  };
}
function gS(t, e, n) {
  if (t.byteLength != _r)
    throw Error(`Coinbase buffer size must be ${_r} bytes`);
  if (n.byteLength != Ec)
    throw Error(`VRF proof buffer size must be ${Ec} bytes`);
  return {
    type: z.Payload,
    payloadType: It.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === St.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function yS(t, e, n, r, s, i, o) {
  return {
    type: z.Payload,
    payloadType: It.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Je(t, e, n) {
  const r = e || 1, s = n || Jm;
  if (tp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: z.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function wS(t, e, n) {
  return {
    type: z.Asset,
    address: mr(t),
    contractName: Je(e),
    assetName: Je(n)
  };
}
function mr(t) {
  const e = ss.c32addressDecode(t);
  return {
    type: z.Address,
    version: e[0],
    hash160: e[1]
  };
}
function bS(t, e) {
  const n = mr(t), r = Je(e);
  return {
    type: z.Principal,
    prefix: be.Contract,
    address: n,
    contractName: r
  };
}
function mS(t) {
  const e = mr(t);
  return {
    type: z.Principal,
    prefix: be.Standard,
    address: e
  };
}
function Es(t, e) {
  return {
    pubKeyEncoding: t,
    type: z.TransactionAuthField,
    contents: e
  };
}
function In(t) {
  switch (t.type) {
    case z.Address:
      return Ni(t);
    case z.Principal:
      return V0(t);
    case z.LengthPrefixedString:
      return Ds(t);
    case z.MemoString:
      return SS(t);
    case z.Asset:
      return W0(t);
    case z.PostCondition:
      return Y0(t);
    case z.PublicKey:
      return Mc(t);
    case z.LengthPrefixedList:
      return Pl(t);
    case z.Payload:
      return Z0(t);
    case z.TransactionAuthField:
      return IS(t);
    case z.MessageSignature:
      return Ol(t);
  }
}
function Ni(t) {
  const e = [];
  return e.push(At(ki(t.version, 1))), e.push(At(t.hash160)), Jt(e);
}
function Os(t) {
  const e = ve(t, _t) ? t : new _t(t), n = Zo(J(e.readBytes(1))), r = J(e.readBytes(20));
  return { type: z.Address, version: n, hash160: r };
}
function V0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === be.Standard || t.prefix === be.Contract) && e.push(Ni(t.address)), t.prefix === be.Contract && e.push(Ds(t.contractName)), Jt(e);
}
function xS(t) {
  const e = ve(t, _t) ? t : new _t(t), n = e.readUInt8Enum(be, (i) => {
    throw new ye(`Unexpected Principal payload type: ${i}`);
  });
  if (n === be.Origin)
    return { type: z.Principal, prefix: n };
  const r = Os(e);
  if (n === be.Standard)
    return { type: z.Principal, prefix: n, address: r };
  const s = ze(e);
  return {
    type: z.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Ds(t) {
  const e = [], n = ts(t.content), r = n.byteLength;
  return e.push(At(ki(r, t.lengthPrefixBytes))), e.push(n), Jt(e);
}
function ze(t, e, n) {
  e = e || 1;
  const r = ve(t, _t) ? t : new _t(t), s = Zo(J(r.readBytes(e))), i = Ci(r.readBytes(s));
  return Je(i, e, n ?? 128);
}
function SS(t) {
  const e = [], n = ts(t.content), r = XS(J(n), Oo * 2);
  return e.push(At(r)), Jt(e);
}
function q0(t) {
  const e = ve(t, _t) ? t : new _t(t);
  let n = Ci(e.readBytes(Oo));
  return n = n.replace(/\u0000*$/, ""), { type: z.MemoString, content: n };
}
function W0(t) {
  const e = [];
  return e.push(Ni(t.address)), e.push(Ds(t.contractName)), e.push(Ds(t.assetName)), Jt(e);
}
function Bc(t) {
  const e = ve(t, _t) ? t : new _t(t);
  return {
    type: z.Asset,
    address: Os(e),
    contractName: ze(e),
    assetName: ze(e)
  };
}
function Pl(t) {
  const e = t.values, n = [];
  n.push(At(ki(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(In(r));
  return Jt(n);
}
function X0(t, e, n) {
  const r = ve(t, _t) ? t : new _t(t), s = Zo(J(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case z.Address:
        i.push(Os(r));
        break;
      case z.LengthPrefixedString:
        i.push(ze(r));
        break;
      case z.MemoString:
        i.push(q0(r));
        break;
      case z.Asset:
        i.push(Bc(r));
        break;
      case z.PostCondition:
        i.push(AS(r));
        break;
      case z.PublicKey:
        i.push(_c(r));
        break;
      case z.TransactionAuthField:
        i.push(vS(r));
        break;
    }
  return Hl(i, n);
}
function ES(t) {
  return J(Y0(t));
}
function Y0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(V0(t.principal)), (t.conditionType === Pt.Fungible || t.conditionType === Pt.NonFungible) && e.push(W0(t.asset)), t.conditionType === Pt.NonFungible && e.push(fn(t.assetName)), e.push(t.conditionCode), t.conditionType === Pt.STX || t.conditionType === Pt.Fungible || t.conditionType === Pt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ss("The post-condition amount may not be larger than 8 bytes");
    e.push(wr(t.amount, 8));
  }
  return Jt(e);
}
function AS(t) {
  const e = ve(t, _t) ? t : new _t(t), n = e.readUInt8Enum(Pt, (a) => {
    throw new ye(`Could not read ${a} as PostConditionType`);
  }), r = xS(e);
  let s, i, o;
  switch (n) {
    case Pt.STX:
      return s = e.readUInt8Enum(ui, (c) => {
        throw new ye(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${J(e.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Pt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Pt.Fungible:
      return i = Bc(e), s = e.readUInt8Enum(ui, (c) => {
        throw new ye(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${J(e.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Pt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Pt.NonFungible:
      i = Bc(e);
      const a = ln(e);
      return s = e.readUInt8Enum($c, (c) => {
        throw new ye(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: z.PostCondition,
        conditionType: Pt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Pt.Staking:
      return s = e.readUInt8Enum(ui, (c) => {
        throw new ye(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${J(e.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Pt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Pt.PoX: {
      const c = e.readUInt8Enum(vc, (u) => {
        throw new ye(`Could not read ${u} as PoxConditionCode`);
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
function Z0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case It.TokenTransfer:
      e.push(fn(t.recipient)), e.push(wr(t.amount, 8)), e.push(In(t.memo));
      break;
    case It.ContractCall:
      e.push(In(t.contractAddress)), e.push(In(t.contractName)), e.push(In(t.functionName));
      const n = new Uint8Array(4);
      Pr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(fn(r));
      });
      break;
    case It.SmartContract:
      e.push(In(t.contractName)), e.push(In(t.codeBody));
      break;
    case It.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(In(t.contractName)), e.push(In(t.codeBody));
      break;
    case It.PoisonMicroblock:
      break;
    case It.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case It.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(fn(t.recipient));
      break;
    case It.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(fn(t.recipient ? K0(t.recipient) : G0())), e.push(t.vrfProof);
      break;
    case It.TenureChange:
      e.push(At(t.tenureHash)), e.push(At(t.previousTenureHash)), e.push(At(t.burnViewHash)), e.push(At(t.previousTenureEnd)), e.push(Pr(new Uint8Array(4), t.previousTenureBlocks)), e.push(bw(new Uint8Array(1), t.cause)), e.push(At(t.publicKeyHash));
      break;
  }
  return Jt(e);
}
function $S(t) {
  const e = ve(t, _t) ? t : new _t(t);
  switch (e.readUInt8Enum(It, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case It.TokenTransfer:
      const r = ln(e), s = de(e.readBytes(8)), i = q0(e);
      return fS(r, s, i);
    case It.ContractCall:
      const o = Os(e), a = ze(e), c = ze(e), u = [], d = e.readUInt32BE();
      for (let k = 0; k < d; k++) {
        const $ = ln(e);
        u.push($);
      }
      return dS(o, a, c, u);
    case It.SmartContract:
      const l = ze(e), g = ze(e, 4, 1e5);
      return Nf(l, g);
    case It.VersionedSmartContract: {
      const k = e.readUInt8Enum(Ac, (q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${q}`);
      }), $ = ze(e), O = ze(e, 4, ux);
      return Nf($, O, k);
    }
    case It.PoisonMicroblock:
      return pS();
    case It.Coinbase: {
      const k = e.readBytes(_r);
      return Uf(k);
    }
    case It.CoinbaseToAltRecipient: {
      const k = e.readBytes(_r), $ = ln(e);
      return Uf(k, $);
    }
    case It.NakamotoCoinbase: {
      const k = e.readBytes(_r), $ = ln(e), O = e.readBytes(Ec);
      return gS(k, $, O);
    }
    case It.TenureChange:
      const h = J(e.readBytes(20)), y = J(e.readBytes(20)), w = J(e.readBytes(20)), v = J(e.readBytes(32)), N = e.readUInt32BE(), _ = e.readUInt8Enum(Ic, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), b = J(e.readBytes(20));
      return yS(h, y, w, v, N, _, b);
  }
}
function Tc(t) {
  const e = ve(t, _t) ? t : new _t(t);
  return Cc(J(e.readBytes(ua)));
}
function vS(t) {
  const e = ve(t, _t) ? t : new _t(t), n = e.readUInt8Enum(Xe, (r) => {
    throw new ye(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Xe.PublicKeyCompressed:
      return Es(zt.Compressed, _c(e));
    case Xe.PublicKeyUncompressed:
      return Es(zt.Uncompressed, Xs(o3(_c(e).data)));
    case Xe.SignatureCompressed:
      return Es(zt.Compressed, Tc(e));
    case Xe.SignatureUncompressed:
      return Es(zt.Uncompressed, Tc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Ol(t) {
  return At(t.data);
}
function IS(t) {
  const e = [];
  switch (t.contents.type) {
    case z.PublicKey:
      e.push(t.pubKeyEncoding === zt.Compressed ? Xe.PublicKeyCompressed : Xe.PublicKeyUncompressed), e.push(At(i3(t.contents.data)));
      break;
    case z.MessageSignature:
      e.push(t.pubKeyEncoding === zt.Compressed ? Xe.SignatureCompressed : Xe.SignatureUncompressed), e.push(Ol(t.contents));
      break;
  }
  return Jt(e);
}
function Mc(t) {
  return t.data.slice();
}
function _c(t) {
  const e = ve(t, _t) ? t : new _t(t), n = e.readUInt8(), r = n === 4 ? nx : ex;
  return Xs(Jt([n, e.readBytes(r)]));
}
function Dl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Ct.P2PKH || e === Ct.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Ct.P2WPKH || e === Ct.P2WSH || e === Ct.P2WSHNonSequential) && !r.map((s) => s.data).every(Ys))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Ct.P2PKH:
      return ro(t, YS(r[0].data));
    case Ct.P2WPKH:
      return ro(t, ZS(r[0].data));
    case Ct.P2SH:
    case Ct.P2SHNonSequential:
      return ro(t, QS(n, r.map(Mc)));
    case Ct.P2WSH:
    case Ct.P2WSHNonSequential:
      return ro(t, JS(n, r.map(Mc)));
  }
}
function ro(t, e) {
  return { type: z.Address, version: t, hash160: e };
}
function Fl(t) {
  return ss.c32address(t.version, t.hash160);
}
function Hf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return wS(e, n, r);
}
function si(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return bS(e, n);
  } else
    return mS(t);
}
function LS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return BS(e, n);
  } else
    return kS(t);
}
function kS(t) {
  const e = mr(t);
  return { type: St.PrincipalStandard, value: Fl(e) };
}
function CS(t) {
  return { type: St.PrincipalStandard, value: Fl(t) };
}
function BS(t, e) {
  const n = mr(t), r = Je(e);
  return Q0(n, r);
}
function Q0(t, e) {
  if (ts(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: St.PrincipalContract,
    value: `${Fl(t)}.${e.content}`
  };
}
function TS(t) {
  return { type: St.ResponseErr, value: t };
}
function MS(t) {
  return { type: St.ResponseOk, value: t };
}
const _S = (t) => ({ type: St.StringASCII, value: t }), NS = (t) => ({ type: St.StringUTF8, value: t });
function US(t) {
  for (const e in t)
    if (!t3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: St.Tuple, value: t };
}
function ln(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new _t(At(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new _t(t) : e = t;
  switch (e.readUInt8Enum(ie, (r) => {
    throw new ye(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ie.int:
      return aS(oc(e.readBytes(16)));
    case ie.uint:
      return cS(e.readBytes(16));
    case ie.buffer:
      const r = e.readUInt32BE();
      return iS(e.readBytes(r));
    case ie.true:
      return rS();
    case ie.false:
      return sS();
    case ie.address:
      const s = Os(e);
      return CS(s);
    case ie.contract:
      const i = Os(e), o = ze(e);
      return Q0(i, o);
    case ie.ok:
      return MS(ln(e));
    case ie.err:
      return TS(ln(e));
    case ie.none:
      return G0();
    case ie.some:
      return K0(ln(e));
    case ie.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(ln(e));
      return lS(c);
    case ie.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let w = 0; w < u; w++) {
        const v = ze(e).content;
        if (v === void 0)
          throw new ye('"content" is undefined');
        d[v] = ln(e);
      }
      return US(d);
    case ie.ascii:
      const l = e.readUInt32BE(), g = uw(e.readBytes(l));
      return _S(g);
    case ie.utf8:
      const h = e.readUInt32BE(), y = Ci(e.readBytes(h));
      return NS(y);
    default:
      throw new ye("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function gn(t, e) {
  return Jt([Ul(t), e]);
}
function HS(t) {
  return new Uint8Array([Ul(t.type)]);
}
function PS(t) {
  return t.type === St.OptionalNone ? new Uint8Array([Ul(t.type)]) : gn(t.type, fn(t.value));
}
function OS(t) {
  const e = new Uint8Array(4);
  return Pr(e, Math.ceil(t.value.length / 2), 0), gn(t.type, hn(e, At(t.value)));
}
function DS(t) {
  const e = ul(iw(BigInt(t.value), BigInt(tx)), U0);
  return gn(t.type, e);
}
function FS(t) {
  const e = ul(BigInt(t.value), U0);
  return gn(t.type, e);
}
function jS(t) {
  return gn(t.type, Ni(mr(t.value)));
}
function zS(t) {
  const [e, n] = e3(t.value);
  return gn(t.type, hn(Ni(mr(e)), Ds(Je(n))));
}
function RS(t) {
  return gn(t.type, fn(t.value));
}
function GS(t) {
  const e = [], n = new Uint8Array(4);
  Pr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = fn(r);
    e.push(s);
  }
  return gn(t.type, Jt(e));
}
function KS(t) {
  const e = [], n = new Uint8Array(4);
  Pr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Je(s);
    e.push(Ds(i));
    const o = fn(t.value[s]);
    e.push(o);
  }
  return gn(t.type, Jt(e));
}
function J0(t, e) {
  const n = [], r = e == "ascii" ? lw(t.value) : ts(t.value), s = new Uint8Array(4);
  return Pr(s, r.length, 0), n.push(s), n.push(r), gn(t.type, Jt(n));
}
function VS(t) {
  return J0(t, "ascii");
}
function qS(t) {
  return J0(t, "utf8");
}
function Pf(t) {
  return J(fn(t));
}
function fn(t) {
  switch (t.type) {
    case St.BoolTrue:
    case St.BoolFalse:
      return HS(t);
    case St.OptionalNone:
    case St.OptionalSome:
      return PS(t);
    case St.Buffer:
      return OS(t);
    case St.UInt:
      return FS(t);
    case St.Int:
      return DS(t);
    case St.PrincipalStandard:
      return jS(t);
    case St.PrincipalContract:
      return zS(t);
    case St.ResponseOk:
    case St.ResponseErr:
      return RS(t);
    case St.List:
      return GS(t);
    case St.Tuple:
      return KS(t);
    case St.StringASCII:
      return VS(t);
    case St.StringUTF8:
      return qS(t);
    default:
      throw new Ss("Unable to serialize. Invalid Clarity Value.");
  }
}
const WS = (t) => t.length % 2 ? `0${t}` : t, XS = (t, e) => t.padEnd(e, "0"), tp = (t, e) => t ? ts(t).length > e : !1;
function Nc(t) {
  return T0(t);
}
const wi = (t) => Cx(Ml(t)), jl = (t) => J(nS(t)), YS = (t) => J(wi(t)), ZS = (t) => {
  const e = wi(t), n = hn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = wi(n);
  return J(r);
}, QS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Jt(n), s = wi(r);
  return J(s);
}, JS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Jt(n), s = Ml(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Jt(i), a = wi(o);
  return J(a);
};
function t3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function e3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Wt.hmacSha256Sync = (t, ...e) => {
  const n = D0.create(Ml, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Xs(t) {
  return t = typeof t == "string" ? At(t) : t, {
    type: z.PublicKey,
    data: t
  };
}
function n3(t, e, n = zt.Compressed) {
  const r = pw(e), s = new Ne(Hu(r.r), Hu(r.s)), i = gt.fromSignature(t, s, r.recoveryId), o = n === zt.Compressed;
  return i.toHex(o);
}
function r3(t) {
  return typeof t == "string" ? t : J(t);
}
const zl = r3;
function ep(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === hw;
}
function Ys(t) {
  return !zl(t).startsWith("04");
}
function s3(t) {
  t = fl(t);
  const e = ep(t);
  return J(Bi(t.slice(0, 32), e));
}
function i3(t) {
  return gt.fromHex(zl(t)).toHex(!0);
}
function o3(t) {
  return gt.fromHex(zl(t)).toHex(!1);
}
function a3(t, e) {
  t = fl(t);
  const [n, r] = Jo(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ki(r, 1) + Ne.fromHex(n).toCompactHex();
}
function Rl() {
  return {
    type: z.MessageSignature,
    data: J(new Uint8Array(ua))
  };
}
function np(t, e, n, r) {
  const s = Dl(0, t, 1, [Xs(e)]).hash160, i = Ys(e) ? zt.Compressed : zt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: de(n),
    fee: de(r),
    keyEncoding: i,
    signature: Rl()
  };
}
function bi(t) {
  return "signature" in t;
}
function Of(t) {
  return t === Ct.P2SH || t === Ct.P2WSH;
}
function c3(t) {
  return t === Ct.P2SHNonSequential || t === Ct.P2WSHNonSequential;
}
function Df(t) {
  const e = Nc(t);
  return e.nonce = 0, e.fee = 0, bi(e) ? e.signature = Rl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function l3(t) {
  const e = [
    t.hashMode,
    At(t.signer),
    wr(t.nonce, 8),
    wr(t.fee, 8),
    t.keyEncoding,
    Ol(t.signature)
  ];
  return Jt(e);
}
function u3(t) {
  const e = [
    t.hashMode,
    At(t.signer),
    wr(t.nonce, 8),
    wr(t.fee, 8)
  ], n = Hl(t.fields);
  e.push(Pl(n));
  const r = new Uint8Array(2);
  return yw(r, t.signaturesRequired, 0), e.push(r), Jt(e);
}
function f3(t, e) {
  const n = J(e.readBytes(20)), r = BigInt(`0x${J(e.readBytes(8))}`), s = BigInt(`0x${J(e.readBytes(8))}`), i = e.readUInt8Enum(zt, (a) => {
    throw new ye(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Ct.P2WPKH && i != zt.Compressed)
    throw new ye("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Tc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function d3(t, e) {
  const n = J(e.readBytes(20)), r = BigInt("0x" + J(e.readBytes(8))), s = BigInt("0x" + J(e.readBytes(8))), i = X0(e, z.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case z.PublicKey:
        Ys(u.contents.data) || (o = !0);
        break;
      case z.MessageSignature:
        if (u.pubKeyEncoding === zt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Cr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Ct.P2WSH || t === Ct.P2WSHNonSequential))
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
function ja(t) {
  return bi(t) ? l3(t) : u3(t);
}
function za(t) {
  const e = t.readUInt8Enum(Ct, (n) => {
    throw new ye(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Ct.P2PKH || e === Ct.P2WPKH ? f3(e, t) : d3(e, t);
}
function rp(t, e, n, r) {
  const i = t + J(new Uint8Array([e])) + J(wr(n, 8)) + J(wr(r, 8));
  if (At(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return jl(At(i));
}
function sp(t, e, n) {
  const r = 33 + ua, s = Ys(e.data) ? zt.Compressed : zt.Uncompressed, i = t + WS(s.toString(16)) + n, o = At(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return jl(o);
}
function h3(t, e, n, r, s) {
  const i = rp(t, e, n, r), o = a3(s, i), a = Xs(s3(s)), c = sp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function ip(t, e, n, r, s, i) {
  const o = rp(t, e, n, r), a = Xs(n3(o, i, s)), c = sp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function p3() {
  const t = np(Ct.P2PKH, "", 0, 0);
  return t.signer = uS().hash160, t.keyEncoding = zt.Compressed, t.signature = Rl(), t;
}
function Ff(t, e, n) {
  return bi(t) ? g3(t, e, n) : y3(t, e, n);
}
function g3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = ip(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Dl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Cr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function y3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case z.PublicKey:
        Ys(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case z.MessageSignature:
        c.pubKeyEncoding === zt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = ip(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Of(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new Cr("Too many signatures");
        break;
    }
  if (Of(t.hashMode) && o !== t.signaturesRequired || c3(t.hashMode) && o < t.signaturesRequired)
    throw new Cr("Incorrect number of signatures");
  if (i && (t.hashMode === Ct.P2WSH || t.hashMode === Ct.P2WSHNonSequential))
    throw new Cr("Uncompressed keys are not allowed in this hash mode");
  const a = Dl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Cr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function op(t) {
  return {
    authType: Vt.Standard,
    spendingCondition: t
  };
}
function ap(t, e) {
  return {
    authType: Vt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || np(Ct.P2PKH, "0".repeat(66), 0, 0)
  };
}
function jf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Vt.Standard:
        return op(Df(t.spendingCondition));
      case Vt.Sponsored:
        return ap(Df(t.spendingCondition), p3());
      default:
        throw new Fo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function w3(t, e) {
  switch (t.authType) {
    case Vt.Standard:
      return Ff(t.spendingCondition, e, Vt.Standard);
    case Vt.Sponsored:
      return Ff(t.spendingCondition, e, Vt.Standard);
    default:
      throw new Fo("Invalid origin auth type");
  }
}
function b3(t, e) {
  switch (t.authType) {
    case Vt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: de(e)
      };
      return { ...t, spendingCondition: n };
    case Vt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: de(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function m3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: de(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function x3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: de(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function S3(t, e) {
  const n = {
    ...e,
    nonce: de(e.nonce),
    fee: de(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function E3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Vt.Standard:
      e.push(ja(t.spendingCondition));
      break;
    case Vt.Sponsored:
      e.push(ja(t.spendingCondition)), e.push(ja(t.sponsorSpendingCondition));
      break;
  }
  return Jt(e);
}
function A3(t) {
  const e = t.readUInt8Enum(Vt, (r) => {
    throw new ye(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Vt.Standard:
      return n = za(t), op(n);
    case Vt.Sponsored:
      n = za(t);
      const r = za(t);
      return ap(n, r);
  }
}
class $3 {
  constructor({ auth: e, payload: n, postConditions: r = Hl([]), postConditionMode: s = Do.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Zm(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: de(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Be.Any;
  }
  signBegin() {
    const e = Nc(this);
    return e.auth = jf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Nc(this);
    return e.auth = jf(e.auth), e.txid();
  }
  verifyOrigin() {
    return w3(this.auth, this.verifyBegin());
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
    if (r && !bi(r)) {
      const s = Ys(n.data);
      r.fields.push(Es(s ? zt.Compressed : zt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = h3(n, r, e.fee, e.nonce, s);
    if (bi(e))
      e.signature = Cc(i);
    else {
      const a = ep(s);
      e.fields.push(Es(a ? zt.Compressed : zt.Uncompressed, Cc(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return jl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Vt.Sponsored)
      throw new Fo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = S3(this.auth, e);
  }
  setFee(e) {
    this.auth = b3(this.auth, e);
  }
  setNonce(e) {
    this.auth = m3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Vt.Sponsored)
      throw new Fo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = x3(this.auth, e);
  }
  serialize() {
    return J(this.serializeBytes());
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
    return Pr(n, this.chainId, 0), e.push(n), e.push(E3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Pl(this.postConditions)), e.push(Z0(this.payload)), Jt(e);
  }
}
function v3(t) {
  const e = ve(t, _t) ? t : new _t(t), n = e.readUInt8Enum(Vr, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = A3(e), i = e.readUInt8Enum(Be, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Do, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = X0(e, z.PostCondition), c = $S(e), u = new $3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const zf = BigInt("18446744073709551615");
function Ra(t) {
  const e = de(t);
  if (e < 0n || e > zf)
    throw new RangeError(`Post-condition amount must be between 0 and ${zf} (u64 max), received: ${e}`);
  return e;
}
var Uc;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Uc || (Uc = {}));
var Hc;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Hc || (Hc = {}));
function I3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Pt.STX,
        principal: t.address === "origin" ? { type: z.Principal, prefix: be.Origin } : si(t.address),
        conditionCode: so(t.condition),
        amount: Ra(t.amount)
      };
    case "ft-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Pt.Fungible,
        principal: t.address === "origin" ? { type: z.Principal, prefix: be.Origin } : si(t.address),
        conditionCode: so(t.condition),
        amount: Ra(t.amount),
        asset: Hf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Pt.NonFungible,
        principal: t.address === "origin" ? { type: z.Principal, prefix: be.Origin } : si(t.address),
        conditionCode: so(t.condition),
        asset: Hf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Pt.Staking,
        principal: t.address === "origin" ? { type: z.Principal, prefix: be.Origin } : si(t.address),
        conditionCode: so(t.condition),
        amount: Ra(t.amount)
      };
    case "pox-postcondition":
      return {
        type: z.PostCondition,
        conditionType: Pt.PoX,
        principal: t.address === "origin" ? { type: z.Principal, prefix: be.Origin } : si(t.address),
        conditionCode: L3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function so(t) {
  return Uc[t];
}
function L3(t) {
  return Hc[t];
}
function cp(t) {
  const e = I3(t);
  return ES(e);
}
function k3(t, e, n) {
  return Kl(lp(t), n);
}
function lp(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = mi(r);
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
    return BigInt(`0x${T3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Gl(t, e = 8) {
  return (typeof t == "bigint" ? t : lp(t)).toString(16).padStart(e * 2, "0");
}
function Kl(t, e = 16) {
  const n = Gl(t, e);
  return mi(n);
}
function C3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const B3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function T3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += B3[n];
  return e;
}
function mi(t) {
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
function Vl(t) {
  return new TextEncoder().encode(t);
}
function M3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function _3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Rf(t) {
  if (t.some(_3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ql(...t) {
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
function Un(t) {
  return ql(...t.map((e) => typeof e == "number" ? Rf([e]) : e instanceof Array ? Rf(e) : e));
}
function ha(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Pc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Pc || (Pc = {}));
Pc.Mainnet;
const N3 = 128, U3 = 128, up = 16;
var Oc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Oc || (Oc = {}));
var Gf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Gf || (Gf = {}));
var Kf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Kf || (Kf = {}));
var We;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(We || (We = {}));
const Ga = ["onChainOnly", "offChainOnly", "any"];
Ga[0] + "", We.OnChainOnly, Ga[1] + "", We.OffChainOnly, Ga[2] + "", We.Any, We.OnChainOnly + "", We.OnChainOnly, We.OffChainOnly + "", We.OffChainOnly, We.Any + "", We.Any;
var Dc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Dc || (Dc = {}));
Dc.Mainnet;
var Vf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Vf || (Vf = {}));
var vr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(vr || (vr = {}));
var qf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(qf || (qf = {}));
var Wf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Wf || (Wf = {}));
var Xf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Xf || (Xf = {}));
var Yf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Yf || (Yf = {}));
var Zf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Zf || (Zf = {}));
var Qf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Qf || (Qf = {}));
var Fc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Fc || (Fc = {}));
var Jf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Jf || (Jf = {}));
var td;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(td || (td = {}));
function jc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function H3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function fp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function P3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  jc(t.outputLen), jc(t.blockLen);
}
function O3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function D3(t, e) {
  fp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ka = {
  number: jc,
  bool: H3,
  bytes: fp,
  hash: P3,
  exists: O3,
  output: D3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Va = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), on = (t, e) => t << 32 - e | t >>> e, F3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!F3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function j3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function dp(t) {
  if (typeof t == "string" && (t = j3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let z3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function os(t) {
  const e = (r) => t().update(dp(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function R3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Wl = class extends z3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Va(this.buffer);
  }
  update(e) {
    Ka.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = dp(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Va(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ka.exists(this), Ka.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    R3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Va(e), c = this.outputLen;
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
const G3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), hp = Uint8Array.from({ length: 16 }, (t, e) => e), K3 = hp.map((t) => (9 * t + 5) % 16);
let Xl = [hp], Yl = [K3];
for (let t = 0; t < 4; t++)
  for (let e of [Xl, Yl])
    e.push(e[t].map((n) => G3[n]));
const pp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), V3 = Xl.map((t, e) => t.map((n) => pp[e][n])), q3 = Yl.map((t, e) => t.map((n) => pp[e][n])), W3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), X3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), io = (t, e) => t << e | t >>> 32 - e;
function ed(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oo = new Uint32Array(16);
let Y3 = class extends Wl {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = W3[h], v = X3[h], N = Xl[h], _ = Yl[h], b = V3[h], k = q3[h];
      for (let $ = 0; $ < 16; $++) {
        const O = io(r + ed(h, i, a, u) + oo[N[$]] + w, b[$]) + l | 0;
        r = l, l = u, u = io(a, 10) | 0, a = i, i = O;
      }
      for (let $ = 0; $ < 16; $++) {
        const O = io(s + ed(y, o, c, d) + oo[_[$]] + v, k[$]) + g | 0;
        s = g, g = d, d = io(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    oo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
os(() => new Y3());
const Z3 = (t, e, n) => t & e ^ ~t & n, Q3 = (t, e, n) => t & e ^ t & n ^ e & n, J3 = new Uint32Array([
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
let gp = class extends Wl {
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
      const g = nr[l - 15], h = nr[l - 2], y = on(g, 7) ^ on(g, 18) ^ g >>> 3, w = on(h, 17) ^ on(h, 19) ^ h >>> 10;
      nr[l] = w + nr[l - 7] + y + nr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = on(a, 6) ^ on(a, 11) ^ on(a, 25), h = d + g + Z3(a, c, u) + J3[l] + nr[l] | 0, w = (on(r, 2) ^ on(r, 13) ^ on(r, 22)) + Q3(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    nr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, t4 = class extends gp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
os(() => new gp());
os(() => new t4());
const ao = BigInt(2 ** 32 - 1), zc = BigInt(32);
function yp(t, e = !1) {
  return e ? { h: Number(t & ao), l: Number(t >> zc & ao) } : { h: Number(t >> zc & ao) | 0, l: Number(t & ao) | 0 };
}
function e4(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = yp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const n4 = (t, e) => BigInt(t >>> 0) << zc | BigInt(e >>> 0), r4 = (t, e, n) => t >>> n, s4 = (t, e, n) => t << 32 - n | e >>> n, i4 = (t, e, n) => t >>> n | e << 32 - n, o4 = (t, e, n) => t << 32 - n | e >>> n, a4 = (t, e, n) => t << 64 - n | e >>> n - 32, c4 = (t, e, n) => t >>> n - 32 | e << 64 - n, l4 = (t, e) => e, u4 = (t, e) => t, f4 = (t, e, n) => t << n | e >>> 32 - n, d4 = (t, e, n) => e << n | t >>> 32 - n, h4 = (t, e, n) => e << n - 32 | t >>> 64 - n, p4 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function g4(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const y4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), w4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, b4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), m4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, x4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), S4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ft = {
  fromBig: yp,
  split: e4,
  toBig: n4,
  shrSH: r4,
  shrSL: s4,
  rotrSH: i4,
  rotrSL: o4,
  rotrBH: a4,
  rotrBL: c4,
  rotr32H: l4,
  rotr32L: u4,
  rotlSH: f4,
  rotlSL: d4,
  rotlBH: h4,
  rotlBL: p4,
  add: g4,
  add3L: y4,
  add3H: w4,
  add4L: b4,
  add4H: m4,
  add5H: S4,
  add5L: x4
}, [E4, A4] = ft.split([
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
let pa = class extends Wl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: h, Gl: y, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, h, y, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, h, y, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      rr[b] = e.getUint32(n), sr[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const k = rr[b - 15] | 0, $ = sr[b - 15] | 0, O = ft.rotrSH(k, $, 1) ^ ft.rotrSH(k, $, 8) ^ ft.shrSH(k, $, 7), q = ft.rotrSL(k, $, 1) ^ ft.rotrSL(k, $, 8) ^ ft.shrSL(k, $, 7), H = rr[b - 2] | 0, K = sr[b - 2] | 0, m = ft.rotrSH(H, K, 19) ^ ft.rotrBH(H, K, 61) ^ ft.shrSH(H, K, 6), I = ft.rotrSL(H, K, 19) ^ ft.rotrBL(H, K, 61) ^ ft.shrSL(H, K, 6), D = ft.add4L(q, I, sr[b - 7], sr[b - 16]), R = ft.add4H(D, O, m, rr[b - 7], rr[b - 16]);
      rr[b] = R | 0, sr[b] = D | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: h, Fl: y, Gh: w, Gl: v, Hh: N, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const k = ft.rotrSH(l, g, 14) ^ ft.rotrSH(l, g, 18) ^ ft.rotrBH(l, g, 41), $ = ft.rotrSL(l, g, 14) ^ ft.rotrSL(l, g, 18) ^ ft.rotrBL(l, g, 41), O = l & h ^ ~l & w, q = g & y ^ ~g & v, H = ft.add5L(_, $, q, A4[b], sr[b]), K = ft.add5H(H, N, k, O, E4[b], rr[b]), m = H | 0, I = ft.rotrSH(r, s, 28) ^ ft.rotrBH(r, s, 34) ^ ft.rotrBH(r, s, 39), D = ft.rotrSL(r, s, 28) ^ ft.rotrBL(r, s, 34) ^ ft.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, tt = s & o ^ s & c ^ o & c;
      N = w | 0, _ = v | 0, w = h | 0, v = y | 0, h = l | 0, y = g | 0, { h: l, l: g } = ft.add(u | 0, d | 0, K | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const F = ft.add3L(m, D, tt);
      r = ft.add3H(F, K, I, R), s = F | 0;
    }
    ({ h: r, l: s } = ft.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ft.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ft.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = ft.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = ft.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: y } = ft.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: v } = ft.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: N, l: _ } = ft.add(this.Hh | 0, this.Hl | 0, N | 0, _ | 0), this.set(r, s, i, o, a, c, u, d, l, g, h, y, w, v, N, _);
  }
  roundClean() {
    rr.fill(0), sr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, $4 = class extends pa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, v4 = class extends pa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, I4 = class extends pa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
os(() => new pa());
os(() => new $4());
os(() => new v4());
os(() => new I4());
function L4(t, e, n) {
  const s = N3;
  if (R4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Oc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var oe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(oe || (oe = {}));
let k4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, wp = class extends k4 {
  constructor(e) {
    super(e);
  }
};
function ga(t) {
  const e = [];
  return e.push(mi(Gl(t.version, 1))), e.push(mi(t.hash160)), Un(e);
}
function C4(t) {
  const e = [];
  return e.push(t.prefix), e.push(ga(t.address)), t.prefix === Fc.Contract && e.push(xi(t.contractName)), Un(e);
}
function xi(t) {
  const e = [], n = Vl(t.content), r = n.byteLength;
  return e.push(mi(Gl(r, t.lengthPrefixBytes))), e.push(n), Un(e);
}
function B4(t) {
  const e = [];
  return e.push(ga(t.address)), e.push(xi(t.contractName)), e.push(xi(t.assetName)), Un(e);
}
function bp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(C4(t.principal)), (t.conditionType === vr.Fungible || t.conditionType === vr.NonFungible) && e.push(B4(t.assetInfo)), t.conditionType === vr.NonFungible && e.push(Wr(t.assetName)), e.push(t.conditionCode), t.conditionType === vr.STX || t.conditionType === vr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new wp("The post-condition amount may not be larger than 8 bytes");
    e.push(k3(t.amount, !1, 8));
  }
  return Un(e);
}
function yn(t, e) {
  return Un([t, e]);
}
function T4(t) {
  return new Uint8Array([t.type]);
}
function M4(t) {
  return t.type === oe.OptionalNone ? new Uint8Array([t.type]) : yn(t.type, Wr(t.value));
}
function _4(t) {
  const e = new Uint8Array(4);
  return ha(e, t.buffer.length, 0), yn(t.type, ql(e, t.buffer));
}
function N4(t) {
  const e = Kl(C3(t.value, BigInt(U3)), up);
  return yn(t.type, e);
}
function U4(t) {
  const e = Kl(t.value, up);
  return yn(t.type, e);
}
function H4(t) {
  return yn(t.type, ga(t.address));
}
function P4(t) {
  return yn(t.type, ql(ga(t.address), xi(t.contractName)));
}
function O4(t) {
  return yn(t.type, Wr(t.value));
}
function D4(t) {
  const e = [], n = new Uint8Array(4);
  ha(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Wr(r);
    e.push(s);
  }
  return yn(t.type, Un(e));
}
function F4(t) {
  const e = [], n = new Uint8Array(4);
  ha(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = L4(s);
    e.push(xi(i));
    const o = Wr(t.data[s]);
    e.push(o);
  }
  return yn(t.type, Un(e));
}
function mp(t, e) {
  const n = [], r = e == "ascii" ? M3(t.data) : Vl(t.data), s = new Uint8Array(4);
  return ha(s, r.length, 0), n.push(s), n.push(r), yn(t.type, Un(n));
}
function j4(t) {
  return mp(t, "ascii");
}
function z4(t) {
  return mp(t, "utf8");
}
function Wr(t) {
  switch (t.type) {
    case oe.BoolTrue:
    case oe.BoolFalse:
      return T4(t);
    case oe.OptionalNone:
    case oe.OptionalSome:
      return M4(t);
    case oe.Buffer:
      return _4(t);
    case oe.UInt:
      return U4(t);
    case oe.Int:
      return N4(t);
    case oe.PrincipalStandard:
      return H4(t);
    case oe.PrincipalContract:
      return P4(t);
    case oe.ResponseOk:
    case oe.ResponseErr:
      return O4(t);
    case oe.List:
      return D4(t);
    case oe.Tuple:
      return F4(t);
    case oe.StringASCII:
      return j4(t);
    case oe.StringUTF8:
      return z4(t);
    default:
      throw new wp("Unable to serialize. Invalid Clarity Value.");
  }
}
const R4 = (t, e) => t ? Vl(t).length > e : !1, G4 = "connect-ui";
let Eo, xp, Te = !1, Rc = !1;
const Nn = (t, e = "") => () => {
}, K4 = (t, e) => () => {
}, V4 = "{visibility:hidden}.hydrated{visibility:inherit}", nd = {}, q4 = "http://www.w3.org/2000/svg", W4 = "http://www.w3.org/1999/xhtml", X4 = (t) => t != null, Zl = (t) => (t = typeof t, t === "object" || t === "function");
function Sp(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const it = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Zl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Gc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Gc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Gc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, Y4 = {}, Z4 = (t) => t && t.$tag$ === Y4, Q4 = (t, e) => t != null && !Zl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, J4 = (t) => Zs(t).$hostElement$, tE = (t, e, n) => {
  const r = fe.ce(e, n);
  return t.dispatchEvent(r), r;
}, rd = /* @__PURE__ */ new WeakMap(), eE = (t, e, n) => {
  let r = jo.get(t);
  SE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, jo.set(t, r);
}, nE = (t, e, n, r) => {
  var s;
  let i = Ep(e);
  const o = jo.get(i);
  if (t = t.nodeType === 11 ? t : dn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = rd.get(t), c;
      if (a || rd.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = dn.createElement("style"), c.innerHTML = o;
          const u = (s = fe.$nonce$) !== null && s !== void 0 ? s : Sp(dn);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, rE = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Nn("attachStyles", e.$tagName$), i = nE(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Ep = (t, e) => "sc-" + t.$tagName$, sd = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = od(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = id(n), d = id(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : od(ya, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && fe.rel(t, e, n, !1), r && fe.ael(t, e, r, !1);
    else {
      const c = Zl(r);
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
}, sE = /\s/, id = (t) => t ? t.split(sE) : [], Ap = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || nd, o = e.$attrs$ || nd;
  for (r in i)
    r in o || sd(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    sd(s, r, i[r], o[r], n, e.$flags$);
}, Ql = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = dn.createTextNode(s.$text$);
  else {
    if (Te || (Te = s.$tag$ === "svg"), o = s.$elm$ = dn.createElementNS(Te ? q4 : W4, s.$tag$), Te && s.$tag$ === "foreignObject" && (Te = !1), Ap(null, s, Te), X4(Eo) && o["s-si"] !== Eo && o.classList.add(o["s-si"] = Eo), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Ql(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Te = !1 : o.tagName === "foreignObject" && (Te = !0);
  }
  return o;
}, $p = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === xp && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Ql(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, vp = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, iE = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : co(a, d) ? (ii(a, d), a = e[++s], d = r[++i]) : co(c, l) ? (ii(c, l), c = e[--o], l = r[--u]) : co(a, l) ? (ii(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : co(c, d) ? (ii(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = Ql(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? $p(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && vp(e, s, o);
}, co = (t, e) => t.$tag$ === e.$tag$, ii = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Te = i === "svg" ? !0 : i === "foreignObject" ? !1 : Te, Ap(t, e, Te), r !== null && s !== null ? iE(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), $p(n, null, e, s, 0, s.length - 1)) : r !== null && vp(r, 0, r.length - 1), Te && i === "svg" && (Te = !1)) : t.$text$ !== o && (n.data = o);
}, oE = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Gc(null, null), s = Z4(e) ? e : it(null, null, e);
  xp = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Eo = n["s-sc"], ii(r, s);
}, Ip = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Jl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Ip(t, t.$ancestorComponent$), AE(() => aE(t, e));
}, aE = (t, e) => {
  const n = Nn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), fE(s, () => cE(t, r, e));
}, cE = async (t, e, n) => {
  const r = t.$hostElement$, s = Nn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && rE(t);
  const o = Nn("render", t.$cmpMeta$.$tagName$);
  lE(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => uE(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, lE = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, oE(t, e);
  } catch (r) {
    Si(r, t.$hostElement$);
  }
  return null;
}, uE = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Nn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, kp(n), r(), t.$onReadyResolve$(n), s || Lp()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && eu(() => Jl(t, !1)), t.$flags$ &= -517;
}, Lp = (t) => {
  kp(dn.documentElement), eu(() => tE(ya, "appload", { detail: { namespace: G4 } }));
}, fE = (t, e) => t && t.then ? t.then(e) : e(), kp = (t) => t.classList.add("hydrated"), dE = (t, e) => Zs(t).$instanceValues$.get(e), hE = (t, e, n, r) => {
  const s = Zs(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = Q4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Jl(s, !1));
}, Cp = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return dE(this, i);
        },
        set(a) {
          hE(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        fe.jmp(() => {
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
}, pE = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = xE(n), s.then) {
        const c = K4();
        s = await s, c();
      }
      s.isProxied || (Cp(
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
        Si(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Ep(n);
      if (!jo.has(c)) {
        const u = Nn("registerStyles", n.$tagName$);
        eE(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Jl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, gE = (t) => {
  if (!(fe.$flags$ & 1)) {
    const e = Zs(t), n = e.$cmpMeta$, r = Nn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Ip(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), pE(t, e, n);
    }
    r();
  }
}, yE = (t) => {
  fe.$flags$ & 1 || Zs(t);
}, wE = (t, e = {}) => {
  var n;
  const r = Nn(), s = [], i = e.exclude || [], o = ya.customElements, a = dn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ dn.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(fe, e), fe.$resourcesUrl$ = new URL(e.resourcesUrl || "./", dn.baseURI).href, t.map((h) => {
    h[1].map((y) => {
      const w = {
        $flags$: y[0],
        $tagName$: y[1],
        $members$: y[2],
        $listeners$: y[3]
      };
      w.$members$ = y[2];
      const v = w.$tagName$, N = class extends HTMLElement {
        // StencilLazyHost
        constructor(_) {
          super(_), _ = this, mE(_, w), w.$flags$ & 1 && _.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : fe.jmp(() => gE(this));
        }
        disconnectedCallback() {
          fe.jmp(() => yE(this));
        }
        componentOnReady() {
          return Zs(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = h[0], !i.includes(v) && !o.get(v) && (s.push(v), o.define(v, Cp(
        N,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + V4, u.setAttribute("data-styles", "");
    const h = (n = fe.$nonce$) !== null && n !== void 0 ? n : Sp(dn);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((h) => h.connectedCallback()) : fe.jmp(() => l = setTimeout(Lp, 30)), r();
}, tu = /* @__PURE__ */ new WeakMap(), Zs = (t) => tu.get(t), bE = (t, e) => tu.set(e.$lazyInstance$ = t, e), mE = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], tu.set(t, n);
}, od = (t, e) => e in t, Si = (t, e) => (0, console.error)(t, e), qa = /* @__PURE__ */ new Map(), xE = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = qa.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (qa.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => I$).then(o, Si);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (qa.set(s, o), o[r]), Si);
}, jo = /* @__PURE__ */ new Map(), ya = typeof window < "u" ? window : {}, dn = ya.document || { head: {} }, fe = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Bp = (t) => Promise.resolve(t), SE = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), ad = [], Tp = [], EE = (t, e) => (n) => {
  t.push(n), Rc || (Rc = !0, fe.$flags$ & 4 ? eu(Kc) : fe.raf(Kc));
}, cd = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Si(n);
    }
  t.length = 0;
}, Kc = () => {
  cd(ad), cd(Tp), (Rc = ad.length > 0) && fe.raf(Kc);
}, eu = (t) => Bp().then(t), AE = /* @__PURE__ */ EE(Tp), $E = () => Bp(), vE = (t, e) => typeof window > "u" ? Promise.resolve() : $E().then(() => wE([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var IE = Object.defineProperty, LE = Object.defineProperties, kE = Object.getOwnPropertyDescriptors, zo = Object.getOwnPropertySymbols, Mp = Object.prototype.hasOwnProperty, _p = Object.prototype.propertyIsEnumerable, ld = (t, e, n) => e in t ? IE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, He = (t, e) => {
  for (var n in e || (e = {})) Mp.call(e, n) && ld(t, n, e[n]);
  if (zo) for (var n of zo(e)) _p.call(e, n) && ld(t, n, e[n]);
  return t;
}, tn = (t, e) => LE(t, kE(e)), Np = (t, e) => {
  var n = {};
  for (var r in t) Mp.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && zo) for (var r of zo(t)) e.indexOf(r) < 0 && _p.call(t, r) && (n[r] = t[r]);
  return n;
};
function Up() {
  return la(zr()) || window.StacksProvider || window.BlockstackProvider;
}
function wa(t) {
  return t ? typeof t == "string" ? Gr.fromName(t) : "version" in t ? t : "url" in t ? new mc({ url: t.url }) : t.transactionVersion === Vr.Mainnet ? new mc({ url: t.client.baseUrl }) : new xc({ url: t.client.baseUrl }) : new xc();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var CE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(CE || {}), BE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(BE || {}), nu = (t) => {
  let e = t;
  if (!e) {
    let n = new ph(["store_write"], document.location.href);
    e = new bc({ appConfig: n });
  }
  return e;
};
function Hp(t) {
  try {
    return nu(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Pp = (t) => {
  let e = nu(t).loadUserData().appPrivateKey, n = le.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function TE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Kr.Mainnet]: "mainnet", [Kr.Testnet]: "testnet" }, a = wa(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function ME(t) {
  let e = wa(t.network), n = nu(t.userSession), r = tn(He({}, t), { network: e, userSession: n });
  return He({ stxAddress: TE(r) }, r);
}
async function _E(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(cp) : n = n.map((r) => J(bp(r)))), new le.TokenSigner("ES256k", e).signAsync(tn(He({}, t), { postConditions: n }));
}
function NE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(cp) : e = e.map((n) => J(bp(n)))), le.createUnsecuredToken(tn(He({}, t), { postConditions: e }));
}
var UE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = At(a.replace(/^0x/, "")), u = v3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, tn(He({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, tn(He({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, HE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Np(e, ["amount", "appDetails", "userSession"]);
  if (Hp(s)) {
    let { privateKey: a, publicKey: c } = Pp(s), u = tn(He({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), _E(u, a);
  }
  let o = tn(He({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), NE(o);
};
async function PE(t, e, n) {
  let r = await e(tn(He(He({}, ME(t)), t), { network: wa(t.network) }));
  return UE({ token: r, options: t }, n);
}
function OE(t, e = Up()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return PE(t, HE, e);
}
function Op(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? tn(He({}, t), { message: Pf(e), domain: Pf(n) }) : tn(He({}, t), { message: J(Wr(e)), domain: J(Wr(n)) });
}
async function DE(t, e) {
  return new le.TokenSigner("ES256k", e).signAsync(Op(t));
}
async function FE(t) {
  let e = t, { userSession: n } = e, r = Np(e, ["userSession"]);
  if (Hp(n)) {
    let { privateKey: s, publicKey: i } = Pp(n), o = tn(He({}, r), { publicKey: i });
    return DE(o, s);
  }
  return le.createUnsecuredToken(Op(t));
}
var jE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(jE || {}), Dp = "asigna-stx", ud = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Dp && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(RE(t, e), "*");
}), zE = { authenticationRequest: async (t) => ud(t, "authenticationRequest"), transactionRequest: async (t) => ud(t, "transactionRequest") }, RE = (t, e) => ({ source: Dp, [e]: t }), GE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = zE);
};
GE();
var KE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function VE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = zr(), o = Up();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    vE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : KE, c = Pm(a), u = document.createElement("connect-modal");
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
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), u.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var lo = VE(OE);
function br(t, e, n) {
  return ru(xe(t, e), n);
}
function xe(t, e) {
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
      const r = XE(BigInt(`0x${bt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${bt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function fd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ui(t, e = 8) {
  return (typeof t == "bigint" ? t : xe(t, !1)).toString(16).padStart(e * 2, "0");
}
function ba(t) {
  return parseInt(t, 16);
}
function ru(t, e = 16) {
  const n = Ui(t, e);
  return Dt(n);
}
function qE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function WE(t, e) {
  return t & BigInt(1) << e;
}
function XE(t, e) {
  return WE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const YE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += YE[n];
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
function Qs(t) {
  return new TextEncoder().encode(t);
}
function su(t) {
  return new TextDecoder().decode(t);
}
function Fp(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function ZE(t) {
  return String.fromCharCode.apply(null, t);
}
function QE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function dd(t) {
  if (t.some(QE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ma(...t) {
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
function te(t) {
  return ma(...t.map((e) => typeof e == "number" ? dd([e]) : e instanceof Array ? dd(e) : e));
}
var hd;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(gd || (gd = {}));
const jp = 33, Wa = 32;
function JE(t) {
  if (t.length < Wa * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Wa * 2), r = t.slice(2 + Wa * 2);
  return {
    recoveryId: ba(e),
    r: n,
    s: r
  };
}
function tA(t) {
  const e = typeof t == "string" ? Dt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function eA(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function nA(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function rA(t, e) {
  return t[e];
}
function sA(t, e, n = 0) {
  return t[n] = e, t;
}
function iA(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Xr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Vc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Vc || (Vc = {}));
const oA = Vc.Mainnet, aA = 128, cA = 128, zp = 16, Nr = 32, qc = 80, xa = 65, lA = 32, uA = 64, Ro = 34;
var Q;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Q || (Q = {}));
var pt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(pt || (pt = {}));
var Wc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Wc || (Wc = {}));
var Ae;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ae || (Ae = {}));
const Ao = ["onChainOnly", "offChainOnly", "any"], yd = {
  [Ao[0]]: Ae.OnChainOnly,
  [Ao[1]]: Ae.OffChainOnly,
  [Ao[2]]: Ae.Any,
  [Ae.OnChainOnly]: Ae.OnChainOnly,
  [Ae.OffChainOnly]: Ae.OffChainOnly,
  [Ae.Any]: Ae.Any
};
function fA(t) {
  if (t in yd)
    return yd[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Ao.join(", ")}`);
}
var Go;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Go || (Go = {}));
Go.Mainnet;
var Fs;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Fs || (Fs = {}));
var $e;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})($e || ($e = {}));
var qt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(qt || (qt = {}));
var Bt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Bt || (Bt = {}));
var Ko;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ko || (Ko = {}));
var Rt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Rt || (Rt = {}));
var Ei;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ei || (Ei = {}));
var Xc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Xc || (Xc = {}));
var Ai;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ai || (Ai = {}));
var wd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wd || (wd = {}));
var bd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(bd || (bd = {}));
function Yc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function dA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Rp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function hA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Yc(t.outputLen), Yc(t.blockLen);
}
function pA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function gA(t, e) {
  Rp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Tr = {
  number: Yc,
  bool: dA,
  bytes: Rp,
  hash: hA,
  exists: pA,
  output: gA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), an = (t, e) => t << 32 - e | t >>> e, yA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function iu(t) {
  if (typeof t == "string" && (t = wA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Gp {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function as(t) {
  const e = (r) => t().update(iu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function bA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class ou extends Gp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Xa(this.buffer);
  }
  update(e) {
    Tr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = iu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Xa(e);
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
    bA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Xa(e), c = this.outputLen;
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
const mA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Kp = Uint8Array.from({ length: 16 }, (t, e) => e), xA = Kp.map((t) => (9 * t + 5) % 16);
let au = [Kp], cu = [xA];
for (let t = 0; t < 4; t++)
  for (let e of [au, cu])
    e.push(e[t].map((n) => mA[n]));
const Vp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), SA = au.map((t, e) => t.map((n) => Vp[e][n])), EA = cu.map((t, e) => t.map((n) => Vp[e][n])), AA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), $A = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), uo = (t, e) => t << e | t >>> 32 - e;
function md(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fo = new Uint32Array(16);
class vA extends ou {
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
      fo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = AA[h], v = $A[h], N = au[h], _ = cu[h], b = SA[h], k = EA[h];
      for (let $ = 0; $ < 16; $++) {
        const O = uo(r + md(h, i, a, u) + fo[N[$]] + w, b[$]) + l | 0;
        r = l, l = u, u = uo(a, 10) | 0, a = i, i = O;
      }
      for (let $ = 0; $ < 16; $++) {
        const O = uo(s + md(y, o, c, d) + fo[_[$]] + v, k[$]) + g | 0;
        s = g, g = d, d = uo(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    fo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const IA = as(() => new vA()), LA = (t, e, n) => t & e ^ ~t & n, kA = (t, e, n) => t & e ^ t & n ^ e & n, CA = new Uint32Array([
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
class qp extends ou {
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
      const g = or[l - 15], h = or[l - 2], y = an(g, 7) ^ an(g, 18) ^ g >>> 3, w = an(h, 17) ^ an(h, 19) ^ h >>> 10;
      or[l] = w + or[l - 7] + y + or[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = an(a, 6) ^ an(a, 11) ^ an(a, 25), h = d + g + LA(a, c, u) + CA[l] + or[l] | 0, w = (an(r, 2) ^ an(r, 13) ^ an(r, 22)) + kA(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    or.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class BA extends qp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const lu = as(() => new qp());
as(() => new BA());
const ho = BigInt(2 ** 32 - 1), Zc = BigInt(32);
function Wp(t, e = !1) {
  return e ? { h: Number(t & ho), l: Number(t >> Zc & ho) } : { h: Number(t >> Zc & ho) | 0, l: Number(t & ho) | 0 };
}
function TA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Wp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const MA = (t, e) => BigInt(t >>> 0) << Zc | BigInt(e >>> 0), _A = (t, e, n) => t >>> n, NA = (t, e, n) => t << 32 - n | e >>> n, UA = (t, e, n) => t >>> n | e << 32 - n, HA = (t, e, n) => t << 32 - n | e >>> n, PA = (t, e, n) => t << 64 - n | e >>> n - 32, OA = (t, e, n) => t >>> n - 32 | e << 64 - n, DA = (t, e) => e, FA = (t, e) => t, jA = (t, e, n) => t << n | e >>> 32 - n, zA = (t, e, n) => e << n | t >>> 32 - n, RA = (t, e, n) => e << n - 32 | t >>> 64 - n, GA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function KA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const VA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), qA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, WA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), XA = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, YA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ZA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, dt = {
  fromBig: Wp,
  split: TA,
  toBig: MA,
  shrSH: _A,
  shrSL: NA,
  rotrSH: UA,
  rotrSL: HA,
  rotrBH: PA,
  rotrBL: OA,
  rotr32H: DA,
  rotr32L: FA,
  rotlSH: jA,
  rotlSL: zA,
  rotlBH: RA,
  rotlBL: GA,
  add: KA,
  add3L: VA,
  add3H: qA,
  add4L: WA,
  add4H: XA,
  add5H: ZA,
  add5L: YA
}, [QA, JA] = dt.split([
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
class Sa extends ou {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: h, Gl: y, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, h, y, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, h, y, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      ar[b] = e.getUint32(n), cr[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const k = ar[b - 15] | 0, $ = cr[b - 15] | 0, O = dt.rotrSH(k, $, 1) ^ dt.rotrSH(k, $, 8) ^ dt.shrSH(k, $, 7), q = dt.rotrSL(k, $, 1) ^ dt.rotrSL(k, $, 8) ^ dt.shrSL(k, $, 7), H = ar[b - 2] | 0, K = cr[b - 2] | 0, m = dt.rotrSH(H, K, 19) ^ dt.rotrBH(H, K, 61) ^ dt.shrSH(H, K, 6), I = dt.rotrSL(H, K, 19) ^ dt.rotrBL(H, K, 61) ^ dt.shrSL(H, K, 6), D = dt.add4L(q, I, cr[b - 7], cr[b - 16]), R = dt.add4H(D, O, m, ar[b - 7], ar[b - 16]);
      ar[b] = R | 0, cr[b] = D | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: h, Fl: y, Gh: w, Gl: v, Hh: N, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const k = dt.rotrSH(l, g, 14) ^ dt.rotrSH(l, g, 18) ^ dt.rotrBH(l, g, 41), $ = dt.rotrSL(l, g, 14) ^ dt.rotrSL(l, g, 18) ^ dt.rotrBL(l, g, 41), O = l & h ^ ~l & w, q = g & y ^ ~g & v, H = dt.add5L(_, $, q, JA[b], cr[b]), K = dt.add5H(H, N, k, O, QA[b], ar[b]), m = H | 0, I = dt.rotrSH(r, s, 28) ^ dt.rotrBH(r, s, 34) ^ dt.rotrBH(r, s, 39), D = dt.rotrSL(r, s, 28) ^ dt.rotrBL(r, s, 34) ^ dt.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, tt = s & o ^ s & c ^ o & c;
      N = w | 0, _ = v | 0, w = h | 0, v = y | 0, h = l | 0, y = g | 0, { h: l, l: g } = dt.add(u | 0, d | 0, K | 0, m | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const F = dt.add3L(m, D, tt);
      r = dt.add3H(F, K, I, R), s = F | 0;
    }
    ({ h: r, l: s } = dt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = dt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = dt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = dt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = dt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: y } = dt.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: v } = dt.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: N, l: _ } = dt.add(this.Hh | 0, this.Hl | 0, N | 0, _ | 0), this.set(r, s, i, o, a, c, u, d, l, g, h, y, w, v, N, _);
  }
  roundClean() {
    ar.fill(0), cr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class t8 extends Sa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class e8 extends Sa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class n8 extends Sa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
as(() => new Sa());
as(() => new t8());
const r8 = as(() => new e8());
as(() => new n8());
function Xp(t) {
  if (Dt(t).byteLength != xa)
    throw Error("Invalid signature");
  return {
    type: Q.MessageSignature,
    data: t
  };
}
function oi(t, e) {
  return { type: Q.Address, version: t, hash160: e };
}
function As(t) {
  return ss.c32address(t.version, t.hash160);
}
function Yr(t, e, n) {
  const r = e || 1, s = n || aA;
  if (dg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Q.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function uu(t) {
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
function s8(t) {
  if (t.type === P.PrincipalStandard)
    return As(t.address);
  if (t.type === P.PrincipalContract)
    return `${As(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Yp(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return a8(e, n);
  } else
    return i8(t);
}
function i8(t) {
  const e = uu(t);
  return { type: P.PrincipalStandard, address: e };
}
function o8(t) {
  return { type: P.PrincipalStandard, address: t };
}
function a8(t, e) {
  const n = uu(t), r = Yr(e);
  return Zp(n, r);
}
function Zp(t, e) {
  if (Qs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: P.PrincipalContract, address: t, contractName: e };
}
function Ya(t, e = !1) {
  switch (t.type) {
    case P.BoolTrue:
      return !0;
    case P.BoolFalse:
      return !1;
    case P.Int:
    case P.UInt:
      return e ? t.value.toString() : t.value;
    case P.Buffer:
      return `0x${bt(t.buffer)}`;
    case P.OptionalNone:
      return null;
    case P.OptionalSome:
      return Bn(t.value);
    case P.ResponseErr:
      return Bn(t.value);
    case P.ResponseOk:
      return Bn(t.value);
    case P.PrincipalStandard:
    case P.PrincipalContract:
      return s8(t);
    case P.List:
      return t.list.map((r) => Bn(r));
    case P.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Bn(t.data[r]);
      }), n;
    case P.StringASCII:
      return t.data;
    case P.StringUTF8:
      return t.data;
  }
}
function Bn(t) {
  switch (t.type) {
    case P.ResponseErr:
      return { type: fr(t), value: Ya(t, !0), success: !1 };
    case P.ResponseOk:
      return { type: fr(t), value: Ya(t, !0), success: !0 };
    default:
      return { type: fr(t), value: Ya(t, !0) };
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
      return `(string-ascii ${Fp(t.data).length})`;
    case P.StringUTF8:
      return `(string-utf8 ${Qs(t.data).length})`;
  }
}
const Qp = () => ({ type: P.BoolTrue }), Jp = () => ({ type: P.BoolFalse }), c8 = (t) => t ? Qp() : Jp(), xd = BigInt("0xffffffffffffffffffffffffffffffff"), l8 = BigInt(0), Sd = BigInt("0x7fffffffffffffffffffffffffffffff"), Ed = BigInt("-170141183460469231731687303715884105728"), u8 = (t) => {
  const e = xe(t, !0);
  if (e > Sd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Sd}`);
  if (e < Ed)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ed}`);
  return { type: P.Int, value: e };
}, hr = (t) => {
  const e = xe(t, !1);
  if (e < l8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > xd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${xd}`);
  return { type: P.UInt, value: e };
}, tg = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: P.Buffer, buffer: t };
};
function eg() {
  return { type: P.OptionalNone };
}
function ng(t) {
  return { type: P.OptionalSome, value: t };
}
function f8(t) {
  return { type: P.ResponseErr, value: t };
}
function d8(t) {
  return { type: P.ResponseOk, value: t };
}
function h8(t) {
  return { type: P.List, list: t };
}
function $i(t) {
  for (const e in t)
    if (!n6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: P.Tuple, data: t };
}
const Ye = (t) => ({ type: P.StringASCII, data: t }), p8 = (t) => ({ type: P.StringUTF8, data: t });
class rg extends Gp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Tr.hash(e);
    const r = iu(n);
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
const sg = (t, e, n) => new rg(t, e).update(n).digest();
sg.create = (t, e) => new rg(t, e);
Wt.hmacSha256Sync = (t, ...e) => {
  const n = sg.create(lu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function js(t) {
  return {
    type: Q.PublicKey,
    data: Dt(t)
  };
}
function g8(t, e, n = Rt.Compressed) {
  const r = JE(e.data), s = new Ne(fd(r.r), fd(r.s)), i = gt.fromSignature(t, s, r.recoveryId), o = n === Rt.Compressed;
  return i.toHex(o);
}
function y8(t) {
  return { type: Q.PublicKey, data: t };
}
function Js(t) {
  return !bt(t.data).startsWith("04");
}
function Vo(t) {
  return t.data.slice();
}
function w8(t) {
  const e = x8(t), n = Bi(e.data.slice(0, 32), e.compressed);
  return js(bt(n));
}
function b8(t) {
  const e = typeof t == "string" ? t : bt(t), n = gt.fromHex(e).toHex(!0);
  return js(n);
}
function m8(t) {
  const e = typeof t == "string" ? t : bt(t), n = gt.fromHex(e).toHex(!1);
  return js(n);
}
function Qc(t) {
  const e = t.readUInt8(), n = e === 4 ? uA : lA;
  return y8(te([e, t.readBytes(n)]));
}
function x8(t) {
  const e = tA(t), n = e.length == jp;
  return { data: e, compressed: n };
}
function S8(t, e) {
  const [n, r] = Jo(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Ui(r, 1) + Ne.fromHex(n).toCompactHex();
  return Xp(i);
}
function E8(t) {
  return w8(t.data);
}
function A8(t, e, n) {
  return typeof t == "string" && (t = Yp(t)), typeof n == "string" && (n = vd(n)), {
    type: Q.Payload,
    payloadType: pt.TokenTransfer,
    recipient: t,
    amount: xe(e, !1),
    memo: n ?? vd("")
  };
}
function $8(t, e, n, r) {
  return typeof t == "string" && (t = uu(t)), typeof e == "string" && (e = Yr(e)), typeof n == "string" && (n = Yr(n)), {
    type: Q.Payload,
    payloadType: pt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Ad(t, e, n) {
  return typeof t == "string" && (t = Yr(t)), typeof e == "string" && (e = _8(e)), typeof n == "number" ? {
    type: Q.Payload,
    payloadType: pt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: Q.Payload,
    payloadType: pt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function v8() {
  return { type: Q.Payload, payloadType: pt.PoisonMicroblock };
}
function $d(t, e) {
  if (t.byteLength != Nr)
    throw Error(`Coinbase buffer size must be ${Nr} bytes`);
  return e != null ? {
    type: Q.Payload,
    payloadType: pt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: Q.Payload,
    payloadType: pt.Coinbase,
    coinbaseBytes: t
  };
}
function I8(t, e, n) {
  if (t.byteLength != Nr)
    throw Error(`Coinbase buffer size must be ${Nr} bytes`);
  if (n.byteLength != qc)
    throw Error(`VRF proof buffer size must be ${qc} bytes`);
  return {
    type: Q.Payload,
    payloadType: pt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === P.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Jc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Jc || (Jc = {}));
function L8(t, e, n, r, s, i, o) {
  return {
    type: Q.Payload,
    payloadType: pt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function ig(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case pt.TokenTransfer:
      e.push(Qt(t.recipient)), e.push(br(t.amount, !1, 8)), e.push(Ln(t.memo));
      break;
    case pt.ContractCall:
      e.push(Ln(t.contractAddress)), e.push(Ln(t.contractName)), e.push(Ln(t.functionName));
      const n = new Uint8Array(4);
      Xr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Qt(r));
      });
      break;
    case pt.SmartContract:
      e.push(Ln(t.contractName)), e.push(Ln(t.codeBody));
      break;
    case pt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ln(t.contractName)), e.push(Ln(t.codeBody));
      break;
    case pt.PoisonMicroblock:
      break;
    case pt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case pt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Qt(t.recipient));
      break;
    case pt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Qt(t.recipient ? ng(t.recipient) : eg())), e.push(t.vrfProof);
      break;
    case pt.TenureChange:
      e.push(Dt(t.tenureHash)), e.push(Dt(t.previousTenureHash)), e.push(Dt(t.burnViewHash)), e.push(Dt(t.previousTenureEnd)), e.push(Xr(new Uint8Array(4), t.previousTenureBlocks)), e.push(sA(new Uint8Array(1), t.cause)), e.push(Dt(t.publicKeyHash));
      break;
  }
  return te(e);
}
function k8(t) {
  switch (t.readUInt8Enum(pt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case pt.TokenTransfer:
      const n = Ge(t), r = xe(t.readBytes(8), !1), s = ag(t);
      return A8(n, r, s);
    case pt.ContractCall:
      const i = zs(t), o = Re(t), a = Re(t), c = [], u = t.readUInt32BE();
      for (let b = 0; b < u; b++) {
        const k = Ge(t);
        c.push(k);
      }
      return $8(i, o, a, c);
    case pt.SmartContract:
      const d = Re(t), l = Re(t, 4, 1e5);
      return Ad(d, l);
    case pt.VersionedSmartContract: {
      const b = t.readUInt8Enum(Wc, (O) => {
        throw new Error(`Cannot recognize ClarityVersion: ${O}`);
      }), k = Re(t), $ = Re(t, 4, 1e5);
      return Ad(k, $, b);
    }
    case pt.PoisonMicroblock:
      return v8();
    case pt.Coinbase: {
      const b = t.readBytes(Nr);
      return $d(b);
    }
    case pt.CoinbaseToAltRecipient: {
      const b = t.readBytes(Nr), k = Ge(t);
      return $d(b, k);
    }
    case pt.NakamotoCoinbase: {
      const b = t.readBytes(Nr), k = Ge(t), $ = t.readBytes(qc);
      return I8(b, k, $);
    }
    case pt.TenureChange:
      const g = bt(t.readBytes(20)), h = bt(t.readBytes(20)), y = bt(t.readBytes(20)), w = bt(t.readBytes(32)), v = t.readUInt32BE(), N = t.readUInt8Enum(Jc, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), _ = bt(t.readBytes(20));
      return L8(g, h, y, w, v, N, _);
  }
}
class Ea extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ir extends Ea {
  constructor(e) {
    super(e);
  }
}
class _e extends Ea {
  constructor(e) {
    super(e);
  }
}
class qo extends Ea {
  constructor(e) {
    super(e);
  }
}
class Mr extends Ea {
  constructor(e) {
    super(e);
  }
}
var Ze;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ze || (Ze = {}));
function tl(t) {
  return Xp(bt(t.readBytes(xa)));
}
function $s(t, e) {
  return {
    pubKeyEncoding: t,
    type: Q.TransactionAuthField,
    contents: e
  };
}
function C8(t) {
  const e = t.readUInt8Enum(Ze, (n) => {
    throw new _e(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Ze.PublicKeyCompressed:
      return $s(Rt.Compressed, Qc(t));
    case Ze.PublicKeyUncompressed:
      return $s(Rt.Uncompressed, m8(Qc(t).data));
    case Ze.SignatureCompressed:
      return $s(Rt.Compressed, tl(t));
    case Ze.SignatureUncompressed:
      return $s(Rt.Uncompressed, tl(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function fu(t) {
  return Dt(t.data);
}
function B8(t) {
  const e = [];
  switch (t.contents.type) {
    case Q.PublicKey:
      e.push(t.pubKeyEncoding === Rt.Compressed ? Ze.PublicKeyCompressed : Ze.PublicKeyUncompressed), e.push(Vo(b8(t.contents.data)));
      break;
    case Q.MessageSignature:
      e.push(t.pubKeyEncoding === Rt.Compressed ? Ze.SignatureCompressed : Ze.SignatureUncompressed), e.push(fu(t.contents));
      break;
  }
  return te(e);
}
function Ln(t) {
  switch (t.type) {
    case Q.Address:
      return Hi(t);
    case Q.Principal:
      return og(t);
    case Q.LengthPrefixedString:
      return Rs(t);
    case Q.MemoString:
      return N8(t);
    case Q.AssetInfo:
      return cg(t);
    case Q.PostCondition:
      return U8(t);
    case Q.PublicKey:
      return Vo(t);
    case Q.LengthPrefixedList:
      return pu(t);
    case Q.Payload:
      return ig(t);
    case Q.TransactionAuthField:
      return B8(t);
    case Q.MessageSignature:
      return fu(t);
  }
}
function T8() {
  return {
    type: Q.Address,
    version: Ko.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function du(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Bt.SerializeP2PKH || e === Bt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Bt.SerializeP2WPKH || e === Bt.SerializeP2WSH || e === Bt.SerializeP2WSHNonSequential) && !r.every(Js))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Bt.SerializeP2PKH:
      return oi(t, Q8(r[0].data));
    case Bt.SerializeP2WPKH:
      return oi(t, J8(r[0].data));
    case Bt.SerializeP2SH:
    case Bt.SerializeP2SHNonSequential:
      return oi(t, t6(n, r.map(Vo)));
    case Bt.SerializeP2WSH:
    case Bt.SerializeP2WSHNonSequential:
      return oi(t, e6(n, r.map(Vo)));
  }
}
function Hi(t) {
  const e = [];
  return e.push(Dt(Ui(t.version, 1))), e.push(Dt(t.hash160)), te(e);
}
function zs(t) {
  const e = ba(bt(t.readBytes(1))), n = bt(t.readBytes(20));
  return { type: Q.Address, version: e, hash160: n };
}
function og(t) {
  const e = [];
  return e.push(t.prefix), e.push(Hi(t.address)), t.prefix === Ai.Contract && e.push(Rs(t.contractName)), te(e);
}
function M8(t) {
  const e = t.readUInt8Enum(Ai, (s) => {
    throw new _e(`Unexpected Principal payload type: ${s}`);
  }), n = zs(t);
  if (e === Ai.Standard)
    return { type: Q.Principal, prefix: e, address: n };
  const r = Re(t);
  return {
    type: Q.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Rs(t) {
  const e = [], n = Qs(t.content), r = n.byteLength;
  return e.push(Dt(Ui(r, t.lengthPrefixBytes))), e.push(n), te(e);
}
function Re(t, e, n) {
  e = e || 1;
  const r = ba(bt(t.readBytes(e))), s = su(t.readBytes(r));
  return Yr(s, e, n ?? 128);
}
function _8(t) {
  return Yr(t, 4, 1e5);
}
function vd(t) {
  if (t && dg(t, Ro))
    throw new Error(`Memo exceeds maximum length of ${Ro} bytes`);
  return { type: Q.MemoString, content: t };
}
function N8(t) {
  const e = [], n = Qs(t.content), r = Z8(bt(n), Ro * 2);
  return e.push(Dt(r)), te(e);
}
function ag(t) {
  let e = su(t.readBytes(Ro));
  return e = e.replace(/\u0000*$/, ""), { type: Q.MemoString, content: e };
}
function cg(t) {
  const e = [];
  return e.push(Hi(t.address)), e.push(Rs(t.contractName)), e.push(Rs(t.assetName)), te(e);
}
function el(t) {
  return {
    type: Q.AssetInfo,
    address: zs(t),
    contractName: Re(t),
    assetName: Re(t)
  };
}
function hu(t, e) {
  return {
    type: Q.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function pu(t) {
  const e = t.values, n = [];
  n.push(Dt(Ui(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ln(r));
  return te(n);
}
function lg(t, e, n) {
  const r = ba(bt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case Q.Address:
        s.push(zs(t));
        break;
      case Q.LengthPrefixedString:
        s.push(Re(t));
        break;
      case Q.MemoString:
        s.push(ag(t));
        break;
      case Q.AssetInfo:
        s.push(el(t));
        break;
      case Q.PostCondition:
        s.push(H8(t));
        break;
      case Q.PublicKey:
        s.push(Qc(t));
        break;
      case Q.TransactionAuthField:
        s.push(C8(t));
        break;
    }
  return hu(s, n);
}
function U8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(og(t.principal)), (t.conditionType === $e.Fungible || t.conditionType === $e.NonFungible) && e.push(cg(t.assetInfo)), t.conditionType === $e.NonFungible && e.push(Qt(t.assetName)), e.push(t.conditionCode), t.conditionType === $e.STX || t.conditionType === $e.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ir("The post-condition amount may not be larger than 8 bytes");
    e.push(br(t.amount, !1, 8));
  }
  return te(e);
}
function H8(t) {
  const e = t.readUInt8Enum($e, (o) => {
    throw new _e(`Could not read ${o} as PostConditionType`);
  }), n = M8(t);
  let r, s, i;
  switch (e) {
    case $e.STX:
      return r = t.readUInt8Enum(Ei, (a) => {
        throw new _e(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${bt(t.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: $e.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case $e.Fungible:
      return s = el(t), r = t.readUInt8Enum(Ei, (a) => {
        throw new _e(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${bt(t.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: $e.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case $e.NonFungible:
      s = el(t);
      const o = Ge(t);
      return r = t.readUInt8Enum(Xc, (a) => {
        throw new _e(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Q.PostCondition,
        conditionType: $e.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function wn(t, e) {
  return te([t, e]);
}
function P8(t) {
  return new Uint8Array([t.type]);
}
function O8(t) {
  return t.type === P.OptionalNone ? new Uint8Array([t.type]) : wn(t.type, Qt(t.value));
}
function D8(t) {
  const e = new Uint8Array(4);
  return Xr(e, t.buffer.length, 0), wn(t.type, ma(e, t.buffer));
}
function F8(t) {
  const e = ru(qE(t.value, BigInt(cA)), zp);
  return wn(t.type, e);
}
function j8(t) {
  const e = ru(t.value, zp);
  return wn(t.type, e);
}
function z8(t) {
  return wn(t.type, Hi(t.address));
}
function R8(t) {
  return wn(t.type, ma(Hi(t.address), Rs(t.contractName)));
}
function G8(t) {
  return wn(t.type, Qt(t.value));
}
function K8(t) {
  const e = [], n = new Uint8Array(4);
  Xr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Qt(r);
    e.push(s);
  }
  return wn(t.type, te(e));
}
function V8(t) {
  const e = [], n = new Uint8Array(4);
  Xr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Yr(s);
    e.push(Rs(i));
    const o = Qt(t.data[s]);
    e.push(o);
  }
  return wn(t.type, te(e));
}
function ug(t, e) {
  const n = [], r = e == "ascii" ? Fp(t.data) : Qs(t.data), s = new Uint8Array(4);
  return Xr(s, r.length, 0), n.push(s), n.push(r), wn(t.type, te(n));
}
function q8(t) {
  return ug(t, "ascii");
}
function W8(t) {
  return ug(t, "utf8");
}
function Qt(t) {
  switch (t.type) {
    case P.BoolTrue:
    case P.BoolFalse:
      return P8(t);
    case P.OptionalNone:
    case P.OptionalSome:
      return O8(t);
    case P.Buffer:
      return D8(t);
    case P.UInt:
      return j8(t);
    case P.Int:
      return F8(t);
    case P.PrincipalStandard:
      return z8(t);
    case P.PrincipalContract:
      return R8(t);
    case P.ResponseOk:
    case P.ResponseErr:
      return G8(t);
    case P.List:
      return K8(t);
    case P.Tuple:
      return V8(t);
    case P.StringASCII:
      return q8(t);
    case P.StringUTF8:
      return W8(t);
    default:
      throw new Ir("Unable to serialize. Invalid Clarity Value.");
  }
}
function X8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Id = /* @__PURE__ */ new Map();
function fg(t, e) {
  const n = Id.get(t);
  if (n !== void 0)
    return n(e);
  const r = X8(t);
  return Id.set(t, r), fg(t, e);
}
class fi {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return iA(this.readBytes(4), 0);
  }
  readUInt8() {
    return rA(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return eA(this.readBytes(2), 0);
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
    if (fg(e, r))
      return r;
    throw n(r);
  }
}
function Ge(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new fi(Dt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new fi(t) : e = t;
  switch (e.readUInt8Enum(P, (r) => {
    throw new _e(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case P.Int:
      return u8(e.readBytes(16));
    case P.UInt:
      return hr(e.readBytes(16));
    case P.Buffer:
      const r = e.readUInt32BE();
      return tg(e.readBytes(r));
    case P.BoolTrue:
      return Qp();
    case P.BoolFalse:
      return Jp();
    case P.PrincipalStandard:
      const s = zs(e);
      return o8(s);
    case P.PrincipalContract:
      const i = zs(e), o = Re(e);
      return Zp(i, o);
    case P.ResponseOk:
      return d8(Ge(e));
    case P.ResponseErr:
      return f8(Ge(e));
    case P.OptionalNone:
      return eg();
    case P.OptionalSome:
      return ng(Ge(e));
    case P.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Ge(e));
      return h8(c);
    case P.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let w = 0; w < u; w++) {
        const v = Re(e).content;
        if (v === void 0)
          throw new _e('"content" is undefined');
        d[v] = Ge(e);
      }
      return $i(d);
    case P.StringASCII:
      const l = e.readUInt32BE(), g = ZE(e.readBytes(l));
      return Ye(g);
    case P.StringUTF8:
      const h = e.readUInt32BE(), y = su(e.readBytes(h));
      return p8(y);
    default:
      throw new _e("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Y8 = (t) => t.length % 2 == 0 ? t : `0${t}`, Z8 = (t, e) => t.padEnd(e, "0"), dg = (t, e) => t ? Qs(t).length > e : !1;
function nl(t) {
  return T0(t);
}
const vi = (t) => IA(lu(t)), gu = (t) => bt(r8(t)), Q8 = (t) => bt(vi(t)), J8 = (t) => {
  const e = vi(t), n = ma(new Uint8Array([0]), new Uint8Array([e.length]), e), r = vi(n);
  return bt(r);
}, t6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = te(n), s = vi(r);
  return bt(s);
}, e6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = te(n), s = lu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = te(i), a = vi(o);
  return bt(a);
};
function n6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function hg(t) {
  const e = Qt(t);
  return `0x${bt(e)}`;
}
function r6(t) {
  return Ge(t);
}
const Is = (t) => {
  try {
    return ss.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function yu() {
  return {
    type: Q.MessageSignature,
    data: bt(new Uint8Array(xa))
  };
}
function pg(t, e, n, r) {
  const s = du(0, t, 1, [js(e)]).hash160, i = Js(js(e)) ? Rt.Compressed : Rt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: xe(n, !1),
    fee: xe(r, !1),
    keyEncoding: i,
    signature: yu()
  };
}
function Ii(t) {
  return "signature" in t;
}
function Ld(t) {
  return t === Bt.SerializeP2SH || t === Bt.SerializeP2WSH;
}
function s6(t) {
  return t === Bt.SerializeP2SHNonSequential || t === Bt.SerializeP2WSHNonSequential;
}
function kd(t) {
  const e = nl(t);
  return e.nonce = 0, e.fee = 0, Ii(e) ? e.signature = yu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function i6(t) {
  const e = [
    t.hashMode,
    Dt(t.signer),
    br(t.nonce, !1, 8),
    br(t.fee, !1, 8),
    t.keyEncoding,
    fu(t.signature)
  ];
  return te(e);
}
function o6(t) {
  const e = [
    t.hashMode,
    Dt(t.signer),
    br(t.nonce, !1, 8),
    br(t.fee, !1, 8)
  ], n = hu(t.fields);
  e.push(pu(n));
  const r = new Uint8Array(2);
  return nA(r, t.signaturesRequired, 0), e.push(r), te(e);
}
function a6(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt(`0x${bt(e.readBytes(8))}`), s = BigInt(`0x${bt(e.readBytes(8))}`), i = e.readUInt8Enum(Rt, (a) => {
    throw new _e(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Bt.SerializeP2WPKH && i != Rt.Compressed)
    throw new _e("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = tl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function c6(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt("0x" + bt(e.readBytes(8))), s = BigInt("0x" + bt(e.readBytes(8))), i = lg(e, Q.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case Q.PublicKey:
        Js(u.contents) || (o = !0);
        break;
      case Q.MessageSignature:
        if (u.pubKeyEncoding === Rt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Mr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Bt.SerializeP2WSH || t === Bt.SerializeP2WSHNonSequential))
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
function Za(t) {
  return Ii(t) ? i6(t) : o6(t);
}
function Qa(t) {
  const e = t.readUInt8Enum(Bt, (n) => {
    throw new _e(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Bt.SerializeP2PKH || e === Bt.SerializeP2WPKH ? a6(e, t) : c6(e, t);
}
function gg(t, e, n, r) {
  const i = t + bt(new Uint8Array([e])) + bt(br(n, !1, 8)) + bt(br(r, !1, 8));
  if (Dt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return gu(Dt(i));
}
function yg(t, e, n) {
  const r = 33 + xa, s = Js(e) ? Rt.Compressed : Rt.Uncompressed, i = t + Y8(s.toString(16)) + n.data, o = Dt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return gu(o);
}
function l6(t, e, n, r, s) {
  const i = gg(t, e, n, r), o = S8(s, i), a = E8(s), c = yg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function wg(t, e, n, r, s, i) {
  const o = gg(t, e, n, r), a = js(g8(o, i, s)), c = yg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function u6() {
  const t = pg(Bt.SerializeP2PKH, "", 0, 0);
  return t.signer = T8().hash160, t.keyEncoding = Rt.Compressed, t.signature = yu(), t;
}
function Cd(t, e, n) {
  return Ii(t) ? f6(t, e, n) : d6(t, e, n);
}
function f6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = wg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = du(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Mr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function d6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case Q.PublicKey:
        Js(c.contents) || (i = !0), r.push(c.contents);
        break;
      case Q.MessageSignature:
        c.pubKeyEncoding === Rt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = wg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Ld(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new Mr("Too many signatures");
        break;
    }
  if (Ld(t.hashMode) && o !== t.signaturesRequired || s6(t.hashMode) && o < t.signaturesRequired)
    throw new Mr("Incorrect number of signatures");
  if (i && (t.hashMode === Bt.SerializeP2WSH || t.hashMode === Bt.SerializeP2WSHNonSequential))
    throw new Mr("Uncompressed keys are not allowed in this hash mode");
  const a = du(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Mr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function bg(t) {
  return {
    authType: qt.Standard,
    spendingCondition: t
  };
}
function mg(t, e) {
  return {
    authType: qt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || pg(Bt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Bd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case qt.Standard:
        return bg(kd(t.spendingCondition));
      case qt.Sponsored:
        return mg(kd(t.spendingCondition), u6());
      default:
        throw new qo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function h6(t, e) {
  switch (t.authType) {
    case qt.Standard:
      return Cd(t.spendingCondition, e, qt.Standard);
    case qt.Sponsored:
      return Cd(t.spendingCondition, e, qt.Standard);
    default:
      throw new qo("Invalid origin auth type");
  }
}
function p6(t, e) {
  switch (t.authType) {
    case qt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: xe(e, !1)
      };
      return { ...t, spendingCondition: n };
    case qt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: xe(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function g6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: xe(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function y6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: xe(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function w6(t, e) {
  const n = {
    ...e,
    nonce: xe(e.nonce, !1),
    fee: xe(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function b6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case qt.Standard:
      e.push(Za(t.spendingCondition));
      break;
    case qt.Sponsored:
      e.push(Za(t.spendingCondition)), e.push(Za(t.sponsorSpendingCondition));
      break;
  }
  return te(e);
}
function m6(t) {
  const e = t.readUInt8Enum(qt, (r) => {
    throw new _e(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case qt.Standard:
      return n = Qa(t), bg(n);
    case qt.Sponsored:
      n = Qa(t);
      const r = Qa(t);
      return mg(n, r);
  }
}
class x6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: xe(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? oA, this.postConditionMode = i ?? Fs.Deny, this.postConditions = s ?? hu([]), o)
      this.anchorMode = fA(o);
    else
      switch (r.payloadType) {
        case pt.Coinbase:
        case pt.CoinbaseToAltRecipient:
        case pt.NakamotoCoinbase:
        case pt.PoisonMicroblock:
        case pt.TenureChange:
          this.anchorMode = Ae.OnChainOnly;
          break;
        case pt.ContractCall:
        case pt.SmartContract:
        case pt.VersionedSmartContract:
        case pt.TokenTransfer:
          this.anchorMode = Ae.Any;
          break;
      }
  }
  signBegin() {
    const e = nl(this);
    return e.auth = Bd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = nl(this);
    return e.auth = Bd(e.auth), e.txid();
  }
  verifyOrigin() {
    return h6(this.auth, this.verifyBegin());
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
    if (n && !Ii(n)) {
      const r = Js(e);
      n.fields.push($s(r ? Rt.Compressed : Rt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = l6(n, r, e.fee, e.nonce, s);
    return Ii(e) ? e.signature = i : e.fields.push($s(s.data.byteLength === jp ? Rt.Compressed : Rt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return gu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != qt.Sponsored)
      throw new qo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = w6(this.auth, e);
  }
  setFee(e) {
    this.auth = p6(this.auth, e);
  }
  setNonce(e) {
    this.auth = g6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != qt.Sponsored)
      throw new qo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = y6(this.auth, e);
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
    return Xr(n, this.chainId, 0), e.push(n), e.push(b6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(pu(this.postConditions)), e.push(ig(this.payload)), te(e);
  }
}
function wu(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new fi(Dt(t.slice(2))) : e = new fi(Dt(t)) : t instanceof Uint8Array ? e = new fi(t) : e = t;
  const n = e.readUInt8Enum(Go, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = m6(e), i = e.readUInt8Enum(Ae, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Fs, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = lg(e, Q.PostCondition), c = k8(e);
  return new x6(n, s, c, a, o, i, r);
}
const S6 = c8, di = hr, E6 = tg;
const A6 = /* @__PURE__ */ new Set([4001, -31001]), $6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], v6 = ["result", "data", "payload", "response", "params"], Td = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Aa = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), cs = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Mn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, I6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), xg = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => I6(i, r)) === s
  );
}, Sg = (t) => t ? xg(cs()).some(
  (e) => {
    var n;
    return e.id === t && (Aa(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Eg = () => {
  if (typeof window > "u")
    return;
  const t = cs(), e = xg(t).filter(
    (n) => {
      var r;
      return Aa(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Mn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of $6) {
    const r = Mn(t, n) ?? (t === window ? void 0 : Mn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, L6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = cs(), n = Mn(e, t) ?? (e === window ? void 0 : Mn(window, t)) ?? la(t);
  if (n)
    return n;
  if (Aa(t) || Sg(t))
    return Eg();
}, po = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, k6 = ["blockstack-session", "blockstack"], C6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of k6) {
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
C6();
const Ag = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Me = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, B6 = (t) => {
  const e = Me(t);
  if (!e)
    return null;
  const n = Ag(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, T6 = (t) => {
  const e = Me(t);
  if (!e)
    return null;
  const n = Ag(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, rl = (t, e = "mainnet") => {
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
      return rl(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return rl(r, e);
  }
  return e;
}, Ur = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Li = (t, e = 0) => {
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
      const i = Li(s, e + 1);
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
    const i = Li(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Is(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Is(n.testnet) ? n.testnet.trim() : null;
}, Md = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, $g = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && A6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Zr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Me(n == null ? void 0 : n.message) ?? Me(e.message) ?? Me(e.error) ?? Me(t) ?? "Wallet provider request failed.", s = new Error(r);
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
}, _d = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Gs(r);
  } catch (r) {
    throw Zr(r);
  }
}, vg = () => Eg(), bu = () => {
  if (typeof window > "u")
    return;
  const t = cs();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Mn(t, e) ?? (t === window ? void 0 : Mn(window, e));
    if (n)
      return n;
  }
}, Nd = () => {
  if (typeof window > "u")
    return;
  const t = bu();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = cs();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Mn(e, n) ?? (e === window ? void 0 : Mn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, $o = (t) => {
  var r, s;
  const e = zr();
  if (Aa(e) || Sg(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = cs() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === vg();
}, Ja = (t) => {
  const e = T6(t);
  if (!e)
    return null;
  try {
    const n = wu(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Wo = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Ja(t), r = B6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Me(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Wo(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Td)
    if (Ja(s[a])) {
      i = Me(s[a]);
      break;
    }
  const o = Me(s.txId) || Me(s.txid) || Me(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Me(s.txRaw) ?? void 0
    };
  for (const a of Td) {
    const c = Ja(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Me(s[a]) ?? void 0
      };
  }
  for (const a of v6) {
    const c = s[a], u = Wo(c, e + 1);
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
}, tc = (t) => {
  const e = Wo(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, M6 = (t) => {
  const e = Wo(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, _6 = (t) => ({
  ...t,
  fee: Ur(t.fee),
  nonce: Ur(t.nonce),
  sponsored: t.sponsored === !0
}), Ud = (t) => ({
  recipient: t.recipient,
  amount: Ur(t.amount) ?? "0",
  memo: t.memo,
  network: rl(t.network),
  address: t.stxAddress,
  fee: Ur(t.fee),
  nonce: Ur(t.nonce),
  sponsored: t.sponsored ?? !1
}), Ig = "WALLET_ADDRESS_MISMATCH", N6 = 45e3;
let hi = null;
const sl = (t) => {
  t && (hi = { address: t, at: Date.now() });
}, U6 = () => {
  hi = null;
}, H6 = () => hi && Date.now() - hi.at <= N6 ? hi.address : null, P6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, O6 = async (t) => {
  U6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Gs(await t.request("wallet_connect")), n = Li(e);
  return sl(n), n;
}, D6 = async (t, e, n, r) => {
  try {
    return Gs(await t.request(e, n));
  } catch (s) {
    const i = Zr(s);
    if (!P6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await O6(t);
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
        { code: o ? Ig : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Gs(await t.request(e, n));
    } catch (a) {
      throw Zr(a);
    }
  }
};
let Hd = 3e4;
const F6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Hd / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Hd);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, j6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ig }
      );
    return c;
  }, s = H6();
  if (s)
    return po(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  po(n, "account-read");
  try {
    const c = Gs(
      await F6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Li(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if ($g(c))
      throw Zr(c);
    po(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return sl(i), r(i, "wallet_getAccount");
  let o;
  po(n, "account-reconnect");
  try {
    o = Gs(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Zr(c);
  }
  const a = Li(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return sl(a), r(a, "wallet_connect");
}, z6 = async (t, e) => {
  if (!$o(t)) {
    const i = await _d(
      t,
      "stx_transferStx",
      Ud(e)
    );
    return tc(i);
  }
  const n = bu();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await _d(
      n,
      "stx_transferStx",
      Ud(e)
    );
    return tc(i);
  }
  const r = vg();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await j6(r, e.stxAddress);
  const s = await D6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Ur(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Ur(e.fee) } : {}
    },
    e.stxAddress
  );
  return tc(s);
}, R6 = () => zr(), Lg = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = zr(), e = t ? L6(t) : void 0;
  if (e)
    return e;
  const n = cs() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Pd = (t, e) => {
  const n = Lg(), r = _6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, M6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return lo(r, e);
  if ($o(n) && !bu()) {
    const s = Nd();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: zr(),
        route: "legacy-transaction-request"
      }), lo(r, s);
  }
  return void z6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Md(s) && $o(n)) {
      const a = Nd();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: zr(),
          route: "legacy-transaction-request"
        }), lo(r, a);
        return;
      }
    }
    if (Md(s) && !$o(n)) {
      lo(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), $g(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Od = (t) => hg(t).replace(/^0x/, ""), Dd = "This wallet cannot sign messages. Try Xverse or Leather.", Fd = (t) => typeof (t == null ? void 0 : t.request) == "function", jd = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", G6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, K6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function V6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Od(e.message),
    domain: Od(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function q6(t, e) {
  const n = await FE({
    domain: e.domain,
    message: e.message,
    network: wa(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function zd(t) {
  var s, i;
  const e = R6() || "", n = /xverse/i.test(e);
  let r = Lg();
  if (n && !jd(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (jd(r))
    try {
      return await q6(r, t);
    } catch (o) {
      if (n || !Fd(r) || !K6(o)) throw o;
    }
  if (!n && Fd(r))
    try {
      return await V6(r, t);
    } catch (o) {
      throw G6(o) ? new Error(Dd) : o;
    }
  throw new Error(Dd);
}
const Rd = 1000000n, pi = 1000000n, il = 50n, Ks = 3000n, $a = 300n, W6 = 3000n, X6 = 50000n, Gd = 200n, Vs = (t) => t + il;
function kn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Rd}.${(n % Rd).toString().padStart(6, "0")}`;
}
function Y6(t, e = $a) {
  return t <= Ks ? 0 : Number((t - Ks) / Vs(e));
}
function Kd(t, e = 0n) {
  const n = pi - t - e;
  return n > 0n ? n : 0n;
}
function Z6(t, e = $a) {
  return t > pi ? "over" : t < Ks + Vs(e) ? "empty" : t < X6 ? "low" : "ok";
}
const Q6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", J6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", t5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function e5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || t5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== Q6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const kg = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", ec = 3, n5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [ol, Cg] = kg.split("."), Fe = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function al(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function r5(t) {
  return Fe(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Qr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Bg(t, e = []) {
  const n = await Qr(`/v2/contracts/call-read/${ol}/${Cg}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: ol, arguments: e.map((r) => "0x" + Fe(Qt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Bn(Ge(n.result));
}
async function s5() {
  const t = await Qr(`/v2/contracts/source/${ol}/${Cg}?proof=0`);
  if (typeof t.source != "string" || await r5(t.source) !== J6) throw Error("Deployed source does not match the tested helper.");
  if (e5(await Bg("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Tg(t) {
  return t.startsWith("SP") && Is(t) && !t.includes(".");
}
async function i5(t) {
  var r;
  if (!Tg(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Qr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Qr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function o5(t) {
  const e = await Qr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function a5(t, e) {
  var s, i;
  const n = await Bg("get-owner", [di(t), di(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Tg(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function c5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: al(t), signal: AbortSignal.timeout(15e3) });
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
async function l5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function u5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = wu(al(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || As(oi(Ko.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || As(r.contractAddress) + "." + r.contractName.content !== kg || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Fe(Qt(r.functionArgs[0])) !== Fe(Qt(di(t.core))) || Fe(Qt(r.functionArgs[1])) !== Fe(Qt(di(t.song))) || Fe(Qt(r.functionArgs[2])) !== Fe(Qt(E6(al(t.id)))) || t.amount !== "50" || e.postConditionMode !== Fs.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Ei.Equal || i.principal.prefix !== 2 || As(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || As(r.contractAddress) + "." + r.contractName.content !== n5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Fe(Qt(r.functionArgs[0])) !== Fe(Qt(di(t.song))) || typeof t.liked != "boolean" || Fe(Qt(r.functionArgs[1])) !== Fe(Qt(S6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Fs.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Bn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const f5 = "xtrata.xyz/radio/listening-wallet", d5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Xo = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Is(t), h5 = (t) => ({
  domain: $i({ name: Ye(f5), version: Ye("1"), "chain-id": hr(1) }),
  message: $i({
    purpose: Ye(d5),
    main: Ye(t.main),
    listening: Ye(t.listening),
    issued: hr(t.issued)
  })
}), Vd = ["prepared", "signed", "unknown", "pending"], p5 = 30 * 6e4, ys = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, g5 = 3e3, qd = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function y5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = !1, d = !1, l = !1, g = null, h = !1, y = "", w = "", v, N = null, _, b = [], k, $ = -1 / 0;
  const O = /* @__PURE__ */ new Set();
  let q = null, H = !1, K = 0, m = null, I = null, D = !1, R = !1, tt = !1, F = !1, re = !1, ue = 0, Xt = null, S = Promise.resolve();
  const C = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? $a.toString()), yt = (x) => !!i && !(i.features ?? []).includes(x), ot = (x, M) => `xtrata.ppp.v1.${x}:${M}`, L = (x = i == null ? void 0 : i.address) => {
    if (!x) return [];
    try {
      const M = JSON.parse(t.store.get(ot("entries", x)) || "[]");
      return Array.isArray(M) ? M : [];
    } catch {
      return [];
    }
  }, U = (x) => {
    const M = [x, ...L(x.address).filter((Y) => !(Y.txid === x.txid && Y.kind === x.kind))].slice(0, 200);
    t.store.set(ot("entries", x.address), JSON.stringify(M));
  }, W = (x = i == null ? void 0 : i.address) => !!x && t.store.get(ot("on", x)) !== "0", et = (x) => {
    i != null && i.address && t.store.set(ot("on", i.address), x ? "1" : "0");
  }, nt = () => L().filter((x) => Vd.includes(x.status)), Yt = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(ot("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, Nt = (x) => {
    i != null && i.address && t.store.set(ot("deposit", i.address), JSON.stringify(x));
  }, Pe = () => nt().filter((x) => t.now() - x.created > p5 && O.has(x.txid)), Oe = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Ut = () => Oe() && !(i != null && i.linked), ae = () => {
    const x = t.main();
    return !Ut() && !!x && !!(i != null && i.linked) && i.linked !== x;
  }, Ft = (x) => ot("return-to", x), Tt = (x = i == null ? void 0 : i.address) => {
    if (!x) return;
    const M = t.store.get(Ft(x));
    return M && Xo(M) && M !== x ? M : void 0;
  }, ee = (x = i == null ? void 0 : i.address) => q && q.for === x ? q.res : null;
  function ne() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const x = Tt();
    if (x) return { to: x, kind: "chosen" };
    const M = ee();
    if (M != null && M.ok && M.funder) return { to: M.funder, kind: "funder" };
  }
  function Zt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const x = t.main();
    if (!Ut()) {
      if (!x) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : ae() ? "wrong-wallet" : i.state === "known" ? "locked" : !Ut() && i.linked !== x ? "link" : o === void 0 ? "loading" : o > pi ? "over" : o < Ks + Vs(C()) ? "fund" : "ready" : "loading";
  }
  const f = () => {
    var x, M, Y, at;
    return {
      step: Zt(),
      busy: c,
      message: y,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : Z6(o, C()),
      playsLeft: o === void 0 ? 0 : Y6(o, C()),
      allowance: o === void 0 ? pi : Kd(o, BigInt(((x = Yt()) == null ? void 0 : x.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: W(),
      entries: L(),
      depositTxid: ((M = Yt()) == null ? void 0 : M.txid) ?? v,
      depositPending: !!Yt(),
      walletOutdated: yt("like"),
      linkedListening: k && k === t.main() ? b.map((G) => G.listening) : [],
      serverLinked: !!N && _ === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Pe().length,
      armed: F,
      queued: Mt.length,
      solo: Ut(),
      returnTo: (Y = ne()) == null ? void 0 : Y.to,
      returnToKind: (at = ne()) == null ? void 0 : at.kind,
      funderState: (() => {
        const G = ee();
        return G ? G.ok ? G.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const G = ee();
        return !!G && G.ok && G.distinct > 1;
      })(),
      walletCannotSolo: Ut() && yt("standalone"),
      walletCannotMulti: yt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((G) => G !== t.main() && G !== (i == null ? void 0 : i.linked)),
      creditedTo: Ut() && (i != null && i.address) && (m == null ? void 0 : m.for) === i.address && m.main ? m.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(ot("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (I == null ? void 0 : I.for) === i.address && I.unused
    };
  }, E = (x, M = "") => {
    y = x, w = M, t.changed();
  };
  async function B(x, M) {
    if (!c) {
      c = x, w = "", t.changed();
      try {
        await M();
      } catch (Y) {
        const at = Y instanceof Error ? Y.message : String(Y);
        w = /Cancelled in the listening wallet/.test(at) ? "" : at, w || (y = "Not now. Nothing was signed.", re = !0);
      } finally {
        c = null, await st(!0);
      }
    }
  }
  const V = () => !!(e != null && e.enabled) && e.here && (Ut() || !!t.main() && e.allowed), ht = () => V() && !ae(), wt = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", jt = () => {
    if (ae()) throw new Error(wt());
  };
  async function Gt() {
    if (!V()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const se = (x) => {
    const M = t.main();
    return x.request("listening.status", M ? { main: M } : void 0);
  };
  async function Hn(x = !1) {
    i != null && i.address && (!x && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function Pn(x) {
    if ((k !== x || t.now() - $ >= 6e4) && (b = await t.links(x), k = x, $ = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === x) return;
    const M = `${x}:${i.address}`;
    _ === M && N || (N = b.find((Y) => Y.listening === i.address) ?? null, _ = M);
  }
  async function xr() {
    const x = i == null ? void 0 : i.address;
    if (!Ut() || !x || i != null && i.linked || !t.funder || H || !o || o <= 0n) return;
    const M = ee(x);
    if (M != null && M.ok && M.funder) return;
    const Y = M != null && M.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, K - 1), 30 * 6e4);
    if (!(q && q.for === x && t.now() - q.at < Y)) {
      H = !0;
      try {
        q = { for: x, res: await t.funder(x), at: t.now() };
      } catch {
        q = { for: x, res: { ok: !1 }, at: t.now() };
      } finally {
        H = !1;
      }
      K = q.res.ok ? 0 : K + 1;
    }
  }
  async function he() {
    const x = i == null ? void 0 : i.address;
    if (!(!Ut() || !x || i != null && i.linked || !t.mainOf || D) && !(m && m.for === x && (m.ok || t.now() - m.at < 6e4))) {
      D = !0;
      try {
        m = { for: x, main: await t.mainOf(x), ok: !0, at: t.now() };
      } catch {
        m = { for: x, main: null, ok: !1, at: t.now() };
      } finally {
        D = !1;
      }
    }
  }
  async function ls() {
    const x = i == null ? void 0 : i.address;
    if (!(!x || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (I == null ? void 0 : I.for) === x) && t.store.get(ot("created", x)) !== "1")
      try {
        I = { for: x, unused: await t.chain.confirmedNonce(x) === 0n };
      } catch {
      }
  }
  async function bn() {
    var at;
    const x = i == null ? void 0 : i.address;
    if (!x) return;
    let M;
    for (const G of nt())
      try {
        const kt = await t.chain.transaction(G.txid);
        if (!kt) {
          if (O.add(G.txid), t.now() - G.created > 15 * 6e4 && (M ?? (M = await t.chain.confirmedNonce(x))), M !== void 0 && M > BigInt(G.nonce)) {
            U({ ...G, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((G.status === "unknown" || G.status === "signed") && G.raw)
            try {
              await t.chain.broadcast(G.raw, G.txid), U({ ...G, status: "pending" });
            } catch (Ht) {
              ys(Ht) && U({ ...G, status: "failed", note: Ht.message, raw: void 0 });
            }
          continue;
        }
        O.delete(G.txid);
        const mt = String(kt.tx_status);
        if (mt === "success" && kt.canonical !== !1 && kt.is_unanchored === !1) {
          if (U({ ...G, status: "confirmed", confirmedAt: t.now(), actualFee: String(kt.fee_rate ?? G.fee), raw: void 0 }), G.kind === "like" && (h = !0, G.status !== "confirmed" && typeof G.liked == "boolean"))
            try {
              (at = t.likeConfirmed) == null || at.call(t, G.song, G.liked);
            } catch {
            }
        } else mt.startsWith("abort_") || mt.startsWith("dropped_") ? U({ ...G, status: "failed", note: mt, raw: void 0 }) : G.status !== "pending" && U({ ...G, status: "pending" });
      } catch {
      }
    const Y = Yt();
    if (Y)
      try {
        const G = await t.chain.transaction(Y.txid), kt = String((G == null ? void 0 : G.tx_status) ?? "");
        (kt === "success" && G.is_unanchored === !1 || kt.startsWith("abort_") || kt.startsWith("dropped_") || !G && t.now() - Y.at > 2 * 36e5) && (Nt(null), a = -1 / 0, /on its way/i.test(y) && (y = ""));
      } catch {
      }
  }
  async function st(x = !1) {
    var M;
    try {
      const Y = t.main();
      if ((x || !e || r !== Y || t.now() - n > 3e5) && (e = await t.config(Y), n = t.now(), r = Y), !e.enabled || !e.here || !Ut() && (!Y || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), F && pe(), t.changed();
        return;
      }
      await Gt(), i = await se(s), ae() && i.state === "unlocked" && (Dn(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await se(s)), Y && e.allowed && await Pn(Y), await Hn(x), await xr(), await he(), await ls(), await bn();
    } catch (Y) {
      w = Y instanceof Error ? Y.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (Zt() === "locked" ? Kt() : F && pe(), h) {
      h = !1;
      try {
        (M = t.likesChanged) == null || M.call(t);
      } catch {
      }
    }
    t.changed(), Mt.length && !xn && Sn();
  }
  async function vt(x, M) {
    var kt;
    jt();
    const Y = !(i != null && i.address) || W(i.address), at = i != null && i.linked ? (kt = t.nameOf) == null ? void 0 : kt.call(t, i.linked) : void 0;
    await x.request("listening.unlock", { mode: "unlock", terms: Y ? Ie() : void 0, anyPasskey: M, ...t.main() ? { main: t.main() } : {}, ...at ? { label: at } : {} }), i = await se(x), Y && (W(i.address) ? await mn() : await x.request("listening.stop")), E(Y ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const G = g;
    g = null, G && t.now() - G.at < 12e4 && setTimeout(() => void st(!0).then(() => Le(G)), 0);
  }
  function Kt() {
    F || c || re || ue >= 3 || !s || !(i != null && i.address) || (F = !0, S = (async () => {
      try {
        await vt(s, !1), ue = 0;
      } catch (x) {
        const M = x instanceof Error ? x.message : String(x);
        /Cancelled in the listening wallet/.test(M) ? Xt || (re = !0, E("Not now. Nothing was signed.")) : /did not answer/.test(M) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (ue++, w = M);
      } finally {
        F = !1;
        const x = Xt;
        Xt = null, x ? await x() : await st(!0);
      }
    })());
  }
  async function pe(x) {
    F && (Xt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await S), x && await x(), t.changed();
  }
  const Ie = () => ({
    fee: C().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: pi.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function mn() {
    if (!(i != null && i.address)) return !1;
    if (tt || (tt = await t.tabLock(i.address)), !tt)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const On = {
    forceRefresh: () => st(!0),
    create: () => B("Waiting for your passkey…", async () => {
      const x = await Gt();
      await x.request("listening.unlock", { mode: "create", terms: Ie(), ...t.main() ? { main: t.main() } : {} }), i = await se(x), i.address && t.store.set(ot("created", i.address), "1"), et(!0), E(Ut() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await mn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (x, M) => {
      !(i != null && i.address) || Yt() || (Nt({ txid: x, amount: M.toString(), at: t.now() }), a = -1 / 0, E("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    unlock: (x = !1) => {
      const M = () => B("Waiting for your passkey…", async () => vt(await Gt(), x));
      return F ? x ? yt("cancel") ? (E("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : pe(async () => {
        (Zt() === "locked" || Zt() === "intro") && await M();
      }) : S : M();
    },
    link: () => B("Sign in your wallet…", async () => {
      jt();
      const x = t.main();
      if (!x || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const M = (await t.links(x)).find((Y) => Y.listening === i.address);
      if (M)
        await s.request("listening.link", { main: x, issued: M.issued, mainSignature: M.mainSignature });
      else {
        const Y = { main: x, listening: i.address, issued: t.now() }, at = await t.signWithMain(x, h5(Y)), G = await s.request("listening.link", { main: x, issued: Y.issued, mainSignature: at });
        await t.saveLink({ ...Y, mainSignature: at, listeningSignature: G.listeningSignature }), $ = -1 / 0;
      }
      E("Linked ✓");
    }),
    deposit: () => B("Approve the deposit in your wallet…", async () => {
      jt();
      const x = t.main();
      if (!x || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Yt()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Hn(!0);
      const M = Kd(o ?? 0n);
      if (M <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      v = await t.deposit(x, i.address, M), v && Nt({ txid: v, amount: M.toString(), at: t.now() }), E("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => B("Confirm in the listening wallet…", async () => {
      if (!ht()) throw new Error("Connect your wallet first.");
      await mn(), await s.request("listening.approveSession", Ie()), et(!0), E("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => B("Clearing…", async () => {
      for (const x of Pe())
        await t.chain.transaction(x.txid) || U({ ...x, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      E("Cleared ✓");
    }),
    switchOff: () => B("Switching off…", async () => {
      Dn(), await (s == null ? void 0 : s.request("listening.stop")), et(!1), E("Paying is off. Music stays free.");
    }),
    lock: () => B("Locking…", async () => {
      Dn(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, E("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (x) => {
      const M = String(x ?? "").trim();
      if (!(i != null && i.address)) return E("", "Unlock the listening wallet first.");
      if (!Xo(M)) return E("", "Enter a standard mainnet address (it starts with SP).");
      if (M === i.address) return E("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Ft(i.address), M), E("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(Ft(i.address), ""), t.changed();
    },
    returnFunds: (x) => B("Check the return in the listening wallet…", async () => {
      if (!ht()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      const M = ne();
      if (!M) throw new Error(Ut() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (M.kind !== "linked" && yt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (nt().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: Y, nonce: at } = await t.chain.account(i.address);
      o = Y;
      const G = await s.request("listening.prepareReturn", {
        mode: x,
        balance: Y.toString(),
        nonce: at.toString(),
        fee: W6.toString(),
        ...M.kind === "linked" ? {} : { destination: M.to }
      });
      if (G.recipient !== M.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
      const kt = wu(G.raw);
      if (Bn(kt.payload.recipient).value !== M.to || String(kt.payload.amount) !== G.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const mt = {
        id: qd(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: G.recipient,
        amount: G.amount,
        fee: G.fee,
        nonce: at.toString(),
        created: t.now(),
        status: "signed",
        raw: G.raw,
        txid: G.txid
      };
      t.validate(mt), U(mt);
      try {
        await t.chain.broadcast(G.raw, G.txid), U({ ...mt, status: "pending" });
      } catch (Ht) {
        throw U({ ...mt, status: "unknown", note: Ht.message }), Ht;
      }
      x === "all" && et(!1), E(x === "all" ? M.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Mt = [], Ke = 10, ti = 30 * 6e4;
  let xn = !1;
  const Sr = () => u || !!c || d || l, Dn = () => {
    Mt.length && (Mt.length = 0, t.changed());
  };
  async function us(x) {
    if (!Mt.some((M) => M.id === x.id) && !L().some((M) => M.id === x.id) && (Mt.push({ ...x, at: t.now() }), Mt.length > Ke && Mt.shift()), Sr() || nt().length) {
      const M = Mt.length;
      y = `Queued ${M === 1 ? "this song" : M + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Sn();
  }
  async function Sn() {
    if (!xn) {
      xn = !0;
      try {
        for (; Mt.length; ) {
          for (; Mt.length && t.now() - Mt[0].at > ti; ) Mt.shift();
          if (!Mt.length || Sr() || await X(Mt[0]) === "wait") return;
          Mt.shift();
        }
      } finally {
        xn = !1, t.changed();
      }
    }
  }
  async function X(x) {
    u = !0;
    try {
      await st();
      const M = Zt();
      if (M === "loading") return "wait";
      if (M !== "ready" || !W() || !(i != null && i.session) || i.session.playsLeft < 1 || !tt) return "done";
      if (nt().length) return "wait";
      R || (await t.chain.verify(), R = !0);
      const Y = i.address, { balance: at, nonce: G } = await t.chain.account(Y);
      o = at, a = t.now();
      const kt = await t.chain.owner(ec, x.song);
      if (kt === Y || kt === t.main()) return "done";
      const mt = await s.request("listening.signPlay", {
        core: ec,
        song: x.song,
        receipt: x.id,
        fee: C().toString(),
        nonce: G.toString(),
        balance: at.toString()
      }), Ht = {
        id: x.id,
        address: Y,
        kind: "play",
        core: ec,
        song: x.song,
        recipient: kt,
        amount: "50",
        fee: C().toString(),
        nonce: G.toString(),
        created: t.now(),
        status: "signed",
        raw: mt.raw,
        txid: mt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      t.validate(Ht), U(Ht);
      const En = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`;
      try {
        await t.chain.broadcast(mt.raw, mt.txid), U({ ...Ht, status: "pending" }), y = `♪ Paid ${En}`, w = "";
      } catch (ge) {
        U({ ...Ht, status: ys(ge) ? "failed" : "unknown", note: ge.message, ...ys(ge) ? { raw: void 0 } : {} }), w = ge.message;
      }
      return i = await se(s), "done";
    } catch (M) {
      return y = "This song played free: " + (M instanceof Error ? M.message : "payment unavailable"), "done";
    } finally {
      u = !1, t.changed();
    }
  }
  function rt(x) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Zt()) || yt("like") ? !1 : (Le(x), !0);
  }
  async function Le(x) {
    const M = x.title ? `“${x.title}”` : `song #${x.song}`, Y = (ke) => {
      var en;
      w = ke, y = "";
      try {
        (en = t.likeFailed) == null || en.call(t, x.song);
      } catch {
      }
      t.changed();
    }, at = Zt(), G = t.main(), kt = Ut() ? i == null ? void 0 : i.address : G;
    if (at === "locked") {
      g = { ...x, at: t.now() }, E(`Unlock to like ${M}. It sends straight after.`);
      return;
    }
    if (at === "wrong-wallet") return Y(wt());
    if (at === "link") return Y("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Ut() && yt("standalone")) return Y("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (at === "fund") return Y("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (at === "over") return Y("Return the excess first: the listening wallet holds more than 1 STX.");
    if (at !== "ready" || !kt) return Y("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return Y("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!tt) return Y("Pay-per-play is running in another tab. Like from that tab.");
    const mt = L().find((ke) => ke.kind === "like" && ke.song === x.song);
    if (mt && Vd.includes(mt.status))
      return Y(`Your last like for ${M} is still on its way. It can change again once it confirms.`);
    if (d) return Y("One like at a time: your last one is still being sent.");
    if ((mt == null ? void 0 : mt.status) === "confirmed" && t.now() - (mt.confirmedAt ?? 0) < g5)
      return Y(`Your like for ${M} has only just confirmed. Try again in a moment.`);
    let Ht;
    l = !0;
    try {
      Ht = t.likeState ? (await t.likeState(kt, x.song)).by : x.likedBy ?? [];
    } catch {
      Ht = x.likedBy;
    } finally {
      l = !1;
    }
    if (!Ht) return Y(`Could not check ${M} right now. Try the heart again.`);
    const En = i.address, An = ((mt == null ? void 0 : mt.status) === "confirmed" && typeof mt.liked == "boolean" && t.now() - (mt.confirmedAt ?? mt.created) < 5 * 6e4 ? mt.liked : void 0) ?? Ht.includes(En);
    if (!An && Ht.some((ke) => ke !== En)) return Y(Ut() ? `${M} was liked from another wallet of yours. Unlike it there.` : `${M} was liked from your main wallet${Ht.includes(G) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await va({ song: x.song, liked: !An, title: x.title, artist: x.artist });
  }
  async function va(x) {
    var at, G, kt;
    if (d) {
      E("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const M = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`, Y = t.wait ?? ((mt) => new Promise((Ht) => setTimeout(Ht, mt)));
    try {
      E(`${x.liked ? "Liking" : "Unliking"} ${M}…`);
      const mt = t.now() + 12e4;
      for (; u || nt().length; ) {
        if (t.now() > mt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await Y(5e3), await st(!0);
      }
      if (Zt() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const Ht = i.address, { balance: En, nonce: ge } = await t.chain.account(Ht);
      o = En, a = t.now();
      const An = await s.request("listening.signLike", {
        song: x.song,
        liked: x.liked,
        fee: Gd.toString(),
        nonce: ge.toString(),
        balance: En.toString()
      }), ke = {
        id: qd(),
        address: Ht,
        kind: "like",
        core: 0,
        song: x.song,
        liked: x.liked,
        recipient: "",
        amount: "0",
        fee: Gd.toString(),
        nonce: ge.toString(),
        created: t.now(),
        status: "signed",
        raw: An.raw,
        txid: An.txid,
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      t.validate(ke), U(ke);
      try {
        await t.chain.broadcast(An.raw, An.txid), U({ ...ke, status: "pending" }), y = `${x.liked ? "♥ Liked" : "Unliked"} ${M}`, w = "";
        try {
          (at = t.likeSent) == null || at.call(t, x.song, x.liked);
        } catch {
        }
      } catch (en) {
        if (U({ ...ke, status: ys(en) ? "failed" : "unknown", note: en.message, ...ys(en) ? { raw: void 0 } : {} }), w = en.message, ys(en)) try {
          (G = t.likeFailed) == null || G.call(t, x.song);
        } catch {
        }
      }
      i = await se(s);
    } catch (mt) {
      w = "Like not sent: " + (mt instanceof Error ? mt.message : "the listening wallet is unavailable");
      try {
        (kt = t.likeFailed) == null || kt.call(t, x.song);
      } catch {
      }
    } finally {
      d = !1, t.changed(), Sn();
    }
  }
  return { snapshot: f, refresh: st, onListened: us, heart: rt, toggleLike: Le, ...On };
}
const Mg = ["Connect", "Passkey", "Link & fund", "Listen"], _g = ["Passkey", "Add 1 STX", "Listen"], cl = (t) => t ? _g : Mg;
function w5(t) {
  if (t.solo) return b5(t);
  const e = Mg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function b5(t) {
  const e = _g.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function m5(t, e) {
  return !e || e.at >= cl(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const x5 = 100000n, S5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function E5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Xo(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= x5).sort(S5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const go = 50;
function Wd(t) {
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
async function A5(t, e, n = 4) {
  if (!Xo(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${go}&offset=${o}`, s = Wd(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - go);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= go ? s : Wd(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = E5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - go);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const $5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function v5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !$5(r.id)));
}
const I5 = {}, L5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, k5 = (t) => {
  const e = I5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, C5 = (t) => `/hiro/${t}`, B5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, T5 = (t) => {
  const e = k5(t);
  if (e)
    return [B5(e)];
  const n = L5[t];
  return typeof window < "u" ? [`${window.location.origin}${C5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, M5 = {}, Xd = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, _5 = "xtrata.log.enabled", N5 = "xtrata.log.level", U5 = "xtrata.log.tags", H5 = "xtrata.log.dedupe", yo = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, P5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, O5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, D5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, F5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, j5 = () => {
  const t = M5 ?? {}, e = yo(_5) ?? t.VITE_LOG_ENABLED, n = yo(N5) ?? t.VITE_LOG_LEVEL, r = yo(U5) ?? t.VITE_LOG_TAGS, s = yo(H5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: P5(e),
    level: O5(n) ?? "warn",
    tags: F5(r),
    dedupe: D5(s)
  };
}, z5 = (t, e, n) => !t.enabled || Xd[n] < Xd[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), R5 = (t, e, n, r) => {
  const s = j5();
  if (!z5(s, e, t) || K5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, G5 = /* @__PURE__ */ new Set();
let Yd = null;
const K5 = (t, e, n, r, s) => (Yd !== t && (G5.clear(), Yd = t), !1), V5 = (t, e, n) => R5("debug", t, e, n), q5 = {}, W5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, X5 = (t) => {
  const e = q5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : W5[t];
}, Y5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Z5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return Y5.test(n) ? n : null;
}, Q5 = (t) => t.replace(/\/+$/, ""), J5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Zd = (t) => {
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
}, ws = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, t$ = (t) => {
  var c, u;
  let e;
  try {
    e = Bn(r6(t));
  } catch {
    return null;
  }
  const n = ws(e);
  if (!n || n.success === !1)
    return null;
  const r = ws(n.value), s = ws(r == null ? void 0 : r.value), i = ws(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Zd((c = ws(i.name)) == null ? void 0 : c.value), a = Zd((u = ws(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : Z5(`${o}.${a}`);
}, e$ = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Q5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [hg(Yp(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : t$(i.result);
}, n$ = async (t) => {
  const e = t.address.trim();
  if (!Is(e))
    return null;
  const n = X5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of T5(t.network))
    try {
      return await e$({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return V5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: J5(r)
  }), null;
};
function r$(t, e, n = {}) {
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
const Qd = Object.freeze({
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
function s$(t, e = "") {
  return Object.hasOwn(Qd, String(t)) ? Qd[String(t)] : e;
}
const Jd = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function i$(t, e = "") {
  return Object.hasOwn(Jd, String(t)) ? Jd[String(t)] : e;
}
const o$ = 100000n, a$ = 1000000n, c$ = 3000n, l$ = (t, e) => `${t}#gift=${e}`, u$ = 100, th = (t, e = $a) => t <= Ks ? 0 : Number((t - Ks) / Vs(e)), eh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), f$ = "xtrata.xyz/radio/gifts", d$ = "Create Xtrata radio gift links paid from the gift treasury", h$ = (t) => ({
  domain: $i({ name: Ye(f$), version: Ye("1"), "chain-id": hr(1) }),
  message: $i({
    purpose: Ye(d$),
    admin: Ye(t.admin),
    count: hr(t.count),
    amount: hr(BigInt(t.amount)),
    label: Ye(t.label),
    issued: hr(t.issued)
  })
}), nh = 1800, nc = /* @__PURE__ */ new Map();
async function Ng(t) {
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
async function p$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await Ng(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function Ug(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = nc.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      nc.set(t, { ...a, until: Date.now() + nh });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        nc.delete(t), s();
      }, nh + 50);
    }
  }, i;
}
const gi = (t, e, n, r, s) => Ug(t, e, async () => await Ng(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), $r = "xtrata.radio.gift.incoming.v1", rh = (t) => "xtrata.radio.gift.mine.v1:" + t, xt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, bs = (t, e, n = "") => {
  const r = xt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, ms = (t) => kn(t).replace(/\.?0+$/, "");
function g$(t) {
  let e = null;
  const n = (() => {
    try {
      const L = new URL(location.href), U = new URLSearchParams(L.hash.slice(1)).get("gift") ?? L.searchParams.get("gift");
      return U !== null && (L.searchParams.delete("gift"), history.replaceState(null, "", L.pathname + (L.search || ""))), eh(U) ? U : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const L = JSON.parse(t.store.get($r) || "null");
      return eh(L == null ? void 0 : L.code) ? L.code : null;
    } catch {
      return null;
    }
  })(), s = n ?? r;
  s && (e = { code: s }, t.store.set($r, JSON.stringify({ code: s, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (L) => {
    const U = await L.json().catch(() => ({}));
    if (!L.ok)
      throw L.status === 404 && t.store.set($r, null), new Error((U == null ? void 0 : U.error) || "Could not check your gift right now. Reload to try again.");
    const W = U;
    e = { ...e, view: W }, ["claimed", "expired", "refunding", "refunded"].includes(W.status) && t.store.set($r, null), t.changed();
  }).catch((L) => {
    e = { ...e, error: L.message }, t.changed();
  }));
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = () => {
    e = null, t.store.set($r, null), t.changed();
  }, a = (L) => L.from ? t.who(L.from) : L.label ? `Xtrata Radio · ${L.label}` : "Xtrata Radio";
  let c = {};
  const u = (L) => {
    if (c.box) return c.box;
    const U = xt("div", "", "ppp-gift-check");
    c.box = U;
    const W = () => {
      const et = window.turnstile;
      !et || c.rendered || (c.rendered = !0, et.render(U, { sitekey: L, callback: (nt) => {
        c.token = nt, t.changed();
      }, "expired-callback": () => {
        c.token = void 0;
      } }));
    };
    if (window.turnstile) W();
    else {
      const et = document.createElement("script");
      et.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", et.async = !0, et.onload = W, document.head.append(et);
    }
    return U;
  };
  let d;
  async function l(L) {
    var U, W;
    if (!(!e || e.claiming || !L.listening)) {
      e.claiming = !0, e.error = void 0, t.changed();
      try {
        const et = await fetch("/radio/gift/claim", {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(3e4),
          body: JSON.stringify({ code: e.code, wallet: L.listening, turnstile: c.token })
        }), nt = await et.json().catch(() => ({}));
        if (et.status === 503 && /sending another gift/.test((nt == null ? void 0 : nt.error) || "")) {
          e.waiting = !0, clearTimeout(d), d = setTimeout(() => {
            e && (e.waiting = !1, t.changed());
          }, 12e3);
          return;
        }
        if (!et.ok)
          throw (et.status === 404 || et.status === 410 || et.status === 409 && /already had a gift|brand-new/.test((nt == null ? void 0 : nt.error) || "")) && t.store.set($r, null), new Error((nt == null ? void 0 : nt.error) || `Could not claim the gift (${et.status}).`);
        e.done = !0, t.store.set($r, null), t.giftSent(nt.txid, BigInt(nt.amount));
      } catch (et) {
        e.error = et.message, c.token = void 0;
        try {
          (W = (U = window.turnstile) == null ? void 0 : U.reset) == null || W.call(U, c.box);
        } catch {
        }
      } finally {
        e.claiming = !1, t.changed();
      }
    }
  }
  let g = null;
  function h(L) {
    if (!L.listening || !L.depositPending || L.step !== "fund")
      return g = null, [];
    if (!g || g.wallet !== L.listening || t.now() - g.at > 3e4) {
      const U = L.listening;
      g = { ...(g == null ? void 0 : g.wallet) === U ? g : {}, wallet: U, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(U)).then((W) => {
        var et, nt;
        (g == null ? void 0 : g.wallet) === U && (g.state = (et = W == null ? void 0 : W.gift) == null ? void 0 : et.state, g.problem = ((nt = W == null ? void 0 : W.gift) == null ? void 0 : nt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    return g.state === "sending" && g.problem ? [xt("p", `🎁 Your gift is waiting to go out (${g.problem}). It is retried automatically.`, "ppp-warn")] : [];
  }
  function y(L) {
    var Ut, ae;
    const U = h(L);
    if (!e || ["off", "elsewhere"].includes(L.step)) return U;
    const W = e.view;
    if (e.error && !W) return [xt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!W) return [xt("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return U;
    if (W.status === "claimed" || W.status === "claiming") return [xt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(W.status)) return [xt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (W.status === "pending-deposit") return [xt("p", `🎁 ${a(W)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (!!L.listening && (!(L.createdHere || L.brandNew) || !!L.linked || !!L.creditedTo || (L.balance ?? 0n) > 0n || L.entries.length > 0))
      return [xt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), bs("Forget this gift link here", o, "quiet")];
    const nt = BigInt(W.amount), Nt = [xt("p", `🎁 ${a(W)} sent you ${ms(nt)} STX of on-chain music: about ${th(nt).toLocaleString()} paid plays.`, "ppp-gift")], Pe = !!L.listening && (L.createdHere || L.brandNew) && !L.linked && !L.creditedTo && L.step === "fund" && (L.balance ?? 1n) === 0n && !L.depositPending && !L.entries.length, Oe = (ae = (Ut = L.gate) == null ? void 0 : Ut.gifts) == null ? void 0 : ae.turnstileSiteKey;
    return Pe ? (Oe && !c.token ? Nt.push(xt("p", "One quick check and it is yours:", "ppp-mute"), u(Oe)) : !e.claiming && !e.error && !e.waiting && l(L), (e.claiming || e.waiting) && Nt.push(xt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && Nt.push(xt("p", e.error, "ppp-bad"), bs("Try again", () => {
      e.error = void 0, l(L);
    }))) : L.step === "intro" ? Nt.push(xt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : L.listening && L.linked ? Nt.push(xt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), bs("Forget this gift link here", o, "quiet")) : L.listening && (L.balance ?? 0n) > 0n && Nt.push(xt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), bs("Forget this gift link here", o, "quiet")), Nt;
  }
  async function w(L, U, W) {
    var et;
    try {
      const nt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(L));
      if ((et = nt == null ? void 0 : nt.gift) != null && et.returnTo) return { ok: !0, funder: nt.gift.returnTo, txId: nt.gift.txid ?? void 0, amount: nt.gift.amount, distinct: 1 };
    } catch {
      if (W) return { ok: !1 };
    }
    return U();
  }
  const v = xt("div", "", "ppp-gift-fold");
  let N = 250000n, _ = "", b = "", k = null;
  const $ = (L) => {
    try {
      const U = JSON.parse(t.store.get(rh(L)) || "[]");
      return Array.isArray(U) ? U : [];
    } catch {
      return [];
    }
  }, O = (L, U) => t.store.set(rh(L), JSON.stringify(U.slice(0, 50)));
  let q = 0;
  async function H(L) {
    const U = $(L);
    for (const W of U)
      if (!(W.view && ["claimed", "refunded", "expired"].includes(W.view.status)))
        try {
          W.view = !W.view || W.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: W.id, ...W.txid ? { txid: W.txid } : {} }) }) : await t.json("/radio/gift?id=" + W.id), W.error = void 0;
        } catch (et) {
          W.error = et.message;
        }
    O(L, U), t.changed();
  }
  async function K(L) {
    if (_) return;
    _ = "Starting your gift…", b = "", t.changed();
    let U = null;
    try {
      U = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: L, amount: N.toString() }) });
      const W = $(L);
      W.unshift({ id: U.id, code: U.code, amount: N.toString(), at: t.now() }), O(L, W), _ = "Approve the gift in your wallet…", t.changed();
      const et = await t.pay(L, U.depositTo, BigInt(U.deposit), U.memo), nt = $(L), Yt = nt.find((Nt) => Nt.id === U.id);
      Yt && (Yt.txid = et, Yt.view = { status: "pending-deposit", amount: N.toString(), source: "friend", from: L, label: "", expires: 0 }), O(L, nt), b = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", H(L);
    } catch (W) {
      b = W.message || "Not sent.";
    } finally {
      _ = "", t.changed();
    }
  }
  async function m(L, U, W, et) {
    if (!_) {
      _ = "Sign in your wallet…", b = "", k = null, t.changed();
      try {
        const nt = { admin: L, count: U, amount: W.toString(), label: et, issued: t.now() }, Yt = await t.sign(L, h$(nt));
        _ = "Making links…", t.changed();
        const Nt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: nt, signature: Yt }) });
        k = { codes: Nt.codes, amount: Nt.amount };
      } catch (nt) {
        b = nt.message || "Not made.";
      } finally {
        _ = "", t.changed();
      }
    }
  }
  const I = (L, U) => l$(L || location.origin + "/radio.html", U), D = (L) => p$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: L }), R = xt("input");
  R.type = "range", R.min = String(o$), R.max = String(a$), R.step = "50000", R.value = String(N), R.setAttribute("aria-label", "Gift amount");
  const tt = xt("p", "", "ppp-gift-amount"), F = bs("", () => {
    const L = t.main();
    L && K(L);
  }, "primary"), re = () => {
    tt.textContent = ue(), F.textContent = `Gift ${ms(N)} STX`;
  };
  R.oninput = () => {
    N = BigInt(R.value), re();
  };
  const ue = () => `${ms(N)} STX · about ${th(N).toLocaleString()} paid plays · you pay ${ms(N + c$)} STX with the network fee`;
  re();
  const Xt = xt("input");
  Xt.type = "number", Xt.min = "1", Xt.max = String(u$), Xt.value = "10", Xt.setAttribute("aria-label", "How many links");
  const S = xt("input");
  S.type = "number", S.min = "0.1", S.max = "1", S.step = "0.05", S.value = "0.1", S.setAttribute("aria-label", "STX per link");
  const C = xt("input");
  C.maxLength = 40, C.placeholder = "Label, e.g. Launch week", C.setAttribute("aria-label", "Campaign label");
  function yt(L) {
    var nt, Yt, Nt, Pe, Oe;
    const U = (nt = L.gate) == null ? void 0 : nt.gifts;
    if (!(U != null && U.enabled) || ["off", "elsewhere", "unsupported"].includes(L.step)) return null;
    const W = t.main(), et = [xt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!W)
      et.push(xt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      F.disabled = !!_, et.push(R, tt, F), t.now() - q > 3e4 && (q = t.now(), H(W));
      const Ut = $(W);
      if (Ut.length) {
        const ae = xt("ul", "", "ppp-gift-list");
        for (const Ft of Ut.slice(0, 10)) {
          const Tt = (Yt = Ft.view) == null ? void 0 : Yt.status, ee = Ft.error ? Ft.error : !Tt || Tt === "pending-deposit" ? Ft.txid ? "payment confirming…" : "waiting for your payment" : Tt === "live" ? "ready to share" : Tt === "claiming" || Tt === "claimed" ? "claimed ✓" : Tt === "refunding" ? "expired · refund on its way" : Tt === "refunded" ? "expired · refunded to you" : Tt, ne = xt("li");
          if (ne.append(xt("span", `${ms(BigInt(Ft.amount))} STX`, "t"), xt("span", ee, ((Nt = Ft.view) == null ? void 0 : Nt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Pe = Ft.view) == null ? void 0 : Pe.status) === "live") {
            const Zt = I(((Oe = L.gate) == null ? void 0 : Oe.radioUrl) ?? null, Ft.code);
            ne.append(gi("gift-copy:" + Ft.id, "Copy link", () => Zt, "tiny", t.changed), Ug("gift-share:" + Ft.id, "Share", () => D(Zt), "tiny", t.changed));
          }
          ae.append(ne);
        }
        et.push(ae);
      }
      if (U.admin) {
        const ae = bs("Sign and make links", () => {
          const ee = BigInt(Math.round(Number(S.value) * 1e6));
          m(W, Number(Xt.value), ee, C.value.trim());
        }), Ft = xt("div", "", "ppp-gift-admin"), Tt = (ee, ne) => {
          const Zt = xt("label", ee);
          return Zt.append(ne), Zt;
        };
        if (Ft.append(xt("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"), Tt("Links ", Xt), Tt("STX each ", S), C, ae), k) {
          const ee = k.codes.map((Zt) => {
            var f;
            return I(((f = L.gate) == null ? void 0 : f.radioUrl) ?? null, Zt);
          }).join(`
`), ne = xt("textarea");
          ne.readOnly = !0, ne.value = ee, ne.rows = Math.min(8, k.codes.length), Ft.append(xt("p", `${k.codes.length} links, ${ms(BigInt(k.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), ne, gi("campaign-copy", "Copy all", () => ee, "tiny", t.changed));
        }
        et.push(Ft);
      }
    }
    return _ && et.push(xt("p", _, "ppp-cyan")), b && et.push(xt("p", b, /✓/.test(b) ? "ppp-ok" : "ppp-warn")), v.replaceChildren(...et), v;
  }
  return { banner: y, funder: w, renderFold: yt, liveGift: i, setAside: o, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null };
}
const y$ = [
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
function w$(t) {
  for (const [e, n] of y$) if (n.test(t)) return e;
  return null;
}
const Hg = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Pg = (t) => /Android/.test(t);
function b$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Hg(e) ? "x-safari-" + n.href : Pg(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const m$ = (t) => Hg(t) ? "Safari" : Pg(t) ? "Chrome" : "your browser", sh = document.getElementById("ppp");
sh && x$(sh);
function x$(t) {
  var Zt;
  const e = qy(), n = (f) => t.querySelector(f), r = n(".ppp-frame");
  let s = null;
  const i = async (f, E) => {
    const B = await fetch(f, { cache: "no-store", ...E, signal: AbortSignal.timeout(15e3) }), V = await B.json().catch(() => ({}));
    if (!B.ok) throw new Error((V == null ? void 0 : V.error) || `Request failed (${B.status}).`);
    return V;
  }, o = y5({
    now: Date.now,
    main: () => {
      const f = e.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    config: (f) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(f || "")),
    links: async (f) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(f))).links ?? [],
    mainOf: async (f) => {
      var B;
      const E = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(f))).links;
      return ((B = E == null ? void 0 : E.find((V) => V.listening === f)) == null ? void 0 : B.main) ?? null;
    },
    saveLink: async (f) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
    },
    bridge: async (f) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${f}; publickey-credentials-create ${f}`), s.referrerPolicy = "no-referrer";
      const E = new Promise((wt, jt) => {
        s.addEventListener("load", () => wt(), { once: !0 }), setTimeout(() => jt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = f + "/", r.replaceChildren(s), await E;
      const B = new Oy({ walletOrigin: f, frame: s, timeoutMs: 30 * 6e4 }), V = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ht = (wt, jt) => V.has(wt) ? B.request(wt, jt) : Promise.race([
        B.request(wt, jt),
        new Promise((Gt, se) => setTimeout(() => se(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ht("listening.status"), { request: ht };
    },
    chain: {
      verify: s5,
      balance: o5,
      account: i5,
      owner: a5,
      broadcast: c5,
      transaction: l5,
      confirmedNonce: async (f) => {
        const E = await Qr(`/v2/accounts/${f}?proof=0`);
        if (!Number.isSafeInteger(E == null ? void 0 : E.nonce) || E.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(E.nonce);
      }
    },
    signWithMain: (f, E) => zd({ ...E, network: "mainnet", stxAddress: f }),
    deposit: (f, E, B) => new Promise((V, ht) => Pd({
      recipient: E,
      amount: B.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: f,
      network: new rc(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (wt) => V(wt.txId || ""),
      onCancel: () => ht(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ht
    })),
    validate: u5,
    tabLock: (f) => new Promise((E) => {
      const B = navigator.locks;
      if (!(B != null && B.request)) {
        E(!0);
        return;
      }
      B.request("xtrata-ppp:" + f, { ifAvailable: !0 }, async (V) => {
        E(!!V), V && await new Promise(() => {
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
    changed: () => Tt(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var E, B;
      return a.funder(f, () => A5(f, Qr), !!((B = (E = o.snapshot().gate) == null ? void 0 : E.gifts) != null && B.enabled));
    },
    likesChanged: () => {
      var f, E;
      (E = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || E.call(f);
    },
    likeState: async (f, E) => {
      const B = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: f, ids: String(E) })), V = Array.isArray(B == null ? void 0 : B.rows) ? B.rows.find((ht) => (ht == null ? void 0 : ht.id) === E) : null;
      if (!V || typeof V.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: V.liked, by: Array.isArray(V.by) ? V.by.filter((ht) => typeof ht == "string") : V.liked ? [f] : [] };
    },
    likeSent: (f, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: f, liked: E } })),
    nameOf: (f) => $(f) ?? void 0,
    likeConfirmed: (f, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: E } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), a = g$({
    json: i,
    main: () => {
      const f = e.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, E, B, V) => new Promise((ht, wt) => Pd({
      recipient: E,
      amount: B.toString(),
      memo: V,
      stxAddress: f,
      network: new rc(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (jt) => ht(jt.txId || ""),
      onCancel: () => wt(new Error("Gift cancelled. Nothing was sent.")),
      onError: wt
    })),
    sign: (f, E) => zd({ ...E, network: "mainnet", stxAddress: f }),
    giftSent: (f, E) => o.giftSent(f, E),
    who: (f) => H(f),
    changed: () => Tt(o.snapshot()),
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
    R();
    const E = tt(f.song, { title: f.title, artist: f.artist });
    return o.heart({ song: f.song, title: E.title || void 0, artist: E.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let c;
  window.XtrataRadioListeningIdentity = () => {
    const f = o.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const u = (f) => {
    var B, V;
    const E = window.XtrataRadioListeningIdentity();
    E !== c && (c = E, (V = (B = window.XtrataRadio) == null ? void 0 : B.refreshLikes) == null || V.call(B));
  }, d = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", l = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), g = (f) => {
    const E = Math.round((Date.now() - f) / 6e4);
    return E < 1 ? "now" : E < 60 ? `${E}m` : E < 1440 ? `${Math.round(E / 60)}h` : `${Math.round(E / 1440)}d`;
  }, h = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, y = (f, E = "", B = "") => {
    const V = document.createElement(f);
    return E && (V.textContent = E), B && (V.className = B), V;
  }, w = (f, E, B = "") => {
    const V = y("button", f, B);
    return V.type = "button", V.onclick = E, V;
  }, v = (f, E) => {
    const B = y("a", f);
    return B.href = E, B.target = "_blank", B.rel = "noopener", B;
  };
  let N = null, _ = location.hash === "#give";
  _ && history.replaceState(null, "", location.pathname + location.search);
  let b = !1;
  const k = r$((f) => n$({ address: f, network: "mainnet" }), () => Tt(o.snapshot())), $ = (f) => k.get(f), O = w$(navigator.userAgent), q = (f, E) => {
    const B = navigator.userAgent, V = m$(B), ht = `${location.origin}${location.pathname}${E ? `#gift=${E}` : ""}`, wt = [y("p", `You are in ${f}'s built-in browser, where passkeys often do not work. Open this page in ${V} to make your listening wallet${E ? " and claim your gift" : ""}.`, "ppp-warn")], jt = y("div", "", "ppp-open-row"), Gt = b$(ht, B);
    if (Gt) {
      const se = y("a", `Open in ${V}`, "primary ppp-open-in");
      se.href = Gt, se.dataset.homeAction = "radio:open-in-browser", jt.append(se);
    }
    return jt.append(gi("copy-page-link", "Copy link", () => ht, Gt ? "" : "primary", () => Tt(o.snapshot()))), wt.push(jt, y("p", `If that does not open ${V}, use ${f}'s menu (••• or ⋮) and choose "Open in ${V === "your browser" ? "browser" : V}", or paste the copied link there.`, "ppp-mute")), wt;
  }, H = (f) => $(f) ?? d(f), K = (f) => f.slice(0, 2).map(H).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), m = /* @__PURE__ */ new Map();
  let I = !1;
  const D = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), R = () => {
    I || (I = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const E of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const B = Number(E == null ? void 0 : E.id);
        Number.isSafeInteger(B) && m.set(B, { title: typeof E.title == "string" ? E.title : void 0, artist: typeof E.artist == "string" ? E.artist : void 0 });
      }
      Tt(o.snapshot());
    }).catch(() => {
      I = !1;
    }));
  }, tt = (f, E) => {
    const B = m.get(f), V = i$(f, [B == null ? void 0 : B.title, E == null ? void 0 : E.title].find((wt) => !D(wt)) || ""), ht = s$(f, (B == null ? void 0 : B.artist) || (E == null ? void 0 : E.artist) || "");
    return { title: V, artist: ht };
  }, F = (f) => {
    const { title: E, artist: B } = tt(f.song, f);
    return E ? `“${E}”${B ? ` — ${B}` : ""}` : `Song #${f.song}${B ? ` — ${B}` : ""}`;
  }, re = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, ue = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Xt(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["OVER 1 STX", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function S(f, E, B = "", V) {
    const ht = y("dt", f), wt = y("dd", E, B);
    return V && wt.append(" ", V), [ht, wt];
  }
  const C = document.getElementById("ppp-top"), yt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, ot = () => {
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
    f.step === "locked" && !f.armed && !f.busy && o.unlock(), f.step === "ready" && !f.payingOn && !f.busy && o.switchOn(), yt();
  };
  C && (C.onclick = ot);
  function L(f) {
    if (!C) return;
    const E = (V, ht, wt) => {
      C.hidden = !1, C.className = "ppp-top" + (ht ? " is-" + ht : ""), C.replaceChildren(y("span", "", "dot"), document.createTextNode(V)), C.title = wt;
    }, B = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0;
    switch (f.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        C.hidden = !0;
        return;
      case "elsewhere":
        return E("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        C.hidden = !0;
        return;
      case "intro":
        return E("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return E(`Connect ${H(f.linked)}`, "warn", `This device's listening wallet belongs to ${H(f.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return E(f.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return E("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return f.depositPending ? E("Funds on their way", "quiet", "Paying starts by itself when they land") : E(f.entries.some((V) => V.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return E("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return E("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return f.payingOn && B > 0 ? E(`On · ${B.toLocaleString()} plays left`, "on", "Paying artists as you listen") : E("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const U = document.getElementById("pppNudge"), W = document.getElementById("onair");
  (Zt = U == null ? void 0 : U.querySelector("button")) == null || Zt.addEventListener("click", () => ot());
  const et = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, nt = {
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
  function Yt(f) {
    var wt;
    if (f.step === "loading") return;
    const E = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, B = f.step === "ready" && f.payingOn && E > 0, V = B ? "" : et[f.step] ?? "", ht = B ? "on" : V ? "off" : "";
    if (ht ? document.documentElement.dataset.ppp = ht : delete document.documentElement.dataset.ppp, W && (W.hidden = !ht, W.querySelector(".onair-sub").textContent = B ? `Paying artists · ${E.toLocaleString()} plays left` : "Not paying"), U && (U.hidden = ht !== "off" || f.step === "fund" && f.depositPending, ht === "off")) {
      const jt = Math.floor(Number(1000000n / Vs(BigInt(((wt = f.gate) == null ? void 0 : wt.limits.playFee) ?? "300"))));
      U.querySelector(".nudge-t").textContent = "⚠ " + V, U.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${jt.toLocaleString()} plays, on-chain, straight to the artists.`, U.querySelector("button").textContent = nt[f.step] ?? "Start paying";
    }
  }
  let Nt = "";
  function Pe(f) {
    const E = y("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && E.append(y("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && E.append(y("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const B = y("input");
    B.type = "text", B.placeholder = "SP… address to send returns to", B.autocomplete = "off", B.spellcheck = !1, B.setAttribute("aria-label", "Address to return funds to"), B.value = Nt, B.oninput = () => {
      Nt = B.value;
    };
    const V = w(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(B.value), Nt = "";
    }, "tiny");
    return E.append(B, " ", V), f.returnToKind === "chosen" && E.append(" ", w("Back to the funder", () => o.clearReturnAddress(), "tiny")), E;
  }
  const Oe = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Ut() {
    const f = y("p", Oe + " ", "ppp-mute");
    return f.append(v("Xverse", "https://www.xverse.app/download"), " · ", v("Leather", "https://leather.io/install-extension")), f;
  }
  let ae = "";
  const Ft = (f) => {
    const E = document.documentElement, B = f.solo && !f.main ? f.listening ? d(f.listening) : "new" : "", V = v5() ? "1" : "";
    `${B}|${V}` !== ae && (ae = `${B}|${V}`, B ? E.dataset.pppSolo = B : delete E.dataset.pppSolo, V ? E.dataset.pppWalletInstalled = V : delete E.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => Tt(o.snapshot()), f);
  function Tt(f) {
    var Sr, Dn, us, Sn;
    if (u(), Ft(f), L(f), Yt(f), t.hidden = f.step === "off", t.hidden) return;
    const [E, B] = Xt(f), V = n(".ppp-state");
    V.textContent = E, V.className = "ppp-state" + (B ? " ppp-state--" + B : ""), V.hidden = !E;
    const ht = !!f.busy || f.armed, wt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (ht || !["intro", "loading"].includes(f.step));
    r.hidden = !wt, r.classList.toggle("ppp-frame--rest", !ht && !b);
    const jt = n(".ppp-frame-label");
    jt.hidden = !0;
    const Gt = w5(f) ?? N;
    N = Gt;
    const se = m5(f, Gt);
    n(".ppp-badge").hidden = !se;
    const Hn = n(".ppp-steps"), Pn = n(".ppp-stage");
    Hn.hidden = Pn.hidden = !se, Gt && se && (Hn.replaceChildren(...cl(f.solo).map((X, rt) => {
      const Le = y("li", "", rt < Gt.at ? "done" : rt === Gt.at ? Gt.blocked ? "now blocked" : "now" : "");
      return Le.append(y("span", rt < Gt.at ? "✓" : String(rt + 1), "n"), X), rt === Gt.at && Le.setAttribute("aria-current", "step"), Le;
    })), Pn.textContent = Gt.caption, Pn.className = "ppp-stage " + (Gt.at >= cl(f.solo).length ? "ppp-ok" : Gt.blocked ? "ppp-bad" : "ppp-cyan"));
    const xr = n(".ppp-facts"), he = [];
    f.main && ((Sr = f.gate) != null && Sr.here) && !f.solo && he.push(...S("Your wallet", H(f.main), "ppp-addr-short"));
    const ls = () => {
      if (!f.listening) return;
      const X = gi("copy-listening", "Copy", () => f.listening || "", "tiny", () => Tt(o.snapshot()));
      he.push(...S(f.linked ? "Listening wallet (technical)" : "Listening wallet", d(f.listening), "ppp-addr-short", X));
    };
    if (f.linked || ls(), f.listening && f.step !== "intro")
      if (f.linked)
        he.push(...S("Credited to", `${H(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), ls();
      else if (f.solo) {
        f.creditedTo && he.push(...S("Credited to", `${H(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const X = f.returnTo ? `${H(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        he.push(...S("Returns go to", f.returnTo && !$(f.returnTo) ? X.replace(d(f.returnTo), f.returnTo) : X, f.returnTo ? "ppp-addr-full" : "ppp-mute"));
      } else he.push(...S("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Dn = f.gate) != null && Dn.here)) {
      const X = f.linkedListening.map((rt) => d(rt) + (rt === f.listening ? " (this one)" : "")).join(", ");
      he.push(...S(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", X, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const X = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      he.push(...S("Balance", `${kn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, X));
    }
    const bn = f.entries.find((X) => X.kind === "play");
    bn && R(), bn && he.push(...S("Last paid song", `${F(bn)} → ${H(bn.recipient)}`, re[bn.status] || "")), xr.replaceChildren(...he), xr.hidden = !he.length;
    const st = [], vt = [], Kt = [], pe = [], Ie = Vs(BigInt(((us = f.gate) == null ? void 0 : us.limits.playFee) ?? "300")), mn = `Each song you listen to for 30 seconds sends ${kn(il)} STX to whoever holds it, plus a ${kn(Ie - il)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, On = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (st.push(y("p", "Pay artists as you listen.")), (Sn = f.gate) != null && Sn.radioUrl) {
          const rt = y("p");
          rt.append(v("Open the pay-per-play radio →", f.gate.radioUrl)), st.push(rt);
        }
        vt.push(y("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const rt = [f.linked, ...f.others];
          st.push(y("p", rt.length > 1 ? `This device has listening wallets for ${K(rt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${H(f.linked)}. Connect that wallet to keep paying artists.`)), vt.push(y("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          st.push(y("p", "Connect your wallet to pay artists as you listen.")), vt.push(y("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        st.push(y("p", `This device's listening wallet belongs to ${H(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), vt.push(y("p", `You are connected as ${H(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), vt.push(y("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Kt.push(w("Switch wallet", () => {
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
        st.push(y("p", `Pay artists ${kn(Ie)} STX a song as you listen.`)), vt.push(y("p", mn)), vt.push(y("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), vt.push(y("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (st.push(y("p", `This device already has a listening wallet for ${K(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), vt.push(y("p", `Otherwise, set up a new listening wallet for ${H(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && vt.push(y("p", `This is the listening wallet for ${H(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && vt.push(y("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const X = a.liveGift();
        Kt.push(w(X ? "Claim my gift · no wallet needed" : f.solo ? "Turn on pay-per-play · no wallet needed" : f.others.length && f.main ? `Set up for ${H(f.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !X && !f.solo && f.main && f.others.length && Kt.push(w("Switch wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        })), !X && f.solo && Kt.push(w("I have a Stacks wallet", () => {
          var rt;
          return (rt = document.getElementById("radio-wallet-connect")) == null ? void 0 : rt.click();
        })), Kt.push(w("I already have a listening wallet", () => void o.unlock(!0))), X && Kt.push(w("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (st.push(y("p", "Locked.", "ppp-mute")), Kt.push(w(f.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), pe.push(w("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        st.push(y("p", `Link to ${H(f.main)} · free`)), vt.push(y("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), vt.push(y("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Kt.push(w(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        st.push(y("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending || (f.entries.length ? st.push(y("p", "Out of funds · top up to keep paying", "ppp-bad")) : st.push(y("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / Ie)).toLocaleString()} songs`))), f.entries.length && vt.push(y("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && vt.push(y("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), f.solo ? (vt.push(y("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), vt.push(y("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Kt.push(gi("copy-address", "Copy my address", () => f.listening || "", "primary", () => Tt(o.snapshot())))) : vt.push(y("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const rt = y("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          rt.append(v("View", h(f.depositTxid))), st.push(rt);
        } else f.allowance > 0n && !f.solo && Kt.push(w(`Deposit ${kn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        st.push(y("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (st.push(y("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), st.push(Pe(f))), (!f.solo || f.returnTo) && Kt.push(w("Return excess", () => void o.returnFunds("excess"), "primary"), w("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const rt = Math.min(f.session.playsLeft, f.playsLeft);
          st.push(y("p", `Paying as you listen · up to ${rt.toLocaleString()} plays left`, "ppp-ok")), vt.push(y("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Kt.push(w("Switch off", () => void o.switchOff()));
        } else
          st.push(y("p", "Paying is off. Music stays free.", "ppp-mute")), Kt.push(w("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        f.queued && st.push(y("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && st.push(y("p", "Running low · top up", "ppp-warn")), f.depositPending ? st.push(y("p", "Top-up on its way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Kt.push(w(`Top up ${kn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && vt.push(y("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && vt.push(Pe(f)), vt.push(Ut()), f.step === "ready" && f.entries.some((X) => X.kind === "play" && X.status === "confirmed"))) {
      const X = y("p", "New to Stacks? ", "ppp-mute");
      X.append(v("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), st.push(X);
    }
    if (f.walletOutdated && vt.push(y("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (st.push(y("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Kt.push(w("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && f.returnTo && (f.balance ?? 0n) > 0n && pe.push(w(f.linked ? "Return all to my wallet" : `Return all to ${H(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && pe.push(w("Lock", () => void o.lock(), "quiet")), wt && !ht && pe.push(w(b ? "Hide listening wallet box" : "Show listening wallet box", () => {
      b = !b, Tt(o.snapshot());
    }, "quiet")), [...Kt, ...pe].forEach((X) => X.disabled = On), On && (Kt.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n)) {
      const X = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", rt = st.at(0);
      f.step === "ready" && rt ? rt.append(y("span", ` · ${l(f.balance)} STX`, X)) : st.push(y("p", `Balance ${l(f.balance)} STX`, X));
    }
    st.unshift(...a.banner(f)), O && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) && st.unshift(...q(O, a.pendingCode())), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && st.unshift(y("p", `This is ${H(f.creditedTo)}'s listening wallet. Plays and likes count for ${H(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...st);
    const Mt = a.renderFold(f);
    if (n(".ppp-gifts").hidden = !Mt, Mt && !n(".ppp-gift-body").contains(Mt) && n(".ppp-gift-body").replaceChildren(Mt), Mt && _) {
      _ = !1;
      const X = n(".ppp-gifts");
      X.open = !0, requestAnimationFrame(() => X.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...vt), n(".ppp-actions").replaceChildren(...Kt), n(".ppp-actions2").replaceChildren(...pe);
    const Ke = f.busy || f.message || "";
    n(".ppp-msg").textContent = Ke && st.some((X) => (X.textContent ?? "").startsWith(Ke.replace(/[.✓\s]+$/, ""))) ? "" : Ke, n(".ppp-err").textContent = f.error;
    const ti = f.entries.filter((X) => X.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...ti.slice(0, 5).map((X) => {
      const rt = y("li"), Le = X.status === "confirmed" ? "ok" : X.status === "failed" ? "bad" : "warn";
      return rt.append(y("span", "", "d " + Le), y("span", F(X), "t"), y("span", g(X.created), "ppp-mute")), X.txid && rt.append(v("tx", h(X.txid))), rt;
    })), n(".ppp-wallets").hidden = !(xr.childElementCount || pe.length), n(".ppp-more").hidden = !vt.length;
    const xn = n(".ppp-history");
    xn.hidden = !f.entries.length, f.entries.length && R(), xn.replaceChildren(y("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((X) => {
      const rt = y("div", "", "ppp-row"), Le = X.kind === "play" ? [y("span", F(X), "ppp-song"), y("span", ` · ${kn(BigInt(X.amount))} STX to ${H(X.recipient)}`, "ppp-mute")] : X.kind === "like" ? [y("span", `${X.liked ? "♥ Liked" : "Unliked"} ${F(X)}`, "ppp-song"), y("span", ` · for ${f.linked ? H(f.linked) : "this listening wallet"}`, "ppp-mute")] : [y("span", `Returned ${kn(BigInt(X.amount))} STX`, "ppp-song"), y("span", ` to ${H(X.recipient)}`, "ppp-mute")];
      return rt.append(
        y("span", ue[X.status] || X.status, "ppp-status " + (re[X.status] || "")),
        ...Le,
        y("span", ` · ${new Date(X.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), X.txid && rt.append(v("tx ↗", h(X.txid))), rt;
    }));
  }
  const ee = /* @__PURE__ */ new Map(), ne = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((E) => {
      const B = E == null ? void 0 : E.nowPlaying;
      B && Number.isSafeInteger(Number(B.tokenId)) && ee.set(Number(B.tokenId), { title: B.title || void 0, artist: B.artist || void 0 });
    }), !0) : !1;
  };
  if (!ne()) {
    const f = setInterval(() => {
      ne() && clearInterval(f);
    }, 500);
    setTimeout(() => clearInterval(f), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (f) => {
    const E = f.detail;
    if (E && Number.isSafeInteger(E.song) && typeof E.id == "string" && /^[0-9a-f]{32}$/.test(E.id)) {
      R();
      const B = tt(E.song, ee.get(E.song));
      o.onListened({ song: E.song, id: E.id, title: B.title || void 0, artist: B.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const S$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", E$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, A$ = () => E$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, $$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, v$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Og = class {
  constructor(t) {
    bE(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Om(t), this.callback(la(t));
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
    const t = A$(), e = $$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return it("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, it("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), it("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, it("div", { class: "flex flex-col space-y-[10px]" }, it("div", { class: "flex items-center" }, it("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), it("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, it("span", { class: "sr-only" }, "Close popup"), it("img", { src: S$ }))), r ? it("p", null, "Select the wallet you want to connect to.") : it("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && it("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && it("div", { class: "mt-6" }, it("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), it("ul", { class: "space-y-3" }, this.installedProviders.map((i) => it("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, it("div", { class: "aspect-square basis-9 overflow-hidden" }, it("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), it("div", { class: "flex-1" }, it("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && it("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), it("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && it("div", { class: "mt-6" }, r ? it("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : it("div", { class: "mb-5 flex justify-between" }, it("p", { class: "text-sm font-medium" }, "Recommended wallets"), it("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, it("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, it("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), it("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), it("p", null, "What is a wallet? ", it("span", { class: "align-text-bottom text-[9px]" }, "↗")))), it("ul", { class: "space-y-3" }, n.map((i) => it("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, it("div", { class: "aspect-square basis-9 overflow-hidden" }, it("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), it("div", { class: "flex-1" }, it("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && it("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && it("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return J4(this);
  }
};
Og.style = v$;
const I$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Og
}, Symbol.toStringTag, { value: "Module" }));
